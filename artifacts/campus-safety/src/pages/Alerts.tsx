import React, { useState } from "react";
import { SciFiPanel } from "@/components/ui/SciFiPanel";
import { useListAlerts } from "@workspace/api-client-react";
import { AlertTriangle, Filter, Search, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export function Alerts() {
  const [page, setPage] = useState(1);
  const [severityFilter, setSeverityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  const { data: alertsData, isLoading } = useListAlerts(
    {
      page,
      limit: 15,
      ...(severityFilter !== "all" ? { severity: severityFilter as any } : {})
    },
    { query: { keepPreviousData: true } as any }
  );

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-mono text-2xl font-bold text-primary tracking-widest flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            ALERT HISTORY LOG
          </h2>
          <p className="text-muted-foreground font-mono text-sm">System incident and anomaly record</p>
        </div>

        <div className="flex gap-4">
          <div className="flex items-center bg-black/40 border border-primary/20 rounded px-3 py-1.5">
            <Filter className="w-4 h-4 text-muted-foreground mr-2" />
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-transparent border-none text-sm font-mono text-primary focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="all">ALL SEVERITIES</option>
              <option value="high">HIGH ONLY</option>
              <option value="medium">MEDIUM ONLY</option>
              <option value="low">LOW ONLY</option>
            </select>
          </div>
        </div>
      </div>

      <SciFiPanel className="flex-1 flex flex-col" glowColor={severityFilter === 'high' ? 'destructive' : 'primary'}>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm text-left font-mono">
            <thead className="text-xs text-muted-foreground uppercase bg-black/50 sticky top-0 backdrop-blur-md">
              <tr>
                <th className="px-4 py-3 border-b border-primary/20">ID</th>
                <th className="px-4 py-3 border-b border-primary/20">Severity</th>
                <th className="px-4 py-3 border-b border-primary/20">Time</th>
                <th className="px-4 py-3 border-b border-primary/20">Location / Cam</th>
                <th className="px-4 py-3 border-b border-primary/20">Count</th>
                <th className="px-4 py-3 border-b border-primary/20">Message</th>
                <th className="px-4 py-3 border-b border-primary/20 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 10 }).map((_, i) => (
                  <tr key={i} className="border-b border-primary/10 animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-12"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-16"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-20"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-24"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-8"></div></td>
                    <td className="px-4 py-3"><div className="h-4 bg-primary/20 rounded w-48"></div></td>
                    <td className="px-4 py-3 text-right"><div className="h-4 bg-primary/20 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : (!alertsData?.alerts || alertsData.alerts.length === 0) ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    NO RECORDS FOUND MATCHING CRITERIA
                  </td>
                </tr>
              ) : (
                (alertsData?.alerts || []).map((alert) => (
                  <tr key={alert.id} className="border-b border-primary/10 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground">#{alert.id.toString().padStart(5, '0')}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${alert.severity === 'high' ? 'bg-destructive/20 text-destructive border border-destructive/30' :
                        alert.severity === 'medium' ? 'bg-chart-3/20 text-chart-3 border border-chart-3/30' :
                          'bg-primary/20 text-primary border border-primary/30'
                        }`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{format(new Date(alert.createdAt), 'MMM dd, HH:mm:ss')}</td>
                    <td className="px-4 py-3">{alert.location || 'Unknown'} <span className="text-muted-foreground ml-1">({alert.cameraId || 'N/A'})</span></td>
                    <td className="px-4 py-3 text-primary">{alert.personCount}</td>
                    <td className="px-4 py-3">{alert.message}</td>
                    <td className="px-4 py-3 text-right">
                      {alert.twilioSent ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-accent">
                          <CheckCircle className="w-3 h-3" /> SMS LOGGED
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">SYSTEM ONLY</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-primary/20 p-4 bg-black/20 flex items-center justify-between">
          <div className="text-sm font-mono text-muted-foreground">
            {alertsData ? `SHOWING ${(page - 1) * 15 + 1}-${Math.min(page * 15, alertsData.total)} OF ${alertsData.total}` : 'LOADING...'}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-1 border border-primary/30 rounded text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-1 border border-primary/30 rounded bg-black/40 font-mono text-sm text-primary flex items-center">
              PAGE {page} {alertsData && `/ ${alertsData.totalPages}`}
            </div>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={!alertsData || page >= alertsData.totalPages || isLoading}
              className="p-1 border border-primary/30 rounded text-primary hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </SciFiPanel>
    </div>
  );
}
