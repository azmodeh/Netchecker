
'use server';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';
import { appConfig } from '@/lib/config';
import type { CheckResult, DnsRecord, IpInfo, CheckNodeResult, FormState } from '@/lib/types';
import { detectNetworkAnomaly } from '@/ai/flows/anomaly-flow';

async function getIpInfo(ip: string): Promise<IpInfo> {
  // In a real app, this would call an API like ipinfo.io
  // This is a mock with 4-source cross-validation simulation
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
    // First attempt with ip-api.com which provides more details
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp,org,as,mobile,proxy,hosting,query`);
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
      };
    }
  } catch (e) {
    console.error("ip-api.com failed, falling back to ipapi.co", e)
  }

  // Fallback to ipapi.co
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await response.json();

  if (data.error) {
    throw new Error(data.reason);
  }

  return {
    ip: data.ip,
    city: data.city,
    region: data.region,
    country: data.country_name,
    countryCode: data.country_code,
    org: data.org,
    loc: `${data.latitude},${data.longitude}`,
  };
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
        return { error: 'Please enter a domain or IP address.' };
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
        
        const partialResult = {
            ip: targetIp,
            dnsRecords,
            ipInfo,
            checkNodeResults,
        };

        const anomalySummary = await detectNetworkAnomaly(partialResult);
        
        const result: CheckResult = {
            ...partialResult,
            anomalySummary,
        };

        return { result, timestamp: Date.now() };

    } catch (error: any) {
        console.error(error);
        if (error.code === 'ENOTFOUND' || error.code === 'EAI_AGAIN') {
            return { error: `Could not resolve DNS for '${domain}'. Please check the name and try again.` };
        }
        return { error: 'An unexpected error occurred. Please try again.' };
    }
}
