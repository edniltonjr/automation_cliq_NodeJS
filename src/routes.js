const { Router } = require("express");
const CliqController = require("./controllers/CliqController");
const routes = Router();

routes.get("/enviarENG", CliqController.enviarENG);
routes.get("/status", CliqController.statusENG);

module.exports = routes;
