import {
  PrismaClient,
  type Profile,
  type User,
} from "../generated/prisma/client.js";

const prisma = new PrismaClient();

class UserRepository {
  static async queryById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  static async queryByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async createNewUser(user: User) {
    return await prisma.user.create({
      data: user,
    });
  }
}
export default UserRepository;
