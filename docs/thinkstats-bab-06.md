> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 6: Fungsi Kepadatan Probabilitas


Kode untuk bab ini ada di `density.py`. Untuk info tentang cara mengunduh dan memakai kode ini, lihat Bagian 0.2.

## 6.1 PDF

Turunan dari sebuah CDF disebut *probability density function* (PDF, fungsi kepadatan probabilitas).

Contohnya, PDF dari distribusi eksponensial adalah

    PDFexpo(x) = λe^(−λx)

PDF dari distribusi normal adalah

    PDFnormal(x) = 1/(σ√(2π)) · exp(−((x−μ)/σ)² / 2)

Mengevaluasi PDF untuk sebuah nilai x tertentu biasanya tidak terlalu berguna. Hasilnya bukan probabilitas; hasilnya adalah kepadatan probabilitas (*probability density*).

Di fisika, densitas adalah massa per satuan volume; untuk mendapatkan massa, kamu harus mengalikan dengan volume atau, kalau densitasnya tidak konstan, kamu harus mengintegralkan atas volume.

Mirip dengan itu, kepadatan probabilitas mengukur probabilitas per satuan x. Untuk mendapatkan massa probabilitas, kamu harus mengintegralkan atas x.

`thinkstats2` menyediakan sebuah kelas bernama `Pdf` yang merepresentasikan fungsi kepadatan probabilitas. Setiap objek `Pdf` menyediakan metode-metode berikut:

- `Density`, yang menerima sebuah nilai, `x`, dan mengembalikan kepadatan distribusi di `x`.
- `Render`, yang mengevaluasi kepadatan di sekumpulan nilai diskret dan mengembalikan sepasang sekuens: nilai-nilai terurut, `xs`, dan kepadatan probabilitasnya, `ds`.
- `MakePmf`, yang mengevaluasi `Density` di sekumpulan nilai diskret dan mengembalikan `Pmf` ternormalisasi yang mengaproksimasi `Pdf`.
- `GetLinspace`, yang mengembalikan sekumpulan titik bawaan yang dipakai `Render` dan `MakePmf`.

`Pdf` adalah *abstract parent class* (kelas induk abstrak), artinya kamu tidak boleh menginstansiasinya langsung; alias, kamu tidak bisa membuat objek `Pdf`. Sebagai gantinya, kamu harus mendefinisikan kelas anak yang mewarisi dari `Pdf` dan menyediakan definisi `Density` dan `GetLinspace`. `Pdf` sudah menyediakan `Render` dan `MakePmf`.

Contohnya, `thinkstats2` menyediakan kelas bernama `NormalPdf` yang mengevaluasi fungsi kepadatan normal.

```python
class NormalPdf(Pdf):
    def __init__(self, mu=0, sigma=1, label=''):
        self.mu = mu
        self.sigma = sigma
        self.label = label

    def Density(self, xs):
        return scipy.stats.norm.pdf(xs, self.mu, self.sigma)

    def GetLinspace(self):
        low, high = self.mu-3*self.sigma, self.mu+3*self.sigma
        return np.linspace(low, high, 101)
```

Objek `NormalPdf` menyimpan parameter `mu` dan `sigma`. `Density` memakai `scipy.stats.norm`, yaitu objek yang merepresentasikan distribusi normal dan menyediakan `cdf` dan `pdf`, di antara metode-metode lainnya (lihat Bagian 5.2).

Contoh berikut membuat `NormalPdf` dengan mean dan varians tinggi badan perempuan dewasa, dalam cm, dari BRFSS (lihat Bagian 5.4). Lalu ia menghitung kepadatan distribusi di lokasi satu simpangan baku dari mean.

```python
>>> mean, var = 163, 52.8
>>> std = math.sqrt(var)
>>> pdf = thinkstats2.NormalPdf(mean, std)
>>> pdf.Density(mean + std)
0.0333001
```

