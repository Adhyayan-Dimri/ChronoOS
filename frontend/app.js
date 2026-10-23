/**
 * ChronoOS • Raycast Ultra Interactive Client & Creative Technology Engine
 * - Interactive Dynamic Dot Matrix Canvas Engine (Scroll Zoom, Red Waves & Shockwaves)
 * - 60FPS Holographic Cybernetic Cinema Architecture Visualizer (Zero External Video Dependencies)
 * - Synthesized Web Audio Acoustic Feedback (Clicks, Chimes, Sub-Bass Hums)
 * - Progressive Disclosure (Zen Spotlight Mode vs Scroll-Driven Executive Dossier)
 * - Multi-Tenant Authentication & Executive Sandbox Isolation (Sign In First, Zero Emojis)
 * - 3D Card Perspective Tilt Engine
 * - Amazon Bedrock Multi-Turn Tool Telemetry & MCP Streamable HTTP JSON-RPC 2.0
 * - Human-in-the-Loop Native Sheet (<dialog>) Authorization
 */
const API_BASE = window.CHRONOOS_BACKEND_URL || localStorage.getItem('CHRONOOS_BACKEND_URL') || window.location.origin;

// State Variables
let isListening = false;
let isSpeaking = false;
let speechRecognition = null;
let currentPendingAction = null;
let soundEnabled = true;
let audioCtx = null;
let activeTab = 'overview';
let isZenMode = false;

// User Session State (Defaults to SIGNED OUT on initial entry)
let currentUser = null;

// Check session storage for active session (only persists during active session)
try {
  const savedUser = sessionStorage.getItem('chrono_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    if (currentUser && currentUser.schedule && currentUser.schedule.length > 0) {
      window._lastScheduleTimeline = currentUser.schedule;
    }
  }
} catch (e) {
  console.log('Session storage initialized.');
}

// Seamlessly sync user profile & latest commitments from backend
if (currentUser && currentUser.email && !currentUser.is_demo) {
  fetch(`${API_BASE}/api/auth/me?email=${encodeURIComponent(currentUser.email)}`)
    .then(r => r.json())
    .then(data => {
      if (data && data.user) {
        currentUser = Object.assign({}, currentUser, data.user);
        if (currentUser.schedule) {
          window._lastScheduleTimeline = currentUser.schedule;
        }
        try { sessionStorage.setItem('chrono_user', JSON.stringify(currentUser)); } catch (e) {}
        if (activeTab === 'overview') {
          renderBriefingCard({ title: `Private Executive Briefing • ${currentUser.name}` });
        }
      }
    })
    .catch(() => {});
}

// DOM Elements
const micOrbBtn = document.getElementById('micOrbBtn');
const voiceTextInput = document.getElementById('voiceTextInput');
const speechText = document.getElementById('speechText');
const speechTimestamp = document.getElementById('speechTimestamp');
const multimodalWidgetArea = document.getElementById('multimodalWidgetArea');
const inspectorToggleBtn = document.getElementById('inspectorToggleBtn');
const displayInspectorPane = document.getElementById('displayInspectorPane');
const closeInspectorBtn = document.getElementById('closeInspectorBtn');
const traceFeed = document.getElementById('traceFeed');
const telemetryLatency = document.getElementById('telemetryLatency');
const telemetryModel = document.getElementById('telemetryModel');
const mcpPayloadJson = document.getElementById('mcpPayloadJson');
const soundToggleBtn = document.getElementById('soundToggleBtn');
const soundIconWrapper = document.getElementById('soundIconWrapper');
const viewModeToggleBtn = document.getElementById('viewModeToggleBtn');
const viewModeText = document.getElementById('viewModeText');
const clearInputBtn = document.getElementById('clearInputBtn');

// Auth & User Display Elements
const userPill = document.getElementById('userPill');
const userNameDisplay = document.getElementById('userNameDisplay');
const authPortalBtn = document.getElementById('authPortalBtn');
const authBtnText = document.getElementById('authBtnText');
const authPortalDialog = document.getElementById('authPortalDialog');
const workspaceBadgeText = document.getElementById('workspaceBadgeText');
const workspaceStatusDot = document.getElementById('workspaceStatusDot');

// Dialog Elements
const hitlDialog = document.getElementById('hitlDialog');
const dialogToken = document.getElementById('dialogToken');
const dialogRecipient = document.getElementById('dialogRecipient');
const dialogPayload = document.getElementById('dialogPayload');
const dialogApproveBtn = document.getElementById('dialogApproveBtn');

// Cinema Elements
const cinemaCanvas = document.getElementById('cinemaCanvas');
const cinemaPlayToggleBtn = document.getElementById('cinemaPlayToggleBtn');
const cinemaPlayIcon = document.getElementById('cinemaPlayIcon');
const cinemaAudioToggleBtn = document.getElementById('cinemaAudioToggleBtn');
const cinemaAudioIcon = document.getElementById('cinemaAudioIcon');
const cinemaProgressBar = document.getElementById('cinemaProgressBar');
const cinemaProgressFill = document.getElementById('cinemaProgressFill');
const cinemaTimecode = document.getElementById('cinemaTimecode');
const cinemaFullscreenBtn = document.getElementById('cinemaFullscreenBtn');

