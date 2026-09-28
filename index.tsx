import React, { useState, useEffect } from 'react';

// --- SHARED DATA & CONSTANTS ---
const DEFAULT_LOGO = "https://placehold.co/150x150/065f46/ffffff?text=MA+NU";
const KKM = 76;
const EXAM_DURATION = 90 * 60; // 90 minutes in seconds

// Matching Options (Jawaban untuk soal menjodohkan)
const MATCHING_OPTIONS = [
  "Qana'ah (Merasa cukup)",
  "Israf (Berlebih-lebihan)",
  "Tabzir (Pemborosan)",
  "Husnudzon (Berprasangka baik)",
  "Sabar dalam musibah",
  "Sabar dalam ketaatan",
  "Sabar menjauhi maksiat",
  "Tawakkal (Berserah diri)",
  "Menyantuni Dhuafa",
  "Pola Hidup Sederhana"
];

// 40 Soal Kontekstual
const INITIAL_QUESTIONS = [
  // PILIHAN GANDA (1-15) - Bobot 2.5 poin
  { id: 1, type: 'pg', topic: 'Sederhana', text: "Keluarga Pak Budi memiliki penghasilan yang sangat besar setiap bulannya. Namun, mereka memilih untuk menggunakan kendaraan yang fungsional, tidak membeli barang-barang branded yang tidak perlu, dan rutin mengalokasikan dananya untuk panti asuhan di sekitar rumah. Sikap keluarga Pak Budi ini mencerminkan pengamalan dari nilai...", options: ["A. Zuhud yang berlebihan", "B. Pola hidup sederhana dan peduli sosial", "C. Mencari popularitas di masyarakat", "D. Menghindari pajak kekayaan", "E. Sikap pelit terhadap diri sendiri"], answer: "B. Pola hidup sederhana dan peduli sosial" },
  { id: 2, type: 'pg', topic: 'Sederhana', text: "Saat mengadakan pesta pernikahan, keluarga Bu Aminah memesan makanan porsi besar yang akhirnya banyak tersisa dan terbuang sia-sia ke tempat sampah, padahal banyak tetangganya yang kesulitan ekonomi. Perilaku ini sangat dilarang dalam Islam karena termasuk...", options: ["A. Bakhil", "B. Qana'ah", "C. Tabzir", "D. Riya'", "E. Sum'ah"], answer: "C. Tabzir" },
  { id: 3, type: 'pg', topic: 'Dhuafa', text: "Ahmad melihat seorang kakek tua yang kesulitan mencari makan. Ia kemudian menyisihkan uang sakunya untuk membelikan nasi bungkus tanpa menceritakannya kepada teman-temannya. Tindakan Ahmad ini adalah bentuk implementasi dari perintah...", options: ["A. Menyantuni dhuafa dengan ikhlas", "B. Membayar zakat fitrah", "C. Menjalankan puasa sunnah", "D. Membangun fasilitas umum", "E. Menjaga tali silaturahmi antar kerabat"], answer: "A. Menyantuni dhuafa dengan ikhlas" },
  { id: 4, type: 'pg', topic: 'Positif', text: "Rina sudah belajar siang dan malam untuk menghadapi ujian masuk perguruan tinggi. Namun, saat pengumuman, namanya tidak tercantum. Rina tersenyum dan berkata, 'Mungkin Allah menyiapkan tempat yang lebih baik untukku di kampus lain'. Sikap Rina ini merupakan contoh dari...", options: ["A. Pesimis", "B. Takabbur", "C. Husnudzon kepada Allah", "D. Su'udzon kepada takdir", "E. Putus asa"], answer: "C. Husnudzon kepada Allah" },
  { id: 5, type: 'pg', topic: 'Sabar', text: "Desa tempat tinggal Pak Hasan dilanda banjir bandang yang menghancurkan sebagian rumahnya. Bukannya marah atau menyalahkan pemerintah, ia justru memimpin warga untuk saling bergotong royong membersihkan sisa banjir sambil terus berdzikir. Pak Hasan menunjukkan sikap...", options: ["A. Sabar dalam ketaatan", "B. Sabar dalam menghadapi musibah", "C. Sabar dari kemaksiatan", "D. Syukur atas nikmat", "E. Pasrah tanpa usaha"], answer: "B. Sabar dalam menghadapi musibah" },
  { id: 6, type: 'pg', topic: 'Sederhana', text: "Dalam Al-Qur'an Surah Al-Furqan ayat 67, dijelaskan bahwa ciri hamba Allah (Ibadurrahman) ketika membelanjakan hartanya adalah...", options: ["A. Membeli barang mewah agar dihormati", "B. Menyumbangkan seluruh hartanya tanpa sisa", "C. Tidak berlebihan dan tidak kikir (proporsional)", "D. Menahan hartanya rapat-rapat untuk masa depan", "E. Menggunakan harta hanya untuk ibadah haji"], answer: "C. Tidak berlebihan dan tidak kikir (proporsional)" },
  { id: 7, type: 'pg', topic: 'Positif', text: "Seorang pedagang mengalami kerugian besar karena tertipu rekan bisnisnya. Alih-alih depresi, ia meyakini bahwa di balik kesulitan ini pasti ada hikmah dan jalan keluar asalkan ia terus berusaha dan berdoa. Pola pikir pedagang ini disebut...", options: ["A. Fatalisme", "B. Hedonisme", "C. Berpikir positif (Optimis)", "D. Apatis", "E. Materialistis"], answer: "C. Berpikir positif (Optimis)" },
  { id: 8, type: 'pg', topic: 'Sabar', text: "Setiap pagi, meskipun cuaca sangat dingin, Fulan selalu bangun untuk melaksanakan shalat Subuh berjamaah di masjid tanpa mengeluh. Perjuangan Fulan ini dikategorikan sebagai...", options: ["A. Sabar menghadapi cobaan", "B. Sabar dalam melaksanakan ketaatan", "C. Sabar meninggalkan larangan", "D. Disiplin waktu duniawi", "E. Toleransi beragama"], answer: "B. Sabar dalam melaksanakan ketaatan" },
  { id: 9, type: 'pg', topic: 'Dhuafa', text: "Membantu tetangga yang kekurangan tidak selalu dengan uang. Ketika Bu Fatimah memberikan pakaian layak pakai dan kelebihan hasil panennya kepada tetangganya yang miskin, ia telah mengamalkan ajaran tentang...", options: ["A. Hibah bersyarat", "B. Wakaf produktif", "C. Kepedulian terhadap kaum dhuafa", "D. Menghindari pajak", "E. Riba"], answer: "C. Kepedulian terhadap kaum dhuafa" },
  { id: 10, type: 'pg', topic: 'Sederhana', text: "Islam melarang umatnya bersikap bakhil (kikir) karena sifat ini akan berdampak buruk dalam kehidupan sosial, yaitu...", options: ["A. Menjadikan orang tersebut kaya raya", "B. Mempererat hubungan pertemanan", "C. Menimbulkan kesenjangan dan kecemburuan sosial", "D. Melatih mental berhemat", "E. Mencegah terjadinya inflasi"], answer: "C. Menimbulkan kesenjangan dan kecemburuan sosial" },
  { id: 11, type: 'pg', topic: 'Positif', text: "Saat mendengar berita buruk yang belum jelas kebenarannya tentang temannya, Zaid memilih untuk melakukan tabayyun (klarifikasi) terlebih dahulu dan tidak langsung menyebarkannya. Sikap Zaid didasari oleh...", options: ["A. Ketakutan akan hukum ITE", "B. Husnudzon terhadap sesama muslim", "C. Sikap masa bodoh terhadap teman", "D. Mencari celah kesalahan teman", "E. Keinginan untuk menjadi pahlawan"], answer: "B. Husnudzon terhadap sesama muslim" },
  { id: 12, type: 'pg', topic: 'Sabar', text: "Ujian dan cobaan (seperti ketakutan, kelaparan, kekurangan harta) yang disebutkan dalam Q.S. Al-Baqarah: 155 pada hakikatnya bertujuan untuk...", options: ["A. Menyiksa manusia atas dosa-dosanya di masa lalu", "B. Menguji kualitas keimanan dan kesabaran hamba-Nya", "C. Mengurangi populasi manusia di bumi", "D. Membuat manusia membenci dunia", "E. Menjauhkan manusia dari rahmat Allah"], answer: "B. Menguji kualitas keimanan dan kesabaran hamba-Nya" },
  { id: 13, type: 'pg', topic: 'Sederhana', text: "Sebagai pelajar, Dina selalu membawa bekal air minum dan makanan dari rumah daripada membeli jajan yang mahal di kantin. Uang sakunya ditabung. Perilaku Dina mencontohkan sifat...", options: ["A. Pelit", "B. Qana'ah dan Sederhana", "C. Anti-sosial", "D. Sombong", "E. Ingin dipuji guru"], answer: "B. Qana'ah dan Sederhana" },
  { id: 14, type: 'pg', topic: 'Dhuafa', text: "Orang yang menghardik anak yatim dan tidak menganjurkan memberi makan orang miskin, dalam Q.S. Al-Ma'un disebut sebagai...", options: ["A. Orang yang beruntung", "B. Pendusta agama", "C. Orang yang lemah iman", "D. Pelaku dosa kecil", "E. Orang musyrik"], answer: "B. Pendusta agama" },
  { id: 15, type: 'pg', topic: 'Sabar', text: "Pemuda itu diajak teman-temannya untuk mengonsumsi minuman keras saat pesta, namun ia menolak dengan tegas meskipun diejek. Keteguhan pemuda ini adalah contoh dari...", options: ["A. Sabar dalam ketaatan", "B. Sabar menjauhi kemaksiatan", "C. Sabar menghadapi musibah", "D. Lemahnya pergaulan", "E. Takut kepada hukum negara"], answer: "B. Sabar menjauhi kemaksiatan" },

  // PILIHAN GANDA KOMPLEKS (16-30) - Bobot 2.5 poin (Pilih lebih dari 1)
  { id: 16, type: 'pgk', topic: 'Sederhana', text: "Manakah dari pernyataan berikut yang merupakan wujud penerapan pola hidup sederhana di era digital modern ini? (Pilih 2 jawaban benar)", options: ["A. Membeli smartphone keluaran terbaru setiap tahun", "B. Menggunakan paket data sesuai kebutuhan produktif", "C. Selalu update barang fashion agar viral di medsos", "D. Memperbaiki laptop lama yang masih bisa berfungsi", "E. Berhutang pinjol demi makan di restoran mewah"], answers: ["B. Menggunakan paket data sesuai kebutuhan produktif", "D. Memperbaiki laptop lama yang masih bisa berfungsi"] },
  { id: 17, type: 'pgk', topic: 'Dhuafa', text: "Bentuk nyata menyantuni dhuafa yang bisa dilakukan oleh seorang siswa SMA/MA adalah... (Pilih 2 jawaban benar)", options: ["A. Membangun panti asuhan mewah", "B. Menyisihkan uang saku untuk infaq Jumat", "C. Membantu memberikan bimbel gratis bagi anak jalanan", "D. Mempekerjakan kaum dhuafa dengan gaji UMR", "E. Menjual harta warisan untuk disumbangkan"], answers: ["B. Menyisihkan uang saku untuk infaq Jumat", "C. Membantu memberikan bimbel gratis bagi anak jalanan"] },
  { id: 18, type: 'pgk', topic: 'Positif', text: "Sikap yang mencerminkan Husnudzon kepada Allah ketika mengalami kegagalan lomba adalah... (Pilih 2 jawaban benar)", options: ["A. Meyakini bahwa usahanya sudah sia-sia", "B. Mengevaluasi kekurangan untuk perbaikan masa depan", "C. Merasa juri bersikap curang kepadanya", "D. Menyadari bahwa Allah mungkin menyelamatkannya dari sifat sombong", "E. Berhenti mengikuti segala macam perlombaan"], answers: ["B. Mengevaluasi kekurangan untuk perbaikan masa depan", "D. Menyadari bahwa Allah mungkin menyelamatkannya dari sifat sombong"] },
  { id: 19, type: 'pgk', topic: 'Sabar', text: "Ketika seseorang divonis mengidap penyakit berat, respons yang sejalan dengan ajaran kesabaran Islam adalah... (Pilih 2 jawaban benar)", options: ["A. Segera mencari pengobatan medis dan alternatif secara halal", "B. Menolak diobati karena pasrah pada takdir", "C. Memperbanyak doa dan dzikir memohon kesembuhan", "D. Mengeluh di media sosial setiap hari", "E. Menyalahkan lingkungan yang tidak bersih"], answers: ["A. Segera mencari pengobatan medis dan alternatif secara halal", "C. Memperbanyak doa dan dzikir memohon kesembuhan"] },
  { id: 20, type: 'pgk', topic: 'Sederhana', text: "Dampak negatif dari gaya hidup 'Israf' (berlebih-lebihan) bagi masyarakat adalah... (Pilih 2 jawaban benar)", options: ["A. Memutar roda perekonomian menjadi lebih cepat", "B. Menguras sumber daya alam secara tidak bertanggung jawab", "C. Menciptakan kesenjangan sosial yang tajam", "D. Meningkatkan kesejahteraan kaum dhuafa", "E. Melatih masyarakat menjadi pekerja keras"], answers: ["B. Menguras sumber daya alam secara tidak bertanggung jawab", "C. Menciptakan kesenjangan sosial yang tajam"] },
  { id: 21, type: 'pgk', topic: 'Positif', text: "Ciri-ciri orang yang memiliki pola pikir positif (optimis) dalam kehidupan sehari-hari adalah... (Pilih 2 jawaban benar)", options: ["A. Mudah menyerah jika menemui jalan buntu", "B. Melihat peluang dan hikmah dalam setiap kesulitan", "C. Selalu tersenyum meskipun sedang menipu orang", "D. Fokus pada solusi, bukan pada masalah", "E. Menggantungkan harapan sepenuhnya pada bantuan orang lain"], answers: ["B. Melihat peluang dan hikmah dalam setiap kesulitan", "D. Fokus pada solusi, bukan pada masalah"] },
  { id: 22, type: 'pgk', topic: 'Sabar', text: "Contoh implementasi 'Sabar dalam Ketaatan' di lingkungan sekolah adalah... (Pilih 2 jawaban benar)", options: ["A. Sabar menunggu bel pulang agar bisa membolos", "B. Melawan rasa kantuk untuk mendengarkan penjelasan guru", "C. Sabar menahan diri untuk tidak membully teman", "D. Rutin mengikuti kegiatan shalat Dhuha berjamaah di sekolah", "E. Diam saja ketika ada teman yang mencontek"], answers: ["B. Melawan rasa kantuk untuk mendengarkan penjelasan guru", "D. Rutin mengikuti kegiatan shalat Dhuha berjamaah di sekolah"] },
  { id: 23, type: 'pgk', topic: 'Dhuafa', text: "Ancaman bagi mereka yang menelantarkan dan tidak mempedulikan kaum dhuafa/anak yatim adalah... (Pilih 2 jawaban benar)", options: ["A. Dicap sebagai pendusta agama", "B. Hartanya akan berlipat ganda", "C. Didoakan kebaikan oleh para malaikat", "D. Akan mendapatkan kehinaan dan siksa dari Allah", "E. Menjadi pemimpin di masyarakat"], answers: ["A. Dicap sebagai pendusta agama", "D. Akan mendapatkan kehinaan dan siksa dari Allah"] },
  { id: 24, type: 'pgk', topic: 'Sederhana', text: "Menurut Q.S. Al-Isra' ayat 27, orang-orang yang melakukan pemborosan (Tabzir) disamakan statusnya dengan... (Pilih 2 jawaban benar)", options: ["A. Saudara-saudara setan", "B. Teman-teman malaikat", "C. Orang yang kufur nikmat", "D. Pewaris para nabi", "E. Orang yang beruntung"], answers: ["A. Saudara-saudara setan", "C. Orang yang kufur nikmat"] },
  { id: 25, type: 'pgk', topic: 'Positif', text: "Manfaat kesehatan mental dari membiasakan diri 'Berprasangka Baik' (Husnudzon) antara lain... (Pilih 2 jawaban benar)", options: ["A. Hati menjadi lebih tenang dan damai", "B. Mudah merasa curiga dan waspada", "C. Menghilangkan rasa cemas berlebihan", "D. Membuat kita mudah dimanfaatkan orang", "E. Meningkatkan sikap ambisius yang buta"], answers: ["A. Hati menjadi lebih tenang dan damai", "C. Menghilangkan rasa cemas berlebihan"] },
  { id: 26, type: 'pgk', topic: 'Sabar', text: "Dalam Q.S. Al-Baqarah: 156, kalimat istirja' ('Inna lillahi wa inna ilaihi raji'un') diucapkan ketika... (Pilih 2 jawaban benar)", options: ["A. Mendapatkan hadiah tak terduga", "B. Mengalami musibah atau bencana", "C. Kehilangan barang berharga", "D. Lulus ujian dengan nilai baik", "E. Melihat keindahan alam"], answers: ["B. Mengalami musibah atau bencana", "C. Kehilangan barang berharga"] },
  { id: 27, type: 'pgk', topic: 'Sederhana', text: "Alasan Islam sangat menekankan pola hidup sederhana meskipun kaya raya adalah... (Pilih 2 jawaban benar)", options: ["A. Karena harta dunia hanya titipan sementara", "B. Agar uang tidak berputar di masyarakat", "C. Untuk melatih empati terhadap yang miskin", "D. Karena Islam anti terhadap kekayaan materi", "E. Untuk menghindari pencurian semata"], answers: ["A. Karena harta dunia hanya titipan sementara", "C. Untuk melatih empati terhadap yang miskin"] },
  { id: 28, type: 'pgk', topic: 'Dhuafa', text: "Kelompok masyarakat yang paling berhak dan harus diprioritaskan untuk disantuni menurut Al-Qur'an adalah... (Pilih 2 jawaban benar)", options: ["A. Pejabat pemerintahan", "B. Anak-anak yatim piatu", "C. Pengemis yang pura-pura cacat", "D. Orang-orang miskin yang menahan diri dari meminta-minta", "E. Artis yang sedang turun pamor"], answers: ["B. Anak-anak yatim piatu", "D. Orang-orang miskin yang menahan diri dari meminta-minta"] },
  { id: 29, type: 'pgk', topic: 'Positif', text: "Ketika dihadapkan pada situasi krisis finansial keluarga, remaja yang berpikir positif akan... (Pilih 2 jawaban benar)", options: ["A. Mencari kerja sampingan tanpa mengganggu sekolah", "B. Memaksa orang tua membelikan kuota internet", "C. Mengurangi uang jajan dan menabung", "D. Lari dari rumah mencari kebebasan", "E. Terjerumus dalam pergaulan bebas"], answers: ["A. Mencari kerja sampingan tanpa mengganggu sekolah", "C. Mengurangi uang jajan dan menabung"] },
  { id: 30, type: 'pgk', topic: 'Sabar', text: "Sikap yang BENAR dalam menghadapi cobaan pandemi atau wabah penyakit adalah... (Pilih 2 jawaban benar)", options: ["A. Bersabar dan mengikuti protokol kesehatan (ikhtiar)", "B. Meyakini ini teguran agar manusia kembali kepada Allah", "C. Menyalahkan bangsa asing secara membabi buta", "D. Keluar rumah sengaja mencari penyakit karena merasa kebal", "E. Menimbun bahan makanan sebanyak-banyaknya"], answers: ["A. Bersabar dan mengikuti protokol kesehatan (ikhtiar)", "B. Meyakini ini teguran agar manusia kembali kepada Allah"] },

  // MENJODOHKAN (31-40) - Bobot 2.5 poin
  { id: 31, type: 'jodoh', text: "Pak Ramlan merasa bersyukur dan cukup dengan gaji bulanannya yang pas-pasan, tanpa iri dengan tetangganya.", answer: "Qana'ah (Merasa cukup)" },
  { id: 32, type: 'jodoh', text: "Bu Sita membeli makanan mahal hanya untuk difoto dan dibuang karena tidak suka rasanya.", answer: "Tabzir (Pemborosan)" },
  { id: 33, type: 'jodoh', text: "Saat usahanya bangkrut, Aldi tidak menyalahkan Tuhan dan terus berikhtiar mencari peluang baru.", answer: "Sabar dalam musibah" },
  { id: 34, type: 'jodoh', text: "Meskipun sangat mengantuk dan cuaca dingin, Ani tetap bangun di sepertiga malam untuk Tahajud.", answer: "Sabar dalam ketaatan" },
  { id: 35, type: 'jodoh', text: "Faisal diajak teman-temannya berjudi, namun ia menolak keras dan segera pulang ke rumah.", answer: "Sabar menjauhi maksiat" },
  { id: 36, type: 'jodoh', text: "Tari selalu menyisihkan 10% dari uang jajannya untuk dibagikan ke fakir miskin setiap hari Jumat.", answer: "Menyantuni Dhuafa" },
  { id: 37, type: 'jodoh', text: "Setelah belajar mati-matian untuk UTBK, Doni menyerahkan sepenuhnya hasil ujiannya kepada Allah.", answer: "Tawakkal (Berserah diri)" },
  { id: 38, type: 'jodoh', text: "Meskipun temannya sering berbuat salah, Ustadz Amir selalu percaya bahwa temannya bisa berubah menjadi lebih baik.", answer: "Husnudzon (Berprasangka baik)" },
  { id: 39, type: 'jodoh', text: "Keluarga Pak RT menggunakan listrik dan air seperlunya saja, tidak membiarkan lampu menyala di siang hari.", answer: "Pola Hidup Sederhana" },
  { id: 40, type: 'jodoh', text: "Mengkonsumsi vitamin secara berlebihan melebihi dosis anjuran dokter sehingga merusak ginjal.", answer: "Israf (Berlebih-lebihan)" }
];

