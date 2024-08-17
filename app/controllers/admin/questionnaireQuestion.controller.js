import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";
import { getUserById } from "../../lib/userHandler.js";

export const createQuestionnaireQuestion = async (req, res, next) => {
  try {
    const { questionnaire_id, question, available_answer } = req.body;

    const newQuestionnaireQuestion =
      await prisma.questionnaire_questions.create({
        data: {
          questionnaire_id: parseInt(questionnaire_id),
          available_answers: {
            create: available_answer,
          },
          question,
        },
      });

    res.status(201).json({ success: true, data: newQuestionnaireQuestion });
  } catch (error) {
    next(error);
  }
}

export const createQuestionnaireQuestionAnswer = async (req, res, next) => {
  try {
    const { user_id, answers } = req.body;

    for (const answer of answers) {
      await prisma.questionnaire_answers.create({
        data: {
          user_id: user_id,
          question_id: answer.questionnaireQuestionId,
          answer: answer.answerId,
        },
      });
    }

    res.status(201).json({ success: true, msg: "Success Input Survey Data" });
  } catch (error) {
    next(error);
  }
}

export const getAllQuestionnaireQuestions = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const questionnaireQuestions =
        await prisma.questionnaire_questions.findMany({
          include: {
            questionnaire: true,
            questionnaire_answers: true,
          },
        });

      res.json({ success: true, data: questionnaireQuestions });
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

export const getQuestionnaireQuestionById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const questionnaireQuestionId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const questionnaireQuestion =
        await prisma.questionnaire_questions.findUnique({
          where: { id: questionnaireQuestionId },
          include: {
            questionnaire: true,
            questionnaire_answers: true,
          },
        });

      res.json({ success: true, data: questionnaireQuestion });
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

export const updateQuestionnaireQuestion = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const questionnaireQuestionId = parseInt(req.params.id);
    const { questionnaire_id, question } = req.body;

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      const updatedQuestionnaireQuestion =
        await prisma.questionnaire_questions.update({
          where: { id: questionnaireQuestionId },
          data: {
            questionnaire_id,
            question,
          },
        });

      res.json({ success: true, data: updatedQuestionnaireQuestion });
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

export const deleteQuestionnaireQuestion = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token);
    if (data?.status) return res.status(data.status).json(data);

    const questionnaireQuestionId = parseInt(req.params.id);

    const user = await getUserById(data.id);

    if (user.isAdmin) {
      await prisma.questionnaire_questions.delete({
        where: { id: questionnaireQuestionId },
      });

      res.json({ success: true, msg: "Questionnaire question deleted." });
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

export * as adminQuesionnaireQuestionController from "./questionnaireQuestion.controller.js";