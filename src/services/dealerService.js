import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/dealer";

async function getDealers() {
  return http.get(`${apiEndpoint}`);
}

async function getDealer(dealerId) {
  return http.get(`${apiEndpoint}/${dealerId}`);
}

async function addDealer(dealer) {
  return http.post(`${apiEndpoint}`, dealer);
}

async function updateDealer(dealer) {
  return http.put(`${apiEndpoint}/${dealer.id}`, dealer);
}

async function deleteDealer(dealerId) {
  return http.delete(`${apiEndpoint}/${dealerId}`);
}

async function addDealerUser(dealerId, user) {
  return http.post(`${apiEndpoint}/${dealerId}/user`, user);
}

async function getDealerUsers(dealerId) {
  return http.get(`${apiEndpoint}/${dealerId}/user`);
}

async function deleteDealerUser(dealerId, userRoleId) {
  return http.delete(`${apiEndpoint}/${dealerId}/user/${userRoleId}`);
}

export default {
  getDealers,
  getDealer,
  addDealer,
  updateDealer,
  deleteDealer,
  addDealerUser,
  getDealerUsers,
  deleteDealerUser
};
