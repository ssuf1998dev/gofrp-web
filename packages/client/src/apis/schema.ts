import { z } from "zod";

import { proxyStatus } from "./endpoints";

export const proxyPluginSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("") }),
  z.object({
    type: z.literal("http_proxy"),
    httpUser: z.string().nullish(),
    httpPassword: z.string().nullish(),
  }),
  z.object({
    type: z.literal("socks5"),
    username: z.string().nullish(),
    password: z.string().nullish(),
  }),
  z.object({
    type: z.literal("static_file"),
    localPath: z.string().min(1),
    stripPrefix: z.string().nullish(),
    httpUser: z.string().nullish(),
    httpPassword: z.string().nullish(),
  }),
  z.object({
    type: z.literal("unix_domain_socket"),
    unixPath: z.string().min(1),
  }),
  z.object({
    type: z.literal("http2https"),
    localAddr: z.string().min(1).url(),
    hostHeaderRewrite: z.string().nullish(),
    requestHeaders: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? { set: Object.fromEntries(value.filter(([key]) => !!key)) } as any : [];
      })
      .nullish(),
  }),
  z.object({
    type: z.literal("https2http"),
    localAddr: z.string().min(1).url(),
    hostHeaderRewrite: z.string().nullish(),
    requestHeaders: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? { set: Object.fromEntries(value.filter(([key]) => !!key)) } as any : [];
      })
      .nullish(),
    enableHTTP2: z.boolean().nullish(),
    crtPath: z.string().nullish(),
    keyPath: z.string().nullish(),
  }),
  z.object({
    type: z.literal("https2https"),
    localAddr: z.string().min(1).url(),
    hostHeaderRewrite: z.string().nullish(),
    requestHeaders: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? { set: Object.fromEntries(value.filter(([key]) => !!key)) } as any : [];
      })
      .nullish(),
    enableHTTP2: z.boolean().nullish(),
    crtPath: z.string().nullish(),
    keyPath: z.string().nullish(),
  }),
  z.object({
    type: z.literal("tls2raw"),
    localAddr: z.string().min(1).url(),
    crtPath: z.string().nullish(),
    keyPath: z.string().nullish(),
  }),
]);

const baseProxySchema = proxyStatus.pick({ name: true }).and(
  z.object({
    localIP: z.string().ip().nullish(),
    localPort: z.number().min(0).max(65535).nullish(),
    annotations: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? Object.fromEntries(value.filter(([key]) => !!key)) : [];
      })
      .nullish(),
    metadatas: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? Object.fromEntries(value.filter(([key]) => !!key)) : [];
      })
      .nullish(),
    plugin: proxyPluginSchema.transform(value => !value.type ? undefined : value).nullish(),
    transport: z.object({
      useEncryption: z.boolean(),
      useCompression: z.boolean(),
      bandwidthLimit: z.object({ value: z.number(), unit: z.enum(["KiB", "MiB"]) })
        .transform<string>((value) => {
          return value && `${value.value}${{ KiB: "KB", MiB: "MB" }[value.unit]}`;
        }),
      bandwidthLimitMode: z.enum(["client", "server"]),
      proxyProtocolVersion: z.enum(["v1", "v2"]),
    }).partial().nullish(),
    loadBalancer: z.object({
      group: z.string().min(1),
      groupKey: z.string().nullish(),
    }).nullish(),
    healthCheck: z.object({
      type: z.enum(["tcp", "http"]),
      timeoutSeconds: z.number().nullish(),
      maxFailed: z.number().nullish(),
      intervalSeconds: z.number().nullish(),
      path: z.string(),
      httpHeaders: z
        .array(z.array(z.string()))
        .transform<{ name: string; value: string }[]>((value) => {
          return value ? value.filter(([key]) => !!key).map(([name, value]) => ({ name, value })) : [];
        })
        .nullish(),
    }).nullish(),
  }),
);

