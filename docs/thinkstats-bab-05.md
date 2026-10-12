> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 5: Memodelkan Distribusi

Distribusi yang kita pakai sejauh ini disebut *empirical distribution* (distribusi empiris) karena didasarkan pada pengamatan empiris, yang mau nggak mau berupa sampel berhingga.

Alternatifnya adalah *analytic distribution* (distribusi analitik), yang dicirikan oleh CDF yang merupakan fungsi matematika. Distribusi analitik bisa dipakai untuk memodelkan distribusi empiris. Dalam konteks ini, *model* adalah penyederhanaan yang membuang detail-detail yang nggak perlu. Bab ini menyajikan distribusi analitik yang umum dipakai dan menggunakannya untuk memodelkan data dari berbagai sumber.

Kode untuk bab ini ada di `analytic.py`. Untuk info cara mengunduh dan menjalankan kode ini, lihat Bagian 0.2.

## 5.1 Distribusi eksponensial

Saya mulai dari *exponential distribution* (distribusi eksponensial) karena relatif sederhana. CDF distribusi eksponensial adalah

`CDF(x) = 1 − e^(−λx)`

Parameter λ menentukan bentuk distribusinya.

*[Grafik 5.1: CDF distribusi eksponensial dengan parameter λ = 0,5, 1, dan 2.]*

Di dunia nyata, distribusi eksponensial muncul saat kita melihat rangkaian kejadian dan mengukur waktu antar kejadian, yang disebut *interarrival time* (waktu antar-kedatangan). Kalau kejadiannya sama mungkinnya terjadi kapan pun, distribusi waktu antar-kedatangannya cenderung mirip distribusi eksponensial.

Contohnya, kita lihat waktu antar-kedatangan kelahiran bayi. Tanggal 18 Desember 1997, ada 44 bayi lahir di sebuah rumah sakit di Brisbane, Australia. Waktu lahir ke-44 bayi itu dimuat di koran lokal; dataset lengkapnya ada di file `babyboom.dat` di repo ThinkStats2.

> **Catatan:** contoh ini berdasarkan info dan data dari Dunn, "A Simple Dataset for Demonstrating Common Distributions," Journal of Statistics Education v.7, n.3 (1999).

```python
df = ReadBabyBoom()
diffs = df.minutes.diff()
cdf = thinkstats2.Cdf(diffs, label='actual')
thinkplot.Cdf(cdf)
thinkplot.Show(xlabel='minutes', ylabel='CDF')
```

`ReadBabyBoom` membaca file data dan mengembalikan DataFrame dengan kolom `time`, `sex`, `weight_g`, dan `minutes`, di mana `minutes` adalah waktu lahir yang dikonversi ke menit sejak tengah malam.

`diffs` adalah selisih waktu lahir yang berurutan, dan `cdf` adalah distribusi dari waktu antar-kedatangan ini.

*[Grafik 5.2: CDF waktu antar-kedatangan kelahiran (kiri) dan CCDF dalam skala log-y (kanan).]*

Panel kiri kayaknya punya bentuk umum distribusi eksponensial, tapi gimana cara memastikannya?

Salah satu caranya: plot *complementary CDF* (CDF komplementer, CCDF), yaitu 1 − CDF(x), dalam skala log-y. Untuk data dari distribusi eksponensial, hasilnya berupa garis lurus. Begini alasannya.

Kalau kamu memplot CDF komplementer dari dataset yang kamu duga eksponensial, kamu mengharapkan fungsi seperti:

`y ≈ e^(−λx)`

Ambil log kedua sisi:

`log y ≈ −λx`

Jadi dalam skala log-y, CCDF-nya berupa garis lurus dengan kemiringan −λ. Begini cara bikin plot seperti itu:

```python
thinkplot.Cdf(cdf, complement=True)
thinkplot.Show(xlabel='minutes',
               ylabel='CCDF',
               yscale='log')
```

Dengan argumen `complement=True`, `thinkplot.Cdf` menghitung CDF komplementer dulu sebelum memplot. Dan dengan `yscale='log'`, `thinkplot.Show` mengatur sumbu y ke skala logaritmik.

