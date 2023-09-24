# frozen_string_literal: true

Rails.application.routes.draw do
  root 'main#index'

  get '*path', to: 'main#index'
end
