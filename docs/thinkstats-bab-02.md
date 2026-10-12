> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 2: Distribusi

Salah satu cara terbaik untuk menggambarkan sebuah variabel adalah melaporkan nilai-nilai apa saja yang muncul di dataset dan berapa kali tiap nilai muncul. Deskripsi semacam ini disebut *distribution* (distribusi) dari variabel tersebut.

## 2.1 Histogram

Representasi distribusi yang paling umum adalah *histogram* (histogram), yaitu grafik yang menunjukkan frekuensi tiap nilai. Dalam konteks ini, "*frequency*" (frekuensi) artinya berapa kali sebuah nilai muncul.

Di Python, cara yang efisien untuk menghitung frekuensi adalah dengan *dictionary*. Diberi sebuah urutan nilai `t`:

```python
hist = {}
for x in t:
    hist[x] = hist.get(x, 0) + 1
```

Hasilnya adalah dictionary yang memetakan nilai ke frekuensinya. Alternatifnya, kamu bisa pakai kelas `Counter` dari modul `collections`:

```python
from collections import Counter
counter = Counter(t)
```

Hasilnya adalah objek `Counter`, yang merupakan turunan (*subclass*) dari dictionary.

Pilihan lain adalah memakai metode pandas `value_counts`, yang sudah kita lihat di bab sebelumnya. Tapi untuk buku ini, penulis membuat sebuah kelas bernama `Hist`, yang merepresentasikan histogram dan menyediakan metode-metode yang beroperasi di atasnya.

## 2.2 Merepresentasikan histogram

Konstruktor `Hist` bisa menerima urutan (*sequence*), dictionary, pandas Series, atau `Hist` lain. Kamu bisa membuat objek `Hist` seperti ini:

```python
>>> import thinkstats2
>>> hist = thinkstats2.Hist([1, 2, 2, 3, 5])
>>> hist
Hist({1: 1, 2: 2, 3: 1, 5: 1})
```

Objek `Hist` menyediakan `Freq`, yang menerima sebuah nilai dan mengembalikan frekuensinya:

```python
>>> hist.Freq(2)
2
```

Operator kurung siku melakukan hal yang sama:

```python
>>> hist[2]
2
```

Kalau kamu mencari nilai yang belum pernah muncul, frekuensinya 0.

```python
>>> hist.Freq(4)
0
```

`Values` mengembalikan daftar tak-terurut dari nilai-nilai di dalam `Hist`:

```python
>>> hist.Values()
[1, 5, 3, 2]
```

Untuk mengiterasi nilai-nilainya secara berurutan, kamu bisa pakai fungsi bawaan `sorted`:

```python
for val in sorted(hist.Values()):
    print(val, hist.Freq(val))
```

Atau kamu bisa pakai `Items` untuk mengiterasi pasangan nilai-frekuensi:

```python
for val, freq in hist.Items():
    print(val, freq)
```

*[Grafik 2.1: histogram dari bagian pon (birthwgt_lb) berat lahir.]*

## 2.3 Menggambar histogram

Untuk buku ini, penulis menulis sebuah modul bernama `thinkplot.py` yang menyediakan fungsi-fungsi untuk menggambar `Hist` dan objek-objek lain yang didefinisikan di `thinkstats2.py`. Modul ini berbasis `pyplot`, yang merupakan bagian dari paket `matplotlib`. Lihat Bagian 0.2 untuk info soal instalasi matplotlib.

Untuk menggambar `hist` dengan thinkplot, coba ini:

```python
>>> import thinkplot
>>> thinkplot.Hist(hist)
>>> thinkplot.Show(xlabel='value', ylabel='frequency')
```

Kamu bisa membaca dokumentasi thinkplot di http://greenteapress.com/thinkstats2/thinkplot.html.

## 2.4 Variabel NSFG

Sekarang kita kembali ke data NSFG. Kode di bab ini ada di `first.py`. Untuk info soal mengunduh dan menjalankan kode ini, lihat Bagian 0.2.

Saat kamu mulai bekerja dengan dataset baru, penulis menyarankan menjelajahi variabel-variabel yang mau kamu pakai satu per satu, dan cara yang bagus untuk mulai adalah dengan melihat histogramnya.

