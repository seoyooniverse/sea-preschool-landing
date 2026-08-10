export const JULY_COHORT = "2026년 7월 개강반";
export const AUGUST_COHORT = "2026년 8월 개강반";

export const cohortOptions = [JULY_COHORT, AUGUST_COHORT];

export function normalizeCohort(cohort?: string | null) {
  const value = String(cohort ?? "").trim();

  if (!value || value === "기수 미지정") {
    return JULY_COHORT;
  }

  if (value.includes("8월")) {
    return AUGUST_COHORT;
  }

  if (value.includes("7월")) {
    return JULY_COHORT;
  }

  return value;
}

export function isAugustCohort(cohort?: string | null) {
  return normalizeCohort(cohort) === AUGUST_COHORT;
}
