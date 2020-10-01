import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Doenca', (table) => {
        table.increments('index').primary();
        table.string('CodDoenca');
        table.string('Nome').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('Doenca');
}