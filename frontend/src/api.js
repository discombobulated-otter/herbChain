import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // backend
});

export default {
  createCollection: (data) => API.post("/collection", data),
  addProcess: (data) => API.post("/process", data),
  addQuality: (data) => API.post("/quality", data),
  packageProduct: (data) => API.post("/package", data),
  getProvenance: (id) => API.get(`/provenance/${id}`),
};
