/**
 * project-page.js
 * ----------------------------------------------------------------------
 * Logika untuk pages/project.html — merender konten detail SATU project
 * berdasarkan parameter query string `?id=` pada URL, membaca data dari
 * array global PROJECTS (didefinisikan di assets/js/projects-data.js,
 * yang harus dimuat SEBELUM file ini di HTML).
 *
 * Pendekatan ini disebut "client-side templating dengan parameter URL":
 * satu file HTML statis (project.html) berfungsi sebagai TEMPLATE
 * generik untuk kartu project apa pun, bukan file HTML terpisah per
 * project. Navigasi seperti `pages/project.html?id=entrap` dan
 * `pages/project.html?id=gumm` menggunakan file fisik yang SAMA, hanya
 * berbeda parameter, dan JavaScript inilah yang bertanggung jawab
 * mengisi kontennya secara dinamis.
 * ----------------------------------------------------------------------
 */

/**
 * CATATAN PENTING mengenai urutan eksekusi:
 * main.js SUDAH mendaftarkan listener DOMContentLoaded-nya sendiri yang
 * otomatis memanggil initMenuOverlay() dan initHeaderScroll() (lihat
 * baris atas main.js). Karena project.html memuat main.js SEBELUM file
 * ini, kedua fungsi tersebut SUDAH berjalan secara otomatis begitu DOM
 * siap — TIDAK PERLU dipanggil ulang secara manual di sini.
 *
 * Memanggilnya lagi di sini akan mendaftarkan event listener duplikat
 * pada elemen menu yang sama (addEventListener dipanggil dua kali pada
 * elemen yang sama), menyebabkan setiap klik pada tombol menu memicu
 * toggle DUA KALI — yang secara neto membatalkan diri sendiri (menu
 * yang seharusnya terbuka akan langsung tertutup lagi pada frame yang
 * sama). Maka initMenuOverlay() SENGAJA TIDAK dipanggil di file ini.
 *
 * renderProjectPreview() dan initProjectFilter() dari main.js juga
 * otomatis berjalan, namun keduanya aman untuk halaman ini karena
 * masing-masing mencari elemen [data-project-grid] dan [data-filter]
 * yang tidak ada di project.html — fungsi tersebut langsung return
 * lebih awal (early return) saat elemen target tidak ditemukan (lihat
 * baris "if (!grid || ...) return;" pada masing-masing fungsi).
 */
document.addEventListener('DOMContentLoaded', () => {
  const projectId = getProjectIdFromUrl();
  const project = typeof getProjectById === 'function' ? getProjectById(projectId) : null;

  if (!project) {
    renderNotFound();
    return;
  }

  renderProjectDetail(project);
  initRevealObserverForDetail();
});

/**
 * Membaca parameter `id` dari query string URL.
 * Contoh: pages/project.html?id=entrap → mengembalikan "entrap"
 */
function getProjectIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

/**
 * Merender pesan "project tidak ditemukan" apabila parameter id tidak
 * valid atau tidak ada project yang cocok di PROJECTS — mencegah
 * halaman kosong tanpa penjelasan jika seseorang mengakses URL dengan
 * id yang salah ketik atau sudah tidak ada.
 */
function renderNotFound() {
  const main = document.querySelector('[data-project-root]');
  if (!main) return;

  main.innerHTML = `
    <div class="container" style="padding-top: 10rem; padding-bottom: 6rem; text-align: center;">
      <p class="section__eyebrow">404</p>
      <h1 class="section__title">Project Not Found</h1>
      <p class="section__subtitle" style="margin-bottom: 2rem;">
        The project with that ID is not available. Please return to the homepage to browse the full project list.
      </p>
      <a href="../index.html#projects" class="btn btn--primary">Back to Project List</a>
    </div>
  `;
}

/**
 * Merender seluruh konten halaman detail: header (judul, tag, meta,
 * tombol aksi), body (prose HTML + grid figur), dan sidebar (info
 * teknis + related projects).
 */
function renderProjectDetail(project) {
  document.title = `${project.title} — Muhammad Akmal Husain`;

  renderHeader(project);
  renderBody(project);
  renderSidebar(project);
  renderRelated(project);
}

