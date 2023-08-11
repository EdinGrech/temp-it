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

ENV SUPERUSER_USERNAME=admin
ENV SUPERUSER_PASSWORD=admin
ENV SUPERUSER_EMAIL=cheese@mail.com

RUN apt-get update && apt-get install -y dos2unix
# Copy the setup.sh file into the container
COPY setup.sh /setup.sh

# Convert the file format from Windows to Linux
RUN dos2unix /setup.sh

# Make the script executable
RUN chmod +x /setup.sh

# Execute the setup.sh script as the entrypoint
ENTRYPOINT ["/bin/sh","/setup.sh"]
