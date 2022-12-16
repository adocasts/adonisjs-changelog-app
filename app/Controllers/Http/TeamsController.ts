import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'
import TeamUpdateValidator from 'App/Validators/TeamUpdateValidator'

export default class TeamsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  @bind()
  public async edit({ view }: HttpContextContract, team: Team) {
    return view.render('pages/teams/edit', { team })
  }

  public async update({ request, response, params }: HttpContextContract) {
    const team = await Team.findByOrFail('slug', params.slug)
    const data = await request.validate(TeamUpdateValidator)

    if (data.slug && data.slug !== team.slug) {
      team.slug = null
    }

    await team.merge(data).save()
    return response.redirect().toRoute('app.dashboard', { teamSlug: team.slug })
  }

  public async destroy({}: HttpContextContract) {}
}
