> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 4: Fungsi Distribusi Kumulatif

Kode untuk bab ini ada di `cumulative.py`. Untuk informasi mengunduh dan menjalankan kode, lihat Bagian 0.2.

## 4.1 Keterbatasan PMF

PMF cocok dipakai kalau jumlah nilainya sedikit. Tapi begitu jumlah nilainya bertambah, probabilitas yang menempel di tiap nilai jadi makin kecil dan efek *noise* acak makin terasa.

Contohnya, kita mungkin tertarik dengan distribusi berat lahir bayi. Di data NSFG, variabel `totalwgt_lb` mencatat berat lahir dalam satuan pon (pound).

*[Grafik 4.1: PMF berat lahir untuk bayi pertama vs bayi-bayi berikutnya]*

Secara keseluruhan, distribusi ini menyerupai bentuk lonceng dari distribusi normal, dengan banyak nilai di dekat rata-rata dan sedikit nilai yang jauh lebih tinggi atau lebih rendah.

Tapi sebagian gambar ini susah dibaca. Ada banyak puncak dan lembah, dan terlihat beberapa perbedaan antara kedua distribusi itu. Sulit menentukan fitur mana yang bermakna. Pola keseluruhannya juga sulit dilihat; misalnya, menurut kamu distribusi mana yang rata-ratanya lebih tinggi?

Masalah ini bisa dikurangi dengan *binning* — membagi rentang nilai ke interval-interval yang tidak tumpang tindih lalu menghitung jumlah nilai di tiap bin. *Binning* memang berguna, tapi memilih ukuran bin yang pas itu tricky. Kalau bin-nya cukup besar untuk menghaluskan *noise*, bisa-bisa informasi yang berguna ikut terhaluskan.

Alternatif yang menghindari masalah ini adalah *cumulative distribution function* (CDF, fungsi distribusi kumulatif), yang jadi topik bab ini. Tapi sebelum menjelaskan CDF, saya harus menjelaskan persentil dulu.

## 4.2 Persentil

Kalau kamu pernah ikut ujian standar, hasilmu kemungkinan dikemas dalam bentuk skor mentah dan *percentile rank* (peringkat persentil). Dalam konteks ini, *percentile rank* adalah fraksi orang yang skornya lebih rendah dari kamu (atau sama). Jadi kalau kamu "di persentil ke-90", artinya prestasimu setara atau lebih baik dari 90% peserta ujian.

Begini cara menghitung *percentile rank* sebuah nilai, `your_score`, relatif terhadap nilai-nilai dalam rangkaian `scores`:

```python
def PercentileRank(scores, your_score):
    count = 0
    for score in scores:
        if score <= your_score:
            count += 1
    percentile_rank = 100.0 * count / len(scores)
    return percentile_rank
```

Sebagai contoh, kalau nilai-nilainya adalah 55, 66, 77, 88, dan 99, dan kamu dapat 88, maka *percentile rank*-mu adalah 100 * 4 / 5, yaitu 80.

Kalau diberi sebuah nilai, gampang mencari *percentile rank*-nya; arah sebaliknya agak lebih sulit. Kalau diberi *percentile rank* dan kamu mau mencari nilai yang bersangkutan, salah satu caranya adalah mengurutkan nilai-nilai lalu mencari yang kamu mau:

```python
def Percentile(scores, percentile_rank):
    scores.sort()
    for score in scores:
        if PercentileRank(scores, score) >= percentile_rank:
            return score
```

Hasil perhitungan ini adalah sebuah *percentile* (persentil). Contohnya, persentil ke-50 adalah nilai yang *percentile rank*-nya 50. Dalam distribusi skor ujian, persentil ke-50 adalah 77.

Implementasi `Percentile` ini tidak efisien. Pendekatan yang lebih baik adalah memakai *percentile rank* untuk menghitung indeks dari persentil yang bersangkutan:

```python
def Percentile2(scores, percentile_rank):
    scores.sort()
    index = percentile_rank * (len(scores) - 1) // 100
    return scores[index]
```

