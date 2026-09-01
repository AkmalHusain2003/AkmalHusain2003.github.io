# Portofolio — Muhammad Akmal Husain

Portofolio pribadi dibangun dengan **HTML, CSS, dan JavaScript murni** (tanpa framework, tanpa build process, tanpa Jekyll). Filosofi desain layout diadaptasi dari tema [Forty](https://github.com/andrewbanchich/forty-jekyll-theme) oleh Andrew Banchich, namun seluruh implementasi ditulis ulang dari nol memakai Web API modern (`IntersectionObserver`, CSS custom properties native) — tidak ada dependency jQuery atau Sass build.

## Struktur Proyek

```
portfolio/
├── index.html                  Halaman utama (single-page: Hero, About, Projects,
│                                Experience, Volunteering, Awards, Contact)
├── pages/
│   └── project.html            Template GENERIK untuk halaman detail satu project.
│                                Kontennya di-render dinamis berdasar parameter URL
│                                ?id=<nama-project>, bukan file terpisah per project.
├── assets/
│   ├── css/
│   │   └── main.css            Seluruh styling situs, terorganisir per bagian
│   │                            (lihat komentar bernomor di dalamnya)
│   └── js/
│       ├── projects-data.js    SINGLE SOURCE OF TRUTH seluruh data project
│       ├── main.js             Logika index.html: menu, scroll, reveal, render grid
│       └── project-page.js     Logika pages/project.html: render detail dari data
└── README.md                   Berkas ini
```

## Cara Menjalankan Secara Lokal

Karena `project-page.js` membaca parameter URL dan memuat data lewat `<script>` tag (bukan `fetch` terhadap file terpisah), situs ini **tidak bisa** dibuka langsung dengan cara klik-dua-kali pada `index.html` di beberapa browser karena pembatasan `file://` protocol. Jalankan server lokal sederhana dari root folder:

```bash
python3 -m http.server 8080
```

Lalu buka `http://localhost:8080/index.html` di browser.

## Arsitektur Data Project (Penting untuk Diedit)

Semua informasi project — judul, deskripsi, tech stack, link repo, isi lengkap — disimpan **satu kali** di `assets/js/projects-data.js`, dalam array `PROJECTS`. Baik kartu preview di homepage maupun halaman detail (`pages/project.html?id=...`) membaca dari array yang sama ini.

**Untuk mengedit satu project yang sudah ada:** cari objek dengan `id` yang sesuai di `projects-data.js`, ubah field yang diperlukan. Perubahan otomatis muncul di kedua tempat (preview dan detail).

**Untuk menambah project baru:** duplikasi salah satu objek yang sudah ada di dalam array `PROJECTS`, ubah seluruh field-nya (terutama `id` — harus unik dan tanpa spasi, dipakai sebagai parameter URL), simpan file. Kartu baru otomatis muncul di grid homepage tanpa perlu menyentuh `index.html` maupun `pages/project.html`.

Field penting per project:

| Field | Keterangan |
|---|---|
| `id` | Unik, dipakai di URL (`?id=...`). Tanpa spasi. |
| `level` | Jenjang studi: `'msc'` (Magister) atau `'bsc'` (Sarjana). Menentukan project ini muncul di `pages/msc-projects.html` atau `pages/bsc-projects.html`. Lihat bagian "Halaman Arsip BSc/MSc" di bawah. |
| `featured` | `true` membuat kartu melebar 2 kolom di grid (dipakai untuk ENTRAP & GUMM). |
| `category` | Harus salah satu dari: `research`, `ml-tools`, `deep-learning` — nilai ini dicocokkan persis dengan tombol filter di `index.html`. Menambah kategori baru berarti juga menambah tombol `<button data-filter="kategori-baru">` di `index.html`. |
| `repoUrl` | Kosongkan (`null`) jika project bersifat proprietary/closed-source — tombol "Lihat Repository" otomatis tidak ditampilkan dan digantikan label "Kode Bersifat Proprietary". |
| `content` | String HTML (bukan Markdown) untuk isi halaman detail. Boleh memakai tag `<h2>`, `<p>`, `<ul>`, `<code>`, dsb. |
| `figures` | Array caption untuk plot/gambar hasil. **Lihat bagian "Mengganti Placeholder Gambar" di bawah.** |

## Halaman Arsip BSc/MSc & Panel "Other Projects"

Selain grid utama di homepage (yang menampilkan semua project apa pun jenjangnya), ada dua halaman arsip terpisah:

- `pages/msc-projects.html` — menampilkan seluruh project dengan `level: 'msc'`
- `pages/bsc-projects.html` — menampilkan seluruh project dengan `level: 'bsc'`

Kedua halaman ini dirender oleh **satu file JS yang sama**, `assets/js/education-projects.js`, yang membaca atribut `data-level` pada elemen grid di masing-masing HTML lalu memanggil `getProjectsByLevel(level)` dari `projects-data.js`. **Anda tidak perlu mengedit kedua file HTML tersebut** untuk menambah/mengurangi project yang tampil — cukup ubah field `level` pada objek project di `projects-data.js`, dan halaman arsip otomatis menyesuaikan.

Saat ini `pages/bsc-projects.html` akan menampilkan kotak "Belum Ada Entri" karena belum ada satu pun project dengan `level: 'bsc'` di `projects-data.js`. Untuk mengisinya: duplikasi salah satu objek project yang sudah ada (lihat panduan "Untuk menambah project baru" di atas), lalu ubah `level` menjadi `'bsc'`.

Kedua halaman ini diakses dari homepage lewat tombol **"Other Projects"** di filter bar section Projects — tombol ini membuka panel dropdown berisi dua tautan (BSc Project, MSc Project), ditangani oleh fungsi `initOtherProjectsToggle()` di `assets/js/main.js`. Tombol ini **sengaja terpisah** dari sistem filter kategori (`research`/`ml-tools`/`deep-learning`) yang sudah ada — ia tidak memfilter kartu apa pun di grid, murni membuka/menutup panel.

## Halaman Hero: Latar JWST (Belum Dipasang)

Diagram orbit SVG dan indikator scroll (panah memantul) yang sebelumnya ada di section hero (`#hero` pada `index.html`) sudah dihapus permanen atas permintaan. Untuk memasang foto JWST sebagai latar hero, lihat catatan lengkap langsung di `assets/css/main.css` (cari komentar berjudul "LATAR JWST") — instruksinya mencakup contoh kode `background` yang benar beserta penjelasan mengapa lapisan overlay gelap di atas foto perlu dipertahankan (supaya judul hero berwarna putih tetap terbaca jelas).

Judul, subjudul, dan kedua tombol call-to-action pada section hero saat ini sudah dalam **Bahasa Inggris** ("Turning large-scale astronomical data into precise insight", "Get Started", "View Projects") — perubahan dari versi Bahasa Indonesia sebelumnya, atas permintaan eksplisit. Bagian lain situs (menu navigasi, section About/Experience/Volunteering/Awards/Contact, dan seluruh konten `projects-data.js`) tetap Bahasa Indonesia. Jika Anda ingin section lain juga diganti ke Inggris, edit teksnya secara manual di `index.html` sesuai section yang dimaksud.

## Area yang Masih Berupa Placeholder (Perlu Diisi Manual)

Tiga area berikut sengaja dibiarkan sebagai placeholder eksplisit karena saya tidak memiliki data atau aset aslinya:

1. **Foto profil** — di section About (`index.html`, cari komentar `about__visual`), saat ini menampilkan kotak bertuliskan "Foto Profil (Ganti dengan Foto Asli)". Ganti `<div class="project-card__media-placeholder">...</div>` dengan `<img src="assets/images/foto-profil.jpg" alt="Muhammad Akmal Husain" />`.

2. **Plot hasil / figur project** — di `pages/project.html`, setiap figur saat ini menampilkan kotak placeholder abu-abu, bukan gambar asli (lihat fungsi `renderBody` di `project-page.js`, khususnya bagian `figure-item`). Untuk mengganti:
   - Letakkan file gambar di `assets/images/projects/` (folder sudah disiapkan)
   - Di `project-page.js`, cari baris:
     ```js
     <div class="project-card__media-placeholder" style="aspect-ratio: 16/10;">
       Placeholder Plot — Ganti dengan Gambar Asli
     </div>
     ```
     Ganti dengan:
     ```js
     <img src="../assets/images/projects/${fig.filename}" alt="${escapeHtml(fig.caption)}" />
     ```
     lalu tambahkan field `filename` pada setiap objek di array `figures` di `projects-data.js`.

3. **Award & Prestasi** — section ini (`index.html`, id `#awards`) berisi tiga kartu placeholder dengan tanda `⚠️` yang eksplisit menyatakan ini contoh, bukan data asli. Saya sengaja tidak mengisi ini dengan data karya-karangan karena tidak memiliki catatan prestasi spesifik Anda. Ganti `[Tahun]`, `[Nama Penghargaan / Prestasi]`, dan `[Deskripsi singkat...]` pada tiap `<div class="award-card">` dengan data sebenarnya, lalu hapus baris peringatan di `section__subtitle`.

## Form Kontak

Form di section Contact saat ini **belum terhubung ke layanan pengiriman email apa pun** — submit hanya menampilkan alert. Untuk mengaktifkannya, opsi termudah adalah [Formspree](https://formspree.io) (gratis untuk penggunaan dasar, sama seperti yang dipakai tema Forty asli) atau [Web3Forms](https://web3forms.com). Setelah mendaftar dan mendapat endpoint, ubah atribut pada tag `<form>` di `index.html`:

```html
<form class="contact-form" action="https://formspree.io/f/xxxxxxx" method="POST">
```

dan hapus atribut `onsubmit="event.preventDefault(); alert(...)"` yang saat ini menahan submit form.

## Palet Warna & Tipografi

Seluruh nilai desain (warna, ukuran font, spacing, durasi animasi) terpusat sebagai CSS custom properties di `:root` pada baris-baris awal `assets/css/main.css`. Mengubah karakter visual situs secara global cukup dengan mengubah nilai di sana — tidak perlu mencari-cari nilai hardcoded di tempat lain.

- **Body**: Source Sans 3 (Google Fonts)
- **Monospace/data**: JetBrains Mono (Google Fonts) — dipilih karena benar-benar dipakai di lingkungan kerja computational science, bukan sekadar estetika.

## Mekanisme Animasi "Hilang Timbul"

Efek fade-in/fade-out berulang pada section (bukan animasi satu-kali) diimplementasikan lewat `IntersectionObserver` di `main.js` (fungsi `initRevealObserver`). Elemen berkelas `.reveal` akan mendapat kelas `.is-visible` setiap kali masuk viewport DAN kehilangan kelas tersebut setiap kali keluar viewport — sehingga animasi terulang setiap kali discroll melewatinya, baik ke bawah maupun ke atas. Detail lengkap mekanismenya didokumentasikan sebagai komentar langsung di atas fungsi tersebut.

## Kompatibilitas Browser

Situs ini memakai `IntersectionObserver`, CSS custom properties, `clamp()`, dan `aspect-ratio` — seluruhnya adalah fitur standar di semua browser modern (Chrome, Firefox, Safari, Edge versi 2020 ke atas). Tidak ada polyfill yang disertakan untuk browser lama (Internet Explorer tidak didukung).