Hasilnya sekitar 0.03, dalam satuan massa probabilitas per cm. Sekali lagi, sebuah kepadatan probabilitas tidak banyak artinya kalau berdiri sendiri. Tapi kalau kita plot `Pdf`-nya, kita bisa melihat bentuk distribusinya:

```python
>>> thinkplot.Pdf(pdf, label='normal')
>>> thinkplot.Show()
```

`thinkplot.Pdf` menggambar `Pdf` sebagai fungsi mulus, berbeda dengan `thinkplot.Pmf` yang me-render `Pmf` sebagai fungsi tangga. Grafik 6.1 menunjukkan hasilnya, plus PDF yang diestimasi dari sebuah sampel — yang akan kita hitung di bagian berikutnya.

*[Grafik 6.1: Sebuah PDF normal yang memodelkan tinggi badan perempuan dewasa di AS, dan estimasi kepadatan kernel dari sebuah sampel dengan n = 500.]*

Kamu bisa memakai `MakePmf` untuk mengaproksimasi `Pdf`:

```python
>>> pmf = pdf.MakePmf()
```

Secara bawaan, `Pmf` yang dihasilkan berisi 101 titik yang berjarak sama dari `mu - 3*sigma` sampai `mu + 3*sigma`. Kalau mau, `MakePmf` dan `Render` bisa menerima argumen keyword `low`, `high`, dan `n`.

::: tip 💡 Konteks Indonesia
BRFSS dan NSFG itu survei nasional Amerika. Padanan terdekatnya di Indonesia: **Susenas** (Survei Sosial Ekonomi Nasional, BPS) dan **Riskesdas** (Riset Kesehatan Dasar, Kemenkes) — pola datanya mirip: ribuan responden, ratusan variabel, dan banyak nilai yang perlu dibersihkan. Satu hal yang perlu dicatat: satuan di buku ini kadang memakai pon (lbs) untuk berat; di Indonesia berat badan/berat lahir biasanya dicatat dalam kg atau gram (misalnya di posyandu dan Riskesdas).
:::

## 6.2 Estimasi kepadatan kernel

*Kernel density estimation* (KDE, estimasi kepadatan kernel) adalah algoritma yang menerima sebuah sampel dan menemukan PDF yang cukup mulus yang cocok dengan data. Kamu bisa baca detailnya di http://en.wikipedia.org/wiki/Kernel_density_estimation.

scipy menyediakan implementasi KDE dan `thinkstats2` menyediakan kelas bernama `EstimatedPdf` yang memakainya:

```python
class EstimatedPdf(Pdf):
    def __init__(self, sample):
        self.kde = scipy.stats.gaussian_kde(sample)

    def Density(self, xs):
        return self.kde.evaluate(xs)
```

`__init__` menerima sebuah sampel dan menghitung estimasi kepadatan kernel. Hasilnya adalah objek `gaussian_kde` yang menyediakan metode `evaluate`.

`Density` menerima sebuah nilai atau sekuens, memanggil `gaussian_kde.evaluate`, dan mengembalikan kepadatan yang dihasilkan. Kata "Gaussian" muncul di namanya karena ia memakai filter berbasis distribusi Gaussian untuk menghaluskan KDE.

Berikut contoh yang membangkitkan sampel dari distribusi normal lalu membuat `EstimatedPdf` untuk mencocokkannya:

```python
>>> sample = [random.gauss(mean, std) for i in range(500)]
>>> sample_pdf = thinkstats2.EstimatedPdf(sample)
>>> thinkplot.Pdf(sample_pdf, label='sample KDE')
```

`sample` adalah list berisi 500 tinggi badan acak. `sample_pdf` adalah objek `Pdf` yang berisi KDE terestimasi dari sampel tersebut.

Grafik 6.1 menunjukkan fungsi kepadatan normal dan KDE berdasarkan sampel 500 tinggi badan acak. Estimasinya cocok dengan distribusi aslinya.

Mengestimasi fungsi kepadatan dengan KDE berguna untuk beberapa keperluan:

- **Visualisasi:** Selama fase eksplorasi sebuah proyek, CDF biasanya adalah visualisasi distribusi yang terbaik. Setelah kamu melihat CDF, kamu bisa memutuskan apakah PDF terestimasi adalah model yang tepat untuk distribusi tersebut. Kalau iya, PDF bisa jadi pilihan yang lebih baik untuk menyajikan distribusi ke audiens yang belum familiar dengan CDF.
- **Interpolasi:** PDF terestimasi adalah cara untuk berpindah dari sampel ke model populasi. Kalau kamu punya alasan untuk percaya bahwa distribusi populasinya mulus, kamu bisa memakai KDE untuk menginterpolasi kepadatan untuk nilai-nilai yang tidak muncul di sampel.
- **Simulasi:** Simulasi sering kali didasarkan pada distribusi sebuah sampel. Kalau ukuran sampelnya kecil, mungkin lebih tepat untuk menghaluskan distribusi sampel memakai KDE, yang memungkinkan simulasi mengeksplorasi lebih banyak kemungkinan hasil, alih-alih sekadar mereplikasi data yang teramati.

## 6.3 Kerangka distribusi

Sampai titik ini kita sudah melihat PMF, CDF, dan PDF; mari luangkan waktu sejenak untuk mereview. Grafik 6.2 menunjukkan bagaimana fungsi-fungsi ini saling berhubungan.

Kita mulai dari PMF, yang merepresentasikan probabilitas untuk sekumpulan nilai diskret. Untuk berpindah dari PMF ke CDF, kamu menjumlahkan massa-massa probabilitas untuk mendapatkan probabilitas kumulatif. Untuk kembali dari CDF ke PMF, kamu menghitung selisih probabilitas kumulatif. Implementasi operasi-operasi ini akan kita lihat di beberapa bagian berikutnya.

PDF adalah turunan dari CDF kontinu; atau, setara dengannya, CDF adalah integral dari PDF. Ingat bahwa PDF memetakan dari nilai ke kepadatan probabilitas; untuk mendapatkan probabilitas, kamu harus mengintegralkan.

Untuk berpindah dari distribusi diskret ke distribusi kontinu, kamu bisa melakukan berbagai macam penghalusan (*smoothing*). Salah satu bentuk penghalusan adalah mengasumsikan bahwa data berasal dari distribusi kontinu analitik (seperti eksponensial atau normal) dan mengestimasi parameter-parameter distribusi tersebut. Pilihan lainnya adalah estimasi kepadatan kernel.

Kebalikan dari penghalusan adalah pendiskretan (*discretizing*, atau kuantisasi). Kalau kamu mengevaluasi PDF di titik-titik diskret, kamu bisa menghasilkan PMF yang merupakan aproksimasi dari PDF. Kamu bisa mendapatkan aproksimasi yang lebih baik memakai integrasi numerik.

Untuk membedakan CDF kontinu dan CDF diskret, mungkin lebih tepat kalau CDF diskret disebut "fungsi massa kumulatif" (*cumulative mass function*), tapi sejauh yang saya tahu tidak ada yang memakai istilah itu.

*[Grafik 6.2: Sebuah kerangka yang menghubungkan berbagai representasi fungsi distribusi — PMF, CDF, dan PDF, versi diskret dan kontinu.]*

## 6.4 Implementasi Hist

Sampai titik ini kamu seharusnya sudah tahu cara memakai tipe-tipe dasar yang disediakan `thinkstats2`: `Hist`, `Pmf`, `Cdf`, dan `Pdf`. Beberapa bagian berikutnya memberikan detail tentang bagaimana mereka diimplementasikan. Materi ini mungkin membantumu memakai kelas-kelas ini dengan lebih efektif, tapi tidak mutlak diperlukan.

