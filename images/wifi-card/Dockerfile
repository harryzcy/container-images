FROM node:22.19.0-bookworm@sha256:6fe286835c595e53cdafc4889e9eff903dd3008a3050c1675809148d8e0df805 AS build

RUN apt-get update && apt-get install -y git
RUN git clone --depth 1 https://github.com/bndw/wifi-card.git

WORKDIR /wifi-card
RUN git checkout fbde2cd27669ac29e1c0bc9393f9a83ffa93f8c6 && \
  yarn && yarn build

FROM nginx:1.29.1@sha256:33e0bbc7ca9ecf108140af6288c7c9d1ecc77548cbfd3952fd8466a75edefe57
COPY --from=build /wifi-card/build /usr/share/nginx/html
