"""
Unit tests for ChronoOS Amazon Bedrock Agentic Orchestrator
Validates multi-turn tool calling loops, guardrail evaluations, and scenarios.
"""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from bedrock_orchestrator import bedrock_orchestrator_instance

def test_orchestrator_scenario_briefing():
    result = bedrock_orchestrator_instance.execute_agent_turn("Alexa, give me my morning briefing")
    assert "voice_response" in result
    assert "visual_card" in result
    assert result["visual_card"]["type"] == "EXECUTIVE_BRIEFING"
    assert any(t["tool"] == "get_executive_briefing" for t in result["tools_invoked"])

def test_orchestrator_scenario_a_acme_redline_chain():
    """Validates recursive 4-tool chain in Scenario A."""
    result = bedrock_orchestrator_instance.execute_agent_turn("Alexa, inspect the Acme merger redline from Sarah")
    assert "voice_response" in result
    assert "$12M" in result["voice_response"] or "twelve million" in result["voice_response"]
    assert result["visual_card"]["type"] == "CONTRACT_REDLINE_ANALYSIS"
    
    # Check that tools were chained
    invoked_names = [t["tool"] for t in result["tools_invoked"]]
    assert "inspect_document_redlines" in invoked_names
    assert "query_episodic_memory" in invoked_names
    assert "manage_calendar_commitments" in invoked_names

    # Check trace events for Bedrock Guardrail
    stages = [evt["stage"] for evt in result["trace_events"]]
    assert any("Guardrail" in s for s in stages)

def test_orchestrator_scenario_b_travel_collision():
    """Validates autonomous flight delay mediation in Scenario B."""
    result = bedrock_orchestrator_instance.execute_agent_turn("Alexa, check for travel buffer conflicts tomorrow")
    assert "voice_response" in result
    assert "UA 482" in result["voice_response"] or "Flight" in result["voice_response"]
    assert "11:30" in result["voice_response"]
    assert result["visual_card"]["type"] == "TRAVEL_COLLISION_RESOLUTION"

    # Check that calendar collision tools were invoked
    invoked_names = [t["tool"] for t in result["tools_invoked"]]
    assert "manage_calendar_commitments" in invoked_names
    assert "query_episodic_memory" in invoked_names

def test_orchestrator_scenario_c_hitl_prep():
    """Validates cryptographic HITL token generation."""
    result = bedrock_orchestrator_instance.execute_agent_turn("Alexa, prepare a counter-offer rejecting the 12 million cap")
    assert result["confirmation_needed"] is not None
    token = result["confirmation_needed"]["token"]
    assert token.startswith("ACT-AUTH-")
    assert result["visual_card"]["type"] == "CONFIRMATION_REQUIRED"

def test_orchestrator_personal_tenant_isolation():
    """Validates clean-slate behavior for non-demo personal workspace."""
    from mock_executive_data import register_user
    register_user("Jane Doe", "jane@company.com", "Acme Enterprise", "secret123")
    
    result = bedrock_orchestrator_instance.execute_agent_turn("Alexa, give me my morning briefing", user_email="jane@company.com")
    assert result["visual_card"]["type"] == "PERSONAL_BRIEFING"
    assert result["visual_card"]["commitments_count"] == 0
    assert "clear today" in result["voice_response"].lower()

