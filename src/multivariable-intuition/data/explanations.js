export const EXPLANATIONS = {
  partials: {
    what: "Partial derivatives measure how a multivariable function changes with respect to one variable while holding the others fixed.",
    visual:
      "At a point on a surface, move only along x to get one slope and only along y to get another. Those are f_x and f_y.",
    intuition: [
      "Each partial isolates one axis of change",
      "Partials are building blocks for gradient and tangent planes",
      "Different directions can have very different slopes",
      "Smoothness assumptions matter for mixed partial symmetry",
    ],
    formula: "f_x = ∂f/∂x,  f_y = ∂f/∂y",
  },
  gradient: {
    what: "The gradient vector collects all partial derivatives and points in the direction of steepest increase.",
    visual:
      "On contour lines, the gradient arrow is perpendicular to the level curve and points uphill.",
    intuition: [
      "Gradient magnitude is maximum directional derivative",
      "Gradient is normal to level sets",
      "Optimization methods follow negative gradient downhill",
      "Zero gradient marks critical points",
    ],
    formula: "∇f = [f_x, f_y, ..., f_n]^T",
  },
  directional: {
    what: "The directional derivative gives rate of change of f in an arbitrary unit direction u.",
    visual:
      "Project the gradient onto a direction arrow. The projection length is the directional derivative.",
    intuition: [
      "Directional derivative is largest along gradient direction",
      "Opposite gradient gives steepest descent",
      "Orthogonal to gradient means no first-order change",
      "Requires unit direction for direct geometric meaning",
    ],
    formula: "D_u f = ∇f · u, with ||u|| = 1",
  },
  tangentplane: {
    what: "For z = f(x,y), the tangent plane is the best local linear approximation near a point.",
    visual:
      "A curved patch and a local plane touch at one point with matching first-order slopes.",
    intuition: [
      "Tangent plane captures first-order behavior",
      "Error grows away from the contact point",
      "Plane coefficients are partial derivatives",
      "Linearization powers fast approximation and error analysis",
    ],
    formula: "z ≈ f(a,b) + f_x(a,b)(x-a) + f_y(a,b)(y-b)",
  },
  jacobian: {
    what: "The Jacobian matrix is the derivative of a vector-valued function; it gives the best local linear map.",
    visual:
      "A tiny square near a point transforms into a small parallelogram under the local Jacobian map.",
    intuition: [
      "Jacobian generalizes derivative to multivariable maps",
      "Columns describe transformed basis directions",
      "Determinant of Jacobian gives local area/volume scaling",
      "Used in coordinate changes and nonlinear solvers",
    ],
    formula: "J_ij = ∂f_i/∂x_j",
  },
  chainrule: {
    what: "The multivariable chain rule differentiates compositions by multiplying derivatives in sequence.",
    visual:
      "A value flows through layers x -> u -> z. Sensitivity accumulates multiplicatively through each stage.",
    intuition: [
      "Differentiate outer with respect to inner, then inner with respect to input",
      "In vector form, Jacobians multiply",
      "Order follows function composition",
      "Core mechanism behind backpropagation",
    ],
    formula: "J_{g∘f}(x) = J_g(f(x)) J_f(x)",
  },
  changevars: {
    what: "Change of variables rewrites an integral in new coordinates that simplify the region or integrand, with a Jacobian factor correcting local area/volume scaling.",
    visual:
      "A rectangular grid in (u,v) warps into a curved or sheared grid in (x,y). Tiny tiles change area by |det J|.",
    intuition: [
      "Choose coordinates that match geometry of the region",
      "Jacobian determinant accounts for stretching and compression",
      "The absolute value ensures positive area/volume element",
      "Polar, cylindrical, and spherical are standard change-of-variables systems",
    ],
    formula: "∬_R f(x,y) dA = ∬_S f(T(u,v)) |det J_T(u,v)| du dv",
  },
  hessian: {
    what: "The Hessian is the matrix of second partial derivatives. It captures local curvature and second-order interactions between variables.",
    visual:
      "Near a point, contour lines look elliptical for bowl-like curvature or hyperbolic for saddle curvature. Hessian controls that local shape.",
    intuition: [
      "Diagonal terms measure curvature along coordinate axes",
      "Off-diagonal terms encode coupling between variables",
      "Positive-definite Hessian indicates local convexity",
      "Hessian appears in Newton-type optimization methods",
    ],
    formula: "H_f = [∂²f/∂x_i∂x_j]",
  },
  criticalpoints: {
    what: "Critical points are where the gradient is zero (or undefined). They are candidates for local minima, maxima, or saddle points.",
    visual:
      "At minima and maxima, nearby contour lines form nested loops; at saddles, contours cross in hyperbolic patterns.",
    intuition: [
      "Gradient zero is necessary but not sufficient for extrema",
      "Second-derivative tests classify many smooth cases",
      "Saddles can be flat in one direction and steep in another",
      "Constraint problems need constrained critical conditions",
    ],
    formula: "∇f(a) = 0 ; in 2D, D = f_xx f_yy - (f_xy)^2 helps classify",
  },
  taylor2: {
    what: "Second-order Taylor approximation refines linearization by adding a quadratic curvature term from the Hessian.",
    visual:
      "A tangent plane gives first-order fit, while the quadratic patch bends to track the surface more accurately near the base point.",
    intuition: [
      "First-order term gives slope information",
      "Second-order term captures local bending",
      "Approximation quality is best close to expansion point",
      "Quadratic models power trust-region and Newton methods",
    ],
    formula: "f(a+h) ≈ f(a) + ∇f(a)^T h + 1/2 h^T H_f(a) h",
  },
  lagrange: {
    what: "Lagrange multipliers solve constrained optimization by matching objective gradient with constraint gradient at optimal points.",
    visual:
      "At optimum on a constraint curve, the objective level curve just touches the constraint. Their normals are parallel.",
    intuition: [
      "Constraint direction blocks free movement along steepest descent/ascent",
      "Parallel gradients mean no feasible first-order improvement",
      "Multiple constraints introduce multiple multipliers",
      "Method gives candidates that still need evaluation/classification",
    ],
    formula: "∇f(x) = λ ∇g(x), with g(x) = c",
  },
  divergence: {
    what: "Divergence measures local source/sink strength of a vector field.",
    visual:
      "Arrows spreading out from a point indicate positive divergence; arrows converging indicate negative divergence.",
    intuition: [
      "Divergence is net outflow density",
      "Zero divergence means locally incompressible flow",
      "Scalar field derived from vector field",
      "Connects to flux integrals via divergence theorem",
    ],
    formula: "∇·F = ∂F_x/∂x + ∂F_y/∂y + ∂F_z/∂z",
  },
  curl: {
    what: "Curl measures local rotational tendency of a vector field.",
    visual: "A tiny paddle wheel placed in the field spins if curl is nonzero.",
    intuition: [
      "Curl direction follows right-hand rule",
      "Zero curl fields are locally irrotational",
      "Related to circulation density",
      "Central in fluid flow and electromagnetism",
    ],
    formula: "∇×F = det([[i,j,k],[∂x,∂y,∂z],[F_x,F_y,F_z]])",
  },
  lineintegral: {
    what: "A line integral accumulates a scalar or vector-field contribution along a curve.",
    visual:
      "As you move along a path, each small segment contributes; summing all segments gives total work/accumulation.",
    intuition: [
      "For vector fields, line integral measures work",
      "Path orientation affects sign",
      "Conservative fields make path-independent integrals",
      "Parametrization turns geometry into 1D integral",
    ],
    formula: "∫_C F·dr = ∫_a^b F(r(t))·r'(t) dt",
  },
  greentheorem: {
    what: "Green's theorem connects circulation along a closed planar boundary to curl accumulation across the enclosed region.",
    visual:
      "Walking around the boundary and summing tangential field contribution matches adding tiny local rotations across the interior.",
    intuition: [
      "Boundary integral and area integral describe the same quantity",
      "Orientation matters: counterclockwise gives positive orientation",
      "Useful to convert hard line integrals into easier area integrals",
      "2D counterpart to Stokes' theorem",
    ],
    formula: "∮_C (P dx + Q dy) = ∬_R (∂Q/∂x - ∂P/∂y) dA",
  },
  doubleintegral: {
    what: "A double integral accumulates a function over a 2D region.",
    visual:
      "Partition a region into tiny cells; each contributes value times area. Summing all cells approaches the integral.",
    intuition: [
      "2D analogue of area-under-curve accumulation",
      "Order of integration can be swapped under conditions",
      "Geometric meaning depends on integrand",
      "Coordinate changes use Jacobian factors",
    ],
    formula: "∬_R f(x,y) dA",
  },
  tripleintegral: {
    what: "A triple integral accumulates a scalar field throughout a 3D volume.",
    visual:
      "A volume is sliced into thin layers and tiny boxes; summing value times tiny volume gives total mass/charge/accumulation.",
    intuition: [
      "3D extension of area accumulation",
      "Bounds can be iterated in different orders",
      "Coordinate choice strongly affects complexity",
      "Jacobian factors appear in cylindrical/spherical coordinates",
    ],
    formula: "∭_V f(x,y,z) dV",
  },
  surfaceintegral: {
    what: "A surface integral accumulates quantities over a curved surface; for vector fields it measures flux through that surface.",
    visual:
      "Tiny surface patches each have a normal vector. Flux sums local F·n contributions across all patches.",
    intuition: [
      "Orientation of normal decides sign of flux",
      "Parameterization converts geometry into a 2D integral",
      "Closed-surface flux links to divergence theorem",
      "Useful in electromagnetism and fluid flow",
    ],
    formula: "∬_S F·n dS = ∬_D F(r(u,v)) · (r_u × r_v) du dv",
  },
};
