> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 12: Analisis Deret Waktu


*Time series* (deret waktu) adalah urutan pengukuran dari sebuah sistem yang berubah terhadap waktu. Salah satu contoh terkenalnya adalah "grafik tongkat hoki" (*hockey stick graph*) yang menunjukkan rata-rata suhu global dari waktu ke waktu (lihat https://en.wikipedia.org/wiki/Hockey_stick_graph).

Contoh yang dipakai di bab ini berasal dari Zachary M. Jones, peneliti ilmu politik yang mempelajari pasar gelap ganja di Amerika Serikat (http://zmjones.com/marijuana). Ia mengumpulkan data dari sebuah situs bernama "Price of Weed" yang melakukan *crowdsourcing* informasi pasar: partisipan diminta melaporkan harga, jumlah, kualitas, dan lokasi transaksi ganja (http://www.priceofweed.com/). Tujuan proyeknya adalah menyelidiki efek keputusan kebijakan — seperti legalisasi — terhadap pasar. Proyek ini menarik buat saya karena menunjukkan bagaimana data dipakai untuk menjawab pertanyaan politik yang penting, seperti kebijakan narkoba.

Semoga bab ini menarik buat kamu, tapi saya manfaatkan kesempatan ini untuk menegaskan kembali pentingnya menjaga sikap profesional dalam analisis data. Apakah dan obat apa saja yang seharusnya ilegal adalah pertanyaan kebijakan publik yang penting dan sulit; keputusan kita seharusnya diinformasikan oleh data yang akurat dan dilaporkan dengan jujur.

Kode untuk bab ini ada di `timeseries.py`. Untuk info cara mengunduh dan menjalankan kodenya, lihat Bagian 0.2.

## 12.1 Impor dan pembersihan

Data yang saya unduh dari situsnya Mr. Jones ada di repositori buku ini. Kode berikut membacanya ke pandas DataFrame:

```python
transactions = pandas.read_csv('mj-clean.csv', parse_dates=[5])
```

`parse_dates` memberitahu `read_csv` untuk menafsirkan nilai di kolom 5 sebagai tanggal dan mengubahnya menjadi objek NumPy datetime64.

DataFrame-nya punya satu baris per transaksi yang dilaporkan, dengan kolom-kolom berikut:

- `city`: nama kota (string).
- `state`: singkatan negara bagian (dua huruf).
- `price`: harga yang dibayar, dalam dolar.
- `amount`: jumlah yang dibeli, dalam gram.
- `quality`: kualitas tinggi, sedang, atau rendah, sesuai laporan pembeli.
- `date`: tanggal laporan, diasumsikan tidak lama setelah tanggal pembelian.
- `ppg`: harga per gram, dalam dolar.
- `state.name`: nama negara bagian (string).
- `lat`: perkiraan garis lintang transaksi, berdasarkan nama kota.
- `lon`: perkiraan garis bujur transaksi.

Setiap transaksi adalah sebuah kejadian dalam waktu, jadi dataset ini bisa diperlakukan sebagai deret waktu. Tapi kejadiannya tidak berjarak sama dalam waktu; jumlah transaksi yang dilaporkan tiap hari bervariasi dari 0 sampai ratusan. Banyak metode analisis deret waktu mensyaratkan pengukurannya berjarak sama — atau setidaknya, segalanya jadi lebih gampang kalau berjarak sama.

Untuk mendemonstrasikan metode-metode ini, saya membagi dataset berdasarkan kualitas yang dilaporkan, lalu mengubah tiap kelompok menjadi deret berjarak sama dengan menghitung rata-rata harga per gram harian:

```python
def GroupByQualityAndDay(transactions):
    groups = transactions.groupby('quality')
    dailies = {}
    for name, group in groups:
        dailies[name] = GroupByDay(group)
    return dailies
```

`groupby` adalah metode DataFrame yang mengembalikan objek GroupBy, `groups`; dipakai dalam loop `for`, ia mengiterasi nama-nama kelompok dan DataFrame yang mewakilinya. Karena nilai `quality` adalah low, medium, dan high, kita dapat tiga kelompok dengan nama-nama itu.

Loop-nya mengiterasi tiap kelompok dan memanggil `GroupByDay`, yang menghitung rata-rata harga harian dan mengembalikan DataFrame baru:

```python
def GroupByDay(transactions, func=np.mean):
    grouped = transactions[['date', 'ppg']].groupby('date')
    daily = grouped.aggregate(func)
    daily['date'] = daily.index
    start = daily.date.iloc[0]
    one_year = np.timedelta64(1, 'Y')
    daily['years'] = (daily.date - start) / one_year
    return daily
```

> **Catatan penerjemah:** di buku asli tertulis `daily.date[0]`; di pandas modern akses posisi seperti itu diganti `.iloc[0]` agar tidak ambigu.

Parameter `transactions` adalah DataFrame berisi kolom `date` dan `ppg`. Kita pilih dua kolom itu, lalu kelompokkan berdasarkan tanggal.

Hasilnya, `grouped`, adalah pemetaan dari tiap tanggal ke DataFrame berisi harga-harga yang dilaporkan pada tanggal itu. `aggregate` adalah metode GroupBy yang mengiterasi kelompok-kelompok dan menerapkan sebuah fungsi ke tiap kolom kelompok; dalam kasus ini cuma ada satu kolom, `ppg`. Jadi hasil `aggregate` adalah DataFrame dengan satu baris per tanggal dan satu kolom, `ppg`.

Tanggal-tanggal di DataFrame ini disimpan sebagai objek NumPy datetime64, yang direpresentasikan sebagai integer 64-bit dalam satuan nanodetik. Untuk beberapa analisis berikutnya, akan lebih nyaman bekerja dengan waktu dalam satuan yang lebih manusiawi, seperti tahun. Jadi `GroupByDay` menambah kolom `date` dengan menyalin indeksnya, lalu menambah `years`, yang berisi jumlah tahun sejak transaksi pertama sebagai bilangan floating-point.

DataFrame hasilnya punya kolom `ppg`, `date`, dan `years`.

::: tip 💡 Konteks Indonesia
Contoh "Price of Weed" memang tidak ada padanannya di Indonesia, tapi *pola datanya* sangat familiar: laporan harga harian dari banyak titik, tidak berjarak sama, dan berisik. Padanan lokal yang paling dekat adalah **data harga pangan harian dari PIHPS** (Pusat Informasi Harga Pangan Strategis, Kementerian Pertanian) — harga cabai merah, bawang, beras, dan minyak di pasar-pasar seluruh Indonesia, diperbarui harian. Teknik di bab ini (rata-rata harian, rata-rata bergerak, deteksi musiman) bisa langsung kamu terapkan ke data harga cabai untuk melihat pola sebelum dan sesudah Lebaran.
:::

## 12.2 Membuat plot

Hasil dari `GroupByQualityAndDay` adalah pemetaan dari tiap kualitas ke DataFrame berisi harga harian. Berikut kode yang saya pakai untuk mem-plot ketiga deret waktu itu:

```python
thinkplot.PrePlot(rows=3)
for i, (name, daily) in enumerate(dailies.items()):
    thinkplot.SubPlot(i+1)
    title = 'price per gram ($)' if i==0 else ''
    thinkplot.Config(ylim=[0, 20], title=title)
    thinkplot.Scatter(daily.index, daily.ppg, s=10, label=name)
    if i == 2:
        pyplot.xticks(rotation=30)
    else:
        thinkplot.Config(xticks=[])
```

`PrePlot` dengan `rows=3` berarti kita akan membuat tiga subplot yang disusun dalam tiga baris. Loop-nya mengiterasi DataFrame-DataFrame dan membuat scatter plot untuk masing-masing. Deret waktu umumnya di-plot dengan segmen garis antar titik, tapi di kasus ini titik datanya banyak dan harganya sangat bervariasi, jadi menambah garis tidak membantu.

Karena label sumbu-x adalah tanggal, saya pakai `pyplot.xticks` untuk memutar "tick"-nya 30 derajat supaya lebih gampang dibaca.

*[Grafik 12.1: deret waktu harga harian per gram untuk ganja kualitas tinggi, sedang, dan rendah — tiga subplot scatter dengan sumbu-y 0–20 dolar.]*

Satu fitur yang tampak jelas di plot-plot ini adalah celah (*gap*) di sekitar November 2013. Mungkin pengumpulan data tidak aktif saat itu, atau datanya tidak tersedia. Kita akan membahas cara menangani data yang hilang ini nanti.

Secara visual, harga ganja kualitas tinggi kelihatannya menurun selama periode ini, dan harga kualitas sedang meningkat. Harga kualitas rendah mungkin juga meningkat, tapi lebih susah dipastikan, karena kelihatannya lebih volatil. Perlu diingat bahwa data kualitas dilaporkan oleh relawan, jadi tren dari waktu ke waktu bisa saja mencerminkan perubahan cara partisipan memakai label-label ini.

## 12.3 Regresi linear

Walaupun ada metode khusus untuk analisis deret waktu, untuk banyak masalah cara paling gampang untuk mulai adalah memakai perkakas umum seperti regresi linear. Fungsi berikut menerima DataFrame berisi harga harian dan menghitung *least squares fit*, lalu mengembalikan objek model dan results dari StatsModels:

```python
def RunLinearModel(daily):
    model = smf.ols('ppg ~ years', data=daily)
    results = model.fit()
    return model, results
```

Lalu kita bisa mengiterasi tiap kualitas dan mencocokkan model ke masing-masing:

```python
for name, daily in dailies.items():
    model, results = RunLinearModel(daily)
    print(name)
    regression.SummarizeResults(results)
```

Berikut hasilnya:

| kualitas | intercept | slope  | R2    |
|----------|-----------|--------|-------|
| high     | 13,450    | -0,708 | 0,444 |
| medium   | 8,879     | 0,283  | 0,050 |
| low      | 5,362     | 0,568  | 0,030 |

Slope yang diestimasi menunjukkan bahwa harga ganja kualitas tinggi turun sekitar 71 sen per tahun selama interval pengamatan; untuk kualitas sedang naik 28 sen per tahun, dan kualitas rendah naik 57 sen per tahun. Estimasi-estimasi ini semuanya signifikan secara statistik dengan *p-value* yang sangat kecil.

Nilai R2 untuk ganja kualitas tinggi adalah 0,44, artinya waktu sebagai variabel penjelas menjelaskan 44% variabilitas harga yang teramati. Untuk kualitas lainnya, perubahan harganya lebih kecil dan variabilitas harganya lebih tinggi, jadi nilai R2-nya lebih kecil (tapi tetap signifikan secara statistik).

Kode berikut mem-plot harga yang teramati dan nilai-nilai hasil fit:

```python
def PlotFittedValues(model, results, label=''):
    years = model.exog[:,1]
    values = model.endog
    thinkplot.Scatter(years, values, s=15, label=label)
    thinkplot.Plot(years, results.fittedvalues, label='model')
```

Seperti yang kita lihat di Bagian 11.8, `model` berisi `exog` dan `endog`, array NumPy berisi variabel eksogen (penjelas) dan endogen (terikat). `PlotFittedValues` membuat scatter plot titik-titik data dan line plot nilai-nilai hasil fit.

*[Grafik 12.2: deret waktu harga harian per gram untuk ganja kualitas tinggi beserta garis hasil fit kuadrat terkecil linear.]*

Modelnya kelihatan cocok secara linear dengan datanya; namun begitu, regresi linear bukan pilihan paling tepat untuk data ini:

- Pertama, tidak ada alasan mengharapkan tren jangka panjang berbentuk garis atau fungsi sederhana lainnya. Secara umum, harga ditentukan oleh penawaran dan permintaan, yang keduanya bervariasi terhadap waktu dengan cara yang tidak bisa diprediksi.
- Kedua, model regresi linear memberi bobot yang sama ke semua data, baik yang baru maupun yang lama. Untuk keperluan prediksi, seharusnya kita memberi bobot lebih besar ke data yang baru.
- Terakhir, salah satu asumsi regresi linear adalah residualnya adalah *noise* yang tidak berkorelasi. Dengan data deret waktu, asumsi ini sering salah karena nilai-nilai yang berurutan saling berkorelasi.

Bagian berikutnya menyajikan alternatif yang lebih cocok untuk data deret waktu.

## 12.4 Rata-rata bergerak

Sebagian besar analisis deret waktu didasarkan pada asumsi pemodelan bahwa deret yang teramati adalah jumlah dari tiga komponen:

- **Tren:** fungsi mulus yang menangkap perubahan yang bertahan lama.
- **Musiman** (*seasonality*): variasi periodik, bisa mencakup siklus harian, mingguan, bulanan, atau tahunan.
- **Noise:** variasi acak di sekitar tren jangka panjang.

Regresi adalah salah satu cara mengekstrak tren dari sebuah deret, seperti yang kita lihat di bagian sebelumnya. Tapi kalau trennya bukan fungsi sederhana, alternatif yang bagus adalah *moving average* (rata-rata bergerak). Rata-rata bergerak membagi deret menjadi wilayah-wilayah yang saling tumpang tindih, disebut *window* (jendela), dan menghitung rata-rata nilai-nilai di tiap jendela.

Salah satu rata-rata bergerak paling sederhana adalah *rolling mean* (rata-rata bergulir), yang menghitung rata-rata nilai-nilai di tiap jendela. Contohnya, kalau ukuran jendelanya 3, rolling mean menghitung rata-rata nilai 0 sampai 2, 1 sampai 3, 2 sampai 4, dan seterusnya.

pandas menyediakan metode `rolling`, yang menerima sebuah Series dan ukuran jendela lalu mengembalikan Series baru:

```python
>>> series = pandas.Series(np.arange(10))
>>> series.rolling(3).mean()
0    NaN
1    NaN
2    1.0
3    2.0
4    3.0
5    4.0
6    5.0
7    6.0
8    7.0
9    8.0
dtype: float64
```

> **Catatan penerjemah:** di buku asli (era pandas lama) ini ditulis `pandas.rolling_mean(series, 3)`. Di pandas modern fungsi itu sudah dihapus dan diganti metode `.rolling(n).mean()` seperti di atas. Hasilnya sama.

Dua nilai pertama adalah `nan`; nilai berikutnya adalah rata-rata tiga elemen pertama, 0, 1, dan 2. Nilai berikutnya adalah rata-rata 1, 2, dan 3. Dan seterusnya.

Sebelum bisa menerapkan rolling mean ke data ganja, kita harus menangani nilai yang hilang. Ada beberapa hari dalam interval pengamatan yang tidak punya transaksi yang dilaporkan untuk satu atau lebih kategori kualitas, plus ada periode di tahun 2013 ketika pengumpulan data tidak aktif.

Di DataFrame yang sudah kita pakai sejauh ini, tanggal-tanggal ini tidak ada; indeksnya melompati hari-hari tanpa data. Untuk analisis berikutnya, kita perlu merepresentasikan data yang hilang ini secara eksplisit. Caranya dengan "*reindexing*" DataFrame:

```python
dates = pandas.date_range(daily.index.min(), daily.index.max())
reindexed = daily.reindex(dates)
```

Baris pertama menghitung rentang tanggal yang mencakup setiap hari dari awal sampai akhir interval pengamatan. Baris kedua membuat DataFrame baru berisi semua data dari `daily`, tapi mencakup baris untuk semua tanggal, diisi dengan `nan`.

Sekarang kita bisa mem-plot rolling mean seperti ini:

```python
roll_mean = reindexed.ppg.rolling(30).mean()
thinkplot.Plot(roll_mean.index, roll_mean)
```

Ukuran jendelanya 30, jadi tiap nilai di `roll_mean` adalah rata-rata 30 nilai dari `reindexed.ppg`.

*[Grafik 12.3 (kiri): harga harian dan rolling mean 30 hari untuk ganja kualitas tinggi — garis rata-rata bergerak yang mulus menembus titik-titik data yang berisik.]*

Rolling mean tampaknya berhasil meredam noise dan mengekstrak trennya. 29 nilai pertama adalah `nan`, dan di mana pun ada nilai yang hilang, ia diikuti 29 `nan` lagi. Ada cara untuk mengisi celah-celah ini, tapi itu gangguan kecil.

Alternatifnya adalah *exponentially-weighted moving average* (EWMA, rata-rata bergerak berbobot eksponensial), yang punya dua keunggulan. Pertama, sesuai namanya, ia menghitung rata-rata berbobot di mana nilai paling baru punya bobot tertinggi dan bobot nilai-nilai sebelumnya menurun secara eksponensial. Kedua, implementasi EWMA di pandas menangani nilai yang hilang dengan lebih baik.

```python
ewma = reindexed.ppg.ewm(span=30).mean()
thinkplot.Plot(ewma.index, ewma)
```

> **Catatan penerjemah:** buku aslinya menulis `pandas.ewma(reindexed.ppg, span=30)`; fungsi itu sudah dihapus di pandas modern dan diganti metode `.ewm(span=30).mean()`.

Parameter *span* kurang-lebih berkorespondensi dengan ukuran jendela rata-rata bergerak; ia mengendalikan seberapa cepat bobotnya menurun, jadi ia menentukan berapa banyak titik yang memberi kontribusi tak-terabaikan ke tiap rata-rata.

*[Grafik 12.3 (kanan): EWMA dengan span 30 untuk data yang sama.]*

Hasilnya mirip dengan rolling mean di bagian-bagian yang keduanya terdefinisi, tapi EWMA tidak punya nilai yang hilang, jadi lebih gampang dipakai. Nilai-nilainya berisik di awal deret waktu, karena didasarkan pada lebih sedikit titik data.

## 12.5 Nilai yang hilang

Sekarang setelah kita mengkarakterisasi tren deret waktunya, langkah berikutnya adalah menyelidiki musiman, yaitu perilaku periodik. Data deret waktu berbasis perilaku manusia sering menunjukkan siklus harian, mingguan, bulanan, atau tahunan. Di bagian berikutnya saya menyajikan metode untuk menguji musiman, tapi metode-metode itu tidak bekerja baik dengan data yang hilang, jadi kita harus menyelesaikan masalah itu dulu.

Cara sederhana dan umum untuk mengisi data yang hilang adalah memakai rata-rata bergerak. Metode Series `fillna` melakukan persis yang kita mau:

```python
reindexed['ppg'] = reindexed.ppg.fillna(ewma)
```

Di mana pun `reindexed.ppg` adalah `nan`, `fillna` menggantinya dengan nilai yang bersesuaian dari `ewma`.

Kelemahan metode ini adalah ia meremehkan noise dalam deretnya. Kita bisa menyelesaikan masalah itu dengan menambahkan residual yang di-*resample*:

```python
resid = (reindexed.ppg - ewma).dropna()
fake_data = ewma + thinkstats2.Resample(resid, len(reindexed))
reindexed['ppg'] = reindexed.ppg.fillna(ewma)
```

`resid` berisi nilai-nilai residual, tidak termasuk hari-hari ketika `ppg` adalah `nan`. `fake_data` berisi jumlah dari rata-rata bergerak dan sampel acak residual. Terakhir, `fillna` mengganti `nan` dengan nilai dari `fake_data`.

*[Grafik 12.4: harga harian setelah data yang hilang diisi — titik-titik isiannya terlihat mirip dengan nilai aslinya secara visual.]*

Data isiannya terlihat mirip dengan nilai aslinya secara visual. Karena residual yang di-resample itu acak, hasilnya berbeda setiap kali; nanti kita akan lihat cara mengkarakterisasi galat yang ditimbulkan oleh nilai yang hilang.

## 12.6 Korelasi serial

Saat harga bervariasi dari hari ke hari, kamu mungkin berharap melihat pola. Kalau harganya tinggi pada hari Senin, kamu mungkin berharap ia tetap tinggi beberapa hari lagi; dan kalau rendah, kamu mungkin berharap ia tetap rendah. Pola seperti ini disebut *serial correlation* (korelasi serial), karena tiap nilai berkorelasi dengan nilai berikutnya dalam deret.

Untuk menghitung korelasi serial, kita bisa menggeser deret waktu dengan interval yang disebut *lag*, lalu menghitung korelasi deret yang digeser dengan deret aslinya:

```python
def SerialCorr(series, lag=1):
    xs = series[lag:]
    ys = series.shift(lag)[lag:]
    corr = thinkstats2.Corr(xs, ys)
    return corr
```

Setelah digeser, `lag` nilai pertama adalah `nan`, jadi saya pakai slice untuk membuangnya sebelum menghitung `Corr`.

Kalau kita terapkan `SerialCorr` ke data harga mentah dengan lag 1, kita dapat korelasi serial 0,48 untuk kategori kualitas tinggi, 0,16 untuk sedang, dan 0,10 untuk rendah. Di deret waktu manapun yang punya tren jangka panjang, kita berharap melihat korelasi serial yang kuat; contohnya, kalau harga sedang turun, kita berharap melihat nilai di atas rata-rata di paruh pertama deret dan nilai di bawah rata-rata di paruh kedua.

Lebih menarik untuk melihat apakah korelasinya bertahan kalau trennya dihilangkan. Contohnya, kita bisa menghitung residual dari EWMA lalu menghitung korelasi serialnya:

```python
ewma = reindexed.ppg.ewm(span=30).mean()
resid = reindexed.ppg - ewma
corr = SerialCorr(resid, 1)
```

Dengan lag=1, korelasi serial untuk data yang trennya sudah dihilangkan (*de-trended*) adalah -0,022 untuk kualitas tinggi, -0,015 untuk sedang, dan 0,036 untuk rendah. Nilai-nilai ini kecil, menunjukkan bahwa praktis tidak ada korelasi serial satu hari dalam deret ini.

Untuk memeriksa musiman mingguan, bulanan, dan tahunan, saya menjalankan analisisnya lagi dengan lag yang berbeda. Berikut hasilnya:

| lag | high   | medium | low     |
|-----|--------|--------|---------|
| 1   | -0,029 | -0,014 | 0,034   |
| 7   | 0,02   | -0,042 | -0,0097 |
| 30  | 0,014  | -0,0064| -0,013  |
| 365 | 0,045  | 0,015  | 0,033   |

Di bagian berikutnya kita akan menguji apakah korelasi-korelasi ini signifikan secara statistik (jawabannya: tidak), tapi untuk saat ini kita bisa menyimpulkan sementara bahwa tidak ada pola musiman yang substansial dalam deret-deret ini, setidaknya tidak dengan lag-lag ini.

::: tip 💡 Konteks Indonesia
Cara membaca tabel lag di atas: lag 7 menguji "apakah harga hari ini mirip harga tepat seminggu lalu?" (pola mingguan), lag 30 pola bulanan, lag 365 pola tahunan. Di Indonesia, pola musiman yang *nyata* justru gampang ditemukan: harga cabai merah biasanya melonjak menjelang Lebaran dan Natal, tarif angkutan naik saat arus mudik, dan penjualan jas hujan/payung memuncak saat musim hujan (sekitar November–Maret). Kalau kamu menerapkan teknik bab ini ke data PIHPS, lag 365-mu kemungkinan besar akan "berbunyi" — korelasinya signifikan — tidak seperti data ganja di bab ini yang datar-datar saja.
:::

## 12.7 Autokorelasi

Kalau kamu menduga sebuah deret mungkin punya korelasi serial, tapi tidak tahu lag mana yang harus diuji, kamu bisa menguji semuanya! *Autocorrelation function* (fungsi autokorelasi) adalah fungsi yang memetakan lag ke korelasi serial dengan lag tersebut. "Autokorelasi" adalah nama lain untuk korelasi serial, lebih sering dipakai ketika lag-nya bukan 1.

StatsModels, yang kita pakai untuk regresi linear di Bagian 11.1, juga menyediakan fungsi untuk analisis deret waktu, termasuk `acf`, yang menghitung fungsi autokorelasi:

```python
import statsmodels.tsa.stattools as smtsa
acf = smtsa.acf(filled.resid, nlags=365, unbiased=True)
```

`acf` menghitung korelasi serial dengan lag dari 0 sampai `nlags`. Flag `unbiased` memberitahu `acf` untuk mengoreksi estimasinya terhadap ukuran sampel. Hasilnya adalah array berisi korelasi. Kalau kita pilih harga harian untuk kualitas tinggi, dan mengekstrak korelasi untuk lag 1, 7, 30, dan 365, kita bisa mengonfirmasi bahwa `acf` dan `SerialCorr` menghasilkan hasil yang kurang-lebih sama:

```python
>>> acf[0], acf[1], acf[7], acf[30], acf[365]
(1.0, -0.029, 0.020, 0.014, 0.044)
```

Dengan lag=0, `acf` menghitung korelasi deret dengan dirinya sendiri, yang selalu 1.

*[Grafik 12.5 (kiri): fungsi autokorelasi untuk tiga kategori kualitas dengan nlags=40 — sebagian besar titik berada di dalam wilayah abu-abu (batas signifikansi 5%).]*

Wilayah abu-abu menunjukkan variabilitas normal yang kita harapkan kalau tidak ada autokorelasi yang sebenarnya; apapun yang jatuh di luar rentang ini signifikan secara statistik, dengan *p-value* kurang dari 5%. Karena tingkat positif palsunya 5%, dan kita menghitung 120 korelasi (40 lag untuk masing-masing 3 deret waktu), kita berharap melihat sekitar 6 titik di luar wilayah ini. Faktanya, ada 7. Kita simpulkan bahwa tidak ada autokorelasi dalam deret-deret ini yang tidak bisa dijelaskan oleh kebetulan.

Saya menghitung wilayah abu-abu itu dengan me-*resample* residualnya. Kamu bisa lihat kode saya di `timeseries.py`; fungsinya bernama `SimulateAutocorrelation`.

Untuk melihat seperti apa fungsi autokorelasi ketika ada komponen musiman, saya membangkitkan data simulasi dengan menambahkan siklus mingguan. Dengan asumsi permintaan ganja lebih tinggi di akhir pekan, kita mungkin berharap harganya lebih tinggi. Untuk mensimulasikan efek ini, saya memilih tanggal-tanggal yang jatuh pada hari Jumat atau Sabtu dan menambahkan jumlah acak ke harganya, diambil dari distribusi uniform dari $0 sampai $2.

```python
def AddWeeklySeasonality(daily):
    frisat = (daily.index.dayofweek==4) | (daily.index.dayofweek==5)
    fake = daily.copy()
    fake.loc[frisat, 'ppg'] += np.random.uniform(0, 2, frisat.sum())
    return fake
```

> **Catatan penerjemah:** buku aslinya menulis `fake.ppg[frisat] += ...`; di pandas modern penugasan berantai seperti itu diganti `.loc[baris, 'kolom']` agar tidak memicu *SettingWithCopyWarning*.

`frisat` adalah Series boolean, True kalau harinya adalah Jumat atau Sabtu. `fake` adalah DataFrame baru, awalnya salinan dari `daily`, yang kita modifikasi dengan menambahkan nilai acak ke `ppg`. `frisat.sum()` adalah jumlah total hari Jumat dan Sabtu, yaitu jumlah nilai acak yang harus kita bangkitkan.

*[Grafik 12.5 (kanan): fungsi autokorelasi untuk harga dengan musiman mingguan yang disimulasikan — korelasinya memuncak di kelipatan 7.]*

Seperti yang diharapkan, korelasinya paling tinggi ketika lag-nya kelipatan 7. Untuk kualitas tinggi dan sedang, korelasi barunya signifikan secara statistik. Untuk kualitas rendah tidak, karena residual di kategori ini besar; efeknya harus lebih besar supaya kelihatan menembus noise-nya.

## 12.8 Prediksi

Analisis deret waktu bisa dipakai untuk menyelidiki, dan kadang menjelaskan, perilaku sistem yang bervariasi terhadap waktu. Ia juga bisa membuat prediksi.

Regresi linear yang kita pakai di Bagian 12.3 bisa dipakai untuk prediksi. Kelas `RegressionResults` menyediakan `predict`, yang menerima DataFrame berisi variabel penjelas dan mengembalikan deret prediksi. Berikut kodenya:

```python
def GenerateSimplePrediction(results, years):
    n = len(years)
    inter = np.ones(n)
    d = dict(Intercept=inter, years=years)
    predict_df = pandas.DataFrame(d)
    predict = results.predict(predict_df)
    return predict
```

`results` adalah objek `RegressionResults`; `years` adalah deret nilai waktu yang ingin kita buatkan prediksinya. Fungsinya membangun DataFrame, meneruskannya ke `predict`, dan mengembalikan hasilnya.

Kalau yang kita mau cuma satu prediksi tebakan terbaik, selesai. Tapi untuk sebagian besar keperluan, penting untuk mengkuantifikasi galat. Dengan kata lain, kita ingin tahu seberapa akurat kira-kira prediksinya.

Ada tiga sumber galat yang perlu kita perhitungkan:

- **Galat sampling** (*sampling error*): prediksinya didasarkan pada parameter yang diestimasi, yang bergantung pada variasi acak dalam sampel. Kalau eksperimennya diulang, kita berharap estimasinya bervariasi.
- **Variasi acak** (*random variation*): sekalipun parameter yang diestimasi sempurna, data yang teramati bervariasi secara acak di sekitar tren jangka panjang, dan kita berharap variasi ini berlanjut di masa depan.
- **Galat pemodelan** (*modeling error*): kita sudah melihat bukti bahwa tren jangka panjangnya tidak linear, jadi prediksi berbasis model linear pada akhirnya akan gagal.

Sumber galat lain yang perlu dipertimbangkan adalah kejadian tak terduga di masa depan. Harga produk pertanian dipengaruhi cuaca, dan semua harga dipengaruhi politik dan hukum. Saat saya menulis ini, ganja legal di dua negara bagian dan legal untuk keperluan medis di 20 negara bagian lainnya. Kalau lebih banyak negara bagian melegalkannya, harganya kemungkinan turun. Tapi kalau pemerintah federal menindak, harganya bisa naik.

Galat pemodelan dan kejadian tak terduga di masa depan susah dikuantifikasi. Galat sampling dan variasi acak lebih gampang ditangani, jadi kita kerjakan itu dulu.

Untuk mengkuantifikasi galat sampling, saya memakai *resampling*, seperti yang kita lakukan di Bagian 10.4. Seperti biasa, tujuannya adalah memakai observasi aktual untuk mensimulasikan apa yang akan terjadi kalau eksperimennya diulang. Simulasinya didasarkan pada asumsi bahwa parameter yang diestimasi sudah benar, tapi residual acaknya bisa saja berbeda. Berikut fungsi yang menjalankan simulasinya:

```python
def SimulateResults(daily, iters=101):
    model, results = RunLinearModel(daily)
    fake = daily.copy()
    result_seq = []
    for i in range(iters):
        fake.ppg = results.fittedvalues + Resample(results.resid)
        _, fake_results = RunLinearModel(fake)
        result_seq.append(fake_results)
    return result_seq
```

`daily` adalah DataFrame berisi harga-harga yang teramati; `iters` adalah jumlah simulasi yang dijalankan.

`SimulateResults` memakai `RunLinearModel`, dari Bagian 12.3, untuk mengestimasi slope dan intercept dari nilai-nilai yang teramati.

Setiap melewati loop, ia membangkitkan dataset "palsu" dengan me-resample residual dan menambahkannya ke nilai-nilai hasil fit. Lalu ia menjalankan model linear pada data palsu dan menyimpan objek `RegressionResults`-nya.

Langkah berikutnya adalah memakai hasil-hasil simulasi untuk membangkitkan prediksi:

```python
def GeneratePredictions(result_seq, years, add_resid=False):
    n = len(years)
    d = dict(Intercept=np.ones(n), years=years, years2=years**2)
    predict_df = pandas.DataFrame(d)
    predict_seq = []
    for fake_results in result_seq:
        predict = fake_results.predict(predict_df)
        if add_resid:
            predict += thinkstats2.Resample(fake_results.resid, n)
        predict_seq.append(predict)
    return predict_seq
```

`GeneratePredictions` menerima deret hasil dari langkah sebelumnya, plus `years`, yaitu deret float yang menentukan interval untuk membangkitkan prediksi, dan `add_resid`, yang menunjukkan apakah residual yang di-resample harus ditambahkan ke prediksi garis lurus. `GeneratePredictions` mengiterasi deret `RegressionResults` dan membangkitkan deret prediksi.

Terakhir, berikut kode yang mem-plot interval kepercayaan 90% untuk prediksi-prediksinya:

```python
def PlotPredictions(daily, years, iters=101, percent=90):
    result_seq = SimulateResults(daily, iters=iters)
    p = (100 - percent) / 2
    percents = p, 100-p
    predict_seq = GeneratePredictions(result_seq, years, True)
    low, high = thinkstats2.PercentileRows(predict_seq, percents)
    thinkplot.FillBetween(years, low, high, alpha=0.3, color='gray')
    predict_seq = GeneratePredictions(result_seq, years, False)
    low, high = thinkstats2.PercentileRows(predict_seq, percents)
    thinkplot.FillBetween(years, low, high, alpha=0.5, color='gray')
```

`PlotPredictions` memanggil `GeneratePredictions` dua kali: sekali dengan `add_resid=True` dan sekali lagi dengan `add_resid=False`. Ia memakai `PercentileRows` untuk memilih persentil ke-5 dan ke-95 untuk tiap tahun, lalu mem-plot wilayah abu-abu di antara batas-batas ini.

*[Grafik 12.6: prediksi berbasis fit linear untuk kualitas tinggi — wilayah abu-abu gelap menunjukkan interval kepercayaan galat sampling, wilayah yang lebih terang menunjukkan galat prediksi (sampling + variasi acak).]*

Wilayah abu-abu gelap merepresentasikan interval kepercayaan 90% untuk galat sampling; yaitu, ketidakpastian tentang slope dan intercept yang diestimasi akibat sampling.

Wilayah yang lebih terang menunjukkan interval kepercayaan 90% untuk galat prediksi, yaitu jumlah dari galat sampling dan variasi acak.

Wilayah-wilayah ini mengkuantifikasi galat sampling dan variasi acak, tapi bukan galat pemodelan. Secara umum galat pemodelan susah dikuantifikasi, tapi dalam kasus ini kita bisa menangani setidaknya satu sumber galat, yaitu kejadian eksternal yang tidak bisa diprediksi.

Model regresinya didasarkan pada asumsi bahwa sistemnya *stationary* (stasioner); yaitu, bahwa parameter-parameter model tidak berubah terhadap waktu. Secara spesifik, ia mengasumsikan slope dan intercept-nya konstan, begitu juga distribusi residualnya.

Tapi kalau melihat rata-rata bergerak di Grafik 12.3, kelihatannya slope-nya berubah setidaknya sekali selama interval pengamatan, dan varians residualnya kelihatan lebih besar di paruh pertama daripada paruh kedua.

Akibatnya, parameter yang kita dapat bergantung pada interval yang kita amati. Untuk melihat seberapa besar efeknya terhadap prediksi, kita bisa memperluas `SimulateResults` untuk memakai interval pengamatan dengan tanggal mulai dan tanggal akhir yang berbeda. Implementasi saya ada di `timeseries.py`.

*[Grafik 12.7: prediksi untuk kategori kualitas sedang dengan interval pengamatan yang bervariasi — wilayah abu-abu paling terang mencakup ketidakpastian akibat galat sampling, variasi acak, dan variasi interval pengamatan.]*

Wilayah abu-abu paling terang menunjukkan interval kepercayaan yang mencakup ketidakpastian akibat galat sampling, variasi acak, dan variasi interval pengamatan.

Model berbasis seluruh interval punya slope positif, menunjukkan bahwa harga-harga meningkat. Tapi interval paling baru menunjukkan tanda-tanda harga menurun, jadi model berbasis data paling baru punya slope negatif. Akibatnya, interval prediktif yang paling lebar mencakup kemungkinan harga menurun selama setahun ke depan.

::: tip 💡 Konteks Indonesia
Pelajaran paling praktis dari bagian ini: **prediksi yang jujur selalu menyertakan rentang ketidakpastiannya**. Kalau kamu memprediksi harga cabai bulan depan "Rp45.000/kg", itu tebakan; kalau kamu bilang "kemungkinan besar antara Rp38.000–Rp55.000, tapi rentangnya melebar kalau ada cuaca ekstrem atau kebijakan impor mendadak", itu analisis. Tiga sumber galat di atas (sampling, variasi acak, pemodelan) berlaku umum — dan di Indonesia, sumber keempatnya, "kejadian tak terduga" (banjir, gagal panen, perubahan kebijakan), sering kali justru yang paling menentukan.
:::

## 12.9 Bacaan lanjutan

Analisis deret waktu adalah topik yang besar; bab ini baru menggaruk permukaannya. Perkakas penting untuk bekerja dengan data deret waktu adalah *autoregression* (autoregresi), yang tidak saya bahas di sini, terutama karena ternyata tidak berguna untuk contoh data yang saya pakai.

Tapi begitu kamu menguasai materi bab ini, kamu sudah siap belajar tentang autoregresi. Satu sumber yang saya rekomendasikan adalah bukunya Philipp Janert, *Data Analysis with Open Source Tools*, O'Reilly Media, 2011. Babnya tentang analisis deret waktu melanjutkan tepat di titik bab ini berhenti.

## 12.10 Latihan

Solusi saya untuk latihan-latihan ini ada di `chap12soln.py`.

**Latihan 12.1** Model linear yang saya pakai di bab ini punya kelemahan yang jelas: ia linear, dan tidak ada alasan mengharapkan harga berubah secara linear terhadap waktu. Kita bisa menambah fleksibilitas model dengan menambahkan suku kuadratik, seperti yang kita lakukan di Bagian 11.3.

Pakai model kuadratik untuk mencocokkan deret waktu harga harian, dan pakai modelnya untuk membangkitkan prediksi. Kamu harus menulis versi `RunLinearModel` yang menjalankan model kuadratik itu, tapi setelah itu kamu seharusnya bisa memakai ulang kode di `timeseries.py` untuk membangkitkan prediksi.

**Latihan 12.2** Tulis definisi untuk sebuah kelas bernama `SerialCorrelationTest` yang memperluas `HypothesisTest` dari Bagian 9.2. Ia harus menerima sebuah deret dan sebuah lag sebagai data, menghitung korelasi serial deret itu dengan lag yang diberikan, lalu menghitung *p-value* dari korelasi yang teramati.

Pakai kelas ini untuk menguji apakah korelasi serial dalam data harga mentah signifikan secara statistik. Uji juga residual dari model linear dan (kalau kamu mengerjakan latihan sebelumnya) model kuadratik.

**Latihan 12.3** Ada beberapa cara memperluas model EWMA untuk membangkitkan prediksi. Salah satu yang paling sederhana kira-kira seperti ini:

1. Hitung EWMA dari deret waktu dan pakai titik terakhir sebagai *intercept*, `inter`.
2. Hitung EWMA dari selisih antara elemen-elemen berurutan dalam deret waktu dan pakai titik terakhir sebagai *slope*, `slope`.
3. Untuk memprediksi nilai di waktu-waktu mendatang, hitung `inter + slope * dt`, di mana `dt` adalah selisih antara waktu prediksi dan waktu observasi terakhir.

Pakai metode ini untuk membangkitkan prediksi setahun setelah observasi terakhir. Beberapa petunjuk:

- Pakai `timeseries.FillMissing` untuk mengisi nilai yang hilang sebelum menjalankan analisis ini. Dengan begitu waktu antar elemen yang berurutan konsisten.
- Pakai `Series.diff` untuk menghitung selisih antara elemen-elemen berurutan.
- Pakai `reindex` untuk memperluas indeks DataFrame ke masa depan.
- Pakai `fillna` untuk menaruh nilai-nilai prediksimu ke dalam DataFrame.

## 12.11 Glosarium

- *time series* (deret waktu): dataset di mana tiap nilai diasosiasikan dengan sebuah *timestamp*, sering berupa deret pengukuran beserta waktu pengumpulannya.
- *window* (jendela): urutan nilai-nilai berurutan dalam sebuah deret waktu, sering dipakai untuk menghitung rata-rata bergerak.
- *moving average* (rata-rata bergerak): salah satu dari beberapa statistik yang dimaksudkan untuk mengestimasi tren yang mendasari sebuah deret waktu dengan menghitung rata-rata (dalam berbagai arti) untuk deret jendela yang saling tumpang tindih.
- *rolling mean* (rata-rata bergulir): rata-rata bergerak yang didasarkan pada nilai rata-rata di tiap jendela.
- *exponentially-weighted moving average* (EWMA, rata-rata bergerak berbobot eksponensial): rata-rata bergerak yang didasarkan pada rata-rata berbobot yang memberi bobot tertinggi ke nilai-nilai paling baru, dan bobot yang menurun secara eksponensial ke nilai-nilai yang lebih lama.
- *span*: parameter EWMA yang menentukan seberapa cepat bobotnya menurun.
- *serial correlation* (korelasi serial): korelasi antara sebuah deret waktu dan versi dirinya yang digeser atau di-*lag*.
- *lag*: besarnya geseran dalam sebuah korelasi serial atau autokorelasi.
- *autocorrelation* (autokorelasi): istilah yang lebih umum untuk korelasi serial dengan lag berapapun.
- *autocorrelation function* (fungsi autokorelasi): fungsi yang memetakan lag ke korelasi serial.
- *stationary* (stasioner): sebuah model disebut stasioner kalau parameternya dan distribusi residualnya tidak berubah terhadap waktu.

---

**Selanjutnya:** [Bab 13: Analisis Survival](/thinkstats-bab-13) *(segera hadir)*
