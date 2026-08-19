/**
 * main.js
 * ----------------------------------------------------------------------
 * Logika interaktif untuk index.html. File ini TIDAK bergantung pada
 * jQuery atau library eksternal apa pun — seluruh mekanisme memakai Web
 * API native (IntersectionObserver, classList, dsb).
 *
 * Struktur file (dieksekusi berurutan setelah DOMContentLoaded):
 *   1. initMenuOverlay()      → buka/tutup panel menu
 *   2. initHeaderScroll()     → header berubah solid saat scroll lewat hero
 *   3. initRevealObserver()   → efek fade "hilang timbul" per section
 *   4. renderProjectPreview() → mengisi grid project di homepage dari
 *                                projects-data.js (menghindari duplikasi
 *                                data — lihat dokumentasi di
 *                                projects-data.js)
 *   5. initProjectFilter()    → filter kategori pada grid project
 *   6. initSmoothAnchors()    → navigasi halus ke id section
 * ----------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  initMenuOverlay();
  initHeaderScroll();
  initRevealObserver();
  renderProjectPreview();
  initProjectFilter();
  initSmoothAnchors();
});

/**
 * 1. MENU OVERLAY
 * ------------------------------------------------------------------
 * Mekanisme: kelas `.menu-open` ditambahkan ke <body>. CSS (lihat
 * main.css bagian "MENU OVERLAY") menangani seluruh transisi visual
 * berdasarkan kehadiran kelas ini — JS di sini murni bertanggung jawab
 * atas TOGGLE STATE, bukan animasi itu sendiri. Pemisahan tanggung
 * jawab ini (JS = state, CSS = presentasi) membuat animasi lebih mudah
 * di-tuning tanpa menyentuh logika JS.
 *
 * Penguncian scroll body (`overflow: hidden` via kelas yang sama)
 * mencegah halaman di belakang overlay ikut ter-scroll saat menu
 * terbuka — masalah umum pada implementasi modal/overlay yang naif.
 */
function initMenuOverlay() {
  const body = document.body;
  const trigger = document.querySelector('[data-menu-trigger]');
  const closeBtn = document.querySelector('[data-menu-close]');
  const overlay = document.querySelector('[data-menu-overlay]');
  const overlayLinks = document.querySelectorAll('[data-menu-overlay] a');

  if (!trigger || !overlay) return;

  const openMenu = () => body.classList.add('menu-open');
  const closeMenu = () => body.classList.remove('menu-open');

  trigger.addEventListener('click', openMenu);

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  // Klik pada backdrop (area overlay di luar panel konten) menutup menu.
  // event.target === overlay memastikan hanya klik LANGSUNG pada backdrop
  // yang memicu ini, bukan klik pada elemen anak di dalamnya (event
  // bubbling akan membuat event.target menjadi elemen anak tersebut,
  // bukan overlay itu sendiri).
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeMenu();
  });

  // Setiap tautan navigasi di dalam menu otomatis menutup menu saat
  // diklik, supaya pengguna tidak perlu menutup manual sebelum pindah
  // section.
  overlayLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Tombol Escape menutup menu — pola aksesibilitas standar untuk
  // elemen modal/overlay.
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && body.classList.contains('menu-open')) {
      closeMenu();
    }
  });
}

/**
 * 2. HEADER SCROLL STATE
 * ------------------------------------------------------------------
 * Header berubah dari transparan menjadi solid+blur ketika pengguna
 * scroll melewati section hero. Pendekatan ini SENGAJA memakai
 * IntersectionObserver mengamati elemen #hero, BUKAN listener 'scroll'
 * yang membaca window.scrollY secara manual.
 *
 * Alasan teknis: listener 'scroll' konvensional berjalan di main thread
 * pada SETIAP event scroll (bisa puluhan kali per detik), memaksa
 * pembacaan properti layout (scrollY) yang berpotensi memicu reflow
 * paksa (forced synchronous layout) jika bercampur dengan operasi DOM
 * lain di frame yang sama. IntersectionObserver, sebaliknya, berjalan
 * secara asinkron di luar critical rendering path dan hanya memicu
 * callback saat status interseksi benar-benar berubah — jauh lebih
 * hemat komputasi untuk kasus penggunaan ini.
 */
function initHeaderScroll() {
  const header = document.querySelector('[data-site-header]');
  const hero = document.querySelector('#hero');

  if (!header || !hero) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      // Header menjadi solid ketika hero TIDAK LAGI berpotongan dengan
      // viewport bagian atas (yakni, pengguna sudah scroll melewatinya).
      header.classList.toggle('is-solid', !entry.isIntersecting);
    },
    {
      // rootMargin negatif di bagian atas berarti "hero dianggap keluar
      // dari viewport" begitu bagian atasnya melewati batas setinggi
      // tinggi header itu sendiri — sehingga transisi warna terjadi
      // TEPAT saat konten hero mulai tertutup header, bukan lebih awal
      // atau lebih lambat.
      rootMargin: '-72px 0px 0px 0px',
      threshold: 0
    }
  );

  observer.observe(hero);
}

