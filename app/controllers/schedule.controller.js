import { prisma } from "../lib/dbConnect.js"
export * as scheduleController from "./schedule.controller.js"
import { verifyToken } from "../lib/tokenHandler.js"

// Create schedule
export const createSchedule = async (req, res, next) => {
  try {
    const { reminder_id, time, status } = req.body

    const newSchedule = await prisma.schedules.create({
      data: {
        reminder_id,
        time,
        status,
      },
    })

    res.status(201).json({ success: true, data: newSchedule })
  } catch (error) {
    next(error)
  }
}

// Get all schedules
export const getAllSchedules = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const schedules = await prisma.schedules.findMany({
      include: {
        reminder: true,
      },
    })

    res.json({ success: true, data: schedules })
  } catch (error) {
    next(error)
  }
}

// Get schedule by ID
export const getScheduleById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const scheduleId = parseInt(req.params.id)

    const schedule = await prisma.schedules.findUnique({
      where: { id: scheduleId },
      include: {
        reminder: true,
      },
    })

    if (!schedule) {
      return res.status(404).json({
        status: 404,
        message: "Schedule not found.",
      })
    }

    res.json({ success: true, data: schedule })
  } catch (error) {
    next(error)
  }
}

// Update schedule by ID
export const updateSchedule = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const scheduleId = parseInt(req.params.id)
    const { reminder_id, time, status } = req.body

    const updatedSchedule = await prisma.schedules.update({
      where: { id: scheduleId },
      data: {
        reminder_id,
        time,
        status,
      },
      include: {
        reminder: true,
      },
    })

    res.json({ success: true, data: updatedSchedule })
  } catch (error) {
    next(error)
  }
}

// Delete schedule by ID
export const deleteSchedule = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const scheduleId = parseInt(req.params.id)

    const deletedSchedule = await prisma.schedules.delete({
      where: { id: scheduleId },
    })

    res.json({ success: true, data: deletedSchedule })
  } catch (error) {
    next(error)
  }
}
