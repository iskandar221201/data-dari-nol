# Bab 0: Persiapan

Sebelum menyentuh tools, pahami dulu cara kerja seorang analis data. Tools bisa dipelajari dalam hitungan minggu. Cara berpikirnya yang butuh dilatih terus.

## 1. Kerja analis itu seperti apa

Pola kerjanya hampir selalu sama:

1. **Ada pertanyaan.** Contoh: "Kenapa penjualan bulan lalu turun?"
2. **Cari datanya.** Data penjualan ada di mana? Lengkap atau ada yang hilang?
3. **Bersihkan.** Format tanggal berantakan, ada baris ganda, nama produk ditulis beda-beda.
4. **Analisis.** Hitung, bandingkan, cari pola.
5. **Sampaikan.** Jawab pertanyaan awal dengan bukti, bukan opini.

Perhatikan: menulis query atau rumus itu cuma langkah 4. Sebagian besar waktu analis habis di langkah 2, 3, dan 5.

## 2. Tiga kebiasaan yang wajib dilatih

**Tanya "dibanding apa?"**
Angka sendirian tidak punya arti. "Penjualan 500 juta" itu besar atau kecil? Dibanding bulan lalu? Dibanding target? Selalu cari pembanding sebelum menyimpulkan.

**Curigai datamu sendiri.**
Data hampir tidak pernah bersih. Sebelum analisis, cek: ada nilai kosong? Ada duplikat? Satuannya konsisten? Kesimpulan dari data kotor itu menyesatkan, serapi apa pun chart-nya.

**Jawab dengan satu kalimat dulu.**
Sebelum bikin dashboard 10 halaman, latih dirimu menjawab pertanyaan dalam satu kalimat: "Penjualan turun karena produk X kehabisan stok di minggu ketiga." Kalau satu kalimatnya belum jelas, visualisasinya juga tidak akan jelas.

## 3. Perkakas yang dipakai di buku ini

| Perkakas | Dipakai untuk | Bab |
|---|---|---|
| SQL | Mengambil dan mengolah data dari database | Bab 1 |
| Python (pandas) | Data besar dan analisis berulang | Bab 2 |
| Statistik dasar | Memastikan kesimpulanmu valid | Bab 3 |
| Visualisasi / dashboard | Menyampaikan temuan | Bab 4 |

Kamu tidak perlu install apa pun untuk Bab 0 dan Bab 1. SQL-nya bisa dipraktikkan langsung di playground tiap halaman, yang berjalan di browser.

## 4. Latihan Bab 0

1. Tulis satu pertanyaan tentang bisnismu, kampusmu, atau komunitasmu yang jawabannya butuh data. Contoh: "Hari apa warung kopi paling ramai?"
2. Untuk pertanyaan itu, tulis data apa saja yang kamu butuhkan dan dari mana kamu bisa mendapatkannya.
3. Tulis satu kalimat jawaban sementara (hipotesis), lalu tulis data apa yang bisa membuktikan kamu salah.

Tidak ada jawaban benar atau salah di sini. Tujuannya melatih otot bertanya.

---

**Selanjutnya:** [Bab 1: SQL](/sql-select)
