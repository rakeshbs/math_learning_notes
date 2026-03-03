import { useCallback, useState } from "react";
import { Canvas2D } from "../../matrix-intuition/components/Canvas2D";
import {
  drawGrid,
  drawArrow,
  drawText,
  drawDot,
  drawRoundRect,
} from "../../matrix-intuition/drawing/helpers";

function drawCenteredText(ctx, text, x, y, color, size) {
  ctx.font = "600 " + (size || 11) + "px monospace";
  ctx.fillStyle = color || "#fff";
  ctx.textAlign = "center";
  ctx.fillText(text, x, y);
  ctx.textAlign = "left";
}

// ── Streaming Multiprocessor ───────────────────────────────────────────────
export function SMVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;
        var smW = Math.min(240, w - 20);
        var smH = 200;
        var sx = cx - smW / 2, sy = 30;

        ctx.strokeStyle = "#76B900";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, sx, sy, smW, smH, 10);
        ctx.stroke();
        drawCenteredText(ctx, "Streaming Multiprocessor", cx, sy + 18, "#A8E063", 11);

        // Warp schedulers — 4 equal boxes filling row
        var schCount = 4;
        var schPad = 10;
        var schW = Math.floor((smW - schPad * 2 - (schCount - 1) * 4) / schCount);
        var schH = 28;
        var schColors = ["#00A3E0", "#3B82F6", "#7C3AED", "#EF4444"];
        for (var i = 0; i < schCount; i++) {
          var schX = sx + schPad + i * (schW + 4);
          ctx.fillStyle = schColors[i] + "33";
          ctx.strokeStyle = schColors[i];
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, schX, sy + 28, schW, schH, 6);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, "WS" + (i + 1), schX + schW / 2, sy + 47, schColors[i], 10);
        }
        drawText(ctx, "Warp Schedulers", sx + schPad, sy + 74, "rgba(255,255,255,0.4)", 9);

        // CUDA cores grid
        var cols = 8, rows = 4;
        var coreSize = 16, coreGap = 3;
        var gridX = sx + schPad, gridY = sy + 86;
        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var idx = r * cols + c;
            var active = Math.sin(t * 2 + idx * 0.3) > 0;
            ctx.fillStyle = active ? "#76B900cc" : "rgba(118,185,0,0.15)";
            ctx.strokeStyle = "#76B900";
            ctx.lineWidth = 1;
            drawRoundRect(ctx, gridX + c * (coreSize + coreGap), gridY + r * (coreSize + coreGap), coreSize, coreSize, 3);
            ctx.fill();
            ctx.stroke();
          }
        }
        drawText(ctx, "CUDA Cores (32×)", sx + schPad, sy + smH - 12, "rgba(255,255,255,0.4)", 9);

        // Register file
        var rfW = 42, rfH = 76;
        var rfX = sx + smW - rfW - schPad;
        ctx.fillStyle = "rgba(245,158,11,0.12)";
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, rfX, gridY, rfW, rfH, 6);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "RF", rfX + rfW / 2, gridY + rfH / 2 + 4, "#FCD34D", 10);

        drawText(ctx, "One SM: 128 cores, 4 warp schedulers", sx, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Warp Execution ──────────────────────────────────────────────────────────
export function WarpVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;
        var step = Math.floor(t * 1.2) % 6;

        var cols = 8, rows = 4;
        var tW = 28, tH = 22, gap = 4;
        var gx = cx - (cols * (tW + gap)) / 2 + gap / 2;
        var gy = 58;

        drawCenteredText(ctx, "32 Threads — one Warp", cx, gy - 12, "#67D8FF", 12);

        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var tid = r * cols + c;
            ctx.fillStyle = "#00A3E0cc";
            ctx.strokeStyle = "#67D8FF";
            ctx.lineWidth = 1.5;
            drawRoundRect(ctx, gx + c * (tW + gap), gy + r * (tH + gap), tW, tH, 4);
            ctx.fill();
            ctx.stroke();
            drawCenteredText(ctx, "" + tid, gx + c * (tW + gap) + tW / 2, gy + r * (tH + gap) + 15, "#fff", 9);
          }
        }

        var instY = gy + rows * (tH + gap) + 18;
        var instructions = ["LOAD r0, [addr]", "FMUL r1, r0, r2", "FADD r3, r1, r4", "STORE [addr], r3", "BRA .loop", "NOP / sync"];
        var inst = instructions[step % instructions.length];
        ctx.fillStyle = "rgba(0,163,224,0.12)";
        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cx - 110, instY, 220, 32, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "→  " + inst, cx, instY + 21, "#A8E063", 12);
        drawCenteredText(ctx, "All 32 threads: same instruction", cx, instY + 48, "rgba(255,255,255,0.4)", 10);
        drawText(ctx, "Warp = SIMT unit of execution", 6, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Thread Hierarchy ────────────────────────────────────────────────────────
export function ThreadHierarchyVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;
        var boxW = Math.min(240, w - 20);

        // Grid level
        ctx.strokeStyle = "#FF6D00";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, cx - boxW / 2, 12, boxW, 48, 10);
        ctx.stroke();
        drawCenteredText(ctx, "Grid  (all blocks for this kernel)", cx, 40, "#FFB74D", 11);

        // 4 blocks
        var blockColors = ["#3B82F6", "#7C3AED", "#EF4444", "#10B981"];
        var blockW = 54, blockH = 90, blockGap = 8;
        var blocksTotal = 4 * blockW + 3 * blockGap;
        var bStartX = cx - blocksTotal / 2;

        for (var b = 0; b < 4; b++) {
          var bx = bStartX + b * (blockW + blockGap);
          ctx.fillStyle = blockColors[b] + "22";
          ctx.strokeStyle = blockColors[b];
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, bx, 78, blockW, blockH, 8);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, "B" + b, bx + blockW / 2, 96, blockColors[b], 10);

          for (var ti = 0; ti < 6; ti++) {
            var tx = bx + 5 + (ti % 3) * 15;
            var ty = 103 + Math.floor(ti / 3) * 15;
            var pulse = Math.sin(t * 2.5 + b * 1.1 + ti * 0.4) > 0.2;
            ctx.fillStyle = pulse ? blockColors[b] + "cc" : blockColors[b] + "33";
            ctx.beginPath();
            ctx.arc(tx + 6, ty + 6, 5.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        drawCenteredText(ctx, "Blocks (share shmem + can sync)", cx, 182, "rgba(255,255,255,0.4)", 9);

        // Warp grouping
        ctx.setLineDash([4, 4]);
        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, bStartX, 194, blocksTotal / 2 - 4, 28, 6);
        ctx.stroke();
        ctx.setLineDash([]);
        drawCenteredText(ctx, "Warp (32 threads)", bStartX + (blocksTotal / 2 - 4) / 2, 212, "#67D8FF", 10);

        drawText(ctx, "Thread → Block → Grid hierarchy", 6, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Tensor Cores ───────────────────────────────────────────────────────────
export function TensorCoreVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var sz = 52;
        var ax = cx - 115, ay = 50;
        var bx = cx - 50, by = 50;
        var outX = cx + 30, outY = 50;

        function drawTile(x, y, label, color, pulse) {
          var alpha = pulse ? (0.6 + Math.sin(t * 3) * 0.3) : 0.3;
          ctx.fillStyle = color + Math.round(alpha * 255).toString(16).padStart(2, "0");
          ctx.strokeStyle = color;
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, x, y, sz, sz, 6);
          ctx.fill();
          ctx.stroke();
          for (var i = 1; i < 4; i++) {
            ctx.strokeStyle = color + "44";
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(x + i * sz / 4, y); ctx.lineTo(x + i * sz / 4, y + sz); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(x, y + i * sz / 4); ctx.lineTo(x + sz, y + i * sz / 4); ctx.stroke();
          }
          drawCenteredText(ctx, label, x + sz / 2, y + sz / 2 + 5, "#fff", 14);
          drawCenteredText(ctx, "16×16", x + sz / 2, y + sz + 14, color, 9);
        }

        drawTile(ax, ay, "A", "#00BCD4", true);
        drawTile(bx, by, "B", "#3B82F6", false);
        drawArrow(ctx, bx + sz + 6, ay + sz / 2, outX - 6, outY + sz / 2, "#80DEEA");
        drawCenteredText(ctx, "MMA", cx - 10, ay + sz / 2 - 10, "rgba(255,255,255,0.4)", 9);
        drawTile(outX, outY, "D", "#A8E063", false);
        drawCenteredText(ctx, "D = A×B + C", outX + sz / 2, outY + sz + 28, "#A8E063", 10);

        drawCenteredText(ctx, "FP16", ax + sz / 2, ay - 8, "#80DEEA", 9);
        drawCenteredText(ctx, "FP16", bx + sz / 2, by - 8, "#93C5FD", 9);
        drawCenteredText(ctx, "FP32", outX + sz / 2, outY - 8, "#A8E063", 9);

        var noteW = Math.min(240, w - 20);
        ctx.fillStyle = "rgba(0,188,212,0.08)";
        ctx.strokeStyle = "#00BCD4";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, cx - noteW / 2, h - 68, noteW, 40, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "1 TC op = 256 FMAs / clock", cx, h - 50, "#80DEEA", 10);
        drawCenteredText(ctx, "vs 1 FMA/clock on CUDA core", cx, h - 34, "rgba(255,255,255,0.4)", 10);
      }, [])}
    />
  );
}

