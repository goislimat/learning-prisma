import "express-async-errors";
import express, {
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";

import appRoutes from "./routes";
import HandledError from "./utils/HandledError";

const app = express();

const port = 3081;

app.use(express.json());
app.use(appRoutes);
app.use(
  (
    err: ErrorRequestHandler,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (err instanceof HandledError) {
      return res.status(err.statusCode).json({
        status: "error",
        message: err.message,
      });
    }

    console.error({ err });

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
);

app.listen(port, function () {
  console.log(`server running on port ${port}`);
});
