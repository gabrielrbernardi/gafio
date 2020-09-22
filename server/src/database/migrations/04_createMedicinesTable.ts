import knex from "knex";

export async function up(knex: knex) {
  return knex.schema.createTable("Medicamentos", (table) => {
    table.string("EAN").primary();
    table.string("PrincipioAtivo").notNullable();
    table.string("CNPJ");
    table.string("Laboratorio").notNullable();
    table.string("Registro").notNullable();
    table.string("Produto").notNullable();
    table.string("Apresentacao").notNullable();
    table.string("ClasseTerapeutica").notNullable();
    table.integer("PMC 0%");
    table.integer("PMC 12%");
    table.integer("PMC 17%");
    table.integer("PMC 17% ALC");
    table.integer("PMC 17,5%");
    table.integer("PMC 17,5% ALC");
    table.integer("PMC 18%");
    table.integer("PMC 20%");
    table.timestamps(true, true);
  });
}

export async function down(knex: knex) {
  return knex.schema.dropTable("Medicamentos");
}
