export const EXPLANATIONS = {
  perceptron: {
    what: "A perceptron computes an affine score w.x + b and applies an activation. It is the atomic unit of deep networks.",
    visual:
      "Inputs flow into a neuron, weighted and summed, then transformed by a nonlinear gate.",
    intuition: [
      "Weights define feature importance",
      "Bias shifts decision threshold",
      "Stacked perceptrons form deep representations",
      "Without nonlinearity, stacks collapse to one linear map",
      "The universal approximation theorem guarantees that a single hidden layer with enough neurons can approximate any continuous function on a compact domain.",
    ],
    formula: "a = phi(w^T x + b)",
  },
  activations: {
    what: "Activation functions create nonlinearity so networks can approximate complex functions.",
    visual:
      "A linear signal bends through ReLU, sigmoid, or tanh curves to produce nonlinear response.",
    intuition: [
      "ReLU is sparse and computationally cheap",
      "Sigmoid saturates at extremes, shrinking gradients",
      "Tanh is zero-centered but still saturates",
      "Activation choice affects gradient flow and expressivity",
      "Swish (x * sigmoid(x)) and GELU, used in GPT and BERT respectively, empirically outperform ReLU in transformers by allowing small negative outputs that preserve gradient signal.",
    ],
    formula: "ReLU(z)=max(0,z), sigmoid(z)=1/(1+e^-z)",
  },
  forwardpass: {
    what: "The forward pass composes layers from input to output to generate predictions and intermediate activations.",
    visual:
      "Values propagate left-to-right through successive linear and nonlinear transforms.",
    intuition: [
      "Each layer re-encodes features at higher abstraction",
      "Intermediate activations are cached for backprop",
      "Numerical stability in logits and normalization matters",
      "Inference is purely forward computation",
      "In practice, fused CUDA kernels (e.g., in cuDNN and PyTorch 2.0's torch.compile) overlap memory transfers with computation to reduce the dominant bottleneck of memory bandwidth rather than FLOP count.",
    ],
    formula: "h_l = phi(W_l h_{l-1} + b_l)",
  },
  backprop: {
    what: "Backpropagation applies chain rule efficiently to compute gradients of loss with respect to all parameters.",
    visual:
      "Gradient signals travel backward from output to early layers, scaled by local Jacobians.",
    intuition: [
      "Reverse-mode AD is efficient for scalar losses",
      "Local derivatives multiply across depth",
      "Gradient checkpointing trades memory for compute",
      "Correct graph construction is critical for valid gradients",
      "Reverse-mode automatic differentiation (as formalized by Griewank & Walther) has cost proportional to the forward pass, making it asymptotically optimal for networks with many parameters and a single scalar loss.",
    ],
    formula: "dL/dW_l = dL/dh_l * dh_l/dW_l",
  },
  softmax: {
    what: "Softmax maps logits to a probability simplex and is standard for multiclass prediction.",
    visual:
      "Higher logit bars become dominant probabilities while all outputs remain nonnegative and sum to one.",
    intuition: [
      "Relative logit differences matter more than absolute shift",
      "Temperature controls distribution sharpness",
      "Pairs naturally with cross-entropy loss",
      "Calibration can still be poor despite high accuracy",
      "The log-sum-exp trick (subtracting max logit before exponentiation) prevents numerical overflow and is used universally in production implementations.",
    ],
    formula: "p_i = exp(z_i) / sum_j exp(z_j)",
  },
  initialization: {
    what: "Initialization sets parameter scales to keep activations and gradients in stable ranges across layers.",
    visual:
      "Bad initialization causes exploding or dying signals; balanced initialization keeps layer statistics controlled.",
    intuition: [
      "Xavier/He scaling preserve variance better",
      "Symmetry-breaking requires random perturbation",
      "Too small weights stall learning",
      "Too large weights destabilize updates",
      "Fixup initialization (Zhang et al., 2019) and μP (maximal update parameterization) show that careful scaling of residual branches allows training arbitrarily deep or wide networks without normalization layers.",
    ],
    formula: "Var(W) approx 2/fan_in (ReLU)",
  },
  vanishing: {
    what: "In deep chains, gradients can shrink to near zero or explode due to repeated multiplications.",
    visual: "Layerwise gradient bars fade out or blow up as depth increases.",
    intuition: [
      "Saturating activations worsen vanishing",
      "Residual paths and normalization help signal flow",
      "Long sequences make RNNs especially sensitive",
      "Gradient clipping mitigates explosions",
      "The spectral radius of the weight Jacobian governs stability: if it consistently exceeds 1 gradients explode, and if it falls below 1 they vanish, a condition formalized in the edge-of-chaos analysis by Poole et al. (2016).",
    ],
    formula: "||dL/dh_0|| approx product_l ||J_l||",
  },
  batchnorm: {
    what: "Batch normalization standardizes intermediate activations and learns affine re-scaling.",
    visual:
      "Feature distributions are centered and rescaled each batch, then shifted by trainable gamma and beta.",
    intuition: [
      "Improves optimization conditioning",
      "Allows larger learning rates in many setups",
      "Batch statistics add training noise",
      "Train/inference behavior differs",
      "Santurkar et al. (2018) showed that BatchNorm's primary benefit is smoothing the loss landscape rather than reducing internal covariate shift as originally claimed, explaining why it works even with non-IID mini-batches.",
    ],
    formula: "y = gamma * (x-mu_batch)/sqrt(var_batch+eps) + beta",
  },
  dropout: {
    what: "Dropout randomly zeros activations during training, approximating model averaging and reducing co-adaptation.",
    visual:
      "Different random subnetworks are sampled each step by dropping nodes.",
    intuition: [
      "Acts as stochastic regularization",
      "Use scale correction to keep expected activation",
      "Too much dropout underfits",
      "Often reduced in convolutional backbones",
      "Gal & Ghahramani (2016) showed that dropout at inference time with multiple forward passes approximates Bayesian posterior predictive inference, enabling practical uncertainty quantification.",
    ],
    formula: "h_tilde = m * h, m_i~Bernoulli(1-p)",
  },
  sgd: {
    what: "Stochastic gradient descent updates parameters using minibatch gradient estimates.",
    visual:
      "The path jitters downhill due to gradient noise but tracks descent direction.",
    intuition: [
      "Noise can help escape sharp basins",
      "Batch size controls variance of updates",
      "Momentum smooths oscillation",
      "Learning-rate schedule is essential",
      "The linear scaling rule (Goyal et al., 2017) states that multiplying batch size by k requires multiplying the learning rate by k to preserve training dynamics, enabling efficient large-scale distributed training.",
    ],
    formula: "w_{t+1} = w_t - eta g_t",
  },
  adam: {
    what: "Adam adapts per-parameter learning rates using first and second moment estimates of gradients.",
    visual:
      "Different coordinates receive differently scaled steps based on historical gradient statistics.",
    intuition: [
      "Fast early progress in many tasks",
      "Bias correction matters in early steps",
      "Can generalize differently than SGD",
      "Weight decay should usually be decoupled",
      "Reddi et al. (2018) proved that Adam can diverge due to non-convergence of its exponential moving average, motivating AMSGrad which keeps a running maximum of second moments to guarantee convergence.",
    ],
    formula: "w_{t+1}=w_t-eta m_hat_t/(sqrt(v_hat_t)+eps)",
  },
  learningrate: {
    what: "Learning-rate schedules adjust step size over training to balance exploration and convergence.",
    visual: "A step-size curve decays, warms up, or cycles over epochs.",
    intuition: [
      "Warmup stabilizes early training",
      "Decay helps settle near minima",
      "Cosine schedules often improve final performance",
      "Schedule interacts with optimizer and batch size",
      "The 1-cycle policy (Smith & Toler, 2019) and its variants show that a single large learning-rate cycle with brief super-convergence phases can match multi-epoch training in a fraction of the steps.",
    ],
    formula: "eta_t = schedule(t)",
  },
  weightdecay: {
    what: "Weight decay adds shrinkage pressure on parameters, encouraging simpler solutions and better generalization.",
    visual:
      "Without decay, weights spread larger; with decay, parameter magnitudes stay controlled.",
    intuition: [
      "Equivalent to L2 penalty under plain SGD",
      "Decoupled weight decay behaves better with Adam",
      "Helps reduce overfitting and sharp minima",
      "Should not always apply equally to all parameter types",
      "Loshchilov & Hutter (AdamW, 2019) demonstrated that applying weight decay directly to parameters rather than to gradients restores the regularization effect lost when Adam's per-parameter scaling distorts the L2 penalty.",
    ],
    formula: "w <- (1 - eta*lambda)w - eta*g",
  },
  losslandscape: {
    what: "Loss landscapes describe objective geometry over parameter space, influencing optimization speed and generalization.",
    visual:
      "Trajectories through flat valleys and sharp basins exhibit different stability behavior.",
    intuition: [
      "Curvature anisotropy causes zig-zagging",
      "Flat minima often correlate with robustness",
      "Landscape slices are partial views of huge dimensions",
      "Preconditioning changes effective geometry",
      "Sharpness-Aware Minimization (SAM, Foret et al. 2021) explicitly seeks parameters that lie in flat loss neighborhoods by solving a minimax perturbation problem at each step, consistently improving generalization across vision and language benchmarks.",
    ],
    formula: "L(theta) and local Hessian eigen-structure",
  },
  cnn: {
    what: "Convolution layers apply shared local filters to exploit spatial locality and translational structure.",
    visual:
      "A small kernel scans across an image, producing feature maps sensitive to repeated patterns.",
    intuition: [
      "Weight sharing reduces parameter count",
      "Early layers detect edges/textures",
      "Stride and padding control spatial resolution",
      "Convs induce locality bias",
      "Depthwise separable convolutions (used in MobileNet and Xception) factor a standard 3D convolution into depthwise spatial and pointwise channel operations, reducing FLOPs by roughly 8-9x with minimal accuracy loss.",
    ],
    formula: "y(i,j)=sum_{u,v,c} K(u,v,c) x(i+u,j+v,c)",
  },
  pooling: {
    what: "Pooling aggregates local neighborhoods to reduce resolution and gain local invariance.",
    visual:
      "Small windows collapse to representative values (max or average), shrinking feature maps.",
    intuition: [
      "Max pooling preserves strongest activation",
      "Average pooling smooths responses",
      "Too aggressive pooling loses detail",
      "Modern architectures sometimes replace pooling with strided convs",
      "Global average pooling (GAP), introduced in Network in Network (Lin et al., 2014), collapses each feature map to a single scalar and serves as a native spatial-to-class mapping that acts as a structural regularizer against overfitting.",
    ],
    formula: "y(i,j)=max_{(u,v) in window} x(i+u,j+v)",
  },
  residual: {
    what: "Residual connections add identity shortcuts, letting blocks learn residual corrections rather than full mappings.",
    visual:
      "Signal can flow through both transformation branch and skip branch, then recombine.",
    intuition: [
      "Improves gradient flow in deep networks",
      "Makes optimization easier for very deep stacks",
      "Identity path preserves low-level information",
      "Foundation of ResNet and Transformer blocks",
      "He et al. (2016) showed that residual networks can be viewed as an ensemble of O(2^n) implicit shorter paths, explaining why removing individual layers at test time degrades ResNets far less than plain networks of the same depth.",
    ],
    formula: "y = F(x) + x",
  },
  rnn: {
    what: "RNNs process sequences by carrying hidden state across time steps.",
    visual:
      "A recurrent cell unrolls across time, each state depending on current input and previous state.",
    intuition: [
      "Captures temporal dependencies",
      "BPTT applies backprop through unrolled time",
      "Long dependencies are hard for vanilla RNNs",
      "Gates in LSTM/GRU mitigate forgetting",
      "The eigenvalue spectrum of the recurrent weight matrix W_h determines stability: orthogonal initialization (Henaff et al., 2016) keeps all singular values at 1, providing unitary gradient flow and enabling learning over thousands of time steps.",
    ],
    formula: "h_t = phi(W_h h_{t-1} + W_x x_t)",
  },
  attention: {
    what: "Attention computes context-aware weighted combinations of values using query-key similarity.",
    visual:
      "Each token distributes focus weights over other tokens based on relevance scores.",
    intuition: [
      "Content-based routing replaces fixed-distance dependencies",
      "Parallelizable unlike recurrent scans",
      "Multi-head attention captures diverse relations",
      "Scaling by sqrt(dk) stabilizes logits",
      "Linear attention variants (e.g., Performer, Mamba's selective state space) approximate or replace the O(n^2) attention kernel with O(n) recurrent equivalents by using kernel feature maps or input-dependent gating.",
    ],
    formula: "Attention(Q,K,V)=softmax(QK^T/sqrt(dk))V",
  },
  transformer: {
    what: "Transformers stack self-attention and feedforward blocks with residual and normalization layers.",
    visual:
      "Token representations repeatedly exchange context then pass through nonlinear channel mixing blocks.",
    intuition: [
      "Depth builds hierarchical representations",
      "Positional encoding injects order information",
      "Pre-norm stabilizes deep training",
      "Dominant architecture for modern sequence modeling",
      "The feedforward sublayer, which expands to 4x the model dimension and contracts back, accounts for the majority of parameters and is where factual knowledge is believed to be stored (Geva et al., 2021), explaining why MoE variants target it for capacity scaling.",
    ],
    formula: "x_{l+1}=x_l + FFN(x_l + MHA(x_l))",
  },
  embeddings: {
    what: "Embeddings map discrete items to dense vectors where geometry reflects semantic or functional similarity.",
    visual:
      "Related tokens cluster nearby while unrelated tokens lie farther apart in vector space.",
    intuition: [
      "Embedding tables are learned lookup matrices",
      "Dot products enable fast similarity",
      "Dimensionality controls capacity and compression",
      "Contextual embeddings depend on surrounding tokens",
      "Word2Vec's skip-gram objective (Mikolov et al., 2013) was later shown by Levy & Goldberg to implicitly factorize a pointwise mutual information (PMI) matrix, revealing that linear algebraic structure in embeddings is a direct consequence of co-occurrence statistics.",
    ],
    formula: "e_i = E[i] where E in R^(V x d)",
  },
  layernorm: {
    what: "Layer normalization normalizes features within each token/sample, avoiding batch-size dependence.",
    visual:
      "Each token vector is centered/rescaled independently before affine reparameterization.",
    intuition: [
      "Works well in transformers and sequence models",
      "Stable with small or variable batch sizes",
      "Improves optimization smoothness in deep stacks",
      "Different from BatchNorm normalization axis",
      "RMSNorm (Zhang & Sennrich, 2019), which drops the mean-centering step and normalizes only by root-mean-square, achieves equivalent downstream quality with ~7% less compute and is now the default in LLaMA and Mistral architectures.",
    ],
    formula: "y = gamma * (x-mu_layer)/sqrt(var_layer+eps) + beta",
  },
  gradientclipping: {
    what: "Gradient clipping caps update magnitude to prevent unstable exploding steps.",
    visual:
      "Oversized gradient vectors are rescaled to lie on a norm ball boundary.",
    intuition: [
      "Common in RNN and large-model training",
      "Protects against rare but destructive gradient spikes",
      "Does not fix root-cause conditioning alone",
      "Usually paired with adaptive optimizers",
      "Global norm clipping (clip_by_global_norm) is preferred over per-parameter clipping because it preserves the direction of the full gradient vector, avoiding distortions to relative update ratios across layers.",
    ],
    formula: "g <- g * min(1, c/||g||)",
  },
  earlystopping: {
    what: "Early stopping halts training at best validation point before overfitting worsens generalization.",
    visual:
      "Validation curve bottoms out then rises; training is stopped near minimum.",
    intuition: [
      "Acts as implicit regularization",
      "Needs reliable validation protocol",
      "Patience controls noise tolerance",
      "Can save significant compute",
      "Caruana et al. (2001) proved that under squared error, early stopping is approximately equivalent to L2 regularization, with the stopping epoch playing the role of the inverse regularization strength.",
    ],
    formula: "stop when val metric fails to improve for p epochs",
  },
  dataaugmentation: {
    what: "Data augmentation creates transformed examples that preserve labels, improving invariance and robustness.",
    visual:
      "One sample yields multiple rotated/cropped/noisy variants during training.",
    intuition: [
      "Expands effective dataset diversity",
      "Reduces overfitting in low-data settings",
      "Task-consistent transforms are critical",
      "Strong augmentation may require longer training",
      "AugMix (Hendrycks et al., 2020) chains random augmentation sequences and mixes them with the original via a Jensen-Shannon consistency loss, significantly improving corruption robustness without requiring access to corrupted data at training time.",
    ],
    formula: "x' = T(x),  y' = y",
  },
  finetuning: {
    what: "Fine-tuning starts from pretrained weights and updates parameters on target-task data.",
    visual:
      "A pretrained representation is gently shifted toward task-specific optimum.",
    intuition: [
      "Speeds convergence and boosts accuracy",
      "Layer-wise learning rates can preserve base knowledge",
      "Small datasets need careful regularization",
      "Catastrophic forgetting is a risk",
      "Lee et al. (2022) showed that fine-tuning only the last few layers while keeping earlier layers frozen often matches full fine-tuning on small datasets, because pretrained features are more transferable than top task-specific projections.",
    ],
    formula: "theta <- theta_pretrained then optimize on target loss",
  },
  distillation: {
    what: "Distillation trains a compact student to match teacher soft predictions, transferring dark knowledge.",
    visual:
      "Student logits are pulled toward teacher probability structure, not only hard labels.",
    intuition: [
      "Improves small model accuracy",
      "Temperature reveals class similarity structure",
      "Can combine hard-label and soft-label losses",
      "Useful for deployment efficiency",
      "Self-distillation (Born-Again Networks, Furlanello et al. 2018) shows that re-training a same-size student from a teacher of identical architecture still yields consistent accuracy gains, implying the soft targets encode regularization beyond what hard labels provide.",
    ],
    formula: "L = alpha CE(y,p_s) + (1-alpha) T^2 KL(p_t^T || p_s^T)",
  },
  mixedprecision: {
    what: "Mixed precision uses lower precision for most operations while preserving critical accumulations for stability.",
    visual:
      "Fast low-precision compute paths are corrected by high-precision master updates.",
    intuition: [
      "Speeds training and lowers memory usage",
      "Loss scaling prevents underflow",
      "Hardware support strongly affects gains",
      "Numerical checks still required",
      "NVIDIA's BF16 format, preferred over FP16 in recent LLM training, uses the same 8-bit exponent as FP32 to avoid the overflow that caused FP16 instabilities in GPT-3 scale runs, sacrificing mantissa precision instead.",
    ],
    formula: "w_fp32 <- w_fp32 - eta * grad(fp16, scaled)",
  },
  transferlearning: {
    what: "Transfer learning reuses representations learned on source tasks to improve target-task learning efficiency.",
    visual:
      "General features learned upstream are adapted downstream with smaller task-specific shifts.",
    intuition: [
      "Most effective when domains are related",
      "Lower layers often remain broadly useful",
      "Can reduce required labeled data",
      "Negative transfer is possible when domains mismatch",
      "Raghu et al. (2019) found via CKA similarity analysis that lower transformer layers transfer almost perfectly across NLP tasks while upper layers specialize, providing a principled guide for which layers to freeze versus fine-tune.",
    ],
    formula: "theta_target initialized from theta_source",
  },
  positionalencoding: {
    what: "Positional encodings inject order information into token representations for permutation-invariant attention blocks.",
    visual:
      "Position vectors are added to token embeddings so identical tokens at different positions become distinguishable.",
    intuition: [
      "Essential for sequence order awareness",
      "Can be fixed sinusoidal or learned",
      "Affects extrapolation to longer contexts",
      "Interacts with attention pattern formation",
      "Rotary Position Embedding (RoPE, Su et al. 2022) encodes positions as rotation matrices applied to Q and K, making attention scores depend only on relative position and enabling length generalization beyond the training context window.",
    ],
    formula: "x_t = e_t + p_t",
  },
  maskedattention: {
    what: "Masked attention restricts visibility so tokens attend only to allowed positions (e.g., causal past).",
    visual:
      "Attention matrix is triangular or selectively blocked by mask patterns.",
    intuition: [
      "Causal masks enable autoregressive decoding",
      "Padding masks ignore empty tokens",
      "Mask mistakes cause data leakage",
      "Same mechanism supports many attention variants",
      "Sliding-window attention (Longformer, Beltagy et al. 2020) replaces full causal masks with local windows plus a few global tokens, reducing complexity from O(n^2) to O(n) and enabling efficient processing of documents with tens of thousands of tokens.",
    ],
    formula: "softmax((QK^T + M)/sqrt(dk))V",
  },
  encoderdecoder: {
    what: "Encoder-decoder architectures encode source context then decode conditioned outputs step-by-step.",
    visual:
      "Source sequence is compressed into context representations consumed by decoder attention.",
    intuition: [
      "Core for translation and transduction tasks",
      "Cross-attention links output generation to source",
      "Teacher forcing aids training stability",
      "Decoding strategy influences final quality",
      "In the original Transformer (Vaswani et al., 2017), cross-attention queries come from the decoder while keys and values come from encoder outputs, creating a direct information bottleneck whose capacity scales with the number of cross-attention heads.",
    ],
    formula: "y_t ~ p(y_t | y_<t, Enc(x))",
  },
  autoregressive: {
    what: "Autoregressive models factorize sequence likelihood as product of conditional next-token probabilities.",
    visual:
      "Generation proceeds token-by-token, each conditioned on all previously generated tokens.",
    intuition: [
      "Natural for language generation",
      "Supports exact likelihood training",
      "Exposure bias emerges from train/infer mismatch",
      "Sampling temperature/top-k alter diversity",
      "Speculative decoding (Chen et al., 2023) uses a small draft model to propose multiple tokens at once, then verifies them in parallel with the large model, recovering exact large-model distribution while achieving 2-3x wall-clock speedup.",
    ],
    formula: "p(x_1:T)=product_t p(x_t|x_<t)",
  },
  moe: {
    what: "Mixture-of-Experts routes tokens to sparse subsets of expert networks for higher capacity at similar compute.",
    visual:
      "A gate dispatches each token to a few experts, then combines expert outputs.",
    intuition: [
      "Increases parameter count without dense compute cost",
      "Routing balance is a training challenge",
      "Expert specialization emerges over training",
      "Load-balancing losses are important",
      "DeepSeek-V2's multi-head latent attention combined with fine-grained MoE routing (262 experts, top-6 active) demonstrates that expert granularity rather than raw expert count is the key lever for both capacity and routing efficiency.",
    ],
    formula: "y = sum_k g_k(x) E_k(x), sparse g",
  },
  diffusion: {
    what: "Diffusion models learn to reverse a gradual noise process, generating samples through iterative denoising.",
    visual:
      "Noise is added forward over steps, then model removes noise stepwise to recover structure.",
    intuition: [
      "Training predicts noise or score at each timestep",
      "Sampling quality-speed tradeoff via step count",
      "Guidance steers outputs toward conditions",
      "Strong generative performance in vision/audio",
      "Flow Matching (Lipman et al., 2022) generalizes diffusion by training a velocity field to follow straight probability-flow ODE paths between noise and data, achieving the same generative quality with far fewer function evaluations than DDPM.",
    ],
    formula: "x_{t-1} = f_theta(x_t, t) + noise",
  },
  prompttuning: {
    what: "Prompt tuning learns small prompt parameters while freezing most base model weights.",
    visual:
      "A learned prefix nudges frozen model representations toward task behavior.",
    intuition: [
      "Parameter-efficient adaptation",
      "Reduces memory and deployment complexity",
      "Can underperform full fine-tuning on large shifts",
      "Works well with strong pretrained backbones",
      "Lester et al. (2021) showed that prompt tuning matches fine-tuning performance only at model scales above ~10B parameters, suggesting that larger models develop a more steerable representation space where soft prompts can operate effectively.",
    ],
    formula: "theta_base fixed, optimize theta_prompt",
  },
  lstm: {
    what: "LSTM introduces gated memory cells to preserve useful information across long sequences.",
    visual:
      "Input, forget, and output gates control what enters, stays in, or exits cell state over time.",
    intuition: [
      "Mitigates vanishing gradients compared with vanilla RNN",
      "Cell state provides long-term memory channel",
      "Gate saturation can still limit learning",
      "Widely used in forecasting and sequence tagging",
      "The LSTM's constant error carousel — the direct additive path through the cell state — is precisely what allows gradients to flow across thousands of time steps without decay, an insight that directly inspired the residual connection in ResNets.",
    ],
    formula: "c_t = f_t * c_{t-1} + i_t * c_t_tilde",
  },
  gru: {
    what: "GRU is a simplified gated recurrent unit combining memory and hidden-state updates.",
    visual:
      "Update and reset gates modulate how much old state persists and how much new input is injected.",
    intuition: [
      "Fewer parameters than LSTM",
      "Often similar quality with lower compute",
      "Works well for medium-length dependencies",
      "Still trained with backprop through time",
      "Chung et al. (2014) demonstrated that GRU's coupled update-and-reset gate mechanism achieves statistically indistinguishable performance from LSTM on polyphonic music and speech modeling benchmarks despite having one fewer gate.",
    ],
    formula: "h_t = (1-z_t) * h_{t-1} + z_t * h_t_tilde",
  },
  bidirectional: {
    what: "Bidirectional recurrent models process sequences in forward and backward directions and combine both contexts.",
    visual:
      "Two RNN streams sweep opposite directions and merge states at each token position.",
    intuition: [
      "Improves context for tagging and classification",
      "Unavailable for strictly causal generation",
      "Doubles recurrent computation",
      "Common in encoder blocks before transformers dominated",
      "BERT's masked language model objective is functionally equivalent to training a bidirectional model because each masked token's prediction depends on all surrounding tokens in both directions simultaneously.",
    ],
    formula: "h_t = [h_t_forward ; h_t_backward]",
  },
  beamsearch: {
    what: "Beam search keeps top-K partial sequences during decoding to approximate global best output.",
    visual:
      "A branching tree is pruned each step to retain only highest scoring candidate paths.",
    intuition: [
      "Improves quality over greedy decoding",
      "Larger beam increases compute and may reduce diversity",
      "Length normalization is often needed",
      "Works with autoregressive probabilities",
      "Stahlberg & Byrne (2019) proved that beam search in neural MT is not guaranteed to find the maximum-probability string and can be outperformed by a single greedy pass when the model is well-calibrated, motivating sampling-based alternatives.",
    ],
    formula: "y_hat = argmax_y sum_t log p(y_t|y_<t,x), approx by beam K",
  },
  teacherforcing: {
    what: "Teacher forcing feeds ground-truth previous tokens to decoder during training instead of model predictions.",
    visual:
      "Training trajectory follows true sequence path even when current model would deviate.",
    intuition: [
      "Stabilizes and accelerates sequence training",
      "Creates train-inference mismatch (exposure bias)",
      "Scheduled sampling partially bridges mismatch",
      "Standard in encoder-decoder training",
      "DAgger (Ross et al., 2011) and its sequence-model adaptations address the distributional mismatch by iteratively collecting on-policy rollouts and mixing them with ground-truth trajectories, progressively reducing exposure bias during training.",
    ],
    formula: "input_t = y_{t-1}^true during training",
  },
  labelsmoothing: {
    what: "Label smoothing replaces one-hot targets with softened distributions to reduce overconfidence.",
    visual:
      "Target probability mass is spread slightly from true class to other classes.",
    intuition: [
      "Improves calibration and robustness",
      "Acts as regularization on logits",
      "Can reduce overfitting in large models",
      "Too much smoothing harms peak accuracy",
      "Muller et al. (2019) showed via penultimate-layer representation analysis that label smoothing causes a model's class clusters to become tighter and more equidistant, which is why it improves calibration but can hurt knowledge-distillation when the teacher uses it.",
    ],
    formula: "y_smooth = (1-eps) * y_onehot + eps/K",
  },
  focalloss: {
    what: "Focal loss down-weights easy examples so training focuses more on hard or rare cases.",
    visual:
      "Loss contribution from confidently correct points shrinks while difficult points remain emphasized.",
    intuition: [
      "Useful in class-imbalanced detection tasks",
      "Gamma controls hard-example emphasis",
      "Balances signal in dense negative-heavy settings",
      "Can require tuning with sampling strategies",
      "Lin et al. (2017) introduced focal loss alongside the RetinaNet one-stage detector and demonstrated that it alone closed the accuracy gap with two-stage Faster R-CNN detectors, attributing the gain entirely to eliminating the easy-negative gradient flood.",
    ],
    formula: "FL = -(1-p_t)^gamma log(p_t)",
  },
  contrastivelearning: {
    what: "Contrastive learning optimizes representations by pulling positive pairs together and pushing negatives apart.",
    visual:
      "Embedding points from related views cluster, while unrelated points are repelled.",
    intuition: [
      "Learns useful features without labels",
      "Quality depends on augmentations and negatives",
      "Temperature affects separation sharpness",
      "Foundation of many self-supervised methods",
      "SimCSE (Gao et al., 2021) showed that passing the same sentence through a dropout-equipped encoder twice produces surprisingly effective positive pairs, achieving state-of-the-art sentence embeddings without any augmentation engineering.",
    ],
    formula: "L_InfoNCE = -log exp(sim(i,j)/tau) / sum_k exp(sim(i,k)/tau)",
  },
  metriclearning: {
    what: "Metric learning shapes embedding space so distance reflects semantic similarity.",
    visual:
      "Same-class examples form tight clusters with clear margins from other classes.",
    intuition: [
      "Drives retrieval and verification systems",
      "Triplet/pair losses define relative constraints",
      "Mining hard negatives is critical",
      "Embedding normalization changes distance geometry",
      "ArcFace (Deng et al., 2019) applies an additive angular margin penalty in the cosine similarity space, geometrically enforcing a fixed angular boundary between classes and consistently outperforming margin-based triplet losses on face verification benchmarks.",
    ],
    formula: "L_triplet = max(0, d(a,p)-d(a,n)+m)",
  },
  selfsupervised: {
    what: "Self-supervised learning creates training signals from unlabeled data through pretext objectives.",
    visual:
      "Model predicts missing, reordered, or transformed content derived from the same sample.",
    intuition: [
      "Scales representation learning with web-scale data",
      "Pretraining then fine-tuning is standard pipeline",
      "Objective choice shapes downstream transfer quality",
      "Can rival supervised pretraining in many domains",
      "DINO (Caron et al., 2021) shows that a Vision Transformer trained self-supervisedly with a self-distillation objective develops explicit semantic segmentation maps in its attention heads, a property that does not emerge under supervised training.",
    ],
    formula: "min_theta E[L_pretext(x)]",
  },
  maskedmodeling: {
    what: "Masked modeling hides input parts and trains the model to reconstruct them from context.",
    visual:
      "Masked tokens are replaced and model predicts originals using surrounding information.",
    intuition: [
      "Bidirectional context encourages rich representations",
      "Mask ratio affects difficulty and stability",
      "Used in language, vision, and multimodal pretraining",
      "Pairs naturally with transformer encoders",
      "MAE (He et al., 2022) demonstrates that masking 75% of image patches and reconstructing raw pixel values forces ViT encoders to learn holistic semantic representations, while low mask ratios lead to shortcuts exploiting local texture.",
    ],
    formula: "L = -sum_{t in masked} log p(x_t|x_unmasked)",
  },
  vae: {
    what: "Variational Autoencoders learn latent-variable generative models with amortized inference.",
    visual:
      "Input is encoded to distribution in latent space, sampled, then decoded back to reconstruction.",
    intuition: [
      "Balances reconstruction quality and latent regularity",
      "Latent space supports interpolation and generation",
      "KL term prevents unconstrained memorization",
      "Can suffer posterior collapse in strong decoders",
      "beta-VAE (Higgins et al., 2017) showed that increasing the KL weight beyond 1 encourages disentangled latent factors aligned with independent generative factors of variation, at the cost of reduced reconstruction fidelity.",
    ],
    formula: "ELBO = E_q(z|x)[log p(x|z)] - KL(q(z|x)||p(z))",
  },
  gan: {
    what: "GANs train generator and discriminator in an adversarial minimax game for realistic sample synthesis.",
    visual:
      "Generator distribution moves toward data manifold while discriminator boundary adapts to separate real/fake.",
    intuition: [
      "Can produce sharp high-fidelity samples",
      "Training instability and mode collapse are common",
      "Discriminator quality strongly affects generator gradients",
      "Many variants improve stability (WGAN, hinge, etc.)",
      "StyleGAN2 (Karras et al., 2020) introduced weight demodulation instead of adaptive instance normalization to eliminate droplet artifacts, and demonstrated that mapping network depth rather than latent dimensionality is the primary driver of disentanglement quality.",
    ],
    formula: "min_G max_D E[log D(x)] + E[log(1-D(G(z)))]",
  },
  normalizingflows: {
    what: "Normalizing flows use invertible transformations to map simple base distributions to complex data distributions.",
    visual:
      "A simple Gaussian is warped through reversible layers into a complex target density.",
    intuition: [
      "Exact likelihood is tractable via change-of-variables",
      "Invertibility constrains architecture choices",
      "Jacobian determinant drives density correction",
      "Useful for density estimation and uncertainty",
      "Continuous normalizing flows (CNFs, Chen et al. 2018) parameterize the transformation as the solution to a neural ODE, enabling free-form Jacobians with O(d) trace estimation via Hutchinson's trick instead of the O(d^2) cost of discrete coupling layers.",
    ],
    formula: "log p(x)=log p(z)+log|det dz/dx|",
  },
  scorematching: {
    what: "Score matching learns gradients of log-density, enabling sampling without explicit normalized likelihoods.",
    visual:
      "Vector field over data space points toward regions of higher probability mass.",
    intuition: [
      "Core objective behind diffusion/score-based models",
      "Avoids partition-function estimation",
      "Noise-conditioned training stabilizes score learning",
      "Sampling follows learned score field dynamics",
      "Song et al. (2021) unified score matching and diffusion models by showing that DDPM's denoising objective is equivalent to denoising score matching at each noise level, and that DDIM sampling follows a probability-flow ODE whose continuous limit is an SDE.",
    ],
    formula: "s_theta(x) approx grad_x log p(x)",
  },
  lora: {
    what: "LoRA injects trainable low-rank adapters into frozen weight matrices for parameter-efficient fine-tuning.",
    visual:
      "Base weight remains fixed while low-rank A and B matrices provide task-specific adjustment.",
    intuition: [
      "Massively reduces trainable parameters",
      "Preserves base model for multi-task reuse",
      "Rank controls capacity/efficiency tradeoff",
      "Works well in transformer attention/FFN layers",
      "QLoRA (Dettmers et al., 2023) combines 4-bit NormalFloat quantization of the frozen base weights with LoRA adapters in BF16, enabling fine-tuning of 65B-parameter models on a single 48 GB GPU without measurable quality degradation.",
    ],
    formula: "W_eff = W_0 + BA, rank(A,B)=r",
  },
  quantization: {
    what: "Quantization compresses weights/activations into lower bit-width formats for faster and smaller models.",
    visual:
      "Continuous parameter values are snapped onto discrete quantization levels.",
    intuition: [
      "Improves inference speed and memory footprint",
      "Can be post-training or quantization-aware",
      "Lower bits increase approximation error",
      "Hardware kernels determine real speedups",
      "GPTQ (Frantar et al., 2022) uses an approximate second-order (Hessian-based) weight update to compensate for quantization error layer-by-layer, enabling accurate 3-4 bit post-training quantization of GPT-scale models in under four GPU-hours.",
    ],
    formula: "x_q = round(x/s)*s",
  },
  pruning: {
    what: "Pruning removes unimportant weights, channels, or heads to produce sparse and cheaper models.",
    visual:
      "Low-saliency connections are cut, leaving a compact subnet retaining most performance.",
    intuition: [
      "Can reduce model size significantly",
      "Often requires fine-tuning after pruning",
      "Structured pruning maps better to hardware",
      "Sparsity alone does not guarantee latency gain",
      "The Lottery Ticket Hypothesis (Frankle & Carlin, 2019) showed that dense networks contain sparse subnetworks (winning tickets) that, when trained from their original initialization, match full-network accuracy, implying that capacity allocation rather than overparameterization is the key role of width.",
    ],
    formula: "w_i <- 0 if |w_i| < threshold",
  },
  flashattention: {
    what: "Flash Attention computes exact attention with IO-aware tiling to reduce memory traffic.",
    visual:
      "Attention matrix is processed in blocks, avoiding full materialization while preserving exact results.",
    intuition: [
      "Large speed and memory gains for long contexts",
      "Enables bigger batch/context on same hardware",
      "Numerically stable fused kernels",
      "Requires compatible hardware/software kernels",
      "FlashAttention-2 (Dao, 2023) further doubled throughput by parallelizing across the sequence dimension within each attention head and reorganizing work to minimize non-matrix-multiply FLOP overhead, which dominates GPU utilization at long sequence lengths.",
    ],
    formula: "softmax(QK^T)V computed in tiled fused blocks",
  },
  retrievalaugmented: {
    what: "Retrieval-augmented models query external knowledge and condition generation on retrieved context.",
    visual:
      "Question triggers retrieval from memory index, then generator attends to retrieved passages while decoding.",
    intuition: [
      "Improves factuality and freshness",
      "Decouples parametric memory from knowledge store",
      "Retrieval quality strongly affects final output",
      "Supports citation-grounded generation workflows",
      "REALM (Guu et al., 2020) jointly trained the retriever and language model end-to-end using a marginalized likelihood over retrieved documents, demonstrating that retrieval quality improves when the model can back-propagate signal into the document encoder.",
    ],
    formula: "p(y|x)=sum_d p(d|x) p(y|x,d)",
  },
};
