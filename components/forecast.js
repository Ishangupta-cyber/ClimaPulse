// components/forecast.js (Daily Forecast List Item)

import {   CloudDrizzle, SunIcon, CloudSnowIcon, CloudIcon, CloudRainIcon, CloudSunIcon, CalendarIcon } from "phosphor-react-native";
import { StyleSheet, Text, View } from "react-native";

// Helper function to get the day name
const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
};

// Icon helper function
function getIconComponent(x){
    const size = 24;
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

export default function ForeCast({data}) {
    if (!data) return null;

    const temp = Math.round(data?.main?.temp);
    const dateText = data?.dt_txt;
    const weather = data.weather[0].main;
    
    const formattedDateTime = getDayName(dateText);

    return (
        <View style={dailyStyles.card}>
            
            <View style={dailyStyles.leftSide}>
                <CalendarIcon size={20} color="#4F8EF7" />
                <Text style={dailyStyles.dayText}>{formattedDateTime}</Text>
            </View>
            
            <View style={dailyStyles.center}>
                {getIconComponent(weather)}
                <Text style={dailyStyles.weatherText}>{weather}</Text>
            </View>

            <Text style={dailyStyles.tempText}>
                {temp}°C
            </Text>
        </View>
    );
}

// --- STYLESHEET (for components/forecast.js) ---
const dailyStyles = StyleSheet.create({
    card: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', borderRadius: 10, padding: 15, marginVertical: 5, marginHorizontal: 5, borderLeftWidth: 4, borderLeftColor: '#4F8EF7', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    leftSide: { flexDirection: 'row', alignItems: 'center', width: '45%', gap: 8, },
    dayText: { fontSize: 16, fontWeight: '600', color: '#333', },
    center: { flexDirection: 'row', alignItems: 'center', width: '30%', gap: 5, },
    weatherText: { fontSize: 14, color: '#666', fontWeight: '500', },
    tempText: { fontSize: 20, fontWeight: 'bold', color: '#333', },
});