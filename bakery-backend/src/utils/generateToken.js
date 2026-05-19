import jwt from "jsonwebtoken";
import "dotenv/config"

const generateToken = (id, role) => {
  return jwt.sign(
    {id,role},
    process.env.JWT_SECRET,{
      expiresIn: process.env.JWT_EXPIRE || "7d"
    }
  );
};

export default generateToken;