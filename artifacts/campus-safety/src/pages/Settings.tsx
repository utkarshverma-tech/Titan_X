import React, { useEffect, useState } from "react";
import { SciFiPanel } from "@/components/ui/SciFiPanel";
import { Settings as SettingsIcon, Save, Database, Bell, Key, Sliders, Server } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  useGetSettings,
  useUpdateSettings,
  getGetSettingsQueryKey,
  type UpdateSettingsBody,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/auth/auth-context";

export function Settings() {
  const { user, isAuthLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: remote, isLoading, isError } = useGetSettings({
    query: { enabled: !!user, queryKey: getGetSettingsQueryKey(), staleTime: 30_000 },
  });
  const updateSettings = useUpdateSettings({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: getGetSettingsQueryKey() });
        toast({ title: "CONFIGURATION SAVED", description: "Settings stored in the database." });
      },
      onError: (e: unknown) => {
        const message = e instanceof Error ? e.message : "Could not update settings.";
        toast({ title: "SAVE FAILED", description: message, variant: "destructive" });
      },
    },
  });

  const [formData, setFormData] = useState({
    twilioAccountSid: "",
    twilioAuthToken: "",
    twilioFromNumber: "",
    twilioToNumber: "",
    twilioEnabled: false,
    densityThreshold: 5,
    anomalySensitivity: 80,
  });

  useEffect(() => {
    if (!remote) return;
    setFormData({
      twilioAccountSid: remote.twilioAccountSid ?? "",
      twilioAuthToken: "",
      twilioFromNumber: remote.twilioFromNumber ?? "",
      twilioToNumber: remote.twilioToNumber ?? "",
      twilioEnabled: remote.twilioEnabled,
      densityThreshold: remote.densityThreshold,
      anomalySensitivity: remote.anomalySensitivity,
    });
  }, [remote]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : name === "densityThreshold" || name === "anomalySensitivity"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const body: UpdateSettingsBody = {
      twilioAccountSid: formData.twilioAccountSid || null,
      twilioFromNumber: formData.twilioFromNumber || null,
      twilioToNumber: formData.twilioToNumber || null,
      twilioEnabled: formData.twilioEnabled,
      densityThreshold: formData.densityThreshold,
      anomalySensitivity: formData.anomalySensitivity,
    };
    if (formData.twilioAuthToken.trim().length > 0) {
      body.twilioAuthToken = formData.twilioAuthToken;
    }
    updateSettings.mutate({ data: body });
  };

  const tokenConfigured = Boolean(remote?.twilioAuthToken && remote.twilioAuthToken.includes("•"));

  if (!isAuthLoading && !user) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-mono text-yellow-200 text-sm max-w-md">
          Sign in to manage <strong>your</strong> Twilio account, alert thresholds, and phone number — each user has
          separate settings.
        </p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-lg border border-cyan-500/50 bg-cyan-500/10 text-cyan-400 font-mono text-sm uppercase"
        >
          Sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-4">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="font-mono text-2xl font-bold text-primary tracking-widest flex items-center gap-2">
            <SettingsIcon className="w-6 h-6" />
            SYSTEM CONFIGURATION
          </h2>
          <p className="text-muted-foreground font-mono text-sm">
            Saved per account — your Twilio and thresholds apply only when you are signed in.
          </p>
        </div>
      </div>

      {isError && (
        <div className="rounded-lg border border-red-500/40 bg-red-950/30 px-4 py-3 font-mono text-sm text-red-300">
          Could not load settings. Is the API running and reachable?
        </div>
      )}

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <SciFiPanel title="DATABASE (SERVER)" titleIcon={<Database className="w-4 h-4" />}>
              <div className="p-2 space-y-3">
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  Postgres / Neon connection uses <strong className="text-primary">DATABASE_URL</strong> on the{" "}
                  <strong>API server</strong> (your <code className="text-cyan-400">.env</code> or hosting dashboard).
                  Changing it from the browser would be unsafe; configure it where you deploy the backend, then restart
                  the API.
                </p>
              </div>
            </SciFiPanel>

            <SciFiPanel title="AI DETECTION THRESHOLDS" titleIcon={<Sliders className="w-4 h-4" />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Crowd density alert baseline (persons)
                    </label>
                    <span className="text-primary font-mono text-sm">{formData.densityThreshold} PERSONS</span>
                  </div>
                  <input
                    type="range"
                    name="densityThreshold"
                    min={1}
                    max={20}
                    value={formData.densityThreshold}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full accent-primary"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    Used with sensitivity below for anomaly alerts and crowd density bands on the server.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Anomaly sensitivity
                    </label>
                    <span className="text-chart-3 font-mono text-sm">{formData.anomalySensitivity}%</span>
                  </div>
                  <input
                    type="range"
                    name="anomalySensitivity"
                    min={1}
                    max={100}
                    value={formData.anomalySensitivity}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full accent-chart-3"
                  />
                  <p className="text-xs text-muted-foreground font-mono">
                    Higher = flags anomalies at lower head-count (relative to baseline).
                  </p>
                </div>
              </div>
            </SciFiPanel>

            <SciFiPanel
              title="TWILIO SMS ALERTS"
              titleIcon={<Bell className="w-4 h-4" />}
              glowColor={formData.twilioEnabled ? "primary" : "none"}
            >
              <div className="p-2 space-y-6">
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="twilioEnabled"
                      checked={formData.twilioEnabled}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-black/50 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-muted-foreground after:border-muted-foreground after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-primary/30"></div>
                  </label>
                  <span className="text-sm font-mono text-primary uppercase tracking-wider">
                    Send SMS when an alert is created
                  </span>
                </div>

                <div
                  className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-opacity duration-300 ${
                    formData.twilioEnabled ? "opacity-100" : "opacity-50 pointer-events-none"
                  }`}
                >
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Server className="w-3 h-3" /> Account SID
                    </label>
                    <input
                      type="text"
                      name="twilioAccountSid"
                      value={formData.twilioAccountSid}
                      onChange={handleChange}
                      autoComplete="off"
                      className="w-full bg-black/50 border border-primary/30 rounded px-3 py-2 text-primary font-mono text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Key className="w-3 h-3" /> Auth token
                    </label>
                    <input
                      type="password"
                      name="twilioAuthToken"
                      value={formData.twilioAuthToken}
                      onChange={handleChange}
                      placeholder={tokenConfigured ? "Leave blank to keep existing" : "Your Twilio auth token"}
                      autoComplete="new-password"
                      className="w-full bg-black/50 border border-primary/30 rounded px-3 py-2 text-primary font-mono text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      From number (Twilio)
                    </label>
                    <input
                      type="text"
                      name="twilioFromNumber"
                      value={formData.twilioFromNumber}
                      onChange={handleChange}
                      placeholder="+15551234567"
                      className="w-full bg-black/50 border border-primary/30 rounded px-3 py-2 text-primary font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                      Alert destination (your phone)
                    </label>
                    <input
                      type="text"
                      name="twilioToNumber"
                      value={formData.twilioToNumber}
                      onChange={handleChange}
                      placeholder="+9198..."
                      className="w-full bg-black/50 border border-primary/30 rounded px-3 py-2 text-primary font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            </SciFiPanel>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading || updateSettings.isPending}
                className="flex items-center gap-2 px-6 py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded font-mono text-sm tracking-wider uppercase transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {updateSettings.isPending ? "SAVING..." : "SAVE CONFIGURATION"}
              </button>
            </div>
          </form>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <SciFiPanel title="SYSTEM INFO" className="h-full">
            <div className="space-y-4 p-2 font-mono text-sm">
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-3">
                <span className="text-muted-foreground text-xs">KERNEL</span>
                <span className="text-primary">Titan X stack</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-3">
                <span className="text-muted-foreground text-xs">AI MODEL</span>
                <span className="text-primary">COCO-SSD Lite MobileNet V2</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-primary/20 pb-3">
                <span className="text-muted-foreground text-xs">SETTINGS STORE</span>
                <span className="text-primary">{isLoading ? "Loading…" : isError ? "Unavailable" : "PostgreSQL (Neon)"}</span>
              </div>
            </div>
          </SciFiPanel>
        </div>
      </div>
    </div>
  );
}
