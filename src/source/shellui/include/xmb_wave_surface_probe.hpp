#pragma once
// V34 opt-in, READ-ONLY Mono PUI surface capability inventory.
// Only class and method existence checks; no instances, detours, texture writes,
// display swaps, scheduler changes, or VSH system file writes.
// Called exactly once at existing install_homeui_js_hooks start.
namespace xmb_v34_probe {
struct Candidate { MonoImage* image;const char* module;const char* ns;const char* klass; };
inline void inspect_class(const Candidate& d) {
  if (!d.image) { zt_log("XMB_V34_SURFACE class %s.%s module=%s missing_image=1",d.ns,d.klass,d.module);return; }
  MonoClass* c=mono_class_from_name(d.image,d.ns,d.klass);
  if(!c){zt_log("XMB_V34_SURFACE class %s.%s module=%s found=0",d.ns,d.klass,d.module);return;}
  zt_log("XMB_V34_SURFACE class %s.%s module=%s found=1",d.ns,d.klass,d.module);
  struct Method {const char* name;int count;};
  const Method methods[]={
    {"get_Texture",0},{"set_Texture",1},{"get_RenderTarget",0},
    {"set_RenderTarget",1},{"Bind",2},{"GetTexture",0},
    {"SetTexture",1},{"LoadAsync",4},{"SetImage",1},
    {"Create",2},{"Create",3},{"Present",0},{"Draw",1},
    {"Update",0},{"get_Image",0},{"set_Image",1},
    {"get_Source",0},{"set_Source",1},{"get_Material",0},
    {"set_Material",1},{"get_NativePtr",0}
  };
  for(const auto& m:methods){
    if(mono_class_get_method_from_name(c,m.name,m.count))
      zt_log("XMB_V34_SURFACE method %s.%s.%s(%d) found=1",d.ns,d.klass,m.name,m.count);
  }
}
inline void run(MonoImage* react,MonoImage* pui){
  zt_log("XMB_V34_SURFACE BEGIN read_only=1 gpu_draw=0");
  const Candidate classes[]={
    {pui,"PUI","Sce.PlayStation.PUI.UI3","ImageBox"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","FocusRenderWidget"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","RenderWidget"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","Texture2D"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","RenderTarget"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","ImageLayer"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","Canvas"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","Sprite"},
    {pui,"PUI","Sce.PlayStation.PUI.UI3","Scene"},
    {pui,"PUI","Sce.PlayStation.PUI","Texture2D"},
    {pui,"PUI","Sce.PlayStation.PUI","RenderTexture"},
    {pui,"PUI","Sce.PlayStation.PUI","RenderTarget"},
    {pui,"PUI","Sce.PlayStation.PUI","UISystem"},
    {react,"ReactNative.PUI","ReactNative","Image"},
    {react,"ReactNative.PUI","ReactNative","ReactRootView"}
  };
  for(const auto& spec:classes)inspect_class(spec);
  zt_log("XMB_V34_SURFACE END read_only=1 gpu_draw=0");
}
} // namespace xmb_v34_probe
