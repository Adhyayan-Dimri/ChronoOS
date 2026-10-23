"""
ChronoOS Executive Intelligence Store
Contains realistic enterprise executive context:
- VIP stakeholders & communication threads
- High-stakes contracts & redlines
- Calendar commitments & conflicts
- Long-term episodic memory graph & executive constraints
"""

from typing import Dict, Any, List, Optional, Tuple
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

# --------------------------------------------------------------------------
# Multi-User Account & Tenant Isolation System
# --------------------------------------------------------------------------

DEMO_USER_EMAIL = "alex.mercer@aetherdynamics.com"

USER_ACCOUNTS: Dict[str, Dict[str, Any]] = {
    DEMO_USER_EMAIL: {
        "name": "Alex Mercer",
        "email": DEMO_USER_EMAIL,
        "title": "Chief Executive Officer",
        "organization": "Aether Dynamics Inc.",
        "is_demo": True,
        "profile": EXECUTIVE_PROFILE,
        "memory": list(EPISODIC_MEMORY_GRAPH),
        "schedule": list(CALENDAR_SCHEDULE),
        "communications": list(COMMUNICATIONS_FEED),
        "documents": dict(DOCUMENTS_REPOSITORY)
    }
}

def get_user_data(email: Optional[str] = None) -> Dict[str, Any]:
    """Retrieves data store for a given user or defaults to the demo sandbox."""
    if not email or email == DEMO_USER_EMAIL or email == "demo":
        return USER_ACCOUNTS[DEMO_USER_EMAIL]
    
    if email not in USER_ACCOUNTS:
        # Create a fresh clean personal instance for this email
        USER_ACCOUNTS[email] = {
            "name": email.split("@")[0].replace(".", " ").title(),
            "email": email,
            "title": "Principal Executive",
            "organization": "Private Workspace",
            "is_demo": False,
            "profile": {
                "name": email.split("@")[0].replace(".", " ").title(),
                "title": "Principal Executive",
                "organization": "Private Workspace",
                "timezone": "America/Los_Angeles",
                "preferences": {
                    "work_hours_start": "09:00",
                    "work_hours_end": "18:00",
                    "buffer_between_meetings_minutes": 15,
                    "max_focus_time_blocks_daily": 2,
                    "contract_liability_threshold_usd": 1000000,
                    "preferred_communication_tone": "executive, decisive"
                }
            },
            "memory": [],
            "schedule": [],
            "communications": [],
            "documents": {}
        }
    return USER_ACCOUNTS[email]

import os
import json
import hashlib
import secrets
import logging

logger = logging.getLogger("ExecutiveDataStore")

USER_STORE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "user_store.json")

def get_app_now() -> datetime:
    """Single universal temporal authority for the entire ChronoOS application."""
    return datetime.now()

