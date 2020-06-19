import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Notificacao', table => {
        table.increments('CodNotifacao').primary();
        table.string('Descricao');
        table.boolean('Status');
        table.timestamps(true, true);
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('Notificacao');
}