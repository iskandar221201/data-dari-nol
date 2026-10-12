> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 8: Estimasi

Kode untuk bab ini ada di `estimation.py`. Untuk informasi tentang mengunduh dan memakai kode ini, lihat Bagian 0.2.

## 8.1 Permainan estimasi

Main game yuk. Aku memikirkan sebuah distribusi, dan kamu harus menebak distribusi apa itu. Aku kasih dua petunjuk: ini distribusi normal, dan ini sampel acak yang diambil darinya:

    [-0.441, 1.774, -0.101, -1.138, 2.975, -2.138]

Menurutmu berapa parameter rerata, µ, dari distribusi ini?

Salah satu pilihannya adalah memakai rerata sampel, x̄, sebagai estimasi µ. Di contoh ini x̄ adalah 0,155, jadi menebak µ = 0,155 itu masuk akal. Proses ini disebut *estimation* (estimasi), dan statistik yang kita pakai (rerata sampel) disebut *estimator*.

Memakai rerata sampel untuk mengestimasi µ itu saking jelasnya sampai susah membayangkan alternatif yang masuk akal. Tapi coba kita ubah gamenya dengan menambahkan *outlier* (pencilan).

Aku sedang memikirkan sebuah distribusi. Ini distribusi normal, dan ini sampel yang dikumpulkan oleh surveyor yang tidak bisa diandalkan — kadang ia salah menaruh titik desimal.

    [-0.441, 1.774, -0.101, -1.138, 2.975, -213.8]

Sekarang berapa estimasimu untuk µ? Kalau kamu pakai rerata sampel, tebakanmu adalah -35,12. Apa itu pilihan terbaik? Apa alternatifnya?

Salah satu opsi adalah mengidentifikasi dan membuang pencilan, lalu menghitung rerata sampel dari sisanya. Opsi lain adalah memakai median sebagai estimator.

Estimator mana yang terbaik tergantung situasinya (misalnya, ada pencilan atau tidak) dan apa tujuannya. Kamu mau meminimalkan galat, atau memaksimalkan peluang menebak dengan tepat?

Kalau tidak ada pencilan, rerata sampel meminimalkan *mean squared error* (MSE, galat kuadrat rata-rata). Artinya, kalau kita main game ini berkali-kali, dan setiap kali menghitung galat x̄ − µ, rerata sampel meminimalkan

    MSE = (1/m) Σ(x̄ − µ)²

di mana m adalah berapa kali kamu memainkan game estimasi ini, jangan tertukar dengan n, yaitu ukuran sampel yang dipakai untuk menghitung x̄.

Ini fungsi yang mensimulasikan game estimasi dan menghitung *root mean squared error* (RMSE, akar galat kuadrat rata-rata), yaitu akar kuadrat dari MSE:

```python
def Estimate1(n=7, m=1000):
    mu = 0
    sigma = 1
    means = []
    medians = []
    for _ in range(m):
        xs = [random.gauss(mu, sigma) for i in range(n)]
        xbar = np.mean(xs)
        median = np.median(xs)
        means.append(xbar)
        medians.append(median)
    print('rmse xbar', RMSE(means, mu))
    print('rmse median', RMSE(medians, mu))
```

Lagi-lagi, n adalah ukuran sampel, dan m adalah berapa kali kita main gamenya. `means` adalah daftar estimasi berdasarkan x̄. `medians` adalah daftar median.

Ini fungsi yang menghitung RMSE:

```python
def RMSE(estimates, actual):
    e2 = [(estimate-actual)**2 for estimate in estimates]
    mse = np.mean(e2)
    return math.sqrt(mse)
```

`estimates` adalah daftar estimasi; `actual` adalah nilai asli yang sedang diestimasi. Praktiknya, tentu saja, kita tidak tahu nilai aslinya; kalau tahu, ngapain diestimasi. Tujuan eksperimen ini adalah membandingkan performa kedua estimator.

Pas aku menjalankan kode ini, RMSE rerata sampel adalah 0,41, artinya kalau kita pakai x̄ untuk mengestimasi rerata distribusi ini, berdasarkan sampel berukuran n = 7, kita bisa berharap meleset sekitar 0,41 rata-rata. Memakai median untuk mengestimasi rerata menghasilkan RMSE 0,53, yang mengonfirmasi bahwa x̄ menghasilkan RMSE lebih rendah, setidaknya untuk contoh ini.

