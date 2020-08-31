import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Paciente', table => {
        table.increments("SeqPaciente").primary();
        table.integer("NroPaciente").notNullable();
        table.string("NomePaciente").notNullable();
        table.string("DataNascimento").notNullable();
        table.enu("Genero", ["M", "F"]).notNullable();
    });
}

export async function down(knex: knex){
    return knex.schema.dropTable('Paciente');
}