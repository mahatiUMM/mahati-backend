import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminUserController } from "../../controllers/admin/user.controller.js";
import { imageUploader } from "../../lib/multerStorage.js";

const routes = Router({ strict: true });

routes.get(
  "/users",
  tokenValidation(),
  adminUserController.getAllUsers
);
routes.get(
  "/profile",
  tokenValidation(),
  adminUserController.getUser
);
routes.put(
  "/profile",
  tokenValidation(),
  imageUploader.single("image"),
  adminUserController.updateUser
);

export default routes;