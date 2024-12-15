import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const getAllQuestionnaires = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaires = await prisma.questionnaires.findMany({
      include: {
        questionnaire_questions: {
          include: {
            available_answers: true
          }
        },
      },
    })

    res.json({ success: true, data: questionnaires })
  } catch (error) {
    next(error)
  }
}

export const getQuestionnaireById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)

    const questionnaire = await prisma.questionnaires.findUnique({
      where: { id: questionnaireId },
      include: {
        questionnaire_questions: {
          include: {
            available_answers: true
          }
        },
      },
    })

    if (!questionnaire) {
      return res.status(404).json({
        status: 404,
        message: "Questionnaire not found.",
      })
    }

    res.json({ success: true, data: questionnaire })
  } catch (error) {
    next(error)
  }
}

export * as userQuestionnaireController from "./questionnaire.controller.js";