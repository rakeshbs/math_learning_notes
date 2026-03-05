export const EXPLANATIONS = {
  mdp: {
    what: "An MDP formalizes sequential decision-making with state transitions and rewards under the Markov property.",
    visual:
      "A directed graph of states shows action-labeled edges, each edge carrying transition probability and immediate reward.",
    intuition: [
      "State summarizes all information needed for control",
      "Actions influence future state distribution",
      "Rewards define objective, transitions define constraints",
      "Policy maps states to action choices",
      "Reward specification is arguably the hardest part — misspecified rewards lead to reward hacking",
    ],
    formula: "(S, A, P, R, gamma)",
    deepDive: [
      "The Markov property P(s_{t+1}|s_t,a_t,s_{t-1},a_{t-1},...) = P(s_{t+1}|s_t,a_t) means the current state is a sufficient statistic for the future. This is not an assumption about the world but a design choice about what to include in the state representation. If the state is too thin (omits relevant history), the Markov property fails and performance degrades.",
      "$$P(s_{t+1} \\mid s_t, a_t, s_{t-1}, a_{t-1}, \\ldots) = P(s_{t+1} \\mid s_t, a_t)$$",
      "The discount factor \\gamma \\in [0,1) serves two roles: it ensures the infinite-horizon return is finite (geometric series bound), and it encodes a preference for immediate rewards over delayed ones. Setting \\gamma close to 1 requires longer planning horizons to converge, while small \\gamma makes the agent myopic. In practice \\gamma is a hyperparameter that shapes learned behavior as much as the reward function does.",
    ],
  },
  return: {
    what: "Return is cumulative future reward, usually discounted to prioritize near-term outcomes and ensure finite-horizon-like behavior.",
    visual:
      "Future rewards are shown as shrinking bars over time, with each step multiplied by gamma.",
    intuition: [
      "Discount factor trades farsightedness vs short-term bias",
      "Return defines the optimization target of RL",
      "gamma near 1 values long-term planning",
      "Different reward scales drastically change learning dynamics",
      "Monte Carlo returns have zero bias but high variance; TD returns have some bias but lower variance",
    ],
    formula: "G_t = sum_{k=0}^infty gamma^k r_{t+k+1}",
    deepDive: [
      "The return G_t = \\sum_{k=0}^\\infty \\gamma^k r_{t+k+1} satisfies the recursive identity G_t = r_{t+1} + \\gamma G_{t+1}. This one-step recursion is the origin of the Bellman equation: rather than summing infinite future rewards, value functions only need to store the current estimate and bootstrap from the next state. Every TD and DP algorithm exploits this recursion.",
      "$$G_t = r_{t+1} + \\gamma r_{t+2} + \\gamma^2 r_{t+3} + \\cdots = r_{t+1} + \\gamma G_{t+1}$$",
      "The bias-variance tradeoff between Monte Carlo and TD estimates of the return is governed by the n-step return G_t^{(n)} = \\sum_{k=0}^{n-1}\\gamma^k r_{t+k+1} + \\gamma^n V(s_{t+n}). n=1 is standard TD (low variance, biased through V), n=\\infty is Monte Carlo (unbiased, high variance). TD(\\lambda) combines all n-step returns with geometric weights \\lambda^{n-1}, and the optimal \\lambda is a problem-dependent hyperparameter.",
    ],
  },
  bellman: {
    what: "Bellman equations express value recursively: current value equals immediate reward plus discounted next-state value.",
    visual:
      "A node value equals local reward plus discounted weighted average of successor node values.",
    intuition: [
      "Local consistency condition drives dynamic programming",
      "Optimal control arises from Bellman optimality operator",
      "Value estimation becomes repeated fixed-point updates",
      "Contraction under gamma < 1 gives convergence guarantees",
      "Bellman equations have a unique fixed point under contraction mapping — the basis of convergence proofs",
    ],
    formula: "V^pi(s) = E[r + gamma V^pi(s') | s]",
    deepDive: [
      "The Bellman optimality operator T is a contraction mapping in the sup-norm with contraction factor \\gamma: \\|TV - TU\\|_\\infty \\leq \\gamma \\|V - U\\|_\\infty. By Banach's fixed-point theorem, repeated application of T from any initial V_0 converges to the unique fixed point V^* at a geometric rate. This is the formal guarantee behind value iteration and policy iteration.",
      "$$\\|\\mathcal{T}V - \\mathcal{T}U\\|_\\infty \\leq \\gamma \\|V - U\\|_\\infty, \\quad \\mathcal{T}V(s) = \\max_a \\mathbb{E}[r + \\gamma V(s') \\mid s,a]$$",
      "The Bellman equation for the action-value function Q^*(s,a) = r(s,a) + \\gamma \\sum_{s'} P(s'|s,a) \\max_{a'} Q^*(s',a') is the foundation of Q-learning. Crucially, Q^* encodes the optimal policy directly: \\pi^*(s) = \\operatorname{argmax}_a Q^*(s,a). This eliminates the need to know the transition model at execution time — given Q^*, greedy action selection is optimal.",
    ],
  },
  policyevaluation: {
    what: "Policy evaluation computes how good a fixed policy is by estimating V^pi or Q^pi under its induced trajectory distribution.",
    visual:
      "With policy frozen, state values iteratively refine until Bellman residuals shrink.",
    intuition: [
      "Separates 'evaluate' from 'improve' phases",
      "Foundational in generalized policy iteration",
      "Can be exact in tabular finite MDPs",
      "Function approximation introduces bias/variance tradeoffs",
      "Monte Carlo evaluation waits for episode end; TD evaluation updates after each step",
    ],
    formula: "V_{k+1}(s) <- E_pi[r + gamma V_k(s') | s]",
    deepDive: [
      "The policy evaluation update V_{k+1} = T^\\pi V_k is a linear operator (since \\pi is fixed), corresponding to solving the linear system (I - \\gamma P^\\pi) V^\\pi = r^\\pi. The matrix I - \\gamma P^\\pi is invertible because \\gamma < 1 means all eigenvalues of \\gamma P^\\pi lie strictly inside the unit circle. Exact policy evaluation solves this linear system directly; iterative evaluation applies T^\\pi repeatedly.",
      "$$(I - \\gamma P^\\pi)V^\\pi = r^\\pi \\implies V^\\pi = (I - \\gamma P^\\pi)^{-1} r^\\pi$$",
      "Temporal difference learning performs policy evaluation online by updating V(s) \\leftarrow V(s) + \\alpha[r + \\gamma V(s') - V(s)] after each transition. The TD error \\delta = r + \\gamma V(s') - V(s) serves as a local Bellman residual. Under linear function approximation, TD(0) converges to a fixed point that minimizes a weighted squared Bellman residual — not the true projection error, which is an important distinction.",
    ],
  },
  valueiteration: {
    what: "Value iteration applies Bellman optimality backups repeatedly to converge toward optimal value and induced greedy policy.",
    visual:
      "Each backup chooses best successor action, so value fronts propagate backward from high-reward regions.",
    intuition: [
      "Combines evaluation and improvement in one operator",
      "Works well in small tabular models",
      "Converges by contraction in discounted settings",
      "Model knowledge is required for exact backups",
      "Asynchronous value iteration updates states in arbitrary order and still converges",
    ],
    formula: "V_{k+1}(s) <- max_a E[r + gamma V_k(s') | s,a]",
    deepDive: [
      "Value iteration achieves \\epsilon-optimality after at most \\lceil \\log(1/\\epsilon(1-\\gamma)) / \\log(1/\\gamma) \\rceil iterations, since each step reduces the error by a factor of \\gamma. The greedy policy \\pi_k with respect to V_k is \\epsilon/(1-\\gamma)-optimal when \\|V_k - V^*\\|_\\infty \\leq \\epsilon. This means we can stop early and still extract a near-optimal policy.",
      "$$\\|V_{k} - V^*\\|_\\infty \\leq \\gamma^k \\|V_0 - V^*\\|_\\infty \\xrightarrow{k\\to\\infty} 0$$",
      "Policy iteration alternates full policy evaluation (solve V^{\\pi_k}) with policy improvement (\\pi_{k+1}(s) = \\operatorname{argmax}_a Q^{\\pi_k}(s,a)). The policy improvement theorem guarantees V^{\\pi_{k+1}}(s) \\geq V^{\\pi_k}(s) for all s, and the sequence of policies must converge to optimality in a finite MDP since there are finitely many policies. Policy iteration typically converges in far fewer iterations than value iteration.",
    ],
  },
  temporaldifference: {
    what: "TD learning updates value estimates from one-step bootstrapped targets instead of waiting for full returns.",
    visual:
      "Current estimate is nudged toward reward plus discounted next estimate after each transition.",
    intuition: [
      "Bootstrapping reduces variance but adds bias",
      "Online updates are data-efficient",
      "TD error drives learning signal",
      "Core primitive behind many modern RL methods",
      "TD(λ) interpolates between TD(0) and Monte Carlo via eligibility traces controlled by λ",
    ],
    formula: "V(s) <- V(s) + alpha [r + gamma V(s') - V(s)]",
    deepDive: [
      "Eligibility traces assign credit to recently visited states for current TD errors. The trace e(s) decays geometrically: after visiting s, e(s) is incremented by 1, then multiplied by \\gamma\\lambda at every subsequent step. The TD(\\lambda) update then applies the TD error \\delta_t to all states proportionally to their trace: V(s) \\leftarrow V(s) + \\alpha \\delta_t e_t(s).",
      "$$e_t(s) = \\gamma \\lambda\\, e_{t-1}(s) + \\mathbf{1}[s_t = s], \\quad V(s) \\leftarrow V(s) + \\alpha\\, \\delta_t\\, e_t(s)$$",
      "The TD fixed point under linear function approximation V_\\theta(s) = \\theta^T \\phi(s) satisfies \\theta^T \\Phi^T D (\\Phi \\theta - T\\Phi \\theta) = 0, where D is the on-policy state visitation matrix and \\Phi is the feature matrix. The solution is not the least-squares projection of V^\\pi onto the function class but a different fixed point. LSTD computes this fixed point directly without the step-size sensitivity of iterative TD.",
    ],
  },
  qlearning: {
    what: "Q-learning is off-policy TD control that learns optimal action-values via max-over-actions bootstrapping.",
    visual:
      "Visited state-action cell is updated toward reward plus discounted best estimated next-action value.",
    intuition: [
      "Learns greedy target independent of behavior policy",
      "Converges tabularly under sufficient exploration",
      "Overestimation bias can appear with max operator",
      "Simple and powerful baseline for discrete actions",
      "Double Q-learning addresses overestimation by separating action selection from value evaluation",
    ],
    formula: "Q(s,a) <- Q(s,a)+alpha[r+gamma max_{a'}Q(s',a')-Q(s,a)]",
    deepDive: [
      "Q-learning's maximization bias arises because \\max_{a'} Q(s',a') is a biased estimator of \\max_{a'} Q^*(s',a'): the max of noisy estimates exceeds the estimate of the max in expectation. Double Q-learning maintains two independent estimators Q_A and Q_B: use Q_A to select the action and Q_B to evaluate it, or vice versa. This decoupling removes the positive bias at the cost of slower learning.",
      "$$Q_A(s,a) \\leftarrow Q_A(s,a) + \\alpha\\left[r + \\gamma Q_B\\!\\left(s', \\operatorname{argmax}_{a'} Q_A(s',a')\\right) - Q_A(s,a)\\right]$$",
      "Tabular Q-learning converges to Q^* with probability 1 when every state-action pair is visited infinitely often and step sizes satisfy \\sum_t \\alpha_t = \\infty and \\sum_t \\alpha_t^2 < \\infty (the Robbins-Monro conditions). With function approximation these guarantees generally break down — the deadly triad of off-policy learning, function approximation, and bootstrapping can cause divergence.",
    ],
  },
  dqn: {
    what: "DQN extends Q-learning with neural networks, replay buffers, and target networks for stable high-dimensional control.",
    visual:
      "Experiences enter replay memory; minibatches train Q-network while slow target network provides bootstrap targets.",
    intuition: [
      "Replay breaks temporal correlation",
      "Target network reduces moving-target instability",
      "Function approximation enables raw-observation control",
      "Still sensitive to reward scaling and exploration design",
      "Prioritized experience replay samples transitions proportional to TD error magnitude",
    ],
    formula: "L = E[(r+gamma max_{a'}Q_theta-(s',a') - Q_theta(s,a))^2]",
    deepDive: [
      "The DQN loss minimizes the squared TD error using a frozen target network \\theta^- that is periodically synchronized with the online network \\theta. Without the target network, gradient updates chase a moving target, creating instability. The target is treated as a fixed label during each gradient step: \\hat{y} = r + \\gamma \\max_{a'} Q_{\\theta^-}(s',a'), and the gradient flows only through Q_\\theta(s,a).",
      "$$\\mathcal{L}(\\theta) = \\mathbb{E}_{(s,a,r,s') \\sim \\mathcal{D}}\\!\\left[\\left(r + \\gamma \\max_{a'} Q_{\\theta^-}(s',a') - Q_\\theta(s,a)\\right)^2\\right]$$",
      "Prioritized experience replay (PER) samples transitions with probability proportional to |\\delta_i|^\\omega, where \\delta_i is the absolute TD error and \\omega controls the degree of prioritization. High-error transitions are sampled more often because they carry more learning signal. Importance sampling weights w_i \\propto (1/p_i)^\\beta correct for the non-uniform sampling and anneal toward unbiased updates as training progresses.",
    ],
  },
  distributionalrl: {
    what: "Distributional RL models the full distribution of returns, not just the expected value.",
    visual:
      "Each state-action has a return histogram that shifts and sharpens with updates.",
    intuition: [
      "Captures risk-sensitive information",
      "Can improve stability and sample efficiency",
      "Supports richer exploration and control criteria",
      "Mean Q is only one summary of learned distribution",
      "C51 and QR-DQN represent return distributions as discrete atoms or quantiles",
    ],
    formula: "Z(s,a) =_D r + gamma Z(s',a')",
    deepDive: [
      "C51 represents the return distribution as a categorical distribution over N fixed atoms \\{z_1,\\ldots,z_N\\}. The Bellman update shifts and scales each atom by r + \\gamma z_i, then projects the resulting distribution back onto the fixed support using a linear interpolation operator. The network outputs N-dimensional softmax probabilities for each state-action pair, trained via cross-entropy.",
      "$$\\mathcal{T}Z(s,a) \\overset{d}{=} r + \\gamma Z(s', \\pi(s')), \\quad \\text{loss} = \\sum_i p_i \\log \\hat{p}_i$$",
      "QR-DQN represents the return distribution via N quantile values, minimizing the quantile Huber loss (asymmetric L1 loss) for each quantile fraction \\tau_i = (2i-1)/(2N). Unlike C51, no fixed support is needed — quantiles adapt freely. IQN further extends this by sampling \\tau from Uniform(0,1) at runtime, effectively learning the entire quantile function and enabling risk-sensitive policies by distorting the quantile fractions.",
    ],
  },
  policygradient: {
    what: "Policy gradient methods optimize parameterized policy directly by ascending expected-return gradient.",
    visual:
      "Trajectories sampled from current policy produce weighted gradient arrows that update policy parameters.",
    intuition: [
      "Handles continuous and stochastic actions naturally",
      "High variance requires variance reduction tricks",
      "No explicit max over actions needed",
      "Objective is long-horizon expected return",
      "Advantage function A(s,a) = Q(s,a) - V(s) is the natural baseline that reduces variance without bias",
    ],
    formula: "nabla J(theta) = E[nabla log pi_theta(a|s) * G_t]",
    deepDive: [
      "The policy gradient theorem states that \\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\pi_\\theta}[\\nabla_\\theta \\log \\pi_\\theta(a|s) \\cdot Q^{\\pi_\\theta}(s,a)], where the expectation is under the on-policy state-action distribution d^{\\pi_\\theta}(s,a). Remarkably, the gradient does not require differentiating through the environment dynamics — only through the policy. This is the REINFORCE log-derivative trick.",
      "$$\\nabla_\\theta J(\\theta) = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\nabla_\\theta \\log \\pi_\\theta(a \\mid s) \\cdot Q^{\\pi_\\theta}(s, a)\\right]$$",
      "Adding a state-dependent baseline b(s) to the policy gradient theorem leaves the gradient unbiased: \\nabla_\\theta J = \\mathbb{E}[\\nabla_\\theta \\log \\pi_\\theta \\cdot (Q - b(s))]. The optimal baseline minimizing variance is a weighted version of V(s), and using b(s) = V(s) exactly gives the advantage A(s,a) = Q(s,a) - V(s). Subtracting this baseline reduces gradient variance without introducing bias — this is the foundation of actor-critic methods.",
    ],
  },
  actorcritic: {
    what: "Actor-critic combines policy optimization (actor) with value estimation (critic) for lower-variance policy updates.",
    visual:
      "Actor chooses actions; critic evaluates them via TD error, which feeds back as learning signal.",
    intuition: [
      "Critic acts as learned baseline",
      "Balances bias and variance better than pure REINFORCE",
      "Unifies value-based and policy-based ideas",
      "Most practical modern RL methods are actor-critic variants",
      "Advantage Actor-Critic (A2C) and Asynchronous Advantage (A3C) are the standard modern implementations",
    ],
    formula: "theta <- theta + alpha * nabla log pi_theta(a|s) * A_hat",
    deepDive: [
      "The TD error \\delta_t = r_{t+1} + \\gamma V(s_{t+1}) - V(s_t) is an unbiased sample of the advantage A(s_t,a_t) when V is the true value function. Since V is approximated, \\delta_t is actually a biased advantage estimate, but the bias is small when V is well trained. Using \\delta_t as the actor update signal couples critic quality directly to actor gradient quality.",
      "$$\\hat{A}_t = \\delta_t = r_{t+1} + \\gamma V(s_{t+1}) - V(s_t), \\quad \\Delta\\theta \\propto \\nabla_\\theta \\log \\pi_\\theta(a_t|s_t) \\cdot \\hat{A}_t$$",
      "Generalized Advantage Estimation (GAE) with parameter \\lambda computes \\hat{A}_t^{GAE} = \\sum_{l=0}^\\infty (\\gamma\\lambda)^l \\delta_{t+l}. At \\lambda=0 this is a one-step TD advantage (low variance, high bias); at \\lambda=1 this is the full Monte Carlo advantage (unbiased, high variance). Tuning \\lambda \\in (0,1) controls the bias-variance tradeoff for the advantage estimates independently of the discount factor \\gamma.",
    ],
  },
  ppo: {
    what: "PPO stabilizes policy updates using clipped probability-ratio objectives that limit destructive policy shifts.",
    visual:
      "Large update incentives are flattened by clipping, keeping new policy near old policy trust region.",
    intuition: [
      "Simple robust baseline for many tasks",
      "Multiple epochs over same rollout data",
      "Needs careful normalization and advantage estimation",
      "On-policy data usage limits sample efficiency",
      "GAE (Generalized Advantage Estimation) with λ in [0,1] interpolates Monte Carlo and 1-step TD advantage",
    ],
    formula:
      "L = E[min(r_t A_t, clip(r_t,1-eps,1+eps)A_t)]",
    deepDive: [
      "The PPO clipped objective L^{CLIP}(\\theta) = \\mathbb{E}_t[\\min(r_t(\\theta)A_t, \\operatorname{clip}(r_t(\\theta), 1-\\epsilon, 1+\\epsilon)A_t)] removes the incentive to move the probability ratio r_t = \\pi_\\theta(a|s)/\\pi_{\\theta_{old}}(a|s) beyond [1-\\epsilon, 1+\\epsilon]. When A_t > 0 and r_t > 1+\\epsilon, the gradient of the clipped objective is zero — the policy is not rewarded for increasing the ratio further.",
      "$$L^{\\text{CLIP}}(\\theta) = \\mathbb{E}_t\\!\\left[\\min\\!\\left(r_t(\\theta)\\hat{A}_t,\\; \\operatorname{clip}(r_t(\\theta), 1{-}\\varepsilon, 1{+}\\varepsilon)\\hat{A}_t\\right)\\right]$$",
      "TRPO (the precursor to PPO) optimizes the surrogate objective subject to a KL divergence constraint \\mathbb{E}_s[\\text{KL}(\\pi_{\\theta_{old}}(\\cdot|s) \\| \\pi_\\theta(\\cdot|s))] \\leq \\delta. This requires computing the Fisher information matrix and natural gradient steps, which is computationally expensive. PPO's clipping approximates this trust region without second-order computations, making it scalable to large neural network policies.",
    ],
  },
  entropyrl: {
    what: "Entropy-regularized RL augments reward objective with policy entropy to promote persistent exploration.",
    visual:
      "Policy distribution remains broad early, then sharpens only when value evidence becomes strong.",
    intuition: [
      "Prevents premature deterministic collapse",
      "Connects to maximum-entropy control",
      "Temperature parameter controls exploration pressure",
      "Key ingredient in SAC-style algorithms",
      "SAC (Soft Actor-Critic) automatically tunes the entropy temperature α for self-adjusting exploration",
    ],
    formula: "J = E[sum_t (r_t + alpha H(pi(.|s_t)))]",
    deepDive: [
      "The soft Bellman equations augment the standard Bellman equations with an entropy term: V^\\pi_{soft}(s) = \\mathbb{E}_\\pi[\\sum_t \\gamma^t(r_t + \\alpha H(\\pi(\\cdot|s_t)))]. The optimal soft policy is a Boltzmann distribution over Q values: \\pi^*_{soft}(a|s) \\propto \\exp(Q^*_{soft}(s,a)/\\alpha). Higher temperature \\alpha means the policy spreads mass more uniformly; \\alpha \\to 0 recovers the hard-greedy optimal policy.",
      "$$\\pi^*_{\\text{soft}}(a \\mid s) = \\frac{\\exp\\left(Q^*_{\\text{soft}}(s,a)/\\alpha\\right)}{\\sum_{a'} \\exp\\left(Q^*_{\\text{soft}}(s,a')/\\alpha\\right)}$$",
      "SAC automatically tunes \\alpha by treating the minimum expected entropy as a constraint: \\mathbb{E}_{\\pi}[\\log \\pi(a|s)] \\geq \\mathcal{H}_{target}. The dual optimization adjusts \\alpha to satisfy this constraint in expectation, increasing \\alpha when entropy is too low (not exploring enough) and decreasing it when entropy is too high (not exploiting enough). This removes the sensitive manual tuning of the exploration-exploitation balance.",
    ],
  },
  modelbasedrl: {
    what: "Model-based RL learns or uses dynamics model to plan, evaluate actions, and improve sample efficiency.",
    visual:
      "A learned world model simulates futures, and planner picks actions maximizing predicted long-term value.",
    intuition: [
      "Can be more sample-efficient than model-free methods",
      "Model bias can corrupt planning",
      "Planning horizon and uncertainty handling are critical",
      "Hybrid model-based/model-free methods are common",
      "Dyna-Q integrates model-free updates with simulated transitions from a learned model",
    ],
    formula: "p_hat(s',r|s,a) learned, then plan over p_hat",
    deepDive: [
      "Dyna-Q interleaves real environment interactions with simulated updates from a tabular model. After each real transition (s,a,r,s'), the model is updated and then k simulated transitions are sampled from the model for additional Q-updates. With a perfect model, this multiplies the effective number of real transitions by k+1. Model errors introduce bias that worsens with planning depth.",
      "$$\\hat{Q}(s,a) \\leftarrow \\hat{Q}(s,a) + \\alpha\\left[r + \\gamma \\max_{a'} \\hat{Q}(\\hat{s}', a') - \\hat{Q}(s,a)\\right], \\quad (\\hat{s}',r) \\sim \\hat{p}$$",
      "Uncertainty quantification is central to model-based RL. Ensemble methods maintain multiple model networks and use disagreement among ensemble predictions as an epistemic uncertainty signal. MBPO (Model-Based Policy Optimization) limits rollout length to control model bias: short rollouts exploit high model accuracy near training data; long rollouts compound errors. Balancing rollout length against model accuracy is the key algorithmic choice.",
    ],
  },
  mcts: {
    what: "MCTS builds a partial search tree online, balancing exploration and exploitation during lookahead planning.",
    visual:
      "Tree branches expand where UCB scores are promising, with backups propagating rollout returns to parent nodes.",
    intuition: [
      "Selective search focuses compute on useful branches",
      "Combines priors, value estimates, and rollout statistics",
      "Strong in discrete combinatorial games",
      "Search depth and simulation budget govern quality",
      "AlphaZero combines MCTS with a policy-value network trained from self-play to surpass human performance",
    ],
    formula: "a = argmax_a [Q(s,a) + c * sqrt(log N(s)/N(s,a))]",
    deepDive: [
      "The UCB1 selection criterion balances exploitation (high Q(s,a)) with exploration (rarely visited nodes). The confidence bonus \\sqrt{\\log N(s)/N(s,a)} grows as N(s,a) stays small relative to total visits N(s), ensuring every action is eventually tried. UCB1 achieves O(\\sqrt{T \\log T}) regret in the bandit setting, and MCTS inherits this exploration guarantee within each subtree.",
      "$$a^* = \\operatorname{argmax}_a \\left[Q(s,a) + c\\sqrt{\\frac{\\ln N(s)}{N(s,a)}}\\right]$$",
      "AlphaZero's PUCT (Polynomial Upper Confidence Trees) variant adds a prior policy network term: U(s,a) = c \\cdot P(a|s) \\cdot \\sqrt{N(s)}/(1+N(s,a)). The prior P(a|s) from a trained neural network biases search toward promising actions from the start, reducing the burden on pure exploration. Value estimates from the network supplement or replace rollouts, dramatically improving planning efficiency.",
    ],
  },
  worldmodels: {
    what: "World models compress observations into latent states and learn latent dynamics for imagination-based control.",
    visual:
      "Agent rolls out imagined latent trajectories before acting in real environment.",
    intuition: [
      "Latent modeling reduces planning complexity",
      "Prediction quality bounds planning quality",
      "Useful for long-horizon sparse-reward settings",
      "Uncertainty calibration is essential for robustness",
      "Dreamer-v3 demonstrates that world-model training alone can enable general problem solving",
    ],
    formula: "z_{t+1} = f_theta(z_t,a_t),  o_t ~ g_phi(z_t)",
    deepDive: [
      "The Recurrent State Space Model (RSSM) in Dreamer uses both deterministic and stochastic latent variables: h_t = f(h_{t-1}, z_{t-1}, a_{t-1}) (GRU recurrence) and z_t ~ q(z_t|h_t, o_t) (inferred from observation) or z_t ~ p(z_t|h_t) (prior during imagination). The ELBO objective trains the model: \\mathcal{L} = \\mathbb{E}_q[\\log p(o_t|h_t,z_t)] - \\beta \\text{KL}[q(z_t|h_t,o_t) \\| p(z_t|h_t)].",
      "$$\\mathcal{L} = \\mathbb{E}_q\\!\\left[\\sum_t \\log p(o_t|h_t,z_t) - \\beta\\, \\text{KL}\\!\\left[q(z_t|h_t,o_t) \\,\\|\\, p(z_t|h_t)\\right]\\right]$$",
      "Policy optimization in imagination unrolls H steps in latent space — no environment interaction needed during this phase. The actor maximizes imagined returns while the value function provides the bootstrap target at the final imagined step. Backpropagation through the differentiable latent dynamics (straight-through gradients or reparameterization) allows policy gradients to flow through the entire imagined trajectory.",
    ],
  },
  onpolicy: {
    what: "On-policy methods learn only from data generated by current policy, tightly coupling data collection and update.",
    visual:
      "Rollouts are collected, policy is updated, old data is discarded or down-weighted.",
    intuition: [
      "Stable objective-policy consistency",
      "Lower sample reuse compared to off-policy",
      "Simple importance weighting needs are reduced",
      "Common in PPO/A2C style pipelines",
      "Importance sampling extends on-policy data to off-policy updates at the cost of higher variance",
    ],
    formula: "Data D ~ pi_theta, optimize J(theta;D)",
    deepDive: [
      "On-policy methods directly optimize J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta}[R(\\tau)], so the data distribution and the optimization target are always aligned. This alignment prevents the distribution shift problems that plague off-policy methods but requires discarding experience after each policy update. Multiple PPO epochs over the same batch introduce mild off-policy error controlled by the clipping mechanism.",
      "$$J(\\theta) = \\mathbb{E}_{\\tau \\sim \\pi_\\theta}[R(\\tau)] = \\mathbb{E}_{\\pi_\\theta}\\!\\left[\\sum_t \\gamma^t r_t\\right]$$",
      "Importance sampling can re-weight off-policy transitions for use in on-policy objectives: \\mathbb{E}_{a \\sim \\beta}[w(s,a) f(s,a)] = \\mathbb{E}_{a \\sim \\pi}[f(s,a)] where w = \\pi(a|s)/\\beta(a|s). However, the variance of importance weights grows exponentially with trajectory length, making long-horizon off-policy correction practically infeasible without variance reduction techniques like per-decision importance weights or V-trace clipping.",
    ],
  },
  offpolicy: {
    what: "Off-policy methods learn a target policy from behavior policy data, enabling replay and broader data reuse.",
    visual:
      "Experience from older or different policies still updates current value/policy estimates.",
    intuition: [
      "Great sample efficiency via replay",
      "Distribution mismatch can destabilize learning",
      "Importance correction may be needed",
      "Central to Q-learning and SAC",
      "Behavior-regularized objectives (CQL, IQL) prevent value extrapolation errors in offline settings",
    ],
    formula: "E_{(s,a)~beta}[ w(s,a) * update for pi ]",
    deepDive: [
      "The fundamental off-policy challenge is that the Bellman target for Q^\\pi uses the target policy \\pi, but data is collected by behavior policy \\beta. Q-learning sidesteps this with a max over actions: the max is equivalent to evaluating the greedy policy, making Q-learning off-policy by design without importance sampling. This works because the max is taken analytically, not through sampled actions from \\beta.",
      "$$Q(s,a) \\leftarrow r + \\gamma \\max_{a'} Q(s',a') \\quad \\text{(target policy implicit via max)}$$",
      "V-trace (used in IMPALA for distributed RL) clips per-step importance ratios: c_s = \\min(\\bar{c}, \\pi(a_s|s_s)/\\mu(a_s|s_s)) and \\rho_s = \\min(\\bar{\\rho}, \\pi/\\mu). These clipped ratios bound the variance of multi-step off-policy returns while maintaining a small controlled bias. The target policy learned is the policy that would have been learned with clipping ratio \\bar{\\rho} — slightly different from \\pi but stable.",
    ],
  },
  offlinerl: {
    what: "Offline RL learns policies solely from fixed logged datasets without additional environment interaction.",
    visual:
      "Policy must stay near data-supported actions to avoid catastrophic out-of-distribution extrapolation.",
    intuition: [
      "No online exploration available",
      "Conservative objectives reduce extrapolation error",
      "Dataset coverage dominates achievable performance",
      "Evaluation without deployment is difficult",
      "Conservative Q-learning (CQL) penalizes Q-values for out-of-dataset actions during training",
    ],
    formula: "maximize J(pi) subject to pi(a|s) near dataset support",
    deepDive: [
      "Conservative Q-Learning (CQL) adds a regularization term to the Q-learning objective that penalizes Q-values for out-of-distribution actions: \\min_Q \\alpha \\mathbb{E}_{s\\sim D}[\\log \\sum_a \\exp Q(s,a) - \\mathbb{E}_{a\\sim D}[Q(s,a)]] + \\text{standard TD loss}. The first term pushes Q down for unobserved actions; the second pushes it up for observed actions — creating a conservative lower bound.",
      "$$\\min_Q \\;\\alpha\\, \\mathbb{E}_{s}\\!\\left[\\log\\sum_a e^{Q(s,a)} - \\mathbb{E}_{a\\sim\\mathcal{D}}[Q(s,a)]\\right] + \\frac{1}{2}\\mathbb{E}_{(s,a,s')\\sim\\mathcal{D}}\\!\\left[(Q - \\mathcal{T}Q)^2\\right]$$",
      "The distributional shift problem in offline RL is more severe than in supervised learning because errors compound through the Bellman backup. When a policy visits an out-of-distribution (OOD) state, the Q-values there were never trained on real data and may be wildly overestimated. The policy then exploits these overestimates, visiting OOD states more, worsening the problem recursively. Behavior-constrained methods like BEAR constrain the policy to the support of the data distribution to break this cycle.",
    ],
  },
  imitationlearning: {
    what: "Imitation learning trains policies from expert demonstrations instead of trial-and-error reward optimization.",
    visual:
      "Learner trajectory is pulled toward expert trajectory manifold in state-action space.",
    intuition: [
      "Fast learning when expert data is strong",
      "Behavior cloning suffers compounding error",
      "DAgger mitigates covariate shift",
      "Useful bootstrap for later RL fine-tuning",
      "DAgger (Dataset Aggregation) queries the expert on states visited by the learner to reduce covariate shift",
    ],
    formula: "min_theta E_{(s,a)~D_expert}[-log pi_theta(a|s)]",
    deepDive: [
      "Behavior cloning accumulates compounding errors because the learned policy visits states not covered in the expert dataset. If the policy makes a small error at state s and visits a slightly off-distribution state s', its action there may be worse, leading to s'', and so on. The error grows as O(T^2\\epsilon) over a T-step horizon where \\epsilon is the per-step imitation error — quadratic in horizon, not linear.",
      "$$J_{BC}(\\theta) = \\mathbb{E}_{(s,a)\\sim\\mathcal{D}_{\\text{expert}}}\\![-\\log\\pi_\\theta(a|s)], \\quad \\text{error} \\sim O(T^2 \\varepsilon)$$",
      "Inverse Reinforcement Learning (IRL) infers the reward function from demonstrations rather than directly imitating actions. MaxEnt IRL posits that the expert follows a distribution over trajectories proportional to exp(R(\\tau)) and fits R to maximize the likelihood of demonstrations. GAIL (Generative Adversarial Imitation Learning) sidesteps explicit reward inference by matching the learner's state-action occupancy measure to the expert's using an adversarial discriminator.",
    ],
  },
  bandits: {
    what: "Bandits study explore-exploit tradeoffs in one-step decision problems without state transitions.",
    visual:
      "Each arm has uncertain reward; agent allocates pulls to identify and exploit best arm.",
    intuition: [
      "Core sandbox for exploration theory",
      "Regret is primary metric",
      "UCB/Thompson are classical strategies",
      "Many RL exploration ideas start in bandits",
      "Thompson sampling maintains posterior over arm parameters and samples from it to decide exploration",
    ],
    formula: "Regret_T = sum_{t=1}^T (mu* - mu_{a_t})",
    deepDive: [
      "The Lai-Robbins lower bound establishes that for any consistent algorithm, cumulative regret on a K-arm Gaussian bandit grows at least as fast as \\sum_{i:\\Delta_i>0} (\\log T)/\\Delta_i as T → \\infty, where \\Delta_i = \\mu^* - \\mu_i is the gap for arm i. UCB1 and Thompson sampling match this lower bound up to constants, making them asymptotically optimal.",
      "$$\\text{Regret}_T \\geq \\sum_{i:\\Delta_i > 0} \\frac{\\ln T}{\\text{KL}(\\mu_i, \\mu^*)} \\cdot (1-o(1))$$",
      "Thompson sampling maintains a posterior distribution over each arm's mean reward and selects arms by sampling once from each posterior and picking the arm with the highest sample. For Bernoulli rewards with Beta priors, the posterior is Beta(\\alpha_i + S_i, \\beta_i + F_i) after S_i successes and F_i failures. Thompson sampling achieves optimal regret while being computationally lightweight — its empirical performance typically matches or exceeds UCB.",
    ],
  },
  intrinsicmotivation: {
    what: "Intrinsic motivation augments external reward with curiosity/novelty signals to drive exploration.",
    visual:
      "States with high prediction error or novelty emit bonus reward, steering agent into underexplored regions.",
    intuition: [
      "Useful in sparse-reward tasks",
      "Can cause distraction from true task reward",
      "Prediction error bonuses need normalization",
      "Balances exploration breadth and task focus",
      "RND (Random Network Distillation) measures novelty as prediction error of a random fixed target network",
    ],
    formula: "r_total = r_ext + beta * r_int",
    deepDive: [
      "ICM (Intrinsic Curiosity Module) decomposes the intrinsic bonus into a forward model prediction error in learned feature space. The feature encoder is trained via an inverse model to predict actions from consecutive state pairs, making the features action-relevant. Prediction error of the forward model \\|\\hat{\\phi}(s_{t+1}) - \\phi(s_{t+1})\\|^2 in this learned space provides a reward that is robust to visual noise and irrelevant dimensions.",
      "$$r^{\\text{int}}_t = \\eta \\cdot \\|\\hat{\\phi}(s_{t+1}; \\theta_F) - \\phi(s_{t+1})\\|^2$$",
      "RND (Random Network Distillation) trains a predictor network to replicate the outputs of a fixed randomly initialized target network. Novel states produce high prediction error because the predictor has not been trained on them yet. As a state is visited more, the predictor improves and the bonus decays. Unlike ICM, RND requires no forward model and no action prediction — just two networks sharing the same architecture.",
    ],
  },
  rewardshaping: {
    what: "Reward shaping modifies reward to accelerate learning while preserving or approximating intended optimal behavior.",
    visual:
      "Sparse terminal reward is supplemented with dense intermediate guidance gradients.",
    intuition: [
      "Bad shaping can optimize wrong behavior",
      "Potential-based shaping preserves optimal policy",
      "Domain knowledge can greatly speed training",
      "Reward hacking risk rises with complex shaping",
      "Potential-based shaping F(s,s') = γΦ(s') - Φ(s) preserves the set of optimal policies exactly",
    ],
    formula: "r'(s,a,s') = r + gamma Phi(s') - Phi(s)",
    deepDive: [
      "Ng, Harada and Russell proved that potential-based shaping F(s,a,s') = \\gamma\\Phi(s') - \\Phi(s) is the unique class of shaping rewards that preserves the optimal policy of every MDP. The shaped value function satisfies V'^*(s) = V^*(s) + \\Phi(s) — the optimal policy is unchanged because every trajectory's return changes by a constant \\Phi(s_0) - \\gamma^T\\Phi(s_T) that depends only on start and end state, not on the path.",
      "$$r'(s,a,s') = r(s,a,s') + \\gamma\\Phi(s') - \\Phi(s) \\implies \\pi'^* = \\pi^*$$",
      "Non-potential shaping can introduce new optimal policies that satisfy the shaped reward but are suboptimal for the true reward. A common failure case is reward hacking: an agent discovers that going back and forth between two states accumulates shaping reward without making progress. Policy invariance under potential-based shaping guarantees this cannot happen, making it the principled choice when domain knowledge about good intermediate states is available.",
    ],
  },
  multiagentrl: {
    what: "Multi-agent RL studies learning with multiple simultaneously adapting agents in cooperative/competitive settings.",
    visual:
      "Each agent's update changes others' environment, creating a moving-target non-stationary learning process.",
    intuition: [
      "Game-theoretic equilibrium replaces single-agent optimum",
      "Credit assignment across agents is difficult",
      "Centralized training/decentralized execution is common",
      "Coordination and opponent modeling are key",
      "CTDE (Centralized Training with Decentralized Execution) is the dominant practical paradigm",
    ],
    formula: "J_i(pi_i, pi_{-i}) for each agent i",
    deepDive: [
      "Nash equilibrium is the multi-agent solution concept where no agent can improve its expected return by unilaterally changing policy: \\forall i,\\, J_i(\\pi^*_i, \\pi^*_{-i}) \\geq J_i(\\pi_i, \\pi^*_{-i}) for all \\pi_i. In zero-sum two-player games Nash equilibria always exist and can be found via linear programming. In general-sum games multiple equilibria may exist, and gradient-based learning may cycle rather than converge.",
      "$$\\forall i:\\quad J_i(\\pi_i^*, \\pi_{-i}^*) \\geq J_i(\\pi_i, \\pi_{-i}^*) \\quad \\forall\\pi_i$$",
      "QMIX addresses cooperative multi-agent credit assignment by learning a joint Q-function that decomposes into per-agent utilities. The monotonic mixing constraint \\partial Q_{tot}/\\partial Q_i \\geq 0 ensures that the global argmax can be computed by each agent independently — decentralized execution — while the joint Q is trained centrally on global rewards. This CTDE architecture scales to many agents without exponential joint action spaces.",
    ],
  },
  hierarchicalrl: {
    what: "Hierarchical RL introduces temporal abstraction by learning high-level decisions over low-level skills/options.",
    visual:
      "Manager policy selects subgoals/options; worker policy executes action sequences to realize them.",
    intuition: [
      "Decomposes long-horizon tasks",
      "Improves exploration through reusable skills",
      "Requires consistent skill termination behavior",
      "Can reduce effective planning depth",
      "Feudal networks learn manager policies that set subgoals in latent space for worker policies",
    ],
    formula: "pi(a|s) = sum_o pi_H(o|s) * pi_L(a|s,o)",
    deepDive: [
      "Feudal RL (Dayan and Hinton, 1993; Vezhnevets et al., 2017) establishes a manager-worker hierarchy where the manager operates at a coarser timescale and sets goals in a learned latent space every c steps. The worker receives intrinsic reward for reaching the manager's goal within c steps. The manager's reward is the environmental return over c steps. The cosine similarity reward r^w_t = (s_{t+c} - s_t)^T g / (|s_{t+c}-s_t||g|) measures goal achievement without rigid goal specification.",
      "$$r^{\\text{worker}}_t = \\frac{1}{c}\\sum_{i=1}^{c} \\frac{(s_{t+i} - s_t)^\\top g_t}{\\|s_{t+i}-s_t\\| \\|g_t\\|}$$",
      "The effectiveness of hierarchical decomposition depends on the quality of the option boundary — when options terminate. Premature termination causes the manager to re-plan too often, losing temporal abstraction benefits. The option-critic framework learns initiation sets, intra-option policies, and termination functions simultaneously via gradients, avoiding the need for manually specifying option boundaries.",
    ],
  },
  options: {
    what: "Options are temporally extended actions defined by initiation set, intra-option policy, and termination rule.",
    visual:
      "Instead of primitive actions every step, agent invokes a skill that runs for multiple timesteps.",
    intuition: [
      "Bridges flat RL and hierarchical control",
      "Supports skill reuse across tasks",
      "Termination design strongly affects behavior",
      "Option-value Bellman equations extend standard control",
      "Option-critic architecture learns options end-to-end without manually defining initiation or termination",
    ],
    formula: "o = (I_o, pi_o, beta_o)",
    deepDive: [
      "The option-value function Q_\\Omega(s, o) satisfies its own Bellman equation: Q_\\Omega(s,o) = \\sum_a \\pi_o(a|s) [r(s,a) + \\gamma \\sum_{s'} P(s'|s,a) [(1-\\beta_o(s'))Q_\\Omega(s',o) + \\beta_o(s') V_\\Omega(s')]]. This semi-Markov Bellman equation mixes intra-option and between-option transitions and reduces to the standard equation when options are primitive actions (\\beta_o = 1 always).",
      "$$Q_\\Omega(s,o) = \\mathbb{E}\\!\\left[\\sum_{t=0}^{\\tau-1} \\gamma^t r_t + \\gamma^\\tau V_\\Omega(s_\\tau) \\;\\ \\Big| \\; s_0=s, o_0=o\\right]$$",
      "The option-critic theorem provides policy gradients for both the intra-option policy \\pi_o and the termination function \\beta_o. The termination gradient is \\nabla_{\\theta_\\beta} \\mathcal{J} = -\\mathbb{E}[\\nabla_{\\theta_\\beta}\\beta_o(s')(Q_\\Omega(s',o) - V_\\Omega(s'))], meaning termination is encouraged when the option advantage Q_\\Omega(s',o) - V_\\Omega(s') is negative — the option performs below average and should hand control back.",
    ],
  },
  pomdp: {
    what: "POMDP extends MDP to partial observability: agent receives observations, not full latent state.",
    visual:
      "Hidden state evolves unseen while noisy observations inform a belief-state distribution.",
    intuition: [
      "Memory or belief tracking becomes essential",
      "Recurrent policies can approximate belief updates",
      "Observation aliasing breaks reactive policies",
      "Planning occurs in belief space",
      "Belief-state MDPs convert POMDPs to fully observable MDPs at the cost of continuous belief state",
    ],
    formula: "b_{t+1}(s') propto O(o_{t+1}|s') sum_s P(s'|s,a_t)b_t(s)",
    deepDive: [
      "The belief state b_t(s) = P(s_t = s | o_{1:t}, a_{0:t-1}) is a sufficient statistic for all past information. The belief update is a Bayesian filter: b_{t+1}(s') \\propto O(o_{t+1}|s',a_t)\\sum_s P(s'|s,a_t)b_t(s). This converts the POMDP into a fully observable belief-MDP where states are probability distributions, but the belief state is continuous and infinite-dimensional even for finite-state POMDPs.",
      "$$b_{t+1}(s') = \\frac{O(o_{t+1}|s',a_t)\\sum_s P(s'|s,a_t)b_t(s)}{P(o_{t+1}|b_t,a_t)}$$",
      "Point-Based Value Iteration (PBVI) approximates the POMDP value function using a finite set of belief points and their associated alpha-vectors. The exact POMDP value function V^*(b) = \\max_\\alpha \\sum_s \\alpha(s)b(s) is piecewise linear and convex in belief space — a finite set of hyperplanes (alpha-vectors). PBVI maintains a subset of these hyperplanes, updating them at sampled belief points, achieving tractable approximate planning.",
    ],
  },
  saferl: {
    what: "Safe RL optimizes reward while respecting risk, cost, or safety constraints during learning and deployment.",
    visual:
      "Policy updates are projected into feasible region where expected cost stays below threshold.",
    intuition: [
      "Constraint satisfaction can conflict with reward maximization",
      "Safety critics/filters add protective layers",
      "Exploration under constraints is difficult",
      "Constrained policy optimization is a common approach",
      "Lagrangian relaxation converts constrained RL into unconstrained optimization over cost-penalty tradeoffs",
    ],
    formula: "maximize J_R(pi) subject to J_C(pi) <= d",
    deepDive: [
      "The Lagrangian relaxation converts the constrained problem into a min-max problem: \\min_{\\lambda\\geq 0}\\max_\\pi [J_R(\\pi) - \\lambda(J_C(\\pi) - d)]. The dual variable \\lambda is the cost penalty — a Lagrange multiplier that increases when the constraint is violated and decreases when slack exists. Primal-dual methods alternate policy improvement steps (inner max) with dual variable updates (outer min).",
      "$$\\mathcal{L}(\\pi, \\lambda) = J_R(\\pi) - \\lambda\\,(J_C(\\pi) - d), \\quad \\lambda^* = \\operatorname{argmin}_{\\lambda\\geq 0} \\max_\\pi \\mathcal{L}(\\pi,\\lambda)$$",
      "CPO (Constrained Policy Optimization) takes a trust-region step that improves reward while satisfying the constraint within each update. It constructs a linearized approximation of the constraint boundary and solves a constrained quadratic program for the policy update direction. Unlike Lagrangian methods, CPO attempts to satisfy constraints at every step rather than only in expectation over training — important when any individual unsafe transition is intolerable.",
    ],
  },
};
