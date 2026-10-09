<script setup>
import { withBase } from 'vitepress'
</script>

# 1.3 ORDER BY dan LIMIT: Mengurutkan Data

Data yang tidak urut itu susah dibaca. `ORDER BY` mengurutkan hasil query berdasarkan kolom yang kamu pilih.

```sql
SELECT nama, harga
FROM produk
ORDER BY harga ASC;
```

`ASC` = kecil ke besar (ascending). `DESC` = besar ke kecil (descending). Kalau tidak ditulis, default-nya `ASC`.

## Urutkan lebih dari satu kolom

```sql
SELECT nama, kategori, harga
FROM produk
ORDER BY kategori ASC, harga DESC;
```

Artinya: kelompokkan dulu per kategori (A ke Z), di dalam tiap kategori urutkan harga dari yang termahal. Kolom kedua cuma dipakai buat memecah seri di kolom pertama.

## LIMIT dan OFFSET: ambil sepotong

```sql
-- 5 produk termahal
SELECT nama, harga
FROM produk
ORDER BY harga DESC
LIMIT 5;
```

```sql
-- lewati 5 pertama, ambil 5 berikutnya (halaman 2)
SELECT nama, harga
FROM produk
ORDER BY harga DESC
LIMIT 5 OFFSET 5;
```

`LIMIT` membatasi jumlah baris, `OFFSET` melewatkan sekian baris pertama. Kombinasi ini dipakai buat pagination, misalnya halaman 1, 2, 3 di aplikasi.

## NULL ikut diurutkan juga

Di dataset ini ada 2 produk yang rating-nya `NULL` (belum ada yang kasih rating). Coba:

```sql
SELECT nama, rating
FROM produk
ORDER BY rating DESC;
```

Di SQLite, `NULL` dianggap paling kecil, jadi dia nongol paling bawah saat `DESC`, paling atas saat `ASC`. Tiap database bisa beda perlakuannya, tapi polanya sama: `NULL` itu selalu spesial.

## Jebakan umum

- **`LIMIT` tanpa `ORDER BY` hasilnya acak.** Database bebas mengembalikan baris dalam urutan apa pun kalau tidak disuruh mengurutkan. "5 termahal" wajib pakai `ORDER BY harga DESC` dulu, baru `LIMIT 5`.
- **`ORDER BY` pakai nomor kolom** (`ORDER BY 2`) memang bisa, tapi rapuh: kalau urutan kolom di `SELECT` berubah, artinya ikut berubah. Tulis nama kolomnya, lebih jelas.

## Coba di playground

Dataset: **Katalog Produk** (16 produk toko kelontong online).

<iframe :src="withBase('/sql-playground.html?ds=katalog-produk')" class="playground-frame" title="SQL Playground: Katalog Produk"></iframe>

## Latihan

1. Tampilkan nama dan harga semua produk, urut dari termurah.
2. Tampilkan 3 produk dengan rating tertinggi (abaikan yang NULL).
3. Tampilkan nama, kategori, dan stok, urut berdasarkan kategori A-Z lalu stok terbesar dulu.
4. Tampilkan produk ke-6 sampai ke-10 dari urutan harga termahal (pakai `LIMIT` + `OFFSET`).

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama, harga FROM produk ORDER BY harga ASC;
-- 2
SELECT nama, rating FROM produk WHERE rating IS NOT NULL ORDER BY rating DESC LIMIT 3;
-- 3
SELECT nama, kategori, stok FROM produk ORDER BY kategori ASC, stok DESC;
-- 4
SELECT nama, harga FROM produk ORDER BY harga DESC LIMIT 5 OFFSET 5;
```

</details>

---

**Selanjutnya:** [1.4 Urutan Eksekusi Query: Cara Baca yang Benar](/sql-urutan)
