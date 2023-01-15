import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
import Role from './Role'
import InviteStatus from './InviteStatus'
import User from './User'
import InviteStatuses from 'App/Enums/InviteStatuses'

export default class TeamInvite extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @column()
  public inviteStatusId: number
  
  @column()
  public roleId: number
  
  @column()
  public email: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @belongsTo(() => Role)
  public role: BelongsTo<typeof Role>

  @belongsTo(() => InviteStatus)
  public inviteStatus: BelongsTo<typeof InviteStatus>

  public async accept(user: User) {
    await user.related('teams').attach({
      [this.teamId]: {
        role_id: this.roleId
      }
    })

    this.inviteStatusId = InviteStatuses.ACCEPTED
    await this.save()
  }
}
