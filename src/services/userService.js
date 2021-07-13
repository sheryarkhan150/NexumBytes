import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/user";

async function createUser(user) {
  return http.post(`${apiEndpoint}`, user);
}

export default {
  createUser
};
