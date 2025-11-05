'use client';

import type { FormState } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IpDnsCard, NetworkStatusCard } from './ip-info-card';
import CheckResultsList from './check-results-list';
import MapDisplay from './map-display';
import LatencyChart from './latency-chart';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse mt-8">
      <div className="lg:col-span-2 h-[400px] md:h-[500px]">
         <Skeleton className="w-full h-full rounded-2xl" />
      </div>
       <div className="space-y-8">
        <Skeleton className="h-[430px] w-full rounded-2xl" />
      </div>
       <div className="space-y-8">
        <Skeleton className="h-[200px] w-full rounded-2xl" />
        <Skeleton className="h-[360px] w-full rounded-2xl" />
       </div>
       <div className="lg:col-span-2">
         <Skeleton className="h-[360px] w-full rounded-2xl" />
      </div>
    </div>
);


export default function ResultsDisplay({ state }: { state: FormState }) {
  const { result, error } = state;

  const mapMarkers = result ? (() => {
    const markers = [];
    
    // Add marker for the target IP
    if (result.ipInfo.lat && result.ipInfo.lon) {
        markers.push({
            longitude: result.ipInfo.lon,
            latitude: result.ipInfo.lat,
            color: 'hsl(var(--primary))',
            label: `Target: ${result.ipInfo.ip}`,
        });
    }

    // Add markers for check nodes
    result.checkNodeResults.forEach(nodeResult => {
      if (nodeResult.nodeInfo && nodeResult.nodeInfo.lat && nodeResult.nodeInfo.lon) {
        markers.push({
          latitude: nodeResult.nodeInfo.lat,
          longitude: nodeResult.nodeInfo.lon,
          color: 'hsl(var(--accent))',
          label: `${nodeResult.nodeInfo.name}: ${nodeResult.latency}ms`,
        });
      }
    });

    return markers;
  })() : [];

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result && !error && state.timestamp) { // Loading state
    return <LoadingSkeleton />;
  }

  if (!result) {
    return (
       <div className="text-center text-muted-foreground py-16">
        <p>Enter an IP address or domain to begin analysis.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-0 zoom-in-95 duration-500 mt-8">
      <div className="lg:col-span-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-primary/20 glass-card p-0">
        <MapDisplay markers={mapMarkers} />
      </div>
      <div className="space-y-8">
        <IpDnsCard ipInfo={result.ipInfo} dnsRecords={result.dnsRecords} />
      </div>
       <div className="space-y-8">
         <NetworkStatusCard ipInfo={result.ipInfo} />
         <CheckResultsList results={result.checkNodeResults} />
       </div>
       <div className="lg:col-span-2">
        <LatencyChart results={result.checkNodeResults} />
      </div>
    </div>
  );
}
