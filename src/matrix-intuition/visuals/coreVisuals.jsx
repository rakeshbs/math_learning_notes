import { useCallback, useState } from "react";
import { Canvas2D } from "../components/Canvas2D";
import {
  drawGrid,
  drawArrow,
  drawText,
  drawDot,
  drawRoundRect,
} from "../drawing/helpers";
export function RankVis() {
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
        drawText(
          ctx,
          "Rank 2: spans a plane",
          10,
          h - 14,
          "rgba(255,255,255,0.5)",
          12,
        );
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
        drawText(
          ctx,
          "Rank 1: only spans a line",
          10,
          h - 14,
          "rgba(255,255,255,0.5)",
          12,
        );
      } else {
        drawDot(ctx, cx, cy, 5 + Math.sin(t * 3) * 2, "#E85D04");
        drawText(
          ctx,
          "Rank 0: collapses to origin",
          10,
          h - 14,
          "rgba(255,255,255,0.5)",
          12,
        );
      }
    },
    [rankCase],
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

export function DetVis() {
  var st = useState(1);
  var scale = st[0];
  var setScale = st[1];
  var draw = useCallback(
    function (ctx, w, h) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var s = 50;
      // Reference unit square
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.strokeRect(cx, cy - s, s, s);
      ctx.setLineDash([]);
      // v1 scales with slider (can go negative → orientation flip)
      // v2 is FIXED so det = scale × 1 − 0 × 0.3 = scale (signed)
      var v1x = scale * s;
      var v2x = 0.3 * s;
      var v2y = -s;
      var det = scale; // exactly v1x/s * 1 - 0 * 0.3
      ctx.fillStyle =
        det < 0 ? "rgba(214,40,40,0.13)" : "rgba(106,76,147,0.15)";
      ctx.strokeStyle = det < 0 ? "#D62828" : "#6A4C93";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + v1x, cy);
      ctx.lineTo(cx + v1x + v2x, cy + v2y);
      ctx.lineTo(cx + v2x, cy + v2y);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      drawArrow(ctx, cx, cy, cx + v1x, cy, det < 0 ? "#D62828" : "#6A4C93");
      drawArrow(ctx, cx, cy, cx + v2x, cy + v2y, "#B8A9C9");
      drawText(ctx, "det = " + det.toFixed(2), 10, 24, "#B8A9C9", 14);
      drawText(
        ctx,
        det > 1
          ? "Space expanded"
          : det > 0
            ? "Space shrunk"
            : det === 0
              ? "Collapsed to a line (det = 0)"
              : "Orientation flipped! (det < 0)",
        10,
        h - 14,
        "rgba(255,255,255,0.5)",
        12,
      );
    },
    [scale],
  );
  return (
    <div>
      <Canvas2D draw={draw} />
      <div
        style={{
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          Scale
        </span>
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
        <span
          style={{
            color: "#B8A9C9",
            fontFamily: "monospace",
            fontSize: 13,
            minWidth: 40,
          }}
        >
          {scale.toFixed(1)}
        </span>
      </div>
    </div>
  );
}

export function EigenVis() {
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
      var isE2 =
        Math.abs(angle - Math.PI / 2) < 0.25 ||
        Math.abs(angle - Math.PI * 1.5) < 0.25;
      if (isE1 || isE2) {
        drawArrow(
          ctx,
          cx,
          cy,
          cx + tx,
          cy - ty,
          isE1 ? "#06D6A0" : "#1B9AAA",
          3,
        );
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
    drawText(
      ctx,
      "Eigenvectors stay on their line, only scale",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NullVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    // FIXED null space direction — the matrix is constant, so null(A) is constant
    var a = 0.62;
    var dx = Math.cos(a);
    var dy = Math.sin(a);
    var px = -dy; // column space: perpendicular to null space
    var py = dx;

    // Column space line (orange)
    ctx.strokeStyle = "rgba(246,127,0,0.35)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx - px * 160, cy + py * 160);
    ctx.lineTo(cx + px * 160, cy - py * 160);
    ctx.stroke();

    // Null space line (red, dashed)
    ctx.strokeStyle = "rgba(214,40,40,0.4)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - dx * 160, cy + dy * 160);
    ctx.lineTo(cx + dx * 160, cy - dy * 160);
    ctx.stroke();
    ctx.setLineDash([]);

    // Fixed sample vectors on the null space line with arrows converging to origin
    var i;
    for (i = -2; i <= 2; i++) {
      if (i === 0) continue;
      var nvx = cx + dx * i * 42;
      var nvy = cy - dy * i * 42;
      drawDot(ctx, nvx, nvy, 3.5, "rgba(214,40,40,0.85)");
      drawArrow(ctx, nvx, nvy, cx, cy, "rgba(247,127,0,0.4)", 1.4);
    }

    // Animated probe: a point sliding along the null space line
    var probe = Math.sin(t * 0.9) * 100;
    var pvx = cx + dx * probe;
    var pvy = cy - dy * probe;
    var pulseAlpha = 0.55 + 0.45 * Math.sin(t * 2.2);
    drawDot(ctx, pvx, pvy, 5, "rgba(214,40,40," + pulseAlpha + ")");
    drawArrow(ctx, pvx, pvy, cx, cy, "rgba(255,90,0,0.65)", 2.5);

    drawDot(ctx, cx, cy, 4, "#fff");
    drawText(ctx, "Ax = 0", cx + 7, cy - 8, "#fff", 11);
    drawText(ctx, "Column space", cx + px * 100 + 5, cy - py * 100 - 5, "#F77F00", 11);
    drawText(ctx, "Null space", cx + dx * 80 + 5, cy - dy * 80 - 5, "#D62828", 11);
    drawText(
      ctx,
      "Every null vector maps to origin under A",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function TraceVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 50;
    var a11 = 1.5 + Math.sin(t * 0.5) * 0.5;
    var a22 = 0.8 + Math.cos(t * 0.7) * 0.3;
    drawArrow(ctx, cx, cy, cx + a11 * s, cy, "#52B788", 3);
    drawText(
      ctx,
      "a11=" + a11.toFixed(2),
      cx + a11 * s + 8,
      cy + 4,
      "#52B788",
      12,
    );
    drawArrow(ctx, cx, cy, cx, cy - a22 * s, "#2D6A4F", 3);
    drawText(
      ctx,
      "a22=" + a22.toFixed(2),
      cx + 8,
      cy - a22 * s - 6,
      "#2D6A4F",
      12,
    );
    ctx.strokeStyle = "rgba(255,255,255,0.08)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.strokeRect(cx, cy - s, s, s);
    ctx.setLineDash([]);
    ctx.strokeStyle = "rgba(82,183,136,0.3)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(cx, cy - a22 * s, a11 * s, a22 * s);
    drawText(ctx, "trace = " + (a11 + a22).toFixed(2), 10, 22, "#52B788", 14);
    drawText(
      ctx,
      "Trace = sum of diagonal scaling factors",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function TransposeVis() {
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
    drawText(
      ctx,
      "Rows and Columns swap",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function InverseVis() {
  // A = [[2, 0.5], [0, 1.5]], det = 3
  // A^-1 = (1/3)*[[1.5, -0.5], [0, 2]] = [[0.5, -1/6], [0, 2/3]]
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 52;
    var cycle = (t * 0.38) % (Math.PI * 2);
    var norm = cycle / (Math.PI * 2); // 0..1

    // Phases: 0..0.35 apply A | 0.35..0.55 hold | 0.55..0.90 apply A^-1 | 0.90..1 hold at I
    var pA =
      norm < 0.35
        ? norm / 0.35
        : 1;
    var pInv =
      norm < 0.55
        ? 0
        : norm < 0.9
          ? (norm - 0.55) / 0.35
          : 1;

    var phase =
      norm < 0.35
        ? "Applying A..."
        : norm < 0.55
          ? "A transforms: [[2, 0.5], [0, 1.5]]"
          : norm < 0.9
            ? "Applying A^-1 (undoing A)..."
            : "A^-1 A = I";

    function applyA(x, y) {
      return [2 * x + 0.5 * y, 1.5 * y];
    }

    var pts = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];

    // Reference (ghost) unit square
    ctx.beginPath();
    for (var k = 0; k < pts.length; k++) {
      var gx = cx + pts[k][0] * s;
      var gy = cy - pts[k][1] * s;
      if (k === 0) ctx.moveTo(gx, gy);
      else ctx.lineTo(gx, gy);
    }
    ctx.closePath();
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.setLineDash([3, 4]);
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Animated parallelogram
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      var ax = pts[i][0];
      var ay = pts[i][1];
      var a = applyA(ax, ay);
      // Phase 1: lerp towards A(pt)
      var cx2 = ax + (a[0] - ax) * pA;
      var cy2 = ay + (a[1] - ay) * pA;
      // Phase 2: lerp back towards pt (A^-1 applied to A(pt) = pt)
      cx2 = cx2 + (ax - a[0]) * pInv;
      cy2 = cy2 + (ay - a[1]) * pInv;
      var sx = cx + cx2 * s;
      var sy = cy - cy2 * s;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.closePath();
    ctx.fillStyle = "rgba(0,119,182,0.18)";
    ctx.fill();
    ctx.strokeStyle = "#0077B6";
    ctx.lineWidth = 2;
    ctx.stroke();

    drawText(ctx, phase, 10, 22, "#0077B6", 13);
    drawText(
      ctx,
      "A^-1 A = I : inverse exactly undoes the transform",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SpanVis() {
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
          drawDot(
            ctx,
            ppx,
            ppy,
            2,
            "rgba(188,108,37," + Math.max(0, 0.2 - dist / 600) + ")",
          );
        }
      }
    }
    drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#BC6C25", 2.5);
    drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#DDA15E", 2.5);
    drawText(ctx, "col1", cx + v1x + 6, cy - v1y, "#BC6C25", 12);
    drawText(ctx, "col2", cx + v2x + 6, cy - v2y, "#DDA15E", 12);
    drawText(
      ctx,
      "Every dot = c1*col1 + c2*col2",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function IdentityVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var vx = Math.cos(t * 0.55) * 95;
    var vy = Math.sin(t * 0.75) * 70;

    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "rgba(94,234,212,0.65)", 2.2);
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#0F766E", 3.8);
    drawDot(ctx, cx + vx, cy - vy, 4, "#5EEAD4");

    drawText(ctx, "v", cx + vx + 8, cy - vy, "#5EEAD4", 13);
    drawText(ctx, "I v = v", 10, 22, "#5EEAD4", 14);
    drawText(
      ctx,
      "Identity leaves every vector unchanged",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function MultiplicationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 50;
    var phase = (Math.sin(t * 0.8) + 1) / 2;
    var pA = Math.min(phase * 2, 1);
    var pB = Math.max((phase - 0.5) * 2, 0);

    function lerp(a, b, p) {
      return a + (b - a) * p;
    }
    function applyA(x, y) {
      return [1.45 * x + 0.35 * y, 0.15 * x + 1.1 * y];
    }
    function applyB(x, y) {
      return [0.55 * x - 0.85 * y, 0.8 * x + 0.65 * y];
    }
    function drawShape(pts, color, alpha) {
      ctx.beginPath();
      for (var i = 0; i < pts.length; i++) {
        var x = cx + pts[i][0] * s;
        var y = cy - pts[i][1] * s;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.strokeStyle = color;
      ctx.globalAlpha = Math.min(alpha + 0.25, 1);
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    var unitSquare = [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ];
    var afterA = unitSquare.map(function (p) {
      var a = applyA(p[0], p[1]);
      return [lerp(p[0], a[0], pA), lerp(p[1], a[1], pA)];
    });
    var afterBA = unitSquare.map(function (p, i) {
      var a = applyA(p[0], p[1]);
      var b = applyB(a[0], a[1]);
      return [lerp(afterA[i][0], b[0], pB), lerp(afterA[i][1], b[1], pB)];
    });

    drawShape(unitSquare, "rgba(255,255,255,0.45)", 0.1);
    drawShape(afterA, "#93C5FD", 0.17);
    drawShape(afterBA, "#2563EB", 0.24);

    var v = [1.0, 0.65];
    var va = applyA(v[0], v[1]);
    var vba = applyB(va[0], va[1]);
    var vmid = [lerp(v[0], va[0], pA), lerp(v[1], va[1], pA)];
    var vend = [lerp(vmid[0], vba[0], pB), lerp(vmid[1], vba[1], pB)];

    drawArrow(
      ctx,
      cx,
      cy,
      cx + v[0] * s,
      cy - v[1] * s,
      "rgba(255,255,255,0.35)",
      1.8,
    );
    drawArrow(ctx, cx, cy, cx + vmid[0] * s, cy - vmid[1] * s, "#93C5FD", 2.6);
    drawArrow(ctx, cx, cy, cx + vend[0] * s, cy - vend[1] * s, "#2563EB", 3.2);

    drawText(ctx, "Matrix Multiplication", 10, 22, "#93C5FD", 14);
    drawText(
      ctx,
      pB < 0.02 ? "Stage 1: apply A" : "Stage 2: apply B after A",
      10,
      42,
      "#2563EB",
      12,
    );
    drawText(
      ctx,
      "Applying A then B equals one combined map BA",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NonCommuteVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var v = [Math.cos(t * 0.45) * 85, Math.sin(t * 0.65) * 65];

    function applyA(x, y) {
      return [1.25 * x + 0.7 * y, 0.2 * x + 1.0 * y];
    }
    function applyB(x, y) {
      var a = 0.8;
      return [
        x * Math.cos(a) - y * Math.sin(a),
        x * Math.sin(a) + y * Math.cos(a),
      ];
    }

    var av = applyA(v[0], v[1]);
    var bv = applyB(v[0], v[1]);
    var abv = applyA(bv[0], bv[1]);
    var bav = applyB(av[0], av[1]);

    drawArrow(ctx, cx, cy, cx + v[0], cy - v[1], "rgba(255,255,255,0.45)", 2);
    drawArrow(ctx, cx, cy, cx + abv[0], cy - abv[1], "#C026D3", 3.2);
    drawArrow(ctx, cx, cy, cx + bav[0], cy - bav[1], "#E9D5FF", 3.2);

    ctx.strokeStyle = "rgba(192,38,211,0.4)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + abv[0], cy - abv[1]);
    ctx.lineTo(cx + bav[0], cy - bav[1]);
    ctx.stroke();
    ctx.setLineDash([]);

    drawDot(ctx, cx + abv[0], cy - abv[1], 3.5, "#C026D3");
    drawDot(ctx, cx + bav[0], cy - bav[1], 3.5, "#E9D5FF");
    drawText(ctx, "ABv", cx + abv[0] + 6, cy - abv[1], "#C026D3", 12);
    drawText(ctx, "BAv", cx + bav[0] + 6, cy - bav[1], "#E9D5FF", 12);

    drawText(ctx, "AB != BA (usually)", 10, 22, "#E9D5FF", 14);
    drawText(
      ctx,
      "Changing order changes the endpoint",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DetOrientationVis() {
  var st = useState(-1);
  var orientation = st[0];
  var setOrientation = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var s = 58;
      var shear = 0.45 + Math.sin(t * 0.55) * 0.2;

      var e1 = [orientation * s, 0];
      var e2 = [shear * s, -s];

      ctx.fillStyle = "rgba(106,76,147,0.16)";
      ctx.strokeStyle = "#6A4C93";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + e1[0], cy + e1[1]);
      ctx.lineTo(cx + e1[0] + e2[0], cy + e1[1] + e2[1]);
      ctx.lineTo(cx + e2[0], cy + e2[1]);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      drawArrow(ctx, cx, cy, cx + e1[0], cy + e1[1], "#6A4C93", 3);
      drawArrow(ctx, cx, cy, cx + e2[0], cy + e2[1], "#B8A9C9", 3);
      drawText(ctx, "e1", cx + e1[0] + 6, cy + e1[1] + 14, "#6A4C93", 12);
      drawText(ctx, "e2", cx + e2[0] + 6, cy + e2[1] - 8, "#B8A9C9", 12);

      var det = orientation;
      drawText(
        ctx,
        "det sign = " + (det > 0 ? "+" : "-"),
        10,
        22,
        "#B8A9C9",
        14,
      );
      drawText(
        ctx,
        det > 0 ? "Orientation preserved" : "Orientation flipped (mirror)",
        10,
        h - 14,
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
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: orientation > 0 ? "#6A4C93" : "rgba(255,255,255,0.08)",
            color: orientation > 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Positive det
        </button>
        <button
          onClick={function () {
            setOrientation(-1);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: orientation < 0 ? "#6A4C93" : "rgba(255,255,255,0.08)",
            color: orientation < 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Negative det
        </button>
      </div>
    </div>
  );
}

export function EigenDecomposeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var theta = 0.55;
    var l1 = 1.7;
    var l2 = 0.45;
    var phase = (Math.sin(t * 0.8) + 1) / 2;

    var e1 = [Math.cos(theta), Math.sin(theta)];
    var e2 = [-Math.sin(theta), Math.cos(theta)];

    var i;
    for (i = -3; i <= 3; i++) {
      var j;
      for (j = -3; j <= 3; j++) {
        var vx = i * 24;
        var vy = j * 24;
        var c1 = vx * e1[0] + vy * e1[1];
        var c2 = vx * e2[0] + vy * e2[1];
        var tx =
          (1 + (l1 - 1) * phase) * c1 * e1[0] +
          (1 + (l2 - 1) * phase) * c2 * e2[0];
        var ty =
          (1 + (l1 - 1) * phase) * c1 * e1[1] +
          (1 + (l2 - 1) * phase) * c2 * e2[1];
        drawDot(ctx, cx + tx, cy - ty, 1.8, "rgba(255,255,255,0.2)");
      }
    }

    drawArrow(ctx, cx, cy, cx + e1[0] * 95, cy - e1[1] * 95, "#06D6A0", 3);
    drawArrow(ctx, cx, cy, cx + e2[0] * 78, cy - e2[1] * 78, "#1B9AAA", 3);
    drawText(ctx, "e1", cx + e1[0] * 95 + 6, cy - e1[1] * 95, "#06D6A0", 12);
    drawText(ctx, "e2", cx + e2[0] * 78 + 6, cy - e2[1] * 78, "#1B9AAA", 12);

    drawText(ctx, "A = PΛP^-1", 10, 22, "#06D6A0", 14);
    drawText(
      ctx,
      "Eigenbasis decouples the transform into axis scaling",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      10.8,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function RankSingularBarsVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var bars = [
      0.9 + Math.sin(t * 0.6) * 0.08,
      0.55 + Math.cos(t * 0.5) * 0.1,
      0.12 + Math.sin(t * 0.8 + 1.4) * 0.08,
    ];
    var threshold = 0.2;
    var rank = 0;
    var i;
    for (i = 0; i < bars.length; i++) {
      if (bars[i] > threshold) rank += 1;
    }

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, h - 34);
    ctx.lineTo(w - 30, h - 34);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,184,7,0.4)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    var ty = h - 34 - threshold * 220;
    ctx.moveTo(30, ty);
    ctx.lineTo(w - 30, ty);
    ctx.stroke();
    ctx.setLineDash([]);

    var baseX = 72;
    var gap = 78;
    for (i = 0; i < bars.length; i++) {
      var bh = bars[i] * 220;
      ctx.fillStyle =
        bars[i] > threshold ? "rgba(232,93,4,0.8)" : "rgba(255,255,255,0.16)";
      drawRoundRect(ctx, baseX + i * gap, h - 34 - bh, 42, bh, 8);
      ctx.fill();
      drawText(
        ctx,
        "σ" + String(i + 1),
        baseX + i * gap + 10,
        h - 12,
        "rgba(255,255,255,0.6)",
        11,
      );
    }

    drawText(ctx, "Rank from singular values", 10, 22, "#FAA307", 14);
    drawText(ctx, "count(σ_i > threshold) = " + rank, 10, 42, "#E85D04", 12);
    drawText(
      ctx,
      "Numerical rank depends on tolerance",
      10,
      h - 48,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NullspaceFamilyVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = 0.7 + Math.sin(t * 0.4) * 0.25;
    var dx = Math.cos(a);
    var dy = Math.sin(a);

    ctx.strokeStyle = "rgba(214,40,40,0.55)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(cx - dx * 165, cy + dy * 165);
    ctx.lineTo(cx + dx * 165, cy - dy * 165);
    ctx.stroke();

    var s;
    for (s = -3; s <= 3; s++) {
      if (s === 0) continue;
      var px = cx + dx * s * 36;
      var py = cy - dy * s * 36;
      drawDot(ctx, px, py, 3.5, "rgba(214,40,40,0.85)");
      drawArrow(ctx, px, py, cx, cy, "rgba(247,127,0,0.4)", 1.4);
    }

    drawDot(ctx, cx, cy, 4.2, "#fff");
    drawText(
      ctx,
      "All points on this line satisfy Ax = 0",
      10,
      22,
      "#F77F00",
      12.2,
    );
    drawText(ctx, "Null(A) = { t * v }", 10, 40, "#D62828", 13);
    drawText(
      ctx,
      "Every nullspace vector maps to origin",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}
