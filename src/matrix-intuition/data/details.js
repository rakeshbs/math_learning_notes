export const CONCEPT_DETAILS = {
  rank: {
    deeper:
      "For an m x n matrix, rank is the dimension of both column space and row space. Rank controls solvability and uniqueness through rank-nullity.",
    useCases: [
      "Diagnose if Ax = b is solvable",
      "Measure effective dimensionality in datasets",
      "Detect redundancy in feature matrices",
    ],
    pitfalls: [
      "Assuming non-zero rows automatically means full rank",
      "Ignoring numerical rank when singular values decay slowly",
    ],
    quickCheck: "Count pivots in RREF; that number is rank.",
  },
  determinant: {
    deeper:
      "Determinant is multilinear and alternates sign with row swaps. It is the oriented volume scaling under the linear map.",
    useCases: [
      "Quick invertibility test for square matrices",
      "Jacobian volume scaling in calculus",
      "Orientation checks in geometry pipelines",
    ],
    pitfalls: [
      "Using determinant alone to judge numerical stability",
      "Interpreting small det as exactly singular without context",
    ],
    quickCheck: "det(A) = 0 iff A is singular.",
  },
  eigenvalues: {
    deeper:
      "Eigenvalues summarize intrinsic scaling directions. Repeated eigenvalues may or may not provide enough eigenvectors for diagonalization.",
    useCases: [
      "Stability of dynamical systems",
      "Principal modes in PDEs and physics",
      "PCA and covariance analysis",
    ],
    pitfalls: [
      "Confusing singular values with eigenvalues",
      "Assuming every matrix has a full eigenbasis",
    ],
    quickCheck: "Solve det(A - lambda I) = 0, then find eigenspaces.",
  },
  nullspace: {
    deeper:
      "Null space dimension (nullity) equals n - rank for n columns. It captures hidden degrees of freedom in underdetermined systems.",
    useCases: [
      "Describe all solutions to Ax = 0",
      "Constraint analysis in mechanics",
      "Find dependencies among columns",
    ],
    pitfalls: [
      "Treating null space as always one-dimensional",
      "Ignoring free variables when parameterizing solutions",
    ],
    quickCheck: "Identify free columns after row reduction.",
  },
  trace: {
    deeper:
      "Trace is basis-invariant and equals the sum of eigenvalues with algebraic multiplicity. It is linear: tr(A + B) = tr(A) + tr(B).",
    useCases: [
      "Fast matrix summary statistic",
      "Derivatives in matrix calculus",
      "Characterizing linear ODE systems",
    ],
    pitfalls: [
      "Using trace as if it measured matrix norm",
      "Forgetting trace only applies to square matrices",
    ],
    quickCheck: "Add only the main diagonal entries.",
  },
  transpose: {
    deeper:
      "Transpose represents the adjoint under the standard dot product. It converts row-space statements into column-space statements.",
    useCases: [
      "Normal equations A^T A x = A^T b",
      "Building covariance and Gram matrices",
      "Switching between primal/dual views",
    ],
    pitfalls: [
      "Dropping reverse-order rule: (AB)^T = B^T A^T",
      "Treating transpose as inverse for non-orthogonal matrices",
    ],
    quickCheck: "Swap indices i,j in every entry.",
  },
  inverse: {
    deeper:
      "Inverse exists only for square full-rank matrices. Numerically, solving linear systems directly is usually better than explicitly computing A^-1.",
    useCases: [
      "Recover x from Ax = b in theory",
      "Coordinate transformations",
      "Control and estimation formulas",
    ],
    pitfalls: [
      "Computing inverse just to solve Ax = b",
      "Ignoring ill-conditioning when inverse exists but is unstable",
    ],
    quickCheck: "A is invertible iff rank = n (square) iff det(A) != 0.",
  },
  identity: {
    deeper:
      "Identity is the neutral map in a vector space: it preserves every vector and every subspace exactly.",
    useCases: [
      "Baseline transform in graphics/simulation pipelines",
      "Initialization for iterative matrix products",
      "Reference operator in proofs and algorithms",
    ],
    pitfalls: [
      "Using mismatched identity size (I_n vs I_m)",
      "Confusing identity with diagonal matrices having non-one entries",
    ],
    quickCheck: "All diagonal entries are 1 and off-diagonals are 0.",
  },
  multiplication: {
    deeper:
      "Matrix multiplication combines linear maps into one operator. Dimension compatibility is required: (m x n)(n x p) -> (m x p).",
    useCases: [
      "Compose rigid and affine transformations",
      "Model layered linear systems",
      "Build powers and transition operators",
    ],
    pitfalls: [
      "Ignoring order when composing transforms",
      "Multiplying incompatible dimensions",
    ],
    quickCheck: "For x, verify B(Ax) matches (BA)x.",
  },
  noncommute: {
    deeper:
      "Non-commutativity means transformation order is information. Two maps with identical factors can produce different outcomes when swapped.",
    useCases: [
      "Reason about pipeline order in graphics/robotics",
      "Analyze operator interactions in physics/control",
      "Use commutators in Lie algebra style modeling",
    ],
    pitfalls: [
      "Assuming AB and BA are interchangeable",
      "Simplifying symbolic expressions as if scalars",
    ],
    quickCheck: "Compute AB and BA on a test vector; compare outputs.",
  },
  span: {
    deeper:
      "Span is the closure under linear combinations. Column space tells exactly which right-hand sides b are reachable in Ax = b.",
    useCases: [
      "Reachability analysis",
      "Feature subspace modeling",
      "Constructing approximations in reduced bases",
    ],
    pitfalls: [
      "Thinking span requires unique coefficients",
      "Mixing up spanning with independence",
    ],
    quickCheck: "Check whether b is orthogonal to left null space.",
  },
  orthogonal: {
    deeper:
      "Orthogonal transformations preserve inner products, therefore preserve lengths and angles. They are numerically stable building blocks.",
    useCases: [
      "Rotations/reflections in graphics",
      "Stable factorizations (QR)",
      "Signal decorrelation and transforms",
    ],
    pitfalls: [
      "Assuming orthogonal means axis-aligned",
      "Forgetting orthonormal columns must have unit length",
    ],
    quickCheck: "Verify Q^T Q = I.",
  },
  projection: {
    deeper:
      "Orthogonal projection minimizes distance to a subspace. The residual is orthogonal to that subspace by construction.",
    useCases: [
      "Least squares regression",
      "Denoising by subspace truncation",
      "Computer vision plane fitting",
    ],
    pitfalls: [
      "Projecting with non-orthogonal basis without correction",
      "Forgetting projection matrix is idempotent",
    ],
    quickCheck: "For orthogonal projector P, check P^2 = P and P = P^T.",
  },
  norm: {
    deeper:
      "Different norms encode different geometry. Choice of norm changes optimization behavior and robustness properties.",
    useCases: [
      "Regularization design in ML",
      "Convergence criteria in iterative methods",
      "Error bounds in numerical analysis",
    ],
    pitfalls: [
      "Comparing values across norms without scaling context",
      "Assuming L1 and L2 penalize outliers similarly",
    ],
    quickCheck:
      "Any norm obeys positivity, homogeneity, and triangle inequality.",
  },
  svd: {
    deeper:
      "SVD exposes rank, condition number, and dominant directions. It is the most informative all-purpose matrix decomposition.",
    useCases: [
      "Low-rank compression",
      "Pseudoinverse and least squares",
      "Latent semantic analysis and recommender systems",
    ],
    pitfalls: [
      "Keeping too many tiny singular values in inversion",
      "Ignoring centering/normalization before PCA-style use",
    ],
    quickCheck: "Count non-zero singular values to get rank.",
  },
  diagonalization: {
    deeper:
      "Diagonalization is a coordinate simplification: complicated coupling in standard basis becomes independent scaling in eigenbasis.",
    useCases: [
      "Fast matrix powers for recurrences",
      "Closed forms for linear ODE systems",
      "Spectral interpretation of operators",
    ],
    pitfalls: [
      "Assuming repeated eigenvalues always imply non-diagonalizable",
      "Forgetting complex eigenpairs when matrix is real",
    ],
    quickCheck: "Need n independent eigenvectors for n x n matrix.",
  },
  lu: {
    deeper:
      "LU reuses elimination work across many right-hand sides. With pivoting, it is the standard dense direct solve workflow.",
    useCases: [
      "Repeated solves Ax = b_i",
      "Determinant from triangular factors",
      "Preconditioner construction",
    ],
    pitfalls: [
      "Skipping pivoting on difficult matrices",
      "Confusing symbolic LU with floating-point stable LU",
    ],
    quickCheck: "After factorization, solve Ly = b then Ux = y.",
  },
  qr: {
    deeper:
      "QR is geometry-first: Q gives orthonormal directions, R gives coordinates in those directions.",
    useCases: [
      "Least squares without normal-equation squaring",
      "Computing orthonormal bases",
      "Eigenvalue algorithms (QR iteration)",
    ],
    pitfalls: [
      "Using classical Gram-Schmidt in unstable settings",
      "Ignoring column pivoting for rank-deficient problems",
    ],
    quickCheck: "Columns of Q should be unit and mutually orthogonal.",
  },
  cholesky: {
    deeper:
      "Cholesky is a triangular square-root for SPD matrices. It reveals geometry and enables fast stable solves.",
    useCases: [
      "Solving SPD linear systems in optimization",
      "Sampling correlated Gaussians",
      "Efficient covariance-based computations",
    ],
    pitfalls: [
      "Applying Cholesky to non-symmetric or indefinite matrices",
      "Ignoring near-singularity causing numerical breakdown",
    ],
    quickCheck: "If factorization fails, A is not sufficiently SPD.",
  },
  posdef: {
    deeper:
      "Positive definite matrices define inner products and energy bowls. They guarantee unique minimizers in many quadratic problems.",
    useCases: [
      "Convex quadratic optimization",
      "Covariance modeling",
      "Cholesky-based efficient solvers",
    ],
    pitfalls: [
      "Confusing PSD with PD",
      "Testing definiteness only on diagonal signs",
    ],
    quickCheck: "For symmetric A, all eigenvalues > 0 iff A is PD.",
  },
  symmetric: {
    deeper:
      "Symmetric matrices are orthogonally diagonalizable, making them especially interpretable and stable in computations.",
    useCases: [
      "Covariance and Hessian analysis",
      "Spectral clustering and graph Laplacians",
      "Principal axis transforms",
    ],
    pitfalls: [
      "Assuming all real matrices are diagonalizable like symmetric ones",
      "Forgetting symmetry must hold entrywise",
    ],
    quickCheck: "Verify a_ij = a_ji for all i,j.",
  },
  condition: {
    deeper:
      "Condition number is a property of the problem, not the algorithm. It upper-bounds how input perturbations can scale in output.",
    useCases: [
      "Judge reliability of computed solutions",
      "Feature scaling decisions",
      "Detect near-singularity before inversion",
    ],
    pitfalls: [
      "Blaming algorithm for errors caused by bad conditioning",
      "Ignoring units/scaling that inflate kappa",
    ],
    quickCheck: "kappa near 1 is stable; very large kappa is fragile.",
  },
  pseudoinverse: {
    deeper:
      "Pseudoinverse unifies solve strategies across rectangular/singular cases and selects the minimum-norm least-squares solution.",
    useCases: [
      "Least squares for overdetermined systems",
      "Recovering signals with rank-deficient operators",
      "Robust inverse kinematics in robotics",
    ],
    pitfalls: [
      "Inverting tiny singular values without regularization",
      "Expecting exact solves when b is outside column space",
    ],
    quickCheck:
      "Compute Ax* with x*=A^+b; it should equal projection of b onto Col(A).",
  },
  linindep: {
    deeper:
      "Independence is about uniqueness of representation. It determines whether a set can serve as a basis candidate.",
    useCases: [
      "Basis construction",
      "Feature selection without redundancy",
      "Solvability and uniqueness checks",
    ],
    pitfalls: [
      "Testing with too few sample combinations",
      "Ignoring floating-point tolerance in near-dependent vectors",
    ],
    quickCheck: "Set is independent iff only trivial combination gives zero.",
  },
  basis: {
    deeper:
      "A basis provides coordinates. Changing basis changes numbers, not the underlying geometric vector.",
    useCases: [
      "Coordinate transforms in graphics/robotics",
      "Modal decompositions in physics",
      "Efficient representation in sparse domains",
    ],
    pitfalls: [
      "Mixing vectors from different spaces",
      "Using spanning sets that are not independent",
    ],
    quickCheck: "Need exactly dim(V) independent vectors to form a basis.",
  },
  diagonal: {
    deeper:
      "Diagonal matrices are fully decoupled operators: each coordinate evolves independently with zero cross-coupling.",
    useCases: [
      "Fast scaling transforms in simulation/graphics",
      "Simplified matrix powers and exponentials",
      "Diagonal preconditioning in iterative solvers",
    ],
    pitfalls: [
      "Assuming nearly diagonal behaves exactly diagonal",
      "Ignoring zero diagonal entries when inverting",
    ],
    quickCheck: "All off-diagonal entries must be exactly zero.",
  },
  triangular: {
    deeper:
      "Triangular structure enables one-pass substitution and appears naturally after elimination/factorization.",
    useCases: [
      "Forward/back substitution in linear solves",
      "Efficient determinant and eigenvalue inspection",
      "Intermediate factors in LU/Cholesky workflows",
    ],
    pitfalls: [
      "Using wrong solve direction (forward vs backward)",
      "Assuming triangular implies well-conditioned",
    ],
    quickCheck: "For upper triangular U, entries below diagonal must be zero.",
  },
  permutation: {
    deeper:
      "Permutation matrices encode reorderings and preserve Euclidean norms as orthogonal operators.",
    useCases: [
      "Row pivoting for stable LU factorization",
      "Index reordering in sparse computations",
      "Representing discrete state relabeling",
    ],
    pitfalls: [
      "Confusing row permutations with column permutations",
      "Forgetting inverse is transpose for permutation matrices",
    ],
    quickCheck: "Every row and column has exactly one 1.",
  },
  idempotent: {
    deeper:
      "Idempotent maps stabilize after one application and characterize projection-like operators.",
    useCases: [
      "Projection matrices in least squares",
      "Subspace extraction operators",
      "State-update operators with one-step saturation",
    ],
    pitfalls: [
      "Assuming every idempotent is orthogonal projection",
      "Ignoring rank/trace constraints",
    ],
    quickCheck: "Numerically verify ||A^2 - A|| is near zero.",
  },
  nilpotent: {
    deeper:
      "Nilpotent matrices model transient dynamics that vanish after finite repeated composition.",
    useCases: [
      "Jordan form analysis",
      "Linearized dynamics with finite-step decay",
      "Algebraic decomposition theory",
    ],
    pitfalls: [
      "Confusing nilpotent with merely small eigenvalues",
      "Using too low a power before concluding non-nilpotent",
    ],
    quickCheck: "Find smallest k with A^k = 0 (within tolerance).",
  },
  involutory: {
    deeper:
      "Involutory operators reverse themselves in one extra step and often correspond to reflections or swaps.",
    useCases: [
      "Reflection operators in geometry",
      "Swap/sign-flip transforms",
      "Fast reversible transforms",
    ],
    pitfalls: [
      "Assuming involutory implies orthogonal",
      "Ignoring numerical drift when testing A^2=I",
    ],
    quickCheck: "Check A multiplied by itself equals identity.",
  },
  skewsymmetric: {
    deeper:
      "Skew-symmetric matrices encode antisymmetric coupling and generate rotations under matrix exponentials.",
    useCases: [
      "Cross-product and rotational dynamics models",
      "Lie algebra representation in rigid-body systems",
      "Energy-preserving coupling terms",
    ],
    pitfalls: [
      "Expecting nonzero diagonal entries",
      "Applying symmetric-matrix theorems directly",
    ],
    quickCheck: "Verify A^T + A = 0.",
  },
  orthogonalmatrix: {
    deeper:
      "Orthogonal matrices are distance-preserving isometries and are highly stable numerically.",
    useCases: [
      "Rotations/reflections in geometry pipelines",
      "Stable basis changes in QR algorithms",
      "Signal transforms preserving energy",
    ],
    pitfalls: [
      "Forgetting column normalization in approximate Q",
      "Treating near-orthogonal as exact in long products",
    ],
    quickCheck: "Compute ||Q^TQ - I||.",
  },
  stochastic: {
    deeper:
      "Stochastic matrices are Markov transition operators preserving total probability mass under evolution.",
    useCases: [
      "Markov chain modeling",
      "PageRank and random walk algorithms",
      "Population transition systems",
    ],
    pitfalls: [
      "Allowing negative probabilities from numeric errors",
      "Mixing row-stochastic and column-stochastic conventions",
    ],
    quickCheck: "Rows are nonnegative and each row sum is 1.",
  },
  doublystochastic: {
    deeper:
      "Doubly stochastic matrices represent balanced transport/mixing and lie in the Birkhoff polytope.",
    useCases: [
      "Assignment relaxations",
      "Balanced diffusion and mixing models",
      "Entropic transport formulations",
    ],
    pitfalls: [
      "Checking only row sums and forgetting column sums",
      "Ignoring tolerance when sums are near 1 numerically",
    ],
    quickCheck: "Both row sums and column sums are 1.",
  },
  diagonaldominant: {
    deeper:
      "Diagonal dominance often implies invertibility/stability and supports convergence guarantees for iterative methods.",
    useCases: [
      "Convergence checks for Jacobi/Gauss-Seidel",
      "Finite-difference PDE system diagnostics",
      "Preconditioner quality heuristics",
    ],
    pitfalls: [
      "Assuming weak diagonal dominance always guarantees invertibility",
      "Ignoring ordering/permutation effects on dominance",
    ],
    quickCheck: "Compare each |a_ii| to row off-diagonal absolute sum.",
  },
  sparse: {
    deeper:
      "Sparse matrices shift complexity from dense algebra to graph-aware storage and computation patterns.",
    useCases: [
      "Large graph and network algorithms",
      "PDE discretizations at scale",
      "Memory-efficient linear algebra in ML",
    ],
    pitfalls: [
      "Using dense routines on sparse structures",
      "Ignoring fill-in during factorization",
    ],
    quickCheck: "Compute sparsity ratio nnz/(m*n).",
  },
  toeplitz: {
    deeper:
      "Toeplitz structure captures shift invariance and enables fast structured linear algebra.",
    useCases: [
      "Convolution and filtering systems",
      "Time-series covariance/autocorrelation modeling",
      "Fast structured solves with specialized algorithms",
    ],
    pitfalls: [
      "Breaking diagonal constancy during updates",
      "Applying generic dense methods without exploiting structure",
    ],
    quickCheck: "Entries are constant on every i-j diagonal.",
  },
  laplacian: {
    deeper:
      "Graph Laplacians encode connectivity, smoothness, and diffusion behavior over networked systems.",
    useCases: [
      "Spectral clustering",
      "Graph signal smoothing and regularization",
      "Connectivity and cut analysis",
    ],
    pitfalls: [
      "Mixing normalized and unnormalized Laplacian formulas",
      "Misinterpreting multiplicity of zero eigenvalue",
    ],
    quickCheck:
      "For undirected graphs, L is symmetric with nonnegative spectrum.",
  },
  covariancematrix: {
    deeper:
      "Covariance matrices summarize multivariate spread and linear dependence; they are symmetric PSD by construction.",
    useCases: [
      "PCA and dimensionality reduction",
      "Uncertainty propagation and Gaussian modeling",
      "Portfolio/risk and sensor fusion analysis",
    ],
    pitfalls: [
      "Using uncentered data to compute covariance",
      "Interpreting covariance scale without normalization",
    ],
    quickCheck: "Diagonal entries are variances and must be nonnegative.",
  },
};

