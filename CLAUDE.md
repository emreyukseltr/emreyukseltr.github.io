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
- Luna Bijuteri's shop lives only at lunabijuteri.com, served from the separate repo `emreyukseltr/lunabijuteri`
  (index.html, images in `img/`). Make every Luna change there. `luna.html` here is just a redirect to
  lunabijuteri.com (noindex). Deal: 8.500 TL total, 3.500 paid, 5.000 due when the shop opens; 2 free bulk
  updates, then 500 TL per bulk update, or a one-time 2.000 TL self-service product panel. Products follow
  Yağmur's stock table: each has a code (e.g. ELK003KK) kept in the data only; customers and WhatsApp messages see product names, never codes. Product names come from Yağmur herself.

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
- Before writing any offer, check yourself (never ask the owner) whether the prospect already has a site: query
  dns.google (allowed host) for name combinations (ad+soyad, soyad, dr/opdr/uzmdr/prof/av/dt + soyad, + branş) across
  .com .com.tr .net .tr .av.tr .dr.tr .gen.tr .org .info, and web-search the name with city and specialty. Report only
  real matches; parked domains (dns-parking, parity, afternic) don't count.
- Every offer message includes both the prospect's own demo link and a live client site as proof
  ("şu an yayında olan bir müşterimizin sitesi", e.g. lunabijuteri.com for shops/jewellery), plus
  eystudios.com.tr and @eystudios.tr. Write to people the owner already knows from his personal
  Instagram account; to strangers from @eystudios.tr.
