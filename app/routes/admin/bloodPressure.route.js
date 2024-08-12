import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminBloodPressureController } from "../../controllers/admin/bloodPressure.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/blood_pressure",
  tokenValidation(),
  adminBloodPressureController.getAllBloodPressures
);
routes.get(
  "/blood_pressure/:id",
  tokenValidation(),
  adminBloodPressureController.getBloodPressureById
);
routes.post(
  "/blood_pressure",
  tokenValidation(),
  adminBloodPressureController.createBloodPressure
);
routes.put(
  "/blood_pressure/:id",
  tokenValidation(),
  adminBloodPressureController.updateBloodPressure
);
routes.delete(
  "/blood_pressure/:id",
  tokenValidation(),
  adminBloodPressureController.deleteBloodPressure
);

export default routes;