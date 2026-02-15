FROM python:3.10-slim

WORKDIR /app

# Update pip first
RUN pip install --upgrade pip

# Copy and install requirements
COPY backend/requirements.txt .
RUN cat requirements.txt && pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY backend/ .

# Railway uses PORT env variable
ENV PORT=8000
EXPOSE 8000

# Start command
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port $PORT"]
