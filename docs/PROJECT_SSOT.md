# Project SSOT — OpenHouse2026

- อัปเดตล่าสุด: 2026-08-04
- สถานะ: Static Firebase application บน Spark plan
- Deploy root: `public/` ผ่าน GitHub Pages

เอกสารนี้คือแหล่งข้อเท็จจริงหลักของระบบ ต้องอัปเดตพร้อมโค้ดทุกครั้ง

## Flow ปัจจุบัน

1. Admin สร้าง pool รหัส Stamp Card 6 หลัก 500 รหัส
2. ผู้ร่วมงานลงทะเบียนด้วยรหัสนิสิต 10 หลัก ระดับการศึกษา (ตรี/โท/เอก) และประวัติการมางาน
3. ระบบจองรหัสว่างที่มีค่าน้อยที่สุดด้วย Firebase transaction
4. การลงทะเบียนใหม่แสดงรหัสครั้งเดียว ปุ่มไป Stamp จะส่งรหัสผ่าน `sessionStorage` และเติมช่องล็อกอินให้อัตโนมัติ
5. หากรหัสนิสิตเคยลงทะเบียนแล้ว หน้าเว็บไม่แสดงหรือส่งรหัสเดิมกลับ
6. ผู้ลืมรหัสเปิด `forgot-code.html` และต้องนำบัตรนิสิตหรือ CU NEX ให้เจ้าหน้าที่ตรวจตัวตน
7. หลังบันทึกคะแนนฐานสุดท้าย ระบบเปิด popup ดาวสีชมพูเพื่อถามแนวโน้มการใช้พื้นที่ห้องสมุด และบันทึก `finalIntentionRating`
8. เมื่อส่งดาวสีชมพูแล้ว ปุ่ม `ประเมินกิจกรรมวันนี้` จึงใช้งานได้; เมื่อกดจะแสดงความพึงพอใจรวมและความชอบทุกฐานแบบดาว 1–5 พร้อมฐานที่ชอบที่สุดและข้อเสนอแนะ
9. หลังส่งแบบประเมินกิจกรรม ระบบเปิดหน้ารับรางวัลแต่ยังไม่ตั้ง `isRedeemed`; เจ้าหน้าที่ต้องกดยืนยันหลังมอบรางวัล ระบบจึงบันทึกเวลาและแจ้งผลสำเร็จ
10. เมื่อรหัสเดียวกันล็อกอินใหม่ `activeSession` จะถูกแทนที่ อุปกรณ์เดิมถูกออกจากระบบและเขียนข้อมูลต่อไม่ได้
11. หลังยืนยันรับรางวัล ผู้เล่นจึงสุ่มการ์ดได้หนึ่งใบ

ฐาน ID 0 และ 1 คือ `Library journey` และ `Query Quarry`

## Architecture

```text
GitHub Pages (HTML/CSS/JavaScript)
        │ Firebase Client SDK 9.22.2
        ▼
Firebase Realtime Database: eventstampcard (Spark)
```

- ไม่มี Cloud Functions และไม่ต้องใช้ Blaze plan
- Firebase Web API key อยู่ใน frontend ตาม Firebase Web App contract; ความปลอดภัยต้องมาจาก Auth และ Database Rules
- การอ่าน/เขียน Firebase ของ page scripts ต้องผ่าน `public/assets/js/shared/firebase-service.js`
- ยังไม่ได้เปิด Firebase Authentication หรือ App Check และยังไม่ได้แก้ production Rules ในงานรอบนี้

## Routes

| Route | หน้าที่ |
| --- | --- |
| `public/Stamp.html` | หน้า Stamp canonical และลิงก์ลืมรหัส |
| `public/index.html` | Redirect ไป `Stamp.html` |
| `public/registration.html` | ลงทะเบียนเท่านั้น ไม่มีเมนูลืมรหัส |
| `public/forgot-code.html?lang=th|en` | ขั้นตอนตรวจตัวตนเพื่อขอรหัสเดิม |
| `public/admin.html` | Dashboard รวมระดับการศึกษาและ CSV |
| `public/generate-qr.html` | สร้าง Dynamic QR |
| `public/GenerateQR.html` | Compatibility redirect |

`registration.html?mode=recover` เก่าจะ redirect ไป `forgot-code.html` เพื่อรักษาลิงก์เดิม

## Data contract

