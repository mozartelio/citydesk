import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, Image, Button, TouchableOpacity, Alert} from "react-native";
import {useTranslation} from "react-i18next";
import RBSheet from "react-native-raw-bottom-sheet";

function PostOverview({route}){
    const item = route.params.item;
    const {t} = useTranslation();
    const [sheet, setSheet] = useState(null)
    const message = 'Thank you for your compliment.\nAs soon as this post will be reviewed, you\'ll be notified  by email.';
    return(
        <View style={styles.container}>
            <TouchableOpacity style={{backgroundColor: '#000', padding: 10, justifyContent: 'center'}} onPress={() => sheet.open()}>
                <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Sent complain</Text>
            </TouchableOpacity>
            <RBSheet
                ref={ref => {
                    setSheet(ref);
                }}
                height={300}
                openDuration={250}
                customStyles={{
                    container: {
                        justifyContent: "center",
                        alignItems: "center"
                    }
                }}
            >
                <Text style={{color: '#000', alignSelf: 'center', fontSize: 18, margin: 10}}>Choose one of the following complains:</Text>
                <TouchableOpacity style={styles.complain} onPress={() => { Alert.alert('Complain',message); sheet.close()}}>
                    <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Spam or Fake content</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.complain} onPress={() => { Alert.alert('Complain',message); sheet.close()}}>
                    <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Aggressive actions or intimidation</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.complain} onPress={() => { Alert.alert('Complain',message); sheet.close()}}>
                    <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Sexual content</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.complain} onPress={() => { Alert.alert('Complain',message); sheet.close()}}>
                    <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Violation of my rights</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.complain} onPress={() => { Alert.alert('Complain',message); sheet.close()}}>
                    <Text style={{color: '#fff', alignSelf: 'center', fontSize: 16}}>Hateful and offensive content</Text>
                </TouchableOpacity>
            </RBSheet>
            <Image style={styles.image} source={{uri: `${item.photoURL}`}}/>
            <Text style={styles.header}>{item.title}</Text>
            <Text style={styles.text}>{item.context}</Text>
            <Text style={styles.extraInfo}>{t('post_overview:category')}: {item.organization}</Text>
            <Text style={styles.extraInfo}>{t('post_overview:author')}: {item.name}</Text>
            <Text style={styles.extraInfo}>{t('post_overview:date')}: {item.createdAt.substr(0,10)}</Text>

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
    },
    complain: {
        backgroundColor: '#000',
        padding: 10,
        margin: 3,
        borderRadius: 10,
        justifyContent: 'center',
        width: '90%'
    }

});

export default PostOverview;
