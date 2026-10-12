> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 1: Analisis Data Eksploratif

Tesis buku ini sederhana: data yang dikombinasikan dengan metode praktis bisa menjawab pertanyaan dan memandu keputusan di tengah ketidakpastian.

Sebagai contoh, ini ada studi kasus yang berangkat dari pertanyaan yang kudengar waktu istriku dan aku sedang menanti anak pertama: apakah bayi pertama cenderung lahir telat?

Kalau kamu Google pertanyaan itu, kamu bakal nemu banyak banget diskusi. Ada yang bilang iya bener, ada yang bilang itu mitos, ada juga yang bilang justru kebalikannya: bayi pertama lahir lebih cepat.

Di banyak diskusi itu, orang-orang menyertakan data buat mendukung klaimnya. Aku nemu banyak contoh kayak gini:

> "Dua temenku yang baru aja lahiran anak pertama, KEDUA-DUANYA telat hampir 2 minggu sebelum kontraksi atau diinduksi."

> "Anak pertamaku telat 2 minggu dan sekarang kayaknya anak kedua mau keluar 2 minggu lebih cepat!!"

> "Kayaknya nggak bener deh, soalnya kakakku itu anak pertama ibuku dan dia lahir prematur, sama kayak sepupu-sepupuku yang lain."

Laporan kayak gini disebut *anecdotal evidence* (bukti anekdotal) karena datanya tidak dipublikasikan dan biasanya bersifat personal. Buat obrolan santai sih nggak ada yang salah dengan anekdot, jadi aku nggak bermaksud nyinyir ke orang-orang yang kuutip di atas.

Tapi mungkin kita pengen bukti yang lebih meyakinkan dan jawaban yang lebih bisa diandalkan. Dengan standar itu, bukti anekdotal biasanya gagal, karena:

- **Jumlah observasi sedikit.** Kalau durasi kehamilan memang lebih panjang untuk bayi pertama, selisihnya mungkin kecil dibanding variasi alami. Kalau begitu, kita harus membandingkan kehamilan dalam jumlah besar biar yakin selisihnya beneran ada.
- **Bias seleksi** (*selection bias*). Orang yang ikut diskusi soal pertanyaan ini mungkin tertarik justru karena bayi pertamanya telat. Kalau begitu, proses pemilihan datanya sudah bias dari awal.
- **Bias konfirmasi** (*confirmation bias*). Orang yang percaya klaimnya cenderung menyumbang contoh yang mendukungnya. Orang yang ragu cenderung mengutip contoh yang berlawanan.
- **Tidak akurat.** Anekdot biasanya cerita personal, dan sering kali salah ingat, salah saji, diulang-ulang sampai melenceng, dan sebagainya.

Jadi gimana caranya biar lebih baik?

## 1.1 Pendekatan statistik

Untuk mengatasi keterbatasan anekdot, kita pakai perkakas statistik, yang meliputi:

- **Pengumpulan data** (*data collection*). Kita pakai data dari survei nasional berskala besar yang memang dirancang untuk menghasilkan inferensi yang valid secara statistik tentang populasi AS.
- **Statistik deskriptif** (*descriptive statistics*). Kita bikin statistik yang merangkum data secara ringkas, dan mengevaluasi berbagai cara memvisualisasikan data.
- **Analisis data eksploratif** (*exploratory data analysis*, EDA). Kita cari pola, perbedaan, dan fitur lain yang menjawab pertanyaan kita. Bersamaan dengan itu, kita cek inkonsistensi dan identifikasi keterbatasan data.
- **Estimasi** (*estimation*). Kita pakai data dari sampel untuk mengestimasi karakteristik populasi umum.
- **Uji hipotesis** (*hypothesis testing*). Kalau kita melihat efek yang tampak, misalnya perbedaan antara dua kelompok, kita evaluasi apakah efek itu mungkin terjadi cuma karena kebetulan.

Dengan menjalankan langkah-langkah ini secara hati-hati dan menghindari jebakan, kita bisa sampai ke kesimpulan yang lebih bisa dipertanggungjawabkan dan lebih mungkin benar.

