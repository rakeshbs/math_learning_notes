import { useCallback, useState } from "react";
import { Canvas2D } from "../components/Canvas2D";
import { drawGrid, drawArrow, drawText, drawDot, drawRoundRect } from "../drawing/helpers";
export function LinIndepVis() {
  var st = useState(false);
  var dep = st[0];
  var setDep = st[1];
  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;
      var cy = h / 2;
      if (!dep) {
        var a = t * 0.3;
        var v1x = Math.cos(a) * 80;
        var v1y = Math.sin(a) * 80;
        var v2x = Math.cos(a + 2.1) * 65;
        var v2y = Math.sin(a + 2.1) * 65;
        drawArrow(ctx, cx, cy, cx + v1x, cy - v1y, "#F97316", 3);
        drawArrow(ctx, cx, cy, cx + v2x, cy - v2y, "#FDBA74", 3);
        drawText(ctx, "v1", cx + v1x + 8, cy - v1y, "#F97316", 14);
        drawText(ctx, "v2", cx + v2x + 8, cy - v2y, "#FDBA74", 14);
        drawText(
          ctx,
          "Independent: no scalar c makes v2 = c*v1",
          10,
          h - 14,
          "rgba(255,255,255,0.5)",
          11,
        );
      } else {
        var a2 = t * 0.3;
        var dx = Math.cos(a2);
        var dy = Math.sin(a2);
        ctx.strokeStyle = "rgba(249,115,22,0.2)";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(cx - dx * 160, cy + dy * 160);
        ctx.lineTo(cx + dx * 160, cy - dy * 160);
        ctx.stroke();
        ctx.setLineDash([]);
        drawArrow(ctx, cx, cy, cx + dx * 90, cy - dy * 90, "#F97316", 3);
        drawArrow(ctx, cx, cy, cx + dx * 55, cy - dy * 55, "#FDBA74", 3);
        drawText(ctx, "v1", cx + dx * 90 + 8, cy - dy * 90, "#F97316", 14);
        drawText(
          ctx,
          "v2=0.6*v1",
          cx + dx * 55 + 8,
          cy - dy * 55 - 14,
          "#FDBA74",
          12,
        );
        drawText(
          ctx,
          "Dependent: v2 is a scaled copy of v1",
          10,
          h - 14,
          "rgba(255,255,255,0.5)",
          11,
        );
      }
    },
    [dep],
  );
  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          onClick={function () {
            setDep(false);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: !dep ? "#F97316" : "rgba(255,255,255,0.08)",
            color: !dep ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Independent
        </button>
        <button
          onClick={function () {
            setDep(true);
          }}
          style={{
            padding: "6px 16px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            background: dep ? "#F97316" : "rgba(255,255,255,0.08)",
            color: dep ? "#fff" : "rgba(255,255,255,0.5)",
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Dependent
        </button>
      </div>
    </div>
  );
}

export function BasisVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var s = 60;
    drawArrow(ctx, cx, cy, cx + s, cy, "rgba(255,255,255,0.2)", 1.5);
    drawArrow(ctx, cx, cy, cx, cy - s, "rgba(255,255,255,0.2)", 1.5);
    drawText(ctx, "e1", cx + s + 5, cy + 15, "rgba(255,255,255,0.25)", 11);
    drawText(ctx, "e2", cx + 8, cy - s - 5, "rgba(255,255,255,0.25)", 11);
    var a = 0.4 + Math.sin(t * 0.3) * 0.15;
    var b1x = Math.cos(a) * s;
    var b1y = Math.sin(a) * s;
    var b2x = Math.cos(a + Math.PI / 2 + 0.3) * s * 0.8;
    var b2y = Math.sin(a + Math.PI / 2 + 0.3) * s * 0.8;
    drawArrow(ctx, cx, cy, cx + b1x, cy - b1y, "#14B8A6", 3);
    drawArrow(ctx, cx, cy, cx + b2x, cy - b2y, "#5EEAD4", 3);
    drawText(ctx, "b1", cx + b1x + 8, cy - b1y, "#14B8A6", 14);
    drawText(ctx, "b2", cx + b2x + 8, cy - b2y, "#5EEAD4", 14);
    var c1 = 1.5;
    var c2 = 0.8;
    var vx = c1 * b1x + c2 * b2x;
    var vy = c1 * b1y + c2 * b2y;
    ctx.strokeStyle = "rgba(20,184,166,0.2)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(cx + c1 * b1x, cy - c1 * b1y);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + c2 * b2x, cy - c2 * b2y);
    ctx.lineTo(cx + vx, cy - vy);
    ctx.stroke();
    ctx.setLineDash([]);
    drawDot(ctx, cx + vx, cy - vy, 5, "#fff");
    drawText(
      ctx,
      "v = 1.5b1 + 0.8b2",
      cx + vx + 8,
      cy - vy,
      "rgba(255,255,255,0.7)",
      11,
    );
    drawText(ctx, "dim = 2 (need 2 basis vectors)", 10, 22, "#5EEAD4", 12);
    drawText(
      ctx,
      "Any basis spans the whole space minimally",
      10,
      h - 14,
      "rgba(255,255,255,0.5)",
      11,
    );
  }, []);
  return <Canvas2D draw={draw} />;
}
