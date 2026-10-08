# Bab 1.2: Rumus dan Fungsi

Rumus adalah jantung spreadsheet. Semua analisis di bab ini bertumpu pada halaman ini.

## 1. Cara kerja rumus

Semua rumus diawali tanda `=` (sama dengan). Contoh: `=A1+B1`.

Operator yang dipakai:

| Operator | Arti | Contoh |
|---|---|---|
| `+ - * /` | Tambah, kurang, kali, bagi | `=10/4` |
| `^` | Pangkat | `=2^3` (hasil 8) |
| `%` | Persen | `=50*10%` (hasil 5) |
| `&` | Gabung teks | `="Rp "&A1` |
| `= < > <= >= <>` | Perbandingan | `=A1<>0` (tidak sama dengan) |

Urutan hitung mengikuti matematika biasa: kurung dulu, lalu pangkat, kali/bagi, tambah/kurang.

## 2. Referensi sel: konsep paling penting di halaman ini

Ada tiga jenis referensi. Bedanya terlihat saat rumus disalin ke sel lain.

| Jenis | Contoh | Saat disalin ke bawah | Saat disalin ke kanan |
|---|---|---|---|
| Relatif | `A1` | Baris ikut berubah (`A2`, `A3`) | Kolom ikut berubah (`B1`, `C1`) |
| Absolut | `$A$1` | Tetap `$A$1` | Tetap `$A$1` |
| Campuran | `$A1` / `A$1` | `$A1`: kolom dikunci | `A$1`: baris dikunci |

Aturan praktis: kalau rumusnya merujuk ke **satu sel patokan** (misal tarif pajak di `B1`), kunci dengan `$`. Kalau merujuk ke **data yang sejajar** (misal harga di kolom E baris yang sama), biarkan relatif.

## 3. Fungsi matematika dan agregasi

| Fungsi | Contoh | Hasil |
|---|---|---|
| `SUM` | `=SUM(D2:D30)` | Total |
| `AVERAGE` | `=AVERAGE(D2:D30)` | Rata-rata |
| `COUNT` | `=COUNT(D2:D30)` | Hitung sel berisi angka |
| `COUNTA` | `=COUNTA(B2:B30)` | Hitung sel tidak kosong |
| `COUNTBLANK` | `=COUNTBLANK(B2:B30)` | Hitung sel kosong |
| `MIN` / `MAX` | `=MAX(F2:F30)` | Terkecil / terbesar |
| `SUMIF` | `=SUMIF(C2:C30,"Kopi Susu",D2:D30)` | Total dengan satu syarat |
| `SUMIFS` | `=SUMIFS(F2:F30,C2:C30,"Kopi Susu",B2:B30,">=2024-01-05")` | Total dengan banyak syarat |
| `COUNTIF` / `COUNTIFS` | `=COUNTIF(C2:C30,"Kopi Susu")` | Hitung dengan syarat |
| `AVERAGEIF` | `=AVERAGEIF(C2:C30,"Kopi Susu",D2:D30)` | Rata-rata dengan syarat |
| `ROUND` | `=ROUND(A1,2)` | Bulatkan 2 desimal |
| `ROUNDUP` / `ROUNDDOWN` | `=ROUNDUP(A1,0)` | Bulatkan ke atas / bawah |

## 4. Fungsi logika

```excel
=IF(syarat, nilai_jika_benar, nilai_jika_salah)
```

Contoh: `=IF(F2>3000000,"Tinggi","Rendah")`.

Kombinasi yang sering dipakai:

- `=AND(A1>0, B1>0)`: benar hanya jika **semua** syarat benar.
- `=OR(A1>0, B1>0)`: benar jika **salah satu** syarat benar.
- `=IFERROR(rumus, nilai_cadangan)`: kalau rumus error, tampilkan cadangan. Contoh: `=IFERROR(A1/B1,0)`.
- `=IFS(...)`: untuk banyak cabang tanpa IF bertingkat. Contoh: `=IFS(A1>=90,"A",A1>=80,"B",A1>=70,"C",TRUE,"D")`.

## 5. Fungsi teks

