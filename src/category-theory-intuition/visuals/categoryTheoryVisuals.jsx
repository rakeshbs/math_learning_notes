import { useCallback, useState } from "react";
import { Canvas2D } from "../../matrix-intuition/components/Canvas2D";
import {
  drawGrid,
  drawText,
  drawArrow,
  drawDot,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

// ─── shared helpers ───────────────────────────────────────────────────────────

function drawObj(ctx, x, y, label, color, r) {
  var R = r || 18;
  ctx.beginPath();
  ctx.arc(x, y, R, 0, Math.PI * 2);
  ctx.fillStyle = color || "#6366F1";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = "#fff";
  ctx.font = "700 12px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x, y);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

function drawCurvedArrow(ctx, x1, y1, x2, y2, bend, color, lw) {
  var mx = (x1 + x2) / 2 + bend * (y2 - y1) / Math.hypot(x2 - x1, y2 - y1);
  var my = (y1 + y2) / 2 - bend * (x2 - x1) / Math.hypot(x2 - x1, y2 - y1);
  ctx.strokeStyle = color || "rgba(255,255,255,0.7)";
  ctx.lineWidth = lw || 2;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(mx, my, x2, y2);
  ctx.stroke();
  // arrowhead
  var dx = x2 - mx;
  var dy = y2 - my;
  var len = Math.hypot(dx, dy);
  dx /= len; dy /= len;
  ctx.fillStyle = color || "rgba(255,255,255,0.7)";
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - 9 * dx + 4 * dy, y2 - 9 * dy - 4 * dx);
  ctx.lineTo(x2 - 9 * dx - 4 * dy, y2 - 9 * dy + 4 * dx);
  ctx.closePath();
  ctx.fill();
}

function labelBetween(ctx, x1, y1, x2, y2, text, color, offset) {
  var mx = (x1 + x2) / 2 + (offset || 0);
  var my = (y1 + y2) / 2 - 10;
  ctx.fillStyle = color || "rgba(255,255,255,0.8)";
  ctx.font = "600 10px monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, mx, my);
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
}

// ─── 1. Objects & Morphisms ───────────────────────────────────────────────────
export function ObjectsMorphismsVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var A = { x: w * 0.2, y: cy };
    var B = { x: w * 0.5, y: cy - 55 };
    var C = { x: w * 0.8, y: cy };
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.2);

    // Arrows
    drawArrow(ctx, A.x + 20, A.y, B.x - 16, B.y + 14, "rgba(165,180,252,0.9)", 2.2);
    drawArrow(ctx, B.x + 16, B.y + 14, C.x - 20, C.y, "rgba(165,180,252,0.9)", 2.2);
    // Composite arrow (curved below)
    drawCurvedArrow(ctx, A.x + 20, A.y + 8, C.x - 20, C.y + 8, 40, "#A5B4FC", 1.8);

    // Labels on arrows
    labelBetween(ctx, A.x + 20, A.y, B.x - 16, B.y + 14, "f", "#A5B4FC", 0);
    labelBetween(ctx, B.x + 16, B.y + 14, C.x - 20, C.y, "g", "#A5B4FC", 0);
    ctx.fillStyle = "#818CF8";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("g∘f", (A.x + C.x) / 2, cy + 52);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Objects
    drawObj(ctx, A.x, A.y, "A", "#6366F1");
    drawObj(ctx, B.x, B.y, "B", "#7C3AED");
    drawObj(ctx, C.x, C.y, "C", "#6366F1");

    // Pulse highlight on composite
    ctx.beginPath();
    ctx.arc((A.x + C.x) / 2, cy + 45, 6 + pulse * 4, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(165,180,252," + (0.1 + 0.1 * pulse) + ")";
    ctx.fill();

    drawText(ctx, "Objects & Morphisms", 10, 22, "#A5B4FC", 13);
    drawText(ctx, "Arrows compose: g∘f means 'f first, then g'", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 2. Categories ────────────────────────────────────────────────────────────
export function CategoriesVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    // Draw a small category with 4 objects and several morphisms
    var cx = w / 2;
    var cy = h / 2;
    var pts = [
      { x: cx - 90, y: cy - 45, label: "A", color: "#6366F1" },
      { x: cx + 90, y: cy - 45, label: "B", color: "#7C3AED" },
      { x: cx + 90, y: cy + 45, label: "C", color: "#8B5CF6" },
      { x: cx - 90, y: cy + 45, label: "D", color: "#6366F1" },
    ];

    // Morphisms
    var arrows = [
      [0, 1, "f"], [1, 2, "g"], [0, 2, "g∘f"], [0, 3, "h"], [3, 2, "k"], [0, 2, ""]
    ];
    var colors = ["#A5B4FC", "#C4B5FD", "#818CF8", "#A5B4FC", "#C4B5FD"];
    arrows.slice(0, 5).forEach(function (arr, i) {
      var p1 = pts[arr[0]];
      var p2 = pts[arr[1]];
      var R = 18;
      var dx = p2.x - p1.x;
      var dy = p2.y - p1.y;
      var len = Math.hypot(dx, dy);
      var sx = p1.x + dx / len * R;
      var sy = p1.y + dy / len * R;
      var ex = p2.x - dx / len * R;
      var ey = p2.y - dy / len * R;
      var bend = i === 2 ? -22 : 0;
      drawCurvedArrow(ctx, sx, sy, ex, ey, bend, colors[i], 1.8);
      var mx = (sx + ex) / 2 - (bend ? 18 : 0);
      var my = (sy + ey) / 2 - 12;
      ctx.fillStyle = colors[i];
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(arr[2], mx, my);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    });

    // Identity self-loops
    pts.forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p.x - 22, p.y - 22, 10, 0, Math.PI * 1.6);
      ctx.strokeStyle = "rgba(165,180,252,0.4)";
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    pts.forEach(function (p) { drawObj(ctx, p.x, p.y, p.label, p.color); });

    drawText(ctx, "Category — objects, morphisms, composition", 10, 22, "#A5B4FC", 13);
    drawText(ctx, "Every two composable arrows have a composite; every object has an identity", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 3. Composition ───────────────────────────────────────────────────────────
export function CompositionVis() {
  var st = useState(0);
  var step = st[0];
  var setStep = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var A = { x: w * 0.15, y: cy };
    var B = { x: w * 0.5, y: cy };
    var C = { x: w * 0.85, y: cy };
    var R = 18;

    var showF = step >= 0;
    var showG = step >= 1;
    var showComposite = step >= 2;

    if (showF) {
      drawArrow(ctx, A.x + R, A.y, B.x - R, B.y, "#A5B4FC", 2.5);
      labelBetween(ctx, A.x + R, A.y, B.x - R, B.y, "f: A→B", "#A5B4FC", 0);
    }
    if (showG) {
      drawArrow(ctx, B.x + R, B.y, C.x - R, C.y, "#C4B5FD", 2.5);
      labelBetween(ctx, B.x + R, B.y, C.x - R, C.y, "g: B→C", "#C4B5FD", 0);
    }
    if (showComposite) {
      drawCurvedArrow(ctx, A.x + R, A.y + 12, C.x - R, C.y + 12, 44, "#818CF8", 2.5);
      ctx.fillStyle = "#818CF8";
      ctx.font = "700 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("g∘f: A→C", (A.x + C.x) / 2, cy + 58);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    drawObj(ctx, A.x, A.y, "A", step >= 0 ? "#6366F1" : "#444");
    drawObj(ctx, B.x, B.y, "B", step >= 1 ? "#7C3AED" : "#444");
    drawObj(ctx, C.x, C.y, "C", step >= 2 ? "#8B5CF6" : "#444");

    drawText(ctx, "Composition", 10, 22, "#A5B4FC", 13);
    var msg = step === 0 ? "f maps A to B" : step === 1 ? "g maps B to C" : "g∘f maps A to C — the composite";
    drawText(ctx, msg, 10, h - 20, "rgba(255,255,255,0.6)", 10.5);
  }, [step]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["f only", "f and g", "g∘f composite"].map(function (label, i) {
          return (
            <button key={i} onClick={function () { setStep(i); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: step === i ? "#6366F1" : "rgba(255,255,255,0.08)", color: step === i ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 11, fontWeight: 600 }}>{label}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 4. Identity ──────────────────────────────────────────────────────────────
export function IdentityVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2 + 10;
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.5);

    // Object A with self-loop
    drawObj(ctx, cx, cy, "A", "#6366F1", 24);

    // Animated self-loop
    ctx.save();
    ctx.translate(cx, cy - 24);
    var radius = 20 + pulse * 2;
    ctx.strokeStyle = "#A5B4FC";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.arc(0, -radius, radius, Math.PI * 0.3, Math.PI * 2.7);
    ctx.stroke();
    // Arrowhead at end of arc
    ctx.fillStyle = "#A5B4FC";
    ctx.beginPath();
    ctx.moveTo(radius * Math.sin(Math.PI * 0.3) - 1, -radius + radius * (1 - Math.cos(Math.PI * 0.3)) - 6);
    ctx.lineTo(radius * Math.sin(Math.PI * 0.3) + 7, -radius + radius * (1 - Math.cos(Math.PI * 0.3)) + 2);
    ctx.lineTo(radius * Math.sin(Math.PI * 0.3) - 5, -radius + radius * (1 - Math.cos(Math.PI * 0.3)) + 4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "#C4B5FD";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("id_A", cx, cy - 58);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Show unit law equations
    var laws = ["f ∘ id_A = f", "id_B ∘ f = f"];
    laws.forEach(function (law, i) {
      ctx.fillStyle = "rgba(196,181,253,0.85)";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(law, cx, cy + 55 + i * 22);
    });
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Identity Morphism", 10, 22, "#A5B4FC", 13);
    drawText(ctx, "id_A loops on A; composing with id leaves any morphism unchanged", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 5. Isomorphism ───────────────────────────────────────────────────────────
export function IsomorphismVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var A = { x: w * 0.28, y: cy };
    var B = { x: w * 0.72, y: cy };
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.5);

    // Forward arrow
    drawCurvedArrow(ctx, A.x + 20, A.y - 10, B.x - 20, B.y - 10, -22, "#0EA5E9", 2.5);
    // Backward arrow
    drawCurvedArrow(ctx, B.x - 20, B.y + 10, A.x + 20, A.y + 10, -22, "#7DD3FC", 2.5);

    ctx.fillStyle = "#0EA5E9";
    ctx.font = "700 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f", (A.x + B.x) / 2, cy - 38);
    ctx.fillStyle = "#7DD3FC";
    ctx.fillText("f⁻¹", (A.x + B.x) / 2, cy + 38);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Identity loops (showing g∘f = id)
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "rgba(125,211,252," + (0.4 + 0.4 * pulse) + ")";
    ctx.fillText("f⁻¹∘f = id_A", A.x, cy + 50);
    ctx.fillStyle = "rgba(14,165,233," + (0.4 + 0.4 * pulse) + ")";
    ctx.fillText("f∘f⁻¹ = id_B", B.x, cy + 50);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, A.x, A.y, "A", "#0EA5E9");
    drawObj(ctx, B.x, B.y, "B", "#0284C7");

    drawText(ctx, "Isomorphism — perfectly reversible", 10, 22, "#7DD3FC", 13);
    drawText(ctx, "A ≅ B means they are 'the same' from the category's perspective", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 6. Monomorphism ─────────────────────────────────────────────────────────
export function MonoVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var C = { x: w * 0.15, y: cy };
    var A = { x: w * 0.5, y: cy };
    var B = { x: w * 0.85, y: cy };

    // Two arrows g and h from C to A
    drawCurvedArrow(ctx, C.x + 18, C.y - 8, A.x - 18, A.y - 8, -18, "#06B6D4", 2);
    drawCurvedArrow(ctx, C.x + 18, C.y + 8, A.x - 18, A.y + 8, 18, "#67E8F9", 2);

    ctx.fillStyle = "#06B6D4";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("g", (C.x + A.x) / 2 - 14, cy - 26);
    ctx.fillStyle = "#67E8F9";
    ctx.fillText("h", (C.x + A.x) / 2 - 14, cy + 26);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // f from A to B (mono)
    drawArrow(ctx, A.x + 18, A.y, B.x - 18, B.y, "#0891B2", 2.8);
    ctx.fillStyle = "#0891B2";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f ↪", (A.x + B.x) / 2, cy - 16);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Implication
    ctx.fillStyle = "rgba(6,182,212,0.85)";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f∘g = f∘h", w / 2, cy + 55);
    ctx.fillText("⟹  g = h", w / 2, cy + 74);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, C.x, C.y, "C", "#0891B2", 16);
    drawObj(ctx, A.x, A.y, "A", "#06B6D4");
    drawObj(ctx, B.x, B.y, "B", "#0891B2");

    drawText(ctx, "Monomorphism — left-cancellable (injective-like)", 10, 22, "#67E8F9", 13);
    drawText(ctx, "f is monic: equal composites f∘g=f∘h force g=h", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 7. Epimorphism ───────────────────────────────────────────────────────────
export function EpiVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var A = { x: w * 0.15, y: cy };
    var B = { x: w * 0.5, y: cy };
    var C = { x: w * 0.85, y: cy };

    // f from A to B (epi)
    drawArrow(ctx, A.x + 18, A.y, B.x - 18, B.y, "#0891B2", 2.8);
    ctx.fillStyle = "#0891B2";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f ↠", (A.x + B.x) / 2, cy - 16);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Two arrows g and h from B to C
    drawCurvedArrow(ctx, B.x + 18, B.y - 8, C.x - 18, C.y - 8, -18, "#06B6D4", 2);
    drawCurvedArrow(ctx, B.x + 18, B.y + 8, C.x - 18, C.y + 8, 18, "#67E8F9", 2);

    ctx.fillStyle = "#06B6D4";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("g", (B.x + C.x) / 2, cy - 26);
    ctx.fillStyle = "#67E8F9";
    ctx.fillText("h", (B.x + C.x) / 2, cy + 26);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Implication
    ctx.fillStyle = "rgba(6,182,212,0.85)";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("g∘f = h∘f", w / 2, cy + 55);
    ctx.fillText("⟹  g = h", w / 2, cy + 74);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, A.x, A.y, "A", "#0891B2");
    drawObj(ctx, B.x, B.y, "B", "#06B6D4");
    drawObj(ctx, C.x, C.y, "C", "#0891B2", 16);

    drawText(ctx, "Epimorphism — right-cancellable (surjective-like)", 10, 22, "#67E8F9", 13);
    drawText(ctx, "f is epic: equal composites g∘f=h∘f force g=h", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 8. Initial & Terminal Objects ────────────────────────────────────────────
export function TerminalVis() {
  var st = useState("terminal");
  var mode = st[0];
  var setMode = st[1];

  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.2);

    if (mode === "terminal") {
      // Terminal object: all objects arrow into 1
      var T = { x: w / 2, y: h / 2 };
      var sources = [
        { x: w * 0.15, y: h * 0.25, l: "A" },
        { x: w * 0.85, y: h * 0.25, l: "B" },
        { x: w * 0.15, y: h * 0.75, l: "C" },
        { x: w * 0.85, y: h * 0.75, l: "D" },
      ];

      sources.forEach(function (s) {
        var dx = T.x - s.x; var dy = T.y - s.y;
        var len = Math.hypot(dx, dy);
        drawArrow(ctx, s.x + dx / len * 18, s.y + dy / len * 18, T.x - dx / len * 26, T.y - dy / len * 26, "rgba(20,184,166,0.7)", 1.8);
        drawObj(ctx, s.x, s.y, s.l, "#0F766E", 16);
        // "∃!" label midpoint
        var mx = (s.x + T.x) / 2;
        var my = (s.y + T.y) / 2;
        ctx.fillStyle = "rgba(94,234,212,0.7)";
        ctx.font = "600 9px monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("∃!", mx, my);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      });

      // Terminal object (glowing)
      ctx.beginPath();
      ctx.arc(T.x, T.y, 26 + pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20,184,166," + (0.15 + 0.1 * pulse) + ")";
      ctx.fill();
      drawObj(ctx, T.x, T.y, "1", "#14B8A6", 22);

      drawText(ctx, "Terminal Object — unique arrow in from every object", 10, 22, "#5EEAD4", 13);
      drawText(ctx, "∃! unique arrow from every object to 1 (e.g. one-element set)", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      // Initial object: 0 arrows out to all
      var I = { x: w / 2, y: h / 2 };
      var targets = [
        { x: w * 0.15, y: h * 0.25, l: "A" },
        { x: w * 0.85, y: h * 0.25, l: "B" },
        { x: w * 0.15, y: h * 0.75, l: "C" },
        { x: w * 0.85, y: h * 0.75, l: "D" },
      ];

      ctx.beginPath();
      ctx.arc(I.x, I.y, 26 + pulse * 3, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(20,184,166," + (0.15 + 0.1 * pulse) + ")";
      ctx.fill();
      drawObj(ctx, I.x, I.y, "0", "#14B8A6", 22);

      targets.forEach(function (s) {
        var dx = s.x - I.x; var dy = s.y - I.y;
        var len = Math.hypot(dx, dy);
        drawArrow(ctx, I.x + dx / len * 26, I.y + dy / len * 26, s.x - dx / len * 18, s.y - dy / len * 18, "rgba(20,184,166,0.7)", 1.8);
        drawObj(ctx, s.x, s.y, s.l, "#0F766E", 16);
        var mx = (s.x + I.x) / 2;
        var my = (s.y + I.y) / 2;
        ctx.fillStyle = "rgba(94,234,212,0.7)";
        ctx.font = "600 9px monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText("∃!", mx, my);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      });

      drawText(ctx, "Initial Object — unique arrow out to every object", 10, 22, "#5EEAD4", 13);
      drawText(ctx, "∃! unique arrow from 0 to every object (e.g. empty set)", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [mode]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["terminal", "initial"].map(function (m) {
          return (
            <button key={m} onClick={function () { setMode(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: mode === m ? "#14B8A6" : "rgba(255,255,255,0.08)", color: mode === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 9. Products ──────────────────────────────────────────────────────────────
export function ProductVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var A = { x: cx - 120, y: cy + 50 };
    var B = { x: cx + 120, y: cy + 50 };
    var P = { x: cx, y: cy + 50 };
    var C = { x: cx, y: cy - 60 };

    // Dashed arrow from C to P (unique mediating)
    ctx.setLineDash([6, 4]);
    drawArrow(ctx, C.x, C.y + 18, P.x, P.y - 18, "rgba(16,185,129,0.7)", 1.8);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(110,231,183,0.8)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("∃! ⟨f,g⟩", cx + 22, cy - 5);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Projections from P
    drawArrow(ctx, P.x - 18, P.y, A.x + 18, A.y, "#10B981", 2.2);
    drawArrow(ctx, P.x + 18, P.y, B.x - 18, B.y, "#10B981", 2.2);

    // f and g from C
    drawArrow(ctx, C.x - 10, C.y + 14, A.x + 10, A.y - 12, "rgba(16,185,129,0.5)", 1.5);
    drawArrow(ctx, C.x + 10, C.y + 14, B.x - 10, B.y - 12, "rgba(16,185,129,0.5)", 1.5);

    ctx.fillStyle = "#6EE7B7";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("π₁", (P.x + A.x) / 2, cy + 28);
    ctx.fillText("π₂", (P.x + B.x) / 2, cy + 28);
    ctx.fillStyle = "rgba(110,231,183,0.6)";
    ctx.fillText("f", (C.x + A.x) / 2 - 16, (C.y + A.y) / 2);
    ctx.fillText("g", (C.x + B.x) / 2 + 16, (C.y + B.y) / 2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, A.x, A.y, "A", "#059669");
    drawObj(ctx, B.x, B.y, "B", "#059669");
    drawObj(ctx, P.x, P.y, "A×B", "#10B981", 22);
    drawObj(ctx, C.x, C.y, "C", "#047857");

    drawText(ctx, "Product A×B — universal pair with projections", 10, 22, "#6EE7B7", 13);
    drawText(ctx, "Any C with maps to A and B factors uniquely through A×B", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 10. Coproducts ───────────────────────────────────────────────────────────
export function CoproductVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var A = { x: cx - 120, y: cy - 50 };
    var B = { x: cx + 120, y: cy - 50 };
    var P = { x: cx, y: cy - 50 };
    var C = { x: cx, y: cy + 60 };

    // Injections into coproduct
    drawArrow(ctx, A.x + 18, A.y, P.x - 18, P.y, "#22C55E", 2.2);
    drawArrow(ctx, B.x - 18, B.y, P.x + 18, P.y, "#22C55E", 2.2);

    ctx.fillStyle = "#86EFAC";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("i₁", (A.x + P.x) / 2, cy - 68);
    ctx.fillText("i₂", (B.x + P.x) / 2, cy - 68);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Unique mediating from P to C
    ctx.setLineDash([6, 4]);
    drawArrow(ctx, P.x, P.y + 18, C.x, C.y - 18, "rgba(34,197,94,0.7)", 1.8);
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(134,239,172,0.8)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("∃! [f,g]", cx + 26, cy + 10);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // f and g from A,B to C
    drawArrow(ctx, A.x + 10, A.y + 12, C.x - 10, C.y - 14, "rgba(34,197,94,0.5)", 1.5);
    drawArrow(ctx, B.x - 10, B.y + 12, C.x + 10, C.y - 14, "rgba(34,197,94,0.5)", 1.5);

    ctx.fillStyle = "rgba(134,239,172,0.6)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("f", (A.x + C.x) / 2 - 16, (A.y + C.y) / 2);
    ctx.fillText("g", (B.x + C.x) / 2 + 16, (B.y + C.y) / 2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, A.x, A.y, "A", "#16A34A");
    drawObj(ctx, B.x, B.y, "B", "#16A34A");
    drawObj(ctx, P.x, P.y, "A+B", "#22C55E", 22);
    drawObj(ctx, C.x, C.y, "C", "#15803D");

    drawText(ctx, "Coproduct A+B — universal pair with injections", 10, 22, "#86EFAC", 13);
    drawText(ctx, "Maps from A and B to C factor uniquely through A+B", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 11. Pullbacks ────────────────────────────────────────────────────────────
export function PullbackVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var P = { x: cx - 80, y: cy - 55 };
    var A = { x: cx + 80, y: cy - 55 };
    var B = { x: cx - 80, y: cy + 55 };
    var C = { x: cx + 80, y: cy + 55 };

    // Pullback square
    drawArrow(ctx, P.x + 18, P.y, A.x - 18, A.y, "#65A30D", 2.2);
    drawArrow(ctx, P.x, P.y + 18, B.x, B.y - 18, "#65A30D", 2.2);
    drawArrow(ctx, A.x, A.y + 18, C.x, C.y - 18, "#84CC16", 2);
    drawArrow(ctx, B.x + 18, B.y, C.x - 18, C.y, "#84CC16", 2);

    ctx.fillStyle = "#BEF264";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("p₁", (P.x + A.x) / 2, cy - 72);
    ctx.fillText("p₂", cx - 96, cy);
    ctx.fillText("f", cx + 96, cy);
    ctx.fillText("g", (B.x + C.x) / 2, cy + 72);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Pullback corner mark
    ctx.strokeStyle = "rgba(132,204,22,0.5)";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(P.x + 18, P.y + 18, 14, -14);

    // Commutativity label
    ctx.fillStyle = "rgba(190,242,100,0.8)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("f∘p₁ = g∘p₂", cx, cy + 90);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, P.x, P.y, "P", "#65A30D", 16);
    drawObj(ctx, A.x, A.y, "A", "#4D7C0F");
    drawObj(ctx, B.x, B.y, "B", "#4D7C0F");
    drawObj(ctx, C.x, C.y, "C", "#84CC16");

    drawText(ctx, "Pullback — fiber product over C", 10, 22, "#BEF264", 13);
    drawText(ctx, "P = A ×_C B = {(a,b) | f(a) = g(b)}", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 12. Equalizer ────────────────────────────────────────────────────────────
export function EqualizerVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cy = h / 2;
    var E = { x: w * 0.12, y: cy };
    var A = { x: w * 0.42, y: cy };
    var B = { x: w * 0.82, y: cy };

    // Two parallel arrows from A to B
    drawCurvedArrow(ctx, A.x + 18, A.y - 6, B.x - 18, B.y - 6, -18, "#84CC16", 2.2);
    drawCurvedArrow(ctx, A.x + 18, A.y + 6, B.x - 18, B.y + 6, 18, "#65A30D", 2.2);

    ctx.fillStyle = "#D9F99D";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("f", (A.x + B.x) / 2, cy - 34);
    ctx.fillText("g", (A.x + B.x) / 2, cy + 34);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Equalizer arrow
    drawArrow(ctx, E.x + 18, E.y, A.x - 18, A.y, "#BEF264", 2.5);
    ctx.fillStyle = "#BEF264";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("e  (monic)", (E.x + A.x) / 2, cy - 18);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // f∘e = g∘e label
    ctx.fillStyle = "rgba(190,242,100,0.85)";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("f∘e = g∘e", w / 2, cy + 58);
    ctx.fillText("E = {a ∈ A | f(a) = g(a)}", w / 2, cy + 78);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, E.x, E.y, "E", "#65A30D", 16);
    drawObj(ctx, A.x, A.y, "A", "#84CC16");
    drawObj(ctx, B.x, B.y, "B", "#4D7C0F");

    drawText(ctx, "Equalizer — where two parallel maps agree", 10, 22, "#D9F99D", 13);
    drawText(ctx, "e is always monic; in Set, E is the subset where f=g", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 13. Functors ─────────────────────────────────────────────────────────────
export function FunctorVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.0);

    // Category C (left)
    var Cx = w * 0.22;
    var Cy = h / 2;
    var objsC = [
      { x: Cx - 55, y: Cy - 40, l: "A", c: "#4F46E5" },
      { x: Cx + 55, y: Cy - 40, l: "B", c: "#4F46E5" },
      { x: Cx, y: Cy + 40, l: "C", c: "#4338CA" },
    ];

    ctx.fillStyle = "rgba(99,102,241,0.08)";
    ctx.beginPath();
    ctx.ellipse(Cx, Cy, 85, 65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(99,102,241,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#A5B4FC";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("C", Cx, Cy - 80);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawArrow(ctx, objsC[0].x + 15, objsC[0].y, objsC[1].x - 15, objsC[1].y, "rgba(165,180,252,0.7)", 1.8);
    drawArrow(ctx, objsC[0].x + 10, objsC[0].y + 12, objsC[2].x - 8, objsC[2].y - 15, "rgba(165,180,252,0.5)", 1.5);
    objsC.forEach(function (o) { drawObj(ctx, o.x, o.y, o.l, o.c, 14); });

    // Category D (right)
    var Dx = w * 0.78;
    var Dy = h / 2;
    var objsD = [
      { x: Dx - 55, y: Dy - 40, l: "FA", c: "#7C3AED" },
      { x: Dx + 55, y: Dy - 40, l: "FB", c: "#7C3AED" },
      { x: Dx, y: Dy + 40, l: "FC", c: "#6D28D9" },
    ];

    ctx.fillStyle = "rgba(124,58,237,0.08)";
    ctx.beginPath();
    ctx.ellipse(Dx, Dy, 85, 65, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(124,58,237,0.3)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#C4B5FD";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("D", Dx, Dy - 80);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawArrow(ctx, objsD[0].x + 15, objsD[0].y, objsD[1].x - 15, objsD[1].y, "rgba(196,181,253,0.7)", 1.8);
    drawArrow(ctx, objsD[0].x + 10, objsD[0].y + 12, objsD[2].x - 8, objsD[2].y - 15, "rgba(196,181,253,0.5)", 1.5);
    objsD.forEach(function (o) { drawObj(ctx, o.x, o.y, o.l, o.c, 14); });

    // Functor arrows
    var alpha = 0.4 + 0.4 * pulse;
    objsC.forEach(function (oc, i) {
      drawArrow(ctx, oc.x + 16, oc.y, objsD[i].x - 16, objsD[i].y, "rgba(245,158,11," + alpha + ")", 1.5);
    });

    // F label
    ctx.fillStyle = "#FDE68A";
    ctx.font = "700 14px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("F", w / 2, h / 2 - 10);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Functor F: C→D — structure-preserving map", 10, 22, "#FDE68A", 13);
    drawText(ctx, "F(g∘f) = F(g)∘F(f)  and  F(id_A) = id_{FA}", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 14. Natural Transformations ─────────────────────────────────────────────
export function NaturalVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    // Four objects: FA, FB top row; GA, GB bottom row
    var FA = { x: cx - 100, y: cy - 55 };
    var FB = { x: cx + 100, y: cy - 55 };
    var GA = { x: cx - 100, y: cy + 55 };
    var GB = { x: cx + 100, y: cy + 55 };

    // F(f) top
    drawArrow(ctx, FA.x + 18, FA.y, FB.x - 18, FB.y, "#F59E0B", 2.2);
    ctx.fillStyle = "#FDE68A";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("F(f)", cx, cy - 72);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // G(f) bottom
    drawArrow(ctx, GA.x + 18, GA.y, GB.x - 18, GB.y, "#F97316", 2.2);
    ctx.fillStyle = "#FDBA74";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("G(f)", cx, cy + 72);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // η_A left, η_B right
    drawArrow(ctx, FA.x, FA.y + 18, GA.x, GA.y - 18, "#FB923C", 2.5);
    drawArrow(ctx, FB.x, FB.y + 18, GB.x, GB.y - 18, "#FB923C", 2.5);
    ctx.fillStyle = "#FDBA74";
    ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("η_A", cx - 120, cy);
    ctx.fillText("η_B", cx + 120, cy);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Commutativity label
    ctx.fillStyle = "rgba(253,186,116,0.8)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("η_B∘F(f) = G(f)∘η_A", cx, cy + 94);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawObj(ctx, FA.x, FA.y, "FA", "#D97706", 18);
    drawObj(ctx, FB.x, FB.y, "FB", "#D97706", 18);
    drawObj(ctx, GA.x, GA.y, "GA", "#B45309", 18);
    drawObj(ctx, GB.x, GB.y, "GB", "#B45309", 18);

    drawText(ctx, "Natural Transformation η: F⇒G", 10, 22, "#FDE68A", 13);
    drawText(ctx, "Naturality square: transform before or after mapping — same result", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 15. Adjunctions ─────────────────────────────────────────────────────────
export function AdjunctionVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.0);
    var Cx = w * 0.25;
    var Dx = w * 0.75;
    var cy = h / 2;

    // Category ovals
    ctx.fillStyle = "rgba(239,68,68,0.07)";
    ctx.beginPath(); ctx.ellipse(Cx, cy, 70, 90, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(239,68,68,0.3)";
    ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "rgba(239,68,68,0.6)";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("C", Cx, cy - 108); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "rgba(239,68,68,0.07)";
    ctx.beginPath(); ctx.ellipse(Dx, cy, 70, 90, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(239,68,68,0.3)";
    ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "rgba(239,68,68,0.6)";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("D", Dx, cy - 108); ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // F arrow (C→D, upper)
    var yF = cy - 28;
    drawCurvedArrow(ctx, Cx + 72, yF, Dx - 72, yF, -20, "#EF4444", 2.5);
    ctx.fillStyle = "#FCA5A5";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("F (left adjoint)", w / 2, yF - 28);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // G arrow (D→C, lower)
    var yG = cy + 28;
    drawCurvedArrow(ctx, Dx - 72, yG, Cx + 72, yG, -20, "#F87171", 2.5);
    ctx.fillStyle = "#FCA5A5";
    ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("G (right adjoint)", w / 2, yG + 28);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Hom bijection
    ctx.fillStyle = "rgba(252,165,165," + (0.5 + 0.3 * pulse) + ")";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Hom_D(FA, B) ≅ Hom_C(A, GB)", w / 2, cy + 82);
    ctx.fillText("F ⊣ G", w / 2, cy + 100);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Adjunction F ⊣ G", 10, 22, "#FCA5A5", 13);
    drawText(ctx, "Natural bijection between hom-sets across the two categories", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 16. Limits & Colimits ────────────────────────────────────────────────────
export function LimitsVis() {
  var st = useState("limit");
  var mode = st[0];
  var setMode = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    if (mode === "limit") {
      // Diagram objects
      var D1 = { x: cx - 90, y: cy + 30 };
      var D2 = { x: cx, y: cy + 30 };
      var D3 = { x: cx + 90, y: cy + 30 };
      var L = { x: cx, y: cy - 60 };

      drawArrow(ctx, D1.x + 14, D1.y, D2.x - 14, D2.y, "rgba(236,72,153,0.6)", 1.5);
      drawArrow(ctx, D2.x + 14, D2.y, D3.x - 14, D3.y, "rgba(236,72,153,0.6)", 1.5);
      ctx.fillStyle = "rgba(249,168,212,0.6)";
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Diagram", cx, cy + 58);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // Cone arrows from limit L
      drawArrow(ctx, L.x - 12, L.y + 18, D1.x + 8, D1.y - 15, "#DB2777", 2);
      drawArrow(ctx, L.x, L.y + 18, D2.x, D2.y - 15, "#DB2777", 2);
      drawArrow(ctx, L.x + 12, L.y + 18, D3.x - 8, D3.y - 15, "#DB2777", 2);

      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("πᵢ", cx - 50, cy - 18);
      ctx.fillText("πⱼ", cx + 50, cy - 18);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // Universal object (competing cone at top-left)
      var U = { x: cx - 90, y: cy - 60 };
      ctx.setLineDash([5, 3]);
      drawArrow(ctx, U.x + 14, U.y, L.x - 14, L.y, "rgba(236,72,153,0.5)", 1.5);
      ctx.setLineDash([]);
      drawArrow(ctx, U.x - 4, U.y + 16, D1.x + 4, D1.y - 14, "rgba(236,72,153,0.3)", 1);
      drawArrow(ctx, U.x + 4, U.y + 16, D2.x - 4, D2.y - 14, "rgba(236,72,153,0.3)", 1);

      ctx.fillStyle = "rgba(249,168,212,0.7)";
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("∃!", (U.x + L.x) / 2, L.y - 10);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawObj(ctx, D1.x, D1.y, "D₁", "#BE185D", 14);
      drawObj(ctx, D2.x, D2.y, "D₂", "#BE185D", 14);
      drawObj(ctx, D3.x, D3.y, "D₃", "#BE185D", 14);
      drawObj(ctx, L.x, L.y, "L", "#EC4899", 20);
      drawObj(ctx, U.x, U.y, "Q", "#9D174D", 14);

      drawText(ctx, "Limit — universal cone over the diagram", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "L is the most general object with compatible maps to each Dᵢ", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      // Colimit: universal cocone
      var D1c = { x: cx - 90, y: cy - 30 };
      var D2c = { x: cx, y: cy - 30 };
      var D3c = { x: cx + 90, y: cy - 30 };
      var CL = { x: cx, y: cy + 60 };

      drawArrow(ctx, D1c.x + 14, D1c.y, D2c.x - 14, D2c.y, "rgba(236,72,153,0.6)", 1.5);
      drawArrow(ctx, D2c.x + 14, D2c.y, D3c.x - 14, D3c.y, "rgba(236,72,153,0.6)", 1.5);

      // Cocone arrows from diagram to colimit
      drawArrow(ctx, D1c.x + 8, D1c.y + 15, CL.x - 12, CL.y - 18, "#DB2777", 2);
      drawArrow(ctx, D2c.x, D2c.y + 15, CL.x, CL.y - 18, "#DB2777", 2);
      drawArrow(ctx, D3c.x - 8, D3c.y + 15, CL.x + 12, CL.y - 18, "#DB2777", 2);

      // Competing cocone
      var V = { x: cx + 90, y: cy + 60 };
      ctx.setLineDash([5, 3]);
      drawArrow(ctx, CL.x + 14, CL.y, V.x - 14, V.y, "rgba(236,72,153,0.5)", 1.5);
      ctx.setLineDash([]);
      drawArrow(ctx, D1c.x + 8, D1c.y + 15, V.x - 4, V.y - 16, "rgba(236,72,153,0.3)", 1);
      drawArrow(ctx, D3c.x - 4, D3c.y + 16, V.x - 8, V.y - 16, "rgba(236,72,153,0.3)", 1);

      ctx.fillStyle = "rgba(249,168,212,0.7)";
      ctx.font = "600 9px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("∃!", (CL.x + V.x) / 2, CL.y + 12);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawObj(ctx, D1c.x, D1c.y, "D₁", "#BE185D", 14);
      drawObj(ctx, D2c.x, D2c.y, "D₂", "#BE185D", 14);
      drawObj(ctx, D3c.x, D3c.y, "D₃", "#BE185D", 14);
      drawObj(ctx, CL.x, CL.y, "L", "#EC4899", 20);
      drawObj(ctx, V.x, V.y, "Q", "#9D174D", 14);

      drawText(ctx, "Colimit — universal cocone under the diagram", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "L is the most general object receiving compatible maps from each Dᵢ", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [mode]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["limit", "colimit"].map(function (m) {
          return (
            <button key={m} onClick={function () { setMode(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: mode === m ? "#DB2777" : "rgba(255,255,255,0.08)", color: mode === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 17. Monads ───────────────────────────────────────────────────────────────
export function MonadVis() {
  var st = useState("structure");
  var view = st[0];
  var setView = st[1];

  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.2);

    if (view === "structure") {
      // Show T as an endofunctor circle
      ctx.beginPath();
      ctx.arc(cx, cy, 70 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(219,39,119,0.4)";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.fillStyle = "rgba(219,39,119,0.06)";
      ctx.fill();

      // Objects inside
      drawObj(ctx, cx - 28, cy, "A", "#BE185D", 14);
      drawObj(ctx, cx + 28, cy, "TA", "#DB2777", 14);
      drawArrow(ctx, cx - 14, cy, cx + 14, cy, "#F9A8D4", 1.8);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("η_A", cx, cy - 16);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // T label on ring
      ctx.fillStyle = "#F472B6";
      ctx.font = "700 14px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("T: C→C", cx, cy - 90);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // Unit and multiplication
      ctx.fillStyle = "rgba(249,168,212,0.85)";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("η: id ⇒ T   (unit / return)", cx, cy + 95);
      ctx.fillText("μ: T² ⇒ T   (multiplication / join)", cx, cy + 115);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawText(ctx, "Monad (T, η, μ) — monoid in endofunctors", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "T loops C→C; η wraps values; μ flattens T(T(A))→T(A)", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      // Kleisli composition diagram
      var A = { x: cx - 110, y: cy };
      var TB = { x: cx, y: cy };
      var TC = { x: cx + 110, y: cy };

      drawArrow(ctx, A.x + 16, A.y, TB.x - 16, TB.y, "#DB2777", 2.2);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("f: A→TB", (A.x + TB.x) / 2, cy - 20);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawArrow(ctx, TB.x + 16, TB.y, TC.x - 16, TC.y, "#BE185D", 2.2);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("g: B→TC", (TB.x + TC.x) / 2, cy - 20);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawCurvedArrow(ctx, A.x + 16, A.y + 10, TC.x - 16, TC.y + 10, 36, "#F472B6", 2.5);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("f >=> g: A→TC   (Kleisli)", cx, cy + 52);
      ctx.fillText("= μ_C ∘ T(g) ∘ f", cx, cy + 70);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawObj(ctx, A.x, A.y, "A", "#9D174D");
      drawObj(ctx, TB.x, TB.y, "TB", "#DB2777", 18);
      drawObj(ctx, TC.x, TC.y, "TC", "#BE185D", 18);

      drawText(ctx, "Kleisli Composition  f >=> g", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "Chain effectful computations: f then g, flattening the result", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [view]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["structure", "kleisli"].map(function (m) {
          return (
            <button key={m} onClick={function () { setView(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: view === m ? "#DB2777" : "rgba(255,255,255,0.08)", color: view === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 18. Yoneda Lemma ─────────────────────────────────────────────────────────
export function YonedaVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var pulse = 0.5 + 0.5 * Math.sin(t * 0.8);

    // Central object A
    drawObj(ctx, cx, cy, "A", "#BE185D", 26);

    // Arrows from A to surrounding objects (hom-set)
    var targets = [
      { x: cx + 120, y: cy - 60, l: "B", ang: 0 },
      { x: cx + 130, y: cy + 40, l: "C", ang: 1 },
      { x: cx - 130, y: cy - 60, l: "D", ang: 2 },
      { x: cx - 120, y: cy + 40, l: "E", ang: 3 },
      { x: cx + 30, y: cy - 100, l: "F", ang: 4 },
    ];

    targets.forEach(function (tgt, i) {
      var dx = tgt.x - cx; var dy = tgt.y - cy;
      var len = Math.hypot(dx, dy);
      var alpha = 0.4 + 0.3 * Math.sin(t * 0.6 + i * 1.2);
      drawArrow(ctx, cx + dx / len * 28, cy + dy / len * 28, tgt.x - dx / len * 18, tgt.y - dy / len * 18, "rgba(219,39,119," + alpha + ")", 1.8);
      drawObj(ctx, tgt.x, tgt.y, tgt.l, "#9D174D", 14);
    });

    // Yoneda label
    ctx.fillStyle = "rgba(249,168,212," + (0.6 + 0.3 * pulse) + ")";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Hom(A, -)", cx, cy + 50);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    // Bijection
    ctx.fillStyle = "#F9A8D4";
    ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Nat(Hom(A,−), F) ≅ F(A)", cx, cy + 80);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "rgba(249,168,212,0.6)";
    ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("\"You are what you do to others\"", cx, cy + 100);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Yoneda Lemma — objects through their morphisms", 10, 22, "#F9A8D4", 13);
    drawText(ctx, "A is fully determined by all arrows out of (or into) it", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 19. Cartesian Closed Categories ─────────────────────────────────────────
export function CCCVis() {
  var st = useState("product");
  var view = st[0];
  var setView = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    if (view === "product") {
      // Product A×B diagram
      var AxB = { x: cx, y: cy };
      var A = { x: cx - 110, y: cy + 55 };
      var B = { x: cx + 110, y: cy + 55 };
      var C = { x: cx, y: cy - 70 };
      var BA = { x: cx + 90, y: cy - 70 };

      // Product projections
      drawArrow(ctx, AxB.x - 14, AxB.y + 14, A.x + 14, A.y - 10, "#9D174D", 2);
      drawArrow(ctx, AxB.x + 14, AxB.y + 14, B.x - 14, B.y - 10, "#9D174D", 2);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("π₁", cx - 60, cy + 44);
      ctx.fillText("π₂", cx + 60, cy + 44);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // Exponential B^A
      drawArrow(ctx, cx + 14, cy - 14, BA.x - 14, BA.y + 14, "#BE185D", 2);
      ctx.fillStyle = "#F9A8D4";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("curry", (cx + BA.x) / 2, (cy + BA.y) / 2 - 14);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      // Evaluation arrow
      var EvX = cx + 55;
      var EvY = cy - 10;
      ctx.fillStyle = "rgba(249,168,212,0.7)";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("ev: B^A × A → B", cx + 70, cy - 90);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawObj(ctx, AxB.x, AxB.y, "A×B", "#9D174D", 22);
      drawObj(ctx, A.x, A.y, "A", "#7C2D8A");
      drawObj(ctx, B.x, B.y, "B", "#7C2D8A");
      drawObj(ctx, BA.x, BA.y, "B^A", "#BE185D", 20);

      ctx.fillStyle = "rgba(249,168,212,0.85)";
      ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Hom(C×A, B) ≅ Hom(C, B^A)", cx, cy + 92);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawText(ctx, "Cartesian Closed Category — product + exponential", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "Currying: a 2-arg function is same as a function returning a function", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      // Curry-Howard triangle
      var corners = [
        { x: cx - 110, y: cy + 60, l: "Logic", sub: "A → B", color: "#BE185D" },
        { x: cx + 110, y: cy + 60, l: "Types", sub: "A → B", color: "#9D174D" },
        { x: cx, y: cy - 70, l: "CCC", sub: "morphism", color: "#DB2777" },
      ];

      drawArrow(ctx, corners[0].x + 40, corners[0].y - 10, corners[2].x - 20, corners[2].y + 18, "rgba(249,168,212,0.6)", 2);
      drawArrow(ctx, corners[1].x - 40, corners[1].y - 10, corners[2].x + 20, corners[2].y + 18, "rgba(249,168,212,0.6)", 2);
      drawArrow(ctx, corners[0].x + 60, corners[0].y, corners[1].x - 60, corners[1].y, "rgba(249,168,212,0.6)", 2);

      corners.forEach(function (c) {
        ctx.fillStyle = c.color;
        ctx.beginPath();
        ctx.roundRect(c.x - 50, c.y - 26, 100, 52, 8);
        ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.font = "700 12px monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle";
        ctx.fillText(c.l, c.x, c.y - 8);
        ctx.fillStyle = "#F9A8D4";
        ctx.font = "600 10px monospace";
        ctx.fillText(c.sub, c.x, c.y + 10);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      });

      ctx.fillStyle = "rgba(249,168,212,0.85)";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("Curry-Howard-Lambek Correspondence", cx, cy + 100);
      ctx.fillText("Proof = Program = Morphism", cx, cy + 118);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawText(ctx, "Curry-Howard-Lambek — Logic = Types = CCC", 10, 22, "#F9A8D4", 13);
      drawText(ctx, "The same structure appears in logic, type theory, and category theory", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [view]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["product", "curry-howard"].map(function (m) {
          return (
            <button key={m} onClick={function () { setView(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: view === m ? "#9D174D" : "rgba(255,255,255,0.08)", color: view === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 20. Monoidal Categories ──────────────────────────────────────────────────
export function MonoidalVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var boxW = 58;
    var boxH = 36;
    var gap = 16;

    function box(x, y, label, color) {
      ctx.fillStyle = color || "rgba(8,145,178,0.2)";
      ctx.fillRect(x - boxW / 2, y - boxH / 2, boxW, boxH);
      ctx.strokeStyle = "#06B6D4";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x - boxW / 2, y - boxH / 2, boxW, boxH);
      ctx.fillStyle = "#67E8F9";
      ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(label, x, y);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }

    var lx = cx - 110;
    box(lx, cy - 30, "A⊗B", "rgba(8,145,178,0.25)");
    box(lx + boxW + gap, cy - 30, "C", "rgba(8,145,178,0.15)");
    ctx.fillStyle = "#67E8F9"; ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("⊗", lx + boxW / 2 + gap / 2, cy - 30);
    ctx.fillText("(A⊗B)⊗C", lx + boxW / 2, cy - 64);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    box(lx - gap / 2, cy + 30, "A", "rgba(8,145,178,0.15)");
    box(lx + boxW / 2 + gap, cy + 30, "B⊗C", "rgba(8,145,178,0.25)");
    ctx.fillStyle = "#67E8F9"; ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("⊗", lx + boxW / 4, cy + 30);
    ctx.fillText("A⊗(B⊗C)", lx + boxW / 2, cy + 64);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawArrow(ctx, lx + boxW, cy - 14, lx + boxW, cy + 14, "#0EA5E9", 2);
    ctx.fillStyle = "#7DD3FC"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("α", lx + boxW + 14, cy);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    var rx = cx + 60;
    box(rx, cy - 20, "I⊗A", "rgba(14,165,233,0.2)");
    drawArrow(ctx, rx + boxW / 2 + 6, cy - 20, rx + boxW / 2 + 44, cy - 20, "#0EA5E9", 2);
    box(rx + boxW + 50, cy - 20, "A", "rgba(14,165,233,0.15)");
    ctx.fillStyle = "#7DD3FC"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("λ", rx + boxW / 2 + 25, cy - 34);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    box(rx, cy + 20, "A⊗I", "rgba(14,165,233,0.2)");
    drawArrow(ctx, rx + boxW / 2 + 6, cy + 20, rx + boxW / 2 + 44, cy + 20, "#0EA5E9", 2);
    box(rx + boxW + 50, cy + 20, "A", "rgba(14,165,233,0.15)");
    ctx.fillStyle = "#7DD3FC"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("ρ", rx + boxW / 2 + 25, cy + 34);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Monoidal Category — (C, ⊗, I, α, λ, ρ)", 10, 22, "#67E8F9", 13);
    drawText(ctx, "α: (A⊗B)⊗C ≅ A⊗(B⊗C)  λ: I⊗A≅A  ρ: A⊗I≅A", 10, h - 20, "rgba(255,255,255,0.5)", 10.3);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 21. String Diagrams ──────────────────────────────────────────────────────
export function StringVis() {
  var st = useState("compose");
  var view = st[0];
  var setView = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;

    if (view === "compose") {
      var wireX = cx - 60;
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(wireX, 36); ctx.lineTo(wireX, cy - 40); ctx.stroke();
      ctx.fillStyle = "rgba(2,132,199,0.3)";
      ctx.fillRect(wireX - 22, cy - 40, 44, 28);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 1.5;
      ctx.strokeRect(wireX - 22, cy - 40, 44, 28);
      ctx.fillStyle = "#7DD3FC"; ctx.font = "700 12px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("f", wireX, cy - 26);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(wireX, cy - 12); ctx.lineTo(wireX, cy + 12); ctx.stroke();
      ctx.fillStyle = "rgba(2,132,199,0.25)";
      ctx.fillRect(wireX - 22, cy + 12, 44, 28);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 1.5;
      ctx.strokeRect(wireX - 22, cy + 12, 44, 28);
      ctx.fillStyle = "#7DD3FC"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("g", wireX, cy + 26);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(wireX, cy + 40); ctx.lineTo(wireX, h - 36); ctx.stroke();
      ctx.fillStyle = "#7DD3FC"; ctx.font = "600 10px monospace";
      ctx.fillText("A", wireX + 12, 42); ctx.fillText("B", wireX + 12, cy); ctx.fillText("C", wireX + 12, h - 42);
      ctx.fillText("g∘f (sequential)", wireX, h - 20);

      var wireX2 = cx + 60;
      var wx1 = wireX2 - 28; var wx2 = wireX2 + 28;
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(wx1, 36); ctx.lineTo(wx1, h - 36); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(wx2, 36); ctx.lineTo(wx2, h - 36); ctx.stroke();
      ctx.fillStyle = "rgba(2,132,199,0.25)";
      ctx.fillRect(wx1 - 8, cy - 20, 80, 40);
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 1.5; ctx.strokeRect(wx1 - 8, cy - 20, 80, 40);
      ctx.fillStyle = "#7DD3FC"; ctx.font = "700 11px monospace";
      ctx.fillText("f ⊗ g", wireX2, cy);
      ctx.font = "600 10px monospace";
      ctx.fillText("f⊗g (parallel)", wireX2, h - 20);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawText(ctx, "String Diagrams — vertical=∘  horizontal=⊗", 10, 22, "#7DD3FC", 13);
      drawText(ctx, "Left: sequential composition; Right: parallel tensor product", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      var mwx = cx;
      var etaY = cy - 60;
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(mwx - 80, etaY); ctx.lineTo(mwx - 80, etaY + 44); ctx.stroke();
      ctx.fillStyle = "#0284C7"; ctx.beginPath(); ctx.arc(mwx - 80, etaY, 6, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#7DD3FC"; ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("η (unit / return)", mwx - 80, etaY + 60);

      var muY = cy + 20;
      ctx.strokeStyle = "#0284C7"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.moveTo(mwx - 20, muY - 50); ctx.lineTo(mwx - 20, muY - 16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mwx + 20, muY - 50); ctx.lineTo(mwx + 20, muY - 16); ctx.stroke();
      ctx.fillStyle = "rgba(2,132,199,0.3)";
      ctx.beginPath();
      ctx.moveTo(mwx - 26, muY - 16); ctx.lineTo(mwx + 26, muY - 16);
      ctx.lineTo(mwx + 8, muY + 6); ctx.lineTo(mwx - 8, muY + 6); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#06B6D4"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(mwx, muY + 6); ctx.lineTo(mwx, muY + 46); ctx.stroke();
      ctx.fillStyle = "#7DD3FC";
      ctx.fillText("T", mwx - 30, muY - 34); ctx.fillText("T", mwx + 30, muY - 34);
      ctx.fillText("μ (join)", mwx + 32, muY - 4); ctx.fillText("T", mwx + 10, muY + 28);
      ctx.fillText("μ (multiply / flatten)", mwx, muY + 62);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

      drawText(ctx, "String Diagrams — monad as wires & boxes", 10, 22, "#7DD3FC", 13);
      drawText(ctx, "Dot=η (wrap); merge=μ (flatten T∘T → T)", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [view]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["compose", "monad"].map(function (m) {
          return (
            <button key={m} onClick={function () { setView(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: view === m ? "#0284C7" : "rgba(255,255,255,0.08)", color: view === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 22. Applicative Functors ─────────────────────────────────────────────────
export function ApplicativeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.2);
    var levels = [
      { label: "Functor", sub: "fmap :: (a→b) → F a → F b", y: cy + 60, rw: 120, color: "#D97706" },
      { label: "Applicative", sub: "(<*>) :: F(a→b) → F a → F b", y: cy, rw: 180, color: "#F59E0B" },
      { label: "Monad", sub: "(>>=) :: F a → (a→F b) → F b", y: cy - 60, rw: 240, color: "#FBBF24" },
    ];
    levels.forEach(function (lv) {
      ctx.beginPath(); ctx.ellipse(cx, lv.y, lv.rw, 30, 0, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(217,119,6,0.1)"; ctx.fill();
      ctx.strokeStyle = lv.color; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = lv.color; ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(lv.label, cx - lv.rw + 44, lv.y);
      ctx.fillStyle = "rgba(255,255,255,0.5)"; ctx.font = "600 9px monospace";
      ctx.fillText(lv.sub, cx + 24, lv.y);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    });
    ctx.fillStyle = "rgba(251,191,36," + (0.6 + 0.3 * pulse) + ")";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("pure (+3) <*> Just 5  =  Just 8", cx, cy + 108);
    ctx.fillText("[(+1),(×2)] <*> [3,4]  =  [4,5,6,8]", cx, cy + 126);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    drawText(ctx, "Applicative — lax monoidal functor", 10, 22, "#FDE68A", 13);
    drawText(ctx, "Applies wrapped functions to wrapped values; effects are independent", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 23. Profunctors ──────────────────────────────────────────────────────────
export function ProfunctorVis() {
  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2; var cy = h / 2;
    var Cx = cx - 130; var Dx = cx + 130;

    function catOval(x, label) {
      ctx.fillStyle = "rgba(234,88,12,0.08)";
      ctx.beginPath(); ctx.ellipse(x, cy, 60, 80, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(234,88,12,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.fillStyle = "#FDBA74"; ctx.font = "700 12px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(label, x, cy - 96);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
    }
    catOval(Cx, "C^op");
    catOval(Dx, "D");

    var objsC = [{ x: Cx - 16, y: cy - 24, l: "a" }, { x: Cx + 16, y: cy + 24, l: "b" }];
    var objsD = [{ x: Dx - 16, y: cy - 24, l: "c" }, { x: Dx + 16, y: cy + 24, l: "d" }];
    objsC.forEach(function (o) { drawObj(ctx, o.x, o.y, o.l, "#EA580C", 12); });
    objsD.forEach(function (o) { drawObj(ctx, o.x, o.y, o.l, "#C2410C", 12); });
    drawCurvedArrow(ctx, objsC[1].x + 8, objsC[1].y - 8, objsC[0].x + 8, objsC[0].y + 8, -12, "rgba(234,88,12,0.6)", 1.5);
    drawCurvedArrow(ctx, objsD[0].x - 8, objsD[0].y + 8, objsD[1].x - 8, objsD[1].y - 8, -12, "rgba(234,88,12,0.6)", 1.5);
    ctx.fillStyle = "#FDBA74"; ctx.font = "600 9px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("f↑", Cx + 26, cy); ctx.fillText("g↓", Dx - 26, cy);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "rgba(234,88,12,0.2)";
    ctx.fillRect(cx - 30, cy - 20, 60, 40);
    ctx.strokeStyle = "#F97316"; ctx.lineWidth = 2; ctx.strokeRect(cx - 30, cy - 20, 60, 40);
    ctx.fillStyle = "#FDBA74"; ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("P", cx, cy);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawArrow(ctx, Cx + 62, cy - 8, cx - 32, cy - 6, "rgba(234,88,12,0.5)", 1.5);
    drawArrow(ctx, Dx - 62, cy + 8, cx + 32, cy + 6, "rgba(234,88,12,0.5)", 1.5);
    drawArrow(ctx, cx, cy + 22, cx, cy + 66, "#F97316", 2);
    ctx.fillStyle = "#FDBA74"; ctx.font = "600 10px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("Set", cx, cy + 78); ctx.fillText("P(a,c) ∈ Set", cx, cy + 96);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Profunctor P: C^op × D → Set", 10, 22, "#FDBA74", 13);
    drawText(ctx, "dimap f g: P(a,c) → P(b,d)  contravariant left, covariant right", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 24. Comonads ─────────────────────────────────────────────────────────────
export function ComonadVis() {
  var st = useState("structure");
  var view = st[0]; var setView = st[1];

  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2; var cy = h / 2;
    var pulse = 0.5 + 0.5 * Math.sin(t * 1.2);

    if (view === "structure") {
      ctx.beginPath(); ctx.arc(cx, cy, 72 + pulse * 3, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(124,58,237,0.5)"; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = "rgba(124,58,237,0.07)"; ctx.fill();
      drawArrow(ctx, cx + 28, cy, cx + 90, cy, "#A78BFA", 2.5);
      ctx.fillStyle = "#C4B5FD"; ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("ε (extract): W(A)→A", cx + 130, cy - 10);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawArrow(ctx, cx - 90, cy, cx - 28, cy, "#7C3AED", 2.5);
      ctx.fillStyle = "#C4B5FD"; ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("δ (dup): W(A)→W(W(A))", cx - 130, cy - 10);
      ctx.fillText("W", cx, cy);
      ctx.fillStyle = "rgba(196,181,253," + (0.5 + 0.3 * pulse) + ")";
      ctx.font = "600 11px monospace";
      ctx.fillText("ε_W ∘ δ = id_W  (counit left)", cx, cy + 95);
      ctx.fillText("W(ε) ∘ δ = id_W  (counit right)", cx, cy + 113);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawText(ctx, "Comonad (W, ε, δ) — dual of Monad", 10, 22, "#C4B5FD", 13);
      drawText(ctx, "ε extracts a value; δ duplicates the context into W(W(A))", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      var streamY = cy - 10; var slotW = 44;
      var slots = ["…", "x₋₁", "x₀", "x₁", "x₂", "…"];
      var focusIdx = 2;
      slots.forEach(function (s, i) {
        var sx = cx - (slots.length - 1) * slotW / 2 + i * slotW;
        var isFocus = i === focusIdx;
        ctx.fillStyle = isFocus ? "rgba(124,58,237,0.5)" : "rgba(124,58,237,0.15)";
        ctx.fillRect(sx - slotW / 2 + 3, streamY - 16, slotW - 6, 32);
        ctx.strokeStyle = isFocus ? "#A78BFA" : "rgba(124,58,237,0.3)";
        ctx.lineWidth = isFocus ? 2 : 1;
        ctx.strokeRect(sx - slotW / 2 + 3, streamY - 16, slotW - 6, 32);
        ctx.fillStyle = isFocus ? "#fff" : "rgba(196,181,253,0.7)";
        ctx.font = (isFocus ? "700" : "600") + " 10px monospace";
        ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s, sx, streamY);
        ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      });
      var focusX = cx - (slots.length - 1) * slotW / 2 + focusIdx * slotW;
      drawArrow(ctx, focusX, streamY + 18, focusX, streamY + 52, "#7C3AED", 2.2);
      ctx.fillStyle = "#C4B5FD"; ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("extract → x₀", focusX, streamY + 66);
      ctx.fillStyle = "rgba(124,58,237,0.15)";
      ctx.fillRect(cx - 110, streamY - 72, 220, 28);
      ctx.strokeStyle = "rgba(167,139,250,0.5)"; ctx.lineWidth = 1.5;
      ctx.strokeRect(cx - 110, streamY - 72, 220, 28);
      ctx.fillStyle = "#C4B5FD"; ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("duplicate → all tails of the stream", cx, streamY - 58);
      drawArrow(ctx, cx, streamY - 44, cx, streamY - 18, "rgba(124,58,237,0.6)", 1.5);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawText(ctx, "Stream Comonad — context is an infinite stream", 10, 22, "#C4B5FD", 13);
      drawText(ctx, "extract: peek at current element; duplicate: generate all shifted streams", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [view]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["structure", "stream"].map(function (m) {
          return (
            <button key={m} onClick={function () { setView(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: view === m ? "#7C3AED" : "rgba(255,255,255,0.08)", color: view === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 25. Kan Extensions ───────────────────────────────────────────────────────
export function KanVis() {
  var st = useState("left");
  var side = st[0]; var setSide = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2; var cy = h / 2;
    var C = { x: cx - 110, y: cy - 50 };
    var D = { x: cx, y: cy + 70 };
    var E = { x: cx + 110, y: cy - 50 };

    drawObj(ctx, C.x, C.y, "C", "#4F46E5");
    drawObj(ctx, D.x, D.y, "D", "#6D28D9");
    drawObj(ctx, E.x, E.y, "E", "#4F46E5");

    drawArrow(ctx, C.x + 14, C.y + 14, D.x - 14, D.y - 14, "#818CF8", 2);
    ctx.fillStyle = "#A5B4FC"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("K", (C.x + D.x) / 2 - 18, (C.y + D.y) / 2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawArrow(ctx, C.x + 16, C.y, E.x - 16, E.y, "#818CF8", 2);
    ctx.fillStyle = "#A5B4FC"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("F", cx, cy - 70);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.setLineDash([6, 3]);
    drawArrow(ctx, D.x + 14, D.y - 14, E.x - 14, E.y + 14, "#6D28D9", 2.5);
    ctx.setLineDash([]);
    ctx.fillStyle = "#C4B5FD"; ctx.font = "700 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(side === "left" ? "Lan_K F" : "Ran_K F", (D.x + E.x) / 2 + 24, (D.y + E.y) / 2 + 4);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    ctx.fillStyle = "rgba(196,181,253,0.85)";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(side === "left" ? "Nat(Lan_K F, G) ≅ Nat(F, G∘K)" : "Nat(G, Ran_K F) ≅ Nat(G∘K, F)", cx, cy + 110);
    ctx.fillStyle = "rgba(196,181,253,0.6)";
    ctx.font = "600 10px monospace";
    ctx.fillText(side === "left" ? "(Lan_K F)(d) = ∫^c Hom(Kc,d) × Fc" : "(Ran_K F)(d) = ∫_c Fc^{Hom(d,Kc)}", cx, cy + 130);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, (side === "left" ? "Left" : "Right") + " Kan Extension — the universal concept", 10, 22, "#C4B5FD", 13);
    drawText(ctx, "All of category theory is a Kan extension (Mac Lane)", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, [side]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["left", "right"].map(function (m) {
          return (
            <button key={m} onClick={function () { setSide(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: side === m ? "#6D28D9" : "rgba(255,255,255,0.08)", color: side === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m} Kan</button>
          );
        })}
      </div>
    </div>
  );
}

// ─── 26. Presheaves ───────────────────────────────────────────────────────────
export function PresheafVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2; var cy = h / 2;
    var pulse = 0.5 + 0.5 * Math.sin(t * 0.9);
    var Cx = cx - 120;

    ctx.fillStyle = "rgba(15,118,110,0.1)";
    ctx.beginPath(); ctx.ellipse(Cx, cy, 70, 80, 0, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(15,118,110,0.4)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = "#5EEAD4"; ctx.font = "700 12px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("C^op", Cx, cy - 96);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    var objsC = [{ x: Cx - 28, y: cy - 30, l: "A" }, { x: Cx + 28, y: cy - 30, l: "B" }, { x: Cx, y: cy + 30, l: "C" }];
    drawCurvedArrow(ctx, objsC[1].x - 12, objsC[1].y, objsC[0].x + 12, objsC[0].y, -10, "rgba(20,184,166,0.5)", 1.5);
    drawCurvedArrow(ctx, objsC[2].x + 8, objsC[2].y - 12, objsC[1].x - 4, objsC[1].y + 12, 10, "rgba(20,184,166,0.5)", 1.5);
    objsC.forEach(function (o) { drawObj(ctx, o.x, o.y, o.l, "#0F766E", 14); });

    var setX = cx + 100;
    var sets = [
      { x: setX, y: cy - 50, label: "P(A)", dots: 4 },
      { x: setX + 80, y: cy - 50, label: "P(B)", dots: 3 },
      { x: setX + 40, y: cy + 40, label: "P(C)", dots: 5 },
    ];
    sets.forEach(function (s) {
      ctx.fillStyle = "rgba(20,184,166,0.15)";
      ctx.beginPath(); ctx.ellipse(s.x, s.y, 28, 22, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "rgba(20,184,166,0.4)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = "#5EEAD4"; ctx.font = "600 9px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(s.label, s.x, s.y + 30);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      var i; for (i = 0; i < s.dots; i++) drawDot(ctx, s.x - 12 + (i % 3) * 12, s.y - 5 + Math.floor(i / 3) * 10, 2.5, "#5EEAD4");
    });
    drawArrow(ctx, sets[1].x - 28, sets[1].y, sets[0].x + 28, sets[0].y, "rgba(20,184,166,0.6)", 1.5);
    ctx.fillStyle = "#5EEAD4"; ctx.font = "600 9px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("P(f)", (sets[0].x + sets[1].x) / 2, sets[0].y - 16);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    objsC.forEach(function (o, i) {
      var alpha = 0.3 + 0.2 * Math.sin(t * 0.7 + i);
      drawArrow(ctx, o.x + 16, o.y, sets[i].x - 30, sets[i].y + (i === 2 ? 0 : 5), "rgba(20,184,166," + alpha + ")", 1.5);
    });

    ctx.fillStyle = "rgba(94,234,212," + (0.5 + 0.3 * pulse) + ")";
    ctx.font = "600 11px monospace";
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText("y(A) = Hom(−,A)  (representable, Yoneda)", cx, cy + 95);
    ctx.fillText("PSh(C) = [C^op,Set] — free cocompletion", cx, cy + 113);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";

    drawText(ctx, "Presheaf P: C^op → Set", 10, 22, "#5EEAD4", 13);
    drawText(ctx, "Sets of sections; restriction maps go backwards along morphisms", 10, h - 20, "rgba(255,255,255,0.5)", 10);
  }, []);
  return <Canvas2D draw={draw} />;
}

// ─── 27. Abelian Categories ───────────────────────────────────────────────────
export function AbelianVis() {
  var st = useState("exact");
  var view = st[0]; var setView = st[1];

  var draw = useCallback(function (ctx, w, h) {
    drawGrid(ctx, w, h);
    var cx = w / 2; var cy = h / 2;

    if (view === "exact") {
      var objs = [
        { x: cx - 200, y: cy, l: "0" },
        { x: cx - 100, y: cy, l: "A" },
        { x: cx, y: cy, l: "B" },
        { x: cx + 100, y: cy, l: "C" },
        { x: cx + 200, y: cy, l: "0" },
      ];
      var arrowColors = ["rgba(21,128,61,0.5)", "#16A34A", "#22C55E", "rgba(21,128,61,0.5)"];
      var arrowLabels = ["", "f (mono)", "g (epi)", ""];
      objs.forEach(function (o, i) {
        drawObj(ctx, o.x, o.y, o.l, i === 0 || i === 4 ? "#374151" : "#15803D", i === 0 || i === 4 ? 10 : 18);
        if (i < objs.length - 1) {
          drawArrow(ctx, o.x + (i === 0 ? 12 : 20), o.y, objs[i + 1].x - (i + 1 === 4 ? 12 : 20), o.y, arrowColors[i], 2);
          if (arrowLabels[i]) {
            ctx.fillStyle = "#86EFAC"; ctx.font = "600 10px monospace";
            ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(arrowLabels[i], (o.x + objs[i + 1].x) / 2, cy - 18);
            ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
          }
        }
      });
      ctx.fillStyle = "rgba(134,239,172,0.85)";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("im(f) = ker(g)  — exact at B", cx, cy + 42);
      ctx.fillText("f is injective (mono),  g is surjective (epi)", cx, cy + 62);
      ctx.fillText("Example: 0 → ℤ →×2 ℤ → ℤ/2ℤ → 0  in Ab", cx, cy + 90);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawText(ctx, "Short Exact Sequence  0 → A → B → C → 0", 10, 22, "#86EFAC", 13);
      drawText(ctx, "Exactness: image of each map equals kernel of the next", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    } else {
      var A = { x: cx - 80, y: cy - 20 };
      var B = { x: cx + 80, y: cy - 20 };
      var K = { x: cx - 165, y: cy - 20 };
      var Q = { x: cx + 165, y: cy - 20 };
      drawArrow(ctx, K.x + 18, K.y, A.x - 18, A.y, "#22C55E", 2);
      ctx.fillStyle = "#86EFAC"; ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("ker(f)", (K.x + A.x) / 2, cy - 36);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawArrow(ctx, A.x + 18, A.y, B.x - 18, B.y, "#16A34A", 2.5);
      ctx.fillStyle = "#86EFAC"; ctx.font = "700 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText("f", cx, cy - 36);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawArrow(ctx, B.x + 18, B.y, Q.x - 18, Q.y, "#22C55E", 2);
      ctx.fillStyle = "#86EFAC"; ctx.font = "600 10px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("coker(f)", (B.x + Q.x) / 2, cy - 36);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawObj(ctx, K.x, K.y, "K", "#15803D", 16);
      drawObj(ctx, A.x, A.y, "A", "#16A34A");
      drawObj(ctx, B.x, B.y, "B", "#16A34A");
      drawObj(ctx, Q.x, Q.y, "Q", "#15803D", 16);
      ctx.fillStyle = "rgba(134,239,172,0.85)";
      ctx.font = "600 11px monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText("ker(f) = eq(f, 0)", cx, cy + 30);
      ctx.fillText("coker(f) = coeq(f, 0)", cx, cy + 50);
      ctx.fillText("im(f) = ker(coker(f))", cx, cy + 70);
      ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
      drawText(ctx, "Kernel & Cokernel in Abelian Category", 10, 22, "#86EFAC", 13);
      drawText(ctx, "Every mono=kernel, every epi=cokernel; exact sequences exist categorically", 10, h - 20, "rgba(255,255,255,0.5)", 10);
    }
  }, [view]);

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {["exact", "ker/coker"].map(function (m) {
          return (
            <button key={m} onClick={function () { setView(m); }} style={{ padding: "6px 14px", borderRadius: 8, border: "none", cursor: "pointer", background: view === m ? "#16A34A" : "rgba(255,255,255,0.08)", color: view === m ? "#fff" : "rgba(255,255,255,0.5)", fontFamily: "monospace", fontSize: 12, fontWeight: 600 }}>{m}</button>
          );
        })}
      </div>
    </div>
  );
}
