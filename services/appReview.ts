import { AppReview } from '@capawesome/capacitor-app-review';

// Prompt the native in-app review dialog.
// The OS decides whether to actually show it (rate-limited by both Google & Apple).
// Never call this after a stressful event (e.g. panic mode activation).
export async function requestAppReview(): Promise<void> {
  try {
    await AppReview.requestReview();
  } catch (err) {
    // Silent fail — review prompt is best-effort only
    console.warn('App review request failed (expected in browser):', err);
  }
}

// Call this after a positive milestone and check the threshold first.
// Returns true if we should prompt (milestone reached, not prompted recently).
const REVIEW_KEY = 'last_review_prompt';
const REVIEW_INTERVAL_DAYS = 30;

export function shouldPromptReview(milestonesHit: number): boolean {
  if (milestonesHit < 1) return false;
  try {
    const last = localStorage.getItem(REVIEW_KEY);
    if (!last) return true;
    const daysSince = (Date.now() - parseInt(last)) / 86400000;
    return daysSince >= REVIEW_INTERVAL_DAYS;
  } catch {
    return false;
  }
}

export function markReviewPrompted(): void {
  try {
    localStorage.setItem(REVIEW_KEY, Date.now().toString());
  } catch { /* ignore */ }
}