## 1.2 Survei Pertumbuhan Keluarga Nasional

Sejak 1973, Centers for Disease Control and Prevention (CDC) AS mengadakan National Survey of Family Growth (NSFG, Survei Pertumbuhan Keluarga Nasional), yang tujuannya mengumpulkan "informasi tentang kehidupan keluarga, pernikahan dan perceraian, kehamilan, infertilitas, penggunaan kontrasepsi, serta kesehatan pria dan wanita. Hasil surveinya dipakai ... untuk merencanakan layanan kesehatan dan program edukasi kesehatan, dan untuk studi statistik tentang keluarga, fertilitas, dan kesehatan." Lihat http://cdc.gov/nchs/nsfg.htm.

Kita akan pakai data yang dikumpulkan survei ini untuk menyelidiki apakah bayi pertama cenderung lahir telat, plus pertanyaan-pertanyaan lain. Supaya bisa memakai data ini dengan efektif, kita harus paham desain studinya.

NSFG adalah *cross-sectional study* (studi cross-sectional), artinya ia memotret sekumpulan orang pada satu titik waktu. Alternatif yang paling umum adalah *longitudinal study* (studi longitudinal), yang mengamati satu kelompok berulang kali dalam rentang waktu.

NSFG sudah diadakan tujuh kali; setiap pelaksanaan disebut *cycle* (siklus). Kita akan pakai data dari Siklus 6, yang dilaksanakan Januari 2002 sampai Maret 2003.

Tujuan survei ini adalah menarik kesimpulan tentang sebuah *population* (populasi); populasi target NSFG adalah penduduk AS berusia 15–44 tahun. Idealnya survei mengumpulkan data dari setiap anggota populasi, tapi itu jarang bisa dilakukan. Sebagai gantinya kita mengumpulkan data dari sebagian populasi yang disebut *sample* (sampel). Orang-orang yang berpartisipasi dalam survei disebut *respondent* (responden).

Secara umum, studi cross-sectional dimaksudkan agar *representative* (representatif), artinya setiap anggota populasi target punya peluang yang sama untuk berpartisipasi. Ideal itu susah dicapai dalam praktik, tapi para penyelenggara survei berusaha sedekat mungkin.

NSFG itu tidak representatif; ia justru sengaja di-*oversample*. Perancang studinya merekrut tiga kelompok — Hispanik, Afrika-Amerika, dan remaja — dengan laju lebih tinggi daripada proporsi mereka di populasi AS, supaya jumlah responden di tiap kelompok ini cukup besar untuk menarik inferensi statistik yang valid.

Tentu saja, kelemahan oversampling adalah tidak semudah itu menarik kesimpulan tentang populasi umum berdasarkan statistik dari survei. Kita akan kembali ke poin ini nanti.

Saat bekerja dengan data semacam ini, penting untuk akrab dengan *codebook* (buku kode), yang mendokumentasikan desain studi, pertanyaan survei, dan pengkodean jawabannya. Codebook dan panduan pengguna data NSFG tersedia di http://www.cdc.gov/nchs/nsfg/nsfg_cycle6.htm.

::: tip 💡 Konteks Indonesia
NSFG itu surveinya orang Amerika. Padanan terdekatnya di Indonesia: **Susenas** (Survei Sosial Ekonomi Nasional) dan **Riskesdas** (Riset Kesehatan Dasar) dari BPS/Kemenkes. Pola datanya mirip — puluhan ribu responden, ratusan variabel, dan banyak nilai aneh yang perlu dibersihkan. Jadi setiap kali buku ini menyebut NSFG, bayangkan kamu sedang mengoprek data Susenas. Konsepnya sama persis: sampel, bobot statistik, dan *codebook* (di BPS biasanya disebut "pedoman pencacahan" atau dokumentasi variabel).
:::

## 1.3 Mengimpor data

Kode dan data yang dipakai buku ini tersedia di https://github.com/AllenDowney/ThinkStats2. Untuk info soal mengunduh dan memakai kode ini, lihat Bagian 0.2.

