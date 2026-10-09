<script setup>
import { withBase } from 'vitepress'
</script>

# 1.2 WHERE: Menyaring Baris

`SELECT` kemarin mengambil semua baris. Sekarang: ambil **cuma baris yang memenuhi syarat**.

```sql
SELECT *
FROM penjualan
WHERE produk = 'Kopi Susu';
```

Hasilnya cuma transaksi Kopi Susu. Baris Roti Bakar dan Teh Manis disaring keluar. Polanya selalu sama: `SELECT ... FROM ... WHERE syarat`.

## Operator perbandingan

| Operator | Arti | Contoh |
|---|---|---|
| `=` | sama dengan | `WHERE produk = 'Kopi Susu'` |
| `<>` atau `!=` | tidak sama dengan | `WHERE produk <> 'Kopi Susu'` |
| `>` `<` `>=` `<=` | lebih/kurang dari | `WHERE jumlah > 100` |

Catatan: teks harus dibungkus **kutip satu** (`'Kopi Susu'`). Angka tidak perlu. Tanggal di dataset ini disimpan sebagai teks format `YYYY-MM-DD`, jadi perlakukan seperti teks: `WHERE tgl = '2024-01-05'`.

## AND, OR, NOT: gabungkan syarat

```sql
SELECT *
FROM penjualan
WHERE produk = 'Kopi Susu' AND jumlah > 100;
```

`AND` artinya kedua syarat harus benar. `OR` artinya salah satu cukup. `NOT` membalik:

```sql
SELECT *
FROM penjualan
WHERE NOT produk = 'Teh Manis';
```

Kalau syaratnya campur aduk, pakai **kurung**. Tanpa kurung, `AND` dikerjakan duluan sebelum `OR`, dan itu sering bikin hasil di luar dugaan:

```sql
-- yang dimaksud: (kopi susu ATAU teh manis) DAN jumlah > 100
SELECT *
FROM penjualan
WHERE (produk = 'Kopi Susu' OR produk = 'Teh Manis') AND jumlah > 100;
```

## LIKE, IN, BETWEEN: alat saring praktis

```sql
-- LIKE: pola teks (% = bebas apa saja)
SELECT * FROM penjualan WHERE tgl LIKE '2024-01-0%';
```

```sql
-- IN: salah satu dari daftar
SELECT * FROM penjualan WHERE produk IN ('Kopi Susu', 'Teh Manis');
```

```sql
-- BETWEEN: rentang (termasuk batasnya)
SELECT * FROM penjualan WHERE jumlah BETWEEN 50 AND 100;
```

`IN` jauh lebih rapi daripada `OR` berlapis-lapis. `BETWEEN 50 AND 100` artinya 50 sampai 100, dua-duanya ikut.

## NULL: data yang kosong

Kadang sel data kosong, bukan nol, bukan teks kosong, tapi benar-benar **tidak ada datanya**. Itu namanya `NULL`. Cara ceknya khusus:

```sql
SELECT * FROM penjualan WHERE produk IS NULL;
SELECT * FROM penjualan WHERE produk IS NOT NULL;
```

Jangan pakai `= NULL`, itu tidak akan pernah benar. Di dataset warung kopi ini tidak ada NULL, jadi query di atas hasilnya kosong. Kamu bakal ketemu NULL beneran di halaman [JOIN](/sql-join), tepat saat pertama kali dibutuhkan.

## Jebakan umum

- **Kutip satu vs kutip dua.** Teks pakai `'...'`. Kutip dua `"..."` di SQLite artinya nama kolom/tabel, bukan teks.
- **`AND`/`OR` tanpa kurung.** Kalau ragu, kasih kurung. Tidak ada ruginya.
- **`WHERE jumlah = NULL`.** Salah. Pakai `IS NULL`.
- **Besar kecil huruf di `LIKE`.** Di SQLite, `LIKE` tidak peka huruf besar-kecil untuk teks latin biasa.

## Coba di playground

Dataset: **Warung Kopi Sederhana** (29 transaksi, 1-10 Januari 2024).

<iframe :src="withBase('/sql-playground.html?ds=warung-kopi')" class="playground-frame" title="SQL Playground: Warung Kopi Sederhana"></iframe>

## Latihan

1. Tampilkan transaksi tanggal 2024-01-05 saja.
2. Tampilkan transaksi dengan jumlah terjual di atas 120.
3. Tampilkan transaksi Roti Bakar pada tanggal 2024-01-08.
4. Tampilkan transaksi yang produknya Kopi Susu atau Teh Manis, dengan jumlah di bawah 60. (Pakai kurung.)
5. Tampilkan transaksi di tanggal 2024-01-03 sampai 2024-01-05 dengan `BETWEEN`.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT * FROM penjualan WHERE tgl = '2024-01-05';
-- 2
SELECT * FROM penjualan WHERE jumlah > 120;
-- 3
SELECT * FROM penjualan WHERE produk = 'Roti Bakar' AND tgl = '2024-01-08';
-- 4
SELECT * FROM penjualan WHERE (produk = 'Kopi Susu' OR produk = 'Teh Manis') AND jumlah < 60;
-- 5
SELECT * FROM penjualan WHERE tgl BETWEEN '2024-01-03' AND '2024-01-05';
```

</details>

---

**Selanjutnya:** [1.3 ORDER BY dan LIMIT: Mengurutkan Data](/sql-order)
