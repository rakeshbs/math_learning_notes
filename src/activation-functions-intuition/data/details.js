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

export const CONCEPT_EXPANSIONS = {};
