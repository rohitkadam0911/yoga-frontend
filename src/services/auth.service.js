import api from "@/lib/axios";

export const signupApi = (data) => api.post("/users/signup", data);

export const loginApi = (data) => api.post("/users/login", data);

export const logoutApi = () => api.post("/users/logout");

export const sendOtpApi = (data) => api.post("/users/send-otp", data);

export const verifyOtpApi = (data) => api.post("/users/verify-otp", data);

export const resetPasswordApi = (data) => api.put("/users/reset-password", data);

export const changePasswordApi = (data) => api.put("/users/change-password", data);

export const getProfileApi = () => api.get("/users/profile");

export const updateProfileApi = (data) => api.put("/users/update-profile", data);

export const deleteAccountApi = () => api.delete("/users/delete-account");

export const updateProfileImageApi = (formData) =>
  api.put("/users/profile-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });