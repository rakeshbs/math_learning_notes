export const CONCEPT_DETAILS = {
  objects: {
    deeper:
      "Objects in a category need not have elements or internal structure. Category theory only cares about morphisms between objects. This level of abstraction lets the same theorem apply to sets, spaces, groups, and programs simultaneously.",
    useCases: [
      "Unifying theorems across algebra, topology, and logic",
      "Modeling type systems in programming languages",
      "Defining universal constructions without reference to elements",
    ],
    pitfalls: [
      "Confusing objects with their elements — objects are abstract points",
      "Assuming morphisms are functions — they need not be",
    ],
    quickCheck: "Can you describe a category where objects are propositions and morphisms are proofs?",
  },
  categories: {
    deeper:
      "The axioms of a category are minimal but powerful: associativity ensures composition is unambiguous for long chains; unit laws ensure identity morphisms are neutral. These two axioms underlie all of category theory.",
    useCases: [
      "Providing a common language across mathematics",
      "Organizing mathematical structures by their morphisms",
      "Foundation for functors, natural transformations, and adjoints",
    ],
    pitfalls: [
      "Thinking all arrows must be functions between sets",
      "Ignoring size issues (sets vs. proper classes of objects)",
    ],
    quickCheck: "Write down the category of natural numbers where morphisms are divisibility: n→m iff n divides m.",
  },
  composition: {
    deeper:
      "Composition is the primitive notion — not equality of objects. A commutative diagram is a precise statement that two composed paths are equal. Most of mathematics can be rephrased as diagram-commutativity statements.",
    useCases: [
      "Expressing algebraic and topological laws as commutative diagrams",
      "Functional composition in programming",
      "Pipeline design in system architecture",
    ],
    pitfalls: [
      "Confusing the order: g∘f means 'f first, then g' (right to left)",
      "Assuming composition is commutative — generally f∘g ≠ g∘f",
    ],
    quickCheck: "Draw the commutative triangle for composing f: ℤ→ℚ and g: ℚ→ℝ in the category Ring.",
  },
  identity: {
    deeper:
      "Identity morphisms are uniquely determined by the unit law. Every object has exactly one identity, and functors must map identities to identities. This is what makes identity morphisms canonical rather than arbitrary.",
    useCases: [
      "Defining the neutral element in monoidal categories",
      "Ensuring functors preserve object identity",
      "Constructing the identity functor id_C on any category",
    ],
    pitfalls: [
      "Thinking of id_A as 'doing nothing interesting' — it defines the object itself",
      "Forgetting that F(id_A) = id_{F(A)} is a required law for functors",
    ],
    quickCheck: "In a poset category, what is the identity morphism on object A?",
  },
  isomorphism: {
    deeper:
      "Isomorphism is the right notion of sameness in a category. The Principle of Equivalence (from homotopy type theory) states that all mathematical properties should be invariant under isomorphism — category theory enforces this naturally.",
    useCases: [
      "Classifying mathematical objects up to isomorphism",
      "Proving uniqueness of universal constructions",
      "Establishing equivalence of categories",
    ],
    pitfalls: [
      "Confusing isomorphism with strict equality — they may be distinct morphisms",
      "Assuming all bimorphisms (monic + epic) are isomorphisms — false in general",
    ],
    quickCheck: "Verify that the inverse of an isomorphism is unique using the axioms.",
  },
  mono: {
    deeper:
      "Monomorphisms represent 'injective-like' behavior purely in terms of arrows, without mentioning elements. Subobjects are equivalence classes of monomorphisms into A — they are the categorical generalization of subsets.",
    useCases: [
      "Defining subobjects in any category",
      "Detecting injectivity in algebraic categories",
      "Constructing kernels and image factorizations",
    ],
    pitfalls: [
      "Assuming all monomorphisms split (have a left inverse) — they don't",
      "Thinking mono iff injective — this holds in Set but not in all categories",
    ],
    quickCheck: "Show that the composite of two monomorphisms is a monomorphism.",
  },
  epi: {
    deeper:
      "Epimorphisms capture 'surjective-like' behavior purely categorically. Surprising examples exist: ℤ↪ℚ is epic in Ring despite not being surjective, because any ring map out of ℚ is determined by its values on ℤ.",
    useCases: [
      "Defining quotient objects categorically",
      "Constructing cokernels and coimage factorizations",
      "Classifying surjective-like maps in exotic categories",
    ],
    pitfalls: [
      "Assuming epic implies surjective — fails in Ring and other categories",
      "Thinking bimorphisms (monic + epic) are always isomorphisms — false in Ring",
    ],
    quickCheck: "Verify the ℤ↪ℚ example: why is every ring map out of ℚ determined by its values on ℤ?",
  },
  terminal: {
    deeper:
      "Universal properties define objects up to unique isomorphism. The terminal object 1 is the 'global element detector': morphisms 1→A (global elements) generalize elements of a set, and in Set exactly correspond to elements.",
    useCases: [
      "Defining zero objects in abelian categories",
      "Unit type in type theory (one-element type)",
      "Constant morphisms as the unique map through terminal",
    ],
    pitfalls: [
      "Assuming terminal objects always exist — they don't in every category",
      "Confusing initial (∅ in Set) with terminal ({*} in Set)",
    ],
    quickCheck: "What are the initial and terminal objects in the category of non-empty sets?",
  },
  product: {
    deeper:
      "Products are limits of discrete two-object diagrams. The universal property characterizes products uniquely up to unique isomorphism. Any two objects serving as the product of A and B must be isomorphic via a unique isomorphism.",
    useCases: [
      "Cartesian product in Set and topology",
      "Conjunction in propositional logic (Curry-Howard)",
      "Tuple types in programming languages",
    ],
    pitfalls: [
      "Confusing the product object with its carrier set — the projections are essential",
      "Forgetting that the universal property, not the construction, defines the product",
    ],
    quickCheck: "Verify the universal property: given f: C→A and g: C→B, show ⟨f,g⟩ is unique.",
  },
  coproduct: {
    deeper:
      "Coproducts are the dual of products — limits in C^op. In algebraic categories the coproduct is often more complex than the product: in Grp it is the free product, reflecting the non-commutativity of group elements.",
    useCases: [
      "Disjoint union in Set and topology",
      "Sum types (variants) in type theory",
      "Disjunction in propositional logic (OR)",
    ],
    pitfalls: [
      "Assuming coproduct = product — this holds in Ab (direct sum) but not Grp",
      "Confusing injections (into coproduct) with projections (out of product)",
    ],
    quickCheck: "What is the coproduct of two groups G and H in the category Grp?",
  },
  pullback: {
    deeper:
      "Pullbacks are limits of cospan diagrams. In geometry they model fiber products; in type theory they model dependent pair types. Pullbacks preserve monomorphisms: if g is monic, so is its pullback along any f.",
    useCases: [
      "Fiber products in algebraic geometry",
      "Intersection of subobjects",
      "Change-of-base in fibered categories",
    ],
    pitfalls: [
      "Thinking the pullback always exists — requires completeness of the category",
      "Confusing pullback (limit) with pushout (colimit)",
    ],
    quickCheck: "Compute the pullback in Set of f: {a,b}→{0,1} and g: {c,d}→{0,1} where f(a)=0, f(b)=1, g(c)=0, g(d)=1.",
  },
  equalizer: {
    deeper:
      "Equalizers are always monomorphisms. Combined with products, they generate all limits: lim D ≅ Eq(∏ D(i) ⇒ ∏ D(j)). In abelian categories, the kernel of f is Eq(f, 0), connecting equalizers to classical algebra.",
    useCases: [
      "Solution sets — finding x where two expressions agree",
      "Kernel of a linear map in module theory",
      "Fixed-point sets of group actions",
    ],
    pitfalls: [
      "Confusing equalizer (limit) with coequalizer (colimit/quotient)",
      "Assuming equalizers always exist without checking",
    ],
    quickCheck: "What is the equalizer of f(x) = x and g(x) = x² as maps ℝ→ℝ in Set?",
  },
  functor: {
    deeper:
      "Functors are the structure-preserving maps between categories, making Cat (the category of small categories) itself a category. Adjoint functors, which come in pairs, are the most important functors in mathematics.",
    useCases: [
      "Forgetful and free functors in algebra",
      "Homology and cohomology functors in topology",
      "Type constructors (List, Maybe, IO) in programming",
    ],
    pitfalls: [
      "Forgetting the two functor laws: preserve composition and identity",
      "Confusing covariant and contravariant functors",
    ],
    quickCheck: "Verify that the power set functor P: Set→Set sending X to 2^X is a functor by checking the laws.",
  },
  natural: {
    deeper:
      "Natural transformations make functors the objects of functor categories [C, D]. The naturality square encodes that the transformation is 'canonical' — independent of any arbitrary choices. Mac Lane called naturality 'the central idea of category theory.'",
    useCases: [
      "Defining canonical isomorphisms (e.g., double dual V ≅ V**)",
      "Polymorphic functions in programming",
      "Component maps in algebraic topology",
    ],
    pitfalls: [
      "Checking only some naturality squares and assuming the rest",
      "Confusing natural isomorphism with strict equality of functors",
    ],
    quickCheck: "Verify naturality of η: id_Set⇒P (sending x∈X to {x}∈2^X) for a function f: X→Y.",
  },
  adjunction: {
    deeper:
      "Adjunctions are ubiquitous: every free construction is a left adjoint to a forgetful functor. The equivalence of the unit-counit formulation and the hom-set bijection formulation is one of the key theorems of basic category theory.",
    useCases: [
      "Free/forgetful adjunction in algebra",
      "Quantifier introduction in logic (∃ ⊣ substitution ⊣ ∀)",
      "Currying (product-hom adjunction) in type theory",
    ],
    pitfalls: [
      "Confusing left and right adjoints — they have very different properties",
      "Assuming an adjoint always exists — it need not",
    ],
    quickCheck: "Verify the triangle identities for the unit η and counit ε of a given adjunction.",
  },
  limits: {
    deeper:
      "Limits and colimits unify all universal constructions. The RAPL theorem (Right Adjoints Preserve Limits) and its dual are among the most applied theorems. Any limit can be computed from products and equalizers.",
    useCases: [
      "Computing inverse limits in profinite groups",
      "Colimit-based constructions in algebraic topology (CW complexes)",
      "Sheaves as limit-preserving functors",
    ],
    pitfalls: [
      "Thinking limits and colimits are always the same — they're dual and behave very differently",
      "Ignoring size issues when taking limits over large index categories",
    ],
    quickCheck: "Express the equalizer and product as special cases of the general limit definition.",
  },
  monad: {
    deeper:
      "Monads axiomatize computational effects. The Kleisli composition (f >=> g = μ ∘ T(g) ∘ f) is the basis of monadic programming. Every monad arises from an adjunction, and every adjunction gives a monad.",
    useCases: [
      "Side effects in functional programming (IO, State, Reader, Writer)",
      "Algebraic effects and handlers",
      "Cohomology theories in algebraic topology",
    ],
    pitfalls: [
      "Confusing the monad with the endofunctor alone — unit and multiplication are essential",
      "Assuming all endofunctors are monads — the laws must be verified",
    ],
    quickCheck: "Write out the three monad laws for the List monad and verify them.",
  },
  yoneda: {
    deeper:
      "The Yoneda Lemma is the foundation of representability and universal properties. The Yoneda embedding y: C→[C^op,Set] is fully faithful, meaning C is completely encoded in its presheaf category. This is the deepest result of basic category theory.",
    useCases: [
      "Proving two constructions are isomorphic via their representable functors",
      "Defining schemes in algebraic geometry as representable functors",
      "Proving the uniqueness of adjunctions via hom-set bijections",
    ],
    pitfalls: [
      "Thinking the proof is complicated — it is just tracking naturality carefully",
      "Missing that the bijection Nat(Hom(A,-), F) ≅ F(A) is natural in both A and F",
    ],
    quickCheck: "Apply the Yoneda Lemma with F = Hom(B,-) to recover the statement that Nat(Hom(A,-), Hom(B,-)) ≅ Hom(B, A).",
  },
  ccc: {
    deeper:
      "The Curry-Howard-Lambek correspondence is the profound trinity: CCC = typed lambda calculus = intuitionistic logic. A proof of A→B in logic is a lambda term of type A→B, which is a morphism A→B in the CCC. All three views are equivalent.",
    useCases: [
      "Semantics of functional programming languages",
      "Proof assistants and dependent type theory",
      "Denotational semantics of programming languages",
    ],
    pitfalls: [
      "Assuming classical (non-intuitionistic) logic has a direct CCC model — it requires additional structure",
      "Confusing the internal hom B^A with the external hom Hom(A,B)",
    ],
    quickCheck: "Write the currying bijection in terms of lambda calculus: what does λx.(λy.M) correspond to categorically?",
  },
  monoidal: {
    deeper:
      "The associativity and unit isomorphisms in a monoidal category must satisfy the pentagon and triangle coherence equations. Mac Lane's coherence theorem says these are the only equations needed — all diagrams built from α, λ, ρ automatically commute.",
    useCases: [
      "Tensor products of vector spaces and modules",
      "Parallel composition in process calculi and quantum computing",
      "Monoidal functors as the morphisms in the 2-category of monoidal categories",
    ],
    pitfalls: [
      "Assuming the monoidal product is symmetric — it need not be (e.g. braid groups)",
      "Forgetting that associativity is only up to coherent isomorphism, not strict equality",
    ],
    quickCheck: "Write out the pentagon equation for the associator α and verify it for (Set, ×, {*}).",
  },
  string: {
    deeper:
      "String diagrams are sound and complete for monoidal categories: two diagrams are equal as morphisms if and only if one can be continuously deformed (isotoped) into the other. This makes equality a topological question.",
    useCases: [
      "Quantum circuit diagrams (qubits as wires, gates as boxes)",
      "Tensor network contractions in physics",
      "Composing optics (lenses, prisms) in functional programming",
    ],
    pitfalls: [
      "Confusing the direction of reading — convention varies (top-to-bottom or bottom-to-top)",
      "Assuming wires can freely cross — this requires a symmetric or braided structure",
    ],
    quickCheck: "Draw the string diagram for the monad multiplication law μ∘Tμ = μ∘μT.",
  },
  applicative: {
    deeper:
      "Applicative functors are precisely the lax monoidal functors (C, ×, 1) → (C, ×, 1). The map φ_{A,B}: F(A)×F(B)→F(A×B) corresponds to ap, and φ₀: 1→F(1) corresponds to pure. This gives a clean categorical definition avoiding the Haskell-centric presentation.",
    useCases: [
      "Parallel validation (collecting all errors, not stopping at the first)",
      "Applicative parsers where the grammar shape is fixed",
      "Form rendering and static analysis where effects are independent",
    ],
    pitfalls: [
      "Using monad when applicative suffices — applicatives enable more optimization and analysis",
      "Assuming ap is commutative — it may not be (e.g. IO applicative)",
    ],
    quickCheck: "Show that every monad gives an applicative via pure = return and ap = (<*>) defined with (>>=).",
  },
  profunctor: {
    deeper:
      "Profunctors are the morphisms of the bicategory Prof, where objects are categories, 1-cells are profunctors, and 2-cells are natural transformations. Composition is via coends, and the identity profunctor is Hom_C: C^op×C→Set.",
    useCases: [
      "Categorical optics (lenses, prisms, traversals) via Tambara modules",
      "Data migrations between database schemas",
      "Generalized arrow types in functional programming",
    ],
    pitfalls: [
      "Confusing the coend composition formula with ordinary functor composition",
      "Assuming profunctors are always representable — most are not",
    ],
    quickCheck: "Verify that Hom_C: C^op×C→Set is a profunctor by checking functoriality in both arguments.",
  },
  comonad: {
    deeper:
      "Comonads are dual to monads in every sense: extract (ε) gives you a value from the context (dual to return/unit), and duplicate (δ) gives a context of contexts (dual to join/flatten). The comonad laws are exactly the monad laws reversed.",
    useCases: [
      "Cellular automata and context-dependent computation",
      "Cursor-based data structure traversal (Zipper comonad)",
      "Stream processing and signal transforms",
    ],
    pitfalls: [
      "Confusing extract (ε: W→id) with return (η: id→T) — they go in opposite directions",
      "Thinking comonads are rare — they appear wherever a 'focused position in a context' matters",
    ],
    quickCheck: "Verify the comonad laws for the Stream comonad: extract takes the head, duplicate produces the stream of all tails.",
  },
  kan: {
    deeper:
      "Kan extensions unify virtually all universal constructions: limits, colimits, adjoints, the Yoneda embedding, and sheafification are all Kan extensions. Computing them via coend/end formulas makes them concrete and applicable.",
    useCases: [
      "Computing derived functors as Kan extensions along a localization",
      "Sheafification as a Kan extension along the sheaf condition",
      "Operadic Kan extensions in higher algebra",
    ],
    pitfalls: [
      "Assuming Kan extensions always exist — they require sufficient completeness/cocompleteness",
      "Confusing left (initial, coend formula) and right (terminal, end formula) Kan extensions",
    ],
    quickCheck: "Express the limit lim F for F: J→C as a right Kan extension along the unique functor !: J→1.",
  },
  presheaf: {
    deeper:
      "PSh(C) is the free cocompletion: it's the smallest cocomplete category containing C. Every functor from C to a cocomplete category D extends uniquely to a colimit-preserving functor from PSh(C) to D. This universal property makes presheaves the canonical 'completion' of any category.",
    useCases: [
      "Sheaves on topological spaces (topology, algebraic geometry)",
      "Simplicial sets (homotopy theory) as presheaves on Δ",
      "Representing schemes as functors of points in algebraic geometry",
    ],
    pitfalls: [
      "Confusing presheaves (no gluing condition) with sheaves (with gluing)",
      "Thinking PSh(C) is just a technical convenience — it is the foundation of topos theory",
    ],
    quickCheck: "Verify that colimits in PSh(C) are computed pointwise: (colim Fᵢ)(A) = colim(Fᵢ(A)) in Set.",
  },
  abelian: {
    deeper:
      "The Freyd-Mitchell embedding theorem guarantees that all small abelian categories embed into module categories, so element-level diagram chasing is always valid. This makes abelian categories both abstract and computationally accessible.",
    useCases: [
      "Homological algebra: computing Ext and Tor groups",
      "Algebraic topology: singular homology, sheaf cohomology",
      "Representation theory: module categories over algebras",
    ],
    pitfalls: [
      "Assuming all categories are abelian — Top and Set are not",
      "Confusing exact with split exact sequences — split exact sequences always exist in injective/projective settings",
    ],
    quickCheck: "Show that 0 → ℤ →×2 ℤ → ℤ/2ℤ → 0 is a short exact sequence in Ab.",
  },
};

