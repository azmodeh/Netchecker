
'use server';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';
import { appConfig } from '@/lib/config';
import type { CheckResult, DnsRecord, IpInfo, CheckNodeResult, FormState } from '@/lib/types';
import { detectNetworkAnomaly } from '@/ai/flows/anomaly-flow';

// Mock IPInfo service
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
            org: 'Your Computer',
            loc: '0,0',
        };
    }

    const lat = (Math.random() * 180 - 90).toFixed(4);
    const lon = (Math.random() * 360 - 180).toFixed(4);

    return {
        ip,
        city: 'Mountain View',
        region: 'California',
        country: 'US',
        org: 'AS15169 Google LLC',
        loc: `${lat},${lon}`, // Use random loc for map demo
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
        
        const anomalySummary = await detectNetworkAnomaly({
            ip: targetIp,
            dnsRecords,
            ipInfo,
            checkNodeResults,
        });
        
        const result: CheckResult = {
            ip: targetIp,
            dnsRecords,
            ipInfo,
            checkNodeResults,
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
