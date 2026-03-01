import { useCallback, useState } from "react";
import { Canvas2D } from "../../matrix-intuition/components/Canvas2D";
import {
  drawGrid,
  drawArrow,
  drawText,
  drawDot,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

export function PartialsVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var px = cx + Math.cos(t * 0.6) * 62;
    var py = cy - Math.sin(t * 0.4) * 46;
    var x = (px - cx) / 45;
    var y = (cy - py) / 45;
    var fx = 1.15 * x + 0.4 * y;
    var fy = 0.4 * x - 1.05 * y;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(px - 80, py);
    ctx.lineTo(px + 80, py);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(px, py - 80);
    ctx.lineTo(px, py + 80);
    ctx.stroke();
    ctx.setLineDash([]);

    drawDot(ctx, px, py, 4.5, "#fff");
    drawArrow(ctx, px, py, px + fx * 28, py, "#F97316", 3);
    drawArrow(ctx, px, py, px, py - fy * 28, "#FDBA74", 3);

    drawText(ctx, "f_x", px + fx * 28 + 6, py - 4, "#F97316", 12);
    drawText(ctx, "f_y", px + 6, py - fy * 28 - 6, "#FDBA74", 12);
    drawText(
      ctx,
      "Move only in x or y to read a partial slope",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
    drawText(ctx, "f_x=" + fx.toFixed(2), 10, 22, "#F97316", 13);
    drawText(ctx, "f_y=" + fy.toFixed(2), 10, 40, "#FDBA74", 13);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function GradientVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    var r;
    for (r = 28; r <= 120; r += 18) {
      ctx.strokeStyle = "rgba(16,185,129," + (0.22 - r / 700) + ")";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r, r * 0.72, 0.35, 0, Math.PI * 2);
      ctx.stroke();
    }

    var a = t * 0.45;
    var px = cx + Math.cos(a) * 80;
    var py = cy + Math.sin(a) * 58;
    var gx = px - cx;
    var gy = cy - py;
    var gNorm = Math.sqrt(gx * gx + gy * gy) || 1;
    var ux = gx / gNorm;
    var uy = gy / gNorm;

    drawArrow(ctx, px, py, px + ux * 58, py - uy * 58, "#10B981", 3.2);
    drawArrow(ctx, px, py, px + -uy * 48, py - ux * 48, "rgba(255,255,255,0.25)", 2);
    drawDot(ctx, px, py, 4.5, "#6EE7B7");

    drawText(ctx, "grad f", px + ux * 58 + 7, py - uy * 58, "#10B981", 12);
    drawText(ctx, "tangent", px - uy * 48 + 7, py - ux * 48, "rgba(255,255,255,0.45)", 11);
    drawText(ctx, "Gradient is normal to level curves", 10, h - 14, "rgba(255,255,255,0.5)", 11);
    drawText(ctx, "||grad f||=" + (gNorm / 30).toFixed(2), 10, 22, "#6EE7B7", 13);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function DirectionalVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    var gx = 88;
    var gy = 46;
    var a = t * 0.75;
    var ux = Math.cos(a);
    var uy = Math.sin(a);
    var d = gx * ux + gy * uy;
    var projX = ux * d;
    var projY = uy * d;

    drawArrow(ctx, cx, cy, cx + gx, cy - gy, "#10B981", 3.4);
    drawArrow(ctx, cx, cy, cx + ux * 92, cy - uy * 92, "#06B6D4", 2.8);
    drawArrow(ctx, cx, cy, cx + projX, cy - projY, "#67E8F9", 4);

    drawText(ctx, "grad f", cx + gx + 8, cy - gy, "#10B981", 12);
    drawText(ctx, "u", cx + ux * 92 + 8, cy - uy * 92, "#06B6D4", 13);
    drawText(ctx, "proj_u grad f", cx + projX + 8, cy - projY, "#67E8F9", 11);
    drawText(ctx, "D_u f = grad f dot u = " + (d / 35).toFixed(2), 10, 22, "#67E8F9", 13);
    drawText(ctx, "Directional rate is a projection", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function TangentPlaneVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2 + 28;

    function project(x, y, z) {
      return [cx + x + 0.58 * y, cy - z + 0.3 * y];
    }

    function f(x, y) {
      return 0.008 * (0.9 * x * x + 0.35 * x * y + 0.6 * y * y);
    }

    var a = Math.cos(t * 0.35) * 16;
    var b = Math.sin(t * 0.45) * 16;
    var z0 = f(a, b);
    var fx = 0.008 * (1.8 * a + 0.35 * b);
    var fy = 0.008 * (0.35 * a + 1.2 * b);

    function zTan(x, y) {
      return z0 + fx * (x - a) + fy * (y - b);
    }

    var k;
    var s;
    for (k = -40; k <= 40; k += 10) {
      ctx.strokeStyle = "rgba(255,255,255,0.11)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (s = -46; s <= 46; s += 4) {
        var p1 = project(s, k, f(s, k));
        if (s === -46) ctx.moveTo(p1[0], p1[1]);
        else ctx.lineTo(p1[0], p1[1]);
      }
      ctx.stroke();

      ctx.beginPath();
      for (s = -46; s <= 46; s += 4) {
        var p2 = project(k, s, f(k, s));
        if (s === -46) ctx.moveTo(p2[0], p2[1]);
        else ctx.lineTo(p2[0], p2[1]);
      }
      ctx.stroke();
    }

    var corners = [
      [a - 24, b - 24],
      [a + 24, b - 24],
      [a + 24, b + 24],
      [a - 24, b + 24],
    ];
    ctx.fillStyle = "rgba(139,92,246,0.2)";
    ctx.strokeStyle = "rgba(196,181,253,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    var i;
    for (i = 0; i < corners.length; i++) {
      var cp = project(corners[i][0], corners[i][1], zTan(corners[i][0], corners[i][1]));
      if (i === 0) ctx.moveTo(cp[0], cp[1]);
      else ctx.lineTo(cp[0], cp[1]);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    var p0 = project(a, b, z0);
    var px = project(a + 18, b, zTan(a + 18, b));
    var py = project(a, b + 18, zTan(a, b + 18));
    drawDot(ctx, p0[0], p0[1], 4.5, "#C4B5FD");
    drawArrow(ctx, p0[0], p0[1], px[0], px[1], "#8B5CF6", 2.5);
    drawArrow(ctx, p0[0], p0[1], py[0], py[1], "#C4B5FD", 2.5);

    drawText(ctx, "Tangent plane", 10, 22, "#C4B5FD", 14);
    drawText(ctx, "Linear approximation near one point", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function JacobianVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 52;

    var a = 1.15 + Math.sin(t * 0.7) * 0.35;
    var b = Math.cos(t * 0.55) * 0.45;
    var c = Math.sin(t * 0.45) * 0.4;
    var d = 0.95 + Math.cos(t * 0.6) * 0.25;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.strokeRect(cx, cy - s, s, s);
    ctx.setLineDash([]);

    var p00 = [cx, cy];
    var p10 = [cx + a * s, cy - c * s];
    var p11 = [cx + (a + b) * s, cy - (c + d) * s];
    var p01 = [cx + b * s, cy - d * s];

    ctx.fillStyle = "rgba(59,130,246,0.16)";
    ctx.strokeStyle = "#3B82F6";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(p00[0], p00[1]);
    ctx.lineTo(p10[0], p10[1]);
    ctx.lineTo(p11[0], p11[1]);
    ctx.lineTo(p01[0], p01[1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawArrow(ctx, cx, cy, p10[0], p10[1], "#3B82F6", 3);
    drawArrow(ctx, cx, cy, p01[0], p01[1], "#93C5FD", 3);

    var det = a * d - b * c;
    drawText(ctx, "det(J)=" + det.toFixed(2), 10, 22, "#93C5FD", 13);
    drawText(ctx, "Tiny square -> local parallelogram", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ChainRuleVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cy = h / 2;
    var x0 = 46;
    var bw = 78;
    var bh = 52;
    var gap = 32;

    var x1 = x0;
    var x2 = x1 + bw + gap;
    var x3 = x2 + bw + gap;

    function drawNode(x, label, color) {
      ctx.fillStyle = color + "22";
      drawRoundRect(ctx, x, cy - bh / 2, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, x, cy - bh / 2, bw, bh, 10);
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 16px monospace";
      ctx.textAlign = "center";
      ctx.fillText(label, x + bw / 2, cy + 5);
      ctx.textAlign = "left";
    }

    drawNode(x1, "x", "#EC4899");
    drawNode(x2, "u=f(x)", "#F472B6");
    drawNode(x3, "z=g(u)", "#F9A8D4");

    drawArrow(ctx, x1 + bw, cy, x2, cy, "#EC4899", 2.8);
    drawArrow(ctx, x2 + bw, cy, x3, cy, "#F472B6", 2.8);

    var pulse = ((t * 0.4) % 1) * (2 * bw + gap);
    drawDot(ctx, x1 + bw + pulse, cy, 4, "#F9A8D4");

    var duDx = 1.1 + Math.sin(t * 0.9) * 0.35;
    var dzDu = 0.9 + Math.cos(t * 0.7) * 0.3;
    var dzDx = duDx * dzDu;

    drawText(ctx, "du/dx=" + duDx.toFixed(2), x1 + 8, cy + 48, "#EC4899", 11);
    drawText(ctx, "dz/du=" + dzDu.toFixed(2), x2 + 8, cy + 48, "#F472B6", 11);
    drawText(ctx, "dz/dx=" + dzDx.toFixed(2), x3 + 4, cy + 48, "#F9A8D4", 11);

    drawText(ctx, "J(g o f) = J(g)J(f)", 10, 22, "#F9A8D4", 14);
    drawText(ctx, "Sensitivities multiply through layers", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function DivergenceVis() {
  var st = useState(1);
  var mode = st[0];
  var setMode = st[1];

  var draw = useCallback(
    function (ctx, w, h) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var i;
      var j;
      for (i = -2; i <= 2; i++) {
        for (j = -2; j <= 2; j++) {
          var x = cx + i * 44;
          var y = cy + j * 44;
          var vx = mode * i * 12;
          var vy = mode * -j * 12;
          drawArrow(ctx, x, y, x + vx, y - vy, mode > 0 ? "#22C55E" : "#86EFAC", 2);
        }
      }
      ctx.strokeStyle = "rgba(134,239,172,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      drawText(ctx, mode > 0 ? "div F > 0" : "div F < 0", 10, 22, "#86EFAC", 14);
      drawText(ctx, mode > 0 ? "Source-like outflow" : "Sink-like inflow", 10, h - 14, "rgba(255,255,255,0.5)", 11);
    },
    [mode],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setMode(1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: mode > 0 ? "#22C55E" : "rgba(255,255,255,0.08)",
            color: mode > 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Source
        </button>
        <button
          onClick={function () {
            setMode(-1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: mode < 0 ? "#22C55E" : "rgba(255,255,255,0.08)",
            color: mode < 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Sink
        </button>
      </div>
    </div>
  );
}

export function CurlVis() {
  var st = useState(1);
  var spin = st[0];
  var setSpin = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var i;
      var j;
      for (i = -2; i <= 2; i++) {
        for (j = -2; j <= 2; j++) {
          var x = cx + i * 42;
          var y = cy + j * 42;
          var dx = x - cx;
          var dy = cy - y;
          var fx = -spin * dy * 0.24;
          var fy = spin * dx * 0.24;
          drawArrow(ctx, x, y, x + fx, y - fy, spin > 0 ? "#A855F7" : "#D8B4FE", 2);
        }
      }

      var ang = t * spin * 1.8;
      var lx = Math.cos(ang) * 20;
      var ly = Math.sin(ang) * 20;
      var px = -Math.sin(ang) * 20;
      var py = Math.cos(ang) * 20;

      ctx.strokeStyle = "rgba(216,180,254,0.6)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.stroke();
      drawArrow(ctx, cx - lx, cy + ly, cx + lx, cy - ly, "#D8B4FE", 2.5);
      drawArrow(ctx, cx - px, cy + py, cx + px, cy - py, "#D8B4FE", 2.5);

      drawText(ctx, spin > 0 ? "curl F > 0" : "curl F < 0", 10, 22, "#D8B4FE", 14);
      drawText(ctx, "Paddle wheel rotation encodes local curl", 10, h - 14, "rgba(255,255,255,0.5)", 11);
    },
    [spin],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setSpin(1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: spin > 0 ? "#A855F7" : "rgba(255,255,255,0.08)",
            color: spin > 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          CCW
        </button>
        <button
          onClick={function () {
            setSpin(-1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: spin < 0 ? "#A855F7" : "rgba(255,255,255,0.08)",
            color: spin < 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          CW
        </button>
      </div>
    </div>
  );
}

export function LineIntegralVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    function path(u) {
      return [
        -125 + 250 * u,
        34 * Math.sin(2.5 * Math.PI * u) + 18 * Math.sin(Math.PI * u),
      ];
    }

    function field(x, y) {
      return [0.35 + y / 120, x / 150];
    }

    ctx.strokeStyle = "rgba(234,179,8,0.45)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    var i;
    for (i = 0; i <= 90; i++) {
      var u = i / 90;
      var p = path(u);
      var sx = cx + p[0];
      var sy = cy - p[1];
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    for (i = 0; i <= 10; i++) {
      var ui = i / 10;
      var pi = path(ui);
      var fi = field(pi[0], pi[1]);
      drawArrow(
        ctx,
        cx + pi[0],
        cy - pi[1],
        cx + pi[0] + fi[0] * 22,
        cy - pi[1] - fi[1] * 22,
        "rgba(253,224,71,0.7)",
        1.8,
      );
    }

    var phase = (t * 0.13) % 1;
    var cur = path(phase);
    var next = path(Math.min(phase + 0.01, 1));
    drawDot(ctx, cx + cur[0], cy - cur[1], 5, "#FDE047");
    drawArrow(
      ctx,
      cx + cur[0],
      cy - cur[1],
      cx + cur[0] + (next[0] - cur[0]) * 6,
      cy - cur[1] - (next[1] - cur[1]) * 6,
      "#EAB308",
      2.5,
    );

    var steps = Math.floor(phase * 120);
    var sum = 0;
    for (i = 0; i < steps; i++) {
      var u1 = i / 120;
      var u2 = (i + 1) / 120;
      var p1 = path(u1);
      var p2 = path(u2);
      var midx = (p1[0] + p2[0]) / 2;
      var midy = (p1[1] + p2[1]) / 2;
      var fmid = field(midx, midy);
      var drx = p2[0] - p1[0];
      var dry = p2[1] - p1[1];
      sum += fmid[0] * drx + fmid[1] * dry;
    }

    drawText(ctx, "Work up to point ~ " + (sum / 24).toFixed(2), 10, 22, "#FDE047", 13);
    drawText(ctx, "Accumulate F dot dr along the path", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function DoubleIntegralVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    var N = 12;
    var size = 220;
    var x0 = cx - size / 2;
    var y0 = cy - size / 2;
    var cell = size / N;
    var phase = (t * 0.12) % 1;
    var sweepX = x0 + phase * size;

    var i;
    var j;
    var sum = 0;
    for (i = 0; i < N; i++) {
      for (j = 0; j < N; j++) {
        var mx = -1 + ((i + 0.5) / N) * 2;
        var my = -1 + ((j + 0.5) / N) * 2;
        var val = 1.15 + 0.7 * Math.sin(mx * 2.8) * Math.cos(my * 2.2);
        var a = Math.max(0.08, Math.min(0.5, 0.1 + val * 0.22));
        var cxCell = x0 + (i + 0.5) * cell;
        var included = cxCell <= sweepX;

        if (included) {
          sum += val;
        }

        ctx.fillStyle = included
          ? "rgba(20,184,166," + a.toFixed(3) + ")"
          : "rgba(20,184,166,0.06)";
        ctx.fillRect(x0 + i * cell, y0 + j * cell, cell - 1, cell - 1);
      }
    }

    ctx.strokeStyle = "rgba(94,234,212,0.55)";
    ctx.lineWidth = 1.4;
    ctx.strokeRect(x0, y0, size, size);

    ctx.strokeStyle = "rgba(94,234,212,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(sweepX, y0);
    ctx.lineTo(sweepX, y0 + size);
    ctx.stroke();

    var integralApprox = (sum / (N * N)) * 4;
    drawText(ctx, "Integral (partial) ~ " + integralApprox.toFixed(2), 10, 22, "#5EEAD4", 13);
    drawText(ctx, "Sum f(x,y) * dA over tiny cells", 10, h - 14, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}
