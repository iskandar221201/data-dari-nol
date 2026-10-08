# Bab 1.4: Pembersihan Data

Pepatah analis: sampah masuk, sampah keluar. Data hampir tidak pernah datang dalam keadaan bersih. Bab ini tentang membereskannya sebelum dianalisis.

## 1. Kenali musuh-musuhnya

| Masalah | Contoh | Akibat |
|---|---|---|
| Spasi berlebih | `"Kopi Susu "` vs `"Kopi Susu"` | Dianggap produk beda oleh pivot |
| Kapitalisasi tidak konsisten | `"kopi susu"`, `"KOPI SUSU"` | Sama seperti di atas |
| Duplikat | Baris yang sama tercatat dua kali | Total mengganda |
| Format tanggal campur | `01/05/2024` vs `05-01-2024` | Urutan dan filter rusak |
| Sel kosong | — | Rumus error, pivot mengabaikan |
| Teks di kolom angka | `"18000 "` atau `"Rp18.000"` | Tidak bisa dihitung |

## 2. Senjata pembersih

**TRIM dan CLEAN.** `=TRIM(A1)` buang spasi tepi dan ganda. `=CLEAN(A1)` buang karakter tak tercetak. Kombinasi standar sebelum analisis teks: `=TRIM(CLEAN(A1))`.

**Text to Columns** (`Data` > `Text to Columns`). Pecah satu kolom jadi beberapa berdasarkan pemisah. Contoh: `"Budi Santoso"` dipisah spasi jadi nama depan dan belakang. `"2024-01-05"` dipisah `-` jadi tahun, bulan, tanggal.

**Find and Replace** (`Ctrl`+`H`). Ganti massal, misal `"Kopi susu"` jadi `"Kopi Susu"`. Centang "Match entire cell" supaya tidak mengganti bagian kata yang tidak dimaksud.

**Remove Duplicates** (`Data` > `Remove Duplicates`). Pilih kolom kunci (misal `id`), hapus baris ganda. Selalu simpan salinan data mentah dulu sebelum ini.

**Data Validation** (`Data` > `Data Validation`). Cegah data kotor masuk sejak awal: batasi isi sel ke daftar pilihan (dropdown), rentang angka, atau tanggal valid. Dipakai saat bikin template input untuk orang lain.

## 3. Samakan kapitalisasi

Pilih salah satu, terapkan ke seluruh kolom:

- `=UPPER(A1)`: semua kapital
- `=LOWER(A1)`: semua kecil
- `=PROPER(A1)`: huruf pertama tiap kata kapital

Untuk nama produk, `PROPER` biasanya paling rapi.

## 4. Tangani sel kosong

Tiga pilihan, tergantung konteks:

1. **Biarkan kosong** kalau memang datanya tidak ada dan analisismu tahan terhadap itu.
2. **Isi dengan 0** kalau kosong berarti "tidak terjadi" (misal penjualan nol).
3. **Hapus barisnya** kalau barisnya tidak valid sama sekali.

Yang dilarang: mengisi kosong dengan rata-rata atau tebakan tanpa mencatatnya. Itu namanya mengarang data.

## 5. Named ranges: beri nama, jangan hafal alamat

Blok sel, ketik nama di Name Box (misal `harga_kopi`). Rumus jadi `=SUM(harga_kopi)`, bukan `=SUM(E2:E30)`. Keuntungan: rumus gampang dibaca, dan kalau rentang bertambah, cukup ubah definisi namanya sekali di `Formulas` > `Name Manager`.

## 6. Baca pesan error rumus

| Error | Arti | Solusi umum |
|---|---|---|
| `#DIV/0!` | Bagi dengan nol / sel kosong | Bungkus dengan `IFERROR` |
| `#N/A` | Tidak ketemu (lookup gagal) | Cek ejaan, `TRIM` dulu, atau beri nilai cadangan di XLOOKUP |
| `#VALUE!` | Tipe data salah (teks dihitung) | Cari sel berisi teks di kolom angka |
| `#REF!` | Referensi ke sel yang dihapus | Jangan hapus baris/kolom yang dirujuk rumus |
| `#NAME?` | Nama fungsi salah ketik | Cek ejaan fungsi (biasanya kurang huruf) |

Jangan panik lihat error. Error adalah petunjuk, bukan vonis.

## 7. Power Query: naik kelas (sekilas)

Kalau langkah pembersihanmu berulang tiap minggu (unduh CSV, bersihkan, pivot), **Power Query** (`Data` > `Get Data`) merekam semua langkah itu jadi satu alur yang bisa diulang sekali klik. Konsepnya: tiap langkah tercatat berurutan, datanya bisa di-refresh.

Untuk bab ini cukup tahu keberadaannya. Detail Power Query masuk ke materi lanjutan setelah kamu nyaman dengan semua halaman di Bab 1.

## 8. Latihan

1. Duplikat `penjualan.csv`, lalu di duplikatnya: tambah 3 baris duplikat manual, ubah 2 nama produk jadi huruf kecil semua, tambah spasi di 3 sel.
2. Bersihkan kembali dengan TRIM, PROPER, dan Remove Duplicates sampai total omzetnya kembali 36.818.000.
3. Buat data validation dropdown untuk kolom `produk` berisi tiga produk yang valid.

---

**Selanjutnya:** [Studi Kasus](/bab-1-studi-kasus)
