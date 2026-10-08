# Bab 1.5: Studi Kasus Warung Kopi Sederhana

Saatnya memakai semua yang dipelajari di Bab 1 untuk menjawab pertanyaan bisnis beneran.

## Situasi

Pemilik warung kopi punya data penjualan 1-10 Januari 2024 ([unduh di sini](/dataset)) dan bertanya empat hal:

1. Berapa total omzet 10 hari ini?
2. Produk apa yang paling laris?
3. Hari apa omzetnya paling tinggi?
4. Berapa rata-rata omzet per hari?

## Bedah latihan

**Persiapan.** Buka `penjualan.csv` di spreadsheet. Tambah kolom F bernama `omzet` dengan rumus di F2: `=D2*E2`, tarik ke bawah dengan fill handle. Kolom ini bikin semua jawaban lebih gampang. Cek dulu datanya bersih: tidak ada duplikat, nama produk konsisten, tanggal satu format.

**1. Total omzet.** Di sel kosong: `=SUM(F2:F30)`. Hasilnya: **Rp36.818.000**.

**2. Produk paling laris.** Pakai pivot table: baris = `produk`, nilai = SUM dari `jumlah`. Urutkan dari besar ke kecil. Hasilnya: Roti Bakar (1.111), Kopi Susu (919), Teh Manis (868). Jadi jawabannya **Roti Bakar**.

Perhatikan: yang dihitung `jumlah`, bukan omzet. Kalau pakai omzet, Kopi Susu menang karena harganya lebih mahal. Pertanyaannya "paling laris", jadi yang dihitung jumlah terjual. Ini contoh kenapa definisi harus diklarifikasi dulu, seperti dibahas di [Bab 0](/bab-0-persiapan#2-tiga-kebiasaan-yang-wajib-dilatih).

**3. Hari omzet tertinggi.** Pivot table lagi: baris = `tgl`, nilai = SUM dari `omzet`, urutkan menurun. Hasilnya: **2024-01-05** dengan Rp5.186.000.

**4. Rata-rata omzet harian.** `=AVERAGE` dari total omzet per hari, atau sederhananya `=36818000/10` = **Rp3.681.800**. Pembaginya 10 karena datanya mencakup 10 hari, bukan karena ada 10 baris.

## Sampaikan jawabannya

Tugas analis tidak selesai di angka. Tulis jawabanmu dalam satu kalimat per pertanyaan, seperti ini:

> Total omzet 10 hari pertama Januari adalah Rp36,8 juta. Produk paling laris adalah Roti Bakar (1.111 terjual). Hari terbaik adalah 5 Januari dengan omzet Rp5,2 juta. Rata-rata omzet harian Rp3,7 juta.

Kalau mau divisualkan, satu bar chart untuk omzet per produk dan satu line chart untuk tren harian sudah cukup. Ingat aturan chart di [halaman pivot](/bab-1-pivot#5-chart): sumbu Y dari nol, satu chart satu pesan.

## Lintas bab

Pertanyaan yang sama dijawab dengan SQL di [Bab 2](/bab-2-sql#studi-kasus-warung-kopi-sederhana). Datanya sama persis, hasilnya harus sama persis. Kalau beda, ada yang salah di salah satu caramu, dan menemukan di mana salahnya adalah latihan yang bagus.

---

**Bab 1 selesai.** Selanjutnya: [Bab 2: SQL](/bab-2-sql)
