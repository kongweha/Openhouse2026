// Localized interface copy
let currentLang = 'en';
const LANG = {
    en: {
        loginTitle: "🔐 Login to System",
        loginBtn: "Login",
        checking: "Checking...",
        cardTitle: "🎉 Stamp Card",
        userIdPrefix: "User ID: ",
        stampStatusText: "Completed: {count} / {total}",
        completedText: "🎉 All {total} stations completed!",
        stampSubStatus: "(Click on unstamped circles to scan QR Code)",
        redeemBtn: "🎁 Redeem Reward (Needs {total} stamps)",
        redeemReadyBtn: "🎁 Redeem Reward",
        cancelScanBtn: "❌ Cancel Camera",
        logoutBtn: "Logout",
        ratingHeader: "⭐ How was this station?",
        ratingSubmitBtn: "Submit Rating",
        saving: "Saving...",
        finalHeader: "📝 Final Assessment",
        finalDesc: "Based on today's activities, how likely are you to use the physical library space (e.g., Chula AIX) this semester?",
        finalSubmit: "Confirm & Claim",
        successTitle: "🎁 Reward claimed successfully!",
        successSub: "(Cannot be played again)",
        mapPlaceholder: "[ Map for reward pickup goes here ]",
        btnViewStamps: "View My Stamp Card",
        btnBackToReward: "⬅ Back to Reward Page",
        btnDrawCard: "🔮 Wheel of Fate",
        txtDrawTitle: "🔮 Wheel of Fate",
        btnStartDraw: "Draw a Card",
        emoji: ["Confused", "Complex", "Okay", "Clear", "Super Clear"],
        ratingResultTitle: "⭐ Your Rating",
        ratingLabels: { 1: "😵‍💫 Confused", 2: "🤔 Complex", 3: "😐 Okay", 4: "🙂 Clear", 5: "🤩 Super Clear" },
        alerts: {
            errLength: "Please enter all {length} digits.",
            errNotFound: "❌ Code not found in the system.",
            errConn: "Database connection error.",
            errQrExpire: "❌ QR Code expired. Please scan the latest QR.",
            errQrFormat: "❌ Invalid QR code format.",
            errQrWrong: "❌ Wrong QR code for this station.",
            errSave: "Error saving data. Please try again."
        }
    },
    th: {
        loginTitle: "🔐 เข้าสู่ระบบสะสมแต้ม",
        loginBtn: "ตกลงเพื่อเข้าสู่ระบบ",
        checking: "กำลังตรวจสอบ...",
        cardTitle: "🎉 บัตรสะสมแต้ม",
        userIdPrefix: "รหัสสมาชิก: ",
        stampStatusText: "ผ่านแล้ว: {count} / {total} ฐาน",
        completedText: "🎉 เล่นครบ {total} ฐานแล้ว!",
        stampSubStatus: "(คลิกที่วงกลมฐานที่ยังไม่ผ่านเพื่อสแกน QR Code)",
        redeemBtn: "🎁 แลกของรางวัล (ต้องครบ {total} ฐาน)",
        redeemReadyBtn: "🎁 แลกของรางวัล",
        cancelScanBtn: "❌ ยกเลิกสแกนกล้อง",
        logoutBtn: "ออกจากระบบ",
        ratingHeader: "⭐ บอกเราหน่อยว่าฐานนี้เป็นยังไง",
        ratingSubmitBtn: "ยืนยันให้คะแนน",
        saving: "กำลังบันทึก...",
        finalHeader: "📝 แบบประเมินก่อนรับรางวัล",
        finalDesc: "จากกิจกรรมในวันนี้ คุณมีความตั้งใจที่จะเข้าไปใช้บริการพื้นที่จริงของสำนักวิทยทรัพยากร (เช่น พื้นที่ Chula AIX) ภายในภาคการศึกษานี้ มากน้อยเพียงใด?",
        finalSubmit: "ยืนยันและรับรางวัล",
        successTitle: "🎁 รับของรางวัลเรียบร้อยแล้ว!",
        successSub: "(ไม่สามารถเล่นซ้ำได้)",
        mapPlaceholder: "[ พื้นที่สำหรับใส่แผนที่จุดรับของรางวัล ]",
        btnViewStamps: "ดูบัตรสะสมแต้ม",
        btnBackToReward: "⬅ กลับไปหน้าของรางวัล",
        btnDrawCard: "🔮 หมุนล้อชะตา",
        txtDrawTitle: "🔮 หมุนล้อชะตา",
        btnStartDraw: "เริ่มสุ่มการ์ด",
        emoji: ["งงมาก", "แอบซับซ้อน", "พอได้อยู่", "เข้าใจดี", "เคลียร์สุดๆ"],
        ratingResultTitle: "⭐ ผลการประเมินของคุณ",
        ratingLabels: { 1: "😵‍💫 งงมาก", 2: "🤔 แอบซับซ้อน", 3: "😐 พอได้อยู่", 4: "🙂 เข้าใจดี", 5: "🤩 เคลียร์สุดๆ" },
        alerts: {
            errLength: "กรุณากรอกรหัสให้ครบ {length} หลัก",
            errNotFound: "❌ ไม่พบรหัสนี้ในระบบ",
            errConn: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล",
            errQrExpire: "❌ QR Code นี้หมดอายุแล้ว\nกรุณาสแกน QR Code ล่าสุด",
            errQrFormat: "❌ รูปแบบ QR Code ไม่ถูกต้อง",
            errQrWrong: "❌ QR Code ไม่ถูกต้องสำหรับฐานนี้",
            errSave: "เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่"
        }
    }
};

