import { RankVis, DetVis, EigenVis, NullVis, TraceVis, TransposeVis, InverseVis, SpanVis } from "./coreVisuals";
import { OrthogonalVis, ProjectionVis, NormVis } from "./geometryVisuals";
import { SVDVis, DiagonalizationVis, LUVis, QRVis, ConditionVis } from "./decompositionVisuals";
import { PosDefVis, SymmetricVis } from "./specialVisuals";
import { LinIndepVis, BasisVis } from "./foundationsVisuals";

export const VIS_MAP = {
  rank: RankVis,
  determinant: DetVis,
  eigenvalues: EigenVis,
  nullspace: NullVis,
  trace: TraceVis,
  transpose: TransposeVis,
  inverse: InverseVis,
  span: SpanVis,
  orthogonal: OrthogonalVis,
  projection: ProjectionVis,
  norm: NormVis,
  svd: SVDVis,
  diagonalization: DiagonalizationVis,
  lu: LUVis,
  qr: QRVis,
  posdef: PosDefVis,
  symmetric: SymmetricVis,
  condition: ConditionVis,
  linindep: LinIndepVis,
  basis: BasisVis,
};
