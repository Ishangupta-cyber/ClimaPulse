// components/aircondition.js

import { StyleSheet, Text, View } from "react-native";
import { Thermometer, Gauge, WavesIcon, Wind, Mountain, Eye, ThermometerIcon, WindIcon, GaugeIcon, EyeIcon, MountainsIcon } from "phosphor-react-native";

// Helper for data rendering
const StatItem = ({ label, value, unit, icon }) => (
    <View style={airStyles.statCard}>
        <View style={airStyles.statLabelRow}>
            {icon}
            <Text style={airStyles.statLabel}>{label}</Text>
        </View>
        <Text style={airStyles.statValue}>{value} {unit}</Text>
    </View>
);

export default function AirConditions({data}){
    if (!data) return null;

    return (
        <View style={airStyles.mainContainer}>
            <Text style={airStyles.sectionHeader}>AIR CONDITIONS</Text>
            
            <View style={airStyles.grid}>
                <StatItem 
                    label="Feels Like" 
                    value={Math.round(data?.main?.feels_like)} 
                    unit="°C" 
                    icon={<ThermometerIcon size={20} color="#4F8EF7" />}
                />
                <StatItem 
                    label="Humidity" 
                    value={data?.main?.humidity} 
                    unit="%" 
                    icon={<WavesIcon size={20} color="#4CAF50" />}
                />
                <StatItem 
                    label="Wind Speed" 
                    value={data?.wind?.speed} 
                    unit="m/s" 
                    icon={<WindIcon size={20} color="#FF6347" />}
                />
                <StatItem 
                    label="Pressure" 
                    value={data?.main?.pressure} 
                    unit="hPa" 
                    icon={<GaugeIcon size={20} color="#FFD700" />}
                />
                <StatItem 
                    label="Visibility" 
                    value={(data?.visibility / 1000).toFixed(1)} 
                    unit="km" 
                    icon={<EyeIcon size={20} color="#8A2BE2" />}
                />
                <StatItem 
                    label="Ground Level" 
                    value={data?.main?.grnd_level || '—'} 
                    unit="hPa" 
                    icon={<MountainsIcon size={20} color="#A0522D" />}
                />
            </View>
        </View>
    );
}

// --- STYLESHEET (for components/aircondition.js) ---
const airStyles = StyleSheet.create({
    mainContainer: { marginVertical: 20, paddingHorizontal: 5, },
    sectionHeader: { fontWeight: '700', fontSize: 18, color: '#333', marginBottom: 15, borderLeftWidth: 3, borderLeftColor: '#4F8EF7', paddingLeft: 10, },
    grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', },
    statCard: {
        width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2,
    },
    statLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 5, },
    statLabel: { fontSize: 14, color: '#666', fontWeight: '500', },
    statValue: { fontSize: 22, fontWeight: '700', color: '#333', marginTop: 5, }
});