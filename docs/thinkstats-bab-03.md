> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 3: Fungsi Massa Probabilitas

Kode untuk bab ini ada di `probability.py`. Untuk informasi tentang mengunduh dan memakai kode ini, lihat Bagian 0.2.

## 3.1 Pmf

Cara lain untuk merepresentasikan distribusi adalah *probability mass function* (PMF, fungsi massa probabilitas), yang memetakan setiap nilai ke probabilitasnya. *Probability* (probabilitas) adalah frekuensi yang dinyatakan sebagai pecahan dari ukuran sampel, n. Untuk mengubah frekuensi menjadi probabilitas, kita bagi semuanya dengan n — proses ini disebut *normalization* (normalisasi).

Dengan sebuah Hist, kita bisa membuat dictionary yang memetakan setiap nilai ke probabilitasnya:

```python
n = hist.Total()
d = {}
for x, freq in hist.Items():
    d[x] = freq / n
```

Atau kita bisa memakai kelas `Pmf` yang disediakan `thinkstats2`. Seperti Hist, konstruktor Pmf bisa menerima list, pandas Series, dictionary, Hist, atau objek Pmf lain. Ini contohnya dengan list sederhana:

```python
>>> import thinkstats2
>>> pmf = thinkstats2.Pmf([1, 2, 2, 3, 5])
>>> pmf
Pmf({1: 0.2, 2: 0.4, 3: 0.2, 5: 0.2})
```

Pmf ini sudah dinormalisasi sehingga total probabilitasnya 1.

Objek Pmf dan Hist mirip dalam banyak hal; malah, keduanya mewarisi banyak method dari kelas induk yang sama. Misalnya, method `Values` dan `Items` bekerja dengan cara yang sama untuk keduanya. Perbedaan terbesarnya: Hist memetakan nilai ke pencacah bilangan bulat, sedangkan Pmf memetakan nilai ke probabilitas *floating-point*.

Untuk mencari probabilitas yang terkait dengan suatu nilai, pakai `Prob`:

```python
>>> pmf.Prob(2)
0.4
```

Operator kurung siku sama saja:

```python
>>> pmf[2]
0.4
```

Kamu bisa memodifikasi Pmf yang sudah ada dengan menaikkan (*increment*) probabilitas yang terkait dengan suatu nilai:

```python
>>> pmf.Incr(2, 0.2)
>>> pmf.Prob(2)
0.6
```

Atau kamu bisa mengalikan sebuah probabilitas dengan suatu faktor:

```python
>>> pmf.Mult(2, 0.5)
>>> pmf.Prob(2)
0.3
```

Kalau kamu memodifikasi sebuah Pmf, hasilnya mungkin tidak ternormalisasi lagi; artinya, probabilitas-probabilitasnya tidak lagi berjumlah 1. Untuk memeriksanya, kamu bisa memanggil `Total`, yang mengembalikan jumlah semua probabilitas:

```python
>>> pmf.Total()
0.9
```

Untuk menormalisasi ulang, panggil `Normalize`:

```python
>>> pmf.Normalize()
>>> pmf.Total()
1.0
```

Objek Pmf menyediakan method `Copy` supaya kamu bisa membuat dan memodifikasi salinan tanpa memengaruhi yang asli.

Notasi yang kupakai di bagian ini mungkin kelihatan tidak konsisten, tapi ada sistemnya: `Pmf` untuk nama kelasnya, `pmf` untuk *instance* dari kelas itu, dan PMF untuk konsep matematis fungsi massa probabilitas.

## 3.2 Memplot PMF

`thinkplot` menyediakan dua cara untuk memplot Pmf:

- Untuk memplot Pmf sebagai grafik batang, kamu bisa pakai `thinkplot.Hist`. Grafik batang paling berguna kalau jumlah nilai di Pmf-nya sedikit.
- Untuk memplot Pmf sebagai fungsi tangga, kamu bisa pakai `thinkplot.Pmf`. Opsi ini paling berguna kalau nilainya banyak dan PMF-nya mulus. Fungsi ini juga bisa dipakai untuk objek Hist.

Selain itu, `pyplot` punya fungsi bernama `hist` yang menerima sederet nilai, menghitung histogramnya, lalu memplotnya. Karena aku memakai objek Hist, aku biasanya tidak memakai `pyplot.hist`.

Grafik 3.1 menunjukkan PMF lama kehamilan untuk anak pertama dan anak-anak berikutnya, digambar sebagai grafik batang (kiri) dan fungsi tangga (kanan).

*[Grafik 3.1: PMF lama kehamilan untuk anak pertama dan anak berikutnya — grafik batang (kiri) dan fungsi tangga (kanan)]*

