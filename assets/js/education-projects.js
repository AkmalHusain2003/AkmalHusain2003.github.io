/**
 * education-projects.js
 * ----------------------------------------------------------------------
 * Logika untuk pages/msc-projects.html dan pages/bsc-projects.html —
 * kedua halaman memakai FILE JS YANG SAMA ini (bukan dua file terpisah),
 * karena logikanya identik: baca atribut data-level dari elemen grid di
 * HTML, ambil project yang sesuai lewat getProjectsByLevel() dari
 * projects-data.js, lalu render.
 *
 * Perbedaan konten antara halaman MSc dan BSc murni ditentukan oleh
 * data (ada tidaknya project dengan level tersebut di PROJECTS), bukan
 * oleh percabangan logika di file ini.
 * ----------------------------------------------------------------------
 */

document.addEventListener('DOMContentLoaded', () => {
  renderEducationProjectGrid();
});

/**
 * Merender grid project untuk halaman arsip (MSc atau BSc). Kartu yang
 * dipakai SENGAJA memakai markup dan kelas CSS yang identik dengan
 * kartu di grid utama homepage (project-card, dst — lihat
 * renderProjectPreview() di main.js) supaya kedua tempat terlihat
 * konsisten secara visual, meski fungsi rendernya terpisah karena
 * konteks pemanggilannya berbeda (grid utama dipanggil otomatis dari
 * DOMContentLoaded di main.js, grid halaman ini dipanggil dari
 * DOMContentLoaded di file ini sendiri).
 */
function renderEducationProjectGrid() {
  const grid = document.querySelector('[data-education-project-grid]');

  if (!grid || typeof getProjectsByLevel !== 'function') return;

  const level = grid.getAttribute('data-level');
  const projects = getProjectsByLevel(level);

  if (projects.length === 0) {
    renderEmptyState(grid, level);
    return;
  }

  const cardsHtml = projects
    .map((project) => {
      const techHtml = project.tech
        .slice(0, project.featured ? 6 : 4)
        .map((t) => `<span>${escapeHtmlEdu(t)}</span>`)
        .join('');

      const repoLinkHtml = project.repoUrl
        ? `<a href="${escapeHtmlEdu(project.repoUrl)}" class="project-card__repo" target="_blank" rel="noopener noreferrer" aria-label="Lihat repository ${escapeHtmlEdu(project.title)} di GitHub">
             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
           </a>`
        : '';

      return `
        <article class="project-card">
          <div class="project-card__media">
            <div class="project-card__media-placeholder">${escapeHtmlEdu(project.category.replace('-', ' '))}</div>
          </div>
          <div class="project-card__body">
            <span class="project-card__tag">${escapeHtmlEdu(project.tag)}</span>
            <h3 class="project-card__title">${escapeHtmlEdu(project.title)}</h3>
            <p class="project-card__desc">${escapeHtmlEdu(project.shortDesc)}</p>
            <div class="project-card__tech">${techHtml}</div>
            <div class="project-card__footer">
              <a href="project.html?id=${encodeURIComponent(project.id)}" class="project-card__link">
                Lihat Lebih Lengkap
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </a>
              ${repoLinkHtml}
            </div>
          </div>
        </article>
      `;
    })
    .join('');

  grid.innerHTML = cardsHtml;
}

/**
 * Menampilkan pesan yang jujur ketika belum ada project untuk jenjang
 * tersebut (kondisi BSc saat ini) — BUKAN membiarkan grid kosong tanpa
 * penjelasan, yang akan terlihat seperti halaman rusak/error bagi
 * pengunjung, padahal ini memang kondisi data yang sebenarnya (belum
 * diisi), konsisten dengan prinsip tidak mengarang konten yang belum
 * ada datanya.
 */
function renderEmptyState(grid, level) {
  const levelLabel = level === 'bsc' ? 'Sarjana (B.Sc.)' : 'Magister (M.Sc.)';

  grid.outerHTML = `
    <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1.5rem; border: 1px dashed var(--color-border-strong); border-radius: var(--radius-lg);">
      <p style="font-family: var(--font-family-mono); font-size: 0.8rem; color: var(--color-fg-muted); letter-spacing: var(--letter-spacing-wide); text-transform: uppercase; margin-bottom: 0.75rem;">Belum Ada Entri</p>
      <p style="color: var(--color-fg-light); max-width: 32rem; margin-inline: auto;">Project untuk jenjang ${levelLabel} belum ditambahkan ke halaman ini. Tambahkan entri baru dengan <code style="font-family: var(--font-family-mono); background: var(--color-bg-card); padding: 0.15em 0.4em; border-radius: 4px; border: 1px solid var(--color-border);">level: '${level}'</code> pada assets/js/projects-data.js untuk menampilkannya di sini secara otomatis.</p>
    </div>
  `;
}

/**
 * Duplikasi ringan dari escapeHtml (main.js dan project-page.js) —
 * dinamai escapeHtmlEdu (bukan escapeHtml biasa) untuk menghindari
 * tabrakan nama fungsi (name collision) mengingat file ini dimuat
 * BERSAMAAN dengan main.js pada halaman yang sama (lihat urutan
 * <script> di msc-projects.html/bsc-projects.html) — jika kedua file
 * sama-sama mendefinisikan fungsi global bernama escapeHtml, definisi
 * yang dimuat belakangan akan menimpa yang dimuat duluan tanpa error
 * apa pun yang terlihat, berpotensi membingungkan saat debugging di
 * kemudian hari meski secara kebetulan kedua implementasinya identik
 * saat ini.
 */
function escapeHtmlEdu(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
