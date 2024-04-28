FROM ollama/ollama

RUN ollama pull llama3

RUN ollama pull nomic-embed-text

ENTRYPOINT ["/bin/ollama"]

CMD ["serve"]