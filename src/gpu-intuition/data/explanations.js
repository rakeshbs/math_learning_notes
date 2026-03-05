export const EXPLANATIONS = {
  sm: {
    what: "A Streaming Multiprocessor (SM) is the fundamental compute unit of an NVIDIA GPU — a self-contained processor with its own CUDA cores (ALUs), Tensor Cores, warp schedulers, register file, and shared memory. The GPU die is a grid of SMs: the A100 has 108; the H100 has 132. Every instruction in every kernel ultimately executes inside an SM, making SM resource management the foundation of all GPU performance analysis.",
    visual:
      "Picture a large factory floor with many independent production units (SMs). Each unit has four assembly lines (warp schedulers), specialized workers (CUDA cores and Tensor Cores), a fast communal workbench (shared memory), and private supply closets for each worker (registers). All units run simultaneously, drawing raw materials from a shared warehouse (global memory).",
    intuition: [
      "Scheduling unit: the GPU driver assigns entire thread blocks to SMs; one block lives on exactly one SM for its full lifetime",
      "Hardware (A100 SM): 64 FP32 CUDA cores, 4 Tensor Cores, 4 dual-issue warp schedulers, 256 KB register file, up to 192 KB shared memory",
      "Capacity: one A100 SM supports up to 64 resident warps (2048 threads) simultaneously; actual resident count is limited by register and shared memory usage",
      "Throughput: 4 warp schedulers each issue one instruction per clock — as long as ready warps exist, the SM never stalls",
      "Utilization: to keep all SMs busy, launch at least (SM_count × max_blocks_per_SM) blocks; fewer blocks leave SMs completely idle",
      "Connection: SM resource budgets (registers, shared memory) directly determine occupancy, which in turn determines your ability to hide memory latency",
    ],
    formula: "max_resident_warps/SM = min(64, ⌊65536 / (regs_per_thread × 32)⌋, ⌊smem_per_SM / smem_per_block⌋ × threads_per_block/32)",
  },
  warp: {
    what: "A warp is a group of exactly 32 threads that execute in lockstep under the SIMT model. The warp scheduler issues one instruction per clock to all 32 threads simultaneously; each thread operates on its own private register data and may produce a different result. The warp — not the thread, and not the block — is the fundamental unit of GPU scheduling.",
    visual:
      "Imagine 32 soldiers marching in perfect formation: every soldier takes the exact same step at the same moment, but each carries a different pack (private register state). When any soldier needs to pause for supply delivery (memory stall), the entire squad steps aside and another squad takes the field. The drill sergeant (warp scheduler) rotates squads every cycle.",
    intuition: [
      "Hardware constant: warp size is always 32 on every NVIDIA GPU — this has never changed since the first CUDA device",
      "Shared program counter: all 32 threads in a warp advance through the same instruction sequence together",
      "Identification: warpID = threadIdx.x / 32; laneID = threadIdx.x % 32 — the lane is your position within the warp",
      "Throughput: an FP32 FMA instruction takes 4 cycles to complete; the scheduler issues the next instruction to a different warp in the meantime (latency hiding by multiplexing)",
      "Scheduling: a warp is ELIGIBLE if all operands are ready; STALLED if waiting for memory; SELECTED when the scheduler picks it to issue — at most 4 warps are SELECTED per cycle on an A100 SM",
      "Connection: divergence, occupancy, and latency hiding all operate at warp granularity — understanding the warp unlocks all of GPU performance analysis",
    ],
    formula: "warpID = threadIdx.x / 32  ;  laneID = threadIdx.x % 32",
  },
  thread_hierarchy: {
    what: "CUDA organizes threads in a three-level hierarchy: Threads are grouped into Blocks (up to 1024 threads each); Blocks form a Grid (up to billions of blocks). Threads within a block share L1/shared memory and can synchronize with __syncthreads(). Threads in different blocks cannot communicate directly during kernel execution — this constraint is what allows blocks to scale across any number of SMs.",
    visual:
      "A spreadsheet analogy: each cell is a thread, a group of adjacent cells in one row is a warp, an entire worksheet is a block, and the entire workbook is the grid. Cells on the same worksheet share a fast whiteboard (shared memory). Different worksheets can only exchange data through a slow hard drive (global memory) — intentionally, so the worksheets can be processed on any available processor.",
    intuition: [
      "Thread: the smallest unit; has private registers and a (slow, global-memory-backed) local memory for register spills",
      "Block: up to 1024 threads; always runs on a single SM; all threads can call __syncthreads() and share SMEM",
      "Grid: the entire launch; blocks may execute on different SMs in any order — no ordering guarantee exists across blocks",
      "Size limits: max 1024 threads per block (hardware constant); max block dims 1024×1024×64; max grid dims 2³¹-1 × 65535 × 65535",
      "Design rule: choose blockDim as a multiple of 32 (warp size); 128 or 256 threads per block is typical for most kernels",
      "Scaling: by keeping blocks independent, the same kernel binary runs efficiently on a 28-SM laptop GPU and a 132-SM H100 — the scheduler simply assigns more blocks per SM on the smaller GPU",
    ],
    formula: "globalIdx = blockIdx.x * blockDim.x + threadIdx.x",
  },
  tensor_cores: {
    what: "Tensor Cores are specialized matrix multiply-accumulate (MMA) hardware units within each SM that compute D = A × B + C in a single instruction, where A, B, C, D are small matrix fragments (e.g., 16×16 FP16 × 16×16 FP16 + 16×16 FP32). They deliver approximately 8–16× the FLOP/s of regular CUDA cores on the same SM. Every production deep learning kernel — GEMM, attention, convolution — is designed to use Tensor Cores.",
    visual:
      "Think of Tensor Cores as a dedicated matrix-multiply chip soldered onto each SM. A regular CUDA core multiplies two scalar numbers at a time. A Tensor Core takes a 16×16 chunk of matrix A and a 16×16 chunk of matrix B and produces a 16×16 output tile in one shot. An A100 delivers 312 TFLOPS in BF16 through Tensor Cores versus only 19.5 TFLOPS through scalar CUDA cores — a 16× difference.",
    intuition: [
      "Physical operation: at the hardware level, one Tensor Core performs a 4×4×4 MMA per clock; the 16×16×16 WMMA API fuses many of these with the full warp cooperating",
      "Throughput (A100): 312 TFLOPS BF16 / FP16 Tensor Core peak vs 19.5 TFLOPS FP32 CUDA core peak — 16× ratio",
      "Access API: use wmma (warp-level CUDA C++), mma PTX instructions, CUTLASS, or Triton's tl.dot() — in practice use CUTLASS or Triton",
      "Alignment requirement: matrix dimensions must be multiples of 16 for FP16/BF16 or 8 for INT8; misaligned sizes fall back to scalar CUDA cores silently",
      "Automatic activation: tl.dot() in Triton uses Tensor Cores automatically when BLOCK_M, BLOCK_N, BLOCK_K are multiples of 16",
      "Compute ceiling: Tensor Core TFLOPS is the performance ceiling for all compute-bound kernels — reaching it means writing code that the compiler can map to MMA instructions",
    ],
    formula: "D[M×N] = A[M×K] × B[K×N] + C[M×N]  (executed in one MMA warp instruction on Tensor Core hardware)",
  },
  memory_hierarchy: {
    what: "GPU memory is a strict hierarchy trading speed for capacity: Registers (~0 cycle latency, thread-private, ~256 KB per SM), Shared Memory (~20 cycles, block-shared on-chip SRAM, up to 228 KB per SM on H100), L2 Cache (~100–200 cycles, chip-wide, 40 MB on A100), and Global Memory / HBM (~300–700 cycles, all SMs, 80 GB on A100, 2 TB/s). Efficient GPU kernels are engineered to keep working data in the fastest available level.",
    visual:
      "An inverted pyramid of storage. At the tip: registers — tiny (a few KB per thread group) but instant. Moving down: shared memory (fast, block-sized working space), L2 (chip-wide automatic cache), and at the wide base: HBM (massive capacity, terabytes per second bandwidth but hundreds of nanoseconds of latency). The goal is always to avoid descending to the base.",
    intuition: [
      "Registers: zero-latency, private per thread — keep all hot accumulation values here; 65536 per SM shared across all threads",
      "Shared memory: programmer-controlled on-chip SRAM, ~1.5 TB/s bandwidth, ~20-cycle latency — the primary tool for reducing HBM traffic",
      "L2 cache: automatically managed, 40 MB on A100; an L2 hit reduces latency from ~700 cycles to ~100 cycles — helps for repeated reads but holds only a fraction of typical datasets",
      "HBM (global memory): 80 GB, 2 TB/s (A100) or 3.35 TB/s (H100) — the bottleneck for memory-bound kernels; the entire optimization game is reducing unique bytes loaded from here",
      "Design principle: every byte that enters a compute unit should be reused as many times as possible before eviction — this is the fundamental motivation for tiling",
      "Measurement: effective_bandwidth = bytes_transferred / kernel_time; target ≥ 70% of peak HBM bandwidth for memory-bound kernels",
    ],
    formula: "effective_bandwidth = bytes_transferred / kernel_time  ;  target: > 70% of peak HBM BW",
  },
  simt: {
    what: "SIMT (Single Instruction, Multiple Threads) is NVIDIA's execution model: all 32 threads in a warp execute the same instruction every clock cycle, but each thread holds its own register state and can read/write different memory addresses. This gives the throughput of vector execution (like AVX-512) with the flexibility of per-thread control flow — at the cost of serialization when threads take different branches.",
    visual:
      "32 lanes of a highway in a convoy: all cars travel at the same speed, make the same turns, follow the same traffic signals — but each car carries different cargo. When one car needs to take a detour (branch divergence), all cars must slow down and the detour car goes first while the others idle, then the group continues together.",
    intuition: [
      "Efficiency: 32 threads share one instruction fetch/decode unit, saving ~32× die area versus 32 independent scalar processors — this is why GPUs have thousands of cores",
      "Per-thread independence: each thread reads from its own address (A[i], B[i]) producing its own result — same instruction, different data",
      "SIMT vs SIMD: in AVX-512, all 16 lanes must process the same element of the same array; in SIMT, each thread has a fully independent address and register file",
      "Divergence cost: when threads in the same warp take different branches, the GPU serializes the paths — up to 2× slowdown for a 50/50 split, up to 32× for all-different paths",
      "Predicated execution: masked-out threads in a divergent warp still consume the issue slot; they simply do not write back results — the slot is wasted",
      "Volta+ ITS: Independent Thread Scheduling adds a per-thread PC alongside the warp PC, enabling finer-grained divergence handling and inter-thread synchronization patterns impossible on pre-Volta GPUs",
    ],
    formula: "A[i] = B[i] * C[i]  -- thread i reads B[i], C[i], writes A[i]; all 32 lanes execute simultaneously",
  },
  warp_divergence: {
    what: "Warp divergence occurs when threads within the same warp take different paths through a branch (if/else, switch, or data-dependent loop bounds). Because all threads in a warp share one program counter, the GPU must execute each distinct path serially while masking out inactive threads. The worst-case slowdown equals the number of distinct paths taken by threads in the warp.",
    visual:
      "32 runners on a track reach a fork: half must go left, half must go right. Since they must stay as a group, the left-group runs their path while the right-group stands still, then vice versa. Elapsed time equals the sum of both path lengths instead of the maximum — the entire efficiency advantage of parallel execution is lost for the diverged portion.",
    intuition: [
      "Scope: divergence only penalizes threads within the same warp — different warps can take completely different branches with no performance cost",
      "Slowdown formula: cost = Σ(cycles for each distinct path) instead of max(cycles for each path)",
      "50/50 split: a simple if/else where half the warp goes each way incurs at most 2× slowdown for the diverged region",
      "Elimination strategy: sort or partition data so that all 32 threads in a warp consistently take the same branch — e.g., process all 'true' elements first, then all 'false' elements",
      "Predication: short branches (2–3 instructions) are often converted by the compiler to predicated execution (cmov-style) which avoids divergence at the cost of executing both sides",
      "Volta+ reconvergence: threads reconverge immediately at the earliest legal point (the join dominator), rather than waiting until the end of the if/else block — often reduces serialization cost",
    ],
    formula: "slowdown ≤ (# distinct paths taken by lanes in this warp)  ; worst case = 32 distinct paths",
  },
  occupancy: {
    what: "Occupancy is the ratio of active warps on an SM to the SM's maximum theoretical warp capacity (64 on A100/H100). Higher occupancy gives the warp scheduler more warps to switch between when one stalls on a memory access, enabling better latency hiding. Occupancy is limited by three independent resources: registers per thread, shared memory per block, and threads per block.",
    visual:
      "An SM is a juggler with 64 ball slots (warp slots). Every ball in the air is a warp that can be activated the moment the current warp stalls. Too few balls (low occupancy): the juggler frequently has nothing to catch. Too many balls crammed into each hand (high register use): the juggler can hold fewer balls total. The sweet spot balances slot count against resource consumption.",
    intuition: [
      "Maximum: 64 warps per SM (2048 threads) on A100 and H100; this is set by the warp scheduler hardware",
      "Register limiter: each SM has 65536 registers; at 64 regs/thread × 32 threads/warp = 2048 regs/warp → only 32 warps active (50% occupancy)",
      "Shared memory limiter: a block using 96 KB of SMEM on an A100 (192 KB total) allows only 2 concurrent blocks → low occupancy if blocks are small",
      "Threads-per-block limiter: 256-thread blocks → 2048/256 = 8 blocks/SM maximum; 1024-thread blocks → 2 blocks/SM maximum",
      "Diminishing returns: experiments show that occupancy beyond ~50% yields minimal additional throughput — the scheduler can already hide most latency at 32 active warps",
      "ILP trade-off: using more registers per thread to hold multiple independent accumulation values (register blocking) often wins over maximizing occupancy, even at 25–33% occupancy",
    ],
    formula: "occupancy = active_warps_per_SM / max_warps_per_SM  ;  max_warps bounded by regs, smem, and block_size",
  },
  latency_hiding: {
    what: "Latency hiding is the mechanism by which GPUs tolerate high-latency memory operations without stalling. When a warp issues a global memory load (~300–700 cycles), the warp scheduler immediately switches to executing another ready warp. By the time the data returns, hundreds of useful instructions have executed in other warps, keeping the ALUs busy with zero idle time — provided enough resident warps exist.",
    visual:
      "A chef (SM) managing 8 simmering pots (warps). When one pot needs 10 minutes to come to a boil (memory latency), the chef doesn't wait — they immediately tend to the next pot. When the boiling pot is ready, the chef returns to it. The total time barely exceeds the longest single operation, because no idle time accumulates as long as there are pots to tend.",
    intuition: [
      "Memory latency: global memory (HBM) access takes ~300–700 clock cycles on an A100; shared memory takes ~20 cycles; registers take 0 cycles",
      "Issue rate: 4 warp schedulers × 1 instruction/cycle = 4 warp instructions issued per clock cycle per SM",
      "Warps needed to hide latency: latency_cycles / issue_interval ≈ 700 / 4 ≈ 175 instruction slots; at 32 threads/warp, ~6 warps would suffice if they all had independent memory requests",
      "Practical rule: aim for ≥ 25–32 active warps per SM to fully hide HBM latency with typical kernels",
      "Memory-bound kernels: even with perfect latency hiding, the bandwidth ceiling still applies — latency hiding does not increase bandwidth, only utilization",
      "Compute-bound kernels: latency hiding matters less; instruction-level parallelism (ILP) within a single warp matters more — interleave independent instructions",
    ],
    formula: "warps_needed_to_hide_latency ≈ memory_latency_cycles / issue_rate_cycles_per_warp",
  },
  global_memory: {
    what: "Global memory is the GPU's main DRAM — High Bandwidth Memory (HBM) stacked directly on the GPU die. It is accessible by all threads on all SMs, persists across kernel launches, and provides the largest capacity (80 GB on A100/H100) with the highest raw bandwidth (2–3.35 TB/s). Its ~300–700 cycle access latency makes access-pattern optimization the #1 performance lever for memory-bound kernels.",
    visual:
      "A large warehouse on the far side of town. Enormous capacity, but every trip takes time (~700 cycles). The loading dock sends trucks that carry exactly 128 bytes per trip (one cache line). If all 32 workers in a warp need adjacent items, one truck serves everyone — perfect efficiency. If each worker needs an item from a random shelf, 32 separate trucks are dispatched — 32× the cost for the same data volume.",
    intuition: [
      "Bandwidth: A100 = 2 TB/s (HBM2e, 5120-bit bus); H100 = 3.35 TB/s (HBM3) — far higher than any CPU but only reached with coalesced access",
      "Cache line: the atomic unit of global memory transfer is 128 bytes (32 float32 values); a perfectly coalesced warp access fetches exactly one cache line",
      "Coalescing rule: thread i should access address base + i (stride-1); stride-2 doubles traffic; stride-4 quadruples it; random access incurs up to 32× traffic",
      "Vectorized loads: float4 loads pack 4 floats into one 128-bit instruction, quadrupling effective bandwidth utilization without changing memory traffic",
      "L2 cache: 40 MB on A100 automatically caches global memory reads; repeated reads within L2 capacity cost ~100 cycles instead of ~700 — significant for attention-like access patterns",
      "Benchmark: use nsight compute 'L1 → Global Memory Transactions per Request' metric; ideal = 1.0, indicating perfectly coalesced access",
    ],
    formula: "coalesced warp: 32 threads × 4 bytes = 128 bytes = 1 cache line transaction  ;  uncoalesced: up to 32 transactions",
  },
  shared_memory: {
    what: "Shared memory (SMEM) is an explicitly programmer-managed on-chip SRAM, local to each SM, and shared among all threads within a block. It delivers ~1.5 TB/s of bandwidth at ~20-cycle latency — roughly 100× faster than HBM. SMEM is the primary tool for GPU optimization: load data from global memory once into SMEM, reuse it many times for computation, then write results back to global memory.",
    visual:
      "A shared whiteboard inside the factory floor. All workers in the room (one block) can read and write it instantly. The workflow: workers carry a stack of parts from the warehouse (global memory) to the whiteboard, lay everything out, then process the parts repeatedly using only the whiteboard. One slow trip to the warehouse enables many fast computations.",
    intuition: [
      "Capacity: A100 = up to 192 KB per SM (shared between L1 and SMEM, configurable); H100 = up to 228 KB — the H100 increase directly enables Flash Attention 3",
      "Speed: ~1.5 TB/s bandwidth, ~20-cycle latency — compared to HBM's 2 TB/s bandwidth but ~700-cycle latency; SMEM wins for repeated reuse",
      "Declaration: __shared__ float tile[BLOCK_M][BLOCK_K]; in CUDA; tl.load manages SMEM automatically in Triton",
      "Core pattern: load from global memory (coalesced) → __syncthreads() → compute from SMEM → write back to global (coalesced)",
      "Block isolation: each block has its own private SMEM region; threads in different blocks cannot read each other's SMEM",
      "Bank structure: SMEM is divided into 32 banks of 4 bytes each; accessing multiple elements in the same bank in the same cycle causes bank conflicts and serialization",
    ],
    formula: "__shared__ float tile[TILE_M][TILE_K];  // allocated per block, freed automatically at block exit",
  },
  registers: {
    what: "Registers are the fastest storage on a GPU — zero additional latency, directly used by ALUs, and completely private per thread. Each SM has a large register file (65536 × 32-bit registers on A100 and H100) shared across all resident threads. Register usage per thread directly limits warp occupancy: fewer registers per thread means more threads can be resident, but too few registers forces the compiler to spill data to slow local memory.",
    visual:
      "Each thread is a calculator with N slots (registers) for holding numbers. The SM provides a fixed total budget of 65536 slots shared among all active threads. If every calculator needs 64 slots, only 65536/64 = 1024 calculators can operate simultaneously (32 warps). Use fewer slots per calculator to fit more calculators in at once — but if the slots run out, the calculator has to write temporary values to a slow notebook (local memory spill).",
    intuition: [
      "Budget: 65536 × 32-bit registers per SM on both A100 and H100; each active thread consumes its declared register count",
      "Occupancy formula: max_warps = min(64, ⌊65536 / (regs_per_thread × 32)⌋)",
      "Examples: 32 regs/thread → 64 warps (100%); 64 regs/thread → 32 warps (50%); 128 regs/thread → 16 warps (25%)",
      "Measurement: compile with nvcc --ptxas-options=-v to see exact register count and spill statistics per kernel",
      "Register spilling: if a kernel needs more registers than available, the compiler stores the excess in 'local memory' — which is physically global memory with per-thread addressing — causing severe latency",
      "Control: use __launch_bounds__(maxThreadsPerBlock) to tell the compiler the max block size, enabling more aggressive register allocation that avoids spills",
    ],
    formula: "max_active_warps = min(64, ⌊65536 / (regs_per_thread × 32)⌋)",
  },
  coalescing: {
    what: "Memory coalescing is the GPU's ability to merge the memory requests of all 32 threads in a warp into a single cache-line transaction. When thread i accesses a float at address base + i (stride-1, contiguous), the 32 accesses span exactly 128 bytes — one cache line — and are served by one memory transaction. Strided or scattered access patterns defeat coalescing and multiply memory traffic proportionally.",
    visual:
      "32 people numbered 0–31 each want one item from a filing system. If the items are stored consecutively (item 0 in slot 0, item 1 in slot 1, ...), one courier opens a single drawer and distributes all 32 items in one trip. If each person's item is in slot i×8 (stride-8 access), the courier must open 32 separate drawers — same total items, 32× the work.",
    intuition: [
      "Ideal pattern: thread i accesses address base + i (stride-1); all 32 accesses span exactly 128 bytes = 1 cache-line transaction",
      "Stride-N penalty: stride-2 access → 2 transactions; stride-4 → 4 transactions; stride-32 → up to 32 transactions; random → up to 32 transactions",
      "Layout transformation: convert AoS (Array of Structures: {x,y,z} per element) to SoA (Structure of Arrays: all x[], all y[], all z[]) so that field accesses are contiguous in memory",
      "Matrix access: in a row-major 2D array, accessing a full row is coalesced; accessing a full column (stride = num_columns) is completely uncoalesced — use shared memory to transpose",
      "Vectorized loads: float4 (128-bit load) reads 4 consecutive floats in one instruction; if the tile is coalesced, this quadruples throughput with no added traffic",
      "Diagnosis: Nsight Compute 'L1 TEX → Global Load Transactions per Request'; ideal = 1.0 (128 bytes per 32 threads)",
    ],
    formula: "ideal: 32 threads × 4B = 128B = 1 transaction;  stride-N: N transactions per warp",
  },
  bank_conflicts: {
    what: "Shared memory is divided into 32 banks, each 4 bytes wide, delivering one 32-bit word per cycle. When multiple threads in a warp access addresses that map to the same bank simultaneously, the accesses are serialized — an N-way bank conflict takes N cycles instead of 1. The one exception: if all threads read the exact same address, the hardware broadcasts to all in 1 cycle regardless of bank.",
    visual:
      "32 checkout registers (banks) at a store, and 32 customers (threads) arriving simultaneously. If each customer goes to a different register — all 32 are served in one cycle. If 4 customers all queue at register #5 — they wait 4 cycles, while the other 28 registers sit idle. That wasted capacity is the throughput cost of bank conflicts.",
    intuition: [
      "Bank assignment: bank_id = (element_index × sizeof(element) / 4) % 32 — for float32 arrays, element i maps to bank (i % 32)",
      "Conflict-free access: thread i reads element i → banks 0,1,2,...,31 all different → 1 cycle, full bandwidth",
      "N-way conflict: N threads read elements that all map to the same bank → N serialized accesses → N× slowdown",
      "Broadcast exception: all 32 threads read the exact same address → hardware broadcast → 1 cycle, no conflict",
      "Classic pitfall — stride-32: thread i reads tile[i][j×32] for 2D arrays → all elements in same bank column → 32-way conflict; fix with padding",
      "Padding fix: declare float tile[32][33] instead of [32][32]; the extra column shifts bank assignments so column accesses are conflict-free",
    ],
    formula: "bank_id = (byte_address / 4) % 32  ;  N-way conflict ↔ N threads sharing same bank_id in same cycle",
  },
  kernel_launch: {
    what: "Launching a CUDA kernel configures the three-level thread hierarchy and dispatches work to the GPU. The syntax is kernel<<<gridDim, blockDim, smemBytes, stream>>>(args). The runtime distributes blocks across available SMs; block execution order is not guaranteed. Understanding launch configuration is essential: wrong gridDim or blockDim can leave SMs idle or cause incorrect bounds behavior.",
    visual:
      "A factory dispatch desk: you hand in a work order specifying how many teams (gridDim blocks) to form, how large each team is (blockDim threads), how much whiteboard space each team gets (smemBytes), and which production line to use (stream). The dispatch desk assigns teams to factory floors (SMs) as they become available, with no ordering guarantee across teams.",
    intuition: [
      "Syntax: kernel<<<dim3(Gx,Gy,Gz), dim3(Bx,By,Bz), smem_bytes, stream>>>(args) — all four chevron parameters are optional except the first two",
      "blockDim rule: must be a multiple of 32 (warp size); 128 or 256 threads per block is the standard starting point for 1D kernels",
      "gridDim calculation: gridDim.x = (N + blockDim.x - 1) / blockDim.x — the ceiling division pattern; never use N / blockDim.x which truncates",
      "smemBytes: this is dynamic shared memory added on top of any static __shared__ declarations; total SMEM per block = static + dynamic",
      "Launch overhead: each kernel launch costs ~2–10 µs of CPU-side overhead; for high-frequency inference, use CUDA Graphs to amortize this to ~3–5 µs for an entire sequence of launches",
      "Multiple kernels: operations on the same stream execute sequentially; use separate named streams for concurrent kernel execution or overlap with memory copies",
    ],
    formula: "kernel<<<dim3(Gx,Gy,Gz), dim3(Bx,By,Bz), smem_bytes, stream>>>(args);",
  },
  thread_indexing: {
    what: "Thread indexing maps the three-level thread hierarchy to problem-domain indices. Each thread has four built-in variables: threadIdx (position within block), blockIdx (block position within grid), blockDim (block dimensions), and gridDim (grid dimensions). Computing the correct global index is the first operation in every CUDA kernel, and indexing errors are among the most common and hardest-to-debug GPU bugs.",
    visual:
      "A stadium with numbered sections (blocks) and numbered seats within each section (threads). To find your global seat number: multiply your section number by the section capacity (blockDim) and add your local seat number (threadIdx). A 2D stadium has row-sections and column-sections — the same formula extends naturally to 2D and 3D.",
    intuition: [
      "1D indexing: global_i = blockIdx.x × blockDim.x + threadIdx.x — covers all N elements across all blocks",
      "2D indexing: global_row = blockIdx.y × blockDim.y + threadIdx.y; global_col = blockIdx.x × blockDim.x + threadIdx.x — note: x maps to columns (fastest-varying, inner loop)",
      "Bounds check: if (global_i >= N) return; — always required; gridDim is rounded up so the last block may have threads that map beyond the array boundary",
      "Convention: threadIdx.x / blockIdx.x is the fastest-varying dimension in CUDA, matching how memory is typically laid out in row-major C arrays",
      "Grid-stride loop: for (int i = global_i; i < N; i += gridDim.x × blockDim.x) — allows a fixed launch config to process arrays of arbitrary size without re-launching",
      "3D tensors: flat_index = n × H × W + h × W + w; decompose back with n = flat / (H×W), h = (flat % (H×W)) / W, w = flat % W",
    ],
    formula: "tid_1d = blockIdx.x * blockDim.x + threadIdx.x;  grid_stride = gridDim.x * blockDim.x",
  },
  synchronization: {
    what: "__syncthreads() is a block-level barrier: execution stalls at this line until every thread in the block has reached it. This is necessary whenever some threads write shared memory and other threads need to read those writes — without the barrier, reads may observe stale or partially written data. There is no barrier primitive for cross-block synchronization within a kernel.",
    visual:
      "A relay race where all runners must reach the halfway checkpoint before any runner can continue to the finish. Fast runners arrive first and wait at the tape. Once the last runner crosses, all proceed together. Removing the checkpoint would let fast runners grab a baton that a slow runner hasn't yet placed — a data race.",
    intuition: [
      "Semantics: __syncthreads() is a memory fence plus a thread barrier — all shared memory writes before the barrier are visible to all threads after it",
      "Pattern: load to SMEM → __syncthreads() → compute from SMEM → (optional) __syncthreads() before overwriting SMEM with next tile",
      "Safety rule: every thread in the block must execute __syncthreads() on the same call — placing it inside a divergent if branch causes deadlock",
      "Warp-level: __syncwarp(mask) synchronizes only the 32 threads of one warp; faster and sufficient for warp reductions using __shfl_down_sync",
      "Grid-level: there is NO __syncgrid() primitive; to synchronize across blocks, split the work into two sequential kernel launches",
      "Host-side: cudaDeviceSynchronize() blocks the CPU thread until all GPU kernels complete; cudaStreamSynchronize(s) waits for one stream",
    ],
    formula: "__syncthreads();  // ALL threads in block must reach this; any skipped thread = undefined behavior",
  },
  cuda_streams: {
    what: "CUDA streams are ordered queues of GPU operations. Operations within the same stream execute sequentially; operations in different streams may overlap on the hardware. The primary use case is overlapping kernel execution with host-to-device (H2D) and device-to-host (D2H) memory copies — enabling the GPU to compute batch i while transferring batch i+1, approaching continuous GPU utilization.",
    visual:
      "A multi-lane highway where each lane is a stream. The default stream is a single-lane road: the car (operation) in front must clear before the next enters. Multiple streams are multiple lanes: a data transfer can proceed in lane 1 while a kernel runs in lane 2 and another transfer occurs in lane 3 — true concurrent progress, limited only by hardware capacity.",
    intuition: [
      "Default stream (stream 0): all operations are serialized — useful for correctness but wastes overlap opportunity",
      "Named streams: cudaStreamCreate(&stream); pass as 4th argument to kernel launches and cudaMemcpyAsync",
      "Pinned memory requirement: cudaMallocHost(&ptr, N) allocates page-locked host memory required for truly asynchronous (non-blocking) copies",
      "Overlap pattern: while kernel(data[i]) runs on stream_A, issue cudaMemcpyAsync(data[i+1], ..., stream_B) — data transfer hides behind compute",
      "Event synchronization: cudaEvent_t allows one stream to wait for a specific point in another stream — precise dependency management across streams",
      "CUDA Graphs: capture a multi-stream operation sequence into a graph, then replay it with ~3–5 µs total CPU overhead regardless of graph size — critical for transformer inference where per-layer kernel launch overhead dominates",
    ],
    formula: "cudaMemcpyAsync(dst, src, N, cudaMemcpyH2D, stream);  kernel<<<G,B,0,stream>>>(args);",
  },
  atomic_ops: {
    what: "Atomic operations perform thread-safe read-modify-write sequences on a single memory location without explicit locks. The GPU memory controller serializes concurrent atomic requests to the same address, guaranteeing that the result is correct regardless of how many threads execute simultaneously. Common operations: atomicAdd, atomicMax, atomicMin, atomicCAS, atomicExch.",
    visual:
      "A shared counter box with a single key (the memory address). Each thread wants to add its value to the counter. Atomics work like a bank teller queue: only one customer (thread) can access the counter at a time, but the system guarantees every addition is applied exactly once and in some valid order. The queue is fast when short; a serial bottleneck when thousands of threads are all waiting for the same counter.",
    intuition: [
      "Guarantee: atomicAdd(&addr, val) returns the previous value; the counter is incremented exactly once per call, even with 10,000 concurrent calls",
      "Implementation: global atomics serialize at the L2 cache memory controller; shared memory atomics serialize at the L1 — shared memory atomics are ~10× faster for high-contention cases",
      "Contention bottleneck: if all N threads simultaneously atomicAdd to the same address, execution is fully serialized — O(N) sequential operations, destroying parallelism",
      "Better pattern for reductions: warp-level reduce with __shfl_down_sync (32 threads → 1 value in 5 steps), then one atomicAdd per warp — 32× fewer atomic operations",
      "atomicCAS (compare-and-swap): the universal primitive; atomicCAS(&addr, expected, desired) atomically replaces addr with desired only if addr == expected, returning the old value",
      "Float precision: float atomicAdd is not bit-identical to sequential summation due to floating-point non-associativity — acceptable for ML training gradients, not for deterministic results",
    ],
    formula: "int old = atomicAdd(&counter, 1);  // old = value before increment; counter is now old+1",
  },
  triton_model: {
    what: "Triton is a Python-embedded GPU programming language where kernels are written at the tile (block) level rather than the thread level. Instead of managing individual threads, the programmer describes operations over tiles of data; the Triton compiler handles thread assignment, vectorization, shared memory insertion, and (on Ampere+) software pipelining automatically. One Triton kernel program instance processes one tile of output.",
    visual:
      "CUDA: you are a manager directing each of 1024 individual workers on exactly what to pick, where to walk, and when to stop. Triton: you are a logistics director specifying how to move and process 32-element pallets (tiles), and the compiler figures out how to assign workers to pallets, how to stack the warehouse, and how to run the forklift. Less fine-grained control, but dramatically faster to develop.",
    intuition: [
      "@triton.jit: the decorator that JIT-compiles a Python function to PTX/CUBIN for the target GPU",
      "tl.program_id(axis=0): returns which tile this program instance is responsible for — analogous to blockIdx.x in CUDA",
      "One program = one tile: each Triton kernel invocation handles one BLOCK_SIZE-element tile of work; the grid of programs covers the full problem",
      "Automatic SMEM: Triton inserts shared memory loads and stores automatically; you never write __shared__ or __syncthreads() explicitly",
      "Compile pipeline: Python AST → Triton IR → LLVM IR → PTX → CUBIN; intermediate IRs expose vectorization, tiling, and pipeline optimization passes",
      "Production adoption: PyTorch ≥ 2.0 uses Triton for FlashAttention (SDPA), vLLM uses Triton for paged attention kernels, Liger-kernel provides Triton fused ops for LLM training",
    ],
    formula: "@triton.jit  def kernel(ptr, BLOCK_SIZE: tl.constexpr):  pid = tl.program_id(axis=0)",
  },
  triton_tiles: {
    what: "In Triton, a kernel program works with a tile of contiguous data elements. tl.arange(0, BLOCK_SIZE) generates the per-element offsets within the tile. tl.load(ptr + offsets, mask) loads a tile from global memory into registers. The mask parameter handles boundary cases where the last tile may extend beyond the end of the array. tl.store writes results back with the same mask.",
    visual:
      "Slicing a baguette into equal pieces for a party. Each program instance claims one slice (tile), described by its starting position (pid × BLOCK_SIZE) plus an array of intra-slice offsets (tl.arange). A mask ensures you don't accidentally try to claim bread that doesn't exist at the end of the loaf. Every operation on the slice is then expressed as a vectorized operation on all its elements at once.",
    intuition: [
      "Core indexing: offsets = pid × BLOCK_SIZE + tl.arange(0, BLOCK_SIZE) — this produces the global element indices for this tile",
      "Boundary mask: mask = offsets < n_elements — on the last (possibly partial) tile, some offsets will exceed n_elements and must be masked out",
      "Masked load: x = tl.load(ptr + offsets, mask=mask, other=0.0) — masked elements load the 'other' value instead of reading out-of-bounds memory",
      "Masked store: tl.store(out_ptr + offsets, result, mask=mask) — masked elements are simply not written, preventing out-of-bounds writes",
      "BLOCK_SIZE constraint: must be a power of 2 (64, 128, 256, 512, 1024) and declared as tl.constexpr — the compiler needs it at compile time to unroll loops and choose vector widths",
      "2D tiles: rows = tl.arange(0, BLOCK_M)[:, None]; cols = tl.arange(0, BLOCK_N)[None, :]; offsets = rows * stride_row + cols — broadcasting creates the 2D tile index matrix",
    ],
    formula: "offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE)  ;  x = tl.load(ptr + offsets, mask=offsets < N)",
  },
  triton_ops: {
    what: "Triton provides tile-level operations that compile to optimal GPU instructions. The most important: tl.dot(a, b) performs a matrix multiply of two tiles and maps to Tensor Core MMA instructions. tl.sum(x, axis) reduces a tile along one dimension. tl.load and tl.store with cache hints control memory behavior. tl.exp, tl.log, and other math functions map to libdevice (CUDA device math library).",
    visual:
      "A high-level toolbox where each tool operates on entire rectangular data tiles rather than single scalars. dot() fuses two tiles into a matrix product using Tensor Core hardware. sum() collapses a tile into a smaller vector. exp() maps elementwise over every element using the GPU's built-in transcendental units. The Triton compiler selects the most efficient underlying instruction for each tool on the target architecture.",
    intuition: [
      "tl.dot(a, b): the critical operation — requires both inputs as float16/bfloat16, returns float32 accumulator; uses Tensor Cores automatically when BLOCK sizes are multiples of 16",
      "tl.sum(x, axis=1): reduces each row to a scalar — use for softmax denominator; axis=0 reduces each column",
      "tl.max(x, axis=1): row-wise maximum — use for numerically stable softmax: subtract max before exp",
      "tl.atomic_add(ptr + offset, val): inter-program (cross-tile) accumulation without locks — use for histograms or gradient accumulation",
      "tl.where(cond, a, b): element-wise selection — applies causal masking, handles NaN/inf exclusion",
      "tl.constexpr vs runtime: BLOCK_SIZE and other tile dimensions must be constexpr — the compiler uses them to determine vector widths, unroll depths, and register allocation",
    ],
    formula: "acc = tl.dot(a_tile, b_tile)  # shape [BLOCK_M, BLOCK_N], uses Tensor Cores if dims are multiples of 16",
  },
  triton_autotuning: {
    what: "Triton's @triton.autotune decorator automatically selects the best kernel configuration by benchmarking a set of candidate configs at the first invocation for each unique problem shape. The key parameter identifies which kernel arguments define a unique problem (e.g., ['M', 'N', 'K'] for GEMM). The winning config is cached; subsequent calls with the same key reuse it without benchmarking.",
    visual:
      "Before a race, a team tries five different car setups — different tire pressures (BLOCK_SIZE), engine tunes (num_warps), and fuel strategies (num_stages). They time each configuration on the actual track for the actual race distance. The winning setup is locked in and used for all future races of the same type. You pay the benchmarking cost once; all future calls use the optimal configuration.",
    intuition: [
      "Decorator syntax: @triton.autotune(configs=[Config({'BLOCK_SIZE': 128, 'num_warps': 4}), ...], key=['n_elements'])",
      "key parameter: lists the function arguments that affect the best configuration; re-benchmarks whenever any key argument value changes",
      "num_warps: directly controls threads per block = 32 × num_warps; affects SM occupancy and warp scheduling",
      "num_stages: depth of the software pipeline (double buffer = 2, triple buffer = 3); requires cp.async hardware (Ampere+)",
      "GEMM sweep: typically search BLOCK_M ∈ {64,128,256}, BLOCK_N ∈ {64,128}, BLOCK_K ∈ {32,64}, num_warps ∈ {4,8}, num_stages ∈ {2,3,4}",
      "Production note: the first call is slow (benchmarking all configs); add one warmup call before timing benchmarks to ensure cached config is active",
    ],
    formula: "@triton.autotune(configs=[Config(kwargs, num_warps=W, num_stages=S)], key=[dim_names])",
  },
  roofline: {
    what: "The Roofline Model predicts kernel throughput by identifying whether it is compute-bound or memory-bound. Achievable performance = min(peak_FLOPS, peak_bandwidth × arithmetic_intensity). Kernels to the left of the ridge point (low arithmetic intensity) are memory-bound — improving compute won't help. Kernels to the right are compute-bound — improving memory access won't help. It is the first diagnostic framework for kernel optimization.",
    visual:
      "A log-log performance chart with two lines forming a roof. The left slope rises from lower-left: more arithmetic intensity → more achievable FLOPS (bandwidth ceiling). The right flat ceiling is peak compute. Your kernel is a single dot on this chart. To the left of the peak: the bandwidth lane is the bottleneck — reduce bytes or increase reuse. To the right: the compute lane is the bottleneck — reduce redundant FLOPs or improve instruction scheduling.",
    intuition: [
      "A100 ridge point: 312 TFLOPS BF16 ÷ 2 TB/s = 156 FLOP/byte — above this arithmetic intensity, the kernel is compute-bound",
      "Element-wise ops (add, ReLU): AI ≈ 0.08–0.5 FLOP/byte — firmly memory-bound; the fix is kernel fusion to increase FLOPs per byte loaded",
      "GEMM (large): AI ≈ TILE_SIZE/2 — for TILE=128, AI ≈ 64 FLOP/byte; still memory-bound on A100 until TILE > 312",
      "Practical use: measure actual AI and achieved FLOPS with Nsight Compute; if both are below the roofline, there is a third bottleneck (divergence, synchronization overhead, etc.)",
      "Fusion impact: fusing LayerNorm into a GEMM output adds FLOPs for free (same bytes read), raising AI and potentially crossing the ridge point",
      "GPU comparison: H100 ridge point = 989 TFLOPS ÷ 3.35 TB/s ≈ 295 FLOP/byte — H100 is much harder to reach compute-bound than A100",
    ],
    formula: "achievable_FLOPS = min(peak_FLOPS, peak_BW × AI)  where  AI = total_FLOPs / total_bytes_from_HBM",
  },
  arithmetic_intensity: {
    what: "Arithmetic Intensity (AI) is the ratio of floating-point operations performed to bytes of data moved to/from DRAM: AI = FLOPs / bytes. It is the horizontal axis of the Roofline Model and determines whether a kernel is memory-bound (low AI) or compute-bound (high AI). Tiling dramatically increases AI by enabling data reuse from fast on-chip memory; operator fusion increases AI by adding computation to existing data transfers.",
    visual:
      "Brick-laying efficiency: AI = bricks laid ÷ trips to the supply depot. Low AI: walk to the depot, pick up one brick, lay it, repeat 1000 times — almost all time spent walking (memory-bound). High AI: carry 100 bricks per trip (tiling), lay all 100 at the worksite, then return — almost all time spent laying (compute-bound). The goal is to maximize bricks per depot trip.",
    intuition: [
      "Vector add C = A + B: 1 FLOP per element; 12 bytes (2 reads + 1 write) → AI = 0.083 FLOP/byte — one of the lowest possible; always memory-bound",
      "GEMM M=N=K=4096 (FP32): 2×4096³ ≈ 137 GFLOP; bytes = (4096²+4096²+4096²)×4 ≈ 201 GB → AI ≈ 682 FLOP/byte — solidly compute-bound on A100",
      "Softmax over N elements: 3 passes × N elements × ~3 FLOPs + 2×N reads × 4B → AI ≈ 0.75 FLOP/byte — memory-bound; fuse with GEMM output to avoid separate read",
      "Tiling effect: without tiling, GEMM AI ≈ 1 FLOP/byte (every element read fresh for every dot product); with TILE=128 SMEM blocking, AI ≈ TILE/2 = 64 FLOP/byte",
      "L2 cache effect: if the working set fits in L2 (40 MB on A100), effective AI is higher than the naive calculation because L2 hits don't count toward HBM bytes",
      "Measurement: Nsight Compute 'SOL' (Speed of Light) section shows actual FLOPs/byte and percent of peak bandwidth — compare to ridge point to determine which ceiling to target",
    ],
    formula: "AI = total_FLOPs / total_bytes_from_HBM  ;  memory-bound if AI < ridge_point (156 on A100 BF16)",
  },
  tiling: {
    what: "Tiling (blocking) is the most impactful GPU optimization: divide large matrix operands into smaller tiles that fit in shared memory, load each tile once from global memory, reuse it for many multiplications within the tile, then advance to the next tile. For a TILE×TILE block in GEMM, each element of A and B is loaded from global memory exactly once per tile pass but used TILE times — reducing HBM traffic by a factor of TILE.",
    visual:
      "Computing C = A × B where A, B are 4096×4096. Without tiling: computing C[i][j] reads the full row i of A (4096 floats) and full column j of B (4096 floats) from HBM — each element of A is read N times. With TILE=128: load a 128×128 block of A and B into SMEM once; compute 128×128 = 16384 partial products using those 256 cached values; advance. Each float is read from HBM once, used 128 times — 128× less HBM traffic.",
    intuition: [
      "Traffic reduction: naive GEMM reads each A[i][k] N times (once per output column); tiling amortizes that to K/TILE reads by sharing each loaded tile across TILE output columns",
      "AI formula: with tiling, GEMM AI ≈ TILE/2 FLOP/byte; at TILE=128, AI ≈ 64; at TILE=256, AI ≈ 128",
      "SMEM budget: tile_A (BLOCK_M × BLOCK_K × 4B) + tile_B (BLOCK_K × BLOCK_N × 4B) must fit within the SM's shared memory capacity (192 KB on A100)",
      "Synchronization: __syncthreads() after loading each tile (ensure all threads see the full tile before computing) and again before overwriting SMEM with the next tile",
      "Register accumulator: keep the C output tile as a register array (float acc[BLOCK_M][BLOCK_N] / num_threads) — never write partial sums to SMEM or global memory",
      "Triton: declare BLOCK_M, BLOCK_N, BLOCK_K as tl.constexpr; the compiler automatically manages SMEM allocation and __syncthreads() insertion",
    ],
    formula: "AI_with_tiling ≈ TILE_SIZE / 2 FLOP/byte  (vs ≈ 1 FLOP/byte without tiling for square GEMM)",
  },
  pipelining: {
    what: "Software pipelining (double buffering) overlaps the loading of tile k+1 from global memory with the computation on tile k. On Ampere and later GPUs, the cp.async instruction enables hardware-assisted asynchronous copies from global to shared memory, allowing the DMA engine to fetch data concurrently while the SM's ALUs compute — hiding memory load latency behind useful work.",
    visual:
      "A factory assembly line: while workers (CUDA cores) are welding car body k, robots (cp.async DMA engine) are simultaneously fetching and painting car body k+1 in the next bay. When the welding of k finishes, body k+1 is already ready — zero wait time. Without pipelining: weld k, then wait for k+1 to arrive before starting. Double buffering eliminates this stall.",
    intuition: [
      "Single-buffer loop (no pipeline): issue global load → __syncthreads() → compute → repeat — the SM is idle during the global load, wasting ~200–400 cycles per tile",
      "Double-buffer loop: issue cp.async for tile k+1 → commit_group → compute on tile k → wait_group(1) → swap buffers — compute and data fetch overlap",
      "cp.async instruction: copies 4–16 bytes from global directly to shared memory without going through registers; the executing warp continues immediately without blocking",
      "Pipeline depth: num_stages=2 is double buffering (2 SMEM buffers); num_stages=3 is triple buffering; deeper pipelines hide more latency but consume more SMEM",
      "SMEM cost: double buffering requires 2× the SMEM of single-buffer tiling — may reduce occupancy; triple buffering requires 3×",
      "Triton: num_stages in @triton.autotune configs directly controls pipeline depth; Triton inserts all cp.async, commit_group, and wait_group calls automatically",
    ],
    formula: "cp.async(dst_smem, src_global, 16);  cp.async.commit_group();  cp.async.wait_group(1);  // double buffer",
  },
  naive_gemm: {
    what: "Naive GEMM assigns one output element C[i][j] per thread: each thread loads an entire row of A (K floats) and an entire column of B (K floats) from global memory, computes their dot product, and writes one result. For M=N=K=4096, every thread reads 2×4096×4 = 32 KB from HBM for one scalar output. The same HBM data is read by millions of threads with zero sharing — total HBM traffic is M×N×2K×4 bytes.",
    visual:
      "Thread (i,j) walks aisle A-row-i and B-col-j in the warehouse, picking one item from each step, multiplying them, and accumulating. 4096² threads do this simultaneously, each walking their own aisles. The warehouse is deluged with millions of overlapping requests. Worse, B is stored in row-major order, so column access is stride-N — each step in B requires a new cache line fetch.",
    intuition: [
      "Traffic calculation: for M=N=K=4096, total HBM reads = M×N×2K×4B = 4096² × 2 × 4096 × 4 ≈ 549 GB — at 2 TB/s this takes ≥ 275 ms of pure bandwidth time",
      "Column access penalty: B is stored row-major; reading column j reads elements B[0][j], B[1][j], ... which are K×4 bytes apart — completely uncoalesced, 32× memory traffic per warp",
      "Arithmetic intensity: each thread performs 2K FLOPs and reads 2K×4 bytes → AI = 2K / (2K×4) = 0.5 / 4 = 0.125 FLOP/byte — far below the ridge point",
      "Actual performance: naive GEMM on A100 achieves ~1–5% of cuBLAS throughput — the 20–100× gap is entirely due to memory traffic and access patterns",
      "Zero sharing: element A[i][k] is read independently by threads (i,0), (i,1), ..., (i,N-1) — N separate global reads of the same value, none benefiting from any other",
      "Educational value: implement naive GEMM once to internalize why each optimization (tiling, pipelining, tensor cores) matters; never use it in production",
    ],
    formula: "C[i][j] = Σ_{k=0}^{K-1} A[i][k] × B[k][j]  // each A[i][k] and B[k][j] fetched from global memory",
  },
  tiled_gemm: {
    what: "Tiled GEMM divides A, B, and C into TILE×TILE sub-matrices. Each thread block computes one tile of C by iterating over tiles along the K dimension: loading TILE×TILE elements of A and B into shared memory, computing partial dot products using all threads, advancing by TILE in K, and accumulating into a register-resident result tile. Global memory traffic is reduced by a factor of TILE versus naive GEMM.",
    visual:
      "Instead of every thread making its own individual trips to the warehouse, an entire block (team of workers) coordinates to carry one TILE×TILE pallet of A and one TILE×TILE pallet of B to the shared workbench (SMEM). All workers then multiply using only the workbench copies — no individual warehouse trips. When the tile is exhausted, the team fetches the next pallet. Total warehouse trips: K/TILE per output tile instead of K.",
    intuition: [
      "Traffic reduction: each element of A is loaded from HBM once per tile of C in the same row; TILE threads share that single load → TILE× reduction in reads",
      "Load pattern: each thread loads one element of tile_A[threadIdx.y][threadIdx.x] and one of tile_B[threadIdx.y][threadIdx.x] — all loads are coalesced",
      "Sync protocol: __syncthreads() after loading tile (all threads see full tile); compute inner TILE loop; __syncthreads() before overwriting SMEM with next tile",
      "Register accumulator: float acc = 0.0; for (k) acc += tile_A[row][k] × tile_B[k][col]; — acc stays in registers, never written to SMEM or global during accumulation",
      "SMEM sizing: SMEM usage = (BLOCK_M × BLOCK_K + BLOCK_K × BLOCK_N) × 4 bytes; for TILE=32: 2 × 32² × 4 = 8 KB well within limits",
      "Performance gap: correct tiled GEMM achieves ~20–40% of cuBLAS; with double buffering and tensor cores, 80–90% is achievable — CUTLASS and Triton automate the remaining optimizations",
    ],
    formula: "for t in 0..K/TILE: load smem_A, smem_B; sync; acc += smem_A × smem_B; sync; advance tile",
  },
  tensor_core_gemm: {
    what: "Tensor Core GEMM uses the WMMA (Warp Matrix Multiply Accumulate) API to perform 16×16×16 matrix multiplications in hardware, with an entire warp of 32 threads collaborating as a single matrix-multiply unit. Each thread holds a fragment (a portion) of the A, B, and C matrices; wmma::mma_sync fires the Tensor Core and all 32 threads collectively produce the output fragment. This delivers ~8–16× FLOP/s over scalar CUDA core GEMM.",
    visual:
      "32 threads in a warp act as one large matrix calculator. Each thread holds a few numbers from matrices A, B, and C — like each person holding one card from a deck. When wmma::mma_sync fires, all 32 threads simultaneously contribute their fragments to compute the full 16×16 matrix product in one coordinated operation. The result is distributed back across the 32 threads' accumulators.",
    intuition: [
      "Fragment types: wmma::fragment<matrix_a, 16,16,16, half, row_major>, <matrix_b, ...>, <accumulator, ...> — each thread holds a disjoint subset of the tile",
      "Load from SMEM: wmma::load_matrix_sync(frag, smem_ptr, stride) loads the fragment from shared memory — fragments cannot be loaded directly from global memory",
      "Execute: wmma::mma_sync(C_frag, A_frag, B_frag, C_frag) fires the Tensor Core MMA; C_frag accumulates the result",
      "Layout requirement: A and B must be in specific row/col-major layouts matching the fragment declaration — mismatches produce silently wrong results",
      "Precision rule: A, B in FP16/BF16; accumulator in FP32 — never accumulate in FP16, as the limited mantissa precision causes significant numerical error",
      "Practical advice: use CUTLASS (composable, highly optimized) or Triton tl.dot() rather than raw WMMA — raw WMMA requires significant boilerplate for a practical GEMM",
    ],
    formula: "wmma::mma_sync(C_frag, A_frag, B_frag, C_frag);  // entire warp cooperates; D = A × B + C",
  },
  flash_attention: {
    what: "Flash Attention (Dao et al., 2022) is an I/O-aware tiled attention algorithm that avoids materializing the full N×N attention matrix in HBM. Standard attention writes O(N²) attention scores to HBM and reads them back; Flash Attention tiles Q, K, V and computes attention in SRAM chunks using an online softmax algorithm, reducing HBM reads/writes for the attention matrix from O(N²) to O(N) while producing the identical output.",
    visual:
      "Standard attention: print a 10,000-row × 10,000-column spreadsheet to disk (N² HBM writes), then read it back to compute the weighted sum (N² HBM reads). Flash Attention: process 128-row chunks on a clipboard (SRAM), computing the correct softmax incrementally using a running max/sum correction factor, never printing the full spreadsheet. The final answer is identical, but the disk I/O is reduced from O(N²) to O(N).",
    intuition: [
      "Bottleneck removed: standard attention's N×N score matrix is 2N²d bytes of HBM traffic; for N=8192, d=128: 2×8192²×4B ≈ 537 MB per attention head — Flash Attention eliminates this",
      "Online softmax: maintain running maximum m_i and normalization factor l_i across K tiles; when the next tile's max m_new > m_i, correct prior output with scale factor exp(m_i - m_new)",
      "Tiling: load BLOCK_Q rows of Q and BLOCK_K rows of K/V into SRAM; compute partial scores QK^T; apply online softmax correction; accumulate into output O; advance K/V tile",
      "Memory complexity: standard attention requires O(N²) GPU memory for the score matrix (impossible at N=100K); Flash Attention requires only O(N) — enables long-context training",
      "Backward pass: recompute attention scores from Q,K in the backward pass rather than storing the N×N matrix from the forward pass — saves N² memory at the cost of extra compute",
      "Versions: FA-1 (2022, NeurIPS) established the algorithm; FA-2 (2023) improved warp partitioning for 2× speedup; FA-3 (2024, H100) uses WGMMA + TMA instructions to reach ~75% of H100 peak throughput",
    ],
    formula: "O = softmax(QK^T / √d) V  // computed in O(N) HBM I/O via tiled SRAM computation with online softmax",
  },
};
