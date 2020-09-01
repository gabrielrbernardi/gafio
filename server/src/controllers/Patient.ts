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
