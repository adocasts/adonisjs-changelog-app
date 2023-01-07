import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import Accesses from 'App/Enums/Accesses'

export default class extends BaseSchema {
  protected tableName = 'accesses'

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
        id: Accesses.PUBLIC,
        name: 'Public'
      }, {
        id: Accesses.PRIVATE,
        name: 'Private'
      }])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