Dengan memplot PMF alih-alih histogram, kita bisa membandingkan kedua distribusi tanpa terkecoh oleh perbedaan ukuran sampel. Dari grafik ini, anak pertama tampaknya lebih jarang lahir tepat waktu (minggu ke-39) dan lebih sering lahir terlambat (minggu ke-41 dan 42).

::: tip 💡 Konteks Indonesia
Data kehamilan seperti NSFG ini punya padanan di Indonesia: **SDKI** (Survei Demografi dan Kesehatan Indonesia), survei nasional yang mencatat riwayat kehamilan dan kelahiran. Jadi kalau kamu mau mereplikasi analisis "anak pertama vs anak berikutnya" ini dengan data lokal, SDKI adalah titik mulai yang masuk akal.
:::

Ini kode yang menghasilkan Grafik 3.1:

```python
thinkplot.PrePlot(2, cols=2)
thinkplot.Hist(first_pmf, align='right', width=width)
thinkplot.Hist(other_pmf, align='left', width=width)
thinkplot.Config(xlabel='weeks',
                 ylabel='probability',
                 axis=[27, 46, 0, 0.6])

thinkplot.PrePlot(2)
thinkplot.SubPlot(2)
thinkplot.Pmfs([first_pmf, other_pmf])
thinkplot.Show(xlabel='weeks',
               axis=[27, 46, 0, 0.6])
```

`PrePlot` menerima parameter opsional `rows` dan `cols` untuk membuat grid gambar — dalam kasus ini satu baris berisi dua gambar. Gambar pertama (kiri) menampilkan Pmf memakai `thinkplot.Hist`, seperti yang sudah kita lihat sebelumnya.

Pemanggilan `PrePlot` yang kedua me-reset generator warna. Lalu `SubPlot` beralih ke gambar kedua (kanan) dan menampilkan Pmf memakai `thinkplot.Pmfs`. Aku memakai opsi `axis` supaya kedua gambar memakai sumbu yang sama — ini umumnya ide bagus kalau kamu memang berniat membandingkan dua gambar.

## 3.3 Visualisasi lain

Histogram dan PMF berguna saat kamu mengeksplorasi data dan mencoba mengenali pola serta hubungan. Begitu kamu sudah punya gambaran tentang apa yang terjadi, langkah bagus berikutnya adalah merancang visualisasi yang membuat pola yang sudah kamu kenali sejelas mungkin.

Di data NSFG, perbedaan terbesar antar distribusi ada di sekitar *mode* (modus — nilai yang paling sering muncul). Jadi masuk akal untuk memperbesar bagian itu dari grafik, dan mentransformasi data supaya perbedaannya lebih menonjol:

```python
weeks = range(35, 46)
diffs = []
for week in weeks:
    p1 = first_pmf.Prob(week)
    p2 = other_pmf.Prob(week)
    diff = 100 * (p1 - p2)
    diffs.append(diff)

thinkplot.Bar(weeks, diffs)
```

Di kode ini, `weeks` adalah rentang minggu; `diffs` adalah selisih kedua PMF dalam poin persentase. Grafik 3.2 menunjukkan hasilnya sebagai grafik batang.

*[Grafik 3.2: selisih PMF dalam poin persentase per minggu]*

Grafik ini membuat polanya lebih jelas: anak pertama lebih jarang lahir di minggu ke-39, dan agak lebih sering lahir di minggu ke-41 dan 42.

Untuk sekarang, anggap kesimpulan ini masih tentatif. Kita memakai dataset yang sama untuk menemukan perbedaan yang tampak, lalu memilih visualisasi yang menonjolkan perbedaan itu. Kita belum bisa yakin efek ini nyata; bisa jadi cuma variasi acak. Kekhawatiran ini akan kita bahas nanti.

## 3.4 Paradoks ukuran kelas

Sebelum lanjut, aku mau menunjukkan satu jenis komputasi yang bisa kamu lakukan dengan objek Pmf; contoh ini kusebut "paradoks ukuran kelas" (*class size paradox*).

Di banyak kampus di Amerika, rasio mahasiswa terhadap dosen sekitar 10:1. Tapi mahasiswa sering terkejut saat tahu rata-rata ukuran kelas mereka ternyata lebih besar dari 10. Ada dua alasan untuk perbedaan ini:

- Mahasiswa biasanya mengambil 4–5 mata kuliah per semester, tapi dosen seringnya cuma mengajar 1 atau 2.
- Jumlah mahasiswa yang menikmati kelas kecil itu sedikit, tapi jumlah mahasiswa yang ada di kelas besar itu (ehem!) besar.

