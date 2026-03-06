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
      h - 20,
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
    drawArrow(
      ctx,
      px,
      py,
      px + -uy * 48,
      py - ux * 48,
      "rgba(255,255,255,0.25)",
      2,
    );
    drawDot(ctx, px, py, 4.5, "#6EE7B7");

    drawText(ctx, "grad f", px + ux * 58 + 7, py - uy * 58, "#10B981", 12);
    drawText(
      ctx,
      "tangent",
      px - uy * 48 + 7,
      py - ux * 48,
      "rgba(255,255,255,0.45)",
      11,
    );
    drawText(
      ctx,
      "Gradient is normal to level curves",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
    drawText(
      ctx,
      "||grad f||=" + (gNorm / 30).toFixed(2),
      10,
      22,
      "#6EE7B7",
      13,
    );
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
    drawText(
      ctx,
      "D_u f = grad f dot u = " + (d / 35).toFixed(2),
      10,
      22,
      "#67E8F9",
      13,
    );
    drawText(
      ctx,
      "Directional rate is a projection",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
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
      var cp = project(
        corners[i][0],
        corners[i][1],
        zTan(corners[i][0], corners[i][1]),
      );
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
    drawText(
      ctx,
      "Linear approximation near one point",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
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
    drawText(
      ctx,
      "Tiny square -> local parallelogram",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
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
    drawText(
      ctx,
      "Sensitivities multiply through layers",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
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
          drawArrow(
            ctx,
            x,
            y,
            x + vx,
            y - vy,
            mode > 0 ? "#22C55E" : "#86EFAC",
            2,
          );
        }
      }
      ctx.strokeStyle = "rgba(134,239,172,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.stroke();

      drawText(
        ctx,
        mode > 0 ? "div F > 0" : "div F < 0",
        10,
        22,
        "#86EFAC",
        14,
      );
      drawText(
        ctx,
        mode > 0 ? "Source-like outflow" : "Sink-like inflow",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
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
          drawArrow(
            ctx,
            x,
            y,
            x + fx,
            y - fy,
            spin > 0 ? "#A855F7" : "#D8B4FE",
            2,
          );
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

      drawText(
        ctx,
        spin > 0 ? "curl F > 0" : "curl F < 0",
        10,
        22,
        "#D8B4FE",
        14,
      );
      drawText(
        ctx,
        "Paddle wheel rotation encodes local curl",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
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

    drawText(
      ctx,
      "Work up to point ~ " + (sum / 24).toFixed(2),
      10,
      22,
      "#FDE047",
      13,
    );
    drawText(
      ctx,
      "Accumulate F dot dr along the path",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
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
    drawText(
      ctx,
      "Integral (partial) ~ " + integralApprox.toFixed(2),
      10,
      22,
      "#5EEAD4",
      13,
    );
    drawText(
      ctx,
      "Sum f(x,y) * dA over tiny cells",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ChangeVarsVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var lx = 88;
    var ly = h / 2;
    var rx = w - 112;
    var ry = h / 2;
    var s = 38;

    var a = 1.2 + Math.sin(t * 0.6) * 0.15;
    var b = 0.55 + Math.cos(t * 0.5) * 0.18;
    var c = 0.25 + Math.sin(t * 0.45) * 0.1;
    var d = 1.05 + Math.cos(t * 0.55) * 0.15;

    function left(u, v) {
      return [lx + u * s, ly - v * s];
    }
    function right(u, v) {
      return [rx + (a * u + b * v) * s, ry - (c * u + d * v) * s];
    }

    var k;
    for (k = -2; k <= 2; k++) {
      var pL1 = left(-2, k);
      var pL2 = left(2, k);
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pL1[0], pL1[1]);
      ctx.lineTo(pL2[0], pL2[1]);
      ctx.stroke();

      pL1 = left(k, -2);
      pL2 = left(k, 2);
      ctx.beginPath();
      ctx.moveTo(pL1[0], pL1[1]);
      ctx.lineTo(pL2[0], pL2[1]);
      ctx.stroke();
    }

    for (k = -2; k <= 2; k++) {
      var pR1 = right(-2, k);
      var pR2 = right(2, k);
      ctx.strokeStyle = "rgba(14,165,233,0.45)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(pR1[0], pR1[1]);
      ctx.lineTo(pR2[0], pR2[1]);
      ctx.stroke();

      pR1 = right(k, -2);
      pR2 = right(k, 2);
      ctx.beginPath();
      ctx.moveTo(pR1[0], pR1[1]);
      ctx.lineTo(pR2[0], pR2[1]);
      ctx.stroke();
    }

    var q1 = right(0.1, 0.1);
    var q2 = right(0.8, 0.1);
    var q3 = right(0.8, 0.8);
    var q4 = right(0.1, 0.8);
    ctx.fillStyle = "rgba(125,211,252,0.2)";
    ctx.strokeStyle = "#7DD3FC";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(q1[0], q1[1]);
    ctx.lineTo(q2[0], q2[1]);
    ctx.lineTo(q3[0], q3[1]);
    ctx.lineTo(q4[0], q4[1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawArrow(ctx, lx + 95, ly, rx - 95, ry, "rgba(255,255,255,0.35)", 2.2);
    drawText(ctx, "(u,v)", lx - 22, ly - 90, "rgba(255,255,255,0.5)", 12);
    drawText(ctx, "(x,y)", rx - 18, ry - 90, "#7DD3FC", 12);

    var det = a * d - b * c;
    drawText(
      ctx,
      "|det J| = " + Math.abs(det).toFixed(2),
      10,
      22,
      "#7DD3FC",
      13,
    );
    drawText(
      ctx,
      "Tile areas rescale under coordinate mapping",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function HessianVis() {
  var st = useState("pd");
  var mode = st[0];
  var setMode = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var angle = 0.4 + Math.sin(t * 0.4) * 0.2;

      var i;
      if (mode === "pd") {
        for (i = 1; i <= 5; i++) {
          var r = 20 + i * 16;
          ctx.strokeStyle = "rgba(124,58,237," + (0.28 - i * 0.03) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r, r * 0.62, angle, 0, Math.PI * 2);
          ctx.stroke();
        }
        drawText(ctx, "det(H) > 0, f_xx > 0", 10, 22, "#C4B5FD", 13);
      } else {
        for (i = 1; i <= 4; i++) {
          var k = 220 + i * 120;
          var x;
          ctx.strokeStyle = "rgba(124,58,237," + (0.25 - i * 0.035) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (x = -130; x <= -18; x += 4) {
            var y = k / x;
            var sx = cx + x * Math.cos(angle) - y * Math.sin(angle);
            var sy = cy - (x * Math.sin(angle) + y * Math.cos(angle));
            if (x === -130) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          for (x = 18; x <= 130; x += 4) {
            y = k / x;
            sx = cx + x * Math.cos(angle) - y * Math.sin(angle);
            sy = cy - (x * Math.sin(angle) + y * Math.cos(angle));
            if (x === 18) ctx.moveTo(sx, sy);
            else ctx.lineTo(sx, sy);
          }
          ctx.stroke();
        }
        drawText(ctx, "det(H) < 0 (saddle)", 10, 22, "#C4B5FD", 13);
      }

      var ax1x = Math.cos(angle) * 130;
      var ax1y = Math.sin(angle) * 130;
      var ax2x = Math.cos(angle + Math.PI / 2) * 130;
      var ax2y = Math.sin(angle + Math.PI / 2) * 130;
      ctx.strokeStyle = "rgba(196,181,253,0.28)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx - ax1x, cy + ax1y);
      ctx.lineTo(cx + ax1x, cy - ax1y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx - ax2x, cy + ax2y);
      ctx.lineTo(cx + ax2x, cy - ax2y);
      ctx.stroke();
      ctx.setLineDash([]);

      drawDot(ctx, cx, cy, 4.5, "#C4B5FD");
      drawText(
        ctx,
        "Second-order curvature geometry",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
    },
    [mode],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setMode("pd");
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: mode === "pd" ? "#7C3AED" : "rgba(255,255,255,0.08)",
            color: mode === "pd" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Bowl
        </button>
        <button
          onClick={function () {
            setMode("saddle");
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background:
              mode === "saddle" ? "#7C3AED" : "rgba(255,255,255,0.08)",
            color: mode === "saddle" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Saddle
        </button>
      </div>
    </div>
  );
}

export function CriticalPointsVis() {
  var st = useState("min");
  var kind = st[0];
  var setKind = st[1];

  var draw = useCallback(
    function (ctx, w, h) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var i;

      if (kind === "min" || kind === "max") {
        for (i = 1; i <= 6; i++) {
          var r = 14 + i * 15;
          var alpha = 0.3 - i * 0.035;
          ctx.strokeStyle =
            kind === "min"
              ? "rgba(244,63,94," + alpha + ")"
              : "rgba(253,164,175," + alpha + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.ellipse(cx, cy, r, r * 0.72, 0.35, 0, Math.PI * 2);
          ctx.stroke();
        }
      } else {
        for (i = 1; i <= 4; i++) {
          var k = 200 + i * 90;
          var x;
          ctx.strokeStyle = "rgba(244,63,94," + (0.25 - i * 0.03) + ")";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          for (x = -120; x <= -18; x += 4) {
            var y = k / x;
            if (x === -120) ctx.moveTo(cx + x, cy - y);
            else ctx.lineTo(cx + x, cy - y);
          }
          for (x = 18; x <= 120; x += 4) {
            y = k / x;
            if (x === 18) ctx.moveTo(cx + x, cy - y);
            else ctx.lineTo(cx + x, cy - y);
          }
          ctx.stroke();
        }
      }

      drawDot(ctx, cx, cy, 5, "#fff");
      drawText(
        ctx,
        kind === "min"
          ? "Local minimum"
          : kind === "max"
            ? "Local maximum"
            : "Saddle point",
        10,
        22,
        "#FDA4AF",
        14,
      );
      drawText(
        ctx,
        "Solve grad f = 0, then classify with Hessian",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
    },
    [kind],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
        <button
          onClick={function () {
            setKind("min");
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: kind === "min" ? "#F43F5E" : "rgba(255,255,255,0.08)",
            color: kind === "min" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Minimum
        </button>
        <button
          onClick={function () {
            setKind("max");
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: kind === "max" ? "#F43F5E" : "rgba(255,255,255,0.08)",
            color: kind === "max" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Maximum
        </button>
        <button
          onClick={function () {
            setKind("saddle");
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background:
              kind === "saddle" ? "#F43F5E" : "rgba(255,255,255,0.08)",
            color: kind === "saddle" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Saddle
        </button>
      </div>
    </div>
  );
}

export function Taylor2Vis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2 + 28;

    function f(x) {
      return 0.00025 * x * x * x + 0.012 * x * x - 0.16 * x;
    }
    function df(x) {
      return 0.00075 * x * x + 0.024 * x - 0.16;
    }
    function d2f(x) {
      return 0.0015 * x + 0.024;
    }

    var a = Math.sin(t * 0.35) * 26;
    var fa = f(a);
    var dfa = df(a);
    var d2fa = d2f(a);

    function L(x) {
      return fa + dfa * (x - a);
    }
    function Q(x) {
      return L(x) + 0.5 * d2fa * (x - a) * (x - a);
    }

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, cy);
    ctx.lineTo(w - 10, cy);
    ctx.stroke();

    var x;
    ctx.strokeStyle = "rgba(255,255,255,0.65)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (x = -130; x <= 130; x += 2) {
      var sx = cx + x;
      var sy = cy - f(x);
      if (x === -130) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(20,184,166,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (x = -130; x <= 130; x += 2) {
      sx = cx + x;
      sy = cy - L(x);
      if (x === -130) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    ctx.strokeStyle = "rgba(94,234,212,0.95)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (x = -130; x <= 130; x += 2) {
      sx = cx + x;
      sy = cy - Q(x);
      if (x === -130) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    var px = cx + a;
    var py = cy - fa;
    drawDot(ctx, px, py, 5, "#5EEAD4");

    drawText(ctx, "f(x): true curve", 10, 22, "rgba(255,255,255,0.7)", 11);
    drawText(ctx, "1st order (line)", 10, 40, "rgba(20,184,166,0.9)", 11);
    drawText(ctx, "2nd order (quadratic)", 10, 58, "#5EEAD4", 11);
    drawText(
      ctx,
      "Second-order term adds curvature",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function LagrangeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var R = 88;

    var ox = cx + 70;
    var oy = cy - 40;
    var dx = ox - cx;
    var dy = oy - cy;
    var n = Math.sqrt(dx * dx + dy * dy) || 1;
    var px = cx + (dx / n) * R;
    var py = cy + (dy / n) * R;
    var r0 = Math.sqrt((px - ox) * (px - ox) + (py - oy) * (py - oy));
    var r = r0 + Math.sin(t * 0.7) * 16;

    ctx.strokeStyle = "rgba(245,158,11,0.65)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = "rgba(252,211,77,0.45)";
    ctx.lineWidth = 1.6;
    var i;
    for (i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.arc(ox, oy, Math.max(15, r + i * 18), 0, Math.PI * 2);
      ctx.stroke();
    }

    drawDot(ctx, px, py, 5, "#FCD34D");
    drawArrow(
      ctx,
      px,
      py,
      px + ((px - cx) / R) * 48,
      py + ((py - cy) / R) * 48,
      "#F59E0B",
      3,
    );
    var n2 = Math.sqrt((px - ox) * (px - ox) + (py - oy) * (py - oy)) || 1;
    drawArrow(
      ctx,
      px,
      py,
      px + ((px - ox) / n2) * 48,
      py + ((py - oy) / n2) * 48,
      "#FCD34D",
      3,
    );

    drawText(
      ctx,
      "grad g",
      px + ((px - cx) / R) * 54 + 5,
      py + ((py - cy) / R) * 54,
      "#F59E0B",
      11,
    );
    drawText(
      ctx,
      "grad f",
      px + ((px - ox) / n2) * 54 + 5,
      py + ((py - oy) / n2) * 54 + 12,
      "#FCD34D",
      11,
    );
    drawText(
      ctx,
      "At optimum on constraint: grad f || grad g",
      10,
      22,
      "#FCD34D",
      13,
    );
    drawText(
      ctx,
      "Touching level set + constraint gives candidate extrema",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function GreensTheoremVis() {
  var st = useState(1);
  var orientation = st[0];
  var setOrientation = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var rx = 96;
      var ry = 68;

      ctx.fillStyle = "rgba(34,211,238,0.12)";
      ctx.strokeStyle = "rgba(103,232,249,0.7)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      var i;
      var j;
      for (i = -3; i <= 3; i++) {
        for (j = -2; j <= 2; j++) {
          var x = cx + i * 30;
          var y = cy + j * 30;
          var inside =
            Math.pow((x - cx) / rx, 2) + Math.pow((y - cy) / ry, 2) <= 1;
          if (!inside) continue;
          var fx = -(y - cy) / 80;
          var fy = (x - cx) / 80 + 0.25;
          drawArrow(
            ctx,
            x,
            y,
            x + fx * 20,
            y - fy * 20,
            "rgba(103,232,249,0.65)",
            1.6,
          );
        }
      }

      var phase = (t * 0.11) % 1;
      if (orientation < 0) phase = 1 - phase;
      var ang = phase * Math.PI * 2;
      var px = cx + rx * Math.cos(ang);
      var py = cy + ry * Math.sin(ang);
      var tx = -rx * Math.sin(ang);
      var ty = ry * Math.cos(ang);
      var tn = Math.sqrt(tx * tx + ty * ty) || 1;
      tx /= tn;
      ty /= tn;
      if (orientation < 0) {
        tx = -tx;
        ty = -ty;
      }
      drawDot(ctx, px, py, 4.5, "#67E8F9");
      drawArrow(ctx, px, py, px + tx * 28, py + ty * 28, "#22D3EE", 2.6);

      drawText(
        ctx,
        orientation > 0
          ? "Positive orientation (CCW)"
          : "Negative orientation (CW)",
        10,
        22,
        "#67E8F9",
        12,
      );
      drawText(
        ctx,
        "Boundary circulation = interior curl integral",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
    },
    [orientation],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setOrientation(1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: orientation > 0 ? "#22D3EE" : "rgba(255,255,255,0.08)",
            color: orientation > 0 ? "#001018" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          CCW
        </button>
        <button
          onClick={function () {
            setOrientation(-1);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: orientation < 0 ? "#22D3EE" : "rgba(255,255,255,0.08)",
            color: orientation < 0 ? "#001018" : "rgba(255,255,255,0.5)",
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

export function TripleIntegralVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2 + 34;
    var L = 92;
    var zMax = ((Math.sin(t * 0.55) + 1) / 2) * L;

    function project(x, y, z) {
      return [cx + x + 0.58 * y, cy - z + 0.3 * y];
    }

    var z;
    for (z = 0; z <= zMax; z += 10) {
      var p1 = project(0, 0, z);
      var p2 = project(L, 0, z);
      var p3 = project(L, L, z);
      var p4 = project(0, L, z);
      ctx.fillStyle = "rgba(6,182,212,0.08)";
      ctx.beginPath();
      ctx.moveTo(p1[0], p1[1]);
      ctx.lineTo(p2[0], p2[1]);
      ctx.lineTo(p3[0], p3[1]);
      ctx.lineTo(p4[0], p4[1]);
      ctx.closePath();
      ctx.fill();
    }

    var corners = [
      project(0, 0, 0),
      project(L, 0, 0),
      project(L, L, 0),
      project(0, L, 0),
      project(0, 0, L),
      project(L, 0, L),
      project(L, L, L),
      project(0, L, L),
    ];
    ctx.strokeStyle = "rgba(103,232,249,0.8)";
    ctx.lineWidth = 1.5;
    function edge(a, b) {
      ctx.beginPath();
      ctx.moveTo(corners[a][0], corners[a][1]);
      ctx.lineTo(corners[b][0], corners[b][1]);
      ctx.stroke();
    }
    edge(0, 1);
    edge(1, 2);
    edge(2, 3);
    edge(3, 0);
    edge(4, 5);
    edge(5, 6);
    edge(6, 7);
    edge(7, 4);
    edge(0, 4);
    edge(1, 5);
    edge(2, 6);
    edge(3, 7);

    var zPlane = project(0, 0, zMax);
    var zPlane2 = project(L, 0, zMax);
    var zPlane3 = project(L, L, zMax);
    var zPlane4 = project(0, L, zMax);
    ctx.fillStyle = "rgba(6,182,212,0.2)";
    ctx.strokeStyle = "#67E8F9";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(zPlane[0], zPlane[1]);
    ctx.lineTo(zPlane2[0], zPlane2[1]);
    ctx.lineTo(zPlane3[0], zPlane3[1]);
    ctx.lineTo(zPlane4[0], zPlane4[1]);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    drawText(
      ctx,
      "Layer accumulation ~ " + (zMax / L).toFixed(2),
      10,
      22,
      "#67E8F9",
      13,
    );
    drawText(
      ctx,
      "3D volume integral as stacked slices",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function SurfaceIntegralVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2 + 24;
    var fieldScale = 1 + Math.sin(t * 0.7) * 0.2;

    function project(x, y, z) {
      return [cx + x + 0.58 * y, cy - z + 0.28 * y];
    }
    function f(x, y) {
      return 0.01 * (0.7 * x * x + 0.45 * y * y - 0.2 * x * y);
    }
    function fx(x, y) {
      return 0.01 * (1.4 * x - 0.2 * y);
    }
    function fy(x, y) {
      return 0.01 * (0.9 * y - 0.2 * x);
    }

    var k;
    var s;
    for (k = -34; k <= 34; k += 8) {
      ctx.strokeStyle = "rgba(132,204,22,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (s = -42; s <= 42; s += 3) {
        var p1 = project(s, k, f(s, k));
        if (s === -42) ctx.moveTo(p1[0], p1[1]);
        else ctx.lineTo(p1[0], p1[1]);
      }
      ctx.stroke();
    }

    var sample = [-28, 0, 28];
    var total = 0;
    var count = 0;
    var i;
    var j;
    for (i = 0; i < sample.length; i++) {
      for (j = 0; j < sample.length; j++) {
        var x = sample[i];
        var y = sample[j];
        var z = f(x, y);
        var p = project(x, y, z);

        var nx = -fx(x, y);
        var ny = -fy(x, y);
        var nz = 1;
        var nn = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        nx /= nn;
        ny /= nn;
        nz /= nn;

        var Fx = 0.1;
        var Fy = 0.1;
        var Fz = fieldScale;
        var flux = Fx * nx + Fy * ny + Fz * nz;
        total += flux;
        count += 1;

        var q = project(x + nx * 16, y + ny * 16, z + nz * 16);
        drawArrow(
          ctx,
          p[0],
          p[1],
          q[0],
          q[1],
          flux >= 0 ? "#84CC16" : "#BEF264",
          2.3,
        );
        drawDot(ctx, p[0], p[1], 2.8, "#BEF264");
      }
    }

    drawText(
      ctx,
      "Average F.n ~ " + (total / count).toFixed(2),
      10,
      22,
      "#BEF264",
      13,
    );
    drawText(
      ctx,
      "Flux sums normal components over surface patches",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}

export function GradientFieldVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    function grad(x, y) {
      return [0.016 * x + 0.006 * y, 0.024 * y + 0.006 * x];
    }

    var i;
    var j;
    for (i = -3; i <= 3; i++) {
      for (j = -3; j <= 3; j++) {
        var x = i * 36;
        var y = j * 36;
        var g = grad(x, y);
        drawArrow(
          ctx,
          cx + x,
          cy - y,
          cx + x + g[0] * 20,
          cy - y - g[1] * 20,
          "rgba(110,231,183,0.75)",
          1.8,
        );
      }
    }

    var px = Math.cos(t * 0.6) * 90;
    var py = Math.sin(t * 0.45) * 65;
    var gp = grad(px, py);
    drawDot(ctx, cx + px, cy - py, 4.5, "#6EE7B7");
    drawArrow(
      ctx,
      cx + px,
      cy - py,
      cx + px + gp[0] * 42,
      cy - py - gp[1] * 42,
      "#10B981",
      3.2,
    );
    drawText(
      ctx,
      "grad f(x,y)",
      cx + px + gp[0] * 42 + 8,
      cy - py - gp[1] * 42,
      "#10B981",
      11,
    );

    drawText(ctx, "Gradient field over the plane", 10, 22, "#6EE7B7", 13);
    drawText(
      ctx,
      "Each arrow shows steepest local ascent",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LineIntegralConservativeVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var A = [-95, -45];
    var B = [95, 45];

    function path1(u) {
      return [A[0] + (B[0] - A[0]) * u, A[1] + (B[1] - A[1]) * u];
    }
    function path2(u) {
      var mid = [0, -95];
      if (u < 0.5) {
        var t = u * 2;
        return [A[0] + (mid[0] - A[0]) * t, A[1] + (mid[1] - A[1]) * t];
      }
      var t2 = (u - 0.5) * 2;
      return [mid[0] + (B[0] - mid[0]) * t2, mid[1] + (B[1] - mid[1]) * t2];
    }

    function drawPath(pathFn, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      var i;
      for (i = 0; i <= 80; i++) {
        var u = i / 80;
        var p = pathFn(u);
        var sx = cx + p[0];
        var sy = cy - p[1];
        if (i === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    drawPath(path1, "rgba(234,179,8,0.85)");
    drawPath(path2, "rgba(253,224,71,0.6)");
    drawDot(ctx, cx + A[0], cy - A[1], 4.5, "#fff");
    drawDot(ctx, cx + B[0], cy - B[1], 4.5, "#fff");
    drawText(ctx, "A", cx + A[0] + 6, cy - A[1], "#fff", 11);
    drawText(ctx, "B", cx + B[0] + 6, cy - B[1], "#fff", 11);

    drawText(
      ctx,
      "Conservative field: integral depends only on endpoints",
      10,
      22,
      "#FDE047",
      11.2,
    );
    drawText(
      ctx,
      "Path 1 and Path 2 give same work",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DoubleIntegralOrderVis() {
  var st = useState("dxdy");
  var order = st[0];
  var setOrder = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var x0 = cx - 110;
      var y0 = cy - 90;
      var rw = 220;
      var rh = 180;

      ctx.strokeStyle = "rgba(94,234,212,0.65)";
      ctx.lineWidth = 1.8;
      ctx.strokeRect(x0, y0, rw, rh);

      var phase = (Math.sin(t * 0.9) + 1) / 2;
      if (order === "dxdy") {
        var xSweep = x0 + phase * rw;
        ctx.fillStyle = "rgba(20,184,166,0.12)";
        ctx.fillRect(x0, y0, xSweep - x0, rh);
        ctx.strokeStyle = "rgba(94,234,212,0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xSweep, y0);
        ctx.lineTo(xSweep, y0 + rh);
        ctx.stroke();
      } else {
        var ySweep = y0 + phase * rh;
        ctx.fillStyle = "rgba(20,184,166,0.12)";
        ctx.fillRect(x0, y0, rw, ySweep - y0);
        ctx.strokeStyle = "rgba(94,234,212,0.95)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x0, ySweep);
        ctx.lineTo(x0 + rw, ySweep);
        ctx.stroke();
      }

      drawText(
        ctx,
        order === "dxdy" ? "Inner x then outer y" : "Inner y then outer x",
        10,
        22,
        "#5EEAD4",
        13,
      );
      drawText(
        ctx,
        "Same area, different slicing order",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
    },
    [order],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setOrder("dxdy");
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: order === "dxdy" ? "#14B8A6" : "rgba(255,255,255,0.08)",
            color: order === "dxdy" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          dx then dy
        </button>
        <button
          onClick={function () {
            setOrder("dydx");
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: order === "dydx" ? "#14B8A6" : "rgba(255,255,255,0.08)",
            color: order === "dydx" ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          dy then dx
        </button>
      </div>
    </div>
  );
}

export function JacobianLinearizationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cxL = 92;
    var cxR = w - 100;
    var cy = h / 2;
    var s = 30;
    var px = 0.4 + Math.sin(t * 0.55) * 0.15;
    var py = -0.25 + Math.cos(t * 0.45) * 0.12;

    function F(x, y) {
      return [
        1.1 * x + 0.35 * y + 0.15 * x * y,
        -0.2 * x + 1.05 * y + 0.1 * x * x,
      ];
    }
    function J(x, y) {
      return [
        [1.1 + 0.15 * y, 0.35 + 0.15 * x],
        [-0.2 + 0.2 * x, 1.05],
      ];
    }

    var p = F(px, py);
    var jac = J(px, py);
    var qx = 0.42;
    var qy = 0.22;
    var q = F(px + qx, py + qy);
    var lin = [
      p[0] + jac[0][0] * qx + jac[0][1] * qy,
      p[1] + jac[1][0] * qx + jac[1][1] * qy,
    ];

    drawGrid(ctx, w, h);
    drawDot(ctx, cxL + px * 90, cy - py * 90, 4.5, "#93C5FD");
    drawDot(ctx, cxL + (px + qx) * 90, cy - (py + qy) * 90, 4.5, "#3B82F6");
    drawArrow(
      ctx,
      cxL + px * 90,
      cy - py * 90,
      cxL + (px + qx) * 90,
      cy - (py + qy) * 90,
      "rgba(147,197,253,0.8)",
      2.4,
    );

    drawDot(ctx, cxR + p[0] * s, cy - p[1] * s, 4.5, "#93C5FD");
    drawDot(ctx, cxR + q[0] * s, cy - q[1] * s, 4.2, "#3B82F6");
    drawDot(ctx, cxR + lin[0] * s, cy - lin[1] * s, 4.2, "#DBEAFE");
    drawArrow(
      ctx,
      cxR + p[0] * s,
      cy - p[1] * s,
      cxR + q[0] * s,
      cy - q[1] * s,
      "#3B82F6",
      2.8,
    );
    drawArrow(
      ctx,
      cxR + p[0] * s,
      cy - p[1] * s,
      cxR + lin[0] * s,
      cy - lin[1] * s,
      "rgba(219,234,254,0.9)",
      2.2,
    );

    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = "rgba(219,234,254,0.6)";
    ctx.beginPath();
    ctx.moveTo(cxR + q[0] * s, cy - q[1] * s);
    ctx.lineTo(cxR + lin[0] * s, cy - lin[1] * s);
    ctx.stroke();
    ctx.setLineDash([]);

    drawArrow(ctx, cxL + 160, cy, cxR - 155, cy, "rgba(255,255,255,0.35)", 2);
    drawText(ctx, "Input neighborhood", 24, 22, "rgba(255,255,255,0.6)", 11);
    drawText(ctx, "Output space", w - 180, 22, "rgba(255,255,255,0.6)", 11);
    drawText(ctx, "True mapped point", w - 170, 44, "#3B82F6", 10.5);
    drawText(ctx, "Jacobian linear estimate", w - 170, 60, "#DBEAFE", 10.5);
    drawText(
      ctx,
      "Jacobian gives local first-order approximation",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);

  return <Canvas2D draw={draw} />;
}
