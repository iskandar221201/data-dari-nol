> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 14: Metode Analitik

Buku ini berfokus pada metode komputasional seperti simulasi dan *resampling*, tapi beberapa masalah yang sudah kita selesaikan sebenarnya punya solusi analitik yang bisa jauh lebih cepat.

Di bab ini saya paparkan beberapa metode itu, dan jelaskan cara kerjanya. Di akhir bab, saya kasih saran cara menggabungkan metode komputasional dan analitik untuk analisis data eksploratif.

Kode di bab ini ada di `normal.py`. Info soal mengunduh dan memakai kodenya, lihat Bagian 0.2.

## 14.1 Distribusi normal

Sebagai contoh pemantik, mari kita tinjau lagi masalah dari Bagian 8.3: anggap kamu seorang ilmuwan yang meneliti gorila di sebuah cagar alam. Setelah menimbang 9 gorila, kamu dapat rata-rata sampel x̄ = 90 kg dan simpangan baku sampel, S = 7,5 kg. Kalau kamu pakai x̄ untuk mengestimasi rata-rata populasi, berapa *standard error* (galat baku) dari estimasi itu?

Untuk menjawabnya, kita butuh *sampling distribution* (distribusi sampling) dari x̄. Di Bagian 8.3 kita mengaproksimasi distribusi ini dengan mensimulasikan eksperimennya (menimbang 9 gorila), menghitung x̄ untuk tiap eksperimen simulasi, dan mengumpulkan distribusi hasil estimasinya.

Hasilnya adalah aproksimasi dari distribusi sampling. Lalu kita pakai distribusi sampling itu untuk menghitung galat baku dan interval kepercayaan:

1. Simpangan baku dari distribusi sampling adalah galat baku dari estimasi; di contoh ini besarnya sekitar 2,5 kg.
2. Interval antara persentil ke-5 dan ke-95 dari distribusi sampling adalah interval kepercayaan 90%. Kalau eksperimennya diulang berkali-kali, kita berharap estimasinya jatuh di interval ini 90% dari waktu yang ada. Di contoh ini, CI 90%-nya adalah (86, 94) kg.

Sekarang kita akan melakukan perhitungan yang sama secara analitik. Kita manfaatkan fakta bahwa berat gorila betina dewasa kira-kira berdistribusi normal.

Distribusi normal punya dua sifat yang membuatnya enak dianalisis: mereka "tertutup" (*closed*) terhadap transformasi linear dan terhadap penjumlahan. Untuk menjelaskan maksudnya, saya butuh sedikit notasi.

Kalau distribusi suatu besaran, X, adalah normal dengan parameter µ dan σ, kamu bisa menuliskannya

```
X ∼ N(µ, σ²)
```

di mana simbol ∼ artinya "berdistribusi" dan huruf N artinya "normal".

Transformasi linear dari X adalah sesuatu seperti X₀ = aX + b, di mana a dan b adalah bilangan real. Sebuah keluarga distribusi disebut tertutup terhadap transformasi linear kalau X₀ termasuk keluarga yang sama dengan X. Distribusi normal punya sifat ini; kalau

```
X ∼ N(µ, σ²)
```

maka

```
X₀ ∼ N(aµ + b, a²σ²)                                          (1)
```

Distribusi normal juga tertutup terhadap penjumlahan. Kalau Z = X + Y dan

```
X ∼ N(µX, σX²)  dan  Y ∼ N(µY, σY²)
```

maka

```
Z ∼ N(µX + µY, σX² + σY²)
```

Dalam kasus khusus Z = X + X, kita dapat

```
Z ∼ N(2µX, 2σX²)                                             (2)
```

dan secara umum kalau kita mengambil n nilai dari X lalu menjumlahkannya, kita dapat

```
Z ∼ N(nµX, nσX²)                                             (3)
```

## 14.2 Distribusi sampling

Sekarang kita punya semua yang dibutuhkan untuk menghitung distribusi sampling dari x̄. Ingat bahwa kita menghitung x̄ dengan menimbang n gorila, menjumlahkan berat totalnya, lalu membagi dengan n.

Asumsikan distribusi berat gorila, X, kira-kira normal:

```
X ∼ N(µ, σ²)
```

Kalau kita menimbang n gorila, berat totalnya, Y, berdistribusi

```
Y ∼ N(nµ, nσ²)
```

dengan Persamaan 3. Dan kalau dibagi dengan n, rata-rata sampelnya, Z, berdistribusi

```
Z ∼ N(µ, σ²/n)
```

dengan Persamaan 1 memakai a = 1/n.

Distribusi dari Z inilah distribusi sampling dari x̄. Rata-rata dari Z adalah µ, yang menunjukkan bahwa x̄ adalah estimasi tak bias dari µ. Varians dari distribusi sampling adalah σ²/n.

