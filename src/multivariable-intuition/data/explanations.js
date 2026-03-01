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
    visual:
      "A tiny paddle wheel placed in the field spins if curl is nonzero.",
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
};
