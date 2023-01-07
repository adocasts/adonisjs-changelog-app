import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle({ response, auth }: HttpContextContract, next: () => Promise<void>) {
    if (auth.user) {
      return response
        .redirect()
        .toRoute('app.dashboard', { team: auth.user.lastAccessedTeamId })
    }

    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
