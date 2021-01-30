import { Model } from "objection";
import knexConnection from "../database/connection";
import { MicrobiologyModel } from "./MicrobiologyModel";

Model.knex(knexConnection);

export class PatientModel extends Model {
    static get tableName() {
        return "Paciente";
    }

    static get idColumn() {
        return "SeqPaciente";
    }

    static get relationMappings() {
        return {
            Microbiologia: {
                relation: Model.HasManyRelation,
                modelClass: MicrobiologyModel,
                join: {
                    from: "Paciente.SeqPaciente",
                    to: "Microbiologia.IdPaciente",
                },
            },
        };
    }
}
