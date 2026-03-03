export const CONCEPT_DETAILS = {
  partials: {
    deeper:
      "Partials isolate axis-wise change in a multivariable function by treating all other variables as constants. They are the first local measurements used to build gradient, Jacobian, and linearization — without them, none of those tools exist.",
    useCases: [
      "Compute local sensitivity to each variable independently",
      "Build tangent planes and linear approximations for engineering models",
      "Check symmetry of mixed partials to verify smoothness conditions",
    ],
    pitfalls: [
      "Forgetting all other variables are held fixed while differentiating",
      "Assuming mixed partials are always equal — they require continuous second derivatives (Schwarz's theorem)",
      "Confusing partial derivatives with total derivatives in implicit differentiation",
    ],
    quickCheck: "Pick one variable, freeze the rest, then differentiate as a 1D function.",
  },
  gradient: {
    deeper:
      "Gradient collects all first-order change directions into a single vector. In Euclidean geometry it defines the steepest-ascent direction; in inner-product spaces it is the Riesz representation of the differential.",
    useCases: [
      "Optimization and gradient-based learning algorithms",
      "Detect critical points where first-order change vanishes",
      "Estimate local sensitivity in physical, economic, and ML models",
    ],
    pitfalls: [
      "Reading gradient as a global direction rather than a local one that changes from point to point",
      "Ignoring coordinate scaling and units when comparing component magnitudes",
      "Confusing gradient (vector) with directional derivative (scalar) in problem statements",
    ],
    quickCheck:
      "At a point, the gradient is orthogonal to the level curve/surface through that point.",
  },
  directional: {
    deeper:
      "Directional derivative is the dot product projection of the gradient onto a chosen direction. It turns a vector rate field into a single scalar rate along any chosen motion direction — making gradient the single source of all directional information.",
    useCases: [
      "Measure slope along a constrained path or physical trajectory",
      "Compare candidate movement directions before choosing a step",
      "Sensitivity analysis under arbitrary directional perturbations",
    ],
    pitfalls: [
      "Using non-unit direction vectors without adjusting interpretation (gives unnormalized derivative)",
      "Confusing directional derivative scalar D_u f with the full gradient vector ∇f",
      "Forgetting that D_u f can be negative even when f increases in other directions",
    ],
    quickCheck:
      "Normalize u first; then D_u f = ∇f · u gives the signed rate of change along u.",
  },
  tangentplane: {
    deeper:
      "The tangent plane is first-order Taylor approximation for surfaces z=f(x,y). It captures all linear behavior while ignoring curvature terms — a hyperplane touching the surface with matching slopes.",
    useCases: [
      "Fast local approximation around operating points in engineering",
      "Error estimation via linearization in physics and control",
      "Bridge between nonlinear surfaces and linear algebra tools",
    ],
    pitfalls: [
      "Using tangent plane too far from expansion point where quadratic terms dominate",
      "Assuming good approximation near non-differentiable points (cusps, corners)",
      "Forgetting the plane is defined at a specific point — it changes at each point on the surface",
    ],
    quickCheck:
      "Plane coefficients are exactly the partials f_x(a,b) and f_y(a,b) — evaluate at the base point.",
  },
  jacobian: {
    deeper:
      "Jacobian is the matrix form of first derivatives for vector-valued maps. It is the best local linear map and drives local distortion, invertibility, and change-of-variable corrections in integrals.",
    useCases: [
      "Nonlinear solver steps (Newton's method for systems)",
      "Coordinate transformations and change-of-variables in integrals",
      "Stability and sensitivity analysis of dynamical systems",
    ],
    pitfalls: [
      "Mixing row/column conventions for Jacobian layout (numerator vs denominator layout)",
      "Ignoring conditioning when inverting Jacobian numerically near singularities",
      "Forgetting that det(J) changes sign when orientation is flipped",
    ],
    quickCheck:
      "Each entry J_ij is partial of output i with respect to input j — check dimensions match (m×n for f:Rⁿ→Rᵐ).",
  },
  chainrule: {
    deeper:
      "For compositions, local sensitivities multiply in sequence. Chain rule is the backbone of layered models, coordinate transformations, and backpropagation. Jacobians multiply in the same order as function composition.",
    useCases: [
      "Differentiate nested mappings in physics and engineering",
      "Compute neural-network gradients via backpropagation",
      "Propagate uncertainty through composed physical or statistical systems",
    ],
    pitfalls: [
      "Multiplying Jacobians in the wrong order (J_g·J_f not J_f·J_g for g∘f)",
      "Dropping evaluation point shifts inside composition (J_g evaluated at f(x), not at x)",
      "Confusing scalar chain rule form with matrix Jacobian multiplication",
    ],
    quickCheck:
      "Compose maps, multiply Jacobians in that same composition order, evaluate outer at the inner output.",
  },
  changevars: {
    deeper:
      "Coordinate changes trade geometric complexity for algebraic simplicity. The Jacobian determinant is the exact local scale correction for area/volume elements — it accounts for how much the transformation stretches or compresses space.",
    useCases: [
      "Polar, cylindrical, and spherical integration for symmetric regions",
      "Simplifying awkward integration regions with complex Cartesian bounds",
      "Probability density transforms when applying nonlinear mappings to random variables",
    ],
    pitfalls: [
      "Forgetting absolute value on Jacobian determinant — ensures positive area/volume element",
      "Using bounds from old coordinates after substitution — must remap region to new coordinates",
      "Forgetting r factor in polar (dA=r dr dθ) or r²sinφ in spherical (dV=r²sinφ dr dθ dφ)",
    ],
    quickCheck:
      "After substitution, rewrite both the integrand and the differential element — both must change.",
  },
  hessian: {
    deeper:
      "Hessian summarizes second-order behavior: curvature size, orientation, and coupling between variables. It is the local quadratic geometry and determines whether a critical point is a minimum, maximum, or saddle.",
    useCases: [
      "Classify critical points as local min, max, or saddle",
      "Build Newton steps for second-order optimization",
      "Analyze local convexity/concavity for theory guarantees",
    ],
    pitfalls: [
      "Assuming Hessian test always works — fails when the discriminant D=0 (degenerate case needs higher-order analysis)",
      "Ignoring symmetry assumptions — Hessian is symmetric only when second partials are continuous",
      "Computing Hessian at a non-critical point and trying to classify extrema",
    ],
    quickCheck:
      "Compute second partial matrix at the critical point and inspect eigenvalue signs or leading principal minors.",
  },
  criticalpoints: {
    deeper:
      "Critical-point analysis combines first-order stationarity with second-order curvature to determine local behavior near candidate extrema or saddle points.",
    useCases: [
      "Optimization screening to locate candidate optima",
      "Surface shape interpretation in physics and geometry",
      "Stability analysis of equilibria in dynamical systems",
    ],
    pitfalls: [
      "Stopping at ∇f=0 without classifying the type of critical point",
      "Relying on the second-derivative test when the Hessian determinant is exactly zero",
      "Forgetting to check the boundary of bounded domains for global extrema",
    ],
    quickCheck:
      "Solve ∇f=0, then at each candidate evaluate the Hessian and check eigenvalue signs.",
  },
  taylor2: {
    deeper:
      "Second-order Taylor models add curvature correction to linearization and often deliver significantly better local accuracy near smooth critical points. They are the local models used in Newton and trust-region optimization.",
    useCases: [
      "Local quadratic model in Newton-type optimization algorithms",
      "Error estimates near operating points in engineering simulations",
      "Fast quadratic approximations in simulation loops",
    ],
    pitfalls: [
      "Using approximation too far from expansion point where remainder term grows",
      "Applying to non-smooth functions where second derivatives don't exist",
      "Forgetting cross terms (h^T H h) when there are mixed second partial derivatives",
    ],
    quickCheck:
      "Need f(a), ∇f(a), and H_f(a) at expansion point; then plug in offset vector h.",
  },
  lagrange: {
    deeper:
      "Lagrange multipliers convert constrained extrema into a system balancing objective and constraint normals in feasible geometry. The multiplier λ has an economic interpretation as the marginal cost of relaxing the constraint.",
    useCases: [
      "Resource-constrained optimization in economics and operations research",
      "Geometric nearest/farthest point on a curve or surface",
      "Mechanics with holonomic constraints (e.g., pendulum)",
    ],
    pitfalls: [
      "Missing boundary or end-point checks on bounded feasible sets",
      "Treating the Lagrange system as always sufficient — still need to compare candidate values",
      "Forgetting feasibility: the constraint g(x)=c must hold at the solution",
    ],
    quickCheck:
      "Set up ∇f = λ∇g plus the constraint g(x)=c; the n+1 equations determine n+1 unknowns (x's + λ).",
  },
  divergence: {
    deeper:
      "Divergence is local net flux density: how much a vector field behaves like a source or sink at each point. It is the trace of the Jacobian matrix of F, measuring expansion rate in all directions.",
    useCases: [
      "Fluid compressibility diagnostics in CFD",
      "Field source detection in electromagnetism (Gauss's law)",
      "Applying the divergence theorem to convert volume to surface integrals",
    ],
    pitfalls: [
      "Interpreting divergence as global outflow instead of a local point density",
      "Forgetting that divergence produces a scalar field, not a vector field",
      "Confusing div F with curl F — they are different derivative operations",
    ],
    quickCheck:
      "Positive divergence means source-like, negative means sink-like, zero means locally balanced.",
  },
  curl: {
    deeper:
      "Curl measures infinitesimal rotation. In 3D it is a vector (rotation axis and rate); in planar flow its z-component captures spin direction and strength. It is the antisymmetric part of the Jacobian.",
    useCases: [
      "Vorticity analysis in fluid mechanics",
      "Maxwell's equations in electromagnetism",
      "Checking whether a vector field is conservative (curl F = 0 implies F = ∇φ under conditions)",
    ],
    pitfalls: [
      "Confusing swirl-looking paths with actual local curl — a field can curve globally with zero local curl",
      "Forgetting orientation conventions and right-hand rule for axis direction",
      "Applying 2D curl formula in 3D without keeping track of the correct component",
    ],
    quickCheck:
      "Tiny paddle wheel test: nonzero spin at placement point implies nonzero curl.",
  },
  lineintegral: {
    deeper:
      "Line integrals accumulate along trajectories. For vector fields they measure work, coupling field direction with path tangent. Conservative fields yield path-independent integrals depending only on endpoints.",
    useCases: [
      "Work done by a force field along a curved path",
      "Circulation around loops in fluid mechanics and electromagnetism",
      "Path-dependent transport quantities in thermodynamics",
    ],
    pitfalls: [
      "Dropping path orientation (reversing path negates the integral)",
      "Assuming path independence without verifying conservativeness (curl F = 0)",
      "Forgetting to include ||r'(t)|| factor when integrating scalar fields along curves",
    ],
    quickCheck:
      "Parametrize path r(t), compute F(r(t))·r'(t), then integrate t from a to b.",
  },
  greentheorem: {
    deeper:
      "Green's theorem is a circulation-area duality in the plane, converting a boundary integral into an interior curl-density integral. It is the 2D instance of the general Stokes theorem.",
    useCases: [
      "Shortcut for closed-curve line integrals by converting to area integrals",
      "Relate local rotation density to global circulation",
      "Bridge between vector calculus and planar geometry (area formula from boundary integration)",
    ],
    pitfalls: [
      "Wrong boundary orientation sign — must traverse counterclockwise for standard formula",
      "Applying the theorem on regions with holes without accounting for inner boundary contributions",
      "Forgetting smoothness requirements on P and Q in the region R",
    ],
    quickCheck:
      "Use positively oriented (counterclockwise) boundary; both directions of conversion are valid.",
  },
  doubleintegral: {
    deeper:
      "Double integrals add contributions over areas. They generalize accumulation from curves to regions and support coordinate transforms via Jacobian factors.",
    useCases: [
      "Mass or charge distribution over a 2D lamina with variable density",
      "Average value of a function over a region",
      "Area-based probability calculations from joint 2D density functions",
    ],
    pitfalls: [
      "Incorrect region bounds when switching integration order — must re-describe the region in new order",
      "Forgetting Jacobian factors (r for polar) in non-Cartesian coordinates",
      "Integrating over wrong variable in inner vs outer integral",
    ],
    quickCheck:
      "Sketch region R first, then set consistent limits — inner limits may depend on outer variable.",
  },
  tripleintegral: {
    deeper:
      "Triple integrals aggregate density across volume elements. They are central to mass, charge, probability, and expectation in 3D domains and support coordinate transforms for spherical or cylindrical symmetry.",
    useCases: [
      "Mass from volumetric density function in 3D objects",
      "3D probability normalization and moment calculations",
      "Moment of inertia computations for solid bodies",
    ],
    pitfalls: [
      "Mismatched nested bounds among variables — outer bounds are constants, inner bounds can depend on outer",
      "Missing Jacobian factors in curvilinear coordinates (r for cylindrical, r²sinφ for spherical)",
      "Choosing Cartesian coordinates for spherically symmetric problems that are much easier in spherical",
    ],
    quickCheck:
      "Sketch volume first, then choose coordinate system to simplify limits before integrating.",
  },
  surfaceintegral: {
    deeper:
      "Surface integrals combine geometry (area element plus normal vector) and field values to measure distributed quantities over curved 2D manifolds embedded in 3D space.",
    useCases: [
      "Flux of electric or magnetic field through a surface (Gauss's law, Faraday's law)",
      "Fluid transport rate through a membrane or boundary",
      "Geometry-aware accumulation in computer graphics and physics simulations",
    ],
    pitfalls: [
      "Using inconsistent normal orientation — outward vs inward normal changes flux sign",
      "Incorrect cross-product magnitude in parameterization — r_u × r_v gives both direction and area element",
      "Assuming flat surface approximations are adequate for highly curved surfaces",
    ],
    quickCheck: "Compute r_u × r_v for the surface element — it gives both orientation and area scaling.",
  },
};

