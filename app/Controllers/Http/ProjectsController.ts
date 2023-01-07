import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Database from '@ioc:Adonis/Lucid/Database'
import Project from 'App/Models/Project'
import Team from 'App/Models/Team'
import UserService from 'App/Services/UserService'
import ProjectStoreValidator from 'App/Validators/ProjectStoreValidator'
import ProjectUpdateValidator from 'App/Validators/ProjectUpdateValidator'

export default class ProjectsController {
  public async index({}: HttpContextContract) {}

  public async create({ view }: HttpContextContract) {
    return view.render('pages/projects/create')
  }

  @bind()
  public async store({ request, response, auth }: HttpContextContract, team: Team) {
    const data = await request.validate(ProjectStoreValidator)
    const project = await team.related('projects').create(data)

    await UserService.updateLastAccessed(auth.user!, team, project)

    return response.redirect().toRoute('app.projects.edit', { 
      team: team.id,
      project: project.id
    })
  }

  @bind()
  public async edit({ view, auth }: HttpContextContract, team: Team, project: Project) {
    await UserService.updateLastAccessed(auth.user!, team, project)
    return view.render('pages/projects/edit')
  }

  @bind()
  public async update({ request, response }: HttpContextContract, _team: Team, project: Project) {
    const data = await request.validate(ProjectUpdateValidator)
    await project.merge(data).save()
    return response.redirect().back()
  }

  @bind()
  public async destroy({ response }: HttpContextContract, team: Team, project: Project) {
    const trx = await Database.transaction()
    
    project.useTransaction(trx)

    await project.related('team').dissociate()
    await project.related('usersWithLastAccessed').query().update({ lastAccessedProjectId: null })
    await project.delete()

    await trx.commit()

    return response.redirect().toRoute('app.dashboard', { team: team.id })
  }
}
