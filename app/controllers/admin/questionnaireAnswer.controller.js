import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const getAllQuestionnaireAnswer = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const availableAnswer = await prisma.questionnaire_questions.findMany({
        include: {
          available_answers: true
        }
      })

      res.json({ success: true, data: availableAnswer });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const updateQuestionnaireAnswer = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { id } = req.params;
    const { answer_text } = req.body;
    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const availableAnswer = await prisma.available_answers.update({
        where: { id: parseInt(id) },
        data: {
          answer_text: answer_text
        }
      })

      res.json({ success: true, data: availableAnswer });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export const deleteQuestionnaireAnswer = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const { id } = req.params;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const isAvailableAnswer = await prisma.available_answers.findUnique({
        where: { id: parseInt(id) }
      })

      if (!isAvailableAnswer) {
        return res.status(404).json({ success: false, message: "Answer not found." });
      }

      const availableAnswer = await prisma.available_answers.delete({
        where: { id: parseInt(id) }
      })

      res.json({ success: true, message: "Answer deleted successfully.", data: availableAnswer });
    } else {
      res.status(403).json({
        status: 403,
        message: "You are not authorized to perform this action.",
      });
    }
  } catch (error) {
    next(error);
  }
}

export * as adminQuestionnaireAnswerController from "./questionnaireAnswer.controller.js";