/**
 * 3. REVEAL OBSERVER ("HILANG TIMBUL")
 * ------------------------------------------------------------------
 * Ini adalah implementasi inti dari permintaan "transisi seperti hilang
 * timbul" pada section About dan section-section lain yang diberi
 * kelas `.reveal`.
 *
 * PERBEDAAN KRUSIAL dari pola reveal-on-scroll pada umumnya: kebanyakan
 * implementasi HANYA menambahkan kelas saat elemen masuk viewport lalu
 * berhenti mengamati (unobserve) elemen tersebut — menghasilkan animasi
 * satu-kali yang tidak akan terulang jika pengguna scroll naik-turun.
 *
 * Di sini, elemen SENGAJA TIDAK di-unobserve setelah muncul. Sebaliknya,
 * kelas `.is-visible` ditambah ATAU dilepas tergantung status
 * `entry.isIntersecting` pada setiap perubahan. Inilah yang menghasilkan
 * efek "hilang timbul" yang sesungguhnya: elemen memudar masuk saat
 * discroll ke arahnya, dan memudar keluar lagi saat discroll menjauh
 * (baik ke atas maupun ke bawah), berulang setiap kali.
 */
function initRevealObserver() {
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    {
      // threshold 0.15 berarti elemen dianggap "terlihat" begitu 15%
      // areanya masuk viewport — cukup awal agar animasi terasa
      // responsif terhadap scroll, tapi tidak sedini 0% yang akan
      // memicu animasi bahkan untuk elemen yang baru menyentuh tepi
      // layar sedikit sekali.
      threshold: 0.15
    }
  );

  revealEls.forEach((el) => observer.observe(el));

  // Delay berjenjang: elemen dengan atribut data-reveal-index diberi
  // custom property --reveal-delay yang dibaca oleh CSS (lihat aturan
  // .reveal[data-delay] di main.css), menghasilkan efek "beruntun"
  // pada grid kartu tanpa perlu IntersectionObserver terpisah per kartu.
  document.querySelectorAll('[data-reveal-index]').forEach((el) => {
    const index = parseInt(el.getAttribute('data-reveal-index'), 10) || 0;
    el.style.setProperty('--reveal-delay', `${Math.min(index * 0.08, 0.4)}s`);
    el.setAttribute('data-delay', '');
  });
}

/**
 * 4. RENDER PROJECT PREVIEW (dari projects-data.js)
 * ------------------------------------------------------------------
 * Homepage menampilkan grid project sebagai PREVIEW (ringkas), bukan
 * konten lengkap. Data diambil dari array global PROJECTS yang
 * didefinisikan di assets/js/projects-data.js (dimuat sebelum file ini
 * di index.html), sehingga tidak ada duplikasi teks deskripsi antara
 * homepage dan halaman detail.
 *
 * Kartu berkategori `featured: true` (ENTRAP, GUMM) dirender dengan
 * kelas tambahan `project-card--featured` yang membuatnya melebar dua
 * kolom pada CSS grid, menonjolkan kedua project utama secara visual.
 * CATATAN: `featured` HANYA memengaruhi lebar kartu, TIDAK sama dengan
 * `tier` di bawah — lihat CATATAN ARSITEKTUR di header projects-data.js.
 *
 * DUA GRID TERPISAH (Main Project / Other Project): PROJECTS dipilah
 * berdasar field `tier` ('main' | 'other') MENJADI DUA ARRAY sebelum
 * di-map ke HTML, masing-masing dirender ke wadahnya sendiri
 * ([data-project-grid="main"] dan [data-project-grid="other"]).
 * Logika pembuatan 1 kartu diekstrak ke buildProjectCardHtml() agar
 * tidak terduplikasi antara kedua grid.
 *
 * INDEX REVEAL DISENGAJA RESET PER GRUP (bukan global 0–5): setiap
 * grup memanggil .map((project, index) => ...) pada ARRAY HASIL
 * FILTER-nya sendiri, sehingga index dimulai dari 0 lagi di grid
 * Other Project — pola yang identik dengan Experience/Volunteering/
 * Publications yang me-reset data-reveal-index per section (lihat
 * initRevealObserver() di atas: index HANYA untuk delay animasi
 * staggered lokal, bukan identifier unik lintas dokumen).
 */
function buildProjectCardHtml(project, index) {
  const featuredClass = project.featured ? ' project-card--featured' : '';
  const techHtml = project.tech
    .slice(0, project.featured ? 6 : 4)
    .map((t) => `<span>${escapeHtml(t)}</span>`)
    .join('');

  const repoLinkHtml = project.repoUrl
    ? `<a href="${escapeHtml(project.repoUrl)}" class="project-card__repo" target="_blank" rel="noopener noreferrer" aria-label="View ${escapeHtml(project.title)} repository on GitHub">
         <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
       </a>`
    : '';

  return `
    <article class="project-card${featuredClass} reveal reveal--up" data-reveal-index="${index}" data-category="${escapeHtml(project.category)}">
      <div class="project-card__media">
        <div class="project-card__media-placeholder">${escapeHtml(project.category.replace('-', ' '))}</div>
      </div>
      <div class="project-card__body">
        <span class="project-card__tag">${escapeHtml(project.tag)}</span>
        <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
        <p class="project-card__desc">${escapeHtml(project.shortDesc)}</p>
        <div class="project-card__tech">${techHtml}</div>
        <div class="project-card__footer">
          <a href="pages/project.html?id=${encodeURIComponent(project.id)}" class="project-card__link">
            View Full Details
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
          ${repoLinkHtml}
        </div>
      </div>
    </article>
  `;
}