// SVG Icon Helpers (Zero Emojis)
const SVG_AUDIO_ON = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
const SVG_AUDIO_OFF = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>`;
const SVG_PAUSE = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
const SVG_PLAY = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;

// --------------------------------------------------------------------------
// 1. Synthesized Web Audio Sound Design Engine
// --------------------------------------------------------------------------

function initAudioContext() {
  if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
}

let audioEngineUnlocked = false;
function unlockAudioEngine() {
  if (audioEngineUnlocked) return;
  audioEngineUnlocked = true;
  initAudioContext();
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  if (window.speechSynthesis) {
    try {
      window.speechSynthesis.resume();
      if (typeof loadVoices === 'function') loadVoices();
    } catch (e) { }
  }
}
document.addEventListener('click', unlockAudioEngine, { passive: true });
document.addEventListener('keydown', unlockAudioEngine, { passive: true });

function playSound(type) {
  if (!soundEnabled) return;
  initAudioContext();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  if (type === 'click') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } else if (type === 'execute') {
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } else if (type === 'shockwave') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.35);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.35);
  } else if (type === 'success') {
    playChord([523.25, 659.25, 783.99, 1046.50], 0.3);
  } else if (type === 'alexa_wake') {
    // Signature Alexa two-tone rising chime: C5 (523.25 Hz) -> G5 (783.99 Hz)
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    const gain2 = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now);
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.08);
    gain2.gain.setValueAtTime(0.09, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.28);
  } else if (type === 'alexa_complete') {
    // Soft completion resolving chime: G5 (783.99 Hz) -> D5 (587.33 Hz)
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(783.99, now);
    osc.frequency.exponentialRampToValueAtTime(587.33, now + 0.22);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  }
}

function playChord(frequencies, duration) {
  if (!soundEnabled || !audioCtx) return;
  const now = audioCtx.currentTime;
  frequencies.forEach(freq => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.035, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + duration);
  });
}

// --------------------------------------------------------------------------
// 2. Interactive Dynamic Dot Matrix Canvas Engine (Ultra Edition)
// --------------------------------------------------------------------------

let triggerMatrixShockwave = null;

function initDotMatrix() {
  const canvas = document.getElementById('dotMatrixCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  window.addEventListener('mousemove', (e) => {
    mouse.targetX = e.clientX;
    mouse.targetY = e.clientY;
  });

  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollZoom = 1;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    scrollVelocity = Math.min(Math.abs(currentScrollY - lastScrollY) * 0.05, 2.5);
    lastScrollY = currentScrollY;
  }, { passive: true });

  const shockwaves = [];

  triggerMatrixShockwave = (originX, originY) => {
    shockwaves.push({
      x: originX || width / 2,
      y: originY || height / 2,
      radius: 0,
      maxRadius: Math.max(width, height) * 0.85,
      speed: 16,
      opacity: 1
    });
    playSound('shockwave');
  };

  window.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON' && !e.target.closest('button')) {
      triggerMatrixShockwave(e.clientX, e.clientY);
    }
  });

  const baseSpacing = 28;
  const baseRadius = 1.0;
  const maxRadius = 3.6;
  const proximity = 150;

  let frame = 0;

  function renderMatrix() {
    ctx.clearRect(0, 0, width, height);
    frame += 0.02;

    scrollVelocity *= 0.92;
    const targetZoom = 1.0 + Math.min(window.scrollY / 1000, 0.45) + scrollVelocity * 0.08;
    scrollZoom += (targetZoom - scrollZoom) * 0.1;

    mouse.x += (mouse.targetX - mouse.x) * 0.16;
    mouse.y += (mouse.targetY - mouse.y) * 0.16;

    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.opacity = Math.max(0, 1 - sw.radius / sw.maxRadius);
      if (sw.radius >= sw.maxRadius || sw.opacity <= 0) {
        shockwaves.splice(i, 1);
      }
    }

    const currentSpacing = baseSpacing * scrollZoom;
    const offsetX = (width % currentSpacing) / 2;
    const offsetY = (height % currentSpacing) / 2;

    for (let x = offsetX; x < width; x += currentSpacing) {
      for (let y = offsetY; y < height; y += currentSpacing) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const ambientWave = Math.sin(x * 0.012 + y * 0.012 + frame) * 0.4;

        let shockwaveFactor = 0;
        for (let s = 0; s < shockwaves.length; s++) {
          const sw = shockwaves[s];
          const distToShock = Math.sqrt((x - sw.x) ** 2 + (y - sw.y) ** 2);
          const waveDelta = Math.abs(distToShock - sw.radius);
          if (waveDelta < 60) {
            const factor = (1 - waveDelta / 60) * sw.opacity;
            if (factor > shockwaveFactor) shockwaveFactor = factor;
          }
        }

        if (dist < proximity || shockwaveFactor > 0.05) {
          const mouseRatio = dist < proximity ? (1 - dist / proximity) : 0;
          const combinedRatio = Math.min(mouseRatio + shockwaveFactor, 1);
          const radius = (baseRadius + (maxRadius - baseRadius) * combinedRatio) * scrollZoom;

          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 92, 122, ${0.25 + combinedRatio * 0.75})`;
          ctx.shadowColor = '#FF5C7A';
          ctx.shadowBlur = combinedRatio * 14;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          ctx.beginPath();
          ctx.arc(x, y, baseRadius * scrollZoom, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${0.05 + ambientWave * 0.035})`;
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(renderMatrix);
  }

  requestAnimationFrame(renderMatrix);
}

// --------------------------------------------------------------------------
// 3. 60FPS Holographic Cybernetic Cinema Visualizer Engine
// --------------------------------------------------------------------------

let cinemaPlaying = true;
let cinemaCurrentSec = 0;
let cinemaDuration = 140;
let cinemaAudioMuted = true;

const CINEMA_SCENES = [
  {
    id: 1,
    start: 0,
    end: 35,
    tag: "SCENE 1: EXECUTIVE TRIAGE & GLOBAL RADAR",
    desc: "Scene 1: Morning Executive Triage — Global radar synchronization, flight UA 482 delay reconciliation, and automated calendar conflict realignment."
  },
  {
    id: 2,
    start: 35,
    end: 70,
    tag: "SCENE 2: LEGAL REDLINE & MATRIX DIFF ENGINE",
    desc: "Scene 2: High-Speed Legal Scan — Automated clause comparison between Revision 3 and Revision 4, detecting Section 9.2 indemnification cap breach ($12M vs $5.5M ceiling)."
  },
  {
    id: 3,
    start: 70,
    end: 105,
    tag: "SCENE 3: BEDROCK GUARDRAIL INTERCEPT & MCP TREE",
    desc: "Scene 3: Amazon Bedrock Guardrail Forcefield — Hierarchical agent execution tree halted at Section 9.2 to enforce human-in-the-loop executive liability authorization."
  },
  {
    id: 4,
    start: 105,
    end: 140,
    tag: "SCENE 4: VOICE AUTHORIZATION & TOKEN DISPATCH",
    desc: "Scene 4: Multi-Modal Biometric Dispatch — 64-band frequency spectrum verification, TouchID signature check, and cryptographic token minting (ACT-AUTH-7F89B2)."
  }
];

function initCinemaVisualizer() {
  if (!cinemaCanvas) return;
  const ctx = cinemaCanvas.getContext('2d');

  // 4K Retina High-DPI Resolution Scaling
  const dpr = Math.min(window.devicePixelRatio || 2, 2.5);
  const logicalWidth = 1060;
  const logicalHeight = 480;

  cinemaCanvas.width = Math.round(logicalWidth * dpr);
  cinemaCanvas.height = Math.round(logicalHeight * dpr);
  cinemaCanvas.style.width = '100%';
  cinemaCanvas.style.height = '100%';
  ctx.scale(dpr, dpr);

  let width = logicalWidth;
  let height = logicalHeight;

  // Holographic particles for background atmosphere
  const dustParticles = [];
  for (let i = 0; i < 45; i++) {
    dustParticles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.4 + 0.1
    });
  }

  // Laser sparks for forcefield / diff
  const sparks = [];

  let animFrame = 0;
  let lastSceneIdx = -1;

  function renderCinema() {
    if (cinemaPlaying) {
      animFrame++;
      cinemaCurrentSec = (cinemaCurrentSec + 0.04) % cinemaDuration;

      const pct = (cinemaCurrentSec / cinemaDuration) * 100;
      if (cinemaProgressFill) {
        cinemaProgressFill.style.width = `${pct}%`;
      }

      if (cinemaTimecode) {
        const mins = Math.floor(cinemaCurrentSec / 60).toString().padStart(2, '0');
        const secs = Math.floor(cinemaCurrentSec % 60).toString().padStart(2, '0');
        const frames = Math.floor((cinemaCurrentSec % 1) * 30).toString().padStart(2, '0');
        cinemaTimecode.textContent = `00:${mins}:${secs}:${frames}`;
      }
    }

    // Determine current scene (0, 1, 2, or 3)
    const currentSceneIdx = Math.min(3, Math.floor(cinemaCurrentSec / 35));
    const sceneConfig = CINEMA_SCENES[currentSceneIdx];

    // Update scene HUD text and chapter pills if scene changed
    if (currentSceneIdx !== lastSceneIdx) {
      lastSceneIdx = currentSceneIdx;
      const tagEl = document.getElementById('cinemaSceneTag');
      const descEl = document.getElementById('cinemaSceneDescription');
      if (tagEl) tagEl.textContent = sceneConfig.tag;
      if (descEl) descEl.textContent = sceneConfig.desc;

      const pills = document.querySelectorAll('.chapter-pill');
      pills.forEach((p, idx) => {
        p.classList.toggle('active', idx === currentSceneIdx);
      });
    }

    ctx.clearRect(0, 0, width, height);

    // Deep Canvas Base
    ctx.fillStyle = '#060709';
    ctx.fillRect(0, 0, width, height);

    // Grid Matrix Background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw floating dust particles
    for (let p of dustParticles) {
      if (cinemaPlaying) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 92, 122, ${p.alpha})`;
      ctx.fill();
    }

    // ----------------------------------------------------------------------
    // SCENE RENDERING BASED ON ACTIVE PHASE
    // ----------------------------------------------------------------------
    if (currentSceneIdx === 0) {
      // ====================================================================
      // SCENE 1: Executive Triage & Global Radar
      // ====================================================================
      const radarCenterX = 300;
      const radarCenterY = 240;
      const radarRadius = 160;

      // Radar Concentric Rings
      for (let r = 1; r <= 4; r++) {
        ctx.beginPath();
        ctx.arc(radarCenterX, radarCenterY, (radarRadius / 4) * r, 0, Math.PI * 2);
        ctx.strokeStyle = r === 4 ? 'rgba(255, 92, 122, 0.5)' : 'rgba(255, 255, 255, 0.1)';
        ctx.lineWidth = r === 4 ? 1.5 : 1;
        ctx.stroke();
      }

      // Radar Azimuth Crosshairs
      ctx.beginPath();
      ctx.moveTo(radarCenterX - radarRadius - 10, radarCenterY);
      ctx.lineTo(radarCenterX + radarRadius + 10, radarCenterY);
      ctx.moveTo(radarCenterX, radarCenterY - radarRadius - 10);
      ctx.lineTo(radarCenterX, radarCenterY + radarRadius + 10);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.stroke();

      // Sweeping Radar Line with Glowing Arc Fan
      const sweepAngle = animFrame * 0.035;
      const sweepGrad = ctx.createRadialGradient(radarCenterX, radarCenterY, 5, radarCenterX, radarCenterY, radarRadius);
      sweepGrad.addColorStop(0, 'rgba(255, 92, 122, 0.4)');
      sweepGrad.addColorStop(1, 'rgba(255, 92, 122, 0.0)');

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(radarCenterX, radarCenterY);
      ctx.arc(radarCenterX, radarCenterY, radarRadius, sweepAngle - 0.45, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = sweepGrad;
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(radarCenterX, radarCenterY);
      ctx.lineTo(radarCenterX + Math.cos(sweepAngle) * radarRadius, radarCenterY + Math.sin(sweepAngle) * radarRadius);
      ctx.strokeStyle = '#FF5C7A';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF5C7A';
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();

      // Flight Path: SFO to JFK Parabolic Arc
      const sfoX = 170;
      const sfoY = 280;
      const jfkX = 430;
      const jfkY = 170;

      ctx.beginPath();
      ctx.moveTo(sfoX, sfoY);
      ctx.quadraticCurveTo(300, 100, jfkX, jfkY);
      ctx.strokeStyle = 'rgba(255, 92, 122, 0.6)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);

      // Nodes
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.arc(sfoX, sfoY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText("SFO (DEP)", sfoX - 45, sfoY + 4);

      ctx.fillStyle = '#10B981';
      ctx.beginPath();
      ctx.arc(jfkX, jfkY, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("JFK (ARR)", jfkX + 10, jfkY + 4);

      // Moving Flight Marker along the arc
      const flightT = ((animFrame * 0.008) % 1);
      const curFlightX = (1 - flightT) * (1 - flightT) * sfoX + 2 * (1 - flightT) * flightT * 300 + flightT * flightT * jfkX;
      const curFlightY = (1 - flightT) * (1 - flightT) * sfoY + 2 * (1 - flightT) * flightT * 100 + flightT * flightT * jfkY;

      ctx.save();
      ctx.beginPath();
      ctx.arc(curFlightX, curFlightY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#FF3D5C';
      ctx.shadowColor = '#FF3D5C';
      ctx.shadowBlur = 14;
      ctx.fill();

      // Flight transponder tag
      ctx.fillStyle = 'rgba(7, 8, 10, 0.85)';
      ctx.fillRect(curFlightX + 10, curFlightY - 22, 160, 26);
      ctx.strokeStyle = 'rgba(255, 92, 122, 0.5)';
      ctx.strokeRect(curFlightX + 10, curFlightY - 22, 160, 26);
      ctx.fillStyle = '#FF5C7A';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText("UA 482 [DELAY: +45 MIN]", curFlightX + 16, curFlightY - 6);
      ctx.restore();

      // Right Column: Calendar Reconciliation Dossier Panel
      const cardX = 570;
      const cardY = 70;
      const cardW = 440;
      const cardH = 340;

      ctx.fillStyle = 'rgba(11, 13, 16, 0.85)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(cardX, cardY, cardW, cardH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 13px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText("EXECUTIVE CALENDAR CONFLICT RESOLUTION", cardX + 20, cardY + 36);

      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(156, 156, 157, 0.9)';
      ctx.fillText("Trigger: Flight Delay UA 482 (45m shift)", cardX + 20, cardY + 56);

      // 3 Calendar Slots
      const slots = [
        { time: "11:00 AM - 12:00 PM", title: "Project Apex Strategy Review", status: "RESCHEDULED (+30M)", color: "#FF5C7A", alert: true },
        { time: "02:00 PM - 03:00 PM", title: "Acme Legal M&A Counter-Offer", status: "CRITICAL DEADLINE", color: "#F59E0B", alert: true },
        { time: "04:30 PM - 05:00 PM", title: "Executive Board Debrief", status: "ON SCHEDULE", color: "#10B981", alert: false }
      ];

      for (let s = 0; s < slots.length; s++) {
        const slot = slots[s];
        const slotY = cardY + 80 + s * 78;

        ctx.fillStyle = slot.alert ? 'rgba(255, 92, 122, 0.06)' : 'rgba(255, 255, 255, 0.02)';
        ctx.strokeStyle = slot.alert ? 'rgba(255, 92, 122, 0.3)' : 'rgba(255, 255, 255, 0.06)';
        ctx.beginPath();
        ctx.roundRect(cardX + 20, slotY, cardW - 40, 64, 8);
        ctx.fill();
        ctx.stroke();

        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.fillStyle = slot.color;
        ctx.fillText(slot.status, cardX + 34, slotY + 22);

        ctx.font = '600 12px Inter, sans-serif';
        ctx.fillStyle = '#F8FAFC';
        ctx.fillText(slot.title, cardX + 34, slotY + 40);

        ctx.font = '10px JetBrains Mono, monospace';
        ctx.fillStyle = 'rgba(156, 156, 157, 0.8)';
        ctx.fillText(slot.time, cardX + 34, slotY + 55);
      }

    } else if (currentSceneIdx === 1) {
      // ====================================================================
      // SCENE 2: High-Speed Legal Redline & Matrix Diff Engine
      // ====================================================================
      const colW = 460;
      const leftColX = 50;
      const rightColX = 550;
      const topY = 65;

      // Header labels
      ctx.font = '700 12px JetBrains Mono, monospace';
      ctx.fillStyle = 'rgba(156, 156, 157, 0.8)';
      ctx.fillText("BASELINE: CONTRACT REVISION 3 (ACCEPTED)", leftColX, topY);
      ctx.fillStyle = '#FF5C7A';
      ctx.fillText("PROPOSED: CONTRACT REVISION 4 (ACME CORP REDLINE)", rightColX, topY);

      // Document Containers
      const docH = 340;
      ctx.fillStyle = 'rgba(11, 13, 16, 0.8)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.roundRect(leftColX, topY + 15, colW, docH, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = 'rgba(17, 20, 26, 0.85)';
      ctx.strokeStyle = 'rgba(255, 92, 122, 0.35)';
      ctx.beginPath();
      ctx.roundRect(rightColX, topY + 15, colW, docH, 10);
      ctx.fill();
      ctx.stroke();

      // Contract Line Mockups
      ctx.font = '11px JetBrains Mono, monospace';
      const sampleLinesLeft = [
        "SECTION 8.1: Service Availability & SLA Commitments",
        "8.2: 99.95% uptime with penalty credits allocated monthly.",
        "SECTION 9.1: Mutual Representation and Standard Warranties",
        "SECTION 9.2: Indemnification Ceiling & Scope",
        "  Hard indemnification aggregate liability capped at $5,500,000.",
        "  Reciprocal indemnification applies to proprietary IP breaches.",
        "SECTION 12.1: Intellectual Property & Inventions",
        "SECTION 12.4: Foundation Model Rights",
        "  Customer receives run-time enterprise API access only."
      ];

      for (let l = 0; l < sampleLinesLeft.length; l++) {
        const lineY = topY + 45 + l * 28;
        ctx.fillStyle = (l === 4 || l === 5) ? 'rgba(56, 189, 248, 0.9)' : 'rgba(156, 156, 157, 0.6)';
        ctx.fillText(sampleLinesLeft[l], leftColX + 18, lineY);
      }

      const sampleLinesRight = [
        "SECTION 8.1: Service Availability & SLA Commitments",
        "8.2: 99.95% uptime with penalty credits allocated monthly.",
        "SECTION 9.1: Mutual Representation and Standard Warranties",
        "SECTION 9.2: [AMENDED BY ACME LEGAL COUNSEL]",
        "  [STRIKE] Hard indemnification liability capped at $5,500,000.",
        "  [ADD] Aggregate indemnification cap increased to $12,000,000.",
        "SECTION 12.1: Intellectual Property & Inventions",
        "SECTION 12.4: [AMENDED] Perpetual Foundation Model License",
        "  [ADD] Customer acquires non-exclusive perpetual model weights."
      ];

      for (let l = 0; l < sampleLinesRight.length; l++) {
        const lineY = topY + 45 + l * 28;
        if (l === 4) {
          ctx.fillStyle = '#FF4D4F';
          ctx.fillText(sampleLinesRight[l], rightColX + 18, lineY);
        } else if (l === 5) {
          ctx.fillStyle = '#FF5C7A';
          ctx.font = 'bold 11px JetBrains Mono, monospace';
          ctx.fillText(sampleLinesRight[l], rightColX + 18, lineY);
          ctx.font = '11px JetBrains Mono, monospace';
        } else if (l === 7 || l === 8) {
          ctx.fillStyle = '#F59E0B';
          ctx.fillText(sampleLinesRight[l], rightColX + 18, lineY);
        } else {
          ctx.fillStyle = 'rgba(156, 156, 157, 0.6)';
          ctx.fillText(sampleLinesRight[l], rightColX + 18, lineY);
        }
      }

      // Sweeping Laser Scan Beam across documents
      const scanY = topY + 20 + ((animFrame * 2.8) % (docH - 20));
      const laserGrad = ctx.createLinearGradient(0, scanY - 14, 0, scanY + 14);
      laserGrad.addColorStop(0, 'rgba(255, 92, 122, 0.0)');
      laserGrad.addColorStop(0.5, 'rgba(255, 92, 122, 0.45)');
      laserGrad.addColorStop(1, 'rgba(255, 92, 122, 0.0)');

      ctx.fillStyle = laserGrad;
      ctx.fillRect(leftColX, scanY - 14, colW * 2 + 40, 28);

      ctx.beginPath();
      ctx.moveTo(leftColX, scanY);
      ctx.lineTo(rightColX + colW, scanY);
      ctx.strokeStyle = '#FF5C7A';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF5C7A';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Diff Violation Callout Banner at Bottom
      ctx.fillStyle = 'rgba(255, 61, 92, 0.15)';
      ctx.strokeStyle = '#FF3D5C';
      ctx.beginPath();
      ctx.roundRect(rightColX + 15, topY + docH - 85, colW - 30, 65, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FF4D4F';
      ctx.font = '700 11px JetBrains Mono, monospace';
      ctx.fillText("! SECTION 9.2 POLICY VIOLATION DETECTED", rightColX + 30, topY + docH - 58);

      ctx.fillStyle = '#F8FAFC';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText("Unhedged Liability: +$6.5M above executive threshold ($5.5M max).", rightColX + 30, topY + docH - 38);

    } else if (currentSceneIdx === 2) {
      // ====================================================================
      // SCENE 3: Bedrock Guardrail Forcefield & Multi-Agent Tree
      // ====================================================================
      const cx = width / 2;
      const cy = height / 2 + 10;

      // Hexagonal Forcefield Shield in Center
      const hexRadius = 140;
      const hexPulse = Math.sin(animFrame * 0.08) * 6;

      ctx.save();
      ctx.translate(cx, cy);

      // Rotating Hex Rings
      for (let ring = 1; ring <= 3; ring++) {
        const r = (hexRadius + hexPulse) * (ring / 3);
        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (Math.PI / 3) * a + (ring % 2 === 0 ? animFrame * 0.01 : -animFrame * 0.01);
          const x = Math.cos(angle) * r;
          const y = Math.sin(angle) * r;
          if (a === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.strokeStyle = ring === 3 ? 'rgba(255, 92, 122, 0.8)' : 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = ring === 3 ? 2 : 1;
        ctx.stroke();
      }

      // Forcefield Core Amber/Red Glow
      const shieldGlow = ctx.createRadialGradient(0, 0, 10, 0, 0, hexRadius);
      shieldGlow.addColorStop(0, 'rgba(255, 92, 122, 0.35)');
      shieldGlow.addColorStop(0.7, 'rgba(245, 158, 11, 0.15)');
      shieldGlow.addColorStop(1, 'rgba(255, 92, 122, 0)');
      ctx.fillStyle = shieldGlow;
      ctx.fill();

      // Forcefield Title
      ctx.font = '700 12px Inter, sans-serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.fillText("AMAZON BEDROCK GUARDRAIL", 0, -12);
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText("MODEL: CLAUDE-3-5-SONNET", 0, 8);
      ctx.fillStyle = '#FF5C7A';
      ctx.fillText("STATUS: INTERCEPT ACTIVE", 0, 26);
      ctx.textAlign = 'left';

      ctx.restore();

      // Branching Tool Execution Tree Nodes
      const rootX = 140;
      const rootY = 240;

      // Root Orchestrator Node
      ctx.fillStyle = 'rgba(17, 20, 26, 0.95)';
      ctx.strokeStyle = '#FF5C7A';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(rootX - 90, rootY - 35, 180, 70, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 11px Inter, sans-serif';
      ctx.fillText("ChronoOS Orchestrator", rootX - 75, rootY - 10);
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillStyle = '#38BDF8';
      ctx.fillText("MCP Protocol Gateway", rootX - 75, rootY + 10);

      // Tool Nodes on Right
      const tools = [
        { name: "mcp_legal_evaluator", status: "TRIGGERED (9.2 BREACH)", color: "#FF5C7A", y: 110 },
        { name: "mcp_calendar_sync", status: "RESOLVED (+30M BUFFER)", color: "#10B981", y: 240 },
        { name: "mcp_slack_dispatch", status: "HELD FOR APPROVAL", color: "#F59E0B", y: 370 }
      ];

      for (let t of tools) {
        const tx = 880;
        const ty = t.y;

        // Connecting Laser Line with traveling data packet
        ctx.beginPath();
        ctx.moveTo(rootX + 90, rootY);
        ctx.bezierCurveTo(cx - 100, rootY, cx - 100, ty, tx - 100, ty);
        ctx.strokeStyle = 'rgba(255, 92, 122, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Animated traveling packet
        const packetT = ((animFrame * 0.015 + t.y * 0.005) % 1);
        const px = (1 - packetT) * (rootX + 90) + packetT * (tx - 100);
        const py = (1 - packetT) * rootY + packetT * ty;
        ctx.beginPath();
        ctx.arc(px, py, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.shadowColor = '#FF5C7A';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Tool Card
        ctx.fillStyle = 'rgba(11, 13, 16, 0.9)';
        ctx.strokeStyle = t.color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(tx - 100, ty - 30, 200, 60, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.fillText(t.name, tx - 85, ty - 8);

        ctx.fillStyle = t.color;
        ctx.font = '700 9px JetBrains Mono, monospace';
        ctx.fillText(t.status, tx - 85, ty + 12);
      }

      // Big Intercept Alert Banner
      ctx.fillStyle = 'rgba(255, 61, 92, 0.18)';
      ctx.strokeStyle = '#FF3D5C';
      ctx.beginPath();
      ctx.roundRect(cx - 240, height - 70, 480, 46, 23);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#FF5C7A';
      ctx.font = '700 11px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText("! HUMAN-IN-THE-LOOP SUSPENSION MANDATE ENGAGED", cx, height - 42);
      ctx.textAlign = 'left';

    } else {
      // ====================================================================
      // SCENE 4: Multi-Modal Voice Authorization & Cryptographic Token Minting
      // ====================================================================
      const cx = width / 2;
      const cy = height / 2;

      // 64-band High-Resolution Equalizer Spectrum
      const barsCount = 56;
      const barWidth = 5;
      const barGap = 6;
      const totalWidth = barsCount * (barWidth + barGap);
      const startX = (width - totalWidth) / 2;

      for (let b = 0; b < barsCount; b++) {
        const freqWave = Math.sin(animFrame * 0.08 + b * 0.18) * Math.cos(animFrame * 0.03 + b * 0.08);
        const barH = Math.abs(freqWave) * 85 + 8;
        const bx = startX + b * (barWidth + barGap);
        const by = cy + 90 - barH;

        const grad = ctx.createLinearGradient(0, by, 0, by + barH);
        grad.addColorStop(0, '#FF5C7A');
        grad.addColorStop(0.6, '#38BDF8');
        grad.addColorStop(1, 'rgba(56, 189, 248, 0.1)');

        ctx.fillStyle = grad;
        ctx.fillRect(bx, by, barWidth, barH);
      }

      // Oscilloscope Center Waveform Line
      ctx.beginPath();
      for (let ox = 50; ox < width - 50; ox += 6) {
        const sine = Math.sin((ox + animFrame * 4) * 0.02) * Math.cos((ox - animFrame * 2) * 0.015) * 35;
        const oy = cy - 70 + sine;
        if (ox === 50) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
      }
      ctx.strokeStyle = 'rgba(255, 92, 122, 0.7)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FF5C7A';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Biometric Rotating Concentric Target Rings in Center
      ctx.save();
      ctx.translate(cx, cy - 70);
      const ringAngle = animFrame * 0.025;

      ctx.beginPath();
      ctx.arc(0, 0, 60, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 45, ringAngle, 0, Math.PI * 2);
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(0, 0, 75, 45, -ringAngle, 0, Math.PI * 2);
      ctx.strokeStyle = '#FF5C7A';
      ctx.lineWidth = 1.4;
      ctx.stroke();

      ctx.restore();

      // Cryptographic Authorization Stamp Box
      const stampW = 540;
      const stampH = 75;
      const stampX = cx - stampW / 2;
      const stampY = cy + 120;

      ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
      ctx.strokeStyle = '#10B981';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(stampX, stampY, stampW, stampH, 12);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#10B981';
      ctx.font = '700 12px JetBrains Mono, monospace';
      ctx.textAlign = 'center';
      ctx.fillText("CRYPTOGRAPHIC ACTION TOKEN CONFIRMED: ACT-AUTH-7F89B2", cx, stampY + 28);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '11px JetBrains Mono, monospace';
      ctx.fillText("SHA-256: 0x9b2d8e417a89bc32... [VERIFIED VIA TOUCHID PASSKEY]", cx, stampY + 48);

      ctx.fillStyle = 'rgba(156, 156, 157, 0.85)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.fillText("Model Dispatch: Bedrock Claude 3.5 Sonnet -> Dispatched to Sarah Chen", cx, stampY + 65);
      ctx.textAlign = 'left';
    }

    requestAnimationFrame(renderCinema);
  }

  requestAnimationFrame(renderCinema);

  // Controls Event Listeners
  if (cinemaPlayToggleBtn) {
    cinemaPlayToggleBtn.addEventListener('click', toggleCinemaPlayback);
  }

  if (cinemaAudioToggleBtn) {
    cinemaAudioToggleBtn.addEventListener('click', () => {
      cinemaAudioMuted = !cinemaAudioMuted;
      cinemaAudioIcon.innerHTML = cinemaAudioMuted ? SVG_AUDIO_OFF : SVG_AUDIO_ON;
      if (!cinemaAudioMuted) {
        playSound('shockwave');
      } else {
        playSound('click');
      }
    });
  }

  if (cinemaFullscreenBtn) {
    cinemaFullscreenBtn.addEventListener('click', () => {
      const frame = document.querySelector('.cinema-theater-frame');
      if (frame && frame.requestFullscreen) {
        frame.requestFullscreen();
      }
    });
  }
}

function toggleCinemaPlayback() {
  cinemaPlaying = !cinemaPlaying;
  playSound('click');
  if (cinemaPlayIcon) {
    cinemaPlayIcon.innerHTML = cinemaPlaying ? SVG_PAUSE : SVG_PLAY;
  }
}

function seekCinemaChapter(seconds, title) {
  playSound('execute');
  cinemaCurrentSec = seconds;
  cinemaPlaying = true;
  if (cinemaPlayIcon) cinemaPlayIcon.innerHTML = SVG_PAUSE;

  const currentSceneIdx = Math.min(3, Math.floor(seconds / 35));
  const sceneConfig = CINEMA_SCENES[currentSceneIdx];

  const tagEl = document.getElementById('cinemaSceneTag');
  const descEl = document.getElementById('cinemaSceneDescription');
  if (tagEl) tagEl.textContent = sceneConfig.tag;
  if (descEl) descEl.textContent = sceneConfig.desc;

  document.querySelectorAll('.chapter-pill').forEach((pill, idx) => {
    pill.classList.toggle('active', idx === currentSceneIdx);
  });
}

function handleScrubClick(e) {
  const rect = e.currentTarget.getBoundingClientRect();
  const clickX = e.clientX - rect.left;
  const pct = Math.max(0, Math.min(clickX / rect.width, 1));
  cinemaCurrentSec = pct * cinemaDuration;
  playSound('click');
}

// --------------------------------------------------------------------------
// 4. User Authentication & Multi-Tenant State Isolation
// --------------------------------------------------------------------------

// Single universal now() temporal helper across the entire client
function getAppNow() {
  return new Date();
}

function formatAppDateLong(d = getAppNow()) {
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

// Global Browser Geolocation Cache
window._userGeo = {
  latitude: null,
  longitude: null,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
};

function requestUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        window._userGeo = {
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        };
        console.log("ChronoOS GPS location synchronized:", window._userGeo);
      },
      (err) => {
        console.log("Geolocation permission notice:", err.message);
        window._userGeo = {
          latitude: null,
          longitude: null,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        };
      },
      { timeout: 8000, maximumAge: 300000, enableHighAccuracy: false }
    );
  }
}

function updateUserDisplay() {
  const tabSignOutBtn = document.getElementById('tabSignOutBtn');
  const dateStr = formatAppDateLong();

  // Handle Initial Signed-Out State
  if (!currentUser) {
    userPill.classList.remove('demo-mode');
    userPill.classList.add('signed-out');
    userNameDisplay.textContent = 'Signed Out • Guest Access';
    workspaceBadgeText.textContent = `${dateStr} • Executive Gateway`;
    workspaceStatusDot.style.background = '#64748B';
    authBtnText.textContent = 'Sign In / Sandbox';
    if (tabSignOutBtn) tabSignOutBtn.style.display = 'none';

    speechText.textContent = "Welcome to ChronoOS. You are currently signed out. Please sign in to your workspace, create a new workspace, or launch the Demo Sandbox.";
    const senderTitle = document.getElementById('agentSenderTitle');
    if (senderTitle) senderTitle.textContent = "ChronoOS Executive Gateway";

    renderSignedOutCard();
    return;
  }

  userPill.classList.remove('signed-out');
  if (tabSignOutBtn) tabSignOutBtn.style.display = 'inline-flex';

  const senderTitle = document.getElementById('agentSenderTitle');
  if (senderTitle) senderTitle.textContent = "ChronoOS Chief of Staff";

  if (currentUser.is_demo) {
    userPill.classList.add('demo-mode');
    userNameDisplay.textContent = 'Alex Mercer (CEO • Demo)';
    workspaceBadgeText.textContent = `${dateStr} • Live Sandbox`;
    workspaceStatusDot.style.background = '#FF5C7A';
    authBtnText.textContent = 'Accounts';
  } else {
    userPill.classList.remove('demo-mode');
    userNameDisplay.textContent = `${currentUser.name} (${currentUser.organization || 'Private'})`;
    workspaceBadgeText.textContent = `${dateStr} • ${currentUser.organization || 'Private Workspace'}`;
    workspaceStatusDot.style.background = '#10B981';
    authBtnText.textContent = 'Accounts';
  }

  switchWorkspaceTab(activeTab);
}

function renderSignedOutCard() {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card gateway-hero-card">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#38BDF8; border-color:rgba(56,189,248,0.35);">EXECUTIVE GATEWAY</span>
          <h2 class="card-main-title">Welcome to ChronoOS</h2>
        </div>
        <span class="code-token" style="color:#64748B;">STATUS: SIGNED OUT</span>
      </div>

      <p style="font-size:14px; color:var(--color-secondary); line-height:1.6; margin-top:8px;">
        ChronoOS integrates enterprise schedules, legal contracts, and Amazon Bedrock multi-turn reasoning with tenant isolation. To access features, select one of the three options below:
      </p>

      <div class="gateway-trio-grid">
        <!-- 1. Sign In to Existing Workspace -->
        <div class="gateway-choice-tile choice-signin">
          <div>
            <div class="gateway-choice-icon" style="color:#38BDF8;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
            </div>
            <h3 class="gateway-choice-title">Sign In</h3>
            <p class="gateway-choice-desc">
              Log into your private enterprise workspace using your work credentials, security token, or biometric Passkey.
            </p>
          </div>
          <button class="gateway-btn-action gateway-btn-signin" onclick="openAuthPortal(); switchAuthTab('signin');">
            <span>Sign In to Workspace</span>
            <span>→</span>
          </button>
        </div>

        <!-- 2. Create Clean Private Workspace -->
        <div class="gateway-choice-tile choice-register">
          <div>
            <div class="gateway-choice-icon" style="color:#10B981;">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <h3 class="gateway-choice-title">Create Workspace</h3>
            <p class="gateway-choice-desc">
              Initialize a clean executive workspace for your enterprise. Zero dummy clutter with isolated private memory.
            </p>
          </div>
          <button class="gateway-btn-action gateway-btn-register" onclick="openAuthPortal(); switchAuthTab('register');">
            <span>Create New Workspace</span>
            <span>→</span>
          </button>
        </div>

        <!-- 3. Preloaded Demo Sandbox -->
        <div class="gateway-choice-tile choice-demo">
          <div>
            <div class="gateway-choice-icon" style="color:var(--color-primary);">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
            </div>
            <h3 class="gateway-choice-title">Demo Sandbox</h3>
            <p class="gateway-choice-desc">
              Test drive ChronoOS as Alex Mercer (CEO). Preloaded with Acme M&A contract disputes, redlines, and flight delays.
            </p>
          </div>
          <button class="gateway-btn-action gateway-btn-demo" onclick="launchDemoSandbox();">
            <span>Launch Demo Sandbox</span>
            <span>→</span>
          </button>
        </div>
      </div>

      <div style="margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.06); display:flex; justify-content:space-between; align-items:center; font-size:12px; color:rgba(255,255,255,0.5);">
        <span>Quick Voice Actions: Say "Sign In", "Create Workspace", "Launch Demo", or "Open YouTube" anytime.</span>
        <span class="code-token">AWS Bedrock • MCP 2.0</span>
      </div>
    </div>
  `;
  apply3DCardTilt();
}

function handleUserSignOut() {
  currentUser = null;
  sessionStorage.removeItem('chrono_user');
  localStorage.removeItem('chrono_user');
  closeAuthPortal();
  playSound('shockwave');
  updateUserDisplay();
  const msg = "You have signed out of ChronoOS. Welcome to the Executive Gateway.";
  speechText.textContent = msg;
  speechTimestamp.textContent = 'Just now';
  speakAgentResponse(msg);
}

function openAuthPortal() {
  playSound('click');
  authPortalDialog.showModal();
  switchAuthTab('signin');
}

function closeAuthPortal() {
  playSound('click');
  authPortalDialog.close();
}

function switchAuthTab(tab) {
  playSound('click');
  document.querySelectorAll('.auth-seg-btn').forEach(btn => btn.classList.remove('active'));
  document.getElementById('panelDemo').style.display = 'none';
  document.getElementById('panelSignIn').style.display = 'none';
  document.getElementById('panelRegister').style.display = 'none';

  if (tab === 'signin') {
    document.getElementById('tabSignIn').classList.add('active');
    document.getElementById('panelSignIn').style.display = 'flex';
  } else if (tab === 'register') {
    document.getElementById('tabRegister').classList.add('active');
    document.getElementById('panelRegister').style.display = 'flex';
  } else if (tab === 'demo') {
    document.getElementById('tabDemoMode').classList.add('active');
    document.getElementById('panelDemo').style.display = 'flex';
  }
}

function launchDemoSandbox() {
  currentUser = {
    name: 'Alex Mercer',
    email: 'alex.mercer@aetherdynamics.com',
    title: 'Chief Executive Officer',
    organization: 'Aether Dynamics Inc.',
    is_demo: true
  };
  sessionStorage.setItem('chrono_user', JSON.stringify(currentUser));
  closeAuthPortal();
  playSound('success');
  updateUserDisplay();

  const msg = "Switched to preloaded Executive Sandbox (Alex Mercer). Acme M&A redlines and flight UA 482 delay active.";
  speechText.textContent = msg;
  speechTimestamp.textContent = 'Just now';
  speakAgentResponse(msg);
}

async function handleUserSignIn() {
  const email = document.getElementById('signInEmail').value.trim();
  const password = document.getElementById('signInPassword').value;
  const errorEl = document.getElementById('signInError');
  if (errorEl) errorEl.style.display = 'none';

  if (!email || !password) {
    if (errorEl) {
      errorEl.textContent = 'Please enter both email and password.';
      errorEl.style.display = 'block';
    }
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, is_demo: false })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      currentUser = data.user;
      sessionStorage.setItem('chrono_user', JSON.stringify(currentUser));
      closeAuthPortal();
      playSound('success');
      updateUserDisplay();
      const welcomeMsg = `Welcome back to your private workspace, ${currentUser.name}. All your saved commitments and memories are loaded.`;
      speechText.textContent = welcomeMsg;
      speakAgentResponse(welcomeMsg);
    } else {
      if (errorEl) {
        errorEl.textContent = data.detail || data.error || 'Incorrect email or password. Access denied.';
        errorEl.style.display = 'block';
      }
      playSound('error');
    }
  } catch (err) {
    console.error('Sign in error:', err);
    if (errorEl) {
      errorEl.textContent = 'Connection error during authentication.';
      errorEl.style.display = 'block';
    }
  }
}

async function handleUserRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const organization = document.getElementById('regOrg').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('regConfirmPassword').value;
  const errorEl = document.getElementById('regError');
  if (errorEl) errorEl.style.display = 'none';

  if (password !== confirmPassword) {
    if (errorEl) {
      errorEl.textContent = 'Passwords do not match. Please re-enter identical passwords.';
      errorEl.style.display = 'block';
    }
    playSound('error');
    return;
  }

  if (password.length < 4) {
    if (errorEl) {
      errorEl.textContent = 'Password must be at least 4 characters long.';
      errorEl.style.display = 'block';
    }
    playSound('error');
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, organization, password, confirm_password: confirmPassword })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      currentUser = data.user;
      sessionStorage.setItem('chrono_user', JSON.stringify(currentUser));
      closeAuthPortal();
      playSound('success');
      updateUserDisplay();
      const welcomeMsg = `Clean private workspace created for ${currentUser.name} (${currentUser.organization}). Your account and data are secured.`;
      speechText.textContent = welcomeMsg;
      speakAgentResponse(welcomeMsg);
    } else {
      if (errorEl) {
        errorEl.textContent = data.detail || data.error || 'Registration failed. Please check inputs.';
        errorEl.style.display = 'block';
      }
      playSound('error');
    }
  } catch (err) {
    console.error('Registration error:', err);
    if (errorEl) {
      errorEl.textContent = 'Connection error during registration.';
      errorEl.style.display = 'block';
    }
  }
}

function simulateBiometricAuth() {
  playSound('shockwave');
  const btn = event.currentTarget;
  btn.textContent = "Verifying Passkey...";
  setTimeout(() => {
    btn.textContent = "Passkey Verified";
    handleUserSignIn();
  }, 750);
}

// --------------------------------------------------------------------------
// 5. 3D Card Perspective Tilt Engine
// --------------------------------------------------------------------------

function apply3DCardTilt() {
  const cards = document.querySelectorAll('.raycast-3d-card, .cinema-theater-frame');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -3.2;
      const rotateY = ((x - centerX) / centerX) * 3.2;

      card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.006, 1.006, 1.006)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// --------------------------------------------------------------------------
// 6. Progressive Disclosure & Scroll Coordination
// --------------------------------------------------------------------------

function scrollToDossier() {
  playSound('click');
  const dossierDeck = document.getElementById('dossierDeck');
  if (dossierDeck) {
    dossierDeck.scrollIntoView({ behavior: 'smooth' });
  }
}

function toggleViewMode() {
  isZenMode = !isZenMode;
  playSound('click');

  const dossierDeck = document.getElementById('dossierDeck');
  const scrollPrompt = document.getElementById('scrollPrompt');
  const cinemaShowcase = document.getElementById('cinemaShowcase');

  if (isZenMode) {
    viewModeToggleBtn.classList.add('active-mode');
    viewModeText.textContent = 'Zen Focus';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (dossierDeck) dossierDeck.style.opacity = '0.15';
    if (cinemaShowcase) cinemaShowcase.style.opacity = '0.15';
    if (scrollPrompt) scrollPrompt.style.display = 'none';
  } else {
    viewModeToggleBtn.classList.remove('active-mode');
    viewModeText.textContent = 'Dossier';
    if (dossierDeck) dossierDeck.style.opacity = '1';
    if (cinemaShowcase) cinemaShowcase.style.opacity = '1';
    if (scrollPrompt) scrollPrompt.style.display = 'flex';
    if (dossierDeck) dossierDeck.scrollIntoView({ behavior: 'smooth' });
  }
}

// --------------------------------------------------------------------------
// 7. Speech Recognition & Voice Interaction
// --------------------------------------------------------------------------

function showToast(message, type = 'info') {
  let toastContainer = document.getElementById('chronoToastContainer');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'chronoToastContainer';
    toastContainer.style.position = 'fixed';
    toastContainer.style.bottom = '24px';
    toastContainer.style.right = '24px';
    toastContainer.style.zIndex = '999999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    toastContainer.style.pointerEvents = 'none';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = `chrono-toast toast-${type}`;
  toast.style.pointerEvents = 'auto';
  toast.style.background = type === 'error' ? 'rgba(239, 68, 68, 0.95)' : type === 'warning' ? 'rgba(245, 158, 11, 0.95)' : 'rgba(15, 23, 42, 0.95)';
  toast.style.color = '#FFFFFF';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '10px';
  toast.style.fontSize = '13px';
  toast.style.fontFamily = 'var(--font-sans, -apple-system, sans-serif)';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.15)';
  toast.style.backdropFilter = 'blur(12px)';
  toast.style.maxWidth = '380px';
  toast.style.lineHeight = '1.45';
  toast.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
  toast.style.opacity = '0';
  toast.style.transform = 'translateY(10px) scale(0.96)';

  toast.innerHTML = `<strong style="display:block; margin-bottom:2px; font-weight:600;">${type === 'error' ? 'Microphone Alert' : type === 'warning' ? 'Notice' : 'ChronoOS'}</strong><div>${message}</div>`;
  toastContainer.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0) scale(1)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 4500);
}

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('SpeechRecognition API not available in this browser window.');
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = true; // Stream live transcript while speaking
  speechRecognition.lang = 'en-US';

  speechRecognition.onstart = () => {
    isListening = true;
    micOrbBtn.classList.add('recording');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.add('recording');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.add('active');
    const echoStatus = document.getElementById('echoVoiceStatus');
    if (echoStatus) echoStatus.textContent = 'Listening... Speak now';
    playSound('alexa_wake');
  };

  speechRecognition.onresult = (event) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const trans = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += trans;
      } else {
        interim += trans;
      }
    }

    const currentText = (final || interim).trim();
    if (currentText) {
      voiceTextInput.value = currentText;
      const echoStatus = document.getElementById('echoVoiceStatus');
      if (echoStatus) echoStatus.textContent = `"${currentText}"`;
    }

    // When final phrase is recognized
    if (final && final.trim()) {
      isListening = false;
      micOrbBtn.classList.remove('recording');
      const echoOrb = document.getElementById('echoMicOrbBtn');
      if (echoOrb) echoOrb.classList.remove('recording');
      const echoLight = document.getElementById('echoLightBar');
      if (echoLight) echoLight.classList.remove('active');
      const echoStatus = document.getElementById('echoVoiceStatus');
      if (echoStatus) echoStatus.textContent = 'Processing with Bedrock...';

      playSound('execute');
      try { speechRecognition.stop(); } catch (e) { }
      sendQuery(final.trim());
    }
  };

  speechRecognition.onerror = (event) => {
    console.warn('SpeechRecognition error encountered:', event.error);
    isListening = false;
    micOrbBtn.classList.remove('recording');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.remove('recording');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.remove('active');

    const echoStatus = document.getElementById('echoVoiceStatus');

    if (event.error === 'not-allowed') {
      showToast('Microphone access was blocked. Please click the camera/mic icon in your browser address bar and select "Always allow".', 'error');
      if (echoStatus) echoStatus.textContent = 'Microphone blocked • Allow in URL bar';
    } else if (event.error === 'no-speech') {
      if (echoStatus) echoStatus.textContent = 'No speech detected • Tap orb to speak';
    } else if (event.error === 'network') {
      showToast('Speech recognition service offline. You can also type your query directly into the prompt bar.', 'warning');
      if (echoStatus) echoStatus.textContent = 'Speech service offline • Type below';
    } else {
      if (echoStatus) echoStatus.textContent = 'Tap orb or say "Alexa..."';
    }
  };

  speechRecognition.onend = () => {
    isListening = false;
    micOrbBtn.classList.remove('recording');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.remove('recording');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.remove('active');
    const echoStatus = document.getElementById('echoVoiceStatus');
    if (echoStatus && !echoStatus.textContent.startsWith('"')) {
      echoStatus.textContent = 'Tap orb or say "Alexa..."';
    }
  };
}

async function toggleListening() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    showToast('Speech recognition is not supported in this browser. Please use Chrome or Edge, or type your query.', 'warning');
    return;
  }

  if (!speechRecognition) {
    initSpeechRecognition();
  }

  if (isListening) {
    try { speechRecognition.stop(); } catch (e) { }
    isListening = false;
    return;
  }

  // Explicitly prompt/verify audio hardware permissions via getUserMedia first
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(t => t.stop());
    }
  } catch (err) {
    console.warn('getUserMedia permission rejected or failed:', err);
    showToast('Microphone permission blocked. Please click the lock or microphone icon in your browser address bar to allow.', 'error');
    const echoStatus = document.getElementById('echoVoiceStatus');
    if (echoStatus) echoStatus.textContent = 'Mic blocked • Allow in URL bar';
    return;
  }

  try {
    speechRecognition.start();
  } catch (err) {
    console.error('Speech recognition failed to start:', err);
    try {
      speechRecognition.stop();
      setTimeout(() => {
        try { speechRecognition.start(); } catch (e) { }
      }, 250);
    } catch (e) {
      showToast('Could not start microphone: ' + (err.message || 'Busy'), 'error');
    }
  }
}

function simulateVoiceCommand(promptOverride = null) {
  let simulatedPrompts = [];
  if (!currentUser) {
    simulatedPrompts = [
      "Open YouTube",
      "Sign in to my workspace",
      "Launch demo sandbox",
      "Create clean private workspace"
    ];
  } else if (currentUser.is_demo) {
    simulatedPrompts = [
      "Alexa, give me my morning briefing",
      "What are my meetings today?",
      "What is our ARR and runway?",
      "Who is Sarah Chen?",
      "Alexa, inspect the Acme merger redline from Sarah",
      "Alexa, prepare a counter-offer rejecting the 12 million cap",
      "Alexa, check for travel buffer conflicts tomorrow"
    ];
  } else {
    simulatedPrompts = [
      "Alexa, what is on my schedule today?",
      "Alexa, schedule a strategic review with Elena at 3 PM",
      "Alexa, summarize my private executive status"
    ];
  }

  const chosen = promptOverride || simulatedPrompts[Math.floor(Math.random() * simulatedPrompts.length)];
  voiceTextInput.value = chosen;
  micOrbBtn.classList.add('recording');
  playSound('shockwave');

  setTimeout(() => {
    micOrbBtn.classList.remove('recording');
    sendQuery(chosen);
  }, 700);
}

// Global locked voice tracking to guarantee a single consistent voice and pitch
let cachedVoices = [];
let lockedAgentVoice = null;

function getLockedAgentVoice() {
  if (lockedAgentVoice) return lockedAgentVoice;
  if (!window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices() || [];
  if (!voices.length) return null;

  // Select a single premium English voice and lock it permanently
  lockedAgentVoice = voices.find(v => v.lang === 'en-US' && (v.name.includes('Natural') || v.name.includes('Jenny') || v.name.includes('Aria')))
    || voices.find(v => v.lang === 'en-US' && (v.name.includes('Zira') || v.name.includes('Google US English')))
    || voices.find(v => v.lang === 'en-US' && v.name.includes('David'))
    || voices.find(v => v.lang === 'en-US')
    || voices.find(v => v.lang && v.lang.startsWith('en'))
    || voices[0];

  return lockedAgentVoice;
}

function loadVoices() {
  if (!window.speechSynthesis) return;
  cachedVoices = window.speechSynthesis.getVoices();
  if (!lockedAgentVoice) {
    getLockedAgentVoice();
  }
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
}

let keepAliveInterval = null;

function speakAgentResponse(text) {
  if (!window.speechSynthesis || !soundEnabled) return;

  // 1. Release active speech recognition if listening so audio hardware is freed
  if (speechRecognition && isListening) {
    try { speechRecognition.stop(); } catch (e) { }
    isListening = false;
    micOrbBtn.classList.remove('recording');
  }

  // 2. Cancel any pending/previous speech completely before starting new one
  try {
    window.speechSynthesis.cancel();
  } catch (e) { }

  const cleanText = (text || '').replace(/[*_#`]/g, '').trim();
  if (!cleanText) return;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  // Strictly enforce constant, unvarying voice & pitch parameters
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  const singleVoice = getLockedAgentVoice();
  if (singleVoice) {
    utterance.voice = singleVoice;
    utterance.lang = singleVoice.lang || 'en-US';
  }

  isSpeaking = true;
  micOrbBtn.classList.add('speaking');

  // Prevent Garbage Collection in Chrome V8
  window._activeUtterance = utterance;

  utterance.onstart = () => {
    isSpeaking = true;
    micOrbBtn.classList.add('speaking');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.add('speaking');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.add('active');
    const echoTranscript = document.getElementById('echoSpeechTranscript');
    if (echoTranscript) echoTranscript.textContent = `"${cleanText}"`;
  };

  utterance.onend = () => {
    isSpeaking = false;
    micOrbBtn.classList.remove('speaking');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.remove('speaking');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.remove('active');
    window._activeUtterance = null;
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  utterance.onerror = (e) => {
    console.warn('Speech synthesis event error:', e);
    isSpeaking = false;
    micOrbBtn.classList.remove('speaking');
    const echoOrb = document.getElementById('echoMicOrbBtn');
    if (echoOrb) echoOrb.classList.remove('speaking');
    const echoLight = document.getElementById('echoLightBar');
    if (echoLight) echoLight.classList.remove('active');
    window._activeUtterance = null;
    if (keepAliveInterval) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  };

  if (keepAliveInterval) clearInterval(keepAliveInterval);
  // Safe liveness check that only cancels when done
  keepAliveInterval = setInterval(() => {
    if (!window.speechSynthesis.speaking) {
      clearInterval(keepAliveInterval);
      keepAliveInterval = null;
    }
  }, 1000);

  window.speechSynthesis.speak(utterance);
}

function replayCurrentSpeech() {
  playSound('click');
  const text = speechText.textContent.replace(/^"|"$/g, '').trim();
  if (text) {
    speakAgentResponse(text);
  }
}

// --------------------------------------------------------------------------
// 8. Form Submission & Agent Query Dispatcher
// --------------------------------------------------------------------------

function handleFormSubmit() {
  const val = voiceTextInput.value.trim();
  if (val) {
    sendQuery(val);
  }
}

async function sendQuery(promptText) {
  voiceTextInput.value = promptText;
  clearInputBtn.style.display = 'block';
  playSound('execute');

  const deckRect = document.getElementById('commandDeck').getBoundingClientRect();
  if (triggerMatrixShockwave) {
    triggerMatrixShockwave(deckRect.left + deckRect.width / 2, deckRect.top + deckRect.height / 2);
  }

  const cleanQuery = promptText.trim().toLowerCase();

  // 1. Direct Client-Side Action: Open YouTube
  if (cleanQuery.includes('open youtube') || cleanQuery.includes('launch youtube') || cleanQuery === 'youtube') {
    let opened = false;
    try {
      const win = window.open('https://www.youtube.com', '_blank');
      if (win && !win.closed && typeof win.closed !== 'undefined') {
        opened = true;
      }
    } catch (e) {
      opened = false;
    }

    const voiceMsg = opened
      ? "Opening YouTube for you now in a new tab."
      : "Opening YouTube. Click the Launch YouTube button on your screen if your browser blocked the new tab.";

    speechText.textContent = voiceMsg;
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse(voiceMsg);

    renderCardContent({
      type: 'ACTION_EXECUTED',
      title: 'Application Launched: YouTube',
      receipt: 'ACT-APP-YT-01',
      status: opened ? 'Chrome Browser Navigation Hook Executed' : 'Navigation Dispatched (Click Below to Open)',
      details: 'Navigating to https://www.youtube.com. Web browsers frequently restrict background tabs during speech recognition events. Click the button below to launch immediately.',
      actionUrl: 'https://www.youtube.com',
      actionLabel: 'Launch YouTube Directly'
    }, {});
    return;
  }

  // 2. Direct Client-Side Action: Open Google / Search
  if (cleanQuery.includes('open google') || cleanQuery.includes('launch google')) {
    window.open('https://www.google.com', '_blank');
    const msg = "Opening Google in a new tab.";
    speechText.textContent = msg;
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse(msg);
    renderCardContent({
      type: 'ACTION_EXECUTED',
      title: 'Application Launched: Google',
      receipt: 'ACT-APP-GOOG-01',
      status: 'External Navigation Dispatched',
      details: 'Navigating to https://www.google.com.',
      actionUrl: 'https://www.google.com',
      actionLabel: 'Open Google Directly'
    }, {});
    return;
  }

  // 3. Direct Auth & Workspace Commands
  if (cleanQuery === 'sign in' || cleanQuery.includes('sign in to') || cleanQuery === 'login') {
    openAuthPortal();
    switchAuthTab('signin');
    const msg = "Opening the Executive Sign In portal.";
    speechText.textContent = msg;
    speakAgentResponse(msg);
    return;
  }

  if (cleanQuery.includes('create workspace') || cleanQuery.includes('new workspace') || cleanQuery === 'register') {
    openAuthPortal();
    switchAuthTab('register');
    const msg = "Opening workspace registration form.";
    speechText.textContent = msg;
    speakAgentResponse(msg);
    return;
  }

  if (cleanQuery.includes('demo sandbox') || cleanQuery.includes('launch demo') || cleanQuery === 'demo') {
    launchDemoSandbox();
    return;
  }

  // 4. Direct Task Management Hook ("add task ...", "help me do this task ...")
  if (cleanQuery.startsWith('add task') || cleanQuery.startsWith('create task') || cleanQuery.includes('add this task')) {
    const taskText = promptText.replace(/^(alexa,\s*)?(add task|create task|add this task|help me do this task)\s*/i, '').trim() || "Executive Follow-up Action";
    addExecutiveTask(taskText);
    const respMsg = `Added task to your active executive queue: "${taskText}".`;
    speechText.textContent = respMsg;
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse(respMsg);
    return;
  }

  // 5. Require Authentication for Bedrock Agent Intelligence Queries
  if (!currentUser) {
    const authPrompt = "Welcome to ChronoOS. Please sign in to your workspace, create a new workspace, or launch the Demo Sandbox to begin.";
    speechText.textContent = authPrompt;
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse(authPrompt);
    openAuthPortal();
    renderSignedOutCard();
    return;
  }

  speechText.innerHTML = `<span style="color:var(--color-primary); font-weight:600;">ChronoOS Bedrock Agent Reasoning...</span> Evaluating tools via Model Context Protocol for ${currentUser.name}.`;
  speechTimestamp.textContent = 'Streaming...';

  const startTime = performance.now();

  try {
    const geoPayload = window._userGeo || {};
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: promptText,
        prompt: promptText,
        user_email: currentUser.email,
        email: currentUser.email,
        latitude: geoPayload.latitude !== undefined ? geoPayload.latitude : null,
        longitude: geoPayload.longitude !== undefined ? geoPayload.longitude : null,
        timezone: geoPayload.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
      })
    });

    const data = await res.json();
    const elapsed = Math.round(performance.now() - startTime);
    data.latency_ms = data.latency_ms || elapsed;

    renderAgentTurn(data);
  } catch (err) {
    console.error('Agent dispatch error:', err);
    speechText.textContent = "Agent communications gateway timed out. Please verify local Bedrock orchestrator.";
  }
}

