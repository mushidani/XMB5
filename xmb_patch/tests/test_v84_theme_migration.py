#!/usr/bin/env python3
"""Host test: compile actual native value parser and JSON converter, no PS5 APIs."""
import pathlib, tempfile, subprocess, shutil
root=pathlib.Path(__file__).resolve().parents[2]
mod=root/'src/source/shellui'
s=(mod/'src/homeui_js_inject.cpp').read_text()
extract=s[s.index('struct Block {'):s.index('/* the user\'s TOKENS block')]
extract+=s[s.index('std::vector<std::pair<std::string, std::string>> theme_values('):s.index('std::string zt_theme_values_text(')].replace('} // namespace','')
fixture=r'''
#include <string>
#include <vector>
#include <map>
#include <iostream>
#include <fstream>
#include <filesystem>
#include <cctype>
#include <cstring>
#include <cassert>
#include "zt_storage.hpp"
'''+extract+r'''
void zt_logl(char, const char*, ...) {}
void zt_mkdirs(const std::string &p) { std::filesystem::create_directories(p); }
std::string zt_theme_name(){return "Default";}
std::string zt_theme_file(const std::string &n){return n;}
int main(int argc, char** argv){
 std::ifstream f(argv[1]);
 std::string text((std::istreambuf_iterator<char>(f)), {});
 int count=0, dropped=0;
 ZtThemeInfo i; i.name="Default";
 const std::string json=zt_theme_json_make(text,i,&count,&dropped);
 std::string restored; int read_dropped=0;
 assert(zt_theme_json_parse(json,&i,&restored,&read_dropped));
 std::map<std::string,std::string> a,b;
 for(auto kv:zt_theme_values_of(text)){if(zt_theme_value_ok(kv.second))a[kv.first]=kv.second;else std::cerr<<"Rejected: "<<kv.first<<"="<<kv.second<<"\n";}
 for(auto kv:zt_theme_values_of(restored))b[kv.first]=kv.second;
 for(auto kv:a)if(b[kv.first]!=kv.second)std::cerr<<"Mismatch: "<<kv.first<<" "<<kv.second<<" -> "<<b[kv.first]<<"\n";
 assert(!dropped && !read_dropped && a==b && count>600);
 assert(zt_theme_value_ok("'/user/data/XMB5/Assets/XMBUI/foo.png'"));
 assert(zt_theme_value_ok("''"));
 assert(!zt_theme_value_ok("'/user/data/XMB5/../ZhiThemes/foo.png'"));
 assert(!zt_theme_value_ok("'x';evil()"));
 assert(!zt_theme_value_ok("function(){}"));
 std::cout<<"PASS: "<<count<<" existing XMB5 values round-trip through new theme.json; path and code rejection pass.\n";
}
'''
with tempfile.TemporaryDirectory() as d:
 p=pathlib.Path(d);(p/'test.cpp').write_text(fixture)
 cc=shutil.which('g++') or shutil.which('clang++');assert cc,'C++ compiler required'
 subprocess.run([cc,'-std=c++20','-Wall','-Wextra','-Werror','-Wno-unused-parameter','-I'+str(mod/'include'),str(p/'test.cpp'),str(mod/'src/zt_theme_json.cpp'),'-o',str(p/'test')],check=True)
 subprocess.run([str(p/'test'),str(root/'theme/theme_factory.js')],check=True)
