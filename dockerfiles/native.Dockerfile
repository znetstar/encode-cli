FROM ubuntu:20.10

RUN apt-get update && \
	apt-get -y -q install curl sudo software-properties-common && \
	bash -c 'curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -' && \
	apt-get update && \
	apt-get -y -q install \
    nodejs \
    build-essential \
    python3 \
    curl && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

WORKDIR "/app"

ADD ./package.json /app/package.json

ADD ./package-lock.json /app/package-lock.json

RUN npm ci

ADD . /app

RUN npm run prepack && \
    ln -sv /app/bin/run /usr/local/bin/encli && \
    ln -sv /app/bin/run /usr/local/bin/encode-cli && \
    chmod +x /app/bin/run && \
    encli plugins:install encode-cli-native

ENV PATH "$PATH:/app/node_modules/.bin"

ENTRYPOINT [ "/usr/local/bin/encli" ]
