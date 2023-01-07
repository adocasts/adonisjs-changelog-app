import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserService from 'App/Services/UserService'

export default class AppState {
  public async handle(ctx: HttpContextContract, next: () => Promise<void>) {
    ctx.flags = {
      usingLastAccessedProject: false,
      usingLastAccessedTeam: false
    }

    const user = ctx.auth.user
    const method = ctx.request.method()
    
    if (method.toUpperCase() === 'GET' && user) {
      const { team, project } = ctx.params
      const data = await UserService.tryPopulateUserTeamProjects(user, team, project)
      
      ctx.team = data.team
      ctx.project = data.project
      ctx.flags.usingLastAccessedTeam = data.isLastAccessedTeam
      ctx.view.share(data)
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