Efek pertama sudah jelas, setidaknya begitu ditunjukkan; yang kedua lebih halus. Lihat contoh ini. Misalkan sebuah kampus menawarkan 65 kelas dalam satu semester, dengan distribusi ukuran sebagai berikut:

| ukuran | jumlah |
|---|---|
| 5–9 | 8 |
| 10–14 | 8 |
| 15–19 | 14 |
| 20–24 | 4 |
| 25–29 | 6 |
| 30–34 | 12 |
| 35–39 | 8 |
| 40–44 | 3 |
| 45–49 | 2 |

Kalau kamu tanya ke dekan berapa rata-rata ukuran kelas, ia akan membangun PMF, menghitung *mean* (rata-rata), dan melaporkan bahwa rata-rata ukuran kelas adalah 23,7. Ini kodenya:

```python
d = { 7: 8, 12: 8, 17: 14, 22: 4,
      27: 6, 32: 12, 37: 8, 42: 3, 47: 2 }
pmf = thinkstats2.Pmf(d, label='actual')
print('mean', pmf.Mean())
```

Tapi kalau kamu menyurvei sekelompok mahasiswa, menanyai berapa banyak mahasiswa di kelas mereka, lalu menghitung rata-ratanya, kamu akan mengira rata-rata kelasnya lebih besar. Mari lihat seberapa besar.

Pertama, aku menghitung distribusi sebagaimana diamati mahasiswa, di mana probabilitas yang terkait dengan tiap ukuran kelas "di-bias" oleh jumlah mahasiswa di kelas itu.

```python
def BiasPmf(pmf, label):
    new_pmf = pmf.Copy(label=label)
    for x, p in pmf.Items():
        new_pmf.Mult(x, x)
    new_pmf.Normalize()
    return new_pmf
```

Untuk tiap ukuran kelas, x, kita kalikan probabilitasnya dengan x — jumlah mahasiswa yang mengamati ukuran kelas itu. Hasilnya adalah Pmf baru yang merepresentasikan distribusi yang bias.

Sekarang kita bisa memplot distribusi aktual dan distribusi yang diamati:

```python
biased_pmf = BiasPmf(pmf, label='observed')
thinkplot.PrePlot(2)
thinkplot.Pmfs([pmf, biased_pmf])
thinkplot.Show(xlabel='class size', ylabel='PMF')
```

*[Grafik 3.3: distribusi ukuran kelas — aktual vs yang diamati mahasiswa]*

Grafik 3.3 menunjukkan hasilnya. Di distribusi yang bias, kelas-kelas kecil lebih sedikit dan kelas-kelas besar lebih banyak. Rata-rata distribusi yang bias adalah 29,1 — hampir 25% lebih tinggi dari rata-rata aktual.

Operasi ini juga bisa dibalik. Misalkan kamu ingin tahu distribusi ukuran kelas di sebuah kampus, tapi tidak bisa dapat data yang bisa diandalkan dari dekan. Alternatifnya: ambil sampel acak mahasiswa dan tanya berapa banyak mahasiswa di kelas mereka.

Hasilnya akan bias karena alasan yang baru kita lihat, tapi kamu bisa memakainya untuk mengestimasi distribusi aktualnya. Ini fungsi yang menghilangkan bias dari sebuah Pmf:

```python
def UnbiasPmf(pmf, label):
    new_pmf = pmf.Copy(label=label)
    for x, p in pmf.Items():
        new_pmf.Mult(x, 1.0/x)
    new_pmf.Normalize()
    return new_pmf
```

Fungsinya mirip `BiasPmf`; satu-satunya beda adalah tiap probabilitas dibagi x, bukan dikali.

::: tip 💡 Konteks Indonesia
Paradoks ini juga berlaku di Indonesia. Misalkan dinas pendidikan mencatat rata-rata satu rombel berisi 28 siswa — tapi kalau kamu tanya ke teman-temanmu satu sekolah, mereka bilang kelasnya rata-rata 32 siswa. Bukan karena ada yang bohong: kelas besar "terhitung" lebih sering karena dihuni lebih banyak saksi. Pelajarannya: setiap kali membaca hasil survei, tanya dulu — *siapa yang diamati, dan lewat sudut pandang siapa?*
:::

## 3.5 Indeksing DataFrame

Di Bagian 1.4 kita membaca DataFrame pandas dan memakainya untuk memilih dan memodifikasi kolom data. Sekarang mari lihat seleksi baris. Untuk mulai, aku membuat array NumPy berisi angka acak dan memakainya untuk menginisialisasi DataFrame:

