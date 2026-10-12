> **Terjemahan bebas** dari *Think Stats, 2nd Edition* karya **Allen B. Downey** ([CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/), buku asli gratis di [thinkstats2.com](https://thinkstats2.com)). Diterjemahkan dan diadaptasi ke konteks Indonesia untuk tujuan edukasi non-komersial.

# Bab 13: Analisis Survival

*Survival analysis* (analisis survival) adalah cara untuk menggambarkan seberapa lama sesuatu bertahan. Ia sering dipakai untuk mempelajari usia harapan hidup manusia, tapi juga berlaku untuk "kelangsungan hidup" komponen mekanik dan elektronik, atau lebih umum lagi untuk selang waktu sebelum sebuah peristiwa terjadi.

Kalau kamu punya kenalan yang didiagnosis penyakit yang mengancam jiwa, kamu mungkin pernah dengar istilah "tingkat ketahanan hidup 5 tahun" (*5-year survival rate*) — yaitu probabilitas seseorang bertahan hidup lima tahun setelah diagnosis. Estimasi semacam itu dan statistik terkait lainnya adalah hasil dari analisis survival.

Kode di bab ini ada di `survival.py`. Untuk info cara mengunduh dan menjalankan kode ini, lihat Bagian 0.2.

::: tip 💡 Konteks Indonesia
Analisis survival terdengar medis, tapi pemakaiannya luas banget. Contoh dekat keseharianmu: seberapa lama sebuah **lampu LED bertahan sebelum putus**, **ban motor sebelum gundul**, atau **pelanggan bertahan sebelum berhenti langganan** (*churn* — topik panas di perusahaan telko dan streaming). Di bab ini Downey memakai data kehamilan dan usia pernikahan dari survei Amerika (NSFG); di Indonesia, data semacam ini bisa kamu dapat dari Susenas atau Riskesdas — pola datanya mirip.
:::

## 13.1 Kurva survival

Konsep paling fundamental dalam analisis survival adalah *survival curve* (kurva survival), S(t), yaitu fungsi yang memetakan sebuah durasi, t, ke probabilitas bertahan hidup lebih lama dari t. Kalau kamu tahu distribusi durasi-durasinya (atau "masa hidup"-nya), menemukan kurva survival itu gampang: ia cuma komplemen dari CDF:

S(t) = 1 − CDF(t)

dengan CDF(t) adalah probabilitas sebuah masa hidup kurang dari atau sama dengan t.

*[Grafik 13.1: CDF dan kurva survival durasi kehamilan (atas), kurva hazard (bawah). Sumbu-x dalam minggu.]*

Contohnya, di dataset NSFG kita tahu durasi 11.189 kehamilan yang sudah selesai (*complete*). Kita bisa baca data ini dan menghitung CDF-nya:

```python
preg = nsfg.ReadFemPreg()
complete = preg.query('outcome in [1, 3, 4]').prglngth
cdf = thinkstats2.Cdf(complete, label='cdf')
```

Kode outcome 1, 3, 4 berarti kelahiran hidup (*live birth*), lahir mati (*stillbirth*), dan keguguran (*miscarriage*). Untuk analisis ini saya mengecualikan aborsi yang disengaja, kehamilan ektopik, dan kehamilan yang masih berjalan saat responden diwawancarai.

Method `query` di DataFrame menerima ekspresi boolean dan mengevaluasinya untuk tiap baris, lalu memilih baris-baris yang menghasilkan True.

Gambar 13.1 (atas) menunjukkan CDF durasi kehamilan dan komplemennya, yaitu kurva survival. Untuk merepresentasikan kurva survival, saya mendefinisikan sebuah objek yang membungkus Cdf dan menyesuaikan antarmukanya:

```python
class SurvivalFunction(object):
    def __init__(self, cdf, label=''):
        self.cdf = cdf
        self.label = label or cdf.label

    @property
    def ts(self):
        return self.cdf.xs

    @property
    def ss(self):
        return 1 - self.cdf.ps
```

SurvivalFunction menyediakan dua properti: `ts`, yaitu deretan masa hidup, dan `ss`, yaitu kurva survival. Di Python, "properti" adalah method yang bisa dipanggil seolah-olah ia variabel.

Kita bisa membuat instance SurvivalFunction dengan memberikan CDF dari masa hidup:

```python
sf = SurvivalFunction(cdf)
```

SurvivalFunction juga menyediakan `__getitem__` dan `Prob`, yang mengevaluasi kurva survival:

```python
# class SurvivalFunction

    def __getitem__(self, t):
        return self.Prob(t)

    def Prob(self, t):
        return 1 - self.cdf.Prob(t)
```

Misalnya, `sf[13]` adalah fraksi kehamilan yang berlanjut melewati trimester pertama:

```
>>> sf[13]
0.86022
>>> cdf[13]
0.13978
```

Sekitar 86% kehamilan berlanjut melewati trimester pertama; sekitar 14% tidak.

SurvivalFunction menyediakan `Render`, jadi kita bisa mem-plot `sf` memakai fungsi-fungsi di thinkplot:

```python
thinkplot.Plot(sf)
```

Gambar 13.1 (atas) menunjukkan hasilnya. Kurvanya nyaris datar antara minggu ke-13 dan ke-26, yang menunjukkan sedikit kehamilan yang berakhir di trimester kedua. Dan kurvanya paling curam sekitar minggu ke-39, yang memang durasi kehamilan paling umum.

## 13.2 Fungsi hazard

Dari kurva survival kita bisa menurunkan *hazard function* (fungsi hazard); untuk durasi kehamilan, fungsi hazard memetakan sebuah waktu, t, ke fraksi kehamilan yang berlanjut sampai t lalu berakhir tepat di t. Lebih tepatnya:

λ(t) = (S(t) − S(t + 1)) / S(t)

Pembilangnya adalah fraksi masa hidup yang berakhir di t, yang juga merupakan PMF(t).

SurvivalFunction menyediakan `MakeHazard`, yang menghitung fungsi hazard:

```python
# class SurvivalFunction

    def MakeHazard(self, label=''):
        ss = self.ss
        lams = {}
        for i, t in enumerate(self.ts[:-1]):
            hazard = (ss[i] - ss[i+1]) / ss[i]
            lams[t] = hazard
        return HazardFunction(lams, label=label)
```

Objek HazardFunction adalah pembungkus untuk pandas Series:

```python
class HazardFunction(object):
    def __init__(self, d, label=''):
        self.series = pandas.Series(d)
        self.label = label
```

`d` bisa berupa dictionary atau tipe lain yang bisa dipakai untuk menginisialisasi Series, termasuk Series lain. `label` adalah string untuk mengidentifikasi HazardFunction saat di-plot.

HazardFunction menyediakan `__getitem__`, jadi kita bisa mengevaluasinya seperti ini:

```
>>> hf = sf.MakeHazard()
>>> hf[39]
0.49689
```

Jadi dari semua kehamilan yang berlanjut sampai minggu ke-39, sekitar 50%-nya berakhir di minggu ke-39.

Gambar 13.1 (bawah) menunjukkan fungsi hazard untuk durasi kehamilan. Untuk waktu setelah minggu ke-42, fungsi hazard-nya tidak beraturan karena datanya cuma dari sedikit kasus. Selain itu bentuk kurvanya sesuai dugaan: paling tinggi sekitar minggu ke-39, dan sedikit lebih tinggi di trimester pertama dibanding trimester kedua.

Fungsi hazard berguna dengan sendirinya, tapi ia juga alat penting untuk mengestimasi kurva survival, seperti yang akan kita lihat di bagian berikutnya.

## 13.3 Menginferensi kurva survival

Kalau seseorang memberimu CDF dari masa hidup, menghitung fungsi survival dan hazard itu gampang. Tapi di banyak skenario dunia nyata, kita tidak bisa mengukur distribusi masa hidup secara langsung. Kita harus menginferensinya.

Misalnya, katakanlah kamu mengikuti sekelompok pasien untuk melihat berapa lama mereka bertahan setelah diagnosis. Tidak semua pasien didiagnosis di hari yang sama, jadi di titik waktu mana pun, sebagian pasien sudah bertahan lebih lama dari yang lain. Kalau sebagian pasien sudah meninggal, kita tahu waktu bertahan mereka. Untuk pasien yang masih hidup, kita tidak tahu waktu bertahan mereka, tapi kita punya batas bawahnya.

Kalau kita menunggu sampai semua pasien meninggal, kita bisa menghitung kurva survival-nya, tapi kalau kita sedang mengevaluasi efektivitas pengobatan baru, kita tidak bisa menunggu selama itu! Kita butuh cara untuk mengestimasi kurva survival memakai informasi yang tidak lengkap.

Sebagai contoh yang lebih ceria, saya akan memakai data NSFG untuk mengukur berapa lama responden "bertahan" sampai mereka menikah untuk pertama kalinya. Rentang usia responden adalah 14 sampai 44 tahun, jadi dataset ini memberi gambaran (*snapshot*) perempuan di berbagai tahap kehidupan.

Untuk perempuan yang sudah menikah, dataset ini memuat tanggal pernikahan pertama dan usia mereka saat itu. Untuk perempuan yang belum menikah, kita tahu usia mereka saat diwawancarai, tapi tidak tahu kapan atau apakah mereka akan menikah.

Karena kita tahu usia saat pertama menikah untuk sebagian perempuan, mungkin kamu tergoda untuk membuang sisanya dan menghitung CDF dari data yang diketahui saja. Itu ide yang buruk. Hasilnya akan menyesatkan ganda: (1) perempuan yang lebih tua akan terwakili berlebih (*overrepresented*), karena mereka lebih mungkin sudah menikah saat diwawancarai, dan (2) perempuan yang sudah menikah akan terwakili berlebih! Faktanya, analisis semacam ini akan menyimpulkan bahwa semua perempuan menikah, yang jelas-jelas salah.

## 13.4 Estimasi Kaplan-Meier

Di contoh ini, menyertakan observasi perempuan yang belum menikah bukan cuma diinginkan tapi memang perlu, dan itu membawa kita ke salah satu algoritma sentral dalam analisis survival, *Kaplan-Meier estimation* (estimasi Kaplan-Meier).

Ide umumnya adalah kita bisa memakai data untuk mengestimasi fungsi hazard, lalu mengubah fungsi hazard itu menjadi kurva survival. Untuk mengestimasi fungsi hazard, kita mempertimbangkan, untuk tiap usia, (1) jumlah perempuan yang menikah di usia itu dan (2) jumlah perempuan yang "berisiko" menikah, yang mencakup semua perempuan yang belum menikah di usia yang lebih muda.

Ini kodenya:

```python
def EstimateHazardFunction(complete, ongoing, label=''):
    hist_complete = Counter(complete)
    hist_ongoing = Counter(ongoing)
    ts = list(hist_complete | hist_ongoing)
    ts.sort()

    at_risk = len(complete) + len(ongoing)
    lams = pandas.Series(index=ts)
    for t in ts:
        ended = hist_complete[t]
        censored = hist_ongoing[t]
        lams[t] = ended / at_risk
        at_risk -= ended + censored
    return HazardFunction(lams, label=label)
```

`complete` adalah himpunan observasi lengkap; dalam kasus ini, usia saat responden menikah. `ongoing` adalah himpunan observasi yang tidak lengkap; yaitu, usia perempuan yang belum menikah saat mereka diwawancarai.

Pertama, kita pra-hitung `hist_complete`, yaitu Counter yang memetakan tiap usia ke jumlah perempuan yang menikah di usia itu, dan `hist_ongoing` yang memetakan tiap usia ke jumlah perempuan belum menikah yang diwawancarai di usia itu.

`ts` adalah gabungan (*union*) usia saat responden menikah dan usia saat perempuan belum menikah diwawancarai, diurutkan naik.

`at_risk` mencatat jumlah responden yang dianggap "berisiko" di tiap usia; awalnya, jumlah total responden.

Hasilnya disimpan dalam pandas Series yang memetakan tiap usia ke estimasi fungsi hazard di usia itu.

Setiap putaran loop, kita mempertimbangkan satu usia, t, dan menghitung jumlah peristiwa yang berakhir di t (yaitu, jumlah responden yang menikah di usia itu) dan jumlah peristiwa yang tersensor di t (yaitu, jumlah perempuan yang diwawancarai di t yang tanggal pernikahan masa depannya tersensor). Dalam konteks ini, "*censored*" (tersensor) berarti datanya tidak tersedia karena proses pengumpulan data.

Estimasi fungsi hazard adalah fraksi kasus berisiko yang berakhir di t.

Di akhir loop, kita mengurangi `at_risk` dengan jumlah kasus yang berakhir atau tersensor di t.

Terakhir, kita teruskan `lams` ke konstruktor HazardFunction dan kembalikan hasilnya.

::: tip 💡 Konteks Indonesia
Istilah "tersensor" kedengarannya aneh, tapi kamu pasti kenal situasinya. Contoh: toko elektronik yang menjual garansi — untuk barang yang masih dalam masa garansi dan belum rusak, kamu tidak tahu kapan barang itu akan rusak; kamu cuma tahu "sampai hari ini masih baik-baik saja". Data itulah yang tersensor (*right-censored*). Sama juga dengan pelanggan yang masih berlangganan: kamu tidak tahu kapan mereka berhenti, cuma tahu mereka masih aktif. Jadi kapan pun kamu menganalisis data yang "sebagiannya belum selesai kejadiannya", estimasi Kaplan-Meier ini yang kamu butuhkan.
:::

## 13.5 Kurva pernikahan

Untuk menguji fungsi ini, kita harus melakukan sedikit pembersihan dan transformasi data. Variabel NSFG yang kita butuhkan:

- `cmbirth`: tanggal lahir responden, diketahui untuk semua responden.
- `cmintvw`: tanggal responden diwawancarai, diketahui untuk semua responden.
- `cmmarrhx`: tanggal responden pertama kali menikah, kalau ada dan diketahui.
- `evrmarry`: 1 kalau responden sudah menikah sebelum tanggal wawancara, 0 kalau belum.

Tiga variabel pertama dikodekan dalam "*century-month*"; yaitu, jumlah bulan integer sejak Desember 1899. Jadi century-month 1 adalah Januari 1900.

Pertama, kita baca file responden dan ganti nilai tidak valid dari `cmmarrhx`:

```python
resp = chap01soln.ReadFemResp()
resp['cmmarrhx'] = resp.cmmarrhx.replace([9997, 9998, 9999], np.nan)
```

Lalu kita hitung usia tiap responden saat menikah dan usia saat diwawancarai:

```python
resp['agemarry'] = (resp.cmmarrhx - resp.cmbirth) / 12.0
resp['age'] = (resp.cmintvw - resp.cmbirth) / 12.0
```

Selanjutnya kita ekstrak `complete`, yaitu usia saat menikah untuk perempuan yang sudah menikah, dan `ongoing`, yaitu usia saat wawancara untuk perempuan yang belum:

```python
complete = resp[resp.evrmarry==1].agemarry
ongoing = resp[resp.evrmarry==0].age
```

Terakhir kita hitung fungsi hazardnya:

```python
hf = EstimateHazardFunction(complete, ongoing)
```

*[Grafik 13.2: fungsi hazard usia saat pertama menikah (atas) dan kurva survival (bawah). Sumbu-x dalam tahun.]*

Gambar 13.2 (atas) menunjukkan estimasi fungsi hazard; ia rendah di usia belasan, lebih tinggi di usia 20-an, dan menurun di usia 30-an. Ia naik lagi di usia 40-an, tapi itu artefak dari proses estimasi; seiring jumlah responden yang "berisiko" berkurang, sejumlah kecil perempuan yang menikah menghasilkan estimasi hazard yang besar. Kurva survival akan menghaluskan *noise* ini.

## 13.6 Mengestimasi kurva survival

Setelah kita punya fungsi hazard, kita bisa mengestimasi kurva survival. Peluang bertahan melewati waktu t adalah peluang bertahan di semua waktu sampai t, yaitu hasil kali kumulatif dari komplemen fungsi hazard:

[1 − λ(0)][1 − λ(1)] ... [1 − λ(t)]

Kelas HazardFunction menyediakan `MakeSurvival`, yang menghitung hasil kali ini:

```python
# class HazardFunction:

    def MakeSurvival(self):
        ts = self.series.index
        ss = (1 - self.series).cumprod()
        cdf = thinkstats2.Cdf(ts, 1-ss)
        sf = SurvivalFunction(cdf)
        return sf
```

`ts` adalah deretan waktu tempat fungsi hazard diestimasi. `ss` adalah hasil kali kumulatif dari komplemen fungsi hazard, jadi ia adalah kurva survival.

Karena cara SurvivalFunction diimplementasikan, kita harus menghitung komplemen dari `ss`, membuat Cdf, lalu membuat objek SurvivalFunction.

Gambar 13.2 (bawah) menunjukkan hasilnya. Kurva survival paling curam antara usia 25 dan 35, saat sebagian besar perempuan menikah. Antara usia 35 dan 45, kurvanya nyaris datar, yang menunjukkan perempuan yang belum menikah sebelum usia 35 kemungkinan besar tidak akan menikah.

Kurva seperti ini adalah dasar dari sebuah artikel majalah terkenal tahun 1986; Newsweek melaporkan bahwa perempuan 40 tahun yang belum menikah "lebih mungkin dibunuh teroris" daripada menikah. Statistik ini dilaporkan luas dan menjadi bagian dari budaya populer, tapi statistiknya salah saat itu (karena didasarkan pada analisis yang cacat) dan ternyata makin salah lagi (karena perubahan budaya yang sudah berjalan dan terus berlanjut). Pada 2006, Newsweek menerbitkan artikel lain yang mengakui kesalahan mereka.

Saya menganjurkanmu membaca lebih jauh tentang artikel ini, statistik yang mendasarinya, dan reaksinya. Ini seharusnya mengingatkanmu tentang kewajiban etis untuk melakukan analisis statistik dengan hati-hati, menafsirkan hasil dengan skeptisisme yang wajar, dan menyajikannya ke publik secara akurat dan jujur.

## 13.7 Interval kepercayaan

Analisis Kaplan-Meier menghasilkan satu estimasi kurva survival, tapi penting juga untuk mengukur ketidakpastian estimasinya. Seperti biasa, ada tiga kemungkinan sumber kesalahan: kesalahan pengukuran, kesalahan sampling, dan kesalahan pemodelan.

Dalam contoh ini, kesalahan pengukuran kemungkinan kecil. Orang umumnya tahu kapan mereka lahir, apakah mereka sudah menikah, dan kapan. Dan mereka bisa diharapkan melaporkan informasi ini dengan akurat.

Kita bisa mengukur kesalahan sampling dengan *resampling*. Ini kodenya:

```python
def ResampleSurvival(resp, iters=101):
    low, high = resp.agemarry.min(), resp.agemarry.max()
    ts = np.arange(low, high, 1/12.0)
    ss_seq = []
    for i in range(iters):
        sample = thinkstats2.ResampleRowsWeighted(resp)
        hf, sf = EstimateSurvival(sample)
        ss_seq.append(sf.Probs(ts))
    low, high = thinkstats2.PercentileRows(ss_seq, [5, 95])
    thinkplot.FillBetween(ts, low, high)
```

`ResampleSurvival` menerima `resp`, DataFrame responden, dan `iters`, jumlah pengulangan resampling. Ia menghitung `ts`, yaitu deretan usia tempat kita akan mengevaluasi kurva survival.

Di dalam loop, ResampleSurvival:

- Me-*resample* responden memakai ResampleRowsWeighted, yang kita lihat di Bagian 10.7.
- Memanggil EstimateSurvival, yang memakai proses di bagian-bagian sebelumnya untuk mengestimasi kurva hazard dan survival, dan
- Mengevaluasi kurva survival di tiap usia dalam `ts`.

`ss_seq` adalah deretan kurva survival hasil evaluasi. PercentileRows menerima deretan ini dan menghitung persentil ke-5 dan ke-95, menghasilkan interval kepercayaan 90% untuk kurva survival.

*[Grafik 13.3: kurva survival usia pertama menikah (garis gelap) dan interval kepercayaan 90% berdasarkan weighted resampling (garis abu-abu).]*

Gambar 13.3 menunjukkan hasilnya beserta kurva survival yang kita estimasi di bagian sebelumnya. Interval kepercayaannya memperhitungkan bobot sampling, tidak seperti kurva estimasi. Perbedaan di antara keduanya menunjukkan bobot sampling punya efek yang cukup besar pada estimasi — kita harus mengingat itu.

## 13.8 Efek kohort

Salah satu tantangan analisis survival adalah berbagai bagian kurva estimasi didasarkan pada kelompok responden yang berbeda. Bagian kurva di waktu t didasarkan pada responden yang usianya minimal t saat diwawancarai. Jadi bagian paling kiri kurva mencakup data dari semua responden, tapi bagian paling kanan cuma mencakup responden yang paling tua.

Kalau karakteristik relevan responden tidak berubah seiring waktu, itu tidak masalah, tapi dalam kasus ini kemungkinan besar pola pernikahan berbeda untuk perempuan yang lahir di generasi berbeda. Kita bisa menyelidiki efek ini dengan mengelompokkan responden berdasarkan dekade kelahiran mereka. Kelompok seperti ini, yang didefinisikan oleh tanggal lahir atau peristiwa serupa, disebut *cohort* (kohort), dan perbedaan antar kelompok disebut *cohort effects* (efek kohort).

Untuk menyelidiki efek kohort dalam data pernikahan NSFG, saya mengumpulkan data Siklus 6 dari 2002 yang dipakai di seluruh buku ini; data Siklus 7 dari 2006–2010 yang dipakai di Bagian 9.11; dan data Siklus 5 dari 1995. Total dataset ini mencakup 30.769 responden.

```python
resp5 = ReadFemResp1995()
resp6 = ReadFemResp2002()
resp7 = ReadFemResp2010()

resps = [resp5, resp6, resp7]
```

Untuk tiap DataFrame, `resp`, saya memakai `cmbirth` untuk menghitung dekade kelahiran tiap responden:

```python
month0 = pandas.to_datetime('1899-12-15')
dates = [month0 + pandas.DateOffset(months=cm)
         for cm in resp.cmbirth]
resp['decade'] = (pandas.DatetimeIndex(dates).year - 1900) // 10
```

`cmbirth` dikodekan sebagai jumlah bulan integer sejak Desember 1899; `month0` merepresentasikan tanggal itu sebagai objek Timestamp. Untuk tiap tanggal lahir, kita membuat DateOffset yang memuat century-month dan menambahkannya ke `month0`; hasilnya adalah deretan Timestamp, yang dikonversi menjadi DateTimeIndex. Terakhir, kita ekstrak tahunnya dan hitung dekadenya.

Untuk memperhitungkan bobot sampling, dan juga untuk menunjukkan variabilitas akibat kesalahan sampling, saya me-*resample* data, mengelompokkan responden berdasarkan dekade, dan mem-plot kurva survival:

```python
for i in range(iters):
    samples = [thinkstats2.ResampleRowsWeighted(resp)
               for resp in resps]
    sample = pandas.concat(samples, ignore_index=True)
    groups = sample.groupby('decade')
    EstimateSurvivalByDecade(groups, alpha=0.2)
```

Data dari tiga siklus NSFG memakai bobot sampling yang berbeda, jadi saya me-*resample* mereka terpisah lalu memakai `concat` untuk menggabungkannya jadi satu DataFrame. Parameter `ignore_index` menyuruh `concat` untuk tidak mencocokkan responden berdasarkan indeks; sebagai gantinya ia membuat indeks baru dari 0 sampai 30768.

EstimateSurvivalByDecade mem-plot kurva survival untuk tiap kohort:

```python
def EstimateSurvivalByDecade(resp):
    for name, group in groups:
        hf, sf = EstimateSurvival(group)
        thinkplot.Plot(sf)
```

*[Grafik 13.4: kurva survival responden yang lahir di dekade berbeda.]*

Gambar 13.4 menunjukkan hasilnya. Beberapa pola terlihat:

- Perempuan yang lahir di era 50-an menikah paling awal, dengan kohort-kohort berikutnya menikah semakin telat, setidaknya sampai sekitar usia 30.
- Perempuan yang lahir di era 60-an mengikuti pola yang mengejutkan. Sebelum usia 25, mereka menikah dengan laju lebih lambat dari pendahulunya. Setelah usia 25, mereka menikah lebih cepat. Di usia 32 mereka sudah menyalip kohort era 50-an, dan di usia 44 mereka jauh lebih mungkin sudah menikah.

Perempuan yang lahir di era 60-an menginjak usia 25 antara tahun 1985 dan 1995. Mengingat artikel Newsweek yang saya sebut tadi terbit tahun 1986, menggoda untuk membayangkan artikel itu memicu ledakan pernikahan. Penjelasan itu terlalu dibuat-buat, tapi bisa jadi artikel itu dan reaksi terhadapnya mencerminkan suasana hati (*mood*) yang memengaruhi perilaku kohort ini.

- Pola kohort era 70-an mirip. Mereka lebih kecil kemungkinannya menikah sebelum usia 25 dibanding pendahulunya, tapi di usia 35 mereka sudah mengejar kedua kohort sebelumnya.
- Perempuan yang lahir di era 80-an bahkan lebih kecil kemungkinannya menikah sebelum usia 25. Apa yang terjadi setelahnya belum jelas; untuk data lebih banyak, kita harus menunggu siklus NSFG berikutnya.

Sementara itu kita bisa membuat beberapa prediksi.

::: tip 💡 Konteks Indonesia
Fenomena "menikah makin telat" ini bukan cuma urusan Amerika. Data BPS menunjukkan rata-rata usia kawin pertama perempuan Indonesia terus naik — dari sekitar 20 tahun di era 1990-an menjadi 22+ tahun di 2020-an, dengan tren yang sama di kota-kota besar. Kalau kamu menganalisis data Susenas lintas generasi, kemungkinan besar kamu juga akan menemukan efek kohort: kurva survival "belum menikah" tiap generasi bergeser ke kanan. Jadi teknik di bab ini bisa langsung kamu pakai untuk pertanyaan yang dekat dengan keseharian Indonesia.
:::

## 13.9 Ekstrapolasi

Kurva survival untuk kohort era 70-an berakhir di sekitar usia 38; untuk kohort era 80-an berakhir di usia 28, dan untuk kohort era 90-an kita nyaris tidak punya data sama sekali.

Kita bisa mengekstrapolasi kurva-kurva ini dengan "meminjam" data dari kohort sebelumnya. HazardFunction menyediakan sebuah method, `Extend`, yang menyalin ekor dari HazardFunction lain yang lebih panjang:

```python
# class HazardFunction

    def Extend(self, other):
        last = self.series.index[-1]
        more = other.series[other.series.index > last]
        self.series = pandas.concat([self.series, more])
```

Seperti yang kita lihat di Bagian 13.2, HazardFunction berisi Series yang memetakan t ke λ(t). `Extend` mencari `last`, yaitu indeks terakhir di `self.series`, memilih nilai-nilai dari `other` yang datang setelah `last`, dan menambahkannya ke `self.series`.

Sekarang kita bisa memperpanjang HazardFunction untuk tiap kohort, memakai nilai-nilai dari pendahulunya:

```python
def PlotPredictionsByDecade(groups):
    hfs = []
    for name, group in groups:
        hf, sf = EstimateSurvival(group)
        hfs.append(hf)
    thinkplot.PrePlot(len(hfs))
    for i, hf in enumerate(hfs):
        if i > 0:
            hf.Extend(hfs[i-1])
        sf = hf.MakeSurvival()
        thinkplot.Plot(sf)
```

`groups` adalah objek GroupBy dengan responden dikelompokkan berdasarkan dekade kelahiran. Loop pertama menghitung HazardFunction untuk tiap kelompok.

Loop kedua memperpanjang tiap HazardFunction dengan nilai dari pendahulunya, yang mungkin memuat nilai dari kelompok sebelumnya, dan seterusnya. Lalu ia mengubah tiap HazardFunction menjadi SurvivalFunction dan mem-plot-nya.

*[Grafik 13.5: kurva survival responden yang lahir di dekade berbeda, dengan prediksi untuk kohort yang lebih muda.]*

Gambar 13.5 menunjukkan hasilnya; saya menghilangkan kohort era 50-an supaya prediksinya lebih terlihat. Hasil ini menunjukkan bahwa di usia 40, kohort-kohort terbaru akan menyatu dengan kohort era 60-an, dengan kurang dari 20% yang tidak pernah menikah.

## 13.10 Ekspektasi sisa masa hidup

Dengan kurva survival, kita bisa menghitung *expected remaining lifetime* (ekspektasi sisa masa hidup) sebagai fungsi dari usia saat ini. Misalnya, dengan kurva survival durasi kehamilan dari Bagian 13.1, kita bisa menghitung ekspektasi waktu sampai persalinan.

Langkah pertama adalah mengekstrak PMF dari masa hidup. SurvivalFunction menyediakan method yang melakukan itu:

```python
# class SurvivalFunction

    def MakePmf(self, filler=None):
        pmf = thinkstats2.Pmf()
        for val, prob in self.cdf.Items():
            pmf.Set(val, prob)
        cutoff = self.cdf.ps[-1]
        if filler is not None:
            pmf[filler] = 1-cutoff
        return pmf
```

Ingat bahwa SurvivalFunction berisi Cdf dari masa hidup. Loop-nya menyalin nilai-nilai dan probabilitas dari Cdf ke dalam Pmf.

`cutoff` adalah probabilitas tertinggi dalam Cdf, yaitu 1 kalau Cdf-nya lengkap, dan kurang dari 1 kalau tidak. Kalau Cdf-nya tidak lengkap, kita pasang nilai yang diberikan, `filler`, untuk menutupnya.

Cdf durasi kehamilan itu lengkap, jadi kita belum perlu khawatir soal detail ini.

Langkah berikutnya adalah menghitung ekspektasi sisa masa hidup, dengan "ekspektasi" artinya rata-rata. SurvivalFunction menyediakan method yang melakukannya juga:

```python
# class SurvivalFunction

    def RemainingLifetime(self, filler=None, func=thinkstats2.Pmf.Mean):
        pmf = self.MakePmf(filler=filler)
        d = {}
        for t in sorted(pmf.Values())[:-1]:
            pmf[t] = 0
            pmf.Normalize()
            d[t] = func(pmf) - t
        return pandas.Series(d)
```

RemainingLifetime menerima `filler`, yang diteruskan ke MakePmf, dan `func` yaitu fungsi yang dipakai untuk meringkas distribusi sisa masa hidup.

`pmf` adalah Pmf dari masa hidup yang diekstrak dari SurvivalFunction. `d` adalah dictionary yang memuat hasil, pemetaan dari usia saat ini, t, ke ekspektasi sisa masa hidup.

Loop-nya mengiterasi nilai-nilai dalam Pmf. Untuk tiap nilai t, ia menghitung distribusi kondisional dari masa hidup, dengan syarat masa hidup melebihi t. Caranya: menghapus nilai-nilai dari Pmf satu per satu lalu menormalisasi ulang nilai yang tersisa.

Lalu ia memakai `func` untuk meringkas distribusi kondisional. Dalam contoh ini hasilnya adalah rata-rata durasi kehamilan, dengan syarat durasinya melebihi t. Dengan mengurangi t, kita mendapatkan rata-rata sisa durasi kehamilan.

*[Grafik 13.6: ekspektasi sisa durasi kehamilan (kiri) dan sisa tahun sampai pertama menikah (kanan).]*

Gambar 13.6 (kiri) menunjukkan ekspektasi sisa durasi kehamilan sebagai fungsi dari durasi saat ini. Misalnya, selama Minggu ke-0, ekspektasi sisa durasinya sekitar 34 minggu. Itu kurang dari cukup bulan (*full term*, 39 minggu) karena terminasi kehamilan di trimester pertama menurunkan rata-ratanya.

Kurvanya turun perlahan selama trimester pertama. Setelah minggu ke-13, ekspektasi sisa masa hidup turun cuma 9 minggu, ke 25. Setelah itu kurvanya turun lebih cepat, sekitar seminggu per minggu.

Antara Minggu ke-37 dan 42, kurvanya mendatar di antara 1 dan 2 minggu. Di titik mana pun selama periode ini, ekspektasi sisa masa hidupnya sama; dengan tiap minggu yang berlalu, tujuannya tidak makin dekat. Proses dengan sifat ini disebut *memoryless* (tanpa memori) karena masa lalu tidak berpengaruh pada prediksi. Perilaku ini adalah dasar matematis dari mantra menyebalkan para perawat kandungan: "*any day now*."

Gambar 13.6 (kanan) menunjukkan median sisa waktu sampai pertama menikah, sebagai fungsi dari usia. Untuk anak perempuan berusia 11 tahun, median waktu sampai pertama menikah sekitar 14 tahun. Kurvanya menurun sampai usia 22 saat median sisa waktunya sekitar 7 tahun. Setelah itu naik lagi: di usia 30 ia kembali ke titik awal, 14 tahun.

Berdasarkan data ini, perempuan muda punya sisa "masa hidup" yang menurun. Komponen mekanis dengan sifat ini disebut NBUE, singkatan dari "*new better than used in expectation*" (baru lebih baik dari bekas dalam ekspektasi), artinya komponen baru diharapkan bertahan lebih lama.

Perempuan yang lebih tua dari 22 tahun punya sisa waktu sampai pertama menikah yang meningkat. Komponen dengan sifat ini disebut UBNE, singkatan dari "*used better than new in expectation*" (bekas lebih baik dari baru dalam ekspektasi). Artinya, semakin tua komponennya, semakin lama ia diharapkan bertahan.

Bayi yang baru lahir dan pasien kanker juga UBNE; harapan hidup mereka meningkat semakin lama mereka hidup.

Untuk contoh ini saya menghitung median, bukan mean, karena Cdf-nya tidak lengkap; kurva survival memproyeksikan sekitar 20% responden tidak akan menikah sebelum usia 44. Usia pertama menikah untuk perempuan-perempuan ini tidak diketahui, dan mungkin tidak ada, jadi kita tidak bisa menghitung mean.

Saya menangani nilai-nilai yang tidak diketahui ini dengan menggantinya dengan `np.inf`, nilai spesial yang merepresentasikan tak hingga. Itu membuat mean menjadi tak hingga untuk semua usia, tapi mediannya terdefinisi dengan baik selama lebih dari 50% sisa masa hidupnya berhingga, yang berlaku sampai usia 30. Setelah itu sulit mendefinisikan ekspektasi sisa masa hidup yang bermakna.

Ini kode yang menghitung dan mem-plot fungsi-fungsi ini:

```python
rem_life1 = sf1.RemainingLifetime()
thinkplot.Plot(rem_life1)
func = lambda pmf: pmf.Percentile(50)
rem_life2 = sf2.RemainingLifetime(filler=np.inf, func=func)
thinkplot.Plot(rem_life2)
```

`sf1` adalah kurva survival untuk durasi kehamilan; dalam kasus ini kita bisa memakai nilai default untuk RemainingLifetime.

`sf2` adalah kurva survival untuk usia pertama menikah; `func` adalah fungsi yang menerima Pmf dan menghitung mediannya (persentil ke-50).

## 13.11 Latihan

Solusi saya untuk latihan ini ada di `chap13soln.py`.

**Latihan 13.1** Dalam NSFG Siklus 6 dan 7, variabel `cmdivorcx` memuat tanggal perceraian untuk pernikahan pertama responden, kalau ada, dikodekan dalam century-month.

Hitung durasi pernikahan yang sudah berakhir dengan perceraian, dan durasi, sejauh ini, dari pernikahan yang masih berjalan. Estimasi hazard dan kurva survival untuk durasi pernikahan.

Gunakan resampling untuk memperhitungkan bobot sampling, dan plot data dari beberapa resample untuk memvisualisasikan kesalahan sampling.

Pertimbangkan untuk membagi responden ke dalam kelompok berdasarkan dekade kelahiran, dan mungkin juga berdasarkan usia saat pertama menikah.

## 13.12 Glosarium

- *survival analysis* (analisis survival): Sekumpulan metode untuk menggambarkan dan memprediksi masa hidup, atau lebih umum lagi waktu sampai sebuah peristiwa terjadi.
- *survival curve* (kurva survival): Fungsi yang memetakan sebuah waktu, t, ke probabilitas bertahan melewati t.
- *hazard function* (fungsi hazard): Fungsi yang memetakan t ke fraksi orang yang hidup sampai t yang meninggal di t.
- *Kaplan-Meier estimation* (estimasi Kaplan-Meier): Algoritma untuk mengestimasi fungsi hazard dan survival.
- *cohort* (kohort): sekelompok subjek yang didefinisikan oleh sebuah peristiwa, seperti tanggal lahir, dalam selang waktu tertentu.
- *cohort effect* (efek kohort): perbedaan antar kohort.
- NBUE: Sifat dari ekspektasi sisa masa hidup, "*new better than used in expectation*."
- UBNE: Sifat dari ekspektasi sisa masa hidup, "*used better than new in expectation*."

---

**Selanjutnya:** [Bab 14: Metode Analitik](/thinkstats-bab-14) *(segera hadir)*
