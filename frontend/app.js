/**
 * ChronoOS Alexa Echo Show 15 Multimodal Client
 * Manages:
 * - Web Speech API (STT & TTS) with Audio Waveform sync
 * - Dynamic Multimodal Widget Rendering
 * - Real-Time Bedrock Agent & MCP Thought Inspector Telemetry
 * - Human-in-the-Loop Dialog Authorization
 */

const API_BASE = window.location.origin;

// State
let isListening = false;
let isSpeaking = false;
let speechRecognition = null;
let currentPendingAction = null;

// DOM Elements
const micOrbBtn = document.getElementById('micOrbBtn');
const audioWaveformCanvas = document.getElementById('audioWaveformCanvas');
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
      micOrbBtn.classList.add('listening');
      audioWaveformCanvas.classList.add('active');
    };

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      voiceTextInput.value = transcript;
      sendQuery(transcript);
    };

    speechRecognition.onerror = (event) => {
      console.warn('Speech recognition notification:', event.error);
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
      console.warn('Voice recognition already started', e);
    }
  }
}

function stopListening() {
  isListening = false;
  micOrbBtn.classList.remove('listening');
  if (!isSpeaking) {
    audioWaveformCanvas.classList.remove('active');
  }
}

// -------------------------------------------------------------
// 2. Text-to-Speech (Alexa Voice Output)
// -------------------------------------------------------------

