import api from "@/lib/axios";

export const getAllInstructorsApi = () => api.get("/instructors");

export const getInstructorByIdApi = (id) => api.get(`/instructors/${id}`);

export const createInstructorProfileApi = (data) =>
  api.post("/instructors/create-profile", data);

export const updateInstructorProfileApi = (data) =>
  api.put("/instructors/update-profile", data);

export const deleteInstructorProfileApi = () =>
  api.delete("/instructors/delete-profile");