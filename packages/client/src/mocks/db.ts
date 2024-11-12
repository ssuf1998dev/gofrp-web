import { faker } from "@faker-js/faker";
import { cloneDeep, pick } from "lodash-es";

import { buildeType } from "./builders";

const db = {
  proxies: faker.helpers.multiple(() => {
    const type = faker.helpers.arrayElement(["tcp", "udp", "http", "https", "tcpmux", "stcp", "sudp", "xtcp"]);
    const plugin = faker.helpers.arrayElement(["", "http_proxy", "socks5", "static_file", "unix_domain_socket", "http2https", "https2http", "https2https", "tls2raw"]);
    const transport = faker.helpers.maybe(() => ({
      useEncryption: faker.helpers.maybe(() => faker.datatype.boolean(0.5), { probability: 0.8 }),
      useCompression: faker.helpers.maybe(() => faker.datatype.boolean(0.5), { probability: 0.8 }),
      bandwidthLimit: faker.helpers.maybe(() => {
        return `${faker.number.int(100)}${faker.helpers.arrayElement(["KB", "MB"])}`;
      }, { probability: 0.8 }),
      bandwidthLimitMode: faker.helpers.arrayElement(["client", "server"]),
      proxyProtocolVersion: faker.helpers.arrayElement(["client", "server"]),
    }), { probability: 0.8 });
    const loadBalancer = faker.helpers.maybe(() => ({
      group: faker.string.alpha({ length: { min: 1, max: 10 } }),
      groupKey: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.8 }),
    }), { probability: 0.8 });
    const healthCheck = faker.helpers.maybe(() => ({
      type: faker.helpers.arrayElement(["tcp", "http"]),
      timeoutSeconds: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      maxFailed: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      intervalSeconds: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      path: faker.string.alpha({ length: { min: 1, max: 10 } }),
      httpHeaders: faker.helpers.maybe(() => Object.fromEntries(
        faker.helpers.multiple(
          () => faker.helpers.multiple(
            () => faker.string.alpha({ length: { min: 1, max: 10 } }),
            { count: 2 },
          ),
          { count: { min: 1, max: 5 } },
        ),
      ), { probability: 0.8 }),
    }), { probability: 0.8 });

    return {
      name: faker.string.alpha({ length: { min: 1, max: 10 } }),
      type,
      ...buildeType(type),
      localIP: faker.helpers.maybe(() => faker.internet.ipv4(), { probability: 0.8 }),
      localPort: faker.helpers.maybe(() => faker.internet.port(), { probability: 0.8 }),
      annotations: faker.helpers.maybe(() => Object.fromEntries(
        faker.helpers.multiple(
          () => faker.helpers.multiple(
            () => faker.string.alpha({ length: { min: 1, max: 10 } }),
            { count: 2 },
          ),
          { count: { min: 1, max: 5 } },
        ),
      ), { probability: 0.8 }),
      metadatas: faker.helpers.maybe(() => Object.fromEntries(
        faker.helpers.multiple(
          () => faker.helpers.multiple(
            () => faker.string.alpha({ length: { min: 1, max: 10 } }),
            { count: 2 },
          ),
          { count: { min: 1, max: 5 } },
        ),
      ), { probability: 0.8 }),
      plugin,
      transport,
      loadBalancer,
      healthCheck,
    };
  }, { count: { min: 10, max: 35 } }),
};

export const status = {
  ...db.proxies.reduce((map: Record<string, any[]>, proxy) => {
    const picked = cloneDeep(pick(proxy, ["name", "type", "plugin"]));
    const status = faker.helpers.arrayElement(["new", "wait start", "start error", "running", "check failed", "closed"]);
    Object.assign(picked, {
      status,
      local_addr: faker.internet.url(),
      remote_addr: faker.internet.url(),
      err: ["start error", "check failed"].includes(status) ? faker.lorem.sentence() : undefined,
    });
    (map[proxy.type] ??= []).push(picked);
    return map;
  }, {}),
};

export default db;
