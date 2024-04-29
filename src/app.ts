import dotenv from "dotenv";
import express from "express";
import { router } from "./routes/index";
import cookieParser from "cookie-parser";
import jwtMiddleware from "./middlewares/jwtMiddleware";

dotenv.config();
const app = express();
const port = Number(process.env.PORT ?? 4000);

// JSON 형태의 요청(request) body를 파싱(parse)하기 위해 사용하는 미들웨어(middleware) 적용
app.use(express.json());

// 요청된 쿠키를 쉽게 추출할 수 있도록 도와주는 미들웨어 적용
app.use(cookieParser());

// 토큰 검증 미들웨어 적용
app.use(jwtMiddleware);

// app 인스턴스에 라우터 적용
app.use("/", router);

app.listen(port, () => {
  console.log();
  console.log(`  [Local] http://localhost:${port}/`);
  console.log();
});
