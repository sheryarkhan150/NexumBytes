import axios from "axios";

const Axios = axios.create({
  baseURL: "https://telecom-erp-node-api.herokuapp.com/api",
});
export default Axios;
