export const EXPLANATIONS = {
  mean: {
    what: "The mean is the arithmetic average of values — the balance point of a dataset on the number line. It is the unique value minimizing total squared deviation, making it the least-squares center.",
    visual:
      "Imagine each data point as equal weight on a ruler. The mean is where the ruler balances perfectly — moving it either way increases the total squared distances.",
    intuition: [
      "Mean uses every observation, giving each equal weight",
      "It shifts strongly with outliers — a single extreme value can pull it far",
      "Mean minimizes total squared error, making it optimal for squared-loss summaries",
      "For symmetric data, mean equals median and mode",
      "The sample mean is an unbiased estimator of the population mean under any finite-expectation distribution",
    ],
    formula: "x_bar = (1/n) * sum_i x_i",
  },
  median: {
    what: "The median is the middle value after sorting — a rank-based center that resists the influence of extreme values because it depends only on order, not magnitude.",
    visual:
      "Sort the values and draw a vertical cut at the center rank. That cut is the median — pulling one value to infinity does not move this cut.",
    intuition: [
      "Median is robust to outliers — only rank structure matters",
      "It summarizes rank position, not magnitude",
      "For skewed data it is often more representative than the mean",
      "Median minimizes total absolute deviation, unlike mean which minimizes squared deviation",
      "When mean and median diverge substantially, the distribution is skewed or contains outliers",
    ],
    formula:
      "median = middle order statistic (or average of two middle values for even n)",
  },
  variance: {
    what: "Variance measures spread by averaging squared deviations from the mean. The squaring ensures all deviations count positively and penalizes large deviations more than small ones.",
    visual:
      "Points far from the mean contribute much larger squares, so variance emphasizes distant values. The area of each deviation square is its contribution to variance.",
    intuition: [
      "Large variance means broad spread around the mean",
      "Squaring prevents cancellation of positive and negative deviations",
      "Units are the square of the data units — less directly interpretable than standard deviation",
      "Variance of a sum of independent variables equals the sum of their variances",
      "The n-1 denominator in sample variance corrects for estimation of mean from the same data",
    ],
    formula: "sample s^2 = (1/(n-1)) * sum_i (x_i - x_bar)^2",
  },
  stddev: {
    what: "Standard deviation is the square root of variance, restoring spread to the original units of measurement. It is the most interpretable spread summary for approximately symmetric, unimodal data.",
    visual:
      "Around the mean, mark ±1σ and ±2σ bands on the data axis. For normal data, about 68% and 95% of values lie within these bands respectively.",
    intuition: [
      "Interpretable in same units as data — directly comparable to data values",
      "Sensitive to outliers because it derives from squared deviations",
      "Smaller standard deviation means tighter clustering around the mean",
      "Used for z-scores and standardized comparisons across different scales",
      "Standard error of the mean = σ/√n shows how precisely the mean is estimated from n observations",
    ],
    formula: "s = sqrt(s^2)",
  },
  covariance: {
    what: "Covariance measures whether two variables tend to move together and in which direction. Positive covariance means they increase together; negative means one rises as the other falls.",
    visual:
      "If points tilt upward-right in a scatterplot, covariance is positive; downward-right tilt gives negative covariance; circular cloud scatter gives near-zero covariance.",
    intuition: [
      "Sign indicates direction of co-movement",
      "Magnitude depends on scale of both variables, making it hard to compare across different datasets",
      "Zero covariance means no linear co-movement but nonlinear dependence can still exist",
      "Covariance matrices encode full multivariate spread structure for Gaussian models and PCA",
      "Covariance is bilinear: Cov(aX+bY, Z) = a·Cov(X,Z) + b·Cov(Y,Z)",
    ],
    formula: "cov(X,Y) = (1/(n-1)) * sum_i (x_i-x_bar)(y_i-y_bar)",
  },
  correlation: {
    what: "Correlation is covariance normalized by the standard deviations of both variables, producing a scale-free measure bounded between -1 and +1 that quantifies linear association strength.",
    visual:
      "Tight points along an upward line indicate correlation near +1, downward line near -1, cloud-like scatter near 0. The tightness around the line determines the magnitude.",
    intuition: [
      "Scale-free measure of linear association — comparable across datasets with different units",
      "Sign indicates direction; magnitude indicates linear strength",
      "r = ±1 means perfect linear relationship; r = 0 means no linear relationship",
      "Correlation does not imply causation — confounders can create spurious correlation",
      "Nonlinear relationships can have near-zero correlation despite strong statistical dependence",
    ],
    formula: "r = cov(X,Y) / (s_X * s_Y)",
  },
  distribution: {
    what: "A distribution describes how probability mass or density is allocated across possible values — the complete probabilistic description of a random quantity beyond just mean and spread.",
    visual:
      "A histogram or density curve shows where outcomes are common (tall bars) and where they are rare (short bars). The full shape — center, spread, skew, tails — matters.",
    intuition: [
      "Center, spread, and shape (skewness, kurtosis) all matter for inference",
      "Different distributions model different data-generating mechanisms",
      "Tails control extreme-event behavior — heavy tails allow rare but large deviations",
      "Most inference methods assume distributional structure; misspecification affects validity",
      "Two datasets can share identical mean and variance yet have completely different shapes",
    ],
    formula: "Discrete: sum_x p(x)=1 ; Continuous: integral f(x) dx = 1",
  },
  randomvar: {
    what: "A random variable assigns a numerical value to each outcome of a random experiment. It is a function from the sample space of outcomes to the real numbers, enabling probabilistic algebra.",
    visual:
      "Outcomes (like dice faces) flow through a mapping rule and become numbers you can add, compare, and model with algebra and calculus.",
    intuition: [
      "Random variable is a function on outcomes — not a variable in the algebraic sense",
      "Different experiments can produce random variables with the same distribution",
      "Discrete variables take countable values; continuous variables take interval values",
      "Most statistical formulas operate on random variables through their distributions",
      "Transformations of random variables (like X² or log X) produce new random variables with derived distributions",
    ],
    formula: "X: Omega -> R",
  },
  expectation: {
    what: "Expectation is the long-run average value of a random variable under its probability law — the probability-weighted sum or integral of all possible values.",
    visual:
      "Imagine values on a balance beam weighted by probabilities; the expectation is the balance point where the distribution's center of mass lies.",
    intuition: [
      "Probability-weighted average, not a guaranteed observed value",
      "Linear operator: E[aX+bY] = aE[X] + bE[Y] regardless of dependence",
      "Foundation for risk, utility, and optimization criteria in decision theory",
      "Sample mean estimates expectation — converges under the law of large numbers",
      "For indicator random variables: E[1_A] = P(A), connecting expectation to probability",
    ],
    formula: "E[X] = sum_x x p(x)  or  integral x f(x) dx",
  },
  pmf: {
    what: "A PMF (Probability Mass Function) gives the exact probability for each value of a discrete random variable. It completely specifies the distribution for discrete outcomes.",
    visual:
      "Bars at each possible value show how much probability mass sits there. All bars sum to exactly one — the total probability of all outcomes.",
    intuition: [
      "Nonnegative probabilities that sum to exactly one",
      "Encodes the full discrete uncertainty model — all moments and event probabilities derive from it",
      "Expectation and variance are computed directly from the PMF as weighted sums",
      "Useful for counts, category frequencies, and any naturally discrete outcomes",
      "PMF determines CDF via cumulative summation: F(x) = sum_{t <= x} p(t)",
    ],
    formula: "p_X(x) = P(X=x), with sum_x p_X(x)=1",
  },
  cdf: {
    what: "A CDF (Cumulative Distribution Function) gives cumulative probability up to a threshold — P(X ≤ x). It works for both discrete and continuous variables and is the universal distribution representation.",
    visual:
      "A non-decreasing staircase (discrete) or smooth curve (continuous) accumulates probability mass as x increases, starting near 0 and approaching 1.",
    intuition: [
      "Always non-decreasing from 0 toward 1 as x increases",
      "Converts pointwise mass/density into cumulative probability — interval probability = F(b) - F(a)",
      "Works for both discrete and continuous (and mixed) variables in one framework",
      "Quantile functions are the inverse of CDFs — used for sampling and confidence bounds",
      "Empirical CDF (ECDF) from data converges uniformly to the true CDF (Glivenko-Cantelli theorem)",
    ],
    formula: "F_X(x)=P(X<=x)",
  },
  conditionalprob: {
    what: "Conditional probability quantifies chance of event A after restricting attention to cases where B occurred. It renormalizes the probability space to the conditioning event.",
    visual:
      "Inside the region for B, only the overlap with A counts as successful mass. Conditioning shrinks the sample space to B and renormalizes all probabilities within it.",
    intuition: [
      "Conditioning renormalizes probability space to the event B",
      "Order matters: P(A|B) and P(B|A) differ and can be very different in magnitude",
      "Core primitive behind Bayes rule and updating beliefs with evidence",
      "Useful for diagnostics, sequential evidence reasoning, and causal analysis",
      "Law of total probability: P(A) = Σ_i P(A|B_i)P(B_i) decomposes probability through conditioning",
    ],
    formula: "P(A|B)=P(A∩B)/P(B), for P(B)>0",
  },
  independence: {
    what: "Events (or variables) are independent when learning one does not change probability beliefs about the other. Formally, the joint probability factors into the product of marginals.",
    visual:
      "In a probability table, independence means each cell equals (row marginal)×(column marginal) — no interaction patterns exist between rows and columns.",
    intuition: [
      "Factorization criterion simplifies joint probability computations dramatically",
      "Zero correlation does not always imply independence — only for Gaussian variables",
      "Independence assumptions often drive model tractability in Naive Bayes and IID frameworks",
      "Must be justified from study design or mechanism, not assumed by default",
      "Pairwise independence does not imply mutual independence of three or more variables",
    ],
    formula: "A ⟂ B iff P(A∩B)=P(A)P(B)",
  },
  normal: {
    what: "The normal distribution is a bell-shaped distribution fully determined by mean μ and standard deviation σ. It arises as the limit of averages of many independent random quantities via the CLT.",
    visual:
      "A symmetric bell centered at μ with width controlled by σ. About 68% of probability lies within 1σ of center, 95% within 2σ, 99.7% within 3σ.",
    intuition: [
      "Many natural aggregates approximate normal due to the central limit effect",
      "Symmetric around mean — mean equals median equals mode",
      "68-95-99.7 rule gives quick probability ranges for standard deviation bands",
      "Foundation for z-tests and confidence intervals based on CLT approximation",
      "Normal family is closed under linear transformations and sums of independent normals",
    ],
    formula: "X ~ N(mu, sigma^2)",
  },
  zscore: {
    what: "A z-score standardizes a value by measuring how many standard deviations it lies from the mean. It enables direct comparison of values from different scales and distributions.",
    visual:
      "Map any value onto a standardized axis centered at 0 with unit spread. Values beyond ±2 are unusual; beyond ±3 are rare under normality.",
    intuition: [
      "Enables comparisons across different measurement scales and units",
      "z=0 is at the mean; z=1 is one SD above; z=-2 is two SDs below",
      "Large absolute z (|z|>2 or 3) indicates statistically unusual values",
      "Used in anomaly detection, outlier identification, and feature standardization for ML",
      "For normally distributed data, P(|Z|>1.96)≈0.05, giving the familiar 95% coverage",
    ],
    formula: "z = (x - mu) / sigma",
  },
  lln: {
    what: "The Law of Large Numbers says sample averages converge to the true expected value as sample size grows. It formalizes the intuition that larger samples are more reliable and justifies estimation.",
    visual:
      "A running average plot fluctuates wildly at first, then stabilizes near a horizontal target line. The envelope of variation shrinks as n grows.",
    intuition: [
      "Bigger samples reduce random noise in averages",
      "Convergence concerns long-run behavior — not any single finite sample",
      "LLN does not say every finite sample is close — just that the average converges",
      "Justifies using sample means as estimators of population means",
      "Weak LLN: convergence in probability; Strong LLN: almost-sure convergence — a stronger statement",
    ],
    formula: "x_bar_n -> E[X] as n -> infinity",
  },
  clt: {
    what: "The Central Limit Theorem states that sample means become approximately normally distributed for large n under mild conditions, regardless of the original population distribution.",
    visual:
      "Means from repeated samples form a bell shape even when raw data are skewed or discrete. The bell gets narrower and taller as n grows.",
    intuition: [
      "Applies to the distribution of means, not to individual raw observations",
      "Normal approximation quality improves with larger n, especially for skewed populations",
      "Standard error of the mean shrinks like σ/√n as n grows",
      "Enables normal-based confidence intervals and tests even for non-normal populations",
      "Rate of convergence is faster for symmetric populations than for highly skewed ones",
    ],
    formula: "(x_bar - mu) / (sigma/sqrt(n)) approx N(0,1)",
  },
  bayes: {
    what: "Bayes' rule updates prior belief after observing evidence by combining what you knew before (prior) with how likely the evidence is given each hypothesis (likelihood) to get updated belief (posterior).",
    visual:
      "Start with prior probability. Reweight each hypothesis by how likely it makes the observed evidence. Renormalize to get the posterior probability.",
    intuition: [
      "Posterior is proportional to prior times likelihood",
      "Evidence normalizes competing hypotheses into a valid probability distribution",
      "Rare events (low prior) can maintain low posterior even after a positive diagnostic test",
      "Sequential updating: each posterior becomes the prior for the next observation",
      "Posterior odds = prior odds × likelihood ratio — evidence combines multiplicatively",
    ],
    formula: "P(A|B) = P(B|A)P(A) / P(B)",
  },
  likelihood: {
    what: "Likelihood treats observed data as fixed and measures which parameter values make that data most plausible under the model. It is not itself a probability distribution over parameters.",
    visual:
      "A curve over parameter space peaks where the model best explains observed data points — the height at each parameter value reflects how well that parameter fits.",
    intuition: [
      "Likelihood is a function of parameters given fixed data, not a probability over parameters",
      "Relative likelihood compares support among parameter values — ratios matter, not absolutes",
      "Log-likelihood converts product over observations into a sum, which is easier to maximize",
      "Combining likelihood with a prior via Bayes' rule gives the posterior",
      "Profile likelihood marginalizes nuisance parameters for inference about parameters of interest",
    ],
    formula: "L(theta|x) = p(x|theta)",
  },
  credible: {
    what: "A credible interval is a posterior probability interval for a parameter — directly interpretable as the parameter lying within the interval with stated probability under the Bayesian model.",
    visual:
      "Shade the central or highest-density region under the posterior curve containing the target probability mass (e.g., 95%). The parameter is considered plausible within this region.",
    intuition: [
      "Direct probability statement: P(θ in I | data) = 0.95 — unlike frequentist confidence intervals",
      "Depends on prior and likelihood assumptions — prior matters especially in small samples",
      "Equal-tail vs highest posterior density (HPD) intervals differ for asymmetric posteriors",
      "Can differ substantially from frequentist confidence intervals in sparse-data settings",
      "As data accumulates, Bayesian credible intervals and frequentist confidence intervals typically converge",
    ],
    formula: "P(theta in I | data) = 0.95 (for a 95% credible interval)",
  },
  posteriorpredictive: {
    what: "The posterior predictive distribution averages predictions over all plausible parameter values weighted by posterior probability, accounting for parameter uncertainty in addition to sampling noise.",
    visual:
      "Each plausible parameter gives a predictive curve; averaging those curves with posterior weights produces a wider, uncertainty-aware prediction distribution.",
    intuition: [
      "Integrates both sampling noise and parameter uncertainty — naturally wider than plug-in predictions",
      "Typically broader than predictions made at the single posterior mean parameter",
      "Supports Bayesian model checking: compare replicated data distributions to observed data",
      "Natural output for forecasting under full uncertainty in a Bayesian workflow",
      "Draws from posterior predictive: sample θ from posterior, then sample y from model — no integration needed",
    ],
    formula: "p(y_new|data)=integral p(y_new|theta)p(theta|data)dtheta",
  },
  sampling: {
    what: "Sampling selects observations from a population to estimate unknown population quantities. The sampling design determines which inferences are valid and what biases may arise.",
    visual:
      "Different random samples from the same population produce slightly different summary statistics. The spread across samples is the sampling variability.",
    intuition: [
      "Randomness drives sampling variability and enables probability-based inference",
      "Representative sampling is critical — biased selection produces biased estimates regardless of n",
      "Large n reduces random error but does not fix systematic selection bias",
      "Sampling design (simple random, stratified, cluster) determines valid inference methods",
      "Non-response and coverage bias can dominate even in very large samples",
    ],
    formula: "Estimator = statistic computed from sampled units",
  },
  bootstrap: {
    what: "Bootstrap resamples the observed data with replacement to approximate the sampling distribution of an estimator — providing uncertainty estimates without strong parametric assumptions.",
    visual:
      "Repeatedly drawing n observations with replacement from the original sample creates many bootstrap datasets. Computing the estimator on each gives an empirical distribution of estimates.",
    intuition: [
      "Treats the observed data as a proxy for the population",
      "No strong parametric model required — works for complex estimators like medians or correlations",
      "Approximation quality depends on sample representativeness of the true population",
      "Useful for interval estimation and standard errors when analytic formulas are hard",
      "Block bootstrap extends the method to dependent data like time series",
    ],
    formula: "Draw B resamples of size n with replacement, compute theta_hat* for each",
  },
  confidence: {
    what: "A confidence interval gives a range of plausible parameter values from sample data. The confidence level refers to the long-run coverage frequency of the procedure across many repeated samples.",
    visual:
      "Across 100 repeated studies, approximately 95 of the 95% confidence intervals computed would contain the true parameter. One specific interval either does or doesn't contain it.",
    intuition: [
      "Confidence level describes long-run coverage frequency, not probability for one specific interval",
      "Wider intervals reflect more uncertainty — larger SE or smaller n",
      "Larger n usually narrows intervals because SE shrinks proportionally to 1/√n",
      "Confidence interval is NOT the probability that the parameter lies in one specific computed interval",
      "Different methods (t-interval, bootstrap, likelihood) can give different intervals for identical data",
    ],
    formula: "estimate +/- critical_value * standard_error",
  },
  hypothesis: {
    what: "Hypothesis testing quantifies whether observed data are inconsistent with a null model by computing a test statistic and comparing it to a null reference distribution.",
    visual:
      "Compute a test statistic and locate it on the null reference distribution. Its extremeness determines the evidence against H₀.",
    intuition: [
      "Null hypothesis is a benchmark, not a claim believed to be true",
      "Decision depends on test statistic extremeness under H₀",
      "Statistical power measures probability of detecting a true effect — often overlooked",
      "Effect size and practical significance should accompany p-values",
      "Type I error (false positive rate α) and Type II error (false negative rate β) trade off",
    ],
    formula: "Reject H0 when statistic falls in rejection region at level alpha",
  },
  pvalue: {
    what: "The p-value is the probability, under the null hypothesis, of seeing data at least as extreme as observed. Smaller p means data are less compatible with H₀.",
    visual:
      "Shade the tail area beyond the observed test statistic in the null distribution. That shaded area is the p-value.",
    intuition: [
      "Smaller p means data are more surprising under H₀",
      "P-value is NOT the probability that H₀ is true",
      "Depends heavily on model and distributional assumptions",
      "Can be very small with tiny practical effects at very large sample sizes",
      "Multiple testing inflates false positives — Bonferroni or false discovery rate correction is essential",
    ],
    formula: "p = P(|T| >= |t_obs| | H0)",
  },
  ttest: {
    what: "A t-test compares means when population variance is unknown, using the t-distribution to account for extra uncertainty from estimating variance. Available in one-sample, two-sample, and paired variants.",
    visual:
      "The observed mean difference is scaled by estimated standard error and compared to t-distribution critical values — wider data spread requires a larger gap to be considered significant.",
    intuition: [
      "Accounts for variance estimation uncertainty — t-distribution has heavier tails than normal",
      "One-sample: compare to fixed μ₀. Two-sample: compare groups. Paired: compare within-unit differences",
      "Welch's t-test handles unequal variances — generally safer than equal-variance version",
      "Assumptions: approximately normal data (or large n by CLT) and independent observations",
      "For large n, t-test approximates z-test because t-distribution approaches normal",
    ],
    formula: "t = (x_bar - mu0) / (s/sqrt(n))",
  },
  anova: {
    what: "ANOVA tests whether at least one group mean differs from others by decomposing total variance into explained (between-group) and unexplained (within-group) components.",
    visual:
      "If group centers are far apart relative to within-group scatter, the F statistic becomes large. Groups with heavily overlapping spread produce a small F near 1.",
    intuition: [
      "One global test for multiple means — avoids inflating Type I error from multiple pairwise t-tests",
      "Uses variance decomposition: total SS = between-group SS + within-group SS",
      "Significant ANOVA only says at least one group differs — post-hoc tests identify which",
      "F-statistic equals the square of the t-statistic when comparing exactly two groups",
      "Assumptions: normality, homogeneity of variances across groups, and independent observations",
    ],
    formula: "F = MS_between / MS_within",
  },
  linearreg: {
    what: "Linear regression models expected outcome as a linear function of predictors by minimizing total squared residuals. Coefficients have interpretations as expected change per unit predictor increase.",
    visual:
      "A best-fit line minimizes total squared vertical distances from data points to the line. Residuals (vertical gaps) represent unexplained variation.",
    intuition: [
      "Slope encodes expected change in outcome per one-unit increase in predictor, holding others constant",
      "Residuals measure unexplained variation — their pattern reveals model adequacy",
      "R² summarizes what fraction of outcome variance is explained by the predictors",
      "OLS estimator is BLUE (Best Linear Unbiased Estimator) under Gauss-Markov assumptions",
      "Coefficient standard errors and p-values enable inference about predictor effects",
    ],
    formula: "y = beta0 + beta1 x + epsilon",
  },
  logistic: {
    what: "Logistic regression models probability of a binary outcome via the logistic (sigmoid) link. Linear in log-odds space, it produces an S-curve probability in the original scale.",
    visual:
      "A straight line in log-odds space transforms to an S-curve in probability space. The decision boundary where probability equals 0.5 corresponds to zero log-odds.",
    intuition: [
      "Outputs probabilities between 0 and 1 — valid probability interpretation for binary outcomes",
      "Coefficients act on log-odds: one-unit increase in x multiplies odds by exp(β)",
      "Decision boundary occurs where the linear predictor equals zero",
      "Estimated via maximum likelihood — cross-entropy is the negative log-likelihood for Bernoulli outcomes",
      "AUC measures discrimination; calibration curves measure probability accuracy separately",
    ],
    formula: "P(Y=1|x) = 1 / (1 + exp(-(beta0 + beta^T x)))",
  },
};
