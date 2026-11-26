#pragma once
#include <stdint.h>
#include <string>
#include <vector>

/* V38: the PS3-style letter-hugging text glow, rasterised natively from the XMB font (white + alpha PNG, cached on disk). */
struct ZtXmbGlow {
  std::string path; /* PNG file */
  int w = 0, h = 0; /* image size in px */
  int tw = 0;       /* text advance width in px (unpadded) */
  int pad = 0;      /* distance from the image edge to the text box (left and top) */
};

/* text: UTF-8, px: font size (10..80), lh: line height the text is laid out with (10..140). Returns false when the font / folder is not usable. */
bool zt_xmb_glow_make(const std::string &text, int px, int lh, ZtXmbGlow &out);

/* explicit font / output folder (host tests) */
bool zt_xmb_glow_make_at(const std::string &font_path, const std::string &out_dir, const std::string &text, int px, int lh, ZtXmbGlow &out);

/* Art validation for the focus background: 0 = usable picture, 1 = blank (fully transparent / flat), 2 = missing or unreadable. Only /user/appmeta and /user/app. */
int zt_xmb_art_check(const std::string &path);

/* RGBA8 -> PNG file bytes (stored deflate) */
std::string zt_png_rgba(const std::vector<uint8_t> &rgba, int w, int h);

/* V41: small, properly filtered copies of a game / app icon (the PS5 draws a 512 px icon0 shrunk to 78 px without mipmaps: it shimmered
 * while the list moved). Writes <cache>/xmbicons/<hash>_<size>.png for each size and returns the paths (empty on failure). */
bool zt_xmb_icon_levels(const std::string &path, std::string &small_png, std::string &big_png);

/* V43: any readable PNG / JPEG -> a filtered box x box PNG */
bool zt_xmb_square_png(const std::string &src, const std::string &dst, int box, bool round = false);
