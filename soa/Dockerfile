FROM ubuntu:bionic
LABEL maintainer="edward@nygma.com"

# getting last software catalog
RUN apt-get update --fix-missing

# Minimal deb packages required
RUN apt-get install -y --no-install-recommends nginx build-essential \
    python3-wheel python3-setuptools python3-pip python3-dev python3-venv\
    postgresql-client libpq-dev

# Remove downloaded .debs from cache
RUN apt-get clean

# no longer needed list of packages
RUN rm -rf /var/lib/apt/lists/*

# replacement for default site enabled on distro
RUN rm /etc/nginx/sites-enabled/default
COPY ./nginx_site /etc/nginx/sites-enabled/default

RUN mkdir -p /root/resources/files; chmod 777 /root/resources/files

ENV APP_DIR=/app
COPY service $APP_DIR
WORKDIR $APP_DIR

RUN pip3 install -r requirements.txt

EXPOSE 80 443

CMD ["/app/docker-entrypoint.sh"]