Meminimalkan MSE itu sifat yang bagus, tapi tidak selalu strategi terbaik. Misalnya, kamu sedang mengestimasi distribusi kecepatan angin di lokasi sebuah bangunan. Kalau estimasinya terlalu tinggi, bangunannya bisa kelebihan konstruksi, biayanya membengkak. Tapi kalau terlalu rendah, bangunannya bisa roboh. Karena biaya sebagai fungsi galat tidak simetris, meminimalkan MSE bukan strategi terbaik.

Contoh lain, misalkan aku melempar tiga dadu enam sisi dan memintamu menebak totalnya. Kalau kamu tepat, kamu dapat hadiah; kalau tidak, tidak dapat apa-apa. Dalam kasus ini nilai yang meminimalkan MSE adalah 10,5, tapi itu tebakan yang buruk, karena total tiga dadu tidak pernah 10,5. Untuk game ini, kamu butuh estimator yang peluangnya paling besar untuk benar, yaitu *maximum likelihood estimator* (MLE, estimator kemungkinan maksimum). Kalau kamu pilih 10 atau 11, peluang menangmu 1 banding 8, dan itu yang terbaik yang bisa kamu lakukan.

## 8.2 Menebak varians

Main satu ronde lagi. Aku memikirkan sebuah distribusi. Ini distribusi normal, dan ini sampel (yang familiar) darinya:

    [-0.441, 1.774, -0.101, -1.138, 2.975, -2.138]

Menurutmu berapa varians, σ², dari distribusiku? Lagi-lagi, pilihan yang jelas adalah memakai varians sampel, S², sebagai estimator.

    S² = (1/n) Σ(xi − x̄)²

Untuk sampel besar, S² adalah estimator yang memadai, tapi untuk sampel kecil ia cenderung terlalu rendah. Karena sifatnya yang kurang beruntung ini, ia disebut *biased estimator* (estimator bias). Sebuah estimator disebut *unbiased* (tak bias) kalau total (atau rerata) galat yang diharapkan, setelah iterasi game estimasi berkali-kali, adalah 0.

Untungnya, ada statistik sederhana lain yang merupakan estimator tak bias untuk σ²:

    S²ₙ₋₁ = (1/(n−1)) Σ(xi − x̄)²

Untuk penjelasan kenapa S² bias, dan bukti bahwa S²ₙ₋₁ tak bias, lihat http://wikipedia.org/wiki/Bias_of_an_estimator.

Masalah terbesar estimator ini adalah nama dan simbolnya dipakai secara tidak konsisten. Nama "varians sampel" bisa merujuk ke S² maupun S²ₙ₋₁, dan simbol S² dipakai untuk salah satu atau keduanya.

Ini fungsi yang mensimulasikan game estimasi dan menguji performa S² dan S²ₙ₋₁:

```python
def Estimate2(n=7, m=1000):
    mu = 0
    sigma = 1
    estimates1 = []
    estimates2 = []
    for _ in range(m):
        xs = [random.gauss(mu, sigma) for i in range(n)]
        biased = np.var(xs)
        unbiased = np.var(xs, ddof=1)
        estimates1.append(biased)
        estimates2.append(unbiased)
    print('mean error biased', MeanError(estimates1, sigma**2))
    print('mean error unbiased', MeanError(estimates2, sigma**2))
```

Lagi-lagi, n adalah ukuran sampel dan m adalah berapa kali kita main gamenya. `np.var` menghitung S² secara default dan S²ₙ₋₁ kalau kamu memberi argumen `ddof=1`, yang merupakan singkatan dari "delta degrees of freedom" (delta derajat kebebasan). Aku tidak akan menjelaskan istilah itu, tapi kamu bisa membacanya di http://en.wikipedia.org/wiki/Degrees_of_freedom_(statistics).

`MeanError` menghitung rerata selisih antara estimasi-estimasi dan nilai asli:

```python
def MeanError(estimates, actual):
    errors = [estimate-actual for estimate in estimates]
    return np.mean(errors)
```

Pas aku menjalankan kode ini, galat rerata untuk S² adalah -0,13. Seperti yang diduga, estimator bias ini cenderung terlalu rendah. Untuk S²ₙ₋₁, galat reratanya 0,014, sekitar 10 kali lebih kecil. Seiring m bertambah, kita berharap galat rerata untuk S²ₙ₋₁ mendekati 0.

