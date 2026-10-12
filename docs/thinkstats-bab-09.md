> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 9: Uji Hipotesis

Kode untuk bab ini ada di `hypothesis.py`. Info soal mengunduh dan memakai kode ini, lihat Bagian 0.2.

## 9.1 Uji hipotesis klasik

Saat mengeksplorasi data NSFG, kita melihat beberapa "efek semu", termasuk perbedaan antara bayi pertama dan bayi-bayi berikutnya. Sejauh ini kita terima saja efek-efek itu apa adanya; di bab ini, kita uji beneran.

Pertanyaan fundamental yang ingin kita jawab: apakah efek yang kita lihat di sampel kemungkinan besar juga muncul di populasi yang lebih besar? Contohnya, di sampel NSFG kita melihat perbedaan rata-rata lama kehamilan antara bayi pertama dan bayi lainnya. Kita ingin tahu apakah efek itu mencerminkan perbedaan nyata untuk perempuan di AS, atau hanya kebetulan muncul di sampel.

Ada beberapa cara merumuskan pertanyaan ini, di antaranya uji hipotesis nol Fisher, teori keputusan Neyman-Pearson, dan inferensi Bayesian¹. Yang saya sajikan di sini adalah gabungan dari ketiganya — yang paling banyak dipakai orang dalam praktik — saya sebut saja uji hipotesis klasik (*classical hypothesis testing*).

¹ Soal inferensi Bayesian, lihat buku sekuelnya, *Think Bayes*.

Tujuan uji hipotesis klasik adalah menjawab pertanyaan: "Diberi sebuah sampel dan sebuah efek semu, berapa peluang melihat efek seperti itu secara kebetulan?" Begini cara menjawabnya:

- **Langkah pertama** adalah mengukur besarnya efek semu itu dengan memilih sebuah *test statistic* (statistik uji). Di contoh NSFG, efek semunya adalah perbedaan lama kehamilan antara bayi pertama dan lainnya, jadi pilihan natural untuk statistik uji adalah selisih rata-rata kedua kelompok.
- **Langkah kedua** adalah mendefinisikan *null hypothesis* (hipotesis nol), yaitu model sistem yang dibangun atas asumsi bahwa efek semunya tidak nyata. Di contoh NSFG, hipotesis nolnya adalah tidak ada perbedaan antara bayi pertama dan bayi lainnya; artinya, lama kehamilan kedua kelompok berasal dari distribusi yang sama.
- **Langkah ketiga** adalah menghitung *p-value* (nilai-p), yaitu peluang melihat efek semu itu jika hipotesis nol benar. Di contoh NSFG, kita hitung selisih rata-rata aktual, lalu hitung peluang melihat selisih sebesar itu, atau lebih besar, di bawah hipotesis nol.
- **Langkah terakhir** adalah menginterpretasi hasilnya. Kalau nilai-p-nya kecil, efeknya disebut *statistically significant* (signifikan secara statistik), artinya kecil kemungkinan ia muncul secara kebetulan. Dalam kasus itu kita simpulkan efeknya kemungkinan besar juga muncul di populasi yang lebih besar.

Logika proses ini mirip dengan bukti dengan kontradiksi. Untuk membuktikan pernyataan matematika A, kamu berasumsi sementara bahwa A salah. Kalau asumsi itu mengarah ke kontradiksi, kamu simpulkan bahwa A sebenarnya benar.

Begitu juga, untuk menguji hipotesis seperti "efek ini nyata", kita berasumsi sementara bahwa ia tidak nyata. Itulah hipotesis nol. Berdasarkan asumsi itu, kita hitung peluang munculnya efek semu. Itulah nilai-p. Kalau nilai-p-nya kecil, kita simpulkan hipotesis nol kemungkinan besar tidak benar.

## 9.2 HypothesisTest

`thinkstats2` menyediakan `HypothesisTest`, sebuah class yang merepresentasikan struktur uji hipotesis klasik. Ini definisinya:

```python
class HypothesisTest(object):

    def __init__(self, data):
        self.data = data
        self.MakeModel()
        self.actual = self.TestStatistic(data)

    def PValue(self, iters=1000):
        self.test_stats = [self.TestStatistic(self.RunModel())
                           for _ in range(iters)]

        count = sum(1 for x in self.test_stats if x >= self.actual)
        return count / iters

    def TestStatistic(self, data):
        raise UnimplementedMethodException()

    def MakeModel(self):
        pass

    def RunModel(self):
        raise UnimplementedMethodException()
```

