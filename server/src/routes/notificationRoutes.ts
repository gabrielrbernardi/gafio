import express from "express";
import NotificationController from "../controllers/Notification";

const routes = express.Router();
const notification = new NotificationController();

//Routes to User CRUD
routes.get("/notifications", notification.index);
routes.post("/notifications", notification.create);
routes.get("/notifications/id/:id", notification.showId);

export default routes;
