import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import TeamService from 'App/Services/TeamService'
import TeamStoreValidator from 'App/Validators/TeamStoreValidator'
import TeamUpdateValidator from 'App/Validators/TeamUpdateValidator'

export default class TeamsController {
  public async index({}: HttpContextContract) {}

  public async create({ view }: HttpContextContract) {
    return view.render('pages/teams/create')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = await request.validate(TeamStoreValidator)
    const team = await TeamService.createTeam(auth.user!, data)

    return response.redirect().toRoute('app.dashboard', { team: team.id })
  }

  public async show({}: HttpContextContract) {}

  @bind()
  public async edit({ view }: HttpContextContract, team: Team) {
    return view.render('pages/teams/edit', { team })
  }

  @bind()
  public async update({ request, response }: HttpContextContract, team: Team) {
    const data = await request.validate(TeamUpdateValidator)
    await team.merge(data).save()
    return response.redirect().toRoute('app.dashboard', { team: team.id })
  }

  public async destroy({}: HttpContextContract) {}
}
