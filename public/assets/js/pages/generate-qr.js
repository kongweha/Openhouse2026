let qrCodeObj = null;
        let countdownId = null;
        const refreshRate = 90; // 90 วินาที (1 นาที 30 วินาที)
        let timeLeft = 0;

        function generateRandomQR() {
            const baseQR = document.getElementById('stationSelect').value;
            const currentTimestamp = Date.now();
            
            // นำรหัสฐานมาต่อด้วยเครื่องหมาย | และเวลาปัจจุบัน (มิลลิวินาที)
            const dynamicQRText = `${baseQR}|${currentTimestamp}`;

            document.getElementById('qr-text').innerText = `Data: ${baseQR} (อัปเดตล่าสุด)`;
            
            const qrContainer = document.getElementById("qrcode");
            qrContainer.innerHTML = ""; 
            
            qrCodeObj = new QRCode(qrContainer, {
                text: dynamicQRText,
                width: 220,
                height: 220,
                colorDark : "#0f172a",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });
        }

        function updateTimer() {
            if (timeLeft <= 0) {
                generateRandomQR();
                timeLeft = refreshRate;
            }
            
            // แปลงวินาทีเป็นรูปแบบ นาที:วินาที (เช่น 01:30)
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            document.getElementById('timerDisplay').innerText = 
                `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
            timeLeft--;
        }

        function startDynamicQR() {
            document.getElementById('btnStart').style.display = 'none';
            document.getElementById('btnStop').style.display = 'block';
            document.getElementById('stationSelect').disabled = true; 
            
            timeLeft = 0; // บังคับให้สร้างทันทีในรอบแรก
            updateTimer();
            countdownId = setInterval(updateTimer, 1000);
        }

        function stopDynamicQR() {
            document.getElementById('btnStart').style.display = 'block';
            document.getElementById('btnStop').style.display = 'none';
            document.getElementById('stationSelect').disabled = false; 
            
            clearInterval(countdownId);
            document.getElementById('timerDisplay').innerText = "--:--";
            document.getElementById("qrcode").innerHTML = "";
            document.getElementById('qr-text').innerText = "กรุณากดเริ่มเพื่อสร้าง QR Code";
        }

        function stationChanged() {
            stopDynamicQR();
        }
