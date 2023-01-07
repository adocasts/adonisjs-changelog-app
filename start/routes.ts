/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/signup', 'AuthController.signupShow').as('auth.signup.show')
  Route.post('/signup', 'AuthController.signup').as('auth.signup')
  Route.get('/signin', 'AuthController.signinShow').as('auth.signin.show')
  Route.post('/signin', 'AuthController.signin').as('auth.signin')
  Route.post('/signout', 'AuthController.signout').as('auth.signout')
}).middleware(['guest'])

Route.group(() => {
  Route.get('/', async ({ view }) => {
    return view.render('welcome')
  }).as('home')
  
  Route.get('/teams/create', 'TeamsController.create').as('teams.create')
  Route.post('/teams', 'TeamsController.store').as('teams.store')
  Route.get('/teams/:team/edit', 'TeamsController.edit').as('teams.edit')
  Route.put('/teams/:team', 'TeamsController.update').as('teams.update')
}).middleware(['appState'])

Route.group(() => {

  Route.get('/', 'DashboardController.index').as('dashboard')

  Route.get('/projects/create', 'ProjectsController.create').as('projects.create')
  Route.post('/projects', 'ProjectsController.store').as('projects.store')
  Route.get('/projects/:project', 'ProjectsController.edit').as('projects.edit')
  Route.put('/projects/:project', 'ProjectsController.update').as('projects.update')
  Route.delete('/projects/:project', 'ProjectsController.destroy').as('projects.destroy')

}).prefix(':team').as('app').middleware(['auth', 'appState'])
