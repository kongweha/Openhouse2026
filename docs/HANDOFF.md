# Handoff — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
ผู้ส่งมอบ: Codex  
สถานะ: Local image assets พร้อมใช้งาน รอ security hardening

## งานรอบล่าสุด

- นำไฟล์ทั้งหมด 21 ไฟล์จาก `kongweha/Gametest/picture` ที่ commit
  `251da3aac066dd9b0c0b2c126ace4f7e513a5a74` เข้า repo
- ตรวจ Git blob SHA ตรงต้นทางทุกไฟล์แบบ byte-for-byte
- แยกไฟล์เป็น:
  - `public/assets/images/stations/` — 14 รูปสำหรับ 7 ฐาน
  - `public/assets/images/cards/` — รูปการ์ด 7 ใบ
- เปลี่ยนชื่อเป็น lowercase kebab-case โดยไม่แปลงคุณภาพ
- คง `card-02.png` เป็น PNG ตามต้นฉบับ ไฟล์อื่นเป็น WebP
- เปลี่ยน `app-config.js` ให้ใช้ local assets แทน jsDelivr CDN
- เพิ่ม `public/assets/images/README.md` บันทึก provenance และ mapping
- ขยาย validator ให้ตรวจ:
  - ทุกภาพที่ config อ้างต้องมีจริง
  - file signature ต้องตรงกับ `.png`/`.webp`
  - ห้ามมีภาพ production ที่ไม่ได้อ้างใช้งาน

## Source of truth

| งาน | ไฟล์ |
| --- | --- |
| Mapping รูปฐานและการ์ด | `public/assets/js/config/app-config.js` |
| รูปฐาน | `public/assets/images/stations/` |
| รูปการ์ด | `public/assets/images/cards/` |
| แหล่งที่มาและ source filename | `public/assets/images/README.md` |
| Architecture และ risks | `docs/PROJECT_SSOT.md` |

อย่าใส่ path ภาพซ้ำใน page scripts ให้แก้ `app-config.js` เท่านั้น

## ผลตรวจรอบนี้

- Source folder inventory: 21 ไฟล์ / 15,418,658 bytes
- Git blob SHA verification: ผ่านทั้ง 21 ไฟล์
- Static validation: ผ่านโดยไม่มี warning
- Image existence/signature checks: ผ่าน
- Unreferenced production image check: ผ่าน
- External runtime station image URL check: ไม่เหลือ
- `git diff --check`: ผ่าน
- Local route smoke test: canonical และ legacy routes ตอบ `200`
- Local image HTTP test: 21/21 ไฟล์ตอบ `200`, ขนาดรวมตรง
  15,418,658 bytes
- MIME spot check: `card-02.png` เป็น `image/png` และรูปฐานเป็น `image/webp`

## Known blockers

- Card IDs 8–16 ยังใช้ `card-01.webp` เป็น placeholder
- Admin ยังไม่มี authentication/authorization
- QR ยัง forge ได้
- ยังไม่ได้ review Firebase Database Rules
- html5-qrcode ยังไม่ pin version
- ยังไม่มี Firebase test environment สำหรับ end-to-end test

## งานถัดไป

1. ยืนยันว่าต้องการการ์ดเฉพาะ 7 แบบ หรือส่งภาพ Card 8–16 เพิ่ม
2. เพิ่ม Firebase Authentication และ admin role
3. ออกแบบ signed QR ที่ตรวจโดย trusted backend
4. เพิ่ม Database Rules/emulator tests และ browser smoke tests

## Git / deployment

ก่อนส่งมอบต้อง validation ผ่าน, commit และ push ไป `origin/main`
ตาม standing instruction ของเจ้าของระบบ Routine push ไป `main`
อนุญาตให้ GitHub Pages deploy ได้

ยังต้องขออนุมัติเป็นรายครั้งก่อนแก้ Firebase production rules, ล้างข้อมูล,
rotate credentials, rewrite history หรือ force-push
