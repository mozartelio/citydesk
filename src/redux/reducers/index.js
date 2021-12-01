import { combineReducers } from "redux";
import language from "./language";
import coord from './coord'
import auth from "./auth";
import userId from "./userId";
import postCoord from "./postCoord";

const allReducers = combineReducers({
    language: language,
    coord: coord,
    auth: auth,
    userId: userId,
    postCoord: postCoord
});
export default allReducers;
