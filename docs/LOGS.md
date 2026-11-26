# Logs, debug mode and reporting problems

## Reporting a problem (the easy way)

1. Open the editor (`http://<PS5 IP>:4444`), tab **Logs**, and press **Report a problem…**
2. Write in a few words what you did and what you saw, then **Make the report**.
3. A `ZhiThemes-report-<date>.txt` is downloaded. Open a GitHub issue and attach it.

The report holds what is needed to look at the problem: the firmware and ZhiThemes version, the values of the theme in use, a summary of the errors, warnings and what you did, the log of the last 3 sessions, and the last keys and focused tiles of this session. It holds no PSN user name or id; it does hold the names of your games and themes.

If the editor does not open, copy the log with **Options > 🎨 ZhiThemes > Tools > Copy logs to USB**, or over FTP from `/data/ZhiThemes/Logs/zhithemes.log`.

## The log

There is one file, **`/data/ZhiThemes/Logs/zhithemes.log`**: every session one after the other (about the last 16 MB; the oldest sessions are cut first). The editor's **Logs** tab shows it.

Each session starts like this:

```
2026-11-17 16:14:49.147 +0.002 I  ==== session start (ShellUI pid 110) ====
2026-11-17 16:14:49.219 +0.073 I  ==== ZhiThemes 0.1.0-alpha (build N, Nov 17 2026 16:05:46) by Zhi ====
2026-11-17 16:14:49.228 +0.082 I  PS5: firmware 9.60 (0x09600004) | ShellUI pid 110 | PS5 on for 0 h 17 min
2026-11-17 16:14:49.234 +0.088 I  theme: KindaSelene | debug mode: off | ...
```

Each line has the UTC date and time, the seconds since this start, and a letter:

| Letter | What |
|---|---|
| `E` | error |
| `W` | warning |
| `A` | something you did: tab changes, fields saved in the editor, themes, the 🎨 menu, rest mode |
| `I` | information |
| `D` | debug: only with debug mode on |
| `H` | health, once a minute: memory, reloads, the slowest moment of each app |

Lines written by `ZhiThemes.elf` itself (injection, ShellUI restarts, safe mode) start with `[payload]`; the start-up steps of the module start with `[boot]`. Errors, warnings, actions and these lines go to the disk at once, so they are kept even when the whole console crashes. The same line many times in a row is written once, followed by `(the line before x N more)`.

At the start after a session that did not end cleanly:

- `E ==== previous session CRASHED ...`: the PS5 kept running, so the interface (ShellUI) went down.
- `W ==== previous session had no clean end: the PS5 was switched off or restarted after it ...`: not a crash.

After such a session, ZhiThemes also pastes the end of its **flight recorder**: the keys you pressed and the tiles you focused just before, which are not in the log while debug mode is off.

With a USB drive plugged in, errors, warnings and actions are also copied to `/usbN/ZhiThemes-log.txt`.

## Debug mode

1. In the editor open **Logs** and turn on **Debug mode**.
2. On the PS5, do whatever goes wrong: open the Home, a game hub, Settings, Trophies, a folder…
3. Turn **Debug mode** off and make a report (above).

With debug mode on, the log also gets the controller keys, the position of every part of the screen, the folders, the font files of this firmware and the structure of Settings and Trophies (which makes those screens slower). Debug mode stays on across restarts until you turn it off. It is never saved in a theme.

With debug mode on, every colour and shape token of this firmware is also written to **`/data/ZhiThemes/Dumps/<firmware>/`** (`tokens_color.txt`, `tokens_shape.txt`).

## Other firmwares

ZhiThemes was made and tested on **9.60**, and is confirmed working on **13.60**. It looks for the parts of the Home by their shape rather than by fixed numbers, and checks the parts it changes natively (for example the focus frame) before touching them. On another firmware the usual result is that **some options do nothing**, not a crash.

To help test a firmware:

1. Turn on debug mode.
2. Visit the Home, a game hub, the Game Library, Settings and Trophies.
3. Turn debug mode off, make a report and attach it, plus `tokens_color.txt` and `tokens_shape.txt` from `Dumps/<firmware>/`, to an issue titled `Firmware X.XX report`.

Useful lines in a log:

- `state: hooked=true done={…} errors=0`: what the theme applied in each app (`home`, `hub`, `library`, `settings`, `trophy`); `errors` above 0 means something failed.
- `focus: fields … -> different, hook stopped`: the focus frame of this firmware is different, so frame thickness/gap are off.
- `notify:`: messages ZhiThemes showed on screen.
