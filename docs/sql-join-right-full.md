<script setup>
import { withBase } from 'vitepress'
</script>

# 1.9 RIGHT JOIN dan FULL OUTER JOIN

`LEFT JOIN` mempertahankan tabel kiri. `RIGHT JOIN` kebalikannya: mempertahankan **tabel kanan**.

```sql
-- semua supplier, walau belum punya produk
SELECT p.nama AS produk, s.nama AS supplier
FROM produk p
RIGHT JOIN supplier s ON p.id_supplier = s.id_supplier;
```

Hasilnya: UD Tekstil muncul walau tidak punya produk (kolom produknya `NULL`). Ini sama persis dengan menulis `supplier LEFT JOIN produk` dengan urutan dibalik. Makanya di dunia nyata `RIGHT JOIN` jarang dipakai, kebanyakan orang cukup mengatur urutan tabel dan pakai `LEFT JOIN`.

## FULL OUTER JOIN: pertahankan dua-duanya

```sql
SELECT p.nama AS produk, s.nama AS supplier
FROM produk p
FULL JOIN supplier s ON p.id_supplier = s.id_supplier;
```

`FULL JOIN` mempertahankan **semua baris dari kedua tabel**: produk tanpa supplier ikut muncul, supplier tanpa produk ikut muncul. Di dataset ini hasilnya 5 baris: 3 yang berpasangan, Celana (tanpa supplier), UD Tekstil (tanpa produk).

## Emulasi buat database yang tidak mendukung

Tidak semua database punya `FULL JOIN` (MySQL misalnya tidak ada). Pola emulasinya pakai `UNION`:

```sql
SELECT p.nama AS produk, s.nama AS supplier
FROM produk p LEFT JOIN supplier s ON p.id_supplier = s.id_supplier
UNION
SELECT p.nama, s.nama
FROM produk p RIGHT JOIN supplier s ON p.id_supplier = s.id_supplier;
```

`LEFT JOIN` mengambil semua produk, `RIGHT JOIN` mengambil semua supplier, `UNION` menggabungkan dan membuang duplikatnya. Hasilnya sama dengan `FULL JOIN`.

## Kapan pakai yang mana

| Jenis | Pakai saat |
|---|---|
| `INNER JOIN` | cuma butuh yang berpasangan (paling sering) |
| `LEFT JOIN` | butuh semua dari tabel utama + info tambahan kalau ada |
| `RIGHT JOIN` | sama kayak LEFT, cuma urutan tabelnya kebalik (jarang dipakai langsung) |
| `FULL JOIN` | butuh semua dari kedua sisi, misal rekonsiliasi dua sumber data |

## Jebakan umum

- **`FULL JOIN` di database lama.** Kalau error, pakai pola emulasi `UNION` di atas.
- **Lupa `ON` tetap wajib.** Semua jenis join butuh kondisi penggabungan.

## Coba di playground

Dataset: **Produk & Supplier** (4 produk, 3 supplier; ada yang belum berpasangan di kedua sisi).

<iframe :src="withBase('/sql-playground.html?ds=join-produk')" class="playground-frame" title="SQL Playground: Join Produk dan Supplier"></iframe>

## Latihan

1. Tampilkan semua supplier beserta produknya (yang belum punya produk tetap muncul).
2. Tampilkan semua produk dan semua supplier dalam satu hasil (`FULL JOIN`).
3. Tulis ulang nomor 2 pakai emulasi `UNION`, bandingkan hasilnya.
4. Supplier mana yang belum punya produk? Produk mana yang belum punya supplier?

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT p.nama AS produk, s.nama AS supplier
FROM produk p RIGHT JOIN supplier s ON p.id_supplier = s.id_supplier;
-- 2
SELECT p.nama AS produk, s.nama AS supplier
FROM produk p FULL JOIN supplier s ON p.id_supplier = s.id_supplier;
-- 3 (hasil sama dengan nomor 2)
-- 4
SELECT s.nama FROM supplier s LEFT JOIN produk p ON p.id_supplier = s.id_supplier WHERE p.id IS NULL;
SELECT p.nama FROM produk p LEFT JOIN supplier s ON p.id_supplier = s.id_supplier WHERE s.id_supplier IS NULL;
```

</details>

---

**Selanjutnya:** [1.10 SELF JOIN](/sql-join-self)
