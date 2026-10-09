<script setup>
import { withBase } from 'vitepress'
</script>

# 2.2 UNION dan Operasi Himpunan

`JOIN` menggabungkan tabel ke **samping** (nambah kolom). `UNION` menggabungkan hasil query ke **bawah** (nambah baris). Dipakai saat datanya terpecah di banyak tabel dengan struktur sama, misalnya penjualan per cabang.

```sql
SELECT * FROM penjualan_jkt
UNION ALL
SELECT * FROM penjualan_sby;
```

Hasilnya: semua baris Jakarta disambung semua baris Surabaya. Syaratnya cuma satu: **jumlah kolom sama dan tipenya cocok**, urutannya juga harus sama.

## UNION vs UNION ALL

Dua-duanya menyambung baris, bedanya satu:

- `UNION ALL`: sambung apa adanya, duplikat ikut.
- `UNION`: duplikat **dibuang**.

```sql
-- total baris (duplikat ikut dihitung)
SELECT COUNT(*) FROM (
  SELECT * FROM penjualan_jkt
  UNION ALL
  SELECT * FROM penjualan_sby
);

-- baris unik saja
SELECT COUNT(*) FROM (
  SELECT * FROM penjualan_jkt
  UNION
  SELECT * FROM penjualan_sby
);
```

Kecuali kamu memang mau buang duplikat, pakai `UNION ALL`. Lebih cepat (database tidak perlu ngecek duplikat) dan tidak ada baris yang hilang diam-diam.

## Kasih label biar ketahuan asalnya

Hasil `UNION` tidak otomatis tahu barisnya dari tabel mana. Tambahkan kolom label sendiri:

```sql
SELECT 'Jakarta' AS cabang, tgl, produk, jumlah, harga
FROM penjualan_jkt
UNION ALL
SELECT 'Surabaya', tgl, produk, jumlah, harga
FROM penjualan_sby;
```

Pola ini juga dipakai buat menggabungkan agregat per cabang:

```sql
SELECT 'Jakarta' AS cabang, SUM(jumlah * harga) AS omzet
FROM penjualan_jkt
UNION ALL
SELECT 'Surabaya', SUM(jumlah * harga)
FROM penjualan_sby;
```

## INTERSECT dan EXCEPT: irisan dan selisih

`UNION` menggabungkan. Dua saudaranya:

```sql
-- produk yang laku di KEDUA cabang (irisan)
SELECT produk FROM penjualan_jkt
INTERSECT
SELECT produk FROM penjualan_sby;
```

```sql
-- produk yang laku di Jakarta tapi TIDAK di Surabaya (selisih)
SELECT produk FROM penjualan_jkt
EXCEPT
SELECT produk FROM penjualan_sby;
```

`INTERSECT` = yang ada di kedua hasil. `EXCEPT` = yang ada di hasil pertama tapi tidak di kedua. Ketiganya (UNION, INTERSECT, EXCEPT) disebut operasi himpunan, syaratnya sama: jumlah kolom dan tipe harus cocok.

## Jebakan umum

- **Jumlah kolom beda.** Error. Kalau satu tabel kolomnya lebih banyak, isi kekurangannya dengan `NULL` atau nilai default.
- **Nama kolom ikut query pertama.** `SELECT nama AS x ... UNION SELECT nama_lengkap ...` hasilnya kolomnya bernama `x`. Alias cukup ditulis di query pertama.
- **`ORDER BY` cuma boleh di paling akhir.** `UNION` menggabungkan hasil jadi satu, jadi pengurutan cuma masuk akal di akhir.

## Coba di playground

Dataset: **Penjualan Dua Cabang** (Jakarta & Surabaya, struktur identik).

<iframe :src="withBase('/sql-playground.html?ds=penjualan-cabang')" class="playground-frame" title="SQL Playground: Penjualan Dua Cabang"></iframe>

## Latihan

1. Gabungkan semua transaksi kedua cabang dengan `UNION ALL`. Berapa total barisnya?
2. Ulangi dengan `UNION` (tanpa ALL). Apakah jumlah barisnya sama? Kenapa?
3. Tampilkan omzet per cabang (pakai label 'Jakarta'/'Surabaya').
4. Tampilkan produk terlaris (berdasarkan jumlah) dari gabungan kedua cabang.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT * FROM penjualan_jkt UNION ALL SELECT * FROM penjualan_sby;
-- 24 baris.
-- 2. Sama, 24 baris, karena tidak ada baris yang benar-benar duplikat
--    (id boleh sama tapi tanggal/produknya beda konteks cabang).
-- 3
SELECT 'Jakarta' AS cabang, SUM(jumlah * harga) AS omzet FROM penjualan_jkt
UNION ALL
SELECT 'Surabaya', SUM(jumlah * harga) FROM penjualan_sby;
-- 4
SELECT produk, SUM(jumlah) AS terjual FROM (
  SELECT produk, jumlah FROM penjualan_jkt
  UNION ALL
  SELECT produk, jumlah FROM penjualan_sby
) GROUP BY produk ORDER BY terjual DESC;
```

</details>

---

**Selanjutnya:** [2.3 Fungsi String](/sql-lanjut-string)
