/* V40: a game's own music (snd0.at9) played by the XMB itself.
 *
 * Asking the system music player (SceneControl.setSystemBgm) for it kept giving the PS5 Home music instead. So the XMB plays it like the PS3
 * did: the ATRAC9 file is decoded with the system's own audio decoder (libSceAudiodec, codec AT9) on a thread of its own and mixed into the
 * XMB's AudioOut port next to the navigation sounds (zt_xmb_media.cpp calls zt_xmb_music_mix every 256-frame grain).
 *
 * Everything is checked: an unknown file, a decoder the firmware does not have or a decoder error ends the track and is logged
 * (PS5XMB: MUSIC_...); the HTTP request then answers non-202 and HomeUI falls back to the system music request.
 */
#include "zt_xmb_music.hpp"
#include "zt_log.hpp"
#ifndef ZT_MUSIC_HOST_TEST
#include "zt_paths.hpp"
#endif
#include <time.h>

#include <pthread.h>
#include <stdint.h>
#include <string.h>
#include <sys/stat.h>
#include <unistd.h>

#include <atomic>
#include <cstdarg>
#include <cstdio>
#include <memory>
#include <string>
#include <vector>

#ifndef ZT_MUSIC_HOST_TEST
#include "ps5/kernel.h"
extern "C" int sceKernelLoadStartModule(const char *, size_t, const void *, uint32_t, uint32_t, int *);
#else
extern "C" void *kernel_dynlib_dlsym(int, int, const char *);
extern "C" int sceKernelLoadStartModule(const char *, size_t, const void *, uint32_t, uint32_t, int *);
#endif

