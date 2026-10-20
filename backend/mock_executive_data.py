"""
ChronoOS Executive Intelligence Store
Contains realistic enterprise executive context:
- VIP stakeholders & communication threads
- High-stakes contracts & redlines
- Calendar commitments & conflicts
- Long-term episodic memory graph & executive constraints
"""

from typing import Dict, Any, List
from datetime import datetime, date

EXECUTIVE_PROFILE = {
    "name": "Alex Mercer",
    "title": "Chief Executive Officer",
    "organization": "Aether Dynamics Inc.",
    "timezone": "America/Los_Angeles",
    "preferences": {
        "work_hours_start": "08:30",
        "work_hours_end": "18:30",
        "buffer_between_meetings_minutes": 15,
        "max_focus_time_blocks_daily": 2,
        "contract_liability_threshold_usd": 5000000,
        "preferred_communication_tone": "decisive, concise, executive-level"
    }
}

EPISODIC_MEMORY_GRAPH: List[Dict[str, Any]] = [
    {
        "id": "mem_001",
        "category": "stakeholder_policy",
        "entity": "Sarah Chen (General Counsel)",
        "memory": "Sarah requires explicit sign-off before modifying any indemnification or intellectual property clauses. She prefers brief executive summaries with specific risk tiers (Low, Medium, Critical).",
        "last_updated": "2026-10-14"
    },
    {
        "id": "mem_002",
        "category": "board_governance",
        "entity": "Elena Rostova (Lead Board Director)",
        "memory": "Elena expects Q3 Board slides to highlight ARR growth and runway. She dislikes unexpected schedule revisions; any agenda changes must be notified at least 24 hours prior.",
        "last_updated": "2026-10-18"
    },
    {
        "id": "mem_003",
        "category": "executive_habit",
        "entity": "Alex Mercer",
        "memory": "Alex strictly guards afternoon blocks on Wednesdays for deep strategic thinking. When traveling to New York (JFK), Alex prefers booking the Carlyle or Beekman and requires a 45-minute airport buffer.",
        "last_updated": "2026-10-19"
    },
    {
        "id": "mem_004",
        "category": "m_and_a_strategy",
        "entity": "Project Apex (Acme Corp Acquisition)",
        "memory": "The board approved a maximum enterprise valuation cap of $48M. Any escrow holdback over 12% is a dealbreaker. Target closing date is November 15, 2026.",
        "last_updated": "2026-10-12"
    }
]

CALENDAR_SCHEDULE: List[Dict[str, Any]] = [
    {
        "id": "cal_01",
        "title": "Executive Leadership Daily Standup",
        "start": "09:00",
        "end": "09:30",
        "attendees": ["Alex Mercer", "David Ross (CFO)", "Maya Patel (CTO)", "Sarah Chen (GC)"],
        "location": "Boardroom Alpha & Zoom",
        "status": "confirmed",
        "priority": "medium"
    },
    {
        "id": "cal_02",
        "title": "Q3 Board Deck Final Review",
        "start": "11:00",
        "end": "12:15",
        "attendees": ["Alex Mercer", "David Ross (CFO)", "Elena Rostova (Board)"],
        "location": "Zoom Room 4",
        "status": "confirmed",
        "priority": "high"
    },
    {
        "id": "cal_03",
        "title": "Project Apex: M&A Due Diligence & Legal Redlines",
        "start": "14:00",
        "end": "15:00",
        "attendees": ["Alex Mercer", "Sarah Chen (GC)", "Acme Corp Legal Advisory"],
        "location": "Conf Call - Secure Bridge 09",
        "status": "critical",
        "priority": "critical",
        "notes": "Decision needed on indemnification liability cap and non-compete clauses."
    },
    {
        "id": "cal_04",
        "title": "Global Partner Ecosystem Keynote Rehearsal",
        "start": "16:30",
        "end": "17:30",
        "attendees": ["Alex Mercer", "Communications Team"],
        "location": "Main Stage Studio",
        "status": "confirmed",
        "priority": "medium"
    }
]

