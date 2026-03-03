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
  },
};
