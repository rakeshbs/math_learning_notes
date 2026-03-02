function detail(deeper, useCases, pitfalls, quickCheck) {
  return {
    deeper: deeper,
    useCases: useCases,
    pitfalls: pitfalls,
    quickCheck: quickCheck,
  };
}

function expansion(algebraic, computation, workedExample, connections) {
  return {
    algebraic: algebraic,
    computation: computation,
    workedExample: workedExample,
    connections: connections,
  };
}

export const CONCEPT_DETAILS = {
  vectors: detail(
    "Feature vectors, parameter vectors, and embedding vectors are all elements of linear spaces where algebraic operations are meaningful and composable.",
    [
      "Represent tabular examples for linear and kernel models",
      "Encode text and images as embedding coordinates",
      "Track optimization state as parameter vectors",
    ],
    [
      "Mixing units without scaling distorts geometry",
      "Assuming Euclidean distance is always semantically meaningful",
      "Ignoring sparsity structure in high dimensions",
    ],
    "Check whether scaling or normalization changes nearest-neighbor relations dramatically.",
  ),
  dotproduct: detail(
    "Dot products implement linear scoring, similarity, and projection. They are the primitive behind many fast BLAS-level operations.",
    [
      "Linear classifiers and regressors compute scores via w.x",
      "Embedding retrieval systems rank by dot or cosine similarity",
      "Attention logits are scaled dot products",
    ],
    [
      "Confusing cosine similarity with raw dot products",
      "Using unnormalized vectors when magnitude should not matter",
      "Numerical overflow in large-dimensional sums",
    ],
    "Compare results with and without vector normalization to confirm the intended similarity notion.",
  ),
  norms: detail(
    "Norm choice defines geometry for optimization constraints, nearest neighbors, and penalty terms.",
    [
      "L2 regularization in ridge regression and SVM variants",
      "L1 penalty for sparse feature selection",
      "Gradient clipping with L2 norm in optimization",
    ],
    [
      "Applying L1/L2 penalties without feature scaling",
      "Using incompatible norm for domain-specific similarity",
      "Ignoring non-differentiability at zero for L1",
    ],
    "Plot coefficient paths as penalty grows to verify expected sparsity vs shrinkage behavior.",
  ),
  projection: detail(
    "Orthogonal projection is the geometric core of least squares, subspace methods, and denoising.",
    [
      "Compute best linear fit in regression",
      "Project noisy observations onto signal subspace",
      "Derive normal equations and residual diagnostics",
    ],
    [
      "Projecting with non-orthonormal bases incorrectly",
      "Interpreting projection as exact reconstruction",
      "Ignoring residual orthogonality checks",
    ],
    "Validate that residual vectors are approximately orthogonal to the fitted subspace.",
  ),
  matrixmultiply: detail(
    "Matrix multiplication chains linear maps and is the computational backbone of model inference and training.",
    [
      "Forward propagation in linear and neural layers",
      "Batch transformations in PCA and whitening pipelines",
      "Covariance and Gram matrix construction",
    ],
    [
      "Dimension mismatch from incorrect orientation",
      "Assuming multiplication commutes",
      "Unstable accumulation with poor numeric precision",
    ],
    "Track matrix shapes through each operation and verify inner dimensions match exactly.",
  ),
  rank: detail(
    "Rank determines representational capacity of linear maps and reveals redundancy in features or parameters.",
    [
      "Diagnose multicollinearity in design matrices",
      "Select low-rank approximations for compression",
      "Reason about solvability and identifiability",
    ],
    [
      "Treating near-zero singular values as exactly zero without tolerance",
      "Ignoring effective rank under noise",
      "Assuming full rank implies good conditioning",
    ],
    "Inspect singular values and use tolerance-based effective rank rather than exact arithmetic rank.",
  ),
  eigenspectrum: detail(
    "Spectral analysis explains system stability, covariance structure, and iterative algorithm behavior.",
    [
      "PCA and spectral clustering preprocessing",
      "Analyze convergence rates of power iterations",
      "Stability checks in linear dynamical systems",
    ],
    [
      "Interpreting eigenvectors for non-symmetric matrices as orthogonal",
      "Ignoring complex eigenvalues in real systems",
      "Overfitting noise when inspecting small eigengaps",
    ],
    "Check symmetry assumptions before applying orthogonal eigendecomposition intuition.",
  ),
  svd: detail(
    "SVD generalizes eigendecomposition and provides robust diagnostics for rank, conditioning, and approximation quality.",
    [
      "Low-rank recommendation and matrix completion baselines",
      "Latent semantic analysis in NLP",
      "Pseudoinverse and least squares stabilization",
    ],
    [
      "Keeping too many small singular modes and fitting noise",
      "Dropping modes without checking explained variance",
      "Ignoring sign/rotation ambiguities in factors",
    ],
    "Plot cumulative explained energy from singular values before truncating dimensions.",
  ),
  pca: detail(
    "PCA rotates data to principal axes, enabling variance-aware compression and decorrelation.",
    [
      "Dimensionality reduction before linear models",
      "Noise filtering in sensor and imaging data",
      "Visualization of high-dimensional embeddings",
    ],
    [
      "Running PCA on uncentered data",
      "Skipping standardization when scales differ",
      "Assuming PCA components are causal factors",
    ],
    "Confirm data centering and inspect explained variance ratios for retained components.",
  ),
  derivative: detail(
    "Derivatives enable local linear approximation and sensitivity analysis of objectives and model outputs.",
    [
      "Compute scalar gradients in one-dimensional optimization",
      "Assess sensitivity of losses to hyperparameters",
      "Construct Taylor approximations for diagnostics",
    ],
    [
      "Using finite differences with too-large perturbations",
      "Ignoring non-smooth points",
      "Confusing local derivative with global trend",
    ],
    "Compare analytical derivative against finite-difference approximation at random points.",
  ),
  gradient: detail(
    "Gradients are the direction field that drives first-order training methods across parameter space.",
    [
      "Train linear and generalized linear models",
      "Perform adversarial sensitivity analysis",
      "Optimize differentiable objectives with constraints",
    ],
    [
      "Exploding updates from unscaled gradients",
      "Vanishing progress on flat regions",
      "Mismatched sign conventions in custom objectives",
    ],
    "Monitor gradient norms per step; abrupt spikes usually indicate instability.",
  ),
  jacobian: detail(
    "Jacobian matrices capture how vector outputs change with vector inputs and are essential for compositional derivatives.",
    [
      "Uncertainty propagation through transformations",
      "Invertibility checks in normalizing flows",
      "Sensitivity analysis in multivariate systems",
    ],
    [
      "Full Jacobian materialization when VJP/JVP is enough",
      "Ignoring determinant sign for orientation changes",
      "Numerical instability near singular points",
    ],
    "Use Jacobian-vector products unless full Jacobian structure is explicitly required.",
  ),
  hessian: detail(
    "Second-order information quantifies curvature and improves understanding of landscape sharpness and conditioning.",
    [
      "Newton and quasi-Newton updates",
      "Uncertainty estimation via Laplace approximations",
      "Detect saddle points vs minima in diagnostics",
    ],
    [
      "Inverting noisy Hessians directly",
      "Assuming positive curvature globally from local checks",
      "Ignoring computational cost in high dimensions",
    ],
    "Inspect Hessian eigenvalue signs at candidate optima before classifying critical points.",
  ),
  convexity: detail(
    "Convex structure gives global optimality guarantees and predictable optimization behavior.",
    [
      "Design convex surrogate losses",
      "Prove convergence rates for solvers",
      "Build robust regularized estimators",
    ],
    [
      "Assuming non-convex models inherit convex guarantees",
      "Ignoring domain constraints in convexity proofs",
      "Confusing quasiconvex with convex objectives",
    ],
    "Test midpoint inequality numerically on random pairs within domain.",
  ),
  gradientdescent: detail(
    "Gradient descent discretizes continuous steepest descent dynamics and underpins many practical optimizers.",
    [
      "Fit logistic and linear models at scale",
      "Solve empirical risk minimization objectives",
      "Tune iterative solvers with step-size schedules",
    ],
    [
      "Learning rate too high causes divergence",
      "Learning rate too low stalls convergence",
      "Ignoring conditioning and feature scaling",
    ],
    "Plot objective vs iteration; persistent oscillation signals step-size or conditioning issues.",
  ),
  randomvariable_ml: detail(
    "Random variables formalize uncertainty in data generation, labels, and latent factors.",
    [
      "Specify probabilistic model assumptions",
      "Design simulation experiments for evaluation",
      "Construct synthetic data with controllable noise",
    ],
    [
      "Mixing discrete and continuous formulas",
      "Ignoring support constraints",
      "Treating observed frequencies as exact probabilities",
    ],
    "Check that probability mass/density integrates or sums to one over support.",
  ),
  expectation_ml: detail(
    "Expectations define target risk, moments, and average behavior under uncertainty.",
    [
      "Expected loss minimization in supervised learning",
      "Moment matching in model calibration",
      "Monte Carlo estimators for intractable integrals",
    ],
    [
      "Assuming finite expectation without tail checks",
      "Confusing sample mean with guaranteed true mean",
      "Ignoring estimator variance",
    ],
    "Run multiple random seeds and report confidence bounds around sample estimates.",
  ),
  variance_ml: detail(
    "Variance quantifies estimator instability and prediction spread, critical for uncertainty-aware decisions.",
    [
      "Compare estimator robustness across models",
      "Construct confidence intervals and error bars",
      "Analyze stochastic optimization noise",
    ],
    [
      "Using biased variance formula unintentionally",
      "Ignoring heteroskedasticity across subgroups",
      "Assuming low variance implies low error",
    ],
    "Compute both train-time and test-time variance to separate noise from overfitting.",
  ),
  covariance_ml: detail(
    "Covariance matrices encode pairwise linear dependencies and drive Gaussian, PCA, and whitening methods.",
    [
      "Feature decorrelation and whitening",
      "Principal component extraction",
      "Portfolio-style risk modeling in finance ML",
    ],
    [
      "Interpreting covariance as scale-free correlation",
      "Ill-conditioned covariance estimates in small n, large d",
      "Ignoring robust estimators under outliers",
    ],
    "Standardize features and compare covariance with correlation to separate scale from dependency.",
  ),
  entropy: detail(
    "Entropy links uncertainty, coding length, and unpredictability in probabilistic modeling.",
    [
      "Decision tree split criteria",
      "Language model uncertainty diagnostics",
      "Exploration strategies in bandits and RL",
    ],
    [
      "Taking log of zero without smoothing",
      "Comparing entropy across incompatible supports",
      "Ignoring base of logarithm in units",
    ],
    "Ensure probabilities are normalized and clipped before entropy computations.",
  ),
  crossentropy: detail(
    "Cross-entropy is the practical objective for probabilistic classification and density estimation.",
    [
      "Train logistic and softmax classifiers",
      "Calibrate predictive probabilities",
      "Evaluate language models via perplexity",
    ],
    [
      "Using post-softmax probabilities with unstable logs",
      "Ignoring class imbalance weighting",
      "Reading low training loss as guaranteed calibration",
    ],
    "Use numerically stable log-sum-exp implementations and monitor calibration separately.",
  ),
  kl: detail(
    "KL divergence measures relative inefficiency and appears in variational methods, distillation, and distribution shift analysis.",
    [
      "Variational inference objectives",
      "Knowledge distillation between teacher and student",
      "Monitor training distribution drift",
    ],
    [
      "Swapping KL direction unintentionally",
      "Computing KL where supports do not overlap",
      "Interpreting KL as symmetric distance",
    ],
    "Confirm support overlap and explicitly state KL direction in experiments.",
  ),
  regularization: detail(
    "Regularization restricts effective model complexity, improving out-of-sample behavior.",
    [
      "Ridge/lasso regression pipelines",
      "Stabilize high-dimensional linear models",
      "Prevent overfitting in low-data regimes",
    ],
    [
      "Over-regularizing and underfitting signal",
      "Using one penalty strength for all feature scales",
      "Ignoring interaction with optimizer settings",
    ],
    "Track train/test gap while sweeping regularization strength on validation data.",
  ),
  biasvariance: detail(
    "Bias and variance expose why model complexity tuning is a balancing problem rather than monotonic improvement.",
    [
      "Model selection and capacity tuning",
      "Compare ensembles vs single models",
      "Design data collection strategy for error reduction",
    ],
    [
      "Attributing all error changes to variance",
      "Ignoring irreducible noise floor",
      "Selecting complexity using test set repeatedly",
    ],
    "Use cross-validation curves to locate complexity where validation error is minimized.",
  ),
  mle: detail(
    "MLE provides a unifying parameter estimation principle across many classical ML models.",
    [
      "Estimate linear/logistic regression parameters",
      "Fit probabilistic generative models",
      "Compare candidate models via likelihood criteria",
    ],
    [
      "Optimizing likelihood without regularization in small datasets",
      "Ignoring identifiability constraints",
      "Comparing non-nested models without normalized criteria",
    ],
    "Plot log-likelihood against iterations and verify convergence to stable maxima.",
  ),
  leastsquares: detail(
    "Least squares is projection-based estimation in Euclidean geometry and underlies many linear prediction pipelines.",
    [
      "Fit linear regressors for continuous targets",
      "Construct baseline forecasting models",
      "Calibrate sensor mappings with noisy observations",
    ],
    [
      "Ignoring leverage points and outliers",
      "Assuming homoskedastic residuals without checks",
      "Using normal equation blindly in ill-conditioned settings",
    ],
    "Check residual orthogonality X^T(y-Xw)≈0 and inspect residual plots.",
  ),
  normalequation: detail(
    "Normal equations encode first-order stationarity of least squares and give analytic solutions when matrices are well-conditioned.",
    [
      "Closed-form linear regression for moderate feature counts",
      "Educational derivation of projection geometry",
      "Reference solution to validate iterative solvers",
    ],
    [
      "Direct inversion of X^TX causing numerical instability",
      "Ignoring rank deficiency",
      "Using without feature scaling in badly conditioned data",
    ],
    "Prefer solving linear systems (or QR/SVD) over explicit matrix inverse.",
  ),
  pseudoinverse: detail(
    "Pseudoinverse extends inversion to rectangular/rank-deficient matrices using singular-value filtering.",
    [
      "Minimum-norm solution for underdetermined systems",
      "Stable least-squares solve under collinearity",
      "Recover coefficients in linear inverse problems",
    ],
    [
      "Amplifying noise through tiny singular values",
      "Confusing pseudoinverse solution with unique physical truth",
      "Ignoring tolerance threshold in rank determination",
    ],
    "Inspect singular spectrum and apply cutoff before inversion of small modes.",
  ),
  conditioning: detail(
    "Conditioning quantifies perturbation amplification and is central to numerical reliability in ML pipelines.",
    [
      "Diagnose instability of regression coefficients",
      "Predict sensitivity to measurement noise",
      "Guide preconditioning and regularization choices",
    ],
    [
      "Trusting high-precision outputs from ill-conditioned systems",
      "Ignoring unit scaling that worsens kappa",
      "Conflating model error with numerical error",
    ],
    "Report condition numbers of design or Hessian matrices in diagnostics.",
  ),
  featurescaling: detail(
    "Feature scaling normalizes coordinate magnitudes to improve optimization geometry and metric fairness.",
    [
      "Speed up gradient-based training",
      "Improve distance-based classifier behavior",
      "Balance regularization impact across features",
    ],
    [
      "Leaking test statistics into training transforms",
      "Assuming scaling is unnecessary for all optimizers",
      "Mixing incompatible scaling schemes across splits",
    ],
    "Fit scaling parameters on train split only, then reuse unchanged for validation/test.",
  ),
  mapestimation: detail(
    "MAP introduces prior structure into estimation and is equivalent to penalized optimization under log-priors.",
    [
      "Stabilize estimation in low-sample regimes",
      "Inject domain priors on parameter magnitudes",
      "Bridge Bayesian modeling with classical optimization",
    ],
    [
      "Using unrealistic priors without sensitivity analysis",
      "Treating MAP as full posterior inference",
      "Forgetting prior scale tuning",
    ],
    "Sweep prior strength and track posterior mode sensitivity.",
  ),
  kernels: detail(
    "Kernel methods lift linear algorithms to nonlinear decision boundaries via similarity functions.",
    [
      "Nonlinear SVM classification",
      "Kernel ridge regression",
      "Similarity-based anomaly detection",
    ],
    [
      "Using kernel hyperparameters without cross-validation",
      "Building dense kernel matrices too large for memory",
      "Interpreting kernel outputs as distances",
    ],
    "Validate kernel scale (e.g., gamma) with validation performance and decision boundary smoothness.",
  ),
  ridge: detail(
    "Ridge regularization shrinks parameters continuously and reduces variance under multicollinearity.",
    [
      "Stable regression with correlated predictors",
      "High-dimensional linear modeling",
      "Baseline regularized forecasting",
    ],
    [
      "Applying ridge without standardizing features",
      "Interpreting shrunk coefficients as unbiased effects",
      "Over-regularizing and missing signal",
    ],
    "Trace validation error over lambda and monitor coefficient norms.",
  ),
  lasso: detail(
    "Lasso combines shrinkage and feature selection through L1 geometry with sparse optima.",
    [
      "Sparse interpretable linear models",
      "Feature selection in wide datasets",
      "Compressed sensing-style recovery tasks",
    ],
    [
      "Unstable selection among highly correlated features",
      "Using single split for lambda selection",
      "Assuming zero coefficient implies irrelevance universally",
    ],
    "Use cross-validated regularization paths and stability checks over resamples.",
  ),
  elasticnet: detail(
    "Elastic net blends L1 sparsity with L2 stabilization, often outperforming pure lasso on correlated predictors.",
    [
      "Genomics/high-dimensional correlated features",
      "Balanced sparse yet stable linear models",
      "Regularized baselines in tabular ML",
    ],
    [
      "Not tuning L1/L2 mixing parameter",
      "Applying without standardized features",
      "Interpreting mixed penalty effects incorrectly",
    ],
    "Tune both alpha/mixing and overall strength on nested validation.",
  ),
  svmmargin: detail(
    "SVM learns a maximum-margin separator, yielding robust boundaries controlled by support vectors.",
    [
      "Binary classification with clear margins",
      "High-dimensional sparse text classification",
      "Kernelized nonlinear decision boundaries",
    ],
    [
      "Improper C or kernel scale hyperparameters",
      "Ignoring class imbalance in margin penalties",
      "Expecting probabilistic outputs without calibration",
    ],
    "Inspect margin width and support-vector fraction during tuning.",
  ),
  knn: detail(
    "k-NN is a non-parametric local method whose behavior is determined by geometry and neighborhood scale.",
    [
      "Simple tabular classification/regression baselines",
      "Instance-based recommendation prototypes",
      "Local anomaly scoring",
    ],
    [
      "No feature scaling with mixed units",
      "Large k oversmoothing local structure",
      "Using in very high dimensions without metric learning",
    ],
    "Run k-sweep curves and inspect neighborhood label purity.",
  ),
  kmeans: detail(
    "k-Means performs hard-cluster assignment with centroid updates and minimizes within-cluster inertia.",
    [
      "Customer or document segmentation",
      "Prototype compression before downstream modeling",
      "Initialization for mixture models",
    ],
    [
      "Assuming globular clusters when data are anisotropic",
      "Sensitivity to random initialization",
      "Using inappropriate k without diagnostics",
    ],
    "Use multiple restarts and compare inertia plus silhouette trends.",
  ),
  gmm: detail(
    "Gaussian mixtures model multimodal densities with probabilistic cluster memberships and covariance structure.",
    [
      "Soft clustering and density estimation",
      "Anomaly detection via low mixture likelihood",
      "Latent component modeling in heterogeneous data",
    ],
    [
      "Overfitting with too many components",
      "Singular covariance estimates",
      "Ignoring initialization dependence",
    ],
    "Monitor component collapse and compare AIC/BIC across component counts.",
  ),
  em: detail(
    "EM alternates latent expectation and parameter maximization, improving likelihood monotonically under mild conditions.",
    [
      "Fit mixture models with hidden assignments",
      "Missing-data parameter estimation",
      "Latent variable model training",
    ],
    [
      "Confusing monotonic increase with global optimum",
      "Poor initialization causing bad local optima",
      "Stopping too early on flat likelihood increments",
    ],
    "Track log-likelihood every iteration and use multiple initializations.",
  ),
  naivebayes: detail(
    "Naive Bayes is a fast generative approach using class-conditional feature models and Bayes rule.",
    [
      "Text/spam classification with bag-of-words features",
      "High-dimensional sparse baseline models",
      "Low-latency probabilistic classification",
    ],
    [
      "Zero probabilities without smoothing",
      "Strong feature dependence violating naive assumption",
      "Miscalibrated probability outputs",
    ],
    "Enable Laplace smoothing and validate calibration separately from accuracy.",
  ),
};

