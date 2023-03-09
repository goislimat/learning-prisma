import fs from "fs";

const mockedFs = jest.createMockFromModule("fs") as jest.Mocked<typeof fs>;

export default {
  ...mockedFs,
  promises: {
    ...mockedFs.promises,
    rename: jest.fn(),
  },
  unlink: jest.fn(),
};
