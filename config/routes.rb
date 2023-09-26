# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  root 'main#index'

  get '*path', to: 'main#index'
end
