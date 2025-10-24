// app/index.js

import { Text, View , ScrollView, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { getCurrentPositionAsync, requestForegroundPermissionsAsync } from "expo-location";
import { TouchableOpacity } from "react-native";
import {    CloudIcon, CloudRainIcon, CloudSunIcon, GpsFixIcon, MapPinIcon, SunIcon } from "phosphor-react-native";
import MapView, { Marker} from "react-native-maps";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useFocusEffect } from "expo-router"; 

import Interface from "../components/interface"
import AirConditions from "../components/aircondition"
import ForeCast from "../components/forecast"


const API_KEY = "335925de577d2cd52549a53e571c6dbe"; 
const INITIAL_LAT = 28.5; 
const INITIAL_LON = 77.2; 

export default function Homepage() {
    const [showMap, setShowMap] = useState(false);
    const [newLocation, setNewLocation] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [forecastData, setForecastData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [mapRegion, setMapRegion] = useState({ 
        latitude: INITIAL_LAT, longitude: INITIAL_LON, latitudeDelta: 5, longitudeDelta: 5 
    });

    // --- Data Controller: Fetch Data ---
    const fetchWeatherData = useCallback(async (lat, lon) => {
        if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
            setError("API Key is not configured.");
            return;
        }

        setIsLoading(true);
        setError(null);

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
        
        try {
            const [weatherRes, forecastRes] = await Promise.all([
                fetch(weatherUrl),
                fetch(forecastUrl),
            ]);

            const weatherJson = await weatherRes.json();
            const forecastJson = await forecastRes.json();

            if (weatherJson.cod !== 200 || forecastJson.cod !== "200") {
                setError(weatherJson.message || "Failed to fetch weather data.");
                setWeatherData(null);
                setForecastData(null);
                return;
            }

            setWeatherData(weatherJson);
            setForecastData(forecastJson);
            setMapRegion({ latitude: lat, longitude: lon, latitudeDelta: 0.5, longitudeDelta: 0.5 });

        } catch (e) {
            setError("Network error. Could not connect to service.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // --- Location Controller: Get GPS Location ---
    const getUserLocation = async () => {
        try {
            const { status } = await requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("Location Denied", "Please enable location access to see local weather.");
                return;
            }
            const location = await getCurrentPositionAsync({});
            
            fetchWeatherData(location.coords.latitude, location.coords.longitude);
        } catch (e) {
            Alert.alert("Error", "Could not get your current location.");
            fetchWeatherData(INITIAL_LAT, INITIAL_LON); // Fallback on error
        }
    };

    // --- UI Handlers ---
    const handleMapPress = (e) => {
        setNewLocation(e.nativeEvent.coordinate);
        setMapRegion({ ...e.nativeEvent.coordinate, latitudeDelta: 0.5, longitudeDelta: 0.5 });
    };

    const confirmMapLocation = () => {
        if (newLocation) {
            fetchWeatherData(newLocation.latitude, newLocation.longitude);
            setShowMap(false); 
            setNewLocation(null); 
        } else {
            Alert.alert("Select Location", "Please tap on the map to select a location first.");
        }
    };
    
    // --- Lifecycle and Refresh ---
    useEffect(() => {
        getUserLocation();
    }, []);

    const heroWeather = useMemo(() => {
        if (!weatherData) return { temp: '—', city: 'Weather App', main: 'Loading data...', icon: 'cloud-off' };
        const temp = Math.round(weatherData.main.temp);
        const mainDesc = weatherData.weather[0].main;
        const Icon = mainDesc === 'Clear' ? SunIcon : mainDesc === 'Rain' ? CloudRainIcon : mainDesc === 'Clouds' ? CloudSunIcon : CloudIcon;
        return {
            temp: `${temp}°C`,
            city: weatherData.name,
            main: weatherData.weather[0].description,
            Icon: Icon
        };
    }, [weatherData]);

    // --- Render Logic ---
    return (
        <ScrollView contentContainerStyle={styles.scrollContent}>
            
            {/* Header / Location Selection */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.locationButton} onPress={getUserLocation} disabled={isLoading}> 
                    <Text style={styles.buttonText}>Current Location</Text>
                    <GpsFixIcon size={22} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.locationButton} onPress={() => setShowMap(!showMap)}>
                    <Text style={styles.buttonText}>{showMap ? 'Hide Map' : 'Select on Map'}</Text>
                    <MapPinIcon size={22} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Map View */}
            {showMap && (
                <View style={styles.mapContainer}>
                    <MapView 
                        style={styles.map}
                        region={mapRegion}
                        onPress={handleMapPress}
                    >
                        {newLocation && <Marker coordinate={newLocation} />}
                    </MapView>
                    <TouchableOpacity onPress={confirmMapLocation} style={styles.confirmButton}>
                        <Text style={styles.confirmButtonText}>Confirm Location</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Loading/Error State */}
            {isLoading && <ActivityIndicator size="large" color="#4F8EF7" style={styles.loadingIndicator} />}
            {error && <Text style={styles.errorText}>Error: {error}</Text>}

            {/* Main Weather Display (Hero Section) */}
            {weatherData && (
                <View style={styles.heroContainer}>
                    <Text style={styles.cityText}>{heroWeather.city}</Text>
                    <Text style={styles.tempText}>{heroWeather.temp}</Text>
                    
                    <heroWeather.Icon size={80} color="#fff" weight="thin" style={{ marginVertical: 10 }} />
                    
                    <Text style={styles.mainDescText}>{heroWeather.main}</Text>
                </View>
            )}

            {/* Air Conditions */}
            {weatherData && <AirConditions data={weatherData} />}

            {/* Today's Forecast (Hourly) */}
            {forecastData && (
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>TODAY'S HOURLY FORECAST</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hourlyScroll}>
                        {forecastData.list.slice(0, 8).map((item) => (
                            <Interface data={item} key={item.dt} />
                        ))}
                    </ScrollView>
                </View>
            )}

            {/* 5-Day Forecast (Daily Summary) */}
            {forecastData && (
                <View style={styles.section}>
                    <Text style={styles.sectionHeader}>5-DAY FORECAST</Text>
                    {forecastData.list.map((item) => (
                        <ForeCast data={item} key={item.dt} />
                    ))}
                </View>
            )}

        </ScrollView>
    );
}
// --- STYLESHEET (for app/index.js) ---
const styles = StyleSheet.create({
    scrollContent: { flexGrow: 1, padding: 15, backgroundColor: '#E6E8EA', },
    loadingIndicator: { marginVertical: 40, },
    errorText: { color: '#E53935', textAlign: 'center', marginVertical: 20, fontSize: 16, fontWeight: 'bold', padding: 10, backgroundColor: '#FFEBEE', borderRadius: 8, },
    buttonRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, gap: 10 },
    locationButton: {
        flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 12, backgroundColor: '#4F8EF7', gap: 8, flex: 1, justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3,
    },
    buttonText: { fontSize: 14, fontWeight: '600', color: '#fff', },
    mapContainer: { borderRadius: 15, overflow: 'hidden', marginBottom: 20, elevation: 5, },
    map: { height: 250, },
    confirmButton: { backgroundColor: '#4CAF50', padding: 12, alignItems: 'center', },
    confirmButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16, },
    heroContainer: {
        alignItems: 'center', marginVertical: 30, padding: 25, backgroundColor: '#4F8EF7', borderRadius: 20, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5,
    },
    cityText: { fontSize: 36, fontWeight: '700', color: '#fff', marginBottom: 5, },
    tempText: { fontSize: 60, fontWeight: '200', color: '#fff', },
    mainDescText: { fontSize: 22, fontWeight: '500', color: '#fff', marginTop: 5 },
    section: { marginBottom: 20, },
    sectionHeader: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10, marginLeft: 5, borderLeftWidth: 3, borderLeftColor: '#4F8EF7', paddingLeft: 10, },
    hourlyScroll: { paddingVertical: 5, }
});