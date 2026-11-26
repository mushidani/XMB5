## PS5 XMB v1.0 (2026-11-13)

Native animated category/row navigation, original layered drifting wave artwork, fixed title/category overlap, double-clock mitigation, and documented PS5 routes for several Settings pages and Trophies. See START_HERE_V10.md and V10_TEST_REPORT.md.

# Changelog

Versions go up (0.1.x, 0.2.0…) until 1.0.0.

## 0.1.1-alpha

- **ZhiThemes speaks your PS5's language:** the 🎨 ZhiThemes menu, folder menus, messages, empty tabs and play info follow the PS5's system language (28 languages). Words the PS5 already has (Start, Options, Recently played, Favourites, "3 days ago", the power menu…) are taken from the PS5 itself. The footer hints are now switches (*Start* / *Options* / *Home*) instead of free text.
- **Older firmwares (4.03):** creating or deleting a folder could leave an empty Home after the reload; the message after a reload now waits until the new Home has its tab bar.
- Errors inside the Home's own scripts are now written to the log (with where they happened), to find crashes that left nothing behind.
- *Animated tiles* (every tile in the row moving, Experimental) is gone: the PS5 plays only about 3 videos at once, so the tiles took turns and blinked. The focused tile keeps moving as before.
- **Open folders:** the highlighted game's frame is thin like the PS5's own focus frame (it was about twice as thick) and takes the frame colour with its opacity; the games sit centred in the folder background.

- **Animated game backgrounds change like the still ones:** the old video fades out with a little zoom and slides a few pixels the way you moved; the next one fades in once it plays (before, both were instant).

- **Games in the row: up to 20** (was 12). Above 12 the row also takes the next installed games the PS5 would leave out; the Store and the Game Library stay. With folders, the Game Library no longer falls off the end of the row (3 folders + 12 games left it out).
- **Game Library options are automatic:** the row is always hidden while the Game/App Library is open; its games stay out of sight under the row only when you moved or resized the row (with the stock row they show as on the PS5). *Page position*, *Hide the row in the Library*, *Hide Library games until opened* and *Library peek* are gone from the editor.
- **No folder music** (Folders): a selected folder no longer plays its first game's music.
- **Loading ZhiThemes from the payload manager while moving the controller** could bring the interface down: the still-Home check now runs right before the new copy goes in, and the first Home reload waits until the Home is still.

