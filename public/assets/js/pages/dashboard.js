"use strict";

const DASHBOARD_CONFIG = window.OpenHouseConfig;
const DASHBOARD_API = window.OpenHouseApi;
const DASHBOARD_STATIONS = DASHBOARD_CONFIG.stations;
const DASHBOARD_STATION_COUNT = DASHBOARD_STATIONS.length;
const CHART_COLORS = ["#5b5bd6", "#22a06b", "#f59e0b", "#e0528d", "#38a3db", "#8b5cf6", "#ef6351"];
const SECTION_TITLES = {
    overview: "ภาพรวม",
    education: "ระดับการศึกษา",
    attendance: "ประวัติการเข้าร่วม",
    progress: "ความคืบหน้า",
    evaluation: "ผลประเมินกิจกรรม",
    stations: "ข้อมูลรายฐาน",
    feedback: "ความคิดเห็น",
};
let dashboardUsers = {};

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function stationValues(user) {
    return Array.isArray(user.stations) ? user.stations : Object.values(user.stations ?? {});
}

function passedCount(user) {
    return stationValues(user).filter((value) => value === true).length;
}

function registeredEntries() {
    return Object.entries(dashboardUsers).filter(([, user]) => user.registration?.studentId);
}

function makeDistribution(items, keyFunction, definitions) {
    const counts = Object.fromEntries(definitions.map((item) => [item.key, 0]));
    items.forEach((item) => {
        const key = keyFunction(item);
        if (key in counts) counts[key] += 1;
    });
    return definitions.map((item, index) => ({ ...item, value: counts[item.key], color: item.color ?? CHART_COLORS[index % CHART_COLORS.length] }));
}

function renderBars(targetId, data, options = {}) {
    const target = document.getElementById(targetId);
    const maximum = options.maximum ?? Math.max(...data.map((item) => Number(item.value) || 0), 1);
    const total = options.total ?? data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
    target.innerHTML = `<div class="bar-list">${data.map((item) => {
        const value = Number(item.value) || 0;
        const width = Math.max(0, Math.min(100, maximum ? (value / maximum) * 100 : 0));
        const displayValue = item.displayValue ?? (options.asPercent ? `${Math.round(width)}%` : `${value}${options.suffix ?? ""}`);
        const detail = item.detail ?? (total ? `${Math.round((value / total) * 100)}%` : "0%");
        return `<div class="bar-row"><span class="bar-label">${escapeHtml(item.label)}</span><div class="bar-track" title="${escapeHtml(detail)}"><div class="bar-fill" style="width:${width}%;--bar-color:${item.color}"></div></div><span class="bar-value">${escapeHtml(displayValue)}</span></div>`;
    }).join("")}</div>`;
}

function renderDistribution(targetId, data) {
    const target = document.getElementById(targetId);
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let position = 0;
    const stops = data.flatMap((item) => {
        const start = position;
        position += total ? (item.value / total) * 100 : 0;
        return [`${item.color} ${start}%`, `${item.color} ${position}%`];
    }).join(",");
    target.innerHTML = `<div class="chart-layout"><div class="donut" style="background:conic-gradient(${stops || "#e5e7eb 0 100%"})" aria-label="ทั้งหมด ${total} คน"></div><div id="${targetId}-bars"></div></div>`;
    renderBars(`${targetId}-bars`, data, { total });
}

function activityEvaluation(user) {
    return user.activityEvaluation ?? null;
}

function exclusiveProgress(user) {
    if (user.isRedeemed) return "redeemed";
    if (activityEvaluation(user)) return "evaluated";
    const passed = passedCount(user);
    if (passed === DASHBOARD_STATION_COUNT) return "completed";
    if (passed > 0) return "playing";
    return "notStarted";
}

