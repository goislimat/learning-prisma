import { compare } from "bcryptjs";
import UsersRepositoryInMemory from "../repositories/UsersRepositoryInMemory";
import UsersService from "./UsersService";

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

  it("should find a user by their email", async () => {
    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const usersService = new UsersService(usersRepositoryInMemory);
    const user = await usersService.findUserByEmail("janedoe@example.com");

    expect(user.name).toBe("jane doe");
    expect(user).toHaveProperty("id");

    const passwordsMatch = await usersService.validateCredentials(
      user,
      "123456"
    );
    expect(passwordsMatch).toBe(true);
  });

  it("should throw if the email is invalid", async () => {
    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const usersService = new UsersService(usersRepositoryInMemory);

    await expect(
      usersService.findUserByEmail("inexistent@email.com")
    ).rejects.toEqual({
      statusCode: 404,
      message: "This email/password combination is not valid",
    });
  });

  it("should invalidate an user with an incorrect password", async () => {
    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const usersService = new UsersService(usersRepositoryInMemory);
    const user = await usersService.findUserByEmail("janedoe@example.com");

    await expect(
      usersService.validateCredentials(user, "wrong password")
    ).rejects.toEqual({
      statusCode: 404,
      message: "This email/password combination is not valid",
    });
  });
});
