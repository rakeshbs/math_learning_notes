import React, { useCallback } from "react";
import { Canvas2D } from "../../matrix-intuition/components/Canvas2D";
import { drawText, drawDot, drawRoundRect } from "../../matrix-intuition/drawing/helpers";

// ── Improved Plot ────────────────────────────────────────────────────────────
// Renders a labelled 2-D function curve with axis ticks and a clipping region.
var _plotId = 0;

const Plot = ({
  fn,
  xRange = [-5, 5],
  yRange = [-1.5, 1.5],
  color = "#4caf50",
  width = 340,
  height = 200,
}) => {
  var id = React.useMemo(function () { return "pc" + (++_plotId); }, []);
  var PAD = { top: 12, right: 14, bottom: 28, left: 40 };
  var pw = width - PAD.left - PAD.right;
  var ph = height - PAD.top - PAD.bottom;

  function toSX(x) {
    return PAD.left + ((x - xRange[0]) / (xRange[1] - xRange[0])) * pw;
  }
  function toSY(y) {
    return PAD.top + ph - ((y - yRange[0]) / (yRange[1] - yRange[0])) * ph;
  }

  // Sample the function at high resolution
  var step = (xRange[1] - xRange[0]) / 400;
  var points = [];
  for (var x = xRange[0]; x <= xRange[1]; x += step) {
    var y = fn(x);
    if (isFinite(y)) {
      points.push([x, Math.max(yRange[0] - 0.5, Math.min(yRange[1] + 0.5, y))]);
    }
  }
  var path = points
    .map(function (p, i) {
      return (i === 0 ? "M" : "L") + toSX(p[0]).toFixed(1) + "," + toSY(p[1]).toFixed(1);
    })
    .join(" ");

  // Axis crossing lines
  var zeroX = toSX(0);
  var zeroY = toSY(0);
  var zeroXInPlot = zeroX >= PAD.left && zeroX <= PAD.left + pw;
  var zeroYInPlot = zeroY >= PAD.top && zeroY <= PAD.top + ph;

  // X ticks: every 2 units for ≤12 span, else every 5
  var xSpan = xRange[1] - xRange[0];
  var xTickStep = xSpan <= 12 ? 2 : 5;
  var xTicks = [];
  for (var xt = Math.ceil(xRange[0] / xTickStep) * xTickStep; xt <= xRange[1] + 0.001; xt += xTickStep) {
    xTicks.push(Math.round(xt * 100) / 100);
  }

  // Y ticks: choose step so we get ~4-6 ticks
  var ySpan = yRange[1] - yRange[0];
  var yTickStep = ySpan <= 1.2 ? 0.25 : ySpan <= 2.5 ? 0.5 : ySpan <= 6 ? 1 : 2;
  var yTicks = [];
  for (var yt = Math.ceil(yRange[0] / yTickStep) * yTickStep; yt <= yRange[1] + 0.001; yt += yTickStep) {
    yTicks.push(Math.round(yt * 100) / 100);
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={"0 0 " + width + " " + height}
      style={{
        background: "rgba(255,255,255,0.025)",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.07)",
        display: "block",
      }}
    >
      <defs>
        <clipPath id={id}>
          <rect x={PAD.left} y={PAD.top} width={pw} height={ph} />
        </clipPath>
      </defs>

      {/* Plot area background */}
      <rect x={PAD.left} y={PAD.top} width={pw} height={ph} fill="rgba(255,255,255,0.015)" />

      {/* Grid lines + X tick labels */}
      {xTicks.map(function (x) {
        var sx = toSX(x);
        return (
          <g key={x}>
            <line x1={sx} y1={PAD.top} x2={sx} y2={PAD.top + ph}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <line x1={sx} y1={PAD.top + ph} x2={sx} y2={PAD.top + ph + 4}
              stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
            <text x={sx} y={PAD.top + ph + 16} textAnchor="middle"
              fontSize={9} fill="rgba(255,255,255,0.38)" fontFamily="monospace">{x}</text>
          </g>
        );
      })}

      {/* Grid lines + Y tick labels */}
      {yTicks.map(function (y) {
        var sy = toSY(y);
        return (
          <g key={y}>
            <line x1={PAD.left} y1={sy} x2={PAD.left + pw} y2={sy}
              stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <line x1={PAD.left - 4} y1={sy} x2={PAD.left} y2={sy}
              stroke="rgba(255,255,255,0.28)" strokeWidth={1} />
            <text x={PAD.left - 6} y={sy + 3.5} textAnchor="end"
              fontSize={9} fill="rgba(255,255,255,0.38)" fontFamily="monospace">{y}</text>
          </g>
        );
      })}

      {/* Axis lines */}
      {zeroYInPlot && (
        <line x1={PAD.left} y1={zeroY} x2={PAD.left + pw} y2={zeroY}
          stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      )}
      {zeroXInPlot && (
        <line x1={zeroX} y1={PAD.top} x2={zeroX} y2={PAD.top + ph}
          stroke="rgba(255,255,255,0.22)" strokeWidth={1} />
      )}

      {/* Plot border */}
      <rect x={PAD.left} y={PAD.top} width={pw} height={ph}
        fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={1} />

      {/* Function curve — clipped */}
      <path d={path} stroke={color} strokeWidth={2.2} fill="none" clipPath={"url(#" + id + ")"} />
    </svg>
  );
};

// ── Activation function visualizations ──────────────────────────────────────

export const SigmoidVis = () => (
  <Plot fn={function (x) { return 1 / (1 + Math.exp(-x)); }} yRange={[-0.1, 1.1]} color="#4caf50" />
);

