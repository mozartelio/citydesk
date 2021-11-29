import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet} from "react-native";
import i18n from "i18next";
import {Picker} from '@react-native-picker/picker';
import { useTranslation } from "react-i18next";
import {useSelector, useDispatch} from "react-redux";
import {actionLanguage} from "../redux/actionCreator";

function Profile(){
    const {t} = useTranslation();
    const lang = useSelector((state)=> state.language);
    const dispatch = useDispatch();


    return(
        <View style={styles.container}>
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
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default Profile;
