# Basic setup for RoR with React and Rest Architecture

Hello this is a basic tutorial of an setup for RoR with React

The README will provide step-by-step instructions for creating your own application bases with Rails and React

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

🚧 Work in progress...
