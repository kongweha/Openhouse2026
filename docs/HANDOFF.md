# Handoff — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
ผู้ส่งมอบ: Codex  
สถานะ: จัด source of truth และลดข้อมูลซ้ำแล้ว รอ security hardening

## งานรอบล่าสุด

- เพิ่ม `public/assets/js/config/app-config.js` เป็น source เดียวสำหรับ:
  - รายชื่อ/รหัส/เนื้อหา/รูปของฐานกิจกรรม
  - จำนวนและความยาวรหัสสมาชิก
  - อายุ QR และ clock skew
  - mapping รูปการ์ด
- หน้า Stamp, Admin และ QR generator อ่าน config ชุดเดียวกัน
- ลบรายการ `<option>` ฐานที่เขียนซ้ำใน HTML แล้วสร้างจาก config
- สร้างช่อง OTP ตาม `participants.codeLength`
- เปลี่ยนจำนวนฐานที่ hard-code เป็น `stations.length`
- รวม redirect logic ของ `Stamp.html` และ `GenerateQR.html` เป็น
  `assets/js/shared/legacy-redirect.js`
- จัด indentation และเพิ่ม section comments ใน page scripts
- เพิ่มตาราง “แก้อะไรที่ไหน” ใน README
- ขยาย validator ให้ป้องกัน station QR config ซ้ำและตรวจลำดับโหลด config

## Source ที่ต้องใช้

| งาน | ไฟล์ |
| --- | --- |
| แก้ข้อมูลกิจกรรม/QR/จำนวนรหัส/การ์ด | `public/assets/js/config/app-config.js` |
| แก้ Firebase client identity | `public/assets/js/config/firebase-config.js` |
| แก้ participant behavior | `public/assets/js/pages/stamp.js` |
| แก้ Admin behavior | `public/assets/js/pages/admin.js` |
| แก้ QR generator behavior | `public/assets/js/pages/generate-qr.js` |
| ดู architecture และ risk | `docs/PROJECT_SSOT.md` |

ห้ามเขียน station name, station ID หรือ `QR_STN_*` ซ้ำใน page files
ให้แก้ที่ `app-config.js` เท่านั้น

## ผลตรวจที่ต้องผ่าน

```bash
npm run check
npm run serve
```

ตรวจ local routes:

- `/`
- `/admin.html`
- `/generate-qr.html`
- `/Stamp.html`
- `/GenerateQR.html`

ผลตรวจรอบนี้:

- Static validation: ผ่าน
- JavaScript syntax: ผ่านทุกไฟล์
- App config structure/unique QR checks: ผ่าน
- Duplicate station config guard: ผ่าน
- `git diff --check`: ผ่าน
- Byte-identical file scan ใต้ `public/`: ไม่พบไฟล์ซ้ำ
- Local HTTP smoke test: canonical routes, legacy routes, shared config และ
  shared redirect ตอบ `200`
- Known warnings: ขาดรูปการ์ด 7 ไฟล์

ยังต้องทำ manual test ด้วย Firebase test environment:

1. login และ OTP paste
2. QR ถูกฐาน/ผิดฐาน/หมดอายุ
3. rating และ scan history
4. แลกรางวัลและสุ่มการ์ด
5. Admin filter, dashboard และ CSV export

## Known blockers

- รูป `Card_1.webp` ถึง `Card_7.webp` ยังไม่มี
- การ์ด 8–16 ยังใช้ Card 1 เป็น placeholder
- Admin ยังไม่มี authentication/authorization
- QR ยัง forge ได้
- ยังไม่ได้ review Firebase Database Rules
- html5-qrcode ยังไม่ pin version

## งานถัดไป

1. เพิ่ม Firebase Authentication และ admin role
2. ออกแบบ signed QR ที่ตรวจโดย trusted backend
3. เพิ่ม Database Rules และ emulator tests
4. เพิ่ม card artwork/mapping ให้ครบ
5. เพิ่ม browser smoke tests

## Git / deployment

ก่อนส่งมอบต้อง validation ผ่าน, commit และ push ไป `origin/main`
ตาม standing instruction ของเจ้าของระบบ Routine push ไป `main`
อนุญาตให้ GitHub Pages deploy ได้

ยังต้องขออนุมัติเป็นรายครั้งก่อนแก้ Firebase production rules, ล้างข้อมูล,
rotate credentials, rewrite history หรือ force-push
