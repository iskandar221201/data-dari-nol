<script setup>
import { withBase } from 'vitepress'
</script>

# 3.3 Menu Apa yang Paling Cuan

## Dokumen stakeholder

> **Dari:** Pak Darto, owner Warung Kopi Sederhana
> **Kepada:** Tim Data
> **Perihal:** Mau fokus promosi 1 menu
>
> Saya mau pasang banner besar dan fokus promosiin 1 menu bulan depan. Selama ini saya kira yang paling laris = yang paling menguntungkan. Tapi anak saya bilang belum tentu.
>
> Tolong hitungkan: dari 4 menu saya (Kopi Susu, Roti Bakar, Teh Manis, Pisang Goreng), mana yang paling cuan kalau dihitung beneran? Data penjualan + HPP (harga pokok) terlampir.
>
> — Pak Darto

## Datanya

Tabel `penjualan`: 24 baris, 6 hari, 4 produk. Kolom: id, tgl, produk, jumlah, harga, hpp. Profit per porsi = harga − hpp.

## Pre-test

Tanpa menghitung dulu, tebak: menu apa yang paling cuan? Tulis tebakanmu, baru cek pakai playground.

<iframe :src="withBase('/sql-playground.html?ds=kasus-margin')" class="playground-frame" title="SQL Playground: Kasus Menu Paling Cuan"></iframe>

## Bedah tuntas

### Langkah 1: Yang terlaris

```sql
SELECT produk, SUM(jumlah) AS terjual
FROM penjualan
GROUP BY produk
ORDER BY terjual DESC;
```

Hasil: Teh Manis 563, Roti Bakar 383, Kopi Susu 263, Pisang Goreng 203. Kalau berhenti di sini, bannernya buat Teh Manis. Tapi anak Pak Darto benar: laris belum tentu cuan.

### Langkah 2: Yang paling cuan

Profit = jumlah × (harga − hpp):

```sql
SELECT produk,
  SUM(jumlah) AS terjual,
  SUM(jumlah * harga) AS omzet,
  SUM(jumlah * (harga - hpp)) AS profit
FROM penjualan
GROUP BY produk
ORDER BY profit DESC;
```

| Produk | Terjual | Omzet | Profit |
|---|---|---|---|
| Roti Bakar | 383 | 4.596.000 | **3.064.000** |
| Teh Manis | 563 | 4.504.000 | 1.689.000 |
| Kopi Susu | 263 | 4.734.000 | 1.578.000 |
| Pisang Goreng | 203 | 2.030.000 | 812.000 |

Plot twist-nya: Teh Manis paling laris (563 porsi) tapi cuma nomor 2 profitnya. **Roti Bakar** yang paling cuan: margin Rp8.000 per porsi (67%), dua kali lipat Teh Manis.

Bahkan Kopi Susu yang omzetnya paling besar (4.734.000) cuma nomor 3 soal profit. Omzet itu vanity, profit itu sanity.

### Langkah 3: Kesimpulan dan saran

Satu kalimat: "Promosikan Roti Bakar: profitnya Rp3.064.000, hampir 2x Teh Manis yang paling laris."

Saran tambahan yang jujur: angka ini belum termasuk biaya promosi banner itu sendiri. Kalau biaya banner Rp500.000, pastikan kenaikan penjualan Roti Bakar menutupnya.

## Post-test

1. Berapa margin (persen) tiap produk? (margin = (harga − hpp) / harga)
2. Produk apa yang omzetnya paling besar tapi profitnya bukan yang terbesar?
3. Kalau HPP Teh Manis naik jadi 6.000, apakah Roti Bakar tetap juaranya?

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT DISTINCT produk,
  ROUND((harga - hpp) * 100.0 / harga, 1) AS margin_persen
FROM penjualan;
-- Roti Bakar 66,7%; Teh Manis 37,5%; Pisang Goreng 40%; Kopi Susu 33,3%

-- 2. Kopi Susu: omzet 4.734.000 (terbesar), profit 1.578.000 (nomor 3).

-- 3
SELECT produk, SUM(jumlah * (harga - CASE WHEN produk = 'Teh Manis' THEN 6000 ELSE hpp END)) AS profit
FROM penjualan GROUP BY produk ORDER BY profit DESC;
-- Ya, Roti Bakar tetap juara (3.064.000 vs Teh Manis 1.126.000).
```

</details>

---

**Selanjutnya:** [3.4 Kurir Mana yang Paling Sering Telat](/studi-kasus-4-kurir)