def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """Cryptographically hashes a password using SHA-256 with a unique random salt."""
    if not salt:
        salt = secrets.token_hex(16)
    pwd_hash = hashlib.sha256((salt + password).encode("utf-8")).hexdigest()
    return pwd_hash, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verifies a plaintext password against the stored salt and hash."""
    if not password or not stored_hash or not salt:
        return False
    pwd_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(pwd_hash, stored_hash)

def save_user_store():
    """Persists user accounts, schedules, and memories to disk."""
    try:
        serializable = {}
        for k, v in USER_ACCOUNTS.items():
            if k != DEMO_USER_EMAIL:
                serializable[k] = v
        with open(USER_STORE_FILE, "w", encoding="utf-8") as f:
            json.dump(serializable, f, indent=2)
    except Exception as e:
        logger.warning(f"Error persisting user store: {e}")

def load_user_store():
    """Loads saved accounts from disk into memory."""
    if os.path.exists(USER_STORE_FILE):
        try:
            with open(USER_STORE_FILE, "r", encoding="utf-8") as f:
                saved = json.load(f)
                for k, v in saved.items():
                    USER_ACCOUNTS[k] = v
            logger.info(f"Loaded {len(saved)} user accounts from disk persistence.")
        except Exception as e:
            logger.warning(f"Error loading user store: {e}")

# Load persistent user data on startup
load_user_store()

def authenticate_user(email: str, password: Optional[str] = None, is_demo: bool = False) -> Dict[str, Any]:
    """Authenticates a user by validating their email and hashed password."""
    if is_demo or email.lower() in ["demo", DEMO_USER_EMAIL.lower()]:
        user = USER_ACCOUNTS[DEMO_USER_EMAIL]
        return {
            "success": True,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "title": user["title"],
                "organization": user["organization"],
                "is_demo": True
            }
        }
    
    clean_email = email.strip()
    if clean_email not in USER_ACCOUNTS:
        return {
            "success": False,
            "error": "No account found with this email. Please register first."
        }
    
    user = USER_ACCOUNTS[clean_email]
    
    # Verify password if account has one set
    if user.get("password_hash") and user.get("salt"):
        if not password or not verify_password(password, user["password_hash"], user["salt"]):
            return {
                "success": False,
                "error": "Incorrect password. Access denied."
            }
            
    return {
        "success": True,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "title": user["title"],
            "organization": user["organization"],
            "is_demo": False,
            "schedule": user.get("schedule", []),
            "commitments_count": len(user.get("schedule", []))
        }
    }

def register_user(name: str, email: str, organization: str = "Private Workspace", password: Optional[str] = None, confirm_password: Optional[str] = None) -> Dict[str, Any]:
    """Registers a new personal executive account with hashed password and clean isolated state."""
    clean_name = name.strip()
    clean_email = email.strip()
    clean_org = organization.strip() or "Private Workspace"
    
    if password or confirm_password:
        if confirm_password is not None and password != confirm_password:
            return {
                "success": False,
                "error": "Passwords do not match. Please re-enter identical passwords."
            }
        if password and len(password) < 4:
            return {
                "success": False,
                "error": "Password must be at least 4 characters long."
            }
            
    pwd_hash = None
    salt = None
    if password:
        pwd_hash, salt = hash_password(password)

    USER_ACCOUNTS[clean_email] = {
        "name": clean_name,
        "email": clean_email,
        "title": "Executive Officer",
        "organization": clean_org,
        "is_demo": False,
        "password_hash": pwd_hash,
        "salt": salt,
        "profile": {
            "name": clean_name,
            "title": "Executive Officer",
            "organization": clean_org,
            "timezone": "America/Los_Angeles",
            "preferences": {
                "work_hours_start": "09:00",
                "work_hours_end": "18:00",
                "buffer_between_meetings_minutes": 15,
                "max_focus_time_blocks_daily": 2,
                "contract_liability_threshold_usd": 1000000,
                "preferred_communication_tone": "executive, decisive"
            }
        },
        "memory": [
            {
                "id": "mem_welcome",
                "category": "system",
                "entity": clean_name,
                "memory": f"ChronoOS initialized for {clean_name} ({clean_org}). Private workspace active.",
                "last_updated": get_app_now().strftime("%Y-%m-%d")
            }
        ],
        "schedule": [],
        "communications": [],
        "documents": {}
    }
    save_user_store()
    
    return {
        "success": True,
        "user": {
            "name": clean_name,
            "email": clean_email,
            "title": "Executive Officer",
            "organization": clean_org,
            "is_demo": False
        }
    }

def add_user_memory(email: Optional[str], entity: str, memory_text: str, category: str = "personal_memory") -> Dict[str, Any]:
    """Adds a persistent memory fact to the specified user's private workspace."""
    user = get_user_data(email)
    import time
    entry = {
        "id": f"mem_{int(time.time() * 1000)}",
        "category": category,
        "entity": entity,
        "memory": memory_text,
        "last_updated": get_app_now().strftime("%Y-%m-%d")
    }
    user.setdefault("memory", []).append(entry)
    save_user_store()
    return entry

def add_user_schedule_item(email: Optional[str], title: str, start: str = "10:00", end: str = "11:00", attendees: Optional[List[str]] = None, location: str = "Office / Remote", item_type: str = "task", priority: str = "medium", date: Optional[str] = None, flight_details: Optional[Dict[str, Any]] = None, **kwargs) -> Dict[str, Any]:
    """Adds a task or calendar commitment to the user's workspace schedule."""
    user = get_user_data(email)
    import time
    entry = {
        "id": f"task_{int(time.time() * 1000)}",
        "title": title,
        "time": f"{start} - {end}" if end and end != start else start,
        "start": start,
        "end": end,
        "date": date or get_app_now().strftime("%Y-%m-%d"),
        "attendees": attendees or [user.get("name", "Executive")],
        "location": location,
        "status": "confirmed",
        "priority": priority,
        "type": item_type,
        "flight_details": flight_details or {}
    }
    for k, v in kwargs.items():
        entry[k] = v
    user.setdefault("schedule", []).append(entry)
    save_user_store()
    return entry

