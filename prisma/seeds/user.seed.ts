import type { PrismaClient, User } from "../../src/generated/prisma/client";
import type { UsersMockType } from "../types";
import { getRandomIdx } from "../utils/get-random-idx.util";

export async function userSeed(prisma: PrismaClient): Promise<User[]> {
  console.log("👤 Seeding 10 users...");
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = (await res.json()) as UsersMockType[];

    if (users && users.length > 0) {
      for (const user of users) {
        await prisma.user.create({
          data: {
            email: user.email,
            password: `${user.username.toLowerCase()}123`,
            profile: {
              create: {
                name: user.name,
                age: getRandomIdx(30) + 18, // Random age between 18-47
                gender: Math.random() > 0.5 ? "MALE" : "FEMALE",
                bio: `This is ${user.name}'s bio. I love cooking and sharing recipes!`,
                avatarUrl: `https://api.dicebear.com/9.x/big-smile/svg?seed=${user.username}`,
              },
            },
          },
        });
      }
    } else {
      console.warn("No users found from mock API.");
    }
  } catch (error) {
    console.error("Error fetching users from mock API.", error);
  }

  console.log("✅ Users seeded successfully!");
  return await prisma.user.findMany();
}
