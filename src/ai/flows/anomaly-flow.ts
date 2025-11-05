
'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { AnomalySummary, CheckResult } from '@/lib/types';
import { gemini15Flash } from '@genkit-ai/google-genai';

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

// A new schema for the prompt input, with stringified JSON fields
const PromptInputSchema = z.object({
  ip: z.string(),
  stringifiedIpInfo: z.string(),
  stringifiedDnsRecords: z.string(),
  stringifiedCheckNodeResults: z.string(),
});


// Define the Zod schema for the output
const AnomalySummarySchema = z.object({
  isAnomaly: z.boolean().describe('Set to true if any significant anomaly is detected, otherwise false.'),
  summary: z.string().describe('A concise, one-sentence summary of the network health status.'),
  recommendation: z.string().describe('A brief, actionable recommendation if an anomaly is found. Should be an empty string if no anomaly is detected.'),
});

// Define the main function to be exported
export async function detectNetworkAnomaly(input: CheckResult): Promise<AnomalySummary> {
  // The input to this function is the full CheckResult, but the flow expects it too.
  return anomalyDetectionFlow(input);
}

const anomalyDetectionPrompt = ai.definePrompt({
  name: 'anomalyDetectionPrompt',
  input: { schema: PromptInputSchema },
  output: { schema: AnomalySummarySchema },
  prompt: `
    You are a senior network engineer AI assistant.
    Analyze the provided network check results to identify potential anomalies.
    
    Data:
    - Target IP: {{{ip}}}
    - IP Info: {{{stringifiedIpInfo}}}
    - DNS Records: {{{stringifiedDnsRecords}}}
    - Global Check Node Results: {{{stringifiedCheckNodeResults}}}
    
    Your task is to determine if there's a significant anomaly.
    An anomaly could be:
    - High latency (>200ms) from a majority of nodes.
    - A high percentage (>30%) of failing check nodes.
    - DNS resolution issues (though the presence of records implies it resolved).
    - Significant geographic disparity in performance (e.g., excellent in NA, terrible in AP).
    
    Based on your analysis, provide a summary and a recommendation.
    If everything looks normal, state that clearly.
  `,
});

const anomalyDetectionFlow = ai.defineFlow(
  {
    name: 'anomalyDetectionFlow',
    inputSchema: CheckResultSchema, // This now correctly matches the input from the action
    outputSchema: AnomalySummarySchema,
  },
  async (input) => {
    // Stringify the complex objects for the prompt.
    const promptInput: z.infer<typeof PromptInputSchema> = {
      ip: input.ip,
      stringifiedIpInfo: JSON.stringify(input.ipInfo, null, 2),
      stringifiedDnsRecords: JSON.stringify(input.dnsRecords, null, 2),
      stringifiedCheckNodeResults: JSON.stringify(input.checkNodeResults, null, 2),
    };
    
    const { output } = await ai.generate({
      model: gemini15Flash,
      prompt: anomalyDetectionPrompt.prompt,
      input: promptInput,
      output: {
        schema: AnomalySummarySchema,
      }
    });
    
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
