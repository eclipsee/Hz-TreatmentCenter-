import {createStore,applyMiddleware} from "../libs/redux/redux.js";

import { printTestReducer} from "../reducer/test.js";
let aa = function(){};
let store = createStore(printTestReducer);

module.exports = {
  store
} 