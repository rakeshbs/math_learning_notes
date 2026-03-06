import { useCallback } from "react";
import { Canvas2D } from "../../matrix-intuition/components";
import {
  drawGrid,
  drawArrow,
  drawDot,
  drawText,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

function mapX(w, x) {
  return 30 + ((x + 1) / 2) * (w - 60);
}

function mapY(h, y) {
  return h - 30 - ((y + 1) / 2) * (h - 60);
}

export function VectorNormProjectionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var vx = Math.cos(t * 0.4) * 95;
    var vy = Math.sin(t * 0.7) * 70;
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#F97316", 3);
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, Math.sqrt(vx * vx + vy * vy), 0, Math.PI * 2);
    ctx.stroke();
    drawText(
      ctx,
      "||x|| = " + Math.sqrt(vx * vx + vy * vy).toFixed(1),
      10,
      22,
      "#FDBA74",
      13,
    );
    drawText(ctx, "Vector geometry in feature space", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DotProductAngleVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var ax = Math.cos(t * 0.4) * 100;
    var ay = Math.sin(t * 0.4) * 100;
    var bx = Math.cos(1.1 + Math.sin(t * 0.25) * 0.8) * 80;
    var by = Math.sin(1.1 + Math.sin(t * 0.25) * 0.8) * 80;
    drawArrow(ctx, cx, cy, cx + ax, cy - ay, "#EA580C", 3);
    drawArrow(ctx, cx, cy, cx + bx, cy - by, "#F59E0B", 3);

    var bl = Math.max(1e-6, Math.sqrt(bx * bx + by * by));
    var projS = (ax * bx + ay * by) / (bl * bl);
    var px = projS * bx;
    var py = projS * by;
    ctx.strokeStyle = "rgba(245,158,11,0.45)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + ax, cy - ay);
    ctx.lineTo(cx + px, cy - py);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDot(ctx, cx + px, cy - py, 4, "#FCD34D");

    var dot = ax * bx + ay * by;
    drawText(ctx, "x.y = " + dot.toFixed(0), 10, 22, "#FDBA74", 13);
    drawText(ctx, "Projection gives alignment strength", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function MatrixTransformVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 52;
    var phase = (Math.sin(t * 0.7) + 1) / 2;

    var pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    function transform(x, y) {
      var x1 = x + 0.5 * y;
      var y1 = 0.2 * x + 1.1 * y;
      var x2 = 1.2 * x1 - 0.35 * y1;
      var y2 = 0.45 * x1 + 1.25 * y1;
      return [x + (x2 - x) * phase, y + (y2 - y) * phase];
    }

    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var p = transform(pts[i][0], pts[i][1]);
      var sx = cx + p[0] * s;
      var sy = cy - p[1] * s;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(37,99,235,0.18)";
    ctx.fill();
    ctx.strokeStyle = "#93C5FD";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawText(ctx, "B then A = AB", 10, 22, "#93C5FD", 13);
    drawText(ctx, "Composition of linear maps", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function RankCompressionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var phase = (Math.sin(t * 0.55) + 1) / 2;
    var i;
    var j;

    for (i = -4; i <= 4; i += 0.5) {
      for (j = -4; j <= 4; j += 0.5) {
        var x = i * 18;
        var y = j * 18;
        var tx = x;
        var ty = y * (1 - 0.85 * phase);
        drawDot(ctx, cx + tx, cy - ty, 1.6, "rgba(59,130,246,0.35)");
      }
    }

    ctx.strokeStyle = "rgba(147,197,253,0.65)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - 120, cy);
    ctx.lineTo(cx + 120, cy);
    ctx.stroke();

    drawText(ctx, phase < 0.45 ? "Higher rank" : "Collapsing toward rank 1", 10, 22, "#93C5FD", 13);
    drawText(ctx, "Rank controls dimensional survival", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function EigenSVDPCAVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = 95;
    var b = 42;
    var rot = 0.5 + 0.35 * Math.sin(t * 0.35);

    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= 80; i++) {
      var theta = (i / 80) * Math.PI * 2;
      var ex = a * Math.cos(theta);
      var ey = b * Math.sin(theta);
      var rx = ex * Math.cos(rot) - ey * Math.sin(rot);
      var ry = ex * Math.sin(rot) + ey * Math.cos(rot);
      if (i === 0) ctx.moveTo(cx + rx, cy - ry);
      else ctx.lineTo(cx + rx, cy - ry);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(124,58,237,0.14)";
    ctx.fill();
    ctx.stroke();

    var ux = a * Math.cos(rot);
    var uy = a * Math.sin(rot);
    var vx = -b * Math.sin(rot);
    var vy = b * Math.cos(rot);
    drawArrow(ctx, cx, cy, cx + ux, cy - uy, "#A78BFA", 3);
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#8B5CF6", 3);

    drawText(ctx, "Principal axes = dominant modes", 10, 22, "#C4B5FD", 13);
    drawText(ctx, "Eigen/SVD/PCA share axis-stretch intuition", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DerivativeGradientVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(0, 0, w, h);
    var n = 140;
    var x0 = -0.15 + 0.5 * Math.sin(t * 0.35);

    ctx.strokeStyle = "rgba(20,184,166,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= n; i++) {
      var x = -1 + (2 * i) / n;
      var y = 0.55 * x * x * x - 0.25 * x;
      var sx = mapX(w, x);
      var sy = mapY(h, y);
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    var y0 = 0.55 * x0 * x0 * x0 - 0.25 * x0;
    var slope = 1.65 * x0 * x0 - 0.25;
    var dx = 0.35;
    var p1x = x0 - dx;
    var p1y = y0 - slope * dx;
    var p2x = x0 + dx;
    var p2y = y0 + slope * dx;

    ctx.strokeStyle = "#5EEAD4";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(mapX(w, p1x), mapY(h, p1y));
    ctx.lineTo(mapX(w, p2x), mapY(h, p2y));
    ctx.stroke();

    drawDot(ctx, mapX(w, x0), mapY(h, y0), 4, "#5EEAD4");
    drawText(ctx, "local slope = " + slope.toFixed(2), 10, 22, "#5EEAD4", 13);
    drawText(ctx, "Derivative is local linear behavior", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function JacobianFieldVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    function transform(x, y) {
      return [1.1 * x + 0.45 * y, 0.25 * x + 0.8 * y + 0.2 * Math.sin(t * 0.7 + x * 0.02)];
    }

    for (var gx = -100; gx <= 100; gx += 40) {
      for (var gy = -100; gy <= 100; gy += 40) {
        var p = transform(gx, gy);
        drawDot(ctx, cx + p[0], cy - p[1], 2, "rgba(6,182,212,0.6)");
      }
    }

    var x0 = 40;
    var y0 = 30;
    var eps = 20;
    var p0 = transform(x0, y0);
    var px = transform(x0 + eps, y0);
    var py = transform(x0, y0 + eps);
    drawArrow(ctx, cx + p0[0], cy - p0[1], cx + px[0], cy - px[1], "#67E8F9", 2.5);
    drawArrow(ctx, cx + p0[0], cy - p0[1], cx + py[0], cy - py[1], "#06B6D4", 2.5);

    drawText(ctx, "Jacobian maps tiny basis moves", 10, 22, "#67E8F9", 13);
    drawText(ctx, "Local linear map of nonlinear transform", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function HessianConvexityVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var mode = Math.sin(t * 0.3);

    for (var r = 1; r <= 6; r++) {
      var a = r * 22;
      var b = r * 22 * (mode > 0 ? 0.7 : 1.2);
      ctx.strokeStyle =
        mode > 0
          ? "rgba(14,165,233," + (0.38 - r * 0.045) + ")"
          : "rgba(239,68,68," + (0.38 - r * 0.045) + ")";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      for (var i = 0; i <= 80; i++) {
        var th = (i / 80) * Math.PI * 2;
        var x = a * Math.cos(th);
        var y = b * Math.sin(th);
        if (mode <= 0 && Math.sin(th) < 0) y *= -1;
        if (i === 0) ctx.moveTo(cx + x, cy - y);
        else ctx.lineTo(cx + x, cy - y);
      }
      ctx.stroke();
    }

    drawText(ctx, mode > 0 ? "Convex bowl (Hessian PSD)" : "Saddle (mixed curvature)", 10, 22, mode > 0 ? "#7DD3FC" : "#FCA5A5", 13);
    drawText(ctx, "Hessian eigen-signs classify local geometry", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function GradientDescentPathVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;

    ctx.strokeStyle = "rgba(134,239,172,0.24)";
    for (var r = 1; r <= 6; r++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 24, r * 16, 0.25, 0, Math.PI * 2);
      ctx.stroke();
    }

    var pts = [
      [120, -95],
      [70, -60],
      [35, -38],
      [15, -20],
      [6, -10],
      [0, -3],
    ];
    var k = Math.min(pts.length - 1, Math.floor(((Math.sin(t * 0.6) + 1) / 2) * (pts.length - 1)) + 1);

    ctx.strokeStyle = "#22C55E";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (var i = 0; i < k; i++) {
      var x = cx + pts[i][0] * 0.8;
      var y = cy + pts[i][1] * 0.8;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      drawDot(ctx, x, y, 3, "#86EFAC");
    }
    ctx.stroke();

    drawText(ctx, "w <- w - eta * grad L", 10, 22, "#86EFAC", 13);
    drawText(ctx, "Iterative descent toward minimum", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ProbabilityExpectationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var baseY = h - 42;
    var startX = 40;
    var bw = 34;
    var gap = 16;
    var probs = [0.12, 0.2, 0.28, 0.24, 0.16];

    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.beginPath();
    ctx.moveTo(26, baseY);
    ctx.lineTo(w - 24, baseY);
    ctx.stroke();

    var mean = 0;
    for (var i = 0; i < probs.length; i++) {
      mean += i * probs[i];
      var hBar = probs[i] * 210;
      var x = startX + i * (bw + gap);
      var y = baseY - hBar;
      ctx.fillStyle = "rgba(101,163,13,0.6)";
      drawRoundRect(ctx, x, y, bw, hBar, 6);
      ctx.fill();
      drawText(ctx, String(i), x + 12, baseY + 14, "rgba(255,255,255,0.55)", 11);
    }

    var mx = startX + mean * (bw + gap) + bw / 2;
    ctx.strokeStyle = "#BEF264";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(mx, baseY - 220);
    ctx.lineTo(mx, baseY + 6);
    ctx.stroke();
    ctx.setLineDash([]);

    drawText(ctx, "E[X] = " + mean.toFixed(2), 10, 22, "#BEF264", 13);
    drawText(ctx, "Expectation is weighted center", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function VarianceCovarianceVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var rot = 0.6 + 0.3 * Math.sin(t * 0.45);

    for (var i = 0; i < 120; i++) {
      var u = (i % 15) - 7;
      var v = Math.floor(i / 15) - 3.5;
      var x = u * 10;
      var y = v * 9;
      var rx = x * Math.cos(rot) - y * Math.sin(rot);
      var ry = x * Math.sin(rot) + y * Math.cos(rot);
      drawDot(ctx, cx + rx, cy - ry, 2.2, "rgba(16,185,129,0.42)");
    }

    ctx.strokeStyle = "rgba(110,231,183,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 90, 45, rot, 0, Math.PI * 2);
    ctx.stroke();

    drawText(ctx, "Covariance sets ellipse tilt", 10, 22, "#6EE7B7", 13);
    drawText(ctx, "Variance controls spread along axes", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function InformationTheoryVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var p = [0.7, 0.2, 0.1];
    var qShift = 0.15 * (Math.sin(t * 0.5) + 1) / 2;
    var q = [0.55 - qShift, 0.3 + qShift * 0.6, 0.15 + qShift * 0.4];
    var baseY = h - 36;
    var left = 44;
    var barW = 30;

    for (var i = 0; i < 3; i++) {
      var px = left + i * 72;
      var qx = px + 34;

      ctx.fillStyle = "rgba(236,72,153,0.55)";
      drawRoundRect(ctx, px, baseY - p[i] * 180, barW, p[i] * 180, 5);
      ctx.fill();

      ctx.fillStyle = "rgba(249,168,212,0.55)";
      drawRoundRect(ctx, qx, baseY - q[i] * 180, barW, q[i] * 180, 5);
      ctx.fill();
    }

    function hDist(a) {
      var s = 0;
      for (var j = 0; j < a.length; j++) s += -a[j] * Math.log(Math.max(a[j], 1e-9));
      return s;
    }
    function ce(a, b) {
      var s = 0;
      for (var j = 0; j < a.length; j++) s += -a[j] * Math.log(Math.max(b[j], 1e-9));
      return s;
    }

    var hp = hDist(p);
    var ceVal = ce(p, q);
    var kl = ceVal - hp;
    drawText(ctx, "H(p): " + hp.toFixed(2), 10, 22, "#F9A8D4", 12);
    drawText(ctx, "H(p,q): " + ceVal.toFixed(2), 10, 40, "#F9A8D4", 12);
    drawText(ctx, "KL(p||q): " + kl.toFixed(2), 10, 58, "#F9A8D4", 12);
    drawText(ctx, "Mismatch raises cross-entropy and KL", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function RegularizationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    drawGrid(ctx, w, h);

    var lambda = (Math.sin(t * 0.5) + 1) / 2;
    var coeffs = [1.2, -0.8, 0.55, -0.35, 0.22, -0.1];

    for (var i = 0; i < coeffs.length; i++) {
      var x = 36 + i * 48;
      var raw = coeffs[i] * 85;
      var shrunk = raw * (1 - 0.65 * lambda);

      ctx.strokeStyle = "rgba(248,113,113,0.3)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, cy - raw);
      ctx.stroke();

      ctx.strokeStyle = "#FCA5A5";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x + 10, cy);
      ctx.lineTo(x + 10, cy - shrunk);
      ctx.stroke();
    }

    drawText(ctx, "lambda = " + lambda.toFixed(2), 10, 22, "#FCA5A5", 13);
    drawText(ctx, "Penalty shrinks coefficients toward zero", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BiasVarianceVis() {
  var draw = useCallback(function (ctx, w, h) {
    ctx.fillStyle = "rgba(255,255,255,0.02)";
    ctx.fillRect(0, 0, w, h);

    var left = 35;
    var right = w - 24;
    var baseY = h - 36;
    ctx.strokeStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.moveTo(left, baseY);
    ctx.lineTo(right, baseY);
    ctx.stroke();

    ctx.strokeStyle = "#FCA5A5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= 80; i++) {
      var x = i / 80;
      var y = 0.25 + 1.4 * (x - 0.55) * (x - 0.55);
      var sx = left + x * (right - left);
      var sy = baseY - y * 140;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    drawText(ctx, "Test error U-curve", 10, 22, "#FCA5A5", 13);
    drawText(ctx, "Left: high bias  |  Right: high variance", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function MLEVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var left = 35;
    var right = w - 24;
    var baseY = h - 34;
    var muHat = 0.2 + 0.35 * Math.sin(t * 0.25);

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(left, baseY);
    ctx.lineTo(right, baseY);
    ctx.stroke();

    ctx.strokeStyle = "#FCA5A5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i <= 120; i++) {
      var x = -1 + (2 * i) / 120;
      var y = Math.exp(-7 * (x - muHat) * (x - muHat));
      var sx = left + ((x + 1) / 2) * (right - left);
      var sy = baseY - y * 170;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    var mx = left + ((muHat + 1) / 2) * (right - left);
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "#F87171";
    ctx.beginPath();
    ctx.moveTo(mx, baseY - 180);
    ctx.lineTo(mx, baseY + 6);
    ctx.stroke();
    ctx.setLineDash([]);

    drawText(ctx, "argmax_theta p(D|theta)", 10, 22, "#FCA5A5", 13);
    drawText(ctx, "Peak of likelihood gives estimate", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}
