<div align="center">

# SmartBank Syariah

### Laboratorium Virtual Perbankan Syariah Berbasis AI

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev)

</div>

---

## Deskripsi

**SmartBank Syariah** adalah aplikasi simulasi laboratorium virtual interaktif untuk siswa SMK Perbankan Syariah. Aplikasi ini memungkinkan siswa berlatih menjadi bankir syariah profesional melalui skenario percakapan realistis dengan nasabah virtual yang ditenagai **Google Gemini AI**.

Setiap simulasi dilengkapi dengan **supervisor AI real-time** yang memberikan penilaian instan terhadap prosedur SOP, kepatuhan syariah, dan kualitas komunikasi siswa.

---

## Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| **20 Skenario Simulasi** | Skenario bertingkat dari Dasar, Menengah, Lanjut, hingga Deteksi Fraud |
| **5 Peran Profesional** | Customer Service, Teller, Account Officer, Analis Pembiayaan, Auditor Syariah |
| **Nasabah Virtual AI** | Percakapan natural dengan karakter nasabah unik yang responsif terhadap kualitas layanan |
| **Supervisor Real-Time** | Feedback instan tentang prosedur SOP, istilah syariah, dan gaya komunikasi |
| **Evaluasi Akhir** | Penilaian komprehensif 5 aspek: prosedur, syariah, komunikasi, verifikasi, kecepatan |
| **Mode Ujian** | Simulasi tanpa bantuan SOP & hint untuk pengujian kemampuan sesungguhnya |
| **Dashboard Guru** | Monitoring performa seluruh kelas, skor rata-rata, dan deteksi fraud |
| **Papan Skor** | Leaderboard kompetitif antar siswa |
| **Kamus Akad** | Referensi 5 akad utama syariah (Murabahah, Mudharabah, Musyarakah, Wadiah, Ijarah) |
| **Sistem Badge** | 6 pencapaian yang bisa diraih siswa selama simulasi |

---

## Skenario Simulasi

<details>
<summary><strong>Level Dasar</strong></summary>

| ID | Skenario | Akad | Peran |
|----|----------|------|-------|
| 1 | Membuka Rekening Tabungan Syariah | Wadiah/Mudharabah | CS, Teller |
| 2 | Setoran Tunai | Titipan/Mudharabah | Teller |
| 3 | Penarikan Tabungan | - | Teller |
| 4 | Transfer Antar Rekening | - | CS, Teller |
| 5 | Aktivasi Mobile Banking | - | CS |
| 8 | Rekening Anak / Junior | Wadiah | CS |
| 11 | Kartu ATM Hilang | - | CS |
| 12 | Reset PIN / Lupa PIN | - | CS |

</details>

<details>
<summary><strong>Level Menengah</strong></summary>

| ID | Skenario | Akad | Peran |
|----|----------|------|-------|
| 6 | Membuka Tabungan Haji | Mudharabah Mutlaqah | CS |
| 7 | Tabungan Pendidikan Anak | Mudharabah | CS |
| 9 | Rekening UMKM / Usaha | Wadiah/Mudharabah | CS, AO |
| 10 | Deposito Syariah | Mudharabah | CS |

</details>

<details>
<summary><strong>Level Lanjut</strong></summary>

| ID | Skenario | Akad | Peran |
|----|----------|------|-------|
| 13 | Konsultasi Investasi Syariah | Mudharabah/Musyarakah/Sukuk | AO, CS |
| 14 | Pembiayaan Motor Syariah | Murabahah | Analis, AO |
| 15 | KPR Syariah | Murabahah/Musyarakah Mutanaqisah | Analis, AO |
| 16 | Pembiayaan Modal Usaha | Mudharabah/Musyarakah | Analis, AO |

</details>

<details>
<summary><strong>Deteksi Fraud</strong></summary>

| ID | Skenario | Dokumen | Peran |
|----|----------|---------|-------|
| 17 | Identitas Palsu | KTP Palsu | Auditor, CS |
| 18 | Slip Gaji Palsu | Slip Gaji Virtual | Auditor, Analis |
| 19 | Social Engineering | Surat Otorisasi Virtual | Auditor, CS, Teller |
| 20 | Money Laundering | Formulir Deklarasi Sumber Dana | Auditor, Teller |

</details>

---

## Arsitektur Sistem

```
smartbank-syariah-ai/
├── src/
│   ├── App.tsx          # UI utama (2800+ baris React)
│   ├── scenarios.ts     # 20 definisi skenario simulasi
│   ├── main.tsx         # Entry point React
│   └── index.css        # Tailwind directives
├── server.ts            # Express backend + Gemini AI integration
├── data/                # Runtime session storage
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies & scripts
```

