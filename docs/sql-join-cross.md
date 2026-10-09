<script setup>
import { withBase } from 'vitepress'
</script>

# 1.11 CROSS JOIN: Semua Kombinasi

`CROSS JOIN` menggabungkan **setiap baris dengan setiap baris**, tanpa syarat `ON`. 3 warna × 4 ukuran = 12 kombinasi.

```sql
SELECT w.warna, u.ukuran
FROM warna w
CROSS JOIN ukuran u;
```

Hasilnya semua pasangan warna-ukuran: Hitam-S, Hitam-M, ..., Navy-XL. Tidak ada `ON` karena memang tidak ada syarat pencocokan.

## Kapan ini berguna

- **Membuat kerangka laporan.** Butuh tabel semua kombinasi bulan × produk biar yang penjualannya nol tetap muncul di laporan (lalu `LEFT JOIN` ke data aktual).
- **Varian produk.** Daftar semua kombinasi yang mungkin dijual.
- **Simulasi.** Semua skenario dari dua daftar pilihan.

```sql
-- kerangka: semua kombinasi bulan x produk (nanti di-LEFT JOIN ke penjualan)
SELECT b.bulan, p.produk
FROM (SELECT '2024-01' AS bulan UNION ALL SELECT '2024-02') b
CROSS JOIN (SELECT 'Kaos' AS produk UNION ALL SELECT 'Kemeja') p;
```

## Hati-hati: ledakannya cepat

3 × 4 = 12, kecil. Tapi 10.000 × 10.000 = 100 juta baris. `CROSS JOIN` adalah satu-satunya join yang **sengaja** menghasilkan cartesian product, jadi selalu hitung dulu ukurannya: `COUNT` kedua tabel sebelum di-cross.

```sql
-- cek dulu sebelum cross
SELECT (SELECT COUNT(*) FROM warna) * (SELECT COUNT(*) FROM ukuran) AS total_kombinasi;
```

## Jebakan umum

- **CROSS JOIN tidak sengaja.** `JOIN` tanpa `ON` di database lain perilakunya = cross join. Kalau hasil join-mu membengkak tidak wajar, cek `ON`-nya.
- **Lupa menghitung ukuran hasil.** Selalu estimasi dulu untuk tabel besar.

## Coba di playground

Dataset: **Warna × Ukuran** (3 warna, 4 ukuran).

<iframe :src="withBase('/sql-playground.html?ds=join-kaos')" class="playground-frame" title="SQL Playground: Warna kali Ukuran"></iframe>

## Latihan

1. Tampilkan semua kombinasi warna dan ukuran.
2. Berapa total kombinasinya? (Hitung dua cara: `COUNT(*)` hasil cross, dan perkalian dua `COUNT`.)
3. Tampilkan kombinasi dalam format satu kolom: 'Hitam - S'. (Petunjuk: `||`.)
4. Misal ukuran XL habis untuk warna Navy: tampilkan semua kombinasi KECUALI itu. (Petunjuk: `WHERE NOT (warna = 'Navy' AND ukuran = 'XL')`.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT w.warna, u.ukuran FROM warna w CROSS JOIN ukuran u;
-- 2
SELECT COUNT(*) FROM warna w CROSS JOIN ukuran u;
SELECT (SELECT COUNT(*) FROM warna) * (SELECT COUNT(*) FROM ukuran);
-- 3
SELECT w.warna || ' - ' || u.ukuran AS varian FROM warna w CROSS JOIN ukuran u;
-- 4
SELECT w.warna, u.ukuran FROM warna w CROSS JOIN ukuran u
WHERE NOT (w.warna = 'Navy' AND u.ukuran = 'XL');
```

</details>

---

**Selanjutnya:** [1.12 Subquery](/sql-subquery)
