class HandledError {
  public message;
  public statusCode;

  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default HandledError;
