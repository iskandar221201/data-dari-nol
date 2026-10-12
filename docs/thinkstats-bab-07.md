> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 7: Hubungan Antar Variabel

Sejauh ini kita baru melihat satu variabel dalam satu waktu. Di bab ini kita melihat hubungan antar variabel. Dua variabel dikatakan berhubungan kalau mengetahui yang satu memberimu informasi tentang yang lain. Contohnya tinggi dan berat badan: orang yang lebih tinggi cenderung lebih berat. Tentu ini bukan hubungan yang sempurna — ada orang pendek yang berat dan orang tinggi yang ringan. Tapi kalau kamu menebak berat badan seseorang, tebakanmu akan lebih akurat kalau kamu tahu tinggi badannya daripada kalau tidak tahu sama sekali.

Kode untuk bab ini ada di `scatter.py`. Untuk info tentang mengunduh dan menjalankan kodenya, lihat Sub-bab 0.2.

## 7.1 Diagram Sebar

Cara paling sederhana untuk memeriksa hubungan dua variabel adalah *scatter plot* (diagram sebar), tapi membuat diagram sebar yang bagus tidak selalu mudah. Sebagai contoh, saya akan memplot berat versus tinggi para responden BRFSS (lihat Sub-bab 5.4). Berikut kode yang membaca file data dan mengekstrak tinggi dan berat:

```python
df = brfss.ReadBrfss(nrows=None)
sample = thinkstats2.SampleRows(df, 5000)
heights, weights = sample.htm3, sample.wtkg2
```

*[Grafik 7.1: scatter plot berat versus tinggi para responden BRFSS, tanpa jittering (kiri) dan dengan jittering (kanan)]*

`SampleRows` memilih subset acak dari data:

```python
def SampleRows(df, nrows, replace=False):
    indices = np.random.choice(df.index, nrows, replace=replace)
    sample = df.loc[indices]
    return sample
```

`df` adalah DataFrame-nya, `nrows` adalah jumlah baris yang dipilih, dan `replace` adalah boolean yang menunjukkan apakah sampling dilakukan dengan pengembalian; dengan kata lain, apakah baris yang sama boleh dipilih lebih dari sekali.

`thinkplot` menyediakan `Scatter`, yang membuat diagram sebar:

```python
thinkplot.Scatter(heights, weights)
thinkplot.Show(xlabel='Height (cm)',
               ylabel='Weight (kg)',
               axis=[140, 210, 20, 200])
```

Hasilnya, di Grafik 7.1 (kiri), menunjukkan bentuk hubungannya. Seperti dugaan kita, orang yang lebih tinggi cenderung lebih berat.

Tapi ini bukan representasi data yang terbaik, karena datanya menumpuk dalam kolom-kolom. Masalahnya, tinggi badannya dibulatkan ke inci terdekat, dikonversi ke sentimeter, lalu dibulatkan lagi. Ada informasi yang hilang dalam proses konversi.

Kita tidak bisa mengembalikan informasi itu, tapi kita bisa meminimalkan efeknya pada diagram sebar dengan *jittering* data, yaitu menambahkan noise acak untuk membalikkan efek pembulatan. Karena pengukuran ini dibulatkan ke inci terdekat, nilainya bisa meleset sampai 0,5 inci atau 1,3 cm. Begitu juga beratnya bisa meleset 0,5 kg.

```python
heights = thinkstats2.Jitter(heights, 1.3)
weights = thinkstats2.Jitter(weights, 0.5)
```

Berikut implementasi `Jitter`:

```python
def Jitter(values, jitter=0.5):
    n = len(values)
    return np.random.uniform(-jitter, +jitter, n) + values
```

Nilai-nilainya bisa berupa sequence apa pun; hasilnya adalah array NumPy.

Grafik 7.1 (kanan) menunjukkan hasilnya. Jittering mengurangi efek visual pembulatan dan membuat bentuk hubungannya lebih jelas. Tapi secara umum kamu sebaiknya hanya menjitter data untuk keperluan visualisasi, dan hindari memakai data yang sudah dijitter untuk analisis.

Meski sudah dijitter, ini belum cara terbaik merepresentasikan data. Titik-titiknya banyak yang bertumpuk, yang menyembunyikan data di bagian yang padat dan memberi penekanan berlebihan pada outlier. Efek ini disebut *saturation* (saturasi).

Kita bisa mengatasi masalah ini dengan parameter `alpha`, yang membuat titik-titiknya agak transparan:

```python
thinkplot.Scatter(heights, weights, alpha=0.2)
```

Grafik 7.2 (kiri) menunjukkan hasilnya. Titik-titik data yang bertumpuk terlihat lebih gelap, jadi kegelapan sebanding dengan kepadatan. Di versi plot ini kita bisa melihat dua detail yang sebelumnya tidak kelihatan: klaster vertikal di beberapa tinggi badan dan garis horizontal di dekat 90 kg atau 200 pon. Karena data ini berasal dari self-report dalam satuan pon, penjelasan yang paling masuk akal adalah beberapa responden melaporkan nilai yang dibulatkan.

*[Grafik 7.2: scatter plot dengan jittering dan transparansi (kiri), plot hexbin (kanan)]*

Memakai transparansi bekerja baik untuk dataset berukuran sedang, tapi gambar ini hanya menampilkan 5000 record pertama dari BRFSS, dari total 414.509. Untuk menangani dataset yang lebih besar, opsi lainnya adalah *hexbin plot* (plot hexbin), yang membagi grafik menjadi bin-bin heksagonal dan mewarnai tiap bin sesuai jumlah titik data yang jatuh di dalamnya. `thinkplot` menyediakan `HexBin`:

```python
thinkplot.HexBin(heights, weights)
```

Grafik 7.2 (kanan) menunjukkan hasilnya. Kelebihan hexbin adalah ia menampilkan bentuk hubungan dengan baik, dan efisien untuk dataset besar, baik dari segi waktu maupun ukuran file yang dihasilkan. Kelemahannya, ia membuat outlier tidak terlihat.

Poin dari contoh ini: tidak gampang membuat diagram sebar yang menunjukkan hubungan dengan jelas tanpa memunculkan artefak yang menyesatkan.

::: tip 💡 Konteks Indonesia
BRFSS itu survei kesehatan nasional Amerika — padanannya di Indonesia adalah **Riskesdas** (Riset Kesehatan Dasar) dari Kemenkes. Data tinggi-berat di Riskesdas juga sebagian besar *self-report*, jadi fenomena "angka bulat" (banyak yang mengaku 170 cm atau 60 kg pas) muncul juga di data kita. Bedanya, kita tidak perlu repot konversi inci → cm: orang Indonesia biasa melaporkan tinggi dalam sentimeter, tapi tetap sering dibulatkan ke angka cantik.
:::

## 7.2 Mendeskripsikan Hubungan

Diagram sebar memberi gambaran umum tentang hubungan antar variabel, tapi ada visualisasi lain yang memberi wawasan lebih dalam tentang sifat hubungan tersebut. Salah satu opsinya: bin-kan satu variabel lalu plot persentil variabel lainnya.

NumPy dan pandas menyediakan fungsi untuk binning data:

```python
df = df.dropna(subset=['htm3', 'wtkg2'])
bins = np.arange(135, 210, 5)
indices = np.digitize(df.htm3, bins)
groups = df.groupby(indices)
```

`dropna` membuang baris yang mengandung `nan` di kolom-kolom yang disebutkan. `arange` membuat array NumPy berisi bin dari 135 sampai (tapi tidak termasuk) 210, dengan kenaikan 5.

`digitize` menghitung indeks bin yang memuat tiap nilai di `df.htm3`. Hasilnya adalah array NumPy berisi indeks integer. Nilai yang jatuh di bawah bin terendah dipetakan ke indeks 0. Nilai yang di atas bin tertinggi dipetakan ke `len(bins)`.

`groupby` adalah method DataFrame yang mengembalikan objek GroupBy; dipakai dalam for loop, `groups` mengiterasi nama-nama grup dan DataFrame yang mewakilinya. Jadi, misalnya, kita bisa mencetak jumlah baris tiap grup seperti ini:

```python
for i, group in groups:
    print(i, len(group))
```

Sekarang untuk tiap grup kita bisa menghitung rata-rata tinggi dan CDF berat:

```python
heights = [group.htm3.mean() for i, group in groups]
cdfs = [thinkstats2.Cdf(group.wtkg2) for i, group in groups]
```

Terakhir, kita bisa memplot persentil berat versus tinggi:

```python
for percent in [75, 50, 25]:
    weights = [cdf.Percentile(percent) for cdf in cdfs]
    label = '%dth' % percent
    thinkplot.Plot(heights, weights, label=label)
```

