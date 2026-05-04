export function playAlertBeep() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem("titanx_sound") !== "true") return;

    // Use Web Audio API to play a beep/siren sound without needing mp3 files
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Create an alert "siren" effect (high pitch dropping to lower pitch)
    osc.type = "square";
    osc.frequency.setValueAtTime(880, ctx.currentTime); // Start at 880Hz (A5)
    osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5); // Drop to 440Hz (A4)
    
    // Fade out volume to avoid clicking noise at the end
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
  } catch (e) {
    // Ignore errors (e.g. browser autoplay policies)
  }
}