Panel kanan Grafik 5.2 menunjukkan hasilnya. Garisnya nggak persis lurus, yang artinya distribusi eksponensial bukan model yang sempurna untuk data ini. Kemungkinan besar asumsi dasarnya — bahwa kelahiran sama mungkinnya terjadi kapan pun sepanjang hari — nggak sepenuhnya benar. Meski begitu, memodelkan dataset ini dengan distribusi eksponensial mungkin masih masuk akal. Dengan penyederhanaan itu, kita bisa meringkas distribusinya dengan satu parameter.

Parameter λ bisa diartikan sebagai *rate* (laju); yaitu, jumlah kejadian yang terjadi, rata-rata, dalam satu satuan waktu. Di contoh ini, 44 bayi lahir dalam 24 jam, jadi lajunya λ = 0,0306 kelahiran per menit. Rata-rata distribusi eksponensial adalah 1/λ, jadi rata-rata waktu antar kelahiran adalah 32,7 menit.

::: tip 💡 Konteks Indonesia
Pola "waktu antar-kedatangan" ini ada di mana-mana di sekitarmu: selisih waktu antar penumpang yang tap-in di gerbang KRL, antar order yang masuk ke driver ojol, atau antar pelanggan yang datang ke warteg jam makan siang. Kalau kedatangannya acak dan nggak terjadwal, distribusi selisih waktunya cenderung eksponensial — dan kamu cukup menghafal satu angka, λ, buat meringkas semuanya.
:::

## 5.2 Distribusi normal

*Normal distribution* (distribusi normal), disebut juga *Gaussian*, umum dipakai karena menggambarkan banyak fenomena, setidaknya secara pendekatan. Ternyata ada alasan bagus kenapa dia ada di mana-mana — kita bahas di Bagian 14.4.

Distribusi normal dicirikan oleh dua parameter: rata-rata µ dan *standard deviation* (simpangan baku) σ. Distribusi normal dengan µ = 0 dan σ = 1 disebut *standard normal distribution* (distribusi normal standar). CDF-nya didefinisikan oleh integral yang nggak punya solusi bentuk tertutup, tapi ada algoritma yang mengevaluasinya secara efisien. Salah satunya disediakan SciPy: `scipy.stats.norm` adalah objek yang merepresentasikan distribusi normal; ia punya method `cdf` yang mengevaluasi CDF normal standar:

```python
>>> import scipy.stats
>>> scipy.stats.norm.cdf(0)
0.5
```

Hasilnya benar: median distribusi normal standar adalah 0 (sama dengan rata-ratanya), dan separuh nilainya jatuh di bawah median, jadi CDF(0) adalah 0,5.

*[Grafik 5.3: CDF distribusi normal dengan berbagai parameter (µ=1, σ=0,5; µ=2, σ=0,4; µ=3, σ=0,3).]*

`norm.cdf` menerima parameter opsional: `loc`, yang menentukan rata-rata, dan `scale`, yang menentukan simpangan baku.

`thinkstats2` bikin fungsi ini sedikit lebih gampang dipakai lewat `EvalNormalCdf`, yang menerima parameter `mu` dan `sigma` lalu mengevaluasi CDF di `x`:

```python
def EvalNormalCdf(x, mu=0, sigma=1):
    return scipy.stats.norm.cdf(x, loc=mu, scale=sigma)
```

Bentuk sigmoid dari kurva-kurva ini adalah ciri khas distribusi normal yang gampang dikenali.

Di bab sebelumnya kita melihat distribusi berat lahir di NSFG.

*[Grafik 5.4: CDF berat lahir dengan model normal — garis "model" vs garis "data".]*

Grafiknya menunjukkan CDF empiris berat untuk semua kelahiran hidup dan CDF distribusi normal dengan rata-rata dan varians yang sama.

Distribusi normal adalah model yang bagus untuk dataset ini, jadi kalau kita meringkas distribusinya dengan parameter µ = 7,28 dan σ = 1,24, *error*-nya (selisih antara model dan data) kecil.

Di bawah persentil ke-10 ada ketidaksesuaian antara data dan model; bayi ringan jumlahnya lebih banyak dari yang diharapkan distribusi normal. Kalau kita memang tertarik pada bayi prematur, bagian distribusi ini penting untuk dimodelkan dengan benar, jadi model normal mungkin nggak cocok dipakai.

