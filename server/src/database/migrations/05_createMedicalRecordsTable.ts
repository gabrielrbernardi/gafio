import knex from "knex";

export async function up(knex: knex) {
  return knex.schema.createTable("Prontuario", (table) => {
    table.increments("NroProntuario").primary();
    table.dateTime("DataInternacao").notNullable();
    table.integer("CodDoencaPrincipal").notNullable().references("CodDoenca").inTable("Doenca");
    table.integer("CodDoencaSecundario").notNullable().references("CodDoenca").inTable("Doenca");
    table.string("Sistema").notNullable();
    table.integer("CodDoencaComorbidade").notNullable().references("CodDoenca").inTable("Doenca");
    table.string("Origem").notNullable();
    table.string("Alocacao").notNullable();
    table.date("DataDesfecho");
    table.string("Coleta").notNullable();
    table.string("ResultadoColeta").notNullable();
    table.string("CodAntibiotico2a").notNullable().references("EAN").inTable("Medicamentos");
    table.string("CodAntibiotico2b").notNullable().references("EAN").inTable("Medicamentos");
    table.string("SitioInfeccaoPrimario").notNullable();
    table.boolean("TratamentoConformeCCIH").notNullable();
    table.boolean("IndicacaoSepse").notNullable();
    table.boolean("DisfuncaoRenal").notNullable();
    table.string("OrigemInfeccao").notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: knex) {
  return knex.schema.dropTable("Prontuario");
}