// Shared configuration and services
const APP_CONFIG = window.OpenHouseConfig;
const STATIONS = APP_CONFIG.stations;
const DESTINY_CARDS = APP_CONFIG.destinyCards;
const API = window.OpenHouseApi;

function formatMessage(message, values) {
    return Object.entries(values).reduce(
        (result, [key, value]) => result.replaceAll(`{${key}}`, value),
        message,
    );
}

window.addEventListener('load', () => {
    STATIONS.forEach(st => {
        const img1 = new Image(); img1.src = st.images.unstamped;
        const img2 = new Image(); img2.src = st.images.stamped;
    });
});

// Participant session state
let currentUserCode = "";
let html5QrCode;
let pollTimer = null;
let activeTargetStation = null;
let isScannerInitializing = false;
let cancelRequested = false;
let isProcessingScan = false;
let isLoggingIn = false;
let globalUserData = null;
let pendingRatingStationId = null;
let pendingRatingStationName = null;
let pendingQrPayload = null;
let selectedRating = 0;
let finalSelectedRating = 0;
let currentScreenView = null;

// View and language controls
function switchView(viewName) {
    currentScreenView = viewName;
    const rewardView = document.getElementById('rewardView');
    const stampView = document.getElementById('stampView');
    const cardDrawView = document.getElementById('cardDrawView');

    rewardView.classList.add('hidden');
    stampView.classList.add('hidden');
    cardDrawView.classList.add('hidden');

    let targetView;
    if (viewName === 'reward') targetView = rewardView;
    else if (viewName === 'stamp') targetView = stampView;
    else if (viewName === 'cardDraw') targetView = cardDrawView;

    if(targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.remove('view-animate');
        void targetView.offsetWidth;
        targetView.classList.add('view-animate');
    }
}

function toggleLanguage() {
    currentLang = currentLang === 'en' ? 'th' : 'en';
    applyLanguage();
}