## 5.3 Plot probabilitas normal

Untuk distribusi eksponensial, dan beberapa distribusi lain, ada transformasi sederhana yang bisa dipakai untuk menguji apakah distribusi analitik adalah model yang bagus untuk sebuah dataset.

Untuk distribusi normal nggak ada transformasi semacam itu, tapi ada alternatif yang disebut *normal probability plot* (plot probabilitas normal). Ada dua cara bikin plot probabilitas normal: cara susah dan cara gampang. Kalau kamu penasaran sama cara susah, bisa baca di https://en.wikipedia.org/wiki/Normal_probability_plot. Ini cara gampangnya:

1. Urutkan nilai-nilai dalam sampel.
2. Dari distribusi normal standar (µ = 0 dan σ = 1), bangkitkan sampel acak dengan ukuran yang sama dengan sampel, lalu urutkan.
3. Plot nilai sampel yang sudah diurutkan versus nilai acaknya.

Kalau distribusi sampelnya kira-kira normal, hasilnya berupa garis lurus dengan *intercept* mu dan kemiringan sigma. `thinkstats2` menyediakan `NormalProbability`, yang menerima sampel dan mengembalikan dua array NumPy:

`xs, ys = thinkstats2.NormalProbability(sample)`

`ys` berisi nilai sampel yang sudah diurutkan; `xs` berisi nilai acak dari distribusi normal standar.

Untuk menguji `NormalProbability`, saya membangkitkan beberapa sampel palsu yang memang diambil dari distribusi normal dengan berbagai parameter.

*[Grafik 5.5: plot probabilitas normal untuk sampel acak dari distribusi normal dengan parameter µ=0, σ=1; µ=1, σ=1; dan µ=5, σ=2 — ketiganya kira-kira garis lurus.]*

Garis-garisnya kira-kira lurus, dengan nilai di ekor yang menyimpang lebih jauh dibanding nilai di dekat rata-rata.

Sekarang coba dengan data asli. Ini kode untuk bikin plot probabilitas normal untuk data berat lahir dari bagian sebelumnya. Ia memplot garis abu-abu yang mewakili model dan garis biru yang mewakili data.

```python
def MakeNormalPlot(weights):
    mean = weights.mean()
    std = weights.std()
    xs = [-4, 4]
    fxs, fys = thinkstats2.FitLine(xs, inter=mean, slope=std)
    thinkplot.Plot(fxs, fys, color='gray', label='model')
    xs, ys = thinkstats2.NormalProbability(weights)
    thinkplot.Plot(xs, ys, label='birth weights')
```

`weights` adalah Series pandas berisi berat lahir; `mean` dan `std` adalah rata-rata dan simpangan bakunya.

`FitLine` menerima urutan `xs`, sebuah intercept, dan sebuah kemiringan; ia mengembalikan `xs` dan `ys` yang mewakili garis dengan parameter tersebut, dievaluasi di nilai-nilai dalam `xs`.

`NormalProbability` mengembalikan `xs` dan `ys` yang berisi nilai dari distribusi normal standar dan nilai dari `weights`. Kalau distribusi `weights` normal, datanya harus cocok dengan modelnya.

*[Grafik 5.6: plot probabilitas normal berat lahir untuk semua kelahiran hidup dan kelahiran cukup bulan.]*

Grafiknya menunjukkan hasil untuk semua kelahiran hidup, dan juga untuk kelahiran cukup bulan (usia kehamilan lebih dari 36 minggu). Kedua kurva cocok dengan model di dekat rata-rata dan menyimpang di ekor. Bayi-bayi terberat lebih berat dari yang diharapkan model, dan bayi-bayi paling ringan lebih ringan.

Saat kita hanya memilih kelahiran cukup bulan, kita membuang sebagian berat paling ringan, yang mengurangi ketidaksesuaian di ekor bawah distribusi.

Plot ini menunjukkan bahwa model normal menggambarkan distribusi dengan baik dalam beberapa simpangan baku dari rata-rata, tapi nggak di ekornya. Apakah itu cukup bagus untuk keperluan praktis tergantung keperluannya.

