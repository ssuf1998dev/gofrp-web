import { faker } from "@faker-js/faker";
import { delay, http, HttpResponse } from "msw";

const db = {
  status: {
    https: faker.helpers.multiple(() => {
      const status = faker.helpers.arrayElement(["new", "wait start", "start error", "running", "check failed", "closed"]);
      const type = faker.helpers.arrayElement(["tcp", "udp", "http", "https", "tcpmux", "stcp", "sudp", "xtcp"]);
      const plugin = faker.helpers.arrayElement(["", "http_proxy", "socks5", "static_file", "unix_domain_socket", "http2https", " https2http", "https2https", "tls2raw"]);
      return {
        name: faker.string.alpha({ length: { min: 1, max: 10 } }),
        type,
        status,
        local_addr: faker.internet.url(),
        remote_addr: faker.internet.url(),
        plugin,
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