Begitu kamu mengunduh kodenya, harusnya kamu punya file bernama `ThinkStats2/code/nsfg.py`. Kalau kamu menjalankannya, ia akan membaca file data, menjalankan beberapa tes, dan mencetak pesan seperti, "All tests passed."

Mari kita lihat apa yang ia lakukan. Data kehamilan dari NSFG Siklus 6 ada di file bernama `2002FemPreg.dat.gz`; ini file data teks polos (ASCII) yang dikompres gzip, dengan kolom berlebar tetap (*fixed width*). Setiap baris di file ini adalah satu *record* (catatan) yang berisi data tentang satu kehamilan.

Format file ini didokumentasikan di `2002FemPreg.dct`, yang merupakan file kamus Stata (*Stata dictionary*). Stata adalah sistem perangkat lunak statistik; "kamus" dalam konteks ini adalah daftar nama variabel, tipe, dan indeks yang menunjukkan di posisi mana tiap variabel berada dalam tiap baris.

Contohnya, ini beberapa baris dari `2002FemPreg.dct`:

```python
infile dictionary {
    _column(1)  str12  caseid    %12s  "RESPONDENT ID NUMBER"
    _column(13) byte   pregordr  %2f   "PREGNANCY ORDER (NUMBER)"
}
```

Kamus ini mendeskripsikan dua variabel: `caseid` adalah string 12 karakter yang mewakili ID responden; `pregordr` adalah integer satu byte yang menunjukkan kehamilan ke berapa yang dideskripsikan record ini untuk responden tersebut.

Kode yang kamu unduh mencakup `thinkstats2.py`, modul Python yang berisi banyak kelas dan fungsi yang dipakai di buku ini, termasuk fungsi yang membaca kamus Stata dan file data NSFG. Begini cara memakainya di `nsfg.py`:

```python
def ReadFemPreg(dct_file='2002FemPreg.dct',
                dat_file='2002FemPreg.dat.gz'):
    dct = thinkstats2.ReadStataDct(dct_file)
    df = dct.ReadFixedWidth(dat_file, compression='gzip')
    CleanFemPreg(df)
    return df
```

`ReadStataDct` menerima nama file kamus dan mengembalikan `dct`, objek `FixedWidthVariables` yang berisi informasi dari file kamus. `dct` menyediakan `ReadFixedWidth`, yang membaca file data.

## 1.4 DataFrame

Hasil dari `ReadFixedWidth` adalah sebuah DataFrame, struktur data fundamental yang disediakan **pandas**, paket Python untuk data dan statistik yang akan kita pakai di seluruh buku ini. Sebuah DataFrame berisi satu baris untuk tiap record — dalam kasus ini satu baris per kehamilan — dan satu kolom untuk tiap variabel.

Selain datanya, DataFrame juga berisi nama variabel dan tipenya, serta menyediakan method untuk mengakses dan memodifikasi data.

Kalau kamu mencetak `df`, kamu dapat tampilan terpotong dari baris dan kolom, plus bentuk (*shape*) DataFrame-nya: 13593 baris/record dan 244 kolom/variabel.

```python
>>> import nsfg
>>> df = nsfg.ReadFemPreg()
>>> df
...
[13593 rows x 244 columns]
```

DataFrame-nya terlalu besar untuk ditampilkan, jadi outputnya dipotong. Baris terakhir melaporkan jumlah baris dan kolom.

Atribut `columns` mengembalikan deretan nama kolom sebagai string Unicode:

```python
>>> df.columns
Index(['caseid', 'pregordr', 'howpreg_n', 'howpreg_p', ... ], dtype='object')
```

Hasilnya adalah sebuah Index, struktur data pandas yang lain. Kita akan belajar lebih banyak tentang Index nanti, tapi untuk sekarang perlakukan saja seperti list:

```python
>>> df.columns[1]
'pregordr'
```

Untuk mengakses kolom dari DataFrame, kamu bisa pakai nama kolom sebagai key:

```python
>>> pregordr = df['pregordr']
>>> type(pregordr)
<class 'pandas.core.series.Series'>
```

Hasilnya adalah sebuah Series, struktur data pandas yang lain lagi. Series itu seperti list Python dengan beberapa fitur tambahan. Saat kamu mencetak Series, kamu dapat indeks dan nilai yang bersesuaian:

```python
>>> pregordr
0        1
1        2
2        1
3        2
...
13590    3
13591    4
13592    5
Name: pregordr, Length: 13593, dtype: int64
```

Di contoh ini indeksnya adalah integer dari 0 sampai 13592, tapi secara umum bisa berupa tipe apa pun yang bisa diurutkan. Elemennya juga integer, tapi bisa berupa tipe apa pun.

Baris terakhir mencakup nama variabel, panjang Series, dan tipe datanya; `int64` adalah salah satu tipe yang disediakan NumPy. Kalau kamu menjalankan contoh ini di mesin 32-bit, kamu mungkin melihat `int32`.

Kamu bisa mengakses elemen Series memakai indeks integer dan slice:

```python
>>> pregordr[0]
1
>>> pregordr[2:5]
2    1
3    2
4    3
Name: pregordr, dtype: int64
```

Hasil dari operator indeks adalah `int64`; hasil dari slice adalah Series lain.

Kamu juga bisa mengakses kolom DataFrame memakai notasi titik:

```python
>>> pregordr = df.pregordr
```

Notasi ini cuma bisa dipakai kalau nama kolomnya identifier Python yang valid — harus diawali huruf, tidak boleh ada spasi, dan sebagainya.

## 1.5 Variabel

Kita sudah melihat dua variabel di dataset NSFG, `caseid` dan `pregordr`, dan kita sudah tahu totalnya ada 244 variabel. Untuk eksplorasi di buku ini, aku memakai variabel-variabel berikut:

- `caseid` adalah ID integer responden.
- `prglngth` adalah durasi kehamilan dalam minggu (integer).
- `outcome` adalah kode integer untuk hasil kehamilan. Kode 1 berarti kelahiran hidup (*live birth*).
- `pregordr` adalah nomor urut kehamilan; misalnya, kode untuk kehamilan pertama seorang responden adalah 1, untuk kehamilan kedua adalah 2, dan seterusnya.
- `birthord` adalah nomor urut untuk kelahiran hidup; kode untuk anak pertama seorang responden adalah 1, dan seterusnya. Untuk hasil selain kelahiran hidup, field ini kosong.
- `birthwgt_lb` dan `birthwgt_oz` berisi bagian pon (*pound*) dan ons (*ounce*) dari berat lahir bayi.
- `agepreg` adalah usia ibu di akhir kehamilan.
- `finalwgt` adalah bobot statistik (*statistical weight*) yang terkait dengan responden. Ini nilai floating-point yang menunjukkan berapa banyak orang di populasi AS yang diwakili responden ini.

Kalau kamu membaca codebook-nya dengan teliti, kamu akan lihat bahwa banyak variabel merupakan *recode*, artinya mereka bukan bagian dari data mentah yang dikumpulkan survei; mereka dihitung dari data mentah.

Contohnya, `prglngth` untuk kelahiran hidup sama dengan variabel mentah `wksgest` (minggu gestasi) kalau tersedia; kalau tidak, ia diestimasi memakai `mosgest * 4.33` (bulan gestasi dikali rata-rata jumlah minggu dalam sebulan).

Recode sering didasarkan pada logika yang mengecek konsistensi dan akurasi data. Secara umum sebaiknya pakai recode kalau tersedia, kecuali ada alasan kuat untuk mengolah data mentahnya sendiri.

::: tip 💡 Konteks Indonesia
Berat bayi di data NSFG dicatat dalam **pon dan ons** (1 pon = 16 ons ≈ 454 gram). Di Indonesia kita pakai gram atau kilogram — bayi baru lahir normal itu sekitar 2,5–4 kg, alias 5,5–8,8 pon. Jadi kalau nanti kamu lihat angka berat dalam pon, kalikan saja dengan 0,45 untuk dapat kilogramnya. Kebiasaan "satuan aneh di data mentah" ini universal: data Susenas pun sering punya satuan yang bikin garuk-garuk kepala kalau belum baca dokumentasinya.
:::

## 1.6 Transformasi

