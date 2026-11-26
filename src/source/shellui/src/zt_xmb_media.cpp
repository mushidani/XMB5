/* XMB one-ELF media pack installer (GPL-3.0-or-later extension of ZhiThemes).
 * Does not write system_data, app.db, firmware partitions or homebrew titles.
 * Embeds short navigation audio (PCM) and the xmb-web wave background loop (H.264).
 * The active theme's wallpapers folder is the existing ZhiThemes video server.
 */
#include "zt_xmb_media.hpp"
#include "zt_xmb_music.hpp"
#include "zt_storage.hpp"
#include "zt_log.hpp"

#include <errno.h>
#include <stdint.h>
#include <fcntl.h>
#include <string>
#include <sys/stat.h>
#include <unistd.h>
#include <string.h>
#include <atomic>
#include <pthread.h>
#include <time.h>
#include "ps5/kernel.h"

extern "C" {
extern int sceKernelLoadStartModule(const char *, size_t, const void *, uint32_t, uint32_t, int *);
extern const unsigned char zt_xmb_snd_cursor_start[], zt_xmb_snd_cursor_end[];               /* PS3 snd_cursor          (scroll step)        */
extern const unsigned char zt_xmb_snd_category_start[], zt_xmb_snd_category_end[];           /* PS3 snd_category_decide (category change)    */
extern const unsigned char zt_xmb_snd_decide_start[], zt_xmb_snd_decide_end[];               /* PS3 snd_decide          (open / enter)       */
extern const unsigned char zt_xmb_snd_cancel_start[], zt_xmb_snd_cancel_end[];               /* PS3 snd_cancel          (back / close)       */
extern const unsigned char zt_xmb_snd_ok_start[], zt_xmb_snd_ok_end[];                       /* PS3 snd_system_ok       (setting changed)    */
extern const unsigned char zt_xmb_snd_ng_start[], zt_xmb_snd_ng_end[];                       /* PS3 snd_system_ng       (not available)      */
extern const unsigned char zt_xmb_wave_day_start[], zt_xmb_wave_day_end[];     /* xmb-web WebGL wave, day palette   (H.264 loop) */
extern const unsigned char zt_xmb_wave_night_start[], zt_xmb_wave_night_end[]; /* xmb-web WebGL wave, night palette (H.264 loop) */
extern const unsigned char zt_xmb_wave_day_blur_start[], zt_xmb_wave_day_blur_end[];     /* V56: the same loops blurred (PS3 submenu) */
extern const unsigned char zt_xmb_wave_night_blur_start[], zt_xmb_wave_night_blur_end[];
/* V83.14: build-local Rodin Regular and original 3-slice glow artwork. */
extern const unsigned char zt_xmb_font_regular_start[], zt_xmb_font_regular_end[];
extern const unsigned char zt_xmb_glow_l_start[], zt_xmb_glow_l_end[];
extern const unsigned char zt_xmb_glow_m_start[], zt_xmb_glow_m_end[];
extern const unsigned char zt_xmb_glow_r_start[], zt_xmb_glow_r_end[];

}

/* xmb-web's wave background: its own WebGL shader rendered frame by frame on the build machine, encoded as a seamless H.264
 * loop and embedded in this ELF. HomeUI plays it with the system video view through ZhiThemes' video server
 * (http://127.0.0.1:4445/v/<name>, served from the active theme's wallpapers folder). Written once; an identical-size file
 * already there is left alone, and a failed write never leaves a half file behind. */
static bool xmb_install_file(const std::string &dir, const char *name, const unsigned char *data, const unsigned char *end) {
  const size_t bytes = (size_t)(end - data);
  if (bytes < 4096) return false;
  const std::string dest = dir + "/" + name, temp = dest + ".xmb-part";
  struct stat st {};
  if (stat(dest.c_str(), &st) == 0 && (size_t)st.st_size == bytes) return true;
  int fd = open(temp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);
  if (fd < 0) { zt_log("PS5XMB: WAVE_VIDEO_OPEN_FAILED %s errno=%d", name, errno); return false; }
  bool ok = true;
  for (size_t off = 0; ok && off < bytes;) {
    const ssize_t w = write(fd, data + off, bytes - off);
    if (w <= 0) { ok = false; break; }
    off += (size_t)w;
  }
  if (ok) fsync(fd);
  close(fd);
  if (ok && rename(temp.c_str(), dest.c_str()) != 0) ok = false;
  if (!ok) unlink(temp.c_str());
  zt_log("PS5XMB: WAVE_VIDEO_%s %s bytes=%zu", ok ? "INSTALLED" : "FAILED", name, bytes);
  return ok;
}