export const CONCEPT_EXPANSIONS = {
  partials: {
    algebraic:
      "If f(x₁,...,xₙ) is differentiable, each partial is a coordinate component of the derivative map. Mixed partial equality (f_xy = f_yx) holds when second partials are continuous (Clairaut/Schwarz theorem).",
    computation:
      "Treat all non-target variables as constants and differentiate symbolically. For numerical evaluation, use centered finite differences: (f(x+h,y) - f(x-h,y))/(2h).",
    workedExample:
      "f(x,y) = x²y + sin(xy): f_x = 2xy + y·cos(xy), f_y = x² + x·cos(xy). Check mixed partials: f_xy = 2x + cos(xy) - xy·sin(xy) = f_yx. ✓",
    connections: [
      "Gradient assembly",
      "Tangent-plane coefficients",
      "Jacobian entries",
    ],
  },
  gradient: {
    algebraic:
      "For scalar f, gradient is the vector representation of the differential under Euclidean inner product: df(v) = ∇f · v. The gradient transforms as a covariant vector under coordinate changes.",
    computation:
      "Differentiate with respect to each variable, evaluate at point, package as column vector. Numerically: use AD or central differences on each component.",
    workedExample:
      "f(x,y) = x² + 3y² at (1,-1): ∇f = (2x, 6y) = (2, -6). This points away from the level curve x²+3y²=4. The maximum directional derivative is ||∇f|| = √(4+36) = √40 ≈ 6.32.",
    connections: [
      "Directional derivatives",
      "Critical-point analysis",
      "Steepest-descent optimization",
    ],
  },
  directional: {
    algebraic:
      "D_u f(a) = lim_{h→0} (f(a+hu) - f(a))/h equals ∇f(a)·u for differentiable f and unit u. The maximum over all unit u equals ||∇f(a)||, achieved when u = ∇f/||∇f||.",
    computation:
      "Normalize direction u, compute gradient at point, take dot product. For non-unit u: D_u f = (∇f · u)/||u||.",
    workedExample:
      "∇f = (3,4), u = (4/5, 3/5): D_u f = 3·(4/5) + 4·(3/5) = 12/5 + 12/5 = 24/5 = 4.8. Maximum possible is ||∇f|| = 5, achieved in direction (3/5, 4/5).",
    connections: [
      "Gradient projection geometry",
      "Constraint-aware sensitivity",
      "Optimization step selection",
    ],
  },
  tangentplane: {
    algebraic:
      "For z=f(x,y), linearization near (a,b) is L(x,y) = f(a,b) + f_x(a,b)(x-a) + f_y(a,b)(y-b). Error bound: |f(x,y) - L(x,y)| ≤ M/2 · |(x-a,y-b)|² for some bound M on second derivatives.",
    computation:
      "Compute value and first partials at base point, then assemble affine plane. To check quality, compare |f - L| at nearby points.",
    workedExample:
      "f = x² + y² at (1,2): f(1,2) = 5, f_x = 2, f_y = 4. Tangent plane: z ≈ 5 + 2(x-1) + 4(y-2) = 2x + 4y - 5. At (1.1, 2.1): exact = 5.62, linear ≈ 5.60 — good approximation nearby.",
    connections: [
      "First-order Taylor expansion",
      "Local error bounds",
      "Jacobian-based linear models",
    ],
  },
  jacobian: {
    algebraic:
      "For F:Rⁿ→Rᵐ, the Jacobian J_F(a) represents the derivative DF(a). The square Jacobian determinant equals the local volume scaling factor, with sign indicating orientation preservation/reversal.",
    computation:
      "Differentiate each output component with respect to each input variable. Fill rows = outputs, columns = inputs (numerator layout). Evaluate at specific point for local approximation.",
    workedExample:
      "F(x,y) = (x²-y, xy): J = [[2x, -1],[y, x]]. At (1,2): J = [[2,-1],[2,1]], det J = 2·1-(-1)·2 = 4. Local area is scaled by 4 — a small unit square near (1,2) maps to a parallelogram of area 4.",
    connections: [
      "Multivariable chain rule",
      "Newton linearization",
      "Change-of-variables Jacobian",
    ],
  },
  chainrule: {
    algebraic:
      "For g∘f, the derivative is D(g∘f)(x) = Dg(f(x))·Df(x); in coordinates, Jacobians multiply. For scalar composition: ∂(g∘f)/∂xᵢ = Σⱼ (∂g/∂uⱼ)(∂fⱼ/∂xᵢ) — sum over intermediate variables.",
    computation:
      "Compute inner Jacobian J_f at x, evaluate outer Jacobian J_g at f(x), multiply J_g · J_f. Check dimensions: if f:Rⁿ→Rᵐ and g:Rᵐ→Rᵏ, result is k×n.",
    workedExample:
      "f(x,y) = (x+y, xy), g(u,v) = u+v². At (1,1): f = (2,1), J_f = [[1,1],[1,1]], J_g(f) = [1, 2·1] = [1,2]. D(g∘f) = [1,2]·[[1,1],[1,1]] = [3,3]. Verify: g(f) = (x+y) + (xy)², ∂/∂x = 1+2xy·y = 3 at (1,1). ✓",
    connections: [
      "Backpropagation in deep learning",
      "Sensitivity propagation",
      "Nested coordinate transforms",
    ],
  },
  changevars: {
    algebraic:
      "For smooth bijection T(u,v)=(x,y), area element transforms as dA = |det J_T| du dv. The absolute value ensures orientation-independent area correction even when T reverses orientation.",
    computation:
      "Select substitution that simplifies region or integrand. Map old bounds to new coordinates. Compute |det J_T|. Rewrite integrand in new variables. Integrate with new bounds.",
    workedExample:
      "Polar: x=r cosθ, y=r sinθ, J = [[cosθ, -r sinθ],[sinθ, r cosθ]], det J = r. So dA = r dr dθ. Integral of e^{-(x²+y²)} over R² = ∫₀^∞ ∫₀^{2π} e^{-r²} r dθ dr = 2π · [-e^{-r²}/2]₀^∞ = π.",
    connections: [
      "Jacobian determinant scaling",
      "Double and triple integrals",
      "Probability density transforms",
    ],
  },
  hessian: {
    algebraic:
      "Hessian H_f is symmetric under C² smoothness (Schwarz's theorem) and defines the local quadratic form Q(h) = h^T H_f h. Positive-definite H means Q>0 for all h≠0 (local minimum); indefinite H means saddle.",
    computation:
      "Compute all n² second partials (only n(n+1)/2 distinct due to symmetry), assemble matrix, test definiteness via eigenvalues or Sylvester's criterion (leading principal minors).",
    workedExample:
      "f = x² + xy + 3y² gives H = [[2,1],[1,6]]. det H = 12-1 = 11 > 0 and H₁₁ = 2 > 0, so H is positive definite — local minimum at the critical point (0,0) if f(0,0)=0.",
    connections: [
      "Critical-point classification",
      "Second-order Taylor models",
      "Newton optimization steps",
    ],
  },
  criticalpoints: {
    algebraic:
      "Candidates satisfy ∇f = 0. In 2D, the discriminant D = f_xx·f_yy - (f_xy)² classifies: D>0, f_xx>0 → min; D>0, f_xx<0 → max; D<0 → saddle; D=0 → inconclusive.",
    computation:
      "Solve ∇f=0 system for candidates (may have multiple solutions). Evaluate Hessian at each. Compare function values at candidates and boundary to find global extrema.",
    workedExample:
      "f = x²-y² has ∇f = (2x, -2y) = 0 only at (0,0). H = [[2,0],[0,-2]], det H = -4 < 0 → saddle. Moving right: f increases. Moving up: f decreases. No extremum at origin.",
    connections: [
      "Hessian definiteness",
      "Constrained extrema via Lagrange multipliers",
      "Optimization geometry and convergence",
    ],
  },
  taylor2: {
    algebraic:
      "Second-order expansion: f(a+h) = f(a) + ∇f(a)^T h + ½ h^T H_f(a) h + R₂(h) where ||R₂(h)||/||h||² → 0 as h → 0. This is the multivariate version of the scalar Taylor expansion.",
    computation:
      "Evaluate f(a), ∇f(a), and H_f(a) at expansion point. Substitute offset vector h = (x-a, y-b, ...) into formula. Useful for quadratic trust-region models.",
    workedExample:
      "f = e^{x+y} at (0,0): f(0,0)=1, ∇f=(1,1), H=[[1,1],[1,1]]. Second-order model: 1 + x + y + ½(x²+2xy+y²) = 1 + (x+y) + ½(x+y)². Check: e^{0.1+0.1} = e^{0.2} ≈ 1.221, model gives 1+0.2+0.02 = 1.22. ✓",
    connections: [
      "Linearization refinement",
      "Quadratic optimization models",
      "Error term analysis",
    ],
  },
  lagrange: {
    algebraic:
      "Constrained extrema of f on g(x)=c satisfy ∇f = λ∇g with feasibility g(x)=c. The n+1 equations (n for gradient matching + 1 for constraint) determine n+1 unknowns (x₁,...,xₙ, λ).",
    computation:
      "Set up the system, solve for all unknowns, evaluate f at each candidate. For multiple constraints g_i(x)=cᵢ, introduce one λᵢ per constraint.",
    workedExample:
      "Maximize f = xy on g = x²+y²=1: ∇f=(y,x) = λ(2x,2y). So y=2λx and x=2λy. Multiply: xy = 4λ²xy → λ = ±½. From y=2λx: y=±x. On circle: x=±1/√2, y=±1/√2. Max f = ½ at (1/√2, 1/√2) and (-1/√2,-1/√2).",
    connections: [
      "Constraint geometry and feasible sets",
      "Gradient alignment at optimum",
      "Critical-point analysis on manifolds",
    ],
  },
  divergence: {
    algebraic:
      "Divergence is trace of Jacobian of F: div F = tr(J_F) = Σᵢ ∂Fᵢ/∂xᵢ. It equals infinitesimal flux density and satisfies the divergence theorem: ∯_S F·n dS = ∭_V div F dV.",
    computation:
      "Differentiate each component along its own coordinate axis and add. In curvilinear coordinates, the formula changes — e.g., cylindrical: ∇·F = (1/r)∂(rFᵣ)/∂r + (1/r)∂Fθ/∂θ + ∂Fz/∂z.",
    workedExample:
      "F = (x, -2y, 3z): div F = ∂x/∂x + ∂(-2y)/∂y + ∂(3z)/∂z = 1 - 2 + 3 = 2. Every small volume element acts as a net source with density 2 — more flow exits than enters uniformly.",
    connections: [
      "Flux integrals and divergence theorem",
      "Incompressible flow test (div F = 0)",
      "Maxwell's equations (Gauss's laws)",
    ],
  },
  curl: {
    algebraic:
      "Curl is the antisymmetric part of Jacobian encoded as a vector in 3D. In component form: (curl F)_x = ∂F_z/∂y - ∂F_y/∂z, etc. Curl F = 0 everywhere implies F = ∇φ for some potential φ (under suitable conditions).",
    computation:
      "Use the determinant mnemonic with i,j,k top row, ∂x,∂y,∂z middle row, F_x,F_y,F_z bottom row — but remember this is a formal mnemonic, not a true determinant.",
    workedExample:
      "F = (-y, x, 0) (counter-clockwise rotation field): curl F = (0-0, 0-0, ∂x/∂x - ∂(-y)/∂y) = (0, 0, 1+1) = (0, 0, 2). A paddle wheel at any point spins counterclockwise with angular velocity 1.",
    connections: [
      "Circulation via Stokes' theorem",
      "Conservative field and irrotational checks",
      "Vorticity in fluid mechanics",
    ],
  },
  lineintegral: {
    algebraic:
      "Vector line integral integrates tangential component: ∫_C F·dr. For conservative F=∇φ: ∫_C F·dr = φ(end) - φ(start), path-independent. For closed loops, ∮_C F·dr = 0 iff F is conservative.",
    computation:
      "Choose parametrization r(t) for a≤t≤b. Compute F(r(t))·r'(t) (dot product). Integrate scalar function over [a,b]. Check orientation: reversing path flips sign.",
    workedExample:
      "F = (y, x) along r(t) = (t, t²), t∈[0,1]: r'(t) = (1, 2t). F(r(t)) = (t², t). Integrand: t²·1 + t·2t = t² + 2t² = 3t². Integral: ∫₀¹ 3t² dt = [t³]₀¹ = 1. Note: F = ∇(xy), so result = xy at (1,1) - xy at (0,0) = 1-0 = 1. ✓",
    connections: [
      "Work and energy in physics",
      "Conservative potentials and gradient fields",
      "Green's and Stokes' theorem",
    ],
  },
  greentheorem: {
    algebraic:
      "For C = ∂R positively oriented, circulation equals area integral of scalar curl: ∮(P dx + Q dy) = ∬(∂Q/∂x - ∂P/∂y) dA. This Q_x - P_y is the 2D curl (z-component of 3D curl).",
    computation:
      "Choose the easier side: boundary integrals for simple field, area integrals for complex boundary. Ensure counterclockwise orientation. For multiply-connected regions, sum over all boundary components.",
    workedExample:
      "Area formula: A = ½ ∮(x dy - y dx) comes from Green's theorem with P=-y/2, Q=x/2. For unit circle r(t) = (cos t, sin t): ½∫₀^{2π} (cos²t + sin²t) dt = ½·2π = π. ✓",
    connections: [
      "Line-integral simplification",
      "2D curl density interpretation",
      "Special case of Stokes' theorem",
    ],
  },
  doubleintegral: {
    algebraic:
      "Double integral is limit of Riemann sums ΣΣ f(xᵢ,yⱼ)ΔA. Fubini's theorem: ∬ f dA = ∫(∫ f(x,y) dy) dx = ∫(∫ f(x,y) dx) dy when f is continuous on R.",
    computation:
      "Describe region R with inequalities. Choose integration order: dxdy or dydx (or polar). Integrate inner variable first (limits may depend on outer), then outer.",
    workedExample:
      "∫₀¹ ∫₀¹ (x+y) dx dy = ∫₀¹ [x²/2+xy]₀¹ dy = ∫₀¹ (1/2+y) dy = [y/2+y²/2]₀¹ = 1/2+1/2 = 1. Interpretation: average value of x+y over unit square is 1/(area·1) = 1.",
    connections: [
      "Area and mass accumulation",
      "Polar-coordinate Jacobians",
      "Expectation over 2D densities in probability",
    ],
  },
  tripleintegral: {
    algebraic:
      "Triple integral is a 3D Riemann-sum limit: ∭_V f dV = ∫∫∫ f(x,y,z) dx dy dz. Under standard conditions, iterated in any order. Spherical: dV = r²sinφ dr dφ dθ.",
    computation:
      "Sketch volume. Choose coordinates (Cartesian if rectangular, cylindrical for rotational symmetry, spherical for radial symmetry). Set bounds systematically from outer to inner.",
    workedExample:
      "Mass of unit ball with density ρ=1: in spherical coordinates, ∫₀^{2π}∫₀^π∫₀¹ r² sinφ dr dφ dθ = 2π · 2 · (1/3) = 4π/3. This matches the volume formula V = (4/3)πr³ for r=1. ✓",
    connections: [
      "3D mass and charge density models",
      "Cylindrical and spherical coordinate transforms",
      "Divergence theorem in volume integrals",
    ],
  },
  surfaceintegral: {
    algebraic:
      "Flux integral over parameterized surface r(u,v) uses normal element r_u × r_v: ∬_S F·n dS = ∬_D F(r(u,v)) · (r_u × r_v) du dv. The cross product gives both direction and magnitude of the area element.",
    computation:
      "Parameterize S, compute r_u and r_v as partial derivatives, take cross product to get dS vector. Dot with F, then integrate over parameter domain D.",
    workedExample:
      "Flux of F=(0,0,1) through hemisphere z=√(1-x²-y²): use polar parameterization. dS = (-∂z/∂x, -∂z/∂y, 1)dA. F·dS = 1·dA. Flux = ∬_{x²+y²≤1} 1 dA = π (area of unit disk). Just the projected area for a purely vertical field!",
    connections: [
      "Flux interpretation in physics",
      "Divergence theorem for closed surfaces",
      "Normal vector orientation geometry",
    ],
  },
};
