import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from 'lucide-react';
import type { AIAnalysis } from "@/lib/types";

export default function AIAnalysisCard({ analysis }: { analysis?: AIAnalysis }) {
  if (!analysis || !analysis.summary) {
    return null;
  }
  return (
    <Card className="glass-card bg-primary/10 border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 font-display text-primary">
          <Sparkles className="w-6 h-6" />
          AI Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
          {analysis.summary}
        </p>
      </CardContent>
    </Card>
  );
}
