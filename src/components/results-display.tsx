
'use client';

import type { FormState } from '@/lib/types';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { IpDnsCard, NetworkStatusCard } from './ip-info-card';
import CheckResultsList from './check-results-list';
import MapDisplay from './map-display';
import AnomalyCard from './anomaly-card';
import LatencyChart from './latency-chart';
import { useMemo } from 'react';

export default function ResultsDisplay({ state }: { state: FormState }) {
  const { result, error } = state;

    const mapMarkers = useMemo(() => {
    if (!result) return [];
    
    const markers = [];

    // Add marker for the target IP
    const targetLocString = result.ipInfo.loc;
    if (targetLocString && targetLocString.includes(',')) {
      const targetCoords = targetLocString.split(',').map(parseFloat);
      if (targetCoords.length === 2 && !isNaN(targetCoords[0]) && !isNaN(targetCoords[1])) {
        const [latitude, longitude] = targetCoords;
        markers.push({
            longitude: longitude,
            latitude: latitude,
            color: 'hsl(var(--primary))',
            label: `Target: ${result.ipInfo.ip}`,
        });
      }
    }
    
    // Add markers for check nodes
    result.checkNodeResults.forEach(nodeResult => {
      markers.push({
        longitude: nodeResult.nodeInfo.lon,
        latitude: nodeResult.nodeInfo.lat,
        color: 'hsl(var(--accent))',
        label: `${nodeResult.nodeInfo.name} (${nodeResult.latency}ms)`,
      });
    });

    return markers;
  }, [result]);

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result && !error && state.timestamp) { // Loading state
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
        <p>Running complete network analysis...</p>
      </div>
    );
  }


  if (!result) {
    return null; // Don't show anything initially
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in-0 zoom-in-95 duration-500 mt-8">
      <div className="lg:col-span-2 h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-primary/20">
        <MapDisplay markers={mapMarkers} />
      </div>
      {result.anomalySummary && (
        <div className="lg:col-span-2">
          <AnomalyCard summary={result.anomalySummary} />
        </div>
      )}
      <div className="lg:col-span-1 space-y-8">
        <IpDnsCard ipInfo={result.ipInfo} dnsRecords={result.dnsRecords} />
      </div>
      <div className="lg:col-span-1 space-y-8">
        <NetworkStatusCard ipInfo={result.ipInfo} />
        <CheckResultsList results={result.checkNodeResults} />
      </div>
       <div className="lg:col-span-2">
        <LatencyChart results={result.checkNodeResults} />
      </div>
    </div>
  );
}
