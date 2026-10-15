@echo off
setlocal EnableExtensions
title Piksel Lig 26/27 - Legacy
cd /d "%~dp0"
set "OYUN=%~dp0PikselLig_Legacy.html"
if not exist "%OYUN%" (echo PikselLig_Legacy.html bu klasorde yok! & pause & exit /b)
set "TAR="

rem --- Supermium'u bul (once kayitli yol) ---
if exist "%~dp0tarayici.txt" set /p TAR=<"%~dp0tarayici.txt"
if defined TAR if not exist "%TAR%" set "TAR="
if not defined TAR for %%P in (
 "%ProgramFiles%\Supermium\chrome.exe"
 "%ProgramFiles%\Supermium\Application\chrome.exe"
 "%ProgramFiles(x86)%\Supermium\chrome.exe"
 "%ProgramFiles(x86)%\Supermium\Application\chrome.exe"
 "%LocalAppData%\Supermium\Application\chrome.exe"
 "%LocalAppData%\Supermium\chrome.exe"
 "%LocalAppData%\Programs\Supermium\chrome.exe"
 "%UserProfile%\Local Settings\Application Data\Supermium\Application\chrome.exe"
 "C:\Supermium\chrome.exe"
 "%UserProfile%\Desktop\Supermium\chrome.exe"
 "%UserProfile%\Downloads\Supermium\chrome.exe"
) do if not defined TAR if exist "%%~P" set "TAR=%%~P"
if not defined TAR for %%K in (HKCU HKLM) do if not defined TAR (
 for /f "tokens=2,*" %%A in ('reg query "%%K\SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe" /ve 2^>nul ^| find "REG_"') do if exist "%%~B" set "TAR=%%~B"
)
if not defined TAR (
 echo Supermium araniyor, bir kere surer...
 for /f "delims=" %%F in ('dir /s /b "C:\chrome.exe" 2^>nul ^| find /i "supermium"') do if not defined TAR set "TAR=%%F"
)
if not defined TAR goto R3D
>"%~dp0tarayici.txt" echo %TAR%

rem --- Hafif ve guvenli ayarlar (Atom N270 + GMA 950 icin) ---
rem  * ayri hafif profil: ilk acilis 1 kere yavas, sonra sak diye acilir; kayitlar burada durur
rem  * GPU kapali: eski Intel ekran surucusu yuzunden donma/mavi ekran riskini keser
rem  * otomatik ses izni: menu muzigi hemen calar
set "PROF=%~dp0PikselLig_Profil"
set "BAY=--user-data-dir="%PROF%" --no-first-run --no-default-browser-check --disable-sync --disable-extensions --disable-default-apps --disable-component-update --disable-background-networking --disable-domain-reliability --disable-breakpad --metrics-recording-only --disable-features=Translate,OptimizationHints,MediaRouter,AutofillServerCommunication,InterestFeedContentSuggestions,CalculateNativeWinOcclusion --autoplay-policy=no-user-gesture-required --disable-gpu --disable-gpu-compositing --disable-smooth-scrolling --force-device-scale-factor=1 --renderer-process-limit=1 --disk-cache-size=8388608 --js-flags=--max-old-space-size=128"

rem ReactOS: sandbox desteklenmiyor
ver | find /i "ReactOS" >nul && set "BAY=%BAY% --no-sandbox"

start "" /abovenormal "%TAR%" %BAY% --app="file:///%OYUN:\=/%" --start-fullscreen
exit /b

:R3D
set "TAR="
for %%P in ("%ProgramFiles%\r3dfox\r3dfox.exe" "%ProgramFiles%\r3dfox\firefox.exe" "%ProgramFiles(x86)%\r3dfox\r3dfox.exe" "%LocalAppData%\r3dfox\r3dfox.exe") do if not defined TAR if exist "%%~P" set "TAR=%%~P"
if defined TAR (start "" "%TAR%" --kiosk "file:///%OYUN:\=/%" & exit /b)
echo.
echo Supermium / r3dfox bulunamadi!
echo Cozum: Supermium kisayoluna sag tik ^> Ozellikler ^> Hedef satirini kopyala,
echo bu klasorde tarayici.txt dosyasina tirnaksiz yapistir, tekrar calistir.
echo.
pause