`HypothesisTest` adalah class induk abstrak yang menyediakan definisi lengkap untuk sebagian method dan placeholder untuk sisanya. Class anak berbasis `HypothesisTest` mewarisi `__init__` dan `PValue`, lalu menyediakan `TestStatistic`, `RunModel`, dan opsional `MakeModel`.

`__init__` menerima data dalam bentuk apapun yang sesuai. Ia memanggil `MakeModel`, yang membangun representasi hipotesis nol, lalu meneruskan data ke `TestStatistic`, yang menghitung besarnya efek di sampel.

`PValue` menghitung peluang munculnya efek semu di bawah hipotesis nol. Ia menerima parameter `iters`, yaitu jumlah simulasi yang dijalankan. Baris pertama membangkitkan data simulasi, menghitung statistik uji, dan menyimpannya di `test_stats`. Hasilnya adalah fraksi elemen di `test_stats` yang melebihi atau sama dengan statistik uji yang teramati, `self.actual`.

Sebagai contoh sederhana², anggap kita melempar koin 250 kali dan mendapat 140 angka (heads) dan 110 gambar (tails). Berdasarkan hasil ini, kita mungkin curiga koinnya bias; artinya, lebih mungkin mendarat di angka. Untuk menguji hipotesis ini, kita hitung peluang melihat selisih sebesar itu kalau koinnya sebenarnya adil:

```python
class CoinTest(thinkstats2.HypothesisTest):

    def TestStatistic(self, data):
        heads, tails = data
        test_stat = abs(heads - tails)
        return test_stat

    def RunModel(self):
        heads, tails = self.data
        n = heads + tails
        sample = [random.choice('HT') for _ in range(n)]
        hist = thinkstats2.Hist(sample)
        data = hist['H'], hist['T']
        return data
```

Parameter `data`-nya adalah sepasang integer: jumlah heads dan tails. Statistik ujinya adalah selisih absolut keduanya, jadi `self.actual` adalah 30.

`RunModel` mensimulasikan lemparan koin dengan asumsi koinnya memang adil. Ia membangkitkan sampel 250 lemparan, memakai `Hist` untuk menghitung jumlah heads dan tails, lalu mengembalikan sepasang integer.

Sekarang yang perlu dilakukan tinggal membuat instance `CoinTest` dan memanggil `PValue`:

```python
ct = CoinTest((140, 110))
pvalue = ct.PValue()
```

Hasilnya sekitar 0,07, artinya kalau koinnya adil, kita berharap melihat selisih sebesar 30 sekitar 7% dari waktu.

² Diadaptasi dari MacKay, *Information Theory, Inference, and Learning Algorithms*, 2003.

Gimana cara menginterpretasi hasil ini? Secara konvensi, 5% adalah ambang batas signifikansi statistik. Kalau nilai-p kurang dari 5%, efeknya dianggap signifikan; kalau tidak, ya tidak.

Tapi pilihan 5% itu arbitrer, dan (seperti akan kita lihat nanti) nilai-p bergantung pada pilihan statistik uji dan model hipotesis nol. Jadi nilai-p tidak boleh dianggap pengukuran yang presisi.

Saya sarankan menginterpretasi nilai-p berdasarkan orde besarnya: kalau nilai-p kurang dari 1%, efeknya kecil kemungkinan terjadi secara kebetulan; kalau lebih dari 10%, efeknya masih masuk akal dijelaskan secara kebetulan. Nilai-p antara 1% dan 10% sebaiknya dianggap borderline. Jadi di contoh ini saya simpulkan datanya tidak memberikan bukti kuat bahwa koinnya bias.

::: tip 💡 Konteks Indonesia
Ambang 5% itu ibarat "batas lolos" yang disepakati para statistikawan — seperti KKM di sekolah. Angkanya bukan hukum alam. Jadi jangan baper kalau penelitianmu dapat p = 0,06: itu artinya buktinya "kurang meyakinkan", bukan "efeknya tidak ada". Banyak jurnal Indonesia yang salah kaprah soal ini: p > 0,05 langsung disimpulkan "tidak ada pengaruh", padahal bisa jadi cuma sampelnya kurang besar (lihat Bagian 9.10 soal power).
:::

## 9.3 Menguji selisih rata-rata

Salah satu efek yang paling umum diuji adalah selisih rata-rata antara dua kelompok. Di data NSFG, kita melihat bahwa rata-rata lama kehamilan bayi pertama sedikit lebih panjang, dan rata-rata berat lahir sedikit lebih kecil. Sekarang kita lihat apakah efek-efek itu signifikan secara statistik.

