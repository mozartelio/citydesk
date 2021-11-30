import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet, Image, Dimensions} from "react-native";
import {useTranslation} from "react-i18next";
import MapView, {Callout, Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import Carousel from 'react-native-snap-carousel'
import {useSelector} from "react-redux";
import {profile} from "../assets/icons";
import {use} from "i18next";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";


let tempData = {
    markers: [],
    list: [
        {
            title: 'Broken tree',
            context: 'A tree fell and blocked traffic on the street.',
            authorID: '61a6399172615abcacef9e2d',
            latitude: 48.7163855,
            longitude: 21.2353705,
            photoURL: 'https://previews.123rf.com/images/milanchikov/milanchikov1712/milanchikov171200002/92127016-the-aftermath-of-a-hurricane-broken-trees-fallen-road-signs-.jpg',

        },
        {
            title: 'Broken links',
            context: 'After storm have noticed this. They are still energized. It can kill somebody!!!',
            authorID: '61a6399172615abcacef9e2d',
            latitude: 48.7082395,
            longitude: 21.2753505,
            photoURL: 'https://img.7dach.ru/image/1200/48/16/83/2020/02/11/3dd0d2-nomark.jpg',
        },
        {
            title: 'Dangerous  banner',
            context: 'This is hanging for the fifth day!!! It can fall each moment on somebodys car',
            authorID: '61a6399172615abcacef9e2d',
            latitude: 48.6982795,
            longitude: 21.2353605,
            photoURL: 'https://pr.ua/userfiles/newspaper/2014/140/777_3906.jpg',
        },
        {
            title: 'Open manhole',
            context: 'I personally saw through the window of my apartment how some man broke his leg due to opened manhole. He was taken away by ambulance, but the manhole is still opened',
            authorID: '61a6399172615abcacef9e2d',
            latitude: 48.6682205,
            longitude: 21.2753799,
            photoURL: 'https://times.cv.ua/wp-content/uploads/2017/08/Balashov-Anton-PrimaMedia1-e1501594623292.jpg',
        },
        {
            title: 'Broken bus stop',
            context: 'Came in the morning at the bus station and saw this. It is terrible that there are still such people like that!',
            authorID: '61a6399172615abcacef9e2d',
            latitude: 48.6282205,
            longitude: 21.3053799,
            photoURL: 'https://rivne.media/media/webp/650/2021/11/0b30b0f663d4801365dc4aeed72770cc72bb0293.webp',
        },

    ]
}

function Map({navigation}){
    const {t} = useTranslation();
    const coord = useSelector((state)=> state.coord);
    const [data, setData] = useState({ list: [], markers: [] })
    const [carousel, setCarousel] = useState(null)
    const [markerIndex, setMarkerIndex] = useState(null)
    const [map, setMap] = useState(null)
    const [state, setState] = useState({
        initialPosition: {
            latitude: coord[0],
            longitude: coord[1],
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
        }})

    useEffect( () => {
        getData();
        console.log(data)
    }, []);

    // useEffect(() => {
    //     setInterval(() => {
    //         getData();
    //     }, 30000);
    // }, [])

    const onMarkerPress = (item, index) => {
        map.animateToRegion({
            latitude: item.latitude,
            longitude: item.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
        })

        carousel.snapToItem(index)
    }

    const onCarouselItemChange = (index) => {
        map.animateToRegion({
            latitude: data.list[index].latitude,
            longitude: data.list[index].longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
        })

        data.markers[index].showCallout()
    }

    const renderItem = ({item, index}) => {
        return (
            <Pressable onPress={() => navigation.navigate('PostOverview', {item: item})}>
                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cartText}>{item.context.length > 70 ? item.context.substr(0, 70)+'...' : item.context}</Text>
                    <Image source={{uri: `${item.photoURL}`}} style={styles.cardImage}/>
                </View>
            </Pressable>
        )
    }

    const getData = async function () {
        const GET_UNSLOVED_PROBLEMS = 'https://hackathon-citydesk.herokuapp.com/getAllUnsolvedProblems';

        let list = null;
        try {
            const response = await fetch(GET_UNSLOVED_PROBLEMS);
            if(response.status === 200 ) {
                list = await response.json();
                list.map(async (item, index) =>{
                    const user_response = await fetch(`https://hackathon-citydesk.herokuapp.com/getUser/${item.authorID}`);
                    if(user_response.status === 200) {
                        let user = await user_response.json();
                        list[index].name = user.name
                    }else{
                        list[index].name = '';
                    }
                })
            }else
                list = [];
        } catch (error) {
            console.log(error.message);
        }
        setData({markers: [], list: list})

    }


    return(
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                ref = {m => setMap(m)}
                mapType={'standard'}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                initialRegion={state.initialPosition}
            >
                {
                    data.list.map((item, index) => (
                        <Marker
                            key={item.createdAt}
                            ref={ref => data.markers[index] = ref}
                            coordinate={{latitude: item.latitude, longitude: item.longitude}}
                            onPress={() => onMarkerPress(item, index)}
                        >
                            <Callout>
                                <Text>{item.title}</Text>
                            </Callout>
                        </Marker>
                    ))
                }


            </MapView>

            <Carousel
                ref={(c) => { setCarousel(c); }}
                data={data.list}
                renderItem={renderItem}
                containerCustomStyle={styles.carousel}
                sliderWidth={Dimensions.get('window').width}
                onSnapToItem={index => onCarouselItemChange(index)}
                removeClippedSubviews={false}
                itemWidth={300}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
     },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    tiles: {
        opacity: 1
    },carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 10
    },
    cardContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        height: 200,
        width: 300,
        padding: 3,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    cardTitle: {
        color: '#fff',
        fontSize: 22,
        alignSelf: "center"
    },
    cartText: {
        color: '#fff',
        fontSize: 16,
        alignSelf: "center"
    }
});

export default Map;
