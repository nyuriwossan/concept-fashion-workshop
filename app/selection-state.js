export const EMPTY_SELECTIONS = Object.freeze({
  categoryId: "",
  foodGroupId: "",
  foodApplications: Object.freeze([]),
  motifId: "",
  customMotif: "",
  directions: Object.freeze([]),
  baseId: "",
  idolStyleId: "",
  artNouveauShapeId: "",
  regionId: "",
  attireId: "",
  traditionId: "",
  qipaoNecklineId: "",
  qipaoLengthId: "",
  qipaoSlitId: "",
  qipaoDrapeId: "",
  placements: Object.freeze([]),
  strengthId: "",
  exposure: null,
  sleeveId: "",
  legId: "",
  structures: Object.freeze([]),
  focusId: "",
  presentationId: "",
  poseMoodId: "",
  seatId: "",
  backgroundId: "",
  subjectId: "",
  styleEnabled: false,
  paintId: "",
  finishId: "",
  lineId: "",
  outputMode: "",
});

export const SAMPLE_SELECTIONS = Object.freeze({
  categoryId: "traditional",
  foodGroupId: "",
  foodApplications: Object.freeze([]),
  motifId: "",
  customMotif: "",
  directions: Object.freeze(["graceful", "high_fashion"]),
  baseId: "couture",
  idolStyleId: "",
  artNouveauShapeId: "",
  regionId: "east_asia",
  attireId: "qipao",
  traditionId: "fashion",
  qipaoNecklineId: "classic",
  qipaoLengthId: "above_knee",
  qipaoSlitId: "high",
  qipaoDrapeId: "clean",
  placements: Object.freeze(["palette", "materials", "neckline"]),
  strengthId: "bold",
  exposure: 3,
  sleeveId: "sleeveless",
  legId: "bare_legs",
  structures: Object.freeze(["high_slit", "asymmetrical"]),
  focusId: "silhouette",
  presentationId: "runway",
  poseMoodId: "model",
  seatId: "",
  backgroundId: "light",
  subjectId: "woman",
  styleEnabled: false,
  paintId: "",
  finishId: "",
  lineId: "",
  outputMode: "all",
});

function cloneSelections(source) {
  return {
    ...source,
    directions: [...source.directions],
    foodApplications: [...source.foodApplications],
    placements: [...source.placements],
    structures: [...source.structures],
  };
}

export function createEmptySelections() {
  return cloneSelections(EMPTY_SELECTIONS);
}

export function createSampleSelections() {
  return cloneSelections(SAMPLE_SELECTIONS);
}
