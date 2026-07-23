# Image assets

The 21 production images in `stations/` and `cards/` were copied byte-for-byte
from:

- Repository: `kongweha/Gametest`
- Source directory: `picture/`
- Commit: `251da3aac066dd9b0c0b2c126ace4f7e513a5a74`

Source:
<https://github.com/kongweha/Gametest/tree/251da3aac066dd9b0c0b2c126ace4f7e513a5a74/picture>

Files are renamed locally to lowercase kebab-case so their purpose is clear.
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

`Card_1.webp` through `Card_7.webp` map to `card-01.webp` through
`card-07.webp`, except the source `Card_2.png`, which remains PNG as
`card-02.png`.

Runtime paths are owned by `public/assets/js/config/app-config.js`. Do not
duplicate image paths in page scripts.
