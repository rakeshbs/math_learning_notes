import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../activation-functions-intuition/data";
import { VIS_MAP } from "../../activation-functions-intuition/visuals";

export const ACTIVATION_FUNCTIONS_DOMAIN = {
  id: "activation-functions",
  title: "Visual Intuition for Activation Functions",
  subtitle: CONCEPTS.length + " common activation functions explained",
  initialConceptId: "relu",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
