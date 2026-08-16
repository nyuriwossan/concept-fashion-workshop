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
    baseVariantEn: "",
    motifVariantEn: "",
    artNouveauMode: false,
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
    qipaoMode: false,
    qipaoSlitId: "",
    qipaoDetailsEn: [],
    foodMode: false,
    foodApplicationsEn: [],
    sleeveId: "",
    sleeveEn: "",
    legId: "",
    legEn: "",
    structuresEn: ["layered drapery", "a long train"],
    focusEn: "the full-body silhouette",
    focusShortEn: "silhouette focus",
    subjectEn: "an adult woman",
    poseEn: "Use a full-body runway composition",
    poseShortEn: "full body, runway walk",
    poseMoodEn: "",
    seatEn: "",
    backgroundEn: "Keep a minimal theme-colored backdrop",
    backgroundShortEn: "minimal themed backdrop",
    styleEnabled: true,
    styleEn: "Render with decorative illustration and luminous finish",
    styleShortEn: "decorative illustration, luminous finish",
  };
}

function traditionalDesign(subjectEn, traditionalAttireEn) {
  return {
    ...design("all"),
    // Regression guard: a stale motif must never leak into a selected attire.
    motifEn: "hanfu",
    paletteEn: "garment-specific palette",
    materialsEn: "garment-specific materials",
    shapeEn: "the selected garment's recognizable silhouette",
    detailEn: "garment-specific detailing",
    traditionalAttireEn,
    traditionalRegionEn: "",
    traditionalTreatmentEn: "a high-fashion transformation",
    preserveTradition: false,
    subjectEn,
  };
}

function searchablePrompt(result) {
  return [result.detailed, result.short, ...Object.values(result.blocks)].join(" ").toLowerCase();
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

test("adult man with qipao keeps qipao and excludes stale hanfu", () => {
  const prompt = searchablePrompt(buildPrompt(traditionalDesign("an adult man", "qipao / cheongsam")));
  assert.match(prompt, /adult man/);
  assert.match(prompt, /qipao/);
  assert.match(prompt, /cheongsam/);
  assert.doesNotMatch(prompt, /hanfu/);
});

test("adult woman with qipao keeps qipao and excludes stale hanfu", () => {
  const prompt = searchablePrompt(buildPrompt(traditionalDesign("an adult woman", "qipao / cheongsam")));
  assert.match(prompt, /adult woman/);
  assert.match(prompt, /qipao/);
  assert.doesNotMatch(prompt, /hanfu/);
});

test("adult man keeps belly dance costume without gender-based substitution", () => {
  const prompt = searchablePrompt(buildPrompt(traditionalDesign("an adult man", "belly dance costume")));
  assert.match(prompt, /adult man/);
  assert.match(prompt, /belly dance costume/);
  assert.doesNotMatch(prompt, /hanfu/);
});

test("adult woman keeps mariachi-inspired attire", () => {
  const prompt = searchablePrompt(buildPrompt(traditionalDesign("an adult woman", "mariachi-inspired attire")));
  assert.match(prompt, /adult woman/);
  assert.match(prompt, /mariachi-inspired attire/);
  assert.doesNotMatch(prompt, /hanfu/);
});

test("androgynous model keeps sari", () => {
  const prompt = searchablePrompt(buildPrompt(traditionalDesign("an androgynous adult model", "sari")));
  assert.match(prompt, /androgynous adult model/);
  assert.match(prompt, /sari/);
  assert.doesNotMatch(prompt, /hanfu/);
});

test("hanfu appears when and only when hanfu is the selected attire", () => {
  const hanfu = searchablePrompt(buildPrompt(traditionalDesign("an adult man", "hanfu")));
  const qipao = searchablePrompt(buildPrompt(traditionalDesign("an adult man", "qipao / cheongsam")));
  assert.match(hanfu, /hanfu/);
  assert.doesNotMatch(qipao, /hanfu/);
});

test("changing only the person type never changes the selected attire block", () => {
  const man = buildPrompt(traditionalDesign("an adult man", "qipao / cheongsam"));
  const woman = buildPrompt(traditionalDesign("an adult woman", "qipao / cheongsam"));
  const androgynous = buildPrompt(traditionalDesign("an androgynous adult model", "qipao / cheongsam"));
  assert.equal(man.blocks.outfit, woman.blocks.outfit);
  assert.equal(woman.blocks.outfit, androgynous.blocks.outfit);
  assert.match(man.blocks.outfit, /qipao/);
});

test("every traditional attire overrides every stale main motif", () => {
  const attires = [
    ["hanfu", "hanfu"],
    ["qipao / cheongsam", "qipao"],
    ["hanbok", "hanbok"],
    ["kimono", "kimono"],
    ["sari", "sari"],
    ["lehenga", "lehenga"],
    ["belly dance costume", "belly dance costume"],
    ["kaftan", "kaftan"],
    ["ao dai", "ao dai"],
    ["flamenco dress", "flamenco dress"],
    ["European folk costume", "european folk costume"],
    ["kente-inspired attire", "kente-inspired attire"],
    ["mariachi-inspired attire", "mariachi-inspired attire"],
    ["carnival costume", "carnival costume"],
  ];

  for (const [selected, selectedNeedle] of attires) {
    for (const [staleMotif, staleNeedle] of attires) {
      const input = traditionalDesign("an adult model", selected);
      input.motifEn = staleMotif;
      const prompt = searchablePrompt(buildPrompt(input));
      assert.ok(prompt.includes(selectedNeedle), `${selected} must remain selected`);
      if (selected !== staleMotif) {
        assert.ok(!prompt.includes(staleNeedle), `${staleMotif} must not leak into ${selected}`);
      }
    }
  }
});

test("qipao with sleeveless keeps exposed arms and removes long-sleeve language", () => {
  const input = traditionalDesign("an adult woman", "qipao / cheongsam");
  input.sleeveId = "sleeveless";
  input.sleeveEn = "sleeveless, bare shoulders, exposed arms";
  input.shapeEn = "a fitted column with long water sleeves";
  input.structuresEn = ["wide sleeves", "a high slit"];
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /sleeveless/);
  assert.match(prompt, /bare shoulders/);
  assert.match(prompt, /exposed arms/);
  assert.doesNotMatch(prompt, /long sleeves|long water sleeves|flowing sleeves|wide sleeves|fitted sleeves/);
});

