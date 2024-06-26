import { prisma } from "../lib/dbConnect.js"
export * as brochureController from "./brochure.controller.js"
import { verifyToken } from "../lib/tokenHandler.js"

// Create brochure
export const createBrochure = async (req, res, next) => {
  try {
    const { image } = req.body

    const newBrochure = await prisma.brochures.create({
      data: {
        image,
      },
    })

    res.status(201).json({ success: true, data: newBrochure })
  } catch (error) {
    next(error)
  }
}

// Get all brochures
export const getAllBrochures = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const brochures = await prisma.brochures.findMany()

    res.json({ success: true, data: brochures })
  } catch (error) {
    next(error)
  }
}

// Get brochure by ID
export const getBrochureById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const brochureId = parseInt(req.params.id)

    const brochure = await prisma.brochures.findUnique({
      where: { id: brochureId },
    })

    if (!brochure) {
      return res.status(404).json({
        status: 404,
        message: "Brochure not found.",
      })
    }

    res.json({ success: true, data: brochure })
  } catch (error) {
    next(error)
  }
}

// Update brochure by ID
export const updateBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const brochureId = parseInt(req.params.id)
    const { image } = req.body

    const updatedBrochure = await prisma.brochures.update({
      where: { id: brochureId },
      data: {
        image,
      },
    })

    res.json({ success: true, data: updatedBrochure })
  } catch (error) {
    next(error)
  }
}

// Delete brochure by ID
export const deleteBrochure = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const brochureId = parseInt(req.params.id)

    const deletedBrochure = await prisma.brochures.delete({
      where: { id: brochureId },
    })

    res.json({ success: true, data: deletedBrochure })
  } catch (error) {
    next(error)
  }
}
