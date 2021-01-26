import { IMicrobiology } from "../../interfaces/MicrobiologyInterface";
import { MicrobiologyService } from "../MicrobiologyService";
import knex from "../../database/connection";

class MicrobiologyServiceImpl implements MicrobiologyService {
    async create(data: IMicrobiology) {
        await knex("Microbiologia").insert(data);
    }

    async index(page: number, rows: number) {
        const [count] = await knex("Microbiologia").count({ count: "*" });
        const results = await knex("Microbiologia").limit(rows).offset((page - 1) * rows);

        return { results, count };
    }

    async findById(id: number) {
        const microbiology = await knex("Microbiologia").where({ IdMicrobiologia: id });
        return microbiology;
    }

    async findByIdPaciente(idPaciente: number, page: number, rows: number) {
        const [count] = await knex("Microbiologia").where({ IdPaciente: idPaciente }).count({ count: "*" });
        const results = await knex("Microbiologia").where({ IdPaciente: idPaciente }).limit(rows).offset((page - 1) * rows);

        return { results, count };
    }

    async findByIdProntuario(idProntuario: number, page: number, rows: number) {
        const [count] = await knex("Microbiologia").where({ IdProntuario: idProntuario }).count({ count: "*" });
        const results = await knex("Microbiologia").where({ IdProntuario: idProntuario }).limit(rows).offset((page - 1) * rows);

        return { results, count };
    }

    async findByDataColeta(dataColeta: string, page: number, rows: number) {
        const [count] = await knex("Microbiologia").where('DataColeta', 'LIKE', `%${dataColeta}%`).count({ count: "*" });
        const results = await knex("Microbiologia").where('DataColeta', 'LIKE', `%${dataColeta}%`).limit(rows).offset((page - 1) * rows);

        return { results, count };
    }

    async findByDataResultado(dataResultado: string, page: number, rows: number) {
        const [count] = await knex("Microbiologia").where('DataResultado', 'LIKE', `%${dataResultado}%`).count({ count: "*" });
        const results = await knex("Microbiologia").where('DataResultado', 'LIKE', `%${dataResultado}%`).limit(rows).offset((page - 1) * rows);

        return { results, count };
    }

    async update(id: number, data: IMicrobiology) {
        await knex("Microbiologia").update(data).where({ IdMicrobiologia: id });
    }

    async delete(id: number) {
        await knex("Microbiologia").where({ IdMicrobiologia: id }).delete();
    }

    async show(id: number) {
        return await knex("Microbiologia").where({ IdMicrobiologia: id })
            .join("Prontuario", "Prontuario.SeqProntuario", "=", "Microbiologia.IdProntuario")
            .join("Paciente", "Paciente.SeqPaciente", "=", "Microbiologia.IdPaciente")
            .select("Microbiologia.*", "Prontuario.NroProntuario", "Paciente.NomePaciente", "Paciente.NroPaciente");
    }
}

export default new MicrobiologyServiceImpl();
