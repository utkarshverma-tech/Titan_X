import React from "react";
import { cn } from "@/lib/utils";

interface SciFiPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  glowColor?: "primary" | "accent" | "destructive" | "amber" | "none";
  titleIcon?: React.ReactNode;
  headerAction?: React.ReactNode;
}

export function SciFiPanel({
  children,
  title,
  className,
  glowColor = "none",
  titleIcon,
  headerAction,
  ...props
}: SciFiPanelProps) {
  const glowVariants = {
    none: "border-border/50",
    primary: "border-primary/50 shadow-[0_0_15px_rgba(0,255,255,0.15)]",
    accent: "border-accent/50 shadow-[0_0_15px_rgba(0,255,0,0.15)]",
    destructive: "border-destructive/50 shadow-[0_0_15px_rgba(255,0,0,0.15)]",
    amber: "border-chart-3/50 shadow-[0_0_15px_rgba(255,170,0,0.15)]",
  };

  return (
    <div
      className={cn(
        "relative flex flex-col bg-background/60 backdrop-blur-md rounded-md overflow-hidden border",
        glowVariants[glowColor],
        className
      )}
      {...props}
    >
      {/* Scanline overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] z-0" />

      {title && (
        <div className="flex items-center justify-between px-4 py-2 border-b border-border/30 bg-black/20 z-10">
          <div className="flex items-center gap-2">
            {titleIcon && <span className="text-muted-foreground">{titleIcon}</span>}
            <h3 className="font-mono text-sm font-bold tracking-wider text-muted-foreground">
              {title}
            </h3>
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="flex-1 flex flex-col p-4 relative z-10 overflow-hidden">
        {children}
      </div>
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-primary/50" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-primary/50" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-primary/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-primary/50" />
    </div>
  );
}
