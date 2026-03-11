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
    drawText(ctx, "MDP graph for sequential control", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Discount shrinks far future rewards", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "V(s) <- r + gamma E[V(s') ]", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "One-step bootstrap target", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Greedy picks max cell per state", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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

    drawText(ctx, "Replay + target network stabilize learning", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Increase log-prob of high-return actions", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Actor improves, critic evaluates", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Lookahead selects high-value branch", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Data distribution mismatch is central", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Explore vs exploit under uncertainty", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Shaped objective = external + intrinsic", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Each learner changes others' objective", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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

    drawText(ctx, "Temporal abstraction with options", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "POMDP policy acts on belief, not true state", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Constrained feasible region", 10, h - 20, "rgba(255,255,255,0.55)", 11);
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
    drawText(ctx, "Imitation minimizes trajectory divergence", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SARSAVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var rows = 3;
    var cols = 4;
    var cs = 52;
    var ox = (w - cols * cs) / 2;
    var oy = (h - rows * cs) / 2;
    var step = Math.floor(((Math.sin(t * 0.9) + 1) / 2) * (rows * cols - 1));
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var idx = r * cols + c;
        var val = 0.25 + 0.6 * ((Math.sin((idx + 1) * 0.8 + t * 0.5) + 1) / 2);
        ctx.fillStyle = idx <= step
          ? "rgba(14,165,233," + (0.18 + val * 0.5).toFixed(3) + ")"
          : "rgba(100,116,139,0.18)";
        drawRoundRect(ctx, ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4, 6);
        ctx.fill();
        if (idx === step) {
          ctx.strokeStyle = "#FCD34D";
          ctx.lineWidth = 2;
          drawRoundRect(ctx, ox + c * cs + 2, oy + r * cs + 2, cs - 4, cs - 4, 6);
          ctx.stroke();
          drawText(ctx, "a'~pi", ox + c * cs + 8, oy + r * cs + cs / 2 + 4, "#FCD34D", 10);
        }
      }
    }
    drawText(ctx, "SARSA: on-policy Q update", 10, 22, "#7DD3FC", 12);
    drawText(ctx, "Update uses actual next action a'", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function NStepVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 5;
    var base = h - 44;
    var rewards = [0.9, 0.6, 1.1, 0.4, 0.8];
    var gamma = 0.95;
    var nActive = Math.floor(1 + ((Math.sin(t * 0.6) + 1) / 2) * (n - 1));
    for (var k = 0; k < n; k++) {
      var x = 28 + k * 54;
      var contribution = k < nActive ? Math.pow(gamma, k) * rewards[k] : 0;
      var barH = contribution * 80;
      ctx.fillStyle = k < nActive
        ? "rgba(56,189,248," + (0.35 + contribution * 0.45).toFixed(3) + ")"
        : "rgba(100,116,139,0.18)";
      drawRoundRect(ctx, x, base - barH - 2, 38, barH + 2, 5);
      ctx.fill();
      drawText(ctx, "t+" + k, x + 8, base + 14, "rgba(255,255,255,0.5)", 10);
      if (k < nActive - 1) {
        drawText(ctx, "+", x + 42, base - barH / 2, "#94A3B8", 12);
      }
    }
    var bootstrapX = 28 + nActive * 54;
    if (nActive < n) {
      ctx.fillStyle = "rgba(52,211,153,0.35)";
      drawRoundRect(ctx, bootstrapX, base - 55, 38, 55, 5);
      ctx.fill();
      drawText(ctx, "V(s)", bootstrapX + 6, base - 58, "#6EE7B7", 10);
    }
    drawText(ctx, "n = " + nActive + " steps before bootstrap", 10, 22, "#BAE6FD", 12);
    drawText(ctx, "More steps = less bias, more variance", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function EligibilityTraceVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var nStates = 6;
    var base = h - 44;
    var visitedIdx = Math.floor(((Math.sin(t * 0.7) + 1) / 2) * (nStates - 1));
    var lambda = 0.85;
    for (var i = 0; i < nStates; i++) {
      var x = 22 + i * 50;
      var age = (visitedIdx - i + nStates) % nStates;
      var trace = i === visitedIdx ? 1.0 : Math.max(0, Math.pow(lambda * 0.95, age) * 0.8);
      var barH = trace * 130;
      ctx.fillStyle = i === visitedIdx
        ? "rgba(2,132,199,0.85)"
        : "rgba(2,132,199," + (0.15 + trace * 0.5).toFixed(3) + ")";
      drawRoundRect(ctx, x, base - barH, 34, barH, 5);
      ctx.fill();
      drawText(ctx, "s" + i, x + 8, base + 14, "rgba(255,255,255,0.5)", 10);
    }
    drawText(ctx, "Eligibility traces (lambda=0.85)", 10, 22, "#7DD3FC", 12);
    drawText(ctx, "Visited state spikes, others decay", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DoubleDQNVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 6, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 10);
    }
    box(16, 36, 130, 40, "Online Q (select a*)", "rgba(14,165,233,0.25)");
    box(192, 36, 130, 40, "Target Q (eval Q(s',a*))", "rgba(52,211,153,0.25)");
    box(90, 140, 160, 40, "Bellman Target y", "rgba(251,146,60,0.25)");

    drawArrow(ctx, 146, 56, 192, 56, "#7DD3FC", 2);
    drawArrow(ctx, 257, 76, 200, 140, "#6EE7B7", 2);
    drawArrow(ctx, 81, 56, 81, 140, "#FDBA74", 2);

    var pulse = 0.3 + 0.7 * ((Math.sin(t * 2) + 1) / 2);
    drawDot(ctx, 146, 90, 4 + pulse * 2, "rgba(250,204,21,0.75)");
    drawText(ctx, "argmax decoupled from Q eval", 10, h - 20, "rgba(255,255,255,0.55)", 11);
    drawText(ctx, "Double DQN: decouple select + eval", 10, 22, "#67E8F9", 12);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DuelingDQNVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 6, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 10);
    }
    box(100, 22, 140, 36, "Shared Encoder", "rgba(99,102,241,0.2)");
    box(30, 106, 110, 36, "V(s) stream", "rgba(96,165,250,0.25)");
    box(200, 106, 110, 36, "A(s,a) stream", "rgba(52,211,153,0.25)");
    box(90, 190, 160, 36, "Q = V + A - mean(A)", "rgba(251,146,60,0.25)");

    drawArrow(ctx, 120, 58, 85, 106, "#A5B4FC", 2);
    drawArrow(ctx, 220, 58, 255, 106, "#6EE7B7", 2);
    drawArrow(ctx, 85, 142, 140, 190, "#93C5FD", 2);
    drawArrow(ctx, 255, 142, 200, 190, "#6EE7B7", 2);

    var pulse = 0.35 + 0.65 * ((Math.sin(t * 1.8) + 1) / 2);
    drawDot(ctx, 170, 190, 4 + pulse * 2, "rgba(250,204,21,0.75)");
    drawText(ctx, "Dueling: separate V and advantage heads", 10, 14, "#67E8F9", 12);
    drawText(ctx, "V gets gradient from all actions sampled", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function PrioritizedReplayVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 7;
    var base = h - 44;
    var priorities = [0.9, 0.3, 0.7, 1.0, 0.45, 0.6, 0.2];
    var sampled = Math.floor(((Math.sin(t * 1.2) + 1) / 2) * n);
    for (var i = 0; i < n; i++) {
      var x = 18 + i * 44;
      var bh = priorities[i] * 130;
      ctx.fillStyle = i === sampled
        ? "rgba(21,94,117,0.9)"
        : "rgba(21,94,117," + (0.2 + priorities[i] * 0.5).toFixed(3) + ")";
      drawRoundRect(ctx, x, base - bh, 34, bh, 5);
      ctx.fill();
      if (i === sampled) {
        ctx.strokeStyle = "#FCD34D";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, x, base - bh, 34, bh, 6);
        ctx.stroke();
        drawText(ctx, "p=" + priorities[i].toFixed(1), x + 2, base - bh - 8, "#FCD34D", 9);
      }
      drawText(ctx, "e" + i, x + 9, base + 14, "rgba(255,255,255,0.45)", 10);
    }
    drawText(ctx, "Prioritized Replay (by TD error)", 10, 22, "#A5F3FC", 12);
    drawText(ctx, "High-error transitions sampled more often", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function DDPGVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 6, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 10);
    }
    box(16, 36, 110, 40, "Actor mu(s)", "rgba(5,150,105,0.25)");
    box(196, 36, 120, 40, "Critic Q(s,a)", "rgba(96,165,250,0.25)");
    box(90, 140, 160, 40, "Replay Buffer", "rgba(251,146,60,0.25)");

    drawArrow(ctx, 126, 56, 196, 56, "#6EE7B7", 2);
    drawArrow(ctx, 256, 76, 200, 140, "#93C5FD", 2);
    drawArrow(ctx, 71, 76, 130, 140, "#FDBA74", 2);
    drawArrow(ctx, 170, 140, 71, 76, "#6EE7B7", 1.5);

    var theta = t * 1.5;
    var ax = w * 0.72 + Math.cos(theta) * 18;
    var ay = h * 0.52 + Math.sin(theta) * 12;
    drawDot(ctx, ax, ay, 5, "rgba(52,211,153,0.8)");
    drawText(ctx, "continuous a", ax + 7, ay + 4, "#6EE7B7", 9);
    drawText(ctx, "DDPG: deterministic off-policy AC", 10, 22, "#6EE7B7", 12);
    drawText(ctx, "nabla_a Q guides deterministic actor", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function TD3Vis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 5, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 10);
    }
    box(14, 30, 96, 36, "Actor (delayed)", "rgba(4,120,87,0.3)");
    box(150, 10, 100, 30, "Q1 critic", "rgba(96,165,250,0.25)");
    box(150, 52, 100, 30, "Q2 critic", "rgba(96,165,250,0.2)");
    box(90, 140, 160, 36, "min(Q1,Q2) target", "rgba(52,211,153,0.3)");

    drawArrow(ctx, 110, 48, 150, 25, "#6EE7B7", 1.8);
    drawArrow(ctx, 110, 48, 150, 67, "#6EE7B7", 1.8);
    drawArrow(ctx, 200, 40, 200, 140, "#FCD34D", 1.5);
    drawArrow(ctx, 200, 82, 200, 140, "#FCD34D", 1.5);

    var blink = ((Math.sin(t * 2.5) + 1) / 2) > 0.5;
    ctx.fillStyle = blink ? "rgba(250,204,21,0.8)" : "rgba(250,204,21,0.25)";
    drawRoundRect(ctx, 46, 100, 58, 18, 4);
    ctx.fill();
    drawText(ctx, "every 2 steps", 48, 112, "rgba(0,0,0,0.8)", 9);

    drawText(ctx, "TD3: twin critics + delayed actor", 10, 22, "#6EE7B7", 12);
    drawText(ctx, "min target suppresses Q overestimation", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function SACVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h * 0.45;
    var nActions = 8;
    var entropy = 0.5 + 0.4 * ((Math.sin(t * 0.6) + 1) / 2);
    for (var i = 0; i < nActions; i++) {
      var angle = (i / nActions) * Math.PI * 2 - Math.PI / 2;
      var prob = Math.max(0.04, 0.125 + (0.08 * entropy) * Math.sin(i * 1.3 + t * 0.5));
      var r = 30 + prob * 220;
      var x = cx + Math.cos(angle) * r;
      var y = cy + Math.sin(angle) * r;
      drawDot(ctx, x, y, 3 + prob * 8, "rgba(6,95,70," + (0.4 + prob * 1.2).toFixed(3) + ")");
      drawArrow(ctx, cx, cy, x, y, "rgba(52,211,153," + (0.15 + prob * 0.6).toFixed(3) + ")", 1.5);
    }
    drawDot(ctx, cx, cy, 6, "#A7F3D0");
    drawText(ctx, "H = " + (entropy * 2.1).toFixed(2), cx - 22, cy - 50, "#A7F3D0", 11);
    drawText(ctx, "SAC: stochastic policy + entropy bonus", 10, 22, "#A7F3D0", 12);
    drawText(ctx, "Max-entropy explores multimodal action dist.", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function GAEVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var n = 6;
    var lambda = 0.95;
    var gamma = 0.99;
    var base = h - 44;
    var deltas = [0.8, -0.3, 1.1, 0.4, -0.2, 0.9];
    var lambdaAnim = 0.3 + 0.65 * ((Math.sin(t * 0.5) + 1) / 2);
    for (var k = 0; k < n; k++) {
      var x = 22 + k * 50;
      var weight = Math.pow(gamma * lambdaAnim, k);
      var contrib = deltas[k] * weight;
      var bh = Math.abs(contrib) * 80;
      ctx.fillStyle = contrib >= 0
        ? "rgba(21,128,61," + (0.3 + Math.abs(weight) * 0.55).toFixed(3) + ")"
        : "rgba(220,38,38," + (0.3 + Math.abs(weight) * 0.55).toFixed(3) + ")";
      if (contrib >= 0) {
        drawRoundRect(ctx, x, base - bh, 36, bh, 5);
      } else {
        drawRoundRect(ctx, x, base, 36, bh, 5);
      }
      ctx.fill();
      drawText(ctx, "d" + k, x + 8, base + 16, "rgba(255,255,255,0.5)", 10);
      if (k < n - 1) {
        drawText(ctx, "x(gl)^" + k, x + 38, base - 28, "rgba(148,163,184,0.65)", 9);
      }
    }
    drawText(ctx, "lambda = " + lambdaAnim.toFixed(2), 10, 22, "#86EFAC", 12);
    drawText(ctx, "GAE: exponentially weighted TD errors", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function IRLVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var cx = w / 2;
    var cy = h / 2;
    for (var gx = -4; gx <= 4; gx++) {
      for (var gy = -3; gy <= 3; gy++) {
        var x = cx + gx * 32;
        var y = cy + gy * 32;
        var reward = 0.1 + 0.9 * Math.exp(-0.08 * (gx * gx + gy * gy));
        drawDot(ctx, x, y, 3, "rgba(124,58,237," + (0.12 + reward * 0.55).toFixed(3) + ")");
      }
    }
    var expertPath = [
      [cx - 96, cy + 64],
      [cx - 64, cy + 32],
      [cx - 32, cy + 16],
      [cx, cy],
      [cx + 32, cy - 16],
    ];
    ctx.strokeStyle = "rgba(167,243,208,0.9)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    expertPath.forEach(function (p, i) {
      if (i === 0) ctx.moveTo(p[0], p[1]);
      else ctx.lineTo(p[0], p[1]);
    });
    ctx.stroke();
    expertPath.forEach(function (p) {
      drawDot(ctx, p[0], p[1], 4, "#86EFAC");
    });
    var pulse = 0.3 + 0.7 * ((Math.sin(t * 1.5) + 1) / 2);
    drawText(ctx, "Inferred reward heatmap", 10, 22, "#C4B5FD", 12);
    drawText(ctx, "Expert trajectory shapes reward recovery", 10, h - 20, "rgba(255,255,255,0.55)", 11);
    drawDot(ctx, cx, cy, 6 + pulse * 3, "rgba(124,58,237,0.7)");
  }, []);
  return <Canvas2D draw={draw} />;
}

