# Project SSOT — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
สถานะ: ฟีเจอร์ registration/backend อยู่บน `feature/registration-backend`
และยังไม่ deploy production

เอกสารนี้คือแหล่งข้อเท็จจริงหลักของโปรเจ็กต์ หากโค้ดและเอกสารไม่ตรงกัน
ให้ตรวจพฤติกรรมจากโค้ดและแก้เอกสารใน change เดียวกัน

## 1. เป้าหมายและ flow

ระบบรองรับกิจกรรมสะสมตราประทับ 7 ฐาน:

1. Admin สร้าง pool รหัส Stamp Card 6 หลักจำนวน 500 รหัส
2. ผู้เข้าร่วมลงทะเบียนด้วยรหัสนิสิต 10 หลักและตอบว่าเคยมางานหรือไม่
3. Backend จองรหัสว่างที่มีค่าน้อยที่สุดและผูกรหัสนิสิตกับรหัส Stamp Card
4. ผู้ที่ลืมรหัสค้นหารหัสเดิมด้วยรหัสนิสิตได้
5. ผู้เข้าร่วมล็อกอิน สแกน Dynamic QR และให้คะแนนแต่ละฐาน
6. เมื่อครบ 7 ฐาน ผู้เข้าร่วมประเมินภาพรวม แลกรางวัล และสุ่มการ์ดหนึ่งใบ
7. Admin ดูความสัมพันธ์รหัสนิสิต/Stamp Card สถิติ เส้นทาง คะแนน และ CSV

ฐาน ID 0 และ 1 ใช้ชื่อ `Library journey` และ `Query Quarry` ตามลำดับ

## 2. Architecture และเทคโนโลยี

```text
GitHub Pages (public/)
        │ HTTPS JSON
        ▼
Firebase HTTPS Function: api (asia-southeast1)
        │ Firebase Admin SDK / transactions
        ▼
Firebase Realtime Database: eventstampcard
```

- Frontend: HTML, CSS, JavaScript แบบไม่ใช้ framework
- Static hosting: GitHub Pages จาก `public/`
- Backend: Firebase Functions v2, Node.js 22
- Database access: Firebase Admin SDK จาก Functions เท่านั้น
- Admin authorization: secret `OPENHOUSE_ADMIN_API_KEY` ส่งผ่าน header
  `x-admin-key`; browser เก็บ key เฉพาะ `sessionStorage`
- Firebase Functions dependencies:
  - `firebase-functions` 7.3.0
  - `firebase-admin` 14.2.0
- Browser dependencies:
  - QRCode.js 1.0.0
  - html5-qrcode จาก unpkg (ยังไม่ได้ pin version)

ไม่มี Firebase web config หรือ Firebase client SDK ใน `public/`
ค่า `OpenHouseConfig.api.baseUrl` เป็น public endpoint ไม่ใช่ credential

## 3. Entry points

| Route | หน้าที่ |
| --- | --- |
| `public/registration.html` | ลงทะเบียนและค้นหารหัสที่ลืม |
| `public/index.html` | Stamp Card ของผู้เข้าร่วม |
| `public/admin.html` | Admin dashboard ที่ต้องใส่ API key |
| `public/generate-qr.html` | สร้าง Dynamic QR ของแต่ละฐาน |
| `public/Stamp.html` | Compatibility redirect ไป `index.html` |
| `public/GenerateQR.html` | Compatibility redirect ไป `generate-qr.html` |

ห้ามลบ compatibility routes โดยไม่มี migration plan

## 4. โครงสร้าง source และ ownership

```text
public/                         deployable static web root
  registration.html
  index.html
  admin.html
  generate-qr.html
  assets/
    css/
    js/
      config/app-config.js      frontend display/runtime config
      shared/api-client.js      HTTPS API client
      pages/
    images/
functions/
  src/
    index.js                    HTTP routing + database operations
    domain.js                   pure validation/allocation domain logic
    event-config.js             trusted backend event config
  test/domain.test.js
docs/
  PROJECT_SSOT.md
  HANDOFF.md
scripts/
  validate-static-site.mjs
  serve.mjs
firebase.json
.firebaserc
```