export const proxySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("tcp"),
    remotePort: z.number().min(0).max(65535).nullish(),
  }),
  z.object({
    type: z.literal("udp"),
    remotePort: z.number().min(0).max(65535).nullish(),
  }),
  z.object({
    type: z.literal("http"),
    locations: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
    httpUser: z.string().nullish(),
    httpPassword: z.string().nullish(),
    requestHeaders: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? { set: Object.fromEntries(value.filter(([key]) => !!key)) } as any : [];
      })
      .nullish(),
    responseHeaders: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? { set: Object.fromEntries(value.filter(([key]) => !!key)) } as any : [];
      })
      .nullish(),
    routeByHTTPUser: z.string().nullish(),
    customDomains: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
    subdomain: z.string().nullish(),
  }),
  z.object({
    type: z.literal("https"),
    customDomains: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
    subdomain: z.string().nullish(),
  }),
  z.object({
    type: z.literal("tcpmux"),
    httpUser: z.string().nullish(),
    httpPassword: z.string().nullish(),
    routeByHTTPUser: z.string().nullish(),
    multiplexer: z.enum(["httpconnect"]).nullish(),
  }),
  z.object({
    type: z.literal("stcp"),
    secretKey: z.string().nullish(),
    allowUsers: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
  }),
  z.object({
    type: z.literal("sudp"),
    secretKey: z.string().nullish(),
    allowUsers: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
  }),
  z.object({
    type: z.literal("xtcp"),
    secretKey: z.string().nullish(),
    allowUsers: z.array(z.string()).transform<string[]>(value => (value ?? []).filter(Boolean)).nullish(),
  }),
], { errorMap: (issue, ctx) => {
  if (issue.path[0] === "type" && !ctx.data.type && issue.code === "invalid_union_discriminator") {
    return { message: "Required" };
  }
  return { message: issue.message || ctx.defaultError || issue.code };
} }).and(baseProxySchema);

export type ProxySchemaType = z.infer<typeof proxySchema>;

const configurationAuthSchema = z.object({
  method: z.string(),
  additionalScopes: z.enum(["HeartBeats", "NewWorkConns"]).array(),
  token: z.string(),
  oidc: z.object({
    clientID: z.string(),
    clientSecret: z.string(),
    audience: z.string(),
    scope: z.string(),
    tokenEndpointURL: z.string(),
    additionalEndpointParams: z
      .array(z.array(z.string()))
      .transform<string[][]>((value) => {
        return value ? Object.fromEntries(value.filter(([key]) => !!key)) : [];
      }),
  }).partial(),
}).partial();

const configurationLogSchema = z.object({
  to: z.string(),
  level: z.enum(["trace", "debug", "info", "warn", "error"]),
  maxDays: z.number(),
  disablePrintColor: z.boolean(),
}).partial();

const configurationWebServerSchema = z.object({
  addr: z.string().nullish(),
  port: z.number(),
  user: z.string().nullish(),
  password: z.string().nullish(),
  assetsDir: z.string().nullish(),
  pprofEnable: z.boolean().nullish(),
  tls: z.object({
    certFile: z.string(),
    keyFile: z.string(),
    trustedCaFile: z.string().nullish(),
    serverName: z.string().nullish(),
  }).nullish(),
});

const configurationTransportSchema = z.object({
  protocol: z.enum(["tcp", "kcp", "quic", "websocket", "wss"]),
  dialServerTimeout: z.number(),
  dialServerKeepalive: z.number(),
  connectServerLocalIP: z.string(),
  proxyURL: z.string(),
  poolCount: z.number(),
  tcpMux: z.boolean(),
  tcpMuxKeepaliveInterval: z.number(),
  quic: z.object({
    keepalivePeriod: z.number(),
    maxIdleTimeout: z.number(),
    maxIncomingStreams: z.number(),
  }).partial(),
  heartbeatInterval: z.number(),
  heartbeatTimeout: z.number(),
  tls: z.object({
    enable: z.boolean().nullish(),
    disableCustomTLSFirstByte: z.boolean().nullish(),
    certFile: z.string(),
    keyFile: z.string(),
    trustedCaFile: z.string().nullish(),
    serverName: z.string().nullish(),
  }),
}).partial();

export const configurationSchema = z.object({
  auth: configurationAuthSchema,
  user: z.string(),
  serverAddr: z.string(),
  serverPort: z.number().min(0).max(65535),
  natHoleStunServer: z.string(),
  dnsServer: z.string(),
  loginFailExit: z.boolean(),
  start: z.string().array(),
  log: configurationLogSchema,
  webServer: configurationWebServerSchema,
  transport: configurationTransportSchema,
  udpPacketSize: z.number(),
  metadatas: z
    .array(z.array(z.string()))
    .transform<string[][]>((value) => {
      return value ? Object.fromEntries(value.filter(([key]) => !!key)) : [];
    }),
  includes: z.string(),
}).partial();

export type ConfigurationSchemaType = z.infer<typeof configurationSchema>;
