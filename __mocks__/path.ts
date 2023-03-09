import path from "path";

const mockedPath = jest.createMockFromModule("path") as jest.Mocked<
  typeof path
>;

export default {
  ...mockedPath,
  resolve: jest.fn(),
};
