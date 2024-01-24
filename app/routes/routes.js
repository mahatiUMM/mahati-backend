import { Router } from "express";
import { tokenValidation } from "../lib/tokenHandler.js";

import { eventController } from "../controllers/event.controller.js";
import { authController } from "../controllers/auth.controller.js";
import { reportController } from "../controllers/report.controller.js";
import { userController } from "../controllers/user.controller.js";
import { exchangeTransaction } from "../controllers/exchange.controller.js";
import { bloodPressureController } from "../controllers/bloodPressure.controller.js";

const routes = Router({ strict: true });

// auth
routes.post("/signup", authController.signUp);
routes.post("/signin", authController.signIn);
routes.get(
  "/refresh",
  tokenValidation(true),
  authController.refreshAccessToken
);
routes.get("/profile", tokenValidation(), authController.getUser);

//blood pressures
routes.get("/blood_pressure", bloodPressureController.getAllBloodPressures);
routes.get("/blood_pressure/:id", bloodPressureController.getBloodPressureById);
routes.post("/blood_pressure", bloodPressureController.createBloodPressure);
routes.put("/blood_pressure/:id", bloodPressureController.updateBloodPressure);
routes.delete(
  "/blood_pressure/:id",
  bloodPressureController.deleteBloodPressure
);


export default routes;
