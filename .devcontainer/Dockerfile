FROM mcr.microsoft.com/devcontainers/typescript-node:1-22-bookworm

RUN apt-get update && apt-get install gnupg2 -y

RUN corepack enable

RUN git config --global --add safe.directory /workspaces/* && \
    git config --global pull.rebase true && \
    git config --global core.autocrlf input && \
    git config --global push.autoSetupRemote true && \
    git config --global gpg.format ssh && \
    git config --global commit.gpgsign true 