function renderKpis(entries) {
    const completed = entries.filter(([, user]) => passedCount(user) === DASHBOARD_STATION_COUNT).length;
    const evaluated = entries.filter(([, user]) => activityEvaluation(user)).length;
    const redeemed = entries.filter(([, user]) => user.isRedeemed).length;
    const averagePassed = entries.length
        ? entries.reduce((sum, [, user]) => sum + passedCount(user), 0) / entries.length
        : 0;
    const cards = [
        ["ผู้ลงทะเบียน", entries.length, "คน"],
        ["ผ่านครบทุกฐาน", completed, `${entries.length ? Math.round(completed / entries.length * 100) : 0}% ของผู้ลงทะเบียน`],
        ["ส่งแบบประเมิน", evaluated, `${entries.length ? Math.round(evaluated / entries.length * 100) : 0}% ของผู้ลงทะเบียน`],
        ["รับของรางวัลแล้ว", redeemed, `${entries.length ? Math.round(redeemed / entries.length * 100) : 0}% ของผู้ลงทะเบียน`],
        ["ฐานที่ผ่านเฉลี่ย", averagePassed.toFixed(1), `จาก ${DASHBOARD_STATION_COUNT} ฐาน`],
    ];
    document.getElementById("overviewKpis").innerHTML = cards.map(([label, value, detail]) => `<article class="kpi-card"><p>${label}</p><strong>${value}</strong><small>${detail}</small></article>`).join("");
}

function renderDashboard() {
    const entries = registeredEntries();
    renderKpis(entries);

    const education = makeDistribution(entries, ([, user]) => user.registration.educationLevel, [
        { key: "bachelor", label: "ปริญญาตรี", color: "#5b5bd6" },
        { key: "master", label: "ปริญญาโท", color: "#22a06b" },
        { key: "doctorate", label: "ปริญญาเอก", color: "#f59e0b" },
    ]);
    const attendance = makeDistribution(entries, ([, user]) => user.registration.hasVisitedOpenHouse ? "yes" : "no", [
        { key: "yes", label: "เคยเข้าร่วม", color: "#8b5cf6" },
        { key: "no", label: "ไม่เคยเข้าร่วม", color: "#38a3db" },
    ]);
    renderDistribution("overviewEducation", education);
    renderDistribution("educationChart", education);
    renderDistribution("overviewAttendance", attendance);
    renderDistribution("attendanceChart", attendance);

    const progress = makeDistribution(entries, ([, user]) => exclusiveProgress(user), [
        { key: "notStarted", label: "ลงทะเบียนแล้ว ยังไม่เริ่ม", color: "#94a3b8" },
        { key: "playing", label: "กำลังเล่น", color: "#38a3db" },
        { key: "completed", label: "ผ่านครบ รอประเมิน", color: "#f59e0b" },
        { key: "evaluated", label: "ประเมินแล้ว รอรับรางวัล", color: "#8b5cf6" },
        { key: "redeemed", label: "รับรางวัลแล้ว", color: "#22a06b" },
    ]);
    renderDistribution("progressChart", progress);

    const evaluationEntries = entries.filter(([, user]) => activityEvaluation(user));
    const criteria = [
        ["activityFormat", "รูปแบบกิจกรรม"], ["venue", "สถานที่จัดกิจกรรม"],
        ["duration", "ระยะเวลาในการจัดกิจกรรม"], ["reward", "ของรางวัล"], ["overall", "ภาพรวมกิจกรรม"],
    ].map(([key, label], index) => {
        const values = evaluationEntries.map(([, user]) => {
            const evaluation = activityEvaluation(user);
            return Number(evaluation.categoryRatings?.[key] ?? (key === "overall" ? evaluation.overallSatisfaction : 0));
        }).filter((value) => value >= 1 && value <= 5);
        const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
        return { label, value: average, displayValue: values.length ? `${average.toFixed(2)}/5` : "-", color: CHART_COLORS[index] };
    });
    renderBars("evaluationChart", criteria, { maximum: 5 });

    const favorites = DASHBOARD_STATIONS.map((station, index) => ({
        label: station.name,
        value: evaluationEntries.filter(([, user]) => Number(activityEvaluation(user).favoriteStationId) === station.id).length,
        color: CHART_COLORS[index % CHART_COLORS.length],
    }));
    renderBars("favoriteChart", favorites);

    const stationCompletion = DASHBOARD_STATIONS.map((station, index) => {
        const completedCount = entries.filter(([, user]) => stationValues(user)[station.id] === true).length;
        const percent = entries.length ? completedCount / entries.length * 100 : 0;
        return { label: station.name, value: percent, displayValue: `${Math.round(percent)}%`, detail: `${completedCount} คน`, color: CHART_COLORS[index % CHART_COLORS.length] };
    });
    renderBars("stationCompletionChart", stationCompletion, { maximum: 100 });

    const stationRatings = DASHBOARD_STATIONS.map((station, index) => {
        const values = entries.map(([, user]) => Number(user.ratings?.[station.id] ?? 0)).filter((value) => value >= 1 && value <= 5);
        const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
        return { label: station.name, value: average, displayValue: values.length ? `${average.toFixed(2)}/5` : "-", detail: `${values.length} คำตอบ`, color: CHART_COLORS[index % CHART_COLORS.length] };
    });
    renderBars("stationRatingChart", stationRatings, { maximum: 5 });

    renderResponses("feedbackList", evaluationEntries, (evaluation) => evaluation.impressionFeedback ?? evaluation.suggestion);
    renderResponses("servicesList", evaluationEntries, (evaluation) => evaluation.desiredLibraryServices);
}

