import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/franchise";

async function getFranchises() {
  return http.get(`${apiEndpoint}`);
}

async function getFranchise(franchiseId) {
  return http.get(`${apiEndpoint}/${franchiseId}`);
}

async function addFranchise(franchise) {
  return http.post(`${apiEndpoint}`, franchise);
}

async function updateFranchise(franchise) {
  return http.put(`${apiEndpoint}/${franchise.id}`, franchise);
}

async function deleteFranchise(franchiseId) {
  return http.delete(`${apiEndpoint}/${franchiseId}`);
}

async function addFranchiseUser(franchiseId, user) {
  return http.post(`${apiEndpoint}/${franchiseId}/user`, user);
}

async function getFranchiseUsers(franchiseId) {
  return http.get(`${apiEndpoint}/${franchiseId}/user`);
}

async function deleteFranchiseUser(franchiseId, userRoleId) {
  return http.delete(`${apiEndpoint}/${franchiseId}/user/${userRoleId}`);
}

export default {
  getFranchises,
  getFranchise,
  addFranchise,
  updateFranchise,
  deleteFranchise,
  addFranchiseUser,
  getFranchiseUsers,
  deleteFranchiseUser

};