| Fungsi | Contoh | Hasil |
|---|---|---|
| `LEFT` | `=LEFT("Kopi Susu",4)` | `Kopi` |
| `RIGHT` | `=RIGHT("Kopi Susu",4)` | `Susu` |
| `MID` | `=MID("2024-01-05",6,2)` | `01` |
| `LEN` | `=LEN("Kopi")` | `4` |
| `CONCAT` / `&` | `=CONCAT(A1," - ",B1)` | Gabung teks |
| `TRIM` | `=TRIM("  Kopi  ")` | `Kopi` (spasi tepi hilang) |
| `UPPER` / `LOWER` | `=UPPER("kopi")` | `KOPI` |
| `TEXT` | `=TEXT(A1,"DD-MM-YYYY")` | Tanggal jadi teks berformat |
| `SUBSTITUTE` | `=SUBSTITUTE(A1," ","_")` | Ganti teks |

`TRIM` wajib dipakai sebelum analisis teks. Spasi yang tidak terlihat bikin `VLOOKUP` dan pivot gagal mengenali data yang sama.

## 6. Fungsi tanggal

| Fungsi | Contoh | Hasil |
|---|---|---|
| `TODAY()` | `=TODAY()` | Tanggal hari ini |
| `NOW()` | `=NOW()` | Tanggal + jam saat ini |
| `YEAR` / `MONTH` / `DAY` | `=MONTH("2024-01-05")` | `1` |
| `WEEKDAY` | `=WEEKDAY("2024-01-05",2)` | Hari ke- (Senin=1) |
| `DATEDIF` | `=DATEDIF(A1,B1,"D")` | Selisih hari |
| `EOMONTH` | `=EOMONTH("2024-01-15",1)` | Akhir bulan depan |
| `DATE` | `=DATE(2024,1,5)` | Merakit tanggal |

Tanggal di spreadsheet sebenarnya adalah angka (jumlah hari sejak 1900). Makanya tanggal bisa dikurangi dan dibandingkan langsung.

## 7. Fungsi lookup: ambil data dari tabel lain

Ini fungsi yang paling mengubah cara kerjamu. Urutan belajar yang disarankan: **XLOOKUP dulu**, VLOOKUP sebagai pengetahuan umum, INDEX+MATCH untuk kasus khusus.

**XLOOKUP** (Excel baru & Google Sheets):

```excel
=XLOOKUP(apa_yang_dicari, kolom_pencarian, kolom_hasil)
```

Contoh: cari harga "Kopi Susu" dari tabel produk di kolom A (nama) dan B (harga):

```excel
=XLOOKUP("Kopi Susu", A2:A100, B2:B100)
```

Kelebihannya dibanding VLOOKUP: bisa mencari ke kiri, tidak butuh nomor kolom, dan kalau tidak ketemu bisa diberi nilai cadangan: `=XLOOKUP(..., "tidak ada")`.

**VLOOKUP** (wajib tahu karena masih dipakai di mana-mana):

```excel
=VLOOKUP(apa_yang_dicari, tabel, nomor_kolom, FALSE)
```

`FALSE` artinya cari yang persis sama. Jangan pernah pakai `TRUE` kecuali kamu paham betul akibatnya. Kelemahan: kolom pencarian harus paling kiri di tabel.

**INDEX + MATCH** (untuk kasus rumit):

```excel
=INDEX(kolom_hasil, MATCH(apa_yang_dicari, kolom_pencarian, 0))
```

Fleksibel untuk lookup dua arah, tapi untuk kebutuhan sehari-hari XLOOKUP sudah cukup.

## 8. Latihan

Pakai [penjualan.csv](/dataset):

1. Tambah kolom `omzet` (`=D2*E2`), tarik ke bawah dengan fill handle.
2. Hitung total omzet dengan `SUM`. (Jawaban: 36.818.000)
3. Hitung berapa hari unik dengan `=SUM(1/COUNTIF(B2:B30,B2:B30))`. (Jawaban: 10)
4. Buat kolom `kategori_harga` dengan `IF`: "Mahal" jika harga > 15000, "Murah" jika tidak.
5. Pakai `XLOOKUP` untuk mencari harga "Teh Manis" dari tabel yang kamu buat sendiri di lembar lain.

---

**Selanjutnya:** [Sortir, Filter, dan Pivot](/bab-1-pivot)
