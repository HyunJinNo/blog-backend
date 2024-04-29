import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import sanitizeHtml from "sanitize-html";

dotenv.config();

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

// html을 없애고 내용이 너무 길면 200자로 제한하는 함수
export const removeHtmlAndShorten = (body: string) => {
  const filtered = sanitizeHtml(body, { allowedTags: [] });
  return filtered.length < 200 ? filtered : `${filtered.slice(0, 200)}...`;
};
