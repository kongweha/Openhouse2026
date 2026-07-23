# Handoff — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
ผู้ส่งมอบ: Codex  
Branch: `feature/registration-backend`
สถานะ: Implementation และ local tests พร้อม; ยังไม่ deploy Firebase Functions

## งานรอบล่าสุด

- เปลี่ยนชื่อฐาน ID 0/1 เป็น `Library journey` และ `Query Quarry`
- เพิ่มหน้า `registration.html` มีแท็บ:
  - ลงทะเบียน: รหัสนิสิต 10 หลัก + เคย/ไม่เคยมางาน
  - ลืมรหัส: ค้นหารหัส Stamp Card เดิมด้วยรหัสนิสิต
- เพิ่ม Firebase HTTPS Function API และ pure domain layer
- จองรหัสว่างเลขน้อยที่สุดด้วย atomic root transaction
- ผูกข้อมูลสองทาง `studentRegistrations/{studentId}` และ
  `users/{accessCode}/registration`
- ย้าย Stamp login, scan/rating, redeem และ draw จาก Firebase client ไป API
- ย้าย Admin อ่าน/reset/clear ไป API โดยไม่สร้าง key ใหม่ตามคำสั่งเจ้าของระบบ
- ลบ Firebase SDK/config ออกจาก `public/`
- ให้ `Stamp.html` เป็น participant canonical เพียงชุดเดียว และลด `index.html`
  เหลือ redirect ไป `Stamp.html`
- เพิ่ม validator ป้องกัน Firebase client exposure และ frontend/backend config drift
- เพิ่ม unit tests สำหรับ validation, allocation, idempotency และ QR

## ไฟล์สำคัญ

| งาน | ไฟล์ |
| --- | --- |
| Architecture/data/API/deploy plan | `docs/PROJECT_SSOT.md` |
| Registration UI | `public/registration.html`, `assets/js/pages/registration.js` |
| Frontend API client | `public/assets/js/shared/api-client.js` |
| Stamp API integration | `public/assets/js/pages/stamp.js` |
| Admin API integration | `public/assets/js/pages/admin.js` |
| Backend routes | `functions/src/index.js` |
| Allocation/validation | `functions/src/domain.js` |
| Trusted event config | `functions/src/event-config.js` |
| Unit tests | `functions/test/domain.test.js` |

## ผลตรวจ

- Static validator: ผ่าน, 0 warnings
- Domain tests: 7/7 ผ่าน
- Backend `node --check`: ผ่าน
- Functions package import กับ dependency versions ที่ pin ไว้: ผ่าน
- Firebase client exposure scan ใน `public/`: ไม่พบ
- ชื่อฐานเก่าคงเหลือเฉพาะ source filename provenance ของภาพ
- Local HTTP smoke test: root, `index.html`, `Stamp.html`, registration และ Admin
  ตอบ `200`; root/index เป็น redirect และมี participant implementation
  เฉพาะ `Stamp.html`
- Browser mobile smoke test หน้า registration: tabs สลับถูกต้อง, ไม่มี page error
- Browser redirect smoke test: `/` ไป `Stamp.html`, login UI แสดง และลิงก์จาก
  registration ทั้งสองจุดไป `Stamp.html` โดยไม่มี page error

## สิ่งที่ยังไม่ได้ทำ

- ไม่ได้ deploy Firebase Functions
- ไม่ได้แก้ Firebase Realtime Database Rules
- ไม่ได้อ่านหรือล้าง production data
- ไม่ได้ทดสอบ end-to-end กับ Firebase จริง
- ไม่ได้ merge เข้า `main`; production GitHub Pages จึงยังไม่เปลี่ยน

เหตุผล: การ deploy Functions/แก้ rules เป็น production action
ที่ต้องขออนุมัติรายครั้ง และ environment นี้ยังไม่มี Firebase CLI/auth

## ขั้นตอนเปิดใช้

1. ขออนุมัติ owner สำหรับการ deploy Functions
2. ติดตั้ง/authenticate Firebase CLI
3. รัน:

   ```bash
   firebase deploy --only functions:api --project eventstampcard
   ```

4. ทดสอบ health, register, recover, Stamp และ Admin กับข้อมูลทดสอบ
5. Review/ปิด direct client access ใน Database Rules
6. Merge feature branch เข้า `main` เพื่อ deploy frontend

ห้าม merge frontend ก่อน Functions พร้อม เพราะ frontend ใหม่ไม่มี Firebase
client fallback

## Known risks

- QR payload ยัง forge ได้เพราะไม่มี signature/nonce
- Forgot-code ใช้รหัสนิสิตอย่างเดียว ควรเพิ่ม OTP/rate limit/App Check
- Admin API ไม่มี authentication และสามารถอ่าน/reset/clear ข้อมูลได้
- CORS ยังเปิดทุก origin
- Card IDs 8–16 ยังเป็น placeholder
- html5-qrcode ยังไม่ pin version

## Git policy

งานรอบนี้ต้อง commit และ push ไป
`origin/feature/registration-backend` ตาม standing instruction
ห้าม force-push และห้าม deploy production โดยไม่มีอนุมัติเพิ่ม
