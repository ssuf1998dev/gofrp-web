import { faker } from "@faker-js/faker";
import { delay, http, HttpResponse } from "msw";
import * as TOML from "smol-toml";

import db, { status } from "./db";

const handlers = [
  http.get("/api/status", async () => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    return HttpResponse.json(status);
  }),
  http.get("/api/config", async () => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    return HttpResponse.text(TOML.stringify(db));
  }),
];

export default handlers;
