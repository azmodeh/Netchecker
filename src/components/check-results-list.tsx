
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, XCircle, Clock, Wifi } from 'lucide-react';
import type { CheckNodeResult } from "@/lib/types";
import Image from "next/image";

export default function CheckResultsList({ results }: { results: CheckNodeResult[] }) {
  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Wifi className="text-accent"/>
          Global Check Nodes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {results.map(result => (
            <li key={result.node} className="flex items-center justify-between p-3 bg-card/50 rounded-lg transition-colors hover:bg-card/80">
              <div className="flex items-center gap-3">
                 {result.nodeInfo.countryCode && (
                  <Image 
                    src={`https://flagcdn.com/w20/${result.nodeInfo.countryCode.toLowerCase()}.png`}
                    alt={`${result.nodeInfo.name} flag`}
                    width={20}
                    height={15}
                    className="rounded-sm"
                  />
                 )}
                <div>
                  <p className="font-medium">{result.nodeInfo.name}</p>
                  <p className="text-xs text-muted-foreground">{result.node}</p>
                </div>
              </div>

               <div className="flex items-center gap-4">
                {result.status === 'success' ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-destructive shrink-0" />
                  )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono w-[80px]">
                  <Clock className="w-4 h-4" />
                  <span>{result.latency}ms</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

