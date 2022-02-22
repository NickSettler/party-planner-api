const defaultExpiresIn = 900000;

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN || defaultExpiresIn,
};
