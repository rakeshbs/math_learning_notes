import { useState } from "react";
import {
  SMVis,
  WarpVis,
  ThreadHierarchyVis,
  TensorCoreVis,
  MemoryHierarchyVis,
  SIMTVis,
  WarpDivergenceVis,
  OccupancyVis,
  LatencyHidingVis,
  CoalescingVis,
  BankConflictsVis,
  RooflineVis,
  TilingVis,
  PipeliningVis,
  FlashAttentionVis,
  KernelLaunchVis,
  CUDAStreamsVis,
  TritonTilesVis,
  ArithmeticIntensityVis,
  StreamProcessorsVis,
  WarpSchedulerDeepVis,
  WarpScoreboardVis,
} from "../gpu-intuition/visuals/gpuVisuals";
import { ConceptSelector } from "../math-explorer/components";

var LEARNING_GROUPS = [{ id: "tutorials", label: "Learning Sections" }];

var LEARNING_SECTIONS = [
  {
    id: "gpu_architecture_tutorial",
    title: "GPU Architecture Tutorial",
    subtitle: "Visual-first deep dive from hardware to optimization",
    color: "#00A3E0",
    accent: "#67D8FF",
    group: "tutorials",
  },
];

var GPU_STEPS = [
  {
    id: "throughput-machine",
    title: "Start with the hardware engine",
    visual: SMVis,
    caption:
      "An SM bundles schedulers, cores, registers, and local memory into one throughput unit.",
    intro: [
      "A GPU is not one giant core. It is many Streaming Multiprocessors (SMs), and each SM runs a large number of threads at the same time. If you want to predict GPU performance, your first question is always: what is each SM doing cycle by cycle?",
      "Inside one SM, warp schedulers feed instructions to execution units while data moves through registers and shared memory. This local view is more useful than chip-level specs because every kernel bottleneck eventually appears here.",
    ],
    deepDive: [
      "Think in capacity terms: resident warps, register file pressure, and shared-memory usage define how much work can live on an SM. If any one resource saturates early, parallelism drops even if others are available.",
      "When performance is bad, inspect whether SMs are under-filled or stalled. Under-filled means launch or occupancy issues. Stalled means the active warps are waiting on memory, synchronization, or dependency chains.",
    ],
    checkpoints: [
      "Execution happens per SM, not per kernel launch globally.",
      "Resource limits are local to each SM and can block concurrency.",
      "Every optimization should be explainable at the SM level.",
    ],
  },
  {
    id: "stream-processors",
    title: "Understand Stream Processors (CUDA cores) in detail",
    visual: StreamProcessorsVis,
    caption:
      "Warp lanes are mapped onto scalar execution lanes and specialized units inside the SM.",
    intro: [
      "A stream processor is a scalar arithmetic lane used by warp-issued instructions. When people say CUDA cores, they usually mean these lanes.",
      "One warp instruction activates many scalar lanes in parallel. The scheduler issues one op, but each lane uses its own registers and data values.",
    ],
    deepDive: [
      "Not every instruction goes to the same physical pipeline. Integer, FP, special function, and memory operations can map to different unit groups in the SM.",
      "Throughput depends on both lane availability and instruction mix. A kernel heavy in one unit type can bottleneck even when other units are idle.",
    ],
    checkpoints: [
      "CUDA cores are scalar lanes, not one wide vector ALU.",
      "Warp issue drives many lanes at once with per-lane data.",
      "Instruction mix determines which execution units saturate first.",
    ],
  },
  {
    id: "warp-schedulers",
    title: "Study warp schedulers and dispatch ports",
    visual: WarpSchedulerDeepVis,
    caption:
      "Schedulers pick eligible warps each cycle and dispatch them to matching execution pipelines.",
    intro: [
      "Warp schedulers are the traffic controllers of an SM. They choose ready warps and issue instructions each cycle when dependencies permit.",
      "Modern SMs have multiple schedulers, so several warp instructions can be in flight concurrently when the kernel exposes enough independent work.",
    ],
    deepDive: [
      "Schedulers do not pick stalled warps. A warp waiting on memory or dependencies is bypassed until the scoreboard marks it ready.",
      "Dispatch is constrained by functional unit availability and port pressure. If tensor pipes are saturated, tensor-heavy instructions queue even when FP pipes are free.",
    ],
    checkpoints: [
      "Scheduler quality is about eligible warps, not just total resident warps.",
      "Multi-scheduler SMs still stall if dependencies dominate.",
      "Dispatch limits can create unit-specific bottlenecks.",
    ],
  },
  {
    id: "warp-scoreboard",
    title: "Learn scoreboarding and why warps stall",
    visual: WarpScoreboardVis,
    caption:
      "Scoreboard bits track dependencies and gate whether a warp is ready to issue.",
    intro: [
      "The scoreboard is dependency bookkeeping inside the SM. It prevents issuing instructions whose operands are not ready yet.",
      "A warp can be resident but not issuable. This distinction explains why occupancy alone often overestimates real execution throughput.",
    ],
    deepDive: [
      "Common stall classes include long memory waits, register dependency chains, and synchronization barriers. Different stalls need different fixes.",
      "Good optimization removes avoidable stalls: reorder instructions, increase independent work, prefetch earlier, or adjust tiling/pipelining to reduce wait exposure.",
    ],
    checkpoints: [
      "Resident warps and eligible warps are not the same metric.",
      "Scoreboard and dependency chains directly influence issue rate.",
      "Fixes should target the dominant stall class, not generic tuning.",
    ],
  },
  {
    id: "hierarchy",
    title: "Map work into thread, block, and grid",
    visual: ThreadHierarchyVis,
    caption:
      "Threads live inside blocks, and blocks together form a grid for one kernel launch.",
    intro: [
      "CUDA gives you a hierarchy: thread -> block -> grid. This is not just API shape. It matches hardware scheduling boundaries and determines what can communicate efficiently.",
      "Threads in one block can cooperate through shared memory and barriers. Blocks cannot synchronize directly during a kernel. This single constraint drives many algorithm designs on GPU.",
    ],
    deepDive: [
      "Use block size as a hardware fit parameter. Typical values are 128 or 256 threads because they map cleanly to warps and leave room for multiple resident blocks per SM.",
      "Use grid size as a coverage parameter. You need enough blocks to feed all SMs over time, especially when each block uses heavy resources and residency per SM is low.",
    ],
    checkpoints: [
      "Block-level cooperation is cheap; grid-wide coordination is kernel-level.",
      "Block dimensions should respect warp granularity of 32 threads.",
      "Grid should oversubscribe SM count so schedulers stay fed.",
    ],
  },
  {
    id: "warp",
    title: "Understand the warp as the scheduling atom",
    visual: WarpVis,
    caption: "A warp is 32 threads issued together as one instruction stream.",
    intro: [
      "The warp is the true scheduling atom. A warp scheduler issues one instruction for 32 lanes, so behavior within a warp determines real efficiency.",
      "Even though threads look independent in code, issue and control happen in groups. Any mismatch in data paths or control flow inside one warp has direct cost.",
    ],
    deepDive: [
      "Lane IDs (`threadIdx.x % 32`) matter for memory patterns, shuffles, and warp specialization tricks. Advanced kernels often assign different micro-roles to lanes while preserving uniform control flow.",
      "If you can reason about what one warp does over a few iterations, you can usually reason about the entire kernel. Blocks and grids are mostly replication on top of warp behavior.",
    ],
    checkpoints: [
      "Warp size is 32 on NVIDIA GPUs.",
      "Scheduler decisions are made per warp, not per thread.",
      "Good kernels create predictable, uniform work per warp.",
    ],
  },
  {
    id: "simt",
    title: "Internalize SIMT execution",
    visual: SIMTVis,
    caption:
      "Same instruction is issued to many threads, but each thread has its own data path.",
    intro: [
      "SIMT means single instruction, multiple threads. Hardware issues one instruction, but each lane carries different register values and memory addresses.",
      "This is why GPUs can combine high throughput with flexible per-thread indexing. You keep scalar-like code style while getting vector-like execution throughput.",
    ],
    deepDive: [
      "The practical rule is: align control flow and diverge data access only when needed. SIMD-style regularity gives throughput; thread-private state gives flexibility.",
      "When you optimize, ask two questions per loop body: does every lane run the same instruction path, and are the addresses the lanes touch structured enough for efficient memory transactions?",
    ],
    checkpoints: [
      "SIMT gives independent data with grouped instruction issue.",
      "Uniform instruction flow is the default fast path.",
      "Address structure and branch structure are equally important.",
    ],
  },
  {
    id: "divergence",
    title: "Pay attention to branch divergence",
    visual: WarpDivergenceVis,
    caption:
      "Diverged paths in one warp are serialized, reducing useful work per cycle.",
    intro: [
      "If lanes in one warp take different branches, hardware executes each path separately with masks. This converts parallel work into sequential passes.",
      "Divergence is local to a warp. Different warps can take different paths without penalty to each other. The problem is path mismatch within one warp at one branch site.",
    ],
    deepDive: [
      "Data layout can reduce divergence. Grouping similar data values together often improves both branch uniformity and memory locality at the same time.",
      "Small conditionals can sometimes be replaced by predication or math-based select expressions, but verify generated code and counters rather than assuming.",
    ],
    checkpoints: [
      "Divergence cost scales with number of distinct paths per warp.",
      "Reordering data can be as effective as rewriting branch logic.",
      "Measure divergence metrics before and after branch changes.",
    ],
  },
  {
    id: "launch-indexing",
    title: "Launch and indexing as correctness foundation",
    visual: KernelLaunchVis,
    caption:
      "Kernel launch geometry and index math define which element each thread owns.",
    intro: [
      "Most GPU bugs begin with indexing, not arithmetic. Wrong grid geometry or off-by-one bounds checks silently corrupt output and invalidate profiling conclusions.",
      "Start every kernel by defining ownership clearly: one thread per element, one warp per row tile, or one block per output tile. Then prove the mapping formula.",
    ],
    deepDive: [
      "Grid-stride loops are a robust pattern for arbitrary `N`: each thread processes `i, i+stride, i+2*stride`. This decouples correctness from launch size and helps tune occupancy independently.",
      "Use launch math that guarantees coverage and bounds checks that guarantee safety. A fast kernel with undefined behavior is not a usable kernel.",
    ],
    checkpoints: [
      "Choose a clear ownership model before writing math.",
      "Use ceiling division for grid sizing and explicit bounds guards.",
      "Prefer grid-stride loops for reusable, scalable kernels.",
    ],
  },
  {
    id: "memory-hierarchy",
    title: "Treat memory as the real architecture",
    visual: MemoryHierarchyVis,
    caption:
      "Registers, shared memory, caches, and HBM trade capacity for latency and bandwidth.",
    intro: [
      "Most kernels are limited by data movement, not raw arithmetic. GPU memory hierarchy exists to reduce expensive trips to global memory by reusing data in faster levels.",
      "Registers are fastest and private. Shared memory is fast and cooperative within a block. L2 is global cache. HBM is large and high bandwidth but high latency.",
    ],
    deepDive: [
      "Optimization usually means moving reuse upward in the hierarchy: from global to L2, from L2 to shared, and from shared to registers. Each move reduces repeated long-latency fetches.",
      "Always compute expected bytes moved. If measured bandwidth is near hardware limits, you need better reuse or lower traffic, not more instruction-level micro-optimizations.",
    ],
    checkpoints: [
      "Memory traffic often dominates runtime more than FLOP count.",
      "Data reuse strategy should be explicit in kernel design.",
      "Bandwidth and latency constraints differ by memory level.",
    ],
  },
  {
    id: "coalescing",
    title: "Coalesce global memory accesses",
    visual: CoalescingVis,
    caption:
      "Contiguous lane access patterns merge into fewer memory transactions.",
    intro: [
      "A warp should access nearby addresses so the memory system can serve the warp with a small number of transactions. This is coalescing and it is mandatory for high throughput.",
      "Strided or scattered addresses inflate transactions per request. Same arithmetic, same bytes requested by your code, but much more internal traffic and latency.",
    ],
    deepDive: [
      "Data layout decisions (SoA vs AoS, row-major traversal direction, padding for alignment) determine coalescing quality before any math optimization begins.",
      "When unavoidable access is strided, use shared memory transpose or staging to convert global access into contiguous loads/stores and pay irregularity only on-chip.",
    ],
    checkpoints: [
      "Design lane-to-address mapping early in kernel planning.",
      "Favor contiguous per-lane patterns for global loads and stores.",
      "Use staging patterns when direct coalescing is impossible.",
    ],
  },
  {
    id: "bank-conflicts",
    title: "Keep shared memory banks conflict-free",
    visual: BankConflictsVis,
    caption:
      "Shared memory is fast only when lanes hit different banks in the same cycle.",
    intro: [
      "Shared memory is banked. If many lanes hit the same bank in one instruction, accesses serialize and throughput drops.",
      "This issue appears frequently in transposes, reductions, and tiled GEMM variants where index formulas accidentally line up on bank boundaries.",
    ],
    deepDive: [
      "Simple padding (for example `tile[32][33]`) often breaks harmful alignment and restores parallel bank access. This tiny memory overhead can remove large slowdowns.",
      "Inspect conflict metrics in profiler output rather than guessing. Shared memory should behave like a low-latency local fabric, not a hidden serialized queue.",
    ],
    checkpoints: [
      "Bank conflicts convert parallel shared-memory access into serial passes.",
      "Padding and index remapping are standard conflict fixes.",
      "Always confirm with shared-memory conflict counters.",
    ],
  },
  {
    id: "occupancy",
    title: "Use occupancy as a latency-hiding budget",
    visual: OccupancyVis,
    caption:
      "Occupancy is resident warps over hardware maximum, bounded by regs and shared memory.",
    intro: [
      "Occupancy tells you how many warps are ready to run when others stall. It is not a performance target by itself, but a way to reason about stall tolerance.",
      "Registers per thread, shared memory per block, and block size jointly decide active warps. Raising one resource can starve another.",
    ],
    deepDive: [
      "Low occupancy can still be fast when each thread has strong instruction-level parallelism and high data reuse. High occupancy can be slow if memory patterns are poor.",
      "Tune for balance: enough warps to hide latency, enough registers to avoid spilling, enough shared memory to support tile reuse. Profiling should guide this trade.",
    ],
    checkpoints: [
      "Occupancy is diagnostic context, not an isolated optimization goal.",
      "Resource ceilings interact; improving one can hurt another.",
      "Best point is usually a balance, not the maximum theoretical value.",
    ],
  },
  {
    id: "latency-hiding",
    title: "Hide latency with warp-level overlap",
    visual: LatencyHidingVis,
    caption:
      "When one warp waits on memory, schedulers issue another ready warp.",
    intro: [
      "Global memory latency is hundreds of cycles. GPUs survive this by rapidly switching to other ready warps.",
      "This is why thread-level parallelism matters even for simple kernels: extra ready work turns wait time into useful compute time.",
    ],
    deepDive: [
      "If you see many stalled warps and few eligible warps, you likely need higher residency, better prefetching, or reduced dependency chains.",
      "Latency hiding is a dynamic behavior. Occupancy gives potential; scheduler eligibility and dependency structure decide real overlap quality.",
    ],
    checkpoints: [
      "Ready warp availability is the key to tolerating memory latency.",
      "High stall metrics with low eligibility indicate overlap problems.",
      "Latency hiding depends on both resources and instruction dependencies.",
    ],
  },
  {
    id: "tensor-cores",
    title: "Use specialized compute units when possible",
    visual: TensorCoreVis,
    caption:
      "Tensor cores accelerate matrix multiply-accumulate at much higher throughput.",
    intro: [
      "Tensor cores are dedicated matrix engines. They provide much higher throughput for supported dtypes and aligned tile shapes than scalar ALUs.",
      "Modern deep learning performance largely comes from mapping workloads into tensor-core-friendly kernels with correct accumulation precision.",
    ],
    deepDive: [
      "Shape alignment, data layout, and instruction selection all matter. A seemingly minor misalignment can fall back to slower math paths.",
      "Treat tensor-core usage as a contract: tile sizes, memory formats, and accumulator dtypes must be intentionally designed, not left to chance.",
    ],
    checkpoints: [
      "Tensor cores are central for high-throughput GEMM-like workloads.",
      "Alignment and dtype choices determine whether fast paths activate.",
      "Correct accumulation precision is crucial for numerical stability.",
    ],
  },
  {
    id: "tiling",
    title: "Exploit data reuse with tiling",
    visual: TilingVis,
    caption:
      "Load small tiles once, reuse many times, then move to the next tile.",
    intro: [
      "Tiling is the core strategy for matrix workloads. Instead of reading every operand from global memory repeatedly, blocks stage tiles into shared memory and registers.",
      "Each loaded value should participate in many FMAs before eviction. Reuse is the only scalable way to approach compute rooflines.",
    ],
    deepDive: [
      "Tile shape is a trade among shared memory footprint, register pressure, occupancy, and tensor-core compatibility. There is no universal best tile.",
      "Once tile math is correct, optimize movement: vectorized loads, bank-safe shared layouts, and loop ordering that keeps working sets hot.",
    ],
    checkpoints: [
      "Tiling converts bandwidth pressure into on-chip reuse.",
      "Tile shape tuning is architecture and workload dependent.",
      "Movement details often decide whether tiling actually helps.",
    ],
  },
  {
    id: "pipeline",
    title: "Overlap copy and compute with software pipelining",
    visual: PipeliningVis,
    caption:
      "Double buffering lets one tile compute while the next tile is prefetched.",
    intro: [
      "Even tiled kernels can stall if every iteration waits for data before compute begins. Software pipelining overlaps these phases.",
      "The idea is simple: while computing tile `k`, prefetch tile `k+1` into another buffer. This reduces visible memory latency per iteration.",
    ],
    deepDive: [
      "Pipeline depth (`num_stages`) is a real tuning knob. Too shallow leaves latency exposed; too deep raises register/shared-memory use and can hurt occupancy.",
      "Treat pipelining as schedule design. You are shaping when bytes arrive relative to when arithmetic consumes them.",
    ],
    checkpoints: [
      "Pipelining is essential after baseline tiling is in place.",
      "Double buffering is common; deeper pipelines need careful tuning.",
      "Overlap effectiveness depends on both memory and compute balance.",
    ],
  },
  {
    id: "streams",
    title: "Scale throughput with stream-level overlap",
    visual: CUDAStreamsVis,
    caption:
      "Independent streams can overlap transfers and kernels when dependencies allow.",
    intro: [
      "Kernel-level efficiency is only part of end-to-end throughput. Host-device copies and kernel launches can leave hardware idle without stream orchestration.",
      "Streams create ordered lanes of work. Different lanes can overlap, which is critical in serving or training pipelines with steady batches.",
    ],
    deepDive: [
      "Real overlap needs asynchronous copies, pinned host memory, and correct dependency handling. Otherwise operations serialize and stream count alone does nothing.",
      "Pipeline the full system: while one batch computes, next batch transfers in and previous outputs transfer out. This improves sustained throughput even if single-kernel speed is unchanged.",
    ],
    checkpoints: [
      "Streams optimize system throughput, not just kernel micro-performance.",
      "Pinned memory and async APIs are required for transfer overlap.",
      "Dependency design is as important as stream count.",
    ],
  },
  {
    id: "arithmetic-intensity",
    title: "Estimate arithmetic intensity before optimizing",
    visual: ArithmeticIntensityVis,
    caption:
      "Arithmetic intensity is FLOPs per byte and predicts memory vs compute pressure.",
    intro: [
      "Arithmetic intensity (AI) gives a first-order bound on attainable performance. Low AI kernels tend to be memory-bound; high AI kernels can become compute-bound.",
      "AI is not exact reality because caches and fusion change effective bytes, but it is the right starting model for strategy selection.",
    ],
    deepDive: [
      "If AI is low, focus on reducing bytes: fusion, better layouts, and reuse. If AI is high, focus on feeding compute engines: tensor-core usage, instruction scheduling, and occupancy balance.",
      "Always separate FLOP count from FLOP/s. Doing more math can be faster if it raises reuse and reduces expensive memory traffic.",
    ],
    checkpoints: [
      "AI guides whether to prioritize bandwidth or compute optimizations.",
      "Effective AI can improve via caching, tiling, and kernel fusion.",
      "Optimization plans should start with a rough AI estimate.",
    ],
  },
  {
    id: "roofline",
    title: "Use roofline to choose the next optimization",
    visual: RooflineVis,
    caption:
      "Roofline combines peak bandwidth and peak compute into one decision model.",
    intro: [
      "Roofline plots performance against arithmetic intensity and shows two ceilings: memory bandwidth slope and compute plateau.",
      "Your kernel point relative to these roofs tells you what type of optimization can still move performance upward.",
    ],
    deepDive: [
      "If you are far below both roofs, fix implementation issues first: divergence, launch overhead, poor occupancy, synchronization inefficiency, or cache-thrashing patterns.",
      "If you are near the memory roof, attack bytes. If you are near compute roof, attack instruction throughput and tensor-core efficiency. Roofline prevents random optimization attempts.",
    ],
    checkpoints: [
      "Roofline is a decision framework, not just a chart.",
      "Distance to the nearest relevant roof defines next optimization class.",
      "Use measured counters, not guessed values, for kernel placement.",
    ],
  },
  {
    id: "triton",
    title: "Translate the same ideas into Triton",
    visual: TritonTilesVis,
    caption:
      "Triton expresses the same GPU principles using tile-level programs.",
    intro: [
      "Triton changes syntax, not fundamentals. You still need coalesced access, balanced tile shapes, pipelining, and occupancy-aware resource use.",
      "The programming unit is a tile program instead of manual per-thread control. This often shortens code while preserving high performance.",
    ],
    deepDive: [
      "Treat `program_id` as block identity and `tl.arange` as vector lane generation. The same indexing rigor from CUDA still applies.",
      "Auto-tuning explores tile and pipeline choices quickly, but you should still understand why one config wins so kernels remain maintainable across model and hardware changes.",
    ],
    checkpoints: [
      "Triton is a different abstraction layer over the same hardware rules.",
      "Indexing and memory layout discipline still determine correctness and speed.",
      "Auto-tune helps search, but principled reasoning still matters.",
    ],
  },
  {
    id: "flash-attention",
    title: "See a full-system example: Flash Attention",
    visual: FlashAttentionVis,
    caption:
      "Flash Attention fuses tiling, online softmax, and SRAM reuse to cut HBM traffic.",
    intro: [
      "Flash Attention is a high-value case study because it combines multiple GPU ideas into one algorithmic redesign. It is not just a kernel rewrite.",
      "The key insight is IO-awareness: avoid materializing large intermediate matrices in HBM by processing in tiles and maintaining online statistics.",
    ],
    deepDive: [
      "This design uses shared-memory staging, tensor-core dot products, and numerically stable online softmax updates. The result is less global memory traffic and better scaling with sequence length.",
      "Use this as a template for other workloads: identify costly intermediates, redesign computation around on-chip residency, and preserve mathematical correctness with streaming update formulas.",
    ],
    checkpoints: [
      "Algorithmic IO reduction can dominate low-level micro-optimizations.",
      "Flash Attention is a composition of hierarchy, tiling, and numerical methods.",
      "Best GPU kernels are often algorithm plus architecture co-design.",
    ],
  },
];

