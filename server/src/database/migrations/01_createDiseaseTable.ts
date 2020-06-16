import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Doenca', table => {
        table.integer('CodDoenca').primary();
        table.string('Nome').notNullable();
        table.timestamps(true, true);
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('Doenca');
}