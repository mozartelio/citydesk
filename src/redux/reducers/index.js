import { combineReducers } from "redux";
import language from "./language";
import coord from './coord'
import auth from "./auth";
import userId from "./userId";

const allReducers = combineReducers({
    language: language,
    coord: coord,
    auth: auth,
    userId: userId
});
export default allReducers;
