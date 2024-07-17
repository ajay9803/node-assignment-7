import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

// configurations for port, jwt-secret and tokens
const config = {
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
  accesstoken_expiry: process.env.ACCESS_TOKEN_EXPIRY,
  refreshtoken_expiry: process.env.REFRESH_TOKEN_EXPIRY,
  database: {
    DB_CLIENT: process.env.DB_CLIENT,
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PW: process.env.DB_PW,
    DB_PORT: process.env.DB_PORT || 5432,
    DB_NAME: process.env.DB_NAME,
  },
};

export default config;
