// CRUD de medicamentos

import {Request, Response} from "express";
import knex from "../database/connection";
import DiseaseLog from "../jobs/DiseaseLog";

import MediceneLog from '../jobs/MedicineLog';

class MedicinesController {
  async create(request : Request, response : Response) {
    const {
      EAN,
      PrincipioAtivo,
      CNPJ,
      Laboratorio,
      Registro,
      Produto,
      Apresentacao,
      ClasseTerapeutica,
      email
    } = request.body;

    try {
      const medicines = await knex("Medicamentos").insert({
        EAN,
        PrincipioAtivo,
        CNPJ,
        Laboratorio,
        Registro,
        Produto,
        Apresentacao,
        ClasseTerapeutica
      });

      DiseaseLog.handleSuccessfulCreation(email);
      return response.json(medicines);
    } catch (error) {
      DiseaseLog.handleUnsuccessfulCreation(email, error);
      return response.status(400).json({createdDisease: false, error});
    }
  }

  async index(request : Request, response : Response) {
    const medicines = await knex("Medicamentos").select("*");
    return response.json(medicines);
  }

  async indexByPrincipio(request : Request, response : Response) {
    const {principio} = request.params;
    const filteredMedicines = await knex("Medicamentos").where("PrincipioAtivo", principio);

    return response.json({filteredMedicines: true, medicines: filteredMedicines});
  }

  async indexByClasse(request : Request, response : Response) {
    const {classe} = request.params;
    const filteredMedicines = await knex("Medicamentos").where("ClasseTerapeutica", classe);

    return response.json({filteredMedicines: true, medicines: filteredMedicines});
  }

  async indexByEan(request : Request, response : Response) {
    const {ean} = request.params;
    const filteredMedicines = await knex("Medicamentos").where("EAN", ean);

    return response.json({filteredMedicines: true, medicines: filteredMedicines});
  }

  async indexByPage(request : Request, response : Response) {
    const {page} = request.params;
    const pageRequest = parseInt(page) / 10;
    const rows = 10;
    const medicines = await knex("Medicamentos").select("*").offset((pageRequest - 1) * rows).limit(rows);
    const medicinesLength = (await knex("Medicamentos").select("*")).length;

    return response.json({medicines, length: medicinesLength});
  }

  async delete(request : Request, response : Response) {
    const {ean} = request.params;
    const medicine = await knex("Medicamentos").where("EAN", ean);

    if (medicine) {
      await knex("Medicamentos").where("EAN", ean).delete();
      return response.json({Deleted: true});
    } else {
      return response.json({deleted: false, error: "Medicamento não encontrado."});
    }
  }
}

export default MedicinesController;