test("qipao with bare legs removes leg coverings and adds slit-aware wording", () => {
  const input = traditionalDesign("an adult woman", "qipao / cheongsam");
  input.legId = "bare_legs";
  input.legEn = "bare legs, exposed legs, without leg coverings or lower-body underlayers";
  input.shapeEn = "a fitted column over trousers";
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /bare legs/);
  assert.match(prompt, /bare legs visible through the slit/);
  assert.match(prompt, /high side slit/);
  assert.doesNotMatch(prompt, /stockings|tights|pants under (?:the )?dress|trousers/);
});

test("qipao keeps sleeveless and bare legs at the same time", () => {
  const input = traditionalDesign("an adult man", "qipao / cheongsam");
  input.sleeveId = "sleeveless";
  input.sleeveEn = "sleeveless, bare shoulders, exposed arms";
  input.legId = "bare_legs";
  input.legEn = "bare legs, exposed legs, without leg coverings or lower-body underlayers";
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /adult man/);
  assert.match(prompt, /sleeveless/);
  assert.match(prompt, /bare legs/);
  assert.doesNotMatch(prompt, /long sleeves|stockings|tights|pants under (?:the )?dress/);
});

test("male qipao keeps black sleeveless bare-leg design in a turning pose", () => {
  const input = traditionalDesign("an adult man", "qipao / cheongsam");
  Object.assign(input, {
    qipaoMode: true,
    paletteEn: "lacquer black and warm gold",
    sleeveId: "sleeveless",
    sleeveEn: "sleeveless, bare shoulders, exposed arms",
    legId: "bare_legs",
    legEn: "bare legs and exposed legs without lower-body underlayers",
    qipaoSlitId: "high",
    qipaoDetailsEn: [
      "a clean high stand collar with a diagonal closure",
      "an above-knee hem",
      "a high side slit",
      "a self-contained one-piece silhouette with a clean arm line and no separate draped panels",
    ],
    poseEn: "Use a full-body over-the-shoulder turning pose",
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /adult man/);
  assert.match(prompt, /qipao/);
  assert.match(prompt, /lacquer black/);
  assert.match(prompt, /sleeveless/);
  assert.match(prompt, /bare legs/);
  assert.match(prompt, /turning pose/);
  assert.doesNotMatch(prompt, /hanfu|long sleeves|trousers|detached sleeves/);
});

test("male belly dance costume can use a supported sofa-seated pose", () => {
  const input = traditionalDesign("an adult man", "belly dance costume");
  input.poseEn = "Use a stable full-body seated fashion pose";
  input.seatEn = "a plush sofa";
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /adult man/);
  assert.match(prompt, /belly dance costume/);
  assert.match(prompt, /plush sofa/);
  assert.match(prompt, /visible physical support/);
});

