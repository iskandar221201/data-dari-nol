<script setup>
import { withBase } from 'vitepress'
</script>

# 1.8 Window Function: Skill Level Analis

Di semua tutorial SQL serius, ada satu topik yang selalu ditaruh paling akhir dan dilabeli "level analis": **window function**. Alasannya sederhana: ini cara menjawab pertanyaan yang membandingkan baris dengan baris lain, tanpa menciutkan tabel.

Contoh: "berapa pertumbuhan omzet bulan ini dibanding bulan lalu?" Pakai `GROUP BY`, tabelnya menciut jadi satu baris per bulan dan kamu kehilangan detail per kanal. Pakai window function, semua baris tetap ada, cuma nambah kolom hasil hitungan.

```sql
SELECT bulan, kanal, omzet,
  omzet - LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan) AS selisih
FROM penjualan_bulanan;
```

`LAG(omzet)` artinya "nilai omzet di baris sebelumnya". `OVER (...)` menjelaskan "sebelumnya" itu dalam urutan apa, di kelompok mana.

## Anatomi OVER

```sql
FUNGSI(...) OVER (
  PARTITION BY kolom   -- kelompokkan (mirip GROUP BY, tapi baris tidak menciut)
  ORDER BY kolom       -- urutan di dalam tiap kelompok
)
```

Tanpa `PARTITION BY`, seluruh tabel dianggap satu kelompok. Tanpa `ORDER BY`, "baris sebelumnya" jadi tidak jelas artinya.

## Fungsi yang paling dipakai

| Fungsi | Arti | Contoh pakai |
|---|---|---|
| `ROW_NUMBER()` | nomor urut 1, 2, 3... | ambil 3 teratas per grup |
| `RANK()` | peringkat (seri dapat peringkat sama, lalu lompat) | peringkat kanal per bulan |
| `LAG(x)` / `LEAD(x)` | nilai baris sebelum / sesudahnya | pertumbuhan month-over-month |
| `SUM(x) OVER (...)` | total berjalan | omzet kumulatif |

```sql
-- peringkat kanal per bulan
SELECT bulan, kanal, omzet,
  RANK() OVER (PARTITION BY bulan ORDER BY omzet DESC) AS peringkat
FROM penjualan_bulanan;
```

```sql
-- 3 bulan dengan omzet online tertinggi
SELECT bulan, omzet
FROM (
  SELECT bulan, omzet,
    ROW_NUMBER() OVER (ORDER BY omzet DESC) AS rn
  FROM penjualan_bulanan
  WHERE kanal = 'online'
)
WHERE rn <= 3;
```

Perhatikan contoh terakhir: window function dikombinasikan dengan subquery, karena hasil window function tidak bisa langsung disaring pakai `WHERE` (ingat urutan eksekusi: `WHERE` jalan sebelum `SELECT`).

## Beda agregasi biasa vs window

```sql
-- agregasi biasa: 12 baris -> 1 angka
SELECT AVG(omzet) FROM penjualan_bulanan WHERE kanal = 'online';

-- window: 24 baris tetap 24 baris, nambah kolom
SELECT bulan, kanal, omzet,
  AVG(omzet) OVER (PARTITION BY kanal) AS rata_kanal
FROM penjualan_bulanan;
```

Kolom `rata_kanal` di contoh kedua berguna buat perbandingan: "bulan apa saja omzetnya di atas rata-rata kanalnya?" Itu pertanyaan analis banget, dan susah dijawab tanpa window function.

## Jebakan umum

- **Lupa `ORDER BY` di dalam `OVER`.** `LAG` tanpa urutan itu meaningless, database-nya pun bingung.
- **`WHERE` buat saring hasil window function.** Tidak bisa, pakai subquery/CTE seperti contoh di atas.
- **Window function di `GROUP BY` query.** Bisa digabung, tapi pahami dulu masing-masing secara terpisah.

## Coba di playground

Dataset: **Tren Penjualan** (omzet bulanan 2024 per kanal, dalam juta rupiah).

<iframe :src="withBase('/sql-playground.html?ds=tren-penjualan')" class="playground-frame" title="SQL Playground: Tren Penjualan"></iframe>

## Latihan

1. Tampilkan bulan, kanal, omzet, dan selisih omzet dibanding bulan sebelumnya per kanal.
2. Bulan apa omzet online-nya paling tinggi? (Pakai `ROW_NUMBER`, ambil peringkat 1.)
3. Tampilkan bulan, kanal, omzet, dan rata-rata omzet kanalnya masing-masing (pakai window `AVG`).
4. Di bulan apa saja kanal online mengalahkan offline? (Petunjuk: `RANK` per bulan, lalu saring peringkat 1 yang kanalnya online. Butuh subquery.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT bulan, kanal, omzet,
  omzet - LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan) AS selisih
FROM penjualan_bulanan;
-- 2
SELECT bulan, omzet FROM (
  SELECT bulan, omzet, ROW_NUMBER() OVER (ORDER BY omzet DESC) AS rn
  FROM penjualan_bulanan WHERE kanal = 'online'
) WHERE rn = 1;
-- 3
SELECT bulan, kanal, omzet,
  AVG(omzet) OVER (PARTITION BY kanal) AS rata_kanal
FROM penjualan_bulanan;
-- 4
SELECT bulan FROM (
  SELECT bulan, kanal,
    RANK() OVER (PARTITION BY bulan ORDER BY omzet DESC) AS peringkat
  FROM penjualan_bulanan
) WHERE peringkat = 1 AND kanal = 'online';
```

</details>

---

**Selanjutnya:** [1.9 Studi Kasus: Toko Online](/sql-studi-kasus)
