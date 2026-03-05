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
    deepDive: [
      "The mean is the unique minimizer of the sum of squared deviations. To see why, take the derivative of \\sum_i (x_i - c)^2 with respect to c and set it to zero — you recover the arithmetic average exactly. This optimality under squared loss explains why the mean appears throughout statistics wherever squared-error criteria are used.",
      "$$\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i, \\quad \\text{minimizes} \\quad \\sum_{i=1}^{n}(x_i - c)^2$$",
      "In the presence of heavy-tailed distributions, the sample mean can have high variance as an estimator. Trimmed means — discarding the top and bottom k% of observations before averaging — trade a small amount of bias for large variance reduction, making them robust alternatives when extreme values are probable.",
    ],
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
    deepDive: [
      "The median is the minimizer of the sum of absolute deviations \\sum_i |x_i - c|, in contrast to the mean which minimizes squared deviations. This L1 optimality gives the median its robustness: changing one observation arbitrarily cannot move the minimizer far if the rest of the data remain fixed.",
      "$$\\text{median} = \\operatorname{argmin}_{c} \\sum_{i=1}^{n} |x_i - c|$$",
      "For a continuous symmetric unimodal distribution, mean, median, and mode coincide. For right-skewed distributions (like incomes), the mean exceeds the median because large upper-tail values pull the average upward without moving the central rank. This is why household income statistics typically report median rather than mean.",
    ],
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
    deepDive: [
      "The n-1 denominator (Bessel's correction) makes the sample variance an unbiased estimator of the population variance. With n in the denominator, the estimator systematically underestimates because the sample mean is closer to sample points than the true mean is. The correction can be derived by expanding the expectation of the sum of squared deviations around the sample mean.",
      "$$s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(x_i - \\bar{x})^2, \\quad \\mathbb{E}[s^2] = \\sigma^2$$",
      "A key algebraic identity links variance to second moments: Var(X) = E[X^2] - (E[X])^2. This computational formula avoids explicit mean-subtraction and is numerically useful. It also reveals that variance is the difference between the mean of squares and the square of the mean — a quantity that is always non-negative by Jensen's inequality.",
    ],
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
    deepDive: [
      "The standard error of the mean (SEM) is \\sigma/\\sqrt{n}, quantifying how much the sample mean itself varies across repeated samples. As n doubles, SEM shrinks by a factor of \\sqrt{2}. This square-root law means that reducing estimation error by half requires quadrupling the sample size — a fundamental limitation of averaging.",
      "$$\\text{SE}(\\bar{X}) = \\frac{\\sigma}{\\sqrt{n}}, \\quad \\text{so} \\quad \\text{Var}(\\bar{X}) = \\frac{\\sigma^2}{n}$$",
      "Chebyshev's inequality gives a distribution-free bound: for any distribution with finite variance, the probability of a value lying more than k standard deviations from the mean is at most 1/k^2. For k=2 this gives at most 25%, much weaker than the 5% the normal distribution implies — reflecting how heavy-tailed distributions can be.",
    ],
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
    deepDive: [
      "The covariance matrix \\Sigma of a random vector X encodes all pairwise linear relationships. Its (i,j) entry is Cov(X_i, X_j). The matrix must be positive semi-definite — every quadratic form v^T\\Sigma v is non-negative — because it represents the variance of the linear combination v^T X.",
      "$$\\Sigma_{ij} = \\text{Cov}(X_i, X_j), \\quad \\mathbf{v}^\\top \\Sigma \\mathbf{v} \\geq 0 \\text{ for all } \\mathbf{v}$$",
      "PCA (Principal Component Analysis) diagonalizes the covariance matrix by finding orthogonal directions of maximum variance. The eigenvectors of \\Sigma are the principal components and the eigenvalues are the explained variances in those directions. This spectral decomposition of the covariance matrix is the foundation of dimensionality reduction.",
    ],
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
    deepDive: [
      "Pearson correlation r is the cosine of the angle between mean-centered data vectors. When you subtract the mean from each variable and treat the resulting vectors as directions in n-dimensional space, r = cos(\\theta) where \\theta is the angle between them. This geometric view explains why r lies in [-1,1] and equals ±1 only when the vectors are collinear.",
      "$$r = \\frac{\\sum_{i=1}^n (x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum_i(x_i-\\bar{x})^2}\\sqrt{\\sum_i(y_i-\\bar{y})^2}}$$",
      "The coefficient of determination R^2 in simple linear regression equals the squared Pearson correlation r^2. It represents the proportion of variance in y explained by a linear function of x. This connection clarifies why high correlation does not imply high predictive accuracy unless the residual variance is small relative to total variance.",
    ],
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
    deepDive: [
      "The moment generating function (MGF) M_X(t) = E[e^{tX}] encodes all moments of a distribution: the k-th derivative of M_X at t=0 gives E[X^k]. Two distributions with identical MGFs on an open interval around zero are identical. This uniqueness makes MGFs a powerful tool for proving distributional results, including CLT proofs.",
      "$$M_X(t) = \\mathbb{E}[e^{tX}] = \\sum_{k=0}^{\\infty} \\frac{\\mathbb{E}[X^k]}{k!} t^k$$",
      "Tail behavior determines the frequency of extreme outcomes. Distributions with power-law tails — like the Pareto or t-distribution — have much higher probability in extreme regions than exponential-tailed distributions like the normal. This distinction matters in finance (market crashes), insurance (catastrophic claims), and network modeling (degree distributions).",
    ],
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
    deepDive: [
      "If X is a continuous random variable with CDF F_X, the probability integral transform states that U = F_X(X) is uniformly distributed on [0,1]. Inverting this — if U ~ Uniform(0,1) then F_X^{-1}(U) has the same distribution as X — gives the quantile transform method for generating random samples from any distribution whose inverse CDF can be computed.",
      "$$\\text{If } U \\sim \\text{Uniform}(0,1), \\text{ then } X = F^{-1}(U) \\text{ has CDF } F$$",
      "For a function g of a random variable X with density f_X, the change-of-variables formula gives the density of Y = g(X) when g is monotone: f_Y(y) = f_X(g^{-1}(y)) |dg^{-1}/dy|. This Jacobian factor accounts for the stretching or compression of probability mass under the transformation.",
    ],
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
    deepDive: [
      "Jensen's inequality states that for a convex function g, E[g(X)] >= g(E[X]). The gap E[g(X)] - g(E[X]) quantifies the curvature penalty. For concave g the inequality reverses. This single result underlies information theory (entropy bounds), economics (risk premium), and statistics (bias of nonlinear estimators).",
      "$$g \\text{ convex} \\implies \\mathbb{E}[g(X)] \\geq g(\\mathbb{E}[X])$$",
      "The law of total expectation (tower property) states E[X] = E[E[X|Y]]. By first computing the conditional expectation given Y and then averaging over Y, complex expectations decompose into simpler conditional ones. This is the basis for iterated expectation arguments in Bayesian computation, regression modeling, and Markov chain analysis.",
    ],
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
    deepDive: [
      "The Poisson distribution emerges as the limit of Binomial(n, p) as n→∞ and p→0 with np = \\lambda fixed. It models counts of rare events in a large number of trials — arrivals, mutations, failures — and has the elegant property that its mean equals its variance, both equal to \\lambda.",
      "$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\quad k = 0,1,2,\\ldots, \\quad \\mathbb{E}[X] = \\text{Var}(X) = \\lambda$$",
      "The probability generating function G_X(z) = E[z^X] = \\sum_k p(k) z^k encodes the entire PMF as coefficients of a power series. The k-th derivative at z=0 divided by k! gives p(k). Generating functions convert convolutions (sums of independent variables) into products, making them powerful for deriving distributions of sums.",
    ],
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
    deepDive: [
      "The Glivenko-Cantelli theorem guarantees that the empirical CDF F_n(x) = (1/n)\\sum_{i=1}^n 1_{X_i \\leq x} converges to the true CDF F(x) uniformly over all x as n→∞. This uniform convergence is stronger than pointwise and justifies using the empirical distribution as a nonparametric estimate of the true distribution.",
      "$$\\sup_{x \\in \\mathbb{R}} |F_n(x) - F(x)| \\xrightarrow{a.s.} 0 \\text{ as } n \\to \\infty$$",
      "The Kolmogorov-Smirnov statistic is the maximum absolute deviation between empirical and reference CDFs. It is distribution-free under the null hypothesis — its sampling distribution does not depend on the true continuous F. This makes it a universal nonparametric goodness-of-fit test applicable without assuming any specific parametric form.",
    ],
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
    deepDive: [
      "The base rate fallacy arises from ignoring prior probability when interpreting conditional probabilities. If a disease has prevalence p(D) = 0.001 and a test has sensitivity p(+|D) = 0.99 and specificity p(-|not D) = 0.99, then p(D|+) is still only about 9% — most positives are false alarms because the disease is rare. Bayes' rule is the antidote.",
      "$$P(D \\mid +) = \\frac{P(+ \\mid D)\\, P(D)}{P(+ \\mid D)\\, P(D) + P(+ \\mid \\overline{D})\\, P(\\overline{D})}$$",
      "Conditional probability distributions form the building blocks of graphical models. A Bayesian network factorizes a joint distribution as a product of conditional distributions over a DAG: p(x_1,...,x_n) = \\prod_i p(x_i | pa_i), where pa_i are the parents of node i. This representation exponentially reduces the number of parameters needed to specify the joint.",
    ],
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
    deepDive: [
      "Mutual information I(X;Y) = E[log(p(X,Y)/(p(X)p(Y)))] is zero if and only if X and Y are independent. It measures the reduction in uncertainty about X given knowledge of Y, capturing all forms of statistical dependence — not just linear. Unlike correlation, I(X;Y) = 0 is equivalent to full independence.",
      "$$I(X;Y) = \\sum_{x,y} p(x,y) \\log \\frac{p(x,y)}{p(x)\\,p(y)} \\geq 0, \\text{ with equality iff } X \\perp Y$$",
      "Conditional independence X ⟂ Y | Z means X and Y are independent once Z is known, even if they are marginally dependent. This concept structures Bayesian networks and causal models: two variables can be associated marginally (via a common cause Z) yet become independent when Z is controlled. The d-separation criterion in DAGs formalizes which variables are conditionally independent.",
    ],
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
    deepDive: [
      "The normal distribution is the maximum entropy distribution subject to fixed mean and variance. Among all distributions with a given \\mu and \\sigma^2, the normal spreads probability as broadly as possible without violating those constraints. This entropic extremality partly explains why it appears so frequently as an idealized model of aggregated uncertainty.",
      "$$f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$",
      "The multivariate normal distribution N(\\mu, \\Sigma) is the only multivariate distribution where all marginals and conditionals are also normal, and where zero correlation implies independence. These closure properties under marginalization, conditioning, and linear transformation make the multivariate normal the cornerstone of linear-Gaussian state-space models, Kalman filtering, and Gaussian processes.",
    ],
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
    deepDive: [
      "Standardization transforms any normal random variable into a standard normal Z ~ N(0,1). The standard normal CDF \\Phi(z) = P(Z \\leq z) has no closed form but is tabulated and built into all statistical software. Tail probabilities of any normal distribution reduce to \\Phi evaluations through the z-score transformation.",
      "$$Z = \\frac{X - \\mu}{\\sigma}, \\quad P(X \\leq x) = \\Phi\\!\\left(\\frac{x-\\mu}{\\sigma}\\right)$$",
      "When population \\sigma is unknown and replaced by sample s, the ratio follows a t-distribution with n-1 degrees of freedom rather than a standard normal. The t-distribution has heavier tails reflecting the extra uncertainty from estimating \\sigma. As n grows, t_{n-1} converges to N(0,1) because s becomes a reliable estimate of \\sigma.",
    ],
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
    deepDive: [
      "The Weak Law of Large Numbers (WLLN) says that for any \\epsilon > 0, P(|\\bar{X}_n - \\mu| > \\epsilon) \\to 0 as n \\to \\infty. A simple proof uses Chebyshev's inequality: P(|\\bar{X}_n - \\mu| > \\epsilon) \\leq \\text{Var}(\\bar{X}_n)/\\epsilon^2 = \\sigma^2/(n\\epsilon^2) \\to 0. This requires only finite variance.",
      "$$P\\!\\left(|\\bar{X}_n - \\mu| > \\varepsilon\\right) \\leq \\frac{\\sigma^2}{n\\varepsilon^2} \\xrightarrow{n\\to\\infty} 0$$",
      "The Strong Law (SLLN) requires almost-sure convergence: P(\\bar{X}_n \\to \\mu) = 1. This is a statement about the entire infinite sequence of averages, not just marginal distributions at each n. It holds under finite first moment (E[|X|] < \\infty) and underpins frequentist probability interpretation: long-run relative frequencies equal probabilities.",
    ],
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
    deepDive: [
      "The Berry-Esseen theorem gives a quantitative bound on the CLT approximation error. For IID random variables with finite third moment \\rho = E[|X-\\mu|^3], the supremum distance between the standardized mean CDF and the normal CDF is bounded by C\\rho/(\\sigma^3 \\sqrt{n}), where C \\approx 0.4748. This tells how large n must be for a given accuracy requirement.",
      "$$\\sup_x \\left| P\\!\\left(\\frac{\\bar{X}_n - \\mu}{\\sigma/\\sqrt{n}} \\leq x\\right) - \\Phi(x) \\right| \\leq \\frac{C\\,\\mathbb{E}[|X-\\mu|^3]}{\\sigma^3 \\sqrt{n}}$$",
      "The multivariate CLT states that for IID random vectors with mean \\mu and covariance \\Sigma, \\sqrt{n}(\\bar{X}_n - \\mu) converges in distribution to N(0, \\Sigma). This drives the delta method: if g is differentiable, \\sqrt{n}(g(\\bar{X}_n) - g(\\mu)) converges to N(0, \\nabla g^T \\Sigma \\nabla g), enabling asymptotic inference for nonlinear transformations of sample means.",
    ],
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
    deepDive: [
      "In the continuous parameter setting, Bayes' theorem takes the form p(\\theta | x) \\propto p(x | \\theta)\\, p(\\theta). The normalizing constant p(x) = \\int p(x|\\theta)p(\\theta)\\,d\\theta is the marginal likelihood (evidence), and computing it is typically the main computational challenge. Conjugate priors are chosen so this integral has a closed form.",
      "$$p(\\theta \\mid x) = \\frac{p(x \\mid \\theta)\\, p(\\theta)}{\\int p(x \\mid \\theta')\\, p(\\theta')\\, d\\theta'}$$",
      "Conjugate prior-likelihood pairs yield posteriors in the same family as the prior. For example, a Beta(\\alpha,\\beta) prior combined with Binomial(n,\\theta) likelihood gives a Beta(\\alpha+k, \\beta+n-k) posterior after observing k successes. This algebraic closure enables closed-form Bayesian updating and makes the prior parameters interpretable as pseudo-counts.",
    ],
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
    deepDive: [
      "Under regularity conditions, the MLE \\hat{\\theta}_n is asymptotically normal with variance equal to the inverse Fisher information: \\sqrt{n}(\\hat{\\theta}_n - \\theta_0) \\to N(0, I(\\theta_0)^{-1}). The Fisher information I(\\theta) = E[(\\partial \\log p(X|\\theta)/\\partial\\theta)^2] measures the curvature of the expected log-likelihood, with higher curvature meaning parameters are more precisely estimable.",
      "$$\\sqrt{n}(\\hat{\\theta}_n - \\theta_0) \\xrightarrow{d} N\\!\\left(0,\\, I(\\theta_0)^{-1}\\right), \\quad I(\\theta) = \\mathbb{E}\\!\\left[\\left(\\frac{\\partial \\log p(X|\\theta)}{\\partial \\theta}\\right)^2\\right]$$",
      "The Cramér-Rao lower bound states that the variance of any unbiased estimator of \\theta is at least 1/I(\\theta) for a single observation. Estimators achieving this bound are called efficient. The MLE is asymptotically efficient, meaning no other consistent estimator can have smaller asymptotic variance — making maximum likelihood the canonical approach for large-sample parametric inference.",
    ],
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
    deepDive: [
      "The highest posterior density (HPD) interval is the shortest interval containing a given probability mass. For unimodal symmetric posteriors it coincides with the equal-tailed interval, but for skewed posteriors the HPD interval shifts toward the mode. The HPD interval has the property that every point inside it has higher posterior density than every point outside.",
      "$$\\text{HPD at level } (1-\\alpha): \\quad I^* = \\{\\theta : p(\\theta|x) \\geq k_\\alpha\\}, \\quad P(\\theta \\in I^* | x) = 1-\\alpha$$",
      "In the Bernstein-von Mises theorem regime, as n → \\infty, the posterior concentrates around the true parameter at rate 1/\\sqrt{n} and becomes approximately N(\\hat{\\theta}_{MLE}, I_n(\\theta)^{-1}). This means Bayesian credible intervals and frequentist confidence intervals have the same asymptotic width and coverage, reconciling the two approaches in large samples regardless of the prior choice.",
    ],
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
    deepDive: [
      "The posterior predictive can be computed by ancestral sampling without evaluating the integral explicitly: draw \\theta^{(k)} \\sim p(\\theta|\\text{data}), then draw y^{(k)} \\sim p(y|\\theta^{(k)}). The resulting y^{(k)} values are a sample from the posterior predictive. This two-stage sampling propagates parameter uncertainty into predictions naturally.",
      "$$p(y_{\\text{new}} \\mid \\text{data}) = \\int p(y_{\\text{new}} \\mid \\theta)\\, p(\\theta \\mid \\text{data})\\, d\\theta$$",
      "Posterior predictive checks (PPCs) compare the observed data y to replicated datasets y^{rep} drawn from the posterior predictive. If the model is well-specified, observed statistics like the sample mean, standard deviation, or skewness should fall comfortably within the predictive distribution of those statistics. Systematic discrepancies reveal model misfit.",
    ],
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
    deepDive: [
      "Stratified sampling partitions the population into homogeneous strata and samples from each stratum separately. If variance within strata is much smaller than variance between strata, stratified sampling yields estimators with substantially lower variance than simple random sampling of the same total size — the allocation of sample to strata can be optimized proportionally or by Neyman allocation.",
      "$$\\text{Var}(\\bar{x}_{\\text{strat}}) = \\sum_{h=1}^H W_h^2 \\frac{S_h^2}{n_h} \\leq \\text{Var}(\\bar{x}_{\\text{SRS}}) = \\frac{S^2}{n}$$",
      "Survey weighting corrects for known probability-of-selection differences. Each unit i receives weight w_i = 1/\\pi_i where \\pi_i is its inclusion probability. The Horvitz-Thompson estimator \\hat{T} = \\sum_{i \\in S} y_i/\\pi_i is unbiased for the population total T regardless of the design. This design-based inference framework makes no model assumptions about the population.",
    ],
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
    deepDive: [
      "The bootstrap confidence interval has several variants. The percentile interval uses the \\alpha/2 and 1-\\alpha/2 quantiles of the bootstrap distribution directly. The BCa (bias-corrected and accelerated) interval adjusts for median bias and skewness of the bootstrap distribution, giving second-order accuracy — its coverage error is O(1/n) rather than O(1/\\sqrt{n}).",
      "$$\\hat{\\theta}^*_b \\text{ from resample } b, \\quad \\text{CI} = \\left[\\hat{\\theta}^*_{(\\alpha/2)},\\, \\hat{\\theta}^*_{(1-\\alpha/2)}\\right]$$",
      "The theoretical justification relies on the bootstrap world approximating the sampling world: just as the sample F_n approximates F, the bootstrap distribution of \\hat{\\theta}^* - \\hat{\\theta} approximates the sampling distribution of \\hat{\\theta} - \\theta. This approximation fails for non-smooth statistics like the sample maximum or when the true parameter is on the boundary of the parameter space.",
    ],
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
    deepDive: [
      "A confidence procedure has exact coverage if P(\\theta \\in CI(X)) = 1-\\alpha for every \\theta. In practice, exact coverage is achievable only for specific models (like the normal mean with known \\sigma). Most procedures have approximate coverage that improves with n. Conservative procedures have coverage at least 1-\\alpha; anti-conservative ones fall below the nominal level.",
      "$$P\\!\\left(\\bar{X} - z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}} \\leq \\mu \\leq \\bar{X} + z_{\\alpha/2}\\frac{\\sigma}{\\sqrt{n}}\\right) = 1 - \\alpha$$",
      "The duality between confidence intervals and hypothesis tests is fundamental: a parameter value \\theta_0 is excluded from the 1-\\alpha confidence interval if and only if the level-\\alpha test of H_0: \\theta = \\theta_0 rejects. This equivalence means confidence intervals report, simultaneously, all parameter values that are not rejected by a two-sided test — a far richer summary than a single p-value.",
    ],
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
    deepDive: [
      "The Neyman-Pearson lemma states that for testing a simple null H_0: \\theta = \\theta_0 against a simple alternative H_1: \\theta = \\theta_1, the most powerful test at level \\alpha rejects when the likelihood ratio L(\\theta_1|x)/L(\\theta_0|x) exceeds a threshold. No other level-\\alpha test can have higher power — making the likelihood ratio test optimal in this sense.",
      "$$\\text{Reject } H_0 \\text{ when } \\Lambda = \\frac{L(\\theta_1 \\mid x)}{L(\\theta_0 \\mid x)} > c_\\alpha$$",
      "Power = P(reject H_0 | H_1 true) = 1 - \\beta. Power depends on effect size \\delta, sample size n, and significance level \\alpha. Power analysis is conducted before a study to determine the n needed to detect a minimum effect of interest with adequate probability — typically 0.80 or 0.90. Under-powered studies waste resources and produce unreliable estimates even when they find significance.",
    ],
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
    deepDive: [
      "Under the null hypothesis H_0, the p-value P is uniformly distributed on [0,1] for continuous test statistics. This follows because P = 1 - F_0(T_{obs}) and F_0(T) ~ Uniform(0,1) when T has CDF F_0. Consequently, if all null hypotheses are true, the expected fraction of p-values below \\alpha is exactly \\alpha — the foundational fact behind false discovery rate control.",
      "$$\\text{Under } H_0: \\quad P = P_0(T \\geq t_{\\text{obs}}) \\sim \\text{Uniform}(0,1)$$",
      "The Benjamini-Hochberg (BH) procedure controls the false discovery rate (FDR) — the expected fraction of rejected nulls that are false rejections. Sort p-values as p_{(1)} \\leq \\ldots \\leq p_{(m)} and reject all hypotheses up to the largest k where p_{(k)} \\leq k\\alpha/m. BH is less conservative than Bonferroni (which controls familywise error) and has greater power in large-scale multiple testing settings.",
    ],
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
    deepDive: [
      "The t-distribution with \\nu degrees of freedom arises as the ratio of a standard normal to the square root of an independent chi-squared variable divided by its degrees of freedom: T = Z/\\sqrt{\\chi^2_\\nu / \\nu}. In the one-sample t-test, (\\bar{X}-\\mu)/(s/\\sqrt{n}) follows t_{n-1} exactly when the data are normally distributed, not merely approximately.",
      "$$T = \\frac{\\bar{X} - \\mu_0}{s/\\sqrt{n}} \\sim t_{n-1} \\quad \\text{(exact under normality)}$$",
      "Welch's t-test uses degrees of freedom approximated by the Welch-Satterthwaite equation: \\nu \\approx (s_1^2/n_1 + s_2^2/n_2)^2 / [(s_1^2/n_1)^2/(n_1-1) + (s_2^2/n_2)^2/(n_2-1)]. This fractional degree-of-freedom adjustment correctly handles unequal variances and sample sizes, making it the recommended default over the pooled equal-variance t-test in most applied settings.",
    ],
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
    deepDive: [
      "The ANOVA F-statistic follows an F distribution with (k-1, n-k) degrees of freedom under the null hypothesis that all group means are equal. The F distribution is the ratio of two independent chi-squared variables divided by their respective degrees of freedom. Under the alternative, the test statistic follows a non-central F distribution whose non-centrality parameter grows with effect size and n.",
      "$$F = \\frac{\\text{SS}_{\\text{between}}/(k-1)}{\\text{SS}_{\\text{within}}/(n-k)} \\sim F_{k-1,\\, n-k} \\text{ under } H_0$$",
      "The Bonferroni correction for post-hoc multiple comparisons divides the target \\alpha by the number of comparisons m, testing each pairwise difference at level \\alpha/m. Tukey's HSD procedure is more powerful for all-pairs comparisons because it exploits the studentized range distribution. For planned contrasts known before data collection, no correction is needed as they are pre-specified hypotheses.",
    ],
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
    deepDive: [
      "The OLS estimator has the closed-form matrix solution \\hat{\\beta} = (X^T X)^{-1} X^T y. Geometrically, \\hat{y} = X\\hat{\\beta} is the orthogonal projection of y onto the column space of X. The residual vector e = y - \\hat{y} is orthogonal to every column of X — this orthogonality condition is the system of normal equations X^T(y - X\\hat{\\beta}) = 0.",
      "$$\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1} \\mathbf{X}^\\top \\mathbf{y}, \\quad \\hat{\\mathbf{y}} = \\mathbf{X}\\hat{\\boldsymbol{\\beta}} = \\mathbf{H}\\mathbf{y}$$",
      "The Gauss-Markov theorem states that under linearity, exogeneity (E[\\epsilon|X]=0), homoscedasticity (Var(\\epsilon|X)=\\sigma^2 I), and no perfect multicollinearity, OLS is BLUE — the Best Linear Unbiased Estimator. Adding the normality assumption (\\epsilon \\sim N(0,\\sigma^2 I)) upgrades OLS to the maximum likelihood estimator and enables exact t and F inference in finite samples.",
    ],
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
    deepDive: [
      "The log-likelihood for logistic regression is concave in the parameters, so gradient ascent (or equivalently Newton-Raphson / IRLS) converges to the unique global maximum. The score equations reduce to X^T(y - \\hat{p}) = 0, meaning the weighted residuals between observed binary outcomes and predicted probabilities are orthogonal to each predictor — an intuitive analogy to OLS normal equations.",
      "$$\\ell(\\beta) = \\sum_{i=1}^n \\left[y_i \\log \\hat{p}_i + (1-y_i)\\log(1-\\hat{p}_i)\\right], \\quad \\hat{p}_i = \\sigma(\\mathbf{x}_i^\\top \\boldsymbol{\\beta})$$",
      "The Brier score and calibration are distinct from discrimination. A model can rank observations perfectly (AUC = 1) yet have poorly calibrated probabilities (predicted 0.9 when true frequency is 0.5). Calibration plots compare mean predicted probabilities to observed event rates in deciles. Platt scaling and isotonic regression are post-hoc calibration methods that adjust predicted probabilities while preserving rank order.",
    ],
  },
};
