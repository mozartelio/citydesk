import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity} from "react-native";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import {useTheme} from "@react-navigation/native";


function Post(){
    const {t} = useTranslation()

    const coord = useSelector((state)=> state.coord);
    const [height, setHeight] = useState(1);
    const [usedLines, setUsedLines] = useState(1);
    // const [images,setImages

    function _onLayout(e) {
        console.log('e', e.nativeEvent.layout.height);
        // the height increased therefore we also increase the usedLine counter
        if (height < e.nativeEvent.layout.height) {
            setUsedLines(usedLines + 1);
        }
        // the height decreased, we subtract a line from the line counter
        if (height > e.nativeEvent.layout.height) {
            setUsedLines(usedLines - 1);
        }
        // update height if necessary
        if (height !== e.nativeEvent.layout.height) {
            setHeight(e.nativeEvent.layout.height);
        }
    }

    const [image, setImage] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');
    const {colors} = useTheme();
    let bs;
    bs = React.createRef();
    let fall;
    fall = new Animated.Value(1);

    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            console.log(image);
            setImage(image.path);
            //hide the bar after choosing a photo
            bs.current.snapTo(1);
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 300,
            cropping: true,
            compressImageQuality: 0.7
        }).then(image => {
            console.log(image);
            setImage(image.path);
            //hide the bar after choosing a photo
            bs.current.snapTo(1);
        });
    }

    const renderInner = () => (
        <View style={styles.panel}>
            <View style={{alignItems: 'center'}}>
                <Text style={styles.panelTitle}>{t('post:add_photo')}</Text>
                <Text style={styles.panelSubtitle}>{t('post:upload_problem_photo')}</Text>
            </View>
            <TouchableOpacity style={styles.panelButton} onPress={takePhotoFromCamera}>
                <Text style={styles.panelButtonTitle}>{t('post:take_photo')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
                <Text style={styles.panelButtonTitle}>{t('post:choose_from_library')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.panelButton}
                onPress={() => bs.current.snapTo(1)}>
                <Text style={styles.panelButtonTitle}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.panelHeader}>
                <View style={styles.panelHandle} />
            </View>
        </View>
    );



    return(
        <View >
            <View style={styles.container}>
                <TextInput
                    placeholder={t('post:topic')}
                    multiline={true}
                    onLayout={(e) => _onLayout(e)}
                    // numberOfLines={usedLines}
                    // onChangeText={
                    //     (text)=>
                    //     {
                    //         if(text.length===0)setUsedLines(1);
                    //     }
                    // }
                    style={styles.topicInput}
                >
                </TextInput>

                <TextInput
                    placeholder={t('post:description')}
                    multiline={true}
                    style={styles.descriptionInput}
                >
                </TextInput>
                <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                    <Icon name="image" size={30} color="#4b524b" />
                </TouchableOpacity>

            </View>
            <BottomSheet
                    ref={bs}
                    snapPoints={[330, 0]}
                    renderContent={renderInner}
                    renderHeader={renderHeader}
                    initialSnap={1}
                    callbackNode={fall}
                    enabledGestureInteraction={true}
                />

                {/*<Text>{t('interface:helloaaa')}</Text>*/}
                {/*<Text>lon: {coord[0]} lat: {coord[1]}</Text>*/}
            </View>


    )
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // flexDirection:"column",
        backgroundColor: '#fff',
        // alignItems: 'center',
        // justifyContent: 'center',
        // width:'80%',
        height:'100%',
        padding:30
    },
    post:{
        width:'80%',
        height:'90%',
    },
    topicInput:{
        height: 50,
        borderBottomWidth:2,
        borderBottomColor: 'black',
        fontSize:25,
        color:'black',
        fontWeight:'bold'
    },
    descriptionInput:{
        height: 60,
        fontSize:18,
        fontWeight:'normal',
        color:'black',
        marginVertical:10
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#f0f7f2',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#76b2de',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },

});

export default Post;
