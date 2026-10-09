<script setup>
import { withBase } from 'vitepress'
</script>

# 2.4 Data Cleaning dengan SQL

Di Bab 0 kamu sudah dengar: data hampir tidak pernah bersih. Kabar baiknya, 80% pekerjaan bersih-bersih bisa dikerjakan langsung di SQL, sebelum data masuk ke analisis. Dataset di halaman ini sengaja dikotori biar kamu bisa latihan.

## Kenali dulu kotornya

Langkah pertama cleaning selalu sama: **diagnosis dulu, jangan langsung bereskan.**

```sql
-- 1. ada berapa varian penulisan 'kopi susu'?
SELECT DISTINCT produk FROM transaksi;
```

Hasilnya: `'Kopi Susu'`, `'kopi susu'`, `'KOPI SUSU '`, ... padahal maksudnya satu produk yang sama.

```sql
-- 2. ada baris duplikat?
SELECT tanggal, produk, jumlah, COUNT(*) AS n
FROM transaksi
GROUP BY tanggal, produk, jumlah
HAVING n > 1;
```

```sql
-- 3. ada NULL di mana?
SELECT * FROM transaksi WHERE jumlah IS NULL OR harga IS NULL;
```

```sql
-- 4. format tanggalnya konsisten?
SELECT DISTINCT tanggal FROM transaksi;
```

Empat query diagnosis itu pola yang bisa dipakai ulang di data apa pun.

## Bereskan dengan fungsi yang sudah kamu kenal

**Standardisasi teks** (pakai `TRIM` + `LOWER`/`UPPER`):

```sql
SELECT UPPER(TRIM(produk)) AS produk_bersih, SUM(jumlah) AS terjual
FROM transaksi
GROUP BY produk_bersih;
```

Sekarang 'kopi susu', 'KOPI SUSU ', dan 'Kopi Susu' terhitung sebagai satu produk.

**NULL diganti nilai aman** (pakai `COALESCE`):

```sql
SELECT id, produk, COALESCE(jumlah, 0) AS jumlah_bersih
FROM transaksi;
```

`COALESCE` mengambil nilai pertama yang tidak `NULL`. `COALESCE(jumlah, 0)` artinya "pakai jumlah, kalau kosong anggap 0".

**Duplikat dibuang** (pakai `DISTINCT`):

```sql
SELECT DISTINCT tanggal, produk, jumlah, harga
FROM transaksi;
```

## Yang tidak bisa dibersihkan otomatis

Format tanggal di dataset ini campur: `'2024-05-01'`, `'01/05/2024'`, `'05-05-2024'`. Ini masalah beneran di dunia kerja. Solusi jujurnya:

1. Standardisasi di sumbernya (minta format yang konsisten ke yang input data).
2. Kalau terpaksa, petakan manual dengan `CASE` untuk pola yang dikenal.
3. Yang tidak dikenal polanya, tandai dan laporkan, jangan ditebak diam-diam.

Prinsipnya: **query cleaning tidak boleh mengubah data asli.** Kerjakan di query (atau tabel salinan), bukan `UPDATE` ke tabel produksi. Kalau salah bersihkan, tinggal ubah query-nya.

## Jebakan umum

- **Langsung `UPDATE`/`DELETE` di data asli.** Jangan. Selalu kerja di salinan atau di query `SELECT`.
- **Standardisasi yang kebablasan.** `UPPER` memang menyatukan 'kopi susu', tapi kalau ada 'Kopi Susu' dan 'Kopi Susu Gula Aren' yang memang produk beda, jangan asal digabung. Kenali datamu dulu (langkah diagnosis).
- **`NULL` dianggap 0 diam-diam.** `COALESCE(jumlah, 0)` itu keputusan analisis ("transaksi kosong = tidak terjual"), bukan fakta. Catat asumsi-asumsimu.

## Coba di playground

Dataset: **Data Kotor** (20 baris, sengaja dikotori).

<iframe :src="withBase('/sql-playground.html?ds=data-kotor')" class="playground-frame" title="SQL Playground: Data Kotor"></iframe>

## Latihan

1. Tampilkan semua varian penulisan produk (`SELECT DISTINCT`).
2. Ada berapa baris duplikat (tanggal + produk + jumlah yang sama)?
3. Tampilkan produk (sudah distandardisasi) dan total terjual per produk.
4. Tampilkan id, produk, dan jumlah di mana NULL sudah diganti 0.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT DISTINCT produk FROM transaksi;
-- 2
SELECT tanggal, produk, jumlah, COUNT(*) AS n FROM transaksi
GROUP BY tanggal, produk, jumlah HAVING n > 1;
-- ada 2 kelompok duplikat (Teh Manis 2024-05-03 dan 2024-05-08)
-- 3
SELECT UPPER(TRIM(produk)) AS produk, SUM(COALESCE(jumlah, 0)) AS terjual
FROM transaksi GROUP BY produk ORDER BY terjual DESC;
-- 4
SELECT id, produk, COALESCE(jumlah, 0) AS jumlah FROM transaksi;
```

</details>

---

**Selanjutnya:** [Bab 3: Studi Kasus Real](/studi-kasus-1-omzet)
