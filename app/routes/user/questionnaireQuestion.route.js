import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { userQuestionnaireQuestionController } from "../../controllers/user/questionnaireQuestion.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/questionnaire_question",
  tokenValidation(),
  userQuestionnaireQuestionController.getAllQuestionnaireQuestions
);
routes.get(
  "/questionnaire_question/:id",
  tokenValidation(),
  userQuestionnaireQuestionController.getQuestionnaireQuestionById
);
routes.post(
  "/questionnaire_question",
  userQuestionnaireQuestionController.createQuestionnaireQuestion
);
routes.put(
  "/questionnaire_question/:id",
  tokenValidation(),
  userQuestionnaireQuestionController.updateQuestionnaireQuestion
);
routes.delete(
  "/questionnaire_question/:id",
  tokenValidation(),
  userQuestionnaireQuestionController.deleteQuestionnaireQuestion
);

export default routes;