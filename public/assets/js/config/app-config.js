(() => {
  "use strict";

  const stationImageRoot = "assets/images/stations";
  const cardImageRoot = "assets/images/cards";

  const stations = [
    {
      id: 0,
      name: "Library journey",
      qrCode: "QR_STN_01",
      images: {
        unstamped: `${stationImageRoot}/library-playground-uncollected.webp`,
        stamped: `${stationImageRoot}/library-playground-collected.webp`,
      },
      content: {
        en: "Follow the Library journey and discover how each part of the library supports learning, creating, and exploring.",
        th: "ออกเดินทางไปกับ Library journey เพื่อค้นพบว่าพื้นที่ต่าง ๆ ของห้องสมุดช่วยสนับสนุนการเรียนรู้ การสร้างสรรค์ และการค้นคว้าอย่างไร",
      },
    },
    {
      id: 1,
      name: "Query Quarry",
      qrCode: "QR_STN_02",
      images: {
        unstamped: `${stationImageRoot}/discovery-lab-uncollected.webp`,
        stamped: `${stationImageRoot}/discovery-lab-collected.webp`,
      },
      content: {
        en: "Dig through Query Quarry, turn questions into search strategies, and uncover reliable information.",
        th: "ขุดค้นคำตอบใน Query Quarry ฝึกเปลี่ยนคำถามให้เป็นกลยุทธ์การค้นหา และค้นพบข้อมูลที่น่าเชื่อถือ",
      },
    },
    {
      id: 2,
      name: "Play Zone",
      qrCode: "QR_STN_03",
      images: {
        unstamped: `${stationImageRoot}/play-zone-uncollected.webp`,
        stamped: `${stationImageRoot}/play-zone-collected.webp`,
      },
      content: {
        en: "Time to relax! This zone lets you unwind from heavy reading with games and interesting activities.",
        th: "ถึงเวลาคลายเครียด! โซนนี้เปิดโอกาสให้คุณผ่อนคลายจากการอ่านหนังสือหนักๆ ด้วยเกมและกิจกรรมที่น่าสนใจมากมาย",
      },
    },
    {
      id: 3,
      name: "Perfect Match: TAIC Collections",
      qrCode: "QR_STN_04",
      images: {
        unstamped: `${stationImageRoot}/perfect-match-uncollected.webp`,
        stamped: `${stationImageRoot}/perfect-match-collected.webp`,
      },
      content: {
        en: "A treasure trove of knowledge! This corner gathers rare books and media you might not know we have.",
        th: "ขุมทรัพย์ความรู้! มุมนี้รวบรวมหนังสือและสื่อหายากที่คุณอาจไม่เคยรู้มาก่อนว่ามีอยู่ในห้องสมุดของเรา",
      },
    },
    {
      id: 4,
      name: "Camera Go!",
      qrCode: "QR_STN_05",
      images: {
        unstamped: `${stationImageRoot}/camera-go-uncollected.webp`,
        stamped: `${stationImageRoot}/camera-go-collected.webp`,
      },
      content: {
        en: "Spark your creativity with our full-service media studio. Record audio, shoot video, or edit—all here!",
        th: "จุดประกายความเป็นนักสร้างสรรค์กับสตูดิโอสื่อครบวงจร ไม่ว่าจะอัดเสียง ถ่ายวิดีโอ หรือตัดต่อ ก็ทำได้ที่นี่!",
      },
    },
    {
      id: 5,
      name: "Joy Tech Station",
      qrCode: "QR_STN_06",
      images: {
        unstamped: `${stationImageRoot}/joy-tech-uncollected.webp`,
        stamped: `${stationImageRoot}/joy-tech-collected.webp`,
      },
      content: {
        en: "Update on new tech trends. Drop by to try out the cutting-edge gadgets we've prepared for you.",
        th: "อัปเดตเทรนด์เทคโนโลยีใหม่ๆ แวะมาทดลองใช้งานอุปกรณ์สุดล้ำที่เราจัดเตรียมไว้ให้คุณสัมผัสด้วยตัวเอง",
      },
    },
    {
      id: 6,
      name: "Green Mission",
      qrCode: "QR_STN_07",
      images: {
        unstamped: `${stationImageRoot}/green-mission-uncollected.webp`,
        stamped: `${stationImageRoot}/green-mission-collected.webp`,
      },
      content: {
        en: "Safety is key. Learn how to maintain public spaces and follow rules for orderliness.",
        th: "ความปลอดภัยคือสิ่งสำคัญ เรียนรู้วิธีการดูแลรักษาพื้นที่ส่วนรวมและการปฏิบัติตามกฎเพื่อความเรียบร้อย",
      },
    },
  ];

  const cardImageFiles = [
    "Card_01.webp",
    "Card_02.png",
    "Card_03.webp",
    "Card_04.webp",
    "Card_05.webp",
    "Card_06.webp",
    "Card_07.webp",
    "Card_08.webp",
    "Card_09.webp",
    "Card_10.webp",
    "Card_11.webp",
    "Card_12.webp",
    "Card_13.webp",
    "Card_14.webp",
    "Card_15.webp",
    "Card_16.webp",
  ];

  const destinyCards = cardImageFiles.map((imageFile, index) => ({
    id: index + 1,
    imagePath: `${cardImageRoot}/${imageFile}`,
  }));

  function deepFreeze(value) {
    if (!value || typeof value !== "object" || Object.isFrozen(value)) {
      return value;
    }

    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }

  window.OpenHouseConfig = deepFreeze({
    participants: {
      codeLength: 6,
      generationCount: 500,
    },
    qr: {
      refreshSeconds: 90,
      maxAgeMs: 90_000,
      allowedFutureClockSkewMs: 5_000,
    },
    stations,
    destinyCards,
  });
})();
