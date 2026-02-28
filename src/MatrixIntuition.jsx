import { useState, useEffect, useRef, useCallback } from "react";

/* -- Data -- */
var CONCEPTS = [
  { id: "rank", title: "Rank", subtitle: "The dimension of the output space", color: "#E85D04", accent: "#FAA307", group: "core" },
  {
    id: "determinant",
    title: "Determinant",
    subtitle: "How space stretches or squishes",
    color: "#6A4C93",
    accent: "#B8A9C9",
    group: "core",
  },
  { id: "eigenvalues", title: "Eigen", subtitle: "Directions that only stretch", color: "#1B9AAA", accent: "#06D6A0", group: "core" },
  { id: "nullspace", title: "Null Space", subtitle: "What gets crushed to zero", color: "#D62828", accent: "#F77F00", group: "core" },
  { id: "trace", title: "Trace", subtitle: "Sum of diagonal stretches", color: "#2D6A4F", accent: "#52B788", group: "core" },
  { id: "transpose", title: "Transpose", subtitle: "Mirroring across the diagonal", color: "#7209B7", accent: "#F72585", group: "core" },
  { id: "inverse", title: "Inverse", subtitle: "Undoing the transformation", color: "#003566", accent: "#0077B6", group: "core" },
  { id: "span", title: "Column Space", subtitle: "All reachable outputs", color: "#BC6C25", accent: "#DDA15E", group: "core" },
  {
    id: "orthogonal",
    title: "Orthogonality",
    subtitle: "Perfect perpendicularity",
    color: "#06D6A0",
    accent: "#34D399",
    group: "geometry",
  },
  { id: "projection", title: "Projection", subtitle: "Shadows onto subspaces", color: "#F59E0B", accent: "#FCD34D", group: "geometry" },
  { id: "norm", title: "Norm", subtitle: "Measuring vector size", color: "#EF4444", accent: "#FCA5A5", group: "geometry" },
  { id: "svd", title: "SVD", subtitle: "Rotate then Stretch then Rotate", color: "#8B5CF6", accent: "#C4B5FD", group: "decomp" },
  { id: "posdef", title: "Positive Definite", subtitle: "Always curves upward", color: "#10B981", accent: "#6EE7B7", group: "special" },
  { id: "symmetric", title: "Symmetric", subtitle: "Equal across the diagonal", color: "#EC4899", accent: "#F9A8D4", group: "special" },
  {
    id: "linindep",
    title: "Linear Independence",
    subtitle: "No vector is redundant",
    color: "#F97316",
    accent: "#FDBA74",
    group: "foundations",
  },
  { id: "basis", title: "Basis and Dimension", subtitle: "The minimal spanning set", color: "#14B8A6", accent: "#5EEAD4", group: "foundations" },
];

var GROUPS = [
  { id: "core", label: "Core" },
  { id: "geometry", label: "Geometry" },
  { id: "decomp", label: "Decomposition" },
  { id: "special", label: "Special Matrices" },
  { id: "foundations", label: "Foundations" },
];

