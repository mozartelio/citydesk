import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";

function Post(){
    const {t} = useTranslation()

    const coord = useSelector((state)=> state.coord);

    return(
        <View style={styles.container}>
            <Text>{t('interface:hello')}</Text>
            <Text>lon: {coord[0]} lat: {coord[1]}</Text>
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

export default Post;
