import { prisma } from "../app/lib/dbConnect";
import bcrypt from "bcrypt";

export const removeTestUser = async () => {
  await prisma.users.deleteMany({
    where: {
      username: "test",
    }
  })
};

export const createTestUser = async () => {
  await prisma.users.create({
    data: {
      username: "test",
      password: await bcrypt.hash("secret", 10),
      email: "test@gmail.com",
      isAdmin: false,
      number: "081234567890",
    },
  })
};

export const getTestUser = async () => {
  return prisma.users.findFirst({
    where: {
      username: "test",
      email: "test@gmail.com"
    }
  });
};