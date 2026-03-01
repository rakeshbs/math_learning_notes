import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../matrix-intuition/data";
import { VIS_MAP } from "../../matrix-intuition/visuals";

export const MATRICES_DOMAIN = {
  id: "matrices",
  title: "Visual Intuition for Matrices",
  subtitle: CONCEPTS.length + " interactive geometric interpretations",
  initialConceptId: "rank",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
