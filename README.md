# Ilya Khalafi — Portfolio

A static portfolio for GitHub Pages with a light default theme, an optional
dark theme, and illustrated project cards.

Run a local preview from this directory:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000`. No build step or package installation is needed.

- `index.html` contains the portfolio content and project illustrations.
- `assets/style.css` controls the responsive layout and both themes.
- `assets/site.js` handles navigation, theme persistence, and scroll reveals.

Fonts load from Google Fonts, with local system font fallbacks. All portfolio
content is served from this repository.
