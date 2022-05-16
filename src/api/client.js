import axios from "axios";
import addInterceptors from "@/utils/addInterceptors";

const client = axios.create({
  baseURL: `${process.env.VUE_APP_API_BASE_URL}/api/clients`,
});

addInterceptors(client);

export default client;