**Alur Kerja:**

```
Siswa memilih skenario
        │
        ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Nasabah Virtual AI  │◄────│  Prompt Gemini Flash  │
│  (Karakter Unik)     │     │  + Skenario Context   │
└─────────┬───────────┘     └──────────────────────┘
          │
          ▼
┌─────────────────────┐     ┌──────────────────────┐
│  Pesan Siswa         │────►│  Supervisor AI Mini   │
│  (Input Teks)        │     │  (Feedback Real-Time) │
└─────────────────────┘     └──────────────────────┘
          │
          ▼
┌─────────────────────┐
│  Evaluasi Akhir      │
│  (5 Aspek Penilaian) │
└─────────────────────┘
```

---

## Technologi

| Komponen | Teknologi |
|----------|-----------|
| Frontend | React 19 + TypeScript 5.8 |
| Styling | Tailwind CSS 4.1 |
| Backend | Express.js + Node.js |
| AI Engine | Google Gemini 3.5 Flash |
| Animasi | Framer Motion (Motion) |
| Icons | Lucide React |
| Build | Vite 6 + esbuild |

---

## Instalasi & Menjalankan

### Prasyarat

- Node.js 18+
- npm atau yarn
- API Key Google Gemini (dari [AI Studio](https://aistudio.google.com/apikey))

### Langkah-langkah

```bash
# 1. Clone repository
git clone https://github.com/ArrafiNurHafiz/smartbank-syariah-ai.git
cd smartbank-syariah-ai

# 2. Install dependencies
npm install

# 3. Konfigurasi environment variable
cp .env.example .env.local
# Edit .env.local dan masukkan GEMINI_API_KEY Anda

# 4. Jalankan aplikasi
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3456`

### Script Tersedia

| Command | Deskripsi |
|---------|-----------|
| `npm run dev` | Jalankan server development |
| `npm run build` | Build untuk production |
| `npm run start` | Jalankan server production |
| `npm run lint` | Type check dengan TypeScript |
| `npm run clean` | Hapus folder build |

---

## Mode Ujian

Siswa dapat beralih antara **Mode Belajar** dan **Mode Ujian**:

| Mode | SOP & Hint | Supervisor Real-Time | Evaluasi |
|------|-----------|---------------------|----------|
| **Belajar** | Aktif | Aktif | Aktif |
| **Ujian** | Nonaktif | Nonaktif | Aktif |

Mode Ujian meniru kondisi ujian nyata di mana siswa harus mengandalkan pemahaman tanpa bantuan.

---

## Sistem Penilaian

Penilaian dilakukan oleh AI berdasarkan 5 aspek:

| Aspek | Bobot | Deskripsi |
|-------|-------|-----------|
| **Prosedur SOP** | 20% | Kelengkapan langkah-langkah standar operasional |
| **Kepatuhan Syariah** | 25% | Penggunaan istilah halal, akad yang tepat, menghindari riba |
| **Komunikasi Layanan** | 20% | Keramahan, salam islami, kesabaran, kejelasan |
| **Verifikasi Data** | 20% | Kehati-hatian mengecek data, KTP, dokumen pendukung |
| **Kecepatan Layanan** | 15% | Kelancaran dan efisiensi alur simulasi |

### Grade

| Grade | Rentang Nilai | Predikat |
|-------|--------------|----------|
| A | 90 - 100 | Sangat Baik |
| B+ | 85 - 89 | Baik Sekali |
| B | 80 - 84 | Baik |
| C+ | 75 - 79 | Cukup Baik |
| C | 70 - 74 | Cukup |
| D | 60 - 69 | Kurang |
| E | < 60 | Sangat Kurang |

---

## Sistem Badge

| Badge | Kondisi |
|-------|---------|
| Bankir Teladan | Nilai akhir simulasi >= 95 |
| Penjaga Syariah | Nilai Kepatuhan Syariah = 100 |
| Mata Elang | Berhasil mendeteksi fraud di Skenario 17-20 |
| Pelayanan Prima | Selesai < 5 menit dengan nilai >= 80 |
| Magang Sejati | Menyelesaikan 3 skenario berbeda |
| Anti Korupsi | Lulus skenario social engineering (Skenario 19) |

---

## Lisensi

Proyek ini dibuat untuk keperluan **Lomba Inovasi Pembelajaran**.

---

<div align="center">

**SmartBank Syariah** - Membentuk Bankir Syariah Masa Depan

</div>
