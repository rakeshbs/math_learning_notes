export const EXPLANATIONS = {
  sigmoid: {
    what: "The Sigmoid function maps any real-valued number to a value between 0 and 1. It's useful for binary classification problems where the output can be interpreted as a probability.",
    visual:
      "The S-shaped curve compresses all inputs into (0, 1). Very negative inputs flatten near 0, very positive inputs flatten near 1, and the steepest transition happens around x = 0.",
    intuition: [
      "Output is always between 0 and 1, interpretable as a probability",
      "The gradient is largest at x = 0 and vanishes for large |x|",
      "Not zero-centered: outputs are always positive",
      "Used as a gating mechanism in LSTMs and GRUs",
    ],
    formula: "f(x) = 1 / (1 + e^(-x))",
  },
  tanh: {
    what: "The Tanh function is similar to Sigmoid but maps inputs to a range between -1 and 1. Its zero-centered output can lead to faster convergence during training.",
    visual:
      "Similar S-shape to Sigmoid but stretched vertically to span (-1, 1). Negative inputs map to negative outputs, making it symmetric around the origin.",
    intuition: [
      "Zero-centered output helps gradients flow more symmetrically",
      "Stronger gradients than Sigmoid near zero",
      "Still suffers vanishing gradients for large |x|",
      "Often preferred over Sigmoid for hidden layers",
    ],
    formula: "f(x) = (e^x - e^(-x)) / (e^x + e^(-x))",
  },
  "binary-step": {
    what: "The original perceptron activation: outputs 0 for negative inputs and 1 for non-negative inputs. A hard threshold that either fires or doesn't.",
    visual:
      "A flat line at 0 for all negative x, then an instantaneous jump to 1 at x = 0, then a flat line at 1 forever. No gradual transition.",
    intuition: [
      "Hard decision boundary: the neuron either fires or it doesn't",
      "Gradient is 0 everywhere — backpropagation cannot work",
      "Historical origin of neural networks (Rosenblatt perceptron, 1958)",
      "Replaced by sigmoid to enable gradient-based learning",
    ],
    formula: "f(x) = 0 if x < 0, else 1",
  },
  relu: {
    what: "ReLU outputs the input directly if positive; otherwise outputs zero. It's computationally efficient and helps alleviate the vanishing gradient problem for positive inputs.",
    visual:
      "A flat line at 0 for negative inputs, then a 45-degree ramp for positive inputs. The kink at the origin is where the gradient switches from 0 to 1.",
    intuition: [
      "Gradient is 1 for positive inputs — no vanishing gradient",
      "Gradient is 0 for negative inputs — neurons can 'die'",
      "Sparse activation: many neurons output exactly 0",
      "Fast to compute: just a max(0, x) operation",
    ],
    formula: "f(x) = max(0, x)",
  },
  "leaky-relu": {
    what: "Leaky ReLU introduces a small, non-zero slope for negative inputs, preventing neurons from becoming completely inactive (the 'dying ReLU' problem).",
    visual:
      "Like ReLU but with a shallow negative slope (typically 0.01) for x < 0 instead of flat zero. The gradient never truly vanishes.",
    intuition: [
      "Small negative slope keeps neurons alive during training",
      "Gradient is always non-zero, preventing dead neurons",
      "The slope 'a' is a hyperparameter (commonly 0.01)",
      "Often used in GANs where dying ReLU is problematic",
    ],
    formula: "f(x) = x if x > 0, else a*x  (a ≈ 0.01)",
  },
  elu: {
    what: "ELU uses an exponential curve for negative inputs, producing negative outputs that help bring mean activations closer to zero and can speed up learning.",
    visual:
      "Positive side is identical to ReLU. Negative side curves smoothly toward -a rather than being flat or linear, making the transition smooth.",
    intuition: [
      "Smooth gradient everywhere, including near zero",
      "Negative outputs push mean activations toward zero",
      "Potentially faster convergence than ReLU",
      "More expensive to compute due to the exponential",
    ],
    formula: "f(x) = x if x > 0, else a*(e^x - 1)",
  },
  selu: {
    what: "SELU is a scaled version of ELU with carefully chosen constants that enable self-normalizing neural networks — deep networks that maintain zero mean and unit variance without batch normalization.",
    visual:
      "Same shape as ELU but the positive slope is slightly above 1 (≈ 1.05) and the negative exponential tail is scaled to mathematically guarantee zero mean and unit variance.",
    intuition: [
      "Self-normalizing: outputs converge to zero mean, unit variance",
      "Positive slope > 1 compensates for the negative tail",
      "Eliminates need for batch normalization in some architectures",
      "Requires lecun_normal initialization to work correctly",
    ],
    formula: "f(x) = scale*(x if x>0, else alpha*(e^x - 1));  scale≈1.0507, alpha≈1.6733",
  },
  prelu: {
    what: "Parametric ReLU is like Leaky ReLU but the negative slope 'a' is a learned parameter, allowing the network to discover the optimal slope for each neuron during training.",
    visual:
      "Same shape as Leaky ReLU — positive ramp for x > 0, smaller slope for x < 0 — but the negative slope adapts per neuron during backpropagation.",
    intuition: [
      "Learned slope adapts to the data distribution",
      "Can learn slope = 0 (ReLU) or slope = 1 (identity)",
      "One extra learnable parameter per neuron or channel",
      "Addresses dying ReLU without manual hyperparameter tuning",
    ],
    formula: "f(x) = x if x > 0, else a*x  (a is learned)",
  },
  gelu: {
    what: "GELU weights each input by its probability under a standard Gaussian distribution, creating a smooth, stochastic-inspired activation that is the default in modern transformers.",
    visual:
      "Smooth curve resembling ReLU but with a small negative dip around x ≈ -0.17 before rising. No sharp kink — differentiable everywhere.",
    intuition: [
      "Smooth and differentiable everywhere, including at zero",
      "Slight negative outputs near zero act as a soft regularizer",
      "Default activation in BERT, GPT, ViT, and most modern models",
      "Combines ideas from dropout and ReLU into one function",
    ],
    formula: "f(x) ≈ 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))",
  },
  swish: {
    what: "Swish (also called SiLU) multiplies the input by its sigmoid, creating a smooth non-monotonic function that empirically outperforms ReLU on many deep learning tasks.",
    visual:
      "Similar to GELU: smooth curve with a small negative dip near x ≈ -1.28 before rising. Unbounded above, bounded below by a small negative value.",
    intuition: [
      "Self-gating: the input acts as its own gate via sigmoid",
      "Non-monotonic: allows small negative outputs for negative inputs",
      "Unbounded above (like ReLU), bounded below",
      "Discovered by Google Brain via neural architecture search",
    ],
    formula: "f(x) = x * sigmoid(x) = x / (1 + e^(-x))",
  },
  mish: {
    what: "Mish is a smooth, self-regularized non-monotonic activation that applies tanh to the softplus of the input, often beating Swish and ReLU on vision tasks.",
    visual:
      "Very similar shape to Swish: smooth curve allowing small negatives near x ≈ -0.31, then rising unboundedly. Slightly different curvature compared to Swish.",
    intuition: [
      "Smooth and continuously differentiable everywhere",
      "Bounded below, unbounded above",
      "Small negative activations help implicit regularization",
      "Strong performance on object detection (used in YOLOv4)",
    ],
    formula: "f(x) = x * tanh(softplus(x)) = x * tanh(ln(1 + e^x))",
  },
  hardswish: {
    what: "Hardswish is a piecewise-linear approximation of Swish designed for fast inference on mobile/edge devices where computing the sigmoid exponential is expensive.",
    visual:
      "Three linear pieces: flat at 0 for x ≤ -3, a linear ramp x*(x+3)/6 between -3 and 3, then slope-1 line for x ≥ 3. Looks like a linearized Swish.",
    intuition: [
      "Approximates Swish using only multiplications and additions",
      "No exponential computation — hardware-friendly",
      "Used in MobileNetV3 for mobile inference efficiency",
      "Slight accuracy gap vs Swish, but much faster on-device",
    ],
    formula: "f(x) = 0 if x≤-3,  x*(x+3)/6 if -3<x<3,  x if x≥3",
  },
  softmax: {
    what: "Softmax converts a vector of raw scores into a probability distribution over multiple classes, ensuring all outputs are positive and sum to 1.",
    visual:
      "Each class score is exponentiated (making it positive), then divided by the sum of all exponentiated scores. Higher scores get disproportionately larger probabilities.",
    intuition: [
      "Outputs always sum to 1 — a valid probability distribution",
      "Amplifies differences: the highest score dominates",
      "Used only at the output layer for multi-class classification",
      "Combined with cross-entropy loss for numerically stable training",
    ],
    formula: "f(x_i) = e^(x_i) / Σ_j e^(x_j)",
  },
  softplus: {
    what: "Softplus is a smooth approximation of ReLU that is always positive and differentiable everywhere including at zero. Its derivative is the sigmoid function.",
    visual:
      "Looks like a smooth ReLU without the sharp kink at the origin. Asymptotes toward 0 for very negative x and grows approximately linearly for large positive x.",
    intuition: [
      "Smooth everywhere: gradient equals sigmoid(x)",
      "Always strictly positive: no dead neurons",
      "Slower to compute than ReLU due to the logarithm",
      "No sparse activations since outputs are never exactly zero",
    ],
    formula: "f(x) = ln(1 + e^x)",
  },
  softsign: {
    what: "Softsign is a smooth bounded activation between -1 and 1, similar to Tanh but with heavier tails that saturate more slowly, preserving gradients for larger inputs.",
    visual:
      "Symmetric S-like curve through the origin bounded in (-1, 1), but flatter than Tanh — it reaches ±1 much more slowly as |x| grows.",
    intuition: [
      "Zero-centered output, like Tanh",
      "Heavier tails: gradients vanish more slowly than Tanh",
      "Computationally cheaper than Tanh (no exponential needed)",
      "Useful when you want bounded outputs with better gradient flow",
    ],
    formula: "f(x) = x / (1 + |x|)",
  },
  identity: {
    what: "The identity (linear) activation simply passes the input through unchanged. Essential for regression output layers and for understanding why nonlinearity is needed in deep networks.",
    visual:
      "A straight 45-degree line through the origin. No saturation, no nonlinearity, no clipping. Output always equals input.",
    intuition: [
      "No nonlinearity: stacking linear layers collapses to one linear layer",
      "Gradient is always exactly 1 everywhere",
      "Essential for regression output layers",
      "Skip connections (residual networks) implicitly use identity paths",
    ],
    formula: "f(x) = x",
  },
};
