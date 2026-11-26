/* XMB5 fork: deliberately disable the upstream ZhiThemes updater.
   Original framework by Zhi, GPL-3.0-or-later. */
#include "zt_update.hpp"
void zt_update_start() {}
std::string zt_update_json() { return "{\"available\":false,\"auto\":false,\"state\":\"disabled\"}"; }
std::string zt_update_cmd(const std::string &) { return "XMB5 is updated manually using XMB5.elf"; }
