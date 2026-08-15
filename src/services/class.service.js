import api from "@/lib/axios";

export const getAllClassesApi = () => {
    return api.get("/classes");
};

export const getClassByIdApi = (id) => {
    return api.get(`/classes/${id}`);
};

export const createClassApi = (data) => {
    return api.post("/classes", data);
};

export const updateClassApi = (id, data) => {
    return api.put(`/classes/${id}`, data);
};

export const deleteClassApi = (id) => {
    return api.delete(`/classes/${id}`);
};

export const getClassSessionsByClassApi = (
    classId
) => {
    return api.get(
        `/class-sessions/class/${classId}`
    );
};