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
  const noSlit = input.qipaoSlitId === "none" || /\bslit-free\b/i.test(input.motifVariantEn || "");
  const modestSlit = input.qipaoSlitId === "modest" || /\bmodest slit\b/i.test(input.motifVariantEn || "");
  const avoidAutomaticSlit = input.artNouveauMode && !modestSlit;
  const cleanQipao = input.qipaoMode && (input.qipaoDetailsEn || []).some((value) => /self-contained one-piece/i.test(value));
  const sleeveConflicts = sleeveless
    ? [/\b(?:long(?:\s+water)?|flowing|wide|fitted|broad|voluminous)\s+sleeves?\b/i]
    : [];
  const legConflicts = bareLegs ? [/\b(?:stockings?|tights?|pants?|trousers?)\b/i] : [];
  const slitConflicts = coveredLegs || noSlit
    ? [/\b(?:high|thigh-high|side|modest)?\s*slits?\b/i, /\bexposed legs?\b/i]
    : modestSlit ? [/\b(?:high|thigh-high)\s+slits?\b/i] : [];
  const armDrapeConflicts = cleanQipao
    ? [/\b(?:detached|separate|floating|flowing|wide)\s+(?:arm covers?|sleeves?|draped panels?)\b/i]
    : [];
  const sourceConflicts = [...sleeveConflicts, ...legConflicts, ...slitConflicts, ...armDrapeConflicts];

  return {
    source: (value) => withoutConflicts(value, sourceConflicts),
    placement: (value) => sleeveless && /\bsleeves?\b/i.test(value) ? "" : withoutConflicts(value, legConflicts),
    structure: (value) => (sleeveless || cleanQipao) && /\b(?:sleeves?|arm covers?|draped panels?)\b/i.test(value) ? "" : withoutConflicts(value, [...legConflicts, ...slitConflicts]),
    focus: (value) => sleeveless && /\bsleeves?\b/i.test(value) ? "" : withoutConflicts(value, legConflicts),
    exposure: (value) => {
      if (openShoulders && /\b(?:mostly\s+)?covered shoulders\b/i.test(value)) return "";
      if (avoidAutomaticSlit && /\bslit\b/i.test(value)) {
        return "with intentionally controlled skin exposure that respects the selected Art Nouveau silhouette without adding a slit";
      }
      if (noSlit && /\bslit\b/i.test(value)) {
        return "with intentionally controlled skin exposure while maintaining a continuous slit-free hem";
      }
      if (modestSlit && /\b(?:high|thigh-high)\s+slit\b/i.test(value)) {
        return "with intentionally controlled skin exposure and only one modest side slit";
      }
      return withoutConflicts(value, slitConflicts);
    },
    sleeve: input.sleeveEn ? `Use ${input.sleeveEn}` : "",
    leg: input.legEn
      ? input.legId === "bare_legs" && /\b(?:qipao|cheongsam)\b/i.test(input.traditionalAttireEn || "")
        ? noSlit
          ? "Use bare legs and exposed legs below the hem, without leg coverings or lower-body underlayers"
          : modestSlit
            ? "Use bare legs, exposed legs, and bare legs visible through one modest side slit, without leg coverings or lower-body underlayers"
            : "Use bare legs, exposed legs, a high side slit, and bare legs visible through the slit, without leg coverings or lower-body underlayers"
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
  const baseVariant = input.baseVariantEn ? `Shape the outfit as ${input.baseVariantEn}` : "";
  const motifVariant = input.motifVariantEn ? `Use ${input.motifVariantEn}` : "";
  const artNouveauIdentity = input.artNouveauMode
    ? "Treat Art Nouveau as an independent Western decorative-fashion language of organic whiplash curves, flowers, vines, jewel-like details, glass-art color, soft drape, and elegant ornament"
    : "";
  const qipaoDetails = input.qipaoMode && (input.qipaoDetailsEn || []).length
    ? `Keep a recognizable self-contained qipao / cheongsam construction, using ${compact(input.qipaoDetailsEn)}; keep the arms and lower body free of unrelated extra layers`
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
  const foodApplications = compact(input.foodApplicationsEn || []);
  const food = input.foodMode && input.motifEn
    ? `Apply the ${input.motifEn} motif through ${foodApplications || "the palette, textile pattern, and accessories"}. Keep literal food and drink away from intimate or sensitive body areas; place them only in the hands or on a tray, plate, glass, table, or background prop`
    : "";

  const supportingSentences = [
    traditionalContext,
    baseVariant,
    motifVariant,
    artNouveauIdentity,
    qipaoDetails,
    translation
      ? `Translate the motif${input.strengthEn ? ` at ${input.strengthEn} intensity` : ""} through ${translation}`
      : "",
    placement,
    food,
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
    poseIncluded ? sentence(input.poseMoodEn) : "",
    poseIncluded && input.seatEn ? sentence(`Seat the figure securely on ${input.seatEn}, with visible physical support and natural contact`) : "",
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
    input.baseVariantEn,
    input.motifVariantEn,
    input.artNouveauMode ? "Art Nouveau organic curves and Western decorative ornament" : "",
    ...(input.qipaoMode ? input.qipaoDetailsEn || [] : []),
    controls.source(input.paletteEn),
    controls.source(input.materialsEn),
    ...safePlacements,
    input.foodMode ? compact(input.foodApplicationsEn || []) : "",
    exposurePrompt ? exposure.short : "",
    input.sleeveEn,
    controls.leg,
    ...safeStructures,
    safeFocus ? input.focusShortEn : "",
    poseIncluded ? input.poseShortEn : "",
    poseIncluded ? input.poseMoodEn : "",
    poseIncluded ? input.seatEn : "",
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
      variant: compact([baseVariant, motifVariant, artNouveauIdentity, qipaoDetails]),
      food,
      sleeves: controls.sleeve,
      legs: controls.leg,
      structure: compact(safeStructures),
      exposure: exposurePrompt,
      pose: poseIncluded ? input.poseEn : "",
      seat: poseIncluded ? input.seatEn || "" : "",
      background: allIncluded ? input.backgroundEn : "",
      style: allIncluded && input.styleEnabled ? input.styleEn : "",
    },
  };
}
