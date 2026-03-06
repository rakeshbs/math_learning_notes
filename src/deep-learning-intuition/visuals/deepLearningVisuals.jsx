import { useCallback } from "react";
import { Canvas2D } from "../../matrix-intuition/components";
import {
  drawGrid,
  drawArrow,
  drawDot,
  drawText,
  drawCenteredText,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

export function NeuronActivationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w * 0.58;
    var cy = h * 0.5;
    var inputs = [
      [w * 0.18, h * 0.3, 0.9],
      [w * 0.14, h * 0.5, -0.4],
      [w * 0.18, h * 0.7, 0.6],
    ];
    var sum = 0;

    for (var i = 0; i < inputs.length; i++) {
      var it = inputs[i];
      var pulse = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 1.4 + i));
      drawArrow(ctx, it[0], it[1], cx - 16, cy, "rgba(251,113,133," + pulse.toFixed(3) + ")", 2.2);
      sum += it[2];
    }

    drawDot(ctx, cx, cy, 16, "#F97316");
    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.stroke();

    var z = sum + 0.2;
    var a = Math.max(0, z);
    drawArrow(ctx, cx + 16, cy, w * 0.84, cy, "#FDBA74", 3);

    drawText(ctx, "z = w.x + b = " + z.toFixed(2), 10, 22, "#FDBA74", 12);
    drawText(ctx, "ReLU(z) = " + a.toFixed(2), 10, 40, "#FDBA74", 12);
    drawText(ctx, "Perceptron + activation", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ForwardBackpropVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var layers = [3, 4, 4, 2];
    var xs = [50, 125, 205, 285].map(function (x) {
      return (x / 340) * w;
    });

    var nodes = [];
    for (var l = 0; l < layers.length; l++) {
      nodes[l] = [];
      for (var j = 0; j < layers[l]; j++) {
        var y = h * (0.2 + (0.6 * (j + 1)) / (layers[l] + 1));
        nodes[l][j] = [xs[l], y];
      }
    }

    for (var li = 0; li < layers.length - 1; li++) {
      for (var a = 0; a < nodes[li].length; a++) {
        for (var b = 0; b < nodes[li + 1].length; b++) {
          var p1 = nodes[li][a];
          var p2 = nodes[li + 1][b];
          ctx.strokeStyle = "rgba(96,165,250,0.22)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1[0], p1[1]);
          ctx.lineTo(p2[0], p2[1]);
          ctx.stroke();
        }
      }
    }

    var phase = (Math.sin(t * 1.2) + 1) / 2;
    for (var li2 = 0; li2 < layers.length - 1; li2++) {
      var from = nodes[li2][(li2 + 1) % nodes[li2].length];
      var to = nodes[li2 + 1][(li2 + 2) % nodes[li2 + 1].length];
      var mx = from[0] + (to[0] - from[0]) * phase;
      var my = from[1] + (to[1] - from[1]) * phase;
      drawDot(ctx, mx, my, 3, "#60A5FA");
    }

    var back = 1 - phase;
    for (var li3 = layers.length - 1; li3 >= 1; li3--) {
      var f = nodes[li3][li3 % nodes[li3].length];
      var g = nodes[li3 - 1][(li3 + 1) % nodes[li3 - 1].length];
      var bx = f[0] + (g[0] - f[0]) * back;
      var by = f[1] + (g[1] - f[1]) * back;
      drawDot(ctx, bx, by, 3, "#F472B6");
    }

    for (var ll = 0; ll < nodes.length; ll++) {
      for (var jj = 0; jj < nodes[ll].length; jj++) {
        drawDot(ctx, nodes[ll][jj][0], nodes[ll][jj][1], 6, "#1F2937");
        ctx.strokeStyle = "rgba(255,255,255,0.35)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(nodes[ll][jj][0], nodes[ll][jj][1], 6, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    drawText(ctx, "Blue: forward activations", 10, 22, "#93C5FD", 12);
    drawText(ctx, "Pink: backward gradients", 10, 40, "#F9A8D4", 12);
    drawText(ctx, "Chain rule over layers", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function InitGradientFlowVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 10;
    var left = 28;
    var right = w - 24;
    var step = (right - left) / (n - 1);
    var cy = h * 0.64;

    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(left, cy);
    ctx.lineTo(right, cy);
    ctx.stroke();

    var mode = (Math.sin(t * 0.45) + 1) / 2;

    for (var i = 0; i < n; i++) {
      var x = left + i * step;
      var stable = 30 + 10 * Math.sin(t * 0.8 + i * 0.4);
      var vanishing = 60 * Math.pow(0.72, i);
      var exploding = 8 * Math.pow(1.35, i);
      var hBar = stable * (1 - mode) + (mode < 0.5 ? vanishing : exploding) * mode;

      ctx.strokeStyle = "rgba(96,165,250,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, cy - hBar);
      ctx.stroke();
    }

    var modeLabel;
    var modeColor;
    if (mode < 0.3) {
      modeLabel = "Stable gradient flow";
      modeColor = "#60A5FA";
    } else if (mode > 0.7) {
      modeLabel = "Exploding / vanishing gradient";
      modeColor = "#F87171";
    } else {
      modeLabel = "Gradient signal";
      modeColor = "#9CA3AF";
    }

    drawText(ctx, modeLabel, 10, 22, modeColor, 12);
    drawText(ctx, "Initialization quality controls signal flow", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NormDropoutVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);

    // Left half: BatchNorm — show before/after distribution bell curves
    var midX = w * 0.5;
    var curveY = h * 0.52;
    var scaleY = h * 0.28;

    function bellCurve(ctx, meanX, sigma, color, alpha) {
      ctx.strokeStyle = color;
      ctx.globalAlpha = alpha;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      var steps = 60;
      for (var s = 0; s <= steps; s++) {
        var xOff = ((s / steps) - 0.5) * sigma * 6;
        var xPos = meanX + xOff;
        var gauss = Math.exp(-(xOff * xOff) / (2 * sigma * sigma));
        var yPos = curveY - gauss * scaleY;
        if (s === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    var beforeMeanX = midX * 0.42;
    var afterMeanX = midX * 0.65;
    var beforeSigma = midX * 0.22;
    var afterSigma = midX * 0.13;

    // Before: offset, wider, lighter
    bellCurve(ctx, beforeMeanX, beforeSigma, "#22D3EE", 0.38);
    // After: centered on afterMeanX, narrower, brighter
    bellCurve(ctx, afterMeanX, afterSigma, "#06B6D4", 0.88);

    // Baseline
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(10, curveY);
    ctx.lineTo(midX - 8, curveY);
    ctx.stroke();

    drawText(ctx, "before", beforeMeanX - 18, curveY + 18, "rgba(34,211,238,0.55)", 10);
    drawText(ctx, "after", afterMeanX - 12, curveY + 18, "#06B6D4", 10);

    // Right half: Dropout grid with X marks
    var startX = w * 0.58;
    var startY = h * 0.3;
    var cols = 4;
    var rows = 4;
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var nx = startX + c * 28;
        var ny = startY + r * 28;
        var keep = Math.sin(t * 2 + r * 1.3 + c * 0.8) > -0.1;
        drawDot(ctx, nx, ny, 7, keep ? "#7DD3FC" : "rgba(125,211,252,0.2)");
        if (!keep) {
          ctx.strokeStyle = "rgba(248,113,113,0.75)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(nx - 7, ny - 7);
          ctx.lineTo(nx + 7, ny + 7);
          ctx.moveTo(nx + 7, ny - 7);
          ctx.lineTo(nx - 7, ny + 7);
          ctx.stroke();
        }
      }
    }

    drawText(ctx, "Left: BatchNorm — before/after", 10, 22, "#67E8F9", 12);
    drawText(ctx, "Right: Dropout random subnetworks", 10, 40, "#7DD3FC", 12);
    drawText(ctx, "Stability + regularization", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function OptimizerVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    for (var i = 1; i <= 6; i++) {
      ctx.beginPath();
      ctx.ellipse(cx, cy, i * 28, i * 18, 0.42, 0, Math.PI * 2);
      ctx.stroke();
    }

    var sgd = [
      [130, -110],
      [85, -80],
      [58, -42],
      [30, -30],
      [12, -10],
      [0, 0],
    ];
    var adam = [
      [130, -110],
      [95, -74],
      [58, -42],
      [28, -16],
      [11, -5],
      [0, 0],
    ];
    var k = Math.min(sgd.length, Math.max(2, Math.floor(((Math.sin(t * 0.65) + 1) / 2) * sgd.length)));

    function drawPath(points, color) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (var p = 0; p < k; p++) {
        var px = cx + points[p][0] * 0.65;
        var py = cy + points[p][1] * 0.65;
        if (p === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
        drawDot(ctx, px, py, 2.5, color);
      }
      ctx.stroke();
    }

    drawPath(sgd, "#86EFAC");
    drawPath(adam, "#BEF264");

    drawText(ctx, "SGD", 10, 22, "#86EFAC", 12);
    drawText(ctx, "Adam/Adaptive", 10, 40, "#BEF264", 12);
    drawText(ctx, "Learning rate shapes trajectories", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ResidualVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var x = w * 0.2;
    var y = h * 0.38;
    var bw = w * 0.48;
    var bh = h * 0.26;

    ctx.fillStyle = "rgba(168,85,247,0.12)";
    drawRoundRect(ctx, x, y, bw, bh, 10);
    ctx.fill();
    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, x, y, bw, bh, 10);
    ctx.stroke();

    drawArrow(ctx, x - 34, y + bh / 2, x, y + bh / 2, "#D8B4FE", 2.5);
    drawArrow(ctx, x + bw, y + bh / 2, x + bw + 42, y + bh / 2, "#D8B4FE", 2.5);

    ctx.strokeStyle = "rgba(216,180,254,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x - 34, y + bh / 2);
    ctx.lineTo(x - 34, y - 24);
    ctx.lineTo(x + bw + 42, y - 24);
    ctx.lineTo(x + bw + 42, y + bh / 2);
    ctx.stroke();

    var pulse = 0.5 + 0.5 * Math.sin(t * 2);
    drawDot(ctx, x + bw + 42, y + bh / 2, 5, "rgba(216,180,254," + pulse.toFixed(3) + ")");

    drawText(ctx, "y = F(x) + x", 10, 22, "#D8B4FE", 13);
    drawText(ctx, "Skip path keeps signal and gradients alive", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function CNNPoolingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var gx = 36;
    var gy = 46;
    var cs = 14;
    var rows = 8;
    var cols = 8;

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var v = 0.25 + 0.75 * Math.max(0, Math.sin((r + c) * 0.5 + t));
        ctx.fillStyle = "rgba(124,58,237," + (0.15 + v * 0.45).toFixed(3) + ")";
        drawRoundRect(ctx, gx + c * cs, gy + r * cs, cs - 2, cs - 2, 2);
        ctx.fill();
      }
    }

    var kx = gx + ((Math.sin(t * 0.8) + 1) / 2) * cs * 4;
    var ky = gy + ((Math.cos(t * 0.6) + 1) / 2) * cs * 4;
    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2;
    ctx.strokeRect(kx, ky, cs * 3, cs * 3);

    var px = w * 0.62;
    var py = h * 0.34;
    for (var pr = 0; pr < 4; pr++) {
      for (var pc = 0; pc < 4; pc++) {
        var out = 0.2 + 0.75 * Math.max(0, Math.sin((pr * 2 + pc) * 0.6 + t));
        ctx.fillStyle = "rgba(167,139,250," + (0.18 + out * 0.55).toFixed(3) + ")";
        drawRoundRect(ctx, px + pc * 24, py + pr * 24, 20, 20, 3);
        ctx.fill();
      }
    }

    drawText(ctx, "Local filters + shared weights", 10, 22, "#C4B5FD", 12);
    drawText(ctx, "Pooling downsamples to compact maps", 10, 40, "#C4B5FD", 12);
    drawText(ctx, "CNN hierarchy builds spatial abstractions", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function RNNVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 5;
    var startX = 44;
    var y = h * 0.52;
    var gap = (w - 88) / (n - 1);

    for (var i = 0; i < n; i++) {
      var x = startX + i * gap;
      drawDot(ctx, x, y, 14, "#7C3AED");
      ctx.strokeStyle = "rgba(255,255,255,0.28)";
      ctx.beginPath();
      ctx.arc(x, y, 14, 0, Math.PI * 2);
      ctx.stroke();
      drawCenteredText(ctx, "t" + (i + 1), x, y + 32, "rgba(255,255,255,0.55)", 11);

      if (i < n - 1) {
        drawArrow(ctx, x + 14, y, x + gap - 14, y, "#A78BFA", 2.5);
      }

      var phase = (Math.sin(t * 2 + i) + 1) / 2;
      drawDot(ctx, x, y - 24, 4, "rgba(216,180,254," + phase.toFixed(3) + ")");
      drawArrow(ctx, x, y - 18, x, y - 3, "rgba(216,180,254,0.7)", 1.5);
    }

    drawText(ctx, "Hidden state through time", 10, 22, "#D8B4FE", 12);
    drawText(ctx, "Temporal dependence with shared parameters", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function AttentionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 6;
    var left = 42;
    var top = 58;
    var cs = 34;
    for (var r = 0; r < n; r++) {
      for (var c = 0; c < n; c++) {
        var val = Math.max(0.05, Math.sin(t * 0.8 + r * 0.7 - c * 0.5) * 0.5 + 0.5);
        ctx.fillStyle = "rgba(244,114,182," + (0.12 + val * 0.68).toFixed(3) + ")";
        drawRoundRect(ctx, left + c * cs, top + r * cs, cs - 4, cs - 4, 4);
        ctx.fill();
      }
    }

    var q = Math.floor(((Math.sin(t * 0.4) + 1) / 2) * (n - 1));
    ctx.strokeStyle = "#F9A8D4";
    ctx.lineWidth = 2;
    ctx.strokeRect(left - 2, top + q * cs - 2, n * cs - 2, cs);

    drawText(ctx, "Attention weight matrix", 10, 22, "#F9A8D4", 12);
    drawText(ctx, "Rows: query focus over keys", 10, 40, "#F9A8D4", 12);
    drawText(ctx, "Content-based token interactions", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function TransformerVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var bx = w * 0.24;
    var by = h * 0.18;
    var bw = w * 0.52;
    var bh = h * 0.18;

    for (var i = 0; i < 3; i++) {
      var y = by + i * (bh + 14);
      ctx.fillStyle = "rgba(190,24,93,0.14)";
      drawRoundRect(ctx, bx, y, bw, bh, 10);
      ctx.fill();
      ctx.strokeStyle = "#F9A8D4";
      ctx.lineWidth = 1.7;
      drawRoundRect(ctx, bx, y, bw, bh, 10);
      ctx.stroke();
      drawCenteredText(ctx, "MHA + FFN", bx + bw / 2, y + bh / 2, "#F9A8D4", 12);

      if (i < 2) {
        drawArrow(ctx, bx + bw / 2, y + bh, bx + bw / 2, y + bh + 12, "#F9A8D4", 2);
      }
    }

    var pulse = 0.4 + 0.6 * (Math.sin(t * 1.5) + 1) / 2;
    ctx.strokeStyle = "rgba(249,168,212," + pulse.toFixed(3) + ")";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(bx - 24, by + bh / 2);
    ctx.lineTo(bx - 24, by + 2 * (bh + 14) + bh / 2);
    ctx.lineTo(bx, by + 2 * (bh + 14) + bh / 2);
    ctx.stroke();

    drawText(ctx, "Stacked residual-attention blocks", 10, 22, "#F9A8D4", 12);
    drawText(ctx, "Depth refines contextual representations", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function EmbeddingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    var clusterDefs = [
      { x0: -75, y0: -35, color: "rgba(248,113,113,0.75)", dotColor: "#F87171", label: "cat A", phase: 0 },
      { x0: 70, y0: -20, color: "rgba(96,165,250,0.75)", dotColor: "#60A5FA", label: "cat B", phase: 1 },
      { x0: 5, y0: 65, color: "rgba(52,211,153,0.75)", dotColor: "#34D399", label: "cat C", phase: 2 },
    ];

    for (var ci = 0; ci < clusterDefs.length; ci++) {
      var cd = clusterDefs[ci];
      for (var i = 0; i < 20; i++) {
        var a = (i / 20) * Math.PI * 2;
        var r = 18 + 8 * Math.sin(t + i * 0.4 + cd.phase);
        var x = cx + cd.x0 + Math.cos(a) * r;
        var y = cy + cd.y0 + Math.sin(a) * r * 0.7;
        drawDot(ctx, x, y, 2.6, cd.color);
      }
    }

    // Legend
    var legendX = w - 74;
    var legendY = 18;
    for (var li = 0; li < clusterDefs.length; li++) {
      var lc = clusterDefs[li];
      drawDot(ctx, legendX, legendY + li * 18, 5, lc.dotColor);
      drawText(ctx, lc.label, legendX + 10, legendY + li * 18 + 4, lc.dotColor, 11);
    }

    drawText(ctx, "Embedding clusters by semantics", 10, 22, "#FCA5A5", 12);
    drawText(ctx, "Nearby points share learned features", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LossLandscapeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var cy = h / 2;
    var tilt = 0.35 + 0.2 * Math.sin(t * 0.25);

    for (var i = 1; i <= 6; i++) {
      ctx.strokeStyle = "rgba(16,185,129," + (0.35 - i * 0.045).toFixed(3) + ")";
      ctx.beginPath();
      ctx.ellipse(cx, cy, i * 26, i * (14 + 2 * i), tilt, 0, Math.PI * 2);
      ctx.stroke();
    }

    var path = [
      [120, -95],
      [84, -58],
      [53, -30],
      [28, -14],
      [11, -5],
      [0, 0],
    ];
    var k = Math.max(2, Math.floor(((Math.sin(t * 0.8) + 1) / 2) * path.length));
    ctx.strokeStyle = "#6EE7B7";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (var p = 0; p < k; p++) {
      var x = cx + path[p][0] * 0.7;
      var y = cy + path[p][1] * 0.7;
      if (p === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      drawDot(ctx, x, y, 3, "#86EFAC");
    }
    ctx.stroke();

    drawText(ctx, "Optimization path on loss surface", 10, 22, "#6EE7B7", 12);
    drawText(ctx, "Sharp vs flat basin geometry", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── New Visualizations ───────────────────────────────────────────────────────

export function SoftmaxOutputVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 4;
    var logits = [2.1, 1.0 + 1.2 * Math.sin(t * 1.3), -0.5, 0.8];
    var exps = logits.map(function (v) { return Math.exp(v); });
    var sumExp = exps.reduce(function (a, b) { return a + b; }, 0);
    var probs = exps.map(function (e) { return e / sumExp; });

    var colW = w * 0.18;
    var barW = colW * 0.55;
    var maxLogit = 4;
    var leftX = w * 0.12;
    var rightX = w * 0.62;
    var baseY = h * 0.82;
    var maxH = h * 0.52;

    // Column headers
    drawCenteredText(ctx, "logits", leftX + barW / 2, h * 0.14, "#FDBA74", 12);
    drawCenteredText(ctx, "probs", rightX + barW / 2, h * 0.14, "#86EFAC", 12);

    // Arrow between columns
    drawArrow(ctx, leftX + colW + 12, h * 0.5, rightX - 12, h * 0.5, "rgba(255,255,255,0.5)", 2);
    drawText(ctx, "softmax", leftX + colW + 14, h * 0.5 - 8, "rgba(255,255,255,0.55)", 10);

    for (var i = 0; i < n; i++) {
      var yCenter = h * (0.24 + i * 0.175);
      var barH = Math.max(4, (logits[i] / maxLogit) * maxH * 0.5);
      var probH = Math.max(4, probs[i] * maxH);

      // Logit bars
      var logitColor = i === 1 ? "#FCD34D" : "#FDBA74";
      ctx.fillStyle = logitColor;
      drawRoundRect(ctx, leftX, yCenter - barH, barW, barH, 3);
      ctx.fill();
      drawText(ctx, logits[i].toFixed(2), leftX + barW + 4, yCenter - barH / 2 + 4, "rgba(255,255,255,0.65)", 10);

      // Prob bars
      ctx.fillStyle = "#86EFAC";
      drawRoundRect(ctx, rightX, yCenter - probH, barW, probH, 3);
      ctx.fill();
      drawText(ctx, probs[i].toFixed(3), rightX + barW + 4, yCenter - probH / 2 + 4, "rgba(255,255,255,0.65)", 10);
    }

    // Sum = 1 label
    var sumVal = probs.reduce(function (a, b) { return a + b; }, 0);
    drawText(ctx, "sum = " + sumVal.toFixed(2), rightX, baseY + 14, "#86EFAC", 11);

    drawText(ctx, "Logits → softmax probabilities", 10, 22, "#FDBA74", 12);
    drawText(ctx, "Oscillating bar shows input sensitivity", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LabelSmoothingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 4;
    var correctIdx = 1;
    var eps = 0.15 + 0.15 * (Math.sin(t * 0.6) + 1) / 2; // animates 0.15..0.30

    var hardLabels = [0, 0, 0, 0];
    hardLabels[correctIdx] = 1.0;

    var softLabels = hardLabels.map(function (v, i) {
      if (i === correctIdx) return 1 - eps;
      return eps / (n - 1);
    });

    var colW = w * 0.3;
    var barW = colW * 0.45;
    var leftX = w * 0.08;
    var rightX = w * 0.55;
    var maxBarH = h * 0.48;

    drawText(ctx, "Hard label", leftX, h * 0.12, "#E5E7EB", 12);
    drawText(ctx, "Soft label (\u03b5=" + eps.toFixed(2) + ")", rightX, h * 0.12, "#A3E635", 12);

    for (var i = 0; i < n; i++) {
      var yBase = h * 0.78;
      var gap = colW / n;
      var lx = leftX + i * gap;
      var rx = rightX + i * gap;

      var hardH = Math.max(3, hardLabels[i] * maxBarH);
      var softH = Math.max(3, softLabels[i] * maxBarH);

      var hardColor = i === correctIdx ? "#4ADE80" : "rgba(96,165,250,0.45)";
      var softColor = i === correctIdx ? "#4ADE80" : "rgba(96,165,250,0.55)";

      ctx.fillStyle = hardColor;
      drawRoundRect(ctx, lx, yBase - hardH, barW, hardH, 3);
      ctx.fill();
      drawText(ctx, hardLabels[i].toFixed(2), lx, yBase + 12, "rgba(255,255,255,0.55)", 9);

      ctx.fillStyle = softColor;
      drawRoundRect(ctx, rx, yBase - softH, barW, softH, 3);
      ctx.fill();
      drawText(ctx, softLabels[i].toFixed(2), rx, yBase + 12, "rgba(255,255,255,0.55)", 9);
    }

    drawText(ctx, "Label smoothing regularizes overconfidence", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DiffusionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var steps = 5;
    var cx = w / 2;
    var cy = h * 0.44;
    var spacing = (w - 60) / (steps - 1);

    for (var si = 0; si < steps; si++) {
      var stepX = 30 + si * spacing;
      var spread = 4 + si * 14;
      var nDots = 18;

      for (var di = 0; di < nDots; di++) {
        var angle = (di / nDots) * Math.PI * 2;
        var noiseX = Math.sin(angle * (si + 1) * 0.8 + t * 0.4) * spread;
        var noiseY = Math.cos(angle * (si + 1) * 0.8 + t * 0.35) * spread;
        var dx = stepX + Math.cos(angle) * spread * 0.5 + noiseX * 0.6;
        var dy = cy + Math.sin(angle) * spread * 0.35 + noiseY * 0.6;
        var alpha = 0.85 - si * 0.12;
        drawDot(ctx, dx, dy, 2.4, "rgba(147,197,253," + alpha.toFixed(2) + ")");
      }

      // Step label
      drawText(ctx, "t=" + si, stepX - 8, cy + spread + 22, "rgba(255,255,255,0.55)", 10);
    }

    // Bidirectional arrows below clusters
    var arrowY = h * 0.78;
    drawArrow(ctx, 30, arrowY, w - 30, arrowY, "rgba(96,165,250,0.65)", 1.8);
    drawArrow(ctx, w - 30, arrowY + 14, 30, arrowY + 14, "rgba(249,168,212,0.65)", 1.8);

    drawText(ctx, "q(x_t|x_0)", w * 0.35, arrowY - 6, "rgba(96,165,250,0.75)", 10);
    drawText(ctx, "p_\u03b8(x_{t-1}|x_t)", w * 0.28, arrowY + 28, "rgba(249,168,212,0.75)", 10);

    drawText(ctx, "t=0 clean", 10, 22, "#93C5FD", 12);
    ctx.font = "600 12px monospace";
    ctx.fillStyle = "#F9A8D4";
    ctx.textAlign = "right";
    ctx.fillText("t=T noisy", w - 10, 22);
    ctx.textAlign = "left";
    drawText(ctx, "Forward noising process (left\u2192right)", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function GANVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var genX = w * 0.08;
    var genY = h * 0.25;
    var boxW = w * 0.24;
    var boxH = h * 0.3;
    var discX = w * 0.68;
    var discY = h * 0.25;

    // Generator box
    ctx.fillStyle = "rgba(236,72,153,0.12)";
    drawRoundRect(ctx, genX, genY, boxW, boxH, 10);
    ctx.fill();
    ctx.strokeStyle = "#F472B6";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, genX, genY, boxW, boxH, 10);
    ctx.stroke();
    drawCenteredText(ctx, "Generator", genX + boxW / 2, genY + boxH / 2 - 8, "#F472B6", 12);
    drawCenteredText(ctx, "G", genX + boxW / 2, genY + boxH / 2 + 8, "#F472B6", 11);

    // Discriminator box
    ctx.fillStyle = "rgba(59,130,246,0.12)";
    drawRoundRect(ctx, discX, discY, boxW, boxH, 10);
    ctx.fill();
    ctx.strokeStyle = "#60A5FA";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, discX, discY, boxW, boxH, 10);
    ctx.stroke();
    drawCenteredText(ctx, "Discriminator", discX + boxW / 2, discY + boxH / 2 - 8, "#60A5FA", 12);
    drawCenteredText(ctx, "D", discX + boxW / 2, discY + boxH / 2 + 8, "#60A5FA", 11);
    drawText(ctx, "Real/Fake?", discX + 4, discY + boxH + 14, "rgba(255,255,255,0.55)", 10);

    // Fake samples moving from G to D
    var nFake = 5;
    for (var i = 0; i < nFake; i++) {
      var phase = ((t * 0.4 + i / nFake) % 1.0);
      var fx = genX + boxW + (discX - genX - boxW) * phase;
      var fy = genY + boxH * 0.5 + Math.sin(t + i * 1.2) * 10;
      drawDot(ctx, fx, fy, 4, "rgba(244,114,182,0.8)");
    }

    // Real samples entering from below
    var nReal = 5;
    for (var j = 0; j < nReal; j++) {
      var rPhase = ((t * 0.35 + j / nReal) % 1.0);
      var rx2 = discX + boxW * 0.5 + Math.sin(t * 0.7 + j) * 14;
      var ry2 = h * 0.85 - (h * 0.85 - (discY + boxH)) * rPhase;
      drawDot(ctx, rx2, ry2, 4, "rgba(52,211,153,0.8)");
    }

    // Real label
    drawText(ctx, "Real samples", discX + 4, h * 0.88, "#34D399", 10);
    drawText(ctx, "Fake samples", genX + boxW + 8, genY + boxH * 0.5 - 18, "#F472B6", 10);

    // Gradient arrow from D back to G
    var gradY = genY - 22;
    drawArrow(ctx, discX, gradY, genX + boxW, gradY, "#FBBF24", 2);
    drawText(ctx, "gradient", w * 0.38, gradY - 8, "#FBBF24", 10);

    drawText(ctx, "Adversarial minimax game", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LSTMVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cellX = w * 0.15;
    var cellY = h * 0.22;
    var cellW = w * 0.7;
    var cellH = h * 0.52;

    // Cell border
    ctx.fillStyle = "rgba(109,40,217,0.1)";
    drawRoundRect(ctx, cellX, cellY, cellW, cellH, 14);
    ctx.fill();
    ctx.strokeStyle = "#A78BFA";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, cellX, cellY, cellW, cellH, 14);
    ctx.stroke();

    // Cell state line at top
    var csY = cellY + cellH * 0.22;
    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cellX + 14, csY);
    ctx.lineTo(cellX + cellW - 14, csY);
    ctx.stroke();
    drawCenteredText(ctx, "c_t  (cell state)", cellX + cellW / 2, csY - 10, "#C4B5FD", 11);

    // Gate definitions: forget, input, output
    var gateColors = ["#F87171", "#4ADE80", "#60A5FA"];
    var gateLabels = ["f", "i", "o"];
    var gateNames = ["forget", "input", "output"];
    var gateXs = [cellX + cellW * 0.22, cellX + cellW * 0.5, cellX + cellW * 0.78];
    var gateY = cellY + cellH * 0.65;
    var gateR = 16;

    for (var gi = 0; gi < 3; gi++) {
      var pulse = 0.3 + 0.7 * ((Math.sin(t * 1.5 + gi * 1.0) + 1) / 2);
      var gx = gateXs[gi];
      drawDot(ctx, gx, gateY, gateR, gateColors[gi].replace(")", "," + pulse.toFixed(2) + ")").replace("rgb", "rgba"));
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(gx, gateY, gateR, 0, Math.PI * 2);
      ctx.stroke();
      drawText(ctx, gateLabels[gi], gx - 4, gateY + 4, "#fff", 12);
      drawText(ctx, gateNames[gi], gx - 14, gateY + gateR + 14, gateColors[gi], 10);

      // Connect gate to cell state
      ctx.strokeStyle = "rgba(196,181,253,0.35)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(gx, gateY - gateR);
      ctx.lineTo(gx, csY);
      ctx.stroke();
    }

    // Input arrow from bottom-left
    drawArrow(ctx, cellX - 30, cellY + cellH * 0.65, cellX + 6, cellY + cellH * 0.65, "#D8B4FE", 2);
    drawText(ctx, "x_t", cellX - 38, cellY + cellH * 0.65 - 8, "#D8B4FE", 10);

    // Output arrow to bottom-right
    drawArrow(ctx, cellX + cellW - 6, cellY + cellH * 0.65, cellX + cellW + 30, cellY + cellH * 0.65, "#D8B4FE", 2);
    drawText(ctx, "h_t", cellX + cellW + 32, cellY + cellH * 0.65 - 8, "#D8B4FE", 10);

    // Hidden state arrows (h_{t-1} in, h_t out at top)
    drawArrow(ctx, cellX - 24, csY, cellX + 6, csY, "#A78BFA", 1.8);
    drawText(ctx, "h_{t-1}", cellX - 52, csY - 6, "#A78BFA", 9);

    drawText(ctx, "Gated cell state preserves long-range memory", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ContrastiveLearningVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var phase = (Math.sin(t * 0.4) + 1) / 2;
    var midX = w / 2;

    // Divider
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(midX, 10);
    ctx.lineTo(midX, h - 10);
    ctx.stroke();
    ctx.setLineDash([]);

    drawText(ctx, "before training", 10, 22, "rgba(255,255,255,0.55)", 11);
    drawText(ctx, "after training", midX + 8, 22, "rgba(255,255,255,0.55)", 11);

    // Cluster definitions: before and after positions
    var clusters = [
      {
        beforeX: midX * 0.38, beforeY: h * 0.48,
        afterX: midX * 0.26, afterY: h * 0.3,
        color: "rgba(248,113,113,", dot: "#F87171"
      },
      {
        beforeX: midX * 0.62, beforeY: h * 0.38,
        afterX: midX * 0.72, afterY: h * 0.28,
        color: "rgba(96,165,250,", dot: "#60A5FA"
      },
      {
        beforeX: midX * 0.5, beforeY: h * 0.65,
        afterX: midX * 0.5, afterY: h * 0.72,
        color: "rgba(52,211,153,", dot: "#34D399"
      },
    ];

    var sides = [
      { offsetX: 0, half: "left" },
      { offsetX: midX, half: "right" },
    ];

    for (var si = 0; si < 2; si++) {
      var offX = sides[si].offsetX;
      var isAfter = si === 1;
      var spread = isAfter ? (1 - phase) * 24 + 6 : phase * 18 + 14;

      for (var ci = 0; ci < clusters.length; ci++) {
        var cl = clusters[ci];
        var cx2 = isAfter
          ? offX + cl.afterX - midX / 2 + midX * 0.26
          : offX + cl.beforeX;
        var cy2 = isAfter ? cl.afterY : cl.beforeY;

        if (isAfter) {
          cx2 = offX + (cl.afterX * 0.85 + midX * 0.08);
          cy2 = cl.afterY;
        } else {
          cx2 = cl.beforeX;
          cy2 = cl.beforeY;
        }

        for (var di = 0; di < 12; di++) {
          var ang = (di / 12) * Math.PI * 2;
          var dr = spread + 5 * Math.sin(t * 0.5 + di + ci);
          var dx2 = cx2 + Math.cos(ang) * dr;
          var dy2 = cy2 + Math.sin(ang) * dr * 0.75;
          drawDot(ctx, dx2, dy2, 3, cl.color + "0.72)");
        }
      }
    }

    // Pull arrows: same color, within left half, between two cluster centroids
    ctx.strokeStyle = "rgba(74,222,128,0.5)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(clusters[0].beforeX, clusters[0].beforeY);
    ctx.lineTo(clusters[1].beforeX, clusters[1].beforeY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawText(ctx, "pull", (clusters[0].beforeX + clusters[1].beforeX) / 2 - 8, (clusters[0].beforeY + clusters[1].beforeY) / 2 - 8, "#4ADE80", 9);

    // Push arrows between different classes
    ctx.strokeStyle = "rgba(248,113,113,0.5)";
    ctx.lineWidth = 1.2;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(clusters[0].beforeX, clusters[0].beforeY);
    ctx.lineTo(clusters[2].beforeX, clusters[2].beforeY);
    ctx.stroke();
    ctx.setLineDash([]);
    drawText(ctx, "push", (clusters[0].beforeX + clusters[2].beforeX) / 2 - 8, (clusters[0].beforeY + clusters[2].beforeY) / 2, "#F87171", 9);

    drawText(ctx, "Pull positives together, push negatives apart", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function LearnRateScheduleVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var padL = 40;
    var padR = 20;
    var padT = 30;
    var padB = 36;
    var plotW = w - padL - padR;
    var plotH = h - padT - padB;

    // Axes
    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padL, padT);
    ctx.lineTo(padL, padT + plotH);
    ctx.lineTo(padL + plotW, padT + plotH);
    ctx.stroke();

    drawText(ctx, "0", padL - 8, padT + plotH + 14, "rgba(255,255,255,0.4)", 9);
    drawText(ctx, "1", padL + plotW - 4, padT + plotH + 14, "rgba(255,255,255,0.4)", 9);
    drawText(ctx, "lr", padL - 22, padT + 6, "rgba(255,255,255,0.4)", 9);
    drawCenteredText(ctx, "steps", padL + plotW / 2, padT + plotH + 26, "rgba(255,255,255,0.4)", 9);

    var curves = [
      {
        name: "Constant",
        color: "#FDBA74",
        fn: function (x) { return 0.5; },
      },
      {
        name: "Cosine",
        color: "#60A5FA",
        fn: function (x) { return 0.025 + 0.475 * (1 + Math.cos(Math.PI * x)); },
      },
      {
        name: "Warmup+Cosine",
        color: "#4ADE80",
        fn: function (x) {
          if (x < 0.1) return (x / 0.1) * 0.95;
          return 0.025 + 0.475 * (1 + Math.cos(Math.PI * ((x - 0.1) / 0.9)));
        },
      },
    ];

    var pts = 80;
    for (var ci = 0; ci < curves.length; ci++) {
      var curve = curves[ci];
      ctx.strokeStyle = curve.color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var pi = 0; pi <= pts; pi++) {
        var x = pi / pts;
        var y = curve.fn(x);
        var px = padL + x * plotW;
        var py = padT + (1 - y) * plotH;
        if (pi === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }

    // Animated current step line
    var stepPhase = (Math.sin(t * 0.35) + 1) / 2;
    var lineX = padL + stepPhase * plotW;
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(lineX, padT);
    ctx.lineTo(lineX, padT + plotH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Legend
    for (var li = 0; li < curves.length; li++) {
      drawText(ctx, curves[li].name, padL + 6, padT + 12 + li * 15, curves[li].color, 10);
    }

    drawText(ctx, "Schedule controls training pace and convergence", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function PositionalEncodingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var positions = 8;
    var dims = 16;
    var padL = 32;
    var padT = 26;
    var padB = 28;
    var padR = 14;
    var cellW = (w - padL - padR) / dims;
    var cellH = (h - padT - padB) / positions;

    // Axis labels
    drawCenteredText(ctx, "dim \u2192", padL + (w - padL - padR) / 2, h - padB + 18, "rgba(255,255,255,0.45)", 10);

    // Rotated "position" label — approximate with text at left
    ctx.save();
    ctx.translate(10, padT + (h - padT - padB) / 2);
    ctx.rotate(-Math.PI / 2);
    drawCenteredText(ctx, "pos", 0, 0, "rgba(255,255,255,0.45)", 10);
    ctx.restore();

    for (var pos = 0; pos < positions; pos++) {
      for (var dim = 0; dim < dims; dim++) {
        var val;
        if (dim % 2 === 0) {
          val = Math.sin(pos / Math.pow(10000, (2 * dim) / dims));
        } else {
          val = Math.cos(pos / Math.pow(10000, (2 * (dim - 1)) / dims));
        }
        // Gentle time pulse
        val = val * (0.92 + 0.08 * Math.sin(t * 0.3 + pos * 0.2 + dim * 0.15));

        // Map -1..1 to color: blue → white → orange
        var cx3 = padL + dim * cellW;
        var cy3 = padT + pos * cellH;
        var r2, g2, b2;
        if (val < 0) {
          var u = -val; // 0..1
          r2 = Math.round(30 + u * (96 - 30));
          g2 = Math.round(80 + u * (165 - 80));
          b2 = Math.round(180 + u * (250 - 180));
        } else {
          var v = val; // 0..1
          r2 = Math.round(248 - v * (248 - 251));
          g2 = Math.round(248 - v * (248 - 113));
          b2 = Math.round(248 - v * (248 - 33));
        }
        ctx.fillStyle = "rgb(" + r2 + "," + g2 + "," + b2 + ")";
        drawRoundRect(ctx, cx3 + 1, cy3 + 1, cellW - 2, cellH - 2, 2);
        ctx.fill();
      }
    }

    drawText(ctx, "Sinusoidal encoding injects position order", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BeamSearchVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var beamWidth = 3;
    var nSteps = 4;
    var rootX = w * 0.08;
    var rootY = h * 0.5;
    var stepGap = (w * 0.86) / nSteps;

    // Candidate nodes per step (beam candidates survive, others pruned)
    // Layout: 3 beams at each of nSteps columns
    var nodeYs = [-0.3, 0, 0.3]; // relative to center in terms of h fraction

    var expandPhase = (Math.sin(t * 0.45) + 1) / 2;
    var visibleSteps = Math.max(1, Math.floor(expandPhase * (nSteps + 1)));

    // Root node
    drawDot(ctx, rootX, rootY, 7, "#F9A8D4");

    for (var step = 0; step < Math.min(visibleSteps, nSteps); step++) {
      var x = rootX + (step + 1) * stepGap;

      for (var bi = 0; bi < beamWidth; bi++) {
        var y = h * (0.5 + nodeYs[bi]);
        var prevX = rootX + step * stepGap;
        var prevY = step === 0 ? rootY : h * (0.5 + nodeYs[bi]);

        // Also show pruned siblings (dim)
        var prunedCount = 2;
        for (var pi = 0; pi < prunedCount; pi++) {
          var pruneY = y + (pi + 1) * h * 0.1 * (bi % 2 === 0 ? 1 : -1);
          ctx.strokeStyle = "rgba(255,255,255,0.12)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(x, pruneY);
          ctx.stroke();
          drawDot(ctx, x, pruneY, 3.5, "rgba(255,255,255,0.12)");
        }

        // Surviving beam edge
        drawArrow(ctx, prevX + 8, prevY, x - 8, y, "#F472B6", 1.8);
        // Surviving beam node
        drawDot(ctx, x, y, 6, "#F9A8D4");
      }
    }

    drawText(ctx, "beam width=3", 10, 22, "#F9A8D4", 12);
    drawText(ctx, "Top-k paths survive at each step", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}
