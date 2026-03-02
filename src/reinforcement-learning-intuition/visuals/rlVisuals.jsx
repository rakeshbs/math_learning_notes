import { useCallback } from "react";
import { Canvas2D } from "../../matrix-intuition/components";
import {
  drawGrid,
  drawArrow,
  drawDot,
  drawText,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

export function MDPGraphVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var nodes = [
      { x: w * 0.22, y: h * 0.5, l: "s0" },
      { x: w * 0.5, y: h * 0.24, l: "s1" },
      { x: w * 0.5, y: h * 0.76, l: "s2" },
      { x: w * 0.78, y: h * 0.5, l: "s3" },
    ];
    function edge(i, j, c) {
      drawArrow(ctx, nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y, c, 1.8);
    }
    edge(0, 1, "rgba(251,146,60,0.7)");
    edge(0, 2, "rgba(251,146,60,0.5)");
    edge(1, 3, "rgba(251,146,60,0.7)");
    edge(2, 3, "rgba(251,146,60,0.7)");
    edge(3, 0, "rgba(148,163,184,0.5)");

    var pulse = 0.35 + 0.65 * ((Math.sin(t * 2) + 1) / 2);
    drawDot(ctx, nodes[1].x, nodes[1].y, 7 + pulse, "rgba(34,197,94,0.65)");
    drawText(ctx, "r=+1", nodes[1].x + 10, nodes[1].y - 10, "#86EFAC", 11);

    nodes.forEach(function (n) {
      ctx.strokeStyle = "rgba(255,255,255,0.25)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(n.x, n.y, 14, 0, Math.PI * 2);
      ctx.stroke();
      drawText(ctx, n.l, n.x - 7, n.y + 5, "rgba(255,255,255,0.75)", 11);
    });

    drawText(ctx, "States + action transitions", 10, 22, "#FDBA74", 12);
    drawText(ctx, "MDP graph for sequential control", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ReturnDiscountVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var base = h - 40;
    var gamma = 0.92 + 0.06 * ((Math.sin(t * 0.5) + 1) / 2);
    for (var k = 0; k < 8; k++) {
      var r = 1 + ((k % 3) - 1) * 0.3;
      var val = Math.pow(gamma, k) * r;
      var x = 34 + k * 34;
      var bar = val * 80;
      ctx.fillStyle = "rgba(251,146,60,0.6)";
      drawRoundRect(ctx, x, base - bar, 22, bar, 4);
      ctx.fill();
      drawText(ctx, "t" + k, x + 2, base + 14, "rgba(255,255,255,0.5)", 10);
    }
    drawText(ctx, "gamma = " + gamma.toFixed(2), 10, 22, "#FDBA74", 12);
    drawText(ctx, "Discount shrinks far future rewards", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BellmanBackupVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var states = [0.9, 1.4, 2.2, 1.8];
    var x0 = 44;
    for (var i = 0; i < states.length; i++) {
      var x = x0 + i * 64;
      var hBar = states[i] * 36;
      ctx.fillStyle = "rgba(96,165,250,0.55)";
      drawRoundRect(ctx, x, h - 42 - hBar, 36, hBar, 6);
      ctx.fill();
      drawText(ctx, "V" + i, x + 7, h - 18, "rgba(255,255,255,0.55)", 10);
    }
    var idx = Math.floor(((Math.sin(t) + 1) / 2) * (states.length - 1));
    var bx = x0 + idx * 64 + 18;
    drawArrow(ctx, bx, h - 44 - states[idx] * 36, bx + 60, h - 44 - states[Math.min(idx + 1, states.length - 1)] * 36, "#93C5FD", 2);
    drawText(ctx, "Bellman backup", 10, 22, "#93C5FD", 12);
    drawText(ctx, "V(s) <- r + gamma E[V(s') ]", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function TDUpdateVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var sx = w * 0.28;
    var sy = h * 0.58;
    var sx2 = w * 0.62;
    var sy2 = h * 0.42;

    drawDot(ctx, sx, sy, 10, "#60A5FA");
    drawDot(ctx, sx2, sy2, 10, "#34D399");
    drawArrow(ctx, sx + 10, sy - 2, sx2 - 12, sy2 + 2, "#93C5FD", 2.5);
    drawText(ctx, "r", (sx + sx2) / 2 - 5, (sy + sy2) / 2 - 8, "#FDBA74", 12);

    var td = 0.2 + 0.8 * ((Math.sin(t * 2.2) + 1) / 2);
    ctx.fillStyle = "rgba(250,204,21,0.5)";
    drawRoundRect(ctx, 36, 36, 110, 18, 5);
    ctx.fill();
    ctx.fillStyle = "rgba(234,179,8,0.85)";
    drawRoundRect(ctx, 36, 36, 110 * td, 18, 5);
    ctx.fill();

    drawText(ctx, "TD error", 36, 30, "#FCD34D", 11);
    drawText(ctx, "One-step bootstrap target", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function QTableVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var rows = 4;
    var cols = 4;
    var cs = 52;
    var ox = (w - cols * cs) / 2;
    var oy = (h - rows * cs) / 2;
    var active = Math.floor(((Math.sin(t) + 1) / 2) * (rows * cols - 1));
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var idx = r * cols + c;
        var val = 0.2 + 0.7 * ((Math.sin((idx + 1) * 0.7 + t * 1.3) + 1) / 2);
        ctx.fillStyle = "rgba(56,189,248," + (0.12 + val * 0.55).toFixed(3) + ")";
        drawRoundRect(ctx, ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4, 6);
        ctx.fill();
        if (idx === active) {
          ctx.strokeStyle = "#FCD34D";
          ctx.lineWidth = 2;
          drawRoundRect(ctx, ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4, 6);
          ctx.stroke();
        }
      }
    }
    drawText(ctx, "Q(s,a) table / action-values", 10, 22, "#67E8F9", 12);
    drawText(ctx, "Greedy picks max cell per state", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DQNSystemVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 8, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 11);
    }

    box(20, 44, 120, 40, "Q Network", "rgba(96,165,250,0.2)");
    box(200, 44, 120, 40, "Target Q", "rgba(52,211,153,0.2)");
    box(20, 140, 300, 44, "Replay Buffer (s,a,r,s')", "rgba(251,146,60,0.2)");

    drawArrow(ctx, 140, 64, 200, 64, "#93C5FD", 2);
    drawArrow(ctx, 170, 140, 170, 84, "#FDBA74", 2);
    var pulse = 0.4 + 0.6 * ((Math.sin(t * 2) + 1) / 2);
    drawDot(ctx, 170, 110, 4 + pulse * 2, "rgba(250,204,21,0.7)");

    drawText(ctx, "Replay + target network stabilize learning", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function PolicyGradientVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var pts = [
      [cx - 110, cy + 70],
      [cx - 55, cy + 25],
      [cx - 10, cy],
      [cx + 45, cy - 35],
      [cx + 90, cy - 75],
    ];
    ctx.strokeStyle = "rgba(236,72,153,0.75)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i][0], pts[i][1]);
      else ctx.lineTo(pts[i][0], pts[i][1]);
      drawDot(ctx, pts[i][0], pts[i][1], 3, "#F9A8D4");
    }
    ctx.stroke();

    var k = Math.floor(((Math.sin(t * 1.2) + 1) / 2) * (pts.length - 1));
    drawArrow(ctx, pts[k][0], pts[k][1], pts[Math.min(k + 1, pts.length - 1)][0], pts[Math.min(k + 1, pts.length - 1)][1], "#F472B6", 2.5);
    drawText(ctx, "Trajectory-weighted gradient", 10, 22, "#F9A8D4", 12);
    drawText(ctx, "Increase log-prob of high-return actions", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ActorCriticVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 8, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 11);
    }

    box(24, 40, 120, 44, "Actor pi(a|s)", "rgba(52,211,153,0.2)");
    box(196, 40, 120, 44, "Critic V,Q", "rgba(96,165,250,0.2)");
    box(110, 138, 120, 44, "Env + Reward", "rgba(251,146,60,0.2)");

    drawArrow(ctx, 144, 62, 196, 62, "#86EFAC", 2);
    drawArrow(ctx, 84, 84, 130, 138, "#FDBA74", 2);
    drawArrow(ctx, 230, 138, 256, 84, "#93C5FD", 2);
    drawArrow(ctx, 230, 62, 144, 62, "#67E8F9", 1.8);

    var pulse = 0.3 + 0.7 * ((Math.sin(t * 2) + 1) / 2);
    drawDot(ctx, 170, 62, 4 + pulse * 2, "rgba(250,204,21,0.8)");
    drawText(ctx, "advantage signal", 130, 30, "#FCD34D", 10);
    drawText(ctx, "Actor improves, critic evaluates", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ModelPlanningVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var rootX = w / 2;
    var rootY = 38;
    drawDot(ctx, rootX, rootY, 7, "#86EFAC");

    function branch(x1, y1, x2, y2, depth) {
      drawArrow(ctx, x1, y1, x2, y2, "rgba(134,239,172,0.65)", 1.5);
      drawDot(ctx, x2, y2, 4, "rgba(52,211,153,0.65)");
      if (depth <= 0) return;
      var dx = 30 / (4 - depth);
      branch(x2, y2, x2 - dx, y2 + 45, depth - 1);
      branch(x2, y2, x2 + dx, y2 + 45, depth - 1);
    }

    branch(rootX, rootY, rootX - 70, 90, 2);
    branch(rootX, rootY, rootX + 70, 90, 2);

    var sel = ((Math.sin(t * 1.4) + 1) / 2) > 0.5;
    ctx.strokeStyle = "#FCD34D";
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (sel) {
      ctx.moveTo(rootX, rootY);
      ctx.lineTo(rootX + 70, 90);
      ctx.lineTo(rootX + 80, 135);
    } else {
      ctx.moveTo(rootX, rootY);
      ctx.lineTo(rootX - 70, 90);
      ctx.lineTo(rootX - 80, 135);
    }
    ctx.stroke();

    drawText(ctx, "Tree search / rollout planning", 10, 22, "#86EFAC", 12);
    drawText(ctx, "Lookahead selects high-value branch", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DataRegimeVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var mid = w / 2;
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(mid, 18);
    ctx.lineTo(mid, h - 18);
    ctx.stroke();

    function curve(x0, color, shift) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (var i = 0; i <= 80; i++) {
        var x = x0 + (i / 80) * (mid - 28);
        var y = h / 2 + Math.sin(i * 0.09 + t * 0.7 + shift) * 36;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    curve(20, "rgba(56,189,248,0.8)", 0);
    curve(mid + 8, "rgba(244,114,182,0.8)", 1.2);

    drawText(ctx, "On-policy", 34, 28, "#67E8F9", 11);
    drawText(ctx, "Off-policy / Offline", mid + 18, 28, "#F9A8D4", 11);
    drawText(ctx, "Data distribution mismatch is central", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BanditVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var arms = [0.35, 0.55, 0.72, 0.61, 0.48];
    var base = h - 44;
    var best = arms.indexOf(Math.max.apply(null, arms));
    var pulled = Math.floor(((Math.sin(t * 1.2) + 1) / 2) * arms.length);

    for (var i = 0; i < arms.length; i++) {
      var x = 36 + i * 58;
      var bh = arms[i] * 140;
      ctx.fillStyle = i === best ? "rgba(34,197,94,0.6)" : "rgba(148,163,184,0.45)";
      drawRoundRect(ctx, x, base - bh, 34, bh, 6);
      ctx.fill();
      if (i === pulled) {
        ctx.strokeStyle = "#FCD34D";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, x, base - bh, 34, bh, 6);
        ctx.stroke();
      }
    }

    drawText(ctx, "Selected arm", 10, 22, "#FCD34D", 12);
    drawText(ctx, "Explore vs exploit under uncertainty", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ExplorationRewardVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    var gx;
    var gy;
    for (gx = -4; gx <= 4; gx++) {
      for (gy = -4; gy <= 4; gy++) {
        var x = cx + gx * 34;
        var y = cy + gy * 34;
        var novelty = 0.2 + 0.8 * Math.abs(Math.sin(gx * 0.7 + gy * 0.4 + t * 0.3));
        drawDot(ctx, x, y, 2.5, "rgba(236,72,153," + (0.18 + novelty * 0.45).toFixed(3) + ")");
      }
    }

    drawDot(ctx, cx + 90, cy - 80, 6, "#86EFAC");
    drawText(ctx, "task reward", cx + 98, cy - 84, "#86EFAC", 10);
    drawDot(ctx, cx - 80, cy + 70, 6, "#F9A8D4");
    drawText(ctx, "novelty", cx - 72, cy + 82, "#F9A8D4", 10);
    drawText(ctx, "Shaped objective = external + intrinsic", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function MultiAgentVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var cs = 68;
    var ox = (w - cs * 2) / 2;
    var oy = (h - cs * 2) / 2;
    var vals = [
      ["(3,3)", "(0,5)"],
      ["(5,0)", "(1,1)"],
    ];
    for (var r = 0; r < 2; r++) {
      for (var c = 0; c < 2; c++) {
        ctx.fillStyle = "rgba(59,130,246,0.2)";
        drawRoundRect(ctx, ox + c * cs, oy + r * cs, cs - 4, cs - 4, 6);
        ctx.fill();
        drawText(ctx, vals[r][c], ox + c * cs + 14, oy + r * cs + 38, "rgba(255,255,255,0.75)", 11);
      }
    }
    var pulse = ((Math.sin(t * 2) + 1) / 2) > 0.5 ? [0, 1] : [1, 0];
    ctx.strokeStyle = "#FCD34D";
    ctx.lineWidth = 2;
    drawRoundRect(ctx, ox + pulse[1] * cs, oy + pulse[0] * cs, cs - 4, cs - 4, 6);
    ctx.stroke();

    drawText(ctx, "Joint payoff landscape", 10, 22, "#93C5FD", 12);
    drawText(ctx, "Each learner changes others' objective", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function HierarchyVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 8, y + bh / 2 + 4, "rgba(255,255,255,0.85)", 11);
    }

    box(100, 30, 140, 40, "High-level Policy", "rgba(244,114,182,0.2)");
    box(24, 120, 120, 40, "Option 1", "rgba(52,211,153,0.2)");
    box(154, 120, 120, 40, "Option 2", "rgba(52,211,153,0.2)");
    box(84, 188, 170, 40, "Primitive Actions", "rgba(96,165,250,0.2)");

    drawArrow(ctx, 170, 70, 84, 120, "#F9A8D4", 2);
    drawArrow(ctx, 170, 70, 214, 120, "#F9A8D4", 2);
    drawArrow(ctx, 84, 160, 130, 188, "#86EFAC", 2);
    drawArrow(ctx, 214, 160, 196, 188, "#86EFAC", 2);

    var p = 0.35 + 0.65 * ((Math.sin(t * 2.2) + 1) / 2);
    drawDot(ctx, 170, 104, 4 + p * 2, "rgba(250,204,21,0.75)");

    drawText(ctx, "Temporal abstraction with options", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function BeliefStateVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var states = [0.15, 0.25, 0.1, 0.3, 0.2];
    var shift = Math.sin(t * 0.8) * 0.05;
    states = states.map(function (v, i) {
      return Math.max(0.03, v + shift * Math.cos(i));
    });
    var ssum = states.reduce(function (a, b) {
      return a + b;
    }, 0);
    states = states.map(function (v) {
      return v / ssum;
    });

    var base = h - 44;
    for (var i = 0; i < states.length; i++) {
      var x = 34 + i * 56;
      var bh = states[i] * 180;
      ctx.fillStyle = "rgba(99,102,241,0.55)";
      drawRoundRect(ctx, x, base - bh, 30, bh, 5);
      ctx.fill();
      drawText(ctx, "s" + i, x + 7, base + 14, "rgba(255,255,255,0.55)", 10);
    }

    drawText(ctx, "Belief over hidden states", 10, 22, "#A5B4FC", 12);
    drawText(ctx, "POMDP policy acts on belief, not true state", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SafeRLVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var left = 38;
    var right = w - 24;
    var bottom = h - 36;

    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.beginPath();
    ctx.moveTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.moveTo(left, bottom);
    ctx.lineTo(left, 22);
    ctx.stroke();

    var boundY = 80;
    ctx.strokeStyle = "rgba(248,113,113,0.8)";
    ctx.setLineDash([5, 4]);
    ctx.beginPath();
    ctx.moveTo(left, boundY);
    ctx.lineTo(right, boundY);
    ctx.stroke();
    ctx.setLineDash([]);

    var x = left + 20 + ((Math.sin(t * 0.7) + 1) / 2) * (right - left - 40);
    var y = bottom - (0.5 + 0.3 * Math.sin(t * 1.1 + 1.2)) * (bottom - 26);

    drawDot(ctx, x, y, 6, "#60A5FA");
    drawText(ctx, "policy", x + 8, y - 4, "#93C5FD", 10);
    drawText(ctx, "Cost limit", right - 78, boundY - 8, "#FCA5A5", 10);

    ctx.fillStyle = "rgba(34,197,94,0.12)";
    ctx.fillRect(left + 1, boundY, right - left - 2, bottom - boundY);

    drawText(ctx, "Reward vs cost trade-off", 10, 22, "#93C5FD", 12);
    drawText(ctx, "Constrained feasible region", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function ImitationVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var ex = [
      [40, h - 50],
      [90, h - 120],
      [160, h - 160],
      [230, h - 140],
      [300, h - 90],
    ];
    var lrn = ex.map(function (p, i) {
      return [p[0], p[1] + Math.sin(t * 1.4 + i) * 18];
    });

    ctx.strokeStyle = "rgba(52,211,153,0.85)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ex.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();

    ctx.strokeStyle = "rgba(244,114,182,0.85)";
    ctx.beginPath();
    lrn.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();

    drawText(ctx, "Expert", 42, h - 60, "#86EFAC", 10);
    drawText(ctx, "Learner", 42, h - 42, "#F9A8D4", 10);
    drawText(ctx, "Imitation minimizes trajectory divergence", 10, h - 14, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}