// ── Memory Hierarchy ───────────────────────────────────────────────────────
export function MemoryHierarchyVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;
        var maxW = Math.min(240, w - 20);

        var levels = [
          { label: "Registers", bw: "~20 TB/s", lat: "~1 cy", color: "#A8E063", w: Math.round(maxW * 0.34) },
          { label: "Shared Mem / L1$", bw: "~19 TB/s", lat: "~20 cy", color: "#67D8FF", w: Math.round(maxW * 0.62) },
          { label: "L2 Cache", bw: "~4 TB/s", lat: "~200 cy", color: "#FFB74D", w: Math.round(maxW * 0.83) },
          { label: "Global (HBM)", bw: "~2 TB/s", lat: "~600 cy", color: "#F87171", w: maxW },
        ];

        var startY = 26;
        var blockH = 46;
        var gap = 8;

        levels.forEach(function (lev, i) {
          var bx = cx - lev.w / 2;
          var by = startY + i * (blockH + gap);
          var pulse = Math.sin(t * 1.5 + i * 0.8) * 0.1 + 0.15;
          ctx.fillStyle = lev.color + Math.round(pulse * 255).toString(16).padStart(2, "0");
          ctx.strokeStyle = lev.color;
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, bx, by, lev.w, blockH, 8);
          ctx.fill();
          ctx.stroke();
          drawText(ctx, lev.label, bx + 8, by + 18, lev.color, 11);
          drawText(ctx, lev.bw, bx + 8, by + 33, "rgba(255,255,255,0.55)", 9);
          // right-align latency
          ctx.font = "600 9px monospace";
          ctx.fillStyle = "rgba(255,255,255,0.4)";
          ctx.textAlign = "right";
          ctx.fillText(lev.lat, bx + lev.w - 6, by + 33);
          ctx.textAlign = "left";

          if (i < levels.length - 1) {
            ctx.strokeStyle = "rgba(255,255,255,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(cx, by + blockH);
            ctx.lineTo(cx, by + blockH + gap);
            ctx.stroke();
          }
        });

        drawText(ctx, "Bandwidth ↑  Latency ↓  going up", 8, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── SIMT Execution ─────────────────────────────────────────────────────────
export function SIMTVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var instY = 38;
        ctx.fillStyle = "rgba(59,130,246,0.15)";
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, cx - 100, instY, 200, 34, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "FADD r1, r2, r3", cx, instY + 22, "#93C5FD", 13);
        drawCenteredText(ctx, "One Instruction", cx, instY - 10, "rgba(255,255,255,0.4)", 9);

        var laneCount = 8;
        var laneW = 28, laneH = 118;
        var laneGap = 4;
        var startX = cx - laneCount * (laneW + laneGap) / 2;
        var laneY = 100;

        for (var i = 0; i < laneCount; i++) {
          var lx = startX + i * (laneW + laneGap);
          ctx.strokeStyle = "rgba(59,130,246,0.5)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx, instY + 34);
          ctx.lineTo(lx + laneW / 2, laneY);
          ctx.stroke();

          var active = Math.sin(t * 2 + i * 0.7) > -0.5;
          ctx.fillStyle = active ? "#3B82F6cc" : "rgba(59,130,246,0.12)";
          ctx.strokeStyle = active ? "#93C5FD" : "#3B82F644";
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, lx, laneY, laneW, laneH, 4);
          ctx.fill();
          ctx.stroke();

          for (var row = 0; row < 4; row++) {
            var val = ((i * 7 + row * 3 + Math.floor(t)) % 16).toString(16).toUpperCase();
            drawCenteredText(ctx, val, lx + laneW / 2, laneY + 22 + row * 24, active ? "#fff" : "rgba(255,255,255,0.2)", 9);
          }
          drawCenteredText(ctx, "T" + i, lx + laneW / 2, laneY + laneH + 13, "#93C5FD", 9);
        }
        drawCenteredText(ctx, "(×4 = 32 lanes total)", cx, laneY + laneH + 26, "rgba(255,255,255,0.3)", 9);
        drawText(ctx, "SIMT: same instruction, independent data", 4, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Warp Divergence ────────────────────────────────────────────────────────
export function WarpDivergenceVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var laneCount = 8;
        var laneW = 26, laneH = 72, laneGap = 5;
        var gx = cx - laneCount * (laneW + laneGap) / 2;

        ctx.fillStyle = "rgba(239,68,68,0.15)";
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, cx - 90, 22, 180, 30, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "if (threadIdx.x < 4)", cx, 41, "#F87171", 11);

        drawText(ctx, "Pass 1 — IF branch active", gx, 74, "#A8E063", 10);
        for (var i = 0; i < laneCount; i++) {
          var lx = gx + i * (laneW + laneGap);
          var taken = i < 4;
          ctx.fillStyle = taken ? "#A8E06388" : "rgba(255,255,255,0.05)";
          ctx.strokeStyle = taken ? "#A8E063" : "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, lx, 80, laneW, laneH, 4);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, taken ? "ON" : "OFF", lx + laneW / 2, 80 + laneH / 2 + 4, taken ? "#A8E063" : "rgba(255,255,255,0.2)", 8);
        }

        drawText(ctx, "Pass 2 — ELSE branch active", gx, 168, "#F87171", 10);
        for (var j = 0; j < laneCount; j++) {
          var lx2 = gx + j * (laneW + laneGap);
          var elseActive = j >= 4;
          ctx.fillStyle = elseActive ? "#EF444488" : "rgba(255,255,255,0.05)";
          ctx.strokeStyle = elseActive ? "#F87171" : "rgba(255,255,255,0.15)";
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, lx2, 174, laneW, laneH, 4);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, elseActive ? "ON" : "OFF", lx2 + laneW / 2, 174 + laneH / 2 + 4, elseActive ? "#F87171" : "rgba(255,255,255,0.2)", 8);
        }

        var costW = Math.min(220, w - 20);
        ctx.fillStyle = "rgba(239,68,68,0.08)";
        ctx.strokeStyle = "#EF4444";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, cx - costW / 2, 260, costW, 30, 6);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "2× serialized passes = 2× slower", cx, 279, "#F87171", 11);
        drawText(ctx, "Avoid divergence within a warp", 8, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Occupancy ──────────────────────────────────────────────────────────────
export function OccupancyVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;
        var smW = Math.min(w - 20, 270);
        var smH = 198;
        var sx = cx - smW / 2, sy = 26;

        ctx.strokeStyle = "#76B900";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, sx, sy, smW, smH, 10);
        ctx.stroke();
        drawCenteredText(ctx, "SM Resources", cx, sy + 18, "#A8E063", 11);

        var maxWarps = 16;
        var activeWarps = 10;
        var wcols = 8;
        var wW = Math.floor((smW - 24) / wcols) - 3;
        var wH = 18;
        var wgx = sx + 10, wgy = sy + 28;
        for (var i = 0; i < maxWarps; i++) {
          var wx = wgx + (i % wcols) * (wW + 3);
          var wy = wgy + Math.floor(i / wcols) * (wH + 3);
          ctx.fillStyle = i < activeWarps ? "#76B900bb" : "rgba(118,185,0,0.12)";
          ctx.strokeStyle = "#76B900";
          ctx.lineWidth = 1;
          drawRoundRect(ctx, wx, wy, wW, wH, 3);
          ctx.fill();
          ctx.stroke();
        }
        drawText(ctx, "Warps: " + activeWarps + "/" + maxWarps, wgx, wgy + 2 * (wH + 3) + 16, "#A8E063", 10);

        var barW = smW - 20;
        var regY = sy + 105;
        ctx.fillStyle = "rgba(245,158,11,0.12)";
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, sx + 10, regY, barW, 28, 6);
        ctx.fill();
        ctx.stroke();
        var regFill = 0.7 + Math.sin(t * 0.8) * 0.1;
        ctx.fillStyle = "#F59E0Baa";
        ctx.beginPath();
        ctx.roundRect(sx + 12, regY + 2, (barW - 4) * regFill, 24, 4);
        ctx.fill();
        drawText(ctx, "Registers: " + Math.round(regFill * 100) + "% used", sx + 16, regY + 18, "#FCD34D", 10);

        var shY = sy + 142;
        ctx.fillStyle = "rgba(0,163,224,0.12)";
        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, sx + 10, shY, barW, 28, 6);
        ctx.fill();
        ctx.stroke();
        var shFill = 0.45 + Math.sin(t * 0.6 + 1) * 0.08;
        ctx.fillStyle = "#00A3E0aa";
        ctx.beginPath();
        ctx.roundRect(sx + 12, shY + 2, (barW - 4) * shFill, 24, 4);
        ctx.fill();
        drawText(ctx, "Shared Mem: " + Math.round(shFill * 100) + "% used", sx + 16, shY + 18, "#67D8FF", 10);

        var occ = Math.round((activeWarps / maxWarps) * 100);
        drawCenteredText(ctx, "Occupancy: " + occ + "%" + (occ >= 75 ? "  ✓ Good" : "  ↑ Low"), cx, sy + smH + 20, occ >= 75 ? "#A8E063" : "#F87171", 13);
        drawText(ctx, "High occupancy hides memory latency", 8, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Latency Hiding ─────────────────────────────────────────────────────────
export function LatencyHidingVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var speed = 0.4;
        var offset = (t * speed) % 1;

        var warps = 4;
        var warpColors = ["#00A3E0", "#A8E063", "#FFB74D", "#F87171"];
        var memLen = 96;
        var compLen = 58;
        var labels = ["Warp 0", "Warp 1", "Warp 2", "Warp 3"];
        var phases = [0, 0.25, 0.5, 0.75];

        var labelW = 44;
        var timelineX = labelW + 4;
        var timelineW = w - timelineX - 8;
        var rowH = 44;
        var startY = 40;
        var cycleLen = memLen + compLen + 10;

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(timelineX, startY + warps * rowH + 8);
        ctx.lineTo(timelineX + timelineW, startY + warps * rowH + 8);
        ctx.stroke();
        drawText(ctx, "Time →", timelineX + timelineW - 38, startY + warps * rowH + 22, "rgba(255,255,255,0.3)", 9);

        for (var w2 = 0; w2 < warps; w2++) {
          var ry = startY + w2 * rowH;
          drawText(ctx, labels[w2], 0, ry + 20, warpColors[w2], 10);

          var phase = (offset + phases[w2]) % 1;
          var px = timelineX + phase * cycleLen;

          var msW = Math.min(memLen, timelineX + timelineW - px);
          if (msW > 0) {
            ctx.fillStyle = "rgba(239,68,68,0.25)";
            ctx.strokeStyle = "#F87171";
            ctx.lineWidth = 1;
            drawRoundRect(ctx, px, ry + 4, msW, 28, 4);
            ctx.fill();
            ctx.stroke();
            if (msW > 30) drawCenteredText(ctx, "MEM", px + msW / 2, ry + 22, "#F87171", 9);
          }

          var cpStart = px + memLen;
          var cpW = Math.min(compLen, timelineX + timelineW - cpStart);
          if (cpW > 0 && cpStart < timelineX + timelineW) {
            ctx.fillStyle = warpColors[w2] + "55";
            ctx.strokeStyle = warpColors[w2];
            ctx.lineWidth = 1;
            drawRoundRect(ctx, cpStart, ry + 4, cpW, 28, 4);
            ctx.fill();
            ctx.stroke();
            if (cpW > 22) drawCenteredText(ctx, "EXEC", cpStart + cpW / 2, ry + 22, warpColors[w2], 9);
          }
        }

        drawText(ctx, "Staggered warps fill memory stall slots", 4, h - 26, "rgba(255,255,255,0.4)", 10);
        drawText(ctx, "→ compute unit stays busy", 4, h - 12, "rgba(255,255,255,0.3)", 9);
      }, [])}
    />
  );
}