function speakAlexaResponse(text) {
  if (!('speechSynthesis' in window)) return;
  
  window.speechSynthesis.cancel(); // Cancel any prior speech
  const cleanText = text.replace(/[*_#`]/g, '');
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Pick high-quality English voice if available
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Siri')));
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  utterance.rate = 1.05;
  utterance.pitch = 1.02;

  utterance.onstart = () => {
    isSpeaking = true;
    audioWaveformCanvas.classList.add('active');
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (!isListening) {
      audioWaveformCanvas.classList.remove('active');
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
  speechText.innerHTML = `<em>"Processing with Amazon Bedrock & MCP Tools..."</em>`;
  speechTimestamp.textContent = 'Thinking...';
  audioWaveformCanvas.classList.add('active');

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
    speechText.textContent = `Apologies, Alex. An error occurred while communicating with the agent runtime: ${err.message}`;
    audioWaveformCanvas.classList.remove('active');
  }
}

// -------------------------------------------------------------
// 4. Rendering Multimodal Visual Cards & Telemetry
// -------------------------------------------------------------

function renderAgentTurn(data) {
  // 1. Update Alexa Speech Bubble & Voice
  speechText.textContent = `"${data.voice_response}"`;
  speechTimestamp.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  speakAlexaResponse(data.voice_response);

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
    // Automatically trigger Human-in-the-Loop dialog
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
    item.className = 'trace-item completed';
    item.innerHTML = `
      <div class="trace-icon">✓</div>
      <div class="trace-content">
        <div class="trace-stage">${evt.stage} ${evt.tool ? `• <span style="color:var(--alexa-cyan)">${evt.tool}</span>` : ''}</div>
        <div class="trace-desc">${evt.detail || (evt.args ? JSON.stringify(evt.args) : 'Operation completed.')}</div>
      </div>
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
    <div class="card-glass redline-card">
      <div class="card-header">
        <div class="card-title-group">
          <span class="badge-tag accent">Legal Risk Assessment</span>
          <h2 class="card-title">${card.title}</h2>
        </div>
        <span class="card-date">${card.parties}</span>
      </div>

      <div class="redline-clauses-list">
        ${card.critical_clauses.map(clause => `
          <div class="clause-box" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:16px; margin-bottom:14px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
              <strong style="color:var(--text-primary); font-size:14px;">${clause.section}</strong>
              <span style="font-size:11px; font-weight:700; color:var(--status-critical); background:var(--status-critical-bg); padding:2px 8px; border-radius:4px;">${clause.guardrail_status}</span>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:10px; font-size:13px;">
              <div style="background:rgba(0,0,0,0.3); padding:10px; border-radius:6px; border-left:3px solid var(--alexa-cyan);">
                <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Original Approved Mandate</div>
                <div>${clause.original}</div>
              </div>
              <div style="background:rgba(239,68,68,0.1); padding:10px; border-radius:6px; border-left:3px solid var(--status-critical);">
                <div style="font-size:10px; color:var(--status-critical); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Acme Proposed Redline (Violates Policy)</div>
                <div>${clause.redline}</div>
              </div>
            </div>

            <div style="font-size:12px; color:#38bdf8; background:rgba(56,189,248,0.1); padding:8px 12px; border-radius:6px;">
              💡 <strong>Autonomous Chief of Staff Recommendation:</strong> ${clause.recommendation}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px;">
        <span style="font-size:12px; color:var(--text-muted);">${card.action_prompt}</span>
        <button class="alert-action-btn" style="background:var(--alexa-cyan); color:#000; font-weight:700;" onclick="sendQuery('Alexa, prepare a counter-offer rejecting the 12 million cap')">
          Draft Counter-Offer Now
        </button>
      </div>
    </div>
  `;
}

function renderConfirmationCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="card-glass confirmation-card" style="border-color:rgba(245,158,11,0.4);">
      <div class="card-header">
        <div class="card-title-group">
          <span class="badge-tag" style="background:rgba(245,158,11,0.2); color:var(--status-warning);">Human-in-the-Loop Required</span>
          <h2 class="card-title">${card.title}</h2>
        </div>
        <span class="card-date" style="font-family:var(--font-mono); color:var(--alexa-cyan);">${card.token}</span>
      </div>

      <div style="background:rgba(0,0,0,0.35); padding:16px; border-radius:12px; margin-bottom:18px;">
        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Target Recipient</div>
        <div style="font-size:13px; font-weight:600; margin-bottom:12px;">${card.recipient}</div>

        <div style="font-size:11px; color:var(--text-muted); text-transform:uppercase; font-weight:700; margin-bottom:4px;">Draft Counter-Offer</div>
        <div style="font-size:13px; line-height:1.5; color:#e2e8f0; white-space:pre-wrap;">${card.payload}</div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:12px;">
        <button class="btn-cancel" onclick="sendQuery('Alexa, cancel this action')">Reject Action</button>
        <button class="btn-approve" onclick="openHitlDialogCurrent()">Review & Approve on Screen</button>
      </div>
    </div>
  `;
}

function renderExecutionCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="card-glass execution-card" style="border-color:rgba(16,185,129,0.4);">
      <div class="card-header">
        <div class="card-title-group">
          <span class="badge-tag" style="background:rgba(16,185,129,0.2); color:var(--status-success);">Action Finalized</span>
          <h2 class="card-title">${card.title}</h2>
        </div>
        <span class="card-date" style="font-family:var(--font-mono); color:var(--status-success);">${card.receipt}</span>
      </div>

      <div style="display:flex; align-items:center; gap:16px; background:rgba(16,185,129,0.08); padding:18px; border-radius:12px; margin-bottom:18px;">
        <div style="font-size:32px;">✅</div>
        <div>
          <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">${card.status}</div>
          <div style="font-size:13px; color:var(--text-secondary);">${card.details}</div>
        </div>
      </div>

      <button class="alert-action-btn" onclick="sendQuery('Alexa, give me my morning briefing')">
        ← Return to Briefing Dashboard
      </button>
    </div>
  `;
}

function renderGenericCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="card-glass">
      <h2 class="card-title" style="margin-bottom:12px;">${card.title}</h2>
      <p style="font-size:14px; color:var(--text-secondary); margin-bottom:16px;">${card.summary || ''}</p>
      ${card.relevant_memories ? `
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${card.relevant_memories.map(m => `
            <div style="background:rgba(255,255,255,0.02); padding:10px 14px; border-radius:8px; font-size:13px;">
              <strong style="color:var(--alexa-cyan);">${m.entity}:</strong> ${m.memory}
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
      voice_response: `Action confirmed. Your legal counter-offer has been officially dispatched to Sarah Chen and the Acme M&A advisory room.`,
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
      latency_ms: 120
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
}
