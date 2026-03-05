export const EXPLANATIONS = {
  partials: {
    what: "Partial derivatives measure how a multivariable function changes with respect to one variable while holding the others fixed. They are the first step in understanding how a scalar field responds along each coordinate axis independently.",
    visual:
      "At a point on a surface, move only along x to get one slope and only along y to get another. Those are f_x and f_y — two independent slice-slopes at the same point.",
    intuition: [
      "Each partial isolates one axis of change",
      "Partials are building blocks for gradient and tangent planes",
      "Different directions can have very different slopes at the same point",
      "Smoothness assumptions (C² continuity) guarantee mixed-partial symmetry",
      "Higher-order partials capture curvature and appear in Hessian construction",
    ],
    formula: "f_x = ∂f/∂x,  f_y = ∂f/∂y",
    deepDive: [
      "Partial derivatives formalize the idea of slicing a multivariable surface along a coordinate axis. When you compute ∂f/∂x, you are literally freezing every other variable and differentiating the resulting single-variable function. This is why two functions can have identical partial derivatives at a point yet behave very differently in other directions — the partials only probe behavior along the coordinate axes.",
      "A critical subtlety is that existence of all partial derivatives at a point does not guarantee that the function is differentiable there, or even continuous. The classic counterexample f(x,y) = xy/(x²+y²) for (x,y)≠(0,0) has both partials equal to zero at the origin, yet is not continuous there. Full differentiability requires the much stronger condition that the linear approximation error is o(‖h‖) as h→0.",
      "$$\\\\frac{\\\\partial^2 f}{\\\\partial x \\\\partial y} = \\\\frac{\\\\partial^2 f}{\\\\partial y \\\\partial x}$$",
      "The equality of mixed partials (Schwarz/Clairaut theorem) holds whenever the second partials are continuous (class C²). This symmetry means the Hessian matrix is symmetric, which has profound consequences: it is diagonalizable by an orthonormal basis, and its eigenvalues are all real — the foundation of the second-derivative test.",
    ],
  },
  gradient: {
    what: "The gradient vector collects all partial derivatives and points in the direction of steepest increase of a scalar function. Its magnitude gives the maximum rate of change at that point.",
    visual:
      "On contour lines, the gradient arrow is perpendicular to the level curve and points uphill — the steeper the terrain, the longer the arrow.",
    intuition: [
      "Gradient magnitude is the maximum directional derivative",
      "Gradient is normal to level sets at every point",
      "Optimization methods follow negative gradient downhill",
      "Zero gradient marks critical points — necessary but not sufficient for extrema",
      "Gradient norm measures local sensitivity intensity across all directions simultaneously",
    ],
    formula: "∇f = [f_x, f_y, ..., f_n]^T",
    deepDive: [
      "The gradient is the unique vector that encodes all first-order directional information about f. Given any unit direction u, the directional derivative D_u f equals ∇f · u, so knowing ∇f is sufficient to predict the rate of change in every direction simultaneously. This efficiency is why gradient descent needs only one gradient evaluation per step to determine the locally optimal descent direction.",
      "Geometrically, the gradient is orthogonal to the level set {x : f(x) = c} passing through a point. This follows directly from the chain rule: if r(t) is a curve lying in the level set, then f(r(t)) = c implies ∇f · r'(t) = 0 for every tangent vector r'(t). Hence ∇f is normal to all tangent vectors of the level set — it points straight out of the surface.",
      "$$\\\\|\\\\nabla f(\\\\mathbf{x})\\\\| = \\\\max_{\\\\|\\\\mathbf{u}\\\\|=1} D_{\\\\mathbf{u}} f(\\\\mathbf{x})$$",
    ],
  },
  directional: {
    what: "The directional derivative gives rate of change of f in an arbitrary unit direction u. It equals the dot product of the gradient and the direction vector, so all directional information is encoded in the gradient.",
    visual:
      "Project the gradient onto a direction arrow. The projection length is the directional derivative — maximum along the gradient, zero perpendicular, negative opposite.",
    intuition: [
      "Directional derivative is largest along gradient direction",
      "Opposite gradient gives steepest descent",
      "Orthogonal to gradient means no first-order change (moving along a level set)",
      "Requires unit direction for direct geometric meaning",
      "Multiple step directions can be compared efficiently through a single gradient evaluation",
    ],
    formula: "D_u f = ∇f · u, with ||u|| = 1",
    deepDive: [
      "The directional derivative generalizes the ordinary derivative to arbitrary directions in R^n. The requirement that u be a unit vector is essential: without normalization, scaling u would scale the derivative, making comparisons between directions meaningless. With unit u, D_u f gives the true slope of f along that direction — the rise-over-run for motion in direction u.",
      "The Cauchy-Schwarz inequality applied to ∇f · u immediately shows that the maximum directional derivative equals ‖∇f‖, achieved when u = ∇f/‖∇f‖. This gives a clean interpretation: the gradient not only points in the steepest direction, but its magnitude tells you exactly how steep that direction is. Directions making angle θ with the gradient have directional derivative ‖∇f‖ cos θ.",
      "$$D_{\\\\mathbf{u}} f(\\\\mathbf{x}) = \\\\nabla f(\\\\mathbf{x}) \\\\cdot \\\\mathbf{u} = \\\\|\\\\nabla f(\\\\mathbf{x})\\\\| \\\\cos\\\\theta$$",
    ],
  },
  tangentplane: {
    what: "For z = f(x,y), the tangent plane is the best local linear approximation near a point. It captures first-order behavior and is the multivariable analogue of a tangent line.",
    visual:
      "A curved patch and a local plane touch at one point with matching slopes. Near the contact point the plane follows the surface closely; farther away it drifts off.",
    intuition: [
      "Tangent plane captures first-order behavior only — quadratic terms are ignored",
      "Error grows quadratically away from the contact point",
      "Plane coefficients are exactly the partial derivatives at the base point",
      "Linearization powers fast approximation and error analysis in engineering",
      "Extending to vector-valued functions, the tangent plane generalizes to the Jacobian matrix",
    ],
    formula: "z ≈ f(a,b) + f_x(a,b)(x-a) + f_y(a,b)(y-b)",
    deepDive: [
      "The tangent plane is not merely an approximation that happens to be close — it is the unique affine function that agrees with f at (a,b) and has the same partial derivatives there. The error in the approximation, f(a+h,b+k) − [f(a,b) + f_x h + f_y k], is o(‖(h,k)‖) as (h,k)→0. This 'little-o' condition is precisely the definition of differentiability in multiple variables.",
      "This linearization is the workhorse of numerical analysis and physical modeling. Root-finding via Newton's method in R^n replaces f with its tangent plane (Jacobian approximation) at each iteration. Error propagation in engineering computes how input uncertainties δx, δy translate to output uncertainty through the partial derivatives — the tangent plane is the first-order transfer function.",
      "$$\\\\Delta z \\\\approx \\\\frac{\\\\partial f}{\\\\partial x}\\\\Delta x + \\\\frac{\\\\partial f}{\\\\partial y}\\\\Delta y$$",
    ],
  },
  jacobian: {
    what: "The Jacobian matrix is the derivative of a vector-valued function; its (i,j) entry is the partial of output i with respect to input j. It gives the best local linear map between input and output spaces.",
    visual:
      "A tiny square near a point transforms into a small parallelogram under the local Jacobian map. The determinant gives how much area was stretched or compressed.",
    intuition: [
      "Jacobian generalizes the scalar derivative to multivariable maps",
      "Columns describe how transformed basis directions look in output space",
      "Determinant of square Jacobian gives local area/volume scaling and orientation",
      "Used in coordinate changes, nonlinear solvers, and flow models",
      "Rank of the Jacobian reveals whether the local mapping reduces or preserves dimensionality",
    ],
    formula: "J_ij = ∂f_i/∂x_j",
    deepDive: [
      "The Jacobian is the single most important object in multivariable calculus because it is the derivative. A map F: R^n → R^m is differentiable at x if there exists a linear map J such that ‖F(x+h) − F(x) − Jh‖ / ‖h‖ → 0 as h→0. That linear map is uniquely the Jacobian matrix. Every other differentiation concept — gradient, divergence, curl, partial derivatives — is a special case or minor variant of the Jacobian.",
      "For a square map F: R^n → R^n, the Jacobian determinant |det J| has a precise geometric meaning: it is the factor by which n-dimensional volume is locally scaled. When det J > 0 the map is orientation-preserving; det J < 0 means orientation-reversing; det J = 0 means the map collapses some dimension locally (a critical point). This is exactly why |det J| appears as the correction factor in change-of-variables formulas for integrals.",
      "$$\\\\det J_F(\\\\mathbf{x}) = \\\\lim_{\\\\text{vol}(S)\\\\to 0} \\\\frac{\\\\text{vol}(F(S))}{\\\\text{vol}(S)}$$",
    ],
  },
  chainrule: {
    what: "The multivariable chain rule differentiates compositions by multiplying derivatives in sequence. For vector-valued compositions, scalar derivatives become Jacobian matrices that multiply in composition order.",
    visual:
      "A value flows through layers x → u → z. Sensitivity accumulates multiplicatively through each stage — a small change at input amplifies or attenuates through each map.",
    intuition: [
      "Differentiate outer with respect to inner, then inner with respect to input",
      "In vector form, Jacobians multiply in the same order as function composition",
      "Order matters: J_g · J_f (not J_f · J_g) for g∘f",
      "Core mechanism behind backpropagation in deep networks",
      "Automatic differentiation implements chain rule efficiently by caching intermediate Jacobians",
    ],
    formula: "J_{g∘f}(x) = J_g(f(x)) J_f(x)",
    deepDive: [
      "The multivariable chain rule is a theorem about composing differentiable maps: if F is differentiable at x with Jacobian J_F, and G is differentiable at F(x) with Jacobian J_G, then G∘F is differentiable at x and its Jacobian is J_G · J_F — standard matrix multiplication. The order is essential: J_G is evaluated at F(x), not at x, and the matrices multiply with J_G on the left.",
      "In deep learning, each layer defines a map with a Jacobian (or vector-Jacobian product). Backpropagation is exactly the multivariable chain rule applied in reverse order (from loss to inputs), accumulating VJPs (vector-Jacobian products) rather than explicit Jacobian matrices to avoid the O(n²) cost of storing them. The correctness of every gradient computation in modern ML rests on this theorem.",
      "$$\\\\frac{\\\\partial L}{\\\\partial \\\\mathbf{x}} = \\\\frac{\\\\partial L}{\\\\partial \\\\mathbf{z}} \\\\cdot J_{F}(\\\\mathbf{x}) = \\\\frac{\\\\partial L}{\\\\partial \\\\mathbf{z}} \\\\cdot \\\\frac{\\\\partial \\\\mathbf{z}}{\\\\partial \\\\mathbf{x}}$$",
    ],
  },
  changevars: {
    what: "Change of variables rewrites an integral in new coordinates that simplify the region or integrand, with a Jacobian determinant factor correcting for local area/volume scaling in the new system.",
    visual:
      "A rectangular grid in (u,v) warps into a curved or sheared grid in (x,y). Tiny tiles change area by |det J|, so the integral picks up this correction factor to stay exact.",
    intuition: [
      "Choose coordinates that match the geometry of the region or symmetry of the integrand",
      "Jacobian determinant accounts for local stretching and compression of area elements",
      "The absolute value ensures the area element is always positive",
      "Polar, cylindrical, and spherical are the three canonical change-of-variables systems",
      "Probability density transforms also use the Jacobian when applying nonlinear random-variable mappings",
    ],
    formula: "∬_R f(x,y) dA = ∬_S f(T(u,v)) |det J_T(u,v)| du dv",
    deepDive: [
      "The change-of-variables theorem is the multidimensional generalization of u-substitution. The core idea is that area (or volume) is not preserved under nonlinear maps, so the integral must compensate. Locally, the map T behaves like its linear approximation J_T, and a unit square in (u,v) maps to a parallelogram in (x,y) with area |det J_T|. Summing these contributions over the domain gives the exact correction factor.",
      "For polar coordinates, x = r cos θ, y = r sin θ, the Jacobian determinant is r — which is why the area element dA becomes r dr dθ. For spherical coordinates (r, φ, θ), det J = r² sin φ, giving dV = r² sin φ dr dφ dθ. These factors are not arbitrary conventions; they are forced by the geometry of the coordinate transformation.",
      "$$\\\\iint_R f(x,y)\\\\,dA = \\\\iint_S f(T(u,v))\\\\left|\\\\det\\\\frac{\\\\partial(x,y)}{\\\\partial(u,v)}\\\\right|du\\\\,dv$$",
    ],
  },
  hessian: {
    what: "The Hessian is the symmetric matrix of second partial derivatives. It captures local curvature, second-order interactions between variables, and determines whether a critical point is a min, max, or saddle.",
    visual:
      "Near a point, contour lines look elliptical for bowl-like curvature (positive-definite Hessian) or hyperbolic for saddle curvature (indefinite). The Hessian controls that local shape.",
    intuition: [
      "Diagonal terms measure curvature along coordinate axes",
      "Off-diagonal terms encode coupling between pairs of variables",
      "Positive-definite Hessian means the function is locally convex — a bowl",
      "Hessian appears in Newton-type optimization for second-order steps",
      "By Schwarz's theorem, Hessian is symmetric when second partials are continuous — only n(n+1)/2 distinct entries",
    ],
    formula: "H_f = [∂²f/∂x_i∂x_j]",
    deepDive: [
      "The Hessian is the second derivative of a scalar function in the same sense that the Jacobian is the first derivative of a vector function. For a quadratic form q(h) = h^T H h, the Hessian completely determines the shape: all eigenvalues positive means the quadratic is a bowl (positive definite); all negative means an inverted bowl; mixed signs mean a saddle. This eigenvalue analysis generalizes directly to classifying critical points of smooth functions.",
      "In convex optimization, positive semi-definiteness of the Hessian everywhere characterizes convex functions. Newton's method replaces the function with its second-order Taylor model and steps directly to the minimum of that quadratic, giving quadratic convergence near a minimum — far superior to the linear convergence of gradient descent. The computational cost is inverting H at each step, which is O(n³) for dense problems.",
      "$$f(\\\\mathbf{x} + \\\\mathbf{h}) = f(\\\\mathbf{x}) + \\\\nabla f(\\\\mathbf{x})^\\\\top \\\\mathbf{h} + \\\\frac{1}{2}\\\\mathbf{h}^\\\\top H_f(\\\\mathbf{x})\\\\mathbf{h} + O(\\\\|\\\\mathbf{h}\\\\|^3)$$",
    ],
  },
  criticalpoints: {
    what: "Critical points are where the gradient is zero (or undefined). They are candidates for local minima, maxima, or saddle points — the full classification requires second-order analysis.",
    visual:
      "At minima and maxima, nearby contour lines form nested loops; at saddles, contours cross in hyperbolic patterns revealing the two-way curvature.",
    intuition: [
      "Gradient zero is necessary but not sufficient for extrema",
      "Second-derivative test via Hessian determinant classifies many smooth cases",
      "Saddles are flat in one direction and steep in another — common in high-dimensional landscapes",
      "Constraint problems need Lagrange multipliers rather than unconstrained gradient conditions",
      "Global extrema also require checking the behavior on the boundary of the feasible domain",
    ],
    formula: "∇f(a) = 0 ; in 2D, D = f_xx f_yy - (f_xy)^2 helps classify",
    deepDive: [
      "The second-derivative test in two variables uses the discriminant D = f_xx f_yy − (f_xy)². When D > 0 and f_xx > 0, the Hessian is positive definite and the critical point is a local minimum. When D > 0 and f_xx < 0, it is a local maximum. When D < 0, the Hessian is indefinite and the point is a saddle. When D = 0, the test is inconclusive — higher-order analysis is required.",
      "In high-dimensional machine learning landscapes (n in the millions), almost all critical points of a random-looking loss surface are saddle points rather than local minima. This is because a local minimum requires all n Hessian eigenvalues to be positive — an increasingly unlikely event as n grows. Gradient descent with noise (SGD) typically escapes saddles efficiently, which partly explains why it works well in practice despite not being a second-order method.",
      "$$D = \\\\det H_f = f_{xx}f_{yy} - f_{xy}^2 \\\\begin{cases} > 0,\\; f_{xx}>0 & \\\\text{local min} \\\\\\\\ > 0,\\; f_{xx}<0 & \\\\text{local max} \\\\\\\\ < 0 & \\\\text{saddle} \\\\end{cases}$$",
    ],
  },
  taylor2: {
    what: "Second-order Taylor approximation refines linearization by adding a quadratic curvature term from the Hessian. It is the local quadratic model used in Newton-type optimization methods.",
    visual:
      "A tangent plane gives first-order fit, while the quadratic patch curves to track the surface more accurately near the base point — especially important near saddles and minima.",
    intuition: [
      "First-order term gives slope information",
      "Second-order term captures local bending and interaction between directions",
      "Approximation quality is best close to the expansion point and degrades farther out",
      "Quadratic models power trust-region and Newton methods in optimization",
      "The convergence radius determines how far the second-order model stays accurate before higher-order terms dominate",
    ],
    formula: "f(a+h) ≈ f(a) + ∇f(a)^T h + 1/2 h^T H_f(a) h",
    deepDive: [
      "The second-order Taylor expansion is the best quadratic fit to f near a point in the same sense that the tangent plane is the best linear fit. The remainder after the quadratic term is O(‖h‖³), meaning the quadratic model is accurate to third order. For functions with large third derivatives, the region of accurate approximation may be small — this is why trust-region methods explicitly constrain the step size ‖h‖ ≤ Δ.",
      "Newton's method minimizes the quadratic model exactly: setting the gradient of the quadratic to zero gives h* = −H^{−1} ∇f. Near a strict local minimum (where H is positive definite), this step converges quadratically — each iteration roughly doubles the number of correct digits. This is dramatically faster than gradient descent's linear convergence, at the cost of computing and inverting the Hessian each step.",
      "$$f(\\\\mathbf{a}+\\\\mathbf{h}) = f(\\\\mathbf{a}) + \\\\nabla f(\\\\mathbf{a})^\\\\top \\\\mathbf{h} + \\\\frac{1}{2}\\\\mathbf{h}^\\\\top H_f(\\\\mathbf{a})\\\\mathbf{h} + O(\\\\|\\\\mathbf{h}\\\\|^3)$$",
    ],
  },
  lagrange: {
    what: "Lagrange multipliers solve constrained optimization by matching objective gradient with constraint gradient at optimal points. The method converts a constrained problem into a larger unconstrained system.",
    visual:
      "At the optimum on a constraint curve, the objective level curve just touches the constraint. Their normals are parallel — moving along the constraint no longer improves the objective.",
    intuition: [
      "Constraint direction blocks free movement along steepest descent",
      "Parallel gradients mean no feasible first-order improvement is possible",
      "Multiple constraints introduce multiple multipliers λ₁, λ₂, …",
      "The method gives critical-point candidates that still require further evaluation to classify",
      "The multiplier λ has an economic interpretation as the marginal cost of relaxing the constraint",
    ],
    formula: "∇f(x) = λ ∇g(x), with g(x) = c",
    deepDive: [
      "The Lagrange condition ∇f = λ∇g has a clean geometric meaning: at an optimum on the constraint surface g(x) = c, the gradient of f must be normal to the constraint (since ∇g is normal to level sets of g). If ∇f had any component tangent to the constraint, we could move along the constraint in that direction and improve f — contradicting optimality. So the gradients must be parallel, i.e., ∇f = λ∇g.",
      "The Lagrangian function L(x, λ) = f(x) − λ(g(x) − c) encapsulates the entire system: its stationary conditions ∂L/∂x = 0 and ∂L/∂λ = 0 recover exactly ∇f = λ∇g and g(x) = c. For inequality constraints g(x) ≤ c, the Karush-Kuhn-Tucker (KKT) conditions generalize Lagrange multipliers and are the foundation of modern nonlinear programming theory.",
      "$$\\\\nabla f(\\\\mathbf{x}^*) = \\\\sum_{i=1}^m \\\\lambda_i \\\\nabla g_i(\\\\mathbf{x}^*), \\\\quad g_i(\\\\mathbf{x}^*) = c_i$$",
    ],
  },
  divergence: {
    what: "Divergence measures local source/sink strength of a vector field — how much more flow exits a tiny volume than enters it. Positive divergence means sources; negative means sinks.",
    visual:
      "Arrows spreading out from a point indicate positive divergence; arrows converging indicate negative divergence. Zero divergence means the field is locally incompressible.",
    intuition: [
      "Divergence is net outflow density at a point",
      "Zero divergence means locally incompressible flow — no mass creation or destruction",
      "Output is a scalar field derived from a vector field",
      "Connects to volume flux integrals via the divergence theorem",
      "The divergence theorem links total volume integral of divergence to net surface flux",
    ],
    formula: "∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z",
    deepDive: [
      "Divergence is formally the limit of net outward flux per unit volume as the volume shrinks to a point: div F(p) = lim_{V→{p}} (1/|V|) ∮_{∂V} F·n dS. This limit definition makes the physical meaning precise and is coordinate-independent, even though the component formula ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z is expressed in Cartesian coordinates. In other coordinate systems (cylindrical, spherical) the formula looks different because the basis vectors are not constant.",
      "In electromagnetism, Gauss's law states that ∇·E = ρ/ε₀: the divergence of the electric field equals the charge density (the source strength). In fluid dynamics, the incompressibility condition ∇·v = 0 expresses mass conservation for constant-density flow. These applications show that divergence precisely quantifies whether field lines are being created (positive divergence) or destroyed (negative divergence) at each point.",
      "$$\\\\oiint_{\\\\partial V} \\\\mathbf{F} \\\\cdot d\\\\mathbf{S} = \\\\iiint_V \\\\nabla \\\\cdot \\\\mathbf{F}\\\\, dV$$",
    ],
  },
  curl: {
    what: "Curl measures local rotational tendency of a vector field. In 3D it is a vector whose direction gives the rotation axis and whose magnitude gives rotation intensity.",
    visual:
      "A tiny paddle wheel placed in the field spins if curl is nonzero. The rotation rate and axis match the curl vector at that point.",
    intuition: [
      "Curl direction follows right-hand rule — curl points along the axis of local rotation",
      "Zero curl fields are locally irrotational — no swirling motion",
      "Curl is related to circulation density around infinitesimal loops",
      "Central in fluid vorticity analysis and Maxwell's electromagnetic equations",
      "Conservative (gradient) fields have zero curl everywhere; curl-free implies path-independent line integrals",
    ],
    formula: "∇×F = det([[i,j,k],[∂x,∂y,∂z],[F_x,F_y,F_z]])",
    deepDive: [
      "Like divergence, curl has a coordinate-independent limit definition: (∇×F)·n̂ = lim_{A→{p}} (1/|A|) ∮_{∂A} F·dr, where A is a surface element with unit normal n̂ and ∂A is its boundary curve. This says curl measures circulation density per unit area in a given plane. Stokes' theorem then states that the total circulation around a closed curve equals the flux of curl through any surface bounded by that curve.",
      "The identity curl(grad f) = 0 holds for any twice-continuously-differentiable scalar field f — gradient fields are always irrotational. The converse is true on simply connected domains: if ∇×F = 0 everywhere on a simply connected region, then F = ∇f for some potential f. This is why irrotational flow can be analyzed with potential theory, and why conservative forces in physics have zero curl.",
      "$$\\\\oint_{\\\\partial S} \\\\mathbf{F} \\\\cdot d\\\\mathbf{r} = \\\\iint_S (\\\\nabla \\\\times \\\\mathbf{F}) \\\\cdot d\\\\mathbf{S}$$",
    ],
  },
  lineintegral: {
    what: "A line integral accumulates a scalar or vector-field contribution along a curve. For vector fields it measures work done by the field as a particle traverses the path.",
    visual:
      "As you move along a path, each small segment contributes F·dr — the field projected onto the direction of motion. Summing all contributions gives total work or circulation.",
    intuition: [
      "For vector fields, line integral measures work — force times displacement along path",
      "Path orientation affects sign — reversing the path negates the integral",
      "Conservative fields make path-independent integrals depending only on endpoints",
      "Parametrization converts the geometric path into a 1D integral over the parameter",
      "The fundamental theorem of line integrals: if F=∇f, the integral equals f(end) - f(start)",
    ],
    formula: "∫_C F·dr = ∫_a^b F(r(t))·r'(t) dt",
    deepDive: [
      "The line integral ∫_C F·dr is path-dependent in general: different paths between the same endpoints can give different values. The key test for path independence is whether F is conservative, i.e., F = ∇f for some scalar potential f. In that case the fundamental theorem of line integrals reduces the integral to f(r(b)) − f(r(a)), depending only on the endpoints. On simply connected domains, F conservative ⟺ ∇×F = 0 ⟺ F = ∇f.",
      "For scalar line integrals ∫_C f ds (integrating a scalar field with respect to arc length), the parametrization is ∫_a^b f(r(t)) ‖r'(t)‖ dt. This is intrinsic to the curve — it does not depend on orientation. Applications include computing mass of a wire with variable linear density, or arc length (f = 1). The distinction between ds and dr is crucial: ds is always positive while dr is a signed vector.",
      "$$\\\\int_C \\\\nabla f \\\\cdot d\\\\mathbf{r} = f(\\\\mathbf{r}(b)) - f(\\\\mathbf{r}(a))$$",
    ],
  },
  greentheorem: {
    what: "Green's theorem connects circulation along a closed planar boundary to the curl (scalar rotation density) accumulated across the enclosed region — a duality between boundary and interior.",
    visual:
      "Walking around the boundary and summing tangential field contribution matches adding tiny local rotations across the interior. The same quantity measured two ways.",
    intuition: [
      "Boundary integral and area integral describe the same physical quantity",
      "Orientation matters: counterclockwise boundary gives positive orientation",
      "Convert hard line integrals into easier area integrals or vice versa",
      "2D counterpart to Stokes' theorem in 3D",
      "Green's theorem is the 2D special case of the generalized Stokes theorem on manifolds",
    ],
    formula: "∮_C (P dx + Q dy) = ∬_R (∂Q/∂x - ∂P/∂y) dA",
    deepDive: [
      "Green's theorem comes in two forms. The circulation form ∮_C F·dr = ∬_R (∂Q/∂x − ∂P/∂y) dA connects tangential circulation to curl. The flux form ∮_C F·n ds = ∬_R (∂P/∂x + ∂Q/∂y) dA connects normal flux to divergence. Both are special cases of the generalized Stokes theorem and both require the boundary to be traversed with the region on the left (counterclockwise for simple regions).",
      "A beautiful consequence of Green's theorem is that area can be computed from a boundary integral: Area = (1/2) ∮_C (x dy − y dx). This is used in surveying (the shoelace formula for polygon area) and in planimeter devices that mechanically compute area by tracing a boundary. It also underlies the winding number formula and Cauchy's integral theorem in complex analysis.",
      "$$\\\\oint_{\\\\partial R} P\\\\,dx + Q\\\\,dy = \\\\iint_R \\\\left(\\\\frac{\\\\partial Q}{\\\\partial x} - \\\\frac{\\\\partial P}{\\\\partial y}\\\\right) dA$$",
    ],
  },
  doubleintegral: {
    what: "A double integral accumulates a function over a 2D region — like computing volume under a surface, mass of a lamina with variable density, or probability over a 2D region.",
    visual:
      "Partition a region into tiny cells; each contributes value times area. Summing all cells approaches the integral — identical to stacking infinitely thin columns under a surface.",
    intuition: [
      "2D analogue of area-under-curve accumulation lifted to three dimensions",
      "Order of integration can often be swapped (Fubini) to simplify calculation",
      "Geometric meaning varies: volume, mass, probability, center of mass depending on integrand",
      "Coordinate changes use Jacobian factors to account for area element distortion",
      "Switching integration order (Fubini) can dramatically simplify a difficult inner integral",
    ],
    formula: "∬_R f(x,y) dA",
    deepDive: [
      "Fubini's theorem is the engine that makes double integrals computable: under mild conditions (f integrable on R), the double integral equals the iterated integral in either order. ∬_R f dA = ∫_a^b [∫_{g(x)}^{h(x)} f(x,y) dy] dx = ∫_c^d [∫_{p(y)}^{q(y)} f(x,y) dx] dy. Choosing the right order can mean the difference between a tractable and an intractable inner integral — for example, ∫_0^1 ∫_x^1 sin(y²)/y dy dx reverses to ∫_0^1 ∫_0^y sin(y²)/y dx dy, which evaluates to (1−cos 1)/2.",
      "Double integrals compute moments and centers of mass of laminas: x̄ = (1/M) ∬_R x ρ(x,y) dA, ȳ = (1/M) ∬_R y ρ(x,y) dA, where M = ∬_R ρ dA. Second moments (moments of inertia) require ∬ x² ρ dA — these appear in structural engineering and rotation dynamics. The probability interpretation is equally important: for a joint density f(x,y), P((X,Y) ∈ R) = ∬_R f(x,y) dA.",
      "$$\\\\iint_R f(x,y)\\\\,dA = \\\\int_a^b\\\\int_{g(x)}^{h(x)} f(x,y)\\\\,dy\\\\,dx$$",
    ],
  },
  tripleintegral: {
    what: "A triple integral accumulates a scalar field throughout a 3D volume — computing mass, charge, probability, or any quantity distributed through three-dimensional space.",
    visual:
      "A volume is sliced into thin layers and tiny boxes; summing value times tiny volume dV gives total accumulation — the 3D generalization of area accumulation.",
    intuition: [
      "3D extension of area/volume accumulation",
      "Bounds can be iterated in six different orders — choose the simplest for the region",
      "Coordinate choice (Cartesian, cylindrical, spherical) strongly affects complexity",
      "Jacobian factors (r for cylindrical, r²sinφ for spherical) appear in non-Cartesian coordinates",
      "The divergence theorem converts a triple integral of div F into a surface flux integral",
    ],
    formula: "∭_V f(x,y,z) dV",
    deepDive: [
      "For spherically symmetric problems, spherical coordinates (r, φ, θ) with x = r sinφ cosθ, y = r sinφ sinθ, z = r cosφ give dV = r² sinφ dr dφ dθ. The r² sinφ factor is the Jacobian determinant of the spherical coordinate map. For a ball of radius R, the volume is ∫_0^{2π} ∫_0^π ∫_0^R r² sinφ dr dφ dθ = (4/3)πR³ — the standard formula emerging naturally from the coordinate Jacobian.",
      "Triple integrals compute physical quantities distributed through 3D space: total mass M = ∭ ρ(x,y,z) dV, electric charge Q = ∭ ρ_e dV, gravitational potential Φ(p) = −G ∭ ρ(q)/‖p−q‖ dV(q). The divergence theorem converts ∭_V ∇·F dV = ∯_{∂V} F·n dS, often simplifying computation by replacing a volume integral with a surface integral or vice versa.",
      "$$\\\\iiint_V f\\\\,dV = \\\\int_0^{2\\\\pi}\\\\int_0^{\\\\pi}\\\\int_0^R f\\\\, r^2\\\\sin\\\\varphi\\\\,dr\\\\,d\\\\varphi\\\\,d\\\\theta$$",
    ],
  },
  surfaceintegral: {
    what: "A surface integral accumulates quantities over a curved surface. For vector fields it measures flux — how much of the field passes through the surface perpendicular to it.",
    visual:
      "Tiny surface patches each have an area vector (normal times area). Flux sums local F·n contributions across all patches — like counting field lines threading through the surface.",
    intuition: [
      "Orientation of normal decides sign of flux — outward vs inward normal",
      "Parameterization converts 2D surface geometry into a domain integral",
      "Closed-surface flux links to the enclosed volume divergence via the divergence theorem",
      "Useful for electromagnetic flux (Gauss's law) and fluid transport through membranes",
      "The divergence theorem and Stokes' theorem both use surface integrals as boundary terms",
    ],
    formula: "∬_S F·n dS = ∬_D F(r(u,v)) · (r_u × r_v) du dv",
    deepDive: [
      "The cross product r_u × r_v appearing in the surface integral formula is not merely a computational device — it is the geometric heart of the parameterization. Given a parameterization r(u,v), the vectors r_u and r_v are tangent to the surface, and their cross product gives a normal vector whose magnitude equals the area of the parallelogram they span. This is the infinitesimal area element dS in the parameterized coordinates, correcting for how the parameterization stretches or compresses the surface.",
      "For scalar surface integrals ∬_S f dS (with respect to surface area, not flux), the formula is ∬_D f(r(u,v)) ‖r_u × r_v‖ du dv — using the magnitude of the cross product as an area scaling factor. This computes total mass of a surface with variable density, or just surface area when f = 1. The distinction between scalar dS and vector dS = n dS is crucial: flux integrals use the vector form, while area integrals use the scalar form.",
      "$$\\\\iint_S \\\\mathbf{F} \\\\cdot d\\\\mathbf{S} = \\\\iint_D \\\\mathbf{F}(\\\\mathbf{r}(u,v)) \\\\cdot (\\\\mathbf{r}_u \\\\times \\\\mathbf{r}_v)\\\\,du\\\\,dv$$",
    ],
  },
};
