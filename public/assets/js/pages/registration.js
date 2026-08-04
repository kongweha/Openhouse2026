(() => {
  "use strict";

  const COPY = {
    th: {
      documentTitle: "ลงทะเบียน | Chula Library Open House 2026",
      title: "รับรหัสสะสมแสตมป์",
      intro: "ลงทะเบียนหนึ่งครั้งเพื่อรับรหัส 6 หลักสำหรับ Stamp Card",
      studentId: "รหัสนิสิต",
      studentPlaceholder: "กรอกรหัสนิสิต 10 หลัก",
      educationQuestion: "ระดับการศึกษา",
      bachelor: "ปริญญาตรี",
      master: "ปริญญาโท",
      doctorate: "ปริญญาเอก",
      visitedQuestion: "เคยมา Chula Library Open ไหม",
      visitedYes: "เคย",
      visitedNo: "ไม่เคย",
      submit: "ยืนยันการลงทะเบียน",
      checking: "กำลังตรวจสอบ...",
      openStamp: "ใช้รหัสนี้ใน Stamp Card",
      verifyIdentity: "ยืนยันตัวตนเพื่อขอรหัสเดิม",
      backToStamp: "มีรหัสแล้ว? เข้าสู่ Stamp Card",
      registered: "ลงทะเบียนสำเร็จ รหัส Stamp Card ของคุณคือ",
      alreadyRegistered: "รหัสนิสิตนี้ลงทะเบียนแล้ว เพื่อความปลอดภัยระบบจะไม่แสดงรหัสเดิม กรุณายืนยันตัวตนกับเจ้าหน้าที่",
      errors: {
        INVALID_STUDENT_ID: "กรุณากรอกรหัสนิสิต 10 หลัก",
        INVALID_EDUCATION_LEVEL: "กรุณาเลือกระดับการศึกษา",
        INVALID_VISIT_HISTORY: "กรุณาเลือกว่าเคยเข้าร่วมงานหรือไม่",
        NO_AVAILABLE_CODES: "รหัสสำหรับลงทะเบียนหมดแล้ว กรุณาติดต่อเจ้าหน้าที่",
        REQUEST_TIMEOUT: "ระบบใช้เวลาตอบสนองนานเกินไป กรุณาลองใหม่",
        NETWORK_ERROR: "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่",
        default: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
    },
    en: {
      documentTitle: "Registration | Chula Library Open House 2026",
      title: "Get your Stamp Card code",
      intro: "Register once to receive a 6-digit code for your Stamp Card.",
      studentId: "Student ID",
      studentPlaceholder: "Enter your 10-digit student ID",
      educationQuestion: "Education level",
      bachelor: "Bachelor's",
      master: "Master's",
      doctorate: "Doctorate",
      visitedQuestion: "Have you attended Chula Library Open before?",
      visitedYes: "Yes",
      visitedNo: "No",
      submit: "Confirm registration",
      checking: "Checking...",
      openStamp: "Use this code in Stamp Card",
      verifyIdentity: "Verify identity to recover the code",
      backToStamp: "Already have a code? Open Stamp Card",
      registered: "Registration complete. Your Stamp Card code is",
      alreadyRegistered: "This student ID is already registered. For your security, the existing code is not displayed. Please verify your identity with a staff member.",
      errors: {
        INVALID_STUDENT_ID: "Please enter your 10-digit student ID.",
        INVALID_EDUCATION_LEVEL: "Please select your education level.",
        INVALID_VISIT_HISTORY: "Please choose Yes or No.",
        NO_AVAILABLE_CODES: "No registration codes remain. Please contact a staff member.",
        REQUEST_TIMEOUT: "The request took too long. Please try again.",
        NETWORK_ERROR: "Unable to connect. Please try again.",
        default: "Something went wrong. Please try again.",
      },
    },
  };

  const query = new URLSearchParams(window.location.search);
  let currentLanguage = query.get("lang") === "en" ? "en" : "th";
  let currentErrorCode = "";
  let currentResult = null;
  const API = window.OpenHouseApi;
  const TRANSFER_KEY = "openHousePendingAccessCode";

  if (query.get("mode") === "recover") {
    window.location.replace(`forgot-code.html?lang=${currentLanguage}`);
    return;
  }

  const elements = Object.fromEntries([
    "pageTitle", "pageIntro", "studentIdLabel", "studentId",
    "educationLegend", "educationBachelorLabel", "educationMasterLabel",
    "educationDoctorateLabel", "visitedLegend", "visitedYesLabel",
    "visitedNoLabel", "registerSubmit", "resultPanel", "resultMessage",
    "accessCode", "openStampLink", "verifyIdentityLink", "formStatus",
    "backToStampLink", "langTh", "langEn",
  ].map((id) => [id, document.getElementById(id)]));

  function activeCopy() { return COPY[currentLanguage]; }

  function renderResult() {
    if (!currentResult) return;
    const copy = activeCopy();
    elements.resultMessage.textContent = currentResult.created
      ? copy.registered
      : copy.alreadyRegistered;
    elements.accessCode.textContent = currentResult.created
      ? currentResult.accessCode
      : "";
    elements.accessCode.classList.toggle("hidden", !currentResult.created);
    elements.openStampLink.classList.toggle("hidden", !currentResult.created);
    elements.verifyIdentityLink.classList.toggle("hidden", currentResult.created);
  }

  function renderLanguage() {
    const copy = activeCopy();
    document.documentElement.lang = currentLanguage;
    document.title = copy.documentTitle;
    elements.pageTitle.textContent = copy.title;
    elements.pageIntro.textContent = copy.intro;
    elements.studentIdLabel.textContent = copy.studentId;
    elements.studentId.placeholder = copy.studentPlaceholder;
    elements.educationLegend.textContent = copy.educationQuestion;
    elements.educationBachelorLabel.textContent = copy.bachelor;
    elements.educationMasterLabel.textContent = copy.master;
    elements.educationDoctorateLabel.textContent = copy.doctorate;
    elements.visitedLegend.textContent = copy.visitedQuestion;
    elements.visitedYesLabel.textContent = copy.visitedYes;
    elements.visitedNoLabel.textContent = copy.visitedNo;
    elements.registerSubmit.textContent = copy.submit;
    elements.openStampLink.textContent = copy.openStamp;
    elements.verifyIdentityLink.textContent = copy.verifyIdentity;
    elements.verifyIdentityLink.href = `forgot-code.html?lang=${currentLanguage}`;
    elements.backToStampLink.textContent = copy.backToStamp;
    elements.langTh.classList.toggle("active", currentLanguage === "th");
    elements.langEn.classList.toggle("active", currentLanguage === "en");
    elements.langTh.setAttribute("aria-pressed", String(currentLanguage === "th"));
    elements.langEn.setAttribute("aria-pressed", String(currentLanguage === "en"));
    if (currentErrorCode) {
      elements.formStatus.textContent = copy.errors[currentErrorCode] ?? copy.errors.default;
    }
    renderResult();
  }

  function setLanguage(language) {
    currentLanguage = language;
    query.set("lang", language);
    window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
    renderLanguage();
  }

  function normalizeStudentId() {
    elements.studentId.value = elements.studentId.value.replace(/\D/g, "").slice(0, 10);
    return elements.studentId.value;
  }

  function showError(error) {
    currentErrorCode = error.code || "default";
    elements.formStatus.textContent = activeCopy().errors[currentErrorCode] ?? activeCopy().errors.default;
  }

  elements.langTh.addEventListener("click", () => setLanguage("th"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));
  elements.studentId.addEventListener("input", normalizeStudentId);
  elements.openStampLink.addEventListener("click", () => {
    if (currentResult?.created) {
      window.sessionStorage.setItem(TRANSFER_KEY, currentResult.accessCode);
    }
  });

  document.getElementById("registerForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    elements.registerSubmit.disabled = true;
    elements.registerSubmit.textContent = activeCopy().checking;
    elements.resultPanel.classList.add("hidden");
    elements.formStatus.textContent = "";
    currentErrorCode = "";
    currentResult = null;
    try {
      const result = await API.registration.register(
        normalizeStudentId(),
        form.elements.visitedOpenHouse.value,
        form.elements.educationLevel.value,
      );
      currentResult = result;
      elements.resultPanel.classList.remove("hidden");
      renderResult();
    } catch (error) {
      showError(error);
    } finally {
      elements.registerSubmit.disabled = false;
      renderLanguage();
    }
  });

  renderLanguage();
})();
