import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import SearchIndexes from 'App/Enums/SearchIndexes'

export default class extends BaseSchema {
  protected tableName = 'search_indexes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 100).notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([{
        id: SearchIndexes.ALLOW,
        name: 'Allow Search Engine Indexing'
      }, {
        id: SearchIndexes.DISALLOW,
        name: 'Disallow Search Engine Indexing'
      }])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
