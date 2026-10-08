# Bab 2: SQL

SQL adalah bahasa untuk mengambil dan mengolah data dari database. Hampir semua lowongan analis data mencantumkannya sebagai syarat. Kabar baiknya: 80% kebutuhan sehari-hari cuma pakai segelintir perintah.

## 1. Cara baca query

Baca query SQL dari tengah, bukan dari atas:

```sql
SELECT nama, gaji
FROM karyawan
WHERE divisi = 'IT';
```

Urutannya secara logika: `FROM` (tabel mana) dulu, lalu `WHERE` (saring baris), terakhir `SELECT` (kolom apa yang ditampilkan). Membaca dengan urutan ini bikin query panjang jadi gampang diikuti.

## 2. Perintah yang paling sering dipakai

| Perintah | Fungsi | Contoh |
|---|---|---|
| `SELECT ... FROM` | Ambil kolom dari tabel | `SELECT nama FROM karyawan` |
| `WHERE` | Saring baris | `WHERE gaji > 8000000` |
| `ORDER BY` | Urutkan | `ORDER BY gaji DESC` |
| `LIMIT` | Batasi jumlah baris | `LIMIT 10` |
| `GROUP BY` + agregasi | Rangkuman per kelompok | `SELECT divisi, AVG(gaji) FROM karyawan GROUP BY divisi` |
| `JOIN` | Gabung dua tabel | `... FROM a JOIN b ON a.id = b.id` |

Fungsi agregasi yang wajib hafal: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

## 3. Jebakan umum

- `WHERE` dipakai sebelum agregasi, `HAVING` dipakai sesudah `GROUP BY`. Ketukar dua ini adalah kesalahan paling umum.
- `NULL` tidak sama dengan nol dan tidak sama dengan teks kosong. `WHERE kolom = NULL` tidak akan pernah benar, pakai `IS NULL`.
- `JOIN` tanpa kondisi `ON` yang tepat menghasilkan ledakan baris (cartesian product). Selalu cek jumlah baris hasil join.

## 4. Praktik langsung

Buka [SQL Playground](/playground). Di sana ada database contoh (data karyawan dan penjualan) yang berjalan di browser. Coba tiga query ini satu per satu, lalu ubah-ubah sendiri:

```sql
SELECT * FROM karyawan;
```

```sql
SELECT divisi, AVG(gaji) AS rata_gaji
FROM karyawan
GROUP BY divisi;
```

```sql
SELECT produk, SUM(jumlah * harga) AS omzet
FROM penjualan
GROUP BY produk
ORDER BY omzet DESC;
```

## 5. Latihan

Di playground, jawab dengan query:

1. Siapa karyawan dengan gaji tertinggi?
2. Berapa total omzet pada 2024-01-06?
3. Divisi mana yang rata-rata gajinya paling rendah?

---

**Selanjutnya:** [Bab 3: Statistik](/bab-3-statistik)
