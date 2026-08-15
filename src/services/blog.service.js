import api from "@/lib/axios";

export const getAllBlogsApi = () => api.get("/blogs");

export const getBlogByIdApi = (id) => api.get(`/blogs/${id}`);

export const createBlogApi = (formData) =>
  api.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBlogApi = (id, formData) =>
  api.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteBlogApi = (id) => api.delete(`/blogs/${id}`);