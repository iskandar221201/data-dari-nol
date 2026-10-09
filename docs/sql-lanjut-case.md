<script setup>
import { withBase } from 'vitepress'
</script>

# 2.1 CASE: Logika Kondisional di Query

Kadang kamu butuh kolom yang isinya tergantung kondisi. Contoh analis banget: dari skor survei 0-10, kategorikan responden jadi Promoter (9-10), Passive (7-8), atau Detractor (0-6). Itu pola NPS yang dipakai banyak perusahaan.

Di SQL, logika "kalau-maka" ditulis pakai `CASE`:

```sql
SELECT nama, skor,
  CASE
    WHEN skor >= 9 THEN 'Promoter'
    WHEN skor >= 7 THEN 'Passive'
    ELSE 'Detractor'
  END AS kategori
FROM survei;
```

Baca seperti bahasa sehari-hari: kalau skor minimal 9 maka Promoter, kalau minimal 7 maka Passive, selain itu Detractor. `END` menutup bloknya, `AS` memberi nama kolom.

## CASE dicek dari atas ke bawah

Urutan `WHEN` itu penting. Kondisi dicek satu per satu, yang pertama cocok yang menang:

```sql
-- BENAR: dari yang paling ketat dulu
CASE
  WHEN skor >= 9 THEN 'Promoter'
  WHEN skor >= 7 THEN 'Passive'
  ELSE 'Detractor'
END

-- SALAH: skor 10 nyangkut di 'Passive' duluan
CASE
  WHEN skor >= 7 THEN 'Passive'
  WHEN skor >= 9 THEN 'Promoter'
  ELSE 'Detractor'
END
```

## CASE bisa dipakai di mana saja

Di `SELECT` (bikin kolom kategori), di `GROUP BY` (hitung per kategori), bahkan di `ORDER BY`:

```sql
-- hitung responden per kategori
SELECT
  CASE
    WHEN skor >= 9 THEN 'Promoter'
    WHEN skor >= 7 THEN 'Passive'
    ELSE 'Detractor'
  END AS kategori,
  COUNT(*) AS jumlah
FROM survei
GROUP BY kategori;
```

```sql
-- urutkan: Detractor dulu (yang perlu perhatian)
SELECT nama, skor
FROM survei
ORDER BY
  CASE
    WHEN skor < 7 THEN 1
    WHEN skor < 9 THEN 2
    ELSE 3
  END;
```

Trik kedua: `CASE` menghasilkan angka buat ngurutin sesuai urutan bisnismu, bukan alfabetis.

## Jebakan umum

- **Lupa `ELSE`.** Baris yang tidak cocok kondisi mana pun hasilnya `NULL`. Kadang itu disengaja, seringnya lupa.
- **Lupa `END`.** Query-nya error, pesannya kadang membingungkan. Setiap `CASE` wajib ditutup `END`.
- **Bandingin teks vs angka.** `WHEN skor >= 9` (angka) beda dengan `WHEN skor >= '9'` (teks). Di dataset ini skor angka, jadi pakai angka.

## Coba di playground

Dataset: **Survei Kepuasan** (18 responden).

<iframe :src="withBase('/sql-playground.html?ds=survei-kepuasan')" class="playground-frame" title="SQL Playground: Survei Kepuasan"></iframe>

## Latihan

1. Tampilkan nama, skor, dan kategori (Promoter/Passive/Detractor) semua responden.
2. Berapa persen responden yang Promoter? (Petunjuk: `AVG(CASE WHEN ... THEN 1.0 ELSE 0 END)`.)
3. Tampilkan nama dan skor responden Detractor saja, urut dari skor terendah.
4. Kategorikan ulang dengan aturan: skor 10 = 'Fans Berat', 8-9 = 'Puas', sisanya = 'Perlu Perhatian'.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT nama, skor,
  CASE WHEN skor >= 9 THEN 'Promoter' WHEN skor >= 7 THEN 'Passive' ELSE 'Detractor' END AS kategori
FROM survei;
-- 2
SELECT ROUND(AVG(CASE WHEN skor >= 9 THEN 1.0 ELSE 0 END) * 100, 1) AS persen_promoter FROM survei;
-- 3
SELECT nama, skor FROM survei WHERE skor < 7 ORDER BY skor ASC;
-- 4
SELECT nama, skor,
  CASE WHEN skor = 10 THEN 'Fans Berat' WHEN skor >= 8 THEN 'Puas' ELSE 'Perlu Perhatian' END AS kategori
FROM survei;
```

</details>

---

**Selanjutnya:** [2.2 UNION: Menggabungkan Hasil Query](/sql-lanjut-union)
