'use server';

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { z } from 'zod';
import type { IpInfo, DnsRecord, CheckNodeResult, AIAnalysis } from '@/lib/types';

const ai = genkit({
  plugins: [googleAI()],
  enableTracingAndMetrics: true,
});

const AnalysisInputSchema = z.object({
  ipInfo: z.object({
    ip: z.string(),
    city: z.string(),
    region: z.string(),
    country: z.string(),
    org: z.string(),
    proxy: z.boolean().optional(),
    hosting: z.boolean().optional(),
    mobile: z.boolean().optional(),
  }),
  dnsRecords: z.array(z.object({
    type: z.string(),
    value: z.string(),
  })),
  checkNodeResults: z.array(z.object({
    node: z.string(),
    status: z.string(),
    latency: z.number(),
    nodeInfo: z.object({
      name: z.string(),
    }),
  })),
});

export const analysisFlow = ai.defineFlow(
  {
    name: 'analysisFlow',
    inputSchema: AnalysisInputSchema,
    outputSchema: z.object({ summary: z.string() }),
  },
  async (input) => {
    const { ipInfo, dnsRecords, checkNodeResults } = input;

    const prompt = `
      You are a network intelligence analyst. Your task is to provide a concise, human-readable summary 
      based on the following network diagnostic data. The summary should be 1-2 paragraphs. 
      Focus on the most important insights. Be clear and avoid overly technical jargon unless necessary.

      Data:
      - IP Information: 
        - IP Address: ${ipInfo.ip}
        - Location: ${ipInfo.city}, ${ipInfo.region}, ${ipInfo.country}
        - Organization: ${ipInfo.org}
        - Is Proxy/VPN: ${ipInfo.proxy ? 'Yes' : 'No'}
        - Is Hosting Provider: ${ipInfo.hosting ? 'Yes' : 'No'}
      - DNS Records: ${dnsRecords.length > 0 ? dnsRecords.map(r => `${r.type}: ${r.value}`).join(', ') : 'N/A'}
      - Global Check Results:
        ${checkNodeResults.map(r => 
          `- ${r.nodeInfo.name}: ${r.status === 'success' ? `Success (${r.latency}ms)` : 'Failed'}`
        ).join('\n        ')}

      Based on this data, provide a summary analysis. Key points to consider:
      - What is the geographic and network provider identity of this IP?
      - How is its global performance? Are there any regions with high latency or failures?
      - Are there any security flags to be aware of (e.g., if it's a known proxy or hosting provider)?
      - Summarize the overall health and reachability of the target.
    `;

    const llmResponse = await ai.generate({
      model: 'gemini-1.5-flash-latest',
      prompt: prompt,
    });

    return { summary: llmResponse.text };
  }
);
