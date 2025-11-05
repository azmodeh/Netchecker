
'use server';

// This file is no longer used for anomaly detection as the logic has been
// moved to a standard TypeScript function in `src/lib/actions.ts` for
// better performance and reliability. It is kept for reference.

import type { AnomalySummary, CheckResult } from '@/lib/types';


export async function detectNetworkAnomaly(input: CheckResult): Promise<AnomalySummary> {
  // This is a dummy function. The actual logic is now in `src/lib/actions.ts`.
  return Promise.resolve({
      isAnomaly: false,
      summary: "Analysis not performed via AI.",
      recommendation: ""
  });
}
