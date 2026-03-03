export const CONCEPT_DETAILS = {
  sigmoid: {
    deeper:
      "Sigmoid is defined as f(x) = 1 / (1 + e^-x). Historically dominant, it's now mostly reserved for binary output layers and gating mechanisms in LSTMs/GRUs due to vanishing gradients in deep stacks.",
    useCases: [
      "Binary classification output layer (e.g., spam vs. not spam).",
      "Gating mechanism in LSTMs and GRUs.",
    ],
    pitfalls: [
      "Vanishing gradients: for large |x| the gradient approaches 0, blocking learning in earlier layers.",
      "Not zero-centered: all outputs are positive, which can cause zig-zagging during gradient descent.",
    ],
    quickCheck: "What is the output range of Sigmoid and why is it useful for binary classification?",
  },
  tanh: {
    deeper:
      "Tanh is a scaled and shifted Sigmoid: f(x) = (e^x - e^-x) / (e^x + e^-x). It's zero-centered (unlike Sigmoid), which makes weight updates more symmetric and often converges faster.",
    useCases: [
      "Hidden layers in neural networks, especially RNNs.",
      "Anywhere a zero-centered bounded output is needed.",
    ],
    pitfalls: [
      "Still suffers from vanishing gradients for large |x|, similar to Sigmoid.",
    ],
    quickCheck: "How does Tanh's output range differ from Sigmoid's, and why does that matter?",
  },
  "binary-step": {
    deeper:
      "The binary step function is the original activation from Rosenblatt's perceptron (1958). It models a biological neuron that either fires or doesn't. Its zero gradient everywhere makes it incompatible with backpropagation.",
    useCases: [
      "Theoretical explanations of how artificial neurons work.",
      "Binary threshold decisions in non-gradient-based systems.",
    ],
    pitfalls: [
      "Zero gradient everywhere: backpropagation cannot update weights through it.",
      "Cannot represent probabilistic outputs or soft decisions.",
    ],
    quickCheck: "Why can't the binary step function be trained with gradient descent?",
  },
  relu: {
    deeper:
      "ReLU (f(x) = max(0, x)) became the default activation for deep networks because it avoids vanishing gradients for positive inputs and is trivially fast to compute. Its simplicity often outperforms saturating activations.",
    useCases: [
      "Hidden layers of deep neural networks.",
      "Convolutional neural networks (CNNs).",
    ],
    pitfalls: [
      "Dying ReLU: neurons that consistently receive negative inputs produce zero gradient and stop learning entirely.",
    ],
    quickCheck: "What is the 'dying ReLU' problem and which activation functions were designed to address it?",
  },
  "leaky-relu": {
    deeper:
      "Leaky ReLU is f(x) = x if x > 0, ax if x ≤ 0, where a is a small constant (typically 0.01). The non-zero negative slope ensures the gradient never fully vanishes, keeping all neurons trainable.",
    useCases: [
      "Drop-in replacement for ReLU to avoid dying neurons.",
      "Generative Adversarial Networks (GANs).",
    ],
    pitfalls: [
      "The choice of slope 'a' is an additional hyperparameter to tune.",
      "Does not always outperform ReLU — depends on the task.",
    ],
    quickCheck: "How does Leaky ReLU prevent the dying ReLU problem?",
  },
  elu: {
    deeper:
      "ELU (f(x) = x for x>0, a(e^x - 1) for x≤0) pushes mean activations toward zero thanks to its negative tail. This can speed up learning compared to ReLU and Leaky ReLU.",
    useCases: [
      "Hidden layers where faster convergence is desired.",
      "Networks sensitive to the distribution of activations.",
    ],
    pitfalls: [
      "More computationally expensive than ReLU due to the exponential for negative inputs.",
    ],
    quickCheck: "What property of ELU's output helps bring mean activations closer to zero?",
  },
  selu: {
    deeper:
      "SELU (Klambauer et al., 2017) derives its constants (scale ≈ 1.0507, alpha ≈ 1.6733) mathematically so that the output distribution is a fixed point of zero mean and unit variance — enabling self-normalizing neural networks (SNNs).",
    useCases: [
      "Deep feedforward networks as a replacement for batch normalization.",
      "Fully-connected architectures where self-normalization is desired.",
    ],
    pitfalls: [
      "Requires lecun_normal weight initialization to activate the self-normalizing property.",
      "Self-normalization proof applies to fully-connected networks; behavior in CNNs is less guaranteed.",
    ],
    quickCheck: "What initialization scheme is required for SELU's self-normalizing property to hold?",
  },
  prelu: {
    deeper:
      "PReLU (He et al., 2015, introduced with ResNet) makes the negative slope a learnable parameter. Each channel or neuron can learn its own slope via backpropagation, letting the network decide how much signal to pass for negative inputs.",
    useCases: [
      "Deep residual networks.",
      "Image classification where dying ReLU is a concern.",
    ],
    pitfalls: [
      "Adds extra parameters, which can slightly increase overfitting risk.",
      "May need regularization on the slope parameter.",
    ],
    quickCheck: "What makes PReLU different from Leaky ReLU, and when would you prefer one over the other?",
  },
  gelu: {
    deeper:
      "GELU (Hendrycks & Gimpel, 2016) is defined as f(x) = x * Φ(x) where Φ is the standard Gaussian CDF. Intuitively, it randomly zeros inputs with probability proportional to how negative they are, but uses the expectation during inference.",
    useCases: [
      "Transformer models: BERT, GPT, T5, ViT.",
      "Any modern deep learning task where Swish/GELU-family activations are the default.",
    ],
    pitfalls: [
      "More expensive to compute than ReLU (requires tanh approximation or erf).",
      "The tanh approximation differs slightly from the exact form.",
    ],
    quickCheck: "What probabilistic interpretation gives GELU its formulation?",
  },
  swish: {
    deeper:
      "Swish (Ramachandran et al., Google Brain, 2017) was discovered through automated neural architecture search. Its self-gating property — x * sigmoid(x) — allows the function to preserve or suppress the input based on its own magnitude.",
    useCases: [
      "EfficientNet and many modern CNN architectures.",
      "Drop-in replacement for ReLU in deep networks.",
    ],
    pitfalls: [
      "Slightly more computation than ReLU.",
      "Small negative outputs may not suit all architectures or tasks.",
    ],
    quickCheck: "What does 'self-gating' mean in the context of Swish?",
  },
  mish: {
    deeper:
      "Mish (Misra, 2019) is defined as f(x) = x * tanh(softplus(x)). Empirically it showed consistent improvements over ReLU and Swish on image classification and object detection benchmarks, adopted in YOLOv4.",
    useCases: [
      "Object detection models (YOLOv4).",
      "Image classification where marginal accuracy gains matter.",
    ],
    pitfalls: [
      "Computationally expensive: requires softplus then tanh.",
      "Not as widely standardized as GELU or Swish in frameworks.",
    ],
    quickCheck: "How is Mish related to Swish, and what makes it different?",
  },
  hardswish: {
    deeper:
      "Hardswish (Howard et al., MobileNetV3, 2019) replaces the sigmoid in Swish with a hard sigmoid (ReLU6-based piecewise linear), making it compute efficiently on hardware lacking fast exp units.",
    useCases: [
      "MobileNetV3 and other mobile/edge inference architectures.",
      "Deployments where latency and power consumption matter.",
    ],
    pitfalls: [
      "Not differentiable at x = -3 and x = 3 (gradient kinks).",
      "Slight accuracy trade-off compared to the true Swish function.",
    ],
    quickCheck: "Why is Hardswish preferred over Swish for mobile deployment?",
  },
  softmax: {
    deeper:
      "Softmax normalizes a vector of K scores into a probability distribution. The exponential amplifies differences between scores, making the largest score dominate. Combined with cross-entropy loss, the gradient simplifies cleanly during training.",
    useCases: [
      "Output layer for multi-class classification (e.g., ImageNet with 1000 classes).",
    ],
    pitfalls: [
      "Not suitable for hidden layers — only for output.",
      "Numerically unstable with large inputs; stabilized by subtracting max(x) before exponentiating.",
    ],
    quickCheck: "When is Softmax used, and what does its output represent?",
  },
  softplus: {
    deeper:
      "Softplus (f(x) = ln(1 + e^x)) is a smooth everywhere-positive approximation of ReLU. Its derivative is exactly sigmoid(x), connecting the two. It never outputs exactly zero, so no sparse activations occur.",
    useCases: [
      "Smooth differentiable substitute for ReLU.",
      "Probabilistic models where strictly positive outputs are needed.",
    ],
    pitfalls: [
      "Slower than ReLU due to the log and exp computation.",
      "No sparse activations: may slow down inference compared to ReLU.",
    ],
    quickCheck: "What is the derivative of Softplus, and why is that connection significant?",
  },
  softsign: {
    deeper:
      "Softsign (f(x) = x / (1 + |x|)) approximates Tanh with a polynomial rather than exponentials, making it cheaper to compute. Its heavier tails mean gradients persist for larger |x| compared to Tanh.",
    useCases: [
      "Substitute for Tanh in RNNs when gradient flow is a concern.",
      "Tasks where slow saturation and zero-centered outputs are both needed.",
    ],
    pitfalls: [
      "Less commonly used than Tanh in modern practice.",
      "Still saturates asymptotically — gradient does not stay large indefinitely.",
    ],
    quickCheck: "How does Softsign's saturation rate compare to Tanh, and what are the gradient implications?",
  },
  identity: {
    deeper:
      "The identity function (f(x) = x) has a constant gradient of 1. While trivial on its own, it's foundational: it shows why nonlinearity is necessary in deep networks, and it appears implicitly in residual skip connections.",
    useCases: [
      "Output layer for regression tasks (predicting a continuous value).",
      "Skip connections in residual networks implicitly add an identity path.",
    ],
    pitfalls: [
      "A deep network using only identity activations reduces to a single linear transformation.",
      "Cannot learn non-linear decision boundaries.",
    ],
    quickCheck: "Why does a deep network with only identity activations collapse to a single linear layer?",
  },
};