```text
users/{accessCode}
  registration:
    studentId: string
    hasVisitedOpenHouse: boolean
    educationLevel: "bachelor" | "master" | "doctorate"
    registeredAt: number
  activeSession?: { token: string, startedAt: number }
  stations: boolean[7] | object
  isRedeemed: boolean
  loginTime?: number
  redeemTime?: number
  ratings/{stationId}?: number
  scanHistory/{pushId}?: { id: number, name: string, time: number }
  finalIntentionRating?: number (1-5)
  activityEvaluation?:
    overallSatisfaction: number (1-5)
    stationPreferences/{stationId}: number (1-5)
    favoriteStationId: number
    suggestion: string (สูงสุด 1000 ตัวอักษร)
    submittedAt: number
  drawnCardId?: number

studentRegistrations/{studentId}
  studentId: string
  accessCode: string
  hasVisitedOpenHouse: boolean
  educationLevel: "bachelor" | "master" | "doctorate"
  registeredAt: number
```

- ข้อมูลเก่าอาจไม่มี `educationLevel`; Admin แสดง `-`
- ลงทะเบียนรหัสนิสิตเดิมคืน `{ created: false }` โดยไม่คืน `accessCode`
- `completeStation()` บันทึกคะแนนฐานสุดท้ายก่อน โดยยังไม่บันทึกแบบประเมินกิจกรรม
- `submitFinalIntention()` ทำได้เมื่อครบทุกฐาน และต้องเสร็จก่อน `submitEvaluation()`
- `submitEvaluation()` เปิดจากปุ่ม `ประเมินกิจกรรมวันนี้`; คะแนน 1–5 แสดงเป็นดาวใน UI
- ผู้เล่นเก่าที่ครบทุกฐานใช้ flow ดาวสีชมพูแล้วจึงทำแบบประเมินกิจกรรมได้
- `confirmReward()` เป็นคนละ transaction และทำได้เมื่อครบทุกฐาน มี `finalIntentionRating` และมี `activityEvaluation` แล้วเท่านั้น
- หน้า Admin และ CSV แสดงความพึงพอใจ ฐานโปรด ข้อเสนอแนะ และความชอบรายฐาน
- session ใหม่แทน session เดิม และทุก action ที่เปลี่ยนข้อมูลตรวจ token ใน transaction
- `activeSession` เป็นการควบคุมเชิงแอป ไม่ใช่ authentication ที่แข็งแรง หาก Rules เปิดกว้าง ผู้โจมตียังข้าม client ได้
- Stamp ไม่มี polling ข้อมูลผู้ใช้ แต่มี listener เฉพาะ token ของ session เพื่อออกจากระบบเมื่อถูกแทนที่

## Security decisions และความเสี่ยง

มาตรการชั่วคราวสำหรับลืมรหัสคือการตรวจบัตรกับเจ้าหน้าที่ เพราะไม่มีข้อมูลยืนยันตัวตนที่สองที่เชื่อถือได้ในฐานข้อมูลปัจจุบัน ระบบไม่เปิด API ค้นรหัสด้วย student ID แล้ว

แนวทางถาวรที่แนะนำ: เปิด Firebase Auth ส่ง email link/OTP ไปอีเมล Chula ที่ยืนยันแล้ว จากนั้นปรับ Database Rules ให้เจ้าของอ่านข้อมูลตนเองและให้บัญชี admin เท่านั้นที่อ่าน/แก้ข้อมูลทั้งหมด งานนี้ต้องทราบโดเมนอีเมลที่อนุญาตและต้องได้รับอนุมัติก่อนแก้ Auth/Rules production

ความเสี่ยงคงเหลือ:

1. **Critical — Database/Admin ไม่มี authentication ที่บังคับด้วย Rules ที่ได้รับการตรวจแล้ว**
2. **Critical — QR forge/replay ได้** เพราะเวลาและ payload ตรวจใน browser
3. **High — Single-session เป็น client-side coordination** ไม่ใช่หลักฐานตัวตน
4. **High — ปุ่มยืนยันรับรางวัลระบุว่าเจ้าหน้าที่เท่านั้น แต่ยังไม่มี Staff Auth/Rules จึงบังคับสิทธิ์จริงไม่ได้**
5. browser timestamps และ client validation แก้ไขได้

## Ownership

| เรื่อง | Source of truth |
| --- | --- |
| ฐาน, QR, timing, การ์ดและรูป | `public/assets/js/config/app-config.js` |
| Firebase config | `public/assets/js/config/firebase-config.js` |
| Firebase operations | `public/assets/js/shared/firebase-service.js` |
| Registration | `public/registration.html`, `assets/js/pages/registration.js` |
| Forgot code | `public/forgot-code.html`, `assets/js/pages/forgot-code.js` |
| Stamp | `public/Stamp.html`, `assets/js/pages/stamp.js` |
| Admin | `public/admin.html`, `assets/js/pages/admin.js` |

## Validation และ deploy

```bash
npm run check
git push origin main
```

ล่าสุด `npm run check` ผ่าน: static validator 0 warnings และ Firebase service tests 6/6 รวม final intention, activity evaluation, staff reward confirmation และ session replacement
