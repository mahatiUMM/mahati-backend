import { Router } from "express";
import { userAuthController } from "../../controllers/user/auth.controller.js";

const routes = Router({ strict: true });

routes.post(
  "/signup",
  userAuthController.signUp
);
routes.post(
  "/signin",
  userAuthController.signIn
);
routes.post(
  "/refresh_token",
  userAuthController.refreshAccessToken
);

routes.put(
  '/forget_password', 
  userAuthController.forgetPassword)
  ;

export default routes;