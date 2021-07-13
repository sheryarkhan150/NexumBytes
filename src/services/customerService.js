import http from "./httpService";
import { apiUrl } from "../config.json";

const apiEndpoint = apiUrl + "/customer";

async function getCustomers() {
  return http.get(`${apiEndpoint}`);
}

async function getCustomer(customerId) {
  return http.get(`${apiEndpoint}/${customerId}`);
}

async function addCustomer(customer) {
  return http.post(`${apiEndpoint}`, customer);
}

async function updateCustomer(customer) {
  return http.put(`${apiEndpoint}/${customer.id}`, customer);
}

async function deleteCustomer(customerId) {
  return http.delete(`${apiEndpoint}/${customerId}`);
}

async function addCustomerSubscription(customerId) {
  return http.post(`${apiEndpoint}/${customerId}/subscription`);
}

async function deleteCustomerSubscription(customerId, subscriptionId) {
  return http.delete(`${apiEndpoint}/${customerId}/subscription/${subscriptionId}`);
}

export default {
  getCustomers,
  getCustomer,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  addCustomerSubscription,
  deleteCustomerSubscription
};
