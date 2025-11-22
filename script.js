// script.js (Logika Dasar dari TypeScript/JS)

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteInput = document.getElementById('quoteInput');
const timerDisplay = document.getElementById('timer');
const wpmDisplay = document.getElementById('wpm');
const accuracyDisplay = document.getElementById('accuracy');
const restartBtn = document.getElementById('restartBtn');

const testQuotes = [
    "Selamat datang di tes kecepatan mengetik ini. Cobalah untuk mengetik secepat dan seakurat mungkin.",
    "Bunga teratai mekar di pagi hari, menunjukkan keindahan alam yang tak tertandingi.",
    "Programming adalah seni memecahkan masalah dengan logika dan ketelitian. Mari belajar GoLang.",
    "Setiap baris kode adalah kesempatan untuk membuat sesuatu yang baru dan bermanfaat bagi dunia."
];

let startTime;
let timer;
let isTyping = false;
let currentQuote = "";

// --- FUNGSI UTAMA: MEMUAT KUTIPAN ---
function loadQuote() {
    // Pilih kutipan acak
    currentQuote = testQuotes[Math.floor(Math.random() * testQuotes.length)];
    quoteDisplay.innerHTML = "";
    
    // Pecah kutipan menjadi karakter dan masukkan ke dalam span
    currentQuote.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        quoteDisplay.appendChild(charSpan);
    });

    // Reset input dan hasil
    quoteInput.value = "";
    wpmDisplay.innerText = 0;
    accuracyDisplay.innerText = "0%";
    timerDisplay.innerText = 0;
    quoteInput.disabled = false;
    isTyping = false;
}

// --- FUNGSI MENGHITUNG HASIL ---
function calculateResults() {
    const totalWords = currentQuote.split(' ').length;
    const elapsedTimeInMinutes = (new Date() - startTime) / 60000;
    
    // Hitung karakter yang benar
    const spans = quoteDisplay.querySelectorAll('span');
    let correctChars = 0;
    spans.forEach(span => {
        if (span.classList.contains('correct')) {
            correctChars++;
        }
    });

    // Hitung WPM (kata diketik per menit)
    // Asumsi 1 kata = 5 karakter
    const wpm = Math.round((correctChars / 5) / elapsedTimeInMinutes);

    // Hitung Akurasi
    const totalInputChars = quoteInput.value.length;
    const accuracy = totalInputChars > 0 ? Math.round((correctChars / totalInputChars) * 100) : 0;
    
    wpmDisplay.innerText = wpm >= 0 ? wpm : 0;
    accuracyDisplay.innerText = `${accuracy}%`;
}

// --- FUNGSI UTAMA: CEK INPUT USER ---
function checkInput() {
    const inputChars = quoteInput.value.split('');
    const quoteSpans = quoteDisplay.querySelectorAll('span');
    let isFinished = true;

    // Mulai timer jika ini adalah ketikan pertama
    if (!isTyping) {
        startTime = new Date();
        timer = setInterval(() => {
            const timeElapsed = Math.floor((new Date() - startTime) / 1000);
            timerDisplay.innerText = timeElapsed;
            calculateResults(); // Update hasil secara berkala
        }, 1000);
        isTyping = true;
    }

    // Loop untuk validasi karakter
    quoteSpans.forEach((span, index) => {
        const char = inputChars[index];

        if (char == null) {
            // Karakter belum diketik
            span.classList.remove('correct', 'incorrect');
            isFinished = false;
        } else if (char === span.innerText) {
            // Karakter benar
            span.classList.add('correct');
            span.classList.remove('incorrect');
        } else {
            // Karakter salah
            span.classList.add('incorrect');
            span.classList.remove('correct');
            isFinished = false; 
        }
    });

    // Cek apakah tes selesai
    if (isFinished && inputChars.length === currentQuote.length) {
        clearInterval(timer);
        calculateResults();
        quoteInput.disabled = true;
        isTyping = false;
        alert(`Tes Selesai! WPM: ${wpmDisplay.innerText}, Akurasi: ${accuracyDisplay.innerText}`);
    }
}

// --- EVENT LISTENERS ---
quoteInput.addEventListener('input', checkInput);
restartBtn.addEventListener('click', () => {
    clearInterval(timer);
    loadQuote();
});

// Mulai aplikasi saat pertama kali dimuat
loadQuote();
