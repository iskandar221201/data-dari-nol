> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 10: Kuadrat Terkecil Linear

Kode untuk bab ini ada di `linear.py`. Informasi tentang cara mengunduh dan memakai kode ini ada di Bagian 0.2.

## 10.1 Fit Kuadrat Terkecil

Koefisien korelasi mengukur kekuatan dan arah hubungan, tapi bukan kemiringannya. Ada beberapa cara mengestimasi kemiringan; yang paling umum adalah *linear least squares fit* (fit kuadrat terkecil linear). "Fit linear" adalah garis yang dimaksudkan untuk memodelkan hubungan antar variabel. Fit "kuadrat terkecil" adalah fit yang meminimalkan *mean squared error* (MSE, rata-rata kuadrat galat) antara garis dan data.

Misalkan kita punya sederet titik, `ys`, yang ingin kita nyatakan sebagai fungsi dari sederet titik lain, `xs`. Kalau ada hubungan linear antara `xs` dan `ys` dengan *intercept* (intersep) `inter` dan *slope* (kemiringan) `slope`, kita berharap tiap `y[i]` bernilai `inter + slope * x[i]`.

Tapi kecuali korelasinya sempurna, prediksi ini cuma perkiraan. Simpangan vertikal dari garis — atau *residual* (residu/sisa) — adalah

```
res = ys - (inter + slope * xs)
```

Residu bisa muncul karena faktor acak seperti galat pengukuran, atau faktor non-acak yang tidak diketahui. Contoh: kalau kita mencoba memprediksi berat badan sebagai fungsi tinggi badan, faktor yang tidak diketahui bisa mencakup pola makan, olahraga, dan tipe tubuh.

Kalau parameter `inter` dan `slope` kita salah tebak, residunya membesar — jadi masuk akal secara intuitif bahwa parameter yang kita mau adalah yang meminimalkan residu.

Kita bisa mencoba meminimalkan nilai absolut residu, atau kuadratnya, atau pangkat tiganya; tapi pilihan paling umum adalah meminimalkan jumlah kuadrat residu, `sum(res**2)`.

Kenapa? Ada tiga alasan bagus dan satu alasan yang kurang penting:

- Menguadratkan membuat residu positif dan negatif diperlakukan sama, yang biasanya memang kita mau.
- Menguadratkan memberi bobot lebih ke residu besar, tapi tidak sampai residu terbesar selalu mendominasi.
- Kalau residu tidak berkorelasi dan berdistribusi normal dengan rata-rata 0 dan variansi konstan (tapi tidak diketahui), maka fit kuadrat terkecil juga merupakan *maximum likelihood estimator* (penduga kemungkinan maksimum) dari `inter` dan `slope`. Lihat https://en.wikipedia.org/wiki/Linear_regression.
- Nilai `inter` dan `slope` yang meminimalkan kuadrat residu bisa dihitung secara efisien.

Alasan terakhir itu masuk akal di zaman ketika efisiensi komputasi lebih penting daripada memilih metode yang paling cocok untuk masalahnya. Sekarang tidak lagi, jadi ada baiknya kita pertimbangkan: apakah meminimalkan kuadrat residu memang hal yang tepat?

Contoh: kalau kamu memakai `xs` untuk memprediksi nilai `ys`, menebak terlalu tinggi bisa jadi lebih baik (atau lebih buruk) daripada menebak terlalu rendah. Dalam kasus itu kamu mungkin ingin menghitung semacam fungsi biaya untuk tiap residu, dan meminimalkan total biaya, `sum(cost(res))`. Tapi menghitung fit kuadrat terkecil itu cepat, mudah, dan sering kali sudah cukup bagus.

## 10.2 Implementasi

`thinkstats2` menyediakan fungsi sederhana yang mendemonstrasikan kuadrat terkecil linear:

```python
def LeastSquares(xs, ys):
    meanx, varx = MeanVar(xs)
    meany = Mean(ys)
    slope = Cov(xs, ys, meanx, meany) / varx
    inter = meany - slope * meanx
    return inter, slope
```

`LeastSquares` menerima deret `xs` dan `ys` lalu mengembalikan parameter estimasi `inter` dan `slope`. Detail cara kerjanya ada di http://wikipedia.org/wiki/Numerical_methods_for_linear_least_squares.

