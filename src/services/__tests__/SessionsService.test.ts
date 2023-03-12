import UsersRepositoryInMemory from "../../repositories/UsersRepositoryInMemory";
import SessionsService from "../SessionsService";

describe("SessionsService", () => {
  it("should create a session", async () => {
    const user = {
      email: "janedoe@example.com",
      password: "123456",
    };

    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const sessionsService = new SessionsService(usersRepositoryInMemory);

    const [createdUser, token] = await sessionsService.create(user);

    expect(createdUser).toHaveProperty("id");
    expect(createdUser).not.toHaveProperty("password");
    expect(token).not.toBeNull();
  });

  it("should not create a session with a non-existing user", async () => {
    const user = {
      email: "wrong@email.com",
      password: "123456",
    };

    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const sessionsService = new SessionsService(usersRepositoryInMemory);

    await expect(sessionsService.create(user)).rejects.toEqual({
      statusCode: 404,
      message: "This email/password combination is not valid",
    });
  });

  it("should not create a session with a wrong password", async () => {
    const user = {
      email: "janedoe@example.com",
      password: "wrong-password",
    };

    const usersRepositoryInMemory = new UsersRepositoryInMemory();
    const sessionsService = new SessionsService(usersRepositoryInMemory);

    await expect(sessionsService.create(user)).rejects.toEqual({
      statusCode: 404,
      message: "This email/password combination is not valid",
    });
  });
});
