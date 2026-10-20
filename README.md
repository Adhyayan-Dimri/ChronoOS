# ChronoOS: Autonomous Executive Chief of Staff

[![Model Context Protocol](https://img.shields.io/badge/MCP-Streamable_HTTP_(SSE)-00CAFF?style=flat-square)](https://modelcontextprotocol.io)
[![Amazon Bedrock](https://img.shields.io/badge/AWS-Amazon_Bedrock_Orchestrated-FF9900?style=flat-square&logo=amazon-aws)](https://aws.amazon.com/bedrock/)
[![Claude 3.5 Sonnet / Nova Pro](https://img.shields.io/badge/LLM-Claude_3.5_Sonnet_|_Nova_Pro-6366F1?style=flat-square)](https://aws.amazon.com/bedrock/)
[![Architecture](https://img.shields.io/badge/UX-Raycast_Command_Architecture-10B981?style=flat-square)](https://raycast.com)


ChronoOS is an autonomous agentic operating system designed for executive triage, strategic risk mediation, and continuous operational awareness. Built on Amazon Bedrock foundation models (Claude 3.5 Sonnet and Amazon Nova Pro) and connected via the Model Context Protocol (MCP 2.0), ChronoOS autonomously reconciles conflicting legal redlines, flags flight buffer collisions, coordinates multi-tenant executive memory, and secures Human-in-the-Loop (HITL) authorization before dispatching high-liability actions.

---

## Executive Summary

Senior leadership and enterprise founders make critical, compounding decisions daily while navigating fragmented inputs across communication channels, meeting shifts, calendar collisions, and legal revisions. Conventional voice interfaces and conversational chatbots are fundamentally reactive, constrained to single-turn queries or basic retrieval.

ChronoOS shifts the paradigm from passive assistant to an autonomous Executive Chief of Staff:
- Proactive Triage: Evaluates incoming intelligence streams without prompting, identifying operational risks before they impact deliverables.
- Multi-Tool Reasoning: Orchestrates complex agent loops across document analysis, calendar reconciliation, and episodic memory graphs.
- Human-in-the-Loop Verification: Intercepts high-stakes actions using cryptographic tokens, ensuring corporate commitments require explicit executive sign-off.
- Multi-Tenant Privacy Isolation: Delivers an unpolluted private workspace for authorized enterprise users alongside an isolated evaluation sandbox.

---

## System Architecture

```
+----------------------------------------------------------------------------------+
|                     ChronoOS Creative Technology Client                          |
|   - Master Command Deck: Keyboard-first command bar (Cmd+K) & voice trigger      |
|   - Bidirectional Speech Engine: Web Speech API with GC & popup blocker bypass   |
|   - 60FPS Cybernetic Cinema: Native Canvas procedural visualizer (Retina 4K)     |
|   - Document Picture-in-Picture: Always-on-top desktop micro-assistant (Cmd+P)   |
|   - Live Thought Inspector: Bedrock planning telemetry, latency, & JSON-RPC logs |
+----------------------------------------+-----------------------------------------+
                                         | JSON / REST / Streamable HTTP (SSE)
+----------------------------------------v-----------------------------------------+
|                  FastAPI Orchestrator & MCP Gateway Server                       |
|          Endpoints: /api/chat | /api/confirm | /api/auth | /sse | /mcp           |
+----------------------------------------+-----------------------------------------+
                                         |
                 +-----------------------+-----------------------+
                 |                                               |
+----------------v-----------------+             +---------------v-----------------+
|  Amazon Bedrock Agentic Engine   |             |   Self-Hosted MCP 2.0 Server    |
| - Claude 3.5 Sonnet / Nova Pro   | Tool Schema | - get_executive_briefing        |
| - Multi-Turn Tool Dispatch Loop  +------------>| - inspect_document_redlines     |
| - Episodic Memory Graph (Vector) |<------------+ - search_communications         |
| - Bedrock Guardrails Policy      |  JSON-RPC   | - manage_calendar_commitments   |
| - Zero-Config Autonomous Engine  |             | - prepare_high_stakes_action    |
|                                  |             | - execute_confirmed_action      |
+----------------------------------+             +---------------------------------+
```

---

## Core Capabilities

### 1. Amazon Bedrock Multi-Turn Tool Orchestration
Unlike standard LLM implementations that merely wrap an API endpoint, ChronoOS executes recursive multi-turn reasoning loops. When presented with an inquiry such as *"Alexa, inspect the Acme merger redline from Sarah"*:
1. Tool Invocation: Dispatches `inspect_document_redlines` targeting Section 9.2 (Indemnification Liability).
2. Memory Cross-Reference: Queries `query_episodic_memory` for General Counsel Sarah Chen's historical risk profile and board-approved liability boundaries.
3. Guardrail Enforcement: Flags that Acme's proposed increase to $12,000,000 violates the CEO's authorized cap of $5,500,000.
4. Strategic Counter-Proposal: Formulates a structured compromise, schedules a strategic preparation block, and holds execution pending verification.

### 2. Model Context Protocol (MCP 2.0) Architecture
All enterprise integrations are decoupled into modular, discoverable MCP tool microservices communicating over JSON-RPC 2.0 and Server-Sent Events (SSE). This standardized architecture allows plug-and-play expansion into corporate data sources including ERPs, CRMs, contract management systems, and flight tracking APIs.

### 3. Cryptographic Human-in-the-Loop (HITL) Gateways
For sensitive corporate actions—such as dispatching legal positions or authorizing capital allocations—ChronoOS enforces strict safety boundaries:
- Token Generation: Binds each pending action to an immutable, cryptographically generated token (e.g., `ACT-AUTH-7F89B2`).
- Native Sheet Presentation: Displays transparent disclosures using HTML5 `<dialog>` sheets.
- Dual Verification: Accepts voice authorization (*"Alexa, confirm action"*) or physical click authorization with full telemetry logging.

### 4. Always-on-Top Floating Desktop Assistant (Picture-in-Picture)
ChronoOS utilizes the modern W3C Document Picture-in-Picture API (`window.documentPictureInPicture`) alongside an external window fallback. Users can press `Cmd+P` or click `Float PiP` to decouple a compact, high-contrast micro-assistant that floats persistently above IDEs, spreadsheets, or browser windows with live voice input and speech synthesis.

### 5. Multi-Tenant Workspace Isolation
ChronoOS starts in a **Signed Out** gateway state:
- Guest Gateway: New visitors choose between Signing In, Creating a Clean Private Workspace, or entering the Demo Sandbox.
- Clean Slate Guarantee: Authenticated users operate in a pristine environment with zero dummy data or test clutter.
- Evaluation Sandbox: A dedicated testing environment pre-loaded with Alex Mercer's executive scenario (Acme M&A redlines, flight UA 482 airport delays, and Bedrock guardrail intercepts).

---

## Model Context Protocol (MCP) Tool Specification

ChronoOS exposes 7 production-grade MCP tools compliant with JSON-RPC 2.0:

| Tool Name | Scope & Description | Key Input Parameters |
| :--- | :--- | :--- |
| `get_executive_briefing` | Aggregates daily calendar schedule, critical alerts, and prioritized communications. | `include_calendar`, `include_urgent_comms`, `urgency_filter` |
| `search_communications` | Executes semantic vector retrieval across executive email threads, Slack streams, and memos. | `query`, `sender_filter` |
| `inspect_document_redlines` | Analyzes tracked changes, indemnification ceilings, and dispute points in legal contracts. | `document_id`, `focus_section` |
| `query_episodic_memory` | Queries long-term episodic memory for board mandates, partner history, and personal preferences. | `entity_or_topic` |
| `manage_calendar_commitments` | Analyzes airport transit buffers, reschedules overlapping events, and secures focus blocks. | `action`, `time_slot`, `reason` |
| `prepare_high_stakes_action` | Generates a cryptographic authorization token and stages high-liability operations. | `action_type`, `target_recipient`, `proposed_payload` |
| `execute_confirmed_action` | Dispatches authenticated commitments following explicit Human-in-the-Loop authorization. | `action_token`, `executive_decision` |

---

## Technical Stack

- **Backend Framework:** Python 3.10+, FastAPI, Uvicorn (ASGI)
- **AI & Reasoning Core:** Amazon Bedrock (Anthropic Claude 3.5 Sonnet / Amazon Nova Pro), Boto3 SDK
- **Protocol Standards:** Model Context Protocol (MCP 2.0), JSON-RPC 2.0, Server-Sent Events (SSE)
- **Frontend Architecture:** Vanilla JavaScript (ES2022+), Semantic HTML5, Custom CSS Design System
- **Rendering & Visuals:** HTML5 Canvas (Hardware-accelerated 60FPS procedural animation, Retina High-DPI scaling)
- **Audio & Voice:** Web Speech API (SpeechRecognition & SpeechSynthesis with garbage collection preservation and popup blocker circumvention), Web Audio API

---

## Installation & Local Setup

### Prerequisites
- Python 3.9 or higher
- Modern Chromium, Safari, or Firefox browser
- Optional: AWS Account with Amazon Bedrock model access enabled (`anthropic.claude-3-5-sonnet` or `amazon.nova-pro`)

### 1. Clone the Repository
```bash
git clone https://github.com/Adhyayan-Dimri/ChronoOS.git
cd ChronoOS
```

### 2. Configure Python Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment Variables (Optional)
If connecting to live AWS Bedrock foundation models:
```bash
cp .env.example .env
# Edit .env with your AWS credentials:
# AWS_ACCESS_KEY_ID=your_access_key
# AWS_SECRET_ACCESS_KEY=your_secret_key
# AWS_DEFAULT_REGION=us-east-1
# BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20240620-v1:0
```
*Note: If AWS credentials are not supplied, ChronoOS activates its built-in high-fidelity autonomous simulation engine, permitting complete offline testing and demonstration.*

### 4. Launch the Server
```bash
uvicorn backend.api_gateway:app --host 127.0.0.1 --port 8000 --reload
```
Open your browser and navigate to `http://127.0.0.1:8000/`.

---

## Keyboard Shortcuts & Navigation

| Key Combination | Action Description |
| :--- | :--- |
| `Cmd + K` / `Ctrl + K` | Focus Master Command Bar |
| `Cmd + P` / `Ctrl + P` | Toggle Always-on-Top Document Picture-in-Picture Floating Assistant |
| `Cmd + I` / `Ctrl + I` | Toggle Bedrock Thought & MCP Telemetry Inspector Drawer |
| `Cmd + Z` / `Ctrl + Z` | Toggle Zen Spotlight Mode vs Full Scroll-Driven Dossier |
| `Enter` | Execute typed or voice-transcribed prompt |
| `1` through `5` | Trigger rapid scenario capsules (Briefing, Redlines, Counter-Offer, etc.) |

---

## Project Structure

```
ChronoOS/
├── backend/
│   ├── __init__.py
│   ├── api_gateway.py        # FastAPI routes, auth endpoints, chat dispatch
│   ├── bedrock_orchestrator.py # Amazon Bedrock multi-turn tool calling loop
│   ├── mcp_server.py         # MCP 2.0 tool implementations & JSON-RPC router
│   ├── memory_graph.py       # Episodic memory store and vector retrieval
│   └── mock_data.py          # Preloaded Acme M&A contracts, flight UA 482 streams
├── frontend/
│   ├── app.js                # Master interactive engine, speech synthesis, PiP
│   ├── index.html            # Semantic HTML5 layout, Raycast command deck
│   └── style.css             # Obsidian glassmorphic design system
├── requirements.txt          # Python dependencies (fastapi, uvicorn, boto3, pydantic)
├── DEMO_SCRIPT.md            # Step-by-step judge demonstration walkthrough
├── AMAZON_PRODUCT_FEEDBACK.md# Strategic developer feedback for Amazon Bedrock & Alexa teams
└── README.md                 # Complete system documentation
```

---

## Testing & Verification

Execute the test suite to validate API routing, MCP tool contracts, and Bedrock orchestrator fallbacks:

```bash
# Run unit tests
pytest tests/ -v

# Run FastAPI gateway integration check
curl -s http://127.0.0.1:8000/api/health
```

---

