import Axios from "../libs/axios";

const tokenVerification = async (token) => {
  try {
    const result = await Axios.get("/test/auth", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (result.data.code === 200) {
      return true;
    } else {
      localStorage.clear();
      return false;
    }
  } catch (error) {
    return false;
  }
};

export default tokenVerification;
