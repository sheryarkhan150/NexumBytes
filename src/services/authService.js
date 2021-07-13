import http from "./httpService";
import { apiUrl } from "../config.json";
const apiEndpoint = apiUrl + "/auth";
const authTokenKey = "auth_token";
const accessTokenKey = "access_token";
const userData = "user_data";
const userRole = "user_role";

http.setJwt(getJwt()? getJwt().token: "");

async function login(user) {
  return await http.post(`${apiEndpoint}/login`, user);
}

async function register(user) {
  return http.post(`${apiEndpoint}/register`, user);
}

function storeLoginData(data) {
  localStorage.setItem(authTokenKey, JSON.stringify(data.tokens.auth));
  localStorage.setItem(accessTokenKey, JSON.stringify(data.tokens.access));
  localStorage.setItem(userData, JSON.stringify(data.user));
  let userRoleData = {};
  if(data.roles && data.roles.length > 0){
    console.log(data.roles[0])
    userRoleData['role'] = data.roles[0].role;
    if(userRoleData.role && userRoleData.role === 'admin') {

    }
    else if(userRoleData.role && userRoleData.role === 'tenant') {
      userRoleData['tenantId'] = data.roles[0].roleData.id;
    }
    else if(userRoleData.role && userRoleData.role === 'franchise') {
      userRoleData['franchiseId'] = data.roles[0].roleData.id;
      userRoleData['tenantId'] = data.roles[0].roleData.tenant.id;
    }
    else if(userRoleData.role && userRoleData.role === 'dealer') {
      userRoleData['dealerId'] = data.roles[0].roleData.id;
      userRoleData['franchiseId'] = data.roles[0].roleData.franchise.id;
      userRoleData['tenantId'] = data.roles[0].roleData.franchise.tenant.id;
    }
    else {
      userRoleData['role'] = 'guest';
    }
  }
  else {
    userRoleData['role'] = 'guest';
  }
  localStorage.setItem(userRole, JSON.stringify(userRoleData));
}

function logout() {
  localStorage.removeItem(authTokenKey);
  localStorage.removeItem(accessTokenKey);
  localStorage.removeItem(userData);
  localStorage.removeItem(userRole);
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem(userData));
  } catch (ex) {
    return null;
  }
}

function getCurrentRole() {
  try {
    return JSON.parse(localStorage.getItem(userRole));
  } catch (ex) {
    return null;
  }
}

async function getCurrentUserData() {
  return http.post(`${apiEndpoint}/profile`);
}

function getJwt() {
  return JSON.parse(localStorage.getItem(accessTokenKey));
}

export default {
  login,
  register,
  storeLoginData,
  logout,
  getCurrentUser,
  getCurrentRole,
  getJwt,
  getCurrentUserData
};
