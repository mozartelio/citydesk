import React, { useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Alert, AppRegistry, ScrollView,
} from "react-native";
import {useTranslation} from "react-i18next";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import {Picker} from "@react-native-picker/picker";
import {useSelector} from "react-redux";
import storage from "@react-native-firebase/storage";




function Post({navigation}){
    const {t} = useTranslation()

    const [image, setImage] = useState(null);
    const [bs, setBs] = useState(React.createRef())
    const fall = new Animated.Value(1);
    const [responsible, setResponsible] = useState('')
    const userId = useSelector((state)=> state.userId);
    const coord = useSelector((state)=> state.coord);
    const postCoord = useSelector((state)=> state.postCoord);
    const [title, setTitle] = useState('');
    const [context, setContext] = useState('');
    const [titleRef, setTitleRef] = useState(null);
    const [contextRef, setContextRef] = useState(null);


    const takePhotoFromCamera = () => {
        ImagePicker.openCamera({
            // compressImageMaxWidth: 800,
            // compressImageMaxHeight: 800,
            cropping: true,

        }).then(image => {
            console.log(image);
            setImage(image.path);
            //hide the bar after choosing a photo
            bs.current.snapTo(1);
        }).catch(error => {
            switch (error){
                case "CAMERA_UNAVAILABLE":
                    Alert.alert(t('post:no_camera'),t('post:no_camera_description'));
                    break;
                case "OTHERS": case "PERMISSION": default:
                    Alert.alert(t('post:camera_error'),t('post:camera_error_description'));
            }
        });
    }

    const choosePhotoFromLibrary = () => {
        ImagePicker.openPicker({
            // width: 800,
            // height: 800,
            cropping: true,
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
                <Text style={styles.panelButtonTitle}>{t('post:cancel_photo')}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderHeader = () => (
        <View style={styles.header}>

        </View>
    );

    async function loadPhoto(imagePath) {
        let fileName = imagePath.substring(imagePath.lastIndexOf("/") + 1);
        // await auth().signInAnonymously();
        await storage().ref(fileName).putFile(imagePath);
        return storage().ref(fileName).getDownloadURL();
    }



    console.log(postCoord)
    console.log(coord)

    async function post() {
        const SERVER = 'https://hackathon-citydesk.herokuapp.com/'

        try {
            if(title == '' || context== '') {
                Alert.alert('Warning','Please choose fill the form')
                return;
            }
            if(responsible == '') {
                Alert.alert('Warning','Please choose the responsible organization')
                return;
            }
            if(image == null) {
                Alert.alert('Warning','Please choose an image')
                return;
            }
            if(context == '') {
                Alert.alert('Warning','Please fill the title')
                return;
            }
            let postImageUrl = await loadPhoto(image)
            let location = postCoord == null ? coord : postCoord;
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title,
                    context: context,
                    authorId: userId,
                    photoURL: postImageUrl,
                    latitude: location[0],
                    longitude: location[1],
                    responsibleOrganizations: [responsible]

                })
            };
            setTitle('');
            setContext('');
            setResponsible('');
            setImage(null);
            if(titleRef)
                titleRef.clear();
            if(contextRef)
                contextRef.clear();
            console.log('data', requestOptions)
            let response = await fetch(`${SERVER}addProblem`, requestOptions);
            if(response.status != 200) {
                Alert.alert('Ups',`Server error ${response.status}\n Try again later`);
                return;
            // }else if(response.status != 402){
            //     Alert.alert('Ups',`Your account is banned, you can\'t send ant posts`);
            //     return;
            }else{
                Alert.alert('Success',`Post was successfully added`);
            }


        }catch (e){
            console.log(e.message())
        }
    }

    return(
        <View >
            <View style={styles.container}>
                <ScrollView>
                    <TextInput
                        ref={input => { setTitleRef(input)  }}
                        onChangeText={text => setTitle(text) }
                        placeholder={t('post:topic')}
                        multiline={true}
                        maxLength={35}
                        style={styles.topicInput}
                    >
                    </TextInput>
                    <TextInput
                        ref={input => { setContextRef(input)  }}
                        placeholder={t('post:description')}
                        multiline={true}
                        onChangeText={text => setContext(text)}
                        numberOfLines={10}
                        maxLength={500}
                        style={styles.descriptionInput}
                    >
                    </TextInput>

                    <Picker
                        style={{ width: "100%" }}
                        selectedValue={responsible}
                        onValueChange={(val) => {
                            setResponsible(val)

                        }}
                    >
                        <Picker.Item value='' label={`${t('post:choose_responsible')}`} />
                        <Picker.Item label={t('post:zelene')} value="61a691bb995723164217eedd" />
                        <Picker.Item label={t("post:dopravny_podnik")} value="61a6927d35a0b6cb15e4cf80" />
                        <Picker.Item label={t("post:lesy")} value="61a6927d35a0b6cb15e4cf7f" />
                        <Picker.Item label={t("post:spp")} value="61a6927d35a0b6cb15e4cf82" />
                        <Picker.Item label={t("post:vodarenska")} value="61a6927d35a0b6cb15e4cf81" />
                        <Picker.Item label={t("post:dontknow")} value="61a762fa518121cf0cb8f921" />
                    </Picker>

                    <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end', marginTop: 20}}>
                            <Text style={{fontSize: 18}}>{image==null ? t('post:att_image') : 'Image was added'} </Text>
                            <Icon name="image" size={30} color="#4b524b" />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('PostOnMap')}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end', marginTop: 20}}>
                            <Text style={{fontSize: 18}}>lat: {postCoord!=null ? postCoord[0] : coord[0]}{'\n'}lon: {postCoord!=null  ? postCoord[1] : coord[1]} </Text>
                            <Icon name="location" size={30} color="#4b524b" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={{...styles.panelButton, marginTop: 30}} onPress={() => post()}>
                        <Text style={styles.panelButtonTitle}>{t("post:post")}</Text>
                    </TouchableOpacity>
                </ScrollView>

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
        width:'100%',
        height:'100%',
        padding:30
    },
    post:{
        width:'80%',
        height:'90%',
    },
    topicInput:{
        // height: 50,
        borderBottomWidth:2,
        borderBottomColor: 'black',
        fontSize:25,
        color:'black',
        fontWeight:'bold'
    },
    descriptionInput:{
        fontSize:18,
        height: 200,
        borderBottomWidth: 2,
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
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: {width: -1, height: -3},
        shadowRadius: 2,
        shadowOpacity: 0.4,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
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
        backgroundColor: '#010101',
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
AppRegistry.registerComponent('AutogrowTextinput', () => Post);