var EXPLANATIONS = {
  rank: {
    what: "The rank of a matrix is the number of linearly independent columns (or rows). It tells you the dimension of the output space when the matrix acts as a transformation.",
    visual:
      "If two arrows point in truly different directions, they span a 2D plane (rank 2). If parallel, they only span a line (rank 1). If zero, everything collapses to a point (rank 0).",
    intuition: [
      "Rank = how many dimensions survive after transformation",
      "Full rank means no information is lost",
      "Low rank means the matrix flattens space, losing dimensions",
      "Rank tells you how many equations in Ax = b are truly independent",
    ],
    formula: "rank(A) = dim(Col(A)) = number of pivots in RREF",
  },
  determinant: {
    what: "The determinant measures how a matrix scales area (2D) or volume (3D). It captures both the scaling factor and whether orientation is preserved or flipped.",
    visual:
      "The unit square transforms into a parallelogram. Its area is |det(A)|. If det < 0, the orientation has flipped like a mirror image.",
    intuition: ["det = 0 means space is collapsed, matrix not invertible", "|det| > 1 means space is expanded", "|det| < 1 means space is compressed", "det < 0 means orientation is flipped"],
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
      "Rank + Nullity = number of columns",
    ],
    formula: "Null(A) = {v in R^n : Av = 0}",
  },
  trace: {
    what: "The trace is the sum of diagonal entries of a square matrix. It captures the total stretching along coordinate axes.",
    visual:
      "Each diagonal entry scales one axis. The trace adds all individual scalings. The animated box shows how diagonal entries control axis-aligned stretching.",
    intuition: [
      "trace(A) = sum of ALL eigenvalues",
      "trace(AB) = trace(BA), order does not matter",
      "For rotation matrices, trace = 2cos(theta) in 2D",
      "Invariant under change of basis",
    ],
    formula: "tr(A) = a_11 + a_22 + ... + a_nn = sum of lambda_i",
  },
  transpose: {
    what: "The transpose flips a matrix over its diagonal: rows become columns. Entry (i,j) moves to (j,i).",
    visual: "The colored cells swap positions. A 2x3 matrix becomes 3x2. Each color tracks where an entry moves.",
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
    visual: "Watch the shape morph forward under A, then morph backward under A^-1, returning to its original form.",
    intuition: [
      "A^-1 A = A A^-1 = I, the identity",
      "det(A) = 0 means some dimension was crushed, cannot undo",
      "(AB)^-1 = B^-1 A^-1, undoing in reverse order",
      "Computationally expensive for large matrices",
    ],
    formula: "A^-1 exists iff det(A) != 0 ; A A^-1 = I",
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
      "Projection matrices satisfy P^2 = P",
      "Least squares regression IS a projection onto column space",
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
    what: "SVD factors ANY matrix A into U Sigma V^T: rotate, stretch along axes, rotate again. The singular values tell you the stretching amounts.",
    visual:
      "A circle transforms in three stages: rotate (V^T), stretch into ellipse (Sigma), rotate again (U). Every linear transformation is these three steps.",
    intuition: [
      "Works for ANY matrix, not just square or invertible",
      "Singular values are always non-negative and ordered",
      "Number of nonzero singular values = rank",
      "Keep biggest singular values for low-rank approximation",
    ],
    formula: "A = U Sigma V^T where sigma_i = sqrt(lambda_i(A^T A))",
  },
  posdef: {
    what: "A symmetric matrix is positive definite if x^T A x > 0 for every nonzero x. The quadratic form is a bowl that always curves upward.",
    visual:
      "Elliptical contours show level curves of x^T A x = constant. Both eigenvalues positive means a single minimum at origin, no saddle points.",
    intuition: [
      "All eigenvalues strictly positive",
      "Quadratic form x^T A x is a bowl (global minimum at origin)",
      "Positive semi-definite: eigenvalues >= 0",
      "Hessian is pos-def means local min is global min",
    ],
    formula: "A > 0 iff lambda_i > 0 for all i iff x^T A x > 0 for all x != 0",
  },
  symmetric: {
    what: "A matrix is symmetric if A = A^T, meaning entry (i,j) equals entry (j,i). Perfectly mirrored across the main diagonal.",
    visual: "Watch highlighted pairs: each off-diagonal element equals its mirror. The diagonal is the line of symmetry.",
    intuition: [
      "Symmetric matrices have ALL real eigenvalues",
      "Eigenvectors are always orthogonal to each other",
      "Spectral theorem: A = Q Lambda Q^T",
      "Covariance matrices, Hessians are symmetric",
    ],
    formula: "A = A^T iff a_ij = a_ji ; A = Q Lambda Q^T",
  },
  linindep: {
    what: "Vectors are linearly independent if none can be written as a combination of the others. The only solution to c1 v1 + c2 v2 + ... = 0 is all c = 0.",
    visual: "Independent vectors point in genuinely different directions. Dependent vectors are redundant: one is a scaled or combined copy.",
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

/* -- Drawing Helpers -- */

function drawGrid(ctx, w, h) {
  var cx = w / 2;
  var cy = h / 2;
  var step = 34;
  ctx.strokeStyle = "rgba(255,255,255,0.06)";
  ctx.lineWidth = 0.5;
  var x;
  var y;
  for (x = cx % step; x < w; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (y = cy % step; y < h; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }
  ctx.strokeStyle = "rgba(255,255,255,0.13)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cx, 0);
  ctx.lineTo(cx, h);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, cy);
  ctx.lineTo(w, cy);
  ctx.stroke();
}

function drawArrow(ctx, x1, y1, x2, y2, color, lw) {
  var angle = Math.atan2(y2 - y1, x2 - x1);
  var hl = 10;
  ctx.strokeStyle = color;
  ctx.lineWidth = lw || 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - hl * Math.cos(angle - 0.4), y2 - hl * Math.sin(angle - 0.4));
  ctx.lineTo(x2 - hl * Math.cos(angle + 0.4), y2 - hl * Math.sin(angle + 0.4));
  ctx.fill();
}

function drawText(ctx, text, x, y, color, size) {
  ctx.font = "600 " + (size || 11) + "px monospace";
  ctx.fillStyle = color || "#fff";
  ctx.textAlign = "left";
  ctx.fillText(text, x, y);
}