def test_orchestrator_schedule_and_next_meeting():
    """Validates that calendar queries return schedule views without collapsing into morning briefing."""
    res_schedule = bedrock_orchestrator_instance.execute_agent_turn("What are my meetings today?")
    assert res_schedule["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "commitments scheduled" in res_schedule["voice_response"]

    res_next = bedrock_orchestrator_instance.execute_agent_turn("What is my next meeting?")
    assert res_next["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "Executive Leadership Daily Standup" in res_next["voice_response"]

def test_orchestrator_financial_metrics_query():
    """Validates that ARR and runway inquiries return exact financial metrics."""
    result = bedrock_orchestrator_instance.execute_agent_turn("What is our ARR and runway?")
    assert result["visual_card"]["type"] == "FINANCIAL_METRICS"
    assert "64.2 million" in result["voice_response"]
    assert "29.4 months" in result["voice_response"]

def test_orchestrator_stakeholder_dossier_query():
    """Validates that asking 'Who is Sarah Chen?' returns her role dossier without triggering contract redline."""
    result = bedrock_orchestrator_instance.execute_agent_turn("Who is Sarah Chen?")
    assert result["visual_card"]["type"] == "STAKEHOLDER_PROFILE"
    assert "General Counsel" in result["voice_response"]
    assert "Section 9.2" not in result["voice_response"]  # Not the canned redline response!

def test_orchestrator_project_apex_query():
    """Validates Project Apex overview inquiry."""
    result = bedrock_orchestrator_instance.execute_agent_turn("What is Project Apex?")
    assert result["visual_card"]["type"] == "PROJECT_OVERVIEW"
    assert "48 million" in result["voice_response"]

def test_orchestrator_weather_query():
    """Validates that asking for weather returns accurate live forecast instead of Sarah Chen redlines."""
    result = bedrock_orchestrator_instance.execute_agent_turn("Tell me the weather today")
    assert result["visual_card"]["type"] == "WEATHER_REPORT"
    assert "degrees" in result["voice_response"].lower()
    assert "Sarah Chen" not in result["voice_response"]

def test_orchestrator_personal_user_weather():
    """Validates that personal accounts (e.g. Qurie2006) get live weather instead of personal calendar."""
    result = bedrock_orchestrator_instance.execute_agent_turn("tell me the weather today", user_email="Qurie2006")
    assert result["visual_card"]["type"] == "WEATHER_REPORT"
    assert "degrees" in result["voice_response"].lower()
    assert "private executive calendar is completely clear" not in result["voice_response"].lower()

def test_orchestrator_day_today_query():
    """Validates that asking for the day/date returns exact temporal clock."""
    result = bedrock_orchestrator_instance.execute_agent_turn("what is the day today", user_email="Qurie2006")
    assert result["visual_card"]["type"] == "TIME_DATE"
    assert "today is" in result["voice_response"].lower()
    assert "time is" in result["voice_response"].lower()

def test_orchestrator_personal_memory_prompt_and_store_flow():
    """Validates interactive multi-turn personal memory acquisition."""
    user = "qurie_test_mem@chrono.local"
    
    # Step 1: User asks for pet name (not yet recorded)
    res1 = bedrock_orchestrator_instance.execute_agent_turn("what is my pet name", user_email=user)
    assert res1["visual_card"]["type"] == "MEMORY_PROMPT"
    assert "do not have your pet name recorded" in res1["voice_response"].lower()
    assert "would you like me to add it" in res1["voice_response"].lower()

    # Step 2: User says yes
    res2 = bedrock_orchestrator_instance.execute_agent_turn("yes", user_email=user)
    assert res2["visual_card"]["type"] == "MEMORY_PROMPT"
    assert "what is your pet name" in res2["voice_response"].lower()

    # Step 3: User provides the value
    res3 = bedrock_orchestrator_instance.execute_agent_turn("Luna", user_email=user)
    assert res3["visual_card"]["type"] == "MEMORY_SAVED"
    assert "saved your pet name ('Luna')" in res3["voice_response"]

    # Step 4: Subsequent inquiry retrieves the stored fact
    res4 = bedrock_orchestrator_instance.execute_agent_turn("what is my pet name", user_email=user)
    assert res4["visual_card"]["type"] == "PERSONAL_MEMORY"
    assert "Luna" in res4["voice_response"]

def test_orchestrator_web_search_knowledge():
    """Validates that general knowledge questions search the live web for answers."""
    result = bedrock_orchestrator_instance.execute_agent_turn("who is the CEO of Apple", user_email="Qurie2006")
    assert result["visual_card"]["type"] == "WEB_SEARCH_RESULT"
    assert "web intelligence" in result["voice_response"].lower()
    assert "Cook" in result["voice_response"]

def test_orchestrator_task_help_guidance():
    """Validates that asking how to add tasks returns interactive guidance card."""
    result = bedrock_orchestrator_instance.execute_agent_turn("how can i add my tasks", user_email="Qurie2006")
    assert result["visual_card"]["type"] == "TASK_HELP"
    assert "add any task or meeting" in result["voice_response"].lower()
    assert len(result["visual_card"]["sample_commands"]) >= 3

def test_orchestrator_add_task_natural_language():
    """Validates adding tasks and meetings in natural language."""
    user = "qurie_task_test@chrono.local"
    
    # Add a task with a time
    res = bedrock_orchestrator_instance.execute_agent_turn("add task Review Q3 marketing strategy at 3:00 PM", user_email=user)
    assert res["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "Review Q3 marketing strategy" in res["voice_response"]
    assert "3:00 PM" in res["voice_response"]
    assert any("Review Q3 marketing strategy" in item["title"] for item in res["visual_card"]["timeline"])

    # Query schedule view
    res_sched = bedrock_orchestrator_instance.execute_agent_turn("what are my meetings today", user_email=user)
    assert res_sched["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert res_sched["visual_card"]["commitments_count"] >= 1

def test_orchestrator_flight_scheduling_with_typos():
    """Validates that 'schedudle a flight from bengaluru to dellhi on 30 november' schedules flight and avoids word-boundary bug."""
    user = "qurie_flight_test@chrono.local"
    q = "schedudle a flight from bengaluru to dellhi on 30 november"
    res = bedrock_orchestrator_instance.execute_agent_turn(q, user_email=user)
    
    assert res["visual_card"]["type"] == "FLIGHT_ITINERARY"
    assert res["visual_card"]["origin"] == "Bengaluru (BLR)"
    assert res["visual_card"]["destination"] == "Delhi (DEL)"
    assert "30 November" in res["visual_card"]["date"]
    assert "Bengaluru" in res["voice_response"]
    assert "Delhi" in res["voice_response"]
    assert "FLIGHT_ITINERARY" == res["visual_card"]["type"]
    assert res["visual_card"]["status"] == "Confirmed & Scheduled in Calendar"

def test_orchestrator_book_flight_sfo_jfk():
    """Validates SFO to JFK flight booking and calendar integration."""
    user = "qurie_flight_test2@chrono.local"
    q = "book a flight from SFO to JFK on Friday"
    res = bedrock_orchestrator_instance.execute_agent_turn(q, user_email=user)
    
    assert res["visual_card"]["type"] == "FLIGHT_ITINERARY"
    assert "San Francisco (SFO)" in res["visual_card"]["origin"]
    assert "New York (JFK)" in res["visual_card"]["destination"]
    assert "Friday" in res["visual_card"]["date"]
    assert "scheduled your flight" in res["voice_response"].lower()

def test_orchestrator_when_is_my_flight():
    """Validates that 'when is my flight' returns user's scheduled flight and never queries Wikipedia for MH370."""
    user = "qurie_flight_query_test@chrono.local"
    
    # Step 1: Schedule flight
    res1 = bedrock_orchestrator_instance.execute_agent_turn("schedudle a flight from bengaluru to dellhi on 30 november", user_email=user)
    assert res1["visual_card"]["type"] == "FLIGHT_ITINERARY"
    
    # Step 2: Query flight
    res2 = bedrock_orchestrator_instance.execute_agent_turn("when is my flight", user_email=user)
    assert res2["visual_card"]["type"] == "FLIGHT_ITINERARY"
    assert "Bengaluru (BLR)" in res2["visual_card"]["origin"]
    assert "Delhi (DEL)" in res2["visual_card"]["destination"]
    assert "30 November" in res2["visual_card"]["date"]
    assert "Malaysia Airlines" not in res2["voice_response"]
    assert "370" not in res2["voice_response"]
    assert "Air India AI 804" in res2["visual_card"]["carrier"]

def test_orchestrator_when_is_my_flight_empty():
    """Validates clear response when user has no flights scheduled."""
    user = "brand_new_user_no_flights@chrono.local"
    res = bedrock_orchestrator_instance.execute_agent_turn("when is my flight", user_email=user)
    assert res["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "do not have any" in res["voice_response"].lower()
    assert "scheduled in your calendar" in res["voice_response"].lower()

def test_orchestrator_universal_schedule_meetings():
    """Validates that 'when is my [anything]' queries match meetings, standups, calls, and never leak to Wikipedia."""
    # Test 1: In demo schedule, query standup
    res_standup = bedrock_orchestrator_instance.execute_agent_turn("when is my standup", user_email="alex.mercer@aetherdynamics.com")
    assert res_standup["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "Daily Standup" in res_standup["voice_response"]
    assert "09:00" in res_standup["voice_response"]

    # Test 2: In demo schedule, query meeting with Sarah
    res_sarah = bedrock_orchestrator_instance.execute_agent_turn("when is my meeting with Sarah", user_email="alex.mercer@aetherdynamics.com")
    assert res_sarah["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "Sarah Chen" in str(res_sarah["visual_card"])

    # Test 3: Query an unscheduled item like interview
    res_interview = bedrock_orchestrator_instance.execute_agent_turn("when is my interview", user_email="alex.mercer@aetherdynamics.com")
    assert res_interview["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "do not have any 'interview' scheduled" in res_interview["voice_response"].lower()
    assert "Wikipedia" not in res_interview["voice_response"]

def test_orchestrator_tell_me_my_plans_for_today():
    from mock_executive_data import register_user, add_user_schedule_item
    email = "qurie_plans_test@chrono.ai"
    register_user("Qurie2006", email, "Private Workspace", "testpass")
    
    add_user_schedule_item(email, "A flight from Bengaluru to Delhi on 30 november", "14:00", "15:00")
    add_user_schedule_item(email, "A dentist appointment tomorrow", "14:00", "15:00")
    add_user_schedule_item(email, "To prepare dinner for today", "14:00", "15:00")
    add_user_schedule_item(email, "Dinner for today 7:00 p.m", "19:00", "20:00")
    
    res = bedrock_orchestrator_instance.execute_agent_turn("tell me my plans for today", user_email=email)
    assert res["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "For today, you have 2 commitments scheduled" in res["voice_response"]
    assert "dinner" in res["voice_response"].lower()
    assert "dentist" in res["voice_response"].lower()
    assert "flight" in res["voice_response"].lower()

def test_orchestrator_plans_variations():
    from mock_executive_data import register_user, add_user_schedule_item
    email = "qurie_plans_var@chrono.ai"
    register_user("Qurie2006", email, "Private Workspace", "testpass")
    
    add_user_schedule_item(email, "A dentist appointment tomorrow", "10:00", "11:00")
    add_user_schedule_item(email, "Dinner for today 7:00 p.m", "19:00", "20:00")
    
    # "what are my plans for today"
    res1 = bedrock_orchestrator_instance.execute_agent_turn("what are my plans for today", user_email=email)
    assert res1["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "For today" in res1["voice_response"]
    
    # "plans for today"
    res2 = bedrock_orchestrator_instance.execute_agent_turn("plans for today", user_email=email)
    assert res2["visual_card"]["type"] == "SCHEDULE_VIEW"
    
    # "what are my plans" (all)
    res3 = bedrock_orchestrator_instance.execute_agent_turn("what are my plans", user_email=email)
    assert res3["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "commitments in your executive calendar" in res3["voice_response"]
    
    # "what are my plans for tomorrow"
    res4 = bedrock_orchestrator_instance.execute_agent_turn("what are my plans for tomorrow", user_email=email)
    assert res4["visual_card"]["type"] == "SCHEDULE_VIEW"
    assert "For tomorrow" in res4["voice_response"]








