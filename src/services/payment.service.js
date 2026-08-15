import api from "@/lib/axios";

export const createPaymentApi = (data) => api.post("/payments/create", data);

export const paymentSuccessApi = (data) => api.post("/payments/success", data);

export const paymentFailureApi = (data) => api.post("/payments/failure", data);

export const getMyPaymentsApi = () => api.get("/payments/my-payments");

export const getSinglePaymentApi = (id) => api.get(`/payments/${id}`);

export const getAllPaymentsApi = () => api.get("/payments");