*[Grafik 7.3: persentil berat untuk rentang bin tinggi]*

Grafik 7.3 menunjukkan hasilnya. Antara 140 dan 200 cm, hubungan kedua variabel ini kira-kira linear. Rentang ini mencakup lebih dari 99% data, jadi kita tidak perlu terlalu khawatir soal nilai ekstremnya.

## 7.3 Korelasi

*Correlation* (korelasi) adalah statistik yang dimaksudkan untuk mengukur kekuatan hubungan antara dua variabel.

Tantangan dalam mengukur korelasi adalah variabel yang ingin kita bandingkan sering kali tidak dinyatakan dalam satuan yang sama. Dan kalaupun satuannya sama, distribusinya berbeda.

Ada dua solusi umum untuk masalah ini:

1. Transformasi tiap nilai menjadi *standard score* (skor standar), yaitu jumlah deviasi standar dari rata-rata. Transformasi ini menghasilkan "*Pearson product-moment correlation coefficient*" (koefisien korelasi product-moment Pearson).
2. Transformasi tiap nilai menjadi *rank* (peringkat)-nya, yaitu indeksnya dalam daftar nilai yang sudah diurutkan. Transformasi ini menghasilkan "*Spearman rank correlation coefficient*" (koefisien korelasi peringkat Spearman).

Kalau X adalah deret berisi n nilai, xi, kita bisa mengubahnya menjadi skor standar dengan mengurangkan rata-rata dan membaginya dengan deviasi standar: zi = (xi − μ) / σ.

Pembilangnya adalah deviasi: jarak dari rata-rata. Membaginya dengan σ menstandarkan deviasi, sehingga nilai-nilai Z tidak berdimensi (tidak bersatuan) dan distribusinya punya rata-rata 0 dan varians 1.

Kalau X terdistribusi normal, Z juga normal. Tapi kalau X miring atau punya outlier, Z juga begitu; dalam kasus itu, lebih robust memakai peringkat persentil. Kalau kita menghitung variabel baru, R, sehingga ri adalah peringkat xi, distribusi R seragam dari 1 sampai n, terlepas dari distribusi X.

## 7.4 Kovarians

*Covariance* (kovarians) adalah ukuran kecenderungan dua variabel untuk bervariasi bersama-sama.

Kalau kita punya dua deret, X dan Y, deviasinya dari rata-rata adalah dxi = xi − x̄ dan dyi = yi − ȳ, di mana x̄ adalah rata-rata sampel X dan ȳ adalah rata-rata sampel Y. Kalau X dan Y bervariasi bersama, deviasinya cenderung punya tanda yang sama.

Kalau kita kalikan, hasil kalinya positif ketika deviasinya bertanda sama dan negatif ketika bertanda berlawanan. Jadi menjumlahkan hasil kali itu memberi ukuran kecenderungan untuk bervariasi bersama.

Kovarians adalah rata-rata dari hasil kali tersebut:

Cov(X, Y) = (1/n) Σ dxi · dyi

di mana n adalah panjang kedua deret (keduanya harus sama panjang).

Kalau kamu pernah belajar aljabar linear, kamu mungkin mengenali bahwa Cov adalah dot product dari deviasi-deviasinya, dibagi panjangnya. Jadi kovarians dimaksimalkan kalau kedua vektor identik, bernilai 0 kalau keduanya ortogonal, dan negatif kalau arahnya berlawanan. `thinkstats2` memakai `np.dot` untuk mengimplementasikan `Cov` secara efisien:

```python
def Cov(xs, ys, meanx=None, meany=None):
    xs = np.asarray(xs)
    ys = np.asarray(ys)
    if meanx is None:
        meanx = np.mean(xs)
    if meany is None:
        meany = np.mean(ys)
    cov = np.dot(xs-meanx, ys-meany) / len(xs)
    return cov
```

Secara default `Cov` menghitung deviasi dari rata-rata sampel, atau kamu bisa memberikan rata-rata yang sudah diketahui. Kalau `xs` dan `ys` adalah sequence Python, `np.asarray` mengubahnya jadi array NumPy. Kalau sudah berupa array NumPy, `np.asarray` tidak melakukan apa-apa.

Implementasi kovarians ini dibuat sederhana untuk keperluan penjelasan. NumPy dan pandas juga menyediakan implementasi kovarians, tapi keduanya menerapkan koreksi untuk sampel kecil yang belum kita bahas, dan `np.cov` mengembalikan matriks kovarians, yang lebih dari yang kita butuhkan untuk sekarang.

