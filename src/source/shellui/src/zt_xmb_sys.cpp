/* V60: real PS5 values for the XMB's Settings > System Settings (read-only): console name, system language, firmware, network
 * (IP / MAC / wired or Wi-Fi) and system storage. Every system function is looked up at run time in the already loaded system
 * libraries (no link dependency); anything that cannot be read is simply left out of the JSON and the XMB shows nothing for it. */
#include "zt_xmb_users.hpp"
#include "zt_log.hpp"

#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include <sys/statvfs.h>
#include <sys/types.h>
#include <unistd.h>

#include <string>

#ifndef ZT_SYS_HOST_TEST
#include "ps5/kernel.h"
#endif

namespace {
using ParamStrFn = int (*)(int, char *, size_t);
using ParamIntFn = int (*)(int, int *);
using NetInfoFn = int (*)(int, void *);
ParamStrFn g_str = nullptr;
ParamIntFn g_int = nullptr;
NetInfoFn g_net = nullptr;
bool g_resolved = false;

constexpr int kParamLang = 1, kParamSystemName = 6;                    /* SCE_SYSTEM_SERVICE_PARAM_ID_LANG / _SYSTEM_NAME */
constexpr int kNetDevice = 1, kNetEther = 2, kNetIp = 14;              /* SCE_NET_CTL_INFO_DEVICE / _ETHER_ADDR / _IP_ADDRESS */

void resolve() {
  if (g_resolved) return;
  g_resolved = true;
#ifndef ZT_SYS_HOST_TEST
  uint32_t h = 0;
  if (kernel_dynlib_handle(getpid(), "libSceSystemService.sprx", &h) == 0) {
    g_str = reinterpret_cast<ParamStrFn>(kernel_dynlib_dlsym(-1, (int)h, "sceSystemServiceParamGetString"));
    g_int = reinterpret_cast<ParamIntFn>(kernel_dynlib_dlsym(-1, (int)h, "sceSystemServiceParamGetInt"));
  }
  h = 0;
  if (kernel_dynlib_handle(getpid(), "libSceNetCtl.sprx", &h) == 0)
    g_net = reinterpret_cast<NetInfoFn>(kernel_dynlib_dlsym(-1, (int)h, "sceNetCtlGetInfo"));
  zt_log("PS5XMB: SYSINFO functions: name/lang %s, network %s", g_str && g_int ? "yes" : "no", g_net ? "yes" : "no");
#endif
}

std::string json_str(const char *s) {
  std::string o = "\"";
  for (const unsigned char *c = (const unsigned char *)s; *c; ++c) {
    if (*c == '"' || *c == '\\') { o += '\\'; o += (char)*c; }
    else if (*c < 0x20) { char b[8]; snprintf(b, sizeof(b), "\\u%04x", *c); o += b; }
    else o += (char)*c;
  }
  return o + "\"";
}
} // namespace

std::string zt_xmb_sys_json() {
  resolve();
  std::string o = "{";
  auto add = [&](const char *k, const std::string &v) { o += (o.size() > 1 ? "," : ""); o += json_str(k) + ":" + v; };
  if (g_str) {
    char name[256] = {};
    if (g_str(kParamSystemName, name, sizeof(name) - 1) == 0 && name[0]) add("name", json_str(name));
  }
  if (g_int) {
    int lang = -1;
    if (g_int(kParamLang, &lang) == 0 && lang >= 0) add("lang", std::to_string(lang));
  }
  if (!zt_fw_text().empty()) add("fw", json_str(zt_fw_text().c_str()));
  if (g_net) {
    alignas(16) unsigned char info[512];
    memset(info, 0, sizeof(info));
    if (g_net(kNetIp, info) == 0 && info[0]) { info[15] = 0; add("ip", json_str((const char *)info)); }
    memset(info, 0, sizeof(info));
    if (g_net(kNetEther, info) == 0 && (info[0] | info[1] | info[2] | info[3] | info[4] | info[5])) {
      char mac[32];
      snprintf(mac, sizeof(mac), "%02X:%02X:%02X:%02X:%02X:%02X", info[0], info[1], info[2], info[3], info[4], info[5]);
      add("mac", json_str(mac));
    }
    memset(info, 0, sizeof(info));
    if (g_net(kNetDevice, info) == 0) add("wifi", *(const uint32_t *)info == 1 ? "true" : "false");
  }
  struct statvfs sv {};
  if (statvfs("/user", &sv) == 0 && sv.f_blocks) {
    const unsigned long long unit = sv.f_frsize ? sv.f_frsize : sv.f_bsize;
    add("free", std::to_string((unsigned long long)sv.f_bavail * unit));
    add("total", std::to_string((unsigned long long)sv.f_blocks * unit));
  }
  return o + "}";
}
