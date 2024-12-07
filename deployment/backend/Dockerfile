FROM python:3.10-slim

WORKDIR /backend

COPY requirements.txt /backend

RUN python -m pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

COPY . /backend

# ENV TRANSFORMERS_CACHE="./transformers_cache"

EXPOSE 8000

CMD ["bash", "run.sh"]