Sifat-sifat seperti MSE dan bias adalah ekspektasi jangka panjang berdasarkan iterasi game estimasi yang berkali-kali. Dengan menjalankan simulasi seperti yang ada di bab ini, kita bisa membandingkan estimator dan memeriksa apakah mereka punya sifat yang diinginkan.

Tapi saat kamu menerapkan estimator ke data nyata, kamu cuma dapat satu estimasi. Tidak masuk akal mengatakan estimasi itu tak bias; tak bias adalah sifat estimator, bukan sifat estimasi.

Setelah kamu memilih estimator dengan sifat yang tepat, dan memakainya untuk menghasilkan estimasi, langkah berikutnya adalah mengkarakterisasi ketidakpastian estimasi itu — topik bagian berikutnya.

## 8.3 Distribusi sampling

Misalkan kamu ilmuwan yang meneliti gorila di cagar alam. Kamu ingin tahu berat rata-rata gorila betina dewasa di cagar itu. Untuk menimbangnya, kamu harus membius mereka — berbahaya, mahal, dan mungkin menyakiti gorila. Tapi kalau informasi ini penting, menimbang sampel 9 gorila mungkin bisa diterima. Misalkan populasi cagarnya sudah dikenal baik, jadi kita bisa memilih sampel yang representatif dari gorila betina dewasa. Kita bisa pakai rerata sampel, x̄, untuk mengestimasi rerata populasi yang tak diketahui, µ.

Setelah menimbang 9 gorila betina, kamu dapat x̄ = 90 kg dan simpangan baku sampel, S = 7,5 kg. Rerata sampel adalah estimator tak bias untuk µ, dan dalam jangka panjang ia meminimalkan MSE. Jadi kalau kamu melaporkan satu estimasi yang merangkum hasilnya, kamu akan melaporkan 90 kg.

Tapi seberapa yakin kamu dengan estimasi ini? Kalau kamu cuma menimbang n = 9 gorila dari populasi yang jauh lebih besar, bisa saja kamu sial dan kebetulan memilih 9 gorila terberat (atau 9 yang paling ringan) secara kebetulan. Variasi estimasi yang disebabkan pemilihan acak ini disebut *sampling error* (galat sampling).

Untuk mengkuantifikasi galat sampling, kita bisa mensimulasikan proses sampling dengan nilai hipotetis µ dan σ, dan melihat seberapa besar x̄ bervariasi.

Karena kita tidak tahu nilai asli µ dan σ di populasi, kita pakai estimasi x̄ dan S. Jadi pertanyaan yang kita jawab adalah: "Kalau nilai asli µ dan σ adalah 90 kg dan 7,5 kg, dan kita menjalankan eksperimen yang sama berkali-kali, seberapa besar variasi rerata estimasi, x̄?"

Fungsi berikut menjawab pertanyaan itu:

```python
def SimulateSample(mu=90, sigma=7.5, n=9, m=1000):
    means = []
    for j in range(m):
        xs = np.random.normal(mu, sigma, n)
        xbar = np.mean(xs)
        means.append(xbar)
    cdf = thinkstats2.Cdf(means)
    ci = cdf.Percentile(5), cdf.Percentile(95)
    stderr = RMSE(means, mu)
```

`mu` dan `sigma` adalah nilai hipotetis dari parameter-parameter itu. n adalah ukuran sampel, jumlah gorila yang kita ukur. m adalah berapa kali kita menjalankan simulasi.

*[Grafik 8.1: distribusi sampling dari x̄, beserta interval kepercayaan]*

Di setiap iterasi, kita memilih n nilai dari distribusi normal dengan parameter yang diberikan, dan menghitung rerata sampel, `xbar`. Kita menjalankan 1000 simulasi lalu menghitung distribusi, `cdf`, dari estimasi-estimasi itu. Hasilnya ditunjukkan di Grafik 8.1. Distribusi ini disebut *sampling distribution* (distribusi sampling) dari estimator. Ia menunjukkan seberapa besar variasi estimasi kalau kita menjalankan eksperimen berulang-ulang.

Rerata distribusi sampling ini cukup dekat dengan nilai hipotetis µ, artinya eksperimen ini menghasilkan jawaban yang benar, rata-rata. Setelah 1000 percobaan, hasil terendah adalah 82 kg, dan tertinggi 98 kg. Rentang ini menunjukkan estimasinya bisa meleset sampai 8 kg.

Ada dua cara umum untuk meringkas distribusi sampling:

- *Standard error* (SE, galat baku) adalah ukuran seberapa jauh kita berharap estimasi meleset, rata-rata. Untuk setiap eksperimen simulasi, kita hitung galatnya, x̄ − µ, lalu menghitung root mean squared error (RMSE). Di contoh ini, sekitar 2,5 kg.
- *Confidence interval* (CI, interval kepercayaan) adalah rentang yang mencakup fraksi tertentu dari distribusi sampling. Misalnya, interval kepercayaan 90% adalah rentang dari persentil ke-5 sampai persentil ke-95. Di contoh ini, CI 90% adalah (86, 94) kg.

Galat baku dan interval kepercayaan adalah sumber kebingungan yang besar:

- Orang sering tertukar antara galat baku dan simpangan baku. Ingat bahwa simpangan baku menggambarkan variabilitas dalam besaran yang diukur; di contoh ini, simpangan baku berat gorila adalah 7,5 kg. Galat baku menggambarkan variabilitas dalam estimasi. Di contoh ini, galat baku rerata, berdasarkan sampel 9 pengukuran, adalah 2,5 kg. Salah satu cara mengingat bedanya: seiring ukuran sampel bertambah, galat baku mengecil; simpangan baku tidak.
- Orang sering berpikir ada probabilitas 90% bahwa parameter asli, µ, berada di dalam interval kepercayaan 90%. Sayangnya, itu tidak benar. Kalau kamu ingin membuat klaim seperti itu, kamu harus memakai metode Bayesian (lihat bukuku, *Think Bayes*).

Distribusi sampling menjawab pertanyaan yang berbeda: ia memberimu gambaran seberapa bisa diandalkannya sebuah estimasi dengan menunjukkan seberapa besar variasinya kalau kamu mengulang eksperimennya.

Penting untuk diingat bahwa interval kepercayaan dan galat baku hanya mengkuantifikasi galat sampling; yaitu, galat karena hanya mengukur sebagian populasi. Distribusi sampling tidak memperhitungkan sumber galat lain, terutama *sampling bias* (bias sampling) dan *measurement error* (galat pengukuran), yang menjadi topik bagian berikutnya.

::: tip 💡 Konteks Indonesia
Logika distribusi sampling ini persis yang dipakai **quick count** tiap pemilu. Lembaga survei tidak menghitung semua TPS — mereka mengambil sampel TPS, lalu mengestimasi perolehan suara nasional dari rerata sampel itu. "Margin of error ±2%" yang disebut-sebut di TV itu pada dasarnya galat baku: seberapa jauh estimasi bisa meleset hanya karena efek sampling. Dan kalau quick count meleset jauh? Biasanya bukan matematikanya yang salah, tapi sampel TPS-nya tidak representatif (bias sampling) atau ada salah catat plano C1 (galat pengukuran). Interval kepercayaan hanya mengukur galat sampling — bukan dua masalah lainnya.
:::

## 8.4 Bias sampling

Misalkan alih-alih berat gorila di cagar alam, kamu ingin tahu berat rata-rata perempuan di kotamu. Kecil kemungkinan kamu diizinkan memilih sampel representatif perempuan dan menimbang mereka satu per satu.

Alternatif sederhananya adalah "*telephone sampling*"; yaitu, kamu memilih nomor acak dari buku telepon, menelepon dan minta bicara dengan perempuan dewasa, lalu bertanya berapa berat badannya.

Telephone sampling punya keterbatasan yang jelas. Misalnya, sampelnya terbatas pada orang yang nomor teleponnya terdaftar, jadi orang tanpa telepon (yang mungkin lebih miskin dari rata-rata) dan orang dengan nomor tak terdaftar (yang mungkin lebih kaya) tereliminasi. Juga, kalau kamu menelepon telepon rumah di siang hari, kamu cenderung tidak menyampel orang yang bekerja. Dan kalau kamu cuma menyampel orang yang mengangkat telepon, kamu cenderung tidak menyampel orang yang berbagi saluran telepon.

Kalau faktor seperti pendapatan, pekerjaan, dan ukuran rumah tangga berkaitan dengan berat badan — dan itu masuk akal — hasil surveimu akan terpengaruh ke satu arah atau lainnya. Masalah ini disebut *sampling bias* (bias sampling) karena ia adalah sifat dari proses samplingnya.

Proses sampling ini juga rentan terhadap *self-selection* (seleksi diri), yang merupakan sejenis bias sampling. Sebagian orang akan menolak menjawab pertanyaan, dan kalau kecenderungan menolak ini berkaitan dengan berat badan, itu akan memengaruhi hasilnya.

