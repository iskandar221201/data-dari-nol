# SQL Playground

Playground di bawah ini berjalan sepenuhnya di browser (memakai SQL.js). Tidak perlu install database apa pun.

<script setup>
import { withBase } from 'vitepress'
</script>

<iframe :src="withBase('/sql-playground.html')" class="playground-frame" title="SQL Playground interaktif"></iframe>

## Cara pakai

1. Tulis query di kolom teks, atau tekan salah satu contoh cepat.
2. Tekan tombol **Jalankan query** atau `Ctrl`+`Enter`.
3. Hasilnya muncul sebagai tabel di bawah.

Kalau query salah, pesan error-nya ditampilkan apa adanya. Itu normal, baca pesannya dan perbaiki.

## Data yang dipakai

Dua tabel contoh: `karyawan` (8 baris) dan `penjualan` (29 baris, data Warung Kopi Sederhana, 1-10 Januari 2024). Data yang sama juga bisa diunduh sebagai CSV di [Dataset Latihan](/dataset) untuk dipraktikkan di Excel atau Google Sheets.