`thinkstats2` juga menyediakan `FitLine`, yang menerima `inter` dan `slope` lalu mengembalikan garis fit untuk sederet `xs`:

```python
def FitLine(xs, inter, slope):
    fit_xs = np.sort(xs)
    fit_ys = inter + slope * fit_xs
    return fit_xs, fit_ys
```

Kita bisa memakai fungsi-fungsi ini untuk menghitung fit kuadrat terkecil untuk berat lahir sebagai fungsi usia ibu:

```python
live, firsts, others = first.MakeFrames()
live = live.dropna(subset=['agepreg', 'totalwgt_lb'])
ages = live.agepreg
weights = live.totalwgt_lb

inter, slope = thinkstats2.LeastSquares(ages, weights)
fit_xs, fit_ys = thinkstats2.FitLine(ages, inter, slope)
```

Intersep dan kemiringan yang terestimasi adalah 6,8 pon dan 0,017 pon per tahun. Angka-angka ini susah ditafsirkan dalam bentuk begini: intersepnya adalah berat bayi yang diharapkan kalau ibunya berusia 0 tahun — yang tidak masuk akal dalam konteksnya — dan kemiringannya terlalu kecil untuk mudah dipahami.

Alih-alih menyajikan intersep di x = 0, biasanya lebih membantu menyajikan intersep di rata-rata x. Dalam kasus ini rata-rata usia ibu sekitar 25 tahun dan rata-rata berat bayi untuk ibu berusia 25 tahun adalah 7,3 pon. Kemiringannya 0,27 ons per tahun, atau 0,17 pon per dekade.

Grafik 10.1 menunjukkan scatter plot berat lahir dan usia ibu beserta garis fit-nya. Ada baiknya melihat gambar seperti ini untuk menilai apakah hubungannya linear dan apakah garis fit-nya tampak seperti model yang bagus untuk hubungan tersebut.

*[Grafik 10.1: scatter plot berat lahir bayi (pon) vs usia ibu (tahun), lengkap dengan garis fit linear]*

::: tip 💡 Konteks Indonesia
Contoh di bab ini memakai data NSFG — survei kesehatan keluarga nasional Amerika. Padanan terdekat di Indonesia: **Susenas** (BPS) dan **Riskesdas** (Kemenkes), yang polanya mirip: ribuan responden, ratusan variabel, dan banyak nilai yang perlu dibersihkan dulu.

Soal satuan: 1 pon (lbs) ≈ 0,45 kg, dan 1 ons ≈ 28 gram. Jadi 7,3 pon ≈ 3,3 kg — pas di rentang berat bayi lahir normal di Indonesia (2,5–4 kg). Kemiringan 0,017 pon/tahun ≈ 7,7 gram per tahun — makanya penulis bilang "terlalu kecil untuk mudah dipahami". Kalau kamu mengerjakan data berat bayi Indonesia, ubah dulu satuannya ke kg/gram supaya angkanya masuk akal.
:::

## 10.3 Residu

Uji lain yang berguna adalah memplot residu. `thinkstats2` menyediakan fungsi yang menghitung residu:

```python
def Residuals(xs, ys, inter, slope):
    xs = np.asarray(xs)
    ys = np.asarray(ys)
    res = ys - (inter + slope * xs)
    return res
```

`Residuals` menerima deret `xs` dan `ys` serta parameter estimasi `inter` dan `slope`. Ia mengembalikan selisih antara nilai aktual dan garis fit.

Untuk memvisualkan residu, saya mengelompokkan responden berdasarkan usia dan menghitung persentil di tiap kelompok, seperti yang kita lihat di Bagian 7.2. Grafik 10.2 menunjukkan persentil ke-25, ke-50, dan ke-75 dari residu untuk tiap kelompok usia. Mediannya mendekati nol, sesuai harapan, dan jangkauan interkuartilnya sekitar 2 pon. Jadi kalau kita tahu usia ibu, kita bisa menebak berat bayinya dalam rentang 1 pon, sekitar 50% dari waktu.

*[Grafik 10.2: residu dari fit linear — garis persentil ke-25, ke-50, dan ke-75 dari residu per kelompok usia]*