Terakhir, kalau kamu bertanya ke orang berapa berat mereka, alih-alih menimbang langsung, hasilnya bisa tidak akurat. Bahkan responden yang kooperatif pun bisa membulatkan ke atas atau ke bawah kalau tidak nyaman dengan berat aslinya. Dan tidak semua responden kooperatif. Ketidakakuratan semacam ini adalah contoh *measurement error* (galat pengukuran).

Saat melaporkan suatu besaran estimasi, ada gunanya melaporkan galat baku, atau interval kepercayaan, atau keduanya, untuk mengkuantifikasi galat sampling. Tapi penting juga diingat bahwa galat sampling hanyalah satu sumber galat, dan sering kali bukan yang terbesar.

::: tip 💡 Konteks Indonesia
Contoh telephone sampling di atas terasa jadul karena buku telepon sudah punah — tapi versi Indonesianya ada di mana-mana. **Polling di Instagram Stories atau X** untuk menebak hasil pemilu: respondennya cuma followers-mu yang kebetulan online dan niat mengisi — itu self-selection parah. **Survei door-to-door di siang hari** di perumahan: yang ketemu cuma ibu rumah tangga dan pensiunan, pekerja kantoran kelewat semua. Dan **survei kepuasan pelanggan lewat Google Form**: yang mengisi biasanya cuma yang sangat puas atau sangat kecewa. Polanya sama: proses sampling yang tidak representatif menghasilkan estimasi yang miring, sebesar apa pun sampelnya.
:::

## 8.5 Distribusi eksponensial

Main satu ronde lagi game estimasi. Aku memikirkan sebuah distribusi. Ini distribusi eksponensial, dan ini sampelnya:

    [5.384, 4.493, 19.198, 2.790, 6.122, 12.844]

Menurutmu berapa parameter, λ, dari distribusi ini?

Secara umum, rerata distribusi eksponensial adalah 1/λ, jadi dengan berpikir mundur, kita bisa memilih

    L = 1/x̄

