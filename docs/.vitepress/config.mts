import { defineConfig } from 'vitepress'

const nav = [
  { text: 'Beranda', link: '/' },
  { text: 'Mulai Belajar', link: '/bab-0-persiapan' },
  {
    text: 'Kurikulum',
    items: [
      { text: 'Bab 0: Persiapan', link: '/bab-0-persiapan' },
      {
        text: 'Bab 1: SQL',
        link: '/sql-select',
        items: [
          { text: '1.1 SELECT: Membaca Data', link: '/sql-select' },
          { text: '1.2 WHERE: Menyaring Baris', link: '/sql-where' },
          { text: '1.3 ORDER BY dan LIMIT', link: '/sql-order' },
          { text: '1.4 Urutan Eksekusi Query', link: '/sql-urutan' },
          { text: '1.5 Agregasi dan GROUP BY', link: '/sql-agregasi' },
          { text: '1.6 JOIN: Menggabungkan Tabel', link: '/sql-join' },
          { text: '1.7 Subquery dan CTE', link: '/sql-subquery' },
          { text: '1.8 Window Function', link: '/sql-window' },
          { text: '1.9 Studi Kasus', link: '/sql-studi-kasus' },
        ],
      },
      { text: 'Bab 2: Python', link: '/bab-2-python' },
      { text: 'Bab 3: Statistik', link: '/bab-3-statistik' },
      { text: 'Bab 4: Visualisasi', link: '/bab-4-visualisasi' },
      { text: 'Bab 5: Storytelling', link: '/bab-5-storytelling' },
      { text: 'Bab 6: Portfolio', link: '/bab-6-portfolio' },
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
  {
    text: 'Bab 1: SQL',
    collapsed: false,
    items: [
      { text: '1.1 SELECT: Membaca Data', link: '/sql-select' },
      { text: '1.2 WHERE: Menyaring Baris', link: '/sql-where' },
      { text: '1.3 ORDER BY dan LIMIT', link: '/sql-order' },
      { text: '1.4 Urutan Eksekusi Query', link: '/sql-urutan' },
      { text: '1.5 Agregasi dan GROUP BY', link: '/sql-agregasi' },
      { text: '1.6 JOIN: Menggabungkan Tabel', link: '/sql-join' },
      { text: '1.7 Subquery dan CTE', link: '/sql-subquery' },
      { text: '1.8 Window Function', link: '/sql-window' },
      { text: '1.9 Studi Kasus: Toko Online', link: '/sql-studi-kasus' },
    ],
  },
  {
    text: 'Naik Level',
    collapsed: true,
    items: [
      { text: 'Bab 2: Python', link: '/bab-2-python' },
      { text: 'Bab 3: Statistik', link: '/bab-3-statistik' },
      { text: 'Bab 4: Visualisasi', link: '/bab-4-visualisasi' },
      { text: 'Bab 5: Storytelling', link: '/bab-5-storytelling' },
      { text: 'Bab 6: Portfolio', link: '/bab-6-portfolio' },
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
    ['meta', { property: 'og:description', content: 'Belajar jadi analis data dari nol: SQL, Python, statistik, visualisasi, sampai portfolio. Gratis, tiap bab ada playground SQL interaktif di browser.' }],
    ['meta', { property: 'og:locale', content: 'id_ID' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Data dari Nol: Kurikulum Analis Data Berbahasa Indonesia' }],
    ['meta', { name: 'twitter:description', content: 'Belajar jadi analis data dari nol: SQL, Python, statistik, visualisasi, sampai portfolio. Gratis, tiap bab ada playground SQL interaktif di browser.' }],
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
