import axios from "axios";

const api = axios.create({
  baseURL: "https://6a7d14e8f8b2ed99ca4dcf70.mockapi.io",
});

export default api;