import { faker } from "@faker-js/faker";
import { http, HttpResponse } from "msw";

const db = {
  status: {
    https: faker.helpers.multiple(() => ({
      name: faker.string.alpha(10),
      type: faker.string.alpha(3),
      status: faker.helpers.arrayElement(["running"]),
      local_addr: faker.internet.url(),
      remote_addr: faker.internet.url(),
    }), { count: 10 }),
  },
};

const handlers = [
  http.get("/api/status", () => HttpResponse.json(db.status)),
];

export default handlers;
