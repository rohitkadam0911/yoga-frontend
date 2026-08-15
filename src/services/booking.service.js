import api from "@/lib/axios";

export const createBookingApi = (
    classId,
    sessionId
) => {
    return api.post(
        "/bookings/create",
        {
            classId,
            sessionId
        }
    );
};

export const getMyBookingsApi = () => {
    return api.get(
        "/bookings/my-bookings"
    );
};

export const getSingleBookingApi = (id) => {
    return api.get(
        `/bookings/${id}`
    );
};

export const cancelBookingApi = (id) => {
    return api.put(
        `/bookings/cancel/${id}`
    );
};

export const getInstructorBookingsApi = () => {
    return api.get(
        "/bookings/instructor"
    );
};

export const getAllBookingsApi = () => {
    return api.get(
        "/bookings"
    );
};