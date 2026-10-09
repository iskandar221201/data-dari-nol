<script setup>
import { withBase } from 'vitepress'
</script>

# 3.4 Kurir Mana yang Paling Sering Telat

## Dokumen stakeholder

> **Dari:** Bu Sinta, Ops Manager
> **Kepada:** Tim Data
> **Perihal:** Komplain keterlambatan naik
>
> Komplain keterlambatan pengiriman naik 2x lipat bulan ini. Kita pakai 3 kurir: Kilat, Pasti, Nusantara. Saya butuh:
> 1. Kurir mana yang tingkat keterlambatannya paling tinggi?
> 2. Rata-rata telatnya berapa hari per kurir?
> 3. Rekomendasi: kurir mana yang perlu ditegur / dievaluasi kerjasamanya?
>
> Data pengiriman terlampir. Catatan: yang tanggal terimanya masih kosong berarti paketnya belum sampai.
> — Sinta

## Datanya

Tabel `pengiriman`: 24 paket, 3 kurir. Kolom: id, tgl_kirim, tgl_janji, tgl_terima (NULL = belum sampai), kurir, kota.

## Pre-test

Coba jawab dulu. Perhatikan: paket yang belum sampai (`tgl_terima` NULL) tidak bisa dinilai telat atau tidak, jadi keluarkan dari perhitungan tingkat keterlambatan.

<iframe :src="withBase('/sql-playground.html?ds=kasus-logistik')" class="playground-frame" title="SQL Playground: Kasus Kurir Telat"></iframe>

## Bedah tuntas

### Langkah 1: Tandai yang telat

Telat = tanggal terima lewat dari tanggal janji. Selisih hari pakai `julianday`:

```sql
SELECT id, kurir, tgl_janji, tgl_terima,
  CAST(julianday(tgl_terima) - julianday(tgl_janji) AS INTEGER) AS hari_telat,
  CASE WHEN tgl_terima > tgl_janji THEN 'Telat' ELSE 'Tepat waktu' END AS status
FROM pengiriman
WHERE tgl_terima IS NOT NULL;
```

### Langkah 2: Tingkat keterlambatan per kurir

```sql
SELECT kurir,
  COUNT(*) AS paket_terkirim,
  SUM(CASE WHEN tgl_terima > tgl_janji THEN 1 ELSE 0 END) AS telat,
  ROUND(SUM(CASE WHEN tgl_terima > tgl_janji THEN 1.0 ELSE 0 END) / COUNT(*) * 100, 1) AS persen_telat
FROM pengiriman
WHERE tgl_terima IS NOT NULL
GROUP BY kurir
ORDER BY persen_telat DESC;
```

Hasil: Kilat 5 dari 8 (**62,5%**), Nusantara 3 dari 6 (50%), Pasti 1 dari 7 (14,3%).

### Langkah 3: Rata-rata keterlambatan

```sql
SELECT kurir,
  ROUND(AVG(julianday(tgl_terima) - julianday(tgl_janji)), 1) AS rata_telat_hari
FROM pengiriman
WHERE tgl_terima > tgl_janji
GROUP BY kurir;
```

Hasil: Kilat 2,8 hari; Nusantara 2,3 hari; Pasti 2,0 hari.

### Langkah 4: Kesimpulan dan rekomendasi

Satu kalimat: "Kilat paling bermasalah (62,5% paket telat, rata-rata 2,8 hari), Nusantara perlu dipantau (50%), Pasti paling bisa diandalkan (14,3%)."

Rekomendasi: tegur Kilat dengan data ini, alihkan paket prioritas ke Pasti sementara. Catatan jujur: 3 paket belum sampai (NULL) tidak masuk hitungan, kalau ternyata semuanya telat, angkanya bisa lebih buruk. Dan data ini tidak menjelaskan *kenapa* telat (macet? overload?).

## Post-test

1. Ada berapa paket yang belum sampai? Dari kurir mana saja?
2. Kota mana yang paling sering menerima paket telat? (Petunjuk: `GROUP BY kota`.)
3. Kalau paket yang belum sampai dianggap telat (asumsi pesimis), berapa persen_telat Kilat yang baru?

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT kurir, COUNT(*) FROM pengiriman WHERE tgl_terima IS NULL GROUP BY kurir;
-- 3 paket: Kilat, Pasti, Nusantara masing-masing 1.

-- 2
SELECT kota, SUM(CASE WHEN tgl_terima > tgl_janji THEN 1 ELSE 0 END) AS telat
FROM pengiriman WHERE tgl_terima IS NOT NULL
GROUP BY kota ORDER BY telat DESC;
-- Indramayu (4), Kuningan (3), sisanya 1-2.

-- 3
SELECT ROUND(SUM(CASE WHEN tgl_terima IS NULL OR tgl_terima > tgl_janji THEN 1.0 ELSE 0 END) / COUNT(*) * 100, 1)
FROM pengiriman WHERE kurir = 'Kilat';
-- 66,7% (6 dari 9)
```

</details>

---

**Selanjutnya:** [Bab 4: Python](/bab-4-python)
