import fs from "fs";
import path from "path";
import { TMP_FOLDER, UPLOADS_FOLDER } from "../config/upload";
import HandledError from "../utils/HandledError";

class DiskStorageService {
  async saveFile(file: string): Promise<void> {
    await fs.promises.rename(
      path.resolve(TMP_FOLDER, file),
      path.resolve(UPLOADS_FOLDER, file)
    );
  }

  async deleteFile(file: string): Promise<void> {
    const filePath = path.resolve(UPLOADS_FOLDER, file);

    await fs.unlink(filePath, (err) => {
      if (err) {
        throw new HandledError("Failed to delete file", 500);
      }
    });
  }
}

export default DiskStorageService;
