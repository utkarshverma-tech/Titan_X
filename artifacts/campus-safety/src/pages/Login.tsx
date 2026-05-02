import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Mail, KeyRound } from "lucide-react";
import { SciFiPanel } from "@/components/ui/SciFiPanel";
import { useAuth } from "@/auth/auth-context";
import { useToast } from "@/hooks/use-toast";
import { ApiError } from "@workspace/api-client-react";

export function Login() {
  const [, setLocation] = useLocation();
  const { login, register, user, isAuthLoading } = useAuth();
  const { toast } = useToast();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && user) setLocation("/");
  }, [isAuthLoading, user, setLocation]);

  if (!isAuthLoading && user) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "register") await register(email, password);
      else await login(email, password);
      toast({ title: mode === "register" ? "ACCOUNT CREATED" : "SIGNED IN" });
      setLocation("/");
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? String(err.message)
          : err instanceof Error
            ? err.message
            : "Request failed";
      toast({ title: "AUTH FAILED", description: msg, variant: "destructive" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Shield className="w-12 h-12 text-cyan-400 mx-auto" />
          <h1 className="font-mono text-xl text-cyan-400 tracking-widest">TITAN X ACCESS</h1>
          <p className="text-muted-foreground font-mono text-sm">
            Sign in to use your own Twilio, thresholds, and alerts.
          </p>
        </div>

        <SciFiPanel title={mode === "login" ? "SIGN IN" : "CREATE ACCOUNT"}>
          <form onSubmit={submit} className="p-2 space-y-4">
            <div className="flex rounded-lg border border-primary/30 overflow-hidden font-mono text-xs">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 ${mode === "login" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
              >
                LOGIN
              </button>
              <button
                type="button"
                onClick={() => setMode("register")}
                className={`flex-1 py-2 ${mode === "register" ? "bg-primary/20 text-primary" : "text-muted-foreground"}`}
              >
                REGISTER
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-primary/30 rounded pl-10 pr-3 py-2 text-sm font-mono text-primary"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-muted-foreground uppercase">Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  autoComplete={mode === "register" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-primary/30 rounded pl-10 pr-3 py-2 text-sm font-mono text-primary"
                  required
                  minLength={mode === "register" ? 8 : 1}
                />
              </div>
              {mode === "register" && (
                <p className="text-[10px] text-muted-foreground font-mono">Minimum 8 characters.</p>
              )}
            </div>

            <button
              type="submit"
              disabled={busy || isAuthLoading}
              className="w-full py-3 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 rounded font-mono text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {busy ? "PLEASE WAIT…" : mode === "login" ? "ENTER" : "CREATE & SIGN IN"}
            </button>

            <p className="text-center text-xs text-muted-foreground font-mono">
              <Link href="/" className="text-cyan-400 hover:underline">
                ← Back to Command Center
              </Link>
            </p>
          </form>
        </SciFiPanel>
      </div>
    </div>
  );
}
