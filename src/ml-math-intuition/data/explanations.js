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
    deepDive: [
      "A vector in R^d is a tuple of real numbers encoding a single observation or parameter configuration. The choice of coordinate system — the basis — is arbitrary; what matters geometrically is the relationships between vectors, not their raw coordinates.",
      "Two vectors x and y are orthogonal when their dot product is zero, meaning they share no linear overlap. Orthogonal feature directions provide independent information, which is why decorrelated representations are so useful in practice.",
      "$$\\\\mathbf{x} \\\\cdot \\\\mathbf{y} = \\\\sum_{i=1}^{d} x_i y_i = \\\\|\\\\mathbf{x}\\\\| \\\\|\\\\mathbf{y}\\\\| \\\\cos\\\\theta$$",
      "In high dimensions the volume of a unit ball concentrates near its surface, and most pairs of random unit vectors are nearly orthogonal. This is why neural network embeddings can pack an exponential number of nearly-orthogonal directions into a fixed-dimensional space.",
    ],
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
    deepDive: [
      "The dot product is the canonical inner product on R^d. Any positive-definite bilinear form can be used as a generalized inner product, which is exactly how Mahalanobis distance replaces the identity with a covariance matrix.",
      "Scaling queries and keys by 1/sqrt(d) in attention prevents the softmax from entering saturation where gradients vanish. This is because the variance of a dot product of two d-dimensional unit-variance vectors grows linearly with d.",
      "$$\\\\mathbf{q}^\\\\top \\\\mathbf{k} / \\\\sqrt{d} \\\\quad \\\\Rightarrow \\\\quad \\\\text{Var}\\\\left(\\\\frac{\\\\mathbf{q}^\\\\top \\\\mathbf{k}}{\\\\sqrt{d}}\\\\right) = 1 \\\\text{ when each component has unit variance}$$",
      "Kernelized models replace explicit dot products with kernel evaluations k(x,z), effectively computing inner products in very high or infinite-dimensional feature spaces without ever materializing those feature vectors.",
    ],
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
    deepDive: [
      "The Lp norm family unifies many useful geometries. As p decreases toward 1 the unit ball grows sharper corners, placing mass on axes and inducing sparsity at optima. As p increases toward infinity the ball becomes a hypercube and only the largest component matters.",
      "Sparsity from L1 emerges from geometry: the optimal solution of a linear program over an L1 ball lands on a vertex, which is a coordinate-axis point with at most one nonzero entry. For smooth objectives the argument extends via subdifferential analysis.",
      "$$\\\\|\\\\mathbf{x}\\\\|_p = \\\\left(\\\\sum_{i=1}^d |x_i|^p\\\\right)^{1/p}, \\\\quad \\\\|\\\\mathbf{x}\\\\|_\\\\infty = \\\\max_i |x_i|$$",
      "The nuclear norm of a matrix — sum of singular values — is the matrix analogue of the L1 norm and serves as a convex surrogate for rank. It promotes low-rank solutions in matrix completion and collaborative filtering.",
    ],
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
    deepDive: [
      "The orthogonal projection of v onto a subspace spanned by columns of A is the unique vector in that subspace closest to v under Euclidean distance. Its residual v - Av_hat is orthogonal to every column of A, which is exactly the normal equation condition.",
      "The projection matrix P = A(A^T A)^{-1} A^T is idempotent (P^2 = P) and symmetric. These two properties characterize all orthogonal projections, and they imply that applying the projection twice has no additional effect.",
      "$$\\\\mathbf{P} = \\\\mathbf{A}(\\\\mathbf{A}^\\\\top \\\\mathbf{A})^{-1}\\\\mathbf{A}^\\\\top, \\\\quad \\\\mathbf{P}^2 = \\\\mathbf{P}, \\\\quad \\\\mathbf{P}^\\\\top = \\\\mathbf{P}$$",
      "The complementary projection I - P maps each vector to its residual, which lies in the orthogonal complement of the column space. This decomposition underpins the geometry of analysis of variance and the interpretation of R-squared as the ratio of projected to total variance.",
    ],
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
    deepDive: [
      "Matrix multiplication encodes function composition: if f(x) = Bx and g(y) = Ay, then g(f(x)) = ABx. This is why the correct order in neural networks is to list layer matrices from right to left when applying to an input column vector.",
      "The rank of a product AB is at most the minimum of rank(A) and rank(B). Each layer in a deep network can only preserve or reduce the dimension of the information it processes, never increase it beyond its own rank.",
      "$$(\\\\mathbf{AB})_{ij} = \\\\sum_{k=1}^{r} A_{ik} B_{kj}, \\\\quad \\\\text{rank}(\\\\mathbf{AB}) \\\\leq \\\\min(\\\\text{rank}(\\\\mathbf{A}),\\\\, \\\\text{rank}(\\\\mathbf{B}))$$",
      "Low-rank factorizations of weight matrices (writing W = UV^T with U in R^{m x r}, V in R^{n x r}, r << min(m,n)) reduce parameter count from mn to r(m+n) while preserving expressive capacity in the most important directions. This is the foundation of LoRA and related parameter-efficient fine-tuning methods.",
    ],
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
    deepDive: [
      "The four fundamental subspaces of a matrix A in R^{m x n} — column space, null space, row space, and left null space — have dimensions that satisfy the rank-nullity theorem: rank(A) + nullity(A) = n. This governs how many free variables appear in linear systems.",
      "Numerical rank requires a threshold: in floating point a matrix with a very small but nonzero singular value is treated as rank-deficient. The effective rank is the number of singular values above a tolerance proportional to machine precision times the largest singular value.",
      "$$\\\\text{rank}(\\\\mathbf{A}) + \\\\dim(\\\\ker(\\\\mathbf{A})) = n, \\\\quad \\\\text{effective rank} = |\\\\{i : \\\\sigma_i > \\\\epsilon \\\\cdot \\\\sigma_1\\\\}|$$",
      "Low-rank matrix completion — recovering a full matrix from a subset of entries — is possible when the matrix is incoherent and the observed entries are chosen randomly. The nuclear-norm relaxation makes this a tractable convex program, enabling collaborative filtering at scale.",
    ],
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
    deepDive: [
      "For a real symmetric matrix all eigenvalues are real and eigenvectors corresponding to distinct eigenvalues are orthogonal. The spectral theorem guarantees diagonalization A = Q Lambda Q^T, which is why covariance matrices and kernel matrices have clean eigendecompositions.",
      "The spectral radius rho(A) = max |lambda_i| controls convergence of iterative methods such as Jacobi or Gauss-Seidel: iteration converges if and only if rho < 1. Similarly, the condition number kappa = sigma_max / sigma_min governs numerical stability.",
      "$$\\\\mathbf{A} = \\\\mathbf{Q} \\\\mathbf{\\\\Lambda} \\\\mathbf{Q}^\\\\top = \\\\sum_{i=1}^n \\\\lambda_i \\\\mathbf{q}_i \\\\mathbf{q}_i^\\\\top$$",
      "The Perron-Frobenius theorem guarantees that a matrix with all positive entries has a unique dominant real eigenvalue with a positive eigenvector. PageRank exploits this: the stationary distribution of a web graph is the dominant eigenvector of a stochastic transition matrix.",
    ],
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
    deepDive: [
      "Every matrix A in R^{m x n} admits an SVD: A = U Sigma V^T where U in R^{m x m} and V in R^{n x n} are orthogonal and Sigma is diagonal with non-negative entries sigma_1 >= sigma_2 >= ... >= 0. The singular values are unique; left and right singular vectors are unique up to sign and multiplicity.",
      "The Eckart-Young theorem states that truncating to the top r singular values gives the best rank-r approximation of A in both Frobenius and spectral norms. No other rank-r matrix is closer. This makes SVD the gold standard for dimensionality reduction when optimality is required.",
      "$$\\\\mathbf{A}_r = \\\\sum_{i=1}^{r} \\\\sigma_i \\\\mathbf{u}_i \\\\mathbf{v}_i^\\\\top = \\\\underset{\\\\text{rank}(\\\\mathbf{B}) \\\\leq r}{\\\\operatorname{argmin}} \\\\|\\\\mathbf{A} - \\\\mathbf{B}\\\\|_F$$",
      "Randomized SVD algorithms compute approximate top-r factorizations in O(mnr) time instead of O(mn min(m,n)) by projecting onto a random subspace first. This makes SVD practical for matrices with millions of rows, as used in large-scale recommendation systems.",
    ],
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
    deepDive: [
      "PCA solves a sequence of constrained optimization problems: find the direction v_1 of maximum variance, then v_2 orthogonal to v_1 with maximum remaining variance, and so on. The solution is the eigenvector decomposition of the sample covariance matrix S = (1/n) X^T X (for centered X).",
      "The fraction of variance explained by the top k components is the ratio of the sum of the top k eigenvalues to the total trace of S. Choosing k so that this fraction exceeds 0.95, for example, is a common heuristic for selecting dimensionality.",
      "$$\\\\text{Var explained}_k = \\\\frac{\\\\sum_{i=1}^k \\\\lambda_i}{\\\\sum_{i=1}^d \\\\lambda_i}, \\\\quad \\\\hat{\\\\mathbf{x}} = \\\\sum_{i=1}^k (\\\\mathbf{x}^\\\\top \\\\mathbf{v}_i)\\\\mathbf{v}_i$$",
      "Via the duality between SVD and eigendecomposition, PCA can be computed as a thin SVD of the centered data matrix X = U Sigma V^T: the principal components are columns of V, the scores are columns of U Sigma, and singular values relate to eigenvalues by lambda_i = sigma_i^2 / n.",
    ],
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
    deepDive: [
      "The derivative is the unique linear map L such that f(x+h) = f(x) + L(h) + o(h) as h -> 0. This first-order Taylor expansion is the foundation for all gradient-based optimization: locally, every smooth function looks linear, and we exploit that linearity to find descent directions.",
      "Reverse-mode automatic differentiation (backpropagation) computes the gradient of a scalar output with respect to all inputs in a single backward pass, costing O(1) times the forward pass regardless of input dimension. This is why training neural networks with millions of parameters is feasible.",
      "$$f(x + h) = f(x) + f'(x)\\\\,h + \\\\frac{f''(x)}{2}h^2 + O(h^3)$$",
      "Higher-order derivatives capture curvature and interaction effects but are expensive to compute. Newton's method uses the second derivative (or Hessian) to perform curvature-corrected steps, achieving quadratic convergence near optima at the cost of computing and inverting the Hessian.",
    ],
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
    deepDive: [
      "The gradient is the unique vector such that the directional derivative of f at x in direction d is nabla f(x)^T d. The steepest ascent direction is exactly the gradient itself; steepest descent is its negation. This geometric characterization makes the gradient the natural update direction.",
      "The chain rule for gradients says: if L = g(f(x)) then nabla_x L = J_f(x)^T nabla_{f(x)} g, where J_f is the Jacobian of f. Backpropagation is a systematic application of this rule through a computation graph, processing nodes in reverse topological order.",
      "$$\\\\nabla_\\\\mathbf{x} L = \\\\mathbf{J}_f(\\\\mathbf{x})^\\\\top \\\\nabla_{f(\\\\mathbf{x})} g, \\\\quad \\\\frac{\\\\partial L}{\\\\partial x_i} = \\\\sum_j \\\\frac{\\\\partial L}{\\\\partial f_j} \\\\frac{\\\\partial f_j}{\\\\partial x_i}$$",
      "Natural gradient descent replaces the Euclidean gradient with the Fisher-information-weighted gradient, correcting for the curvature of the parameter space. This is equivalent to steepest descent in the space of distributions rather than parameters, and underlies second-order optimization methods like K-FAC.",
    ],
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
    deepDive: [
      "The Jacobian J of f: R^n -> R^m at x is the m x n matrix of partial derivatives. The chain rule for Jacobians is J_{g circ f}(x) = J_g(f(x)) J_f(x), which is simply matrix multiplication. Backpropagation computes left-multiplications by Jacobian transposes (VJPs) in sequence.",
      "The absolute value of the Jacobian determinant |det J| is the local volume scaling factor: a region of measure epsilon near x maps to a region of measure |det J| * epsilon near f(x). This appears in change-of-variables formulas for probability densities and is critical in normalizing flows.",
      "$$p_X(\\\\mathbf{x}) = p_Z(f^{-1}(\\\\mathbf{x})) \\\\left|\\\\det \\\\frac{\\\\partial f^{-1}}{\\\\partial \\\\mathbf{x}}\\\\right|$$",
      "For the special case where f is a neural network layer, the singular values of the Jacobian bound how much the network stretches or compresses signals. Spectral normalization constrains the largest singular value to 1, ensuring Lipschitz continuity and stabilizing GAN training.",
    ],
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
    deepDive: [
      "A twice-differentiable function f has a critical point (gradient zero) that is a local minimum if and only if the Hessian there is positive definite (all eigenvalues > 0). A saddle point has both positive and negative eigenvalues. This second-order test generalizes the scalar second-derivative test.",
      "Newton's method replaces the gradient step w_{t+1} = w_t - eta nabla f with the curvature-corrected step w_{t+1} = w_t - H^{-1} nabla f. This stretches the gradient by the inverse curvature in each direction, achieving quadratic convergence near strict local minima.",
      "$$\\\\mathbf{w}_{t+1} = \\\\mathbf{w}_t - \\\\mathbf{H}^{-1} \\\\nabla f(\\\\mathbf{w}_t), \\\\quad \\\\mathbf{H} = \\\\nabla^2 f = \\\\left[\\\\frac{\\\\partial^2 f}{\\\\partial w_i \\\\partial w_j}\\\\right]$$",
      "The Fisher information matrix I(theta) = E[nabla log p(x|theta) nabla log p(x|theta)^T] equals the expected Hessian of the negative log-likelihood at the true parameters. The Cramer-Rao bound states that any unbiased estimator has covariance at least I(theta)^{-1}, making MLE asymptotically optimal.",
    ],
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
    deepDive: [
      "A differentiable function is convex if and only if f(y) >= f(x) + nabla f(x)^T (y - x) for all x, y — that is, the function lies above every tangent plane. This first-order characterization is equivalent to the chord condition and to the Hessian being positive semidefinite everywhere.",
      "Strong convexity adds a lower curvature bound: f(y) >= f(x) + nabla f(x)^T(y-x) + (mu/2)||y-x||^2. This guarantees gradient descent converges at a linear rate O((1 - mu/L)^t), and the condition number kappa = L/mu controls convergence speed.",
      "$$f(\\\\mathbf{y}) \\\\geq f(\\\\mathbf{x}) + \\\\nabla f(\\\\mathbf{x})^\\\\top(\\\\mathbf{y}-\\\\mathbf{x}) + \\\\frac{\\\\mu}{2}\\\\|\\\\mathbf{y}-\\\\mathbf{x}\\\\|^2, \\\\quad \\\\kappa = L/\\\\mu$$",
      "The Legendre-Fenchel conjugate f*(y) = sup_x (y^T x - f(x)) of a convex function is always convex. Conjugate duality turns constrained primal problems into unconstrained dual problems, and exploiting this is how SVM training is solved via quadratic programming over the dual variables.",
    ],
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
    deepDive: [
      "For an L-smooth convex function, gradient descent with step size eta = 1/L converges at rate O(1/t) in objective value. Strong convexity tightens this to linear convergence O((1 - mu/L)^t). These bounds guide practical learning-rate selection in convex settings.",
      "Stochastic gradient descent uses a mini-batch gradient estimate. Its noise acts as implicit regularization and can escape sharp local minima, but it introduces a variance term that prevents convergence to exact solutions. Learning-rate schedules (warmup, cosine decay) balance initial exploration with final precision.",
      "$$\\\\mathbf{w}_{t+1} = \\\\mathbf{w}_t - \\\\eta_t \\\\nabla_{\\\\mathcal{B}} L(\\\\mathbf{w}_t), \\\\quad \\\\mathbb{E}[\\\\nabla_{\\\\mathcal{B}} L] = \\\\nabla L$$",
      "Adam combines adaptive per-parameter learning rates (from RMSProp) with momentum. It maintains exponential moving averages of gradients m_t and squared gradients v_t, and corrects for initialization bias. The effective step size is approximately eta * m_t / (sqrt(v_t) + epsilon), which normalizes the update by recent gradient magnitude.",
    ],
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
    deepDive: [
      "A random variable X is technically a measurable function from a probability space (Omega, F, P) to R. In practice this machinery means: X has a distribution P_X that governs the probabilities of events {X in B}. The distribution fully summarizes X for the purpose of computing expectations.",
      "Continuous random variables have probability density functions (pdfs) p(x) such that P(a <= X <= b) = integral_a^b p(x) dx. A pdf must be non-negative and integrate to 1. The choice of pdf family encodes assumptions about data-generating process; e.g., Gaussian implies symmetric unimodal noise.",
      "$$P(a \\\\leq X \\\\leq b) = \\\\int_a^b p(x)\\\\,dx, \\\\quad p(x) \\\\geq 0, \\\\quad \\\\int_{-\\\\infty}^{\\\\infty} p(x)\\\\,dx = 1$$",
      "The reparameterization trick writes a sample z ~ q(z|theta) as z = g(theta, epsilon) where epsilon ~ p(epsilon) is a fixed noise distribution. This moves the stochasticity outside the parameters, allowing gradients to flow through g and enabling training of variational autoencoders with SGD.",
    ],
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
    deepDive: [
      "Linearity of expectation holds for any random variables, even dependent ones: E[X + Y] = E[X] + E[Y]. This makes it easy to decompose complex quantities. For instance, empirical risk is just the expectation under the empirical distribution, and its gradient is the average of per-sample gradients.",
      "Jensen's inequality states that for a convex function phi, E[phi(X)] >= phi(E[X]). This has deep consequences: log-sum-exp >= sum of logs (Jensen gap is KL divergence), and the evidence lower bound (ELBO) is a Jensen relaxation of the log marginal likelihood.",
      "$$\\\\mathbb{E}[\\\\varphi(X)] \\\\geq \\\\varphi(\\\\mathbb{E}[X]) \\\\text{ (Jensen, convex } \\\\varphi\\\\text{)}, \\\\quad \\\\log p(\\\\mathbf{x}) \\\\geq \\\\mathbb{E}_q[\\\\log p(\\\\mathbf{x},\\\\mathbf{z})] - \\\\mathbb{E}_q[\\\\log q(\\\\mathbf{z})]$$",
      "The law of large numbers guarantees that the empirical mean (1/n) sum_i X_i converges to E[X] as n -> infinity. The central limit theorem quantifies the rate: the error is approximately Normal(0, Var(X)/n), so standard error shrinks as 1/sqrt(n), governing how many samples are needed for a given estimation accuracy.",
    ],
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
    deepDive: [
      "Variance decomposes as Var(X) = E[X^2] - (E[X])^2. For a sum of independent random variables, variances add: Var(X + Y) = Var(X) + Var(Y). This is why averaging n independent samples reduces variance by a factor of n, and why mini-batch gradients have variance inversely proportional to batch size.",
      "Bessel's correction divides by n-1 rather than n when estimating variance from a sample: s^2 = (1/(n-1)) sum_i (x_i - x_bar)^2. This corrects for the bias introduced by using the sample mean instead of the unknown true mean, giving an unbiased estimator.",
      "$$s^2 = \\\\frac{1}{n-1}\\\\sum_{i=1}^n (x_i - \\\\bar{x})^2, \\\\quad \\\\mathbb{E}[s^2] = \\\\sigma^2$$",
      "The bias-variance-noise decomposition of squared prediction error is E[(y - f_hat(x))^2] = Bias^2 + Variance + sigma^2. Regularization shrinks model complexity, reducing variance at the cost of increased bias. The optimal trade-off depends on noise level and data quantity, not model architecture alone.",
    ],
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
    deepDive: [
      "The covariance matrix Sigma of a random vector x in R^d has entries Sigma_{ij} = Cov(X_i, X_j). It is always symmetric and positive semidefinite: v^T Sigma v >= 0 for all v. Eigendecomposition Sigma = Q Lambda Q^T reveals the principal axes and variance magnitudes of the distribution.",
      "The sample covariance matrix requires n > d samples to be full rank. When d >> n the matrix is rank-deficient, making its inverse undefined. Regularized estimators such as Ledoit-Wolf replace Sigma_hat with (1-alpha) Sigma_hat + alpha (tr(Sigma_hat)/d) I, pulling eigenvalues toward a common value.",
      "$$\\\\boldsymbol{\\\\Sigma} = \\\\mathbb{E}[(\\\\mathbf{x}-\\\\boldsymbol{\\\\mu})(\\\\mathbf{x}-\\\\boldsymbol{\\\\mu})^\\\\top], \\\\quad \\\\hat{\\\\boldsymbol{\\\\Sigma}}_{\\\\text{LW}} = (1-\\\\alpha)\\\\hat{\\\\boldsymbol{\\\\Sigma}} + \\\\alpha \\\\frac{\\\\operatorname{tr}(\\\\hat{\\\\boldsymbol{\\\\Sigma}})}{d}\\\\mathbf{I}$$",
      "For jointly Gaussian vectors, zero covariance implies statistical independence — a property unique to Gaussians. For other distributions, zero covariance only implies zero linear dependence; nonlinear dependence can remain. This is why PCA whitening decorrelates but does not fully remove all statistical dependence between components.",
    ],
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
    deepDive: [
      "Shannon entropy H(p) is the expected value of the information content -log p(X). It is maximized by the uniform distribution over k outcomes at log k bits, and minimized at 0 by a degenerate point mass. These bounds frame how much uncertainty a distribution can encode.",
      "The chain rule of entropy states H(X, Y) = H(X) + H(Y|X), where H(Y|X) is the conditional entropy. Mutual information I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) measures how much knowing one variable reduces uncertainty about the other.",
      "$$I(X;Y) = H(X) - H(X|Y) = \\\\sum_{x,y} p(x,y) \\\\log \\\\frac{p(x,y)}{p(x)p(y)} \\\\geq 0$$",
      "Differential entropy extends to continuous distributions as h(p) = -integral p(x) log p(x) dx, but loses some discrete-entropy properties: it can be negative and is not invariant under coordinate change. The Gaussian maximizes differential entropy subject to a fixed variance constraint, justifying its use as the maximum-ignorance prior on real-valued quantities.",
    ],
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
    deepDive: [
      "Cross-entropy decomposes as H(p, q) = H(p) + KL(p||q). Since entropy H(p) is fixed when training data is given, minimizing cross-entropy is identical to minimizing KL divergence KL(p||q). This connects classification loss minimization directly to distribution matching.",
      "For a one-hot label p = e_y, the cross-entropy reduces to -log q_y, the negative log probability assigned to the correct class. The softmax function maps logit vectors to valid probability distributions, making log-softmax differentiable and numerically stable for computing this loss.",
      "$$\\\\mathcal{L} = -\\\\log q_y = -\\\\log \\\\frac{e^{z_y}}{\\\\sum_k e^{z_k}} = -z_y + \\\\log \\\\sum_k e^{z_k}$$",
      "Label smoothing replaces the one-hot target with (1 - epsilon) * e_y + epsilon/K where K is the number of classes. This prevents the model from becoming overconfident and assigns nonzero probability to all classes, which improves calibration and regularizes the output layer.",
    ],
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
    deepDive: [
      "KL divergence is non-negative by Gibbs' inequality: KL(p||q) >= 0 with equality iff p = q almost everywhere. It is the expected log-likelihood ratio under p, measuring how surprised we would be on average if we believed q but observations came from p.",
      "In variational inference the ELBO is log p(x) - KL(q(z|x) || p(z|x)). Maximizing the ELBO simultaneously fits the approximate posterior q to the true posterior and maximizes evidence. The KL term acts as a regularizer pulling q toward the prior p(z).",
      "$$\\\\log p(\\\\mathbf{x}) = \\\\underbrace{\\\\mathbb{E}_q[\\\\log p(\\\\mathbf{x},\\\\mathbf{z})] - \\\\mathbb{E}_q[\\\\log q(\\\\mathbf{z}|\\\\mathbf{x})]}_\\\\text{ELBO} + \\\\mathrm{KL}(q(\\\\mathbf{z}|\\\\mathbf{x})\\\\|p(\\\\mathbf{z}|\\\\mathbf{x}))$$",
      "The asymmetry of KL has practical consequences. Forward KL KL(p||q) is zero-avoiding: q must cover all of p's support, leading to mean-seeking behavior. Reverse KL KL(q||p) is zero-forcing: q concentrates on one mode of p, leading to mode-seeking behavior. Variational inference uses reverse KL and thus tends to produce over-confident posteriors.",
    ],
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
    deepDive: [
      "Regularization has a Bayesian interpretation: penalized maximum likelihood is MAP estimation. The L2 penalty lambda ||w||^2 corresponds to a zero-mean isotropic Gaussian prior on w with variance 1/(2 lambda). The L1 penalty corresponds to a Laplace prior, whose sharp peak at zero promotes sparsity.",
      "Dropout with rate p zeroes each unit independently during training. At test time weights are scaled by (1-p). This is equivalent to training an ensemble of 2^n subnetworks sharing parameters. The ensemble averaging effect reduces variance, providing a powerful stochastic regularization effect.",
      "$$p(\\\\mathbf{w}) = \\\\mathcal{N}(\\\\mathbf{0},\\\\, \\\\sigma^2 \\\\mathbf{I}) \\\\Rightarrow -\\\\log p(\\\\mathbf{w}) \\\\propto \\\\frac{1}{2\\\\sigma^2}\\\\|\\\\mathbf{w}\\\\|_2^2$$",
      "Data augmentation is a form of regularization that enlarges the training set with transformed copies of examples, introducing invariances into the learned representation without changing the model architecture. Techniques such as random cropping, flipping, and mixup substantially improve generalization in vision tasks.",
    ],
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
    deepDive: [
      "The bias-variance decomposition holds pointwise: E[(y - f_hat(x))^2] = (f(x) - E[f_hat(x)])^2 + Var(f_hat(x)) + sigma^2. Bias captures systematic error from wrong model assumptions; variance captures sensitivity to training data; noise is irreducible. These three cannot all be reduced simultaneously.",
      "Ensemble methods reduce variance by averaging multiple models. Bagging trains each model on a bootstrap sample; the prediction variance of the average is 1/B times the individual variance (for uncorrelated models). Boosting instead reduces bias by iteratively fitting residuals.",
      "$$\\\\mathbb{E}[(y - \\\\hat{f}(\\\\mathbf{x}))^2] = \\\\underbrace{(f(\\\\mathbf{x}) - \\\\mathbb{E}[\\\\hat{f}(\\\\mathbf{x})])^2}_{\\\\text{Bias}^2} + \\\\underbrace{\\\\mathbb{E}[(\\\\hat{f}(\\\\mathbf{x}) - \\\\mathbb{E}[\\\\hat{f}(\\\\mathbf{x})])^2]}_{\\\\text{Variance}} + \\\\sigma^2$$",
      "Double descent challenges the classic U-shaped curve: as model capacity grows past the interpolation threshold (where training error reaches zero), test error initially spikes then decreases again in the over-parameterized regime. This occurs because sufficiently over-parameterized models find low-norm interpolating solutions that generalize well.",
    ],
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
    deepDive: [
      "Under an i.i.d. assumption, the log-likelihood factorizes as log p(D|theta) = sum_i log p(x_i|theta). This turns a product of small probabilities into a sum, avoiding numerical underflow and converting maximization to a simpler additive structure compatible with gradient methods.",
      "The MLE is consistent: theta_hat -> theta* as n -> infinity under mild regularity. It is also asymptotically efficient: among all consistent estimators, the MLE achieves the Cramér-Rao lower bound, meaning it has the smallest asymptotic variance in the limit of large samples.",
      "$$\\\\sqrt{n}(\\\\hat{\\\\theta}_{\\\\text{MLE}} - \\\\theta^*) \\\\xrightarrow{d} \\\\mathcal{N}(\\\\mathbf{0},\\\\, \\\\mathbf{I}(\\\\theta^*)^{-1}), \\\\quad \\\\mathbf{I}(\\\\theta) = -\\\\mathbb{E}\\\\left[\\\\frac{\\\\partial^2 \\\\log p}{\\\\partial \\\\theta^2}\\\\right]$$",
      "Score matching and noise-contrastive estimation are alternatives to MLE when the normalizing constant of the model is intractable. Score matching minimizes E[||nabla_x log p_theta(x) - nabla_x log p_data(x)||^2], which avoids computing the partition function entirely.",
    ],
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
    deepDive: [
      "Least squares is the MLE under the assumption y = Xw + epsilon where epsilon ~ N(0, sigma^2 I). Maximizing the Gaussian log-likelihood -||Xw - y||^2 / (2 sigma^2) is identical to minimizing squared residuals. This Gaussian noise assumption justifies using squared loss for regression.",
      "The Gauss-Markov theorem states that among all linear unbiased estimators, the OLS estimator has minimum variance. This is the BLUE (Best Linear Unbiased Estimator) property. It holds without assuming Gaussian noise — only zero-mean, constant-variance, uncorrelated errors are required.",
      "$$\\\\hat{\\\\mathbf{w}} = (\\\\mathbf{X}^\\\\top \\\\mathbf{X})^{-1} \\\\mathbf{X}^\\\\top \\\\mathbf{y}, \\\\quad \\\\operatorname{Var}(\\\\hat{\\\\mathbf{w}}) = \\\\sigma^2 (\\\\mathbf{X}^\\\\top \\\\mathbf{X})^{-1}$$",
      "Weighted least squares handles heteroscedastic noise by assigning weight w_i proportional to 1/sigma_i^2 for each observation. The solution minimizes sum_i w_i (y_i - x_i^T w)^2 and corresponds to MLE under independent but non-identically distributed Gaussian noise.",
    ],
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
    deepDive: [
      "Setting the gradient of ||Xw - y||^2 to zero gives X^T(Xw - y) = 0, i.e., the normal equation. Geometrically, this says the residual Xw - y is orthogonal to the column space of X, confirming that the solution is an orthogonal projection.",
      "Solving the normal equation directly by forming G = X^T X and computing G^{-1} X^T y costs O(nd^2 + d^3): computing G is O(nd^2) and its inversion is O(d^3). This is the right method when n >> d and d is moderate (say d < 10000), but it squares the condition number of X.",
      "$$\\\\kappa(\\\\mathbf{X}^\\\\top \\\\mathbf{X}) = \\\\kappa(\\\\mathbf{X})^2, \\\\quad \\\\hat{\\\\mathbf{w}} = \\\\mathbf{R}^{-1}\\\\mathbf{Q}^\\\\top \\\\mathbf{y} \\\\text{ via QR: } \\\\mathbf{X} = \\\\mathbf{Q}\\\\mathbf{R}$$",
      "QR decomposition X = QR gives a numerically superior solution: X^T X w = X^T y becomes R^T Q^T QR w = R^T Q^T y, simplifying to Rw = Q^T y via back-substitution. This avoids squaring the condition number and is the standard implementation in numerical linear algebra libraries.",
    ],
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
    deepDive: [
      "The Moore-Penrose pseudoinverse A^+ is defined via SVD: if A = U Sigma V^T, then A^+ = V Sigma^+ U^T where Sigma^+ replaces each nonzero diagonal entry sigma_i with 1/sigma_i and leaves zeros alone. This provides the numerically stable way to solve any linear system in a least-squares, minimum-norm sense.",
      "The pseudoinverse simultaneously satisfies four Penrose conditions: AA^+A = A, A^+AA^+ = A^+, (AA^+)^T = AA^+, and (A^+A)^T = A^+A. These characterize it uniquely. The conditions ensure that A^+ provides the orthogonal projection onto the row space and column space of A.",
      "$$\\\\mathbf{A}^+ = \\\\mathbf{V}\\\\mathbf{\\\\Sigma}^+ \\\\mathbf{U}^\\\\top, \\\\quad \\\\Sigma^+_{ii} = \\\\begin{cases} 1/\\\\sigma_i & \\\\sigma_i > 0 \\\\\\\\ 0 & \\\\sigma_i = 0 \\\\end{cases}$$",
      "In the underdetermined case (more unknowns than equations), infinitely many solutions exist. The pseudoinverse solution w* = A^+ b has minimum L2 norm among all solutions. In the overdetermined case it gives the minimum squared residual. In both cases it selects the solution lying in the row space of A.",
    ],
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
    deepDive: [
      "The condition number kappa(A) = ||A|| ||A^{-1}|| bounds the relative error amplification: ||delta w|| / ||w|| <= kappa(A) * ||delta b|| / ||b||. A large condition number means small data perturbations can produce large changes in the solution, explaining why ill-conditioned systems are numerically dangerous.",
      "Ridge regularization replaces X^T X with X^T X + lambda I. Its singular values are sigma_i^2 + lambda instead of sigma_i^2, and its condition number becomes (sigma_max^2 + lambda)/(sigma_min^2 + lambda), which is strictly smaller than (sigma_max/sigma_min)^2. Regularization thus directly improves numerical stability.",
      "$$\\\\kappa(\\\\mathbf{X}^\\\\top \\\\mathbf{X} + \\\\lambda \\\\mathbf{I}) = \\\\frac{\\\\sigma_1^2 + \\\\lambda}{\\\\sigma_r^2 + \\\\lambda} < \\\\left(\\\\frac{\\\\sigma_1}{\\\\sigma_r}\\\\right)^2 = \\\\kappa(\\\\mathbf{X}^\\\\top\\\\mathbf{X})$$",
      "Preconditioning transforms the linear system to one with a smaller condition number. If P is a preconditioning matrix approximating (X^T X)^{-1/2}, the system P X^T X P^T has condition number approaching 1. Diagonal preconditioning (normalizing each feature by its standard deviation) is a simple but effective first step.",
    ],
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
    deepDive: [
      "Without feature scaling, the Hessian of a linear model's loss can have condition number equal to the squared ratio of feature scales. Gradient descent along a direction of low curvature makes tiny progress relative to high-curvature directions, causing slow zig-zagging. Standardizing features equates curvature across dimensions.",
      "Batch normalization normalizes pre-activations within each mini-batch to zero mean and unit variance, then applies learned scale (gamma) and shift (beta) parameters. The normalization step reduces internal covariate shift, allows higher learning rates, and acts as a regularizer by introducing mini-batch noise into activations.",
      "$$\\\\hat{x}_i = \\\\frac{x_i - \\\\mu_{\\\\mathcal{B}}}{\\\\sqrt{\\\\sigma_{\\\\mathcal{B}}^2 + \\\\epsilon}}, \\\\quad y_i = \\\\gamma \\\\hat{x}_i + \\\\beta$$",
      "Min-max scaling x' = (x - x_min) / (x_max - x_min) maps features to [0, 1] but is sensitive to outliers. Robust scaling using the interquartile range instead of standard deviation is more appropriate for heavy-tailed features. The choice of scaling method should match the algorithm's sensitivity assumptions.",
    ],
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
    deepDive: [
      "MAP estimation maximizes the log posterior: log p(theta|D) = log p(D|theta) + log p(theta) + const. The prior term log p(theta) acts as a regularizer. A Gaussian prior N(0, sigma^2 I) adds -||theta||^2 / (2 sigma^2) to the log-likelihood, which corresponds exactly to L2 regularization with lambda = 1/(2 sigma^2).",
      "MAP is a point estimate and discards posterior uncertainty. Full Bayesian inference integrates over all parameter values: p(y*|x*, D) = integral p(y*|x*, theta) p(theta|D) d theta. MAP approximates this integral by the single mode, which can be a poor approximation for multimodal or wide posteriors.",
      "$$\\\\theta_{\\\\text{MAP}} = \\\\underset{\\\\theta}{\\\\operatorname{argmax}} \\\\left[ \\\\sum_i \\\\log p(x_i|\\\\theta) + \\\\log p(\\\\theta) \\\\right]$$",
      "The Laplace approximation refines MAP by fitting a Gaussian to the posterior at the MAP point using the negative Hessian of the log posterior as the precision matrix. This provides an approximate posterior covariance and enables uncertainty quantification while still centering on the MAP estimate.",
    ],
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
    deepDive: [
      "A function k(x, z) is a valid Mercer kernel if and only if for any finite set of points {x_1, ..., x_n}, the Gram matrix K_{ij} = k(x_i, x_j) is positive semidefinite. This guarantees the existence of a (possibly infinite-dimensional) feature map phi such that k(x,z) = phi(x)^T phi(z).",
      "Kernel methods express predictions as f(x) = sum_i alpha_i k(x_i, x), depending on training data only through pairwise kernel evaluations. This dual representation avoids the curse of dimensionality in the feature space while enabling nonlinear models with linear algorithms.",
      "$$f(\\\\mathbf{x}) = \\\\sum_{i=1}^n \\\\alpha_i k(\\\\mathbf{x}_i, \\\\mathbf{x}), \\\\quad k_\\\\text{RBF}(\\\\mathbf{x},\\\\mathbf{z}) = \\\\exp\\\\!\\\\left(-\\\\frac{\\\\|\\\\mathbf{x}-\\\\mathbf{z}\\\\|^2}{2\\\\ell^2}\\\\right)$$",
      "The kernel trick extends to any algorithm that can be written in terms of inner products. Kernel PCA replaces the linear covariance with the kernel Gram matrix. Kernel ridge regression replaces the feature matrix with the kernel matrix. Gaussian processes are a Bayesian interpretation of kernel methods with full predictive uncertainty.",
    ],
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
    deepDive: [
      "Ridge regression has the closed-form solution w_hat = (X^T X + lambda I)^{-1} X^T y. Adding lambda I to X^T X inflates all singular values by lambda, making the problem well-conditioned even when X^T X is singular or nearly so. The estimator is always unique and invertible for lambda > 0.",
      "The ridge estimator shrinks each OLS coefficient by a factor sigma_i^2 / (sigma_i^2 + lambda) along the i-th singular vector direction. Directions of large singular value are shrunk little; directions of small singular value are shrunk strongly. This effectively discards unreliable low-variance directions.",
      "$$\\\\hat{\\\\mathbf{w}}_{\\\\text{ridge}} = \\\\sum_{i=1}^r \\\\frac{\\\\sigma_i^2}{\\\\sigma_i^2 + \\\\lambda} \\\\frac{\\\\mathbf{u}_i^\\\\top \\\\mathbf{y}}{\\\\sigma_i} \\\\mathbf{v}_i$$",
      "The ridge solution path (as lambda varies from 0 to infinity) traces from the OLS solution to the zero vector. Unlike lasso, the path is smooth and no coefficient ever reaches exactly zero. The optimal lambda is typically chosen by cross-validation or generalized cross-validation (GCV), which estimates leave-one-out error in closed form.",
    ],
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
    deepDive: [
      "Lasso sparsity arises from the subdifferential optimality condition. At a coordinate w_j = 0, the subdifferential of |w_j| is the interval [-1, 1]. The KKT condition requires |x_j^T r| <= lambda, where r is the residual. Features with insufficient correlation with the residual are exactly zeroed out.",
      "Coordinate descent for lasso cycles through each coordinate j and analytically minimizes over w_j while fixing all others. The solution is the soft-thresholding operator: w_j <- sign(z_j) max(|z_j| - lambda, 0) where z_j is the partial residual correlation. This is exact and very fast.",
      "$$\\\\hat{w}_j = \\\\mathcal{S}_\\\\lambda(z_j) = \\\\operatorname{sign}(z_j)\\\\max(|z_j| - \\\\lambda,\\, 0), \\\\quad z_j = \\\\mathbf{x}_j^\\\\top (\\\\mathbf{y} - \\\\mathbf{X}_{-j}\\\\mathbf{w}_{-j})$$",
      "The lasso tends to select one predictor from a group of correlated predictors arbitrarily and set the rest to zero. This instability under correlation is why elastic net was developed. When interpretability requires identifying groups of correlated features rather than a single representative, group lasso or elastic net is more appropriate.",
    ],
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
    deepDive: [
      "The elastic net penalty alpha ||w||_1 + (1 - alpha)/2 ||w||_2^2 (in the sklearn parameterization, with an overall lambda) can be viewed as a compromise: the L1 part promotes sparsity, while the L2 part penalizes large coefficients and groups correlated predictors by shrinking them toward each other.",
      "Elastic net can be solved by a naive transformation: augment the feature matrix X with sqrt(lambda2) I and augment y with zeros. The resulting augmented lasso problem has the elastic net solution for the original coefficients after proper rescaling. Coordinate descent then applies directly.",
      "$$\\\\hat{\\\\mathbf{w}} = \\\\underset{\\\\mathbf{w}}{\\\\operatorname{argmin}}\\\\left\\\\{ \\\\|\\\\mathbf{y} - \\\\mathbf{X}\\\\mathbf{w}\\\\|_2^2 + \\\\lambda_1 \\\\|\\\\mathbf{w}\\\\|_1 + \\\\lambda_2 \\\\|\\\\mathbf{w}\\\\|_2^2 \\\\right\\\\}$$",
      "In genomics and other ultra-high-dimensional settings where p >> n and many features are correlated blocks, elastic net substantially outperforms lasso. The grouping effect means that within a correlated block, all predictors tend to have similar non-zero coefficients rather than only one being selected.",
    ],
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
    deepDive: [
      "The hard-margin SVM finds the maximum-margin hyperplane separating two linearly separable classes. The margin is 2/||w||, so maximizing margin is equivalent to minimizing ||w||^2 / 2 subject to y_i (w^T x_i + b) >= 1. Only support vectors (the closest points to the decision boundary) affect the solution.",
      "The dual SVM is derived via Lagrangian duality: maximize sum_i alpha_i - (1/2) sum_{ij} alpha_i alpha_j y_i y_j x_i^T x_j subject to sum_i alpha_i y_i = 0 and alpha_i >= 0. All inner products x_i^T x_j can be replaced by a kernel k(x_i, x_j), enabling nonlinear classification without explicit feature computation.",
      "$$\\\\max_{\\\\boldsymbol{\\\\alpha}} \\\\sum_i \\\\alpha_i - \\\\frac{1}{2}\\\\sum_{i,j}\\\\alpha_i \\\\alpha_j y_i y_j k(\\\\mathbf{x}_i, \\\\mathbf{x}_j), \\\\quad 0 \\\\leq \\\\alpha_i \\\\leq C$$",
      "The soft-margin parameter C controls the tradeoff: large C penalizes margin violations heavily (low bias, high variance); small C allows more violations in exchange for a larger margin (high bias, low variance). Cross-validation over a log-scale grid of C values is the standard practice.",
    ],
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
    deepDive: [
      "k-NN decision boundaries are piecewise linear for Euclidean distance (they are Voronoi diagrams for k=1). As k increases, the boundary smooths and the model becomes more biased but less variable. The optimal k balances this tradeoff and is typically found by cross-validation.",
      "The curse of dimensionality severely damages k-NN: in d dimensions, the fraction of data volume within distance r of a query point scales as r^d, so maintaining a fixed neighborhood fraction requires r to grow, meaning neighbors are no longer locally similar. Effective k-NN in high dimensions requires either dimensionality reduction or learned metrics.",
      "$$d_{\\\\text{Mahal}}(\\\\mathbf{x},\\\\mathbf{z}) = \\\\sqrt{(\\\\mathbf{x}-\\\\mathbf{z})^\\\\top \\\\mathbf{M} (\\\\mathbf{x}-\\\\mathbf{z})}, \\\\quad \\\\mathbf{M} \\\\succeq 0$$",
      "Metric learning methods (e.g., Large Margin Nearest Neighbor, LMNN) learn a Mahalanobis distance matrix M that pulls same-class neighbors together and pushes different-class points apart. This makes the distance metric task-aware, dramatically improving k-NN accuracy on complex datasets.",
    ],
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
    deepDive: [
      "k-Means alternates between two steps: (1) assign each point to its nearest centroid, and (2) update each centroid to the mean of its assigned points. Each step decreases the objective, and since the objective is bounded below and there are finitely many assignments, the algorithm converges — though to a local optimum.",
      "k-Means is equivalent to a hard-assignment Gaussian mixture model with equal, spherical covariances and equal mixing weights. The EM algorithm for this restricted GMM reduces to the k-Means update rules. Allowing general covariances yields the full GMM with soft assignments.",
      "$$J = \\\\sum_{k=1}^K \\\\sum_{i: c_i=k} \\\\|\\\\mathbf{x}_i - \\\\boldsymbol{\\\\mu}_k\\\\|^2, \\\\quad \\\\boldsymbol{\\\\mu}_k = \\\\frac{1}{|C_k|}\\\\sum_{i \\\\in C_k} \\\\mathbf{x}_i$$",
      "k-Means++ initializes centroids by sampling the first centroid uniformly at random, then each subsequent centroid proportional to the squared distance from the nearest already-chosen centroid. This seeding strategy gives an O(log k) approximation guarantee on the final objective and dramatically reduces the probability of poor local optima.",
    ],
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
    deepDive: [
      "A GMM is a universal density approximator: any smooth density can be approximated arbitrarily well with enough Gaussian components. In practice, GMMs with diagonal or tied covariance are used to limit parameter count and avoid overfitting, especially when the number of dimensions d is large relative to cluster size.",
      "The E-step computes soft responsibilities r_{ik} = pi_k N(x_i|mu_k, Sigma_k) / sum_j pi_j N(x_i|mu_j, Sigma_j). These are the posterior probabilities of component membership. The M-step updates parameters using responsibility-weighted statistics: mu_k = sum_i r_{ik} x_i / sum_i r_{ik}.",
      "$$r_{ik} = \\\\frac{\\\\pi_k \\\\mathcal{N}(\\\\mathbf{x}_i|\\\\boldsymbol{\\\\mu}_k, \\\\boldsymbol{\\\\Sigma}_k)}{\\\\sum_j \\\\pi_j \\\\mathcal{N}(\\\\mathbf{x}_i|\\\\boldsymbol{\\\\mu}_j, \\\\boldsymbol{\\\\Sigma}_j)}$$",
      "GMMs can overfit by shrinking a component to a single data point, making its covariance degenerate and its likelihood infinite. Diagonal covariance with a minimum variance floor, or Bayesian GMMs with a Dirichlet process prior on the number of components, prevent this degenerate solution.",
    ],
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
    deepDive: [
      "EM monotonically increases the marginal log-likelihood log p(x|theta) at each iteration. This follows because the ELBO = E_q[log p(x,z|theta)] - H(q) is a lower bound on log p(x|theta) that becomes tight when q = p(z|x,theta), and the M-step increases the ELBO by maximizing over theta.",
      "The M-step is tractable when the complete-data log-likelihood log p(x,z|theta) belongs to the exponential family: the expected sufficient statistics can be computed in the E-step and the M-step update is a closed-form formula. For GMMs, these are the responsibility-weighted sums and outer products.",
      "$$\\\\log p(\\\\mathbf{x}|\\\\theta) \\\\geq \\\\mathcal{L}(q,\\\\theta) = \\\\mathbb{E}_q[\\\\log p(\\\\mathbf{x},\\\\mathbf{z}|\\\\theta)] - \\\\mathbb{E}_q[\\\\log q(\\\\mathbf{z})] = \\\\mathcal{L}_{\\\\text{ELBO}}$$",
      "Generalized EM (GEM) replaces the exact M-step with any parameter update that increases Q(theta, theta_old) = E_q[log p(x,z|theta)]. This is useful when the M-step has no closed form. Variational EM further replaces the exact E-step with an approximate posterior, bridging EM and variational inference.",
    ],
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
    deepDive: [
      "Naive Bayes classifies by computing the posterior over classes proportional to p(y) prod_j p(x_j|y). Taking logs, the score becomes log p(y) + sum_j log p(x_j|y) — a sum of per-feature log-likelihoods plus a class-prior term. This log-linear structure makes prediction O(d) per class.",
      "Laplace smoothing adds a pseudocount alpha to each count in the conditional frequency table: P(x_j=v|y=c) = (count(x_j=v, y=c) + alpha) / (count(y=c) + alpha * |V|). This prevents zero probabilities for unseen feature-class combinations and corresponds to a Dirichlet prior on the categorical parameters.",
      "$$\\\\hat{y} = \\\\underset{c}{\\\\operatorname{argmax}} \\\\left[ \\\\log p(y=c) + \\\\sum_{j=1}^d \\\\log p(x_j | y=c) \\\\right]$$",
      "Despite the strong conditional independence assumption, naive Bayes is surprisingly competitive because it only needs to estimate posterior mode correctly, not the exact probabilities. When features are genuinely dependent, Bayes-optimal boundaries shift, but naive Bayes boundaries may still be approximately correct for classification purposes.",
    ],
  },
};