function applyLanguage() {
    const l = LANG[currentLang];

    document.getElementById('btnLangEn').className = currentLang === 'en' ? 'active' : '';
    document.getElementById('btnLangTh').className = currentLang === 'th' ? 'active' : '';
    document.getElementById('btnLangEn2').className = currentLang === 'en' ? 'active' : '';
    document.getElementById('btnLangTh2').className = currentLang === 'th' ? 'active' : '';

    document.getElementById('txtLoginTitle').innerText = l.loginTitle;
    document.getElementById('btnLogin').innerText = l.loginBtn;
    document.getElementById('txtCardTitle').innerText = l.cardTitle;
    document.getElementById('subStatusText').innerText = l.stampSubStatus;
    document.getElementById('btnCancel').innerText = l.cancelScanBtn;
    document.getElementById('btnLogoutStamp').innerText = l.logoutBtn;
    document.getElementById('btnLogoutReward').innerText = l.logoutBtn;

    document.getElementById('txtRatingHeader').innerText = l.ratingHeader;
    document.getElementById('btnSubmitRating').innerText = l.ratingSubmitBtn;
    document.getElementById('emj1').innerText = l.emoji[0];
    document.getElementById('emj2').innerText = l.emoji[1];
    document.getElementById('emj3').innerText = l.emoji[2];
    document.getElementById('emj4').innerText = l.emoji[3];
    document.getElementById('emj5').innerText = l.emoji[4];

    document.getElementById('txtFinalHeader').innerText = l.finalHeader;
    document.getElementById('txtFinalDesc').innerText = l.finalDesc;
    document.getElementById('btnSubmitFinal').innerText = l.finalSubmit;

    document.getElementById('txtSuccessTitle').innerText = l.successTitle;
    document.getElementById('txtSuccessSub').innerText = l.successSub;
    document.getElementById('txtMapPlaceholder').innerText = l.mapPlaceholder;
    document.getElementById('btnViewStamps').innerText = l.btnViewStamps;
    document.getElementById('btnBackToReward').innerText = l.btnBackToReward;
    document.getElementById('btnBackFromDraw').innerText = l.btnBackToReward;

    document.getElementById('btnDrawCard').innerText = l.btnDrawCard;
    document.getElementById('txtDrawTitle').innerText = l.txtDrawTitle;
    document.getElementById('btnStartDraw').innerText = l.btnStartDraw;

    if (currentUserCode) document.getElementById('displayUserCode').innerText = l.userIdPrefix + currentUserCode;

    if (globalUserData) {
        renderUI(globalUserData);
        const activeId = document.getElementById('contentBox').dataset.activeId;
        if(activeId !== undefined && !document.getElementById('contentBox').classList.contains('hidden')) {
            toggleStationContent(activeId, true);
        }
        if (currentScreenView === 'cardDraw' && globalUserData.drawnCardId) {
            showDrawnCard(globalUserData.drawnCardId);
        }
    }
}

// Login code input
const otpGroup = document.getElementById('otpGroup');
for (let index = 0; index < APP_CONFIG.participants.codeLength; index++) {
    const input = document.createElement('input');
    input.type = 'tel';
    input.className = 'otp-box';
    input.maxLength = 1;
    input.inputMode = 'numeric';
    input.autocomplete = 'one-time-code';
    input.setAttribute('aria-label', `Digit ${index + 1}`);
    otpGroup.appendChild(input);
}

const otpInputs = document.querySelectorAll('.otp-box');
otpInputs.forEach((input, index) => {
    input.addEventListener('input', function() {
        this.value = this.value.replace(/[^0-9]/g, '');
        if (this.value !== '') {
            if (index < otpInputs.length - 1) otpInputs[index + 1].focus();
            else { this.blur(); login(); }
        }
    });
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' || e.keyCode === 8) {
            if (this.value === '') {
                if (index > 0) { otpInputs[index - 1].focus(); otpInputs[index - 1].value = ''; }
            } else this.value = '';
            e.preventDefault();
        }
    });
    input.addEventListener('paste', function(e) {
        e.preventDefault();
        let pasteData = (e.clipboardData || window.clipboardData)
            .getData('text')
            .replace(/[^0-9]/g, '')
            .substring(0, APP_CONFIG.participants.codeLength);
        for (let i = 0; i < pasteData.length; i++) if (otpInputs[i]) otpInputs[i].value = pasteData[i];
        if (pasteData.length === APP_CONFIG.participants.codeLength) {
            otpInputs[otpInputs.length - 1].blur();
            login();
        }
    });
});

async function login() {
    if (isLoggingIn) return;
    const l = LANG[currentLang];
    let input = Array.from(otpInputs).map(box => box.value).join('');
    if (input.length !== APP_CONFIG.participants.codeLength) {
        alert(formatMessage(l.alerts.errLength, {
            length: APP_CONFIG.participants.codeLength,
        }));
        return;
    }

    isLoggingIn = true;
    let btn = document.getElementById('btnLogin');
    btn.disabled = true; btn.innerText = l.checking;

    try {
        const { participant } = await API.participant.login(input);
        currentUserCode = input;
        currentScreenView = null;
        globalUserData = participant;

        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('stampScreen').classList.remove('hidden');
        document.getElementById('displayUserCode').innerText = l.userIdPrefix + currentUserCode;
        renderUI(globalUserData);
        startParticipantPolling();
    } catch (error) {
        alert(
            error.code === 'CODE_NOT_REGISTERED'
                ? l.alerts.errNotFound
                : l.alerts.errConn
        );
    }
    finally {
        isLoggingIn = false;
        btn.disabled = false;
        btn.innerText = l.loginBtn;
    }
}