function drawDot(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawRoundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/* -- Canvas Component -- */

function Canvas2D(props) {
  var drawFn = props.draw;
  var ref = useRef(null);
  var animRef = useRef(null);
  var tRef = useRef(0);
  var sizeState = useState(340);
  var size = sizeState[0];
  var setSize = sizeState[1];

  useEffect(function () {
    function updateSize() {
      var next = Math.max(260, Math.min(340, window.innerWidth - 32));
      setSize(next);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return function () {
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  useEffect(
    function () {
      var canvas = ref.current;
      if (!canvas) return;
      var ctx = canvas.getContext("2d");
      var dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      ctx.scale(dpr, dpr);
      var running = true;
      function animate() {
        if (!running) return;
        tRef.current += 0.015;
        ctx.clearRect(0, 0, size, size);
        drawFn(ctx, size, size, tRef.current);
        animRef.current = requestAnimationFrame(animate);
      }
      animate();
      return function () {
        running = false;
        cancelAnimationFrame(animRef.current);
      };
    },
    [drawFn, size]
  );

  return (
    <canvas
      ref={ref}
      style={{
        width: size,
        height: size,
        display: "block",
        borderRadius: 12,
        background: "rgba(255,255,255,0.025)",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    />
  );
}

/* -- Visualization Components -- */

function RankVis() {
  var st = useState(2);
  var rankCase = st[0];
  var setRankCase = st[1];
  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var s = 60;
      if (rankCase === 2) {
        var a = t * 0.5;
        var v1x = Math.cos(a) * s * 1.8;
        var v1y = Math.sin(a) * s * 1.8;
        var v2x = Math.cos(a + 1.3) * s * 1.5;
        var v2y = Math.sin(a + 1.3) * s * 1.5;
        ctx.fillStyle = "rgba(232,93,4,0.1)";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + v1x, cy - v1y);
        ctx.lineTo(cx + v1x + v2x, cy - v1y - v2y);
        ctx.lineTo(cx + v2x, cy - v2y);
        ctx.fill();
        drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#E85D04");
        drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#FAA307");
        drawText(ctx, "v1", cx + v1x + 6, cy - v1y, "#E85D04", 13);
        drawText(ctx, "v2", cx + v2x + 6, cy - v2y, "#FAA307", 13);
        drawText(ctx, "Rank 2: spans a plane", 10, h - 14, "rgba(255,255,255,0.5)", 12);
      } else if (rankCase === 1) {
        var a2 = t * 0.3;
        var dx = Math.cos(a2);
        var dy = Math.sin(a2);
        ctx.strokeStyle = "rgba(232,93,4,0.25)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - dx * 160, cy + dy * 160);
        ctx.lineTo(cx + dx * 160, cy - dy * 160);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(ctx, cx, cy, cx + dx * s * 2, cy - dy * s * 2, "#E85D04");
        drawArrow(ctx, cx, cy, cx + dx * s * 1.2, cy - dy * s * 1.2, "#FAA307");
        drawText(ctx, "Rank 1: only spans a line", 10, h - 14, "rgba(255,255,255,0.5)", 12);
      } else {
        drawDot(ctx, cx, cy, 5 + Math.sin(t * 3) * 2, "#E85D04");
        drawText(ctx, "Rank 0: collapses to origin", 10, h - 14, "rgba(255,255,255,0.5)", 12);
      }
    },
    [rankCase]
  );
  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setRankCase(2);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: rankCase === 2 ? "#E85D04" : "rgba(255,255,255,0.08)",
            color: rankCase === 2 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Rank 2
        </button>
        <button
          onClick={function () {
            setRankCase(1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: rankCase === 1 ? "#E85D04" : "rgba(255,255,255,0.08)",
            color: rankCase === 1 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Rank 1
        </button>
        <button
          onClick={function () {
            setRankCase(0);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: rankCase === 0 ? "#E85D04" : "rgba(255,255,255,0.08)",
            color: rankCase === 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Rank 0
        </button>
      </div>
    </div>
  );
}

function DetVis() {
  var st = useState(1);
  var scale = st[0];
  var setScale = st[1];
  var draw = useCallback(
    function (ctx, w, h) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var s = 50;
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(cx, cy - s, s, s);
      ctx.setLineDash([]);
      var v1x = scale * s;
      var v2x = 0.3 * scale * s;
      var v2y = -scale * s;
      ctx.fillStyle = "rgba(106,76,147,0.15)";
      ctx.strokeStyle = "#6A4C93";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + v1x, cy);
      ctx.lineTo(cx + v1x + v2x, cy + v2y);
      ctx.lineTo(cx + v2x, cy + v2y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      drawArrow(ctx, cx, cy, cx + v1x, cy, "#6A4C93");
      drawArrow(ctx, cx, cy, cx + v2x, cy + v2y, "#B8A9C9");
      var det = scale * scale;
      drawText(ctx, "det = " + det.toFixed(2), 10, 24, "#B8A9C9", 14);
      drawText(ctx, det > 1 ? "Space expanded" : det > 0 ? "Space shrunk" : "Space collapsed!", 10, h - 14, "rgba(255,255,255,0.5)", 12);
    },
    [scale]
  );
  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12 }}>Scale</span>
        <input
          type="range"
          min="-2"
          max="3"
          step="0.1"
          value={scale}
          onChange={function (e) {
            setScale(Number(e.target.value));
          }}
          style={{ flex: 1, accentColor: "#6A4C93" }}
        />
        <span style={{ color: "#B8A9C9", fontFamily: "monospace", fontSize: 13, minWidth: 40 }}>{scale.toFixed(1)}</span>
      </div>
    </div>
  );
}

function EigenVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var l1 = 1.8;
    var l2 = 0.7;
    var phase = (Math.sin(t * 0.7) + 1) / 2;
    var N = 16;
    for (var i = 0; i < N; i++) {
      var angle = (i / N) * Math.PI * 2;
      var r = 55;
      var ox = Math.cos(angle) * r;
      var oy = Math.sin(angle) * r;
      var tx = ox * (1 + (l1 - 1) * phase);
      var ty = oy * (1 + (l2 - 1) * phase);
      var isE1 = Math.abs(angle) < 0.25 || Math.abs(angle - Math.PI) < 0.25;
      var isE2 = Math.abs(angle - Math.PI / 2) < 0.25 || Math.abs(angle - Math.PI * 1.5) < 0.25;
      if (isE1 || isE2) {
        drawArrow(ctx, cx, cy, cx + tx, cy - ty, isE1 ? "#06D6A0" : "#1B9AAA", 3);
      } else {
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + tx, cy - ty);
        ctx.stroke();
        drawDot(ctx, cx + tx, cy - ty, 2.5, "rgba(255,255,255,0.25)");
      }
    }
    drawText(ctx, "lambda1 = 1.8", 10, 22, "#06D6A0", 14);
    drawText(ctx, "lambda2 = 0.7", 10, 40, "#1B9AAA", 14);
    drawText(ctx, "Eigenvectors stay on their line, only scale", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function NullVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = t * 0.2;
    var dx = Math.cos(a);
    var dy = Math.sin(a);
    var px = -dy;
    var py = dx;
    ctx.strokeStyle = "rgba(246,127,0,0.35)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - dx * 160, cy + dy * 160);
    ctx.lineTo(cx + dx * 160, cy - dy * 160);
    ctx.stroke();
    ctx.strokeStyle = "rgba(214,40,40,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - px * 160, cy + py * 160);
    ctx.lineTo(cx + px * 160, cy - py * 160);
    ctx.stroke();
    ctx.setLineDash([]);
    var pulse = (Math.sin(t * 2) + 1) / 2;
    for (var i = -2; i <= 2; i++) {
      if (i === 0) continue;
      drawArrow(
        ctx,
        cx,
        cy,
        cx + px * i * 40 * (1 - pulse * 0.8),
        cy - py * i * 40 * (1 - pulse * 0.8),
        "rgba(214,40,40," + (0.3 + pulse * 0.4) + ")",
        1.5
      );
    }
    drawDot(ctx, cx, cy, 4, "#fff");
    drawText(ctx, "Column space", cx + dx * 100 + 5, cy - dy * 100 - 5, "#F77F00", 11);
    drawText(ctx, "Null space", cx + px * 80 + 5, cy - py * 80 - 5, "#D62828", 11);
    drawText(ctx, "Null space vectors collapse to origin", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function TraceVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 50;
    var a11 = 1.5 + Math.sin(t * 0.5) * 0.5;
    var a22 = 0.8 + Math.cos(t * 0.7) * 0.3;
    drawArrow(ctx, cx, cy, cx + a11 * s, cy, "#52B788", 3);
    drawText(ctx, "a11=" + a11.toFixed(2), cx + a11 * s + 8, cy + 4, "#52B788", 12);
    drawArrow(ctx, cx, cy, cx, cy - a22 * s, "#2D6A4F", 3);
    drawText(ctx, "a22=" + a22.toFixed(2), cx + 8, cy - a22 * s - 6, "#2D6A4F", 12);
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(cx, cy - s, s, s);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(82,183,136,0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy - a22 * s, a11 * s, a22 * s);
    drawText(ctx, "trace = " + (a11 + a22).toFixed(2), 10, 22, "#52B788", 14);
    drawText(ctx, "Trace = sum of diagonal scaling factors", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function TransposeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var cs = 40;
    var gap = 4;
    var vals = [
      [2, 3, 1],
      [7, 4, 5],
    ];
    var colors = [
      ["#F72585", "#B5179E", "#7209B7"],
      ["#560BAD", "#480CA8", "#3A0CA3"],
    ];
    var phase = (Math.sin(t) + 1) / 2;
    var ox = cx - 120;
    var oy = cy - 50;
    drawText(ctx, "A", ox + 20, oy - 10, "rgba(255,255,255,0.6)", 14);
    ctx.textAlign = "center";
    var r;
    var c;
    var x;
    var y;
    for (r = 0; r < 2; r++) {
      for (c = 0; c < 3; c++) {
        x = ox + c * (cs + gap);
        y = oy + r * (cs + gap);
        ctx.fillStyle = colors[r][c];
        ctx.globalAlpha = 0.7;
        drawRoundRect(ctx, x, y, cs, cs, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px monospace";
        ctx.fillText(String(vals[r][c]), x + cs / 2, y + cs / 2 + 5);
      }
    }
    var ax = ox + 3 * (cs + gap) + 15;
    ctx.fillStyle = "rgba(255,255,255," + (0.3 + phase * 0.3) + ")";
    ctx.font = "24px monospace";
    ctx.fillText("->", ax, cy + 5);
    var tx = ax + 30;
    var ty = cy - 70;
    ctx.textAlign = "left";
    drawText(ctx, "A^T", tx + 15, ty - 10, "rgba(255,255,255,0.6)", 14);
    ctx.textAlign = "center";
    for (r = 0; r < 3; r++) {
      for (c = 0; c < 2; c++) {
        x = tx + c * (cs + gap);
        y = ty + r * (cs + gap);
        ctx.fillStyle = colors[c][r];
        ctx.globalAlpha = 0.7;
        drawRoundRect(ctx, x, y, cs, cs, 6);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 14px monospace";
        ctx.fillText(String(vals[c][r]), x + cs / 2, y + cs / 2 + 5);
      }
    }
    ctx.textAlign = "left";
    drawText(ctx, "Rows and Columns swap", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function InverseVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 50;
    var phase = (Math.sin(t * 0.8) + 1) / 2;
    var pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    function lerp(a, b, p) {
      return a + (b - a) * p;
    }
    function drawShape(transformFn, alpha, color) {
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var r = transformFn(pts[i][0], pts[i][1]);
        var sx = cx + r[0] * s;
        var sy = cy - r[1] * s;
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.globalAlpha = alpha + 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    drawShape(
      function (x, y) {
        return [x, y];
      },
      0.15,
      "rgba(255,255,255,0.5)"
    );
    drawShape(
      function (x, y) {
        var fx = 2 * x + 0.5 * y;
        var fy = 1.5 * y;
        return [lerp(x, fx, phase), lerp(y, fy, phase)];
      },
      0.2,
      "#0077B6"
    );
    drawText(ctx, phase < 0.5 ? "A * x transforming..." : "A^-1 * (Ax) undoing...", 10, 22, "#0077B6", 13);
    drawText(ctx, "A^-1 A = I : Inverse perfectly reverses A", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function SpanVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 50;
    var a = t * 0.3;
    var v1x = Math.cos(a) * s * 1.6;
    var v1y = Math.sin(a) * s * 1.6;
    var v2x = Math.cos(a + 1.2) * s * 1.3;
    var v2y = Math.sin(a + 1.2) * s * 1.3;
    var i;
    var j;
    var ppx;
    var ppy;
    var dist;
    for (i = -3; i <= 3; i += 0.5) {
      for (j = -3; j <= 3; j += 0.5) {
        ppx = cx + (i * v1x) / 2 + (j * v2x) / 2;
        ppy = cy - (i * v1y) / 2 - (j * v2y) / 2;
        if (ppx > 5 && ppx < w - 5 && ppy > 5 && ppy < h - 5) {
          dist = Math.sqrt(Math.pow(ppx - cx, 2) + Math.pow(ppy - cy, 2));
          drawDot(ctx, ppx, ppy, 2, "rgba(188,108,37," + Math.max(0, 0.2 - dist / 600) + ")");
        }
      }
    }
    drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#BC6C25", 2.5);
    drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#DDA15E", 2.5);
    drawText(ctx, "col1", cx + v1x + 6, cy - v1y, "#BC6C25", 12);
    drawText(ctx, "col2", cx + v2x + 6, cy - v2y, "#DDA15E", 12);
    drawText(ctx, "Every dot = c1*col1 + c2*col2", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function OrthogonalVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = t * 0.4;
    var v1x = Math.cos(a) * 90;
    var v1y = Math.sin(a) * 90;
    var v2x = Math.cos(a + Math.PI / 2) * 70;
    var v2y = Math.sin(a + Math.PI / 2) * 70;
    drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#06D6A0", 3);
    drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#34D399", 3);
    var sq = 12;
    var n1x = (v1x / 90) * sq;
    var n1y = (-v1y / 90) * sq;
    var n2x = (v2x / 70) * sq;
    var n2y = (-v2y / 70) * sq;
    ctx.strokeStyle = "rgba(6,214,160,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + n1x, cy + n1y);
    ctx.lineTo(cx + n1x + n2x, cy + n1y + n2y);
    ctx.lineTo(cx + n2x, cy + n2y);
    ctx.stroke();
    drawText(ctx, "u", cx + v1x + 8, cy - v1y, "#06D6A0", 14);
    drawText(ctx, "v", cx + v2x + 8, cy - v2y, "#34D399", 14);
    var dot = v1x * v2x + v1y * v2y;
    drawText(ctx, "u.v = " + dot.toFixed(1) + " = 0", 10, 22, "#06D6A0", 14);
    drawText(ctx, "90 degrees: dot product = 0", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function ProjectionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var la = 0.3;
    var dx = Math.cos(la);
    var dy = Math.sin(la);
    ctx.strokeStyle = "rgba(245,158,11,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - dx * 160, cy + dy * 160);
    ctx.lineTo(cx + dx * 160, cy - dy * 160);
    ctx.stroke();
    ctx.setLineDash([]);
    var vLen = 100;
    var vx = Math.cos(0.8 + t * 0.3) * vLen;
    var vy = Math.sin(0.8 + t * 0.3) * vLen;
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#FCD34D", 2.5);
    var projS = vx * dx + vy * dy;
    var ppx = dx * projS;
    var ppy = dy * projS;
    drawArrow(ctx, cx, cy, cx + ppx, cy - ppy, "#F59E0B", 3.5);
    ctx.strokeStyle = "rgba(252,211,77,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + vx, cy - vy);
    ctx.lineTo(cx + ppx, cy - ppy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDot(ctx, cx + ppx, cy - ppy, 4, "#F59E0B");
    drawText(ctx, "v", cx + vx + 8, cy - vy, "#FCD34D", 13);
    drawText(ctx, "proj", cx + ppx + 8, cy - ppy + 14, "#F59E0B", 13);
    drawText(ctx, "Shadow of v onto the line", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function NormVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var vx = Math.cos(t * 0.5) * 100;
    var vy = Math.sin(t * 0.7) * 80;
    var l2 = Math.sqrt(vx * vx + vy * vy);
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, l2, 0, Math.PI * 2);
    ctx.stroke();
    var l1 = Math.abs(vx) + Math.abs(vy);
    ctx.strokeStyle = "rgba(252,165,165,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - l1);
    ctx.lineTo(cx + l1, cy);
    ctx.lineTo(cx, cy + l1);
    ctx.lineTo(cx - l1, cy);
    ctx.closePath();
    ctx.stroke();
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#EF4444", 3);
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + vx, cy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - vy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawText(ctx, "||v||2 = " + l2.toFixed(1), 10, 22, "#EF4444", 14);
    drawText(ctx, "||v||1 = " + l1.toFixed(1), 10, 40, "#FCA5A5", 12);
    drawText(ctx, "Circle = L2 ball, Diamond = L1 ball", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function SVDVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var step = ((t * 0.3) % (Math.PI * 2)) / (Math.PI * 2);
    var N = 40;
    var s = 55;
    var vAngle = 0.5;
    var sigma1 = 2.0;
    var sigma2 = 0.6;
    var uAngle = 0.8;
    ctx.strokeStyle = "#8B5CF6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= N; i++) {
      var angle = (i / N) * Math.PI * 2;
      var rx = Math.cos(angle);
      var ry = Math.sin(angle);
      var vt = Math.min(step / 0.33, 1);
      var va = vAngle * vt;
      var nx = rx * Math.cos(va) - ry * Math.sin(va);
      var ny = rx * Math.sin(va) + ry * Math.cos(va);
      rx = nx;
      ry = ny;
      if (step > 0.33) {
        var st2 = Math.min((step - 0.33) / 0.33, 1);
        rx *= 1 + (sigma1 - 1) * st2;
        ry *= 1 + (sigma2 - 1) * st2;
      }
      if (step > 0.66) {
        var ut = Math.min((step - 0.66) / 0.34, 1);
        var ua = uAngle * ut;
        nx = rx * Math.cos(ua) - ry * Math.sin(ua);
        ny = rx * Math.sin(ua) + ry * Math.cos(ua);
        rx = nx;
        ry = ny;
      }
      if (i === 0) ctx.moveTo(cx + rx * s, cy - ry * s);
      else ctx.lineTo(cx + rx * s, cy - ry * s);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = "rgba(139,92,246,0.08)";
    ctx.fill();
    var labels = ["1. Rotate (V^T)", "2. Stretch (Sigma)", "3. Rotate (U)"];
    var idx = step < 0.33 ? 0 : step < 0.66 ? 1 : 2;
    drawText(ctx, "A = U Sigma V^T", 10, 22, "#C4B5FD", 14);
    drawText(ctx, labels[idx], 10, 42, "#A78BFA", 13);
    drawText(ctx, "Every matrix = rotate, stretch, rotate", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function PosDefVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var l1 = 2;
    var l2 = 0.8;
    var angle = 0.4;
    var r2;
    var sc;
    var i2;
    var a2;
    var ex;
    var ey;
    var rx;
    var ry;
    for (r2 = 1; r2 <= 5; r2++) {
      sc = r2 * 25;
      ctx.strokeStyle = "rgba(16,185,129," + (0.35 - r2 * 0.05) + ")";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (i2 = 0; i2 <= 64; i2++) {
        a2 = (i2 / 64) * Math.PI * 2;
        ex = Math.cos(a2) * sc / Math.sqrt(l1);
        ey = Math.sin(a2) * sc / Math.sqrt(l2);
        rx = ex * Math.cos(angle) - ey * Math.sin(angle);
        ry = ex * Math.sin(angle) + ey * Math.cos(angle);
        if (i2 === 0) ctx.moveTo(cx + rx, cy - ry);
        else ctx.lineTo(cx + rx, cy - ry);
      }
      ctx.closePath();
      ctx.stroke();
    }
    var e1x = Math.cos(angle) * 130;
    var e1y = Math.sin(angle) * 130;
    var e2x = Math.cos(angle + Math.PI / 2) * 130;
    var e2y = Math.sin(angle + Math.PI / 2) * 130;
    ctx.strokeStyle = "rgba(110,231,183,0.25)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - e1x, cy + e1y);
    ctx.lineTo(cx + e1x, cy - e1y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - e2x, cy + e2y);
    ctx.lineTo(cx + e2x, cy - e2y);
    ctx.stroke();
    ctx.setLineDash([]);
    var pa = t * 0.8;
    var pr = 60;
    var ppx = Math.cos(pa) * pr / Math.sqrt(l1);
    var ppy = Math.sin(pa) * pr / Math.sqrt(l2);
    var rpx = ppx * Math.cos(angle) - ppy * Math.sin(angle);
    var rpy = ppx * Math.sin(angle) + ppy * Math.cos(angle);
    drawDot(ctx, cx + rpx, cy - rpy, 5, "#10B981");
    drawDot(ctx, cx, cy, 4, "#6EE7B7");
    drawText(ctx, "lambda1 = 2 > 0", 10, 22, "#10B981", 13);
    drawText(ctx, "lambda2 = 0.8 > 0", 10, 40, "#6EE7B7", 13);
    drawText(ctx, "All lambda > 0: bowl shape, always positive", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

function SymmetricVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var cs = 52;
    var gap = 6;
    var vals = [
      [3, 2, 7],
      [2, 5, 1],
      [7, 1, 4],
    ];
    var pairIdx = Math.floor((t * 0.6) % 3);
    var pairs = [
      [
        [0, 1],
        [1, 0],
      ],
      [
        [0, 2],
        [2, 0],
      ],
      [
        [1, 2],
        [2, 1],
      ],
    ];
    var currentPair = pairs[pairIdx];
    var pulse = (Math.sin(t * 3) + 1) / 2;
    var ox = cx - (3 * (cs + gap)) / 2;
    var oy = cy - (3 * (cs + gap)) / 2;
    ctx.textAlign = "center";
    var r;
    var c;
    var x;
    var y;
    var isDiag;
    var isHighA;
    var isHighB;
    var isHigh;
    for (r = 0; r < 3; r++) {
      for (c = 0; c < 3; c++) {
        x = ox + c * (cs + gap);
        y = oy + r * (cs + gap);
        isDiag = r === c;
        isHighA = currentPair[0][0] === r && currentPair[0][1] === c;
        isHighB = currentPair[1][0] === r && currentPair[1][1] === c;
        isHigh = isHighA || isHighB;
        ctx.fillStyle = isDiag ? "rgba(236,72,153,0.35)" : isHigh ? "rgba(249,168,212," + (0.3 + pulse * 0.3) + ")" : "rgba(255,255,255,0.06)";
        drawRoundRect(ctx, x, y, cs, cs, 8);
        ctx.fill();
        if (isHigh) {
          ctx.strokeStyle = "rgba(249,168,212," + (0.5 + pulse * 0.5) + ")";
          ctx.lineWidth = 2;
          drawRoundRect(ctx, x, y, cs, cs, 8);
          ctx.stroke();
        }
        ctx.fillStyle = isDiag ? "#EC4899" : isHigh ? "#F9A8D4" : "rgba(255,255,255,0.5)";
        ctx.font = "bold 16px monospace";
        ctx.fillText(String(vals[r][c]), x + cs / 2, y + cs / 2 + 6);
      }
    }
    ctx.textAlign = "left";
    ctx.strokeStyle = "rgba(236,72,153,0.3)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + 3 * (cs + gap), oy + 3 * (cs + gap));
    ctx.stroke();
    drawText(ctx, "A = A^T: mirror across diagonal", 10, h - 30, "rgba(255,255,255,0.5)", 11);
    drawText(
      ctx,
      "a[" + currentPair[0] + "] = a[" + currentPair[1] + "] = " + vals[currentPair[0][0]][currentPair[0][1]],
      10,
      h - 14,
      "#F9A8D4",
      12
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

function LinIndepVis() {
  var st = useState(false);
  var dep = st[0];
  var setDep = st[1];
  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      if (!dep) {
        var a = t * 0.3;
        var v1x = Math.cos(a) * 80;
        var v1y = Math.sin(a) * 80;
        var v2x = Math.cos(a + 2.1) * 65;
        var v2y = Math.sin(a + 2.1) * 65;
        drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#F97316", 3);
        drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#FDBA74", 3);
        drawText(ctx, "v1", cx + v1x + 8, cy - v1y, "#F97316", 14);
        drawText(ctx, "v2", cx + v2x + 8, cy - v2y, "#FDBA74", 14);
        drawText(ctx, "Independent: no scalar c makes v2 = c*v1", 10, h - 14, "rgba(255,255,255,0.5)", 11);
      } else {
        var a2 = t * 0.3;
        var dx = Math.cos(a2);
        var dy = Math.sin(a2);
        ctx.strokeStyle = "rgba(249,115,22,0.2)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - dx * 160, cy + dy * 160);
        ctx.lineTo(cx + dx * 160, cy - dy * 160);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(ctx, cx, cy, cx + dx * 90, cy - dy * 90, "#F97316", 3);
        drawArrow(ctx, cx, cy, cx + dx * 55, cy - dy * 55, "#FDBA74", 3);
        drawText(ctx, "v1", cx + dx * 90 + 8, cy - dy * 90, "#F97316", 14);
        drawText(ctx, "v2=0.6*v1", cx + dx * 55 + 8, cy - dy * 55 - 14, "#FDBA74", 12);
        drawText(ctx, "Dependent: v2 is a scaled copy of v1", 10, h - 14, "rgba(255,255,255,0.5)", 11);
      }
    },
    [dep]
  );
  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setDep(false);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: !dep ? "#F97316" : "rgba(255,255,255,0.08)",
            color: !dep ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Independent
        </button>
        <button
          onClick={function () {
            setDep(true);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: dep ? "#F97316" : "rgba(255,255,255,0.08)",
            color: dep ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Dependent
        </button>
      </div>
    </div>
  );
}

function BasisVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 60;
    drawArrow(ctx, cx, cy, cx + s, cy, "rgba(255,255,255,0.2)", 1.5);
    drawArrow(ctx, cx, cy, cx, cy - s, "rgba(255,255,255,0.2)", 1.5);
    drawText(ctx, "e1", cx + s + 5, cy + 15, "rgba(255,255,255,0.25)", 11);
    drawText(ctx, "e2", cx + 8, cy - s - 5, "rgba(255,255,255,0.25)", 11);
    var a = 0.4 + Math.sin(t * 0.3) * 0.15;
    var b1x = Math.cos(a) * s;
    var b1y = Math.sin(a) * s;
    var b2x = Math.cos(a + Math.PI / 2 + 0.3) * s * 0.8;
    var b2y = Math.sin(a + Math.PI / 2 + 0.3) * s * 0.8;
    drawArrow(ctx, cx, cy, cx + b1x, cy - b1y, "#14B8A6", 3);
    drawArrow(ctx, cx, cy, cx + b2x, cy - b2y, "#5EEAD4", 3);
    drawText(ctx, "b1", cx + b1x + 8, cy - b1y, "#14B8A6", 14);
    drawText(ctx, "b2", cx + b2x + 8, cy - b2y, "#5EEAD4", 14);
    var c1 = 1.5;
    var c2 = 0.8;
    var vx = c1 * b1x + c2 * b2x;
    var vy = c1 * b1y + c2 * b2y;
    ctx.strokeStyle = "rgba(20,184,166,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * b1x, cy - c1 * b1y);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + c2 * b2x, cy - c2 * b2y);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDot(ctx, cx + vx, cy - vy, 5, "#fff");
    drawText(ctx, "v = 1.5b1 + 0.8b2", cx + vx + 8, cy - vy, "rgba(255,255,255,0.7)", 11);
    drawText(ctx, "dim = 2 (need 2 basis vectors)", 10, 22, "#5EEAD4", 12);
    drawText(ctx, "Any basis spans the whole space minimally", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

/* -- Visualization Map -- */
var VIS_MAP = {
  rank: RankVis,
  determinant: DetVis,
  eigenvalues: EigenVis,
  nullspace: NullVis,
  trace: TraceVis,
  transpose: TransposeVis,
  inverse: InverseVis,
  span: SpanVis,
  orthogonal: OrthogonalVis,
  projection: ProjectionVis,
  norm: NormVis,
  svd: SVDVis,
  posdef: PosDefVis,
  symmetric: SymmetricVis,
  linindep: LinIndepVis,
  basis: BasisVis,
};

/* -- Main App -- */
export default function MatrixIntuition() {
  var st = useState("rank");
  var active = st[0];
  var setActive = st[1];
  var concept = CONCEPTS.find(function (c) {
    return c.id === active;
  });
  var explanation = EXPLANATIONS[active];
  var VisComponent = VIS_MAP[active];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#e8e8e8",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontFamily: "Georgia, serif",
              fontSize: 34,
              fontWeight: 400,
              letterSpacing: "-0.02em",
              color: "#fff",
              lineHeight: 1.1,
            }}
          >
            Visual Intuition for Matrices
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 6 }}>
            16 interactive geometric interpretations
          </p>
        </div>

        <div style={{ marginBottom: 28 }}>
          {GROUPS.map(function (g) {
            return (
              <div key={g.id} style={{ marginBottom: 10 }}>
                <div
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.22)",
                    textTransform: "uppercase",
                    letterSpacing: "0.12em",
                    marginBottom: 5,
                  }}
                >
                  {g.label}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {CONCEPTS.filter(function (c) {
                    return c.group === g.id;
                  }).map(function (c) {
                    return (
                      <button
                        key={c.id}
                        onClick={function () {
                          setActive(c.id);
                        }}
                        style={{
                          padding: "5px 12px",
                          borderRadius: 16,
                          border: active === c.id ? "1.5px solid " + c.color : "1.5px solid rgba(255,255,255,0.06)",
                          background: active === c.id ? c.color + "15" : "transparent",
                          color: active === c.id ? c.color : "rgba(255,255,255,0.4)",
                          fontFamily: "monospace",
                          fontSize: 11,
                          fontWeight: 500,
                          cursor: "pointer",
                          transition: "all 0.2s",
                        }}
                      >
                        {c.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 28,
            alignItems: "start",
          }}
        >
          <div>
            <VisComponent key={active} />
          </div>
          <div>
            <h2
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 26,
                fontWeight: 400,
                color: concept.color,
                marginBottom: 3,
              }}
            >
              {concept.title}
            </h2>
            <p style={{ fontFamily: "monospace", fontSize: 11, color: concept.accent, marginBottom: 18, opacity: 0.6 }}>{concept.subtitle}</p>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Definition
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.68)" }}>{explanation.what}</p>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Visual Intuition
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.68)" }}>{explanation.visual}</p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 8,
                }}
              >
                Key Insights
              </div>
              {explanation.intuition.map(function (item, i) {
                return (
                  <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6, alignItems: "baseline" }}>
                    <span style={{ color: concept.color, fontFamily: "monospace", fontSize: 10, opacity: 0.5, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.55, color: "rgba(255,255,255,0.6)" }}>{item}</span>
                  </div>
                );
              })}
            </div>

            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 10,
                padding: "10px 14px",
              }}
            >
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 9,
                  color: "rgba(255,255,255,0.25)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 5,
                }}
              >
                Formula
              </div>
              <code style={{ fontFamily: "monospace", fontSize: 12, color: concept.accent }}>{explanation.formula}</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