Saat kamu mengimpor data seperti ini, kamu sering harus mengecek error, menangani nilai-nilai spesial, mengonversi data ke format yang berbeda, dan melakukan perhitungan. Operasi-operasi ini disebut *data cleaning* (pembersihan data).

`nsfg.py` mencakup `CleanFemPreg`, fungsi yang membersihkan variabel-variabel yang rencananya kupakai.

```python
def CleanFemPreg(df):
    df.agepreg /= 100.0

    na_vals = [97, 98, 99]
    df['birthwgt_lb'] = df.birthwgt_lb.replace(na_vals, np.nan)
    df['birthwgt_oz'] = df.birthwgt_oz.replace(na_vals, np.nan)

    df['totalwgt_lb'] = df.birthwgt_lb + df.birthwgt_oz / 16.0
```

`agepreg` berisi usia ibu di akhir kehamilan. Di file data, `agepreg` dikodekan sebagai integer dalam satuan centitahun. Jadi baris pertama membagi tiap elemen `agepreg` dengan 100, menghasilkan nilai floating-point dalam tahun.

`birthwgt_lb` dan `birthwgt_oz` berisi berat bayi, dalam pon dan ons, untuk kehamilan yang berakhir dengan kelahiran hidup. Selain itu ia memakai beberapa kode spesial:

| Kode | Arti |
|---|---|
| 97 | NOT ASCERTAINED (tidak terkonfirmasi) |
| 98 | REFUSED (menolak menjawab) |
| 99 | DON'T KNOW (tidak tahu) |

Nilai spesial yang dikodekan sebagai angka itu berbahaya, karena kalau tidak ditangani dengan benar, bisa menghasilkan hasil ngawur — misalnya bayi seberat 99 pon. Method `replace` mengganti nilai-nilai ini dengan `np.nan`, nilai floating-point spesial yang mewakili "*not a number*" (bukan angka).

Sebagai bagian dari standar floating-point IEEE, semua operasi matematika mengembalikan `nan` kalau salah satu argumennya `nan`:

```python
>>> import numpy as np
>>> np.nan / 100.0
nan
```

Jadi komputasi dengan `nan` cenderung "berperilaku benar", dan kebanyakan fungsi pandas menangani `nan` dengan tepat. Tapi menangani data yang hilang akan jadi isu yang muncul terus-menerus.

Baris terakhir `CleanFemPreg` membuat kolom baru `totalwgt_lb` yang menggabungkan pon dan ons menjadi satu kuantitas, dalam pon.

Satu catatan penting: saat kamu menambah kolom baru ke DataFrame, kamu harus pakai sintaks kamus (*dictionary syntax*), seperti ini:

```python
# BENAR
df['totalwgt_lb'] = df.birthwgt_lb + df.birthwgt_oz / 16.0
```

Bukan notasi titik, seperti ini:

```python
# SALAH!
df.totalwgt_lb = df.birthwgt_lb + df.birthwgt_oz / 16.0
```

Versi dengan notasi titik memang menambah atribut ke objek DataFrame, tapi atribut itu tidak diperlakukan sebagai kolom baru.

## 1.7 Validasi

Ketika data diekspor dari satu lingkungan perangkat lunak dan diimpor ke lingkungan lain, error bisa saja terselip. Dan ketika kamu sedang berkenalan dengan dataset baru, kamu bisa saja salah mengartikan data atau menimbulkan kesalahpahaman lain. Kalau kamu meluangkan waktu untuk memvalidasi data, kamu bisa menghemat waktu nanti dan menghindari error.

Salah satu cara memvalidasi data adalah menghitung statistik dasar dan membandingkannya dengan hasil yang dipublikasikan. Misalnya, codebook NSFG mencakup tabel yang merangkum tiap variabel. Ini tabel untuk `outcome`, yang mengkodekan hasil tiap kehamilan:

| value | label | Total |
|---|---|---|
| 1 | LIVE BIRTH (kelahiran hidup) | 9148 |
| 2 | INDUCED ABORTION (aborsi induksi) | 1862 |
| 3 | STILLBIRTH (lahir mati) | 120 |
| 4 | MISCARRIAGE (keguguran) | 1921 |
| 5 | ECTOPIC PREGNANCY (kehamilan ektopik) | 190 |
| 6 | CURRENT PREGNANCY (sedang hamil) | 352 |

