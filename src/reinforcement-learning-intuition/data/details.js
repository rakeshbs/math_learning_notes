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
  mdp: detail(
    "MDP modeling quality determines downstream algorithm success. State abstraction, action granularity, and reward specification all encode inductive bias.",
    [
      "Control and robotics task formalization",
      "Game and simulation-based decision systems",
      "Sequential recommendation and operations policies",
    ],
    [
      "State aliasing violating Markov assumptions",
      "Misaligned reward specification",
      "Action-space design too coarse or too large",
    ],
    "Verify whether next-state/reward depends on history beyond current state-action.",
  ),
  return: detail(
    "Discounted return converts long-horizon optimization into stable objectives while controlling time preference.",
    [
      "Tune horizon sensitivity via gamma",
      "Compare sparse vs dense reward formulations",
      "Estimate policy quality under different planning horizons",
    ],
    [
      "Using gamma too high with noisy long-horizon credit",
      "Different reward scales across experiments",
      "Ignoring episodic truncation effects on return",
    ],
    "Plot undiscounted and discounted returns to see objective shift from gamma.",
  ),
  bellman: detail(
    "Bellman operators define fixed points for value functions and provide contraction-based convergence structure in discounted settings.",
    [
      "Dynamic programming and tabular planning",
      "Design TD targets for function approximation",
      "Analyze approximation error propagation",
    ],
    [
      "Assuming exact convergence with nonlinear function approximators",
      "Ignoring bootstrapping bias",
      "Using inconsistent target networks in deep RL",
    ],
    "Track Bellman residual magnitude during training iterations.",
  ),
  policyevaluation: detail(
    "Policy evaluation isolates estimation from control and is a core subroutine in generalized policy iteration.",
    [
      "Assess candidate policies before deployment",
      "Critic training in actor-critic methods",
      "Off-policy evaluation research",
    ],
    [
      "High-variance Monte Carlo estimates in long horizons",
      "Distribution mismatch for off-policy evaluation",
      "Value overfitting under limited trajectories",
    ],
    "Compare Monte Carlo and TD value estimates on held-out trajectories.",
  ),
  valueiteration: detail(
    "Value iteration repeatedly applies optimal Bellman backups and extracts greedy policy, guaranteeing tabular convergence with known model.",
    [
      "Gridworld and finite MDP planning",
      "Baseline dynamic programming control",
      "Benchmarking model-based approximations",
    ],
    [
      "Large state-action spaces causing intractable backups",
      "Model errors invalidating optimality guarantees",
      "Stopping too early with large residuals",
    ],
    "Monitor max backup change across states until below tolerance.",
  ),
  temporaldifference: detail(
    "TD methods trade lower variance and online learning for bootstrapping bias, making them practical at scale.",
    [
      "Streaming value updates in online agents",
      "Critic learning in deep actor-critic",
      "Bootstrapped return targets",
    ],
    [
      "Divergence with off-policy + function approximation",
      "Improper step-size schedules",
      "Ignoring non-stationarity of target estimates",
    ],
    "Track TD-error distribution; persistent drift often indicates instability.",
  ),
  qlearning: detail(
    "Q-learning learns optimal control from arbitrary behavior data but is sensitive to overestimation and exploration quality.",
    [
      "Discrete-action control benchmarks",
      "Replay-based off-policy pipelines",
      "Foundation for many deep value methods",
    ],
    [
      "Max backup overestimation bias",
      "Insufficient exploration coverage",
      "Unstable updates with large step sizes",
    ],
    "Compare online Q estimates against Monte Carlo rollouts for calibration.",
  ),
  dqn: detail(
    "DQN stabilizes deep off-policy value learning with replay and target networks but still requires heavy hyperparameter tuning.",
    [
      "Atari-style high-dimensional control",
      "Vision-based discrete-action agents",
      "Industrial simulation control baselines",
    ],
    [
      "Replay buffer distribution drift",
      "Catastrophic Q-value explosion",
      "Reward clipping masking task signal",
    ],
    "Track Q-value scale and TD loss alongside episode returns.",
  ),
  distributionalrl: detail(
    "Distributional RL captures uncertainty over returns and can improve training signals beyond mean-value targets.",
    [
      "Risk-sensitive policy design",
      "More informative critic targets",
      "Robust control under stochastic outcomes",
    ],
    [
      "Miscalibrated return distributions",
      "Distribution support collapse",
      "Metric mismatch between training and decision objective",
    ],
    "Check whether predicted quantiles align with empirical return quantiles.",
  ),
  policygradient: detail(
    "Policy gradients optimize stochastic policies directly and naturally support continuous actions.",
    [
      "Continuous-control robotics",
      "Stochastic policy optimization",
      "Foundation for modern actor-critic methods",
    ],
    [
      "High gradient variance",
      "Poor credit assignment in sparse rewards",
      "Unstable updates without normalization",
    ],
    "Track policy entropy and gradient norm during optimization.",
  ),
  actorcritic: detail(
    "Actor-critic uses learned value baselines to reduce policy-gradient variance while retaining direct policy optimization.",
    [
      "A2C/A3C/PPO/SAC families",
      "Large-scale continuous-action RL",
      "Sample-efficient policy optimization",
    ],
    [
      "Biased critic destabilizing actor",
      "Critic overfitting to replay distribution",
      "Mismatched update frequencies",
    ],
    "Ensure critic loss decreases and advantage estimates stay well-scaled.",
  ),
  ppo: detail(
    "PPO approximates trust-region updates with clipping, offering robust practical training at moderate implementation complexity.",
    [
      "General-purpose on-policy baseline",
      "Policy training in simulators with parallel rollouts",
      "Fine-tuning learned policies safely",
    ],
    [
      "Too many epochs causing policy collapse",
      "Advantage mis-normalization",
      "Overly tight or loose clip range",
    ],
    "Track KL divergence between old and new policy each update.",
  ),
  entropyrl: detail(
    "Entropy regularization improves exploration and robustness by penalizing low-entropy policies during learning.",
    [
      "Sparse reward domains",
      "Maximum entropy RL frameworks",
      "Avoiding premature deterministic convergence",
    ],
    [
      "Entropy coefficient too high reducing task focus",
      "Entropy annealing schedule mismatch",
      "Ignoring entropy collapse in later training",
    ],
    "Plot policy entropy over training to confirm controlled decay.",
  ),
  modelbasedrl: detail(
    "Model-based RL can dramatically improve sample efficiency but is vulnerable to model bias and planning overconfidence.",
    [
      "Real-world low-data robotic learning",
      "Planning under expensive environment interaction",
      "Hybrid imagination-augmented control",
    ],
    [
      "Compounding rollout model error",
      "Poor uncertainty estimates",
      "Planner exploiting model artifacts",
    ],
    "Compare model rollout error vs real transition error over horizon lengths.",
  ),
  mcts: detail(
    "MCTS allocates search computation adaptively using upper-confidence tree policies and backup statistics.",
    [
      "Board-game agents",
      "Short-horizon discrete planning",
      "Policy/value-guided search systems",
    ],
    [
      "Search budget too small for branching factor",
      "Poor rollout/value heuristics",
      "Incorrect backup normalization",
    ],
    "Inspect visit-count distribution across root actions.",
  ),
  worldmodels: detail(
    "World models represent environment dynamics in latent space, enabling imagination rollouts and planning/control from compressed representations.",
    [
      "Latent planning in high-dimensional observations",
      "Imagination-augmented policy training",
      "Sample-efficient model-based control",
    ],
    [
      "Latent representation collapse",
      "Model exploiting reconstruction shortcuts",
      "Uncertainty underestimation in OOD states",
    ],
    "Evaluate multi-step latent rollout quality, not only one-step prediction.",
  ),
  onpolicy: detail(
    "On-policy pipelines align update objective with data distribution from current policy at cost of lower reuse.",
    [
      "Stable policy optimization with fresh rollouts",
      "Large-scale simulator training with vectorized actors",
      "Trust-region style policy updates",
    ],
    [
      "Data inefficiency from throwaway trajectories",
      "Under-diverse rollouts in early training",
      "High wall-clock collection cost",
    ],
    "Measure sample efficiency (return per environment step) against off-policy baseline.",
  ),
  offpolicy: detail(
    "Off-policy learning decouples behavior and target policy, allowing replay and broader experience reuse.",
    [
      "Replay-buffer driven deep RL",
      "Batch updates from heterogeneous data",
      "Continual learning with logged trajectories",
    ],
    [
      "Severe distribution shift across policies",
      "Uncorrected bias from behavior mismatch",
      "Stale replay dominating updates",
    ],
    "Track state-action coverage mismatch between replay and current policy.",
  ),
  offlinerl: detail(
    "Offline RL avoids live interaction and must control extrapolation error when evaluating unseen actions.",
    [
      "Healthcare, finance, and safety-critical settings",
      "Policy learning from historic logs",
      "Pretraining before cautious online fine-tuning",
    ],
    [
      "Optimistic OOD action value estimates",
      "Insufficient dataset coverage",
      "Weak offline policy evaluation",
    ],
    "Estimate behavior-policy support and penalize unsupported action choices.",
  ),
  imitationlearning: detail(
    "Imitation learning provides fast behavior acquisition from expert trajectories, often as warm start for RL.",
    [
      "Autonomous driving and robotics bootstrapping",
      "UI interaction automation",
      "Low-trial-cost initial policy training",
    ],
    [
      "Covariate shift from compounding action errors",
      "Expert data quality bottlenecks",
      "Distribution mismatch across task regimes",
    ],
    "Evaluate rollout divergence from expert trajectories over horizon.",
  ),
  bandits: detail(
    "Bandits isolate exploration-exploitation without transition dynamics and provide sharp theoretical regret tools.",
    [
      "Online recommendation and ads allocation",
      "A/B testing with adaptive allocation",
      "Hyperparameter or prompt selection loops",
    ],
    [
      "Under-exploration causing lock-in",
      "Over-exploration wasting reward",
      "Ignoring non-stationary reward drift",
    ],
    "Plot cumulative regret vs time across exploration strategies.",
  ),
  intrinsicmotivation: detail(
    "Intrinsic rewards can drive discovery in sparse tasks but must be balanced against extrinsic objectives.",
    [
      "Sparse-reward exploration in games/robotics",
      "Open-ended skill acquisition",
      "Novelty-seeking pretraining phases",
    ],
    [
      "Curiosity loops over noisy/uncontrollable signals",
      "Reward misalignment with task completion",
      "Intrinsic reward scale overwhelming extrinsic reward",
    ],
    "Track extrinsic return separately to ensure curiosity aids rather than distracts.",
  ),
  rewardshaping: detail(
    "Reward shaping injects prior structure into objective landscape and can reduce sample complexity dramatically.",
    [
      "Dense guidance in sparse tasks",
      "Curriculum-like staged objectives",
      "Safety penalties and soft constraints",
    ],
    [
      "Reward hacking and unintended shortcuts",
      "Breaking policy invariance with non-potential shaping",
      "Overfitting to proxy reward",
    ],
    "Check policy quality under true task metric, not only shaped reward.",
  ),
  multiagentrl: detail(
    "Multi-agent RL introduces strategic adaptation where each learner changes others' learning environment.",
    [
      "Cooperative robotics and swarm control",
      "Competitive games and opponent modeling",
      "Mixed cooperative-competitive economic systems",
    ],
    [
      "Non-stationarity from simultaneous updates",
      "Credit assignment across agents",
      "Scalability bottlenecks with many agents",
    ],
    "Monitor joint training dynamics and exploitability/equilibrium metrics.",
  ),
  hierarchicalrl: detail(
    "Hierarchical RL decomposes decision-making across temporal scales for long-horizon reasoning and reusable skills.",
    [
      "Long-horizon navigation and manipulation",
      "Task decomposition with subgoals",
      "Skill libraries transferable across tasks",
    ],
    [
      "Unstable coordination between high- and low-level policies",
      "Poorly defined subgoals or option boundaries",
      "Credit assignment across temporal abstraction levels",
    ],
    "Evaluate both top-level goal success and low-level skill reliability.",
  ),
  options: detail(
    "Options formalize temporally extended actions and enable semi-MDP planning with skill-level transitions.",
    [
      "Reusable navigation/manipulation skills",
      "Hierarchical exploration",
      "Reduced action frequency planning",
    ],
    [
      "Termination conditions causing option thrashing",
      "Initiation sets too narrow for reuse",
      "Skill collapse to primitive-action behavior",
    ],
    "Measure option duration, usage diversity, and completion reliability.",
  ),
  pomdp: detail(
    "POMDP settings require belief estimation or memory to handle latent-state uncertainty and observation aliasing.",
    [
      "Partially observed robotics",
      "Dialogue systems with hidden intent",
      "Fault diagnosis under noisy sensors",
    ],
    [
      "Reactive policy failure from partial observability",
      "Belief-state approximation errors",
      "Ignoring history length requirements",
    ],
    "Test whether adding recurrence/belief filtering improves performance significantly.",
  ),
  saferl: detail(
    "Safe RL adds explicit cost/risk constraints to prevent catastrophic behavior during learning and execution.",
    [
      "Autonomous control with hard safety limits",
      "Healthcare/finance policies with strict risk bounds",
      "Constrained robotics and industrial automation",
    ],
    [
      "Constraint violation during exploration",
      "Over-conservatism reducing task performance",
      "Inaccurate cost critics or safety models",
    ],
    "Track reward and constraint-return curves jointly across training.",
  ),
};

