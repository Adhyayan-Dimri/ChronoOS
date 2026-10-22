"""
Unit tests for ChronoOS Model Context Protocol (MCP 2.0) Server & Tools
"""

import sys
import os
import json
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from mcp_server import mcp_server_instance, CHRONOS_MCP_TOOLS

def test_mcp_initialize():
    res = mcp_server_instance.dispatch_jsonrpc({
        "jsonrpc": "2.0",
        "id": 1,
        "method": "initialize",
        "params": {}
    })
    assert res["jsonrpc"] == "2.0"
    assert res["id"] == 1
    result = res["result"]
    assert "capabilities" in result
    assert "tools" in result["capabilities"]
    assert result["serverInfo"]["name"] == "chrono_os-executive-mcp"

def test_mcp_tools_list():
    res = mcp_server_instance.dispatch_jsonrpc({
        "jsonrpc": "2.0",
        "id": 2,
        "method": "tools/list",
        "params": {}
    })
    tools = res["result"]["tools"]
    assert len(tools) == 7
    tool_names = {t["name"] for t in tools}
    expected_tools = {
        "get_executive_briefing",
        "search_communications",
        "inspect_document_redlines",
        "query_episodic_memory",
        "manage_calendar_commitments",
        "prepare_high_stakes_action",
        "execute_confirmed_action"
    }
    assert tool_names == expected_tools

def test_tool_get_executive_briefing():
    tool_res = mcp_server_instance.execute_tool("get_executive_briefing", {
        "include_calendar": True,
        "include_urgent": True,
        "urgency_filter": "high"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert "executive" in data
    assert "today_schedule" in data
    assert len(data["today_schedule"]) > 0
    assert "urgent_communications" in data

def test_tool_search_communications():
    tool_res = mcp_server_instance.execute_tool("search_communications", {
        "query": "merger",
        "sender_filter": "Sarah Chen"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert data["match_count"] > 0
    assert "Sarah Chen" in data["matches"][0]["sender_name"]

def test_tool_inspect_document_redlines():
    tool_res = mcp_server_instance.execute_tool("inspect_document_redlines", {
        "document_id": "doc_apex_redline_v4",
        "focus_section": "indemnification"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert "filtered_clauses" in data
    assert any("Section 9.2" in c["section"] for c in data["filtered_clauses"])

def test_tool_query_episodic_memory():
    tool_res = mcp_server_instance.execute_tool("query_episodic_memory", {
        "entity_or_topic": "Sarah Chen"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert "memories" in data
    assert len(data["memories"]) > 0

def test_tool_manage_calendar_conflicts():
    tool_res = mcp_server_instance.execute_tool("manage_calendar_commitments", {
        "action": "find_conflicts"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert "calendar_conflicts" in data
    assert len(data["calendar_conflicts"]) > 0
    assert data["calendar_conflicts"][0]["flight_telemetry"]["flight_number"] == "UA 482"

def test_tool_manage_calendar_insert_focus():
    tool_res = mcp_server_instance.execute_tool("manage_calendar_commitments", {
        "action": "insert_focus_block",
        "time_slot": "13:00 - 13:45",
        "reason": "M&A Due Diligence preparation"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert "block" in data
    assert data["block"]["start"] == "13:00"
    assert data["block"]["end"] == "13:45"

def test_tool_manage_calendar_adjust_meeting():
    tool_res = mcp_server_instance.execute_tool("manage_calendar_commitments", {
        "action": "adjust_meeting_time",
        "target_meeting_id": "cal_02",
        "time_slot": "11:30 - 12:45",
        "reason": "Flight UA 482 buffer compensation"
    })
    assert tool_res["isError"] is False
    data = json.loads(tool_res["content"][0]["text"])
    assert data["status"] == "adjusted"
    assert data["new_time"] == "11:30 - 12:45"
    assert data["secured_transit_buffer_minutes"] == 25

def test_tool_hitl_prepare_and_execute():
    # 1. Prepare Action
    prep_res = mcp_server_instance.execute_tool("prepare_high_stakes_action", {
        "action_type": "send_legal_response",
        "target_recipient": "Sarah Chen",
        "proposed_payload": "Counter-offer at $5.5M liability cap.",
        "risk_assessment": "High stakes M&A action"
    })
    assert prep_res["isError"] is False
    prep_data = json.loads(prep_res["content"][0]["text"])
    token = prep_data["details"]["action_token"]
    assert token.startswith("ACT-AUTH-")

    # 2. Execute Action
    exec_res = mcp_server_instance.execute_tool("execute_confirmed_action", {
        "action_token": token,
        "executive_decision": "APPROVED"
    })
    assert exec_res["isError"] is False
    exec_data = json.loads(exec_res["content"][0]["text"])
    assert exec_data["status"] == "EXECUTED_SUCCESSFULLY"
    assert exec_data["token"] == token
    assert "receipt_id" in exec_data

def test_unregistered_tool():
    res = mcp_server_instance.execute_tool("non_existent_tool", {})
    assert res["isError"] is True
