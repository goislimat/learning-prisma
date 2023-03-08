import { User } from "@prisma/client";
import { hashSync } from "bcryptjs";
import iUsersRepository, { iCreateUserParams } from "./iUsersRepository";

class UsersRepositoryInMemory implements iUsersRepository {
  public users: User[] = [
    {
      id: 1123,
      name: "jane doe",
      email: "janedoe@example.com",
      password: hashSync("123456"),
      isAdmin: false,
      createdAt: new Date("01/01/2023"),
      updatedAt: new Date("01/01/2023"),
    },
  ];

  async findByEmail(email: string): Promise<User> {
    const user: Promise<User> = new Promise((resolve, reject) => {
      const userExists = this.users.find((user) => user.email === email);

      if (userExists) {
        resolve(userExists);
      }

      reject({
        status: 404,
        message: "This email/password combination is not valid",
      });
    });

    return user;
  }

  async save({ name, email, password }: iCreateUserParams): Promise<User> {
    const createdUser: Promise<User> = new Promise((resolve, reject) => {
      const userAlreadyExists = this.users.find((user) => user.email === email);

      if (userAlreadyExists) {
        reject({ status: 400, message: "This email is already taken" });
      }

      const newUser: User = {
        id: Math.floor(Math.random()) * 1000 + 1,
        name,
        email,
        password,
        isAdmin: false,
        createdAt: new Date(Date.now()),
        updatedAt: new Date(Date.now()),
      };

      this.users.push(newUser);

      resolve(newUser);
    });

    return createdUser;
  }
}

export default UsersRepositoryInMemory;
