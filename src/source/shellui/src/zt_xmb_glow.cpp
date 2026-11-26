/* V38: native letter-hugging text glow for the XMB (PS3 look).
 *
 * The PS5 React Native engine ignores textShadow, so the halo around the focused title is a picture: the title is rasterised here with the
 * XMB font itself (TrueType glyf outlines, no external library), blurred twice (tight bloom hugging the strokes + wide soft halo) and
 * stored as a white + alpha PNG in the cache folder. One file per (text, size, line height); it is made once and reused.
 */
#include "zt_xmb_glow.hpp"
#include "zt_storage.hpp"

#include <dirent.h>
#include <pthread.h>
#include <sys/stat.h>
#include <unistd.h>

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>
#include <vector>

#ifndef GLOW_BASE_DY
#define GLOW_BASE_DY 0.0f
#endif
#ifndef GLOW_K1
#define GLOW_K1 0.7f
#endif
#ifndef GLOW_K2
#define GLOW_K2 1.0f
#endif

namespace {

struct Seg { float x0, y0, x1, y1; };

struct Font {
  std::string data;
  std::string path;
  uint32_t glyf = 0, loca = 0, hmtx = 0, cmap = 0, cmapLen = 0;
  int units = 1000, locFmt = 0, numGlyphs = 0, asc = 800, desc = -200, nHM = 0, winAsc = 0, winDesc = 0;
  uint32_t cmapSub = 0; int cmapFmt = 0;
  bool ok = false;
};

pthread_mutex_t g_mu = PTHREAD_MUTEX_INITIALIZER;
Font g_font;
bool g_cleaned = false;

uint16_t u16(const std::string &d, size_t o) { return o + 2 <= d.size() ? (uint16_t)(((uint8_t)d[o] << 8) | (uint8_t)d[o + 1]) : 0; }
int16_t s16(const std::string &d, size_t o) { return (int16_t)u16(d, o); }
uint32_t u32(const std::string &d, size_t o) { return ((uint32_t)u16(d, o) << 16) | u16(d, o + 2); }

bool read_all(const std::string &p, std::string &out) {
  FILE *f = fopen(p.c_str(), "rb");
  if (!f) return false;
  char buf[16384];
  size_t n;
  out.clear();
  while ((n = fread(buf, 1, sizeof(buf), f)) > 0) {
    out.append(buf, n);
    if (out.size() > 8u * 1024 * 1024) { fclose(f); return false; }
  }
  fclose(f);
  return !out.empty();
}

bool load_font(const std::string &path) {
  if (g_font.ok && g_font.path == path) return true;
  g_font = Font();
  Font f;
  if (!read_all(path, f.data)) return false;
  const std::string &d = f.data;
  const uint32_t ver = u32(d, 0);
  if (ver != 0x00010000u && ver != 0x74727565u) return false; /* TrueType outlines only */
  const int nt = u16(d, 4);
  uint32_t head = 0, maxp = 0, hhea = 0, os2 = 0;
  for (int i = 0; i < nt; ++i) {
    const size_t r = 12 + (size_t)i * 16;
    const uint32_t tag = u32(d, r), off = u32(d, r + 8);
    if (off >= d.size()) continue;
    if (tag == 0x676c7966u) f.glyf = off;
    else if (tag == 0x6c6f6361u) f.loca = off;
    else if (tag == 0x686d7478u) f.hmtx = off;
    else if (tag == 0x636d6170u) { f.cmap = off; f.cmapLen = u32(d, r + 12); }
    else if (tag == 0x68656164u) head = off;
    else if (tag == 0x6d617870u) maxp = off;
    else if (tag == 0x68686561u) hhea = off;
    else if (tag == 0x4f532f32u) os2 = off;
  }
  if (!f.glyf || !f.loca || !f.hmtx || !f.cmap || !head || !maxp || !hhea) return false;
  f.units = u16(d, head + 18);
  f.locFmt = s16(d, head + 50);
  f.numGlyphs = u16(d, maxp + 4);
  f.asc = s16(d, hhea + 4);
  f.desc = s16(d, hhea + 6);
  f.nHM = u16(d, hhea + 34);
  if (os2 && os2 + 78 <= d.size()) { f.winAsc = u16(d, os2 + 74); f.winDesc = u16(d, os2 + 76); }
  if (f.units < 16 || f.numGlyphs < 1 || f.nHM < 1) return false;
  /* cmap: prefer (3,10) format 12, then (3,1) / (0,x) format 4 */
  const int nc = u16(d, f.cmap + 2);
  int best = -1;
  for (int i = 0; i < nc; ++i) {
    const size_t r = f.cmap + 4 + (size_t)i * 8;
    const int pid = u16(d, r), eid = u16(d, r + 2);
    const uint32_t sub = f.cmap + u32(d, r + 4);
    if (sub + 4 > d.size()) continue;
    const int fmt = u16(d, sub);
    int score = -1;
    if (pid == 3 && eid == 10 && fmt == 12) score = 4;
    else if (pid == 3 && eid == 1 && fmt == 4) score = 3;
    else if (pid == 0 && fmt == 4) score = 2;
    else if (pid == 0 && fmt == 12) score = 1;
    if (score > best) { best = score; f.cmapSub = sub; f.cmapFmt = fmt; }
  }
  if (best < 0) return false;
  f.path = path;
  f.ok = true;
  g_font = f;
  return true;
}

int glyph_of(const Font &f, uint32_t cp) {
  const std::string &d = f.data;
  const uint32_t s = f.cmapSub;
  if (f.cmapFmt == 12) {
    const uint32_t n = u32(d, s + 12);
    for (uint32_t i = 0; i < n && i < 20000; ++i) {
      const size_t g = s + 16 + (size_t)i * 12;
      const uint32_t a = u32(d, g), b = u32(d, g + 4);
      if (cp >= a && cp <= b) return (int)(u32(d, g + 8) + (cp - a));
    }
    return 0;
  }
  if (cp > 0xFFFF) return 0;
  const int segx2 = u16(d, s + 6), seg = segx2 / 2;
  const size_t endc = s + 14, startc = s + 16 + segx2, delta = s + 16 + 2 * (size_t)segx2, rng = s + 16 + 3 * (size_t)segx2;
  for (int i = 0; i < seg; ++i) {
    const uint32_t e = u16(d, endc + 2 * (size_t)i);
    if (cp > e) continue;
    const uint32_t st = u16(d, startc + 2 * (size_t)i);
    if (cp < st) return 0;
    const uint32_t ro = u16(d, rng + 2 * (size_t)i), dl = u16(d, delta + 2 * (size_t)i);
    if (ro == 0) return (int)((cp + dl) & 0xFFFF);
    const size_t at = rng + 2 * (size_t)i + ro + 2 * (size_t)(cp - st);
    const uint32_t g = u16(d, at);
    return g ? (int)((g + dl) & 0xFFFF) : 0;
  }
  return 0;
}

int advance_of(const Font &f, int gid) {
  const int i = gid < f.nHM ? gid : f.nHM - 1;
  return u16(f.data, f.hmtx + 4 * (size_t)i);
}

bool glyph_range(const Font &f, int gid, uint32_t &a, uint32_t &b) {
  if (gid < 0 || gid >= f.numGlyphs) return false;
  const std::string &d = f.data;
  if (f.locFmt == 0) { a = 2u * u16(d, f.loca + 2 * (size_t)gid); b = 2u * u16(d, f.loca + 2 * (size_t)gid + 2); }
  else { a = u32(d, f.loca + 4 * (size_t)gid); b = u32(d, f.loca + 4 * (size_t)gid + 4); }
  return b > a && f.glyf + b <= d.size();
}

/* outline of one glyph as line segments in font units (y up), transformed by m = [a b c d] and offset (dx, dy) */
void flatten(std::vector<Seg> &out, const std::vector<float> &px, const std::vector<float> &py, const std::vector<uint8_t> &on, const std::vector<int> &ends,
             const float m[4], float dx, float dy, float scale, float ox, float oy) {
  int start = 0;
  auto T = [&](float x, float y, float &rx, float &ry) {
    const float X = m[0] * x + m[2] * y + dx, Y = m[1] * x + m[3] * y + dy;
    rx = ox + X * scale; ry = oy - Y * scale;
  };
  for (size_t ci = 0; ci < ends.size(); ++ci) {
    const int end = ends[ci], n = end - start + 1;
    if (n < 2) { start = end + 1; continue; }
    /* find a start point on the curve */
    std::vector<float> X, Y; std::vector<uint8_t> O;
    for (int i = start; i <= end; ++i) { X.push_back(px[(size_t)i]); Y.push_back(py[(size_t)i]); O.push_back(on[(size_t)i]); }
    int first = -1;
    for (int i = 0; i < n; ++i) if (O[(size_t)i]) { first = i; break; }
    float sx, sy;
    std::vector<float> QX, QY; std::vector<uint8_t> QO;
    if (first < 0) { sx = (X[0] + X[(size_t)n - 1]) * 0.5f; sy = (Y[0] + Y[(size_t)n - 1]) * 0.5f; first = n - 1; /* all off: start between last and first */
      for (int k = 0; k < n; ++k) { const size_t i = (size_t)((first + 1 + k) % n); QX.push_back(X[i]); QY.push_back(Y[i]); QO.push_back(0); } }
    else { sx = X[(size_t)first]; sy = Y[(size_t)first];
      for (int k = 1; k <= n; ++k) { const size_t i = (size_t)((first + k) % n); QX.push_back(X[i]); QY.push_back(Y[i]); QO.push_back(O[i]); } }
    float cx = sx, cy = sy; /* current on-curve point */
    float ax, ay;
    T(cx, cy, ax, ay);
    auto lineTo = [&](float nx, float ny) { float bx, by; T(nx, ny, bx, by); out.push_back({ax, ay, bx, by}); ax = bx; ay = by; };
    size_t i = 0;
    while (i < QX.size()) {
      if (QO[i]) { cx = QX[i]; cy = QY[i]; lineTo(cx, cy); ++i; continue; }
      /* off-curve control point; end is the next on point or the midpoint to the next off point */
      const float qx = QX[i], qy = QY[i];
      float ex, ey;
      if (i + 1 < QX.size() && !QO[i + 1]) { ex = (qx + QX[i + 1]) * 0.5f; ey = (qy + QY[i + 1]) * 0.5f; ++i; }
      else if (i + 1 < QX.size()) { ex = QX[i + 1]; ey = QY[i + 1]; i += 2; }
      else { ex = sx; ey = sy; ++i; }
      const int steps = 6;
      for (int s = 1; s <= steps; ++s) {
        const float t = (float)s / steps, u = 1 - t;
        lineTo(u * u * cx + 2 * u * t * qx + t * t * ex, u * u * cy + 2 * u * t * qy + t * t * ey);
      }
      cx = ex; cy = ey;
    }
    lineTo(sx, sy); /* close */
    start = end + 1;
  }
}

void add_glyph(const Font &f, int gid, std::vector<Seg> &out, const float m[4], float dx, float dy, float scale, float ox, float oy, int depth) {
  uint32_t a, b;
  if (depth > 4 || !glyph_range(f, gid, a, b)) return;
  const std::string &d = f.data;
  size_t p = f.glyf + a;
  const int nc = s16(d, p);
  p += 10;
  if (nc >= 0) {
    std::vector<int> ends;
    for (int i = 0; i < nc; ++i) ends.push_back(u16(d, p + 2 * (size_t)i));
    p += 2 * (size_t)nc;
    const int npts = nc ? ends.back() + 1 : 0;
    if (npts <= 0 || npts > 4000) return;
    p += 2 + u16(d, p); /* instructions */
    std::vector<uint8_t> flags;
    while ((int)flags.size() < npts && p < d.size()) {
      const uint8_t fl = (uint8_t)d[p++];
      flags.push_back(fl);
      if (fl & 8) { int rep = p < d.size() ? (uint8_t)d[p++] : 0; while (rep-- > 0 && (int)flags.size() < npts) flags.push_back(fl); }
    }
    if ((int)flags.size() < npts) return;
    std::vector<float> px((size_t)npts), py((size_t)npts);
    std::vector<uint8_t> on((size_t)npts);
    int v = 0;
    for (int i = 0; i < npts; ++i) {
      const uint8_t fl = flags[(size_t)i];
      if (fl & 2) { const int dv = p < d.size() ? (uint8_t)d[p++] : 0; v += (fl & 16) ? dv : -dv; }
      else if (!(fl & 16)) { v += s16(d, p); p += 2; }
      px[(size_t)i] = (float)v; on[(size_t)i] = fl & 1;
    }
    v = 0;
    for (int i = 0; i < npts; ++i) {
      const uint8_t fl = flags[(size_t)i];
      if (fl & 4) { const int dv = p < d.size() ? (uint8_t)d[p++] : 0; v += (fl & 32) ? dv : -dv; }
      else if (!(fl & 32)) { v += s16(d, p); p += 2; }
      py[(size_t)i] = (float)v;
    }
    flatten(out, px, py, on, ends, m, dx, dy, scale, ox, oy);
    return;
  }
  /* composite */
  for (int guard = 0; guard < 32 && p + 4 <= d.size(); ++guard) {
    const uint16_t fl = u16(d, p), sub = u16(d, p + 2);
    p += 4;
    float ax, ay;
    if (fl & 1) { ax = (float)s16(d, p); ay = (float)s16(d, p + 2); p += 4; }
    else { ax = (float)(int8_t)d[p]; ay = (float)(int8_t)d[p + 1]; p += 2; }
    if (!(fl & 2)) { ax = ay = 0; } /* point matching is not supported: place at origin */
    float cm[4] = {1, 0, 0, 1};
    auto f2 = [&](size_t o) { return (float)s16(d, o) / 16384.0f; };
    if (fl & 8) { cm[0] = cm[3] = f2(p); p += 2; }
    else if (fl & 0x40) { cm[0] = f2(p); cm[3] = f2(p + 2); p += 4; }
    else if (fl & 0x80) { cm[0] = f2(p); cm[1] = f2(p + 2); cm[2] = f2(p + 4); cm[3] = f2(p + 6); p += 8; }
    /* total = outer * component */
    const float tm[4] = {m[0] * cm[0] + m[2] * cm[1], m[1] * cm[0] + m[3] * cm[1], m[0] * cm[2] + m[2] * cm[3], m[1] * cm[2] + m[3] * cm[3]};
    const float tdx = dx + m[0] * ax + m[2] * ay, tdy = dy + m[1] * ax + m[3] * ay;
    add_glyph(f, sub, out, tm, tdx, tdy, scale, ox, oy, depth + 1);
    if (!(fl & 0x20)) break;
  }
}

/* UTF-8 -> code points */
std::vector<uint32_t> decode_utf8(const std::string &s) {
  std::vector<uint32_t> r;
  for (size_t i = 0; i < s.size();) {
    const uint8_t c = (uint8_t)s[i];
    uint32_t cp = 0xFFFD; int n = 1;
    if (c < 0x80) cp = c;
    else if ((c >> 5) == 6 && i + 1 < s.size()) { cp = ((c & 31u) << 6) | ((uint8_t)s[i + 1] & 63u); n = 2; }
    else if ((c >> 4) == 14 && i + 2 < s.size()) { cp = ((c & 15u) << 12) | (((uint8_t)s[i + 1] & 63u) << 6) | ((uint8_t)s[i + 2] & 63u); n = 3; }
    else if ((c >> 3) == 30 && i + 3 < s.size()) { cp = ((c & 7u) << 18) | (((uint8_t)s[i + 1] & 63u) << 12) | (((uint8_t)s[i + 2] & 63u) << 6) | ((uint8_t)s[i + 3] & 63u); n = 4; }
    r.push_back(cp);
    i += (size_t)n;
    if (r.size() >= 96) break;
  }
  return r;
}

void blur(std::vector<float> &img, int w, int h, float sigma) {
  const int R = std::max(1, (int)std::ceil(sigma * 3.0f));
  std::vector<float> k((size_t)R * 2 + 1);
  float sum = 0;
  for (int i = -R; i <= R; ++i) { const float v = std::exp(-(float)(i * i) / (2 * sigma * sigma)); k[(size_t)(i + R)] = v; sum += v; }
  for (float &v : k) v /= sum;
  std::vector<float> tmp(img.size(), 0.0f);
  for (int y = 0; y < h; ++y) {
    const float *row = &img[(size_t)y * w];
    float *o = &tmp[(size_t)y * w];
    for (int x = 0; x < w; ++x) {
      float a = 0;
      const int lo = std::max(0, x - R), hi = std::min(w - 1, x + R);
      for (int i = lo; i <= hi; ++i) a += row[i] * k[(size_t)(i - x + R)];
      o[x] = a;
    }
  }
  for (int x = 0; x < w; ++x)
    for (int y = 0; y < h; ++y) {
      float a = 0;
      const int lo = std::max(0, y - R), hi = std::min(h - 1, y + R);
      for (int i = lo; i <= hi; ++i) a += tmp[(size_t)i * w + x] * k[(size_t)(i - y + R)];
      img[(size_t)y * w + x] = a;
    }
}

uint32_t crc_table[256];
bool crc_ready = false;
uint32_t crc32_of(const uint8_t *p, size_t n, uint32_t c = 0) {
  if (!crc_ready) {
    for (uint32_t i = 0; i < 256; ++i) { uint32_t v = i; for (int k = 0; k < 8; ++k) v = (v & 1) ? 0xEDB88320u ^ (v >> 1) : v >> 1; crc_table[i] = v; }
    crc_ready = true;
  }
  c = ~c;
  for (size_t i = 0; i < n; ++i) c = crc_table[(c ^ p[i]) & 255] ^ (c >> 8);
  return ~c;
}
void put32(std::string &s, uint32_t v) { s.push_back((char)(v >> 24)); s.push_back((char)(v >> 16)); s.push_back((char)(v >> 8)); s.push_back((char)v); }
void chunk(std::string &png, const char *type, const std::string &body) {
  put32(png, (uint32_t)body.size());
  std::string tb(type, 4); tb += body;
  png += tb;
  put32(png, crc32_of((const uint8_t *)tb.data(), tb.size()));
}

/* RGBA8 PNG, stored (uncompressed) deflate blocks */
std::string encode_png(const std::vector<uint8_t> &rgba, int w, int h) {
  std::string raw;
  raw.reserve((size_t)h * (1 + (size_t)w * 4));
  for (int y = 0; y < h; ++y) { raw.push_back(0); raw.append((const char *)&rgba[(size_t)y * w * 4], (size_t)w * 4); }
  std::string z; z.push_back(0x78); z.push_back(0x01);
  size_t pos = 0;
  while (pos < raw.size() || raw.empty()) {
    const size_t n = std::min<size_t>(65535, raw.size() - pos);
    const bool last = pos + n >= raw.size();
    z.push_back(last ? 1 : 0);
    z.push_back((char)(n & 255)); z.push_back((char)(n >> 8)); z.push_back((char)(~n & 255)); z.push_back((char)((~n >> 8) & 255));
    z.append(raw, pos, n);
    pos += n;
    if (last) break;
  }
  uint32_t A = 1, B = 0;
  for (size_t i = 0; i < raw.size(); ++i) { A = (A + (uint8_t)raw[i]) % 65521u; B = (B + A) % 65521u; }
  put32(z, (B << 16) | A);
  std::string png("\x89PNG\r\n\x1a\n", 8), ihdr;
  put32(ihdr, (uint32_t)w); put32(ihdr, (uint32_t)h);
  ihdr.push_back(8); ihdr.push_back(6); ihdr.push_back(0); ihdr.push_back(0); ihdr.push_back(0);
  chunk(png, "IHDR", ihdr);
  chunk(png, "IDAT", z);
  chunk(png, "IEND", std::string());
  return png;
}

uint64_t fnv(const std::string &s, uint64_t h = 1469598103934665603ull) { for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; } return h; }

