function detail(deeper, useCases, pitfalls, quickCheck) {
  return {
    deeper: deeper,
    useCases: useCases,
    pitfalls: pitfalls,
    quickCheck: quickCheck,
  };
}

function expansion(algebraic, computation, workedExample, connections) {
  return {
    algebraic: algebraic,
    computation: computation,
    workedExample: workedExample,
    connections: connections,
  };
}

export const CONCEPT_DETAILS = {
  perceptron: detail(
    "Perceptrons are affine maps plus nonlinearity; they are universal building blocks for feedforward networks.",
    [
      "Binary and multiclass classifiers",
      "Feature transformation in hidden layers",
      "Logit computation before probabilistic normalization",
    ],
    [
      "Assuming perceptron alone solves non-linearly separable tasks",
      "Ignoring input scaling effects on optimization",
      "Overlooking bias initialization impact",
    ],
    "Inspect pre-activation distributions and ensure they are not collapsed.",
  ),
  activations: detail(
    "Activation choice controls gradient flow, sparsity, and functional smoothness.",
    [
      "ReLU-family for deep vision and language models",
      "Sigmoid/tanh in gated recurrent structures",
      "GELU in modern transformer feedforward blocks",
    ],
    [
      "Dead ReLU units from poor initialization",
      "Saturation in sigmoid/tanh causing tiny gradients",
      "Mismatched activation-output range assumptions",
    ],
    "Track activation histograms per layer during early epochs.",
  ),
  forwardpass: detail(
    "Forward propagation defines the computation graph and caches intermediates needed by reverse-mode differentiation.",
    [
      "Inference latency benchmarking",
      "Activation memory profiling",
      "Feature probing and interpretability",
    ],
    [
      "Silent shape mismatches with broadcasting",
      "Numerical overflow in exponentials/logits",
      "Inconsistent train/eval mode behavior",
    ],
    "Validate tensor shapes and value ranges at each major block.",
  ),
  backprop: detail(
    "Backprop is reverse accumulation of derivatives across the graph and enables efficient large-scale training.",
    [
      "Parameter gradient computation for all trainable layers",
      "Sensitivity analysis and saliency maps",
      "Meta-learning and higher-order optimization",
    ],
    [
      "Detached tensors breaking gradient flow",
      "Incorrect custom backward definitions",
      "Exploding graph memory from retained intermediates",
    ],
    "Run gradient checks on custom ops with finite-difference spot tests.",
  ),
  softmax: detail(
    "Softmax turns unconstrained logits into normalized class probabilities but can be overconfident.",
    [
      "Multiclass classification",
      "Token prediction in language modeling",
      "Attention weight normalization",
    ],
    [
      "Computing exp on raw large logits without stabilization",
      "Interpreting probabilities as calibrated confidence by default",
      "Applying softmax twice",
    ],
    "Use log-sum-exp stable implementations and evaluate calibration separately.",
  ),
  initialization: detail(
    "Initialization sets the starting signal-to-noise regime for optimization and determines early gradient quality.",
    [
      "He init for ReLU stacks",
      "Xavier init for symmetric activations",
      "Layer-wise scaling in deep residual nets",
    ],
    [
      "Starting all weights identically",
      "Too-large variance causing divergence",
      "Too-small variance causing stalled learning",
    ],
    "Check per-layer activation and gradient variance after first minibatches.",
  ),
  vanishing: detail(
    "Gradient attenuation/amplification through depth or time limits trainability of deep/recurrent networks.",
    [
      "Diagnose failing deep model training",
      "Tune sequence model architecture",
      "Motivate residual/gated designs",
    ],
    [
      "Ignoring gradient norms across depth",
      "Using saturating nonlinearities everywhere",
      "No clipping in unstable recurrent training",
    ],
    "Log gradient norms by layer and identify depth where signal collapses.",
  ),
  batchnorm: detail(
    "BatchNorm normalizes activations with minibatch statistics and learns rescale/shift parameters.",
    [
      "Stabilize convnet training",
      "Enable larger learning rates",
      "Reduce internal covariate drift sensitivity",
    ],
    [
      "Tiny batch sizes causing noisy estimates",
      "Forgetting train/eval mode switch",
      "Using BatchNorm where LayerNorm is more appropriate",
    ],
    "Compare running statistics and batch statistics during training.",
  ),
  dropout: detail(
    "Dropout injects multiplicative Bernoulli noise that regularizes co-adapted features.",
    [
      "Improve generalization in dense layers",
      "Approximate ensemble behavior",
      "Reduce overfitting in low-data settings",
    ],
    [
      "Applying high dropout rates in small models",
      "Keeping dropout active during inference",
      "Stacking dropout with incompatible normalization choices",
    ],
    "Track train/validation gap with and without dropout under fixed seeds.",
  ),
  sgd: detail(
    "SGD uses noisy minibatch gradients and often yields strong generalization with proper schedules.",
    [
      "Large-scale supervised training",
      "Fine-tuning pretrained models",
      "Baseline optimizer benchmarking",
    ],
    [
      "No momentum in high-curvature regimes",
      "Static learning rate too long",
      "Batch size changes without learning-rate retuning",
    ],
    "Monitor both loss and gradient norm; noisy but downward trends indicate healthy progress.",
  ),
  adam: detail(
    "Adam adapts steps by gradient moments, often improving early optimization speed.",
    [
      "Transformer pretraining",
      "Sparse-gradient settings",
      "Fast prototyping and hyperparameter sweeps",
    ],
    [
      "Wrong epsilon/betas for scale regime",
      "Coupled L2 penalty instead of decoupled decay",
      "Assuming Adam always outperforms SGD",
    ],
    "Compare final validation with SGD baseline, not only early-epoch loss.",
  ),
  learningrate: detail(
    "Learning-rate policy is a primary control knob for optimization stability and final quality.",
    [
      "Warmup for large-batch training",
      "Cosine decay in long runs",
      "One-cycle schedules for fast convergence",
    ],
    [
      "Skipping warmup at large scale",
      "Aggressive decay causing premature stagnation",
      "Schedule mismatch after changing epoch count",
    ],
    "Plot learning rate and loss together to verify expected response at schedule transitions.",
  ),
  weightdecay: detail(
    "Weight decay constrains parameter norm growth, reducing overfitting and improving robustness.",
    [
      "Generalization improvements in vision and language models",
      "Stabilize very over-parameterized models",
      "Control norm growth in long training runs",
    ],
    [
      "Applying identical decay to bias/normalization parameters",
      "Confusing L2 regularization with decoupled decay",
      "Over-decaying and underfitting",
    ],
    "Inspect parameter norm trajectories with and without decay.",
  ),
  losslandscape: detail(
    "Landscape geometry determines step sensitivity, sharpness, and optimizer trajectory behavior.",
    [
      "Analyze sharp vs flat minima",
      "Diagnose optimization plateaus",
      "Compare optimizer dynamics",
    ],
    [
      "Overinterpreting 2D slices of high-dimensional surfaces",
      "Ignoring parameterization dependence",
      "Conflating train sharpness with test performance deterministically",
    ],
    "Use consistent reparameterization and compare multiple random direction slices.",
  ),
  cnn: detail(
    "Convolutions exploit local stationarity and translational structure while sharing parameters spatially.",
    [
      "Image classification and detection",
      "Audio and spectrogram modeling",
      "Spatial feature extraction in hybrid models",
    ],
    [
      "Incorrect padding/stride assumptions",
      "Kernel sizes that destroy needed detail",
      "Ignoring receptive field growth",
    ],
    "Compute receptive field size layer-by-layer to verify coverage.",
  ),
  pooling: detail(
    "Pooling trades spatial resolution for invariance and lower compute.",
    [
      "Downsample feature maps",
      "Reduce sensitivity to small translations",
      "Compress intermediate representations",
    ],
    [
      "Excessive pooling causing information loss",
      "Using max pooling where average aggregation is better",
      "Mismatched downsampling between skip paths",
    ],
    "Visualize feature maps before/after pooling to ensure salient structure remains.",
  ),
  residual: detail(
    "Residual paths provide shortcut gradients and identity transport that make deep stacks trainable.",
    [
      "Very deep convolutional and transformer networks",
      "Progressive feature refinement blocks",
      "Stabilizing optimization at scale",
    ],
    [
      "Shape mismatches across skip branches",
      "Overusing residual depth without capacity planning",
      "Ignoring normalization placement effects",
    ],
    "Verify residual branch outputs have compatible shape and scale with skip branch.",
  ),
  rnn: detail(
    "RNNs reuse parameters across time, modeling sequential dependence through hidden state updates.",
    [
      "Language modeling baselines",
      "Time-series forecasting",
      "Streaming sequence processing",
    ],
    [
      "Long-term dependency failures in vanilla cells",
      "BPTT truncation too short for task horizon",
      "Hidden-state leakage between sequences",
    ],
    "Probe performance vs sequence length to detect memory limitations.",
  ),
  attention: detail(
    "Attention learns data-dependent communication patterns among tokens using similarity-based routing.",
    [
      "Machine translation and summarization",
      "Document retrieval and reranking",
      "Cross-modal fusion",
    ],
    [
      "Quadratic cost at long sequence lengths",
      "Misinterpreting attention maps as full explanations",
      "Unstable logits without scaling/masking",
    ],
    "Check mask correctness and attention entropy across heads.",
  ),
  transformer: detail(
    "Transformers combine multi-head attention, feedforward expansion, normalization, and residual flow.",
    [
      "Language and code modeling",
      "Vision transformers",
      "Multimodal foundation models",
    ],
    [
      "Positional encoding mismatches for long contexts",
      "Memory blowups with naive attention",
      "Overfitting small datasets with oversized models",
    ],
    "Track attention memory usage and validate position handling on long sequences.",
  ),
  embeddings: detail(
    "Embeddings provide dense learned coordinates for discrete entities and enable geometric reasoning.",
    [
      "Token representations in NLP",
      "User/item representations in recommender systems",
      "Entity embeddings for categorical features",
    ],
    [
      "Embedding collapse with weak training signal",
      "Oversized embedding tables without regularization",
      "Treating static embeddings as context-aware",
    ],
    "Measure nearest-neighbor coherence and norm distribution of embeddings.",
  ),
  layernorm: detail(
    "LayerNorm normalizes across features per token and avoids dependence on batch statistics.",
    [
      "Transformer training stabilization",
      "Small-batch sequence modeling",
      "Deep residual stack conditioning",
    ],
    [
      "Confusing LayerNorm and BatchNorm placement",
      "Applying inconsistent epsilon/gamma/beta handling",
      "Ignoring pre-norm vs post-norm architecture effects",
    ],
    "Track per-layer activation variance before and after normalization.",
  ),
  gradientclipping: detail(
    "Gradient clipping limits destructive update spikes by constraining gradient norm or values.",
    [
      "Stabilize recurrent training",
      "Prevent intermittent divergence in large models",
      "Support higher learning rates safely",
    ],
    [
      "Clipping too aggressively and slowing learning",
      "Using clipping as substitute for poor initialization",
      "Applying clipping inconsistently across parameter groups",
    ],
    "Log unclipped and clipped gradient norms to verify intervention frequency.",
  ),
  earlystopping: detail(
    "Early stopping selects checkpoint by validation behavior and acts as compute-efficient regularization.",
    [
      "Prevent overfitting on small datasets",
      "Reduce unnecessary training compute",
      "Automatic model selection by validation metric",
    ],
    [
      "Using noisy validation metric without smoothing/patience",
      "Stopping before optimizer reaches stable region",
      "Repeatedly tuning on validation causing leakage",
    ],
    "Plot train vs validation curves and verify chosen checkpoint near validation optimum.",
  ),
  dataaugmentation: detail(
    "Augmentation encodes invariances and broadens training distribution support.",
    [
      "Vision and audio robustness improvements",
      "Low-data regime performance gains",
      "Regularization against memorization",
    ],
    [
      "Applying label-breaking transforms",
      "Over-augmenting and introducing unrealistic samples",
      "Mismatch between train augmentations and inference domain",
    ],
    "Audit augmented samples visually/statistically for label consistency.",
  ),
  finetuning: detail(
    "Fine-tuning adapts pretrained networks to downstream tasks with partial or full parameter updates.",
    [
      "Domain adaptation from foundation models",
      "Task specialization with fewer labels",
      "Incremental capability updates",
    ],
    [
      "Catastrophic forgetting of useful pretrained behavior",
      "Too-large learning rates destroying pretrained structure",
      "Unfreezing too many layers too early",
    ],
    "Use layer-wise LR and monitor drift from pretrained representations.",
  ),
  distillation: detail(
    "Distillation transfers teacher behavior to smaller students using softened targets and auxiliary losses.",
    [
      "Model compression for deployment",
      "Latency reduction on edge devices",
      "Student training with limited labels",
    ],
    [
      "Temperature mismatch between teacher and student training",
      "Overweighting soft loss and harming hard-label fit",
      "Teacher errors propagating into student",
    ],
    "Compare hard-label-only vs distilled student to confirm teacher signal value.",
  ),
  mixedprecision: detail(
    "Mixed precision accelerates throughput by using low precision math with carefully managed numerical stability.",
    [
      "Large-batch GPU/TPU training speedups",
      "Reduced memory footprint for larger models",
      "Higher throughput in training and inference",
    ],
    [
      "Underflow without loss scaling",
      "Unsupported ops silently reverting precision unexpectedly",
      "Overlooking numeric drift in sensitive layers",
    ],
    "Enable dynamic loss scaling and validate metric parity vs full precision runs.",
  ),
  transferlearning: detail(
    "Transfer learning reuses upstream representations to cut sample complexity and training time on target tasks.",
    [
      "Fine-grained classification with limited labels",
      "Cross-domain adaptation from large pretrained backbones",
      "Rapid prototyping with frozen features",
    ],
    [
      "Negative transfer from mismatched source domain",
      "Overfitting small target datasets during adaptation",
      "Ignoring feature drift across domains",
    ],
    "Benchmark frozen-feature baseline vs full fine-tuning for real transfer gain.",
  ),
  positionalencoding: detail(
    "Positional signals provide order information absent from pure content-based attention.",
    [
      "Language and time-series transformers",
      "Long-context sequence modeling",
      "Relative-position aware attention mechanisms",
    ],
    [
      "Using encoding type that fails to extrapolate length",
      "Incorrect position indexing at chunk boundaries",
      "Mismatched positional scheme between pretrain and finetune",
    ],
    "Validate performance on longer contexts than training to assess position generalization.",
  ),
  maskedattention: detail(
    "Masked attention enforces causal or structural constraints on token visibility.",
    [
      "Autoregressive language modeling",
      "Sequence-to-sequence decoding",
      "Structured sparse attention patterns",
    ],
    [
      "Mask sign/value mistakes causing leakage",
      "Forgetting padding masks in variable-length batches",
      "Incompatible mask broadcasting shapes",
    ],
    "Unit-test masks with tiny sequences where correct attention pattern is known.",
  ),
  encoderdecoder: detail(
    "Encoder-decoder systems separate source representation from conditional generation dynamics.",
    [
      "Machine translation and summarization",
      "Speech-to-text or text-to-text transduction",
      "Conditional generation with source context",
    ],
    [
      "Weak cross-attention alignment",
      "Exposure bias during autoregressive decoding",
      "Length bias in beam search outputs",
    ],
    "Inspect attention alignments and length-normalized decoding metrics.",
  ),
  autoregressive: detail(
    "Autoregressive factorization models full-sequence likelihood through chained conditional predictions.",
    [
      "Language generation and completion",
      "Time-series probabilistic forecasting",
      "Token-level uncertainty estimation",
    ],
    [
      "Exposure bias from teacher forcing mismatch",
      "Degenerate repetitive sampling at low temperature",
      "Slow sequential decoding latency",
    ],
    "Evaluate with both likelihood metrics and sampling quality diagnostics.",
  ),
  moe: detail(
    "Mixture-of-Experts scales model capacity with sparse routing and conditional expert activation.",
    [
      "Large-scale language model scaling",
      "Compute-efficient high-capacity architectures",
      "Domain-specialized expert routing",
    ],
    [
      "Expert imbalance and routing collapse",
      "Communication overhead in distributed training",
      "Routing instability early in training",
    ],
    "Track per-expert token load and load-balancing loss during training.",
  ),
  diffusion: detail(
    "Diffusion models learn denoising transitions that reverse a stochastic corruption process.",
    [
      "Image/audio generation with high fidelity",
      "Conditional generation with classifier/guidance methods",
      "Inverse-problem solving via iterative denoising",
    ],
    [
      "Very slow sampling with many steps",
      "Schedule mismatch degrading quality",
      "Mode collapse misconceptions from poor evaluation",
    ],
    "Compare quality-speed tradeoff across sampler step counts and schedules.",
  ),
  prompttuning: detail(
    "Prompt tuning adapts behavior by learning small prompt parameters while freezing backbone weights.",
    [
      "Parameter-efficient multi-task adaptation",
      "Low-memory deployment customization",
      "Fast experimentation across tasks",
    ],
    [
      "Insufficient prompt capacity for complex shifts",
      "Prompt overfitting on tiny datasets",
      "Assuming portability across very different base models",
    ],
    "Compare prompt-tuned and full-finetuned checkpoints under equal compute budgets.",
  ),
  lstm: detail(
    "LSTM adds explicit cell-state memory and gating to stabilize long-range sequence credit assignment.",
    [
      "Speech, text, and time-series sequence modeling",
      "Long-horizon forecasting tasks",
      "Sequence tagging with temporal dependencies",
    ],
    [
      "Gate saturation causing ineffective updates",
      "Over-parameterization on small datasets",
      "Ignoring sequence length truncation effects",
    ],
    "Track forget/input gate activations and gradient norms through time.",
  ),
  gru: detail(
    "GRU offers gated recurrent dynamics with fewer parameters than LSTM while retaining long-dependency capability.",
    [
      "Efficient recurrent baselines",
      "Mobile or low-latency sequence models",
      "Medium-length context modeling",
    ],
    [
      "Assuming GRU always outperforms LSTM",
      "No regularization for recurrent weights",
      "Using too-long unroll windows without clipping",
    ],
    "Benchmark GRU vs LSTM under equal parameter and compute budgets.",
  ),
  bidirectional: detail(
    "Bidirectional recurrent architectures combine past and future context for each position.",
    [
      "Named entity recognition",
      "Sequence classification encoders",
      "Offline transcription and tagging",
    ],
    [
      "Using bidirectional setup in causal generation tasks",
      "Doubling compute/memory without quality gain checks",
      "Improper concatenation/projection of directional states",
    ],
    "Validate whether future context is allowed in deployment setting.",
  ),
  beamsearch: detail(
    "Beam search approximates global sequence decoding by tracking multiple high-probability partial hypotheses.",
    [
      "Machine translation decoding",
      "Summarization and caption generation",
      "Structured sequence prediction",
    ],
    [
      "Length bias toward short outputs",
      "Large beam causing low-diversity bland outputs",
      "Mismatch between token likelihood and task metric",
    ],
    "Sweep beam width and length penalty on validation metrics.",
  ),
  teacherforcing: detail(
    "Teacher forcing stabilizes seq2seq training by feeding true prior tokens during training.",
    [
      "Neural machine translation",
      "Autoregressive sequence model pretraining",
      "Conditional generation training",
    ],
    [
      "Exposure bias at inference",
      "No schedule for transition to model-generated inputs",
      "Assuming train and inference dynamics are identical",
    ],
    "Compare free-running rollout quality vs teacher-forced validation loss.",
  ),
  labelsmoothing: detail(
    "Label smoothing regularizes classification targets, reducing confidence spikes and improving calibration.",
    [
      "Large-vocabulary language modeling",
      "Image classification with noisy labels",
      "Transformer sequence tasks",
    ],
    [
      "Smoothing too aggressively and hurting discriminative power",
      "Combining with losses that already soften targets",
      "Ignoring impact on probability calibration metrics",
    ],
    "Tune epsilon with both accuracy and calibration (ECE/Brier) checks.",
  ),
  focalloss: detail(
    "Focal loss reshapes cross-entropy to emphasize hard examples and suppress easy negatives.",
    [
      "Object detection imbalance",
      "Rare-event classification",
      "Dense prediction with many background samples",
    ],
    [
      "Inappropriate gamma/alpha causing unstable learning",
      "Using focal loss without baseline comparison",
      "Ignoring class-reweighting interactions",
    ],
    "Ablate gamma and alpha while monitoring minority-class recall.",
  ),
  contrastivelearning: detail(
    "Contrastive objectives learn invariant representations through pairwise agreement and separation.",
    [
      "Vision/text self-supervised pretraining",
      "Cross-modal alignment",
      "Representation learning without labels",
    ],
    [
      "Weak augmentations producing shortcut features",
      "Small negative set hurting representation quality",
      "Temperature misconfiguration collapsing gradients",
    ],
    "Inspect embedding collapse indicators and nearest-neighbor consistency.",
  ),
  metriclearning: detail(
    "Metric learning explicitly optimizes embedding geometry for retrieval and verification tasks.",
    ["Face verification", "Product/image retrieval", "Few-shot classification"],
    [
      "Poor hard-negative mining strategy",
      "Distance metric mismatch with downstream use",
      "Class imbalance in pair/triplet construction",
    ],
    "Track intra-class vs inter-class distance distributions.",
  ),
  selfsupervised: detail(
    "Self-supervised methods scale pretraining by deriving labels from input structure itself.",
    [
      "Foundation model pretraining",
      "Domain adaptation with unlabeled corpora",
      "Representation bootstrapping for low-label tasks",
    ],
    [
      "Pretext objective misaligned with downstream task",
      "Underestimating compute/data requirements",
      "No probing of representation quality before fine-tuning",
    ],
    "Run linear-probe evaluation to verify learned representation quality.",
  ),
  maskedmodeling: detail(
    "Masked modeling trains contextual reconstruction and yields strong bidirectional representations.",
    [
      "BERT-style language pretraining",
      "Masked image modeling",
      "Multimodal pretraining objectives",
    ],
    [
      "Masking patterns leaking trivial cues",
      "Mask ratio too high causing optimization collapse",
      "Inconsistent mask strategy between train and eval",
    ],
    "Ablate mask ratio and verify representation transfer performance.",
  ),
  vae: detail(
    "VAE couples encoder/decoder with KL-regularized latent inference for controllable generative modeling.",
    [
      "Latent interpolation and representation learning",
      "Semi-supervised generative modeling",
      "Uncertainty-aware reconstruction tasks",
    ],
    [
      "Posterior collapse with strong decoders",
      "KL weight misbalance hurting generation or reconstructions",
      "Assuming latent dimensions are semantically disentangled by default",
    ],
    "Monitor KL and reconstruction terms separately across training.",
  ),
  gan: detail(
    "GAN training is adversarial and often high-fidelity but sensitive to optimization dynamics.",
    [
      "Image synthesis and super-resolution",
      "Data augmentation generation",
      "Style transfer and domain translation",
    ],
    [
      "Mode collapse reducing diversity",
      "Discriminator overpowering generator",
      "Unstable alternating update schedules",
    ],
    "Track both sample diversity metrics and discriminator/generator loss balance.",
  ),
  normalizingflows: detail(
    "Normalizing flows model complex densities with invertible layers and exact likelihood evaluation.",
    [
      "Density estimation",
      "Likelihood-based anomaly detection",
      "Latent-variable and Bayesian posterior modeling",
    ],
    [
      "Architectures violating efficient invertibility/Jacobian computation",
      "Poor base distribution assumptions",
      "High compute cost for deep flow stacks",
    ],
    "Validate invertibility numerically and track log-determinant stability.",
  ),
  scorematching: detail(
    "Score matching learns score fields that define diffusion and score-based generative samplers.",
    [
      "Diffusion model training objectives",
      "Unnormalized density estimation",
      "Energy-based generative modeling",
    ],
    [
      "Poor noise schedule harming score quality",
      "Unstable gradient magnitudes at low noise levels",
      "Sampling mismatch between train and inference procedures",
    ],
    "Inspect denoising/score error across timesteps, not only aggregate loss.",
  ),
  lora: detail(
    "LoRA introduces low-rank trainable updates to frozen weights for efficient adaptation.",
    [
      "Parameter-efficient LLM fine-tuning",
      "Multi-task adapters on shared backbone",
      "Memory-constrained customization workflows",
    ],
    [
      "Too-low rank underfitting task requirements",
      "Adapter placement choices not tuned",
      "Merging adapters without validation",
    ],
    "Sweep rank/alpha and compare with prompt tuning baselines.",
  ),
  quantization: detail(
    "Quantization reduces numerical precision for storage and compute efficiency.",
    [
      "Edge deployment with limited memory",
      "LLM inference acceleration",
      "Serving-cost reduction at scale",
    ],
    [
      "Accuracy cliffs at very low bit-width",
      "Ignoring activation quantization effects",
      "Hardware backend not supporting target quantization path",
    ],
    "Benchmark latency, memory, and quality jointly on target hardware.",
  ),
  pruning: detail(
    "Pruning removes redundant parameters or structures to compress models and reduce computation.",
    [
      "Model compression for deployment",
      "Structured channel/head reduction",
      "Sparse training and lottery-ticket exploration",
    ],
    [
      "Unstructured sparsity with no real speed gain",
      "Pruning too aggressively before recovery fine-tune",
      "Ignoring distribution shift after pruning",
    ],
    "Measure post-prune recovery after scheduled fine-tuning.",
  ),
  flashattention: detail(
    "Flash Attention optimizes attention kernels with memory-IO-aware tiling and fusion.",
    [
      "Long-context transformer training",
      "Large-batch inference optimization",
      "Memory-bound attention workload acceleration",
    ],
    [
      "Assuming compatibility across all sequence lengths/hardware",
      "Ignoring numerical differences across kernel versions",
      "Missing fallback path for unsupported ops",
    ],
    "Profile memory bandwidth and end-to-end throughput before/after kernel switch.",
  ),
  retrievalaugmented: detail(
    "Retrieval-augmented generation combines parametric model reasoning with external document memory.",
    [
      "Enterprise QA and grounded assistants",
      "Domain-specific factual generation",
      "Low-hallucination workflow design",
    ],
    [
      "Weak retriever quality undermining generation",
      "Context truncation dropping relevant evidence",
      "No attribution/citation checks in outputs",
    ],
    "Evaluate retriever recall alongside final generation quality and faithfulness.",
  ),
};

