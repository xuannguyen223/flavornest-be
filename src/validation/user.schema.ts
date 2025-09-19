import { z } from "zod";

const userIdSchema = z.string().trim().min(1, "User ID is required");

const getById = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const getProfileById = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const updateProfile = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
});

const updateUserPreference = z.object({
  params: z.object({
    userId: userIdSchema,
  }),
  body: z.object({
    preferences: z.array(
      z.object({
        categoryId: z.string().trim().min(1, "Invalid ID format"),
      })
    ),
  }),
});

const getUserCollectionById = z.object({
  params: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
  }),
});

const createUserCollection = z.object({
  body: z.object({
    name: z.string().trim().min(1, "Collection name is required"),
  }),
});

const updateUserCollection = z.object({
  params: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
  }),
  body: z.object({
    name: z.string().min(1, "Collection name is required"),
  }),
});

const deleteUserCollection = z.object({
  params: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
  }),
});

const getAllCollectionRecipes = z.object({
  params: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
  }),
});

const addRecipeToCollection = z.object({
  body: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
    recipeId: z.string().trim().min(1, "RecipeId is required"),
  }),
});

const updateRecipeUserCollection = z.object({
  body: z.object({
    currentCollectionId: z.string().trim().min(1, "CollectionId is required"),
    newCollectionId: z.string().trim().min(1, "CollectionId is required"),
    recipeId: z.string().trim().min(1, "RecipeId is required"),
  }),
});

const deleteRecipeUserCollection = z.object({
  params: z.object({
    collectionId: z.string().trim().min(1, "CollectionId is required"),
    recipeId: z.string().trim().min(1, "RecipeId is required"),
  }),
});

const userSchema = {
  getById,
  getProfileById,
  updateProfile,
  updateUserPreference,
  getUserCollectionById,
  createUserCollection,
  updateUserCollection,
  deleteUserCollection,
  getAllCollectionRecipes,
  addRecipeToCollection,
  updateRecipeUserCollection,
  deleteRecipeUserCollection,
};

export default userSchema;