Idealnya garis-garis ini harus datar — yang menunjukkan residunya acak — dan sejajar, yang menunjukkan variansi residu sama untuk semua kelompok usia. Faktanya, garis-garisnya hampir sejajar, jadi itu bagus; tapi ada sedikit kelengkungan, yang menunjukkan hubungannya non-linear. Meski begitu, fit linear adalah model sederhana yang mungkin sudah cukup bagus untuk beberapa keperluan.

## 10.4 Estimasi

Parameter `slope` dan `inter` adalah estimasi berdasarkan sampel; seperti estimasi lain, mereka rentan terhadap *sampling bias* (bias sampling), *measurement error* (galat pengukuran), dan *sampling error* (galat sampling). Seperti dibahas di Bab 8, bias sampling disebabkan oleh pencuplikan yang tidak representatif, galat pengukuran disebabkan kesalahan dalam mengumpulkan dan mencatat data, dan galat sampling adalah akibat dari mengukur sampel, bukan seluruh populasi.

Untuk menilai galat sampling, kita bertanya: "Kalau eksperimen ini diulang, seberapa besar variabilitas yang kita harapkan pada estimasinya?" Kita bisa menjawabnya dengan menjalankan eksperimen simulasi dan menghitung *sampling distribution* (distribusi sampling) dari estimasi-estimasi itu.

Saya mensimulasikan eksperimen dengan me-*resample* data; artinya, saya memperlakukan kehamilan yang teramati seolah-olah mereka adalah seluruh populasi, lalu mengambil sampel — dengan pengembalian — dari sampel yang teramati:

```python
def SamplingDistributions(live, iters=101):
    t = []
    for _ in range(iters):
        sample = thinkstats2.ResampleRows(live)
        ages = sample.agepreg
        weights = sample.totalwgt_lb
        estimates = thinkstats2.LeastSquares(ages, weights)
        t.append(estimates)
    inters, slopes = zip(*t)
    return inters, slopes
```

`SamplingDistributions` menerima DataFrame dengan satu baris per kelahiran hidup, dan `iters`, jumlah eksperimen yang disimulasikan. Ia memakai `ResampleRows` untuk me-resample kehamilan yang teramati. Kita sudah melihat `SampleRows`, yang memilih baris acak dari DataFrame. `thinkstats2` juga menyediakan `ResampleRows`, yang mengembalikan sampel sebesar ukuran aslinya:

```python
def ResampleRows(df):
    return SampleRows(df, len(df), replace=True)
```

Setelah resampling, kita memakai sampel simulasi untuk mengestimasi parameter. Hasilnya dua deret: intersep yang terestimasi dan kemiringan yang terestimasi.

Saya meringkas distribusi sampling dengan mencetak *standard error* (galat baku) dan interval kepercayaan:

```python
def Summarize(estimates, actual=None):
    mean = thinkstats2.Mean(estimates)
    stderr = thinkstats2.Std(estimates, mu=actual)

    cdf = thinkstats2.Cdf(estimates)
    ci = cdf.ConfidenceInterval(90)
    print('mean, SE, CI', mean, stderr, ci)
```

`Summarize` menerima sederet estimasi dan nilai aktualnya. Ia mencetak rata-rata estimasi, galat baku, dan *confidence interval* (interval kepercayaan, IK) 90%.

Untuk intersep, rata-rata estimasinya 6,83, dengan galat baku 0,07 dan interval kepercayaan 90% (6,71; 6,94). Kemiringan yang terestimasi, dalam bentuk lebih ringkas, adalah 0,0174, galat baku 0,0028, IK (0,0126; 0,0220). Ada selisih hampir dua kali lipat antara ujung bawah dan atas interval ini, jadi ini sebaiknya dianggap estimasi kasar.

Untuk memvisualkan galat sampling dari estimasi, kita bisa memplot semua garis fit-nya, atau — supaya tidak terlalu ramai — memplot interval kepercayaan 90% untuk tiap usia. Ini kodenya:

```python
def PlotConfidenceIntervals(xs, inters, slopes,
                            percent=90, **options):
    fys_seq = []
    for inter, slope in zip(inters, slopes):
        fxs, fys = thinkstats2.FitLine(xs, inter, slope)
        fys_seq.append(fys)

    p = (100 - percent) / 2
    percents = p, 100 - p
    low, high = thinkstats2.PercentileRows(fys_seq, percents)
    thinkplot.FillBetween(fxs, low, high, **options)
```

`xs` adalah deret usia ibu. `inters` dan `slopes` adalah parameter estimasi yang dihasilkan `SamplingDistributions`. `percent` menunjukkan interval kepercayaan mana yang diplot.

`PlotConfidenceIntervals` menghasilkan garis fit untuk tiap pasangan `inter` dan `slope`, lalu menyimpan hasilnya dalam deret `fys_seq`. Kemudian ia memakai `PercentileRows` untuk memilih persentil atas dan bawah dari y untuk tiap nilai x. Untuk interval kepercayaan 90%, ia memilih persentil ke-5 dan ke-95. `FillBetween` menggambar poligon yang mengisi ruang di antara dua garis.

Grafik 10.3 menunjukkan interval kepercayaan 50% dan 90% untuk kurva yang di-fit ke berat lahir sebagai fungsi usia ibu. Lebar vertikal wilayahnya merepresentasikan efek galat sampling; efeknya lebih kecil untuk nilai di dekat rata-rata dan lebih besar di ujung-ujungnya.

*[Grafik 10.3: interval kepercayaan 50% dan 90% yang menunjukkan variabilitas garis fit akibat galat sampling pada intersep dan slope]*

## 10.5 Kecocokan Model

Ada beberapa cara mengukur kualitas model linear, atau *goodness of fit* (kecocokan model). Salah satu yang paling sederhana adalah standar deviasi residu.

Kalau kamu memakai model linear untuk membuat prediksi, `Std(res)` adalah *root mean squared error* (RMSE, akar rata-rata kuadrat galat) dari prediksimu. Contoh: kalau kamu memakai usia ibu untuk menebak berat lahir, RMSE tebakanmu adalah 1,40 pon.

Kalau kamu menebak berat lahir tanpa tahu usia ibu, RMSE tebakanmu adalah `Std(ys)`, yaitu 1,41 pon. Jadi dalam contoh ini, tahu usia ibu tidak memperbaiki prediksi secara berarti.

Cara lain mengukur kecocokan model adalah *coefficient of determination* (koefisien determinasi), biasanya ditulis R² dan disebut "R-kuadrat":

```python
def CoefDetermination(ys, res):
    return 1 - Var(res) / Var(ys)
```

`Var(res)` adalah MSE tebakanmu memakai model, `Var(ys)` adalah MSE tanpa model. Jadi rasionya adalah fraksi MSE yang tersisa kalau kamu memakai model, dan R² adalah fraksi MSE yang dihilangkan model.

Untuk berat lahir dan usia ibu, R² adalah 0,0047 — artinya usia ibu memprediksi sekitar setengah dari 1% variansi berat lahir.

Ada hubungan sederhana antara koefisien determinasi dan koefisien korelasi Pearson: R² = ρ². Contoh: kalau ρ adalah 0,8 atau −0,8, R² = 0,64.

Meskipun ρ dan R² sering dipakai untuk mengukur kekuatan hubungan, keduanya tidak mudah ditafsirkan dalam hal daya prediksi. Menurut saya, `Std(res)` adalah representasi terbaik dari kualitas prediksi, apalagi kalau disajikan dalam kaitannya dengan `Std(ys)`.

Contoh: ketika orang membahas validitas SAT (tes standar yang dipakai untuk seleksi masuk perguruan tinggi di AS), mereka sering membicarakan korelasi antara skor SAT dan ukuran kecerdasan lain.

Menurut satu studi, ada korelasi Pearson sebesar ρ = 0,72 antara total skor SAT dan skor IQ — kedengarannya korelasi yang kuat. Tapi R² = ρ² = 0,52, jadi skor SAT hanya menjelaskan 52% variansi IQ.

Skor IQ dinormalisasi dengan `Std(ys)` = 15, jadi:

```python
>>> var_ys = 15**2
>>> rho = 0.72
>>> r2 = rho**2
>>> var_res = (1 - r2) * var_ys
>>> std_res = math.sqrt(var_res)
10.4096
```

