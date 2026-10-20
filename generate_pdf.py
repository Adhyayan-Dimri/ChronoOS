#!/usr/bin/env python3
"""
ChronoOS: Autonomous Executive Chief of Staff
Comprehensive Project Whitepaper & Hackathon Submission Dossier Generator
Built using ReportLab 5.0+ with Zero Emojis and Executive Styling.
"""

import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas to dynamically compute and print 'Page X of Y' 
    along with running header and footer rules.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, total_pages):
        self.saveState()
        
        # Don't draw running header on cover page (page 1)
        if self._pageNumber > 1:
            # Header
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#0F172A"))
            self.drawString(54, 11 * inch - 36, "CHRONOOS: AUTONOMOUS EXECUTIVE CHIEF OF STAFF")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748B"))
            self.drawRightString(8.5 * inch - 54, 11 * inch - 36, "TECHNICAL DOSSIER & SUBMISSION WHITE PAPER")
            
            self.setStrokeColor(colors.HexColor("#E2E8F0"))
            self.setLineWidth(0.75)
            self.line(54, 11 * inch - 42, 8.5 * inch - 54, 11 * inch - 42)

        # Running Footer (All pages)
        self.setStrokeColor(colors.HexColor("#E2E8F0"))
        self.setLineWidth(0.75)
        self.line(54, 46, 8.5 * inch - 54, 46)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        self.drawString(54, 32, "CONFIDENTIAL & PROPRIETARY  |  AMAZON DEVELOPER HACKATHON 2026")
        
        page_str = f"Page {self._pageNumber} of {total_pages}"
        self.drawRightString(8.5 * inch - 54, 32, page_str)
        
        self.restoreState()


