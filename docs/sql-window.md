<script setup>
import { withBase } from 'vitepress'
</script>

# 1.14 Window Function Dasar: Peringkat Tanpa Mencairkan Tabel

Di semua tutorial SQL serius, window function selalu ditaruh di ujung dan dilabeli "level analis". Alasannya: ini cara memberi peringkat atau nomor urut **tanpa menciutkan tabel** seperti `GROUP BY`.

```sql
SELECT nama, cabang, skor,
  RANK() OVER (PARTITION BY cabang ORDER BY skor DESC) AS peringkat
FROM peserta;
```

`OVER (...)` menjelaskan jendelanya: `PARTITION BY cabang` = peringkat dihitung per cabang (mirip `GROUP BY`, tapi baris tidak menciut), `ORDER BY skor DESC` = urutan peringkatnya.

## Tiga fungsi peringkat: bedanya di skor seri

Dataset lomba ini sengaja punya skor seri (dua 90 di Lari, dua 92 di Renang, dua 95 di Catur). Perhatikan bedanya:

```sql
SELECT nama, cabang, skor,
  ROW_NUMBER() OVER (PARTITION BY cabang ORDER BY skor DESC) AS rn,
  RANK() OVER (PARTITION BY cabang ORDER BY skor DESC) AS rnk,
  DENSE_RANK() OVER (PARTITION BY cabang ORDER BY skor DESC) AS dense
FROM peserta;
```

| Fungsi | Skor seri | Setelah seri |
|---|---|---|
| `ROW_NUMBER()` | dipaksa beda (1, 2) | lanjut 3 |
| `RANK()` | peringkat sama (1, 1) | lompat (3) |
| `DENSE_RANK()` | peringkat sama (1, 1) | lanjut (2) |

Pilih sesuai kebutuhan: `ROW_NUMBER` buat "ambil tepat 3 teratas", `RANK` buat peringkat lomba beneran, `DENSE_RANK` kalau tidak boleh ada lompatan.

## Tanpa PARTITION BY: satu kelompok besar

```sql
SELECT nama, skor,
  RANK() OVER (ORDER BY skor DESC) AS peringkat_nasional
FROM peserta;
```

Tanpa `PARTITION BY`, seluruh tabel dianggap satu kelompok. Berguna buat peringkat global.

## Jebakan umum

- **Lupa `ORDER BY` di dalam `OVER`.** Peringkat tanpa urutan itu tidak ada artinya.
- **Hasil window function tidak bisa disaring pakai `WHERE`.** `WHERE` jalan sebelum `SELECT`. Mau saring peringkat? Bungkus pakai subquery/CTE (ada contohnya di halaman berikutnya).
- **Window function bukan agregasi biasa.** `RANK()` tidak menciutkan baris; 12 baris masuk, 12 baris keluar, nambah 1 kolom.

## Coba di playground

Dataset: **Lomba** (12 peserta, 3 cabang, ada skor seri).

<iframe :src="withBase('/sql-playground.html?ds=window-lomba')" class="playground-frame" title="SQL Playground: Window Lomba"></iframe>

## Latihan

1. Tampilkan nama, cabang, skor, dan peringkat per cabang (pakai `RANK`).
2. Siapa juara 1 tiap cabang? (Saring peringkat = 1, butuh subquery.)
3. Tampilkan 2 skor tertinggi tiap cabang pakai `ROW_NUMBER`.
4. Bandingkan hasil `RANK` vs `DENSE_RANK` di cabang Catur, jelaskan bedanya.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama, cabang, skor,
  RANK() OVER (PARTITION BY cabang ORDER BY skor DESC) AS peringkat FROM peserta;
-- 2
SELECT nama, cabang FROM (
  SELECT nama, cabang, RANK() OVER (PARTITION BY cabang ORDER BY skor DESC) AS p FROM peserta
) WHERE p = 1;
-- 3
SELECT nama, cabang, skor FROM (
  SELECT nama, cabang, skor,
    ROW_NUMBER() OVER (PARTITION BY cabang ORDER BY skor DESC) AS rn FROM peserta
) WHERE rn <= 2;
-- 4. RANK: 1,1,3,4 (lompat setelah seri). DENSE_RANK: 1,1,2,3 (rapat).
```

</details>

---

**Selanjutnya:** [1.15 LAG, LEAD, dan Agregat Window](/sql-window-lag)