Untuk contoh-contoh ini, hipotesis nolnya adalah distribusi kedua kelompok sama. Salah satu cara memodelkan hipotesis nol adalah dengan *permutation* (permutasi); yaitu, kita ambil nilai-nilai bayi pertama dan lainnya lalu acak, memperlakukan kedua kelompok sebagai satu kelompok besar:

```python
class DiffMeansPermute(thinkstats2.HypothesisTest):

    def TestStatistic(self, data):
        group1, group2 = data
        test_stat = abs(group1.mean() - group2.mean())
        return test_stat

    def MakeModel(self):
        group1, group2 = self.data
        self.n, self.m = len(group1), len(group2)
        self.pool = np.hstack((group1, group2))

    def RunModel(self):
        np.random.shuffle(self.pool)
        data = self.pool[:self.n], self.pool[self.n:]
        return data
```

`data` adalah sepasang sequence, satu untuk tiap kelompok. Statistik ujinya adalah selisih absolut rata-rata.

`MakeModel` mencatat ukuran kelompok, `n` dan `m`, lalu menggabungkan kedua kelompok ke satu array NumPy, `self.pool`.

`RunModel` mensimulasikan hipotesis nol dengan mengacak nilai gabungan lalu membaginya jadi dua kelompok berukuran `n` dan `m`. Seperti biasa, nilai balik `RunModel` punya format yang sama dengan data yang teramati.

Untuk menguji selisih lama kehamilan, kita jalankan:

```python
live, firsts, others = first.MakeFrames()
data = firsts.prglngth.values, others.prglngth.values
ht = DiffMeansPermute(data)
pvalue = ht.PValue()
```

`MakeFrames` membaca data NSFG dan mengembalikan DataFrame yang merepresentasikan semua kelahiran hidup, bayi pertama, dan lainnya. Kita ekstrak lama kehamilan sebagai array NumPy, teruskan sebagai `data` ke `DiffMeansPermute`, dan hitung nilai-p.

Hasilnya sekitar 0,17, artinya kita berharap melihat selisih sebesar efek yang teramati sekitar 17% dari waktu. Jadi efek ini tidak signifikan secara statistik.

`HypothesisTest` menyediakan `PlotCdf`, yang memplot distribusi statistik uji dan garis abu-abu yang menunjukkan besarnya efek yang teramati:

```python
ht.PlotCdf()
thinkplot.Show(xlabel='test statistic',
               ylabel='CDF')
```

*[Grafik 9.1: CDF dari selisih rata-rata lama kehamilan di bawah hipotesis nol.]*

CDF berpotongan dengan selisih yang teramati di 0,83, yang merupakan komplemen dari nilai-p, 0,17.

Kalau kita jalankan analisis yang sama dengan berat lahir, nilai-p yang terhitung adalah 0; setelah 1000 percobaan, simulasi tidak pernah menghasilkan efek sebesar selisih yang teramati, 0,12 lbs. Jadi kita laporkan p < 0,001, dan simpulkan bahwa selisih berat lahir signifikan secara statistik.

## 9.4 Statistik uji lainnya

Memilih statistik uji terbaik tergantung pada pertanyaan yang ingin kamu jawab. Contohnya, kalau pertanyaan yang relevan adalah apakah lama kehamilan berbeda untuk bayi pertama, maka masuk akal menguji selisih absolut rata-rata, seperti yang kita lakukan di bagian sebelumnya.

Kalau kita punya alasan untuk menduga bayi pertama cenderung lahir terlambat, kita tidak akan mengambil nilai absolut dari selisihnya; kita pakai statistik uji ini:

```python
class DiffMeansOneSided(DiffMeansPermute):

    def TestStatistic(self, data):
        group1, group2 = data
        test_stat = group1.mean() - group2.mean()
        return test_stat
```

`DiffMeansOneSided` mewarisi `MakeModel` dan `RunModel` dari `DiffMeansPermute`; satu-satunya beda adalah `TestStatistic` tidak mengambil nilai absolut dari selisihnya. Uji semacam ini disebut *one-sided* (satu sisi) karena hanya menghitung satu sisi dari distribusi selisih. Uji sebelumnya, yang memakai kedua sisi, disebut *two-sided* (dua sisi).

Untuk versi uji ini, nilai-p-nya 0,09. Secara umum nilai-p uji satu sisi sekitar setengah dari nilai-p uji dua sisi, tergantung bentuk distribusinya.

Hipotesis satu sisi, bahwa bayi pertama lahir terlambat, lebih spesifik daripada hipotesis dua sisi, jadi nilai-p-nya lebih kecil. Tapi bahkan untuk hipotesis yang lebih kuat ini, selisihnya tidak signifikan secara statistik.

