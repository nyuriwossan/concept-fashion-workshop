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

export function exposureFor(level, preserveTradition = false) {
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
  const directions = compact(input.directions || []);
  const motifLead = `${directions ? `${directions} ` : ""}${input.motifEn}-inspired ${input.baseEn}`;
  const selectedAttire = attirePhrase(input.traditionalAttireEn);
  const outfitCore = selectedAttire
    ? `${directions ? `${directions} ` : ""}${selectedAttire}, reimagined as ${articleFor(input.baseEn)} ${input.baseEn}`
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
    input.paletteEn ? `a ${input.paletteEn} palette` : "",
    input.materialsEn ? `${input.materialsEn} materials` : "",
    input.shapeEn ? `a silhouette shaped by ${input.shapeEn}` : "",
    input.detailEn ? `${input.detailEn} detailing` : "",
  ]);
  const placement = (input.placementsEn || []).length
    ? `The concept appears through ${compact(input.placementsEn)}`
    : "";
  const structure = (input.structuresEn || []).length
    ? `The construction features ${compact(input.structuresEn)}`
    : "";
  const focus = input.focusEn ? `Give visual priority to ${input.focusEn}` : "";

  const outfitSentences = [
    `${articleFor(outfitCore)} ${outfitCore}`,
    traditionalContext,
    translation
      ? `Translate the motif at ${input.strengthEn} intensity through ${translation}`
      : "",
    placement,
    exposure.prompt,
    structure,
    focus,
  ].filter(Boolean);

  const poseIncluded = input.outputMode !== "outfit";
  const allIncluded = input.outputMode === "all";
  const lead = poseIncluded
    ? `${input.subjectEn} wears ${outfitSentences[0]}`
    : outfitSentences[0];
  const detailed = [
    sentence(lead),
    ...outfitSentences.slice(1).map(sentence),
    poseIncluded ? sentence(input.poseEn) : "",
    allIncluded ? sentence(input.backgroundEn) : "",
    allIncluded && input.styleEnabled ? sentence(input.styleEn) : "",
  ]
    .filter(Boolean)
    .join(" ");

  const short = compact([
    poseIncluded ? input.subjectEn : "",
    selectedAttire
      ? `${selectedAttire}, ${input.baseShortEn || input.baseEn}`
      : `${input.motifEn}-inspired ${input.baseShortEn || input.baseEn}`,
    directions,
    input.paletteEn,
    input.materialsEn,
    ...(input.placementsEn || []),
    exposure.short,
    ...(input.structuresEn || []),
    input.focusShortEn,
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
      structure: compact(input.structuresEn || []) || "no additional structural edit",
      exposure: exposure.prompt,
      pose: poseIncluded ? input.poseEn : "",
      background: allIncluded ? input.backgroundEn : "",
      style: allIncluded && input.styleEnabled ? input.styleEn : "",
    },
  };
}
