
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AnomalySummary, CheckResult } from '@/lib/types';

// Define the Zod schema for the input, mirroring the CheckResult type
const CheckResultSchema = z.object({
  ip: z.string(),
  dnsRecords: z.array(z.object({
    type: z.enum(['A', 'AAAA']),
    value: z.string(),
  })),
  ipInfo: z.object({
    ip: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string(),
    org: z.string(),
    loc: z.string(),
  }),
  checkNodeResults: z.array(z.object({
    node: z.string(),
    status: z.enum(['success', 'error']),
    latency: z.number(),
    nodeInfo: z.object({
      name: z.string(),
      lat: z.number(),
      lon: z.number(),
    }),
  })),
});

// Define the Zod schema for the output
const AnomalySummarySchema = z.object({
  isAnomaly: z.boolean().describe('Set to true if any significant anomaly is detected, otherwise false.'),
  summary: z.string().describe('A concise, one-sentence summary of the network health status.'),
  recommendation: z.string().describe('A brief, actionable recommendation if an anomaly is found. Should be an empty string if no anomaly is detected.'),
});

// Define the main function to be exported
export async function detectNetworkAnomaly(input: CheckResult): Promise<AnomalySummary> {
  return anomalyDetectionFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: { schema: CheckResultSchema },
  output: { schema: AnomalySummarySchema },
  prompt: `
    You are a senior network engineer AI assistant.
    Analyze the provided network check results to identify potential anomalies.
    
    Data:
    - Target IP: {{{ip}}}
    - IP Info: {{{JSONstringify ipInfo}}}
    - DNS Records: {{{JSONstringify dnsRecords}}}
    - Global Check Node Results: {{{JSONstringify checkNodeResults}}}
    
    Your task is to determine if there's a significant anomaly.
    An anomaly could be:
    - High latency (>200ms) from a majority of nodes.
    - A high percentage (>30%) of failing check nodes.
    - DNS resolution issues (though the presence of records implies it resolved).
    - Significant geographic disparity in performance (e.g., excellent in NA, terrible in AP).
    
    Based on your analysis, provide a summary and a recommendation.
    If everything looks normal, state that clearly.
  `,
  helpers: {
    JSONstringify: (obj: any) => JSON.stringify(obj),
  }
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: CheckResultSchema,
    outputSchema: AnomalySummarySchema,
  },
  async (input) => {
    const { output } = await anomalyDetectionPrompt(input);
    return output!;
  }
);
