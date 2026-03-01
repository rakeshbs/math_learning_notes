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
};