Jadi simpangan baku dari distribusi sampling, yaitu galat baku dari estimasi, adalah σ/√n. Di contoh kita, σ adalah 7,5 kg dan n adalah 9, jadi galat bakunya 2,5 kg. Hasil ini konsisten dengan yang kita estimasi lewat simulasi, tapi jauh lebih cepat dihitung!

Kita juga bisa memakai distribusi sampling untuk menghitung interval kepercayaan. Interval kepercayaan 90% untuk x̄ adalah interval antara persentil ke-5 dan ke-95 dari Z. Karena Z berdistribusi normal, kita bisa menghitung persentil dengan mengevaluasi *inverse CDF* (CDF invers).

Tidak ada bentuk tertutup (*closed form*) untuk CDF dari distribusi normal atau inversnya, tapi ada metode numerik yang cepat, dan sudah diimplementasikan di SciPy, seperti yang kita lihat di Bagian 5.2. `thinkstats2` menyediakan fungsi *wrapper* yang membuat fungsi SciPy itu sedikit lebih gampang dipakai:

```python
def EvalNormalCdfInverse(p, mu=0, sigma=1):
    return scipy.stats.norm.ppf(p, loc=mu, scale=sigma)
```

Diberi sebuah probabilitas, p, fungsi ini mengembalikan persentil yang sesuai dari distribusi normal dengan parameter mu dan sigma. Untuk interval kepercayaan 90% dari x̄, kita hitung persentil ke-5 dan ke-95 seperti ini:

```python
>>> thinkstats2.EvalNormalCdfInverse(0.05, mu=90, sigma=2.5)
85.888
>>> thinkstats2.EvalNormalCdfInverse(0.95, mu=90, sigma=2.5)
94.112
```

Jadi kalau eksperimennya dijalankan berkali-kali, kita berharap estimasi x̄ jatuh di rentang (85,9; 94,1) sekitar 90% dari waktu yang ada. Sekali lagi, ini konsisten dengan hasil yang kita dapat lewat simulasi.

## 14.3 Merepresentasikan distribusi normal

Supaya perhitungan-perhitungan ini lebih gampang, saya bikin kelas bernama `Normal` yang merepresentasikan distribusi normal dan mengenkodekan persamaan-persamaan di bagian sebelumnya. Bentuknya seperti ini:

```python
class Normal:
    def __init__(self, mu, sigma2):
        self.mu = mu
        self.sigma2 = sigma2

    def __str__(self):
        return 'N(%g, %g)' % (self.mu, self.sigma2)
```

Jadi kita bisa menginstansiasi sebuah `Normal` yang merepresentasikan distribusi berat gorila:

```python
>>> dist = Normal(90, 7.5**2)
>>> dist
N(90, 56.25)
```

> **Catatan penerjemah:** kode asli buku ini ditulis era Python 2 (mis. `class Normal(object)` dan method `__div__`). Di bawah ini sudah dimodernisasi ke Python 3 — yang paling penting, method pembagian ditulis sebagai `__truediv__`, karena di Python 3 itulah method yang dipanggil saat kamu menulis `dist / 9`.

`Normal` menyediakan `Sum`, yang menerima ukuran sampel, n, dan mengembalikan distribusi dari jumlah n nilai, memakai Persamaan 3:

```python
    def Sum(self, n):
        return Normal(n * self.mu, n * self.sigma2)
```

`Normal` juga tahu cara mengalikan dan membagi memakai Persamaan 1:

```python
    def __mul__(self, factor):
        return Normal(factor * self.mu, factor**2 * self.sigma2)

    def __truediv__(self, divisor):
        return 1 / divisor * self
```

Jadi kita bisa menghitung distribusi sampling dari rata-rata dengan ukuran sampel 9:

```python
>>> dist_xbar = dist.Sum(9) / 9
>>> dist_xbar.sigma
2.5
```

Simpangan baku dari distribusi sampling adalah 2,5 kg, seperti yang kita lihat di bagian sebelumnya. Terakhir, `Normal` menyediakan `Percentile`, yang bisa kita pakai untuk menghitung interval kepercayaan:

```python
>>> dist_xbar.Percentile(5), dist_xbar.Percentile(95)
85.888 94.113
```

Dan itu jawaban yang sama seperti sebelumnya. Kita akan pakai kelas `Normal` lagi nanti, tapi sebelum lanjut, kita butuh satu analisis lagi.

## 14.4 Teorema limit pusat

Seperti yang kita lihat di bagian-bagian sebelumnya, kalau kita menjumlahkan nilai-nilai yang diambil dari distribusi normal, distribusi dari jumlahnya juga normal. Kebanyakan distribusi lain tidak punya sifat ini; kalau kita menjumlahkan nilai-nilai yang diambil dari distribusi lain, jumlahnya umumnya tidak punya distribusi analitik.