## 7.5 Korelasi Pearson

Kovarians berguna di beberapa komputasi, tapi jarang dilaporkan sebagai statistik ringkasan karena sulit diinterpretasikan. Di antara masalah-masalah lainnya, satuannya adalah hasil kali satuan X dan Y. Contohnya, kovarians berat dan tinggi di dataset BRFSS adalah 113 kilogram-sentimeter, entah apa artinya.

Salah satu solusi untuk masalah ini adalah membagi deviasi dengan deviasi standar, yang menghasilkan skor standar, lalu menghitung hasil kali skor standar:

pi = ((xi − x̄) (yi − ȳ)) / (SX · SY)

di mana SX dan SY adalah deviasi standar X dan Y. Rata-rata dari hasil kali ini adalah:

ρ = (1/n) Σ pi

Atau kita bisa menulis ulang ρ dengan mengeluarkan SX dan SY:

ρ = Cov(X, Y) / (SX · SY)

Nilai ini disebut *Pearson's correlation* (korelasi Pearson) sesuai nama Karl Pearson, seorang statistikawan awal yang berpengaruh. Mudah dihitung dan mudah diinterpretasikan. Karena skor standar tidak berdimensi, ρ juga tidak berdimensi.

Berikut implementasinya di `thinkstats2`:

```python
def Corr(xs, ys):
    xs = np.asarray(xs)
    ys = np.asarray(ys)
    meanx, varx = MeanVar(xs)
    meany, vary = MeanVar(ys)
    corr = Cov(xs, ys, meanx, meany) / math.sqrt(varx * vary)
    return corr
```

`MeanVar` menghitung rata-rata dan varians sedikit lebih efisien daripada memanggil `np.mean` dan `np.var` secara terpisah.

Korelasi Pearson selalu antara -1 dan +1 (termasuk keduanya). Kalau ρ positif, kita bilang korelasinya positif, artinya ketika satu variabel tinggi, variabel lainnya cenderung tinggi. Kalau ρ negatif, korelasinya negatif, jadi ketika satu variabel tinggi, yang lain rendah.

Besarnya ρ menunjukkan kekuatan korelasi. Kalau ρ adalah 1 atau -1, variabel-variabelnya berkorelasi sempurna, artinya kalau kamu tahu yang satu, kamu bisa membuat prediksi sempurna tentang yang lain.

Kebanyakan korelasi di dunia nyata tidak sempurna, tapi tetap berguna. Korelasi tinggi dan berat badan adalah 0,51, yang termasuk korelasi kuat dibandingkan variabel-variabel sejenis yang berkaitan dengan manusia.

*[Grafik 7.4: contoh dataset dengan berbagai rentang korelasi]*

::: tip 💡 Konteks Indonesia
Mau merasakan angka korelasi di dunia nyata? Ambil data **harga BBM vs harga sembako** di kotamu selama 12 bulan terakhir. Biasanya korelasinya positif dan lumayan kuat (mendekati 0,7–0,8): BBM naik, ongkos distribusi naik, harga sembako ikut naik. Tapi ingat Sub-bab 7.8 — korelasi kuat bukan berarti BBM *menyebabkan* kenaikan harga sembako secara langsung; ada rantai faktor di antaranya (distribusi, cuaca, musim panen).
:::

## 7.6 Hubungan Nonlinear

Kalau korelasi Pearson mendekati 0, godaannya adalah menyimpulkan tidak ada hubungan antar variabel, tapi kesimpulan itu tidak valid. Korelasi Pearson hanya mengukur hubungan linear. Kalau hubungannya nonlinear, ρ meremehkan kekuatannya.

Grafik 7.4 berasal dari http://wikipedia.org/wiki/Correlation_and_dependence. Ia menunjukkan diagram sebar dan koefisien korelasi untuk beberapa dataset yang dibuat dengan hati-hati.

Baris atas menunjukkan hubungan linear dengan rentang korelasi; kamu bisa memakai baris ini untuk merasakan seperti apa rupa berbagai nilai ρ. Baris kedua menunjukkan korelasi sempurna dengan berbagai kemiringan (slope), yang menunjukkan bahwa korelasi tidak ada hubungannya dengan slope (kita akan membahas estimasi slope sebentar lagi). Baris ketiga menunjukkan variabel-variabel yang jelas berhubungan, tapi karena hubungannya nonlinear, koefisien korelasinya 0.