Jadi memakai skor SAT untuk memprediksi IQ menurunkan RMSE dari 15 poin ke 10,4 poin. Korelasi sebesar 0,72 hanya menghasilkan penurunan RMSE sebesar 31%.

Kalau kamu melihat korelasi yang terlihat mengesankan, ingat: R² adalah indikator yang lebih baik untuk penurunan MSE, dan penurunan RMSE adalah indikator yang lebih baik untuk daya prediksi.

::: tip 💡 Konteks Indonesia
SAT itu padanannya **SNBT/UTBK** di Indonesia. Pelajarannya sama: kalau suatu hari kamu baca penelitian "korelasi nilai UTBK dengan IPK mahasiswa sebesar 0,72 — kuat!", jangan langsung kagum. Hitung R²-nya dulu (0,52), lalu lihat penurunan RMSE-nya: dari contoh di atas, korelasi 0,72 cuma memangkas galat prediksi 31%. Angka korelasi selalu *terlihat* lebih mengesankan daripada daya prediksinya yang sebenarnya. Ini jebakan klasik di laporan riset pasar, survei kepuasan, sampai analisis HR — selalu minta RMSE-nya, bukan cuma korelasinya.
:::

## 10.6 Menguji Model Linear

Efek usia ibu terhadap berat lahir itu kecil, dan daya prediksinya lemah. Jadi mungkinkah hubungan yang tampak ini cuma kebetulan?

Ada beberapa cara kita bisa menguji hasil fit linear.

Salah satu opsi: menguji apakah penurunan MSE yang tampak ini disebabkan kebetulan. Dalam kasus itu, statistik ujinya adalah R² dan *null hypothesis* (hipotesis nol)-nya adalah tidak ada hubungan antar variabel. Kita bisa mensimulasikan hipotesis nol dengan permutasi, seperti di Bagian 9.5, ketika kita menguji korelasi antara usia ibu dan berat lahir. Faktanya, karena R² = ρ², uji satu sisi terhadap R² ekuivalen dengan uji dua sisi terhadap ρ. Kita sudah melakukan uji itu, dan menemukan p < 0,001, jadi kita simpulkan hubungan yang tampak antara usia ibu dan berat lahir signifikan secara statistik.

Pendekatan lain adalah menguji apakah kemiringan yang tampak ini disebabkan kebetulan. Hipotesis nol-nya adalah kemiringannya sebenarnya nol; dalam kasus itu kita bisa memodelkan berat lahir sebagai variasi acak di sekitar rata-ratanya. Ini `HypothesisTest` untuk model tersebut:

```python
class SlopeTest(thinkstats2.HypothesisTest):
    def TestStatistic(self, data):
        ages, weights = data
        _, slope = thinkstats2.LeastSquares(ages, weights)
        return slope

    def MakeModel(self):
        _, weights = self.data
        self.ybar = weights.mean()
        self.res = weights - self.ybar

    def RunModel(self):
        ages, _ = self.data
        weights = self.ybar + np.random.permutation(self.res)
        return ages, weights
```

Data direpresentasikan sebagai deret usia dan berat. Statistik ujinya adalah slope yang diestimasi `LeastSquares`. Model hipotesis nol direpresentasikan oleh rata-rata berat semua bayi dan simpangan dari rata-rata. Untuk membangkitkan data simulasi, kita mempermutasikan simpangan-simpangan itu lalu menambahkannya ke rata-rata.

Ini kode yang menjalankan uji hipotesisnya:

```python
live, firsts, others = first.MakeFrames()
live = live.dropna(subset=['agepreg', 'totalwgt_lb'])
ht = SlopeTest((live.agepreg, live.totalwgt_lb))
pvalue = ht.PValue()
```

Nilai-p-nya kurang dari 0,001, jadi meskipun slope yang terestimasi kecil, kecil kemungkinannya itu disebabkan kebetulan.

Mengestimasi *p-value* (nilai-p) dengan mensimulasikan hipotesis nol itu benar secara ketat, tapi ada alternatif yang lebih sederhana. Ingat kita sudah menghitung distribusi sampling dari slope di Bagian 10.4. Untuk itu, kita mengasumsikan slope yang teramati sudah benar lalu mensimulasikan eksperimen dengan resampling.

