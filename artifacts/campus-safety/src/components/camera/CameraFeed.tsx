import { useEffect, useRef, useState, useCallback } from "react";
import { useAnalyzeFrame, useCreateAlert, useLogDetection } from "@workspace/api-client-react";
import { playAlertBeep } from "@/lib/audio";
import { Camera, AlertCircle, RefreshCw, Download, Scan, EyeOff, Maximize2 } from "lucide-react";

export type PerformanceMode = "eco" | "balanced" | "turbo";

interface CameraFeedProps {
  performanceMode: PerformanceMode;
  onDetect: (count: number) => void;
  anomalyDetected: boolean;
  /** Minimum persons (client-side) before calling backend verify — from saved settings */
  alertPersonThreshold?: number;
  /** When signed in: create alert + SMS (if configured) on server anomaly — throttled */
  enableAutoAlerts?: boolean;
  /** When true, calls `/api/detect` (requires signed-in session). Guests: local AI only */
  enableBackendVerify?: boolean;
}

const AUTO_ALERT_COOLDOWN_MS = 60_000;

const PERFORMANCE_CONFIG = {
  eco:      { skipFrames: 5, width: 320,  height: 240 },
  balanced: { skipFrames: 3, width: 640,  height: 480 },
  turbo:    { skipFrames: 1, width: 1280, height: 720 },
};