`Hist` dan `Pmf` mewarisi dari kelas induk bernama `_DictWrapper`. Garis bawah di depan menandakan bahwa kelas ini "internal"; artinya, ia tidak boleh dipakai oleh kode di modul lain. Namanya menjelaskan apa itu: sebuah pembungkus dictionary. Atribut utamanya adalah `d`, dictionary yang memetakan dari nilai ke frekuensinya.

Nilai-nilainya bisa bertipe *hashable* apapun. Frekuensinya seharusnya integer, tapi bisa bertipe numerik apapun.

`_DictWrapper` berisi metode-metode yang cocok untuk `Hist` maupun `Pmf`, termasuk `__init__`, `Values`, `Items`, dan `Render`. Ia juga menyediakan metode-metode pengubah `Set`, `Incr`, `Mult`, dan `Remove`. Metode-metode ini semuanya diimplementasikan dengan operasi dictionary. Contohnya:

```python
# class _DictWrapper
def Incr(self, x, term=1):
    self.d[x] = self.d.get(x, 0) + term

def Mult(self, x, factor):
    self.d[x] = self.d.get(x, 0) * factor

def Remove(self, x):
    del self.d[x]
```

`Hist` juga menyediakan `Freq`, yang mencari frekuensi sebuah nilai.

Karena operator dan metode `Hist` berbasis dictionary, metode-metode ini adalah operasi waktu konstan; artinya, waktu jalannya tidak bertambah seiring `Hist`-nya membesar.

## 6.5 Implementasi Pmf

`Pmf` dan `Hist` hampir sama, kecuali bahwa `Pmf` memetakan nilai ke probabilitas floating-point, bukan frekuensi integer. Kalau jumlah probabilitasnya 1, `Pmf`-nya ternormalisasi.

`Pmf` menyediakan `Normalize`, yang menghitung jumlah probabilitas lalu membagi semuanya dengan sebuah faktor:

```python
# class Pmf
def Normalize(self, fraction=1.0):
    total = self.Total()
    if total == 0.0:
        raise ValueError('Total probability is zero.')
    factor = float(fraction) / total
    for x in self.d:
        self.d[x] *= factor
    return total
```

`fraction` menentukan jumlah probabilitas setelah dinormalisasi; nilai bawaannya 1. Kalau total probabilitasnya 0, `Pmf` tidak bisa dinormalisasi, jadi `Normalize` melempar `ValueError`.

`Hist` dan `Pmf` punya konstruktor yang sama. Ia bisa menerima argumen berupa dict, `Hist`, `Pmf` atau `Cdf`, sebuah pandas `Series`, list pasangan (nilai, frekuensi), atau sekuens nilai.

Kalau kamu menginstansiasi `Pmf`, hasilnya ternormalisasi. Kalau kamu menginstansiasi `Hist`, tidak. Untuk membuat `Pmf` yang tidak ternormalisasi, kamu bisa membuat `Pmf` kosong lalu memodifikasinya. Metode-metode pengubah `Pmf` tidak menormalisasi ulang `Pmf`.

## 6.6 Implementasi Cdf

CDF memetakan dari nilai ke probabilitas kumulatif, jadi saya sebenarnya bisa mengimplementasikan `Cdf` sebagai `_DictWrapper`. Tapi nilai-nilai di CDF itu terurut sedangkan nilai-nilai di `_DictWrapper` tidak. Selain itu, sering kali berguna untuk menghitung CDF invers; yaitu, pemetaan dari probabilitas kumulatif ke nilai. Jadi implementasi yang saya pilih adalah dua list terurut. Dengan begitu saya bisa memakai *binary search* (pencarian biner) untuk melakukan pencarian maju maupun invers dalam waktu logaritmik.

Konstruktor `Cdf` bisa menerima parameter berupa sekuens nilai atau pandas `Series`, dictionary yang memetakan dari nilai ke probabilitas, sekuens pasangan (nilai, probabilitas), sebuah `Hist`, `Pmf`, atau `Cdf`. Atau kalau diberi dua parameter, ia memperlakukannya sebagai sekuens nilai terurut dan sekuens probabilitas kumulatif yang bersesuaian.

