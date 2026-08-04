"use strict";

const APP_CONFIG = window.OpenHouseConfig;
const API = window.OpenHouseApi;
const STATIONS = APP_CONFIG.stations;
const STATION_COUNT = STATIONS.length;
let globalUsersData = {};

document.documentElement.style.setProperty("--station-count", STATION_COUNT);
STATIONS.forEach((station) => {
    const option = document.createElement("option");
    option.value = station.id;
    option.textContent = `เริ่มเล่นที่: ${station.name}`;
    document.getElementById("filterStartStation").appendChild(option);
});
document.getElementById("btnGenerateCodes").textContent =
    `สร้างรหัสใหม่ ${APP_CONFIG.participants.generationCount} ใบ`;

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function stationValues(user) {
    return Array.isArray(user.stations)
        ? user.stations
        : Object.values(user.stations ?? {});
}

function passedCount(user) {
    return stationValues(user).filter((value) => value === true).length;
}

function scansFor(user) {
    return Object.values(user.scanHistory ?? {}).sort((a, b) => a.time - b.time);
}

function switchTab(tabId, button) {
    document.querySelectorAll(".tab-content").forEach((element) => element.classList.remove("active"));
    document.querySelectorAll(".tab-btn").forEach((element) => element.classList.remove("active"));
    document.getElementById(`tab-${tabId}`).classList.add("active");
    button.classList.add("active");
}

async function loadUsers() {
    try {
        const { users } = await API.admin.getUsers();
        globalUsersData = users ?? {};
        updateViews();
    } catch (error) {
        alert("โหลดข้อมูลไม่สำเร็จ กรุณาลองใหม่");
    }
}

async function generateAndUploadCodes() {
    if (!confirm("การสร้างรหัสใหม่จะลบข้อมูลผู้ใช้และการลงทะเบียนเดิมทั้งหมด ยืนยันหรือไม่?")) return;
    try {
        const { total } = await API.admin.resetCodes();
        alert(`สร้างรหัสใหม่ ${total} ใบแล้ว`);
        await loadUsers();
    } catch (error) {
        alert("สร้างรหัสไม่สำเร็จ");
    }
}

async function clearDatabase() {
    if (!confirm("ลบข้อมูลผู้ใช้และการลงทะเบียนทั้งหมดออกจากระบบ ยืนยันหรือไม่?")) return;
    try {
        await API.admin.clearUsers();
        await loadUsers();
    } catch (error) {
        alert("ล้างข้อมูลไม่สำเร็จ");
    }
}

function updateViews() {
    const users = Object.values(globalUsersData);
    document.getElementById("statTotal").textContent = users.length;
    document.getElementById("statRegistered").textContent =
        users.filter((user) => user.registration?.studentId).length;
    document.getElementById("statCompleted").textContent =
        users.filter((user) => passedCount(user) === STATION_COUNT).length;
    document.getElementById("statRedeemed").textContent =
        users.filter((user) => user.isRedeemed).length;
    renderDashboard();
    renderLeaderboard();
    renderDetailed();
    renderEvaluations();
}

