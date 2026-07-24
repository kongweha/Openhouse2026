# Image assets

The project contains 30 production images: 14 station states and 16 prediction
cards.

The station images and prediction cards 1–7 were copied byte-for-byte from:

- Repository: `kongweha/Gametest`
- Source directory: `picture/`
- Commit: `251da3aac066dd9b0c0b2c126ace4f7e513a5a74`

Source:
<https://github.com/kongweha/Gametest/tree/251da3aac066dd9b0c0b2c126ace4f7e513a5a74/picture>

Prediction cards 8–16 were provided by the project owner on 2026-07-24.
The source-to-local mapping is documented below.

## Station images

| Station | Uncollected source | Collected source |
| --- | --- | --- |
| Library journey | `LIBRARY PLAYGROUND1.webp` | `LIBRARY PLAYGROUND2.webp` |
| Query Quarry | `Discovery LAB1.webp` | `Discovery LAB2.webp` |
| Play Zone | `Play ZONE1.webp` | `Play ZONE2.webp` |
| Perfect Match | `Treasure corner1.webp` | `Treasure corner2.webp` |
| Camera Go! | `Media studio1.webp` | `Media studio2.webp` |
| Joy Tech Station | `8.webp` | `1145405557.webp` |
| Green Mission | `Safety Checkpoint1.webp` | `Safety Checkpoint2.webp` |

## Card images

All cards use the runtime naming pattern `Card_XX`, from `Card_01` through
`Card_16`. Card 2 remains PNG; every other card is WebP. See `cards/README.md`
for the complete source mapping.

Runtime paths are owned by `public/assets/js/config/app-config.js`. Do not
duplicate image paths in page scripts.
