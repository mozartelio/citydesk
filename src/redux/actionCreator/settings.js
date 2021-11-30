import {LANGUAGE, COORD, AUTH, USER_ID} from '../actions';

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

function actionAuth(user, status) {
    return {
        type: AUTH,
        user: user,
        status: status
    };
}

function actionUserId(id){
    return{
        type: USER_ID,
        id: id
    }
}


export { actionLanguage, actionCoord, actionAuth, actionUserId};