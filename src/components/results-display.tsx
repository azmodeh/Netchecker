
'use client';

import type { FormState } from '@/lib/types';
import { AlertTriangle, BarChart, LoaderCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import IpInfoCard from './ip-info-card';
import CheckResultsList from './check-results-list';
import MapDisplay from './map-display';
import AnomalyCard from './anomaly-card';
import LatencyChart from './latency-chart';
import { useMemo } from 'react';

export default function ResultsDisplay({ state }: { state: FormState }) {
  const { result, error } = state;

  const mapMarkers = useMemo(() => {
    if (!result) return [];
    
    const targetLocString = result.ipInfo.loc;
    if (!targetLocString || !targetLocString.includes(',')) {
      return [];
    }
    
    const targetLoc = targetLocString.split(',').map(parseFloat);
    const markers = [
      {
        longitude: targetLoc[1],
        latitude: targetLoc[0],
        color: 'hsl(var(--primary))',
        label: `Target: ${result.ipInfo.ip}`,
      },
    ];

    result.checkNodeResults.forEach(nodeRes => {
      markers.push({
        longitude: nodeRes.nodeInfo.lon,
        latitude: nodeRes.nodeInfo.lat,
        color: nodeRes.status === 'success' ? 'hsl(var(--accent))' : 'hsl(var(--destructive))',
        label: nodeRes.nodeInfo.name,
      });
    });
    return markers;
  }, [result]);

  if (error) {
    return (
      <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4 text-destructive mt-4">
        <AlertTriangle className="inline-block mr-2" />
        {error}
      </div>
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in-0 zoom-in-95 duration-500 mt-8">
      <div className="lg:col-span-3 h-[400px] md:h-[500px] rounded-2xl overflow-hidden border border-primary/20">
        <MapDisplay markers={mapMarkers} />
      </div>
      {result.anomalySummary && (
        <div className="lg:col-span-3">
          <AnomalyCard summary={result.anomalySummary} />
        </div>
      )}
      <div className="lg:col-span-1">
        <IpInfoCard ipInfo={result.ipInfo} dnsRecords={result.dnsRecords} />
      </div>
      <div className="lg:col-span-2">
        <CheckResultsList results={result.checkNodeResults} />
      </div>
       <div className="lg:col-span-3">
        <LatencyChart results={result.checkNodeResults} />
      </div>
    </div>
  );
}