Perbedaan antara "persentil" dan "*percentile rank*" memang membingungkan, dan orang tidak selalu memakai istilahnya secara presisi. Ringkasnya: `PercentileRank` menerima sebuah nilai dan menghitung *percentile rank*-nya dalam sekumpulan nilai; `Percentile` menerima *percentile rank* dan menghitung nilai yang bersangkutan.

::: tip 💡 Konteks Indonesia
Konsep persentil ini pasti akrab kalau kamu pernah ikut **UTBK/SNBT**. Nilai UTBK jarang diumumkan sebagai skor mentah saja — yang menentukan kamu lolos PTN adalah posisimu relatif terhadap peserta lain, persis seperti *percentile rank*. Bedanya, di UTBK skornya sudah dibakukan (*standardized*), tapi idenya sama: yang penting bukan "aku dapat 700", melainkan "700 itu setara persentil ke berapa dari seluruh peserta". Makanya buku ini memulai bab CDF dari persentil — begitu kamu paham persentil, CDF terasa seperti kelanjutan yang alami.
:::

## 4.3 CDF

Sekarang kita sudah paham persentil dan *percentile rank*, kita siap membahas *cumulative distribution function* (CDF, fungsi distribusi kumulatif). CDF adalah fungsi yang memetakan dari sebuah nilai ke *percentile rank*-nya.

CDF adalah fungsi dari x, di mana x adalah nilai apapun yang bisa muncul di distribusi. Untuk mengevaluasi CDF(x) pada nilai x tertentu, kita menghitung fraksi nilai dalam distribusi yang kurang dari atau sama dengan x.

Begini wujudnya sebagai fungsi yang menerima sebuah rangkaian, `sample`, dan sebuah nilai, `x`:

```python
def EvalCdf(sample, x):
    count = 0.0
    for value in sample:
        if value <= x:
            count += 1
    prob = count / len(sample)
    return prob
```

Fungsi ini hampir identik dengan `PercentileRank`, bedanya hasilnya adalah probabilitas di rentang 0–1, bukan *percentile rank* di rentang 0–100.

Sebagai contoh, misalkan kita mengumpulkan sampel dengan nilai [1, 2, 2, 3, 5]. Berikut beberapa nilai dari CDF-nya:

- CDF(0) = 0
- CDF(1) = 0.2
- CDF(2) = 0.6
- CDF(3) = 0.8
- CDF(4) = 0.8
- CDF(5) = 1

Kita bisa mengevaluasi CDF untuk nilai x berapapun, bukan cuma nilai yang muncul di sampel. Kalau x lebih kecil dari nilai terkecil di sampel, CDF(x) adalah 0. Kalau x lebih besar dari nilai terbesar, CDF(x) adalah 1.

*[Grafik 4.2: contoh CDF dari sampel [1, 2, 2, 3, 5], berbentuk fungsi tangga]*

Gambar 4.2 adalah representasi grafis dari CDF ini. CDF dari sebuah sampel adalah *step function* (fungsi tangga).

## 4.4 Merepresentasikan CDF

`thinkstats2` menyediakan sebuah kelas bernama `Cdf` yang merepresentasikan CDF. Metode fundamental yang disediakan `Cdf`:

- `Prob(x)`: diberi nilai x, menghitung probabilitas p = CDF(x). Operator kurung siku (`cdf[x]`) setara dengan `Prob`.
- `Value(p)`: diberi probabilitas p, menghitung nilai x yang bersangkutan — yaitu invers CDF dari p.

Konstruktor `Cdf` bisa menerima argumen berupa list nilai, pandas Series, `Hist`, `Pmf`, atau `Cdf` lain. Kode berikut membuat `Cdf` untuk distribusi lama kehamilan di NSFG:

```python
live, firsts, others = first.MakeFrames()
cdf = thinkstats2.Cdf(live.prglngth, label='prglngth')
```

`thinkplot` menyediakan fungsi bernama `Cdf` yang mem-plot Cdf sebagai garis:

```python
thinkplot.Cdf(cdf)
thinkplot.Show(xlabel='weeks', ylabel='CDF')
```

