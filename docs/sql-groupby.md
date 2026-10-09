<script setup>
import { withBase } from 'vitepress'
</script>

# 1.6 GROUP BY dan HAVING: Rangkuman per Kelompok

Satu angka total itu kurang bercerita. Lebih menarik: omzet **per stand**, menu **paling laris**, hari **paling ramai**. Caranya: pecah baris jadi kelompok-kelompok, lalu agregat tiap kelompok.

```sql
SELECT stand, SUM(porsi * harga) AS omzet
FROM transaksi
GROUP BY stand
ORDER BY omzet DESC;
```

`GROUP BY stand` memecah 18 baris jadi 3 kelompok (satu per stand), lalu `SUM` dihitung **di dalam tiap kelompok**. Hasilnya satu baris per stand. Ini pasangan paling sering dipakai di SQL: agregasi + `GROUP BY`.

## Urutan eksekusinya

`FROM` → `WHERE` → `GROUP BY` → `SELECT` → `ORDER BY`. Perhatikan `WHERE` ada **sebelum** `GROUP BY`: baris disaring dulu, baru dikelompokkan. Dan `SELECT` (termasuk alias `omzet`) lahir **sesudah** pengelompokan.

## HAVING: saring hasil kelompok

Mau cuma stand yang omzetnya di atas 2 juta? Godaannya pakai `WHERE omzet > 2000000`, tapi `WHERE` tidak kenal `omzet` karena alias itu lahir di `SELECT`, sesudah `WHERE` jalan. Solusinya: `HAVING`, yang memang dirancang buat menyaring **sesudah** pengelompokan.

```sql
SELECT stand, SUM(porsi * harga) AS omzet
FROM transaksi
GROUP BY stand
HAVING omzet > 2000000
ORDER BY omzet DESC;
```

Aturannya simpel dan wajib hafal: **sebelum agregasi pakai `WHERE`, sesudah agregasi pakai `HAVING`.** Ketukar dua ini adalah kesalahan paling umum di SQL.

## GROUP BY lebih dari satu kolom

```sql
SELECT tanggal, stand, SUM(porsi * harga) AS omzet
FROM transaksi
GROUP BY tanggal, stand
ORDER BY tanggal, omzet DESC;
```

Hasilnya omzet per stand **per hari**. Tiap kombinasi unik tanggal + stand jadi satu baris.

## Jebakan umum

- **Kolom non-agregat wajib masuk `GROUP BY`.** `SELECT stand, SUM(...)` harus ditemani `GROUP BY stand`. Kalau tidak, error.
- **`WHERE` buat saring kelompok.** Salah kamar. Kelompok disaring pakai `HAVING`.
- **`HAVING` tanpa `GROUP BY`.** Bisa secara sintaks (dianggap satu kelompok), tapi 99% kasus itu tanda kamu salah pakai. Saring baris biasa pakai `WHERE`.

## Coba di playground

Dataset: **Kantin Kampus** (18 transaksi, 3 stand, 3 hari).

<iframe :src="withBase('/sql-playground.html?ds=kantin')" class="playground-frame" title="SQL Playground: Kantin Kampus"></iframe>

## Latihan

1. Tampilkan total porsi terjual per menu, urut dari yang terbesar.
2. Tampilkan omzet per tanggal.
3. Stand mana saja yang total porsinya di atas 100? (Pakai `HAVING`.)
4. Tampilkan rata-rata porsi per stand per tanggal.

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT menu, SUM(porsi) AS terjual FROM transaksi GROUP BY menu ORDER BY terjual DESC;
-- 2
SELECT tanggal, SUM(porsi * harga) AS omzet FROM transaksi GROUP BY tanggal ORDER BY tanggal;
-- 3
SELECT stand, SUM(porsi) AS total FROM transaksi GROUP BY stand HAVING total > 100;
-- 4
SELECT tanggal, stand, AVG(porsi) AS rata_porsi FROM transaksi GROUP BY tanggal, stand;
```

</details>

---

**Selanjutnya:** [1.7 INNER JOIN](/sql-join-inner)
