import { KEY } from "./Authentication/Config";
import jwt_decode from "jwt-decode";

export default {
  isAuthenticated() {
    const token = localStorage.getItem(KEY);
    if (!token) {
      return false;
    }

    const decodedToken = jwt_decode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentDate = new Date();

    if (currentDate > expirationDate) {
      localStorage.removeItem(KEY);
      return false;
    }

    return true;
  },

  get() {
    return localStorage.getItem(KEY);
  },

  destroy() {
    localStorage.removeItem(KEY);
  },
};
