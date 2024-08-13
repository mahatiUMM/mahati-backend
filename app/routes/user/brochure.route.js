import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userBrochureController } from "../../controllers/user/brochure.controller.js";
import { imageUploader } from "../../lib/multerStorage.js";

const routes = Router({ strict: true });

routes.get(
  "/brochure",
  tokenValidation(),
  userBrochureController.getAllBrochures
);
routes.get(
  "/brochure/:id",
  tokenValidation(),
  userBrochureController.getBrochureById
);
routes.post(
  "/brochure",
  tokenValidation(),
  imageUploader.array("images", 10),
  userBrochureController.createBrochure
);
routes.put(
  "/brochure/:id",
  tokenValidation(),
  imageUploader.array("images", 10),
  userBrochureController.updateBrochure
);
routes.delete(
  "/brochure/:id",
  tokenValidation(),
  userBrochureController.deleteBrochure
);

export default routes;