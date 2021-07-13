import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/tenant";

async function getTenants() {
  return http.get(`${apiEndpoint}`);
}

async function getTenant(tenantId) {
  return http.get(`${apiEndpoint}/${tenantId}`);
}

async function addTenant(tenant) {
  return http.post(`${apiEndpoint}`, tenant);
}

async function updateTenant(tenant) {
  return http.put(`${apiEndpoint}/${tenant.id}`, tenant);
}

async function deleteTenant(tenantId) {
  return http.delete(`${apiEndpoint}/${tenantId}`);
}

async function addTenantUser(tenantId, user) {
  return http.post(`${apiEndpoint}/${tenantId}/user`, user);
}

async function getTenantUsers(tenantId) {
  return http.get(`${apiEndpoint}/${tenantId}/user`);
}

async function deleteTenantUser(tenantId, userRoleId) {
  return http.delete(`${apiEndpoint}/${tenantId}/user/${userRoleId}`);
}

export default {
  getTenants,
  getTenant,
  addTenant,
  updateTenant,
  deleteTenant,
  addTenantUser,
  getTenantUsers,
  deleteTenantUser
};