Kelas Series menyediakan method `value_counts`, yang menghitung berapa kali tiap nilai muncul. Kalau kita pilih Series `outcome` dari DataFrame, kita bisa pakai `value_counts` untuk membandingkannya dengan data yang dipublikasikan:

```python
>>> df.outcome.value_counts().sort_index()
1    9148
2    1862
3     120
4    1921
5     190
6     352
```

Hasil `value_counts` adalah sebuah Series; `sort_index()` mengurutkan Series berdasarkan indeksnya, sehingga nilainya tampil berurutan.

Membandingkan hasilnya dengan tabel yang dipublikasikan, kelihatannya nilai-nilai di `outcome` sudah benar. Begitu juga, ini tabel yang dipublikasikan untuk `birthwgt_lb`:

| value | label | Total |
|---|---|---|
| . | INAPPLICABLE (tidak berlaku) | 4449 |
| 0-5 | UNDER 6 POUNDS (di bawah 6 pon) | 1125 |
| 6 | 6 POUNDS | 2223 |
| 7 | 7 POUNDS | 3049 |
| 8 | 8 POUNDS | 1889 |
| 9-95 | 9 POUNDS OR MORE (9 pon atau lebih) | 799 |

Dan ini hasil `value_counts`-nya:

```python
>>> df.birthwgt_lb.value_counts(sort=False)
0     8
1    40
2    53
3    98
4    229
5    697
6    2223
7    3049
8    1889
9    623
10   132
11    26
12    10
13     3
14     3
15     1
51     1
```

Hitungan untuk 6, 7, dan 8 pon cocok, dan kalau kamu jumlahkan hitungan untuk 0–5 dan 9–95, cocok juga. Tapi kalau kamu lihat lebih teliti, kamu akan sadar ada satu nilai yang pasti error: bayi seberat 51 pon!

Untuk menangani error ini, aku menambahkan satu baris ke `CleanFemPreg`:

```python
df.loc[df.birthwgt_lb > 20, 'birthwgt_lb'] = np.nan
```

Pernyataan ini mengganti nilai-nilai yang tidak valid dengan `np.nan`. Atribut `loc` menyediakan beberapa cara untuk memilih baris dan kolom dari DataFrame. Di contoh ini, ekspresi pertama dalam kurung siku adalah pengindeks baris; ekspresi kedua memilih kolomnya.

Ekspresi `df.birthwgt_lb > 20` menghasilkan Series bertipe bool, di mana `True` menandakan kondisinya terpenuhi. Ketika Series boolean dipakai sebagai indeks, ia hanya memilih elemen yang memenuhi kondisi.

## 1.8 Interpretasi

Untuk bekerja dengan data secara efektif, kamu harus berpikir di dua level sekaligus: level statistik dan level konteks.

Sebagai contoh, mari kita lihat urutan hasil kehamilan untuk beberapa responden. Karena cara file data diorganisasi, kita harus memproses sedikit untuk mengumpulkan data kehamilan tiap responden. Ini fungsi yang melakukannya:

```python
def MakePregMap(df):
    d = defaultdict(list)
    for index, caseid in df.caseid.items():
        d[caseid].append(index)
    return d
```

> **Catatan penerjemah:** buku asli memakai `iteritems()`, method pandas era lama. Di pandas modern, pakai `items()` — perilakunya sama.

`df` adalah DataFrame berisi data kehamilan. Method `items` mengenumerasi indeks (nomor baris) dan `caseid` untuk tiap kehamilan.

`d` adalah dictionary yang memetakan tiap ID kasus ke list indeks. Kalau kamu belum familiar dengan `defaultdict`, ia ada di modul `collections` Python. Dengan `d`, kita bisa mencari seorang responden dan mendapatkan indeks kehamilan-kehamilannya.

Contoh ini mencari satu responden dan mencetak list hasil kehamilannya:

```python
>>> caseid = 10229
>>> preg_map = nsfg.MakePregMap(df)
>>> indices = preg_map[caseid]
>>> df.outcome[indices].values
array([4, 4, 4, 4, 4, 4, 1])
```

`indices` adalah list indeks kehamilan untuk responden 10229.

Memakai list ini sebagai indeks ke `df.outcome` memilih baris-baris yang ditunjuk dan menghasilkan sebuah Series. Alih-alih mencetak seluruh Series, aku memilih atribut `values`, yang merupakan array NumPy.

Kode outcome 1 berarti kelahiran hidup. Kode 4 berarti keguguran (*miscarriage*); yaitu kehamilan yang berakhir spontan, biasanya tanpa sebab medis yang diketahui.

Secara statistik, responden ini tidak luar biasa. Keguguran itu umum, dan ada responden lain yang melaporkan sebanyak atau lebih banyak.

Tapi kalau kita ingat konteksnya, data ini menceritakan kisah seorang perempuan yang hamil enam kali, dan setiap kali berakhir dengan keguguran. Kehamilan ketujuh — dan yang paling baru — berakhir dengan kelahiran hidup. Kalau kita merenungkan data ini dengan empati, wajar kalau kita tersentuh oleh kisah yang diceritakannya.

Setiap record di dataset NSFG mewakili seseorang yang menjawab banyak pertanyaan personal dan sulit dengan jujur. Kita bisa memakai data ini untuk menjawab pertanyaan statistik tentang kehidupan keluarga, reproduksi, dan kesehatan. Pada saat yang sama, kita punya kewajiban untuk mempertimbangkan orang-orang yang diwakili data ini, dan memperlakukan mereka dengan hormat dan rasa terima kasih.

## 1.9 Latihan

**Latihan 1.1** Di repo yang kamu unduh, harusnya ada file bernama `chap01ex.ipynb`, yaitu sebuah notebook IPython. Kamu bisa meluncurkan notebook IPython dari command line seperti ini:

```
$ ipython notebook &
```

> **Catatan penerjemah:** buku asli ditulis era IPython notebook (sekitar 2014). Sekarang namanya **Jupyter notebook** — jalankan dengan `$ jupyter notebook`. Isi latihannya sama.

Kalau IPython terinstal, ia akan meluncurkan server yang berjalan di background dan membuka browser untuk melihat notebook-nya. Kalau kamu belum familiar dengan IPython, aku sarankan mulai dari http://ipython.org/ipython-doc/stable/notebook/notebook.html.

Untuk meluncurkan server notebook, jalankan:

```
$ jupyter notebook
```

Harusnya ia membuka jendela browser baru, tapi kalau tidak, pesan startup-nya menyediakan URL yang bisa kamu buka di browser, biasanya `http://localhost:8888`. Jendela baru itu akan menampilkan daftar notebook di repo.

Buka `chap01ex.ipynb`. Beberapa cell sudah terisi, dan kamu harus mengeksekusinya. Cell lain berisi instruksi latihan yang harus kamu coba.

Solusi latihan ini ada di `chap01soln.ipynb`.

**Latihan 1.2** Di repo yang kamu unduh, harusnya ada file bernama `chap01ex.py`; pakai file ini sebagai titik awal, tulis fungsi yang membaca file responden, `2002FemResp.dat.gz`.

Variabel `pregnum` adalah recode yang menunjukkan berapa kali tiap responden pernah hamil. Cetak *value counts* untuk variabel ini dan bandingkan dengan hasil yang dipublikasikan di codebook NSFG.

Kamu juga bisa memvalidasi silang file responden dan file kehamilan dengan membandingkan `pregnum` tiap responden dengan jumlah record di file kehamilan.

Kamu bisa pakai `nsfg.MakePregMap` untuk membuat dictionary yang memetakan tiap `caseid` ke list indeks ke DataFrame kehamilan.

Solusi latihan ini ada di `chap01soln.py`.

**Latihan 1.3** Cara terbaik belajar statistik adalah mengerjakan proyek yang bikin kamu tertarik. Apakah ada pertanyaan seperti, "Apakah bayi pertama lahir telat," yang ingin kamu selidiki?

