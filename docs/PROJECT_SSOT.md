# Project SSOT — OpenHouse2026

- อัปเดตล่าสุด: 2026-07-24
- สถานะ: Static Firebase application บน Spark plan

เอกสารนี้คือแหล่งข้อเท็จจริงหลักของโปรเจ็กต์ หากโค้ดและเอกสารไม่ตรงกัน
ให้ตรวจพฤติกรรมจากโค้ดและแก้เอกสารใน change เดียวกัน

## 1. เป้าหมายและ flow

ระบบรองรับกิจกรรมสะสมตราประทับ 7 ฐาน:

1. Admin สร้าง pool รหัส Stamp Card 6 หลักจำนวน 500 รหัส
2. ผู้เข้าร่วมลงทะเบียนด้วยรหัสนิสิต 10 หลักและตอบว่าเคยมางานหรือไม่
3. ระบบจองรหัสว่างที่มีค่าน้อยที่สุดและผูกรหัสนิสิตกับรหัส Stamp Card
4. ผู้ที่ลืมรหัสค้นหารหัสเดิมด้วยรหัสนิสิต
5. ผู้เข้าร่วมล็อกอิน สแกน Dynamic QR และให้คะแนนแต่ละฐาน
6. เมื่อครบ 7 ฐาน ผู้เข้าร่วมประเมินภาพรวม แลกรางวัล และสุ่มการ์ดหนึ่งใบ
7. Admin ดูความสัมพันธ์รหัสนิสิต/Stamp Card สถิติ เส้นทาง คะแนน และ CSV

ฐาน ID 0 และ 1 ใช้ชื่อ `Library journey` และ `Query Quarry`

## 2. Architecture และค่าใช้จ่าย

```text
GitHub Pages (HTML/CSS/JavaScript)
        │ Firebase Client SDK 9.22.2
        ▼
Firebase Realtime Database: eventstampcard
```

- Hosting: GitHub Pages จาก `public/`
- Database: Firebase Realtime Database บน Spark plan
- Backend/Cloud Functions: ไม่มี
- Build step: ไม่มี
- Firebase Web API key: อยู่ใน frontend ตาม Firebase Web App contract
- Access control: ขึ้นกับ Realtime Database Rules เท่านั้น
- Browser dependencies:
  - Firebase compat SDK 9.22.2
  - QRCode.js 1.0.0
  - html5-qrcode 2.3.8 จาก unpkg
- หน้าเว็บใช้ `preconnect` และ `defer` สำหรับ CDN scripts เพื่อลด render blocking

Firebase Web API key เป็น project identifier ไม่ใช่ private credential
ห้ามใช้การซ่อน key แทน Security Rules

## 3. Entry points

| Route | หน้าที่ |
| --- | --- |
| `public/Stamp.html` | Stamp Card ของผู้เข้าร่วม มีลิงก์เฉพาะ “ลืมรหัส” (canonical) |
| `public/index.html` | Redirect จาก URL รากไป `Stamp.html` |
| `public/registration.html` | ลงทะเบียนและค้นหารหัสที่ลืม |
| `public/registration.html?mode=recover&lang=th\|en` | แสดงเฉพาะฟอร์มลืมรหัสตามภาษาที่เลือกจาก Stamp |
| `public/admin.html` | Admin dashboard |
| `public/generate-qr.html` | สร้าง Dynamic QR |
| `public/GenerateQR.html` | Compatibility redirect ไป `generate-qr.html` |

`Stamp.html` เป็น participant implementation เพียงชุดเดียว

## 3.1 Registration UI contract

- หน้า Stamp ไม่มีลิงก์ลงทะเบียน มีเฉพาะลิงก์ “ลืมรหัส”
- ลิงก์ลืมรหัสส่ง `mode=recover` และภาษาปัจจุบันผ่าน `lang=th|en`
- `registration.html` ปกติยังมีแท็บลงทะเบียนและลืมรหัส
- เมื่อมี `mode=recover` ต้องซ่อนแท็บและฟอร์มลงทะเบียน
- หน้า Registration และ recovery-only สลับภาษาไทย/อังกฤษได้
- คำตอบ “เคย/ไม่เคย” เป็น radio buttons แบบกดเลือก ไม่ใช่ select

## 4. โครงสร้างและ ownership

```text
public/
  index.html
  Stamp.html
  registration.html
  admin.html
  generate-qr.html
  GenerateQR.html
  assets/
    css/
    js/
      config/
        app-config.js
        firebase-config.js
      shared/
        firebase-service.js
        legacy-redirect.js
      pages/
    images/
docs/
  PROJECT_SSOT.md
  HANDOFF.md
scripts/
  validate-static-site.mjs
  test-firebase-service.mjs
  serve.mjs
```

| ข้อมูล/พฤติกรรม | Source of truth |
| --- | --- |
| ฐาน, QR, จำนวนรหัส, timing และรูป | `public/assets/js/config/app-config.js` |
| Firebase Web App configuration | `public/assets/js/config/firebase-config.js` |
| การอ่าน/เขียน Firebase ทุกหน้า | `public/assets/js/shared/firebase-service.js` |
| Registration UI | `public/registration.html` และ `pages/registration.js` |
| Stamp UI | `public/Stamp.html` และ `pages/stamp.js` |
| Admin UI | `public/admin.html` และ `pages/admin.js` |
| Prediction card order | `app-config.js` และ `public/assets/images/cards/` |

Page scripts ห้ามเรียก `firebase.database()` หรือ `.ref()` โดยตรง
ต้องเรียกผ่าน `window.OpenHouseApi` จาก `firebase-service.js`

## 5. Data contract

```text
users/{accessCode}
  registration:
    studentId: string
    hasVisitedOpenHouse: boolean
    registeredAt: number
  stations: boolean[7] | object
  isRedeemed: boolean
  loginTime?: number
  redeemTime?: number
  ratings/{stationId}?: number
  scanHistory/{pushId}?: { id: number, name: string, time: number }
  finalIntentionRating?: number
  drawnCardId?: number

studentRegistrations/{studentId}
  studentId: string
  accessCode: string
  hasVisitedOpenHouse: boolean
  registeredAt: number
```

- `studentId` เป็นเลข 10 หลัก
- `accessCode` เป็นเลข 6 หลัก
- Registration อ่าน mapping เดิมและ pool รหัสพร้อมกัน
- การจองใช้ transaction เฉพาะ `users/{accessCode}` แล้ว transaction mapping ที่
  `studentRegistrations/{studentId}` ไม่ส่งข้อมูลทั้ง root กลับ Firebase
- Firebase transaction updater อาจได้รับ `null` ในรอบแรกแม้อ่าน child path แล้ว
  service จึงใช้ `transactionFromServerSnapshot()` เป็น helper กลางสำหรับ
  registration claim, login, complete station, redeem และ draw โดยใช้ snapshot
  จาก server เป็น fallback เฉพาะรอบแรก แล้วปล่อยให้ Firebase ตรวจ
  conflict/retry ก่อน commit
- หากมีคำขอลงทะเบียนรหัสนิสิตเดียวกันพร้อมกัน ระบบคืนรหัสเดิมและปล่อยรหัสที่
  claim เกินกลับเข้า pool
- เลือกรหัสที่ยังไม่มี registration/login/scan/redeem เรียงจากค่าน้อยไปมาก
- ลงทะเบียนรหัสนิสิตเดิมซ้ำคืนรหัสเดิม
- เวลาและ validation มาจาก browser จึงแก้ไขได้
- Stamp อ่านข้อมูลเมื่อ login และเมื่อทำ action เท่านั้น ไม่มี polling ทุก 3 วินาที
  เพื่อประหยัด Realtime Database reads บน Spark plan
- Prediction card IDs 1–16 map แบบหนึ่งต่อหนึ่งไป `Card_01` ถึง `Card_16`
  ตามลำดับ โดย Card 2 เป็น PNG และใบอื่นเป็น WebP

## 6. QR contract

```text
QR_STN_0N|<browser_timestamp_ms>
```

- Generator สร้างใหม่ทุก 90 วินาที
- Scanner ยอมรับอายุไม่เกิน 90 วินาที
- ยอมให้ timestamp นำหน้า 5 วินาที
- ไม่มี signature, server validation หรือ replay protection

## 7. ความปลอดภัย

สถานะปัจจุบัน:

