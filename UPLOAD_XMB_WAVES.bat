@echo off
rem Sends the 24 XMB5 month waves in the xmbwaves folder to the PS5 (skips the ones already there).
rem   UPLOAD_XMB_WAVES.bat            (PS5 at 192.0.2.1)
rem   UPLOAD_XMB_WAVES.bat -PS5 192.168.1.20
pushd "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "xmb_patch\wave_tools\upload_xmb_waves.ps1" %*
popd
pause
