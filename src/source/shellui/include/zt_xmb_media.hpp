#pragma once
// One-ELF XMB media installation: auto-extract the binary resources embedded
// in this module to the active theme's wallpapers before ReactNative starts.
void zt_xmb_media_install();
// V83.8: install built-in font + original 3-slice glow after particles.
void zt_xmb_defaults_install();

// Native one-shot AudioOut S16LE 48 kHz stereo. Triggered by localhost
// HomeUI event requests, not by a competing RCTVideoPS decoder.
// Return false if the native audio backend cannot start.
bool zt_xmb_sfx_play(int which); /* 1 cursor, 2 category, 3 decide, 4 cancel, 5 ok, 6 ng (mixed, up to 8 voices) */
bool zt_xmb_sfx_warm(bool on); /* keep the audio port open while the XMB is on screen (silence between sounds) */
void zt_xmb_sfx_kick();          /* V40: wake the audio worker (game music started) */
void zt_xmb_sfx_shutdown();
