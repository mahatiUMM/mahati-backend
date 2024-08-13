import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminBrochureController } from "../../controllers/admin/brochure.controller";
import { imageUploader } from "../../lib/multerStorage.js";

const routes = Router({ strict: true });

routes.get(
  "/brochure",
  tokenValidation(),
  adminBrochureController.getAllBrochures
);
routes.get(
  "/brochure/:id",
  tokenValidation(),
  adminBrochureController.getBrochureById
);
routes.post(
  "/brochure",
  tokenValidation(),
  imageUploader.array("images", 10),
  adminBrochureController.createBrochure
);
routes.put(
  "/brochure/:id",
  tokenValidation(),
  imageUploader.array("images", 10),
  adminBrochureController.updateBrochure
);
routes.delete(
  "/brochure/:id",
  tokenValidation(),
  adminBrochureController.deleteBrochure
);

export default routes;