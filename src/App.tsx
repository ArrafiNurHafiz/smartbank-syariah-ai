import React, { useState, useEffect, useRef } from "react";
import { 
  Building2, Users, BookOpen, GraduationCap, Play, ShieldAlert, BadgeInfo,
  Clock, CheckCircle, AlertTriangle, Send, RefreshCw, Layers, Award,
  Check, FileText, ChevronRight, Eye, ChevronDown, Trophy, VolumeX, Volume2,
  Trash2, BarChart3, HelpCircle, ArrowLeft, ArrowUpRight, Search, Lock, Unlock
} from "lucide-react";
import { SCENARIOS, Scenario } from "./scenarios";
import confetti from "canvas-confetti";

// Avatars for banker & customers (using clean initials for professional branding)
const AVATARS = [
  { emoji: "CS", label: "Aisyah (CS)" },
  { emoji: "TL", label: "Farhan (Teller)" },
  { emoji: "AN", label: "Rania (Analis)" },
  { emoji: "AD", label: "Zulkifli (Auditor)" },
  { emoji: "MI", label: "Syhab (Mitra)" },
  { emoji: "KY", label: "Mutia (Karyawan)" }
];

// Achievements Definitions
interface BadgeDef {
  key: string;
  title: string;
  desc: string;
  icon: string;
  condition: string;
}

const BADGES: BadgeDef[] = [
  { key: "teladan", title: "Bankir Teladan", desc: "Nilai akhir simulasi ≥ 95", icon: "Trophy", condition: "Excellent performance" },
  { key: "penjaga", title: "Penjaga Syariah", desc: "Nilai Kepatuhan Syariah = 100", icon: "Building2", condition: "Sharia compliance master" },
  { key: "mata_elang", title: "Mata Elang", desc: "Berhasil mendeteksi fraud di Skenario 17-20", icon: "Search", condition: "Fraud investigator" },
  { key: "layanan_prima", title: "Pelayanan Prima", desc: "Selesai < 5 menit dengan nilai ≥ 80", icon: "Clock", condition: "Fast & precise service" },
  { key: "magang", title: "Magang Sejati", desc: "Menyelesaikan 3 skenario berbeda", icon: "BookOpen", condition: "Multi-scenario completed" },
  { key: "anti_korupsi", title: "Anti Korupsi", desc: "Lulus skenario social engineering (Skenario 19)", icon: "ShieldAlert", condition: "Social Engineering proof" }
];

// Knowledge Base Topics
const KAMUS_AKAD = [
  { title: "Murabahah", def: "Akad jual beli barang dengan menegaskan harga perolehan dan margin keuntungan kepada pembeli. Angsuran bersifat tetap / cicilan konstan.", icon: "Award", diff: "Bebas dari pergeseran suku bunga pasar; harga disepakati di awal." },
  { title: "Mudharabah", def: "Akad kerjasama usaha antara pemilik modal (shahibul maal) dan pengelola (mudharib). Keuntungan dibagi sesuai nisbah yang disepakati.", icon: "Users", diff: "Jika rugi bukan karena kelalaian pengelola, kerugian finansial ditanggung sepenuhnya oleh pemilik modal." },
  { title: "Musyarakah", def: "Akad kerjasama antara dua pihak atau lebih untuk suatu usaha tertentu, di mana masing-masing menyumbang modal dengan porsi tertentu.", icon: "Layers", diff: "Untung dan rugi dibagi proporsional sesuai porsi penyertaan modal masing-masing." },
  { title: "Wadiah", def: "Akad penitipan barang atau uang dari pemilik kepada penyimpanan. Ada Wadiah Yad Amanah (tidak boleh dipakai) & Yad Dhamanah (boleh dikelola).", icon: "Building2", diff: "Penyimpan dapat memberikan bonus (athaya) sukarela tanpa diperjanjikan di awal." },
  { title: "Ijarah", def: "Akad pemindahan hak guna (manfaat) atas suatu barang atau jasa dalam waktu tertentu melalui pembayaran sewa, tanpa pemindahan kepemilikan.", icon: "FileText", diff: "Ijarah Muntahiya Bittamlik (IMBT) adalah sewa yang diakhiri opsi pemindahan kepemilikan." }
];

const getAkadIcon = (title: string) => {
  switch (title) {
    case "Murabahah": return <Award className="w-5 h-5 text-[#C5A059]" />;
    case "Mudharabah": return <Users className="w-5 h-5 text-[#C5A059]" />;
    case "Musyarakah": return <Layers className="w-5 h-5 text-[#C5A059]" />;
    case "Wadiah": return <Building2 className="w-5 h-5 text-[#C5A059]" />;
    case "Ijarah": return <FileText className="w-5 h-5 text-[#C5A059]" />;
    default: return <BookOpen className="w-5 h-5 text-[#C5A059]" />;
  }
};

const getRoleIcon = (roleName: string) => {
  switch (roleName) {
    case "Customer Service Syariah":
      return <Users className="w-10 h-10 text-[#C5A059]" />;
    case "Teller Syariah":
      return <Building2 className="w-10 h-10 text-blue-400" />;
    case "Account Officer":
      return <FileText className="w-10 h-10 text-purple-400" />;
    case "Analis Pembiayaan":
      return <BarChart3 className="w-10 h-10 text-amber-400" />;
    case "Auditor Syariah":
      return <ShieldAlert className="w-10 h-10 text-red-400" />;
    default:
      return <GraduationCap className="w-10 h-10 text-[#C5A059]" />;
  }
};

const getDashboardCardIcon = (title: string) => {
  switch (title) {
    case "Total Sesi Selesai":
      return <BarChart3 className="w-8 h-8 text-[#C5A059]" />;
    case "Skor Rata-Rata Kelas":
      return <Trophy className="w-8 h-8 text-emerald-400" />;
    case "Deteksi Fraud Berhasil":
      return <ShieldAlert className="w-8 h-8 text-purple-400" />;
    case "Ujian Sesi Khusus":
      return <Building2 className="w-8 h-8 text-blue-400" />;
    default:
      return <GraduationCap className="w-8 h-8 text-[#C5A059]" />;
  }
};

const LARANGAN_SYARIAH = [
  { term: "Riba", desc: "Setiap penambahan pada pokok piutang yang dipersyaratkan di awal. Contoh: Bunga Bank, denda bunga berlipat.", s_alt: "Gunakan Margin Keuntungan (Murabahah) atau Nisbah Bagi Hasil (Mudharabah)." },
  { term: "Gharar", desc: "Ketidakjelasan atau ketidakpastian dalam objek transaksi, harga, atau waktu serah terima. Mengandung unsur penipuan.", s_alt: "SOP kejelasan spesifikasi barang, jaminan rill, dan transparansi akad." },
  { term: "Maysir", desc: "Unsur judi atau spekulasi untung-untungan tanpa kerja nyata yang merugikan salah satu pihak.", s_alt: "Investasi riil berbasis sektor produktif halal dengan underlying asset jelas." },
  { term: "Ta'zir (Denda Syandat)", desc: "Denda keterlambatan yang disalurkan sebagai dana sosial/infak, bukan pendapatan bank syariah komersial.", s_alt: "Siswa dilarang menyebut kata denda bunga komersial kepada debitur." }
];

const SOP_STANDAR = [
  { title: "SOP CS Pembukaan Rekening", steps: ["Sapa hangat (Assalamu'alaikum)", "Tanya tujuan & jelaskan akad wadiah/mudharabah", "Minta dokumen pendukung (KTP/akte)", "Proses legalitas & foto diri", "Konfirmasi penandatanganan akad", "Serahkan buku tabungan & kartu ATM beserta edukasi keamanan PIN"] },
  { title: "SOP Teller Penyetoran Tunai", steps: ["Berikan salam ramah", "Minta slip penarikan/penyetoran & identitas", "Hitung uang tunai di depan nasabah secara terbuka", "Konfirmasi nominal & lakukan input ke sistem", "Validasi struk transaksi", "Serahkan salinan struk beserta ucapan doa keberkahan"] },
  { title: "SOP Analisis Pembiayaan Kelayakan", steps: ["Lakukan analisa 5C (Character, Capacity, Capital, Collateral, Condition)", "Cek BI checking / SLIK OJK", "Verifikasi keaslian slip gaji, laporan keuangan, dan jaminan", "Taksir nilai agunan secara transparan", "Komparasikan kemampuan bayar dengan cicilan bulanan", "Rekomendasikan plafon serta jenis akad yang paling maslahah"] }
];

const KUIS_SOAL = [
  {
    tanya: "Manakah pernyataan yang PALING tepat menggambarkan perbedaan antara bunga bank konvensional dengan bagi hasil bank syariah?",
    opsi: [
      "A. Bunga ditentukan berdasarkan persentase keuntungan usaha, sedangkan bagi hasil ditentukan dari pokok pinjaman.",
      "B. Bunga bersifat tetap dan dijamin di awal dari nilai modal, sedangkan bagi hasil fluktuatif mengikuti performa riil usaha sesuai nisbah.",
      "C. Bunga hanya berlaku untuk pembiayaan konsumtif, sedangkan bagi hasil untuk produktif.",
      "D. Bank syariah tidak membagikan keuntungan sama sekali."
    ],
    jawab: 1,
    pembahasan: "Bunga dihitung di awal dari nominal pinjaman tanpa melihat realita usaha. Bagi hasil dihitung dari keuntungan riil dengan porsi nisbah (misal 60:40) yang disepakati di awal."
  },
  {
    tanya: "Setoran denda keterlambatan pembayaran nasabah pada KPR Syariah yang dialokasikan sebagai dana kebajikan sosial (infak/sedekah) disebut...",
    opsi: [
      "A. Riba Jahiliyah",
      "B. Margin Murabahah",
      "C. Ta'zir",
      "C. Nisbah Ganti Rugi"
    ],
    jawab: 2,
    pembahasan: "Ta'zir adalah denda finansial yang dijatuhkan pada nasabah mampu yang menunda-nunda pembayaran, dana ini tidak masuk pendapatan bank melainkan disalurkan untuk dana sosial."
  },
  {
    tanya: "Akad pembiayaan di mana bank membelikan barang yang dibutuhkan nasabah, lalu menjualnya kembali kepada nasabah dengan harga perolehan ditambah margin keuntungan disepakati, disebut akad...",
    opsi: [
      "A. Mudharabah",
      "B. Musyarakah Mutanaqisah",
      "C. Murabahah",
      "D. Wadiah Yad Dhamanah"
    ],
    jawab: 2,
    pembahasan: "Murabahah adalah akad jual beli barang dengan harga asal ditambah keuntungan disepakati secara transparan."
  },
  {
    tanya: "Setoran tunai harian pedagang kelontong sebesar Rp400 Juta per minggu padahal tokonya berukuran 2x3 meter merupakan bendera merah (Red Flag) dari ranah fraud...",
    opsi: [
      "A. Social Engineering",
      "B. Money Laundering (Pencucian Uang)",
      "C. Pemalsuan Slip Gaji",
      "D. Penipuan Identitas KTP"
    ],
    jawab: 1,
    pembahasan: "Setoran dengan nominal tidak logis berbanding profil ekonomi merujuk pada indikator pencucian uang (Money Laundering) wajib dilaporkan via LTKM ke team leader secara konfidensial."
  },
  {
    tanya: "Nasabah datang dengan marah, menolak menyerahkan KTP fisik, dan merayu Anda dengan amplop tips sambil menyebut nama Direktur Utama untuk memproses penarikan tabungan. Apa tindakan terbaik Anda?",
    opsi: [
      "A. Melayani penarikan karena takut dipecat oleh Direktur Utama.",
      "B. Menerima tips dengan syarat transaksi harus cepat selesai.",
      "C. Tetap tenang, menolak tips dengan sopan, menegakkan SOP verifikasi identitas, dan melaporkan insiden ke Supervisor.",
      "D. Memanggil satpam langsung tanpa penjelasan apa-apa."
    ],
    jawab: 2,
    pembahasan: "Ini modus Social Engineering yang menekan psikologis petugas. Menolak suap, memegang teguh SOP KYC, dan melaporkan kecurigaan ke atasan adalah kewajiban bankir profesional."
  }
];

