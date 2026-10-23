"""
ChronoOS Intent Router & Grounded Web Intelligence Engine
Implements:
1. 4-Way Intent Classification:
   - PERSONAL_TOOL: user's personal data (calendar, flights, travel buffers, emails, redlines, memory, etc.)
   - WEB_FACTUAL: general-world questions (news, sports, weather, facts)
   - SMALL_TALK: greetings, conversational remarks
   - APP_COMMAND: app controls ("open YouTube", toggles)
   - AMBIGUOUS: underspecified questions (confidence < 0.7) -> ask 1 clarifying question
2. Standalone Query Rewriter for web search (3-8 clean search keywords)
3. Relevance Scorer (0.0 - 1.0, drops < 0.6) & Grounded Synthesis (strictly from snippets)
"""

import re
import json
import html
import logging
from typing import Dict, Any, List, Optional, Tuple

logger = logging.getLogger("IntentRouter")

class IntentType:
    PERSONAL_TOOL = "PERSONAL_TOOL"
    WEB_FACTUAL = "WEB_FACTUAL"
    APP_COMMAND = "APP_COMMAND"
    SMALL_TALK = "SMALL_TALK"
    AMBIGUOUS = "AMBIGUOUS"

class IntentRouter:
    def __init__(self, bedrock_client=None):
        self.bedrock_client = bedrock_client

    def classify(self, query: str, user_context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Classifies a user query into exactly one of:
        - PERSONAL_TOOL
        - WEB_FACTUAL
        - APP_COMMAND
        - SMALL_TALK
        - AMBIGUOUS

        Uses deterministic keyword pre-check first, calibrated confidence scoring,
        and fails over to AMBIGUOUS if confidence < 0.7. Web search is NEVER default.
        """
        raw_clean = query.strip()
        q = raw_clean.lower()
        # Strip wake words
        q_no_wake = re.sub(r'^(?:alexa,?\s*|hey alexa,?\s*|chrono,?\s*|chronos,?\s*)', '', q, flags=re.IGNORECASE).strip().rstrip('?.!')

        # -------------------------------------------------------------
        # 1. Deterministic Check: AMBIGUOUS (Underspecified queries)
        # -------------------------------------------------------------
        ambiguous_exact = [
            "what about tomorrow", "what about today", "what about yesterday",
            "what about that", "check it", "check this", "do that", "can you do that",
            "and then", "what next", "why", "how come", "tell me more", "what else",
            "tomorrow", "today", "yesterday", "next"
        ]
        if q_no_wake in ambiguous_exact or re.match(r'^(?:what about|how about)\s+(?:tomorrow|today|that|this|it)$', q_no_wake):
            return {
                "intent": IntentType.AMBIGUOUS,
                "tool": "clarification",
                "confidence": 0.55,
                "reason": "Underspecified inquiry without context or target entity",
                "clarifying_question": "Could you clarify what you would like me to check for tomorrow? For example, your personal schedule, travel buffers, or a general question?"
            }

        # -------------------------------------------------------------
        # 2. Deterministic Check: APP_COMMAND
        # -------------------------------------------------------------
        app_command_patterns = [
            r'\b(?:open|launch|go to)\s+(?:youtube|spotify|google|chrome|browser|camera|terminal|dossier|zen)\b',
            r'\b(?:toggle|switch to|enter|exit)\s+(?:zen|zen mode|dossier|spotlight|fullscreen)\b',
            r'\b(?:mute|unmute|turn off sound|turn on sound|enable sound|disable sound)\b'
        ]
        if any(re.search(pat, q_no_wake) for pat in app_command_patterns):
            target_app = "application"
            if "youtube" in q_no_wake: target_app = "YouTube"
            elif "spotify" in q_no_wake: target_app = "Spotify"
            elif "zen" in q_no_wake: target_app = "Zen Mode"
            elif "dossier" in q_no_wake: target_app = "Executive Dossier"
            return {
                "intent": IntentType.APP_COMMAND,
                "tool": "app_launcher",
                "confidence": 0.98,
                "target": target_app,
                "reason": f"System command to control or launch {target_app}"
            }

        # -------------------------------------------------------------
        # 3. Deterministic Check: SMALL_TALK
        # -------------------------------------------------------------
        small_talk_exact = [
            "hello", "hi", "hey", "good morning", "good afternoon", "good evening",
            "how are you", "who are you", "what can you do", "thank you", "thanks",
            "thanks a lot", "bye", "goodbye", "see you", "tell me a joke"
        ]
        if q_no_wake in small_talk_exact or re.match(r'^(?:hello|hi|hey|good morning|howdy)\b', q_no_wake):
            return {
                "intent": IntentType.SMALL_TALK,
                "tool": "local_conversation",
                "confidence": 0.99,
                "reason": "Standard conversational greeting or courtesy phrase"
            }

        # -------------------------------------------------------------
        # 4. Deterministic Check: PERSONAL_TOOL (User's private data)
        # -------------------------------------------------------------
        # Temporal clock check
        temporal_patterns = [
            r'\b(?:what\s+is\s+the\s+day\s+today|what\s+day\s+is\s+it|what\s+is\s+today\'?s?\s+date|day\s+today|what\s+time\s+is\s+it|tell\s+me\s+the\s+time|current\s+time)\b'
        ]
        if any(re.search(pat, q_no_wake) for pat in temporal_patterns):
            return {
                "intent": IntentType.PERSONAL_TOOL,
                "tool": "temporal_clock",
                "confidence": 0.99,
                "reason": "Temporal clock/date query"
            }

        # Stakeholder Profile query ("Who is Sarah Chen?")
        if re.search(r'\bwho\s+is\s+(?:sarah(?:\s+chen)?|david(?:\s+ross)?|elena(?:\s+rostova)?|maya(?:\s+patel)?)\b', q_no_wake):
            return {
                "intent": IntentType.PERSONAL_TOOL,
                "tool": "stakeholder_profile",
                "confidence": 0.98,
                "reason": "Executive stakeholder profile query"
            }

        personal_patterns = [
            # Travel & Buffer
            r'\b(?:travel\s+buffer|buffer\s+conflicts?|travel\s+conflicts?|airport\s+buffer|departure\s+buffer|traffic\s+delay|buffer\s+audit)\b',
            # Calendar, Schedule & Commitments
            r'\b(?:my\s+schedule|my\s+calendar|my\s+meetings?|my\s+tasks?|my\s+commitments?|my\s+agenda|my\s+plans?|plans?\s+for\s+today|plans?\s+today|plans?\s+for\s+tomorrow|agenda\s+for\s+today)\b',
            r'\b(?:schedule\s+(?:a\s+|an\s+)?(?:meeting|call|sync|session)|schedule\s+(?:at|for)?\s*\d+|book\s+(?:a\s+|an\s+)?(?:meeting|flight|call)|set\s+up\s+(?:a\s+|an\s+)?(?:meeting|call|sync)|create\s+(?:a\s+|an\s+)?(?:meeting|task|reminder|event)|add\s+(?:a\s+|an\s+)?(?:task|meeting|commitment|event)|add\s+task|create\s+task|remind\s+me\s+to|add\s+to\s+schedule|meeting\s+at\s+\d+|meeting\s+today|meeting\s+tomorrow)\b',
            r'\b(?:schedule|meeting|meetings|calendar|appointment|appointments)\b',
            r'\b(?:when\s+is\s+my|what\s+time\s+is\s+my|where\s+is\s+my|what\s+is\s+my\s+(?:next\s+)?meeting|next\s+meeting|upcoming\s+meeting|tell\s+me\s+my\s+plans|what\s+are\s+my\s+plans)\b',
            r'\b(?:flight|flights|fly|flying|boarding|airline|ticket|itinerary)\b',
            # Contracts, Redlines & HITL Actions
            r'\b(?:redline|redlines|inspect\s+redline|inspect\s+the\s+acme\s+redline|acme|project\s+apex|merger\s+agreement|indemnification|liability\s+cap|escrow\s+holdback|governing\s+law|non-compete)\b',
            r'\b(?:counter-offer|counter\s+offer|counteroffer|reject|rejecting|12\s+million\s+cap|12m\s+cap)\b',
            # Communications & People
            r'\b(?:emails?|slack|messages?|unread|threads?|inbox)\s+(?:from|with|regarding)\b',
            r'\b(?:any\s+emails?\s+from|emails?\s+from\s+sarah|emails?\s+from\s+david|emails?\s+from\s+elena|messages?\s+from)\b',
            r'\b(?:sarah\s+chen|david\s+ross|elena\s+rostova|maya\s+patel)\b',
            # Briefings & Actions
            r'\b(?:briefing|morning\s+briefing|daily\s+briefing|standup|triage\s+my\s+day|executive\s+briefing)\b',
            r'\b(?:authorize|approve|reject|confirm\s+action|high\s+stakes|sign\s+off|wire\s+transfer)\b',
            # Personal Memory
            r'\b(?:remember\s+that|save\s+to\s+memory|who\s+am\s+i|where\s+do\s+i\s+live|my\s+pet|my\s+address|my\s+phone)\b',
            # Financials (Executive Sandbox)
            r'\b(?:arr|runway|net\s+burn|cash\s+flow|burn\s+rate|balance\s+sheet)\b'
        ]

        for pat in personal_patterns:
            if re.search(pat, q_no_wake):
                tool_assigned = "calendar"
                # Priority 1: High Stakes Actions / HITL
                if any(k in q_no_wake for k in ["counter", "reject", "authorize", "approve", "confirm", "high stakes", "sign off"]):
                    tool_assigned = "hitl_action"
                # Priority 2: Travel Buffer
                elif any(k in q_no_wake for k in ["travel buffer", "buffer conflict", "travel conflict", "airport buffer"]):
                    tool_assigned = "travel_buffer"
                # Priority 3: Calendar & Schedule
                elif any(k in q_no_wake for k in ["when is my", "meeting", "meetings", "schedule", "standup", "calendar", "commitments", "agenda", "task"]):
                    tool_assigned = "calendar"
                # Priority 4: Redlines & Contracts
                elif any(k in q_no_wake for k in ["redline", "acme", "apex", "contract", "indemnification", "liability cap"]):
                    tool_assigned = "inspect_document_redlines"
                # Priority 5: Briefings
                elif any(k in q_no_wake for k in ["briefing", "triage"]):
                    tool_assigned = "get_executive_briefing"
                # Priority 6: Communications
                elif any(k in q_no_wake for k in ["email", "emails", "slack", "message", "messages", "sarah", "david", "elena"]):
                    tool_assigned = "search_communications"
                elif any(k in q_no_wake for k in ["remember", "memory", "who am i", "my pet"]):
                    tool_assigned = "episodic_memory"
                elif any(k in q_no_wake for k in ["arr", "runway", "burn rate", "finances"]):
                    tool_assigned = "financial_metrics"

                return {
                    "intent": IntentType.PERSONAL_TOOL,
                    "tool": tool_assigned,
                    "confidence": 0.96,
                    "reason": f"Matched executive workspace personal domain pattern: '{pat}'"
                }

        # -------------------------------------------------------------
        # 5. Deterministic Check: WEB_FACTUAL (World knowledge)
        # -------------------------------------------------------------
        web_factual_patterns = [
            r'\b(?:weather|temperature|forecast|rain|rainy|sunny|climate)\b',
            r'\b(?:who\s+won|winner\s+of|championship|final|ipl|super\s+bowl|world\s+cup|olympics|score|match)\b',
            r'\b(?:stock\s+price|market\s+cap|share\s+price|crypto|bitcoin|ethereum)\b',
            r'\b(?:population\s+of|capital\s+of|distance\s+between|height\s+of|founder\s+of|ceo\s+of\s+[a-z]+)\b',
            r'\b(?:what\s+is\s+the\s+capital|what\s+is\s+the\s+population|how\s+tall\s+is|how\s+far\s+is)\b',
            r'\b(?:news\s+today|latest\s+news|headline|headlines|current\s+events)\b',
            r'\b(?:who\s+is\s+(?!sarah|david|elena|maya)[a-zA-Z\s]+)\b',
            r'\b(?:what\s+is\s+(?!project\s+apex|apex|acme)[a-zA-Z\s]+)\b'
        ]

        for pat in web_factual_patterns:
            if re.search(pat, q_no_wake):
                tool = "weather" if any(w in q_no_wake for w in ["weather", "temperature", "forecast"]) else "web_search"
                return {
                    "intent": IntentType.WEB_FACTUAL,
                    "tool": tool,
                    "confidence": 0.92,
                    "reason": f"Matched world factual domain pattern: '{pat}'"
                }

        # -------------------------------------------------------------
        # 6. Fallback Scoring: Check confidence
        # -------------------------------------------------------------
        # If query has personal pronouns ("my", "i", "we", "our") -> lean PERSONAL_TOOL
        if re.search(r'\b(?:my|mine|i|me|we|our|private)\b', q_no_wake):
            return {
                "intent": IntentType.PERSONAL_TOOL,
                "tool": "calendar",
                "confidence": 0.78,
                "reason": "Personal reference pronoun detected in query"
            }

        # If length is very short and no clear entity -> AMBIGUOUS
        tokens = [t for t in re.split(r'\s+', q_no_wake) if len(t) > 1]
        if len(tokens) <= 2:
            return {
                "intent": IntentType.AMBIGUOUS,
                "tool": "clarification",
                "confidence": 0.50,
                "reason": "Query is too brief with insufficient domain confidence (< 0.70)",
                "clarifying_question": f"Could you provide a bit more detail about what you would like me to find or do regarding '{q_no_wake}'?"
            }

        # Web search must NEVER be the default fallback!
        # If no explicit domain pattern matched, treat as AMBIGUOUS with confidence < 0.70
        return {
            "intent": IntentType.AMBIGUOUS,
            "tool": "clarification",
            "confidence": 0.50,
            "reason": "No explicit personal or web factual pattern matched (< 0.70 confidence)",
            "clarifying_question": f"Could you clarify what you would like me to check or do? For example, your personal schedule, meetings, or a specific topic?"
        }

def rewrite_query_for_search(raw_query: str) -> str:
    """
    Strips wake words, conversational filler, and command verbs.
    Rewrites into a clean, standalone search query of 3-8 keywords.
    """
    q = raw_query.strip()
    # 1. Strip wake words
    q = re.sub(r'^(?:alexa,?\s*|hey alexa,?\s*|chrono,?\s*|chronos,?\s*)', '', q, flags=re.IGNORECASE).strip()
    
    # 2. Strip conversational command verbs and filler
    fillers = [
        r'^(?:can you please|please|could you please|could you|can you)\s+',
        r'^(?:tell me about|tell me who|tell me what|tell me)\s+',
        r'^(?:search for|search the web for|look up|find information on|find info about|find out)\s+',
        r'^(?:what is|what are|who is|who was|who were|where is|where are)\s+',
        r'^(?:i want to know|do you know)\s+'
    ]
    for f in fillers:
        q = re.sub(f, '', q, flags=re.IGNORECASE).strip()

    # Clean punctuation
    q = re.sub(r'[?!.,;:"\']', '', q).strip()
    
    tokens = [w for w in re.split(r'\s+', q) if w]
    # Restrict to 3-8 words
    if len(tokens) > 8:
        # Keep the most significant tokens
        tokens = tokens[:8]
    rewritten = " ".join(tokens)
    return rewritten if rewritten else raw_query.strip()

def score_relevance(query: str, snippet: str, title: str = "") -> float:
    """
    Scores the relevance of a retrieved search snippet against the original query (0.0 to 1.0).
    Uses token overlap, exact entity matches, and context alignment.
    """
    clean_q = re.sub(r'[^\w\s]', '', query.lower())
    q_tokens = set([t for t in clean_q.split() if len(t) > 2 and t not in ['the', 'and', 'for', 'with', 'what', 'who', 'how']])
    if not q_tokens:
        return 0.5

    content = (title + " " + snippet).lower()
    content_words = set(re.sub(r'[^\w\s]', '', content).split())

    matches = q_tokens.intersection(content_words)
    token_score = len(matches) / len(q_tokens)

    # Bonus for exact key phrase matches
    if query.lower().strip() in content:
        token_score = min(1.0, token_score + 0.3)

    return round(token_score, 2)

def synthesize_grounded_answer(query: str, snippets: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Answers strictly from the provided search results.
    Filters out results with relevance < 0.6.
    If no relevant snippets remain, returns refusal to hallucinate.
    """
    scored_results = []
    for s in snippets:
        score = score_relevance(query, s.get("snippet", "") or s.get("summary", ""), s.get("title", ""))
        if score >= 0.6:
            scored_results.append((score, s))

    scored_results.sort(key=lambda x: x[0], reverse=True)

    if not scored_results:
        return {
            "success": False,
            "answer": "I couldn't find reliable information on that. Would you like to refine the question?",
            "sources": [],
            "relevance_dropped": len(snippets)
        }

    # Best snippets
    top_score, top_item = scored_results[0]
    extract = html.unescape(top_item.get("snippet") or top_item.get("summary", ""))
    
    # Clean sentences: max 3 sentences for executive voice brevity
    sentences = re.split(r'(?<=[.!?])\s+', extract.strip())
    concise_answer = " ".join(sentences[:3]).strip()

    item_title = top_item.get("title", "")
    if item_title and item_title.lower() not in concise_answer.lower():
        if concise_answer.startswith("is ") or concise_answer.startswith("was "):
            concise_answer = f"{item_title} {concise_answer}"
        elif concise_answer.startswith("executive") or concise_answer.startswith("an ") or concise_answer.startswith("a "):
            concise_answer = f"{item_title} is an {concise_answer.removeprefix('an ')}"
        else:
            concise_answer = f"{item_title}: {concise_answer}"

    sources = []
    for score, item in scored_results[:2]:
        sources.append({
            "title": item.get("title", "Web Reference"),
            "url": item.get("url", ""),
            "domain": item.get("domain", "en.wikipedia.org"),
            "relevance": score
        })

    return {
        "success": True,
        "answer": concise_answer,
        "sources": sources,
        "top_relevance": top_score
    }

def fetch_web_snippets(clean_query: str) -> List[Dict[str, Any]]:
    """Fetches top 3-5 snippets from open web Wikipedia search."""
    import urllib.request
    import urllib.parse
    snippets = []
    try:
        search_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(clean_query)}&format=json&utf8=1&srlimit=5"
        s_req = urllib.request.Request(search_url, headers={'User-Agent': 'ChronoOS-Assistant/1.0 (chrono-assistant@chrono.local)'})
        with urllib.request.urlopen(s_req, timeout=5.0) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            search_items = data.get('query', {}).get('search', [])
            for item in search_items:
                title = item.get('title', '')
                snippet_html = item.get('snippet', '')
                clean_snippet = re.sub(r'<[^>]+>', '', snippet_html).strip()
                page_url = f"https://en.wikipedia.org/wiki/{urllib.parse.quote(title.replace(' ', '_'))}"
                if clean_snippet:
                    snippets.append({
                        "title": title,
                        "snippet": html.unescape(clean_snippet),
                        "url": page_url,
                        "domain": "en.wikipedia.org"
                    })
    except Exception as e:
        logger.warning(f"Web snippet fetch note: {e}")
    return snippets

intent_router_instance = IntentRouter()
