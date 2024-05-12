import express from "express"; //읽기순서 1. express 라이브러리 가져와서
import connect from "./schemas/index.js";
import todosRouter from "./routes/todos.router.js";
import errorHandlerMiddleware from "./middlewares/error-handler.middleware.js";

const app = express(); //2. 여기서 앱을 생성
const PORT = 3000; //7. 포트 열때에는 3000번으로 구현함

connect();

// Express에서 req.body에 접근하여 body 데이터를 사용할 수 있도록 설정합니다.
app.use(express.json()); //3. 앱에다 전역으로 미들웨어 등록 , express.json을 통해서 바디파서 구현
app.use(express.urlencoded({ extended: true })); //4.express.urlencoded 통해 콘텐츠 타입이 form 인 경우에 바디데이터를 가져올 수 있도록 구현
app.use(express.static("./assets"));

app.use((req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
});
//3.4번의 코드는 매번 같이 다님
const router = express.Router(); //5. 여기부터 14줄 });까지 라우터를 생성해서 해당 라우터에 api 구현

router.get("/", (req, res) => {
  return res.json({ message: "Hi!" });
});

app.use("/api", [router, todosRouter]); //6. 실제 해당하는 라우터를 전역 미들웨어로 등록해서 /api 붙은 경우에만 api로 접근 가능하도록 만듬

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  //7. 포트 열때에는 3000번으로 구현함
  console.log(PORT, "포트로 서버가 열렸어요!");
});

//8. 확인하려면 localhost:3000/api/ 입력
