> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 11: Regresi


Fit *kuadrat terkecil linear* (*linear least squares fit*) di bab sebelumnya adalah contoh regresi (*regression*) — yaitu masalah yang lebih umum: mencocokkan segala macam model ke segala macam data. Pemakaian istilah "regresi" ini sebenarnya kecelakaan sejarah; hubungannya dengan arti asli kata itu cuma tidak langsung.

Tujuan analisis regresi (*regression analysis*) adalah mendeskripsikan hubungan antara satu set variabel yang disebut variabel dependen (*dependent variables*), dengan set variabel lain yang disebut variabel independen atau variabel penjelas (*independent / explanatory variables*).

Di bab sebelumnya kita memakai usia ibu sebagai variabel penjelas untuk memprediksi berat lahir sebagai variabel dependen. Kalau cuma ada satu variabel dependen dan satu variabel penjelas, itu namanya regresi sederhana (*simple regression*). Di bab ini kita naik ke regresi berganda (*multiple regression*), dengan lebih dari satu variabel penjelas. Kalau variabel dependennya lebih dari satu, itu namanya regresi multivariat (*multivariate regression*).

Kalau hubungan antara variabel dependen dan variabel penjelas bersifat linear, itu namanya regresi linear (*linear regression*). Misalnya, kalau variabel dependennya *y* dan variabel penjelasnya *x1* dan *x2*, kita menulis model regresi linear berikut:

*y = β0 + β1 x1 + β2 x2 + ε*

di mana *β0* adalah intersep (*intercept*), *β1* adalah parameter yang berkaitan dengan *x1*, *β2* adalah parameter yang berkaitan dengan *x2*, dan *ε* adalah residu (*residual*) akibat variasi acak atau faktor lain yang tidak diketahui.

Dengan sekumpulan nilai *y* dan sekumpulan nilai *x1* dan *x2*, kita bisa menemukan parameter *β0*, *β1*, dan *β2* yang meminimalkan jumlah *ε²*. Proses ini disebut kuadrat terkecil biasa (*ordinary least squares*, OLS). Perhitungannya mirip dengan `thinkstats2.LeastSquares`, tapi digeneralisasi untuk menangani lebih dari satu variabel penjelas. Detailnya bisa kamu baca di https://en.wikipedia.org/wiki/Ordinary_least_squares

Kode untuk bab ini ada di `regression.py`. Untuk info soal mengunduh dan memakai kode ini, lihat Bagian 0.2.

## 11.1 StatsModels

Di bab sebelumnya saya memperkenalkan `thinkstats2.LeastSquares`, implementasi regresi linear sederhana yang dibuat supaya gampang dibaca. Untuk regresi berganda kita beralih ke StatsModels, paket Python yang menyediakan beberapa bentuk regresi dan analisis lainnya. Kalau kamu pakai Anaconda, StatsModels sudah tersedia; kalau tidak, mungkin perlu di-install dulu.

Sebagai contoh, saya akan menjalankan model dari bab sebelumnya dengan StatsModels:

```python
import statsmodels.formula.api as smf
live, firsts, others = first.MakeFrames()
formula = 'totalwgt_lb ~ agepreg'
model = smf.ols(formula, data=live)
results = model.fit()
```

statsmodels menyediakan dua antarmuka (API); API "formula" memakai string untuk mengidentifikasi variabel dependen dan variabel penjelas. Ia memakai sintaks yang disebut patsy; di contoh ini, operator `~` memisahkan variabel dependen di kiri dari variabel penjelas di kanan.

`smf.ols` menerima string formula dan DataFrame `live`, lalu mengembalikan objek OLS yang merepresentasikan model. Nama `ols` adalah singkatan dari "*ordinary least squares*" (kuadrat terkecil biasa).

Metode `fit` mencocokkan model ke data dan mengembalikan objek `RegressionResults` yang berisi hasilnya.

Hasilnya juga tersedia sebagai atribut. `params` adalah Series yang memetakan nama variabel ke parameternya, jadi kita bisa mengambil intersep dan kemiringan (*slope*) seperti ini:

```python
inter = results.params['Intercept']
slope = results.params['agepreg']
```

Parameter yang diestimasi adalah 6,83 dan 0,0175 — sama dengan hasil dari `LeastSquares`.

`pvalues` adalah Series yang memetakan nama variabel ke nilai-p (*p-value*) yang berkaitan, jadi kita bisa memeriksa apakah kemiringan yang diestimasi signifikan secara statistik:

```python
slope_pvalue = results.pvalues['agepreg']
```

Nilai-p yang berkaitan dengan `agepreg` adalah 5,7e-11, kurang dari 0,001, sesuai dugaan.

`results.rsquared` berisi *R²*, yang nilainya 0,0047. `results` juga menyediakan `f_pvalue`, yaitu nilai-p yang berkaitan dengan model secara keseluruhan — mirip seperti menguji apakah *R²* signifikan secara statistik.

Dan `results` menyediakan `resid`, sekumpulan residu, dan `fittedvalues`, sekumpulan nilai prediksi (*fitted values*) yang berkaitan dengan `agepreg`.

Objek results menyediakan `summary()`, yang menampilkan hasil dalam format yang gampang dibaca.

```python
print(results.summary())
```

Tapi ia mencetak banyak info yang (belum) relevan, jadi saya pakai fungsi yang lebih sederhana bernama `SummarizeResults`. Berikut hasil model ini:

```
Intercept   6.83    (0)
agepreg     0.0175  (5.72e-11)
R^2 0.004738
Std(ys) 1.408
Std(res) 1.405
```

