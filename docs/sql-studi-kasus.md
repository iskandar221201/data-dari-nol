<script setup>
import { withBase } from 'vitepress'
</script>

# 1.9 Studi Kasus: Toko Online

Saatnya merangkai semuanya. Kamu adalah analis di sebuah toko online kecil. Owner-nya datang dengan 5 pertanyaan bisnis. Datanya ada di playground bawah (3 tabel: `pelanggan`, `produk`, `pesanan`). Jawab semuanya dengan query.

Aturan main: coba dulu sendiri sebelum buka kunci jawabannya. Buntu itu bagian dari belajar.

## Pertanyaan 1: Berapa total omzet bulan Maret 2024?

Paling dasar. Butuh gabung tabel `pesanan` dan `produk` karena harga ada di tabel produk.

<details>
<summary>Kunci jawaban</summary>

```sql
SELECT SUM(ps.jumlah * pr.harga) AS total_omzet
FROM pesanan ps
JOIN produk pr ON ps.id_produk = pr.id;
```

Hasil: 4.610.000.

</details>

## Pertanyaan 2: Produk apa yang paling laris (berdasarkan jumlah terjual)?

Butuh `GROUP BY` per produk, urutkan dari yang terbesar.

<details>
<summary>Kunci jawaban</summary>

```sql
SELECT pr.nama, SUM(ps.jumlah) AS total_terjual
FROM pesanan ps
JOIN produk pr ON ps.id_produk = pr.id
GROUP BY pr.nama
ORDER BY total_terjual DESC;
```

Hasil: Kaos Polos (10), Kemeja Flanel (8), Celana Jeans (4), sisanya 1-2. Jam Tangan tidak muncul sama sekali karena belum pernah laku, `INNER JOIN` menyaringnya keluar.

</details>

## Pertanyaan 3: Kota mana yang menyumbang omzet terbesar?

Sekarang gabung tiga tabel: pesanan ke pelanggan (buat kotanya), pesanan ke produk (buat harganya).

<details>
<summary>Kunci jawaban</summary>

```sql
SELECT pl.kota, SUM(ps.jumlah * pr.harga) AS omzet
FROM pesanan ps
JOIN pelanggan pl ON ps.id_pelanggan = pl.id
JOIN produk pr ON ps.id_produk = pr.id
GROUP BY pl.kota
ORDER BY omzet DESC;
```

Hasil: Cirebon (1.555.000), Majalengka (1.480.000), Kuningan (1.000.000), Indramayu (575.000).

</details>

## Pertanyaan 4: Siapa pelanggan yang belum pernah memesan, dan produk apa yang belum pernah laku?

Dua pertanyaan dalam satu, polanya sama: `LEFT JOIN` + `IS NULL`.

<details>
<summary>Kunci jawaban</summary>

```sql
-- pelanggan tanpa pesanan
SELECT pl.nama FROM pelanggan pl
LEFT JOIN pesanan ps ON ps.id_pelanggan = pl.id
WHERE ps.id IS NULL;

-- produk yang belum laku
SELECT pr.nama FROM produk pr
LEFT JOIN pesanan ps ON ps.id_produk = pr.id
WHERE ps.id IS NULL;
```

Hasil: Maya Putri dan Fajar Nugroho belum pernah memesan. Jam Tangan belum pernah laku.

</details>

## Pertanyaan 5: Siapa 3 pelanggan dengan rata-rata belanja per transaksi tertinggi?

Ini yang paling menantang. "Rata-rata belanja per transaksi" = total belanja dibagi jumlah transaksi. Butuh agregasi ganda: `SUM` dan `COUNT` dalam satu `GROUP BY`.

<details>
<summary>Kunci jawaban</summary>

```sql
SELECT pl.nama,
  SUM(ps.jumlah * pr.harga) AS total_belanja,
  COUNT(*) AS jumlah_transaksi,
  SUM(ps.jumlah * pr.harga) / COUNT(*) AS rata_per_transaksi
FROM pesanan ps
JOIN pelanggan pl ON ps.id_pelanggan = pl.id
JOIN produk pr ON ps.id_produk = pr.id
GROUP BY pl.nama
ORDER BY rata_per_transaksi DESC
LIMIT 3;
```

Hasil: Rina Marlina (287.500), Joko Prasetyo (230.000), Budi Santoso (217.500).

</details>

## Coba di playground

Dataset: **Toko Online**. Kerjakan 5 pertanyaan di atas di sini.

<iframe :src="withBase('/sql-playground.html?ds=toko-online')" class="playground-frame" title="SQL Playground: Toko Online"></iframe>

## Yang sudah kamu kuasai

Kalau 5 soal di atas bisa kamu jawab tanpa mencontek, selamat: kamu sudah menguasai SQL level analis pemula. Rangkumannya:

- **1.1** `SELECT`, `LIMIT`, `DISTINCT`, alias
- **1.2** `WHERE`, `AND`/`OR`, `LIKE`, `IN`, `BETWEEN`, `NULL`
- **1.3** `ORDER BY`, `LIMIT` + `OFFSET`
- **1.4** Urutan eksekusi: FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY
- **1.5** Agregasi, `GROUP BY`, `HAVING`
- **1.6** `JOIN`, `LEFT JOIN`, `ON` vs `WHERE`
- **1.7** Subquery dan CTE
- **1.8** Window function

Selanjutnya di buku ini: Python buat analisis yang tidak muat di SQL.

---

**Selanjutnya:** [Bab 2: Python](/bab-2-python)
