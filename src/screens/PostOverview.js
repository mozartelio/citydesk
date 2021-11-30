import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, Image} from "react-native";
import {useTranslation} from "react-i18next";

function PostOverview({route}){
    const item = route.params.item;
    const {t} = useTranslation();

    return(
        <View style={styles.container}>
            <Image style={styles.image} source={{uri: `${item.image_url}`}}/>
            <Text style={styles.header}>{item.title}</Text>
            <Text style={styles.text}>{item.text}</Text>
            <Text style={styles.extraInfo}>{t('post_overview:category')}: {item.category}</Text>
            <Text style={styles.extraInfo}>Author: {item.author}</Text>
            <Text style={styles.extraInfo}>Date: {new Date(item.date).toLocaleDateString()}</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // justifyContent: 'center',
    }, image: {
        width: '100%',
        height: 300
    }, header: {
        alignSelf: 'center',
        fontWeight: 'bold',
        fontSize: 32,
        padding: 20,
        color: '#000'
    }, text: {
        fontSize: 22,
        padding: 15,
        color: '#000'
    }, extraInfo: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 5,
        paddingLeft: 20,
        color: '#000'
    }

});

export default PostOverview;