void clean_cache_once(const std::string &dir) {
  if (g_cleaned) return;
  g_cleaned = true;
  DIR *d = opendir(dir.c_str());
  if (!d) return;
  std::vector<std::string> names;
  while (dirent *e = readdir(d)) if (e->d_name[0] != '.') names.push_back(e->d_name);
  closedir(d);
  /* V81: only when it has grown big, and (see zt_xmb_glow_make_at) BEFORE this session hands out its first picture: cleaning it
     at the first NEW picture deleted pictures the Home was already showing ("picture not found" boxes behind the names) */
  if (names.size() > 3000) for (const std::string &n : names) unlink((dir + "/" + n).c_str());
}

} // namespace

std::string zt_png_rgba(const std::vector<uint8_t> &rgba, int w, int h) { return encode_png(rgba, w, h); }

bool zt_xmb_glow_make_at(const std::string &font_path, const std::string &out_dir, const std::string &text, int px, int lh, ZtXmbGlow &out) {
  if (text.empty() || text.size() > 400 || px < 10 || px > 80 || lh < 10 || lh > 140) return false;
  pthread_mutex_lock(&g_mu);
  struct Unlock { ~Unlock() { pthread_mutex_unlock(&g_mu); } } unlock;
  if (!load_font(font_path)) return false;
  const Font &f = g_font;
  const float scale = (float)px / (float)f.units;
  const std::vector<uint32_t> cps = decode_utf8(text);
  std::vector<int> gids; std::vector<float> xs;
  float pen = 0;
  for (uint32_t cp : cps) {
    int g = glyph_of(f, cp);
    if (cp == 0xA0) g = glyph_of(f, 32);
    gids.push_back(g); xs.push_back(pen);
    pen += (float)advance_of(f, g) * scale;
  }
  const int tw = (int)std::ceil(pen);
  if (tw < 1 || tw > 1000) return false;
  const int pad = 24;
  const int w = tw + 2 * pad, h = lh + 2 * pad;
  char name[96];
  snprintf(name, sizeof(name), "/g2_%016llx_%d_%d.png", (unsigned long long)fnv(text, fnv(font_path)), px, lh);
  out.path = out_dir + name; out.w = w; out.h = h; out.tw = tw; out.pad = pad;
  clean_cache_once(out_dir);   /* V81: first, before any picture of this session is handed out */
  struct stat st;
  if (stat(out.path.c_str(), &st) == 0 && st.st_size > 100) return true;

  zt_mkdirs(out_dir);
  /* the baseline. V39, measured on the console (4K capture, "Call of Duty: Black Ops III" at 36 px / line 45): the PS5 text engine puts the
   * baseline at the top of the line box + the font's OS/2 winAscent (Rodin: 1029 / 1000 em); the hhea-centred guess of V38 sat 3.6 px too
   * high (the halo looked like it was ABOVE the letters). Fonts without OS/2 keep the centred hhea rule. */
  const float asc = (float)f.asc * scale, dsc = (float)f.desc * scale;
  const float base = f.winAsc > 0 ? (float)pad + (float)f.winAsc * scale + GLOW_BASE_DY
                                  : (float)pad + ((float)lh - (asc - dsc)) * 0.5f + asc;
  std::vector<Seg> segs;
  const float ident[4] = {1, 0, 0, 1};
  for (size_t i = 0; i < gids.size(); ++i) if (gids[i] > 0 || cps[i] > 32) add_glyph(f, gids[i], segs, ident, 0, 0, scale, (float)pad + xs[i], base, 0);

  /* coverage: 4 sub-scanlines per pixel, exact horizontal coverage, non-zero winding */
  std::vector<float> cov((size_t)w * h, 0.0f);
  const int SS = 4;
  std::vector<std::vector<std::pair<float, int>>> rows((size_t)h * SS);
  for (const Seg &s : segs) {
    if (s.y0 == s.y1) continue;
    const int dir = s.y1 > s.y0 ? 1 : -1;
    const float ya = std::min(s.y0, s.y1), yb = std::max(s.y0, s.y1);
    const int r0 = std::max(0, (int)std::ceil(ya * SS - 0.5f)), r1 = std::min(h * SS - 1, (int)std::floor(yb * SS - 0.5f));
    for (int r = r0; r <= r1; ++r) {
      const float y = ((float)r + 0.5f) / SS, t = (y - s.y0) / (s.y1 - s.y0);
      rows[(size_t)r].push_back({s.x0 + t * (s.x1 - s.x0), dir});
    }
  }
  for (int r = 0; r < h * SS; ++r) {
    auto &cr = rows[(size_t)r];
    if (cr.size() < 2) continue;
    std::sort(cr.begin(), cr.end());
    float *row = &cov[(size_t)(r / SS) * w];
    int wind = 0;
    for (size_t i = 0; i + 1 < cr.size(); ++i) {
      wind += cr[i].second;
      if (!wind) continue;
      const float xa = std::max(0.0f, cr[i].first), xb = std::min((float)w, cr[i + 1].first);
      if (xb <= xa) continue;
      const int ia = (int)xa, ib = std::min(w - 1, (int)xb);
      for (int x = ia; x <= ib; ++x) row[x] += (std::min(xb, (float)x + 1) - std::max(xa, (float)x)) / SS;
    }
  }
  for (float &v : cov) v = std::min(1.0f, v);

  std::vector<float> tight = cov, wide = cov;
  blur(tight, w, h, 2.2f);
  blur(wide, w, h, 6.5f);
  std::vector<uint8_t> rgba((size_t)w * h * 4);
  for (size_t i = 0; i < cov.size(); ++i) {
    const float a = std::min(1.0f, GLOW_K1 * tight[i] + GLOW_K2 * wide[i]);
    const uint8_t A = (uint8_t)std::lround(a * 255.0f);
    rgba[i * 4] = rgba[i * 4 + 1] = rgba[i * 4 + 2] = 255; rgba[i * 4 + 3] = A;
  }
  const std::string png = encode_png(rgba, w, h);
  const std::string tmp = out.path + ".tmp";
  FILE *fp = fopen(tmp.c_str(), "wb");
  if (!fp) return false;
  const bool wrote = fwrite(png.data(), 1, png.size(), fp) == png.size();
  fclose(fp);
  if (!wrote || rename(tmp.c_str(), out.path.c_str()) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}

bool zt_xmb_glow_make(const std::string &text, int px, int lh, ZtXmbGlow &out) {
  const std::string out_dir = std::string(ZT_CACHE) + "/xmbglow";
  const char *names[] = {"ps3-rodin-regular.ttf", "ps3-rodin-light.ttf"};
  for (const char *n : names) {
    const std::string a = zt_theme_dir("fonts") + "/" + n, b = std::string(ZT_THEMES) + "/Default/fonts/" + n;
    struct stat st;
    if (stat(a.c_str(), &st) == 0 && zt_xmb_glow_make_at(a, out_dir, text, px, lh, out)) return true;
    if (stat(b.c_str(), &st) == 0 && zt_xmb_glow_make_at(b, out_dir, text, px, lh, out)) return true;
  }
  return false;
}
