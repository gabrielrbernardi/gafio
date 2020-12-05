import express from "express";
import MedicineController from "../controllers/Medicines";

const routes = express.Router();

const medicineController = new MedicineController();

routes.post("/medicines", medicineController.create);

routes.get("/medicines/ean/", medicineController.indexByEan);
routes.get("/medicines/principle/", medicineController.indexByPrinciple);
routes.get("/medicines/class/", medicineController.indexByClass);
routes.get('/medicines/page/', medicineController.indexByPage);

routes.put("medicines/:id", medicineController.update)

routes.delete("/medicines/:id", medicineController.delete);

export default routes;
