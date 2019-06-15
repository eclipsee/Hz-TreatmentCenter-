import {PRINT_TEST} from "../actions/test.js";

// 设置初始值
const initialState = {
  text:0
}

// 编写reducer（此处编写业务逻辑）
function printTest(state = initialState, action){
  switch(action.type){
    case 'PRINT_TEST':
      return Object.assign({},state,{
        text:state.text + 1
      });
  }
}

// 输出reducer
module.exports = {
  printTestReducer:printTest
}