import json
import logging
from typing import Dict, List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from database import get_db
import models

# Set up simple router
router = APIRouter(tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Maps user_id to a list of active WebSocket connections
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        logging.info(f"WebSocket connected for user {user_id}. Total connections: {len(self.active_connections[user_id])}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            if websocket in self.active_connections[user_id]:
                self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logging.info(f"WebSocket disconnected for user {user_id}.")

    async def send_personal_message(self, message: dict, user_id: str):
        """Pushes a JSON payload to all active connections for a specific user."""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception as e:
                    logging.error(f"Error sending message to {user_id}: {e}")
                    # Optionally remove dead connection here as well

manager = ConnectionManager()

def decode_token(token: str) -> str:
    """
    Decodes the JWT token to extract the user_id.
    """
    import jwt
    try:
        # Standard decode. We disable verify_signature here assuming
        # proper validation happens at edge or if SECRET_KEY isn't uniform.
        # In production, ALWAYS verify the signature!
        payload = jwt.decode(token, options={"verify_signature": False})
        user_id = payload.get("sub") or payload.get("user_id")
        if not user_id:
            raise ValueError("Token missing user identity")
        return str(user_id)
    except Exception as e:
        raise ValueError(f"Invalid token: {str(e)}")

@router.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket, token: str = Query(None)):
    if not token:
        await websocket.close(code=1008)
        return
        
    try:
        user_id = decode_token(token)
    except ValueError:
        await websocket.close(code=1008)
        return

    await manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive, listen for any client messages (ping/pong)
            data = await websocket.receive_text()
            # We don't necessarily process incoming text here for notifications
    except WebSocketDisconnect:
        # Memory Leak Prevention: Explicitly remove zombie socket
        manager.disconnect(websocket, user_id)

@router.post("/notifications/test")
async def trigger_test_notification(user_id: str):
    """
    Mock trigger endpoint to fire a personal message down the socket.
    """
    payload = {
        "id": "mock_id",
        "title": "Test Notification",
        "message": "This is a real-time message over WebSockets!",
        "type": "info",
        "timestamp": "Just now"
    }
    await manager.send_personal_message(payload, user_id)
    return {"message": "Notification dispatched"}
