export const EXPLANATIONS = {
  sm: {
    what: "A Streaming Multiprocessor (SM) is the fundamental compute unit of an NVIDIA GPU. Each SM contains CUDA cores (ALUs), warp schedulers and dispatch units, a large register file, shared memory (L1), and texture/load-store units. An A100 has 108 SMs; an H100 has 132. All GPU parallelism flows through SMs.",
    visual:
      "Picture a factory floor: the SM is one factory with 4 assembly lines (warp schedulers). Each line can issue one instruction per cycle to 32 workers (threads). All lines share a central parts shelf (shared memory). Many factories run in parallel across the chip.",
    intuition: [
      "All parallelism on a GPU comes from SMs running blocks simultaneously",
      "A100: 108 SMs × 4 warp schedulers × 2 dispatches = 864 simultaneous warps possible",
      "Each SM has its own register file (~65536 32-bit regs), shared memory (up to 228 KB on H100), and L1 cache",
      "SM occupancy determines how well you can hide memory latency",
      "SM count × blocks-per-SM = upper bound on concurrently executing blocks",
      "Kernel launch must have enough blocks to fill all SMs, else some sit idle",
    ],
    formula: "Active warps per SM <= min(maxWarpsPerSM, floor(regsPerSM / (regsPerThread × warpSize)), floor(smemPerSM / smemPerBlock))",
  },
  warp: {
    what: "A warp is a group of exactly 32 threads that execute in lockstep under SIMT (Single Instruction, Multiple Threads). The warp scheduler issues one instruction per clock to all 32 threads simultaneously, but each thread operates on its own private data. The warp is the fundamental unit of GPU scheduling.",
    visual:
      "Imagine 32 soldiers marching in perfect sync: every soldier takes the same step at the same time, but each carries a different pack (data). When any soldier needs to wait (memory stall), the whole squad pauses and another squad takes the field.",
    intuition: [
      "Warp size is always 32 on NVIDIA GPUs — a hardware constant",
      "All 32 threads in a warp share one program counter (PC)",
      "Thread IDs within a warp are 0-31; use threadIdx.x % 32 to find lane ID",
      "One warp instruction takes 4 cycles on A100 (8 FP32 ops per thread × 4 = 256 FP32 ops/cycle/SM)",
      "Warp schedulers can switch between active warps every cycle to hide latency",
      "Warp is the granularity for branch divergence — threads in same warp must serialize divergent paths",
    ],
    formula: "warpID = threadIdx.x / 32  ;  laneID = threadIdx.x % 32",
  },
  thread_hierarchy: {
    what: "CUDA organizes threads in a three-level hierarchy: Threads are grouped into Blocks (up to 1024 threads); Blocks form a Grid (millions of blocks possible). Within a block, threads can share memory and synchronize. Across blocks, no direct communication is possible during kernel execution.",
    visual:
      "A spreadsheet analogy: each cell is a thread, a row of cells is a warp, a sheet is a block, and the entire workbook is the grid. Cells within the same sheet share a whiteboard (shared memory). Different sheets can only talk through the hard drive (global memory).",
    intuition: [
      "Thread: smallest unit; has private registers and local memory",
      "Block: threads share L1/shared memory and can __syncthreads(); always runs on one SM",
      "Grid: entire launch; blocks can run on different SMs in any order",
      "Max threads per block: 1024 (always). Max block dimensions: 1024×1024×64",
      "Block size rule of thumb: multiples of 32 (warp size); 128 or 256 is typical",
      "Grid size: enough blocks to fully utilize all SMs — aim for thousands of blocks",
    ],
    formula: "globalIdx = blockIdx.x * blockDim.x + threadIdx.x",
  },
  tensor_cores: {
    what: "Tensor Cores are specialized hardware units that perform matrix multiply-accumulate (MMA) operations in one instruction: D = A × B + C. They operate on small matrix fragments (e.g., 16×16 FP16 × 16×16 FP16 + 16×16 FP32 = 16×16 FP32) and deliver ~8× the throughput of regular CUDA cores. Every modern deep learning kernel uses them.",
    visual:
      "Think of tensor cores as a dedicated GEMM chip soldered onto each SM. While CUDA cores multiply one pair of numbers at a time, a tensor core multiplies a 16×16 matrix against another in a single operation. A100 Tensor Cores: 312 TFLOPS in BF16 vs ~19.5 TFLOPS in FP32 on regular CUDA cores.",
    intuition: [
      "A100: 512 tensor cores total; each does a 4×4×4 MMA per clock at the physical level",
      "Exposed via wmma (warp-level), mma (instruction-level) APIs, or implicitly through cuBLAS/Triton",
      "Require aligned, 16-byte aligned data in specific fragment layouts",
      "Only activated when shapes are multiples of 16 (FP16/BF16) or 8 (INT8)",
      "Triton's tl.dot() automatically uses tensor cores when BLOCK_SIZE is aligned",
      "Tensor core throughput is the ceiling you're targeting in compute-bound kernels",
    ],
    formula: "D[M×N] = A[M×K] × B[K×N] + C[M×N]  (one MMA instruction, hardware-accelerated)",
  },
  memory_hierarchy: {
    what: "GPU memory is organized in a latency/bandwidth hierarchy: Registers (fastest, ~0 cycles, thread-private), Shared Memory (~20 cycles, block-shared, on-chip SRAM), L2 Cache (~100 cycles, chip-wide), Global Memory / HBM (~300-700 cycles, all SMs, terabytes/sec bandwidth). Efficient kernels maximize reuse in fast memory.",
    visual:
      "Picture an inverted pyramid: registers at the top (tiny but instant), shared memory below (small but fast), L2 in the middle (medium, chip-wide), global memory at the bottom (huge, slow-ish but massive bandwidth). Every byte you can avoid reading from global memory is a win.",
    intuition: [
      "Registers: 256 KB per SM, 0-latency, private per thread — keep hot data here",
      "Shared memory: 48-228 KB per SM (H100), ~1.5 TB/s bandwidth — the programmer-controlled cache",
      "L2 cache: 40 MB on A100, ~5 TB/s — automatically managed, no programmer control",
      "Global memory (HBM): 40-80 GB on A100/H100, 2-3.35 TB/s — the bottleneck for memory-bound kernels",
      "The ratio global_reads_without_tiling / global_reads_with_tiling = tile_size — tiling is always worth it",
      "Never let a byte enter a CUDA core without passing through the fastest possible memory level first",
    ],
    formula: "effective_bandwidth = bytes_transferred / kernel_time  ;  target: > 70% of peak HBM BW",
  },
  simt: {
    what: "SIMT (Single Instruction, Multiple Threads) is the NVIDIA execution model: all threads in a warp execute the same instruction every cycle, but each thread has its own register state and can produce different results by operating on different data. This gives vector-level parallelism with the flexibility of per-thread control flow.",
    visual:
      "32 lanes of a highway, all cars driving in convoy — same speed, same turns, but different cargo. One traffic light (instruction) governs all lanes. When a car runs a red light (branch), all cars must slow down for the exception.",
    intuition: [
      "SIMT = vector execution (like AVX-512 in CPUs) but with independent PC per thread",
      "Within a warp, instruction fetch/decode is shared — saving die area vs MIMD",
      "Thread independence: each thread can load from different addresses, branch differently (but at a cost)",
      "SIMT vs SIMD: SIMT threads can take different paths (masked execution); SIMD lanes typically cannot",
      "Predicated execution: masked-out threads (in divergent warp) consume issue slots but do nothing",
      "On Volta+, Independent Thread Scheduling allows finer-grained divergence than Pascal",
    ],
    formula: "A[i] = B[i] * C[i]  -- thread i reads B[i], C[i], writes A[i]; all 32 lanes in flight simultaneously",
  },
  warp_divergence: {
    what: "Warp divergence occurs when threads within the same warp take different paths through a conditional (if/else, switch, loop with data-dependent bounds). The GPU must execute all paths serially, masking out inactive threads in each pass. Maximum slowdown is proportional to the number of distinct paths.",
    visual:
      "32 runners approach a fork in the road. Half go left, half go right. Since they must stay together, the left group runs first while the right group waits, then vice versa. Total time: sum of both paths instead of max of both paths.",
    intuition: [
      "Simple if/else with 50% split: up to 2× slowdown vs uniform execution",
      "Divergence is only a problem WITHIN a warp — across warps it's perfectly fine",
      "Eliminate divergence: process data so that threads 0-31 always take the same branch",
      "Sorting or partitioning data before the kernel can eliminate inter-warp divergence",
      "Ternary operators and predication are often better than if/else for short branches",
      "Post-Volta: warp reconvergence at join point; can result in better behavior than pre-Volta",
    ],
    formula: "slowdown = (# distinct paths taken by lanes in warp)  ; worst case = warp_size paths",
  },
  occupancy: {
    what: "Occupancy is the ratio of active warps on an SM to the maximum possible. Higher occupancy helps the SM hide memory latency by switching between more warps when one stalls. Occupancy is limited by three resources: registers per thread, shared memory per block, and threads per block.",
    visual:
      "An SM is a juggler with N balls (warp slots). The more balls in the air, the more likely one is catchable while others are in flight. Too few balls (low occupancy): idle time between catches. Too many balls (register spill): dropped balls = slower.",
    intuition: [
      "A100: max 64 warps per SM (2048 threads); H100: same",
      "Register limiter: if a kernel uses 64 regs/thread, max 65536/(64×32) = 32 warps active",
      "Shared memory limiter: a 48 KB block on a 96 KB SM allows only 2 blocks simultaneously",
      "Threads-per-block limiter: 128-thread blocks → max 2048/128 = 16 blocks → 16×4 = 64 warps (A100 OK)",
      "100% occupancy is NOT always optimal — register blocking for ILP often wins at 50% occupancy",
      "Use CUDA Occupancy Calculator or nvcc --ptxas-options=-v to see register count",
    ],
    formula: "occupancy = active_warps / max_warps_per_SM  ;  max_warps limited by regs, smem, block_size",
  },
  latency_hiding: {
    what: "Latency hiding is the mechanism by which the SM tolerates high memory latency. When a warp issues a global memory load (~700 cycles), its warp scheduler switches to executing another ready warp. By the time the memory returns, hundreds of other instructions have executed in other warps, keeping the SM busy.",
    visual:
      "Imagine a chef (SM) juggling 8 pots (warps). When one pot needs to wait 10 minutes for water to boil (memory stall), the chef immediately tends to the next pot. The total cook time is barely longer than the single longest operation, because waiting is never idle.",
    intuition: [
      "Global memory latency on A100: ~300-700 clock cycles",
      "Each SM can have 64 warps active; with 4 schedulers, 4 warps issued per cycle",
      "Warps needed to hide latency = latency / issue_interval ≈ 700 / 4 ≈ 175 instruction slots",
      "At 32 threads/warp × 64 warps/SM = 2048 threads can hide most latencies",
      "Memory-bound kernels still benefit from high occupancy to hide transfer time",
      "Compute-bound kernels care less about occupancy — ILP (instruction-level parallelism) matters more",
    ],
    formula: "warps_to_hide_latency ≈ memory_latency_cycles / issue_throughput_cycles",
  },
  global_memory: {
    what: "Global memory is the main GPU DRAM (typically HBM — High Bandwidth Memory). It is accessible by all threads on all SMs, persists across kernel launches, and is the largest (40-80 GB on A100/H100) but slowest (~300-700 cycle latency) memory. Getting global memory access patterns right is the #1 optimization.",
    visual:
      "A warehouse on the other side of the city. Huge capacity, but every access requires driving across town (~700 cycles). Send a truck that carries 128 bytes at a time (cache line). If all 32 workers in a warp need adjacent shelves, one trip serves everyone. If scattered around the warehouse, 32 separate trips.",
    intuition: [
      "A100: 80 GB, 2 TB/s peak bandwidth (HBM2e); H100: 80 GB, 3.35 TB/s (HBM3)",
      "Cache line = 128 bytes; a coalesced warp access = 1 cache line transaction",
      "Uncoalesced access: up to 32 separate 32-byte transactions per warp = 32× more traffic",
      "Always aim for 70%+ of peak memory bandwidth in memory-bound kernels",
      "Use vectorized loads (float4) to double/quadruple the bytes per instruction",
      "cudaMalloc data is in global memory; cudaMemcpy moves between host and device",
    ],
    formula: "ideal: 1 transaction / 32-thread warp (128 bytes);  worst: 32 transactions / warp",
  },
  shared_memory: {
    what: "Shared memory (SMEM) is a fast, on-chip SRAM that is explicitly managed by the programmer and shared among all threads in a block. It has ~1.5 TB/s bandwidth and ~20-cycle latency — far faster than global memory. It is the primary optimization tool for high-throughput CUDA/Triton kernels.",
    visual:
      "A whiteboard inside the factory: all 1024 workers in the room (block) can read/write it instantly. To use it, you first copy data from the warehouse (global memory) to the whiteboard, process it multiple times, then write results back to the warehouse. One trip to the warehouse serves many computations.",
    intuition: [
      "A100: 192 KB per SM (split between shared and L1 cache, configurable up to 164 KB smem)",
      "H100: 228 KB per SM — key advantage for attention kernels",
      "Declared with __shared__ keyword in CUDA; managed automatically in Triton",
      "Critical pattern: load tile from global → process in SMEM → store result to global",
      "Each block has its own SMEM region; threads in different blocks cannot see each other's SMEM",
      "SMEM saves are 32-bank interleaved; conflicts arise when multiple threads hit the same bank",
    ],
    formula: "__shared__ float tile[TILE_M][TILE_K];  // explicitly allocated, freed at block exit",
  },
  registers: {
    what: "Registers are the fastest storage on a GPU — zero additional latency, private per thread, and directly used by ALUs. Each SM has a large register file (65536 × 32-bit registers on most NVIDIA GPUs). The number of registers a kernel uses per thread directly limits how many threads/warps can run simultaneously.",
    visual:
      "Each thread is a calculator with N buttons (registers). The SM has a fixed total button budget. If each calculator needs 64 buttons, only 65536/64 = 1024 calculators can work at once. Use fewer buttons per calculator (register pressure reduction) to run more calculators in parallel.",
    intuition: [
      "65536 32-bit registers per SM (both A100 and H100)",
      "Max 255 registers per thread (architectural limit)",
      "Register usage determines warp occupancy: 32 regs/thread → 64 active warps; 64 regs/thread → 32 warps",
      "Check register use: compile with nvcc --ptxas-options=-v",
      "Register spilling: if a kernel needs more registers than available, data spills to local memory (slow!)",
      "Use __launch_bounds__ to tell the compiler the max threads per block → less register spill",
    ],
    formula: "max_active_warps = min(64, floor(65536 / (regs_per_thread × 32)))",
  },
  coalescing: {
    what: "Memory coalescing is the GPU's ability to merge multiple thread memory accesses into a single memory transaction. When the 32 threads of a warp access consecutive, aligned addresses (e.g., thread i reads float at address base + i), all 32 accesses are served by one 128-byte cache-line transaction. Strided or random access destroys coalescing.",
    visual:
      "32 people ordered by number (0-31) each want one file from a filing cabinet. If file i is in drawer i (contiguous), one clerk opens 4 drawers and serves everyone at once. If file i is in drawer i×8 (strided), the clerk must make 32 separate trips. Same total data, 32× the overhead.",
    intuition: [
      "Ideal pattern: thread i reads address base + i (stride-1, AoS → SoA transformation)",
      "A single warp transaction = 32 threads × 4 bytes = 128 bytes = 1 cache line (perfect)",
      "Strided-2 access: 2 transactions; strided-4: 4 transactions; random: up to 32 transactions",
      "Always store data in Structure of Arrays (SoA) layout for GPU kernels, not Array of Structures (AoS)",
      "Row-major vs column-major: accessing a row is coalesced; accessing a column is strided (bad)",
      "Vectorized loads (float4): pack 4 floats into one 128-bit load → 4× throughput",
    ],
    formula: "coalesced: all 32 threads hit [base+0, base+4, ..., base+124] → 1 transaction (128 bytes)",
  },
  bank_conflicts: {
    what: "Shared memory is divided into 32 banks of 4 bytes each (bank i contains bytes 4i to 4i+3 of each row). If multiple threads in a warp access the same bank in the same cycle, the accesses are serialized (bank conflict). An N-way bank conflict means N serialized accesses instead of 1. This can kill shared memory performance.",
    visual:
      "32 cash registers (banks) at a checkout. 32 customers (threads) arrive simultaneously. If each goes to a different register — instant service. If 4 customers all try to use register 5 — 3 must wait. The registers they didn't use sit idle. That's wasted throughput.",
    intuition: [
      "Bank assignment: bank = (byte_address / 4) % 32",
      "Conflict-free: all 32 threads access different banks simultaneously (1 cycle)",
      "N-way conflict: N threads hit the same bank → N cycles (N× slowdown)",
      "Broadcast exception: if all threads read the SAME address → no conflict (broadcast)",
      "Padding fix: add 1 element of padding per row (e.g., float tile[32][33]) to shift bank indices",
      "Stride-of-32 access pattern always has 32-way conflicts — the most common mistake",
    ],
    formula: "bank_id = (element_index × sizeof(element)) / 4 % 32  ; conflict iff two threads share bank_id",
  },
  kernel_launch: {
    what: "Launching a CUDA kernel configures the thread hierarchy and dispatches work to the GPU. The syntax is: kernel<<<gridDim, blockDim, smemBytes, stream>>>(args). gridDim and blockDim can be 1D, 2D, or 3D dim3 structs. The runtime schedules blocks onto available SMs; no ordering guarantees exist between blocks.",
    visual:
      "A factory dispatch: you specify gridDim × blockDim = total threads, hand the work order (kernel) to the dispatch desk, and the GPU scheduler assigns batches (blocks) to available factory floors (SMs). The desk can issue thousands of orders per second; blocks run as SM slots free up.",
    intuition: [
      "gridDim = number of blocks; blockDim = threads per block (max 1024)",
      "Total threads = gridDim.x × gridDim.y × gridDim.z × blockDim.x × blockDim.y × blockDim.z",
      "Choosing blockDim: multiples of 32 (warp size); 128 or 256 is typical sweet spot",
      "Choosing gridDim: ceil(problem_size / blockDim) to cover all elements",
      "smemBytes: dynamic shared memory in bytes (add to static __shared__ allocations)",
      "stream = 0 means default stream (synchronizes with other GPU ops); use named streams for overlap",
    ],
    formula: "kernel<<<dim3(Gx,Gy,Gz), dim3(Bx,By,Bz), smem_bytes, stream>>>(args);",
  },
  thread_indexing: {
    what: "Thread indexing maps the multi-level thread hierarchy to data elements. Each thread has threadIdx (within block), blockIdx (within grid), blockDim (block size), and gridDim (grid size). Computing the correct global index is the first operation in almost every CUDA kernel and errors here are the most common source of bugs.",
    visual:
      "A stadium with numbered sections (blocks) and numbered seats within each section (threads). To find your seat number globally, multiply your section number by seats-per-section and add your local seat number. The formula is the same whether the stadium is 1D or arranged in a 2D grid.",
    intuition: [
      "1D: global_i = blockIdx.x * blockDim.x + threadIdx.x",
      "2D: global_row = blockIdx.y * blockDim.y + threadIdx.y; global_col = blockIdx.x * blockDim.x + threadIdx.x",
      "Always bounds-check: if (global_i >= N) return; — prevents out-of-bounds access",
      "threadIdx is always 0..blockDim-1; blockIdx is always 0..gridDim-1",
      "Stride loops for when grid is smaller than data: for (int i = tid; i < N; i += stride)",
      "Flat index to 2D: row = flat / cols; col = flat % cols (integer ops are free on GPU)",
    ],
    formula: "tid_1d = blockIdx.x * blockDim.x + threadIdx.x;  grid_stride = gridDim.x * blockDim.x",
  },
  synchronization: {
    what: "__syncthreads() is a block-level barrier: execution stalls until ALL threads in the block reach it. This ensures that shared memory writes from some threads are visible to all threads before processing continues. It is essential after loading shared memory and before reading back results computed by other threads.",
    visual:
      "A relay race where runners must all arrive at the halfway checkpoint before any can continue. Fast runners wait at the tape for slow ones. Once every runner crosses, they all proceed together. Without the checkpoint, fast runners might grab a baton that hasn't been placed yet.",
    intuition: [
      "__syncthreads() must be reached by ALL threads — wrap in conditional only if all threads follow the same path",
      "Typical pattern: load to SMEM → __syncthreads() → compute from SMEM → __syncthreads() → store",
      "__syncwarp() synchronizes only within a warp (faster; 32-thread scope)",
      "cuda::barrier (C++17): more flexible barriers with phases, useful for cp.async pipelines",
      "cudaDeviceSynchronize(): host-side wait for all GPU work to complete",
      "There is NO cross-block synchronization during kernel execution — use separate kernel launches",
    ],
    formula: "__syncthreads();  // all threads in block must reach this before any proceed",
  },
  cuda_streams: {
    what: "CUDA streams are ordered sequences of GPU operations. Operations in the same stream execute sequentially; operations in different streams may overlap. The primary use is overlapping kernel execution with host-device memory transfers (requires pinned host memory), enabling near-100% GPU utilization when compute is compute-bound.",
    visual:
      "A highway with multiple lanes. Default stream = single-lane road: transfer, then kernel, then transfer. Multiple streams = multi-lane: H2D transfer in lane 1, kernel execution in lane 2, D2H transfer in lane 3 — all overlapping when the hardware allows.",
    intuition: [
      "cudaStreamCreate(&stream) to create a named stream; pass as 4th arg to kernel and cudaMemcpyAsync",
      "Pinned (page-locked) host memory required for async transfers: cudaMallocHost(&ptr, size)",
      "Overlap pattern: while kernel[i] runs on stream 0, copy data[i+1] H2D on stream 1",
      "cudaStreamSynchronize(stream) waits for one stream; cudaDeviceSynchronize waits for all",
      "Concurrent kernel execution: multiple small kernels can run simultaneously if SM resources allow",
      "CUDA graphs capture stream operations for replay with minimal CPU overhead — critical for small kernel dispatch",
    ],
    formula: "cudaMemcpyAsync(dst, src, N, cudaMemcpyH2D, stream);  kernel<<<G,B,0,stream>>>(args);",
  },
  atomic_ops: {
    what: "Atomic operations perform thread-safe read-modify-write on global or shared memory addresses without requiring explicit locks. Common atomics: atomicAdd, atomicMax, atomicMin, atomicCAS. They are essential for reductions and histograms where multiple threads update the same output location.",
    visual:
      "A shared counter box with a slot (the memory address). Each thread wants to add its value. Atomics are like a single-key lockbox — only one thread can open it at a time. All others queue up. Fast for rare collisions; becomes a serial bottleneck if thousands of threads all hit the same address.",
    intuition: [
      "atomicAdd(&addr, val): guaranteed correct even if 1000 threads call simultaneously",
      "Atomics serialize at the memory controller — avoid high contention (many threads, same address)",
      "Better pattern for reductions: warp-level reduce first (__shfl_down_sync), then one atomic per warp",
      "atomicCAS (compare-and-swap): foundation for lock-free algorithms",
      "Shared memory atomics are faster than global memory atomics (lower latency)",
      "CUDA 8+: native atomicAdd for float64; CUDA 10+: for float16 (with Volta+ architecture)",
    ],
    formula: "int old = atomicAdd(&counter, 1);  // old = previous value; counter++ is atomic",
  },
  triton_model: {
    what: "Triton is a Python-based GPU programming language where you write kernels at the block level rather than the thread level. Instead of managing individual threads, you operate on tiles of data using blocked pointers and masked loads. Triton's compiler handles thread assignment, vectorization, and (partially) shared memory management automatically.",
    visual:
      "CUDA: you manage 1024 workers individually in a warehouse. Triton: you manage 32 pallets (tiles) and the forklift operator (Triton compiler) figures out how many workers to assign to each pallet and how to organize the warehouse. Less control, but much faster to write and often just as fast.",
    intuition: [
      "@triton.jit decorator marks a function as a GPU kernel",
      "tl.program_id(axis) identifies which tile this program instance handles (like blockIdx in CUDA)",
      "One Triton program instance processes one tile — the compiler maps it to threads automatically",
      "Triton auto-inserts shared memory and handles vectorization; you only see tile operations",
      "Triton is at the sweet spot: CUDA-like performance with NumPy-like expressiveness",
      "Production use: PyTorch FlashAttention-2, vLLM paged attention, Liger-kernel, xFormers all use Triton",
    ],
    formula: "@triton.jit  def kernel(ptr, BLOCK_SIZE: tl.constexpr):  pid = tl.program_id(axis=0)",
  },
  triton_tiles: {
    what: "In Triton, a kernel program works with a tile — a contiguous block of data elements. tl.arange(0, BLOCK_SIZE) generates per-element offsets within the tile. tl.load(ptr + offsets, mask=mask) loads a tile from memory. The mask handles boundary conditions where the tile extends beyond the array end.",
    visual:
      "Imagine slicing a baguette into equal pieces. Each program instance grabs one slice (tile). The slice is described by its starting position (pid × BLOCK_SIZE) plus a range of offsets. A mask ensures you don't try to grab beyond the end of the baguette for the last (possibly partial) slice.",
    intuition: [
      "offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE) — the core indexing pattern",
      "mask = offsets < n_elements — prevents out-of-bounds; loaded from device as a constant",
      "tl.load(ptr + offsets, mask=mask, other=0.0) — masked elements load as 0.0 (or specified default)",
      "tl.store(out_ptr + offsets, result, mask=mask) — write back with same mask",
      "BLOCK_SIZE must be a power of 2 and a tl.constexpr — known at compile time for vectorization",
      "2D tiles: offsets_m = row_idx[:, None], offsets_n = col_idx[None, :]; element = offsets_m * stride + offsets_n",
    ],
    formula: "offsets = pid * BLOCK_SIZE + tl.arange(0, BLOCK_SIZE);  x = tl.load(ptr + offsets, mask < N)",
  },
  triton_ops: {
    what: "Triton provides a set of tile-level operations that map to efficient GPU instructions. Key ops: tl.dot(a, b) for matrix multiply (uses tensor cores), tl.sum(x, axis) for reduction, tl.max(x, axis), tl.atomic_add for inter-program updates, tl.exp/log for element-wise math, and tl.where for conditional selection.",
    visual:
      "A toolbox for manipulating rectangular data tiles: dot() fuses two tiles into a matrix product, sum() crushes a tile into a smaller accumulation, exp() maps a function over every element. Each tool is implemented optimally by the Triton compiler using the best GPU instruction for the target architecture.",
    intuition: [
      "tl.dot(a, b): most important op — maps to tensor core MMA; requires BLOCK sizes ≥ 16 for tensor cores",
      "tl.sum(x, axis=0): column-wise reduction; axis=1: row-wise. Use for softmax denominator, LayerNorm, etc.",
      "tl.atomic_add(ptr + offset, val): safe update without synchronization; used for sparse ops",
      "tl.where(cond, a, b): masking — equivalent to np.where but on tiles",
      "tl.load(ptr, cache_modifier='.cs'): cache streaming hint (don't pollute L1); useful for one-pass reads",
      "tl.constexpr vs runtime: tl.constexpr values (like BLOCK_SIZE) must be compile-time constants — enables unrolling",
    ],
    formula: "acc = tl.dot(a_tile, b_tile)  # shape [M, N], uses tensor cores if sizes are multiples of 16",
  },
  triton_autotuning: {
    what: "Triton's @triton.autotune decorator automatically selects the best kernel configuration (BLOCK_SIZE, num_warps, num_stages) by benchmarking multiple configs at first call. The key argument identifies which kernel parameters affect the best config (e.g., matrix shapes). AutoTuning is essential for reaching peak performance without manual search.",
    visual:
      "A race with different car setups: BLOCK_SIZE=64 with 4 warps might win on small matrices; BLOCK_SIZE=128 with 8 warps on large ones; 3-stage pipeline wins when memory-latency hides well. AutoTune runs each car around the track once and picks the winner for your specific GPU and problem size.",
    intuition: [
      "@triton.autotune(configs=[Config({'BLOCK_SIZE': 128, 'num_warps': 4}), ...], key=['n_elements'])",
      "key=['M','N','K']: re-tune whenever these dimensions change — cached per (M,N,K) triplet",
      "num_warps: threads per block = 32 × num_warps; controls occupancy",
      "num_stages: depth of software pipeline (double buffer = 2, triple buffer = 3); needs cp.async",
      "Tune over: BLOCK_M, BLOCK_N, BLOCK_K, num_warps, num_stages for GEMM-like kernels",
      "First call is slow (benchmarking); subsequent calls use cached best config — amortize with warmup",
    ],
    formula: "@triton.autotune(configs=[Config(kwargs, num_warps, num_stages)], key=[dim_names])",
  },
  roofline: {
    what: "The roofline model predicts kernel performance by plotting achievable FLOP/s against arithmetic intensity (AI = FLOPs/byte). Performance is bounded by min(peak_FLOPS, peak_bandwidth × AI). Kernels to the left of the ridge point are memory-bound; to the right are compute-bound. It is the first diagnostic tool to use when optimizing a kernel.",
    visual:
      "A log-log graph with two ceilings: a slanted line from bottom-left (bandwidth ceiling: more bytes → more FLOPS possible) meets a flat line at the top (peak compute). Your kernel is a dot on this graph. Left of the peak: widen the highway (bandwidth). Right of the peak: speed up the compute units.",
    intuition: [
      "A100 roofline: peak BF16 tensor = 312 TFLOPS; HBM BW = 2 TB/s → ridge point = 156 FLOP/byte",
      "GEMM (large): AI ≈ M×N×K×2 / (M×K + K×N + M×N) bytes ≈ TILE_SIZE/2 → compute-bound above TILE=32",
      "Element-wise ops (add, relu): AI = 1/3 FLOP/byte — firmly memory-bound",
      "LayerNorm, Softmax: memory-bound without fusion; fusing into GEMM's output raises AI dramatically",
      "Goal: maximize AI to shift your kernel rightward; then maximize occupancy/ILP to reach compute ceiling",
      "Use Nsight Compute's 'Roofline' chart to instantly see where your kernel sits",
    ],
    formula: "performance = min(peak_FLOPS, peak_BW × AI)  where  AI = total_FLOPs / total_bytes_accessed",
  },
  arithmetic_intensity: {
    what: "Arithmetic Intensity (AI) is the ratio of floating-point operations performed to bytes of memory accessed: FLOPs/byte. It determines whether a kernel is compute-bound or memory-bound in the roofline model. Tiling increases AI by reusing data from fast memory; element-wise ops have AI near 0.5 FLOPs/byte.",
    visual:
      "A brick-laying analogy. AI = bricks laid / trips to the supply depot. Low AI: walk to depot, lay one brick, repeat (memory-bound). High AI: carry 100 bricks per trip (tiling), lay all of them (compute) before returning. Goal: maximize bricks per depot trip.",
    intuition: [
      "Vector add C=A+B: 2 loads + 1 store = 12 bytes; 1 FLOP → AI = 0.083 FLOP/byte (very memory-bound)",
      "GEMM M=N=K=4096: ≈137B FLOPs / (2×4096² × 4B) ≈ 4096/2 = 2048 FLOP/byte (compute-bound on A100)",
      "Fusing ops (activation + matmul): same bytes, more FLOPs → higher AI → closer to compute ceiling",
      "L2 cache changes effective AI: if L2 serves most reads, effective AI is higher than naive calculation",
      "Nsight Compute 'SOL' report shows actual FLOP/byte and bandwidth utilization",
      "AI is the reason Flash Attention outperforms standard attention despite the same total FLOPs",
    ],
    formula: "AI = total_floating_point_ops / total_bytes_transferred_to_from_HBM",
  },
  tiling: {
    what: "Tiling (blocking) is the most important GPU optimization: divide large matrix operands into smaller tiles that fit in shared memory or registers, load each tile once, reuse it for many computations, then move to the next tile. Tiling converts a memory-bound operation into a compute-bound one by dramatically increasing arithmetic intensity.",
    visual:
      "Computing C = A × B where A,B are 4096×4096. Without tiling: each of 4096² output elements reads an entire row (4096 floats) and column from global memory. With tiling (TILE=128): load a 128×128 block of A and B into shared memory once, compute 128² partial products, advance. Each float is read once to SMEM, used 128 times.",
    intuition: [
      "Shared memory tile of A: (BLOCK_M × BLOCK_K) × 4B; tile of B: (BLOCK_K × BLOCK_N) × 4B",
      "For GEMM: arithmetic intensity with tiling ≈ BLOCK_SIZE / 2 (vs 1/dim without tiling)",
      "Tile size is limited by shared memory: BLOCK_M × BLOCK_K + BLOCK_K × BLOCK_N ≤ smem/4",
      "Double buffering: prefetch next tile into buffer while computing current tile → hides load latency",
      "Same principle applies to convolution, attention, and any operation with data reuse",
      "Triton handles tiling naturally: you declare BLOCK_M, BLOCK_N, BLOCK_K and Triton manages SMEM",
    ],
    formula: "effective_AI_with_tiling ≈ BLOCK_SIZE / 2  (vs AI ≈ 1 without tiling for square GEMM)",
  },
  pipelining: {
    what: "Software pipelining (double buffering) overlaps the loading of the next data tile with the computation on the current tile. On Ampere and later GPUs, cp.async enables hardware-assisted asynchronous copies from global to shared memory, allowing the SM to continue compute while the DMA engine fetches the next tile. This hides memory latency behind useful work.",
    visual:
      "Assembly line: while workers (CUDA cores) weld car body k, robots (cp.async) are already painting car k+1 in the next bay. When welding completes, painting is done — zero wait. Without pipelining: weld, wait for paint, weld, wait for paint. Double buffer = one bay always active.",
    intuition: [
      "Single buffer (no pipelining): load tile → sync → compute → loop: latency exposed",
      "Double buffer (pipelining): issue async load of tile k+1 → compute on tile k → sync → swap buffers",
      "cp.async (PTX: cp.async.ca.shared.global): copies 4-16 bytes global → shared without using registers",
      "cuda::pipeline (C++) or tl.num_stages in Triton: manages pipeline stages automatically",
      "Triple buffering (num_stages=3) can further improve for very high memory latency",
      "Triton's num_stages AutoTune config directly controls pipelining depth",
    ],
    formula: "cp.async(dst_smem, src_global, 16);  cp.async.commit_group();  cp.async.wait_group(1);",
  },
  naive_gemm: {
    what: "Naive GEMM assigns one output element C[i][j] per thread. Each thread reads an entire row of A (K elements) and an entire column of B (K elements) from global memory to compute one dot product. For M=N=K=4096: each thread reads 2×4096×4 bytes = 32KB from global memory for one scalar output. Global memory traffic is enormous.",
    visual:
      "Thread (i,j) walks through warehouse aisle A-row-i and B-col-j, picking one item from each step by step. 4096 threads do this simultaneously but each is walking their own aisle. The warehouse (global memory) gets absolutely hammered with requests — most data is re-read by many different threads with no sharing.",
    intuition: [
      "Global reads per thread = 2K floats; global reads for whole matrix = M×N×2K = 2×K×M×N reads total",
      "Byte traffic = 2 × K × M × N × 4 bytes; for 4096³: 2 × 4096³ × 4 = 549 GB (single pass, no reuse)",
      "A100 BW = 2 TB/s → naive GEMM minimum time = 0.27 ms just for loads (ignoring compute)",
      "Actual naive GEMM: ~10-100× slower than theoretical minimum due to uncoalesced access patterns",
      "Column access in B is strided (row-major memory): each read is a separate cache miss",
      "The fix is tiled GEMM: reduce global memory reads by a factor of TILE_SIZE",
    ],
    formula: "C[i][j] = sum_{k=0}^{K} A[i][k] * B[k][j];  // global memory for every A[i][k] and B[k][j]",
  },
  tiled_gemm: {
    what: "Tiled GEMM divides A, B, and C into TILE×TILE sub-matrices. A thread block computes one output tile C[r][s] by iterating over K-tiles: loading TILE×TILE of A and B into shared memory, computing partial dot products using those tiles, advancing by TILE in K, and accumulating the results. Each float is loaded from global memory exactly once per operand.",
    visual:
      "Instead of reading from the warehouse per multiply, workers carry a TILE×TILE pallet of A and B from the warehouse to the local workbench (shared memory). They do all the multiplications using workbench copies, then fetch the next pallets. The warehouse is visited only K/TILE times per output tile instead of K times.",
    intuition: [
      "Global loads per output element: 2K/TILE (shared memory amortizes across TILE threads per row/col)",
      "For TILE=128: 128× fewer global memory reads than naive — dramatically higher arithmetic intensity",
      "Thread i,j in block loads tile_A[threadIdx.y][threadIdx.x] and tile_B[threadIdx.y][threadIdx.x]",
      "__syncthreads() after loading tile; another after computing to signal safe overwrite",
      "Register accumulator: float acc = 0; for(k) acc += tile_A[r][k] * tile_B[k][s]; → stays in registers",
      "Optimal TILE size: limited by shared memory size and register count per thread",
    ],
    formula: "for t=0..K/TILE: smem_A=A[row_tile][t*TILE..(t+1)*TILE]; smem_B=B[t*TILE..][col_tile]; sync; acc+=smem_A@smem_B",
  },
  tensor_core_gemm: {
    what: "Tensor Core GEMM uses the wmma (Warp Matrix Multiply Accumulate) API or PTX mma instructions to perform 16×16×16 FP16 matrix multiplications in hardware. An entire warp collaborates to load, multiply, and accumulate matrix fragments. This achieves ~8× the FLOP/s of CUDA core FP32 on the same SM.",
    visual:
      "A whole warp (32 threads) acts as a single matrix-multiply unit. Each thread holds a fragment (portion) of the A, B, and C matrices. One wmma::mma_sync instruction fires the tensor core and all 32 threads work together to produce the output fragment. Individual registers form a distributed matrix in hardware.",
    intuition: [
      "Supported shapes (Ampere FP16/BF16): 16×16×16, 32×8×16, 8×32×16 — choose based on problem dimensions",
      "CUDA wmma API: wmma::fragment<...>, wmma::load_matrix_sync, wmma::mma_sync, wmma::store_matrix_sync",
      "In practice: use cuBLAS (fully optimized), CUTLASS (composable), or Triton tl.dot (easy) instead of raw wmma",
      "Data layout: matrices must be in specific row/col-major fragment layouts — use wmma::layout_t",
      "Pipeline: load FP16 tiles into shared memory → load fragments from SMEM → mma_sync → accumulate in FP32",
      "H100 FP8 tensor cores: 2× throughput of FP16 — 1979 TFLOPS, useful for inference",
    ],
    formula: "wmma::mma_sync(C_frag, A_frag, B_frag, C_frag);  // D = A × B + C in one warp instruction",
  },
  flash_attention: {
    what: "Flash Attention (Dao et al., 2022) is an I/O-aware tiled attention algorithm that avoids materializing the full N×N attention matrix in HBM. Standard attention writes O(N²) attention scores to HBM; Flash Attention tiles the computation to keep scores in SRAM, reducing HBM reads/writes from O(N²) to O(N) for the attention matrix. This gives 2-4× speedup and O(N) GPU memory.",
    visual:
      "Standard attention: print out a 10,000×10,000 spreadsheet (full N×N matrix to HBM), then post-process it. Flash attention: process 128-row chunks at a time on a clipboard (SRAM), compute the correct softmax on-the-fly using the online softmax trick, never printing the full spreadsheet. Same final answer, radically less I/O.",
    intuition: [
      "Standard attention bottleneck: writing/reading N×N float16 matrix to HBM = N² × 2 bytes (64 GB for N=64K)",
      "Flash attention tiles over Q, K, V: load BLOCK_Q rows of Q and BLOCK_K rows of K into SRAM",
      "Online softmax: maintain running max m_i and running sum l_i to correct partial softmax across tiles",
      "Backward pass: recompute attention scores from Q,K rather than storing them (saves N² memory)",
      "Flash Attention 2 (2023): better work partitioning across warps → 2× faster than v1",
      "Flash Attention 3 (2024, H100): uses WGMMA and TMA instructions → 75% of H100 peak throughput",
    ],
    formula: "O = softmax(QK^T / sqrt(d)) V  -- computed in O(N) HBM I/O via tiled SRAM computation",
  },
};
