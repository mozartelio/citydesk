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
            author: 'Alex',
            post_id: 123123,
            lat: 48.7163855,
            lon: 21.2353705,
            image_url: 'https://previews.123rf.com/images/milanchikov/milanchikov1712/milanchikov171200002/92127016-the-aftermath-of-a-hurricane-broken-trees-fallen-road-signs-.jpg',
            title: 'Broken tree',
            text: 'A tree fell and blocked traffic on the street. A tree fell and blocked traffic on the street',
            category: 'Park supervision service',
            date: new Date().getTime()
        },
        {
            author: 'John Smith',
            post_id: 123124,
            lat: 48.7082395,
            lon: 21.2753505,
            image_url: 'https://img.7dach.ru/image/1200/48/16/83/2020/02/11/3dd0d2-nomark.jpg',
            title: 'Broken links',
            text: 'After storm have noticed this',
            category: 'Electrical dep.',
            date: new Date().getTime()
        },
        {
            author: 'Maria Johns',
            post_id: 123125,
            lat: 48.6982795,
            lon: 21.2353605,
            image_url: 'https://pr.ua/userfiles/newspaper/2014/140/777_3906.jpg',
            title: 'Dangerous  banner',
            text: 'A tree fell and blocked traffic on the street',
            category: 'Advertising comp.',
            date: new Date().getTime()
        },
        {
            author: 'Alex',
            post_id: 123126,
            lat: 48.6682205,
            lon: 21.2753799,
            image_url: 'https://times.cv.ua/wp-content/uploads/2017/08/Balashov-Anton-PrimaMedia1-e1501594623292.jpg',
            title: 'Open manhole',
            text: 'A tree fell and blocked traffic on the street',
            category: 'Vodokanal',
            date: new Date().getTime()
        },

    ]
}

function Map({navigation}){
    const {t} = useTranslation();
    const coord = useSelector((state)=> state.coord);
    const [data, setData] = useState({list:[]})
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
        getMarkersData();
    }, []);

    useEffect(() => {
        setInterval(() => {
            getMarkersData();
        }, 30000);
    }, [])

    const onMarkerPress = (item, index) => {
        map.animateToRegion({
            latitude: item.lat,
            longitude: item.lon,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
        })

        carousel.snapToItem(index)
    }

    const onCarouselItemChange = (index) => {
        map.animateToRegion({
            latitude: data.list[index].lat,
            longitude: data.list[index].lon,
            latitudeDelta: 0.09,
            longitudeDelta: 0.09,
        })

        data.markers[index].showCallout()
    }

    const _renderItem = ({item, index}) => {
        return (
            <Pressable onPress={() => navigation.navigate('PostOverview', {item: item})}>
                <View style={styles.cardContainer}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cartText}>{item.text.length > 70 ? item.text.substr(0, 70)+'...' : item.text}</Text>
                    <Image source={{uri: `${item.image_url}`}} style={styles.cardImage}/>
                </View>
            </Pressable>
        )
    }

    async function getMarkersData(){
        setData(tempData)

    }


    return(
        <View style={styles.container}>
            <Image image={{uri: `${tempData.list[1].image_url}`}} style={{height: 200, width: 100, zIndex: 1000}} />
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
                            key={item.post_id}
                            ref={ref => data.markers[index] = ref}
                            coordinate={{latitude: item.lat, longitude: item.lon}}
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
                renderItem={_renderItem}
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
