"""
Integration tests for ChronoOS FastAPI Gateway, MCP JSON-RPC, and Alexa+ Chat endpoints
"""

import sys
import os
import pytest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from fastapi.testclient import TestClient
from api_gateway import app

client = TestClient(app)

def test_api_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_api_status():
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "HEALTHY_ONLINE"
    assert data["mcp_tools_registered"] == 7
    assert "bedrock_model" in data

def test_mcp_jsonrpc_tools_list():
    payload = {
        "jsonrpc": "2.0",
        "id": 100,
        "method": "tools/list",
        "params": {}
    }
    response = client.post("/mcp", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["jsonrpc"] == "2.0"
    assert data["id"] == 100
    assert len(data["result"]["tools"]) == 7

def test_api_chat_briefing():
    payload = {
        "query": "Alexa, give me my morning briefing"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "voice_response" in data
    assert data["visual_card"]["type"] == "EXECUTIVE_BRIEFING"

def test_api_chat_travel_collision():
    payload = {
        "query": "Alexa, check for travel buffer conflicts tomorrow"
    }
    response = client.post("/api/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["visual_card"]["type"] == "TRAVEL_COLLISION_RESOLUTION"

def test_api_confirm_flow():
    # 1. Trigger action preparation via chat
    prep_res = client.post("/api/chat", json={"query": "Alexa, prepare counter-offer rejecting 12 million cap"})
    assert prep_res.status_code == 200
    prep_data = prep_res.json()
    token = prep_data["confirmation_needed"]["token"]

    # 2. Confirm action via /api/confirm
    confirm_res = client.post("/api/confirm", json={
        "action_token": token,
        "decision": "APPROVED"
    })
    assert confirm_res.status_code == 200
    confirm_data = confirm_res.json()
    assert confirm_data["status"] == "success"
    assert confirm_data["decision"] == "APPROVED"
    assert confirm_data["receipt"]["status"] == "EXECUTED_SUCCESSFULLY"

def test_auth_me_demo():
    response = client.get("/api/auth/me?email=alex.mercer@aetherdynamics.com")
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["name"] == "Alex Mercer"
    assert data["user"]["is_demo"] is True