| ข้อมูล/พฤติกรรม | Source of truth |
| --- | --- |
| ชื่อ/ID/QR ของฐานฝั่ง trusted backend | `functions/src/event-config.js` |
| รูป คำอธิบาย และ display config ฝั่ง frontend | `public/assets/js/config/app-config.js` |
| Registration allocation และ validation | `functions/src/domain.js` |
| HTTP/data operations | `functions/src/index.js` |
| API base URL และ poll interval | `public/assets/js/config/app-config.js` |
| API request shape | `public/assets/js/shared/api-client.js` |
| ภาพ production และ provenance | `public/assets/images/` |

Validator บังคับให้ station, จำนวนรหัส, ความยาวรหัส และ QR timing ใน frontend
ตรงกับ backend และ reject Firebase client config/direct database access ใน
`public/`

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

- `studentId` ต้องเป็นเลข 10 หลัก
- `accessCode` ต้องเป็นเลข 6 หลัก
- การลงทะเบียนใช้ root Realtime Database transaction เพื่อจองรหัสแบบ atomic
- เลือกรหัสที่ยังไม่มี registration/login/scan/redeem โดยเรียงค่าตัวเลขน้อยไปมาก
- ลงทะเบียนรหัสนิสิตเดิมซ้ำเป็น idempotent และคืนรหัสเดิม
- เวลา login, scan, redeem และ registration มาจาก backend

## 6. HTTP API contract

Public:

| Method | Path | หน้าที่ |
| --- | --- | --- |
| `GET` | `/health` | Health check |
| `POST` | `/registration/register` | ลงทะเบียน/คืนรหัสเดิม |
| `POST` | `/registration/recover` | ค้นหารหัสจากรหัสนิสิต |
| `POST` | `/participants/login` | Login และตั้งเวลาเริ่ม |
| `GET` | `/participants/{code}` | อ่านสถานะ participant |
| `POST` | `/participants/{code}/stations/{id}` | ตรวจ QR และบันทึกคะแนน |
| `POST` | `/participants/{code}/redeem` | ประเมินและแลกรางวัล |
| `POST` | `/participants/{code}/draw` | สุ่ม/คืนการ์ดเดิม |

Admin (`x-admin-key` required):

| Method | Path | หน้าที่ |
| --- | --- | --- |
| `GET` | `/admin/users` | อ่านข้อมูลผู้ใช้ |
| `POST` | `/admin/codes/reset` | สร้าง pool ใหม่และลบ registration เดิม |
| `DELETE` | `/admin/users/clear` | ล้าง users และ registrations |

คำสั่ง reset/clear ยังมี confirmation token ใน request body เพิ่มอีกชั้น

## 7. QR contract

Payload:

```text
QR_STN_0N|<generator_timestamp_ms>
```

- Generator สร้าง payload ใหม่ทุก 90 วินาที
- Frontend ตรวจรูปแบบเพื่อ feedback ที่เร็ว
- Backend ตรวจ station code, อายุไม่เกิน 90 วินาที และ future skew ไม่เกิน 5 วินาที
- บันทึกสถานะ/คะแนน/เวลา scan ใน transaction เดียว

ยังไม่มี signature หรือ nonce ดังนั้นผู้ใช้ที่รู้รูปแบบยัง forge QR ได้

## 8. ความปลอดภัยและความเป็นส่วนตัว

สิ่งที่แก้แล้วใน feature branch:

- browser ไม่เชื่อม Realtime Database โดยตรง
- ไม่มี Firebase API config ใน deployable frontend
- การจองรหัส, scan, redeem และ draw ถูกตรวจใน backend transaction
- Admin key อยู่ใน Firebase Functions secret และไม่ commit
- Admin render ค่า database ผ่าน HTML escaping

