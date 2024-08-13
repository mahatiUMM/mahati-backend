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
routes.post(
  "/questionnaire",
  tokenValidation(),
  userQuestionnaireController.createQuestionnaire
);
routes.put(
  "/questionnaire/:id",
  tokenValidation(),
  userQuestionnaireController.updateQuestionnaire
);
routes.delete(
  "/questionnaire/:id",
  tokenValidation(),
  userQuestionnaireController.deleteQuestionnaire
);

export default routes;