Grafik 10.4 menunjukkan distribusi sampling dari slope, dari Bagian 10.4, dan distribusi slope yang dibangkitkan di bawah hipotesis nol. Distribusi sampling berpusat di sekitar slope estimasi, 0,017 pon/tahun, dan slope di bawah hipotesis nol berpusat di sekitar 0; tapi selain itu, distribusinya identik. Distribusi-distribusinya juga simetris, dengan alasan yang akan kita lihat di Bagian 14.4.

*[Grafik 10.4: distribusi sampling dari slope estimasi dan distribusi slope yang dibangkitkan di bawah hipotesis nol; garis vertikal di 0 dan di slope teramati 0,017 pon/tahun]*

Jadi kita bisa mengestimasi nilai-p dengan dua cara:

- Menghitung peluang bahwa slope di bawah hipotesis nol melebihi slope yang teramati.
- Menghitung peluang bahwa slope dalam distribusi sampling jatuh di bawah 0. (Kalau slope yang terestimasi negatif, kita menghitung peluang bahwa slope dalam distribusi sampling melebihi 0.)

Opsi kedua lebih mudah karena biasanya kita memang ingin menghitung distribusi sampling parameternya. Dan ini aproksimasi yang bagus kecuali ukuran sampelnya kecil dan distribusi residunya miring. Bahkan dalam kasus itu pun biasanya sudah cukup bagus, karena nilai-p tidak harus presisi.

Ini kode yang mengestimasi nilai-p dari slope memakai distribusi sampling:

```python
inters, slopes = SamplingDistributions(live, iters=1001)
slope_cdf = thinkstats2.Cdf(slopes)
pvalue = slope_cdf[0]
```

Dan lagi-lagi, kita menemukan p < 0,001.

## 10.7 Resampling Berbobot

Sejauh ini kita memperlakukan data NSFG seolah-olah itu sampel yang representatif, tapi seperti saya sebutkan di Bagian 1.2, kenyataannya bukan. Survei ini sengaja mengambil sampel berlebih (*oversampling*) dari beberapa kelompok demi meningkatkan peluang mendapatkan hasil yang signifikan secara statistik; dengan kata lain, demi meningkatkan *power* (kekuatan uji) dari uji yang melibatkan kelompok-kelompok ini.

Desain survei ini berguna untuk banyak keperluan, tapi artinya kita tidak bisa memakai sampel untuk mengestimasi nilai bagi populasi umum tanpa memperhitungkan proses samplingnya.

Untuk tiap responden, data NSFG menyertakan variabel bernama `finalwgt`, yaitu jumlah orang di populasi umum yang diwakili responden itu. Nilai ini disebut *sampling weight* (bobot sampling), atau singkatnya "bobot".

Sebagai contoh, kalau kamu mensurvei 100.000 orang di negara berpenduduk 300 juta, tiap responden mewakili 3.000 orang. Kalau kamu mengambil sampel berlebih dari satu kelompok dengan faktor 2, tiap orang di kelompok yang kelebihan sampel itu akan punya bobot lebih rendah, sekitar 1.500.

Untuk mengoreksi oversampling, kita bisa memakai resampling; yaitu, kita bisa mengambil sampel dari survei memakai peluang yang proporsional dengan bobot sampling. Kemudian, untuk besaran apapun yang ingin kita estimasi, kita bisa membangkitkan distribusi sampling, galat baku, dan interval kepercayaan. Sebagai contoh, saya akan mengestimasi rata-rata berat lahir dengan dan tanpa bobot sampling.

Di Bagian 10.4, kita melihat `ResampleRows`, yang memilih baris dari DataFrame dengan memberi tiap baris peluang yang sama. Sekarang kita perlu melakukan hal yang sama memakai peluang yang proporsional dengan bobot sampling. `ResampleRowsWeighted` menerima DataFrame, me-resample baris sesuai bobot di `finalwgt`, dan mengembalikan DataFrame berisi baris-baris yang ter-resample:

```python
def ResampleRowsWeighted(df, column='finalwgt'):
    weights = df[column]
    cdf = Cdf(dict(weights))
    indices = cdf.Sample(len(weights))
    sample = df.loc[indices]
    return sample
```

