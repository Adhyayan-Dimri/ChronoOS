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

const API_BASE = window.location.origin;

// State Variables
let isListening = false;
let isSpeaking = false;
let speechRecognition = null;
let currentPendingAction = null;
let soundEnabled = true;
let audioCtx = null;
let activeTab = 'overview';
let isZenMode = false;

// User Session State (Defaults to Clean Private Executive Workspace)
let currentUser = {
  name: 'Executive Workspace',
  email: 'executive@enterprise.internal',
  title: 'Executive User',
  organization: 'Personal Workspace',
  is_demo: false
};

// Check local storage for active session
try {
  const savedUser = localStorage.getItem('chrono_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
} catch (e) {
  console.log('Session storage initialized.');
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

function updateUserDisplay() {
  if (currentUser.is_demo) {
    userPill.classList.add('demo-mode');
    userNameDisplay.textContent = 'Alex Mercer (CEO • Demo)';
    workspaceBadgeText.textContent = 'Wednesday, October 21, 2026 • Live Sandbox';
    workspaceStatusDot.style.background = '#FF5C7A';
    authBtnText.textContent = 'Accounts';
  } else {
    userPill.classList.remove('demo-mode');
    userNameDisplay.textContent = `${currentUser.name} (${currentUser.organization})`;
    workspaceBadgeText.textContent = `Wednesday, October 21, 2026 • Private Workspace`;
    workspaceStatusDot.style.background = '#10B981';
    authBtnText.textContent = 'Sandbox';
  }

  switchWorkspaceTab(activeTab);
}

function openAuthPortal() {
  playSound('click');
  authPortalDialog.showModal();
  // By default, activate Sign In tab first
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
  localStorage.setItem('chrono_user', JSON.stringify(currentUser));
  closeAuthPortal();
  playSound('success');
  updateUserDisplay();
  
  speechText.textContent = "Switched to preloaded Executive Sandbox (Alex Mercer). Acme M&A redlines and flight UA 482 delay active.";
  speechTimestamp.textContent = 'Just now';
}

async function handleUserSignIn() {
  const email = document.getElementById('signInEmail').value.trim();
  const password = document.getElementById('signInPassword').value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, is_demo: false })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('chrono_user', JSON.stringify(currentUser));
      closeAuthPortal();
      playSound('success');
      updateUserDisplay();
      speechText.textContent = `Welcome back to your private executive workspace, ${currentUser.name}. Zero dummy clutter loaded.`;
    }
  } catch (err) {
    console.error('Sign in error:', err);
  }
}

async function handleUserRegister() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const organization = document.getElementById('regOrg').value.trim();
  const password = document.getElementById('regPassword').value;

  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, organization, password })
    });
    const data = await res.json();
    if (data.success) {
      currentUser = data.user;
      localStorage.setItem('chrono_user', JSON.stringify(currentUser));
      closeAuthPortal();
      playSound('success');
      updateUserDisplay();
      speechText.textContent = `Clean private workspace created for ${currentUser.name} (${currentUser.organization}). You have an empty slate.`;
    }
  } catch (err) {
    console.error('Registration error:', err);
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

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    return;
  }

  speechRecognition = new SpeechRecognition();
  speechRecognition.continuous = false;
  speechRecognition.interimResults = false;
  speechRecognition.lang = 'en-US';

  speechRecognition.onstart = () => {
    isListening = true;
    micOrbBtn.classList.add('recording');
    playSound('shockwave');
  };

  speechRecognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    voiceTextInput.value = transcript;
    playSound('execute');
    sendQuery(transcript);
  };

  speechRecognition.onerror = (event) => {
    isListening = false;
    micOrbBtn.classList.remove('recording');
  };

  speechRecognition.onend = () => {
    isListening = false;
    micOrbBtn.classList.remove('recording');
  };
}

function toggleListening() {
  if (!speechRecognition) {
    simulateVoiceCommand();
    return;
  }

  if (isListening) {
    speechRecognition.stop();
  } else {
    speechRecognition.start();
  }
}

function simulateVoiceCommand() {
  const simulatedPrompts = currentUser.is_demo ? [
    "Alexa, give me my morning briefing",
    "Alexa, inspect the Acme merger redline from Sarah",
    "Alexa, prepare a counter-offer rejecting the 12 million cap",
    "Alexa, check for travel buffer conflicts tomorrow"
  ] : [
    "Alexa, what is on my schedule today?",
    "Alexa, schedule a strategic review with Elena at 3 PM",
    "Alexa, summarize my private executive status"
  ];

  const chosen = simulatedPrompts[Math.floor(Math.random() * simulatedPrompts.length)];
  voiceTextInput.value = chosen;
  micOrbBtn.classList.add('recording');
  playSound('shockwave');

  setTimeout(() => {
    micOrbBtn.classList.remove('recording');
    sendQuery(chosen);
  }, 900);
}