Diberi sekuens, pandas `Series`, atau dictionary, konstruktor membuat sebuah `Hist`. Lalu ia memakai `Hist` itu untuk menginisialisasi atribut-atributnya:

```python
self.xs, freqs = zip(*sorted(dw.Items()))
self.ps = np.cumsum(freqs, dtype=float)
self.ps /= self.ps[-1]
```

> **Catatan penerjemah:** kode asli memakai `dtype=np.float`, yang sudah tidak ada di NumPy modern — diganti `float` tanpa mengubah perilaku.

`xs` adalah list nilai terurut; `freqs` adalah list frekuensi yang bersesuaian. `np.cumsum` menghitung jumlah kumulatif dari frekuensi. Membagi semuanya dengan total frekuensi menghasilkan probabilitas kumulatif. Untuk n nilai, waktu membangun `Cdf` sebanding dengan n log n.

Berikut implementasi `Prob`, yang menerima sebuah nilai dan mengembalikan probabilitas kumulatifnya:

```python
# class Cdf
def Prob(self, x):
    if x < self.xs[0]:
        return 0.0
    index = bisect.bisect(self.xs, x)
    p = self.ps[index - 1]
    return p
```

Modul `bisect` menyediakan implementasi pencarian biner. Dan berikut implementasi `Value`, yang menerima sebuah probabilitas kumulatif dan mengembalikan nilai yang bersesuaian:

```python
# class Cdf
def Value(self, p):
    if p < 0 or p > 1:
        raise ValueError('p must be in range [0, 1]')
    index = bisect.bisect_left(self.ps, p)
    return self.xs[index]
```

Diberi sebuah `Cdf`, kita bisa menghitung `Pmf` dengan menghitung selisih antara probabilitas kumulatif yang berurutan. Kalau kamu memanggil konstruktor `Cdf` dan melewatkan sebuah `Pmf`, ia menghitung selisih dengan memanggil `Cdf.Items`:

```python
# class Cdf
def Items(self):
    a = self.ps
    b = np.roll(a, 1)
    b[0] = 0
    return zip(self.xs, a-b)
```

`np.roll` menggeser elemen-elemen `a` ke kanan, dan "menggulung" elemen terakhir kembali ke awal. Kita mengganti elemen pertama `b` dengan 0 lalu menghitung selisih `a-b`. Hasilnya adalah array NumPy berisi probabilitas.

`Cdf` menyediakan `Shift` dan `Scale`, yang memodifikasi nilai-nilai di `Cdf`, tapi probabilitasnya sebaiknya diperlakukan sebagai *immutable* (tidak bisa diubah).

## 6.7 Momen

Setiap kali kamu mengambil sampel dan mereduksinya menjadi satu angka, angka itu adalah statistik. Statistik-statistik yang sudah kita lihat sejauh ini meliputi mean, varians, median, dan rentang interkuartil.

*Momen mentah* (*raw moment*) adalah sejenis statistik. Kalau kamu punya sampel nilai-nilai, xi, momen mentah ke-k adalah:

    m′k = (1/n) Σᵢ xᵢᵏ

Atau kalau kamu lebih suka notasi Python:

```python
def RawMoment(xs, k):
    return sum(x**k for x in xs) / len(xs)
```

Ketika k = 1 hasilnya adalah mean sampel, x̄. Momen-momen mentah lainnya tidak banyak artinya kalau berdiri sendiri, tapi dipakai di beberapa komputasi.

*Momen pusat* (*central moment*) lebih berguna. Momen pusat ke-k adalah:

    mk = (1/n) Σᵢ (xᵢ − x̄)ᵏ

Atau dalam Python:

```python
def CentralMoment(xs, k):
    mean = RawMoment(xs, 1)
    return sum((x - mean)**k for x in xs) / len(xs)
```

