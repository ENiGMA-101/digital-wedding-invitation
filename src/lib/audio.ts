/**
 * Tiny dependency-free audio engine.
 *
 * · a soft chime for the "open invitation" transition
 * · a gentle generative ambient score (sitar-ish pad + sparse pentatonic bells)
 *   used when `wedding.musicUrl` is empty, so music always works offline.
 *
 * Everything is created lazily on the first user gesture — browsers require it.
 */

type Ctx = AudioContext & { _unlocked?: boolean };

let ctx: Ctx | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;
let nextNoteAt = 0;
let droneNodes: OscillatorNode[] = [];
let externalAudio: HTMLAudioElement | null = null;

let playing = false;
const listeners = new Set<(on: boolean) => void>();

const SCALE = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33, 659.25, 739.99]; // D major pentatonic-ish

function ensureContext(): Ctx | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC: typeof AudioContext =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      ctx = new AC() as Ctx;
      master = ctx.createGain();
      master.gain.value = 0.9;
      master.connect(ctx.destination);

      musicBus = ctx.createGain();
      musicBus.gain.value = 0;
      musicBus.connect(master);
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** call from a user gesture so iOS/Android allow playback later */
export function unlockAudio(url?: string) {
  if (url) {
    if (!externalAudio) {
      externalAudio = new Audio(url);
      externalAudio.loop = true;
      externalAudio.volume = 0;
    }
    return;
  }
  ensureContext();
}

function bell(at: number, freq: number, gainPeak: number, decay: number) {
  const c = ensureContext();
  if (!c || !musicBus) return;

  const osc = c.createOscillator();
  const osc2 = c.createOscillator();
  const gain = c.createGain();
  const filter = c.createBiquadFilter();

  osc.type = "sine";
  osc.frequency.value = freq;
  osc2.type = "triangle";
  osc2.frequency.value = freq * 2.004;
  osc2.detune.value = 4;

  filter.type = "lowpass";
  filter.frequency.value = 2400;

  gain.gain.setValueAtTime(0.0001, at);
  gain.gain.exponentialRampToValueAtTime(gainPeak, at + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.0001, at + decay);

  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(musicBus);

  osc.start(at);
  osc2.start(at);
  osc.stop(at + decay + 0.1);
  osc2.stop(at + decay + 0.1);
}

function startDrone() {
  const c = ensureContext();
  if (!c || !musicBus || droneNodes.length) return;
  [73.42, 110.0, 146.83].forEach((freq, i) => {
    const osc = c!.createOscillator();
    const gain = c!.createGain();
    const lfo = c!.createOscillator();
    const lfoGain = c!.createGain();

    osc.type = i === 2 ? "triangle" : "sine";
    osc.frequency.value = freq;
    gain.gain.value = i === 2 ? 0.012 : 0.03;

    lfo.frequency.value = 0.05 + i * 0.03;
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(musicBus!);
    osc.start();
    lfo.start();
    droneNodes.push(osc, lfo);
  });
}

function scheduler() {
  const c = ctx;
  if (!c) return;
  while (nextNoteAt < c.currentTime + 1.2) {
    const freq = SCALE[Math.floor(Math.random() * SCALE.length)];
    const octave = Math.random() > 0.72 ? 0.5 : 1;
    bell(nextNoteAt, freq * octave, 0.05 + Math.random() * 0.03, 3.4 + Math.random() * 2);
    if (Math.random() > 0.6) bell(nextNoteAt + 0.42, freq * 1.5, 0.022, 2.6);
    nextNoteAt += 1.9 + Math.random() * 1.6;
  }
}

function emit() {
  listeners.forEach((l) => l(playing));
}

export function subscribe(fn: (on: boolean) => void) {
  listeners.add(fn);
  fn(playing);
  return () => {
    listeners.delete(fn);
  };
}

export function isPlaying() {
  return playing;
}

export async function toggleMusic(url?: string): Promise<boolean> {
  // external file takes priority
  if (url) {
    try {
      if (!externalAudio) {
        externalAudio = new Audio(url);
        externalAudio.loop = true;
      }
      if (playing) {
        externalAudio.pause();
        playing = false;
      } else {
        externalAudio.volume = 0.55;
        await externalAudio.play();
        playing = true;
      }
      emit();
      return playing;
    } catch {
      /* fall through to the generative score */
    }
  }

  const c = ensureContext();
  if (!c || !musicBus) return false;

  if (playing) {
    playing = false;
    const now = c.currentTime;
    musicBus.gain.cancelScheduledValues(now);
    musicBus.gain.setValueAtTime(musicBus.gain.value, now);
    musicBus.gain.linearRampToValueAtTime(0.0001, now + 0.7);
    if (musicTimer) clearInterval(musicTimer);
    musicTimer = null;
    emit();
    return false;
  }

  startDrone();
  const now = c.currentTime;
  musicBus.gain.cancelScheduledValues(now);
  musicBus.gain.setValueAtTime(0.0001, now);
  musicBus.gain.linearRampToValueAtTime(0.85, now + 2.2);
  nextNoteAt = now + 0.25;
  scheduler();
  musicTimer = setInterval(scheduler, 500);
  playing = true;
  emit();
  return true;
}

/** soft three-note chime for the invitation opening */
export function playChime(volume = 0.16) {
  const c = ensureContext();
  if (!c || !master) return;
  const now = c.currentTime;
  const bus = c.createGain();
  bus.gain.value = volume;
  bus.connect(master);

  [523.25, 659.25, 783.99].forEach((freq, i) => {
    const osc = c.createOscillator();
    const gain = c.createGain();
    const at = now + i * 0.09;
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, at);
    gain.gain.exponentialRampToValueAtTime(0.5, at + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, at + 2.2);
    osc.connect(gain);
    gain.connect(bus);
    osc.start(at);
    osc.stop(at + 2.4);
  });

  window.setTimeout(() => {
    try {
      bus.disconnect();
    } catch {
      /* noop */
    }
  }, 2800);
}

/** micro haptic used on taps */
export function haptic(pattern: number | number[] = 12) {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    try {
      navigator.vibrate(pattern);
    } catch {
      /* unsupported */
    }
  }
}