export const CONCEPT_EXPANSIONS = {
  mdp: expansion(
    "MDP dynamics define occupancy distributions induced by policy and transition kernel.",
    "Specify states/actions/rewards/transitions, then validate Markov adequacy on rollout data.",
    "Gridworld with stochastic slips is a canonical finite MDP for control experiments.",
    ["Bellman Equations", "Policy Evaluation", "POMDP"],
  ),
  return: expansion(
    "Return is discounted cumulative utility under trajectory measure induced by policy.",
    "Compute Monte Carlo returns and compare with bootstrapped estimates for bias-variance analysis.",
    "Changing gamma from 0.9 to 0.99 can flip preferred policies in delayed-reward tasks.",
    ["Temporal-Difference", "Policy Gradient", "Reward Shaping"],
  ),
  bellman: expansion(
    "Bellman operators are contractions in sup norm for gamma<1, yielding unique fixed points.",
    "Iterate Bellman backups and monitor residual norm for convergence diagnostics.",
    "Tabular evaluation converges to V^pi under repeated Bellman expectation updates.",
    ["Value Iteration", "Policy Evaluation", "Q-Learning"],
  ),
  policyevaluation: expansion(
    "Evaluation solves linear system (I-gamma P^pi)V = r^pi in tabular MDPs.",
    "Use iterative evaluation or LSTD-style approximations under larger spaces.",
    "Policy iteration alternates this step with greedy policy improvement.",
    ["Bellman", "Policy Iteration", "Actor-Critic"],
  ),
  valueiteration: expansion(
    "Optimal Bellman operator repeatedly applies max over action-value backups.",
    "Perform synchronous/asynchronous backups and derive greedy policy from converged values.",
    "In finite MDPs, value iteration reaches epsilon-optimal policy after finite iterations.",
    ["Bellman", "Q-Learning", "Model-Based RL"],
  ),
  temporaldifference: expansion(
    "TD is stochastic approximation to Bellman fixed points using sampled transitions.",
    "Update values per step with TD error and decaying/adaptive learning rates.",
    "TD(0) learns online while Monte Carlo waits until episode end.",
    ["Q-Learning", "Actor-Critic", "On-Policy"],
  ),
  qlearning: expansion(
    "Q-learning applies off-policy stochastic Bellman optimality updates.",
    "Use epsilon-greedy behavior and target max backup for control.",
    "Double Q variants reduce overestimation compared to vanilla max backups.",
    ["DQN", "Off-Policy", "Temporal-Difference"],
  ),
  dqn: expansion(
    "DQN approximates Q(s,a) with deep nets under replay + target stabilization.",
    "Train on replay minibatches, periodically sync target network, and tune exploration schedule.",
    "Atari agents using DQN surpassed many earlier tabular approximations.",
    ["Q-Learning", "Off-Policy", "Distributional RL"],
  ),
  distributionalrl: expansion(
    "Distributional Bellman updates propagate return distributions through transitions.",
    "Optimize quantile or categorical distribution losses instead of scalar TD loss.",
    "Quantile regression DQN often improves performance and stability.",
    ["DQN", "Risk-Sensitive Control", "Offline RL"],
  ),
  policygradient: expansion(
    "Policy gradient theorem provides unbiased gradient estimators of expected return.",
    "Estimate advantages and optimize with SGD/Adam over trajectory batches.",
    "REINFORCE with baseline illustrates variance reduction from critic-like terms.",
    ["Actor-Critic", "PPO", "Entropy RL"],
  ),
  actorcritic: expansion(
    "Actor updates policy; critic estimates value/advantage to reduce gradient variance.",
    "Alternate or jointly train actor and critic with balanced update frequencies.",
    "A2C improves over vanilla policy gradient in many continuous-control tasks.",
    ["Policy Gradient", "Temporal-Difference", "PPO"],
  ),
  ppo: expansion(
    "PPO approximates constrained policy optimization via clipped surrogate objective.",
    "Collect rollout batches, compute GAE advantages, run multiple minibatch epochs with clipping.",
    "Clip objective prevents destructive large policy-ratio updates.",
    ["Actor-Critic", "On-Policy", "Entropy RL"],
  ),
  entropyrl: expansion(
    "Maximum-entropy RL solves control with reward and entropy regularization duality.",
    "Tune alpha/temperature and possibly auto-adjust based on target entropy.",
    "SAC uses entropy regularization to improve exploration and stability.",
    ["Policy Gradient", "PPO", "Intrinsic Motivation"],
  ),
  modelbasedrl: expansion(
    "Model-based RL learns transition/reward model then optimizes policy through planning or imagined rollouts.",
    "Fit dynamics model, quantify uncertainty, then plan with MPC/tree-search/value expansion.",
    "MBPO-style short model rollouts can improve sample efficiency.",
    ["MCTS", "World Models", "Value Iteration"],
  ),
  mcts: expansion(
    "MCTS balances exploration and exploitation over search tree nodes with confidence bonuses.",
    "Run selection-expansion-rollout-backup loops within compute budget.",
    "AlphaZero-style systems combine policy priors and value networks in MCTS.",
    ["Model-Based RL", "Bandits", "World Models"],
  ),
  worldmodels: expansion(
    "Latent state-space models provide compressed predictive dynamics for control/planning.",
    "Train encoder-dynamics-decoder stacks and optimize policy in latent imagination.",
    "Dreamer-like agents plan from latent rollouts without raw-pixel simulation each step.",
    ["Model-Based RL", "POMDP", "Offline RL"],
  ),
  onpolicy: expansion(
    "On-policy optimization uses data from current policy distribution for unbiased objective alignment.",
    "Collect fresh rollouts each iteration and discard stale data after updates.",
    "PPO's rollout-update loop is the standard on-policy template.",
    ["PPO", "Policy Gradient", "Actor-Critic"],
  ),
  offpolicy: expansion(
    "Off-policy learning corrects or tolerates behavior-target mismatch for efficient data reuse.",
    "Use replay buffers and optional importance weighting for stable updates.",
    "SAC and DQN families thrive on off-policy replay efficiency.",
    ["Q-Learning", "DQN", "Offline RL"],
  ),
  offlinerl: expansion(
    "Offline RL adds conservatism/regularization to avoid out-of-support action overestimation.",
    "Constrain policy/value updates by dataset support penalties or conservative Q targets.",
    "CQL-like methods reduce overoptimistic Q estimates in static logs.",
    ["Off-Policy", "Imitation Learning", "Distributional RL"],
  ),
  imitationlearning: expansion(
    "Imitation transforms control into supervised or interactive distribution-matching problems.",
    "Train behavior cloning baseline, then apply DAgger or RL fine-tuning if needed.",
    "DAgger reduces covariate-shift errors by querying expert on learner-visited states.",
    ["Offline RL", "Policy Gradient", "Reward Shaping"],
  ),
  bandits: expansion(
    "Bandit algorithms optimize cumulative reward/regret without transition dynamics.",
    "Implement epsilon-greedy/UCB/Thompson and compare regret curves.",
    "UCB exploration bonus shrinks as uncertainty from arm pulls decreases.",
    ["Exploration-Exploitation", "MCTS", "Off-Policy"],
  ),
  intrinsicmotivation: expansion(
    "Intrinsic reward forms often estimate novelty, surprise, or prediction error signals.",
    "Combine intrinsic and extrinsic rewards with adaptive scaling.",
    "Curiosity bonuses help discover sparse-reward regions unreachable by random exploration.",
    ["Bandits", "Reward Shaping", "Entropy RL"],
  ),
  rewardshaping: expansion(
    "Potential-based shaping preserves optimal policy while densifying feedback.",
    "Engineer potential function and verify policy invariance empirically.",
    "Distance-to-goal potential can dramatically reduce sparse-reward training time.",
    ["Return", "Intrinsic Motivation", "Safe RL"],
  ),
  multiagentrl: expansion(
    "Multi-agent objectives involve joint policies, equilibria, and non-stationary learning dynamics.",
    "Use centralized critics or opponent modeling to stabilize learning.",
    "Cooperative tasks benefit from value decomposition and shared credit signals.",
    ["Game Theory", "Hierarchical RL", "Safe RL"],
  ),
  hierarchicalrl: expansion(
    "Hierarchical RL introduces option/skill levels that reduce effective horizon and improve reuse.",
    "Train manager-worker or option-critic architectures with temporal abstraction.",
    "Subgoal-conditioned policies solve long mazes faster than flat policies.",
    ["Options", "Model-Based RL", "POMDP"],
  ),
  options: expansion(
    "Options extend primitive-action MDP to semi-MDP with temporally extended action durations.",
    "Learn initiation, intra-option policy, and termination jointly or separately.",
    "Navigation skills like 'go-to-door' can be reused across many tasks.",
    ["Hierarchical RL", "Policy Evaluation", "Reward Shaping"],
  ),
  pomdp: expansion(
    "POMDP control optimizes over belief states or memory-augmented policy states.",
    "Use recurrence or explicit Bayesian filtering to infer latent state.",
    "Partially observed control needs history to disambiguate aliased observations.",
    ["MDP", "World Models", "RNN Policies"],
  ),
  saferl: expansion(
    "Safe RL is constrained optimization over reward and cost returns.",
    "Estimate both reward and safety costs, then optimize with primal-dual/constrained updates.",
    "Constrained PPO variants maintain cost budgets while improving reward.",
    ["Reward Shaping", "Offline RL", "Multi-Agent RL"],
  ),
};