- Firebase config อยู่ใน browser ตามข้อกำหนด Client SDK
- Registration allocation ใช้ transaction แต่ทำจาก client
- Admin ไม่มี authentication
- Admin reset/clear มี browser confirmation เท่านั้น
- ยังไม่ได้ review production Database Rules

ความเสี่ยง:

1. **Critical — Admin ไม่มี authorization**: ผู้ที่เข้าถึงฐานข้อมูลได้สามารถอ่าน
   reset หรือล้างข้อมูล
2. **Critical — QR forge ได้**: validation และ timestamp อยู่ใน browser
3. **High — Forgot-code ใช้รหัสนิสิตอย่างเดียว**
4. **High — Rules ที่เปิดกว้างทำให้ข้าม UI ได้**
5. **Medium — CDN scripts ยังไม่มี SRI**

การแก้ Firebase production Rules, Authentication, App Check หรือการล้างข้อมูล
ต้องขออนุมัติเจ้าของระบบแยกก่อนดำเนินการ

## 8. Known gaps

- ไม่มี Firebase Emulator/Rules tests หรือ browser E2E
- Registration ต้องมี pool รหัสใน `users` ก่อน
- ความถูกต้องและความปลอดภัยจำกัดตาม architecture แบบ frontend-only

## 9. คำสั่งมาตรฐาน

```bash
npm run check
npm run serve
```

`npm run check` ตรวจโครงสร้าง static site และรัน service tests ด้วยฐานข้อมูลจำลอง
โดยไม่อ่านหรือเขียน production database

ไม่ต้องใช้ Firebase CLI และห้ามรัน `firebase deploy --only functions`

## 10. Deployment

เมื่อ push เข้า `main`, GitHub Actions จะตรวจและ deploy เฉพาะ `public/`
ไป GitHub Pages ไม่มีการ deploy Firebase service

Routine repository push ได้รับอนุมัติ แต่การแก้ Database Rules, Firebase data,
credentials, rewrite history หรือ force-push ต้องขออนุมัติรายครั้ง

## 11. Definition of done

1. ผ่าน `npm run check`
2. อัปเดต SSOT และ HANDOFF
3. ไม่เพิ่ม private credential หรือ production data
4. ทดสอบ canonical/legacy routes
5. Commit และ push current branch
6. ตรวจ local branch ตรงกับ remote

## 12. Decision log

- 2026-07-23: แยก deployable files ไป `public/`
- 2026-07-23: คง legacy routes และใช้ `Stamp.html` เป็น participant canonical
- 2026-07-23: นำรูปจาก `Gametest` commit `251da3a` มาเป็น local assets
- 2026-07-23: เปลี่ยนฐาน 1/2 เป็น `Library journey` และ `Query Quarry`
- 2026-07-23: เพิ่ม Registration และ mapping รหัสนิสิต/Stamp Card
- 2026-07-23: ทดลองออกแบบ Firebase Functions แต่ deploy ไม่สำเร็จเพราะ Spark
  plan ไม่รองรับ Functions
- 2026-07-23: เจ้าของระบบเลือกคง Spark plan จึงยกเลิก Functions และรวม
  Firebase Client operations ไว้ใน `firebase-service.js`
- 2026-07-23: ตัด participant polling และเพิ่ม service tests แบบ in-memory
  เพื่อลดการใช้โควตาและตรวจ flow โดยไม่แตะ production data
- 2026-07-23: หน้า Stamp แสดงเฉพาะลิงก์ลืมรหัส โดยเปิด Registration
  แบบ recovery-only, ส่งต่อภาษาไทย/อังกฤษ และเปลี่ยนคำตอบประวัติการเข้าร่วม
  เป็นปุ่มกด
- 2026-07-23: เปลี่ยน Registration จาก root transaction เป็น transaction
  รายรหัส/ราย mapping, เพิ่ม `defer`, `preconnect`, pin html5-qrcode และ
  cache-version ของ assets เพื่อลดเวลารอและแก้ stale browser cache
- 2026-07-24: เพิ่ม prediction cards 8–16 จากไฟล์ที่เจ้าของระบบส่งมา
  และปรับชื่อครบทั้งชุดเป็น `Card_01` ถึง `Card_16` พร้อม mapping ตามลำดับ