`weights` adalah Series; mengonversinya ke dictionary membuat pemetaan dari indeks ke bobot. Dalam `cdf`, nilainya adalah indeks dan peluangnya proporsional dengan bobot.

`indices` adalah deret indeks baris; `sample` adalah DataFrame yang berisi baris-baris terpilih. Karena kita mengambil sampel dengan pengembalian, baris yang sama bisa muncul lebih dari sekali.

Sekarang kita bisa membandingkan efek resampling dengan dan tanpa bobot. Tanpa bobot, kita membangkitkan distribusi sampling seperti ini:

```python
estimates = [ResampleRows(live).totalwgt_lb.mean()
             for _ in range(iters)]
```

Dengan bobot, bentuknya seperti ini:

```python
estimates = [ResampleRowsWeighted(live).totalwgt_lb.mean()
             for _ in range(iters)]
```

Tabel berikut merangkum hasilnya:

|  | rata-rata berat lahir (pon) | galat baku | IK 90% |
|---|---|---|---|
| Tanpa bobot | 7,27 | 0,014 | (7,24; 7,29) |
| Berbobot | 7,35 | 0,014 | (7,32; 7,37) |

Dalam contoh ini, efek pembobotan itu kecil tapi tidak bisa diabaikan. Selisih rata-rata yang terestimasi, dengan dan tanpa pembobotan, sekitar 0,08 pon, atau 1,3 ons. Selisih ini jauh lebih besar daripada galat baku estimasinya, 0,014 pon, yang berarti selisih ini bukan disebabkan kebetulan.

::: tip 💡 Konteks Indonesia
Bobot sampling bukan cuma urusan survei Amerika. **Susenas (BPS) juga punya kolom bobot** (biasanya bernama `fweight` atau sejenisnya) karena desain sampelnya bertingkat dan tidak semua rumah tangga punya peluang terpilih yang sama. Riskesdas pun begitu. Jadi kalau suatu hari kamu mengolah data Susenas mentah — misalnya menghitung rata-rata pengeluaran per kapita — dan mengabaikan bobotnya, estimasimu bisa meleset persis seperti contoh di atas: selisihnya kecil, tapi lebih besar dari galat bakunya, alias melesetnya *sistematis*, bukan kebetulan. Teknik `ResampleRowsWeighted` di bab ini bisa langsung dipakai ulang untuk data BPS.
:::

## 10.8 Latihan

Solusi latihan ini ada di `chap10soln.ipynb`.

**Latihan 10.1** Dengan memakai data BRFSS, hitung fit kuadrat terkecil linear untuk `log(weight)` versus `height`. Bagaimana cara terbaik menyajikan parameter yang terestimasi untuk model seperti ini, di mana salah satu variabelnya di-log-transform? Kalau kamu mencoba menebak berat badan seseorang, seberapa membantu mengetahui tinggi badannya?

Seperti NSFG, BRFSS mengambil sampel berlebih dari beberapa kelompok dan menyediakan bobot sampling untuk tiap responden. Dalam data BRFSS, nama variabel untuk bobot ini adalah `finalwt`. Pakai resampling, dengan dan tanpa bobot, untuk mengestimasi rata-rata tinggi badan responden BRFSS, galat baku rata-ratanya, dan interval kepercayaan 90%. Seberapa besar pengaruh pembobotan yang benar terhadap estimasinya?

## 10.9 Glosarium

- **fit linear**: garis yang dimaksudkan untuk memodelkan hubungan antar variabel.
- **fit kuadrat terkecil**: model dari sebuah dataset yang meminimalkan jumlah kuadrat residu.
- **residu**: simpangan nilai aktual dari sebuah model.
- **kecocokan model** (*goodness of fit*): ukuran seberapa baik sebuah model cocok dengan data.
- **koefisien determinasi**: statistik yang dimaksudkan untuk mengukur kecocokan model.
- **bobot sampling**: nilai yang diasosiasikan dengan sebuah observasi dalam sampel yang menunjukkan bagian populasi mana yang ia wakili.

---

**Selanjutnya:** [Bab 11: Regresi](/thinkstats-bab-11) *(segera hadir)*
