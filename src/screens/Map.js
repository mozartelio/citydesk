import React, {useEffect, useState} from "react";
import {Text, View, StyleSheet} from "react-native";
import {useTranslation} from "react-i18next";
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import {useSelector} from "react-redux";

function Map(){
    const {t} = useTranslation();
    const coord = useSelector((state)=> state.coord);
    const [state, setState] = useState({
        initialPosition: {
            latitude: coord[0],
            longitude: coord[1],
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
        }})

    return(
        <View style={styles.container}>
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                mapType={'standard'}
                showsUserLocation={true}
                showsMyLocationButton={true}
                showsCompass={true}
                showsScale={true}
                initialRegion={state.initialPosition}
            >

            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        height: '100%',
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    tiles: {
        opacity: 1
    }
});

export default Map;
