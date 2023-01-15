import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import TeamInvite from 'App/Models/TeamInvite'
import User from 'App/Models/User'
import TeamService from 'App/Services/TeamService'

export default class AuthController {
  public async signupShow({ view, session }: HttpContextContract) {
    let email = ''

    if (session.flashMessages.has('invite')) {
      const invitePayload = session.flashMessages.get('invite')
      const invite = await TeamInvite.find(invitePayload.inviteId)
      email = invite?.email ?? ''
    }

    return view.render('pages/auth/signup', { email })
  }

  public async signup({ request, response, auth }: HttpContextContract) {
    const _schema = schema.create({
      username: schema.string([rules.unique({ table: 'users', column: 'username' })]),
      email: schema.string([rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string([rules.minLength(8)]),
      signature: schema.string.optional(),
      inviteId: schema.number.optional()
    })

    const { signature, inviteId, ...data } = await request.validate({ schema: _schema })
    const user = await User.create(data)

    await auth.login(user)
    
    if (signature && inviteId) {
      try {
        const invite = await TeamInvite.findOrFail(inviteId)
        return response.redirect().toRoute('teamInvites.accept', { 
          team: invite.teamId,
          id: invite.id
        }, {
          qs: { signature }
        })
      } catch (error) {
        console.error({ error })
      }
    }

    const team = await TeamService.stubDefaultTeam(user)

    return response.redirect().toRoute(
      'app.dashboard', 
      { team: team.id }, 
      { qs: { newUser: 1 } })
  }

  public async signinShow({ view, session }: HttpContextContract) {
    let email = ''

    if (session.flashMessages.has('invite')) {
      const invitePayload = session.flashMessages.get('invite')
      const invite = await TeamInvite.find(invitePayload.inviteId)
      email = invite?.email ?? ''
    }

    return view.render('pages/auth/signin', { email })
  }

  public async signin({ request, response, session, auth }: HttpContextContract) {
    const _schema = schema.create({
      uid: schema.string(),
      password: schema.string(),
      remember_me: schema.boolean.optional(),
      signature: schema.string.optional(),
      inviteId: schema.number.optional()
    })

    const { uid, password, remember_me = false, signature, inviteId } = await request.validate({ schema: _schema })

    try {
      await auth.attempt(uid, password, remember_me)
    } catch (_) {
      session.flash('form', 'The email, username, or password provided is incorrect')
      return response.redirect().back()
    }

    if (signature && inviteId) {
      try {
        const invite = await TeamInvite.findOrFail(inviteId)
        return response.redirect().toRoute('teamInvites.accept', { 
          team: invite.teamId,
          id: invite.id
        }, {
          qs: { signature }
        })
      } catch (error) {}
    }

    session.flash('success', `Welcome back, ${auth.user?.username}`)
    return response.redirect().toRoute('app.dashboard', { team: auth.user?.lastAccessedTeamId })
  }

  public async signout({ response, session, auth }: HttpContextContract) {
    await auth.logout()

    session.flash('info', "You've been logged out successfully")

    return response.redirect().toRoute('home')
  }
}
