# set base image (host OS)
FROM python:3.8

RUN rm /bin/sh && ln -s /bin/bash /bin/sh

RUN apt-get -y update && apt-get install -y curl nano wget nginx git

# Install nvm
RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.39.3/install.sh | bash
RUN source ~/.nvm/nvm.sh && nvm install 14 && nvm use 14 && npm install --global yarn

# MongoDB
# RUN ln -s /bin/echo /bin/systemctl
RUN apt install software-properties-common gnupg apt-transport-https ca-certificates -y
RUN curl -fsSL https://pgp.mongodb.com/server-7.0.asc | gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
RUN echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-7.0.list
RUN apt update -y && apt install mongodb-org -y

ENV ENV_TYPE staging
ENV MONGO_HOST mongo
ENV MONGO_PORT 27017
#########

ENV PYTHONPATH=$PYTHONPATH:/src/

# copy the dependencies file to the working directory
COPY src/requirements.txt .

# install dependencies
RUN pip install -r requirements.txt