## 5.4 Distribusi lognormal

Kalau logaritma dari sekumpulan nilai berdistribusi normal, nilai-nilainya berdistribusi *lognormal distribution* (distribusi lognormal). CDF distribusi lognormal sama dengan CDF distribusi normal, dengan `log x` menggantikan `x`.

`CDF_lognormal(x) = CDF_normal(log x)`

Parameter distribusi lognormal biasanya dinotasikan µ dan σ. Tapi ingat bahwa parameter ini bukan rata-rata dan simpangan baku; rata-rata distribusi lognormal adalah exp(µ + σ²/2) dan simpangan bakunya... jelek (lihat http://wikipedia.org/wiki/Log-normal_distribution).

Kalau sebuah sampel kira-kira lognormal dan kamu memplot CDF-nya dalam skala log-x, ia akan punya bentuk khas distribusi normal. Untuk menguji seberapa cocok sampel dengan model lognormal, kamu bisa bikin plot probabilitas normal memakai log dari nilai-nilai dalam sampel.

Contohnya, lihat distribusi berat badan orang dewasa, yang kira-kira lognormal.

> **Catatan:** penulis awalnya dapat petunjuk soal ini dari komentar (tanpa sitasi) di http://mathworld.wolfram.com/LogNormalDistribution.html. Belakangan ia menemukan makalah yang mengusulkan transformasi log dan menyarankan penyebabnya: Penman dan Johnson, "The Changing Shape of the Body Mass Index Distribution Curve in the Population," Preventing Chronic Disease, 2006 July; 3(3): A74. Online di http://www.ncbi.nlm.nih.gov/pmc/articles/PMC1636707.

National Center for Chronic Disease Prevention and Health Promotion mengadakan survei tahunan sebagai bagian dari *Behavioral Risk Factor Surveillance System* (BRFSS). Pada 2008, mereka mewawancarai 414.509 responden dan menanyai soal demografi, kesehatan, dan risiko kesehatan. Di antara data yang mereka kumpulkan adalah berat badan dalam kilogram dari 398.484 responden.

> **Catatan:** Centers for Disease Control and Prevention (CDC). Behavioral Risk Factor Surveillance System Survey Data. Atlanta, Georgia: U.S. Department of Health and Human Services, Centers for Disease Control and Prevention, 2008.

Repo buku ini berisi `CDBRFS08.ASC.gz`, file ASCII lebar-tetap yang berisi data BRFSS, dan `brfss.py`, yang membaca file dan menganalisis datanya.

*[Grafik 5.7: CDF berat badan dewasa dalam skala linear (kiri) dengan model normal, dan dalam skala log (kanan) dengan model lognormal.]*

Panel kiri menunjukkan distribusi berat badan dewasa dalam skala linear dengan model normal. Panel kanan menunjukkan distribusi yang sama dalam skala log dengan model lognormal. Model lognormal lebih cocok, tapi representasi data ini nggak bikin perbedaannya terlalu dramatis.

*[Grafik 5.8: plot probabilitas normal untuk berat badan dewasa dalam skala linear (kiri) dan skala log (kanan).]*

Grafiknya menunjukkan plot probabilitas normal untuk berat badan dewasa, `w`, dan untuk logaritmanya, `log10 w`. Sekarang jelas bahwa datanya menyimpang jauh dari model normal. Sebaliknya, model lognormal cocok banget dengan datanya.

::: tip 💡 Konteks Indonesia
BRFSS itu surveinya orang Amerika. Padanan lokalnya: **Riskesdas** (Riset Kesehatan Dasar) dari Kemenkes — datanya juga ratusan ribu responden dengan variabel berat dan tinggi badan. Dan pola "lognormal"-nya kepake banget di Indonesia: distribusi **pendapatan** atau **harga kos di kota besar** itu nggak simetris seperti lonceng normal — ekor kanannya panjang (sedikit orang berpenghasilan jauh di atas rata-rata). Setiap kali datamu "miring kanan" begitu, coba plot dalam skala log: kalau jadi lonceng simetris, kamu sedang berhadapan dengan distribusi lognormal.
:::

## 5.5 Distribusi Pareto

*Pareto distribution* (distribusi Pareto) dinamai dari ekonom Vilfredo Pareto, yang memakainya untuk menggambarkan distribusi kekayaan (lihat http://wikipedia.org/wiki/Pareto_distribution). Sejak itu, distribusi ini dipakai untuk menggambarkan fenomena di ilmu alam dan sosial, termasuk ukuran kota, partikel pasir dan meteorit, kebakaran hutan dan gempa bumi.

CDF distribusi Pareto adalah:

`CDF(x) = 1 − (x/xₘ)^(−α)`

Parameter xₘ dan α menentukan lokasi dan bentuk distribusi. xₘ adalah nilai minimum yang mungkin.

*[Grafik 5.9: CDF distribusi Pareto dengan xₘ = 0,5 dan α = 2, 1, dan 0,5.]*

Ada uji visual sederhana yang menunjukkan apakah distribusi empiris cocok dengan distribusi Pareto: dalam skala log-log, CCDF-nya terlihat seperti garis lurus. Begini alasannya.

Kalau kamu memplot CCDF sampel dari distribusi Pareto dalam skala linear, kamu mengharapkan fungsi seperti:

`y ≈ (x/xₘ)^(−α)`

Ambil log kedua sisi:

`log y ≈ −α(log x − log xₘ)`

Jadi kalau kamu memplot log y versus log x, hasilnya harusnya garis lurus dengan kemiringan −α dan intercept α log xₘ.

Contohnya, lihat ukuran kota. Biro Sensus AS mempublikasikan populasi setiap kota di Amerika Serikat.

Saya mengunduh datanya dari http://www.census.gov/popest/data/cities/totals/2012/SUB-EST2012-3.html; datanya ada di repo buku ini dalam file bernama `PEP_2012_PEPANNRES_with_ann.csv`. Repo-nya juga berisi `populations.py`, yang membaca file dan memplot distribusi populasinya.

*[Grafik 5.10: CCDF populasi kota dalam skala log-log.]*

Grafiknya menunjukkan CCDF populasi dalam skala log-log. 1% kota terbesar, di bawah 10^−2, jatuh di sepanjang garis lurus. Jadi kita bisa menyimpulkan, seperti beberapa peneliti, bahwa ekor distribusi ini cocok dengan model Pareto.

Di sisi lain, distribusi lognormal juga memodelkan data ini dengan baik.

*[Grafik 5.11: CDF populasi kota dalam skala log-x (kiri), dan plot probabilitas normal dari populasi yang ditransformasi log (kanan).]*

Kedua plot menunjukkan kesesuaian yang bagus antara data dan model.

Nggak ada model yang sempurna. Model Pareto hanya berlaku untuk 1% kota terbesar, tapi lebih cocok untuk bagian distribusi itu. Model lognormal lebih cocok untuk 99% sisanya. Model mana yang tepat tergantung bagian distribusi mana yang relevan.

::: tip 💡 Konteks Indonesia
Pola Pareto ini gampang ditemui di Indonesia: 1% kota terbesar (Jakarta, Surabaya, Bandung, Medan, ...) populasinya jauh melampaui ratusan kota kecil — persis seperti ekor panjang di Grafik 5.10. Aturan kasarnya terkenal sebagai prinsip 80/20: sedikit kota menampung sebagian besar penduduk urban, sedikit penjual menguasai sebagian besar omzet di marketplace. Kalau datamu "dikuasai segelintir raksasa", coba plot CCDF-nya dalam skala log-log — garis lurus berarti Pareto sedang bekerja.
:::

## 5.6 Membangkitkan bilangan acak

CDF analitik bisa dipakai untuk membangkitkan bilangan acak dengan fungsi distribusi tertentu, p = CDF(x). Kalau ada cara efisien untuk menghitung CDF invers, kita bisa membangkitkan nilai acak dengan distribusi yang tepat dengan memilih p dari distribusi uniform antara 0 dan 1, lalu memilih x = ICDF(p).

Contohnya, CDF distribusi eksponensial adalah

`p = 1 − e^(−λx)`

Menyelesaikan untuk x menghasilkan:

`x = −log(1 − p)/λ`

Jadi di Python kita bisa menulis

```python
def expovariate(lam):
    p = random.random()
    x = -math.log(1-p) / lam
    return x
```

`expovariate` menerima `lam` dan mengembalikan nilai acak yang dipilih dari distribusi eksponensial dengan parameter `lam`.

Dua catatan soal implementasi ini: saya menamai parameternya `lam` karena `lambda` adalah *keyword* Python. Juga, karena log 0 nggak terdefinisi, kita harus sedikit hati-hati. Implementasi `random.random` bisa mengembalikan 0 tapi nggak bisa 1, jadi 1 − p bisa bernilai 1 tapi nggak bisa 0, sehingga `log(1-p)` selalu terdefinisi.

## 5.7 Kenapa memodelkan?

Di awal bab ini, saya bilang banyak fenomena dunia nyata bisa dimodelkan dengan distribusi analitik. "Terus," mungkin kamu bertanya, "buat apa?"

Seperti semua model, distribusi analitik adalah abstraksi, yang artinya ia membuang detail yang dianggap nggak relevan. Contohnya, distribusi yang diamati mungkin punya *measurement error* (kesalahan pengukuran) atau keunikan yang spesifik untuk sampelnya; model analitik menghaluskan keanehan-keanehan itu.

Model analitik juga bentuk *data compression* (kompresi data). Saat sebuah model cocok dengan dataset, sedikit parameter bisa meringkas banyak data.

Kadang mengejutkan saat data dari fenomena alam cocok dengan distribusi analitik, tapi pengamatan ini bisa memberi wawasan soal sistem fisik. Kadang kita bisa menjelaskan kenapa distribusi yang diamati punya bentuk tertentu. Contohnya, distribusi Pareto sering kali hasil dari proses generatif dengan *positive feedback* (proses *preferential attachment*; lihat http://wikipedia.org/wiki/Preferential_attachment).

Juga, distribusi analitik cocok untuk analisis matematis, seperti yang akan kita lihat di Bab 14.

Tapi penting untuk diingat bahwa semua model nggak sempurna. Data dari dunia nyata nggak pernah cocok sempurna dengan distribusi analitik. Orang kadang bicara seolah data dihasilkan oleh model; misalnya, mereka bilang distribusi tinggi badan manusia itu normal, atau distribusi pendapatan itu lognormal. Diartikan harfiah, klaim ini nggak mungkin benar; selalu ada perbedaan antara dunia nyata dan model matematika.

Model berguna kalau ia menangkap aspek dunia nyata yang relevan dan membuang detail yang nggak perlu. Tapi apa yang "relevan" atau "nggak perlu" tergantung buat apa kamu mau memakai modelnya.

## 5.8 Latihan

Untuk latihan-latihan berikut, kamu bisa mulai dari `chap05ex.ipynb`. Solusi saya ada di `chap05soln.ipynb`.

**Latihan 5.1** Di BRFSS (lihat Bagian 5.4), distribusi tinggi badan kira-kira normal dengan parameter µ = 178 cm dan σ = 7,7 cm untuk pria, dan µ = 163 cm dan σ = 7,3 cm untuk wanita.

Untuk bergabung dengan Blue Man Group, kamu harus pria dengan tinggi antara 5'10" dan 6'1" (lihat http://bluemancasting.com). Berapa persen populasi pria AS yang masuk rentang ini? Petunjuk: pakai `scipy.stats.norm.cdf`.

**Latihan 5.2** Untuk merasakan distribusi Pareto, mari kita lihat betapa berbedanya dunia kalau distribusi tinggi badan manusia itu Pareto. Dengan parameter xₘ = 1 m dan α = 1,7, kita dapat distribusi dengan minimum yang masuk akal, 1 m, dan median 1,5 m.

Plot distribusi ini. Berapa rata-rata tinggi badan manusia di dunia Pareto? Berapa fraksi populasi yang lebih pendek dari rata-rata? Kalau ada 7 miliar orang di dunia Pareto, berapa yang kita harapkan lebih tinggi dari 1 km? Seberapa tinggi orang tertinggi yang kita harapkan?

**Latihan 5.3** Distribusi *Weibull* adalah generalisasi distribusi eksponensial yang muncul di analisis kegagalan (lihat http://wikipedia.org/wiki/Weibull_distribution). CDF-nya adalah

`CDF(x) = 1 − e^(−(x/λ)^k)`

Bisakah kamu menemukan transformasi yang membuat distribusi Weibull terlihat seperti garis lurus? Apa arti kemiringan dan intercept garis itu?

Pakai `random.weibullvariate` untuk membangkitkan sampel dari distribusi Weibull dan pakai untuk menguji transformasimu.

**Latihan 5.4** Untuk nilai n yang kecil, kita nggak mengharapkan distribusi empiris cocok persis dengan distribusi analitik. Salah satu cara mengevaluasi kualitas kecocokan adalah membangkitkan sampel dari distribusi analitik dan melihat seberapa cocok ia dengan datanya.

Contohnya, di Bagian 5.1 kita memplot distribusi waktu antar kelahiran dan melihat bahwa ia kira-kira eksponensial. Tapi distribusinya cuma berdasarkan 44 titik data. Untuk melihat apakah datanya mungkin berasal dari distribusi eksponensial, bangkitkan 44 nilai dari distribusi eksponensial dengan rata-rata yang sama dengan datanya, sekitar 33 menit antar kelahiran.

Plot distribusi nilai acaknya dan bandingkan dengan distribusi aktualnya. Kamu bisa pakai `random.expovariate` untuk membangkitkan nilainya.

**Latihan 5.5** Di repo buku ini, kamu akan menemukan sekumpulan file data bernama `mystery0.dat`, `mystery1.dat`, dan seterusnya. Masing-masing berisi urutan bilangan acak yang dibangkitkan dari sebuah distribusi analitik.

Kamu juga akan menemukan `test_models.py`, skrip yang membaca data dari file dan memplot CDF dalam berbagai transformasi. Kamu bisa menjalankannya seperti ini:

```
$ python test_models.py mystery0.dat
```

Berdasarkan plot-plot ini, kamu harusnya bisa menyimpulkan distribusi apa yang membangkitkan tiap file. Kalau buntu, kamu bisa mengintip `mystery.py`, yang berisi kode yang membangkitkan file-file itu.

**Latihan 5.6** Distribusi kekayaan dan pendapatan kadang dimodelkan memakai distribusi lognormal dan Pareto. Untuk melihat mana yang lebih baik, mari kita lihat datanya.

*Current Population Survey* (CPS) adalah kerja sama Biro Statistik Tenaga Kerja dan Biro Sensus AS untuk mempelajari pendapatan dan variabel terkait. Data yang dikumpulkan tahun 2013 tersedia di http://www.census.gov/hhes/www/cpstables/032013/hhinc/toc.htm. Saya mengunduh `hinc06.xls`, spreadsheet Excel berisi info pendapatan rumah tangga, dan mengonversinya ke `hinc06.csv`, file CSV yang akan kamu temukan di repo buku ini.

Kamu juga akan menemukan `hinc.py`, yang membaca file ini.

Ekstrak distribusi pendapatan dari dataset ini. Apakah ada distribusi analitik di bab ini yang jadi model bagus untuk datanya? Solusi latihan ini ada di `hinc_soln.py`.

## 5.9 Glosarium

- *empirical distribution* (distribusi empiris): distribusi nilai-nilai dalam sebuah sampel.
- *analytic distribution* (distribusi analitik): distribusi yang CDF-nya merupakan fungsi analitik.
- *model*: penyederhanaan yang berguna. Distribusi analitik sering jadi model yang bagus untuk distribusi empiris yang lebih kompleks.
- *interarrival time* (waktu antar-kedatangan): waktu yang berlalu antara dua kejadian.
- *complementary CDF* (CDF komplementer): fungsi yang memetakan dari sebuah nilai, x, ke fraksi nilai yang melebihi x, yaitu 1 − CDF(x).
- *standard normal distribution* (distribusi normal standar): distribusi normal dengan rata-rata 0 dan simpangan baku 1.
- *normal probability plot* (plot probabilitas normal): plot nilai-nilai dalam sampel versus nilai acak dari distribusi normal standar.

---

**Selanjutnya:** [Bab 6: Fungsi Kepadatan Probabilitas](/thinkstats-bab-06) *(segera hadir)*