export default function App() {
  const [view, setView] = useState('login'); // login, admin, exam, result
  const [role, setRole] = useState('student'); // student, admin
  const [user, setUser] = useState(null); 
  const [questions, setQuestions] = useState(INITIAL_QUESTIONS);
  const [logoUrl, setLogoUrl] = useState(DEFAULT_LOGO);
  const [adminPassword, setAdminPassword] = useState('admin123');
  
  // Exam States
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION);
  const [examResult, setExamResult] = useState(null);
  const [modal, setModal] = useState({ show: false, message: '', onConfirm: null });

  // Load configuration from local storage on mount
  useEffect(() => {
    const savedLogo = localStorage.getItem('pts_logo');
    const savedQuestions = localStorage.getItem('pts_questions');
    const savedAdminPass = localStorage.getItem('pts_admin_pass');
    
    if (savedLogo) setLogoUrl(savedLogo);
    if (savedQuestions) setQuestions(JSON.parse(savedQuestions));
    if (savedAdminPass) setAdminPassword(savedAdminPass);
  }, []);

  // Timer logic
  useEffect(() => {
    let timerId;
    if (view === 'exam' && timeLeft > 0) {
      timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (view === 'exam' && timeLeft <= 0) {
      handleFinishExam();
    }
    return () => clearInterval(timerId);
  }, [view, timeLeft]);

  const customAlert = (message, onConfirm = null) => {
    setModal({ show: true, message, onConfirm });
  };

  const handleLogin = (e, loginRole) => {
    e.preventDefault();
    if (loginRole === 'admin') {
      const username = e.target.username.value;
      const password = e.target.password.value;
      if (username === 'admin' && password === adminPassword) {
        setRole('admin');
        setUser({ name: 'Administrator', isDummy: false });
        setView('admin');
      } else {
        customAlert("Username atau password admin salah!");
      }
    } else {
      const name = e.target.name.value.trim();
      const studentClass = e.target.studentClass.value;
      const presensi = e.target.presensi.value.trim();

      if (!name || !presensi || studentClass !== 'XII') {
        customAlert("Mohon isi semua data dengan benar! (Kelas wajib XII)");
        return;
      }

      const attemptKey = `pts_attempt_${name}_${presensi}`;
      const attempts = parseInt(localStorage.getItem(attemptKey) || '0');

      if (attempts >= 3) {
        customAlert(`Maaf, siswa ${name} sudah mencapai batas maksimal pengerjaan (3 kali).`);
        return;
      }

      setRole('student');
      setUser({ name, studentClass, presensi, attemptKey, attempts: attempts + 1 });
      startExam();
    }
  };

  const startExam = () => {
    setAnswers({});
    setTimeLeft(EXAM_DURATION);
    setView('exam');
  };

  const handleAdminTestExam = () => {
    setUser({ name: 'Admin (Ujicoba)', studentClass: 'XII', presensi: '00', isDummy: true });
    startExam();
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (!userAnswer) return;

      if (q.type === 'pg') {
        if (userAnswer === q.answer) score += 2.5;
      } else if (q.type === 'pgk') {
        // Strict matching for PGK: array must exactly match
        const isCorrect = Array.isArray(userAnswer) && 
                          userAnswer.length === q.answers.length && 
                          userAnswer.every(val => q.answers.includes(val));
        if (isCorrect) score += 2.5;
      } else if (q.type === 'jodoh') {
        if (userAnswer === q.answer) score += 2.5;
      }
    });
    return score;
  };

  const handleFinishExam = () => {
    const finalScore = calculateScore();
    const isPassed = finalScore >= KKM;

    if (user && !user.isDummy) {
      localStorage.setItem(user.attemptKey, user.attempts.toString());
    }

    setExamResult({ score: finalScore, isPassed });
    setView('result');
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const LoginView = () => {
    const [tab, setTab] = useState('student');

    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden">
          <div className="bg-green-700 p-6 text-center text-white">
            <img src={logoUrl} alt="Logo" className="w-20 h-20 mx-auto rounded-full border-2 border-white mb-4 object-cover" />
            <h1 className="text-xl font-bold">Penilaian Tengah Semester</h1>
            <h2 className="text-sm font-medium opacity-90">Al-Qur'an Hadist Kelas XII</h2>
            <p className="text-xs mt-1">MA. Mu'allimin NU Kota Malang</p>
            <p className="text-xs mt-1 italic">Disusun oleh: Damat, S.Ag., S.Pd.</p>
          </div>
          
          <div className="flex border-b">
            <button className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'student' ? 'text-green-700 border-b-2 border-green-700 bg-green-50' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setTab('student')}>Siswa</button>
            <button className={`flex-1 py-3 text-sm font-semibold transition-colors ${tab === 'admin' ? 'text-green-700 border-b-2 border-green-700 bg-green-50' : 'text-gray-500 hover:bg-gray-50'}`} onClick={() => setTab('admin')}>Admin/Guru</button>
          </div>

          <div className="p-6">
            {tab === 'student' ? (
              <form onSubmit={(e) => handleLogin(e, 'student')} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                  <input type="text" name="name" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Masukkan nama lengkap" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kelas</label>
                  <select name="studentClass" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
                    <option value="XII">Kelas XII</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">No. Presensi (Password)</label>
                  <input type="number" name="presensi" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" placeholder="Masukkan no presensi" />
                </div>
                <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg border border-yellow-200">
                  <p>Catatan: Siswa hanya memiliki kesempatan 3 kali pengerjaan.</p>
                </div>
                <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors">Mulai Ujian</button>
              </form>
            ) : (
              <form onSubmit={(e) => handleLogin(e, 'admin')} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username Admin</label>
                  <input type="text" name="username" required defaultValue="admin" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <input type="password" name="password" required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                </div>
                <button type="submit" className="w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 rounded-lg transition-colors">Login Admin</button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  const AdminView = () => {
    const [adminTab, setAdminTab] = useState('soal');
    const [newPass, setNewPass] = useState('');
    const [newLogo, setNewLogo] = useState(logoUrl);

    const saveSettings = () => {
      if (newPass) {
        setAdminPassword(newPass);
        localStorage.setItem('pts_admin_pass', newPass);
      }
      setLogoUrl(newLogo);
      localStorage.setItem('pts_logo', newLogo);
      customAlert("Pengaturan berhasil disimpan!");
    };

    return (
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-gray-800 p-6 flex justify-between items-center text-white">
            <div>
              <h1 className="text-2xl font-bold">Dashboard Admin</h1>
              <p className="text-sm opacity-80">MA. Mu'allimin NU Kota Malang</p>
            </div>
            <div className="flex gap-4">
              <button onClick={handleAdminTestExam} className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                ▶ Ujicoba Ujian
              </button>
              <button onClick={() => setView('login')} className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg font-semibold text-sm transition-colors">
                Keluar
              </button>
            </div>
          </div>
          
          <div className="flex border-b bg-gray-50">
            <button className={`px-6 py-4 font-semibold ${adminTab === 'soal' ? 'text-gray-800 border-b-2 border-gray-800 bg-white' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setAdminTab('soal')}>Manajemen Soal</button>
            <button className={`px-6 py-4 font-semibold ${adminTab === 'settings' ? 'text-gray-800 border-b-2 border-gray-800 bg-white' : 'text-gray-500 hover:bg-gray-200'}`} onClick={() => setAdminTab('settings')}>Pengaturan Aplikasi</button>
          </div>

          <div className="p-6">
            {adminTab === 'soal' ? (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold">Daftar Soal ({questions.length} Soal)</h2>
                  <p className="text-sm text-gray-500">Edit dilakukan via JSON array untuk kepraktisan massal</p>
                </div>
                <textarea 
                  className="w-full h-96 p-4 border rounded-lg font-mono text-sm bg-gray-50 focus:ring-2 focus:ring-gray-800 outline-none"
                  defaultValue={JSON.stringify(questions, null, 2)}
                  onChange={(e) => {
                    try {
                      const parsed = JSON.parse(e.target.value);
                      setQuestions(parsed);
                      localStorage.setItem('pts_questions', JSON.stringify(parsed));
                    } catch(err) {
                      // ignore parse errors while typing
                    }
                  }}
                />
                <p className="text-xs text-green-600 mt-2">*Perubahan tersimpan otomatis (Local Storage) jika format JSON valid.</p>
              </div>
            ) : (
              <div className="max-w-md space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Logo Sekolah</label>
                  <input type="text" value={newLogo} onChange={(e)=>setNewLogo(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none" />
                  {newLogo && <img src={newLogo} alt="Preview" className="w-16 h-16 mt-2 border rounded" />}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password Admin Baru</label>
                  <input type="text" placeholder="Kosongkan jika tidak ingin diubah" value={newPass} onChange={(e)=>setNewPass(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-800 outline-none" />
                </div>
                <button onClick={saveSettings} className="bg-gray-800 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-900">Simpan Pengaturan</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ExamView = () => {
    
    const handlePgChange = (qId, option) => {
      setAnswers(prev => ({ ...prev, [qId]: option }));
    };

    const handlePgkChange = (qId, option, isChecked) => {
      setAnswers(prev => {
        const currentAns = prev[qId] || [];
        if (isChecked) {
          return { ...prev, [qId]: [...currentAns, option] };
        } else {
          return { ...prev, [qId]: currentAns.filter(ans => ans !== option) };
        }
      });
    };

    const handleMatchChange = (qId, value) => {
      setAnswers(prev => ({ ...prev, [qId]: value }));
    };

    const confirmSubmit = () => {
      const answeredCount = Object.keys(answers).length;
      if (answeredCount < questions.length) {
        customAlert(`Anda baru menjawab ${answeredCount} dari ${questions.length} soal. Yakin ingin mengumpulkan?`, () => handleFinishExam());
      } else {
        customAlert("Yakin ingin menyelesaikan ujian?", () => handleFinishExam());
      }
    };

    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        {/* Exam Header */}
        <div className="bg-white shadow-md sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-full object-cover border" />
              <div>
                <h1 className="font-bold text-gray-800 text-sm md:text-base">PTS Al-Qur'an Hadist XII</h1>
                <p className="text-xs text-gray-500">{user?.name} ({user?.presensi}) {user?.isDummy && <span className="text-red-500 font-bold">[MODE UJICOBA]</span>}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className={`px-4 py-2 rounded-lg font-mono font-bold text-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-800'}`}>
                ⏱ {formatTime(timeLeft)}
              </div>
              <button onClick={confirmSubmit} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors hidden md:block">
                Selesai
              </button>
            </div>
          </div>
        </div>

        {/* Question Container */}
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-6 mb-20">
          <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border-l-4 border-green-600">
            <h2 className="font-bold text-lg text-gray-800">Petunjuk Pengerjaan:</h2>
            <ul className="list-decimal ml-5 text-sm text-gray-600 mt-2 space-y-1">
              <li>Soal 1-15: Pilihan Ganda (Pilih 1 jawaban paling tepat)</li>
              <li>Soal 16-30: Pilihan Ganda Kompleks (Pilih 2 jawaban yang benar)</li>
              <li>Soal 31-40: Menjodohkan (Pilih pasangan pernyataan yang tepat)</li>
              <li>Pastikan memeriksa kembali jawaban sebelum waktu habis.</li>
            </ul>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex gap-4">
                  <div className="bg-gray-100 w-10 h-10 flex items-center justify-center rounded-lg font-bold text-gray-700 shrink-0">
                    {index + 1}
                  </div>
                  <div className="w-full">
                    <p className="text-gray-800 font-medium text-base leading-relaxed mb-4">{q.text}</p>
                    
                    {/* Render PG */}
                    {q.type === 'pg' && (
                      <div className="space-y-2">
                        {q.options.map((opt, i) => (
                          <label key={i} className={`flex items-start p-3 border rounded-xl cursor-pointer transition-colors ${answers[q.id] === opt ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'}`}>
                            <input type="radio" name={`q_${q.id}`} value={opt} checked={answers[q.id] === opt} onChange={() => handlePgChange(q.id, opt)} className="mt-1 w-4 h-4 text-green-600 focus:ring-green-500" />
                            <span className="ml-3 text-gray-700 text-sm">{opt}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Render PG Kompleks */}
                    {q.type === 'pgk' && (
                      <div className="space-y-2">
                        <p className="text-xs text-blue-600 font-semibold mb-2">*Pilih dua jawaban benar</p>
                        {q.options.map((opt, i) => {
                          const isChecked = answers[q.id]?.includes(opt) || false;
                          return (
                            <label key={i} className={`flex items-start p-3 border rounded-xl cursor-pointer transition-colors ${isChecked ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'}`}>
                              <input type="checkbox" checked={isChecked} onChange={(e) => handlePgkChange(q.id, opt, e.target.checked)} className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                              <span className="ml-3 text-gray-700 text-sm">{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    {/* Render Menjodohkan */}
                    {q.type === 'jodoh' && (
                      <div className="mt-3">
                        <select 
                          value={answers[q.id] || ''} 
                          onChange={(e) => handleMatchChange(q.id, e.target.value)}
                          className="w-full md:w-1/2 p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-sm bg-gray-50 text-gray-700"
                        >
                          <option value="" disabled>-- Pilih Pasangan yang Tepat --</option>
                          {MATCHING_OPTIONS.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Submit FAB */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
           <button onClick={confirmSubmit} className="w-full bg-green-600 shadow-xl text-white py-4 rounded-xl font-bold text-lg">
             Kumpulkan Jawaban
           </button>
        </div>
      </div>
    );
  };

  const ResultView = () => {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 print:bg-white print:p-0">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full text-center print:shadow-none print:w-full print:max-w-none">
          
          <div className="print:block hidden mb-8 text-center border-b-2 border-black pb-4">
            <img src={logoUrl} alt="Logo" className="w-24 h-24 mx-auto mb-2" />
            <h1 className="text-2xl font-bold uppercase">Hasil Penilaian Tengah Semester</h1>
            <h2 className="text-xl">Al-Qur'an Hadist Kelas XII</h2>
            <p className="text-sm">MA. Mu'allimin NU Kota Malang - Disusun oleh Damat, S.Ag., S.Pd.</p>
          </div>

          {!document.body.classList.contains('print-mode') && (
            <div className="mb-6 print:hidden">
               {examResult.isPassed ? (
                 <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">✓</div>
               ) : (
                 <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-4xl mb-4">!</div>
               )}
            </div>
          )}
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nilai Anda</h2>
          <div className="text-6xl font-black my-6 text-gray-900">{examResult.score.toFixed(1)}</div>
          
          <div className="bg-gray-50 rounded-xl p-4 mb-6 border text-left">
            <p className="text-sm text-gray-600 mb-1">Nama Siswa <span className="float-right font-bold text-gray-800">{user?.name}</span></p>
            <p className="text-sm text-gray-600 mb-1">Kelas <span className="float-right font-bold text-gray-800">{user?.studentClass}</span></p>
            <p className="text-sm text-gray-600 mb-1">No. Presensi <span className="float-right font-bold text-gray-800">{user?.presensi}</span></p>
            <hr className="my-2" />
            <p className="text-sm text-gray-600 mb-1">Status KKM (76) 
              <span className={`float-right font-bold ${examResult.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {examResult.isPassed ? 'TUNTAS' : 'BELUM TUNTAS'}
              </span>
            </p>
          </div>

          <div className="flex gap-4 justify-center print:hidden">
            <button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-colors">
              🖨 Download / Cetak
            </button>
            <button onClick={() => {
              setView('login');
              setUser(null);
            }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-bold transition-colors">
              Kembali ke Login
            </button>
          </div>

          <div className="hidden print:block mt-20 text-right">
             <p className="mb-16">Malang, {new Date().toLocaleDateString('id-ID')}</p>
             <p className="font-bold border-b border-black inline-block w-48 text-center pb-1">Guru Pengampu</p>
             <p className="mt-1">Damat, S.Ag., S.Pd.</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Print styles block to hide UI elements when printing */}
      <style>{`
        @media print {
          body { -webkit-print-color-adjust: exact; background: white; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
          .print\\:bg-white { background-color: white !important; }
          .print\\:shadow-none { box-shadow: none !important; }
        }
      `}</style>

      {/* Main View Router */}
      {view === 'login' && <LoginView />}
      {view === 'admin' && <AdminView />}
      {view === 'exam' && <ExamView />}
      {view === 'result' && <ResultView />}

      {/* Custom Modal for Alerts/Confirms */}
      {modal.show && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] p-4">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{modal.message}</h3>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => setModal({ show: false, message: '', onConfirm: null })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-semibold"
              >
                {modal.onConfirm ? 'Batal' : 'Tutup'}
              </button>
              {modal.onConfirm && (
                <button 
                  onClick={() => {
                    modal.onConfirm();
                    setModal({ show: false, message: '', onConfirm: null });
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold"
                >
                  Ya, Lanjutkan
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}