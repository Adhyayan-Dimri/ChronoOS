# ChronoOS • Autonomous Executive Chief of Staff
### Built for the *Build, Ship, Shape: Amazon Developer Hackathon (2026)*
**Primary Track:** Alexa+ / Agent Skills • **Layered Track:** AWS Builder Mini-Challenge (Amazon Bedrock)

[![Model Context Protocol](https://img.shields.io/badge/MCP-Streamable_HTTP_(SSE)-00CAFF?style=flat-square)](https://modelcontextprotocol.io)
[![Amazon Bedrock](https://img.shields.io/badge/AWS-Amazon_Bedrock_Orchestrated-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![Claude 3.5 Sonnet / Nova Pro](https://img.shields.io/badge/LLM-Claude_3.5_Sonnet_|_Nova_Pro-6366F1?style=flat-square)](https://aws.amazon.com/bedrock/)
[![Echo Show 15 Multimodal](https://img.shields.io/badge/UX-Echo_Show_15_Multimodal-10B981?style=flat-square)](https://amazonappdev2026.devpost.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg?style=flat-square)](LICENSE)

---

## ⚡ Executive Summary
Executive leaders and enterprise founders make hundreds of high-stakes decisions every week while being inundated by fragmented communications across Slack, email, calendar changes, and legal redlines. Traditional voice assistants are limited to single-turn slot-filling or rigid commands ("Alexa, what's my next meeting?").

**ChronoOS** transforms Alexa+ into an **Autonomous Executive Chief of Staff**. Powered by a self-hosted **Model Context Protocol (MCP)** server, multi-turn **Amazon Bedrock** reasoning (Claude 3.5 Sonnet / Amazon Nova Pro), persistent **episodic memory**, and a multimodal **Echo Show 15 simulator**, ChronoOS proactively triages executive schedules, detects contract disputes, formulates counter-proposals, and secures **Human-in-the-Loop (HITL)** voice confirmation before dispatching corporate commitments.

---

## 🏛️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   Echo Show 15 Multimodal Simulator (Web UI)                     │
│   • Hands-free Voice Input (Web Speech API STT) & Audio Waveform Visualizer      │
│   • Neural Alexa Speech Synthesis (TTS) & Glassmorphic Obsidian Interface        │
│   • Adaptive Visual Cards (Executive Briefing, Contract Redlines, Timelines)     │
│   • Human-in-the-Loop Native Modal (<dialog>) with Cryptographic Tokens          │
│   • Real-Time Thought Inspector (Bedrock Planning, Latency, MCP Tool Telemetry)  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ JSON / WebSocket / HTTP
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                     FastAPI Gateway & Streamable HTTP Server                     │
│                  Endpoints: /api/chat • /api/confirm • /sse • /mcp               │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
┌─────────────────────────────────┐             ┌──────────────────────────────────┐
│  Amazon Bedrock Agentic Engine  │             │   Self-Hosted Alexa+ MCP Server  │
│ • Claude 3.5 Sonnet / Nova Pro  │  Tool Schemas│ • get_executive_briefing         │
│ • Multi-Turn Tool Calling Loop  ├────────────►│ • inspect_document_redlines      │
│ • Episodic Memory Graph (Vector)│◄────────────┤ • search_communications         │
│ • Bedrock Guardrails Policy     │  JSON-RPC   │ • manage_calendar_commitments    │
│   (Financial & Legal Safety)    │             │ • prepare_high_stakes_action     │
│ • Autonomous Zero-Config Engine │             │ • execute_confirmed_action       │
└─────────────────────────────────┘             └──────────────────────────────────┘
```

---

## 🚀 Key Innovations & Competitive Differentiators

### 1. True Multi-Tool Agentic Reasoning (Overcoming the "Tool Wrapper" Flaw)
Most hackathon entrants wrap an API in an MCP tool and invoke it once. ChronoOS implements an autonomous agentic loop: upon hearing *"Alexa, inspect the Acme merger redline from Sarah"*, the Bedrock agent:
1. Dispatches `inspect_document_redlines` targeting the disputed section (Section 9.2).
2. Cross-references `query_episodic_memory` for General Counsel Sarah Chen's historical risk tolerance and board mandates.
3. Evaluates **Bedrock Guardrails** to identify that the proposed $12M cap violates the CEO's $5M authorization threshold.
4. Synthesizes a strategic counter-offer and prepares a reserved 45-minute focus block on the calendar.

### 2. Human-in-the-Loop (HITL) Cryptographic Safety Gates
Autonomous agents must not execute irreversible commitments without explicit authorization. When ChronoOS prepares an action (e.g. sending a legal counter-offer on a $48M merger), it:
* Generates a unique authorization token (`ACT-AUTH-XXXXXX`).
* Renders a native `<dialog>` card with full transparency on the Echo Show screen.
* Requires the executive to speak: *"Alexa, confirm action"* or tap **Approve & Dispatch**.

### 3. Persistent Episodic Memory Graph
ChronoOS maintains a cross-session knowledge graph storing stakeholder communication nuances, travel preferences (e.g., JFK airport travel buffer rules), board risk mandates, and executive work habits.

### 4. Multimodal Echo Show 15 Simulator (25% Design Score Priority)
Rather than a generic chatbot text box, ChronoOS replicates an Amazon Echo Show 15 smart display:
* Dynamic audio visualizer reacting in real-time to speech.
* Dark-mode glassmorphism tailored with Alexa Cyan (`#00CAFF`) and AWS Bedrock Gold (`#FF9900`).
* Live **Thought Inspector** drawer providing judges full visibility into the agent's internal monologue, active Bedrock model, latency (ms), and JSON-RPC payloads.

---

## 🛠️ MCP Tools Specification

The server exposes 7 production-grade tools compliant with the **Model Context Protocol (JSON-RPC 2.0 & Streamable HTTP)**:

| MCP Tool Name | Description | Parameters |
| :--- | :--- | :--- |
| `get_executive_briefing` | Aggregates calendar, critical alerts, and urgent communications for today. | `include_calendar`, `include_urgent_comms`, `urgency_filter` |
| `search_communications` | Semantic search across executive emails, Slack threads, and VIP contacts. | `query`, `sender_filter` |
| `inspect_document_redlines` | Analyzes tracked changes, liability caps, and dispute items in contracts. | `document_id`, `focus_section` |
| `query_episodic_memory` | Queries persistent stakeholder memories, board mandates, and preferences. | `entity_or_topic` |
| `manage_calendar_commitments`| Detects travel conflicts, blocks focus sessions, and reschedules events. | `action`, `time_slot`, `reason` |
| `prepare_high_stakes_action` | Generates authorization token and locks action awaiting human verification. | `action_type`, `target_recipient`, `proposed_payload` |
| `execute_confirmed_action` | Finalizes and dispatches action upon verified voice or tactile approval. | `action_token`, `executive_decision` |

---

## 💻 Quickstart & Local Installation

### Prerequisites
* Python 3.9+ 
* Web browser (Chrome, Edge, or Safari for Web Speech STT/TTS support)
* *(Optional)* AWS credentials with Bedrock access (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_DEFAULT_REGION`). ChronoOS includes a resilient high-fidelity autonomous engine if AWS credentials are not configured, enabling instant zero-config testing.

### 1. Clone & Set Up Virtual Environment
```bash
git clone https://github.com/your-username/ChronoOS.git
cd ChronoOS

python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### 2. Launch ChronoOS Gateway & MCP Server
```bash
python -m uvicorn backend.api_gateway:app --host 127.0.0.1 --port 8000 --reload
```

### 3. Open the Echo Show 15 Simulator
Open your browser and navigate to:
```
http://127.0.0.1:8000/
```

Click the **Microphone Orb** or select one of the suggested voice prompts:
* 🎤 *"Alexa, give me my morning briefing"*
* 🎤 *"Alexa, inspect the Acme merger redline from Sarah"*
* 🎤 *"Alexa, prepare a counter-offer rejecting the 12 million cap"*
* 🎤 *"Alexa, confirm action and dispatch to legal"*
* 🎤 *"Alexa, check for travel buffer conflicts tomorrow"*

---

## 🧪 Testing the MCP Server Directly (JSON-RPC 2.0)

You can interact with the self-hosted MCP server using standard curl commands:

```bash
# List registered MCP tools
curl -X POST http://127.0.0.1:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'

# Execute MCP tool: get_executive_briefing
curl -X POST http://127.0.0.1:8000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_executive_briefing", "arguments": {"urgency_filter": "high"}}}'
```

---

## 📄 Submission Documents
* [AMAZON_PRODUCT_FEEDBACK.md](AMAZON_PRODUCT_FEEDBACK.md) — Mandatory detailed technical feedback for the Amazon Alexa+ and Amazon Bedrock engineering teams.
* [DEMO_SCRIPT.md](DEMO_SCRIPT.md) — 3-Minute walkthrough script for the official Devpost video submission.
* [LICENSE](LICENSE) — Open-source MIT License.
