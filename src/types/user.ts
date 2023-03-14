import { User as PrismaUser } from "@prisma/client";

export type User = Pick<
  PrismaUser,
  "id" | "name" | "email" | "password" | "isAdmin"
>;
export type UserWithoutPassword = Omit<User, "password">;
export type UserCreateInput = Pick<PrismaUser, "name" | "email" | "password">;
export type SessionCreateInput = Pick<PrismaUser, "email" | "password">;
