import axios from "axios";

export const api = axios.create({
  baseURL: "https://dummyjson.com",
  headers: {
    "Content-Type": "application/json",
  },
});

// =========================
// DummyJSON API functions
// =========================

export const getProducts = (params: any = {}) =>
  api.get("/products", { params });

export const searchProducts = (params: any = {}) =>
  api.get("/products/search", { params });

export const getCategories = () =>
  api.get("/products/categories");

export const getProduct = (id: string | number) =>
  api.get(`/products/${id}`);

export const addProduct = (data: any) =>
  api.post("/products/add", data);

export const updateProduct = (
  id: string | number,
  data: any
) =>
  api.put(`/products/${id}`, data);

export const deleteProduct = (
  id: string | number
) =>
  api.delete(`/products/${id}`);