void zt_xmb_media_install() {
  const std::string dir = zt_theme_dir("wallpapers");
  zt_mkdirs(dir);
  xmb_install_file(dir, "PS5XMB_XMBWEB_Wave_Day.mp4", zt_xmb_wave_day_start, zt_xmb_wave_day_end);
  xmb_install_file(dir, "PS5XMB_XMBWEB_Wave_Night.mp4", zt_xmb_wave_night_start, zt_xmb_wave_night_end);
  xmb_install_file(dir, "PS5XMB_XMBWEB_Wave_Day_Blur.mp4", zt_xmb_wave_day_blur_start, zt_xmb_wave_day_blur_end);
  xmb_install_file(dir, "PS5XMB_XMBWEB_Wave_Night_Blur.mp4", zt_xmb_wave_night_blur_start, zt_xmb_wave_night_blur_end);
}

/* V83.8: fresh-install default assets, owned by the local builder. Write them
 * atomically; never overwrite a non-empty user-provided font. Glow slices are
 * installed after generated particles to guarantee they are the original PNGs.
 * Existing layout, themes, JSON configuration and videos are not modified.
 */
static bool xmb_same_asset(const std::string &path, const unsigned char *a, size_t bytes) {
  struct stat st {};
  if (stat(path.c_str(), &st) != 0 || st.st_size < 0 || (size_t)st.st_size != bytes) return false;
  int fd = open(path.c_str(), O_RDONLY);
  if (fd < 0) return false;
  unsigned char buf[4096];
  size_t pos = 0;
  bool same = true;
  while (pos < bytes) {
    size_t take = bytes - pos;
    if (take > sizeof(buf)) take = sizeof(buf);
    ssize_t n = read(fd, buf, take);
    if (n <= 0 || memcmp(a + pos, buf, (size_t)n) != 0) { same = false; break; }
    pos += (size_t)n;
  }
  close(fd);
  return same && pos == bytes;
}
static bool xmb_install_default_asset(const std::string &dir, const char *name,
                                      const unsigned char *start, const unsigned char *end,
                                      bool preserve_existing) {
  if (end <= start) return false;
  const size_t bytes = (size_t)(end - start);
  if (bytes < 64 || bytes > 4 * 1024 * 1024) return false;
  zt_mkdirs(dir);
  const std::string dest = dir + "/" + name;
  struct stat st {};
  if (stat(dest.c_str(), &st) == 0) {
    if (preserve_existing && S_ISREG(st.st_mode) && st.st_size > 0) return true;
    if (xmb_same_asset(dest, start, bytes)) return true;
  }
  const std::string tmp = dest + ".xmb-default-part";
  int fd = open(tmp.c_str(), O_WRONLY | O_CREAT | O_TRUNC, 0644);
  if (fd < 0) { zt_log("PS5XMB DEFAULTS: open failed %s errno=%d", name, errno); return false; }
  size_t pos = 0;
  bool ok = true;
  while (pos < bytes) {
    ssize_t w = write(fd, start + pos, bytes - pos);
    if (w <= 0) { ok = false; break; }
    pos += (size_t)w;
  }
  if (ok && fsync(fd) != 0) ok = false;
  if (close(fd) != 0) ok = false;
  if (ok && rename(tmp.c_str(), dest.c_str()) != 0) ok = false;
  if (!ok) unlink(tmp.c_str());
  zt_log("PS5XMB DEFAULTS: %s %s (%zu bytes)", ok ? "installed" : "FAILED", name, bytes);
  return ok;
}

void zt_xmb_defaults_install() {
  /* The native text-glow renderer searches Default/fonts as its fallback,
   * including when the user switches to another theme. */
  const std::string fonts = std::string(ZT_THEMES) + "/Default/fonts";
  xmb_install_default_asset(fonts, "ps3-rodin-regular.ttf", zt_xmb_font_regular_start, zt_xmb_font_regular_end, true);
  /* Keep the exact legacy asset URIs used by the current XMB renderer. */
  const std::string glow = ZT_PARTICLES;
  xmb_install_default_asset(glow, "xmbweb_glow_l.png", zt_xmb_glow_l_start, zt_xmb_glow_l_end, false);
  xmb_install_default_asset(glow, "xmbweb_glow_m.png", zt_xmb_glow_m_start, zt_xmb_glow_m_end, false);
  xmb_install_default_asset(glow, "xmbweb_glow_r.png", zt_xmb_glow_r_start, zt_xmb_glow_r_end, false);
  zt_log("PS5XMB DEFAULTS: Rodin Regular and 3-slice glow installation attempted");
}

/* Original PS3 XMB sounds (owner-supplied wavs, converted to 48 kHz stereo S16 PCM at build time).
 * V36: a small MIXER instead of a one-voice queue. Every request starts a new voice at once (up to 8 at a time, summed and clipped),
 * the AudioOut port is opened ONCE and kept for the life of the worker, and output runs in 256-frame grains (5.3 ms), so a held D-pad
 * gets one sound per scroll step, overlapping, exactly as fast as the XMB scrolls. Failures are logged and never reach HomeUI. */
