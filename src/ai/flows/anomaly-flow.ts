
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
  model: 'googleai/gemini-1.5-flash',
  input: { schema: CheckResultSchema },
  output: { schema: AnomalySummarySchema },
  prompt: `
    You are a senior network engineer AI assistant.
    Analyze the provided network check results JSON object to identify potential anomalies.

    Your task is to determine if there's a significant anomaly based on the following criteria:
    - High latency: More than 50% of check nodes have a latency greater than 200ms.
    - High failure rate: More than 30% of check nodes have a status of 'error'.
    - Significant geographic disparity: Latency from one continent is consistently 3x higher than others.

    Analyze the input data:
    - The IP being checked is {{{ip}}}.
    - It is located in {{{ipInfo.city}}}, {{{ipInfo.country}}}.
    - The check node results are in the \`checkNodeResults\` array.

    Based on your analysis, provide a summary and a recommendation.
    If everything looks normal, state that clearly and set isAnomaly to false.
    If an anomaly is found, set isAnomaly to true, summarize the issue, and provide a concrete recommendation.
  `,
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: CheckResultSchema,
    outputSchema: AnomalySummarySchema,
  },
  async (input) => {
    const { output } = await anomalyDetectionPrompt(input);
    
    if (!output) {
      // Handle the case where the AI model doesn't return a valid output
      return {
        isAnomaly: true,
        summary: "AI analysis could not be completed.",
        recommendation: "Unable to get a response from the AI model. Please check the model configuration and try again."
      };
    }

    return output;
  }
);
