<script setup>
import { withBase } from 'vitepress'
</script>

# 1.15 LAG, LEAD, dan Agregat Window

Kemarin peringkat. Sekarang dua pola analis yang paling sering dipakai: **bandingkan dengan periode sebelumnya** (`LAG`/`LEAD`) dan **tempelkan angka rangkuman ke tiap baris** (agregat window).

## LAG/LEAD: intip baris tetangga

```sql
SELECT bulan, kanal, omzet,
  omzet - LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan) AS selisih
FROM penjualan_bulanan;
```

`LAG(omzet)` = nilai omzet di **baris sebelumnya** (dalam urutan bulan, per kanal). `LEAD` kebalikannya: baris **sesudahnya**. Hasilnya kolom selisih: pertumbuhan month-over-month, pertanyaan analis paling klasik.

```sql
-- pertumbuhan dalam persen
SELECT bulan, kanal, omzet,
  ROUND((omzet - LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan)) * 100.0
    / LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan), 1) AS tumbuh_persen
FROM penjualan_bulanan;
```

Baris pertama tiap kanal hasilnya `NULL` (tidak ada "sebelumnya"), itu wajar.

## Agregat sebagai window: rangkuman tanpa menciutkan

```sql
SELECT bulan, kanal, omzet,
  AVG(omzet) OVER (PARTITION BY kanal) AS rata_kanal
FROM penjualan_bulanan;
```

`AVG` yang kamu kenal, tapi pakai `OVER`: hasilnya ditempel ke **tiap baris**, bukan menciut jadi satu. Kolom `rata_kanal` berguna buat perbandingan: "bulan apa saja omzetnya di atas rata-rata kanalnya?"

```sql
-- total berjalan (running total)
SELECT bulan, omzet,
  SUM(omzet) OVER (ORDER BY bulan) AS kumulatif
FROM penjualan_bulanan
WHERE kanal = 'online';
```

Tanpa `PARTITION BY`, jendelanya seluruh tabel berurutan: tiap baris berisi total dari awal sampai baris itu.

## Beda agregasi biasa vs window

```sql
-- biasa: 24 baris -> 1 angka
SELECT AVG(omzet) FROM penjualan_bulanan WHERE kanal = 'online';

-- window: 24 baris tetap 24 baris, nambah kolom
SELECT bulan, omzet, AVG(omzet) OVER () AS rata_semua
FROM penjualan_bulanan WHERE kanal = 'online';
```

## Jebakan umum

- **`LAG` tanpa `ORDER BY` di `OVER`.** "Baris sebelumnya" tidak ada artinya tanpa urutan.
- **Saring hasil window pakai `WHERE`.** Tidak bisa, bungkus subquery/CTE dulu.
- **Lupa `PARTITION BY`.** `LAG` tanpa partisi menghitung lintas kanal (omzet online Januari dibanding offline Desember). Selalu pikirkan: "dibanding apa?"

## Coba di playground

Dataset: **Tren Penjualan** (omzet bulanan 2024 per kanal, juta rupiah).

<iframe :src="withBase('/sql-playground.html?ds=tren-penjualan')" class="playground-frame" title="SQL Playground: Tren Penjualan"></iframe>

## Latihan

1. Tampilkan bulan, kanal, omzet, dan selisih vs bulan sebelumnya per kanal.
2. Bulan apa pertumbuhan online terbesar (dalam persen)?
3. Tampilkan bulan-bulan di mana omzet online di atas rata-rata kanal online.
4. Tampilkan omzet kumulatif per kanal sepanjang 2024.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT bulan, kanal, omzet,
  omzet - LAG(omzet) OVER (PARTITION BY kanal ORDER BY bulan) AS selisih
FROM penjualan_bulanan;
-- 2
SELECT bulan, tumbuh FROM (
  SELECT bulan,
    ROUND((omzet - LAG(omzet) OVER (ORDER BY bulan)) * 100.0 / LAG(omzet) OVER (ORDER BY bulan), 1) AS tumbuh
  FROM penjualan_bulanan WHERE kanal = 'online'
) ORDER BY tumbuh DESC LIMIT 1;
-- 3
SELECT bulan, omzet FROM (
  SELECT bulan, omzet, AVG(omzet) OVER () AS rata FROM penjualan_bulanan WHERE kanal = 'online'
) WHERE omzet > rata;
-- 4
SELECT bulan, kanal, omzet, SUM(omzet) OVER (PARTITION BY kanal ORDER BY bulan) AS kumulatif
FROM penjualan_bulanan;
```

</details>

---

**Selanjutnya:** [1.16 Studi Kasus: Toko Online](/sql-studi-kasus)
