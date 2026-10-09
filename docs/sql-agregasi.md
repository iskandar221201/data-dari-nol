<script setup>
import { withBase } from 'vitepress'
</script>

# 1.5 Agregasi dan GROUP BY: Merangkum Data

Sampai sini kamu mengambil baris satu per satu. Analis lebih sering butuh **rangkuman**: total omzet, rata-rata nilai, menu paling laris. Itu kerjaan fungsi agregasi.

```sql
SELECT SUM(jumlah * harga) AS total_omzet
FROM pesanan
WHERE status = 'selesai';
```

Satu angka keluar: total omzet dari semua pesanan yang selesai. Lima fungsi agregasi yang wajib di luar kepala:

| Fungsi | Arti | Contoh |
|---|---|---|
| `COUNT(*)` | hitung baris | jumlah pesanan |
| `SUM(x)` | total | total omzet |
| `AVG(x)` | rata-rata | rata-rata harga |
| `MIN(x)` | terkecil | pesanan termurah |
| `MAX(x)` | terbesar | pesanan termahal |

## GROUP BY: rangkuman per kelompok

Total omzet satu angka itu kurang bercerita. Lebih menarik: omzet **per menu**.

```sql
SELECT menu, SUM(jumlah * harga) AS omzet
FROM pesanan
WHERE status = 'selesai'
GROUP BY menu
ORDER BY omzet DESC;
```

`GROUP BY menu` memecah baris jadi kelompok-kelompok per menu, lalu `SUM` dihitung **di dalam tiap kelompok**. Hasilnya satu baris per menu. Ini pasangan paling sering dipakai di SQL: agregasi + `GROUP BY`.

Ingat urutan eksekusinya: `FROM` → `WHERE` → `GROUP BY` → `SELECT` → `ORDER BY`. `WHERE` menyaring baris **sebelum** dikelompokkan, makanya pesanan yang dibatalkan tidak ikut dihitung.

## HAVING: saring hasil kelompok

Mau cuma menu yang laris (terjual di atas 10 porsi)? Godaannya pakai `WHERE`, tapi `WHERE` tidak kenal `total_terjual` karena alias itu lahir di `SELECT`, sesudah `WHERE` jalan. Solusinya: `HAVING`, yang memang dirancang buat menyaring **sesudah** pengelompokan.

```sql
SELECT menu, SUM(jumlah) AS total_terjual
FROM pesanan
WHERE status = 'selesai'
GROUP BY menu
HAVING total_terjual > 10
ORDER BY total_terjual DESC;
```

Aturannya simpel: **sebelum agregasi pakai `WHERE`, sesudah agregasi pakai `HAVING`.** Ketukar dua ini adalah kesalahan paling umum di SQL.

## Jebakan umum

- **`COUNT(*)` vs `COUNT(kolom)`.** `COUNT(*)` menghitung baris. `COUNT(kolom)` cuma menghitung yang tidak `NULL`. Beda tipis, akibatnya bisa jauh.
- **Kolom non-agregat wajib masuk `GROUP BY`.** `SELECT menu, SUM(...)` harus ditemani `GROUP BY menu`. Kalau tidak, error (atau hasil ngaco di database yang permisif).
- **`WHERE` buat saring kelompok.** Salah kamar. Kelompok disaring pakai `HAVING`.
- **`AVG` dari rata-rata.** Rata-rata omzet per hari itu `AVG` dari total harian, bukan `AVG` dari tiap baris transaksi. Butuh subquery, ada di [halaman 1.7](/sql-subquery).

## Coba di playground

Dataset: **Dapur Bu Tini** (24 pesanan antar makanan, 1-10 Februari 2024).

<iframe :src="withBase('/sql-playground.html?ds=pesanan')" class="playground-frame" title="SQL Playground: Dapur Bu Tini"></iframe>

## Latihan

1. Berapa total pesanan yang statusnya `selesai`? (Pakai `COUNT`.)
2. Berapa rata-rata jumlah porsi per pesanan yang selesai?
3. Tampilkan omzet per tanggal (hanya yang selesai), urut dari yang terbesar.
4. Menu apa saja yang total terjualnya di atas 8 porsi? (Pakai `GROUP BY` + `HAVING`.)
5. Ada berapa pelanggan unik yang pernah memesan? (Petunjuk: `COUNT(DISTINCT ...)`)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT COUNT(*) AS total FROM pesanan WHERE status = 'selesai';
-- 2
SELECT AVG(jumlah) AS rata_porsi FROM pesanan WHERE status = 'selesai';
-- 3
SELECT tanggal, SUM(jumlah * harga) AS omzet FROM pesanan WHERE status = 'selesai' GROUP BY tanggal ORDER BY omzet DESC;
-- 4
SELECT menu, SUM(jumlah) AS total FROM pesanan WHERE status = 'selesai' GROUP BY menu HAVING total > 8;
-- 5
SELECT COUNT(DISTINCT pelanggan) AS pelanggan_unik FROM pesanan;
```

</details>

---

**Selanjutnya:** [1.6 JOIN: Menggabungkan Tabel](/sql-join)
