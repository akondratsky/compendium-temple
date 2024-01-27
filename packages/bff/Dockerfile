FROM compendium-base as bff-build
WORKDIR /app
RUN nx build bff


FROM compendium-nx
WORKDIR /app

COPY --from=bff-build /app/package.json .
COPY --from=bff-build /app/package-lock.json .
COPY --from=bff-build /app/dist/packages/bff/* .

RUN npm ci --omit=dev

# prisma client
COPY --from=bff-build /app/node_modules/.prisma ./node_modules/.prisma

ENTRYPOINT ["node", "main.js"]
