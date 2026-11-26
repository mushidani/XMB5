/* V38: is a game / app background picture worth showing? (focus background of the XMB)
 * 0 = usable, 1 = blank (transparent or one flat colour), 2 = missing / unreadable / not a PNG or JPEG. */
#include "zt_xmb_glow.hpp"
#include "zt_storage.hpp"

#include <sys/stat.h>

#include <algorithm>
#include <cmath>
#include <unistd.h>
#include <cstdio>
#include <cstdlib>
#include <string>
#include <vector>

#if defined(__clang__)
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Weverything"
#elif defined(__GNUC__)
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wall"
#pragma GCC diagnostic ignored "-Wextra"
#pragma GCC diagnostic ignored "-Wpedantic"
#pragma GCC diagnostic ignored "-Wunused-function"
#pragma GCC diagnostic ignored "-Wmaybe-uninitialized"
#endif
#define STB_IMAGE_STATIC
#define STB_IMAGE_IMPLEMENTATION
#define STBI_NO_STDIO
#define STBI_ONLY_PNG
#define STBI_ONLY_JPEG
#define STBI_NO_LINEAR
#define STBI_NO_HDR
#include "zt_third/stb_image.h"
#if defined(__clang__)
#pragma clang diagnostic pop
#elif defined(__GNUC__)
#pragma GCC diagnostic pop
#endif

namespace {
bool path_ok(const std::string &p) {
  if (p.size() < 12 || p.size() > 200 || p.find("..") != std::string::npos || p.find('\0') != std::string::npos) return false;
#ifdef ZT_ART_TEST_ANY_PATH
  return true;
#endif
  return p.compare(0, 13, "/user/appmeta") == 0 || p.compare(0, 10, "/user/app/") == 0 ||
         p.compare(0, sizeof(ZT_CACHE "/xmbusers/") - 1, ZT_CACHE "/xmbusers/") == 0 ||   /* V43: user pictures made by zt_xmb_users */
         p.compare(0, 24, "/user/av_contents/photo/") == 0;                                  /* V48: screenshots (Photo > Photos) */
}
}

int zt_xmb_art_check(const std::string &in) {
  std::string path = in;
  if (path.compare(0, 7, "file://") == 0) path = path.substr(7);
  const size_t q = path.find('?');
  if (q != std::string::npos) path.resize(q);
  if (!path_ok(path)) return 2;
  struct stat st;
  if (stat(path.c_str(), &st) != 0 || !S_ISREG(st.st_mode) || st.st_size < 64 || st.st_size > 48 * 1024 * 1024) return 2;
  /* music files (snd0.at9): only their existence matters */
  if (path.size() > 4 && path.compare(path.size() - 4, 4, ".at9") == 0) return 0;
  FILE *f = fopen(path.c_str(), "rb");
  if (!f) return 2;
  std::string buf((size_t)st.st_size, '\0');
  const size_t got = fread(&buf[0], 1, buf.size(), f);
  fclose(f);
  if (got != buf.size()) return 2;
  int w = 0, h = 0, n = 0;
  if (!stbi_info_from_memory((const stbi_uc *)buf.data(), (int)buf.size(), &w, &h, &n) || w < 16 || h < 16 || (long long)w * h > 40000000LL) return 2;
  /* Small PNGs can contain valid low-opacity artwork; inspect pixels instead. */
  int cw = 0, ch = 0, cn = 0;
  stbi_uc *px = stbi_load_from_memory((const stbi_uc *)buf.data(), (int)buf.size(), &cw, &ch, &cn, 4);
  if (!px) return 2;
  double sum = 0, sum2 = 0; long long cnt = 0, vis = 0, total = 0;
  const int sx = cw >= 256 ? cw / 64 : 1, sy = ch >= 256 ? ch / 64 : 1;
  for (int y = 0; y < ch; y += sy)
    for (int x = 0; x < cw; x += sx) {
      const stbi_uc *p = px + ((size_t)y * cw + x) * 4;
      ++total;
      if (p[3] == 0) continue; /* nonzero opacity is intentional artwork */
      ++vis;
      const double l = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
      sum += l; sum2 += l * l; ++cnt;
    }
  stbi_image_free(px);
  if (total == 0 || vis == 0) return 1; /* completely transparent only */
  const double mean = sum / (double)cnt, var = sum2 / (double)cnt - mean * mean;
  if (var < 0.35) return 1; /* nearly uniform placeholder; preserve faint backgrounds */
  return 0;
}

