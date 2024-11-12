import type { AnyZodiosRequestOptions, ZodiosPlugin } from "@zodios/core";

import { zodValidationPlugin as createZodValidationPlugin, Zodios, ZodiosError } from "@zodios/core";
import { toast } from "react-hot-toast/headless";
import * as TOML from "smol-toml";

import { getConfig, getStatus, reloadServer, setConfig, stopServer } from "./endpoints";

const client = new Zodios("/api", [
  getConfig,
  getStatus,
  reloadServer,
  setConfig,
  stopServer,
], { axiosConfig: { adapter: "fetch" } });

const zodValidationPlugin = createZodValidationPlugin(client.options);
client.use({
  name: createZodValidationPlugin.name,
  async request(api, config) {
    try {
      return await zodValidationPlugin.request!(api, config);
    }
    catch (error) {
      if (error instanceof ZodiosError) {
        console.warn(error);
        toast.error(error.message.split("\n")[0]);
      }
      throw error;
    }
  },
  async response(api, config, response) {
    try {
      return await zodValidationPlugin.response!(api, config, response);
    }
    catch (error) {
      if (error instanceof ZodiosError) {
        console.warn(error);
        toast.error(error.message.split("\n")[0]);
      }
      throw error;
    }
  },
} satisfies ZodiosPlugin);

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
