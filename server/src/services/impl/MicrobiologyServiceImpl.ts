import { IMicrobiology } from "../../interfaces/MicrobiologyInterface";
import { MicrobiologyService } from "../MicrobiologyService";
import knex from "../../database/connection";

class MicrobiologyServiceImpl implements MicrobiologyService {
  async create(data: IMicrobiology) {
    await knex("Microbiologia").insert(data);
  }

  async findById(id: number) {
    const [microbiology] = await knex("Microbiologia").where({ IdMicrobiologia: id });
    return microbiology;
  }

  async update(id: number, data: IMicrobiology) {
    await knex("Microbiologia").update(data).where({ IdMicrobiologia: id });
  }

  async delete(id: number) {
    await knex("Microbiologia").where({ IdMicrobiologia: id }).delete();
  }

  async show(id:number) {
    return await knex("Microbiologia")
      .where({ IdMicrobiologia: id })
      .join("Prontuario", "Prontuario.SeqProntuario", "=", "Microbiologia.IdProntuario")
      .join("Paciente", "Paciente.SeqPaciente", "=", "Microbiologia.IdPaciente")
      .select("Microbiologia.*", "Prontuario.NroProntuario", "Paciente.NomePaciente", "Paciente.NroPaciente");
  }
}

export default new MicrobiologyServiceImpl();
