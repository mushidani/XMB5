
#include <atomic>
#include <cassert>
#include <cctype>
#include <cstdio>
#include <cstring>
#include <cstdlib>
#include <mutex>
#include <string>
#include <vector>
#include <map>
#include <sys/stat.h>
#include <unistd.h>
#define ZT_FONT_PENDING "/tmp/xmb5_v8313_test_pending_never_created"
using std::string;
std::map<std::string, std::string> config;
std::string test_root;
std::string active_theme = "Default";
std::string theme_string(const std::string&, const char *key) {
 auto it=config.find(key); return it==config.end() ? "" : it->second;
}
double theme_value(const std::string&, const char* key, double fallback) {
 auto it=config.find(key); if(it==config.end()) return fallback;
 return it->second=="true" ? 1.0 : it->second=="false" ? 0.0 : fallback;
}
std::string zt_theme_dir_of(const std::string& name, const char* kind) {
 return test_root + "/" + name + "/" + kind;
}
std::string font_path(const std::string &name, const char *) {
 if(name.empty()) return "";
 std::string p=zt_theme_dir_of(active_theme, "fonts")+"/"+name;
 struct stat st {};
 if(stat(p.c_str(), &st)==0 && st.st_size>0) return p;
 return "";
}
void zt_log(const char*,...) {}
std::mutex g_font_lock;
std::string g_sysfont;
std::string g_elemfont;
std::string g_style_fonts[4];
std::string g_sysfont_value;
std::atomic<bool> g_sysfont_apply{false};
const char *const kStyleNames[4]={"","Bold","Italic","BoldItalic"};
__STYLE__
__PROD__
__VARIANT__
static void touch(const std::string& p) {
 FILE *f=fopen(p.c_str(),"wb"); assert(f); fputs("TTF TEST DUMMY",f); fclose(f);
}
int main() {
 char tmp[]="/tmp/xmb-font-v8313-XXXXXX"; char *dir=mkdtemp(tmp); assert(dir);
 test_root=dir;
 std::string def=test_root+"/Default", custom=test_root+"/Custom";
 assert(mkdir(def.c_str(),0700)==0);
 assert(mkdir((def+"/fonts").c_str(),0700)==0);
 assert(mkdir(custom.c_str(),0700)==0);
 assert(mkdir((custom+"/fonts").c_str(),0700)==0);
 const std::string fontdir=def+"/fonts";
 touch(fontdir+"/ps3-rodin-regular.ttf");
 touch(fontdir+"/ps3-rodin-bold.ttf");
 touch(fontdir+"/ps3-rodin-light.ttf");
 touch(custom+"/fonts/mycustom.ttf");
 config["xmbHomeOn"]="true";
 config["systemFont"]="";
 config["systemFontMissing"]="same";

 apply_system_font("default");
 assert(theme_system_font("SST-Roman.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-Light.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-Medium.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-Bold.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-Italic.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-BoldItalic.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(g_sysfont_apply.exchange(false));
 printf("PASS built-in Rodin Regular for all weights\n");

 // Even if weight-specific files are installed, they are never selected.
 config["systemFontBold"]="ps3-rodin-bold.ttf";
 config["elementFont"]="ps3-rodin-light.ttf";
 apply_system_font("single-anyway");
 assert(theme_system_font("SST-Bold.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-BoldItalic.otf")==fontdir+"/ps3-rodin-regular.ttf");
 config["systemFontBold"]="";
 config["elementFont"]="";
 config["systemFont"]="ps3-rodin-regular.ttf";
 apply_system_font("explicit-regular");
 assert(theme_system_font("SST-Light.otf")==fontdir+"/ps3-rodin-regular.ttf");
 assert(theme_system_font("SST-Bold.otf")==fontdir+"/ps3-rodin-regular.ttf");
 config["systemFont"]="";
 active_theme="Custom";
 config["systemFont"]="mycustom.ttf";
 apply_system_font("custom");
 assert(theme_system_font("SST-Roman.otf")==custom+"/fonts/mycustom.ttf");
 assert(theme_system_font("SST-Light.otf")==custom+"/fonts/mycustom.ttf");
 assert(g_sysfont_apply.exchange(false));
 printf("PASS custom theme font overrides Rodin\n");

 config["systemFont"]="";
 apply_system_font("custom");
 assert(theme_system_font("SST-Roman.otf")==fontdir+"/ps3-rodin-regular.ttf");
 printf("PASS Default/fonts assets work across active themes\n");

 config["xmbHomeOn"]="false";
 apply_system_font("off");
 assert(theme_system_font("SST-Roman.otf").empty());
 assert(theme_system_font("SST-Light.otf").empty());
 printf("PASS stock mode restores system font\n");

 config["xmbHomeOn"]="true";
 assert(unlink((fontdir+"/ps3-rodin-regular.ttf").c_str())==0);
 apply_system_font("absent");
 assert(theme_system_font("SST-Roman.otf").empty());
 printf("PASS no override if embedded font missing\n");

 printf("PASS V83.14 native font-selection tests\n");
 return 0;
}
