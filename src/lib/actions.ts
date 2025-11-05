
'use server';

import { promises as dns } from 'node:dns';
import { isIP } from 'node:net';
import { appConfig } from '@/lib/config';
import type { CheckResult, DnsRecord, IpInfo, CheckNodeResult, FormState, AnomalySummary } from '@/lib/types';

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


function detectNetworkAnomaly(checkNodeResults: CheckNodeResult[]): AnomalySummary {
    const totalNodes = checkNodeResults.length;
    if (totalNodes === 0) {
        return { isAnomaly: false, summary: "No node data available to analyze.", recommendation: "" };
    }

    const highLatencyNodes = checkNodeResults.filter(r => r.latency > 200).length;
    const errorNodes = checkNodeResults.filter(r => r.status === 'error').length;

    const highLatencyPercentage = (highLatencyNodes / totalNodes) * 100;
    const errorPercentage = (errorNodes / totalNodes) * 100;

    if (errorPercentage > 30) {
        return {
            isAnomaly: true,
            summary: `High failure rate detected: ${errorPercentage.toFixed(0)}% of nodes are reporting errors.`,
            recommendation: "Investigate server logs and firewall settings for the affected nodes to identify the cause of connection failures."
        };
    }

    if (highLatencyPercentage > 50) {
        return {
            isAnomaly: true,
            summary: `High latency detected: ${highLatencyPercentage.toFixed(0)}% of nodes have a latency over 200ms.`,
            recommendation: "Check for network congestion or server load issues. Consider using a CDN to improve global performance."
        };
    }

    return {
        isAnomaly: false,
        summary: "Network performance appears to be stable and within normal parameters.",
        recommendation: ""
    };
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
        
        const anomalySummary = detectNetworkAnomaly(checkNodeResults);
        
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
