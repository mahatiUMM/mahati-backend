import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userController } from "../../controllers/user/user.controller.js";
import { imageUploader } from "../../lib/multerStorage.js";

const routes = Router({ strict: true });

routes.get(
  "/profile",
  tokenValidation(),
  userController.getUser
);
routes.put(
  "/profile",
  tokenValidation(),
  imageUploader.single("image"),
  userController.updateUser
);

export default routes;