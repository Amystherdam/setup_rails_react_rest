import api from "../Api";
import { KEY } from "./Config.js";

const Login = (values, token) =>
  new Promise((res, rej) => {
    api
      .post("/users/sign_in.json", {
        user: values,
        token,
      })
      .then((response) => {
        localStorage.setItem(KEY, response.headers.authorization);
        res(true);
      })
      .catch(() => {
        rej(new Error("Email ou senha inválida."));
      });
  });

export default Login;