function renderProjectPreview() {
  const mainGrid = document.querySelector('[data-project-grid="main"]');
  const otherGrid = document.querySelector('[data-project-grid="other"]');

  if ((!mainGrid && !otherGrid) || typeof PROJECTS === 'undefined') return;

  // Observer BARU (bukan reuse initRevealObserver) untuk alasan yang
  // sama seperti sebelumnya: elemen disuntikkan setelah
  // initRevealObserver() awal sudah berjalan, sehingga observer lama
  // tidak melihatnya. SATU observer dibagi untuk kedua grid (bukan
  // dua observer terpisah) karena keduanya memakai kriteria identik
  // (threshold 0.15) — cukup satu instance yang mengamati elemen dari
  // kedua wadah sekaligus.
  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.15 }
  );

  if (mainGrid) {
    const mainProjects = PROJECTS.filter((project) => project.tier === 'main');
    mainGrid.innerHTML = mainProjects
      .map((project, index) => buildProjectCardHtml(project, index))
      .join('');
    mainGrid.querySelectorAll('.reveal').forEach((el) => cardObserver.observe(el));
  }

  if (otherGrid) {
    const otherProjects = PROJECTS.filter((project) => project.tier === 'other');
    otherGrid.innerHTML = otherProjects
      .map((project, index) => buildProjectCardHtml(project, index))
      .join('');
    otherGrid.querySelectorAll('.reveal').forEach((el) => cardObserver.observe(el));
  }
}

/**
 * 5. FILTER PROJECT BERDASAR KATEGORI
 * ------------------------------------------------------------------
 * Filter murni memanipulasi properti `display` kartu yang sudah
 * dirender (tidak melakukan render ulang dari data) — pendekatan lebih
 * murah secara komputasi untuk toggle sederhana seperti ini.
 *
 * BEKERJA DI KEDUA GRID (Main Project & Other Project) SEKALIGUS:
 * selector `[data-project-grid]` TANPA nilai spesifik mencocokkan
 * atribut apapun nilainya (baik ="main" maupun ="other"), tapi HARUS
 * memakai querySelectorAll (bukan querySelector tunggal) — jika hanya
 * querySelector, hanya kecocokan PERTAMA di DOM yang tertangkap
 * (yaitu grid Main saja), membuat filter tidak berfungsi sama sekali
 * di grid Other. Satu tombol filter mengontrol category yang sama
 * persis di kedua grid, karena field `category` (research/ml-tools/
 * deep-learning) independen dari `tier` (main/other) — sebuah project
 * bisa tier:'other' sekaligus category apapun.
 */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('[data-filter]');
  const grids = document.querySelectorAll('[data-project-grid]');

  if (filterBtns.length === 0 || grids.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.getAttribute('data-filter');

      filterBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      grids.forEach((grid) => {
        grid.querySelectorAll('.project-card').forEach((card) => {
          const matches = category === 'all' || card.getAttribute('data-category') === category;
          card.style.display = matches ? '' : 'none';
        });
      });
    });
  });
}

/**
 * 6. SMOOTH SCROLL UNTUK ANCHOR LINK
 * ------------------------------------------------------------------
 * `scroll-behavior: smooth` sudah didefinisikan secara global di CSS
 * (html { scroll-behavior: smooth }), sehingga secara teknis tautan
 * anchor biasa (<a href="#about">) SUDAH otomatis smooth-scroll tanpa
 * JS tambahan. Fungsi ini HANYA menangani satu detail tambahan: offset
 * kompensasi tinggi header fixed, supaya bagian atas section yang
 * dituju tidak tertutup header saat discroll ke sana.
 */
function initSmoothAnchors() {
  const header = document.querySelector('[data-site-header]');
  const headerHeight = header ? header.offsetHeight : 0;

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (!target) return;

      event.preventDefault();

      const targetPosition =
        target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;

      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    });
  });
}

/**
 * UTILITAS: escapeHtml
 * ------------------------------------------------------------------
 * Mencegah injeksi HTML tak-disengaja ketika merender data teks
 * (judul, deskripsi, dsb) dari projects-data.js ke dalam innerHTML.
 * Meski data di projects-data.js sepenuhnya dikontrol oleh pemilik
 * situs (bukan input pengguna), praktik ini tetap dijaga sebagai
 * kebiasaan yang benar secara prinsip, dan melindungi dari kesalahan
 * tak-sengaja seperti karakter '<' atau '&' dalam teks deskripsi yang
 * bisa merusak struktur HTML jika tidak di-escape.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