export default function App() {
  const [userRole, setUserRole] = useState<"siswa" | "guru" | null>(() => {
    return localStorage.getItem("smartbank_user_role") as "siswa" | "guru" | null;
  });
  const [loginTab, setLoginTab] = useState<"siswa" | "guru">("siswa");
  const [loginPasscode, setLoginPasscode] = useState<string>("");
  const [loginError, setLoginError] = useState<string>("");
  const [showPasscode, setShowPasscode] = useState<boolean>(false);

  // Teacher filters & monitoring states
  const [teacherClassFilter, setTeacherClassFilter] = useState<string>("Semua");
  const [teacherScenarioFilter, setTeacherScenarioFilter] = useState<string>("Semua");
  const [teacherSearch, setTeacherSearch] = useState<string>("");
  
  // Detailed Session Grading/Review Modal
  const [selectedSessionForDetail, setSelectedSessionForDetail] = useState<any | null>(null);
  const [tempGradingScores, setTempGradingScores] = useState({
    nilaiProsedur: 80,
    nilaiSyariah: 80,
    nilaiKomunikasi: 80,
    nilaiVerifikasi: 80,
    nilaiKecepatan: 80,
  });
  const [tempSaranPerbaikan, setTempSaranPerbaikan] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<string>("splash");
  const [studentProfile, setStudentProfile] = useState(() => {
    const cached = localStorage.getItem("smartbank_student_profile");
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
    return {
      nama: "",
      kelas: "X",
      sekolah: "",
      avatar: "CS"
    };
  });

  const handleLogout = () => {
    localStorage.removeItem("smartbank_user_role");
    localStorage.removeItem("smartbank_student_profile");
    setUserRole(null);
    setStudentProfile({
      nama: "",
      kelas: "X",
      sekolah: "",
      avatar: "CS"
    });
    setCurrentPage("splash");
  };

  const [selectedRole, setSelectedRole] = useState<string>("Customer Service Syariah");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  
  // Settings & Toggles
  const [isExamMode, setIsExamMode] = useState<boolean>(false);
  const [completedScenarios, setCompletedScenarios] = useState<Record<number, number>>({});
  
  // Real-time Chat Simulation States
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; role: "siswa" | "nasabah"; content: string; time: string; review?: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState<string>("");
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [simulationTimer, setSimulationTimer] = useState<number>(0);
  const [activeSupervisorFeedback, setActiveSupervisorFeedback] = useState<any>({
    feedback_positif: ["Silakan mulai melayani nasabah sesuai SOP."],
    peringatan: [],
    kata_terlarang: [],
    skor: { prosedur: 100, syariah: 100, komunikasi: 100 }
  });
  const [tempCheckedSteps, setTempCheckedSteps] = useState<Record<string, boolean>>({});
  const [scenariosFinishedThisSession, setScenariosFinishedThisSession] = useState<number[]>([]);
  const [totalSimulatedDurations, setTotalSimulatedDurations] = useState<number>(0);

  // Evaluation States
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [replayMode, setReplayMode] = useState<boolean>(false);
  
  // Dashboard & Leaderboard States
  const [allSessions, setAllSessions] = useState<any[]>([]);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("all");
  
  // Knowledge Bank states
  const [kbTab, setKbTab] = useState<string>("akad");
  const [kuisJawabanSiswa, setKuisJawabanSiswa] = useState<Record<number, number>>({});
  const [kuisReview, setKuisReview] = useState<boolean>(false);

  // UI Utilities
  const [levelFilter, setLevelFilter] = useState<string>("Semua");
  const [showRefPopup, setShowRefPopup] = useState<boolean>(false);
  const [floatingAlert, setFloatingAlert] = useState<{ text: string; mode: "warning" | "success" | "info" } | null>(null);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchScenarioQuery, setSearchScenarioQuery] = useState("");

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Fetch session history from API on mount & page transitions
  useEffect(() => {
    fetchSessions();
  }, [currentPage]);

  // Handle simulation timer
  useEffect(() => {
    if (currentPage === "simulasi") {
      setSimulationTimer(0);
      timerRef.current = setInterval(() => {
        setSimulationTimer((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentPage]);

  // Auto scroll chat to bottom
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isTyping]);

  // Trigger celebration confetti when student gets an "Excellent" grade on the evaluation page
  useEffect(() => {
    if (currentPage === "evaluasi" && evaluationResult) {
      const isExcellent = evaluationResult.grade === "Excellent" || 
                          (evaluationResult.nilai_total && evaluationResult.nilai_total >= 90);
      if (isExcellent) {
        triggerRealisticConfetti();
      }
    }
  }, [currentPage, evaluationResult]);

  const triggerRealisticConfetti = () => {
    // Initial central burst
    confetti({
      particleCount: 150,
      spread: 85,
      origin: { y: 0.6 },
      colors: ["#C5A059", "#148F77", "#FFFFFF", "#FFD700", "#18BC9C"],
    });

    // Staggered side bursts mimicking real staging
    const end = Date.now() + 3000; // 3 seconds duration
    const interval = setInterval(() => {
      if (Date.now() > end) {
        return clearInterval(interval);
      }
      confetti({
        particleCount: 40,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.85 },
        colors: ["#C5A059", "#148F77", "#FFFFFF", "#FFD700"],
      });
      confetti({
        particleCount: 40,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.85 },
        colors: ["#C5A059", "#148F77", "#FFFFFF", "#FFD700"],
      });
    }, 300);
  };

  const fetchSessions = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        setAllSessions(data);
      }
    } catch (e) {
      console.error("Gagal menjangkau API database kelas:", e);
    }
  };

  const clearSessions = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua rekap sesi siswa di dashboard guru ini? Tindakan tidak dapat dibatalkan.")) {
      try {
        const res = await fetch("/api/sessions/clear", { method: "POST" });
        if (res.ok) {
          triggerAlert("Database log simulasi berhasil dikosongkan!", "success");
          fetchSessions();
        }
      } catch (err) {
        triggerAlert("Gagal membersihkan data.", "warning");
      }
    }
  };

  const triggerAlert = (text: string, mode: "success" | "warning" | "info" = "info") => {
    setFloatingAlert({ text, mode });
    setTimeout(() => setFloatingAlert(null), 5000);
  };

  // Sharia Word filter validation
  const checkShariaWords = (msg: string) => {
    const forbidden = [
      { rx: /\bbunga\b/i, label: "bunga", suggest: "nisbah bagi hasil atau margin keuntungan" },
      { rx: /\briba\b/i, label: "riba", suggest: "transaksi sesuai syariah" },
      { rx: /\bkredit\s+konvensional\b/i, label: "kredit konvensional", suggest: "pembiayaan syariah" },
      { rx: /\bdenda\b/i, label: "denda", suggest: "ganti rugi (ta'zir/dana kebajikan)" },
      { rx: /\bpenalty\b/i, label: "penalty", suggest: "ganti rugi (ta'zir)" },
      { rx: /\binterest\b/i, label: "interest", suggest: "bagi hasil atau keuntungan" },
      { rx: /\bpinjaman\s+berbunga\b/i, label: "pinjaman berbunga", suggest: "pembiayaan sariah" }
    ];

    const found = forbidden.find(item => item.rx.test(msg));
    return found ? found : null;
  };

  const handleStartSimulation = (scenario: Scenario) => {
    if (!studentProfile.nama.trim()) {
      triggerAlert("Mohon isi profil siswa terlebih dahulu!", "warning");
      setCurrentPage("profil");
      return;
    }
    setSelectedScenario(scenario);
    setChatHistory([
      {
        id: "start",
        role: "nasabah",
        content: `Assalamu'alaikum wr. wb. Selamat pagi. Saya ${scenario.karakterNasabah.split(', ')[0]}. ${scenario.nasabahContext}`,
        time: "08.00"
      }
    ]);
    setCurrentMessage("");
    setTempCheckedSteps({});
    setActiveSupervisorFeedback({
      feedback_positif: ["Sambut nasabah dengan penuh kesopanan islami."],
      peringatan: [],
      kata_terlarang: [],
      skor: { prosedur: 100, syariah: 100, komunikasi: 100 }
    });
    setCurrentPage("simulasi");
    triggerAlert(`Memulai simulasi: ${scenario.title}`, "success");
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedScenario) return;
    const msg = currentMessage;
    setCurrentMessage("");

    // Word filter warning test
    const violation = checkShariaWords(msg);
    if (violation) {
      triggerAlert(`Kata '${violation.label}' tidak syariah! Alternatif: '${violation.suggest}'`, "warning");
    }

    const newMessageId = Math.random().toString();
    const cleanTime = new Date().toLocaleTimeString("id", { hour: "2-digit", minute: "2-digit" });

    // Append student message
    const updatedHistory = [
      ...chatHistory,
      { id: newMessageId, role: "siswa" as const, content: msg, time: cleanTime }
    ];
    setChatHistory(updatedHistory);
    setIsTyping(true);

    try {
      const response = await fetch("/api/simulasi/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioId: selectedScenario.id,
          role: selectedRole,
          chatHistory: updatedHistory,
          message: msg
        })
      });

      if (!response.ok) {
        throw new Error("Gagal mengirimkan tanggapan ke server simulator.");
      }

      const data = await response.json();
      setIsTyping(false);

      // Append Customer Answer
      const botResponse = data.customerResponse || "Baik, silakan.";
      
      // Auto check checklist items based on semantic triggers of student's msg or supervisor feedback
      // This is a dynamic helper for auto-checking checklist
      const nextChecked = { ...tempCheckedSteps };
      selectedScenario.checklist.forEach(step => {
        const lowerStep = step.toLowerCase();
        const words = lowerStep.split(" ");
        // simple keyword matching
        if (words.some(w => w.length > 4 && msg.toLowerCase().includes(w))) {
          nextChecked[step] = true;
        }
      });
      setTempCheckedSteps(nextChecked);

      // Update Supervisor box
      if (data.supervisorFeedback) {
        setActiveSupervisorFeedback(data.supervisorFeedback);
        
        // Critical error floating notification
        if (data.supervisorFeedback.peringatan && data.supervisorFeedback.peringatan.length > 0) {
          triggerAlert(`Penyelia Layanan: ${data.supervisorFeedback.peringatan[0]}`, "warning");
        }
      }

      // Check if simulation complete tag returned
      if (botResponse.includes("SIMULASI_SELESAI")) {
        const cleanedBotResponse = botResponse.replace("SIMULASI_SELESAI", "").trim();
        setChatHistory(prev => [
          ...prev,
          { id: Math.random().toString(), role: "nasabah", content: cleanedBotResponse || "Terima kasih banyak atas pelayanannya yang halal dan berkah ini.", time: cleanTime }
        ]);
        triggerAlert("Nasabah telah puas! Sistem merekomendasikan akhiri simulasi.", "success");
      } else {
        setChatHistory(prev => [
          ...prev,
          { id: Math.random().toString(), role: "nasabah", content: botResponse, time: cleanTime }
        ]);
      }
    } catch (err: any) {
      console.error(err);
      setIsTyping(false);
      triggerAlert("Koneksi bank virtual lab terputus. Silakan coba kirim ulang.", "warning");
    }
  };

  const handleEndSimulation = async () => {
    if (!selectedScenario) return;
    setIsLoading(true);

    try {
      const response = await fetch("/api/simulasi/evaluasi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentProfile,
          scenarioId: selectedScenario.id,
          role: selectedRole,
          chatHistory: chatHistory,
          durationSeconds: simulationTimer,
          isExamMode: isExamMode
        })
      });

      if (!response.ok) {
        throw new Error("Gagal memproses penilaian evaluasi.");
      }

      const data = await response.json();
      setEvaluationResult(data.evaluation);
      
      // Update local storage completed tracking
      const finalScore = data.evaluation.nilai_total || 80;
      setCompletedScenarios(prev => ({
        ...prev,
        [selectedScenario.id]: finalScore
      }));

      // Evaluate Achievements
      const currentEarned = [...earnedBadges];
      if (finalScore >= 95 && !currentEarned.includes("teladan")) currentEarned.push("teladan");
      if ((data.evaluation.nilai_syariah || 0) === 100 && !currentEarned.includes("penjaga")) currentEarned.push("penjaga");
      if ([17, 18, 19, 20].includes(selectedScenario.id) && data.evaluation.deteksi_fraud_berhasil && !currentEarned.includes("mata_elang")) {
        currentEarned.push("mata_elang");
      }
      if (simulationTimer <= 300 && finalScore >= 80 && !currentEarned.includes("layanan_prima")) {
        currentEarned.push("layanan_prima");
      }
      if (!scenariosFinishedThisSession.includes(selectedScenario.id)) {
        const nextFinished = [...scenariosFinishedThisSession, selectedScenario.id];
        setScenariosFinishedThisSession(nextFinished);
        if (nextFinished.length >= 3 && !currentEarned.includes("magang")) {
          currentEarned.push("magang");
        }
      }
      if (selectedScenario.id === 19 && finalScore >= 80 && !currentEarned.includes("anti_korupsi")) {
        currentEarned.push("anti_korupsi");
      }
      setEarnedBadges(currentEarned);

      setIsLoading(false);
      setCurrentPage("evaluasi");
      triggerAlert("Evaluasi akhir selesai diproses oleh Sistem Penilai!", "success");
    } catch (e) {
      console.error(e);
      setIsLoading(false);
      triggerAlert("Sistem evaluasi bermasalah. Menggunakan penilaian standar lokal.", "info");
      // Fallback local evaluation if API error
      const mockEval = {
        nilai_prosedur: 85,
        nilai_syariah: 78,
        nilai_komunikasi: 88,
        nilai_verifikasi: 80,
        nilai_kecepatan: 85,
        nilai_total: 83,
        grade: "Baik",
        predikat: "Kompeten, Tingkatkan Lagi",
        checklist_terpenuhi: selectedScenario.checklist.slice(0, 5),
        checklist_terlewat: selectedScenario.checklist.slice(5),
        kelebihan: ["Komunikasi sopan khas ukhuwah", "Menggunakan salam pembuka islami"],
        kesalahan: [
          { kesalahan: "Lupa melampirkan berkas fisik akad", yang_benar: "Mintalah nasabah menandatangani lampiran akad wadiah", referensi: "SOP Pembukaan Tabungan Wadiah pasal 3" }
        ],
        pelanggaran_syariah: [],
        kata_terlarang_digunakan: [],
        saran_perbaikan: "Tingkatkan ketelitian verifikasi dokumen nasabah agar risiko fraud terminimalisir secara syariah."
      };
      setEvaluationResult(mockEval);
      setCompletedScenarios(prev => ({ ...prev, [selectedScenario.id]: 83 }));
      setCurrentPage("evaluasi");
    }
  };

  const handleRequestHint = () => {
    if (isExamMode) {
      triggerAlert("Hint dinonaktifkan dalam Mode Ujian!", "warning");
      return;
    }
    const hints = [
      "Gunakan ucapan Assalamu'alaikum di sela melayani nasabah.",
      `Akad yang cocok untuk skenario ini adalah: ${selectedScenario?.akad}.`,
      "Pastikan menanyakan kartu identitas (KTP) terlebih dahulu sebelum memproses data di komputer.",
      "Gunakan istilah 'nisbah bagi hasil' daripada menggunakan kata 'bunga'.",
      "Perhatikan baik-baik detail tanggal dokumen virtual dan wajah pada foto jika mencurigakan."
    ];
    const randHint = hints[Math.floor(Math.random() * hints.length)];
    triggerAlert(`Petunjuk Supervisor: "${randHint}"`, "info");
  };

  // Filter Scenarios
  const filteredScenarios = SCENARIOS.filter(scen => {
    const matchesLevel = levelFilter === "Semua" ? true : scen.level === levelFilter;
    const matchesSearch = scen.title.toLowerCase().includes(searchScenarioQuery.toLowerCase()) || 
                          scen.akad.toLowerCase().includes(searchScenarioQuery.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  // Teacher actions & monitoring
  const handleSelectSessionDetail = (session: any) => {
    setSelectedSessionForDetail(session);
    setTempGradingScores({
      nilaiProsedur: session.nilaiProsedur || 80,
      nilaiSyariah: session.nilaiSyariah || 80,
      nilaiKomunikasi: session.nilaiKomunikasi || 80,
      nilaiVerifikasi: session.nilaiVerifikasi || 80,
      nilaiKecepatan: session.nilaiKecepatan || 80,
    });
    setTempSaranPerbaikan(session.saranPerbaikan || "");
  };

  const handleSaveManualGrading = async () => {
    if (!selectedSessionForDetail) return;
    const totalNew = Math.round(
      (tempGradingScores.nilaiProsedur +
       tempGradingScores.nilaiSyariah +
       tempGradingScores.nilaiKomunikasi +
       tempGradingScores.nilaiVerifikasi +
       tempGradingScores.nilaiKecepatan) / 5
    );
    
    let gradeNew = "Cukup";
    if (totalNew >= 90) gradeNew = "Excellent";
    else if (totalNew >= 80) gradeNew = "Sangat Baik";
    else if (totalNew >= 70) gradeNew = "Baik";

    try {
      const response = await fetch("/api/sessions/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedSessionForDetail.id,
          nilaiProsedur: tempGradingScores.nilaiProsedur,
          nilaiSyariah: tempGradingScores.nilaiSyariah,
          nilaiKomunikasi: tempGradingScores.nilaiKomunikasi,
          nilaiVerifikasi: tempGradingScores.nilaiVerifikasi,
          nilaiKecepatan: tempGradingScores.nilaiKecepatan,
          nilaiTotal: totalNew,
          grade: gradeNew,
          saranPerbaikan: tempSaranPerbaikan
        })
      });

      if (!response.ok) {
        throw new Error("Gagal melakukan pembaruan rekap nilai.");
      }

      setAllSessions(prev => 
        prev.map(s => s.id === selectedSessionForDetail.id ? {
          ...s,
          nilaiProsedur: tempGradingScores.nilaiProsedur,
          nilaiSyariah: tempGradingScores.nilaiSyariah,
          nilaiKomunikasi: tempGradingScores.nilaiKomunikasi,
          nilaiVerifikasi: tempGradingScores.nilaiVerifikasi,
          nilaiKecepatan: tempGradingScores.nilaiKecepatan,
          nilaiTotal: totalNew,
          grade: gradeNew,
          saranPerbaikan: tempSaranPerbaikan
        } : s)
      );

      triggerAlert(`Berhasil melakukan pembaruan nilai ulasan siswa ${selectedSessionForDetail.namaSiswa}!`, "success");
      setSelectedSessionForDetail(null);
    } catch (e: any) {
      console.error(e);
      triggerAlert(e.message || "Gagal memperbaharui rekap nilai di server.", "warning");
    }
  };

  const handleExportCSV = () => {
    const teacherFilteredSessions = allSessions.filter(s => {
      const matchesSearch = s.namaSiswa.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                            s.sekolah.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                            s.id.toLowerCase().includes(teacherSearch.toLowerCase());
      const matchesClass = teacherClassFilter === "Semua" ? true : s.kelas === teacherClassFilter;
      const matchesScenario = teacherScenarioFilter === "Semua" ? true : s.scenarioTitle === teacherScenarioFilter;
      return matchesSearch && matchesClass && matchesScenario;
    });

    const headers = [
      "ID Sesi", "Nama Siswa", "Kelas", "Instansi Sekolah", "Materi Skenario", 
      "Peran", "Mode", "SOP Prosedur", "Kepatuhan Syariah", "Etika Komunikasi", 
      "Verifikasi Fraud", "Kecepatan Layanan", "Nilai Rata-rata", "Grade Akhir", "Waktu", "Durasi"
    ];
    
    const rows = teacherFilteredSessions.map(s => [
      s.id,
      s.namaSiswa,
      s.kelas,
      s.sekolah,
      `"${s.scenarioTitle.replace(/"/g, '""')}"`,
      s.role,
      s.isExamMode ? "UJIAN" : "LATIHAN",
      s.nilaiProsedur,
      s.nilaiSyariah,
      s.nilaiKomunikasi,
      s.nilaiVerifikasi,
      s.nilaiKecepatan,
      s.nilaiTotal,
      s.grade,
      s.waktu,
      s.durasi
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rekap_nilai_SMARTBANK_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerAlert("Rekapitulasi nilai berhasil diekspor ke CSV!", "success");
  };

  // Knowledge base quiz evaluation
  const handleAnswerQuiz = (index: number, answerIndex: number) => {
    setKuisJawabanSiswa(prev => ({
      ...prev,
      [index]: answerIndex
    }));
  };

  if (userRole === null) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Decorative backdrop blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#C5A059]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[#148F77]/5 blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-lg bg-[#111] border border-white/10 rounded-2xl p-6 md:p-10 shadow-2xl relative z-10 space-y-8">
          
          {/* Logo Heading */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full border border-[#C5A059]/60 flex items-center justify-center bg-[#1A1A1A] mx-auto shadow-[0_0_20px_rgba(197,160,89,0.15)] animate-pulse">
              <Building2 className="w-8 h-8 text-[#C5A059]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-white tracking-tight">
                Akses Portal <span className="text-[#C5A059] italic pr-1">SmartBank Syariah</span>
              </h1>
              <p className="text-xs text-white/40 tracking-wider font-mono">LABORATORIUM PRAKTIKUM & EVALUASI AKADEMIK SYARIAH</p>
            </div>
          </div>

          {/* Tab Roles Selection */}
          <div className="flex bg-[#1A1A1A] p-1 rounded-lg border border-white/5">
            <button
              onClick={() => {
                setLoginTab("siswa");
                setLoginError("");
              }}
              className={`flex-1 py-2.5 text-xs font-mono rounded-md tracking-wider transition-all flex items-center justify-center gap-2 ${
                loginTab === "siswa" 
                  ? "bg-[#C5A059] text-[#0A0A0A] font-bold shadow-lg" 
                  : "text-white/55 hover:text-white"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Siswa Magang</span>
            </button>
            <button
              onClick={() => {
                setLoginTab("guru");
                setLoginError("");
              }}
              className={`flex-1 py-2.5 text-xs font-mono rounded-md tracking-wider transition-all flex items-center justify-center gap-2 ${
                loginTab === "guru" 
                  ? "bg-[#C5A059] text-[#0A0A0A] font-bold shadow-lg" 
                  : "text-white/55 hover:text-white"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Guru Pembimbing</span>
            </button>
          </div>

          {/* Form Content */}
          {loginTab === "siswa" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={studentProfile.nama}
                  onChange={(e) => setStudentProfile({ ...studentProfile, nama: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-[#C5A059] focus:bg-black/40 rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Kelas Perbankan</label>
                  <select
                    value={studentProfile.kelas}
                    onChange={(e) => setStudentProfile({ ...studentProfile, kelas: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#C5A059] rounded px-4 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="X">X Perbankan Syariah</option>
                    <option value="XI">XI Perbankan Syariah</option>
                    <option value="XII">XII Perbankan Syariah</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Nama Sekolah / Instansi</label>
                  <input
                    type="text"
                    placeholder="Contoh: SMK Negeri 1 Jakarta"
                    value={studentProfile.sekolah}
                    onChange={(e) => setStudentProfile({ ...studentProfile, sekolah: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-[#C5A059] focus:bg-black/40 rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-2">Pilih Avatar Profil</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {AVATARS.map((av) => (
                    <button
                      key={av.emoji}
                      onClick={() => setStudentProfile({ ...studentProfile, avatar: av.emoji })}
                      className={`flex flex-col items-center justify-center p-2 rounded border text-center transition-all ${
                        studentProfile.avatar === av.emoji
                          ? "bg-[#C5A059]/10 border-[#C5A059] text-white"
                          : "bg-black/30 border-white/5 text-white/35 hover:border-white/15"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold">{av.emoji}</span>
                      <span className="text-[7px] text-white/50 truncate w-full mt-0.5">{av.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {loginError && (
                <div className="bg-red-950/20 border border-red-900/50 text-red-400 p-3 rounded-lg text-xs leading-relaxed">
                  {loginError}
                </div>
              )}

              <button
                onClick={() => {
                  if (!studentProfile.nama || !studentProfile.sekolah) {
                    setLoginError("Lengkapi nama lengkap dan instansi sekolah.");
                    return;
                  }
                  setLoginError("");
                  localStorage.setItem("smartbank_student_profile", JSON.stringify(studentProfile));
                  localStorage.setItem("smartbank_user_role", "siswa");
                  setUserRole("siswa");
                  setCurrentPage("skenario");
                  triggerAlert(`Selamat datang, ${studentProfile.nama}!`, "success");
                }}
                className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all mt-4 hover:scale-[1.01] active:scale-95 shadow-[0_4px_16px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2"
              >
                <span>Masuk Lab Virtual</span>
                <Play className="w-3.5 h-3.5 fill-current" />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-white/50 mb-1.5">Sandi Autentikasi Pengajar</label>
                <div className="relative">
                  <input
                    type={showPasscode ? "text" : "password"}
                    placeholder="Sandi Pembimbing (sandi default: guru123)"
                    value={loginPasscode}
                    onChange={(e) => setLoginPasscode(e.target.value)}
                    className="w-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-[#C5A059] focus:bg-black/40 rounded px-4 py-2.5 text-sm text-white focus:outline-none transition-all pr-10 font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasscode(!showPasscode)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="bg-red-950/20 border border-red-900/50 text-red-400 p-3 rounded-lg text-xs leading-relaxed">
                  {loginError}
                </div>
              )}

              <button
                onClick={() => {
                  if (loginPasscode !== "guru123") {
                    setLoginError("Passcode salah! Silakan coba lagi (Sandi default: guru123)");
                    return;
                  }
                  setLoginError("");
                  localStorage.setItem("smartbank_user_role", "guru");
                  setUserRole("guru");
                  setCurrentPage("guru");
                  triggerAlert("Dashboard Guru Terautentikasi!", "success");
                }}
                className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold py-3 px-4 rounded-xl text-xs uppercase tracking-widest transition-all mt-4 hover:scale-[1.01] active:scale-95 shadow-[0_4px_16px_rgba(197,160,89,0.25)] flex items-center justify-center gap-2"
              >
                <span>Masuk Dashboard Guru</span>
                <GraduationCap className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Portal Info Footer */}
          <div className="text-center border-t border-white/5 pt-4 text-[9px] text-white/40 tracking-wider">
            SmartBank Syariah v2.1 • Kurikulum Merdeka Vokasi
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E5E5E5] font-sans flex flex-col relative overflow-x-hidden selection:bg-[#C5A059] selection:text-[#0A0A0A]">
      
      {/* Dynamic Inline Islamic Geometrical Star/Hexagon watermark decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] overflow-hidden mix-blend-color-dodge z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="islamic-grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M40,0 L80,40 L40,80 L0,40 Z" fill="none" stroke="#C5A059" strokeWidth="1" />
              <circle cx="40" cy="40" r="12" fill="none" stroke="#C5A059" strokeWidth="1" strokeDasharray="2,2"/>
              <path d="M0,0 L80,80 M80,0 L0,80" fill="none" stroke="#C5A059" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#islamic-grid)" />
        </svg>
      </div>

      {/* Floating Interactive Notification Alert */}
      {floatingAlert && (
        <div id="floating-alert" className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.8)] border animate-bounce ${
          floatingAlert.mode === "warning" ? "bg-[#2A1010] border-red-500/50 text-red-200" :
          floatingAlert.mode === "success" ? "bg-[#102A20] border-[#148F77]/60 text-emerald-200" :
          "bg-[#1A1A1A] border-[#C5A059]/40 text-blue-200"
        }`}>
          {floatingAlert.mode === "warning" && <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />}
          {floatingAlert.mode === "success" && <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />}
          {floatingAlert.mode === "info" && <BadgeInfo className="w-5 h-5 text-[#C5A059] shrink-0" />}
          <span className="text-xs font-medium tracking-wide leading-relaxed">{floatingAlert.text}</span>
        </div>
      )}

      {/* Header Navigation - Hidden ONLY on splash page */}
      {currentPage !== "splash" && (
        <header id="app-header" className="border-b border-white/10 bg-[#0F0F0F]/90 backdrop-blur-md py-4 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 z-10 sticky top-0">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentPage("splash")}>
            <div className="w-10 h-10 rounded-lg bg-[#C5A059]/10 border border-[#C5A059] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-[#C5A059]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-lg tracking-widest text-[#C5A059] font-bold">SMARTBANK</span>
                <span className="text-[10px] bg-[#C5A059]/20 text-[#C5A059] px-1.5 py-0.2 rounded font-mono uppercase">Syariah</span>
              </div>
              <p className="text-[9px] tracking-widest text-white/40 uppercase">Simulasi & Praktikum</p>
            </div>
          </div>

          <nav className="flex items-center gap-2 md:gap-4 text-xs font-mono tracking-widest uppercase">
            <button 
              id="nav-pengetahuan"
              onClick={() => setCurrentPage("pengetahuan")}
              className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${currentPage === "pengetahuan" ? "text-[#C5A059] bg-white/5 border border-[#C5A059]/40" : "text-white/60 hover:text-white"}`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Bank Ilmu</span>
            </button>
            {userRole === "guru" && (
              <button 
                id="nav-guru"
                onClick={() => setCurrentPage("guru")}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-1.5 ${currentPage === "guru" ? "text-amber-400 bg-white/5 border border-amber-500/40" : "text-white/60 hover:text-white"}`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden md:inline">Mode Guru</span>
              </button>
            )}
            
            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>
            
            {userRole === "guru" ? (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center font-mono text-[10px] font-bold text-amber-400" title="Guru Pembimbing">
                  GP
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-sans text-white font-medium max-w-[100px] truncate">Pembimbing</p>
                  <p className="text-[8px] font-mono text-amber-400">GURU MONITOR</p>
                </div>
              </div>
            ) : studentProfile.nama ? (
              <div className="flex items-center gap-2">
                <div onClick={() => setCurrentPage("profil")} className="w-7 h-7 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/40 flex items-center justify-center font-mono text-[10px] font-bold text-[#C5A059] cursor-pointer hover:scale-105 active:scale-95 transition-transform" title="Ubah Profil">
                  {studentProfile.avatar}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[10px] font-sans text-white font-medium max-w-[100px] truncate">{studentProfile.nama}</p>
                  <p className="text-[8px] font-mono text-[#C5A059]">{studentProfile.kelas} Perbankan</p>
                </div>
              </div>
            ) : (
              <button onClick={() => setCurrentPage("profil")} className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] px-3 py-1.5 rounded text-[10px] font-bold">
                DAFTAR PROFIL
              </button>
            )}

            <button
              onClick={handleLogout}
              className="ml-2 bg-red-950/20 hover:bg-red-900/40 border border-red-900/50 hover:border-red-800 text-red-200 px-2.5 py-1.5 rounded text-[10px] font-mono tracking-wider flex items-center gap-1.5 transition-all"
              title="Keluar"
            >
              <Lock className="w-3 h-3 text-red-500" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </nav>
        </header>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center z-10 w-full max-w-7xl mx-auto px-4 py-6 md:py-10">

        {/* PAGE 1 — ONBOARDING / SPLASH SCREEN */}
        {currentPage === "splash" && (
          <div id="page-splash" className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto px-4 my-auto py-12">
            
            {/* Islamic Geometric Logo Accent */}
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full border border-[#C5A059]/60 flex items-center justify-center bg-radial from-[#1A1A1A] to-[#0A0A0A] shadow-[0_0_30px_rgba(197,160,89,0.2)] animate-pulse">
                <Building2 className="w-10 h-10 text-[#C5A059]" />
              </div>
              <div className="absolute -top-1 -left-1 w-26 h-26 rounded-full border border-dashed border-[#C5A059]/20 animate-spin"></div>
            </div>

            <div className="mb-2">
              <span className="text-[10px] md:text-xs font-mono font-semibold uppercase tracking-[0.4em] text-[#C5A059] bg-[#C5A059]/10 px-3 py-1 rounded border border-[#C5A059]/20">
                LABORATORIUM VIRTUAL INTERAKTIF
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white mb-4">
              SmartBank <span className="text-[#C5A059] italic pr-1">Syariah</span>
            </h1>

            <p className="text-base md:text-lg text-white/70 max-w-2xl font-serif italic mb-2">
              "Belajar menjadi bankir syariah profesional tanpa harus berada di bank sungguhan"
            </p>

            <p className="text-xs text-white/40 max-w-lg mb-8 tracking-wide">
              Materi interaktif kurikulum sekolah rujukan perbankan syariah, dirancang khusus untuk melatih operasional sesuai rukun dan rilis kehalalan perbankan.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full max-w-md">
              <button
                id="btn-mulai-belajar"
                onClick={() => setCurrentPage("profil")}
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#B38F50] text-[#0A0A0A] font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-md shadow-[0_4px_20px_rgba(197,160,89,0.3)] transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                Mulai Belajar Virtual
              </button>
              
              <button
                id="btn-mode-guru"
                onClick={() => setCurrentPage("guru")}
                className="w-full sm:w-auto border border-[#C5A059]/40 hover:border-[#C5A059] text-[#C5A059] font-bold uppercase tracking-wider text-xs px-8 py-4 rounded-md transition-all duration-200 hover:bg-white/[0.02] flex items-center justify-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Dashboard Guru
              </button>
            </div>

            {/* Support Badge */}
            <div className="mt-12 flex items-center justify-center gap-2 text-[10px] text-white/50 tracking-widest uppercase bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              STANDAR AKURASI LAYANAN PELANGGAN & KEPATUHAN SYARIAH REALTIME
            </div>
          </div>
        )}


        {/* PAGE 2 — PROFIL SISWA */}
        {currentPage === "profil" && (
          <div id="page-profil" className="max-w-xl mx-auto w-full bg-[#111] border border-white/10 rounded-lg p-6 md:p-10 shadow-2xl relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Users className="w-24 h-24 text-[#C5A059]" />
            </div>

            <div className="mb-6">
              <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">ID Kartu Magang</span>
              <h2 className="text-2xl font-serif text-white font-bold">Konfigurasi Pengenal Siswa</h2>
              <p className="text-xs text-white/55 mt-1">Lengkapi data diri Anda untuk memulai sesi praktek kerja virtual di Bank Syariah.</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Nama Lengkap Siswa</label>
                <input
                  id="input-nama"
                  type="text"
                  placeholder="Contoh: Ahmad Maulana"
                  value={studentProfile.nama}
                  onChange={(e) => setStudentProfile({ ...studentProfile, nama: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-[#C5A059] rounded px-4 py-3 text-sm text-white focus:outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Kelas Perbankan</label>
                  <select
                    id="select-kelas"
                    value={studentProfile.kelas}
                    onChange={(e) => setStudentProfile({ ...studentProfile, kelas: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#C5A059] rounded px-4 py-3 text-sm text-white focus:outline-none cursor-pointer"
                  >
                    <option value="X">X Perbankan Syariah</option>
                    <option value="XI">XI Perbankan Syariah</option>
                    <option value="XII">XII Perbankan Syariah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Instansi Sekolah</label>
                  <input
                    id="input-sekolah"
                    type="text"
                    placeholder="Contoh: SMK Negeri 1 Jakarta"
                    value={studentProfile.sekolah}
                    onChange={(e) => setStudentProfile({ ...studentProfile, sekolah: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-white/10 hover:border-white/20 focus:border-[#C5A059] rounded px-4 py-3 text-sm text-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Pilih Avatar Karakter Bankir</label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {AVATARS.map((av) => (
                    <button
                      key={av.label}
                      type="button"
                      onClick={() => setStudentProfile({ ...studentProfile, avatar: av.emoji })}
                      className={`flex flex-col items-center justify-center p-3 rounded border transition-all ${
                        studentProfile.avatar === av.emoji 
                          ? "bg-[#C5A059]/15 border-[#C5A059] text-white shadow-[0_0_12px_rgba(197,160,89,0.3)] scale-105" 
                          : "bg-[#1A1A1A] border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold mb-1.5 border transition-all ${
                        studentProfile.avatar === av.emoji 
                          ? "bg-[#C5A059] text-[#0A0A0A] border-[#C5A059]" 
                          : "bg-white/5 text-[#C5A059] border-[#C5A059]/20"
                      }`}>{av.emoji}</span>
                      <span className="text-[8px] font-mono text-center truncate w-full">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  id="btn-simpan-profil"
                  onClick={() => {
                    if (!studentProfile.nama || !studentProfile.sekolah) {
                      triggerAlert("Mohon lengkapi seluruh kolom input pendataan!", "warning");
                      return;
                    }
                    localStorage.setItem("smartbank_student_profile", JSON.stringify(studentProfile));
                    localStorage.setItem("smartbank_user_role", "siswa");
                    setUserRole("siswa");
                    setCurrentPage("peran");
                    triggerAlert(`Profil ${studentProfile.nama} siap digunakan!`, "success");
                  }}
                  className="w-full bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold py-3 px-6 rounded text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(197,160,89,0.2)]"
                >
                  Lanjut Pilih Peran Spesialisasi
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}


        {/* PAGE 3 — PILIH PERAN */}
        {currentPage === "peran" && (
          <div id="page-peran" className="max-w-5xl mx-auto w-full">
            <div className="text-center mb-10">
              <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">Langkah 2 dari 3</span>
              <h2 className="text-3xl font-serif text-white font-bold mt-1">Pilih Peran Pekerjaan Bank</h2>
              <p className="text-sm text-white/60 max-w-2xl mx-auto mt-2">
                Setiap peran bankir syariah virtual memiliki fokus skenario dan kaitan akad tersendiri. Pilih peran sesuai modul kurikulum Anda hari ini.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                {
                  role: "Customer Service Syariah",
                  desc: "Melayani pembukaan rekening baru, pendalaman akad simpanan wadiah / mudharabah, informasi produk, dan komplain nasabah dengan penuh kearifan.",
                  match: "Skenario 1, 5, 6, 7, 8, 9, 10, 11, 12, 13",
                  color: "border-[#148F77]/30 hover:border-[#148F77]",
                  tagColor: "bg-[#148F77]/10 text-[#148F77]",
                  icon: getRoleIcon("Customer Service Syariah")
                },
                {
                  role: "Teller Syariah",
                  desc: "Melayani pencatatan & validasi transaksi keuangan tunai seperti setoran, penarikan, transfer sesama, dan edukasi ta'zir secara cepat & amanah.",
                  match: "Skenario 1, 2, 3, 4, 11, 12, 19, 20",
                  color: "border-blue-500/30 hover:border-blue-500",
                  tagColor: "bg-blue-500/10 text-blue-400",
                  icon: getRoleIcon("Teller Syariah")
                },
                {
                  role: "Account Officer",
                  desc: "Membangun hubungan erat dengan nasabah bisnis, penyaluran produk pembiayaan retail, cross-selling, dan perancangan margin yang berkah.",
                  match: "Skenario 9, 13, 14, 15, 16",
                  color: "border-purple-500/30 hover:border-purple-500",
                  tagColor: "bg-purple-500/10 text-purple-400",
                  icon: getRoleIcon("Account Officer")
                },
                {
                  role: "Analis Pembiayaan",
                  desc: "Melakukan verifikasi dokumen jaminan, kalkulasi debt service ratio kelayakan, mitigasi riba dalam permohonan KPR, modal usaha, dan kredit motor.",
                  match: "Skenario 14, 15, 16, 18",
                  color: "border-amber-500/30 hover:border-amber-500",
                  tagColor: "bg-amber-500/10 text-amber-400",
                  icon: getRoleIcon("Analis Pembiayaan")
                },
                {
                  role: "Auditor Syariah",
                  desc: "Memastikan ketaatan etika operasional halal, pengawasan silang pelanggaran riba, dan penelusuran dokumen palsu / money laundering.",
                  match: "Skenario 17, 18, 19, 20 (Skenario Fraud)",
                  color: "border-red-500/30 hover:border-red-500",
                  tagColor: "bg-red-500/10 text-red-400",
                  icon: getRoleIcon("Auditor Syariah")
                }
              ].map((p) => (
                <div
                  key={p.role}
                  className={`bg-[#111] border rounded-xl p-6 transition-all duration-300 hover:scale-[1.03] flex flex-col justify-between ${p.color}`}
                >
                  <div>
                    <div className="mb-4">{p.icon}</div>
                    <h3 className="font-serif text-base font-bold text-white mb-2 leading-tight">{p.role}</h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-4">{p.desc}</p>
                  </div>
                  
                  <div className="mt-auto">
                    <span className={`text-[9px] font-mono uppercase px-2 py-1 rounded inline-block mb-4 ${p.tagColor}`}>
                      {p.match}
                    </span>
                    <button
                      onClick={() => {
                        setSelectedRole(p.role);
                        setCurrentPage("skenario");
                        triggerAlert(`Mengemban amanah sebagai ${p.role}`, "info");
                      }}
                      className="w-full bg-white/5 hover:bg-[#C5A059] hover:text-[#0A0A0A] text-white/80 border border-white/10 hover:border-transparent rounded py-2 text-xs font-mono tracking-widest uppercase transition-all"
                    >
                      Pilih Peran
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setCurrentPage("profil")} 
                className="text-xs text-white/40 hover:text-white flex items-center gap-1.5 mx-auto font-mono uppercase"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali Ke Data Profil
              </button>
            </div>
          </div>
        )}


        {/* PAGE 4 — PILIH SKENARIO */}
        {currentPage === "skenario" && (
          <div id="page-skenario" className="max-w-6xl mx-auto w-full space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">Langkah Terakhir</span>
                <h2 className="text-3xl font-serif text-white font-bold">Gerbang Skenario Laboratorium</h2>
                <p className="text-xs text-white/50 mt-1">
                  Pilih dari 20 Skenario perbankan syariah dari level dasar hingga investigasi kejahatan finansial (fraud).
                </p>
              </div>

              {/* Mode Ujian Toggle */}
              <div className="flex items-center gap-3 bg-[#111] border border-white/10 rounded-lg p-2 shrink-0">
                <span className="text-xs font-mono text-white/60">Tingkat Kesulitan:</span>
                <div className="flex bg-black rounded p-0.5 relative">
                  <button
                    id="toggle-latihan"
                    onClick={() => {
                      setIsExamMode(false);
                      triggerAlert("Bantuan SOP & feedback instan aktif (Mode Latihan).", "success");
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                      !isExamMode ? "bg-[#C5A059] text-[#0A0A0A] font-bold shadow" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Unlock className="w-3 h-3" />
                    Latihan
                  </button>
                  <button
                    id="toggle-ujian"
                    onClick={() => {
                      setIsExamMode(true);
                      triggerAlert("Bantuan referensi dinonaktifkan! Kerjakan mandiri (Mode Ujian).", "warning");
                    }}
                    className={`px-3 py-1.5 rounded text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 ${
                      isExamMode ? "bg-red-950 text-red-200 border border-red-800 font-bold shadow" : "text-white/50 hover:text-white"
                    }`}
                  >
                    <Lock className="w-3 h-3" />
                    Ujian
                  </button>
                </div>
              </div>
            </div>

            {/* Progress Tracker Map Grid */}
            <div className="bg-[#111] border border-white/10 rounded-lg p-5">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Peta Kesiapan Laboratorium Virtual ({Object.keys(completedScenarios).length}/20 Selesai)
              </h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-20 gap-2">
                {SCENARIOS.map(sc => {
                  const score = completedScenarios[sc.id];
                  let bgCol = "bg-white/5 border-white/10";
                  if (score !== undefined) {
                    if (score >= 90) bgCol = "bg-[#148F77] border-[#148F77]/80 text-white font-bold shadow-[0_0_8px_rgba(20,143,119,0.4)]";
                    else if (score >= 75) bgCol = "bg-amber-600 border-amber-600/80 text-white font-bold";
                    else bgCol = "bg-red-900 border-red-700/80 text-red-100";
                  }
                  return (
                    <div
                      key={sc.id}
                      onClick={() => handleStartSimulation(sc)}
                      className={`h-10 rounded text-xs flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 ${bgCol}`}
                      title={`${sc.title} - ${score ? `Nilai: ${score}` : 'Belum Selesai'}`}
                    >
                      <span>{sc.id}</span>
                      {score !== undefined && <span className="text-[7px] opacity-85">{score}</span>}
                    </div>
                  );
                })}
              </div>
              <div className="flex gap-4 mt-3 text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-[#148F77]"></span> ≥90 Sangat Kompeten</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-amber-600"></span> 75-89 Cukup Baik</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-red-900"></span> &lt;75 Perlu Mengulang</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-white/5"></span> Belum Dicoba</span>
              </div>
            </div>

            {/* Filter and Search controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/5 p-4 rounded-lg border border-white/5">
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                {["Semua", "Dasar", "Menengah", "Lanjut", "Deteksi Fraud"].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setLevelFilter(lvl)}
                    className={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
                      levelFilter === lvl 
                        ? "bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]" 
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Cari judul/akad..."
                  value={searchScenarioQuery}
                  onChange={(e) => setSearchScenarioQuery(e.target.value)}
                  className="w-full bg-[#111] border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-[#C5A059]"
                />
                <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredScenarios.map(sc => {
                const isMatchRole = sc.roles.includes(selectedRole);
                const score = completedScenarios[sc.id];

                return (
                  <div
                    key={sc.id}
                    className={`bg-[#111] border rounded-xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                      score !== undefined ? "border-emerald-500/30 bg-emerald-950/[0.02]" : "border-white/10"
                    } hover:border-[#C5A059]/40 hover:-translate-y-1 hover:shadow-2xl group`}
                  >
                    {/* Level Card Tag */}
                    <div className="p-5 flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-[#C5A059]/80 uppercase">Skenario {sc.id}</span>
                        <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                          sc.level === "Dasar" ? "bg-green-100 text-green-800" :
                          sc.level === "Menengah" ? "bg-yellow-100 text-yellow-800" :
                          sc.level === "Lanjut" ? "bg-purple-100 text-purple-800" :
                          "bg-red-100 text-red-800 border border-red-300"
                        }`}>
                          {sc.level}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-semibold text-white group-hover:text-[#C5A059] transition-colors leading-tight">
                        {sc.title}
                      </h4>

                      <div className="space-y-1.5 text-[11px]">
                        <p className="text-white/40 font-mono"><span className="text-[#C5A059]">Akad:</span> {sc.akad}</p>
                        <p className="text-white/40"><span className="text-white/60">Konteks:</span> {sc.nasabahContext}</p>
                      </div>

                      {/* Matching suggestions */}
                      <div className="pt-2 border-t border-white/5">
                        <p className="text-[9px] text-[#C5A059]/60 font-mono">
                          Cocok Untuk: {sc.roles.map(r => r.split(' ')[0]).join(', ')}
                        </p>
                        {!isMatchRole && (
                          <span className="text-[8px] text-amber-500/60 font-mono italic flex items-center gap-1">
                            <AlertTriangle className="w-2.5 h-2.5 inline" /> Berbeda peran yang Anda pilih
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-[#161616] px-5 py-3 border-t border-white/5 flex items-center justify-between">
                      {score !== undefined ? (
                        <span className="text-[10px] text-emerald-400 font-mono">
                          Tuntas (Nilai: {score})
                        </span>
                      ) : (
                        <span className="text-[10px] text-white/30 font-mono">
                          Belum dicoba
                        </span>
                      )}
                      
                      <button
                        onClick={() => handleStartSimulation(sc)}
                        className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] text-[9px] font-mono tracking-widest uppercase font-bold px-3 py-1.5 rounded transition-all transform hover:scale-105"
                      >
                        Mulai Simulasi
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex justify-between items-center text-xs font-mono uppercase text-white/40">
              <button onClick={() => setCurrentPage("peran")} className="hover:text-white flex items-center gap-1.5">
                <ArrowLeft className="w-3.5 h-3.5" /> Ganti Peran
              </button>
              <span>SmartBank Syariah v2.4.0</span>
            </div>
          </div>
        )}


        {/* PAGE 5 — RUANG SIMULASI (INTI APLIKASI) */}
        {currentPage === "simulasi" && selectedScenario && (
          <div id="page-simulasi" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch w-full">
            
            {/* PANEL KIRI (25% lebar) — MISSION CONTROL */}
            <div className="lg:col-span-3 bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-6">
              
              {/* Profile card summary */}
              <div>
                <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-4">
                  <div className="w-9 h-9 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center font-mono text-sm font-bold text-[#C5A059] shadow-inner">
                    {studentProfile.avatar}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white leading-tight">{studentProfile.nama}</h5>
                    <p className="text-[10px] font-mono text-[#C5A059]">{selectedRole}</p>
                  </div>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center text-white/50">
                    <span>Skenario:</span>
                    <span className="text-white font-mono">ID {selectedScenario.id}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/50">
                    <span>Materi:</span>
                    <span className="text-[#C5A059] font-medium text-right max-w-[150px] truncate">{selectedScenario.title}</span>
                  </div>
                  <div className="flex justify-between items-center text-white/50">
                    <span>Durasi:</span>
                    <span className="font-mono text-amber-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {Math.floor(simulationTimer / 60).toString().padStart(2, "0")}:{(simulationTimer % 60).toString().padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>

              {/* CHECKLIST SOP */}
              <div className="flex-1 border-t border-white/10 pt-4 overflow-y-auto max-h-[300px]">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#C5A059] mb-3 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-[#C5A059]" />
                  Checklist SOP Mandatori
                </h4>
                
                {isExamMode ? (
                  <div className="bg-red-950/20 border border-red-900 px-3 py-4 text-center rounded">
                    <ShieldAlert className="w-5 h-5 text-red-500 mx-auto mb-2 animate-bounce" />
                    <p className="text-[10px] font-mono text-red-200">MODE UJIAN DIAKTIFKAN</p>
                    <p className="text-[8px] text-red-300/60 mt-1">SOP Detail & checklist disembunyikan. Lakukan pelayanan terbaik secara mandiri untuk diuji di akhir.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedScenario.checklist.map((step, idx) => {
                      const isComplete = tempCheckedSteps[step];
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-[11px] text-white/70">
                          <button
                            onClick={() => setTempCheckedSteps({ ...tempCheckedSteps, [step]: !isComplete })}
                            className={`w-4 h-4 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                              isComplete ? "bg-[#148F77] border-[#148F77] text-white" : "border-white/25 hover:border-white/40"
                            }`}
                          >
                            {isComplete && <Check className="w-3 h-3" />}
                          </button>
                          <span className={isComplete ? "line-through text-white/30" : ""}>{step}</span>
                        </div>
                      );
                    })}

                    {/* Progress Percentage */}
                    <div className="pt-3">
                      <div className="flex justify-between items-center text-[10px] text-white/40 mb-1">
                        <span>Pemberesan SOP:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {Math.round((Object.values(tempCheckedSteps).filter(Boolean).length / selectedScenario.checklist.length) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-[#148F77] h-1.5 transition-all duration-500" 
                          style={{ width: `${(Object.values(tempCheckedSteps).filter(Boolean).length / selectedScenario.checklist.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* REFERENSI AKAD (Expandable) */}
              {!isExamMode && (
                <div className="border-t border-white/10 pt-4">
                  <button
                    onClick={() => setShowRefPopup(!showRefPopup)}
                    className="w-full flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/60 hover:text-white"
                  >
                    <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-[#C5A059]" /> Referensi Akad Skenario</span>
                    <ChevronDown className={`w-4 h-4 transform transition-transform ${showRefPopup ? "rotate-180" : ""}`} />
                  </button>
                  {showRefPopup && (
                    <div className="mt-2 bg-black/60 rounded p-3 text-[10px] border border-white/5 space-y-2 leading-relaxed">
                      <p className="text-[#C5A059] font-bold">Utama: {selectedScenario.akad}</p>
                      <p className="text-white/40">Gunakan prinsip transparan, tanyakan data identitas, tentukan nisbah yang adil.</p>
                      <button 
                        onClick={() => setCurrentPage("pengetahuan")} 
                        className="text-[9px] text-[#C5A059] hover:underline flex items-center gap-0.5"
                      >
                        Buka Bank Pengetahuan <ArrowUpRight className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* STATE WAWANCARA SYARIAH WARNING STATUS */}
              <div className="border-t border-white/10 pt-4">
                <span className="text-[9px] font-mono text-white/40 uppercase block mb-1">Status Kepatuhan</span>
                <div className="flex items-center gap-1 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <p className="text-emerald-400 font-medium">Bebas Unsur Riba & Gharar</p>
                </div>
              </div>
            </div>

            {/* PANEL TENGAH (50% lebar) — ARENA SIMULASI (CHAT WINDOW) */}
            <div className="lg:col-span-6 bg-[#111] border border-white/10 rounded-xl flex flex-col h-[650px] overflow-hidden justify-between relative">
              
              {/* Header Arena */}
              <div className="bg-[#1A1A1A] px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 bg-red-600 rounded-full animate-ping"></div>
                  <div>
                    <h4 className="font-serif text-sm font-bold text-white">Laboratorium Bank Syariah Virtual</h4>
                    <p className="text-[10px] font-mono text-white/40">LOKET NO 3 — {selectedRole.toUpperCase()}</p>
                  </div>
                </div>

                {/* Simulation Documents Button (Virtual Doc Box if applicable) */}
                {selectedScenario.document && (
                  <button
                    onClick={() => {
                      triggerAlert(`Membuka berkas: ${selectedScenario.document?.type}`, "info");
                      setShowRefPopup(true); // Reuse popup for doc view on right helper or floating
                    }}
                    className="bg-[#C5A059]/15 hover:bg-[#C5A059]/30 text-[#C5A059] border border-[#C5A059]/40 text-[9px] font-mono px-2.5 py-1.5 rounded flex items-center gap-1 uppercase tracking-wider"
                  >
                    <FileText className="w-3 py-1 h-3" />
                    Lihat Berkas Virtual
                  </button>
                )}
              </div>

              {/* Chat Viewport */}
              <div className="flex-1 bg-[#0D0D0D] p-5 overflow-y-auto space-y-4">
                
                {/* Virtual Document Render inside chat viewport at top if exists */}
                {selectedScenario.document && (
                  <div className="bg-[#161616] border-2 border-dashed border-[#C5A059]/30 rounded-lg p-4 space-y-3 shadow-md max-w-lg mx-auto">
                    <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <span className="text-[10px] font-mono text-[#C5A059] uppercase tracking-widest flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        BERKAS NASABAH RESMI
                      </span>
                      <span className="text-[8px] bg-red-950 text-red-200 border border-red-900 px-1.5 py-0.2 rounded uppercase">
                        Dokumen Verifikasi
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-white/80">
                      <p><strong className="text-white/40 font-mono text-[10px]">Tipe:</strong> {selectedScenario.document.type}</p>
                      <p><strong className="text-white/40 font-mono text-[10px]">Judul:</strong> {selectedScenario.document.title}</p>
                      <p><strong className="text-white/40 font-mono text-[10px]">No Dokumen:</strong> <span className="font-mono bg-black/40 px-1 rounded text-amber-300">{selectedScenario.document.noDoc}</span></p>
                      <p><strong className="text-white/40 font-mono text-[10px]">Atas Nama:</strong> <span className="font-semibold text-white">{selectedScenario.document.nama}</span></p>
                      <p><strong className="text-white/40 font-mono text-[10px]">Detail/Isi:</strong> {selectedScenario.document.detail}</p>
                    </div>

                    {!isExamMode && (
                      <div className="pt-2 border-t border-white/5 text-[9px] text-amber-400 font-mono bg-amber-950/20 p-2 rounded flex items-start gap-1">
                        <BadgeInfo className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                        <span><strong>Petunjuk Penyelidikan Fraud:</strong> {selectedScenario.document.errorSubtle}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Main Message Loop */}
                {chatHistory.map((m) => (
                  <div
                    key={m.id}
                    className={`flex items-start gap-3 ${m.role === "siswa" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shadow shrink-0 ${
                      m.role === "siswa" 
                        ? "bg-[#C5A059]/10 text-[#C5A059] border border-[#C5A059]/30" 
                        : "bg-white/5 text-white/70 border border-white/10"
                    }`}>
                      {m.role === "siswa" ? studentProfile.avatar : "NS"}
                    </div>
                    
                    <div className="space-y-1 max-w-[80%]">
                      <div className={`text-[10px] font-mono text-white/40 ${m.role === "siswa" ? "text-right" : ""}`}>
                        {m.role === "siswa" ? studentProfile.nama : "Nasabah Virtual"} • {m.time}
                      </div>

                      <div className={`p-4 rounded-xl leading-relaxed text-xs shadow-md ${
                        m.role === "siswa" 
                          ? "bg-[#C5A059] text-[#0A0A0A] rounded-tr-none font-medium" 
                          : "bg-[#1A1A1A] text-white/90 rounded-tl-none border border-white/5"
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-white/40 p-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce delay-100"></span>
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-bounce delay-200"></span>
                    <span className="font-mono text-[10px] tracking-widest pl-1">Nasabah sedang bercakap...</span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* Real-time word feedback / word warnings inside Arena bottom area or above input */}
              {checkShariaWords(currentMessage) && (
                <div className="bg-red-950/30 border-y border-red-500/50 px-4 py-2 text-[10px] text-red-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Kata <strong>"{checkShariaWords(currentMessage)?.label}"</strong> tidak sesuai prinsip syariah!</span>
                  </div>
                  <span className="text-white/60">Gunakan: <strong className="text-emerald-300 font-medium">{checkShariaWords(currentMessage)?.suggest}</strong></span>
                </div>
              )}

              {/* Chat Input & Controller */}
              <div className="bg-[#1A1A1A] p-4 border-t border-white/10 space-y-3 z-10">
                <div className="flex items-center gap-3">
                  <input
                    id="input-chat"
                    type="text"
                    placeholder="Ketik pelayanan syariah Anda di sini (Sambut, tanyakan identitas, dsb)..."
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendMessage();
                    }}
                    className="flex-1 bg-black border border-white/15 focus:border-[#C5A059] rounded-lg px-4 py-3 text-xs text-white focus:outline-none placeholder:text-white/20 transition-all"
                  />
                  
                  <button
                    id="btn-kirim"
                    onClick={handleSendMessage}
                    className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold p-3 rounded-lg transition-all active:scale-95"
                    title="Kirim Pesan"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between bg-black/45 p-2 rounded text-[11px]">
                  <div className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-wider">
                    {!isExamMode && (
                      <button 
                        id="btn-hint"
                        onClick={handleRequestHint}
                        className="text-[#C5A059] hover:underline flex items-center gap-1.5"
                      >
                        <HelpCircle className="w-3.5 h-3.5" /> Minta Hint
                      </button>
                    )}
                    <span className="text-white/20">|</span>
                    <button 
                      onClick={() => {
                        if (window.confirm("Batal melakukan simulasi saat ini dan kembali ke pemilihan skenario?")) {
                          setCurrentPage("skenario");
                        }
                      }}
                      className="text-white/50 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>

                  <button
                    id="btn-akhiri-simulasi"
                    onClick={handleEndSimulation}
                    disabled={isLoading}
                    className="bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-700/60 font-mono text-[9px] tracking-widest uppercase font-bold px-3 py-1.5 rounded transition-all flex items-center gap-1.5"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Mengevaluasi...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Akhiri / Setor Nilai
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* PANEL KANAN (25% lebar) — FEEDBACK REAL-TIME */}
            <div className="lg:col-span-3 bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col justify-between space-y-6">
              
              {/* Supervisor header */}
              <div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <div className="w-7 h-7 rounded bg-[#C5A059]/10 flex items-center justify-center border border-[#C5A059]">
                    <Layers className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">📋 Evaluator Kepatuhan SOP</h4>
                </div>

                {isExamMode ? (
                  <div className="bg-red-950/20 border border-red-900 rounded p-4 text-center">
                    <ShieldAlert className="w-6 h-6 text-red-500 mx-auto mb-2" />
                    <p className="text-[10px] font-mono text-red-200 uppercase">Evaluasi Mandiri Dinonaktifkan</p>
                    <p className="text-[8px] text-red-300/50 mt-1 leading-relaxed">Petunjuk interaktif dan koreksi dilarang otomatis disembunyikan sepenuhnya selama Mode Ujian.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Live Alert Indicators */}
                    <div className="space-y-1.5 text-[11px]">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Poin Positif Layanan</span>
                      {activeSupervisorFeedback?.feedback_positif?.map((pos: string, i: number) => (
                        <div key={i} className="bg-emerald-950/30 text-emerald-300 px-2.5 py-1.5 rounded border border-emerald-900/60 flex items-start gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pos}</span>
                        </div>
                      ))}
                      {(!activeSupervisorFeedback?.feedback_positif || activeSupervisorFeedback.feedback_positif.length === 0) && (
                        <p className="text-white/30 italic">Lakukan dialog sopan untuk feedback positif.</p>
                      )}
                    </div>

                    <div className="space-y-1.5 text-[11px]">
                      <span className="text-[9px] font-mono text-white/40 uppercase block">Catatan Koreksi Prosedur</span>
                      {activeSupervisorFeedback?.peringatan?.map((warn: string, i: number) => (
                        <div key={i} className="bg-amber-950/30 text-amber-300 px-2.5 py-1.5 rounded border border-amber-900/60 flex items-start gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>{warn}</span>
                        </div>
                      ))}
                      {(!activeSupervisorFeedback?.peringatan || activeSupervisorFeedback.peringatan.length === 0) && (
                        <div className="bg-emerald-950/20 text-emerald-400 px-2.5 py-1.5 rounded border border-emerald-900/40 text-[10px]">
                          🟢 Semua prosedur berjalan baik!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sharia forbidden word listing dictionary */}
              <div className="bg-black/40 border border-white/5 rounded-lg p-3 text-[11px] leading-relaxed">
                <span className="text-[9px] font-mono text-red-400 uppercase block mb-1">Dilarang Disebut (Riba):</span>
                <div className="flex flex-wrap gap-1.5">
                  <span className="bg-red-950/60 text-red-300 border border-red-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">bunga</span>
                  <span className="bg-red-950/60 text-red-300 border border-red-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">riba</span>
                  <span className="bg-red-950/60 text-red-300 border border-red-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">denda bunga</span>
                  <span className="bg-red-950/60 text-red-300 border border-red-900/80 px-1.5 py-0.5 rounded font-mono text-[9px]">interest</span>
                </div>
              </div>

              {/* Running Score Estimation (practice only) */}
              <div className="border-t border-white/10 pt-4 leading-relaxed">
                <span className="text-[9px] font-mono text-white/40 uppercase block mb-2">Estimasi Skor Sementara</span>
                
                {isExamMode ? (
                  <p className="text-[10px] text-white/30 italic">Hanya ditampilkan saat ujian berakhir.</p>
                ) : (
                  <div className="space-y-2 text-[11px]">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span>Prosedur SOP:</span>
                        <span className="font-mono text-[#C5A059]">{activeSupervisorFeedback?.skor?.prosedur || 80}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                        <div className="bg-[#C5A059] h-1" style={{ width: `${activeSupervisorFeedback?.skor?.prosedur || 80}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span>Kepatuhan Syariah:</span>
                        <span className="font-mono text-[#C5A059]">{activeSupervisorFeedback?.skor?.syariah || 80}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1 rounded overflow-hidden">
                        <div className="bg-emerald-500 h-1" style={{ width: `${activeSupervisorFeedback?.skor?.syariah || 80}%` }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}


        {/* PAGE 6 — HALAMAN EVALUASI */}
        {currentPage === "evaluasi" && evaluationResult && selectedScenario && (
          <div id="page-evaluasi" className="max-w-4xl mx-auto w-full space-y-8 animate-fade-in">
            
            <div className="text-center border-b border-white/10 pb-6">
              <span className="text-[10px] bg-[#C5A059]/10 text-[#C5A059] px-3 py-1 rounded font-mono border border-[#C5A059]/30 uppercase">
                LAPORAN HASIL PRAKTEK VIRTUAL LAB
              </span>
              <h2 className="text-4xl font-serif text-white font-bold mt-3">Evaluasi Nilai Akhir</h2>
              <p className="text-sm text-white/50 mt-1 uppercase tracking-widest font-mono">
                {studentProfile.nama} • {selectedRole} • {selectedScenario.title}
              </p>
            </div>

            {/* Ultimate Score Counter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Grand score card */}
              <div className="md:col-span-4 bg-[#111] border border-[#C5A059]/30 rounded-xl p-6 flex flex-col justify-center items-center text-center shadow-[0_0_24px_rgba(197,160,89,0.15)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-[#C5A059]"></div>
                
                <span className="text-xs font-mono text-white/50 uppercase tracking-widest mb-2">Nilai Kompetensi</span>
                <span className="text-6xl font-serif font-black text-white mb-2">{evaluationResult.nilai_total || 80}</span>
                
                <div className="text-yellow-500 text-lg mb-1">
                  {"★".repeat(Math.ceil((evaluationResult.nilai_total || 80) / 20))}
                  {"☆".repeat(5 - Math.ceil((evaluationResult.nilai_total || 80) / 20))}
                </div>

                <p className="text-sm font-semibold uppercase text-[#C5A059] mt-2">
                  Grade: {evaluationResult.grade || "Cukup"}
                </p>
                <p className="text-[10px] text-white/40 italic">
                  "{evaluationResult.predikat || 'Pendidikan terus berlanjut'}"
                </p>
                {(evaluationResult.grade === "Excellent" || (evaluationResult.nilai_total && evaluationResult.nilai_total >= 90)) && (
                  <button
                    onClick={triggerRealisticConfetti}
                    className="mt-4 px-3 py-1.5 bg-[#C5A059]/10 hover:bg-[#C5A059]/20 border border-[#C5A059]/30 hover:border-[#C5A059]/60 text-white rounded-lg text-[10px] uppercase font-mono tracking-wider flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer hover:shadow-[0_0_12px_rgba(197,160,89,0.3)] animate-pulse"
                  >
                    <Trophy className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Rayakan Sukses 🎉</span>
                  </button>
                )}
              </div>

              {/* Competencies Progress Bars (5 Components) */}
              <div className="md:col-span-8 bg-[#111] border border-white/10 rounded-xl p-6 justify-center flex flex-col space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-2">Rincian Penilaian Aspek</h4>
                
                {[
                  { label: "Kepatuhan SOP Prosedur", score: evaluationResult.nilai_prosedur || 80, col: "bg-[#C5A059]" },
                  { label: "Penerapan Syariah (Anti Riba)", score: evaluationResult.nilai_syariah || 85, col: "bg-emerald-500" },
                  { label: "Kreativitas & Sopan Komunikasi", score: evaluationResult.nilai_komunikasi || 78, col: "bg-blue-500" },
                  { label: "Verifikasi Berkas / Analisis Risiko", score: evaluationResult.nilai_verifikasi || 80, col: "bg-purple-500" },
                  { label: "Efektivitas Kecepatan Layanan", score: evaluationResult.nilai_kecepatan || 82, col: "bg-amber-600" }
                ].map((aspek, i) => (
                  <div key={i} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-white/70">
                      <span>{aspek.label}</span>
                      <span className="font-mono font-bold text-[#E5E5E5]">{aspek.score} / 100</span>
                    </div>
                    <div className="w-full bg-[#1A1A1A] h-2 rounded-full overflow-hidden">
                      <div className={`${aspek.col} h-2 transition-all duration-1000`} style={{ width: `${aspek.score}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist SOP Outcomes */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/60">Pemeriksaan Hasil Akhir Prosedur</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {evaluationResult.checklist_terpenuhi?.map((v: string) => (
                  <div key={v} className="flex items-center gap-2 text-xs bg-emerald-950/20 text-emerald-200 border border-emerald-900/40 p-2.5 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{v}</span>
                  </div>
                ))}
                
                {evaluationResult.checklist_terlewat?.map((v: string) => (
                  <div key={v} className="flex items-center gap-2 text-xs bg-red-950/20 text-red-200 border border-red-900/40 p-2.5 rounded-lg">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />
                    <span>Lupa/Terlewat: {v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Supervisor Details Tabs (Kelebihan / Kesalahan / Catatan Syariah / Saran) */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <h4 className="text-xs font-mono uppercase tracking-wider text-white/60 mb-4">Catatan Detail Evaluasi Instruktur</h4>
              
              <div className="space-y-6">
                {/* Kelebihan */}
                <div>
                  <h5 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" /> Poin Unggul Pembawaan
                  </h5>
                  <ul className="list-disc pl-5 text-xs text-white/70 space-y-1.5">
                    {evaluationResult.kelebihan?.map((k: string, idx: number) => (
                      <li key={idx}>{k}</li>
                    ))}
                    {(!evaluationResult.kelebihan || evaluationResult.kelebihan.length === 0) && (
                      <li>Pembawaan standar dan ketaatan rata-rata.</li>
                    )}
                  </ul>
                </div>

                {/* Kesalahan */}
                <div>
                  <h5 className="text-xs font-semibold text-amber-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" /> Kesalahan Konstruksi & Referensi SOP
                  </h5>
                  <div className="space-y-3">
                    {evaluationResult.kesalahan?.map((k: any, idx: number) => (
                      <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-lg text-xs leading-relaxed">
                        <p className="text-amber-500 font-semibold mb-1 flex items-start gap-1.5">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0 text-red-500 mt-0.5" /> {k.kesalahan}
                        </p>
                        <p className="text-white/60"><strong className="text-white/40">Saran Benar:</strong> {k.yang_benar}</p>
                        {k.referensi && <p className="text-[#C5A059] text-[10px] mt-1 font-mono">Referensi: {k.referensi}</p>}
                      </div>
                    ))}
                    {(!evaluationResult.kesalahan || evaluationResult.kesalahan.length === 0) && (
                      <p className="text-xs text-emerald-400 italic">Sempurna! Tidak ada kesalahan utama terdeteksi.</p>
                    )}
                  </div>
                </div>

                {/* Catatan Syariah */}
                <div>
                  <h5 className="text-xs font-semibold text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" /> Pelanggaran Transaksi Syariah
                  </h5>
                  {evaluationResult.pelanggaran_syariah && evaluationResult.pelanggaran_syariah.length > 0 ? (
                    <ul className="list-disc pl-5 text-xs text-red-200 bg-red-950/20 p-3 rounded border border-red-900/60 space-y-1">
                      {evaluationResult.pelanggaran_syariah.map((p: string, idx: number) => (
                        <li key={idx}>{p}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-400 italic">Hebat! Anda memegang ketaatan syariah tanpa kecacatan riba sedikit pun.</p>
                  )}
                </div>

                {/* Saran */}
                <div className="bg-white/[0.02] border border-white/5 rounded-lg p-4">
                  <h5 className="text-xs font-semibold text-[#C5A059] uppercase tracking-widest mb-1.5 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4 text-[#C5A059]" /> Saran Pengembangan Instruktur
                  </h5>
                  <p className="text-xs text-white/70 leading-relaxed">{evaluationResult.saran_perbaikan}</p>
                </div>
              </div>
            </div>

            {/* REPLAY CHAT HIGHLIGHT */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-white/60">Transkrip Percakapan & Tinjau Replay</h4>
                <button
                  onClick={() => setReplayMode(!replayMode)}
                  className="text-[10px] font-mono uppercase tracking-widest text-[#C5A059] border border-[#C5A059]/40 hover:bg-[#C5A059]/10 px-3 py-1.5 rounded"
                >
                  {replayMode ? "Sembunyikan Highlight" : "Tampilkan Sorotan Replay"}
                </button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto bg-[#070707] p-4 rounded-lg border border-white/5">
                {chatHistory.map((h, i) => {
                  let highlightCol = "";
                  if (replayMode && h.role === "siswa") {
                    const hasForbidden = checkShariaWords(h.content);
                    if (hasForbidden) highlightCol = "border-l-4 border-red-500 bg-red-950/10";
                    else if (h.content.includes("salam") || h.content.includes("Assalamu")) highlightCol = "border-l-4 border-[#148F77] bg-[#148F77]/10";
                    else highlightCol = "border-l-4 border-yellow-500/50 bg-amber-950/5";
                  }
                  return (
                    <div key={i} className={`p-2.5 rounded text-xs ${highlightCol}`}>
                      <p className="text-[10px] font-mono text-white/40 mb-1">
                        {h.role === "siswa" ? studentProfile.nama : "Nasabah Virtual"} • {h.time}
                      </p>
                      <p className="text-white/80">{h.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => handleStartSimulation(selectedScenario)}
                className="w-full sm:w-auto bg-[#C5A059]/10 hover:bg-[#C5A059]/20 text-[#C5A059] border border-[#C5A059]/40 py-3.5 px-8 rounded-md font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
              >
                <RefreshCw className="w-4 h-4" /> Ulangi Skenario Ini
              </button>
              
              <button
                onClick={() => {
                  setSelectedScenario(null);
                  setCurrentPage("skenario");
                }}
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] py-3.5 px-8 rounded-md font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_4px_16px_rgba(197,160,89,0.2)]"
              >
                Pilih Skenario Lain
              </button>
            </div>
          </div>
        )}

        {/* PAGE 7 — DASHBOARD GURU */}
        {currentPage === "guru" && (
          <div id="page-guru" className="max-w-6xl mx-auto w-full space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">Panel Instruktur</span>
                <h2 className="text-3xl font-serif text-white font-bold">Portal Evaluasi & Monitoring Guru</h2>
                <p className="text-xs text-white/50 mt-1">
                  Pantau rekapitulasi ujian siswa, skor rata-rata, deteksi kesalahan terbanyak, dan rekomendasi program kelas.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearSessions}
                  className="bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-200 px-3.5 py-1.5 rounded text-xs font-mono tracking-wider flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  Reset Kelas
                </button>
                <button
                  onClick={() => setCurrentPage("skenario")}
                  className="bg-white/5 border border-white/10 hover:border-[#C5A059] text-white hover:text-[#C5A059] px-3.5 py-1.5 rounded text-xs font-mono tracking-wider"
                >
                  Dashboard Siswa
                </button>
              </div>
            </div>

            {/* Class Stats Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Sesi Selesai", val: allSessions.length, desc: "Sesi Laboratorium Aktif", textCol: "text-[#C5A059]" },
                { title: "Skor Rata-Rata Kelas", val: allSessions.length ? Math.round(allSessions.reduce((acc, s) => acc + s.nilaiTotal, 0) / allSessions.length) : 0, desc: "Bagus - Konsisten", textCol: "text-emerald-400" },
                { title: "Deteksi Fraud Berhasil", val: `${allSessions.length ? Math.round((allSessions.filter(s => [17,18,19,20].includes(s.scenarioId) && s.isExamMode).length / Math.max(1, allSessions.filter(s => [17,18,19,20].includes(s.scenarioId)).length)) * 100) : 0}%`, desc: "Patahan Fraud", textCol: "text-purple-400" },
                { title: "Ujian Sesi Khusus", val: allSessions.filter(s => s.isExamMode).length, desc: "Kepatuhan SOP Tinggi", textCol: "text-blue-400" }
              ].map((c, i) => (
                <div key={i} className="bg-[#111] border border-white/10 rounded-xl p-5 relative overflow-hidden">
                  <div className="absolute top-4 right-4 opacity-20">{getDashboardCardIcon(c.title)}</div>
                  <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{c.title}</p>
                  <p className={`text-3xl font-serif font-black ${c.textCol} mt-2`}>{c.val}</p>
                  <p className="text-[10px] text-white/50 mt-1">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* Horizontal class competencies bar chart & MATERIAL RECOMMENDATION */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* горизонтальный Kompetensi Chart */}
              <div className="lg:col-span-7 bg-[#111] border border-white/10 rounded-xl p-6">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-[#C5A059]" />
                  Grafik Rata-rata Kompetensi Kelas
                </h4>
                
                <div className="space-y-4">
                  {[
                    { label: "SOP Prosedur Pembiayaan/Tabungan", target: 84 },
                    { label: "Prinsip Ketaatan Syariah (Anti Riba)", target: 91 },
                    { label: "Etika & Kecepatan Komunikasi Ukhuwah", target: 78 },
                    { label: "Verifikasi Berkas & Tanggap Fraud", target: 82 }
                  ].map((stat, i) => {
                    // Calculate based on allSessions if available
                    let statVal = stat.target;
                    if (allSessions.length > 0) {
                      if (i === 0) statVal = Math.round(allSessions.reduce((acc, s) => acc + (s.nilaiProsedur || 80), 0) / allSessions.length);
                      if (i === 1) statVal = Math.round(allSessions.reduce((acc, s) => acc + (s.nilaiSyariah || 80), 0) / allSessions.length);
                      if (i === 2) statVal = Math.round(allSessions.reduce((acc, s) => acc + (s.nilaiKomunikasi || 80), 0) / allSessions.length);
                      if (i === 3) statVal = Math.round(allSessions.reduce((acc, s) => acc + (s.nilaiVerifikasi || 80), 0) / allSessions.length);
                    }
                    return (
                      <div key={i} className="space-y-1 text-xs">
                        <div className="flex justify-between items-center text-white/70">
                          <span>{stat.label}</span>
                          <span className="font-mono font-bold text-[#E5E5E5]">{statVal}%</span>
                        </div>
                        <div className="w-full bg-white/5 h-3 rounded overflow-hidden">
                          <div className="bg-[#C5A059] h-3 transition-all duration-700" style={{ width: `${statVal}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Rekomendasi Program / Materi */}
              <div className="lg:col-span-5 bg-[#111] border border-white/10 rounded-xl p-6 relative">
                <h4 className="text-sm font-semibold text-[#C5A059] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C5A059]" /> Analisis & Rekomendasi Pengajaran
                </h4>
                <p className="text-xs text-white/60 leading-relaxed mb-4">
                  Berdasarkan performa simulasi siswa yang saat ini terkumpul di server Virtual Lab, berikut materi pengayaan yang kami sarankan:
                </p>

                <div className="space-y-3.5 text-xs">
                  <div className="bg-[#C5A059]/5 border-l-2 border-[#C5A059] p-3 rounded">
                    <p className="font-bold text-white mb-1">Penguatan SOP Murabahah (KPR/Motor)</p>
                    <p className="text-white/50 text-[10px]">Banyak siswa melewatkan verifikasi Slip Gaji (Skenario 18) dan melompati penjelasan rinci harga perolehan.</p>
                  </div>

                  <div className="bg-[#148F77]/5 border-l-2 border-[#148F77] p-3 rounded">
                    <p className="font-bold text-white mb-1">Ukhuwah Islami & Bahasa Komunikasi</p>
                    <p className="text-white/50 text-[10px]">Tingkatkan pembetulan kesalahan sebutan kata benda dan istilah riba pada bagian CS.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FILTER PANEL & CARI SISWA */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-5 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
                {/* Search Input field */}
                <div className="relative flex-1 max-w-sm w-full">
                  <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Cari nama siswa, sekolah..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#1A1A1A] border border-white/10 focus:border-[#C5A059] rounded text-xs text-white focus:outline-none placeholder:text-white/30"
                  />
                </div>

                {/* Filter Kelas Option Select */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Kelas:</span>
                  <select
                    value={teacherClassFilter}
                    onChange={(e) => setTeacherClassFilter(e.target.value)}
                    className="bg-[#1A1A1A] border border-white/10 text-xs px-2.5 py-1.5 rounded text-white focus:outline-none cursor-pointer"
                  >
                    <option value="Semua">Semua Kelas</option>
                    <option value="X">Kelas X</option>
                    <option value="XI">Kelas XI</option>
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>

                {/* Filter Skenario Option Select */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-wider">Skenario:</span>
                  <select
                    value={teacherScenarioFilter}
                    onChange={(e) => setTeacherScenarioFilter(e.target.value)}
                    className="bg-[#1A1A1A] border border-white/10 text-xs px-2.5 py-1.5 rounded text-white focus:outline-none max-w-[200px] truncate cursor-pointer"
                  >
                    <option value="Semua">Semua Skenario</option>
                    {Array.from(new Set(allSessions.map(s => s.scenarioTitle))).map(title => (
                      <option key={title} value={title}>{title}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* CSV Export Trigger */}
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="w-full sm:w-auto px-4 py-2 bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold text-xs uppercase tracking-wider font-mono rounded flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Ekspor CSV</span>
                </button>
              </div>
            </div>

            {/* TABEL REKAP SEMUA SESI SISWA */}
            <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-6 py-4 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Rekap Hasil Kerja Lintas Sesi</h4>
                <span className="text-[10px] font-mono text-[#C5A059] bg-[#C5A059]/10 border border-[#C5A059]/30 px-2 py-0.5 rounded">
                  Sesi Tervalidasi instansi
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.02] text-white/40 tracking-wider font-mono">
                      <th className="p-4 uppercase text-[10px]">Nama Siswa</th>
                      <th className="p-4 uppercase text-[10px]">Peran</th>
                      <th className="p-4 uppercase text-[10px]">Materi / Skenario</th>
                      <th className="p-4 uppercase text-[10px] text-center">Mode</th>
                      <th className="p-4 uppercase text-[10px] text-center">Skor</th>
                      <th className="p-4 uppercase text-[10px] text-center">Grade</th>
                      <th className="p-4 uppercase text-[10px] text-center">Waktu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(() => {
                      const teacherFilteredSessions = allSessions.filter(s => {
                        const matchesSearch = s.namaSiswa.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                                              s.sekolah.toLowerCase().includes(teacherSearch.toLowerCase()) ||
                                              s.id.toLowerCase().includes(teacherSearch.toLowerCase());
                        const matchesClass = teacherClassFilter === "Semua" ? true : s.kelas === teacherClassFilter;
                        const matchesScenario = teacherScenarioFilter === "Semua" ? true : s.scenarioTitle === teacherScenarioFilter;
                        return matchesSearch && matchesClass && matchesScenario;
                      });

                      if (teacherFilteredSessions.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="p-10 text-center text-white/30 italic">Not available. Tidak ada rekap sesi praktek siswa yang sesuai kriteria filter.</td>
                          </tr>
                        );
                      }

                      return teacherFilteredSessions.map((s, idx) => (
                        <tr 
                          key={idx} 
                          onClick={() => handleSelectSessionDetail(s)}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group"
                        >
                          <td className="p-4 font-semibold text-white flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center font-mono text-[10px] font-bold text-[#C5A059] shrink-0 group-hover:bg-[#C5A059] group-hover:text-black transition-all">
                              {s.avatar}
                            </div>
                            <div>
                              <p className="group-hover:text-[#C5A059] transition-colors">{s.namaSiswa}</p>
                              <p className="text-[9px] text-white/40 font-mono font-normal">{s.sekolah} • Kelas {s.kelas}</p>
                            </div>
                          </td>
                          <td className="p-4 text-white/60 font-mono text-[11px]">{s.role}</td>
                          <td className="p-4 text-[#C5A059]">{s.scenarioTitle}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[8px] font-mono ${s.isExamMode ? 'bg-red-950 text-red-300' : 'bg-emerald-950 text-emerald-300'}`}>
                              {s.isExamMode ? "UJIAN" : "LATIHAN"}
                            </span>
                          </td>
                          <td className="p-4 text-center font-mono font-bold text-white">{s.nilaiTotal}</td>
                          <td className="p-4 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              s.grade === "Excellent" || s.grade === "Sangat Baik" ? "text-emerald-400 font-bold" :
                              s.grade === "Baik" ? "text-white" : "text-amber-500"
                            }`}>
                              {s.grade}
                            </span>
                          </td>
                          <td className="p-4 text-center text-white/40 font-mono text-[10px]">
                            {s.waktu} <br /> <span className="opacity-70 flex items-center justify-center gap-1 mt-1"><Clock className="w-3 h-3 text-white/40" /> {s.durasi}</span>
                          </td>
                        </tr>
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>

            {/* GRADUATE / TEACHER DETAILED GRADING & EVALUATION MODAL */}
            {selectedSessionForDetail && (
              <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div role="dialog" aria-modal="true" className="w-full max-w-4xl bg-[#111] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col my-8 max-h-[90vh]">
                  
                  {/* Modal Header */}
                  <div className="px-6 py-5 bg-[#1A1A1A] border-b border-white/10 flex items-center justify-between shrink-0">
                    <div>
                      <span className="text-[9px] font-mono text-[#C5A059] uppercase tracking-wider">Ulasan & Rekap Nilai Akademik</span>
                      <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                        <span>Praktek Mandiri:</span>
                        <span className="text-[#C5A059]">{selectedSessionForDetail.namaSiswa}</span>
                        <span className="text-white/40 font-normal">({selectedSessionForDetail.sekolah} • Kelas {selectedSessionForDetail.kelas})</span>
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedSessionForDetail(null)}
                      className="text-white/50 hover:text-white font-mono text-xl focus:outline-none"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Modal Scrollable Body */}
                  <div className="p-6 md:p-8 overflow-y-auto space-y-8 flex-1">
                    
                    {/* Top Meta info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#161616] border border-white/5 p-4 rounded-xl text-xs">
                      <div>
                        <p className="text-white/40 font-mono text-[9px] uppercase">Skenario Praktek</p>
                        <p className="font-semibold text-[#C5A059] mt-0.5">{selectedSessionForDetail.scenarioTitle}</p>
                      </div>
                      <div>
                        <p className="text-white/40 font-mono text-[9px] uppercase">Peran Spesialisasi</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSessionForDetail.role}</p>
                      </div>
                      <div>
                        <p className="text-white/40 font-mono text-[9px] uppercase">Metode</p>
                        <p className="font-medium mt-0.5">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono ${selectedSessionForDetail.isExamMode ? "bg-red-950 text-red-300" : "bg-emerald-950 text-emerald-300"}`}>
                            {selectedSessionForDetail.isExamMode ? "UJIAN SOP" : "LATIHAN MANDIRI"}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-white/40 font-mono text-[9px] uppercase">Selesai Pada</p>
                        <p className="font-semibold text-white mt-0.5">{selectedSessionForDetail.waktu} • Durasi {selectedSessionForDetail.durasi}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Left: Interactive Score Overrider Slider Panel */}
                      <div className="space-y-6">
                        <div className="border-b border-white/5 pb-3">
                          <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
                            <GraduationCap className="w-4 h-4" />
                            <span>Override Penilaian Instruktur</span>
                          </h4>
                          <p className="text-[10px] text-white/50 mt-1 font-sans">Ubah slider di bawah ini untuk merubah nilai secara manual. Nilai rata-rata dan grade akan dihitung otomatis oleh sistem.</p>
                        </div>

                        <div className="space-y-4 font-mono text-xs">
                          {[
                            { key: "nilaiProsedur", label: "SOP Prosedur Pembiayaan/Tabungan" },
                            { key: "nilaiSyariah", label: "Kepatuhan Syariah & Anti Riba" },
                            { key: "nilaiKomunikasi", label: "Etika Ukhuwah & Komunikasi" },
                            { key: "nilaiVerifikasi", label: "Verifikasi Berkas & Anti Fraud" },
                            { key: "nilaiKecepatan", label: "Durasi Waktu & Efisiensi" }
                          ].map(item => (
                            <div key={item.key} className="space-y-1.5 bg-[#181818] p-3 rounded-lg border border-white/5">
                              <div className="flex justify-between text-xs">
                                <span className="text-white/70 font-sans font-medium">{item.label}</span>
                                <span className="font-mono font-bold text-[#C5A059]">{tempGradingScores[item.key as keyof typeof tempGradingScores]} / 100</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={tempGradingScores[item.key as keyof typeof tempGradingScores]}
                                onChange={(e) => setTempGradingScores({
                                  ...tempGradingScores,
                                  [item.key]: Number(e.target.value)
                                })}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#C5A059]"
                              />
                            </div>
                          ))}
                        </div>

                        {/* Calculated Live Grade Box */}
                        <div className="bg-[#C5A059]/10 border border-[#C5A059]/30 rounded-lg p-4 flex items-center justify-between">
                          <div>
                            <p className="text-[9px] font-mono text-white/40 uppercase">Nilai Rata-Rata Akhir & Predikat</p>
                            <p className="text-2xl font-serif font-bold text-white mt-0.5">
                              {Math.round((tempGradingScores.nilaiProsedur + tempGradingScores.nilaiSyariah + tempGradingScores.nilaiKomunikasi + tempGradingScores.nilaiVerifikasi + tempGradingScores.nilaiKecepatan) / 5)}%
                            </p>
                          </div>
                          <span className="text-xs bg-[#C5A059] text-black font-mono font-bold px-3 py-1 rounded">
                            {(() => {
                              const avg = Math.round((tempGradingScores.nilaiProsedur + tempGradingScores.nilaiSyariah + tempGradingScores.nilaiKomunikasi + tempGradingScores.nilaiVerifikasi + tempGradingScores.nilaiKecepatan) / 5);
                              if (avg >= 90) return "EXCELLENT";
                              if (avg >= 80) return "SANGAT BAIK";
                              if (avg >= 70) return "BAIK";
                              return "CUKUP";
                            })()}
                          </span>
                        </div>

                        {/* Saran Perbaikan Text input */}
                        <div className="space-y-1.5">
                          <label className="block text-xs font-semibold text-white/70">Catatan/Instruksi Umpan Balik Guru</label>
                          <textarea
                            rows={3}
                            placeholder="Tulis umpan balik konstruktif bagi praktek siswa untuk penulisan rapor manual..."
                            value={tempSaranPerbaikan}
                            onChange={(e) => setTempSaranPerbaikan(e.target.value)}
                            className="w-full bg-[#1A1A1A] border border-white/10 focus:border-[#C5A059] rounded p-3 text-xs text-white focus:outline-none placeholder:text-white/30"
                          />
                        </div>
                      </div>

                      {/* Right: Full transcripts & logs */}
                      <div className="space-y-6">
                        {/* Conversation transcript header */}
                        <div className="border-b border-white/5 pb-3">
                          <h4 className="text-xs font-bold text-[#C5A059] uppercase tracking-wider flex items-center gap-2">
                            <BookOpen className="w-4 h-4" />
                            <span>Transkrip Percakapan Praktikum</span>
                          </h4>
                          <p className="text-[10px] text-white/50 mt-1 font-sans">Simak dialog verbatim siswa di bawah ini untuk mengidentifikasi kepatuhan Syariah dan kesopanan bahasa.</p>
                        </div>

                        {/* Transcript boxes list */}
                        <div className="bg-black/40 border border-white/10 rounded-xl max-h-[320px] overflow-y-auto p-4 space-y-3 font-sans text-xs">
                          {selectedSessionForDetail.chatHistory && selectedSessionForDetail.chatHistory.length > 0 ? (
                            selectedSessionForDetail.chatHistory.map((msg: any, mIdx: number) => {
                              if (msg.role === "system") return null;
                              const isSiswa = msg.role === "user" || msg.sender === "user" || msg.role === "siswa";
                              const nameStr = isSiswa ? selectedSessionForDetail.namaSiswa : "Nasabah";
                              return (
                                <div key={mIdx} className={`p-2.5 rounded-lg border leading-relaxed ${
                                  isSiswa 
                                    ? "bg-[#C5A059]/5 border-[#C5A059]/20 text-white/90 ml-6" 
                                    : "bg-white/5 border-white/5 text-white/80 mr-6"
                                }`}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className={`font-mono text-[9px] font-bold ${isSiswa ? "text-[#C5A059]" : "text-emerald-400"}`}>
                                      {nameStr.toUpperCase()}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-sans">{msg.content || msg.text || msg.message}</p>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-white/30 italic text-center py-10">Transkrip dialog tidak terekam dalam latihan instan ini.</p>
                          )}
                        </div>

                        {/* original dynamic analysis */}
                        <div className="bg-[#1A1A1A] rounded-xl p-4 border border-white/5 space-y-4 text-xs text-white/70">
                          <div>
                            <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-1.5">✔ Catatan Kelebihan Praktek</p>
                            {selectedSessionForDetail.kelebihan && selectedSessionForDetail.kelebihan.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1 text-white/65 text-[11px]">
                                {selectedSessionForDetail.kelebihan.map((k: string, kIdx: number) => <li key={kIdx}>{k}</li>)}
                              </ul>
                            ) : (
                              <p className="text-white/40 italic text-[11px]">Tidak ada catatan khusus yang terekam.</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-1.5">❌ Catatan Kekeliruan / Rekomendasi Syariah</p>
                            {selectedSessionForDetail.pelanggaranSyariah && selectedSessionForDetail.pelanggaranSyariah.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1 text-red-200 text-[11px] bg-red-950/20 p-2 rounded border border-red-900/10 mb-2">
                                {selectedSessionForDetail.pelanggaranSyariah.map((p: string, pIdx: number) => <li key={pIdx}>{p}</li>)}
                              </ul>
                            ) : null}
                            {selectedSessionForDetail.kesalahan && selectedSessionForDetail.kesalahan.length > 0 ? (
                              <ul className="list-disc pl-4 space-y-1 text-white/65 text-[11px]">
                                {selectedSessionForDetail.kesalahan.map((errObj: any, eIdx: number) => (
                                  <li key={eIdx}>
                                    <span className="font-semibold text-white/90">{errObj.kesalahan || errObj}</span>
                                    {errObj.yang_benar && <span className="text-emerald-400 font-sans block text-[10px]">Perbaikan SOP: {errObj.yang_benar}</span>}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-white/40 italic text-[11px]">Siswa memenuhi kriteria dasar Syariah & SOP.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="px-6 py-4 bg-[#1A1A1A] border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                    <button
                      onClick={() => setSelectedSessionForDetail(null)}
                      className="bg-transparent border border-white/10 hover:border-white/20 text-white hover:bg-white/5 py-2 px-4 rounded text-xs font-mono uppercase tracking-wider"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleSaveManualGrading}
                      className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-extrabold py-2 px-5 rounded text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5 shadow-[0_4px_16px_rgba(197,160,89,0.25)]"
                    >
                      <span>Simpan Rapor Nilai</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center">
              <button
                onClick={() => {
                  setCurrentPage("skenario");
                }}
                className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold text-xs uppercase px-8 py-3 rounded tracking-wider"
              >
                Kembali ke Skenario Siswa
              </button>
            </div>
          </div>
        )}

        {/* PAGE 8 — BANK PENGETAHUAN SYARIAH (FITUR TAMBAHAN) */}
        {currentPage === "pengetahuan" && (
          <div id="page-pengetahuan" className="max-w-4xl mx-auto w-full space-y-8">
            <div className="text-center border-b border-white/10 pb-6">
              <span className="text-[10px] text-[#C5A059] font-mono tracking-widest uppercase">Perpustakaan Syariah</span>
              <h2 className="text-3xl font-serif text-white font-bold mt-1">Bank Pengetahuan & Studi Akad</h2>
              <p className="text-sm text-white/55 mt-1 max-w-2xl mx-auto">
                Pelajari definisi rukun akad, materi kehalalan, panduan anti riba, SOP Kerja bankir, dan uji kemampuan mini kuis interaktif.
              </p>
            </div>

            {/* Knowledge tab selectors */}
            <div className="flex bg-[#111] p-1 rounded-lg border border-white/10 max-w-lg mx-auto">
              {[
                { id: "akad", label: "Kamus Akad", icon: <Award className="w-3.5 h-3.5 animate-pulse" /> },
                { id: "larangan", label: "Larangan", icon: <ShieldAlert className="w-3.5 h-3.5" /> },
                { id: "sop", label: "SOP Standar", icon: <FileText className="w-3.5 h-3.5" /> },
                { id: "latihan", label: "Uji Kuis", icon: <BookOpen className="w-3.5 h-3.5" /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setKbTab(tab.id);
                    if (tab.id === "latihan") {
                      setKuisJawabanSiswa({});
                      setKuisReview(false);
                    }
                  }}
                  className={`flex-1 py-1.5 text-center text-xs font-mono rounded tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    kbTab === tab.id ? "bg-[#C5A059] text-[#0A0A0A] font-bold shadow" : "text-white/50 hover:text-white"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab contents */}
            <div className="bg-[#111] border border-white/10 rounded-xl p-6 md:p-8">
              
              {/* Tab 1: Kamus Akad */}
              {kbTab === "akad" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {KAMUS_AKAD.map((ak, idx) => (
                      <div key={idx} className="bg-black/40 border border-white/5 rounded-xl p-5 hover:border-[#C5A059]/40 transition-colors">
                        <div className="flex items-center gap-2.5 mb-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/25 flex items-center justify-center shrink-0">
                            {getAkadIcon(ak.title)}
                          </div>
                          <h4 className="font-serif text-lg font-bold text-white">{ak.title}</h4>
                        </div>
                        <p className="text-xs text-white/70 leading-relaxed mb-4">{ak.def}</p>
                        <div className="bg-[#C5A059]/5 border-l-2 border-[#C5A059] p-3 rounded text-[10px] text-white/50">
                          <strong className="text-white">Keunggulan Atas Riba:</strong> {ak.diff}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Larangan Syariah */}
              {kbTab === "larangan" && (
                <div className="space-y-6">
                  <div className="bg-red-950/10 border border-red-900 rounded p-4 text-xs text-red-200 leading-relaxed mb-6">
                    <strong>Peringatan Syariah:</strong> Seluruh kegiatan operasional perbankan wajib bersih dari unsur Riba, Gharar, dan Maysir. Siswa dilarang keras mengucapkan kata-kata tersebut kepada nasabah virtual demi kehalalan dan keberkahan bank syariah.
                  </div>

                  <div className="space-y-4">
                    {LARANGAN_SYARIAH.map((la, idx) => (
                      <div key={idx} className="bg-black/30 border border-white/5 p-4 rounded-lg flex flex-col md:flex-row gap-4 justify-between items-start">
                        <div className="max-w-md">
                          <h4 className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                            <ShieldAlert className="w-3.5 h-3.5 text-red-400" /> {la.term}
                          </h4>
                          <p className="text-xs text-white/70 leading-relaxed">{la.desc}</p>
                        </div>
                        <div className="bg-emerald-950/20 border border-emerald-900 text-emerald-300 p-3 rounded text-[10px] max-w-sm">
                          <strong>Alternatif Syariah/SOP:</strong> {la.s_alt}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: SOP Standar */}
              {kbTab === "sop" && (
                <div className="space-y-8">
                  {SOP_STANDAR.map((sp, idx) => (
                    <div key={idx} className="border-b border-white/10 pb-6 last:border-none last:pb-0">
                      <h4 className="text-base font-serif font-bold text-white mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-[#C5A059]/10 text-[#C5A059] flex items-center justify-center text-xs font-mono">{idx + 1}</span>
                        {sp.title}
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {sp.steps.map((st, i) => (
                          <div key={i} className="bg-black/40 border border-white/5 p-3 rounded flex items-start gap-2 text-xs">
                            <span className="text-[10px] font-mono text-[#C5A059] shrink-0 mt-0.5">[{i + 1}]</span>
                            <span className="text-white/70 leading-relaxed">{st}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4: Uji Kuis Interaktif */}
              {kbTab === "latihan" && (
                <div className="space-y-8">
                  <div className="flex justify-between items-center bg-black/40 p-4 rounded-lg border border-white/5">
                    <span className="text-xs font-mono text-white/50">Wajib tuntas kuis materi sebelum magang virtual.</span>
                    {kuisReview ? (
                      <button 
                        onClick={() => {
                          setKuisJawabanSiswa({});
                          setKuisReview(false);
                        }}
                        className="text-[#C5A059] font-mono text-xs hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5" /> Ulangi Uji Kuis
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          if (Object.keys(kuisJawabanSiswa).length < KUIS_SOAL.length) {
                            if (!window.confirm("Ada soal yang belum dijawab. Apakah Anda yakin ingin memproses nilai sekarang?")) return;
                          }
                          setKuisReview(true);
                          triggerAlert("Kuis berhasil dinilai!", "success");
                        }}
                        className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] px-4 py-1.5 rounded text-xs font-mono font-bold uppercase tracking-wider"
                      >
                        Setor Hasil Kuis
                      </button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {KUIS_SOAL.map((s, idx) => {
                      const selectedAns = kuisJawabanSiswa[idx];
                      const isCorrect = selectedAns === s.jawab;
                      
                      return (
                        <div key={idx} className="bg-black/30 border border-white/5 rounded-xl p-5 space-y-4">
                          <p className="text-xs text-white/80 leading-relaxed font-serif"><strong className="text-[#C5A059] font-mono">[No {idx + 1}]</strong> {s.tanya}</p>
                          
                          <div className="space-y-2">
                            {s.opsi.map((op, oIdx) => {
                              let optStyle = "bg-[#161616] border-white/5 text-white/60 hover:border-white/10";
                              if (selectedAns === oIdx) {
                                optStyle = "bg-[#C5A059]/10 border-[#C5A059] text-[#C5A059] font-semibold";
                              }
                              
                              if (kuisReview) {
                                if (oIdx === s.jawab) {
                                  optStyle = "bg-[#148F77]/15 border-[#148F77] text-[#148F77] font-semibold";
                                } else if (selectedAns === oIdx) {
                                  optStyle = "bg-red-950/20 border-red-700 text-red-300";
                                }
                              }

                              return (
                                <button
                                  key={oIdx}
                                  type="button"
                                  onClick={() => !kuisReview && handleAnswerQuiz(idx, oIdx)}
                                  disabled={kuisReview}
                                  className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${optStyle}`}
                                >
                                  <span>{op}</span>
                                  {kuisReview && oIdx === s.jawab && <span className="text-[10px] text-emerald-400 uppercase font-mono font-bold">Kunci Benar</span>}
                                </button>
                              );
                            })}
                          </div>

                          {kuisReview && (
                            <div className="bg-white/[0.02] border border-white/5 p-3 rounded text-[11px] leading-relaxed text-white/50">
                              <span className="font-bold text-white text-[#C5A059] block mb-0.5">Penjelasan / Pembahasan:</span>
                              {s.pembahasan}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => setCurrentPage("skenario")}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded text-xs font-mono"
              >
                Kembali ke Pemilihan Skenario
              </button>
              
              <button
                onClick={() => {
                  setKbTab("latihan");
                  setKuisJawabanSiswa({});
                  setKuisReview(false);
                  triggerAlert("Silakan mulai latihan!", "info");
                }}
                className="bg-[#C5A059] hover:bg-[#B38F46] text-[#0A0A0A] font-bold px-6 py-2.5 rounded text-xs font-mono uppercase tracking-wider"
              >
                Mulai Uji Materi
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer System info */}
      <footer className="border-t border-white/10 bg-[#070707] py-4 px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between text-[9px] text-white/30 tracking-widest uppercase z-10">
        <div className="flex gap-4 mb-2 sm:mb-0">
          <span>Portal Praktikum & Layanan Perbankan Syariah</span>
          <span>•</span>
          <span>MEMENUHI STANDAR AJARAN DEWAN PENGAWAS SYARIAH NASIONAL</span>
        </div>
        <div>
          <span>SISTEM PRAKTIKUM INSTANSI PERBANKAN AKADEMIK</span>
        </div>
      </footer>
    </div>
  );
}