export const CONCEPT_EXPANSIONS = {
  sigmoid: {
    algebraic:
      "f'(x) = f(x)(1 - f(x)), so gradient is maximized at x=0 (value 0.25) and approaches 0 at extremes. Logistic regression uses it as the canonical link function for Bernoulli models.",
    computation:
      "Numerically stable form: for x>=0 use 1/(1+exp(-x)); for x<0 use exp(x)/(1+exp(x)) to avoid overflow.",
    workedExample:
      "For x=2: f(2)=1/(1+e^-2)≈0.88. For x=-2: f(-2)≈0.12. The gradient at both points is ≈0.105, far smaller than the 0.25 maximum at x=0.",
    connections: ["Tanh", "Binary Crossentropy", "LSTM Gates"],
  },
  tanh: {
    algebraic:
      "tanh(x) = 2 sigmoid(2x) - 1. Its derivative is 1 - tanh²(x), maximized at 1 (when x=0). Output range [-1,1] makes it zero-centered unlike sigmoid.",
    computation:
      "Most math libraries provide tanh directly; avoid manual exp implementation for precision. For large |x|, tanh saturates at ±1.",
    workedExample:
      "At x=1: tanh(1)≈0.76, derivative≈0.42. At x=3: tanh(3)≈0.995, derivative≈0.009 — gradient nearly vanishes.",
    connections: ["Sigmoid", "RNN Hidden State", "LSTM Cell"],
  },
  "binary-step": {
    algebraic:
      "Mathematically: f(x) = H(x) where H is the Heaviside step function. Gradient is zero for x≠0 and undefined at x=0. Straight-through estimator is a workaround for discrete gradient problems.",
    computation:
      "Evaluates as a simple sign comparison. Straight-through estimator bypasses non-differentiability by passing gradient through unchanged during backprop.",
    workedExample:
      "Perceptron classifying 'positive if score > 0': f(1.5)=1, f(-0.3)=0. Changing weight by 0.001 produces no gradient signal — optimization impossible.",
    connections: ["Sigmoid (smooth replacement)", "Perceptron", "Quantization"],
  },
  relu: {
    algebraic:
      "f(x) = max(0, x). Gradient: 1 for x>0, 0 for x<0, undefined at x=0 (conventionally 0). Creates piecewise-linear functions when stacked — universal approximators.",
    computation:
      "Implemented as elementwise max(0, x). Dead neuron detection: track fraction of activations that are exactly zero across a forward pass.",
    workedExample:
      "For pre-activations [-2, 0.5, 3]: ReLU outputs [0, 0.5, 3]. Gradient flows only through the 0.5 and 3 units. The -2 unit is dead and receives no weight update.",
    connections: ["Leaky ReLU (dying fix)", "Batch Normalization", "ResNet"],
  },
  "leaky-relu": {
    algebraic:
      "f(x) = x if x>0, αx if x≤0. Gradient: 1 for x>0, α for x≤0. Unlike ReLU, both branches contribute to learning; negative region slope α is typically 0.01.",
    computation:
      "Single elementwise conditional multiply. Slightly more computation than ReLU but prevents zero-gradient regions entirely.",
    workedExample:
      "With α=0.01, input -5 gives output -0.05 instead of 0. Gradient -0.01 flows back, allowing the neuron to recover from negative pre-activations.",
    connections: ["ReLU", "ELU", "PReLU (learned slope)"],
  },
  elu: {
    algebraic:
      "For x<0: f(x) = α(eˣ - 1). Gradient: 1 for x>0, f(x)+α for x<0. The negative tail saturates at -α, providing bounded negative outputs and mean-shift toward zero.",
    computation:
      "Requires exponential computation for negative inputs. Set α=1.0 by default. Check activation distribution per layer to verify reduced mean shift.",
    workedExample:
      "With α=1: input -2 gives ≈-0.865, input 2 gives 2. Mean of [-2,2] after ELU ≈-0.865+2)/2≈0.57 vs ReLU mean of 1.0 — closer to zero.",
    connections: ["Leaky ReLU", "SELU (scaled version)", "Batch Normalization"],
  },
  selu: {
    algebraic:
      "f(x) = λ(x if x>0, α(eˣ-1) if x≤0) with λ≈1.0507, α≈1.6733. These constants are the unique fixed point making a standard normal input map to a standard normal output.",
    computation:
      "Requires lecun_normal init (variance=1/fan_in). Monitor per-layer mean and variance during training to confirm self-normalization is active.",
    workedExample:
      "With lecun_normal init and SELU, a 100-layer MLP maintains activation variance near 1.0 per layer without any explicit normalization — compared to variance explosion or collapse in ReLU.",
    connections: ["ELU", "Layer Normalization", "Deep Networks without BatchNorm"],
  },
  prelu: {
    algebraic:
      "f_i(x) = x if x>0, aᵢx if x≤0 where aᵢ is learned per channel. Gradient w.r.t. aᵢ: x if x<0, 0 otherwise. Gradient w.r.t. x: 1 if x>0, aᵢ if x≤0.",
    computation:
      "Initialize aᵢ=0.25. The learned slope adds one parameter per channel; apply small L2 regularization to prevent slope from growing large.",
    workedExample:
      "After training ResNet-style layers, PReLU slopes may converge to: ~0.05 in early layers (more ReLU-like sparse), ~0.25 in deeper layers (more linear-like), adapting to gradient flow needs.",
    connections: ["Leaky ReLU", "ReLU", "ResNet (original paper)"],
  },
  gelu: {
    algebraic:
      "f(x) = x · Φ(x) where Φ is the standard Gaussian CDF. Approx: x·0.5·(1+tanh(√(2/π)·(x+0.044715x³))). Smooth everywhere; derivative involves both Φ and the Gaussian PDF.",
    computation:
      "Use the tanh approximation for speed, or exact form with erf for precision. Numerically stable on modern hardware via framework implementations.",
    workedExample:
      "GELU(-1)≈-0.16 (passes small negative signal), GELU(0)=0, GELU(1)≈0.84. Compare ReLU: ReLU(-1)=0, ReLU(1)=1 — GELU is smoother at both transitions.",
    connections: ["Swish", "BERT/GPT Architecture", "Transformers"],
  },
  swish: {
    algebraic:
      "f(x) = x · σ(x) = x/(1+e^-x). Derivative: σ(x) + x·σ(x)·(1-σ(x)) = f(x) + σ(x)(1-f(x)). Non-monotonic: minimum near x≈-1.28 where f(-1.28)≈-0.279.",
    computation:
      "Single fused operation: multiply input by its own sigmoid. Equivalent to SiLU in PyTorch. Slightly more compute than ReLU but hardware-accelerated in modern frameworks.",
    workedExample:
      "Swish(2)=2·0.88≈1.76, Swish(-1)=-1·0.27≈-0.27, Swish(0)=0. The small negative output at x=-1 allows gradient flow unlike ReLU where it would be exactly 0.",
    connections: ["GELU", "EfficientNet", "Neural Architecture Search"],
  },
  mish: {
    algebraic:
      "f(x) = x·tanh(ln(1+eˣ)) = x·tanh(softplus(x)). Derivative involves both the value and the derivative of tanh composed with softplus. Minimum near x≈-0.31 giving f≈-0.31.",
    computation:
      "Two-step evaluation: softplus(x)=ln(1+eˣ), then tanh, then multiply by x. More expensive than Swish but often gives higher task accuracy for the compute cost.",
    workedExample:
      "Mish(2)≈1.944 vs Swish(2)≈1.762: Mish has slightly higher output for positive values. On COCO detection, YOLOv4 reports 2-3% mAP improvement over Leaky ReLU with Mish.",
    connections: ["Swish", "Softplus", "YOLOv4"],
  },
  hardswish: {
    algebraic:
      "f(x) = 0 (x≤-3), x(x+3)/6 (-3<x<3), x (x≥3). Hard sigmoid replaces σ(x) in Swish with ReLU6(x+3)/6. Gradient: 0 (x<-3), (2x+3)/6 (-3≤x≤3), 1 (x>3).",
    computation:
      "Pure integer/fixed-point arithmetic: no exponentials or logs. Implementable with one addition, one clamp, and one multiply — critical for DSPs and mobile NPUs.",
    workedExample:
      "For x=1: Hardswish(1)=1·4/6≈0.667, Swish(1)≈0.731. The 9% difference is often acceptable given 3-5x speedup on mobile hardware lacking exp units.",
    connections: ["Swish", "MobileNetV3", "Edge Inference"],
  },
  softmax: {
    algebraic:
      "p_i = exp(z_i)/Σ_j exp(z_j). Jacobian: ∂p_i/∂z_j = p_i(δ_ij - p_j). Combined with cross-entropy, gradient simplifies to (p_i - y_i) — the cleanest loss gradient in neural networks.",
    computation:
      "Numerically stable: subtract max(z) before exponentiation. log-softmax avoids exp+log round-trip. For large vocabularies (LLMs), softmax is a major memory/compute bottleneck.",
    workedExample:
      "Logits [3, 1, 0.2]: softmax ≈ [0.84, 0.11, 0.05]. If true class is first (logit 3), CE loss = -log(0.84) ≈ 0.17. Small logit gaps dramatically affect probability mass.",
    connections: ["Cross-Entropy Loss", "Temperature Scaling", "Attention Mechanism"],
  },
  softplus: {
    algebraic:
      "f(x) = ln(1+eˣ). Derivative: f'(x) = eˣ/(1+eˣ) = σ(x). This exact sigmoid derivative relationship makes softplus the log-partition function for the Bernoulli family.",
    computation:
      "Numerically stable form: for large x, softplus(x)≈x; for small x, softplus(x)≈eˣ. Avoid naive log(1+exp(x)) which overflows for x>709.",
    workedExample:
      "Softplus(0)=ln(2)≈0.693, Softplus(5)≈5.007, Softplus(-5)≈0.0067. The smooth approximation to ReLU means the transition from ~0 to ~x happens over a range of ~6 units.",
    connections: ["ReLU (hard version)", "Sigmoid (derivative)", "Mish"],
  },
  softsign: {
    algebraic:
      "f(x) = x/(1+|x|). Derivative: 1/(1+|x|)². Unlike tanh, approaches limits polynomially (1/x rate) rather than exponentially, giving heavier tails and slower saturation.",
    computation:
      "No exponentials needed — one abs, one add, one divide. Faster than tanh. For large |x|: softsign(100)≈0.99 vs tanh(100)≈1.0 — gradient difference is significant at moderate x.",
    workedExample:
      "At x=5: softsign(5)≈0.833, tanh(5)≈0.9999. Gradient of softsign: 1/36≈0.028; gradient of tanh: ≈8·10⁻⁵. Softsign preserves ≈350× more gradient at this point.",
    connections: ["Tanh", "RNN Gradient Flow", "Bounded Activations"],
  },
  identity: {
    algebraic:
      "f(x)=x, f'(x)=1 everywhere. A stack of n linear layers W_n·...·W_1·x is equivalent to a single layer (W_n·...·W_1)·x — demonstrating why nonlinearity is necessary for depth to matter.",
    computation:
      "Zero compute overhead. In residual networks: output = F(x) + x uses identity for the skip path. The identity path allows gradients to flow unchanged through the skip connection.",
    workedExample:
      "Two linear layers [3×3, 3×3] without activation: effectively one 3×3 linear layer. Add one ReLU in between, and the pair can represent piecewise-linear maps with up to 3 regions per output.",
    connections: ["Residual Connections", "Linear Models", "Depth and Nonlinearity"],
  },
};
