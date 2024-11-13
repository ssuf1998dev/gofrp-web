import { faker } from "@faker-js/faker";

export const buildString = (probability: number = 1) => faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability });
export function buildStrings(probability: number = 1) {
  return faker.helpers.maybe(() =>
    faker.helpers.multiple(() => buildString(), { count: { min: 1, max: 5 } }), { probability });
}
export function buildObject() {
  return Object.fromEntries(
    faker.helpers.multiple(
      () => faker.helpers.multiple(() => buildString(), { count: 2 }),
      { count: { min: 1, max: 5 } },
    ),
  );
}

export function buildeType(type: "tcp" | "udp" | "http" | "https" | "tcpmux" | "stcp" | "sudp" | "xtcp") {
  if (type === "tcp" || type === "udp") {
    return {
      remotePort: faker.helpers.maybe(() => faker.internet.port(), { probability: 0.5 }),
    };
  }

  if (type === "http") {
    return {
      locations: buildStrings(0.5),
      httpUser: buildString(0.5),
      httpPassword: buildString(0.5),
      requestHeaders: faker.helpers.maybe(() => ({ set: buildObject() }), { probability: 0.5 }),
      responseHeaders: faker.helpers.maybe(() => ({ set: buildObject() }), { probability: 0.5 }),
      routeByHTTPUser: buildString(0.5),
      customDomains: buildStrings(0.5),
      subdomain: buildString(0.5),
    };
  }

  if (type === "https") {
    return {
      customDomains: buildStrings(0.5),
      subdomain: buildString(0.5),
    };
  }

  if (type === "tcpmux") {
    return {
      httpUser: buildString(0.5),
      httpPassword: buildString(0.5),
      routeByHTTPUser: buildString(0.5),
      multiplexer: faker.helpers.maybe(() => faker.helpers.arrayElement(["httpconnect"]), { probability: 0.5 }),
    };
  }

  if (type === "stcp" || type === "sudp" || type === "xtcp") {
    return {
      secretKey: buildString(0.5),
      allowUsers: buildStrings(0.5),
    };
  }

  return {};
}

export function buildePlugin(type: "http_proxy" | "socks5" | "static_file" | "unix_domain_socket" | "http2https" | "https2http" | "https2https" | "tls2raw") {
  if (type === "http_proxy") {
    return { type, httpUser: buildString(0.5), httpPassword: buildString(0.5) };
  }

  if (type === "socks5") {
    return { type, username: buildString(0.5), password: buildString(0.5) };
  }

  if (type === "static_file") {
    return {
      type,
      localPath: buildString(),
      stripPrefix: buildString(0.5),
      httpUser: buildString(0.5),
      httpPassword: buildString(0.5),
    };
  }

  if (type === "unix_domain_socket") {
    return { type, unixPath: buildString() };
  }

  if (type === "http2https") {
    return {
      type,
      localAddr: faker.internet.url(),
      hostHeaderRewrite: buildString(0.5),
      requestHeaders: faker.helpers.maybe(() => ({ set: buildObject() }), { probability: 0.5 }),
    };
  }

  if (type === "https2http" || type === "https2https") {
    return {
      type,
      localAddr: faker.internet.url(),
      hostHeaderRewrite: buildString(0.5),
      requestHeaders: faker.helpers.maybe(() => ({ set: buildObject() }), { probability: 0.5 }),
      enableHTTP2: faker.helpers.maybe(() => faker.datatype.boolean(0.5), { probability: 0.5 }),
      crtPath: buildString(0.5),
      keyPath: buildString(0.5),
    };
  }

  if (type === "tls2raw") {
    return {
      type,
      localAddr: faker.internet.url(),
      crtPath: buildString(0.5),
      keyPath: buildString(0.5),
    };
  }

  return { type };
}
