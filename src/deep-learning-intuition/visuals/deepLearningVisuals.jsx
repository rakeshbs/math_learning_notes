import { useCallback } from "react";
import { Canvas2D } from "../../matrix-intuition/components";
import {
  drawGrid,
  drawArrow,
  drawDot,
  drawText,
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
    drawText(ctx, "Perceptron + activation", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Chain rule over layers", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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

    for (var i = 0; i < n; i++) {
      var x = left + i * step;
      var stable = 30 + 10 * Math.sin(t * 0.8 + i * 0.4);
      var vanishing = 60 * Math.pow(0.72, i);
      var exploding = 8 * Math.pow(1.35, i);
      var mode = (Math.sin(t * 0.45) + 1) / 2;
      var hBar = stable * (1 - mode) + (mode < 0.5 ? vanishing : exploding) * mode;

      ctx.strokeStyle = "rgba(96,165,250,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(x, cy);
      ctx.lineTo(x, cy - hBar);
      ctx.stroke();
    }

    drawText(ctx, "Layerwise gradient magnitude", 10, 22, "#93C5FD", 12);
    drawText(ctx, "Initialization quality controls signal flow", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NormDropoutVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);

    var cx = w * 0.33;
    var cy = h * 0.52;
    for (var i = 0; i < 64; i++) {
      var angle = (i / 64) * Math.PI * 2;
      var r = 18 + (i % 8) * 2;
      var x = cx + Math.cos(angle) * r + 24;
      var y = cy + Math.sin(angle) * r - 16;
      drawDot(ctx, x, y, 2.2, "rgba(34,211,238,0.25)");
    }

    for (var j = 0; j < 64; j++) {
      var a = (j / 64) * Math.PI * 2;
      var x2 = cx + Math.cos(a) * 30;
      var y2 = cy + Math.sin(a) * 22;
      drawDot(ctx, x2, y2, 2.2, "rgba(103,232,249,0.55)");
    }

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
          ctx.beginPath();
          ctx.moveTo(nx - 7, ny - 7);
          ctx.lineTo(nx + 7, ny + 7);
          ctx.stroke();
        }
      }
    }

    drawText(ctx, "Left: BatchNorm recenter/rescale", 10, 22, "#67E8F9", 12);
    drawText(ctx, "Right: Dropout random subnetworks", 10, 40, "#7DD3FC", 12);
    drawText(ctx, "Stability + regularization", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Learning rate shapes trajectories", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Skip path keeps signal and gradients alive", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "CNN hierarchy builds spatial abstractions", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
      drawText(ctx, "t" + (i + 1), x - 7, y + 32, "rgba(255,255,255,0.55)", 11);

      if (i < n - 1) {
        drawArrow(ctx, x + 14, y, x + gap - 14, y, "#A78BFA", 2.5);
      }

      var phase = (Math.sin(t * 2 + i) + 1) / 2;
      drawDot(ctx, x, y - 24, 4, "rgba(216,180,254," + phase.toFixed(3) + ")");
      drawArrow(ctx, x, y - 18, x, y - 3, "rgba(216,180,254,0.7)", 1.5);
    }

    drawText(ctx, "Hidden state through time", 10, 22, "#D8B4FE", 12);
    drawText(ctx, "Temporal dependence with shared parameters", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Content-based token interactions", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
      drawText(ctx, "MHA + FFN", bx + 16, y + bh / 2 + 4, "#F9A8D4", 12);

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
    drawText(ctx, "Depth refines contextual representations", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function EmbeddingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    function cluster(x0, y0, color, phase) {
      for (var i = 0; i < 20; i++) {
        var a = (i / 20) * Math.PI * 2;
        var r = 18 + 8 * Math.sin(t + i * 0.4 + phase);
        var x = cx + x0 + Math.cos(a) * r;
        var y = cy + y0 + Math.sin(a) * r * 0.7;
        drawDot(ctx, x, y, 2.6, color);
      }
    }

    cluster(-75, -35, "rgba(248,113,113,0.65)", 0);
    cluster(70, -20, "rgba(252,165,165,0.65)", 1);
    cluster(5, 70, "rgba(239,68,68,0.65)", 2);

    drawText(ctx, "Embedding clusters by semantics", 10, 22, "#FCA5A5", 12);
    drawText(ctx, "Distance encodes relational similarity", 10, h - 14, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Sharp vs flat basin geometry", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}
