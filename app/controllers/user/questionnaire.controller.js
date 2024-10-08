import { prisma } from "../../lib/dbConnect.js";
import { verifyToken } from "../../lib/tokenHandler.js";

export const createQuestionnaire = async (req, res, next) => {
  try {
    const { type, questionnaire_questions } = req.body

    const newQuestionnaire = await prisma.questionnaires.create({
      data: {
        type,
        questionnaire_questions: {
          create: questionnaire_questions,
        },
      },
      include: {
        questionnaire_questions: true,
      },
    })

    res.status(201).json({ success: true, data: newQuestionnaire })
  } catch (error) {
    next(error)
  }
}

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

export const updateQuestionnaire = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)
    const { type } = req.body

    const updatedQuestionnaire = await prisma.questionnaires.update({
      where: { id: questionnaireId },
      data: {
        type,
      },
      include: {
        questionnaire_questions: true,
      },
    })

    res.json({ success: true, data: updatedQuestionnaire })
  } catch (error) {
    next(error)
  }
}

export const deleteQuestionnaire = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const questionnaireId = parseInt(req.params.id)

    const deletedQuestionnaire = await prisma.questionnaires.delete({
      where: { id: questionnaireId },
    })

    res.json({ success: true, data: deletedQuestionnaire })
  } catch (error) {
    next(error)
  }
}

export * as userQuestionnaireController from "./questionnaire.controller.js";