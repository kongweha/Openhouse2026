(() => {
  "use strict";

  const API = window.OpenHouseApi;
  const registerTab = document.getElementById("registerTab");
  const recoverTab = document.getElementById("recoverTab");
  const registerPanel = document.getElementById("registerPanel");
  const recoverPanel = document.getElementById("recoverPanel");
  const resultPanel = document.getElementById("resultPanel");
  const resultMessage = document.getElementById("resultMessage");
  const accessCode = document.getElementById("accessCode");
  const status = document.getElementById("formStatus");

  function switchTab(mode) {
    const isRegister = mode === "register";
    registerTab.classList.toggle("active", isRegister);
    recoverTab.classList.toggle("active", !isRegister);
    registerTab.setAttribute("aria-selected", String(isRegister));
    recoverTab.setAttribute("aria-selected", String(!isRegister));
    registerPanel.classList.toggle("hidden", !isRegister);
    recoverPanel.classList.toggle("hidden", isRegister);
    resultPanel.classList.add("hidden");
    status.textContent = "";
  }

  function normalizeStudentId(input) {
    return input.value.replace(/\D/g, "").slice(0, 10);
  }

  function showError(error) {
    const messages = {
      INVALID_STUDENT_ID: "กรุณากรอกรหัสนิสิต 10 หลัก",
      INVALID_VISIT_HISTORY: "กรุณาเลือกว่าเคยเข้าร่วมงานหรือไม่",
      REGISTRATION_NOT_FOUND: "ไม่พบการลงทะเบียนของรหัสนิสิตนี้",
      NO_AVAILABLE_CODES: "รหัสสำหรับลงทะเบียนหมดแล้ว กรุณาติดต่อเจ้าหน้าที่",
      REQUEST_TIMEOUT: "ระบบใช้เวลาตอบสนองนานเกินไป กรุณาลองใหม่",
      NETWORK_ERROR: "ไม่สามารถเชื่อมต่อระบบได้ กรุณาลองใหม่",
    };
    status.textContent =
      messages[error.code] ?? "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง";
  }

  function showResult(code, message) {
    resultMessage.textContent = message;
    accessCode.textContent = code;
    resultPanel.classList.remove("hidden");
    status.textContent = "";
  }

  async function submitWith(button, action) {
    button.disabled = true;
    const original = button.textContent;
    button.textContent = "กำลังตรวจสอบ...";
    status.textContent = "";
    resultPanel.classList.add("hidden");
    try {
      await action();
    } catch (error) {
      showError(error);
    } finally {
      button.disabled = false;
      button.textContent = original;
    }
  }

  registerTab.addEventListener("click", () => switchTab("register"));
  recoverTab.addEventListener("click", () => switchTab("recover"));

  document.querySelectorAll('input[name="studentId"]').forEach((input) => {
    input.addEventListener("input", () => {
      input.value = normalizeStudentId(input);
    });
  });

  document.getElementById("registerForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    submitWith(form.querySelector("button"), async () => {
      const studentId = normalizeStudentId(form.elements.studentId);
      const hasVisitedOpenHouse =
        form.elements.visitedOpenHouse.value === "yes";
      const result = await API.registration.register(
        studentId,
        hasVisitedOpenHouse,
      );
      showResult(
        result.accessCode,
        result.created
          ? "ลงทะเบียนสำเร็จ รหัส Stamp Card ของคุณคือ"
          : "รหัสนิสิตนี้ลงทะเบียนแล้ว รหัส Stamp Card คือ",
      );
    });
  });

  document.getElementById("recoverForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    submitWith(form.querySelector("button"), async () => {
      const studentId = normalizeStudentId(form.elements.studentId);
      const result = await API.registration.recover(studentId);
      showResult(result.accessCode, "รหัส Stamp Card ที่ลงทะเบียนไว้คือ");
    });
  });
})();
