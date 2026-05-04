import { useState } from "react";
import { CameraFeed, PerformanceMode } from "@/components/camera/CameraFeed";
import { useGetAnalyticsSummary, useListAlerts, useCreateAlert, useGetSettings, getGetAnalyticsSummaryQueryKey, getListAlertsQueryKey, getGetSettingsQueryKey } from "@workspace/api-client-react";
import { AlertCircle, Activity, Cpu, CheckCircle, Video, Bell, BarChart2, Settings2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { playAlertBeep } from "@/lib/audio";

type Tab = "camera" | "alerts" | "stats" | "controls";

export function Dashboard() {
  const [mode, setMode] = useState<PerformanceMode>("balanced");
  const [count, setCount] = useState(0);
  const [anomaly, setAnomaly] = useState(false);
  const [tab, setTab] = useState<Tab>("camera");

  const { data: summary } = useGetAnalyticsSummary({ query: { refetchInterval: 8000, queryKey: getGetAnalyticsSummaryQueryKey() } });
  const { data: alertsData } = useListAlerts({ limit: 20 }, { query: { refetchInterval: 5000, queryKey: getListAlertsQueryKey({ limit: 20 }) } });
  const { data: settings } = useGetSettings({ query: { queryKey: getGetSettingsQueryKey() } });
  const createAlert = useCreateAlert();

  const handleAlert = () => {
    playAlertBeep();
    createAlert.mutate({
      data: { severity: "high", message: "Manual operator alert from command center.", personCount: count, cameraId: "CAM-01", location: "Main Quad" }
    });
  };

  const densityColor = (d?: string) =>
    d === "critical" || d === "high" ? "text-red-400" : d === "medium" ? "text-yellow-400" : "text-green-400";

  const severityBorder = (s: string) =>
    s === "high" ? "border-red-500/60 bg-red-950/30" :
      s === "medium" ? "border-yellow-500/50 bg-yellow-950/20" :
        "border-cyan-500/30 bg-black/40";

  const severityText = (s: string) =>
    s === "high" ? "text-red-400" : s === "medium" ? "text-yellow-400" : "text-cyan-400";

  return (
    <div className="flex flex-col h-full">

      {/* ── Desktop layout (md+) ─────────────────────────────────── */}
      <div className="hidden md:grid md:grid-cols-12 gap-4 flex-1 overflow-hidden">

        {/* Left: Alerts */}
        <div className="col-span-3 flex flex-col gap-3 overflow-hidden">
          <AlertsPanel alerts={alertsData?.alerts ?? []} severityBorder={severityBorder} severityText={severityText} />
          <button data-testid="button-manual-alert" onClick={handleAlert} disabled={createAlert.isPending}
            className="w-full py-2.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/50 rounded-lg font-mono text-xs tracking-widest uppercase transition-colors disabled:opacity-40 shrink-0">
            {createAlert.isPending ? "SENDING..." : "TRIGGER ALERT"}
          </button>
        </div>

        {/* Center: Camera */}
        <div className="col-span-6 flex flex-col gap-3">
          <PerfBar mode={mode} setMode={setMode} />
          <div className="flex-1">
            <CameraFeed 
              performanceMode={mode} 
              onDetect={(c) => { setCount(c); setAnomaly(c >= (settings?.densityThreshold ?? 5)); }} 
              anomalyDetected={anomaly} 
              enableBackendVerify={true}
              enableAutoAlerts={true}
              alertPersonThreshold={Math.max(1, (settings?.densityThreshold ?? 5) - 2)}
            />
          </div>
        </div>

        {/* Right: Stats */}
        <div className="col-span-3 flex flex-col gap-3">
          <StatsPanel count={count} summary={summary} densityColor={densityColor} />
        </div>
      </div>

      {/* ── Mobile layout (<md): tab content ───────────────────── */}
      <div className="flex md:hidden flex-col flex-1 overflow-hidden pb-16">
        <AnimatePresence mode="wait">
          <motion.div key={tab} className="flex-1 overflow-y-auto pb-6"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}>

            {tab === "camera" && (
              <div className="flex flex-col gap-3 p-1">
                <CameraFeed 
                  performanceMode={mode} 
                  onDetect={(c) => { setCount(c); setAnomaly(c >= (settings?.densityThreshold ?? 5)); }} 
                  anomalyDetected={anomaly} 
                  enableBackendVerify={true}
                  enableAutoAlerts={true}
                  alertPersonThreshold={Math.max(1, (settings?.densityThreshold ?? 5) - 2)}
                />
                {/* Quick stats under camera */}
                <div className="grid grid-cols-3 gap-2">
                  <StatCard label="LIVE COUNT" value={count} color="text-cyan-400" />
                  <StatCard label="PEAK" value={summary?.peakPersonCount ?? 0} color="text-green-400" />
                  <StatCard label="ALERTS" value={summary?.alertsToday ?? 0} color="text-yellow-400" />
                </div>
                <div className={`rounded-lg p-2 border text-center font-mono text-xs ${densityColor(summary?.averageCrowdDensity)}`}
                  style={{ borderColor: "rgba(0,255,255,0.2)" }}>
                  CROWD DENSITY: <strong>{(summary?.averageCrowdDensity ?? "LOW").toUpperCase()}</strong>
                </div>
              </div>
            )}

            {tab === "alerts" && (
              <div className="flex flex-col gap-3 p-1">
                <AlertsPanel alerts={alertsData?.alerts ?? []} severityBorder={severityBorder} severityText={severityText} />
                <button data-testid="button-manual-alert-mobile" onClick={handleAlert} disabled={createAlert.isPending}
                  className="w-full py-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-500/50 rounded-xl font-mono text-sm tracking-widest uppercase transition-colors disabled:opacity-40">
                  {createAlert.isPending ? "SENDING..." : "TRIGGER MANUAL ALERT"}
                </button>
              </div>
            )}

            {tab === "stats" && (
              <div className="flex flex-col gap-3 p-1">
                <StatsPanel count={count} summary={summary} densityColor={densityColor} />
              </div>
            )}

            {tab === "controls" && (
              <div className="flex flex-col gap-3 p-1">
                <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4">
                  <p className="text-cyan-400 font-mono text-xs mb-3 flex items-center gap-2">
                    <Cpu className="w-4 h-4" /> PERFORMANCE MODE
                  </p>
                  <div className="flex flex-col gap-2">
                    {(["eco", "balanced", "turbo"] as const).map(m => (
                      <button key={m} data-testid={`button-mode-${m}`} onClick={() => setMode(m)}
                        className={`w-full py-3 rounded-lg font-mono text-sm uppercase tracking-widest border transition-all ${mode === m
                          ? m === "eco" ? "bg-green-900/40 border-green-500 text-green-400 shadow-[0_0_12px_rgba(0,255,0,0.2)]"
                            : m === "turbo" ? "bg-red-900/40 border-red-500 text-red-400 shadow-[0_0_12px_rgba(255,0,0,0.2)]"
                              : "bg-yellow-900/30 border-yellow-500 text-yellow-400 shadow-[0_0_12px_rgba(255,200,0,0.2)]"
                          : "bg-black/40 border-gray-700 text-gray-400"
                          }`}>
                        {m === "eco" ? "ECO - Battery Saver" : m === "balanced" ? "BALANCED - Recommended" : "TURBO - Max Performance"}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-mono text-gray-400">
                    <div className="bg-black/40 rounded p-2 border border-gray-700/50">
                      <div className="text-gray-500 text-[10px] mb-1">RESOLUTION</div>
                      <div className="text-cyan-400">
                        {mode === "eco" ? "320×240" : mode === "balanced" ? "640×480" : "1280×720"}
                      </div>
                    </div>
                    <div className="bg-black/40 rounded p-2 border border-gray-700/50">
                      <div className="text-gray-500 text-[10px] mb-1">FRAME SKIP</div>
                      <div className="text-cyan-400">
                        {mode === "eco" ? "Every 5th" : mode === "balanced" ? "Every 3rd" : "Every frame"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* System info */}
                <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4">
                  <p className="text-cyan-400 font-mono text-xs mb-3">SYSTEM INFO</p>
                  <div className="space-y-2 text-sm font-mono">
                    {[
                      ["UPTIME", summary?.systemUptime ?? "--"],
                      ["TOTAL ALERTS", String(summary?.totalAlerts ?? 0)],
                      ["ANOMALIES", String(summary?.anomaliesDetected ?? 0)],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between border-b border-gray-800 pb-2">
                        <span className="text-gray-400 text-xs">{label}</span>
                        <span className="text-cyan-400 text-xs">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Mobile Bottom Nav ────────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden shrink-0 border-t border-cyan-500/20 bg-black/90 backdrop-blur-xl">
        {([
          { id: "camera" as Tab, icon: Video, label: "Camera", badge: undefined as number | undefined },
          { id: "alerts" as Tab, icon: Bell, label: "Alerts", badge: (alertsData?.alerts || []).filter(a => a.severity === "high").length },
          { id: "stats" as Tab, icon: Activity, label: "Stats", badge: undefined as number | undefined },
          { id: "controls" as Tab, icon: Settings2, label: "Controls", badge: undefined as number | undefined },
        ]).map(({ id, icon: Icon, label, badge }) => (
          <button key={id} data-testid={`tab-${id}`} onClick={() => setTab(id as Tab)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors relative ${tab === id ? "text-cyan-400" : "text-gray-500"
              }`}>
            <div className="relative">
              <Icon className="w-5 h-5" />
              {badge ? (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </div>
            <span className="text-[10px] font-mono">{label}</span>
            {tab === id && <div className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-cyan-400 rounded-full" />}
          </button>
        ))}
      </nav>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="rounded-lg border border-cyan-500/20 bg-black/60 p-3 text-center">
      <div className="text-gray-500 font-mono text-[10px] mb-1">{label}</div>
      <div className={`font-mono font-bold text-2xl ${color}`}>{value}</div>
    </div>
  );
}

function PerfBar({ mode, setMode }: { mode: PerformanceMode; setMode: (m: PerformanceMode) => void }) {
  return (
    <div className="flex items-center justify-between bg-black/60 border border-cyan-500/20 rounded-lg px-3 py-2 shrink-0">
      <span className="text-gray-400 font-mono text-xs flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5" /> PERFORMANCE
      </span>
      <div className="flex gap-1.5">
        {(["eco", "balanced", "turbo"] as const).map(m => (
          <button key={m} data-testid={`button-mode-${m}`} onClick={() => setMode(m)}
            className={`px-3 py-1 rounded text-xs font-mono uppercase tracking-wider border transition-all ${mode === m
              ? m === "eco" ? "bg-green-900/40 border-green-500 text-green-400"
                : m === "turbo" ? "bg-red-900/40 border-red-500 text-red-400"
                  : "bg-yellow-900/30 border-yellow-500 text-yellow-400"
              : "bg-black/40 border-gray-700 text-gray-500 hover:text-gray-300"
              }`}>
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

function AlertsPanel({ alerts, severityBorder, severityText }: {
  alerts: any[];
  severityBorder: (s: string) => string;
  severityText: (s: string) => string;
}) {
  return (
    <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs shrink-0 mb-1">
        <AlertCircle className="w-4 h-4" /> LIVE ALERTS
        <span className="ml-auto text-gray-500">{alerts.length} total</span>
      </div>
      {alerts.length === 0 && (
        <div className="flex-1 flex items-center justify-center text-gray-600 font-mono text-sm py-8">
          NO ACTIVE ALERTS
        </div>
      )}
      {alerts.map(a => (
        <motion.div key={a.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className={`rounded-lg border p-3 flex flex-col gap-1.5 ${severityBorder(a.severity)}`}>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-mono font-bold uppercase ${severityText(a.severity)}`}>
              {a.severity} severity
            </span>
            <span className="text-[10px] text-gray-500 font-mono">
              {format(new Date(a.createdAt), "HH:mm:ss")}
            </span>
          </div>
          <p className="text-gray-200 text-xs leading-relaxed">{a.message}</p>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-mono">CAM: {a.cameraId ?? "?"}</span>
            {a.twilioSent && (
              <span className="flex items-center gap-1 text-[10px] bg-cyan-900/30 text-cyan-400 px-1.5 py-0.5 rounded font-mono">
                <CheckCircle className="w-2.5 h-2.5" /> SMS SENT
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function StatsPanel({ count, summary, densityColor }: { count: number; summary: any; densityColor: (d?: string) => string }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
        <Activity className="w-4 h-4" /> AI ANALYTICS
      </div>
      <div className="grid grid-cols-2 gap-2">
        <StatCard label="LIVE COUNT" value={count} color="text-cyan-400" />
        <StatCard label="PEAK COUNT" value={summary?.peakPersonCount ?? 0} color="text-green-400" />
        <StatCard label="ALERTS TODAY" value={summary?.alertsToday ?? 0} color="text-yellow-400" />
        <StatCard label="ANOMALIES" value={summary?.anomaliesDetected ?? 0} color="text-red-400" />
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4 space-y-3">
        {[
          ["UPTIME", summary?.systemUptime ?? "--"],
          ["TOTAL ALERTS", String(summary?.totalAlerts ?? 0)],
          ["CROWD DENSITY", (summary?.averageCrowdDensity ?? "low").toUpperCase()],
        ].map(([label, val]) => (
          <div key={label} className="flex justify-between border-b border-gray-800 pb-2 last:border-0 last:pb-0">
            <span className="text-gray-400 font-mono text-xs">{label}</span>
            <span className={`font-mono text-xs font-bold ${label === "CROWD DENSITY" ? densityColor(summary?.averageCrowdDensity) : "text-cyan-400"}`}>
              {val}
            </span>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-black/60 p-4">
        <p className="text-cyan-400 font-mono text-xs mb-3">SEVERITY BREAKDOWN</p>
        {(["high", "medium", "low"] as const).map(s => {
          const val = summary?.alertsBySeverity?.[s] ?? 0;
          const total = (summary?.totalAlerts ?? 1) || 1;
          const pct = Math.round((val / total) * 100);
          return (
            <div key={s} className="mb-2">
              <div className="flex justify-between text-xs font-mono mb-1">
                <span className={s === "high" ? "text-red-400" : s === "medium" ? "text-yellow-400" : "text-cyan-400"}>
                  {s.toUpperCase()}
                </span>
                <span className="text-gray-400">{val}</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-1.5">
                <div className={`h-1.5 rounded-full transition-all ${s === "high" ? "bg-red-500" : s === "medium" ? "bg-yellow-500" : "bg-cyan-500"}`}
                  style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

