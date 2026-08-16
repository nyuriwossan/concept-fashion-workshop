const EXPOSURE_LEVELS = [
  {
    label: "控えめ",
    prompt:
      "with a high, modest neckline, covered shoulders, a closed back, and an elegant relaxed fit",
    short: "modest coverage",
  },
  {
    label: "やや控えめ",
    prompt:
      "with a refined neckline, mostly covered shoulders, and a softly shaped silhouette",
    short: "refined coverage",
  },
  {
    label: "標準",
    prompt:
      "with a balanced neckline, graceful shoulder lines, and a naturally defined silhouette",
    short: "balanced coverage",
  },
  {
    label: "ややセクシー",
    prompt:
      "with an open neckline, lightly exposed shoulders, a fitted waist, and a tasteful side slit",
    short: "tasteful open neckline, fitted waist",
  },
  {
    label: "セクシー",
    prompt:
      "with an off-shoulder neckline, an open back, a high slit, and a body-skimming fit",
    short: "off-shoulder, open back, high slit",
  },
  {
    label: "大胆",
    prompt:
      "with a daring plunging neckline, exposed shoulders and midriff, an open back, and a thigh-high slit",
    short: "plunging neckline, exposed midriff, thigh-high slit",
  },
];

function compact(parts) {
  return [...new Set(parts.filter(Boolean).map((part) => part.trim()))].join(", ");
}

function sentence(value) {
  if (!value) return "";
  const clean = value.trim().replace(/[.,\s]+$/, "");
  return clean.charAt(0).toUpperCase() + clean.slice(1) + ".";
}

function articleFor(value) {
  return /^[aeiou]/i.test(value.trim()) ? "an" : "a";
}

function attirePhrase(value) {
  if (!value) return "";
  if (/\b(inspired|costume|attire|dress)\b/i.test(value)) return value;
  return `${value}-inspired attire`;
}

function withoutConflicts(value, patterns) {
  if (!value) return "";
  return patterns.some((pattern) => pattern.test(value)) ? "" : value;
}

function controlRules(input) {
  const sleeveless = input.sleeveId === "sleeveless";
  const openShoulders = sleeveless || input.sleeveId === "off_shoulder" || input.sleeveId === "arm_covers";
  const bareLegs = input.legId === "bare_legs";
  const coveredLegs = input.legId === "long_skirt";
  const sleeveConflicts = sleeveless
    ? [/\b(?:long(?:\s+water)?|flowing|wide|fitted|broad|voluminous)\s+sleeves?\b/i]
    : [];
  const legConflicts = bareLegs ? [/\b(?:stockings?|tights?|pants?|trousers?)\b/i] : [];
  const slitConflicts = coveredLegs ? [/\b(?:high|thigh-high|side)\s+slits?\b/i, /\bexposed legs?\b/i] : [];
  const sourceConflicts = [...sleeveConflicts, ...legConflicts, ...slitConflicts];

  return {
    source: (value) => withoutConflicts(value, sourceConflicts),
    placement: (value) => sleeveless && /\bsleeves?\b/i.test(value) ? "" : withoutConflicts(value, legConflicts),
    structure: (value) => sleeveless && /\bsleeves?\b/i.test(value) ? "" : withoutConflicts(value, [...legConflicts, ...slitConflicts]),
    focus: (value) => sleeveless && /\bsleeves?\b/i.test(value) ? "" : withoutConflicts(value, legConflicts),
    exposure: (value) => {
      if (openShoulders && /\b(?:mostly\s+)?covered shoulders\b/i.test(value)) return "";
      return withoutConflicts(value, slitConflicts);
    },
    sleeve: input.sleeveEn ? `Use ${input.sleeveEn}` : "",
    leg: input.legEn
      ? input.legId === "bare_legs" && /\b(?:qipao|cheongsam)\b/i.test(input.traditionalAttireEn || "")
        ? "Use bare legs, exposed legs, a high side slit, and bare legs visible through the slit, without leg coverings or lower-body underlayers"
        : `Use ${input.legEn}`
      : "",
  };
}

export function exposureFor(level, preserveTradition = false) {
  if (level === null || level === undefined || level === "") {
    return { label: "未選択", prompt: "", short: "", adapted: false };
  }
  const safeLevel = Math.max(0, Math.min(5, Number(level) || 0));
  if (preserveTradition && safeLevel >= 4) {
    return {
      label: EXPOSURE_LEVELS[safeLevel].label,
      prompt:
        "with a carefully modernized neckline, selective shoulder exposure, and a controlled slit while preserving the garment's recognizable traditional structure",
      short: "culturally mindful modernized coverage",
      adapted: true,
    };
  }
  return { ...EXPOSURE_LEVELS[safeLevel], adapted: false };
}

