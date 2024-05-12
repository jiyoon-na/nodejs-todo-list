//라우터 만들기 위해 익스프레스로 라우터 받아오고 해당하는 라우터를 투두스.라우터.js파일에서
//외부로 전달해주고,
//앱.js에서 불러오는 방식으로 구현 : app.js 에서 import todosRouter from './routes/todos.router.js';
//app.js 하단에 내려가 app.use('/api', [router, todoRouter]); 작성
import express from 'express';
import joi from 'joi';
import Todo from '../schemas/todo.schema.js';

const router = express.Router();
const createdTodoSchema = joi.object({
  value: joi.string().min(1).max(50).required(),
});
//할일등록 api
router.post('/todos', async (req, res, next) => {
  try {
    //1. 클라이언트로 부터 받아온 벨류 데이터 가져온다.
    const validation = await createdTodoSchema.validateAsync(req.body);
    const { value } = validation;
    //1.5 만약 클라이언트가 벨류 데이터를 전달하지 않았을 때, 클라이언트에세 에러 메세지 전달
    if (!value) {
      return res
        .status(400)
        .json({ errorMessage: '해야할일(value)데이터가 존재하지 않습니다' });
    }

    //2. 해당하는 마지막 오더 데이터 조회한다.; findone 은 한개의 데이터만 조회한다; sort : 정렬한다.
    //order컬럼 기준으로 정렬 : 그냥 order은 오름차순, -order은 내림차순
    //exec();  몽구스로 조회하는데의 맨 뒤는 무조건 붙여야함. 안그럼 앞의 동작이 프로미스로 동작이 안되서 조회가 안될 수도
    // query.d.ts ; 가서 보면 프로미스 반환한다고
    const todoMaxOrder = await Todo.findOne().sort('-order').exec();

    //3. 존재한다면, 현재 해야할일을 +1 , 오더데이터가 존재하지 않다면 1로 할당
    const order = todoMaxOrder ? todoMaxOrder.order + 1 : 1;

    //4. 해야할일 등록 여기서의 세이브는 데이터베이스에 저장
    const todo = new Todo({ value, order });
    await todo.save();
    //5. 해야할일을 클라이언트에게 반환
    return res.status(201).json({ todo: todo });
  } catch (error) {
    next(error);
  }
});

export default router;
