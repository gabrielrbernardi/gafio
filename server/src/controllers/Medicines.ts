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
    } = request.body;

    await knex("Medicamentos").insert({
      EAN,
      PrincipioAtivo,
      Registro,
      Laboratorio,
      Produto,
      Apresentacao,
      ClasseTerapeutica,
    });
    return response.json({
      EAN,
      PrincipioAtivo,
      Registro,
      Laboratorio,
      Produto,
      Apresentacao,
      ClasseTerapeutica,
    });
  }

  async index(request: Request, response: Response) {
    const medicines = await knex("Medicamentos").select("*");
    response.json(medicines);
  }

  async indexByPrincipio(request: Request, response: Response) {
    const { principio } = request.params;

    const filteredMedicine = await knex("Medicamentos").where(
      "PrincipioAtivo",
      principio
    );
    response.json(filteredMedicine);
  }

  async indexByClasse(request: Request, response: Response) {
    const { classe } = request.params;

    const filteredMedicine = await knex("Medicamentos").where(
      "ClasseTerapeutica",
      classe
    );
    response.json(filteredMedicine);
  }

  async indexByEan(request: Request, response: Response) {
    const { ean } = request.params;

    const filteredMedicine = await knex("Medicamentos").where("EAN", ean);
    response.json(filteredMedicine);
  }

  async delete(request: Request, response: Response) {
    const { ean } = request.params;

    const medicine = await knex("Medicamentos").where("EAN", ean);

    if (medicine) {
      await knex("Medicamentos").where("EAN", ean).delete();
      return response.json({ Deleted: true });
    } else {
      return response.json({
        deleted: false,
        error: "Medicamento não encontrado.",
      });
    }
  }
}

export default MedicinesController;
