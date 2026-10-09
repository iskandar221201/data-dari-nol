<script setup>
import { withBase } from 'vitepress'
</script>

# 3.2 Kenapa Karyawan Resign

## Dokumen stakeholder

> **Dari:** Pak Hendra, Head of HR
> **Kepada:** Tim Data
> **Perihal:** Analisis turnover 6 bulan terakhir
>
> Dalam 6 bulan terakhir, 7 karyawan resign. Biaya rekrut dan training penggantinya tidak kecil. Saya butuh:
> 1. Divisi mana yang turnover-nya paling parah?
> 2. Ada pola masa kerja dari yang resign? (misalnya kebanyakan karyawan baru)
> 3. Saran fokus perbaikan.
>
> Data karyawan terlampir. Mohon dibantu.
> — Hendra

## Datanya

Tabel `karyawan`: 18 orang. Kolom: id, nama, divisi, tgl_masuk, status (aktif/resign), tgl_keluar (NULL kalau masih aktif).

## Pre-test

Coba jawab 3 pertanyaan Pak Hendra dulu sebelum lanjut.

<iframe :src="withBase('/sql-playground.html?ds=kasus-hr')" class="playground-frame" title="SQL Playground: Kasus Turnover Karyawan"></iframe>

## Bedah tuntas

### Langkah 1: Turnover per divisi

Turnover rate = yang resign dibagi total karyawan divisi itu:

```sql
SELECT divisi,
  COUNT(*) AS total,
  SUM(CASE WHEN status = 'resign' THEN 1 ELSE 0 END) AS resign,
  ROUND(SUM(CASE WHEN status = 'resign' THEN 1.0 ELSE 0 END) / COUNT(*) * 100, 1) AS turnover_persen
FROM karyawan
GROUP BY divisi;
```

Hasil: Sales 5 dari 9 (**55,6%**), IT 1 dari 4 (25%), Operasional 1 dari 5 (20%). Masalahnya jelas terkonsentrasi di **Sales**.

### Langkah 2: Pola masa kerja

Berapa lama yang resign bertahan? Hitung selisih tanggal masuk dan keluar dalam bulan:

```sql
SELECT nama, divisi,
  ROUND((julianday(tgl_keluar) - julianday(tgl_masuk)) / 30, 1) AS bulan_kerja
FROM karyawan
WHERE status = 'resign'
ORDER BY bulan_kerja;
```

Hasil: Dodi 3,5 bulan; Wati 4,2; Joko 4,3; Dewi 4,6; Fajar 6,5; Siti 8,5; Agus 10,3. Polanya: **hampir semua resign di bawah 1 tahun**, 4 di antaranya bahkan belum 6 bulan. Ini bukan karyawan lama yang jenuh, ini karyawan baru yang tidak betah.

### Langkah 3: Kesimpulan dan saran

Satu kalimat: "Turnover 55,6% di Sales, didominasi karyawan yang resign sebelum 6 bulan, mengarah ke masalah di proses onboarding atau ekspektasi kerja, bukan ke kompensasi karyawan lama."

Saran fokus: perbaiki 90 hari pertama karyawan Sales (mentoring, target realistis, ekspektasi yang jujur saat rekrutmen). Dan jujur soal batas data: query tidak bisa membuktikan *alasan* resignnya, itu butuh exit interview.

## Post-test

1. Berapa rata-rata masa kerja (bulan) karyawan Sales yang resign?
2. Divisi apa yang paling stabil (turnover terendah)?
3. Kalau definisi "karyawan baru" adalah masa kerja di bawah 1 tahun saat ini, berapa persen karyawan aktif yang termasuk karyawan baru? (Petunjuk: hitung dari `tgl_masuk` ke hari ini.)

<details>
<summary>Kunci jawaban</summary>

```sql
-- 1
SELECT ROUND(AVG((julianday(tgl_keluar) - julianday(tgl_masuk)) / 30), 1) AS rata_bulan
FROM karyawan WHERE status = 'resign' AND divisi = 'Sales';
-- 5,1 bulan

-- 2. Operasional (20%), lalu IT (25%), terakhir Sales (55,6%).

-- 3
SELECT ROUND(SUM(CASE WHEN (julianday('now') - julianday(tgl_masuk)) / 365 < 1 THEN 1.0 ELSE 0 END) / COUNT(*) * 100, 1) AS persen_baru
FROM karyawan WHERE status = 'aktif';
-- sekitar 27,3% (3 dari 11: Rudi, Sari, Putri)
```

</details>

---

**Selanjutnya:** [3.3 Menu Apa yang Paling Cuan](/studi-kasus-3-margin)
