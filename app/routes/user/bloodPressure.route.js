import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userBloodPressureController } from "../../controllers/user/bloodPressure.controller.js";
import { imageUploader } from "../../lib/multerStorage.js";

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
  imageUploader.single("image"),
  userBloodPressureController.createBloodPressure
);
routes.put(
  "/blood_pressure/:id",
  tokenValidation(),
  imageUploader.single("image"),
  userBloodPressureController.updateBloodPressure
);
routes.delete(
  "/blood_pressure/:id",
  tokenValidation(),
  userBloodPressureController.deleteBloodPressure
);

export default routes;