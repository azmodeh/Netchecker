
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, ShieldCheck, ShieldAlert } from 'lucide-react';
import type { AnomalySummary } from "@/lib/types";

export default function AnomalyCard({ summary }: { summary: AnomalySummary }) {
  const { isAnomaly, summary: summaryText, recommendation } = summary;

  return (
    <Card className={`glass-card border-2 ${isAnomaly ? 'border-destructive/50' : 'border-primary/50'}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-headline">
          <Zap className="w-6 h-6" />
          AI Anomaly Detection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-4">
          {isAnomaly ? (
            <ShieldAlert className="w-8 h-8 text-destructive mt-1" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-primary mt-1" />
          )}
          <div>
            <p className={`text-lg font-bold ${isAnomaly ? 'text-destructive' : 'text-primary'}`}>
              {isAnomaly ? 'Potential Anomaly Detected' : 'No Anomalies Detected'}
            </p>
            <p className="text-muted-foreground">{summaryText}</p>
          </div>
        </div>
        {recommendation && (
            <div>
                <h4 className="font-semibold mb-2">Recommendation:</h4>
                <p className="text-sm text-muted-foreground">{recommendation}</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
