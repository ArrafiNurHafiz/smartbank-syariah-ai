import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { SCENARIOS } from "./src/scenarios";

// Load environment variables
dotenv.config();

// In-memory global log of all simulation sessions completed during the server runtime
interface SessionLog {
  id: string;
  namaSiswa: string;
  kelas: string;
  sekolah: string;
  avatar: string;
  scenarioId: number;
  scenarioTitle: string;
  role: string;
  nilaiTotal: number;
  grade: string;
  durasi: string;
  waktu: string;
  isExamMode: boolean;
  nilaiProsedur: number;
  nilaiSyariah: number;
  nilaiKomunikasi: number;
  nilaiVerifikasi: number;
  nilaiKecepatan: number;
  kelebihan: string[];
  kesalahan: Array<{ kesalahan: string; yang_benar: string; referensi: string }>;
  pelanggaranSyariah: string[];
  saranPerbaikan: string;
  chatHistory?: any[];
}

const sessionsDB: SessionLog[] = [];

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3456;

  app.use(express.json());

  // Initialize Google Gen AI
  const apiKey = process.env.GEMINI_API_KEY;
  const ai = new GoogleGenAI({
    apiKey: apiKey || "",
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });

  // Get active session lists (for Leaderboard and Teacher Dashboard)
  app.get("/api/sessions", (req, res) => {
    res.json(sessionsDB);
  });

  // Clear session lists (for reset)
  app.post("/api/sessions/clear", (req, res) => {
    sessionsDB.length = 0;
    res.json({ success: true, message: "Semua data sesi laboratorium dibersihkan." });
  });

  // Update session grades / manual feedback override
  app.post("/api/sessions/update", (req, res) => {
    const { id, nilaiProsedur, nilaiSyariah, nilaiKomunikasi, nilaiVerifikasi, nilaiKecepatan, nilaiTotal, grade, saranPerbaikan } = req.body;
    const session = sessionsDB.find((s) => s.id === id);
    if (session) {
      if (nilaiProsedur !== undefined) session.nilaiProsedur = Number(nilaiProsedur);
      if (nilaiSyariah !== undefined) session.nilaiSyariah = Number(nilaiSyariah);
      if (nilaiKomunikasi !== undefined) session.nilaiKomunikasi = Number(nilaiKomunikasi);
      if (nilaiVerifikasi !== undefined) session.nilaiVerifikasi = Number(nilaiVerifikasi);
      if (nilaiKecepatan !== undefined) session.nilaiKecepatan = Number(nilaiKecepatan);
      if (nilaiTotal !== undefined) session.nilaiTotal = Number(nilaiTotal);
      if (grade !== undefined) session.grade = grade;
      if (saranPerbaikan !== undefined) session.saranPerbaikan = saranPerbaikan;
      res.json({ success: true, session });
    } else {
      res.status(404).json({ error: "Sesi tidak ditemukan" });
    }
  });

  // Chat and Supervisor Mini parallel analyzer
  app.post("/api/simulasi/chat", async (req: any, res: any) => {
    try {
      const { scenarioId, role, chatHistory, message } = req.body;
      const scenario = SCENARIOS.find((s) => s.id === Number(scenarioId));

      if (!scenario) {
        return res.status(404).json({ error: "Skenario tidak ditemukan." });
      }

      const last3Messages = chatHistory
        .slice(-3)
        .map((m: any) => `${m.role === "siswa" ? "Siswa" : "Nasabah"}: ${m.content}`)
        .join("\n");

      // Prompt 1: Customer (Nasabah virtual) response generator
      const customerSystemPrompt = `
Kamu adalah nasabah virtual yang mengunjungi Bank Syariah dalam sebuah simulasi pembelajaran untuk siswa SMK Perbankan Syariah.

SKENARIO AKTIF: ${scenario.title}
DESKRIPSI SITUASIMU: ${scenario.nasabahContext}
KARAKTERMU: ${scenario.karakterNasabah}

ATURAN BERMAIN:
1. Berbicara natural seperti nasabah Indonesia, gunakan bahasa sehari-hari yang sopan (boleh sedikit daerah/informal).
2. Jangan langsung berikan semua informasi — berikan secara bertahap, hanya jika ditanya/diminta sesuai prosedur syariah.
3. Ajukan pertanyaan balik jika siswa tidak jelas menjelaskan atau melompati SOP.
4. Minta penjelasan lebih jika siswa pakai istilah asing/tanpa penjelasan (misal tidak menjelaskan apa itu Mudharabah atau Nisbah).
5. Reaksi emosi: bingung jika prosedur tidak jelas, senang jika dilayani dengan baik, sedikit tidak sabar jika terlalu lama/bertele-tele.
6. JIKA SKENARIO FRAUD/DETEKSI FRAUD (Skenario ID 17, 18, 19, 20): Sembunyikan inkonsistensi secara halus. JANGAN langsung mengaku bersalah. Berikan alasan-alasan palsu yang masuk akal jika ditanya secara detil. Tampak sedikit nervous jika ditekan/diajukan pertanyaan verifikasi tajam.
7. Respons kamu MAKSIMAL 3 kalimat per giliran.
8. Jika semua prosedur/checklist dalam skenario sudah diselesaikan siswa dengan baik dan benar, akhiri ucapan dengan kata persis di paling akhir kalimat: SIMULASI_SELESAI.
9. JANGAN keluar dari karakter apapun yang terjadi.
10. Jangan pernah membantu siswa dengan memberikan jawaban yang seharusnya diucapkan oleh siswa.
`;

      const formattedConversation = chatHistory
        .map((m: any) => `${m.role === "siswa" ? "Siswa" : "Nasabah"}: ${m.content}`)
        .join("\n");

      const customerPrompt = `
Berikut adalah transkrip percakapan sejauh ini:
${formattedConversation}
Siswa baru saja mengetik pesan berikut: " ${message} "

Tugasmu: Berikan respons selanjutnya sebagai Nasabah sesuai dengan karakter dan aturan bermain di atas. Ingat! Maksimal 3 kalimat.
`;

      // Prompt 2: AI Supervisor Mini (Real-time feedback)
      const supervisorSystemPrompt = `
Kamu adalah asisten supervisor perbankan syariah yang memberikan feedback singkat dan cepat untuk siswa yang sedang melakukan simulasi laboratorium.

Analisis pesan terbaru dari siswa dan berikan input feedback langsung serta penilaian.
Perhatikan kata terlarang dalam perbankan syariah:
- "bunga" -> harusnya "nisbah bagi hasil" atau "margin keuntungan"
- "riba" -> tidak sesuai prinsip syariah
- "kasis denda" atau "denda" -> dalam denda komersial dilarang, diprioritaskan "ta'zir" (ganti rugi dana sosial)
- "kredit konvensional" atau "pinjaman berbunga"

Analisis pesan siswa dan balas HANYA dalam format JSON berikut:
{
  "feedback_positif": ["array maksimal 2 string singkat kelebihan pesan ini"],
  "peringatan": ["array maksimal 2 string singkat hal yang kurang atau saran koreksi"],
  "kata_terlarang": ["array kata tidak syariah yang ditemukan dalam pesan siswa"],
  "skor": {
    "prosedur": "skor kecocokan SOP saat ini 0-100",
    "syariah": "skor kepantasan prinsip syariah 0-100",
    "komunikasi": "skor cara berbicara 0-100"
  }
}

PERAN SISWA: ${role}
SKENARIO: ${scenario.title}
CHECKLIST SOP YANG HARUS DICAPAI: ${scenario.checklist.join(", ")}
PESAN TERBARU SISWA: ${message}
KONTEKS 3 PESAN SEBELUMNYA:
${last3Messages || "(Awal simulasi)"}
`;

      // Parallel execution of Nasabah Response + Supervisor Mini Feedback
      const [customerRes, supervisorRes] = await Promise.all([
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: customerPrompt,
          config: {
            systemInstruction: customerSystemPrompt,
            temperature: 0.7,
          },
        }),
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: "Berikan evaluasi real-time singkat dalam bentuk JSON.",
          config: {
            systemInstruction: supervisorSystemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                feedback_positif: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                peringatan: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                kata_terlarang: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                skor: {
                  type: Type.OBJECT,
                  properties: {
                    prosedur: { type: Type.INTEGER },
                    syariah: { type: Type.INTEGER },
                    komunikasi: { type: Type.INTEGER },
                  },
                  required: ["prosedur", "syariah", "komunikasi"],
                },
              },
              required: ["feedback_positif", "peringatan", "kata_terlarang", "skor"],
            },
          },
        }),
      ]);

      const customerText = customerRes.text || "Baik, silakan.";
      let feedbackJson = {
        feedback_positif: ["Pelayanan dimulai"],
        peringatan: [],
        kata_terlarang: [],
        skor: { prosedur: 80, syariah: 80, komunikasi: 80 },
      };

      try {
        if (supervisorRes.text) {
          feedbackJson = JSON.parse(supervisorRes.text.trim());
        }
      } catch (err) {
        console.error("Gagal melakukan parse feedback JSON:", err);
      }

      res.json({
        customerResponse: customerText,
        supervisorFeedback: feedbackJson,
      });
    } catch (error: any) {
      console.error("Error dalam obrolan virtual:", error);
      res.status(500).json({ error: error.message || "Umpan balik sistem terganggu." });
    }
  });

  // End evaluation generator
  app.post("/api/simulasi/evaluasi", async (req: any, res: any) => {
    try {
      const {
        studentProfile,
        scenarioId,
        role,
        chatHistory,
        durationSeconds,
        isExamMode,
      } = req.body;
      const scenario = SCENARIOS.find((s) => s.id === Number(scenarioId));

      if (!scenario) {
        return res.status(404).json({ error: "Skenario tidak ditemukan." });
      }

      const formattedTranscript = chatHistory
        .map((m: any) => `${m.role === "siswa" ? "Siswa" : "Nasabah"}: ${m.content}`)
        .join("\n");

      const systemInstruction = `
Kamu adalah AI Supervisor Bank Syariah senior yang mengevaluasi kinerja siswa SMK Perbankan Syariah di Laboratorium Virtual.
Kamu harus meninjau transkrip obrolan secara mendalam dan mengidentifikasi keberhasilan atau kesalahan yang terjadi sesuai prinsip perbankan syariah dan SOP operasional.

Skenario: ${scenario.title}
Checklist SOP yang Seharusnya Dipenuhi:
${scenario.checklist.map((c, i) => `${i + 1}. ${c}`).join("\n")}

Analisislah transkrip obrolan di bawah ini dengan cermat. Berikan penilaian kompetensi dalam bentuk angka 0-100 untuk kategori:
1. Prosedur SOP (Apakah langkah-langkah wajib dijalani)
2. Kepatuhan Syariah (Apakah menggunakan istilah halal, akad yang tepat, menghindari kata bunga/riba)
3. Komunikasi Layanan (Kramahan, salam islami, kesabaran)
4. Verifikasi Data (Kehati-hatian mengecek data, KTP/berkas, terutama di skenario fraud)
5. Kecepatan Layanan (Kelancaran alur simulasi)

Keluarkan hasil evaluasi HANYA dalam bentuk JSON yang sesuai dengan skema yang didefinisikan secara ketat tanpa markdown pembungkus.
`;

      const contents = `
Berikut adalah transkrip obrolan simulasi:
${formattedTranscript}

Durasi Simulasi: ${durationSeconds} detik.
Mode Ujian: ${isExamMode ? "Ya (Tanpa Bantuan Hint)" : "Tidak (Dengan Bantuan SOP & Hint)"}

Lakukan evaluasi total yang mencakup:
- Nilai dari masing-masing 5 aspek evaluasi di atas.
- Item checklist mana yang berhasil dilakukan siswa (checklist_terpenuhi) dan mana yang terlewat (checklist_terlewat) dari total checklist SOP skenario ini.
- Kelebihan, kesalahan detail (dengan koreksi dan referensi syariah), pelanggaran syariah (jika ada), kata terlarang yang digunakan.
- Rekomendasi belajar kedepannya.
- Khusus skenario Deteksi Fraud (ID 17-20), tentukan apakah nasabah diidentifikasi sebagai pelaku fraud dengan benar atau tidak (deteksi_fraud_berhasil).

Kirim respons JSON yang detail dan lengkap.
`;

      const evalRes = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              nilai_prosedur: { type: Type.INTEGER },
              nilai_syariah: { type: Type.INTEGER },
              nilai_komunikasi: { type: Type.INTEGER },
              nilai_verifikasi: { type: Type.INTEGER },
              nilai_kecepatan: { type: Type.INTEGER },
              nilai_total: { type: Type.INTEGER },
              grade: { type: Type.STRING },
              predikat: { type: Type.STRING },
              checklist_terpenuhi: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              checklist_terlewat: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              kelebihan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              kesalahan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    kesalahan: { type: Type.STRING },
                    yang_benar: { type: Type.STRING },
                    referensi: { type: Type.STRING },
                  },
                  required: ["kesalahan", "yang_benar", "referensi"],
                },
              },
              pelanggaran_syariah: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              kata_terlarang_digunakan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              saran_perbaikan: { type: Type.STRING },
              rekomendasi_belajar: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              deteksi_fraud_berhasil: { type: Type.BOOLEAN },
              catatan_fraud: { type: Type.STRING },
            },
            required: [
              "nilai_prosedur",
              "nilai_syariah",
              "nilai_komunikasi",
              "nilai_verifikasi",
              "nilai_kecepatan",
              "nilai_total",
              "grade",
              "predikat",
              "checklist_terpenuhi",
              "checklist_terlewat",
              "kelebihan",
              "kesalahan",
              "pelanggaran_syariah",
              "kata_terlarang_digunakan",
              "saran_perbaikan",
              "rekomendasi_belajar",
            ],
          },
        },
      });

      let evaluationData: any = {};
      if (evalRes.text) {
        evaluationData = JSON.parse(evalRes.text.trim());
      } else {
        throw new Error("Tidak ada evaluasi teks yang dihasilkan.");
      }

      // Format duration
      const minutes = Math.floor(durationSeconds / 60);
      const seconds = durationSeconds % 60;
      const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

      // Save to server-side session logs for the class stats & teacher view
      const newSession: SessionLog = {
        id: Math.random().toString(36).substring(2, 9).toUpperCase(),
        namaSiswa: studentProfile.nama || "Siswa Virtual",
        kelas: studentProfile.kelas || "X",
        sekolah: studentProfile.sekolah || "SMK Perbankan Syariah",
        avatar: studentProfile.avatar || "CS",
        scenarioId: Number(scenarioId),
        scenarioTitle: scenario.title,
        role: role,
        nilaiTotal: evaluationData.nilai_total || 80,
        grade: evaluationData.grade || "Baik",
        durasi: formattedDuration,
        waktu: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        isExamMode: isExamMode,
        nilaiProsedur: evaluationData.nilai_prosedur || 80,
        nilaiSyariah: evaluationData.nilai_syariah || 80,
        nilaiKomunikasi: evaluationData.nilai_komunikasi || 80,
        nilaiVerifikasi: evaluationData.nilai_verifikasi || 80,
        nilaiKecepatan: evaluationData.nilai_kecepatan || 80,
        kelebihan: evaluationData.kelebihan || [],
        kesalahan: evaluationData.kesalahan || [],
        pelanggaranSyariah: evaluationData.pelanggaran_syariah || [],
        saranPerbaikan: evaluationData.saran_perbaikan || "",
        chatHistory: chatHistory || [],
      };

      sessionsDB.unshift(newSession);

      res.json({
        evaluation: evaluationData,
        sessionLog: newSession,
      });
    } catch (error: any) {
      console.error("Error dalam evaluasi akhir:", error);
      res.status(500).json({ error: error.message || "Proses evaluasi sistem terganggu." });
    }
  });

  // Serve static files / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SmartBank Syariah Server running on port ${PORT}`);
  });
}

startServer();
