<script setup>
import { withBase } from 'vitepress'
</script>

# 1.7 Subquery dan CTE: Query di Dalam Query

Kadang satu query tidak cukup. Contoh: "tampilkan siswa yang nilai Matematikanya di atas rata-rata kelas." Rata-ratanya saja butuh satu query, daftar siswanya butuh query lain. Solusinya: **query di dalam query**, alias subquery.

```sql
SELECT nama
FROM siswa
WHERE id IN (
  SELECT id_siswa
  FROM nilai
  WHERE mapel = 'Matematika'
    AND nilai > (
      SELECT AVG(nilai) FROM nilai WHERE mapel = 'Matematika'
    )
);
```

Baca dari dalam ke luar: query paling dalam menghitung rata-rata Matematika (77,1). Query tengah mencari ID siswa yang nilainya di atas itu. Query luar mengubah ID jadi nama. Tiga langkah, satu query.

## Tiga bentuk subquery

**1. Di `WHERE`, menghasilkan daftar** (pakai `IN`):

```sql
SELECT nama FROM siswa
WHERE id IN (SELECT id_siswa FROM nilai WHERE mapel = 'IPA' AND nilai >= 85);
```

**2. Di `WHERE`, menghasilkan satu angka** (pakai `=`, `>`):

```sql
SELECT nama, kelas FROM siswa
WHERE id = (SELECT id_siswa FROM nilai WHERE mapel = 'Matematika' ORDER BY nilai DESC LIMIT 1);
```

**3. Di `FROM`, sebagai tabel sementara** (wajib pakai alias):

```sql
SELECT kelas, AVG(rata) AS rata_kelas
FROM (
  SELECT s.kelas, AVG(n.nilai) AS rata
  FROM siswa s JOIN nilai n ON n.id_siswa = s.id
  GROUP BY s.id
) AS rata_siswa
GROUP BY kelas;
```

## CTE: subquery yang lebih gampang dibaca

Query bersarang tiga lapis itu pusing dibaca. `WITH` (disebut CTE, common table expression) memecahnya jadi langkah-langkah bernama:

```sql
WITH rata_siswa AS (
  SELECT id_siswa, AVG(nilai) AS rata
  FROM nilai
  GROUP BY id_siswa
)
SELECT s.nama, ROUND(r.rata, 1) AS rata_rata
FROM siswa s
JOIN rata_siswa r ON r.id_siswa = s.id
ORDER BY rata_rata DESC;
```

Sama persis hasilnya dengan subquery, tapi dibaca dari atas ke bawah seperti resep masak. Buat query panjang, CTE hampir selalu lebih enak.

## Jebakan umum

- **Subquery multi-baris pakai `=`.** Kalau subquery mengembalikan 5 baris lalu dibandingkan dengan `=`, error. Multi-baris pasangannya `IN`.
- **Subquery di `FROM` tanpa alias.** Wajib dikasih nama (`AS x`), kalau tidak error.
- **Subquery korelasi yang berat.** Ada subquery yang dijalankan ulang untuk tiap baris (topik lanjut, cukup tahu istilahnya dulu).

## Coba di playground

Dataset: **Data Sekolah** (10 siswa, nilai 3 mapel).

<iframe :src="withBase('/sql-playground.html?ds=sekolah')" class="playground-frame" title="SQL Playground: Data Sekolah"></iframe>

## Latihan

1. Tampilkan nama siswa yang nilai IPA-nya 90 atau lebih. (Subquery + `IN`.)
2. Tampilkan nama dan nilai siswa dengan nilai Matematika tertinggi. (Subquery skalar.)
3. Tulis ulang soal nomor 1 pakai `JOIN` biasa, tanpa subquery. (Kadang join lebih sederhana.)
4. Dengan CTE: tampilkan rata-rata nilai per kelas, urut dari yang tertinggi.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama FROM siswa
WHERE id IN (SELECT id_siswa FROM nilai WHERE mapel = 'IPA' AND nilai >= 90);
-- 2
SELECT s.nama, n.nilai FROM siswa s
JOIN nilai n ON n.id_siswa = s.id
WHERE n.mapel = 'Matematika'
  AND n.nilai = (SELECT MAX(nilai) FROM nilai WHERE mapel = 'Matematika');
-- 3
SELECT DISTINCT s.nama FROM siswa s
JOIN nilai n ON n.id_siswa = s.id
WHERE n.mapel = 'IPA' AND n.nilai >= 90;
-- 4
WITH rata_siswa AS (
  SELECT id_siswa, AVG(nilai) AS rata FROM nilai GROUP BY id_siswa
)
SELECT s.kelas, ROUND(AVG(r.rata), 1) AS rata_kelas
FROM siswa s JOIN rata_siswa r ON r.id_siswa = s.id
GROUP BY s.kelas ORDER BY rata_kelas DESC;
```

</details>

---

**Selanjutnya:** [1.8 Window Function: Skill Level Analis](/sql-window)
