import jwt from "jsonwebtoken";
export function VerifyJWT(token: string) {
  const secret_key = process.env.SECRET_KEY || "";
  const issuer = process.env.ISSUER || "";
  const options = {
    issuer: issuer,
  };
  let res: { success: boolean; response: any } = {success:false,response:''};
//   const trimToken = token.split(" ")[1];
  jwt.verify(token, secret_key, options, (err, decoded) => {
    if (err) {
      res = { success: false, response: err };
    } else {
      res = { success: true, response: decoded };
    }
  });
  return res;
}
