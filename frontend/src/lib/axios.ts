
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

/**
 * Attach Clerk authentication to every request using a fresh token.
 */
export const attachAuthInterceptor = (
  getToken: () => Promise<string | null>
) => {
  const interceptorId = axiosInstance.interceptors.request.use(
    async (config) => {
      const token = await getToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }

      return config;
    }
  );

  return () => {
    axiosInstance.interceptors.request.eject(interceptorId);
  };
};
