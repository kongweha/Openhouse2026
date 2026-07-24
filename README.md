# OpenHouse2026

เว็บสะสมตราประทับสำหรับกิจกรรม Open House 2026 ประกอบด้วยหน้าผู้เข้าร่วม
หน้าลงทะเบียน หน้าสร้าง QR และหน้าผู้ดูแลระบบ โดยใช้ Firebase Realtime
Database บน Spark plan ผ่าน Firebase Client SDK

## เริ่มต้นใช้งาน

ต้องใช้ Node.js 22 ขึ้นไปสำหรับคำสั่งตรวจสอบและ local server

```bash
npm run check
npm run serve
```

จากนั้นเปิด:

- ผู้เข้าร่วม: <http://localhost:4173/Stamp.html>
- ลงทะเบียน/ลืมรหัส: <http://localhost:4173/registration.html>
- ลืมรหัสเท่านั้น: <http://localhost:4173/registration.html?mode=recover&lang=th>
- ผู้ดูแล: <http://localhost:4173/admin.html>
- เครื่องสร้าง QR: <http://localhost:4173/generate-qr.html>

ตัวเว็บจริงเป็น static site และไม่ต้อง build ก่อน deploy ไฟล์ทั้งหมดที่เผยแพร่
อยู่ใน `public/` โดย external scripts โหลดแบบ deferred และมี preconnect
เพื่อลดการบล็อกการแสดงหน้า

## โครงสร้าง

```text
public/                  deployable web root
  assets/css/            styles แยกตามหน้า
  assets/js/config/      frontend app config
  assets/js/pages/       logic แยกตามหน้า
  assets/js/shared/      logic ที่หลาย entry point ใช้ร่วมกัน
  assets/images/cards/   รูปการ์ดชะตา
docs/
  PROJECT_SSOT.md        ข้อเท็จจริงและสถาปัตยกรรมปัจจุบัน
  HANDOFF.md             สถานะส่งมอบงานล่าสุด
scripts/                 validation และ local server
```

## แก้อะไรที่ไหน

| ต้องการแก้ | ไฟล์หลัก |
| --- | --- |
| ชื่อฐาน, รหัส QR, เนื้อหาฐาน, รูปฐาน | `public/assets/js/config/app-config.js` |
| จำนวนรหัสสมาชิกและอายุ QR | `public/assets/js/config/app-config.js` |
| Firebase config | `public/assets/js/config/firebase-config.js` |
| Firebase operations | `public/assets/js/shared/firebase-service.js` |
| ลงทะเบียน/ลืมรหัส | `public/registration.html`, `assets/js/pages/registration.js` |
| หน้าผู้เข้าร่วม | `public/Stamp.html`, `assets/js/pages/stamp.js` |
| หน้า Admin | `public/admin.html`, `assets/js/pages/admin.js` |
| เครื่องสร้าง QR | `public/generate-qr.html`, `assets/js/pages/generate-qr.js` |
| รูปการ์ด | `public/assets/images/cards/` |
| รูปฐาน | `public/assets/images/stations/` |

`Stamp.html` เป็นหน้าผู้เข้าร่วม canonical เพียงชุดเดียว ส่วน `index.html`
redirect ไป `Stamp.html` เพื่อรักษา URL รากโดยไม่ทำโค้ดซ้ำ
ลิงก์ “ลืมรหัส” ใน Stamp เปิด Registration แบบ recovery-only และส่งต่อ
ภาษาที่เลือก ส่วน Registration ปกติรองรับไทย/อังกฤษและใช้ปุ่ม “เคย/ไม่เคย”
`GenerateQR.html` ยังคงเป็น compatibility redirect ไป `generate-qr.html`

รูป production ทั้ง 30 ไฟล์เก็บใน repo และอ้างผ่าน `app-config.js`
ดูแหล่งที่มาและ mapping ได้ที่
[`public/assets/images/README.md`](public/assets/images/README.md)

อ่าน [PROJECT_SSOT.md](docs/PROJECT_SSOT.md) ก่อนแก้ระบบ และอัปเดต
[HANDOFF.md](docs/HANDOFF.md) ทุกครั้งก่อนส่งต่องาน

## ข้อควรระวัง

ระบบใช้ Spark plan และไม่ต้อง deploy Cloud Functions แต่ Admin และ Firebase
operations ยังไม่มี authentication ดูความเสี่ยงเรื่อง Rules, QR และ
forgot-code ใน SSOT ก่อนใช้งานจริง
