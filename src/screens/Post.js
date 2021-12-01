import React, {useState} from "react";
import {Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity, Button} from "react-native";
import {useTranslation} from "react-i18next";
import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';
import Icon from "react-native-vector-icons/Ionicons";
import ImagePicker from 'react-native-image-crop-picker';
import {actionLanguage} from "../redux/actionCreator";
import i18n from "i18next";
import {Picker} from "@react-native-picker/picker";
import {useSelector} from "react-redux";
import storage from "@react-native-firebase/storage";
import {expectNoConsoleError} from "react-native/Libraries/Utilities/ReactNativeTestTools";



function Post({navigation}){
    const {t} = useTranslation()

    const [image, setImage] = useState(null);
    const [bs, setBs] = useState(React.createRef())
    const fall = new Animated.Value(1);
    const [responsible, setResponsible] = useState(null)
    const userId = useSelector((state)=> state.userId);
    const coord = useSelector((state)=> state.coord);
    const postCoord = useSelector((state)=> state.postCoord);
    const [title, setTitle] = useState(' ');
    const [context, setContext] = useState(' ');

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
            if(image == null) {
                alert('Please choose an image')
                return;
            }
            if(responsible == '') {
                alert('Please choose the responsible organization')
                return;
            }
            if(title == '') {
                alert('Please add the title')
                return;
            }
            if(context == '') {
                alert('Please fill the title')
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
                    longitude: location[1]
                    // responsibleOrganizations: [responsible]

                })
            };
            console.log(userId)


            console.log('data', requestOptions)
            let response = await fetch(`${SERVER}addProblem`, requestOptions);
            if(response.status != 200){
                alert(`Server error ${response.status}\n Try again later`);
                return;
            }else{
                alert(`Post was successfully added`);
            }

        }catch (e){
            console.log(e.message())
        }
    }

    return(
        <View >
            <View style={styles.container}>
                <TextInput
                    onChangeText={text => setTitle(text)}
                    placeholder={t('post:topic')}
                    multiline={true}
                    maxLength={22}
                    style={styles.topicInput}
                >
                </TextInput>

                <TextInput
                    //
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
                    <Picker.Item label={'Správa mestskej zelene v Košiciach'} value="61a691bb995723164217eedd" />
                    <Picker.Item label={'Dopravný podnik mesta Košice, a.s.'} value="61a6927d35a0b6cb15e4cf80" />
                    <Picker.Item label={'Mestské lesy Košice, a.s.'} value="61a6927d35a0b6cb15e4cf7f" />
                    <Picker.Item label={'SPP'} value="61a6927d35a0b6cb15e4cf82" />
                    <Picker.Item label={'Východoslovenská vodárenská spoločnosť, a.s.'} value="61a6927d35a0b6cb15e4cf81" />
                    <Picker.Item label={'Ja neviem'} value="61a762fa518121cf0cb8f921" />
                </Picker>

                <TouchableOpacity onPress={() => bs.current.snapTo(0)}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end'}}>
                        <Text style={{fontSize: 18}}>{image==null ? t('post:att_image') : 'Image was added'} </Text>
                        <Icon name="image" size={30} color="#4b524b" />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('PostOnMap')}>
                    <View style={{flexDirection: 'row', justifyContent: 'flex-end', alignContent: 'flex-end'}}>
                        <Text style={{fontSize: 18}}>lat: {postCoord!=null ? postCoord[0] : coord[0]}{'\n'}lon: {postCoord!=null  ? postCoord[1] : coord[1]} </Text>
                        <Icon name="location" size={30} color="#4b524b" />
                    </View>
                </TouchableOpacity>
                <Button title={'Post'} onPress={()=>post()}/>
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
        height: 50,
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