namespace {

/* ---- libSceAudiodec (PS4/PS5 SDK layout). Every struct starts with its own size; the sizes the firmware accepts are probed. */
struct AdAuInfo { uint32_t size; void *addr; uint32_t au_size; };
struct AdPcmItem { uint32_t size; void *addr; uint32_t pcm_size; };
struct AdCtrl { void *param; void *bsi; AdAuInfo *au; AdPcmItem *pcm; };
struct AdParamAt9 { uint32_t size; int32_t bw_pcm; uint8_t config[4]; uint8_t spare[52]; };
using AdInit = int (*)(uint32_t);
using AdCreate = int (*)(AdCtrl *, uint32_t);
using AdDecode = int (*)(int, AdCtrl *);
using AdDelete = int (*)(int);
constexpr uint32_t kAt9 = 1;

struct Track {
  std::vector<int16_t> pcm;            /* stereo 48 kHz, filled by the decoder thread */
  std::atomic<size_t> ready{0};        /* frames decoded so far */
  std::atomic<bool> done{false};       /* decoding finished (or failed) */
  std::atomic<bool> cancel{false};
  std::string file;                    /* parsed AT9 file */
  uint32_t data_off = 0, data_size = 0, block = 0, rate = 48000, channels = 2, total = 0, skip = 0;
  uint8_t config[4] = {0, 0, 0, 0};
  std::string name;
};

pthread_mutex_t g_mu = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t g_cv = PTHREAD_COND_INITIALIZER;
bool g_thread = false;
pthread_t g_decoder_thread{}, g_watcher_thread{};
std::atomic<bool> g_shutdown{false};
std::shared_ptr<Track> g_decoding;
std::shared_ptr<Track> g_pending;      /* next track for the decoder thread */
std::shared_ptr<Track> g_play;         /* the track being heard */
std::shared_ptr<Track> g_old;          /* the previous track, fading out */
size_t g_pos = 0, g_old_pos = 0;
float g_gain = 0, g_old_gain = 0, g_target = 0.6f;
std::atomic<bool> g_failed{false};
std::atomic<bool> g_active{false};
int g_logs = 0;
/* V42: the last thing that happened, in a few words, for Settings > PS5 XMB Controls > Game Music Status (no log needed) */
pthread_mutex_t g_st_mu = PTHREAD_MUTEX_INITIALIZER;
std::string g_status = "not started yet";
/* V45: everything the music player finds out is also kept in a text file: /user/data/XMB5/PS5XMB_music_status.txt
 * (newest line last; the file starts again when it passes 64 KB). Readable over FTP or in the theme editor's file list. */
#ifdef ZT_MUSIC_HOST_TEST
#define ZT_MUSIC_STATUS_FILE "/tmp/PS5XMB_music_status.txt"
#else
#define ZT_MUSIC_STATUS_FILE ZT_DIR "/PS5XMB_music_status.txt"
#endif
pthread_mutex_t g_note_mu = PTHREAD_MUTEX_INITIALIZER;
void note(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
void note(const char *fmt, ...) {
  char b[1200];
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(b, sizeof(b), fmt, ap);
  va_end(ap);
  pthread_mutex_lock(&g_note_mu);
  struct stat st;
  const bool big = stat(ZT_MUSIC_STATUS_FILE, &st) == 0 && st.st_size > 64 * 1024;
  FILE *f = fopen(ZT_MUSIC_STATUS_FILE, big ? "w" : "a");
  if (f) {
    const time_t now = time(nullptr);
    struct tm tmv;
    char ts[32] = "";
    if (gmtime_r(&now, &tmv)) strftime(ts, sizeof(ts), "%Y-%m-%d %H:%M:%S UTC", &tmv);
    fprintf(f, "%s  %s\n", ts, b);
    fclose(f);
  }
  pthread_mutex_unlock(&g_note_mu);
}
void set_status(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
void set_status(const char *fmt, ...) {
  char b[160];
  va_list ap;
  va_start(ap, fmt);
  vsnprintf(b, sizeof(b), fmt, ap);
  va_end(ap);
  pthread_mutex_lock(&g_st_mu);
  g_status = b;
  pthread_mutex_unlock(&g_st_mu);
  note("%s", b);
}

uint32_t le32(const std::string &d, size_t o) { return o + 4 <= d.size() ? (uint32_t)(uint8_t)d[o] | ((uint32_t)(uint8_t)d[o + 1] << 8) | ((uint32_t)(uint8_t)d[o + 2] << 16) | ((uint32_t)(uint8_t)d[o + 3] << 24) : 0; }
uint16_t le16(const std::string &d, size_t o) { return o + 2 <= d.size() ? (uint16_t)((uint8_t)d[o] | ((uint8_t)d[o + 1] << 8)) : 0; }

/* RIFF / WAVE with an ATRAC9 'fmt ' (WAVE_FORMAT_EXTENSIBLE + version + 4 config bytes) */
int parse_at9(Track &t) {
  const std::string &d = t.file;
  if (d.size() < 64 || d.compare(0, 4, "RIFF") != 0 || d.compare(8, 4, "WAVE") != 0) return -1;
  bool fmt = false;
  for (size_t o = 12; o + 8 <= d.size();) {
    const std::string id = d.substr(o, 4);
    const uint32_t sz = le32(d, o + 4);
    const size_t b = o + 8;
    if (b + sz > d.size() && id != "data") break;
    if (id == "fmt " && sz >= 48) {
      t.channels = le16(d, b + 2);
      t.rate = le32(d, b + 4);
      t.block = le16(d, b + 12);
      memcpy(t.config, d.data() + b + 44, 4);
      fmt = le16(d, b) == 0xFFFE && t.config[0] == 0xFE;
    } else if (id == "fact" && sz >= 8) {
      t.total = le32(d, b);
      const uint32_t s = le32(d, b + 4);
      t.skip = s < 16384 ? s : 0;
    } else if (id == "data") {
      t.data_off = (uint32_t)b;
      t.data_size = (uint32_t)std::min<size_t>(sz, d.size() - b);
      break;
    }
    o = b + sz + (sz & 1);
  }
  if (!fmt || !t.data_off || !t.data_size) return -2;
  /* ATRAC9 config: FE | rate:4 chcfg:3 v:1 | frameBytes-1:11 superframeIdx:2 ... */
  const uint32_t frame_bytes = (((uint32_t)t.config[2] << 3) | (t.config[3] >> 5)) + 1;
  const uint32_t frames = 1u << ((t.config[3] >> 3) & 3);
  if (!t.block) t.block = frame_bytes * frames;
  if (t.block < 8 || t.block > 8192 || t.channels < 1 || t.channels > 8 || t.rate < 8000 || t.rate > 192000) return -3;
  return 0;
}

uint32_t samples_per_superframe(const Track &t) {
  static const uint8_t power[16] = {6, 6, 7, 7, 7, 8, 8, 8, 6, 6, 7, 7, 7, 8, 8, 8};
  return (1u << power[t.config[1] >> 4]) * (1u << ((t.config[3] >> 3) & 3));
}

/* ---- libSceAjm (Audio Job Manager): what PS5 titles use for ATRAC9 (the PS5 has no libSceAudiodec - V40's MUSIC_DECODER_MISSING).
 * Job / instance flag layout as in the PS4/PS5 SDK; the version fields the firmware wants are probed once. */
struct AjmBatchError { int32_t error_code; int32_t pad0; const void *job_addr; uint32_t cmd_offset; uint32_t pad1; const void *job_ra; uint8_t spare[32]; };
struct AjmSbResult { int32_t result; int32_t internal; };
struct AjmSbStream { int32_t consumed; int32_t written; uint64_t total; };
using AjmInit = int (*)(int64_t, uint32_t *);
using AjmModReg = int (*)(uint32_t, uint32_t, int64_t);
using AjmInstCreate = int (*)(uint32_t, uint32_t, uint64_t, uint32_t *);
using AjmInstDestroy = int (*)(uint32_t, uint32_t);
using AjmCtlRa = void *(*)(void *, uint32_t, uint64_t, void *, size_t, void *, size_t, void *);
using AjmRunRa = void *(*)(void *, uint32_t, uint64_t, void *, size_t, void *, size_t, void *, size_t, void *);
using AjmStart = int (*)(uint32_t, uint8_t *, uint32_t, int, AjmBatchError *, uint32_t *);
using AjmWait = int (*)(uint32_t, uint32_t, uint32_t, AjmBatchError *);
/* V46: the PS5's libSceAjm has no sceAjmBatchJob*BufferRa / sceAjmBatchStartBuffer (your status file: ctl0 run0 start0). The batch is
 * then written here (chunk layout of the SDK helpers: job chunk, buffer chunks, flags chunk) and started with sceAjmBatchStart, which
 * takes a batch-info record {buffer, bytes used, capacity}. */
struct AjmBatchInfo { void *buffer; size_t offset; size_t capacity; size_t spare[6]; };
using AjmStartInfo = int (*)(uint32_t, AjmBatchInfo *, int, AjmBatchError *, uint32_t *);
constexpr uint32_t kAjmAt9 = 1;
constexpr uint64_t kJobRunMulti = 1ull << 12, kJobCtlReset = 1ull << 13, kJobCtlInit = 1ull << 14, kJobSbStream = 1ull << 47;

struct Backend {
  int kind = 0;   /* 1 libSceAudiodec, 2 libSceAjm */
  AdCreate create = nullptr; AdDecode decode = nullptr; AdDelete del = nullptr;
  AjmInstCreate icreate = nullptr; AjmInstDestroy idestroy = nullptr; AjmCtlRa ctl = nullptr; AjmRunRa runra = nullptr; AjmStart start = nullptr; AjmWait wait = nullptr;
  AjmStartInfo start_info = nullptr;
  uint32_t ctx = 0;
  int inst_ver = -1, inst_codec = -1, job_ver = -1, init_mode = -1;
  int prio = -1;   /* V47: batch priority the firmware accepts (0 gave 0x8093000e = bad priority) */
  int info_layout = -1; /* V47: order of the batch-info record fields the firmware reads */
};
Backend g_be;

/* one decoder session for one track */
struct Session {
  Backend &be;
  Track &t;
  int handle = -1;               /* audiodec handle */
  uint32_t inst = 0;             /* ajm instance */
  bool ajm_open = false;
  AdParamAt9 param{};
  alignas(16) uint8_t bsi[128];
  AdAuInfo au{};
  AdPcmItem pcm{};
  AdCtrl ctrl{};
  Session(Backend &b, Track &tr) : be(b), t(tr) { memset(bsi, 0, sizeof(bsi)); }

  int ajm_batch(uint64_t flags, bool control, void *in, size_t insz, void *out, size_t outsz, void *sb, size_t sbsz) {
    alignas(16) uint8_t batch[1024];
    memset(batch, 0, sizeof(batch));
    void *end = nullptr;
    if (control && be.ctl) end = be.ctl(batch, inst, flags, in, insz, sb, sbsz, nullptr);
    else if (!control && be.runra) end = be.runra(batch, inst, flags, in, insz, out, outsz, sb, sbsz, nullptr);
    else {
      /* the SDK helpers' chunk layout: [job: ident 0 | instance<<6, size] then 16-byte buffer chunks {ident, size, address} and an 8-byte
         flags chunk {ident | (flags>>32)<<6, flags & 0xffffffff} */
      uint8_t *p = batch;
      const uint32_t jh = 0u | ((inst & 0xFFFFFu) << 6);
      memcpy(p, &jh, 4);
      uint8_t *jsize = p + 4;
      p += 8;
      uint8_t *jb = p;
      auto chunk_buf = [&](uint32_t ident, size_t size, void *addr) {
        const uint32_t hdr = ident & 63u, sz = (uint32_t)size;
        memcpy(p, &hdr, 4); memcpy(p + 4, &sz, 4); memcpy(p + 8, &addr, sizeof(void *)); p += 16;
      };
      auto chunk_flags = [&](uint32_t ident, uint64_t f) {
        const uint32_t hdr = (ident & 63u) | (((uint32_t)(f >> 32) & 0xFFFFFu) << 6), lo = (uint32_t)f;
        memcpy(p, &hdr, 4); memcpy(p + 4, &lo, 4); p += 8;
      };
      if (control) { chunk_buf(2, insz, in); chunk_flags(3, flags & 0x000060000000E7FFull); chunk_buf(18, sbsz, sb); }
      else { chunk_buf(1, insz, in); chunk_flags(4, flags & 0x0000E00000001FFFull); chunk_buf(17, outsz, out); chunk_buf(18, sbsz, sb); }
      const uint32_t js = (uint32_t)(p - jb);
      memcpy(jsize, &js, 4);
      end = p;
    }
    if (!end || (uint8_t *)end <= batch || (uint8_t *)end > batch + sizeof(batch)) return -1000;
    AjmBatchError err{};
    uint32_t id = 0;
    int r;
    /* V47: 0x8093000e is "bad priority": the priority the firmware takes is probed once (SDK priorities are small numbers). Once a
       priority is taken, a batch the firmware calls malformed / invalid is retried with the other batch-info field orders. */
    auto start_once = [&](int pr, int lay) -> int {
      err = AjmBatchError{};
      id = 0;
      if (be.start) return be.start(be.ctx, batch, (uint32_t)((uint8_t *)end - batch), pr, &err, &id);
      AjmBatchInfo info{};
      const size_t used = (size_t)((uint8_t *)end - batch);
      info.buffer = batch;
      if (lay == 1) { info.offset = sizeof(batch); info.capacity = used; }
      else if (lay == 2) { info.offset = used; info.capacity = used; }
      else { info.offset = used; info.capacity = sizeof(batch); }
      return be.start_info(be.ctx, &info, pr, &err, &id);
    };
    r = -1;
    if (be.prio < 0) {
      static const int prios[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 16, 24, 32, 64, 127, 128, 255, 256, 1024, 65535, -1, -2};
      for (int pr : prios) {
        r = start_once(pr, be.info_layout >= 0 ? be.info_layout : 0);
        if ((unsigned)r != 0x8093000eu) { be.prio = pr; note("ajm priority %d accepted by the batch start (0x%08x)", pr, (unsigned)r); break; }
      }
      if (be.prio < 0) note("ajm: no batch priority accepted (all gave 0x8093000e)");
    } else r = start_once(be.prio, be.info_layout >= 0 ? be.info_layout : 0);
    if (!be.start && be.prio >= 0 && be.info_layout < 0) {
      const unsigned u = (unsigned)r;
      if (r >= 0) be.info_layout = 0;
      else if (u == 0x80930004u || u == 0x80930005u || u == 0x80930011u || u == 0x80930016u || u == 0x80930015u) {
        for (int lay = 1; lay <= 2; ++lay) {
          const int r2 = start_once(be.prio, lay);
          note("ajm batch-info layout %d: 0x%08x", lay, (unsigned)r2);
          if (r2 >= 0) { be.info_layout = lay; r = r2; break; }
        }
      }
    }
    if (r < 0 && g_logs < 12) { ++g_logs; note("ajm batch start 0x%08x (error 0x%08x, %s)", (unsigned)r, (unsigned)err.error_code, control ? "control" : "run"); }
    if (r < 0) return r;
    r = be.wait(be.ctx, id, 0xFFFFFFFFu, &err);
    if (r < 0) return r;
    return reinterpret_cast<AjmSbResult *>(sb)->result;
  }

  bool open() {
    if (be.kind == 1) {
      ctrl = AdCtrl{&param, bsi, &au, &pcm};
      au.size = sizeof(AdAuInfo);
      pcm.size = sizeof(AdPcmItem);
      param.bw_pcm = 0;
      memcpy(param.config, t.config, 4);
      int ret = 0;
      const uint32_t psizes[] = {12, 16, 20}, bsizes[] = {20, 24, 16, 28, 32};
      for (uint32_t ps : psizes) {
        for (uint32_t bs : bsizes) {
          memset(bsi, 0, sizeof(bsi));
          memcpy(bsi, &bs, 4);
          param.size = ps;
          ret = be.create(&ctrl, kAt9);
          if (ret >= 0) { handle = ret; return true; }
        }
      }
      zt_log("PS5XMB: MUSIC_DECODER_CREATE_FAILED 0x%08x", (unsigned)ret);
      set_status("audiodec create failed 0x%08x", (unsigned)ret);
      return false;
    }
    /* Ajm: instance (probe version / codec field once), then the ATRAC9 initialise control job with the 4 config bytes */
    const uint64_t ch = t.channels > 8 ? 8 : t.channels;
    int r = -1;
    for (int c = (be.inst_codec >= 0 ? be.inst_codec : 0); c <= (be.inst_codec >= 0 ? be.inst_codec : 1) && !ajm_open; ++c)
      for (int v = (be.inst_ver >= 0 ? be.inst_ver : 0); v <= (be.inst_ver >= 0 ? be.inst_ver : 7); ++v) {
        const uint64_t flags = (uint64_t)v | (ch << 3) | (c ? ((uint64_t)kAjmAt9 << 32) : 0);
        r = be.icreate(be.ctx, kAjmAt9, flags, &inst);
        if (r >= 0) { be.inst_ver = v; be.inst_codec = c; ajm_open = true; break; }
      }
    if (!ajm_open) { zt_log("PS5XMB: MUSIC_AJM_INSTANCE_FAILED 0x%08x", (unsigned)r); set_status("ajm instance failed 0x%08x", (unsigned)r); return false; }
    struct { uint8_t config[4]; uint32_t reserved; } init{};
    memcpy(init.config, t.config, 4);
    alignas(16) uint8_t sb[64];
    for (int m = (be.init_mode >= 0 ? be.init_mode : 0); m <= (be.init_mode >= 0 ? be.init_mode : 1); ++m)
      for (int v = (be.job_ver >= 0 ? be.job_ver : 0); v <= (be.job_ver >= 0 ? be.job_ver : 7); ++v) {
        memset(sb, 0, sizeof(sb));
        r = ajm_batch((uint64_t)v | kJobCtlInit | (m ? kJobCtlReset : 0), true, &init, sizeof(init), nullptr, 0, sb, sizeof(AjmSbResult));
        if (r >= 0) {
          if (be.job_ver < 0) { zt_log("PS5XMB: MUSIC_AJM_READY instance v%d codec%d job v%d mode %d", be.inst_ver, be.inst_codec, v, m); note("ajm ready: instance v%d codec%d, job v%d mode %d", be.inst_ver, be.inst_codec, v, m); }
          be.job_ver = v; be.init_mode = m;
          return true;
        }
      }
    zt_log("PS5XMB: MUSIC_AJM_INIT_FAILED 0x%08x", (unsigned)r);
    set_status("ajm init job failed 0x%08x", (unsigned)r);
    return false;
  }

  /* one superframe in -> PCM bytes out (returns <0 on error) */
  int frame(const uint8_t *in, uint32_t insz, uint8_t *out, uint32_t outsz, uint32_t &written) {
    if (be.kind == 1) {
      au.addr = (void *)in;
      au.au_size = insz;
      pcm.addr = out;
      pcm.pcm_size = outsz;
      const int r = be.decode(handle, &ctrl);
      written = pcm.pcm_size;
      return r;
    }
    alignas(16) uint8_t sb[64];
    memset(sb, 0, sizeof(sb));
    const int r = ajm_batch((uint64_t)be.job_ver | kJobRunMulti | kJobSbStream, false, (void *)in, insz, out, outsz, sb, sizeof(AjmSbResult) + sizeof(AjmSbStream));
    const AjmSbStream *st = reinterpret_cast<const AjmSbStream *>(sb + sizeof(AjmSbResult));
    written = st->written > 0 ? (uint32_t)st->written : 0;
    return r;
  }

  void close() {
    if (be.kind == 1 && handle >= 0) be.del(handle);
    if (be.kind == 2 && ajm_open) be.idestroy(be.ctx, inst);
  }
};

void decode_track(const std::shared_ptr<Track> &tp) {
  Track &t = *tp;
  Session ses(g_be, t);
  if (!ses.open()) {
    g_failed.store(true);
    t.done.store(true);
    return;
  }
  std::vector<uint8_t> out(1u << 17);
  int ret = 0;
  const uint32_t spsf = samples_per_superframe(t);
  const size_t n_sf = t.data_size / t.block;
  const double ratio = 48000.0 / (double)t.rate;
  size_t cap = (size_t)((double)n_sf * spsf * ratio) + 4096;
  if (cap > (size_t)48000 * 360) cap = (size_t)48000 * 360; /* 6 min max */
  t.pcm.assign(cap * 2, 0);
  int bps = 0;
  size_t skip = t.skip, written = 0;
  double rpos = 0;               /* resampler position in source frames */
  int16_t last[2] = {0, 0};
  uint64_t src_frames = 0;
  for (size_t k = 0; k < n_sf && !t.cancel.load() && written < cap; ++k) {
    uint32_t bytes = 0;
    ret = ses.frame((const uint8_t *)t.file.data() + t.data_off + k * t.block, t.block, out.data(), (uint32_t)out.size(), bytes);
    if (ret < 0) {
      if (g_logs++ < 8) zt_log("PS5XMB: MUSIC_DECODE_ERROR 0x%08x at %zu of %zu (%s)", (unsigned)ret, k, n_sf, t.name.c_str());
      set_status("decode error 0x%08x at %zu/%zu", (unsigned)ret, k, n_sf);
      break;
    }
    if (bytes > out.size()) bytes = (uint32_t)out.size();
    if (!bps) {
      const uint32_t want = spsf * t.channels;
      bps = bytes == want * 4 ? 4 : 2;
      note("decoding %s via %s: rate %u ch %u block %u superframes %zu, first PCM %u bytes", t.name.c_str(), g_be.kind == 1 ? "audiodec" : "ajm", t.rate, t.channels, t.block, n_sf, bytes);
      if (g_logs++ < 8) zt_log("PS5XMB: MUSIC_DECODING %s via %s rate=%u ch=%u block=%u sf=%zu pcm=%u bytes/%u samples -> %d-byte samples", t.name.c_str(), g_be.kind == 1 ? "audiodec" : "ajm", t.rate, t.channels, t.block, n_sf, bytes, want, bps);
    }
    const uint32_t nframes = bytes / (uint32_t)bps / t.channels;
    for (uint32_t f = 0; f < nframes; ++f) {
      int16_t lr[2];
      for (int c = 0; c < 2; ++c) {
        const uint32_t ch = t.channels == 1 ? 0 : (uint32_t)c;
        const size_t idx = (size_t)f * t.channels + ch;
        if (bps == 4) {
          float v;
          memcpy(&v, out.data() + idx * 4, 4);
          v = v > 1.f ? 1.f : v < -1.f ? -1.f : v;
          lr[c] = (int16_t)(v * 32767.f);
        } else {
          int16_t v;
          memcpy(&v, out.data() + idx * 2, 2);
          lr[c] = v;
        }
      }
      if (skip) { --skip; continue; }
      if (t.rate == 48000) {
        if (written < cap) { t.pcm[written * 2] = lr[0]; t.pcm[written * 2 + 1] = lr[1]; ++written; }
      } else {
        /* linear resampling to 48 kHz: output frames between the previous and this source frame */
        while (rpos <= (double)src_frames && written < cap) {
          const double a = 1.0 - ((double)src_frames - rpos);
          for (int c = 0; c < 2; ++c) t.pcm[written * 2 + c] = (int16_t)((double)last[c] + ((double)lr[c] - (double)last[c]) * a);
          ++written;
          rpos += 1.0 / ratio;
        }
        last[0] = lr[0]; last[1] = lr[1];
        ++src_frames;
      }
    }
    t.ready.store(written);
  }
  ses.close();
  t.ready.store(written);
  t.done.store(true);
  if (g_logs++ < 8) zt_log("PS5XMB: MUSIC_DECODED %s frames=%zu", t.name.c_str(), written);
  if (written) set_status("OK (%s) %zu s decoded", g_be.kind == 1 ? "audiodec" : "ajm", written / 48000);
  else if (ret >= 0) set_status("decoder gave no sound (%s)", g_be.kind == 1 ? "audiodec" : "ajm");
}

int load_module(const char *const *names, size_t n) {
  for (size_t i = 0; i < n; ++i) {
    const int m = sceKernelLoadStartModule(names[i], 0, nullptr, 0, 0, nullptr);
    if (m >= 0) return m;
  }
  return -1;
}

void *music_thread(void *) {
  static const char *const ad_names[] = {"/system/common/lib/libSceAudiodec.sprx", "libSceAudiodec.sprx"};
  static const char *const ajm_names[] = {"/system/common/lib/libSceAjm.native.sprx", "/system/common/lib/libSceAjm.sprx", "libSceAjm.native.sprx", "libSceAjm.sprx"};
  int mod = load_module(ad_names, 2);
  if (mod >= 0) {
    auto init = reinterpret_cast<AdInit>(kernel_dynlib_dlsym(-1, mod, "sceAudiodecInitLibrary"));
    g_be.create = reinterpret_cast<AdCreate>(kernel_dynlib_dlsym(-1, mod, "sceAudiodecCreateDecoder"));
    g_be.decode = reinterpret_cast<AdDecode>(kernel_dynlib_dlsym(-1, mod, "sceAudiodecDecode"));
    g_be.del = reinterpret_cast<AdDelete>(kernel_dynlib_dlsym(-1, mod, "sceAudiodecDeleteDecoder"));
    if (init && g_be.create && g_be.decode && g_be.del) {
      const int r = init(kAt9);
      zt_log("PS5XMB: MUSIC_DECODER audiodec module=%d init=0x%08x", mod, (unsigned)r);
      if (r >= 0 || (unsigned)r == 0x807f0002u) g_be.kind = 1;
    }
  }
  if (!g_be.kind) {
    /* V43: V42's console status said "no AT9 decoder": the Ajm library could not be loaded by file name. System libraries of the PS5 are
     * loaded by their SYSMODULE id (libSceAjm.native = 0x80000023, libSceAjmi = 0x8000007e, ids from libNidResolver's table) through
     * libSceSysmodule, which this process already has; the module handle is then looked up by its file name in this process. */
    int am = load_module(ajm_names, 4);
    char how[96] = "file";
#ifndef ZT_MUSIC_HOST_TEST
    if (am < 0) {
      uint32_t sysmod = 0;
      int sr = -1, sr2 = -1;
      if (kernel_dynlib_handle(getpid(), "libSceSysmodule.sprx", &sysmod) == 0) {
        auto load_internal = reinterpret_cast<int (*)(uint32_t)>(kernel_dynlib_dlsym(-1, sysmod, "sceSysmoduleLoadModuleInternal"));
        if (load_internal) { sr = load_internal(0x80000023u); sr2 = load_internal(0x8000007eu); }
      }
      static const char *const loaded_names[] = {"libSceAjm.native.sprx", "libSceAjm.sprx", "libSceAjmi.sprx", "libSceAjm.native.prx", "libSceAjm"};
      for (const char *n : loaded_names) {
        uint32_t hnd = 0;
        if (kernel_dynlib_handle(getpid(), n, &hnd) == 0 && kernel_dynlib_dlsym(-1, (int)hnd, "sceAjmInitialize")) { am = (int)hnd; snprintf(how, sizeof(how), "sysmodule %s", n); break; }
      }
      zt_log("PS5XMB: MUSIC_AJM_SYSMODULE load=0x%08x/0x%08x handle=%d (%s)", (unsigned)sr, (unsigned)sr2, am, how);
      note("ajm sysmodule: libSceSysmodule handle %u, load(0x80000023)=0x%08x load(0x8000007e)=0x%08x, module handle %d (%s)", sysmod, (unsigned)sr, (unsigned)sr2, am, how);
      if (am < 0) set_status("ajm: sysmodule 0x%08x, no module handle", (unsigned)sr);
    }
#endif
    auto init = am >= 0 ? reinterpret_cast<AjmInit>(kernel_dynlib_dlsym(-1, am, "sceAjmInitialize")) : nullptr;
    auto reg = am >= 0 ? reinterpret_cast<AjmModReg>(kernel_dynlib_dlsym(-1, am, "sceAjmModuleRegister")) : nullptr;
    g_be.icreate = am >= 0 ? reinterpret_cast<AjmInstCreate>(kernel_dynlib_dlsym(-1, am, "sceAjmInstanceCreate")) : nullptr;
    g_be.idestroy = am >= 0 ? reinterpret_cast<AjmInstDestroy>(kernel_dynlib_dlsym(-1, am, "sceAjmInstanceDestroy")) : nullptr;
    g_be.ctl = am >= 0 ? reinterpret_cast<AjmCtlRa>(kernel_dynlib_dlsym(-1, am, "sceAjmBatchJobControlBufferRa")) : nullptr;
    g_be.runra = am >= 0 ? reinterpret_cast<AjmRunRa>(kernel_dynlib_dlsym(-1, am, "sceAjmBatchJobRunBufferRa")) : nullptr;
    g_be.start = am >= 0 ? reinterpret_cast<AjmStart>(kernel_dynlib_dlsym(-1, am, "sceAjmBatchStartBuffer")) : nullptr;
    g_be.wait = am >= 0 ? reinterpret_cast<AjmWait>(kernel_dynlib_dlsym(-1, am, "sceAjmBatchWait")) : nullptr;
    g_be.start_info = am >= 0 ? reinterpret_cast<AjmStartInfo>(kernel_dynlib_dlsym(-1, am, "sceAjmBatchStart")) : nullptr;
    if (am >= 0) {   /* what this firmware's Ajm has, for the status file */
      static const char *const names[] = {"sceAjmBatchStart", "sceAjmBatchStartBuffer", "sceAjmBatchJobControlBufferRa", "sceAjmBatchJobRunBufferRa",
                                          "sceAjmBatchJobControl", "sceAjmBatchJobRun", "sceAjmBatchJobRunSplitBufferRa", "sceAjmBatchJobInlineBuffer",
                                          "sceAjmBatchCancel", "sceAjmBatchErrorDump", "sceAjmDecAt9ParseConfigData", "sceAjmMemoryRegister",
                                          "sceAjmInstanceCodecType", "sceAjmFinalize"};
      std::string have;
      for (const char *n : names) { have += n; have += kernel_dynlib_dlsym(-1, am, n) ? "=1 " : "=0 "; }
      note("ajm exports: %s", have.c_str());
    }
    zt_log("PS5XMB: MUSIC_DECODER ajm module=%d init=%d reg=%d create=%d ctl=%d run=%d start=%d wait=%d (audiodec module=%d)", am, !!init, !!reg,
           !!g_be.icreate, !!g_be.ctl, !!g_be.runra, !!g_be.start, !!g_be.wait, mod);
    note("decoders: audiodec module %d; ajm module %d via %s: sceAjmInitialize %d sceAjmModuleRegister %d sceAjmInstanceCreate %d sceAjmInstanceDestroy %d "
         "sceAjmBatchJobControlBufferRa %d sceAjmBatchJobRunBufferRa %d sceAjmBatchStartBuffer %d sceAjmBatchWait %d", mod, am, how, !!init, !!reg,
         !!g_be.icreate, !!g_be.idestroy, !!g_be.ctl, !!g_be.runra, !!g_be.start, !!g_be.wait);
    if (am >= 0 && !(init && reg && g_be.icreate && g_be.idestroy && g_be.wait && (g_be.start || g_be.start_info)))
      set_status("ajm %s h%d: init%d reg%d new%d del%d ctl%d run%d start%d wait%d", how, am, !!init, !!reg, !!g_be.icreate, !!g_be.idestroy, !!g_be.ctl, !!g_be.runra, !!g_be.start, !!g_be.wait);
    else if (am < 0 && zt_xmb_music_status().rfind("ajm", 0) != 0) set_status("ajm not loaded (file names + sysmodule ids tried)");
    if (init && reg && g_be.icreate && g_be.idestroy && g_be.wait && (g_be.start || g_be.start_info)) {
      const int r1 = init(0, &g_be.ctx);
      const int r2 = r1 >= 0 ? reg(g_be.ctx, kAjmAt9, 0) : -1;
      zt_log("PS5XMB: MUSIC_AJM context=%u init=0x%08x register=0x%08x (%s)", g_be.ctx, (unsigned)r1, (unsigned)r2, how);
      if (r1 < 0) set_status("ajm init 0x%08x", (unsigned)r1);
      if (r1 >= 0) g_be.kind = 2;   /* a failed register shows up as a failed instance below */
    }
  }
  if (!g_be.kind) {
    zt_log("PS5XMB: MUSIC_DECODER_MISSING (no AT9 decoder could be started)");
    if (zt_xmb_music_status().rfind("ajm", 0) != 0) set_status("no AT9 decoder (audiodec %d, ajm not found)", mod);
    g_failed.store(true);
  }
  for (;;) {
    pthread_mutex_lock(&g_mu);
    while (!g_pending && !g_shutdown.load()) pthread_cond_wait(&g_cv, &g_mu);
    if (g_shutdown.load()) { pthread_mutex_unlock(&g_mu); break; }
    std::shared_ptr<Track> t = g_pending;
    g_pending.reset();
    g_decoding = t;
    pthread_mutex_unlock(&g_mu);
    if (g_failed.load()) t->done.store(true);
    else decode_track(t);
    t->file.clear();
    t->file.shrink_to_fit();
    pthread_mutex_lock(&g_mu);
    g_decoding.reset();
    pthread_mutex_unlock(&g_mu);
  }
  return nullptr;
}

bool read_file(const std::string &p, std::string &out) {
  struct stat st;
  if (stat(p.c_str(), &st) != 0 || !S_ISREG(st.st_mode) || st.st_size < 64 || st.st_size > 32 * 1024 * 1024) return false;
  FILE *f = fopen(p.c_str(), "rb");
  if (!f) return false;
  out.resize((size_t)st.st_size);
  const size_t got = fread(&out[0], 1, out.size(), f);
  fclose(f);
  return got == out.size();
}

std::string clean(std::string p) {
  if (p.compare(0, 7, "file://") == 0) p = p.substr(7);
  const size_t q = p.find('?');
  if (q != std::string::npos) p.resize(q);
  return p;
}

bool path_ok(const std::string &p) {
#ifdef ZT_MUSIC_HOST_TEST
  return p.find("..") == std::string::npos;
#else
  return p.size() < 220 && p.find("..") == std::string::npos && (p.compare(0, 14, "/user/appmeta/") == 0 || p.compare(0, 10, "/user/app/") == 0);
#endif
}

/* ---- V48: no title music while a game / app runs (the PS3 never played it over a running game either). The PS5 keeps the XMB
 * focused on the title you started, so the music has to stop by itself: a watcher asks the system for the running "big app" twice a
 * second and fades the music out the moment one starts; play requests are refused (409) while it runs. System apps (NPXS...) do not count. */
using BigAppFn = int (*)(void);
using TitleFn = int (*)(int, char *);
BigAppFn g_bigapp = nullptr;
TitleFn g_title = nullptr;
bool g_bigapp_resolved = false;
bool g_watch = false;
std::string g_running;           /* title id of the running game / app ("" none) */

void resolve_bigapp() {
  if (g_bigapp_resolved) return;
  g_bigapp_resolved = true;
#ifndef ZT_MUSIC_HOST_TEST
  uint32_t h = 0;
  if (kernel_dynlib_handle(getpid(), "libSceSystemService.sprx", &h) == 0) {
    g_bigapp = reinterpret_cast<BigAppFn>(kernel_dynlib_dlsym(-1, (int)h, "sceSystemServiceGetAppIdOfRunningBigApp"));
    g_title = reinterpret_cast<TitleFn>(kernel_dynlib_dlsym(-1, (int)h, "sceSystemServiceGetAppTitleId"));
  }
  note("running-game check: %s", g_bigapp ? "available" : "not available (music is stopped by the XMB only)");
#endif
}

/* title id of the running game / app, "" when none (or only a system app) */
std::string running_title() {
  resolve_bigapp();
  if (!g_bigapp) return "";
  const int id = g_bigapp();
  if (id < 0 || id == 0) return "";
  char tid[64] = {};
  if (g_title && g_title(id, tid) != 0) tid[0] = 0;
  tid[sizeof(tid) - 1] = 0;
  std::string t = tid;
  if (t.empty()) t = "app";
  if (t.compare(0, 4, "NPXS") == 0) return "";
  return t;
}

void *watch_thread(void *) {
  while (!g_shutdown.load()) {
    usleep(500 * 1000);
    if (g_shutdown.load()) break;
    const std::string t = running_title();
    if (t != g_running) {
      note("running game / app: %s", t.empty() ? "none" : t.c_str());
      g_running = t;
      if (!t.empty() && g_active.load()) { note("music stopped: %s started", t.c_str()); zt_xmb_music_stop(); }
    }
  }
  return nullptr;
}
} // namespace

#ifdef ZT_MUSIC_HOST_TEST
void zt_xmb_music_test_bigapp(int (*fn)(void), int (*title)(int, char *)) { g_bigapp = fn; g_title = title; g_bigapp_resolved = true; }
#endif

int zt_xmb_music_play(const std::string &paths, int volume) {
  if (g_shutdown.load() || g_failed.load()) return 503;
  {
    const std::string run = running_title();
    if (!run.empty()) {
      static int held_logs = 0;
      if (held_logs < 40) { ++held_logs; note("not played: %s is running", run.c_str()); }
      return 409;
    }
  }
  auto t = std::make_shared<Track>();
  int why = 404;
  for (size_t at = 0; at <= paths.size();) {
    size_t bar = paths.find('|', at);
    if (bar == std::string::npos) bar = paths.size();
    const std::string p = clean(paths.substr(at, bar - at));
    at = bar + 1;
    if (p.empty() || !path_ok(p)) continue;
    if (!read_file(p, t->file)) continue;
    const int r = parse_at9(*t);
    if (r == 0) { t->name = p; why = 0; break; }
    set_status("not an ATRAC9 file (%d): %s", r, p.c_str());
    why = 415;
    if (g_logs++ < 8) zt_log("PS5XMB: MUSIC_NOT_AT9 %s (%d)", p.c_str(), r);
  }
  if (why == 404) set_status("no readable snd0.at9");
  if (why) return why;
  note("play %s (volume %d)", t->name.c_str(), volume);
  pthread_mutex_lock(&g_mu);
  if (g_shutdown.load()) { pthread_mutex_unlock(&g_mu); return 503; }
  if (!g_thread) {
    pthread_attr_t attr;
    pthread_attr_init(&attr);
    pthread_attr_setstacksize(&attr, 512u << 10);
    const bool ok = pthread_create(&g_decoder_thread, &attr, music_thread, nullptr) == 0;
    pthread_attr_destroy(&attr);
    if (!ok) { pthread_mutex_unlock(&g_mu); zt_log("PS5XMB: MUSIC_THREAD_FAILED"); return 503; }
    g_thread = true;
  }
  if (!g_watch) {
    pthread_attr_t wa;
    pthread_attr_init(&wa);
    pthread_attr_setstacksize(&wa, 64u << 10);
    g_watch = pthread_create(&g_watcher_thread, &wa, watch_thread, nullptr) == 0;
    pthread_attr_destroy(&wa);
  }
  if (g_pending) g_pending->cancel.store(true);
  if (g_play) g_play->cancel.store(true);
  g_old = g_play; g_old_pos = g_pos; g_old_gain = g_gain;   /* the previous track fades out while the new one fades in */
  g_play = t; g_pos = 0; g_gain = 0;
  g_target = (float)(volume < 0 ? 60 : volume > 100 ? 100 : volume) / 100.f;
  g_pending = t;
  g_active.store(true);
  pthread_cond_signal(&g_cv);
  pthread_mutex_unlock(&g_mu);
  return 202;
}

void zt_xmb_music_shutdown() {
  pthread_mutex_lock(&g_mu);
  if (g_shutdown.exchange(true)) { pthread_mutex_unlock(&g_mu); return; }
  for (auto &t : {g_pending, g_decoding, g_play, g_old})
    if (t) t->cancel.store(true);
  g_pending.reset();
  g_play.reset();
  g_old.reset();
  g_active.store(false);
  const bool decoder = g_thread, watcher = g_watch;
  pthread_cond_broadcast(&g_cv);
  pthread_mutex_unlock(&g_mu);
  if (decoder) pthread_join(g_decoder_thread, nullptr);
  if (watcher) pthread_join(g_watcher_thread, nullptr);
}

void zt_xmb_music_stop() {
  pthread_mutex_lock(&g_mu);
  if (g_play) {
    g_play->cancel.store(true);
    g_old = g_play; g_old_pos = g_pos; g_old_gain = g_gain;
    g_play.reset();
  }
  pthread_mutex_unlock(&g_mu);
}

bool zt_xmb_music_active() { return g_active.load(); }
bool zt_xmb_music_failed() { return g_failed.load(); }
void zt_xmb_note(const std::string &line) { note("%s", line.c_str()); }

std::string zt_xmb_music_status() {
  pthread_mutex_lock(&g_st_mu);
  std::string s = g_status;
  pthread_mutex_unlock(&g_st_mu);
  return s;
}

/* mixed into every grain of the XMB audio port (frames of stereo int32 accumulators) */
void zt_xmb_music_mix(int32_t *acc, int frames) {
  if (!g_active.load()) return;
  if (pthread_mutex_trylock(&g_mu) != 0) return;   /* never make the audio thread wait */
  const float in_step = 1.f / (48000.f * 0.6f), out_step = 1.f / (48000.f * 0.35f);
  auto play = [&](const std::shared_ptr<Track> &t, size_t &pos, float &gain, bool fading_out) {
    if (!t) return false;
    const size_t ready = t->ready.load();
    const bool done = t->done.load();
    for (int f = 0; f < frames; ++f) {
      if (fading_out) { gain -= out_step; if (gain <= 0) { gain = 0; return false; } }
      else if (gain < g_target) { gain += in_step; if (gain > g_target) gain = g_target; }
      else if (gain > g_target) { gain -= out_step; if (gain < g_target) gain = g_target; }
      if (pos >= ready) {
        if (done && ready > 0) pos = 0;  /* loops, as the PS3 does */
        else if (done) return fading_out ? false : true;
        else continue;                   /* still decoding: silence for this frame */
      }
      acc[f * 2] += (int32_t)((float)t->pcm[pos * 2] * gain);
      acc[f * 2 + 1] += (int32_t)((float)t->pcm[pos * 2 + 1] * gain);
      ++pos;
    }
    return true;
  };
  if (g_old && !play(g_old, g_old_pos, g_old_gain, true)) g_old.reset();
  if (g_play && g_play->done.load() && g_play->ready.load() == 0) g_play.reset();   /* nothing decoded: give up quietly */
  if (g_play) play(g_play, g_pos, g_gain, false);
  if (!g_play && !g_old) g_active.store(false);
  pthread_mutex_unlock(&g_mu);
}
