import knex from "knex";

export async function up(knex: knex) {
   return knex.schema.createTable("Historico", (table) => {
        table.increments("IdHistorico").primary();
        table.integer("IdPaciente").references("SeqPaciente").inTable("Paciente").unsigned();
        table.integer("IdProntuario").references("SeqProntuario").inTable("Prontuario").unsigned();
   });
}

export async function down(knex: knex) {
   return knex.schema.dropTable("Historico");
}