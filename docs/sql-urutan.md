<script setup>
import { withBase } from 'vitepress'
</script>

# 1.4 Urutan Eksekusi Query: Cara Baca yang Benar

Ini trik yang dipakai hampir semua tutorial SQL bagus di dunia: **urutan kamu menulis query beda dengan urutan database mengerjakannya.**

Urutan tulis:

```sql
SELECT nama, gaji * 12 AS gaji_tahunan
FROM karyawan
WHERE divisi = 'IT'
ORDER BY gaji DESC;
```

Urutan eksekusi (yang dikerjakan duluan):

1. `FROM karyawan` — ambil tabelnya dulu
2. `WHERE divisi = 'IT'` — saring barisnya
3. `SELECT nama, gaji * 12 AS gaji_tahunan` — baru pilih kolom dan hitung
4. `ORDER BY gaji DESC` — terakhir, urutkan hasilnya

Ingat urutan ini: **FROM → WHERE → SELECT → ORDER BY**. (Nanti di halaman agregasi ada tambahannya: `GROUP BY` dan `HAVING` nyelip di antara `WHERE` dan `SELECT`.)

## Kenapa ini penting

Sekali paham urutan eksekusi, banyak error jadi masuk akal sendiri. Contoh paling terkenal:

```sql
-- ERROR: tidak bisa!
SELECT nama, gaji * 12 AS gaji_tahunan
FROM karyawan
WHERE gaji_tahunan > 100000000;
```

Kenapa error? Karena `WHERE` dikerjakan **sebelum** `SELECT`. Saat `WHERE` berjalan, alias `gaji_tahunan` belum lahir. Yang benar, tulis ulang hitungannya:

```sql
SELECT nama, gaji * 12 AS gaji_tahunan
FROM karyawan
WHERE gaji * 12 > 100000000;
```

Atau saring pakai kolom aslinya: `WHERE gaji > 8333333`.

## Cara baca query panjang

Ketemu query 30 baris jangan panik. Baca dari tengah:

1. Cari `FROM`, tabel apa yang dipakai. Itu "bahan mentah"-nya.
2. Cari `WHERE`, baris mana yang disaring.
3. Terakhir lihat `SELECT`, kolom apa yang ditampilkan.

Tiga langkah itu cukup buat memahami 90% query yang bakal kamu temui.

## Jebakan umum

- **Pakai alias `SELECT` di `WHERE`.** Tidak bisa, karena `WHERE` jalan duluan. Ini error paling umum setelah paham alias.
- **`ORDER BY` boleh pakai alias.** Karena `ORDER BY` jalan paling akhir, setelah `SELECT` selesai. Jadi `ORDER BY gaji_tahunan DESC` itu valid.

## Coba di playground

Dataset: **Data Karyawan**. Coba tulis query yang pakai alias di `WHERE`, lihat error-nya, lalu perbaiki.

<iframe :src="withBase('/sql-playground.html?ds=karyawan')" class="playground-frame" title="SQL Playground: Data Karyawan"></iframe>

## Latihan

1. Jelaskan dengan kata-katamu sendiri: kenapa `WHERE gaji_tahunan > 100000000` error padahal `ORDER BY gaji_tahunan` tidak error?
2. Tulis query: nama dan gaji karyawan IT, urut dari gaji terbesar. Lalu sebutkan urutan eksekusinya langkah per langkah.
3. Perbaiki query ini: `SELECT nama, divisi FROM karyawan WHERE nama_belakang = 'Santoso';` (Petunjuk: tidak ada kolom `nama_belakang`. Pakai yang sudah kamu pelajari di halaman WHERE.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1. WHERE dieksekusi sebelum SELECT (alias belum ada),
--    ORDER BY dieksekusi sesudah SELECT (alias sudah ada).
-- 2.
SELECT nama, gaji
FROM karyawan
WHERE divisi = 'IT'
ORDER BY gaji DESC;
-- Eksekusi: FROM karyawan -> WHERE divisi='IT' -> SELECT nama, gaji -> ORDER BY gaji DESC
-- 3.
SELECT nama, divisi FROM karyawan WHERE nama LIKE '%Santoso';
```

</details>

---

**Selanjutnya:** [1.5 Agregasi dan GROUP BY: Merangkum Data](/sql-agregasi)
