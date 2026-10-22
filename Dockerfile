FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY README.md .

EXPOSE 8000

ENV HOST=0.0.0.0
ENV PORT=8000

# Start ChronoOS API Gateway & Static Frontend
CMD ["uvicorn", "backend.api_gateway:app", "--host", "0.0.0.0", "--port", "8000"]
