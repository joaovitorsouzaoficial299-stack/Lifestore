export class NotConfiguredError extends Error {
  constructor(message = "Backend não configurado.") {
    super(message);
    this.name = "NotConfiguredError";
  }
}
