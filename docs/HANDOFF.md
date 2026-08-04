# Handoff — OpenHouse2026

## 2026-08-04 station presentation update

- Removed the unused reward-pickup map placeholder from the reward view, including its bilingual strings and language-update hook.
- Replaced the station artwork again with the owner-provided files from the `compressed` set.
- Station images are sized at 114% but clipped inside the dashed circle, keeping the border visible while cropping out the artwork's purple edge. Collected-station names are centered over the image and hide only while that station's content is open.
- Replaced all seven station illustrations with the owner-provided images. Each supplied image is copied to both the uncollected and collected runtime assets for its station.
- Renamed `Play Zone` to `Play Time` in the shared station configuration.
- Station detail popups now show only the localized station title and content. The scan-time rating flow and stored rating data remain unchanged.

- อัปเดต: 2026-08-04
- Branch: `main`
- Deploy: GitHub Pages จาก `public/`
- Firebase: Realtime Database `eventstampcard`, Spark plan, ไม่มี Functions

## งานล่าสุด

- Registration รับเฉพาะรหัสนิสิต 10 หลักที่หลักแรกเป็น 5, 6 หรือ 7 โดยตรวจทั้ง HTML/หน้าเว็บและ shared Firebase service พร้อมข้อความแจ้งเตือนสองภาษา
- หลังลงทะเบียนสำเร็จ หน้า Registration ซ่อนหัวข้อ แบบฟอร์ม ปุ่มภาษา และลิงก์อื่น โดยเหลือเฉพาะกรอบผลลัพธ์สีเขียวที่มีรหัส Stamp Card กับปุ่มไปหน้า Stamp

- หัวข้อแบบประเมินเปลี่ยนเป็น `ประเมินความพึงพอใจในกิจกรรม Chula Open House 2026`
- หัวข้อคะแนนทั้ง 5 ไม่มีเลขนำหน้าและไม่มีเส้นคั่นระหว่างหัวข้อ โดยภาพรวมกิจกรรมยังแสดงเด่นตามเดิม
- เปลี่ยนช่องข้อความเป็น `ความประทับใจ/ข้อเสนอแนะ/ติชม` และเพิ่ม `บริการใหม่ที่นิสิตอยากให้มีในห้องสมุด`
- การบันทึกใหม่ใช้ `impressionFeedback` และ `desiredLibraryServices`; Admin/Dashboard ยังรองรับข้อมูลเก่าที่ใช้ `suggestion`
- Admin มีแท็บ `ผลแบบประเมิน` แสดงคะแนน ฐานโปรด และข้อความทั้งสองช่อง, แสดงในรายละเอียดผู้เล่น, ส่งออกใน CSV และมีลิงก์ไป Dashboard
- เพิ่ม `dashboard.html` พร้อม sidebar แยกภาพรวม ระดับการศึกษา ผู้เคย/ไม่เคยมา สถานะการเล่น คะแนนแบบประเมิน ฐานโปรด อัตราผ่าน/คะแนนรายฐาน และความคิดเห็นปลายเปิด
- Dashboard ใช้ HTML/CSS/JavaScript ใน repo ไม่เพิ่ม chart CDN และอ่าน Firebase ผ่าน shared service
- หลังส่งคะแนนฐานสุดท้าย ระบบเปิด popup ดาวสีชมพูคำถามแนวโน้มใช้พื้นที่ห้องสมุด (`finalIntentionRating`)
- ส่งดาวสีชมพูแล้วจึงเปิดใช้งานปุ่ม `ประเมินเพื่อรับของรางวัล`; แบบประเมินนี้ไม่ได้รวมในแบบประเมินฐาน
- ลบคะแนนความชอบรายฐานแล้ว เปลี่ยนเป็นดาว 1–5 ตามลำดับ: รูปแบบกิจกรรม, สถานที่จัดกิจกรรม, ระยะเวลาในการจัดกิจกรรม, ของรางวัล และภาพรวมกิจกรรม
- ภาพรวมกิจกรรมใช้กรอบ พื้นหลัง ตัวอักษร และดาวที่เด่นกว่าหัวข้ออื่น; ไม่มีเส้นคั่นเหนือหัวข้อแบบประเมิน
- ผู้เล่นเก่าที่ครบฐานแล้วจะถูกพาเข้าสู่ดาวสีชมพูก่อน แล้วจึงกดปุ่มทำแบบประเมินกิจกรรม
- หลังส่งแบบประเมินจะเข้าสู่หน้ารับรางวัลโดยยังไม่ตั้ง `isRedeemed`
- หน้ารางวัลมีปุ่มสำหรับเจ้าหน้าที่ พร้อม confirm ก่อนบันทึกและ alert หลังยืนยันรับรางวัล
- การสุ่มการ์ดยังทำได้หลังเจ้าหน้าที่ยืนยันรางวัลเท่านั้น
- Admin/CSV เพิ่มข้อมูลแบบประเมิน ข้อความปลายเปิด และสถานะรอเจ้าหน้าที่ยืนยัน
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
- Admin/Dashboard ยังไม่มี authentication และ QR ยังตรวจใน browser

## Validation

- `npm run check`: ผ่าน ณ 2026-08-04
- Static validator: 0 warnings; Firebase service tests: 6/6
- Browser smoke test: Dashboard แสดง sidebar และ responsive panel layout ได้; environment ทดสอบไม่ได้รอข้อมูล Firebase production จนครบ
- `git diff --check`: ผ่าน
- Headless Chrome local smoke test: `Stamp.html` โหลด popup ดาวสีชมพู และสร้างคะแนน 5 หมวดตามลำดับ พร้อม class `evaluation-criterion-overall` สำหรับทำภาพรวมกิจกรรมให้เด่น และมีปุ่มยืนยันรางวัล
- ยังไม่ได้เขียนข้อมูลหรือเปลี่ยน Rules/Auth ใน production
