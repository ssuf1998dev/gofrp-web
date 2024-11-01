import { faker } from "@faker-js/faker";
import { delay, http, HttpResponse } from "msw";

const db = {
  status: {
    https: faker.helpers.multiple(() => {
      const status = faker.helpers.arrayElement(["new", "wait start", "start error", "running", "check failed", "closed"]);
      return {
        name: faker.string.alpha({ length: { min: 0, max: 10 } }),
        type: faker.string.alpha(3),
        status,
        local_addr: faker.internet.url(),
        remote_addr: faker.internet.url(),
        plugin: faker.string.alpha(10),
        err: ["start error", "check failed"].includes(status) ? faker.lorem.sentence() : undefined,
      };
    }, { count: { min: 10, max: 35 } }),
  },
};

const handlers = [
  http.get("/api/status", async () => {
    await delay(faker.number.int({ min: 100, max: 1000 }));
    return HttpResponse.json(db.status);
  }),
];

export default handlers;