function renderDashboard() {
    const query = document.getElementById("searchDashboard").value.trim().toLowerCase();
    let index = 0;
    const rows = Object.keys(globalUsersData).sort().flatMap((code) => {
        const user = globalUsersData[code];
        const studentId = user.registration?.studentId ?? "";
        if (query && !code.includes(query) && !studentId.toLowerCase().includes(query)) return [];
        index += 1;
        const passed = passedCount(user);
        const statusClass = passed === 0 ? "none" : passed < STATION_COUNT ? "playing" : "completed";
        const statusText = passed === 0 ? "ยังไม่เริ่ม" : passed < STATION_COUNT ? "กำลังเล่น" : "ผ่านครบแล้ว";
        const visit = user.registration
            ? user.registration.hasVisitedOpenHouse ? "เคย" : "ไม่เคย"
            : "-";
        const education = ({
            bachelor: "ปริญญาตรี",
            master: "ปริญญาโท",
            doctorate: "ปริญญาเอก",
        })[user.registration?.educationLevel] ?? "-";
        return [`<tr>
            <td>${index}</td>
            <td class="code">${escapeHtml(code)}</td>
            <td class="code">${escapeHtml(studentId || "-")}</td>
            <td>${education}</td>
            <td>${visit}</td>
            <td><b>${passed}</b> / ${STATION_COUNT}</td>
            <td><button class="badge ${statusClass} clickable-status" data-code="${escapeHtml(code)}">${statusText}</button></td>
            <td>${user.isRedeemed
                ? '<span class="badge redeemed">รับแล้ว</span>'
                : user.activityEvaluation
                    ? '<span class="badge playing">รอเจ้าหน้าที่ยืนยัน</span>'
                    : '<span class="badge none">-</span>'}</td>
        </tr>`];
    });
    document.getElementById("tableDashboard").innerHTML =
        rows.join("") || '<tr><td colspan="8">ไม่มีข้อมูล</td></tr>';
    document.querySelectorAll("#tableDashboard [data-code]").forEach((button) => {
        button.addEventListener("click", () => openModal(button.dataset.code));
    });
}

function rankedUsers() {
    return Object.entries(globalUsersData)
        .map(([code, user]) => ({ code, user, scans: scansFor(user) }))
        .filter(({ user, scans }) => passedCount(user) === STATION_COUNT && scans.length)
        .sort((a, b) =>
            (a.user.redeemTime ?? a.scans.at(-1).time) -
            (b.user.redeemTime ?? b.scans.at(-1).time));
}

function renderLeaderboard() {
    const query = document.getElementById("searchLeaderboard").value.trim();
    const start = document.getElementById("filterStartStation").value;
    let rank = 0;
    const rows = rankedUsers().flatMap((item) => {
        if (query && !item.code.includes(query)) return [];
        if (start !== "all" && String(item.scans[0].id) !== start) return [];
        rank += 1;
        const end = item.user.redeemTime ?? item.scans.at(-1).time;
        const path = item.scans.map((scan) => `<span>${escapeHtml(scan.name)}</span>`).join('<span class="path-arrow">→</span>');
        return [`<tr><td>#${rank}</td><td class="code">${escapeHtml(item.code)}</td><td>${getDuration(item.user.loginTime, end)}</td><td><div class="path-flow">${path}</div></td></tr>`];
    });
    document.getElementById("tableLeaderboard").innerHTML =
        rows.join("") || '<tr><td colspan="4">ไม่พบข้อมูล</td></tr>';
}

function renderDetailed() {
    const query = document.getElementById("searchDetailed").value.trim();
    let rank = 0;
    const rows = rankedUsers().flatMap((item) => {
        if (query && !item.code.includes(query)) return [];
        rank += 1;
        let lastTime = item.user.loginTime;
        const steps = item.scans.map((scan, index) => {
            const duration = getDuration(lastTime, scan.time);
            lastTime = scan.time;
            const rating = Number(item.user.ratings?.[scan.id] ?? 0);
            return `<div class="path-step">
                <div class="step-header">ลำดับ ${index + 1}</div>
                <div class="step-name">${escapeHtml(scan.name)}</div>
                <div class="step-time">⏱ ${duration || "-"}</div>
                <div class="step-rating">${rating ? "⭐".repeat(rating) : "ไม่มีคะแนน"}</div>
            </div>`;
        }).join("");
        return [`<tr><td>#${rank}</td><td class="code">${escapeHtml(item.code)}</td><td><div class="path-flow-detailed">${steps}</div></td></tr>`];
    });
    document.getElementById("tableDetailed").innerHTML =
        rows.join("") || '<tr><td colspan="3">ไม่พบข้อมูล</td></tr>';
}

function evaluationScore(value) {
    const score = Number(value);
    return Number.isInteger(score) && score >= 1 && score <= 5 ? score : "-";
}

