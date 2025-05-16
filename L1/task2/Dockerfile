FROM tensorflow/tensorflow
WORKDIR /app
COPY . .
RUN pip install --upgrade pip
RUN pip install fastapi pillow uvicorn numpy python-multipart tensorflow-cpu
EXPOSE 3000
CMD ["uvicorn", "--host", "0.0.0.0", "--port", "3000", "server:app"]