`Std(ys)` adalah simpangan baku (*standard deviation*) variabel dependen — yaitu RMSE kalau kamu harus menebak berat lahir tanpa bantuan variabel penjelas apa pun. `Std(res)` adalah simpangan baku residu — yaitu RMSE kalau tebakanmu dibantu oleh usia ibu. Seperti yang sudah kita lihat, mengetahui usia ibu tidak memberikan perbaikan berarti pada prediksi.

## 11.2 Regresi Berganda

Di Bagian 4.5 kita melihat bahwa bayi pertama cenderung lebih ringan daripada yang lain, dan efek ini signifikan secara statistik. Tapi hasilnya aneh, karena tidak ada mekanisme yang jelas yang menyebabkan bayi pertama lebih ringan. Jadi kita mungkin bertanya-tanya apakah hubungan ini semu (*spurious*).

Faktanya, ada penjelasan yang mungkin untuk efek ini. Kita sudah melihat bahwa berat lahir bergantung pada usia ibu, dan wajar kalau ibu dari bayi pertama lebih muda daripada yang lain.

Dengan beberapa perhitungan kita bisa memeriksa apakah penjelasan ini masuk akal. Lalu kita akan memakai regresi berganda untuk menyelidikinya lebih teliti. Pertama, mari lihat seberapa besar perbedaan beratnya:

```python
diff_weight = firsts.totalwgt_lb.mean() - others.totalwgt_lb.mean()
```

Bayi pertama 0,125 lbs lebih ringan, atau 2 ons. Dan perbedaan usianya:

```python
diff_age = firsts.agepreg.mean() - others.agepreg.mean()
```

Ibu dari bayi pertama 3,59 tahun lebih muda. Menjalankan model linear lagi, kita dapatkan perubahan berat lahir sebagai fungsi usia:

```python
results = smf.ols('totalwgt_lb ~ agepreg', data=live).fit()
slope = results.params['agepreg']
```

Kemiringannya 0,0175 pon per tahun. Kalau kita kalikan kemiringan dengan perbedaan usia, kita dapatkan perkiraan perbedaan berat lahir antara bayi pertama dan yang lain, yang disebabkan oleh usia ibu:

```python
slope * diff_age
```

Hasilnya 0,063 — kira-kira setengah dari perbedaan yang teramati. Jadi kita simpulkan, untuk sementara, bahwa perbedaan berat lahir yang teramati sebagian bisa dijelaskan oleh perbedaan usia ibu.

Dengan regresi berganda, kita bisa mengeksplorasi hubungan-hubungan ini secara lebih sistematis.

```python
live['isfirst'] = live.birthord == 1
formula = 'totalwgt_lb ~ isfirst'
results = smf.ols(formula, data=live).fit()
```

Baris pertama membuat kolom baru bernama `isfirst` yang bernilai True untuk bayi pertama dan false untuk yang lain. Lalu kita mencocokkan model memakai `isfirst` sebagai variabel penjelas.

Berikut hasilnya:

```
Intercept       7.33    (0)
isfirst[T.True] -0.125  (2.55e-05)
R^2 0.00196
```

Karena `isfirst` adalah boolean, `ols` memperlakukannya sebagai variabel kategorikal (*categorical variable*) — artinya nilainya jatuh ke dalam kategori, seperti True dan False, dan tidak seharusnya diperlakukan sebagai angka. Parameter yang diestimasi adalah efek pada berat lahir ketika `isfirst` true, jadi hasilnya, −0,125 lbs, adalah perbedaan berat lahir antara bayi pertama dan yang lain.

Kemiringan dan intersepnya signifikan secara statistik, artinya kecil kemungkinan terjadi secara kebetulan, tapi nilai *R²* model ini kecil — artinya `isfirst` tidak menjelaskan sebagian besar variasi berat lahir.

Hasilnya mirip dengan `agepreg`:

```
Intercept   6.83    (0)
agepreg     0.0175  (5.72e-11)
R^2 0.004738
```

Sekali lagi, parameter-parameternya signifikan secara statistik, tapi *R²*-nya rendah.

Model-model ini mengonfirmasi hasil yang sudah kita lihat. Tapi sekarang kita bisa mencocokkan satu model yang mencakup kedua variabel. Dengan formula `totalwgt_lb ~ isfirst + agepreg`, kita dapatkan:

```
Intercept       6.91    (0)
isfirst[T.True] -0.0698 (0.0253)
agepreg         0.0154  (3.93e-08)
R^2 0.005289
```

Di model gabungan, parameter untuk `isfirst` mengecil kira-kira setengahnya — artinya sebagian dari efek semu `isfirst` sebenarnya dijelaskan oleh `agepreg`. Dan nilai-p untuk `isfirst` sekitar 2,5%, yang berada di batas signifikansi statistik.

*R²* model ini sedikit lebih tinggi, yang menunjukkan bahwa kedua variabel bersama-sama menjelaskan lebih banyak variasi berat lahir daripada masing-masing sendiri (tapi tidak jauh lebih banyak).

## 11.3 Hubungan Nonlinear

Mengingat kontribusi `agepreg` mungkin bersifat nonlinear, kita bisa mempertimbangkan menambah variabel untuk menangkap lebih banyak hubungan ini. Salah satu opsinya adalah membuat kolom `agepreg2` yang berisi kuadrat usia:

```python
live['agepreg2'] = live.agepreg**2
formula = 'totalwgt_lb ~ isfirst + agepreg + agepreg2'
```