L adalah estimator untuk λ. Dan bukan sembarang estimator; ia juga *maximum likelihood estimator* (lihat http://wikipedia.org/wiki/Exponential_distribution#Maximum_likelihood). Jadi kalau kamu ingin memaksimalkan peluang menebak λ dengan tepat, L adalah caranya.

Tapi kita tahu x̄ tidak *robust* (tahan) terhadap pencilan, jadi kita berharap L punya masalah yang sama.

Kita bisa memilih alternatif berbasis median sampel. Median distribusi eksponensial adalah ln(2)/λ, jadi dengan berpikir mundur lagi, kita bisa mendefinisikan estimator

    Lm = ln(2)/m

di mana m adalah median sampel.

Untuk menguji performa estimator-estimator ini, kita bisa mensimulasikan proses sampling:

```python
def Estimate3(n=7, m=1000):
    lam = 2
    means = []
    medians = []
    for _ in range(m):
        xs = np.random.exponential(1.0/lam, n)
        L = 1 / np.mean(xs)
        Lm = math.log(2) / thinkstats2.Median(xs)
        means.append(L)
        medians.append(Lm)
    print('rmse L', RMSE(means, lam))
    print('rmse Lm', RMSE(medians, lam))
    print('mean error L', MeanError(means, lam))
    print('mean error Lm', MeanError(medians, lam))
```

Pas aku menjalankan eksperimen ini dengan λ = 2, RMSE dari L adalah 1,1. Untuk estimator berbasis median Lm, RMSE-nya 1,8. Dari eksperimen ini kita belum bisa tahu apakah L meminimalkan MSE, tapi setidaknya ia tampak lebih baik daripada Lm.

Sayangnya, tampaknya kedua estimator ini bias. Untuk L galat reratanya 0,33; untuk Lm 0,45. Dan keduanya tidak konvergen ke 0 seiring m bertambah.

Ternyata x̄ adalah estimator tak bias untuk rerata distribusi, 1/λ, tapi L bukan estimator tak bias untuk λ.

::: tip 💡 Konteks Indonesia
Bagian ini menyebut hoki dan sepak bola — ganti hokinya dengan **Liga 1** dan logikanya langsung nempel. Waktu antar gol sebuah tim kira-kira mengikuti distribusi eksponensial, jadi kamu bisa mengestimasi "ketajaman" tim (λ, gol per pertandingan) dari data waktu gol mereka semusim. Tim yang λ-nya besar mencetak gol lebih sering — tapi ingat, estimasi dari segelintir pertandingan awal musim punya galat baku yang besar. Jangan buru-buru menyimpulkan tim promosi "tajam banget" cuma dari 3 laga pertama.
:::

## 8.6 Latihan

Untuk latihan-latihan berikut, kamu bisa menemukan kode awal di `chap08ex.ipynb`. Solusinya ada di `chap08soln.py`.

**Latihan 8.1** Di bab ini kita memakai x̄ dan median untuk mengestimasi µ, dan menemukan bahwa x̄ menghasilkan MSE lebih rendah. Kita juga memakai S² dan S²ₙ₋₁ untuk mengestimasi σ, dan menemukan bahwa S² bias sedangkan S²ₙ₋₁ tak bias.

Jalankan eksperimen serupa untuk melihat apakah x̄ dan median adalah estimasi tak bias untuk µ. Cek juga apakah S² atau S²ₙ₋₁ menghasilkan MSE lebih rendah.

**Latihan 8.2** Misalkan kamu mengambil sampel berukuran n = 10 dari distribusi eksponensial dengan λ = 2. Simulasikan eksperimen ini 1000 kali dan plot distribusi sampling dari estimasi L. Hitung galat baku estimasi dan interval kepercayaan 90%.

Ulangi eksperimen dengan beberapa nilai n yang berbeda dan buat plot galat baku versus n.

**Latihan 8.3** Di olahraga seperti hoki dan sepak bola, waktu antar gol kira-kira eksponensial. Jadi kamu bisa mengestimasi laju mencetak gol sebuah tim dengan mengamati jumlah gol yang mereka cetak dalam satu pertandingan. Proses estimasi ini sedikit berbeda dari menyampel waktu antar gol, jadi mari kita lihat cara kerjanya.

Tulis fungsi yang menerima laju mencetak gol, `lam`, dalam satuan gol per pertandingan, dan mensimulasikan satu pertandingan dengan membangkitkan waktu antar gol sampai total waktunya melebihi 1 pertandingan, lalu mengembalikan jumlah gol yang dicetak.

Tulis fungsi lain yang mensimulasikan banyak pertandingan, menyimpan estimasi-estimasi `lam`, lalu menghitung galat rerata dan RMSE-nya.

Apakah cara membuat estimasi ini bias? Plot distribusi sampling dari estimasi-estimasi itu dan interval kepercayaan 90%. Berapa galat bakunya? Apa yang terjadi pada galat sampling untuk nilai `lam` yang semakin besar?

## 8.7 Glosarium

- **estimation** (estimasi): proses menyimpulkan parameter sebuah distribusi dari sebuah sampel.
- **estimator**: statistik yang dipakai untuk mengestimasi sebuah parameter.
- **mean squared error** (MSE, galat kuadrat rata-rata): ukuran galat estimasi.
- **root mean squared error** (RMSE, akar galat kuadrat rata-rata): akar kuadrat dari MSE, representasi besaran galat tipikal yang lebih bermakna.
- **maximum likelihood estimator** (MLE, estimator kemungkinan maksimum): estimator yang menghitung estimasi titik yang paling mungkin benar.
- **bias** (bias suatu estimator): kecenderungan sebuah estimator untuk berada di atas atau di bawah nilai asli parameter, dirata-ratakan atas eksperimen yang diulang berkali-kali.
- **sampling error** (galat sampling): galat dalam estimasi karena terbatasnya ukuran sampel dan variasi karena kebetulan.
- **sampling bias** (bias sampling): galat dalam estimasi karena proses sampling yang tidak representatif terhadap populasi.
- **measurement error** (galat pengukuran): galat dalam estimasi karena ketidakakuratan dalam mengumpulkan atau mencatat data.
- **sampling distribution** (distribusi sampling): distribusi suatu statistik kalau eksperimen diulang berkali-kali.
- **standard error** (galat baku): RMSE dari suatu estimasi, yang mengkuantifikasi variabilitas akibat galat sampling (tapi bukan sumber galat lain).
- **confidence interval** (interval kepercayaan): interval yang merepresentasikan rentang yang diharapkan dari suatu estimator kalau eksperimen diulang berkali-kali.

---

**Selanjutnya:** [Bab 9: Uji Hipotesis](/thinkstats-bab-09) *(segera hadir)*
