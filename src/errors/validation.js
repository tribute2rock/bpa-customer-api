class ValidationError extends Error {
  constructor(args){
    super(args);
    this.name = "Validation Error";
    this.message = "Failed to validate provided data.";
    this.data = args;
  }
}

module.exports = ValidationError;
