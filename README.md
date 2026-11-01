# Diego Becerra — portfolio

A responsive static portfolio for GitHub Pages, built with plain HTML, CSS, and JavaScript. It opens in Spanish and includes an English toggle, a CV download, and a working music player.

**Live site:** <https://404moon404.github.io/>

## Publish with GitHub Pages

The site is published from the `main` branch of `404MOON404/404MOON404.github.io` at the repository root. Any push to `main` triggers a new Pages build.

To reproduce it on another repository: push this folder, open Settings → Pages, choose Deploy from a branch, select `main` and the root folder, and save. GitHub will show the published address when deployment finishes.

## Content

- The bilingual copy, project details, and experience live in `index.html`.
- The site uses five palette colours: cream `#F4F1ED`, burgundy `#6B4C4A`, charcoal `#252729`, sage `#9AABA0`, and sand `#CBB5A1`.
- Display type is Instrument Serif and body type is Inter, both self-hosted from `assets/fonts`.
- The profile portrait and ICPC photos are in `pics/optimized`.
- The downloadable CVs are `cv/Diego-Becerra-Murillo-CV-ES.pdf` and `cv/Diego-Becerra-Murillo-CV-EN.pdf`.
- MelodyLog is linked at <https://melodylog.vercel.app/>; its feature shows the 20-second product film `brag.mp4` in a browser-style window.
- The open project slot was replaced with the Grupo PiSA automation dashboard from the CV.

## MelodyLog film

`brag.mp4` (1920×1080, 20 s, H.264/AAC) plays inside the MelodyLog feature window. The poster is `assets/melodylog-tour-poster.webp`. The video is muted and autoplays only when at least 35% of it is visible; it pauses when it leaves the viewport or the tab is hidden, and a manual pause in the native controls is respected until the visitor presses play again. It loops, and the controls allow unmuting, seeking, and fullscreen.

To replace the film, overwrite `brag.mp4` and regenerate the poster at a representative moment:

```bash
ffmpeg -ss 6.2 -i brag.mp4 -frames:v 1 -vf "scale=1600:-2" -c:v libwebp -quality 82 assets/melodylog-tour-poster.webp
```

## Music player

Tracks live in `music/`. The playlist is the `playlist` array in `script.js`; each entry needs `title`, `artist`, and `src`. The player loads “you suck charlie” by Joji as the first track but stays paused on page load; audio only starts when the visitor presses play or chooses a song. Add or reorder tracks by editing that array.

## Local preview

```bash
python -m http.server 4173
```

Then open `http://localhost:4173/`.

`python -m http.server` does not support byte-range requests, so dragging the progress bar may reset locally. Use a range-capable server such as `npx serve .` to test seeking. GitHub Pages supports ranges in production.
