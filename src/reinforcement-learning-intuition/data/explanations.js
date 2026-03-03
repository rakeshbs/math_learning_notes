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
  },
};
