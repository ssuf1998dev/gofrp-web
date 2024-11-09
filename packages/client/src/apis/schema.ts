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

export const proxySchema = proxyStatus.pick({ name: true, type: true }).merge(z.object({
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
      }),
  }).nullish(),
}));

export type ProxySchemaType = z.infer<typeof proxySchema>;