Tapi kalau kita menjumlahkan n nilai dari hampir semua distribusi, distribusi dari jumlah itu konvergen ke normal seiring n membesar.

Lebih spesifiknya, kalau distribusi nilai-nilainya punya rata-rata dan simpangan baku µ dan σ, distribusi dari jumlahnya kira-kira N(nµ, nσ²).

Hasil ini adalah *Central Limit Theorem* (CLT, Teorema Limit Pusat). Ini salah satu perkakas paling berguna untuk analisis statistik, tapi ada beberapa catatan:

- Nilai-nilainya harus diambil secara independen. Kalau mereka berkorelasi, CLT tidak berlaku (walau dalam praktik ini jarang jadi masalah).
- Nilai-nilainya harus berasal dari distribusi yang sama (walau syarat ini bisa dilonggarkan).
- Nilai-nilainya harus diambil dari distribusi yang punya rata-rata dan varians berhingga. Jadi kebanyakan distribusi Pareto gugur di sini.
- Kecepatan konvergensinya tergantung pada *skewness* (kemiringan) distribusinya. Jumlah dari distribusi eksponensial konvergen untuk n yang kecil. Jumlah dari distribusi lognormal butuh ukuran yang lebih besar.

Teorema Limit Pusat menjelaskan kenapa distribusi normal begitu banyak di dunia nyata. Banyak karakteristik makhluk hidup dipengaruhi oleh faktor genetik dan lingkungan yang efeknya aditif. Karakteristik yang kita ukur adalah jumlah dari sekian banyak efek kecil, jadi distribusinya cenderung normal.

::: tip 💡 Konteks Indonesia
Contoh gorila di atas memang jauh — tapi mekanismenya persis seperti yang kamu temui di sini: rata-rata nilai UTBK sebuah sekolah, rata-rata berat gabah per karung di pasar induk, atau rata-rata tinggi badan siswa satu angkatan. Semua itu adalah "jumlah dari sekian banyak efek kecil" (genetik, gizi, lingkungan, usaha belajar) — makanya bentuknya cenderung normal. Dan kalau kamu mengambil rata-rata dari sampel acak, rata-rata itu sendiri juga berdistribusi normal, berkat CLT. Ini alasan kenapa interval kepercayaan dari Bab 8 bisa dipakai luas.
:::

## 14.5 Menguji CLT

Untuk melihat cara kerja Teorema Limit Pusat, dan kapan dia tidak bekerja, mari kita coba beberapa eksperimen. Pertama, kita coba distribusi eksponensial:

```python
def MakeExpoSamples(beta=2.0, iters=1000):
    samples = []
    for n in [1, 10, 100]:
        sample = [np.sum(np.random.exponential(beta, n))
                  for _ in range(iters)]
        samples.append((n, sample))
    return samples
```

`MakeExpoSamples` membangkitkan sampel dari jumlah nilai-nilai eksponensial (saya pakai "nilai eksponensial" sebagai singkatan dari "nilai dari distribusi eksponensial"). `beta` adalah parameter distribusinya; `iters` adalah jumlah penjumlahan yang dibangkitkan.

Untuk menjelaskan fungsi ini, saya mulai dari dalam lalu keluar. Setiap kali kita memanggil `np.random.exponential`, kita dapat sederet n nilai eksponensial dan menghitung jumlahnya. `sample` adalah list dari jumlah-jumlah ini, dengan panjang `iters`.

Gampang ketuker antara n dan iters: n adalah jumlah suku di tiap penjumlahan; iters adalah jumlah penjumlahan yang kita hitung untuk mengkarakterisasi distribusi dari jumlah-jumlah itu.

Nilai kembaliannya adalah list pasangan (n, sample). Untuk tiap pasangan, kita bikin *normal probability plot* (plot probabilitas normal):

```python
def NormalPlotSamples(samples, plot=1, ylabel=''):
    for n, sample in samples:
        thinkplot.SubPlot(plot)
        thinkstats2.NormalProbabilityPlot(sample)
        thinkplot.Config(title='n=%d' % n, ylabel=ylabel)
        plot += 1
```

`NormalPlotSamples` menerima list pasangan dari `MakeExpoSamples` dan membangkitkan sederet normal probability plot.

*[Grafik 14.1: Distribusi dari jumlah nilai eksponensial (baris atas) dan nilai lognormal (baris bawah), untuk n = 1, 10, dan 100.]*

Grafik 14.1 (baris atas) menunjukkan hasilnya. Dengan n=1, distribusi dari jumlahnya masih eksponensial, jadi normal probability plot-nya bukan garis lurus. Tapi dengan n=10 distribusi dari jumlahnya sudah kira-kira normal, dan dengan n=100 nyaris tidak bisa dibedakan dari normal.

Grafik 14.1 (baris bawah) menunjukkan hasil serupa untuk distribusi lognormal. Distribusi lognormal umumnya lebih menceng daripada distribusi eksponensial, jadi distribusi dari jumlahnya butuh waktu lebih lama untuk konvergen. Dengan n=10 normal probability plot-nya masih jauh dari lurus, tapi dengan n=100 sudah kira-kira normal.

Distribusi Pareto bahkan lebih menceng daripada lognormal. Tergantung parameternya, banyak distribusi Pareto yang tidak punya rata-rata dan varians berhingga. Akibatnya, Teorema Limit Pusat tidak berlaku. Grafik 14.2 (baris atas) menunjukkan distribusi dari jumlah nilai-nilai Pareto. Bahkan dengan n=100, normal probability plot-nya masih jauh dari lurus.

*[Grafik 14.2: Distribusi dari jumlah nilai Pareto (baris atas) dan nilai eksponensial yang berkorelasi (baris bawah), untuk n = 1, 10, dan 100.]*

Saya juga menyebutkan bahwa CLT tidak berlaku kalau nilai-nilainya berkorelasi. Untuk mengujinya, saya membangkitkan nilai-nilai berkorelasi dari distribusi eksponensial. Algoritme untuk membangkitkan nilai berkorelasi adalah (1) membangkitkan nilai normal yang berkorelasi, (2) memakai CDF normal untuk mentransformasi nilai-nilainya ke uniform, dan (3) memakai CDF invers eksponensial untuk mentransformasi nilai uniform itu ke eksponensial.

`GenerateCorrelated` mengembalikan sebuah *iterator* dari n nilai normal dengan korelasi serial `rho`:

```python
def GenerateCorrelated(rho, n):
    x = random.gauss(0, 1)
    yield x
    sigma = math.sqrt(1 - rho**2)
    for _ in range(n-1):
        x = random.gauss(x*rho, sigma)
        yield x
```

Nilai pertama adalah nilai normal standar. Tiap nilai berikutnya bergantung pada pendahulunya: kalau nilai sebelumnya adalah x, rata-rata dari nilai berikutnya adalah x*rho, dengan varians 1-rho**2. Perhatikan bahwa `random.gauss` menerima simpangan baku sebagai argumen kedua, bukan varians.

`GenerateExpoCorrelated` mengambil sederet nilai yang dihasilkan dan mentransformasinya ke eksponensial:

```python
def GenerateExpoCorrelated(rho, n):
    normal = list(GenerateCorrelated(rho, n))
    uniform = scipy.stats.norm.cdf(normal)
    expo = scipy.stats.expon.ppf(uniform)
    return expo
```

`normal` adalah list nilai normal yang berkorelasi. `uniform` adalah sederet nilai uniform antara 0 dan 1. `expo` adalah sederet nilai eksponensial yang berkorelasi. `ppf` adalah singkatan dari "*percent point function*" (fungsi titik persentil), nama lain dari CDF invers.

Grafik 14.2 (baris bawah) menunjukkan distribusi dari jumlah nilai eksponensial berkorelasi dengan rho=0,9. Korelasi memperlambat laju konvergensi; tapi dengan n=100, normal probability plot-nya nyaris lurus. Jadi walau CLT tidak berlaku secara ketat saat nilai-nilainya berkorelasi, korelasi sedang jarang jadi masalah dalam praktik.

Eksperimen-eksperimen ini dimaksudkan untuk menunjukkan cara kerja Teorema Limit Pusat, dan apa yang terjadi saat dia tidak bekerja. Sekarang mari kita lihat cara memakainya.

## 14.6 Menerapkan CLT

Untuk melihat kenapa Teorema Limit Pusat berguna, mari kita kembali ke contoh di Bagian 9.3: menguji perbedaan rata-rata lama kehamilan yang terlihat antara bayi pertama dan bayi berikutnya. Seperti yang sudah kita lihat, perbedaan yang terlihat sekitar 0,078 minggu:

```python
>>> live, firsts, others = first.MakeFrames()
>>> delta = firsts.prglngth.mean() - others.prglngth.mean()
0.078
```

Ingat logika uji hipotesis: kita menghitung *p-value* (nilai-p), yaitu probabilitas perbedaan yang teramati di bawah hipotesis nol; kalau dia kecil, kita simpulkan bahwa perbedaan yang teramati kecil kemungkinannya disebabkan kebetulan.

Di contoh ini, hipotesis nol-nya adalah bahwa distribusi lama kehamilan sama untuk bayi pertama dan bayi lainnya. Jadi kita bisa menghitung distribusi sampling dari rata-rata seperti ini:

