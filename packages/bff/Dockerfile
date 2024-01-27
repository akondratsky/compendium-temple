FROM compendium-base as bff-build
WORKDIR /app
RUN nx build bff


FROM compendium-nx
WORKDIR /app

COPY --from=bff-build /app/package.json .
COPY --from=bff-build /app/package-lock.json .
COPY --from=bff-build /app/dist/packages/bff/* .
RUN npm ci --omit=dev

ENTRYPOINT ["node", "main.js"]
