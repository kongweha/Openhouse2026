
// Shared configuration and page setup
const APP_CONFIG = window.OpenHouseConfig;
const STATIONS = APP_CONFIG.stations;
const STATION_COUNT = STATIONS.length;
const db = window.openHouseDb;

document.documentElement.style.setProperty('--station-count', STATION_COUNT);

const startStationFilter = document.getElementById('filterStartStation');
STATIONS.forEach((station) => {
    const option = document.createElement('option');
    option.value = station.id;
    option.textContent = `เริ่มเล่นที่: ${station.name}`;
    startStationFilter.appendChild(option);
});

document.getElementById('btnGenerateCodes').textContent =
    `🔄 สร้างรหัส ${APP_CONFIG.participants.generationCount} ใบ`;

// Firebase-backed dashboard state
let globalUsersData = {};

function switchTab(tabId, button) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(`tab-${tabId}`).classList.add('active');
    button.classList.add('active');
}

async function generateAndUploadCodes() {
    if(confirm("การสร้างใหม่จะลบข้อมูลเดิมทั้งหมด ยืนยันหรือไม่?")) {
        let codesSet = new Set();
        const firstCode = 10 ** (APP_CONFIG.participants.codeLength - 1);
        const codeRange = firstCode * 9;
        while(codesSet.size < APP_CONFIG.participants.generationCount) {
            codesSet.add(Math.floor(firstCode + Math.random() * codeRange).toString());
        }
        let updates = {};
        codesSet.forEach(code => {
            updates[code] = { stations: Array(STATION_COUNT).fill(false), isRedeemed: false };
        });
        await db.ref('users').set(updates);
        alert(`สร้างรหัส ${APP_CONFIG.participants.codeLength} หลักสำเร็จ!`);
    }
}

async function clearDatabase() {
    if(confirm("ลบข้อมูลทั้งหมดออกจากระบบ แน่ใจหรือไม่?")) {
        await db.ref('users').remove();
    }
}

