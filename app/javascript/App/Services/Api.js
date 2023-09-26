import axios from "axios";
import Auth from "./Auth";

const csrfTokenElement = document.querySelector("meta[name=csrf-token]");
const csrfToken = csrfTokenElement.content;
axios.defaults.headers.common["X-CSRF-Token"] = csrfToken;

axios.interceptors.request.use((config) => {
  if (
    config.url != "/users/sign_in.json" &&
    config.url != "/users/sign_out.json"
  ) {
    config.headers.common["Authorization"] = `${Auth.get()}`;
  }
  return config;
});

export const api = axios;
export default axios;
