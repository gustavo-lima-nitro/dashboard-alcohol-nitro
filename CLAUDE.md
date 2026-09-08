# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-file, zero-dependency analytics dashboard for global alcohol-consumption data,
built for the **Nitro** division of *Deixa Comigo Bebidas*. UI language is **pt-BR**.

```
Dados/drinks.csv                            sample dataset (193 countries) — read-only reference
Dashboards/index.html                       THE deliverable: HTML + CSS + JS in one file
Referencias/nitro_brand_book_by_pomelli.pdf visual source of truth (colors, type, logo)
```

There is no build step, no package manager, no test runner, and no git repo. Everything
runs in the browser from `file://`.

## Working on `Dashboards/index.html`

Preview it:

```bash
start "" "Dashboards/index.html"
```

Or use the Browser pane (`mcp__Claude_Browser__navigate` to the `file://` URL) — that is the
only real verification loop. To exercise it, drag `Dados/drinks.csv` onto the window, or drive
state from the console via the global `S` / `ingest(text, name)` / `renderAll()`.

**The file contains one ~100 KB single-line constant** (`const WORLD = {...}`, around line 807):
the inlined TopoJSON world atlas. Consequences:

- Never rewrite the whole file with Write — you will drop or corrupt it. Use targeted edits.
- To read the file as text, filter that line out: `awk 'length($0)<400' index.html`.
- Line-based greps still work; just expect one monstrous line.

If you re-run `ingest()` from the console to test the parser, it mutates `S.conts`,
`S.countries`, `S.metric`, `S.fileName` and friends. Restoring only `S.rows` leaves
`baseFiltered()` empty and the dashboard looks broken — reset the whole of `S`, then
`recomputeBounds(false); renderAll()`.

## Architecture of index.html

Flow: **file drop/pick → `loadFile` → `parseCSV` → `detectCols` → `ingest` → `recomputeBounds` → `renderAll`**.

- **State** — one plain object `S` (`rows`, `cols`, `metric`, `conts`, `countries`, `range`,
  `bounds`, `scale`, `rank`, `sx`/`sy`, `sortKey`/`sortDir`, `hi`). `S.countries === null`
  means *all*; an empty `Set` means *none* (a legitimate, reachable state — every panel must
  render "Sem dados no filtro atual." rather than throw).
- **Rendering** is full-redraw, not diffed. `renderAll()` calls `renderStats`, `renderMap`,
  `renderRank`, `renderCorr`, `renderScatter`, `renderHist`, `renderContTab`, `renderDataTab`,
  `renderInsights`. Each takes the already-filtered rows. Adding a panel = add a render
  function + call it from `renderAll`.
- **Filtering is two-stage on purpose**: `baseFiltered()` applies continent + country only and
  feeds the range slider's own bounds; `filtered()` adds the numeric range cut. Keep that split
  or the slider will fight itself.
- **Ingestion is deliberately forgiving**: `sniff` picks the delimiter (`, ; tab |`),
  `parseCSV` handles quoted fields with `""` escapes and BOM/CRLF, `toNum` accepts both
  `1.234,5` and `1,234.5` and maps `NA`/`null`/`-`/`—` to null. `detectCols` matches headers
  by regex from the `METRICS` registry — **`total` is matched last** so it cannot steal
  `beer_servings`. If the total column is absent it is derived from the servings columns
  (WHO-ish per-dose litres) and flagged `_derived`.
- **`METRICS` is the single registry** driving the drink-type segmented control, stat units and
  decimals, axis titles and series colors. Add a drink type there, not in each panel.
- **Geo is hand-rolled** — no mapping library. `topoDecode` expands the delta-encoded quantized
  arcs (negative indices mean a reversed arc, via `~i`); `equalEarth` is the closed-form
  Equal Earth projection; `MAP_PATHS` is computed once at load in two passes — first the frame
  extent from raw lon/lat, then the projected rings. `fixAntimeridian` shifts the minority
  hemisphere of a wrapping ring by ±360° (Russia/Chukotka, Fiji) so the fill does not smear
  across the map; the overflow is trimmed by the `#mapClip` clipPath. Do not remove either.
- **Name reconciliation**: the CSV has no continent column, so `CONT_RAW` (country→continent)
  and `ALIAS_RAW` (CSV name→Natural Earth name) are embedded, both keyed through `norm()`
  (NFD diacritic strip, `&`→`and`, `St.`→`saint`, punctuation→space). **Write alias keys in
  normalized form** — `"bosnia herzegovina"`, not `"bosnia-herzegovina"` — and make sure the
  value is a name that actually exists in the 110m atlas.

## Known, intentional limitations (do not "fix" silently)

- ~29 microstates have no polygon at 110m resolution. They stay in every statistic, chart and
  table; the count is surfaced in the map note.
- The continent/alias gazetteer is keyed on **English** country names. Portuguese *headers* are
  supported; Portuguese *country names* land in the visible "Sem mapeamento" bucket.
- The support modal has no backend — it logs the form and shows a confirmation.

## Visual identity

Derived from the brandbook PDF, **not** from the `nitro-padrao-sistemas` / `nitro-ppt` skills
(the user asked for those to be ignored, and their Admiral Blue differs). Tokens live in
`:root`: Admiral Blue `#003663`, Chartreuse `#94C356`, Citron `#B9DA00`, White, Gunmetal
`#424242`; sole typeface **Poppins**. Use the CSS custom properties, never raw hex, in markup
and styles. The choropleth ramp (`RAMP`) and the divergent correlation palette
(`DIV_NEG`/`DIV_MID`/`DIV_POS`) are the only places colors are chosen in JS.

Two hard UX rules from the user: the dashboard must be usable in **one gesture** (drop the
spreadsheet — every filter defaults to "everything selected"), and no data may be hard-coded or
leave the browser (the footer promises 100% local processing; there are no network calls except
the Google Fonts stylesheet).

## Animation gotcha

SVG geometry animated through the Web Animations API needs **CSS units** — `{height:"0px"}`,
not `{height:0}`, or the console fills with "Invalid keyframe value". Existing panels also write
the final attribute values directly on the element so a failed animation cannot leave bars or
dots invisible. Follow that pattern.
