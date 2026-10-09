<script setup>
import { withBase } from 'vitepress'
</script>

# 1.7 INNER JOIN: Yang Cocok Saja

Di database beneran, data dipecah ke banyak tabel biar tidak ada duplikasi. Nama siswa disimpan di tabel `siswa`, nama kelas di tabel `kelas`. Buat menjawab "siapa di kelas apa", dua tabel itu harus digabungkan lagi.

```sql
SELECT s.nama, k.nama_kelas
FROM siswa s
INNER JOIN kelas k ON s.id_kelas = k.id_kelas;
```

`INNER JOIN` (boleh disingkat `JOIN`) menggabungkan baris yang **cocok di kedua tabel**, cocoknya ditentukan di `ON`. Di sini: `s.id_kelas = k.id_kelas`. `s` dan `k` itu alias tabel, singkatan biar query tidak bertele-tele.

## Cara mikirnya

Bayangkan dua lingkaran yang beririsan (diagram Venn). `INNER JOIN` mengambil **irisannya saja**: siswa yang punya kelas yang terdaftar, dan kelas yang punya siswa. Kalau ada siswa tanpa kelas, dia tidak muncul. Kalau ada kelas tanpa siswa, tidak muncul juga.

Di dataset halaman ini semua cocok, jadi hasilnya 6 baris. Halaman-halaman berikutnya menunjukkan apa yang terjadi kalau tidak semua cocok.

## JOIN lebih dari dua tabel

```sql
SELECT s.nama, k.nama_kelas, k.wali
FROM siswa s
JOIN kelas k ON s.id_kelas = k.id_kelas
WHERE k.nama_kelas = 'XII-1';
```

Rantai `JOIN` bisa sepanjang yang dibutuhkan. Tiap `JOIN` butuh `ON`-nya sendiri.

## Jebakan umum

- **JOIN tanpa `ON`.** Menghasilkan ledakan baris (setiap baris dikawinkan dengan setiap baris). Itu namanya cartesian product, dan 99% kasus itu bug. Selalu tulis `ON`.
- **Kolom ambigu.** `id` ada di banyak tabel. Tulis `s.id`, bukan `id` saja.
- **Lupa kalau INNER membuang yang tidak cocok.** Ini bukan bug, ini definisinya. Kalau butuh yang tidak cocok ikut muncul, pakai `LEFT JOIN` di halaman berikutnya.

## Coba di playground

Dataset: **Siswa & Kelas** (6 siswa, 3 kelas).

<iframe :src="withBase('/sql-playground.html?ds=join-siswa')" class="playground-frame" title="SQL Playground: Join Siswa dan Kelas"></iframe>

## Latihan

1. Tampilkan nama siswa dan nama kelasnya.
2. Tampilkan nama siswa, nama kelas, dan wali kelasnya, khusus kelas XII-1.
3. Berapa jumlah siswa per kelas? (Gabungkan `JOIN` + `GROUP BY`.)
4. Tampilkan kelas yang siswanya lebih dari 1. (Petunjuk: `HAVING`.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT s.nama, k.nama_kelas FROM siswa s JOIN kelas k ON s.id_kelas = k.id_kelas;
-- 2
SELECT s.nama, k.nama_kelas, k.wali FROM siswa s
JOIN kelas k ON s.id_kelas = k.id_kelas WHERE k.nama_kelas = 'XII-1';
-- 3
SELECT k.nama_kelas, COUNT(*) AS jumlah FROM siswa s
JOIN kelas k ON s.id_kelas = k.id_kelas GROUP BY k.nama_kelas;
-- 4
SELECT k.nama_kelas, COUNT(*) AS jumlah FROM siswa s
JOIN kelas k ON s.id_kelas = k.id_kelas GROUP BY k.nama_kelas HAVING jumlah > 1;
```

</details>

---

**Selanjutnya:** [1.8 LEFT JOIN](/sql-join-left)
