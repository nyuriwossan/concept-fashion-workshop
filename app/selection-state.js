export const EMPTY_SELECTIONS = Object.freeze({
  categoryId: "",
  motifId: "",
  customMotif: "",
  directions: Object.freeze([]),
  baseId: "",
  regionId: "",
  attireId: "",
  traditionId: "",
  placements: Object.freeze([]),
  strengthId: "",
  exposure: null,
  sleeveId: "",
  legId: "",
  structures: Object.freeze([]),
  focusId: "",
  presentationId: "",
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
  motifId: "",
  customMotif: "",
  directions: Object.freeze(["graceful", "high_fashion"]),
  baseId: "couture",
  regionId: "east_asia",
  attireId: "qipao",
  traditionId: "fashion",
  placements: Object.freeze(["palette", "materials", "neckline"]),
  strengthId: "bold",
  exposure: 3,
  sleeveId: "sleeveless",
  legId: "bare_legs",
  structures: Object.freeze(["high_slit", "asymmetrical"]),
  focusId: "silhouette",
  presentationId: "runway",
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