Kita bisa pakai kerangka yang sama untuk menguji selisih standar deviasi. Di Bagian 3.3, kita melihat bukti bahwa bayi pertama lebih mungkin lahir terlalu dini atau terlambat, dan kurang mungkin lahir tepat waktu. Jadi kita mungkin berhipotesis standar deviasinya lebih tinggi. Begini cara mengujinya:

```python
class DiffStdPermute(DiffMeansPermute):

    def TestStatistic(self, data):
        group1, group2 = data
        test_stat = group1.std() - group2.std()
        return test_stat
```

Ini uji satu sisi karena hipotesisnya adalah standar deviasi bayi pertama lebih tinggi, bukan sekadar berbeda. Nilai-p-nya 0,09, yang tidak signifikan secara statistik.

## 9.5 Menguji korelasi

Kerangka ini juga bisa menguji korelasi. Contohnya, di dataset NSFG, korelasi antara berat lahir dan usia ibu sekitar 0,07. Kelihatannya ibu yang lebih tua punya bayi yang lebih berat. Tapi mungkinkah efek ini cuma kebetulan?

Untuk statistik uji, saya pakai korelasi Pearson, tapi Spearman juga bisa. Kalau kita punya alasan menduga korelasinya positif, kita lakukan uji satu sisi. Tapi karena tidak ada alasan seperti itu, saya lakukan uji dua sisi memakai nilai absolut korelasi.

Hipotesis nolnya adalah tidak ada korelasi antara usia ibu dan berat lahir. Dengan mengacak nilai-nilai yang teramati, kita bisa mensimulasikan dunia di mana distribusi usia dan berat lahir sama, tapi kedua variabel tidak berhubungan:

```python
class CorrelationPermute(thinkstats2.HypothesisTest):

    def TestStatistic(self, data):
        xs, ys = data
        test_stat = abs(thinkstats2.Corr(xs, ys))
        return test_stat

    def RunModel(self):
        xs, ys = self.data
        xs = np.random.permutation(xs)
        return xs, ys
```

`data` adalah sepasang sequence. `TestStatistic` menghitung nilai absolut korelasi Pearson. `RunModel` mengacak `xs` dan mengembalikan data simulasi.

Ini kode yang membaca data dan menjalankan ujinya:

```python
live, firsts, others = first.MakeFrames()
live = live.dropna(subset=['agepreg', 'totalwgt_lb'])
data = live.agepreg.values, live.totalwgt_lb.values
ht = CorrelationPermute(data)
pvalue = ht.PValue()
```

Saya pakai `dropna` dengan argumen `subset` untuk membuang baris yang kehilangan salah satu variabel yang kita butuhkan.

Korelasi aktualnya 0,07. Nilai-p yang terhitung adalah 0; setelah 1000 iterasi, korelasi simulasi terbesar adalah 0,04. Jadi walau korelasi yang teramati kecil, ia signifikan secara statistik.

Contoh ini mengingatkan bahwa "signifikan secara statistik" tidak selalu berarti efeknya penting, atau signifikan dalam praktik. Ia hanya berarti efeknya kecil kemungkinan terjadi secara kebetulan.

## 9.6 Menguji proporsi

Anggap kamu menjalankan kasino dan mencurigai seorang pelanggan memakai dadu curang; artinya, dadu yang dimodifikasi sehingga salah satu sisinya lebih mungkin keluar daripada yang lain. Kamu menangkap si terduga penipu dan menyita dadunya, tapi sekarang kamu harus membuktikan dadunya curang. Kamu melempar dadunya 60 kali dan mendapat hasil ini:

| Nilai | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Frekuensi | 8 | 9 | 19 | 5 | 8 | 11 |

Rata-rata kamu berharap tiap nilai muncul 10 kali. Di dataset ini, nilai 3 muncul lebih sering dari yang diharapkan, dan nilai 4 muncul lebih jarang. Tapi apakah selisih-selisih ini signifikan secara statistik?

Untuk menguji hipotesis ini, kita bisa hitung frekuensi harapan tiap nilai, selisih antara frekuensi harapan dan frekuensi yang teramati, dan total selisih absolut. Di contoh ini, kita berharap tiap sisi muncul 10 kali dari 60; deviasi dari harapan ini adalah -2, -1, 9, -5, -2, dan 1; jadi total selisih absolutnya adalah 20. Seberapa sering kita melihat selisih seperti itu secara kebetulan?

Ini versi `HypothesisTest` yang menjawab pertanyaan itu:

```python
class DiceTest(thinkstats2.HypothesisTest):

    def TestStatistic(self, data):
        observed = data
        n = sum(observed)
        expected = np.ones(6) * n / 6
        test_stat = sum(abs(observed - expected))
        return test_stat

    def RunModel(self):
        n = sum(self.data)
        values = [1, 2, 3, 4, 5, 6]
        rolls = np.random.choice(values, n, replace=True)
        hist = thinkstats2.Hist(rolls)
        freqs = hist.Freqs(values)
        return freqs
```

Data direpresentasikan sebagai daftar frekuensi: nilai-nilai yang teramati adalah `[8, 9, 19, 5, 8, 11]`; frekuensi harapannya semuanya 10. Statistik ujinya adalah jumlah selisih absolut.

Hipotesis nolnya adalah dadunya adil, jadi kita simulasikan dengan mengambil sampel acak dari `values`. `RunModel` memakai `Hist` untuk menghitung dan mengembalikan daftar frekuensi.

Nilai-p untuk data ini adalah 0,13, artinya kalau dadunya adil kita berharap melihat total deviasi yang teramati, atau lebih besar, sekitar 13% dari waktu. Jadi efek semunya tidak signifikan secara statistik.

::: tip 💡 Konteks Indonesia
Kasino memang bukan konteks Indonesia, tapi kerangka uji proporsinya kepakai banget di sini. Contoh nyata: kamu kerja di pabrik dan curiga proporsi produk cacat naik setelah ganti pemasok bahan baku. Atau kamu bikin undian berhadiah di Instagram dan ada yang curiga pemenangnya "diatur" — kamu bisa uji apakah distribusi pemenang per kota menyimpang jauh dari proporsi peserta. Statistiknya sama persis dengan dadu curang di atas: bandingkan frekuensi yang teramati dengan frekuensi harapan.
:::

## 9.7 Uji chi-kuadrat

Di bagian sebelumnya kita memakai total deviasi sebagai statistik uji. Tapi untuk menguji proporsi, lebih umum memakai statistik *chi-squared* (chi-kuadrat):

$$\chi^2 = \sum_i \frac{(O_i - E_i)^2}{E_i}$$

di mana $O_i$ adalah frekuensi yang teramati dan $E_i$ adalah frekuensi harapan.

Ini kode Python-nya:

```python
class DiceChiTest(DiceTest):

    def TestStatistic(self, data):
        observed = data
        n = sum(observed)
        expected = np.ones(6) * n / 6
        test_stat = sum((observed - expected)**2 / expected)
        return test_stat
```

Menguadratkan deviasi (daripada mengambil nilai absolut) memberi bobot lebih ke deviasi besar. Membagi dengan expected menstandardisasi deviasinya, walau dalam kasus ini tidak berpengaruh karena frekuensi harapannya semuanya sama.

Nilai-p memakai statistik chi-kuadrat adalah 0,04, jauh lebih kecil daripada yang kita dapat memakai total deviasi, 0,13. Kalau kita menganggap serius ambang 5%, kita akan menganggap efek ini signifikan secara statistik. Tapi mempertimbangkan kedua uji itu bersama-sama, saya bilang hasilnya borderline. Saya tidak akan menutup kemungkinan dadunya curang, tapi saya juga tidak akan menghukum si terduga penipu.

Contoh ini menunjukkan satu poin penting: nilai-p bergantung pada pilihan statistik uji dan model hipotesis nol, dan kadang pilihan-pilihan ini menentukan apakah sebuah efek signifikan secara statistik atau tidak.

## 9.8 Bayi pertama lagi

Di awal bab ini kita melihat lama kehamilan bayi pertama dan lainnya, dan menyimpulkan bahwa selisih semu dalam rata-rata dan standar deviasi tidak signifikan secara statistik. Tapi di Bagian 3.3, kita melihat beberapa selisih semu dalam distribusi lama kehamilan, terutama di rentang 35 sampai 43 minggu. Untuk melihat apakah selisih-selisih itu signifikan secara statistik, kita bisa pakai uji berbasis statistik chi-kuadrat.

Kodenya menggabungkan elemen-elemen dari contoh sebelumnya:

```python
class PregLengthTest(thinkstats2.HypothesisTest):

    def MakeModel(self):
        firsts, others = self.data
        self.n = len(firsts)
        self.pool = np.hstack((firsts, others))
        pmf = thinkstats2.Pmf(self.pool)
        self.values = range(35, 44)
        self.expected_probs = np.array(pmf.Probs(self.values))

    def RunModel(self):
        np.random.shuffle(self.pool)
        data = self.pool[:self.n], self.pool[self.n:]
        return data
```

