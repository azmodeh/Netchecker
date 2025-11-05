'use server';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';
import { appConfig } from '@/lib/config';
import type { CheckResult, DnsRecord, IpInfo, CheckNodeResult, FormState } from '@/lib/types';

async function getIpInfo(ip: string): Promise<IpInfo> {
  // In a real app, this would call an API like ipinfo.io
  await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
  if (ip === '127.0.0.1' || ip === '::1') {
      return {
          ip,
          city: 'Localhost',
          region: 'N/A',
          country: 'N/A',
          countryCode: 'N/A',
          org: 'Your Computer',
          loc: '0,0',
          proxy: false,
          hosting: false,
          mobile: false,
      };
  }

  try {
    const response = await fetch(`http://localhost:9002/api/ip-info/${ip}`);
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error(`ip-api request failed with status ${response.status}:`, errorText);
        throw new Error(`Failed to fetch IP information. Status: ${response.status}`);
    }
        
    const data = await response.json();

    if (data.status === 'success') {
      return {
        ip: data.query,
        city: data.city,
        region: data.regionName,
        country: data.country,
        countryCode: data.countryCode,
        org: data.org || data.isp,
        loc: `${data.lat},${data.lon}`,
        mobile: data.mobile,
        proxy: data.proxy,
        hosting: data.hosting,
        lat: data.lat,
        lon: data.lon,
      };
    }

    // Handle ip-api.com specific errors
    if (data.status === 'fail') {
      console.error('ip-api.com error:', data.message);
      throw new Error(data.message || 'Failed to get IP info due to a failure from the provider.');
    }

    // Fallback for any other unexpected response structure
    throw new Error('Received an unexpected response from IP info service.');

  } catch (e: any) {
    console.error("Error in getIpInfo:", e);
    // Re-throw a more specific error if available, otherwise a generic one
    throw new Error(e.message || 'Failed to fetch IP information due to a network or server error.');
  }
}


// Mock CheckHost service
async function runCheckHost(ip: string): Promise<CheckNodeResult[]> {
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500));
    const results: CheckNodeResult[] = [];
    const nodes = appConfig.defaultNodes;
    for (const node of nodes) {
        results.push({
            node,
            status: Math.random() > 0.1 ? 'success' : 'error',
            latency: Math.floor(Math.random() * 300) + 20,
            nodeInfo: appConfig.nodes[node],
        });
    }
    return results;
}

// Main server action
export async function performGlobalCheck(prevState: FormState, formData: FormData): Promise<FormState> {
    const domain = formData.get('domain') as string;

    if (!domain) {
        // Return a state that indicates nothing should be shown, not even an error.
        return { timestamp: Date.now() };
    }

    try {
        let targetIp = '';
        const dnsRecords: DnsRecord[] = [];

        if (isIP(domain)) {
            targetIp = domain;
        } else {
            const [aRecords, aaaaRecords] = await Promise.all([
                dns.resolve(domain, 'A').catch(() => []),
                dns.resolve(domain, 'AAAA').catch(() => []),
            ]);

            if (aRecords.length === 0 && aaaaRecords.length === 0) {
                return { error: `Could not resolve DNS for ${domain}` };
            }
            
            aRecords.forEach(r => dnsRecords.push({ type: 'A', value: r }));
            aaaaRecords.forEach(r => dnsRecords.push({ type: 'AAAA', value: r }));

            targetIp = aRecords[0] || aaaaRecords[0];
        }

        const [ipInfo, checkNodeResults] = await Promise.all([
            getIpInfo(targetIp),
            runCheckHost(targetIp)
        ]);

        const result: CheckResult = {
            ip: targetIp,
            dnsRecords,
            ipInfo,
            checkNodeResults,
        };

        return { result, timestamp: Date.now() };

    } catch (error: any) {
        console.error(error);
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            return { error: `Could not resolve DNS for '${domain}'. Please check the name and try again.` };
        }
        return { error: error.message || 'An unexpected error occurred. Please try again.' };
    }
}