function renderHeader(project) {
  const headerEl = document.querySelector('[data-project-header]');
  if (!headerEl) return;

  const metaHtml = project.stats
    .map(
      (stat) => `
        <div class="project-card__tag" style="background: rgba(123,241,255,0.08);">
          ${escapeHtml(stat.label)}: <strong style="color: var(--color-highlight); margin-left: 0.3em;">${escapeHtml(stat.value)}</strong>
        </div>`
    )
    .join('');

  const tagHtml = renderProjectTags(project.tag);

  // Tombol repository HANYA dirender jika repoUrl tersedia. Untuk
  // project proprietary (mis. ENTRAP), tombol ini digantikan dengan
  // label status agar tidak menyiratkan ketersediaan kode yang
  // sebenarnya tidak dipublikasikan — menjaga akurasi representasi
  // status project sesuai data yang tercatat.
  const actionsHtml = project.repoUrl
    ? `<a href="${escapeHtml(project.repoUrl)}" class="btn btn--primary" target="_blank" rel="noopener noreferrer">
         <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
         View Repository
       </a>`
    : `<span class="btn btn--ghost" style="cursor: default;">Code Is Proprietary</span>`;

  const licenseNoteHtml = project.licenseNote
    ? `<p style="font-size: 0.82rem; color: var(--color-fg-muted); margin-top: 1rem; max-width: 38rem;">${escapeHtml(project.licenseNote)}</p>`
    : '';

  headerEl.innerHTML = `
    <div class="container">
      <a href="../index.html#projects" class="back-link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to All Projects
      </a>
      <div class="project-detail-header__tags">${tagHtml}</div>
      <h1 class="project-detail-header__title">${escapeHtml(project.titleFull)}</h1>
      <p class="project-detail-header__subtitle">${escapeHtml(project.subtitle)}</p>
      <div class="project-detail-header__meta">${metaHtml}</div>
      <div class="project-detail-header__actions">${actionsHtml}</div>
      ${licenseNoteHtml}
    </div>
  `;
}

function renderBody(project) {
  const bodyEl = document.querySelector('[data-project-prose]');
  const figuresEl = document.querySelector('[data-project-figures]');

  if (bodyEl) {
    // project.content sudah berupa HTML terstruktur yang ditulis manual
    // di projects-data.js (bukan teks polos yang perlu di-escape) —
    // sengaja diperlakukan berbeda dari field teks lain karena memang
    // dirancang untuk berisi markup (h2, p, ul, dsb).
    bodyEl.innerHTML = project.content;
  }

  if (figuresEl && project.figures && project.figures.length > 0) {
    const colsClass = project.figures.length > 1 ? ' figure-grid--cols-2' : '';

    figuresEl.innerHTML = `
      <h2>Plots &amp; Results</h2>
      <div class="figure-grid${colsClass}">
        ${project.figures
          .map((fig) => {
            // Jika field filename sudah diisi (bukan null/kosong), tampilkan
            // gambar asli dari assets/images/projects/. Selama masih null
            // (kondisi default saat template ini diserahkan), tampilkan
            // placeholder eksplisit — supaya jelas terlihat sebagai "belum
            // diisi" alih-alih img tag rusak (ikon broken-image browser)
            // yang membingungkan dan terlihat seperti bug, bukan pengingat
            // yang disengaja.
            const mediaHtml = fig.filename
              ? `<img src="../assets/images/projects/${encodeURIComponent(fig.filename)}" alt="${escapeHtml(fig.caption)}" loading="lazy" />`
              : `<div class="project-card__media-placeholder" style="aspect-ratio: 16/10;">
                   Placeholder Plot — Replace with Original Image
                 </div>`;

            return `
              <figure class="figure-item">
                ${mediaHtml}
                <figcaption class="figure-item__caption">${escapeHtml(fig.caption)}</figcaption>
              </figure>`;
          })
          .join('')}
      </div>
    `;
  } else if (figuresEl) {
    figuresEl.innerHTML = '';
  }
}

