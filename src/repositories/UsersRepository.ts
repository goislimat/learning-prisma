import { Prisma, PrismaClient } from "@prisma/client";
import { User, UserCreateInput, UserWithoutPassword } from "../types/user";
import HandledError from "../utils/HandledError";
import IUsersRepository from "./IUsersRepository";
import { createUser, findByEmail, findById } from "./validators/user";

class UsersRepository implements IUsersRepository {
  private prisma = new PrismaClient();

  async findById(id: number): Promise<User> {
    const user = await this.prisma.user.findFirstOrThrow(findById(id));

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow(findByEmail(email));

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
          throw new HandledError(
            "This email/password combination is not valid",
            404
          );
        }
      }

      throw err;
    }
  }

  async save(data: UserCreateInput): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.create(createUser(data));

      return user;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
          throw new HandledError("This email is already taken");
        }
      }

      throw err;
    }
  }
}

export default UsersRepository;
