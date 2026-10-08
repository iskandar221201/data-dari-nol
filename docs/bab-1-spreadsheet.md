# Bab 1: Spreadsheet

Spreadsheet (Google Sheets atau Excel) adalah perkakas analisis pertama yang wajib dikuasai. Untuk data sampai puluhan ribu baris, spreadsheet sering lebih cepat daripada menulis kode.

## 1. Yang harus dikuasai

- Referensi sel dan rentang (`A1`, `A1:B10`), termasuk referensi absolut (`$A$1`)
- Fungsi dasar: `SUM`, `AVERAGE`, `COUNT`, `COUNTA`, `MIN`, `MAX`
- Logika: `IF`, `AND`, `OR`, `IFERROR`
- Pencarian: `VLOOKUP` atau `XLOOKUP`, `INDEX` + `MATCH`
- Tabel pivot untuk rangkuman cepat
- Pembersihan: hapus duplikat, pisah teks ke kolom, format tanggal yang konsisten

## 2. Aturan main

- Satu tabel, satu lembar, satu baris header. Jangan gabung sel di area data.
- Tanggal selalu dalam format yang sama di satu kolom.
- Jangan campur angka dan teks di satu kolom.
- Simpan data mentah di lembar terpisah, olahan di lembar lain. Data mentah tidak boleh diubah.

## 3. Contoh cepat: rekap penjualan

Misal kamu punya tabel penjualan dengan kolom Tanggal, Produk, Jumlah, Harga. Untuk total omzet per produk, tabel pivot selesai dalam satu menit: baris = Produk, nilai = SUM dari (Jumlah × Harga). Kalau mau pakai rumus, `SUMIF` cukup.

## 4. Latihan

1. Buat tabel pengeluaran pribadimu selama seminggu (tanggal, kategori, nominal).
2. Hitung total per kategori dengan `SUMIF`.
3. Buat tabel pivot yang sama dan bandingkan hasilnya.

## Studi kasus: Warung Kopi Sederhana

Pemilik warung kopi punya data penjualan 1-10 Januari 2024 ([unduh di sini](/dataset)) dan bertanya empat hal:

1. Berapa total omzet 10 hari ini?
2. Produk apa yang paling laris?
3. Hari apa omzetnya paling tinggi?
4. Berapa rata-rata omzet per hari?

### Bedah latihan (cara Excel/Sheets)

**Persiapan.** Buka `penjualan.csv` di spreadsheet. Tambah kolom F bernama `omzet` dengan rumus di F2: `=D2*E2`, tarik ke bawah. Kolom ini bikin semua jawaban lebih gampang.

**1. Total omzet.** Di sel kosong: `=SUM(F2:F30)`. Hasilnya: **Rp36.818.000**.

**2. Produk paling laris.** Pakai tabel pivot: baris = `produk`, nilai = SUM dari `jumlah`. Urutkan dari besar ke kecil. Hasilnya: Roti Bakar (1.111), Kopi Susu (919), Teh Manis (868). Jadi jawabannya **Roti Bakar**. Catatan: yang dihitung `jumlah`, bukan omzet. Kalau pakai omzet, Kopi Susu menang karena harganya lebih mahal. Pertanyaannya "paling laris", jadi yang dihitung jumlah terjual.

**3. Hari omzet tertinggi.** Tabel pivot lagi: baris = `tgl`, nilai = SUM dari `omzet`, urutkan menurun. Hasilnya: **2024-01-05** dengan Rp5.186.000.

**4. Rata-rata omzet harian.** `=AVERAGE` dari total omzet per hari, atau sederhananya `=36818000/10` = **Rp3.681.800**. (Pembagi 10 karena datanya 10 hari, bukan karena ada 10 baris.)

### Yang perlu diperhatikan

- Pertanyaan 2 menunjukkan kenapa definisi penting: "laris" bisa berarti jumlah terbanyak atau omzet terbesar. Analis yang baik mengklarifikasi dulu sebelum menghitung.
- Semua jawaban di atas bisa dicek ulang dengan query SQL di [Bab 2](/bab-2-sql#studi-kasus-warung-kopi-sederhana). Datanya sama persis.

---

**Selanjutnya:** [Bab 2: SQL](/bab-2-sql)
