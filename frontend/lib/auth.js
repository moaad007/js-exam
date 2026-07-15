export function setToken(token) {
  if (typeof window !== "undefined") {
    localStorage.setItem("admin_token", token);
  }
}

export function getToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("admin_token");
  }
  return null;
}

export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("admin_token");
  }
}

export function isAuthenticated() {
  return !!getToken();
}
