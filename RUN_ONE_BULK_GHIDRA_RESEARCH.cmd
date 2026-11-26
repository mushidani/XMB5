@echo off
setlocal EnableExtensions DisableDelayedExpansion
cd /d "%~dp0"
echo.
echo ================================================================
echo      ORIGINAL PS3 4.93 XMB - ALL-IN-ONE GHIDRA RESEARCH
echo ================================================================
echo Close your Ghidra project before continuing (headless needs the lock).
echo The three original decrypted ELFs must already exist in your project.
echo.
set /p "GHIDRA_ROOT=Ghidra installation folder (e.g. C:\ghidra_11.4_PUBLIC): "
set /p "PROJECT_FOLDER=Ghidra project DIRECTORY (parent folder of .gpr file): "
set /p "PROJECT_NAME=Ghidra project NAME (filename without .gpr): "
set "RUNNER=%GHIDRA_ROOT%\support\analyzeHeadless.bat"
if not exist "%RUNNER%" (
  echo ERROR: analyzeHeadless.bat not found: "%RUNNER%"
  pause
  exit /b 1
)
set "OUT=%~dp0PS3_XMB_BULK_OUTPUT"
if not exist "%OUT%" mkdir "%OUT%"
echo.
echo Running ONE headless pass over existing ELF files in the project.
echo No auto analysis. Read-only project. Bounded function disassembly only.
call "%RUNNER%" "%PROJECT_FOLDER%" "%PROJECT_NAME%" -process "*.elf" -recursive -noanalysis -readOnly -scriptPath "%~dp0xmb_research" -postScript Ghidra_BULK_PS3_XMB_All_Modules.java "%OUT%"
set "STATUS=%ERRORLEVEL%"
echo.
echo Ghidra command returned code %STATUS%.
echo.
set "COMBINED=%OUT%\PS3_XMB_COMPLETE_BULK_REPORT.txt"
> "%COMBINED%" echo ALL-IN-ONE ORIGINAL SONY PS3 XMB BULK RESEARCH
for %%M in (GAME EXPLORE VSH) do (
  if exist "%OUT%\MODULE_%%M_PS3_XMB.txt" (
    >> "%COMBINED%" echo.
    >> "%COMBINED%" type "%OUT%\MODULE_%%M_PS3_XMB.txt"
  ) else (
    echo MISSING: MODULE_%%M_PS3_XMB.txt. Check project name or import paths.
  )
)
echo.
echo OUTPUT: "%COMBINED%"
echo Zip or upload PS3_XMB_COMPLETE_BULK_REPORT.txt in the next chat.
if not "%STATUS%"=="0" echo WARNING: inspect Ghidra errors and partial reports.
pause
endlocal & exit /b %STATUS%
