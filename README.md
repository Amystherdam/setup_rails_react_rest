# Basic setup for RoR with React and Rest Architecture

![Ruby](https://img.shields.io/badge/ruby-%23CC342D.svg?style=for-the-badge&logo=ruby&logoColor=white)![Rails](https://img.shields.io/badge/Ruby_on_Rails-CC0000?style=for-the-badge&logo=ruby-on-rails&logoColor=white)![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Hello this is a basic tutorial of an setup for RoR with React

The README will provide step-by-step instructions for creating your own application bases with Rails and React

### Versions

- Ruby 3.1.2
- Rails 7.0.4
- React 18.2.0
- Find more informations in `Gemfile` and `package.json`

### Creating the project

```
rails new app_name -d postgresql -a propshaft -j esbuild --css tailwind -T --skip-jbuilder --skip-hotwire
```

I particularly like cleaning up some parts of some files created automatically by `rails new`:

- Commented `gems` from the Gemfile
- The `web` alias of the `Procfile.dev` file that calls the `env RUBY_DEBUG_OPEN=true bin/rails server` command
  - I prefer to run a separate terminal for the `Rails` server in a development environment to avoid conflict with the build outputs for `React` and also improve the `Debugger` or `Byebug`
- Clear comments from `database.yml` file

### Creating the database

```
rails db:create
```

Gets database information from `database.yml` file

### Installing React

Now we can start installing React dependencies and configuring some files

```
yarn add react react-dom react-router-dom
```

### After installing the dependencies

Make TailwindCSS respond to `.jsx` files by adding the path of the files in the `tailwind.config.js` file

```
"./app/javascript/**/*.jsx"
```

Configure some quirks of rails code generators in the `config/application.rb` file

```
config.generators do |generator|
  generator.system_tests = nil
  generator.stylesheets = false
  generator.javascripts = false
  generator.helper = false
end
```

Create a central controller to receive requests from your app

```
rails g controller main index
```

Enter the generated file `app/views/main/index.html.erb` and replace the content with

```
<div id="App"></div>
```

Your react components will be created from this HTML tag

Now create a wildcard route in your rails `routes.rb` to receive requests

```
# frozen_string_literal: true

Rails.application.routes.draw do
  root 'main#index'

  get '*path', to: 'main#index'
end
```

The definition of the `routes.rb` file is simpler at the beginning because we will work the routes through React Router

Now let's create a basic component for our app's index route

Go to the `app/javascript` folder and create a chain of folders: `App > Components > Pages > Home`, inside them create a file called `Index.jsx`

```
import React from "react";

export default function Home() {
  return (
    <div class="flex justify-items-center justify-center items-center h-screen">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
        Subscribe
      </button>
    </div>
  );
}
```

It's just a component with a button and TailwindCSS classes that are possible in the `.jsx` files due to the path we put in the `tailwind.config.js` file

Now create the routes file in the path `app/javascript/App` called `Routes.jsx` and call the `Home` component inside it

```
import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./Components/Pages/Home/Index";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default Router;

```

A route was created for the application index in the path `/` and will load the information from the Home component

All that’s left now is to take the div created in the file app/views/main/index.html.erb and render based on it. To do this, we will create an `App.jsx` component parallel to the Routes component

```
import * as React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import Routes from "./Routes";

function App() {
  return (
    <BrowserRouter>
      <Routes />
    </BrowserRouter>
  );
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("App");
  const root = createRoot(container);

  root.render(<App />);
});

export default App;

```

You also need to edit the `app/javascript/application.js` file, putting the entry point for the build script in your `package.json`

```
import "./App/App";
```

Which is the path of our component `App.jsx`

### Backend Authentication

```
bundle add devise
rails generate devise:install
```

you'll need to set up the default URL options for the Devise mailer in each environment. Here is a possible configuration for `config/environments/development.rb`

```
config.action_mailer.default_url_options = { host: 'localhost', port: 3000 }
```

Configure the Devise default model with

```
rails generate devise MODEL_NAME
```

`MODEL_NAME` is usually `User`

We will also need to install the `devise-jwt` gem which is a Devise extension that uses JWT tokens for user authentication. We will also need to install the `devise-jwt` gem which is a Devise extension that uses JWT tokens for user authentication. Tokens are better suited when working with SPA's than Devise's default cookie model

```
bundle add devise-jwt
```

We also need to configure a revocation strategy for JWT tokens and a few other points. We will use the [JTIMatcher strategy](https://github.com/waiting-for-dev/devise-jwt#jtimatcher). This strategy must be included in the user model and requires it to have a 'jti` column

Your `app/models/user.rb` file should look like this

```
class User < ApplicationRecord
  include Devise::JWT::RevocationStrategies::JTIMatcher

  devise :database_authenticatable, :registerable, :validatable,
  :jwt_authenticatable, jwt_revocation_strategy: self
end
```

Now create the jti column migration to the users table

```
rails g migration addJtiToUsers jti:string:index:unique
```

Then edit the migration file so it looks like this

```
class AddJtiToUsers < ActiveRecord::Migration[7.0]
   def change
     add_column :users, :jti, :string, null: false
     add_index :users, :jti, unique: true
   end
end
```

After

```
rails db:migrate
```

In the file `config/initializers/devise.rb` add

```
  # devise-jwt config
  config.jwt do |jwt|
    jwt.secret = Rails.application.credentials.devise_jwt_secret_key
    jwt.request_formats = { user: %i[json] }
    jwt.expiration_time = 24.hours.to_i
    jwt.dispatch_requests = [
      ['POST', %r{^/users/sign_in.json$}]
    ]
    jwt.revocation_requests = [
      ['DELETE', %r{^/users/sign_out.json$}]
    ]
  end
```

A key must be created in your credentials file to be called in `jwt.secret`

- `jwt.request_formats` is the authentication request format that it must accept
- `dispatch_requests` and `jwt.revocation_requests` are the routes that should release and revoke tokens. These are routes previously created by Devise

Finally, as you will use token authentication in request headers, you can and should disable the standard CSRF protection that Rails provides if necessary.

Otherwise you will receive CSRF token not found errors in requests.

One way to do this is to add the line below to `application_controller.rb`

```
protect_from_forgery with: :null_session
```

This way the session will be nil and an error will not occur in the request

### Frontend Authentication

On the frontend, we need to create login, logout, authentication services, configure authentication for the necessary routes and we will also need Axios for requests

```
yarn add axios
```

Parallel to the `app/javascript/App/Components` folder, create a `Services` > `Authentication` folder

In Authentication create `Config.js` and `Login.js` with the following content

`Config.js`

```
export const KEY = "SETUP_PROJECT_TOKEN";
```

Even though `protect_from_forgery with: :null_session` was configured in `application_controller` it was still necessary to pass the CSRF token generated in the `application.html.erb` view as there were some problems with login and logout

Taking into account that we also need to pass the JWT token in each request, we can customize `axios` to send it

This customization will include these headers in requests

Create the file `Api.js` in the path `App/Services/Api.js`

```
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
```

We are using an axios interceptor to add the JWT token if the routes differ from the planned login routes, as this may cause a request conflict with an invalid token

`Login.js`

```
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
```

Now let's create the authentication file that will be consulted in Routes

Install jwt_decode

```
yarn add jwt-decode
```

`/App/Services/Auth.js`

```
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

```

We will create another file that will redirect the user to the login form or Home and we will also create the form

Crie o formulário de login em `App/Components/Pages/Login/LoginPasswordForm.jsx`

```
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

```

`/Components/Pages/Login/UserSignin` will contain redirect logic

```
import React from "react";
import { Navigate } from "react-router-dom";

import Auth from "../../../Services/Auth";
import PasswordForm from "./LoginPasswordForm";

function UserSignin() {
  if (Auth.isAuthenticated()) return <Navigate to="/home" replace />;

  return <PasswordForm />;
}

export default UserSignin;
```

Modify the routes file to

```
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";

import Home from "./Components/Pages/Home/Index";
import UserSignin from "./Components/Pages/Login/UserSignin";

import Auth from "./Services/Auth";

function RequireAuth({ children }) {
  return Auth.isAuthenticated() ? children : <Navigate to="/login" />;
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="login" element={<UserSignin />} />

      <Route
        path="home"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

export default Router;

```

`App/Services/Authentication/Logout.js`

```
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
```

Your `current_user` method of devise must be accessible on the backend as devise appears to continue using session cookies even if devise-jwt is configured

To perform login and logout tests, create a user through the rails console

```
User.create(email: 'user_name@domain.com', password: 'your_password')
```

#### TO DO

- [ ] current_user exist?
- [ ] Two forms of authentication
- [ ] Check if there are texts in Portuguese yet
- [ ] Create a schema from other documentation files
- [ ] Insert Jest tests setup
- [ ] Deploy Heroku

🚧 Work in progress...
