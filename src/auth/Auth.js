import React, {useEffect, useState} from "react";
import {StyleSheet, View, Text, Pressable, Image} from "react-native";
import {useDispatch} from "react-redux";
import Loading from "../components/Loading";
import {actionAuth} from "../redux/actionCreator";
import authUser, {logIn, logOut, onAuthStateChanged} from "./authUser";
import {googleIcon} from "../assets/icons";


function Auth() {
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();
    const dispatch = useDispatch();

    useEffect(() => onAuthStateChanged(async user => {
        setInitializing(true);
        let status = await authUser(user);

        if(status === 200 || !user) {
            dispatch(actionAuth(user));
            setUser(user);
            if (initializing) setInitializing(false);
        }
    }), []);


    if (initializing) return <Loading/>;

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.heading}>Welcome to CityDesk</Text>
                <Pressable style={styles.logIn} onPress={logIn}>
                    <Text style={styles.logInText}>Log In with Google</Text>
                    <Image source={googleIcon} style={styles.googleIcon}/>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text>Welcome {user.email}</Text>
            <Pressable style={styles.logIn} onPress={logOut}>
                <Text style={styles.logInText}>Log Out</Text>
            </Pressable>
        </View>
    );
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

export default Auth;