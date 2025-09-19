import { PrismaClient } from "../generated/prisma/client.js";

const prisma = new PrismaClient();

class UserCollectionRepository {
  static async queryAllUserRecipeList(userId: string) {
    return await prisma.userRecipeList.findMany({
      where: { userId },
    });
  }

  static async queryUserRecipeListById(id: string) {
    return await prisma.userRecipeList.findUnique({
      where: { id },
    });
  }

  static async createUserRecipeList(userId: string, name: string) {
    return await prisma.userRecipeList.create({
      data: {
        name: name,
        userId: userId,
      },
    });
  }

  static async updateUserRecipeListName(id: string, updatedName: string) {
    return await prisma.userRecipeList.update({
      where: { id },
      data: {
        name: updatedName,
      },
    });
  }

  static async deleteUserRecipeList(id: string) {
    return await prisma.userRecipeList.delete({
      where: { id },
    });
  }

  static async queryAllRecipeByCollection(listId: string) {
    return await prisma.userRecipeListItem.findMany({
      where: { listId },
      include: {
        recipe: true,
      },
    });
  }

  static async createUserRecipeListItem(collectionId: string, recId: string) {
    return await prisma.userRecipeListItem.create({
      data: {
        listId: collectionId,
        recipeId: recId,
      },
    });
  }

  static async deleteUserRecipeListItem(collectionId: string, recId: string) {
    return await prisma.userRecipeListItem.delete({
      where: {
        listId_recipeId: {
          listId: collectionId,
          recipeId: recId,
        },
      },
    });
  }
}
export default UserCollectionRepository;
