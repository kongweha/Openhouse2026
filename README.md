# OpenHouse2026

เว็บสะสมตราประทับสำหรับกิจกรรม Open House 2026 ประกอบด้วยหน้าผู้เข้าร่วม
หน้าสร้าง QR ประจำฐาน และหน้าผู้ดูแลระบบ โดยใช้ Firebase Realtime Database
เป็นแหล่งข้อมูลกลาง

## เริ่มต้นใช้งาน

ต้องใช้ Node.js 20 ขึ้นไปสำหรับคำสั่งตรวจสอบและ local server

```bash
npm run check
npm run serve
```

จากนั้นเปิด:

- ผู้เข้าร่วม: <http://localhost:4173/>
- ผู้ดูแล: <http://localhost:4173/admin.html>
- เครื่องสร้าง QR: <http://localhost:4173/generate-qr.html>

ตัวเว็บจริงเป็น static site และไม่ต้อง build ก่อน deploy ไฟล์ทั้งหมดที่เผยแพร่
อยู่ใน `public/`

## โครงสร้าง

```text
public/                  deployable web root
  assets/css/            styles แยกตามหน้า
  assets/js/config/      Firebase client configuration
  assets/js/pages/       logic แยกตามหน้า
  assets/images/cards/   รูปการ์ดชะตา
docs/
  PROJECT_SSOT.md        ข้อเท็จจริงและสถาปัตยกรรมปัจจุบัน
  HANDOFF.md             สถานะส่งมอบงานล่าสุด
scripts/                 validation และ local server
```

อ่าน [PROJECT_SSOT.md](docs/PROJECT_SSOT.md) ก่อนแก้ระบบ และอัปเดต
[HANDOFF.md](docs/HANDOFF.md) ทุกครั้งก่อนส่งต่องาน

## ข้อควรระวัง

ระบบปัจจุบันยังมีความเสี่ยงระดับสูงด้านสิทธิ์ Admin และการปลอม QR
ห้ามนำไปใช้กับข้อมูลสำคัญหรือของรางวัลที่มีมูลค่าสูงก่อนทำ security hardening
ตามรายการใน SSOT
