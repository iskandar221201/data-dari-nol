# Bab 1.3: Sortir, Filter, dan Pivot

Setelah bisa rumus, saatnya mengolah tabel: menyusun, menyaring, dan merangkum.

## 1. Sortir (urutkan)

Pilih satu sel di dalam tabel, lalu `Data` > `Sort`. Aturannya:

- **Jangan blok manual** kolom yang mau diurutkan. Pilih satu sel saja, biarkan spreadsheet memperluas seleksi ke seluruh tabel. Kalau kamu blok satu kolom lalu sortir, baris-barisnya teracak dan datamu rusak.
- Bisa sortir bertingkat: misal urutkan dulu berdasarkan `tgl`, lalu `produk`.
- Tanggal dan angka diurutkan berdasarkan nilai, teks berdasarkan abjad.

## 2. Filter

`Data` > `Filter` (atau `Ctrl`+`Shift`+`L`). Panah kecil muncul di header, klik untuk:

- Tampilkan hanya baris tertentu (misal cuma "Kopi Susu").
- Filter angka: lebih dari, di antara, 10 terbesar.
- Filter teks: mengandung kata tertentu.
- Filter tanggal: bulan ini, minggu lalu.

Filter tidak menghapus data, cuma menyembunyikan. Rumus `SUBTOTAL` (bukan `SUM`) menghitung hanya baris yang terlihat: `=SUBTOTAL(9, F2:F30)` untuk total omzet baris yang tampil.

## 3. Tabel Excel (Ctrl+T)

Ubah rentang jadi **Table** (`Insert` > `Table` atau `Ctrl`+`T`). Keuntungannya:

- Header otomatis punya tombol filter.
- Baris baru otomatis ikut format dan rumus (structured references: `=SUM(Tabel1[omzet])`).
- Rumus memakai nama kolom, bukan alamat sel. Lebih gampang dibaca.

Ini fondasi yang bagus sebelum ke pivot.

## 4. Conditional formatting

Warnai sel otomatis berdasarkan nilainya (`Home` > `Conditional Formatting`):

- **Color scales**: gradasi warna untuk melihat sebaran sekilas.
- **Data bars**: bar mini di dalam sel.
- **Aturan sendiri**: misal warnai merah sel omzet di bawah 3 juta: `=$F2<3000000`.

Aturan praktis: maksimal dua jenis penandaan dalam satu tabel. Lebih dari itu bukannya informatif, malah berisik.

## 5. Chart

Pilih data, `Insert` > `Chart`. Pilih jenis sesuai pertanyaanmu:

| Pertanyaan | Chart yang tepat |
|---|---|
| Bandingkan antar kategori | Bar / Column chart |
| Lihat tren dari waktu ke waktu | Line chart |
| Komposisi dari total | Stacked bar (hindari pie 3D) |
| Hubungan dua variabel | Scatter plot |

Tiga aturan chart yang tidak boleh dilanggar:

1. **Sumbu Y mulai dari nol** untuk bar chart. Sumbu yang dipotong bikin perbedaan kecil terlihat besar.
2. **Satu chart, satu pesan.** Kalau butuh paragraf untuk menjelaskan chart-mu, chart-nya yang salah.
3. **Beri judul yang menyimpulkan**, bukan yang mendeskripsikan. "Omzet naik 20% di minggu kedua" lebih baik dari "Grafik omzet".

**Sparklines**: chart mini di dalam satu sel (`Insert` > `Sparklines`). Cocok untuk kolom tren di samping tabel rangkuman.

## 6. Pivot table: senjata utama analis

Pivot table merangkum ribuan baris jadi tabel ringkas dalam hitungan detik. Cara pakai:

1. Pilih satu sel di tabel, `Insert` > `PivotTable`.
2. Seret field ke empat kotak:
   - **Rows**: kelompok baris (misal `produk`)
   - **Columns**: kelompok kolom (misal `tgl`, opsional)
   - **Values**: yang dihitung (misal SUM dari `omzet`)
   - **Filters**: penyaring global (misal per minggu)
3. Klik kanan nilai > `Sort` untuk urutkan.

Contoh dengan data penjualan:

| Rows | Values | Hasil |
|---|---|---|
| `produk` | SUM(`jumlah`) | Produk terlaris |
| `tgl` | SUM(`omzet`) | Omzet per hari |
| `produk` (rows) + `tgl` (columns) | SUM(`omzet`) | Matriks produk × hari |

**PivotChart**: pivot yang langsung jadi chart. Praktis, tapi untuk laporan final biasanya chart dibuat manual dari hasil pivot supaya bisa diatur tampilannya.

**Refresh**: pivot tidak otomatis ikut data baru. Klik kanan > `Refresh` setelah data berubah. Ini jebakan paling umum: laporan salah karena lupa refresh.

## 7. Latihan

Pakai [penjualan.csv](/dataset):

1. Sortir berdasarkan `tgl` menaik, lalu `jumlah` menurun.
2. Filter hanya "Roti Bakar", hitung total omzetnya dengan `SUBTOTAL`.
3. Buat pivot: omzet per produk per tanggal (matriks).
4. Buat line chart tren omzet harian 1-10 Januari.
5. Tambahkan conditional formatting: warnai merah hari dengan omzet di bawah rata-rata.

---

**Selanjutnya:** [Pembersihan Data](/bab-1-bersih)
