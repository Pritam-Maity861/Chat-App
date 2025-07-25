import useAuthStore from "../../store/useAuthStore";
import { toast } from "react-toastify";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://chat-app-1-f0kp.onrender.com/api/v1",
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      const { logout } = useAuthStore.getState();
      logout();
      toast.error("Session expired, please log in again.");
      // window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
