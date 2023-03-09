import fs from "fs";
import path from "path";
import DiskStorageService from "./DiskStorageService";

jest.mock("fs");
jest.mock("path");
jest.mock("multer");

path.resolve = jest
  .fn()
  .mockReturnValue("uploads/image.jpg")
  .mockReturnValueOnce("tmp/image.jpg");

describe("DiskStorageService", () => {
  it("should be able to save a file", async () => {
    const diskStorageService = new DiskStorageService();

    const renameSpy = jest.spyOn(fs.promises, "rename");

    await diskStorageService.saveFile("image.jpg");
    expect(renameSpy).toHaveBeenCalledWith(
      "tmp/image.jpg",
      "uploads/image.jpg"
    );
  });

  it("should be able to delete a file", async () => {
    const diskStorageService = new DiskStorageService();

    const unlinkSpy = jest.spyOn(fs, "unlink");

    await diskStorageService.deleteFile("image.jpg");
    expect(unlinkSpy).toHaveBeenCalledWith(
      "uploads/image.jpg",
      expect.anything()
    );
  });

  it("should throw an error if it fails to delete a file", async () => {
    const diskStorageService = new DiskStorageService();

    const unlinkSpy = jest.spyOn(fs, "unlink");
    unlinkSpy.mockImplementation((path, callback) => {
      callback(new Error());
    });

    await expect(diskStorageService.deleteFile("image.jpg")).rejects.toEqual({
      statusCode: 500,
      message: "Failed to delete file",
    });
  });
});
