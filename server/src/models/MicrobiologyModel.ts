import {Model} from "objection";
import knexConnection from "../database/connection";
import {MedicalRecordsModel} from "./MedicalRecordsModel";
import {PatientModel}from "./PatientModel";

Model.knex(knexConnection);

export class MicrobiologyModel extends Model {
  static get tableName() {
    return "Microbiologia";
  }

  static get idColumn() {
    return "IdMicrobiologia";
  }

  static get relationMappings() {
    return {
      Paciente: {
        relation: this.BelongsToOneRelation,
        modelClass: PatientModel,
        join: {
          from: "SeqPaciente",
          to: "Microbiologia.IdPaciente",
        },
     },
     Prontuario: {
        relation: this.BelongsToOneRelation,
        modelClass: MedicalRecordsModel,
        join: {
          from: "SeqProntuario",
          to: "Microbiologia.IdProntuario",
        },
        },
    };
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['IdPaciente', 'IdProntuario', 'DataColeta', 'SwabNasal', 'SwabRetal', 'Sangue', 'Urina', 'SecrecaoTraqueal', 'Outros'],
      properties: {
        IdMicrobiologia: {
          type: 'integer'
        },
        IdPaciente: {
          type: 'integer'
        },
        IdProntuario: {
          type: 'integer'
        },
        DataColeta: {
          type: 'string'
        },
        DataResultado: {
          type: ['string', 'null']
        },
        SwabNasal: {
          type: 'string'
        },
        SwabNasalObservacoes: {
          type: ['string', 'null']
        },
        SwabRetal: {
          type: 'string'
        },
        SwabRetalObservacoes: {
          type: ['string', 'null']
        },
        Sangue: {
          type: 'string'
        },
        SangueObservacoes: {
          type: ['string', 'null']
        },
        Urina: {
          type: 'string'
        },
        UrinaObservacoes: {
          type: ['string', 'null']
        },
        SecrecaoTraqueal: {
          type: 'string'
        },
        SecrecaoTraquealObservacoes: {
          type: ['string', 'null']
        },
        Outros: {
          type: 'string'
        },
        OutrosObservacoes: {
          type: ['string', 'null']
        },
        PerfilSensibilidade: {
          type: ['string', 'null']
        },
      }
    }
  }
}
