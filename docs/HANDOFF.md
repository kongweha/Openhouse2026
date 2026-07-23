# Handoff — OpenHouse2026

- อัปเดตล่าสุด: 2026-07-23
- ผู้ส่งมอบ: Codex
- Branch: `main`
- สถานะ: Firebase Spark frontend-only implementation

## งานรอบล่าสุด

- ยกเลิก Firebase Functions เพื่อคง Spark plan แบบไม่มี billing
- ลบ `functions/`, `firebase.json` และ `.firebaserc`
- นำ Firebase Web App config เดิมกลับมาใช้
- เพิ่ม `firebase-service.js` เป็นจุดเดียวสำหรับ Firebase operations
- คงหน้า Registration และการผูกรหัสนิสิตกับ Stamp Card
- Registration เลือกรหัสว่างเลขน้อยที่สุดด้วย client-side root transaction
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
- `node --test scripts/test-firebase-service.mjs`: ผ่าน 3/3 tests
- Local HTTP smoke test: routes หลักและ compatibility routes ตอบ `200`
- Headless Chrome: `Stamp.html` และ `registration.html` โหลด service ครบ,
  ไม่มี page error และไม่ได้ส่ง form
- `git diff --check`: ผ่าน

## สิ่งที่ยังไม่ได้ทำ

- ไม่ได้แก้ production Database Rules
- ไม่ได้เปิด Firebase Auth หรือ App Check
- ไม่ได้อ่าน ล้าง หรือเปลี่ยน production data
- ยังไม่ได้ทำ end-to-end write test กับ production database

## Known risks

- Admin และ Firebase Database access ไม่มี authentication
- QR และเวลาถูกตรวจจาก browser
- Forgot-code ใช้เพียงรหัสนิสิต
- Registration root transaction ต้องได้รับสิทธิ์จาก Database Rules
- Card IDs 8–16 ยังเป็น placeholder

## Git policy

งานต้อง commit/push `main` ตาม standing instruction ห้าม force-push
และห้ามแก้ Rules หรือล้าง production data โดยไม่มีอนุมัติเพิ่ม
