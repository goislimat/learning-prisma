import { Request } from "express";
import { AnyZodObject, z } from "zod";
import DiskStorageService from "../services/DiskStorageService";
import HandledError from "./HandledError";

async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request
): Promise<z.infer<T>> {
  try {
    const parsedValues = await schema.parseAsync(req);
    return parsedValues;
  } catch (err) {
    if (req.file?.filename) {
      const diskStorageService = new DiskStorageService();
      diskStorageService.deleteFile(req.file.filename, true);
    }

    throw new HandledError(
      "The operation can't be performed with the provided data",
      400
    );
  }
}

export default zParse;
