"""
ChronoOS API Gateway & HTTP/SSE Server
Provides:
- Model Context Protocol (MCP) Streamable HTTP / SSE endpoints
- Alexa+ Voice Orchestration API (/api/chat, /api/confirm)
- Full static mounting of the Echo Show 15 Multimodal Simulator
"""

import os
import sys
import json
import asyncio
from typing import Dict, Any, Optional, List

# Load .env configuration
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
if os.path.exists(env_path):
    try:
        from dotenv import load_dotenv
        load_dotenv(env_path, override=True)
    except Exception:
        pass
    try:
        with open(env_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    k, v = k.strip(), v.strip().strip("'\"")
                    if k and (k not in os.environ or not os.environ[k]):
                        os.environ[k] = v
    except Exception:
        pass

# Ensure local module imports work seamlessly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from mcp_server import mcp_server_instance, CHRONOS_MCP_TOOLS
from bedrock_orchestrator import bedrock_orchestrator_instance

app = FastAPI(
    title="ChronoOS Alexa Executive MCP Gateway",
    version="1.0.0",
    description="Self-Hosted MCP Server and Bedrock Orchestrator for Alexa+ Hackathon"
)

# Enable CORS for external MCP clients and local browsers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Client message queues for MCP SSE streaming
CLIENT_QUEUES: Dict[str, asyncio.Queue] = {}

# -------------------------------------------------------------
# MCP Streamable HTTP & JSON-RPC 2.0 Endpoints
# -------------------------------------------------------------

@app.post("/mcp")
async def mcp_jsonrpc_endpoint(request: Request):
    """
    Standard Model Context Protocol JSON-RPC 2.0 endpoint.
    Handles initialize, tools/list, and tools/call.
    """
    try:
        body = await request.json()
        response = mcp_server_instance.dispatch_jsonrpc(body)
        return JSONResponse(content=response)
    except Exception as e:
        return JSONResponse(
            status_code=400,
            content={
                "jsonrpc": "2.0",
                "id": None,
                "error": {"code": -32700, "message": f"Parse error: {str(e)}"}
            }
        )

@app.get("/sse")
async def mcp_sse_endpoint(request: Request):
    """
    MCP Streamable HTTP SSE endpoint (MCP Specification 2024-11-05+).
    Establishes server-sent event channel for streaming MCP events.
    """
    session_id = f"mcp-session-{os.urandom(4).hex()}"
    queue: asyncio.Queue = asyncio.Queue()
    CLIENT_QUEUES[session_id] = queue

    async def event_generator():
        # First event sends the message endpoint URI
        yield {
            "event": "endpoint",
            "data": f"/message?session_id={session_id}"
        }
        try:
            while True:
                if await request.is_disconnected():
                    break
                try:
                    data = await asyncio.wait_for(queue.get(), timeout=20.0)
                    yield {
                        "event": "message",
                        "data": json.dumps(data)
                    }
                except asyncio.TimeoutError:
                    # Keepalive ping
                    yield {
                        "event": "ping",
                        "data": "keepalive"
                    }
        finally:
            CLIENT_QUEUES.pop(session_id, None)

    return EventSourceResponse(event_generator())

@app.post("/message")
async def mcp_message_endpoint(request: Request, session_id: str):
    """
    Receives JSON-RPC requests for an active SSE session.
    """
    if session_id not in CLIENT_QUEUES:
        raise HTTPException(status_code=404, detail="Active SSE session not found.")
    
    body = await request.json()
    response = mcp_server_instance.dispatch_jsonrpc(body)
    await CLIENT_QUEUES[session_id].put(response)
    return {"status": "delivered", "session_id": session_id}

# -------------------------------------------------------------
# -------------------------------------------------------------
# User Authentication & Tenant Management Endpoints
# -------------------------------------------------------------

from mock_executive_data import authenticate_user, register_user, get_user_data, DEMO_USER_EMAIL, delete_user_schedule_item

@app.post("/api/auth/login")
async def auth_login_endpoint(payload: Dict[str, Any]):
    """
    Authenticates a user with hashed password verification or switches to demo sandbox.
    """
    email = payload.get("email", "")
    password = payload.get("password")
    is_demo = payload.get("is_demo", False)
    
    result = authenticate_user(email=email, password=password, is_demo=is_demo)
    if not result.get("success"):
        raise HTTPException(status_code=401, detail=result.get("error", "Invalid credentials."))
    return result

@app.post("/api/auth/register")
async def auth_register_endpoint(payload: Dict[str, Any]):
    """
    Registers a new isolated executive account with password validation and persistent storage.
    """
    name = payload.get("name", "").strip()
    email = payload.get("email", "").strip()
    org = payload.get("organization", "Private Enterprise").strip()
    password = payload.get("password")
    confirm_password = payload.get("confirm_password")

    if not name or not email:
        raise HTTPException(status_code=400, detail="Name and Email are required.")

    result = register_user(name=name, email=email, organization=org, password=password, confirm_password=confirm_password)
    if not result.get("success"):
        raise HTTPException(status_code=400, detail=result.get("error", "Registration error."))
    return result

@app.get("/api/auth/me")
async def auth_me_endpoint(email: Optional[str] = None):
    """
    Returns user profile and workspace configuration.
    """
    data = get_user_data(email)
    return {
        "user": {
            "name": data["name"],
            "email": data["email"],
            "title": data["title"],
            "organization": data["organization"],
            "is_demo": data["is_demo"],
            "schedule": data.get("schedule", []),
            "commitments_count": len(data.get("schedule", []))
        }
    }

# -------------------------------------------------------------
# Alexa+ Voice & Multimodal Frontend Endpoints
# -------------------------------------------------------------

@app.post("/api/chat")
async def alexa_chat_endpoint(payload: Dict[str, Any]):
    """
    Primary conversational endpoint for the Echo Show Simulator.
    Processes user voice input via the Amazon Bedrock Orchestrator.
    """
    user_query = (payload.get("query") or payload.get("prompt") or payload.get("message") or "").strip()
    user_email = payload.get("user_email") or payload.get("email")
    if not user_query:
        raise HTTPException(status_code=400, detail="Query cannot be empty.")
    
    # Extract client location / geolocation telemetry
    client_location = None
    if payload.get("latitude") is not None and payload.get("longitude") is not None:
        client_location = {
            "latitude": payload.get("latitude"),
            "longitude": payload.get("longitude"),
            "city": payload.get("city"),
            "timezone": payload.get("timezone")
        }
    elif payload.get("city") or payload.get("timezone"):
        client_location = {
            "city": payload.get("city"),
            "timezone": payload.get("timezone")
        }

    result = bedrock_orchestrator_instance.execute_agent_turn(user_query, user_email=user_email, client_location=client_location)
    return result

@app.post("/api/schedule/delete")
async def delete_schedule_item_endpoint(payload: Dict[str, Any]):
    """
    Deletes a schedule commitment for the authenticated user.
    Requires item_id or title. Enforces cross-confirmation on client.
    """
    user_email = payload.get("user_email") or payload.get("email")
    item_id = payload.get("item_id") or payload.get("id")
    title = payload.get("title")

    if not item_id and not title:
        raise HTTPException(status_code=400, detail="Either item_id or title is required.")

    deleted = delete_user_schedule_item(user_email, item_id=item_id, title_match=title)
    if not deleted:
        raise HTTPException(status_code=404, detail="Schedule commitment not found.")

    user_data = get_user_data(user_email)
    remaining = user_data.get("schedule", [])
    return {
        "success": True,
        "deleted_item": deleted,
        "remaining_schedule": remaining,
        "commitments_count": len(remaining)
    }

@app.post("/api/confirm")
async def alexa_confirm_endpoint(payload: Dict[str, Any]):
    """
    Executes or rejects a pending high-stakes executive action.
    """
    token = payload.get("action_token")
    decision = payload.get("decision", "APPROVED")

    if not token:
        raise HTTPException(status_code=400, detail="action_token is required.")

    exec_result = mcp_server_instance.execute_tool("execute_confirmed_action", {
        "action_token": token,
        "executive_decision": decision
    })
    
    parsed = json.loads(exec_result["content"][0]["text"])

    user_email = payload.get("user_email") or payload.get("email")
    user_data = get_user_data(user_email)
    remaining = user_data.get("schedule", [])

    return {
        "status": "success",
        "decision": decision,
        "receipt": parsed,
        "remaining_schedule": remaining,
        "commitments_count": len(remaining)
    }

@app.get("/api/health")
async def gateway_health():
    """Returns gateway health status."""
    return {"status": "HEALTHY", "service": "ChronoOS", "version": "1.0.0"}

@app.get("/api/status")
async def gateway_status():
    """Returns runtime telemetry for the hackathon showcase."""
    from mock_executive_data import CALENDAR_SCHEDULE, COMMUNICATIONS_FEED
    return {
        "service": "ChronoOS Alexa Executive MCP Hub",
        "version": "1.0.0",
        "mcp_tools_registered": len(CHRONOS_MCP_TOOLS),
        "bedrock_model": os.getenv("BEDROCK_MODEL_ID", "anthropic.claude-3-5-sonnet-20241022-v2:0"),
        "active_calendar_items": len(CALENDAR_SCHEDULE),
        "unread_communications": len(COMMUNICATIONS_FEED),
        "status": "HEALTHY_ONLINE"
    }

# Mount static frontend
frontend_dir = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.exists(frontend_dir):
    app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