function startParticipantPolling() {
    if (pollTimer) window.clearInterval(pollTimer);
    pollTimer = window.setInterval(async () => {
        if (!currentUserCode) return;
        try {
            const { participant } = await API.participant.get(currentUserCode);
            globalUserData = participant;
            renderUI(globalUserData);
        } catch (error) {
            console.warn("Participant refresh failed", error);
        }
    }, APP_CONFIG.api.pollIntervalMs);
}

// Stamp-card rendering
function renderUI(userData) {
    if (!userData) return;
    const l = LANG[currentLang];
    const mapContainer = document.getElementById('mapContainer');
    const btnRedeem = document.getElementById('btnRedeem');
    const btnBackToReward = document.getElementById('btnBackToReward');
    const btnLogoutStamp = document.getElementById('btnLogoutStamp');

    let count = 0;
    const userStations = userData.stations || {};

    mapContainer.innerHTML = '';
    let posMap = Object.fromEntries(
        STATIONS.map((station) => [station.id, station.id]),
    );

    if (userData.scanHistory) {
        const historyList = Object.values(userData.scanHistory).sort((a, b) => a.time - b.time);
        historyList.forEach(record => {
            const targetId = parseInt(record.id);
            const currentCenterId = Object.keys(posMap).find(key => posMap[key] === 0);
            const targetCurrentPos = posMap[targetId];
            posMap[currentCenterId] = targetCurrentPos;
            posMap[targetId] = 0;
        });
    }

    STATIONS.forEach((st, index) => {
        const node = document.createElement('div');
        const isPassed = userStations[index] === true;
        const currentPosClass = posMap[index];

        if (isPassed) {
            count++;
            node.className = `station-node st-${currentPosClass} stamped`;
            node.innerHTML = `<img src="${st.images.stamped}" alt="${st.name}">`;
            node.onclick = () => toggleStationContent(index);
        } else {
            node.className = `station-node st-${currentPosClass} unstamped`;
            node.innerHTML = `<img src="${st.images.unstamped}" alt="${st.name}"><span>${st.name}</span>`;
            node.onclick = () => {
                if(!userData.isRedeemed) openScannerFor(index);
            };
        }
        mapContainer.appendChild(node);
    });

    document.getElementById('statusText').innerText = formatMessage(
        count === STATIONS.length ? l.completedText : l.stampStatusText,
        { count, total: STATIONS.length },
    );

    if (userData.isRedeemed) {
        btnRedeem.classList.add('hidden');
        btnBackToReward.style.display = 'block';
        btnLogoutStamp.style.display = 'none';

        if (!currentScreenView) switchView('reward');
        else switchView(currentScreenView);
    } else {
        btnRedeem.classList.remove('hidden');
        btnBackToReward.style.display = 'none';
        btnLogoutStamp.style.display = 'block';

        btnRedeem.disabled = (count < STATIONS.length);
        btnRedeem.innerText = (count < STATIONS.length)
            ? formatMessage(l.redeemBtn, { total: STATIONS.length })
            : l.redeemReadyBtn;
        btnRedeem.style.backgroundColor = (count < STATIONS.length) ? "#fca5a5" : "#f87171";

        switchView('stamp');
    }
}

function toggleStationContent(stationId, forceOpen = false) {
    const box = document.getElementById('contentBox');
    const l = LANG[currentLang];
    const contentText = STATIONS[stationId].content[currentLang];

    if (!forceOpen && box.dataset.activeId == stationId && !box.classList.contains('hidden')) {
        box.classList.add('hidden');
    } else {
        box.dataset.activeId = stationId;
        let ratingHtml = "";
        if (globalUserData && globalUserData.ratings && globalUserData.ratings[stationId]) {
            const starCount = globalUserData.ratings[stationId];
            const ratingResult = l.ratingLabels[starCount] || "";
            ratingHtml = `
            <div class="display-stars">
                ${l.ratingResultTitle}
                <div style="font-size:20px; color:#b45309; margin-top:5px; font-weight:normal;">${ratingResult}</div>
            </div>`;
        }
        box.innerHTML = `<h3>📖 ${STATIONS[stationId].name}</h3><p>${contentText}</p>${ratingHtml}`;
        box.classList.remove('hidden');
    }
}

