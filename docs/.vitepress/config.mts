import { defineConfig } from 'vitepress'

const bab1 = [
  { text: '1.1 SELECT: Membaca Data', link: '/sql-select' },
  { text: '1.2 WHERE: Menyaring Baris', link: '/sql-where' },
  { text: '1.3 ORDER BY dan LIMIT', link: '/sql-order' },
  { text: '1.4 Urutan Eksekusi Query', link: '/sql-urutan' },
  { text: '1.5 Fungsi Agregasi', link: '/sql-agregasi' },
  { text: '1.6 GROUP BY dan HAVING', link: '/sql-groupby' },
  { text: '1.7 INNER JOIN', link: '/sql-join-inner' },
  { text: '1.8 LEFT JOIN', link: '/sql-join-left' },
  { text: '1.9 RIGHT JOIN dan FULL JOIN', link: '/sql-join-right-full' },
  { text: '1.10 SELF JOIN', link: '/sql-join-self' },
  { text: '1.11 CROSS JOIN', link: '/sql-join-cross' },
  { text: '1.12 Subquery', link: '/sql-subquery' },
  { text: '1.13 CTE', link: '/sql-cte' },
  { text: '1.14 Window Function Dasar', link: '/sql-window' },
  { text: '1.15 LAG, LEAD, Agregat Window', link: '/sql-window-lag' },
  { text: '1.16 Studi Kasus: Toko Online', link: '/sql-studi-kasus' },
]

const bab2 = [
  { text: '2.1 CASE: Logika Kondisional', link: '/sql-lanjut-case' },
  { text: '2.2 UNION dan Operasi Himpunan', link: '/sql-lanjut-union' },
  { text: '2.3 Fungsi String', link: '/sql-lanjut-string' },
  { text: '2.4 Fungsi Tanggal', link: '/sql-tanggal' },
  { text: '2.5 Data Cleaning dengan SQL', link: '/sql-lanjut-cleaning' },
]

const bab3 = [
  { text: '3.1 Misteri Omzet yang Turun', link: '/studi-kasus-1-omzet' },
  { text: '3.2 Kenapa Karyawan Resign', link: '/studi-kasus-2-turnover' },
  { text: '3.3 Menu Apa yang Paling Cuan', link: '/studi-kasus-3-margin' },
  { text: '3.4 Kurir Mana yang Paling Sering Telat', link: '/studi-kasus-4-kurir' },
]

const nav = [
  { text: 'Beranda', link: '/' },
  { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
  {
    text: 'Kurikulum',
    items: [
      { text: 'Bab 0: Persiapan', link: '/bab-0-persiapan' },
      { text: 'Bab 1: SQL Dasar', link: '/sql-select', items: bab1 },
      { text: 'Bab 2: SQL Lanjutan', link: '/sql-lanjut-case', items: bab2 },
      { text: 'Bab 3: Studi Kasus Real', link: '/studi-kasus-1-omzet', items: bab3 },
      { text: 'Bab 4: Python', link: '/bab-4-python' },
      { text: 'Bab 5: Statistik', link: '/bab-5-statistik' },
      { text: 'Bab 6: Visualisasi', link: '/bab-6-visualisasi' },
      { text: 'Bab 7: Storytelling', link: '/bab-7-storytelling' },
      { text: 'Bab 8: Portfolio', link: '/bab-8-portfolio' },
    ],
  },
  { text: 'SQL Playground', link: '/playground' },
  { text: 'Dataset', link: '/dataset' },
  { text: 'Latihan', link: '/latihan' },
  { text: 'Roadmap', link: '/roadmap' },
]

const sidebar = [
  { text: 'Tentang Buku Ini', link: '/tentang' },
  {
    text: 'Fondasi',
    collapsed: false,
    items: [{ text: 'Bab 0: Persiapan', link: '/bab-0-persiapan' }],
  },
  { text: 'Bab 1: SQL Dasar', collapsed: false, items: bab1 },
  { text: 'Bab 2: SQL Lanjutan', collapsed: false, items: bab2 },
  { text: 'Bab 3: Studi Kasus Real', collapsed: false, items: bab3 },
  {
    text: 'Naik Level',
    collapsed: true,
    items: [
      { text: 'Bab 4: Python', link: '/bab-4-python' },
      { text: 'Bab 5: Statistik', link: '/bab-5-statistik' },
      { text: 'Bab 6: Visualisasi', link: '/bab-6-visualisasi' },
      { text: 'Bab 7: Storytelling', link: '/bab-7-storytelling' },
      { text: 'Bab 8: Portfolio', link: '/bab-8-portfolio' },
    ],
  },
  {
    text: 'Referensi',
    collapsed: true,
    items: [
      { text: 'SQL Playground', link: '/playground' },
      { text: 'Dataset Latihan', link: '/dataset' },
      { text: 'Bank Latihan', link: '/latihan' },
      { text: 'Roadmap', link: '/roadmap' },
    ],
  },
]

export default defineConfig({
  base: '/data-dari-nol/',
  lang: 'id-ID',
  title: 'Data dari Nol',
  description:
    'Kurikulum analis data berbahasa Indonesia, dari nol sampai siap portfolio. SQL, Python, statistik, visualisasi.',
  head: [
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Data dari Nol' }],
    ['meta', { property: 'og:title', content: 'Data dari Nol: Kurikulum Analis Data Berbahasa Indonesia' }],
    ['meta', { property: 'og:description', content: 'Belajar jadi analis data dari nol: SQL dasar (16 halaman), SQL lanjutan, studi kasus real, Python, statistik, visualisasi, sampai portfolio. Gratis, tiap halaman ada playground SQL interaktif di browser.' }],
    ['meta', { property: 'og:locale', content: 'id_ID' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Data dari Nol: Kurikulum Analis Data Berbahasa Indonesia' }],
    ['meta', { name: 'twitter:description', content: 'Belajar jadi analis data dari nol: SQL dasar (16 halaman), SQL lanjutan, studi kasus real, Python, statistik, visualisasi, sampai portfolio. Gratis, tiap halaman ada playground SQL interaktif di browser.' }],
  ],
  themeConfig: {
    nav,
    sidebar,
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: { buttonText: 'Cari', buttonAriaLabel: 'Cari' },
              modal: {
                noResultsText: 'Tidak ada hasil untuk',
                resetButtonTitle: 'Hapus pencarian',
                footer: { selectText: 'pilih', navigateText: 'navigasi', closeText: 'tutup' },
              },
            },
          },
        },
      },
    },
    outline: { label: 'Di halaman ini' },
    docFooter: { prev: '← Sebelumnya', next: 'Berikutnya →' },
    lastUpdated: { text: 'Terakhir diperbarui' },
    returnToTopLabel: 'Kembali ke atas',
    sidebarMenuLabel: 'Daftar isi',
    editLink: {
      pattern: 'https://github.com/iskandar221201/data-dari-nol/edit/main/docs/:path',
      text: 'Ubah halaman ini di GitHub',
    },
    footer: {
      message: 'Ditulis sambil belajar, dari nol, untuk yang mulai dari nol.',
      copyright: '© 2026 Asep Iskandar · Lisensi CC BY-SA 4.0',
    },
  },
})
