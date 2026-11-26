# Sends the column icons (xmbicons\*.png) to the PS5: /user/data/XMB5/xmbicons/ (through the ELF's web server, port 4444).
# Icons already on the console with the same size are skipped. Square transparent PNGs look best (256 x 256, like the PS3's icons).
# File names: letters, digits, . _ - only (the name shown in Triangle > Column Icon is the file name without .png).
#   UPLOAD_XMB_ICONS.bat [-PS5 192.0.2.1] [-Dir <folder>]
param([string]$PS5 = "192.0.2.1", [string]$Dir = "")
if (-not $Dir) { $Dir = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) "xmbicons" }
New-Item -ItemType Directory -Force -Path $Dir | Out-Null
$files = @(Get-ChildItem -LiteralPath $Dir -Filter "*.png" -ErrorAction SilentlyContinue | Sort-Object Name)
if ($files.Count -eq 0) { Write-Host "No .png in $Dir - put your column icons there first."; exit 1 }
$have = @{}
$list = & curl.exe -fsS --max-time 10 "http://${PS5}:4444/xmbicons" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "Cannot reach the PS5 at ${PS5}:4444 - is the XMB ELF loaded? (other IP: UPLOAD_XMB_ICONS.bat -PS5 <ip>)"; exit 1 }
foreach ($line in @($list)) { $p = "$line".Trim() -split ' '; if ($p.Count -eq 2) { $have[$p[0]] = [int64]$p[1] } }
$sent = 0
foreach ($f in $files) {
  if ($f.Name -notmatch '^[A-Za-z0-9._-]+\.png$') { Write-Host "skipped (rename it: only A-Z a-z 0-9 . _ -): $($f.Name)"; continue }
  if ($f.Length -gt 4MB) { Write-Host "skipped (bigger than 4 MB): $($f.Name)"; continue }
  if ($have.ContainsKey($f.Name) -and $have[$f.Name] -eq $f.Length) { Write-Host "already on the PS5: $($f.Name)"; continue }
  Write-Host "uploading $($f.Name)..."
  & curl.exe -fsS -H "Expect:" -H "Content-Type: application/octet-stream" --data-binary "@$($f.FullName)" "http://${PS5}:4444/background?kind=xmbicons&name=$($f.Name)" | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: $($f.Name)"; exit 1 }
  $sent++
}
Write-Host "Done: $sent sent. On the PS5: a custom column > Triangle > Column Icon."