Sekarang dengan mengestimasi parameter untuk `agepreg` dan `agepreg2`, kita sebenarnya mencocokkan parabola:

```
Intercept       5.69    (1.38e-86)
isfirst[T.True] -0.0504 (0.109)
agepreg         0.112   (3.23e-07)
agepreg2        -0.00185 (8.8e-06)
R^2 0.007462
```

Parameter `agepreg2` negatif, jadi parabolanya melengkung ke bawah — konsisten dengan bentuk garis-garis di *[Gambar 10.2]*.

Model kuadratik `agepreg` menjelaskan lebih banyak variabilitas berat lahir; parameter untuk `isfirst` lebih kecil di model ini, dan tidak lagi signifikan secara statistik.

Memakai variabel hasil komputasi seperti `agepreg2` adalah cara umum untuk mencocokkan polinomial dan fungsi lain ke data. Proses ini masih dianggap regresi linear, karena variabel dependen adalah fungsi linear dari variabel-variabel penjelas — terlepas dari apakah beberapa variabel itu fungsi nonlinear dari variabel lain.

Tabel berikut merangkum hasil regresi-regresi ini:

| | isfirst | agepreg | agepreg2 | R² |
|---|---|---|---|---|
| Model 1 | −0,125 * | – | – | 0,002 |
| Model 2 | – | 0,0175 * | – | 0,0047 |
| Model 3 | −0,0698 (0,025) | 0,0154 * | – | 0,0053 |
| Model 4 | −0,0504 (0,11) | 0,112 * | −0,00185 * | 0,0075 |

Kolom-kolom tabel ini adalah variabel penjelas dan koefisien determinasi (*coefficient of determination*), *R²*. Setiap entri adalah parameter yang diestimasi dan salah satu dari nilai-p dalam kurung atau tanda bintang yang menunjukkan nilai-p kurang dari 0,001.

Kita simpulkan bahwa perbedaan berat lahir yang tampak dijelaskan, setidaknya sebagian, oleh perbedaan usia ibu. Ketika kita memasukkan usia ibu ke dalam model, efek `isfirst` mengecil, dan sisa efeknya mungkin cuma kebetulan.

Dalam contoh ini, usia ibu berperan sebagai variabel kontrol (*control variable*); memasukkan `agepreg` ke dalam model berarti "mengontrol" perbedaan usia antara ibu yang pertama kali melahirkan dan yang lain, sehingga kita bisa mengisolasi efek `isfirst` (kalau memang ada).

## 11.4 Data Mining

Sejauh ini kita memakai model regresi untuk penjelasan (*explanation*); misalnya, di bagian sebelumnya kita menemukan bahwa perbedaan berat lahir yang tampak sebenarnya disebabkan oleh perbedaan usia ibu. Tapi nilai *R²* model-model itu sangat rendah, artinya daya prediksinya kecil. Di bagian ini kita akan mencoba lebih baik.

