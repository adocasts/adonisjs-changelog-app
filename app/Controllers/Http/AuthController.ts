import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'
import TeamService from 'App/Services/TeamService'

export default class AuthController {
  public async signupShow({ view }: HttpContextContract) {
    return view.render('pages/auth/signup')
  }

  public async signup({ request, response, auth }: HttpContextContract) {
    const _schema = schema.create({
      username: schema.string([rules.unique({ table: 'users', column: 'username' })]),
      email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string([rules.minLength(8)])
    })

    const data = await request.validate({ schema: _schema })
    const user = await User.create(data)

    await auth.login(user)
    
    const team = await TeamService.stubDefaultTeam(user)

    return response.redirect().toRoute(
      'teams.edit', 
      { id: team.id }, 
      { qs: { newUser: 1 } })
  }

  public async signinShow({ view }: HttpContextContract) {
    return view.render('pages/auth/signin')
  }

  public async signin({ request, response, session, auth }: HttpContextContract) {
    const _schema = schema.create({
      uid: schema.string(),
      password: schema.string(),
      remember_me: schema.boolean.optional()
    })

    const { uid, password, remember_me = false } = await request.validate({ schema: _schema })

    try {
      await auth.attempt(uid, password, remember_me)
    } catch (_) {
      session.flash('form', 'The email, username, or password provided is incorrect')
      return response.redirect().back()
    }

    session.flash('success', `Welcome back, ${auth.user?.username}`)
    return response.redirect().toRoute('home')
  }

  public async signout({ response, session, auth }: HttpContextContract) {
    await auth.logout()

    session.flash('info', "You've been logged out successfully")

    return response.redirect().toRoute('home')
  }
}
