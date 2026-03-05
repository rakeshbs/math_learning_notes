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
    deepDive: [
      "The rank-nullity theorem connects rank to the null space. For any m×n matrix A, rank(A) + nullity(A) = n, where nullity is the dimension of null(A). Every dimension of the input space either survives the transformation (contributing to rank) or gets destroyed (contributing to the null space) — there is no middle ground.",
      "$$\\text{rank}(A) + \\text{nullity}(A) = n$$",
      "To compute rank numerically, never rely on RREF alone — it is numerically unstable. Use SVD instead: A = U Σ V^T. Count singular values σ_i that exceed a threshold ε ≈ max(m,n) × σ_max × machine_epsilon. This is called the numerical rank. A rank-1 matrix writes as A = uv^T (an outer product), projecting everything onto a single line. The Eckart-Young theorem says the best rank-k approximation to A (in both 2-norm and Frobenius norm) is obtained by keeping only the k largest singular values: A_k = Σ_{i=1}^{k} σ_i u_i v_i^T.",
    ],
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
    deepDive: [
      "The determinant is the unique multilinear alternating function equal to 1 on the identity. Multilinear means linear in each row separately; alternating means swapping two rows flips the sign. The Leibniz formula gives the general case: det(A) = Σ_σ sgn(σ) ∏_i a_{i,σ(i)}, summing over all n! permutations σ of {1,...,n}, where sgn(σ) = +1 for even permutations and -1 for odd.",
      "$$\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i,\\sigma(i)}$$",
      "Row operations change the determinant predictably: swapping two rows flips the sign, multiplying a row by scalar c multiplies det by c, and adding a multiple of one row to another leaves det unchanged. These rules are the foundation of efficient computation via Gaussian elimination. The product det(A) = u_{11} u_{22} ... u_{nn} is simply the product of diagonal entries of the upper triangular factor U in the LU factorization — an O(n^3) computation.",
    ],
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
    deepDive: [
      "The characteristic polynomial det(A - λI) = 0 is a degree-n polynomial in λ, so there are always exactly n eigenvalues counted with algebraic multiplicity (by the fundamental theorem of algebra, over the complex numbers). The geometric multiplicity (dimension of the eigenspace for λ) is always ≤ the algebraic multiplicity. When they differ, A is called defective — it cannot be diagonalized.",
      "$$\\det(A - \\lambda I) = (-1)^n\\bigl(\\lambda^n - \\text{tr}(A)\\,\\lambda^{n-1} + \\cdots + (-1)^n\\det(A)\\bigr) = 0$$",
      "For symmetric matrices, the spectral theorem guarantees real eigenvalues and an orthogonal eigenbasis: A = Q Λ Q^T. Functions of symmetric matrices reduce to diagonal operations: f(A) = Q diag(f(λ_1),...,f(λ_n)) Q^T. Numerically, eigenvalues are found via the QR algorithm: repeatedly factor A_k = Q_k R_k, then set A_{k+1} = R_k Q_k. This similarity transformation preserves eigenvalues and converges to triangular (Schur) form in O(n^3) total work.",
    ],
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
    deepDive: [
      "The four fundamental subspaces of an m×n matrix A with rank r partition both R^n and R^m into orthogonal pairs: the column space col(A) ⊆ R^m (dim = r) and left null space null(A^T) ⊆ R^m (dim = m-r) are orthogonal complements; the row space row(A) ⊆ R^n (dim = r) and null space null(A) ⊆ R^n (dim = n-r) are orthogonal complements.",
      "$$\\text{null}(A) \\perp \\text{row}(A), \\qquad \\text{null}(A^T) \\perp \\text{col}(A)$$",
      "To find null(A), row-reduce A to RREF and identify free variables. For each free variable, set it to 1 and all others to 0, then back-solve for the pivot variables — each gives one null space basis vector. The complete solution to Ax = b (when solvable) is x = x_particular + x_null, where x_null ranges over all of null(A). Solvability requires b ∈ col(A), equivalently b^T y = 0 for every y in null(A^T).",
    ],
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
    deepDive: [
      "The trace has the cyclic property: tr(ABC) = tr(BCA) = tr(CAB). This follows from tr(AB) = tr(BA) applied repeatedly. Crucially, tr(P^{-1}AP) = tr(A) — trace is invariant under similarity transforms, making it an intrinsic property of the linear map, independent of the chosen basis. Both the trace and determinant appear as coefficients of the characteristic polynomial.",
      "$$\\text{tr}(A) = \\sum_{i=1}^n a_{ii} = \\sum_{i=1}^n \\lambda_i, \\qquad \\det(A - \\lambda I) = (-1)^n(\\lambda^n - \\text{tr}(A)\\,\\lambda^{n-1} + \\cdots)$$",
      "In machine learning, the trace appears in multiple settings: the Frobenius norm satisfies ||A||_F^2 = tr(A^T A) = Σ_{ij} a_{ij}^2 = Σ_i σ_i^2. In variational inference, the KL divergence between two Gaussians involves tr(Σ_1^{-1} Σ_0). The nuclear norm ||A||_* = Σ_i σ_i = tr(√(A^T A)) is the convex relaxation of rank, promoted by adding it to an objective to encourage low-rank solutions.",
    ],
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
    deepDive: [
      "The transpose is the adjoint of A with respect to the standard inner product: ⟨Ax, y⟩ = ⟨x, A^T y⟩ for all x ∈ R^n, y ∈ R^m. This means A^T represents the 'dual' transformation that reverses the direction of the map. The reverse product rule (AB)^T = B^T A^T generalizes: (A_1 ... A_k)^T = A_k^T ... A_1^T.",
      "$$\\langle Ax,\\, y \\rangle = \\langle x,\\, A^T y \\rangle \\quad \\forall\\, x \\in \\mathbb{R}^n,\\; y \\in \\mathbb{R}^m$$",
      "Any matrix decomposes as A = S + K where S = (A + A^T)/2 is symmetric and K = (A - A^T)/2 is skew-symmetric. This is orthogonal: tr(S^T K) = 0. In optimization, the gradient of scalar-valued functions of matrices uses the transpose: ∇_X tr(X^T AX) = (A + A^T)X, and ∇_x (x^T Ax) = (A + A^T)x = 2Ax when A is symmetric. These identities drive matrix-valued optimization such as covariance estimation.",
    ],
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
    deepDive: [
      "The explicit formula A^{-1} = adj(A) / det(A) uses the adjugate (matrix of cofactors, transposed). For 2×2 this is practical; for larger matrices it is O(n! ) to compute directly and impractical. In practice, never compute A^{-1} explicitly to solve Ax = b. Use LU factorization instead: factor once in O(n^3), then solve each right-hand side in O(n^2).",
      "$$A^{-1} = \\frac{1}{\\det(A)}\\,\\text{adj}(A), \\qquad (A+uv^T)^{-1} = A^{-1} - \\frac{A^{-1}uv^T A^{-1}}{1 + v^T A^{-1}u}$$",
      "The Sherman-Morrison formula (above, right) updates the inverse when A changes by a rank-1 matrix uv^T, at cost O(n^2) rather than O(n^3). The Woodbury identity generalizes this to rank-k updates: (A + UCV)^{-1} = A^{-1} - A^{-1}U(C^{-1} + VA^{-1}U)^{-1}VA^{-1}. These are fundamental in online learning, Kalman filtering, and Newton-step computation in optimization.",
    ],
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
    deepDive: [
      "The identity can be written as I = Σ_{i=1}^n e_i e_i^T — a sum of n rank-1 outer products of standard basis vectors. This resolution of the identity is the simplest spectral decomposition. For any orthonormal basis {q_1,...,q_n}, the same identity holds: I = Σ_i q_i q_i^T. This completeness relation underlies Parseval's theorem in Fourier analysis.",
      "$$I = \\sum_{i=1}^n e_i e_i^T = \\sum_{i=1}^n q_i q_i^T \\text{ (any orthonormal basis)}$$",
      "Perturbations from identity: for a matrix A = I + εB (small ε), the Neumann series gives (I + εB)^{-1} = I - εB + ε²B² - ... when ||εB|| < 1. The condition number κ(I) = 1 is the minimum possible — I is perfectly conditioned. Near-identity matrices appear in trust-region methods, regularization (A + λI), and initialization strategies for neural networks.",
    ],
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
    deepDive: [
      "Matrix multiplication (AB)_{ij} = Σ_k A_{ik} B_{kj} admits four complementary views: (1) dot products of rows of A with columns of B; (2) each column of AB is A times the corresponding column of B; (3) each row of AB is the corresponding row of A times B; (4) AB as a sum of rank-1 outer products: AB = Σ_k a_k b_k^T where a_k is column k of A and b_k^T is row k of B.",
      "$$AB = \\sum_{k=1}^{p} \\mathbf{a}_k\\, \\mathbf{b}_k^T \\quad \\text{(sum of rank-1 outer products)}$$",
      "Strassen's algorithm multiplies n×n matrices in O(n^{2.81}) by recursively decomposing the 2×2 block product into 7 instead of 8 multiplications. Practical BLAS implementations achieve near-peak FLOP/s via cache-blocking: dividing the matrices into tiles that fit in cache and reusing each tile maximally before eviction. On GPUs, Tensor Cores compute 4×4×4 fused multiply-accumulate blocks in one instruction, driving the massive throughput needed for deep learning.",
    ],
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
    deepDive: [
      "The commutator [A, B] = AB - BA measures the failure of commutativity. Matrices commute (AB = BA) if and only if they share an eigenbasis — in particular, if A has distinct eigenvalues and AB = BA, then B must be a polynomial in A. Diagonal matrices commute with each other. Symmetric matrices with the same eigenbasis (i.e., simultaneously diagonalizable) commute.",
      "$$[A, B] = AB - BA = 0 \\iff AB = BA \\iff A \\text{ and } B \\text{ are simultaneously diagonalizable}$$",
      "Non-commutativity has deep consequences across fields. In 3D, rotations around different axes do not commute — rotating 90° around the x-axis then the y-axis gives a different result than y then x. This is why 3D rotation representations (Euler angles, quaternions, rotation matrices) require careful ordering. In quantum mechanics, position and momentum operators satisfy [x̂, p̂] = iħ, leading directly to the Heisenberg uncertainty principle σ_x σ_p ≥ ħ/2. In deep learning, the order of operations — batch normalization before or after activation — matters and is actively designed.",
    ],
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
    deepDive: [
      "The four fundamental subspaces of A (m×n, rank r) give a complete geometric picture of what A does. In R^m: col(A) (dim r) and null(A^T) (dim m-r) are orthogonal complements. In R^n: row(A) (dim r) and null(A) (dim n-r) are orthogonal complements. Every vector in R^n decomposes uniquely as x_row + x_null, and A maps x_row bijectively onto col(A) while annihilating x_null.",
      "$$\\text{col}(A) \\subseteq \\mathbb{R}^m,\\; \\dim = r;\\quad \\text{null}(A^T) \\subseteq \\mathbb{R}^m,\\; \\dim = m-r;\\quad \\text{col}(A) \\perp \\text{null}(A^T)$$",
      "For data matrices, the column space is the subspace 'explained' by the features. PCA identifies directions of maximum variance within col(X^T) (the row space of the data matrix X, where rows are observations). Rank deficiency signals multicollinearity: some features are exact linear combinations of others, making the normal equations A^T Ax = A^T b singular. Ridge regression adds λI to regularize, effectively expanding col(A^T A + λI) to all of R^n.",
    ],
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
    deepDive: [
      "The Gram-Schmidt process converts any linearly independent set {v_1,...,v_k} into an orthonormal basis {q_1,...,q_k}. At each step j, subtract from v_j all of its projections onto the already-computed directions, then normalize the remainder: u_j = v_j - Σ_{i<j}(v_j^T q_i)q_i, q_j = u_j/||u_j||. Numerically, modified Gram-Schmidt (subtracting each projection one at a time) is more stable than classical Gram-Schmidt (subtracting all at once).",
      "$$q_j = \\frac{v_j - \\sum_{i=1}^{j-1}(v_j^T q_i)\\,q_i}{\\left\\|v_j - \\sum_{i=1}^{j-1}(v_j^T q_i)\\,q_i\\right\\|}$$",
      "Orthogonality is the key to numerical stability. Orthogonal matrices have condition number 1 (they cannot amplify errors). In optimization, orthogonal initialization of neural network weights preserves gradient norms at the start of training, avoiding vanishing/exploding gradients. In signal processing, orthogonal transforms (DFT, DCT, wavelet) convert correlated data to decorrelated coefficients, enabling compression and efficient computation.",
    ],
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
    deepDive: [
      "The orthogonal projection of b onto col(A) — when A has full column rank — is P_A b = A(A^T A)^{-1}A^T b. The matrix P_A = A(A^T A)^{-1}A^T is symmetric and idempotent: P_A^2 = P_A, P_A^T = P_A. Its eigenvalues are only 0 and 1. The residual b - P_A b lies in null(A^T), perpendicular to col(A).",
      "$$P_A = A(A^T A)^{-1}A^T, \\quad P_A^2 = P_A, \\quad P_A^T = P_A, \\quad \\text{rank}(P_A) = \\text{tr}(P_A)$$",
      "Least squares regression is fundamentally projection. For the overdetermined system Ax ≈ b, the minimizer of ||Ax - b||_2 is x^* = A^+ b, and the fitted values Ax^* = P_A b are the projection of b onto col(A). For an orthonormal basis Q = [q_1,...,q_k], projection simplifies to P = QQ^T — no matrix inversion needed. This is why orthonormal bases are computationally preferred: extracting coordinates is just inner products, c_i = q_i^T b.",
    ],
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
    deepDive: [
      "Any norm satisfies three axioms: (1) non-negativity: ||v|| ≥ 0 and ||v|| = 0 iff v = 0; (2) homogeneity: ||αv|| = |α|||v||; (3) triangle inequality: ||u+v|| ≤ ||u|| + ||v||. The Cauchy-Schwarz inequality |u^T v| ≤ ||u||_2 ||v||_2 implies the triangle inequality for L2 and is foundational throughout analysis.",
      "$$\\|u + v\\|_2^2 = \\|u\\|_2^2 + 2u^Tv + \\|v\\|_2^2 \\leq (\\|u\\|_2 + \\|v\\|_2)^2$$",
      "Matrix norms extend vector norms. The operator (spectral) norm ||A||_2 = σ_max(A) is the maximum stretch factor. The Frobenius norm ||A||_F = √(tr(A^T A)) = √(Σ_i σ_i^2) is Euclidean over all entries. The nuclear norm ||A||_* = Σ_i σ_i is the convex relaxation of rank — minimizing ||A||_* in an optimization problem promotes low-rank solutions, crucial in matrix completion (e.g., Netflix recommendation) and compressed sensing.",
    ],
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
    deepDive: [
      "The SVD always exists for any real m×n matrix. The singular values σ_i ≥ 0 are the square roots of the eigenvalues of A^T A (or AA^T). The right singular vectors V diagonalize A^T A, and left singular vectors U diagonalize AA^T. The number of strictly positive singular values equals rank(A). The full SVD is A = U Σ V^T; the thin/economy SVD retains only rank(A) columns of U and V.",
      "$$A = U\\Sigma V^T = \\sum_{i=1}^r \\sigma_i u_i v_i^T, \\quad \\sigma_i = \\sqrt{\\lambda_i(A^T A)}, \\quad \\|A - A_k\\|_F = \\sqrt{\\sigma_{k+1}^2 + \\cdots + \\sigma_r^2}$$",
      "The Eckart-Young theorem says A_k = Σ_{i=1}^k σ_i u_i v_i^T is the best rank-k approximation to A in both 2-norm and Frobenius norm. This is why truncated SVD is the optimal compression scheme for matrices. In PCA on the data matrix X (rows = observations, columns = features), the SVD X = U Σ V^T gives: columns of V are principal components (directions of variance in feature space), Σ² /(n-1) are eigenvalues of the sample covariance, and the fraction of variance explained by PC k is σ_k^2 / Σ_i σ_i^2.",
    ],
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
    deepDive: [
      "A matrix A (n×n) is diagonalizable iff it has n linearly independent eigenvectors. Symmetric matrices always satisfy this with an orthogonal P (spectral theorem: A = Q Λ Q^T). Once diagonalized, matrix functions become trivial: f(A) = P diag(f(λ_1),...,f(λ_n)) P^{-1} — apply f entry-wise to the diagonal of D.",
      "$$A^k = PD^kP^{-1},\\quad e^{tA} = P\\,\\text{diag}(e^{t\\lambda_1},\\ldots,e^{t\\lambda_n})\\,P^{-1},\\quad f(A) = P\\,\\text{diag}(f(\\lambda_1),\\ldots,f(\\lambda_n))\\,P^{-1}$$",
      "Not all matrices are diagonalizable. Defective matrices have repeated eigenvalues with insufficient eigenvectors. The Jordan normal form A = P J P^{-1} is the closest-to-diagonal form: J has eigenvalues on the diagonal and 1s on the superdiagonal within Jordan blocks. A Jordan block of size k for eigenvalue λ satisfies (A - λI)^k = 0 but (A - λI)^{k-1} ≠ 0 on that subspace. Jordan form is essential for understanding powers A^n and the matrix exponential e^{tA} when A is defective.",
    ],
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
    deepDive: [
      "LU factorization is Gaussian elimination organized as a matrix product. Each elimination step is a unit lower-triangular elementary matrix; their product is L, and U is the resulting echelon form. With partial pivoting (PA = LU), the permutation P reorders rows at each step to place the largest entry on the diagonal, preventing catastrophic cancellation.",
      "$$PA = LU \\implies Ax = b \\Leftrightarrow Ly = Pb\\;(\\text{forward substitution})\\;\\Rightarrow\\; Ux = y\\;(\\text{backward substitution})$$",
      "LU costs O(2n^3/3) flops for the factorization; each subsequent solve is O(n^2). This amortization makes LU ideal when A is fixed but multiple right-hand sides b are solved. For sparse matrices, fill-in (new nonzeros created in L and U) can be severe — reordering algorithms (AMD, METIS, nested dissection) minimize fill-in by reordering variables before elimination. For very large sparse systems, iterative methods (GMRES, CG) are preferred over direct LU.",
    ],
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
    deepDive: [
      "The QR factorization writes A (m×n, m ≥ n) as A = QR where Q has orthonormal columns (Q^T Q = I_n) and R is upper triangular with positive diagonal. Gram-Schmidt produces QR implicitly. In practice, Householder reflections H_j = I - 2v_j v_j^T (orthogonal, symmetric, involutory) zero out entries below the diagonal one column at a time with full numerical stability.",
      "$$A = QR \\implies Q^TAx = Q^Tb \\implies Rx = Q^Tb \\quad (\\text{back-substitution, no need to invert})$$",
      "Least squares via QR: the overdetermined system Ax ≈ b is solved as Rx = Q^T b — multiply both sides by Q^T (which is orthogonal and hence perfectly conditioned), then back-substitute. This avoids forming the normal equations A^T Ax = A^T b, which squares the condition number. QR is also the foundation of the QR eigenvalue algorithm: repeated factorization A_k = Q_k R_k and update A_{k+1} = R_k Q_k is a similarity transformation that preserves eigenvalues and converges to Schur triangular form.",
    ],
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
    deepDive: [
      "Cholesky exists if and only if A is symmetric positive definite. The algorithm computes L column by column using the recurrence: L_{jj} = √(A_{jj} - Σ_{k<j} L_{jk}^2) for the diagonal entry, then L_{ij} = (A_{ij} - Σ_{k<j} L_{ik}L_{jk}) / L_{jj} for entries below. If A ever produces a negative under the square root, A is not positive definite — Cholesky doubles as a cheap numerical SPD test.",
      "$$A = LL^T, \\quad L_{jj} = \\sqrt{A_{jj} - \\sum_{k=1}^{j-1} L_{jk}^2}, \\quad \\text{cost} = \\tfrac{n^3}{3} \\text{ flops (half of LU)}$$",
      "Cholesky is about twice as fast as LU for SPD matrices by exploiting symmetry (only the lower triangle is computed). Key applications: Gaussian process regression (inverting the kernel matrix K = LL^T), multivariate Gaussian sampling (compute L, then x = μ + Lz where z ~ N(0,I)), Kalman filtering, and portfolio optimization. The pivoted (incomplete) Cholesky variant is used to build low-rank approximations of large kernel matrices at O(nk^2) cost for rank-k approximation.",
    ],
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
    deepDive: [
      "A symmetric matrix A is positive definite iff any of these equivalent conditions hold: (1) all eigenvalues λ_i > 0; (2) all leading principal minors are positive (Sylvester's criterion: det(A_{1:k,1:k}) > 0 for k=1,...,n); (3) Cholesky factorization A = LL^T exists with positive diagonal L; (4) A = B^T B for some B with full column rank.",
      "$$A \\succ 0 \\iff \\lambda_{\\min}(A) > 0 \\iff \\text{Cholesky exists} \\iff x^T Ax > 0\\; \\forall x \\neq 0$$",
      "The quadratic form f(x) = x^T Ax is strictly convex when A ≻ 0, so the unconstrained minimizer of (1/2)x^T Ax - b^T x is the unique solution to Ax = b. The set of PSD matrices forms a convex cone — fundamental in semidefinite programming (SDP), a generalization of linear programming. Ridge regression adds λI to A^T A to guarantee positive definiteness: (A^T A + λI) ≻ 0 always holds for λ > 0 regardless of the rank of A.",
    ],
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
    deepDive: [
      "The spectral theorem for real symmetric matrices states: every A = A^T has a decomposition A = Q Λ Q^T where Q is orthogonal (Q^T Q = I) and Λ = diag(λ_1,...,λ_n) with all λ_i real. The eigenvectors can always be chosen to form a complete orthonormal basis, regardless of repeated eigenvalues.",
      "$$A = A^T \\implies A = Q\\Lambda Q^T,\\; Q^TQ = I,\\; \\lambda_i \\in \\mathbb{R};\\quad f(A) = Q\\,\\text{diag}(f(\\lambda_1),\\ldots,f(\\lambda_n))\\,Q^T$$",
      "Symmetry has structural consequences: matrix functions f(A) via spectral decomposition preserve symmetry (f(A)^T = f(A)). A + A^T is always symmetric; A^T A is always symmetric PSD. Covariance matrices, Hessians (by Schwarz's theorem), graph Laplacians, and kernel matrices are all symmetric. For symmetric A, eigenvalue computation is faster and more stable (using the symmetric QR algorithm or divide-and-conquer) than for general matrices.",
    ],
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
    deepDive: [
      "Diagonal matrices are closed under addition, multiplication, inversion, and matrix functions: if D = diag(d_1,...,d_n), then D^k = diag(d_1^k,...,d_n^k), D^{-1} = diag(1/d_1,...,1/d_n) (when all d_i ≠ 0), and f(D) = diag(f(d_1),...,f(d_n)). The eigenvalues are exactly the diagonal entries.",
      "$$D^k = \\text{diag}(d_1^k, \\ldots, d_n^k), \\quad e^D = \\text{diag}(e^{d_1}, \\ldots, e^{d_n}), \\quad D^{-1} = \\text{diag}(1/d_1, \\ldots, 1/d_n)$$",
      "Pre-multiplying by D scales rows (D A)_{ij} = d_i A_{ij}; post-multiplying scales columns (A D)_{ij} = A_{ij} d_j. This makes diagonal matrices the natural tool for normalization: feature standardization in machine learning is left-multiplication by diag(1/σ_1,...,1/σ_n). The Jacobi iterative solver D^{-1}(b - (A - D)x) uses only the diagonal part of A. Diagonal dominance of A (|a_{ii}| > Σ_{j≠i}|a_{ij}|) guarantees convergence of Jacobi iteration.",
    ],
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
    deepDive: [
      "An upper triangular matrix U has determinant equal to the product of its diagonal entries: det(U) = ∏_i u_{ii}. The eigenvalues are also exactly the diagonal entries, read directly from the characteristic polynomial (u_{11}-λ)(u_{22}-λ)...(u_{nn}-λ). A triangular matrix is singular if and only if at least one diagonal entry is zero.",
      "$$\\det(U) = \\prod_{i=1}^n u_{ii}, \\quad Ux = b \\text{ solved by back-substitution in } O(n^2) \\text{ flops}$$",
      "Back-substitution solves Ux = b in O(n^2): x_n = b_n/u_{nn}, then x_{n-1} = (b_{n-1} - u_{n-1,n} x_n)/u_{n-1,n-1}, and so on. The Schur decomposition states every real matrix is unitarily similar to a quasi-upper-triangular matrix (real Schur form): A = QTQ^T, where T has 1×1 blocks for real eigenvalues and 2×2 blocks for complex conjugate pairs. This exists for every square matrix (unlike diagonalization) and is computed by the QR algorithm.",
    ],
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
    deepDive: [
      "Permutation matrices are orthogonal (P^T P = I, so P^{-1} = P^T) with determinant equal to the sign of the permutation: det(P) = sgn(σ) = (-1)^k where k is the minimum number of transpositions needed. The n! permutation matrices form a group under multiplication isomorphic to the symmetric group S_n.",
      "$$P^{-1} = P^T, \\quad \\det(P) = \\text{sgn}(\\sigma) = (-1)^k,\\quad \\text{where } k = \\text{minimum transpositions to achieve } \\sigma$$",
      "In LU factorization with partial pivoting (PA = LU), the permutation P is built incrementally: at step k, choose the row with the largest absolute entry in column k (among rows k through n), and swap it to position k. This prevents small pivots and limits the element growth factor in U. By the Birkhoff-von Neumann theorem, permutation matrices are the extreme points (vertices) of the doubly stochastic polytope — every doubly stochastic matrix is a convex combination of permutations.",
    ],
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
    deepDive: [
      "If A^2 = A and Av = λv, then λv = Av = A(Av) = A(λv) = λAv = λ^2 v, so λ^2 = λ, giving λ ∈ {0,1}. The rank of A equals the number of 1-eigenvalues, which equals tr(A). The complement I - A is also idempotent: (I-A)^2 = I - 2A + A^2 = I - A. The column spaces of A and I-A are complementary subspaces of R^n.",
      "$$A^2 = A \\implies \\lambda_i \\in \\{0,1\\},\\quad \\text{rank}(A) = \\text{tr}(A),\\quad (I-A)^2 = I-A,\\quad A(I-A) = 0$$",
      "Orthogonal projection matrices satisfy both A^2 = A and A^T = A (symmetric idempotent). Non-symmetric idempotents give oblique projections: projecting onto col(A) along a direction not perpendicular to it. In statistics, the hat matrix H = X(X^T X)^{-1}X^T is idempotent with tr(H) = rank(X) = p (number of parameters), which is the degrees of freedom used in regression. The residual maker I - H is also idempotent with tr(I-H) = n-p (residual degrees of freedom).",
    ],
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
    deepDive: [
      "If A^k = 0 and Av = λv, then 0 = A^k v = λ^k v, so λ = 0. All eigenvalues are zero, making det(A) = tr(A) = 0. The smallest k with A^k = 0 is the nilpotency index, always ≤ n for an n×n matrix. The nilpotent shift matrix N (ones on superdiagonal, zeros elsewhere) is the canonical example: N^n = 0 but N^{n-1} ≠ 0.",
      "$$A^k = 0 \\implies \\lambda_i = 0\\;\\forall i, \\quad e^{tA} = I + tA + \\frac{t^2}{2!}A^2 + \\cdots + \\frac{t^{k-1}}{(k-1)!}A^{k-1} \\text{ (finite sum)}$$",
      "The matrix exponential of a nilpotent matrix is a finite polynomial — the infinite series truncates after k terms. This makes nilpotent matrices tractable in differential equations. The Jordan decomposition A = S + N (with S diagonalizable, N nilpotent, SN = NS) separates the persistent behavior (S) from the transient mixing (N). In control theory, a nilpotent system matrix means the system reaches zero state in exactly k steps — finite-time controllability.",
    ],
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
    deepDive: [
      "Since A^2 = I and Av = λv, we get λ^2 = 1 so λ ∈ {+1, -1}. Every involutory matrix decomposes as A = P_{+} - P_{-} = 2P - I where P = (A+I)/2 is the projection onto the +1 eigenspace and I - P projects onto the -1 eigenspace.",
      "$$A^2 = I \\implies \\lambda_i \\in \\{+1,-1\\}, \\quad A = 2P - I \\text{ where } P = \\tfrac{A+I}{2} \\text{ is a projection}$$",
      "Householder reflectors H = I - 2vv^T/v^T v (||v||=1) are the canonical involutory matrices: H^2 = I - 4vv^T/v^T v + 4v(v^T v)v^T/(v^T v)^2 = I. They zero out entries below the diagonal in QR factorization and are numerically ideal because they are orthogonal, symmetric, and involutory simultaneously. In cryptography, involutory matrices are used so that the same matrix applies for both encryption and decryption — a single hardware circuit suffices.",
    ],
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
    deepDive: [
      "Diagonal entries of a skew-symmetric matrix are forced to zero: a_{ii} = -a_{ii} implies a_{ii} = 0. For real skew-symmetric matrices, eigenvalues are purely imaginary (or zero) and come in conjugate pairs ±iμ. For odd n, det(A) = det(A^T) = det(-A) = (-1)^n det(A) = -det(A), so det(A) = 0.",
      "$$A^T = -A \\implies \\lambda = i\\mu \\text{ (purely imaginary)},\\quad x^TAx = 0\\;\\forall x \\in \\mathbb{R}^n, \\quad e^A \\in O(n)$$",
      "The matrix exponential of a skew-symmetric matrix is orthogonal: (e^A)^T = e^{A^T} = e^{-A} = (e^A)^{-1}. Skew-symmetric matrices are therefore the Lie algebra so(n) of the orthogonal group O(n) — they generate infinitesimal rotations. In 3D, every skew-symmetric matrix corresponds to a cross-product vector: [[0,-c,b],[c,0,-a],[-b,a,0]] generates rotation about (a,b,c). The Cayley map Q = (I-A)(I+A)^{-1} maps skew-symmetric A to orthogonal Q, used to parameterize orthogonal layers in neural networks.",
    ],
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
    deepDive: [
      "Orthogonal matrices preserve inner products: ⟨Qu, Qv⟩ = u^T Q^T Q v = u^T v. Consequently they preserve lengths (||Qu|| = ||u||), angles (cos θ unchanged), and the Euclidean distance between any two points. The set O(n) of n×n orthogonal matrices forms a group under multiplication. The subgroup SO(n) = {Q : det(Q) = +1} consists of rotations; matrices with det = -1 include a reflection.",
      "$$Q \\in O(n) \\iff Q^TQ = I \\iff \\|Qx\\|_2 = \\|x\\|_2\\;\\forall x \\iff \\kappa_2(Q) = 1 \\iff \\det(Q) = \\pm 1$$",
      "Numerical algorithms prefer orthogonal matrices because Q^{-1} = Q^T is trivially cheap, and cond(Q) = 1 means no error amplification whatsoever. QR factorization, Gram-Schmidt, Householder reflections, and the QR eigenvalue algorithm all achieve numerical stability by working exclusively with orthogonal transformations. In deep learning, orthogonal weight initialization (Saxe et al., 2013) preserves the norm of backpropagated gradients at initialization, significantly accelerating training of deep networks by preventing vanishing/exploding gradients.",
    ],
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
    deepDive: [
      "The all-ones vector 1 is a right eigenvector with eigenvalue 1 (P·1 = 1) because rows sum to 1. By the Perron-Frobenius theorem, for a positive stochastic matrix (all P_{ij} > 0), eigenvalue 1 is simple and all other eigenvalues satisfy |λ| < 1. This guarantees a unique stationary distribution π and convergence of P^n.",
      "$$P\\mathbf{1} = \\mathbf{1},\\quad \\pi^T P = \\pi^T,\\quad \\pi_j = \\lim_{n \\to \\infty}(P^n)_{ij} \\text{ (rows of } P^n \\text{ all converge to } \\pi)$$",
      "The convergence rate to the stationary distribution is controlled by the spectral gap 1 - |λ_2|, where λ_2 is the second-largest eigenvalue in modulus. Larger spectral gap means faster mixing. PageRank is the stationary distribution of the web link transition matrix. MCMC sampling (Metropolis-Hastings, Gibbs sampling) constructs Markov chains with a desired stationary distribution π — the stochastic matrix is designed so that detailed balance π_i P_{ij} = π_j P_{ji} holds.",
    ],
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
    deepDive: [
      "The Birkhoff-von Neumann theorem characterizes the doubly stochastic matrices completely: the set B_n of all n×n doubly stochastic matrices (the Birkhoff polytope) is the convex hull of the n! permutation matrices. The extreme points are exactly the permutation matrices — no other doubly stochastic matrix is a vertex of B_n.",
      "$$D \\text{ doubly stochastic} \\iff D = \\sum_{\\sigma} w_{\\sigma} P_{\\sigma},\\quad w_{\\sigma} \\geq 0,\\quad \\sum_{\\sigma} w_{\\sigma} = 1$$",
      "Doubly stochastic matrices appear in optimal transport: the Wasserstein distance W_p between two discrete distributions is the solution to a linear program over the Birkhoff polytope. The Sinkhorn algorithm iteratively normalizes rows then columns of a non-negative matrix until doubly stochastic — this implements regularized (entropic) optimal transport efficiently. In machine learning, doubly stochastic attention has been proposed for more balanced information routing in transformers.",
    ],
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
    deepDive: [
      "Gershgorin's disk theorem: every eigenvalue of A lies in at least one Gershgorin disk D_i = {z : |z - a_{ii}| ≤ r_i} where r_i = Σ_{j≠i}|a_{ij}|. Strict diagonal dominance (|a_{ii}| > r_i for all i) means every disk excludes zero, so det(A) ≠ 0 — A is nonsingular. For real symmetric strictly diagonally dominant matrices with positive diagonal, all disks lie in the positive real axis, confirming positive definiteness.",
      "$$\\lambda \\in \\bigcup_{i=1}^n \\bigl\\{z \\in \\mathbb{C} : |z - a_{ii}| \\leq r_i\\bigr\\},\\quad r_i = \\sum_{j \\neq i}|a_{ij}|$$",
      "Iterative solvers converge for strictly diagonally dominant systems. Jacobi iteration x^{(k+1)}_i = (b_i - Σ_{j≠i} a_{ij} x^{(k)}_j) / a_{ii} converges with rate ρ = max_i (r_i/|a_{ii}|) < 1. Gauss-Seidel converges even faster under the same condition. In finite element/difference methods, discretized Laplace-type operators produce diagonally dominant stiffness matrices, guaranteeing convergence of simple iterative solvers without preconditioners.",
    ],
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
    deepDive: [
      "The Compressed Sparse Row (CSR) format stores only nonzero entries using three arrays: row pointers (length m+1), column indices (length nnz), and values (length nnz). Storage drops from O(mn) to O(nnz). Sparse matrix-vector multiplication (SpMV, the key primitive) runs in O(nnz) time vs O(mn) for dense.",
      "$$\\text{CSR storage:}\\; 2 \\cdot \\text{nnz} + m + 1 \\text{ integers} + \\text{nnz floats} \\quad \\text{vs} \\quad m \\cdot n \\text{ floats (dense)}$$",
      "LU factorization of a sparse matrix creates fill-in: zeros in A become nonzeros in L and U. The fill-in pattern depends entirely on the ordering of variables. Reordering algorithms (AMD: Approximate Minimum Degree; METIS; nested dissection for planar graphs) reorder rows and columns of A to minimize fill-in before factorization — often reducing nnz(L+U) by orders of magnitude. For very large sparse systems (millions of unknowns), iterative methods (CG, GMRES with incomplete LU or multigrid preconditioners) avoid the fill-in problem entirely.",
    ],
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
    deepDive: [
      "A Toeplitz matrix T is fully specified by 2n-1 numbers (first row and first column) rather than n^2. It represents convolution with a filter: (Tv)_i = Σ_j t_{i-j} v_j. By embedding T in a larger circulant matrix C (where diagonals wrap around), the product Tv can be computed using FFT: Tv = IFFT(FFT(c) ⊙ FFT(v)), at O(n log n) cost.",
      "$$T_{ij} = c_{i-j},\\quad Tv = \\mathcal{F}^{-1}\\bigl(\\mathcal{F}(c) \\odot \\mathcal{F}(v)\\bigr) \\text{ via circular embedding, } O(n\\log n)$$",
      "Toeplitz systems (solving Tx = b) can be solved in O(n log^2 n) using the Levinson-Durbin algorithm or Gohberg-Semencul formula. Autocovariance matrices of wide-sense stationary (WSS) processes are Toeplitz: R_{ij} = E[x_i x_j] = R(i-j). In deep learning, 1D convolutional layers implement approximate Toeplitz matrix multiplication (with weight sharing across positions). Structured state-space models (SSMs like S4 and Mamba) exploit Toeplitz/Hankel structure for efficient O(n log n) sequence modeling.",
    ],
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
    deepDive: [
      "For an undirected weighted graph, L = D - A where D = diag(Σ_j w_{ij}) and A_{ij} = w_{ij}. L is symmetric PSD. The quadratic form x^T Lx = Σ_{(i,j)∈E} w_{ij}(x_i - x_j)^2 measures total variation — how much the signal x varies across edges. Minimizing x^T Lx (with boundary conditions) gives the smoothest signal on the graph, the discrete analog of Laplace's equation.",
      "$$x^T Lx = \\sum_{(i,j) \\in E} w_{ij}(x_i - x_j)^2 \\geq 0,\\quad 0 = \\lambda_0 \\leq \\lambda_1 \\leq \\cdots \\leq \\lambda_{n-1}$$",
      "The Fiedler value λ_1 (smallest nonzero eigenvalue) measures algebraic connectivity: λ_1 = 0 iff the graph is disconnected; larger λ_1 means the graph is harder to cut (better connected). The Cheeger inequality h^2/(2d_max) ≤ λ_1 ≤ 2h links λ_1 to the edge expansion h. Spectral clustering uses the bottom k eigenvectors of L (or the normalized Laplacian D^{-1/2}LD^{-1/2}) to embed nodes into R^k, then applies k-means. Graph neural networks propagate features along edges using the normalized adjacency Ã = D^{-1/2}AD^{-1/2} = I - D^{-1/2}LD^{-1/2}.",
    ],
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
    deepDive: [
      "The covariance matrix Σ = E[(X-μ)(X-μ)^T] ∈ R^{n×n} is symmetric PSD. Entry Σ_{ij} = Cov(X_i, X_j). The sample estimate is S = (1/(m-1)) Σ_k (x^{(k)} - x̄)(x^{(k)} - x̄)^T (the m-1 denominator gives an unbiased estimator). A multivariate Gaussian X ~ N(μ, Σ) can be sampled as X = μ + Lz where z ~ N(0,I) and L is the Cholesky factor of Σ.",
      "$$\\Sigma = E[(X-\\mu)(X-\\mu)^T],\\quad X \\sim \\mathcal{N}(\\mu,\\Sigma) \\implies X = \\mu + Lz,\\; z \\sim \\mathcal{N}(0,I),\\; \\Sigma = LL^T$$",
      "PCA diagonalizes Σ: if Σ = Q Λ Q^T, the principal components Y = Q^T(X-μ) have diagonal covariance Λ (uncorrelated). The k-th PC explains fraction λ_k / tr(Σ) of total variance. The Mahalanobis distance d_M(x,y) = √((x-y)^T Σ^{-1}(x-y)) measures distance in units of standard deviations, accounting for correlations. It appears in Gaussian log-likelihood, LDA, and outlier detection. When Σ is near-singular (ill-conditioned), regularize with Σ + εI or use the pseudoinverse Σ^+.",
    ],
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
    deepDive: [
      "If Ax = b and the right-hand side has relative error ||δb||/||b||, the solution error satisfies ||δx||/||x|| ≤ κ(A) · ||δb||/||b||. Similarly for matrix perturbations. In IEEE 64-bit floating point (machine epsilon ε_mach ≈ 10^{-16}), solving Ax = b with Gaussian elimination loses approximately log_{10}(κ(A)) decimal digits of accuracy.",
      "$$\\kappa_2(A) = \\|A\\|_2 \\|A^{-1}\\|_2 = \\frac{\\sigma_{\\max}}{\\sigma_{\\min}},\\quad \\frac{\\|\\delta x\\|}{\\|x\\|} \\lesssim \\kappa(A)\\,\\frac{\\|\\delta b\\|}{\\|b\\|}$$",
      "Regularization reduces condition number: κ(A + εI) ≤ (σ_max + ε)/(σ_min + ε) < κ(A). This is why ridge regression (adding λI to A^T A) improves numerical stability. Preconditioning transforms Ax = b into M^{-1}Ax = M^{-1}b where M ≈ A is easy to invert, reducing κ from κ(A) to κ(M^{-1}A). Good preconditioners include diagonal (Jacobi), incomplete LU (ILU), and algebraic multigrid. The conjugate gradient method for SPD systems converges in O(√κ) iterations — halving the condition number nearly doubles convergence speed.",
    ],
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
    deepDive: [
      "The Moore-Penrose pseudoinverse A^+ is the unique matrix satisfying four conditions: AA^+A = A, A^+AA^+ = A^+, (AA^+)^T = AA^+, (A^+A)^T = A^+A. Via SVD A = UΣV^T, the pseudoinverse is A^+ = V Σ^+ U^T where Σ^+ inverts only nonzero singular values. When A is invertible, A^+ = A^{-1}.",
      "$$A^+ = V\\Sigma^+ U^T,\\quad AA^+ = UU_{(r)}^T\\;(\\text{proj onto col}(A)),\\quad A^+A = V_{(r)}V_{(r)}^T\\;(\\text{proj onto row}(A))$$",
      "Truncated SVD pseudoinverse: compute A_k^+ = Σ_{i=1}^{k} (1/σ_i) v_i u_i^T using only the k largest singular values. This discards directions with small σ_i (dominated by noise), giving a numerically stable regularized solution. The Tikhonov regularized version is A_λ^+ = V (Σ^2 + λI)^{-1} Σ U^T, equivalent to ridge regression. As λ → 0, this converges to the true pseudoinverse if the singular values are not too small.",
    ],
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
    deepDive: [
      "Vectors v_1,...,v_k are linearly independent iff the matrix [v_1|...|v_k] has rank k (full column rank), equivalently if its only null space element is zero. The Gram matrix G_{ij} = v_i^T v_j is positive definite iff the vectors are linearly independent. The volume of the parallelepiped they span is √det(G) — zero volume means dependence.",
      "$$[v_1\\,|\\cdots|\\,v_k]\\,c = 0 \\implies c = 0 \\iff \\text{rank}([v_1|\\cdots|v_k]) = k \\iff \\det(G) > 0$$",
      "In machine learning, linear dependence in feature matrices (multicollinearity) makes the normal equations A^T Ax = A^T b ill-conditioned or singular. The Variance Inflation Factor VIF_j = 1/(1 - R_j^2) detects multicollinearity, where R_j^2 is the R^2 of regressing feature j on all others. VIF > 10 indicates severe multicollinearity. Remedies include removing redundant features, PCA projection to an orthogonal basis, or ridge regression which adds λI to stabilize the (near-)singular normal equations.",
    ],
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
    deepDive: [
      "A basis {b_1,...,b_n} of a vector space V gives every vector v a unique coordinate representation v = Σ_i c_i b_i. The coordinate vector [v]_B = (c_1,...,c_n)^T is related to the standard-basis representation by the change-of-basis matrix P = [b_1|...|b_n]: v = P[v]_B, so [v]_B = P^{-1}v. If a linear map has matrix M in the standard basis, its matrix in basis B is P^{-1}MP (similarity transformation).",
      "$$v = \\sum_{i=1}^n c_i b_i \\text{ (unique)},\\quad [v]_B = P^{-1}v,\\quad M_B = P^{-1}MP$$",
      "Orthonormal bases are computationally superior: coordinates are given by inner products c_i = q_i^T v (no system to solve), and P^{-1} = P^T. Fourier series uses the orthonormal basis {e^{i2πkt/T}} of complex exponentials for the space of periodic functions. PCA finds the optimal orthonormal basis for data: projecting onto the top k eigenvectors of the covariance matrix minimizes reconstruction MSE. Wavelets give a multiresolution orthonormal basis for signals, enabling efficient time-frequency analysis and compression.",
    ],
  },
};
