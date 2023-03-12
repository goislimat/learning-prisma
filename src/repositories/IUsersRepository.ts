import { Prisma, User as UserPrisma } from "@prisma/client";

export interface UserWithoutPassword {
  id: UserPrisma["id"];
  name: UserPrisma["name"];
  email: UserPrisma["email"];
  isAdmin: UserPrisma["isAdmin"];
}

export interface User extends UserWithoutPassword {
  password: UserPrisma["password"];
}

interface IUsersRepository {
  findById: (id: number) => Promise<User>;
  findByEmail: (email: string) => Promise<User>;
  save: (params: Prisma.UserCreateInput) => Promise<User>;
}

export default IUsersRepository;
