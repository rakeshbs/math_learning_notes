import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../reinforcement-learning-intuition/data";
import { VIS_MAP } from "../../reinforcement-learning-intuition/visuals";

export const REINFORCEMENT_LEARNING_DOMAIN = {
  id: "reinforcement-learning",
  title: "Visual Intuition for Reinforcement Learning",
  subtitle: CONCEPTS.length + " deep RL paradigms and concepts",
  initialConceptId: "mdp",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
