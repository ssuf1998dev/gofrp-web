import { Zodios } from "@zodios/core";

import { getConfig, getStatus, reloadServer, setConfig, stopServer } from "./endpoints";

const client = new Zodios("/api", [
  getConfig,
  getStatus,
  reloadServer,
  setConfig,
  stopServer,
], { axiosConfig: { adapter: "fetch" } });

export default client;
