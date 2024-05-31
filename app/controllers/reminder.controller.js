import { prisma } from "../lib/dbConnect.js"
export * as reminderController from "./reminder.controller.js"
import { verifyToken } from "../lib/tokenHandler.js"

// Create reminder
export const createReminder = async (req, res, next) => {
  try {
    const { user_id, medicine_name, medicine_taken, medicine_total, amount, cause, cap_size, medicine_time } = req.body

    if (!user_id || !medicine_name || !medicine_taken || !medicine_total || !amount || !cause || !cap_size || !medicine_time) {
      return res.status(400).json({
        status: 400,
        message: "Please provide all required fields.",
      })
    }

    const newReminder = await prisma.reminders.create({
      data: {
        user_id,
        medicine_name,
        medicine_taken,
        medicine_total,
        amount,
        cause,
        cap_size,
        medicine_time,
      },
    })

    res.status(201).json({ success: true, data: newReminder })
  } catch (error) {
    next(error)
  }
}

// Get all reminders
export const getAllReminders = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const reminders = await prisma.reminders.findMany({
      include: {
        user: true,
        schedules: true,
      },
    })

    res.json({ success: true, data: reminders })
  } catch (error) {
    next(error)
  }
}

// Get reminder by ID
export const getReminderById = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const reminderId = parseInt(req.params.id)

    const reminder = await prisma.reminders.findUnique({
      where: { id: reminderId },
      include: {
        user: true,
        schedules: true,
      },
    })

    if (!reminder) {
      return res.status(404).json({
        status: 404,
        message: "Reminder not found.",
      })
    }

    res.json({ success: true, data: reminder })
  } catch (error) {
    next(error)
  }
}

// Update reminder by ID
export const updateReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const reminderId = parseInt(req.params.id)
    const { user_id, medicine_name, medicine_taken, medicine_total, amount, cause, cap_size, medicine_time } = req.body

    const updatedReminder = await prisma.reminders.update({
      where: { id: reminderId },
      data: {
        user_id,
        medicine_name,
        medicine_taken,
        medicine_total,
        amount,
        cause,
        cap_size,
        medicine_time,
      },
      include: {
        user: true,
        schedules: true,
      },
    })

    res.json({ success: true, data: updatedReminder })
  } catch (error) {
    next(error)
  }
}

// Delete reminder by ID
export const deleteReminder = async (req, res, next) => {
  try {
    const data = verifyToken(req.headers.access_token)
    if (data?.status) return res.status(data.status).json(data)

    const reminderId = parseInt(req.params.id)

    const deletedReminder = await prisma.reminders.delete({
      where: { id: reminderId },
    })

    res.json({ success: true, data: deletedReminder })
  } catch (error) {
    next(error)
  }
}
