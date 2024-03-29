/****************************************
| Data: 31/08/2020                      |
| Resumo: Controlador Pacientes (CRUD)  |
| Sistema: GAFio                        |
****************************************/

import {Request, Response} from "express";
import knex from "../database/connection";
import {parse} from "querystring";
import PatientLog from '../jobs/PatientLog';
import {id} from "date-fns/locale";

class PatientController { // Método para cadastro de um paciente
  async create(request : Request, response : Response) {
    const {
      NroPaciente,
      NomePaciente,
      DataNascimento,
      Genero,
      email
    } = request.body;
    console.log(email)
    if (NroPaciente && NomePaciente && DataNascimento && Genero) {
      const patientDB = await knex('Paciente').where('NroPaciente', NroPaciente);
      if (! patientDB[0]) {
        var parseDataNascimento0 = DataNascimento.substring(0, 10);
        parseDataNascimento0 = parseDataNascimento0.split("-");
        const newDataNascimento = parseDataNascimento0[2] + '/' + parseDataNascimento0[1] + '/' + parseDataNascimento0[0]
        
        // Se encontrar caracteres especiais, retorna erro
        if (!/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/.test(NomePaciente)) {
          return response.json({updatedPatient: false, error: "Formato de entrada inválido no campo de nome."})
        }
        
        // Formatação de nome
        const prepositions = {
          "DA": "da",
          "DAS": "das",
          "DE": "de",
          "DI": "di",
          "DO": "do",
          "DOS": "dos",
          "E": "e"
        }
          
        // Formata nome
        const formattedName = NomePaciente.toUpperCase().split(" ").reduce((formattedName, current) => {
          if (prepositions[current])
            return formattedName += prepositions[current];
          else
            return formattedName += current[0];
          
        }, "");

        await knex("Paciente").insert({NroPaciente, NomePaciente: formattedName, DataNascimento: newDataNascimento, Genero}).then(patientNumber => {
          PatientLog.handleSuccessfulCreation(email);
          return response.json({
            createdPatient: true,
            patientData: {
              NomePaciente,
              DataNascimento,
              Genero,
              patientNumber: patientNumber[0]
            }
          })
        }).catch(err => {
          PatientLog.handleUnsuccessfulCreation(email, err);
          return response.json({createdPatient: false, error: "Não foi possível inserir o paciente no banco de dados.", err: err})
        })
      } else {
        PatientLog.handleUnsuccessfulCreation(email, "paciente existente");
        return response.json({createdPatient: false, error: "Não foi possível inserir o paciente no banco de dados. Número do paciente já existente."})
      }
    } else {
      PatientLog.handleUnsuccessfulCreation(email, "dados incorretos");
      return response.json({createdPatient: false, error: "Verifique os dados inseridos e tente novamente."})
    }
  }