var GPU_STEP_NOTES = {
  "throughput-machine": {
    advanced: [
      "Blocks are admitted to an SM until one limiter is exhausted: warps, registers, shared memory, or the max-blocks cap.",
      "A kernel can be compute-light yet still underperform if too few blocks are launched to keep all SMs busy over time.",
    ],
    profilerSignals: [
      "SM active percentage during steady state",
      "Average active warps per SM",
      "Achieved occupancy versus theoretical occupancy",
    ],
    commonMistakes: [
      "Benchmarking tiny inputs that cannot fill the GPU",
      "Assuming clock speed implies throughput without utilization checks",
    ],
  },
  "stream-processors": {
    advanced: [
      "Stream processors execute scalar lane work emitted by warp-issued instructions; they are not programmed independently.",
      "Throughput depends on balancing instruction mix across FP, INT, SFU, and memory pipelines, not just maximizing one arithmetic type.",
    ],
    profilerSignals: [
      "Per-pipeline utilization (FP, INT, SFU, tensor, load/store)",
      "Issued instructions per cycle versus theoretical issue bandwidth",
      "Math pipe saturation and pipe-idle percentages",
    ],
    commonMistakes: [
      "Assuming all CUDA cores are interchangeable for every instruction type",
      "Optimizing FLOPs while ignoring unit imbalance in instruction mix",
    ],
  },
  "warp-schedulers": {
    advanced: [
      "Schedulers pick only eligible warps; high occupancy is insufficient if dependencies keep warps unready.",
      "Dispatch ports can bottleneck specific operations even when other execution resources appear underutilized.",
    ],
    profilerSignals: [
      "Eligible warps per scheduler per cycle",
      "Issue active versus issue stalled cycles",
      "Instruction dispatch breakdown by pipe class",
    ],
    commonMistakes: [
      "Interpreting resident warps as guaranteed issue throughput",
      "Ignoring dispatch-port pressure when tuning kernel math structure",
    ],
  },
  "warp-scoreboard": {
    advanced: [
      "Scoreboard logic tracks pending dependencies and determines whether a warp may issue next instructions.",
      "Reducing dependency depth and exposing independent instructions increases scheduler choice and hides latency better.",
    ],
    profilerSignals: [
      "Stall reasons: memory dependency, execution dependency, barrier/sync",
      "Ready-warp count versus resident-warp count",
      "Instruction replay and long scoreboard wait indicators",
    ],
    commonMistakes: [
      "Treating all stalls as memory stalls without classification",
      "Adding threads instead of reducing dependency chains",
    ],
  },
  hierarchy: {
    advanced: [
      "Map `x` to the contiguous memory direction whenever possible; this typically improves coalescing with no extra cost.",
      "Use 2D or 3D block shapes only when the data naturally has those axes; unnecessary dimensionality often adds indexing bugs.",
    ],
    profilerSignals: [
      "Blocks launched per SM during steady state",
      "Thread block size and warp alignment",
      "Boundary branch frequency near edges",
    ],
    commonMistakes: [
      "Using block sizes not divisible by 32",
      "Launching one block per SM and assuming that is enough",
    ],
  },
  warp: {
    advanced: [
      "Warp-level collectives (`__shfl_sync`, ballot-style ops) reduce shared-memory traffic for short-range communication.",
      "Design warp work so each lane has similar arithmetic cost; hidden per-lane imbalance lowers effective throughput.",
    ],
    profilerSignals: [
      "Eligible warps per cycle",
      "Issue stalls from dependency or scoreboard waits",
      "Average active lanes per warp",
    ],
    commonMistakes: [
      "Ignoring lane ID when mapping per-lane responsibility",
      "Using block-wide synchronization when warp scope is sufficient",
    ],
  },
  simt: {
    advanced: [
      "SIMT allows different addresses per lane, but instruction flow still prefers uniform control paths.",
      "Predication can outperform branching for short conditionals by reducing reconvergence overhead.",
    ],
    profilerSignals: [
      "Branch efficiency",
      "Active mask utilization",
      "Instruction replay or serialization indicators",
    ],
    commonMistakes: [
      "Treating SIMT as fully independent MIMD execution",
      "Adding deep branch trees inside the hottest loop",
    ],
  },
  divergence: {
    advanced: [
      "Divergence cost is paid only when lanes in the same warp disagree; partitioning data by condition can remove much of it.",
      "Data-dependent loop bounds create persistent divergence across iterations and are often worse than one-off branches.",
    ],
    profilerSignals: [
      "Warp branch efficiency",
      "Average non-predicated-off threads",
      "Time spent in branch reconvergence stalls",
    ],
    commonMistakes: [
      "Optimizing divergence across blocks instead of within warps",
      "Using data-dependent `while` loops in hot paths",
    ],
  },
  "launch-indexing": {
    advanced: [
      "Lock indexing correctness before tuning performance; wrong ownership mapping invalidates all benchmarks.",
      "Grid-stride loops make kernels resilient to changing launch geometry and easier to reuse across input sizes.",
    ],
    profilerSignals: [
      "Boundary branch ratio",
      "Invalid access reports in sanitizer runs",
      "Numerical match against a CPU reference",
    ],
    commonMistakes: [
      "Missing tail bounds checks",
      "Mixing row and column index order in 2D kernels",
    ],
  },
  "memory-hierarchy": {
    advanced: [
      "Move frequently reused values upward in the hierarchy: HBM to L2, L2 to shared memory, shared memory to registers.",
      "A byte reused on-chip many times is usually worth more than shaving a few arithmetic instructions.",
    ],
    profilerSignals: [
      "DRAM bandwidth utilization",
      "L2 hit rate",
      "Register and shared-memory utilization",
    ],
    commonMistakes: [
      "Assuming cache will rescue poor access patterns",
      "Ignoring register spills that silently become local-memory traffic",
    ],
  },
  coalescing: {
    advanced: [
      "Coalescing quality comes from lane-to-address mapping, not from the arithmetic complexity of the kernel.",
      "Structure-of-arrays layouts usually outperform array-of-structures for warp-wide loads and stores.",
    ],
    profilerSignals: [
      "Global transactions per memory request",
      "DRAM bytes read versus requested bytes",
      "Load/store efficiency metrics",
    ],
    commonMistakes: [
      "Column-wise traversal on row-major tensors without staging",
      "Using misaligned base pointers for vectorized loads",
    ],
  },
  "bank-conflicts": {
    advanced: [
      "Shared memory is fast when lane accesses spread across banks in the same cycle.",
      "Adding one padded column in 2D tiles often removes worst-case conflicts in transpose-style patterns.",
    ],
    profilerSignals: [
      "Shared-memory bank conflict rate",
      "Wavefronts per shared-memory instruction",
      "Shared-memory throughput versus peak",
    ],
    commonMistakes: [
      "Using square tiles without padding while reading columns",
      "Assuming all shared-memory accesses are conflict-free by default",
    ],
  },
  occupancy: {
    advanced: [
      "Occupancy is a latency-hiding budget, not a direct optimization target.",
      "Lower occupancy can still win if extra registers unlock stronger instruction-level parallelism.",
    ],
    profilerSignals: [
      "Theoretical versus achieved occupancy",
      "Active warps per scheduler",
      "Resource limiters: registers, shared memory, blocks",
    ],
    commonMistakes: [
      "Forcing max occupancy and causing register spill",
      "Ignoring whether stalled warps are actually hidden",
    ],
  },
  "latency-hiding": {
    advanced: [
      "A stalled warp is acceptable if enough other eligible warps exist for the scheduler to switch immediately.",
      "Dependency chains can reduce eligibility even when occupancy appears high on paper.",
    ],
    profilerSignals: [
      "Eligible warps per cycle",
      "Stall reasons split by memory, dependency, and barrier",
      "Issue active versus issue idle cycles",
    ],
    commonMistakes: [
      "Confusing occupancy with true scheduler eligibility",
      "Adding more threads when the real issue is dependency depth",
    ],
  },
  "tensor-cores": {
    advanced: [
      "Tensor cores activate only when shape, layout, and dtype choices match supported MMA paths.",
      "Higher-precision accumulation (often FP32) is critical to preserve training stability.",
    ],
    profilerSignals: [
      "Tensor-core instruction utilization",
      "Math throughput versus tensor-core peak",
      "Kernel math mode and accumulation precision",
    ],
    commonMistakes: [
      "Using dimensions that miss tensor-core tile alignment",
      "Assuming tensor cores are active without profiler confirmation",
    ],
  },
  tiling: {
    advanced: [
      "Tile size should balance reuse, register pressure, shared-memory footprint, and occupancy.",
      "Effective tiling reduces redundant HBM reads and increases arithmetic done per loaded byte.",
    ],
    profilerSignals: [
      "Shared-memory throughput and utilization",
      "DRAM read reduction versus a naive baseline",
      "Achieved FLOP/s after tile-size sweeps",
    ],
    commonMistakes: [
      "Choosing tile shapes by intuition only",
      "Forgetting to coalesce movement into and out of tiles",
    ],
  },
  pipeline: {
    advanced: [
      "Pipelining overlaps stages: fetch the next tile while computing the current tile.",
      "Deeper pipelines can hide more latency but also increase register and shared-memory pressure.",
    ],
    profilerSignals: [
      "Memory stall reduction after pipelining",
      "Issue efficiency across loop iterations",
      "Resource growth as stage count increases",
    ],
    commonMistakes: [
      "Adding stages without enough compute work to hide latency",
      "Breaking correctness with missing synchronization between buffers",
    ],
  },
  streams: {
    advanced: [
      "Streams improve end-to-end throughput when transfer and compute can run concurrently.",
      "Real overlap requires pinned host memory, async APIs, and explicit dependency handling.",
    ],
    profilerSignals: [
      "Timeline overlap of H2D, kernels, and D2H",
      "Copy-engine utilization",
      "CPU launch gaps between stream operations",
    ],
    commonMistakes: [
      "Using default stream everywhere and expecting overlap",
      "Forgetting pinned memory for asynchronous copies",
    ],
  },
  "arithmetic-intensity": {
    advanced: [
      "Arithmetic intensity sets strategy: low AI is memory-centric tuning, high AI is compute-centric tuning.",
      "Kernel fusion raises effective AI when it adds FLOPs without increasing external memory traffic.",
    ],
    profilerSignals: [
      "Measured FLOP/s and DRAM bytes moved",
      "Effective AI before and after fusion",
      "Distance from memory and compute ceilings",
    ],
    commonMistakes: [
      "Counting FLOPs without counting bytes",
      "Assuming high FLOP/s automatically means high efficiency",
    ],
  },
  roofline: {
    advanced: [
      "Roofline is a decision tree: move right by increasing AI, move up by increasing execution efficiency.",
      "Kernel points far below both roofs usually indicate implementation inefficiency, not hardware limits.",
    ],
    profilerSignals: [
      "Kernel location in roofline view",
      "Peak bandwidth and peak compute references for the target GPU",
      "How the point moves after each optimization pass",
    ],
    commonMistakes: [
      "Comparing kernels across mismatched problem sizes without AI normalization",
      "Optimizing compute when the kernel is clearly memory-roof limited",
    ],
  },
  triton: {
    advanced: [
      "Triton abstracts threads, not hardware constraints; coalescing, tiling, and resource limits still govern performance.",
      "Treat `program_id` mapping and masking logic with the same rigor as CUDA indexing formulas.",
    ],
    profilerSignals: [
      "Auto-tuned config choices by problem shape",
      "Runtime variation across block sizes and `num_warps`",
      "Boundary correctness on odd-size inputs",
    ],
    commonMistakes: [
      "Relying on auto-tune without understanding why a config wins",
      "Ignoring masked edge cases that fail only on irregular sizes",
    ],
  },
  "flash-attention": {
    advanced: [
      "Flash Attention is an IO-aware redesign that avoids writing large score matrices to HBM.",
      "Online softmax statistics preserve numerical stability while tiles stream through SRAM.",
    ],
    profilerSignals: [
      "HBM bytes moved versus standard attention",
      "Runtime scaling with sequence length",
      "Numerical error relative to a reference implementation",
    ],
    commonMistakes: [
      "Breaking stability with incorrect running max or running sum updates",
      "Tuning block sizes while ignoring the underlying IO pattern",
    ],
  },
};

