import knex from 'knex';

export async function up(knex: knex) {
    return knex.schema.createTable('Notificacao', table => {
        table.increments('CodNotificacao').primary();
        table.string('Descricao');
        table.boolean('Status');
        table.enu('StatusAR', ['A', 'R']); //Status "aceito" "recusado"
        table.string('TipoNotificacao');
        table.integer('CodUsuario');
        table.timestamps(true, true);
    });
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Notificacao');
}