export const CONCEPT_EXPANSIONS = {
  perceptron: expansion(
    "Single-neuron models implement affine decision boundaries in feature space.",
    "Compute logits, apply activation, then evaluate loss.",
    "Binary classifier score flips sign across a hyperplane.",
    ["Activations", "Forward Pass", "Softmax"],
  ),
  activations: expansion(
    "Nonlinear activations increase function class richness beyond linear subspaces.",
    "Test activation distributions and dead-unit rates across layers.",
    "Replacing sigmoid with ReLU can recover gradient flow in deep stacks.",
    ["Backprop", "Initialization", "Vanishing Gradients"],
  ),
  forwardpass: expansion(
    "Forward composition is repeated affine + nonlinear transformations.",
    "Run shape checks and monitor numerical ranges per block.",
    "Feature hierarchy in CNNs emerges from repeated forward transforms.",
    ["Perceptron", "Backprop", "Architectures"],
  ),
  backprop: expansion(
    "Backprop is reverse application of chain rule through computational graph edges.",
    "Use autodiff for VJP and validate custom gradients.",
    "Gradient of early layers is product of downstream Jacobians.",
    ["Chain Rule", "Optimization", "Vanishing Gradients"],
  ),
  softmax: expansion(
    "Softmax parameterizes categorical distributions from logits.",
    "Use stable log-softmax and cross-entropy kernels.",
    "Temperature scaling smooths or sharpens token probabilities.",
    ["Cross-Entropy", "Calibration", "Attention"],
  ),
  initialization: expansion(
    "Variance-preserving initialization reduces pathological signal scaling.",
    "Choose fan-in/fan-out-aware schemes by activation type.",
    "He initialization stabilizes deep ReLU networks at startup.",
    ["Vanishing Gradients", "BatchNorm", "Residual"],
  ),
  vanishing: expansion(
    "Gradient norm propagation depends on product of layer Jacobian norms.",
    "Track per-layer gradient histograms during training.",
    "Residual links keep gradients usable in deep transformers.",
    ["Backprop", "Initialization", "Residual"],
  ),
  batchnorm: expansion(
    "BatchNorm reparameterizes activations to smoother optimization regions.",
    "Maintain separate train-time and inference-time statistics.",
    "Convnet convergence accelerates with BatchNorm between conv and nonlinearity.",
    ["Learning Rate", "Optimization", "Regularization"],
  ),
  dropout: expansion(
    "Dropout approximates averaging over subnetworks by multiplicative noise injection.",
    "Tune dropout rates per block and dataset size.",
    "Moderate dropout reduces validation overfit in dense heads.",
    ["Weight Decay", "Generalization", "Ensembles"],
  ),
  sgd: expansion(
    "SGD follows noisy gradient estimates; noise scale affects implicit regularization.",
    "Tune momentum, batch size, and schedule jointly.",
    "Momentum SGD finds robust minima in large-scale vision tasks.",
    ["Learning Rate", "Loss Landscape", "Generalization"],
  ),
  adam: expansion(
    "Adam preconditions coordinates with second-moment estimates.",
    "Monitor moment estimates and compare with SGD baselines.",
    "AdamW stabilizes long transformer pretraining runs.",
    ["Weight Decay", "Learning Rate", "Optimization"],
  ),
  learningrate: expansion(
    "Learning-rate policy controls discretization error and convergence speed.",
    "Apply warmup then decay, inspecting loss curvature responses.",
    "Cosine decay reduces late-stage oscillations.",
    ["SGD", "Adam", "Loss Landscape"],
  ),
  weightdecay: expansion(
    "Weight decay shrinks parameters each step and biases toward lower-complexity solutions.",
    "Separate decay settings for weights vs norms/biases.",
    "Decoupled decay improves transformer validation perplexity.",
    ["Regularization", "Generalization", "Optimization"],
  ),
  losslandscape: expansion(
    "Local curvature and basin geometry shape optimizer trajectories.",
    "Analyze Hessian approximations and perturbation sensitivity.",
    "Two solutions with similar train loss can differ in sharpness and robustness.",
    ["Hessian", "SGD", "Generalization"],
  ),
  cnn: expansion(
    "Convolution is sparse local matrix multiplication with weight sharing.",
    "Tune kernel, stride, dilation, and padding for receptive field goals.",
    "3x3 stacks capture large context with manageable parameters.",
    ["Pooling", "Residual", "Embeddings"],
  ),
  pooling: expansion(
    "Pooling computes local summary statistics to reduce spatial resolution.",
    "Choose pooling strategy based on invariance vs detail needs.",
    "Global average pooling replaces dense heads in compact classifiers.",
    ["CNN", "Invariance", "Efficiency"],
  ),
  residual: expansion(
    "Residual learning optimizes perturbations around identity maps.",
    "Insert skip paths around unstable deep transformations.",
    "Deep residual stacks train where plain stacks fail.",
    ["Vanishing Gradients", "Transformer", "Initialization"],
  ),
  rnn: expansion(
    "Recurrent recurrence is repeated state transition with shared parameters.",
    "Use truncated BPTT and gating for long dependencies.",
    "GRU/LSTM outperform vanilla RNN on long context tasks.",
    ["Backprop", "Attention", "Sequence Modeling"],
  ),
  attention: expansion(
    "Attention computes similarity kernels between token representations.",
    "Use masking and scaling carefully for causal/bi-directional tasks.",
    "Self-attention captures long-range context in one layer.",
    ["Transformer", "Softmax", "Embeddings"],
  ),
  transformer: expansion(
    "Transformer blocks alternate token mixing (attention) and channel mixing (FFN).",
    "Profile memory and use efficient attention variants for long contexts.",
    "Stack depth and width jointly determine capacity/performance.",
    ["Attention", "Residual", "Normalization"],
  ),
  embeddings: expansion(
    "Embedding matrices implement learned continuous representations for discrete symbols.",
    "Regularize and tie embeddings when appropriate.",
    "Semantic analogies emerge as vector offsets in trained spaces.",
    ["Dot Product", "Attention", "Nearest Neighbors"],
  ),
  layernorm: expansion(
    "LayerNorm normalizes each token across channels, improving residual pathway stability.",
    "Place LayerNorm consistently (pre/post norm) and monitor gradient flow.",
    "Pre-norm transformers remain trainable at greater depths.",
    ["BatchNorm", "Residual", "Optimization"],
  ),
  gradientclipping: expansion(
    "Norm clipping projects gradient onto bounded ball, limiting worst-case update size.",
    "Clip global norm after gradient aggregation and before optimizer step.",
    "Exploding RNN gradients become manageable with norm cap.",
    ["Vanishing/Exploding", "SGD", "Adam"],
  ),
  earlystopping: expansion(
    "Early stopping approximates complexity control by limiting optimization horizon.",
    "Track validation metric with patience and checkpoint best epoch.",
    "Stopping near validation minimum improves generalization and saves compute.",
    ["Regularization", "Loss Landscape", "Fine-Tuning"],
  ),
  dataaugmentation: expansion(
    "Augmentation defines invariance group actions over input space.",
    "Compose task-preserving transforms and tune augmentation strength.",
    "Random crops + flips improve vision model robustness markedly.",
    ["CNN", "Generalization", "Transfer Learning"],
  ),
  finetuning: expansion(
    "Fine-tuning performs continued optimization from pretrained initialization.",
    "Unfreeze layers progressively and use discriminative learning rates.",
    "Lower LR on backbone with higher LR on head preserves transferable features.",
    ["Transfer Learning", "Learning Rate", "Weight Decay"],
  ),
  distillation: expansion(
    "Distillation matches student and teacher predictive distributions, transferring function behavior.",
    "Blend hard-target loss with softened KL loss at tuned temperature.",
    "Compact student approaches teacher accuracy with lower latency.",
    ["Softmax", "Cross-Entropy", "Model Compression"],
  ),
  mixedprecision: expansion(
    "Mixed precision separates storage/compute precision from master update precision.",
    "Enable AMP with dynamic loss scaling and monitor overflow/underflow events.",
    "Large transformer training achieves faster throughput at similar quality.",
    ["Optimization", "Hardware Efficiency", "Stability"],
  ),
  transferlearning: expansion(
    "Transfer learning reuses source-domain representations as informative priors.",
    "Start with frozen backbone baseline then progressively unfreeze.",
    "Pretrained vision backbone boosts performance in low-data medical imaging.",
    ["Fine-Tuning", "Embeddings", "Generalization"],
  ),
  positionalencoding: expansion(
    "Positional encoding augments token embeddings with order-dependent basis signals.",
    "Test fixed vs learned/relative encodings for long-context behavior.",
    "Relative positions improve extrapolation in long-sequence tasks.",
    ["Transformer", "Attention", "Autoregressive"],
  ),
  maskedattention: expansion(
    "Mask matrices enforce structural sparsity in attention logits.",
    "Construct causal/padding masks and verify broadcasting semantics.",
    "Causal mask prevents future-token leakage during language modeling.",
    ["Attention", "Autoregressive", "Encoder-Decoder"],
  ),
  encoderdecoder: expansion(
    "Encoder-decoder factorization separates source understanding from conditional generation.",
    "Train with teacher forcing then decode with beam/sampling strategies.",
    "Translation quality improves when cross-attention aligns source and target spans.",
    ["Transformer", "Masked Attention", "Autoregressive"],
  ),
  autoregressive: expansion(
    "Autoregressive likelihood factorization enables exact next-token training objective.",
    "Train with shifted targets and decode stepwise with sampling controls.",
    "Top-p sampling balances fluency and diversity in generation.",
    ["Masked Attention", "Softmax", "Sequence Modeling"],
  ),
  moe: expansion(
    "MoE uses sparse gating to activate small expert subsets per token.",
    "Tune routing/load-balancing losses and monitor expert utilization.",
    "Sparse experts scale parameter count without proportional FLOP growth.",
    ["Transformer", "Conditional Computation", "Distillation"],
  ),
  diffusion: expansion(
    "Diffusion trains denoising score transitions across timestep-conditioned noise levels.",
    "Learn timestep-conditioned denoiser and sample via iterative reverse process.",
    "Fewer-step samplers trade slight quality loss for major speed gains.",
    ["Generative Modeling", "Optimization", "Conditioning"],
  ),
  prompttuning: expansion(
    "Prompt tuning optimizes low-dimensional task adapters in embedding/prefix space.",
    "Freeze backbone, optimize prompt vectors, and compare with LoRA/full tuning.",
    "Task-specific prompts adapt foundation models with minimal added parameters.",
    ["Embeddings", "Transfer Learning", "Fine-Tuning"],
  ),
  lstm: expansion(
    "LSTM introduces additive memory pathway to preserve long-horizon gradients.",
    "Tune sequence length, hidden size, and gradient clipping for stable BPTT.",
    "LSTM captures delayed dependencies missed by vanilla RNN baselines.",
    ["RNN", "GRU", "Teacher Forcing"],
  ),
  gru: expansion(
    "GRU merges cell/hidden states with update-reset gate factorization.",
    "Compare GRU and LSTM under equal parameter budgets and context lengths.",
    "GRU often matches LSTM with lower latency in sequence tasks.",
    ["RNN", "LSTM", "Bidirectional RNN"],
  ),
  bidirectional: expansion(
    "Bidirectional recurrence composes forward and backward contextual encodings.",
    "Train twin recurrent passes and merge representations with projection.",
    "Token tagging improves with future context from reverse pass.",
    ["RNN", "LSTM", "Encoder-Decoder"],
  ),
  beamsearch: expansion(
    "Beam search performs approximate combinatorial optimization over token sequences.",
    "Decode with beam K, optional length penalty, and hypothesis pruning.",
    "Beam-5 improves translation BLEU over greedy decoding in many settings.",
    ["Autoregressive", "Encoder-Decoder", "Masked Attention"],
  ),
  teacherforcing: expansion(
    "Teacher forcing replaces model-history conditioning with ground-truth history during training.",
    "Use full forcing or scheduled sampling to control train/infer gap.",
    "Scheduled forcing can improve rollout stability for long generation.",
    ["Autoregressive", "Beam Search", "Encoder-Decoder"],
  ),
  labelsmoothing: expansion(
    "Label smoothing adds entropy regularization through softened target distributions.",
    "Tune epsilon and evaluate both accuracy and calibration metrics.",
    "Smoothing reduces overconfident logits and improves robustness.",
    ["Softmax", "Cross-Entropy", "Distillation"],
  ),
  focalloss: expansion(
    "Focal loss reweights gradients based on prediction confidence.",
    "Tune gamma/alpha with class imbalance and sampling strategy.",
    "Hard minority examples retain strong gradients despite many easy negatives.",
    ["Label Smoothing", "Class Imbalance", "Optimization"],
  ),
  contrastivelearning: expansion(
    "Contrastive objectives maximize mutual information surrogates in embedding space.",
    "Build positive pairs via augmentations and optimize InfoNCE with temperature.",
    "Representation quality improves when hard negatives are informative.",
    ["Self-Supervised", "Metric Learning", "Embeddings"],
  ),
  metriclearning: expansion(
    "Metric learning imposes relative distance constraints among examples.",
    "Train with triplet/pair objectives and hard-example mining.",
    "Embedding geometry supports high-accuracy retrieval with nearest neighbors.",
    ["Contrastive Learning", "Embeddings", "k-NN"],
  ),
  selfsupervised: expansion(
    "Self-supervised pretraining optimizes intrinsic objectives on unlabeled corpora.",
    "Pretrain on pretext task, then transfer by fine-tuning or probing.",
    "Large unlabeled pretraining improves downstream sample efficiency.",
    ["Masked Modeling", "Contrastive Learning", "Transfer Learning"],
  ),
  maskedmodeling: expansion(
    "Masked modeling is a denoising objective over partially observed inputs.",
    "Randomly mask tokens/patches and predict originals with contextual encoder.",
    "Masked pretraining yields strong bidirectional features for many tasks.",
    ["Self-Supervised", "Transformer", "Encoder-Decoder"],
  ),
  vae: expansion(
    "VAE optimizes ELBO combining reconstruction likelihood and posterior regularization.",
    "Train encoder/decoder jointly with KL weighting or annealing.",
    "Latent interpolations produce smooth semantic transitions.",
    ["Diffusion", "Normalizing Flows", "Generative Modeling"],
  ),
  gan: expansion(
    "GAN solves minimax divergence matching between generated and real distributions.",
    "Alternate discriminator and generator updates with stabilization heuristics.",
    "Adversarial training yields sharp samples when equilibrium is maintained.",
    ["Diffusion", "Score Matching", "Generative Modeling"],
  ),
  normalizingflows: expansion(
    "Flow models use invertible transformations with tractable Jacobian determinants.",
    "Compose coupling layers and maximize exact log-likelihood.",
    "Exact density estimation enables calibrated anomaly scoring.",
    ["VAE", "Score Matching", "Likelihood"],
  ),
  scorematching: expansion(
    "Score matching learns gradients of log-density rather than normalized density itself.",
    "Train noise-conditioned score network across timesteps/noise scales.",
    "Reverse-time sampling from learned score fields generates realistic data.",
    ["Diffusion", "GAN", "Normalizing Flows"],
  ),
  lora: expansion(
    "LoRA constrains task updates to low-rank subspaces over frozen base weights.",
    "Insert low-rank adapters in attention/FFN and optimize only adapter params.",
    "LoRA reaches strong task performance with a tiny fraction of trainable weights.",
    ["Prompt Tuning", "Fine-Tuning", "Transfer Learning"],
  ),
  quantization: expansion(
    "Quantization maps continuous weights/activations to discrete levels for efficient arithmetic.",
    "Apply post-training quantization or quantization-aware training and calibrate scales.",
    "INT8 inference delivers substantial memory/latency wins with modest accuracy drop.",
    ["Pruning", "Mixed Precision", "Deployment"],
  ),
  pruning: expansion(
    "Pruning exploits redundancy by removing low-importance parameters or structures.",
    "Perform magnitude/structured pruning and fine-tune for accuracy recovery.",
    "Structured head/channel pruning improves throughput on production hardware.",
    ["Quantization", "Distillation", "Compression"],
  ),
  flashattention: expansion(
    "Flash Attention reorders exact attention computation to minimize HBM memory access.",
    "Use fused tiled kernels and benchmark throughput against standard attention.",
    "Long-context training fits larger batch sizes under same memory budget.",
    ["Attention", "Transformer", "Mixed Precision"],
  ),
  retrievalaugmented: expansion(
    "RAG decomposes generation into retrieve-then-generate conditioned modeling.",
    "Index corpus, retrieve top-k context, then condition decoder on retrieved evidence.",
    "Grounded retrieval reduces hallucinations in factual QA workflows.",
    ["Transformer", "Embeddings", "Autoregressive"],
  ),
};