Data direpresentasikan sebagai dua daftar lama kehamilan. Hipotesis nolnya adalah kedua sampel diambil dari distribusi yang sama. `MakeModel` memodelkan distribusi itu dengan menggabungkan kedua sampel memakai `hstack`. Lalu `RunModel` membangkitkan data simulasi dengan mengacak sampel gabungan dan membaginya jadi dua bagian.

`MakeModel` juga mendefinisikan `values`, yaitu rentang minggu yang akan kita pakai, dan `expected_probs`, yaitu peluang tiap nilai dalam distribusi gabungan.

Ini kode yang menghitung statistik ujinya:

```python
# class PregLengthTest:

    def TestStatistic(self, data):
        firsts, others = data
        stat = self.ChiSquared(firsts) + self.ChiSquared(others)
        return stat

    def ChiSquared(self, lengths):
        hist = thinkstats2.Hist(lengths)
        observed = np.array(hist.Freqs(self.values))
        expected = self.expected_probs * len(lengths)
        stat = sum((observed - expected)**2 / expected)
        return stat
```

`TestStatistic` menghitung statistik chi-kuadrat untuk bayi pertama dan lainnya, lalu menjumlahkannya.

`ChiSquared` menerima sequence lama kehamilan, menghitung histogramnya, dan menghitung `observed`, yaitu daftar frekuensi yang berkorespondensi dengan `self.values`. Untuk menghitung daftar frekuensi harapan, ia mengalikan peluang yang sudah dihitung sebelumnya, `expected_probs`, dengan ukuran sampel. Ia mengembalikan statistik chi-kuadrat, `stat`.

Untuk data NSFG, total statistik chi-kuadratnya adalah 102, yang tidak berarti banyak dengan sendirinya. Tapi setelah 1000 iterasi, statistik uji terbesar yang dibangkitkan di bawah hipotesis nol adalah 32. Kita simpulkan statistik chi-kuadrat yang teramati kecil kemungkinannya di bawah hipotesis nol, jadi efek semunya signifikan secara statistik.

Contoh ini menunjukkan keterbatasan uji chi-kuadrat: mereka menunjukkan bahwa ada perbedaan antara kedua kelompok, tapi tidak mengatakan apa-apa yang spesifik tentang perbedaannya itu apa.

## 9.9 Eror

Dalam uji hipotesis klasik, sebuah efek dianggap signifikan secara statistik kalau nilai-p-nya di bawah ambang tertentu, biasanya 5%. Prosedur ini memunculkan dua pertanyaan:

- Kalau efeknya sebenarnya terjadi secara kebetulan, berapa peluang kita salah menganggapnya signifikan? Peluang ini adalah *false positive rate* (tingkat positif palsu).
- Kalau efeknya nyata, berapa peluang uji hipotesisnya gagal? Peluang ini adalah *false negative rate* (tingkat negatif palsu).

Tingkat positif palsu relatif gampang dihitung: kalau ambangnya 5%, tingkat positif palsunya 5%. Begini alasannya:

- Kalau tidak ada efek nyata, hipotesis nol benar, jadi kita bisa hitung distribusi statistik uji dengan mensimulasikan hipotesis nol. Sebut distribusi ini $CDF_T$.
- Setiap kali kita menjalankan eksperimen, kita mendapat statistik uji $t$, yang diambil dari $CDF_T$. Lalu kita hitung nilai-p, yaitu peluang bahwa nilai acak dari $CDF_T$ melebihi $t$, jadi itu adalah $1 - CDF_T(t)$.
- Nilai-p kurang dari 5% kalau $CDF_T(t)$ lebih besar dari 95%; artinya, kalau $t$ melebihi persentil ke-95. Dan seberapa sering nilai yang diambil dari $CDF_T$ melebihi persentil ke-95? 5% dari waktu.

Jadi kalau kamu melakukan satu uji hipotesis dengan ambang 5%, kamu berharap positif palsu 1 kali dalam 20.

## 9.10 Power

Tingkat negatif palsu lebih sulit dihitung karena ia bergantung pada besarnya efek aktual, dan biasanya kita tidak tahu itu. Salah satu opsi adalah menghitung tingkat yang dikondisikan pada besarnya efek hipotetis.

Contohnya, kalau kita asumsikan selisih yang teramati antar kelompok itu akurat, kita bisa memakai sampel yang teramati sebagai model populasi dan menjalankan uji hipotesis dengan data simulasi:

```python
def FalseNegRate(data, num_runs=100):
    group1, group2 = data
    count = 0
    for i in range(num_runs):
        sample1 = thinkstats2.Resample(group1)
        sample2 = thinkstats2.Resample(group2)
        ht = DiffMeansPermute((sample1, sample2))
        pvalue = ht.PValue(iters=101)
        if pvalue > 0.05:
            count += 1
    return count / num_runs
```

