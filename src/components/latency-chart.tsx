
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckNodeResult } from "@/lib/types"
import { TrendingUp } from "lucide-react"

const chartConfig = {
  latency: {
    label: "Latency (ms)",
    color: "hsl(var(--primary))",
  },
}

export default function LatencyChart({ results }: { results: CheckNodeResult[] }) {
  const chartData = results.map(r => ({
    name: r.nodeInfo.name.split(',')[0], // Use shorter names for chart
    latency: r.latency,
  }));

  return (
    <Card className="glass-card h-full">
       <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <TrendingUp className="text-accent" />
          Latency Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis 
              dataKey="name" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}ms`}
            />
             <Tooltip
                contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--foreground))',
                    borderRadius: 'var(--radius)',
                    background: 'hsla(var(--background), 0.8)',
                    backdropFilter: 'blur(10px)',
                }}
                cursor={{ fill: 'hsl(var(--primary) / 0.1)' }}
             />
            <Bar dataKey="latency" fill={chartConfig.latency.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
