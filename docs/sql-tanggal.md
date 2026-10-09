<script setup>
import { withBase } from 'vitepress'
</script>

# 2.4 Fungsi Tanggal: Menghitung Waktu

Tanggal adalah tipe data yang paling sering bikin analis pusing: formatnya macam-macam, aritmetikanya tidak intuitif. Di SQLite, tanggal biasanya disimpan sebagai teks `YYYY-MM-DD`, dan ada fungsi khusus buat mengolahnya.

## strftime: bongkar tanggal

```sql
-- tahun, bulan, hari
SELECT nama, strftime('%Y', tanggal) AS tahun FROM acara;
SELECT nama, strftime('%m', tanggal) AS bulan FROM acara;
SELECT nama, strftime('%Y-%m', tanggal) AS bulan_tahun FROM acara;
```

Pola format: `%Y` tahun 4 digit, `%m` bulan 2 digit, `%d` hari, `%Y-%m` buat grouping per bulan (kepakai di studi kasus omzet).

```sql
-- acara per kuartal
SELECT
  CASE
    WHEN CAST(strftime('%m', tanggal) AS INTEGER) BETWEEN 1 AND 3 THEN 'Q1'
    WHEN CAST(strftime('%m', tanggal) AS INTEGER) BETWEEN 4 AND 6 THEN 'Q2'
    WHEN CAST(strftime('%m', tanggal) AS INTEGER) BETWEEN 7 AND 9 THEN 'Q3'
    ELSE 'Q4'
  END AS kuartal,
  COUNT(*) AS jumlah
FROM acara
GROUP BY kuartal;
```

## julianday: hitung selisih

```sql
-- berapa hari dari Tahun Baru ke tiap acara
SELECT nama, tanggal,
  CAST(julianday(tanggal) - julianday('2024-01-01') AS INTEGER) AS hari_ke
FROM acara;
```

`julianday()` mengubah tanggal jadi angka hari, jadi bisa dikurangi, ditambah, dirata-rata. Pola `julianday(a) - julianday(b)` adalah cara standar hitung durasi: masa kerja karyawan, keterlambatan kiriman, umur piutang.

```sql
-- acara yang jaraknya kurang dari 30 hari dari hari ini (contoh logika)
SELECT nama, tanggal FROM acara
WHERE julianday(tanggal) - julianday('2024-06-01') BETWEEN 0 AND 30;
```

## Syaratnya: format konsisten

Semua fungsi tanggal **cuma jalan kalau formatnya `YYYY-MM-DD`**. Kalau datamu campur (`01/05/2024`, `5 Mei 2024`), bereskan dulu pakai teknik [data cleaning](/sql-lanjut-cleaning). Perbandingan string tanggal juga cuma benar kalau formatnya konsisten: `'2024-06-05' > '2024-01-15'` benar karena urutan alfabetis = urutan kronologis di format ini.

## Jebakan umum

- **Format tanggal berantakan.** Fungsi mengembalikan `NULL` diam-diam kalau formatnya tidak dikenal. Selalu cek `DISTINCT` dulu.
- **Zona waktu dan jam.** Kalau ada komponen jam (`2024-06-05 14:30`), `julianday` menghitung pecahan hari. `CAST(... AS INTEGER)` buat bulatkan.
- **`strftime` mengembalikan teks.** `strftime('%m', ...)` = `'06'` (teks), bukan `6`. Mau dibandingkan sebagai angka, `CAST` dulu.

## Coba di playground

Dataset: **Jadwal Acara** (12 acara kantor 2024).

<iframe :src="withBase('/sql-playground.html?ds=tanggal-acara')" class="playground-frame" title="SQL Playground: Jadwal Acara"></iframe>

## Latihan

1. Tampilkan nama acara dan bulannya (format `YYYY-MM`).
2. Acara apa saja yang di semester 2 (Juli-Desember)?
3. Hitung jumlah acara per kuartal.
4. Berapa hari jarak antara 'Rapat Q1' dan 'Rapat Q2'?

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama, strftime('%Y-%m', tanggal) AS bulan FROM acara;
-- 2
SELECT nama, tanggal FROM acara WHERE CAST(strftime('%m', tanggal) AS INTEGER) >= 7;
-- 3
SELECT
  CASE WHEN CAST(strftime('%m', tanggal) AS INTEGER) <= 3 THEN 'Q1'
       WHEN CAST(strftime('%m', tanggal) AS INTEGER) <= 6 THEN 'Q2'
       WHEN CAST(strftime('%m', tanggal) AS INTEGER) <= 9 THEN 'Q3'
       ELSE 'Q4' END AS kuartal,
  COUNT(*) FROM acara GROUP BY kuartal;
-- 4
SELECT CAST(julianday('2024-04-12') - julianday('2024-01-15') AS INTEGER) AS selisih_hari;
-- atau dinamis:
SELECT CAST(MAX(julianday(tanggal)) - MIN(julianday(tanggal)) AS INTEGER)
FROM acara WHERE nama IN ('Rapat Q1', 'Rapat Q2');
```

</details>

---

**Selanjutnya:** [2.5 Data Cleaning dengan SQL](/sql-lanjut-cleaning)
