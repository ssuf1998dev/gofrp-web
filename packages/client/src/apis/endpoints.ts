import { makeEndpoint, parametersBuilder } from "@zodios/core";
import { z } from "zod";

const proxyStatus = z.object({
  name: z.string(),
  type: z.string(),
  status: z.string(),
  err: z.string().nullish(),
  local_addr: z.string(),
  remote_addr: z.string(),
  plugin: z.string().nullish(),
});

export const reloadServer = makeEndpoint({
  method: "get",
  path: "/reload",
  alias: "reloadServer",
  response: z.string().nullish(),
});

export const stopServer = makeEndpoint({
  method: "post",
  path: "/stop",
  alias: "stopServer",
  response: z.string().nullish(),
});

export const getStatus = makeEndpoint({
  method: "get",
  path: "/status",
  alias: "getStatus",
  response: z.record(z.string(), proxyStatus.array()),
});

export const getConfig = makeEndpoint({
  method: "get",
  path: "/config",
  alias: "getConfig",
  response: z.string(),
});

export const setConfig = makeEndpoint({
  method: "put",
  path: "/config",
  alias: "setConfig",
  parameters: parametersBuilder().addBody(z.string().min(1)).build(),
  response: z.string().nullish(),
});