Di Bagian 1.6 kita mentransformasi `agepreg` dari *centiyears* ke tahun, dan menggabungkan `birthwgt_lb` dan `birthwgt_oz` menjadi satu besaran, `totalwgt_lb`. Di bagian ini, variabel-variabel itu dipakai untuk mendemonstrasikan beberapa fitur histogram.

Saya mulai dengan membaca data dan memilih catatan untuk kelahiran hidup:

```python
preg = nsfg.ReadFemPreg()
live = preg[preg.outcome == 1]
```

Ekspresi di dalam kurung siku adalah *boolean Series* yang memilih baris-baris dari DataFrame dan mengembalikan DataFrame baru. Selanjutnya saya membuat dan menggambar histogram `birthwgt_lb` untuk kelahiran hidup:

```python
hist = thinkstats2.Hist(live.birthwgt_lb, label='birthwgt_lb')
thinkplot.Hist(hist)
thinkplot.Show(xlabel='pounds', ylabel='frequency')
```

Ketika argumen yang diberikan ke `Hist` adalah pandas Series, nilai-nilai *nan* dibuang. `label` adalah string yang muncul di legenda saat `Hist` digambar.

Gambar 2.1 menunjukkan hasilnya. Nilai yang paling umum, yang disebut *mode* (modus), adalah 7 pon. Distribusinya kurang lebih berbentuk lonceng, yang merupakan bentuk dari *normal distribution* (distribusi normal), disebut juga *Gaussian distribution* (distribusi Gaussian). Tapi tidak seperti distribusi normal sejati, distribusi ini asimetris; ia punya ekor (*tail*) yang memanjang lebih jauh ke kiri daripada ke kanan.

*[Grafik 2.2: histogram dari bagian ons (birthwgt_oz) berat lahir.]*

Gambar 2.2 menunjukkan histogram `birthwgt_oz`, yaitu bagian ons dari berat lahir. Secara teori kita berharap distribusi ini *uniform* (seragam); artinya, semua nilai seharusnya punya frekuensi yang sama. Faktanya, 0 lebih umum daripada nilai-nilai lain, sedangkan 1 dan 15 lebih jarang — mungkin karena responden membulatkan berat lahir yang dekat dengan angka bulat.

::: tip 💡 Konteks Indonesia
Di AS, berat lahir dicatat dalam pon dan ons — makanya datanya dipecah jadi dua variabel (`birthwgt_lb` dan `birthwgt_oz`). Di Indonesia, berat lahir selalu dicatat dalam **gram** (mis. 3.200 gram), jadi kamu tidak akan menemui pecahan seperti ini di data Riskesdas atau buku KIA posyandu. Pelajaran umumnya tetap sama: perhatikan satuan dan cara pencatatan datamu — pembulatan responden (seperti menumpuknya nilai 0 ons di grafik) juga sering terjadi di data survei Indonesia.
:::

*[Grafik 2.3: histogram umur ibu di akhir kehamilan (agepreg).]*

Gambar 2.3 menunjukkan histogram `agepreg`, umur ibu di akhir kehamilan. Modusnya adalah 21 tahun. Distribusinya secara kasar berbentuk lonceng, tapi kali ini ekornya memanjang lebih jauh ke kanan daripada ke kiri; kebanyakan ibu berusia 20-an, lebih sedikit yang berusia 30-an.

*[Grafik 2.4: histogram lama kehamilan dalam minggu (prglngth).]*

Gambar 2.4 menunjukkan histogram `prglngth`, lama kehamilan dalam minggu. Nilai yang jauh paling umum adalah 39 minggu. Ekor kirinya lebih panjang daripada ekor kanan; bayi prematur (lahir lebih awal) itu umum, tapi kehamilan jarang melewati 43 minggu, dan dokter biasanya melakukan intervensi kalau sampai begitu.

## 2.5 Pencilan

Dengan melihat histogram, gampang mengenali nilai-nilai yang paling umum dan bentuk distribusinya, tapi nilai-nilai yang jarang tidak selalu kelihatan.

Sebelum lanjut, ada baiknya memeriksa *outlier* (pencilan), yaitu nilai-nilai ekstrem yang mungkin merupakan kesalahan pengukuran dan pencatatan, atau mungkin laporan yang akurat tentang kejadian langka.

`Hist` menyediakan metode `Largest` dan `Smallest`, yang menerima bilangan bulat `n` dan mengembalikan `n` nilai terbesar atau terkecil dari histogram:

```python
for weeks, freq in hist.Smallest(10):
    print(weeks, freq)
```

Di daftar lama kehamilan untuk kelahiran hidup, 10 nilai terendah adalah `[0, 4, 9, 13, 17, 18, 19, 20, 21, 22]`. Nilai di bawah 10 minggu jelas merupakan kesalahan; penjelasan paling mungkin adalah *outcome*-nya tidak dikodekan dengan benar. Nilai di atas 30 minggu mungkin sah. Antara 10 dan 30 minggu, sulit dipastikan; sebagian nilai mungkin kesalahan, tapi sebagian mewakili bayi prematur.

Di ujung satunya, nilai-nilai tertingginya adalah:

| minggu | jumlah |
|--------|--------|
| 43     | 148    |
| 44     | 46     |
| 45     | 10     |
| 46     | 1      |
| 47     | 1      |
| 48     | 7      |
| 50     | 2      |

Kebanyakan dokter merekomendasikan induksi persalinan kalau kehamilan melewati 42 minggu, jadi sebagian nilai yang lebih panjang itu mengejutkan. Khususnya, 50 minggu rasanya tidak masuk akal secara medis.

Cara terbaik menangani outlier bergantung pada "*domain knowledge*"; yaitu, informasi tentang dari mana data berasal dan apa artinya. Dan bergantung pada analisis apa yang kamu rencanakan.

Dalam contoh ini, pertanyaan yang memotivasinya adalah apakah bayi pertama cenderung lahir lebih awal (atau lebih lambat). Ketika orang menanyakan ini, biasanya mereka tertarik pada kehamilan cukup bulan (*full-term*), jadi untuk analisis ini saya akan fokus pada kehamilan yang lebih lama dari 27 minggu.

## 2.6 Bayi pertama

Sekarang kita bisa membandingkan distribusi lama kehamilan untuk bayi pertama dan bayi-bayi lainnya. Saya membagi DataFrame kelahiran hidup memakai `birthord`, dan menghitung histogramnya:

```python
firsts = live[live.birthord == 1]
others = live[live.birthord != 1]
first_hist = thinkstats2.Hist(firsts.prglngth, label='first')
other_hist = thinkstats2.Hist(others.prglngth, label='other')
```

Lalu saya menggambar kedua histogramnya pada sumbu yang sama:

```python
width = 0.45
thinkplot.PrePlot(2)
thinkplot.Hist(first_hist, align='right', width=width)
thinkplot.Hist(other_hist, align='left', width=width)
thinkplot.Show(xlabel='weeks', ylabel='frequency',
               xlim=[27, 46])
```

`thinkplot.PrePlot` menerima jumlah histogram yang rencananya mau digambar; informasi ini dipakai untuk memilih kumpulan warna yang pas.

`thinkplot.Hist` biasanya memakai `align='center'` sehingga tiap batang terpusat di atas nilainya. Untuk gambar ini, saya memakai `align='right'` dan `align='left'` untuk menempatkan batang-batang yang bersesuaian di kedua sisi nilai tersebut.

Dengan `width=0.45`, lebar total kedua batang adalah 0,9, menyisakan sedikit ruang di antara tiap pasangan.

Terakhir, saya menyesuaikan sumbunya untuk hanya menampilkan data antara 27 dan 46 minggu. Gambar 2.5 menunjukkan hasilnya.

*[Grafik 2.5: histogram lama kehamilan, bayi pertama vs bayi lainnya, berdampingan.]*

Histogram berguna karena membuat nilai-nilai yang paling sering langsung terlihat. Tapi histogram bukan pilihan terbaik untuk membandingkan dua distribusi. Dalam contoh ini, jumlah "bayi pertama" lebih sedikit daripada "bayi lainnya", jadi sebagian perbedaan yang terlihat di histogram disebabkan oleh ukuran sampel. Di bab berikutnya kita mengatasi masalah ini memakai fungsi massa probabilitas.

::: tip 💡 Konteks Indonesia
Pertanyaan "apakah anak pertama lahirnya lebih lama?" juga hidup di Indonesia — banyak yang percaya anak pertama itu "bandel", lahirnya susah dan lama. Bab ini menunjukkan cara menjawab mitos semacam itu dengan data, bukan kata orang: bandingkan distribusinya, lalu ukur bedanya (di 2.9). Pola pikir ini bisa kamu pakai untuk mitos-mitos kesehatan lain di sekitarmu — mis. "anak bungsu paling manja" atau "lahir malam Jumat Kliwon bikin rewel".
:::

