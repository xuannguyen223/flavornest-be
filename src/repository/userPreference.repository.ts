import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

class UserPreferenceRepository {
  static async queryAllByUserId(userId: string) {
    return await prisma.userCategoryPreference.findMany({
      where: { userId },
      include: {
        category: true,
      },
    });
  }

  static async upsertUserPreference(userId: string, categoryId: string) {
    return await prisma.userCategoryPreference.upsert({
      where: {
        userId_categoryId: { userId, categoryId },
      },
      update: {},
      create: { userId, categoryId },
    });
  }

  static async deleteAllByUserId(userId: string) {
    return await prisma.userCategoryPreference.deleteMany({
      where: { userId },
    });
  }
}
export default UserPreferenceRepository;