// Station rating
function showRatingBox(id, name, qrPayload) {
    const l = LANG[currentLang];
    pendingRatingStationId = id;
    pendingRatingStationName = name;
    pendingQrPayload = qrPayload;
    selectedRating = 0;

    document.getElementById('ratingTitle').innerText = name;
    document.getElementById('ratingBox').classList.remove('hidden');
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('btnSubmitRating').disabled = true;
    document.getElementById('btnSubmitRating').innerText = l.ratingSubmitBtn;

    const emojis = document.querySelectorAll('#starContainer span');
    emojis.forEach(emoji => {
        emoji.classList.remove('active');
        emoji.onclick = function() {
            emojis.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            selectedRating = parseInt(this.getAttribute('data-value'));
            document.getElementById('btnSubmitRating').disabled = false;
        };
    });
}

async function submitRating() {
    if (selectedRating === 0 || pendingRatingStationId === null) return;
    const l = LANG[currentLang];
    const btn = document.getElementById('btnSubmitRating');
    btn.disabled = true;

    const targetId = pendingRatingStationId;
    const targetName = pendingRatingStationName;
    const currentRating = selectedRating;
    const qrPayload = pendingQrPayload;

    document.getElementById('ratingBox').classList.add('hidden');
    document.getElementById('mapWrapper').style.display = 'flex';
    toggleStationContent(targetId, true);
    try {
        const { participant } = await API.participant.completeStation(
            currentUserCode,
            targetId,
            currentRating,
            qrPayload,
        );
        globalUserData = participant;
        pendingRatingStationId = null;
        pendingRatingStationName = null;
        pendingQrPayload = null;
        renderUI(globalUserData);
    } catch(e) {
        console.error("Save Error", e);
        alert(e.code === 'EXPIRED_QR' ? l.alerts.errQrExpire : l.alerts.errSave);
        document.getElementById('ratingBox').classList.remove('hidden');
        document.getElementById('mapWrapper').style.display = 'none';
    } finally {
        btn.innerText = l.ratingSubmitBtn;
        btn.disabled = selectedRating === 0;
    }
}

// Destiny card
function openCardDraw() {
    switchView('cardDraw');
    const l = LANG[currentLang];

    if (globalUserData && globalUserData.drawnCardId) {
        showDrawnCard(globalUserData.drawnCardId);
    } else {
        document.getElementById('drawIntroArea').classList.remove('hidden');
        document.getElementById('drawResultArea').classList.add('hidden');
        document.getElementById('shufflingIcon').classList.remove('shuffle-anim');
        document.getElementById('shufflingIcon').innerText = "🎴";

        const btn = document.getElementById('btnStartDraw');
        btn.disabled = false;
        btn.innerText = l.btnStartDraw;
    }
}

function startCardDraw() {
    const btn = document.getElementById('btnStartDraw');
    btn.disabled = true;

    const icon = document.getElementById('shufflingIcon');
    icon.classList.add('shuffle-anim');

    // สลับไอคอนไพ่จำลองช่วงสับ
    const shuffleInterval = setInterval(() => {
        const randomCard = DESTINY_CARDS[Math.floor(Math.random() * DESTINY_CARDS.length)];
        icon.innerText = "🃏";
    }, 100);

    setTimeout(async () => {
        clearInterval(shuffleInterval);
        icon.classList.remove('shuffle-anim');

        try {
            const { participant } = await API.participant.draw(currentUserCode);
            globalUserData = participant;
            showDrawnCard(participant.drawnCardId);
        } catch(e) {
            console.error("Save Draw Error", e);
            btn.disabled = false;
        }
    }, 2000);
}

function showDrawnCard(cardId) {
    document.getElementById('drawIntroArea').classList.add('hidden');
    const card = DESTINY_CARDS.find(c => c.id === cardId);

    if(card) {
        // กำหนดที่อยู่ไฟล์รูปภาพ (เช่น "cards/01.webp")
        document.getElementById('drawnCardImage').src = card.imagePath;
        document.getElementById('drawResultArea').classList.remove('hidden');
    }
}