## 2.7 Meringkas distribusi

Histogram adalah deskripsi lengkap dari distribusi sebuah sampel; artinya, dari sebuah histogram, kita bisa merekonstruksi nilai-nilai di dalam sampel (walaupun bukan urutannya).

Kalau detail distribusinya penting, mungkin perlu menyajikan histogram. Tapi sering kali kita ingin meringkas distribusi dengan beberapa statistik deskriptif.

Beberapa karakteristik yang mungkin ingin kita laporkan:

- *central tendency* (kecenderungan pusat): Apakah nilai-nilai cenderung mengelompok di sekitar satu titik tertentu?
- *modes* (modus): Apakah ada lebih dari satu kelompok?
- *spread* (sebaran): Seberapa besar variasi nilai-nilainya?
- *tails* (ekor): Seberapa cepat probabilitasnya turun saat kita menjauhi modus?
- *outliers* (pencilan): Apakah ada nilai ekstrem yang jauh dari modus?

Statistik yang dirancang untuk menjawab pertanyaan-pertanyaan ini disebut *summary statistics* (statistik ringkasan).

Statistik ringkasan yang sejauh ini paling umum adalah *mean* (rata-rata), yang dimaksudkan untuk menggambarkan kecenderungan pusat dari distribusi.

Kalau kamu punya sampel berisi n nilai, xᵢ, maka mean, x̄, adalah jumlah nilai-nilai itu dibagi banyaknya nilai; dengan kata lain:

x̄ = (1/n) Σᵢ xᵢ

Kata "*mean*" dan "*average*" kadang dipakai bergantian, tapi penulis membedakannya begini:

- "*Mean*" dari sebuah sampel adalah statistik ringkasan yang dihitung dengan rumus di atas.
- "*Average*" adalah salah satu dari beberapa statistik ringkasan yang bisa kamu pilih untuk menggambarkan kecenderungan pusat.

Kadang mean adalah deskripsi yang bagus untuk sekumpulan nilai. Contoh: apel itu ukurannya kurang lebih sama semua (setidaknya yang dijual di supermarket). Jadi kalau saya beli 6 apel dan berat totalnya 3 pon, cukup masuk akal meringkasnya dengan bilang berat tiap apel sekitar setengah pon.

Tapi labu jauh lebih beragam. Misal saya menanam beberapa varietas di kebun, dan suatu hari saya memanen tiga labu hias yang masing-masing 1 pon, dua labu pie yang masing-masing 3 pon, dan satu labu Atlantic Giant® yang beratnya 591 pon. Mean sampel ini adalah 100 pon, tapi kalau saya bilang "Rata-rata labu di kebunku 100 pon," itu menyesatkan. Dalam contoh ini, tidak ada rata-rata yang bermakna karena tidak ada labu yang "tipikal".

## 2.8 Varians

Kalau tidak ada satu angka pun yang bisa meringkas berat labu, kita bisa sedikit lebih baik dengan dua angka: mean dan *variance* (varians).

Varians adalah statistik ringkasan yang dimaksudkan untuk menggambarkan variabilitas atau sebaran dari sebuah distribusi. Varians dari sekumpulan nilai adalah:

S² = (1/n) Σᵢ (xᵢ − x̄)²

Suku xᵢ − x̄ disebut "*deviation from the mean*" (deviasi dari rata-rata), jadi varians adalah rata-rata deviasi kuadrat. Akar kuadrat dari varians, S, adalah *standard deviation* (simpangan baku).

Kalau kamu punya pengalaman sebelumnya, mungkin kamu pernah melihat rumus varians dengan penyebut n − 1, bukan n. Statistik itu dipakai untuk mengestimasi varians sebuah populasi memakai sampel. Kita akan kembali ke sini di Bab 8.

Struktur data pandas menyediakan metode untuk menghitung mean, varians, dan simpangan baku:

```python
mean = live.prglngth.mean()
var = live.prglngth.var()
std = live.prglngth.std()
```

Untuk semua kelahiran hidup, rata-rata lama kehamilan adalah 38,6 minggu, simpangan bakunya 2,7 minggu — artinya kita patut berharap deviasi 2–3 minggu itu hal yang umum.

