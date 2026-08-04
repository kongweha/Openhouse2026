# Image assets

The project contains 30 production images: 14 station states and 16 prediction
cards.

The original station images and prediction cards 1–7 were copied byte-for-byte from:

- Repository: `kongweha/Gametest`
- Source directory: `picture/`
- Commit: `251da3aac066dd9b0c0b2c126ace4f7e513a5a74`

Source:
<https://github.com/kongweha/Gametest/tree/251da3aac066dd9b0c0b2c126ace4f7e513a5a74/picture>

Prediction cards 8–16 were provided by the project owner on 2026-07-24.
The source-to-local mapping is documented below.

## Station images

The current compressed station artwork was provided by the project owner on 2026-08-04.
Each supplied image is used for both the uncollected and collected runtime assets.

| Station | Current source for both states |
| --- | --- |
| Library journey | `Library journey.webp` |
| Query Quarry | `Query Quarry.webp` |
| Play Time | `Play Time.webp` |
| Perfect Match: TAIC Collections | `Perfect Match TAIC Collections.webp` |
| Camera Go! | `Camera Go!.webp` |
| Joy Tech Station | `Joy Tech Station.webp` |
| Green Mission | `Green Mission.webp` |

## Card images

All cards use the runtime naming pattern `Card_XX`, from `Card_01` through
`Card_16`. Card 2 remains PNG; every other card is WebP. See `cards/README.md`
for the complete source mapping.

Runtime paths are owned by `public/assets/js/config/app-config.js`. Do not
duplicate image paths in page scripts.
