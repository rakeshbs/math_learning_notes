import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../gpu-intuition/data";
import { VIS_MAP } from "../../gpu-intuition/visuals";

export const GPU_DOMAIN = {
  id: "gpu",
  title: "GPU Architecture & CUDA/Triton",
  subtitle: CONCEPTS.length + " deep-dive concepts for GPU programming",
  initialConceptId: "sm",
  concepts: CONCEPTS,
  groups: GROUPS,
  explanations: EXPLANATIONS,
  details: CONCEPT_DETAILS,
  expansions: CONCEPT_EXPANSIONS,
  visuals: VIS_MAP,
};