// ── Memory Coalescing ──────────────────────────────────────────────────────
export function CoalescingVis() {
  var st = useState(true);
  var coalesced = st[0];
  var setCoalesced = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;

      var tCount = 8;
      var tW = 28, tH = 22, tGap = 4;
      var gx = cx - tCount * (tW + tGap) / 2;
      var gy = 36;
      for (var i = 0; i < tCount; i++) {
        ctx.fillStyle = "#00A3E0aa";
        ctx.strokeStyle = "#67D8FF";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, gx + i * (tW + tGap), gy, tW, tH, 4);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "T" + i, gx + i * (tW + tGap) + tW / 2, gy + 15, "#fff", 9);
      }
      drawText(ctx, "Threads", gx, gy - 10, "rgba(255,255,255,0.4)", 9);

      var memCount = 12;
      var cellW = Math.floor((w - 24) / memCount) - 2;
      var cellH = 22;
      var memY = 112;
      var memX = cx - (memCount * (cellW + 2)) / 2;

      for (var j = 0; j < tCount; j++) {
        var threadCX = gx + j * (tW + tGap) + tW / 2;
        var targetCell = coalesced ? j : (j * 2) % memCount;
        var memCX = memX + targetCell * (cellW + 2) + cellW / 2;
        var anim = Math.sin(t * 2.5 + j * 0.4) * 0.3 + 0.7;
        ctx.strokeStyle = coalesced ? "rgba(168,224,99," + anim + ")" : "rgba(239,68,68," + anim + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(threadCX, gy + tH);
        ctx.quadraticCurveTo((threadCX + memCX) / 2, memY - 22, memCX, memY);
        ctx.stroke();
      }

      for (var k = 0; k < memCount; k++) {
        var accessed = coalesced ? k < tCount : (k % 2 === 0 && k / 2 < tCount);
        ctx.fillStyle = accessed ? (coalesced ? "#A8E063aa" : "#EF4444aa") : "rgba(255,255,255,0.06)";
        ctx.strokeStyle = accessed ? (coalesced ? "#A8E063" : "#EF4444") : "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, memX + k * (cellW + 2), memY, cellW, cellH, 3);
        ctx.fill();
        ctx.stroke();
        if (cellW >= 14) drawCenteredText(ctx, "" + k, memX + k * (cellW + 2) + cellW / 2, memY + 15, "rgba(255,255,255,0.5)", 8);
      }
      drawText(ctx, "Global Memory", memX, memY + cellH + 12, "rgba(255,255,255,0.3)", 9);

      var txns = coalesced ? 1 : tCount;
      var statusW = Math.min(200, w - 20);
      ctx.fillStyle = coalesced ? "rgba(168,224,99,0.1)" : "rgba(239,68,68,0.1)";
      ctx.strokeStyle = coalesced ? "#A8E063" : "#EF4444";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, cx - statusW / 2, memY + cellH + 28, statusW, 30, 8);
      ctx.fill();
      ctx.stroke();
      drawCenteredText(ctx, txns + " memory transaction" + (txns > 1 ? "s" : ""), cx, memY + cellH + 48, coalesced ? "#A8E063" : "#F87171", 12);
    },
    [coalesced]
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {[true, false].map(function (c) {
          return (
            <button
              key={String(c)}
              onClick={function () { setCoalesced(c); }}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: coalesced === c ? (c ? "#A8E063" : "#EF4444") : "rgba(255,255,255,0.08)",
                color: coalesced === c ? "#000" : "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {c ? "Coalesced" : "Strided"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Bank Conflicts ─────────────────────────────────────────────────────────
export function BankConflictsVis() {
  var st = useState(false);
  var conflict = st[0];
  var setConflict = st[1];

  var draw = useCallback(
    function (ctx, w, h, t) {
      drawGrid(ctx, w, h);
      var cx = w / 2;

      var bankCount = 12;
      var bW = Math.floor((w - 24) / bankCount) - 3;
      var bH = 28;
      var bStartX = cx - (bankCount * (bW + 3)) / 2;
      var bankY = h - 76;

      var tCount = 8;
      var tW = 28, tH = 22, tGap = 4;
      var tgx = cx - tCount * (tW + tGap) / 2;
      var tgy = 32;

      for (var i = 0; i < tCount; i++) {
        ctx.fillStyle = "#00A3E0aa";
        ctx.strokeStyle = "#67D8FF";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, tgx + i * (tW + tGap), tgy, tW, tH, 4);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "T" + i, tgx + i * (tW + tGap) + tW / 2, tgy + 15, "#fff", 9);
      }

      for (var j = 0; j < tCount; j++) {
        var tcx = tgx + j * (tW + tGap) + tW / 2;
        var targetBank = conflict ? 0 : j;
        var bcx = bStartX + targetBank * (bW + 3) + bW / 2;
        var anim = 0.5 + Math.sin(t * 2 + j * 0.5) * 0.3;
        ctx.strokeStyle = conflict ? "rgba(239,68,68," + anim + ")" : "rgba(168,224,99," + anim + ")";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(tcx, tgy + tH);
        ctx.quadraticCurveTo((tcx + bcx) / 2, bankY - 44, bcx, bankY);
        ctx.stroke();
      }

      for (var k = 0; k < bankCount; k++) {
        var hot = conflict ? k === 0 : k < tCount;
        ctx.fillStyle = hot ? (conflict ? "#EF444488" : "#A8E06388") : "rgba(255,255,255,0.06)";
        ctx.strokeStyle = hot ? (conflict ? "#EF4444" : "#A8E063") : "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        drawRoundRect(ctx, bStartX + k * (bW + 3), bankY, bW, bH, 3);
        ctx.fill();
        ctx.stroke();
        if (bW >= 10) drawCenteredText(ctx, "" + k, bStartX + k * (bW + 3) + bW / 2, bankY + 19, "rgba(255,255,255,0.5)", 7);
      }
      drawCenteredText(ctx, "Shared Memory Banks (×2 = 32)", cx, bankY + bH + 14, "rgba(255,255,255,0.3)", 9);

      var serialized = conflict ? tCount : 1;
      var msgW = Math.min(210, w - 20);
      ctx.fillStyle = conflict ? "rgba(239,68,68,0.1)" : "rgba(168,224,99,0.1)";
      ctx.strokeStyle = conflict ? "#EF4444" : "#A8E063";
      ctx.lineWidth = 1.5;
      drawRoundRect(ctx, cx - msgW / 2, tgy + tH + 18, msgW, 28, 8);
      ctx.fill();
      ctx.stroke();
      drawCenteredText(ctx, conflict ? "8-way conflict → 8 serial passes" : "No conflict — 1 pass", cx, tgy + tH + 36, conflict ? "#F87171" : "#A8E063", 10);
    },
    [conflict]
  );

  return (
    <div>
      <Canvas2D draw={draw} />
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {[false, true].map(function (c) {
          return (
            <button
              key={String(c)}
              onClick={function () { setConflict(c); }}
              style={{
                padding: "6px 16px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
                background: conflict === c ? (c ? "#EF4444" : "#A8E063") : "rgba(255,255,255,0.08)",
                color: conflict === c ? (c ? "#fff" : "#000") : "rgba(255,255,255,0.5)",
                fontFamily: "monospace",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {c ? "8-way Conflict" : "No Conflict"}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Roofline Model ─────────────────────────────────────────────────────────
export function RooflineVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var pad = 40;
        var chartW = w - pad * 2;
        var chartH = h - pad * 2 - 20;
        var ox = pad;
        var oy = h - pad - 20;

        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(ox, pad);
        ctx.lineTo(ox, oy);
        ctx.lineTo(ox + chartW, oy);
        ctx.stroke();

        drawCenteredText(ctx, "Arith. Intensity (FLOP/byte) →", ox + chartW / 2, oy + 18, "rgba(255,255,255,0.35)", 9);
        drawText(ctx, "TFLOP/s", ox + 4, pad + 10, "rgba(255,255,255,0.4)", 9);

        var ridgeX = ox + chartW * 0.55;
        var roofY = pad + 20;

        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ox, oy);
        ctx.lineTo(ridgeX, roofY);
        ctx.stroke();
        drawText(ctx, "Mem BW roof", ox + 14, oy - chartH * 0.35, "#FCD34D", 10);

        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(ridgeX, roofY);
        ctx.lineTo(ox + chartW, roofY);
        ctx.stroke();
        drawText(ctx, "Compute roof", ridgeX + 8, roofY - 12, "#67D8FF", 10);

        drawDot(ctx, ridgeX, roofY, 5 + Math.sin(t * 2) * 1.5, "#fff");
        drawText(ctx, "Ridge", ridgeX + 6, roofY + 14, "rgba(255,255,255,0.5)", 9);

        var kernels = [
          { name: "Copy", ai: 0.1, perf: 0.25, color: "#F87171" },
          { name: "GEMV", ai: 0.4, perf: 0.4, color: "#FFB74D" },
          { name: "GEMM", ai: 0.8, perf: 0.85, color: "#A8E063" },
        ];

        kernels.forEach(function (k) {
          var kx = ox + k.ai * chartW * 0.95;
          var roofAtX = kx < ridgeX ? (oy - (kx - ox) * (oy - roofY) / (ridgeX - ox)) : roofY;
          var ky = oy - k.perf * (oy - roofY);
          drawDot(ctx, kx, ky, 7, k.color);
          drawText(ctx, k.name, kx + 6, ky - 6, k.color, 10);
          ctx.strokeStyle = k.color + "66";
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 3]);
          ctx.beginPath(); ctx.moveTo(kx, ky); ctx.lineTo(kx, roofAtX); ctx.stroke();
          ctx.setLineDash([]);
        });
        drawText(ctx, "Green = compute-bound (near roof)", 8, oy - chartH - 10, "rgba(255,255,255,0.35)", 9);
      }, [])}
    />
  );
}

// ── Tiling / GEMM ──────────────────────────────────────────────────────────
export function TilingVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var tSz = 13;
        var mSize = 4;
        var tGap = 1;
        var step = tSz + tGap; // 14px per cell
        var matW = mSize * step; // 56px

        // A at cx-110, B at cx-27, C at cx+55
        var aX = cx - 110, bX = cx - 27, cX = cx + 56;
        var matY = 60;

        function drawMat(x, y, label, color, hlRow, hlCol) {
          for (var r = 0; r < mSize; r++) {
            for (var c = 0; c < mSize; c++) {
              var isHlRow = hlRow !== undefined && r === hlRow;
              var isHlCol = hlCol !== undefined && c === hlCol;
              var isHlCell = hlRow !== undefined && hlCol !== undefined && r === hlRow && c === hlCol;
              ctx.fillStyle = isHlCell ? color + "cc" : (isHlRow || isHlCol) ? color + "44" : color + "18";
              ctx.strokeStyle = (isHlRow || isHlCol) ? color : color + "44";
              ctx.lineWidth = isHlCell ? 2 : 0.8;
              drawRoundRect(ctx, x + c * step, y + r * step, tSz, tSz, 2);
              ctx.fill();
              ctx.stroke();
            }
          }
          drawCenteredText(ctx, label, x + matW / 2, y - 7, color, 11);
        }

        var phase = Math.floor(t * 0.7) % (mSize * mSize);
        var hr = Math.floor(phase / mSize);
        var hc = phase % mSize;

        drawMat(aX, matY, "A", "#00A3E0", hr, undefined);
        drawMat(bX, matY, "B", "#A8E063", undefined, hc);
        drawMat(cX, matY, "C", "#FFB74D", hr, hc);

        // Arrow from A-row to B-col
        var arrowY = matY + hr * step + tSz / 2;
        drawArrow(ctx, aX + matW + 4, arrowY, bX - 4, arrowY, "#67D8FF", 1.5);

        // Labels
        drawCenteredText(ctx, "Row " + hr, aX + matW / 2, matY + mSize * step + 14, "#67D8FF", 9);
        drawCenteredText(ctx, "Col " + hc, bX + matW / 2, matY + mSize * step + 14, "#86EFAC", 9);
        drawCenteredText(ctx, "C[" + hr + "," + hc + "]", cX + matW / 2, matY + mSize * step + 14, "#FFB74D", 9);

        drawCenteredText(ctx, "Tile row × Tile col → output cell", cx, h - 26, "rgba(255,255,255,0.45)", 10);
        drawCenteredText(ctx, "Load tiles to shared mem, reuse", cx, h - 12, "rgba(255,255,255,0.3)", 9);
      }, [])}
    />
  );
}