ความเสี่ยงที่ยังเหลือ:

1. **Critical — QR ยัง forge ได้**: ต้องใช้ signature/nonce ที่ backend ออกให้
2. **High — Recover endpoint ใช้รหัสนิสิตอย่างเดียว**: ผู้ที่เดารหัสได้อาจค้น
   access code ของผู้อื่น ต้องเพิ่ม OTP/identity proof หรือ rate limit/App Check
3. **High — ยังไม่ได้ review production Database Rules**: ควรปิด client access
   และทดสอบ rules ก่อนเปิดใช้
4. **Medium — Admin ใช้ shared secret**: ควรย้ายเป็น Firebase Auth + role claim
5. **Medium — CORS เปิดทุก origin**: จำกัดเป็น production domain หลังยืนยัน URL
6. **Medium — html5-qrcode ไม่ได้ pin version/SRI**

ห้าม commit Admin API key, service-account key หรือ production data

## 9. Known gaps

- Card IDs 8–16 ยังใช้ `card-01.webp` เป็น placeholder
- ไม่มี Firebase Emulator integration test หรือ browser E2E
- feature branch ยังเชื่อม API URL production ซึ่งยังไม่มี Function deploy
- การ reset/clear เป็น destructive production operation และต้องขออนุมัติ

## 10. คำสั่งมาตรฐาน

```bash
npm run check
npm run serve
cd functions
npm install
npm test
```

ใช้ Node.js 22 ขึ้นไป `npm run check` ตรวจ static references, syntax,
frontend/backend config drift, ไม่มี Firebase client exposure, image signature
และ domain tests

## 11. Deployment plan

Frontend และ backend ต้อง deploy เป็นลำดับ:

1. ติดตั้ง Firebase CLI และ authenticate บัญชีที่มีสิทธิ์
2. จาก root รัน `firebase functions:secrets:set OPENHOUSE_ADMIN_API_KEY`
3. รัน `firebase deploy --only functions`
4. ทดสอบ `/health`, registration, recovery และ Admin กับข้อมูลทดสอบ
5. Review production Database Rules และปิด direct client access
6. Merge `feature/registration-backend` เข้า `main`; GitHub Pages จะ deploy
   `public/`

ห้าม merge frontend นี้เข้า `main` ก่อน backend พร้อม เพราะ Stamp/Admin ใหม่
ไม่สามารถ fallback ไป Firebase client เดิม

Routine repository push ได้รับอนุมัติจากเจ้าของระบบ แต่การ deploy Functions,
ตั้ง/rotate secret, แก้ production rules, ล้างข้อมูล, rewrite history และ
force-push ต้องขออนุมัติเป็นรายครั้ง

## 12. Definition of done

1. รักษา route/data contract หรือบันทึก migration
2. ผ่าน `npm run check`
3. อัปเดต SSOT และ `docs/HANDOFF.md`
4. ระบุส่วนที่ยังทดสอบ live ไม่ได้
5. ไม่เพิ่ม credential หรือ production data
6. Commit และ push current branch ไป `origin`
7. ตรวจ local branch ตรงกับ remote ก่อนส่งมอบ

## 13. Decision log

- 2026-07-23: แยก deployable files ไป `public/` และคง legacy redirects
- 2026-07-23: ใช้ SSOT/Handoff เป็น continuity documents บังคับ
- 2026-07-23: นำรูป 21 ไฟล์จาก `Gametest` commit `251da3a` มาเป็น local assets
- 2026-07-23: เปลี่ยนฐาน 1/2 เป็น `Library journey` และ `Query Quarry`
- 2026-07-23: แยก browser ออกจาก Realtime Database ผ่าน HTTPS Function
- 2026-07-23: เพิ่ม atomic registration mapping และ recovery
- 2026-07-23: ใช้ Firebase Functions secret สำหรับ shared Admin API key
- 2026-07-23: ทำงานบน feature branch จนกว่า backend production จะ deploy