// --------------------------------------------------------------------------
// 9. Render Agent Turn & Dynamic Cards
// --------------------------------------------------------------------------

function renderAgentTurn(data) {
  speechText.textContent = `"${data.voice_response}"`;
  speechTimestamp.textContent = 'Just now';

  // Update Provenance Badge ("Personal data" | "Web search" | "Local")
  const provBadge = document.getElementById('provenanceBadge');
  if (provBadge) {
    const prov = data.provenance || (data.visual_card && data.visual_card.provenance) || 'Local';
    provBadge.textContent = prov;
    provBadge.className = 'banner-provenance-badge';
    if (prov === 'Personal data') {
      provBadge.classList.add('badge-personal');
    } else if (prov === 'Web search') {
      provBadge.classList.add('badge-web');
    } else {
      provBadge.classList.add('badge-local');
    }
  }

  playSound('alexa_complete');
  speakAgentResponse(data.voice_response);

  renderInspectorTelemetry(data);

  if (data.visual_card) {
    renderCardContent(data.visual_card, data);
  }

  const dossier = document.getElementById('dossierDeck');
  if (dossier && !isZenMode) {
    dossier.scrollIntoView({ behavior: 'smooth' });
  }
}

function renderCardContent(card, data) {
  if (card && card.timeline && Array.isArray(card.timeline)) {
    window._lastScheduleTimeline = card.timeline;
    if (currentUser) {
      currentUser.schedule = card.timeline;
      try { sessionStorage.setItem('chrono_user', JSON.stringify(currentUser)); } catch (e) {}
    }
  }

  if (card.type === 'EXECUTIVE_BRIEFING') {
    renderBriefingCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'PERSONAL_BRIEFING') {
    renderPersonalBriefingCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'SCHEDULE_VIEW') {
    renderScheduleViewCard(card);
    activeTab = 'calendar';
    updateActiveTabUI('calendar');
  } else if (card.type === 'FINANCIAL_METRICS') {
    renderFinancialMetricsCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'STAKEHOLDER_PROFILE') {
    renderStakeholderProfileCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'PROJECT_OVERVIEW') {
    renderProjectOverviewCard(card);
    activeTab = 'legal';
    updateActiveTabUI('legal');
  } else if (card.type === 'CONTRACT_REDLINE_ANALYSIS') {
    renderContractRedlineCard(card);
    activeTab = 'legal';
    updateActiveTabUI('legal');
  } else if (card.type === 'TRAVEL_COLLISION_RESOLUTION') {
    renderTravelCollisionCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'FLIGHT_ITINERARY') {
    renderFlightItineraryCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'WEATHER_REPORT') {
    renderWeatherReportCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'TIME_DATE') {
    renderTimeDateCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'GREETING') {
    renderGreetingCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'WEB_SEARCH_RESULT') {
    renderWebSearchResultCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'TRAVEL_BUFFER_AUDIT') {
    renderTravelBufferAuditCard(card);
    activeTab = 'calendar';
    updateActiveTabUI('calendar');
  } else if (card.type === 'AMBIGUOUS_CLARIFICATION') {
    renderAmbiguousClarificationCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'PERSONAL_MEMORY') {
    renderPersonalMemoryCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'MEMORY_SAVED') {
    renderMemorySavedCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'MEMORY_PROMPT') {
    renderMemoryPromptCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'TASK_HELP') {
    renderTaskHelpCard(card);
    activeTab = 'calendar';
    updateActiveTabUI('calendar');
  } else if (card.type === 'CONFIRMATION_REQUIRED') {
    renderConfirmationCard(card);
    openHitlDialog(data.confirmation_needed);
  } else if (card.type === 'ACTION_EXECUTED') {
    renderExecutionCard(card);
  } else {
    renderGenericCard(card);
  }

  apply3DCardTilt();
  syncEchoShowContent();
}

