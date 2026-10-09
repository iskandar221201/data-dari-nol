<script setup>
import { withBase } from 'vitepress'
</script>

# 3.1 Misteri Omzet yang Turun

## Dokumen stakeholder

> **Dari:** Bu Ratna, VP Marketing
> **Kepada:** Tim Data
> **Perihal:** Permintaan analisis adhoc — penurunan omzet Maret
>
> Tim,
>
> Omzet Maret turun sekitar 30% dibanding Februari. Direksi minta penjelasan minggu ini. Tolong cari tahu:
> 1. Apakah penurunannya benar 30%? Dari angka berapa ke berapa?
> 2. Kanal mana yang jadi penyebabnya? (marketplace / website / tiktok)
> 3. Rekomendasi langkah selanjutnya.
>
> Data pesanan Jan-Mar 2024 sudah saya lampirkan. Terima kasih.
> — Ratna

Inilah kerja analis di dunia nyata: tidak ada soal yang rapi, adanya email seperti ini. Tugasmu: ubah email jadi angka, angka jadi jawaban.

## Datanya

Tabel `pesanan`: 30 transaksi, Jan-Mar 2024, 3 kanal (marketplace, website, tiktok). Kolom: id, tanggal, kanal, produk, jumlah, harga, status.

## Pre-test

Jangan intip bedahannya dulu. Coba jawab 3 pertanyaan Bu Ratna pakai playground di bawah.

<iframe :src="withBase('/sql-playground.html?ds=kasus-omzet')" class="playground-frame" title="SQL Playground: Kasus Omzet Turun"></iframe>

Sudah coba? Sekarang bandingkan dengan bedahannya.

## Bedah tuntas

### Langkah 1: Benarkah turun 30%?

Hitung omzet per bulan dulu. Karena tanggal format `YYYY-MM-DD`, `strftime('%Y-%m', tanggal)` memotong jadi `2024-01`:

```sql
SELECT strftime('%Y-%m', tanggal) AS bulan,
  SUM(jumlah * harga) AS omzet
FROM pesanan
WHERE status = 'selesai'
GROUP BY bulan
ORDER BY bulan;
```

Hasil: Jan 3.700.000, Feb 4.250.000, Mar 2.950.000. Penurunan Feb ke Mar: (4.250.000 − 2.950.000) / 4.250.000 = **30,6%**. Klaim Bu Ratna benar.

### Langkah 2: Kanal mana penyebabnya?

Jangan berhenti di total. Pecah per kanal:

```sql
SELECT strftime('%Y-%m', tanggal) AS bulan, kanal,
  SUM(jumlah * harga) AS omzet
FROM pesanan
WHERE status = 'selesai'
GROUP BY bulan, kanal
ORDER BY bulan, omzet DESC;
```

Hasilnya bercerita:

| Bulan | marketplace | website | tiktok |
|---|---|---|---|
| Jan | 1.150.000 | 875.000 | 1.675.000 |
| Feb | 975.000 | 1.250.000 | 2.025.000 |
| Mar | 1.300.000 | 1.300.000 | 350.000 |

Marketplace dan website **naik** di Maret. Yang anjlok cuma satu: **tiktok, dari 2.025.000 ke 350.000 (turun 83%)**. Inilah jawaban pertanyaan 2.

### Langkah 3: Kesimpulan dan rekomendasi

Satu kalimat dulu (ingat Bab 0): "Omzet Maret turun 30,6% bukan karena semua kanal lesu, tapi karena kanal tiktok anjlok 83% sementara dua kanal lain justru naik."

Rekomendasi yang jujur: data ini tidak bisa menjelaskan *kenapa* tiktok anjlok (akun kena suspend? budget iklan dipotong? live dihentikan?). Itu pertanyaan lanjutan buat tim marketing, bukan buat query. Analis yang bagus tahu batas datanya.

## Post-test

1. Berapa kontribusi tiktok terhadap total omzet Februari (dalam persen)?
2. Kalau tiktok di Maret performanya sama seperti Februari, berapa estimasi total omzet Maret?
3. Kanal mana yang pertumbuhannya paling bagus dari Jan ke Mar?

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT ROUND(SUM(CASE WHEN kanal = 'tiktok' THEN jumlah * harga ELSE 0 END) * 100.0 / SUM(jumlah * harga), 1) AS persen_tiktok
FROM pesanan WHERE status = 'selesai' AND strftime('%Y-%m', tanggal) = '2024-02';
-- 47,6%

-- 2
-- Total aktual Mar 2.950.000, tiktok aktual 350.000.
-- Estimasi: 2.950.000 - 350.000 + 2.025.000 = 4.625.000

-- 3
SELECT kanal,
  SUM(CASE WHEN strftime('%Y-%m', tanggal) = '2024-03' THEN jumlah * harga ELSE 0 END) -
  SUM(CASE WHEN strftime('%Y-%m', tanggal) = '2024-01' THEN jumlah * harga ELSE 0 END) AS pertumbuhan
FROM pesanan WHERE status = 'selesai'
GROUP BY kanal ORDER BY pertumbuhan DESC;
-- website (+425.000), marketplace (+150.000), tiktok (-1.325.000)
```

</details>

---

**Selanjutnya:** [3.2 Kenapa Karyawan Resign](/studi-kasus-2-turnover)
