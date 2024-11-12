import type { AnyZodiosRequestOptions, ZodiosPlugin } from "@zodios/core";

import { Zodios } from "@zodios/core";
import * as TOML from "smol-toml";

import { getConfig, getStatus, reloadServer, setConfig, stopServer } from "./endpoints";

const client = new Zodios("/api", [
  getConfig,
  getStatus,
  reloadServer,
  setConfig,
  stopServer,
], { axiosConfig: { adapter: "fetch" } });
client.use({
  name: "toml",
  async request(_api, config) {
    if (config.headers?.["Content-Type"] === "application/toml" && config.data) {
      (config as AnyZodiosRequestOptions).data = TOML.stringify(config.data);
    }

    return config;
  },
  async response(_api, config, response) {
    if (config.headers?.Accept === "application/toml" && response.data) {
      response.data = TOML.parse(response.data);
    }

    return response;
  },
} satisfies ZodiosPlugin);

export default client;
