export interface Scenario {
  id: number;
  title: string;
  level: "Dasar" | "Menengah" | "Lanjut" | "Deteksi Fraud";
  akad: string;
  roles: string[];
  checklist: string[];
  nasabahContext: string;
  karakterNasabah: string;
  document?: {
    type: string;
    title: string;
    noDoc: string;
    nama: string;
    detail: string;
    errorSubtle: string; // Hal yang salah jika scenario fraud
  };
}

export const SCENARIOS: Scenario[] = [
  {
    id: 1,
    title: "Membuka Rekening Tabungan Syariah",
    level: "Dasar",
    akad: "Wadiah/Mudharabah",
    roles: ["Customer Service Syariah", "Teller Syariah"],
    checklist: [
      "Sambut nasabah dengan salam islami (salam, senyum, sapa)",
      "Tanyakan kebutuhan pembukaan rekening",
      "Jelaskan pilihan produk tabungan syariah (wadiah vs mudharabah)",
      "Minta KTP dan kartu identitas nasabah",
      "Verifikasi kelengkapan data diri nasabah",
      "Jelaskan secara eksplisit jenis akad yang dipilih nasabah",
      "Proses pendaftaran rekening di sistem",
      "Berikan buku tabungan / kartu ATM serta ucapkan terima kasih"
    ],
    nasabahContext: "Nasabah ingin membuka rekening tabungan pertamanya di bank syariah untuk menyimpan uang belanja bulanan agar lebih berkah.",
    karakterNasabah: "Ibu rumah tangga berusia 35 tahun, ramah, baru pertama kali mengunjungi bank syariah, dan merasa sedikit bingung dengan beda wadiah dan mudharabah."
  },
  {
    id: 2,
    title: "Setoran Tunai",
    level: "Dasar",
    akad: "Titipan (Wadiah) / Mudharabah",
    roles: ["Teller Syariah"],
    checklist: [
      "Sambut nasabah dengan salam islami hangat",
      "Minta slip setoran dan buku tabungan / nomor rekening",
      "Verifikasi identitas pemilik rekening",
      "Terima dan hitung uang tunai di depan nasabah",
      "Konfirmasi kecocokan nominal antara uang fisik dan slip",
      "Proses setoran ke dalam sistem",
      "Cetak slip bukti setoran dan bubuhkan tanda tangan/validasi",
      "Serahkan kembali buku tabungan dan salinan bukti setoran ke nasabah"
    ],
    nasabahContext: "Nasabah ingin menyetorkan hasil penjualan harian warungnya sebesar Rp4.500.000 ke rekening tabungannya.",
    karakterNasabah: "Pedagang pasar tradisional, ramah, terburu-buru karena harus kembali ke toko, ingin pelayanan cepat tapi tetap akurat."
  },
  {
    id: 3,
    title: "Penarikan Tabungan",
    level: "Dasar",
    akad: "-",
    roles: ["Teller Syariah"],
    checklist: [
      "Sambut nasabah dengan sopan dan salam",
      "Minta buku tabungan, kartu ATM, dan KTP nasabah",
      "Verifikasi identitas dan cek pindaian tanda tangan di sistem",
      "Cek saldo minimal mencukupi untuk penarikan",
      "Konfirmasi nominal penarikan kepada nasabah",
      "Hitung uang menggunakan mesin hitung atau manual di depan nasabah",
      "Minta tanda tangan nasabah pada slip penarikan",
      "Serahkan uang tunai beserta buku tabungan dan bukti transaksi"
    ],
    nasabahContext: "Nasabah ingin menarik uang tabungannya tunai sebanyak Rp750.000 untuk kebutuhan berobat istrinya.",
    karakterNasabah: "Bapak pensiunan berusia 65 tahun, sangat teliti, banyak bertanya untuk memastikan saldonya tidak berkurang salah, bercakap pelan."
  },
  {
    id: 4,
    title: "Transfer Antar Rekening",
    level: "Dasar",
    akad: "-",
    roles: ["Teller Syariah", "Customer Service Syariah"],
    checklist: [
      "Sampaikan salam pembuka islami",
      "Minta kartu identitas dan nomor rekening pengirim",
      "Tanyakan nomor rekening tujuan transfer dan bank tujuan",
      "Konfirmasi nama pemilik rekening tujuan agar tidak salah kirim",
      "Konfirmasi nominal yang akan ditransfer",
      "Proses pemindahbukuan di sistem",
      "Beri cetakan struk transfer sebagai bukti sah"
    ],
    nasabahContext: "Siswa ingin mentransfer uang bulanan kuliah adiknya sebesar Rp1.200.000 sesama rekening Bank Syariah.",
    karakterNasabah: "Anak kuliah semester akhir yang ramah, sopan, sedikit stres karena sedang mengurus skripsi, ingin transaksi lancar."
  },
  {
    id: 5,
    title: "Aktivasi Mobile Banking",
    level: "Dasar",
    akad: "-",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Sambut dengan salam hangat",
      "Minta nomor rekening, KTP, dan ponsel dengan SIM card aktif",
      "Verifikasi identitas nasabah secara ketat",
      "Jelaskan fitur-fitur utama dan kemudahan transaksi syariah di aplikasi",
      "Bantu proses instalasi dan registrasi mobile banking",
      "Pandu pembuatan PIN dan password yang aman",
      "Aktifkan layanan dan lakukan transaksi uji coba (misal cek saldo)",
      "Edukasi nasabah mengenai keamanan (jangan bagikan OTP/PIN/password)"
    ],
    nasabahContext: "Nasabah baru membeli smartphone Android baru dan ingin mengaktifkan layanan mobile banking agar bisa bayar zakat dan beli pulsa dari rumah.",
    karakterNasabah: "Ibu muda melek digital usia 28 tahun, penuh semangat, banyak bertanya tentang fitur-fitur teknis dan jaminan keamanan data."
  },
  {
    id: 6,
    title: "Membuka Tabungan Haji",
    level: "Menengah",
    akad: "Mudharabah Mutlaqah",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Berikan salam islami terbaik",
      "Identifikasi niat dan tujuan membuka tabungan haji",
      "Jelaskan keistimewaan program tabungan haji syariah",
      "Terangkan prinsip akad Mudharabah Mutlaqah dan porsi bagi hasil (nisbah)",
      "Estimasi target biaya haji saat ini dan simulasikan masa menabung bulanan",
      "Jelaskan batas setoran minimal pertama dan setoran rutin berikutnya",
      "Minta KTP dan proses pembukaan rekening haji di sistem"
    ],
    nasabahContext: "Nasabah memiliki impian besar menunaikan ibadah haji bersama istri dan ingin mulai menabung rutin bulanan dari sekarang agar bisa mendapat nomor porsi.",
    karakterNasabah: "Bapak karyawan swasta berusia 45 tahun, religius, bertekad kuat naik haji dalam 5 tahun, sangat menghargai penjelasan tentang kesucian dana haji."
  },
  {
    id: 7,
    title: "Tabungan Pendidikan Anak",
    level: "Menengah",
    akad: "Mudharabah",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Sapa nasabah dengan hangat dan bersahabat",
      "Identifikasi kebutuhan dan target waktu dana pendidikan anak",
      "Rekomendasikan produk tabungan pendidikan berencana",
      "Jelaskan skema akad Mudharabah dan bagi hasil serta jaminan asuransi syariah",
      "Jelaskan manfaat proteksi dan risiko pemutusan tabungan sebelum jatuh tempo",
      "Proses pengajuan rekening dan setoran otomatis bulanan (autodebet)"
    ],
    nasabahContext: "Nasabah ingin menyiapkan dana pendidikan terbaik untuk anaknya yang baru lahir agar masa depan pendidikannya terjamin tanpa terjerat riba.",
    karakterNasabah: "Pasangan suami istri muda, terlihat cerdas dan terencana, sangat detail mengenai proyeksi bagi hasil dan jaminan bebas riba."
  },
  {
    id: 8,
    title: "Rekening Anak / Junior",
    level: "Dasar",
    akad: "Wadiah",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Sambut ceria nasabah anak dan orang tuanya",
      "Minta KTP orang tua dan Akta Kelahiran / Kartu Identitas Anak (KIA) asli",
      "Jelaskan fitur menarik tabungan anak tanpa biaya administrasi bulanan",
      "Jelaskan konsep akad Wadiah (titipan murni tanpa janji imbalan kecuali bonus sukarela)",
      "Bantu pengisian formulir pembukaan rekening oleh orang tua sebagai wali",
      "Terima setoran awal minimal Rp20.000",
      "Cetak buku tabungan berdesain kartun khusus anak"
    ],
    nasabahContext: "Seorang ibu ingin mengajarkan anaknya yang berusia 8 tahun untuk rajin menabung sejak dini dengan tabungan atas namanya sendiri.",
    karakterNasabah: "Ibu membawa anak perempuan kelas 3 SD yang agak pemalu tapi bersemangat memegang celengan yang ingin disetorkan."
  },
  {
    id: 9,
    title: "Rekening UMKM / Usaha",
    level: "Menengah",
    akad: "Wadiah / Mudharabah",
    roles: ["Customer Service Syariah", "Account Officer"],
    checklist: [
      "Sampaikan salam formal korporat syariah",
      "Minta dokumen legalitas usaha (NIB, SIUP, Akta Pendirian, NPWP Usaha)",
      "Identifikasi omset rata-rata dan jenis usaha UMKM nasabah",
      "Rekomendasikan produk Tabungan Bisnis Syariah yang bebas biaya transfer massal",
      "Jelaskan akad yang digunakan serta kemudahan integrasi QRIS Mesin EDC",
      "Proses pembukaan rekening giro atau tabungan badan usaha"
    ],
    nasabahContext: "Pemilik usaha warung makan prasmanan yang omsetnya semakin naik ingin memisahkan rekening pribadi dengan rekening bisnisnya untuk kemudahan audit.",
    karakterNasabah: "Pemilik warung makan usia 30 tahun, ulet, baru melek administrasi keuangan, ingin beralih menerima pembayaran cashless/QRIS syariah."
  },
  {
    id: 10,
    title: "Deposito Syariah",
    level: "Menengah",
    akad: "Mudharabah",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Sambut nasabah dengan penuh hormat",
      "Tanyakan ketersediaan dana dan durasi investasi yang diinginkan",
      "Jelaskan produk Investasi Deposito Mudharabah",
      "Terangkan pembagian keuntungan berdasarkan nisbah bagi hasil, bukan suku bunga tetap",
      "Tawarkan pilihan jangka waktu (tenor) 1, 3, 6, atau 12 bulan",
      "Jelaskan perbedaan mendasar deposito syariah dengan deposito konvensional (bebas bunga)",
      "Proses pembukaan sertifikat deposito berjangka syariah"
    ],
    nasabahContext: "Nasabah baru saja mendapat bonus tahunan kerja sebesar Rp50.000.000 dan ingin menginvestasikannya di tempat yang aman dan halal tanpa unsur riba.",
    karakterNasabah: "Pengusaha properti mini berusia 50 tahun, berpenampilan rapi, teliti membandingkan porsi nisbah, dan mengharapkan ketenangan batin dalam berinvestasi."
  },
  {
    id: 11,
    title: "Kartu ATM Hilang",
    level: "Dasar",
    akad: "-",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Tenangkan nasabah dan salami dengan ramah",
      "Lakukan verifikasi identitas secara ketat (nama ibu kandung, saldo terakhir, transaksi terakhir)",
      "Lakukan online blocking kartu ATM lama di sistem untuk mencegah penyalahgunaan",
      "Mintalah dokumen surat kehilangan (jika ada) dan KTP",
      "Bantu isi Formulir Penggantian Kartu ATM",
      "Buat dan serahkan kartu ATM baru, pandu setup PIN baru di mesin PINpad",
      "Sampaikan info biaya admin penggantian kartu (jika ada)"
    ],
    nasabahContext: "Nasabah panik karena dompetnya jatuh di area kampus tadi pagi dan di dalamnya berisi kartu debit ATM penting miliknya.",
    karakterNasabah: "Mahasiswa berusia 20 tahun, terlihat panik, ketakutan saldonya dibobol orang, berbicara terengah-engah."
  },
  {
    id: 12,
    title: "Reset PIN / Lupa PIN",
    level: "Dasar",
    akad: "-",
    roles: ["Customer Service Syariah"],
    checklist: [
      "Sapa nasabah dengan lembut",
      "Dengar keluhan lupa PIN dengan sabar",
      "Verifikasi identitas nasabah secara mendalam (KTP, Buku Tabungan, pertanyaan konfirmasi)",
      "Bantu pengisian formulir reset PIN",
      "Lakukan reset PIN di sistem dan pandu nasabah memasukkan 6 digit PIN baru",
      "Ucapkan pesan keamanan untuk tidak memakai tanggal lahir sebagai PIN"
    ],
    nasabahContext: "Nasabah lansia salah memasukkan PIN sebanyak 3 kali di mesin ATM sehingga kartunya terblokir, ingin membuka blokir agar bisa mengambil uang pensiun.",
    karakterNasabah: "Bapak pensiunan berusia 65 tahun, butuh bimbingan berulang-ulang dengan kesabaran ekstra tinggi karena kurang mengerti gadget modern."
  },
  {
    id: 13,
    title: "Konsultasi Investasi Syariah",
    level: "Lanjut",
    akad: "Mudharabah / Musyarakah / Sukuk",
    roles: ["Account Officer", "Customer Service Syariah"],
    checklist: [
      "Berikan salam profesional dan sambutan hangat",
      "Lakukan asesmen profil risiko nasabah (konservatif, moderat, agresif)",
      "Jelaskan portofolio investasi syariah: Deposito, Reksa Dana Syariah, Sukuk Negara",
      "Jelaskan prinsip bagi hasil, fluktuasi pasar, dan mitigasi risikonya",
      "Rekomendasikan alokasi portofolio terbaik sesuai tujuan keuangan nasabah",
      "Secara tegas pastikan bahwa seluruh instrumen bebas dari Riba, Gharar, dan Maysir"
    ],
    nasabahContext: "Seorang profesional muda bergaji tinggi memiliki dana menganggur Rp30.000.000 dan ingin menempatkannya pada instrumen investasi syariah yang halal dan tumbuh maksimal.",
    karakterNasabah: "Karyawan tech company milenial usia 28 tahun, perfeksionis, fasih istilah keuangan umum, kritis bertanya soal underlying asset investasi."
  },
  {
    id: 14,
    title: "Pembiayaan Motor Syariah",
    level: "Lanjut",
    akad: "Murabahah",
    roles: ["Analis Pembiayaan", "Account Officer"],
    checklist: [
      "Sapa hangat nasabah dan tanyakan jenis motor yang diminati",
      "Jelaskan konsep akad Murabahah (jual beli barang dengan menegaskan harga perolehan dan margin keuntungan)",
      "Hitung simulasi margin, harga jual total, DP, dan angsuran bulanan yang tetap hingga lunas",
      "Terangkan perbedaan skema margin syariah dengan sistem bunga kredit konvensional",
      "Lakukan analisis awal kemampuan mencicil (debt service ratio)",
      "Minta dokumen persyaratan: KTP, slip gaji 3 bulan terakhir, dan bukti uang muka (DP)"
    ],
    nasabahContext: "Nasabah ingin mengajukan pembiayaan motor skutik untuk dipakai berangkat kerja harian namun tidak mau menggunakan kredit pembiayaan konvensional berbunga.",
    karakterNasabah: "Karyawan swasta muda usia 28 tahun, jujur, penghasilan pas-pasan tapi stabil, sangat ingin menghindari riba."
  },
  {
    id: 15,
    title: "KPR Syariah",
    level: "Lanjut",
    akad: "Murabahah / Musyarakah Mutanaqisah",
    roles: ["Analis Pembiayaan", "Account Officer"],
    checklist: [
      "Sambutan formal dan tanyakan lokasi rumah impian nasabah",
      "Jelaskan dua opsi akad KPR Syariah: Murabahah atau Musyarakah Mutanaqisah (kongsi penurunan kepemilikan)",
      "Hitung simulasi cicilan fix secara transparan sesuai tenor yang dipilih",
      "Jelaskan batas uang muka minimal dan biaya administrasi di awal",
      "Analisis kelayakan penghasilan dan stabilitas pekerjaan nasabah",
      "Jelaskan pentingnya akad asuransi jiwa & properti syariah (takaful) pendukung pembiayaan"
    ],
    nasabahContext: "Pasangan guru dan PNS baru menikah yang berniat membeli rumah pertama seharga Rp350.000.000 melalui program KPR syariah murni bebas denda komersial.",
    karakterNasabah: "Pasangan muda yang kompak, sangat menghitung detail keuangan jangka panjang, kritis menanyakan tentang sanksi denda keterlambatan (ta'zir)."
  },
  {
    id: 16,
    title: "Pembiayaan Modal Usaha",
    level: "Lanjut",
    akad: "Mudharabah / Musyarakah",
    roles: ["Analis Pembiayaan", "Account Officer"],
    checklist: [
      "Berikan sambutan hangat khas mitra bisnis syariah",
      "Lakukan analisis mendalam mengenai bisnis nasabah (jenis, produk, prospek, lama berjalan)",
      "Rekomendasikan akad bagi hasil yang tepat: Mudharabah (nasabah pengelola penuh) atau Musyarakah (kongsi modal bersama)",
      "Jelaskan skema pembagian keuntungan (nisbah) dan komitmen menanggung kerugian bersama",
      "Minta laporan keuangan sederhana, rekening koran 3 bulan, dan rencana bisnis ekspresi",
      "Tentukan plafon pembiayaan yang realistis bagi keberlangsungan bisnis nasabah"
    ],
    nasabahContext: "Pemilik usaha konveksi pakaian anak membutuhkan tambahan modal kerja sebesar Rp100.000.000 untuk membeli bahan baku sebelum musim lebaran tiba.",
    karakterNasabah: "Ibu pelaku UMKM usia 40 tahun, pekerja keras, ramah, bisnisnya terpercaya, tapi belum rapi dalam membuat pembukuan keuangan bulanan."
  },
  {
    id: 17,
    title: "FRAUD — Identitas Palsu",
    level: "Deteksi Fraud",
    akad: "-",
    roles: ["Auditor Syariah", "Customer Service Syariah"],
    checklist: [
      "Sambutan profesional and perhatikan bahasa tubuh nasabah yang gelisah",
      "Teliti fisik KTP nasabah (keaslian, hologram, kesesuaian jenis font, and ketajaman foto)",
      "Bandingkan tanda tangan di dokumen aplikasi dengan tanda tangan asli di KTP",
      "Tanyakan pertanyaan jebakan verifikasi data (contoh: tanggal lahir, alamat, nama ibu kandung)",
      "Saat menemukan kejanggalan, tahan dokumen dengan sopan dan laporkan secara diam-diam ke Team Leader",
      "JANGAN memproses pembukaan rekening atau penarikan, tetap bersikap tenang"
    ],
    nasabahContext: "Seseorang berniat menarik dana tunai Rp15.000.000 dari rekening orang lain menggunakan surat kuasa dan KTP yang dicurigai palsu (foto KTP tampak tempelan stiker).",
    karakterNasabah: "Pria paruh baya, berpenampilan rapi tapi tampak gugup, sering melihat jam tangan, beralasan buru-buru, dan menghindari kontak mata langsung.",
    document: {
      type: "KTP (Kartu Tanda Penduduk)",
      title: "Kartu Tanda Penduduk Republik Indonesia",
      noDoc: "3171012304850005",
      nama: "Ahmad Junaidi",
      detail: "Alamat: Jl. Melati No. 4, Jakarta Pusat. Kelahiran: Jakarta, 23/04/1985. Foto: Ahmed Jr. (terlihat sedikit blur di bagian wajah dan tepinya tidak rata seperti hasil guntingan)",
      errorSubtle: "Nomor NIK KTP formatnya tidak konsisten dengan kode daerah, dan tanda tangan di bwh foto memiliki bekas tintanya berbayang. Nama Ibu kandung yang diucapkan nasabah berbeda dengan data pendaftaran."
    }
  },
  {
    id: 18,
    title: "FRAUD — Slip Gaji Palsu",
    level: "Deteksi Fraud",
    akad: "Murabahah",
    roles: ["Auditor Syariah", "Analis Pembiayaan"],
    checklist: [
      "Periksa kelengkapan berkas pembiayaan dan berkas slip gaji secara saksama",
      "Cek logo perusahaan, kop surat, dan cap instansi pada slip gaji",
      "Verifikasi konsistensi nominal angka gaji pokok dan potongan pajak NPWP secara logis",
      "Lakukan verifikasi silang langsung dengan menghubungi departemen HRD perusahaan terkait",
      "Bandingkan tingkat gaji yang diajukan dengan standar gaji profil jabatan tersebut di internet",
      "Tolak permohonan pembiayaan secara halus dan buat laporan internal dugaan pemalsuan dokumen keuangan"
    ],
    nasabahContext: "Nasabah mengajukan pembiayaan KPR Syariah Rp200.000.000 dengan melampirkan slip gaji Rp15.000.000 per bulan dari PT Sentosa Abadi yang setelah diperiksa ternyata kop suratnya buram dan format potongannya janggal.",
    karakterNasabah: "Wanita muda usia 25 tahun, berpenampilan mewah, sangat cerewet menanyakan kapan pembiayaan cair, dan menolak saat analis meminta nomor telepon HRD kantor pembantu.",
    document: {
      type: "Slip Gaji Virtual",
      title: "Slip Gaji PT Sentosa Abadi Makmur - Periode Mei 2026",
      noDoc: "EMP/SA/99021",
      nama: "Rani Wijaya",
      detail: "Gaji Pokok: Rp15.000.000. Tunjangan: Rp3.000.000. Potongan PPH21: Rp0 (Janggal untuk gaji di atas PTKP). Cap PT Sentosa Abadi memakai gambar scan warna yang agak pecah.",
      errorSubtle: "Nama perusahaan di kop 'PT Sentosa Abadi Makmur' tetapi di stempel bawah tertulis 'CV Sentosa Abadi'. Tidak ada potongan BPJS atau PPH21 meskipun gajinya besar."
    }
  },
  {
    id: 19,
    title: "FRAUD — Social Engineering",
    level: "Deteksi Fraud",
    akad: "-",
    roles: ["Auditor Syariah", "Customer Service Syariah", "Teller Syariah"],
    checklist: [
      "Tetap bersikap tenang, sopan, namun tegas mematuhi aturan",
      "Jangan terpengaruh atau takut dengan intimidasi nama pimpinan bank yang diucapkan nasabah",
      "Ikuti standar operasional prosedur (SOP) verifikasi data nasabah tanpa pengecualian sedikit pun",
      "Tolak dengan sopan permintaan nasabah yang ingin memby-pass otorisasi dokumen penting",
      "Catat nama pimpinan yang dicatut dan laporkan percobaan social engineering ini ke Kepala Cabang"
    ],
    nasabahContext: "Nasabah mendesak Teller/CS untuk segera melakukan override pemindahan dana sebesar Rp50.000.000 tanpa menggunakan OTP/KTP fisik, mengklaim bahwa ia adalah sahabat karib sang Direktur Utama Bank.",
    karakterNasabah: "Pria berjas mewah, bersuara keras, arogan, menggunakan nama direksi untuk menekan siswa, mudah tersinggung, dan menawarkan uang amplop tips.",
    document: {
      type: "Surat Otorisasi Virtual",
      title: "Surat Rekomendasi Khusus Direktur Operasional",
      noDoc: "DIR-OP/MEMO/025-A",
      nama: "Irwan Hermawan (Mengaku Nasabah Utama)",
      detail: "Memo berisi: 'Harap bantu proses transfer dana instan Bapak Irwan Hermawan sebesar Rp50.000.000 tanpa verifikasi rumit. Tanda tangan Dirut: Bpk. H. Syarifudin'",
      errorSubtle: "Format tanda tangan direktur terlihat scan tempelan digital dari dokumen lain, dan nomor surat tidak menggunakan kode resmi kantor pusat Bank Syariah."
    }
  },
  {
    id: 20,
    title: "FRAUD — Money Laundering",
    level: "Deteksi Fraud",
    akad: "Wadiah",
    roles: ["Auditor Syariah", "Teller Syariah"],
    checklist: [
      "Identifikasi bendera merah (red flag) berupa nominal setoran yang tidak wajar",
      "Terapkan prinsip Know Your Customer (KYC) with menanyakan sumber asal dana secara mendalam",
      "Isi Formulir Laporan Transaksi Keuangan Mencurigakan (LTKM) secara rahasia",
      "Segera laporkan gerakan transaksi mencurigakan ini langsung kepada Kepala Cabang",
      "JANGAN sekali-kali memberitahu (tipping-off) nasabah bahwa dirinya sedang diselidiki/dilaporkan"
    ],
    nasabahContext: "Seorang pemilik warung kelontong kecil ingin menyetor uang tunai ratusan juta rupiah yang dibungkus plastik hitam ke rekening pribadinya, namun beralasan berbelit-belit saat ditanya asal-usul uang tunai tersebut.",
    karakterNasabah: "Pria berusia 32 tahun, mengenakan kaos santai, tampak sangat gelisah dan terus memantau situasi pintu keluar masuk bank, bicaranya tergagap-gagap.",
    document: {
      type: "Formulir Deklarasi Sumber Dana",
      title: "Formulir Deklarasi Setoran Tunai > Rp100.000.000",
      noDoc: "KYC-AML/0821/2026",
      nama: "Subarjo",
      detail: "Nominal Setoran: Rp400.000.000. Sumber Dana Ditulis: 'Hasil Penjualan Warung Kelontong Mingguan'. Usaha: Toko Subarjo (Warung kelontong ukuran 2x3 meter)",
      errorSubtle: "Nominal setoran Rp400 juta sangat tidak logis untuk skala usaha warung kelontong mikro dalam waktu seminggu tanpa pembukuan kas yang jelas."
    }
  }
];
