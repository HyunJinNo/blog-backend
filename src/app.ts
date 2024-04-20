import express from "express";
import { router } from "./routes/index";

const app = express();
const port = 4000;

/*
// 미들웨어 함수를 로드
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(req.url);
    console.log(1);

    if (req.query.authorized !== "1") {
      res.status(401).send("Unauthorized");
      return;
    }

    next();
  },
);

app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(2);
    next();
  },
);
*/

// JSON 형태의 요청(request) body를 파싱(parse)하기 위해 사용하는 미들웨어(middleware) 적용.
app.use(express.json());

// app 인스턴스에 라우터 적용
app.use("/", router);

app.listen(port, () => {
  console.log();
  console.log(`  [Local] http://localhost:${port}/`);
  console.log();
});
