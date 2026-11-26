@echo off
rem Sends the PNG icons in the xmbicons folder to the PS5 (for the XMB's custom columns: Triangle > Column Icon).
rem   UPLOAD_XMB_ICONS.bat            (PS5 at 192.0.2.1)
rem   UPLOAD_XMB_ICONS.bat -PS5 192.168.1.20
pushd "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "xmb_patch\wave_tools\upload_xmb_icons.ps1" %*
popd
pause