*[Grafik 4.3: CDF lama kehamilan (minggu)]*

Salah satu cara membaca CDF adalah dengan mencari persentil. Contohnya, terlihat sekitar 10% kehamilan berlangsung kurang dari 36 minggu, dan sekitar 90% kurang dari 41 minggu. CDF juga memberi representasi visual dari bentuk distribusi. Nilai-nilai yang umum muncul sebagai bagian CDF yang curam atau vertikal; dalam contoh ini, modus di 39 minggu terlihat jelas. Ada sedikit nilai di bawah 30 minggu, sehingga CDF di rentang itu datar.

Butuh waktu untuk terbiasa dengan CDF, tapi setelah terbiasa, saya rasa kamu akan setuju bahwa CDF menampilkan lebih banyak informasi, lebih jelas, daripada PMF.

## 4.5 Membandingkan CDF

CDF terutama berguna untuk membandingkan distribusi. Contohnya, berikut kode yang mem-plot CDF berat lahir untuk bayi pertama dan bayi-bayi berikutnya:

```python
first_cdf = thinkstats2.Cdf(firsts.totalwgt_lb, label='first')
other_cdf = thinkstats2.Cdf(others.totalwgt_lb, label='other')

thinkplot.PrePlot(2)
thinkplot.Cdfs([first_cdf, other_cdf])
thinkplot.Show(xlabel='weight (pounds)', ylabel='CDF')
```

*[Grafik 4.4: CDF berat lahir untuk bayi pertama vs bayi-bayi berikutnya]*

Dibandingkan dengan Gambar 4.1, gambar ini membuat bentuk distribusi — dan perbedaan di antaranya — jauh lebih jelas. Kita bisa melihat bayi pertama cenderung sedikit lebih ringan di seluruh rentang distribusi, dengan selisih yang lebih besar di atas rata-rata.

## 4.6 Statistik berbasis persentil

Begitu kamu punya CDF, menghitung persentil dan *percentile rank* jadi gampang. Kelas `Cdf` menyediakan dua metode ini:

- `PercentileRank(x)`: diberi nilai x, menghitung *percentile rank*-nya, 100 · CDF(x).
- `Percentile(p)`: diberi *percentile rank* p, menghitung nilai x yang bersangkutan. Setara dengan `Value(p/100)`.

`Percentile` bisa dipakai untuk menghitung statistik ringkasan berbasis persentil. Contohnya, persentil ke-50 adalah nilai yang membagi distribusi menjadi dua bagian — disebut juga **median**. Seperti mean (rata-rata), median adalah ukuran tendensi sentral (central tendency) dari sebuah distribusi.

Sebenarnya ada beberapa definisi "median", masing-masing dengan sifat yang berbeda. Tapi `Percentile(50)` itu sederhana dan efisien untuk dihitung.

Statistik berbasis persentil lainnya adalah *interquartile range* (IQR, rentang interkuartil), yang mengukur sebaran (spread) sebuah distribusi. IQR adalah selisih antara persentil ke-75 dan persentil ke-25.

Lebih umum lagi, persentil sering dipakai untuk meringkas bentuk sebuah distribusi. Contohnya, distribusi pendapatan sering dilaporkan dalam "kuintil" (*quintiles*) — yaitu dibagi di persentil ke-20, ke-40, ke-60, dan ke-80. Distribusi lain dibagi menjadi sepuluh "desil" (*deciles*). Statistik semacam ini, yang merepresentasikan titik-titik berjarak sama di sebuah CDF, disebut **kuantil** (*quantiles*). Untuk lebih lanjut, lihat https://en.wikipedia.org/wiki/Quantile.

::: tip 💡 Konteks Indonesia
Kalau kamu pernah baca berita "10% orang terkaya menguasai X% kekayaan nasional", itu statistik kuintil/desil — titik-titik persentil yang dipakai untuk meringkas distribusi pendapatan. Di Indonesia, data semacam ini biasanya bersumber dari **Susenas** (BPS). Median pun sering lebih jujur daripada rata-rata: "upah median pekerja Indonesia" tidak ikut terdongkrak segelintir gaji raksasa, tidak seperti rata-rata. Jadi setiap kali kamu tergoda melaporkan mean saja, tanyakan dulu: median dan IQR-nya berapa?
:::

