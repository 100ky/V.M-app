import * as Location from 'expo-location';
import React from 'react';
import { Text, View } from 'react-native';
import MapView, { Callout, Marker, Polygon, Region, UrlTile } from 'react-native-maps';
import { Colors } from '../constants/Colors'; // Upraveno pro relativní cestu
import { gameAreaCoordinates, GameLocation, gameLocations, jungmannovySadyParkCoordinates } from '../constants/GameData'; // Upraveno pro relativní cestu

interface Coordinate {
    latitude: number;
    longitude: number;
}

interface MapViewComponentProps {
    initialRegion: Region;
    currentLocation: Location.LocationObject | null;
    activatedLocations: string[];
    themeColors: typeof Colors.light | typeof Colors.dark;
    styles: {
        map: any;
        calloutContainer: any;
        calloutView: any;
        calloutTitle: any;
        calloutDescription: any;
    };
    onMarkerPress: (location: GameLocation) => void; // Přidána nová prop
}

const MapViewComponent: React.FC<MapViewComponentProps> = ({
    initialRegion,
    currentLocation,
    activatedLocations,
    themeColors,
    styles,
    onMarkerPress, // Přidáno do destrukturalizace
}) => {
    console.log('[MapViewComponent] Rendering with activatedLocations:', activatedLocations);

    return (
        <MapView
            style={styles.map}
            region={initialRegion}
            showsUserLocation={true}
        >
            <UrlTile
                urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                maximumZ={19}
            />
            <Polygon
                coordinates={gameAreaCoordinates as Coordinate[]}
                strokeColor={themeColors.tint}
                fillColor={`${themeColors.tint}33`}
                strokeWidth={2}
            />
            <Polygon
                coordinates={jungmannovySadyParkCoordinates as Coordinate[]}
                strokeColor="rgba(0, 180, 0, 0.7)"
                fillColor="rgba(0, 180, 0, 0.2)"
                strokeWidth={2}
            />
            {currentLocation && (
                <Marker
                    coordinate={{
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    }}
                    title="Moje poloha"
                    pinColor={themeColors.tint}
                />
            )}
            {gameLocations.map((location: GameLocation) => {
                const isActivated = activatedLocations.includes(location.id);
                const pinColor = isActivated ? "gold" : "green";
                console.log(`[MapViewComponent] Marker: ${location.title}, Activated: ${isActivated}, PinColor: ${pinColor}`); // Logování zde

                return (
                    <Marker
                        key={`${location.id}-${isActivated}`} // Klíč nyní zahrnuje stav aktivace
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title={location.title}
                        pinColor={pinColor} // Použití vypočítané barvy
                        onPress={() => onMarkerPress(location)}
                    >
                        <Callout tooltip style={styles.calloutContainer} onPress={() => onMarkerPress(location)}>
                            <View style={[styles.calloutView, { backgroundColor: themeColors.background, borderColor: themeColors.icon }]}>
                                <Text style={[styles.calloutTitle, { color: themeColors.text }]}>{location.title}</Text>
                                {/* <Text style={[styles.calloutDescription, { color: themeColors.text }]}>{location.task}</Text> */}
                                {/* Zobrazení úkolu v calloutu může být příliš velké, zvažte zobrazení jen titulku nebo kratšího popisu */}
                                <Text style={[styles.calloutDescription, { color: themeColors.text }]}>Stiskněte pro detaily</Text>
                            </View>
                        </Callout>
                    </Marker>
                );
            })}
        </MapView>
    );
};

export default MapViewComponent;
