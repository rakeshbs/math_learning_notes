export const CONCEPT_DETAILS = {
  partials: {
    deeper:
      "Partials isolate axis-wise change in a multivariable function. They are the first local measurements used to build gradient, Jacobian, and linearization.",
    useCases: [
      "Compute local sensitivity to each variable",
      "Build tangent planes and linear approximations",
      "Check smoothness assumptions in models",
    ],
    pitfalls: [
      "Forgetting all other variables are held fixed",
      "Assuming mixed partials are always equal without regularity conditions",
    ],
    quickCheck: "Pick one variable, freeze the rest, then differentiate.",
  },
  gradient: {
    deeper:
      "Gradient collects first-order change in all coordinate directions and defines the local steepest-ascent direction in Euclidean geometry.",
    useCases: [
      "Optimization and gradient-based learning",
      "Detect critical points where first-order change vanishes",
      "Estimate local sensitivity in physical and economic models",
    ],
    pitfalls: [
      "Reading gradient as a global direction rather than local",
      "Ignoring coordinate scaling and units when comparing components",
    ],
    quickCheck:
      "At a point, gradient is orthogonal to the level curve/surface through that point.",
  },
  directional: {
    deeper:
      "Directional derivative is the projection of the gradient onto a direction. It turns a vector rate field into a single scalar rate along chosen motion.",
    useCases: [
      "Measure slope along a constrained path",
      "Compare candidate movement directions",
      "Sensitivity analysis under directional perturbations",
    ],
    pitfalls: [
      "Using non-unit direction vectors without adjusting interpretation",
      "Confusing directional derivative with full gradient vector",
    ],
    quickCheck:
      "Normalize u first; then D_u f = grad f dot u gives directional slope.",
  },
  tangentplane: {
    deeper:
      "The tangent plane is first-order Taylor approximation for surfaces z=f(x,y). It captures local behavior while ignoring curvature terms.",
    useCases: [
      "Fast local approximation around operating points",
      "Error estimation via linearization",
      "Bridge between nonlinear surfaces and linear algebra tools",
    ],
    pitfalls: [
      "Using tangent plane too far from expansion point",
      "Assuming good approximation near non-differentiable points",
    ],
    quickCheck:
      "Plane coefficients are just the partials f_x(a,b) and f_y(a,b).",
  },
  jacobian: {
    deeper:
      "Jacobian is the matrix form of first derivatives for vector-valued maps. It is the best local linear map and drives local distortion.",
    useCases: [
      "Nonlinear solver steps (Newton methods)",
      "Coordinate transformations and change of variables",
      "Stability and sensitivity of dynamical systems",
    ],
    pitfalls: [
      "Mixing row/column conventions for Jacobian layout",
      "Ignoring conditioning when inverting Jacobian numerically",
    ],
    quickCheck:
      "Each entry J_ij is partial of output i with respect to input j.",
  },
  chainrule: {
    deeper:
      "For compositions, local sensitivities multiply in sequence. Chain rule is the backbone of layered models and backpropagation.",
    useCases: [
      "Differentiate nested mappings",
      "Compute neural-network gradients",
      "Propagate uncertainty through composed systems",
    ],
    pitfalls: [
      "Multiplying Jacobians in the wrong order",
      "Dropping evaluation point shifts inside composition",
    ],
    quickCheck:
      "Compose maps in one order, multiply Jacobians in that same composition order.",
  },
  divergence: {
    deeper:
      "Divergence is local net flux density: how much a vector field behaves like a source or sink at each point.",
    useCases: [
      "Fluid compressibility diagnostics",
      "Field source detection",
      "Applying divergence theorem in flux calculations",
    ],
    pitfalls: [
      "Interpreting divergence as global outflow instead of local density",
      "Forgetting divergence gives a scalar field, not a vector",
    ],
    quickCheck:
      "Positive means source-like, negative means sink-like, zero means locally balanced.",
  },
  curl: {
    deeper:
      "Curl measures infinitesimal rotation. In 3D it is a vector, in planar flow its z-component captures spin direction and strength.",
    useCases: [
      "Vorticity analysis in fluids",
      "Maxwell-equation formulations",
      "Checking conservative vs rotational flow behavior",
    ],
    pitfalls: [
      "Confusing swirl-looking paths with actual local curl",
      "Forgetting orientation conventions and right-hand rule",
    ],
    quickCheck:
      "Tiny paddle wheel test: spin implies nonzero curl.",
  },
  lineintegral: {
    deeper:
      "Line integrals accumulate along trajectories. For vector fields they measure work/circulation, coupling field direction with path tangent.",
    useCases: [
      "Work done by force along a path",
      "Circulation around loops",
      "Path-dependent transport quantities",
    ],
    pitfalls: [
      "Dropping path orientation (sign flips)",
      "Assuming path independence without checking conservativeness",
    ],
    quickCheck:
      "Parametrize path, compute F(r(t)) dot r'(t), then integrate in t.",
  },
  doubleintegral: {
    deeper:
      "Double integrals add contributions over areas. They generalize accumulation from curves to regions and support coordinate transforms.",
    useCases: [
      "Mass/charge over a lamina",
      "Average values over regions",
      "Area-based probability and expectation computations",
    ],
    pitfalls: [
      "Incorrect region bounds after order switch",
      "Forgetting Jacobian factors in polar/curvilinear coordinates",
    ],
    quickCheck:
      "Describe region clearly first, then set consistent integration limits.",
  },
};

