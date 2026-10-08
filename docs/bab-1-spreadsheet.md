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

---

**Selanjutnya:** [Bab 2: SQL](/bab-2-sql)
