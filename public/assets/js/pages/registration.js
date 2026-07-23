(() => {
  "use strict";

  const COPY = {
    th: {
      documentTitle: "ลงทะเบียน | Chula Library Open House 2026",
      registerTitle: "รับรหัสสะสมแสตมป์",
      registerIntro:
        "ลงทะเบียนหนึ่งครั้งเพื่อรับรหัส 6 หลักสำหรับเข้าใช้งาน Stamp Card",
      recoverTitle: "ลืมรหัส Stamp Card",
      recoverIntro: "กรอกรหัสนิสิตเพื่อค้นหารหัส Stamp Card ที่ลงทะเบียนไว้",
      tabsLabel: "เมนูลงทะเบียน",
      registerTab: "ลงทะเบียน",
      recoverTab: "ลืมรหัส",
      studentId: "รหัสนิสิต",
      studentPlaceholder: "กรอกรหัสนิสิต 10 หลัก",
      visitedQuestion: "เคยมา Chula Library Open มั้ย",
      visitedYes: "เคย",
      visitedNo: "ไม่เคย",
      registerSubmit: "ยืนยันการลงทะเบียน",
      recoverSubmit: "ค้นหารหัสของฉัน",
      checking: "กำลังตรวจสอบ...",
      openStamp: "ไปหน้า Stamp Card",
      backToStamp: "มีรหัสแล้ว? เข้าสู่ Stamp Card",
      registered: "ลงทะเบียนสำเร็จ รหัส Stamp Card ของคุณคือ",
      alreadyRegistered: "รหัสนิสิตนี้ลงทะเบียนแล้ว รหัส Stamp Card คือ",
      recovered: "รหัส Stamp Card ที่ลงทะเบียนไว้คือ",
      errors: {
        INVALID_STUDENT_ID: "กรุณากรอกรหัสนิสิต 10 หลัก",
        INVALID_VISIT_HISTORY: "กรุณาเลือกว่าเคยเข้าร่วมงานหรือไม่",
        REGISTRATION_NOT_FOUND: "ไม่พบการลงทะเบียนของรหัสนิสิตนี้",
        NO_AVAILABLE_CODES: "รหัสสำหรับลงทะเบียนหมดแล้ว กรุณาติดต่อเจ้าหน้าที่",
        REQUEST_TIMEOUT: "ระบบใช้เวลาตอบสนองนานเกินไป กรุณาลองใหม่",
        NETWORK_ERROR: "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่",
        default: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
      },
    },
    en: {
      documentTitle: "Registration | Chula Library Open House 2026",
      registerTitle: "Get your Stamp Card code",
      registerIntro:
        "Register once to receive a 6-digit code for your Stamp Card.",
      recoverTitle: "Forgot your Stamp Card code?",
      recoverIntro:
        "Enter your student ID to retrieve your registered Stamp Card code.",
      tabsLabel: "Registration menu",
      registerTab: "Register",
      recoverTab: "Forgot code",
      studentId: "Student ID",
      studentPlaceholder: "Enter your 10-digit student ID",
      visitedQuestion: "Have you attended Chula Library Open before?",
      visitedYes: "Yes",
      visitedNo: "No",
      registerSubmit: "Confirm registration",
      recoverSubmit: "Find my code",
      checking: "Checking...",
      openStamp: "Open Stamp Card",
      backToStamp: "Already have a code? Open Stamp Card",
      registered: "Registration complete. Your Stamp Card code is",
      alreadyRegistered:
        "This student ID is already registered. Your Stamp Card code is",
      recovered: "Your registered Stamp Card code is",
      errors: {
        INVALID_STUDENT_ID: "Please enter your 10-digit student ID.",
        INVALID_VISIT_HISTORY: "Please choose Yes or No.",
        REGISTRATION_NOT_FOUND:
          "No registration was found for this student ID.",
        NO_AVAILABLE_CODES:
          "No registration codes remain. Please contact a staff member.",
        REQUEST_TIMEOUT: "The request took too long. Please try again.",
        NETWORK_ERROR: "Unable to connect. Please try again.",
        default: "Something went wrong. Please try again.",
      },
    },
  };

  const API = window.OpenHouseApi;
  const query = new URLSearchParams(window.location.search);
  const recoverOnly = query.get("mode") === "recover";
  let currentLanguage = query.get("lang") === "en" ? "en" : "th";
  let currentErrorCode = "";
  let currentResult = null;

  const elements = {
    registrationTabs: document.getElementById("registrationTabs"),
    registerTab: document.getElementById("registerTab"),
    recoverTab: document.getElementById("recoverTab"),
    registerPanel: document.getElementById("registerPanel"),
    recoverPanel: document.getElementById("recoverPanel"),
    resultPanel: document.getElementById("resultPanel"),
    resultMessage: document.getElementById("resultMessage"),
    accessCode: document.getElementById("accessCode"),
    status: document.getElementById("formStatus"),
    pageTitle: document.getElementById("pageTitle"),
    pageIntro: document.getElementById("pageIntro"),
    studentIdLabel: document.getElementById("studentIdLabel"),
    recoverStudentIdLabel: document.getElementById("recoverStudentIdLabel"),
    studentId: document.getElementById("studentId"),
    recoverStudentId: document.getElementById("recoverStudentId"),
    visitedLegend: document.getElementById("visitedLegend"),
    visitedYesLabel: document.getElementById("visitedYesLabel"),
    visitedNoLabel: document.getElementById("visitedNoLabel"),
    registerSubmit: document.getElementById("registerSubmit"),
    recoverSubmit: document.getElementById("recoverSubmit"),
    openStampLink: document.getElementById("openStampLink"),
    backToStampLink: document.getElementById("backToStampLink"),
    langTh: document.getElementById("langTh"),
    langEn: document.getElementById("langEn"),
  };

  function activeCopy() {
    return COPY[currentLanguage];
  }

  function resultCopyKey(result) {
    if (result.type === "recover") return "recovered";
    return result.created ? "registered" : "alreadyRegistered";
  }

  function renderResult() {
    if (!currentResult) return;
    elements.resultMessage.textContent =
      activeCopy()[resultCopyKey(currentResult)];
    elements.accessCode.textContent = currentResult.accessCode;
  }

  function renderLanguage() {
    const copy = activeCopy();
    document.documentElement.lang = currentLanguage;
    document.title = copy.documentTitle;
    elements.pageTitle.textContent = recoverOnly
      ? copy.recoverTitle
      : copy.registerTitle;
    elements.pageIntro.textContent = recoverOnly
      ? copy.recoverIntro
      : copy.registerIntro;
    elements.registrationTabs.setAttribute("aria-label", copy.tabsLabel);
    elements.registerTab.textContent = copy.registerTab;
    elements.recoverTab.textContent = copy.recoverTab;
    elements.studentIdLabel.textContent = copy.studentId;
    elements.recoverStudentIdLabel.textContent = copy.studentId;
    elements.studentId.placeholder = copy.studentPlaceholder;
    elements.recoverStudentId.placeholder = copy.studentPlaceholder;
    elements.visitedLegend.textContent = copy.visitedQuestion;
    elements.visitedYesLabel.textContent = copy.visitedYes;
    elements.visitedNoLabel.textContent = copy.visitedNo;
    elements.registerSubmit.textContent = copy.registerSubmit;
    elements.recoverSubmit.textContent = copy.recoverSubmit;
    elements.openStampLink.textContent = copy.openStamp;
    elements.backToStampLink.textContent = copy.backToStamp;
    elements.langTh.classList.toggle("active", currentLanguage === "th");
    elements.langEn.classList.toggle("active", currentLanguage === "en");
    elements.langTh.setAttribute(
      "aria-pressed",
      String(currentLanguage === "th"),
    );
    elements.langEn.setAttribute(
      "aria-pressed",
      String(currentLanguage === "en"),
    );
    if (currentErrorCode) {
      elements.status.textContent =
        copy.errors[currentErrorCode] ?? copy.errors.default;
    }
    renderResult();
  }

  function setLanguage(language) {
    currentLanguage = language;
    query.set("lang", language);
    const nextUrl = `${window.location.pathname}?${query.toString()}`;
    window.history.replaceState(null, "", nextUrl);
    renderLanguage();
  }

  function switchTab(mode) {
    const isRegister = mode === "register";
    elements.registerTab.classList.toggle("active", isRegister);
    elements.recoverTab.classList.toggle("active", !isRegister);
    elements.registerTab.setAttribute("aria-selected", String(isRegister));
    elements.recoverTab.setAttribute("aria-selected", String(!isRegister));
    elements.registerPanel.classList.toggle("hidden", !isRegister);
    elements.recoverPanel.classList.toggle("hidden", isRegister);
    elements.resultPanel.classList.add("hidden");
    elements.status.textContent = "";
    currentErrorCode = "";
    currentResult = null;
  }

  function normalizeStudentId(input) {
    return input.value.replace(/\D/g, "").slice(0, 10);
  }

  function showError(error) {
    currentErrorCode = error.code || "default";
    const copy = activeCopy();
    elements.status.textContent =
      copy.errors[currentErrorCode] ?? copy.errors.default;
  }

  function showResult(result) {
    currentResult = result;
    currentErrorCode = "";
    renderResult();
    elements.resultPanel.classList.remove("hidden");
    elements.status.textContent = "";
  }

  async function submitWith(button, action) {
    button.disabled = true;
    button.textContent = activeCopy().checking;
    elements.status.textContent = "";
    elements.resultPanel.classList.add("hidden");
    currentErrorCode = "";
    currentResult = null;
    try {
      await action();
    } catch (error) {
      showError(error);
    } finally {
      button.disabled = false;
      renderLanguage();
    }
  }

  elements.langTh.addEventListener("click", () => setLanguage("th"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));
  elements.registerTab.addEventListener("click", () => switchTab("register"));
  elements.recoverTab.addEventListener("click", () => switchTab("recover"));

  document.querySelectorAll('input[name="studentId"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = normalizeStudentId(input);
    });
  });

  document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    submitWith(elements.registerSubmit, async () => {
      const result = await API.registration.register(
        normalizeStudentId(form.elements.studentId),
        form.elements.visitedOpenHouse.value,
      );
      showResult({
        type: "register",
        accessCode: result.accessCode,
        created: result.created,
      });
    });
  });

  document.getElementById("recoverForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    submitWith(elements.recoverSubmit, async () => {
      const result = await API.registration.recover(
        normalizeStudentId(form.elements.studentId),
      );
      showResult({
        type: "recover",
        accessCode: result.accessCode,
      });
    });
  });

  if (recoverOnly) {
    elements.registrationTabs.classList.add("hidden");
    switchTab("recover");
  } else {
    switchTab("register");
  }
  renderLanguage();
})();
