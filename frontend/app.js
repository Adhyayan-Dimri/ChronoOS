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

// User Session State (Defaults to Preloaded Executive Demo Sandbox)
let currentUser = {
  name: 'Alex Mercer',
  email: 'alex.mercer@aetherdynamics.com',
  title: 'Chief Executive Officer',
  organization: 'Aether Dynamics Inc.',
  is_demo: true
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
let cinemaCurrentSec = 28;
let cinemaDuration = 140;
let cinemaAudioMuted = true;

function initCinemaVisualizer() {
  if (!cinemaCanvas) return;
  const ctx = cinemaCanvas.getContext('2d');

  let width = (cinemaCanvas.width = 1060);
  let height = (cinemaCanvas.height = 480);

  // Holographic Nodes
  const nodes = [];
  const nodeCount = 38;
  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2.5 + 1.2,
      glow: Math.random() > 0.6
    });
  }

  // Telemetry Log Feed
  const logs = [
    "[BEDROCK] claude-3-5-sonnet: multi-turn agent active",
    "[MCP-HTTP] tools/list: 7 executive endpoints verified",
    "[GUARDRAIL] executive_liability_cap_v2.4: active monitoring",
    "[MEMORY] episodic_graph: 4 corporate policies loaded",
    "[CALENDAR] flight_buffer: UA 482 transit conflict resolved",
    "[HITL-AUTH] Section 9.2 indemnification intercepted: token generated"
  ];
  let logOffset = 0;

  let animFrame = 0;

  function renderCinema() {
    if (cinemaPlaying) {
      animFrame++;
      cinemaCurrentSec = (cinemaCurrentSec + 0.035) % cinemaDuration;
      
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

    ctx.clearRect(0, 0, width, height);

    // Deep grid background
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
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

    // Central 3D Rotating Quantum Singularity
    const cx = width / 2;
    const cy = height / 2;
    const angle = animFrame * 0.015;

    ctx.save();
    ctx.translate(cx, cy);

    // Outer radial rings
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, 110 * r * 0.45, 45 * r * 0.45, angle * r, 0, Math.PI * 2);
      ctx.strokeStyle = r === 2 ? 'rgba(255, 92, 122, 0.7)' : 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = r === 2 ? 1.8 : 1;
      ctx.stroke();
    }

    // Glowing core
    const coreGlow = Math.sin(animFrame * 0.05) * 4;
    ctx.beginPath();
    ctx.arc(0, 0, 14 + coreGlow, 0, Math.PI * 2);
    ctx.fillStyle = '#FF5C7A';
    ctx.shadowColor = '#FF5C7A';
    ctx.shadowBlur = 24;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();

    // Neural Graph Nodes & Laser Links
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      if (cinemaPlaying) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      }

      // Draw connections
      for (let j = i + 1; j < nodes.length; j++) {
        const other = nodes[j];
        const dist = Math.hypot(node.x - other.x, node.y - other.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(other.x, other.y);
          ctx.strokeStyle = `rgba(255, 92, 122, ${(1 - dist / 110) * 0.28})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Draw node point
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.glow ? '#FF5C7A' : 'rgba(255, 255, 255, 0.5)';
      if (node.glow) {
        ctx.shadowColor = '#FF5C7A';
        ctx.shadowBlur = 10;
      }
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Audio Waveform Spectrum Bars along bottom
    const barsCount = 64;
    const barWidth = 4;
    const barGap = 6;
    const totalSpectrumWidth = barsCount * (barWidth + barGap);
    const startX = (width - totalSpectrumWidth) / 2;

    for (let b = 0; b < barsCount; b++) {
      const noise = Math.sin(animFrame * 0.08 + b * 0.2) * Math.cos(animFrame * 0.04 + b * 0.1);
      const barHeight = Math.abs(noise) * 44 + 6;
      const x = startX + b * (barWidth + barGap);
      const y = height - 50 - barHeight;

      const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
      grad.addColorStop(0, '#FF5C7A');
      grad.addColorStop(1, 'rgba(255, 92, 122, 0.1)');

      ctx.fillStyle = grad;
      ctx.fillRect(x, y, barWidth, barHeight);
    }

    // Streaming HUD Telemetry on Left Edge
    ctx.font = '11px JetBrains Mono, monospace';
    ctx.fillStyle = 'rgba(56, 189, 248, 0.85)';
    for (let l = 0; l < logs.length; l++) {
      const logY = 60 + l * 20;
      ctx.fillText(logs[l], 40, logY);
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

  document.querySelectorAll('.chapter-pill').forEach(pill => {
    pill.classList.toggle('active', pill.textContent.includes(title.split(' ')[1]));
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
// 14. App Bootstrapping
// --------------------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initDotMatrix();
  initClock();
  initSpeechRecognition();
  initCinemaVisualizer();
  initEventListeners();
  apply3DCardTilt();
  updateUserDisplay();
});
