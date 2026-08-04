// Localized interface copy
let currentLang = 'en';
const LANG = {
    en: {
        loginTitle: "🔐 Login to System",
        loginBtn: "Login",
        checking: "Checking...",
        forgotCode: "Forgot your code?",
        cardTitle: "🎉 Stamp Card",
        userIdPrefix: "User ID: ",
        stampStatusText: "Completed: {count} / {total}",
        completedText: "🎉 All {total} stations completed!",
        stampSubStatus: "(Click on unstamped circles to scan QR Code)",
        redeemBtn: "Evaluate to receive your reward (complete {total} stations first)",
        redeemReadyBtn: "Evaluate to receive your reward",
        cancelScanBtn: "❌ Cancel Camera",
        logoutBtn: "Logout",
        ratingHeader: "⭐ How was this station?",
        ratingSubmitBtn: "Submit Rating",
        saving: "Saving...",
        finalHeader: "📝 Final Assessment",
        finalDesc: "Based on today's activities, how likely are you to use the physical library space (e.g., Chula AIX) this semester?",
        finalSubmit: "Submit assessment",
        successTitle: "🎁 Reward claimed successfully!",
        successSub: "(Cannot be played again)",
        evaluationCompleteTitle: "Activity evaluation completed",
        evaluationCompleteSub: "Please show this screen to a staff member to receive your reward.",
        staffOnly: "Staff only",
        staffNote: "Press this button only after the reward has been handed to the participant.",
        confirmRewardButton: "Confirm reward handed over",
        activityEvaluationHeader: "Chula Open House 2026 Activity Satisfaction Survey",
        activityFormat: "Activity format",
        activityVenue: "Activity venue",
        activityDuration: "Activity duration",
        activityReward: "Reward",
        activityOverall: "Overall activity experience",
        favoriteStation: "Your favorite station",
        suggestion: "Impressions / suggestions / feedback",
        suggestionPlaceholder: "Share your impressions, suggestions, or feedback (optional)",
        desiredLibraryServices: "New services you would like the library to offer",
        desiredLibraryServicesPlaceholder: "Describe a new library service you would like (optional)",
        selectStation: "Select a station",
        evaluationSubmit: "Submit evaluation to receive reward",
        intentionPendingButton: "Complete the library-use assessment first",
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
            errSave: "Error saving data. Please try again.",
            sessionReplaced: "This code was opened on another device. This session has been signed out.",
            evaluationRequired: "Please complete every activity-evaluation field.",
            confirmReward: "Staff only: confirm that the participant has received the reward?",
            rewardReceived: "Reward receipt has been confirmed."
        }
    },
    th: {
        loginTitle: "🔐 เข้าสู่ระบบสะสมแต้ม",
        loginBtn: "ตกลงเพื่อเข้าสู่ระบบ",
        checking: "กำลังตรวจสอบ...",
        forgotCode: "ลืมรหัส",
        cardTitle: "🎉 บัตรสะสมแต้ม",
        userIdPrefix: "รหัสสมาชิก: ",
        stampStatusText: "ผ่านแล้ว: {count} / {total} ฐาน",
        completedText: "🎉 เล่นครบ {total} ฐานแล้ว!",
        stampSubStatus: "(คลิกที่วงกลมฐานที่ยังไม่ผ่านเพื่อสแกน QR Code)",
        redeemBtn: "ประเมินเพื่อรับของรางวัล (ต้องครบ {total} ฐาน)",
        redeemReadyBtn: "ประเมินเพื่อรับของรางวัล",
        cancelScanBtn: "❌ ยกเลิกสแกนกล้อง",
        logoutBtn: "ออกจากระบบ",
        ratingHeader: "⭐ บอกเราหน่อยว่าฐานนี้เป็นยังไง",
        ratingSubmitBtn: "ยืนยันให้คะแนน",
        saving: "กำลังบันทึก...",
        finalHeader: "📝 แบบประเมินก่อนรับรางวัล",
        finalDesc: "จากกิจกรรมในวันนี้ คุณมีความตั้งใจที่จะเข้าไปใช้บริการพื้นที่จริงของสำนักวิทยทรัพยากร (เช่น พื้นที่ Chula AIX) ภายในภาคการศึกษานี้ มากน้อยเพียงใด?",
        finalSubmit: "ส่งแบบประเมิน",
        successTitle: "🎁 รับของรางวัลเรียบร้อยแล้ว!",
        successSub: "(ไม่สามารถเล่นซ้ำได้)",
        evaluationCompleteTitle: "ประเมินกิจกรรมเรียบร้อยแล้ว",
        evaluationCompleteSub: "กรุณาแสดงหน้านี้แก่เจ้าหน้าที่เพื่อรับของรางวัล",
        staffOnly: "สำหรับเจ้าหน้าที่เท่านั้น",
        staffNote: "กรุณากดปุ่มนี้หลังจากมอบของรางวัลให้ผู้เล่นแล้วเท่านั้น",
        confirmRewardButton: "ยืนยันว่ามอบของรางวัลแล้ว",
        activityEvaluationHeader: "ประเมินความพึงพอใจในกิจกรรม Chula Open House 2026",
        activityFormat: "รูปแบบกิจกรรม",
        activityVenue: "สถานที่จัดกิจกรรม",
        activityDuration: "ระยะเวลาในการจัดกิจกรรม",
        activityReward: "ของรางวัล",
        activityOverall: "ภาพรวมกิจกรรม",
        favoriteStation: "ฐานที่ชอบที่สุด",
        suggestion: "ความประทับใจ/ข้อเสนอแนะ/ติชม",
        suggestionPlaceholder: "พิมพ์ความประทับใจ ข้อเสนอแนะ หรือคำติชม (ไม่บังคับ)",
        desiredLibraryServices: "บริการใหม่ที่นิสิตอยากให้มีในห้องสมุด",
        desiredLibraryServicesPlaceholder: "พิมพ์บริการใหม่ที่อยากให้ห้องสมุดมี (ไม่บังคับ)",
        selectStation: "เลือกฐาน",
        evaluationSubmit: "ส่งแบบประเมินเพื่อรับของรางวัล",
        intentionPendingButton: "กรุณาประเมินแนวโน้มการใช้ห้องสมุดก่อน",
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
            errSave: "เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่",
            sessionReplaced: "รหัสนี้ถูกเปิดจากอุปกรณ์อื่น ระบบจึงออกจากระบบของอุปกรณ์นี้แล้ว",
            evaluationRequired: "กรุณาตอบแบบประเมินกิจกรรมให้ครบทุกข้อ",
            confirmReward: "สำหรับเจ้าหน้าที่: ยืนยันว่าผู้เล่นได้รับของรางวัลแล้วใช่หรือไม่?",
            rewardReceived: "ยืนยันว่าผู้เล่นได้รับของรางวัลแล้ว"
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
let currentSessionToken = "";
let stopSessionWatch = null;
let isHandlingSessionReplacement = false;
let html5QrCode;
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
let activityCriteriaRatings = {};
let currentScreenView = null;
let isEvaluationOnly = false;

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
    const forgotCodeLink = document.getElementById('forgotCodeLink');
    forgotCodeLink.innerText = l.forgotCode;
    forgotCodeLink.href = `forgot-code.html?lang=${currentLang}`;
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

    document.getElementById('txtSuccessTitle').innerText = l.successTitle;
    document.getElementById('txtSuccessSub').innerText = l.successSub;
    document.getElementById('txtStaffOnly').innerText = l.staffOnly;
    document.getElementById('txtStaffNote').innerText = l.staffNote;
    document.getElementById('btnConfirmReward').innerText = l.confirmRewardButton;
    document.getElementById('txtActivityEvaluationHeader').innerText = l.activityEvaluationHeader;
    document.getElementById('txtFavoriteStation').innerText = l.favoriteStation;
    document.getElementById('txtSuggestion').innerText = l.suggestion;
    document.getElementById('activitySuggestion').placeholder = l.suggestionPlaceholder;
    document.getElementById('txtDesiredLibraryServices').innerText = l.desiredLibraryServices;
    document.getElementById('desiredLibraryServices').placeholder = l.desiredLibraryServicesPlaceholder;
    renderEvaluationOptions();
    document.getElementById('txtFinalHeader').innerText = l.finalHeader;
    document.getElementById('txtFinalDesc').innerText = l.finalDesc;
    document.getElementById('btnSubmitFinal').innerText = l.finalSubmit;
    document.getElementById('btnSubmitRating').innerText = isEvaluationOnly
        ? l.evaluationSubmit
        : l.ratingSubmitBtn;
    updateRatingSubmitState();
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
        const { participant, sessionToken } = await API.participant.login(input);
        currentUserCode = input;
        currentSessionToken = sessionToken;
        currentScreenView = null;
        globalUserData = participant;

        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('stampScreen').classList.remove('hidden');
        document.getElementById('displayUserCode').innerText = l.userIdPrefix + currentUserCode;
        renderUI(globalUserData);
        await beginSessionWatch();
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

    if ((userData.activityEvaluation && userData.finalIntentionRating) || userData.isRedeemed) {
        btnRedeem.classList.add('hidden');
        btnBackToReward.style.display = 'block';
        btnLogoutStamp.style.display = 'none';

        const confirmationPanel = document.getElementById('rewardConfirmationPanel');
        const drawButton = document.getElementById('btnDrawCard');
        confirmationPanel.classList.toggle('hidden', userData.isRedeemed);
        drawButton.classList.toggle('hidden', !userData.isRedeemed);
        document.getElementById('txtSuccessTitle').innerText = userData.isRedeemed
            ? l.successTitle
            : l.evaluationCompleteTitle;
        document.getElementById('txtSuccessSub').innerText = userData.isRedeemed
            ? l.successSub
            : l.evaluationCompleteSub;

        if (!currentScreenView) switchView('reward');
        else switchView(currentScreenView);
    } else {
        btnRedeem.classList.remove('hidden');
        btnBackToReward.style.display = 'none';
        btnLogoutStamp.style.display = 'block';

        const stationsComplete = count === STATIONS.length;
        btnRedeem.disabled = !stationsComplete || !userData.finalIntentionRating;
        btnRedeem.innerText = !stationsComplete
            ? formatMessage(l.redeemBtn, { total: STATIONS.length })
            : userData.finalIntentionRating
                ? l.redeemReadyBtn
                : l.intentionPendingButton;
        btnRedeem.style.backgroundColor = btnRedeem.disabled ? "#fca5a5" : "#f87171";

        switchView('stamp');
        if (stationsComplete && !userData.finalIntentionRating) {
            setTimeout(openFinalIntentionAssessment, 0);
        }
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

function renderStarButtons(container, selectedValue, onSelect) {
    container.innerHTML = [1, 2, 3, 4, 5].map((value) =>
        `<button type="button" class="${value <= selectedValue ? 'active' : ''}" data-value="${value}" role="radio" aria-checked="${value === selectedValue}" aria-label="${value} stars">★</button>`,
    ).join('');
    container.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => onSelect(Number(button.dataset.value)));
    });
}

