import { faker } from "@faker-js/faker";
import { cloneDeep, pick } from "lodash-es";

import { buildePlugin, buildeType, buildObject, buildString, buildStrings } from "./builders";

const db = {
  proxies: faker.helpers.multiple(() => {
    const type = faker.helpers.arrayElement(["tcp", "udp", "http", "https", "tcpmux", "stcp", "sudp", "xtcp"]);
    const plugin = faker.helpers.arrayElement([undefined, "http_proxy", "socks5", "static_file", "unix_domain_socket", "http2https", "https2http", "https2https", "tls2raw"]);
    const transport = faker.helpers.maybe(() => ({
      useEncryption: faker.helpers.maybe(() => faker.datatype.boolean(0.5), { probability: 0.8 }),
      useCompression: faker.helpers.maybe(() => faker.datatype.boolean(0.5), { probability: 0.8 }),
      bandwidthLimit: faker.helpers.maybe(() => {
        return `${faker.number.int(100)}${faker.helpers.arrayElement(["KB", "MB"])}`;
      }, { probability: 0.8 }),
      bandwidthLimitMode: faker.helpers.arrayElement(["client", "server"]),
      proxyProtocolVersion: faker.helpers.arrayElement(["v1", "v2"]),
    }), { probability: 0.8 });
    const loadBalancer = faker.helpers.maybe(() => ({
      group: buildString(),
      groupKey: buildString(0.8),
    }), { probability: 0.8 });
    const healthCheck = faker.helpers.maybe(() => ({
      type: faker.helpers.arrayElement(["tcp", "http"]),
      timeoutSeconds: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      maxFailed: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      intervalSeconds: faker.helpers.maybe(() => faker.number.int(100), { probability: 0.8 }),
      path: buildString(),
      httpHeaders: faker.helpers.maybe(() => faker.helpers.multiple(() => ({
        name: buildString(),
        value: buildString(),
      })), { probability: 0.8 }),
    }), { probability: 0.8 });

    return {
      name: buildString(),
      type,
      ...buildeType(type),
      localIP: faker.helpers.maybe(() => faker.internet.ipv4(), { probability: 0.8 }),
      localPort: faker.helpers.maybe(() => faker.internet.port(), { probability: 0.8 }),
      annotations: faker.helpers.maybe(() => buildObject(), { probability: 0.8 }),
      metadatas: faker.helpers.maybe(() => buildObject(), { probability: 0.8 }),
      plugin: plugin && buildePlugin(plugin),
      transport,
      loadBalancer,
      healthCheck,
    };
  }, { count: { min: 10, max: 35 } }),
  user: buildString(0.8),
  serverAddr: faker.helpers.maybe(() => faker.internet.ipv4(), { probability: 0.8 }),
  serverPort: faker.helpers.maybe(() => faker.internet.port(), { probability: 0.8 }),
  natHoleStunServer: faker.helpers.maybe(() => faker.internet.ipv4(), { probability: 0.8 }),
  dnsServer: faker.helpers.maybe(() => faker.internet.ipv4(), { probability: 0.8 }),
  loginFailExit: faker.helpers.maybe(() => faker.datatype.boolean(), { probability: 0.8 }),
  start: buildStrings(0.8),
  udpPacketSize: faker.helpers.maybe(() => faker.number.int({ min: 1, max: 10000 }), { probability: 0.8 }),
  metadatas: faker.helpers.maybe(() => buildObject(), { probability: 0.8 }),
  includes: buildStrings(0.8),
};

const status = {
  ...db.proxies.reduce((map: Record<string, any[]>, proxy) => {
    const picked = cloneDeep(pick(proxy, ["name", "type", "plugin"]));
    const status = faker.helpers.arrayElement(["new", "wait start", "start error", "running", "check failed", "closed"]);
    Object.assign(picked, {
      status,
      local_addr: faker.internet.url(),
      remote_addr: faker.internet.url(),
      err: ["start error", "check failed"].includes(status) ? faker.lorem.sentence() : undefined,
      plugin: picked.plugin?.type,
    });
    (map[proxy.type] ??= []).push(picked);
    return map;
  }, {}),
};

export default { db, status };