Moral dari cerita ini: selalu lihat diagram sebar datamu sebelum asal menghitung koefisien korelasi.

## 7.7 Korelasi Peringkat Spearman

Korelasi Pearson bekerja baik kalau hubungan antar variabel linear dan variabel-variabelnya kira-kira normal. Tapi ia tidak robust di hadapan outlier.

*Spearman's rank correlation* (korelasi peringkat Spearman) adalah alternatif yang meredam efek outlier dan distribusi yang miring. Untuk menghitung korelasi Spearman, kita harus menghitung peringkat tiap nilai, yaitu indeksnya dalam sampel yang sudah diurutkan. Contohnya, dalam sampel [1, 2, 5, 7], peringkat nilai 5 adalah 3, karena ia muncul ketiga dalam daftar yang sudah diurutkan. Lalu kita hitung korelasi Pearson untuk peringkat-peringkatnya.

`thinkstats2` menyediakan fungsi yang menghitung korelasi peringkat Spearman:

```python
def SpearmanCorr(xs, ys):
    xranks = pandas.Series(xs).rank()
    yranks = pandas.Series(ys).rank()
    return Corr(xranks, yranks)
```

Saya mengubah argumennya jadi objek pandas Series supaya bisa memakai `rank`, yang menghitung peringkat tiap nilai dan mengembalikan Series. Lalu saya memakai `Corr` untuk menghitung korelasi peringkatnya.

Saya juga bisa memakai `Series.corr` langsung dan menentukan method Spearman:

```python
def SpearmanCorr(xs, ys):
    xs = pandas.Series(xs)
    ys = pandas.Series(ys)
    return xs.corr(ys, method='spearman')
```

Korelasi peringkat Spearman untuk data BRFSS adalah 0,54, sedikit lebih tinggi dari korelasi Pearson, 0,51. Ada beberapa kemungkinan penyebab perbedaannya, di antaranya:

- Kalau hubungannya nonlinear, korelasi Pearson cenderung meremehkan kekuatan hubungan, dan
- Korelasi Pearson bisa terpengaruh (ke arah mana pun) kalau salah satu distribusinya miring atau mengandung outlier. Korelasi peringkat Spearman lebih robust.

Dalam contoh BRFSS, kita tahu distribusi berat kira-kira lognormal; di bawah transformasi log ia mendekati distribusi normal, jadi tidak ada kemiringan. Maka cara lain untuk menghilangkan efek kemiringan adalah menghitung korelasi Pearson dengan log-berat dan tinggi:

```python
thinkstats2.Corr(df.htm3, np.log(df.wtkg2))
```

Hasilnya 0,53, dekat dengan korelasi peringkat, 0,54. Jadi ini menunjukkan bahwa kemiringan distribusi berat menjelaskan sebagian besar perbedaan antara korelasi Pearson dan Spearman.

## 7.8 Korelasi dan Kausalitas

Kalau variabel A dan B berkorelasi, ada tiga kemungkinan penjelasan: A menyebabkan B, atau B menyebabkan A, atau ada faktor lain yang menyebabkan A dan B sekaligus. Penjelasan-penjelasan ini disebut "hubungan kausal".

Korelasi saja tidak membedakan penjelasan-penjelasan ini, jadi ia tidak memberitahumu mana yang benar. Aturan ini sering diringkas dengan frasa "*Correlation does not imply causation*" (korelasi tidak berarti kausalitas), yang saking padatnya sampai punya halaman Wikipedia sendiri: http://wikipedia.org/wiki/Correlation_does_not_imply_causation.

Jadi apa yang bisa kamu lakukan untuk memberikan bukti kausalitas?

1. **Pakai waktu.** Kalau A terjadi sebelum B, maka A bisa menyebabkan B tapi tidak sebaliknya (setidaknya menurut pemahaman umum kita tentang kausalitas). Urutan kejadian bisa membantu kita menyimpulkan arah kausalitas, tapi tidak menutup kemungkinan ada hal lain yang menyebabkan A dan B sekaligus.
2. **Pakai keacakan.** Kalau kamu membagi sampel besar menjadi dua kelompok secara acak dan menghitung rata-rata hampir semua variabel, kamu berharap perbedaannya kecil. Kalau kelompok-kelompoknya hampir identik di semua variabel kecuali satu, kamu bisa menyingkirkan hubungan semu.

   Ini bekerja bahkan kalau kamu tidak tahu variabel-variabel apa yang relevan, tapi bekerja lebih baik lagi kalau kamu tahu, karena kamu bisa memeriksa bahwa kelompok-kelompoknya identik.