export const TanhVis = () => (
  <Plot fn={function (x) { return Math.tanh(x); }} yRange={[-1.25, 1.25]} color="#2196f3" />
);

export const BinaryStepVis = () => (
  <Plot fn={function (x) { return x < 0 ? 0 : 1; }} yRange={[-0.2, 1.4]} color="#f44336" />
);

export const ReLUVis = () => (
  <Plot fn={function (x) { return Math.max(0, x); }} yRange={[-0.5, 5.5]} color="#ff9800" />
);

export const LeakyReLUVis = () => (
  <Plot fn={function (x) { return x > 0 ? x : 0.1 * x; }} yRange={[-1.0, 5.5]} color="#ffc107" />
);

export const ELUVis = () => (
  <Plot fn={function (x) { return x > 0 ? x : 1.0 * (Math.exp(x) - 1); }} yRange={[-1.2, 5.5]} color="#ff5722" />
);

export const SELUVis = () => {
  var scale = 1.0507009873554805;
  var alpha = 1.6732632423543772;
  return (
    <Plot
      fn={function (x) { return scale * (x > 0 ? x : alpha * (Math.exp(x) - 1)); }}
      yRange={[-2.0, 5.5]}   // asymptote ≈ −1.758; give it breathing room
      color="#00bcd4"
    />
  );
};

export const PReLUVis = () => (
  <Plot fn={function (x) { return x > 0 ? x : 0.25 * x; }} yRange={[-1.5, 5.5]} color="#ffd600" />
);

export const GELUVis = () => (
  <Plot
    fn={function (x) {
      return 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x * x * x)));
    }}
    yRange={[-0.5, 5.5]}
    color="#e91e63"
  />
);

export const SwishVis = () => (
  <Plot
    fn={function (x) { return x / (1 + Math.exp(-x)); }}
    yRange={[-0.5, 5.5]}
    color="#673ab7"
  />
);

export const MishVis = () => (
  <Plot
    fn={function (x) { return x * Math.tanh(Math.log(1 + Math.exp(x))); }}
    yRange={[-0.5, 5.5]}
    color="#3f51b5"
  />
);

export const HardswishVis = () => (
  <Plot
    fn={function (x) {
      if (x <= -3) return 0;
      if (x >= 3) return x;
      return (x * (x + 3)) / 6;
    }}
    yRange={[-0.1, 5.5]}
    color="#ff6f00"
  />
);

// Softmax operates on a vector — show it as an animated bar chart
export const SoftmaxVis = () => {
  var draw = useCallback(function (ctx, w, h, t) {
    // Logits: second one oscillates to illustrate softmax sensitivity
    var logits = [1.0, 2.2 + Math.sin(t * 0.65) * 1.4, 0.5, 1.8];
    var n = logits.length;

    // Compute softmax with max subtraction for numerical stability
    var maxL = Math.max.apply(null, logits);
    var exps = logits.map(function (l) { return Math.exp(l - maxL); });
    var sumE = exps.reduce(function (a, b) { return a + b; }, 0);
    var probs = exps.map(function (e) { return e / sumE; });

    var baseY = h - 32;
    var barW = 36;
    var gap = 14;
    var totalW = n * barW + (n - 1) * gap;
    var startX = (w - totalW) / 2;

    // Draw logit bars (left side)
    var logitStartX = startX - 70;
    drawText(ctx, "logits", logitStartX + 12, 18, "rgba(255,255,255,0.4)", 10);
    var i;
    for (i = 0; i < n; i++) {
      var lx = logitStartX + i * (barW + gap);
      var lNorm = (logits[i] - maxL + 4) / 5; // 0..1 relative to max
      var lh = Math.max(4, lNorm * 160);
      ctx.fillStyle = "rgba(100,160,255,0.45)";
      drawRoundRect(ctx, lx, baseY - lh, barW, lh, 6);
      ctx.fill();
      drawText(ctx, logits[i].toFixed(1), lx + 4, baseY - lh - 6, "rgba(100,160,255,0.8)", 9);
    }

    // Arrow
    var arrowX = logitStartX + totalW + 8;
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "18px monospace";
    ctx.fillText("→", arrowX, baseY - 70);
    drawText(ctx, "softmax", arrowX - 4, baseY - 50, "rgba(255,255,255,0.3)", 9);

    // Probability bars (right side)
    var probStartX = arrowX + 30;
    drawText(ctx, "probs", probStartX + 14, 18, "rgba(255,255,255,0.4)", 10);
    for (i = 0; i < n; i++) {
      var px = probStartX + i * (barW + gap);
      var ph = probs[i] * 180;
      ctx.fillStyle = "rgba(16,185,129,0.6)";
      drawRoundRect(ctx, px, baseY - ph, barW, ph, 6);
      ctx.fill();
      drawText(ctx, probs[i].toFixed(2), px + 2, baseY - ph - 6, "rgba(110,231,183,0.9)", 9);
    }

    drawText(ctx, "Softmax: exp(xi) / Σ exp(xj)", 10, h - 14, "rgba(255,255,255,0.45)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
};

export const SoftplusVis = () => (
  <Plot fn={function (x) { return Math.log(1 + Math.exp(x)); }} yRange={[-0.3, 5.5]} color="#8bc34a" />
);

export const SoftsignVis = () => (
  <Plot fn={function (x) { return x / (1 + Math.abs(x)); }} yRange={[-1.25, 1.25]} color="#009688" />
);

export const IdentityVis = () => (
  <Plot fn={function (x) { return x; }} xRange={[-5, 5]} yRange={[-5.5, 5.5]} color="#607d8b" />
);
