import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../deep-learning-intuition/data";
import { VIS_MAP } from "../../deep-learning-intuition/visuals";

export const DEEP_LEARNING_DOMAIN = {
  id: "deep-learning",
  title: "Visual Intuition for Deep Learning",
  subtitle: CONCEPTS.length + " deep learning core concepts",
  initialConceptId: "perceptron",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
