<script setup>
import { withBase } from 'vitepress'
</script>

# 1.6 JOIN: Menggabungkan Tabel

Di database beneran, data tidak disimpan dalam satu tabel raksasa. Nama pelanggan disimpan sekali di tabel `pelanggan`, daftar produk di tabel `produk`, dan tabel `pesanan` cuma menyimpan ID-nya. Kenapa dipecah? Supaya kalau Budi ganti nomor HP, cukup ubah satu baris, bukan 50 baris pesanan.

Konsekuensinya: buat menjawab "siapa beli apa", kamu harus **menggabungkan** tabel lagi. Itu kerjaan `JOIN`.

```sql
SELECT pl.nama AS pelanggan, pr.nama AS produk, ps.jumlah
FROM pesanan ps
JOIN pelanggan pl ON ps.id_pelanggan = pl.id
JOIN produk pr ON ps.id_produk = pr.id;
```

Baca pelan-pelan: dari tabel `pesanan`, gabungkan ke `pelanggan` di mana ID-nya cocok, gabungkan ke `produk` di mana ID-nya cocok. `ps`, `pl`, `pr` itu **alias tabel**, singkatan biar query tidak bertele-tele.

## INNER JOIN vs LEFT JOIN

`JOIN` saja artinya `INNER JOIN`: cuma baris yang **cocok di kedua tabel** yang keluar.

```sql
-- pelanggan yang BELUM PERNAH memesan: tidak akan muncul di INNER JOIN
SELECT pl.nama
FROM pelanggan pl
LEFT JOIN pesanan ps ON ps.id_pelanggan = pl.id
WHERE ps.id IS NULL;
```

`LEFT JOIN` mempertahankan **semua baris tabel kiri** (`pelanggan`), walau tidak ada pasangannya di kanan. Yang tidak punya pasangan, kolom dari tabel kanannya jadi `NULL`. Ini tepat saat kamu pertama kali ketemu `NULL` beneran: bukan teori, tapi muncul dari query-mu sendiri.

| Jenis | Yang dipertahankan |
|---|---|
| `INNER JOIN` | cuma yang cocok di kedua tabel |
| `LEFT JOIN` | semua baris tabel kiri |
| `RIGHT JOIN` | semua baris tabel kanan (jarang dipakai, biasanya query-nya dibalik jadi `LEFT JOIN`) |

## ON vs WHERE: jangan ketukar

```sql
-- ON: syarat MENGGABUNGKAN (baris mana yang berpasangan)
-- WHERE: syarat MENYARING (baris mana yang ditampilkan)
SELECT pl.nama, ps.tanggal
FROM pelanggan pl
LEFT JOIN pesanan ps ON ps.id_pelanggan = pl.id AND ps.tanggal >= '2024-03-10'
WHERE pl.kota = 'Cirebon';
```

Kalau syarat tanggal ditulis di `WHERE` (`WHERE ps.tanggal >= ...`), pelanggan yang tidak punya pesanan ikut hilang karena `ps.tanggal`-nya `NULL`. Ditulis di `ON`, mereka tetap muncul. Beda kamar, beda akibat.

## Jebakan umum

- **JOIN tanpa `ON`.** Menghasilkan ledakan baris (setiap baris dikawinkan dengan setiap baris). Selalu cek jumlah baris hasil join, kalau membengkak tidak wajar, curigai `ON`-nya.
- **Kolom ambigu.** `id` ada di tiga tabel. Tulis `ps.id`, bukan `id` saja, atau database protes tidak tahu maksudmu.
- **Lupa alias bikin pusing.** Query join tanpa alias tabel itu bisa dibaca, tapi melelahkan. Biasakan pakai alias pendek.

## Coba di playground

Dataset: **Toko Online** (3 tabel: pelanggan, produk, pesanan).

<iframe :src="withBase('/sql-playground.html?ds=toko-online')" class="playground-frame" title="SQL Playground: Toko Online"></iframe>

## Latihan

1. Tampilkan nama pelanggan, nama produk, jumlah, dan tanggal untuk semua pesanan.
2. Siapa saja pelanggan yang belum pernah memesan? (Pakai `LEFT JOIN` + `IS NULL`.)
3. Produk apa yang belum pernah laku satu pun?
4. Tampilkan omzet per kota (gabungkan 3 tabel, `GROUP BY` kota).
5. Tampilkan nama pelanggan Cirebon beserta tanggal pesanannya, termasuk yang belum pernah memesan. (Petunjuk: syarat kota di `WHERE`, syarat join di `ON`.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT pl.nama AS pelanggan, pr.nama AS produk, ps.jumlah, ps.tanggal
FROM pesanan ps
JOIN pelanggan pl ON ps.id_pelanggan = pl.id
JOIN produk pr ON ps.id_produk = pr.id;
-- 2
SELECT pl.nama FROM pelanggan pl
LEFT JOIN pesanan ps ON ps.id_pelanggan = pl.id
WHERE ps.id IS NULL;
-- 3
SELECT pr.nama FROM produk pr
LEFT JOIN pesanan ps ON ps.id_produk = pr.id
WHERE ps.id IS NULL;
-- 4
SELECT pl.kota, SUM(ps.jumlah * pr.harga) AS omzet
FROM pesanan ps
JOIN pelanggan pl ON ps.id_pelanggan = pl.id
JOIN produk pr ON ps.id_produk = pr.id
GROUP BY pl.kota ORDER BY omzet DESC;
-- 5
SELECT pl.nama, ps.tanggal FROM pelanggan pl
LEFT JOIN pesanan ps ON ps.id_pelanggan = pl.id
WHERE pl.kota = 'Cirebon';
```

</details>

---

**Selanjutnya:** [1.7 Subquery dan CTE: Query di Dalam Query](/sql-subquery)