export function buildPrompt(input) {
  const exposure = exposureFor(input.exposure, input.preserveTradition);
  const controls = controlRules(input);
  const directions = compact(input.directions || []);
  const baseEn = input.baseEn || "costume";
  const baseShortEn = input.baseShortEn || input.baseEn || "costume";
  const motifLead = input.motifEn
    ? `${directions ? `${directions} ` : ""}${input.motifEn}-inspired ${baseEn}`
    : "";
  const selectedAttire = attirePhrase(input.traditionalAttireEn);
  const outfitCore = selectedAttire
    ? `${directions ? `${directions} ` : ""}${selectedAttire}, reimagined as ${articleFor(baseEn)} ${baseEn}`
    : motifLead;
  const traditionalContext = selectedAttire
    ? compact([
        input.traditionalTreatmentEn
          ? `Use ${input.traditionalTreatmentEn}`
          : "",
        input.traditionalRegionEn
          ? `grounded in ${input.traditionalRegionEn}`
          : "",
      ])
    : "";
  const translation = compact([
    controls.source(input.paletteEn) ? `a ${controls.source(input.paletteEn)} palette` : "",
    controls.source(input.materialsEn) ? `${controls.source(input.materialsEn)} materials` : "",
    controls.source(input.shapeEn) ? `a silhouette shaped by ${controls.source(input.shapeEn)}` : "",
    controls.source(input.detailEn) ? `${controls.source(input.detailEn)} detailing` : "",
  ]);
  const safePlacements = (input.placementsEn || []).map(controls.placement).filter(Boolean);
  const placement = safePlacements.length
    ? `The concept appears through ${compact(safePlacements)}`
    : "";
  const safeStructures = (input.structuresEn || []).map(controls.structure).filter(Boolean);
  const structure = safeStructures.length
    ? `The construction features ${compact(safeStructures)}`
    : "";
  const safeFocus = controls.focus(input.focusEn);
  const focus = safeFocus ? `Give visual priority to ${safeFocus}` : "";
  const exposurePrompt = controls.exposure(exposure.prompt);

  const supportingSentences = [
    traditionalContext,
    translation
      ? `Translate the motif${input.strengthEn ? ` at ${input.strengthEn} intensity` : ""} through ${translation}`
      : "",
    placement,
    exposurePrompt,
    controls.sleeve,
    controls.leg,
    structure,
    focus,
  ].filter(Boolean);

  const poseIncluded = input.outputMode === "pose" || input.outputMode === "all";
  const allIncluded = input.outputMode === "all";
  const outfitLead = outfitCore ? `${articleFor(outfitCore)} ${outfitCore}` : "";
  const lead = outfitLead && poseIncluded && input.subjectEn
    ? `${input.subjectEn} wears ${outfitLead}`
    : outfitLead;
  const detailed = [
    sentence(lead),
    ...supportingSentences.map(sentence),
    poseIncluded ? sentence(input.poseEn) : "",
    allIncluded ? sentence(input.backgroundEn) : "",
    allIncluded && input.styleEnabled ? sentence(input.styleEn) : "",
  ]
    .filter(Boolean)
    .join(" ");

  const short = compact([
    poseIncluded ? input.subjectEn : "",
    selectedAttire
      ? `${selectedAttire}, ${baseShortEn}`
      : input.motifEn ? `${input.motifEn}-inspired ${baseShortEn}` : "",
    directions,
    controls.source(input.paletteEn),
    controls.source(input.materialsEn),
    ...safePlacements,
    exposurePrompt ? exposure.short : "",
    input.sleeveEn,
    controls.leg,
    ...safeStructures,
    safeFocus ? input.focusShortEn : "",
    poseIncluded ? input.poseShortEn : "",
    allIncluded ? input.backgroundShortEn : "",
    allIncluded && input.styleEnabled ? input.styleShortEn : "",
  ]);

  return {
    detailed,
    short,
    exposure,
    blocks: {
      motif: compact([selectedAttire || input.motifEn, input.strengthEn]),
      outfit: compact([outfitCore, traditionalContext, translation]),
      sleeves: controls.sleeve,
      legs: controls.leg,
      structure: compact(safeStructures),
      exposure: exposurePrompt,
      pose: poseIncluded ? input.poseEn : "",
      background: allIncluded ? input.backgroundEn : "",
      style: allIncluded && input.styleEnabled ? input.styleEn : "",
    },
  };
}
