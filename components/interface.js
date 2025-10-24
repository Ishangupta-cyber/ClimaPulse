// components/interface.js (Hourly Forecast Card)

import {  CloudDrizzle, CloudSunIcon, SunIcon, CloudSnowIcon, CloudIcon, CloudRainIcon } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur"; 

// Icon helper function
function getIconComponent(x){
    const size = 32;
    switch (x){
        case "Clear": return <SunIcon size={size} color="#FFD700"/>;
        case "Snow": return <CloudSnowIcon size={size} color="#B0E0E6"/>;
        case "Clouds": return <CloudIcon size={size} color="#90A4AE"/>;
        case "Rain": return <CloudRainIcon size={size} color="#4F8EF7"/>;
        case "Drizzle": return <CloudDrizzle size={size} color="#4F8EF7"/>;
        case "Mist": return <CloudDrizzle size={size} color="#A0A0A0"/>;
        default : return <CloudSunIcon size = {size} color="#FFD700"/>;
    }
}

export default function Interface({data}) {
    if (!data) return null;

    const temp = Math.round(data?.main?.temp);
    const dateText = data?.dt_txt;
    const weather = data.weather[0].main;
    
    const time = dateText?.split(' ')[1];
    const hour = parseInt(time?.slice(0, 2) || 0, 10);
    const formattedTime = hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`;

    return (
        <BlurView intensity={50} tint="light" style={hourlyStyles.card}>
            <Text style={hourlyStyles.timeText}>
                {formattedTime}
            </Text>
            
            {getIconComponent(weather)}
            
            <Text style={hourlyStyles.tempText}>
                {temp}°C
            </Text>
            <Text style={hourlyStyles.weatherText}>
                {weather}
            </Text>
        </BlurView>
    );
}

// --- STYLESHEET (for components/interface.js) ---
const hourlyStyles = StyleSheet.create({
    card: {
        paddingVertical: 15, paddingHorizontal: 10, backgroundColor: 'rgba(255, 255, 255, 0.4)', borderRadius: 15, width: 100, alignItems: "center", justifyContent: 'space-between', marginRight: 15, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeText: { fontSize: 14, fontWeight: 'bold', color: '#333', marginBottom: 5, },
    tempText: { fontSize: 20, fontWeight: '700', color: '#333', marginTop: 5, },
    weatherText: { fontSize: 12, color: '#666', marginTop: 2, textAlign: 'center' },
});