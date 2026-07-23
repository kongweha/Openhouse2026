let currentLang = 'en';
        const LANG = {
            en: {
                loginTitle: "🔐 Login to System",
                loginBtn: "Login",
                checking: "Checking...",
                cardTitle: "🎉 Stamp Card",
                userIdPrefix: "User ID: ",
                stampStatusText: "Completed: {count} / 7",
                completedText: "🎉 All 7 stations completed!",
                stampSubStatus: "(Click on unstamped circles to scan QR Code)",
                redeemBtn: "🎁 Redeem Reward (Needs 7 stamps)",
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
                    errLength: "Please enter all 6 digits.",
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
                stampStatusText: "ผ่านแล้ว: {count} / 7 ฐาน",
                completedText: "🎉 เล่นครบ 7 ฐานแล้ว!",
                stampSubStatus: "(คลิกที่วงกลมฐานที่ยังไม่ผ่านเพื่อสแกน QR Code)",
                redeemBtn: "🎁 แลกของรางวัล (ต้องครบ 7 ฐาน)",
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
                    errLength: "กรุณากรอกรหัสให้ครบ 6 หลัก",
                    errNotFound: "❌ ไม่พบรหัสนี้ในระบบ",
                    errConn: "เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล",
                    errQrExpire: "❌ QR Code นี้หมดอายุแล้ว\nกรุณาสแกน QR Code ล่าสุด",
                    errQrFormat: "❌ รูปแบบ QR Code ไม่ถูกต้อง",
                    errQrWrong: "❌ QR Code ไม่ถูกต้องสำหรับฐานนี้",
                    errSave: "เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่"
                }
            }
        };

        // รายการการ์ดทั้ง 16 ใบ (สามารถระบุพาธไฟล์รูปภาพการ์ดได้ที่ฟิลد img)
        const DESTINY_CARDS = [
            { id: 1, img: "assets/images/cards/Card_1.webp" },
            { id: 2, img: "assets/images/cards/Card_2.webp" },
            { id: 3, img: "assets/images/cards/Card_3.webp" },
            { id: 4, img: "assets/images/cards/Card_4.webp" },
            { id: 5, img: "assets/images/cards/Card_5.webp" },
            { id: 6, img: "assets/images/cards/Card_6.webp" },
            { id: 7, img: "assets/images/cards/Card_7.webp" },
            { id: 8, img: "assets/images/cards/Card_1.webp" },
            { id: 9, img: "assets/images/cards/Card_1.webp" },
            { id: 10, img: "assets/images/cards/Card_1.webp" },
            { id: 11, img: "assets/images/cards/Card_1.webp" },
            { id: 12, img: "assets/images/cards/Card_1.webp" },
            { id: 13, img: "assets/images/cards/Card_1.webp" },
            { id: 14, img: "assets/images/cards/Card_1.webp" },
            { id: 15, img: "assets/images/cards/Card_1.webp" },
            { id: 16, img: "assets/images/cards/Card_1.webp" }
        ];
