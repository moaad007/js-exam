import api from "@/lib/api";

export const riadService = {
  list: (params = {}) => api.get("/riads", { params }).then((r) => r.data),
  get: (id) => api.get(`/riads/${id}`).then((r) => r.data),
  create: (data) => api.post("/riads", data).then((r) => r.data),
  update: (id, data) => api.put(`/riads/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/riads/${id}`).then((r) => r.data),
};

export const roomService = {
  all: () => api.get("/rooms").then((r) => r.data),
  byRiad: (riadId) => api.get(`/riads/${riadId}/rooms`).then((r) => r.data),
  create: (data) => api.post("/rooms", data).then((r) => r.data),
  update: (id, data) => api.put(`/rooms/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/rooms/${id}`).then((r) => r.data),
};

export const reservationService = {
  create: (data) => api.post("/reservations", data).then((r) => r.data),
  list: () => api.get("/reservations").then((r) => r.data),
  updateStatus: (id, status) =>
    api.patch(`/reservations/${id}`, { status }).then((r) => r.data),
};

export const authService = {
  login: (data) => api.post("/auth/login", data).then((r) => r.data),
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
};

export const statsService = {
  get: () => api.get("/stats").then((r) => r.data),
};