  // Método para listar pacientes:
  async index(request : Request, response : Response) {
    var page = String(request.query.page);
    if (! page) {
      page = "10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;
    const patients = await knex.select("*").from("Paciente").offset((pageRequest - 1) * rows).limit(rows);
    if (patients[0]) {
      const patientsLength = await knex("Paciente").count('NroPaciente');
      return response.json({patientFound: true, patients, length: patientsLength, length1: patients.length});
    } else {
      return response.json({patientFound: false, error: "Pacientes não encontrados."});
    }
  }

  // Método para listar pacientes pelo nome:
  async indexByName(request : Request, response : Response) {
    const {name} = request.query;
    var page = String(request.query.page);
    if (! page) {
      page = "10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('NomePaciente', 'like', `%${name}%`).offset((pageRequest - 1) * rows).limit(rows);
    const patient = patientDB[0];
    if (patient) {
      const patientLength = (await knex("Paciente").count('NroPaciente').where('NomePaciente', 'like', `%${name}%`));
      return response.json({patientFound: true, patients: patientDB, length: patientLength, length1: patientDB.length});
    } else {
      return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

  // Método para listar pacientes pelo id:
  async indexById(request : Request, response : Response) {
    const {nroPaciente} = request.query;
    var page = String(request.query.page);
    if (! page) {
      page = "10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('NroPaciente', 'like', `%${nroPaciente}%`).offset((pageRequest - 1) * rows).limit(rows).orderBy("NroPaciente");
    const patient = patientDB[0];
    if (patient) {
      const patientLength = (await knex("Paciente").count('NroPaciente').where('NroPaciente', 'like', `%${nroPaciente}%`));
      return response.json({patientFound: true, patients: patientDB, length: patientLength, length1: patientDB.length});
    } else {
      return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

  // Método para listar pacientes pela data de nascimento:
  async indexByBirthday(request : Request, response : Response) {
    const {dataNascimento} = request.query;
    var page = String(request.query.page);
    if (! page) {
      page = "10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;

    const patientDB = await knex("Paciente").where('DataNascimento', 'like', `%${dataNascimento}%`).offset((pageRequest - 1) * rows).limit(rows);
    const patient = patientDB[0];
    if (patient) {
      const patientLength = (await knex("Paciente").count('NroPaciente').where('DataNascimento', 'like', `%${dataNascimento}%`));
      return response.json({patientFound: true, patients: patientDB, length: patientLength, length1: patientDB.length});
    } else {
      return response.json({patientFound: false, error: "Paciente não encontrado."})
    }
  }

  async searchPatientData(request : Request, response : Response) {
    var id = String(request.query.id);
    var page = String(request.query.page);
    if (! page) {
      page = "10";
    }
    var pageRequest = parseInt(page) / 10;
    const rows = 10;
    if (id) {
      const medicalRecordsLengthPatient = (await knex("Prontuario").count('SeqPaciente').where('SeqPaciente', id));
      const assessmentsLengthPatient = (await knex("Avaliacao").count('IdPaciente').where('IdPaciente', id));
      const parseMedicalRecordsLengthPatient = medicalRecordsLengthPatient[0]['count(`SeqPaciente`)'];
      const parseAssessmentsLengthPatient = assessmentsLengthPatient[0]['count(`IdPaciente`)'];
      return response.json({patientFound: true, medicalRecordsLength: parseMedicalRecordsLengthPatient, assessmentLength: parseAssessmentsLengthPatient});
    } else {
      return response.json({patientFound: false, error: "NroPaciente não fornecido."})
    }
  }

  async update(request : Request, response : Response) {
    const {SeqPaciente} = request.params;
    const {NomePaciente, DataNascimento, Genero, email} = request.body;

    var parseDataNascimento = DataNascimento.substring(0, 10);
    parseDataNascimento = parseDataNascimento.split("-");
    parseDataNascimento = parseDataNascimento[2] + '/' + parseDataNascimento[1] + '/' + parseDataNascimento[0]

    if (NomePaciente && DataNascimento && Genero) { // Formatação de nome
      const prepositions = {
        "DA": "da",
        "DAS": "das",
        "DE": "de",
        "DI": "di",
        "DO": "do",
        "DOS": "dos",
        "E": "e"
      }

      // Se encontrar caracteres especiais, retorna erro
      if (!/[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ]+$/.test(NomePaciente)) {
        return response.json({updatedPatient: false, error: "Formato de entrada inválido no campo de nome."})
      }

      // Formata nome
      const formattedName = NomePaciente.toUpperCase().split(" ").reduce((formattedName, current) => {
        if (prepositions[current]) 
          return formattedName += prepositions[current];
         else 
          return formattedName += current[0];
        
      }, "")

      await knex("Paciente").where("SeqPaciente", SeqPaciente).update({NomePaciente: formattedName, DataNascimento: parseDataNascimento, Genero: Genero}).then(responseDB => {
        if (responseDB === 1) {
          PatientLog.handleSuccessfulUpdate(email, Number(SeqPaciente));
          return response.json({updatedPatient: true})
        } else {
          PatientLog.handleUnsuccessfulUpdate(email, "erro no servidor", Number(SeqPaciente));
          return response.json({updatedPatient: false, error: "Não foi possível alterar os dados do paciente."})
        }
      }).catch(err => {
        PatientLog.handleUnsuccessfulUpdate(email, err, Number(SeqPaciente))
        return response.json({updatedPatient: false, error: "Erro na atualização do paciente.", err})
      })
    } else {
      PatientLog.handleUnsuccessfulUpdate(email, "dados incorretos", Number(SeqPaciente))
      return response.json({updatedPatient: false, error: "Verifique os dados inseridos e tente novamente."})
    }
  }

  // Método para exluir um paciente:
  async delete(request : Request, response : Response) {
    const {SeqPaciente, email} = request.params;
    console.log(request.body)
    try {
      const patient = await knex("Paciente").where("SeqPaciente", SeqPaciente);
      if (patient) {
        const assessmentsPatient = await knex("Avaliacao").where("IdPaciente", SeqPaciente);
        if (assessmentsPatient != []) {
          await knex("Avaliacao").where("IdPaciente", SeqPaciente).delete();
          await knex("Historico").where("IdPaciente", SeqPaciente).delete();
          await knex("Prontuario").where("SeqPaciente", SeqPaciente).delete();
          await knex("Paciente").where("SeqPaciente", SeqPaciente).delete();
          PatientLog.handleSuccessfulDelete(email, Number(SeqPaciente));
          return response.json({deletedPatient: true});
        } else {
          const medicalRecordsPatient = await knex("Prontuario").where("SeqPaciente", SeqPaciente);
          if (medicalRecordsPatient != []) {
            await knex("Prontuario").where("SeqPaciente", SeqPaciente).delete();
            await knex("Paciente").where("SeqPaciente", SeqPaciente).delete();
            PatientLog.handleSuccessfulDelete(email, Number(SeqPaciente));
            return response.json({deletedPatient: true});
          } else {
            await knex("Paciente").where("SeqPaciente", SeqPaciente).delete();
            PatientLog.handleSuccessfulDelete(email, Number(SeqPaciente));
            return response.json({deletedPatient: true});
          }
        }
      } else {
        PatientLog.handleUnsuccessfulDelete(email, "paciente inexistente", Number(SeqPaciente));
        return response.json({deletedPatient: false, error: "Paciente não encontrado."});
      }
    } catch (err) {
      PatientLog.handleUnsuccessfulDelete(email, err, Number(SeqPaciente));
      return response.json({deletedPatient: false, error: err});
    }
  }
}

export default PatientController;