function renderInspectorTelemetry(data) {
  telemetryLatency.textContent = `${data.latency_ms} ms`;
  if (data.bedrock_metadata && data.bedrock_metadata.model_id) {
    telemetryModel.textContent = data.bedrock_metadata.model_id;
  }

  traceFeed.innerHTML = '';

  // 1. Prominently display the Intent Routing Decision in Telemetry
  const routing = data.routing || (data.visual_card && data.visual_card.routing);
  if (routing && routing.intent) {
    const routeItem = document.createElement('div');
    routeItem.className = 'raycast-trace-item';
    routeItem.style.borderLeft = '3px solid #06b6d4';
    routeItem.style.background = 'rgba(6, 182, 212, 0.05)';
    routeItem.innerHTML = `
      <div class="trace-item-header" style="color:#06b6d4; font-weight:600; display:flex; justify-content:space-between; align-items:center;">
        <span>🎯 Intent Router Decision</span>
        <span class="tool-tag" style="background:#0891b2; color:#fff;">${routing.intent}</span>
      </div>
      <div class="trace-item-body" style="font-size:12px; margin-top:4px; line-height:1.5;">
        <div><strong>Assigned Tool:</strong> <code>${routing.tool || 'none'}</code> • <strong>Confidence:</strong> ${Math.round((routing.confidence || 0) * 100)}%</div>
        <div style="opacity:0.8; margin-top:2px;"><strong>Reason:</strong> ${routing.reason || 'Keyword and context pre-check'}</div>
      </div>
    `;
    traceFeed.appendChild(routeItem);
  }

  // 2. Render all trace events
  if (data.trace_events) {
    data.trace_events.forEach(evt => {
      const item = document.createElement('div');
      item.className = 'raycast-trace-item';
      if (evt.stage === 'Search Query Rewriting') {
        item.style.borderLeft = '3px solid #38bdf8';
        item.innerHTML = `
          <div class="trace-item-header" style="color:#38bdf8;">Query Rewriter • <span class="tool-tag">Cleaned</span></div>
          <div class="trace-item-body" style="font-size:12px;">
            <div><strong>Original:</strong> "${evt.original_query}"</div>
            <div style="color:#38bdf8; margin-top:3px;"><strong>Rewritten Search Query:</strong> "${evt.rewritten_query}"</div>
          </div>
        `;
      } else {
        item.innerHTML = `
          <div class="trace-item-header">${evt.stage} ${evt.tool ? `• <span class="tool-tag">${evt.tool}</span>` : ''}</div>
          <div class="trace-item-body">${evt.detail || (evt.args ? JSON.stringify(evt.args) : (evt.source ? `${evt.source}: ${evt.status || 'verified'}` : 'Operation verified.'))}</div>
        `;
      }
      traceFeed.appendChild(item);
    });
  }

  if (data.tools_invoked && data.tools_invoked.length > 0) {
    const lastTool = data.tools_invoked[data.tools_invoked.length - 1];
    mcpPayloadJson.textContent = JSON.stringify(lastTool, null, 2);
  }
}

// --------------------------------------------------------------------------
// 10. Card Layout Generators
// --------------------------------------------------------------------------