// QR scanner
function openScannerFor(stationIndex) {
    if (isScannerInitializing || (html5QrCode && html5QrCode.isScanning) || (globalUserData && globalUserData.isRedeemed)) return;
    const l = LANG[currentLang];

    document.getElementById('contentBox').classList.add('hidden');
    document.getElementById('ratingBox').classList.add('hidden');

    activeTargetStation = STATIONS[stationIndex];
    cancelRequested = false;
    isScannerInitializing = true;
    isProcessingScan = false;

    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('reader').style.display = 'block';
    document.getElementById('btnCancel').style.display = 'block';

    if (!html5QrCode) html5QrCode = new Html5Qrcode("reader");

    html5QrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        async (decodedText) => {
            if (isProcessingScan) return;
            const parts = decodedText.split('|');

            if (parts.length === 2 && parts[0] === activeTargetStation.qrCode) {
                const qrTimestamp = parseInt(parts[1]);
                const timeDifference = Date.now() - qrTimestamp;

                if (
                    timeDifference <= APP_CONFIG.qr.maxAgeMs &&
                    timeDifference >= -APP_CONFIG.qr.allowedFutureClockSkewMs
                ) {
                    isProcessingScan = true;
                    stopScan();

                    const targetId = activeTargetStation.id;
                    const targetName = activeTargetStation.name;

                    const alreadyCompleted =
                        globalUserData?.stations?.[targetId] === true;
                    if (!alreadyCompleted) {
                        setTimeout(
                            () => showRatingBox(targetId, targetName, decodedText),
                            200,
                        );
                    }
                } else {
                    isProcessingScan = true;
                    alert(l.alerts.errQrExpire);
                    stopScan();
                }
            } else if (decodedText.includes(activeTargetStation.qrCode) && !decodedText.includes('|')) {
                isProcessingScan = true;
                alert(l.alerts.errQrFormat);
                stopScan();
            } else {
                isProcessingScan = true;
                alert(l.alerts.errQrWrong);
                stopScan();
            }
        },
        (err) => {}
    ).then(() => {
        isScannerInitializing = false;
        if (cancelRequested) stopScan();
    }).catch(err => {
        isScannerInitializing = false;
        alert("Cannot access camera.");
        resetScannerUI();
    });
}

function stopScan() {
    if (isScannerInitializing) { cancelRequested = true; resetScannerUI(); return; }
    if (html5QrCode && html5QrCode.isScanning) html5QrCode.stop().then(() => resetScannerUI()).catch(e => resetScannerUI());
    else resetScannerUI();
}

function resetScannerUI() {
    document.getElementById('reader').style.display = 'none';
    document.getElementById('btnCancel').style.display = 'none';
    if (document.getElementById('ratingBox').classList.contains('hidden')) {
        document.getElementById('mapWrapper').style.display = 'flex';
    }
    activeTargetStation = null;
    isScannerInitializing = false;
    cancelRequested = false;
    isProcessingScan = false;
}

// Reward redemption
function redeemReward() {
    finalSelectedRating = 0;
    document.getElementById('finalAssessmentOverlay').classList.remove('hidden');
    document.getElementById('btnSubmitFinal').disabled = true;

    const finalStars = document.querySelectorAll('#finalStarContainer span');
    finalStars.forEach(star => {
        star.classList.remove('active');
        star.onclick = function() {
            finalSelectedRating = parseInt(this.getAttribute('data-value'));
            finalStars.forEach(s => s.classList.remove('active'));
            for(let i=0; i<finalSelectedRating; i++) finalStars[i].classList.add('active');
            document.getElementById('btnSubmitFinal').disabled = false;
        };
    });
}

function closeFinalAssessment() {
    document.getElementById('finalAssessmentOverlay').classList.add('hidden');
}

async function submitFinalAssessment() {
    if (finalSelectedRating === 0) return;
    const btn = document.getElementById('btnSubmitFinal');
    btn.disabled = true;

    try {
        const { participant } = await API.participant.redeem(
            currentUserCode,
            finalSelectedRating,
        );
        globalUserData = participant;
        renderUI(globalUserData);
        closeFinalAssessment();
        switchView('reward');
    } catch(e) {
        console.error("Save Error", e);
        alert(LANG[currentLang].alerts.errSave);
    } finally {
        btn.disabled = false;
    }
}

// Session cleanup
function logout() {
    try {
        stopScan();
        if(pollTimer) { window.clearInterval(pollTimer); pollTimer = null; }
        currentUserCode = ""; globalUserData = null;
        currentScreenView = null;
        pendingRatingStationId = null;
        pendingRatingStationName = null;
        pendingQrPayload = null;
        selectedRating = 0;
        otpInputs.forEach(box => box.value = '');

        const l = LANG[currentLang];
        document.getElementById('btnLogin').disabled = false;
        document.getElementById('btnLogin').innerText = l.loginBtn;

        document.getElementById('stampScreen').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('contentBox').classList.add('hidden');
        document.getElementById('ratingBox').classList.add('hidden');
        document.getElementById('mapWrapper').style.display = 'flex';

        closeFinalAssessment();
    } catch (error) { location.reload(); }
}

applyLanguage();
