# Novel Reader

A mobile-friendly static web reader for translated novel chapters, published via GitHub Pages.

## Live Website

**[https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/](https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/)**

> Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name.

## Project Structure

```
novel/
  translated chapters/   # source translated .txt files
  untranslated chapters/ # original untranslated .txt files
  website/               # static reader site (deployed to GitHub Pages)
    index.html
    styles.css
    app.js
    chapters.json        # auto-generated chapter manifest
    chapters/            # copied translated .txt files
  website-instructions.md  # instructions for building/updating the reader
```

## How to Update

To add new translated chapters to the site, run the `website-instructions.md` workflow via the Claude Code agent. It will:

1. Copy new chapters from `translated chapters/` into `website/chapters/`.
2. Update `website/chapters.json`.
3. Commit and redeploy to GitHub Pages.
