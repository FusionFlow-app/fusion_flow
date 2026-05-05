ARG ELIXIR_VERSION=1.15.7
ARG OTP_VERSION=26.1.2
ARG DEBIAN_VERSION=bullseye-20231009-slim

ARG BUILDER_IMAGE="hexpm/elixir:${ELIXIR_VERSION}-erlang-${OTP_VERSION}-debian-${DEBIAN_VERSION}"
ARG RUNNER_IMAGE="debian:${DEBIAN_VERSION}"

FROM ${BUILDER_IMAGE} AS builder

RUN apt-get update -y && apt-get install -y build-essential git curl \
    && apt-get clean && rm -f /var/lib/apt/lists/*_*

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV="prod"

COPY mix.exs mix.lock ./
COPY apps/fusion_flow_core/mix.exs apps/fusion_flow_core/mix.exs
COPY apps/fusion_flow_nodes/mix.exs apps/fusion_flow_nodes/mix.exs
COPY apps/fusion_flow_runtime/mix.exs apps/fusion_flow_runtime/mix.exs
COPY apps/fusion_flow_ui/mix.exs apps/fusion_flow_ui/mix.exs
COPY apps/fusion_flow_worker/mix.exs apps/fusion_flow_worker/mix.exs

RUN mix deps.get --only prod
RUN mix deps.compile

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

COPY apps/fusion_flow_ui/assets apps/fusion_flow_ui/assets
RUN cd apps/fusion_flow_ui/assets && npm install

COPY config config
COPY apps apps
COPY scripts scripts

RUN mix assets.setup
RUN mix assets.deploy
RUN mix compile
RUN mix release fusion_flow_ui
RUN mix release fusion_flow_worker

FROM ${RUNNER_IMAGE}

RUN apt-get update -y && apt-get install -y bash libstdc++6 openssl libncurses5 locales python3 ca-certificates \
  && apt-get clean && rm -f /var/lib/apt/lists/*_*

RUN sed -i '/en_US.UTF-8/s/^# //g' /etc/locale.gen && locale-gen

ENV LANG=en_US.UTF-8
ENV LANGUAGE=en_US:en
ENV LC_ALL=en_US.UTF-8
ENV MIX_ENV=prod
ENV PHX_SERVER=true
ENV HOME=/app

WORKDIR /app
RUN chown nobody /app

COPY --from=builder --chown=nobody:root /app/_build/prod/rel/fusion_flow_ui /app/ui
COPY --from=builder --chown=nobody:root /app/_build/prod/rel/fusion_flow_worker /app/worker
COPY scripts/entrypoint.sh /app/entrypoint.sh

RUN sed -i 's/\r$//' /app/entrypoint.sh && chmod +x /app/entrypoint.sh
RUN mkdir -p /app/.cache && chown -R nobody:root /app/.cache

USER nobody

EXPOSE 4000

ENTRYPOINT ["/app/entrypoint.sh"]