export function CameraFeed({
  performanceMode,
  onDetect,
  anomalyDetected,
  alertPersonThreshold = 10,
  enableAutoAlerts = false,
  enableBackendVerify = false,
}: CameraFeedProps) {
  const videoRef    = useRef<HTMLVideoElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const modelRef    = useRef<any>(null);
  const rafRef      = useRef<number>(0);
  const frameCount  = useRef(0);
  const fpsFrames   = useRef(0);
  const lastFpsTime = useRef(performance.now());

  const [permission,   setPermission]   = useState<boolean | null>(null);
  const [modelLoaded,  setModelLoaded]  = useState(false);
  const [modelError,   setModelError]   = useState(false);
  const [fps,          setFps]          = useState(0);
  const [showBboxes,   setShowBboxes]   = useState(true);
  const [isVerifying,  setIsVerifying]  = useState(false);
  const [fullscreen,   setFullscreen]   = useState(false);

  const analyzeMutation = useAnalyzeFrame();
  const createAlert = useCreateAlert();
  const logDetection = useLogDetection();
  const lastAutoAlertAt = useRef(0);
  const lastLogAt = useRef(0);

  // ── Camera setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    let stream: MediaStream | null = null;
    const cfg = PERFORMANCE_CONFIG[performanceMode];

    navigator.mediaDevices
      .getUserMedia({ video: { width: cfg.width, height: cfg.height, facingMode: "environment" } })
      .then((s) => {
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.play().catch(() => {});
        }
        setPermission(true);
      })
      .catch(() => setPermission(false));

    return () => { stream?.getTracks().forEach((t) => t.stop()); };
  }, [performanceMode]);

  // ── Model load ─────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const tf = await import("@tensorflow/tfjs");
        await tf.ready();
        const cocoSsd = await import("@tensorflow-models/coco-ssd");
        const m = await cocoSsd.load({ base: "lite_mobilenet_v2" });
        if (!cancelled) { modelRef.current = m; setModelLoaded(true); }
      } catch { if (!cancelled) setModelError(true); }
    })();
    return () => { cancelled = true; };
  }, []);

  // ── Capture helper ─────────────────────────────────────────────────────────
  const captureFrame = useCallback(() => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return null;
    const c = document.createElement("canvas");
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d")?.drawImage(v, 0, 0);
    return c.toDataURL("image/jpeg", 0.7);
  }, []);

  // ── Detection loop ─────────────────────────────────────────────────────────
  const detect = useCallback(async () => {
    const video  = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !modelRef.current) { rafRef.current = requestAnimationFrame(detect); return; }
    if (video.readyState < 2) { rafRef.current = requestAnimationFrame(detect); return; }

    // Sync canvas size to video intrinsic size
    if (canvas.width !== video.videoWidth)  canvas.width  = video.videoWidth;
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    if (!ctx) { rafRef.current = requestAnimationFrame(detect); return; }

    // FPS counter
    fpsFrames.current++;
    const now = performance.now();
    if (now - lastFpsTime.current >= 1000) {
      setFps(fpsFrames.current);
      fpsFrames.current = 0;
      lastFpsTime.current = now;
    }

    // Frame skip
    frameCount.current++;
    const skip = PERFORMANCE_CONFIG[performanceMode].skipFrames;
    if (frameCount.current % skip === 0) {
      try {
        const preds  = await modelRef.current.detect(video);
        const people = preds.filter((p: any) => p.class === "person");
        onDetect(people.length);

        const currentNow = Date.now();
        if (currentNow - lastLogAt.current >= 10000) {
          lastLogAt.current = currentNow;
          logDetection.mutate({
            data: { personCount: people.length, cameraId: "CAM-01", performanceMode }
          }).catch(() => {}); // fire and forget
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (showBboxes) {
          people.forEach((p: any) => {
            const [x, y, w, h] = p.bbox;
            const color = anomalyDetected ? "#ff3333" : "#00ffff";
            ctx.strokeStyle = color;
            ctx.lineWidth   = 2;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = anomalyDetected ? "rgba(255,51,51,0.12)" : "rgba(0,255,255,0.08)";
            ctx.fillRect(x, y, w, h);
            ctx.fillStyle = color;
            ctx.font = "bold 11px monospace";
            ctx.fillText(`PERSON ${Math.round(p.score * 100)}%`, x + 2, y > 16 ? y - 4 : y + 14);
          });
        }

        if (
          enableBackendVerify &&
          (people.length >= alertPersonThreshold || anomalyDetected) &&
          !isVerifying &&
          !analyzeMutation.isPending
        ) {
          const frame = captureFrame();
          if (frame) {
            setIsVerifying(true);
            analyzeMutation.mutate(
              {
                data: {
                  imageBase64: frame.split(",")[1],
                  cameraId: "CAM-01",
                  clientPersonCount: people.length,
                },
              },
              {
                onSuccess: (result) => {
                  if (!enableAutoAlerts || !result.anomalyDetected) return;
                  const now = Date.now();
                  if (now - lastAutoAlertAt.current < AUTO_ALERT_COOLDOWN_MS) return;
                  lastAutoAlertAt.current = now;
                  playAlertBeep();
                  createAlert.mutate({
                    data: {
                      severity: "high",
                      message: `Automated alert: crowd threshold exceeded (${result.personCount} persons).`,
                      personCount: result.personCount,
                      cameraId: "CAM-01",
                      location: "Live monitoring",
                    },
                  });
                },
                onSettled: () => setIsVerifying(false),
              },
            );
          }
        }
      } catch {}
    }
    rafRef.current = requestAnimationFrame(detect);
  }, [
    performanceMode,
    showBboxes,
    anomalyDetected,
    isVerifying,
    captureFrame,
    analyzeMutation,
    createAlert,
    logDetection,
    onDetect,
    alertPersonThreshold,
    enableAutoAlerts,
    enableBackendVerify,
  ]);

  useEffect(() => {
    if (modelLoaded && permission) {
      rafRef.current = requestAnimationFrame(detect);
    }
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [modelLoaded, permission, detect]);

  const handleDownload = () => {
    const url = captureFrame();
    if (!url) return;
    const a = document.createElement("a");
    a.href = url; a.download = `capture-${Date.now()}.jpg`; a.click();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(() => {});
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  // ── Permission denied ──────────────────────────────────────────────────────
  if (permission === false) {
    return (
      <div className="w-full h-full min-h-[240px] flex flex-col items-center justify-center gap-3 bg-black/80 rounded-xl border border-red-500/40 text-center p-6">
        <AlertCircle className="w-10 h-10 text-red-400 animate-pulse" />
        <p className="text-red-400 font-mono font-bold text-sm">CAMERA ACCESS DENIED</p>
        <p className="text-gray-400 font-mono text-xs max-w-xs">
          Allow camera permission in your browser settings, then refresh the page.
        </p>
      </div>
    );
  }

  // ── Main feed ──────────────────────────────────────────────────────────────
  return (
    <div
      ref={wrapperRef}
      className={`relative w-full bg-black rounded-xl overflow-hidden border ${
        anomalyDetected ? "border-red-500 shadow-[0_0_20px_rgba(255,0,0,0.3)]" : "border-cyan-500/30"
      }`}
    >
      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${modelLoaded ? "bg-cyan-400 animate-pulse" : "bg-gray-500"}`} />
          <span className="text-cyan-400 font-mono text-xs">
            {modelLoaded ? "AI ACTIVE" : modelError ? "MODEL ERROR" : "LOADING..."}
          </span>
          {isVerifying && (
            <span className="flex items-center gap-1 text-yellow-400 font-mono text-xs">
              <RefreshCw className="w-3 h-3 animate-spin" /> VERIFYING
            </span>
          )}
        </div>
        <span className="text-cyan-400 font-mono text-xs bg-black/60 px-2 py-0.5 rounded">
          {fps} FPS
        </span>
      </div>

      {/* Video + Canvas overlay */}
      <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="absolute inset-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />

        {/* Loading state overlay */}
        {permission === null && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/90">
            <Camera className="w-8 h-8 text-cyan-400 animate-pulse" />
            <span className="text-cyan-400 font-mono text-sm">INITIALIZING CAMERA...</span>
          </div>
        )}

        {/* Crosshair overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 border border-cyan-400/30" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400" />
          <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400" />
        </div>

        {/* Anomaly flash */}
        {anomalyDetected && (
          <div className="absolute inset-0 border-4 border-red-500 animate-pulse pointer-events-none rounded-xl" />
        )}
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-t from-black/80 to-transparent">
        <span className="text-gray-400 font-mono text-xs uppercase">{performanceMode} mode</span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBboxes(!showBboxes)}
            className="p-1.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            data-testid="btn-toggle-boxes"
            title="Toggle bounding boxes"
          >
            {showBboxes ? <Scan className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            data-testid="btn-capture"
            title="Download screenshot"
          >
            <Download className="w-4 h-4" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20 transition-colors"
            data-testid="btn-fullscreen"
            title="Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
