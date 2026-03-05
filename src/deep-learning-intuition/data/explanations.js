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
    deepDive: [
      "A single perceptron partitions its input space with a hyperplane defined by the weight vector w and bias b. The output side of the hyperplane where w^T x + b > 0 is classified as the positive class. This geometric view reveals why a single perceptron cannot solve XOR: the two classes are not linearly separable, and no single hyperplane can carve the input space to isolate them correctly.",
      "$$a = \\phi\\!\\left(\\mathbf{w}^\\top \\mathbf{x} + b\\right) = \\phi\\!\\left(\\sum_{i=1}^{n} w_i x_i + b\\right)$$",
      "Stacking perceptrons into layers overcomes this limitation. By composing multiple affine transformations with nonlinearities, the network can fold and warp the input space arbitrarily. Each hidden neuron introduces a new decision boundary, and together they can carve out arbitrarily complex regions. The depth of the network controls the number of compositions, while the width controls how many boundaries exist at each level.",
    ],
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
    deepDive: [
      "The choice of activation determines the set of functions a network can represent. ReLU creates piecewise-linear functions, with each neuron introducing at most one breakpoint. A network with n ReLU neurons can therefore represent functions with up to n pieces. This is why ReLU networks can approximate smooth functions but do so through piecewise-linear interpolation rather than smooth approximation.",
      "$$\\text{GELU}(z) = z \\cdot \\Phi(z) = z \\cdot \\frac{1}{2}\\left[1 + \\text{erf}\\!\\left(\\frac{z}{\\sqrt{2}}\\right)\\right]$$",
      "Dead neurons are a critical failure mode for ReLU: once a neuron's pre-activation is negative for all training examples, its gradient is exactly zero and it can never recover. Leaky ReLU (slope alpha for z < 0) and ELU (exponential for z < 0) address this by maintaining a non-zero subgradient in the negative regime. The optimal slope for Leaky ReLU is learned in PReLU, making the activation trainable.",
    ],
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
    deepDive: [
      "The forward pass through an L-layer network is a function composition: f = phi_L composed with phi_{L-1} composed ... with phi_1. Each layer applies an affine map followed by a nonlinearity, progressively transforming the input into a representation the final head can classify or regress. The expressivity of the full composition grows exponentially with depth for piecewise-linear activations.",
      "$$\\mathbf{h}_l = \\phi\\!\\left(\\mathbf{W}_l\\, \\mathbf{h}_{l-1} + \\mathbf{b}_l\\right), \\quad l = 1, \\dots, L$$",
      "Memory during the forward pass scales with the number of stored activations because backpropagation needs them for gradient computation. For a network with L layers and batch size B, the activation memory is O(B * L * d) where d is the hidden dimension. Gradient checkpointing reduces this to O(B * sqrt(L) * d) by recomputing activations during the backward pass at the cost of roughly 33% more FLOP.",
    ],
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
    deepDive: [
      "Backpropagation is reverse-mode automatic differentiation applied to neural network computation graphs. The algorithm traverses the graph in topological reverse order, accumulating gradient contributions via the chain rule. For a network with P parameters and a scalar loss, reverse-mode AD computes all P gradients in a single backward pass with cost proportional to the forward pass, which is why it is asymptotically optimal compared to forward-mode AD which would require P separate passes.",
      "$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{W}_l} = \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_l} \\cdot \\frac{\\partial \\mathbf{h}_l}{\\partial \\mathbf{W}_l} = \\boldsymbol{\\delta}_l\\, \\mathbf{h}_{l-1}^\\top$$",
      "The backpropagated error signal delta_l is a column vector representing how the loss changes with respect to pre-activation values at layer l. It is propagated backward as delta_{l-1} = (W_l^T delta_l) * phi'(z_{l-1}), where phi' is the element-wise derivative of the activation. This recursive structure means early-layer gradients are products of many Jacobians, making them susceptible to vanishing or exploding as depth increases.",
    ],
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
    deepDive: [
      "Softmax is the gradient of the log-sum-exp function, which is the smooth maximum over logits. This connection explains its behavior: the log-sum-exp tightly approximates the maximum logit, so the softmax output concentrates probability on the largest logit, becoming more peaked as the gap between logits grows. At temperature T, dividing logits by T before softmax smooths the distribution as T increases toward uniform and sharpens it as T approaches zero.",
      "$$p_i = \\frac{\\exp(z_i / T)}{\\sum_{j=1}^{K} \\exp(z_j / T)}, \\quad \\text{where } T > 0 \\text{ is temperature}$$",
      "When paired with cross-entropy loss, the gradient of the loss with respect to logits is simply p - y_onehot, one of the cleanest gradient expressions in deep learning. This is because the log in cross-entropy cancels the exp in softmax. The gradient is bounded in [-1, 1] for each logit, making the combined softmax + cross-entropy numerically well-conditioned during training.",
    ],
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
    deepDive: [
      "The goal of principled initialization is to preserve the variance of activations and gradients across layers. If each weight is drawn from a distribution with variance sigma^2 and a layer has fan_in inputs, the output variance of a linear layer is fan_in * sigma^2. Setting sigma^2 = 1/fan_in (Xavier/Glorot) keeps this at 1. For ReLU, which zeros half the inputs, He initialization uses sigma^2 = 2/fan_in to compensate for the reduced effective fan-in.",
      "$$\\sigma^2 = \\frac{2}{n_{\\text{in}}} \\quad (\\text{He/Kaiming for ReLU}), \\qquad \\sigma^2 = \\frac{2}{n_{\\text{in}} + n_{\\text{out}}} \\quad (\\text{Xavier/Glorot})$$",
      "Maximal Update Parameterization (muP, Yang et al. 2022) goes further by deriving initialization scales and learning-rate scalings that ensure feature learning (not just activation preservation) remains consistent as width increases. Under muP, optimal hyperparameters found at small width transfer directly to large width, enabling cheap hyperparameter search for billion-parameter models.",
    ],
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
    deepDive: [
      "The gradient at layer l is the product of Jacobians from all subsequent layers. If the spectral norm of each layer's Jacobian is bounded by rho, then the gradient norm at layer l scales as rho^(L-l). When rho < 1 the gradient vanishes exponentially with depth; when rho > 1 it explodes. The edge-of-chaos regime at rho = 1 is where learning signals survive longest, which is why orthogonal initialization targets unit singular values.",
      "$$\\left\\|\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_0}\\right\\| \\approx \\prod_{l=1}^{L} \\|\\mathbf{J}_l\\|, \\quad \\mathbf{J}_l = \\frac{\\partial \\mathbf{h}_l}{\\partial \\mathbf{h}_{l-1}}$$",
      "Residual connections structurally prevent vanishing gradients by providing an additive identity path. With y = F(x) + x, the gradient with respect to x is dL/dy * (dF/dx + I). The identity term I ensures that gradient magnitude never falls below 1 regardless of how the residual branch F behaves, creating a gradient highway through the full depth of the network.",
    ],
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
    deepDive: [
      "Batch normalization operates on a feature dimension across a mini-batch of examples. For a feature x with batch mean mu_B and batch variance sigma_B^2, it produces a normalized output with zero mean and unit variance, then applies trainable scale gamma and shift beta. During inference, running statistics accumulated during training replace the batch statistics, making the transform deterministic.",
      "$$\\hat{x}_i = \\frac{x_i - \\mu_\\mathcal{B}}{\\sqrt{\\sigma_\\mathcal{B}^2 + \\varepsilon}}, \\quad y_i = \\gamma \\hat{x}_i + \\beta, \\quad \\mu_\\mathcal{B} = \\frac{1}{m}\\sum_{i=1}^m x_i$$",
      "The smoothing effect of BatchNorm on the loss landscape works by bounding how much the loss can change when parameter magnitudes grow. Because the normalization divides by batch standard deviation, scaling the weights by a constant k leaves the normalized output unchanged, making the loss invariant to weight scale along that direction. This kills the sharpest curvature directions in parameter space, resulting in a more Lipschitz-smooth loss surface.",
    ],
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
    deepDive: [
      "Dropout with rate p trains an exponential ensemble of 2^n thinned subnetworks (for n neurons) simultaneously, sharing weights across all members. At inference time, using the full network with activations scaled by (1-p) approximates the geometric mean of all thinned network predictions. This approximation is exact for linear activations and a good empirical proxy for nonlinear networks.",
      "$$\\tilde{h}_i = \\frac{m_i}{1-p} h_i, \\quad m_i \\sim \\text{Bernoulli}(1-p), \\quad \\mathbb{E}[\\tilde{h}_i] = h_i$$",
      "Dropout reduces co-adaptation by forcing each neuron to be useful independently rather than relying on the presence of specific other neurons. This is analogous to the genetic argument for sexual reproduction: introducing randomness in the population prevents any single cooperative genetic strategy from dominating. The regularization effect is strongest in the fully-connected layers where co-adaptation is easiest to develop and most harmful.",
    ],
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
    deepDive: [
      "SGD with momentum maintains a velocity vector v that accumulates a decaying sum of past gradients. The update rule v <- mu*v - eta*g and w <- w + v gives each parameter a moving average of its gradient history, damping oscillations in high-curvature directions while accelerating progress along low-curvature directions. This is equivalent to applying a low-pass filter to the gradient sequence.",
      "$$\\mathbf{v}_{t+1} = \\mu\\, \\mathbf{v}_t - \\eta\\, \\mathbf{g}_t, \\quad \\mathbf{w}_{t+1} = \\mathbf{w}_t + \\mathbf{v}_{t+1}$$",
      "The implicit regularization of SGD is a key reason it often generalizes better than adaptive methods. SGD's noise structure is proportional to the gradient covariance, which acts like a natural gradient preconditioner pointing toward flatter regions of the loss landscape. Sharp minima with large Hessian eigenvalues are less stable under SGD noise and are preferentially escaped, while flat minima with small curvature tend to be retained.",
    ],
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
    deepDive: [
      "Adam maintains exponential moving averages of the gradient m_t and squared gradient v_t for each parameter. The bias-corrected estimates m_hat_t = m_t/(1-beta1^t) and v_hat_t = v_t/(1-beta2^t) correct for the fact that m and v are initialized at zero and are biased toward zero in early steps. Without this correction, early learning rates would be artificially large.",
      "$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1)g_t, \\quad v_t = \\beta_2 v_{t-1} + (1-\\beta_2)g_t^2, \\quad w_{t+1} = w_t - \\frac{\\eta\\, \\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\varepsilon}$$",
      "The effective step size for each parameter is approximately eta * |m_hat_t| / (|v_hat_t|^0.5 + eps). When the gradient is consistent in sign, m_hat_t is large while v_hat_t^0.5 grows more slowly, giving a larger step. When the gradient is noisy and oscillating, m_hat_t cancels while v_hat_t^0.5 accumulates, shrinking the step size. This produces automatic learning-rate annealing for noisy parameters without manual scheduling.",
    ],
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
    deepDive: [
      "The cosine annealing schedule smoothly reduces the learning rate from eta_max to eta_min following a half-cosine curve over T_max steps. Unlike step decay which introduces sudden drops, cosine annealing maintains a nearly constant rate early, then rapidly decreases near the end. The warm restart variant (SGDR) periodically resets the schedule, allowing the optimizer to escape local minima found during the previous cycle.",
      "$$\\eta_t = \\eta_{\\min} + \\frac{1}{2}(\\eta_{\\max} - \\eta_{\\min})\\left(1 + \\cos\\!\\left(\\frac{\\pi\\, t}{T_{\\max}}\\right)\\right)$$",
      "Linear warmup is essential in transformer training because Adam's second moment estimate v_t is very inaccurate in early steps, causing the effective per-parameter learning rates to be poorly estimated. A warmup period of 1000-4000 steps allows v_t to accumulate enough history to be a reliable estimate of the gradient variance, after which the main learning rate schedule takes effect safely.",
    ],
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
    deepDive: [
      "Under vanilla SGD, L2 regularization (adding lambda/2 ||w||^2 to the loss) and weight decay (multiplying w by (1 - eta*lambda) at each step) are exactly equivalent, since the gradient of the L2 penalty is lambda*w. Under Adam, however, the L2 gradient lambda*w is passed through the adaptive preconditioner, which scales it differently for each parameter and breaks the equivalence. AdamW decouples the two by applying weight decay directly to w outside the adaptive update.",
      "$$\\mathbf{w}_{t+1} = (1 - \\eta \\lambda)\\, \\mathbf{w}_t - \\eta \\cdot \\frac{\\hat{m}_t}{\\sqrt{\\hat{v}_t} + \\varepsilon} \\quad (\\text{AdamW})$$",
      "Which parameter types benefit from weight decay is non-obvious. Biases and layer-norm/batch-norm parameters are typically excluded because they are scalar per-channel and their decay would be equivalent to shifting the normalization, which is already handled by the learned scale and shift parameters. Embedding weights are sometimes excluded in language models because they are high-dimensional lookup tables where decay can erase rare-token representations.",
    ],
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
    deepDive: [
      "The sharpness of a minimum is characterized by the largest eigenvalue lambda_max of the Hessian H = d^2L/dtheta^2. A sharp minimum has large lambda_max, meaning small perturbations to parameters cause large loss increases. Flat minima have small lambda_max, meaning they are robust to perturbation. The PAC-Bayes bound for generalization scales with the sharpness, providing a theoretical justification for preferring flat minima.",
      "$$\\lambda_{\\max} = \\max_{\\|\\mathbf{v}\\|=1} \\mathbf{v}^\\top \\mathbf{H} \\mathbf{v}, \\quad \\mathcal{L}(\\boldsymbol{\\theta} + \\boldsymbol{\\epsilon}) \\approx \\mathcal{L}(\\boldsymbol{\\theta}) + \\frac{1}{2}\\boldsymbol{\\epsilon}^\\top \\mathbf{H}\\boldsymbol{\\epsilon}$$",
      "Loss landscape visualization (Li et al., 2018) uses random or PCA-based filter-normalized directions to plot 2D slices. Filter normalization divides each direction vector by the Frobenius norm of each weight tensor it perturbs, ensuring that different layers contribute equally regardless of scale. Without this normalization, high-norm layers dominate the landscape appearance and the visualization is misleading.",
    ],
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
    deepDive: [
      "A convolutional layer with C_out filters of size k x k applied to C_in input channels has C_out * k * k * C_in + C_out parameters. A dense layer operating on the same flattened spatial input H*W*C_in would have H*W*C_in * H*W*C_out parameters, which is orders of magnitude larger. The parameter sharing across spatial positions is what makes CNNs tractable for high-resolution inputs.",
      "$$y(i,j,c_{out}) = \\sum_{u=0}^{k-1}\\sum_{v=0}^{k-1}\\sum_{c_{in}} K(u,v,c_{in},c_{out})\\, x(i+u, j+v, c_{in}) + b_{c_{out}}$$",
      "The receptive field of a neuron in layer l grows with depth. For stride-1 convolutions with kernel size k, the receptive field at layer l is (l*(k-1)+1) x (l*(k-1)+1). Dilated (atrous) convolutions with dilation rate d expand the effective receptive field exponentially with depth without increasing parameters or reducing spatial resolution, which is why they are used in segmentation models like DeepLab.",
    ],
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
    deepDive: [
      "Max pooling provides exact local translation invariance: shifting a feature by up to pool_size/2 pixels leaves the pooled output unchanged, as long as the peak of the activation stays within the same pooling window. This is a hard invariance that helps detect textures and patterns regardless of their precise position within a local neighborhood.",
      "$$y(i,j) = \\max_{(u,v) \\in \\mathcal{W}} x(i+u,\\, j+v), \\quad \\text{where } \\mathcal{W} = \\{0,\\dots,k-1\\}^2$$",
      "The gradient of max pooling during backpropagation only flows through the winning unit in each window (the argmax position during the forward pass). All other units receive zero gradient, which means max pooling can suppress gradient flow to the majority of upstream neurons. Stochastic pooling (Zeiler & Fergus, 2013) addresses this by sampling the pooled unit proportionally to activation magnitude, providing gradient signal to more upstream neurons during training.",
    ],
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
    deepDive: [
      "The residual formulation y = F(x) + x shifts the learning target from learning the full mapping H(x) to learning the residual F(x) = H(x) - x. If the identity mapping were optimal, F would be driven toward zero by gradient descent. This initialization-friendly property means that at the start of training, the network behaves like a collection of shallower networks, and depth is progressively utilized as learning proceeds.",
      "$$\\mathbf{y}_l = \\mathbf{x}_l + \\mathcal{F}(\\mathbf{x}_l, \\{\\mathbf{W}_l\\}), \\quad \\mathbf{x}_L = \\mathbf{x}_l + \\sum_{i=l}^{L-1} \\mathcal{F}(\\mathbf{x}_i, \\{\\mathbf{W}_i\\})$$",
      "The unrolled form shows that the output at layer L is the input x_l plus a sum of residual contributions from all intermediate blocks. The gradient dL/dx_l therefore includes the direct term dL/dx_L plus contributions through every residual path. Even if some paths have very small gradients, the direct identity path always contributes the gradient dL/dx_L unattenuated, preventing complete vanishing.",
    ],
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
    deepDive: [
      "Backpropagation through time (BPTT) unrolls the RNN for T steps and applies standard backprop to the resulting computation graph. The gradient of the loss with respect to h_0 involves the product of T recurrent Jacobians W_h^T diag(phi'(z_t)). If the spectral radius of W_h is less than 1, this product vanishes as T grows; if greater than 1, it explodes. The critical spectral radius of 1 corresponds to orthogonal recurrent matrices.",
      "$$\\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_0} = \\prod_{t=1}^{T} \\frac{\\partial \\mathbf{h}_t}{\\partial \\mathbf{h}_{t-1}} \\cdot \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_T} = \\prod_{t=1}^{T} \\left(\\mathbf{W}_h^\\top \\text{diag}(\\phi'(\\mathbf{z}_t))\\right) \\frac{\\partial \\mathcal{L}}{\\partial \\mathbf{h}_T}$$",
      "Truncated BPTT limits the gradient computation to a fixed window of k steps, trading exact gradient estimates for computational feasibility in long sequences. The truncation introduces bias in the gradient because dependencies longer than k steps are ignored, but in practice gradients from very distant time steps contribute little after exponential decay, making truncation a reasonable approximation for many sequence lengths.",
    ],
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
    deepDive: [
      "The scaling factor 1/sqrt(dk) in the attention score QK^T/sqrt(dk) prevents the dot products from growing large in magnitude as dk increases. Without scaling, the dot products of random dk-dimensional unit vectors have variance dk, pushing the softmax into its saturated tail where gradients become extremely small. Dividing by sqrt(dk) normalizes the variance back to 1 regardless of head dimension.",
      "$$\\text{Attention}(\\mathbf{Q},\\mathbf{K},\\mathbf{V}) = \\text{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}}\\right)\\mathbf{V}, \\quad \\text{complexity: } O(n^2 d_k)$$",
      "Multi-head attention projects Q, K, V into h parallel dk-dimensional subspaces, computes attention independently in each head, then concatenates and projects back. Each head can specialize in a different type of dependency: some heads attend to syntactic structure, others to semantic similarity, and others to positional proximity. The concatenated output then mixes these different relational signals through the output projection W_O.",
    ],
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
    deepDive: [
      "Each transformer block applies two residual sub-layers: multi-head self-attention and a position-wise feedforward network. With pre-norm (layer norm before each sub-layer rather than after), the residual stream x flows through the network largely unmodified, with each block adding a small correction. This explains why the output of a well-trained transformer can often be predicted reasonably well from just the residual stream without the attention contributions.",
      "$$\\mathbf{x}' = \\mathbf{x} + \\text{MHA}(\\text{LN}(\\mathbf{x})), \\quad \\mathbf{x}'' = \\mathbf{x}' + \\text{FFN}(\\text{LN}(\\mathbf{x}'))$$",
      "The parameter count of a transformer layer with model dimension d and FFN expansion factor m is approximately 4d^2 for the attention matrices (Q, K, V, O each of size d x d) and 2*m*d^2 for the FFN (expansion and contraction). With m=4, the FFN accounts for twice as many parameters as the attention, which is why attention is often called the communication mechanism and the FFN the computation/memory mechanism of the transformer.",
    ],
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
    deepDive: [
      "The PMI matrix connection explains the famous king - man + woman = queen analogy. In word co-occurrence statistics, (king, man) and (queen, woman) have similar co-occurrence profiles, so their PMI vectors are similar. The skip-gram objective's implicit PMI factorization encodes these similarities as geometric offsets in the embedding space, making linear analogies a natural consequence of the factorization structure.",
      "$$\\text{PMI}(w, c) = \\log \\frac{P(w, c)}{P(w)\\,P(c)}, \\quad \\mathbf{E} \\approx \\text{SVD}_{d}(\\text{PMI matrix})$$",
      "Subword tokenization (BPE, WordPiece, SentencePiece) addresses the vocabulary coverage problem by representing rare words as sequences of frequent subword tokens. This means the embedding of a rare word is computed by summing its subword embeddings, providing a principled morphological decomposition. The embedding table size is typically 32K-128K tokens for modern language models, with each embedding being d-dimensional where d is the model hidden size.",
    ],
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
    deepDive: [
      "Layer normalization computes statistics over the feature dimension of each individual token, making it independent of batch size. For a token representation x of dimension d, the layer mean and variance are mu = (1/d)*sum(x_i) and sigma^2 = (1/d)*sum((x_i - mu)^2). The resulting normalized vector has mean 0 and variance 1 across features, then gamma and beta per-dimension allow the network to re-express any mean and variance if needed.",
      "$$\\text{LN}(\\mathbf{x}) = \\gamma \\odot \\frac{\\mathbf{x} - \\mu}{\\sqrt{\\sigma^2 + \\varepsilon}} + \\beta, \\quad \\mu = \\frac{1}{d}\\sum_{i=1}^{d} x_i, \\quad \\sigma^2 = \\frac{1}{d}\\sum_{i=1}^{d}(x_i - \\mu)^2$$",
      "Pre-norm placement (applying layer norm before attention and FFN) versus post-norm (applying after) has a significant effect on training stability. Post-norm is used in the original transformer and tends to produce better-calibrated representations but is harder to train at very deep configurations. Pre-norm creates an unobstructed residual stream that is easier to optimize but can lead to representation collapse where the residual stream dominates over the block outputs.",
    ],
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
    deepDive: [
      "Global norm clipping computes the total norm of all gradients concatenated as a single vector, then scales the entire gradient by c/||g|| if ||g|| > c, leaving it unchanged otherwise. This preserves the relative magnitudes between different parameter gradients, maintaining their directional relationship. Per-parameter clipping independently limits each gradient, which can distort the relative update sizes and introduce bias in the optimization trajectory.",
      "$$\\mathbf{g} \\leftarrow \\mathbf{g} \\cdot \\min\\!\\left(1,\\ \\frac{c}{\\|\\mathbf{g}\\|_2}\\right), \\quad \\|\\mathbf{g}\\|_2 = \\sqrt{\\sum_{i} g_i^2}$$",
      "Gradient spikes are particularly common at the beginning of training and at domain boundaries in diverse datasets. A single anomalous batch can produce a gradient 10-100x larger than typical, sufficient to move parameters far out of the current stable region and potentially cause loss divergence. Monitoring the gradient norm over training reveals these spikes and whether clipping is actively engaging, which is diagnostic information for debugging training instability.",
    ],
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
    deepDive: [
      "The equivalence between early stopping and L2 regularization holds precisely in the following sense: for a linear model trained with gradient descent, stopping at step t is equivalent to training to convergence with L2 regularization strength lambda = 1/(eta*t). As training continues, the effective regularization decreases, allowing parameters to fit the training data more closely at the cost of worse generalization.",
      "$$\\|\\boldsymbol{\\theta}_t\\|_2 \\leq \\|\\boldsymbol{\\theta}^*\\|_2, \\quad \\text{effective regularization} \\approx \\frac{1}{\\eta t} \\quad \\text{for linear models}$$",
      "Setting the patience hyperparameter requires balancing sensitivity to overfitting against tolerance for validation noise. A patience of 1 epoch stops as soon as any worsening occurs, which is too sensitive to stochastic validation noise. A patience of 10-20 epochs gives the model time to escape temporary validation plateaus while still catching genuine overfitting trends. Tracking the smoothed validation curve (exponential moving average) rather than the raw epoch-level metric reduces noise sensitivity.",
    ],
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
    deepDive: [
      "From a Bayesian perspective, data augmentation applies the prior that the label is invariant under the augmentation distribution T. If we believe that rotating an image 90 degrees does not change whether it contains a cat, then we can encode this belief by including rotated versions of each cat image in training. The model's learned representation is then forced to be invariant to these rotations, which is a form of regularization grounded in domain knowledge.",
      "$$\\mathcal{L}_{\\text{aug}} = \\mathbb{E}_{x,y}\\,\\mathbb{E}_{T \\sim \\mathcal{T}}\\left[\\ell(f(T(x)),\\ y)\\right]$$",
      "Mixup (Zhang et al., 2018) creates convex combinations of pairs of training examples: x_mix = lambda*x_i + (1-lambda)*x_j and y_mix = lambda*y_i + (1-lambda)*y_j. This trains the model on a much richer set of interpolated examples, encouraging linear behavior in the feature space between training points and significantly reducing confidence on out-of-distribution inputs. CutMix extends this to spatial pasting of image patches.",
    ],
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
    deepDive: [
      "Discriminative fine-tuning (Howard & Ruder, ULMFiT) uses layer-wise learning rates that decrease as we move toward the input. The intuition is that lower layers encode general language features that should change slowly, while upper layers encode task-specific features that should adapt quickly. With eta_L being the learning rate for the topmost layer, lower layers use eta_l = eta_L / (2.6^(L-l)), which is an exponentially decreasing schedule toward the input.",
      "$$\\eta_l = \\frac{\\eta_L}{\\alpha^{L-l}}, \\quad l = 1, \\dots, L, \\quad \\text{where } \\alpha > 1 \\text{ (typically } \\alpha = 2.6\\text{)}$$",
      "Catastrophic forgetting during fine-tuning can be mitigated by Elastic Weight Consolidation (EWC, Kirkpatrick et al. 2017), which adds a quadratic penalty on parameter deviations from pretrained values, weighted by the Fisher information matrix. Parameters with high Fisher information (important for the source task) are penalized more strongly for changing, preserving source-task performance while allowing adaptation where parameters are less critical.",
    ],
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
    deepDive: [
      "The temperature T controls how much information is in the teacher's soft targets. At T=1, the soft targets are the teacher's regular probabilities. As T increases, the distribution becomes softer, revealing more about the relative similarities the teacher assigns to wrong classes. For example, a teacher may assign probability 0.001 to one wrong class and 0.0001 to another, which at T=1 is indistinguishable, but at T=10 becomes ratios that the student can learn from.",
      "$$\\mathcal{L}_{\\text{KD}} = (1-\\alpha)\\,\\mathcal{L}_{\\text{CE}}(\\mathbf{y}, \\mathbf{p}_s) + \\alpha T^2 \\,\\text{KL}\\!\\left(\\sigma\\!\\left(\\frac{\\mathbf{z}_t}{T}\\right) \\Bigg\\| \\sigma\\!\\left(\\frac{\\mathbf{z}_s}{T}\\right)\\right)$$",
      "The T^2 factor in the KL term compensates for the fact that softening logits by T scales the gradients of the soft loss by 1/T^2. Without this correction, the soft-target loss would contribute vanishingly small gradients relative to the hard-label loss as T increases. The T^2 rescaling keeps the two loss terms on comparable scales regardless of the temperature used.",
    ],
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
    deepDive: [
      "FP16 has a dynamic range from ~6x10^-5 to ~6.5x10^4. Many gradient values during backprop fall below the FP16 minimum, becoming zero (underflow). Loss scaling multiplies the loss by a large constant S before backprop, scaling all gradients by S and moving them into the FP16 representable range. After the backward pass, gradients are divided by S before the parameter update. Dynamic loss scaling starts at a high S and halves it whenever overflow (NaN/Inf) is detected.",
      "$$\\mathbf{w}_{\\text{fp32}} \\leftarrow \\mathbf{w}_{\\text{fp32}} - \\eta \\cdot \\frac{1}{S} \\cdot \\text{unscale}(\\hat{\\mathbf{g}}_{\\text{fp16}}), \\quad \\hat{\\mathbf{g}}_{\\text{fp16}} = S \\cdot \\mathbf{g}_{\\text{fp16}}$$",
      "The memory savings from mixed precision come from two sources: model parameters stored in FP16 use half the memory of FP32, and gradient buffers are also FP16. The FP32 master copy of weights is kept for the optimizer step to preserve accumulation precision but does not need to be held on GPU simultaneously with FP16 weights. Activation memory during the forward pass, often the dominant cost, is also halved when stored in FP16.",
    ],
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
    deepDive: [
      "Centered Kernel Alignment (CKA) measures representation similarity between two networks by comparing their Gram matrices. For representations X from network A and Y from network B on the same inputs, CKA(X,Y) = ||Y^T X||_F^2 / (||X^T X||_F * ||Y^T Y||_F). A value of 1 means both networks encode the same information (up to invertible linear transform), while 0 means completely different representations.",
      "$$\\text{CKA}(X, Y) = \\frac{\\left\\|\\mathbf{Y}^\\top \\mathbf{X}\\right\\|_F^2}{\\left\\|\\mathbf{X}^\\top \\mathbf{X}\\right\\|_F \\left\\|\\mathbf{Y}^\\top \\mathbf{Y}\\right\\|_F}$$",
      "Negative transfer occurs when source-domain representations actively harm target-task performance. This is most likely when the source and target tasks require conflicting inductive biases: for example, a model pretrained for sentiment classification (which encodes emotionally charged words distinctively) may transfer poorly to scientific text classification where emotional valence is irrelevant but technical terminology matters. Feature selection or adapter layers can mitigate this by filtering which pretrained features are used.",
    ],
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
    deepDive: [
      "Sinusoidal positional encodings use sine and cosine functions of different frequencies so that PE(pos, 2i) = sin(pos/10000^(2i/d)) and PE(pos, 2i+1) = cos(pos/10000^(2i/d)). The key property is that PE(pos+k) can be expressed as a linear function of PE(pos) for any fixed offset k. This means the model can learn to attend to relative positions by computing linear combinations of positional encoding components.",
      "$$\\text{PE}(\\text{pos}, 2i) = \\sin\\!\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right), \\quad \\text{PE}(\\text{pos}, 2i+1) = \\cos\\!\\left(\\frac{\\text{pos}}{10000^{2i/d}}\\right)$$",
      "RoPE applies a rotation matrix R(pos) to query and key vectors such that the dot product q^T k depends only on the relative position (pos_q - pos_k) rather than absolute positions. Specifically, (R(m)q)^T (R(n)k) = q^T R(n-m) k. This relative position dependence means the model naturally generalizes to positions unseen during training, and context window extension techniques like YaRN scale the rotation frequencies to handle longer sequences.",
    ],
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
    deepDive: [
      "The causal mask M is an upper-triangular matrix where M_{ij} = -infinity if j > i and 0 otherwise. Adding M to the attention logits QK^T/sqrt(dk) before softmax drives the attention weights for future positions to zero (since exp(-infinity) = 0). This implements the constraint that position i can only attend to positions 0..i without requiring separate forward passes per position.",
      "$$A_{ij} = \\frac{\\exp\\!\\left(\\frac{\\mathbf{q}_i^\\top \\mathbf{k}_j}{\\sqrt{d_k}} + M_{ij}\\right)}{\\sum_{l} \\exp\\!\\left(\\frac{\\mathbf{q}_i^\\top \\mathbf{k}_l}{\\sqrt{d_k}} + M_{il}\\right)}, \\quad M_{ij} = \\begin{cases} 0 & j \\le i \\\\ -\\infty & j > i \\end{cases}$$",
      "Key-value caching during autoregressive decoding exploits the causal mask structure: when generating token t, the keys and values for positions 0..t-1 are already computed and can be reused. Only the new query q_t needs to be computed, and attention is computed as q_t against the full KV cache. This reduces the per-step cost from O(t^2) to O(t), making inference tractable for long sequences.",
    ],
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
    deepDive: [
      "Cross-attention in the decoder computes Q from decoder hidden states and K, V from encoder outputs. Each decoder position can attend to any encoder position, creating a soft alignment between output and input tokens. For translation, these attention weights often correspond to interpretable word alignments, and visualizing them reveals that the model has learned linguistic correspondence without explicit alignment supervision.",
      "$$\\mathbf{h}_t^{\\text{dec}} = \\text{MHA}(\\mathbf{Q}=\\mathbf{h}_t^{\\text{dec}},\\ \\mathbf{K}=\\mathbf{H}^{\\text{enc}},\\ \\mathbf{V}=\\mathbf{H}^{\\text{enc}})$$",
      "The encoder bottleneck in seq2seq models can be a limitation: all source information must be compressed into fixed encoder representations, and the decoder must extract what it needs via attention. For very long source sequences, this can cause information loss. The pointer network (Vinyals et al., 2015) extends cross-attention to allow the decoder to directly copy tokens from the source, effectively extending the output vocabulary with source-conditioned copying and improving performance on tasks like summarization and data-to-text generation.",
    ],
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
    deepDive: [
      "The autoregressive factorization is always valid by the chain rule of probability, but the ordering matters for what structure the model must learn. Left-to-right models condition each token on its full left context, making them natural for generation but requiring bidirectional context be encoded in the left prefix. Alternative orderings (right-to-left, arbitrary permutation as in XLNet) can capture different dependency structures.",
      "$$\\log p(\\mathbf{x}) = \\sum_{t=1}^{T} \\log p(x_t \\mid x_1, \\dots, x_{t-1}) = \\sum_{t=1}^{T} \\log p(x_t \\mid \\mathbf{x}_{<t})$$",
      "Top-p (nucleus) sampling selects from the smallest set of tokens whose cumulative probability exceeds p, then renormalizes and samples. Unlike top-k which uses a fixed vocabulary size, nucleus sampling adapts: for confident predictions with a peaked distribution, only 1-2 tokens may exceed cumulative probability 0.9; for uncertain predictions, dozens may be included. This provides context-sensitive diversity that better matches human text distributions.",
    ],
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
    deepDive: [
      "The router in a sparse MoE layer computes a softmax over E expert scores for each token and selects the top-k experts. The load-balancing auxiliary loss penalizes routing collapse where all tokens are sent to the same few experts, starving others. This is computed as the dot product of the fraction of tokens routed to each expert and the average router probability assigned to each expert, which is minimized when both are uniform.",
      "$$\\mathbf{y} = \\sum_{i \\in \\text{top-}k} g_i(\\mathbf{x})\\, E_i(\\mathbf{x}), \\quad \\mathbf{g}(\\mathbf{x}) = \\text{softmax}(\\mathbf{W}_g \\mathbf{x}), \\quad \\mathcal{L}_{\\text{aux}} = E \\sum_{i=1}^{E} f_i \\cdot P_i$$",
      "Expert capacity (the maximum number of tokens each expert can process per batch) is a key engineering parameter. If a token's top-k experts are all at capacity, the token is dropped and processed without the MoE contribution (overflow tokens). A capacity factor CF > 1 overestimates needed capacity: with B tokens in the batch, k active experts, and E total experts, each expert gets a buffer of CF * B * k / E slots. Increasing CF reduces token dropping at the cost of memory.",
    ],
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
    deepDive: [
      "The forward diffusion process is a Markov chain that gradually adds Gaussian noise: q(x_t | x_{t-1}) = N(x_t; sqrt(1-beta_t)*x_{t-1}, beta_t*I). After T steps with appropriate beta_t schedule, x_T is approximately standard Gaussian. A key property is that the marginal q(x_t | x_0) = N(x_t; sqrt(alpha_bar_t)*x_0, (1-alpha_bar_t)*I) where alpha_bar_t = product of (1-beta_i), allowing any noisy sample to be drawn directly from x_0 without simulating the full chain.",
      "$$q(\\mathbf{x}_t \\mid \\mathbf{x}_0) = \\mathcal{N}\\!\\left(\\sqrt{\\bar{\\alpha}_t}\\,\\mathbf{x}_0,\\ (1-\\bar{\\alpha}_t)\\mathbf{I}\\right), \\quad \\bar{\\alpha}_t = \\prod_{s=1}^{t}(1-\\beta_s)$$",
      "Classifier-free guidance (Ho & Salimans, 2022) trains a single conditional model p(x|c) that also handles the unconditional case by randomly dropping the condition c during training. At sampling time, the score function is extrapolated as s_guided = s_uncond + w*(s_cond - s_uncond), where w > 1 amplifies the conditional direction. Larger w produces outputs more strongly conditioned on c but with reduced diversity.",
    ],
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
    deepDive: [
      "Soft prompts are continuous embedding vectors prepended to the input sequence. Unlike discrete prompts (actual words), soft prompts are optimized directly by gradient descent with respect to the task loss. The base model is frozen, so gradients flow backward through the model only to update the prompt embeddings. The prompt length (typically 1-100 tokens) controls the capacity of the adapter, with longer prompts providing more parameters to tune.",
      "$$\\mathcal{L}(\\boldsymbol{\\theta}_{\\text{prompt}}) = \\mathbb{E}_{(x,y)}\\left[\\ell\\!\\left(f_{\\boldsymbol{\\theta}_{\\text{base}}}([\\mathbf{P};\\, \\text{embed}(x)]),\\ y\\right)\\right], \\quad \\boldsymbol{\\theta}_{\\text{base}} \\text{ frozen}$$",
      "Prefix tuning (Li & Liang, 2021) extends this idea by prepending trainable key-value pairs to every attention layer's KV cache, not just the input embeddings. This gives the prompt direct influence over the attention pattern at every layer rather than only the input representation. Prefix tuning uses reparameterization through a small MLP to initialize stable prefix KV pairs, finding that directly optimizing the prefix vectors leads to unstable training.",
    ],
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
    deepDive: [
      "The LSTM cell state c_t is updated by a combination of forgetting past state (f_t * c_{t-1}) and adding new candidate content (i_t * c_tilde_t). The forget gate f_t is a sigmoid-gated linear function of h_{t-1} and x_t, allowing the cell to selectively erase past memory. The input gate i_t controls how much new information to incorporate. The tanh nonlinearity in c_tilde_t bounds the new content, preventing unbounded growth.",
      "$$\\begin{aligned} \\mathbf{f}_t &= \\sigma(\\mathbf{W}_f[\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_f) \\\\ \\mathbf{i}_t &= \\sigma(\\mathbf{W}_i[\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_i) \\\\ \\mathbf{c}_t &= \\mathbf{f}_t \\odot \\mathbf{c}_{t-1} + \\mathbf{i}_t \\odot \\tanh(\\mathbf{W}_c[\\mathbf{h}_{t-1}, \\mathbf{x}_t] + \\mathbf{b}_c) \\end{aligned}$$",
      "The gradient of the loss with respect to the cell state at time t, dL/dc_t, propagates back through time as dL/dc_{t-1} = f_t * dL/dc_t. Because f_t is a sigmoid output in (0,1), the gradient is attenuated but never reversed in sign, which prevents gradient explosion through the cell state channel. If the forget gate learns to be near 1 for long-range dependencies, the gradient flows nearly unattenuated through the corresponding time steps.",
    ],
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
    deepDive: [
      "The GRU merges the LSTM's cell state and hidden state into a single hidden state h_t, and replaces the three gates (input, forget, output) with two gates (update z_t and reset r_t). The update gate z_t interpolates between the previous hidden state h_{t-1} and the candidate state h_tilde_t, with z_t near 0 preserving the old state (acting like a forget gate open channel) and z_t near 1 incorporating the new candidate.",
      "$$\\mathbf{z}_t = \\sigma(\\mathbf{W}_z[\\mathbf{h}_{t-1}, \\mathbf{x}_t]), \\quad \\mathbf{r}_t = \\sigma(\\mathbf{W}_r[\\mathbf{h}_{t-1}, \\mathbf{x}_t])$$\n$$\\tilde{\\mathbf{h}}_t = \\tanh(\\mathbf{W}[\\mathbf{r}_t \\odot \\mathbf{h}_{t-1}, \\mathbf{x}_t]), \\quad \\mathbf{h}_t = (1-\\mathbf{z}_t) \\odot \\mathbf{h}_{t-1} + \\mathbf{z}_t \\odot \\tilde{\\mathbf{h}}_t$$",
      "The reset gate r_t determines how much of the previous hidden state to expose when computing the candidate h_tilde_t. With r_t near 0, the candidate is computed almost entirely from x_t, effectively resetting the hidden state and ignoring history. With r_t near 1, the full previous state contributes to the candidate. This allows the GRU to forget selectively at the token level rather than only at the sequence level.",
    ],
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
    deepDive: [
      "A bidirectional RNN runs a forward pass from t=1 to T producing hidden states h_t^(f), and a backward pass from t=T to 1 producing h_t^(b). The two hidden states at each position are concatenated to form the full context vector h_t = [h_t^(f); h_t^(b)], which captures all information to the left and right simultaneously. This is only possible for encoder use cases where the full sequence is available at processing time.",
      "$$\\overrightarrow{\\mathbf{h}}_t = \\text{RNN}_{\\text{fwd}}(\\mathbf{x}_t, \\overrightarrow{\\mathbf{h}}_{t-1}), \\quad \\overleftarrow{\\mathbf{h}}_t = \\text{RNN}_{\\text{bwd}}(\\mathbf{x}_t, \\overleftarrow{\\mathbf{h}}_{t+1}), \\quad \\mathbf{h}_t = [\\overrightarrow{\\mathbf{h}}_t;\\ \\overleftarrow{\\mathbf{h}}_t]$$",
      "The effective receptive field of each position in a bidirectional LSTM grows as the hidden state propagates but decays exponentially with distance for long dependencies. In contrast, a self-attention encoder has O(1) path length between any two positions, giving it access to global context at every layer regardless of sequence length. This fundamental difference in information routing is why bidirectional transformers replaced bidirectional LSTMs for most NLU tasks despite similar theoretical expressivity.",
    ],
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
    deepDive: [
      "Beam search maintains a set of K hypothesis sequences (the beam). At each step, each hypothesis is extended by all V vocabulary tokens, producing K*V candidates. The top-K candidates by cumulative log-probability are retained, and the process repeats until all beams have generated an end-of-sequence token or reached maximum length. The final output is the hypothesis with the highest score, optionally normalized by sequence length.",
      "$$\\text{score}(\\mathbf{y}) = \\frac{1}{|\\mathbf{y}|^\\alpha} \\sum_{t=1}^{|\\mathbf{y}|} \\log p(y_t \\mid \\mathbf{y}_{<t}, \\mathbf{x}), \\quad \\alpha \\in [0, 1] \\text{ (length penalty)}$$",
      "Length normalization by |y|^alpha corrects beam search's tendency to prefer shorter sequences. Without normalization, cumulative log-probabilities are always negative and decrease as sequences grow, so the highest-scoring sequences are often too short. With alpha=1 (full length normalization), the model is rewarded equally per token regardless of sequence length. Values of alpha around 0.6-0.9 are common in translation, balancing length bias correction against over-penalizing long sequences.",
    ],
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
    deepDive: [
      "Teacher forcing enables fully parallel training of sequence models because each token's input is the ground-truth previous token, independent of the model's prediction at that step. This means all positions in a sequence can be processed simultaneously in a single forward pass, making training dramatically faster than sequential autoregressive sampling. The entire target sequence is fed shifted by one position, which is why causal masking is necessary to prevent positions from attending to their own targets.",
      "$$p_{\\text{train}}(\\mathbf{x}_{1:T}) = \\prod_{t=1}^{T} p(x_t \\mid x_1^*, \\dots, x_{t-1}^*), \\quad p_{\\text{infer}}(\\mathbf{x}_{1:T}) = \\prod_{t=1}^{T} p(x_t \\mid \\hat{x}_1, \\dots, \\hat{x}_{t-1})$$",
      "Scheduled sampling (Bengio et al., 2015) addresses exposure bias by randomly replacing teacher-forced inputs with model predictions during training. A probability epsilon of using model predictions is annealed from 0 to some value over training. When a model prediction is used, errors compound as in inference, forcing the model to learn recovery strategies. However, scheduled sampling can be slow to converge because early model predictions are poor and create very noisy training signals.",
    ],
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
    deepDive: [
      "Label smoothing modifies the cross-entropy loss target from a one-hot vector to a smoothed distribution that places (1-eps) on the true class and eps/(K-1) on each other class (or equivalently eps/K on all including the true class). The gradient of the loss with respect to the logit z_k is p_k - y_smooth_k. For the true class k*, this is p_{k*} - (1-eps + eps/K), and for other classes it is p_k - eps/K. The model is penalized less for being confident on the true class and more for putting zero probability on other classes.",
      "$$\\mathcal{L}_{\\text{LS}} = -\\sum_{k=1}^{K} y_k^{\\text{smooth}} \\log p_k, \\quad y_k^{\\text{smooth}} = (1-\\varepsilon)\\, \\mathbf{1}[k = k^*] + \\frac{\\varepsilon}{K}$$",
      "The representation geometry change induced by label smoothing (tighter, more equidistant class clusters) has a direct implication for knowledge distillation: a teacher trained with label smoothing produces less informative soft targets because its class similarities are suppressed by the smoothing. The probability mass on non-true classes, which is the informative 'dark knowledge', is diluted by the uniform noise. This is why distillation from label-smoothed teachers often underperforms distillation from standard cross-entropy teachers.",
    ],
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
    deepDive: [
      "Standard cross-entropy loss weights all examples equally regardless of difficulty. In object detection, the vast majority of candidate regions are background (easy negatives), and their individually small but collectively overwhelming gradients swamp the signal from the rare foreground examples. Focal loss introduces the modulating factor (1-p_t)^gamma where p_t is the model's probability for the true class. For well-classified examples (p_t near 1), (1-p_t)^gamma is near 0, suppressing their contribution.",
      "$$\\text{FL}(p_t) = -(1-p_t)^\\gamma \\log(p_t), \\quad p_t = \\begin{cases} p & \\text{if } y=1 \\\\ 1-p & \\text{if } y=0 \\end{cases}$$",
      "The gamma parameter controls the rate of down-weighting. At gamma=0, focal loss reduces to standard cross-entropy. At gamma=2, an example with p_t=0.9 has its loss suppressed by a factor of (1-0.9)^2 = 0.01 relative to an example with p_t=0.5. This means well-classified examples contribute 100x less gradient than ambiguous ones, effectively focusing the model's learning signal on the hard cases where it is most needed.",
    ],
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
    deepDive: [
      "InfoNCE loss can be interpreted as the cross-entropy loss of a classifier that, given a query i and N candidates, must identify which one is the positive. With similarity scores sim(i,k)/tau as logits, the InfoNCE loss is the negative log-probability of the correct positive. Maximizing this log-probability is equivalent to making the positive pair more similar than all negatives, with temperature tau controlling how sharply the loss focuses on near-misses.",
      "$$\\mathcal{L}_{\\text{InfoNCE}} = -\\log \\frac{\\exp(\\text{sim}(\\mathbf{z}_i, \\mathbf{z}_j)/\\tau)}{\\sum_{k=1}^{N} \\exp(\\text{sim}(\\mathbf{z}_i, \\mathbf{z}_k)/\\tau)}$$",
      "The number of negatives N is a critical hyperparameter: more negatives make the task harder and the learned representations richer, but require proportionally larger batch sizes (for in-batch negatives) or memory banks. MoCo (He et al., 2020) maintains a queue of negatives from past mini-batches, allowing large N without proportionally large batches. The momentum encoder (slowly updated target network) ensures that queue keys stay consistent despite the encoder evolving.",
    ],
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
    deepDive: [
      "Triplet loss requires selecting triplets (anchor, positive, negative) where the anchor and positive are from the same class and the negative is from a different class. The loss pushes d(a,p) + m below d(a,n). Easy triplets where d(a,n) > d(a,p) + m already contribute zero loss and should be discarded. Semi-hard negatives (where d(a,p) < d(a,n) < d(a,p) + m) are the most informative: they violate the margin but not by much, providing a meaningful gradient signal.",
      "$$\\mathcal{L}_{\\text{triplet}} = \\frac{1}{N}\\sum_{i=1}^{N} \\max\\!\\left(0,\\ \\|\\mathbf{f}(a_i) - \\mathbf{f}(p_i)\\|_2^2 - \\|\\mathbf{f}(a_i) - \\mathbf{f}(n_i)\\|_2^2 + m\\right)$$",
      "ArcFace reformulates metric learning as a classification problem with angular margin. The logit for class c is computed as cos(theta_c + m) where theta_c is the angle between the embedding and the class weight vector, and m is the additive angular margin. Minimizing cross-entropy on these margin-modified logits forces each class's embeddings to have angular distance greater than m from all class boundaries, creating uniformly spaced clusters on the hypersphere.",
    ],
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
    deepDive: [
      "The choice of pretext task determines what invariances the representation learns. Rotation prediction (predict 0/90/180/270 degree rotation) teaches the model about object pose. Jigsaw puzzle prediction teaches spatial relationships. Masked patch prediction (MAE) teaches holistic object understanding by requiring reconstruction from partial views. Contrastive objectives (SimCLR, MoCo) teach view-invariance without specifying what to be invariant to, allowing the model to discover useful invariances from data.",
      "$$\\mathcal{L}_{\\text{DINO}} = -\\sum_{x \\in \\{x_1^g, x_2^g\\}} \\sum_{x' \\in V} p_t(x) \\log p_s(x'), \\quad p(x) = \\text{softmax}\\!\\left(\\frac{g_\\theta(x)}{\\tau}\\right)$$",
      "DINO's self-distillation avoids collapse (where the representation degenerates to a constant) through centering and sharpening. Centering subtracts the running mean of teacher outputs, preventing any single dimension from dominating. Sharpening applies a low temperature to the teacher outputs, making the teacher's distribution peaked and informative. Together, these tricks allow training without negative pairs, contrastive loss, or explicit cluster assignments.",
    ],
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
    deepDive: [
      "In BERT-style masked language modeling, 15% of tokens are selected for masking. Of these, 80% are replaced with [MASK], 10% are replaced with a random token, and 10% are left unchanged. The random token and unchanged fractions prevent the model from learning that [MASK] always needs to be predicted, since at fine-tuning time [MASK] never appears. The model must therefore learn rich contextual representations for all tokens, not just the masked ones.",
      "$$\\mathcal{L}_{\\text{MLM}} = -\\mathbb{E}_{x}\\!\\left[\\sum_{t \\in \\mathcal{M}} \\log P(x_t \\mid \\mathbf{x}_{\\setminus \\mathcal{M}})\\right]$$",
      "Masked image modeling (MIM) in MAE processes only the unmasked 25% of patches through the encoder, dramatically reducing the forward pass cost. The decoder, which is a lighter transformer, receives both encoder outputs (for visible patches) and learned mask tokens (for masked patches) and reconstructs pixel values for all patches. This asymmetric design concentrates the expensive encoder computation on informative visible patches, making pretraining roughly 3x faster than encoding all patches.",
    ],
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
    deepDive: [
      "The VAE objective is the Evidence Lower BOund (ELBO), a lower bound on the true log-likelihood log p(x). The gap between ELBO and log p(x) is the KL divergence between the approximate posterior q(z|x) and the true posterior p(z|x). Maximizing the ELBO simultaneously maximizes reconstruction quality (first term) and minimizes the information-theoretic distance between the approximate and true posteriors (second term), balancing generation quality against latent space regularity.",
      "$$\\log p(\\mathbf{x}) \\geq \\mathcal{L}_{\\text{ELBO}} = \\mathbb{E}_{q_\\phi(\\mathbf{z}|\\mathbf{x})}[\\log p_\\theta(\\mathbf{x}|\\mathbf{z})] - \\text{KL}(q_\\phi(\\mathbf{z}|\\mathbf{x}) \\| p(\\mathbf{z}))$$",
      "The reparameterization trick enables gradient-based optimization through the stochastic sampling step. Instead of sampling z ~ N(mu, sigma^2) directly (through which gradients cannot flow), we sample epsilon ~ N(0,1) and compute z = mu + sigma*epsilon. The randomness is now in epsilon, which does not depend on parameters, so gradients with respect to mu and sigma flow through z = mu + sigma*epsilon by standard chain rule. This is what makes VAE training differentiable end-to-end.",
    ],
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
    deepDive: [
      "The original GAN minimax objective has a problematic gradient behavior: when the discriminator is good (D(G(z)) near 0), the generator gradient from -log(1-D(G(z))) becomes very small. The non-saturating heuristic replaces this with log(D(G(z))) for the generator, which has large gradients even when D(G(z)) is near 0. This does not change the equilibrium but dramatically improves gradient flow during early training when the discriminator easily distinguishes real from fake.",
      "$$\\min_G \\max_D \\mathbb{E}_{x \\sim p_{\\text{data}}}[\\log D(x)] + \\mathbb{E}_{z \\sim p_z}[\\log(1-D(G(z)))]$$",
      "Wasserstein GAN (WGAN) replaces the discriminator with a critic that computes the Wasserstein-1 distance between real and generated distributions. The critic is constrained to be 1-Lipschitz (via gradient penalty or weight clipping), and the generator minimizes the Earth Mover distance between distributions. The Wasserstein distance has meaningful gradients even when distributions have disjoint support, which is the main cause of GAN training instability in the original formulation.",
    ],
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
    deepDive: [
      "The change-of-variables formula gives exact density: log p(x) = log p(z) + log |det(dz/dx)| where z = f^{-1}(x) is the base space representation. Computing the Jacobian determinant is the computational challenge: a general d x d Jacobian costs O(d^3) to compute. Coupling layers (RealNVP) use an affine transform on half the dimensions conditioned on the other half, making the Jacobian triangular with O(d) determinant computation.",
      "$$\\log p_X(\\mathbf{x}) = \\log p_Z(f^{-1}(\\mathbf{x})) + \\log \\left|\\det \\frac{\\partial f^{-1}}{\\partial \\mathbf{x}}\\right| = \\log p_Z(\\mathbf{z}) + \\sum_{k=1}^{K} \\log \\left|\\det \\mathbf{J}_k\\right|$$",
      "Hutchinson's trace estimator approximates log|det J| via the identity log|det J| = tr(log J), then estimates tr(log J) as E[v^T (log J) v] where v is a random Rademacher or Gaussian vector. This requires only Jacobian-vector products rather than the full Jacobian, reducing cost from O(d^2) to O(d). Continuous normalizing flows use this trick at each ODE evaluation step, enabling scalable training of flows with unrestricted Jacobian structure.",
    ],
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
    deepDive: [
      "The score function s(x) = grad_x log p(x) is the gradient of the log-density with respect to data. It points in the direction of increasing probability density at each point in data space. Minimizing the Fisher divergence between the true score and the model score s_theta(x) is the score matching objective. The key insight is that this can be rewritten in a form that does not require the true score, only the model score and second derivatives of the model.",
      "$$\\mathcal{J}_{\\text{SM}}(\\theta) = \\mathbb{E}_{p(\\mathbf{x})}\\!\\left[\\frac{1}{2}\\|\\mathbf{s}_\\theta(\\mathbf{x})\\|^2 + \\text{tr}(\\nabla_{\\mathbf{x}}\\, \\mathbf{s}_\\theta(\\mathbf{x}))\\right]$$",
      "Denoising score matching avoids the expensive trace computation by corrupting data with noise and training the score model to predict the noise direction. For Gaussian noise with variance sigma^2, the optimal denoising score model is s_theta(x + sigma*epsilon) = -epsilon/sigma, which equals the true noisy score. Annealed importance sampling then follows the learned score fields at decreasing noise levels to generate samples, equivalent to DDPM's reverse diffusion process.",
    ],
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
    deepDive: [
      "LoRA is motivated by the hypothesis that weight updates during fine-tuning have low intrinsic rank. For a d x k weight matrix W_0, LoRA parameterizes the update as DeltaW = B*A where B is d x r and A is r x k, with r much smaller than min(d,k). The total additional parameters per layer is r*(d+k) instead of d*k. At r=8 with typical transformer dimensions d=k=4096, this is 8*8192=65536 instead of 16M parameters, a 256x reduction.",
      "$$\\mathbf{W}_{\\text{eff}} = \\mathbf{W}_0 + \\Delta\\mathbf{W} = \\mathbf{W}_0 + \\mathbf{B}\\mathbf{A}, \\quad \\mathbf{B} \\in \\mathbb{R}^{d \\times r},\\ \\mathbf{A} \\in \\mathbb{R}^{r \\times k},\\ r \\ll \\min(d,k)$$",
      "LoRA initializes A with random Gaussian and B with zeros, so DeltaW = 0 at the start of training. This ensures the model begins from the pretrained weights without any initial perturbation. The effective weight W_eff = W_0 + B*A is never explicitly materialized during training; the forward pass computes x*W_0 + x*A*B (two matrix multiplications) and adds them, which is equivalent at no extra cost. At deployment, B*A can be merged into W_0 for zero inference overhead.",
    ],
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
    deepDive: [
      "Uniform affine quantization maps a floating-point range [x_min, x_max] to integers in [0, 2^b-1] via x_q = clip(round(x/s + z), 0, 2^b-1) where s = (x_max - x_min)/(2^b-1) is the scale factor and z is the zero point. The quantization error for each value is bounded by s/2, so minimizing s (by calibrating the range to actual weight statistics rather than worst-case bounds) reduces error. Outlier values far from the bulk distribution can dominate the range and inflate s.",
      "$$x_q = \\text{clip}\\!\\left(\\left\\lfloor\\frac{x}{s}\\right\\rceil + z,\\ 0,\\ 2^b - 1\\right), \\quad s = \\frac{x_{\\max} - x_{\\min}}{2^b - 1}$$",
      "SmoothQuant (Xiao et al., 2022) addresses activation quantization challenges in LLMs, where activations have much larger outliers than weights. It applies a per-channel smoothing factor alpha that migrates quantization difficulty from activations to weights by dividing activations by alpha and multiplying the corresponding weight rows by alpha. Since weights are easier to quantize (they are static and can be calibrated offline), this mathematically equivalent transformation dramatically reduces activation quantization error.",
    ],
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
    deepDive: [
      "Weight saliency scores determine pruning order. Magnitude pruning uses |w_i| as a proxy for importance. Second-order methods use the change in loss induced by removing weight w_i, approximated as (1/2) * w_i^2 * (d^2L/dw_i^2), the product of weight magnitude squared and the corresponding Hessian diagonal element. Methods like Optimal Brain Surgeon (OBS) further include the off-diagonal Hessian to account for weight correlations.",
      "$$\\Delta \\mathcal{L}_i \\approx \\frac{1}{2} \\frac{w_i^2}{[\\mathbf{H}^{-1}]_{ii}}, \\quad \\text{where } \\mathbf{H} = \\frac{\\partial^2 \\mathcal{L}}{\\partial \\mathbf{w}^2}$$",
      "Structured pruning removes entire filters, attention heads, or transformer layers rather than individual weights. This produces dense matrices that are more hardware-efficient than unstructured sparse matrices, since modern GPU/TPU matrix multiplication units operate on dense blocks. Head pruning in transformers (Michel et al., 2019) found that up to 20 of 16 heads can be removed from each layer of BERT with minimal performance degradation on downstream tasks, suggesting significant redundancy in the attention pattern.",
    ],
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
    deepDive: [
      "Standard attention materializes the full N x N attention matrix in GPU HBM (high-bandwidth memory), requiring O(N^2) memory. For N=16384, this is 4 GB in FP16 for a single attention head. Flash Attention tiles Q, K, V into blocks that fit in SRAM (on-chip fast memory), computes attention in tiles, and uses the online softmax algorithm to combine block results without ever writing the full attention matrix to HBM. Memory usage drops to O(N) while results are numerically identical.",
      "$$\\mathbf{O} = \\text{softmax}\\!\\left(\\frac{\\mathbf{Q}\\mathbf{K}^\\top}{\\sqrt{d_k}}\\right)\\mathbf{V}, \\quad \\text{standard: } O(N^2 d) \\text{ HBM reads; FA: } O(N^2 d^2 / M) \\text{ HBM reads}$$",
      "The online softmax algorithm maintains running statistics (max and sum) for each row of the attention matrix as blocks of K are processed. When a new block reveals a higher maximum value, all previously accumulated outputs are rescaled by exp(old_max - new_max) to correct for the changed normalization. This allows the final output to be computed incrementally without storing intermediate attention weights, making the memory footprint independent of sequence length.",
    ],
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
    deepDive: [
      "RAG marginalizes over retrieved documents d to compute the probability of the output y given query x. The retriever computes p(d|x) as the softmax over relevance scores (typically dense vector inner products), and the generator computes p(y|x,d) for each retrieved document. In practice, the sum over all documents in the corpus is approximated by summing over the top-k retrieved documents, making inference tractable.",
      "$$p(\\mathbf{y} \\mid \\mathbf{x}) = \\sum_{d \\in \\mathcal{D}} p(d \\mid \\mathbf{x})\\, p(\\mathbf{y} \\mid \\mathbf{x}, d) \\approx \\sum_{j=1}^{k} p(d_j \\mid \\mathbf{x})\\, p(\\mathbf{y} \\mid \\mathbf{x}, d_j)$$",
      "The retriever in RAG typically uses a bi-encoder: query and document are encoded independently into dense vectors, and relevance is the inner product of their representations. This allows precomputing and indexing all document embeddings offline using approximate nearest neighbor search (FAISS, ScaNN). A cross-encoder that processes query and document together is more accurate but cannot be precomputed, making it suitable only for re-ranking a small candidate set retrieved by the bi-encoder.",
    ],
  },
};
