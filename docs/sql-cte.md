<script setup>
import { withBase } from 'vitepress'
</script>

# 1.13 CTE: Query Bertingkat yang Rapi

Subquery bersarang tiga lapis itu pusing dibaca. `WITH` (disebut CTE, common table expression) memecah query panjang jadi **langkah-langkah bernama** yang dibaca dari atas ke bawah.

```sql
WITH rata_sales AS (
  SELECT nama, AVG(omzet) AS rata
  FROM sales
  GROUP BY nama
)
SELECT s.nama, s.bulan, s.omzet
FROM sales s
JOIN rata_sales r ON r.nama = s.nama
WHERE s.omzet > r.rata;
```

Artinya: langkah 1 hitung rata-rata omzet per sales, beri nama `rata_sales`. Langkah 2 pakai hasilnya seperti tabel biasa. Sama persis hasilnya kalau ditulis pakai subquery, tapi ini dibaca seperti resep masak.

## CTE bisa dipakai berkali-kali

Keunggulan utama dibanding subquery: satu CTE bisa di-join **berkali-kali** tanpa ditulis ulang.

```sql
WITH
jan AS (SELECT nama, omzet FROM sales WHERE bulan = '2024-01'),
mar AS (SELECT nama, omzet FROM sales WHERE bulan = '2024-03')
SELECT j.nama, j.omzet AS jan, m.omzet AS mar, m.omzet - j.omzet AS naik
FROM jan j
JOIN mar m ON j.nama = m.nama;
```

Dua langkah bernama (`jan`, `mar`), lalu digabungkan. Coba bayangkan nulis ini pakai subquery bersarang.

## Subquery di FROM vs CTE

Subquery di `FROM` (tabel turunan) itu CTE yang ditulis di dalam:

```sql
-- tabel turunan (subquery di FROM)
SELECT bulan, AVG(omzet) FROM (SELECT * FROM sales) GROUP BY bulan;

-- CTE (sama, tapi langkahnya bernama dan di atas)
WITH semua AS (SELECT * FROM sales)
SELECT bulan, AVG(omzet) FROM semua GROUP BY bulan;
```

Aturan praktis: satu tingkat pakai subquery masih oke. Dua tingkat atau lebih, pakai CTE. Query yang kamu tulis hari ini bakal dibaca kamu (atau orang lain) 6 bulan lagi.

## Jebakan umum

- **CTE cuma hidup satu query.** `WITH` hanya berlaku untuk query tepat di bawahnya. Query berikutnya harus tulis ulang.
- **Lupa koma antar CTE.** `WITH a AS (...), b AS (...)` dipisah koma, bukan `WITH` dua kali.
- **Nama CTE tabrakan dengan tabel asli.** Kasih nama yang jelas beda.

## Coba di playground

Dataset: **Omzet Sales** (3 sales, 3 bulan).

<iframe :src="withBase('/sql-playground.html?ds=cte-sales')" class="playground-frame" title="SQL Playground: CTE Omzet Sales"></iframe>

## Latihan

1. Dengan CTE: tampilkan nama dan rata-rata omzet per sales, urut dari tertinggi.
2. Bulan apa saja tiap sales mencapai omzet di atas rata-ratanya sendiri?
3. Tulis CTE `q1` (Jan-Feb) dan `q1_total` per sales, tampilkan yang totalnya di atas 120.
4. Tulis ulang soal nomor 2 pakai subquery biasa (tanpa WITH), rasakan bedanya.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
WITH rata AS (SELECT nama, AVG(omzet) AS r FROM sales GROUP BY nama)
SELECT nama, r FROM rata ORDER BY r DESC;
-- 2
WITH rata AS (SELECT nama, AVG(omzet) AS r FROM sales GROUP BY nama)
SELECT s.nama, s.bulan, s.omzet FROM sales s
JOIN rata r ON r.nama = s.nama WHERE s.omzet > r.r;
-- 3
WITH q1 AS (SELECT * FROM sales WHERE bulan IN ('2024-01', '2024-02'))
SELECT nama, SUM(omzet) AS total FROM q1 GROUP BY nama HAVING total > 120;
-- 4
SELECT s.nama, s.bulan, s.omzet FROM sales s
JOIN (SELECT nama, AVG(omzet) AS r FROM sales GROUP BY nama) r ON r.nama = s.nama
WHERE s.omzet > r.r;
```

</details>

---

**Selanjutnya:** [1.14 Window Function Dasar](/sql-window)
