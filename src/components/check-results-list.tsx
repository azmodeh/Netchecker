
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Wifi } from 'lucide-react';
import type { CheckNodeResult } from "@/lib/types";

export default function CheckResultsList({ results }: { results: CheckNodeResult[] }) {
  return (
    <Card className="liquid-glass h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Wifi />
          Global Check Nodes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {results.map(result => (
            <li key={result.node} className="flex items-center justify-between p-3 bg-card/50 rounded-lg transition-colors hover:bg-card/80">
              <div className="flex items-center gap-3">
                {result.status === 'success' ? (
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div>
                  <p className="font-medium">{result.nodeInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{result.node}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <Clock className="w-4 h-4" />
                <span>{result.latency}ms</span>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