def build_pdf(filename="ChronoOS_Executive_Dossier.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    # Custom Color Palette
    PRIMARY = colors.HexColor("#0F172A")    # Deep Slate / Obsidian
    SECONDARY = colors.HexColor("#334155")  # Charcoal
    MUTED = colors.HexColor("#64748B")      # Slate Gray
    ACCENT_CYAN = colors.HexColor("#0284C7")# Alexa / Bedrock Cyan
    ALERT_RED = colors.HexColor("#DC2626")  # Alert Crimson
    BG_CARD = colors.HexColor("#F8FAFC")    # Cool White Background
    BORDER_CARD = colors.HexColor("#E2E8F0")# Subtle Border

    # Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=26,
        leading=32,
        textColor=PRIMARY,
        spaceAfter=6
    )

    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=ACCENT_CYAN,
        spaceAfter=15
    )

    h1_style = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=15,
        leading=19,
        textColor=PRIMARY,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SubSectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=SECONDARY,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'Body',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        textColor=SECONDARY,
        spaceAfter=6
    )

    body_bold = ParagraphStyle(
        'BodyBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )

    bullet_style = ParagraphStyle(
        'Bullet',
        parent=body_style,
        leftIndent=14,
        firstLineIndent=-10,
        spaceAfter=3
    )

    callout_style = ParagraphStyle(
        'Callout',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13,
        textColor=PRIMARY,
        backColor=BG_CARD,
        borderColor=ACCENT_CYAN,
        borderWidth=1,
        borderPadding=8,
        spaceBefore=6,
        spaceAfter=8
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=colors.white
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=PRIMARY
    )

    table_code_style = ParagraphStyle(
        'TableCode',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10.5,
        textColor=ACCENT_CYAN
    )

    story = []

    # =========================================================================
    # COVER / HEADER BLOCK
    # =========================================================================
    story.append(Paragraph("ChronoOS", title_style))
    story.append(Paragraph("Autonomous Executive Chief of Staff | System Architecture & Submission Dossier", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=1.5, color=PRIMARY, spaceBefore=0, spaceAfter=10))

    meta_table_data = [
        [
            Paragraph("<b>Target Competition:</b> Build, Ship, Shape: Amazon Developer Hackathon (2026)", table_body_style),
            Paragraph("<b>Primary Track:</b> Alexa+ / Agent Skills", table_body_style)
        ],
        [
            Paragraph("<b>Foundation Model Core:</b> Amazon Bedrock (Claude 3.5 Sonnet / Nova Pro)", table_body_style),
            Paragraph("<b>Protocol Standards:</b> Model Context Protocol (MCP 2.0 JSON-RPC / SSE)", table_body_style)
        ],
        [
            Paragraph("<b>Dual Frontend Paradigms:</b> Raycast Command Center + Echo Show 15 Display", table_body_style),
            Paragraph("<b>Repository:</b> github.com/Adhyayan-Dimri/ChronoOS", table_body_style)
        ]
    ]
    meta_table = Table(meta_table_data, colWidths=[270, 234])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), BG_CARD),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('TOPPADDING', (0,0), (-1,-1), 5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 5),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 12))

    # =========================================================================
    # 1. EXECUTIVE SUMMARY & PROBLEM STATEMENT
    # =========================================================================
    story.append(Paragraph("1. Executive Summary & Problem Statement", h1_style))
    story.append(Paragraph(
        "Modern enterprise executives, venture founders, and general counsels face acute cognitive fragmentation. "
        "A typical chief executive balances hundreds of high-stakes decisions every week while being inundated by "
        "disparate information silos: urgent email threads, Slack escalations, calendar shifts, flight delays, and "
        "multi-million-dollar contract redlines. Crucially, critical operational failures rarely occur in isolation; "
        "they compound at the intersections of these streams (e.g., a delayed flight creating an unacceptable buffer "
        "before a critical M&A negotiation while counsel debates an unhedged $12,000,000 liability cap).",
        body_style
    ))
    story.append(Paragraph(
        "Traditional voice assistants and generic chatbots fail in this domain because they are fundamentally "
        "<b>reactive single-turn tools</b>. A standard assistant requires the executive to know exactly what to ask for "
        "(\"Alexa, what is my next meeting?\") and lacks persistent episodic memory, legal policy awareness, and the "
        "ability to autonomously chain multi-step tools across disparate enterprise systems.",
        body_style
    ))
    story.append(Paragraph(
        "<b>ChronoOS transforms Alexa+ into an Autonomous Executive Chief of Staff</b>. Powered by Amazon Bedrock "
        "foundation models, a standardized Model Context Protocol (MCP 2.0) microservice server, episodic memory graphs, "
        "and dual multimodal viewports (Echo Show 15 Smart Display and Raycast Command Architecture), ChronoOS "
        "proactively triages executive commitments, mediates conflicting legal redlines, flags travel collisions, and "
        "secures cryptographic Human-in-the-Loop (HITL) authorization before dispatching corporate actions.",
        body_style
    ))

    # =========================================================================
    # 2. KEY INNOVATIONS: WHY CHRONOOS STANDS OUT
    # =========================================================================
    story.append(Spacer(1, 6))
    story.append(Paragraph("2. Strategic Differentiators: Why ChronoOS Stands Out", h1_style))
    
    diff_items = [
        ("True Multi-Turn Agentic Tool Loops (vs. Naive Wrappers): ",
         "Most AI assistants wrap a single API and return text. ChronoOS implements recursive agentic execution: "
         "upon hearing \"Alexa, inspect the Acme merger redline from Sarah\", ChronoOS autonomously chains 4 tools: "
         "inspect_document_redlines -> query_episodic_memory -> Bedrock Guardrail policy evaluation -> calendar focus block allocation."),
        
        ("Dual Interface Paradigms (Raycast Desktop + Echo Show 15 Display): ",
         "Executives work across multiple form factors. ChronoOS offers an instant toggle between a keyboard-first Raycast "
         "Command Center (Cmd+K) and a dedicated 15.6\" Echo Show 15 Smart Display Simulator featuring physical bezel replication, "
         "far-field mic arrays, privacy camera shutter, ambient glance widgets, and the iconic Alexa Cyan Light Bar."),
        
        ("Cryptographic Human-in-the-Loop (HITL) Gateways: ",
         "Autonomous agents must not bind corporations to legal liabilities without explicit consent. Sensitive actions "
         "generate a unique token (e.g. ACT-AUTH-7F89B2) and require dual-channel approval (verbal \"Alexa, confirm action\" "
         "or physical approval modal) before any payload is dispatched."),
        
        ("Always-on-Top Document Picture-in-Picture (PiP) Micro-Assistant: ",
         "Utilizing the W3C Document Picture-in-Picture API (Cmd+P), ChronoOS floats a persistent, compact executive HUD "
         "above all desktop applications (IDEs, spreadsheets, video conferences) with bidirectional speech input and output."),
        
        ("Strict Multi-Tenant Workspace Isolation: ",
         "ChronoOS opens in a verified Signed-Out Gateway. Users can log into an isolated private workspace (zero dummy clutter) "
         "or launch an isolated evaluation sandbox preloaded with the Alex Mercer (CEO) Acme M&A scenario.")
    ]
    for bold_prefix, text in diff_items:
        story.append(Paragraph(f"<b>* {bold_prefix}</b>{text}", bullet_style))

    story.append(PageBreak())

    # =========================================================================
    # 3. COMPLETE TECHNOLOGY STACK
    # =========================================================================
    story.append(Paragraph("3. Technology Stack & Architectural Specifications", h1_style))
    
    tech_data = [
        [Paragraph("Layer", table_header_style), Paragraph("Component", table_header_style), Paragraph("Technical Role & Rationale", table_header_style)],
        [
            Paragraph("AI / Reasoning Core", table_code_style),
            Paragraph("Amazon Bedrock<br/>(Claude 3.5 Sonnet / Nova Pro)", table_body_style),
            Paragraph("Multi-turn reasoning, schema tool-use parsing, policy guardrail verification, and episodic synthesis.", table_body_style)
        ],
        [
            Paragraph("Tool Protocol Layer", table_code_style),
            Paragraph("Model Context Protocol<br/>(MCP 2.0 / JSON-RPC 2.0)", table_body_style),
            Paragraph("Standardized tool abstraction layer communicating over streamable HTTP Server-Sent Events (SSE) and JSON-RPC 2.0.", table_body_style)
        ],
        [
            Paragraph("Backend API Gateway", table_code_style),
            Paragraph("Python 3.10+, FastAPI, Uvicorn", table_body_style),
            Paragraph("High-concurrency ASGI gateway handling /api/chat, /api/auth, /api/confirm, and real-time telemetry streaming.", table_body_style)
        ],
        [
            Paragraph("Memory & State Graph", table_code_style),
            Paragraph("Episodic Memory Store", table_body_style),
            Paragraph("In-memory vector store mapping historical risk boundaries, board mandates, and VIP communications.", table_body_style)
        ],
        [
            Paragraph("Creative Frontend", table_code_style),
            Paragraph("HTML5, Vanilla ES2022+ JS", table_body_style),
            Paragraph("Zero-dependency custom design system; eliminating heavy framework overhead to achieve sub-millisecond DOM responsiveness.", table_body_style)
        ],
        [
            Paragraph("Procedural Visualizer", table_code_style),
            Paragraph("Hardware-Accelerated HTML5 Canvas", table_body_style),
            Paragraph("60FPS procedural cybernetic cinema engine with 4K Retina High-DPI scaling (window.devicePixelRatio).", table_body_style)
        ],
        [
            Paragraph("Bidirectional Speech", table_code_style),
            Paragraph("Web Speech API & Web Audio", table_body_style),
            Paragraph("Hands-free speech recognition (STT) and natural speech synthesis (TTS) with V8 GC preservation and audio unlock.", table_body_style)
        ],
        [
            Paragraph("Desktop Extension", table_code_style),
            Paragraph("W3C Document Picture-in-Picture", table_body_style),
            Paragraph("Always-on-top desktop micro-assistant HUD accessible globally across macOS/Windows workspaces (Cmd+P).", table_body_style)
        ]
    ]
    tech_table = Table(tech_data, colWidths=[110, 140, 254])
    tech_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(tech_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # 4. MODEL CONTEXT PROTOCOL (MCP 2.0) TOOL SPECIFICATION
    # =========================================================================
    story.append(Paragraph("4. Model Context Protocol (MCP 2.0) Tools Specification", h1_style))
    story.append(Paragraph(
        "ChronoOS hosts a fully compliant MCP 2.0 server delivering 7 production-grade tools. "
        "Each tool provides a formal JSON schema defining strict parameter typing and validation rules:",
        body_style
    ))

    mcp_data = [
        [Paragraph("Tool Identifier", table_header_style), Paragraph("Input Parameters", table_header_style), Paragraph("Functional Behavior & Security Constraints", table_header_style)],
        [
            Paragraph("get_executive_briefing", table_code_style),
            Paragraph("include_calendar (bool)<br/>include_urgent (bool)<br/>urgency_filter (str)", table_body_style),
            Paragraph("Aggregates daily commitments, pending legal disputes, and travel statuses into a structured daily dossier.", table_body_style)
        ],
        [
            Paragraph("search_communications", table_code_style),
            Paragraph("query (str)<br/>sender_filter (str)", table_body_style),
            Paragraph("Semantic vector retrieval across executive email threads, internal Slack memos, and VIP correspondence.", table_body_style)
        ],
        [
            Paragraph("inspect_document_redlines", table_code_style),
            Paragraph("document_id (str)<br/>focus_section (str)", table_body_style),
            Paragraph("Parses tracked legal revisions in acquisition contracts; compares indemnification and liability terms against CEO mandates.", table_body_style)
        ],
        [
            Paragraph("query_episodic_memory", table_code_style),
            Paragraph("entity_or_topic (str)", table_body_style),
            Paragraph("Retrieves long-term episodic memory, including board risk thresholds, counter-party negotiation habits, and transit preferences.", table_body_style)
        ],
        [
            Paragraph("manage_calendar_commitments", table_code_style),
            Paragraph("action (str)<br/>time_slot (str)<br/>reason (str)", table_body_style),
            Paragraph("Evaluates flight arrival buffers, detects collision risks, reschedules lower-priority meetings, and reserves focus blocks.", table_body_style)
        ],
        [
            Paragraph("prepare_high_stakes_action", table_code_style),
            Paragraph("action_type (str)<br/>target_recipient (str)<br/>proposed_payload (str)", table_body_style),
            Paragraph("Stages irreversible commitments; mints cryptographic token (ACT-AUTH-XXXXXX) and locks action pending human verification.", table_body_style)
        ],
        [
            Paragraph("execute_confirmed_action", table_code_style),
            Paragraph("action_token (str)<br/>executive_decision (str)", table_body_style),
            Paragraph("Finalizes and dispatches authorized corporate commitments upon verified voice or tactile approval.", table_body_style)
        ]
    ]
    mcp_table = Table(mcp_data, colWidths=[130, 130, 244])
    mcp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(mcp_table)

    story.append(PageBreak())

    # =========================================================================
    # 5. ECHO SHOW 15 MULTIMODAL SMART DISPLAY SIMULATOR
    # =========================================================================
    story.append(Paragraph("5. Echo Show 15 Multimodal Smart Display Architecture", h1_style))
    story.append(Paragraph(
        "To fulfill the core requirements of the Amazon Developer Hackathon's Alexa+ / Agent Skills track, "
        "ChronoOS integrates an authentic <b>Echo Show 15 Smart Display Simulator</b>. Rather than relying on simple "
        "browser text inputs, ChronoOS replicates the hardware constraints and multimodal presentation standards "
        "of Amazon's flagship 15.6\" wall-mounted smart display:",
        body_style
    ))

    echo_features = [
        ("Physical Bezel Hardware Replication: ",
         "Engineered with realistic dark anodized aluminum bezels, dual far-field microphone array pinholes, "
         "front-facing camera housing with active privacy shutter switch, and subtle Amazon brand markings."),
        
        ("Iconic Alexa Cyan Light Bar (#00CAFF): ",
         "Features an active light bar across the bottom bezel that illuminates and sweeps during bidirectional "
         "speech recognition and neural voice synthesis, providing instant acoustic and visual feedback."),
        
        ("Dual-Column Alexa Presentation Language (APL) Grid: ",
         "The smart display layout divides into an Ambient Glance Hub (left) and an Active Multimodal Viewport (right): "
         "glance tiles display the live countdown to the next executive commitment, weather conditions, and travel alerts, "
         "while the right column renders high-contrast, touch-optimized visual cards."),
        
        ("Bidirectional Speech & State Synchronization: ",
         "The Echo Show 15 mode is fully interactive: touching any suggestion capsule or speaking to Alexa triggers "
         "Bedrock reasoning. Changes made in Echo Show mode synchronize instantly with the desktop Raycast Command Center."),
        
        ("Instant Viewport Toggle (Cmd+E): ",
         "Judges and executives can transition seamlessly between the Raycast Desktop Command Deck and the Echo Show 15 "
         "Smart Display with a single hotkey (Cmd+E) or top-bar button.")
    ]
    for title, desc in echo_features:
        story.append(Paragraph(f"<b>* {title}</b>{desc}", bullet_style))

    story.append(Spacer(1, 8))

    # =========================================================================
    # 6. FLAGSHIP SCENARIOS & REASONING WALKTHROUGHS
    # =========================================================================
    story.append(Paragraph("6. Flagship Demonstration Scenarios", h1_style))

    scenarios = [
        ("Scenario A: Acme M&A Contract Redline Mediation ($48M Transaction)",
         "General Counsel Sarah Chen forwards Revision 4 of the merger agreement. Counter-counsel at Acme Corp "
         "discreetly struck Section 9.2, elevating the indemnification liability cap from $5.5M to $12.0M. "
         "ChronoOS inspects the diff, queries episodic memory for board mandates, detects the violation, and "
         "synthesizes a strategic counter-offer refusing the cap increase while offering reciprocal IP protections."),
        
        ("Scenario B: United Airlines Flight UA 482 Delay & Calendar Collision",
         "Flight UA 482 (SFO to JFK) incurs a 45-minute delay. ChronoOS intercepts the transponder telemetry, "
         "evaluates Manhattan airport transit times, and identifies that the CEO will miss the 11:00 AM Strategy Review. "
         "ChronoOS autonomously shifts the review by 30 minutes, alerts attendees, and secures a 25-minute buffer."),
        
        ("Scenario C: Cryptographic Human-in-the-Loop (HITL) Gate",
         "When the CEO instructs ChronoOS to dispatch the M&A counter-offer, Amazon Bedrock Guardrails lock the action. "
         "A native <dialog> sheet displays token ACT-AUTH-7F89B2 with the exact draft body. The action executes only "
         "upon verified verbal confirmation (\"Alexa, confirm action\") or authenticated tactile sign-off."),
        
        ("Scenario D: Client-Side External Application Dispatch (YouTube & Tools)",
         "ChronoOS supports direct tool launch hooks (e.g. \"Open YouTube\"). When asynchronous voice recognition callbacks "
         "encounter browser popup blocker restrictions, ChronoOS speaks an immediate advisory and renders a high-visibility, "
         "direct-action button in the execution receipt card to ensure immediate single-click access.")
    ]
    for title, text in scenarios:
        story.append(Paragraph(f"<b>{title}</b>", h2_style))
        story.append(Paragraph(text, body_style))

    story.append(PageBreak())

    # =========================================================================
    # 7. HACKATHON SUBMISSION CHECKLIST & JUDGING ALIGNMENT
    # =========================================================================
    story.append(Paragraph("7. Hackathon Submission Criteria & Judging Alignment", h1_style))
    
    crit_data = [
        [Paragraph("Judging Criteria", table_header_style), Paragraph("ChronoOS Architectural Implementation", table_header_style), Paragraph("Status", table_header_style)],
        [
            Paragraph("Agentic Reasoning & Tool Orchestration (30%)", table_code_style),
            Paragraph("Chains recursive multi-turn Bedrock tool calls (inspect redlines -> query memory -> calendar adjustment -> HITL authorization) rather than simple single-turn API wrapping.", table_body_style),
            Paragraph("EXCEEDS", table_code_style)
        ],
        [
            Paragraph("Multimodal UX & Voice Design (25%)", table_code_style),
            Paragraph("Features complete Echo Show 15 Smart Display simulation with cyan lightbar, audio waveforms, hands-free voice, and synchronized visual cards.", table_body_style),
            Paragraph("EXCEEDS", table_code_style)
        ],
        [
            Paragraph("Safety, Guardrails & Privacy (20%)", table_code_style),
            Paragraph("Bedrock Guardrail liability boundaries, cryptographic HITL tokens, and multi-tenant workspace isolation with signed-out landing defaults.", table_body_style),
            Paragraph("EXCEEDS", table_code_style)
        ],
        [
            Paragraph("Code Quality & Architecture (15%)", table_code_style),
            Paragraph("Standardized Model Context Protocol (MCP 2.0), clean FastAPI ASGI backend, and zero-dependency lightweight ES2022+ frontend engine.", table_body_style),
            Paragraph("EXCEEDS", table_code_style)
        ],
        [
            Paragraph("Completeness & Documentation (10%)", table_code_style),
            Paragraph("Production-ready codebase, public GitHub repository, automated test suites, whitepaper dossier, and Amazon developer feedback reports.", table_body_style),
            Paragraph("EXCEEDS", table_code_style)
        ]
    ]
    crit_table = Table(crit_data, colWidths=[120, 314, 70])
    crit_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), PRIMARY),
        ('BOX', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('INNERGRID', (0,0), (-1,-1), 0.5, BORDER_CARD),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 6),
        ('RIGHTPADDING', (0,0), (-1,-1), 6),
    ]))
    story.append(crit_table)
    story.append(Spacer(1, 10))

    # =========================================================================
    # 8. FUTURE ROADMAP & STRATEGIC EXPANSIONS
    # =========================================================================
    story.append(Paragraph("8. Strategic Roadmap & Future Additions", h1_style))
    roadmap_items = [
        ("Enterprise ERP & CRM Connectors: ", "Direct read/write integrations with Salesforce, SAP S/4HANA, Workday, and Microsoft 365 Graph via dedicated MCP tool adapters."),
        ("Multi-Agent Swarm Delegation: ", "Spawning specialized subagents (Legal Counsel Agent, Flight Route Logistics Agent, Financial Controller Agent) that negotiate asynchronously before reporting to the Chief of Staff."),
        ("Wearable Audio & Smart Glasses Companion HUD: ", "Low-latency streaming over Bluetooth LE to smart glasses and earbuds, delivering whispering executive briefs in transit."),
        ("On-Premise Private VPC Bedrock Deployments: ", "Provisioning dedicated AWS PrivateLink VPC endpoints for sovereign defense and healthcare compliance.")
    ]
    for r_title, r_desc in roadmap_items:
        story.append(Paragraph(f"<b>* {r_title}</b>{r_desc}", bullet_style))

    story.append(Spacer(1, 12))

    # Callout Summary Box
    summary_html = (
        "<b>Summary & Verification Notice:</b><br/>"
        "ChronoOS represents a production-grade blueprint for autonomous executive operations. "
        "The system runs locally on port 8000 with complete offline simulation support. "
        "All code, documentation, and assets are version-controlled and publicly accessible at "
        "<b>https://github.com/Adhyayan-Dimri/ChronoOS</b>."
    )
    story.append(Paragraph(summary_html, callout_style))

    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Generated PDF successfully: {filename}")

if __name__ == "__main__":
    out_path = "/Users/adhyayan_dimri/.gemini/antigravity-ide/scratch/ChronoOS/ChronoOS_Executive_Dossier.pdf"
    build_pdf(out_path)
