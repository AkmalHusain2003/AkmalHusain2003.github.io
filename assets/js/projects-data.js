/**
 * projects-data.js
 * ----------------------------------------------------------------------
 * SINGLE SOURCE OF TRUTH for all project data.
 *
 * Architecture rationale: rather than writing each project's details
 * twice (once as a preview card in index.html, once again as detail-page
 * content in pages/project.html), all data is stored in this one place.
 * index.html renders previews from here, and pages/project.html renders
 * the full detail view from here based on the ?id= URL parameter.
 *
 * Direct benefit: when you update a project's description or results,
 * you only need to change ONE object below — the homepage preview and
 * detail page stay automatically consistent. This prevents the risk of
 * data going out of sync between pages.
 *
 * ACCURACY NOTES (please preserve when editing):
 * - GUMM uses the Expectation-Maximization (EM) algorithm, NOT
 *   Bayesian inference. Do not change this phrasing without re-verifying.
 * - ENTRAP is proprietary/closed-source (not open-source). A repo link
 *   is NOT provided for ENTRAP by default for this reason — only a
 *   link to a summary/paper if one exists.
 * - Listed skills/tools are only ones actually used: NO Rust, CUDA,
 *   MESA, or REBOUND. CASA is correct for radio astronomy tools.
 *
 * ARCHITECTURE NOTE — `tier` vs `featured` field (DO NOT CONFLATE):
 * - `tier` ('main' | 'other') determines WHICH grid a project renders
 *   into — Main Projects or Other Projects — per the grouping the
 *   portfolio owner explicitly determined themselves, independent of
 *   any other criteria. Read by renderProjectPreview() in main.js to
 *   partition PROJECTS into each grid container before rendering.
 * - `featured` (boolean) ONLY controls card width (2 columns vs 1) via
 *   the `project-card--featured` CSS class — a purely visual decision
 *   with no bearing on which grid the card belongs to.
 * - The two fields are INDEPENDENT. Currently tier:'main' always
 *   coincides with featured:true (ENTRAP, GUMM) because both happen to
 *   be flagship projects — but this is NOT a rule, only the current
 *   state. Adding a new project with tier:'main' does NOT automatically
 *   mean it must be featured:true, or vice versa.
 * ----------------------------------------------------------------------
 */