- **Editor options reorganised:** every tab now has its options in titled groups, one line each (name on the left, control on the right, the explanation in the name's tooltip). Options that only matter with another one on stay hidden until it is on, sliders have their real range and unit (%, px, ×, ms; *Stock* / *Off* at 0) and many technical or duplicate options are gone (their values keep working). Text & fonts is gone (the font is in **Misc**, the old Extras), *Tools* is now **Info**, Settings & Trophies has no *Own look* switch any more (each part turns on with its own background).
- **System icon picker:** icon fields show the icon and a *Pick…* button with every PS5 system icon, taken from your PS5 (nothing of Sony's is shipped).
- **Editor on phones and tablets:** two-line header with a ⋯ menu (Install, Download, Reset all), tabs in a strip you swipe, every option fits the screen.
- **Custom tiles, backgrounds and animated tiles are always used when a game has them.** The game's Options menu can switch back: *Use original tile*, *Next custom tile*, and now also *Use original background* / *Next custom background*.
- **Game page:** with every section hidden, down from *Play* no longer opens an empty page. *Hide Play game button* hides Play, "…" and the Media button.
- **Folders:** the open folder's games follow the tiles (corners, focus frame colour and thickness); its background fits round the games; the folder name looks like the game title.
- The footer background fits round the hints. Opening or closing a folder no longer makes the Options hint pulse.
- *Measure screen* is on only with Debug mode (the editor's Screen tab shows real positions then).

- **New theme format:** a theme is now a folder with one `theme.json` (name, author, description and its settings, values only) and its files; a `.ztheme` is always that folder in a ZIP (`theme.json`, `wallpapers/`, `icons/`, `fonts/`). Before, `.ztheme` meant three different things and each theme file carried a whole copy of the theme script (about 500 KB, of which only the values were used); a theme is now about 13 KB. See [docs/THEMES.md](docs/THEMES.md).
- **Older themes keep working:** themes on your PS5 are turned into the new format the first time this version starts, and older `.ztheme` files (packs or plain text) are translated when you install them (editor, USB, 🎨 menu, `Install/` folder).
- **Download and Install are done by the PS5:** Download makes the `.ztheme` on the PS5 while it is sent (big videos no longer go through the browser's memory); Install sends the file to the PS5, which checks and installs it the same way as from USB. **Info** in the editor's Theme list sets a theme's author and description.
- **Video wallpaper that is not 16:9** (e.g. 3440×1440): it now fills the screen, centred, instead of showing black bands. *Video fit* (Background, Advanced): *Centered* (fill and crop, default) or *Stretch*.
- *Video decoder* (Experimental, was *Video decoder test*) keeps only the decoder types that play (fullHD, UHD, auto); auto tries fullHD first, also for big files.
- **Automatic updates:** ZhiThemes checks GitHub for a new version when it starts and once a day (can be turned off). A new version shows a ❗ in Options > 🎨 ZhiThemes > ⬇ Updates and a button in the editor's header (click the version there to check now); *Download and install* gets it, checks it (signed by the author, size and SHA-256) and starts it right away, or after a restart when ZhiThemes was already loaded many times since the PS5 started. With the payload manager the new ELF replaces the old one there. If the new version brings the Home down twice, the previous one comes back by itself, with *Try again* and *Report a problem*.
- **PS5 shade behind the tile** (Background tab): the dark shade the PS5 puts over the game art behind the selected tile can be the PS5's ellipse, flat, or off.
- The power menu stays on screen when the Power button sits near the right edge.
- **Folders:** an open folder closes when you start one of its games, so it is closed when you come back to the Home.
- **Folders from the Game / App Library:** *Add to <folder>* no longer reloads the Home after every game, so you can add several games in one go; the Home updates once when you leave the library with ○ and shows *Added to <folder>*.
- Holding L1 / R1 down no longer runs through several tabs.
- **Sending ZhiThemes.elf while moving on the Home** could bring the interface down: ZhiThemes now waits until the Home has been still for 2 seconds (a notification asks you to stop moving) before it replaces the running copy.
- **⚡ Quick settings** (🎨 menu) keeps two submenus: *Extra tabs* (Recently played, Favourites, Never played) and *Hide tiles* (PlayStation Store, All apps, Media Gallery).
- **"Stopping Features: <app>"** no longer shows when the video wallpaper or an animated tile starts while another app (e.g. a homebrew store) is open in the background: ZhiThemes reads each video's size and asks the PS5's 4K decoder only for 4K videos. A 4K video still needs that decoder. *Video decoder test* (Experimental) tries the PS5 player's other decoder types.
- **Installing a theme whose name is already taken** (Install folder, USB, 🎨 menu) keeps the theme you have and installs the new one as `Name-2`, `Name-3`… (before, it replaced yours or stopped with "a theme called … already exists"). A newer copy of the same USB file still updates the theme it installed.
- **Editor:** when you switch themes on the PS5 (🎨 menu, USB install) with the editor open, the page loads the new theme by itself (its name and all its options). With changes not applied yet it warns you and does not save them over the new theme.
- **Older firmwares (e.g. 6.50):** the theme script is now injected there too. Their React Native JS executor has another name and an extra argument, so nothing ran before (no theme, no 🎨 ZhiThemes menu). Testers on older firmwares see the theme now; parts of the older Home may still not follow it.
- **New logs:** one file, `Logs/zhithemes.log`, with every session one after the other (about the last 16 MB). Each line has a level (error, warning, action, info, debug, health); what you do (tabs, fields saved, themes, menu, rest mode) and a health line per minute (memory, reloads, slowest moment) are logged. A session with no clean end is marked *CRASHED* at the next start, or *switched off or restarted* when the PS5 itself was. Errors, warnings and actions go to the disk at once and, with a USB drive plugged in, also to the drive.
- **Flight recorder:** the last keys and focused tiles are kept in a small hidden file and pasted into the log after a crash.
- **Report a problem:** a button in the editor's Logs tab makes one file to attach to a GitHub issue (what happened, system, theme values, summary, the last 3 sessions, the last keys and focus). No PSN user name or id in the logs any more. **Tools** in the 🎨 menu keeps *Copy logs to USB*.
- **Debug mode** always maps Settings and Trophies too (no separate box).
- Sending `ZhiThemes.elf` from the payload manager: ZhiThemes waits a little longer after the browser closes before loading (the interface sometimes froze).
- Theme files: stricter checks on names, paths, sizes and file types when installing a theme.
- **Home stability:** old copies of the theme layers that the Home leaves behind after tab changes are now dropped, and data from an old Home (after quick saves in the editor) is no longer answered on the wrong thread, which could bring the interface down. The editor shows how many times the Home was reloaded next to *Apply*.
- **SteamGridDB downloads are faster** (thanks to @kasobos67, PR #11): pictures come in parallel, the picture you choose has its own slot and starts while thumbnails are still loading, and big downloads keep going as long as data arrives. Thumbnails are retried when the PS5 is busy. The big preview shows the thumbnail with a **▶ Show the full animation** button, and every picture you save now shows a progress bar.
- **Older firmwares (4.03, 6.02, 7.00)**, thanks to the testers @Akegata (4.03), @TearsOfAnzar (6.02) and @garfa82 (7.00):
  - Hidden tiles (PS Store, All Apps…) leave the row on 4.03 too, and Options on a tile has 🎨 ZhiThemes and the folder menu there.
  - Recently played / Never played are filled from every game on the older Home, with the right last-played dates; the Favourites tab only shows when it has at least one favourite.
  - Rename folder opens the system keyboard dialog on older Homes (it brought the interface down before).
  - L1 / R1 move through the extra tabs on 6.02.
  - Fake trophies on the Home read the older game page's own trophy card, and that old card no longer shows on the Home.
  - The open folder is closed when you change tabs, so ✕ picks a folder again straight away.
  - The native focus frame gets the theme's glow, colour and size on firmwares without colour tokens (7.00, 6.02); the colour tokens themselves (Settings colours) still do not work there.
  - Icons missing on a firmware (Media tab, controller in the top bar) use a close stand-in or are not drawn, instead of an empty picture.
  - If the Home does not start again after a reload, the log says so and what to do.

## 0.1.0-alpha — first release

Alpha: made on firmware **9.60** and confirmed working on **13.60**. Other firmwares are untested; reports are welcome (see [docs/LOGS.md](docs/LOGS.md)).

### Home screen
- **Tiles:** square 1:1 or vertical 2:3 covers; the focused tile can be vertical 2:3 or *Steam horizontal* 92:43 (like the Steam Deck). Size, gap, corners, shadow, reflection, how many games the row shows.
- **Row effects:** tiles fade out near the left and right edges of the screen (adjustable length and lowest opacity); the focus can walk along the row like in an open folder, with the row only sliding in the middle; tiles leaving on the left can disappear and slide away, fully gone at a chosen x (e.g. the edge of a side bar).
- **Custom pictures per game:** your own tiles in every format, game backgrounds and game logos, uploaded or found with the built-in **SteamGridDB** search (you need your own free API key). A cropper for every format.
- **Animated tiles and backgrounds:** animated WebP / APNG / MP4 / WebM become a still picture plus an MP4 the PS5 plays on the focused tile, with optional in-between frames for smooth motion. The game's own music keeps playing. Animated game backgrounds can also be searched on **motionbgs.com** (fan-made live wallpapers, moving previews in the editor; ZhiThemes ships none of them): the video is made into a light 1080p MP4 for the PS5. Only one player per video, so the focused tile keeps moving with the extra tabs on, and tile and background start at once.
- **Focus frame:** colours, glow, rainbow, shape.
- **Game names:** the PS5 game title, the tile title, or a *fake title* placed anywhere on the screen; game logos instead of names. With a vertical or Steam focused tile, the small tile and its name on a game page sit where the PS5 itself would put them; no double title after a reload with folders, and the Media page keeps its own title look.
- **Folders:** game folders on the Home, shown as a mosaic, stacked covers or icons, with their own background; colour and opacity per folder or one default for all.
- **Extra tabs** next to Games / Media: *Recently played*, *Favourites* (optionally left of Games), *Never played*; add or remove favourites from the Options menu (one list for the whole console, whatever theme is in use). An empty tab shows an empty-box picture and says how to fill it; coming back from a game always lands on Games.
- **Top bar:** tabs aligned left, centre or right inside a box (centre grows to both sides), L1 / R1 icons next to them, controller buttons in any colour; the top bar background always sits over the free background boxes, and the boxes appear together with the bar. The tabs can show **icons instead of names** (a system icon or your own picture per tab), in the tab colour.
- **Extra top bar buttons** next to Search: **Power** (X opens Enter Rest Mode / Restart / Turn Off), **Trophies** (opens the Trophies app) and the **controller with its battery** (icon + %, only the icon, only the %, or the controller icon itself filling up; a green bolt while charging). Each one with its own symbol (system icon or your picture), size and opacity. The power menu always fits on the screen, the controller keeps its width while the battery is read (so the buttons next to it stay in place), and buttons placed low on the screen fade away when a game page or the Game / App Library opens. In the editor, turning one button on or off keeps the others where you placed them.
- **Side bar themes:** the top icons (profile, settings, Power, Trophies) can sit anywhere, e.g. in a column on the left, and the controller moves between them in screen order with the normal move sound; left on the first tile of the row goes to the nearest icon (with or without folders), right goes back to the row. Icons in the bar left of the tabs are reached with left from the first tab. Theme layers wait for the real Home after a reload (no clock or icons alone on the loading screen) and fade in softly, like the top bar buttons; the controller shows together with its battery.
- **Game / App Library tile:** its games can stay hidden under the row until you open it, also after coming back from it.
- **Clean background:** one switch shows only the PS5's own dark background with its light at the top everywhere (Home, game pages, folders, games without art, Settings), over any wallpaper, game art or custom background.
- **Wallpaper:** a picture or an `.mp4` video, with overlay, vignette, dark edges and 23 particle styles (snow, sakura, rain, starfield, digital rain…).
- **Extras:** own clock and date, play info ("Last played 3 days ago"), fake trophies, animated avatar (GIF or video: crop it with a circle and zoom; a video part loops in the editor as it will look, and a big GIF is cut and fitted on the PS5 itself, so it never freezes the console), animations (tab change, folders, names, button bounce), debug panel (fps, memory, temperatures).
- **Fonts:** your own system font without a restart; colours and sizes of the texts.

### Other screens
- Game hub, Game / App Library, Settings and Trophies follow the theme: background colour, your picture or video (shared with the Home, so it keeps playing between screens; the Game / App Library keeps its own backgrounds), list and tab shapes.

### Editor
- Web editor on `http://<PS5-IP>:4444` from a PC or phone: a **Screen** tab with a live picture of the Home, tabs named after the part of the screen they change, one colour picker everywhere, an *Advanced* switch for the less used options.
- **Top icons** are a row of icon buttons: each one opens a window with only that icon's options; bigger or smaller Power / Trophies buttons show where the PS5 really draws them.
- **Select several elements** with Ctrl + click and move them together (drag or arrow keys); big ones like the row give way to the smaller ones under the pointer, and Ctrl + click on a selected one takes it out.
- Saves made in quick succession from the editor are spaced out, so the Home is never reloaded while it is still starting.
- **Several themes on one PS5:** make, rename, switch and delete themes.
- **Share themes:** *Download* saves one `.ztheme` file with the settings and the wallpaper / video, icons and fonts it uses; *Install* adds someone else's. Your folders and custom pictures are never included.
- The **ZhiThemes logo** in the editor: header, browser tab icon and the About tab.
- **Progress bars** with % and speed for every upload to the PS5 and every SteamGridDB download; SteamGridDB pictures are streamed through the PS5 and loaded only once.

### Installing and switching themes on the PS5
- **🎨 ZhiThemes** in every tile's Options menu, in sections:
  - *Themes*: switch theme, turn ZhiThemes off (*PS5 default*), install themes from a USB drive or the Install folder, back up all themes to a USB drive.
  - *Quick settings*: wallpaper, animated tiles, custom tiles, the extra tabs and the debug panel on or off without the editor.
  - *Tools*: the editor's address, reload the theme, clear the picture cache, copy the logs or a screen dump to a USB drive.
  - *About*: version and firmware (opens the ZhiThemes logo with a QR code for the GitHub page), and a QR code for Ko-fi (O or an arrow closes them).
  - *Updates*: automatic updates are coming later.
- Copy a `.ztheme` to `/data/ZhiThemes/Install/` and it is installed when ZhiThemes starts.

### Safety
- Nothing is written to system files: everything runs in memory, and a reboot gives back the stock PS5.
- With no theme (first start, or the theme file deleted) ZhiThemes starts off and touches nothing, so firmwares that were not tested start with the stock look.
- A theme file can only carry values (numbers, true/false, text); a file with code is ignored.
- **Safe mode:** if the Home crashes twice within 3 minutes the theme turns itself off; a USB drive with an empty `ZhiThemes/no_theme` file keeps it off while plugged in.
- **Logs tab:** debug mode, logs with firmware, version and timestamps, also saved in `/data/ZhiThemes/Logs/`.
- **Not together with other HENs that load into the Home:** with etaHEN, OnionHEN, AniketosHEN (or Yoncore, kylin-core, wmdw-jwm, CheatRunner) running, ZhiThemes does not load and tells you why: two of them in the Home crash it.
- A Home that is still starting (right after a reboot) is given time to finish before ZhiThemes loads into it.
- **Sent from a payload manager in the PS5's web browser:** ZhiThemes waits until you leave the payload manager, then loads (loading while the browser was open could crash the Home with error CE-108262-9).
- **Screen dump** (Experimental): saves the code and the screen layout of the PS5's apps to `/data/ZhiThemes/Dumps/<firmware>/`, to help make themes work on other firmwares.

### Known limits
- Made on firmware 9.60 and confirmed working on 13.60; other firmwares are untested.
- Loading ZhiThemes many times without restarting the console can use up the Home's memory; from the 4th load in a row the welcome message asks you to restart the PS5.
- Does not run together with etaHEN, OnionHEN, AniketosHEN or other HENs that load into the Home, for now (use kstuff + an ELF loader).
- No live blur behind panels; the text colour of Settings rows cannot be changed.
