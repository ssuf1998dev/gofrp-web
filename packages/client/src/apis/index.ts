import { Zodios } from "@zodios/core";

import { getConfig, getStatus, reloadServer, setConfig, stopServer } from "./endpoints";

export default new Zodios("/api", [
  getConfig,
  getStatus,
  reloadServer,
  setConfig,
  stopServer,
], { axiosConfig: { adapter: "fetch" } });
