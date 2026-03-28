// URL Web App Google Apps Script Anda
const API_URL =
  "https://script.google.com/macros/s/AKfycbyzPpRyrz4HX1nDG0GCP_PMTwi49XTTN2nkXCdhQoZP4bKcCZgPPy_2fvHJ9nndSljn/exec";

// VERSI FINAL: Target waktu sebenarnya (Rabu, 10 Februari 2027, 00:00:01 WIB)
const countDownDate = new Date("Feb 10, 2027 00:00:01").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const statusText = document.getElementById("status-text");
const countdownContainer = document.getElementById("countdown-container");
const resultContainer = document.getElementById("result-container");
const driveLink = document.getElementById("drive-link");

const modal = document.getElementById("pesan-modal");
const infoBtn = document.getElementById("info-btn");
const closeModalBtn = document.getElementById("close-modal");
const detailedMessageEl = document.getElementById("detailed-message");
const sandiEl = document.getElementById("sandi-text");

// Logika Modal
infoBtn.addEventListener("click", () => {
  modal.classList.remove("hidden-modal");
});
closeModalBtn.addEventListener("click", () => {
  modal.classList.add("hidden-modal");
});
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden-modal");
  }
});

// Logika Hitung Mundur
let x = setInterval(function () {
  let now = new Date().getTime();
  let distance = countDownDate - now;

  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  daysEl.innerHTML =
    days < 10 && days >= 0 ? "0" + Math.max(0, days) : Math.max(0, days);
  hoursEl.innerHTML =
    hours < 10 && hours >= 0 ? "0" + Math.max(0, hours) : Math.max(0, hours);
  minutesEl.innerHTML =
    minutes < 10 && minutes >= 0
      ? "0" + Math.max(0, minutes)
      : Math.max(0, minutes);
  secondsEl.innerHTML =
    seconds < 10 && seconds >= 0
      ? "0" + Math.max(0, seconds)
      : Math.max(0, seconds);

  if (distance <= 0) {
    clearInterval(x);
    statusText.innerHTML = "Memverifikasi brankas kenangan...";
    statusText.style.color = "#f1c40f";

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "terbuka") {
          document.body.classList.replace("bg-awal", "bg-akhir");
          countdownContainer.classList.add("hidden");

          // Masukkan data ke Modal
          detailedMessageEl.innerText = data.pesan;
          sandiEl.innerText = data.sandi;

          // UX Tap-to-Copy
          sandiEl.addEventListener("click", function () {
            const teksSandi = this.innerText;
            if (teksSandi === "Tersalin!") return;

            navigator.clipboard
              .writeText(teksSandi)
              .then(() => {
                this.innerText = "Tersalin!";
                this.style.backgroundColor = "#27ae60";
                this.style.color = "#ffffff";

                setTimeout(() => {
                  this.innerText = data.sandi;
                  this.style.backgroundColor = "#2c3e50";
                  this.style.color = "#f1c40f";
                }, 2000);
              })
              .catch((err) => {
                console.error("Gagal menyalin: ", err);
                alert(
                  "Browser tidak mendukung auto-copy. Silakan salin manual.",
                );
              });
          });

          driveLink.href = data.link;
          driveLink.classList.remove("hidden");
          resultContainer.classList.remove("hidden");
        } else {
          statusText.innerHTML = "AKSES DITOLAK: <br>" + data.pesan;
          statusText.style.color = "#e74c3c";
        }
      })
      .catch((error) => {
        statusText.innerHTML = "Koneksi brankas gagal. Refresh halaman.";
        statusText.style.color = "#e74c3c";
        console.error("Fetch Error:", error);
      });
  }
}, 1000);
