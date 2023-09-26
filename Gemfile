source "https://rubygems.org"
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby "3.1.2"

gem "rails", "~> 7.0.4", ">= 7.0.4.3"

# The modern asset pipeline for Rails [https://github.com/rails/propshaft]
gem "propshaft"

# Use postgresql as the database for Active Record
gem "pg", "~> 1.1"

# Use the Puma web server [https://github.com/puma/puma]
gem "puma", "~> 5.0"

# Bundle and transpile JavaScript [https://github.com/rails/jsbundling-rails]
gem "jsbundling-rails"

# Bundle and process CSS [https://github.com/rails/cssbundling-rails]
gem "cssbundling-rails"

gem "tzinfo-data", platforms: %i[ mingw mswin x64_mingw jruby ]

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# Devise is a flexible authentication solution for Rails based on Warden [https://github.com/heartcombo/devise]
gem "devise", "~> 4.9"

# devise-jwt is a Devise extension which uses JWT tokens for user authentication [https://github.com/waiting-for-dev/devise-jwt]
gem "devise-jwt", "~> 0.11.0"

group :development, :test do
  gem "pry", "~> 0.14.2"
end

group :development do
  gem "web-console"
end