## 4.7 Bilangan acak

Misalkan kita mengambil sampel acak dari populasi kelahiran hidup dan mencari *percentile rank* dari berat lahir mereka. Lalu kita menghitung CDF dari *percentile rank* tersebut. Menurutmu distribusinya akan seperti apa?

Begini cara menghitungnya. Pertama, kita buat Cdf berat lahir:

```python
weights = live.totalwgt_lb
cdf = thinkstats2.Cdf(weights, label='totalwgt_lb')
```

Lalu kita membangkitkan sebuah sampel dan menghitung *percentile rank* tiap nilai di sampel itu:

```python
sample = np.random.choice(weights, 100, replace=True)
ranks = [cdf.PercentileRank(x) for x in sample]
```

`sample` adalah sampel acak 100 berat lahir, dipilih dengan pengembalian (*with replacement*) — artinya nilai yang sama bisa terpilih lebih dari sekali. `ranks` adalah list *percentile rank*.

Terakhir kita membuat dan mem-plot Cdf dari *percentile rank*:

```python
rank_cdf = thinkstats2.Cdf(ranks)
thinkplot.Cdf(rank_cdf)
thinkplot.Show(xlabel='percentile rank', ylabel='CDF')
```

*[Grafik 4.5: CDF dari percentile rank untuk sampel acak berat lahir]*

Gambar 4.5 menunjukkan hasilnya. CDF-nya kira-kira berupa garis lurus, yang berarti distribusinya uniform.

Hasil ini mungkin tidak terduga, tapi ia adalah konsekuensi dari cara CDF didefinisikan. Yang ditunjukkan gambar ini: 10% sampel berada di bawah persentil ke-10, 20% di bawah persentil ke-20, dan seterusnya — persis seperti yang seharusnya kita harapkan.

Jadi, apapun bentuk CDF-nya, distribusi *percentile rank* adalah uniform. Sifat ini berguna, karena ia jadi dasar algoritma sederhana dan efisien untuk membangkitkan bilangan acak dengan CDF tertentu. Caranya:

- Pilih *percentile rank* secara uniform dari rentang 0–100.
- Pakai `Cdf.Percentile` untuk menemukan nilai dalam distribusi yang bersesuaian dengan *percentile rank* yang kamu pilih.

`Cdf` menyediakan implementasi algoritma ini, bernama `Random`:

```python
# class Cdf:
    def Random(self):
        return self.Percentile(random.uniform(0, 100))
```

`Cdf` juga menyediakan `Sample`, yang menerima integer n dan mengembalikan list berisi n nilai yang dipilih acak dari Cdf.

## 4.8 Membandingkan percentile rank

*Percentile rank* berguna untuk membandingkan pengukuran antar kelompok yang berbeda. Contohnya, orang yang ikut lomba lari biasanya dikelompokkan berdasarkan umur dan jenis kelamin. Untuk membandingkan orang dari kelompok umur berbeda, kamu bisa mengubah waktu lari menjadi *percentile rank*.

Beberapa tahun lalu saya ikut James Joyce Ramble 10K di Dedham, Massachusetts; saya finis dalam 42:44, peringkat 97 dari 1633 peserta. Saya mengalahkan atau menyamai 1537 pelari dari 1633, jadi *percentile rank* saya di seluruh peserta adalah 94%.

Lebih umum, dari posisi dan ukuran peserta, kita bisa menghitung *percentile rank*:

```python
def PositionToPercentile(position, field_size):
    beat = field_size - position + 1
    percentile = 100.0 * beat / field_size
    return percentile
```

Di kelompok umur saya, yang dinotasikan M4049 untuk "laki-laki umur 40–49 tahun", saya finis ke-26 dari 256. Jadi *percentile rank* saya di kelompok umur itu adalah 90%.