Ide-ide ini adalah motivasi di balik *randomized controlled trial* (uji terkendali acak), di mana subjek ditugaskan secara acak ke dua (atau lebih) kelompok: *treatment group* (kelompok perlakuan) yang menerima semacam intervensi, seperti obat baru, dan *control group* (kelompok kontrol) yang tidak menerima intervensi, atau menerima perlakuan lain yang efeknya sudah diketahui.

Uji terkendali acak adalah cara paling andal untuk menunjukkan hubungan kausal, dan fondasi dari kedokteran berbasis sains (lihat http://wikipedia.org/wiki/Randomized_controlled_trial).

Sayangnya, uji terkendali hanya mungkin dilakukan di ilmu laboratorium, kedokteran, dan sedikit disiplin lain. Di ilmu sosial, eksperimen terkendali jarang terjadi, biasanya karena mustahil atau tidak etis.

Alternatifnya adalah mencari *natural experiment* (eksperimen alami), di mana "perlakuan" yang berbeda diterapkan pada kelompok-kelompok yang sebaliknya mirip. Satu bahaya eksperimen alami adalah kelompok-kelompoknya bisa berbeda dengan cara yang tidak kentara. Kamu bisa membaca lebih lanjut tentang topik ini di http://wikipedia.org/wiki/Natural_experiment.

Dalam beberapa kasus, hubungan kausal bisa disimpulkan memakai analisis regresi, yang merupakan topik Bab 11.

::: tip 💡 Konteks Indonesia
Contoh klasik "korelasi bukan kausalitas" versi lokal: **jumlah warung kopi di sebuah kota berkorelasi positif dengan jumlah kecelakaan motor**. Bukan karena kopi bikin orang kecelakaan — keduanya disebabkan faktor ketiga: populasi kota yang besar. Atau yang lebih dekat ke keseharian analis: penjualan es kelapa dan penjualan payung sama-sama naik saat musim hujan, tapi bukan berarti es kelapa *menyebabkan* orang beli payung. Sebelum menyimpulkan "A menyebabkan B", selalu tanya: faktor ketiga apa yang mungkin menyebabkan keduanya?
:::

## 7.9 Latihan

Solusi latihan ini ada di `chap07soln.py`.

**Latihan 7.1** Menggunakan data NSFG, buat diagram sebar berat lahir versus usia ibu. Plot persentil berat lahir versus usia ibu. Hitung korelasi Pearson dan Spearman. Bagaimana kamu mendeskripsikan hubungan kedua variabel ini?

## 7.10 Glosarium

- *scatter plot* (diagram sebar): Visualisasi hubungan dua variabel, menampilkan satu titik untuk tiap baris data.
- *jitter*: Noise acak yang ditambahkan ke data untuk keperluan visualisasi.
- *saturation* (saturasi): Kehilangan informasi ketika banyak titik diplot bertumpuk satu sama lain.
- *correlation* (korelasi): Statistik yang mengukur kekuatan hubungan antara dua variabel.
- *standardize* (standarisasi): Mentransformasi sekumpulan nilai sehingga rata-ratanya 0 dan variansnya 1.
- *standard score* (skor standar): Nilai yang sudah distandarisasi sehingga dinyatakan dalam deviasi standar dari rata-rata.
- *covariance* (kovarians): Ukuran kecenderungan dua variabel untuk bervariasi bersama-sama.
- *rank* (peringkat): Indeks tempat sebuah elemen muncul dalam daftar yang sudah diurutkan.
- *randomized controlled trial* (uji terkendali acak): Rancangan eksperimen di mana subjek dibagi ke dalam kelompok secara acak, dan kelompok yang berbeda diberi perlakuan yang berbeda.
- *treatment group* (kelompok perlakuan): Kelompok dalam uji terkendali yang menerima semacam intervensi.
- *control group* (kelompok kontrol): Kelompok dalam uji terkendali yang tidak menerima perlakuan, atau menerima perlakuan yang efeknya sudah diketahui.
- *natural experiment* (eksperimen alami): Rancangan eksperimen yang memanfaatkan pembagian alami subjek ke dalam kelompok dengan cara yang setidaknya kira-kira acak.

---

**Selanjutnya:** [Bab 8: Estimasi](/thinkstats-bab-08) *(segera hadir)*
