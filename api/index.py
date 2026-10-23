"""
Vercel Serverless Entrypoint for ChronoOS
Redirects / mounts the FastAPI application gateway for Vercel edge deployment.
"""

import os
import sys

# Add repository root to sys.path
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root_dir not in sys.path:
    sys.path.insert(0, root_dir)

# Ensure backend directory is also on sys.path
backend_dir = os.path.join(root_dir, "backend")
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from backend.api_gateway import app
