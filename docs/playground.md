# SQL Playground

Playground di bawah ini berjalan sepenuhnya di browser (memakai SQL.js). Tidak perlu install database apa pun.

<script setup>
import { withBase } from 'vitepress'
</script>

<iframe :src="withBase('/sql-playground.html')" class="playground-frame" title="SQL Playground interaktif"></iframe>

## Cara pakai

1. Pilih dataset dari menu dropdown (ada 15: 7 buat Bab 1, 4 buat Bab 2, 4 buat studi kasus Bab 3).
2. Tulis query di kolom teks, atau tekan salah satu contoh cepat.
3. Tekan tombol **Jalankan query** atau `Ctrl`+`Enter`.
4. Hasilnya muncul sebagai tabel di bawah.

Kalau query salah, pesan error-nya ditampilkan apa adanya. Itu normal, baca pesannya dan perbaiki.

## Data yang dipakai

Tiap halaman Bab 1 memakai dataset studi kasusnya sendiri, semuanya juga bisa dipilih di playground ini. Daftar lengkap plus unduhan CSV ada di [Dataset Latihan](/dataset).
