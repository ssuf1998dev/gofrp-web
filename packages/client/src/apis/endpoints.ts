import { makeEndpoint, parametersBuilder } from "@zodios/core";
import { z } from "zod";

export const proxyStatus = z.object({
  name: z.string().min(1),
  type: z.string(),
  status: z.enum(["new", "wait start", "start error", "running", "check failed", "closed"]),
  err: z.string().nullish(),
  local_addr: z.string().min(1).url(),
  remote_addr: z.string().min(1).url(),
  plugin: z.string().nullish(),
});

/** @link https://github.com/fatedier/frp/blob/master/client/admin_api.go#L71 */
export const reloadServer = makeEndpoint({
  method: "get",
  path: "/reload",
  alias: "reloadServer",
  response: z.string().nullish(),
});

/** @link https://github.com/fatedier/frp/blob/master/client/admin_api.go#L112 */
export const stopServer = makeEndpoint({
  method: "post",
  path: "/stop",
  alias: "stopServer",
  response: z.string().nullish(),
});

/** @link https://github.com/fatedier/frp/blob/master/client/admin_api.go#L162 */
export const getStatus = makeEndpoint({
  method: "get",
  path: "/status",
  alias: "getStatus",
  response: z.record(z.string(), proxyStatus.array()),
});

/** @link https://github.com/fatedier/frp/blob/master/client/admin_api.go#L198 */
export const getConfig = makeEndpoint({
  method: "get",
  path: "/config",
  alias: "getConfig",
  response: z.string(),
});

/** @link https://github.com/fatedier/frp/blob/master/client/admin_api.go#L228 */
export const setConfig = makeEndpoint({
  method: "put",
  path: "/config",
  alias: "setConfig",
  parameters: parametersBuilder().addBody(z.string().min(1)).build(),
  response: z.string().nullish(),
});
