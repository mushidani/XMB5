# Sends the XMB5 month waves (xmbwaves\XMB5_Wave_*.mp4) to the PS5: /user/data/XMB5/xmbwaves/ (through the ELF's web server, port 4444).
# Waves already on the console with the same size are skipped.   UPLOAD_XMB_WAVES.bat [-PS5 192.0.2.1] [-Dir <folder>]
param([string]$PS5 = "192.0.2.1", [string]$Dir = "")
if (-not $Dir) { $Dir = Join-Path (Split-Path (Split-Path $PSScriptRoot -Parent) -Parent) "xmbwaves" }
$files = @(Get-ChildItem -LiteralPath $Dir -Filter "XMB5_Wave_*.mp4" -ErrorAction SilentlyContinue | Sort-Object Name)
if ($files.Count -eq 0) { Write-Host "No XMB5_Wave_*.mp4 in $Dir - copy the 24 videos from the wave kit's out folder there first."; exit 1 }
$have = @{}
$list = & curl.exe -fsS --max-time 10 "http://${PS5}:4444/xmbwaves" 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host "Cannot reach the PS5 at ${PS5}:4444 - is the XMB ELF loaded? (other IP: UPLOAD_XMB_WAVES.bat -PS5 <ip>)"; exit 1 }
foreach ($line in @($list)) { $p = "$line".Trim() -split ' '; if ($p.Count -eq 2) { $have[$p[0]] = [int64]$p[1] } }
$sent = 0
foreach ($f in $files) {
  if ($have.ContainsKey($f.Name) -and $have[$f.Name] -eq $f.Length) { Write-Host "already on the PS5: $($f.Name)"; continue }
  Write-Host ("uploading {0} ({1} MB)..." -f $f.Name, [math]::Round($f.Length / 1MB))
  & curl.exe -fS --progress-bar -H "Expect:" -H "Content-Type: application/octet-stream" --data-binary "@$($f.FullName)" "http://${PS5}:4444/background?kind=xmbwaves&name=$($f.Name)" | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Host "FAILED: $($f.Name)"; exit 1 }
  $sent++
}
Write-Host "Done: $sent sent, $($files.Count - $sent) were already there. The XMB picks the current month's wave by itself."
