// schemas/todo.schema.js

import mongoose from 'mongoose';
//2.몽구스 이용해서 실제로 몽구스의 (스키마를 생성,모델생성)할 수 있기 때문에 첫번째로 외부에 있는 몽구스 패키지를 코드로 가져와야함
const TodoSchema = new mongoose.Schema({
  //1. 스키마를 보면 첫번째로 몽구스 데이터가 필요함
  //투두스키마 : 실제로 작성되고 있는 스키마 ; 뉴 스키마 : 우리의 요구사항
  value: {
    //해야할일 이므로 문자열
    type: String,
    required: true, // value 필드는 필수 요소입니다.
  },
  order: {
    //할일순서
    type: Number,
    required: true, // order 필드 또한 필수 요소입니다.
  },
  doneAt: {
    type: Date, // doneAt 필드는 Date 타입을 가집니다.
    required: false, // doneAt 필드는 필수 요소가 아님 완료가 안되었을 수도 있기에
  },
});

// 프론트엔드 서빙을 위한 코드입니다. 모르셔도 괜찮아요!
TodoSchema.virtual('todoId').get(function () {
  return this._id.toHexString();
});
TodoSchema.set('toJSON', {
  virtuals: true,
});

// TodoSchema를 바탕으로 Todo모델을 생성하여, 외부로 내보냅니다.
export default mongoose.model('Todo', TodoSchema);