namespace {
/* area-average downscale into a box x box square (aspect kept, centred), premultiplied so edges do not darken */
std::vector<uint8_t> box_down(const stbi_uc *px, int w, int h, int box) {
  std::vector<uint8_t> out((size_t)box * box * 4, 0);
  const double k = (double)box / (double)(w > h ? w : h);
  const int ow = (int)(w * k + 0.5), oh = (int)(h * k + 0.5), ox = (box - ow) / 2, oy = (box - oh) / 2;
  const double sx = (double)w / ow, sy = (double)h / oh;
  for (int y = 0; y < oh; ++y) {
    const double y0 = y * sy, y1 = y0 + sy;
    for (int x = 0; x < ow; ++x) {
      const double x0 = x * sx, x1 = x0 + sx;
      double acc[4] = {0, 0, 0, 0}, wsum = 0;
      for (int yy = (int)y0; yy < (int)std::ceil(y1) && yy < h; ++yy) {
        const double wy = std::min(y1, (double)yy + 1) - std::max(y0, (double)yy);
        for (int xx = (int)x0; xx < (int)std::ceil(x1) && xx < w; ++xx) {
          const double wx = std::min(x1, (double)xx + 1) - std::max(x0, (double)xx), wgt = wx * wy;
          const stbi_uc *p = px + ((size_t)yy * w + xx) * 4;
          const double a = p[3] / 255.0;
          acc[0] += p[0] * a * wgt; acc[1] += p[1] * a * wgt; acc[2] += p[2] * a * wgt; acc[3] += p[3] * wgt;
          wsum += wgt;
        }
      }
      uint8_t *o = &out[((size_t)(y + oy) * box + (x + ox)) * 4];
      const double A = wsum > 0 ? acc[3] / wsum : 0;
      for (int c = 0; c < 3; ++c) o[c] = (uint8_t)(A > 0.5 ? std::min(255.0, acc[c] / wsum / (A / 255.0) + 0.5) : 0);
      o[3] = (uint8_t)std::min(255.0, A + 0.5);
    }
  }
  return out;
}
uint64_t fnv64(const std::string &s) { uint64_t h = 1469598103934665603ull; for (unsigned char c : s) { h ^= c; h *= 1099511628211ull; } return h; }
bool write_file(const std::string &p, const std::string &data) {
  const std::string tmp = p + ".tmp";
  FILE *f = fopen(tmp.c_str(), "wb");
  if (!f) return false;
  const bool ok = fwrite(data.data(), 1, data.size(), f) == data.size();
  fclose(f);
  if (!ok || rename(tmp.c_str(), p.c_str()) != 0) { unlink(tmp.c_str()); return false; }
  return true;
}
}

bool zt_xmb_icon_levels(const std::string &in, std::string &small_png, std::string &big_png) {
  std::string path = in;
  if (path.compare(0, 7, "file://") == 0) path = path.substr(7);
  const size_t q = path.find('?');
  if (q != std::string::npos) path.resize(q);
  if (!path_ok(path)) return false;
  struct stat st;
  if (stat(path.c_str(), &st) != 0 || !S_ISREG(st.st_mode) || st.st_size < 64 || st.st_size > 64 * 1024 * 1024) return false;   /* V48: 4K screenshots */
#ifdef ZT_ART_TEST_ANY_PATH
  const std::string dir = "/tmp/zt_xmbicons";
#else
  const std::string dir = std::string(ZT_CACHE) + "/xmbicons";
#endif
  char name[64];
  snprintf(name, sizeof(name), "/i_%016llx_%lld", (unsigned long long)fnv64(path), (long long)st.st_size);
  small_png = dir + name + "_96.png";
  big_png = dir + name + "_180.png";
  struct stat a, b;
  if (stat(small_png.c_str(), &a) == 0 && stat(big_png.c_str(), &b) == 0 && a.st_size > 100 && b.st_size > 100) return true;
  FILE *f = fopen(path.c_str(), "rb");
  if (!f) return false;
  std::string buf((size_t)st.st_size, '\0');
  const size_t got = fread(&buf[0], 1, buf.size(), f);
  fclose(f);
  if (got != buf.size()) return false;
  int w = 0, h = 0, n = 0;
  if (!stbi_info_from_memory((const stbi_uc *)buf.data(), (int)buf.size(), &w, &h, &n) || w < 8 || h < 8 || (long long)w * h > 34000000LL) return false;
  stbi_uc *px = stbi_load_from_memory((const stbi_uc *)buf.data(), (int)buf.size(), &w, &h, &n, 4);
  if (!px) return false;
  mkdir(dir.c_str(), 0777);
  const bool ok = write_file(small_png, zt_png_rgba(box_down(px, w, h, 96), 96, 96)) && write_file(big_png, zt_png_rgba(box_down(px, w, h, 180), 180, 180));
  stbi_image_free(px);
  return ok;
}

/* V43: any readable PNG / JPEG -> a filtered box x box PNG (user pictures from the system's profile cache) */
bool zt_xmb_square_png(const std::string &src, const std::string &dst, int box, bool round) {
  struct stat st;
  if (stat(src.c_str(), &st) != 0 || !S_ISREG(st.st_mode) || st.st_size < 64 || st.st_size > 16 * 1024 * 1024) return false;
  FILE *f = fopen(src.c_str(), "rb");
  if (!f) return false;
  std::string buf((size_t)st.st_size, '\0');
  const size_t got = fread(&buf[0], 1, buf.size(), f);
  fclose(f);
  if (got != buf.size()) return false;
  int w = 0, h = 0, n = 0;
  stbi_uc *px = stbi_load_from_memory((const stbi_uc *)buf.data(), (int)buf.size(), &w, &h, &n, 4);
  if (!px) return false;
  std::vector<uint8_t> v;
  if (w >= 8 && h >= 8) v = box_down(px, w, h, box);
  stbi_image_free(px);
  if (v.size() != (size_t)box * box * 4) return false;
  if (round) {   /* V78: a round picture (the user's profile picture): transparent outside the circle, a smooth 1 px edge */
    const double c = box / 2.0, r = c - 1.0;
    for (int y = 0; y < box; ++y)
      for (int x = 0; x < box; ++x) {
        const double d = std::sqrt((x + 0.5 - c) * (x + 0.5 - c) + (y + 0.5 - c) * (y + 0.5 - c));
        const double a = std::min(1.0, std::max(0.0, r + 0.5 - d));
        uint8_t *q = &v[((size_t)y * box + x) * 4];
        q[3] = (uint8_t)std::lround(q[3] * a);
      }
  }
  return write_file(dst, zt_png_rgba(v, box, box));
}