`FalseNegRate` menerima `data` berupa dua sequence, satu untuk tiap kelompok. Setiap putaran loop, ia mensimulasikan sebuah eksperimen dengan mengambil sampel acak dari tiap kelompok dan menjalankan uji hipotesis. Lalu ia memeriksa hasilnya dan menghitung jumlah negatif palsu.

`Resample` menerima sebuah sequence dan mengambil sampel dengan panjang yang sama, dengan pengembalian:

```python
def Resample(xs):
    return np.random.choice(xs, len(xs), replace=True)
```

Ini kode yang menguji lama kehamilan:

```python
live, firsts, others = first.MakeFrames()
data = firsts.prglngth.values, others.prglngth.values
neg_rate = FalseNegRate(data)
```

Hasilnya sekitar 70%, artinya kalau selisih aktual rata-rata lama kehamilan adalah 0,078 minggu, kita berharap eksperimen dengan ukuran sampel ini menghasilkan uji negatif 70% dari waktu.

Hasil ini sering disajikan sebaliknya: kalau selisih aktualnya 0,078 minggu, kita seharusnya berharap uji positif hanya 30% dari waktu. "Tingkat positif benar" ini disebut *power* (daya) dari uji, atau kadang "sensitivitas". Ia mencerminkan kemampuan uji mendeteksi efek sebesar itu.

Di contoh ini, ujinya hanya punya peluang 30% menghasilkan hasil positif (sekali lagi, dengan asumsi selisihnya 0,078 minggu). Sebagai aturan praktis, power 80% dianggap bisa diterima, jadi kita bilang uji ini "underpowered" (kurang daya).

Secara umum, hasil uji hipotesis yang negatif tidak berarti tidak ada perbedaan antar kelompok; ia justru menyarankan bahwa kalau ada perbedaan, ia terlalu kecil untuk terdeteksi dengan ukuran sampel ini.

::: tip 💡 Konteks Indonesia
Positif palsu vs negatif palsu paling gampang diingat lewat **rapid test antigen** yang dulu sering kita pakai. Positif palsu: kamu sebenarnya sehat tapi hasilnya positif — kamu dikarantina sia-sia. Negatif palsu: kamu sebenarnya sakit tapi hasilnya negatif — kamu jalan-jalan dan menulari orang. Di statistik, ambang 5% itu seperti "sensitivitas alat tes": kamu memilih seberapa sering kamu rela salah. Dan power itu seperti kualitas alatnya: rapid test yang kurang sensitif (underpowered) sering gagal mendeteksi virus yang sebenarnya ada — sama seperti uji dengan sampel kecil yang gagal mendeteksi efek yang sebenarnya nyata.
:::

## 9.11 Replikasi

Proses uji hipotesis yang saya demonstrasikan di bab ini, kalau mau jujur, bukan praktik yang baik.

Pertama, saya melakukan banyak uji. Kalau kamu menjalankan satu uji hipotesis, peluang positif palsunya sekitar 1 banding 20, yang mungkin masih bisa diterima. Tapi kalau kamu menjalankan 20 uji, kamu harus berharap setidaknya satu positif palsu, hampir setiap saat.

Kedua, saya memakai dataset yang sama untuk eksplorasi dan pengujian. Kalau kamu mengeksplorasi dataset besar, menemukan efek yang mengejutkan, lalu menguji apakah ia signifikan, kamu punya peluang besar menghasilkan positif palsu.

