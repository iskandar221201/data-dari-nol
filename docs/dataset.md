<script setup>
import { withBase } from 'vitepress'
</script>

# Dataset Latihan

Dataset dummy berbahasa Indonesia untuk latihan. Tiap halaman SQL di buku ini memakai dataset yang beda, semuanya bisa dicoba langsung di playground masing-masing halaman atau di [SQL Playground](/playground) (pilih dataset dari menu dropdown).

Unduh sebagai CSV kalau mau dioprek di tempat lain:

## Data Karyawan

Karyawan fiktif PT Maju Mundur. Dipakai di [1.1 SELECT](/sql-select) dan [1.4 Urutan Eksekusi](/sql-urutan).

<a :href="withBase('/datasets/karyawan.csv')" download>Unduh karyawan.csv</a> (8 baris: id, nama, divisi, gaji, tgl_masuk)

## Warung Kopi Sederhana

Penjualan fiktif sebuah warung kopi, 1-10 Januari 2024. Dipakai di [1.2 WHERE](/sql-where).

<a :href="withBase('/datasets/warung-kopi.csv')" download>Unduh warung-kopi.csv</a> (29 baris: id, tgl, produk, jumlah, harga)

## Katalog Produk

Katalog fiktif toko kelontong online. Dipakai di [1.3 ORDER BY](/sql-order).

<a :href="withBase('/datasets/katalog-produk.csv')" download>Unduh katalog-produk.csv</a> (16 baris: id, nama, kategori, harga, rating, stok)

## Dapur Bu Tini

Pesanan fiktif layanan antar makanan, 1-10 Februari 2024. Dipakai di [1.5 Agregasi](/sql-agregasi).

<a :href="withBase('/datasets/pesanan.csv')" download>Unduh pesanan.csv</a> (24 baris: id, tanggal, pelanggan, menu, jumlah, harga, status)

## Toko Online

Mini database toko online fiktif: pelanggan, produk, dan pesanan. Dipakai di [1.6 JOIN](/sql-join) dan [1.9 Studi Kasus](/sql-studi-kasus).

<a :href="withBase('/datasets/toko-online-pelanggan.csv')" download>pelanggan.csv</a> (8 baris) ·
<a :href="withBase('/datasets/toko-online-produk.csv')" download>produk.csv</a> (8 baris) ·
<a :href="withBase('/datasets/toko-online-pesanan.csv')" download>pesanan.csv</a> (20 baris)

## Data Sekolah

Nilai fiktif 10 siswa kelas XII, 3 mata pelajaran. Dipakai di [1.7 Subquery](/sql-subquery).

<a :href="withBase('/datasets/sekolah-siswa.csv')" download>siswa.csv</a> (10 baris) ·
<a :href="withBase('/datasets/sekolah-nilai.csv')" download>nilai.csv</a> (30 baris)

## Tren Penjualan

Omzet bulanan fiktif (juta rupiah) per kanal selama 2024. Dipakai di [1.8 Window Function](/sql-window).

<a :href="withBase('/datasets/tren-penjualan.csv')" download>Unduh tren-penjualan.csv</a> (24 baris: bulan, kanal, omzet)

## Survei Kepuasan

Hasil survei kepuasan fiktif, 18 responden. Dipakai di [2.1 CASE](/sql-lanjut-case).

<a :href="withBase('/datasets/survei-kepuasan.csv')" download>Unduh survei-kepuasan.csv</a> (18 baris: id, nama, skor, komentar)

## Penjualan Dua Cabang

Penjualan fiktif dua cabang dengan struktur identik. Dipakai di [2.2 UNION](/sql-lanjut-union).

<a :href="withBase('/datasets/penjualan-cabang-jkt.csv')" download>Jakarta</a> ·
<a :href="withBase('/datasets/penjualan-cabang-sby.csv')" download>Surabaya</a> (12 baris per cabang)

## Data Kontak

Daftar kontak fiktif dengan penulisan berantakan. Dipakai di [2.3 Fungsi String dan Tanggal](/sql-lanjut-string).

<a :href="withBase('/datasets/data-kontak.csv')" download>Unduh data-kontak.csv</a> (12 baris: id, nama, email, tgl_lahir, kota)

## Data Kotor

Transaksi yang sengaja dikotori (duplikat, format campur, NULL). Dipakai di [2.4 Data Cleaning](/sql-lanjut-cleaning).

<a :href="withBase('/datasets/data-kotor.csv')" download>Unduh data-kotor.csv</a> (20 baris: id, tanggal, produk, jumlah, harga)

## Studi Kasus Real (Bab 3)

- **Kasus: Omzet Turun** — dipakai di [3.1](/studi-kasus-1-omzet): <a :href="withBase('/datasets/kasus-omzet.csv')" download>kasus-omzet.csv</a> (30 baris)
- **Kasus: Turnover Karyawan** — dipakai di [3.2](/studi-kasus-2-turnover): <a :href="withBase('/datasets/kasus-hr.csv')" download>kasus-hr.csv</a> (18 baris)
- **Kasus: Menu Paling Cuan** — dipakai di [3.3](/studi-kasus-3-margin): <a :href="withBase('/datasets/kasus-margin.csv')" download>kasus-margin.csv</a> (24 baris)
- **Kasus: Kurir Telat** — dipakai di [3.4](/studi-kasus-4-kurir): <a :href="withBase('/datasets/kasus-logistik.csv')" download>kasus-logistik.csv</a> (24 baris)

::: tip Data mentah jangan diubah
Kalau mau otak-atik, duplikat dulu file-nya atau kerjakan di salinan terpisah. Kebiasaan ini menyelamatkanmu dari banyak masalah di dunia kerja.
:::
