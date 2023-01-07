import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Accesses from 'App/Enums/Accesses'
import SearchIndexes from 'App/Enums/SearchIndexes'

export default class extends BaseSchema {
  protected tableName = 'projects'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('team_id').unsigned().references('id').inTable('teams')
      table.string('name', 100).notNullable()
      table.string('slug', 150).notNullable().unique()
      table.json('logo')
      table.json('favicon')
      table.string('primary_color', 20)
      table.string('site_url')
      table.integer('access_id').unsigned().references('id').inTable('accesses').notNullable().defaultTo(Accesses.PUBLIC)
      table.integer('search_index_id').unsigned().references('id').inTable('search_indexes').notNullable().defaultTo(SearchIndexes.ALLOW)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
