import { KEY } from "./Config";
import api from "../Api";

const logout = () =>
  new Promise((res) => {
    api.delete("/users/sign_out.json").then(() => {
      localStorage.removeItem(KEY);
      res(true);
    });
  });

export default logout;