```python
>>> import numpy as np
>>> import pandas
>>> array = np.random.randn(4, 2)
>>> df = pandas.DataFrame(array)
>>> df
          0         1
0 -0.143510  0.616050
1 -1.489647  0.300774
2 -0.074350  0.039621
3 -1.369968  0.545897
```

> **Catatan penerjemah:** angka di contoh ini dibangkitkan secara acak (`np.random.randn`), jadi hasil yang kamu dapat saat menjalankannya akan berbeda — yang penting strukturnya sama.

Secara default, baris dan kolom dinomori mulai dari nol, tapi kamu bisa memberi nama kolom:

```python
>>> columns = ['A', 'B']
>>> df = pandas.DataFrame(array, columns=columns)
>>> df
          A         B
0 -0.143510  0.616050
1 -1.489647  0.300774
2 -0.074350  0.039621
3 -1.369968  0.545897
```

Kamu juga bisa memberi nama baris. Kumpulan nama baris disebut *index* (indeks); nama-nama baris itu sendiri disebut label.

```python
>>> index = ['a', 'b', 'c', 'd']
>>> df = pandas.DataFrame(array, columns=columns, index=index)
>>> df
          A         B
a -0.143510  0.616050
b -1.489647  0.300774
c -0.074350  0.039621
d -1.369968  0.545897
```

Seperti yang kita lihat di bab sebelumnya, indeksing sederhana memilih sebuah kolom dan mengembalikan Series:

```python
>>> df['A']
a   -0.143510
b   -1.489647
c   -0.074350
d   -1.369968
Name: A, dtype: float64
```

Untuk memilih baris berdasarkan label, kamu bisa memakai atribut `loc`, yang mengembalikan Series:

```python
>>> df.loc['a']
A   -0.14351
B    0.61605
Name: a, dtype: float64
```

Kalau kamu tahu posisi bilangan bulat sebuah baris (bukan labelnya), kamu bisa memakai atribut `iloc`, yang juga mengembalikan Series.

```python
>>> df.iloc[0]
A   -0.14351
B    0.61605
Name: a, dtype: float64
```

`loc` juga bisa menerima list label; dalam kasus itu hasilnya adalah DataFrame.

```python
>>> indices = ['a', 'c']
>>> df.loc[indices]
          A         B
a -0.14351  0.616050
c -0.07435  0.039621
```

Terakhir, kamu bisa memakai *slice* untuk memilih rentang baris berdasarkan label:

```python
>>> df['a':'c']
          A         B
a -0.143510  0.616050
b -1.489647  0.300774
c -0.074350  0.039621
```

Atau berdasarkan posisi bilangan bulat:

```python
>>> df[0:2]
          A         B
a -0.143510  0.616050
b -1.489647  0.300774
```

Hasilnya dalam kedua kasus adalah DataFrame, tapi perhatikan: hasil pertama menyertakan ujung slice-nya, yang kedua tidak.

Saranku: kalau baris-barismu punya label yang bukan bilangan bulat sederhana, pakai label secara konsisten dan hindari memakai posisi bilangan bulat.

## 3.6 Latihan

Solusi untuk latihan-latihan ini ada di `chap03soln.ipynb` dan `chap03soln.py`.

**Latihan 3.1** Hal seperti paradoks ukuran kelas muncul kalau kamu menyurvei anak-anak dan menanyai berapa banyak anak di keluarga mereka. Keluarga dengan banyak anak lebih mungkin muncul di sampelmu, dan keluarga tanpa anak tidak punya peluang masuk sampel sama sekali.

Pakai variabel responden NSFG `NUMKDHH` untuk membangun distribusi aktual jumlah anak di bawah 18 tahun dalam satu rumah tangga.

Sekarang hitung distribusi bias yang akan kita lihat seandainya kita menyurvei anak-anak itu dan menanyai berapa banyak anak di bawah 18 tahun (termasuk diri mereka sendiri) di rumah tangga mereka.

Plot distribusi aktual dan distribusi biasnya, lalu hitung rata-rata masing-masing. Sebagai titik awal, kamu bisa memakai `chap03ex.ipynb`.

::: tip 💡 Konteks Indonesia
`NUMKDHH` adalah singkatan dari "number of kids under 18 in household" — jumlah anak di bawah 18 tahun dalam satu rumah tangga. Kalau kamu mau mencoba latihan ini dengan data Indonesia, variabel semacam ini ada di **Susenas** (misalnya jumlah anggota rumah tangga menurut kelompok umur). Logika biasnya sama persis: rumah tangga besar lebih sering "ketangkap" survei versi anak.
:::

