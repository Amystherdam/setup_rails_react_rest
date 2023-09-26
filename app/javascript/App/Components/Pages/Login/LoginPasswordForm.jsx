import React, { useState } from "react";

import { useNavigate } from "react-router-dom";

import Login from "../../../Services/Authentication/Login";

function UserSignin() {
  const [value, setValue] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = (formElement) => {
    setLoading(true);

    objValues = {
      email: formElement.email.value,
      password: formElement.password.value,
    };

    Login(objValues)
      .then(() => navigate("/"))
      .catch((error) => {
        setLoading(false);
        setErrors({ base: error.message });
      });
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(event.target);
      }}
      onChange={(nextValue) => setValue(nextValue)}
      errors={errors}
      value={value}
      messages={{
        required: "o campo é obrigatório",
      }}
      aria-label="login-form"
    >
      <input
        type="email"
        placeholder="E-mail"
        required="required"
        name="email"
      />
      <label htmlFor="email">E-mail</label>

      <input type="password" placeholder="password" name="password" />
      <label htmlFor="password">Senha</label>

      <input type="submit" disabled={loading} value="Enviar" />
    </form>
  );
}

export default UserSignin;
