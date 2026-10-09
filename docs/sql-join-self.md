<script setup>
import { withBase } from 'vitepress'
</script>

# 1.10 SELF JOIN: Tabel Gabung Dirinya Sendiri

Terdengar aneh, tapi ada kasus di mana tabel harus digabung dengan **dirinya sendiri**. Contoh klasik: struktur organisasi. Tabel `karyawan` punya kolom `id_manager` yang menunjuk ke `id` di tabel yang sama.

```sql
SELECT k.nama AS karyawan, m.nama AS atasan
FROM karyawan k
JOIN karyawan m ON k.id_manager = m.id;
```

Satu tabel dipakai dua peran: `k` sebagai karyawan, `m` sebagai atasan (manager). Syarat gabungnya: `id_manager` si karyawan = `id` si atasan. Hasilnya tiap karyawan berpasangan dengan nama atasannya.

## Kenapa harus LEFT JOIN di sini

```sql
SELECT k.nama AS karyawan, m.nama AS atasan
FROM karyawan k
LEFT JOIN karyawan m ON k.id_manager = m.id;
```

Bu Ratna adalah direktur, tidak punya atasan (`id_manager`-nya `NULL`). Pakai `INNER JOIN`, dia hilang dari hasil. Pakai `LEFT JOIN`, dia tetap muncul dengan atasan `NULL`. Untuk struktur hierarki, `LEFT JOIN` hampir selalu yang benar.

## Alias wajib beda

Di self join, alias tabel **wajib** dan harus beda (`k` vs `m`). Tanpa alias, database tidak tahu `nama` yang mana yang dimaksud. Ini satu-satunya jenis join di mana alias bukan opsional.

## Kasus lain yang pakai pola ini

- Tabel penerbangan: bandara asal dan tujuan menunjuk ke tabel bandara yang sama.
- Tabel transaksi: "pembeli yang beli produk yang sama" (join tabel ke dirinya lewat produk).
- Data karyawan: "siapa yang satu tim" (id_manager yang sama, tapi id beda).

## Jebakan umum

- **Alias sama atau tidak pakai alias.** Error ambigu, atau hasilnya ngaco.
- **Pakai INNER JOIN buat hierarki.** Pucuk pimpinan (yang tidak punya atasan) hilang. Pakai `LEFT JOIN`.

## Coba di playground

Dataset: **Struktur Organisasi** (6 karyawan, 1 tabel).

<iframe :src="withBase('/sql-playground.html?ds=join-struktur')" class="playground-frame" title="SQL Playground: Struktur Organisasi"></iframe>

## Latihan

1. Tampilkan tiap karyawan beserta nama atasannya (direktur tetap muncul).
2. Siapa saja bawahan langsung Pak Hendra?
3. Tampilkan pasangan karyawan yang satu atasan (satu tim), tampilkan nama keduanya dan nama atasannya. (Petunjuk: join 3x: karyawan k1, karyawan k2, atasan m.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT k.nama AS karyawan, m.nama AS atasan
FROM karyawan k LEFT JOIN karyawan m ON k.id_manager = m.id;
-- 2
SELECT k.nama FROM karyawan k JOIN karyawan m ON k.id_manager = m.id
WHERE m.nama = 'Pak Hendra';
-- 3
SELECT k1.nama AS karyawan1, k2.nama AS karyawan2, m.nama AS atasan
FROM karyawan k1
JOIN karyawan k2 ON k1.id_manager = k2.id_manager AND k1.id < k2.id
JOIN karyawan m ON k1.id_manager = m.id;
```

</details>

---

**Selanjutnya:** [1.11 CROSS JOIN](/sql-join-cross)
