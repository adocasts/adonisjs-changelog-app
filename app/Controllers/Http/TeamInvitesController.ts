import { bind } from '@adonisjs/route-model-binding'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SendTeamUserInvite from 'App/Mailers/SendTeamUserInvite'
import Team from 'App/Models/Team'
import User from 'App/Models/User'
import TeamUserInviteValidator from 'App/Validators/TeamUserInviteValidator'

export default class TeamInvitesController {
  @bind()
  public async store({ request, response, session }: HttpContextContract, team: Team) {
    const data = await request.validate(TeamUserInviteValidator)

    const invite = await team.related('teamInvites').create(data)
    await new SendTeamUserInvite(invite).sendLater()

    session.flash('success', 'Invite sent')

    return response.redirect().back()
  }

  @bind()
  public async accept({ request, response, auth, session, params }: HttpContextContract, team: Team) {
    // verify request has valid signature
    if (!request.hasValidSignature()) {
      return response.unauthorized()
    }

    const invite = await team.related('teamInvites').query().where('id', params.id).firstOrFail()
    const inviteeAccount = await User.findBy('email', invite.email)

    if (!inviteeAccount) {
      // invited user does not have an account and needs to create one
      session.flash('invite', {
        inviteId: invite.id,
        signature: request.qs().signature
      })

      return response.redirect().toRoute('auth.signup.show')
    }

    if (inviteeAccount && !auth.user) {
      // invited user has an account but is not logged in
      session.flash('invite', {
        inviteId: invite.id,
        signature: request.qs().signature
      })
      return response.redirect().toRoute('auth.signin.show')
    }
    
    // verify invite belongs to the current user
    if (auth.user && auth.user.email !== invite.email) {
      return response.unauthorized()
    }

    // accept invite
    await invite.accept(auth.user!)

    return response.redirect().toRoute('app.dashboard', { team: team.id })
  }
}
