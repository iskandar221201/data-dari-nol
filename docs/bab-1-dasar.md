# Bab 1.1: Dasar-dasar Spreadsheet

Halaman ini untuk yang benar-benar baru. Kalau kamu sudah bisa navigasi dan format sel, langsung ke [Rumus dan Fungsi](/bab-1-rumus).

## 1. Kenali tampilannya

Buka Google Sheets atau Excel. Tiga bagian yang wajib kamu hafal:

- **Name Box** (kotak di kiri atas): menunjukkan alamat sel aktif, misal `B4`. Bisa dipakai untuk lompat ke sel tertentu.
- **Formula Bar** (bilah di atas kolom): menampilkan isi asli sel aktif. Kalau sel berisi rumus, di sini terlihat rumusnya, bukan hasilnya.
- **Ribbon/Menu**: kumpulan perintah berkelompok (Home, Insert, Data, dst).

Satu lembar kerja (worksheet) terdiri dari kolom (A, B, C...) dan baris (1, 2, 3...). Pertemuan kolom dan baris disebut **sel**, alamatnya ditulis kolom dulu lalu baris: `C5`.

## 2. Navigasi dan seleksi

| Aksi | Cara |
|---|---|
| Pindah cepat | `Ctrl` + panah (lompat ke tepi data) |
| Ke awal lembar | `Ctrl` + `Home` |
| Pilih satu kolom / baris | Klik huruf kolom / angka baris |
| Pilih banyak sel | Klik tahan dan seret, atau `Shift` + klik |
| Pilih seluruh lembar | `Ctrl` + `A` |

Hafalkan `Ctrl` + panah. Ini shortcut yang paling sering dipakai analis.

## 3. Entri data

- **Fill handle**: kotak kecil di sudut kanan bawah sel aktif. Seret ke bawah untuk menyalin isi atau melanjutkan pola (misal 1, 2, 3 atau Senin, Selasa, Rabu).
- **AutoFill**: ketik dua contoh pola (misal `1` dan `3`), blok keduanya, seret fill handle. Spreadsheet menebak kelanjutannya.
- **Flash Fill** (Excel) / **Smart Fill** (Sheets): ketik contoh hasil yang kamu mau di kolom sebelah (misal gabung nama depan dan belakang), tekan `Ctrl` + `E`. Spreadsheet meniru polanya untuk semua baris.

## 4. Format angka

Format tidak mengubah nilai, cuma tampilannya. Angka 0,5 tetap 0,5 walau ditampilkan sebagai 50%.

| Format | Dipakai untuk |
|---|---|
| Number | Angka biasa, atur jumlah desimal |
| Currency / Accounting | Uang (Rp) |
| Percentage | Persen |
| Date | Tanggal (pilih format yang konsisten, misal YYYY-MM-DD) |
| Text | Dipaksa jadi teks (misal kode pos `10110` yang nol depannya tidak boleh hilang) |

## 5. Format sel

- **Tebal, warna, border**: untuk header dan penekanan, bukan untuk menyimpan arti. Jangan pakai warna sebagai satu-satunya penanda data (tidak bisa dihitung).
- **Wrap text**: teks panjang dibungkus dalam sel.
- **Merge**: gabung sel. Boleh untuk judul laporan, **dilarang** di area data karena merusak sortir dan pivot.
- **Freeze panes** (`View` > `Freeze`): kunci baris header supaya tetap terlihat saat scroll ke bawah.

## 6. Latihan

1. Buka [penjualan.csv](/dataset), salin isinya ke spreadsheet baru.
2. Format kolom `harga` sebagai Currency (Rp), kolom `tgl` sebagai Date.
3. Freeze baris header.
4. Pakai fill handle untuk membuat kolom nomor urut 1-29 di kolom A baru.

---

**Selanjutnya:** [Rumus dan Fungsi](/bab-1-rumus)
