# Durable kanban labels for plastic tubs

Printed labels on plastic tubs fail in two independent ways. Most people fix one and
stay puzzled about the other.

**The print rubs off.** Direct-thermal printers (most desktop label printers in
default mode) use no ink at all — the stock is a heat-sensitive coating that abrades
and fades by design. This is the usual cause of "it went blank in three weeks."

**The label lifts.** Tubs are polypropylene (~29 dynes/cm) or HDPE (~30). Standard
acrylic adhesive needs roughly 36+ dynes/cm to wet out. It sticks on day one, then
peels from the edges once tubs are handled and stacked.

## Material spec that survives

| Layer | Specify | Why |
| --- | --- | --- |
| Facestock | 2-mil white polyester (PET) | Won't tear or wick moisture |
| Print | Thermal transfer + **resin** ribbon | Resin is the scratch/solvent-resistant grade; wax and wax/resin are not |
| Adhesive | LSE-rated high-tack modified acrylic or rubber | Bonds to PP/HDPE; reaches full strength over 24–72 h |
| Optional | Clear overlaminate | Only for genuinely abrasive handling |

No thermal transfer printer? The laser equivalent is **polyester GHS/chemical label
stock** (Avery UltraDuty 605xx and equivalents), rated to BS5609 for 90-day seawater
immersion. Laser toner is fused plastic and wears well.

> PET tolerates the laser fuser. Plain polypropylene label sheets will melt in one —
> check the stock is rated for laser before it goes through.

Application matters as much as material: wipe with isopropyl alcohol first, apply
above ~10 °C, and don't stress the bond for 24 h.

## Recommended system: two tiers

In a live kanban loop the tub is permanent but its *assignment* is not — parts get
resourced, quantities retuned, loops resized. A perfect permanent label is the wrong
answer to a changing problem, and you end up scraping adhesive off hundreds of tubs.

**Tier 1 — tub ID. Printed once, permanent.** A small polyester/resin barcode
carrying a meaningless unique ID (`TUB-04821`). Never changes for the life of the
tub. Survives because it is small, can sit in a recessed panel, and is never redone.

**Tier 2 — kanban data. Swappable card in a holder.** Adhesive, magnetic, or
hang-over label holders (Akro-Mils 40411 for Akro bins; FATH and SESA make all three
mountings). An ordinary printed card slides in behind a clear window, so **nothing
ever touches the printed surface** and abrasion is designed out rather than resisted.
Reprinting a card costs a cent.

The system links tier 1 to tier 2: scan the tub ID, and it tells you what is supposed
to be in the tub. Cards can be wrong or missing; the tub ID cannot.

Design against the obvious failure — if a card can fall out, it will. Use holders
with a positive retention lip, and set the part number large enough to read from the
aisle.

### When to skip adhesive entirely

If tubs go through a caustic washer, no adhesive label survives repeated cycles
reliably. Use in-mold labelling (only worth it if you buy tubs in volume from the
moulder), direct laser marking, or engraved tags bolted or cable-tied on.

## `label-generator.html`

Open it in any browser — no install, no network, no dependencies. Edit the data,
click **Print**.

- Four layouts: 4×2 in 10-up, 4×3⅓ in 6-up, 2⅝×1 in 30-up (tub IDs), and a 4×6 in
  kanban card for holders.
- Code 39 barcodes generated as vector SVG, encoding either the part number or the
  tub ID. Verified against an independent scanner.
- Part numbers auto-shrink to fit; a warning appears if a barcode's narrow bar would
  fall below 7.5 mil, where scanners start to struggle.
- Millimetre nudge fields to correct printer drift.

Paste data straight from a spreadsheet — columns are pipe- or tab-separated:

```
part | description | location | qty | card | of | tubID | colour
```

Trailing columns may be omitted. Blank lines and `#` comments are ignored. The
`colour` column drives a spine down the label's left edge, useful for value stream or
part family.

### Before the first real print run

1. Print one sheet on plain paper and hold it against a label sheet up to the light.
2. Correct any offset with the nudge fields — laser printers commonly drift 1–2 mm.
3. Set the print dialog to **Scale: 100%**, not "Fit to page", or barcodes print out
   of spec.

Labels are black-only with no background fills, which keeps toner coverage low and
edges crisp — both help durability on polyester stock.
