// 测试ActionType
const PRINT_TEST = 'PRINT_TEST';

/**
 * 测试Action
 */
function printTestAction(text){
    return {
      type:PRINT_TEST,
      text
    }
}

// 导出Action和ActionType
module.exports = {
  printTestAction:printTestAction,
  PRINT_TEST:PRINT_TEST
}