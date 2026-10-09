<script setup>
import { withBase } from 'vitepress'
</script>

# 1.12 Subquery: Query di Dalam Query

Kadang satu query tidak cukup. Contoh: "tampilkan siswa yang nilai Matematikanya di atas rata-rata kelas." Rata-ratanya saja butuh satu query, daftar siswanya butuh query lain. Solusinya: **query di dalam query**.

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

Baca dari dalam ke luar: query paling dalam menghitung rata-rata Matematika. Query tengah mencari ID siswa yang nilainya di atas itu. Query luar mengubah ID jadi nama.

## Dua bentuk utama

**1. Menghasilkan daftar** (pakai `IN`):

```sql
SELECT nama FROM siswa
WHERE id IN (SELECT id_siswa FROM nilai WHERE mapel = 'IPA' AND nilai >= 85);
```

**2. Menghasilkan satu angka** (pakai `=`, `>`, `<`):

```sql
SELECT s.nama, n.nilai
FROM siswa s JOIN nilai n ON n.id_siswa = s.id
WHERE n.mapel = 'Matematika'
  AND n.nilai = (SELECT MAX(nilai) FROM nilai WHERE mapel = 'Matematika');
```

## Kapan subquery, kapan JOIN

Banyak soal bisa dijawab dua-duanya:

```sql
-- subquery
SELECT nama FROM siswa
WHERE id IN (SELECT id_siswa FROM nilai WHERE mapel = 'IPA' AND nilai >= 85);

-- join (hasil sama)
SELECT DISTINCT s.nama FROM siswa s
JOIN nilai n ON n.id_siswa = s.id
WHERE n.mapel = 'IPA' AND n.nilai >= 85;
```

Aturan praktisnya: kalau butuh **daftar buat disaring**, subquery lebih enak dibaca. Kalau butuh **kolom dari tabel lain**, join. Tidak ada yang selalu benar, pilih yang paling jelas.

## Jebakan umum

- **Subquery multi-baris pakai `=`.** Kalau subquery mengembalikan 5 baris lalu dibandingkan dengan `=`, error. Multi-baris pasangannya `IN`.
- **Subquery di `FROM` butuh alias dan topik sendiri.** Subquery di `FROM` (tabel turunan) dibahas bareng CTE di halaman berikutnya, karena di sana dia lebih rapi.

## Coba di playground

Dataset: **Data Sekolah** (10 siswa, nilai 3 mapel).

<iframe :src="withBase('/sql-playground.html?ds=sekolah')" class="playground-frame" title="SQL Playground: Data Sekolah"></iframe>

## Latihan

1. Tampilkan nama siswa yang nilai IPA-nya 90 atau lebih.
2. Tampilkan nama dan nilai siswa dengan nilai Matematika tertinggi.
3. Tulis ulang soal nomor 1 pakai `JOIN`, bandingkan mana yang lebih jelas buatmu.
4. Siswa mana yang nilai B. Indonesianya di bawah rata-rata B. Indonesia?

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
SELECT nama FROM siswa
WHERE id IN (SELECT id_siswa FROM nilai
  WHERE mapel = 'B. Indonesia'
  AND nilai < (SELECT AVG(nilai) FROM nilai WHERE mapel = 'B. Indonesia'));
```

</details>

---

**Selanjutnya:** [1.13 CTE: Query Bertingkat yang Rapi](/sql-cte)
