import { PrismaClient, type Profile } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

class UserProfileRepository {
  static async queryById(id: string) {
    return await prisma.profile.findUnique({ where: { userId: id } });
  }

  static async insertOrUpdateProfile(profileData: Profile) {
    return await prisma.profile.upsert({
      where: { userId: profileData.userId },
      update: profileData,
      create: profileData,
    });
  }
}
export default UserProfileRepository;
