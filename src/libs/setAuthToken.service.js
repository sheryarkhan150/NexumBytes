import Axios from "./axios";

const setAuthToken = (token) => {
  if (token) {
    // applying token to axios requests
    Axios.defaults.headers.Authorization = `Bearer ${token}`;
  }
};

export default setAuthToken;
