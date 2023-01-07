import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Post from './Post'
import Category from './Category'
import Project from './Project'

export default class Team extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => User, {
    pivotTable: 'team_users'
  })
  public users: ManyToMany<typeof User>

  @hasMany(() => Post)
  public posts: HasMany<typeof Post>

  @hasMany(() => Category)
  public categories: HasMany<typeof Category>

  @hasMany(() => Project)
  public projects: HasMany<typeof Project>
}