namespace {
using AudioInit = int (*)();
using AudioOpen = int (*)(int, int, int, int, int, int);
using AudioOutput = int (*)(int, const void *);
using AudioClose = int (*)(int);
struct SfxSample { const unsigned char *data; const unsigned char *end; const char *label; };
struct SfxVoice { const int16_t *pcm; size_t frames; size_t pos; };
constexpr int kSfxVoices = 8;
constexpr int kSfxGrain = 256;                 /* frames per AudioOut call */
pthread_mutex_t g_xmb_sfx_mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t g_xmb_sfx_cv = PTHREAD_COND_INITIALIZER;
pthread_t g_xmb_sfx_thread{};
bool g_xmb_sfx_started = false;
bool g_xmb_sfx_stop = false;
bool g_xmb_sfx_warm = false;                   /* V38: XMB is on screen: keep the port open and playing silence so the FIRST sound is never lost */
SfxVoice g_xmb_voices[kSfxVoices];
int g_xmb_voice_count = 0;
std::atomic<bool> g_xmb_sfx_backend_ready{false};
std::atomic<bool> g_xmb_sfx_backend_failed{false};

SfxSample xmb_sfx_sample(int which) {
  switch (which) {
    case 1: return {zt_xmb_snd_cursor_start,   zt_xmb_snd_cursor_end,   "cursor"};
    case 2: return {zt_xmb_snd_category_start, zt_xmb_snd_category_end, "category"};
    case 3: return {zt_xmb_snd_decide_start,   zt_xmb_snd_decide_end,   "decide"};
    case 4: return {zt_xmb_snd_cancel_start,   zt_xmb_snd_cancel_end,   "cancel"};
    case 5: return {zt_xmb_snd_ok_start,       zt_xmb_snd_ok_end,       "ok"};
    default:return {zt_xmb_snd_ng_start,       zt_xmb_snd_ng_end,       "ng"};
  }
}

void *xmb_sfx_worker(void *) {
  // Never use RT kernel audio handles on the React Native UI thread.
  // Symbols are resolved from the firmware's module by the SDK's NID-aware
  // kernel_dynlib_dlsym helper; no fixed firmware offsets.
  int mod = sceKernelLoadStartModule("/system/common/lib/libSceAudioOut.sprx", 0, nullptr, 0, 0, nullptr);
  if (mod < 0) mod = sceKernelLoadStartModule("libSceAudioOut.sprx", 0, nullptr, 0, 0, nullptr);
  auto init = mod >= 0 ? reinterpret_cast<AudioInit>(kernel_dynlib_dlsym(-1,mod,"sceAudioOutInit")) : nullptr;
  auto open_port = mod >= 0 ? reinterpret_cast<AudioOpen>(kernel_dynlib_dlsym(-1,mod,"sceAudioOutOpen")) : nullptr;
  auto output = mod >= 0 ? reinterpret_cast<AudioOutput>(kernel_dynlib_dlsym(-1,mod,"sceAudioOutOutput")) : nullptr;
  auto close_port = mod >= 0 ? reinterpret_cast<AudioClose>(kernel_dynlib_dlsym(-1,mod,"sceAudioOutClose")) : nullptr;
  if (!open_port || !output || !close_port) {
    zt_log("PS5XMB: NATIVE_SFX_SYMBOLS_MISSING module=%d",mod);
    g_xmb_sfx_backend_failed.store(true);
  } else {
    if (init) { int ret=init(); zt_log("PS5XMB: NATIVE_SFX_INIT ret=%d",ret); }
    g_xmb_sfx_backend_ready.store(true);
    zt_log("PS5XMB: NATIVE_SFX_SYMBOLS_READY");
  }
  int port = -1;
  alignas(64) int16_t grain[kSfxGrain * 2];
  for (;;) {
    pthread_mutex_lock(&g_xmb_sfx_mutex);
    while (!g_xmb_sfx_stop && !g_xmb_voice_count && !(g_xmb_sfx_warm && !g_xmb_sfx_backend_failed.load()) && !(zt_xmb_music_active() && !g_xmb_sfx_backend_failed.load())) {
      if (port >= 0) {                           /* keep the port open for 4 s of silence, then release it */
        timespec until{}; clock_gettime(CLOCK_REALTIME,&until); until.tv_sec+=4;
        if (pthread_cond_timedwait(&g_xmb_sfx_cv,&g_xmb_sfx_mutex,&until)==ETIMEDOUT && !g_xmb_voice_count && !g_xmb_sfx_stop) {
          pthread_mutex_unlock(&g_xmb_sfx_mutex);
          close_port(port); port = -1;
          pthread_mutex_lock(&g_xmb_sfx_mutex);
        }
      } else pthread_cond_wait(&g_xmb_sfx_cv,&g_xmb_sfx_mutex);
    }
    if (g_xmb_sfx_stop) { pthread_mutex_unlock(&g_xmb_sfx_mutex); break; }
    /* mix one grain from every live voice */
    int32_t acc[kSfxGrain * 2];
    memset(acc,0,sizeof(acc));
    for (int v=0; v<g_xmb_voice_count; ) {
      SfxVoice &vo=g_xmb_voices[v];
      size_t n=vo.frames-vo.pos; if (n>(size_t)kSfxGrain) n=kSfxGrain;
      const int16_t *src=vo.pcm+vo.pos*2;
      for (size_t i=0;i<n*2;++i) acc[i]+=src[i];
      vo.pos+=n;
      if (vo.pos>=vo.frames) g_xmb_voices[v]=g_xmb_voices[--g_xmb_voice_count]; else ++v;
    }
    pthread_mutex_unlock(&g_xmb_sfx_mutex);
    zt_xmb_music_mix(acc, kSfxGrain);             /* V40: a game's own music, mixed under the navigation sounds */
    if (!g_xmb_sfx_backend_ready.load()) continue;
    for (int i=0;i<kSfxGrain*2;++i) { int32_t x=acc[i]; grain[i]=(int16_t)(x>32767?32767:x<-32768?-32768:x); }
    if (port<0) {
      // PS5 AudioOut MAIN, 256 frames per call, 48 kHz, S16 stereo (format 1); opened once, kept while sounds keep coming.
      port=open_port(0xFF,0,0,kSfxGrain,48000,1);
      if (port<0) {
        zt_log("PS5XMB: NATIVE_SFX_OPEN_FAILED code=%d",port);
        g_xmb_sfx_backend_failed.store(true);
        g_xmb_sfx_backend_ready.store(false);
        pthread_mutex_lock(&g_xmb_sfx_mutex); g_xmb_voice_count=0; pthread_mutex_unlock(&g_xmb_sfx_mutex);
        port=-1; continue;
      }
      zt_log("PS5XMB: NATIVE_SFX_PORT_OPEN %d",port);
    }
    int ret=output(port,grain);   /* blocks until the grain has been consumed: paces the loop */
    if (ret<0) { zt_log("PS5XMB: NATIVE_SFX_OUTPUT_FAILED code=%d",ret); close_port(port); port=-1; }
  }
  if (port>=0) close_port(port);
  zt_log("PS5XMB: NATIVE_SFX_THREAD_STOPPED");
  return nullptr;
}
} // namespace

