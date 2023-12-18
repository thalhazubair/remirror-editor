// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
const Jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const payload = "test123";
const expiresIn = "1d";


export default function Login(req: NextApiRequest, res: NextApiResponse) {  
  const { email, password } = req.body;

  if (process.env.defaultemail == email && process.env.defaultpassword == password) {
    Jwt.sign(
      { payload },
      process.env.secretKey,
      {
        expiresIn,
      },
      (err: Error, token: any) => {
        if (err) {
          console.error(err, "some error occured");
        } else {
          res.status(200).json({ token: `Bearer ${token}` });
        }
      }
    );
  }
}
