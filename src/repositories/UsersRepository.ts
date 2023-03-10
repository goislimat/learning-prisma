import { Prisma, PrismaClient, User } from "@prisma/client";
import HandledError from "../utils/HandledError";
import IUsersRepository, {
  ICreateUserParams,
} from "./IUsersRepositoryInterface";

class UsersRepository implements IUsersRepository {
  private prisma = new PrismaClient();

  async findById(id: number): Promise<User> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: {
          id,
        },
      });

      return user;
    } catch (err) {
      // TODO tests this in a way we can see the error that is being thrown
      throw err;
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        where: {
          email,
        },
      });

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

  async save({ name, email, password }: ICreateUserParams): Promise<User> {
    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password,
        },
      });

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
