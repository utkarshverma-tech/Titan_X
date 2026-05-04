import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import {
  Camera, Settings, AlertTriangle, BarChart3,
  Sun, Moon, Volume2, VolumeX, Shield, Menu, X, LogIn, LogOut,
} from "lucide-react";
import { useHealthCheck, getHealthCheckQueryKey } from "@workspace/api-client-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/auth/auth-context";

const NAV = [
  { href: "/",          label: "Command Center",   icon: Camera },
  { href: "/alerts",    label: "Alert History",    icon: AlertTriangle },
  { href: "/analytics", label: "Analytics",        icon: BarChart3 },
  { href: "/settings",  label: "Configuration",    icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location]                   = useLocation();
  const { user, logout, isAuthLoading } = useAuth();
  const { data: health }             = useHealthCheck({ query: { refetchInterval: 30000, queryKey: getHealthCheckQueryKey() } });
  const [dark,  setDark]             = useState(true);
  const [sound, setSound]            = useState(() => {
    try { return localStorage.getItem("titanx_sound") === "true"; } catch { return false; }
  });
  const [menuOpen, setMenuOpen]      = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    try { localStorage.setItem("titanx_sound", String(sound)); } catch {}
  }, [sound]);

  const online = health?.status === "ok";

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#070d1a] text-white relative overflow-hidden">

      {/* ── Top Header ──────────────────────────────────────────── */}
      <header className="h-14 shrink-0 border-b border-cyan-500/20 bg-black/70 backdrop-blur-md flex items-center justify-between px-4 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <span className="font-mono font-bold text-sm text-cyan-400 tracking-wider">
            TITAN X <span className="text-gray-400 font-light text-xs">MONITOR</span>
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Online status */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs mr-2">
            <span className="text-gray-400">STATUS:</span>
            <span className={`flex items-center gap-1 ${online ? "text-green-400" : "text-red-400"}`}>
              <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${online ? "bg-green-400" : "bg-red-400"}`} />
              {online ? "ONLINE" : "OFFLINE"}
            </span>
          </div>

          {!isAuthLoading && user && (
            <span className="hidden lg:inline max-w-[160px] truncate font-mono text-[10px] text-gray-500" title={user.email}>
              {user.email}
            </span>
          )}
          {!isAuthLoading && user ? (
            <button
              type="button"
              data-testid="button-sign-out"
              onClick={() => void logout()}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10"
            >
              <LogOut className="w-3.5 h-3.5" /> OUT
            </button>
          ) : !isAuthLoading ? (
            <Link href="/login">
              <span className="hidden sm:flex items-center gap-1 px-2 py-1 rounded text-xs font-mono text-cyan-400 hover:bg-cyan-500/10">
                <LogIn className="w-3.5 h-3.5" /> SIGN IN
              </span>
            </Link>
          ) : null}

          <button data-testid="button-toggle-sound" onClick={() => setSound(!sound)}
            className="p-2 rounded text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
            {sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button data-testid="button-toggle-theme" onClick={() => setDark(!dark)}
            className="p-2 rounded text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Hamburger — mobile only */}
          <button data-testid="button-menu" onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ── Mobile slide-down nav ────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden bg-black/90 backdrop-blur-xl border-b border-cyan-500/20 z-20 shrink-0"
          >
            <nav className="flex flex-col py-2 px-4 gap-1">
              {NAV.map(({ href, label, icon: Icon }) => {
                const active = location === href;
                return (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}>
                    <div className={`flex items-center gap-3 px-3 py-3 rounded-lg font-mono text-sm transition-all ${
                      active ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}>
                      <Icon className="w-4 h-4" />
                      {label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body: sidebar + content ──────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-56 shrink-0 border-r border-cyan-500/20 bg-black/50 backdrop-blur-md flex-col py-4 z-10">
          <nav className="flex flex-col gap-1 px-3 flex-1">
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = location === href;
              return (
                <Link key={href} href={href}>
                  <div data-testid={`nav-${href.replace("/", "") || "home"}`}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-xs transition-all cursor-pointer border ${
                      active
                        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[inset_0_0_8px_rgba(0,255,255,0.06)]"
                        : "text-gray-400 border-transparent hover:bg-white/5 hover:text-white"
                    }`}>
                    <Icon className="w-4 h-4" />
                    {label}
                  </div>
                </Link>
              );
            })}
          </nav>
          <div className="px-4 pt-3 border-t border-cyan-500/20">
            <p className="font-mono text-[10px] text-gray-600 leading-relaxed">
              SYS.VERSION: 4.2.9<br />
              ENCRYPTION: AES-256
            </p>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-3 md:p-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
