import { useCallback, useState } from "react";
import { Canvas2D } from "../components/Canvas2D";
import { drawGrid, drawArrow, drawText, drawDot, drawRoundRect } from "../drawing/helpers";
export function PosDefVis() {
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
        ex = (Math.cos(a2) * sc) / Math.sqrt(l1);
        ey = (Math.sin(a2) * sc) / Math.sqrt(l2);
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
    var ppx = (Math.cos(pa) * pr) / Math.sqrt(l1);
    var ppy = (Math.sin(pa) * pr) / Math.sqrt(l2);
    var rpx = ppx * Math.cos(angle) - ppy * Math.sin(angle);
    var rpy = ppx * Math.sin(angle) + ppy * Math.cos(angle);
    drawDot(ctx, cx + rpx, cy - rpy, 5, "#10B981");
    drawDot(ctx, cx, cy, 4, "#6EE7B7");
    drawText(ctx, "lambda1 = 2 > 0", 10, 22, "#10B981", 13);
    drawText(ctx, "lambda2 = 0.8 > 0", 10, 40, "#6EE7B7", 13);
    drawText(
      ctx,
      "All lambda > 0: bowl shape, always positive",
      10,
      h - 20,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SymmetricVis() {
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
        ctx.fillStyle = isDiag
          ? "rgba(236,72,153,0.35)"
          : isHigh
            ? "rgba(249,168,212," + (0.3 + pulse * 0.3) + ")"
            : "rgba(255,255,255,0.06)";
        drawRoundRect(ctx, x, y, cs, cs, 8);
        ctx.fill();
        if (isHigh) {
          ctx.strokeStyle = "rgba(249,168,212," + (0.5 + pulse * 0.5) + ")";
          ctx.lineWidth = 2;
          drawRoundRect(ctx, x, y, cs, cs, 8);
          ctx.stroke();
        }
        ctx.fillStyle = isDiag
          ? "#EC4899"
          : isHigh
            ? "#F9A8D4"
            : "rgba(255,255,255,0.5)";
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
    drawText(
      ctx,
      "A = A^T: mirror across diagonal",
      10,
      h - 30,
      "rgba(255,255,255,0.5)",
      11,
    );
    drawText(
      ctx,
      "a[" +
        currentPair[0] +
        "] = a[" +
        currentPair[1] +
        "] = " +
        vals[currentPair[0][0]][currentPair[0][1]],
      10,
      h - 20,
      "#F9A8D4",
      12,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}