/* which: 1 cursor (scroll step), 2 category (category change), 3 decide (open / enter), 4 cancel (back / close), 5 ok, 6 ng */
bool zt_xmb_sfx_play(int which) {
  if (g_xmb_sfx_backend_failed.load()) return false;
  if (which<1 || which>6) which=1;
  const SfxSample smp=xmb_sfx_sample(which);
  const size_t bytes=(size_t)(smp.end-smp.data);
  if (bytes<1024 || bytes>512000 || (bytes & 3)) return false;
  pthread_mutex_lock(&g_xmb_sfx_mutex);
  if (g_xmb_sfx_stop) {pthread_mutex_unlock(&g_xmb_sfx_mutex);return false;}
  if (!g_xmb_sfx_started) {
    if (pthread_create(&g_xmb_sfx_thread,nullptr,xmb_sfx_worker,nullptr)!=0) {
      pthread_mutex_unlock(&g_xmb_sfx_mutex);
      zt_log("PS5XMB: NATIVE_SFX_THREAD_FAILED");
      return false;
    }
    g_xmb_sfx_started=true;
  }
  if (g_xmb_voice_count>=kSfxVoices) {            /* all voices busy: drop the oldest */
    for (int i=1;i<kSfxVoices;++i) g_xmb_voices[i-1]=g_xmb_voices[i];
    --g_xmb_voice_count;
  }
  g_xmb_voices[g_xmb_voice_count++]=SfxVoice{reinterpret_cast<const int16_t*>(smp.data),bytes/4,0};
  pthread_cond_signal(&g_xmb_sfx_cv);
  pthread_mutex_unlock(&g_xmb_sfx_mutex);
  return true;
}

/* V38: on = the XMB is on screen. The worker opens the AudioOut port at once and keeps it running (silence between sounds), so a sound that is
 * requested after a pause no longer has to wait for the port to open (that wait swallowed the first sound). off = release the port after 4 s. */
bool zt_xmb_sfx_warm(bool on) {
  if (g_xmb_sfx_backend_failed.load()) return false;
  pthread_mutex_lock(&g_xmb_sfx_mutex);
  if (g_xmb_sfx_stop) {pthread_mutex_unlock(&g_xmb_sfx_mutex);return false;}
  if (on && !g_xmb_sfx_started) {
    if (pthread_create(&g_xmb_sfx_thread,nullptr,xmb_sfx_worker,nullptr)!=0) {
      pthread_mutex_unlock(&g_xmb_sfx_mutex);
      zt_log("PS5XMB: NATIVE_SFX_THREAD_FAILED");
      return false;
    }
    g_xmb_sfx_started=true;
  }
  g_xmb_sfx_warm=on;
  pthread_cond_signal(&g_xmb_sfx_cv);
  pthread_mutex_unlock(&g_xmb_sfx_mutex);
  return true;
}

/* V40: wake the worker (a game's music just started) */
void zt_xmb_sfx_kick() {
  if (g_xmb_sfx_backend_failed.load()) return;
  pthread_mutex_lock(&g_xmb_sfx_mutex);
  if (!g_xmb_sfx_stop && !g_xmb_sfx_started) {
    if (pthread_create(&g_xmb_sfx_thread,nullptr,xmb_sfx_worker,nullptr)==0) g_xmb_sfx_started=true;
    else zt_log("PS5XMB: NATIVE_SFX_THREAD_FAILED");
  }
  pthread_cond_signal(&g_xmb_sfx_cv);
  pthread_mutex_unlock(&g_xmb_sfx_mutex);
}

void zt_xmb_sfx_shutdown() {
  pthread_mutex_lock(&g_xmb_sfx_mutex);
  if (!g_xmb_sfx_started) { pthread_mutex_unlock(&g_xmb_sfx_mutex); return; }
  g_xmb_sfx_stop=true;
  pthread_cond_signal(&g_xmb_sfx_cv);
  pthread_mutex_unlock(&g_xmb_sfx_mutex);
  pthread_join(g_xmb_sfx_thread,nullptr);
  pthread_mutex_lock(&g_xmb_sfx_mutex);
  g_xmb_sfx_started=false;
  pthread_mutex_unlock(&g_xmb_sfx_mutex);
}
