# Yiting Lin — Portfolio

Static portfolio website using HTML, CSS and JavaScript.

GitHub Pages publishes the root of the `main` branch. No build service or paid subscription is required. Videos are embedded from their existing hosting services.

## Updating this website

In the existing Codex workspace, edit `outputs/yiting-portfolio/` as usual, then run:

```sh
python3 scripts/prepare-github-site.py
git -C sites/github-portfolio diff
git -C sites/github-portfolio add index.html style.css script.js assets .nojekyll
git -C sites/github-portfolio commit -m "Update portfolio"
git -C sites/github-portfolio push origin main
```

The preparation script copies only assets referenced by the website. Preview screenshots, local originals and credentials are excluded. Review the changes before pushing. Once Pages is enabled, a push updates the public website automatically.

On a new computer, clone this repository and edit its HTML, CSS, JavaScript and assets directly. Commit and push to update Pages.

Photographs, videos and written work retain their respective copyright. Public source availability does not grant permission to reuse the portfolio's content.
