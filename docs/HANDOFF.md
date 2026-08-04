# Handoff — OpenHouse2026

- อัปเดต: 2026-08-04
- Branch: `main`
- Deploy: GitHub Pages จาก `public/`
- Firebase: Realtime Database `eventstampcard`, Spark plan, ไม่มี Functions

## งานล่าสุด

- แบบประเมินกิจกรรมรวมอยู่ในแบบประเมินฐานสุดท้าย และบันทึกใน transaction เดียวกัน
- คำถามประกอบด้วยความพึงพอใจรวม 1–5, ความชอบรายฐาน 1–5, ฐานที่ชอบที่สุด และข้อเสนอแนะ
- ผู้เล่นเก่าที่ครบฐานแล้วแต่ยังไม่มีแบบประเมินเห็นปุ่ม `ประเมินกิจกรรมวันนี้` เพื่อกรอกย้อนหลัง
- หลังส่งแบบประเมินจะเข้าสู่หน้ารับรางวัลโดยยังไม่ตั้ง `isRedeemed`
- หน้ารางวัลมีปุ่มสำหรับเจ้าหน้าที่ พร้อม confirm ก่อนบันทึกและ alert หลังยืนยันรับรางวัล
- การสุ่มการ์ดยังทำได้หลังเจ้าหน้าที่ยืนยันรางวัลเท่านั้น
- Admin/CSV เพิ่มข้อมูลแบบประเมินและสถานะรอเจ้าหน้าที่ยืนยัน
- Registration เพิ่มระดับการศึกษา ปริญญาตรี/โท/เอก และบันทึก `educationLevel`
- Registration ไม่มีแท็บหรือฟอร์มลืมรหัสแล้ว
- ลงทะเบียนซ้ำไม่คืนและไม่แสดง Stamp code
- ลงทะเบียนใหม่กดไป Stamp แล้วรหัสถูกเติมอัตโนมัติด้วย `sessionStorage` (ไม่ใส่รหัสใน URL)
- เพิ่ม `forgot-code.html` สองภาษา ใช้วิธีตรวจบัตรนิสิต/CU NEX กับเจ้าหน้าที่
- ลบ public `registration.recover(studentId)` ออกจาก shared service
- Stamp ใช้ single-active-session: login ใหม่แทน token เดิม, หน้าเดิมฟัง token และถูก logout, action ทุกตัวตรวจ token ใน transaction
- Admin แสดง/ส่งออกระดับการศึกษา; ข้อมูลเก่าแสดง `-`
- Validator ตรวจหน้าใหม่ ระดับการศึกษา และห้าม recovery form กลับมาใน Registration

## สิ่งสำคัญสำหรับ AI คนถัดไป

1. อ่าน `docs/PROJECT_SSOT.md` ก่อนแก้ระบบ
2. แก้ไฟล์เว็บจริงเฉพาะใต้ `public/`; `Stamp.html` คือ participant canonical
3. Firebase operations ต้องผ่าน `assets/js/shared/firebase-service.js`
4. ต้องอัปเดต SSOT และ Handoff ทุกงาน แล้วรัน `npm run check`
5. ต้อง commit/push `main` ตาม standing instruction; ห้าม force-push
6. ห้ามแก้ production Database Rules, Auth หรือข้อมูลจริงโดยไม่มีคำอนุมัติเฉพาะครั้ง

## ข้อจำกัดด้านความปลอดภัย

- วิธีลืมรหัสปัจจุบันต้องมีเจ้าหน้าที่ตรวจตัวตนด้วยบัตร เป็นมาตรการปลอดภัยที่สุดที่ทำได้โดยไม่เพิ่ม Auth/backend
- Single-session ป้องกันการใช้งานพร้อมกันใน UI แต่ไม่ใช่ security boundary หาก Database Rules เปิดกว้าง
- ปุ่มยืนยันรับรางวัลเป็น staff-only ใน UI เท่านั้น ระบบปัจจุบันยังไม่มี Staff Auth จึงบังคับสิทธิ์จริงไม่ได้
- แนวทางถาวรคือ Firebase Auth + verified Chula email + Rules แบบ owner/admin; ต้องถามโดเมนอีเมลที่รับและขออนุมัติก่อนทำ
- Admin ยังไม่มี authentication และ QR ยังตรวจใน browser

## Validation

- `npm run check`: ผ่าน ณ 2026-08-04
- `git diff --check`: ผ่าน
- Headless Chrome local smoke test: `Stamp.html` โหลด page script และสร้างฟอร์มความชอบครบถึงฐาน ID 6 พร้อมปุ่มยืนยันรางวัล
- ยังไม่ได้เขียนข้อมูลหรือเปลี่ยน Rules/Auth ใน production
