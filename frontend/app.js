/**
 * ChronoOS • Framer Dark Edition Client
 * Implements:
 * - Web Speech API (STT & TTS)
 * - Framer Dark card rendering (Electric blue #0099FF highlights, 8px radii, 40px buttons)
 * - Real-Time Bedrock Agent & MCP Thought Inspector Telemetry
 * - Human-in-the-Loop Framer Modal (<dialog>) Authorization
 */

const API_BASE = window.location.origin;

// State
let isListening = false;
let isSpeaking = false;
let speechRecognition = null;
let currentPendingAction = null;

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

// Dialog Elements
const hitlDialog = document.getElementById('hitlDialog');
const dialogToken = document.getElementById('dialogToken');
const dialogRecipient = document.getElementById('dialogRecipient');
const dialogPayload = document.getElementById('dialogPayload');
const dialogApproveBtn = document.getElementById('dialogApproveBtn');

// -------------------------------------------------------------
// 1. Initialization & Voice Setup
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
  initClock();
  initSpeechRecognition();
  initEventListeners();
});

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

function initSpeechRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;
    speechRecognition.lang = 'en-US';

    speechRecognition.onstart = () => {
      isListening = true;
      micOrbBtn.classList.add('active');
    };

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      voiceTextInput.value = transcript;
      sendQuery(transcript);
    };

    speechRecognition.onerror = (event) => {
      console.warn('Speech recognition notice:', event.error);
      stopListening();
    };

    speechRecognition.onend = () => {
      stopListening();
    };
  }
}

function toggleListening() {
  if (!speechRecognition) {
    voiceTextInput.focus();
    return;
  }
  if (isListening) {
    speechRecognition.stop();
    stopListening();
  } else {
    try {
      speechRecognition.start();
    } catch (e) {
      console.warn('Speech recognition already started', e);
    }
  }
}

function stopListening() {
  isListening = false;
  micOrbBtn.classList.remove('active');
}

// -------------------------------------------------------------
// 2. Text-to-Speech (Neural Output)
// -------------------------------------------------------------

function speakResponse(text) {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel();
  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Samantha') || v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Siri')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  utterance.rate = 1.05;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    isSpeaking = true;
    micOrbBtn.classList.add('active');
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (!isListening) {
      micOrbBtn.classList.remove('active');
    }
  };

  window.speechSynthesis.speak(utterance);
}

// -------------------------------------------------------------
// 3. Query Dispatch & Bedrock Agent Communication
// -------------------------------------------------------------

async function handleFormSubmit() {
  const query = voiceTextInput.value.trim();
  if (query) {
    await sendQuery(query);
    voiceTextInput.value = '';
  }
}

async function sendQuery(queryText) {
  stopListening();
  speechText.innerHTML = `<em>"Analyzing with Amazon Bedrock & MCP Tools..."</em>`;
  speechTimestamp.textContent = 'Thinking...';

  try {
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: queryText })
    });

    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
    const data = await res.json();
    renderAgentTurn(data);
  } catch (err) {
    console.error('Failed to communicate with ChronoOS Gateway:', err);
    speechText.textContent = `Apologies, Alex. An error occurred in the agent runtime: ${err.message}`;
  }
}

// -------------------------------------------------------------
// 4. Rendering Framer Dark Cards & Telemetry
// -------------------------------------------------------------

function renderAgentTurn(data) {
  // 1. Update Agent Banner & Voice
  speechText.textContent = `"${data.voice_response}"`;
  speechTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  speakResponse(data.voice_response);

  // 2. Render Telemetry & Thought Stream
  renderInspectorTelemetry(data);

  // 3. Render Card in Main Screen
  const card = data.visual_card;
  if (!card) return;

  if (card.type === 'EXECUTIVE_BRIEFING') {
    renderBriefingCard(card);
  } else if (card.type === 'CONTRACT_REDLINE_ANALYSIS') {
    renderContractRedlineCard(card);
  } else if (card.type === 'CONFIRMATION_REQUIRED') {
    renderConfirmationCard(card);
    openHitlDialog(data.confirmation_needed);
  } else if (card.type === 'ACTION_EXECUTED') {
    renderExecutionCard(card);
  } else {
    renderGenericCard(card);
  }
}

