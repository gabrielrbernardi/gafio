import express from "express";
import NotificationController from "../controllers/Notification";

const routes = express.Router();
const notification = new NotificationController();

//Routes to User CRUD
routes.get("/notifications", notification.index);
routes.get("/notifications/id/:id", notification.showId);
routes.post("/notifications", notification.create);
routes.put("/notifications/status/:id", notification.updateStatus);
routes.delete("/notifications/:id", notification.delete);

export default routes;
