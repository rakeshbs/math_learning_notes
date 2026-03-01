import {
  PartialsVis,
  GradientVis,
  DirectionalVis,
  TangentPlaneVis,
  JacobianVis,
  ChainRuleVis,
  DivergenceVis,
  CurlVis,
  LineIntegralVis,
  DoubleIntegralVis,
} from "./multivariableVisuals";

export const VIS_MAP = {
  partials: PartialsVis,
  gradient: GradientVis,
  directional: DirectionalVis,
  tangentplane: TangentPlaneVis,
  jacobian: JacobianVis,
  chainrule: ChainRuleVis,
  divergence: DivergenceVis,
  curl: CurlVis,
  lineintegral: LineIntegralVis,
  doubleintegral: DoubleIntegralVis,
};
