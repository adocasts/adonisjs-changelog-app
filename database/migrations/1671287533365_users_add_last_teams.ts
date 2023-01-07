import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('last_accessed_team_id').unsigned().references('id').inTable('teams')
      table.integer('last_accessed_project_id').unsigned().references('id').inTable('projects')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign('last_accessed_team_id')
      table.dropColumn('last_accessed_team_id')
    })
  }
}
