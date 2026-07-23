(() => {
  "use strict";

  const stationImageRoot =
    "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture";
  const cardImageRoot = "assets/images/cards";

  const stations = [
    {
      id: 0,
      name: "Library Playground",
      qrCode: "QR_STN_01",
      images: {
        unstamped: `${stationImageRoot}/LIBRARY%20PLAYGROUND1.webp`,
        stamped: `${stationImageRoot}/LIBRARY%20PLAYGROUND2.webp`,
      },
      content: {
        en: "Welcome to the activity and relaxation space! Designed for you to enjoy learning in new ways.",
        th: "ยินดีต้อนรับสู่พื้นที่สำหรับทำกิจกรรมและพักผ่อน! พื้นที่นี้ออกแบบมาเพื่อให้คุณได้สนุกกับการเรียนรู้ในรูปแบบใหม่",
      },
    },
    {
      id: 1,
      name: "Discovery Lab",
      qrCode: "QR_STN_02",
      images: {
        unstamped: `${stationImageRoot}/Discovery%20LAB1.webp`,
        stamped: `${stationImageRoot}/Discovery%20LAB2.webp`,
      },
      content: {
        en: "Discover new ideas at Discovery Lab. We have tools and resources to help you infinitely expand your creativity.",
        th: "ค้นพบไอเดียใหม่ๆ ที่ Discovery Lab เรามีเครื่องมือและทรัพยากรที่พร้อมช่วยให้คุณต่อยอดความคิดสร้างสรรค์ได้ไม่รู้จบ",
      },
    },
    {
      id: 2,
      name: "Play Zone",
      qrCode: "QR_STN_03",
      images: {
        unstamped: `${stationImageRoot}/Play%20ZONE1.webp`,
        stamped: `${stationImageRoot}/Play%20ZONE2.webp`,
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
        unstamped: `${stationImageRoot}/Treasure%20corner1.webp`,
        stamped: `${stationImageRoot}/Treasure%20corner2.webp`,
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
        unstamped: `${stationImageRoot}/Media%20studio1.webp`,
        stamped: `${stationImageRoot}/Media%20studio2.webp`,
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
        unstamped: `${stationImageRoot}/8.webp`,
        stamped: `${stationImageRoot}/1145405557.webp`,
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
        unstamped: `${stationImageRoot}/Safety%20Checkpoint1.webp`,
        stamped: `${stationImageRoot}/Safety%20Checkpoint2.webp`,
      },
      content: {
        en: "Safety is key. Learn how to maintain public spaces and follow rules for orderliness.",
        th: "ความปลอดภัยคือสิ่งสำคัญ เรียนรู้วิธีการดูแลรักษาพื้นที่ส่วนรวมและการปฏิบัติตามกฎเพื่อความเรียบร้อย",
      },
    },
  ];

  const destinyCards = Array.from({ length: 16 }, (_, index) => {
    const id = index + 1;
    const imageNumber = id <= 7 ? id : 1;
    return {
      id,
      imagePath: `${cardImageRoot}/Card_${imageNumber}.webp`,
    };
  });

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
