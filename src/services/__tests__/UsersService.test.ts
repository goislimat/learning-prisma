import { compare } from "bcryptjs";
import UsersRepositoryInMemory from "../../repositories/UsersRepositoryInMemory";
import UsersService from "../UsersService";

describe("UsersSevice", () => {
  it("should create a user", async () => {
    const newUser = {
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const usersService = new UsersService(usersRepositoryInMemory);
    const createdUser = await usersService.createUser(newUser);

    expect(createdUser).toHaveProperty("id");

    const passwordsMatch = await compare(
      newUser.password,
      createdUser.password
    );
    expect(passwordsMatch).toBe(true);
  });

  it("should not allow users to insert the same email twice", async () => {
    const newUser = {
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const repeatedUser = {
      name: "john doe",
      email: "johndoe@example.com",
      password: "123456",
    };

    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const usersService = new UsersService(usersRepositoryInMemory);
    await usersService.createUser(newUser);

    await expect(usersService.createUser(repeatedUser)).rejects.toEqual({
      statusCode: 400,
      message: "This email is already taken",
    });
  });
});