function renderEvaluationOptions() {
    const l = LANG[currentLang];
    const favorite = document.getElementById('favoriteStation');
    const previousFavorite = favorite.value;
    favorite.innerHTML = `<option value="">${l.selectStation}</option>` +
        STATIONS.map((station) => `<option value="${station.id}">${station.name}</option>`).join('');
    favorite.value = previousFavorite;

    const criteria = [
        ['activityFormat', l.activityFormat],
        ['venue', l.activityVenue],
        ['duration', l.activityDuration],
        ['reward', l.activityReward],
        ['overall', l.activityOverall],
    ];
    const container = document.getElementById('activityCriteriaFields');
    container.innerHTML = criteria.map(([key, label]) => `
        <div class="evaluation-criterion ${key === 'overall' ? 'evaluation-criterion-overall' : ''}">
            <p class="evaluation-label">${label}</p>
            <div class="evaluation-stars activity-criterion-stars" data-criterion="${key}" role="radiogroup" aria-label="${label}"></div>
        </div>`).join('');
    container.querySelectorAll('.activity-criterion-stars').forEach((stars) => {
        const criterion = stars.dataset.criterion;
        renderStarButtons(stars, activityCriteriaRatings[criterion] ?? 0, (value) => {
            activityCriteriaRatings[criterion] = value;
            renderEvaluationOptions();
            updateRatingSubmitState();
        });
    });
}

