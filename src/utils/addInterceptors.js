import store from "@/store";

export default (axios) => {
  axios.interceptors.request.use(
    (config) => {
      const token = store.getters["auth/apiToken"];
      if (token) {
        config.headers["Authorization"] = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      Promise.reject(error);
    }
  );
};
