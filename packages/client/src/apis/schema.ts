import { z } from "zod";

import { proxyStatus } from "./endpoints";

export const proxyPluginSchema = z.object({
  type: z.literal(""),
}).or(z.object({
  type: z.literal("httpproxy"),
  httpUser: z.string().nullish(),
  httpPassword: z.string().nullish(),
})).or(z.object({
  type: z.literal("socks5"),
  username: z.string().nullish(),
  password: z.string().nullish(),
})).or(z.object({
  type: z.literal("staticfile"),
  localPath: z.string().min(1),
  stripPrefix: z.string().nullish(),
  httpUser: z.string().nullish(),
  httpPassword: z.string().nullish(),
})).or(z.object({
  type: z.literal("unixdomainsocket"),
  unixPath: z.string().min(1),
})).or(z.object({
  type: z.literal("http2https"),
  localAddr: z.string().min(1).url(),
  hostHeaderRewrite: z.string().nullish(),
  requestHeaders: z.object({ set: z.record(z.string()).nullish() }).nullish(),
})).or(z.object({
  type: z.literal("https2http"),
  localAddr: z.string().min(1).url(),
  hostHeaderRewrite: z.string().nullish(),
  requestHeaders: z.object({ set: z.record(z.string()).nullish() }).nullish(),
  enableHTTP2: z.boolean().nullish(),
  crtPath: z.string().nullish(),
  keyPath: z.string().nullish(),
})).or(z.object({
  type: z.literal("https2https"),
  localAddr: z.string().min(1).url(),
  hostHeaderRewrite: z.string().nullish(),
  requestHeaders: z.object({ set: z.record(z.string()).nullish() }).nullish(),
  enableHTTP2: z.boolean().nullish(),
  crtPath: z.string().nullish(),
  keyPath: z.string().nullish(),
})).or(z.object({
  type: z.literal("tls2raw"),
  localAddr: z.string().min(1).url(),
  crtPath: z.string().nullish(),
  keyPath: z.string().nullish(),
}));

export const proxySchema = proxyStatus.pick({ name: true, type: true }).merge(z.object({
  localIP: z.string().ip().nullish(),
  localPort: z.number().min(0).max(65535).nullish(),
  annotations: z
    .array(z.array(z.string()))
    .transform<string[][]>(value => value && Object.fromEntries(value.filter(([key]) => !!key)))
    .nullish(),
  plugin: proxyPluginSchema.nullish(),
}));

export type ProxySchemaType = z.infer<typeof proxySchema>;
