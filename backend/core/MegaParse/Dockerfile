# Using a slim version for a smaller base image
FROM python:3.12.5-slim-bullseye@sha256:cf26ec2ab19cd38e57658f28f616050f854bf9d19d7530574aed86918e4d2ccd

# Install GEOS library, Rust, and other dependencies, then clean up
RUN apt-get clean && apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr 

WORKDIR /code

# Upgrade pip and install dependencies
RUN pip install megaparse

# You can run the application with the following command:
# docker run -it megaparse_image python your_script.py