const db = window.openHouseDb;
        
        const STATIONS = [
            { id: 0, name: "Library Playground", qr: "QR_STN_01", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/LIBRARY%20PLAYGROUND1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/LIBRARY%20PLAYGROUND2.webp",
              contentEn: "Welcome to the activity and relaxation space! Designed for you to enjoy learning in new ways.",
              contentTh: "ยินดีต้อนรับสู่พื้นที่สำหรับทำกิจกรรมและพักผ่อน! พื้นที่นี้ออกแบบมาเพื่อให้คุณได้สนุกกับการเรียนรู้ในรูปแบบใหม่"
            },
            { id: 1, name: "Discovery Lab", qr: "QR_STN_02", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Discovery%20LAB1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Discovery%20LAB2.webp",
              contentEn: "Discover new ideas at Discovery Lab. We have tools and resources to help you infinitely expand your creativity.",
              contentTh: "ค้นพบไอเดียใหม่ๆ ที่ Discovery Lab เรามีเครื่องมือและทรัพยากรที่พร้อมช่วยให้คุณต่อยอดความคิดสร้างสรรค์ได้ไม่รู้จบ"
            },
            { id: 2, name: "Play Zone", qr: "QR_STN_03", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Play%20ZONE1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Play%20ZONE2.webp",
              contentEn: "Time to relax! This zone lets you unwind from heavy reading with games and interesting activities.",
              contentTh: "ถึงเวลาคลายเครียด! โซนนี้เปิดโอกาสให้คุณผ่อนคลายจากการอ่านหนังสือหนักๆ ด้วยเกมและกิจกรรมที่น่าสนใจมากมาย"
            },
            { id: 3, name: "Perfect Match: TAIC Collections", qr: "QR_STN_04", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Treasure%20corner1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Treasure%20corner2.webp",
              contentEn: "A treasure trove of knowledge! This corner gathers rare books and media you might not know we have.",
              contentTh: "ขุมทรัพย์ความรู้! มุมนี้รวบรวมหนังสือและสื่อหายากที่คุณอาจไม่เคยรู้มาก่อนว่ามีอยู่ในห้องสมุดของเรา"
            },
            { id: 4, name: "Camera Go!", qr: "QR_STN_05", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Media%20studio1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Media%20studio2.webp",
              contentEn: "Spark your creativity with our full-service media studio. Record audio, shoot video, or edit—all here!",
              contentTh: "จุดประกายความเป็นนักสร้างสรรค์กับสตูดิโอสื่อครบวงจร ไม่ว่าจะอัดเสียง ถ่ายวิดีโอ หรือตัดต่อ ก็ทำได้ที่นี่!"
            },
            { id: 5, name: "Joy Tech Station", qr: "QR_STN_06", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/8.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/1145405557.webp",
              contentEn: "Update on new tech trends. Drop by to try out the cutting-edge gadgets we've prepared for you.",
              contentTh: "อัปเดตเทรนด์เทคโนโลยีใหม่ๆ แวะมาทดลองใช้งานอุปกรณ์สุดล้ำที่เราจัดเตรียมไว้ให้คุณสัมผัสด้วยตัวเอง"
            },
            { id: 6, name: "Green Mission", qr: "QR_STN_07", 
              imgUnstamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Safety%20Checkpoint1.webp", 
              imgStamped: "https://cdn.jsdelivr.net/gh/kongweha/Gametest@e1caf09903b8480a94b9baf8497f1d3302eed795/picture/Safety%20Checkpoint2.webp",
              contentEn: "Safety is key. Learn how to maintain public spaces and follow rules for orderliness.",
              contentTh: "ความปลอดภัยคือสิ่งสำคัญ เรียนรู้วิธีการดูแลรักษาพื้นที่ส่วนรวมและการปฏิบัติตามกฎเพื่อความเรียบร้อย"
            }
        ];

        window.addEventListener('load', () => {
            STATIONS.forEach(st => {
                const img1 = new Image(); img1.src = st.imgUnstamped;
                const img2 = new Image(); img2.src = st.imgStamped;
            });
        });

        let currentUserCode = "";
        let html5QrCode;
        let dbRef = null;
        let activeTargetStation = null;
        let isScannerInitializing = false;
        let cancelRequested = false;
        let isProcessingScan = false;
        let isLoggingIn = false;
        let globalUserData = null;
        let pendingRatingStationId = null;
        let pendingRatingStationName = null;
        let selectedRating = 0;
        let finalSelectedRating = 0;
        let currentScreenView = null; 

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
                let pasteData = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '').substring(0, 6);
                for (let i = 0; i < pasteData.length; i++) if (otpInputs[i]) otpInputs[i].value = pasteData[i];
                if (pasteData.length === 6) { otpInputs[5].blur(); login(); }
            });
        });

        async function login() {
            if (isLoggingIn) return; 
            const l = LANG[currentLang];
            let input = Array.from(otpInputs).map(box => box.value).join('');
            if (input.length !== 6) { alert(l.alerts.errLength); return; }
            
            isLoggingIn = true;
            let btn = document.getElementById('btnLogin');
            btn.disabled = true; btn.innerText = l.checking;

            try {
                const snapshot = await db.ref(`users/${input}`).once('value');
                if (snapshot.exists()) {
                    currentUserCode = input;
                    const userData = snapshot.val();
                    currentScreenView = null; 
                    
                    document.getElementById('loginScreen').classList.add('hidden');
                    document.getElementById('stampScreen').classList.remove('hidden');
                    document.getElementById('displayUserCode').innerText = l.userIdPrefix + currentUserCode;
                    
                    if (!userData.loginTime) db.ref(`users/${currentUserCode}/loginTime`).set(Date.now());

                    dbRef = db.ref(`users/${currentUserCode}`);
                    dbRef.on('value', (snap) => {
                        if(snap.exists()) {
                            globalUserData = snap.val();
                            renderUI(globalUserData);
                        }
                    });
                } else alert(l.alerts.errNotFound);
            } catch (error) { alert(l.alerts.errConn); } 
            finally {
                isLoggingIn = false;
                btn.disabled = false;
                btn.innerText = l.loginBtn;
            }
        }

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
            let posMap = {0:0, 1:1, 2:2, 3:3, 4:4, 5:5, 6:6}; 
            
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
                    node.innerHTML = `<img src="${st.imgStamped}" alt="${st.name}">`;
                    node.onclick = () => toggleStationContent(index); 
                } else {
                    node.className = `station-node st-${currentPosClass} unstamped`;
                    node.innerHTML = `<img src="${st.imgUnstamped}" alt="${st.name}"><span>${st.name}</span>`;
                    node.onclick = () => {
                        if(!userData.isRedeemed) openScannerFor(index);
                    };
                }
                mapContainer.appendChild(node);
            });

            document.getElementById('statusText').innerText = count === 7 ? l.completedText : l.stampStatusText.replace('{count}', count);
            
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
                
                btnRedeem.disabled = (count < 7);
                btnRedeem.innerText = (count < 7) ? l.redeemBtn : l.redeemReadyBtn;
                btnRedeem.style.backgroundColor = (count < 7) ? "#fca5a5" : "#f87171";
                
                switchView('stamp');
            }
        }

        function toggleStationContent(stationId, forceOpen = false) {
            const box = document.getElementById('contentBox');
            const l = LANG[currentLang];
            const contentText = currentLang === 'en' ? STATIONS[stationId].contentEn : STATIONS[stationId].contentTh;

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

        function showRatingBox(id, name) {
            const l = LANG[currentLang];
            pendingRatingStationId = id;
            pendingRatingStationName = name;
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

        function submitRating() {
            if (selectedRating === 0 || pendingRatingStationId === null) return;
            const l = LANG[currentLang];
            const btn = document.getElementById('btnSubmitRating');
            btn.disabled = true;

            const targetId = pendingRatingStationId;
            const targetName = pendingRatingStationName;
            const currentRating = selectedRating;

            document.getElementById('ratingBox').classList.add('hidden');
            document.getElementById('mapWrapper').style.display = 'flex';
            toggleStationContent(targetId, true);
            pendingRatingStationId = null;

            try {
                db.ref(`users/${currentUserCode}/stations/${targetId}`).set(true);
                db.ref(`users/${currentUserCode}/ratings/${targetId}`).set(currentRating);
                try {
                    db.ref(`users/${currentUserCode}/scanHistory`).push({ id: targetId, name: targetName, time: Date.now() });
                } catch (historyErr) {}
            } catch(e) {
                console.error("Save Error", e);
            } finally {
                btn.innerText = l.ratingSubmitBtn;
            }
        }

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
                
                const randomId = Math.floor(Math.random() * DESTINY_CARDS.length) + 1;
                
                try {
                    await db.ref(`users/${currentUserCode}/drawnCardId`).set(randomId);
                    showDrawnCard(randomId);
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
                document.getElementById('drawnCardImage').src = card.img;
                document.getElementById('drawResultArea').classList.remove('hidden');
            }
        }

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
                    
                    if (parts.length === 2 && parts[0] === activeTargetStation.qr) {
                        const qrTimestamp = parseInt(parts[1]);
                        const timeDifference = Date.now() - qrTimestamp;
                        
                        if (timeDifference <= 90000 && timeDifference >= -5000) {
                            isProcessingScan = true; 
                            stopScan(); 
                            
                            const targetId = activeTargetStation.id;
                            const targetName = activeTargetStation.name;

                            try {
                                const snap = await db.ref(`users/${currentUserCode}/stations/${targetId}`).once('value');
                                if (!snap.val()) setTimeout(() => showRatingBox(targetId, targetName), 200);
                            } catch (error) {}
                        } else {
                            isProcessingScan = true; 
                            alert(l.alerts.errQrExpire);
                            stopScan(); 
                        }
                    } else if (decodedText.includes(activeTargetStation.qr) && !decodedText.includes('|')) {
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

        function submitFinalAssessment() {
            if (finalSelectedRating === 0) return;
            const btn = document.getElementById('btnSubmitFinal');
            btn.disabled = true;
        
            // บันทึกคะแนนและสถานะลง Firebase
            try {
                db.ref(`users/${currentUserCode}/finalIntentionRating`).set(finalSelectedRating);
                db.ref(`users/${currentUserCode}/redeemTime`).set(Date.now());
                db.ref(`users/${currentUserCode}/isRedeemed`).set(true).then(() => {
                    // ปิด Modal และบังคับเปลี่ยนไปหน้า Reward ทันทีหลังบันทึกเสร็จสิ้น
                    closeFinalAssessment();
                    switchView('reward');
                });
            } catch(e) {
                console.error("Save Error", e);
                closeFinalAssessment();
            } finally {
                btn.disabled = false;
            }
        }

        function logout() {
            try {
                stopScan();
                if(dbRef) { dbRef.off(); dbRef = null; }
                currentUserCode = ""; globalUserData = null;
                currentScreenView = null;
                pendingRatingStationId = null;
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
