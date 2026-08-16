import assert from "node:assert/strict";
import test from "node:test";
import { buildPrompt } from "../app/prompt-engine.js";
import { createEmptySelections, createSampleSelections } from "../app/selection-state.js";

function promptFromResetState(state) {
  return buildPrompt({
    outputMode: state.outputMode,
    motifEn: "",
    directions: state.directions,
    baseEn: "",
    baseShortEn: "",
    baseVariantEn: "",
    motifVariantEn: "",
    artNouveauMode: false,
    traditionalAttireEn: "",
    traditionalRegionEn: "",
    traditionalTreatmentEn: "",
    paletteEn: "",
    materialsEn: "",
    shapeEn: "",
    detailEn: "",
    placementsEn: state.placements,
    strengthEn: "",
    exposure: state.exposure,
    preserveTradition: false,
    qipaoMode: false,
    qipaoSlitId: state.qipaoSlitId,
    qipaoDetailsEn: [],
    foodMode: false,
    foodApplicationsEn: state.foodApplications,
    sleeveId: state.sleeveId,
    sleeveEn: "",
    legId: state.legId,
    legEn: "",
    structuresEn: state.structures,
    focusEn: "",
    focusShortEn: "",
    subjectEn: "",
    poseEn: "",
    poseShortEn: "",
    poseMoodEn: "",
    seatEn: "",
    backgroundEn: "",
    backgroundShortEn: "",
    styleEnabled: state.styleEnabled,
    styleEn: "",
    styleShortEn: "",
  });
}

test("complete reset clears every selection state", () => {
  const reset = createEmptySelections();
  for (const [key, value] of Object.entries(reset)) {
    if (Array.isArray(value)) assert.deepEqual(value, [], `${key} must be empty`);
    else if (typeof value === "boolean") assert.equal(value, false, `${key} must be false`);
    else if (key === "exposure") assert.equal(value, null);
    else assert.equal(value, "", `${key} must be blank`);
  }
});

test("regenerating after reset cannot retain the sample category or exposure", () => {
  const sample = createSampleSelections();
  assert.equal(sample.categoryId, "traditional");
  assert.equal(sample.attireId, "qipao");
  assert.equal(sample.exposure, 3);

  const reset = createEmptySelections();
  const result = promptFromResetState(reset);
  assert.equal(result.detailed, "");
  assert.equal(result.short, "");
  assert.equal(result.exposure.prompt, "");
  assert.equal(result.blocks.motif, "");
  assert.equal(result.blocks.outfit, "");
  assert.equal(result.blocks.sleeves, "");
  assert.equal(result.blocks.legs, "");
  assert.equal(result.blocks.variant, "");
  assert.equal(result.blocks.food, "");
  assert.equal(result.blocks.seat, "");
  assert.doesNotMatch(JSON.stringify(result), /qipao|cheongsam|sleeveless|bare legs|open neckline/i);
});

test("reset clears food, qipao, idol, art, pose mood, and seat state", () => {
  const reset = createEmptySelections();
  assert.equal(reset.foodGroupId, "");
  assert.deepEqual(reset.foodApplications, []);
  assert.equal(reset.qipaoNecklineId, "");
  assert.equal(reset.qipaoLengthId, "");
  assert.equal(reset.qipaoSlitId, "");
  assert.equal(reset.qipaoDrapeId, "");
  assert.equal(reset.idolStyleId, "");
  assert.equal(reset.artNouveauShapeId, "");
  assert.equal(reset.poseMoodId, "");
  assert.equal(reset.seatId, "");
});
