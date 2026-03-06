import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../category-theory-intuition/data";
import { VIS_MAP } from "../../category-theory-intuition/visuals";

export const CATEGORY_THEORY_DOMAIN = {
  id: "category-theory",
  title: "Visual Intuition for Category Theory",
  subtitle: CONCEPTS.length + " categorical concepts with interactive diagrams",
  initialConceptId: "objects",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