function renderResponses(targetId, entries, valueFunction) {
    const responses = entries.map(([code, user]) => ({ code, value: String(valueFunction(activityEvaluation(user)) ?? "").trim(), time: activityEvaluation(user).submittedAt ?? 0 }))
        .filter((item) => item.value).sort((a, b) => b.time - a.time);
    document.getElementById(targetId).innerHTML = responses.length
        ? responses.map((item) => `<article class="response-item"><p>${escapeHtml(item.value)}</p><small>รหัส Stamp Card ${escapeHtml(item.code)}${item.time ? ` · ${new Date(item.time).toLocaleString("th-TH")}` : ""}</small></article>`).join("")
        : '<div class="empty-state">ยังไม่มีคำตอบในหัวข้อนี้</div>';
}

function openSection(sectionId) {
    document.querySelectorAll(".dashboard-section").forEach((section) => section.classList.toggle("active", section.id === `section-${sectionId}`));
    document.querySelectorAll(".nav-item").forEach((button) => button.classList.toggle("active", button.dataset.section === sectionId));
    document.getElementById("pageTitle").textContent = SECTION_TITLES[sectionId] ?? SECTION_TITLES.overview;
}

async function loadDashboard() {
    const refreshButton = document.getElementById("refreshDashboard");
    const errorBanner = document.getElementById("dashboardError");
    refreshButton.disabled = true;
    errorBanner.classList.add("hidden");
    try {
        const { users } = await DASHBOARD_API.admin.getUsers();
        dashboardUsers = users ?? {};
        renderDashboard();
        document.getElementById("lastUpdated").textContent = `อัปเดตล่าสุด ${new Date().toLocaleString("th-TH")} · แสดงเฉพาะผู้ลงทะเบียน`;
    } catch (error) {
        errorBanner.textContent = "โหลดข้อมูลจาก Firebase ไม่สำเร็จ กรุณาตรวจสอบการเชื่อมต่อแล้วลองอีกครั้ง";
        errorBanner.classList.remove("hidden");
    } finally {
        refreshButton.disabled = false;
    }
}

document.querySelectorAll(".nav-item").forEach((button) => button.addEventListener("click", () => openSection(button.dataset.section)));
document.getElementById("refreshDashboard").addEventListener("click", loadDashboard);
loadDashboard();