// ── Software Pipelining ────────────────────────────────────────────────────
export function PipeliningVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var stages = ["Prefetch k+1", "Compute k", "Store k-1"];
        var stageColors = ["#F59E0B", "#00A3E0", "#A8E063"];
        var stageW = Math.min(78, Math.floor((w - 50) / 3) - 8);
        var stageH = 36;
        var stageGap = 8;
        var totalW = stages.length * stageW + (stages.length - 1) * stageGap;
        var gx = cx - totalW / 2;
        var sy = h / 2 - stageH / 2 - 30;

        for (var i = 0; i < stages.length; i++) {
          var pulse = 0.15 + 0.12 * Math.sin(t * 2 + i * 1.2);
          ctx.fillStyle = stageColors[i] + Math.round(pulse * 255).toString(16).padStart(2, "00");
          ctx.strokeStyle = stageColors[i];
          ctx.lineWidth = 1.5;
          var boxX = gx + i * (stageW + stageGap);
          drawRoundRect(ctx, boxX, sy, stageW, stageH, 8);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, stages[i], boxX + stageW / 2, sy + 22, stageColors[i], 10);
          if (i < stages.length - 1) {
            drawArrow(ctx, boxX + stageW, sy + stageH / 2, boxX + stageW + stageGap, sy + stageH / 2, "rgba(255,255,255,0.3)");
          }
        }

        var bufY = sy + stageH + 30;
        drawCenteredText(ctx, "Double Buffer", cx, bufY, "rgba(255,255,255,0.4)", 10);
        var bufFlip = Math.floor(t * 0.8) % 2;
        var bufW = 66, bufH = 28;

        ctx.fillStyle = bufFlip === 0 ? "#F59E0B33" : "#00A3E033";
        ctx.strokeStyle = bufFlip === 0 ? "#F59E0B" : "#00A3E0";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cx - bufW - 6, bufY + 14, bufW, bufH, 6);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "Buf A", cx - bufW / 2 - 6, bufY + 32, "#FCD34D", 10);

        ctx.fillStyle = bufFlip === 1 ? "#F59E0B33" : "#00A3E033";
        ctx.strokeStyle = bufFlip === 1 ? "#F59E0B" : "#00A3E0";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cx + 6, bufY + 14, bufW, bufH, 6);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "Buf B", cx + bufW / 2 + 6, bufY + 32, "#67D8FF", 10);

        drawCenteredText(ctx, "↑ Writing", cx - bufW / 2 - 6, bufY + 54, "rgba(255,255,255,0.35)", 9);
        drawCenteredText(ctx, "↑ Reading", cx + bufW / 2 + 6, bufY + 54, "rgba(255,255,255,0.35)", 9);

        drawText(ctx, "Async prefetch hides global mem latency", 4, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Flash Attention ────────────────────────────────────────────────────────
export function FlashAttentionVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        // Responsive layout: Q/K/V on left, SRAM on right
        var tileW = 40, tileH = 38;
        var tileGap = 8;
        var qx = cx - 120, kx = cx - 120 + tileW + tileGap, vx = cx - 120 + 2 * (tileW + tileGap);
        var sramX = cx + 28, sramW = Math.min(90, w - sramX - 8);
        var oy2 = 40;

        function drawTile2(x, y, label, color, glow) {
          ctx.fillStyle = color + (glow ? "44" : "18");
          ctx.strokeStyle = color;
          ctx.lineWidth = glow ? 2.5 : 1.5;
          drawRoundRect(ctx, x, y, tileW, tileH, 6);
          ctx.fill();
          ctx.stroke();
          drawCenteredText(ctx, label, x + tileW / 2, y + tileH / 2 + 5, color, 14);
        }

        var activeIdx = Math.floor(t * 0.8) % 3;
        drawTile2(qx, oy2, "Q", "#00A3E0", activeIdx === 0);
        drawTile2(kx, oy2, "K", "#A8E063", activeIdx === 1);
        drawTile2(vx, oy2, "V", "#FFB74D", activeIdx === 2);

        // Type labels
        drawCenteredText(ctx, "FP16", qx + tileW / 2, oy2 - 8, "#80DEEA", 9);
        drawCenteredText(ctx, "FP16", kx + tileW / 2, oy2 - 8, "#86EFAC", 9);
        drawCenteredText(ctx, "FP16", vx + tileW / 2, oy2 - 8, "#FCD34D", 9);

        // Arrow from V to SRAM
        drawArrow(ctx, vx + tileW + 4, oy2 + tileH / 2, sramX - 4, oy2 + tileH / 2, "#fff", 1.5);
        drawCenteredText(ctx, "tile", vx + tileW + (sramX - vx - tileW) / 2, oy2 + tileH / 2 - 8, "rgba(255,255,255,0.35)", 9);

        // SRAM block
        ctx.fillStyle = "rgba(0,163,224,0.12)";
        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 2;
        drawRoundRect(ctx, sramX, oy2 - 8, sramW, 62, 10);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "SRAM", sramX + sramW / 2, oy2 + 10, "#67D8FF", 11);
        drawCenteredText(ctx, "shmem", sramX + sramW / 2, oy2 + 24, "rgba(255,255,255,0.4)", 9);

        // Softmax box inside SRAM
        ctx.strokeStyle = "#A8E063";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        drawRoundRect(ctx, sramX + 4, oy2 + 30, sramW - 8, 18, 4);
        ctx.stroke();
        ctx.setLineDash([]);
        drawCenteredText(ctx, "softmax+Attn", sramX + sramW / 2, oy2 + 43, "#A8E063", 8);

        // Output arrow + box
        drawArrow(ctx, sramX + sramW / 2, oy2 + 54, sramX + sramW / 2, oy2 + 90, "#FFB74D");
        ctx.fillStyle = "rgba(245,158,11,0.15)";
        ctx.strokeStyle = "#F59E0B";
        ctx.lineWidth = 1.5;
        var outW = Math.min(sramW + 10, 100);
        drawRoundRect(ctx, sramX + sramW / 2 - outW / 2, oy2 + 92, outW, 28, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "Output O", sramX + sramW / 2, oy2 + 110, "#FCD34D", 10);
        drawCenteredText(ctx, "(HBM)", sramX + sramW / 2, oy2 + 122, "rgba(255,255,255,0.4)", 8);

        drawText(ctx, "Standard Attn: O(N²) HBM reads", 8, h - 28, "rgba(255,255,255,0.4)", 10);
        drawText(ctx, "Flash Attn:    O(N)  HBM reads", 8, h - 14, "#A8E063", 10);
      }, [])}
    />
  );
}

