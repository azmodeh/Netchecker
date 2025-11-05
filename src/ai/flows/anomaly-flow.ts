'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AnomalySummary, CheckResult } from '@/lib/types';

const AnomalyDetectionInputSchema = z.object({
  ipInfo: z.object({
    org: z.string(),
    country: z.string(),
  }),
  totalCheckNodes: z.number(),
  successfulChecks: z.number(),
  failedChecks: z.number(),
  averageLatency: z.number(),
});

type AnomalyDetectionInput = z.infer<typeof AnomalyDetectionInputSchema>;

const AnomalyDetectionOutputSchema = z.object({
    isAnomaly: z.boolean().describe("Set to true if a significant network anomaly is detected, otherwise false."),
    summary: z.string().describe("A concise, one-sentence summary of the overall network status based on the provided data."),
    recommendation: z.string().describe("If an anomaly is detected, provide a brief, actionable recommendation. If no anomaly, this can be an empty string."),
});


export async function detectNetworkAnomaly(input: CheckResult): Promise<AnomalySummary> {
    const successfulResults = input.checkNodeResults.filter(r => r.status === 'success');
    const averageLatency = successfulResults.length > 0 
        ? Math.round(successfulResults.reduce((acc, r) => acc + r.latency, 0) / successfulResults.length)
        : 0;
    
    const aiInput: AnomalyDetectionInput = {
        ipInfo: {
            org: input.ipInfo.org,
            country: input.ipInfo.country
        },
        totalCheckNodes: input.checkNodeResults.length,
        successfulChecks: successfulResults.length,
        failedChecks: input.checkNodeResults.length - successfulResults.length,
        averageLatency: averageLatency
    };
    return await detectAnomalyFlow(aiInput);
}

const prompt = ai.definePrompt({
    name: 'detectAnomalyPrompt',
    input: { schema: AnomalyDetectionInputSchema },
    output: { schema: AnomalyDetectionOutputSchema },
    prompt: `You are a network analysis expert. Your task is to analyze network performance data and determine if there is an anomaly.

Analyze the following network check results:
- Target Organization: {{{ipInfo.org}}} in {{{ipInfo.country}}}
- Total check nodes: {{{totalCheckNodes}}}
- Successful checks: {{{successfulChecks}}}
- Failed checks: {{{failedChecks}}}
- Average latency (for successful checks): {{{averageLatency}}}ms

Consider the following as potential anomalies:
- A high percentage of failed checks (e.g., > 25%).
- Very high average latency across all nodes (e.g., > 250ms).
- A cluster of high-latency or failed nodes in a specific geographic region (You cannot detect this, but keep it in mind).
- Significant latency discrepancies between different continents (You cannot detect this, but keep it in mind).

Based on your analysis, determine if there is a significant anomaly. Provide a concise summary and a clear recommendation if an anomaly is found.
`,
});


const detectAnomalyFlow = ai.defineFlow(
  {
    name: 'detectAnomalyFlow',
    inputSchema: AnomalyDetectionInputSchema,
    outputSchema: AnomalyDetectionOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
