import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../multivariable-intuition/data";
import { VIS_MAP } from "../../multivariable-intuition/visuals";

export const MULTIVARIABLE_DOMAIN = {
  id: "multivariable",
  title: "Visual Intuition for Multivariable Calculus",
  subtitle: CONCEPTS.length + " interactive geometric interpretations",
  initialConceptId: "partials",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