function resetActivityEvaluationFields() {
    activityCriteriaRatings = {};
    document.getElementById('favoriteStation').value = '';
    document.getElementById('activitySuggestion').value = '';
    document.getElementById('desiredLibraryServices').value = '';
    renderEvaluationOptions();
}

function readActivityEvaluation() {
    return {
        categoryRatings: { ...activityCriteriaRatings },
        favoriteStationId: Number(document.getElementById('favoriteStation').value),
        impressionFeedback: document.getElementById('activitySuggestion').value.trim(),
        desiredLibraryServices: document.getElementById('desiredLibraryServices').value.trim(),
    };
}

function isActivityEvaluationComplete() {
    const criteria = ['activityFormat', 'venue', 'duration', 'reward', 'overall'];
    return document.getElementById('favoriteStation').value !== '' &&
        criteria.every((criterion) => {
            const rating = activityCriteriaRatings[criterion];
            return Number.isInteger(rating) && rating >= 1 && rating <= 5;
        });
}

function updateRatingSubmitState() {
    document.getElementById('btnSubmitRating').disabled = isEvaluationOnly
        ? !isActivityEvaluationComplete()
        : selectedRating === 0;
}

document.getElementById('favoriteStation').addEventListener('change', updateRatingSubmitState);

// Station rating
function showRatingBox(id, name, qrPayload) {
    const l = LANG[currentLang];
    pendingRatingStationId = id;
    pendingRatingStationName = name;
    pendingQrPayload = qrPayload;
    selectedRating = 0;
    isEvaluationOnly = false;
    document.getElementById('stationRatingFields').classList.remove('hidden');
    document.getElementById('activityEvaluationFields').classList.add('hidden');
    document.getElementById('ratingTitle').innerText = name;
    document.getElementById('ratingBox').classList.remove('hidden');
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('btnSubmitRating').innerText = l.ratingSubmitBtn;

    const emojis = document.querySelectorAll('#starContainer span');
    emojis.forEach(emoji => {
        emoji.classList.remove('active');
        emoji.onclick = function() {
            emojis.forEach(s => s.classList.remove('active'));
            this.classList.add('active');
            selectedRating = Number(this.dataset.value);
            updateRatingSubmitState();
        };
    });
    updateRatingSubmitState();
}

