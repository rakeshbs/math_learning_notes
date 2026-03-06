import { useCallback, useState } from "react";
import { Canvas2D } from "../../matrix-intuition/components/Canvas2D";
import {
  drawGrid,
  drawArrow,
  drawText,
  drawDot,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

function makeSample(withOutlier) {
  var arr = [-3.2, -2.4, -1.7, -1.1, -0.6, -0.3, 0.2, 0.6, 1.1, 1.6, 2.0, 2.5, 3.2];
  if (withOutlier) arr.push(8.5);
  return arr;
}

function meanOf(arr) {
  var s = 0;
  var i;
  for (i = 0; i < arr.length; i++) s += arr[i];
  return s / arr.length;
}

function medianOf(arr) {
  var a = arr.slice().sort(function (x, y) {
    return x - y;
  });
  var n = a.length;
  if (n % 2 === 1) return a[(n - 1) / 2];
  return (a[n / 2 - 1] + a[n / 2]) / 2;
}

function toX(v, cx, scale) {
  return cx + v * scale;
}

export function MeanMedianVis() {
  var st = useState(false);
  var withOutlier = st[0];
  var setWithOutlier = st[1];

  var draw = useCallback(
    function (ctx, w, h) {
      drawGrid(ctx, w, h);
      var data = makeSample(withOutlier);
      var m = meanOf(data);
      var med = medianOf(data);
      var cx = w / 2;
      var cy = h / 2;
      var scale = 24;

      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(18, cy);
      ctx.lineTo(w - 18, cy);
      ctx.stroke();

      var i;
      for (i = 0; i < data.length; i++) {
        var x = toX(data[i], cx, scale);
        drawDot(ctx, x, cy - 12 - (i % 3) * 10, 3.2, "rgba(255,255,255,0.7)");
      }

      var meanX = toX(m, cx, scale);
      var medX = toX(med, cx, scale);
      ctx.strokeStyle = "#F97316";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(meanX, cy - 40);
      ctx.lineTo(meanX, cy + 40);
      ctx.stroke();
      ctx.strokeStyle = "#EA580C";
      ctx.beginPath();
      ctx.moveTo(medX, cy - 40);
      ctx.lineTo(medX, cy + 40);
      ctx.stroke();

      drawText(ctx, "mean", meanX + 5, cy - 44, "#FDBA74", 11);
      drawText(ctx, "median", medX + 5, cy + 54, "#FDBA74", 11);
      drawText(ctx, "Mean vs Median", 10, 22, "#FDBA74", 14);
      drawText(
        ctx,
        withOutlier ? "Outlier pulls mean more than median" : "Without outlier, center estimates are close",
        10,
        h - 20,
        "rgba(255,255,255,0.5)",
        11,
      );
    },
    [withOutlier],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setWithOutlier(false);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: !withOutlier ? "#F97316" : "rgba(255,255,255,0.08)",
            color: !withOutlier ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Clean sample
        </button>
        <button
          onClick={function () {
            setWithOutlier(true);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: withOutlier ? "#F97316" : "rgba(255,255,255,0.08)",
            color: withOutlier ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Add outlier
        </button>
      </div>
    </div>
  );
}

export function MeanOutlierVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var scale = 24;
    var base = makeSample(false);
    var outlier = 4 + (Math.sin(t * 0.65) + 1) * 3;
    var data = base.concat([outlier]);
    var m = meanOf(data);

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(18, cy);
    ctx.lineTo(w - 18, cy);
    ctx.stroke();

    var i;
    for (i = 0; i < data.length; i++) {
      var x = toX(data[i], cx, scale);
      drawDot(
        ctx,
        x,
        cy - 10 - (i % 3) * 8,
        3,
        i === data.length - 1 ? "#F97316" : "rgba(255,255,255,0.6)",
      );
    }

    var meanX = toX(m, cx, scale);
    ctx.strokeStyle = "#FDBA74";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(meanX, cy - 44);
    ctx.lineTo(meanX, cy + 44);
    ctx.stroke();

    drawText(ctx, "moving outlier", toX(outlier, cx, scale) + 6, cy - 34, "#F97316", 11);
    drawText(ctx, "mean shifts", meanX + 6, cy + 56, "#FDBA74", 11);
    drawText(ctx, "Outlier sensitivity of mean", 10, 22, "#FDBA74", 13);
    drawText(ctx, "As one extreme point moves, mean follows", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SpreadVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var scale = 26;
    var sigma = 0.6 + (Math.sin(t * 0.45) + 1) * 1.0;
    var mu = 0;

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(20, cy);
    ctx.lineTo(w - 20, cy);
    ctx.stroke();

    var i;
    for (i = -10; i <= 10; i++) {
      var x = i * 0.5;
      var y = Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
      drawDot(ctx, toX(x, cx, scale), cy - y * 85, 2, "rgba(147,197,253,0.5)");
    }

    var left = toX(mu - sigma, cx, scale);
    var right = toX(mu + sigma, cx, scale);
    ctx.fillStyle = "rgba(37,99,235,0.22)";
    ctx.fillRect(left, cy - 75, right - left, 75);
    ctx.strokeStyle = "#2563EB";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, cy - 82);
    ctx.lineTo(left, cy + 10);
    ctx.moveTo(right, cy - 82);
    ctx.lineTo(right, cy + 10);
    ctx.stroke();

    drawText(ctx, "mu", toX(mu, cx, scale) + 4, cy + 22, "#93C5FD", 11);
    drawText(ctx, "mu-s", left - 16, cy + 22, "#93C5FD", 11);
    drawText(ctx, "mu+s", right - 10, cy + 22, "#93C5FD", 11);
    drawText(ctx, "Spread around center", 10, 22, "#93C5FD", 13);
    drawText(ctx, "Higher spread means wider typical deviations", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function VarianceSquaresVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2 + 30;
    var scale = 22;
    var mean = 0;
    var vals = [-2.5, -1.7, -0.6, 0.2, 1.0, 2.8 + Math.sin(t * 0.7) * 1.1];

    ctx.strokeStyle = "rgba(255,255,255,0.22)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(18, cy);
    ctx.lineTo(w - 18, cy);
    ctx.stroke();

    var i;
    var total = 0;
    for (i = 0; i < vals.length; i++) {
      var d = vals[i] - mean;
      total += d * d;
      var x = toX(vals[i], cx, scale);
      drawDot(ctx, x, cy - 5, 3.2, "rgba(147,197,253,0.8)");
      var side = Math.abs(d) * 8;
      ctx.fillStyle = "rgba(37,99,235,0.22)";
      drawRoundRect(ctx, x - side / 2, cy - 20 - side, side, side, 4);
      ctx.fill();
    }

    var varApprox = total / (vals.length - 1);
    drawText(ctx, "Variance as squared distances", 10, 22, "#93C5FD", 13);
    drawText(ctx, "s^2 approx " + varApprox.toFixed(2), 10, 40, "#2563EB", 12);
    drawText(ctx, "Far points create much larger square contributions", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function CovarianceVis() {
  var st = useState(1);
  var sign = st[0];
  var setSign = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var i;
      var sum = 0;
      for (i = 0; i < 40; i++) {
        var x = -120 + i * 6;
        var y = sign * (0.55 * x) + Math.sin(i * 1.3 + t) * 14;
        var sx = cx + x;
        var sy = cy - y;
        var color = x * y >= 0 ? "rgba(14,165,233,0.85)" : "rgba(248,113,113,0.75)";
        drawDot(ctx, sx, sy, 2.8, color);
        sum += x * y;
      }
      var covProxy = sum / 40;
      drawText(ctx, "Covariance sign", 10, 22, "#7DD3FC", 13);
      drawText(ctx, covProxy >= 0 ? "positive co-movement" : "negative co-movement", 10, 40, "#0EA5E9", 12);
      drawText(ctx, "Products (x-x_bar)(y-y_bar) drive covariance", 10, h - 20, "rgba(255,255,255,0.5)", 11);
    },
    [sign],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setSign(1);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: sign > 0 ? "#0EA5E9" : "rgba(255,255,255,0.08)",
            color: sign > 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Positive
        </button>
        <button
          onClick={function () {
            setSign(-1);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: sign < 0 ? "#0EA5E9" : "rgba(255,255,255,0.08)",
            color: sign < 0 ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Negative
        </button>
      </div>
    </div>
  );
}

export function CorrelationVis() {
  var st = useState(0.8);
  var rho = st[0];
  var setRho = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      var i;
      for (i = 0; i < 60; i++) {
        var x = -115 + i * 4;
        var noise = (Math.sin(i * 1.9 + t) + Math.cos(i * 0.8 + t * 0.6)) * 12;
        var y = rho * x + noise * (1 - Math.abs(rho));
        drawDot(ctx, cx + x, cy - y, 2.4, "rgba(125,211,252,0.8)");
      }
      drawText(ctx, "Correlation r approx " + rho.toFixed(2), 10, 22, "#7DD3FC", 13);
      drawText(ctx, "Magnitude controls linear tightness", 10, h - 20, "rgba(255,255,255,0.5)", 11);
    },
    [rho],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 11 }}>r</span>
        <input
          type="range"
          min="-0.95"
          max="0.95"
          step="0.05"
          value={rho}
          onChange={function (e) {
            setRho(Number(e.target.value));
          }}
          style={{ flex: 1, accentColor: "#0284C7" }}
        />
        <span style={{ color: "#7DD3FC", fontFamily: "monospace", fontSize: 12, minWidth: 36 }}>{rho.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function DistributionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var bars = [2, 4, 7, 10, 12, 11, 8, 6, 4, 3];
    var i;
    for (i = 0; i < bars.length; i++) {
      bars[i] = bars[i] + Math.sin(t * 0.7 + i * 0.6) * 0.6;
    }
    var max = 0;
    for (i = 0; i < bars.length; i++) if (bars[i] > max) max = bars[i];

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(22, h - 24);
    ctx.lineTo(w - 16, h - 24);
    ctx.stroke();

    var bw = (w - 60) / bars.length;
    var sum = 0;
    for (i = 0; i < bars.length; i++) sum += bars[i];

    for (i = 0; i < bars.length; i++) {
      var bh = (bars[i] / max) * 190;
      ctx.fillStyle = "rgba(20,184,166,0.75)";
      drawRoundRect(ctx, 30 + i * bw, h - 24 - bh, bw - 6, bh, 6);
      ctx.fill();
      drawText(ctx, (bars[i] / sum).toFixed(2), 30 + i * bw, h - 30 - bh, "rgba(255,255,255,0.5)", 9);
    }

    drawText(ctx, "Distribution shape", 10, 22, "#5EEAD4", 13);
    drawText(ctx, "Bars show where probability mass concentrates", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function NormalVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var baseY = h - 45;
    var sigma = 52 + Math.sin(t * 0.5) * 10;
    var amp = 100;

    ctx.strokeStyle = "#C4B5FD";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    var x;
    for (x = -150; x <= 150; x += 2) {
      var y = Math.exp(-(x * x) / (2 * sigma * sigma)) * amp;
      if (x === -150) ctx.moveTo(cx + x, baseY - y);
      else ctx.lineTo(cx + x, baseY - y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(124,58,237,0.18)";
    ctx.beginPath();
    for (x = -52; x <= 52; x += 2) {
      y = Math.exp(-(x * x) / (2 * sigma * sigma)) * amp;
      if (x === -52) ctx.moveTo(cx + x, baseY - y);
      else ctx.lineTo(cx + x, baseY - y);
    }
    ctx.lineTo(cx + 52, baseY);
    ctx.lineTo(cx - 52, baseY);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, baseY - 115);
    ctx.lineTo(cx, baseY + 8);
    ctx.stroke();

    drawText(ctx, "Normal bell", 10, 22, "#C4B5FD", 13);
    drawText(ctx, "Center around mu, width controlled by sigma", 10, h - 18, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function EmpiricalRuleVis() {
  var draw = useCallback(function (ctx, w, h) {
    var cx = w / 2;
    var y = h / 2;
    var ranges = [
      { width: 70, alpha: 0.3, label: "68%" },
      { width: 120, alpha: 0.2, label: "95%" },
      { width: 155, alpha: 0.12, label: "99.7%" },
    ];

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(20, y + 70);
    ctx.lineTo(w - 20, y + 70);
    ctx.stroke();

    var i;
    for (i = ranges.length - 1; i >= 0; i--) {
      var r = ranges[i];
      ctx.fillStyle = "rgba(124,58,237," + r.alpha + ")";
      drawRoundRect(ctx, cx - r.width, y - 30 - i * 20, 2 * r.width, 22, 6);
      ctx.fill();
      drawText(ctx, r.label, cx + r.width + 6, y - 14 - i * 20, "#C4B5FD", 11);
    }

    drawText(ctx, "Empirical normal rule", 10, 22, "#C4B5FD", 13);
    drawText(ctx, "Approx mass within 1s, 2s, 3s", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ZScoreVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var scale = 44;
    var z = Math.sin(t * 0.65) * 2.6;

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24, cy);
    ctx.lineTo(w - 24, cy);
    ctx.stroke();

    var k;
    for (k = -3; k <= 3; k++) {
      var x = cx + k * scale;
      ctx.strokeStyle = "rgba(255,255,255,0.18)";
      ctx.beginPath();
      ctx.moveTo(x, cy - 8);
      ctx.lineTo(x, cy + 8);
      ctx.stroke();
      drawText(ctx, String(k), x - 3, cy + 24, "rgba(255,255,255,0.45)", 10);
    }

    drawDot(ctx, cx + z * scale, cy - 2, 5, "#C4B5FD");
    drawText(ctx, "z = " + z.toFixed(2), 10, 22, "#C4B5FD", 13);
    drawText(ctx, "Standardized distance from mean", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function LLNVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var left = 24;
    var right = w - 20;
    var top = 34;
    var bottom = h - 28;
    var width = right - left;
    var height = bottom - top;
    var target = 0.5;

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top + (1 - target) * height);
    ctx.lineTo(right, top + (1 - target) * height);
    ctx.stroke();

    var i;
    var running = 0;
    ctx.strokeStyle = "#D8B4FE";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (i = 1; i <= 140; i++) {
      var flip = (Math.sin(i * 1.73 + t * 0.7) > 0 ? 1 : 0);
      running += flip;
      var avg = running / i;
      var x = left + (i / 140) * width;
      var y = top + (1 - avg) * height;
      if (i === 1) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    drawText(ctx, "Running average converges", 10, 22, "#D8B4FE", 13);
    drawText(ctx, "Fluctuations shrink as n grows", 10, h - 16, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function CLTVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var bins = [1, 2, 4, 7, 11, 15, 17, 15, 11, 7, 4, 2, 1];
    var i;
    for (i = 0; i < bins.length; i++) {
      bins[i] = bins[i] + Math.sin(t * 0.6 + i * 0.45) * 0.5;
    }
    var max = 0;
    for (i = 0; i < bins.length; i++) if (bins[i] > max) max = bins[i];

    var bw = (w - 54) / bins.length;
    for (i = 0; i < bins.length; i++) {
      var bh = (bins[i] / max) * 170;
      ctx.fillStyle = "rgba(168,85,247,0.78)";
      drawRoundRect(ctx, 26 + i * bw, h - 28 - bh, bw - 4, bh, 5);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(216,180,254,0.95)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (i = 0; i <= 200; i++) {
      var x = -3 + (i / 200) * 6;
      var y = Math.exp(-0.5 * x * x);
      var sx = 26 + (i / 200) * (w - 54);
      var sy = h - 28 - y * 170;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    drawText(ctx, "Sample-mean distribution", 10, 22, "#D8B4FE", 13);
    drawText(ctx, "Means approach bell shape as n increases", 10, h - 16, "rgba(255,255,255,0.5)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BayesVis() {
  var st = useState(0.05);
  var prior = st[0];
  var setPrior = st[1];

  var draw = useCallback(
    function (ctx, w, h) {
      var sens = 0.92;
      var fpr = 0.08;
      var numer = sens * prior;
      var denom = numer + fpr * (1 - prior);
      var post = denom > 0 ? numer / denom : 0;

      var y = h / 2;
      drawRoundRect(ctx, 24, y - 28, 88, 56, 10);
      ctx.fillStyle = "rgba(219,39,119,0.18)";
      ctx.fill();
      ctx.strokeStyle = "#F9A8D4";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, 24, y - 28, 88, 56, 10);
      ctx.stroke();
      drawText(ctx, "Prior", 52, y + 4, "#F9A8D4", 12);

      drawRoundRect(ctx, 144, y - 28, 88, 56, 10);
      ctx.fillStyle = "rgba(236,72,153,0.2)";
      ctx.fill();
      ctx.strokeStyle = "#EC4899";
      drawRoundRect(ctx, 144, y - 28, 88, 56, 10);
      ctx.stroke();
      drawText(ctx, "Likelihood", 156, y + 4, "#F9A8D4", 12);

      drawRoundRect(ctx, 262, y - 28, 88, 56, 10);
      ctx.fillStyle = "rgba(249,168,212,0.2)";
      ctx.fill();
      ctx.strokeStyle = "#F9A8D4";
      drawRoundRect(ctx, 262, y - 28, 88, 56, 10);
      ctx.stroke();
      drawText(ctx, "Posterior", 272, y + 4, "#F9A8D4", 12);

      drawArrow(ctx, 112, y, 144, y, "rgba(255,255,255,0.45)", 2);
      drawArrow(ctx, 232, y, 262, y, "rgba(255,255,255,0.45)", 2);

      drawText(ctx, "P(H)= " + prior.toFixed(2), 10, 22, "#F9A8D4", 12);
      drawText(ctx, "P(H|+)= " + post.toFixed(2), 10, 40, "#F472B6", 12);
      drawText(ctx, "Posterior reweights prior with evidence", 10, h - 20, "rgba(255,255,255,0.5)", 11);
    },
    [prior],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ marginTop: 12, display: "flex", gap: 10, alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 11 }}>prior</span>
        <input
          type="range"
          min="0.01"
          max="0.7"
          step="0.01"
          value={prior}
          onChange={function (e) {
            setPrior(Number(e.target.value));
          }}
          style={{ flex: 1, accentColor: "#DB2777" }}
        />
        <span style={{ color: "#F9A8D4", fontFamily: "monospace", fontSize: 12, minWidth: 36 }}>{prior.toFixed(2)}</span>
      </div>
    </div>
  );
}

export function SamplingVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var pop = [];
    var i;
    for (i = 0; i < 90; i++) {
      pop.push({
        x: 24 + (i % 15) * 20,
        y: 52 + Math.floor(i / 15) * 28,
      });
    }
    var selected = {};
    for (i = 0; i < 20; i++) {
      var idx = Math.floor(((Math.sin(i * 1.7 + t * 0.8) + 1) / 2) * 89);
      selected[idx] = true;
    }

    for (i = 0; i < pop.length; i++) {
      drawDot(
        ctx,
        pop[i].x,
        pop[i].y,
        3,
        selected[i] ? "#22C55E" : "rgba(255,255,255,0.22)",
      );
    }

    drawArrow(ctx, w / 2 - 35, h / 2 + 24, w / 2 + 35, h / 2 + 24, "rgba(255,255,255,0.45)", 2.3);
    drawRoundRect(ctx, w - 130, h / 2 - 4, 90, 64, 10);
    ctx.fillStyle = "rgba(34,197,94,0.18)";
    ctx.fill();
    ctx.strokeStyle = "#86EFAC";
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, w - 130, h / 2 - 4, 90, 64, 10);
    ctx.stroke();
    drawText(ctx, "sample", w - 105, h / 2 + 30, "#86EFAC", 12);

    drawText(ctx, "Sampling from a population", 10, 22, "#86EFAC", 13);
    drawText(ctx, "Random subset drives estimator variability", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function BootstrapVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var original = [2, 5, 7, 9, 11, 14];
    var B = 30;
    var means = [];
    var i;
    var j;
    for (i = 0; i < B; i++) {
      var m = 0;
      for (j = 0; j < original.length; j++) {
        var idx = Math.floor(((Math.sin(i * 1.3 + j * 2.1 + t * 0.8) + 1) / 2) * (original.length - 1));
        m += original[idx];
      }
      means.push(m / original.length);
    }

    var min = Math.min.apply(null, means);
    var max = Math.max.apply(null, means);
    for (i = 0; i < means.length; i++) {
      var x = 26 + ((means[i] - min) / (max - min + 1e-6)) * (w - 52);
      var y = 70 + (i % 12) * 18;
      drawDot(ctx, x, y, 2.6, "rgba(34,197,94,0.8)");
    }

    drawText(ctx, "Bootstrap estimate distribution", 10, 22, "#86EFAC", 13);
    drawText(ctx, "Resample with replacement to get uncertainty", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ConfidenceVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var trueMu = w / 2;
    ctx.strokeStyle = "rgba(190,242,100,0.8)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(trueMu, 18);
    ctx.lineTo(trueMu, h - 18);
    ctx.stroke();

    var i;
    for (i = 0; i < 14; i++) {
      var y = 28 + i * 20;
      var center = trueMu + Math.sin(i * 1.4 + t * 0.7) * 42;
      var half = 26 + (Math.sin(i * 0.9 + t * 0.5) + 1) * 9;
      var covers = center - half <= trueMu && trueMu <= center + half;
      ctx.strokeStyle = covers ? "rgba(101,163,13,0.85)" : "rgba(248,113,113,0.85)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(center - half, y);
      ctx.lineTo(center + half, y);
      ctx.stroke();
      drawDot(ctx, center, y, 2.6, covers ? "#BEF264" : "#FCA5A5");
    }

    drawText(ctx, "Repeated confidence intervals", 10, 22, "#BEF264", 13);
    drawText(ctx, "Green intervals cover true parameter line", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function HypothesisVis() {
  var draw = useCallback(function (ctx, w, h) {
    var cx = w / 2;
    var base = h - 42;
    var sigma = 56;
    var crit = 1.8;

    ctx.strokeStyle = "rgba(253,164,175,0.9)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    var x;
    for (x = -150; x <= 150; x += 2) {
      var y = Math.exp(-(x * x) / (2 * sigma * sigma)) * 110;
      if (x === -150) ctx.moveTo(cx + x, base - y);
      else ctx.lineTo(cx + x, base - y);
    }
    ctx.stroke();

    var cxCrit = cx + crit * 40;
    ctx.fillStyle = "rgba(244,63,94,0.25)";
    ctx.beginPath();
    ctx.moveTo(cxCrit, base);
    for (x = crit * 40; x <= 150; x += 2) {
      y = Math.exp(-(x * x) / (2 * sigma * sigma)) * 110;
      ctx.lineTo(cx + x, base - y);
    }
    ctx.lineTo(cx + 150, base);
    ctx.closePath();
    ctx.fill();

    drawText(ctx, "Null distribution with rejection region", 10, 22, "#FDA4AF", 12);
    drawText(ctx, "Reject H0 if statistic enters shaded tail", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function PValueVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var base = h - 42;
    var sigma = 56;
    var zObs = 0.6 + (Math.sin(t * 0.55) + 1) * 1.4;
    var xObs = zObs * 40;

    ctx.strokeStyle = "rgba(244,63,94,0.9)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    var x;
    for (x = -150; x <= 150; x += 2) {
      var y = Math.exp(-(x * x) / (2 * sigma * sigma)) * 110;
      if (x === -150) ctx.moveTo(cx + x, base - y);
      else ctx.lineTo(cx + x, base - y);
    }
    ctx.stroke();

    ctx.fillStyle = "rgba(244,63,94,0.28)";
    ctx.beginPath();
    ctx.moveTo(cx + xObs, base);
    for (x = xObs; x <= 150; x += 2) {
      y = Math.exp(-(x * x) / (2 * sigma * sigma)) * 110;
      ctx.lineTo(cx + x, base - y);
    }
    ctx.lineTo(cx + 150, base);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = "#FDA4AF";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(cx + xObs, base);
    ctx.lineTo(cx + xObs, base - 120);
    ctx.stroke();

    drawText(ctx, "Observed statistic", cx + xObs + 6, base - 124, "#FDA4AF", 10);
    drawText(ctx, "P-value = right-tail area", 10, 22, "#FDA4AF", 13);
    drawText(ctx, "Smaller tail area means stronger tension with H0", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function TTestVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var leftX = w * 0.3;
    var rightX = w * 0.7;
    var cy = h / 2 + 30;
    var m1 = cy - 60 + Math.sin(t * 0.7) * 6;
    var m2 = cy - 90 + Math.cos(t * 0.5) * 6;

    ctx.fillStyle = "rgba(220,38,38,0.24)";
    drawRoundRect(ctx, leftX - 34, m1, 68, cy - m1, 8);
    ctx.fill();
    ctx.fillStyle = "rgba(252,165,165,0.3)";
    drawRoundRect(ctx, rightX - 34, m2, 68, cy - m2, 8);
    ctx.fill();

    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(leftX, m1 - 22);
    ctx.lineTo(leftX, m1 + 22);
    ctx.moveTo(rightX, m2 - 22);
    ctx.lineTo(rightX, m2 + 22);
    ctx.stroke();

    drawArrow(ctx, leftX, m1 - 26, rightX, m2 - 26, "#FCA5A5", 2.2);
    drawText(ctx, "mean diff / SE", (leftX + rightX) / 2 - 26, m2 - 34, "#FCA5A5", 10.8);
    drawText(ctx, "t-statistic compares mean gap to uncertainty", 10, 22, "#FCA5A5", 11.4);
    drawText(ctx, "Large gap relative to SE -> larger |t|", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ANOVAVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var groups = [w * 0.22, w * 0.5, w * 0.78];
    var centers = [h * 0.62, h * 0.5, h * 0.37];
    var i;
    var j;

    for (i = 0; i < groups.length; i++) {
      for (j = 0; j < 14; j++) {
        var x = groups[i] + (Math.sin(j * 2.2 + i) * 16);
        var y = centers[i] + (Math.cos(j * 1.7 + t * 0.9) * 16);
        drawDot(ctx, x, y, 2.6, "rgba(252,165,165,0.78)");
      }
      ctx.strokeStyle = "#FCA5A5";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(groups[i] - 24, centers[i]);
      ctx.lineTo(groups[i] + 24, centers[i]);
      ctx.stroke();
    }

    drawText(ctx, "Between-group vs within-group variation", 10, 22, "#FCA5A5", 11.6);
    drawText(ctx, "ANOVA F rises when group centers separate", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function LinearRegVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var slope = 0.55 + Math.sin(t * 0.5) * 0.12;
    var intercept = -8;
    var i;

    for (i = 0; i < 40; i++) {
      var x = -130 + i * 7;
      var y = slope * x + intercept + Math.sin(i * 1.7 + t) * 18;
      drawDot(ctx, cx + x, cy - y, 2.8, "rgba(103,232,249,0.8)");

      var yhat = slope * x + intercept;
      ctx.strokeStyle = "rgba(103,232,249,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx + x, cy - y);
      ctx.lineTo(cx + x, cy - yhat);
      ctx.stroke();
    }

    ctx.strokeStyle = "#0891B2";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(cx - 150, cy - (slope * -150 + intercept));
    ctx.lineTo(cx + 150, cy - (slope * 150 + intercept));
    ctx.stroke();

    drawText(ctx, "OLS best-fit line", 10, 22, "#67E8F9", 13);
    drawText(ctx, "Line minimizes squared vertical residuals", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function LogisticVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var left = 24;
    var right = w - 20;
    var bottom = h - 30;
    var top = 24;
    var width = right - left;
    var height = bottom - top;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();

    var k = 1.1 + Math.sin(t * 0.5) * 0.25;
    var x0 = 0;
    ctx.strokeStyle = "#0F766E";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    var i;
    for (i = 0; i <= 220; i++) {
      var x = -6 + (i / 220) * 12;
      var p = 1 / (1 + Math.exp(-k * (x - x0)));
      var sx = left + (i / 220) * width;
      var sy = bottom - p * height;
      if (i === 0) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    var thresholdX = left + width * 0.5;
    ctx.strokeStyle = "rgba(94,234,212,0.5)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(thresholdX, bottom);
    ctx.lineTo(thresholdX, top);
    ctx.stroke();
    ctx.setLineDash([]);

    drawText(ctx, "Sigmoid probability curve", 10, 22, "#5EEAD4", 13);
    drawText(ctx, "Linear score maps to bounded probability", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function RandomVariableVis() {
  var draw = useCallback(function (ctx, w, h) {
    var y = h / 2;

    drawRoundRect(ctx, 24, y - 30, 100, 60, 10);
    ctx.fillStyle = "rgba(13,148,136,0.2)";
    ctx.fill();
    ctx.strokeStyle = "#5EEAD4";
    ctx.lineWidth = 1.5;
    drawRoundRect(ctx, 24, y - 30, 100, 60, 10);
    ctx.stroke();

    drawRoundRect(ctx, w - 124, y - 30, 100, 60, 10);
    ctx.fillStyle = "rgba(15,118,110,0.22)";
    ctx.fill();
    ctx.strokeStyle = "#5EEAD4";
    drawRoundRect(ctx, w - 124, y - 30, 100, 60, 10);
    ctx.stroke();

    drawArrow(ctx, 126, y, w - 126, y, "#5EEAD4", 2.8);
    drawText(ctx, "Omega", 54, y + 5, "#5EEAD4", 12);
    drawText(ctx, "R", w - 78, y + 5, "#5EEAD4", 12);
    drawText(ctx, "X", w / 2 - 4, y - 8, "#5EEAD4", 12);
    drawText(ctx, "Random variable as mapping", 10, 22, "#5EEAD4", 12);
    drawText(ctx, "X: Omega -> R", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ExpectationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2 + 36;
    var xs = [-3, -1, 0, 2, 4];
    var ps = [0.12, 0.2, 0.28, 0.25, 0.15];
    var scale = 28;
    var i;
    var ex = 0;
    for (i = 0; i < xs.length; i++) ex += xs[i] * ps[i];

    ctx.strokeStyle = "rgba(255,255,255,0.25)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(22, cy);
    ctx.lineTo(w - 22, cy);
    ctx.stroke();

    for (i = 0; i < xs.length; i++) {
      var x = cx + xs[i] * scale;
      var s = 5 + ps[i] * 12;
      drawDot(ctx, x, cy - 5 - Math.sin(t + i) * 1.3, s * 0.5, "rgba(15,118,110,0.85)");
      drawText(ctx, String(xs[i]), x - 4, cy + 18, "rgba(255,255,255,0.5)", 10);
    }

    var exX = cx + ex * scale;
    ctx.strokeStyle = "#5EEAD4";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(exX, cy - 44);
    ctx.lineTo(exX, cy + 44);
    ctx.stroke();

    drawText(ctx, "E[X]", exX + 4, cy - 48, "#5EEAD4", 11);
    drawText(ctx, "Probability-weighted balance point", 10, 22, "#5EEAD4", 11.5);
    drawText(ctx, "E[X] ≈ " + ex.toFixed(2), 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function PMFVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var p = [0.08, 0.16, 0.22, 0.26, 0.16, 0.12];
    var i;
    var bw = (w - 54) / p.length;
    var max = 0.28;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(24, h - 28);
    ctx.lineTo(w - 18, h - 28);
    ctx.stroke();

    for (i = 0; i < p.length; i++) {
      var v = p[i] + Math.sin(t * 0.5 + i * 0.7) * 0.01;
      var bh = (v / max) * 190;
      ctx.fillStyle = "rgba(6,182,212,0.82)";
      drawRoundRect(ctx, 28 + i * bw, h - 28 - bh, bw - 6, bh, 6);
      ctx.fill();
      drawText(ctx, String(i), 28 + i * bw + 10, h - 16, "rgba(255,255,255,0.55)", 10);
      drawText(ctx, v.toFixed(2), 28 + i * bw + 3, h - 34 - bh, "rgba(255,255,255,0.5)", 9);
    }

    drawText(ctx, "PMF: mass at each value", 10, 22, "#67E8F9", 12.5);
    drawText(ctx, "Bars encode p(X=x)", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function CDFVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var left = 24;
    var right = w - 22;
    var bottom = h - 28;
    var top = 26;
    var pmf = [0.08, 0.16, 0.22, 0.26, 0.16, 0.12];
    var c = 0;
    var i;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();

    ctx.strokeStyle = "#0891B2";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (i = 0; i < pmf.length; i++) {
      var x = left + (i / (pmf.length - 1)) * (right - left);
      var y = bottom - c * (bottom - top);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      c += pmf[i];
      var y2 = bottom - c * (bottom - top);
      ctx.lineTo(x, y2);
    }
    ctx.lineTo(right, top);
    ctx.stroke();

    drawText(ctx, "CDF accumulates probability", 10, 22, "#67E8F9", 12.5);
    drawText(ctx, "F(x)=P(X<=x)", 10, h - 16, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function ConditionalProbVis() {
  var draw = useCallback(function (ctx, w, h) {
    var cx = w / 2;
    var cy = h / 2;
    var r = 68;
    var dx = 34;

    ctx.fillStyle = "rgba(14,165,233,0.26)";
    ctx.beginPath();
    ctx.arc(cx - dx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(6,182,212,0.26)";
    ctx.beginPath();
    ctx.arc(cx + dx, cy, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(125,211,252,0.85)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx - dx, cy, r, 0, Math.PI * 2);
    ctx.arc(cx + dx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    drawText(ctx, "A", cx - dx - 34, cy - 2, "#7DD3FC", 13);
    drawText(ctx, "B", cx + dx + 24, cy - 2, "#7DD3FC", 13);
    drawText(ctx, "Conditional probability", 10, 22, "#7DD3FC", 12.5);
    drawText(ctx, "P(A|B)=overlap/B", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function IndependenceVis() {
  var st = useState(true);
  var independent = st[0];
  var setIndependent = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var left = 36;
      var top = 56;
      var cw = (w - 72) / 2;
      var ch = (h - 92) / 2;

      var pA = 0.5 + Math.sin(t * 0.4) * 0.08;
      var pB = 0.45 + Math.cos(t * 0.5) * 0.08;
      var pAB = independent ? pA * pB : pA * pB + 0.12;

      var cells = [pAB, pA - pAB, pB - pAB, 1 - pA - pB + pAB];
      var labels = ["A∩B", "A∩B^c", "A^c∩B", "A^c∩B^c"];
      var i;
      for (i = 0; i < 4; i++) {
        var x = left + (i % 2) * cw;
        var y = top + (i >= 2 ? ch : 0);
        ctx.fillStyle = i === 0 ? "rgba(2,132,199,0.42)" : "rgba(125,211,252,0.16)";
        drawRoundRect(ctx, x, y, cw - 8, ch - 8, 8);
        ctx.fill();
        drawText(ctx, labels[i], x + 8, y + 18, "rgba(255,255,255,0.6)", 10);
        drawText(ctx, cells[i].toFixed(2), x + 8, y + 36, "#7DD3FC", 12);
      }

      drawText(ctx, independent ? "P(A∩B)=P(A)P(B)" : "Dependence: product rule fails", 10, 22, "#7DD3FC", 12.2);
      drawText(ctx, "Independence via factorization", 10, h - 20, "rgba(255,255,255,0.5)", 11);
    },
    [independent],
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setIndependent(true);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: independent ? "#0284C7" : "rgba(255,255,255,0.08)",
            color: independent ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Independent
        </button>
        <button
          onClick={function () {
            setIndependent(false);
          }}
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: !independent ? "#0284C7" : "rgba(255,255,255,0.08)",
            color: !independent ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          Dependent
        </button>
      </div>
    </div>
  );
}

export function LikelihoodVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var left = 26;
    var right = w - 22;
    var bottom = h - 28;
    var top = 26;
    var pHat = 0.2 + (Math.sin(t * 0.5) + 1) * 0.3;

    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, top);
    ctx.stroke();

    ctx.strokeStyle = "#EC4899";
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    var i;
    for (i = 0; i <= 220; i++) {
      var p = i / 220;
      var l = Math.exp(-Math.pow((p - pHat) / 0.14, 2));
      var x = left + p * (right - left);
      var y = bottom - l * (bottom - top - 12);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    var xHat = left + pHat * (right - left);
    ctx.strokeStyle = "#F9A8D4";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(xHat, bottom);
    ctx.lineTo(xHat, top + 8);
    ctx.stroke();

    drawText(ctx, "Likelihood over parameter", 10, 22, "#F9A8D4", 13);
    drawText(ctx, "Peak = best-supported theta", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function CredibleIntervalVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var left = 24;
    var right = w - 22;
    var base = h - 30;
    var top = 24;
    var center = 0.5 + Math.sin(t * 0.45) * 0.08;
    var width = 0.18;

    ctx.strokeStyle = "#F472B6";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    var i;
    for (i = 0; i <= 220; i++) {
      var xNorm = i / 220;
      var yVal = Math.exp(-Math.pow((xNorm - center) / 0.16, 2));
      var x = left + xNorm * (right - left);
      var y = base - yVal * (base - top - 8);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    var a = Math.max(0, center - width);
    var b = Math.min(1, center + width);
    ctx.fillStyle = "rgba(244,114,182,0.25)";
    ctx.beginPath();
    var x;
    for (x = a; x <= b; x += 0.005) {
      var yy = Math.exp(-Math.pow((x - center) / 0.16, 2));
      var sx = left + x * (right - left);
      var sy = base - yy * (base - top - 8);
      if (x === a) ctx.moveTo(sx, sy);
      else ctx.lineTo(sx, sy);
    }
    ctx.lineTo(left + b * (right - left), base);
    ctx.lineTo(left + a * (right - left), base);
    ctx.closePath();
    ctx.fill();

    drawText(ctx, "95% posterior mass interval", 10, 22, "#F9A8D4", 12);
    drawText(ctx, "Credible interval from posterior", 10, h - 20, "rgba(255,255,255,0.5)", 11);
  }, []);

  return <Canvas2D draw={draw} />;
}

export function PosteriorPredictiveVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cx = w / 2;
    var base = h - 34;
    var i;
    for (i = 0; i < 8; i++) {
      var mu = -70 + i * 20 + Math.sin(t * 0.4 + i) * 6;
      var sigma = 28 + i * 1.2;
      ctx.strokeStyle = "rgba(249,168,212,0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      var x;
      for (x = -150; x <= 150; x += 3) {
        var y = Math.exp(-Math.pow((x - mu) / sigma, 2)) * 38;
        if (x === -150) ctx.moveTo(cx + x, base - y);
        else ctx.lineTo(cx + x, base - y);
      }
      ctx.stroke();
    }

    ctx.strokeStyle = "#BE185D";
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    var x2;
    for (x2 = -150; x2 <= 150; x2 += 2) {
      var y2 = Math.exp(-Math.pow((x2 + 12) / 42, 2)) * 72;
      if (x2 === -150) ctx.moveTo(cx + x2, base - y2);
      else ctx.lineTo(cx + x2, base - y2);
    }
    ctx.stroke();

    drawText(ctx, "Posterior predictive mixture", 10, 22, "#F9A8D4", 12.2);
    drawText(ctx, "Light curves: parameter draws, bold: averaged predictive", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);

  return <Canvas2D draw={draw} />;
}
