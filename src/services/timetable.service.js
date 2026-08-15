import api from "@/lib/axios";

export const getAllTimetablesApi = (params) => api.get("/timetables", { params });

export const getTimetableByIdApi = (id) => api.get(`/timetables/${id}`);

export const getTimetableByClassIdApi = (classId) => api.get(`/timetables/class/${classId}`);

export const createTimetableApi = (data) => api.post("/timetables", data);

export const updateTimetableApi = (id, data) => api.put(`/timetables/${id}`, data);

export const deleteTimetableApi = (id) => api.delete(`/timetables/${id}`);