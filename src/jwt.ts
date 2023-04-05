import * as jwt from "jsonwebtoken";
import fs from "fs";

// private key to sign JWT tokens
const private_key = fs.readFileSync("private.pem");

/** Type Params required to generate JWT tokens*/

interface JWTParams {
  userId: string;
}

// const JWT_SECRET = process.env.JWT_SECRET || "secret";

const JWT_CONFIG: jwt.SignOptions = {
  algorithm: "RS512",
  expiresIn: "10h",
};

/**
 *
 * @param params JWTParams
 * @returns string JWT token
 */

export function generateJWT(params: JWTParams): string {
  const payload = {
    sub: params.userId,
    name: params.userId,
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": ["user", "admin"],
      "x-hasura-user-id": params.userId,
    },
  };
  return jwt.sign(payload, private_key, JWT_CONFIG);
}

export function verifyJWT(token: string): any {
  return jwt.verify(token, private_key, { algorithms: ["RS512"] });
}