export function RLHFVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    function box(x, y, bw, bh, label, color) {
      ctx.fillStyle = color;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1.2;
      drawRoundRect(ctx, x, y, bw, bh, 8);
      ctx.stroke();
      drawText(ctx, label, x + 5, y + bh / 2 + 4, "rgba(255,255,255,0.8)", 10);
    }
    box(14, 22, 110, 36, "Human Prefs", "rgba(109,40,217,0.3)");
    box(166, 22, 120, 36, "Reward Model", "rgba(91,33,182,0.3)");
    box(60, 120, 120, 36, "PPO Policy", "rgba(76,29,149,0.35)");
    box(200, 120, 100, 36, "KL Penalty", "rgba(126,34,206,0.2)");

    drawArrow(ctx, 124, 40, 166, 40, "#C4B5FD", 2);
    drawArrow(ctx, 226, 58, 200, 120, "#DDD6FE", 1.8);
    drawArrow(ctx, 120, 120, 200, 138, "#C4B5FD", 1.5);
    drawArrow(ctx, 120, 120, 120, 58, "#DDD6FE", 1.5);

    var pulse = 0.4 + 0.6 * ((Math.sin(t * 1.8) + 1) / 2);
    drawDot(ctx, 160, 90, 4 + pulse * 2, "rgba(196,181,253,0.8)");
    drawText(ctx, "RLHF: reward model from human labels", 10, 14, "#DDD6FE", 12);
    drawText(ctx, "KL penalty prevents reward hacking", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function MetaRLVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    drawGrid(ctx, w, h);
    var metaX = w * 0.5;
    var metaY = h * 0.28;
    drawDot(ctx, metaX, metaY, 9, "#DDD6FE");
    drawText(ctx, "meta theta", metaX - 28, metaY - 12, "#DDD6FE", 10);

    var tasks = [
      { x: w * 0.22, y: h * 0.72, label: "task 1" },
      { x: w * 0.5, y: h * 0.72, label: "task 2" },
      { x: w * 0.78, y: h * 0.72, label: "task 3" },
    ];

    tasks.forEach(function (task, i) {
      var adaptedX = task.x + Math.sin(t * 1.2 + i * 2) * 8;
      var adaptedY = task.y + Math.cos(t * 0.9 + i) * 6;
      drawArrow(ctx, metaX, metaY + 10, adaptedX, adaptedY - 8, "rgba(167,243,208,0.5)", 1.5);
      drawDot(ctx, adaptedX, adaptedY, 6, "rgba(167,243,208,0.75)");
      drawText(ctx, task.label, adaptedX - 16, adaptedY + 14, "#A7F3D0", 10);
    });

    var outerPulse = 0.3 + 0.7 * ((Math.sin(t * 0.5) + 1) / 2);
    ctx.strokeStyle = "rgba(221,214,254," + outerPulse.toFixed(2) + ")";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.arc(metaX, metaY, 28, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    drawText(ctx, "Meta-RL: fast adapt from shared init", 10, 22, "#DDD6FE", 12);
    drawText(ctx, "Inner loop adapts; outer loop improves init", 10, h - 20, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}

export function CurriculumVis() {
  var draw = useCallback(function (ctx, w, h, t) {
    var stages = 4;
    var stageW = (w - 30) / stages;
    var progress = (Math.sin(t * 0.4) + 1) / 2;
    var activeStage = Math.min(Math.floor(progress * stages * 1.2), stages - 1);

    for (var i = 0; i < stages; i++) {
      var x = 14 + i * stageW;
      var complexity = (i + 1) / stages;
      ctx.fillStyle = i <= activeStage
        ? "rgba(76,29,149," + (0.25 + complexity * 0.45).toFixed(3) + ")"
        : "rgba(76,29,149,0.1)";
      drawRoundRect(ctx, x, 36, stageW - 6, h - 72, 8);
      ctx.fill();
      ctx.strokeStyle = i === activeStage ? "#DDD6FE" : "rgba(255,255,255,0.12)";
      ctx.lineWidth = i === activeStage ? 2 : 1;
      drawRoundRect(ctx, x, 36, stageW - 6, h - 72, 8);
      ctx.stroke();
      drawText(ctx, "Stage " + (i + 1), x + 8, h - 28, "rgba(255,255,255," + (i <= activeStage ? "0.75" : "0.3") + ")", 10);

      for (var j = 0; j < i + 1; j++) {
        var dotX = x + 12 + j * 16;
        var dotY = h * 0.45 + Math.sin(t + i + j) * 10;
        drawDot(ctx, dotX, dotY, 3 + i, "rgba(196,181,253," + (i <= activeStage ? "0.7" : "0.25") + ")");
      }
    }
    drawText(ctx, "Curriculum: progress from easy to hard", 10, 22, "#DDD6FE", 12);
    drawText(ctx, "Advance stage when success rate crosses threshold", 10, h - 16, "rgba(255,255,255,0.55)", 11);
  }, []);
  return <Canvas2D draw={draw} />;
}