export const CONCEPT_EXPANSIONS = {
  vectors: expansion(
    "Vector spaces obey closure under addition and scalar multiplication, allowing linear combinations and basis representations.",
    "Center/scale features, inspect norms, and check pairwise angles to understand geometry before model fitting.",
    "A document embedding with similar topic points in the same direction despite different magnitudes.",
    ["Dot Product", "Projection", "PCA"],
  ),
  dotproduct: expansion(
    "Dot product is a bilinear form inducing Euclidean geometry and projections.",
    "Compute w.x in batches, normalize if cosine similarity is intended, and monitor score distributions.",
    "Two recommendation vectors with cosine 0.95 are likely semantically similar.",
    ["Vectors", "Cosine Similarity", "Attention"],
  ),
  norms: expansion(
    "Norm axioms guarantee non-negativity, homogeneity, and triangle inequality, defining metric structure.",
    "Compare L1 and L2 penalties under the same pipeline and inspect coefficient sparsity.",
    "L1-regularized model sets many weights exactly to zero while L2 keeps small dense weights.",
    ["Regularization", "Optimization", "Robustness"],
  ),
  projection: expansion(
    "Orthogonal projection solves a constrained minimization problem in Hilbert space.",
    "Build projection matrix P = X(X^TX)^-1X^T and verify idempotence P^2≈P.",
    "Least squares fitted values equal projection of y onto span(X).",
    ["Least Squares", "PCA", "Orthogonality"],
  ),
  matrixmultiply: expansion(
    "Matrix multiplication composes linear operators and corresponds to basis-coordinate contractions.",
    "Track tensor shapes layer by layer and use BLAS-optimized routines.",
    "A preprocessing transform followed by a classifier equals one composed matrix in linear settings.",
    ["Linear Models", "Neural Layers", "SVD"],
  ),
  rank: expansion(
    "Rank-nullity links retained information and lost dimensions.",
    "Estimate effective rank via singular value thresholding under noise.",
    "A near-rank-1 image matrix is well-approximated by one outer product.",
    ["SVD", "Compression", "Identifiability"],
  ),
  eigenspectrum: expansion(
    "Spectral decomposition diagonalizes operators in eigenbases when conditions allow.",
    "Compute dominant eigenpairs with power iteration for large sparse matrices.",
    "Covariance top eigenvector captures principal direction of spread.",
    ["PCA", "Stability", "Hessian Analysis"],
  ),
  svd: expansion(
    "SVD exists for every matrix and reveals orthogonal mode decomposition.",
    "Use truncated SVD and compare reconstruction error vs retained components.",
    "Top-50 singular vectors compress a large sparse term-document matrix.",
    ["Rank", "PCA", "Conditioning"],
  ),
  pca: expansion(
    "PCA solves an eigenproblem of covariance and maximizes projected variance.",
    "Center data, compute covariance or SVD directly, then project onto top components.",
    "Two principal components capture most signal in a highly correlated sensor dataset.",
    ["Covariance", "SVD", "Dimensionality Reduction"],
  ),
  derivative: expansion(
    "Derivative is the linear functional approximating local change.",
    "Check analytic gradients against finite differences at random points.",
    "The slope near x=2 predicts small output change for tiny perturbations.",
    ["Gradient", "Taylor Expansion", "Optimization"],
  ),
  gradient: expansion(
    "Gradient is the Riesz representation of directional derivatives under Euclidean inner product.",
    "Compute batch gradients and optionally clip norms in unstable regimes.",
    "Negative gradient step reduces logistic loss for current minibatch.",
    ["Gradient Descent", "Jacobian", "Hessian"],
  ),
  jacobian: expansion(
    "Jacobian is the best linear approximation of vector-valued maps near a point.",
    "Use automatic differentiation JVP/VJP primitives for efficiency.",
    "Small sensor perturbations mapped through a calibration function are predicted by JΔx.",
    ["Chain Rule", "Conditioning", "Inverse Problems"],
  ),
  hessian: expansion(
    "Hessian defines local quadratic model used in second-order methods.",
    "Approximate Hessian-vector products instead of full matrix when d is large.",
    "Positive Hessian eigenvalues near optimum indicate bowl-like local geometry.",
    ["Convexity", "Newton Method", "Curvature"],
  ),
  convexity: expansion(
    "Convex analysis offers duality and global optimality results critical in classical ML.",
    "Verify convexity by Hessian PSD checks where differentiable.",
    "Ridge regression objective is convex and has a unique global minimum.",
    ["Optimization Guarantees", "Regularization", "Dual Methods"],
  ),
  gradientdescent: expansion(
    "Gradient descent is explicit Euler discretization of gradient flow.",
    "Tune step size with line search or schedule and monitor monotonic decrease.",
    "On a quadratic bowl, properly chosen eta yields geometric convergence.",
    ["Convexity", "Conditioning", "Momentum"],
  ),
  randomvariable_ml: expansion(
    "Random variables induce distributions that support expectation, variance, and likelihood analysis.",
    "Specify support, parameterization, and sampling method before inference.",
    "Binary labels modeled as Bernoulli random variables with unknown probability.",
    ["Expectation", "Variance", "Likelihood"],
  ),
  expectation_ml: expansion(
    "Expectation is a linear operator over integrable functions.",
    "Estimate expectation with Monte Carlo and track estimator standard error.",
    "Expected loss over data distribution defines generalization objective.",
    ["Risk Minimization", "LLN", "CLT"],
  ),
  variance_ml: expansion(
    "Variance is second central moment and governs concentration behavior.",
    "Compute variance across folds/runs to quantify stability.",
    "Two models with same mean error can differ sharply in variance.",
    ["Bias-Variance", "Confidence Intervals", "Uncertainty"],
  ),
  covariance_ml: expansion(
    "Covariance is bilinear and forms PSD covariance matrices for random vectors.",
    "Estimate covariance with shrinkage in high-dimensional small-sample settings.",
    "Covariance matrix eigenvectors define PCA axes.",
    ["PCA", "Gaussian Models", "Correlation"],
  ),
  entropy: expansion(
    "Entropy is expected self-information under a distribution.",
    "Compute entropy after smoothing tiny probabilities.",
    "Uniform class distribution has higher entropy than near-deterministic labels.",
    ["Cross-Entropy", "KL Divergence", "Coding Theory"],
  ),
  crossentropy: expansion(
    "Cross-entropy is expected negative log-likelihood under target distribution.",
    "Use logits directly in numerically stable loss implementations.",
    "Softmax classifier minimizes cross-entropy to increase true-class probability.",
    ["MLE", "KL Divergence", "Calibration"],
  ),
  kl: expansion(
    "KL is a Bregman divergence for log-partition families and measures relative entropy.",
    "Evaluate KL with consistent support and smoothing conventions.",
    "Variational objectives minimize KL between approximate and true posterior families.",
    ["Cross-Entropy", "Bayesian Inference", "Distillation"],
  ),
  regularization: expansion(
    "Regularization adds inductive bias by shrinking hypothesis space.",
    "Tune lambda on validation data and inspect coefficient/decision-boundary smoothness.",
    "Ridge penalty stabilizes coefficients under multicollinearity.",
    ["Norms", "Bias-Variance", "Generalization"],
  ),
  biasvariance: expansion(
    "Expected prediction error decomposes into estimable components under repeated sampling.",
    "Sweep model capacity and data size to isolate bias and variance regimes.",
    "Bagging reduces variance without changing base learner bias much.",
    ["Regularization", "Ensembles", "Model Selection"],
  ),
  mle: expansion(
    "MLE is equivalent to minimizing empirical negative log-likelihood.",
    "Optimize log-likelihood with gradient methods and regularizers when needed.",
    "Logistic regression is Bernoulli MLE with linear-logit parameterization.",
    ["Cross-Entropy", "Probability Models", "Optimization"],
  ),
  leastsquares: expansion(
    "Least squares solves orthogonal projection of targets onto feature span.",
    "Compute residuals, verify orthogonality, and compare train/validation RMSE.",
    "Projected target vector gives best linear approximation in L2 sense.",
    ["Projection", "Normal Equation", "Pseudoinverse"],
  ),
  normalequation: expansion(
    "Setting gradient to zero yields linear normal equations.",
    "Solve X^TXw=X^Ty with stable factorizations instead of inversion.",
    "Closed-form fit for small-medium d validates iterative solvers.",
    ["Least Squares", "Condition Number", "Ridge"],
  ),
  pseudoinverse: expansion(
    "Pseudoinverse is SVD-based generalized inverse with minimum-norm property.",
    "Form X=UΣV^T then invert nonzero singular values with tolerance.",
    "Rank-deficient regression still yields stable minimum-norm coefficients.",
    ["SVD", "Least Squares", "Conditioning"],
  ),
  conditioning: expansion(
    "Perturbation bounds scale with condition number in linear systems.",
    "Estimate kappa from singular values and apply preconditioning/regularization.",
    "Tiny label noise causes large coefficient drift when kappa is huge.",
    ["SVD", "Feature Scaling", "Ridge"],
  ),
  featurescaling: expansion(
    "Scaling changes coordinate metric and effective curvature seen by optimizers.",
    "Standardize training features and reuse transform for all evaluation splits.",
    "Gradient descent converges faster on scaled logistic regression features.",
    ["Gradient Descent", "Conditioning", "k-NN"],
  ),
  mapestimation: expansion(
    "MAP is posterior-mode estimation and equals penalized likelihood under log-priors.",
    "Add log-prior term to objective and optimize with gradient methods.",
    "Gaussian prior turns MAP into ridge-like objective.",
    ["MLE", "Regularization", "Bayesian Inference"],
  ),
  kernels: expansion(
    "Kernel methods evaluate inner products in implicit Hilbert spaces.",
    "Build kernel matrix K and solve dual optimization/problem-specific system.",
    "RBF kernel separates nonlinear moon-shaped classes.",
    ["Dot Product", "SVM Margin", "Ridge"],
  ),
  ridge: expansion(
    "Ridge adds isotropic quadratic penalty and improves Hessian conditioning.",
    "Tune lambda on validation and monitor coefficient shrinkage.",
    "Ill-conditioned linear regression becomes stable after ridge regularization.",
    ["Regularization", "Conditioning", "Bias-Variance"],
  ),
  lasso: expansion(
    "Lasso objective is convex but non-smooth, encouraging sparse optima at corners.",
    "Use coordinate descent/proximal methods and inspect coefficient path.",
    "Many irrelevant features are exactly zeroed in sparse recovery tasks.",
    ["Regularization", "Elastic Net", "Feature Selection"],
  ),
  elasticnet: expansion(
    "Elastic net mixes L1 sparsity with L2 grouping and stabilization.",
    "Grid-search alpha and lambda jointly with cross-validation.",
    "Correlated feature groups remain selected more consistently than lasso.",
    ["Ridge", "Lasso", "Bias-Variance"],
  ),
  svmmargin: expansion(
    "SVM maximizes geometric margin under hinge-loss constraints.",
    "Tune C/kernel parameters and inspect support-vector counts.",
    "Only boundary-critical points control final classifier.",
    ["Kernels", "Regularization", "Convexity"],
  ),
  knn: expansion(
    "k-NN estimates local decision function from neighborhood votes/averages.",
    "Choose distance metric and k via validation error curves.",
    "Decision boundary complexity decreases as k increases.",
    ["Norms", "Feature Scaling", "Bias-Variance"],
  ),
  kmeans: expansion(
    "k-Means alternates Voronoi assignment and centroid updates.",
    "Run multiple random initializations and compare inertia statistics.",
    "Centroids converge to local minima of within-cluster sum of squares.",
    ["Variance", "EM", "Gaussian Mixtures"],
  ),
  gmm: expansion(
    "GMM represents density as mixture of Gaussian components with latent labels.",
    "Estimate responsibilities and covariance-aware component updates via EM.",
    "Overlapping clusters are captured by soft membership probabilities.",
    ["EM", "Covariance", "Likelihood"],
  ),
  em: expansion(
    "EM optimizes latent-variable likelihood through coordinate ascent on lower bound.",
    "Iterate E-step responsibilities then M-step parameter updates until convergence.",
    "Likelihood improves each iteration for Gaussian mixture fitting.",
    ["GMM", "MLE", "MAP"],
  ),
  naivebayes: expansion(
    "Naive Bayes factorizes class-conditional likelihood across features.",
    "Estimate class priors and smoothed conditional probabilities from counts.",
    "Text classification remains strong despite independence simplification.",
    ["Bayes Rule", "MAP", "Probability Models"],
  ),
};