export const CONCEPT_EXPANSIONS = {
  partials: {
    algebraic:
      "If f(x1,...,xn) is differentiable, each partial is a coordinate component of the derivative map. Mixed partial equality needs continuity assumptions.",
    computation:
      "Treat all non-target variables as constants, differentiate symbolically or with finite differences around a point.",
    workedExample:
      "f(x,y)=x^2y+sin(xy): f_x=2xy+y cos(xy), f_y=x^2+x cos(xy).",
    connections: [
      "Gradient assembly",
      "Tangent-plane coefficients",
      "Jacobian entries",
    ],
  },
  gradient: {
    algebraic:
      "For scalar f, gradient is the vector representation of the differential under Euclidean inner product: df(v)=grad f dot v.",
    computation:
      "Differentiate with respect to each variable, evaluate at point, then package as vector.",
    workedExample:
      "f(x,y)=x^2+3y^2 at (1,-1) gives grad f=(2,-6).",
    connections: [
      "Directional derivatives",
      "Critical-point analysis",
      "Steepest-descent methods",
    ],
  },
  directional: {
    algebraic:
      "D_u f(a)=lim_{h->0}(f(a+hu)-f(a))/h and equals grad f(a) dot u for differentiable f and unit u.",
    computation:
      "Normalize direction u, compute gradient at point, take dot product.",
    workedExample:
      "grad f=(3,4), u=(4/5,3/5) gives D_u f=24/5.",
    connections: [
      "Gradient projection geometry",
      "Constraint-aware sensitivity",
      "Optimization step selection",
    ],
  },
  tangentplane: {
    algebraic:
      "For z=f(x,y), linearization near (a,b) is L(x,y)=f(a,b)+f_x(a,b)(x-a)+f_y(a,b)(y-b).",
    computation:
      "Compute value and first partials at base point, then assemble affine plane.",
    workedExample:
      "f=x^2+y^2 at (1,2): z approx 5 + 2(x-1) + 4(y-2).",
    connections: [
      "First-order Taylor expansion",
      "Local error bounds",
      "Jacobian-based linear models",
    ],
  },
  jacobian: {
    algebraic:
      "For F:R^n->R^m, Jacobian J_F(a) represents derivative DF(a). Determinant in square case gives local volume scaling and orientation.",
    computation:
      "Differentiate each output component with respect to each input variable to fill rows (or columns by convention).",
    workedExample:
      "F(x,y)=(x^2-y,xy): J=[[2x,-1],[y,x]].",
    connections: [
      "Multivariable chain rule",
      "Newton linearization",
      "Change-of-variables Jacobian",
    ],
  },
  chainrule: {
    algebraic:
      "For g∘f, derivative composition is D(g∘f)(x)=Dg(f(x))Df(x); in coordinates, Jacobians multiply.",
    computation:
      "Compute inner Jacobian, evaluate outer Jacobian at inner output, multiply in correct order.",
    workedExample:
      "If f:R^2->R^2 and g:R^2->R, then grad(g∘f)=J_f^T grad g at f(x).",
    connections: [
      "Backpropagation",
      "Sensitivity propagation",
      "Nested coordinate transforms",
    ],
  },
  divergence: {
    algebraic:
      "Divergence is trace of Jacobian of F: div F = tr(J_F). It equals infinitesimal flux density.",
    computation:
      "Differentiate each component along its own coordinate axis and add.",
    workedExample:
      "F=(x,-2y,3z) gives div F = 1-2+3 = 2.",
    connections: [
      "Flux integrals",
      "Divergence theorem",
      "Incompressible flow test",
    ],
  },
  curl: {
    algebraic:
      "Curl is antisymmetric part of Jacobian encoded as a vector in 3D; it measures local circulation density.",
    computation:
      "Compute component-wise partial differences, or determinant mnemonic with i,j,k row.",
    workedExample:
      "F=(-y,x,0) has curl = (0,0,2).",
    connections: [
      "Circulation via Stokes theorem",
      "Irrotational field checks",
      "Fluid vorticity",
    ],
  },
  lineintegral: {
    algebraic:
      "Vector line integral integrates tangential component along a curve. For conservative fields it depends only on endpoints.",
    computation:
      "Choose parametrization r(t), compute F(r(t)) dot r'(t), integrate over parameter interval.",
    workedExample:
      "F=(y,x) along r(t)=(t,t^2), t in [0,1] gives integral int_0^1 (t^2+2t^2)dt=1.",
    connections: [
      "Work and energy",
      "Conservative potentials",
      "Green/Stokes relations",
    ],
  },
  doubleintegral: {
    algebraic:
      "Double integral is limit of Riemann sums over area elements. Fubini allows iterated integrals when conditions hold.",
    computation:
      "Describe region R, choose order dA=dxdy or dydx (or transformed coordinates), integrate inner then outer.",
    workedExample:
      "Over unit square, int_0^1 int_0^1 (x+y) dx dy = 1.",
    connections: [
      "Area and mass accumulation",
      "Polar-coordinate Jacobians",
      "Expectation over 2D densities",
    ],
  },
};
