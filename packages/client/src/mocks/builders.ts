import { faker } from "@faker-js/faker";

export function buildeType(type: "tcp" | "udp" | "http" | "https" | "tcpmux" | "stcp" | "sudp" | "xtcp") {
  if (type === "tcp" || type === "udp") {
    return {
      remotePort: faker.helpers.maybe(() => faker.internet.port(), { probability: 0.5 }),
    };
  }

  if (type === "http") {
    return {
      locations: faker.helpers.maybe(() =>
        faker.helpers.multiple(
          () => faker.string.alpha({ length: { min: 1, max: 10 } }),
          { count: { min: 1, max: 5 } },
        ), { probability: 0.5 }),
      httpUser: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      httpPassword: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      requestHeaders: faker.helpers.maybe(() => ({
        set: Object.fromEntries(
          faker.helpers.multiple(
            () => faker.helpers.multiple(
              () => faker.string.alpha({ length: { min: 1, max: 10 } }),
              { count: 2 },
            ),
            { count: { min: 1, max: 5 } },
          ),
        ),
      }), { probability: 0.5 }),
      responseHeaders: faker.helpers.maybe(() => ({
        set: Object.fromEntries(
          faker.helpers.multiple(
            () => faker.helpers.multiple(
              () => faker.string.alpha({ length: { min: 1, max: 10 } }),
              { count: 2 },
            ),
            { count: { min: 1, max: 5 } },
          ),
        ),
      }), { probability: 0.5 }),
      routeByHTTPUser: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      customDomains: faker.helpers.maybe(() =>
        faker.helpers.multiple(
          () => faker.string.alpha({ length: { min: 1, max: 10 } }),
          { count: { min: 1, max: 5 } },
        ), { probability: 0.5 }),
      subdomain: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
    };
  }

  if (type === "https") {
    return {
      customDomains: faker.helpers.maybe(() =>
        faker.helpers.multiple(
          () => faker.string.alpha({ length: { min: 1, max: 10 } }),
          { count: { min: 1, max: 5 } },
        ), { probability: 0.5 }),
      subdomain: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
    };
  }

  if (type === "tcpmux") {
    return {
      httpUser: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      httpPassword: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      routeByHTTPUser: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      multiplexer: faker.helpers.maybe(() => faker.helpers.arrayElement(["httpconnect"]), { probability: 0.5 }),
    };
  }

  if (type === "stcp" || type === "sudp" || type === "xtcp") {
    return {
      secretKey: faker.helpers.maybe(() => faker.string.alpha({ length: { min: 1, max: 10 } }), { probability: 0.5 }),
      allowUsers: faker.helpers.maybe(() =>
        faker.helpers.multiple(
          () => faker.string.alpha({ length: { min: 1, max: 10 } }),
          { count: { min: 1, max: 5 } },
        ), { probability: 0.5 }),
    };
  }

  return {};
}
