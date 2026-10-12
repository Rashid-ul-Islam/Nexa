import {
  EXPERIENCE_RANK,
  EDUCATION_LABELS,
  EXPERIENCE_LABELS,
  REMOTE_LABELS,
} from "../config/constants.js";
import { calculateDistanceKm } from "./geoDistance.js";

export const MATCH_DISCLAIMER =
  "This is a recommendation based on your profile, not an eligibility guarantee.";

/**
 * Checks if student profile has minimum required fields for matching
 */
export function isMatchReady(profile) {
  if (!profile) return false;
  const hasEducation = Boolean(profile.educationLevel);
  const hasSkills = Array.isArray(profile.skillIds) && profile.skillIds.length > 0;
  const hasFields =
    (Array.isArray(profile.interestFieldIds) && profile.interestFieldIds.length > 0) ||
    Boolean(profile.majorFieldId);

  return hasEducation && (hasSkills || hasFields);
}

/**
 * Pure function: Computes deterministic match score (0-100) between a student profile and an opportunity
 *
 * @param {object} profile - Student's profile from User document
 * @param {object} opportunity - Opportunity document
 * @returns {object} MatchResult with score, label, reasons, warnings, breakdown
 */
export function calculateMatch(profile, opportunity) {
  if (!isMatchReady(profile)) {
    return {
      score: null,
      label: null,
      labelText: null,
      breakdown: null,
      reasons: [],
      warnings: [],
      missingProfileInfo: ["educationLevel", "skills or field of study"],
      matchedSkillIds: [],
      unmatchedSkillIds: [],
      disclaimer: MATCH_DISCLAIMER,
    };
  }

  const reasons = [];
  const warnings = [];
  const breakdown = {};

  // ── 1. Education (Max 20 pts) ──────────────────────────────────────────────
  const oppEdu = opportunity.educationLevels || [];
  let eduPoints = 0;
  if (oppEdu.length === 0) {
    eduPoints = 10; // Neutral: open to all
  } else if (oppEdu.includes(profile.educationLevel)) {
    eduPoints = 20;
    reasons.push("Education requirement matches");
  } else {
    eduPoints = 0;
    const targetLabels = oppEdu.map((e) => EDUCATION_LABELS[e] || e).join(", ");
    warnings.push(`Education level may not match (opportunity targets: ${targetLabels})`);
  }
  breakdown.education = { points: eduPoints, max: 20 };

  // ── 2. Skills (Max 30 pts) ─────────────────────────────────────────────────
  const oppSkills = (opportunity.skillIds || []).map((s) => (s._id ? s._id.toString() : s.toString()));
  const userSkills = new Set(
    (profile.skillIds || []).map((s) => (s._id ? s._id.toString() : s.toString()))
  );

  let skillPoints = 0;
  const matchedSkillIds = [];
  const unmatchedSkillIds = [];

  if (oppSkills.length === 0) {
    skillPoints = 15; // Neutral
  } else {
    oppSkills.forEach((id) => {
      if (userSkills.has(id)) {
        matchedSkillIds.push(id);
      } else {
        unmatchedSkillIds.push(id);
      }
    });

    const m = matchedSkillIds.length;
    const t = oppSkills.length;
    skillPoints = Math.round((30 * m) / t);

    if (m > 0) {
      reasons.push(`${m} of ${t} relevant skills match your profile`);
    } else {
      warnings.push("None of the listed skills are currently in your profile");
    }
  }
  breakdown.skills = { points: skillPoints, max: 30 };

  // ── 3. Field of Study / Discipline (Max 20 pts) ────────────────────────────
  const oppFields = (opportunity.fieldIds || []).map((f) => (f._id ? f._id.toString() : f.toString()));
  const userFields = new Set([
    ...(profile.interestFieldIds || []).map((f) => (f._id ? f._id.toString() : f.toString())),
    ...(profile.majorFieldId ? [profile.majorFieldId.toString()] : []),
  ]);

  let fieldPoints = 0;
  if (oppFields.length === 0) {
    fieldPoints = 10; // Neutral
  } else if (userFields.size === 0) {
    fieldPoints = 0;
    warnings.push("Add fields of interest to your profile to improve matching");
  } else {
    const hasOverlap = oppFields.some((f) => userFields.has(f));
    if (hasOverlap) {
      fieldPoints = 20;
      reasons.push("Academic discipline matches your profile");
    } else {
      fieldPoints = 0;
      warnings.push("Field does not match your listed major or interests");
    }
  }
  breakdown.field = { points: fieldPoints, max: 20 };

  // ── 4. Location & Remote Mode (Max 10 pts) ──────────────────────────────────
  // Part A: Work mode (5 pts)
  let modePoints = 0;
  const pref = profile.remotePreference || "ANY";
  const oppMode = opportunity.remoteType;

  if (pref === "ANY" || !oppMode) {
    modePoints = 5;
  } else if (pref === oppMode) {
    modePoints = 5;
    reasons.push("Remote preference matches");
  } else if (pref === "REMOTE" && oppMode === "ONSITE") {
    modePoints = 0;
    warnings.push("Opportunity is on-site; you prefer remote");
  } else if (pref === "ONSITE" && oppMode === "REMOTE") {
    modePoints = 0;
    warnings.push("Opportunity is remote; you prefer on-site");
  } else {
    modePoints = 2.5;
  }

  // Part B: Geographic Proximity & Distance (5 pts)
  let placePoints = 0;
  let distanceKm = null;

  // Extract coordinates if present (GeoJSON coordinates: [longitude, latitude])
  const userCoords = profile.location?.coordinates;
  const oppCoords = opportunity.location?.coordinates;

  if (oppMode === "REMOTE") {
    placePoints = 5; // Remote opportunities are accessible anywhere
    reasons.push("Remote - accessible from any location");
  } else if (
    Array.isArray(userCoords) &&
    userCoords.length === 2 &&
    Array.isArray(oppCoords) &&
    oppCoords.length === 2
  ) {
    // GeoJSON is [longitude, latitude] -> lat is index 1, lon is index 0
    distanceKm = calculateDistanceKm(userCoords[1], userCoords[0], oppCoords[1], oppCoords[0]);
    if (distanceKm !== null) {
      if (distanceKm <= 25) {
        placePoints = 5;
        reasons.push(`Location is nearby (${distanceKm} km away)`);
      } else if (distanceKm <= 75) {
        placePoints = 3.5;
        reasons.push(`Location is within commutable distance (${distanceKm} km away)`);
      } else if (distanceKm <= 200) {
        placePoints = 2;
        reasons.push(`Location is ${distanceKm} km from your profile base`);
      } else {
        placePoints = 0;
        warnings.push(`Location is far from your profile (${distanceKm} km away)`);
      }
    } else {
      placePoints = 2.5;
    }
  } else if (!opportunity.country || !profile.country) {
    placePoints = 2.5;
  } else if (opportunity.country.toUpperCase() === profile.country.toUpperCase()) {
    placePoints = 5;
    reasons.push("Location matches your country");
  } else {
    placePoints = 0;
    warnings.push("Location is outside your country");
  }
  breakdown.location = { points: modePoints + placePoints, max: 10, distanceKm };

  // ── 5. Category (Max 10 pts) ───────────────────────────────────────────────
  const prefCats = (profile.preferredCategoryIds || []).map((c) =>
    c._id ? c._id.toString() : c.toString()
  );
  const oppCatId = opportunity.categoryId?._id
    ? opportunity.categoryId._id.toString()
    : opportunity.categoryId?.toString();

  let catPoints = 0;
  if (prefCats.length === 0) {
    catPoints = 5; // Neutral
  } else if (oppCatId && prefCats.includes(oppCatId)) {
    catPoints = 10;
    reasons.push("Matches an opportunity category you prefer");
  } else {
    catPoints = 0;
  }
  breakdown.category = { points: catPoints, max: 10 };

  // ── 6. Experience Level (Max 10 pts) ────────────────────────────────────────
  let expPoints = 0;
  const oppExp = opportunity.experienceLevel;
  const userExp = profile.experienceLevel;

  if (!oppExp || oppExp === "NONE") {
    expPoints = 10;
    reasons.push("No prior experience required");
  } else if (!userExp) {
    expPoints = 0;
  } else {
    const oppRank = EXPERIENCE_RANK[oppExp] ?? 1;
    const userRank = EXPERIENCE_RANK[userExp] ?? 1;

    if (userRank >= oppRank) {
      expPoints = 10;
      reasons.push("Your experience level meets expectations");
    } else if (oppRank - userRank === 1) {
      expPoints = 5;
      warnings.push(`Opportunity prefers ${oppExp.toLowerCase()} experience`);
    } else {
      expPoints = 0;
      warnings.push(`Requires ${oppExp.toLowerCase()} experience level`);
    }
  }
  breakdown.experience = { points: expPoints, max: 10 };

  // ── Final Score Calculation ────────────────────────────────────────────────
  const totalPoints =
    eduPoints + skillPoints + fieldPoints + (modePoints + placePoints) + catPoints + expPoints;
  const score = Math.min(100, Math.max(0, Math.round(totalPoints)));

  let label = "LOW";
  let labelText = "Low match based on the information in your profile.";
  if (score >= 75) {
    label = "STRONG";
    labelText = "Strong match based on the information in your profile.";
  } else if (score >= 55) {
    label = "GOOD";
    labelText = "Good match based on the information in your profile.";
  } else if (score >= 35) {
    label = "PARTIAL";
    labelText = "Partial match based on the information in your profile.";
  }

  return {
    score,
    label,
    labelText,
    breakdown,
    reasons,
    warnings,
    distanceKm,
    missingProfileInfo: [],
    matchedSkillIds,
    unmatchedSkillIds,
    disclaimer: MATCH_DISCLAIMER,
  };
}

export { calculateDistanceKm };
