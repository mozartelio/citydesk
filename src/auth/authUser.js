import {SERVER} from "@env";
import auth from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import {WEB_CLIENT_ID} from "@env";

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});

async function authUser(user) {
    if(!user) return;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            googleId: user.uid,
            name: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        })
    };

    let response = await fetch(`${SERVER}signIn`, requestOptions);

    return response.status;
}

function onAuthStateChanged(action) {
    auth().onAuthStateChanged(action);
}

async function logIn() {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
}

function logOut() {
    auth().signOut()
}

export default authUser;
export {logIn, logOut, onAuthStateChanged};