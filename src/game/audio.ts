/** Retro Web Audio bleeps. Unlocked from the first gesture. No sample files. */

export class ArcadeAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private musicBus: GainNode | null = null;
  private sfxBus: GainNode | null = null;
  enabled = true;
  private musicOn = false;
  private motif: number[] = [];
  private step = 0;
  private nextAt = 0;
  private started = false;

  private combatMotif = [220, 0, 220, 330, 196, 0, 196, 294, 247, 0, 247, 370, 220, 262, 0, 0];
  private challengeMotif = [523, 659, 784, 659, 587, 784, 880, 784, 523, 659, 784, 1046, 784, 659, 587, 523];
  private titleMotif = [330, 0, 392, 0, 494, 0, 392, 330, 0, 294, 0, 330, 0, 0, 0, 0];

  unlock() {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      const ctx = new AC({ latencyHint: "interactive" });
      const master = ctx.createGain();
      const music = ctx.createGain();
      const sfx = ctx.createGain();
      master.gain.value = 0.9;
      music.gain.value = 0.45;
      sfx.gain.value = 1;
      music.connect(master);
      sfx.connect(master);
      master.connect(ctx.destination);
      this.ctx = ctx;
      this.master = master;
      this.musicBus = music;
      this.sfxBus = sfx;
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setEnabled(on: boolean) {
    this.enabled = on;
    if (!this.master || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.master.gain.setTargetAtTime(on ? 0.9 : 0, now, 0.02);
  }

  resume() {
    if (this.ctx && this.ctx.state === "suspended") void this.ctx.resume();
  }

  startMusic(kind: "title" | "combat" | "challenge") {
    this.motif = kind === "challenge" ? this.challengeMotif : kind === "title" ? this.titleMotif : this.combatMotif;
    this.step = 0;
    this.musicOn = true;
    this.started = true;
    if (this.ctx) this.nextAt = this.ctx.currentTime;
  }

  stopMusic() {
    this.musicOn = false;
  }

  /** Call once per animation frame so the motif stays on the audio clock. */
  pump() {
    if (!this.musicOn || !this.enabled || !this.ctx || !this.started) return;
    const ctx = this.ctx;
    const beat = 0.15;
    while (this.nextAt < ctx.currentTime + 0.05) {
      const f = this.motif[this.step % this.motif.length] ?? 0;
      if (f > 0) this.tone(f, beat * 0.86, "square", 0.035, this.musicBus);
      this.step++;
      this.nextAt += beat;
    }
  }

  shoot() {
    this.tone(740 + Math.random() * 80, 0.045, "square", 0.06);
  }

  enemyShot() {
    this.tone(180 + Math.random() * 30, 0.07, "square", 0.04);
  }

  explode() {
    this.noise(0.16, 0.12, 900);
    this.tone(140, 0.12, "sawtooth", 0.05);
  }

  playerDie() {
    this.noise(0.35, 0.16, 500);
    this.slide(420, 70, 0.45, "sawtooth", 0.07);
  }

  dive() {
    this.slide(640, 240, 0.18, "square", 0.03);
  }

  capture() {
    this.slide(500, 900, 0.28, "square", 0.05);
    this.slide(700, 200, 0.4, "triangle", 0.04);
  }

  rescue() {
    [523, 659, 784, 1046].forEach((f, i) => {
      const ctx = this.ctx;
      if (!ctx || !this.enabled) return;
      this.tone(f, 0.1, "square", 0.05, this.sfxBus, ctx.currentTime + i * 0.08);
    });
  }

  extra() {
    [784, 988, 1174].forEach((f, i) => {
      const ctx = this.ctx;
      if (!ctx || !this.enabled) return;
      this.tone(f, 0.09, "square", 0.05, this.sfxBus, ctx.currentTime + i * 0.07);
    });
  }

  wave() {
    [392, 523, 659, 784].forEach((f, i) => {
      const ctx = this.ctx;
      if (!ctx || !this.enabled) return;
      this.tone(f, 0.11, "square", 0.05, this.sfxBus, ctx.currentTime + i * 0.09);
    });
  }

  perfect() {
    [523, 659, 784, 1046, 784, 1046].forEach((f, i) => {
      const ctx = this.ctx;
      if (!ctx || !this.enabled) return;
      this.tone(f, 0.12, "square", 0.055, this.sfxBus, ctx.currentTime + i * 0.09);
    });
  }

  gameOver() {
    this.stopMusic();
    [392, 349, 311, 262, 196].forEach((f, i) => {
      const ctx = this.ctx;
      if (!ctx || !this.enabled) return;
      this.tone(f, 0.22, "triangle", 0.06, this.sfxBus, ctx.currentTime + i * 0.16);
    });
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    bus?: GainNode | null,
    when?: number,
  ) {
    if (!this.enabled || !this.ctx || !this.sfxBus) return;
    const ctx = this.ctx;
    const t = when ?? ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, gain), t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(bus ?? this.sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  private slide(from: number, to: number, dur: number, type: OscillatorType, gain: number) {
    if (!this.enabled || !this.ctx || !this.sfxBus) return;
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(from, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(t);
    osc.stop(t + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  private noise(dur: number, gain: number, cutoff: number) {
    if (!this.enabled || !this.ctx || !this.sfxBus) return;
    const ctx = this.ctx;
    const n = Math.floor(ctx.sampleRate * dur);
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < n; i++) {
      const env = 1 - i / n;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.sfxBus);
    src.start();
    src.onended = () => {
      src.disconnect();
      filter.disconnect();
      g.disconnect();
    };
  }

  dispose() {
    this.musicOn = false;
    if (this.ctx) void this.ctx.close();
    this.ctx = null;
  }
}
