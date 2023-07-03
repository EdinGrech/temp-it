# Use an official Python runtime as the base image
FROM python:3.9

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Install dependencies
RUN pip install --upgrade pip
COPY requirements.txt .
RUN pip install -r requirements.txt

# Set the working directory in the container
WORKDIR /app

# Copy the Django project code into the container
COPY . /app

# Expose the port on which Django runs
EXPOSE 8000

# Create and run a shell script for migrations and server start
RUN echo "#!/bin/sh\npython manage.py makemigrations\npython manage.py migrate\npython manage.py runserver 0.0.0.0:8000" > /entrypoint.sh
RUN chmod +x /entrypoint.sh
CMD ["/entrypoint.sh"]