Kalau 10 tahun lagi saya masih lari (semoga), saya akan masuk divisi M5059. Dengan asumsi *percentile rank* saya di divisi itu sama, seberapa lambat saya bisa mengharapkan waktu saya?

Saya bisa menjawabnya dengan mengubah *percentile rank* saya di M4049 menjadi posisi di M5059. Berikut kodenya:

```python
def PercentileToPosition(percentile, field_size):
    beat = percentile * field_size / 100.0
    position = field_size - beat + 1
    return position
```

Ada 171 orang di M5059, jadi saya harus finis di antara peringkat 17 dan 18 untuk mempertahankan *percentile rank* yang sama. Waktu finis pelari peringkat 17 di M5059 adalah 46:05, jadi itulah waktu yang harus saya kalahkan untuk mempertahankan *percentile rank* saya.

::: tip 💡 Konteks Indonesia
Trik ini kepakai banget di lomba lari lokal seperti **Jakarta Marathon** atau *fun run* 5K/10K di kotamu: membandingkan waktu mentah antar kelompok umur itu tidak adil — yang umur 25 dan 45 beda kapasitas. Dengan mengubah waktu finis jadi *percentile rank* di kelompok umur masing-masing, kamu bisa menjawab pertanyaan yang lebih bermakna: "kalau saya secepat ini di kelompok umur saya, setara seberapa cepat di kelompok umur lain?" Persentil mengubah perbandingan apel-vs-jeruk jadi apel-vs-apel.
:::

## 4.9 Latihan

Untuk latihan berikut, kamu bisa mulai dari `chap04ex.ipynb`. Solusi saya ada di `chap04soln.ipynb`.

**Latihan 4.1** Berapa berat lahirmu? Kalau tidak tahu, telepon ibumu atau orang lain yang tahu. Dengan data NSFG (semua kelahiran hidup), hitung distribusi berat lahir dan pakai untuk mencari *percentile rank*-mu. Kalau kamu anak pertama, cari *percentile rank*-mu di distribusi untuk bayi pertama. Kalau bukan, pakai distribusi untuk bayi-bayi berikutnya. Kalau kamu di persentil ke-90 atau lebih, telepon ibumu lagi dan minta maaf.

**Latihan 4.2** Angka-angka yang dihasilkan `random.random` seharusnya uniform antara 0 dan 1; artinya, setiap nilai di rentang itu punya probabilitas yang sama.
Bangkitkan 1000 angka dari `random.random` lalu plot PMF dan CDF-nya. Apakah distribusinya uniform?

## 4.10 Glosarium

- *percentile rank*: persentase nilai dalam sebuah distribusi yang kurang dari atau sama dengan sebuah nilai tertentu.
- *percentile* (persentil): nilai yang bersesuaian dengan sebuah *percentile rank* tertentu.
- *cumulative distribution function* (CDF, fungsi distribusi kumulatif): fungsi yang memetakan dari nilai ke probabilitas kumulatifnya. CDF(x) adalah fraksi sampel yang kurang dari atau sama dengan x.
- *inverse CDF* (CDF invers): fungsi yang memetakan dari sebuah probabilitas kumulatif, p, ke nilai yang bersangkutan.
- *median*: persentil ke-50, sering dipakai sebagai ukuran tendensi sentral.
- *interquartile range* (rentang interkuartil): selisih antara persentil ke-75 dan persentil ke-25, dipakai sebagai ukuran sebaran.
- *quantile* (kuantil): rangkaian nilai yang bersesuaian dengan *percentile rank* yang berjarak sama; contohnya, kuartil dari sebuah distribusi adalah persentil ke-25, ke-50, dan ke-75.
- *replacement* (pengembalian): sifat dari sebuah proses sampling. "*With replacement*" (dengan pengembalian) berarti nilai yang sama bisa terpilih lebih dari sekali; "*without replacement*" (tanpa pengembalian) berarti begitu sebuah nilai terpilih, ia dikeluarkan dari populasi.

---

**Selanjutnya:** [Bab 5: Memodelkan Distribusi](/thinkstats-bab-05) *(segera hadir)*
