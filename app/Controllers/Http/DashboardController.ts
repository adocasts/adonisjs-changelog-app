import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'

export default class DashboardController {
  public async index({ view, auth, team, project }: HttpContextContract) {
    await UserService.updateLastAccessed(auth.user!, team, project)
    return view.render('pages/dashboard')
  }
}