Pikirkan pertanyaan-pertanyaan yang menurutmu menarik secara personal, atau mitos yang beredar di masyarakat, atau topik kontroversial, atau pertanyaan yang punya konsekuensi politik, dan lihat apakah kamu bisa merumuskan pertanyaan yang cocok untuk penyelidikan statistik.

Cari data yang bisa membantumu menjawab pertanyaan itu. Pemerintah adalah sumber yang bagus karena data dari riset publik sering tersedia gratis. Tempat yang bagus untuk mulai: http://www.data.gov/ dan http://www.science.gov/, dan di Inggris, http://data.gov.uk/.

Dua dataset favoritku adalah General Social Survey di http://www3.norc.org/gss+website/, dan European Social Survey di http://www.europeansocialsurvey.org/.

Kalau kelihatannya pertanyaanmu sudah pernah dijawab orang, perhatikan baik-baik apakah jawabannya beneran beralasan. Mungkin ada cacat di data atau analisisnya yang bikin kesimpulannya tidak bisa diandalkan. Kalau begitu, kamu bisa melakukan analisis yang berbeda atas data yang sama, atau mencari sumber data yang lebih baik.

Kalau kamu menemukan paper yang membahas pertanyaanmu, harusnya kamu bisa mendapatkan data mentahnya. Banyak penulis menyediakan datanya di web, tapi untuk data sensitif kamu mungkin harus menulis ke penulisnya, menjelaskan rencanamu memakai data itu, atau menyetujui syarat penggunaan tertentu. Gigihlah!

::: tip 💡 Konteks Indonesia
Portal data terbuka versi Indonesia: **[data.go.id](https://data.go.id)** (Satu Data Indonesia) — isinya dataset dari kementerian/lembaga dan pemda, gratis diunduh. Untuk latihan 1.3, ini titik mulai yang paling realistis: misalnya data kemiskinan BPS per kabupaten, data stunting Riskesdas, atau data cuaca BMKG. Polanya sama seperti saran buku ini: rumuskan pertanyaan dulu, baru cari datanya — bukan sebaliknya.
:::

## 1.10 Glosarium

- *anecdotal evidence* (bukti anekdotal): Bukti, sering kali bersifat personal, yang dikumpulkan secara santai dan bukan lewat studi yang dirancang dengan baik.
- *population* (populasi): Kelompok yang ingin kita pelajari. "Populasi" sering merujuk ke sekelompok orang, tapi istilahnya juga dipakai untuk subjek lain.
- *cross-sectional study* (studi cross-sectional): Studi yang mengumpulkan data tentang sebuah populasi pada satu titik waktu tertentu.
- *cycle* (siklus): Dalam studi cross-sectional berulang, setiap pengulangan studi disebut siklus.
- *longitudinal study* (studi longitudinal): Studi yang mengikuti sebuah populasi dari waktu ke waktu, mengumpulkan data dari kelompok yang sama berulang kali.
- *record* (catatan/record): Dalam sebuah dataset, kumpulan informasi tentang satu orang atau subjek lain.
- *respondent* (responden): Orang yang merespons survei.
- *sample* (sampel): Subset dari populasi yang dipakai untuk mengumpulkan data.
- *representative* (representatif): Sebuah sampel disebut representatif kalau setiap anggota populasi punya peluang yang sama untuk masuk ke sampel.
- *oversampling*: Teknik meningkatkan representasi sebuah sub-populasi untuk menghindari error akibat ukuran sampel yang kecil.
- *raw data* (data mentah): Nilai-nilai yang dikumpulkan dan dicatat dengan sedikit atau tanpa pengecekan, perhitungan, atau interpretasi.
- *recode*: Nilai yang dihasilkan lewat perhitungan dan logika lain yang diterapkan ke data mentah.
- *data cleaning* (pembersihan data): Proses yang mencakup memvalidasi data, mengidentifikasi error, menerjemahkan antar tipe dan representasi data, dan sebagainya.

---

**Selanjutnya:** [Bab 2: Distribusi](/thinkstats-bab-02) *(segera hadir)*
