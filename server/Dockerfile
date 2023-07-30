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

ARG SUPERUSER_USERNAME=admin
ARG SUPERUSER_PASSWORD=admin
ARG SUPERUSER_EMAIL=cheese@mail.com

# Copy the setup.sh file into the container
COPY setup.sh /setup.sh

# Make the script executable
RUN chmod +x /setup.sh

# Execute the setup.sh script as the entrypoint
ENTRYPOINT ["/setup.sh"]