function openActivityEvaluationOnly() {
    if (!globalUserData?.finalIntentionRating) {
        openFinalIntentionAssessment();
        return;
    }
    isEvaluationOnly = true;
    selectedRating = 0;
    resetActivityEvaluationFields();
    document.getElementById('stationRatingFields').classList.add('hidden');
    document.getElementById('activityEvaluationFields').classList.remove('hidden');
    document.getElementById('ratingBox').classList.remove('hidden');
    document.getElementById('mapWrapper').style.display = 'none';
    document.getElementById('btnSubmitRating').innerText = LANG[currentLang].evaluationSubmit;
    updateRatingSubmitState();
}

async function submitRating() {
    if (isEvaluationOnly && !isActivityEvaluationComplete()) {
        alert(LANG[currentLang].alerts.evaluationRequired);
        return;
    }
    if (!isEvaluationOnly && (selectedRating === 0 || pendingRatingStationId === null)) return;
    const l = LANG[currentLang];
    const btn = document.getElementById('btnSubmitRating');
    const wasEvaluationOnly = isEvaluationOnly;
    const completedBefore = Object.values(globalUserData?.stations ?? {}).filter(Boolean).length;
    btn.disabled = true;
    document.getElementById('ratingBox').classList.add('hidden');
    document.getElementById('mapWrapper').style.display = 'flex';
    try {
        const { participant } = wasEvaluationOnly
            ? await API.participant.submitEvaluation(
                currentUserCode,
                currentSessionToken,
                readActivityEvaluation(),
            )
            : await API.participant.completeStation(
                currentUserCode,
                currentSessionToken,
                pendingRatingStationId,
                selectedRating,
                pendingQrPayload,
            );
        globalUserData = participant;
        pendingRatingStationId = null;
        pendingRatingStationName = null;
        pendingQrPayload = null;
        isEvaluationOnly = false;
        if (wasEvaluationOnly) currentScreenView = 'reward';
        renderUI(globalUserData);
        if (!wasEvaluationOnly && completedBefore === STATIONS.length - 1) {
            openFinalIntentionAssessment();
        }
    } catch (error) {
        if (handleSessionError(error)) return;
        console.error("Save Error", error);
        alert(error.code === 'EXPIRED_QR' ? l.alerts.errQrExpire : l.alerts.errSave);
        document.getElementById('ratingBox').classList.remove('hidden');
        document.getElementById('mapWrapper').style.display = 'none';
    } finally {
        btn.innerText = isEvaluationOnly ? l.evaluationSubmit : l.ratingSubmitBtn;
        updateRatingSubmitState();
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
            const { participant } = await API.participant.draw(
                currentUserCode,
                currentSessionToken,
            );
            globalUserData = participant;
            showDrawnCard(participant.drawnCardId);
        } catch(e) {
            if (handleSessionError(e)) return;
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

// Library-use intention assessment shown after the final station
function openFinalIntentionAssessment() {
    const overlay = document.getElementById('finalAssessmentOverlay');
    if (!overlay.classList.contains('hidden')) return;
    finalSelectedRating = 0;
    overlay.classList.remove('hidden');
    document.getElementById('btnSubmitFinal').disabled = true;
    const stars = document.querySelectorAll('#finalStarContainer span');
    stars.forEach((star) => {
        star.classList.remove('active');
        star.onclick = function() {
            finalSelectedRating = Number(this.dataset.value);
            stars.forEach((item, index) => {
                item.classList.toggle('active', index < finalSelectedRating);
            });
            document.getElementById('btnSubmitFinal').disabled = false;
        };
    });
}

function closeFinalIntentionAssessment() {
    document.getElementById('finalAssessmentOverlay').classList.add('hidden');
}

async function submitFinalIntentionAssessment() {
    if (!finalSelectedRating) return;
    const btn = document.getElementById('btnSubmitFinal');
    btn.disabled = true;
    try {
        const { participant } = await API.participant.submitFinalIntention(
            currentUserCode,
            currentSessionToken,
            finalSelectedRating,
        );
        globalUserData = participant;
        closeFinalIntentionAssessment();
        renderUI(globalUserData);
    } catch (error) {
        if (handleSessionError(error)) return;
        console.error("Final intention assessment error", error);
        alert(LANG[currentLang].alerts.errSave);
    } finally {
        btn.disabled = false;
    }
}

// Staff reward confirmation
async function confirmRewardReceipt() {
    const l = LANG[currentLang];
    if (!confirm(l.alerts.confirmReward)) return;
    const btn = document.getElementById('btnConfirmReward');
    btn.disabled = true;
    try {
        const { participant } = await API.participant.confirmReward(
            currentUserCode,
            currentSessionToken,
        );
        globalUserData = participant;
        renderUI(globalUserData);
        alert(l.alerts.rewardReceived);
    } catch (error) {
        if (handleSessionError(error)) return;
        console.error("Reward confirmation error", error);
        alert(l.alerts.errSave);
    } finally {
        btn.disabled = false;
    }
}

// Session cleanup
function stopWatchingSession() {
    if (stopSessionWatch) stopSessionWatch();
    stopSessionWatch = null;
}

async function beginSessionWatch() {
    stopWatchingSession();
    const code = currentUserCode;
    const token = currentSessionToken;
    stopSessionWatch = await API.participant.watchSession(code, token, () => {
        if (code === currentUserCode && token === currentSessionToken) {
            handleReplacedSession();
        }
    });
}

function clearLocalSession() {
    try {
        stopWatchingSession();
        stopScan();
        currentUserCode = "";
        currentSessionToken = "";
        globalUserData = null;
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

        closeFinalIntentionAssessment();
    } catch (error) { location.reload(); }
}

function handleReplacedSession() {
    if (isHandlingSessionReplacement || !currentUserCode) return;
    isHandlingSessionReplacement = true;
    clearLocalSession();
    alert(LANG[currentLang].alerts.sessionReplaced);
    isHandlingSessionReplacement = false;
}

function handleSessionError(error) {
    if (error?.code !== 'SESSION_REPLACED') return false;
    handleReplacedSession();
    return true;
}

async function logout() {
    const code = currentUserCode;
    const token = currentSessionToken;
    clearLocalSession();
    if (code && token) {
        try { await API.participant.logout(code, token); }
        catch (error) { console.warn('Remote logout failed', error); }
    }
}

applyLanguage();

const transferredCode = sessionStorage.getItem('openHousePendingAccessCode');
sessionStorage.removeItem('openHousePendingAccessCode');
if (new RegExp(`^\\d{${APP_CONFIG.participants.codeLength}}$`).test(transferredCode || '')) {
    otpInputs.forEach((box, index) => { box.value = transferredCode[index]; });
    otpInputs[otpInputs.length - 1].focus();
}
