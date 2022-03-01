FROM python:3.8-buster

RUN apt-get update && apt-get install -y

WORKDIR /usr/src

COPY ./mnistapp /usr/src/mnistapp
COPY ./requirements.txt /usr/src/requirements.txt
COPY ./.env /usr/src/.env

RUN pip install --upgrade pip

RUN pip install -r requirements.txt

RUN echo "building..."

EXPOSE 5000

CMD ["flask", "run", "-h", "0.0.0.0"]