<script setup>
import { withBase } from 'vitepress'
</script>

# 2.3 Fungsi String dan Tanggal

Data teks jarang rapi: huruf besar-kecil acak, spasi nyasar di ujung. Dan tanggal... tanggal selalu bikin pusing. Untungnya SQL punya fungsi buat membereskannya tanpa keluar dari query.

## Fungsi string yang paling sering dipakai

| Fungsi | Arti | Contoh |
|---|---|---|
| `UPPER(x)` | jadi huruf besar semua | `'budi'` → `'BUDI'` |
| `LOWER(x)` | jadi huruf kecil semua | `'BUDI'` → `'budi'` |
| `TRIM(x)` | buang spasi di ujung | `'  budi  '` → `'budi'` |
| `LENGTH(x)` | panjang teks | `LENGTH('budi')` → `4` |
| `SUBSTR(x, mulai, n)` | potong teks | `SUBSTR('budi', 1, 2)` → `'bu'` |
| `\|\|` | gabung teks | `'budi' \|\| '@mail.com'` |

Dataset kontak di bawah namanya berantakan. Rapikan:

```sql
SELECT TRIM(nama) AS nama_rapi FROM kontak;
```

```sql
-- samakan format: tiap kata huruf depannya besar sisanya kecil butuh trik,
-- yang gampang: bandingkan tanpa peduli huruf
SELECT * FROM kontak WHERE LOWER(TRIM(nama)) = 'budi santoso';
```

```sql
-- ambil nama depan saja (sampai spasi pertama)
SELECT SUBSTR(TRIM(nama), 1, INSTR(TRIM(nama), ' ') - 1) AS nama_depan
FROM kontak;
```

Catatan: `SUBSTR` di SQLite mulai dari 1, bukan 0. `'budi'` posisi 1 = `'b'`.

## Fungsi tanggal

Di SQLite, tanggal biasanya disimpan sebagai teks `YYYY-MM-DD`. Fungsi kuncinya:

```sql
-- umur dari tanggal lahir
SELECT nama,
  CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tgl_lahir) AS INTEGER) AS umur
FROM kontak;
```

```sql
-- yang lahir di tahun 1998
SELECT nama FROM kontak WHERE strftime('%Y', tgl_lahir) = '1998';
```

```sql
-- selisih hari antara dua tanggal
SELECT CAST(julianday('2024-06-10') - julianday('2024-06-01') AS INTEGER) AS selisih_hari;
```

`strftime('%Y', ...)` mengambil tahunnya, `julianday(...)` mengubah tanggal jadi angka hari sehingga bisa dikurangi. Pola `julianday(a) - julianday(b)` ini bakal kepakai banget di studi kasus logistik nanti.

## Jebakan umum

- **Tanggal format berantakan.** Fungsi tanggal cuma jalan kalau formatnya konsisten `YYYY-MM-DD`. Kalau campur (`01/05/2024`, `5 Mei 2024`), bereskan dulu (lihat [2.4 Data Cleaning](/sql-lanjut-cleaning)).
- **`SUBSTR` mulai dari 1.** Beda dengan kebanyakan bahasa pemrograman yang mulai dari 0.
- **Perbandingan teks peka huruf.** `'Budi' <> 'budi'` itu benar (dianggap beda). Makanya standardisasi pakai `LOWER`/`UPPER` sebelum dibandingkan.

## Coba di playground

Dataset: **Data Kontak** (12 kontak, nama berantakan).

<iframe :src="withBase('/sql-playground.html?ds=data-kontak')" class="playground-frame" title="SQL Playground: Data Kontak"></iframe>

## Latihan

1. Tampilkan nama semua kontak dalam huruf besar semua, tanpa spasi berlebih.
2. Tampilkan nama dan umur tiap kontak.
3. Siapa saja yang lahir tahun 1998?
4. Tampilkan email dan 3 huruf pertama nama (pakai `SUBSTR`).

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT UPPER(TRIM(nama)) AS nama FROM kontak;
-- 2
SELECT TRIM(nama) AS nama,
  CAST(strftime('%Y', 'now') AS INTEGER) - CAST(strftime('%Y', tgl_lahir) AS INTEGER) AS umur
FROM kontak;
-- 3
SELECT TRIM(nama) AS nama FROM kontak WHERE strftime('%Y', tgl_lahir) = '1998';
-- 4
SELECT email, SUBSTR(TRIM(nama), 1, 3) AS inisial FROM kontak;
```

</details>

---

**Selanjutnya:** [2.4 Data Cleaning dengan SQL](/sql-lanjut-cleaning)
