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
  sarsa: detail(
    "SARSA is an on-policy TD control algorithm that updates Q(s,a) using the actually-taken next action, preserving on-policy semantics.",
    [
      "Safe exploration in environments with dangerous off-policy deviations",
      "On-policy discrete-action baselines",
      "Environments where behavior and target policy must match",
    ],
    [
      "Exploration policy quality limits learned Q quality",
      "Slower convergence than Q-learning on simple tasks",
      "Sensitive to epsilon-greedy exploration rate schedule",
    ],
    "Compare SARSA and Q-learning Q estimates to observe on vs off-policy divergence.",
  ),
  nstep: detail(
    "N-step returns bridge one-step TD and full Monte Carlo by summing n actual rewards before bootstrapping, trading bias for variance.",
    [
      "Tuning bias-variance tradeoff in value estimation",
      "N-step actor-critic target construction",
      "Improving credit assignment in medium-horizon tasks",
    ],
    [
      "Choosing n without environment-specific tuning",
      "Stale bootstrapped values at n-step horizon",
      "Increased memory for storing n-step trajectory segments",
    ],
    "Sweep n from 1 to full episode length and plot value estimate variance vs bias.",
  ),
  eligibility: detail(
    "Eligibility traces assign decaying credit backward through recently visited state-action pairs, unifying TD(0) and Monte Carlo under a single lambda parameter.",
    [
      "Efficient multi-step credit assignment",
      "Forward-backward view equivalence in policy evaluation",
      "TD(lambda) as principled n-step return mixture",
    ],
    [
      "Memory overhead from storing trace vectors",
      "Lambda requiring careful per-domain tuning",
      "Trace cutoffs masking long-horizon dependencies",
    ],
    "Visualize trace decay over episode to confirm lambda controls credit horizon.",
  ),
  doubledqn: detail(
    "Double DQN decouples action selection (online network) from value evaluation (target network) to reduce systematic overestimation bias inherent in Q-learning max backup.",
    [
      "Replacing vanilla DQN baseline in Atari benchmarks",
      "Environments with noisy or misleading high-Q actions",
      "Improving stability of deep off-policy value methods",
    ],
    [
      "Underestimation bias emerging in some domains",
      "Still requires careful target network update schedule",
      "Not always superior when Q overestimation does not dominate",
    ],
    "Compare Q-value scale between DQN and Double DQN across training.",
  ),
  duelingdqn: detail(
    "Dueling DQN splits the Q-network into separate state-value V(s) and advantage A(s,a) streams, enabling better generalization across actions in states where action choice matters less.",
    [
      "Environments with many similar-value actions",
      "Efficient learning in large action spaces",
      "Improving robustness to action irrelevance",
    ],
    [
      "Identifiability issue requiring advantage centering constraint",
      "Marginal gain in action-critical tasks",
      "Implementation complexity versus vanilla DQN",
    ],
    "Check whether V(s) stream correlates with reward density across states.",
  ),
  prioritizedreplay: detail(
    "Prioritized Experience Replay samples transitions with probability proportional to their TD error magnitude, focusing learning on surprising and informative experiences.",
    [
      "Accelerating DQN-family training on sparse reward tasks",
      "Memory-efficient replay in limited-buffer settings",
      "Any off-policy method benefiting from weighted sampling",
    ],
    [
      "Importance sampling corrections needed to avoid bias",
      "Priority staleness as Q-network updates",
      "High-error outliers dominating replay without proper annealing",
    ],
    "Monitor priority distribution entropy over training to detect degenerate sampling.",
  ),
  ddpg: detail(
    "DDPG combines deterministic policy gradient with DQN-style replay and target networks for continuous-action off-policy control.",
    [
      "Continuous robotics and control benchmarks",
      "Baseline for continuous-action off-policy evaluation",
      "Foundation for TD3 and SAC development",
    ],
    [
      "Brittle hyperparameter sensitivity requiring careful tuning",
      "Q-value overestimation accumulation",
      "Deterministic policy prone to poor local optima without noise",
    ],
    "Track Q-value scale and policy gradient norm stability.",
  ),
  td3: detail(
    "TD3 fixes DDPG instability with twin critics (use minimum for targets), delayed actor updates, and target policy smoothing noise.",
    [
      "Continuous control where DDPG diverges",
      "Standard continuous-action off-policy baseline",
      "Overestimation-sensitive locomotion benchmarks",
    ],
    [
      "Actor delay ratio requiring tuning",
      "Smoothing noise variance sensitive to action scale",
      "Still limited by off-policy distribution mismatch",
    ],
    "Compare twin critic estimates to verify minimum reduces overestimation vs DDPG.",
  ),
  sac: detail(
    "SAC maximizes entropy-regularized expected return with automatic temperature tuning, achieving strong sample efficiency and stability in continuous control.",
    [
      "State-of-the-art continuous-action off-policy baseline",
      "Robotic manipulation and locomotion",
      "Stable training without sensitive hyperparameter search",
    ],
    [
      "Value function overestimation under limited data",
      "Entropy target schedule mismatch in non-stationary tasks",
      "Computational cost of double critic and stochastic policy",
    ],
    "Track temperature alpha and entropy over training to confirm automatic tuning.",
  ),
  trpo: detail(
    "TRPO enforces a KL divergence trust region around each policy update, providing monotonic improvement guarantees at cost of second-order optimization complexity.",
    [
      "Environments requiring theoretically safe policy updates",
      "Baseline for understanding PPO approximation tradeoffs",
      "Continuous-action on-policy reference method",
    ],
    [
      "Computational cost of conjugate gradient and Fisher-vector products",
      "Constraint satisfaction only approximate in practice",
      "Scalability issues with large policy networks",
    ],
    "Measure KL divergence between old and new policy after each update step.",
  ),
  gae: detail(
    "GAE computes advantage estimates as exponentially weighted sums of TD errors across multiple steps, controlled by lambda to balance bias and variance.",
    [
      "Standard advantage estimator in PPO, A2C, and TRPO",
      "Tuning bias-variance tradeoff in policy gradient methods",
      "Improving policy gradient stability in long-horizon tasks",
    ],
    [
      "Lambda requiring environment-specific tuning alongside gamma",
      "Stale value estimates under fast-changing policy",
      "High lambda causing slow convergence in noisy environments",
    ],
    "Plot advantage estimate variance for lambda=0, 0.95, 1.0 to find optimal setting.",
  ),
  irl: detail(
    "Inverse RL infers a reward function that rationalizes expert demonstrations, enabling transfer and generalization beyond behavior cloning.",
    [
      "Reward recovery from human or robot expert data",
      "Transferable reward specification for new environments",
      "Diagnosing expert behavior and intent modeling",
    ],
    [
      "Reward ambiguity and ill-posedness without regularization",
      "Computationally expensive inner RL loop",
      "Expert distribution shift leading to poor reward generalization",
    ],
    "Check if recovered reward assigns higher values to expert states than random states.",
  ),
  rlhf: detail(
    "RLHF trains a reward model from human preference comparisons, then optimizes policy against it with PPO, aligning agents with human intent beyond engineered rewards.",
    [
      "Language model fine-tuning for instruction following",
      "Aligning agent behavior to subjective human values",
      "Preference-based robot learning without explicit reward design",
    ],
    [
      "Reward model overfitting to labeler preferences",
      "Reward hacking against learned preference model",
      "Human labeler inconsistency and annotation cost",
    ],
    "Evaluate policy outputs with held-out human ratings not seen during reward model training.",
  ),
  metarl: detail(
    "Meta-RL learns an adaptation policy across task distributions so that the agent can quickly acquire new tasks with minimal experience using learned inductive biases.",
    [
      "Few-shot task adaptation in robotics",
      "Fast fine-tuning from pretrained policy priors",
      "Sim-to-real transfer with rapid adaptation",
    ],
    [
      "Task distribution mismatch at test time",
      "Inner loop instability in gradient-based meta-learning",
      "High variance gradient estimates from short adaptation episodes",
    ],
    "Measure adaptation curve sample efficiency on held-out tasks vs standard RL baseline.",
  ),
  curriculum: detail(
    "Curriculum learning structures task difficulty progression, starting from easy variants and advancing to harder ones as competence grows, improving final performance and stability.",
    [
      "Sparse reward environments where random exploration fails",
      "Multi-stage task decomposition in robotics",
      "Language grounding and instruction following agents",
    ],
    [
      "Curriculum design requiring domain knowledge",
      "Catastrophic forgetting of easy skills when advancing",
      "Automatic curriculum adaptation requiring reliable performance signals",
    ],
    "Verify policy retains performance on earlier curriculum stages while advancing.",
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
  sarsa: expansion(
    "SARSA update: Q(s,a) <- Q(s,a) + alpha[r + gamma Q(s',a') - Q(s,a)] uses actual next action a'.",
    "Run epsilon-greedy behavior and use same selected action for TD target.",
    "In cliff-walking, SARSA's on-policy caution avoids cliff edges while Q-learning's greedy target exploits them.",
    ["Q-Learning", "Temporal-Difference", "On-Policy"],
  ),
  nstep: expansion(
    "N-step return: G_t^(n) = sum_{k=0}^{n-1} gamma^k r_{t+k+1} + gamma^n V(s_{t+n}).",
    "Store n-step trajectory segments and compute mixed targets before bootstrapping.",
    "n=3 often outperforms n=1 TD in tasks with moderate-length reward delays.",
    ["Temporal-Difference", "TD(Lambda)", "Policy Gradient"],
  ),
  eligibility: expansion(
    "Eligibility trace e_t(s,a) decays by gamma*lambda and spikes on visited state-actions, accumulating multi-step credit.",
    "Maintain trace vector and update all state-action values proportionally after each TD error.",
    "TD(1) with traces recovers Monte Carlo; TD(0) with lambda=0 is standard one-step TD.",
    ["N-Step Returns", "Temporal-Difference", "Policy Evaluation"],
  ),
  doubledqn: expansion(
    "Double DQN target: r + gamma Q_target(s', argmax_{a'} Q_online(s',a')) decouples selection and evaluation.",
    "Use online network to pick action, target network to estimate its value.",
    "On Atari, Double DQN reduces value overestimation and improves final scores vs vanilla DQN.",
    ["DQN", "Q-Learning", "Prioritized Replay"],
  ),
  duelingdqn: expansion(
    "Q(s,a) = V(s) + A(s,a) - mean_a A(s,a) enforces identifiability via advantage centering.",
    "Split final network layers into V-stream and A-stream with shared encoder.",
    "In navigation tasks, dueling architecture learns state values faster when most actions are equivalent.",
    ["Double DQN", "DQN", "Value Iteration"],
  ),
  prioritizedreplay: expansion(
    "Priority p_i = |TD error_i|^alpha; sampling probability P(i) = p_i / sum_j p_j with IS correction.",
    "Maintain priority heap, sample proportionally, apply importance sampling weights in gradient update.",
    "PER combined with Double DQN gives strong Atari baseline improvements.",
    ["Double DQN", "DQN", "Off-Policy"],
  ),
  ddpg: expansion(
    "DDPG gradient: nabla_theta J = E[nabla_a Q(s,a)|_{a=mu(s)} nabla_theta mu(s)] for deterministic actor.",
    "Sample from replay, compute deterministic policy gradient, update actor and critic with target networks.",
    "DDPG solves continuous pendulum and half-cheetah tasks where discrete Q-methods fail.",
    ["TD3", "SAC", "Actor-Critic"],
  ),
  td3: expansion(
    "Twin critics Q1, Q2; target uses min(Q1,Q2) to suppress overestimation; actor updates every d steps.",
    "Train two critics on same replay batch, use minimum for Bellman targets, delay and smooth actor updates.",
    "TD3 stabilizes DDPG on difficult locomotion benchmarks like Ant and Humanoid.",
    ["DDPG", "SAC", "Actor-Critic"],
  ),
  sac: expansion(
    "SAC objective: max_pi E[sum gamma^t (r_t + alpha H(pi(.|s_t)))] with entropy coefficient alpha.",
    "Reparameterize stochastic policy, use twin critics, and auto-tune alpha via target entropy constraint.",
    "SAC achieves strong sample efficiency on MuJoCo while remaining robust to hyperparameters.",
    ["TD3", "Entropy RL", "Actor-Critic"],
  ),
  trpo: expansion(
    "TRPO maximizes surrogate objective L(pi) subject to KL(pi_old || pi_new) <= delta using natural gradient.",
    "Compute policy gradient, estimate Fisher-vector products via conjugate gradient, perform line search.",
    "TRPO guarantees monotonic improvement in tabular settings and empirically in function approximation.",
    ["PPO", "Policy Gradient", "Actor-Critic"],
  ),
  gae: expansion(
    "GAE: A^{GAE}(s_t,a_t) = sum_{l=0}^{inf} (gamma lambda)^l delta_{t+l} where delta = r + gamma V(s') - V(s).",
    "Compute TD errors across rollout, then exponentially weight them with lambda for advantage estimate.",
    "lambda=0 gives TD advantage (low variance, biased); lambda=1 gives MC advantage (unbiased, high variance).",
    ["PPO", "Actor-Critic", "N-Step Returns"],
  ),
  irl: expansion(
    "IRL seeks reward R such that expert policy is optimal under R; MaxEnt IRL matches feature expectations.",
    "Alternate between RL with current reward and reward update to better explain demonstrations.",
    "GAIL frames IRL as GAN, using discriminator to match occupancy measures to expert.",
    ["Imitation Learning", "Reward Shaping", "RLHF"],
  ),
  rlhf: expansion(
    "RLHF pipeline: collect preferences, train reward model r_theta, then fine-tune policy with PPO against r_theta.",
    "Label trajectory pairs by human preference, fit Bradley-Terry reward model, run PPO with KL penalty.",
    "InstructGPT and ChatGPT use RLHF to align LLM outputs with human instructions.",
    ["IRL", "Imitation Learning", "PPO"],
  ),
  metarl: expansion(
    "MAML meta-gradient: theta* = theta - alpha nabla L(theta); meta-update: theta <- theta - beta nabla sum L(theta*).",
    "Sample task batch, compute adapted parameters via inner gradient steps, update meta-parameters via outer loop.",
    "RL^2 uses recurrent policy to meta-learn adaptation strategy from in-context experience.",
    ["Curriculum", "Model-Based RL", "Hierarchical RL"],
  ),
  curriculum: expansion(
    "Automatic curriculum selects tasks from distribution where agent is competent but challenged (learning progress signal).",
    "Define task difficulty space, monitor agent performance, advance curriculum based on success rate threshold.",
    "OpenAI Automatic Domain Randomization grew physically plausible curricula for dexterous hand manipulation.",
    ["Meta-RL", "Reward Shaping", "Intrinsic Motivation"],
  ),
};
