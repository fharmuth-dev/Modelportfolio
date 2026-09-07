# Modelportfolio — Fabian Harmuth

Sedcard-Website für Fotografen und Agenturen. Statisches HTML/CSS/JS, deploybar
über Cloudflare Pages/Workers (siehe `wrangler.jsonc`).

## Struktur

```
index.html                   Landingpage (5 Serien + Bonus + Kontakt-CTA)
blaupause-polaroids.html     Polas, Maße, Sedcard-Download
kontakt.html                 Kontaktformular (Web3Forms)
legal.html                   Datenschutz & Impressum
assets/css/                  ein CSS-File pro Seite + cursor.css (gemeinsam)
assets/js/                   ein JS-File pro Seite + cursor.js (gemeinsam)
images/                      alle Bilder als WebP, siehe Namenskonvention unten
fabian-harmuth-sedcard.pdf   Sedcard-PDF (verlinkt von Landingpage + Polaroids)
```

## Bild-Namenskonvention

Jede Serie hat ein Präfix, Bilder sind fortlaufend nummeriert:

- `sw-*` — Schwarz-Weiß-Serie (apanachii_fotoart24)
- `street-*` — Streetstyle Editorial (Sven.Valentin)
- `adapt-*` — Wandlungsfähig (4m.fotografie · miri_art_photos)
- `character-*-bw` / `character-*-color` — Charakterstark, Hover-Pärchen (invisibleman73)
- `offtrack-*` — Off The Beaten Track (Alexander Krieg)
- `bonus-*` — Bonus/Konzept, Charakterrollen (Alexander Krieg)
- `pola-*` — Blaupause-Polaroids, unkreditiert / Hobby-Produktion

Dateien mit `-hd`-Suffix (z. B. `street-01-hd.webp`) sind die höher aufgelöste
Nachlade-Version von `street-01.webp`. Sie werden nicht beim Seitenaufbau
geladen, sondern erst, wenn das jeweilige Bild per IntersectionObserver in den
sichtbaren Bereich scrollt (siehe `assets/js/landingpage.js` /
`blaupause-polaroids.js`, Abschnitt "Progressive Image Upgrade"). So bleibt der
Qualitäts-Effekt erhalten, ohne dass pauschal alle HQ-Dateien geladen werden.

Alle Bilder wurden aus den Originalen (bis zu 23 MB/Bild, teils doppelt in
Groß-/Kleinschreibung) neu skaliert und als WebP re-komprimiert:
Anzeige-Stufe max. 2000 px / Qualität 80, HD-Stufe max. 3400 px / Qualität 87.
Gesamter `images`-Ordner: ehemals 268 MB → jetzt ca. 8 MB.

## Neue Bilder ergänzen

1. Original in `images/` legen, Namenskonvention oben einhalten.
2. Auf Web-Größe bringen, z. B.:
   ```
   convert original.jpg -auto-orient -strip -resize "2000x2000>" -quality 80 name.webp
   ```
3. In der passenden HTML-Datei referenzieren (`src`, ggf. `data-after` für die
   HD-Version) und die Klasse `upgrade-img` setzen, wenn eine HD-Version
   existieren soll.

## Bekannte Absicht (kein Bug)

- `adapt-02`, `adapt-04`, `offtrack-01`, `offtrack-02` haben bewusst keine
  `-hd`-Version (keine entsprechende Datei vorhanden).
- Der Custom-Cursor (`assets/js/cursor.js`, `assets/css/cursor.css`) ist auf
  jeder Seite eingebunden und wird auf Touch-Geräten/`max-width:980px`
  automatisch deaktiviert.
