import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import InviteStatuses from 'App/Enums/InviteStatuses'

export default class extends BaseSchema {
  protected tableName = 'invite_statuses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })

    this.defer(async (db) => {
      await db.table(this.tableName).multiInsert([
        { id: InviteStatuses.PENDING, name: 'Pending' },
        { id: InviteStatuses.ACCEPTED, name: 'Accepted' },
        { id: InviteStatuses.REJECTED, name: 'Rejected' },
      ])
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
