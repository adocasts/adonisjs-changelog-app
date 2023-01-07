import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import {
  attachment,
  AttachmentContract
} from '@ioc:Adonis/Addons/AttachmentLite'
import { slugify } from '@ioc:Adonis/Addons/LucidSlugify'
import Team from './Team'
import User from './User'

export default class Project extends BaseModel {  
  @column({ isPrimary: true })
  public id: number

  @column()
  public teamId: number

  @column()
  public name: string

  @column()
  @slugify({
    strategy: 'dbIncrement',
    fields: ['name']
  })
  public slug: string | null

  @attachment()
  public logo: AttachmentContract | null

  @attachment()
  public favicon: AttachmentContract | null

  @column()
  public primaryColor: string | null

  @column()
  public siteUrl: string | null

  @column()
  public accessId: number

  @column()
  public searchIndexId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Team)
  public team: BelongsTo<typeof Team>

  @hasMany(() => User, {
    foreignKey: 'lastAccessedProjectId'
  })
  public usersWithLastAccessed: HasMany<typeof User>
}