COMMUNICATIONS_FEED: List[Dict[str, Any]] = [
    {
        "id": "comm_101",
        "sender": "Sarah Chen <sarah.chen@aetherdynamics.com>",
        "sender_name": "Sarah Chen",
        "sender_role": "General Counsel",
        "channel": "email",
        "subject": "URGENT: Acme Corp Merger Redline - Liability & IP Shift",
        "timestamp": "2026-10-21T07:42:00",
        "snippet": "Acme counter-counsel just sent over Revision 4. They quietly modified Section 9.2 (Indemnification Cap) from $5M to $12M and adjusted Section 12 (IP carve-outs). We have our call at 2 PM. I need your decision on whether to reject outright or counter-offer at $6M.",
        "urgency": "critical",
        "action_required": True,
        "related_document_id": "doc_apex_redline_v4"
    },
    {
        "id": "comm_102",
        "sender": "David Ross <david.ross@aetherdynamics.com>",
        "sender_name": "David Ross",
        "sender_role": "Chief Financial Officer",
        "channel": "slack",
        "subject": "Q3 Final Metric Pack",
        "timestamp": "2026-10-21T08:10:00",
        "snippet": "Morning Alex. Verified final numbers with audit. ARR stands at $64.2M (+34% YoY). Net burn slowed to $420k/mo, giving us 29.4 months runway. Slide 6 is updated for Elena and the board.",
        "urgency": "medium",
        "action_required": False,
        "related_document_id": "doc_board_q3_summary"
    },
    {
        "id": "comm_103",
        "sender": "United Airlines Premier <notifications@united.com>",
        "sender_name": "United Airlines",
        "sender_role": "Travel Partner",
        "channel": "email",
        "subject": "Flight Delay Alert: UA 482 SFO -> JFK",
        "timestamp": "2026-10-21T06:55:00",
        "snippet": "Your flight UA 482 tomorrow has been delayed due to maintenance. New arrival at JFK is 08:35 AM EDT (was 07:15 AM EDT). This leaves 25 mins before your 9:00 AM keynote prep at Hudson Yards.",
        "urgency": "high",
        "action_required": True,
        "related_document_id": None
    },
    {
        "id": "comm_104",
        "sender": "Elena Rostova <e.rostova@vanguardpartners.vc>",
        "sender_name": "Elena Rostova",
        "sender_role": "Lead Board Director",
        "channel": "email",
        "subject": "Ahead of our 11 AM Review",
        "timestamp": "2026-10-20T21:30:00",
        "snippet": "Alex, looking forward to 11 AM. Please ensure we specifically address the M&A valuation risk and our enterprise pipeline expansion in APAC.",
        "urgency": "medium",
        "action_required": True,
        "related_document_id": "doc_board_q3_summary"
    }
]

DOCUMENTS_REPOSITORY: Dict[str, Dict[str, Any]] = {
    "doc_apex_redline_v4": {
        "title": "Project Apex: Agreement and Plan of Merger (Draft v4.2)",
        "parties": ["Aether Dynamics Inc.", "Acme Technologies Corporation"],
        "effective_date": "2026-11-15",
        "key_clauses": [
            {
                "section": "Section 9.2: Indemnification Liability Cap",
                "original_text": "Buyer aggregate liability shall under no circumstances exceed $5,000,000 USD.",
                "proposed_redline": "Buyer aggregate liability shall be capped at $12,000,000 USD or 25% of Transaction Value.",
                "status": "UNRESOLVED_DISPUTE",
                "risk_rating": "CRITICAL",
                "recommendation": "Reject modification. Our board mandate prohibits liability exposure above $5M."
            },
            {
                "section": "Section 12.4: Intellectual Property & Core Patents",
                "original_text": "All pre-existing Aether core models and algorithms remain sole property of Aether.",
                "proposed_redline": "Acme receives perpetual, non-exclusive royalty-free license to underlying base models.",
                "status": "UNRESOLVED_DISPUTE",
                "risk_rating": "HIGH",
                "recommendation": "Counter-offer: Narrow license to acquired application code only; exclude foundation model weights."
            }
        ]
    },
    "doc_board_q3_summary": {
        "title": "Aether Dynamics - Q3 2026 Board Briefing",
        "highlights": [
            "Annual Recurring Revenue (ARR): $64.2M (+34% YoY)",
            "Net Revenue Retention (NRR): 121%",
            "Cash Runway: 29.4 months ($38.5M cash on hand)",
            "Customer Acquisition Cost (CAC) Payback: 11.2 months"
        ]
    }
}
