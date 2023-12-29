
// rootReducer.js
import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './UserReducer';

const rootReducer = combineReducers({
  user: userReducer,
});

export default rootReducer;
