'use client';

import type { FormState } from '@/lib/types';
import { AlertTriangle, BarChart } from 'lucide-react';
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
      <Alert variant="destructive" className="max-w-2xl mx-auto glass-card">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!result) {
    return (
      <div className="text-center text-muted-foreground/80 glass-card max-w-sm mx-auto p-8 flex flex-col items-center gap-4">
        <BarChart className="w-12 h-12 text-muted-foreground/50" />
        <p>Your network analysis results will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in-0 zoom-in-95 duration-500">
      <div className="lg:col-span-3 h-[400px] md:h-[500px] glass-card p-2 md:p-4">
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
