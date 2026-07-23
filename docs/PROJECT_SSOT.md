# Project SSOT — OpenHouse2026

อัปเดตล่าสุด: 2026-07-23  
สถานะ: ใช้งานเป็น static web application และอยู่ระหว่าง hardening ก่อน production

เอกสารนี้คือแหล่งข้อเท็จจริงหลักของโปรเจ็กต์ หากโค้ดและเอกสารไม่ตรงกัน
ให้ตรวจสอบพฤติกรรมจากโค้ด แล้วแก้เอกสารนี้ใน change เดียวกัน

## 1. เป้าหมายระบบ

ระบบรองรับกิจกรรมสะสมตราประทับ 7 ฐาน:

1. Admin สร้างรหัสสมาชิก 6 หลักจำนวน 500 รหัส
2. ผู้เข้าร่วมล็อกอินด้วยรหัสสมาชิก
3. ผู้เข้าร่วมสแกน Dynamic QR ของแต่ละฐาน
4. ผู้เข้าร่วมให้คะแนนแต่ละฐาน
5. เมื่อครบ 7 ฐาน ผู้เข้าร่วมประเมินภาพรวมและแลกรางวัล
6. หลังแลกรางวัล ผู้เข้าร่วมสุ่มการ์ดชะตาได้หนึ่งใบ
7. Admin ดูสถิติ เส้นทาง ระยะเวลา คะแนน และ export CSV

## 2. ขอบเขตและเทคโนโลยี

- Frontend: HTML, CSS และ JavaScript แบบไม่ใช้ framework
- Hosting: GitHub Pages ผ่าน `.github/workflows/static.yml`
- Database: Firebase Realtime Database โปรเจ็กต์ `eventstampcard`
- Authentication: ยังไม่มี Firebase Authentication
- Build step: ไม่มี; deploy เนื้อหาใน `public/` โดยตรง
- Runtime สำหรับเครื่องมือ: Node.js 20 ขึ้นไป

External browser dependencies:

- Firebase compat SDK `9.22.2`
- QRCode.js `1.0.0`
- html5-qrcode จาก unpkg (ยังไม่ได้ pin version)
- รูปฐานกิจกรรมจาก jsDelivr ที่ pin ด้วย Git commit

## 3. Entry points และ URL contract

| Route | หน้าที่ |
| --- | --- |
| `public/index.html` | หน้าผู้เข้าร่วมและบัตรสะสมตรา |
| `public/admin.html` | Dashboard และคำสั่งจัดการข้อมูล |
| `public/generate-qr.html` | สร้าง Dynamic QR ของแต่ละฐาน |
| `public/Stamp.html` | Compatibility redirect ไป `index.html` |
| `public/GenerateQR.html` | Compatibility redirect ไป `generate-qr.html` |

ห้ามลบ compatibility routes จนกว่าจะยืนยันว่า QR, bookmark และเอกสารภายนอก
ทั้งหมดเปลี่ยน URL แล้ว

## 4. โครงสร้าง source

```text
public/
  index.html
  admin.html
  generate-qr.html
  Stamp.html
  GenerateQR.html
  assets/
    css/
      stamp.css
      admin.css
      generate-qr.css
    js/
      config/firebase-config.js
      pages/stamp.js
      pages/admin.js
      pages/generate-qr.js
    images/cards/
docs/
  PROJECT_SSOT.md
  HANDOFF.md
scripts/
  validate-static-site.mjs
  serve.mjs
```

ไฟล์ใน `public/` เท่านั้นที่เป็น deployable artifact ส่วน `docs/` และ `scripts/`
ไม่ถูกเผยแพร่โดย GitHub Pages

## 5. Data contract

ข้อมูลหลักอยู่ใต้ path `users/{code}` โดย `code` เป็นเลข 6 หลัก

```text
users/{code}
  stations: boolean[7] | object
  isRedeemed: boolean
  loginTime?: number
  redeemTime?: number
  ratings/{stationId}?: number
  scanHistory/{pushId}?: { id: number, name: string, time: number }
  finalIntentionRating?: number
  drawnCardId?: number
```

เวลาเป็น Unix epoch milliseconds จาก `Date.now()` ฝั่ง browser
และไม่ได้รับการรับรองโดย server

## 6. QR contract

Payload ปัจจุบัน:

```text
QR_STN_0N|<browser_timestamp_ms>
```

- Generator สร้าง payload ใหม่ทุก 90 วินาที
- Scanner ยอมรับ QR ที่มีอายุไม่เกิน 90 วินาที
- Scanner ยอมให้ timestamp นำหน้าเวลาของเครื่องผู้ใช้ได้ 5 วินาที
- ไม่มี signature, nonce ฝั่ง server หรือ replay protection

สัญญานี้ต้องคงเดิมจนกว่าจะออกแบบ backend verification และ migration plan

## 7. Firebase และความปลอดภัย

`public/assets/js/config/firebase-config.js` มี Firebase web configuration
ซึ่งเป็น client identifier ที่ต้องเปิดเผยใน browser ไม่ใช่ service-account secret
ความปลอดภัยจริงต้องมาจาก Firebase Authentication และ Realtime Database Rules

สถานะ rules และ authentication ปัจจุบันยังไม่ได้รับการตรวจจาก repo นี้
ห้ามสรุปว่าฐานข้อมูลปลอดภัยเพียงเพราะ config ไม่มี private key

