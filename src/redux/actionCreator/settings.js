import {LANGUAGE, COORD} from '../actions';

function actionLanguage(lang) {
    return {
        type: LANGUAGE,
        lang: lang
    };
}

function actionCoord(coord){
    return{
        type: COORD,
        coord: coord
    }
}


export { actionLanguage, actionCoord};