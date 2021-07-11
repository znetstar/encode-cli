FROM node:14-slim

WORKDIR "/app"

ADD ./package.json /app/package.json

ADD ./package-lock.json /app/package-lock.json

RUN cd /app && npm ci

ADD . /app

RUN npm run prepack && \
    ln -sv /app/bin/run /usr/local/bin/encli && \
    ln -sv /app/bin/run /usr/local/bin/encode-cli && \
    chmod +x /app/bin/run

ENV PATH "$PATH:/app/node_modules/.bin"

ENTRYPOINT [ "/usr/local/bin/encli" ]
