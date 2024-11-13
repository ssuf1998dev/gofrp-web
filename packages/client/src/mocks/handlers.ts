import { faker } from "@faker-js/faker";
import { differenceBy, transform } from "lodash-es";
import { delay, http, HttpResponse } from "msw";
import * as TOML from "smol-toml";

import db from "./db";

const handlers = [
  http.get("/api/status", async () => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    return HttpResponse.json(db.status);
  }),
  http.get("/api/config", async () => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    return HttpResponse.text(TOML.stringify(db.db));
  }),
  http.put("/api/config", async ({ request }) => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    const parsed = TOML.parse(await request.text()) as any;
    const deletedProxies = differenceBy(db.db.proxies, parsed.proxies, "name").map(({ name }) => name);
    db.db = parsed;
    db.status = transform(db.status, (acc: Record<string, any[]>, curr, key) => {
      acc[key] = curr.filter(({ name }) => !deletedProxies.includes(name));
    }, {});

    return HttpResponse.json(undefined, { status: 200 });
  }),
];

export default handlers;
