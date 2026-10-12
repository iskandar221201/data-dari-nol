# Kata Pengantar

> **Catatan edisi terjemahan.** Halaman ini adalah terjemahan bebas + interpretasi dari *Think Stats, 2nd Edition* karya **Allen B. Downey** (Green Tea Press), yang dilisensikan di bawah [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Buku aslinya gratis dan bisa diunduh di [thinkstats2.com](https://thinkstats2.com). Terjemahan ini dibuat untuk tujuan edukasi non-komersial; seluruh atribusi tetap milik penulis asli. Istilah teknis dipertahankan dalam bahasa Inggris saat pertama muncul, lalu dijelaskan dalam bahasa Indonesia.

Buku ini adalah pengantar ke perkakas praktis **exploratory data analysis (EDA)** — analisis data eksploratif. Urutan babnya mengikuti alur yang biasa dipakai penulisnya setiap kali mulai bekerja dengan sebuah dataset:

1. **Import dan cleaning.** Data apapun formatnya, biasanya butuh waktu dan usaha untuk dibaca, dibersihkan, ditransformasi, dan dipastikan tidak ada yang hilang di tengah jalan.
2. **Eksplorasi satu variabel.** Biasanya mulai dari memeriksa satu variabel dalam satu waktu: cari tahu arti tiap variabel, lihat distribusinya, lalu pilih statistik ringkasan yang tepat.
3. **Eksplorasi berpasangan.** Untuk menemukan kemungkinan hubungan antar variabel, lihat tabel dan scatter plot, lalu hitung korelasi dan garis tren linear.
4. **Analisis multivariat.** Kalau kelihatan ada hubungan antar variabel, pakai regresi berganda untuk menambah variabel kontrol dan menyelidiki hubungan yang lebih kompleks.
5. **Estimasi dan uji hipotesis.** Saat melaporkan hasil statistik, ada tiga pertanyaan yang wajib dijawab: seberapa besar efeknya? Seberapa besar variasi yang wajar kalau pengukuran yang sama diulang? Mungkinkah efek yang terlihat ini cuma kebetulan?
6. **Visualisasi.** Selama eksplorasi, visualisasi adalah alat penting untuk menemukan kemungkinan hubungan dan efek. Lalu kalau sebuah efek terbukti kuat setelah diuji, visualisasi adalah cara paling efektif untuk menyampaikannya.

Buku ini memakai **pendekatan komputasional**, bukan pendekatan matematis. Ada beberapa keuntungannya:

- Sebagian besar ide disajikan lewat **kode Python**, bukan notasi matematika. Kode Python umumnya lebih mudah dibaca; dan karena bisa dieksekusi, kamu bisa mengunduhnya, menjalankannya, dan memodifikasinya sendiri.
- Setiap bab punya **latihan** yang bisa kamu kerjakan untuk memantapkan pemahaman. Saat menulis program, kamu menuangkan pemahamanmu ke dalam kode; saat men-debug program, kamu sekaligus mengoreksi pemahamanmu.
- Beberapa latihan berupa **eksperimen** untuk menguji perilaku statistik. Contoh: kamu bisa mengeksplorasi Teorema Limit Pusat (Central Limit Theorem) dengan membangkitkan sampel acak dan menghitung jumlahnya. Visualisasi hasilnya menunjukkan kenapa teorema itu bekerja — dan kapan tidak.
- Beberapa ide yang susah dipahami secara matematis justru **gampang dipahami lewat simulasi**. Contoh: kita mengaproksimasi *p-value* dengan menjalankan simulasi acak, yang justru mempertegas arti p-value itu sendiri.
- Karena bukunya berbasis bahasa pemrograman umum (Python), kamu bisa **mengimpor data dari hampir semua sumber**. Tidak terbatas pada dataset yang sudah dibersihkan dan diformat untuk tools statistik tertentu.

Buku ini cocok untuk pendekatan **berbasis proyek**. Di kelasnya, mahasiswa mengerjakan proyek satu semester: mengajukan pertanyaan statistik, mencari dataset yang bisa menjawabnya, lalu menerapkan setiap teknik yang dipelajari ke datanya sendiri.

Untuk menunjukkan pendekatannya, buku ini memakai satu **studi kasus yang berjalan di semua bab**, memakai data dari dua sumber:

- **National Survey of Family Growth (NSFG)**, survei yang dilakukan CDC Amerika untuk mengumpulkan "informasi tentang kehidupan keluarga, pernikahan dan perceraian, kehamilan, infertilitas, penggunaan kontrasepsi, dan kesehatan pria dan wanita."
- **Behavioral Risk Factor Surveillance System (BRFSS)**, survei untuk "melacak kondisi kesehatan dan perilaku berisiko di Amerika Serikat."

Contoh lain memakai data dari IRS (pajak), sensus AS, dan Boston Marathon.

::: tip 💡 Konteks Indonesia
NSFG dan BRFSS itu survei nasional Amerika. Padanan terdekatnya di Indonesia: **Susenas** (Survei Sosial Ekonomi Nasional) dan **Riskesdas** (Riset Kesehatan Dasar) dari BPS/Kemenkes. Pola datanya mirip — ribuan responden, ratusan variabel, banyak nilai yang perlu dibersihkan. Jadi setiap kali buku ini menyebut NSFG, bayangkan kamu sedang mengoprek data Susenas.
:::

Edisi kedua ini memuat bab-bab edisi pertama (banyak yang direvisi besar-besaran) plus bab baru tentang **regresi, analisis deret waktu (time series), analisis survival, dan metode analitik**. Edisi sebelumnya belum memakai pandas, SciPy, atau StatsModels — jadi semua materi itu baru di edisi ini.

## 0.1 Kenapa buku ini ditulis beda

Saat orang menulis buku teks baru, biasanya mereka mulai dengan membaca tumpukan buku teks lama. Hasilnya, kebanyakan buku berisi materi yang sama dengan urutan yang mirip.

Penulisnya tidak melakukan itu. Bahkan, ia hampir tidak memakai materi cetak sama sekali saat menulis buku ini, karena beberapa alasan:

- Tujuannya adalah **menjelajahi pendekatan baru** untuk materi ini, jadi ia tidak mau terlalu terpapar pendekatan yang sudah ada.
- Karena buku ini dirilis di bawah **lisensi gratis**, ia ingin memastikan tidak ada bagian buku yang terbebani batasan hak cipta.
- Banyak pembaca bukunya **tidak punya akses ke perpustakaan materi cetak**, jadi ia berusaha merujuk ke sumber yang bebas tersedia di internet.
- Sebagian pendukung media lama menganggap pemakaian eksklusif sumber elektronik itu malas dan tidak bisa diandalkan. Mungkin benar soal yang pertama, tapi ia yakin mereka salah soal yang kedua — jadi ia ingin menguji teorinya.

Sumber yang paling sering ia pakai adalah **Wikipedia**. Secara umum, artikel-artikel Wikipedia tentang topik statistik sangat bagus (walau ia membuat beberapa perubahan kecil di sana-sini). Ia menyertakan referensi ke halaman Wikipedia di seluruh buku dan menganjurkanmu mengikuti tautan-tautannya; dalam banyak kasus, halaman Wikipedia melanjutkan tepat di titik di mana penjelasannya berhenti. Kosakata dan notasi di buku ini umumnya konsisten dengan Wikipedia, kecuali ia punya alasan bagus untuk menyimpang. Sumber lain yang ia anggap berguna: Wolfram MathWorld dan forum statistik Reddit.

## 0.2 Menjalankan kodenya

Kode dan data yang dipakai buku ini tersedia di [github.com/AllenDowney/ThinkStats2](https://github.com/AllenDowney/ThinkStats2).

> **Catatan penerjemah:** bagian asli buku ini ditulis era Python 2 (sekitar 2014). Di bawah ini sudah disesuaikan ke praktik modern — intinya sama, caranya diperbarui.

Cara paling gampang mengikuti buku ini:

1. **Install Python 3** (versi berapa pun yang masih didukung) — Python 2 sudah pensiun sejak 2020, jadi abaikan semua sebutan Python 2 di buku asli.
2. Install paket yang dibutuhkan:
   - **pandas** — untuk merepresentasikan dan menganalisis data
   - **NumPy** — untuk komputasi numerik dasar
   - **SciPy** — untuk komputasi saintifik termasuk statistik
   - **StatsModels** — untuk regresi dan analisis statistik lainnya
   - **matplotlib** — untuk visualisasi
3. Cara termudah: install **Anaconda** (distribusi Python gratis yang sudah mencakup semua paket di atas), atau pakai `pip install pandas numpy scipy statsmodels matplotlib` di virtual environment.

::: tip 💡 Konteks Indonesia
Kalau kamu belum pernah install Python sama sekali, mulai dari Bab 4 (Python) di situs ini dulu sebelum masuk ke seri terjemahan ini. Seri Think Stats ini mengasumsikan kamu sudah nyaman dengan dasar Python — persis seperti asumsi buku aslinya.
:::

Buku ini mengasumsikan pembaca **familiar dengan Python inti** (termasuk fitur object-oriented), tapi belum tentu familiar dengan pandas, NumPy, dan SciPy. Kalau kamu sudah kenal modul-modul itu, beberapa bagian bisa di-skip.

Dari sisi matematika, diasumsikan kamu tahu **matematika dasar** — termasuk logaritma dan penjumlahan (notasi sigma). Konsep kalkulus disinggung di beberapa tempat, tapi kamu tidak perlu mengerjakan kalkulus.

Kalau kamu belum pernah belajar statistik, penulisnya bilang buku ini tempat yang bagus untuk mulai. Dan kalau kamu pernah ikut kelas statistik tradisional, ia berharap buku ini bisa "memperbaiki kerusakannya".

— *Allen B. Downey*

---

**Selanjutnya:** [Bab 1 — Analisis Data Eksploratif](/thinkstats-bab-01)
