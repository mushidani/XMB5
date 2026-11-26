// Compiled and executed on Linux ONLY to test safe binary auto-extraction.
#include "zt_storage.hpp"
#include "zt_xmb_media.hpp"
#include <cassert>
#include <filesystem>
#include <string>
#include <fstream>
#include <cstdio>
#include <cstdarg>
namespace fs=std::filesystem;
std::string zt_theme_dir(const char *kind) { return std::string("/tmp/zt_xmb_host_install/wallpapers/")+kind; }
void zt_mkdirs(const std::string &s) {fs::create_directories(s);}
extern "C" {
int sceKernelLoadStartModule(const char *, size_t, const void *, uint32_t, uint32_t, int *) { return -1; }
void *kernel_dynlib_dlsym(int, int, const char *) { return nullptr; }
}
void zt_log(const char *fmt,...) {
  va_list ap; va_start(ap,fmt);vfprintf(stderr,fmt,ap);fputc('\n',stderr);va_end(ap);
}
int main() {
  fs::remove_all("/tmp/zt_xmb_host_install");
  zt_xmb_media_install();
  auto d=zt_theme_dir("wallpapers");
  for(const char *name:{"PS5XMB_XMBWEB_Wave_Day.mp4","PS5XMB_XMBWEB_Wave_Night.mp4","PS5XMB_XMBWEB_Wave_Day_Blur.mp4","PS5XMB_XMBWEB_Wave_Night_Blur.mp4"}) {
    const auto path=fs::path(d)/name;
    assert(fs::exists(path) && fs::file_size(path)>2000);
    assert(!fs::exists(std::string(path)+".xmb-part"));
  }
  // Re-running must not delete/modify original or create temporary files.
  const auto bg=fs::path(d)/"PS5XMB_XMBWEB_Wave_Day.mp4";
  auto mtime=fs::last_write_time(bg);
  zt_xmb_media_install();
  assert(fs::last_write_time(bg)==mtime);
  puts("PASS: one ELF auto-extracted the 2 xmb-web wave loops + their blurred copies, safe repeat, no stale .part files");
}
