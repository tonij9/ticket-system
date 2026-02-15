FROM python:3.10-slim

WORKDIR /app

# Copy backend files
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

# Railway uses PORT env variable
ENV PORT=8000
EXPOSE 8000

# Start command using shell form to expand $PORT
CMD uvicorn main:app --host 0.0.0.0 --port $PORT
