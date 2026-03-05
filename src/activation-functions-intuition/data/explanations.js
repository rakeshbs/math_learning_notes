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
      "Sigmoid is the 2-class special case of softmax — binary cross-entropy loss arises directly from its log-odds formulation",
    ],
    formula: "f(x) = 1 / (1 + e^(-x))",
    deepDive: [
      "The sigmoid function is the logistic function from statistics, where it models the probability of a binary outcome given a log-odds input. Its derivative has the elegant closed form σ'(x) = σ(x)(1 − σ(x)), which means once you have computed the forward pass, the backward pass is nearly free. However, for |x| > 5, σ(x) ≈ 0 or 1 and σ'(x) ≈ 0, creating the vanishing gradient problem that plagued early deep networks.",
      "The vanishing gradient occurs because each layer in a deep network multiplies its gradient by σ'(x) ∈ [0, 0.25]. After k layers, the gradient is scaled by at most 0.25^k — for k = 10 layers this is less than 10^{-6}. This is why sigmoid was largely abandoned for hidden layers in favor of ReLU-family activations, though it remains standard for output layers in binary classification and as gates in recurrent architectures.",
      "$$\\\\sigma'(x) = \\\\sigma(x)\\\\bigl(1 - \\\\sigma(x)\\\\bigr) \\\\leq \\\\frac{1}{4}$$",
    ],
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
      "Tanh(x) = 2σ(2x) − 1, so it is a scaled, shifted sigmoid — the two share identical saturation dynamics",
    ],
    formula: "f(x) = (e^x - e^(-x)) / (e^x + e^(-x))",
    deepDive: [
      "The zero-centered property of tanh matters because when all activations are positive (as with sigmoid), the gradient of a weight matrix in a layer is either all positive or all negative — determined by the sign of the upstream gradient. This forces zig-zagging updates in weight space and slows convergence. Tanh activations, which are both positive and negative, allow gradients to cancel within a batch, removing this systematic bias.",
      "Tanh's derivative is tanh'(x) = 1 − tanh²(x), achieving a maximum of 1 at x = 0 compared to sigmoid's maximum of 0.25. This means gradients stay four times larger near zero before saturating. The saturation still occurs for |x| > 3 where tanh'(x) < 0.01, but the stronger gradients near zero give tanh a practical advantage over sigmoid in shallow networks.",
      "$$\\\\tanh'(x) = 1 - \\\\tanh^2(x), \\\\quad \\\\max_{x} \\\\tanh'(x) = 1$$",
    ],
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
      "Straight-through estimators approximate binary-step gradients by treating the function as identity during the backward pass",
    ],
    formula: "f(x) = 0 if x < 0, else 1",
    deepDive: [
      "The binary step function implements the McCulloch-Pitts neuron (1943): a unit fires if and only if its weighted input exceeds a threshold. While this captures the all-or-nothing nature of biological action potentials, the zero derivative everywhere makes weight learning via calculus impossible. The perceptron learning rule circumvents this by directly adjusting weights based on classification error, bypassing gradients entirely — it works only for linearly separable data.",
      "Modern use of binary activations appears in binary neural networks (BNNs), where both weights and activations are constrained to ±1. Inference in BNNs replaces floating-point multiply-accumulate with XNOR-popcount operations, achieving ~32x speedup on CPUs. The straight-through estimator (STE) trains BNNs by passing gradients through the binary step as if it were the identity: ∂L/∂x ≈ ∂L/∂f · 1_{|x|≤1}.",
      "$$f(x) = \\\\mathbb{1}[x \\\\geq 0] = \\\\begin{cases} 0 & x < 0 \\\\\\\\ 1 & x \\\\geq 0 \\\\end{cases}$$",
    ],
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
      "In practice, roughly 50% of ReLU activations are zero for any given input — this sparsity is linked to improved generalization",
    ],
    formula: "f(x) = max(0, x)",
    deepDive: [
      "ReLU's theoretical advantage over sigmoid comes from its non-saturating nature for positive inputs: the gradient is exactly 1 regardless of the input magnitude, so gradients do not shrink as they propagate through many layers with positive pre-activations. This is the primary reason deep networks became trainable after the introduction of ReLU in the deep learning context (Nair & Hinton, 2010; Krizhevsky et al., 2012 AlexNet).",
      "The dying ReLU problem occurs when a neuron's pre-activation is consistently negative across all training examples, causing the gradient to be zero and preventing any weight update. This can happen after a large negative weight update. Once dead, a ReLU neuron stays dead for the remainder of training. The fix — using Leaky ReLU, ELU, or careful initialization — ensures the negative regime always has some gradient signal.",
      "$$\\\\frac{d}{dx}\\\\max(0,x) = \\\\begin{cases} 0 & x < 0 \\\\\\\\ 1 & x > 0 \\\\end{cases}$$",
    ],
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
      "Randomized Leaky ReLU (RReLU) samples the slope from a uniform distribution during training, adding stochastic regularization",
    ],
    formula: "f(x) = x if x > 0, else a*x  (a ≈ 0.01)",
    deepDive: [
      "Leaky ReLU's gradient is a piecewise constant: 1 for x > 0 and a (typically 0.01) for x < 0. This guarantees that no neuron is permanently dead — even deeply negative pre-activations produce a non-zero gradient that can pull the weights back toward positive territory. The tradeoff is that negative activations are no longer exactly zero, losing the sparsity benefit of standard ReLU.",
      "In Generative Adversarial Networks (GANs), the discriminator often benefits from Leaky ReLU because the generator needs gradient signal flowing through all discriminator neurons. A dying ReLU in the discriminator creates regions of constant zero gradient with respect to generator parameters, stalling generator training. The DCGAN architecture (Radford et al., 2015) standardized Leaky ReLU with slope 0.2 in the discriminator as a practical recipe.",
      "$$f(x) = \\\\max(ax, x) = \\\\begin{cases} x & x > 0 \\\\\\\\ ax & x \\\\leq 0 \\\\end{cases}, \\\\quad a \\\\approx 0.01$$",
    ],
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
      "ELU's saturation toward −α provides a soft lower bound on activations, stabilizing mean activations without batch normalization",
    ],
    formula: "f(x) = x if x > 0, else a*(e^x - 1)",
    deepDive: [
      "ELU (Clevert et al., 2015) was designed to push mean activations toward zero while maintaining the non-saturating property for positive inputs. The key insight is that saturating negative activations at −α acts like a soft bias correction: neurons that receive large negative inputs contribute a small but consistent negative signal (−α) rather than zero (ReLU) or a proportionally large negative value (Leaky ReLU). This narrower spread of activations reduces the internal covariate shift problem that batch normalization addresses.",
      "The smooth transition at x = 0 (ELU is everywhere differentiable, unlike ReLU) means the gradient is continuous: for x > 0 it is 1; for x ≤ 0 it is α e^x, which equals α at x = 0 and approaches 0 as x → −∞. The saturation at −α for very negative inputs means deeply inactive neurons contribute a bounded, non-zero gradient, unlike Leaky ReLU which grows linearly negative. This saturation is both ELU's strength (bounded negative outputs) and weakness (vanishing gradient for very negative inputs).",
      "$$f'(x) = \\\\begin{cases} 1 & x > 0 \\\\\\\\ \\\\alpha e^x = f(x) + \\\\alpha & x \\\\leq 0 \\\\end{cases}$$",
    ],
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
      "Self-normalization is proven by mean/variance fixed-point analysis showing that activation statistics contract toward (0, 1) with each layer",
    ],
    formula: "f(x) = scale*(x if x>0, else alpha*(e^x - 1));  scale≈1.0507, alpha≈1.6733",
    deepDive: [
      "The constants α ≈ 1.6733 and λ ≈ 1.0507 in SELU are not empirically tuned — they are derived analytically by requiring that the map from (mean, variance) to (mean', variance') under the SELU activation has a stable fixed point at (0, 1). Klambauer et al. (2017) proved that if inputs have mean 0 and variance 1, the SELU outputs also have mean 0 and variance 1, and moreover, perturbations from this fixed point contract over layers, guaranteeing convergence to normalized activations in expectation.",
      "The self-normalization theorem requires three conditions: SELU activation, lecun_normal weight initialization (weights drawn from a truncated normal with variance 1/fan_in), and no architectural elements that break normalization (like skip connections or attention without careful scaling). When all three hold, SELU networks provably normalize through depth without any explicit normalization layer — a mathematically elegant alternative to batch normalization, though less universally applicable.",
      "$$\\\\text{SELU}(x) = \\\\lambda \\\\begin{cases} x & x > 0 \\\\\\\\ \\\\alpha(e^x - 1) & x \\\\leq 0 \\\\end{cases}, \\\\quad \\\\lambda \\\\approx 1.0507,\\; \\\\alpha \\\\approx 1.6733$$",
    ],
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
      "Per-channel PReLU shares one slope across all spatial positions in a feature map, balancing expressivity with parameter count",
    ],
    formula: "f(x) = x if x > 0, else a*x  (a is learned)",
    deepDive: [
      "PReLU (He et al., 2015) adds one parameter per neuron (or per channel in convolutional layers) with gradient ∂L/∂a = Σ_{x_i < 0} (∂L/∂f_i) · x_i. The parameter a is typically initialized to 0.25 and updated by gradient descent along with all other weights. If a converges to 0 the neuron behaves like ReLU; if a converges to 1 it becomes linear; negative values of a create non-monotonic behavior. This flexibility let PReLU achieve state-of-the-art ImageNet results in 2015.",
      "Per-channel PReLU in convolutional networks shares one slope parameter across all spatial locations of a feature map. A layer with C output channels has exactly C extra parameters from PReLU, which is negligible compared to the convolutional filter weights. This design respects the translational equivariance of convolution — the same slope is applied at every spatial position — while still allowing each feature detector to specialize its negative-slope behavior.",
      "$$\\\\frac{\\\\partial L}{\\\\partial a_i} = \\\\sum_{x_i < 0} \\\\frac{\\\\partial L}{\\\\partial f(x_i)} \\\\cdot x_i$$",
    ],
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
      "GELU(x) = x · Φ(x) where Φ is the Gaussian CDF — each unit is stochastically gated with probability Φ(x)",
    ],
    formula: "f(x) ≈ 0.5x(1 + tanh(√(2/π)(x + 0.044715x³)))",
    deepDive: [
      "The exact GELU is x · Φ(x) where Φ is the standard Gaussian CDF. The intuition is stochastic: imagine randomly dropping inputs with probability 1 − Φ(x) (higher dropout for more negative values). Taking the expectation of this stochastic process gives exactly GELU(x). Unlike dropout, GELU applies this gate deterministically during both training and inference, but the Gaussian CDF shape encodes the same 'inputs further from zero are more likely to pass' idea.",
      "The tanh approximation 0.5x(1 + tanh(√(2/π)(x + 0.044715x³))) is nearly indistinguishable from the exact formula for all practical inputs and avoids computing the error function erf. GELU's non-monotonicity (it has a global minimum near x ≈ −0.17) means it is not a monotone function, unlike ReLU or ELU. This is important because many classical neural network theorems assume monotone activations, yet GELU empirically outperforms them in transformer architectures.",
      "$$\\\\text{GELU}(x) = x \\\\cdot \\\\Phi(x) = x \\\\cdot \\\\frac{1}{2}\\\\left[1 + \\\\text{erf}\\\\!\\\\left(\\\\frac{x}{\\\\sqrt{2}}\\\\right)\\\\right]$$",
    ],
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
      "Unlike ReLU, Swish has a global minimum near x ≈ −1.28, and its non-monotonicity is linked to better gradient flow in deep networks",
    ],
    formula: "f(x) = x * sigmoid(x) = x / (1 + e^(-x))",
    deepDive: [
      "Swish (Ramachandran et al., 2017) was discovered by searching over a space of activation function compositions using reinforcement learning and evolutionary strategies on benchmark tasks. The form x·σ(x) emerged as a top performer. Unlike most activations that are designed from first principles, Swish is the result of empirical search — yet it has the elegant self-gating interpretation where σ(x) continuously interpolates between ignoring the input (σ→0) and passing it through (σ→1).",
      "The derivative of Swish is f'(x) = σ(x) + x·σ(x)(1−σ(x)) = f(x)/x + σ(x)(1−f(x)/x). At x = 0, f'(0) = 0.5, which is the same as GELU. For large positive x, f'(x) → 1 (like ReLU). For large negative x, f'(x) → 0, but Swish does not die like ReLU because the function value is bounded below (minimum ≈ −0.28 at x ≈ −1.28) rather than exactly zero, maintaining a small gradient signal even in the highly negative regime.",
      "$$f'(x) = \\\\sigma(x) + x\\\\,\\\\sigma(x)\\\\bigl(1-\\\\sigma(x)\\\\bigr) = f(x) + \\\\sigma(x)\\\\bigl(1-f(x)\\\\bigr)$$",
    ],
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
      "Mish uses tanh as its gating nonlinearity (vs Swish's sigmoid), producing a deeper negative dip and stronger implicit regularization",
    ],
    formula: "f(x) = x * tanh(softplus(x)) = x * tanh(ln(1 + e^x))",
    deepDive: [
      "Mish (Misra, 2019) combines three functions: softplus (smooth ReLU), tanh (bounded squashing), and linear identity. The composition x·tanh(softplus(x)) is everywhere infinitely differentiable. Near x = 0: softplus(0) = ln 2 ≈ 0.693, tanh(ln 2) ≈ 0.604, so Mish(0) = 0. The global minimum is approximately −0.31 at x ≈ −0.31. Unlike Swish where the gate is σ(x) ∈ (0,1), Mish's gate tanh(softplus(x)) ∈ (−1,1) technically but stays in (0,1) for finite x since softplus > 0.",
      "The practical advantage of Mish over Swish appears most strongly in object detection networks (YOLOv4 used Mish throughout the backbone). The deeper negative dip (−0.31 vs −0.28 for Swish) may provide stronger gradient regularization near x = 0. Computing Mish requires evaluating softplus and tanh — more expensive than Swish's sigmoid, but the extra cost is often justified by accuracy gains in vision tasks.",
      "$$\\\\text{Mish}(x) = x \\\\cdot \\\\tanh\\\\!\\\\left(\\\\ln(1+e^x)\\\\right), \\\\quad \\\\min_x \\\\text{Mish}(x) \\\\approx -0.31$$",
    ],
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
      "Hardswish exactly agrees with Swish at x = −3, 0, and 3, ensuring tight piecewise-linear bounding with only arithmetic operations",
    ],
    formula: "f(x) = 0 if x≤-3,  x*(x+3)/6 if -3<x<3,  x if x≥3",
    deepDive: [
      "Hardswish approximates Swish by replacing σ(x) with the piecewise-linear function ReLU6(x+3)/6, where ReLU6(t) = min(max(0,t), 6). The result is x·ReLU6(x+3)/6, which uses only addition, multiplication, and clamping — operations that map to single instructions on integer or fixed-point hardware. On ARM processors with NEON SIMD, this replaces the expensive exp() call in sigmoid, achieving 2-3x speedup in the activation computation.",
      "MobileNetV3 (Howard et al., 2019) introduced Hardswish and showed it matches Swish accuracy while enabling efficient deployment on mobile CPUs. The approximation error |Hardswish(x) − Swish(x)| is bounded by approximately 0.004 for all x, making it virtually indistinguishable in practice. Hardswish is applied only in the latter half of MobileNetV3 (where feature maps are smaller) since the savings are more significant when the activation is applied to fewer elements.",
      "$$f(x) = x \\\\cdot \\\\frac{\\\\text{ReLU6}(x+3)}{6} = \\\\begin{cases} 0 & x \\\\leq -3 \\\\\\\\ x\\\\tfrac{x+3}{6} & -3 < x < 3 \\\\\\\\ x & x \\\\geq 3 \\\\end{cases}$$",
    ],
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
      "Temperature scaling divides logits by T before softmax: T→0 approaches argmax, T→∞ approaches uniform — essential for calibrated confidence",
    ],
    formula: "f(x_i) = e^(x_i) / Σ_j e^(x_j)",
    deepDive: [
      "The Jacobian of the softmax function has the closed form ∂f_i/∂x_j = f_i(δ_{ij} − f_j), where δ_{ij} is the Kronecker delta. This compact form reveals that the derivative of output i with respect to input j depends on both the output probabilities, not just the inputs directly. In practice, the Jacobian is never formed explicitly — the vector-Jacobian product ∂L/∂x = f ⊙ (∂L/∂f) − f·(f^T · ∂L/∂f) is computed directly, which is O(n) rather than O(n²).",
      "Numerical stability requires the log-sum-exp trick: instead of computing e^{x_i} / Σ e^{x_j}, subtract the maximum first: e^{x_i - max} / Σ e^{x_j - max}. This prevents overflow (e^{1000} is infinite in float32) without changing the result, since dividing numerator and denominator by e^{max} cancels. The cross-entropy loss log(softmax(x))_i = x_i − log(Σ e^{x_j}) is computed directly from logits for numerical stability, avoiding the intermediate softmax computation.",
      "$$\\\\frac{\\\\partial f_i}{\\\\partial x_j} = f_i(\\\\delta_{ij} - f_j)$$",
    ],
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
      "Softplus = log(1 + e^x) = log-sum-exp(0, x), linking it directly to the log-partition function in energy-based models",
    ],
    formula: "f(x) = ln(1 + e^x)",
    deepDive: [
      "The softplus function is the antiderivative of the sigmoid: d/dx ln(1 + e^x) = e^x/(1 + e^x) = σ(x). This means softplus and sigmoid are paired in the same way that ReLU and the unit step function are paired (d/dx max(0,x) = 1_{x>0}). The softplus is always strictly positive and grows linearly for large x (softplus(x) ≈ x for x >> 0) but approaches 0 exponentially for x << 0.",
      "In probabilistic models, softplus appears naturally as the log-partition function of the Bernoulli distribution: log(1 + e^x) = log Z where Z = 1 + e^x is the partition function. It also serves as a smooth parameterization for positive-valued outputs: if you need a neural network to output a positive quantity (variance, scale, rate), applying softplus to an unconstrained output is a smooth, numerically well-behaved alternative to exp(). For very negative inputs, softplus(x) ≈ e^x, so the numerical trick softplus(x) = x + log(1 + e^{-x}) avoids overflow for large positive x.",
      "$$\\\\frac{d}{dx}\\\\ln(1+e^x) = \\\\frac{e^x}{1+e^x} = \\\\sigma(x)$$",
    ],
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
      "Softsign saturates polynomially (∼1 − 1/|x|) rather than exponentially, giving substantially better gradient flow for inputs in |x| ∈ [1, 10]",
    ],
    formula: "f(x) = x / (1 + |x|)",
    deepDive: [
      "Softsign's derivative is f'(x) = 1/(1+|x|)², which decays polynomially as |x| → ∞. Contrast this with tanh'(x) = 1 − tanh²(x) ≈ 4e^{-2|x|}, which decays exponentially. For |x| = 5, tanh'(5) ≈ 10^{-4} while softsign'(5) = 1/36 ≈ 0.028 — about 280 times larger. This polynomial saturation is the defining characteristic of softsign: gradients are significantly larger in the moderate |x| regime, where many activations sit during typical training.",
      "Softsign requires no exponential computation (unlike tanh, sigmoid, or ELU), making it fast on hardware. The function is the logistic map in disguise: softsign(x) = 2σ(2x) − 1 relates it to sigmoid (where x is scaled), but the direct formula x/(1+|x|) avoids any exponential. Historically, Glorot & Bengio (2010) found softsign competitive with tanh on several NLP tasks, though it has since been superseded by ReLU-family activations for most applications.",
      "$$f'(x) = \\\\frac{1}{(1+|x|)^2} \\\\gg \\\\tanh'(x) \\\\text{ for } |x| \\\\gg 1$$",
    ],
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
      "ResNet's residual connections are identity shortcuts that let gradients flow unimpeded — this is why very deep networks became trainable",
    ],
    formula: "f(x) = x",
    deepDive: [
      "The collapse theorem for linear networks: if every activation in a deep network is the identity, then the entire network computes an affine function of the input, regardless of depth. A composition of affine maps W_k(W_{k-1}(⋯W_1 x + b_1)⋯) + b_k is equivalent to a single affine map W x + b where W = W_k ⋯ W_1. This fundamental theorem explains why nonlinearity is the essential ingredient for expressivity in deep networks.",
      "Despite this collapse, linear activations are essential in specific contexts. Regression output layers use identity to produce unbounded real-valued predictions. Linear projection layers in attention mechanisms (Q, K, V projections) use identity within the linear algebra of dot-product attention. Residual connections in ResNets add the input directly to the transformed output: y = F(x) + x, where the '+x' is an identity path. This identity shortcut lets gradients flow directly from the loss to early layers without passing through any activation nonlinearity, solving the degradation problem in very deep networks.",
      "$$\\\\frac{\\\\partial}{\\\\partial x}(Wx + b) = W, \\\\quad \\\\text{so } \\\\frac{\\\\partial L}{\\\\partial x} = W^\\\\top \\\\frac{\\\\partial L}{\\\\partial y}$$",
    ],
  },
};