Varians lama kehamilan adalah 7,3, yang sulit diinterpretasikan, apalagi satuannya minggu², atau "minggu kuadrat". Varians berguna di beberapa perhitungan, tapi ia bukan statistik ringkasan yang bagus.

## 2.9 Ukuran efek

*Effect size* (ukuran efek) adalah statistik ringkasan yang dimaksudkan untuk menggambarkan (tunggu dulu) besarnya sebuah efek. Contoh: untuk menggambarkan perbedaan antara dua kelompok, pilihan yang jelas adalah selisih rata-ratanya.

Rata-rata lama kehamilan untuk bayi pertama adalah 38,601 minggu; untuk bayi lainnya 38,523 minggu. Selisihnya 0,078 minggu, yang kalau dihitung jadi 13 jam. Sebagai fraksi dari lama kehamilan yang tipikal, selisih ini sekitar 0,2%.

Kalau kita asumsikan estimasi ini akurat, selisih sebesar itu tidak punya konsekuensi praktis. Faktanya, tanpa mengamati kehamilan dalam jumlah besar, kecil kemungkinan ada orang yang menyadari selisih ini sama sekali.

Cara lain untuk menyampaikan besarnya efek adalah membandingkan selisih antar kelompok dengan variabilitas di dalam kelompok. *Cohen's d* adalah statistik yang dimaksudkan untuk itu; ia didefinisikan:

d = (x̄₁ − x̄₂) / s

di mana x̄₁ dan x̄₂ adalah rata-rata kedua kelompok dan s adalah "*pooled standard deviation*" (simpangan baku gabungan). Ini kode Python yang menghitung Cohen's d:

```python
def CohenEffectSize(group1, group2):
    diff = group1.mean() - group2.mean()
    var1 = group1.var()
    var2 = group2.var()
    n1, n2 = len(group1), len(group2)
    pooled_var = (n1 * var1 + n2 * var2) / (n1 + n2)
    d = diff / math.sqrt(pooled_var)
    return d
```

