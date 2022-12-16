import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Team from 'App/Models/Team'

export default class AppState {
  public async handle({ request, view, params }: HttpContextContract, next: () => Promise<void>) {
    const method = request.method()
    
    if (method.toUpperCase() === 'GET') {
      const team = await Team.findByOrFail('slug', params.teamSlug)
      view.share({ team })
    }


    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
