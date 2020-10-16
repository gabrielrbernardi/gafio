//CRUD de medicamentos

import { Request, Response } from "express";
import knex from "../database/connection";

class MedicinesController {
  async create(request: Request, response: Response) {
    const {
      EAN,
      PrincipioAtivo,
      Registro,
      Laboratorio,
      Produto,
      Apresentacao,
      ClasseTerapeutica,
      CNPJ
    } = request.body;

    const medicine = await knex("Medicamentos").insert({
      EAN,
      PrincipioAtivo,
      Registro,
      Laboratorio,
      Produto,
      Apresentacao,
      ClasseTerapeutica,
      CNPJ
    });
    
    return response.json(medicine);
  }

  async index(request: Request, response: Response) {
    const medicines = await knex("Medicamentos").select("*");

    return response.json(medicines); 
  }

  async indexByPrincipio(request: Request, response: Response) {
    const { principio } = request.params;
    const medicine = await knex("Medicamentos").where(
      "PrincipioAtivo",
      principio
    );

    return response.json(medicine);
  }

  async indexByClasse(request: Request, response: Response) {
    const { classe } = request.params;
    const medicine = await knex("Medicamentos").where(
      "ClasseTerapeutica",
      classe
    );

    return response.json(medicine);
  }

  async indexByEan(request: Request, response: Response) {
    const { ean } = request.params;
    const medicine = await knex("Medicamentos").where("EAN", ean);

    return response.json(medicine);
  }

  async indexByPage(request: Request, response: Response) {
    const { page } = request.params;
    const pageRequest = parseInt(page) / 10;
    const rows = 10;
    const medicine = await knex("Medicamentos").select("*").offset((pageRequest-1) * rows).limit(rows);
    const medicinesLength = (await knex("Medicamentos").select("*")).length;

    return response.json({ medicine: medicine, length: medicinesLength });
  }

  async delete(request: Request, response: Response) {
    const { ean } = request.params;
    const medicine = await knex("Medicamentos").where("EAN", ean);

    if (medicine) {
      await knex("Medicamentos").where("EAN", ean).delete();
      return response.json({ Deleted: true });
    }
    else {
      return response.json({
        deleted: false,
        error: "Medicamento não encontrado.",
      });
    }
  }
}

export default MedicinesController;
