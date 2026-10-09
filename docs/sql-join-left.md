<script setup>
import { withBase } from 'vitepress'
</script>

# 1.8 LEFT JOIN: Pertahankan Tabel Kiri

`INNER JOIN` kemarin cuma menampilkan yang cocok di kedua tabel. Tapi analis sering butuh kebalikannya: "tampilkan SEMUA karyawan, dan kalau ada departemennya tampilkan juga." Yang belum punya departemen tetap muncul, kolom departemennya kosong (`NULL`).

```sql
SELECT k.nama, d.nama_dept
FROM karyawan k
LEFT JOIN departemen d ON k.id_dept = d.id_dept;
```

`LEFT JOIN` mempertahankan **semua baris tabel kiri** (`karyawan`). Yang tidak punya pasangan di kanan, kolom kanannya jadi `NULL`. Di dataset ini: Dewi dan Joko belum punya departemen, jadi `nama_dept`-nya `NULL`.

## Pola paling penting: cari yang tidak punya pasangan

```sql
-- karyawan yang belum punya departemen
SELECT k.nama
FROM karyawan k
LEFT JOIN departemen d ON k.id_dept = d.id_dept
WHERE d.id_dept IS NULL;
```

Ini pola paling sering dipakai dari `LEFT JOIN`: gabungkan, lalu saring yang `NULL`. "Pelanggan yang belum pernah memesan", "produk yang belum pernah laku", "siswa yang belum mengumpulkan tugas", semuanya pola yang sama.

## Kiri vs kanan: soal urutan tulis

`LEFT JOIN` mempertahankan tabel yang ditulis **di kiri** (sebelum kata `JOIN`). Kalau tabelnya dibalik, pakai `RIGHT JOIN` (ada di halaman 1.9) atau cukup tukar urutannya. Kebanyakan analis hampir selalu pakai `LEFT JOIN` dan mengatur urutan tabelnya, lebih gampang dibaca.

## Jebakan umum

- **`WHERE` membunuh `LEFT JOIN`.** Ini jebakan klasik:
  ```sql
  -- SALAH: yang NULL ikut hilang, LEFT JOIN-nya jadi sia-sia
  SELECT k.nama, d.nama_dept FROM karyawan k
  LEFT JOIN departemen d ON k.id_dept = d.id_dept
  WHERE d.nama_dept = 'IT';
  ```
  Syarat yang menyangkut tabel kanan harus ditulis di `ON`, bukan `WHERE`:
  ```sql
  -- BENAR
  SELECT k.nama, d.nama_dept FROM karyawan k
  LEFT JOIN departemen d ON k.id_dept = d.id_dept AND d.nama_dept = 'IT';
  ```
- **`= NULL` tidak pernah benar.** Yang tidak punya pasangan itu `NULL`, ceknya pakai `IS NULL`.

## Coba di playground

Dataset: **Karyawan & Dept** (6 karyawan, 3 departemen; ada yang belum berpasangan).

<iframe :src="withBase('/sql-playground.html?ds=join-karyawan')" class="playground-frame" title="SQL Playground: Join Karyawan dan Dept"></iframe>

## Latihan

1. Tampilkan semua karyawan beserta nama departemennya (yang belum punya tetap muncul).
2. Siapa saja yang belum punya departemen?
3. Departemen apa yang belum punya karyawan? (Petunjuk: balik, `departemen LEFT JOIN karyawan`.)
4. Tampilkan nama karyawan IT saja, tapi yang belum punya departemen tetap muncul. (Syarat di `ON`.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT k.nama, d.nama_dept FROM karyawan k LEFT JOIN departemen d ON k.id_dept = d.id_dept;
-- 2
SELECT k.nama FROM karyawan k LEFT JOIN departemen d ON k.id_dept = d.id_dept WHERE d.id_dept IS NULL;
-- 3
SELECT d.nama_dept FROM departemen d LEFT JOIN karyawan k ON k.id_dept = d.id_dept WHERE k.id IS NULL;
-- 4
SELECT k.nama, d.nama_dept FROM karyawan k
LEFT JOIN departemen d ON k.id_dept = d.id_dept AND d.nama_dept = 'IT';
```

</details>

---

**Selanjutnya:** [1.9 RIGHT JOIN dan FULL OUTER JOIN](/sql-join-right-full)
