export const CONCEPT_DETAILS = {
  mean: {
    deeper:
      "Mean is a least-squares center. It is optimal for squared-loss summaries and is highly sensitive to extreme observations.",
    useCases: [
      "Monitoring average process output over time",
      "Baseline KPI reporting for balanced data",
      "Building linear-model targets and residual summaries",
    ],
    pitfalls: [
      "Using mean alone on strongly skewed data",
      "Ignoring outlier influence before interpretation",
    ],
    quickCheck: "Check how much x_bar changes when top/bottom 1% is trimmed.",
  },
  median: {
    deeper:
      "Median is an order-statistic center with high robustness. It changes only when rank ordering shifts around the center.",
    useCases: [
      "Income or price summaries with long right tails",
      "Robust center tracking in noisy operational data",
      "Fallback center when outliers are frequent",
    ],
    pitfalls: [
      "Discarding magnitude information in tails",
      "Comparing medians without sample-size context",
    ],
    quickCheck:
      "Plot mean vs median gap; large gap indicates skew/outlier pressure.",
  },
  variance: {
    deeper:
      "Variance quantifies second-moment dispersion around the mean. It is additive for independent components and central to uncertainty propagation.",
    useCases: [
      "Risk quantification in forecasting",
      "Noise characterization in measurement systems",
      "Model diagnostics through residual spread",
    ],
    pitfalls: [
      "Interpreting squared units as direct practical magnitude",
      "Comparing variances across differently scaled variables",
    ],
    quickCheck:
      "Standardize units or compare coefficient of variation when scales differ.",
  },
  stddev: {
    deeper:
      "Standard deviation rescales variance back into data units. It is often the most interpretable spread summary for approximately symmetric data.",
    useCases: [
      "Tolerance and quality-control thresholds",
      "Volatility reporting in finance/operations",
      "Standardized anomaly scoring",
    ],
    pitfalls: [
      "Treating sigma-rules as universal for non-normal data",
      "Ignoring heavy tails that inflate standard deviation",
    ],
    quickCheck:
      "Inspect histogram/QQ behavior before using normal-rule interpretations.",
  },
  covariance: {
    deeper:
      "Covariance is the raw second-order co-moment between centered variables. In matrix form, it captures geometry of multivariate uncertainty.",
    useCases: [
      "Portfolio risk decomposition",
      "Feature interaction analysis",
      "Constructing covariance matrices for PCA",
    ],
    pitfalls: [
      "Comparing covariance magnitudes across different scales",
      "Interpreting covariance as causal linkage",
    ],
    quickCheck:
      "Convert to correlation when scale-free comparison is required.",
  },
  correlation: {
    deeper:
      "Correlation is normalized covariance, providing a bounded, unitless linear association measure.",
    useCases: [
      "Feature screening for linear models",
      "Dependency heatmaps in exploratory analysis",
      "Multicollinearity diagnostics",
    ],
    pitfalls: [
      "Assuming nonlinear relationships imply high correlation",
      "Treating correlation as directional causality",
    ],
    quickCheck: "Always pair r with scatterplot shape inspection.",
  },
  distribution: {
    deeper:
      "Distribution is the full probabilistic object, not just summary metrics. Shape properties drive tail risk and inferential behavior.",
    useCases: [
      "Simulation and scenario generation",
      "Likelihood-based modeling",
      "Tail-risk and rare-event planning",
    ],
    pitfalls: [
      "Using only mean and standard deviation for non-Gaussian data",
      "Ignoring multimodality in aggregate summaries",
    ],
    quickCheck:
      "Overlay histogram + density + quantiles before choosing a parametric family.",
  },
  randomvar: {
    deeper:
      "Random variables are measurable mappings from outcomes to numbers, enabling probability laws to be analyzed with algebra and calculus.",
    useCases: [
      "Formulating stochastic models in finance, operations, and ML",
      "Defining derived quantities from complex random experiments",
      "Building simulation pipelines with explicit uncertainty variables",
    ],
    pitfalls: [
      "Confusing outcomes with variable values",
      "Skipping support/domain specification before computation",
    ],
    quickCheck:
      "State experiment, outcome space, mapping rule, and support of X.",
  },
  expectation: {
    deeper:
      "Expectation is the first moment of a distribution and acts as a linear functional over random variables.",
    useCases: [
      "Risk-neutral expected value calculations",
      "Cost/benefit optimization under uncertainty",
      "Theoretical performance metrics for algorithms",
    ],
    pitfalls: [
      "Using expectation as guaranteed realized outcome",
      "Ignoring heavy-tail cases where moments may diverge",
    ],
    quickCheck:
      "Compute weighted average and verify weights sum/integrate to one.",
  },
  pmf: {
    deeper:
      "PMF is the discrete probability law itself; all moments and event probabilities derive from it.",
    useCases: [
      "Count-model specification (defects, arrivals, clicks)",
      "Exact probability calculations for finite outcomes",
      "Constructing expected-value and variance summaries",
    ],
    pitfalls: [
      "Forgetting normalization of probabilities to one",
      "Assigning positive mass to impossible outcomes",
    ],
    quickCheck: "Sum all masses; must equal 1 (within numerical tolerance).",
  },
  cdf: {
    deeper:
      "CDF is a universal representation of distributions, handling mixed discrete/continuous laws in one object.",
    useCases: [
      "Computing interval and tail probabilities quickly",
      "Inverse-transform sampling and quantile methods",
      "Distribution comparison via ECDF overlays",
    ],
    pitfalls: [
      "Treating CDF differences as density without derivative checks",
      "Ignoring jump structure for discrete variables",
    ],
    quickCheck: "Ensure monotone non-decreasing behavior and limits near 0/1.",
  },
  conditionalprob: {
    deeper:
      "Conditioning renormalizes probability mass on the conditioning event and is foundational for sequential inference.",
    useCases: [
      "Diagnostic test interpretation",
      "Risk updates after partial information",
      "Markov and Bayesian network computations",
    ],
    pitfalls: [
      "Swapping P(A|B) with P(B|A)",
      "Conditioning on events with near-zero probability carelessly",
    ],
    quickCheck:
      "Build a 2x2 table or Venn area ratio before algebraic simplification.",
  },
  independence: {
    deeper:
      "Independence is a structural factorization condition and often encodes experimental design assumptions.",
    useCases: [
      "Simplifying joint probability models",
      "Variance decomposition in sum models",
      "Assumption checks for many inferential procedures",
    ],
    pitfalls: [
      "Assuming independence from zero empirical correlation",
      "Overlooking latent confounders creating dependence",
    ],
    quickCheck: "Compare P(A∩B) against P(A)P(B) directly.",
  },
  normal: {
    deeper:
      "Normality gives analytic tractability and arises as an approximation via aggregation effects. It is a model, not a default truth.",
    useCases: [
      "Approximate inferential calculations",
      "Error modeling in measurement systems",
      "Standard score transformations",
    ],
    pitfalls: [
      "Assuming normal tails for heavy-tailed processes",
      "Applying normal rules to strongly skewed data",
    ],
    quickCheck:
      "Use QQ diagnostics and tail checks before normal-based decisions.",
  },
  zscore: {
    deeper:
      "Z-score is a location-scale normalization that allows cross-variable comparability and standardized thresholding.",
    useCases: [
      "Anomaly detection in monitoring pipelines",
      "Cross-metric ranking in dashboards",
      "Preprocessing for distance-based methods",
    ],
    pitfalls: [
      "Standardizing with unstable mean/sigma estimates",
      "Using z-thresholds on nonstationary streams",
    ],
    quickCheck:
      "Re-estimate normalization window and check drift periodically.",
  },
  lln: {
    deeper:
      "LLN formalizes estimator consistency of sample means under finite expectation. It justifies long-run stabilization, not finite-sample guarantees.",
    useCases: [
      "Designing sample-size growth policies",
      "Interpreting running average convergence",
      "Explaining Monte Carlo stabilization behavior",
    ],
    pitfalls: [
      "Expecting monotonic convergence",
      "Ignoring dependence that can slow stabilization",
    ],
    quickCheck: "Plot running mean with confidence bands across n.",
  },
  clt: {
    deeper:
      "CLT gives approximate normality of aggregated statistics, enabling practical inferential approximations under broad conditions.",
    useCases: [
      "Approximate confidence intervals for means",
      "Normal-approximation tests in large samples",
      "Sampling-distribution intuition for analysts",
    ],
    pitfalls: [
      "Using CLT blindly for extreme skew with tiny n",
      "Confusing distribution of sample mean with raw data distribution",
    ],
    quickCheck:
      "Simulate sampling distributions at candidate n to verify approximation quality.",
  },
  bayes: {
    deeper:
      "Bayesian updating combines prior information with data evidence in a coherent probability calculus.",
    useCases: [
      "Medical diagnostic post-test probability updates",
      "Sequential model updating with new data",
      "Decision support under uncertain base rates",
    ],
    pitfalls: [
      "Ignoring base-rate effects",
      "Using poorly calibrated likelihood assumptions",
    ],
    quickCheck:
      "Report prior, likelihood, and posterior together for auditability.",
  },
  likelihood: {
    deeper:
      "Likelihood ranks parameter plausibility for fixed data and underpins both frequentist and Bayesian estimation frameworks.",
    useCases: [
      "Maximum-likelihood parameter fitting",
      "Profile-likelihood uncertainty assessments",
      "Combining with priors for Bayesian posteriors",
    ],
    pitfalls: [
      "Interpreting likelihood as posterior without prior normalization",
      "Comparing raw likelihoods across non-equivalent data scales",
    ],
    quickCheck:
      "Plot log-likelihood over parameter grid to inspect shape and identifiability.",
  },
  credible: {
    deeper:
      "Credible intervals are posterior-probability statements and naturally incorporate prior information and model structure.",
    useCases: [
      "Uncertainty communication in Bayesian reports",
      "Decision thresholds based on posterior mass",
      "Small-sample inference with informative priors",
    ],
    pitfalls: [
      "Comparing directly to frequentist CI without context",
      "Ignoring prior sensitivity in weak-data settings",
    ],
    quickCheck: "Verify posterior mass inside interval equals target level.",
  },
  posteriorpredictive: {
    deeper:
      "Posterior predictive distributions propagate parameter uncertainty into future-outcome uncertainty.",
    useCases: [
      "Forecast intervals under Bayesian models",
      "Posterior predictive checks for model adequacy",
      "Scenario simulation with uncertainty propagation",
    ],
    pitfalls: [
      "Using point-estimate predictions while claiming full Bayesian uncertainty",
      "Neglecting model-misspecification diagnostics",
    ],
    quickCheck:
      "Generate replicated data from posterior predictive and compare with observed structure.",
  },
  sampling: {
    deeper:
      "Sampling design determines what can be inferred from data. Randomness, coverage, and inclusion mechanisms drive estimator properties.",
    useCases: [
      "Survey and polling design",
      "A/B experiment measurement collection",
      "Industrial quality audits",
    ],
    pitfalls: [
      "Convenience samples masquerading as representative",
      "Ignoring cluster/strata structure in variance estimates",
    ],
    quickCheck: "Document frame, selection rule, and non-response pattern.",
  },
  bootstrap: {
    deeper:
      "Bootstrap approximates sampling distributions from observed data, useful when analytic variance formulas are hard or unavailable.",
    useCases: [
      "Confidence intervals for custom estimators",
      "Model stability checks across resamples",
      "Uncertainty estimation in small-to-medium datasets",
    ],
    pitfalls: [
      "Applying bootstrap naively to dependent time series",
      "Overtrusting intervals from tiny biased samples",
    ],
    quickCheck: "Compare percentile and BCa-style intervals when feasible.",
  },
  confidence: {
    deeper:
      "Confidence intervals express inferential uncertainty through repeated-sampling coverage behavior.",
    useCases: [
      "Communicating estimate uncertainty in reports",
      "Comparing treatment effects with uncertainty context",
      "Decision thresholds with margin-of-error constraints",
    ],
    pitfalls: [
      "Interpreting one CI as posterior probability interval",
      "Reporting intervals without assumptions or method notes",
    ],
    quickCheck:
      "State estimator, standard-error method, and confidence level explicitly.",
  },
  hypothesis: {
    deeper:
      "Testing is an evidence-calibration workflow balancing false positives and false negatives under a specified model.",
    useCases: [
      "Product experiment decision rules",
      "Quality-control threshold checks",
      "Scientific claim screening",
    ],
    pitfalls: [
      "Binary thinking without effect-size context",
      "Multiple testing without correction",
    ],
    quickCheck:
      "Report test statistic, p-value, effect size, and interval together.",
  },
  pvalue: {
    deeper:
      "P-values measure data extremeness under H0. They are diagnostics of model-data compatibility, not direct truth probabilities.",
    useCases: [
      "Ranking hypotheses by incompatibility with H0",
      "Triaging follow-up analyses",
      "Regulatory-style significance criteria",
    ],
    pitfalls: [
      "Treating p as effect magnitude",
      "P-hacking via flexible stopping/specification",
    ],
    quickCheck:
      "Run sensitivity checks to modeling choices and multiple-testing controls.",
  },
  ttest: {
    deeper:
      "t-tests account for unknown variance through Student-t reference distributions and finite-sample corrections.",
    useCases: [
      "Mean comparison in small samples",
      "Pre/post paired difference analysis",
      "Quick baseline significance checks",
    ],
    pitfalls: [
      "Ignoring heteroskedasticity in two-sample settings",
      "Skipping normality/robustness checks for tiny n",
    ],
    quickCheck:
      "Confirm variant (paired, one-sample, Welch) matches data structure.",
  },
  anova: {
    deeper:
      "ANOVA partitions variability into explained and unexplained components, testing whether group-level structure exceeds noise.",
    useCases: [
      "Comparing multiple treatment arms",
      "Factor screening in experiments",
      "Variance component diagnostics",
    ],
    pitfalls: [
      "Interpreting significant F as all groups differ",
      "Neglecting post-hoc multiplicity adjustments",
    ],
    quickCheck:
      "Inspect residual assumptions and run post-hoc contrasts after rejection.",
  },
  linearreg: {
    deeper:
      "Linear regression estimates conditional mean structure with interpretable coefficients under linearity assumptions.",
    useCases: [
      "Trend estimation and forecasting baselines",
      "Impact estimation with covariate adjustment",
      "Feature-effect screening in tabular datasets",
    ],
    pitfalls: [
      "Assuming correlation implies causal slope",
      "Ignoring residual diagnostics and leverage points",
    ],
    quickCheck: "Check residual plots, leverage, and coefficient uncertainty.",
  },
  logistic: {
    deeper:
      "Logistic regression models log-odds linearly while constraining probabilities to [0,1], suitable for binary outcomes.",
    useCases: [
      "Binary risk scoring",
      "Customer churn/default classification",
      "Medical event probability modeling",
    ],
    pitfalls: [
      "Using 0.5 threshold without class-cost analysis",
      "Ignoring calibration and class imbalance",
    ],
    quickCheck:
      "Evaluate both discrimination (AUC) and calibration (reliability).",
  },
};

