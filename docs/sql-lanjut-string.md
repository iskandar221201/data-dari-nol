<script setup>
import { withBase } from 'vitepress'
</script>

# 2.3 Fungsi String: Membereskan Teks

Data teks jarang rapi: huruf besar-kecil acak, spasi nyasar di ujung, format tidak konsisten. Sebelum dianalisis, teks perlu dibereskan, dan SQL punya fungsinya.

| Fungsi | Arti | Contoh |
|---|---|---|
| `UPPER(x)` | huruf besar semua | `'budi'` → `'BUDI'` |
| `LOWER(x)` | huruf kecil semua | `'BUDI'` → `'budi'` |
| `TRIM(x)` | buang spasi di ujung | `'  budi  '` → `'budi'` |
| `LENGTH(x)` | panjang teks | `LENGTH('budi')` → `4` |
| `SUBSTR(x, mulai, n)` | potong teks | `SUBSTR('budi', 1, 2)` → `'bu'` |
| `INSTR(x, cari)` | posisi teks di dalam teks | `INSTR('budi', 'd')` → `3` |
| `\|\|` | gabung teks | `'budi' \|\| '@mail.com'` |

Dataset kontak di bawah namanya berantakan. Bereskan:

```sql
-- samakan format: trim + huruf besar semua
SELECT UPPER(TRIM(nama)) AS nama_bersih FROM kontak;
```

```sql
-- ambil nama depan (sampai spasi pertama)
SELECT SUBSTR(TRIM(nama), 1, INSTR(TRIM(nama), ' ') - 1) AS nama_depan
FROM kontak;
```

```sql
-- bikin username dari nama: huruf kecil, spasi jadi titik
SELECT LOWER(REPLACE(TRIM(nama), ' ', '.')) AS username FROM kontak;
```

Catatan: `SUBSTR` di SQLite mulai dari 1 (`'budi'` posisi 1 = `'b'`). `REPLACE(x, cari, ganti)` mengganti semua kemunculan.

## Pola andalan: bandingkan tanpa peduli huruf

```sql
SELECT * FROM kontak WHERE LOWER(TRIM(nama)) = 'budi santoso';
```

Standardisasi dulu (di query), baru bandingkan. Pola ini dipakai di mana-mana: dedup nama, matching antar tabel, filter.

## Jebakan umum

- **Perbandingan teks peka huruf.** `'Budi' <> 'budi'` itu benar (dianggap beda). Makanya standardisasi dulu.
- **`SUBSTR` mulai dari 1**, bukan 0 seperti kebanyakan bahasa pemrograman.
- **Fungsi di `WHERE` bikin lambat di data besar.** `WHERE LOWER(nama) = ...` tidak bisa pakai index. Untuk data kecil tidak masalah; untuk jutaan baris, bereskan sekali saat input/ETL.

## Coba di playground

Dataset: **Data Kontak** (12 kontak, nama berantakan).

<iframe :src="withBase('/sql-playground.html?ds=data-kontak')" class="playground-frame" title="SQL Playground: Data Kontak"></iframe>

## Latihan

1. Tampilkan nama semua kontak: trim + huruf besar semua.
2. Tampilkan nama depan tiap kontak.
3. Buat kolom username: nama kecil semua, spasi jadi underscore.
4. Cari kontak yang namanya mengandung 'sari' tanpa peduli huruf besar-kecil. (Petunjuk: `LOWER` + `LIKE`.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT UPPER(TRIM(nama)) AS nama FROM kontak;
-- 2
SELECT SUBSTR(TRIM(nama), 1, INSTR(TRIM(nama), ' ') - 1) AS nama_depan FROM kontak;
-- 3
SELECT LOWER(REPLACE(TRIM(nama), ' ', '_')) AS username FROM kontak;
-- 4
SELECT TRIM(nama) AS nama FROM kontak WHERE LOWER(nama) LIKE '%sari%';
```

</details>

---

**Selanjutnya:** [2.4 Fungsi Tanggal](/sql-tanggal)
