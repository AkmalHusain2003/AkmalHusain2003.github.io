/**
 * projects-data.js
 * ----------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH untuk seluruh data project.
 *
 * Rasional arsitektur: alih-alih menuliskan detail tiap project dua kali
 * (sekali sebagai kartu preview di index.html, sekali lagi sebagai konten
 * halaman detail di pages/project.html), semua data disimpan di satu
 * tempat ini. index.html merender preview dari sini, dan
 * pages/project.html merender detail lengkap dari sini berdasarkan
 * parameter ?id= pada URL.
 *
 * Manfaat langsung: ketika Anda memperbarui deskripsi atau hasil suatu
 * project, cukup ubah SATU objek di bawah — preview di homepage dan
 * halaman detail otomatis konsisten. Ini mencegah risiko data yang
 * tidak sinkron antar-halaman.
 *
 * CATATAN AKURASI (harap dijaga saat mengedit):
 * - GUMM menggunakan algoritma Expectation-Maximization (EM), BUKAN
 *   Bayesian inference. Jangan ubah frasa ini tanpa verifikasi ulang.
 * - ENTRAP bersifat proprietary/closed-source (bukan open-source).
 *   Tautan repo untuk ENTRAP TIDAK disediakan secara default karena
 *   alasan ini — hanya tautan ke ringkasan/paper jika ada.
 * - Skill/tools yang dicantumkan hanya yang benar-benar pernah dipakai:
 *   TIDAK ada Rust, CUDA, MESA, atau REBOUND. CASA benar untuk radio
 *   astronomy tools.
 * ----------------------------------------------------------------------
 */

