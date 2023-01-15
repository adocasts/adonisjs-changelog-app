import BaseSchema from '@ioc:Adonis/Lucid/Schema'
import InviteStatuses from 'App/Enums/InviteStatuses'
import Roles from 'App/Enums/Roles'

export default class extends BaseSchema {
  protected tableName = 'team_invites'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('team_id').unsigned().references('id').inTable('teams').notNullable()
      table.integer('invite_status_id').unsigned().references('id').inTable('invite_statuses').notNullable().defaultTo(InviteStatuses.PENDING)
      table.integer('role_id').unsigned().references('id').inTable('roles').notNullable().defaultTo(Roles.USER)
      table.string('email').notNullable()

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
