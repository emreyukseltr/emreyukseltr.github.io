# EY Studios site — working rules

Static GitHub Pages site served at https://eystudios.com.tr (CNAME). Each sector demo is a single
self-contained HTML file in the repo root.

## Rules for every page (existing and new)

- **Reload always starts at the top.** Every page must include, inside `<head>`:
  ```html
  <script>
  try{history.scrollRestoration='manual';if(location.hash)history.replaceState(null,'',location.pathname+location.search)}catch(e){}
  addEventListener('pageshow',function(){var h=document.documentElement,b=h.style.scrollBehavior;h.style.scrollBehavior='auto';scrollTo(0,0);h.style.scrollBehavior=b});
  </script>
  ```
- **Mobile first.** Test at 320, 360, 390 (touch, @2–3x) and desktop widths: no horizontal overflow,
  no clipped or overlapping text, and long words in every language must wrap.
- **Touch must work without a long press.** Use passive `touchstart`/`touchmove` for canvas effects,
  never block native scrolling, and disable text selection/callout on interactive heroes.
  Exception: a scroll-driven "film" section may limit each fast gesture to one chapter (see the
  film script in `dis-klinigi-super.html`); it must release native scrolling at the film's start and end.
- **Performance.** Keep WebGL/canvas pages smooth on phones: integer canvas sizes, a low pixel
  budget, no `backdrop-filter` over animated canvases, and pause rendering when off-screen.
- **Demo conventions.** Demo pages are `noindex`. They have the fixed `← EY Studios örnek çalışma` link
  to `index.html`, which hides while the footer is visible so it never covers the footer credit
  "Tasarım & geliştirme: EY Studios". WhatsApp number is `905306284284`. The language choice is
  stored in localStorage under `ey-lang`, and the default language is Turkish. Booking messages go
  to the business in Turkish.
- `zeynep_alkoc.html` uses CRLF line endings — preserve them. It is a client preview (noindex,
  not in the sitemap) until the client's own domain is bought.
- `luna.html` (served at eystudios.com.tr/luna) is Luna Bijuteri's client page, built from `taki.html`
  with its config baked in (pink theme, coming-soon mode, the shop's own WhatsApp). noindex, not in the
  sitemap; its assets live in `onizleme/`. Its own domain is lunabijuteri.com, the link the shop shares everywhere (Instagram bio, WhatsApp profile). Deal: 8.500 TL total, 3.500 paid, 5.000 due when the shop opens
  (owner Yağmur makes 8–10 products first, incl. a Tesettür category; 2 free bulk updates, then 500 TL per bulk update, or a one-time 2.000 TL self-service product panel (e.g. a Google Sheet she edits) so she updates products herself and approves with her husband before launch).

## Workflow

- Develop on the working branch, then fast-forward `main` (the owner approved direct publishing).
- Talk to the owner in Turkish. When writing messages in another language for them, always add a
  Turkish translation below.
- Sales outreach is an ongoing A/B test of opening angles. Every offer message the owner approves
  is logged (business, sector, city, channel, opening angle, offer, full text, status) in the
  owner's private "Teklif Defteri" artifact: https://claude.ai/artifact/Pyk8zdrZEnmW6h4y75F1Wn
  (collection `outreach`). Give each new batch different opening angles; when a prospect replies,
  read the log, say which angle worked and update its status. Never put prospect data in this repo.
  Exception: a prospect's own logo for a sales preview may go in `onizleme/` (loaded by `taki.html?lg=`);
  delete it if the deal does not happen.