function renderBriefingCard(card) {
  if (!currentUser) {
    renderSignedOutCard();
    return;
  }

  if (!currentUser.is_demo) {
    const sched = (card && card.timeline) || (currentUser && currentUser.schedule) || window._lastScheduleTimeline || [];
    renderPersonalBriefingCard({
      title: (card && card.title) || `Private Executive Briefing • ${currentUser.name}`,
      organization: currentUser.organization,
      commitments_count: (card && card.commitments_count !== undefined) ? card.commitments_count : sched.length,
      alerts_count: 0,
      timeline: sched
    });
    return;
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="briefingCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge">Daily Digest</span>
          <h2 class="card-main-title">${card.title || 'Executive Intelligence Briefing'}</h2>
        </div>
        <span class="card-subtitle-tag">Aether Dynamics Inc. • Demo Sandbox</span>
      </div>

      <div class="raycast-metrics-grid">
        <div class="metric-tile">
          <div class="metric-tile-label">Meetings Today</div>
          <div class="metric-tile-val">4 Commitments</div>
          <div class="metric-tile-tag highlight-tag">High Stakes at 2:00 PM</div>
        </div>
        <div class="metric-tile">
          <div class="metric-tile-label">Active Alerts</div>
          <div class="metric-tile-val alert-red">2 Urgent</div>
          <div class="metric-tile-tag">Legal Redline & Flight Delay</div>
        </div>
        <div class="metric-tile">
          <div class="metric-tile-label">ARR & Runway</div>
          <div class="metric-tile-val">$64.2M</div>
          <div class="metric-tile-tag">+34% YoY • 29.4 mo</div>
        </div>
      </div>

      <div class="raycast-alert-list">
        <div class="raycast-alert-item critical-alert">
          <span class="alert-dot-critical"></span>
          <div class="alert-text-body">
            <div class="alert-row-heading">Acme Corp Merger: $12M Indemnification Cap Redline</div>
            <div class="alert-row-desc">General Counsel Sarah Chen flagged Section 9.2: Acme altered cap from $5M to $12M. Decision required before 2:00 PM negotiation call.</div>
          </div>
          <button class="btn-raycast-action alert-action-btn" onclick="sendQuery('Alexa, inspect the Acme merger redline from Sarah')">
            <span>Inspect Redline</span>
            <span class="action-arrow">→</span>
          </button>
        </div>

        <div class="raycast-alert-item warning-alert">
          <span class="alert-dot-warning"></span>
          <div class="alert-text-body">
            <div class="alert-row-heading">Flight UA 482 SFO → JFK Delayed 45m</div>
            <div class="alert-row-desc">United Airlines alert: Arrival pushed to 08:35 AM EDT. Conflicts with 9:00 AM keynote prep buffer at Midtown HQ.</div>
          </div>
          <button class="btn-raycast-action alert-action-btn" onclick="sendQuery('Alexa, check for travel buffer conflicts tomorrow')">
            <span>Resolve Buffer</span>
            <span class="action-arrow">→</span>
          </button>
        </div>
      </div>

      <div class="schedule-container">
        <div class="schedule-section-label">Today's Executive Commitments</div>
        <div class="schedule-stack">
          <div class="schedule-entry">
            <span class="time-slot">09:00 - 09:30</span>
            <span class="entry-name">Executive Leadership Daily Standup</span>
            <span class="entry-badge">Internal Leadership</span>
          </div>
          <div class="schedule-entry">
            <span class="time-slot">11:00 - 12:15</span>
            <span class="entry-name">Q3 Board Deck Final Review (Elena Rostova)</span>
            <span class="entry-badge">Board Governance</span>
          </div>
          <div class="schedule-entry active-stakes">
            <span class="time-slot">14:00 - 15:00</span>
            <span class="entry-name">Project Apex: M&A Due Diligence & Legal Call</span>
            <span class="entry-badge stakes-badge">High Stakes Negotiation</span>
          </div>
          <div class="schedule-entry">
            <span class="time-slot">16:30 - 17:30</span>
            <span class="entry-name">Global Partner Ecosystem Keynote Rehearsal</span>
            <span class="entry-badge">External Keynote</span>
          </div>
        </div>
      </div>

    </div>
  `;
}

function renderPersonalBriefingCard(card) {
  if (!currentUser) {
    renderSignedOutCard();
    return;
  }

  const timeline = (card && card.timeline) || (currentUser && currentUser.schedule) || window._lastScheduleTimeline || [];
  const commitmentsCount = (card && card.commitments_count !== undefined) ? card.commitments_count : timeline.length;

  let scheduleEntriesHtml = '';
  if (timeline.length > 0) {
    scheduleEntriesHtml = timeline.map(entry => {
      const timeVal = entry.time || `${entry.start || '10:00'} - ${entry.end || '11:00'}`;
      const titleVal = entry.title || 'Executive Task';
      const statusVal = entry.status || 'Confirmed';
      return `
        <div class="schedule-entry">
          <span class="time-slot">${timeVal}</span>
          <span class="entry-name">${titleVal}</span>
          <span class="entry-badge" style="color:#10b981; border-color:rgba(16,185,129,0.3);">${statusVal}</span>
        </div>
      `;
    }).join('');
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="briefingCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.3);">Private Workspace</span>
          <h2 class="card-main-title">${card.title || `Private Executive Briefing • ${currentUser.name}`}</h2>
        </div>
        <span class="card-subtitle-tag">${currentUser.organization}</span>
      </div>

      <div class="raycast-metrics-grid">
        <div class="metric-tile">
          <div class="metric-tile-label">Personal Schedule</div>
          <div class="metric-tile-val">${commitmentsCount} Commitments</div>
          <div class="metric-tile-tag">${commitmentsCount === 0 ? 'Clear Calendar Slate' : 'Active Agenda • Synced'}</div>
        </div>
        <div class="metric-tile">
          <div class="metric-tile-label">Active Alerts</div>
          <div class="metric-tile-val" style="color:#10b981;">0 Active</div>
          <div class="metric-tile-tag">No Conflicts Detected</div>
        </div>
        <div class="metric-tile">
          <div class="metric-tile-label">Episodic Graph</div>
          <div class="metric-tile-val">Online</div>
          <div class="metric-tile-tag">Private Tenant Memory</div>
        </div>
      </div>

      ${timeline.length > 0 ? `
      <div class="schedule-container" style="margin-top:16px;">
        <div class="schedule-section-label">Today's Executive Commitments (${commitmentsCount})</div>
        <div class="schedule-stack">
          ${scheduleEntriesHtml}
        </div>
      </div>
      ` : ''}

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px 24px; display:flex; flex-direction:column; gap:12px; margin-top:${timeline.length > 0 ? '16px' : '0'};">
        <div style="font-size:15px; font-weight:600; color:var(--color-on-surface);">${timeline.length > 0 ? 'Executive Operations Console' : 'Your Clean Executive Canvas'}</div>
        <p style="font-size:13px; color:var(--color-secondary); line-height:1.55;">
          ${timeline.length > 0 
            ? 'Your private executive schedule is synchronized in real time. Use voice or quick actions to schedule more meetings, verify travel buffers, or check contract redlines.' 
            : 'You are logged into your private, isolated account. You will not see random demo data or dummy M&A items here. Use voice or command inputs to schedule your real meetings, add memory context, or inspect your own contracts.'}
        </p>
        <div style="display:flex; flex-wrap:wrap; gap:10px; margin-top:4px;">
          <button class="btn-raycast-action" onclick="sendQuery('add task Review Q3 marketing strategy at 3:00 PM')">+ Add Task</button>
          <button class="btn-raycast-action" onclick="sendQuery('how can i add my tasks')">ℹ️ How to Schedule</button>
          <button class="btn-raycast-action" onclick="sendQuery('What are my meetings today?')">View Schedule</button>
          <button class="btn-raycast-action" onclick="openAuthPortal()">Switch User</button>
        </div>
      </div>
    </div>
  `;
}

function renderContractRedlineCard(card) {
  if (!currentUser) {
    renderSignedOutCard();
    return;
  }

  if (!currentUser.is_demo) {
    multimodalWidgetArea.innerHTML = `
      <div class="raycast-3d-card">
        <div class="card-beam-glow"></div>
        <div class="card-topbar">
          <div class="card-title-group">
            <span class="card-badge" style="color:#38bdf8; border-color:rgba(56,189,248,0.3);">Legal Analysis Workspace</span>
            <h2 class="card-main-title">Private Legal & Redline Engine</h2>
          </div>
          <span class="card-subtitle-tag">${currentUser.name} • ${currentUser.organization}</span>
        </div>
        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:24px; display:flex; flex-direction:column; gap:12px;">
          <div style="font-size:16px; font-weight:600; color:var(--color-on-surface);">No Active Contract Redlines in Private Workspace</div>
          <p style="font-size:14px; color:var(--color-secondary); line-height:1.55;">
            You have not attached any draft agreements to your personal executive ledger yet. You can speak to Alexa or paste a contract clause to trigger automated Bedrock liability parsing and guardrail verification.
          </p>
          <div style="display:flex; gap:10px; margin-top:8px;">
            <button class="btn-raycast-action" onclick="openAuthPortal()">Switch to Demo Sandbox for Acme M&A</button>
          </div>
        </div>
      </div>
    `;
    return;
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:var(--color-primary); border-color:rgba(255,92,122,0.35);">Legal Risk Assessment</span>
          <h2 class="card-main-title">${card.title || 'Project Apex M&A Contract Redlines'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.parties || 'Aether Dynamics vs Acme Corp'}</span>
      </div>

      <div class="redline-diff-box">
        <div class="redline-diff-header">
          <div>
            <strong style="font-size:15px; color:var(--color-on-surface);">Section 9.2: Indemnification Liability Cap</strong>
            <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">Dispute detected by Bedrock Guardrail: Executive Liability Exceeded</div>
          </div>
          <span class="sheet-badge">VIOLATION INTERCEPTED</span>
        </div>

        <div class="redline-columns-grid">
          <div class="diff-col-box diff-original">
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase; font-weight:600; margin-bottom:8px;">Approved Board Mandate (Draft 3)</div>
            <div style="line-height:1.6;">"Seller aggregate liability under this agreement shall be capped at <span style="color:#10b981; font-weight:600;">$5,000,000 USD</span>, strictly subject to standard representation qualifiers."</div>
          </div>

          <div class="diff-col-box diff-violation">
            <div style="font-size:11px; color:var(--color-primary); text-transform:uppercase; font-weight:600; margin-bottom:8px;">Acme Redline (Draft 4 - Sarah Chen Flag)</div>
            <div style="line-height:1.6;"><span class="diff-strike">"Seller aggregate liability shall be capped at $5,000,000"</span> → Replaced with <span class="diff-alert-val">"$12,000,000 USD uncapped IP exposure"</span>.</div>
          </div>
        </div>

        <div style="font-size:13px; color:var(--color-secondary); border-left:3px solid var(--color-primary); padding-left:14px; line-height:1.55; margin-top:6px;">
          <strong style="color:var(--color-on-surface);">Autonomous Chief of Staff Analysis:</strong> Acme's redline introduces $7M in unhedged corporate liability. Episodic memory indicates CEO Alex Mercer strictly instructed a $5.5M ceiling in the Aug 14 strategy session.
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px;">
        <span style="font-size:13px; color:var(--color-secondary);">Decision needed prior to 2:00 PM negotiation call.</span>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, prepare a counter-offer rejecting the 12 million cap')">
          <span>Draft Counter-Offer via Bedrock</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderTravelCollisionCard(card) {
  const flight = card.flight_details || {
    flight: "United Airlines UA 482 (SFO ➔ JFK)",
    delay: "+45 Minutes Maintenance Delay",
    scheduled_arrival: "07:15 AM EDT",
    projected_arrival: "08:35 AM EDT",
    manhattan_transit: "50 Minutes Transit"
  };
  const resolution = card.resolution || {
    action: "Autonomously Shifted Strategy Review (+30m)",
    original_slot: "11:00 AM - 12:15 PM",
    new_slot: "11:30 AM - 12:45 PM",
    secured_buffer: "25-Minute Executive Buffer",
    attendees_notified: ["David Ross (CFO)", "Elena Rostova (Board)"]
  };

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" style="border-color:rgba(16,185,129,0.5);">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Autonomous Collision Mediation</span>
          <h2 class="card-main-title">${card.title || 'Flight UA 482 Delay & Schedule Re-Alignment'}</h2>
        </div>
        <span class="buffer-secured-badge">25M BUFFER SECURED</span>
      </div>

      <div class="travel-collision-box">
        <div class="telemetry-strip">
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Flight Telemetry</span>
            <span class="telemetry-cell-val" style="color:#38bdf8;">${flight.flight}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Transponder Status</span>
            <span class="telemetry-cell-val" style="color:#FF5C7A;">${flight.delay}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Estimated Touchdown</span>
            <span class="telemetry-cell-val">${flight.projected_arrival}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Manhattan Transit</span>
            <span class="telemetry-cell-val">${flight.manhattan_transit}</span>
          </div>
        </div>

        <div class="resolution-shift-timeline">
          <div style="font-size:11px; color:#10b981; font-family:var(--font-mono); font-weight:700; text-transform:uppercase;">Autonomous Mitigation Executed</div>
          <div class="timeline-shift-row">
            <div>
              <div style="font-size:14px; font-weight:600; color:#FFF;">Project Apex Strategy Review</div>
              <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
                <span style="text-decoration:line-through; opacity:0.6;">${resolution.original_slot}</span> ➔ <span style="color:#10b981; font-weight:600;">${resolution.new_slot}</span> (+30 min shift)
              </div>
            </div>
            <span class="buffer-secured-badge">${resolution.secured_buffer}</span>
          </div>
          <div style="font-size:12px; color:var(--color-secondary); margin-top:4px;">
            Attendees dispatched instant reschedule notice: <strong style="color:#F8FAFC;">${(resolution.attendees_notified || []).join(', ')}</strong>.
          </div>
        </div>

        <div style="font-size:13px; color:var(--color-secondary); border-left:3px solid #38bdf8; padding-left:14px; line-height:1.55;">
          <strong style="color:var(--color-on-surface);">Episodic Rule Applied:</strong> CEO Alex Mercer requires a minimum 45-minute airport buffer when traversing JFK transit corridors. ChronoOS autonomously preserved corporate punctuality without executive cognitive friction.
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px;">
        <span style="font-size:13px; color:var(--color-secondary);">Calendar updated and attendees notified automatically.</span>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, give me my morning briefing')">
          <span>View Updated Schedule</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;

  // Dynamically update Echo Show left-hand glance widgets
  const echoCommitmentMeta = document.getElementById('echoCommitmentMeta');
  if (echoCommitmentMeta) {
    echoCommitmentMeta.textContent = '11:30 AM - 12:45 PM • Board Room A';
  }
  const echoCommitmentNote = document.getElementById('echoCommitmentNote');
  if (echoCommitmentNote) {
    echoCommitmentNote.textContent = 'Autonomously shifted +30m • 25m Safe Buffer Secured';
  }
  const echoTravelBadge = document.getElementById('echoTravelBadge');
  if (echoTravelBadge) {
    echoTravelBadge.textContent = 'RESOLVED • +30M';
    echoTravelBadge.style.color = '#10B981';
    echoTravelBadge.style.borderColor = 'rgba(16, 185, 129, 0.4)';
  }
  const echoTravelNote = document.getElementById('echoTravelNote');
  if (echoTravelNote) {
    echoTravelNote.textContent = 'Transit buffer violation resolved by Chief of Staff';
  }
}

function renderFlightItineraryCard(card) {
  const origin = card.origin || 'Bengaluru (BLR)';
  const destination = card.destination || 'Delhi (DEL)';
  const date = card.date || 'Upcoming';
  const carrier = card.carrier || 'Air India AI 804';
  const departure = card.departure_time || '08:30 AM';
  const arrival = card.arrival_time || '11:15 AM';
  const duration = card.duration || '2h 45m (Non-stop)';
  const bufferNote = card.airport_buffer || 'Secured 90m Departure Buffer';
  const seatClass = card.seat_class || 'Executive Business Class';

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" style="border-color: rgba(56, 189, 248, 0.55);">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#38bdf8; border-color:rgba(56, 189, 248, 0.35);">
            FLIGHT SCHEDULED • CALENDAR SYNCHRONIZED
          </span>
          <h2 class="card-main-title">${card.title || 'Executive Flight Itinerary'}</h2>
        </div>
        <span class="buffer-secured-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">CONFIRMED</span>
      </div>

      <div class="travel-collision-box">
        <div style="background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(16,185,129,0.06)); border: 1px solid rgba(56,189,248,0.25); border-radius:12px; padding: 18px 22px; display:flex; align-items:center; justify-content:space-between; margin-bottom: 16px;">
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); letter-spacing:0.06em; font-family:var(--font-mono);">Origin</div>
            <div style="font-size:20px; font-weight:700; color:#F8FAFC; margin-top:2px;">${origin}</div>
            <div style="font-size:12px; color:#38bdf8; margin-top:2px;">Depart: ${departure}</div>
          </div>
          <div style="display:flex; flex-direction:column; align-items:center; gap:4px;">
            <span style="font-size:18px;">✈️</span>
            <div style="height:2px; width:80px; background:linear-gradient(90deg, #38bdf8, #10b981); border-radius:2px;"></div>
            <span style="font-size:11px; color:var(--color-secondary); font-family:var(--font-mono);">${duration}</span>
          </div>
          <div style="text-align:right;">
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); letter-spacing:0.06em; font-family:var(--font-mono);">Destination</div>
            <div style="font-size:20px; font-weight:700; color:#F8FAFC; margin-top:2px;">${destination}</div>
            <div style="font-size:12px; color:#10b981; margin-top:2px;">Arrive: ${arrival}</div>
          </div>
        </div>

        <div class="telemetry-strip">
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Carrier & Aircraft</span>
            <span class="telemetry-cell-val" style="color:#38bdf8;">${carrier}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Date of Travel</span>
            <span class="telemetry-cell-val" style="color:#FFF;">${date}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Cabin Class</span>
            <span class="telemetry-cell-val" style="color:#10b981;">${seatClass}</span>
          </div>
          <div class="telemetry-cell">
            <span class="telemetry-cell-label">Travel Buffer</span>
            <span class="telemetry-cell-val">${bufferNote}</span>
          </div>
        </div>

        <div style="font-size:13px; color:var(--color-secondary); border-left:3px solid #10b981; padding-left:14px; line-height:1.55; margin-top:14px;">
          <strong style="color:var(--color-on-surface);">Autonomous Travel Integration:</strong> Flight commitment has been entered into your executive calendar. Airport check-in reminders and ground transit buffers have been automatically scheduled.
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Synchronized with Echo Show 15 Smart Display.</span>
        <div style="display:flex; gap:10px;">
          <button class="btn-raycast-action" onclick="sendQuery('What are my meetings today?')">View Schedule</button>
          <button class="btn-raycast-action alert-action-btn" onclick="sendQuery('Tell me the weather today')">Destination Weather</button>
        </div>
      </div>
    </div>
  `;

  // Dynamically update Echo Show left-hand glance widgets
  const echoCommitmentName = document.getElementById('echoCommitmentName');
  if (echoCommitmentName) {
    echoCommitmentName.textContent = `Flight: ${origin} ➔ ${destination}`;
  }
  const echoCommitmentMeta = document.getElementById('echoCommitmentMeta');
  if (echoCommitmentMeta) {
    echoCommitmentMeta.textContent = `${date} • ${departure} (${carrier})`;
  }
  const echoCommitmentNote = document.getElementById('echoCommitmentNote');
  if (echoCommitmentNote) {
    echoCommitmentNote.textContent = bufferNote;
  }
  const echoCommitmentBadge = document.getElementById('echoCommitmentBadge');
  if (echoCommitmentBadge) {
    echoCommitmentBadge.textContent = 'SCHEDULED';
    echoCommitmentBadge.style.color = '#38bdf8';
  }
}

let isCameraShutterClosed = false;

function toggleEchoCameraShutter() {
  isCameraShutterClosed = !isCameraShutterClosed;
  const housing = document.getElementById('echoCameraHousing');
  const loc = document.getElementById('echoDeviceLocation');

  playSound('click');

  if (isCameraShutterClosed) {
    if (housing) housing.classList.add('shutter-closed');
    if (loc) {
      loc.textContent = 'Camera Privacy Shutter Closed (Mic Only)';
      loc.style.color = '#FF5C7A';
    }
  } else {
    if (housing) housing.classList.remove('shutter-closed');
    if (loc) {
      loc.textContent = 'Executive Suite • Echo Show 15';
      loc.style.color = 'var(--color-secondary)';
    }
  }
}

function renderConfirmationCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" style="border-color:rgba(255,92,122,0.6);">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="sheet-badge">HUMAN AUTHORIZATION REQUIRED</span>
          <h2 class="card-main-title">${card.title}</h2>
        </div>
        <span class="code-token">${card.token}</span>
      </div>

      <div class="sheet-meta-box">
        <div class="sheet-field-row">
          <span class="sheet-field-title">Target Recipient</span>
          <span class="sheet-field-text">${card.recipient}</span>
        </div>
        <div class="sheet-field-row payload-row">
          <span class="sheet-field-title">Drafted Dispatch</span>
          <div class="sheet-payload-code">${card.payload}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--color-outline); padding-top:16px;">
        <button class="btn-sheet-cancel" onclick="sendQuery('Alexa, cancel this action')">Reject Action</button>
        <button class="btn-sheet-approve" onclick="openHitlDialogCurrent()">
          <span>Review & Authorize</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderExecutionCard(card) {
  const hasActionUrl = !!card.actionUrl;
  const isYouTube = card.title.toLowerCase().includes('youtube') || (card.actionUrl && card.actionUrl.includes('youtube'));

  const actionButtonHtml = hasActionUrl ? `
    <div style="margin-top: 20px; display:flex; flex-direction:column; gap:10px;">
      <a href="${card.actionUrl}" target="_blank" rel="noopener noreferrer" class="btn-direct-launch-action ${isYouTube ? 'yt-launch-glow' : ''}" id="directActionLaunchBtn">
        ${isYouTube ? `
          <svg viewBox="0 0 24 24" width="22" height="22" fill="#FFFFFF"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
        ` : `
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        `}
        <span>${card.actionLabel || 'Launch External Application'} ↗</span>
      </a>
      <span style="font-size:12px; color:rgba(255,255,255,0.6); line-height:1.4;">
        Browser security prevents background popups during asynchronous speech recognition. Click the button above to launch immediately in a fresh tab.
      </span>
    </div>
  ` : '';

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Execution Receipt</span>
          <h2 class="card-main-title">${card.title}</h2>
        </div>
        <span class="code-token" style="color:#10b981;">${card.receipt || 'ACT-EXEC-01'}</span>
      </div>

      <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-md); padding:24px;">
        <div style="font-size:16px; font-weight:600; color:var(--color-on-surface); margin-bottom:6px;">${card.status}</div>
        <div style="font-size:14px; color:var(--color-secondary); line-height:1.5;">${card.details}</div>
        ${actionButtonHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px; margin-top:20px;">
        <span style="font-size:13px; color:var(--color-secondary);">Official ChronoOS audit trail generated.</span>
        <button class="btn-raycast-action" onclick="updateUserDisplay()">
          ← Return to Dashboard
        </button>
      </div>
    </div>
  `;
  apply3DCardTilt();
}

function renderCalendarTravelCard() {
  if (!currentUser) {
    renderSignedOutCard();
    return;
  }

  // Gather active commitments from session or cache
  const timeline = (currentUser && currentUser.schedule && currentUser.schedule.length > 0)
    ? currentUser.schedule
    : (window._lastScheduleTimeline || (currentUser.is_demo ? [
        { time: "09:00 - 09:30", title: "Executive Leadership Daily Standup", location: "Boardroom Alpha & Zoom", attendees: "Alex Mercer, David Ross (CFO), Maya Patel (CTO), Sarah Chen (GC)", status: "Confirmed", type: "meeting" },
        { time: "11:00 - 12:15", title: "Q3 Board Deck Final Review", location: "Zoom Room 4", attendees: "Alex Mercer, David Ross (CFO), Elena Rostova (Board)", status: "Confirmed", type: "meeting" },
        { time: "14:00 - 15:00", title: "Project Apex: M&A Due Diligence & Legal Redlines", location: "Conf Call - Secure Bridge 09", attendees: "Alex Mercer, Sarah Chen (GC), Acme Corp Legal", status: "Critical", type: "negotiation", priority: "critical" },
        { time: "16:30 - 17:30", title: "Global Partner Ecosystem Keynote Rehearsal", location: "Main Stage Studio", attendees: "Alex Mercer, Communications Team", status: "Confirmed", type: "presentation" }
      ] : []));

  // Identify if any item is a travel/flight commitment
  const travelItems = timeline.filter(item => {
    const t = (item.title || '').toLowerCase();
    const type = (item.type || item.item_type || '').toLowerCase();
    return type === 'travel' || t.includes('flight') || t.includes('fly') || t.includes('airport') || t.includes('airline');
  });

  const isDemoMode = !!currentUser.is_demo;
  const dateStr = formatAppDateLong();

  // 1. Travel Buffer & Risk HTML Block
  let travelBufferHtml = '';
  if (isDemoMode) {
    travelBufferHtml = `
      <div class="travel-timeline-card">
        <div class="travel-conflict-banner">
          <div>
            <strong style="color:var(--color-warning); font-size:14px;">Flight Delay Alert: UA 482 (SFO → JFK) Delayed 45 Minutes</strong>
            <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
              Scheduled Arrival: 07:50 AM EDT → Revised Arrival: 08:35 AM EDT.
            </div>
          </div>
          <span class="sheet-badge" style="color:var(--color-warning); background:rgba(245,158,11,0.15);">BUFFER ERODED</span>
        </div>

        <div class="travel-steps-track">
          <div class="travel-step-node">
            <span style="font-size:11px; color:var(--color-secondary);">Flight Departure</span>
            <strong style="font-size:13px;">SFO 23:30 PDT</strong>
            <span style="font-size:11px; color:var(--color-secondary);">United Airlines 482</span>
          </div>

          <div class="travel-step-node delayed">
            <span style="font-size:11px; color:var(--color-warning);">Delayed Arrival</span>
            <strong style="font-size:13px; color:var(--color-warning);">JFK 08:35 EDT</strong>
            <span style="font-size:11px; color:var(--color-secondary);">+45m in transit</span>
          </div>

          <div class="travel-step-node clash">
            <span style="font-size:11px; color:var(--color-primary);">Transit to Midtown</span>
            <strong style="font-size:13px; color:var(--color-primary);">55m Drive Time</strong>
            <span style="font-size:11px; color:var(--color-secondary);">Arrival: 09:30 AM</span>
          </div>

          <div class="travel-step-node clash">
            <span style="font-size:11px; color:var(--color-primary);">Direct Conflict</span>
            <strong style="font-size:13px; color:var(--color-primary);">09:00 AM Keynote</strong>
            <span style="font-size:11px; color:var(--color-secondary);">Elena Rostova & Partners</span>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:16px; font-size:13px; line-height:1.55;">
          <strong style="color:var(--color-on-surface);">Autonomous Buffer Strategy:</strong> ChronoOS shifted Strategy Review to 11:30 AM (+30m), alerted attendees, and secured a 25-minute buffer.
        </div>
      </div>
    `;
  } else if (travelItems.length > 0) {
    const flight = travelItems[0];
    const fDetails = flight.flight_details || {};
    const origin = fDetails.origin_display || flight.location || 'Bengaluru (BLR)';
    const dest = fDetails.dest_display || flight.title || 'Delhi (DEL)';
    const carrier = fDetails.carrier || 'Air India AI 804';
    const depTime = flight.start || fDetails.departure_time || '08:30 AM';
    const arrTime = flight.end || fDetails.arrival_time || '11:15 AM';
    const bufferNote = fDetails.airport_buffer || 'Secured 90m Departure Buffer';

    travelBufferHtml = `
      <div class="travel-timeline-card">
        <div class="travel-conflict-banner" style="border-color:rgba(56,189,248,0.4); background:rgba(56,189,248,0.06);">
          <div>
            <strong style="color:#38bdf8; font-size:14px;">✈ Flight Transit Corridor: ${carrier} (${origin} ➔ ${dest})</strong>
            <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
              Scheduled: ${depTime} - ${arrTime} • ${bufferNote} • Zero Collisions
            </div>
          </div>
          <span class="sheet-badge" style="color:#10b981; background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3);">BUFFER SECURED</span>
        </div>

        <div class="travel-steps-track">
          <div class="travel-step-node">
            <span style="font-size:11px; color:var(--color-secondary);">Origin Terminal</span>
            <strong style="font-size:13px; color:#38bdf8;">${origin}</strong>
            <span style="font-size:11px; color:var(--color-secondary);">${depTime} Departure</span>
          </div>

          <div class="travel-step-node">
            <span style="font-size:11px; color:var(--color-secondary);">Air Transit Corridor</span>
            <strong style="font-size:13px;">${carrier}</strong>
            <span style="font-size:11px; color:#10b981;">Non-stop Scheduled</span>
          </div>

          <div class="travel-step-node">
            <span style="font-size:11px; color:var(--color-secondary);">Touchdown & Buffer</span>
            <strong style="font-size:13px; color:#38bdf8;">${dest}</strong>
            <span style="font-size:11px; color:var(--color-secondary);">${arrTime} Arrival</span>
          </div>

          <div class="travel-step-node">
            <span style="font-size:11px; color:#10b981;">Schedule Integrity</span>
            <strong style="font-size:13px; color:#10b981;">0 Collisions</strong>
            <span style="font-size:11px; color:var(--color-secondary);">Margin Protected</span>
          </div>
        </div>

        <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:16px; font-size:13px; line-height:1.55;">
          <strong style="color:var(--color-on-surface);">Autonomous Travel Guardrail:</strong> ChronoOS verified departure and transit margins. A 90-minute airport buffer is locked in place without calendar collision.
        </div>
      </div>
    `;
  } else {
    travelBufferHtml = `
      <div class="travel-timeline-card">
        <div class="travel-conflict-banner" style="border-color:rgba(16,185,129,0.3); background:rgba(16,185,129,0.06);">
          <div>
            <strong style="color:#10b981; font-size:14px;">✓ Travel Buffer Status: 100% Protected (0 Conflicts Detected)</strong>
            <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
              All standard transit margins and commute buffers are clear with zero calendar collisions.
            </div>
          </div>
          <span class="sheet-badge" style="color:#10b981; background:rgba(16,185,129,0.15); border-color:rgba(16,185,129,0.3);">BUFFER CLEAN</span>
        </div>

        <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-top:14px;">
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:14px;">
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase;">Departure / Commute Margin</div>
            <div style="font-size:16px; font-weight:700; color:#38bdf8; margin-top:4px;">45-90m Active</div>
            <div style="font-size:11px; color:var(--color-secondary); margin-top:2px;">Standard Guardrail</div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:14px;">
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase;">Transit Risk Rating</div>
            <div style="font-size:16px; font-weight:700; color:#10b981; margin-top:4px;">0.0% (Clear)</div>
            <div style="font-size:11px; color:var(--color-secondary); margin-top:2px;">Optimal Flow</div>
          </div>
          <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:14px;">
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase;">Calendar Collisions</div>
            <div style="font-size:16px; font-weight:700; color:#10b981; margin-top:4px;">0 Collisions</div>
            <div style="font-size:11px; color:var(--color-secondary); margin-top:2px;">All Slots Verified</div>
          </div>
        </div>
      </div>
    `;
  }

  // 2. Schedule & Commitments Stack HTML Block
  let scheduleEntriesHtml = '';
  if (timeline.length > 0) {
    scheduleEntriesHtml = timeline.map(entry => {
      const timeVal = entry.time || `${entry.start || '10:00'} - ${entry.end || '11:00'}`;
      const titleVal = entry.title || 'Executive Task';
      const statusVal = entry.status || 'Confirmed';
      const locVal = entry.location || '';
      const attVal = entry.attendees ? (Array.isArray(entry.attendees) ? entry.attendees.join(', ') : entry.attendees) : '';
      const isTravel = entry.type === 'travel' || titleVal.toLowerCase().includes('flight');
      const isHighStakes = (entry.priority === 'critical' || entry.priority === 'high' || statusVal.toLowerCase() === 'critical');

      return `
        <div class="schedule-entry ${isHighStakes ? 'active-stakes' : ''}" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
          <div style="display:flex; gap:16px; align-items:center;">
            <span class="time-slot" style="font-family:var(--font-mono); font-weight:700; color:${isTravel ? '#38bdf8' : (isHighStakes ? '#FF5C7A' : 'var(--color-primary)')}; min-width:110px;">${timeVal}</span>
            <div>
              <div class="entry-name" style="font-weight:600; color:var(--color-on-surface); font-size:14px;">${titleVal}</div>
              <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
                ${attVal ? `<span style="opacity:0.8;">${attVal}</span>` : ''} 
                ${locVal ? `• <span style="color:#38bdf8;">${locVal}</span>` : ''}
              </div>
            </div>
          </div>
          <span class="entry-badge ${isHighStakes ? 'stakes-badge' : ''}" style="text-transform:uppercase; font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px; background:rgba(255,255,255,0.05); border:1px solid var(--color-outline); color:${isTravel ? '#38bdf8' : (isHighStakes ? '#FF5C7A' : '#10b981')};">
            ${isTravel ? '✈ Flight' : (isHighStakes ? 'High Stakes' : statusVal)}
          </span>
        </div>
      `;
    }).join('');
  } else {
    scheduleEntriesHtml = `
      <div style="text-align:center; padding:28px 16px; color:var(--color-secondary); background:rgba(255,255,255,0.02); border:1px dashed var(--color-outline); border-radius:var(--radius-md);">
        <div style="font-size:24px; margin-bottom:8px;">🗓️</div>
        <div style="font-size:15px; font-weight:600; color:var(--color-on-surface);">Clear Calendar Slate</div>
        <p style="font-size:13px; margin:6px 0 14px; opacity:0.8;">You currently have zero scheduled commitments in your personal agenda.</p>
        <button class="btn-raycast-action" onclick="sendQuery('Schedule a meeting tomorrow at 10am')">+ Schedule Meeting</button>
      </div>
    `;
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="calendarTravelCard">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:${isDemoMode ? 'var(--color-warning)' : '#10b981'}; border-color:${isDemoMode ? 'rgba(245,158,11,0.35)' : 'rgba(16,185,129,0.35)'};">
            ${isDemoMode ? 'BUFFER RISK ANALYSIS' : 'PRIVATE CALENDAR & BUFFER'}
          </span>
          <h2 class="card-main-title">Executive Schedule & Travel Buffer Analysis</h2>
        </div>
        <span class="card-subtitle-tag">${currentUser.name} • ${timeline.length} Active Commitments</span>
      </div>

      <!-- Travel & Transit Buffer Intelligence -->
      ${travelBufferHtml}

      <!-- Detailed Agenda Timeline -->
      <div class="schedule-container" style="margin-top:20px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <div class="schedule-section-label" style="margin-bottom:0;">Detailed Schedule & Agenda Timeline (${timeline.length})</div>
          <span style="font-size:12px; color:var(--color-secondary); font-family:var(--font-mono);">${dateStr}</span>
        </div>
        <div class="schedule-stack">
          ${scheduleEntriesHtml}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px; margin-top:20px;">
        <div style="display:flex; gap:8px;">
          <button class="btn-raycast-action" onclick="sendQuery('Alexa, check for travel buffer conflicts tomorrow')">
            Audit Travel Buffer
          </button>
          <button class="btn-raycast-action" onclick="sendQuery('what are my plans for today')">
            Today's Plans
          </button>
        </div>
        <button class="btn-execute-key" onclick="sendQuery('how can i add my tasks')">
          <span>+ Add Commitment</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
  apply3DCardTilt();
}

function renderScheduleViewCard(card) {
  const timeline = (card && card.timeline && card.timeline.length > 0)
    ? card.timeline
    : ((currentUser && currentUser.schedule && currentUser.schedule.length > 0) ? currentUser.schedule : (window._lastScheduleTimeline || []));
  const entriesHtml = timeline.map(entry => {
    const timeVal = entry.time || `${entry.start || '10:00'} - ${entry.end || '11:00'}`;
    const titleVal = entry.title || 'Executive Task';
    const statusVal = entry.status || 'Confirmed';
    const locVal = entry.location || '';
    const attVal = entry.attendees ? (Array.isArray(entry.attendees) ? entry.attendees.join(', ') : entry.attendees) : '';
    const isTravel = entry.type === 'travel' || titleVal.toLowerCase().includes('flight');
    const isHighStakes = (entry.priority === 'critical' || entry.priority === 'high' || statusVal.toLowerCase() === 'critical');
    return `
      <div class="schedule-entry ${isHighStakes ? 'active-stakes' : ''}" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
        <div style="display:flex; gap:16px; align-items:center;">
          <span class="time-slot" style="font-family:var(--font-mono); font-weight:700; color:${isTravel ? '#38bdf8' : (isHighStakes ? '#FF5C7A' : 'var(--color-primary)')}; min-width:110px;">${timeVal}</span>
          <div>
            <div class="entry-name" style="font-weight:600; color:var(--color-on-surface); font-size:14px;">${titleVal}</div>
            <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
              ${attVal ? `<span style="opacity:0.8;">${attVal}</span>` : ''} 
              ${locVal ? `• <span style="color:#38bdf8;">${locVal}</span>` : ''}
            </div>
          </div>
        </div>
        <span class="entry-badge ${isHighStakes ? 'stakes-badge' : ''}" style="text-transform:uppercase; font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px; background:rgba(255,255,255,0.05); border:1px solid var(--color-outline); color:${isTravel ? '#38bdf8' : (isHighStakes ? '#FF5C7A' : '#10b981')};">
          ${isTravel ? '✈ Flight' : (isHighStakes ? 'High Stakes' : statusVal)}
        </span>
      </div>
    `;
  }).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="scheduleViewCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:var(--color-primary); border-color:rgba(129,140,248,0.35);">Executive Calendar</span>
          <h2 class="card-main-title">${card.title || 'Today\'s Executive Commitments'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.next_up || `${timeline.length} Commitments Today`}</span>
      </div>

      <div class="schedule-container" style="margin-top:16px;">
        <div class="schedule-stack">
          ${entriesHtml || '<div style="color:var(--color-secondary); padding:20px;">No scheduled commitments for today.</div>'}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Next up: ${card.next_up || 'Executive Leadership Daily Standup'}</span>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, check for travel buffer conflicts tomorrow')">
          <span>Audit Travel Buffer</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderFinancialMetricsCard(card) {
  const metrics = card.metrics || [
    { label: "Current ARR", value: "$64.2M", sub: "+34% YoY Growth" },
    { label: "Net Burn", value: "$420k/mo", sub: "Disciplined OpEx" },
    { label: "Total Runway", value: "29.4 Months", sub: "Cash Secure" },
    { label: "Net Retention", value: "142%", sub: "Enterprise Tier" }
  ];

  const gridHtml = metrics.map(m => `
    <div class="metric-tile" style="background:rgba(255,255,255,0.03); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:16px;">
      <div class="metric-tile-label" style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); font-family:var(--font-mono);">${m.label}</div>
      <div class="metric-tile-val" style="font-size:24px; font-weight:700; color:var(--color-on-surface); margin:8px 0;">${m.value}</div>
      <div class="metric-tile-tag" style="font-size:11px; color:var(--color-primary); font-weight:600;">${m.sub || ''}</div>
    </div>
  `).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="financialMetricsCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">CFO Metric Pack</span>
          <h2 class="card-main-title">${card.title || 'Q3 Executive Financial Intelligence'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.audit_status || 'Verified for Board Deck'}</span>
      </div>

      <div class="raycast-metrics-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:12px; margin-top:16px;">
        ${gridHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Verified by: <strong style="color:var(--color-on-surface);">${card.verified_by || 'David Ross (CFO)'}</strong></span>
        <button class="btn-execute-key" onclick="sendQuery('Who is Elena Rostova?')">
          <span>Board Review Dossier</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderStakeholderProfileCard(card) {
  const focusAreas = card.focus_areas || [];
  const focusHtml = focusAreas.map(f => `<span style="background:rgba(255,255,255,0.04); border:1px solid var(--color-outline); border-radius:4px; padding:4px 8px; font-size:11px; color:var(--color-secondary);">${f}</span>`).join(' ');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="stakeholderProfileCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#38bdf8; border-color:rgba(56,189,248,0.35);">Stakeholder Intelligence</span>
          <h2 class="card-main-title">${card.title || 'Executive Dossier'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.role || 'VIP Stakeholder'} • ${card.organization || 'Aether Dynamics'}</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:16px; margin-top:16px; display:flex; flex-direction:column; gap:12px;">
        ${card.active_item ? `
          <div>
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-warning); font-family:var(--font-mono); font-weight:700;">Active Priority Matter</div>
            <div style="font-size:14px; font-weight:600; color:var(--color-on-surface); margin-top:3px;">${card.active_item}</div>
          </div>
        ` : ''}

        ${card.policy ? `
          <div style="border-left:3px solid var(--color-primary); padding-left:12px;">
            <div style="font-size:11px; text-transform:uppercase; color:var(--color-primary); font-family:var(--font-mono); font-weight:700;">Governance & Mandate Policy</div>
            <div style="font-size:13px; color:var(--color-secondary); margin-top:3px; line-height:1.5;">${card.policy}</div>
          </div>
        ` : ''}

        ${focusHtml ? `
          <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-top:4px;">
            <span style="font-size:12px; color:var(--color-secondary); font-weight:600;">Focus Domains:</span>
            ${focusHtml}
          </div>
        ` : ''}
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <button class="btn-raycast-action" onclick="sendQuery('What are my meetings today?')">View Schedule</button>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, give me my morning briefing')">
          <span>Full Executive Briefing</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderProjectOverviewCard(card) {
  const clauses = card.critical_clauses || [];
  const clausesHtml = clauses.map(c => `
    <div style="padding:10px 14px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
      <span style="font-family:var(--font-mono); font-weight:700; color:var(--color-primary); font-size:13px;">${c.clause}</span>
      <span style="font-size:13px; color:var(--color-secondary);">${c.subject}</span>
    </div>
  `).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="projectOverviewCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:var(--color-warning); border-color:rgba(245,158,11,0.35);">M&A Strategic Initiative</span>
          <h2 class="card-main-title">${card.title || 'Project Apex • Acquisition Overview'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.parties || 'Aether Dynamics ↔ Acme Technologies'}</span>
      </div>

      <div class="raycast-metrics-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:16px;">
        <div class="metric-tile" style="background:rgba(255,255,255,0.03); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:14px;">
          <div class="metric-tile-label" style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); font-family:var(--font-mono);">Enterprise Valuation Cap</div>
          <div class="metric-tile-val" style="font-size:20px; font-weight:700; color:var(--color-on-surface); margin:6px 0;">${card.valuation_cap || '$48,000,000 USD'}</div>
          <div class="metric-tile-tag" style="font-size:11px; color:#10b981;">Strict Board Ceiling</div>
        </div>
        <div class="metric-tile" style="background:rgba(255,255,255,0.03); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:14px;">
          <div class="metric-tile-label" style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); font-family:var(--font-mono);">Target Close Date</div>
          <div class="metric-tile-val" style="font-size:20px; font-weight:700; color:var(--color-on-surface); margin:6px 0;">${card.target_close || 'Nov 15, 2026'}</div>
          <div class="metric-tile-tag" style="font-size:11px; color:#38bdf8;">${card.escrow_threshold || 'Max 12% Escrow'}</div>
        </div>
      </div>

      <div style="margin-top:16px;">
        <div style="font-size:12px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-secondary); font-weight:700; margin-bottom:8px;">Active Redline Flags</div>
        ${clausesHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Negotiation call scheduled today at 2:00 PM</span>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, inspect the Acme merger redline from Sarah')">
          <span>Inspect Section 9.2 Redline</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderWeatherReportCard(card) {
  const w = card.weather || card;
  const loc = card.location || w.location || 'Local Area';
  const cond = w.condition || card.condition || 'Clear Skies';
  const temp = w.temperature || card.temperature || '22°C (72°F)';
  const dateStr = card.date || w.date || formatAppDateLong();
  const high = w.high || card.high || '24°C';
  const low = w.low || card.low || '15°C';
  const humidity = w.humidity || card.humidity || '50%';
  const wind = w.wind || card.wind || '8 mph NW';
  const airQuality = w.air_quality || card.air_quality || '38 AQI (Good)';
  const forecast = w.forecast || card.forecast || [];

  // Determine atmospheric icon based on condition
  let mainIcon = '☀️';
  const condLower = cond.toLowerCase();
  if (condLower.includes('rain') || condLower.includes('drizzle') || condLower.includes('shower')) mainIcon = '🌧️';
  else if (condLower.includes('thunder') || condLower.includes('storm')) mainIcon = '⛈️';
  else if (condLower.includes('snow') || condLower.includes('ice') || condLower.includes('flurry')) mainIcon = '❄️';
  else if (condLower.includes('cloud') || condLower.includes('overcast')) mainIcon = '⛅';
  else if (condLower.includes('fog') || condLower.includes('mist') || condLower.includes('haze')) mainIcon = '🌫️';

  const forecastHtml = forecast.map(f => `
    <div style="background:rgba(255,255,255,0.03); border:1px solid var(--color-outline); border-radius:var(--radius-sm); padding:12px; text-align:center;">
      <div style="font-size:12px; color:var(--color-secondary); font-weight:600;">${f.day || 'Day'}</div>
      <div style="font-size:20px; margin:6px 0;">${f.icon || '☀️'}</div>
      <div style="font-size:13px; font-weight:700; color:var(--color-on-surface);">${f.temp || f.high || ''}</div>
      <div style="font-size:11px; color:var(--color-secondary); margin-top:2px;">${f.cond || ''}</div>
    </div>
  `).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="weatherReportCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#38bdf8; border-color:rgba(56,189,248,0.35);">Live Atmospheric Telemetry</span>
          <h2 class="card-main-title">${loc}</h2>
        </div>
        <span class="card-subtitle-tag">${dateStr} • ${cond}</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <div style="display:flex; align-items:center; gap:20px;">
          <span style="font-size:48px;">${mainIcon}</span>
          <div>
            <div style="font-size:38px; font-weight:800; color:var(--color-on-surface); line-height:1.1;">${temp}</div>
            <div style="font-size:13px; color:var(--color-secondary); margin-top:6px;">High: ${high} • Low: ${low}</div>
          </div>
        </div>
        <div style="text-align:right; font-size:12px; color:var(--color-secondary); display:flex; flex-direction:column; gap:4px;">
          <div>Humidity: <strong style="color:var(--color-on-surface);">${humidity}</strong></div>
          <div>Wind: <strong style="color:var(--color-on-surface);">${wind}</strong></div>
          <div>Air Quality: <strong style="color:#10b981;">${airQuality}</strong></div>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(${Math.max(1, Math.min(4, forecast.length || 4))}, 1fr); gap:10px; margin-top:14px;">
        ${forecastHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">GPS & Real-Time Meteorological Station Sync</span>
        <button class="btn-execute-key" onclick="sendQuery('What are my meetings today?')">
          <span>View Today's Schedule</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderGreetingCard(card) {
  const suggestions = card.suggestions || [
    "What are my meetings today?",
    "What is our ARR and runway?",
    "Who is Sarah Chen?",
    "Tell me the weather today",
    "What is Project Apex?"
  ];

  const pillsHtml = suggestions.map(s => `
    <button class="btn-raycast-action" style="font-size:12px; padding:8px 12px; margin-bottom:6px;" onclick="sendQuery('${s}')">
      ${s}
    </button>
  `).join(' ');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="greetingCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:var(--color-primary); border-color:rgba(129,140,248,0.35);">Executive Assistant</span>
          <h2 class="card-main-title">${card.greeting || 'Welcome, Alex Mercer'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.system_status || 'All Systems Active'}</span>
      </div>

      <p style="font-size:14px; color:var(--color-secondary); margin:14px 0 16px; line-height:1.5;">
        ChronoOS Chief of Staff is standing by. Speak or click any executive prompt below to get an instant briefing:
      </p>

      <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:16px;">
        ${pillsHtml}
      </div>

      <div style="display:flex; justify-content:flex-end; border-top:1px solid var(--color-outline); padding-top:14px;">
        <button class="btn-execute-key" onclick="sendQuery('Alexa, give me my morning briefing')">
          <span>Run Morning Briefing</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderTimeDateCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="timeDateCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#a855f7; border-color:rgba(168,85,247,0.35);">Temporal Precision</span>
          <h2 class="card-main-title">${card.title || 'Executive Temporal Clock'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.status || 'Synchronized'}</span>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:24px 28px; margin-top:16px;">
        <div>
          <div style="font-size:48px; font-weight:800; color:var(--color-on-surface); line-height:1; font-family:var(--font-mono);">${card.time || '12:00 PM'}</div>
          <div style="font-size:16px; font-weight:600; color:var(--color-primary); margin-top:10px;">${card.date || 'Today'}</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:22px; font-weight:700; color:var(--color-on-surface);">${card.day || ''}</div>
          <div style="font-size:12px; color:var(--color-secondary); margin-top:6px;">${card.timezone || 'Local Clock'}</div>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">System Temporal Synchronization Active</span>
        <button class="btn-execute-key" onclick="sendQuery('Tell me the weather today')">
          <span>Check Weather</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderWebSearchResultCard(card) {
  const sourcesHtml = (card.sources && card.sources.length > 0)
    ? `
      <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06);">
        <div style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-secondary); margin-bottom:8px; letter-spacing:0.05em; font-weight:600;">Verified Grounded Sources</div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${card.sources.map(s => `
            <a href="${s.url || '#'}" target="_blank" rel="noopener noreferrer" style="display:inline-flex; align-items:center; gap:6px; font-size:12px; background:rgba(6,182,212,0.08); border:1px solid rgba(6,182,212,0.25); color:#06b6d4; padding:5px 12px; border-radius:6px; text-decoration:none; transition:all 0.15s ease;">
              <span>🌐 ${s.title || s.domain || 'Reference'}</span>
              <span style="opacity:0.6; font-size:10px;">(${s.domain || 'wikipedia.org'})</span>
              <span>↗</span>
            </a>
          `).join('')}
        </div>
      </div>
    `
    : (card.url ? `
      <div style="margin-top:12px;">
        <a href="${card.url}" target="_blank" rel="noopener noreferrer" style="font-size:12px; color:#38bdf8; text-decoration:none; display:inline-flex; align-items:center; gap:4px;">
          <span>Source Documentation</span>
          <span>↗</span>
        </a>
      </div>
    ` : '');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="webSearchResultCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#06b6d4; border-color:rgba(6,182,212,0.35);">Live Web Intelligence</span>
          <h2 class="card-main-title">${card.title || 'Web Search Knowledge'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.source || 'Open Web'}</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <div style="font-size:12px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-secondary); margin-bottom:8px;">Query: "${card.query || ''}"</div>
        <div style="font-size:15px; color:var(--color-on-surface); line-height:1.6; font-weight:400;">
          ${card.summary || 'No summary available.'}
        </div>
        ${sourcesHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Grounded Fact Retrieval • No Hallucinations</span>
        <button class="btn-execute-key" onclick="sendQuery('Tell me the weather today')">
          <span>Check Weather</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderTravelBufferAuditCard(card) {
  const timeline = (currentUser && currentUser.schedule && currentUser.schedule.length > 0)
    ? currentUser.schedule
    : (window._lastScheduleTimeline || (currentUser && currentUser.is_demo ? [
        { time: "09:00 - 09:30", title: "Executive Leadership Daily Standup", location: "Boardroom Alpha", attendees: "Alex Mercer, Leadership Team", status: "Confirmed" },
        { time: "11:00 - 12:15", title: "Q3 Board Deck Final Review", location: "Zoom Room 4", attendees: "David Ross, Elena Rostova", status: "Confirmed" },
        { time: "14:00 - 15:00", title: "Project Apex: M&A Due Diligence & Legal Call", location: "Secure Bridge 09", attendees: "Sarah Chen, Acme Legal", status: "Critical" },
        { time: "16:30 - 17:30", title: "Global Partner Ecosystem Keynote Rehearsal", location: "Main Stage Studio", attendees: "Communications Team", status: "Confirmed" }
      ] : []));

  let scheduleEntriesHtml = '';
  if (timeline.length > 0) {
    scheduleEntriesHtml = timeline.map(entry => {
      const timeVal = entry.time || `${entry.start || '10:00'} - ${entry.end || '11:00'}`;
      const titleVal = entry.title || 'Executive Task';
      const statusVal = entry.status || 'Confirmed';
      const locVal = entry.location || '';
      const attVal = entry.attendees ? (Array.isArray(entry.attendees) ? entry.attendees.join(', ') : entry.attendees) : '';
      const isTravel = entry.type === 'travel' || titleVal.toLowerCase().includes('flight');
      return `
        <div class="schedule-entry" style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
          <div style="display:flex; gap:16px; align-items:center;">
            <span class="time-slot" style="font-family:var(--font-mono); font-weight:700; color:${isTravel ? '#38bdf8' : 'var(--color-primary)'}; min-width:110px;">${timeVal}</span>
            <div>
              <div class="entry-name" style="font-weight:600; color:var(--color-on-surface); font-size:14px;">${titleVal}</div>
              <div style="font-size:12px; color:var(--color-secondary); margin-top:2px;">
                ${attVal ? `<span style="opacity:0.8;">${attVal}</span>` : ''} 
                ${locVal ? `• <span style="color:#38bdf8;">${locVal}</span>` : ''}
              </div>
            </div>
          </div>
          <span class="entry-badge" style="text-transform:uppercase; font-size:10px; font-weight:700; padding:4px 8px; border-radius:4px; background:rgba(255,255,255,0.05); border:1px solid var(--color-outline); color:${isTravel ? '#38bdf8' : '#10b981'};">
            ${isTravel ? '✈ Flight' : statusVal}
          </span>
        </div>
      `;
    }).join('');
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="travelBufferAuditCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Schedule & Transit Audit</span>
          <h2 class="card-main-title">${card.title || 'Travel Buffer Audit'}</h2>
        </div>
        <span class="card-subtitle-tag" style="color:#10b981; font-weight:600;">✓ ${card.status || 'Clear'}</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
          <span style="font-size:13px; font-weight:600; color:var(--color-on-surface);">Status Evaluation</span>
          <span style="font-size:12px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.3); padding:2px 8px; border-radius:4px;">0 Conflicts Detected</span>
        </div>
        <div style="font-size:14px; color:var(--color-on-surface); line-height:1.6;">
          ${card.summary || 'All travel, buffer, and transit margins for tomorrow are fully secured. Zero calendar collisions.'}
        </div>
        <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:12px; margin-top:16px; padding-top:12px; border-top:1px solid rgba(255,255,255,0.06);">
          <div>
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase;">Departure / Airport Margin</div>
            <div style="font-size:13px; font-weight:600; color:#38bdf8; margin-top:2px;">${card.airport_buffer || 'Standard 45-90m Active'}</div>
          </div>
          <div>
            <div style="font-size:11px; color:var(--color-secondary); text-transform:uppercase;">Buffer Margin Status</div>
            <div style="font-size:13px; font-weight:600; color:#10b981; margin-top:2px;">100% Protected</div>
          </div>
        </div>
      </div>

      ${scheduleEntriesHtml ? `
        <div class="schedule-container" style="margin-top:20px;">
          <div class="schedule-section-label">Active Schedule Agenda (${timeline.length})</div>
          <div class="schedule-stack">
            ${scheduleEntriesHtml}
          </div>
        </div>
      ` : ''}

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Private Calendar Intelligence • Tenant Isolation Active</span>
        <button class="btn-execute-key" onclick="sendQuery('What is on my schedule today?')">
          <span>View Schedule</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderAmbiguousClarificationCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="ambiguousClarificationCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#f59e0b; border-color:rgba(245,158,11,0.35);">Intent Clarification</span>
          <h2 class="card-main-title">${card.title || 'Clarification Needed'}</h2>
        </div>
        <span class="card-subtitle-tag">Confidence: ${Math.round((card.confidence || 0.5) * 100)}%</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <div style="font-size:14px; color:var(--color-on-surface); line-height:1.6; margin-bottom:14px;">
          ${card.message || 'Could you please clarify what you would like me to check?'}
        </div>
        ${card.suggestions && card.suggestions.length ? `
          <div style="font-size:11px; text-transform:uppercase; color:var(--color-secondary); margin-bottom:8px; font-weight:600;">Suggested Commands:</div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${card.suggestions.map(s => `
              <button class="btn-shortcut-pill" onclick="sendQuery('${s}')" style="text-align:left; justify-content:flex-start; padding:8px 12px; width:100%;">
                <span>💬 "${s}"</span>
              </button>
            `).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderPersonalMemoryCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="personalMemoryCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Workspace Memory</span>
          <h2 class="card-main-title">${card.title || 'Personal Workspace Detail'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.source || 'Private Memory'}</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:22px; margin-top:16px;">
        <div style="font-size:12px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-primary); font-weight:700; margin-bottom:6px;">Topic: ${(card.entity || '').toUpperCase()}</div>
        <div style="font-size:18px; font-weight:600; color:var(--color-on-surface); line-height:1.5;">
          ${card.memory || ''}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Retrieved from User Workspace Graph</span>
        <button class="btn-execute-key" onclick="sendQuery('What is on my schedule?')">
          <span>View Schedule</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderMemorySavedCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="memorySavedCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Memory Saved ✓</span>
          <h2 class="card-main-title">${card.title || 'Fact Added to Workspace'}</h2>
        </div>
        <span class="card-subtitle-tag">${card.status || 'Stored'}</span>
      </div>

      <div style="background:rgba(16,185,129,0.05); border:1px solid rgba(16,185,129,0.3); border-radius:var(--radius-md); padding:22px; margin-top:16px;">
        <div style="display:flex; align-items:center; gap:12px; margin-bottom:10px;">
          <span style="font-size:24px;">💾</span>
          <div>
            <div style="font-size:12px; font-family:var(--font-mono); text-transform:uppercase; color:#10b981; font-weight:700;">Entity: ${(card.entity || '').toUpperCase()}</div>
            <div style="font-size:20px; font-weight:700; color:var(--color-on-surface);">${card.value || ''}</div>
          </div>
        </div>
        <div style="font-size:13px; color:var(--color-secondary); line-height:1.4;">
          This detail has been persisted to your private executive memory graph and will be referenced in future assistant turns.
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <button class="btn-raycast-action" style="font-size:12px;" onclick="sendQuery('What is my ${card.entity || ''}?')">
          Ask "What is my ${card.entity || ''}?"
        </button>
        <button class="btn-execute-key" onclick="sendQuery('Tell me the weather today')">
          <span>Check Weather</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderMemoryPromptCard(card) {
  const suggestions = card.suggested_actions || card.suggestions || [
    `Yes, add it`,
    `No thanks`
  ];

  const actionsHtml = suggestions.map(s => `
    <button class="btn-raycast-action" style="font-size:13px; padding:8px 14px; margin-right:8px; margin-bottom:8px;" onclick="sendQuery('${s}')">
      ${s}
    </button>
  `).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="memoryPromptCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#f59e0b; border-color:rgba(245,158,11,0.35);">Knowledge Notice</span>
          <h2 class="card-main-title">${card.title || 'Workspace Memory Prompt'}</h2>
        </div>
        <span class="card-subtitle-tag">Personal Detail</span>
      </div>

      <div style="background:rgba(245,158,11,0.05); border:1px solid rgba(245,158,11,0.25); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <p style="font-size:14px; color:var(--color-on-surface); margin:0 0 10px; line-height:1.5;">
          ${card.message || 'Information is not yet recorded in your workspace.'}
        </p>
        <p style="font-size:13px; color:var(--color-secondary); margin:0 0 16px; line-height:1.4;">
          ${card.prompt || 'Would you like me to remember this fact for you?'}
        </p>
        <div style="display:flex; flex-wrap:wrap;">
          ${actionsHtml}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Speak or type your answer to save it</span>
        <button class="btn-execute-key" onclick="sendQuery('Yes')">
          <span>Yes, Add To Memory</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderTaskHelpCard(card) {
  const commands = card.sample_commands || [
    "Add task: Review Q3 marketing strategy at 3:00 PM",
    "Schedule meeting with Sarah Chen at 4:30 PM",
    "Remind me to call David Ross at 2:00 PM",
    "Add to schedule: Team sprint review at 11:00 AM"
  ];

  const chipsHtml = commands.map(cmd => `
    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
      <span style="font-size:13px; font-weight:500; color:var(--color-on-surface); font-family:var(--font-mono);">${cmd}</span>
      <button class="btn-raycast-action" style="font-size:11px; padding:4px 10px;" onclick="sendQuery('${cmd.replace(/'/g, "\\'")}')">Try It →</button>
    </div>
  `).join('');

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="taskHelpCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:var(--color-primary); border-color:rgba(129,140,248,0.35);">Schedule Intelligence</span>
          <h2 class="card-main-title">${card.title || 'Task & Schedule Management'}</h2>
        </div>
        <span class="card-subtitle-tag">Voice & Text Ready</span>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:20px; margin-top:16px;">
        <div style="font-size:16px; font-weight:700; color:var(--color-on-surface); margin-bottom:6px;">${card.headline || 'How to Add Tasks & Meetings'}</div>
        <p style="font-size:14px; color:var(--color-secondary); line-height:1.55; margin-bottom:16px;">
          ${card.description || 'Speak or type any task with an optional time and attendee. ChronoOS parses the details and updates your calendar.'}
        </p>
        <div style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-secondary); margin-bottom:8px;">Click to Add a Sample Task:</div>
        ${chipsHtml}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:13px; color:var(--color-secondary);">Say "What are my meetings today?" to view schedule</span>
        <button class="btn-execute-key" onclick="sendQuery('What are my meetings today?')">
          <span>View My Schedule</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderGenericCard(card) {
  const memories = card.relevant_memories || [];
  const comms = card.relevant_comms || [];

  let extraHtml = '';
  if (memories.length > 0) {
    extraHtml += `
      <div style="margin-top:16px;">
        <div style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:var(--color-primary); font-weight:700; margin-bottom:8px;">Episodic Memory Match</div>
        ${memories.slice(0, 2).map(m => `
          <div style="padding:10px 14px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
            <strong style="color:var(--color-on-surface); font-size:13px;">${m.entity || 'Policy Record'}:</strong>
            <span style="color:var(--color-secondary); font-size:13px; margin-left:4px;">${m.memory || ''}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (comms.length > 0) {
    extraHtml += `
      <div style="margin-top:14px;">
        <div style="font-size:11px; font-family:var(--font-mono); text-transform:uppercase; color:#38bdf8; font-weight:700; margin-bottom:8px;">Related Executive Communication</div>
        ${comms.slice(0, 2).map(c => `
          <div style="padding:10px 14px; background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-sm); margin-bottom:8px;">
            <div style="font-size:13px; font-weight:600; color:var(--color-on-surface);">${c.sender_name || 'Staff'}: ${c.subject || ''}</div>
            <div style="color:var(--color-secondary); font-size:12px; margin-top:2px;">${c.snippet || ''}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge">Executive Context</span>
          <h2 class="card-main-title">${card.title || 'Executive Intelligence'}</h2>
        </div>
      </div>
      <p style="font-size:14px; color:var(--color-secondary); margin:12px 0 16px; line-height:1.5;">${card.summary || ''}</p>
      ${extraHtml}
    </div>
  `;
}

// -------------------------------------------------------------
// 11. Workspace Tab Switching
// -------------------------------------------------------------

function switchWorkspaceTab(tab) {
  playSound('click');
  activeTab = tab;
  updateActiveTabUI(tab);

  if (tab === 'overview') {
    renderBriefingCard({ title: 'Executive Intelligence Briefing' });
  } else if (tab === 'legal') {
    renderContractRedlineCard({
      title: 'Project Apex M&A Contract Redlines',
      parties: 'Aether Dynamics vs Acme Corp'
    });
  } else if (tab === 'calendar') {
    renderCalendarTravelCard();
  }

  apply3DCardTilt();
}

function updateActiveTabUI(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
  });
}

// --------------------------------------------------------------------------
// 12. Human-in-the-Loop Native Sheet Control
// --------------------------------------------------------------------------

function openHitlDialog(action) {
  if (!action) return;
  currentPendingAction = action;
  dialogToken.textContent = action.token;
  dialogRecipient.textContent = action.recipient;
  dialogPayload.textContent = action.body;
  hitlDialog.showModal();
  playSound('execute');
}

function openHitlDialogCurrent() {
  if (currentPendingAction) {
    hitlDialog.showModal();
    playSound('execute');
  }
}

function closeDialog(decision) {
  hitlDialog.close();
  playSound('click');
  if (decision === 'REJECTED' && currentPendingAction) {
    sendQuery(`Alexa, reject action ${currentPendingAction.token}`);
  }
}

async function confirmAction(decision) {
  hitlDialog.close();
  playSound('success');
  if (!currentPendingAction) return;

  try {
    const res = await fetch(`${API_BASE}/api/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action_token: currentPendingAction.token,
        decision: decision
      })
    });
    const result = await res.json();
    renderAgentTurn({
      voice_response: `Action authorized and dispatched. Your legal counter-offer has been officially communicated to Sarah Chen and the Acme M&A war room.`,
      visual_card: {
        type: 'ACTION_EXECUTED',
        title: 'Executive Action Executed',
        receipt: result.receipt.receipt_id || 'RCPT-AUTH-SUCCESS',
        status: 'DISPATCHED VIA AMAZON BEDROCK SECURE GATEWAY',
        details: 'Section 9.2 counter-position officially communicated to General Counsel.'
      },
      trace_events: [
        { stage: 'Voice Confirmation Received', status: 'approved' },
        { stage: 'MCP Action Execution', tool: 'execute_confirmed_action', status: 'delivered' }
      ],
      latency_ms: 110
    });
  } catch (err) {
    console.error('Confirmation error:', err);
  }
}

// --------------------------------------------------------------------------
// 13. Global Event Listeners & Keyboard Shortcuts
// --------------------------------------------------------------------------

function initEventListeners() {
  micOrbBtn.addEventListener('click', toggleListening);
  viewModeToggleBtn.addEventListener('click', toggleViewMode);
  authPortalBtn.addEventListener('click', openAuthPortal);

  inspectorToggleBtn.addEventListener('click', () => {
    playSound('click');
    displayInspectorPane.classList.toggle('collapsed');
  });

  closeInspectorBtn.addEventListener('click', () => {
    playSound('click');
    displayInspectorPane.classList.add('collapsed');
  });

  soundToggleBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    if (soundIconWrapper) {
      soundIconWrapper.innerHTML = soundEnabled ? SVG_AUDIO_ON : SVG_AUDIO_OFF;
    }
    if (soundEnabled) playSound('click');
  });

  voiceTextInput.addEventListener('input', () => {
    clearInputBtn.style.display = voiceTextInput.value.length > 0 ? 'block' : 'none';
  });

  clearInputBtn.addEventListener('click', () => {
    voiceTextInput.value = '';
    clearInputBtn.style.display = 'none';
    voiceTextInput.focus();
    playSound('click');
  });

  // Global Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    // ⌘K to focus command bar
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      playSound('click');
      voiceTextInput.focus();
      voiceTextInput.select();
    }
    // ⌘U to open Auth Portal
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'u') {
      e.preventDefault();
      openAuthPortal();
    }
    // ⌘Z to toggle Zen Mode / Dossier
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') {
      e.preventDefault();
      toggleViewMode();
    }
    // ⌘I to toggle Inspector
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'i') {
      e.preventDefault();
      playSound('click');
      displayInspectorPane.classList.toggle('collapsed');
    }
    // Numeric triggers (1-5) when NOT typing in an input
    if (document.activeElement !== voiceTextInput && document.activeElement.tagName !== 'INPUT') {
      if (e.key === '1') sendQuery('Alexa, give me my morning briefing');
      if (e.key === '2') sendQuery('Alexa, inspect the Acme merger redline from Sarah');
      if (e.key === '3') sendQuery('Alexa, prepare a counter-offer rejecting the 12 million cap');
      if (e.key === '4') sendQuery('Alexa, confirm action and dispatch to legal');
      if (e.key === '5') sendQuery('Alexa, check for travel buffer conflicts tomorrow');
    }
    // Escape to dismiss dialogs
    if (e.key === 'Escape') {
      if (hitlDialog.open) hitlDialog.close();
      if (authPortalDialog && authPortalDialog.open) authPortalDialog.close();
      if (!displayInspectorPane.classList.contains('collapsed')) {
        displayInspectorPane.classList.add('collapsed');
      }
      voiceTextInput.blur();
    }
  });
}

// --------------------------------------------------------------------------
// 13. High-Impact Kinetic Typography & Hyperspace Boot Sequence
// --------------------------------------------------------------------------

function playCinematicBootBoom() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(95, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(34, ctx.currentTime + 1.2);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.4);
  } catch (e) { }
}

function initKineticSplash() {
  const splash = document.getElementById('kineticSplash');
  if (!splash) return;

  const warpCanvas = document.getElementById('splashWarpCanvas');
  const dynamicTextEl = document.getElementById('kineticDynamicText');
  const subTickerEl = document.getElementById('kineticSubTicker');
  const fill = document.getElementById('splashProgressFill');
  const pctEl = document.getElementById('splashPct');
  const logEl = document.getElementById('splashStatusLog');
  const skipBtn = document.getElementById('skipSplashBtn');
  const cryptHashEl = document.getElementById('splashCryptHash');
  const memAllocEl = document.getElementById('splashMemAlloc');

  // Trigger cinematic bass sweep
  playCinematicBootBoom();

  let progress = 0;
  let dismissed = false;

  // Hyperspace 3D Starfield Warp Simulation
  let warpAnimationId = null;
  if (warpCanvas) {
    const ctx = warpCanvas.getContext('2d');
    let w = (warpCanvas.width = window.innerWidth);
    let h = (warpCanvas.height = window.innerHeight);

    const stars = [];
    const numStars = 220;
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: (Math.random() - 0.5) * w * 2.5,
        y: (Math.random() - 0.5) * h * 2.5,
        z: Math.random() * 1000,
        pz: 1000
      });
    }

    function renderWarp() {
      if (dismissed) return;
      ctx.fillStyle = 'rgba(3, 4, 6, 0.35)';
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const warpSpeed = 1.5 + (progress / 100) * 16;

      for (let star of stars) {
        star.pz = star.z;
        star.z -= warpSpeed;

        if (star.z <= 0) {
          star.z = 1000;
          star.pz = 1000;
          star.x = (Math.random() - 0.5) * w * 2.5;
          star.y = (Math.random() - 0.5) * h * 2.5;
        }

        const k = 420 / star.z;
        const px = cx + star.x * k;
        const py = cy + star.y * k;

        const pk = 420 / star.pz;
        const ppx = cx + star.x * pk;
        const ppy = cy + star.y * pk;

        if (px >= 0 && px <= w && py >= 0 && py <= h) {
          ctx.beginPath();
          ctx.moveTo(ppx, ppy);
          ctx.lineTo(px, py);
          const alpha = Math.min(1, (1 - star.z / 1000) * 1.4);
          ctx.strokeStyle = `rgba(255, 92, 122, ${alpha})`;
          ctx.lineWidth = Math.max(1, (1 - star.z / 1000) * 2.5);
          ctx.stroke();
        }
      }

      warpAnimationId = requestAnimationFrame(renderWarp);
    }
    renderWarp();

    window.addEventListener('resize', () => {
      w = warpCanvas.width = window.innerWidth;
      h = warpCanvas.height = window.innerHeight;
    }, { once: true });
  }

  // Hacker Text Decryptor Sequence
  const sequenceStages = [
    {
      pct: 0,
      title: "CHRONOOS",
      accent: "OS",
      sub: "AUTONOMOUS CHIEF OF STAFF // BEDROCK 2.0",
      log: "BOOTING NEURAL RTOS KERNEL..."
    },
    {
      pct: 25,
      title: "REASONING MATRIX",
      accent: "MATRIX",
      sub: "STREAMABLE MODEL CONTEXT PROTOCOL (MCP 2.0)",
      log: "STREAMING MCP PROTOCOL (7 CORE ENDPOINTS)..."
    },
    {
      pct: 50,
      title: "EPISODIC GRAPH",
      accent: "GRAPH",
      sub: "EXECUTIVE LONG-TERM MEMORY // ISOLATED TENANT",
      log: "CALCULATING EPISODIC STAKEHOLDER MEMORY..."
    },
    {
      pct: 75,
      title: "AMAZON BEDROCK",
      accent: "BEDROCK",
      sub: "CLAUDE 3.5 SONNET // GUARDRAIL DEFENSE ACTIVE",
      log: "VERIFYING ANTHROPIC CLAUDE-3-5 GUARDRAILS..."
    },
    {
      pct: 95,
      title: "ENTERPRISE READY",
      accent: "READY",
      sub: "CHIEF OF STAFF ONLINE // READY TO ENGAGE",
      log: "ENTERPRISE ENGINE ONLINE. ENGAGING WORKSPACE."
    }
  ];

  let currentStageIdx = -1;
  const glyphs = "01XZ9AF§∆◊•#@%$¢";

  function scrambleDecryptText(targetTitle, targetAccent, targetSub) {
    if (!dynamicTextEl) return;
    let iterations = 0;
    const maxIterations = 14;

    const interval = setInterval(() => {
      if (dismissed) {
        clearInterval(interval);
        return;
      }
      iterations++;

      let scrambled = targetTitle
        .split('')
        .map((char, index) => {
          if (char === ' ') return ' ';
          if (index < (iterations / maxIterations) * targetTitle.length) {
            return char;
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join('');

      // Replace targetAccent part with accent span
      if (targetAccent && scrambled.includes(targetAccent)) {
        scrambled = scrambled.replace(targetAccent, `<span class="accent-text">${targetAccent}</span>`);
      } else {
        scrambled = scrambled.replace(/OS|MATRIX|GRAPH|BEDROCK|READY/, match => `<span class="accent-text">${match}</span>`);
      }

      dynamicTextEl.innerHTML = scrambled;
      if (subTickerEl) subTickerEl.textContent = targetSub;

      if (iterations >= maxIterations) {
        clearInterval(interval);
        playSound('click');
      }
    }, 35);
  }

  function dismissSplash() {
    if (dismissed) return;
    dismissed = true;
    if (warpAnimationId) cancelAnimationFrame(warpAnimationId);
    playSound('shockwave');
    splash.classList.add('dismissed');
    setTimeout(() => {
      splash.style.display = 'none';
    }, 850);
  }

  if (skipBtn) {
    skipBtn.addEventListener('click', dismissSplash);
  }

  // Keyboard dismiss: Enter, Space, Escape
  const handleKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ' || e.key === 'Escape') {
      dismissSplash();
      window.removeEventListener('keydown', handleKey);
    }
  };
  window.addEventListener('keydown', handleKey);

  // High-Frequency Progress Dial
  const timer = setInterval(() => {
    if (dismissed) {
      clearInterval(timer);
      return;
    }

    progress += Math.floor(Math.random() * 3) + 2;
    if (progress > 100) progress = 100;

    if (fill) fill.style.width = `${progress}%`;
    if (pctEl) pctEl.textContent = `${progress.toString().padStart(2, '0')}%`;

    // Rolling Hex Token in Corner HUD
    if (cryptHashEl && progress % 4 === 0) {
      const hex = Math.random().toString(16).substring(2, 8).toUpperCase();
      cryptHashEl.textContent = `TOKEN: 0x${hex}`;
    }

    if (memAllocEl && progress % 8 === 0) {
      memAllocEl.textContent = `TELEMETRY: 60 FPS • ${(42 + (progress * 0.12)).toFixed(1)}MB HEAP`;
    }

    // Check if we hit a new stage
    const matchedStageIdx = sequenceStages.findLastIndex(s => progress >= s.pct);
    if (matchedStageIdx !== -1 && matchedStageIdx !== currentStageIdx) {
      currentStageIdx = matchedStageIdx;
      const stage = sequenceStages[currentStageIdx];
      scrambleDecryptText(stage.title, stage.accent, stage.sub);
      if (logEl) logEl.textContent = stage.log;
      playSound('click');
    }

    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(dismissSplash, 550);
    }
  }, 65);
}

window.replayBootSequence = function () {
  const splash = document.getElementById('kineticSplash');
  if (!splash) return;
  splash.style.display = 'flex';
  splash.classList.remove('dismissed');
  initKineticSplash();
};

// --------------------------------------------------------------------------
// 14. Always-on-Top Floating Desktop Micro-Assistant (Document PiP)
// --------------------------------------------------------------------------

let pipWindow = null;

async function togglePipAssistant() {
  if (pipWindow) {
    pipWindow.close();
    pipWindow = null;
    return;
  }

  if ('documentPictureInPicture' in window) {
    try {
      pipWindow = await window.documentPictureInPicture.requestWindow({
        width: 360,
        height: 250
      });

      // Inject custom PiP Desktop Assistant
      pipWindow.document.body.innerHTML = `
        <div class="pip-desktop-container">
          <div class="pip-header">
            <div class="pip-brand">
              <span class="pip-dot"></span>
              <strong style="color:#FFF;">ChronoOS Assistant</strong>
              <span class="pip-badge">Always on Top</span>
            </div>
            <button class="pip-close-btn" onclick="window.close()">✕</button>
          </div>

          <div class="pip-mic-card">
            <button class="pip-orb-btn" id="pipOrb" title="Speak to ChronoOS">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                <line x1="12" y1="19" x2="12" y2="23"></line>
                <line x1="8" y1="23" x2="16" y2="23"></line>
              </svg>
            </button>
            <div class="pip-speech-preview" id="pipSpeechText">"Click mic or ask to open YouTube / add task..."</div>
          </div>

          <div class="pip-actions-row">
            <button class="pip-action-pill" id="pipBtnBriefing">Briefing</button>
            <button class="pip-action-pill" id="pipBtnYoutube">Open YouTube</button>
            <button class="pip-action-pill" id="pipBtnTask">+ Task</button>
          </div>
        </div>
      `;

      // Style PiP Container
      const pipStyle = pipWindow.document.createElement('style');
      pipStyle.textContent = `
        * { box-sizing:border-box; margin:0; padding:0; }
        body { margin:0; padding:12px; background:#07080A; color:#F8FAFC; font-family:'Inter', -apple-system, sans-serif; overflow:hidden; user-select:none; }
        .pip-desktop-container { display:flex; flex-direction:column; gap:10px; height:100%; justify-content:space-between; }
        .pip-header { display:flex; justify-content:space-between; align-items:center; }
        .pip-brand { display:flex; align-items:center; gap:7px; font-size:12px; }
        .pip-dot { width:7px; height:7px; border-radius:50%; background:#FF5C7A; box-shadow:0 0 10px #FF5C7A; animation:pulseDot 1.2s infinite; }
        .pip-badge { font-size:9px; background:rgba(255,92,122,0.15); color:#FF5C7A; padding:2px 6px; border-radius:4px; font-weight:700; border:1px solid rgba(255,92,122,0.3); }
        .pip-close-btn { background:none; border:none; color:#9C9C9D; cursor:pointer; font-size:14px; padding:2px; }
        .pip-mic-card { display:flex; align-items:center; gap:12px; background:#11141A; padding:12px 14px; border-radius:12px; border:1px solid rgba(255,255,255,0.08); }
        .pip-orb-btn { width:40px; height:40px; border-radius:50%; background:#FF5C7A; border:none; color:white; display:flex; align-items:center; justify-content:center; cursor:pointer; box-shadow:0 0 16px rgba(255,92,122,0.5); flex-shrink:0; transition:0.15s; }
        .pip-orb-btn:hover { transform:scale(1.05); }
        .pip-orb-btn:active { transform:scale(0.92); }
        .pip-speech-preview { font-size:11.5px; color:#9C9C9D; line-height:1.45; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; }
        .pip-actions-row { display:flex; gap:6px; }
        .pip-action-pill { flex:1; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.1); color:#F8FAFC; padding:7px 0; border-radius:6px; font-size:11px; cursor:pointer; font-weight:500; transition:0.2s; }
        .pip-action-pill:hover { background:rgba(255,92,122,0.2); border-color:#FF5C7A; color:#FFF; }
        @keyframes pulseDot { 0% { opacity:0.6; } 100% { opacity:1; } }
      `;
      pipWindow.document.head.appendChild(pipStyle);

      // Event Listeners inside Desktop PiP
      const pipOrb = pipWindow.document.getElementById('pipOrb');
      const pipSpeechText = pipWindow.document.getElementById('pipSpeechText');
      const pipBtnBriefing = pipWindow.document.getElementById('pipBtnBriefing');
      const pipBtnYoutube = pipWindow.document.getElementById('pipBtnYoutube');
      const pipBtnTask = pipWindow.document.getElementById('pipBtnTask');

      pipOrb.onclick = () => {
        toggleListening();
        pipSpeechText.textContent = "Listening to voice input...";
      };

      pipBtnBriefing.onclick = () => {
        sendQuery("Alexa, give me my morning briefing");
        pipSpeechText.textContent = "Loading morning briefing...";
      };

      pipBtnYoutube.onclick = () => {
        sendQuery("Alexa, open YouTube");
        pipSpeechText.textContent = "Opening YouTube...";
      };

      pipBtnTask.onclick = () => {
        const desc = prompt("Enter executive task description:");
        if (desc) {
          sendQuery(`add task ${desc}`);
          pipSpeechText.textContent = `Task added: "${desc}"`;
        }
      };

      pipWindow.addEventListener('pagehide', () => {
        pipWindow = null;
      });

      playSound('shockwave');
    } catch (e) {
      console.warn('PiP launch error, falling back:', e);
      alert('Desktop Always-on-Top Widget: Click anywhere on page first to grant PiP permission.');
    }
  } else {
    alert('Always-on-Top Floating PiP is supported in Google Chrome, Edge, and Arc on macOS. For Safari, use Command+K or the main voice orb!');
  }
}

// --------------------------------------------------------------------------
// 15. Executive Live Task Manager
// --------------------------------------------------------------------------

let executiveTasks = [
  { id: 1, text: "Review Acme Corp Section 9.2 counter-offer draft", done: false, priority: "Urgent" },
  { id: 2, text: "Confirm flight UA 482 ground transportation buffer", done: false, priority: "High" },
  { id: 3, text: "Align with board advisor Elena Rostova on Q3 runway", done: true, priority: "Normal" }
];

try {
  const savedTasks = localStorage.getItem('chrono_tasks');
  if (savedTasks) executiveTasks = JSON.parse(savedTasks);
} catch (e) { }

function addExecutiveTask(desc, priority = 'High') {
  executiveTasks.unshift({
    id: Date.now(),
    text: desc,
    done: false,
    priority: priority
  });
  localStorage.setItem('chrono_tasks', JSON.stringify(executiveTasks));
  renderTasksCard();
  playSound('success');
}

function toggleTaskStatus(id) {
  const task = executiveTasks.find(t => t.id === id);
  if (task) {
    task.done = !task.done;
    localStorage.setItem('chrono_tasks', JSON.stringify(executiveTasks));
    renderTasksCard();
    playSound('click');
  }
}

function renderTasksCard() {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#38BDF8; border-color:rgba(56,189,248,0.3);">Task Queue</span>
          <h2 class="card-main-title">Executive Action Items & Tasks</h2>
        </div>
        <span class="card-subtitle-tag">${executiveTasks.filter(t => !t.done).length} Pending Items</span>
      </div>

      <div style="display:flex; gap:10px; margin-bottom:16px;">
        <input type="text" id="newTaskInput" placeholder="Add a new executive task (e.g. 'Draft board reply')..." style="flex:1; background:#07080A; border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:10px 14px; color:#FFF; font-size:13px; outline:none;">
        <button class="btn-raycast-action" onclick="const v = document.getElementById('newTaskInput').value.trim(); if(v) { addExecutiveTask(v); }">Add Task</button>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        ${executiveTasks.map(t => `
          <div style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.02); border:1px solid ${t.done ? 'rgba(255,255,255,0.04)' : 'var(--color-outline)'}; border-radius:var(--radius-md); padding:12px 14px; transition:0.2s; ${t.done ? 'opacity:0.5;' : ''}">
            <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTaskStatus(${t.id})" style="accent-color:var(--color-primary); width:16px; height:16px; cursor:pointer;">
            <span style="flex:1; font-size:13px; color:${t.done ? 'var(--color-secondary)' : 'var(--color-on-surface)'}; text-decoration:${t.done ? 'line-through' : 'none'};">${t.text}</span>
            <span style="font-size:10px; font-weight:600; padding:2px 8px; border-radius:4px; font-family:var(--font-mono); ${t.priority === 'Urgent' ? 'background:rgba(255,77,79,0.15); color:#FF4D4F;' : 'background:rgba(56,189,248,0.15); color:#38BDF8;'}">${t.priority}</span>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:16px; margin-top:16px;">
        <span style="font-size:12px; color:var(--color-secondary);">Say "Alexa, open YouTube" or "Alexa, add task..." to execute automatically.</span>
        <button class="btn-raycast-action" onclick="sendQuery('Alexa, give me my morning briefing')">← Return to Briefing</button>
      </div>
    </div>
  `;
}

function initClock() {
  const clockEl = document.getElementById('deviceClock');
  const echoClockTime = document.getElementById('echoClockTime');
  const echoClockDate = document.getElementById('echoClockDate');
  const workspaceBadgeText = document.getElementById('workspaceBadgeText');

  const updateTime = () => {
    const now = typeof getAppNow === 'function' ? getAppNow() : new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    if (clockEl) clockEl.textContent = now.toLocaleDateString('en-US', options);

    if (echoClockTime) {
      echoClockTime.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    if (echoClockDate) {
      echoClockDate.textContent = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    }
    if (workspaceBadgeText) {
      const longDate = typeof formatAppDateLong === 'function' ? formatAppDateLong(now) : now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
      const org = (typeof currentUser !== 'undefined' && currentUser && (currentUser.organization || (currentUser.is_demo ? 'Live Sandbox' : 'Private Workspace'))) || 'Private Workspace';
      workspaceBadgeText.textContent = `${longDate} • ${org}`;
    }
  };
  updateTime();
  setInterval(updateTime, 10000);
}

// --------------------------------------------------------------------------
// 16. Echo Show 15 Multimodal Smart Display Logic
// --------------------------------------------------------------------------

let isEchoShowMode = false;
let lastEchoToggleTime = 0;

function toggleEchoShowMode(forceState) {
  const now = Date.now();
  // Prevent rapid double-invocations within 250ms unless a specific boolean is forced
  if (typeof forceState !== 'boolean' && (now - lastEchoToggleTime < 250)) {
    return;
  }
  lastEchoToggleTime = now;

  if (typeof forceState === 'boolean') {
    isEchoShowMode = forceState;
  } else {
    isEchoShowMode = !isEchoShowMode;
  }

  const overlay = document.getElementById('echoShowOverlay');
  const echoBtn = document.getElementById('echoModeToggleBtn');
  if (echoBtn) {
    if (isEchoShowMode) {
      echoBtn.classList.add('active');
    } else {
      echoBtn.classList.remove('active');
    }
  }

  if (!overlay) return;

  if (isEchoShowMode) {
    overlay.style.display = 'flex';
    playSound('shockwave');
    syncEchoShowContent();
  } else {
    overlay.style.display = 'none';
    playSound('click');
  }
}
window.toggleEchoShowMode = toggleEchoShowMode;
window.toggleEchoCameraShutter = toggleEchoCameraShutter;

function syncEchoShowContent() {
  const currentCard = multimodalWidgetArea ? multimodalWidgetArea.innerHTML.trim() : '';
  const echoViewport = document.getElementById('echoMultimodalViewport');
  if (echoViewport) {
    if (currentCard) {
      echoViewport.innerHTML = currentCard;
    } else {
      echoViewport.innerHTML = `
        <div class="raycast-3d-card" style="border-color: rgba(0,202,255,0.4); min-height: 280px; display:flex; flex-direction:column; justify-content:center;">
          <div class="card-beam-glow"></div>
          <div class="card-topbar">
            <div class="card-title-group">
              <span class="sheet-badge" style="background:rgba(0,202,255,0.15); color:#00CAFF; border-color:rgba(0,202,255,0.3);">ECHO SHOW 15 • APL 2.0</span>
              <h2 class="card-main-title">Executive Smart Screen Active</h2>
            </div>
          </div>
          <p style="color:var(--color-secondary); font-size:13px; line-height:1.6; margin: 12px 0 16px 0;">
            Multimodal Chief of Staff viewport synchronized. Ask any question with your voice, tap a suggestion capsule, or schedule a task.
          </p>
          <div class="dossier-actions" style="margin-top:auto;">
            <button class="btn-raycast-action alert-action-btn" onclick="sendQuery('Alexa, give me my morning briefing')">Morning Briefing</button>
            <button class="btn-raycast-action" onclick="sendQuery('how can i add my tasks')">+ Add Task</button>
            <button class="btn-raycast-action" onclick="sendQuery('What is the weather today?')">Live Weather</button>
          </div>
        </div>
      `;
    }
  }

  const echoTranscript = document.getElementById('echoSpeechTranscript');
  if (echoTranscript && speechText) {
    echoTranscript.textContent = speechText.textContent;
  }
}

// --------------------------------------------------------------------------
// 17. App Bootstrapping
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initKineticSplash();
  initDotMatrix();
  initClock();
  initSpeechRecognition();
  initCinemaVisualizer();
  initEventListeners();
  apply3DCardTilt();
  updateUserDisplay();
  requestUserLocation();

  // Wire PiP Floating Assistant Button & Keybind (⌘P)
  const pipBtn = document.getElementById('pipAssistantBtn');
  if (pipBtn) {
    pipBtn.addEventListener('click', togglePipAssistant);
  }

  window.addEventListener('keydown', (e) => {
    // ⌘P: Toggle PiP Floating Assistant
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      togglePipAssistant();
    }
    // ⌘E: Toggle Echo Show 15 Smart Display Mode
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
      e.preventDefault();
      toggleEchoShowMode();
    }
    // Escape: Close Echo Show Mode if open
    if (e.key === 'Escape' && isEchoShowMode) {
      e.preventDefault();
      toggleEchoShowMode(false);
    }
  });
});