function speakAgentResponse(text) {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();

  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Natural')));
  if (preferredVoice) utterance.voice = preferredVoice;

  window.speechSynthesis.speak(utterance);
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

  // 1. Direct Client-Side Action: Open YouTube
  const cleanQuery = promptText.trim().toLowerCase();
  if (cleanQuery.includes('open youtube') || cleanQuery.includes('launch youtube') || cleanQuery === 'youtube') {
    speechText.textContent = "Opening YouTube for you now in a new tab.";
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse("Opening YouTube for you now in a new tab.");
    window.open('https://www.youtube.com', '_blank');
    renderCardContent({
      type: 'ACTION_EXECUTED',
      title: 'Application Launched: YouTube',
      receipt: 'ACT-APP-YT-01',
      status: 'Chrome Browser Navigation Hook Executed',
      details: 'Successfully launched https://www.youtube.com in an external browser tab.'
    }, {});
    return;
  }

  // 2. Direct Client-Side Action: Open Google / Search
  if (cleanQuery.includes('open google') || cleanQuery.includes('launch google')) {
    speechText.textContent = "Opening Google in a new tab.";
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse("Opening Google in a new tab.");
    window.open('https://www.google.com', '_blank');
    return;
  }

  // 3. Direct Task Management Hook ("add task ...", "help me do this task ...")
  if (cleanQuery.startsWith('add task') || cleanQuery.startsWith('create task') || cleanQuery.includes('add this task')) {
    const taskText = promptText.replace(/^(alexa,\s*)?(add task|create task|add this task|help me do this task)\s*/i, '').trim() || "Executive Follow-up Action";
    addExecutiveTask(taskText);
    const respMsg = `Added task to your active executive queue: "${taskText}".`;
    speechText.textContent = respMsg;
    speechTimestamp.textContent = 'Just now';
    speakAgentResponse(respMsg);
    return;
  }

  speechText.innerHTML = `<span style="color:var(--color-primary); font-weight:600;">ChronoOS Bedrock Agent Reasoning...</span> Evaluating tools via Model Context Protocol for ${currentUser.name}.`;
  speechTimestamp.textContent = 'Streaming...';

  const startTime = performance.now();

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: promptText,
        prompt: promptText,
        user_email: currentUser.email,
        email: currentUser.email
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
  if (card.type === 'EXECUTIVE_BRIEFING') {
    renderBriefingCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'PERSONAL_BRIEFING') {
    renderPersonalBriefingCard(card);
    activeTab = 'overview';
    updateActiveTabUI('overview');
  } else if (card.type === 'CONTRACT_REDLINE_ANALYSIS') {
    renderContractRedlineCard(card);
    activeTab = 'legal';
    updateActiveTabUI('legal');
  } else if (card.type === 'CONFIRMATION_REQUIRED') {
    renderConfirmationCard(card);
    openHitlDialog(data.confirmation_needed);
  } else if (card.type === 'ACTION_EXECUTED') {
    renderExecutionCard(card);
  } else {
    renderGenericCard(card);
  }

  apply3DCardTilt();
}