export const CONCEPT_EXPANSIONS = {
  rank: {
    algebraic:
      "Rank(A) equals both dim(Col(A)) and dim(Row(A)). For an m x n matrix, rank is at most min(m,n), and rank + nullity = n.",
    computation:
      "Exact: row-reduce and count pivots. Numerical: use singular values and threshold tiny ones as zero to get numerical rank.",
    workedExample:
      "A = [[1,2],[2,4]] has one pivot, so rank = 1 and nullity = 1.",
    connections: [
      "Null space via rank-nullity",
      "SVD nonzero singular values",
      "Column space dimension",
    ],
  },
  determinant: {
    algebraic:
      "det(AB) = det(A)det(B), det(A^T) = det(A), and det(A^-1) = 1/det(A). det = 0 iff the map collapses dimension.",
    computation:
      "Compute via LU with pivoting: det(A) = sign(P) times product of diagonal entries of U for P A = L U.",
    workedExample:
      "A = [[2,1],[5,3]] gives det = 2*3 - 1*5 = 1, so A is invertible.",
    connections: [
      "Invertibility test",
      "Product of eigenvalues",
      "Jacobian volume scaling",
    ],
  },
  eigenvalues: {
    algebraic:
      "Eigenvalues are roots of det(A - lambda I) = 0. Algebraic multiplicity comes from the polynomial, geometric multiplicity from eigenspace dimension.",
    computation:
      "Small matrices: solve characteristic polynomial. Large dense matrices: QR-based eigenvalue algorithms.",
    workedExample:
      "A = [[3,0],[0,0.5]] has eigenvalues 3 and 0.5 along e1 and e2.",
    connections: [
      "Trace is eigenvalue sum",
      "Determinant is eigenvalue product",
      "Diagonalization needs eigenvectors",
    ],
  },
  nullspace: {
    algebraic:
      "Null(A) = {x : Ax = 0} is a subspace of input space. Its dimension is nullity and measures how many directions are lost.",
    computation:
      "Solve Ax = 0 after row reduction. Free variables define a basis for nullspace.",
    workedExample: "For [[1,2],[2,4]], x1 = -2x2, so Null(A) = span{(-2,1)}.",
    connections: [
      "Rank-nullity identity",
      "Kernel in linear maps",
      "Underdetermined solution sets",
    ],
  },
  trace: {
    algebraic:
      "Trace is linear and basis-invariant under similarity transforms. It equals the sum of eigenvalues with multiplicity.",
    computation: "Just add diagonal entries; no elimination needed.",
    workedExample: "A = [[4,1],[2,-1]] has trace 3.",
    connections: [
      "Eigenvalue sum",
      "Matrix calculus identities",
      "Dynamical-system summary",
    ],
  },
  transpose: {
    algebraic:
      "(AB)^T = B^T A^T and (A^T)^T = A. Transpose is the adjoint under the standard dot product.",
    computation:
      "Swap rows and columns; in performance code, prefer transposed views when available.",
    workedExample: "[[1,4,7],[2,5,8]]^T = [[1,2],[4,5],[7,8]].",
    connections: [
      "Normal equations A^T A",
      "Orthogonal inverse Q^T",
      "Symmetry condition A = A^T",
    ],
  },
  inverse: {
    algebraic:
      "A^-1 exists only for square full-rank matrices. Then Ax = b has unique solution for every b.",
    computation:
      "Prefer solving systems via LU/QR/SVD rather than explicitly forming A^-1.",
    workedExample: "A = [[2,1],[1,1]] has inverse [[1,-1],[-1,2]].",
    connections: [
      "det(A) != 0 criterion",
      "Conditioning and error amplification",
      "Undoing transformations",
    ],
  },
  identity: {
    algebraic:
      "Identity I satisfies I x = x and A I = I A = A for compatible sizes.",
    computation:
      "Construct with ones on the diagonal and zeros elsewhere; size must match the space/operator side.",
    workedExample: "For any A in R^(m x n), A I_n = A and I_m A = A.",
    connections: [
      "Neutral element under multiplication",
      "Inverse definitions",
      "Basis vectors fixed pointwise",
    ],
  },
  multiplication: {
    algebraic:
      "Multiplication is composition: (BA)x = B(Ax). Associative, but generally not commutative.",
    computation:
      "Use row-by-column dot products or block multiplication for structure and efficiency.",
    workedExample:
      "If A scales then B rotates, BA represents rotate-after-scale as one matrix.",
    connections: [
      "Transformation pipelines",
      "Non-commutativity",
      "Matrix powers and exponentials",
    ],
  },
  noncommute: {
    algebraic:
      "Commutator [A,B] = AB - BA measures order mismatch. Zero commutator means the pair commutes.",
    computation:
      "Compare AB and BA numerically or evaluate both on a basis to reveal differences.",
    workedExample:
      "A shear and a rotation usually produce different outputs when their order is swapped.",
    connections: [
      "Operator algebra",
      "Order-sensitive modeling",
      "Lie-theoretic structures",
    ],
  },
  span: {
    algebraic:
      "Span(v1,...,vk) is the smallest subspace containing the vectors, i.e., all linear combinations of them.",
    computation:
      "To test b in span(columns of A), check rank(A) = rank([A|b]) or solve Ax = b.",
    workedExample: "(1,0),(0,1) span R^2; (1,0),(2,0) span only a line.",
    connections: [
      "Basis combines span + independence",
      "Column space concept",
      "Least-squares target space",
    ],
  },
  orthogonal: {
    algebraic:
      "u and v are orthogonal when u^T v = 0. Matrix Q is orthogonal when Q^T Q = I, preserving lengths and angles.",
    computation: "Check pairwise dot products and unit norms for columns.",
    workedExample: "u=(1,2), v=(2,-1) gives u.v = 0.",
    connections: [
      "QR factorization",
      "Projection residual orthogonality",
      "Rotations/reflections",
    ],
  },
  projection: {
    algebraic:
      "Orthogonal projector onto span(U): P = U(U^T U)^-1 U^T. For orthogonal projection, P^2 = P and P = P^T.",
    computation:
      "1D case: proj_u(v) = (u^T v / u^T u)u. Higher dimensions use matrix projector.",
    workedExample: "Project (3,1) onto (1,1): coefficient 2, result (2,2).",
    connections: [
      "Least squares geometry",
      "Orthogonality",
      "Idempotent matrices",
    ],
  },
  norm: {
    algebraic:
      "Norms induce distance and topology. In finite dimensions norms are equivalent, but they penalize structure differently.",
    computation:
      "L2: sqrt(sum squares), L1: sum abs values, Linf: max abs component.",
    workedExample: "For (3,-4): L2=5, L1=7, Linf=4.",
    connections: [
      "Regularization choices",
      "Condition number dependence",
      "Error metrics",
    ],
  },
  svd: {
    algebraic:
      "A = U Sigma V^T with orthogonal U,V and nonnegative singular values in Sigma. Singular vectors give principal action directions.",
    computation:
      "Use thin/truncated SVD to reduce compute and keep dominant modes.",
    workedExample:
      "If singular values are 10,2,0.1, a rank-2 approximation keeps most signal and drops weak mode.",
    connections: [
      "Rank from nonzero singular values",
      "Condition number from sigma ratio",
      "Pseudoinverse",
    ],
  },
  diagonalization: {
    algebraic:
      "A = P D P^-1 means coordinates in eigenbasis decouple into independent scalings by diagonal entries of D.",
    computation:
      "Find eigenvectors; diagonalization works iff eigenvector matrix P is full rank.",
    workedExample:
      "For diagonal A, P=I and powers are immediate: A^k diagonal with entrywise powers.",
    connections: [
      "Eigenstructure",
      "Matrix powers",
      "Symmetric spectral theorem",
    ],
  },
  lu: {
    algebraic:
      "P A = L U stores elimination in L and triangular structure in U. Reusing factors makes repeated solves efficient.",
    computation: "Forward solve Ly=b, then backward solve Ux=y.",
    workedExample: "One LU factorization can solve Ax=b1,b2,... cheaply.",
    connections: [
      "Direct solvers",
      "Determinant from U diagonal",
      "Pivoting for stability",
    ],
  },
  qr: {
    algebraic:
      "A = Q R separates orthonormal basis directions (Q) from coordinates (R).",
    computation: "Householder QR is the standard stable implementation.",
    workedExample:
      "Least squares becomes Rx = Q^T b, solved by back substitution.",
    connections: ["Orthogonality", "Least squares", "Eigenvalue QR iteration"],
  },
  cholesky: {
    algebraic:
      "For SPD A, there exists unique lower-triangular L with positive diagonal such that A = L L^T.",
    computation:
      "Compute L entry-by-entry; solve Ax=b using Ly=b then L^T x=y.",
    workedExample: "A=[[4,2],[2,3]] yields L=[[2,0],[1,sqrt(2)]].",
    connections: [
      "Positive definiteness",
      "Fast SPD solves",
      "Covariance factorization",
    ],
  },
  posdef: {
    algebraic:
      "For symmetric A, x^T A x > 0 for all x != 0 is equivalent to all eigenvalues positive and to a Cholesky factorization.",
    computation:
      "Attempt Cholesky; success indicates positive definiteness (under symmetry).",
    workedExample:
      "[[2,1],[1,2]] has eigenvalues 3 and 1, so it is positive definite.",
    connections: [
      "Convex quadratic optimization",
      "Cholesky methods",
      "Covariance structure",
    ],
  },
  symmetric: {
    algebraic:
      "Real symmetric matrices satisfy A = Q Lambda Q^T with real eigenvalues and orthonormal eigenvectors.",
    computation:
      "Use symmetric eigensolvers for better stability and speed than generic routines.",
    workedExample: "[[2,1],[1,2]] diagonalizes with orthonormal eigenvectors.",
    connections: [
      "Spectral theorem",
      "Positive-definite tests",
      "Covariance/Hessian matrices",
    ],
  },
  condition: {
    algebraic:
      "Condition number measures problem sensitivity: relative output error can scale roughly by kappa times relative input error.",
    computation:
      "In 2-norm, kappa = sigma_max / sigma_min. Improve by scaling and preconditioning when possible.",
    workedExample:
      "kappa = 10^6 implies tiny data noise can massively perturb computed answers.",
    connections: ["Near singularity", "SVD", "Numerical stability limits"],
  },
  pseudoinverse: {
    algebraic:
      "A^+ is defined by Moore-Penrose conditions and equals V Sigma^+ U^T via SVD.",
    computation:
      "Compute SVD, invert only nonzero singular values, and optionally truncate tiny ones for stability.",
    workedExample:
      "For rank-deficient A, x*=A^+b gives least-squares fit with minimal Euclidean norm.",
    connections: [
      "Least squares projection",
      "SVD truncation/regularization",
      "Generalized inverses",
    ],
  },
  linindep: {
    algebraic:
      "Independence means only trivial coefficients solve c1v1 + ... + ckvk = 0. It guarantees unique representation in the span.",
    computation:
      "Stack vectors as columns and check pivot columns after row reduction.",
    workedExample:
      "(1,2) and (2,4) are dependent; (1,2) and (2,1) are independent.",
    connections: [
      "Basis construction",
      "Rank",
      "Determinant test in square case",
    ],
  },
  basis: {
    algebraic:
      "A basis is a minimal spanning set and maximal independent set. Coordinates are unique once a basis is fixed.",
    computation:
      "Start from a spanning set and remove dependent vectors using elimination to get a basis.",
    workedExample:
      "Standard basis and rotated basis both represent the same vectors with different coordinates.",
    connections: [
      "Dimension",
      "Change of basis",
      "Eigen/SVD coordinate systems",
    ],
  },
  diagonal: {
    algebraic:
      "Diagonal matrices satisfy D_ij = 0 for i != j and act as coordinate-wise scalings.",
    computation:
      "Multiply/invert/power entrywise on the diagonal; complexity is linear in dimension.",
    workedExample: "D=diag(2,0.5,-1) scales x1 by 2, x2 by 0.5, and flips x3.",
    connections: [
      "Diagonalization target form",
      "Eigenvalues as diagonal entries",
      "Fast matrix functions",
    ],
  },
  triangular: {
    algebraic:
      "Upper/lower triangular matrices preserve one-sided dependency and have eigenvalues on the diagonal.",
    computation:
      "Solve Ux=b by backward substitution or Lx=b by forward substitution.",
    workedExample: "For U=[[2,1],[0,3]], det(U)=2*3 and eigenvalues are 2,3.",
    connections: [
      "LU and Cholesky factors",
      "Determinant from diagonal product",
      "Substitution-based solves",
    ],
  },
  permutation: {
    algebraic:
      "Permutation matrices represent elements of the symmetric group acting on coordinate indices.",
    computation:
      "Apply P by index reordering instead of dense multiplication for efficiency.",
    workedExample:
      "P swapping first two rows gives P[x1,x2,x3]^T = [x2,x1,x3]^T.",
    connections: [
      "Pivot matrices in LU",
      "Orthogonal matrix subclass",
      "Doubly stochastic extreme points",
    ],
  },
  idempotent: {
    algebraic:
      "Idempotent condition A^2=A implies minimal polynomial divides x(x-1), so eigenvalues are 0 or 1.",
    computation:
      "Evaluate A^2-A; small norm confirms approximate idempotence numerically.",
    workedExample: "P = u(u^Tu)^-1u^T is idempotent projection onto span(u).",
    connections: [
      "Projection operators",
      "Rank-trace relation",
      "Subspace decomposition",
    ],
  },
  nilpotent: {
    algebraic:
      "Nilpotent A has only zero eigenvalues and Jordan blocks with zero diagonal.",
    computation:
      "Compute successive powers A, A^2, ... until zero pattern appears.",
    workedExample: "N=[[0,1],[0,0]] satisfies N^2=0 but N!=0.",
    connections: ["Jordan canonical form", "Transient dynamics", "Singularity"],
  },
  involutory: {
    algebraic:
      "Involutory condition A^2=I implies eigenvalues are ±1 and A^-1=A.",
    computation:
      "Test with one multiplication: if A^2 close to I, transformation is self-reversing.",
    workedExample: "Reflection matrix R=diag(1,-1) is involutory.",
    connections: [
      "Reflections as orthogonal involutions",
      "Self-inverse transforms",
      "Eigenvalue sign structure",
    ],
  },
  skewsymmetric: {
    algebraic:
      "Skew-symmetry A^T=-A forces zero diagonal and purely imaginary eigenvalues in complex view.",
    computation: "Compute A+A^T and verify near-zero matrix under tolerance.",
    workedExample: "A=[[0,-w],[w,0]] generates planar rotation flow.",
    connections: [
      "Rotation generators",
      "Matrix exponentials to orthogonal maps",
      "Antisymmetric coupling",
    ],
  },
  orthogonalmatrix: {
    algebraic: "Orthogonal matrices preserve inner products: (Qx)^T(Qy)=x^Ty.",
    computation:
      "Check Q^TQ and QQ^T against identity; monitor orthogonality loss in long products.",
    workedExample: "2D rotation matrix keeps vector length exactly unchanged.",
    connections: [
      "QR and SVD orthogonal factors",
      "Stable basis transforms",
      "Determinant ±1",
    ],
  },
  stochastic: {
    algebraic:
      "Row-stochastic matrices are linear operators on probability vectors with simplex-preserving rows.",
    computation:
      "Check nonnegativity and row sums; iterate x_{k+1}=x_k A to inspect stationary behavior.",
    workedExample:
      "Transition matrix for weather states gives next-day distribution from current distribution.",
    connections: [
      "Markov chains",
      "Stationary distributions",
      "Spectral mixing rates",
    ],
  },
  doublystochastic: {
    algebraic:
      "Doubly stochastic matrices preserve the all-ones vector on both sides and form convex hull of permutations.",
    computation:
      "Normalize/check both row and column sums with tolerance in floating-point implementations.",
    workedExample:
      "Matrix with each entry 1/n is doubly stochastic and fully mixing.",
    connections: [
      "Birkhoff-von Neumann decomposition",
      "Balanced transport maps",
      "Permutation matrices",
    ],
  },
  diagonaldominant: {
    algebraic:
      "Strict diagonal dominance (>) implies nonsingularity via Gershgorin-based arguments.",
    computation: "Compute dominance margins |a_ii|-sum_{j!=i}|a_ij| row-wise.",
    workedExample:
      "A tridiagonal PDE matrix often satisfies diagonal dominance and convergent iterative solves.",
    connections: [
      "Iterative solver convergence",
      "Stability diagnostics",
      "Gershgorin discs",
    ],
  },
  sparse: {
    algebraic:
      "Sparse matrices are best understood through graph structure induced by nonzero patterns.",
    computation:
      "Store with CSR/CSC formats and use sparse-optimized multiplication/factorization.",
    workedExample:
      "Finite-element stiffness matrices can be millions-by-millions but very sparse.",
    connections: [
      "Graph Laplacians",
      "Fill-in during elimination",
      "Scalable linear solvers",
    ],
  },
  toeplitz: {
    algebraic:
      "Toeplitz matrices encode shift-invariant linear systems with diagonal-constant structure.",
    computation:
      "Exploit structured methods (FFT/circulant embedding variants) for faster operations.",
    workedExample:
      "1D convolution with fixed kernel corresponds to Toeplitz multiplication.",
    connections: [
      "Signal processing",
      "Autocorrelation matrices",
      "Structured linear algebra",
    ],
  },
  laplacian: {
    algebraic:
      "Laplacian L=D-A has row sums zero and PSD spectrum for undirected graphs.",
    computation:
      "Build D from node degrees and subtract adjacency; inspect eigenvalues for connectivity.",
    workedExample:
      "Second-smallest eigenvalue (Fiedler value) indicates graph connectivity strength.",
    connections: [
      "Spectral clustering",
      "Diffusion/random walks",
      "Graph regularization",
    ],
  },
  covariancematrix: {
    algebraic:
      "Covariance matrix Sigma = E[(x-mu)(x-mu)^T] is symmetric PSD and defines ellipsoidal uncertainty geometry.",
    computation:
      "Center data first, then compute sample covariance and possibly regularize/shrink.",
    workedExample:
      "Large off-diagonal covariance indicates strong linear co-movement between variables.",
    connections: [
      "PCA eigenstructure",
      "Mahalanobis distance",
      "Gaussian modeling",
    ],
  },
};
