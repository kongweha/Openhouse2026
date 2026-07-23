# Handoff — OpenHouse2026

- อัปเดตล่าสุด: 2026-07-23
- ผู้ส่งมอบ: Codex
- Branch: `main`
- สถานะ: Firebase Spark frontend-only implementation

## งานรอบล่าสุด

- ตรวจ production แบบ read-only หลัง reset: มี 500 รหัสและเข้ารูปแบบรหัสว่างครบ
- abort-only browser test ยืนยันว่า Firebase transaction updater รอบแรกยังได้
  `null` แม้ pre-read child path; ไม่มี transaction ใด commit ระหว่างการทดสอบ
- แก้ claim updater ให้ใช้ candidate snapshot เป็น fallback รอบแรก แล้วให้
  Firebase conflict detection/retry ตรวจค่าจริงก่อน commit
- เจ้าของระบบแจ้งว่าได้ล้างและสร้าง pool รหัสใหม่ผ่าน Admin แล้ว
- แก้ false `NO_AVAILABLE_CODES`: Firebase มี pool แต่ root transaction เดิม
  หยุดเมื่อ local cache รอบแรกยังว่าง
- เปลี่ยน Registration เป็น transaction เฉพาะรหัสที่ claim และ student mapping
  เพื่อลด payload และรองรับคำขอชนกันโดยไม่ transaction ทั้ง database
- เพิ่ม cache version ให้ CSS/JS ที่เปลี่ยน ป้องกัน HTML ใหม่ใช้ stylesheet เก่า
- ใช้ `preconnect`/`defer` ใน Stamp, Registration, Admin และ QR Generator
- pin `html5-qrcode` เป็น 2.3.8 เพื่อตัด CDN redirect และลดความผันผวน
- หน้า Stamp เหลือเฉพาะลิงก์ “ลืมรหัส” และส่งภาษาปัจจุบันไปหน้า recovery
- เพิ่ม `registration.html?mode=recover&lang=th|en` แบบซ่อนแท็บและฟอร์มลงทะเบียน
- หน้า Registration รองรับข้อความไทย/อังกฤษทั้งหน้า
- เปลี่ยนคำตอบ “เคย/ไม่เคย” จาก select เป็นปุ่ม radio ที่กดเลือกได้
- เพิ่ม validation ป้องกัน recovery link, language controls และ visit buttons หาย
- ยกเลิก Firebase Functions เพื่อคง Spark plan แบบไม่มี billing
- ลบ `functions/`, `firebase.json` และ `.firebaserc`
- นำ Firebase Web App config เดิมกลับมาใช้
- เพิ่ม `firebase-service.js` เป็นจุดเดียวสำหรับ Firebase operations
- คงหน้า Registration และการผูกรหัสนิสิตกับ Stamp Card
- Registration เลือกรหัสว่างเลขน้อยที่สุดด้วย client-side per-record transaction
- Stamp login, scan/rating, redeem และ draw ใช้ service กลาง
- ตัด participant polling ทุก 3 วินาทีเพื่อลด Realtime Database reads
- Admin อ่าน/reset/clear ผ่าน service กลาง
- คง `Stamp.html` เป็น participant canonical และ `index.html` เป็น redirect
- ปรับ validator ไม่ให้ page scripts ข้าม shared Firebase service
- เพิ่ม unit tests ของ registration และ participant flow ด้วยฐานข้อมูลจำลอง

## ไฟล์สำคัญ

| งาน | ไฟล์ |
| --- | --- |
| Architecture/security | `docs/PROJECT_SSOT.md` |
| Firebase config | `public/assets/js/config/firebase-config.js` |
| Firebase operations | `public/assets/js/shared/firebase-service.js` |
| Registration | `public/registration.html`, `assets/js/pages/registration.js` |
| Stamp | `public/Stamp.html`, `assets/js/pages/stamp.js` |
| Admin | `public/admin.html`, `assets/js/pages/admin.js` |
| Service tests | `scripts/test-firebase-service.mjs` |

## การ deploy

ใช้ GitHub Pages workflow เท่านั้น:

```bash
npm run check
git push origin main
```

ไม่ต้องใช้ Firebase CLI, Cloud Functions หรือ Blaze plan

## Validation ล่าสุด

- `node scripts/validate-static-site.mjs`: ผ่าน, 0 warnings
- `node --test scripts/test-firebase-service.mjs`: ผ่าน รวม concurrent registration
- Local HTTP smoke test: routes หลักและ compatibility routes ตอบ `200`
- Headless Chrome: ตรวจ Stamp language/recovery link, Registration สองภาษา,
  ปุ่มเคย/ไม่เคย และ recovery-only view ผ่านโดยไม่มี page error
- Local headless timing หลัง cache/version fix: Registration ~0.5s, Stamp ~0.9s,
  Admin พร้อมข้อมูล ~1.0s และ QR Generator ~0.5s
- Production abort-only cache test: พบ pool 500, พบ candidate, fallback เห็นข้อมูล,
  `committed: false`
- `git diff --check`: ผ่าน

## สิ่งที่ยังไม่ได้ทำ

- ไม่ได้แก้ production Database Rules
- ไม่ได้เปิด Firebase Auth หรือ App Check
- อ่านเฉพาะโครงสร้าง/count เพื่อวินิจฉัย pool แบบ read-only ไม่เก็บข้อมูลจริงลง repo
- Codex ไม่ได้ล้างหรือเปลี่ยน production data ในรอบนี้
- ยังไม่ได้ทำ end-to-end write test กับ production database

## Known risks

- Admin และ Firebase Database access ไม่มี authentication
- QR และเวลาถูกตรวจจาก browser
- Forgot-code ใช้เพียงรหัสนิสิต
- Registration transactions ต้องได้รับสิทธิ์จาก Database Rules
- Card IDs 8–16 ยังเป็น placeholder

## Git policy

งานต้อง commit/push `main` ตาม standing instruction ห้าม force-push
และห้ามแก้ Rules หรือล้าง production data โดยไม่มีอนุมัติเพิ่ม
