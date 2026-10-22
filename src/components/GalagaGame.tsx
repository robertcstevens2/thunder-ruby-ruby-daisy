import { useEffect, useRef, useState } from "react";
import { Galaga, type Snap } from "@/game/engine";

const INITIAL: Snap = {
  mode: "title",
  score: 0,
  hi: 0,
  lives: 3,
  wave: 1,
  left: 40,
  dual: false,
  sound: true,
  newRecord: false,
};

function pad(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(6, "0");
}

export function GalagaGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const touch = useRef({ x: 0, fire: false, screenFire: false });
  const gameRef = useRef<Galaga | null>(null);
  const [snap, setSnap] = useState<Snap>(INITIAL);
  const [portrait, setPortrait] = useState(true);
  const [knob, setKnob] = useState({ x: 0, y: 0 });
  const [fireDown, setFireDown] = useState(false);
  const stickId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const game = new Galaga(canvas, touch.current, setSnap);
    gameRef.current = game;
    return () => {
      game.destroy();
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const apply = () => setPortrait(window.innerHeight >= window.innerWidth * 0.92);
    apply();
    window.addEventListener("resize", apply);
    return () => window.removeEventListener("resize", apply);
  }, []);

  function begin() {
    gameRef.current?.poke();
    gameRef.current?.begin();
  }

  function onFireDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    touch.current.fire = true;
    setFireDown(true);
    const mode = gameRef.current?.mode;
    if (mode === "title" || mode === "over") begin();
    else gameRef.current?.poke();
  }

  function onFireUp(e: React.PointerEvent<HTMLButtonElement>) {
    e.preventDefault();
    touch.current.fire = false;
    setFireDown(false);
  }

  function stickFrom(e: React.PointerEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const max = r.width * 0.34;
    let dx = e.clientX - (r.left + r.width / 2);
    let dy = e.clientY - (r.top + r.height / 2);
    const mag = Math.hypot(dx, dy) || 1;
    const clamped = Math.min(mag, max);
    dx = (dx / mag) * clamped;
    dy = (dy / mag) * clamped;
    const nx = dx / max;
    const ny = dy / max;
    const m = Math.hypot(nx, ny);
    const dz = 0.18;
    let out = 0;
    if (m > dz) {
      const scale = (m - dz) / (1 - dz) / m;
      out = Math.max(-1, Math.min(1, nx * scale));
    }
    setKnob({ x: dx, y: dy });
    touch.current.x = out;
    e.currentTarget.setAttribute("aria-valuenow", out.toFixed(2));
  }

  function onStickDown(e: React.PointerEvent<HTMLDivElement>) {
    e.preventDefault();
    stickId.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    gameRef.current?.poke();
    stickFrom(e);
  }

  function onStickMove(e: React.PointerEvent<HTMLDivElement>) {
    if (stickId.current !== e.pointerId) return;
    e.preventDefault();
    stickFrom(e);
  }

  function onStickUp(e: React.PointerEvent<HTMLDivElement>) {
    if (stickId.current !== e.pointerId) return;
    e.preventDefault();
    stickId.current = null;
    setKnob({ x: 0, y: 0 });
    touch.current.x = 0;
    e.currentTarget.setAttribute("aria-valuenow", "0");
  }

  const playing = snap.mode === "play" || snap.mode === "pause" || snap.mode === "over";

  return (
    <main className={portrait ? "cabinet portrait" : "cabinet landscape"}>
      <canvas ref={canvasRef} aria-label="Emoji Galaga playfield" />
      <div className="scanlines" aria-hidden="true" />
      <div className="vignette" aria-hidden="true" />

      <div className="top-actions">
        {playing && snap.mode !== "over" ? (
          <button type="button" className="ghost" onClick={() => gameRef.current?.togglePause()} aria-label={snap.mode === "pause" ? "Resume" : "Pause"}>
            {snap.mode === "pause" ? "Resume" : "Pause"}
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          className="ghost"
          onClick={() => gameRef.current?.toggleSound()}
          aria-pressed={!snap.sound}
          aria-label={snap.sound ? "Mute sound" : "Enable sound"}
        >
          {snap.sound ? "Sound on" : "Sound off"}
        </button>
      </div>

      {snap.mode === "title" && (
        <div className="overlay">
          <section className="panel">
            <p className="eyebrow">1981 arcade</p>
            <h1>Emoji Galaga</h1>
            <p className="lede">A formation shooter rebuilt entirely from emoji. Ships dive, bosses capture, and a rescued fighter flies beside you.</p>
            <button type="button" className="btn" onClick={begin}>
              Start
            </button>
            <ul className="help">
              <li>
                <span>Move</span> Right thumb, or A D and arrows
              </li>
              <li>
                <span>Fire</span> Left thumb, Space, or tap
              </li>
              <li>
                <span>Pause</span> P or Esc
              </li>
            </ul>
          </section>
        </div>
      )}

      {snap.mode === "pause" && (
        <div className="overlay">
          <section className="panel">
            <p className="eyebrow">Wave {String(snap.wave).padStart(2, "0")}</p>
            <h1>Paused</h1>
            <p className="scoreline">{pad(snap.score)}</p>
            <div className="row">
              <button type="button" className="btn" onClick={() => gameRef.current?.resume()}>
                Resume
              </button>
              <button type="button" className="btn secondary" onClick={begin}>
                Restart
              </button>
            </div>
          </section>
        </div>
      )}

      {snap.mode === "over" && (
        <div className="overlay">
          <section className="panel">
            <p className="eyebrow">Insert coin</p>
            <h1>Game over</h1>
            {snap.newRecord && <p className="record">New record</p>}
            <dl className="totals">
              <div>
                <dt>Score</dt>
                <dd>{pad(snap.score)}</dd>
              </div>
              <div>
                <dt>High</dt>
                <dd>{pad(snap.hi)}</dd>
              </div>
            </dl>
            <button type="button" className="btn" onClick={begin}>
              Play again
            </button>
          </section>
        </div>
      )}

      <button
        type="button"
        className={fireDown ? "fire down" : "fire"}
        aria-label="Fire"
        onPointerDown={onFireDown}
        onPointerUp={onFireUp}
        onPointerCancel={onFireUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="fire-core" aria-hidden="true">
          🔥
        </span>
      </button>

      <div
        className="stick"
        role="slider"
        aria-label="Move"
        aria-valuemin={-1}
        aria-valuemax={1}
        aria-valuenow={0}
        aria-orientation="horizontal"
        onPointerDown={onStickDown}
        onPointerMove={onStickMove}
        onPointerUp={onStickUp}
        onPointerCancel={onStickUp}
        onContextMenu={(e) => e.preventDefault()}
      >
        <span className="knob" style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }} />
      </div>
      <p className="thumb fire-label">Fire</p>
      <p className="thumb stick-label">Move</p>
    </main>
  );
}