// ── Kernel Launch / Thread Indexing ───────────────────────────────────────
export function KernelLaunchVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var gridCols = 3, gridRows = 3;
        var blockW = 58, blockH = 46, gapB = 8;
        var gbx = cx - (gridCols * (blockW + gapB)) / 2 + gapB / 2;
        var gby = 26;

        var blockColors = ["#3B82F6", "#7C3AED", "#EF4444", "#10B981", "#F59E0B", "#EC4899", "#00A3E0", "#A8E063", "#FFB74D"];

        for (var br = 0; br < gridRows; br++) {
          for (var bc = 0; bc < gridCols; bc++) {
            var bi = br * gridCols + bc;
            var bx = gbx + bc * (blockW + gapB);
            var by = gby + br * (blockH + gapB);
            ctx.fillStyle = blockColors[bi] + "22";
            ctx.strokeStyle = blockColors[bi];
            ctx.lineWidth = 1.5;
            drawRoundRect(ctx, bx, by, blockW, blockH, 6);
            ctx.fill();
            ctx.stroke();
            drawCenteredText(ctx, "(" + bc + "," + br + ")", bx + blockW / 2, by + 16, blockColors[bi], 9);
            for (var tt = 0; tt < 6; tt++) {
              var tx2 = bx + 5 + (tt % 3) * 16;
              var ty2 = by + 20 + Math.floor(tt / 3) * 14;
              var pulse = Math.sin(t * 2 + bi * 0.7 + tt * 0.3) > 0;
              ctx.fillStyle = pulse ? blockColors[bi] + "cc" : "rgba(255,255,255,0.08)";
              ctx.beginPath();
              ctx.arc(tx2 + 6, ty2 + 6, 4.5, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        drawText(ctx, "Grid(3,3) blocks", gbx, gby + gridRows * (blockH + gapB) + 14, "rgba(255,255,255,0.4)", 10);

        var fY = gby + gridRows * (blockH + gapB) + 30;
        var fW = Math.min(230, w - 20);
        ctx.fillStyle = "rgba(59,130,246,0.1)";
        ctx.strokeStyle = "#3B82F6";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cx - fW / 2, fY, fW, 34, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "idx = blockIdx.x*blockDim.x+threadIdx.x", cx, fY + 21, "#93C5FD", 9);

        drawText(ctx, "Each block → one SM, threads fill warps", 4, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── CUDA Streams ───────────────────────────────────────────────────────────
export function CUDAStreamsVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var speed = 0.35;
        var offset = (t * speed) % 1;

        var streams = [
          { label: "Stream 0", color: "#00A3E0", tasks: ["H2D", "Kernel A", "D2H"] },
          { label: "Stream 1", color: "#A8E063", tasks: ["H2D", "Kernel B", "D2H"] },
          { label: "Stream 2", color: "#FFB74D", tasks: ["Kernel C", "Kernel D"] },
        ];

        var labelW = 52;
        var timelineX = labelW + 4;
        var timelineW = w - timelineX - 8;
        var rowH = 50;
        var startY = 32;
        var taskW = [44, 66, 44];

        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(timelineX, startY + streams.length * rowH + 8);
        ctx.lineTo(timelineX + timelineW, startY + streams.length * rowH + 8);
        ctx.stroke();
        drawText(ctx, "Time →", timelineX + timelineW - 38, startY + streams.length * rowH + 22, "rgba(255,255,255,0.3)", 9);

        streams.forEach(function (s, si) {
          var ry = startY + si * rowH;
          drawText(ctx, s.label, 0, ry + 20, s.color, 10);

          var staggerOffset = (offset + si * 0.15) % 1;
          var totalW2 = taskW.reduce(function (a, b) { return a + b; }, 0) + 16;
          var startPx = timelineX + staggerOffset * (timelineW - totalW2);

          s.tasks.forEach(function (task, ti) {
            var tx = startPx + taskW.slice(0, ti).reduce(function (a, b) { return a + b + 5; }, 0);
            var tw = taskW[ti] || 60;
            if (tx > timelineX + timelineW) return;
            var drawW = Math.min(tw, timelineX + timelineW - tx);
            ctx.fillStyle = s.color + "33";
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 1.5;
            drawRoundRect(ctx, tx, ry + 6, drawW, 28, 5);
            ctx.fill();
            ctx.stroke();
            if (drawW > 20) drawCenteredText(ctx, task, tx + drawW / 2, ry + 25, s.color, 9);
          });
        });

        drawText(ctx, "Streams overlap H2D, kernel, D2H async", 4, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}

// ── Triton Tiles ───────────────────────────────────────────────────────────
export function TritonTilesVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var rows = 4, cols = 6;
        var cellW = Math.min(36, Math.floor((w - 20) / cols) - 3);
        var cellH = 28, cellGap = 3;
        var gx = cx - (cols * (cellW + cellGap)) / 2;
        var gy = 30;

        var activeTile = Math.floor(t * 0.6) % (rows * cols);
        var ar = Math.floor(activeTile / cols);
        var ac = activeTile % cols;

        for (var r = 0; r < rows; r++) {
          for (var c = 0; c < cols; c++) {
            var done = (r * cols + c) < activeTile;
            var active = r === ar && c === ac;
            ctx.fillStyle = active ? "#00A3E0cc" : done ? "#00A3E033" : "rgba(255,255,255,0.05)";
            ctx.strokeStyle = active ? "#67D8FF" : done ? "#00A3E066" : "rgba(255,255,255,0.12)";
            ctx.lineWidth = active ? 2 : 1;
            drawRoundRect(ctx, gx + c * (cellW + cellGap), gy + r * (cellH + cellGap), cellW, cellH, 4);
            ctx.fill();
            ctx.stroke();
            if (active) drawCenteredText(ctx, "→", gx + c * (cellW + cellGap) + cellW / 2, gy + r * (cellH + cellGap) + 19, "#fff", 11);
          }
        }

        drawCenteredText(ctx, "One Triton program = one tile", cx, gy + rows * (cellH + cellGap) + 16, "rgba(255,255,255,0.4)", 10);

        var bpW = Math.min(230, w - 20);
        var bpy = gy + rows * (cellH + cellGap) + 32;
        ctx.fillStyle = "rgba(0,163,224,0.1)";
        ctx.strokeStyle = "#00A3E0";
        ctx.lineWidth = 1.5;
        drawRoundRect(ctx, cx - bpW / 2, bpy, bpW, 38, 8);
        ctx.fill();
        ctx.stroke();
        drawCenteredText(ctx, "tl.arange(0, BLOCK_M)[:, None]", cx, bpy + 14, "#67D8FF", 9);
        drawCenteredText(ctx, "base + pid * BLOCK  →  block ptr", cx, bpy + 28, "rgba(255,255,255,0.35)", 9);

        drawText(ctx, "pid = program_id(0) — one tile per pid", 4, h - 12, "rgba(255,255,255,0.3)", 10);
      }, [])}
    />
  );
}

