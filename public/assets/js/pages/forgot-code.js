(() => {
  "use strict";
  const COPY = {
    th: {
      title: "ลืมรหัส Stamp Card",
      intro: "เพื่อป้องกันผู้อื่นนำรหัสไปใช้ ระบบจะไม่ค้นหารหัสด้วยรหัสนิสิตเพียงอย่างเดียว",
      verifyTitle: "วิธียืนยันตัวตน",
      steps: [
        "นำบัตรนิสิตหรือหลักฐานใน CU NEX ไปพบเจ้าหน้าที่จุดลงทะเบียน",
        "เจ้าหน้าที่ตรวจชื่อและรหัสนิสิตให้ตรงกับข้อมูลลงทะเบียน",
        "เจ้าหน้าที่จะแจ้งรหัสเดิมให้เจ้าของบัญชีเท่านั้น",
      ],
      back: "กลับไปหน้า Stamp Card",
      register: "ยังไม่เคยลงทะเบียน? ลงทะเบียน",
    },
    en: {
      title: "Forgot your Stamp Card code?",
      intro: "To protect your code from misuse, a student ID alone cannot be used to recover it.",
      verifyTitle: "How to verify your identity",
      steps: [
        "Bring your student card or CU NEX identity screen to the registration staff.",
        "A staff member will match your name and student ID with the registration record.",
        "The existing code will be disclosed only to the verified owner.",
      ],
      back: "Back to Stamp Card",
      register: "Not registered yet? Register",
    },
  };
  const query = new URLSearchParams(window.location.search);
  let language = query.get("lang") === "en" ? "en" : "th";
  const ids = ["pageTitle", "pageIntro", "verifyTitle", "verifyStepOne", "verifyStepTwo", "verifyStepThree", "backToStampLink", "registerLink", "langTh", "langEn"];
  const elements = Object.fromEntries(ids.map((id) => [id, document.getElementById(id)]));

  function render() {
    const copy = COPY[language];
    document.documentElement.lang = language;
    document.title = `${copy.title} | Chula Library Open House 2026`;
    elements.pageTitle.textContent = copy.title;
    elements.pageIntro.textContent = copy.intro;
    elements.verifyTitle.textContent = copy.verifyTitle;
    elements.verifyStepOne.textContent = copy.steps[0];
    elements.verifyStepTwo.textContent = copy.steps[1];
    elements.verifyStepThree.textContent = copy.steps[2];
    elements.backToStampLink.textContent = copy.back;
    elements.registerLink.textContent = copy.register;
    elements.langTh.classList.toggle("active", language === "th");
    elements.langEn.classList.toggle("active", language === "en");
    elements.langTh.setAttribute("aria-pressed", String(language === "th"));
    elements.langEn.setAttribute("aria-pressed", String(language === "en"));
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage;
    query.set("lang", language);
    window.history.replaceState(null, "", `${window.location.pathname}?${query.toString()}`);
    render();
  }
  elements.langTh.addEventListener("click", () => setLanguage("th"));
  elements.langEn.addEventListener("click", () => setLanguage("en"));
  render();
})();