**Latihan 3.2** Di Bagian 2.7 kita menghitung *mean* sebuah sampel dengan menjumlahkan semua elemen lalu membaginya dengan n. Kalau yang kamu punya adalah PMF, kamu tetap bisa menghitung rata-ratanya, tapi prosesnya sedikit berbeda:

x̄ = Σᵢ pᵢxᵢ

di mana xᵢ adalah nilai-nilai unik di PMF dan pᵢ = PMF(xᵢ). Begitu juga, kamu bisa menghitung varians seperti ini:

S² = Σᵢ pᵢ(xᵢ − x̄)²

Tulis fungsi bernama `PmfMean` dan `PmfVar` yang menerima objek Pmf dan menghitung mean serta variansnya. Untuk menguji fungsi-fungsi ini, cek konsistensinya dengan method `Mean` dan `Var` yang disediakan Pmf.

**Latihan 3.3** Aku mulai dengan pertanyaan, "Apakah anak pertama lebih mungkin lahir terlambat?" Untuk menjawabnya, aku menghitung selisih rata-rata antara kelompok bayi, tapi aku mengabaikan kemungkinan adanya perbedaan antara anak pertama dan anak-anak berikutnya dari ibu yang sama.

Untuk menjawab versi pertanyaan ini, pilih responden yang punya setidaknya dua anak lalu hitung selisih berpasangannya (*pairwise differences*). Apakah rumusan pertanyaan ini menghasilkan hasil yang berbeda?

Petunjuk: pakai `nsfg.MakePregMap`.

**Latihan 3.4** Di kebanyakan lomba lari, semua orang start pada waktu yang sama. Kalau kamu pelari cepat, biasanya kamu menyalip banyak orang di awal lomba, tapi setelah beberapa mil, semua orang di sekitarmu larinya secepat kamu.

Waktu pertama kali aku ikut lomba lari estafet jarak jauh (209 mil), aku menyadari fenomena aneh: saat aku menyalip pelari lain, biasanya aku jauh lebih cepat, dan saat pelari lain menyalipku, biasanya dia jauh lebih cepat.

Awalnya aku mengira distribusi kecepatannya mungkin *bimodal*; artinya, ada banyak pelari lambat dan banyak pelari cepat, tapi sedikit yang secepat aku.

Lalu aku sadar bahwa aku adalah korban bias yang mirip dengan efek ukuran kelas. Lomba itu tidak biasa dalam dua hal: start-nya bertahap (*staggered*), jadi tiap tim start di waktu yang berbeda; juga, banyak tim berisi pelari dengan level kemampuan yang berbeda-beda.

Akibatnya, para pelari tersebar di sepanjang rute tanpa hubungan yang jelas antara kecepatan dan lokasi. Saat aku bergabung ke lomba, pelari-pelari di dekatku (kurang-lebih) adalah sampel acak dari seluruh pelari.

Jadi biasnya datang dari mana? Selama aku berada di rute, peluang menyalip seorang pelari — atau disalip — sebanding dengan selisih kecepatan kami. Aku lebih mungkin mengejar pelari yang lambat, dan lebih mungkin dikejar pelari yang cepat. Tapi pelari yang kecepatannya sama denganku kecil kemungkinannya untuk saling bertemu.

Tulis fungsi bernama `ObservedPmf` yang menerima Pmf yang merepresentasikan distribusi aktual kecepatan para pelari, dan kecepatan seorang pengamat yang sedang berlari, lalu mengembalikan Pmf baru yang merepresentasikan distribusi kecepatan para pelari sebagaimana dilihat oleh pengamat itu.

Untuk menguji fungsimu, kamu bisa memakai `relay.py`, yang membaca hasil lomba James Joyce Ramble 10K di Dedham, MA, dan mengonversi *pace* tiap pelari ke mph.

Hitung distribusi kecepatan yang akan kamu amati kalau kamu ikut lomba estafet dengan kecepatan 7,5 mph bersama kelompok pelari ini. Solusi latihan ini ada di `relay_soln.py`.

## 3.7 Glosarium

- **Probability mass function (PMF, fungsi massa probabilitas):** representasi distribusi sebagai fungsi yang memetakan setiap nilai ke probabilitasnya.
- **probability (probabilitas):** frekuensi yang dinyatakan sebagai pecahan dari ukuran sampel.
- **normalization (normalisasi):** proses membagi frekuensi dengan ukuran sampel untuk mendapatkan probabilitas.
- **index (indeks):** dalam DataFrame pandas, indeks adalah kolom khusus yang berisi label baris.

---

**Selanjutnya:** [Bab 4: Fungsi Distribusi Kumulatif](/thinkstats-bab-04) *(segera hadir)*
