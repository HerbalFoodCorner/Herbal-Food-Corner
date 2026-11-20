HERBAL FOOD CORNER – WEBSITE PACKAGE
=====================================

Live website:
https://herbalfoodcorner.github.io/Herbal-Food-Corner/

GitHub repository:
https://github.com/HerbalFoodCorner/Herbal-Food-Corner

IMPORTANT FILES
---------------
index.html / index-si.html / index-ta.html : English, Sinhala and Tamil home pages
admin.html                                  : Admin dashboard
menu.json                                   : Menu items
categories.json                             : Menu categories (English / Sinhala / Tamil names)
menu.js                                     : Category-wise menu display
gallery.json / gallery.js                   : Gallery and Special Moments data
images/                                     : Website photos and logo
sitemap.xml / robots.txt                    : Search engine files

CATEGORY MANAGEMENT
-------------------
1. Open the Admin Panel:
   https://herbalfoodcorner.github.io/Herbal-Food-Corner/admin.html
2. Connect using a GitHub Fine-grained Personal Access Token.
3. Select the Categories tab.
4. Add, edit or delete categories. Add category names in English, Sinhala and Tamil.
5. Categories are saved in categories.json and appear as separate sections on the three language home pages.
6. A category cannot be deleted while menu items still use it. Move those items to another category first.

MENU / PHOTO MANAGEMENT
-----------------------
Use the Menu, Herbal Plants and Special Moments tabs in the Admin Panel.
Changes are committed to this GitHub repository and may take a few minutes to appear on the live website.

SECURITY
--------
The Admin Panel does not store your GitHub token or password. The token is held only in the current browser tab and is cleared when you disconnect or close/reload the tab. Do not paste your token into chat or share it.
Create a Fine-grained token limited to this repository, with Contents: Read and write permission only. Set an expiry date and revoke the token in GitHub if it is exposed.
A GitHub Pages static site cannot provide a secure private password login by itself. A true password-based login requires a trusted authentication/backend service.

SEO
---
The website has language-specific canonical URLs, hreflang links, social preview metadata, Restaurant structured data, sitemap.xml and robots.txt. Google indexing and ranking are controlled by Google and are not guaranteed.
