/**
 * ChronoOS • Lusion Minimal Editorial Client
 * Implements:
 * - Web Speech API (STT & TTS)
 * - Lusion Minimal card rendering (Oversized typography, 8px radius, 1px borders, pill buttons)
 * - Real-Time Bedrock Agent & MCP Thought Inspector Telemetry
 * - Human-in-the-Loop Native Modal (<dialog>) Authorization
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
      micOrbBtn.classList.add('recording');
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
  micOrbBtn.classList.remove('recording');
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
    micOrbBtn.classList.add('recording');
  };

  utterance.onend = () => {
    isSpeaking = false;
    if (!isListening) {
      micOrbBtn.classList.remove('recording');
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
// 4. Rendering Lusion Minimal Cards & Telemetry
// -------------------------------------------------------------

function renderAgentTurn(data) {
  // 1. Update Editorial Quote Box & Voice
  speechText.textContent = `"${data.voice_response}"`;
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
    item.className = 'trace-item-editorial';
    item.innerHTML = `
      <div class="trace-item-stage">${evt.stage} ${evt.tool ? `• [${evt.tool}]` : ''}</div>
      <div class="trace-item-desc">${evt.detail || (evt.args ? JSON.stringify(evt.args) : 'Operation executed.')}</div>
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
    <div class="lusion-card">
      <div class="card-title-row">
        <div>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--color-primary-60);">Legal Risk Assessment</span>
          <h2 class="card-heading" style="margin-top:4px;">${card.title}</h2>
        </div>
        <span class="card-timestamp">${card.parties}</span>
      </div>

      <div style="display:flex; flex-direction:column; gap:20px; margin-bottom:28px;">
        ${card.critical_clauses.map(clause => `
          <div style="border:1px solid var(--color-secondary); border-radius:8px; padding:24px;">
            <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:baseline;">
              <strong style="font-size:15px; font-weight:600; color:var(--color-primary);">${clause.section}</strong>
              <span style="font-size:11px; font-weight:700; border:1px solid var(--color-primary); padding:2px 8px; border-radius:4px;">${clause.guardrail_status}</span>
            </div>
            
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px; font-size:14px;">
              <div style="background:#fafafa; border:1px solid var(--color-secondary); padding:14px; border-radius:4px;">
                <div style="font-size:11px; color:var(--color-primary-60); text-transform:uppercase; font-weight:600; margin-bottom:6px;">Original Mandate</div>
                <div style="line-height:1.5;">${clause.original}</div>
              </div>
              <div style="background:#fef2f2; border:1px solid #000; padding:14px; border-radius:4px;">
                <div style="font-size:11px; color:#000; text-transform:uppercase; font-weight:700; margin-bottom:6px;">Acme Proposed Redline (Violation)</div>
                <div style="line-height:1.5; font-weight:500;">${clause.redline}</div>
              </div>
            </div>

            <div style="font-size:13px; color:var(--color-primary); border-left:2px solid var(--color-primary); padding-left:12px; line-height:1.5;">
              <strong>Strategic Recommendation:</strong> ${clause.recommendation}
            </div>
          </div>
        `).join('')}
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-secondary); padding-top:20px;">
        <span style="font-size:13px; color:var(--color-primary-60);">${card.action_prompt}</span>
        <button class="btn-inline-pill" onclick="sendQuery('Alexa, prepare a counter-offer rejecting the 12 million cap')">
          Draft Counter-Offer Now
        </button>
      </div>
    </div>
  `;
}

function renderConfirmationCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="lusion-card" style="border:2px solid var(--color-primary);">
      <div class="card-title-row">
        <div>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--color-primary);">Authorization Mandated</span>
          <h2 class="card-heading" style="margin-top:4px;">${card.title}</h2>
        </div>
        <span class="card-timestamp" style="font-family:var(--font-mono); font-weight:600;">${card.token}</span>
      </div>

      <div style="border:1px solid var(--color-secondary); border-radius:8px; padding:24px; margin-bottom:24px;">
        <div style="font-size:11px; color:var(--color-primary-60); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Target Recipient</div>
        <div style="font-size:14px; font-weight:500; margin-bottom:16px;">${card.recipient}</div>

        <div style="font-size:11px; color:var(--color-primary-60); text-transform:uppercase; font-weight:600; margin-bottom:4px;">Drafted Response</div>
        <div style="font-size:14px; line-height:1.6; white-space:pre-wrap; background:#fafafa; border:1px solid var(--color-secondary); padding:16px; border-radius:4px;">${card.payload}</div>
      </div>

      <div style="display:flex; justify-content:flex-end; gap:16px;">
        <button class="btn-secondary-pill" onclick="sendQuery('Alexa, cancel this action')">Reject Action</button>
        <button class="btn-primary-pill" onclick="openHitlDialogCurrent()">Review & Authorize</button>
      </div>
    </div>
  `;
}

function renderExecutionCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="lusion-card">
      <div class="card-title-row">
        <div>
          <span style="font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; color:var(--color-primary);">Action Finalized</span>
          <h2 class="card-heading" style="margin-top:4px;">${card.title}</h2>
        </div>
        <span class="card-timestamp" style="font-family:var(--font-mono); font-weight:600;">${card.receipt}</span>
      </div>

      <div style="border:1px solid var(--color-primary); border-radius:8px; padding:24px; margin-bottom:24px;">
        <div style="font-size:16px; font-weight:600; margin-bottom:6px;">${card.status}</div>
        <div style="font-size:14px; color:var(--color-primary-60); line-height:1.5;">${card.details}</div>
      </div>

      <button class="btn-inline-pill" onclick="sendQuery('Alexa, give me my morning briefing')">
        ← Return to Briefing Dashboard
      </button>
    </div>
  `;
}

function renderGenericCard(card) {
  multimodalWidgetArea.innerHTML = `
    <div class="lusion-card">
      <h2 class="card-heading" style="margin-bottom:12px;">${card.title}</h2>
      <p style="font-size:15px; color:var(--color-primary-60); margin-bottom:20px; line-height:1.5;">${card.summary || ''}</p>
      ${card.relevant_memories ? `
        <div style="display:flex; flex-direction:column; gap:10px;">
          ${card.relevant_memories.map(m => `
            <div style="border:1px solid var(--color-secondary); border-radius:6px; padding:12px 16px; font-size:13px; line-height:1.5;">
              <strong>${m.entity}:</strong> ${m.memory}
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
      voice_response: `Action authorized and finalized. Your legal counter-offer has been officially dispatched to Sarah Chen and the Acme M&A advisory room.`,
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
}