export const CONCEPT_EXPANSIONS = {
  mean: {
    algebraic:
      "Mean is linear: mean(aX+b)=a*mean(X)+b, and for independent samples it is an unbiased estimator of population mean.",
    computation:
      "Sum observations, divide by n, and compare with trimmed mean to test outlier sensitivity.",
    workedExample: "For values 2,3,4,11 mean is 5; removing 11 gives mean 3.",
    connections: ["Variance", "LLN", "Linear regression"],
  },
  median: {
    algebraic:
      "Median is the 0.5 quantile and is invariant to monotone transforms in rank space.",
    computation:
      "Sort values; if n odd take middle, if n even average the two middle values.",
    workedExample: "For 1,2,2,100 median is 2 while mean is 26.25.",
    connections: ["Quantiles", "Robust statistics", "Distribution shape"],
  },
  variance: {
    algebraic:
      "Var(X)=E[X^2]-E[X]^2 and Var(aX+b)=a^2 Var(X). For independent X,Y: Var(X+Y)=Var(X)+Var(Y).",
    computation:
      "Compute centered deviations, square them, sum, and divide by n-1 for sample variance.",
    workedExample: "Data 1,3,5 has mean 3 and sample variance 4.",
    connections: ["Standard deviation", "ANOVA", "Covariance"],
  },
  stddev: {
    algebraic:
      "Std dev is sqrt(variance), restoring scale interpretability while preserving dispersion ordering.",
    computation:
      "Compute sample variance first, then square root; inspect coefficient of variation when mean is meaningful.",
    workedExample: "If variance is 9, standard deviation is 3 units.",
    connections: ["Z-score", "Normal distribution", "Confidence interval"],
  },
  covariance: {
    algebraic: "Cov(X,Y)=E[(X-EX)(Y-EY)] and Cov(aX,bY)=ab Cov(X,Y).",
    computation:
      "Center both variables, multiply pairwise centered terms, average with n-1 denominator.",
    workedExample:
      "If high X tends to align with high Y, covariance is positive.",
    connections: ["Correlation", "PCA", "Multivariate normal"],
  },
  correlation: {
    algebraic:
      "Correlation rescales covariance by standard deviations and is bounded in [-1,1].",
    computation:
      "Compute covariance and divide by product of sample standard deviations.",
    workedExample: "Perfect linear relation y=2x+1 gives r close to +1.",
    connections: ["Covariance", "Linear regression", "Hypothesis test"],
  },
  distribution: {
    algebraic:
      "Distribution determines all probabilities and moments; summary statistics are projections of this full object.",
    computation:
      "Estimate empirically with histogram/ECDF and fit parametric forms only after diagnostics.",
    workedExample:
      "Two datasets can share mean/variance but have very different shapes.",
    connections: ["Normal", "CLT", "Hypothesis testing"],
  },
  randomvar: {
    algebraic:
      "A random variable is a measurable map X:Omega->R; its law induces PMF/PDF/CDF representations.",
    computation:
      "Define support and mapping explicitly, then derive probabilities and moments from the induced law.",
    workedExample:
      "For two coin flips, X=#heads maps outcomes {TT,TH,HT,HH} to {0,1,1,2}.",
    connections: ["PMF", "CDF", "Expectation"],
  },
  expectation: {
    algebraic:
      "Expectation is a linear operator: E[aX+bY]=aE[X]+bE[Y]; for indicators E[1_A]=P(A).",
    computation:
      "Discrete: weighted sum over support. Continuous: integrate x*f(x) over support.",
    workedExample: "Fair die expectation: (1+2+3+4+5+6)/6 = 3.5.",
    connections: ["LLN", "Variance", "Risk minimization"],
  },
  pmf: {
    algebraic:
      "PMF fully specifies a discrete distribution and determines CDF via cumulative summation.",
    computation:
      "Assign masses to each support value, ensure nonnegativity and normalization.",
    workedExample: "Bernoulli(p): P(X=1)=p, P(X=0)=1-p.",
    connections: ["Random variable", "CDF", "Expectation"],
  },
  cdf: {
    algebraic:
      "CDF F(x)=P(X<=x) is right-continuous and monotone; interval probabilities are differences of CDF values.",
    computation:
      "For discrete laws, cumulative sum PMF; for continuous laws, integrate density.",
    workedExample: "If X~Uniform(0,1), F(x)=x on [0,1].",
    connections: ["PMF/PDF", "Quantiles", "Tail probabilities"],
  },
  conditionalprob: {
    algebraic:
      "Conditioning rescales intersection probability by event mass: P(A|B)=P(A∩B)/P(B).",
    computation:
      "Compute intersection and denominator event, then divide and simplify.",
    workedExample: "From card deck: P(heart|red)=1/2.",
    connections: ["Bayes rule", "Independence", "Probability trees"],
  },
  independence: {
    algebraic:
      "Independence factorizes joint law: P(A∩B)=P(A)P(B); similarly for random variables via joint distributions.",
    computation:
      "Check multiplicative equality for representative events or full table/factorization form.",
    workedExample:
      "Independent fair coin flips satisfy P(H1∩H2)=1/4=(1/2)(1/2).",
    connections: [
      "Covariance",
      "Conditional probability",
      "Naive Bayes assumptions",
    ],
  },
  normal: {
    algebraic:
      "Normal is closed under linear transformations and sums of independent normal variables.",
    computation:
      "Standardize with z=(x-mu)/sigma and read probabilities from standard normal CDF.",
    workedExample: "If X~N(100,15^2), P(X>130) equals P(Z>2).",
    connections: ["Z-score", "CLT", "t-test approximations"],
  },
  zscore: {
    algebraic:
      "Z-score converts location-scale families to standardized coordinates.",
    computation:
      "Subtract center and divide by spread; for sample use x_bar and s.",
    workedExample: "x=85, mean=70, sd=5 gives z=3.",
    connections: ["Normal CDF", "Anomaly detection", "Standardization"],
  },
  lln: {
    algebraic:
      "Under finite expectation, sample mean converges in probability to true mean.",
    computation:
      "Track running average versus n and verify stabilization around expected value.",
    workedExample:
      "Coin-toss proportion of heads approaches 0.5 as toss count grows.",
    connections: ["Sampling", "CLT", "Monte Carlo"],
  },
  clt: {
    algebraic:
      "Scaled sample means converge in distribution to standard normal under mild conditions.",
    computation:
      "Simulate repeated samples, compute means, and inspect histogram of means for bell shape.",
    workedExample:
      "Even skewed exponential draws yield near-normal mean distribution for large n.",
    connections: ["Confidence intervals", "Hypothesis tests", "Standard error"],
  },
  bayes: {
    algebraic:
      "Posterior odds = prior odds * likelihood ratio, making evidence updates multiplicative.",
    computation:
      "Compute prior, likelihood, evidence, then normalize to posterior.",
    workedExample:
      "Low prevalence can keep posterior modest despite high test sensitivity.",
    connections: [
      "Conditional probability",
      "Diagnostic testing",
      "Decision theory",
    ],
  },
  likelihood: {
    algebraic:
      "Likelihood is the model density/mass viewed as function of parameter given fixed data.",
    computation:
      "Write log-likelihood, differentiate or optimize numerically for best-supported parameter values.",
    workedExample:
      "Binomial data with k successes in n trials: L(p) proportional to p^k(1-p)^(n-k).",
    connections: ["Bayes posterior", "MLE", "Information criteria"],
  },
  credible: {
    algebraic:
      "Credible intervals satisfy posterior mass constraints, e.g., integral_I p(theta|data)dtheta = 0.95.",
    computation:
      "Sample posterior draws and take quantiles (equal-tail) or highest-density region.",
    workedExample:
      "Posterior draws for theta yield 2.5% and 97.5% quantiles as a 95% interval.",
    connections: [
      "Posterior distribution",
      "Bayesian decision making",
      "Prior sensitivity",
    ],
  },
  posteriorpredictive: {
    algebraic:
      "Posterior predictive marginalizes parameter uncertainty: p(y_new|data)=integral p(y_new|theta)p(theta|data)dtheta.",
    computation:
      "Draw theta from posterior, then draw y_new from p(y|theta), aggregate simulated outcomes.",
    workedExample:
      "Posterior draws of conversion rate produce predictive distribution of future conversions.",
    connections: ["Bayes rule", "Model checking", "Forecast uncertainty"],
  },
  sampling: {
    algebraic:
      "Estimator properties (bias/variance) are defined over repeated samples from the design.",
    computation:
      "Specify sampling frame and randomization procedure before data collection.",
    workedExample: "Simple random sample mean is unbiased for population mean.",
    connections: ["Bootstrap", "Confidence intervals", "Survey statistics"],
  },
  bootstrap: {
    algebraic:
      "Bootstrap approximates sampling distribution of an estimator via empirical distribution resampling.",
    computation:
      "Resample with replacement B times and compute estimator each time; summarize distribution.",
    workedExample:
      "Bootstrap 95% interval from percentile of resampled medians.",
    connections: [
      "Sampling variability",
      "Confidence intervals",
      "Robust inference",
    ],
  },
  confidence: {
    algebraic:
      "Frequentist CI procedure has long-run coverage equal to nominal confidence under model assumptions.",
    computation:
      "Compute estimate, standard error, critical value, and endpoints.",
    workedExample: "x_bar=50, SE=2, 95% z interval approx [46.1,53.9].",
    connections: ["CLT", "Hypothesis testing", "Standard error"],
  },
  hypothesis: {
    algebraic:
      "Testing maps data to a test statistic and rejection rule controlling Type I error under H0.",
    computation:
      "Define H0/H1, pick statistic, compute reference distribution, then evaluate p-value.",
    workedExample:
      "Reject H0:mu=0 when |t| exceeds critical threshold at alpha.",
    connections: ["P-value", "Confidence interval", "Power analysis"],
  },
  pvalue: {
    algebraic:
      "P-value is a tail probability of the test statistic distribution under H0.",
    computation:
      "Compute observed statistic and integrate tail(s) beyond that value under null model.",
    workedExample: "Observed t=2.4 may yield p around 0.02 depending on df.",
    connections: ["Hypothesis testing", "Type I error", "Multiple comparisons"],
  },
  ttest: {
    algebraic:
      "t-statistic uses estimated standard error and t-reference distribution with degrees of freedom.",
    computation:
      "Use one-sample, paired, or Welch two-sample formula based on design.",
    workedExample: "Two-group Welch t-test handles unequal variances robustly.",
    connections: ["Confidence intervals", "P-value", "ANOVA (k=2 equivalent)"],
  },
  anova: {
    algebraic:
      "ANOVA decomposes total sum of squares into between-group and within-group components.",
    computation:
      "Compute group means, sums of squares, mean squares, and F-statistic.",
    workedExample:
      "Large between-group spread relative to within-group noise gives large F.",
    connections: ["t-test", "Linear models", "Post-hoc contrasts"],
  },
  linearreg: {
    algebraic:
      "OLS estimates minimize squared residuals and solve normal equations X^T X beta = X^T y.",
    computation:
      "Fit coefficients, inspect residual diagnostics, and evaluate out-of-sample error.",
    workedExample:
      "Slope 2.1 implies one-unit x increase predicts about 2.1 y increase.",
    connections: ["Correlation", "ANOVA", "Hypothesis tests on coefficients"],
  },
  logistic: {
    algebraic:
      "Logistic regression is linear in log-odds: log(p/(1-p)) = beta0 + beta^T x.",
    computation:
      "Estimate coefficients via maximum likelihood and evaluate calibration + discrimination.",
    workedExample:
      "Positive coefficient raises odds multiplicatively by exp(beta_j).",
    connections: [
      "Hypothesis testing",
      "Bayes decision threshold",
      "Classification metrics",
    ],
  },
};
