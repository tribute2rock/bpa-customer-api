class AuthorizationTokenNotFoundError extends Error {
  constructor(args) {
    super(args);
    this.name = 'Authorization Token Not Found';
    this.message = 'No token was found in the authorization header.';
  }
}

class UserNotAuthenticated extends Error {
  constructor(args) {
    super(args);
    this.name = 'User Not Authenticated';
    this.message = 'Access token is invalid or does not exist.';
  }
}

module.exports = { AuthorizationTokenNotFoundError, UserNotAuthenticated };
