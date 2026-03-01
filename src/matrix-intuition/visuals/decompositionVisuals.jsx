import { useCallback, useState } from "react";
import { Canvas2D } from "../components/Canvas2D";
import { drawGrid, drawArrow, drawText, drawDot, drawRoundRect } from "../drawing/helpers";
export function SVDVis() {
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
    drawText(
      ctx,
      "Every matrix = rotate, stretch, rotate",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DiagonalizationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var theta = 0.75;
    var e1x = Math.cos(theta);
    var e1y = Math.sin(theta);
    var e2x = -Math.sin(theta);
    var e2y = Math.cos(theta);
    var l1 = 1.8;
    var l2 = 0.45;

    ctx.strokeStyle = "rgba(76,201,240,0.28)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - e1x * 160, cy + e1y * 160);
    ctx.lineTo(cx + e1x * 160, cy - e1y * 160);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - e2x * 160, cy + e2y * 160);
    ctx.lineTo(cx + e2x * 160, cy - e2y * 160);
    ctx.stroke();
    ctx.setLineDash([]);

    var vx = Math.cos(t * 0.5) * 85;
    var vy = Math.sin(t * 0.65) * 70;
    var c1 = vx * e1x + vy * e1y;
    var c2 = vx * e2x + vy * e2y;
    var avx = l1 * c1 * e1x + l2 * c2 * e2x;
    var avy = l1 * c1 * e1y + l2 * c2 * e2y;

    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#93C5FD", 2.4);
    drawArrow(ctx, cx, cy, cx + avx, cy - avy, "#4361EE", 3.2);
    drawDot(ctx, cx + avx, cy - avy, 3.5, "#4CC9F0");

    drawText(ctx, "v", cx + vx + 8, cy - vy, "#93C5FD", 13);
    drawText(ctx, "Av", cx + avx + 8, cy - avy, "#4361EE", 13);
    drawText(ctx, "A = P D P^-1", 10, 22, "#4CC9F0", 14);
    drawText(
      ctx,
      "Eigenbasis turns coupling into pure scaling",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LUVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 52;
    var phase = (Math.sin(t * 0.8) + 1) / 2;
    var pL = Math.min(phase * 2, 1);
    var pU = Math.max((phase - 0.5) * 2, 0);
    var shear = 0.85;
    var u11 = 1.5;
    var u12 = 0.6;
    var u22 = 0.9;
    var pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    function applyL(x, y, p) {
      return [x, y + shear * x * p];
    }
    function applyU(x, y, p) {
      var nx = x * (1 + (u11 - 1) * p) + y * u12 * p;
      var ny = y * (1 + (u22 - 1) * p);
      return [nx, ny];
    }
    function drawShape(transformFn, color, alpha) {
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
      ctx.globalAlpha = Math.min(alpha + 0.2, 1);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    drawShape(
      function (x, y) {
        return [x, y];
      },
      "rgba(255,255,255,0.45)",
      0.12,
    );
    drawShape(
      function (x, y) {
        var l = applyL(x, y, pL);
        return l;
      },
      "#7DD3FC",
      0.18,
    );
    drawShape(
      function (x, y) {
        var l = applyL(x, y, pL);
        return applyU(l[0], l[1], pU);
      },
      "#0EA5E9",
      0.24,
    );

    drawText(ctx, "A = L U", 10, 22, "#7DD3FC", 14);
    drawText(
      ctx,
      pU < 0.02
        ? "Stage 1: Lower-triangular shear (L)"
        : "Stage 2: Upper-triangular combine (U)",
      10,
      42,
      "#0EA5E9",
      12,
    );
    drawText(
      ctx,
      "Factorization separates elimination into two simple solves",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function QRVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = t * 0.25;
    var a1x = Math.cos(a) * 92;
    var a1y = Math.sin(a) * 92;
    var a1n = Math.sqrt(a1x * a1x + a1y * a1y);
    var q1x = a1x / a1n;
    var q1y = a1y / a1n;
    var perpX = -q1y;
    var perpY = q1x;
    var mix = 42 + Math.sin(t * 0.6) * 20;
    var a2x = q1x * mix + perpX * 78;
    var a2y = q1y * mix + perpY * 78;

    var r11 = a1x * q1x + a1y * q1y;
    var r12 = a2x * q1x + a2y * q1y;
    var u2x = a2x - r12 * q1x;
    var u2y = a2y - r12 * q1y;
    var r22 = Math.sqrt(u2x * u2x + u2y * u2y);
    var q2x = u2x / r22;
    var q2y = u2y / r22;

    drawArrow(ctx, cx, cy, cx + a1x, cy - a1y, "rgba(125,211,252,0.5)", 2);
    drawArrow(ctx, cx, cy, cx + a2x, cy - a2y, "rgba(125,211,252,0.5)", 2);
    drawArrow(ctx, cx, cy, cx + q1x * 90, cy - q1y * 90, "#84CC16", 3.2);
    drawArrow(ctx, cx, cy, cx + q2x * 90, cy - q2y * 90, "#BEF264", 3.2);

    var sq = 11;
    var n1x = q1x * sq;
    var n1y = -q1y * sq;
    var n2x = q2x * sq;
    var n2y = -q2y * sq;
    ctx.strokeStyle = "rgba(190,242,100,0.55)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + n1x, cy + n1y);
    ctx.lineTo(cx + n1x + n2x, cy + n1y + n2y);
    ctx.lineTo(cx + n2x, cy + n2y);
    ctx.stroke();

    drawText(ctx, "Q columns", cx + q1x * 90 + 6, cy - q1y * 90, "#84CC16", 12);
    drawText(
      ctx,
      "orthonormal",
      cx + q2x * 90 + 6,
      cy - q2y * 90,
      "#BEF264",
      12,
    );
    drawText(ctx, "A = Q R", 10, 22, "#BEF264", 14);
    drawText(
      ctx,
      "r11=" +
        r11.toFixed(1) +
        "  r12=" +
        r12.toFixed(1) +
        "  r22=" +
        r22.toFixed(1),
      10,
      42,
      "#84CC16",
      12,
    );
    drawText(
      ctx,
      "QR turns arbitrary columns into orthonormal geometry + coefficients",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      10.5,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ConditionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cy = h / 2;
    var lx = w * 0.27;
    var rx = w * 0.73;
    var inputScale = 68;
    var outputScale = 76;

    function transform(x, y) {
      var a1 = 0.62;
      var c1 = Math.cos(a1);
      var s1 = Math.sin(a1);
      var xr = x * c1 - y * s1;
      var yr = x * s1 + y * c1;
      xr *= 2.9;
      yr *= 0.23;
      var a2 = -0.25;
      var c2 = Math.cos(a2);
      var s2 = Math.sin(a2);
      return [xr * c2 - yr * s2, xr * s2 + yr * c2];
    }

    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(lx, cy, inputScale, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(244,63,94,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (var i = 0; i <= 72; i++) {
      var ang = (i / 72) * Math.PI * 2;
      var r = transform(Math.cos(ang), Math.sin(ang));
      var ex = rx + r[0] * outputScale;
      var ey = cy - r[1] * outputScale;
      if (i === 0) ctx.moveTo(ex, ey);
      else ctx.lineTo(ex, ey);
    }
    ctx.closePath();
    ctx.stroke();

    var a = 1.1 + t * 0.35;
    var delta = 0.06;
    var v1 = [Math.cos(a), Math.sin(a)];
    var v2 = [Math.cos(a + delta), Math.sin(a + delta)];
    var o1 = transform(v1[0], v1[1]);
    var o2 = transform(v2[0], v2[1]);

    drawArrow(
      ctx,
      lx,
      cy,
      lx + v1[0] * inputScale,
      cy - v1[1] * inputScale,
      "rgba(255,255,255,0.75)",
      2.2,
    );
    drawArrow(
      ctx,
      lx,
      cy,
      lx + v2[0] * inputScale,
      cy - v2[1] * inputScale,
      "rgba(255,255,255,0.42)",
      2.2,
    );

    drawArrow(
      ctx,
      rx,
      cy,
      rx + o1[0] * outputScale,
      cy - o1[1] * outputScale,
      "#F43F5E",
      2.8,
    );
    drawArrow(
      ctx,
      rx,
      cy,
      rx + o2[0] * outputScale,
      cy - o2[1] * outputScale,
      "#FDA4AF",
      2.8,
    );

    var inSep = Math.sqrt(
      Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2),
    );
    var outSep = Math.sqrt(
      Math.pow(o1[0] - o2[0], 2) + Math.pow(o1[1] - o2[1], 2),
    );
    var amp = outSep / (inSep + 1e-9);

    drawText(
      ctx,
      "Input space",
      lx - 36,
      cy - inputScale - 12,
      "rgba(255,255,255,0.45)",
      11,
    );
    drawText(
      ctx,
      "Output space",
      rx - 38,
      cy - outputScale - 12,
      "rgba(255,255,255,0.45)",
      11,
    );
    drawText(ctx, "kappa(A) ~= " + amp.toFixed(1), 10, 22, "#FDA4AF", 14);
    drawText(
      ctx,
      "Nearby inputs can separate sharply after A",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}