Ketika k = 2 hasilnya adalah momen pusat kedua, yang mungkin kamu kenal sebagai varians. Definisi varians memberi petunjuk kenapa statistik-statistik ini disebut momen. Kalau kita menempelkan beban di sepanjang penggaris di tiap lokasi, xi, lalu memutar penggaris itu mengelilingi mean, *momen inersia* dari beban-beban yang berputar itu adalah varians dari nilai-nilainya. Kalau kamu belum familiar dengan momen inersia, lihat http://en.wikipedia.org/wiki/Moment_of_inertia.

Saat kamu melaporkan statistik berbasis momen, penting untuk memikirkan satuannya. Contohnya, kalau nilai-nilai xi dalam cm, momen mentah pertama juga dalam cm. Tapi momen kedua dalam cm², momen ketiga dalam cm³, dan seterusnya.

Karena satuan-satuan ini, momen susah diinterpretasikan kalau berdiri sendiri. Makanya, untuk momen kedua, umum untuk melaporkan simpangan baku, yaitu akar kuadrat dari varians, sehingga satuannya sama dengan xi.

## 6.8 Kemiringan

*Skewness* (kemiringan) adalah sifat yang menggambarkan bentuk sebuah distribusi. Kalau distribusinya simetris di sekitar tendensi sentralnya, ia tidak miring (*unskewed*). Kalau nilai-nilainya menjulur lebih jauh ke kanan, ia "miring kanan" (*right skewed*); dan kalau menjulur ke kiri, ia "miring kiri" (*left skewed*).

Pemakaian kata "miring" di sini tidak punya konotasi "bias" seperti biasanya. Kemiringan hanya menggambarkan bentuk distribusi; ia tidak mengatakan apa-apa tentang apakah proses sampling-nya mungkin bias.

Beberapa statistik umum dipakai untuk mengukur kemiringan sebuah distribusi. Diberi sekuens nilai-nilai, xi, *kemiringan sampel* (*sample skewness*), g1, bisa dihitung seperti ini:

```python
def StandardizedMoment(xs, k):
    var = CentralMoment(xs, 2)
    std = math.sqrt(var)
    return CentralMoment(xs, k) / std**k

def Skewness(xs):
    return StandardizedMoment(xs, 3)
```

g1 adalah *momen terstandarisasi* (*standardized moment*) ketiga, artinya ia sudah dinormalisasi sehingga tidak punya satuan.

Kemiringan negatif menandakan distribusi miring ke kiri; kemiringan positif menandakan distribusi miring ke kanan. Besarnya g1 menandakan kekuatan kemiringannya, tapi kalau berdiri sendiri ia tidak mudah diinterpretasikan.

Dalam praktik, menghitung kemiringan sampel biasanya bukan ide yang bagus. Kalau ada outlier, mereka punya pengaruh yang tidak proporsional terhadap g1.

Cara lain untuk mengevaluasi asimetri sebuah distribusi adalah melihat hubungan antara mean dan median. Nilai-nilai ekstrem lebih berpengaruh ke mean daripada ke median, jadi di distribusi yang miring ke kiri, mean-nya lebih kecil dari median. Di distribusi yang miring ke kanan, mean-nya lebih besar.