```python
dist1 = SamplingDistMean(live.prglngth, len(firsts))
dist2 = SamplingDistMean(live.prglngth, len(others))
```

Kedua distribusi sampling didasarkan pada populasi yang sama, yaitu kumpulan semua kelahiran hidup. `SamplingDistMean` menerima sederet nilai ini dan ukuran sampelnya, lalu mengembalikan objek `Normal` yang merepresentasikan distribusi sampling:

```python
def SamplingDistMean(data, n):
    mean, var = data.mean(), data.var()
    dist = Normal(mean, var)
    return dist.Sum(n) / n
```

`mean` dan `var` adalah rata-rata dan varians dari data. Kita mengaproksimasi distribusi datanya dengan distribusi normal, `dist`.

Di contoh ini, datanya tidak berdistribusi normal, jadi aproksimasi ini tidak terlalu bagus. Tapi kemudian kita menghitung `dist.Sum(n) / n`, yaitu distribusi sampling dari rata-rata n nilai. Walau datanya tidak berdistribusi normal, distribusi sampling dari rata-ratanya normal, menurut Teorema Limit Pusat.

Selanjutnya, kita hitung distribusi sampling dari perbedaan rata-ratanya. Kelas `Normal` tahu cara melakukan pengurangan memakai Persamaan 2:

```python
def __sub__(self, other):
    return Normal(self.mu - other.mu,
                  self.sigma2 + other.sigma2)
```

Jadi kita bisa menghitung distribusi sampling dari perbedaannya seperti ini:

```python
>>> dist = dist1 - dist2
N(0, 0.0032)
```

Rata-ratanya 0, yang masuk akal karena kita berharap dua sampel dari distribusi yang sama punya rata-rata yang sama, secara rata-rata. Varians dari distribusi sampling adalah 0,0032.

`Normal` menyediakan `Prob`, yang mengevaluasi CDF normal. Kita bisa pakai `Prob` untuk menghitung probabilitas perbedaan sebesar `delta` di bawah hipotesis nol:

```python
>>> 1 - dist.Prob(delta)
0.084
```

Artinya nilai-p untuk uji satu arah adalah 0,084. Untuk uji dua arah kita juga menghitung

```python
>>> dist.Prob(-delta)
0.084
```

yang hasilnya sama karena distribusi normal simetris. Jumlah dari kedua ekornya adalah 0,168, yang konsisten dengan estimasi di Bagian 9.3, yaitu 0,17.

## 14.7 Uji korelasi

Di Bagian 9.5 kita memakai uji permutasi untuk korelasi antara berat lahir dan usia ibu, dan menemukan bahwa korelasinya signifikan secara statistik, dengan nilai-p kurang dari 0,001.

Sekarang kita bisa melakukan hal yang sama secara analitik. Metodenya didasarkan pada hasil matematis ini: diberi dua variabel yang berdistribusi normal dan tidak berkorelasi, kalau kita membangkitkan sampel berukuran n, menghitung korelasi Pearson, r, lalu menghitung korelasi yang ditransformasi

```
t = r × √((n−2) / (1−r²))
```

maka distribusi dari t adalah *Student's t-distribution* (distribusi-t Student) dengan parameter n−2. Distribusi-t adalah distribusi analitik; CDF-nya bisa dihitung secara efisien memakai fungsi gamma.

Kita bisa memakai hasil ini untuk menghitung distribusi sampling dari korelasi di bawah hipotesis nol; artinya, kalau kita membangkitkan sederet nilai normal yang tidak berkorelasi, bagaimana distribusi korelasinya? `StudentCdf` menerima ukuran sampel, n, dan mengembalikan distribusi sampling dari korelasi:

```python
def StudentCdf(n):
    ts = np.linspace(-3, 3, 101)
    ps = scipy.stats.t.cdf(ts, df=n-2)
    rs = ts / np.sqrt(n - 2 + ts**2)
    return thinkstats2.Cdf(rs, ps)
```

`ts` adalah array NumPy berisi nilai-nilai untuk t, korelasi yang ditransformasi. `ps` berisi probabilitas yang sesuai, dihitung memakai CDF dari distribusi-t Student yang diimplementasikan di SciPy. Parameter dari distribusi-t, `df`, adalah singkatan dari "*degrees of freedom*" (derajat kebebasan). Saya tidak akan menjelaskan istilah itu, tapi kamu bisa membacanya di http://en.wikipedia.org/wiki/Degrees_of_freedom_(statistics).

Untuk beralih dari `ts` ke koefisien korelasi, `rs`, kita terapkan transformasi inversnya,

```
r = t / √(n − 2 + t²)
```

