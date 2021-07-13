import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/package";

async function getPackages() {
  return http.get(`${apiEndpoint}`);
}

async function getPackage(PackageId) {
  return http.get(`${apiEndpoint}/${PackageId}`);
}

async function addPackage(packageData) {
  return http.post(`${apiEndpoint}`, packageData);
}

async function updatePackage(packageData) {
  return http.put(`${apiEndpoint}/${packageData.id}`, packageData);
}

async function deletePackage(packageId) {
  return http.delete(`${apiEndpoint}/${packageId}`);
}

export default {
  getPackages,
  getPackage,
  addPackage,
  updatePackage,
  deletePackage
};
