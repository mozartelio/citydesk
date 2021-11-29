import language from "./language";
import coord from './coord'
import { combineReducers } from "redux";

const allReducers = combineReducers({
    language: language,
    coord: coord
});
export default allReducers;