function renderEvaluations() {
    const query = document.getElementById("searchEvaluations").value.trim().toLowerCase();
    const rows = Object.keys(globalUsersData).sort().flatMap((code) => {
        const user = globalUsersData[code];
        const studentId = user.registration?.studentId ?? "";
        const evaluation = user.activityEvaluation;
        if (!evaluation || (query && !code.includes(query) && !studentId.toLowerCase().includes(query))) return [];
        const categories = evaluation.categoryRatings;
        const overall = evaluationScore(categories?.overall ?? evaluation.overallSatisfaction);
        const favorite = STATIONS.find((station) => station.id === Number(evaluation.favoriteStationId));
        const categorySummary = categories
            ? `รูปแบบ ${evaluationScore(categories.activityFormat)}/5<br>สถานที่ ${evaluationScore(categories.venue)}/5<br>ระยะเวลา ${evaluationScore(categories.duration)}/5<br>ของรางวัล ${evaluationScore(categories.reward)}/5<br><b>ภาพรวม ${overall}/5</b>`
            : `<b>ภาพรวม ${overall}/5</b>`;
        return [`<tr>
            <td class="code">${escapeHtml(code)}</td>
            <td class="code">${escapeHtml(studentId || "-")}</td>
            <td>${categorySummary}</td>
            <td>${escapeHtml(favorite?.name ?? "-")}</td>
            <td class="long-response">${escapeHtml(evaluation.impressionFeedback ?? evaluation.suggestion ?? "-")}</td>
            <td class="long-response">${escapeHtml(evaluation.desiredLibraryServices ?? "-")}</td>
        </tr>`];
    });
    document.getElementById("tableEvaluations").innerHTML = rows.join("") || '<tr><td colspan="6">ยังไม่มีข้อมูลแบบประเมิน</td></tr>';
}

