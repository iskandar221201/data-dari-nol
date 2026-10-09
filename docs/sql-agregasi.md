<script setup>
import { withBase } from 'vitepress'
</script>

# 1.5 Fungsi Agregasi: Merangkum Jadi Satu Angka

Sampai sini kamu mengambil baris satu per satu. Analis lebih sering butuh **rangkuman**: total omzet, rata-rata porsi, menu termahal. Satu angka yang mewakili banyak baris. Itu kerjaan fungsi agregasi.

```sql
SELECT SUM(jumlah * harga) AS total_omzet
FROM pesanan
WHERE status = 'selesai';
```

Satu angka keluar: total omzet dari semua pesanan yang selesai. Lima fungsi yang wajib di luar kepala:

| Fungsi | Arti | Contoh |
|---|---|---|
| `COUNT(*)` | hitung baris | jumlah pesanan |
| `SUM(x)` | total | total omzet |
| `AVG(x)` | rata-rata | rata-rata porsi |
| `MIN(x)` | terkecil | pesanan termurah |
| `MAX(x)` | terbesar | pesanan termahal |

```sql
-- berapa pesanan yang selesai?
SELECT COUNT(*) AS total_pesanan FROM pesanan WHERE status = 'selesai';

-- rata-rata porsi per pesanan?
SELECT AVG(jumlah) AS rata_porsi FROM pesanan WHERE status = 'selesai';

-- transaksi termahal dan termurah?
SELECT MAX(jumlah * harga) AS termahal, MIN(jumlah * harga) AS termurah
FROM pesanan WHERE status = 'selesai';
```

## COUNT(*) vs COUNT(kolom)

```sql
SELECT COUNT(*) AS semua_baris FROM pesanan;
SELECT COUNT(pelanggan) AS yang_ada_namanya FROM pesanan;
```

`COUNT(*)` menghitung **semua baris**. `COUNT(kolom)` cuma menghitung yang **tidak NULL**. Di dataset ini tidak ada NULL di kolom pelanggan, jadi hasilnya sama. Di data beneran, bedanya bisa jauh. Kalau mau hitung baris, pakai `COUNT(*)`.

## Agregasi + WHERE: saring dulu, baru rangkum

Ingat urutan eksekusi: `WHERE` jalan **sebelum** agregasi. Jadi `WHERE status = 'selesai'` membuang dulu pesanan yang dibatalkan, baru sisanya dirangkum. Ini penting: rangkumanmu cuma sebagus saringanmu.

## Jebakan umum

- **Agregasi tanpa GROUP BY menciutkan semua jadi 1 baris.** `SELECT SUM(...)` tanpa `GROUP BY` hasilnya selalu satu angka. Mau rangkuman per kelompok? Lanjut ke halaman berikutnya.
- **`AVG` dari yang salah.** Rata-rata omzet per hari bukan `AVG` dari tiap baris transaksi, tapi `AVG` dari total harian. Butuh subquery, ada di [1.12](/sql-subquery).
- **Lupa `WHERE` sebelum agregasi.** Pesanan yang dibatalkan ikut kehitung kalau tidak disaring dulu.

## Coba di playground

Dataset: **Dapur Bu Tini** (24 pesanan).

<iframe :src="withBase('/sql-playground.html?ds=pesanan')" class="playground-frame" title="SQL Playground: Dapur Bu Tini"></iframe>

## Latihan

1. Berapa total pesanan yang statusnya `selesai`?
2. Berapa total omzet dari pesanan yang selesai?
3. Berapa rata-rata nilai transaksi (jumlah × harga) yang selesai?
4. Ada berapa pelanggan unik yang pernah memesan? (Petunjuk: `COUNT(DISTINCT ...)`)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT COUNT(*) AS total FROM pesanan WHERE status = 'selesai';
-- 2
SELECT SUM(jumlah * harga) AS omzet FROM pesanan WHERE status = 'selesai';
-- 3
SELECT AVG(jumlah * harga) AS rata_transaksi FROM pesanan WHERE status = 'selesai';
-- 4
SELECT COUNT(DISTINCT pelanggan) AS pelanggan_unik FROM pesanan;
```

</details>

---

**Selanjutnya:** [1.6 GROUP BY dan HAVING](/sql-groupby)
