import assert from "node:assert/strict";
import test from "node:test";
import { buildPrompt, exposureFor } from "../app/prompt-engine.js";

function design(outputMode = "all") {
  return {
    outputMode,
    motifEn: "jellyfish",
    directions: ["graceful", "mystical"],
    baseEn: "haute-couture gown",
    baseShortEn: "haute couture gown",
    traditionalAttireEn: "",
    traditionalRegionEn: "",
    traditionalTreatmentEn: "",
    paletteEn: "aqua, lilac, and pearl white",
    materialsEn: "sheer organza and iridescent film",
    shapeEn: "a bell shape with drifting tendrils",
    detailEn: "bioluminescent edge",
    placementsEn: ["the palette", "the sleeve construction"],
    strengthEn: "bold",
    exposure: 3,
    preserveTradition: false,
    structuresEn: ["layered drapery", "a long train"],
    focusEn: "the full-body silhouette",
    focusShortEn: "silhouette focus",
    subjectEn: "an adult woman",
    poseEn: "Use a full-body runway composition",
    poseShortEn: "full body, runway walk",
    backgroundEn: "Keep a minimal theme-colored backdrop",
    backgroundShortEn: "minimal themed backdrop",
    styleEnabled: true,
    styleEn: "Render with decorative illustration and luminous finish",
    styleShortEn: "decorative illustration, luminous finish",
  };
}

test("outfit mode excludes person, pose, background, and style", () => {
  const result = buildPrompt(design("outfit"));
  assert.match(result.detailed, /jellyfish-inspired/);
  assert.match(result.detailed, /sheer organza/);
  assert.doesNotMatch(result.detailed, /adult woman|runway composition|backdrop|Render with/);
  assert.equal(result.blocks.pose, "");
  assert.equal(result.blocks.background, "");
});

test("pose mode adds subject and presentation but leaves out scenery and rendering", () => {
  const result = buildPrompt(design("pose"));
  assert.match(result.detailed, /adult woman/);
  assert.match(result.detailed, /full-body runway composition/);
  assert.doesNotMatch(result.detailed, /theme-colored backdrop|Render with/);
});

test("all mode includes every enabled block", () => {
  const result = buildPrompt(design("all"));
  assert.match(result.detailed, /jellyfish-inspired/);
  assert.match(result.detailed, /full-body runway composition/);
  assert.match(result.detailed, /theme-colored backdrop/);
  assert.match(result.detailed, /decorative illustration/);
  assert.match(result.short, /long train/);
});

test("tradition-forward high exposure is adapted instead of blindly amplified", () => {
  const result = exposureFor(5, true);
  assert.equal(result.adapted, true);
  assert.match(result.prompt, /preserving the garment's recognizable traditional structure/);
  assert.doesNotMatch(result.prompt, /exposed midriff|thigh-high slit/);
});