export const CONCEPT_EXPANSIONS = {
  objects: {
    algebraic:
      "Formally: Ob(C) is the class of objects; for A,B ∈ Ob(C), Hom_C(A,B) is the morphism set; ∘: Hom(B,C)×Hom(A,B)→Hom(A,C) is composition.",
    computation:
      "In Set: objects are sets, morphisms are functions, composition is function composition f∘g(x)=f(g(x)).",
    workedExample:
      "In the category 2 (two objects 0,1 and one non-identity arrow 0→1): Hom(0,0)={id_0}, Hom(0,1)={f}, Hom(1,1)={id_1}, Hom(1,0)=∅.",
    connections: ["Categories", "Functors", "Morphisms"],
  },
  categories: {
    algebraic:
      "Category axioms: (1) ∀f:A→B, g:B→C, h:C→D: h∘(g∘f)=(h∘g)∘f. (2) ∀A ∃id_A: A→A: f∘id_A=f and id_B∘f=f.",
    computation:
      "Check a category by verifying: all composable pairs have composites, identities exist, and associativity holds for all triples.",
    workedExample:
      "Preorder (P, ≤) as category: objects are elements of P; Hom(a,b) = {*} if a≤b, ∅ otherwise; composition uses transitivity; identity uses reflexivity.",
    connections: ["Objects & Morphisms", "Functors", "Opposite Category"],
  },
  composition: {
    algebraic:
      "Composition ∘: Hom(B,C) × Hom(A,B) → Hom(A,C). Note the reversal: in diagram order, write f;g for 'f then g', but algebraically g∘f.",
    computation:
      "To prove a diagram commutes: list all paths between two objects and verify they give equal composites.",
    workedExample:
      "In Vect_ℝ: compose f: ℝ²→ℝ³ (matrix M) and g: ℝ³→ℝ (matrix N). Then g∘f is represented by NM (matrix product).",
    connections: ["Identity Morphism", "Commutative Diagrams", "Functors"],
  },
  identity: {
    algebraic:
      "id_A is unique: if id' satisfies the unit laws then id' = id'∘id_A = id_A. Functors must satisfy F(id_A) = id_{F(A)}.",
    computation:
      "In concrete categories, id_A is the identity function. Verify: for any f: A→B, both f∘id_A and id_B∘f return f.",
    workedExample:
      "Identity matrix I_n is id in Vect for n-dimensional spaces. Matrix multiplication by I_n from left or right leaves any compatible matrix unchanged.",
    connections: ["Composition", "Functors", "Isomorphism"],
  },
  isomorphism: {
    algebraic:
      "f: A→B is iso iff ∃g: B→A with g∘f=id_A, f∘g=id_B. The inverse g is unique. The collection of all isos in C forms the 'core' groupoid of C.",
    computation:
      "To find the inverse: solve g∘f=id and f∘g=id simultaneously. In matrix categories, this is finding the matrix inverse.",
    workedExample:
      "In Vect_ℝ, f: ℝ²→ℝ² given by matrix [[1,1],[0,1]] is iso with inverse [[1,-1],[0,1]]. Check: [[1,-1],[0,1]]×[[1,1],[0,1]] = I₂.",
    connections: ["Monomorphism", "Epimorphism", "Equivalence of Categories"],
  },
  mono: {
    algebraic:
      "f: A→B is monic iff the map (−∘f): Hom(C,A)→Hom(C,B) is injective for all C. Equivalently: the pullback of f along itself is the identity.",
    computation:
      "To check monicity: assume f∘g = f∘h and derive g = h without using any properties of g or h other than their domains.",
    workedExample:
      "Inclusion i: ℤ↪ℝ is monic in Set: if i∘g = i∘h (meaning g(x) = h(x) as reals for all x), then g(x) = h(x) as integers.",
    connections: ["Epimorphism", "Isomorphism", "Equalizer"],
  },
  epi: {
    algebraic:
      "f: A→B is epic iff the map (f∘−): Hom(B,C)→Hom(A,C) is injective for all C. Equivalently: the pushout of f along itself is the identity.",
    computation:
      "To check epicity: assume g∘f = h∘f and derive g = h for arbitrary g, h: B→C.",
    workedExample:
      "Quotient map q: ℤ→ℤ/2ℤ is epic in Ring: if g∘q = h∘q then g and h agree on all residues, so g = h.",
    connections: ["Monomorphism", "Isomorphism", "Coequalizer"],
  },
  terminal: {
    algebraic:
      "Terminal: ∀A, |Hom(A,1)| = 1. Initial: ∀A, |Hom(0,A)| = 1. Zero object 0: both initial and terminal; gives zero morphisms 0_{AB} = (A→0→B).",
    computation:
      "To verify terminal: construct the unique map from an arbitrary object A to 1 and prove uniqueness.",
    workedExample:
      "In Set: terminal = {*} (one-element set). The unique map A→{*} sends every element to *. Initial = ∅: the unique map ∅→A is the empty function.",
    connections: ["Products", "Limits", "Zero Morphisms"],
  },
  product: {
    algebraic:
      "A×B with π₁, π₂ is a product iff ∀f:C→A, g:C→B ∃! ⟨f,g⟩: C→A×B with π₁∘⟨f,g⟩=f, π₂∘⟨f,g⟩=g. Uniqueness of ⟨f,g⟩ is the key.",
    computation:
      "In Set: ⟨f,g⟩(c) = (f(c), g(c)). In Vect: product of V and W is V⊕W (direct sum) with coordinate projections.",
    workedExample:
      "Product of ℝ and ℝ in Set is ℝ², with π₁(x,y)=x and π₂(x,y)=y. For f:C→ℝ, g:C→ℝ: ⟨f,g⟩(c) = (f(c),g(c)).",
    connections: ["Coproducts", "Terminal Object", "Limits"],
  },
  coproduct: {
    algebraic:
      "A+B with i₁, i₂ is a coproduct iff ∀f:A→C, g:B→C ∃! [f,g]: A+B→C with [f,g]∘i₁=f, [f,g]∘i₂=g.",
    computation:
      "In Set: [f,g](inl(a)) = f(a), [f,g](inr(b)) = g(b). Pattern matching on the disjoint union.",
    workedExample:
      "Coproduct of {a,b} and {c} in Set is {a,b,c} with i₁(a)=a, i₁(b)=b, i₂(c)=c. The copairing [f,g] does case analysis.",
    connections: ["Products", "Initial Object", "Colimits"],
  },
  pullback: {
    algebraic:
      "Pullback of f:A→C, g:B→C: object P with p₁:P→A, p₂:P→B, f∘p₁=g∘p₂, universal: ∀(q₁:Q→A, q₂:Q→B with f∘q₁=g∘q₂) ∃! h:Q→P.",
    computation:
      "In Set: P = {(a,b)∈A×B | f(a)=g(b)} with p₁(a,b)=a, p₂(a,b)=b.",
    workedExample:
      "Pullback of f:ℝ→ℝ (f(x)=x²) and g:ℝ→ℝ (g(y)=y) in Set: {(x,y)|x²=y} — the parabola as a subset of ℝ².",
    connections: ["Products", "Equalizer", "Limits"],
  },
  equalizer: {
    algebraic:
      "Eq(f,g) for f,g:A→B: object E with e:E→A, f∘e=g∘e, universal: ∀(h:X→A with f∘h=g∘h) ∃! k:X→E with e∘k=h. Note: e is always monic.",
    computation:
      "In Set: Eq(f,g) = {a∈A | f(a)=g(a)} with e the inclusion. Build limits from equalizers and products.",
    workedExample:
      "Eq(f,g) for f(x)=x², g(x)=x in Set: {x∈ℝ | x²=x} = {0,1}. The equalizer is the two-element subset with its inclusion.",
    connections: ["Pullback", "Monomorphism", "Limits"],
  },
  functor: {
    algebraic:
      "F: C→D sends ob(C)→ob(D) and Hom_C(A,B)→Hom_D(FA,FB), with F(g∘f)=F(g)∘F(f) and F(id_A)=id_{FA}. Contravariant: reverses arrows.",
    computation:
      "To define a functor: (1) specify F on objects, (2) specify F on morphisms, (3) verify the two laws for all composable pairs.",
    workedExample:
      "Homology H_n: Top→Ab is a functor: sends space X to its n-th homology group, sends continuous map f to induced group homomorphism f_*.",
    connections: ["Natural Transformations", "Adjunctions", "Categories"],
  },
  natural: {
    algebraic:
      "η: F⇒G is natural iff ∀f:A→B in C: G(f)∘η_A = η_B∘F(f). The functor category [C,D] has functors as objects and natural transformations as morphisms.",
    computation:
      "To verify naturality: draw the naturality square for a generic morphism f and check it commutes using the definitions of F, G, and η.",
    workedExample:
      "Double dual embedding η: id_Vect⇒(-)**. For V, η_V: V→V** sends v to ev_v (evaluation at v). Naturality: for T:V→W, T**∘η_V = η_W∘T.",
    connections: ["Functors", "Adjunctions", "Yoneda Lemma"],
  },
  adjunction: {
    algebraic:
      "F⊣G: bijection φ_{A,B}: Hom_D(FA,B)→Hom_C(A,GB), natural in A,B. Unit: η_A = φ(id_{FA}): A→GFA. Counit: ε_B = φ⁻¹(id_{GB}): FGB→B.",
    computation:
      "To show F⊣G: construct φ explicitly and verify naturality. Alternatively, define η and ε and verify the triangle identities.",
    workedExample:
      "Free/Forget adjunction: Free ⊣ Forget (Set→Grp). φ: Grp(Free(S),G) ≅ Set(S,Forget(G)) by φ(h)(s)=h(s). Unit: η_S(s)=[s] (generator). Counit: ε_G(g)=g.",
    connections: ["Functors", "Monads", "Natural Transformations"],
  },
  limits: {
    algebraic:
      "Limit of D:J→C: object L with cone (πᵢ:L→D(i))_{i∈J} universal. Constructed as: L = Eq(∏_{i} D(i) ⇒ ∏_{f:i→j} D(j)) where the two maps use D(f)∘πᵢ and πⱼ.",
    computation:
      "To compute a limit: (1) form the product of all objects, (2) equalize for each morphism in the diagram, (3) identify the resulting subobject.",
    workedExample:
      "Limit of A→C←B (cospan) = pullback A×_C B = {(a,b)|f(a)=g(b)}. This recovers the pullback from the general limit definition.",
    connections: ["Products", "Equalizer", "Adjunctions (RAPL)"],
  },
  monad: {
    algebraic:
      "Monad (T,η,μ): μ∘Tμ = μ∘μT (associativity), μ∘ηT = id = μ∘Tη (unit). Kleisli composition: f >=> g = μ_C ∘ T(g) ∘ f for f:A→TB, g:B→TC.",
    computation:
      "Verify monad laws for (T,η,μ): check all four diagrams. For Kleisli: verify (f >=> g) >=> h = f >=> (g >=> h) and id >=> f = f = f >=> id.",
    workedExample:
      "Maybe monad: T(A)=A+{Nothing}; η_A(a)=Just(a); μ_A(Just(Just(a)))=Just(a), μ_A(Nothing or Just(Nothing))=Nothing. Kleisli: f>=>g returns Nothing if either step fails.",
    connections: ["Endofunctors", "Adjunctions", "Algebras over a Monad"],
  },
  yoneda: {
    algebraic:
      "Yoneda: Nat(Hom_C(A,-), F) ≅ F(A) via φ(η)=η_A(id_A) and ψ(x)_B(f)=F(f)(x). Yoneda embedding: y(A)=Hom(-,A): C→[C^op,Set], fully faithful.",
    computation:
      "To apply: given a natural transformation η from Hom(A,-) to F, evaluate at id_A to get the corresponding element of F(A). Conversely, given x∈F(A), construct η_B(f)=F(f)(x).",
    workedExample:
      "F=Hom(B,-): Nat(Hom(A,-),Hom(B,-)) ≅ Hom(B,A). A natural transformation η corresponds to the morphism η_A(id_A): B→A. Confirms: morphisms A→B are natural transformations Hom(A,-)⇒Hom(B,-).",
    connections: ["Representable Functors", "Adjunctions", "Presheaves"],
  },
  ccc: {
    algebraic:
      "CCC: has terminal 1, all binary products A×B, and for all A,B an exponential B^A with Hom(C×A,B)≅Hom(C,B^A). Evaluation: ev: B^A×A→B. Curry: Λ(f): C→B^A for f:C×A→B.",
    computation:
      "To curry: given f: C×A→B, define Λ(f)(c)(a)=f(c,a). To uncurry: given g:C→B^A, define g*(c,a)=ev(g(c),a). Verify these are inverse bijections.",
    workedExample:
      "In Set: B^A = Set(A,B) (functions). Hom(C×A,B)≅Hom(C,B^A) is currying. Evaluation ev(f,a)=f(a). Λ(f)(c) = λa.f(c,a).",
    connections: ["Products", "Adjunctions", "Typed Lambda Calculus"],
  },
  monoidal: {
    algebraic:
      "Monoidal category: (C, ⊗, I, α, λ, ρ) with bifunctor ⊗, unit I, α_{A,B,C}: (A⊗B)⊗C→A⊗(B⊗C), λ_A: I⊗A→A, ρ_A: A⊗I→A satisfying pentagon and triangle coherence.",
    computation:
      "Check coherence: pentagon for α (5 associators compose to two paths, must be equal); triangle for λ and ρ (unit insertion and removal commute with associator).",
    workedExample:
      "Monoidal category (Set, ×, {*}): α((a,b),c) = (a,(b,c)), λ({*},a) = a, ρ(a,{*}) = a. Pentagon: all five paths from ((A×B)×C)×D to A×(B×(C×D)) are equal.",
    connections: ["Braided & Symmetric Monoidal", "String Diagrams", "Monoidal Functors"],
  },
  string: {
    algebraic:
      "Horizontal = ⊗ (left-to-right or right-to-left, by convention). Vertical = ∘ (top-to-bottom). Identity = straight wire. Braiding = crossing wires. Coherence = isotopy.",
    computation:
      "To prove f = g: draw both as string diagrams and continuously deform one into the other without changing the boundary. If the deformation exists, f = g.",
    workedExample:
      "Monad multiplication μ: draw T² with a merge box to T. Unit η: draw a wire sprouting from nothing into T. The monad laws become: triangle with η on the left or right of merge, and square with two merges horizontally vs vertically.",
    connections: ["Monoidal Categories", "Traced Monoidal", "Frobenius Algebras"],
  },
  applicative: {
    algebraic:
      "Lax monoidal: φ_{A,B}: F(A)×F(B)→F(A×B) and φ₀: 1→F(1), natural and coherent. ap f x = φ(f,x) composed with F(eval). pure = φ₀ composed with F(const).",
    computation:
      "To implement applicative: define pure (wrap a value) and (<*>) (apply wrapped function to wrapped value). Check the four applicative laws.",
    workedExample:
      "List applicative: pure x = [x]. fs <*> xs = [f x | f <- fs, x <- xs]. ([(+1),(+2)] <*> [10,20] = [11,21,12,22]). This models non-determinism: all function-argument combinations.",
    connections: ["Functors", "Monads", "Traversable"],
  },
  profunctor: {
    algebraic:
      "P: C^op × D → Set with dimap: (a'→a) → (b→b') → P(a,b) → P(a',b'). Composition: (Q∘P)(a,c) = ∫^b P(a,b) × Q(b,c) (coend). Identity: Hom_C(a,b).",
    computation:
      "To compose P: A↛B and Q: B↛C: compute the coend ∫^b P(a,b)×Q(b,c) as the coequalizer of ∐_{f:b→b'} P(a,b')×Q(b,c) ⇉ ∐_b P(a,b)×Q(b,c).",
    workedExample:
      "Hom profunctor: dimap f g h = g ∘ h ∘ f. Composition Hom∘Hom: ∫^b Hom(a,b)×Hom(b,c) ≅ Hom(a,c) by the Yoneda lemma — profunctor composition recovers ordinary composition.",
    connections: ["Functors", "Yoneda Lemma", "Optics (Lenses)"],
  },
  comonad: {
    algebraic:
      "Comonad: ε: W⇒id (extract), δ: W⇒W² (duplicate). Laws: ε_W ∘ δ = id, W(ε) ∘ δ = id, W(δ) ∘ δ = δ_W ∘ δ. Cokleisli composition: f =>= g = g ∘ W(f) ∘ δ.",
    computation:
      "Implement: extract (peek at focus), duplicate (shift focus to every position), extend f = fmap f ∘ duplicate (apply context-sensitive function to whole structure).",
    workedExample:
      "Store comonad W(A) = S × (S→A): extract(s,f) = f(s); duplicate(s,f) = (s, λs'. (s', f)); extend g (s,f) = (s, λs'. g(s', f)). Models a mutable store with a current position.",
    connections: ["Monads", "Adjunctions", "Coalgebras"],
  },
  kan: {
    algebraic:
      "Left Kan: (Lan_K F)(d) = ∫^c Hom_D(K(c),d) × F(c) (coend/tensor). Right Kan: (Ran_K F)(d) = ∫_c F(c)^{Hom_D(d,K(c))} (end/hom). Universal: Nat(Lan_K F, G) ≅ Nat(F, G∘K).",
    computation:
      "To compute Lan_K F at d: collect all pairs (morphism K(c)→d in D, element of F(c)) and quotient by the naturality relation. In Set, this is a quotient of a disjoint union.",
    workedExample:
      "Left Kan extension along y (Yoneda): Lan_y F ≅ F for F: C→Set by the Yoneda lemma. The coend ∫^c Hom(y(c),-) × F(c) ≅ ∫^c Hom_PSh(y(c),-) × F(c) ≅ F (by Yoneda for presheaves).",
    connections: ["Adjunctions", "Limits & Colimits", "Yoneda Lemma"],
  },
  presheaf: {
    algebraic:
      "PSh(C) = [C^op, Set]. Colimits: (colim Fᵢ)(A) = colim_i(Fᵢ(A)) in Set (pointwise). Limits: (lim Fᵢ)(A) = lim_i(Fᵢ(A)). Yoneda: y(A)(B) = Hom_C(B,A), fully faithful.",
    computation:
      "To compute a colimit in PSh(C): compute the colimit of sets Fᵢ(A) for each A separately, then verify naturality of the resulting collection.",
    workedExample:
      "Simplicial sets = PSh(Δ) where Δ is the simplex category. The n-simplex Δ[n] = y([n]) is representable. Singular homology of a topological space X is computed from the simplicial set Hom_Top(Δ_•, X).",
    connections: ["Yoneda Lemma", "Sheaves & Toposes", "Kan Extensions"],
  },
  abelian: {
    algebraic:
      "Abelian axioms: (1) Hom(A,B) is an abelian group, ∘ is bilinear. (2) Has zero object, all finite products/coproducts. (3) Every morphism has kernel and cokernel. (4) Every mono = kernel, every epi = cokernel.",
    computation:
      "To show a sequence A→B→C is exact at B: compute im(A→B) = ker(B→C) as subobjects of B, then verify equality using the abelian category axioms.",
    workedExample:
      "In Ab: 0→ℤ→ℤ⊕ℤ/2→ℤ/2→0 with f(n)=(2n,0) and g(n,k)=k-n mod 2. Check: im f = {(2n,0)} = ker g = {(n,k):k≡n mod 2} — yes, short exact sequence.",
    connections: ["Exact Sequences", "Derived Functors (Ext, Tor)", "Triangulated Categories"],
  },
};
