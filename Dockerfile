FROM python:3.10-slim

# Cache bust - change this to force rebuild
ARG CACHEBUST=2

WORKDIR /app

# Update pip first
RUN pip install --upgrade pip

# Copy and install requirements - only 7 packages needed
COPY backend/requirements-prod.txt ./requirements.txt
RUN echo "=== REQUIREMENTS.TXT CONTENTS ===" && cat requirements.txt && echo "=== END ===" && pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Railway uses PORT env variable
ENV PORT=8000
EXPOSE 8000

# Start command
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