Misalkan salah satu rekan kerjamu akan melahirkan dan ada taruhan kantor untuk menebak berat lahir bayinya (kalau kamu belum familiar dengan taruhan semacam ini, lihat https://en.wikipedia.org/wiki/Betting_pool).

Sekarang misalkan kamu benar-benar ingin menang taruhannya. Apa yang bisa kamu lakukan untuk memperbesar peluangmu? Nah, dataset NSFG mencakup 244 variabel tentang tiap kehamilan dan 3087 variabel lain tentang tiap responden. Mungkin beberapa variabel itu punya daya prediksi. Untuk tahu mana yang paling berguna, kenapa tidak coba semuanya?

Menguji variabel-variabel di tabel kehamilan itu gampang, tapi untuk memakai variabel di tabel responden, kita harus mencocokkan tiap kehamilan dengan respondennya. Secara teori kita bisa mengiterasi baris-baris tabel kehamilan, memakai `caseid` untuk menemukan responden yang bersesuaian, dan menyalin nilai-nilainya ke tabel kehamilan. Tapi itu akan lambat.

Pilihan yang lebih baik adalah mengenali proses ini sebagai operasi *join* seperti yang didefinisikan di SQL dan bahasa basis data relasional lainnya (lihat https://en.wikipedia.org/wiki/Join_(SQL)). *Join* diimplementasikan sebagai metode DataFrame, jadi kita bisa melakukannya seperti ini:

```python
live = live[live.prglngth>30]
resp = chap01soln.ReadFemResp()
resp.index = resp.caseid
join = live.join(resp, on='caseid', rsuffix='_r')
```

Baris pertama memilih catatan untuk kehamilan yang lebih dari 30 minggu, dengan asumsi taruhan kantor dibentuk beberapa minggu sebelum tanggal perkiraan lahir.

Baris berikutnya membaca file responden. Hasilnya adalah DataFrame dengan indeks integer; supaya pencarian responden efisien, saya ganti `resp.index` dengan `resp.caseid`.

Metode `join` dipanggil pada `live`, yang dianggap tabel "kiri", dan diberi `resp`, tabel "kanan". Argumen kata kunci `on` menunjukkan variabel yang dipakai untuk mencocokkan baris dari kedua tabel.

Dalam contoh ini beberapa nama kolom muncul di kedua tabel, jadi kita harus memberi `rsuffix`, yaitu string yang akan ditempelkan ke nama kolom-kolom yang tumpang tindih dari tabel kanan. Misalnya, kedua tabel punya kolom bernama `race` yang mengodekan ras responden. Hasil *join* berisi dua kolom bernama `race` dan `race_r`.

Implementasi pandas-nya cepat. Meng-*join* tabel-tabel NSFG butuh waktu kurang dari sedetik di komputer desktop biasa. Sekarang kita bisa mulai menguji variabel-variabelnya.

```python
t = []
for name in join.columns:
    try:
        if join[name].var() < 1e-7:
            continue
        formula = 'totalwgt_lb ~ agepreg + ' + name
        model = smf.ols(formula, data=join)
        if model.nobs < len(join)/2:
            continue
        results = model.fit()
    except (ValueError, TypeError):
        continue
    t.append((results.rsquared, name))
```

Untuk tiap variabel kita membangun model, menghitung *R²*, dan menambahkan hasilnya ke list. Semua model mencakup `agepreg`, karena kita sudah tahu ia punya daya prediksi.

Saya memeriksa bahwa tiap variabel penjelas punya variabilitas; kalau tidak, hasil regresinya tidak bisa diandalkan. Saya juga memeriksa jumlah observasi untuk tiap model. Variabel yang mengandung banyak *nan* bukan kandidat prediksi yang bagus.

Untuk sebagian besar variabel ini, kita belum melakukan *cleaning* apa pun. Beberapa di antaranya di-*encode* dengan cara yang kurang cocok untuk regresi linear. Akibatnya, kita mungkin melewatkan beberapa variabel yang sebenarnya berguna kalau dibersihkan dengan benar. Tapi mungkin kita akan menemukan beberapa kandidat bagus.

::: tip 💡 Konteks Indonesia
NSFG itu survei kehamilan nasional Amerika dengan ratusan variabel per responden — polanya mirip **Susenas** atau **Riskesdas** di Indonesia: ribuan responden, ratusan kolom, dan kamu harus pintar-pintar memilih variabel mana yang benar-benar berguna. Teknik di bagian ini (coba banyak variabel, lalu saring yang *R²*-nya tertinggi) adalah inti dari eksplorasi data survei besar — tapi ingat peringatannya di Bagian 11.5: pola yang ditemukan dengan cara ini bisa jadi cuma kebetulan.
:::

## 11.5 Prediksi

Langkah berikutnya adalah mengurutkan hasilnya dan memilih variabel yang menghasilkan nilai *R²* tertinggi.

```python
t.sort(reverse=True)
for mse, name in t[:30]:
    print(name, mse)
```

Variabel pertama di daftar adalah `totalwgt_lb`, diikuti `birthwgt_lb`. Jelas, kita tidak bisa memakai berat lahir untuk memprediksi berat lahir.

Demikian pula `prglngth` punya daya prediksi yang berguna, tapi untuk taruhan kantor kita asumsikan lama kehamilan (dan variabel-variabel terkait) belum diketahui.

Variabel prediktif pertama yang berguna adalah `babysex` yang menunjukkan apakah bayinya laki-laki atau perempuan. Di dataset NSFG, bayi laki-laki sekitar 0,3 lbs lebih berat. Jadi, dengan asumsi jenis kelamin bayi sudah diketahui, kita bisa memakainya untuk prediksi.

Berikutnya adalah `race`, yang menunjukkan apakah responden berkulit putih, hitam, atau lainnya. Sebagai variabel penjelas, ras bisa bermasalah. Di dataset seperti NSFG, ras berkorelasi dengan banyak variabel lain, termasuk pendapatan dan faktor sosioekonomi lainnya. Dalam model regresi, ras berperan sebagai variabel proksi (*proxy variable*), jadi korelasi semu dengan ras sering kali disebabkan, setidaknya sebagian, oleh faktor lain.

Variabel berikutnya di daftar adalah `nbrnaliv`, yang menunjukkan apakah kehamilan menghasilkan kelahiran ganda. Bayi kembar dua dan kembar tiga cenderung lebih kecil daripada bayi lain, jadi kalau kita tahu rekan kerja hipotetis kita akan melahirkan anak kembar, itu membantu.

Berikutnya di daftar adalah `paydu`, yang menunjukkan apakah responden memiliki rumahnya sendiri. Ia salah satu dari beberapa variabel terkait pendapatan yang ternyata prediktif. Di dataset seperti NSFG, pendapatan dan kekayaan berkorelasi dengan hampir segalanya. Dalam contoh ini, pendapatan berkaitan dengan pola makan, kesehatan, layanan kesehatan, dan faktor lain yang kemungkinan memengaruhi berat lahir.

Beberapa variabel lain di daftar adalah hal-hal yang baru diketahui belakangan, seperti `bfeedwks`, jumlah minggu bayi disusui. Kita tidak bisa memakai variabel-variabel ini untuk prediksi, tapi kamu mungkin ingin berspekulasi soal alasan `bfeedwks` berkorelasi dengan berat lahir.

Kadang kamu mulai dari teori lalu memakai data untuk mengujinya. Kadang kamu mulai dari data lalu mencari teori yang mungkin. Pendekatan kedua, yang didemonstrasikan bagian ini, disebut *data mining* (penambangan data). Kelebihan *data mining* adalah ia bisa menemukan pola yang tak terduga. Bahayanya adalah banyak pola yang ia temukan ternyata acak atau semu (*spurious*).

Setelah mengidentifikasi variabel penjelas yang potensial, saya menguji beberapa model dan menetapkan model ini:

```python
formula = ('totalwgt_lb ~ agepreg + C(race) + babysex==1 + '
           'nbrnaliv>1 + paydu==1 + totincr')
results = smf.ols(formula, data=join).fit()
```

Formula ini memakai sintaks yang belum kita lihat: `C(race)` memberi tahu parser formula (Patsy) untuk memperlakukan `race` sebagai variabel kategorikal, meskipun di-*encode* secara numerik.

*Encoding* untuk `babysex` adalah 1 untuk laki-laki, 2 untuk perempuan; menulis `babysex==1` mengubahnya menjadi boolean, True untuk laki-laki dan false untuk perempuan.

Demikian pula `nbrnaliv>1` bernilai True untuk kelahiran ganda dan `paydu==1` bernilai True untuk responden yang memiliki rumahnya.

`totincr` di-*encode* secara numerik dari 1–14, dengan tiap kenaikan mewakili sekitar $5000 pendapatan tahunan. Jadi kita bisa memperlakukan nilai-nilai ini sebagai numerik, dalam satuan $5000.

Berikut hasil modelnya:

```
Intercept              6.63    (0)
C(race)[T.2]           0.357   (5.43e-29)
C(race)[T.3]           0.266   (2.33e-07)
babysex == 1[T.True]   0.295   (5.39e-29)
nbrnaliv > 1[T.True]   -1.38   (5.1e-37)
paydu == 1[T.True]     0.12    (0.000114)
agepreg                0.00741 (0.0035)
totincr                0.0122  (0.00188)
```

Parameter yang diestimasi untuk ras lebih besar dari dugaan saya, apalagi karena kita sudah mengontrol pendapatan. *Encoding*-nya adalah 1 untuk kulit hitam, 2 untuk kulit putih, dan 3 untuk lainnya. Bayi dari ibu berkulit hitam lebih ringan daripada bayi dari ras lain sebesar 0,27–0,36 lbs.

Seperti yang sudah kita lihat, bayi laki-laki lebih berat sekitar 0,3 lbs; bayi kembar dan kelahiran ganda lainnya lebih ringan 1,4 lbs.

Orang yang memiliki rumahnya punya bayi lebih berat sekitar 0,12 lbs, bahkan ketika kita mengontrol pendapatan. Parameter untuk usia ibu lebih kecil daripada yang kita lihat di Bagian 11.2, yang menunjukkan bahwa beberapa variabel lain berkorelasi dengan usia — kemungkinan termasuk `paydu` dan `totincr`.

Semua variabel ini signifikan secara statistik, beberapa dengan nilai-p yang sangat rendah, tapi *R²*-nya cuma 0,06 — masih sangat kecil. RMSE tanpa memakai model adalah 1,27 lbs; dengan model turun ke 1,23. Jadi peluangmu memenangkan taruhan tidak membaik secara berarti. Maaf!

::: tip 💡 Konteks Indonesia
Logika di bagian ini persis seperti yang dipakai analis properti/KPR di Indonesia: untuk memprediksi **harga rumah**, kamu mengumpulkan variabel penjelas — luas tanah, jumlah kamar, jarak ke jalan utama, status kepemilikan (SHM/HGB), sampai pendapatan rata-rata lingkungan. Model regresi berganda lalu memilah: mana variabel yang efeknya nyata, mana yang cuma ikut-ikutan karena berkorelasi dengan variabel lain (seperti `race` yang ternyata proksi dari pendapatan). Dan seperti contoh di atas, *R²* yang kecil adalah pengingat jujur: kadang model terbaik pun cuma sedikit lebih baik daripada menebak rata-rata.
:::

## 11.6 Regresi Logistik

Di contoh-contoh sebelumnya, beberapa variabel penjelas numerik dan beberapa kategorikal (termasuk boolean). Tapi variabel dependennya selalu numerik.

Regresi linear bisa digeneralisasi untuk menangani jenis variabel dependen lain. Kalau variabel dependennya boolean, model yang digeneralisasi disebut regresi logistik (*logistic regression*). Kalau variabel dependennya berupa hitungan bilangan bulat, itu disebut regresi Poisson (*Poisson regression*).

Sebagai contoh regresi logistik, mari kita pertimbangkan variasi skenario taruhan kantor. Misalkan temanmu sedang hamil dan kamu ingin memprediksi apakah bayinya laki-laki atau perempuan. Kamu bisa memakai data NSFG untuk menemukan faktor-faktor yang memengaruhi "*sex ratio*", yang secara konvensional didefinisikan sebagai probabilitas melahirkan bayi laki-laki.

Kalau kamu mengodekan variabel dependen secara numerik, misalnya 0 untuk perempuan dan 1 untuk laki-laki, kamu bisa menerapkan kuadrat terkecil biasa — tapi akan ada masalah. Model linearnya mungkin seperti ini:

*y = β0 + β1 x1 + β2 x2 + ε*

di mana *y* adalah variabel dependen, dan *x1* dan *x2* adalah variabel penjelas. Lalu kita bisa menemukan parameter yang meminimalkan residunya.

Masalah pendekatan ini adalah ia menghasilkan prediksi yang susah diinterpretasikan. Dengan parameter yang diestimasi dan nilai *x1* dan *x2*, model mungkin memprediksi *y = 0,5*, padahal satu-satunya nilai *y* yang bermakna adalah 0 dan 1.

Menggoda untuk menginterpretasikan hasil seperti itu sebagai probabilitas; misalnya, kita mungkin bilang responden dengan nilai *x1* dan *x2* tertentu punya peluang 50% melahirkan bayi laki-laki. Tapi model ini juga bisa memprediksi *y = 1,1* atau *y = −0,1* — dan itu bukan probabilitas yang valid.

Regresi logistik menghindari masalah ini dengan menyatakan prediksi dalam bentuk *odds*, bukan probabilitas. Kalau kamu belum familiar dengan *odds*, "*odds in favor*" suatu kejadian adalah rasio probabilitas kejadian itu terjadi terhadap probabilitas ia tidak terjadi.

Jadi kalau saya pikir tim saya punya peluang 75% menang, saya akan bilang *odds*-nya tiga banding satu — karena peluang menang tiga kali lipat peluang kalah.

*Odds* dan probabilitas adalah representasi berbeda dari informasi yang sama. Dengan probabilitas, kamu bisa menghitung *odds* seperti ini:

*o = p / (1-p)*

Dengan *odds in favor*, kamu bisa mengonversinya ke probabilitas seperti ini:

*p = o / (o+1)*

Regresi logistik didasarkan pada model berikut:

*log o = β0 + β1 x1 + β2 x2 + ε*

di mana *o* adalah *odds* untuk hasil tertentu; dalam contoh ini, *o* adalah *odds* melahirkan bayi laki-laki.

Misalkan kita sudah mengestimasi parameter *β0*, *β1*, dan *β2* (sebentar lagi saya jelaskan caranya). Dan misalkan kita diberi nilai *x1* dan *x2*. Kita bisa menghitung nilai prediksi *log o*, lalu mengonversinya ke probabilitas:

```python
o = np.exp(log_o)
p = o / (o+1)
```

Jadi dalam skenario taruhan kantor kita bisa menghitung probabilitas prediktif melahirkan bayi laki-laki. Tapi bagaimana cara mengestimasi parameternya?

::: tip 💡 Konteks Indonesia
*Odds* mungkin terdengar asing, tapi konsepnya akrab kalau kamu pernah lihat **voor taruhan bola**: "odds 3 banding 1" artinya peluang menang tiga kali peluang kalah. Regresi logistik pada dasarnya melakukan hal yang sama — ia tidak memprediksi langsung "laki-laki atau perempuan", melainkan *odds*-nya, lalu mengubahnya jadi probabilitas. Teknik yang sama dipakai bank untuk **credit scoring**: memprediksi *odds* nasabah gagal bayar KPR dari usia, pendapatan, dan riwayat kredit.
:::

## 11.7 Estimasi Parameter

Tidak seperti regresi linear, regresi logistik tidak punya solusi bentuk tertutup (*closed form*), jadi ia diselesaikan dengan menebak solusi awal lalu memperbaikinya secara iteratif.

Tujuan biasanya adalah menemukan estimasi *maximum-likelihood* (*maximum-likelihood estimate*, MLE) — yaitu set parameter yang memaksimalkan *likelihood* data. Misalnya, misalkan kita punya data berikut:

```python
>>> y = np.array([0, 1, 0, 1])
>>> x1 = np.array([0, 0, 0, 1])
>>> x2 = np.array([0, 1, 1, 1])
```

Dan kita mulai dengan tebakan awal *β0 = −1,5*, *β1 = 2,8*, dan *β2 = 1,1*:

```python
>>> beta = [-1.5, 2.8, 1.1]
```

Lalu untuk tiap baris kita bisa menghitung *log_o*:

```python
>>> log_o = beta[0] + beta[1] * x1 + beta[2] * x2
[-1.5 -0.4 -0.4 2.4]
```

Dan mengonversi dari *log odds* ke probabilitas:

```python
>>> o = np.exp(log_o)
[ 0.223  0.670  0.670 11.02 ]
>>> p = o / (o+1)
[ 0.182 0.401 0.401 0.916 ]
```

Perhatikan bahwa ketika *log_o* lebih besar dari 0, *o* lebih besar dari 1 dan *p* lebih besar dari 0,5.

*Likelihood* suatu hasil adalah *p* ketika *y==1* dan *1-p* ketika *y==0*. Misalnya, kalau kita pikir probabilitas bayi laki-laki adalah 0,8 dan hasilnya memang laki-laki, *likelihood*-nya 0,8; kalau hasilnya perempuan, *likelihood*-nya 0,2. Kita bisa menghitungnya seperti ini:

```python
>>> likes = y * p + (1-y) * (1-p)
[ 0.817 0.401 0.598 0.916 ]
```

*Likelihood* keseluruhan data adalah hasil kali dari *likes*:

```python
>>> like = np.prod(likes)
0.18
```

Untuk nilai-nilai beta ini, *likelihood* datanya 0,18.

Tujuan regresi logistik adalah menemukan parameter yang memaksimalkan *likelihood* ini. Untuk itu, kebanyakan paket statistik memakai solver iteratif seperti metode Newton (*Newton's method*) (lihat https://en.wikipedia.org/wiki/Logistic_regression#Model_fitting).

## 11.8 Implementasi

StatsModels menyediakan implementasi regresi logistik bernama `logit` — dinamai dari fungsi yang mengonversi probabilitas ke *log odds*. Untuk mendemonstrasikan pemakaiannya, saya akan mencari variabel yang memengaruhi *sex ratio*.

Sekali lagi, saya memuat data NSFG dan memilih kehamilan yang lebih dari 30 minggu:

```python
live, firsts, others = first.MakeFrames()
df = live[live.prglngth>30]
```

`logit` mensyaratkan variabel dependen berupa biner (bukan boolean), jadi saya buat kolom baru bernama `boy`, memakai `astype(int)` untuk mengonversi ke integer biner:

```python
df['boy'] = (df.babysex==1).astype(int)
```

Faktor-faktor yang ditemukan memengaruhi *sex ratio* antara lain usia orang tua, urutan kelahiran, ras, dan status sosial. Kita bisa memakai regresi logistik untuk melihat apakah efek-efek ini muncul di data NSFG. Saya mulai dengan usia ibu:

```python
import statsmodels.formula.api as smf
model = smf.logit('boy ~ agepreg', data=df)
results = model.fit()
SummarizeResults(results)
```

`logit` menerima argumen yang sama dengan `ols` — formula dalam sintaks Patsy dan sebuah DataFrame. Hasilnya adalah objek `Logit` yang merepresentasikan model. Ia berisi atribut bernama `endog` dan `exog` yang berisi variabel endogen (*endogenous variable*) — nama lain untuk variabel dependen — dan variabel eksogen (*exogenous variables*) — nama lain untuk variabel penjelas. Karena keduanya array NumPy, kadang lebih nyaman mengonversinya ke DataFrame:

```python
endog = pandas.DataFrame(model.endog, columns=[model.endog_names])
exog = pandas.DataFrame(model.exog, columns=model.exog_names)
```

Hasil dari `model.fit` adalah objek `BinaryResults`, yang mirip dengan objek `RegressionResults` yang kita dapat dari `ols`. Berikut ringkasan hasilnya:

```
Intercept   0.00579 (0.953)
agepreg     0.00105 (0.783)
R^2 6.144e-06
```

Parameter `agepreg` positif, yang menunjukkan ibu yang lebih tua cenderung melahirkan bayi laki-laki, tapi nilai-p-nya 0,783 — artinya efek yang tampak ini bisa dengan mudah terjadi karena kebetulan.

Koefisien determinasi, *R²*, tidak berlaku untuk regresi logistik, tapi ada beberapa alternatif yang dipakai sebagai nilai "*pseudo R²*". Nilai-nilai ini bisa berguna untuk membandingkan model. Misalnya, berikut model yang mencakup beberapa faktor yang diyakini berkaitan dengan *sex ratio*:

```python
formula = 'boy ~ agepreg + hpagelb + birthord + C(race)'
model = smf.logit(formula, data=df)
results = model.fit()
```

Selain usia ibu, model ini mencakup usia ayah saat lahir (`hpagelb`), urutan kelahiran (`birthord`), dan ras sebagai variabel kategorikal. Berikut hasilnya:

```
Intercept       -0.0301   (0.772)
C(race)[T.2]    -0.0224   (0.66)
C(race)[T.3]    -0.000457 (0.996)
agepreg         -0.00267  (0.629)
hpagelb         0.0047    (0.266)
birthord        0.00501   (0.821)
R^2 0.000144
```

Tidak satu pun parameter yang diestimasi signifikan secara statistik. Nilai *pseudo-R²*-nya sedikit lebih tinggi, tapi itu bisa jadi karena kebetulan.

## 11.9 Akurasi

Dalam skenario taruhan kantor, yang paling kita minati adalah akurasi model: jumlah prediksi yang berhasil, dibandingkan dengan yang kita harapkan secara kebetulan.

Di data NSFG, bayi laki-laki lebih banyak daripada perempuan, jadi strategi *baseline*-nya adalah menebak "laki-laki" setiap saat. Akurasi strategi ini hanyalah fraksi bayi laki-laki:

```python
actual = endog['boy']
baseline = actual.mean()
```

Karena `actual` di-*encode* dalam integer biner, meannya adalah fraksi bayi laki-laki, yaitu 0,507.

Begini cara menghitung akurasi model:

```python
predict = (results.predict() >= 0.5)
true_pos = predict * actual
true_neg = (1 - predict) * (1 - actual)
```

`results.predict` mengembalikan array NumPy berisi probabilitas, yang kita bulatkan ke 0 atau 1. Mengalikannya dengan `actual` menghasilkan 1 kalau kita memprediksi laki-laki dan benar, 0 kalau tidak. Jadi, `true_pos` menunjukkan "*true positives*".

Demikian pula, `true_neg` menunjukkan kasus di mana kita menebak "perempuan" dan benar.

Akurasi adalah fraksi tebakan yang benar:

```python
acc = (sum(true_pos) + sum(true_neg)) / len(actual)
```

Hasilnya 0,512 — sedikit lebih baik daripada *baseline*, 0,507. Tapi, kamu tidak perlu terlalu serius menanggapi hasil ini. Kita memakai data yang sama untuk membangun dan menguji model, jadi modelnya mungkin tidak punya daya prediksi pada data baru.

Namun, mari kita pakai model ini untuk membuat prediksi untuk taruhan kantor. Misalkan temanmu berusia 35 tahun dan berkulit putih, suaminya 39 tahun, dan mereka menanti anak ketiga:

```python
columns = ['agepreg', 'hpagelb', 'birthord', 'race']
new = pandas.DataFrame([[35, 39, 3, 2]], columns=columns)
y = results.predict(new)
```

Untuk memanggil `results.predict` pada kasus baru, kamu harus membangun DataFrame dengan satu kolom untuk tiap variabel di model. Hasilnya dalam kasus ini adalah 0,52, jadi kamu sebaiknya menebak "laki-laki". Tapi kalau model ini meningkatkan peluangmu menang, bedanya sangat kecil.

## 11.10 Latihan

Solusi saya untuk latihan-latihan ini ada di `chap11soln.ipynb`.

**Latihan 11.1** Misalkan salah satu rekan kerjamu akan melahirkan dan kamu ikut taruhan kantor untuk memprediksi tanggal lahir bayinya. Dengan asumsi taruhan dipasang saat kehamilan minggu ke-30, variabel apa saja yang bisa kamu pakai untuk membuat prediksi terbaik? Batasi dirimu pada variabel yang sudah diketahui sebelum kelahiran dan kemungkinan tersedia bagi peserta taruhan.

**Latihan 11.2** Hipotesis Trivers-Willard menyatakan bahwa pada banyak mamalia, *sex ratio* bergantung pada "kondisi maternal" (*maternal condition*); yaitu, faktor-faktor seperti usia, ukuran tubuh, kesehatan, dan status sosial ibu. Lihat https://en.wikipedia.org/wiki/Trivers-Willard_hypothesis

Beberapa studi menunjukkan efek ini pada manusia, tapi hasilnya campur aduk. Di bab ini kita menguji beberapa variabel yang berkaitan dengan faktor-faktor itu, tapi tidak menemukan satu pun yang berpengaruh signifikan secara statistik pada *sex ratio*.

Sebagai latihan, gunakan pendekatan *data mining* untuk menguji variabel-variabel lain di file kehamilan dan responden. Bisakah kamu menemukan faktor apa pun yang berpengaruh besar?

**Latihan 11.3** Kalau besaran yang ingin kamu prediksi berupa hitungan (*count*), kamu bisa memakai regresi Poisson, yang diimplementasikan di StatsModels dengan fungsi bernama `poisson`. Cara kerjanya sama seperti `ols` dan `logit`. Sebagai latihan, mari kita pakai untuk memprediksi berapa anak yang sudah dilahirkan seorang perempuan; di dataset NSFG, variabel ini bernama `numbabes`.

Misalkan kamu bertemu seorang perempuan berusia 35 tahun, berkulit hitam, dan lulusan perguruan tinggi yang pendapatan rumah tangga tahunannya melebihi $75.000. Berapa anak yang kamu prediksi sudah ia lahirkan?

**Latihan 11.4** Kalau besaran yang ingin kamu prediksi bersifat kategorikal, kamu bisa memakai regresi logistik multinomial (*multinomial logistic regression*), yang diimplementasikan di StatsModels dengan fungsi bernama `mnlogit`. Sebagai latihan, mari kita pakai untuk menebak apakah seorang perempuan sudah menikah, hidup bersama (*cohabitating*), janda (*widowed*), cerai (*divorced*), pisah (*separated*), atau belum pernah menikah; di dataset NSFG, status pernikahan di-*encode* dalam variabel bernama `rmarital`.

Misalkan kamu bertemu seorang perempuan berusia 25 tahun, berkulit putih, dan lulusan SMA yang pendapatan rumah tangga tahunannya sekitar $45.000. Berapa probabilitas ia sudah menikah, hidup bersama, dan seterusnya?

## 11.11 Glosarium

- **regresi (*regression*):** salah satu dari beberapa proses terkait untuk mengestimasi parameter yang mencocokkan model ke data.
- **variabel dependen (*dependent variables*):** variabel-variabel dalam model regresi yang ingin kita prediksi. Juga dikenal sebagai variabel endogen (*endogenous variables*).
- **variabel penjelas (*explanatory variables*):** variabel-variabel yang dipakai untuk memprediksi atau menjelaskan variabel dependen. Juga dikenal sebagai variabel independen (*independent variables*), atau variabel eksogen (*exogenous variables*).
- **regresi sederhana (*simple regression*):** regresi dengan hanya satu variabel dependen dan satu variabel penjelas.
- **regresi berganda (*multiple regression*):** regresi dengan banyak variabel penjelas, tapi hanya satu variabel dependen.
- **regresi linear (*linear regression*):** regresi yang didasarkan pada model linear.
- **kuadrat terkecil biasa (*ordinary least squares*):** regresi linear yang mengestimasi parameter dengan meminimalkan kuadrat galat (*squared error*) dari residu.
- **hubungan semu (*spurious relationship*):** hubungan antara dua variabel yang disebabkan oleh artefak statistik atau faktor yang tidak dimasukkan dalam model, yang berkaitan dengan kedua variabel.
- **variabel kontrol (*control variable*):** variabel yang dimasukkan dalam regresi untuk menghilangkan atau "mengontrol" hubungan semu.
- **variabel proksi (*proxy variable*):** variabel yang menyumbang informasi ke model regresi secara tidak langsung karena hubungannya dengan faktor lain — jadi ia berperan sebagai proksi untuk faktor itu.
- **variabel kategorikal (*categorical variable*):** variabel yang nilainya bisa berupa salah satu dari sekumpulan nilai diskrit yang tidak terurut.
- ***join*:** operasi yang menggabungkan data dari dua DataFrame memakai kunci (*key*) untuk mencocokkan baris-baris di kedua *frame*.
- ***data mining* (penambangan data):** pendekatan untuk menemukan hubungan antar variabel dengan menguji banyak model.
- **regresi logistik (*logistic regression*):** bentuk regresi yang dipakai ketika variabel dependennya boolean.
- **regresi Poisson (*Poisson regression*):** bentuk regresi yang dipakai ketika variabel dependennya bilangan bulat non-negatif, biasanya berupa hitungan.
- ***odds*:** cara alternatif merepresentasikan probabilitas, *p*, sebagai rasio probabilitas dan komplemennya, *p/(1 − p)*.

---

**Selanjutnya:** [Bab 12: Analisis Deret Waktu](/thinkstats-bab-12) *(segera hadir)*