*Koefisien kemiringan median Pearson* (*Pearson's median skewness coefficient*) adalah ukuran kemiringan berdasarkan selisih antara mean dan median sampel:

    gp = 3(x̄ − m) / S

Di mana x̄ adalah mean sampel, m adalah median, dan S adalah simpangan baku. Atau dalam Python:

```python
def Median(xs):
    cdf = thinkstats2.Cdf(xs)
    return cdf.Value(0.5)

def PearsonMedianSkewness(xs):
    median = Median(xs)
    mean = RawMoment(xs, 1)
    var = CentralMoment(xs, 2)
    std = math.sqrt(var)
    gp = 3 * (mean - median) / std
    return gp
```

Statistik ini *robust*, artinya ia kurang rentan terhadap pengaruh outlier.

Sebagai contoh, mari lihat kemiringan berat lahir di data kehamilan NSFG. Berikut kode untuk mengestimasi dan memplot PDF-nya:

```python
live, firsts, others = first.MakeFrames()
data = live.totalwgt_lb.dropna()
pdf = thinkstats2.EstimatedPdf(data)
thinkplot.Pdf(pdf, label='birth weight')
```

*[Grafik 6.3: PDF terestimasi data berat lahir dari NSFG, dengan garis mean dan median.]*

Grafik 6.3 menunjukkan hasilnya. Ekor kirinya tampak lebih panjang dari ekor kanan, jadi kita curiga distribusinya miring ke kiri. Mean-nya, 7.27 lbs, sedikit lebih kecil dari median, 7.38 lbs, jadi itu konsisten dengan kemiringan kiri. Dan kedua koefisien kemiringan negatif: kemiringan sampelnya -0.59; kemiringan median Pearson-nya -0.23.

Sekarang mari bandingkan distribusi ini dengan distribusi berat badan dewasa di BRFSS. Sekali lagi, ini kodenya:

```python
df = brfss.ReadBrfss(nrows=None)
data = df.wtkg2.dropna()
pdf = thinkstats2.EstimatedPdf(data)
thinkplot.Pdf(pdf, label='adult weight')
```

*[Grafik 6.4: PDF terestimasi data berat badan dewasa dari BRFSS, dengan garis mean dan median.]*

Grafik 6.4 menunjukkan hasilnya. Distribusinya tampak miring ke kanan. Benar saja, mean-nya, 79.0, lebih besar dari median, 77.3. Kemiringan sampelnya 1.1 dan kemiringan median Pearson-nya 0.26.

Tanda koefisien kemiringan menandakan apakah distribusinya miring ke kiri atau kanan, tapi selain itu, mereka susah diinterpretasikan. Kemiringan sampel kurang robust; artinya, ia lebih rentan terhadap outlier. Akibatnya ia kurang bisa diandalkan saat diterapkan ke distribusi yang miring, padahal justru di situlah ia paling relevan.

Kemiringan median Pearson didasarkan pada mean dan varians yang dihitung, jadi ia juga rentan terhadap outlier, tapi karena ia tidak bergantung pada momen ketiga, ia agak lebih robust.

::: tip 💡 Konteks Indonesia
Berat lahir di buku ini dicatat dalam pon (lbs) — 7.27 lbs itu sekitar 3.3 kg. Di Indonesia, berat lahir dicatat dalam gram (misalnya di data Riskesdas dan buku KIA posyandu), jadi angkanya terlihat seperti 3300 gram. Pola kemiringan kirinya pun familiar: bayi berat lahir rendah (prematur/BBLR) menciptakan ekor panjang di kiri, sementara batas atas berat lahir relatif "mentok" — persis seperti yang terlihat di Grafik 6.3.
:::

## 6.9 Latihan

Solusi untuk latihan ini ada di `chap06soln.py`.

**Latihan 6.1** Distribusi pendapatan terkenal miring ke kanan. Di latihan ini, kita akan mengukur seberapa kuat kemiringan itu.

*Current Population Survey* (CPS) adalah kerja sama Biro Statistik Tenaga Kerja dan Biro Sensus AS untuk mempelajari pendapatan dan variabel terkait. Data yang dikumpulkan tahun 2013 tersedia di http://www.census.gov/hhes/www/cpstables/032013/hhinc/toc.htm. Saya mengunduh `hinc06.xls`, yaitu spreadsheet Excel berisi informasi tentang pendapatan rumah tangga, dan mengonversinya menjadi `hinc06.csv`, file CSV yang akan kamu temukan di repositori buku ini. Kamu juga akan menemukan `hinc2.py`, yang membaca file ini dan mentransformasi datanya.

Dataset ini berbentuk serangkaian rentang pendapatan dan jumlah responden yang masuk di tiap rentang. Rentang terendah mencakup responden yang melaporkan pendapatan rumah tangga tahunan "Under $5000." Rentang tertinggi mencakup responden yang berpenghasilan "$250,000 or more."

Untuk mengestimasi mean dan statistik lainnya dari data ini, kita harus membuat beberapa asumsi tentang batas bawah dan atas, dan tentang bagaimana nilai-nilai tersebar di tiap rentang. `hinc2.py` menyediakan `InterpolateSample`, yang menunjukkan salah satu cara memodelkan data ini. Ia menerima DataFrame dengan kolom `income`, yang berisi batas atas tiap rentang, dan `freq`, yang berisi jumlah responden di tiap rentang.

Ia juga menerima `log_upper`, yaitu asumsi batas atas untuk rentang tertinggi, dinyatakan dalam log10 dolar. Nilai bawaan, `log_upper=6.0`, merepresentasikan asumsi bahwa pendapatan terbesar di antara responden adalah 10⁶, atau satu juta dolar.

`InterpolateSample` menghasilkan *pseudo-sample* (sampel semu); yaitu, sampel pendapatan rumah tangga yang menghasilkan jumlah responden yang sama di tiap rentang seperti data aslinya. Ia mengasumsikan bahwa pendapatan di tiap rentang berjarak sama dalam skala log10.

Hitung median, mean, kemiringan (*skewness*), dan kemiringan Pearson dari sampel yang dihasilkan. Berapa fraksi rumah tangga yang melaporkan pendapatan kena pajak di bawah mean? Bagaimana hasilnya bergantung pada asumsi batas atas?

::: tip 💡 Konteks Indonesia
CPS adalah surveinya orang Amerika. Padanan Indonesianya untuk data pendapatan rumah tangga adalah **Susenas** (BPS) — datanya juga disajikan per rentang pengeluaran/pendapatan, dan distribusinya sama-sama miring ke kanan: sebagian besar rumah tangga menumpuk di pendapatan menengah-bawah, sementara segelintir berpenghasilan sangat tinggi menarik mean jauh ke atas median. Jadi pola di latihan ini bukan khas Amerika — di Indonesia pun bentuknya mirip.
:::

## 6.10 Glosarium

- *Probability density function* (PDF, fungsi kepadatan probabilitas): turunan dari CDF kontinu, fungsi yang memetakan sebuah nilai ke kepadatan probabilitasnya.
- *Probability density* (kepadatan probabilitas): besaran yang bisa diintegralkan atas rentang nilai untuk menghasilkan probabilitas. Kalau nilainya dalam satuan cm, misalnya, kepadatan probabilitas satuannya probabilitas per cm.
- *Kernel density estimation* (KDE, estimasi kepadatan kernel): algoritma yang mengestimasi PDF berdasarkan sebuah sampel.
- *discretize* (mendiskretkan): mengaproksimasi fungsi atau distribusi kontinu dengan fungsi diskret. Kebalikan dari penghalusan.
- *raw moment* (momen mentah): statistik berdasarkan jumlah data yang dipangkatkan.
- *central moment* (momen pusat): statistik berdasarkan simpangan dari mean yang dipangkatkan.
- *standardized moment* (momen terstandarisasi): rasio momen-momen yang tidak punya satuan.
- *skewness* (kemiringan): ukuran seberapa asimetris sebuah distribusi.
- *sample skewness* (kemiringan sampel): statistik berbasis momen yang dimaksudkan untuk mengukur kemiringan sebuah distribusi.
- *Pearson's median skewness coefficient* (koefisien kemiringan median Pearson): statistik yang dimaksudkan untuk mengukur kemiringan sebuah distribusi berdasarkan median, mean, dan simpangan baku.
- *robust*: sebuah statistik disebut robust kalau relatif kebal terhadap pengaruh outlier.

---

**Selanjutnya:** [Bab 7: Hubungan Antar Variabel](/thinkstats-bab-07) *(segera hadir)*
