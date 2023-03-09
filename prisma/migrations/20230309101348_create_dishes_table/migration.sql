-- CreateTable
CREATE TABLE "Dish" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "image" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Ingredient" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "_DishToIngredient" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DishToIngredient_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DishToIngredient_B_fkey" FOREIGN KEY ("B") REFERENCES "Ingredient" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_DishToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_DishToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Dish" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_DishToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_DishToIngredient_AB_unique" ON "_DishToIngredient"("A", "B");

-- CreateIndex
CREATE INDEX "_DishToIngredient_B_index" ON "_DishToIngredient"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_DishToUser_AB_unique" ON "_DishToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_DishToUser_B_index" ON "_DishToUser"("B");
