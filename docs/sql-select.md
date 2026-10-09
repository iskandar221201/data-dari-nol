<script setup>
import { withBase } from 'vitepress'
</script>

# 1.1 SELECT: Membaca Data

Bayangkan tabel database seperti lembar spreadsheet: ada kolom ke bawah... maksudnya ke samping, ada baris ke bawah. Bedanya, tabel database biasanya jauh lebih besar dan datanya lebih rapi.

Query paling dasar di SQL cuma bilang dua hal: **kolom apa** yang mau dilihat, **dari tabel mana**.

```sql
SELECT nama, gaji
FROM karyawan;
```

`SELECT` = kolom apa. `FROM` = tabel mana. Hasilnya: daftar nama dan gaji semua karyawan. Coba langsung di playground bawah.

## Kolom yang dipilih, kamu yang tentukan

```sql
SELECT nama FROM karyawan;
```

Satu kolom saja juga bisa. Atau pakai bintang `*` buat menampilkan semua kolom sekaligus:

```sql
SELECT * FROM karyawan;
```

`SELECT *` enak buat intip-intip isi tabel yang belum dikenal. Tapi jangan dipakai kalau tabelnya jutaan baris di database beneran, berat.

## LIMIT: intip dengan aman

Sebelum percaya diri, intip dulu 5 baris pertama:

```sql
SELECT * FROM karyawan
LIMIT 5;
```

Kebiasaan analis yang bagus: setiap ketemu tabel baru, `SELECT * ... LIMIT 10` dulu buat lihat bentuk datanya. Murah dan cepat.

## DISTINCT: yang unik saja

```sql
SELECT DISTINCT divisi
FROM karyawan;
```

Hasilnya cuma 4 baris: Marketing, IT, Finance, HR. Tanpa `DISTINCT`, divisi IT bakal muncul 3 kali karena ada 3 karyawan IT.

## AS: kasih nama kolom

```sql
SELECT nama, gaji * 12 AS gaji_tahunan
FROM karyawan;
```

`AS` memberi nama pada kolom hasil hitungan. Kamu juga bisa menghitung langsung di `SELECT`: tambah, kurang, kali, bagi, semua bisa.

## Jebakan umum

- **Lupa `FROM`.** `SELECT nama;` tanpa `FROM` itu error. SQL harus tahu tabel mana.
- **Nama kolom salah ketik** juga error, dan pesan error-nya kadang tidak jelas. Cek lagi ejaannya di skema data.
- **Titik koma** di akhir query itu opsional di playground ini, tapi biasakan pakai. Di tools lain kadang wajib.

## Coba di playground

Playground di bawah memakai dataset **Data Karyawan** (8 baris). Tulis query, tekan Jalankan, lihat hasilnya langsung.

<iframe :src="withBase('/sql-playground.html?ds=karyawan')" class="playground-frame" title="SQL Playground: Data Karyawan"></iframe>

## Latihan

1. Tampilkan nama dan divisi semua karyawan.
2. Tampilkan semua kolom, tapi cuma 3 baris pertama.
3. Tampilkan daftar divisi yang unik (tanpa duplikat).
4. Tampilkan nama dan gaji bulanan, plus kolom `gaji_tahunan` (gaji kali 12).

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama, divisi FROM karyawan;
-- 2
SELECT * FROM karyawan LIMIT 3;
-- 3
SELECT DISTINCT divisi FROM karyawan;
-- 4
SELECT nama, gaji, gaji * 12 AS gaji_tahunan FROM karyawan;
```

</details>

---

**Selanjutnya:** [1.2 WHERE: Menyaring Baris](/sql-where)
