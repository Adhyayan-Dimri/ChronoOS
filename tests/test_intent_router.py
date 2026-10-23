import pytest
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from intent_router import (
    intent_router_instance,
    IntentType,
    rewrite_query_for_search,
    score_relevance,
    synthesize_grounded_answer
)

def test_intent_router_required_cases():
    cases = [
        # Required Case 1: "check for travel buffer conflicts tomorrow" -> PERSONAL_TOOL
        ("check for travel buffer conflicts tomorrow", IntentType.PERSONAL_TOOL, "travel_buffer"),
        # Required Case 2: "inspect the Acme redline" -> PERSONAL_TOOL
        ("inspect the Acme redline", IntentType.PERSONAL_TOOL, "inspect_document_redlines"),
        # Required Case 3: "any emails from Sarah?" -> PERSONAL_TOOL
        ("any emails from Sarah?", IntentType.PERSONAL_TOOL, "search_communications"),
        # Required Case 4: "who won the IPL final" -> WEB_FACTUAL
        ("who won the IPL final", IntentType.WEB_FACTUAL, "web_search"),
        # Required Case 5: "what's the weather in Bengaluru" -> WEB_FACTUAL
        ("what's the weather in Bengaluru", IntentType.WEB_FACTUAL, "weather"),
        # Required Case 6: "open YouTube" -> APP_COMMAND
        ("open YouTube", IntentType.APP_COMMAND, "app_launcher"),
        # Required Case 7: "hello" -> SMALL_TALK
        ("hello", IntentType.SMALL_TALK, "local_conversation"),
        # Required Case 8: "what about tomorrow?" with no context -> AMBIGUOUS
        ("what about tomorrow?", IntentType.AMBIGUOUS, "clarification"),
        
        # Additional Diverse Cases (>= 15 total)
        ("Alexa, check for travel buffer conflicts tomorrow", IntentType.PERSONAL_TOOL, "travel_buffer"),
        ("when is my flight to London", IntentType.PERSONAL_TOOL, "calendar"),
        ("give me my morning briefing", IntentType.PERSONAL_TOOL, "get_executive_briefing"),
        ("authorize high-stakes action", IntentType.PERSONAL_TOOL, "hitl_action"),
        ("tell me my plans for today", IntentType.PERSONAL_TOOL, "calendar"),
        ("what is the stock price of Apple", IntentType.WEB_FACTUAL, "web_search"),
        ("who is the President of France", IntentType.WEB_FACTUAL, "web_search"),
        ("tell me a joke", IntentType.SMALL_TALK, "local_conversation"),
        ("toggle zen mode", IntentType.APP_COMMAND, "app_launcher"),
        ("check it", IntentType.AMBIGUOUS, "clarification"),
        ("schedule a meeting at 10pm today", IntentType.PERSONAL_TOOL, "calendar")
    ]

    for query, expected_intent, expected_tool in cases:
        decision = intent_router_instance.classify(query)
        assert decision["intent"] == expected_intent, f"Failed for '{query}': expected {expected_intent}, got {decision['intent']}"
        assert decision["confidence"] >= (0.7 if expected_intent != IntentType.AMBIGUOUS else 0.0)

def test_query_rewriting():
    raw_query = "Alexa, can you please tell me who won the IPL final?"
    rewritten = rewrite_query_for_search(raw_query)
    assert "alexa" not in rewritten.lower()
    assert "please" not in rewritten.lower()
    assert "ipl" in rewritten.lower()
    assert "final" in rewritten.lower()

def test_relevance_and_grounded_answer_success():
    query = "who won the IPL final"
    snippets = [
        {
            "title": "2024 Indian Premier League",
            "snippet": "Kolkata Knight Riders won the 2024 IPL final by defeating Sunrisers Hyderabad by 8 wickets.",
            "url": "https://en.wikipedia.org/wiki/2024_Indian_Premier_League",
            "domain": "en.wikipedia.org"
        },
        {
            "title": "Google Search",
            "snippet": "Google is an American multinational corporation and technology company focusing on search.",
            "url": "https://en.wikipedia.org/wiki/Google",
            "domain": "en.wikipedia.org"
        }
    ]
    res = synthesize_grounded_answer(query, snippets)
    assert res["success"] is True
    assert "Kolkata Knight Riders" in res["answer"]
    assert len(res["sources"]) >= 1
    assert res["sources"][0]["domain"] == "en.wikipedia.org"

def test_relevance_and_grounded_answer_refusal():
    query = "who won the IPL final"
    # Unrelated snippets (like Google search)
    snippets = [
        {
            "title": "Google Search",
            "snippet": "Google is a search engine operated by the company Google. It indexes web pages.",
            "url": "https://en.wikipedia.org/wiki/Google",
            "domain": "en.wikipedia.org"
        }
    ]
    res = synthesize_grounded_answer(query, snippets)
    assert res["success"] is False
    assert "couldn't find reliable information" in res["answer"]
    assert len(res["sources"]) == 0