const PROJECTS = [
  {
    id: 'entrap',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: ['ml-tools', 'research'],
    tag: ['M.Sc. Thesis', 'ML Algorithm'],
    title: 'ENTRAP',
    titleFull: 'ENTRAP — ENtropy-based Topological Rescue of Ambiguous Points',
    shortDesc:
      'A hybrid algorithm combining HDBSCAN with sequential Topological Data Analysis (TDA) to recover 20–30% of missing open cluster members in peripheral regions from Gaia DR3 data.',
    subtitle:
      'Open cluster identification pipeline based on density-based clustering and topological data analysis, developed as part of the M.Sc. thesis research at ITB.',
    thumbnail: null,
    repoUrl: null,
    isProprietary: true,
    demoUrl: null,
    tech: ['Python', 'HDBSCAN', 'Ripser (TDA)', 'scikit-learn', 'AMUSE', 'galpy'],
    stats: [
      { label: 'Member Recovery', value: '10-300%' },
      { label: 'Test Clusters', value: '10' }
    ],
    figures: [
      {
        filename: null, // TODO: isi mis. 'entrap-m44-comparison.png' setelah gambar diletakkan di assets/images/projects/
        caption:
          'Comparison of ENTRAP vs. HDBSCAN clustering on the M44 cluster — the extra green points indicate members successfully recovered by ENTRAP in the peripheral region.'
      },
      {
        filename: null, // TODO: isi nama file setelah gambar diletakkan di assets/images/projects/
        caption:
          'Forest plot of the fitted isochrone parameters for the Orion clusters (ASCC 19–21, Briceño 1, OC 0339) compared with the literature compilation.'
      }
    ],
    content: `
      <h2>Background</h2>
      <p>Standard density-based clustering methods such as HDBSCAN are highly effective at identifying the core of open star clusters in Gaia DR3 astrometric data, but they systematically lose 20&ndash;30% of true members in the peripheral region &mdash; an area of low local density and overlap with the field star population. This is not random noise, but a structural bias against the gradual geometric dissolution of clusters at their edges, including tidal tail structures.</p>

      <h2>Approach</h2>
      <p>ENTRAP addresses this by inserting a sequential topological data analysis (TDA) stage after the initial HDBSCAN clustering, built from four main components:</p>
      <ul>
        <li><strong>DEK (adaptive k)</strong> &mdash; adaptively determines neighbor parameters using TwoNN and the coefficient of variation (CoV), rather than a fixed k value that is sensitive to bias between clusters with different densities.</li>
        <li><strong>GPEE</strong> &mdash; Mahalanobis-distance ordering combined with sequential persistent H0 entropy (computed via <code>ripser</code>) to assess the topological significance of each candidate point step by step.</li>
        <li><strong>Memory_Manager</strong> &mdash; a memmap strategy to handle datasets above 50,000 points without overloading memory.</li>
        <li><strong>ENTRAP Class (sklearn API)</strong> &mdash; orchestrates the "chained claiming" process with knee detection via KneeLocator, with a fallback to the 75th percentile if knee detection fails to converge.</li>
      </ul>

      <h2>Test Data &amp; Validation</h2>
      <p>The mock validation data were built through a synthetic pipeline combining backward orbit integration using <code>galpy</code>, N-body simulation with BHTree in AMUSE, a field-star population from GeDR3Mock, and Poisson-voxel labeling. Nine test clusters were used, covering M44, M45, seven Orion clusters (ASCC 19&ndash;21, Brice&ntilde;o 1, OC 0339, OCSN 61, UBC 17a), and Gaia 1 (~5 kpc, ~3.5 Gyr).</p>

      <h2>Main Results</h2>
      <p>In the M44 cluster, ENTRAP recovered 138 additional members (+13%) compared with pure HDBSCAN. In Gaia 1, ENTRAP rejected 285 contaminants that had previously been identified as members in the Hunt (2023) catalog, showing that the gain in recall in the peripheral region did not significantly sacrifice precision.</p>

      <h2>Status</h2>
      <p>ENTRAP is proprietary as part of the results of the M.Sc. thesis research. The source code is not publicly released; a summary of the methodology and results is available through the thesis publication.</p>
    `,
    related: ['gumm', 'brain-tumor-tda']
  },
  {
    id: 'gumm',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: 'ml-tools',
    tag: ['ML Algorithm','Open Source Package'],
    title: 'GUMM',
    titleFull: 'GUMM — Gaussian-Uniform Mixture Model',
    shortDesc:
      'Expectation-Maximization (EM) package for Gaussian-Uniform mixture models, implemented in Cython with OpenMP parallelization and automatic membership thresholding via Ripley\'s K spatial point-pattern analysis.',
    subtitle:
      'Open-source package for mixture-model estimation using the Expectation-Maximization algorithm, built from scratch with a focus on computational performance.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/GUMM',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'Cython', 'OpenMP', 'NumPy', "Ripley's K"],
    stats: [
      { label: 'Core Language', value: 'Cython' },
      { label: 'Parallelization', value: 'OpenMP' },
      { label: 'Method', value: 'Expectation-Maximization' }
    ],
    figures: [
      {
        filename: null, // TODO: isi nama file setelah gambar diletakkan di assets/images/projects/
        caption:
          'Illustration of EM convergence for the Gaussian-Uniform mixture model, showing separation between the signal component (Gaussian) and the uniform background (Uniform).'
      }
    ],
    content: `
      <h2>Background</h2>
      <p>GUMM (Gaussian-Uniform Mixture Model) was built to model data composed of two mixed populations: one component follows a Gaussian distribution (representing a structured signal) and the other follows a uniform distribution (representing the background or noise). This type of mixture model is common in astrometric contexts, such as separating cluster members from the field population based on the proper-motion distribution.</p>

      <h2>Methodology</h2>
      <p>Model parameters are estimated using the <strong>Expectation-Maximization (EM)</strong> algorithm &mdash; a classical iterative method for maximum-likelihood estimation in models with latent variables (here, the membership of each data point to the Gaussian or Uniform component). Each iteration consists of the E-step (computing the posterior membership probability for each point) and the M-step (updating the Gaussian parameters &mdash; mean and covariance &mdash; based on those posterior weights).</p>
      <p>The computational core is implemented in Cython with OpenMP parallelization to accelerate EM iterations on large datasets, an important design choice because EM is iterative and per-iteration overhead strongly affects total convergence time.</p>
      <p>The membership threshold is set automatically using <strong>Ripley's K</strong> spatial point-pattern analysis, avoiding the need to choose a threshold manually or arbitrarily.</p>

      <h2>Debugging &amp; Fixes</h2>
      <p>Developing this package involved identifying and fixing five significant bugs:</p>
      <ol>
        <li>A PCA projection error that affected the orientation of the Gaussian component.</li>
        <li>The <code>confidence_level</code> parameter was ignored and did not affect the final result even when changed by the user.</li>
        <li>Missing Bonferroni correction in sequential statistical tests, which risked false-positive inflation.</li>
        <li>EM state not being reset between repeated calls, causing fitting results to be influenced by prior call history.</li>
        <li>Global random seeding that was not thread-safe, leading to non-reproducible results under parallel execution.</li>
      </ol>

      <h2>Publication</h2>
      <p>The methodology and validation results for GUMM are documented in an arXiv-style paper prepared in LaTeX.</p>
    `,
    related: ['entrap', 'easlt']
  },
  {
    id: 'aspire',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: 'research',
    tag: 'Research Internship',
    title: 'ASPIRE Exoplanet TTV',
    titleFull: 'ASPIRE — Transit Timing Variation Analysis of Kepler-221',
    shortDesc:
      'An N-body simulation pipeline (AMUSE/Huayno) proposing the existence of an unseen planet ("planet f") to explain the inconsistent orbital resonance of planet d in the Kepler-221 system.',
    subtitle:
      'Research internship at the Anton Pannekoek Institute for Astronomy, University of Amsterdam, supervised by Dr. T. C. N. Boekholt, as part of the ASPIRE program.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/ASPIRE',
    isProprietary: false,
    licenseNote:
      'Dual licensing: code is under the MIT license, while the data and research results are all-rights-reserved and require permission for use.',
    demoUrl: null,
    tech: ['Python', 'AMUSE', 'Huayno', 'Astropy', 'lightkurve', 'lmfit'],
    stats: [
      { label: 'Target', value: 'Kepler-221' },
      { label: 'Institusi', value: 'UvA' }
    ],
    figures: [
      {
        filename: null, // TODO: isi nama file setelah gambar diletakkan di assets/images/projects/
        caption:
          'An O&ndash;C diagram (Observed minus Calculated) showing the transit timing variation (TTV) of planet d, indicating gravitational perturbation from an unseen body.'
      },
      {
        filename: null, // TODO: isi nama file setelah gambar diletakkan di assets/images/projects/
        caption:
          'Transit geometry and proposed orbital configuration for planet f, drawn with TikZ/pgfplots.'
      }
    ],
    content: `
      <h2>Research Context</h2>
      <p>The Kepler-221 exoplanet system exhibits a broken orbital resonance pattern for planet d &mdash; an anomaly that theoretically suggests the presence of another undiscovered planetary body in the system. This research, conducted asynchronously under the supervision of Dr. T. C. N. Boekholt at the Anton Pannekoek Institute for Astronomy, University of Amsterdam, investigated the hypothesis that "planet f" is responsible for the anomaly through N-body dynamical modeling.</p>

      <h2>TTV Analysis Pipeline</h2>
      <p>The Transit Timing Variation (TTV) analysis was built as a complete pipeline covering:</p>
      <ul>
        <li><strong>Transit period detection</strong> &mdash; using the Box Least Squares (BLS) periodogram via the <code>lightkurve</code> library.</li>
        <li><strong>Sinusoidal fitting</strong> &mdash; estimating TTV parameters using multi-start <code>lmfit</code> with a fallback to differential evolution if local optimization fails to converge to the global solution.</li>
        <li><strong>Dynamical simulation</strong> &mdash; an AMUSE-based N-body pipeline with the Huayno integrator to test orbital configurations for planet f against the observed TTV data.</li>
      </ul>

      <h2>Initial Condition Accuracy</h2>
      <p>The initial conditions for planet f were recalculated across six simulation scenario files using the full two-body Kepler III law, with the planet mass included explicitly &mdash; not the common negligible-mass approximation used for small bodies. Numerical verification showed accuracy up to eccentricity e ~ 10<sup>&minus;16</sup>, far beyond the precision required for this simulation.</p>

      <h2>Technical Debugging</h2>
      <p>One major technical challenge was a <code>TypeError</code> in the <code>OCFit</code> pipeline, traced to a mismatch between the <code>Time</code> and <code>Quantity</code> types returned by <code>astropy</code> and <code>lightkurve</code>. Another fix was replacing the global transit-duration ratio constant (previously assumed to be fixed for all planets) with the <code>estimasi_durasi_transit()</code> function derived from first principles using the geometric relation T<sub>dur</sub> = (P/&pi;) arcsin(R<sub>&#9737;</sub>/a), so transit duration is calculated specifically from each planet's orbital geometry instead of being assumed uniform.</p>

      <h2>Status</h2>
      <p>This research is still ongoing as part of the author's role as a Research Intern in the ASPIRE program.</p>
    `,
    related: ['entrap']
  },
  {
    id: 'easlt',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: 'ml-tools',
    tag: ['ML Preprocessing', 'Open Source Package'],
    title: 'EASLT',
    titleFull: 'Enhanced Automatic Shifted Log Transformer',
    shortDesc:
      'A machine-learning preprocessing data-normalization library optimized with Monte Carlo and adaptive transformation strategies, accelerated with Numba.',
    subtitle:
      'A preprocessing library that automatically determines the optimal log-shift transformation strategy for highly skewed data.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/enhanced-automatic-shifted-log',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'Numba', 'Monte Carlo', 'NumPy'],
    stats: [
      { label: 'Acceleration', value: 'Numba JIT' },
      { label: 'Optimization', value: 'Monte Carlo' }
    ],
    figures: [],
    content: `
      <h2>Motivation</h2>
      <p>Logarithmic transformation is a standard technique for normalizing skewed data, but applying it to data containing zero or negative values requires a proper shift parameter &mdash; a value that is often chosen manually or through simple heuristics that are not optimal for every dataset.</p>

      <h2>Approach</h2>
      <p>EASLT automates the selection of the shift parameter and transformation strategy through Monte Carlo optimization, evaluating candidate parameters against normality metrics of the transformed output to determine the best adaptive configuration for each dataset. The core computation is accelerated with Numba (JIT compilation) to keep performance practical on large datasets even when many candidate evaluations are required.</p>
    `,
    related: ['gumm']
  },
  {
    id: 'brain-tumor-tda',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: 'deep-learning',
    tag: 'Medical Imaging',
    title: 'Brain Tumor Detection',
    titleFull: 'Deteksi Tumor Otak via TDA + Grad-CAM++',
    shortDesc:
      'A two-stage deep learning architecture combining VGG19, Grad-CAM++ attention, and topological data analysis (persistent homology) for interpretable brain tumor classification from MRI images.',
    subtitle:
      'A brain tumor classification approach that combines deep learning performance with topological interpretability.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/brain-tumor-tda-gradcam',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'TensorFlow/Keras', 'VGG19', 'Grad-CAM++', 'Persistent Homology'],
    stats: [
      { label: 'Backbone', value: 'VGG19' },
      { label: 'Interpretabilitas', value: 'Grad-CAM++' },
      { label: 'Analisis Topologis', value: 'TDA' }
    ],
    figures: [],
    content: `
      <h2>Motivation</h2>
      <p>Deep-learning models for medical image classification often behave as "black boxes" &mdash; accurate but difficult to interpret, which is a significant weakness in clinical settings where understanding the basis of model decisions is crucial.</p>

      <h2>Two-Stage Architecture</h2>
      <p>This project combines three components in a two-stage pipeline: a VGG19 backbone for feature extraction and initial classification, Grad-CAM++ to generate visual attention maps that highlight the image regions driving the model's decision, and topological data analysis (persistent homology) to characterize the topological structure of the identified regions &mdash; adding an extra layer of interpretation beyond simple pixel-level attention visualization.</p>
    `,
    related: ['entrap']
  },
  {
    id: 'speech-denoising',
    level: 'msc', // Jenjang studi: 'msc' (Magister) atau 'bsc' (Sarjana) — dipakai halaman pages/msc-projects.html dan pages/bsc-projects.html untuk memilah project sesuai jenjang
    category: 'deep-learning',
    tag: 'Audio Processing',
    title: 'Speech Denoising RCNN',
    titleFull: 'Speech Denoising dengan Recurrent-Convolutional Neural Network',
    shortDesc:
      'A Recurrent-Convolutional Neural Network architecture for removing noise from conversational audio, reaching scores of PESQ 2.445 and STOI 0.922.',
    subtitle:
      'A deep-learning model for improving conversational audio quality through automatic noise reduction.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/Simple-Denoising-Using-Deep-Learning',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'TensorFlow/Keras', 'RCNN', 'Signal Processing'],
    stats: [
      { label: 'PESQ Score', value: '2.445' },
      { label: 'STOI Score', value: '0.922' }
    ],
    figures: [],
    content: `
      <h2>Approach</h2>
      <p>The model combines convolutional layers (to capture local spectral patterns in the audio representation) with recurrent layers (to capture long-term temporal dependencies in conversational signals), a hybrid architecture that is commonly effective for speech-enhancement tasks.</p>

      <h2>Evaluation</h2>
      <p>The model was evaluated using two standard metrics in the speech-enhancement domain: PESQ (Perceptual Evaluation of Speech Quality), which reached 2.445, and STOI (Short-Time Objective Intelligibility), which reached 0.922 &mdash; both indicating a significant improvement in perceived audio quality and intelligibility after denoising.</p>
    `,
    related: []
  }
];

/**
 * Helper: mengambil satu project berdasarkan id.
 * Dipakai oleh pages/project.html.
 */
function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id) || null;
}

/**
 * Helper: mengambil beberapa project berdasarkan daftar id (untuk related projects).
 */
function getProjectsByIds(ids) {
  return ids
    .map((id) => getProjectById(id))
    .filter((p) => p !== null);
}

/**
 * Helper: mengambil seluruh project berdasarkan jenjang studi ('msc'
 * atau 'bsc'). Dipakai oleh pages/msc-projects.html dan
 * pages/bsc-projects.html untuk menampilkan daftar project sesuai
 * jenjang tanpa perlu menuliskan ulang daftar id secara manual di
 * kedua halaman tersebut — menjaga PROJECTS di file ini sebagai
 * satu-satunya sumber kebenaran, konsisten dengan arsitektur
 * keseluruhan projects-data.js.
 */
function getProjectsByLevel(level) {
  return PROJECTS.filter((p) => p.level === level);
}
