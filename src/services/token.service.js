import setAuthToken from "../libs/setAuthToken.service";

const tokenService = (token) => {
  localStorage.setItem("token", token);
  setAuthToken(token);
};

export default tokenService;
