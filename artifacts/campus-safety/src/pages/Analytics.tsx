import React from "react";
import { Link } from "wouter";
import { SciFiPanel } from "@/components/ui/SciFiPanel";
import { useGetCrowdTrend, useGetAlertFrequency, useGetAnalyticsSummary, getGetCrowdTrendQueryKey, getGetAlertFrequencyQueryKey, getGetAnalyticsSummaryQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@/auth/auth-context";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { Activity, BarChart3, Clock, AlertTriangle, ShieldAlert } from "lucide-react";
import { format } from "date-fns";

export function Analytics() {
  const { user, isAuthLoading } = useAuth();
  const qopts = { enabled: !!user } as const;
  const { data: trendData, isLoading: isLoadingTrend } = useGetCrowdTrend(
    { minutes: 60 },
    { query: { ...qopts, refetchInterval: 10000, queryKey: getGetCrowdTrendQueryKey({ minutes: 60 }) } },
  );
  const { data: freqData, isLoading: isLoadingFreq } = useGetAlertFrequency({
    query: { ...qopts, refetchInterval: 30000, queryKey: getGetAlertFrequencyQueryKey() },
  });
  const { data: summary, isLoading: isLoadingSummary } = useGetAnalyticsSummary({
    query: { ...qopts, refetchInterval: 10000, queryKey: getGetAnalyticsSummaryQueryKey() },
  });

  if (!isAuthLoading && !user) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6">
        <p className="font-mono text-sm text-yellow-200">Sign in to view your analytics.</p>
        <Link href="/login" className="text-cyan-400 font-mono text-sm underline">
          Sign in
        </Link>
      </div>
    );
  }

  const formatTime = (timeStr: string) => {
    try {
      return format(new Date(timeStr), 'HH:mm');
    } catch {
      return timeStr;
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 border border-primary/50 p-3 rounded font-mono text-xs backdrop-blur-md shadow-[0_0_10px_rgba(0,255,255,0.1)]">
          <p className="text-muted-foreground mb-1">{formatTime(label)}</p>
          <p className="text-primary font-bold">
            COUNT: {payload[0].value}
          </p>
          {payload[0].payload.density && (
            <p className={`mt-1 uppercase ${
              payload[0].payload.density === 'high' || payload[0].payload.density === 'critical' ? 'text-destructive' : 'text-accent'
            }`}>
              DENSITY: {payload[0].payload.density}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-mono text-2xl font-bold text-primary tracking-widest flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            SYSTEM ANALYTICS
          </h2>
          <p className="text-muted-foreground font-mono text-sm">Deep dive into surveillance metrics and AI predictions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SciFiPanel className="p-4" glowColor="primary">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 rounded-full text-primary">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Total Alerts</p>
              <h3 className="text-2xl font-mono font-bold text-primary">{isLoadingSummary ? "..." : summary?.totalAlerts || 0}</h3>
            </div>
          </div>
        </SciFiPanel>

        <SciFiPanel className="p-4" glowColor="accent">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/20 rounded-full text-accent">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Peak Count Today</p>
              <h3 className="text-2xl font-mono font-bold text-accent">{isLoadingSummary ? "..." : summary?.peakPersonCount || 0}</h3>
            </div>
          </div>
        </SciFiPanel>

        <SciFiPanel className="p-4" glowColor="amber">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-chart-3/20 rounded-full text-chart-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Anomalies Detected</p>
              <h3 className="text-2xl font-mono font-bold text-chart-3">{isLoadingSummary ? "..." : summary?.anomaliesDetected || 0}</h3>
            </div>
          </div>
        </SciFiPanel>

        <SciFiPanel className="p-4" glowColor="destructive">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-destructive/20 rounded-full text-destructive">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-muted-foreground font-mono text-xs uppercase">Avg Density</p>
              <h3 className="text-2xl font-mono font-bold text-destructive uppercase">{isLoadingSummary ? "..." : summary?.averageCrowdDensity || "N/A"}</h3>
            </div>
          </div>
        </SciFiPanel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-[400px] pb-4">
        <SciFiPanel title="CROWD DENSITY TREND (LAST 60 MIN)" titleIcon={<Activity className="w-4 h-4" />}>
          <div className="w-full h-full min-h-[300px]">
            {isLoadingTrend ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm animate-pulse">
                LOADING TREND DATA...
              </div>
            ) : trendData?.dataPoints && trendData.dataPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="timestamp" 
                    tickFormatter={formatTime} 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="personCount" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCount)" 
                    animationDuration={1000}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                NO TREND DATA AVAILABLE
              </div>
            )}
          </div>
        </SciFiPanel>

        <SciFiPanel title="ALERT FREQUENCY BY HOUR" titleIcon={<BarChart3 className="w-4 h-4" />}>
          <div className="w-full h-full min-h-[300px]">
            {isLoadingFreq ? (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm animate-pulse">
                LOADING FREQUENCY DATA...
              </div>
            ) : freqData?.hourly && freqData.hourly.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={freqData.hourly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis 
                    dataKey="hour" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10} 
                    fontFamily="monospace"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip 
                    cursor={{ fill: 'hsl(var(--primary)/0.1)' }}
                    contentStyle={{ backgroundColor: 'hsl(var(--background)/0.8)', borderColor: 'hsl(var(--primary)/0.5)', fontFamily: 'monospace', fontSize: '12px' }}
                    itemStyle={{ color: 'hsl(var(--chart-3))', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="count" name="Alerts" fill="hsl(var(--chart-3))" radius={[2, 2, 0, 0]} animationDuration={1000} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground font-mono text-sm">
                NO ALERT FREQUENCY DATA
              </div>
            )}
          </div>
        </SciFiPanel>
      </div>
    </div>
  );
}