function ArticleStep(props) {
  var step = props.step;
  var Visual = step.visual;
  var extra = GPU_STEP_NOTES[step.id] || {};

  return (
    <section
      style={{
        padding: "22px 20px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h2
        style={{
          margin: "0 0 10px",
          color: "#fff",
          fontFamily: "Georgia, serif",
          fontSize: 25,
          fontWeight: 400,
          lineHeight: 1.2,
        }}
      >
        {step.title}
      </h2>

      {step.intro.map(function (paragraph, idx) {
        return (
          <p
            key={step.id + ":intro:" + idx}
            style={{
              margin: "0 0 11px",
              color: "rgba(255,255,255,0.82)",
              fontSize: 15,
              lineHeight: 1.72,
            }}
          >
            {paragraph}
          </p>
        );
      })}

      <figure style={{ margin: "18px 0 16px" }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Visual />
        </div>
        <figcaption
          style={{
            marginTop: 8,
            textAlign: "center",
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.4,
          }}
        >
          {step.caption}
        </figcaption>
      </figure>

      {step.deepDive.map(function (paragraph, idx) {
        return (
          <p
            key={step.id + ":deep:" + idx}
            style={{
              margin: "0 0 11px",
              color: "rgba(255,255,255,0.78)",
              fontSize: 14,
              lineHeight: 1.72,
            }}
          >
            {paragraph}
          </p>
        );
      })}

      {extra.advanced && extra.advanced.length > 0 ? (
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            Implementation Notes
          </div>
          {extra.advanced.map(function (paragraph, idx) {
            return (
              <p
                key={step.id + ":advanced:" + idx}
                style={{
                  margin: "0 0 10px",
                  color: "rgba(255,255,255,0.76)",
                  fontSize: 13.5,
                  lineHeight: 1.68,
                }}
              >
                {paragraph}
              </p>
            );
          })}
        </div>
      ) : null}

      {extra.profilerSignals && extra.profilerSignals.length > 0 ? (
        <div style={{ marginTop: 6 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            Profiler Signals To Watch
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {extra.profilerSignals.map(function (point, idx) {
              return (
                <li
                  key={step.id + ":signal:" + idx}
                  style={{
                    color: "rgba(255,255,255,0.76)",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    marginBottom: 5,
                  }}
                >
                  {point}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {extra.commonMistakes && extra.commonMistakes.length > 0 ? (
        <div style={{ marginTop: 10 }}>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              marginBottom: 8,
            }}
          >
            Common Mistakes
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            {extra.commonMistakes.map(function (point, idx) {
              return (
                <li
                  key={step.id + ":mistake:" + idx}
                  style={{
                    color: "rgba(255,255,255,0.76)",
                    fontSize: 13.5,
                    lineHeight: 1.55,
                    marginBottom: 5,
                  }}
                >
                  {point}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div style={{ marginTop: 10 }}>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
            marginBottom: 8,
          }}
        >
          What to retain
        </div>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {step.checkpoints.map(function (point, idx) {
            return (
              <li
                key={step.id + ":checkpoint:" + idx}
                style={{
                  color: "rgba(255,255,255,0.76)",
                  fontSize: 13.5,
                  lineHeight: 1.55,
                  marginBottom: 5,
                }}
              >
                {point}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default function LearningStepByStepArticle(props) {
  var headerSlot = props.headerSlot;
  var st = useState(LEARNING_SECTIONS[0].id);
  var activeSection = st[0];
  var setActiveSection = st[1];
  var activeSectionEntry =
    LEARNING_SECTIONS.find(function (section) {
      return section.id === activeSection;
    }) || LEARNING_SECTIONS[0];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#09090f",
        color: "#e8e8e8",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 16px 48px",
      }}
    >
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        {headerSlot ? (
          <div style={{ marginBottom: 18 }}>{headerSlot}</div>
        ) : null}

        <article>
          <header
            style={{
              marginBottom: 22,
              padding: "20px 18px 18px",
              borderRadius: 16,
              background:
                "linear-gradient(135deg, rgba(0,163,224,0.16), rgba(118,185,0,0.12) 55%, rgba(245,158,11,0.1))",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <h1
              style={{
                margin: 0,
                color: "#fff",
                fontFamily: "Georgia, serif",
                fontSize: 32,
                fontWeight: 400,
                letterSpacing: "-0.01em",
                lineHeight: 1.15,
              }}
            >
              Learning
            </h1>
            <p
              style={{
                margin: "10px 0 8px",
                color: "rgba(255,255,255,0.86)",
                fontSize: 15,
                lineHeight: 1.72,
              }}
            >
              Long-form, visual-first tutorials organized as topic sections.
            </p>
          </header>

          <ConceptSelector
            groups={LEARNING_GROUPS}
            concepts={LEARNING_SECTIONS}
            active={activeSection}
            onSelect={setActiveSection}
          />

          {activeSectionEntry.id === "gpu_architecture_tutorial" ? (
            <div>
              <section
                style={{
                  marginBottom: 16,
                  padding: "16px 18px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 8px",
                    color: "#fff",
                    fontFamily: "Georgia, serif",
                    fontSize: 26,
                    fontWeight: 400,
                  }}
                >
                  {activeSectionEntry.title}
                </h2>
                <p
                  style={{
                    margin: 0,
                    color: "rgba(255,255,255,0.78)",
                    fontSize: 14,
                    lineHeight: 1.68,
                  }}
                >
                  This section uses every GPU illustration in the project and
                  connects them into one narrative from hardware fundamentals to
                  optimization strategy.
                </p>
              </section>

              <section style={{ display: "grid", gap: 16 }}>
                {GPU_STEPS.map(function (step) {
                  return <ArticleStep key={step.id} step={step} />;
                })}
              </section>
            </div>
          ) : null}

          <footer
            style={{
              marginTop: 18,
              padding: "16px 18px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <h3
              style={{
                margin: "0 0 6px",
                color: "#fff",
                fontFamily: "Georgia, serif",
                fontSize: 22,
                fontWeight: 400,
              }}
            >
              How to use this tutorial
            </h3>
            <p
              style={{
                margin: "0 0 8px",
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                lineHeight: 1.68,
              }}
            >
              Read in order once, then revisit only the bottleneck-specific
              steps while profiling real kernels. Link every profiler counter
              you inspect to one concept from this page.
            </p>
            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.7)",
                fontSize: 14,
                lineHeight: 1.68,
              }}
            >
              Practical loop: identify bottleneck, map it to a step, apply one
              change, measure, and repeat.
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
