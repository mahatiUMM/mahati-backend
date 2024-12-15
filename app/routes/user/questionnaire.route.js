import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userQuestionnaireController } from "../../controllers/user/questionnaire.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/questionnaire",
  tokenValidation(),
  userQuestionnaireController.getAllQuestionnaires
);
routes.get(
  "/questionnaire/:id",
  tokenValidation(),
  userQuestionnaireController.getQuestionnaireById
);

export default routes;