ความเสี่ยงที่ต้องแก้ก่อน production:

1. **Critical — Admin ไม่มี authentication/authorization**  
   ทุกคนที่เปิดหน้าได้อาจสร้างรหัสใหม่ ล้างข้อมูล และอ่าน/export ข้อมูลได้
   หาก Database Rules อนุญาต
2. **Critical — QR ปลอมได้**  
   ผู้ใช้สร้าง payload ชื่อฐานและ timestamp ปัจจุบันเองได้ทั้งหมด
3. **High — Client เขียนผลสำเร็จและสถานะแลกรางวัลเอง**  
   ต้องย้าย validation สำคัญไป trusted backend หรือ Cloud Functions
4. **High — ยังไม่ทราบ Database Rules**  
   ต้อง export/review rules และทำ Firebase Auth ก่อนเปิดใช้จริง
5. **Medium — การเขียนคะแนน/ประวัติแยกหลาย request**  
   อาจเกิด partial update ควรเปลี่ยนเป็น atomic multi-location update
6. **Medium — Admin render บางค่าจากฐานข้อมูลด้วย `innerHTML`**  
   ควร escape หรือสร้าง DOM nodes เพื่อป้องกัน stored XSS
7. **Medium — html5-qrcode ไม่ได้ pin version/SRI**  
   ทำให้ dependency เปลี่ยนโดยไม่ผ่าน review ได้

## 8. Known functional gaps

- Repo ยังไม่มี `Card_1.webp` ถึง `Card_7.webp`; การแสดงการ์ดจะเป็น broken image
- Card IDs 8–16 ยังชี้กลับไป `Card_1.webp` เป็น placeholder
- ชื่อฐานใน Admin/QR generator บางรายการยังเป็นชื่อเก่า ไม่ตรงกับชื่อในหน้าผู้ใช้
- การจับเวลาอาศัยนาฬิกาอุปกรณ์ผู้ใช้ จึงแก้ไขหรือคลาดเคลื่อนได้
- ไม่มี automated browser/E2E test และไม่มี Firebase emulator test
- ยังไม่มีสถานะ loading/error ที่สม่ำเสมอสำหรับทุก Firebase operation

## 9. คำสั่งมาตรฐาน

```bash
npm run check
npm run serve
```

`npm run check` ตรวจ:

- entry point และไฟล์หลักครบ
- local `href`/`src` ไม่ชี้ไฟล์หาย
- หน้า canonical ไม่มี inline CSS/JavaScript
- JavaScript parse ผ่าน
- แจ้งเตือนรูปการ์ดที่ยังขาด

## 10. Deployment

เมื่อ push ไป `main`, GitHub Actions จะ:

1. checkout source
2. ตรวจ static site
3. configure GitHub Pages
4. upload เฉพาะ `public/`
5. deploy ไป environment `github-pages`

การ deploy, การแก้ Firebase Rules และการล้างข้อมูล production
มีนโยบายดังนี้:

- เจ้าของระบบให้ standing instruction เมื่อ 2026-07-23 ให้ commit และ push
  งาน repository ที่เสร็จทุกครั้ง
- การ push งานปกติไป `main` ซึ่งทำให้ GitHub Pages deploy ถือว่าได้รับอนุมัติ
- การแก้ Firebase production rules, ล้างข้อมูล, rotate credentials,
  rewrite history หรือ force-push ยังต้องขออนุมัติเป็นรายครั้ง

## 11. Definition of done

ทุก change ต้อง:

1. รักษา entry points และ data/QR contract หรือบันทึก migration ชัดเจน
2. ผ่าน `npm run check`
3. อัปเดต SSOT หากข้อเท็จจริงด้าน architecture/behavior เปลี่ยน
4. อัปเดต `docs/HANDOFF.md` ทุกครั้ง
5. ระบุ manual test ที่ทำและส่วนที่ยังทดสอบไม่ได้
6. ไม่เพิ่ม private credential หรือ production data ลง Git
7. Commit การเปลี่ยนแปลงที่อยู่ในขอบเขตงานและ push ไป `origin`
8. ตรวจว่า local branch ตรงกับ remote ก่อนส่งมอบ

## 12. ลำดับงานแนะนำ

1. เพิ่ม Firebase Authentication และ role-based admin authorization
2. ออกแบบ signed QR และ server-side verification
3. ตรวจและ version-control Database Rules พร้อม emulator tests
4. เพิ่มรูปการ์ดจริงและกำหนด mapping 1–16 ให้ครบ
5. รวม station configuration เป็น source เดียวเพื่อลดชื่อ/รหัสไม่ตรงกัน
6. เพิ่ม browser smoke tests สำหรับ login, scan, rating, redeem และ admin

## 13. Decision log

- 2026-07-23: แยก deployable files ไป `public/`
- 2026-07-23: แยก inline CSS/JS เป็น page assets
- 2026-07-23: รวม Firebase client initialization ไว้ไฟล์เดียว
- 2026-07-23: เพิ่ม compatibility redirects สำหรับ URL เดิม
- 2026-07-23: กำหนด SSOT/Handoff เป็นเอกสารบังคับผ่าน `AGENTS.md`
- 2026-07-23: เจ้าของระบบกำหนด standing instruction ให้ commit และ push
  ทุกงานที่เสร็จ โดย routine push ไป `main` อนุญาตให้ deploy GitHub Pages ได้
