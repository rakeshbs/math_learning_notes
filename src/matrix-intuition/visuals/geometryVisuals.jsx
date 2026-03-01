import { useCallback, useState } from "react";
import { Canvas2D } from "../components/Canvas2D";
import { drawGrid, drawArrow, drawText, drawDot, drawRoundRect } from "../drawing/helpers";
export function OrthogonalVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var a = t * 0.4;
    var v1x = Math.cos(a) * 90;
    var v1y = Math.sin(a) * 90;
    var v2x = Math.cos(a + Math.PI / 2) * 70;
    var v2y = Math.sin(a + Math.PI / 2) * 70;
    drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#06D6A0", 3);
    drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#34D399", 3);
    var sq = 12;
    var n1x = (v1x / 90) * sq;
    var n1y = (-v1y / 90) * sq;
    var n2x = (v2x / 70) * sq;
    var n2y = (-v2y / 70) * sq;
    ctx.strokeStyle = "rgba(6,214,160,0.5)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx + n1x, cy + n1y);
    ctx.lineTo(cx + n1x + n2x, cy + n1y + n2y);
    ctx.lineTo(cx + n2x, cy + n2y);
    ctx.stroke();
    drawText(ctx, "u", cx + v1x + 8, cy - v1y, "#06D6A0", 14);
    drawText(ctx, "v", cx + v2x + 8, cy - v2y, "#34D399", 14);
    var dot = v1x * v2x + v1y * v2y;
    drawText(ctx, "u.v = " + dot.toFixed(1) + " = 0", 10, 22, "#06D6A0", 14);
    drawText(
      ctx,
      "90 degrees: dot product = 0",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ProjectionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var la = 0.3;
    var dx = Math.cos(la);
    var dy = Math.sin(la);
    ctx.strokeStyle = "rgba(245,158,11,0.3)";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(cx - dx * 160, cy + dy * 160);
    ctx.lineTo(cx + dx * 160, cy - dy * 160);
    ctx.stroke();
    ctx.setLineDash([]);
    var vLen = 100;
    var vx = Math.cos(0.8 + t * 0.3) * vLen;
    var vy = Math.sin(0.8 + t * 0.3) * vLen;
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#FCD34D", 2.5);
    var projS = vx * dx + vy * dy;
    var ppx = dx * projS;
    var ppy = dy * projS;
    drawArrow(ctx, cx, cy, cx + ppx, cy - ppy, "#F59E0B", 3.5);
    ctx.strokeStyle = "rgba(252,211,77,0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(cx + vx, cy - vy);
    ctx.lineTo(cx + ppx, cy - ppy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDot(ctx, cx + ppx, cy - ppy, 4, "#F59E0B");
    drawText(ctx, "v", cx + vx + 8, cy - vy, "#FCD34D", 13);
    drawText(ctx, "proj", cx + ppx + 8, cy - ppy + 14, "#F59E0B", 13);
    drawText(
      ctx,
      "Shadow of v onto the line",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NormVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var vx = Math.cos(t * 0.5) * 100;
    var vy = Math.sin(t * 0.7) * 80;
    var l2 = Math.sqrt(vx * vx + vy * vy);
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, l2, 0, Math.PI * 2);
    ctx.stroke();
    var l1 = Math.abs(vx) + Math.abs(vy);
    ctx.strokeStyle = "rgba(252,165,165,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx, cy - l1);
    ctx.lineTo(cx + l1, cy);
    ctx.lineTo(cx, cy + l1);
    ctx.lineTo(cx - l1, cy);
    ctx.closePath();
    ctx.stroke();
    drawArrow(ctx, cx, cy, cx + vx, cy - vy, "#EF4444", 3);
    ctx.strokeStyle = "rgba(239,68,68,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + vx, cy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - vy);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawText(ctx, "||v||2 = " + l2.toFixed(1), 10, 22, "#EF4444", 14);
    drawText(ctx, "||v||1 = " + l1.toFixed(1), 10, 40, "#FCA5A5", 12);
    drawText(
      ctx,
      "Circle = L2 ball, Diamond = L1 ball",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}
