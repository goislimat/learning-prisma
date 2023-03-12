import { Prisma } from "@prisma/client";
import { hashSync } from "bcryptjs";
import HandledError from "../utils/HandledError";
import IUsersRepository, { User } from "./IUsersRepository";

class UsersRepositoryInMemory implements IUsersRepository {
  public users: User[] = [
    {
      id: 1123,
      name: "jane doe",
      email: "janedoe@example.com",
      password: hashSync("123456"),
      isAdmin: false,
    },
  ];

  async findById(id: number): Promise<User> {
    const user: Promise<User> = new Promise((resolve, reject) => {
      const userExists = this.users.find((u) => u.id === id);

      if (userExists) {
        resolve(userExists);
      }

      reject();
    });

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user: Promise<User> = new Promise((resolve, reject) => {
      const userExists = this.users.find((u) => u.email === email);

      if (userExists) {
        resolve(userExists);
      }

      reject(
        new HandledError("This email/password combination is not valid", 404)
      );
    });

    return user;
  }

  async save({ name, email, password }: Prisma.UserCreateInput): Promise<User> {
    const createdUser: Promise<User> = new Promise((resolve, reject) => {
      const userAlreadyExists = this.users.find((user) => user.email === email);

      if (userAlreadyExists) {
        reject(new HandledError("This email is already taken", 400));
      }

      const newUser: User = {
        id: Math.floor(Math.random()) * 1000 + 1,
        name,
        email,
        password,
        isAdmin: false,
      };

      this.users.push(newUser);

      resolve(newUser);
    });

    return createdUser;
  }
}

export default UsersRepositoryInMemory;