Dalam contoh ini, selisih rata-ratanya adalah 0,029 simpangan baku — kecil sekali. Sebagai perbandingan, selisih tinggi badan antara pria dan wanita adalah sekitar 1,7 simpangan baku (lihat https://en.wikipedia.org/wiki/Effect_size).

::: tip 💡 Konteks Indonesia
"Selisih 13 jam" terdengar lumayan — sampai kamu membaginya dengan total lama kehamilan (~6.500 jam), dan ternyata cuma 0,2%. Ini gunanya ukuran efek: angka mentah menipu, konteks yang jujur. Trik yang sama kepakai saat membaca berita di Indonesia — mis. "harga naik Rp500" tidak ada artinya sebelum tahu harga awalnya Rp5.000 atau Rp500.000. Selalu tanya: selisihnya dibandingkan dengan apa?
:::

## 2.10 Melaporkan hasil

Kita sudah melihat beberapa cara untuk menggambarkan perbedaan lama kehamilan (kalau memang ada) antara bayi pertama dan bayi lainnya. Bagaimana sebaiknya kita melaporkan hasil-hasil ini?

Jawabannya bergantung pada siapa yang bertanya. Seorang ilmuwan mungkin tertarik pada efek (yang nyata) apa pun, sekecil apa pun. Seorang dokter mungkin hanya peduli pada efek yang *clinically significant* (signifikan secara klinis); yaitu, perbedaan yang memengaruhi keputusan penanganan. Seorang ibu hamil mungkin tertarik pada hasil yang relevan baginya, seperti probabilitas melahirkan lebih awal atau lebih lambat.

Cara kamu melaporkan hasil juga bergantung pada tujuanmu. Kalau kamu mencoba menunjukkan pentingnya sebuah efek, kamu mungkin memilih statistik ringkasan yang menonjolkan perbedaan. Kalau kamu mencoba menenangkan pasien yang cemas, kamu mungkin memilih statistik yang menempatkan perbedaan dalam konteks.

Tentu saja keputusanmu juga harus dipandu etika profesi. Boleh-boleh saja bersikap persuasif; kamu sebaiknya merancang laporan dan visualisasi statistik yang bercerita dengan jelas. Tapi kamu juga harus berusaha sebaik mungkin membuat laporanmu jujur, dan mengakui ketidakpastian serta keterbatasannya.

## 2.11 Latihan

**Latihan 2.1** Berdasarkan hasil-hasil di bab ini, misal kamu diminta meringkas apa yang kamu pelajari tentang apakah bayi pertama lahir terlambat. Statistik ringkasan apa yang akan kamu pakai kalau kamu ingin ceritamu masuk berita malam? Mana yang akan kamu pakai kalau kamu ingin menenangkan pasien yang cemas?

Terakhir, bayangkan kamu adalah Cecil Adams, penulis The Straight Dope (http://straightdope.com), dan tugasmu menjawab pertanyaan, "Apakah bayi pertama lahir terlambat?" Tulislah satu paragraf yang memakai hasil-hasil di bab ini untuk menjawab pertanyaan itu dengan jelas, tepat, dan jujur.

**Latihan 2.2** Di repositori yang kamu unduh, seharusnya ada file bernama `chap02ex.ipynb`; buka file itu. Sebagian sel sudah terisi, dan kamu harus mengeksekusinya. Sel-sel lain memberimu instruksi untuk latihan. Ikuti instruksinya dan isi jawabannya.

Solusi latihan ini ada di `chap02soln.ipynb`.

Di repositori yang kamu unduh, seharusnya ada file bernama `chap02ex.py`; kamu bisa memakai file ini sebagai titik awal untuk latihan-latihan berikut. Solusi saya ada di `chap02soln.py`.

**Latihan 2.3** Modus dari sebuah distribusi adalah nilai yang paling sering muncul; lihat http://wikipedia.org/wiki/Mode_(statistics). Tulislah fungsi bernama `Mode` yang menerima sebuah `Hist` dan mengembalikan nilai yang paling sering muncul.

Sebagai latihan yang lebih menantang, tulislah fungsi bernama `AllModes` yang mengembalikan daftar pasangan nilai-frekuensi dalam urutan frekuensi menurun.

**Latihan 2.4** Dengan memakai variabel `totalwgt_lb`, selidiki apakah bayi pertama lebih ringan atau lebih berat daripada bayi lainnya. Hitung Cohen's d untuk mengkuantifikasi perbedaan antar kelompok. Bagaimana perbandingannya dengan perbedaan lama kehamilan?

## 2.12 Glosarium

- *distribution* (distribusi): Nilai-nilai yang muncul dalam sebuah sampel beserta frekuensi masing-masing.
- *histogram* (histogram): Pemetaan dari nilai ke frekuensi, atau grafik yang menunjukkan pemetaan ini.
- *frequency* (frekuensi): Berapa kali sebuah nilai muncul dalam sebuah sampel.
- *mode* (modus): Nilai yang paling sering muncul dalam sebuah sampel, atau salah satu dari nilai-nilai yang paling sering muncul.
- *normal distribution* (distribusi normal): Idealisasi dari distribusi berbentuk lonceng; disebut juga distribusi Gaussian.
- *uniform distribution* (distribusi seragam): Distribusi di mana semua nilai punya frekuensi yang sama.
- *tail* (ekor): Bagian distribusi di ujung-ujung tertinggi dan terendah.
- *central tendency* (kecenderungan pusat): Karakteristik sebuah sampel atau populasi; secara intuitif, ia adalah nilai rata-rata atau nilai yang tipikal.
- *outlier* (pencilan): Nilai yang jauh dari kecenderungan pusat.
- *spread* (sebaran): Ukuran seberapa tersebarnya nilai-nilai dalam sebuah distribusi.
- *summary statistic* (statistik ringkasan): Statistik yang mengkuantifikasi suatu aspek distribusi, seperti kecenderungan pusat atau sebaran.
- *variance* (varians): Statistik ringkasan yang sering dipakai untuk mengkuantifikasi sebaran.
- *standard deviation* (simpangan baku): Akar kuadrat dari varians, juga dipakai sebagai ukuran sebaran.
- *effect size* (ukuran efek): Statistik ringkasan yang dimaksudkan untuk mengkuantifikasi besarnya sebuah efek, seperti perbedaan antar kelompok.
- *clinically significant* (signifikan secara klinis): Hasil, seperti perbedaan antar kelompok, yang relevan dalam praktik.

---

**Selanjutnya:** [Bab 3: Fungsi Massa Probabilitas](/thinkstats-bab-03) *(segera hadir)*
