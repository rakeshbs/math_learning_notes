export const EXPLANATIONS = {
  mean: {
    what: "The mean is the arithmetic average of values. It is the balance point of a dataset on the number line.",
    visual:
      "Imagine each data point as equal weight on a ruler. The mean is where the ruler balances.",
    intuition: [
      "Mean uses every observation",
      "It shifts strongly with outliers",
      "It minimizes total squared error",
      "For symmetric data, mean is a strong center summary",
    ],
    formula: "x_bar = (1/n) * sum_i x_i",
  },
  median: {
    what: "The median is the middle value after sorting. Half the observations are below it and half above it.",
    visual:
      "Sort the values and draw a vertical cut at the center rank. That cut is the median.",
    intuition: [
      "Median is robust to outliers",
      "It summarizes rank position, not magnitude",
      "For skewed data it is often more stable than mean",
      "It minimizes total absolute deviation",
    ],
    formula:
      "median = middle order statistic (or average of two middle values)",
  },
  variance: {
    what: "Variance measures spread by averaging squared deviations from the mean.",
    visual:
      "Points far from the mean contribute much larger squares, so variance emphasizes distant values.",
    intuition: [
      "Large variance means broad spread",
      "Squaring prevents cancellation of positive/negative deviations",
      "Units are squared units",
      "Variance is central in many inference formulas",
    ],
    formula: "sample s^2 = (1/(n-1)) * sum_i (x_i - x_bar)^2",
  },
  stddev: {
    what: "Standard deviation is the square root of variance, giving spread in the original units.",
    visual:
      "Around the mean, mark plus/minus one and two standard deviations to show typical distance scales.",
    intuition: [
      "Interpretable in same units as data",
      "Sensitive to outliers because it derives from squared deviations",
      "Smaller standard deviation means tighter clustering",
      "Often used for z-scores and standardized comparisons",
    ],
    formula: "s = sqrt(s^2)",
  },
  covariance: {
    what: "Covariance measures whether two variables move together and in which direction.",
    visual:
      "If points tilt upward-right, covariance is positive; downward-right tilt gives negative covariance.",
    intuition: [
      "Sign indicates direction of co-movement",
      "Magnitude depends on scale of both variables",
      "Zero covariance means no linear co-movement",
      "Covariance matrices encode multivariate spread",
    ],
    formula: "cov(X,Y) = (1/(n-1)) * sum_i (x_i-x_bar)(y_i-y_bar)",
  },
  correlation: {
    what: "Correlation is scaled covariance, bounded between -1 and 1.",
    visual:
      "Tight points along an upward line indicate correlation near +1, downward line near -1, cloud-like scatter near 0.",
    intuition: [
      "Scale-free measure of linear association",
      "Sign indicates direction",
      "Magnitude indicates linear strength",
      "Correlation does not imply causation",
    ],
    formula: "r = cov(X,Y) / (s_X * s_Y)",
  },
  distribution: {
    what: "A distribution describes how probability mass or density is allocated across possible values.",
    visual:
      "A histogram or curve shows where outcomes are common and where they are rare.",
    intuition: [
      "Center, spread, and shape all matter",
      "Different distributions model different mechanisms",
      "Tails control extreme-event behavior",
      "Most inference methods assume distributional structure",
    ],
    formula: "Discrete: sum_x p(x)=1 ; Continuous: integral f(x) dx = 1",
  },
  randomvar: {
    what: "A random variable assigns a numerical value to each outcome of a random experiment.",
    visual:
      "Outcomes flow through a mapping rule and become numbers you can summarize, model, and compare.",
    intuition: [
      "Random variable is a function on outcomes",
      "Different experiments can induce the same distribution",
      "Discrete and continuous random variables use different probability descriptions",
      "Most statistical formulas operate on random variables",
    ],
    formula: "X: Omega -> R",
  },
  expectation: {
    what: "Expectation is the long-run average value of a random variable under its probability law.",
    visual:
      "Imagine values on a balance beam weighted by probabilities; the expectation is the balance point.",
    intuition: [
      "Probability-weighted average, not a guaranteed observed value",
      "Linear operator: E[aX+bY]=aE[X]+bE[Y]",
      "Foundation for risk, utility, and optimization criteria",
      "Sample mean estimates expectation under LLN",
    ],
    formula: "E[X] = sum_x x p(x)  or  integral x f(x) dx",
  },
  pmf: {
    what: "A PMF gives probabilities for each value of a discrete random variable.",
    visual:
      "Bars at each possible value show how much probability mass sits there.",
    intuition: [
      "Nonnegative probabilities that sum to one",
      "Encodes full discrete uncertainty model",
      "Expectation and variance are computed directly from PMF",
      "Useful for counts and categorical outcomes",
    ],
    formula: "p_X(x) = P(X=x), with sum_x p_X(x)=1",
  },
  cdf: {
    what: "A CDF gives cumulative probability up to a threshold: probability that X is less than or equal to x.",
    visual:
      "A non-decreasing staircase/curve accumulates probability mass as x moves right.",
    intuition: [
      "Always increases from 0 toward 1",
      "Converts pointwise mass/density into cumulative probability",
      "Probabilities of intervals come from CDF differences",
      "Works for both discrete and continuous variables",
    ],
    formula: "F_X(x)=P(X<=x)",
  },
  conditionalprob: {
    what: "Conditional probability quantifies chance of event A after restricting attention to cases where B occurred.",
    visual:
      "Inside the region for B, only the overlap with A counts as successful mass.",
    intuition: [
      "Conditioning renormalizes probability space",
      "Order matters: P(A|B) and P(B|A) differ in general",
      "Core primitive behind Bayes updates",
      "Useful for diagnostics and sequential evidence",
    ],
    formula: "P(A|B)=P(A∩B)/P(B), for P(B)>0",
  },
  independence: {
    what: "Events (or variables) are independent when learning one does not change probability beliefs about the other.",
    visual:
      "Knowledge of event A leaves event B bar heights unchanged in probability view.",
    intuition: [
      "Factorization criterion simplifies many computations",
      "Zero correlation does not always imply independence",
      "Independence assumptions often drive model tractability",
      "Must be justified from design or mechanism, not assumed by default",
    ],
    formula: "A ⟂ B iff P(A∩B)=P(A)P(B)",
  },
  normal: {
    what: "The normal distribution is a bell-shaped distribution fully determined by mean and standard deviation.",
    visual: "A symmetric bell centered at mu with width controlled by sigma.",
    intuition: [
      "Many natural aggregates approximate normal",
      "Symmetric around mean",
      "68-95-99.7 rule gives quick probability ranges",
      "Foundation for z-tests and many confidence intervals",
    ],
    formula: "X ~ N(mu, sigma^2)",
  },
  zscore: {
    what: "A z-score standardizes a value by measuring how many standard deviations it is from the mean.",
    visual:
      "Map any value onto a standardized axis centered at 0 with unit spread.",
    intuition: [
      "Enables comparisons across different scales",
      "z=0 means exactly at mean",
      "Positive z is above mean, negative z below",
      "Large absolute z indicates unusual values",
    ],
    formula: "z = (x - mu) / sigma",
  },
  lln: {
    what: "The Law of Large Numbers says sample averages converge to the true expected value as sample size grows.",
    visual:
      "Running averages fluctuate early, then stabilize near a horizontal target line.",
    intuition: [
      "Bigger samples reduce random noise in averages",
      "Convergence concerns long-run behavior",
      "It does not say every finite sample is close",
      "It justifies using sample means as estimators",
    ],
    formula: "x_bar_n -> E[X] as n -> infinity",
  },
  clt: {
    what: "The Central Limit Theorem states that sample means become approximately normal for large n under mild conditions.",
    visual:
      "Means from repeated samples form a bell shape even when raw data are skewed.",
    intuition: [
      "Distribution of means, not raw observations",
      "Approximation improves with larger n",
      "Standard error shrinks like 1/sqrt(n)",
      "Enables normal-based intervals and tests",
    ],
    formula: "(x_bar - mu) / (sigma/sqrt(n)) approx N(0,1)",
  },
  bayes: {
    what: "Bayes rule updates prior belief after observing evidence.",
    visual:
      "Start with prior probability, then reweight by likelihood to get posterior probability.",
    intuition: [
      "Posterior is proportional to prior times likelihood",
      "Evidence normalizes competing hypotheses",
      "Rare events can still have low posterior after positive tests",
      "Useful for sequential learning",
    ],
    formula: "P(A|B) = P(B|A)P(A) / P(B)",
  },
  likelihood: {
    what: "Likelihood treats observed data as fixed and measures which parameter values make that data most plausible.",
    visual:
      "A curve over parameter space peaks where the model best explains observed points.",
    intuition: [
      "Not a probability distribution over parameters by itself",
      "Relative likelihood compares support among parameter values",
      "Combines with priors to produce posteriors in Bayesian analysis",
      "Maximization yields MLE or contributes to MAP with priors",
    ],
    formula: "L(theta|x) = p(x|theta)",
  },
  credible: {
    what: "A credible interval is a posterior probability interval for a parameter under a Bayesian model.",
    visual:
      "Shade the central/highest-density region under posterior curve containing target mass (e.g., 95%).",
    intuition: [
      "Direct probability statement about parameter under model",
      "Depends on prior and likelihood assumptions",
      "Different constructions: equal-tail vs highest density interval",
      "Can differ from frequentist confidence intervals, especially in small samples",
    ],
    formula: "P(theta in I | data) = 0.95 (for a 95% credible interval)",
  },
  posteriorpredictive: {
    what: "Posterior predictive distribution averages predictions over posterior parameter uncertainty.",
    visual:
      "Each plausible parameter gives a predictive curve; averaging those curves produces wider, uncertainty-aware predictions.",
    intuition: [
      "Integrates both noise and parameter uncertainty",
      "Typically broader than plug-in predictive distributions",
      "Supports Bayesian model checking via replicated data",
      "Natural output for forecasting under uncertainty",
    ],
    formula: "p(y_new|data)=integral p(y_new|theta)p(theta|data)dtheta",
  },
  sampling: {
    what: "Sampling selects observations from a population to estimate unknown population quantities.",
    visual:
      "Different random samples from the same population produce slightly different summaries.",
    intuition: [
      "Randomness drives sampling variability",
      "Representative sampling is critical",
      "Bias can dominate even with large n",
      "Sampling design determines valid inference",
    ],
    formula: "Estimator = statistic computed from sampled units",
  },
  bootstrap: {
    what: "Bootstrap resamples the observed data with replacement to approximate estimator uncertainty.",
    visual: "Repeated resampled datasets produce a distribution of estimates.",
    intuition: [
      "No strong parametric model required",
      "Works well for many complex estimators",
      "Approximation depends on sample representativeness",
      "Useful for interval estimation and standard errors",
    ],
    formula: "Draw B resamples, compute theta_hat* for each",
  },
  confidence: {
    what: "A confidence interval gives a range of plausible parameter values from sample data.",
    visual:
      "Across repeated studies, many intervals capture the fixed true parameter.",
    intuition: [
      "Confidence level is long-run coverage frequency",
      "Wider intervals mean more uncertainty",
      "Larger n usually narrows intervals",
      "Not the probability that parameter lies in one fixed interval",
    ],
    formula: "estimate +/- critical_value * standard_error",
  },
  hypothesis: {
    what: "Hypothesis testing quantifies whether observed data are inconsistent with a null model.",
    visual:
      "Compute a test statistic and locate it relative to a null reference distribution.",
    intuition: [
      "Null is a benchmark, not automatically true",
      "Decision depends on statistic extremeness",
      "Power matters, not just significance",
      "Effect size and context should accompany p-values",
    ],
    formula: "Reject H0 when statistic falls in rejection region",
  },
  pvalue: {
    what: "The p-value is the probability, under the null, of seeing data at least as extreme as observed.",
    visual:
      "Shade the tail area beyond the observed test statistic in the null distribution.",
    intuition: [
      "Smaller p means data are less compatible with H0",
      "Not the probability that H0 is true",
      "Depends on model assumptions",
      "Can be small with tiny effects at huge sample sizes",
    ],
    formula: "p = P(|T| >= |t_obs| | H0)",
  },
  ttest: {
    what: "A t-test compares means when population variance is unknown, using the t distribution.",
    visual:
      "Difference in means is scaled by estimated standard error and compared to t critical values.",
    intuition: [
      "Accounts for uncertainty in variance estimation",
      "Variants: one-sample, two-sample, paired",
      "Assumptions influence validity",
      "Outputs statistic, p-value, and interval",
    ],
    formula: "t = (x_bar - mu0) / (s/sqrt(n))",
  },
  anova: {
    what: "ANOVA tests whether at least one group mean differs from others by comparing between-group and within-group variance.",
    visual:
      "If group centers separate more than within-group noise, the F statistic becomes large.",
    intuition: [
      "One global test for multiple means",
      "Uses variance decomposition",
      "Significant ANOVA does not say which groups differ",
      "Post-hoc tests are needed after rejection",
    ],
    formula: "F = MS_between / MS_within",
  },
  linearreg: {
    what: "Linear regression models expected outcome as a linear function of predictors.",
    visual: "A best-fit line minimizes total squared vertical residuals.",
    intuition: [
      "Slope encodes expected change per predictor unit",
      "Residuals measure unexplained variation",
      "R^2 summarizes explained variance proportion",
      "Assumptions matter for inference validity",
    ],
    formula: "y = beta0 + beta1 x + epsilon",
  },
  logistic: {
    what: "Logistic regression models probability of a binary outcome via the logistic (sigmoid) link.",
    visual:
      "A straight line in log-odds space becomes an S-curve in probability space.",
    intuition: [
      "Outputs probabilities between 0 and 1",
      "Coefficients act on log-odds",
      "Decision boundary occurs near probability 0.5",
      "Common for classification and risk scoring",
    ],
    formula: "P(Y=1|x) = 1 / (1 + exp(-(beta0 + beta^T x)))",
  },
};