Untuk mengompensasi banyaknya uji, kamu bisa menyesuaikan ambang nilai-p (lihat https://en.wikipedia.org/wiki/Holm-Bonferroni_method). Atau kamu bisa menangani kedua masalah itu dengan mempartisi data, memakai satu set untuk eksplorasi dan set lainnya untuk pengujian.

Di beberapa bidang, praktik-praktik ini diwajibkan atau setidaknya dianjurkan. Tapi umum juga menangani masalah-masalah ini secara implisit dengan mereplikasi hasil yang sudah dipublikasikan. Biasanya makalah pertama yang melaporkan hasil baru dianggap eksploratif. Makalah-makalah berikutnya yang mereplikasi hasilnya dengan data baru dianggap konfirmatif.

Kebetulan, kita punya kesempatan mereplikasi hasil-hasil di bab ini. Edisi pertama buku ini berbasis Siklus 6 NSFG, yang dirilis tahun 2002. Pada Oktober 2011, CDC merilis data tambahan berdasarkan wawancara yang dilakukan dari 2006–2010. `nsfg2.py` berisi kode untuk membaca dan membersihkan data ini. Di dataset baru:

- Selisih rata-rata lama kehamilan adalah 0,16 minggu dan signifikan secara statistik dengan p < 0,001 (dibandingkan 0,078 minggu di dataset asli).
- Selisih berat lahir adalah 0,17 pon dengan p < 0,001 (dibandingkan 0,12 lbs di dataset asli).
- Korelasi antara berat lahir dan usia ibu adalah 0,08 dengan p < 0,001 (dibandingkan 0,07).
- Uji chi-kuadrat signifikan secara statistik dengan p < 0,001 (seperti di dataset asli).

Ringkasnya, semua efek yang signifikan secara statistik di dataset asli tereplikasi di dataset baru, dan selisih lama kehamilan — yang tidak signifikan di dataset asli — lebih besar di dataset baru dan signifikan.

## 9.12 Latihan

Solusi latihan-latihan ini ada di `chap09soln.py`.

**Latihan 9.1** Saat ukuran sampel bertambah, power uji hipotesis bertambah, artinya ia lebih mungkin positif kalau efeknya nyata. Sebaliknya, saat ukuran sampel berkurang, uji kurang mungkin positif bahkan kalau efeknya nyata.

Untuk menyelidiki perilaku ini, jalankan uji-uji di bab ini dengan subset berbeda dari data NSFG. Kamu bisa pakai `thinkstats2.SampleRows` untuk memilih subset acak baris-baris di DataFrame.

Apa yang terjadi pada nilai-p uji-uji ini saat ukuran sampel berkurang? Berapa ukuran sampel terkecil yang menghasilkan uji positif?

**Latihan 9.2** Di Bagian 9.3, kita mensimulasikan hipotesis nol dengan permutasi; yaitu, kita memperlakukan nilai-nilai yang teramati seolah-olah merepresentasikan seluruh populasi, dan menugaskan anggota-anggota populasi secara acak ke kedua kelompok.

Alternatifnya adalah memakai sampel untuk mengestimasi distribusi populasi, lalu mengambil sampel acak dari distribusi itu. Proses ini disebut *resampling* (pengambilan ulang sampel). Ada beberapa cara mengimplementasikan resampling, tapi salah satu yang paling sederhana adalah mengambil sampel dengan pengembalian dari nilai-nilai yang teramati, seperti di Bagian 9.10.

Tulis class bernama `DiffMeansResample` yang mewarisi `DiffMeansPermute` dan meng-override `RunModel` untuk mengimplementasikan resampling, bukan permutasi.

Pakai model ini untuk menguji selisih lama kehamilan dan berat lahir. Seberapa besar model memengaruhi hasilnya?

## 9.13 Glosarium

- *hypothesis testing* (uji hipotesis): Proses menentukan apakah sebuah efek semu signifikan secara statistik.
- *test statistic* (statistik uji): Sebuah statistik yang dipakai untuk mengukur besarnya efek.
- *null hypothesis* (hipotesis nol): Sebuah model sistem yang dibangun atas asumsi bahwa efek semu terjadi secara kebetulan.
- *p-value* (nilai-p): Peluang bahwa sebuah efek bisa terjadi secara kebetulan.
- *statistically significant* (signifikan secara statistik): Sebuah efek signifikan secara statistik kalau kecil kemungkinannya terjadi secara kebetulan.
- *permutation test* (uji permutasi): Cara menghitung nilai-p dengan membangkitkan permutasi dari dataset yang teramati.
- *resampling test* (uji resampling): Cara menghitung nilai-p dengan membangkitkan sampel, dengan pengembalian, dari dataset yang teramati.
- *two-sided test* (uji dua sisi): Uji yang bertanya, "Berapa peluang efek sebesar efek yang teramati, positif atau negatif?"
- *one-sided test* (uji satu sisi): Uji yang bertanya, "Berapa peluang efek sebesar efek yang teramati, dan dengan tanda yang sama?"
- *chi-squared test* (uji chi-kuadrat): Uji yang memakai statistik chi-kuadrat sebagai statistik uji.
- *false positive* (positif palsu): Kesimpulan bahwa sebuah efek nyata padahal tidak.
- *false negative* (negatif palsu): Kesimpulan bahwa sebuah efek terjadi secara kebetulan padahal tidak.
- *power* (daya): Peluang uji positif kalau hipotesis nol salah.

---

**Selanjutnya:** [Bab 10: Kuadrat Terkecil Linear](/thinkstats-bab-10) *(segera hadir)*