// Data export
function exportCSV() {
    let csvContent = "\uFEFF";
    csvContent += "รหัสสมาชิก,สถานะ,จำนวนฐานที่ผ่าน,เวลาที่ใช้รวม(วินาที),";

    for(let i=1; i<=STATION_COUNT; i++) {
        csvContent += `ฐานลำดับที่ ${i},เวลาที่ใช้(วินาที),คะแนนดาว,`;
    }
    csvContent += "\n";

    let completed = [];
    let others = [];

    Object.keys(globalUsersData).forEach(code => {
        let user = globalUsersData[code];
        let passed = user.stations ? user.stations.filter(s => s === true).length : 0;

        if (passed === STATION_COUNT && user.scanHistory) {
            let scans = Object.values(user.scanHistory).sort((a,b) => a.time - b.time);
            if(scans.length > 0) {
                completed.push({ code: code, user: user, scans: scans });
            } else {
                others.push({ code: code, user: user, scans: [] });
            }
        } else {
            let scans = user.scanHistory ? Object.values(user.scanHistory).sort((a,b) => a.time - b.time) : [];
            others.push({ code: code, user: user, scans: scans });
        }
    });

    completed.sort((a, b) => {
        let timeA = a.user.redeemTime || a.scans[a.scans.length-1].time;
        let timeB = b.user.redeemTime || b.scans[b.scans.length-1].time;
        return timeA - timeB;
    });
    others.sort((a, b) => a.code.localeCompare(b.code));

    let allUsers = [...completed, ...others];

    allUsers.forEach(item => {
        let passed = item.user.stations ? item.user.stations.filter(s => s === true).length : 0;
        let status = passed === 0 ? "ยังไม่เริ่ม" : (passed < STATION_COUNT ? "กำลังเล่น" : (item.user.isRedeemed ? "รับรางวัลแล้ว" : "ผ่านครบแล้ว"));

        let totalSec = "";
        if(item.user.loginTime && item.scans.length > 0) {
            let endTime = item.user.redeemTime || item.scans[item.scans.length-1].time;
            totalSec = Math.floor((endTime - item.user.loginTime) / 1000);
        }

        let row = `"${item.code}","${status}","${passed}/${STATION_COUNT}","${totalSec}",`;

        let lastTime = item.user.loginTime;
        for(let i=0; i<STATION_COUNT; i++) {
            if(item.scans[i]) {
                let scan = item.scans[i];
                let durationSec = lastTime ? Math.floor((scan.time - lastTime) / 1000) : "";
                let rating = (item.user.ratings && item.user.ratings[scan.id]) ? item.user.ratings[scan.id] : "";
                row += `"${scan.name}","${durationSec}","${rating}",`;
                lastTime = scan.time;
            } else {
                row += `"","","",`;
            }
        }
        csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `DataExport_${new Date().getTime()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

db.ref('users').on('value', (snapshot) => {
    globalUsersData = snapshot.val() || {};

    let total = 0, completedCount = 0, redeemedCount = 0;
    Object.keys(globalUsersData).forEach(code => {
        total++;
        let user = globalUsersData[code];
        let passed = user.stations ? user.stations.filter(s => s === true).length : 0;
        if(passed === STATION_COUNT) completedCount++;
        if(user.isRedeemed) redeemedCount++;
    });

    document.getElementById('statTotal').innerText = total;
    document.getElementById('statCompleted').innerText = completedCount;
    document.getElementById('statRedeemed').innerText = redeemedCount;

    renderDashboard();
    renderLeaderboard();
    renderDetailed();
});

// Dashboard views
function renderDashboard() {
    const tbody = document.getElementById('tableDashboard');
    const searchVal = document.getElementById("searchDashboard").value.trim().toLowerCase();

    let htmlContent = '';
    let index = 1;
    const sortedCodes = Object.keys(globalUsersData).sort();

    sortedCodes.forEach((code) => {
        if (searchVal && !code.includes(searchVal)) return;

        const user = globalUsersData[code];
        const passedStations = user.stations ? user.stations.filter(s => s === true).length : 0;

        let statusClass = passedStations === 0 ? 'none' : (passedStations < STATION_COUNT ? 'playing' : 'completed');
        let statusText = passedStations === 0 ? 'ยังไม่เริ่ม' : (passedStations < STATION_COUNT ? 'กำลังเล่น' : 'ผ่านครบแล้ว');
        let statusBadge = `<span class="badge ${statusClass} clickable-status" onclick="openModal('${code}')">${statusText} 🔍</span>`;
        let redeemedBadge = user.isRedeemed ? '<span class="badge redeemed">รับแล้ว 🎁</span>' : '<span class="badge none">-</span>';

        htmlContent += `
            <tr>
                <td style="text-align: center;">${index++}</td>
                <td style="font-family: monospace; font-size: 18px; font-weight: bold; letter-spacing: 1px;">${code}</td>
                <td style="text-align: center;"><b>${passedStations}</b> / ${STATION_COUNT}</td>
                <td style="text-align: center;">${statusBadge}</td>
                <td style="text-align: center;">${redeemedBadge}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent || '<tr><td colspan="5" style="text-align: center;">ไม่มีข้อมูล</td></tr>';
}

function renderLeaderboard() {
    const tbody = document.getElementById('tableLeaderboard');
    const searchVal = document.getElementById("searchLeaderboard").value.trim().toLowerCase();
    const filterStart = document.getElementById("filterStartStation").value;

    let rankedUsers = [];

    Object.keys(globalUsersData).forEach(code => {
        let user = globalUsersData[code];
        const passedStations = user.stations ? user.stations.filter(s => s === true).length : 0;
        if (passedStations === STATION_COUNT && user.scanHistory) {
            let scans = Object.values(user.scanHistory).sort((a,b) => a.time - b.time);
            if(scans.length > 0) rankedUsers.push({ code: code, user: user, scans: scans });
        }
    });

    rankedUsers.sort((a, b) => {
        let timeA = a.user.redeemTime || a.scans[a.scans.length-1].time;
        let timeB = b.user.redeemTime || b.scans[b.scans.length-1].time;
        return timeA - timeB;
    });

    let htmlContent = '';
    let rank = 1;

    rankedUsers.forEach((item) => {
        if (searchVal && !item.code.includes(searchVal)) return;
        let firstStationId = item.scans[0].id.toString();
        if (filterStart !== "all" && firstStationId !== filterStart) return;

        let totalTimeText = "-";
        if(item.user.loginTime) {
            let endTime = item.user.redeemTime || item.scans[item.scans.length-1].time;
            totalTimeText = getDuration(item.user.loginTime, endTime);
        }

        let pathHtml = `<div class="path-flow">`;
        item.scans.forEach((scan, i) => {
            pathHtml += `<span>${scan.name}</span>`;
            if(i < item.scans.length - 1) pathHtml += `<span class="path-arrow">➔</span>`;
        });
        pathHtml += `</div>`;

        htmlContent += `
            <tr>
                <td style="text-align: center; font-size: 18px; font-weight: bold; color: #d97706;">#${rank++}</td>
                <td style="font-family: monospace; font-size: 18px; font-weight: bold;">${item.code}</td>
                <td style="color: #64748b;">${totalTimeText}</td>
                <td>${pathHtml}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent || '<tr><td colspan="4" style="text-align: center; padding:20px;">ไม่พบประวัติผู้ที่ผ่านเกณฑ์</td></tr>';
}

function renderDetailed() {
    const tbody = document.getElementById('tableDetailed');
    const searchVal = document.getElementById("searchDetailed").value.trim().toLowerCase();

    let rankedUsers = [];

    Object.keys(globalUsersData).forEach(code => {
        let user = globalUsersData[code];
        const passedStations = user.stations ? user.stations.filter(s => s === true).length : 0;
        if (passedStations === STATION_COUNT && user.scanHistory) {
            let scans = Object.values(user.scanHistory).sort((a,b) => a.time - b.time);
            if(scans.length > 0) rankedUsers.push({ code: code, user: user, scans: scans });
        }
    });

    rankedUsers.sort((a, b) => {
        let timeA = a.user.redeemTime || a.scans[a.scans.length-1].time;
        let timeB = b.user.redeemTime || b.scans[b.scans.length-1].time;
        return timeA - timeB;
    });

    let htmlContent = '';
    let rank = 1;

    rankedUsers.forEach((item) => {
        if (searchVal && !item.code.includes(searchVal)) return;

        let pathHtml = `<div class="path-flow-detailed">`;
        let lastTime = item.user.loginTime;

        item.scans.forEach((scan, i) => {
            let durationText = lastTime ? getDuration(lastTime, scan.time) : '-';
            lastTime = scan.time;

            let ratingVal = (item.user.ratings && item.user.ratings[scan.id]) ? parseInt(item.user.ratings[scan.id]) : 0;
            let starsHtml = ratingVal > 0
                ? '⭐'.repeat(ratingVal)
                : '<span style="color:#94a3b8; font-size:11px;">ไม่มีคะแนน</span>';

            pathHtml += `
                <div class="path-step">
                    <div class="step-header">ลำดับที่ ${i + 1}</div>
                    <div class="step-name">${scan.name}</div>
                    <div class="step-time">⏱️ ${durationText}</div>
                    <div class="step-rating">${starsHtml}</div>
                </div>
            `;
        });
        pathHtml += `</div>`;

        htmlContent += `
            <tr>
                <td style="text-align: center; font-size: 18px; font-weight: bold; color: #d97706;">#${rank++}</td>
                <td style="font-family: monospace; font-size: 18px; font-weight: bold;">${item.code}</td>
                <td>${pathHtml}</td>
            </tr>
        `;
    });

    tbody.innerHTML = htmlContent || '<tr><td colspan="3" style="text-align: center; padding:20px;">ไม่พบประวัติผู้ที่ผ่านเกณฑ์</td></tr>';
}

// Timeline helpers
function formatTime(ms) { return ms ? new Date(ms).toLocaleTimeString('th-TH') : '-'; }

function getDuration(startMs, endMs) {
    if(!startMs || !endMs || startMs > endMs) return '';
    let diff = Math.floor((endMs - startMs) / 1000);
    let m = Math.floor(diff / 60);
    let s = diff % 60;
    return m === 0 ? `${s} วินาที` : `${m} นาที ${s} วิ`;
}

function openModal(code) {
    document.getElementById('historyModal').style.display = 'flex';
    document.getElementById('modalUserCode').innerText = `รหัสสมาชิก: ${code}`;
    const timeline = document.getElementById('timelineContent');
    timeline.innerHTML = '';

    const user = globalUsersData[code];
    if(!user || (!user.loginTime && !user.scanHistory)) {
        timeline.innerHTML = '<li>ไม่มีประวัติการเล่น (ไม่ได้สแกน QR ใดๆ)</li>'; return;
    }

    let lastTime = user.loginTime;
    if(user.loginTime) {
        timeline.innerHTML += `<li><b>🔐 เข้าสู่ระบบ</b> <span class="timeline-time">${formatTime(user.loginTime)}</span></li>`;
    }

    if(user.scanHistory) {
        const scans = Object.values(user.scanHistory).sort((a, b) => a.time - b.time);
        scans.forEach((scan) => {
            let durationHtml = lastTime ? `<br><span class="duration-box">⏱️ ใช้เวลา ${getDuration(lastTime, scan.time)}</span>` : '';
            timeline.innerHTML += `<li><b>📍 ฐาน: ${scan.name}</b> <span class="timeline-time">${formatTime(scan.time)}</span> ${durationHtml}</li>`;
            lastTime = scan.time;
        });
    }

    if(user.isRedeemed && user.redeemTime) {
        let durationHtml = lastTime ? `<br><span class="duration-box">⏱️ ใช้เวลา ${getDuration(lastTime, user.redeemTime)}</span>` : '';
        timeline.innerHTML += `<li><b>🎁 แลกรับรางวัล</b> <span class="timeline-time">${formatTime(user.redeemTime)}</span> ${durationHtml}</li>`;
    }
}

function closeModal() { document.getElementById('historyModal').style.display = 'none'; }