// ── Arithmetic Intensity ───────────────────────────────────────────────────
export function ArithmeticIntensityVis() {
  return (
    <Canvas2D
      draw={useCallback(function (ctx, w, h, t) {
        drawGrid(ctx, w, h);
        var cx = w / 2;

        var kernels = [
          { name: ["Elementwise", "(copy)"], flops: 1, bytes: 4, color: "#F87171" },
          { name: ["GEMV"], flops: 2, bytes: 1, color: "#FFB74D" },
          { name: ["GEMM", "(large)"], flops: 512, bytes: 1, color: "#A8E063" },
        ];

        var barMaxH = 120;
        var barW = 50;
        var barGap = 40;
        var barBaseY = h - 54;
        var gx2 = cx - (kernels.length * (barW + barGap)) / 2 + barGap / 2;

        kernels.forEach(function (k, i) {
          var intensity = k.flops / k.bytes;
          var normH = Math.min(barMaxH, intensity * 0.5 + 12);
          var bx = gx2 + i * (barW + barGap);
          var pulse = 0.7 + Math.sin(t * 1.5 + i) * 0.15;
          ctx.fillStyle = k.color + Math.round(pulse * 160).toString(16).padStart(2, "0");
          ctx.strokeStyle = k.color;
          ctx.lineWidth = 1.5;
          drawRoundRect(ctx, bx, barBaseY - normH, barW, normH, 6);
          ctx.fill();
          ctx.stroke();

          var aiLabel = intensity >= 100 ? Math.round(intensity) + "" : intensity.toFixed(1);
          drawCenteredText(ctx, aiLabel + " F/B", bx + barW / 2, barBaseY - normH - 8, k.color, 10);

          k.name.forEach(function (line, li) {
            drawCenteredText(ctx, line, bx + barW / 2, barBaseY + 14 + li * 13, "rgba(255,255,255,0.55)", 9);
          });
        });

        drawCenteredText(ctx, "AI = FLOPs ÷ bytes accessed", cx, 22, "rgba(255,255,255,0.45)", 11);
        drawCenteredText(ctx, "Higher AI = more compute-bound", cx, 37, "rgba(255,255,255,0.3)", 9);
        drawText(ctx, "GEMM: ~512 FLOP/byte → compute-bound", 6, h - 12, "rgba(255,255,255,0.35)", 10);
      }, [])}
    />
  );
}
