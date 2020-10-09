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
    const { NroPaciente, NomePaciente, DataNascimento, Genero } = request.body;
    if(NroPaciente && NomePaciente && DataNascimento && Genero){
        const patientDB = await knex('Paciente').where('NroPaciente', NroPaciente);
        if(!patientDB[0]){
            await knex("Paciente").insert({
                NroPaciente, 
                NomePaciente, 
                DataNascimento, 
                Genero
            }).then(patientNumber => {
              return response.json({createdPatient: true, patientData: {NomePaciente, DataNascimento, Genero, patientNumber: patientNumber[0]}})
            }).catch(err => {
              return response.json({createdPatient: false, error: "Não foi possível inserir o paciente no banco de dados.", err: err})              
            })
        }else{
            return response.json({createdPatient: false, error: "Não foi possível inserir o paciente no banco de dados. Código já existente"})
        }
    }else{
        return response.json({createdPatient: false, error: "Verifique os dados inseridos e tente novamente."})
    }
  }

  // Método para listar pacientes:
  async index(request: Request, response: Response) {
    var page = String(request.query.page);
    if(!page){
        page="10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;
    const patients = await knex.select("*").from("Paciente").offset((pageRequest-1)*rows).limit(rows);
    if(patients[0]){
        const patientsLength = await knex("Paciente").count('NroPaciente');
        return response.json({patientFound: true, patients, length: patientsLength, length1: patients.length});
    }else{
        return response.json({patientFound: false, error: "Pacientes não encontrados."});
    }
  }

  // Método para listar pacientes pelo nome:
  async indexByName(request: Request, response: Response) {
    const { name } = request.query;
    var page = String(request.query.page);
    if(!page){
        page="10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('NomePaciente', 'like', `%${name}%`).offset((pageRequest-1)*rows).limit(rows);
    const patient = patientDB[0];
    if (patient) {
        const patientLength = (await knex("Paciente").count('NroPaciente').where('NomePaciente', 'like', `%${name}%`));
        return response.json({
            patientFound: true,
            patients: patientDB,
            length: patientLength,
            length1: patientDB.length
        });
    }else{
        return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

  // Método para listar pacientes pelo id:
  async indexById(request: Request, response: Response) {
    const { NroPaciente } = request.query;
    var page = String(request.query.page);
    if(!page){
        page="10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('NroPaciente', 'like', `%${NroPaciente}%`).offset((pageRequest-1)*rows).limit(rows).orderBy("NroPaciente");
    const patient = patientDB[0];
    if (patient) {
        const patientLength = (await knex("Paciente").count('NroPaciente').where('NroPaciente', 'like', `%${NroPaciente}%`));
        return response.json({
            patientFound: true,
            patients: patientDB,
            length: patientLength,
            length1: patientDB.length
        });
    }else{
        return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

  // Método para listar pacientes pela data de nascimento:
  async indexByBirthday(request: Request, response: Response) {
    const { DataNascimento } = request.query;
    var page = String(request.query.page);
    if(!page){
        page="10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('DataNascimento', 'like', `%${DataNascimento}%`).offset((pageRequest-1)*rows).limit(rows);
    const patient = patientDB[0];
    if (patient) {
        const patientLength = (await knex("Paciente").count('NroPaciente').where('DataNascimento', 'like', `%${DataNascimento}%`));
        return response.json({
            patientFound: true,
            patients: patientDB,
            length: patientLength,
            length1: patientDB.length
        });
    }else{
        return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

    async update(request: Request, response: Response){
        const {NroPaciente} = request.params;
        const {NomePaciente, DataNascimento, Genero} = request.body;
        
        if(NomePaciente && DataNascimento && Genero){
            await knex("Paciente").where("NroPaciente", NroPaciente).update({
                NomePaciente: NomePaciente,
                DataNascimento: DataNascimento,
                Genero: Genero
            }).then(responseDB => {
                if(responseDB === 1){
                    return response.json({updatedPatient: true})
                }else{
                    return response.json({updatedPatient: false, error: "Não foi possível alterar os dados do paciente."})
                }
            }).catch(err =>{
                return response.json({updatedPatient: false, error: "Erro na atualização do paciente.", err})
            })
        }else{
            return response.json({updatedPatient: false, error: "Verifique os dados inseridos e tente novamente."})
        }
    }

  // Método para deletar um paciente:
  async delete(request: Request, response: Response) {
    const { NroPaciente } = request.params;
    const patient = await knex("Paciente").where("NroPaciente", NroPaciente);
    console.log(patient)
    if (patient) {
      await knex("Paciente").where("NroPaciente", NroPaciente).delete();
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