Hasilnya adalah distribusi sampling dari r di bawah hipotesis nol. Grafik 14.3 menunjukkan distribusi ini beserta distribusi yang kita bangkitkan di Bagian 9.5 lewat *resampling*. Keduanya nyaris identik. Walau distribusi aktualnya tidak normal, koefisien korelasi Pearson didasarkan pada rata-rata dan varians sampel. Menurut Teorema Limit Pusat, statistik berbasis momen seperti ini berdistribusi normal walau datanya tidak.

*[Grafik 14.3: Distribusi sampling dari korelasi untuk variabel-variabel normal yang tidak berkorelasi; kurva "Student t" (analitik) dibandingkan dengan hasil "sample" (resampling).]*

Dari Grafik 14.3, kita bisa melihat bahwa korelasi yang teramati, 0,07, kecil kemungkinannya terjadi kalau variabel-variabelnya sebenarnya tidak berkorelasi. Memakai distribusi analitik, kita bisa menghitung seberapa kecil kemungkinan itu:

```python
t = r * math.sqrt((n-2) / (1-r**2))
p_value = 1 - scipy.stats.t.cdf(t, df=n-2)
```

Kita hitung nilai t yang sesuai dengan r=0,07, lalu evaluasi distribusi-t di t. Hasilnya adalah 2.9e-11. Contoh ini menunjukkan keunggulan metode analitik: kita bisa menghitung nilai-p yang sangat kecil. Tapi dalam praktik biasanya tidak terlalu penting.

## 14.8 Uji chi-kuadrat

Di Bagian 9.7 kita memakai statistik chi-kuadrat untuk menguji apakah sebuah dadu bengkok. Statistik chi-kuadrat mengukur total deviasi ternormalisasi dari nilai-nilai yang diharapkan dalam sebuah tabel:

```
χ² = Σ (Oi − Ei)² / Ei
```

Salah satu alasan statistik chi-kuadrat dipakai luas adalah karena distribusi sampling-nya di bawah hipotesis nol bersifat analitik; karena sebuah kebetulan yang luar biasa¹, distribusi itu disebut distribusi chi-kuadrat. Seperti distribusi-t, CDF chi-kuadrat bisa dihitung secara efisien memakai fungsi gamma.

SciPy menyediakan implementasi distribusi chi-kuadrat, yang kita pakai untuk menghitung distribusi sampling dari statistik chi-kuadrat:

```python
def ChiSquaredCdf(n):
    xs = np.linspace(0, 25, 101)
    ps = scipy.stats.chi2.cdf(xs, df=n-1)
    return thinkstats2.Cdf(xs, ps)
```

*[Grafik 14.4: Distribusi sampling dari statistik chi-kuadrat untuk dadu enam sisi yang adil; kurva "chi squared" (analitik) dibandingkan dengan hasil "sample" (resampling).]*

Grafik 14.4 menunjukkan hasil analitik beserta distribusi yang kita dapat lewat *resampling*. Keduanya sangat mirip, terutama di bagian ekor, yaitu bagian yang biasanya paling kita pedulikan.

Kita bisa memakai distribusi ini untuk menghitung nilai-p dari statistik uji yang teramati, `chi2`:

```python
p_value = 1 - scipy.stats.chi2.cdf(chi2, df=n-1)
```

Hasilnya adalah 0,041, yang konsisten dengan hasil dari Bagian 9.7.

Parameter dari distribusi chi-kuadrat sekali lagi adalah "derajat kebebasan". Dalam kasus ini parameter yang benar adalah n−1, di mana n adalah ukuran tabelnya, 6. Memilih parameter ini bisa tricky; sejujurnya, saya tidak pernah yakin sudah benar sampai saya membangkitkan sesuatu seperti Grafik 14.4 untuk membandingkan hasil analitik dengan hasil *resampling*.

¹ Sebenarnya enggak juga.

::: tip 💡 Konteks Indonesia
Uji chi-kuadrat ini gampang kamu praktikkan sendiri: ambil satu dadu dari set ludo atau ular tangga di rumah, lempar 120 kali, catat berapa kali tiap sisi muncul. Kalau dadunya adil, tiap sisi mestinya muncul ~20 kali. Selisihnya dari angka harapan itu yang diukur statistik chi-kuadrat — dan uji di atas memberi tahu kamu apakah dadu itu "bengkok" atau selisihnya masih wajar karena kebetulan. Logika yang sama dipakai survei Indonesia untuk menguji apakah jawaban responden terdistribusi merata atau ada pola mencurigakan.
:::

## 14.9 Diskusi

Buku ini berfokus pada metode komputasional seperti *resampling* dan permutasi. Metode-metode ini punya beberapa keunggulan dibanding analisis:

- **Lebih gampang dijelaskan dan dipahami.** Contohnya, salah satu topik tersulit di kelas statistik pengantar adalah uji hipotesis. Banyak mahasiswa yang tidak benar-benar paham apa itu nilai-p. Saya rasa pendekatan yang saya sajikan di Bab 9 — mensimulasikan hipotesis nol dan menghitung statistik uji — membuat ide dasarnya lebih jelas.
- **Kokoh dan serbaguna.** Metode analitik sering didasarkan pada asumsi yang mungkin tidak terpenuhi dalam praktik. Metode komputasional butuh asumsi yang lebih sedikit, dan lebih gampang diadaptasi dan diperluas.
- **Bisa di-debug.** Metode analitik sering seperti kotak hitam: kamu masukkan angka dan dia mengeluarkan hasil. Tapi gampang bikin kesalahan halus, susah yakin hasilnya benar, dan susah menemukan masalahnya kalau ternyata salah. Metode komputasional mendukung pengembangan dan pengujian bertahap, yang menumbuhkan kepercayaan terhadap hasilnya.

Tapi ada satu kekurangan: metode komputasional bisa lambat. Dengan mempertimbangkan plus-minusnya, saya merekomendasikan proses berikut:

1. Pakai metode komputasional selama eksplorasi. Kalau kamu dapat jawaban yang memuaskan dan waktu jalannya bisa diterima, kamu bisa berhenti.
2. Kalau waktu jalannya tidak bisa diterima, cari peluang untuk optimasi. Memakai metode analitik adalah salah satu dari beberapa cara optimasi.
3. Kalau mengganti metode komputasional dengan metode analitik memang tepat, pakai metode komputasional sebagai pembanding, sehingga ada validasi timbal balik antara hasil komputasional dan analitik.

Untuk sebagian besar masalah yang pernah saya kerjakan, saya tidak perlu melangkah melewati Langkah 1.

## 14.10 Latihan

Solusi dari latihan-latihan ini ada di `chap14soln.py`.

**Latihan 14.1** Di Bagian 5.4, kita melihat bahwa distribusi berat badan orang dewasa kira-kira lognormal. Salah satu penjelasan yang mungkin: berat badan yang bertambah tiap tahun proporsional terhadap berat badan saat ini. Dalam kasus itu, berat badan dewasa adalah produk dari sekian banyak faktor multiplikatif:

```
w = w₀ × f₁ × f₂ × … × fn
```

di mana w adalah berat badan dewasa, w₀ adalah berat lahir, dan fi adalah faktor pertambahan berat badan untuk tahun ke-i.

Log dari sebuah produk adalah jumlah dari log faktor-faktornya:

```
log w = log w₀ + log f₁ + log f₂ + … + log fn
```

Jadi menurut Teorema Limit Pusat, distribusi dari log w kira-kira normal untuk n yang besar, yang berarti distribusi dari w adalah lognormal.

Untuk memodelkan fenomena ini, pilih sebuah distribusi untuk f yang kelihatannya masuk akal, lalu bangkitkan sampel berat badan dewasa dengan memilih nilai acak dari distribusi berat lahir, memilih sederet faktor dari distribusi f, dan menghitung produknya. Berapa nilai n yang dibutuhkan untuk konvergen ke distribusi lognormal?

**Latihan 14.2** Di Bagian 14.6 kita memakai Teorema Limit Pusat untuk menemukan distribusi sampling dari perbedaan rata-rata, δ, di bawah hipotesis nol bahwa kedua sampel diambil dari populasi yang sama.

Kita juga bisa memakai distribusi ini untuk menemukan galat baku dari estimasi dan interval kepercayaan, tapi itu hanya kira-kira benar. Untuk lebih presisi, kita harus menghitung distribusi sampling dari δ di bawah hipotesis alternatif bahwa sampel-sampelnya diambil dari populasi yang berbeda.

Hitung distribusi ini dan pakai untuk menghitung galat baku dan interval kepercayaan 90% untuk perbedaan rata-ratanya.

**Latihan 14.3** Dalam sebuah makalah², Stein dkk. menyelidiki efek dari sebuah intervensi yang dimaksudkan untuk mengurangi alokasi tugas berbasis stereotip gender di dalam tim teknik mahasiswa.

Sebelum dan sesudah intervensi, para mahasiswa menjawab survei yang meminta mereka menilai kontribusi mereka ke tiap aspek proyek kelas dalam skala 7 poin.

Sebelum intervensi, mahasiswa laki-laki melaporkan skor yang lebih tinggi untuk aspek pemrograman proyek dibanding mahasiswa perempuan; rata-rata laki-laki melaporkan skor 3,57 dengan galat baku 0,28. Perempuan melaporkan 1,91, rata-rata, dengan galat baku 0,32.

