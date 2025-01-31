import { Router } from "express";
import { tokenValidation } from "../../lib/tokenHandler.js";
import { adminQuestionnaireAnswerController } from "../../controllers/admin/questionnaireAnswer.controller.js";

const routes = Router({ strict: true });

routes.get(
  "/questionnaire_answer",
  tokenValidation(),
  adminQuestionnaireAnswerController.getAllQuestionnaireAnswer
)

routes.put(
  "/questionnaire_answer/:id",
  tokenValidation(),
  adminQuestionnaireAnswerController.updateQuestionnaireAnswer
)

routes.delete(
  "/questionnaire_answer/:id",
  tokenValidation(),
  adminQuestionnaireAnswerController.deleteQuestionnaireAnswer
)

export default routes;