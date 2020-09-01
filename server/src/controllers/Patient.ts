/****************************************
| Data: 31/08/2020                      |
| Resumo: Controlador Pacientes (CRUD)  |
| Sistema: GAFio                        |
****************************************/

import { Request, Response } from "express";
import knex from "../database/connection";

class PatientController {
  // Método para cadastro de um paciente
  async create(request: Request, response: Response) {
    const { IdPaciente, NomePaciente, DataNascimento, Genero } = request.body;

    await knex("Paciente").insert({
      IdPaciente, 
      NomePaciente, 
      DataNascimento, 
      Genero
    });

    return response.json({ IdPaciente, NomePaciente, DataNascimento, Genero });
  }

  // Método para listar pacientes:
  async index(request: Request, response: Response) {
    const patients = await knex.select("*").from("Paciente");

    return response.json(patients);
  }

  // Método para listar pacientes pelo nome:
  async indexByName(request: Request, response: Response) {
    const { name } = request.params;
    const filteredPatients = await knex("Paciente").where("NomePaciente", name);

    return response.json(filteredPatients);
  }

  // Método para listar pacientes pelo id:
  async indexById(request: Request, response: Response) {
    const { id } = request.params;
    const filteredPatients = await knex("Paciente").where("IdPaciente", id);

    return response.json(filteredPatients);
  }

  // Método para listar pacientes pela data de nascimento:
  async indexByBirthday(request: Request, response: Response) {
    const { birthday } = request.params;
    const filteredPatients = await knex("Paciente").where("DataNascimento", birthday);

    return response.json(filteredPatients);
  }

  // Método para deletar um paciente:
  async delete(request: Request, response: Response) {
    const { IdPaciente } = request.body;
    const patient = await knex("Paciente").where("IdPaciente", IdPaciente);

    if (patient) {
      await knex("Paciente").where("IdPaciente", IdPaciente).delete();
      return response.json({ deletedPatient: true });
    }
    else {
      return response.json({
        deletedPatient: false,
        error: "Paciente não encontrado.",
      });
    }
  }
}

export default PatientController;
