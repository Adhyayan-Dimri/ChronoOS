# Chronos+ • 3-Minute Demo Video Walkthrough Script
**For Devpost Video Submission** (YouTube / Vimeo embed)  
**Total Target Duration:** 2 minutes 45 seconds  

---

### Segment 1: The Problem & The Vision (0:00 - 0:35)
* **Visual on Screen:** Host on camera (or voiceover over title card), then cut to the **Chronos+ Echo Show 15 Simulator** running at `http://localhost:8000`.
* **Audio Voiceover:**
  > *"Every executive and founder faces the same daily struggle: cognitive overload. Between endless Slack messages, conflicting calendar revisions, and urgent legal redlines, traditional voice assistants fall flat. They can answer trivial trivia or turn off a light, but they cannot reason, plan, or take high-stakes corporate actions.*
  > 
  > *This is Chronos+: an Autonomous Executive Chief of Staff built for Alexa+ and powered by Amazon Bedrock and a self-hosted Model Context Protocol (MCP) server. Let's see it in action."*

---

### Segment 2: Multimodal Morning Briefing (0:35 - 1:15)
* **Visual on Screen:** Click the glowing **Microphone Orb** or click the first prompt chip: `🎤 "Give me my morning briefing"`.
* **Action:**
  * Voice waveform animates.
  * Alexa speaks back with neural voice: *"Good morning, Alex. You have four key meetings today, but two urgent alerts demand your attention before 2:00 PM..."*
  * Camera pans to the **Executive Intelligence Briefing** card displaying metrics ($64.2M ARR, 29.4 mo runway) and the two urgent alerts.
  * Point out the **Real-Time Thought Inspector** drawer on the right showing the `get_executive_briefing` MCP tool execution, roundtrip latency (184ms), and Bedrock model telemetry.
* **Audio Voiceover:**
  > *"Notice how Chronos+ doesn't just read a list. It synthesizes executive priorities, flagging that our General Counsel Sarah Chen sent an urgent redline on our $48M Acme acquisition, and that a flight delay will cause a keynote buffer violation tomorrow."*

---

### Segment 3: Deep Dive into Legal Redlines & Guardrails (1:15 - 1:55)
* **Visual on Screen:** Click `🎤 "Inspect Acme merger redline"`.
* **Action:**
  * Chronos+ analyzes the contract and responds: *"I inspected Section 9.2 of the Acme Merger Agreement. Acme's counsel is attempting to expand our aggregate liability from $5M to $12M, which violates your board mandate..."*
  * The Echo Show screen switches to the **Legal Risk Assessment** view showing side-by-side redline diffs (Original $5M Cap vs. Acme Proposed $12M Redline).
  * Show the Thought Inspector highlighting **Bedrock Guardrail Triggered**: *M&A_Governance_Policy_v2.4 - Prohibited Liability Expansion*.
* **Audio Voiceover:**
  > *"Behind the scenes, the Bedrock agent called `inspect_document_redlines` on our MCP server and queried our episodic memory graph to verify our board mandate. It caught that Acme attempted to slip in a 140% liability increase, and immediately formulated a counter-proposal."*

---

### Segment 4: Human-in-the-Loop Confirmation & Execution (1:55 - 2:35)
* **Visual on Screen:** Click `🎤 "Prepare counter-offer"`.
* **Action:**
  * Chronos+ drafts the legal response and states: *"I have drafted the counter-offer to General Counsel Sarah Chen... Because this is a high-stakes corporate commitment, I have placed an approval card on your Echo Show screen."*
  * The native **Human-in-the-Loop Dialog** opens with glassmorphic backdrop blur, showing the Action Token, the draft message, and the authorization prompt.
  * Click **Approve & Dispatch via Bedrock** (or say *"Alexa, confirm action"*).
  * The modal closes, and the **Action Executed** receipt card flashes green with cryptographic verification receipt `RCPT-SECURE`.
* **Audio Voiceover:**
  > *"Here is the critical differentiator: autonomous systems cannot be reckless. Through Amazon Bedrock Guardrails and our MCP `prepare_high_stakes_action` tool, Chronos+ pauses for human authorization. Once approved, the counter-offer is officially dispatched to legal."*

---

### Segment 5: Conclusion & Architecture Wrap-Up (2:35 - 2:45)
* **Visual on Screen:** Show the GitHub repository, MCP Streamable HTTP specification, and Amazon Product Feedback file.
* **Audio Voiceover:**
  > *"With Chronos+, we've proven how Alexa+ and Amazon Bedrock can transform personal AI into an indispensable executive partner. Full code, MCP server specs, and engineering feedback are open source on GitHub. Thank you!"*
