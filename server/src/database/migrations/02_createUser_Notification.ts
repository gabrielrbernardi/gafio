import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('Usuario_Notificacao', table => {
        table.increments('id').primary();
        table.integer('CodNotificacao').references('CodNotificacao').inTable('Notificacao').unsigned();
        table.integer('CodUsuario').references('CodUsuario').inTable('Usuario').unsigned();
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('User_Notification')
}