function renderSidebar(project) {
  const sidebarEl = document.querySelector('[data-project-sidebar]');
  if (!sidebarEl) return;

  const techHtml = project.tech
    .map((t) => `<span class="skill-tag" style="font-size: 0.72rem; padding: 0.3rem 0.7rem;">${escapeHtml(t)}</span>`)
    .join('');

  const statsHtml = project.stats
    .map(
      (stat) => `<li><span>${escapeHtml(stat.label)}</span><span style="color: var(--color-fg-bold); font-weight: 600;">${escapeHtml(stat.value)}</span></li>`
    )
    .join('');

  sidebarEl.innerHTML = `
    <div class="sidebar-block">
      <p class="sidebar-block__title">Key Statistics</p>
      <ul class="sidebar-block__list">${statsHtml}</ul>
    </div>
    <div class="sidebar-block">
      <p class="sidebar-block__title">Tech Stack</p>
      <div class="sidebar-block__tech">${techHtml}</div>
    </div>
  `;
}

function renderRelated(project) {
  const relatedEl = document.querySelector('[data-project-related]');
  if (!relatedEl) return;

  if (!project.related || project.related.length === 0) {
    relatedEl.innerHTML = '';
    return;
  }

  const relatedProjects =
    typeof getProjectsByIds === 'function' ? getProjectsByIds(project.related) : [];

  if (relatedProjects.length === 0) {
    relatedEl.innerHTML = '';
    return;
  }

  const cardsHtml = relatedProjects
    .map(
      (p) => `
        <article class="project-card">
          <div class="project-card__media">
            <div class="project-card__media-placeholder">${escapeHtml(p.category.replace('-', ' '))}</div>
          </div>
          <div class="project-card__body">
            <div class="project-card__tags">${renderProjectTags(p.tag)}</div>
            <h3 class="project-card__title">${escapeHtml(p.title)}</h3>
            <p class="project-card__desc">${escapeHtml(p.shortDesc)}</p>
            <div class="project-card__footer">
              <a href="project.html?id=${encodeURIComponent(p.id)}" class="project-card__link">
                See More Details
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
            </div>
          </div>
        </article>`
    )
    .join('');

  relatedEl.innerHTML = `
    <div class="container">
      <div class="project-slider project-slider--related">
        <div class="project-slider__header">
          <h2 class="section__title" style="text-align:center; margin-bottom: 0;">Related Projects</h2>
          <div class="project-slider__controls project-slider__controls--compact">
            <button type="button" class="project-slider__btn" data-related-slider-prev aria-label="Previous related projects">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button type="button" class="project-slider__btn" data-related-slider-next aria-label="Next related projects">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        <div class="project-slider__viewport">
          <div class="project-slider__track" data-related-project-track>${cardsHtml}</div>
        </div>
      </div>
    </div>
  `;

  initRelatedSlider();
}

function initRelatedSlider() {
  const track = document.querySelector('[data-related-project-track]');
  const prevBtn = document.querySelector('[data-related-slider-prev]');
  const nextBtn = document.querySelector('[data-related-slider-next]');

  if (!track || !prevBtn || !nextBtn) return;

  const getScrollAmount = () => {
    const firstCard = track.querySelector('.project-card');
    if (!firstCard) return 0;
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    return firstCard.getBoundingClientRect().width + gap;
  };

  const updateButtons = () => {
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  };

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  requestAnimationFrame(updateButtons);
}

/**
 * Reveal observer khusus halaman detail — dijalankan SETELAH konten
 * dirender secara dinamis (renderProjectDetail), karena elemen
 * berkelas .reveal baru ada di DOM setelah proses render selesai.
 * Ini alasan yang sama mengapa renderProjectPreview() di main.js juga
 * membuat observer terpisah alih-alih bergantung pada
 * initRevealObserver() yang berjalan lebih dulu.
 */
function initRevealObserverForDetail() {
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
      });
    },
    { threshold: 0.1 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/**
 * Duplikasi ringan dari escapeHtml (main.js) — sengaja diduplikasi di
 * sini alih-alih membuat file utilitas terpisah, mengingat ukurannya
 * yang kecil dan agar halaman detail tidak punya dependensi tambahan
 * di luar main.js (untuk initMenuOverlay) dan projects-data.js.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
