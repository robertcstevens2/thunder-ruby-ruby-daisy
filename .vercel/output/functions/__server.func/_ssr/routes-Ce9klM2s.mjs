import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Ce9klM2s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Retro Web Audio bleeps. Unlocked from the first gesture. No sample files. */
var ArcadeAudio = class {
	ctx = null;
	master = null;
	musicBus = null;
	sfxBus = null;
	enabled = true;
	musicOn = false;
	motif = [];
	step = 0;
	nextAt = 0;
	started = false;
	combatMotif = [
		220,
		0,
		220,
		330,
		196,
		0,
		196,
		294,
		247,
		0,
		247,
		370,
		220,
		262,
		0,
		0
	];
	challengeMotif = [
		523,
		659,
		784,
		659,
		587,
		784,
		880,
		784,
		523,
		659,
		784,
		1046,
		784,
		659,
		587,
		523
	];
	titleMotif = [
		330,
		0,
		392,
		0,
		494,
		0,
		392,
		330,
		0,
		294,
		0,
		330,
		0,
		0,
		0,
		0
	];
	unlock() {
		const AC = window.AudioContext || window.webkitAudioContext;
		if (!AC) return;
		if (!this.ctx) {
			const ctx = new AC({ latencyHint: "interactive" });
			const master = ctx.createGain();
			const music = ctx.createGain();
			const sfx = ctx.createGain();
			master.gain.value = .9;
			music.gain.value = .45;
			sfx.gain.value = 1;
			music.connect(master);
			sfx.connect(master);
			master.connect(ctx.destination);
			this.ctx = ctx;
			this.master = master;
			this.musicBus = music;
			this.sfxBus = sfx;
		}
		if (this.ctx.state === "suspended") this.ctx.resume();
	}
	setEnabled(on) {
		this.enabled = on;
		if (!this.master || !this.ctx) return;
		const now = this.ctx.currentTime;
		this.master.gain.setTargetAtTime(on ? .9 : 0, now, .02);
	}
	resume() {
		if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
	}
	startMusic(kind) {
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
		const beat = .15;
		while (this.nextAt < ctx.currentTime + .05) {
			const f = this.motif[this.step % this.motif.length] ?? 0;
			if (f > 0) this.tone(f, beat * .86, "square", .035, this.musicBus);
			this.step++;
			this.nextAt += beat;
		}
	}
	shoot() {
		this.tone(740 + Math.random() * 80, .045, "square", .06);
	}
	enemyShot() {
		this.tone(180 + Math.random() * 30, .07, "square", .04);
	}
	explode() {
		this.noise(.16, .12, 900);
		this.tone(140, .12, "sawtooth", .05);
	}
	playerDie() {
		this.noise(.35, .16, 500);
		this.slide(420, 70, .45, "sawtooth", .07);
	}
	dive() {
		this.slide(640, 240, .18, "square", .03);
	}
	capture() {
		this.slide(500, 900, .28, "square", .05);
		this.slide(700, 200, .4, "triangle", .04);
	}
	rescue() {
		[
			523,
			659,
			784,
			1046
		].forEach((f, i) => {
			const ctx = this.ctx;
			if (!ctx || !this.enabled) return;
			this.tone(f, .1, "square", .05, this.sfxBus, ctx.currentTime + i * .08);
		});
	}
	extra() {
		[
			784,
			988,
			1174
		].forEach((f, i) => {
			const ctx = this.ctx;
			if (!ctx || !this.enabled) return;
			this.tone(f, .09, "square", .05, this.sfxBus, ctx.currentTime + i * .07);
		});
	}
	wave() {
		[
			392,
			523,
			659,
			784
		].forEach((f, i) => {
			const ctx = this.ctx;
			if (!ctx || !this.enabled) return;
			this.tone(f, .11, "square", .05, this.sfxBus, ctx.currentTime + i * .09);
		});
	}
	perfect() {
		[
			523,
			659,
			784,
			1046,
			784,
			1046
		].forEach((f, i) => {
			const ctx = this.ctx;
			if (!ctx || !this.enabled) return;
			this.tone(f, .12, "square", .055, this.sfxBus, ctx.currentTime + i * .09);
		});
	}
	gameOver() {
		this.stopMusic();
		[
			392,
			349,
			311,
			262,
			196
		].forEach((f, i) => {
			const ctx = this.ctx;
			if (!ctx || !this.enabled) return;
			this.tone(f, .22, "triangle", .06, this.sfxBus, ctx.currentTime + i * .16);
		});
	}
	tone(freq, dur, type, gain, bus, when) {
		if (!this.enabled || !this.ctx || !this.sfxBus) return;
		const ctx = this.ctx;
		const t = when ?? ctx.currentTime;
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(freq, t);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(Math.max(.001, gain), t + .01);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(bus ?? this.sfxBus);
		osc.start(t);
		osc.stop(t + dur + .02);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
		};
	}
	slide(from, to, dur, type, gain) {
		if (!this.enabled || !this.ctx || !this.sfxBus) return;
		const ctx = this.ctx;
		const t = ctx.currentTime;
		const osc = ctx.createOscillator();
		const g = ctx.createGain();
		osc.type = type;
		osc.frequency.setValueAtTime(from, t);
		osc.frequency.exponentialRampToValueAtTime(Math.max(40, to), t + dur);
		g.gain.setValueAtTime(1e-4, t);
		g.gain.exponentialRampToValueAtTime(gain, t + .015);
		g.gain.exponentialRampToValueAtTime(1e-4, t + dur);
		osc.connect(g);
		g.connect(this.sfxBus);
		osc.start(t);
		osc.stop(t + dur + .02);
		osc.onended = () => {
			osc.disconnect();
			g.disconnect();
		};
	}
	noise(dur, gain, cutoff) {
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
		if (this.ctx) this.ctx.close();
		this.ctx = null;
	}
};
var HI_KEY = "emoji-galaga-hi";
var SOUND_KEY = "emoji-galaga-sound";
var GLYPH = {
	"0": [
		14,
		17,
		19,
		21,
		25,
		17,
		14
	],
	"1": [
		4,
		12,
		4,
		4,
		4,
		4,
		14
	],
	"2": [
		14,
		17,
		1,
		2,
		4,
		8,
		31
	],
	"3": [
		30,
		1,
		1,
		14,
		1,
		1,
		30
	],
	"4": [
		2,
		6,
		10,
		18,
		31,
		2,
		2
	],
	"5": [
		31,
		16,
		30,
		1,
		1,
		17,
		14
	],
	"6": [
		6,
		8,
		16,
		30,
		17,
		17,
		14
	],
	"7": [
		31,
		1,
		2,
		4,
		8,
		8,
		8
	],
	"8": [
		14,
		17,
		17,
		14,
		17,
		17,
		14
	],
	"9": [
		14,
		17,
		17,
		15,
		1,
		2,
		12
	],
	A: [
		14,
		17,
		17,
		31,
		17,
		17,
		17
	],
	B: [
		30,
		17,
		17,
		30,
		17,
		17,
		30
	],
	C: [
		14,
		17,
		16,
		16,
		16,
		17,
		14
	],
	D: [
		28,
		18,
		17,
		17,
		17,
		18,
		28
	],
	E: [
		31,
		16,
		16,
		30,
		16,
		16,
		31
	],
	F: [
		31,
		16,
		16,
		30,
		16,
		16,
		16
	],
	G: [
		14,
		17,
		16,
		23,
		17,
		17,
		14
	],
	H: [
		17,
		17,
		17,
		31,
		17,
		17,
		17
	],
	I: [
		14,
		4,
		4,
		4,
		4,
		4,
		14
	],
	J: [
		7,
		2,
		2,
		2,
		18,
		18,
		12
	],
	K: [
		17,
		18,
		20,
		24,
		20,
		18,
		17
	],
	L: [
		16,
		16,
		16,
		16,
		16,
		16,
		31
	],
	M: [
		17,
		27,
		21,
		21,
		17,
		17,
		17
	],
	N: [
		17,
		25,
		21,
		19,
		17,
		17,
		17
	],
	O: [
		14,
		17,
		17,
		17,
		17,
		17,
		14
	],
	P: [
		30,
		17,
		17,
		30,
		16,
		16,
		16
	],
	Q: [
		14,
		17,
		17,
		17,
		21,
		18,
		13
	],
	R: [
		30,
		17,
		17,
		30,
		20,
		18,
		17
	],
	S: [
		15,
		16,
		16,
		14,
		1,
		1,
		30
	],
	T: [
		31,
		4,
		4,
		4,
		4,
		4,
		4
	],
	U: [
		17,
		17,
		17,
		17,
		17,
		17,
		14
	],
	V: [
		17,
		17,
		17,
		17,
		10,
		10,
		4
	],
	W: [
		17,
		17,
		17,
		21,
		21,
		21,
		10
	],
	X: [
		17,
		17,
		10,
		4,
		10,
		17,
		17
	],
	Y: [
		17,
		17,
		10,
		4,
		4,
		4,
		4
	],
	Z: [
		31,
		1,
		2,
		4,
		8,
		16,
		31
	],
	" ": [
		0,
		0,
		0,
		0,
		0,
		0,
		0
	],
	"-": [
		0,
		0,
		0,
		31,
		0,
		0,
		0
	],
	"+": [
		0,
		4,
		4,
		31,
		4,
		4,
		0
	],
	"!": [
		4,
		4,
		4,
		4,
		4,
		0,
		4
	],
	".": [
		0,
		0,
		0,
		0,
		0,
		4,
		4
	]
};
var STAR_EMOJI = [
	"✨",
	"⭐",
	"🌟",
	"✨",
	"⭐"
];
var BOOM_FRAMES = [
	"✨",
	"💥",
	"🔥",
	"⭐"
];
function clamp(n, a, b) {
	return Math.max(a, Math.min(b, n));
}
function lerp(a, b, t) {
	return a + (b - a) * t;
}
function ease(t) {
	return t * t * (3 - 2 * t);
}
function pad$1(n, w = 6) {
	return String(Math.max(0, Math.floor(n))).padStart(w, "0");
}
function textWidth(text, scale) {
	return text.length * 6 * scale - scale;
}
function randPick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}
function drawPixel(ctx, text, x, y, scale, color, align = "left") {
	const step = 6 * scale;
	const width = textWidth(text, scale);
	let cx = x;
	if (align === "center") cx = x - width / 2;
	else if (align === "right") cx = x - width;
	ctx.fillStyle = color;
	const upper = text.toUpperCase();
	for (let i = 0; i < upper.length; i++) {
		const rows = GLYPH[upper[i]];
		if (rows) for (let r = 0; r < 7; r++) {
			const bits = rows[r] ?? 0;
			for (let c = 0; c < 5; c++) if (bits & 1 << 4 - c) ctx.fillRect(cx + c * scale, y + r * scale, scale, scale);
		}
		cx += step;
	}
}
function spriteFor(kind, col, row, wave) {
	if (kind === "boss") return "🛸";
	if (kind === "butterfly") return row === 1 ? "🐙" : col % 2 === 0 ? "🦑" : "🪲";
	if (wave >= 6 && (col + row) % 7 === 0) return "🦂";
	if (wave >= 3 && col % 4 === 3) return "👽";
	return "👾";
}
var GAME_KEYS = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Space",
	"Enter",
	"KeyP",
	"Escape",
	"KeyA",
	"KeyD",
	"KeyZ"
]);
var Galaga = class {
	ctx;
	raf = 0;
	last = 0;
	acc = 0;
	running = true;
	W = 1;
	H = 1;
	dpr = 1;
	reduceMotion = false;
	safeTop = 0;
	keys = /* @__PURE__ */ new Set();
	touch;
	padX = 0;
	padFire = false;
	prevStart = false;
	mode = "title";
	phase = "combat";
	time = 0;
	clock = 0;
	score = 0;
	hi = 0;
	lives = 3;
	wave = 1;
	dual = false;
	pendingDual = false;
	newRecord = false;
	capturedBoss = -1;
	hiAtStart = 0;
	lifeAwarded = 0;
	lifeMarks = [
		2e4,
		6e4,
		12e4,
		2e5,
		3e5
	];
	player = {
		x: 0,
		y: 0,
		alive: true,
		invuln: 0
	};
	fireCd = 0;
	enemies = [];
	challengers = [];
	bullets = [];
	booms = [];
	popups = [];
	stars = [];
	planets = [];
	flyer = null;
	nextId = 1;
	combatT = 0;
	clearT = 0;
	chIntroT = 0;
	chClock = 0;
	diveCd = 2;
	respawnAt = -1;
	overAt = -1;
	pendingOver = false;
	shake = 0;
	flashA = 0;
	hurtLock = false;
	banner = null;
	clearBonusGiven = false;
	audio;
	soundOn;
	onSnap;
	publishAcc = 0;
	lastSnap = "";
	ro = null;
	onKeyDown;
	onKeyUp;
	onBlur;
	onVis;
	onPointerDown;
	onPointerUp;
	constructor(canvas, touch, onSnap) {
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("Canvas 2D unavailable");
		this.ctx = ctx;
		this.touch = touch;
		this.onSnap = onSnap;
		this.audio = new ArcadeAudio();
		let hi = 0;
		let sound = true;
		try {
			hi = Number(localStorage.getItem(HI_KEY) || 0) || 0;
			sound = localStorage.getItem(SOUND_KEY) !== "0";
		} catch {}
		this.hi = hi;
		this.soundOn = sound;
		this.audio.enabled = sound;
		this.reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
		this.onKeyDown = (e) => {
			if (GAME_KEYS.has(e.code)) e.preventDefault();
			this.keys.add(e.code);
			this.audio.unlock();
			if (e.code === "Enter") {
				if (this.mode === "title" || this.mode === "over") this.begin();
				else if (this.mode === "pause") this.resume();
			} else if ((e.code === "KeyP" || e.code === "Escape") && (this.mode === "play" || this.mode === "pause")) this.togglePause();
			else if ((e.code === "Space" || e.code === "KeyZ") && (this.mode === "title" || this.mode === "over")) this.begin();
		};
		this.onKeyUp = (e) => this.keys.delete(e.code);
		this.onBlur = () => this.keys.clear();
		this.onVis = () => {
			if (document.hidden) {
				this.keys.clear();
				if (this.mode === "play") this.pause();
			} else this.audio.resume();
		};
		this.onPointerDown = (e) => {
			if (e.target !== canvas) return;
			this.audio.unlock();
			if (this.mode === "title" || this.mode === "over") this.begin();
			else if (this.mode === "play") this.touch.screenFire = true;
		};
		this.onPointerUp = (e) => {
			if (e.target === canvas) this.touch.screenFire = false;
		};
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);
		window.addEventListener("blur", this.onBlur);
		document.addEventListener("visibilitychange", this.onVis);
		canvas.addEventListener("pointerdown", this.onPointerDown);
		window.addEventListener("pointerup", this.onPointerUp);
		window.addEventListener("pointercancel", this.onPointerUp);
		this.ro = new ResizeObserver(() => this.resize());
		this.ro.observe(canvas);
		this.seedField();
		this.resize();
		this.installProbe();
		this.publish(true);
		this.last = performance.now();
		this.raf = requestAnimationFrame(this.frame);
	}
	installProbe() {
		window.__galaga = {
			setKeys: (codes) => {
				this.keys.clear();
				for (const c of codes) this.keys.add(c);
				this.touch.x = 0;
				this.touch.fire = codes.includes("Space") || codes.includes("KeyZ");
				this.touch.screenFire = false;
			},
			getX: () => this.player.x,
			getMode: () => this.mode,
			getScore: () => this.score,
			getLives: () => this.lives,
			getWave: () => this.wave,
			getLeft: () => this.remaining(),
			getDual: () => this.dual,
			getBullets: () => this.bullets.filter((b) => b.alive && b.friendly).length,
			start: () => this.begin()
		};
	}
	destroy() {
		this.running = false;
		cancelAnimationFrame(this.raf);
		this.ro?.disconnect();
		window.removeEventListener("keydown", this.onKeyDown);
		window.removeEventListener("keyup", this.onKeyUp);
		window.removeEventListener("blur", this.onBlur);
		document.removeEventListener("visibilitychange", this.onVis);
		this.ctx.canvas.removeEventListener("pointerdown", this.onPointerDown);
		window.removeEventListener("pointerup", this.onPointerUp);
		window.removeEventListener("pointercancel", this.onPointerUp);
		this.audio.dispose();
		if (window.__galaga) delete window.__galaga;
	}
	toggleSound() {
		this.soundOn = !this.soundOn;
		this.audio.unlock();
		this.audio.setEnabled(this.soundOn);
		try {
			localStorage.setItem(SOUND_KEY, this.soundOn ? "1" : "0");
		} catch {}
		this.publish(true);
	}
	poke() {
		this.audio.unlock();
		this.audio.resume();
	}
	begin() {
		if (this.mode === "play") return;
		this.audio.unlock();
		this.score = 0;
		this.hiAtStart = this.hi;
		this.lives = 3;
		this.wave = 1;
		this.dual = false;
		this.pendingDual = false;
		this.newRecord = false;
		this.capturedBoss = -1;
		this.lifeAwarded = 0;
		this.pendingOver = false;
		this.overAt = -1;
		this.respawnAt = -1;
		this.flyer = null;
		this.bullets = [];
		this.booms = [];
		this.popups = [];
		this.banner = null;
		this.time = 0;
		this.player.alive = true;
		this.player.invuln = 1.6;
		this.player.x = this.W / 2;
		this.fireCd = .28;
		this.mode = "play";
		this.audio.startMusic("combat");
		this.startWave(1);
		this.publish(true);
	}
	togglePause() {
		if (this.mode === "play") this.pause();
		else if (this.mode === "pause") this.resume();
	}
	pause() {
		if (this.mode !== "play") return;
		this.mode = "pause";
		this.audio.stopMusic();
		this.keys.clear();
		this.publish(true);
	}
	resume() {
		if (this.mode !== "pause") return;
		this.mode = "play";
		this.audio.unlock();
		this.audio.startMusic(this.phase === "challenge" || this.phase === "chIntro" ? "challenge" : "combat");
		this.publish(true);
	}
	resize() {
		const canvas = this.ctx.canvas;
		const rect = canvas.getBoundingClientRect();
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const w = Math.max(1, rect.width);
		const h = Math.max(1, rect.height);
		canvas.width = Math.floor(w * dpr);
		canvas.height = Math.floor(h * dpr);
		this.dpr = dpr;
		this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		this.W = w;
		this.H = h;
		const parent = canvas.parentElement;
		if (parent) {
			const raw = getComputedStyle(parent).getPropertyValue("--sat").trim();
			const n = parseFloat(raw);
			this.safeTop = Number.isFinite(n) ? n : 0;
		}
		if (!this.player.x) this.player.x = w / 2;
		this.player.x = clamp(this.player.x, 24, Math.max(24, w - 24));
	}
	seedField() {
		this.stars = [];
		for (let i = 0; i < 42; i++) this.stars.push({
			nx: Math.random(),
			ny: Math.random(),
			z: .25 + Math.random() * .75,
			emoji: STAR_EMOJI[i % STAR_EMOJI.length],
			size: 10 + Math.random() * 14,
			phase: Math.random() * Math.PI * 2
		});
		this.planets = [
			{
				nx: .1,
				ny: Math.random(),
				emoji: "🪐",
				size: 26,
				speed: .012
			},
			{
				nx: .86,
				ny: Math.random(),
				emoji: "🌍",
				size: 22,
				speed: .018
			},
			{
				nx: .7,
				ny: Math.random(),
				emoji: "🌕",
				size: 16,
				speed: .028
			}
		];
	}
	frame = (now) => {
		if (!this.running) return;
		const dt = Math.min(.05, (now - this.last) / 1e3);
		this.last = now;
		this.acc += dt;
		const step = 1 / 60;
		while (this.acc >= step) {
			this.tick(step);
			this.acc -= step;
		}
		this.render();
		this.raf = requestAnimationFrame(this.frame);
	};
	tick(dt) {
		this.clock += dt;
		this.pollPad();
		this.driftScenery(dt);
		this.audio.pump();
		if (this.mode === "play") {
			this.time += dt;
			this.stepGame(dt);
		}
		this.shake = Math.max(0, this.shake - dt * 14);
		this.flashA = Math.max(0, this.flashA - dt * 1.4);
		this.publishAcc += dt;
		if (this.publishAcc >= .12) {
			this.publishAcc = 0;
			this.publish(false);
		}
	}
	driftScenery(dt) {
		for (const s of this.stars) {
			s.ny += dt * .02 * s.z;
			if (s.ny > 1.05) {
				s.ny = -.05;
				s.nx = Math.random();
			}
		}
		for (const p of this.planets) {
			p.ny += dt * p.speed;
			if (p.ny > 1.12) {
				p.ny = -.12;
				p.nx = .08 + Math.random() * .84;
			}
		}
	}
	pollPad() {
		const pads = navigator.getGamepads?.();
		this.padX = 0;
		this.padFire = false;
		let start = false;
		if (pads) for (const p of pads) {
			if (!p) continue;
			let ax = p.axes[0] ?? 0;
			const mag = Math.abs(ax);
			if (mag < .18) ax = 0;
			else ax = Math.sign(ax) * ((mag - .18) / .82);
			this.padX = clamp(ax, -1, 1);
			if (p.buttons[0]?.pressed || p.buttons[2]?.pressed || (p.buttons[7]?.value ?? 0) > .4) this.padFire = true;
			if (p.buttons[9]?.pressed) start = true;
		}
		if (start && !this.prevStart) {
			this.audio.unlock();
			if (this.mode === "title" || this.mode === "over") this.begin();
			else this.togglePause();
		}
		this.prevStart = start;
	}
	moveX() {
		let m = this.touch.x + this.padX;
		if (this.keys.has("ArrowLeft") || this.keys.has("KeyA")) m -= 1;
		if (this.keys.has("ArrowRight") || this.keys.has("KeyD")) m += 1;
		return clamp(m, -1, 1);
	}
	firing() {
		return this.touch.fire || this.touch.screenFire || this.padFire || this.keys.has("Space") || this.keys.has("KeyZ");
	}
	metrics() {
		const { W, H } = this;
		const portrait = H >= W * .92;
		const formW = Math.min(W * (portrait ? .9 : .62), 700);
		const spacingX = formW / 9;
		const playerY = portrait ? H * .9 : H * .74;
		const top = Math.max(this.safeTop + 96, H * .145);
		const spacingY = clamp(Math.min(spacingX * .9, (playerY - 170 - top) / 4), 26, 58);
		return {
			spacingX,
			spacingY,
			top,
			playerY,
			emoji: clamp(Math.min(spacingX, spacingY) * .74, 20, 48),
			portrait,
			formW
		};
	}
	sway() {
		const { W } = this;
		const m = this.metrics();
		const open = 1 - (this.enemies.filter((e) => e.alive).length || 40) / 40;
		const half = 4.5 * m.spacingX;
		const maxAmp = Math.max(8, W / 2 - half - 16);
		const amp = Math.min(maxAmp, W * .045 + open * W * .07);
		const speed = .7 + open * 1.1;
		return Math.sin(this.time * speed) * amp;
	}
	home(e) {
		const m = this.metrics();
		return {
			x: this.W / 2 + this.sway() + (e.col - 4.5) * m.spacingX,
			y: m.top + e.row * m.spacingY + Math.sin(this.time * 2.4 + e.col * .45 + e.row) * 1.6
		};
	}
	combatIndex() {
		return this.wave - Math.floor(this.wave / 4);
	}
	stepGame(dt) {
		const m = this.metrics();
		this.player.y = m.playerY;
		this.hurtLock = false;
		if (this.player.invuln > 0) this.player.invuln -= dt;
		if (this.player.alive) {
			const mx = this.moveX();
			this.player.x = clamp(this.player.x + mx * this.W * .72 * dt, m.emoji, this.W - m.emoji);
			this.fireCd -= dt;
			if (this.firing() && this.fireCd <= 0) this.tryShoot();
		}
		if (this.respawnAt >= 0 && this.time >= this.respawnAt) {
			this.respawnAt = -1;
			if (this.lives > 0 && !this.pendingOver) {
				this.player.alive = true;
				this.player.x = this.W / 2;
				this.player.invuln = 2.1;
				if (this.pendingDual) {
					this.dual = true;
					this.pendingDual = false;
				}
			}
		}
		if (this.phase === "combat") this.stepCombat(dt);
		else if (this.phase === "clear") {
			this.clearT -= dt;
			if (this.clearT <= 0) this.startWave(this.wave + 1);
		} else if (this.phase === "chIntro") {
			this.chIntroT -= dt;
			if (this.chIntroT <= 0) {
				this.phase = "challenge";
				this.chClock = 0;
				this.audio.startMusic("challenge");
			}
		} else if (this.phase === "challenge") this.stepChallenge(dt);
		this.stepBullets(dt);
		this.stepBooms(dt);
		this.stepFlyer(dt);
		this.collide();
		if (this.pendingOver && this.overAt >= 0 && this.time >= this.overAt && this.mode === "play") {
			this.mode = "over";
			this.newRecord = this.score > this.hiAtStart && this.score > 0;
			this.hi = Math.max(this.hi, this.score);
			this.persistHi();
			this.audio.gameOver();
			this.publish(true);
		}
	}
	startWave(n) {
		this.wave = n;
		this.bullets = [];
		this.clearBonusGiven = false;
		this.banner = null;
		if (n % 4 === 0) {
			this.phase = "chIntro";
			this.chIntroT = 1.45;
			this.challengers = this.makeChallenge();
			this.enemies = [];
			this.showBanner("CHALLENGING STAGE", "NO FIRE FROM THEM", 1.45);
			this.audio.wave();
		} else {
			this.phase = "combat";
			this.combatT = 0;
			this.diveCd = 99;
			this.enemies = this.makeFormation();
			this.challengers = [];
			this.showBanner("WAVE " + String(n).padStart(2, "0"), "READY", 1.35);
			if (this.audio) this.audio.startMusic("combat");
		}
	}
	makeFormation() {
		const slots = [];
		for (let c = 3; c <= 6; c++) slots.push({
			c,
			r: 0,
			kind: "boss"
		});
		for (const r of [1, 2]) for (let c = 1; c <= 8; c++) slots.push({
			c,
			r,
			kind: "butterfly"
		});
		for (const r of [3, 4]) for (let c = 0; c <= 9; c++) slots.push({
			c,
			r,
			kind: "bee"
		});
		const list = slots.map((s) => ({
			id: this.nextId++,
			kind: s.kind,
			emoji: spriteFor(s.kind, s.c, s.r, this.wave),
			col: s.c,
			row: s.r,
			alive: true,
			state: "wait",
			x: 0,
			y: -80,
			dir: 1,
			enterAt: 0,
			enterT: 0,
			enterDur: 1.05,
			enterFromX: 0,
			enterFromY: 0,
			enterCx: 0,
			enterCy: 0,
			diveT: 0,
			diveDur: 2.6,
			diveKind: "loop",
			launchX: 0,
			launchY: 0,
			aimX: 0,
			fireCd: .4,
			beamT: 0,
			beamLock: 0,
			returnT: 0,
			returnDur: .85,
			returnFromX: 0,
			returnFromY: 0,
			prisoner: false,
			escortOf: -1,
			escortIds: [],
			pendingDive: null,
			spin: 0
		}));
		const stagger = Math.max(.032, .055 - this.combatIndex() * .003);
		let delay = .15;
		for (const row of [
			4,
			3,
			2,
			1,
			0
		]) {
			list.filter((e) => e.row === row).sort((a, b) => a.col - b.col).forEach((e, i) => {
				e.dir = i % 2 === 0 ? -1 : 1;
				e.enterAt = delay + i * stagger;
			});
			delay += row === 0 ? .45 : .62;
		}
		return list;
	}
	makeChallenge() {
		const out = [];
		const groups = 4;
		const per = 8;
		for (let g = 0; g < groups; g++) for (let i = 0; i < per; i++) {
			const kind = i === 0 || i === 7 ? "boss" : i % 3 === 0 ? "butterfly" : "bee";
			out.push({
				id: this.nextId++,
				kind,
				emoji: spriteFor(kind, i, g, this.wave),
				x: -40,
				y: -40,
				alive: true,
				killed: false,
				active: false,
				delay: g * 2.45 + i * .14,
				t: 0,
				dur: 4.15,
				pattern: g % 2 === 0 ? "sine" : "loop",
				flip: g % 2 === 1,
				yRatio: .2 + i % 4 * .09,
				amp: .07 + g % 2 * .02,
				loops: 2 + g % 2,
				points: kind === "boss" ? 200 : kind === "butterfly" ? 150 : 100,
				spin: 0
			});
		}
		return out;
	}
	stepCombat(dt) {
		this.combatT += dt;
		const idx = this.combatIndex();
		for (const e of this.enemies) {
			if (!e.alive) continue;
			if (e.pendingDive && e.state === "form" && this.time >= e.pendingDive.at) {
				const p = e.pendingDive;
				e.pendingDive = null;
				e.escortOf = p.escortOf;
				this.beginDive(e, p.dir);
			}
			if (e.state === "wait" && this.combatT >= e.enterAt) this.beginEnter(e);
			else if (e.state === "enter") this.stepEnter(e, dt);
			else if (e.state === "form") {
				const h = this.home(e);
				e.x = h.x;
				e.y = h.y;
				e.spin = Math.sin(this.time * 3 + e.id) * .08;
			} else if (e.state === "dive") this.stepDive(e, dt);
			else if (e.state === "beam") this.stepBeam(e, dt);
			else if (e.state === "return") this.stepReturn(e, dt);
			if ((e.state === "dive" || e.state === "beam") && e.alive) {
				e.fireCd -= dt;
				const enemyShots = this.bullets.reduce((n, b) => n + (!b.friendly && b.alive ? 1 : 0), 0);
				if (e.fireCd <= 0 && enemyShots < 6 && e.y > 40 && e.y < this.player.y - 24 && this.player.alive) {
					this.enemyShoot(e);
					e.fireCd = Math.max(.38, 1.2 - idx * .08);
				}
			}
		}
		if (!this.enemies.some((e) => e.alive && (e.state === "wait" || e.state === "enter"))) {
			const diving = this.enemies.filter((e) => e.alive && (e.state === "dive" || e.state === "beam")).length;
			const maxD = Math.min(4, 1 + Math.floor(idx / 2));
			if (this.diveCd > 20) this.diveCd = 1.15;
			this.diveCd -= dt;
			if (this.diveCd <= 0 && diving < maxD) {
				this.diveCd = Math.max(.65, 2.5 - idx * .18) * (.75 + Math.random() * .45);
				this.scheduleDive();
			}
		}
		if (!this.enemies.some((e) => e.alive) && !this.flyer && !this.clearBonusGiven) {
			this.clearBonusGiven = true;
			const bonus = 1e3 + this.wave * 150;
			this.addScore(bonus);
			this.showBanner("WAVE CLEARED", "+" + bonus, 1.6);
			this.audio.wave();
			this.phase = "clear";
			this.clearT = 1.75;
		}
	}
	beginEnter(e) {
		e.state = "enter";
		e.enterT = 0;
		const home = this.home(e);
		if (e.kind === "boss") {
			e.enterFromX = home.x;
			e.enterFromY = -40;
			e.enterCx = home.x + e.dir * this.W * .16;
			e.enterCy = Math.min(this.player.y - 180, home.y + this.H * .2);
		} else {
			e.enterFromX = e.dir < 0 ? -40 : this.W + 40;
			e.enterFromY = this.H * (.16 + e.row % 3 * .045);
			e.enterCx = e.dir < 0 ? this.W * .2 : this.W * .8;
			e.enterCy = Math.min(this.player.y - 160, home.y + this.H * .26);
		}
		e.x = e.enterFromX;
		e.y = e.enterFromY;
	}
	stepEnter(e, dt) {
		e.enterT += dt;
		const u = clamp(e.enterT / e.enterDur, 0, 1);
		const home = this.home(e);
		const t = ease(u);
		const o = 1 - t;
		e.x = o * o * e.enterFromX + 2 * o * t * e.enterCx + t * t * home.x;
		e.y = o * o * e.enterFromY + 2 * o * t * e.enterCy + t * t * home.y;
		e.spin = e.dir * (1 - u) * .6;
		if (u >= 1) {
			e.state = "form";
			e.spin = 0;
		}
	}
	scheduleDive() {
		const pool = this.enemies.filter((e) => e.alive && e.state === "form" && !e.pendingDive);
		if (!pool.length) return;
		const idx = this.combatIndex();
		const bosses = pool.filter((e) => e.kind === "boss");
		const wantBoss = bosses.length > 0 && Math.random() < Math.min(.48, .12 + idx * .05);
		const rest = pool.filter((e) => e.kind !== "boss");
		const pickFrom = wantBoss ? bosses : rest.length ? rest : pool;
		const bees = pickFrom.filter((e) => e.kind === "bee");
		const pick = !wantBoss && bees.length && Math.random() < .62 ? randPick(bees) : randPick(pickFrom);
		this.beginDive(pick);
	}
	canCapture() {
		if (this.combatIndex() < 2) return false;
		if (this.dual || this.capturedBoss >= 0 || !this.player.alive || this.flyer) return false;
		return Math.random() < Math.min(.5, .18 + (this.combatIndex() - 2) * .06);
	}
	beginDive(e, dir) {
		e.dir = dir ?? (Math.random() < .5 ? -1 : 1);
		e.launchX = e.x;
		e.launchY = e.y;
		e.aimX = this.player.alive ? this.player.x : this.W / 2;
		e.fireCd = .42;
		e.diveT = 0;
		e.escortIds = e.escortIds ?? [];
		const idx = this.combatIndex();
		const scale = Math.max(.58, 1 - (idx - 1) * .045);
		if (e.kind === "boss" && e.escortOf < 0 && this.canCapture()) {
			e.state = "beam";
			e.diveKind = "capture";
			e.beamT = 0;
			e.beamLock = 0;
			this.audio.dive();
			return;
		}
		e.state = "dive";
		e.diveKind = e.kind === "bee" ? "loop" : e.kind === "butterfly" ? "swoop" : "attack";
		e.diveDur = (e.kind === "boss" ? 3.25 : e.kind === "butterfly" ? 2.4 : 2.75) * scale;
		if (e.kind === "boss" && e.escortOf < 0) this.launchEscorts(e);
		this.audio.dive();
	}
	launchEscorts(boss) {
		const idx = this.combatIndex();
		let n = 0;
		if (idx >= 2 && Math.random() < .8) n = 1;
		if (idx >= 4 && Math.random() < .55) n = 2;
		const bees = this.enemies.filter((b) => b.alive && b.state === "form" && b.kind === "bee" && !b.pendingDive).sort((a, b) => Math.abs(a.col - boss.col) - Math.abs(b.col - boss.col) || a.row - b.row);
		boss.escortIds = [];
		for (let i = 0; i < n && i < bees.length; i++) {
			const b = bees[i];
			b.pendingDive = {
				at: this.time + .18 * (i + 1),
				dir: boss.dir,
				escortOf: boss.id
			};
			boss.escortIds.push(b.id);
		}
	}
	stepDive(e, dt) {
		e.diveT += dt;
		const t = clamp(e.diveT / e.diveDur, 0, 1);
		if (e.kind !== "bee" && this.player.alive) {
			const track = e.kind === "boss" ? .55 : .85;
			e.aimX += (this.player.x - e.aimX) * Math.min(1, dt * track);
		}
		const p = this.divePoint(e, t);
		e.spin = (p.x - e.x) * .012;
		e.x = p.x;
		e.y = p.y;
		if (t >= 1 || e.y > this.H + 36) this.startReturn(e);
	}
	divePoint(e, t) {
		const W = this.W;
		const H = this.H;
		const dir = e.dir;
		if (e.diveKind === "loop") {
			if (t < .72) {
				const u = t / .72;
				const p0x = e.launchX;
				const p0y = e.launchY;
				const p1x = e.launchX + dir * W * .32;
				const p1y = e.launchY + H * .02;
				const p2x = e.launchX + dir * W * .28;
				const p2y = H * .58;
				const p3x = e.aimX;
				const p3y = Math.min(H * .8, this.player.y - 10);
				const o = 1 - u;
				return {
					x: o * o * o * p0x + 3 * o * o * u * p1x + 3 * o * u * u * p2x + u * u * u * p3x,
					y: o * o * o * p0y + 3 * o * o * u * p1y + 3 * o * u * u * p2y + u * u * u * p3y
				};
			}
			const u = (t - .72) / .28;
			return {
				x: lerp(e.aimX, e.aimX - dir * W * .22, u),
				y: lerp(Math.min(H * .8, this.player.y - 10), H + 48, u)
			};
		}
		if (e.diveKind === "swoop") {
			const y = lerp(e.launchY, H + 40, t);
			return {
				x: lerp(e.launchX, e.aimX, Math.min(1, t * 1.3)) + Math.sin(t * Math.PI * 2.4) * W * .11 * dir,
				y
			};
		}
		const y = lerp(e.launchY, H + 36, t);
		return {
			x: lerp(e.launchX, e.aimX, Math.min(1, t * 1.05)) + Math.sin(t * Math.PI * 2) * W * .18 * dir,
			y
		};
	}
	stepBeam(e, dt) {
		const hoverY = Math.max(this.metrics().top + 20, this.H * .34);
		const track = this.W * (.22 + this.combatIndex() * .015);
		if (this.player.alive) {
			const dx = this.player.x - e.x;
			e.x += clamp(dx, -track * dt, track * dt);
		}
		e.y = lerp(e.y, hoverY, 1 - Math.exp(-3.2 * dt));
		e.beamT += dt;
		e.spin = Math.sin(this.clock * 8) * .1;
		const half = Math.max(26, this.W * .055);
		if (this.player.alive && this.player.invuln <= 0 && Math.abs(this.player.x - e.x) < half) {
			e.beamLock += dt;
			if (e.beamLock > .42) {
				this.capture(e);
				return;
			}
		} else e.beamLock = Math.max(0, e.beamLock - dt * 1.4);
		if (e.beamT > 2.55) {
			e.launchX = e.x;
			e.launchY = e.y;
			e.aimX = this.player.alive ? this.player.x : e.x;
			e.diveT = 0;
			e.diveDur = 1.45;
			e.diveKind = "attack";
			e.state = "dive";
		}
	}
	startReturn(e) {
		e.state = "return";
		e.returnT = 0;
		e.returnDur = .82;
		e.returnFromX = this.home(e).x + (Math.random() - .5) * 24;
		e.returnFromY = -32;
		e.x = e.returnFromX;
		e.y = e.returnFromY;
		e.spin = 0;
	}
	stepReturn(e, dt) {
		e.returnT += dt;
		const u = clamp(e.returnT / e.returnDur, 0, 1);
		const home = this.home(e);
		const t = ease(u);
		e.x = lerp(e.returnFromX, home.x, t);
		e.y = lerp(e.returnFromY, home.y, t);
		if (u >= 1) {
			e.state = "form";
			e.escortOf = -1;
		}
	}
	stepChallenge(dt) {
		this.chClock += dt;
		const m = this.metrics();
		for (const c of this.challengers) {
			if (!c.alive) continue;
			if (this.chClock < c.delay) continue;
			if (!c.active) c.active = true;
			c.t += dt;
			const u = c.t / c.dur;
			if (u >= 1) {
				c.alive = false;
				c.active = false;
				continue;
			}
			const baseY = this.safeTop + 70 + c.yRatio * (m.playerY - this.safeTop - 160);
			if (c.pattern === "sine") {
				c.x = c.flip ? this.W + 36 - (this.W + 72) * u : -36 + (this.W + 72) * u;
				c.y = baseY + Math.sin(u * Math.PI * c.loops) * (c.amp * this.H);
			} else {
				const travel = c.flip ? this.W + 36 - (this.W + 72) * u : -36 + (this.W + 72) * u;
				const ang = u * Math.PI * 2 * 1.35;
				c.x = travel + Math.cos(ang) * this.W * .055;
				c.y = baseY + Math.sin(ang) * this.H * .065;
			}
			c.spin = Math.sin(u * 12) * .2;
		}
		if (this.challengers.length && this.challengers.every((c) => !c.alive)) {
			if (this.challengers.every((c) => c.killed)) {
				this.addScore(1e4);
				this.showBanner("PERFECT", "+10000", 1.8);
				this.audio.perfect();
				this.clearT = 2;
			} else {
				this.showBanner("STAGE CLEAR", "", 1.35);
				this.audio.wave();
				this.clearT = 1.45;
			}
			this.phase = "clear";
			this.audio.startMusic("combat");
		}
	}
	tryShoot() {
		const need = this.dual ? 2 : 1;
		const live = this.bullets.reduce((n, b) => n + (b.alive && b.friendly ? 1 : 0), 0);
		const cap = this.dual ? 4 : 2;
		if (live + need > cap) return;
		const m = this.metrics();
		const y = this.player.y - m.emoji * .7;
		if (this.dual) {
			this.bullets.push({
				x: this.player.x - m.emoji * .55,
				y,
				vx: 0,
				vy: -this.H * 1.05,
				friendly: true,
				alive: true
			});
			this.bullets.push({
				x: this.player.x + m.emoji * .55,
				y,
				vx: 0,
				vy: -this.H * 1.05,
				friendly: true,
				alive: true
			});
		} else this.bullets.push({
			x: this.player.x,
			y,
			vx: 0,
			vy: -this.H * 1.05,
			friendly: true,
			alive: true
		});
		this.fireCd = .15;
		this.audio.shoot();
	}
	enemyShoot(e) {
		if (!this.player.alive) return;
		const dx = this.player.x - e.x;
		const dy = this.player.y - e.y;
		let ang = Math.atan2(dy, dx);
		const spread = Math.max(.06, .38 - this.combatIndex() * .035);
		ang += (Math.random() - .5) * spread;
		const sp = this.H * clamp(.3 + this.combatIndex() * .02, .3, .5);
		this.bullets.push({
			x: e.x,
			y: e.y + 10,
			vx: Math.cos(ang) * sp,
			vy: Math.sin(ang) * sp,
			friendly: false,
			alive: true
		});
		this.audio.enemyShot();
	}
	stepBullets(dt) {
		for (const b of this.bullets) {
			if (!b.alive) continue;
			b.x += b.vx * dt;
			b.y += b.vy * dt;
			if (b.y < -20 || b.y > this.H + 24 || b.x < -20 || b.x > this.W + 20) b.alive = false;
		}
		let w = 0;
		for (let i = 0; i < this.bullets.length; i++) if (this.bullets[i].alive) this.bullets[w++] = this.bullets[i];
		this.bullets.length = w;
	}
	stepBooms(dt) {
		for (const b of this.booms) b.t += dt;
		this.booms = this.booms.filter((b) => b.t < b.life);
		for (const p of this.popups) {
			p.t += dt;
			p.y -= dt * 28;
		}
		this.popups = this.popups.filter((p) => p.t < p.life);
	}
	stepFlyer(dt) {
		const f = this.flyer;
		if (!f) return;
		f.t += dt;
		const u = clamp(f.t / f.dur, 0, 1);
		const t = ease(u);
		if (f.kind === "capture") {
			const boss = this.enemies.find((e) => e.id === this.capturedBoss && e.alive);
			const tx = boss ? boss.x + 18 : f.sx;
			const ty = boss ? boss.y + 6 : 40;
			f.x = lerp(f.sx, tx, t);
			f.y = lerp(f.sy, ty, t) - Math.sin(u * Math.PI) * 20;
			if (u >= 1) this.flyer = null;
		} else {
			const tx = this.player.alive ? this.player.x : this.W / 2;
			const ty = this.player.y;
			f.x = lerp(f.sx, tx, t);
			f.y = lerp(f.sy, ty, t) - Math.sin(u * Math.PI) * 50;
			if (u >= 1) {
				this.flyer = null;
				if (this.player.alive && this.mode === "play") this.dual = true;
				else this.pendingDual = true;
			}
		}
	}
	collide() {
		const m = this.metrics();
		const pr = m.emoji * (this.dual ? .32 : .26);
		for (const b of this.bullets) {
			if (!b.alive || !b.friendly) continue;
			let hit = false;
			if (this.phase === "challenge") for (const c of this.challengers) {
				if (!c.alive || !c.active) continue;
				const r = m.emoji * (c.kind === "boss" ? .36 : .3);
				if (this.near(b.x, b.y, c.x, c.y, r + m.emoji * .12)) {
					b.alive = false;
					this.killChallenger(c);
					hit = true;
					break;
				}
			}
			if (hit) continue;
			for (const e of this.enemies) {
				if (!e.alive || e.state === "wait") continue;
				const r = m.emoji * (e.kind === "boss" ? .38 : .32);
				if (this.near(b.x, b.y, e.x, e.y, r)) {
					b.alive = false;
					this.killEnemy(e);
					break;
				}
			}
		}
		if (!this.player.alive || this.player.invuln > 0) return;
		for (const b of this.bullets) {
			if (!b.alive || b.friendly) continue;
			if (this.near(b.x, b.y, this.player.x, this.player.y, pr + 4)) {
				b.alive = false;
				this.killPlayer();
				return;
			}
			if (this.dual && this.near(b.x, b.y, this.player.x + m.emoji * .55, this.player.y, pr)) {
				b.alive = false;
				this.killPlayer();
				return;
			}
		}
		for (const e of this.enemies) {
			if (!e.alive || e.state === "wait" || e.state === "form") continue;
			const r = m.emoji * (e.kind === "boss" ? .34 : .28);
			if (this.near(e.x, e.y, this.player.x, this.player.y, r + pr * .65)) {
				this.killPlayer();
				return;
			}
		}
	}
	near(x1, y1, x2, y2, r) {
		const dx = x1 - x2;
		const dy = y1 - y2;
		return dx * dx + dy * dy <= r * r;
	}
	killEnemy(e) {
		e.alive = false;
		if (e.prisoner) {
			e.prisoner = false;
			this.capturedBoss = -1;
			this.addScore(1e3);
			this.popup(e.x, e.y - 16, "+1000", "#b8fff0");
			this.showBanner("RESCUED", "+1000", 1.15);
			this.audio.rescue();
			this.flyer = {
				x: e.x,
				y: e.y,
				sx: e.x,
				sy: e.y,
				t: 0,
				dur: .72,
				kind: "rescue"
			};
			this.player.invuln = Math.max(this.player.invuln, .8);
		}
		let pts = 50;
		const attacking = e.state === "dive" || e.state === "beam";
		if (e.kind === "bee") pts = attacking ? 100 : 50;
		else if (e.kind === "butterfly") pts = attacking ? 160 : 80;
		else if (attacking) {
			const escorts = e.escortIds.filter((id) => {
				const b = this.enemies.find((x) => x.id === id);
				return !!b && b.alive && b.escortOf === e.id && (b.state === "dive" || b.state === "beam");
			}).length;
			pts = escorts >= 2 ? 1600 : escorts === 1 ? 800 : 400;
		} else pts = 150;
		this.addScore(pts);
		this.popup(e.x, e.y, "+" + pts, e.kind === "boss" ? "#ffe08a" : "#f4fff8");
		this.boom(e.x, e.y, e.kind === "boss");
		this.audio.explode();
		if (!this.reduceMotion) this.shake = Math.min(7, this.shake + (e.kind === "boss" ? 4 : 2));
	}
	killChallenger(c) {
		c.alive = false;
		c.killed = true;
		c.active = false;
		this.addScore(c.points);
		this.popup(c.x, c.y, "+" + c.points, "#f4fff8");
		this.boom(c.x, c.y, c.kind === "boss");
		this.audio.explode();
	}
	killPlayer() {
		if (this.hurtLock || !this.player.alive || this.player.invuln > 0) return;
		this.hurtLock = true;
		if (this.dual) {
			this.dual = false;
			this.player.invuln = 1.8;
			this.boom(this.player.x + this.metrics().emoji * .5, this.player.y, false);
			this.audio.explode();
			if (!this.reduceMotion) this.shake = 5;
			return;
		}
		this.player.alive = false;
		this.lives -= 1;
		this.boom(this.player.x, this.player.y, true);
		this.audio.playerDie();
		this.flashA = .45;
		if (!this.reduceMotion) this.shake = 9;
		if (this.lives <= 0) {
			this.pendingOver = true;
			this.overAt = this.time + 1.15;
		} else this.respawnAt = this.time + 1.05;
	}
	capture(boss) {
		if (!this.player.alive || this.dual || this.capturedBoss >= 0) return;
		boss.prisoner = true;
		this.capturedBoss = boss.id;
		boss.state = "return";
		boss.returnT = 0;
		boss.returnDur = .95;
		boss.returnFromX = boss.x;
		boss.returnFromY = boss.y;
		this.flyer = {
			x: this.player.x,
			y: this.player.y,
			sx: this.player.x,
			sy: this.player.y,
			t: 0,
			dur: .7,
			kind: "capture"
		};
		this.player.alive = false;
		this.lives -= 1;
		this.audio.capture();
		this.showBanner("FIGHTER CAPTURED", "", 1.2);
		if (!this.reduceMotion) this.shake = 6;
		if (this.lives <= 0) {
			this.pendingOver = true;
			this.overAt = this.time + 1.35;
		} else this.respawnAt = this.time + 1.25;
	}
	addScore(n) {
		this.score += n;
		if (this.score > this.hi) {
			this.hi = this.score;
			this.persistHi();
		}
		while (this.lifeAwarded < this.lifeMarks.length && this.score >= this.lifeMarks[this.lifeAwarded]) {
			this.lifeAwarded++;
			this.lives = Math.min(9, this.lives + 1);
			this.audio.extra();
			this.showBanner("1UP", "", 1);
		}
	}
	persistHi() {
		try {
			localStorage.setItem(HI_KEY, String(this.hi));
		} catch {}
	}
	popup(x, y, text, color) {
		this.popups.push({
			x,
			y,
			text,
			t: 0,
			life: .75,
			color
		});
	}
	boom(x, y, big) {
		this.booms.push({
			x,
			y,
			t: 0,
			life: big ? .48 : .36,
			big
		});
	}
	showBanner(text, sub, dur) {
		this.banner = {
			text,
			sub,
			until: this.time + dur
		};
	}
	remaining() {
		if (this.phase === "challenge" || this.phase === "chIntro") return this.challengers.filter((c) => c.alive).length;
		return this.enemies.filter((e) => e.alive).length;
	}
	publish(force) {
		const snap = this.snapshot();
		const key = JSON.stringify(snap);
		if (!force && key === this.lastSnap) return;
		this.lastSnap = key;
		this.onSnap(snap);
	}
	snapshot() {
		return {
			mode: this.mode,
			score: this.score,
			hi: this.hi,
			lives: this.lives,
			wave: this.wave,
			left: this.remaining(),
			dual: this.dual,
			sound: this.soundOn,
			newRecord: this.newRecord
		};
	}
	emojiFont(size) {
		return `${Math.max(12, Math.round(size))}px "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Emoji"`;
	}
	drawEmoji(emoji, x, y, size, rot = 0, alpha = 1) {
		if (alpha < .35) return;
		const ctx = this.ctx;
		ctx.save();
		ctx.translate(x, y);
		if (rot) ctx.rotate(rot);
		ctx.font = this.emojiFont(size);
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(emoji, 0, 0);
		ctx.restore();
	}
	render() {
		const ctx = this.ctx;
		const { W, H } = this;
		ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
		ctx.clearRect(0, 0, W, H);
		ctx.fillStyle = "#000";
		ctx.fillRect(0, 0, W, H);
		const shake = this.reduceMotion ? 0 : this.shake;
		ctx.save();
		if (shake > .2) ctx.translate(Math.sin(this.clock * 48) * shake, Math.cos(this.clock * 41) * shake * .65);
		this.drawScenery();
		if (this.mode === "title") this.drawAttract();
		else {
			this.drawActors();
			this.drawPlayer();
			this.drawBullets();
			this.drawBooms();
			this.drawPopups();
			this.drawBanner();
		}
		ctx.restore();
		if (this.flashA > 0) {
			ctx.fillStyle = `rgba(255,40,40,${this.flashA * .35})`;
			ctx.fillRect(0, 0, W, H);
		}
		this.drawHud();
	}
	drawScenery() {
		const { W, H } = this;
		for (const p of this.planets) this.drawEmoji(p.emoji, p.nx * W, p.ny * H, p.size * (this.metrics().emoji / 28), 0, .85);
		for (const s of this.stars) {
			const tw = .45 + .55 * (.5 + .5 * Math.sin(this.clock * (1.2 + s.z) + s.phase));
			this.drawEmoji(s.emoji, s.nx * W, s.ny * H, s.size * (.55 + s.z * .7), 0, tw);
		}
	}
	drawAttract() {
		const m = this.metrics();
		const t = this.clock;
		const rows = [
			{
				emoji: "🛸",
				cols: 4,
				row: 0,
				inset: 3
			},
			{
				emoji: "🐙",
				cols: 8,
				row: 1,
				inset: 1
			},
			{
				emoji: "🦑",
				cols: 8,
				row: 2,
				inset: 1
			},
			{
				emoji: "👾",
				cols: 10,
				row: 3,
				inset: 0
			},
			{
				emoji: "👾",
				cols: 10,
				row: 4,
				inset: 0
			}
		];
		const sway = Math.sin(t * .7) * Math.min(30, m.spacingX);
		for (const row of rows) for (let i = 0; i < row.cols; i++) {
			const col = row.inset + i;
			const x = this.W / 2 + sway + (col - 4.5) * m.spacingX;
			const y = m.top + row.row * m.spacingY + Math.sin(t * 2.2 + i) * 2;
			const emoji = row.row === 2 && i % 2 ? "🪲" : row.emoji;
			this.drawEmoji(emoji, x, y, row.row === 0 ? m.emoji * 1.2 : m.emoji, Math.sin(t + i) * .05);
			if (row.row === 0) this.drawEmoji("👑", x, y - m.emoji * .55, m.emoji * .45);
		}
		const px = this.W / 2 + Math.sin(t * .85) * this.W * .18;
		this.drawEmoji("🔥", px, m.playerY + m.emoji * .45, m.emoji * .4, 0, .7 + .3 * Math.sin(t * 18));
		this.drawEmoji("🚀", px, m.playerY, m.emoji * 1.15, -.62);
		const shotY = t * 280 % (m.playerY - 40);
		this.drawEmoji("🔹", px, m.playerY - shotY, m.emoji * .38);
	}
	drawActors() {
		const m = this.metrics();
		const drawE = (e) => {
			if (!e.alive || e.state === "wait") return;
			const size = m.emoji * (e.kind === "boss" ? 1.22 : 1);
			this.drawEmoji(e.emoji, e.x, e.y, size, e.spin);
			if (e.kind === "boss") this.drawEmoji("👑", e.x, e.y - size * .48, size * .42);
			if (e.prisoner && !(this.flyer && this.flyer.kind === "capture")) this.drawEmoji("🚀", e.x + size * .7, e.y + size * .15, size * .55, -.62);
			if (e.state === "beam") this.drawBeam(e);
		};
		for (const e of this.enemies) if (e.state === "form" || e.state === "enter" || e.state === "return") drawE(e);
		for (const e of this.enemies) if (e.state === "dive" || e.state === "beam") drawE(e);
		for (const c of this.challengers) {
			if (!c.active || !c.alive) continue;
			const size = m.emoji * (c.kind === "boss" ? 1.18 : 1);
			this.drawEmoji(c.emoji, c.x, c.y, size, c.spin);
			if (c.kind === "boss") this.drawEmoji("👑", c.x, c.y - size * .48, size * .4);
		}
		if (this.flyer) {
			const spin = this.flyer.kind === "capture" ? -.62 + this.flyer.t * 4 : -.62;
			this.drawEmoji("🚀", this.flyer.x, this.flyer.y, m.emoji * .9, spin);
			this.drawEmoji("✨", this.flyer.x, this.flyer.y + 16, m.emoji * .35, 0, .8);
		}
	}
	drawBeam(e) {
		const m = this.metrics();
		const count = 7;
		const y0 = e.y + m.emoji * .4;
		const y1 = this.player.y - 8;
		for (let i = 0; i < count; i++) {
			const u = i / 6;
			const y = lerp(y0, y1, u);
			const wob = Math.sin(this.clock * 22 + i) * 5;
			const emoji = i % 2 === 0 ? "🔹" : "🔷";
			this.drawEmoji(emoji, e.x + wob, y, m.emoji * .42, 0, .55 + .45 * (1 - u * .3));
		}
		this.drawEmoji("🧲", e.x, e.y + m.emoji * .55, m.emoji * .5);
	}
	drawPlayer() {
		if (!this.player.alive) return;
		if (this.player.invuln > 0 && Math.floor(this.clock * 14) % 2 === 0) return;
		const m = this.metrics();
		const rot = -.62 + (this.mode === "play" ? this.moveX() : 0) * .16;
		const flameA = .55 + .45 * (.5 + .5 * Math.sin(this.clock * 28));
		if (this.dual) {
			const o = m.emoji * .55;
			this.drawEmoji("🔥", this.player.x - o, this.player.y + m.emoji * .42, m.emoji * .36, 0, flameA);
			this.drawEmoji("🔥", this.player.x + o, this.player.y + m.emoji * .42, m.emoji * .36, 0, flameA);
			this.drawEmoji("🚀", this.player.x - o, this.player.y, m.emoji, rot);
			this.drawEmoji("🚀", this.player.x + o, this.player.y, m.emoji, rot);
		} else {
			this.drawEmoji("🔥", this.player.x, this.player.y + m.emoji * .48, m.emoji * .4, 0, flameA);
			this.drawEmoji("🚀", this.player.x, this.player.y, m.emoji * 1.12, rot);
		}
	}
	drawBullets() {
		const m = this.metrics();
		for (const b of this.bullets) {
			if (!b.alive) continue;
			if (b.friendly) this.drawEmoji("🔹", b.x, b.y, m.emoji * .42);
			else this.drawEmoji(b.vy > this.H * .4 ? "🟠" : "🔴", b.x, b.y, m.emoji * .36);
		}
	}
	drawBooms() {
		const m = this.metrics();
		for (const b of this.booms) {
			const u = b.t / b.life;
			const frame = BOOM_FRAMES[Math.min(BOOM_FRAMES.length - 1, Math.floor(u * BOOM_FRAMES.length))];
			const size = m.emoji * (b.big ? 1.4 : 1) * (1 + u * .8);
			this.drawEmoji(frame, b.x, b.y, size, u * .4, 1 - u);
			this.drawEmoji("✨", b.x - size * .35, b.y - size * .2, size * .45, 0, (1 - u) * .9);
			this.drawEmoji("🔥", b.x + size * .3, b.y + size * .15, size * .4, 0, (1 - u) * .85);
		}
	}
	drawPopups() {
		const s = Math.max(2, Math.round(this.metrics().emoji / 16));
		for (const p of this.popups) {
			const a = 1 - p.t / p.life;
			this.ctx.globalAlpha = a;
			drawPixel(this.ctx, p.text, p.x, p.y, s, p.color, "center");
			this.ctx.globalAlpha = 1;
		}
	}
	drawBanner() {
		const b = this.banner;
		if (!b || this.time >= b.until) return;
		const left = b.until - this.time;
		let alpha = 1;
		if (left < .25) alpha = left / .25;
		1 - left / Math.max(.4, left);
		const { W } = this;
		let scale = Math.max(2, Math.round(Math.min(W, this.H) / 180));
		while (scale > 2 && textWidth(b.text, scale) > W * .88) scale--;
		const y = this.H * .46;
		const tw = textWidth(b.text, scale);
		const th = 7 * scale;
		this.ctx.globalAlpha = alpha * .55;
		this.ctx.fillStyle = "#000";
		this.ctx.fillRect(W / 2 - tw / 2 - 12, y - 8, tw + 24, th + (b.sub ? 7 * Math.max(2, scale - 1) + 10 : 0) + 16);
		this.ctx.globalAlpha = alpha;
		drawPixel(this.ctx, b.text, W / 2, y, scale, "#f3fff8", "center");
		if (b.sub) {
			const ss = Math.max(2, scale - 1);
			drawPixel(this.ctx, b.sub, W / 2, y + th + 8, ss, "#9ad7ff", "center");
		}
		this.ctx.globalAlpha = 1;
	}
	drawHud() {
		const { W } = this;
		const scale = clamp(Math.round(Math.min(W, this.H) / 240), 2, 4);
		const top = this.safeTop + 10;
		const lh = 7 * scale;
		if (this.mode === "title") {
			drawPixel(this.ctx, "HIGH SCORE", W / 2, top, scale, "#d5fff4", "center");
			drawPixel(this.ctx, pad$1(this.hi), W / 2, top + lh + 6, scale, "#ffffff", "center");
			this.drawEmoji("👑", W / 2 - textWidth("HIGH SCORE", scale) / 2 - scale * 6, top + lh / 2, lh);
			return;
		}
		const cols = [
			W * .17,
			W * .5,
			W * .83
		];
		const labels = [
			"HIGH",
			"SCORE",
			"LIVES"
		];
		const emojis = [
			"👑",
			"🏆",
			"❤️"
		];
		const values = [
			pad$1(this.hi),
			pad$1(this.score),
			""
		];
		for (let i = 0; i < 3; i++) {
			const cx = cols[i];
			const label = labels[i];
			const tw = textWidth(label, scale);
			const es = lh;
			const gx = cx - (es + 4 + tw) / 2;
			this.drawEmoji(emojis[i], gx + es / 2, top + lh / 2, es);
			drawPixel(this.ctx, label, gx + es + 4, top, scale, "#c8fff0", "left");
			if (i < 2) drawPixel(this.ctx, values[i], cx, top + lh + 5, scale, "#ffffff", "center");
			else this.drawHearts(cx, top + lh + 5 + 7 * scale / 2, scale);
		}
		const sub = Math.max(2, scale - 1);
		const subY = top + lh * 2 + 12;
		drawPixel(this.ctx, "WAVE " + String(this.wave).padStart(2, "0"), W * .3, subY, sub, "#9ad7ff", "center");
		const left = pad$1(this.remaining(), 2);
		this.drawEmoji("👾", W * .66, subY + 7 * sub / 2, 7 * sub);
		drawPixel(this.ctx, left, W * .66 + 7 * sub * .7, subY, sub, "#e6d4ff", "left");
		if (this.dual) this.drawEmoji("🚀", W * .9, subY + 7 * sub / 2, 7 * sub);
	}
	drawHearts(cx, y, scale) {
		const n = clamp(this.lives, 0, 6);
		if (n <= 0) {
			drawPixel(this.ctx, "0", cx, y - 7 * scale / 2, scale, "#ff8d8d", "center");
			return;
		}
		const hs = clamp(7 * scale * .95, 14, 26);
		const gap = hs * .92;
		const start = cx - (n - 1) * gap / 2;
		for (let i = 0; i < n; i++) this.drawEmoji("❤️", start + i * gap, y, hs);
		if (this.lives > 6) drawPixel(this.ctx, "+" + (this.lives - 6), cx, y + hs * .55, Math.max(2, scale - 1), "#ffd0d0", "center");
	}
};
var INITIAL = {
	mode: "title",
	score: 0,
	hi: 0,
	lives: 3,
	wave: 1,
	left: 40,
	dual: false,
	sound: true,
	newRecord: false
};
function pad(n) {
	return String(Math.max(0, Math.floor(n))).padStart(6, "0");
}
function GalagaGame() {
	const canvasRef = (0, import_react.useRef)(null);
	const touch = (0, import_react.useRef)({
		x: 0,
		fire: false,
		screenFire: false
	});
	const gameRef = (0, import_react.useRef)(null);
	const [snap, setSnap] = (0, import_react.useState)(INITIAL);
	const [portrait, setPortrait] = (0, import_react.useState)(true);
	const [knob, setKnob] = (0, import_react.useState)({
		x: 0,
		y: 0
	});
	const [fireDown, setFireDown] = (0, import_react.useState)(false);
	const stickId = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const game = new Galaga(canvas, touch.current, setSnap);
		gameRef.current = game;
		return () => {
			game.destroy();
			gameRef.current = null;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		const apply = () => setPortrait(window.innerHeight >= window.innerWidth * .92);
		apply();
		window.addEventListener("resize", apply);
		return () => window.removeEventListener("resize", apply);
	}, []);
	function begin() {
		gameRef.current?.poke();
		gameRef.current?.begin();
	}
	function onFireDown(e) {
		e.preventDefault();
		e.currentTarget.setPointerCapture(e.pointerId);
		touch.current.fire = true;
		setFireDown(true);
		const mode = gameRef.current?.mode;
		if (mode === "title" || mode === "over") begin();
		else gameRef.current?.poke();
	}
	function onFireUp(e) {
		e.preventDefault();
		touch.current.fire = false;
		setFireDown(false);
	}
	function stickFrom(e) {
		const r = e.currentTarget.getBoundingClientRect();
		const max = r.width * .34;
		let dx = e.clientX - (r.left + r.width / 2);
		let dy = e.clientY - (r.top + r.height / 2);
		const mag = Math.hypot(dx, dy) || 1;
		const clamped = Math.min(mag, max);
		dx = dx / mag * clamped;
		dy = dy / mag * clamped;
		const nx = dx / max;
		const ny = dy / max;
		const m = Math.hypot(nx, ny);
		const dz = .18;
		let out = 0;
		if (m > dz) {
			const scale = (m - dz) / .8200000000000001 / m;
			out = Math.max(-1, Math.min(1, nx * scale));
		}
		setKnob({
			x: dx,
			y: dy
		});
		touch.current.x = out;
		e.currentTarget.setAttribute("aria-valuenow", out.toFixed(2));
	}
	function onStickDown(e) {
		e.preventDefault();
		stickId.current = e.pointerId;
		e.currentTarget.setPointerCapture(e.pointerId);
		gameRef.current?.poke();
		stickFrom(e);
	}
	function onStickMove(e) {
		if (stickId.current !== e.pointerId) return;
		e.preventDefault();
		stickFrom(e);
	}
	function onStickUp(e) {
		if (stickId.current !== e.pointerId) return;
		e.preventDefault();
		stickId.current = null;
		setKnob({
			x: 0,
			y: 0
		});
		touch.current.x = 0;
		e.currentTarget.setAttribute("aria-valuenow", "0");
	}
	const playing = snap.mode === "play" || snap.mode === "pause" || snap.mode === "over";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: portrait ? "cabinet portrait" : "cabinet landscape",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				"aria-label": "Emoji Galaga playfield"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "scanlines",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "vignette",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "top-actions",
				children: [playing && snap.mode !== "over" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ghost",
					onClick: () => gameRef.current?.togglePause(),
					"aria-label": snap.mode === "pause" ? "Resume" : "Pause",
					children: snap.mode === "pause" ? "Resume" : "Pause"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "ghost",
					onClick: () => gameRef.current?.toggleSound(),
					"aria-pressed": !snap.sound,
					"aria-label": snap.sound ? "Mute sound" : "Enable sound",
					children: snap.sound ? "Sound on" : "Sound off"
				})]
			}),
			snap.mode === "title" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overlay",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "1981 arcade"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Emoji Galaga" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "lede",
							children: "A formation shooter rebuilt entirely from emoji. Ships dive, bosses capture, and a rescued fighter flies beside you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: begin,
							children: "Start"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "help",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Move" }), " Right thumb, or A D and arrows"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Fire" }), " Left thumb, Space, or tap"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pause" }), " P or Esc"] })
							]
						})
					]
				})
			}),
			snap.mode === "pause" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overlay",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "eyebrow",
							children: ["Wave ", String(snap.wave).padStart(2, "0")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Paused" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "scoreline",
							children: pad(snap.score)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "row",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn",
								onClick: () => gameRef.current?.resume(),
								children: "Resume"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "btn secondary",
								onClick: begin,
								children: "Restart"
							})]
						})
					]
				})
			}),
			snap.mode === "over" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overlay",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "panel",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "eyebrow",
							children: "Insert coin"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", { children: "Game over" }),
						snap.newRecord && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "record",
							children: "New record"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "totals",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Score" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: pad(snap.score) })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "High" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: pad(snap.hi) })] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "btn",
							onClick: begin,
							children: "Play again"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: fireDown ? "fire down" : "fire",
				"aria-label": "Fire",
				onPointerDown: onFireDown,
				onPointerUp: onFireUp,
				onPointerCancel: onFireUp,
				onContextMenu: (e) => e.preventDefault(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "fire-core",
					"aria-hidden": "true",
					children: "🔥"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "stick",
				role: "slider",
				"aria-label": "Move",
				"aria-valuemin": -1,
				"aria-valuemax": 1,
				"aria-valuenow": 0,
				"aria-orientation": "horizontal",
				onPointerDown: onStickDown,
				onPointerMove: onStickMove,
				onPointerUp: onStickUp,
				onPointerCancel: onStickUp,
				onContextMenu: (e) => e.preventDefault(),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "knob",
					style: { transform: `translate(${knob.x}px, ${knob.y}px)` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "thumb fire-label",
				children: "Fire"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "thumb stick-label",
				children: "Move"
			})
		]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GalagaGame, {});
}
//#endregion
export { Home as component };
