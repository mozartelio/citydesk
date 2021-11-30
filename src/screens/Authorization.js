import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, Pressable, Image} from "react-native";
import {useDispatch} from "react-redux";
import Loading from "../components/Loading";
import {actionAuth, actionUserId} from "../redux/actionCreator";
import {google} from "../assets/icons";
import {GoogleSignin} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";

const WEB_CLIENT_ID = '112151857904-5carn3lk9vms7mb2cdaqa7rbpjehl68r.apps.googleusercontent.com';
const SERVER= 'https://hackathon-citydesk.herokuapp.com/';

GoogleSignin.configure({
    webClientId: WEB_CLIENT_ID,
});

function Authorization({navigation}) {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const dispatch = useDispatch();
    const [uid, setUid] = useState(null);

    useEffect(() => onAuthStateChanged(async user => {
        setInitializing(true);
        let status = await authUser(user);

        if(status === 200 || !user) {
            dispatch(actionAuth(user));
            dispatch(actionUserId(uid));
            setUser(user);
            if (initializing) setInitializing(false);
        }
    }), []);

    function onAuthStateChanged(action) {
        auth().onAuthStateChanged(action);
    }


    async function authUser(user) {
        if(!user) return;
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: user.uid,
                name: user.displayName,
                email: user.email,
                photoURL: user.photoURL
            })
        };
        let response = await fetch(`${SERVER}signIn`, requestOptions);
        let r = await response.json()
        setUid(r.id)
        return response.status;

    }

    async function logIn() {
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        return auth().signInWithCredential(googleCredential);
    }

    if (initializing) return <Loading/>;

    if (user) {
        navigation.navigate('Home')
    }

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Welcome to CityDesk</Text>
            <Pressable style={styles.logIn} onPress={logIn}>
                <Text style={styles.logInText}>Log In with Google</Text>
                <Image source={google} style={styles.googleIcon}/>
            </Pressable>
        </View>
    );


    // return (
    //     <View style={styles.container}>
    //         <Text>Welcome {user.email}</Text>
    //         <Pressable style={styles.logIn} onPress={logOut}>
    //             <Text style={styles.logInText}>Log Out</Text>
    //         </Pressable>
    //     </View>
    // );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    heading: {
        fontSize: 32,
        color: "#000",
        marginBottom: 40
    },
    logIn: {
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#fff",
        elevation: 8,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10
    },
    logInText: {
        color: "#000",
        fontSize: 20,
        marginRight: 10
    },
    googleIcon: {
        width: 40,
        height: 40,
        alignSelf: "center"
    }
});

export default Authorization;