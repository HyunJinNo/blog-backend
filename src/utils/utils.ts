require("dotenv").config();
import jwt from "jsonwebtoken";

export const generateToken = (id: number, username: string): string => {
  const token = jwt.sign(
    // 첫 번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣습니다.
    {
      id: id,
      username: username,
    },
    process.env.JWT_SECRET!, // 두 번째 파라미터에는 JWT 암호를 넣습니다.
    {
      expiresIn: "7d", // 7일 동안 유효함
    },
  );
  return token;
};
