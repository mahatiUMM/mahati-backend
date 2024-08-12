import { prisma } from "./dbConnect.js";

export async function getUserById(id) {
  const user = await prisma.users.findUnique({
    where: { id: id },
  });
  return user;
}