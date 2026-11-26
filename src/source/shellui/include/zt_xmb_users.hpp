#pragma once
#include <string>
/* V43: the console's users as JSON: [{"id":..,"slot":..,"fg":true|false,"name":"..","pic":"/path/to.png" or ""}] */
std::string zt_xmb_users_json();

/* V48: the console's captures (screenshots) as JSON, newest first: [{"p":"/user/av_contents/photo/.../x.png","t":mtime}] */
std::string zt_xmb_photos_json();
/* V78: the console's captured videos, newest first: [{"n":"<file name>","i":<index for /c/<index>.mp4>,"t":mtime,"s":bytes}];
   the path of video <index> of the last list ("" when there is none) */
std::string zt_xmb_videos_json();
std::string zt_xmb_video_path(int index);

/* V51: the XMB settings file (ZT_DIR/PS5XMB_settings.txt): all "key=value" lines; set one (false on a bad key / value or write error) */
std::string zt_xmb_prefs_get();
bool zt_xmb_prefs_set(const std::string &key, const std::string &value);

/* V60: real PS5 values for System Settings (read-only): {"name","lang","fw","ip","mac","wifi","free","total"} - missing ones left out */
std::string zt_xmb_sys_json();

/* V63: installed titles for the XMB's Game category: {"PPSA01234":{"d":<install time, s>,"s":<bytes>}} ("s" only with size, one title) */
std::string zt_xmb_appinfo_json(const std::string &ids, bool size);
/* V68: the XMB's game folders (JSON list, ZT_DIR/PS5XMB_folders.json): "[]" when there are none; set: false on a bad body / write error */
std::string zt_xmb_folders_get();
bool zt_xmb_folders_set(const std::string &json);
/* V73: "folders" or "columns" (the XMB's custom columns, PS5XMB_columns.json) */
std::string zt_xmb_list_get(const char *which);
bool zt_xmb_list_set(const char *which, const std::string &json);
/* V73: the game / app running now: {"id":"PPSA01234","app":<app id>} or {} ; close it (only when it is that title): true when asked */
std::string zt_xmb_running_json();
bool zt_xmb_close_app(const std::string &title_id);
