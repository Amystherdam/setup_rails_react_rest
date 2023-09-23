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

🚧 Work in progress...
