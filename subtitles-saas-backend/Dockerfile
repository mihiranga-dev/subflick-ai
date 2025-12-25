# Use Python 3.9
FROM python:3.9

# Set working directory
WORKDIR /code

# Copy requirements first (to cache dependencies)
COPY ./requirements.txt /code/requirements.txt

# Install dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the rest of the application
COPY . /code

# Create the temp folder
RUN mkdir -p /code/temp_uploads && chmod 777 /code/temp_uploads

# Start the app on port 7860 (Hugging Face's default port)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]