function renderInspectorTelemetry(data) {
  telemetryLatency.textContent = `${data.latency_ms} ms`;
  if (data.bedrock_metadata && data.bedrock_metadata.model_id) {
    telemetryModel.textContent = data.bedrock_metadata.model_id;
  }

  // Populate Trace Feed
  traceFeed.innerHTML = '';
  data.trace_events.forEach(evt => {
    const item = document.createElement('div');
    item.className = 'trace-flow-step';
    item.innerHTML = `
      <div class="flow-step-header">${evt.stage} ${evt.tool ? `• <span style="color:var(--color-primary)">${evt.tool}</span>` : ''}</div>
      <div class="flow-step-desc">${evt.detail || (evt.args ? JSON.stringify(evt.args) : 'Operation executed.')}</div>
    `;
    traceFeed.appendChild(item);
  });

  // Populate Last MCP Payload
  if (data.tools_invoked && data.tools_invoked.length > 0) {
    const lastTool = data.tools_invoked[data.tools_invoked.length - 1];
    mcpPayloadJson.textContent = JSON.stringify(lastTool, null, 2);
  }
}

function renderContractRedlineCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="framer-card">
      <div class="framer-card-header">
        <div>
          <div class="card-tagline">Legal Risk Assessment</div>
          <h2 class="card-headline">${card.title}</h2>
        </div>
        <span class="card-date-meta">${card.parties}</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px;">
        ${card.critical_clauses.map(clause => `
          <div style="background:var(--color-tertiary); border:1px solid var(--color-border); border-radius:8px; padding:18px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:10px; align-items:baseline;">
              <strong style="font-size:14px; font-weight:600; color:var(--color-secondary);">${clause.section}</strong>
              <span style="font-size:11px; font-weight:600; color:var(--color-primary); background:rgba(0,153,255,0.12); border:1px solid var(--glow-border); padding:2px 8px; border-radius:4px;">${clause.guardrail_status}</span>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:12px; font-size:13px;">
              <div style="background:var(--color-neutral); border:1px solid var(--color-border); padding:12px; border-radius:6px;">
                <div style="font-size:10px; color:var(--color-muted-text); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Approved Board Mandate</div>
                <div style="line-height:1.4;">${clause.original}</div>
              </div>
              <div style="background:rgba(255,77,77,0.06); border:1px solid rgba(255,77,77,0.3); padding:12px; border-radius:6px;">
                <div style="font-size:10px; color:var(--color-error); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Acme Proposed Redline (Violation)</div>
                <div style="line-height:1.4; color:var(--color-secondary);">${clause.redline}</div>
              </div>
            </div>

            <div style="font-size:12px; color:var(--color-muted-text); border-left:2px solid var(--color-primary); padding-left:10px; line-height:1.4;">
              <strong style="color:var(--color-secondary);">Autonomous Recommendation:</strong> ${clause.recommendation}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid rgba(255,255,255,0.06); padding-top:16px;">
        <span style="font-size:12px; color:var(--color-muted-text);">${card.action_prompt}</span>
        <button class="btn-framer-primary" onclick="sendQuery('Alexa, prepare a counter-offer rejecting the 12 million cap')">
          Draft Counter-Offer Now
        </button>
      </div>
    </div>
  `;
}

function renderConfirmationCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="framer-card" style="border-color:var(--glow-border);">
      <div class="framer-card-header">
        <div>
          <div class="card-tagline">Authorization Mandated</div>
          <h2 class="card-headline">${card.title}</h2>
        </div>
        <span class="card-date-meta" style="font-family:var(--font-mono); color:var(--color-primary);">${card.token}</span>
      </div>

      <div style="background:var(--color-tertiary); border:1px solid var(--color-border); border-radius:8px; padding:18px; margin-bottom:16px;">
        <div style="font-size:11px; color:var(--color-muted-text); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Target Recipient</div>
        <div style="font-size:13px; font-weight:500; margin-bottom:14px;">${card.recipient}</div>

        <div style="font-size:11px; color:var(--color-muted-text); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Drafted Response</div>
        <div style="font-size:13px; line-height:1.5; white-space:pre-wrap; background:var(--color-neutral); border:1px solid var(--color-border); padding:12px; border-radius:6px; color:#e2e8f0;">${card.payload}</div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <button class="btn-framer-secondary" onclick="sendQuery('Alexa, cancel this action')">Reject Action</button>
        <button class="btn-framer-primary" onclick="openHitlDialogCurrent()">Review & Authorize</button>
      </div>
    </div>
  `;
}

function renderExecutionCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="framer-card">
      <div class="framer-card-header">
        <div>
          <div class="card-tagline" style="color:#10b981;">Execution Receipt</div>
          <h2 class="card-headline">${card.title}</h2>
        </div>
        <span class="card-date-meta" style="font-family:var(--font-mono); color:#10b981;">${card.receipt}</span>
      </div>

      <div style="background:rgba(16,185,129,0.08); border:1px solid rgba(16,185,129,0.25); border-radius:8px; padding:20px; margin-bottom:16px;">
        <div style="font-size:15px; font-weight:600; color:var(--color-secondary); margin-bottom:4px;">${card.status}</div>
        <div style="font-size:13px; color:var(--color-muted-text); line-height:1.5;">${card.details}</div>
      </div>

      <button class="btn-framer-secondary" onclick="sendQuery('Alexa, give me my morning briefing')">
        ← Return to Briefing Dashboard
      </button>
    </div>
  `;
}

function renderGenericCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="framer-card">
      <h2 class="card-headline" style="margin-bottom:8px;">${card.title}</h2>
      <p style="font-size:14px; color:var(--color-muted-text); margin-bottom:16px; line-height:1.5;">${card.summary || ''}</p>
      ${card.relevant_memories ? `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${card.relevant_memories.map(m => `
            <div style="background:var(--color-tertiary); border:1px solid var(--color-border); border-radius:6px; padding:10px 14px; font-size:13px;">
              <strong style="color:var(--color-primary);">${m.entity}:</strong> ${m.memory}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

// -------------------------------------------------------------
// 5. Human-in-the-Loop Native Dialog Control
// -------------------------------------------------------------

function openHitlDialog(action) {
  if (!action) return;
  currentPendingAction = action;
  dialogToken.textContent = action.token;
  dialogRecipient.textContent = action.recipient;
  dialogPayload.textContent = action.body;
  hitlDialog.showModal();
}

function openHitlDialogCurrent() {
  if (currentPendingAction) {
    hitlDialog.showModal();
  }
}

function closeDialog(decision) {
  hitlDialog.close();
  if (decision === 'REJECTED' && currentPendingAction) {
    sendQuery(`Alexa, reject action ${currentPendingAction.token}`);
  }
}

async function confirmAction(decision) {
  hitlDialog.close();
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

// -------------------------------------------------------------
// 6. UI Controls & Listeners
// -------------------------------------------------------------

function initEventListeners() {
  micOrbBtn.addEventListener('click', toggleListening);
  
  inspectorToggleBtn.addEventListener('click', () => {
    displayInspectorPane.classList.toggle('collapsed');
  });

  closeInspectorBtn.addEventListener('click', () => {
    displayInspectorPane.classList.add('collapsed');
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      voiceTextInput.focus();
    }
    if ((e.metaKey || e.ctrlKey) && e.key === 'i') {
      e.preventDefault();
      displayInspectorPane.classList.toggle('collapsed');
    }
  });
}
