import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, manyToMany, ManyToMany, hasMany, HasMany, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import Team from './Team'
import Post from './Post'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public username: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken: string | null

  @column()
  public lastAccessedTeamId: number | null

  @column()
  public lastAccessedProjectId: number | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @manyToMany(() => Team, {
    pivotTable: 'team_users'
  })
  public teams: ManyToMany<typeof Team>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @belongsTo(() => Team, {
    foreignKey: 'lastAccessedTeamId'
  })
  public team: BelongsTo<typeof Team>
}