function csvValue(value) {
    return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function exportCSV() {
    const headers = ["รหัส Stamp Card", "รหัสนิสิต", "ระดับการศึกษา", "เคยมา Open House", "สถานะ", "ฐานที่ผ่าน", "แนวโน้มใช้พื้นที่ห้องสมุด", "รูปแบบกิจกรรม", "สถานที่จัดกิจกรรม", "ระยะเวลาในการจัดกิจกรรม", "ของรางวัล", "ภาพรวมกิจกรรม", "ฐานที่ชอบที่สุด", "ความประทับใจ/ข้อเสนอแนะ/ติชม", "บริการใหม่ที่นิสิตอยากให้มีในห้องสมุด"];
    STATIONS.forEach((station) => headers.push(station.name, "เวลา", "ความชัดเจน"));
    const rows = [headers.map(csvValue).join(",")];
    Object.keys(globalUsersData).sort().forEach((code) => {
        const user = globalUsersData[code];
        const scans = scansFor(user);
        const passed = passedCount(user);
        const status = user.isRedeemed ? "รับรางวัลแล้ว" : passed === STATION_COUNT ? "ผ่านครบแล้ว" : passed ? "กำลังเล่น" : "ยังไม่เริ่ม";
        const evaluation = user.activityEvaluation;
        const favoriteStation = STATIONS.find(
            (station) => station.id === Number(evaluation?.favoriteStationId),
        );
        const row = [
            code,
            user.registration?.studentId ?? "",
            ({ bachelor: "ปริญญาตรี", master: "ปริญญาโท", doctorate: "ปริญญาเอก" })[user.registration?.educationLevel] ?? "",
            user.registration ? user.registration.hasVisitedOpenHouse ? "เคย" : "ไม่เคย" : "",
            status,
            `${passed}/${STATION_COUNT}`,
            user.finalIntentionRating ?? "",
            evaluation?.categoryRatings?.activityFormat ?? "",
            evaluation?.categoryRatings?.venue ?? "",
            evaluation?.categoryRatings?.duration ?? "",
            evaluation?.categoryRatings?.reward ?? "",
            evaluation?.categoryRatings?.overall ?? evaluation?.overallSatisfaction ?? "",
            favoriteStation?.name ?? "",
            evaluation?.impressionFeedback ?? evaluation?.suggestion ?? "",
            evaluation?.desiredLibraryServices ?? "",
        ];
        let lastTime = user.loginTime;
        STATIONS.forEach((station) => {
            const scan = scans.find((item) => Number(item.id) === station.id);
            row.push(
                scan ? scan.name : "",
                scan ? getDuration(lastTime, scan.time) : "",
                user.ratings?.[station.id] ?? "",
            );
            if (scan) lastTime = scan.time;
        });
        rows.push(row.map(csvValue).join(","));
    });
    const url = URL.createObjectURL(new Blob(["\uFEFF", rows.join("\n")], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `OpenHouse_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

function formatTime(ms) {
    return ms ? new Date(ms).toLocaleTimeString("th-TH") : "-";
}

function getDuration(startMs, endMs) {
    if (!startMs || !endMs || startMs > endMs) return "";
    const seconds = Math.floor((endMs - startMs) / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes ? `${minutes} นาที ${seconds % 60} วิ` : `${seconds} วินาที`;
}

function openModal(code) {
    const user = globalUsersData[code];
    document.getElementById("historyModal").style.display = "flex";
    document.getElementById("modalUserCode").textContent =
        `รหัส Stamp Card: ${code} · รหัสนิสิต: ${user.registration?.studentId ?? "-"}`;
    const items = [];
    let lastTime = user.loginTime;
    if (lastTime) items.push(`<li><b>เข้าสู่ระบบ</b> <span class="timeline-time">${formatTime(lastTime)}</span></li>`);
    scansFor(user).forEach((scan) => {
        items.push(`<li><b>ฐาน: ${escapeHtml(scan.name)}</b> <span class="timeline-time">${formatTime(scan.time)}</span><br><span class="duration-box">ใช้เวลา ${getDuration(lastTime, scan.time) || "-"}</span></li>`);
        lastTime = scan.time;
    });
    if (user.activityEvaluation) {
        const favorite = STATIONS.find(
            (station) => station.id === Number(user.activityEvaluation.favoriteStationId),
        );
        const categories = user.activityEvaluation.categoryRatings;
        const overall = evaluationScore(categories?.overall ?? user.activityEvaluation.overallSatisfaction);
        const feedback = user.activityEvaluation.impressionFeedback ?? user.activityEvaluation.suggestion ?? "-";
        const desiredServices = user.activityEvaluation.desiredLibraryServices ?? "-";
        const categorySummary = categories
            ? `รูปแบบกิจกรรม ${evaluationScore(categories.activityFormat)}/5 · สถานที่ ${evaluationScore(categories.venue)}/5 · ระยะเวลา ${evaluationScore(categories.duration)}/5 · ของรางวัล ${evaluationScore(categories.reward)}/5 · ภาพรวม ${overall}/5`
            : `ภาพรวมกิจกรรม ${overall}/5`;
        items.push(`<li><b>ประเมินความพึงพอใจในกิจกรรม Chula Open House 2026</b> <span class="timeline-time">${formatTime(user.activityEvaluation.submittedAt)}</span><br><span class="duration-box">${categorySummary} · ชอบที่สุด ${escapeHtml(favorite?.name ?? "-")}</span><p><b>ความประทับใจ/ข้อเสนอแนะ/ติชม:</b> ${escapeHtml(feedback)}</p><p><b>บริการใหม่ที่อยากให้ห้องสมุดมี:</b> ${escapeHtml(desiredServices)}</p></li>`);
    }
    if (user.finalIntentionRating) {
        items.push(`<li><b>แนวโน้มใช้พื้นที่ห้องสมุด</b> <span class="duration-box">${user.finalIntentionRating}/5</span></li>`);
    }
    if (user.isRedeemed) items.push(`<li><b>แลกรางวัล</b> <span class="timeline-time">${formatTime(user.redeemTime)}</span></li>`);
    document.getElementById("timelineContent").innerHTML =
        items.join("") || "<li>ยังไม่มีประวัติการเล่น</li>";
}

function closeModal() {
    document.getElementById("historyModal").style.display = "none";
}

loadUsers();
