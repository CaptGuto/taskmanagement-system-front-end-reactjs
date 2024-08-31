import axios from 'axios';


const axiosInstance = axios.create({
  baseURL: 'https://api.example.com', 
  withCredentials: true, 
});

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axiosInstance.post('/auth/refresh', {}, { withCredentials: true });

        // Retry the original request with new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
