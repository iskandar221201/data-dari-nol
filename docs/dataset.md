<script setup>
import { withBase } from 'vitepress'
</script>

# Dataset Latihan

Dataset dummy untuk latihan. Unduh sebagai CSV, buka di Excel atau Google Sheets, atau pakai langsung di [SQL Playground](/playground) (datanya sama persis).

## Warung Kopi Sederhana

Data penjualan fiktif sebuah warung kopi, 1-10 Januari 2024. Dipakai di studi kasus [Bab 1](/bab-1-spreadsheet#studi-kasus-warung-kopi-sederhana) dan [Bab 2](/bab-2-sql#studi-kasus-warung-kopi-sederhana).

**penjualan.csv** (29 baris)

| Kolom | Isi |
|---|---|
| id | Nomor transaksi |
| tgl | Tanggal (format YYYY-MM-DD) |
| produk | Kopi Susu, Roti Bakar, Teh Manis |
| jumlah | Jumlah terjual |
| harga | Harga satuan (rupiah) |

<a :href="withBase('/datasets/penjualan.csv')" download>Unduh penjualan.csv</a>

**karyawan.csv** (8 baris)

| Kolom | Isi |
|---|---|
| id | Nomor karyawan |
| nama | Nama |
| divisi | Marketing, IT, Finance, HR |
| gaji | Gaji bulanan (rupiah) |
| tgl_masuk | Tanggal masuk kerja |

<a :href="withBase('/datasets/karyawan.csv')" download>Unduh karyawan.csv</a>

::: tip Data mentah jangan diubah
Kalau mau otak-atik, duplikat dulu file-nya atau kerjakan di lembar terpisah. Kebiasaan ini menyelamatkanmu dari banyak masalah di dunia kerja.
:::
