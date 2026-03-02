import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../ml-math-intuition/data";
import { VIS_MAP } from "../../ml-math-intuition/visuals";

export const ML_MATH_DOMAIN = {
  id: "ml-math",
  title: "Visual Intuition for Machine Learning Math",
  subtitle: CONCEPTS.length + " core pre-deep-learning math concepts",
  initialConceptId: "vectors",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
