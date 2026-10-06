# Site generator

The pages under `schemes/`, `about/`, `contact/`, `privacy-policy/`, `disclaimer/`, `404.html`, `sitemap.xml` and `robots.txt` are generated.

To add or edit a scheme, change `gen.py`, then run from the repo root:

    python _tools/gen.py
    python _tools/home.py

`parts.py` holds the shared header, nav and footer. Folders starting with `_` are not published by GitHub Pages.