test("woman can wear an above-knee frilled idol mini on stage", () => {
  const input = design("all");
  Object.assign(input, {
    motifEn: "starlight",
    baseEn: "concept idol costume",
    baseVariantEn: "an above-knee frilled mini skirt with sparkling layered ruffles",
    subjectEn: "an adult woman",
    poseEn: "Show the full figure in a theatrical stage pose",
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /adult woman/);
  assert.match(prompt, /above-knee frilled mini skirt/);
  assert.match(prompt, /stage pose/);
});

test("androgynous Art Nouveau stays an independent midi silhouette", () => {
  const input = design("pose");
  Object.assign(input, {
    motifEn: "Art-Nouveau",
    motifVariantEn: "a softly draped midi-length silhouette",
    artNouveauMode: true,
    subjectEn: "an androgynous adult model",
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /androgynous adult model/);
  assert.match(prompt, /midi-length silhouette/);
  assert.match(prompt, /western decorative-fashion language/);
  assert.doesNotMatch(prompt, /qipao|cheongsam|high slit/);
});

test("cream soda motif keeps transparent bubbles and safe prop placement", () => {
  const input = design("all");
  Object.assign(input, {
    motifEn: "retro cream soda",
    paletteEn: "mint green, vanilla white, cherry red, and glass-clear highlights",
    materialsEn: "transparent organza, liquid-gloss satin, and bubble sequins",
    foodMode: true,
    foodApplicationsEn: ["the color palette", "a handheld or table prop"],
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /transparent organza/);
  assert.match(prompt, /bubble sequins/);
  assert.match(prompt, /tray, plate, glass, table, or background prop/);
  assert.match(prompt, /away from intimate or sensitive body areas/);
});

test("wine motif supports liquid color and a glass prop", () => {
  const input = design("all");
  Object.assign(input, {
    motifEn: "wine",
    paletteEn: "deep wine red and crystal-clear highlights",
    materialsEn: "liquid satin and transparent glass-like panels",
    foodMode: true,
    foodApplicationsEn: ["material and surface texture", "a handheld or table prop"],
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /deep wine red/);
  assert.match(prompt, /liquid satin/);
  assert.match(prompt, /handheld or table prop/);
});

test("lemon summer outfit can use a stable seated composition", () => {
  const input = design("pose");
  Object.assign(input, {
    motifEn: "lemon",
    directions: ["fresh", "summery"],
    foodMode: true,
    poseEn: "Use a stable full-body seated fashion pose",
    seatEn: "a decorative garden chair",
  });
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /lemon-inspired/);
  assert.match(prompt, /summery/);
  assert.match(prompt, /garden chair/);
});

test("jellyfish costume supports a reclining overhead composition", () => {
  const input = design("pose");
  input.poseEn = "View the reclining figure from directly above, arranging the costume as a clear graphic shape";
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /jellyfish-inspired/);
  assert.match(prompt, /reclining figure from directly above/);
});

test("traditional clothing supports a front full-body inspection pose", () => {
  const input = traditionalDesign("an androgynous adult model", "kimono");
  input.poseEn = "Use a straight-on full-body composition with an unobstructed costume silhouette";
  const prompt = searchablePrompt(buildPrompt(input));
  assert.match(prompt, /kimono-inspired attire/);
  assert.match(prompt, /straight-on full-body composition/);
});