const PROJECTS = [
  {
    id: 'entrap',
    featured: true,
    tier: 'main',
    category: 'research',
    tag: 'M.Sc. Thesis',
    title: 'ENTRAP',
    titleFull: 'ENTRAP — ENtropy-based Topological Rescue of Ambiguous Points',
    shortDesc:
      'A hybrid algorithm combining HDBSCAN with sequential Topological Data Analysis (TDA) to recover 20–30% of open star cluster members lost in peripheral regions of Gaia DR3 data.',
    subtitle:
      'An open star cluster identification pipeline built on density-based clustering and topological data analysis, developed as Master\'s thesis research at ITB.',
    thumbnail: null,
    repoUrl: null,
    isProprietary: true,
    demoUrl: null,
    tech: ['Python', 'HDBSCAN', 'Ripser (TDA)', 'scikit-learn', 'AMUSE', 'galpy'],
    stats: [
      { label: 'M44 Recovery', value: '+13%' },
      { label: 'Gaia 1 Contaminants Rejected', value: '285' },
      { label: 'Test Clusters', value: '9' }
    ],
    figures: [
      {
        filename: null, // TODO: fill in e.g. 'entrap-m44-comparison.png' once the image is placed in assets/images/projects/
        caption:
          'Comparison of ENTRAP vs. HDBSCAN clustering results on the M44 cluster — additional green points denote members successfully recovered by ENTRAP in peripheral regions.'
      },
      {
        filename: null, // TODO: fill in filename once the image is placed in assets/images/projects/
        caption:
          'Forest plot of isochrone-fitted parameters for Orion clusters (ASCC 19–21, Briceño 1, OC 0339) compared against literature compilations.'
      }
    ],
    content: `
      <h2>Background</h2>
      <p>Standard density-based clustering methods such as HDBSCAN are highly effective at identifying the core of open star clusters in Gaia DR3 astrometric data, but systematically lose 20&ndash;30% of true members in peripheral regions &mdash; areas with low local density that overlap with the field star population. This loss is not random noise but a structural bias against the cluster's geometric shape, which decays gradually at the edges, including tidal tail structures.</p>

      <h2>Approach</h2>
      <p>ENTRAP addresses this problem by inserting a sequential topological data analysis (TDA) stage after initial HDBSCAN clustering, built from four main components:</p>
      <ul>
        <li><strong>DEK (adaptive k)</strong> &mdash; adaptively determines the neighbor parameter using TwoNN and coefficient of variation (CoV), rather than a fixed k value prone to bias across clusters with differing densities.</li>
        <li><strong>GPEE</strong> &mdash; Mahalanobis-distance-based ordering combined with sequential persistent H0 entropy (computed via <code>ripser</code>) to progressively assess the topological significance of each candidate point.</li>
        <li><strong>Memory_Manager</strong> &mdash; a memmap strategy for handling datasets above 50,000 points without overburdening memory.</li>
        <li><strong>ENTRAP class (sklearn API)</strong> &mdash; orchestrates the "chained claiming" process with knee detection via KneeLocator, falling back to the 75th percentile if knee detection fails to converge.</li>
      </ul>

      <h2>Test Data &amp; Validation</h2>
      <p>Mock data for validation was built through a synthetic pipeline combining backward orbit integration using <code>galpy</code>, N-body simulation with BHTree in AMUSE, field star population from GeDR3Mock, and Poisson-Voxel labeling. Nine test clusters were used, comprising M44, M45, seven Orion clusters (ASCC 19&ndash;21, Brice&ntilde;o 1, OC 0339, OCSN 61, UBC 17a), and Gaia 1 (~5 kpc, ~3.5 Gyr).</p>

      <h2>Key Results</h2>
      <p>On the M44 cluster, ENTRAP recovered 138 additional members (+13%) compared to pure HDBSCAN. On Gaia 1, ENTRAP rejected 285 contaminants previously identified as members in the Hunt (2023) catalog, showing that the recall improvement in peripheral regions does not come at a significant cost to precision.</p>

      <h2>Status</h2>
      <p>ENTRAP is proprietary as part of the results of Master's thesis research. Source code is not publicly released; a summary of the methodology and results is available through the thesis publication.</p>
    `,
    related: ['gumm', 'brain-tumor-tda']
  },
  {
    id: 'gumm',
    featured: true,
    tier: 'main',
    category: 'ml-tools',
    tag: 'Open Source Package',
    title: 'GUMM',
    titleFull: 'GUMM — Gaussian-Uniform Mixture Model',
    shortDesc:
      'An Expectation-Maximization (EM) package for Gaussian-Uniform mixture models, written in Cython with OpenMP parallelization, with a membership threshold auto-tuned via Ripley\'s K spatial point pattern analysis.',
    subtitle:
      'An open-source package for mixture model estimation based on the Expectation-Maximization algorithm, built from scratch with a focus on computational performance.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/GUMM',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'Cython', 'OpenMP', 'NumPy', "Ripley's K"],
    stats: [
      { label: 'Core Language', value: 'Cython' },
      { label: 'Parallelization', value: 'OpenMP' },
      { label: 'Critical Bugs Fixed', value: '5' }
    ],
    figures: [
      {
        filename: null, // TODO: fill in filename once the image is placed in assets/images/projects/
        caption:
          'Illustration of EM algorithm convergence on a Gaussian-Uniform mixture model, showing the separation of the signal component (Gaussian) from the uniform background.'
      }
    ],
    content: `
      <h2>Background</h2>
      <p>GUMM (Gaussian-Uniform Mixture Model) was built to model data composed of two mixed populations: one component following a Gaussian distribution (representing structured signal) and one component following a uniform distribution (representing background or noise). Mixture models of this kind are common in astrometric contexts, for example separating star cluster members from the field population based on proper motion distribution.</p>

      <h2>Methodology</h2>
      <p>Model parameter estimation is performed via the <strong>Expectation-Maximization (EM)</strong> algorithm &mdash; a classic iterative method for maximum likelihood estimation in models with latent variables (here, each data point's membership in the Gaussian or Uniform component). Each iteration consists of an E step (computing posterior membership probability for each point) and an M step (updating Gaussian parameters &mdash; mean and covariance &mdash; based on those posterior weights).</p>
      <p>The entire computational core is written in Cython with OpenMP parallelization to accelerate EM iterations on large datasets, an important design decision given that EM's iterative nature makes per-iteration overhead highly consequential for total convergence time.</p>
      <p>The membership threshold is auto-tuned using <strong>Ripley's K</strong> spatial point pattern analysis, avoiding the need to set the threshold manually or arbitrarily.</p>

      <h2>Debugging &amp; Fixes</h2>
      <p>Development of this package involved identifying and fixing five significant bugs:</p>
      <ol>
        <li>An error in the PCA projection affecting the orientation of the Gaussian component.</li>
        <li>An ignored <code>confidence_level</code> parameter (had no effect on the final result even when changed by the user).</li>
        <li>Absence of a Bonferroni correction in multi-level statistical testing, risking false positive inflation.</li>
        <li>EM state not reset between repeated calls, causing fit results to be affected by the history of previous calls.</li>
        <li>Non-thread-safe global random seeding, causing results to be non-reproducible under parallel execution.</li>
      </ol>

      <h2>Publication</h2>
      <p>GUMM's methodology and validation results are documented in an arXiv-style paper typeset in LaTeX.</p>
    `,
    related: ['entrap', 'easlt']
  },
  {
    id: 'aspire',
    featured: false,
    tier: 'other',
    category: 'research',
    tag: 'Research Internship — Active',
    title: 'ASPIRE Exoplanet TTV',
    titleFull: 'ASPIRE — Transit Timing Variation Analysis of Kepler-221',
    shortDesc:
      'An N-body simulation pipeline (AMUSE/Huayno) proposing the existence of an unidentified planet ("planet f") to explain the inconsistent orbital resonance of planet d in the Kepler-221 system.',
    subtitle:
      'A research internship at the Anton Pannekoek Institute for Astronomy, University of Amsterdam, under the supervision of Dr. T. C. N. Boekholt, as part of the ASPIRE program.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/ASPIRE',
    isProprietary: false,
    licenseNote:
      'Dual license: code is under the MIT license, while data and research results are all-rights-reserved (usage requires permission).',
    demoUrl: null,
    tech: ['Python', 'AMUSE', 'Huayno', 'Astropy', 'lightkurve', 'lmfit'],
    stats: [
      { label: 'Status', value: 'Ongoing' },
      { label: 'Target', value: 'Kepler-221' },
      { label: 'Institution', value: 'UvA' }
    ],
    figures: [
      {
        filename: null, // TODO: fill in filename once the image is placed in assets/images/projects/
        caption:
          'O&ndash;C (Observed minus Calculated) diagram showing transit timing variation (TTV) for planet d, indicating gravitational perturbation from an unobserved body.'
      },
      {
        filename: null, // TODO: fill in filename once the image is placed in assets/images/projects/
        caption:
          'Schematic of transit geometry and proposed orbital configuration for planet f, drawn with TikZ/pgfplots.'
      }
    ],
    content: `
      <h2>Research Context</h2>
      <p>The Kepler-221 exoplanetary system exhibits a broken orbital resonance pattern in planet d &mdash; an anomaly that theoretically indicates the possible presence of an additional, unidentified planetary body in the system. This research, conducted remotely under the supervision of Dr. T. C. N. Boekholt at the Anton Pannekoek Institute for Astronomy, University of Amsterdam, investigates the hypothesis that an unseen "planet f" is the cause of this anomaly through N-body dynamical modeling.</p>

      <h2>TTV Analysis Pipeline</h2>
      <p>The Transit Timing Variation (TTV) analysis was built as a complete pipeline covering:</p>
      <ul>
        <li><strong>Transit period detection</strong> &mdash; using a Box Least Squares (BLS) periodogram via the <code>lightkurve</code> library.</li>
        <li><strong>Sinusoidal fitting</strong> &mdash; TTV parameter estimation using multi-start <code>lmfit</code>, falling back to differential evolution when local optimization fails to converge to a global solution.</li>
        <li><strong>Dynamics simulation</strong> &mdash; an AMUSE-based N-body pipeline with the Huayno integrator to test planet-f orbital configuration scenarios against the observed TTV data.</li>
      </ul>

      <h2>Initial Condition Accuracy</h2>
      <p>Initial conditions for planet f were re-derived across six simulation scenario files using the full two-body Kepler's Third Law, explicitly incorporating planet mass &mdash; rather than the negligible-mass approximation commonly used for small bodies. Numerical verification shows accuracy down to an eccentricity of e ~ 10<sup>&minus;16</sup>, far exceeding the precision required for this simulation.</p>

      <h2>Technical Debugging</h2>
      <p>One significant technical challenge was a <code>TypeError</code> in the <code>OCFit</code> pipeline, traced to a data-type incompatibility between <code>astropy</code>'s <code>Time</code> and <code>Quantity</code> objects returned by <code>lightkurve</code>. Another fix replaced a global transit-duration-ratio constant (previously assumed fixed across all planets) with a <code>transit_duration_estimate()</code> function derived from first principles using the geometric formula T<sub>dur</sub> = (P/&pi;) arcsin(R<sub>&#9737;</sub>/a), so that transit duration is computed specifically from each planet's orbital geometry rather than assumed uniform.</p>

      <h2>Status</h2>
      <p>This research is still ongoing as part of the author's role as Research Intern in the ASPIRE program.</p>
    `,
    related: ['entrap']
  },
  {
    id: 'easlt',
    featured: false,
    tier: 'other',
    category: 'ml-tools',
    tag: 'ML Preprocessing',
    title: 'EASLT',
    titleFull: 'Enhanced Automatic Shifted Log Transformer',
    shortDesc:
      'A data normalization library for machine learning preprocessing, optimized with Monte Carlo and an adaptive transformation strategy, accelerated with Numba.',
    subtitle:
      'A preprocessing library that automatically determines the optimal log-shift transformation strategy for highly-skewed data.',
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
      <p>Logarithmic transformation is a standard technique for normalizing skewed-distribution data, but applying it to data containing zero or negative values requires an appropriate shift parameter &mdash; a value often determined manually or through simple heuristics that are not optimal for every dataset.</p>

      <h2>Approach</h2>
      <p>EASLT automates the selection of the shift parameter and transformation strategy through Monte Carlo-based optimization, evaluating various candidate parameters against the normality metric of the transformed result to adaptively determine the optimal configuration per dataset. Core computation is accelerated using Numba (JIT compilation) to keep performance viable on large datasets despite the many candidate evaluations involved.</p>
    `,
    related: ['gumm']
  },
  {
    id: 'brain-tumor-tda',
    featured: false,
    tier: 'other',
    category: 'deep-learning',
    tag: 'Medical Imaging',
    title: 'Brain Tumor Detection',
    titleFull: 'Brain Tumor Detection via TDA + Grad-CAM++',
    shortDesc:
      'A two-stage deep learning architecture combining VGG19, Grad-CAM++ attention, and topological data analysis (persistent homology) for interpretable brain tumor classification from MRI images.',
    subtitle:
      'A brain tumor classification approach combining deep learning performance with topological interpretability.',
    thumbnail: null,
    repoUrl: 'https://github.com/AkmalHusain2003/brain-tumor-tda-gradcam',
    isProprietary: false,
    demoUrl: null,
    tech: ['Python', 'TensorFlow/Keras', 'VGG19', 'Grad-CAM++', 'Persistent Homology'],
    stats: [
      { label: 'Backbone', value: 'VGG19' },
      { label: 'Interpretability', value: 'Grad-CAM++' },
      { label: 'Topological Analysis', value: 'TDA' }
    ],
    figures: [],
    content: `
      <h2>Motivation</h2>
      <p>Deep learning models for medical image classification often function as a "black box" &mdash; accurate but difficult to interpret, a significant weakness in a clinical context where understanding the basis for a model's decisions is critical.</p>

      <h2>Two-Stage Architecture</h2>
      <p>This project combines three components in a two-stage pipeline: a VGG19 backbone for feature extraction and initial classification, Grad-CAM++ to generate a visual attention map highlighting the image regions most influential to the model's decision, and topological data analysis (persistent homology) to characterize the topological structure of the identified regions &mdash; adding an interpretive layer beyond pixel-attention visualization alone.</p>
    `,
    related: ['entrap']
  },
  {
    id: 'speech-denoising',
    featured: false,
    tier: 'other',
    category: 'deep-learning',
    tag: 'Audio Processing',
    title: 'Speech Denoising RCNN',
    titleFull: 'Speech Denoising with a Recurrent-Convolutional Neural Network',
    shortDesc:
      'A Recurrent-Convolutional Neural Network architecture for removing noise from conversational audio, achieving a PESQ score of 2.445 and STOI score of 0.922.',
    subtitle:
      'A deep learning model for improving conversational audio quality through automatic noise reduction.',
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
      <p>The model combines convolutional layers (to capture local spectral patterns in the audio representation) with recurrent layers (to capture long-range temporal dependencies in the speech signal), a hybrid architecture generally effective for speech enhancement tasks.</p>

      <h2>Evaluation</h2>
      <p>Model performance was evaluated using two standard metrics in the speech enhancement domain: PESQ (Perceptual Evaluation of Speech Quality), which achieved a score of 2.445, and STOI (Short-Time Objective Intelligibility), which achieved a score of 0.922 &mdash; both indicating a significant improvement in perceived audio quality and intelligibility post-denoising.</p>
    `,
    related: []
  }
];

/**
 * Helper: retrieve a single project by id.
 * Used by pages/project.html.
 */
function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id) || null;
}

/**
 * Helper: retrieve multiple projects by a list of ids (for related projects).
 */
function getProjectsByIds(ids) {
  return ids
    .map((id) => getProjectById(id))
    .filter((p) => p !== null);
}
