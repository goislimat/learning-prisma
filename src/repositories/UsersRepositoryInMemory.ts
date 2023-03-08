import { User } from "@prisma/client";
import iUsersRepository, { iCreateUserParams } from "./iUsersRepository";

class UsersRepositoryInMemory implements iUsersRepository {
  public users: User[] = [];

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
