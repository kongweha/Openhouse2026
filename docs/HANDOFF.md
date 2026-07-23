# Handoff — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
ผู้ส่งมอบ: Codex  
สถานะ: ปรับโครงสร้างรอบแรกแล้ว รอ security hardening และ functional assets

## สรุปงานรอบล่าสุด

- วิเคราะห์ระบบเดิมครบทั้ง 3 หน้าและ GitHub Pages workflow
- ย้าย deployable site ไปไว้ใต้ `public/`
- เพิ่ม `public/index.html` เป็น canonical participant page
- คง URL เดิม `Stamp.html` และ `GenerateQR.html` ด้วย compatibility redirects
- แยก CSS และ JavaScript ออกจาก HTML ตามหน้า
- รวม Firebase initialization ที่ `assets/js/config/firebase-config.js`
- แก้ tab switching ของ Admin ไม่ให้พึ่ง implicit global `event`
- ย้ายพาธรูปการ์ดไป `public/assets/images/cards/`
- เพิ่ม local server, static validation, README, EditorConfig และ Git ignore
- เพิ่ม `AGENTS.md`, PROJECT_SSOT และ Handoff เพื่อให้ AI/ผู้พัฒนารับช่วงได้ทันที
- จำกัด GitHub Pages artifact ให้เผยแพร่เฉพาะ `public/`
- บันทึก standing instruction จากเจ้าของระบบให้ commit และ push งานที่เสร็จ
  ทุกครั้ง โดย routine push ไป `main` อนุญาตให้ GitHub Pages deploy ได้

## สิ่งที่ต้องตรวจใน change นี้

ให้รัน:

```bash
npm run check
npm run serve
```

แล้วเปิด:

- `/`
- `/admin.html`
- `/generate-qr.html`
- `/Stamp.html`
- `/GenerateQR.html`

Manual test ที่ต้องใช้ระบบจริง:

1. ล็อกอินด้วยรหัสทดสอบ
2. สแกน QR ที่ถูกฐาน/ผิดฐาน/หมดอายุ
3. ให้คะแนนฐานและตรวจ Firebase
4. ผ่าน 7 ฐานและแลกรางวัล
5. เปิด Admin, ดูตาราง และ export CSV

ผลตรวจอัตโนมัติรอบนี้:

- Static validation: ผ่าน
- JavaScript syntax check: ผ่านทุกไฟล์
- `git diff --check`: ผ่าน
- Local HTTP smoke test: `/`, `/admin.html`, `/generate-qr.html`,
  `/Stamp.html`, `/GenerateQR.html` และ asset ตัวอย่างตอบ `200`
- Known warnings: รูปการ์ดขาด 7 ไฟล์

ยังไม่ได้ทำ end-to-end test ที่เชื่อมข้อมูลจริง เพราะไม่มี test user,
Firebase Rules และ test environment ที่ยืนยันขอบเขตให้ใช้งาน

## Known warnings / blockers

- รูป `Card_1.webp` ถึง `Card_7.webp` ยังไม่มีใน repo
- การ์ด 8–16 ยัง map ไป Card 1
- ไม่มีสิทธิ์/ข้อมูลสำหรับตรวจ Firebase Database Rules
- ไม่มี test user ที่ยืนยันว่าใช้กับ production ได้
- Admin ยังไม่มี authentication
- QR ยัง forge ได้จาก browser
- html5-qrcode ยังไม่ pin version

## งานถัดไปที่แนะนำ

เริ่มจาก security design ก่อนเพิ่ม feature:

1. ขอ Firebase Rules ปัจจุบันและรูปแบบสิทธิ์ผู้ดูแลจากเจ้าของระบบ
2. กำหนด Firebase Auth provider และ admin role
3. ออกแบบ signed QR verification ที่ trusted backend
4. ใช้ Firebase Emulator Suite ทำ rules/integration tests
5. เพิ่ม card artwork และยืนยัน mapping 1–16

## ไฟล์ที่ควรอ่านก่อนทำงานต่อ

1. `AGENTS.md`
2. `docs/PROJECT_SSOT.md`
3. `docs/HANDOFF.md`
4. `public/assets/js/pages/stamp.js`
5. `public/assets/js/pages/admin.js`
6. `.github/workflows/static.yml`

## Working tree

รอบนี้ต้อง commit และ push ไป `origin/main` ก่อนส่งมอบ ผู้รับช่วงต้องตรวจ
`git status` และเทียบ local/remote ก่อนเริ่มงานทุกครั้ง

ห้ามแก้ Firebase production rules, ล้างข้อมูล, rotate credentials,
rewrite history หรือ force-push โดยไม่ได้รับอนุมัติเป็นรายครั้ง
