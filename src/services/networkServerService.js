import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/network-server";

async function getNetworkServers() {
  return http.get(`${apiEndpoint}`);
}

async function getNetworkServer(networkServerId) {
  return http.get(`${apiEndpoint}/${networkServerId}`);
}

async function addNetworkServer(networkServer) {
  return http.post(`${apiEndpoint}`, networkServer);
}

async function updateNetworkServer(networkServer) {
  return http.put(`${apiEndpoint}/${networkServer.id}`, networkServer);
}

async function deleteNetworkServer(networkServerId) {
  return http.delete(`${apiEndpoint}/${networkServerId}`);
}

export default {
  getNetworkServers,
  getNetworkServer,
  addNetworkServer,
  updateNetworkServer,
  deleteNetworkServer
};
