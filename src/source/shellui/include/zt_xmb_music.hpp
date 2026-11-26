#pragma once
#include <stdint.h>
#include <string>

/* V40: a game's own music (snd0.at9), decoded with libSceAudiodec and mixed into the XMB audio port.
 * paths: candidates separated by '|' (file:// and ?ts= are accepted); the first readable ATRAC9 file plays, looped, faded in.
 * Returns 202 queued, 404 no readable file, 415 not ATRAC9, 503 decoder unavailable on this firmware,
 * 409 (V48) a game / app is running: no title music over it. */
int zt_xmb_music_play(const std::string &paths, int volume);
void zt_xmb_music_shutdown();       /* stop and join both native music workers before module unload */
void zt_xmb_music_stop();            /* fades out */
bool zt_xmb_music_active();          /* something is (still) audible: the audio worker keeps running */
bool zt_xmb_music_failed();
std::string zt_xmb_music_status();   /* V42: last result in a few words (shown in the XMB settings) */
void zt_xmb_music_mix(int32_t *acc, int frames);

/* V47: one line into /user/data/ZhiThemes/PS5XMB_music_status.txt (diagnostics the user can send) */
void zt_xmb_note(const std::string &line);

#ifdef ZT_MUSIC_HOST_TEST
void zt_xmb_music_test_bigapp(int (*fn)(void), int (*title)(int, char *));
#endif