Hitung distribusi sampling dari kesenjangan gender (perbedaan rata-ratanya), dan uji apakah dia signifikan secara statistik. Karena kamu diberi galat baku untuk rata-rata yang diestimasi, kamu tidak perlu tahu ukuran sampel untuk mencari distribusi samplingnya.

Setelah intervensi, kesenjangan gender-nya mengecil: rata-rata skor laki-laki adalah 3,44 (SE 0,16); rata-rata skor perempuan adalah 3,18 (SE 0,16). Sekali lagi, hitung distribusi sampling dari kesenjangan gender dan uji.

Terakhir, estimasi perubahan kesenjangan gender-nya; bagaimana distribusi sampling dari perubahan ini, dan apakah dia signifikan secara statistik?

² "Evidence for the persistent effects of an intervention to mitigate gender-stereotypical task allocation within student engineering teams," Proceedings of the IEEE Frontiers in Education Conference, 2014.

::: tip 💡 Konteks Indonesia
Latihan 14.3 soal kesenjangan gender di tim teknik ini bisa kamu adaptasi ke konteks kampus Indonesia: misalnya membandingkan skor kontribusi anggota tim proyek akhir (tugas akhir/skripsi) antar kelompok, atau skor kepuasan magang antar divisi. Polanya sama — kamu cuma butuh rata-rata dan galat baku tiap kelompok, lalu distribusi sampling dari selisihnya langsung bisa dihitung dengan kelas `Normal` dari bab ini. Tidak perlu data mentah.
:::

## Glosarium

- **metode analitik** (*analytic methods*): pendekatan statistik yang memakai solusi matematika tertutup, bukan simulasi atau *resampling*; biasanya jauh lebih cepat.
- **distribusi analitik** (*analytic distribution*): distribusi yang CDF-nya bisa dihitung secara langsung/efisien (mis. distribusi normal, distribusi-t Student, distribusi chi-kuadrat).
- **bentuk tertutup** (*closed form*): ekspresi matematika yang bisa dievaluasi langsung, tanpa iterasi atau simulasi.
- **CDF invers** (*inverse CDF*): fungsi yang memetakan probabilitas ke nilai yang sesuai (persentil); di SciPy disebut `ppf` (*percent point function*).
- **derajat kebebasan** (*degrees of freedom*): parameter dari distribusi-t dan distribusi chi-kuadrat; kasarnya, jumlah informasi independen yang tersedia untuk estimasi.
- **distribusi normal**: distribusi berbentuk lonceng dengan parameter µ (rata-rata) dan σ (simpangan baku); tertutup terhadap transformasi linear dan penjumlahan.
- **distribusi sampling** (*sampling distribution*): distribusi dari sebuah statistik (mis. rata-rata sampel) kalau eksperimennya diulang berkali-kali.
- **distribusi-t Student** (*Student's t-distribution*): distribusi analitik dari korelasi yang ditransformasi di bawah hipotesis nol; CDF-nya dihitung memakai fungsi gamma.
- **galat baku** (*standard error*): simpangan baku dari distribusi sampling; mengukur seberapa jauh estimasi biasanya meleset dari nilai sebenarnya.
- **hipotesis nol** (*null hypothesis*): hipotesis bahwa tidak ada efek/perbedaan; dasar untuk menghitung nilai-p.
- **interval kepercayaan** (*confidence interval*): interval antara dua persentil dari distribusi sampling; kalau eksperimen diulang berkali-kali, estimasi diharapkan jatuh di interval ini sesuai tingkat kepercayaannya.
- **nilai-p** (*p-value*): probabilitas hasil yang teramati (atau lebih ekstrem) di bawah hipotesis nol; kecil berarti hasilnya kecil kemungkinan disebabkan kebetulan.
- **persentil** (*percentile*): nilai di bawahnya terdapat persentase tertentu dari distribusi.
- **Teorema Limit Pusat** (*Central Limit Theorem*, CLT): teorema bahwa distribusi dari jumlah n nilai independen konvergen ke distribusi normal seiring n membesar, selama distribusi asalnya punya rata-rata dan varians berhingga.
- **transformasi linear** (*linear transformation*): transformasi berbentuk X₀ = aX + b; distribusi normal tertutup terhadap transformasi ini.
- **uji chi-kuadrat** (*chi-squared test*): uji hipotesis memakai statistik χ² = Σ(Oi − Ei)²/Ei; distribusi samplingnya di bawah hipotesis nol adalah distribusi chi-kuadrat.
- **uji korelasi** (*correlation test*): uji signifikansi korelasi Pearson memakai transformasi ke distribusi-t Student.

---

Selamat — kamu sudah menyelesaikan seluruh seri terjemahan *Think Stats*! Sekarang saatnya praktik di proyekmu sendiri. 🚀

[← Kembali ke Kata Pengantar](/thinkstats-pengantar)
