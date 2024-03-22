import { UnauthorizedError, auth } from "express-oauth2-jwt-bearer";
import { jwtDecode } from "jwt-decode";
import dotenv from "dotenv";
dotenv.config();

export const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  tokenSigningAlg: process.env.TOKEN_SIGNING_ALG,
});

export const userIdEqualsJwtSub = (userId: string, authorization: string) => {
  const decodedJwt = jwtDecode(authorization);
  if (userId !== decodedJwt.sub) {
    throw new UnauthorizedError(
      "A user has attempted to access locked resources."
    );
  }
};
