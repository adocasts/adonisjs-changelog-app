import { BaseMailer, MessageContract } from '@ioc:Adonis/Addons/Mail'
import TeamInvite from 'App/Models/TeamInvite'
import Env from '@ioc:Adonis/Core/Env'
import Route from '@ioc:Adonis/Core/Route'

export default class SendTeamUserInvite extends BaseMailer {
  constructor(protected invite: TeamInvite) {
    super()
  }

  /**
   * WANT TO USE A DIFFERENT MAILER?
   *
   * Uncomment the following line of code to use a different
   * mailer and chain the ".options" method to pass custom
   * options to the send method
   */
  // public mailer = this.mail.use()

  /**
   * The prepare method is invoked automatically when you run
   * "SendTeamUserInvite.send".
   *
   * Use this method to prepare the email message. The method can
   * also be async.
   */
  public async prepare(message: MessageContract) {
    await this.invite.load('role')

    const domain = Env.get('APP_DOMAIN')
    const path = Route.makeSignedUrl('teamInvites.accept', { team: this.invite.teamId, id: this.invite.id })

    message.subject('Changelog Invite')
      .from('tom@adocasts.com')
      .to(this.invite.email)
      .html(`
        <h1>You've been invited to join a changelog team as a ${this.invite.role.name.toLowerCase()}</h1>
        <a href="${domain}${path}">Accept Invite</a>
      `)
  }
}
