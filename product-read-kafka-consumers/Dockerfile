FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

ENV PYTHONPATH=/app

CMD ["sh", "-c", "python app/consumers/product_consumer.py & python app/consumers/inventory_consumer.py & wait"]

