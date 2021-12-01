import React from "react";
import {Text, View, StyleSheet, Pressable, Image} from "react-native";
import i18n from "i18next";
import {Picker} from '@react-native-picker/picker';
import { useTranslation } from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {actionLanguage} from "../redux/actionCreator";
import auth from "@react-native-firebase/auth";
import {GoogleSignin} from "@react-native-google-signin/google-signin";

function Profile({navigation}){
    const {t} = useTranslation();
    const lang = useSelector((state)=> state.language);
    const dispatch = useDispatch();
    const user = useSelector((state)=> state.auth.user);
    const userId = useSelector((state)=> state.userId);

    console.log('userId',userId)
    function logOut() {
        auth().signOut().then(r => r)
        GoogleSignin.revokeAccess();
        navigation.navigate('Authorization')
    }
    console.log(user)
    return(
        <View style={styles.container}>
            <Image source={{uri: `${user ? user.photoURL : ''}`}} style={styles.avatar}/>

            <Text style={{fontSize: 32, }}>{ user ? user.displayName : '' }</Text>
            <Text>UID: {userId ? userId.toString() : ''}</Text>
            <Text style={{fontSize: 22, margin: 20, marginBottom: 50}}>{ user ? user.email : '' }</Text>

            <Text>{t('profile:lang')}:</Text>
            <Picker
                style={{ width: "100%" }}
                selectedValue={lang}
                onValueChange={(val) => {
                    dispatch(actionLanguage(val))
                    i18n.changeLanguage(val).then(r => console.log(r));;
                }}
            >
                <Picker.Item label={t('profile:en')} value="en" />
                <Picker.Item label={t('profile:sk')} value="sk" />
            </Picker>

            <Pressable style={styles.logIn} onPress={logOut}>
                <Text style={styles.logInText}>{t('profile:log_out')}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',

    },
    logIn: {
        flexDirection: "row",
        width: "80%",
        backgroundColor: "#fff",
        elevation: 8,
        padding: 20,
        marginBottom: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 10,
        bottom: 0,
        position: 'absolute',
    },
    logInText: {
        color: "#000",
        fontSize: 20,
        marginRight: 10
    }, avatar: {
        width: 100,
        height: 100,
        borderRadius: 100
    }

});

export default Profile;
