export const EXPLANATIONS = {
  vectors: {
    what: "Vectors are ordered numbers representing points or directions in feature space. In ML, a sample, parameter set, or embedding is a vector.",
    visual:
      "Picture each sample as an arrow from the origin. Direction encodes pattern, length encodes intensity. Nearby arrows imply similar inputs.",
    intuition: [
      "Feature engineering defines the coordinate axes",
      "Vector arithmetic moves through hypothesis or data space",
      "Cosine similarity compares direction independent of scale",
      "High dimensions are hard to see, but linear algebra rules remain identical",
      "The curse of dimensionality makes Euclidean distances less meaningful as dimension grows",
    ],
    formula: "x in R^d,  ||x||_2 = sqrt(sum_i x_i^2)",
  },
  dotproduct: {
    what: "The dot product measures alignment between vectors and equals a weighted sum. It powers linear models, kernels, and attention scores.",
    visual:
      "Two arrows form an angle. As they align, the dot product grows; as they become orthogonal, it goes to zero; opposite directions make it negative.",
    intuition: [
      "Dot product is projection times length",
      "In linear models, w.x is the raw score before thresholding",
      "In retrieval and embeddings, dot product ranks similarity",
      "Orthogonality means no linear interaction under that basis",
      "In attention mechanisms, dot products are scaled by 1/√d to prevent softmax saturation",
    ],
    formula: "x.y = sum_i x_i y_i = ||x|| ||y|| cos(theta)",
  },
  norms: {
    what: "Norms quantify vector size. Different norms induce different geometry and strongly affect optimization and regularization behavior.",
    visual:
      "L2 unit balls are circles, L1 balls are diamonds, Linf balls are squares. Constraint shape determines where optima prefer to land.",
    intuition: [
      "L2 spreads penalty smoothly across weights",
      "L1 creates corners, encouraging sparse solutions",
      "Distance metrics define neighborhood structure in algorithms",
      "Scale-sensitive features can dominate norm-based objectives",
      "Lp norms interpolate between L1 (sparsity-promoting) and L∞ (max-component) as p varies",
    ],
    formula: "||x||_p = (sum_i |x_i|^p)^(1/p)",
  },
  projection: {
    what: "Projection maps a vector onto a subspace, producing the closest point in that subspace under L2 distance.",
    visual:
      "Drop a perpendicular from a point to a line or plane. The foot of that drop is the projected approximation.",
    intuition: [
      "Least squares is projection onto column space",
      "Residual error is orthogonal to the fitted subspace",
      "Projection decomposes data into explained plus unexplained parts",
      "PCA is repeated projection onto principal directions",
      "Gram-Schmidt orthogonalization applies sequential projections to build an orthonormal basis",
    ],
    formula: "proj_u(v) = (u^T v / u^T u)u",
  },
  matrixmultiply: {
    what: "Matrix multiplication composes linear maps. It describes chaining transformations, layers, and coordinate changes.",
    visual:
      "A shape is transformed by B, then by A. The final shape is AB acting once, showing how composition combines effects.",
    intuition: [
      "Columns of AB are A applied to columns of B",
      "Order matters: AB and BA usually differ",
      "Affine models use matrix multiply plus bias",
      "Batch computation is parallel matrix multiplication",
      "Batched matrix multiplication is the core throughput bottleneck in modern GPU training",
    ],
    formula: "(AB)_ij = sum_k A_ik B_kj",
  },
  rank: {
    what: "Rank is the number of independent output directions a matrix can produce. It measures information-preserving capacity.",
    visual:
      "A 2D sheet can stay a sheet (full rank), collapse to a line (rank 1), or collapse to a point (rank 0).",
    intuition: [
      "Low-rank maps compress structure",
      "Rank deficiency implies non-unique solutions",
      "Effective rank often matters more than nominal rank in noisy data",
      "Bottleneck layers intentionally impose low-rank behavior",
      "Effective rank under noise is lower than nominal rank — near-zero singular values should be thresholded",
    ],
    formula: "rank(A) = dim(Col(A)) = number of pivots",
  },
  eigenspectrum: {
    what: "Eigenvalues and eigenvectors reveal invariant directions and scaling strengths of linear operators.",
    visual:
      "Most arrows rotate and stretch, but special directions remain on their own lines. Their scale factors are eigenvalues.",
    intuition: [
      "Large magnitude eigenvalues correspond to dominant modes",
      "Sign of eigenvalues indicates direction flips",
      "Spectral radius governs iterative stability",
      "Covariance eigenvectors capture principal variability axes",
      "Power iteration computes the dominant eigenvector by repeatedly multiplying and normalizing",
    ],
    formula: "Av = lambda v,  det(A - lambda I) = 0",
  },
  svd: {
    what: "SVD factorizes any matrix into orthogonal rotations and axis-aligned scaling. It is central to compression and denoising.",
    visual:
      "A sphere becomes an ellipsoid through rotate-stretch-rotate. Singular values are the ellipsoid axis lengths.",
    intuition: [
      "Singular values are ordered importance scores",
      "Truncation gives optimal low-rank approximation",
      "Conditioning is tied to singular value spread",
      "Many recommenders and NLP models rely on SVD ideas",
      "Eckart-Young theorem: truncated SVD gives the optimal low-rank approximation minimizing Frobenius error",
    ],
    formula: "A = U Sigma V^T",
  },
  pca: {
    what: "PCA finds orthogonal directions maximizing variance and projects data onto them for compact representation.",
    visual:
      "A tilted cloud is rotated so its longest spread aligns with the first axis, then optionally flattened to fewer axes.",
    intuition: [
      "PCA decorrelates under centered data",
      "Explained variance quantifies retained signal",
      "Principal components are covariance eigenvectors",
      "Scaling features changes PCA directions significantly",
      "Kernel PCA applies PCA in an implicit high-dimensional feature space to capture nonlinear structure",
    ],
    formula: "maximize v^T S v subject to ||v||=1",
  },
  derivative: {
    what: "A derivative is local sensitivity: how fast output changes with a tiny change in input.",
    visual:
      "On a curve, zoom in near a point until it looks linear. The tangent slope is the derivative there.",
    intuition: [
      "Derivative sign shows increasing vs decreasing",
      "Large magnitude slope means strong sensitivity",
      "Linearization is first-order approximation",
      "Finite differences approximate derivatives numerically",
      "Automatic differentiation (forward and reverse modes) computes exact derivatives to machine precision",
    ],
    formula: "f'(x) = lim_{h->0} (f(x+h)-f(x))/h",
  },
  gradient: {
    what: "The gradient stacks partial derivatives and points toward steepest local increase of a scalar function.",
    visual:
      "On contour lines, the gradient arrow is perpendicular to contours and points uphill.",
    intuition: [
      "Negative gradient is steepest local decrease",
      "Gradient norm indicates step aggressiveness needs",
      "Chain rule propagates gradients through pipelines",
      "Feature scaling alters gradient geometry",
      "Gradient clipping caps update magnitude to prevent exploding gradients in deep or recurrent networks",
    ],
    formula: "nabla f(x) = [df/dx1, ..., df/dxd]^T",
  },
  jacobian: {
    what: "The Jacobian is the first-order derivative matrix for vector-valued functions. It maps small input perturbations to output perturbations.",
    visual:
      "A tiny circle in input space becomes an ellipse in output space according to the local linear map set by the Jacobian.",
    intuition: [
      "Rows correspond to output sensitivities",
      "Jacobian determinant gives local area/volume scaling",
      "Conditioning of Jacobian affects inverse problems",
      "Backprop uses chained Jacobian-vector products",
      "Jacobian-vector products (JVPs) and vector-Jacobian products (VJPs) enable efficient automatic differentiation",
    ],
    formula: "J_ij = dfi/dxj",
  },
  hessian: {
    what: "The Hessian collects second derivatives and describes local curvature of scalar objectives.",
    visual:
      "A bowl, ridge, or saddle is identified by curvature along different directions around a point.",
    intuition: [
      "Positive definite Hessian implies local minimum",
      "Eigenvalues indicate curvature strength and sign",
      "Newton-type methods use Hessian information",
      "Ill-conditioned Hessians make optimization stiff",
      "Fisher information matrix equals the expected Hessian of negative log-likelihood at true parameters",
    ],
    formula: "H_ij = d^2f/(dxi dxj)",
  },
  convexity: {
    what: "A function is convex if line segments between points lie above the graph. Convex objectives avoid spurious local minima.",
    visual:
      "Any chord between two points on the curve stays above the curve itself.",
    intuition: [
      "Convex + differentiable gives global guarantees",
      "Strong convexity improves convergence rates",
      "Many losses are convex in linear models",
      "Deep networks are generally non-convex",
      "Legendre-Fenchel conjugate duality exploits convex structure for efficient dual-form optimization",
    ],
    formula: "f(tx+(1-t)y) <= t f(x)+(1-t)f(y)",
  },
  gradientdescent: {
    what: "Gradient descent iteratively updates parameters opposite the gradient to minimize objective values.",
    visual:
      "A particle rolls downhill on a loss surface with step size controlling progress and stability.",
    intuition: [
      "Too large step size diverges",
      "Too small step size is slow",
      "Curvature mismatch causes zig-zag motion",
      "Preconditioning and momentum improve trajectory",
      "Momentum methods add a velocity term to smooth oscillations in steep-walled ravine-shaped loss surfaces",
    ],
    formula: "w_{t+1} = w_t - eta nabla L(w_t)",
  },
  randomvariable_ml: {
    what: "A random variable maps uncertain outcomes to numbers, enabling statistical modeling and expectation-based objectives.",
    visual:
      "Outcomes on an experiment wheel map to numeric values with associated probabilities.",
    intuition: [
      "Model outputs are often treated as random variables",
      "Data generation assumptions begin with random variables",
      "Distribution choice controls tail behavior",
      "Sampling estimates random-variable properties",
      "Reparameterization trick separates randomness from parameters to enable gradient flow through stochastic samples",
    ],
    formula: "X: Omega -> R",
  },
  expectation_ml: {
    what: "Expectation is the probability-weighted average and serves as the target quantity for many risk minimization objectives.",
    visual:
      "A balance beam settles at a center determined by weighted masses on outcomes.",
    intuition: [
      "Empirical mean approximates expectation",
      "Expected loss defines statistical risk",
      "Linearity of expectation simplifies analysis",
      "Expectation does not imply likely single outcome",
      "REINFORCE algorithm estimates policy gradients as an expectation of reward times log-probability",
    ],
    formula: "E[X] = sum_x x p(x) or integral x p(x) dx",
  },
  variance_ml: {
    what: "Variance measures dispersion around expectation and quantifies instability or noise in estimates.",
    visual:
      "Narrow clusters have low variance; wide clouds have high variance.",
    intuition: [
      "Variance controls confidence interval width",
      "High-variance estimators overreact to sample noise",
      "Bias-variance decomposition guides model selection",
      "Regularization can reduce variance at some bias cost",
      "Control variates and importance sampling reduce Monte Carlo variance in stochastic optimization",
    ],
    formula: "Var(X) = E[(X-E[X])^2]",
  },
  covariance_ml: {
    what: "Covariance measures joint linear co-movement of two variables and is foundational for PCA and Gaussian models.",
    visual:
      "A tilted ellipse in scatter space signals positive or negative co-variation between axes.",
    intuition: [
      "Covariance sign gives direction of co-movement",
      "Magnitude depends on units",
      "Covariance matrix captures multivariate structure",
      "Diagonalization reveals independent principal modes",
      "Ledoit-Wolf shrinkage regularizes ill-conditioned covariance estimates in high-dimensional small-sample settings",
    ],
    formula: "Cov(X,Y)=E[(X-E[X])(Y-E[Y])]",
  },
  entropy: {
    what: "Entropy quantifies uncertainty in a distribution and average information content per observation.",
    visual:
      "Flat distributions look more uncertain than peaked ones and therefore have larger entropy.",
    intuition: [
      "Higher entropy means less predictability",
      "Deterministic outcomes have zero entropy",
      "Entropy underpins coding and compression limits",
      "Max-entropy principles guide modeling assumptions",
      "Maximum entropy principle: among all distributions satisfying constraints, choose the one with highest entropy",
    ],
    formula: "H(p) = -sum_i p_i log p_i",
  },
  crossentropy: {
    what: "Cross-entropy measures expected coding cost when data from p is encoded using model q. It is the standard classification loss.",
    visual:
      "Probability mass assigned away from the true class increases penalty sharply.",
    intuition: [
      "Cross-entropy = entropy + KL",
      "Confident wrong predictions are heavily penalized",
      "Softmax outputs pair naturally with cross-entropy",
      "Class imbalance needs weighting or calibration",
      "Label smoothing replaces one-hot targets with soft targets to improve calibration and generalization",
    ],
    formula: "H(p,q) = -sum_i p_i log q_i",
  },
  kl: {
    what: "KL divergence quantifies extra information cost when using q to represent p. It is asymmetric and non-negative.",
    visual:
      "Mismatched peaks and tails between two distributions create divergence mass.",
    intuition: [
      "KL(p||q) != KL(q||p)",
      "Zero only when distributions match exactly",
      "Appears in variational inference and distillation",
      "Direction choice changes training behavior",
      "Forward KL (inclusive divergence) covers all modes; reverse KL (exclusive) concentrates on a subset",
    ],
    formula: "KL(p||q)=sum_i p_i log(p_i/q_i)",
  },
  regularization: {
    what: "Regularization adds penalties or constraints to reduce overfitting and improve generalization.",
    visual:
      "As penalty strength rises, parameter vectors shrink and decision boundaries become smoother.",
    intuition: [
      "L2 spreads shrinkage across weights",
      "L1 drives exact sparsity",
      "Early stopping acts like implicit regularization",
      "Regularization trades fit quality for robustness",
      "Dropout provides implicit regularization approximating geometric averaging of exponentially many subnetworks",
    ],
    formula: "min_w L(w) + lambda R(w)",
  },
  biasvariance: {
    what: "Prediction error decomposes into bias, variance, and irreducible noise. Complexity shifts bias and variance in opposite directions.",
    visual:
      "A U-shaped test error curve appears as models move from underfit to overfit.",
    intuition: [
      "Simple models: high bias, low variance",
      "Complex models: low bias, high variance",
      "Validation curves locate practical sweet spots",
      "Data size increases mostly reduce variance",
      "Double descent phenomenon: test error can decrease again beyond the interpolation threshold as model grows",
    ],
    formula: "E[(y-yhat)^2] = bias^2 + variance + noise",
  },
  mle: {
    what: "Maximum likelihood estimates parameters that maximize probability of observed data under a model.",
    visual:
      "A likelihood curve over parameter values peaks at the best-fitting estimate.",
    intuition: [
      "Log-likelihood turns products into sums",
      "Many losses are negative log-likelihoods",
      "MLE is asymptotically efficient under regularity",
      "Misspecified models can produce biased MLE",
      "Cramér-Rao bound links Fisher information to the minimum variance achievable by any unbiased estimator",
    ],
    formula: "theta_hat = argmax_theta p(D|theta)",
  },
  leastsquares: {
    what: "Least squares finds parameters minimizing total squared residual error between predictions and targets.",
    visual:
      "Data points are projected onto a fitted line; vertical gaps are residuals whose squares are minimized.",
    intuition: [
      "Equivalent to orthogonal projection onto span of features",
      "Residuals are orthogonal to fitted column space",
      "Works even when exact interpolation is impossible",
      "Foundation for many linear model objectives",
      "Weighted least squares assigns different reliability to observations based on noise variance estimates",
    ],
    formula: "min_w ||Xw - y||_2^2",
  },
  normalequation: {
    what: "The normal equation is the first-order optimality condition of least squares.",
    visual:
      "Optimal weights occur where the residual vector is perpendicular to every feature direction.",
    intuition: [
      "Converts optimization into a linear system",
      "Useful when feature count is moderate",
      "Sensitive to ill-conditioning in X^T X",
      "Equivalent to projection geometry in closed form",
      "QR decomposition solves the normal equations more numerically stably than forming X^TX directly",
    ],
    formula: "X^T X w = X^T y",
  },
  pseudoinverse: {
    what: "The Moore-Penrose pseudoinverse generalizes matrix inversion to non-square or rank-deficient systems.",
    visual:
      "Directions supported by data are inverted; collapsed directions are safely handled by zeroing tiny modes.",
    intuition: [
      "Gives minimum-norm least-squares solution",
      "Computed robustly through SVD",
      "Handles underdetermined and overdetermined cases",
      "Core tool in numerical linear regression",
      "Moore-Penrose pseudoinverse satisfies four characterizing properties: AA⁺A=A, A⁺AA⁺=A⁺, both products are symmetric",
    ],
    formula: "w* = X^+ y",
  },
  conditioning: {
    what: "Condition number measures how strongly output or parameter estimates react to small input perturbations.",
    visual:
      "A nearly circular uncertainty ball becomes a highly stretched ellipse under ill-conditioned transforms.",
    intuition: [
      "Large kappa means unstable inverse problems",
      "Small noise can create large parameter changes",
      "Related to singular value ratio",
      "Scaling and regularization improve conditioning",
      "Regularization inflates small singular values, effectively improving the condition number of the system",
    ],
    formula: "kappa(A) = sigma_max / sigma_min",
  },
  featurescaling: {
    what: "Feature scaling rescales coordinates so optimization sees more isotropic geometry.",
    visual:
      "Long skinny contour ellipses become more circular after scaling, allowing larger stable steps.",
    intuition: [
      "Improves gradient-descent convergence speed",
      "Prevents dominant units from overshadowing others",
      "Critical for distance-based algorithms like k-NN",
      "Changes regularization fairness across features",
      "Batch normalization performs adaptive feature scaling as part of the network architecture itself",
    ],
    formula: "x_scaled = (x - mu)/sigma",
  },
  mapestimation: {
    what: "MAP combines likelihood with prior beliefs, selecting the most probable parameter under posterior density.",
    visual:
      "Posterior peak shifts between likelihood peak and prior preference depending on data strength.",
    intuition: [
      "MLE is MAP with uniform prior",
      "Gaussian prior induces L2-like shrinkage",
      "Adds stability in low-data regimes",
      "Balances data fit and prior structure",
      "As data grows, MAP estimates converge to MLE because the likelihood dominates the prior",
    ],
    formula: "theta_MAP = argmax_theta p(D|theta)p(theta)",
  },
  kernels: {
    what: "Kernel methods compute inner products in implicit feature spaces without explicit high-dimensional mapping.",
    visual:
      "Points nonlinearly inseparable in 2D become linearly separable after implicit feature lift.",
    intuition: [
      "Kernel matrix captures pairwise similarity",
      "RBF kernels create local influence neighborhoods",
      "Model complexity depends on support vectors",
      "Works with linear algorithms in dual form",
      "Mercer's theorem guarantees a kernel corresponds to an inner product iff the kernel matrix is positive semidefinite",
    ],
    formula: "k(x,z) = phi(x)^T phi(z)",
  },
  ridge: {
    what: "Ridge regression adds L2 penalty to least squares to reduce variance and stabilize coefficients.",
    visual:
      "Coefficient vector is pulled toward origin while preserving dense smooth solutions.",
    intuition: [
      "Useful under multicollinearity",
      "Trades small bias for lower variance",
      "Closed-form solution exists",
      "Improves conditioning of normal equations",
      "Ridge regression equals MAP estimation with a zero-mean isotropic Gaussian prior on coefficients",
    ],
    formula: "min_w ||Xw-y||_2^2 + lambda||w||_2^2",
  },
  lasso: {
    what: "Lasso adds L1 penalty, encouraging sparse models with automatic feature selection.",
    visual:
      "Optimization hits sharp corners of L1 geometry where many coefficients become exactly zero.",
    intuition: [
      "Promotes interpretability via sparsity",
      "Performs variable selection and shrinkage together",
      "Sensitive to correlated feature groups",
      "Often solved with coordinate descent",
      "LARS algorithm traces the full lasso regularization path efficiently using piecewise-linear updates",
    ],
    formula: "min_w ||Xw-y||_2^2 + lambda||w||_1",
  },
  elasticnet: {
    what: "Elastic Net combines L1 and L2 penalties to get both sparsity and grouped-feature stability.",
    visual:
      "Penalty geometry blends diamond and circle, reducing instability of pure lasso on correlated predictors.",
    intuition: [
      "Retains groups of correlated predictors better",
      "Interpolates ridge and lasso behavior",
      "Useful in high-dimensional sparse settings",
      "Regularization path smooths with L2 component",
      "Elastic net groups correlated predictors together better than lasso, which tends to select arbitrarily among them",
    ],
    formula: "min_w ||Xw-y||_2^2 + lambda1||w||_1 + lambda2||w||_2^2",
  },
  svmmargin: {
    what: "Support Vector Machines maximize geometric margin between classes while controlling classification errors.",
    visual:
      "The separating hyperplane is pushed to maximize distance to nearest opposite-class points.",
    intuition: [
      "Only support vectors determine boundary",
      "Larger margin often improves generalization",
      "Soft margin handles overlap/noise",
      "Kernel SVM creates nonlinear boundaries",
      "Dual SVM formulation expresses decisions only through kernel values at support vectors — enabling kernel trick",
    ],
    formula: "min_w 0.5||w||^2 + C sum_i xi_i",
  },
  knn: {
    what: "k-NN predicts from local neighborhoods in feature space using distance metrics.",
    visual:
      "A query point inherits label/value from closest nearby samples under chosen metric.",
    intuition: [
      "No parametric training phase",
      "Distance metric choice is critical",
      "Curse of dimensionality weakens locality",
      "Feature scaling strongly affects neighbors",
      "Approximate nearest neighbor methods (HNSW, LSH) scale k-NN to millions of points efficiently",
    ],
    formula: "y_hat(x) = majority/vote among k nearest points",
  },
  kmeans: {
    what: "k-Means partitions data into clusters by minimizing within-cluster squared distance to centroids.",
    visual:
      "Centroids move iteratively to centers of assigned point groups until assignments stabilize.",
    intuition: [
      "Alternates assignment and centroid update",
      "Finds spherical clusters best",
      "Initialization impacts final solution",
      "Objective is non-convex with local minima",
      "k-Means++ initialization selects centroids proportional to squared distance, improving solution quality",
    ],
    formula: "min sum_i ||x_i - mu_{c_i}||_2^2",
  },
  gmm: {
    what: "Gaussian Mixture Models represent data as weighted sum of Gaussian components with soft memberships.",
    visual:
      "Points are explained probabilistically by overlapping ellipsoidal density components.",
    intuition: [
      "Generalizes k-means to soft assignments",
      "Captures cluster covariance structure",
      "Can model anisotropic clusters",
      "Learned via EM iterations",
      "With diagonal covariance, GMM reduces parameters while still modeling multimodal data",
    ],
    formula: "p(x)=sum_k pi_k N(x|mu_k,Sigma_k)",
  },
  em: {
    what: "Expectation-Maximization alternates latent-variable expectation and parameter maximization steps.",
    visual:
      "Responsibilities are updated, then parameters shift to better match weighted assignments.",
    intuition: [
      "E-step computes soft assignments",
      "M-step updates parameters from expected sufficient stats",
      "Monotonically increases data likelihood",
      "Converges to local optima",
      "EM maximizes the evidence lower bound (ELBO) — same objective as variational inference",
    ],
    formula: "repeat: q(z)=p(z|x,theta), theta<-argmax E_q[log p(x,z|theta)]",
  },
  naivebayes: {
    what: "Naive Bayes is a generative classifier assuming conditional independence of features given class.",
    visual:
      "Each feature contributes additive evidence to class log-probability under independence factorization.",
    intuition: [
      "Fast and robust baseline for text data",
      "Works surprisingly well despite naive assumption",
      "Needs smoothing for unseen feature events",
      "Predicts with posterior class comparison",
      "Log-space computation and log-sum-exp trick prevent numerical underflow when combining many probabilities",
    ],
    formula: "p(y|x) proportional p(y) product_j p(x_j|y)",
  },
};
