import express from "express";
import MedicineController from "../controllers/Medicines";

const routes = express.Router();

const medicineController = new MedicineController();

routes.get("/medicines", medicineController.index);
routes.get(
  "/medicines/principio/:principio",
  medicineController.indexByPrincipio
);
routes.get("/medicines/ean/:ean", medicineController.indexByEan);
routes.get("/medicines/classe/:classe", medicineController.indexByClasse);

routes.post("/medicines", medicineController.create);

routes.delete("/medicines/delete/:ean", medicineController.delete);
