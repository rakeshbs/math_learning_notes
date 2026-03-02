import {
  CONCEPTS,
  GROUPS,
  EXPLANATIONS,
  CONCEPT_DETAILS,
  CONCEPT_EXPANSIONS,
} from "../../statistics-intuition/data";
import { VIS_MAP } from "../../statistics-intuition/visuals";

function pickByIds(map, ids) {
  var out = {};
  ids.forEach(function (id) {
    if (map[id]) out[id] = map[id];
  });
  return out;
}

var concepts = CONCEPTS.filter(function (concept) {
  return concept.group !== "bayesian";
});
var conceptIds = new Set(
  concepts.map(function (concept) {
    return concept.id;
  }),
);

export const STATISTICS_DOMAIN = {
  id: "statistics",
  title: "Visual Intuition for Statistics",
  subtitle: concepts.length + " interactive statistical concepts",
  initialConceptId: "mean",
  concepts: concepts,
  groups: GROUPS.filter(function (group) {
    return group.id !== "bayesian";
  }),
  explanations: pickByIds(EXPLANATIONS, conceptIds),
  details: pickByIds(CONCEPT_DETAILS, conceptIds),
  expansions: pickByIds(CONCEPT_EXPANSIONS, conceptIds),
  visuals: pickByIds(VIS_MAP, conceptIds),
};
