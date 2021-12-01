import React, {useEffect, useState} from 'react';
import {Text, View, StyleSheet, Pressable} from "react-native";
import store from "./redux/store";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import { Provider, useSelector, useDispatch } from "react-redux";
import {PERMISSIONS, request} from "react-native-permissions";
import Geolocation from '@react-native-community/geolocation';
import './i18njs'
import {Image, Platform} from "react-native";
import {actionCoord, actionFilter} from "./redux/actionCreator";
import Profile from "./screens/Profile";
import Post from "./screens/Post";
import Map from "./screens/Map";
import { useTranslation } from "react-i18next";
import {filters, profile} from "./assets/icons";
import PostOverview from "./screens/PostOverview";
import Authorization from "./screens/Authorization";
import PostOnMap from "./screens/PostOnMap";
import {Picker} from "@react-native-picker/picker";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function Home({ navigation }){
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const filter = useSelector((state)=> state.filter);

    useEffect( () => {
        requestLocationPermission();
    }, []);

    useEffect(() => {
        setInterval(() => {
            requestLocationPermission();
        }, 30000);
    }, [])




    const requestLocationPermission = async()=>{
        if(Platform.OS==='ios'){
            let response = request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            if(response==='granted')
                await Geolocation.getCurrentPosition(
                    position => {
                        dispatch(actionCoord([position.coords.latitude,position.coords.longitude]))
                    },
                    (error) => console.log(error.message)
                )
        }else{

            let response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            if(response==='granted')
                await Geolocation.getCurrentPosition(
                    position => {
                        dispatch(actionCoord([position.coords.latitude,position.coords.longitude]))
                    },
                    (error) => console.log(error.message)
                )
        }
    }


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'tomato',
                tabBarInactiveTintColor: '#000',
            })}
        >
            <Tab.Screen
                name="Post"
                component={Post}
                options={{
                    title: t('interface:post'),
                    headerRight: () => (
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <Pressable  name="search" size={28} color="black" style={{padding: 10}} onPress={() => navigation.navigate("Profile")}>
                                <Image
                                    source={profile}
                                    style={styles.icon}/>
                            </Pressable>
                        </View>
                    )
                }}/>

            <Tab.Screen
                name="Map"
                component={Map}
                options={{
                    title: t('interface:map'),
                    headerRight: () => (
                        <View style={{flexDirection: 'row', alignItems: 'center',}}>
                            <Pressable  name="search" size={28} color="black" style={{paddingLeft: 10}}>
                                <Image
                                    source={filters}
                                    style={styles.icon}/>
                            </Pressable>
                            <Picker
                                style={{width: '60%'}}
                                selectedValue={filter}
                                onValueChange={(val) => {
                                    dispatch(actionFilter(val))
                                    console.log('val',val)
                                }}
                            >
                                <Picker.Item label={'Unsolved problems'} value="unsolved" />
                                <Picker.Item label={'Solved problems'} value="solved" />
                            </Picker>
                            <Pressable  name="search" size={28} color="black" style={{padding: 10}} onPress={() => navigation.navigate("Profile")}>
                                <Image
                                    source={profile}
                                    style={styles.icon}/>
                            </Pressable>
                        </View>
                    )
                }}/>
        </Tab.Navigator>
    );
}

function App (){
    const {t} = useTranslation();

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
              <Stack.Screen name="Authorization" component={Authorization} options={{ title: 'Authorization' }}/>
              <Stack.Screen name="Home" component={Home} options={{
              headerShown: false,
            }} />
              <Stack.Screen name="Profile" component={Profile} options={{ title: t('interface:profile') }}/>
              <Stack.Screen name="PostOverview" component={PostOverview} options={{ title: t('interface:post_overview') }}/>
              <Stack.Screen name="PostOnMap" component={PostOnMap} options={{ title: 'PostOnMap' }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
};

const styles = StyleSheet.create({
    icon: {
        aspectRatio: 1,
        width: 25,
        height: 25,
        alignSelf: 'flex-end'
    }
})


export default App;