function renderInspectorTelemetry(data) {
  telemetryLatency.textContent = `${data.latency_ms} ms`;
  if (data.bedrock_metadata && data.bedrock_metadata.model_id) {
    telemetryModel.textContent = data.bedrock_metadata.model_id;
  }

  traceFeed.innerHTML = '';
  if (data.trace_events) {
    data.trace_events.forEach(evt => {
      const item = document.createElement('div');
      item.className = 'raycast-trace-item';
      item.innerHTML = `
        <div class="trace-item-header">${evt.stage} ${evt.tool ? `• <span class="tool-tag">${evt.tool}</span>` : ''}</div>
        <div class="trace-item-body">${evt.detail || (evt.args ? JSON.stringify(evt.args) : 'Operation verified.')}</div>
      `;
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
  if (!currentUser.is_demo) {
    renderPersonalBriefingCard({
      title: `Private Executive Briefing • ${currentUser.name}`,
      organization: currentUser.organization,
      commitments_count: 0,
      alerts_count: 0
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
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card" id="briefingCard">
      <div class="card-beam-glow"></div>
      
      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.3);">Private Workspace</span>
          <h2 class="card-main-title">${card.title || `Executive Workspace • ${currentUser.name}`}</h2>
        </div>
        <span class="card-subtitle-tag">${currentUser.organization}</span>
      </div>

      <div class="raycast-metrics-grid">
        <div class="metric-tile">
          <div class="metric-tile-label">Personal Schedule</div>
          <div class="metric-tile-val">0 Commitments</div>
          <div class="metric-tile-tag">Clear Calendar Slate</div>
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

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--color-outline); border-radius:var(--radius-md); padding:24px; display:flex; flex-direction:column; gap:12px;">
        <div style="font-size:16px; font-weight:600; color:var(--color-on-surface);">Your Clean Executive Canvas</div>
        <p style="font-size:14px; color:var(--color-secondary); line-height:1.55;">
          You are logged into your private, isolated account. You will not see random demo data or dummy M&A items here. 
          Use voice or command inputs to schedule your real meetings, add memory context, or inspect your own contracts.
        </p>
        <div style="display:flex; gap:10px; margin-top:8px;">
          <button class="btn-raycast-action" onclick="sendQuery('Alexa, schedule team sync today at 2:00 PM')">+ Schedule Meeting</button>
          <button class="btn-raycast-action" onclick="sendQuery('Alexa, remember that board deck is due on Friday')">+ Add Strategic Note</button>
          <button class="btn-raycast-action" onclick="openAuthPortal()">Switch to Demo Sandbox</button>
        </div>
      </div>
    </div>
  `;
}

function renderContractRedlineCard(card) {
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
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>

      <div class="card-topbar">
        <div class="card-title-group">
          <span class="card-badge" style="color:#10b981; border-color:rgba(16,185,129,0.35);">Execution Receipt</span>
          <h2 class="card-main-title">${card.title}</h2>
        </div>
        <span class="code-token" style="color:#10b981;">${card.receipt}</span>
      </div>

      <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:var(--radius-md); padding:24px;">
        <div style="font-size:16px; font-weight:600; color:var(--color-on-surface); margin-bottom:6px;">${card.status}</div>
        <div style="font-size:14px; color:var(--color-secondary); line-height:1.5;">${card.details}</div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-outline); padding-top:18px;">
        <span style="font-size:13px; color:var(--color-secondary);">Official Amazon Bedrock audit trail generated.</span>
        <button class="btn-raycast-action" onclick="sendQuery('Alexa, give me my morning briefing')">
          ← Return to Briefing Dashboard
        </button>
      </div>
    </div>
  `;
}

function renderCalendarTravelCard() {
  if (!currentUser.is_demo) {
    multimodalWidgetArea.innerHTML = `
      <div class="raycast-3d-card">
        <div class="card-beam-glow"></div>
        <div class="card-topbar">
          <div class="card-title-group">
            <span class="card-badge" style="color:#10b981;">Private Calendar</span>
            <h2 class="card-main-title">Personal Schedule & Buffer</h2>
          </div>
          <span class="card-subtitle-tag">${currentUser.name}</span>
        </div>
        <div style="padding:20px; font-size:14px; color:var(--color-secondary);">
          No travel conflicts or calendar collisions detected. You have a clean buffer.
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
          <span class="card-badge" style="color:var(--color-warning); border-color:rgba(245,158,11,0.35);">Buffer Conflict</span>
          <h2 class="card-main-title">Executive Schedule & Travel Risk Analysis</h2>
        </div>
        <span class="card-subtitle-tag">Thursday, Oct 22 • SFO → JFK Keynote</span>
      </div>

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
          <strong style="color:var(--color-on-surface);">Autonomous Buffer Strategy:</strong> ChronoOS can reschedule the Keynote Prep to 09:45 AM or initiate remote bridge access directly from your ground transport vehicle.
        </div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px; border-top:1px solid var(--color-outline); padding-top:18px;">
        <button class="btn-raycast-action" onclick="sendQuery('Alexa, reschedule keynote prep to 09:45 AM')">Reschedule to 09:45 AM</button>
        <button class="btn-execute-key" onclick="sendQuery('Alexa, notify Elena of flight delay and enable remote car bridge')">
          <span>Authorize Ground Bridge</span>
          <span class="btn-arrow">→</span>
        </button>
      </div>
    </div>
  `;
}

function renderGenericCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="raycast-3d-card">
      <div class="card-beam-glow"></div>
      <h2 class="card-main-title" style="margin-bottom:8px;">${card.title}</h2>
      <p style="font-size:14px; color:var(--color-secondary); margin-bottom:16px; line-height:1.5;">${card.summary || ''}</p>
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
  } catch (e) {}
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

window.replayBootSequence = function() {
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
} catch (e) {}

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
  const updateTime = () => {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    clockEl.textContent = now.toLocaleDateString('en-US', options);
  };
  updateTime();
  setInterval(updateTime, 10000);
}

// --------------------------------------------------------------------------
// 16. App Bootstrapping
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

  // Wire PiP Floating Assistant Button & Keybind (⌘P)
  const pipBtn = document.getElementById('pipAssistantBtn');
  if (pipBtn) {
    pipBtn.addEventListener('click', togglePipAssistant);
  }
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
      e.preventDefault();
      togglePipAssistant();
    }
  });
});
