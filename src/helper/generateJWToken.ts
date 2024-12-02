import jwt from 'jsonwebtoken'
import { GenerateFourDigitKey } from './generateFourDigitKey';
export async function GenerateJWT() {
  const secret_key = process.env.SECRET_KEY||'';
  const issuer = process.env.ISSUER || "";
  const payload = {
    issueBy:issuer,
    issueAt:new Date().getMilliseconds()
  }
  const options = {
    expiresIn: "30m",
    issuer: issuer,
    subject: "client",
    header: { alg: "HS256", typ: "JWT" }
  };
  return jwt.sign(payload,secret_key,options)

}