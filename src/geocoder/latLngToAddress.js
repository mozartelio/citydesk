import Geocoder from "react-native-geocoding";

Geocoder.init("AIzaSyAN3NZHj1eoagmrRPXsJHqmQcZcnZJQgxw");

export default async function latLngToAddress(lat, lng) {
    let response = await Geocoder.from(lat, lng);
    return response.results[0].formatted_address;
}