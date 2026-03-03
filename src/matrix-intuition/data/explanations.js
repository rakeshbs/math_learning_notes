export const EXPLANATIONS = {
  rank: {
    what: "The rank of a matrix is the number of linearly independent columns (or rows). It tells you the dimension of the output space when the matrix acts as a transformation.",
    visual:
      "If two arrows point in truly different directions, they span a 2D plane (rank 2). If parallel, they only span a line (rank 1). If zero, everything collapses to a point (rank 0).",
    intuition: [
      "Rank = how many dimensions survive after transformation",
      "Full rank means no information is lost",
      "Low rank means the matrix flattens space, losing dimensions",
      "Rank tells you how many equations in Ax = b are truly independent",
      "Row rank always equals column rank — a deep symmetry of linear algebra",
      "rank(A^T A) = rank(A): squaring a matrix doesn't change its rank",
      "An n×n matrix is invertible if and only if its rank equals n",
    ],
    formula: "rank(A) = dim(Col(A)) = number of pivots in RREF",
  },
  determinant: {
    what: "The determinant measures how a matrix scales area (2D) or volume (3D). It captures both the scaling factor and whether orientation is preserved or flipped.",
    visual:
      "The unit square transforms into a parallelogram. Its area is |det(A)|. If det < 0, the orientation has flipped like a mirror image.",
    intuition: [
      "det = 0 means space is collapsed, matrix not invertible",
      "|det| > 1 means space is expanded",
      "|det| < 1 means space is compressed",
      "det < 0 means orientation is flipped",
      "det(AB) = det(A) det(B): volume scaling is multiplicative under composition",
      "det(A^T) = det(A): row and column operations have the same scaling effect",
      "det = product of all eigenvalues (with algebraic multiplicity)",
    ],
    formula: "det([[a,b],[c,d]]) = ad - bc",
  },
  eigenvalues: {
    what: "An eigenvector is a direction that does not rotate under transformation, it only scales. The eigenvalue lambda tells you by how much. Av = lambda v.",
    visual:
      "Most vectors change direction under A. But eigenvectors stay on their original line and just stretch or shrink. Green and teal arrows are eigenvectors; gray vectors rotate.",
    intuition: [
      "Eigenvectors are the natural axes of the transformation",
      "lambda > 1 means stretching, 0 < lambda < 1 means compression",
      "lambda < 0 means the direction flips through origin",
      "lambda = 0 means that direction is crushed to zero",
      "Symmetric matrices always have REAL eigenvalues and orthogonal eigenvectors",
      "Sum of all eigenvalues = trace(A); product of all eigenvalues = det(A)",
      "Repeated eigenvalues may or may not have enough eigenvectors to diagonalize",
    ],
    formula: "Av = lambda v implies det(A - lambda I) = 0",
  },
  nullspace: {
    what: "The null space (kernel) is all vectors v where Av = 0. These inputs get destroyed by the matrix, mapped to zero.",
    visual:
      "Imagine a flashlight projecting onto a line. Points perpendicular to that line all collapse to origin. The null space IS that perpendicular direction.",
    intuition: [
      "Null space = everything the matrix forgets",
      "If null space is only the zero vector, the matrix is one-to-one",
      "Larger null space means more information lost",
      "Rank + Nullity = number of columns (rank-nullity theorem)",
      "Null space and row space are orthogonal complements in R^n",
      "An invertible matrix's null space contains only the zero vector",
    ],
    formula: "Null(A) = {v in R^n : Av = 0}",
  },
  trace: {
    what: "The trace is the sum of diagonal entries of a square matrix. It captures the total stretching along coordinate axes.",
    visual:
      "Each diagonal entry scales one axis. The trace adds all individual scalings. The animated box shows how diagonal entries control axis-aligned stretching.",
    intuition: [
      "trace(A) = sum of ALL eigenvalues (with multiplicity)",
      "trace(AB) = trace(BA), cyclic order does not matter",
      "For rotation matrices, trace = 2cos(theta) in 2D",
      "Invariant under change of basis (similarity transform)",
      "tr(A^T A) = sum of all squared entries = Frobenius norm squared",
      "tr(ABC) = tr(BCA) = tr(CAB): cyclic permutation preserves trace",
    ],
    formula: "tr(A) = a_11 + a_22 + ... + a_nn = sum of lambda_i",
  },
  transpose: {
    what: "The transpose flips a matrix over its diagonal: rows become columns. Entry (i,j) moves to (j,i).",
    visual:
      "The colored cells swap positions. A 2x3 matrix becomes 3x2. Each color tracks where an entry moves.",
    intuition: [
      "If A maps R^n to R^m, then A^T maps R^m to R^n",
      "Symmetric means A = A^T",
      "(AB)^T = B^T A^T, order reverses",
      "A^T A is always symmetric positive semi-definite",
    ],
    formula: "(A^T)_ij = A_ji",
  },
  inverse: {
    what: "The inverse A^-1 undoes A. Applying A then A^-1 returns to the start. Exists only when det(A) is not 0.",
    visual:
      "Watch the shape morph forward under A, then morph backward under A^-1, returning to its original form.",
    intuition: [
      "A^-1 A = A A^-1 = I, the identity",
      "det(A) = 0 means some dimension was crushed, cannot undo",
      "(AB)^-1 = B^-1 A^-1, undoing in reverse order",
      "Computationally expensive for large matrices — prefer solving Ax = b directly",
      "(A^T)^-1 = (A^-1)^T: inverse and transpose commute",
      "Ill-conditioned A can have an inverse but still produce huge errors numerically",
    ],
    formula: "A^-1 exists iff det(A) != 0 ; A A^-1 = I",
  },
  identity: {
    what: "The identity matrix I leaves every vector unchanged. It is the neutral element of matrix multiplication.",
    visual:
      "The input arrow and output arrow overlap exactly. Nothing rotates, stretches, or reflects under I.",
    intuition: [
      "I x = x for every vector x",
      "A I = I A = A for compatible dimensions",
      "Identity keeps basis vectors fixed",
      "Inverse definitions use identity: A A^-1 = I",
    ],
    formula: "I_n x = x ; A I_n = I_m A = A",
  },
  multiplication: {
    what: "Matrix multiplication composes linear transformations. Multiplying matrices means applying one transformation after another.",
    visual:
      "A shape first transforms by A, then by B. The final result matches a single combined matrix BA.",
    intuition: [
      "Applying A then B equals BA (right-to-left on vectors)",
      "Composition is associative: C(BA) = (CB)A",
      "Columns of BA are B acting on columns of A",
      "Multiplication combines geometry into one map",
    ],
    formula: "x -> A x -> B(Ax) = (BA)x",
  },
  noncommute: {
    what: "Most matrix products do not commute. Changing order usually changes the transformation and output.",
    visual:
      "The same starting vector follows two paths: AB and BA. Endpoints differ, showing order sensitivity.",
    intuition: [
      "Usually AB != BA",
      "Commuting matrices are special, not typical",
      "Order encodes operation sequence",
      "Commutator quantifies mismatch",
    ],
    formula: "[A,B] = AB - BA ; generally [A,B] != 0",
  },
  span: {
    what: "The column space is all possible outputs Ax. It is the span of column vectors, every reachable point by combining them.",
    visual:
      "Each column is an arrow. The dots show everything reachable by scaling and adding these arrows. Two independent vectors in 2D reach everywhere.",
    intuition: [
      "Column space dimension = rank",
      "Ax = b is solvable iff b is in column space",
      "Full column rank spans the entire output space",
      "Column space is perpendicular to left null space",
    ],
    formula: "Col(A) = {Ax : x in R^n} = span(columns)",
  },
  orthogonal: {
    what: "Two vectors are orthogonal if their dot product is zero, meaning perfectly perpendicular. An orthogonal matrix Q has mutually perpendicular unit columns: Q^T Q = I.",
    visual:
      "The right-angle marker shows 90 degrees. The dot product measures alignment; zero means no shared component in the same direction.",
    intuition: [
      "u dot v = 0 means orthogonal (perpendicular)",
      "Orthogonal matrices preserve lengths and angles",
      "Q^-1 = Q^T, the transpose IS the inverse",
      "Rotations and reflections are orthogonal transformations",
    ],
    formula: "u dot v = sum(u_i * v_i) = ||u|| ||v|| cos(theta) = 0",
  },
  projection: {
    what: "A projection maps every vector onto a subspace by dropping it straight down. The projection of v onto u is the shadow of v in the direction of u.",
    visual:
      "The dashed line drops perpendicularly from the original vector to its shadow on the line. The shadow point is the projection.",
    intuition: [
      "proj_u(v) = (u dot v / u dot u) times u",
      "The error (v minus proj) is perpendicular to the subspace",
      "Projection matrices satisfy P^2 = P (idempotent) and P = P^T (symmetric)",
      "Least squares regression IS a projection onto the column space of A",
      "The projection of b onto Col(A) is the closest point in the reachable output space",
      "Complementary projections: I - P projects onto the orthogonal complement",
    ],
    formula: "proj_u(v) = (u^T v / u^T u) u",
  },
  norm: {
    what: "A norm measures vector size. L2 (Euclidean) is plain distance. L1 (Manhattan) sums absolute values. Different norms give different unit ball shapes.",
    visual:
      "The circle is all vectors with equal L2 norm. The diamond is equal L1 norm. Different norms define different geometries of distance.",
    intuition: [
      "L2 norm: sqrt(sum of squares), Euclidean distance",
      "L1 norm: sum of absolute values, taxi cab distance",
      "L-infinity norm: max absolute component, unit ball is a square",
      "In ML: L1 promotes sparsity, L2 promotes smoothness",
    ],
    formula: "||v||_2 = sqrt(v_1^2 + v_2^2 + ... + v_n^2)",
  },
  svd: {
    what: "SVD decomposes any m×n matrix A into three simple pieces: A = U Sigma V^T. The orthogonal matrix V^T rotates the input space to align with principal input directions. The diagonal Sigma stretches each aligned axis by its singular value sigma_i >= 0. The orthogonal U rotates the result into the output space. Every linear map, regardless of shape or rank, is exactly: rotate input, stretch independently per axis, rotate output.",
    visual:
      "Imagine a unit circle in 2D input space. Step 1 (V^T): rotate it so principal input directions align with coordinate axes. Step 2 (Sigma): stretch each axis by sigma_i, inflating the circle into an ellipse. Step 3 (U): rotate the ellipse into its final orientation in output space. The semi-axis lengths of the final ellipse ARE the singular values. The longest axis is the direction A stretches the most.",
    intuition: [
      "Works for ANY m×n matrix — rectangular, singular, or rank-deficient",
      "V columns (right singular vectors): orthonormal input principal directions",
      "U columns (left singular vectors): orthonormal output principal directions",
      "A v_i = sigma_i u_i: input direction v_i maps to output direction u_i scaled by sigma_i",
      "Singular values sigma_1 >= sigma_2 >= ... >= 0 are always real, nonneg, and ordered",
      "rank(A) = number of strictly nonzero singular values",
      "Condition number kappa = sigma_1 / sigma_r: ratio of largest to smallest nonzero singular value",
      "Eckart-Young theorem: best rank-k approx is A_k = sum_{i=1}^{k} sigma_i u_i v_i^T",
      "PCA = SVD of the centered data matrix X (columns of V are the principal components)",
      "Pseudoinverse A^+ = V Sigma^+ U^T, where Sigma^+ inverts only nonzero singular values",
    ],
    formula: "A = U Sigma V^T = sum_i sigma_i u_i v_i^T  where  sigma_i = sqrt(lambda_i(A^T A))",
  },
  diagonalization: {
    what: "A matrix is diagonalizable if you can change coordinates into an eigenvector basis where the action becomes simple axis scaling.",
    visual:
      "A moving vector is decomposed along eigen-directions. In that basis each component scales independently, then you rotate back to original coordinates.",
    intuition: [
      "A = P D P^-1 means change basis, scale, change back",
      "Diagonalization is possible when there are enough independent eigenvectors",
      "P columns are eigenvectors, D stores eigenvalues",
      "Powers A^k become easy: A^k = P D^k P^-1",
    ],
    formula: "A = P D P^-1 with D diagonal and Av_i = lambda_i v_i",
  },
  lu: {
    what: "LU factorization writes A as L times U, where L is lower triangular and U is upper triangular. It separates elimination steps from final triangular system solve.",
    visual:
      "Watch a square first shear under L, then get stretched/combined under U. Together they reproduce the full transform A.",
    intuition: [
      "LU lets you solve Ax=b quickly for many different b",
      "Forward substitution solves Ly=b, then backward substitution solves Ux=y",
      "Pivoting improves numerical stability",
      "LU is the engine behind many linear solvers",
    ],
    formula: "A = L U (or P A = L U with pivoting)",
  },
  qr: {
    what: "QR factorization writes A as Q R, where Q has orthonormal columns and R is upper triangular. It separates geometry (rotation/reflection) from coordinates.",
    visual:
      "Non-orthogonal columns are re-expressed as perpendicular unit directions (Q), then R stores how to recombine those directions.",
    intuition: [
      "QR is numerically stable for least squares",
      "Q preserves lengths and angles",
      "R captures coordinate coefficients in the orthonormal basis",
      "Householder QR is standard in robust solvers",
    ],
    formula: "A = Q R with Q^T Q = I and R upper triangular",
  },
  cholesky: {
    what: "Cholesky factorization writes a symmetric positive definite matrix as A = L L^T, where L is lower triangular.",
    visual:
      "A unit shape is transformed by L, then by L^T. Together they produce the full SPD transformation.",
    intuition: [
      "Only for symmetric positive definite matrices",
      "Faster and stabler than generic LU for SPD systems",
      "Solving Ax=b becomes two triangular solves",
      "Acts like a matrix square-root factorization",
    ],
    formula: "A = L L^T with L lower triangular and diag(L) > 0",
  },
  posdef: {
    what: "A symmetric matrix is positive definite if x^T A x > 0 for every nonzero x. The quadratic form is a bowl that always curves upward.",
    visual:
      "Elliptical contours show level curves of x^T A x = constant. Both eigenvalues positive means a single minimum at origin, no saddle points.",
    intuition: [
      "All eigenvalues strictly positive",
      "Quadratic form x^T A x is a bowl (global minimum at origin)",
      "Positive semi-definite (PSD): eigenvalues >= 0 — some directions may be flat",
      "Hessian is pos-def at a critical point means it is a local (and often global) minimum",
      "Covariance matrices are always PSD; strictly PD when data has no redundant features",
      "A^T A is always PSD; strictly PD when A has full column rank",
    ],
    formula: "A > 0 iff lambda_i > 0 for all i iff x^T A x > 0 for all x != 0",
  },
  symmetric: {
    what: "A matrix is symmetric if A = A^T, meaning entry (i,j) equals entry (j,i). Perfectly mirrored across the main diagonal.",
    visual:
      "Watch highlighted pairs: each off-diagonal element equals its mirror. The diagonal is the line of symmetry.",
    intuition: [
      "Symmetric matrices have ALL real eigenvalues — no complex numbers",
      "Eigenvectors for distinct eigenvalues are always orthogonal",
      "Spectral theorem: A = Q Lambda Q^T with orthonormal columns in Q",
      "Covariance matrices, Hessians, and graph Laplacians are all symmetric",
      "Symmetry is preserved under linear combinations and matrix functions",
      "Any matrix can be split: A = sym + skew = (A + A^T)/2 + (A - A^T)/2",
    ],
    formula: "A = A^T iff a_ij = a_ji ; A = Q Lambda Q^T",
  },
  diagonal: {
    what: "A diagonal matrix has nonzero entries only on its main diagonal. It scales coordinate axes independently with no mixing.",
    visual:
      "Each axis is stretched by its diagonal value while all off-axis coupling stays zero.",
    intuition: [
      "Diagonal entries are direct per-coordinate scaling factors",
      "Eigenvalues are exactly the diagonal entries",
      "Powers and inverses are easy entrywise operations",
      "Diagonal form is the simplest linear operator representation",
    ],
    formula: "D_ij = 0 for i != j",
  },
  triangular: {
    what: "A triangular matrix has all entries above or below the diagonal equal to zero. It encodes directional dependency structure.",
    visual:
      "Influence flows one-way across indices: earlier coordinates can affect later ones (or vice versa), but not both.",
    intuition: [
      "Easy to solve with forward/back substitution",
      "Determinant is product of diagonal entries",
      "Eigenvalues are diagonal entries",
      "Central in LU and Cholesky factorizations",
    ],
    formula: "U_ij = 0 for i > j (upper), L_ij = 0 for i < j (lower)",
  },
  permutation: {
    what: "A permutation matrix reorders coordinates (or rows/columns). It has exactly one 1 in each row and column.",
    visual:
      "Entries of a vector are shuffled into new positions without changing their magnitudes.",
    intuition: [
      "Represents pure reindexing, no scaling",
      "Permutation matrices are orthogonal",
      "P^-1 = P^T",
      "Used for pivoting in stable elimination",
    ],
    formula: "P has one 1 per row/column and zeros elsewhere",
  },
  idempotent: {
    what: "An idempotent matrix satisfies A^2 = A. Applying it once already reaches the final effect.",
    visual:
      "First application projects onto a subspace; second application leaves points unchanged.",
    intuition: [
      "Projection matrices are canonical idempotent examples",
      "Eigenvalues are only 0 or 1",
      "Represents keep-or-kill subspace behavior",
      "Rank equals trace for idempotent matrices",
    ],
    formula: "A^2 = A",
  },
  nilpotent: {
    what: "A nilpotent matrix becomes zero after repeated multiplication by itself.",
    visual:
      "Each multiplication shifts energy toward zero until the transformation fully collapses.",
    intuition: [
      "All eigenvalues are zero",
      "Always singular",
      "Often appears in Jordan block structure",
      "Captures transient but non-persistent dynamics",
    ],
    formula: "A^k = 0 for some integer k > 0",
  },
  involutory: {
    what: "An involutory matrix is its own inverse. Applying it twice gives the identity.",
    visual:
      "One step flips/reflects state, second step returns exactly to the start.",
    intuition: [
      "A^-1 = A",
      "Eigenvalues are +1 or -1",
      "Reflections are common involutory examples",
      "Represents reversible two-state switching geometry",
    ],
    formula: "A^2 = I",
  },
  skewsymmetric: {
    what: "A skew-symmetric matrix satisfies A^T = -A. Off-diagonal entries are negatives of their mirrored partners.",
    visual:
      "Mirror entries cancel by sign, and diagonal entries are forced to zero.",
    intuition: [
      "All diagonal entries are zero",
      "x^T A x = 0 for real x",
      "In odd dimensions, determinant is zero",
      "Generates infinitesimal rotations in continuous systems",
    ],
    formula: "A^T = -A",
  },
  orthogonalmatrix: {
    what: "An orthogonal matrix has orthonormal columns, so it preserves lengths and angles exactly.",
    visual:
      "A shape rotates/reflects without distortion; only orientation or direction changes.",
    intuition: [
      "Q^T Q = I",
      "Q^-1 = Q^T",
      "Determinant is ±1",
      "Numerically stable in decomposition algorithms",
    ],
    formula: "Q^T Q = I",
  },
  stochastic: {
    what: "A stochastic matrix has nonnegative entries with each row summing to 1, representing transition probabilities.",
    visual:
      "Probability mass redistributes between states each step but total mass stays constant.",
    intuition: [
      "Rows are categorical distributions",
      "Used for Markov chains and random walks",
      "Repeated multiplication models long-run state evolution",
      "Largest eigenvalue is 1 under standard assumptions",
    ],
    formula: "a_ij >= 0 and sum_j a_ij = 1",
  },
  doublystochastic: {
    what: "A doubly stochastic matrix is stochastic by rows and columns: every row and every column sums to 1.",
    visual:
      "Mass is preserved globally and locally under both source and destination accounting.",
    intuition: [
      "Uniform vector is both left and right eigenvector for eigenvalue 1",
      "Represents balanced transport or mixing",
      "Includes permutation matrices as extreme points",
      "Appears in assignment and transport problems",
    ],
    formula: "a_ij >= 0, sum_j a_ij = 1, and sum_i a_ij = 1",
  },
  diagonaldominant: {
    what: "A matrix is diagonally dominant when each diagonal entry magnitude exceeds (or matches) the sum of off-diagonal magnitudes in its row.",
    visual:
      "Strong diagonal anchors each variable to itself more than to neighbors, improving stability.",
    intuition: [
      "Often nonsingular when strict",
      "Supports convergence of iterative solvers",
      "Common in discretized PDE systems",
      "Signals reduced cross-coupling strength",
    ],
    formula: "|a_ii| >= sum_{j!=i} |a_ij|",
  },
  sparse: {
    what: "A sparse matrix has mostly zero entries and a relatively small set of nonzero values.",
    visual:
      "Most cells are empty; only a structured subset carries interactions.",
    intuition: [
      "Storage and compute scale with nonzeros, not full size",
      "Graph and PDE problems naturally produce sparse matrices",
      "Sparsity pattern matters as much as values",
      "Specialized solvers exploit sparse structure",
    ],
    formula: "nnz(A) << m*n",
  },
  toeplitz: {
    what: "A Toeplitz matrix has constant values along each diagonal from top-left to bottom-right.",
    visual:
      "Diagonal bands repeat the same value, encoding shift-invariant structure.",
    intuition: [
      "Appears in convolution and time-invariant systems",
      "Defined by first row and first column only",
      "Supports fast algorithms with FFT-like structure",
      "Links directly to signal autocorrelation matrices",
    ],
    formula: "a_ij = c_{i-j}",
  },
  laplacian: {
    what: "The graph Laplacian L = D - A captures connectivity and flow on graphs.",
    visual:
      "Node values diffuse along edges; differences across neighbors are penalized.",
    intuition: [
      "Symmetric positive semidefinite for undirected graphs",
      "One zero eigenvalue per connected component",
      "Used in spectral clustering and graph smoothing",
      "Measures graph signal roughness",
    ],
    formula: "L = D - A",
  },
  covariancematrix: {
    what: "A covariance matrix stores pairwise covariances between variables, encoding spread and linear relationships.",
    visual:
      "Elliptical data clouds align with covariance eigenvectors, and axis lengths reflect variance scale.",
    intuition: [
      "Always symmetric positive semidefinite",
      "Diagonal entries are variances",
      "Off-diagonal entries measure linear co-movement",
      "Eigen-decomposition drives PCA",
    ],
    formula: "Sigma = E[(x-mu)(x-mu)^T]",
  },
  condition: {
    what: "The condition number measures how much relative output error can grow compared to relative input error. High condition number means unstable sensitivity.",
    visual:
      "Two almost identical input vectors map to outputs that separate a lot after transformation. Small input noise becomes large output error.",
    intuition: [
      "kappa(A) close to 1 is well-conditioned",
      "Large kappa(A) amplifies floating-point and measurement errors",
      "Near-singular matrices usually have huge condition numbers",
      "Least squares becomes fragile when A has large condition number",
      "In IEEE double precision you lose roughly log10(kappa) decimal digits of accuracy",
      "Scaling rows/columns (preconditioning) can reduce kappa dramatically",
    ],
    formula: "kappa_2(A) = sigma_max / sigma_min = ||A|| * ||A^-1||",
  },
  pseudoinverse: {
    what: "The Moore-Penrose pseudoinverse A^+ generalizes inversion to singular or rectangular matrices and gives least-squares/minimum-norm solutions.",
    visual:
      "A target vector b is dropped to the column space to get Ax*. The pseudoinverse computes x* whose image is that closest point.",
    intuition: [
      "If A is invertible, A^+ = A^-1",
      "For inconsistent Ax=b, x* minimizes ||Ax-b||_2",
      "Among all least-squares solutions, A^+b has the smallest ||x||_2",
      "Built directly from SVD by inverting nonzero singular values",
      "A A^+ is the orthogonal projection onto the column space of A",
      "A^+ A is the orthogonal projection onto the row space of A",
    ],
    formula: "x* = A^+ b ; A^+ = V Sigma^+ U^T",
  },
  linindep: {
    what: "Vectors are linearly independent if none can be written as a combination of the others. The only solution to c1 v1 + c2 v2 + ... = 0 is all c = 0.",
    visual:
      "Independent vectors point in genuinely different directions. Dependent vectors are redundant: one is a scaled or combined copy.",
    intuition: [
      "Independent means each vector adds new information",
      "Dependent means at least one vector is redundant",
      "n vectors in R^n are independent iff det != 0",
      "Max independent vectors in R^n = n",
    ],
    formula: "c1 v1 + c2 v2 + ... + ck vk = 0 implies all ci = 0",
  },
  basis: {
    what: "A basis is a set of vectors that is both linearly independent AND spans the entire space. Dimension = number of vectors in any basis.",
    visual:
      "Custom basis {b1, b2} spans all of R^2. Any point decomposes into coordinates relative to this basis. The standard basis is just one choice of infinitely many.",
    intuition: [
      "Basis = minimum spanning set = maximum independent set",
      "R^n always needs exactly n basis vectors",
      "Change of basis: same vector, different coordinates",
      "Infinitely many bases exist for any space",
    ],
    formula: "dim(V) = |B| where B is any basis of V",
  },
};
