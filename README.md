# Novel Reader

A mobile-friendly static web reader for translated novel chapters, published via GitHub Pages.

## Live Website

**[https://augustolamim.github.io/novel-reader/](https://augustolamim.github.io/novel-reader/)**

## Project Structure

```text
novel/
  translated chapters/   # source translated .txt files
  untranslated chapters/ # original untranslated .txt files
  website/               # static reader site (deployed to GitHub Pages)
    index.html
    styles.css
    app.js
    chapters.json        # auto-generated chapter manifest
    chapters/            # copied translated .txt files
  website-instructions.md
```

## How to Update

To add new translated chapters to the site, rerun the `website-instructions.md` workflow. It will:

1. Copy new chapters from `translated chapters/` into `website/chapters/`.
2. Update `website/chapters.json`.
3. Commit and redeploy to GitHub Pages.
