const APP_CONFIG = window.OpenHouseConfig;
const stationSelect = document.getElementById("stationSelect");

let countdownId = null;
let timeLeft = 0;

APP_CONFIG.stations.forEach((station, index) => {
  const option = document.createElement("option");
  option.value = station.qrCode;
  option.textContent = `ฐาน ${index + 1}: ${station.name}`;
  stationSelect.appendChild(option);
});

function generateQrCode() {
  const stationQrCode = stationSelect.value;
  const currentTimestamp = Date.now();
  const payload = `${stationQrCode}|${currentTimestamp}`;

  document.getElementById("qr-text").textContent =
    `Data: ${stationQrCode} (อัปเดตล่าสุด)`;

  const qrContainer = document.getElementById("qrcode");
  qrContainer.replaceChildren();

  new QRCode(qrContainer, {
    text: payload,
    width: 220,
    height: 220,
    colorDark: "#0f172a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}

function updateTimer() {
  if (timeLeft <= 0) {
    generateQrCode();
    timeLeft = APP_CONFIG.qr.refreshSeconds;
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  document.getElementById("timerDisplay").textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  timeLeft -= 1;
}

function startDynamicQR() {
  document.getElementById("btnStart").style.display = "none";
  document.getElementById("btnStop").style.display = "block";
  stationSelect.disabled = true;

  timeLeft = 0;
  updateTimer();
  countdownId = window.setInterval(updateTimer, 1_000);
}

function stopDynamicQR() {
  document.getElementById("btnStart").style.display = "block";
  document.getElementById("btnStop").style.display = "none";
  stationSelect.disabled = false;

  window.clearInterval(countdownId);
  countdownId = null;
  document.getElementById("timerDisplay").textContent = "--:--";
  document.getElementById("qrcode").replaceChildren();
  document.getElementById("qr-text").textContent =
    "กรุณากดเริ่มเพื่อสร้าง QR Code";
}

function stationChanged() {
  stopDynamicQR();
}
