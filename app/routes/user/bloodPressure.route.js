import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userBloodPressureController } from "../../controllers/user/bloodPressure.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/blood_pressure",
  tokenValidation(),
  userBloodPressureController.getAllBloodPressures
);
routes.get(
  "/blood_pressure/:id",
  tokenValidation(),
  userBloodPressureController.getDetailedBloodPressureById
);
routes.post(
  "/blood_pressure",
  tokenValidation(),
  userBloodPressureController.createBloodPressure
);
routes.put(
  "/blood_pressure/:id",
  tokenValidation(),
  userBloodPressureController.updateBloodPressure
);
routes.delete(
  "/blood_pressure/:id",
  tokenValidation(),
  userBloodPressureController.deleteBloodPressure
);

export default routes;