import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

export interface Region {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

// --- Konfigurace pro simulaci polohy ---
const USE_MOCK_LOCATION = true; // Vráceno na true pro vývoj se simulovanou polohou
const VYSOKE_MYTO_COORDINATES = {
    latitude: 49.9530,
    longitude: 16.1575,
    latitudeDelta: 0.02, // Přiměřený zoom pro město
    longitudeDelta: 0.01,
};
const MOCK_COORDINATES = { // Nastaveno na Vysoké Mýto pro výchozí simulaci
    latitude: VYSOKE_MYTO_COORDINATES.latitude,
    longitude: VYSOKE_MYTO_COORDINATES.longitude,
};

// --- Konec konfigurace pro simulaci polohy ---

export const useLocationTracking = () => {
    const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
    const [initialRegion, setInitialRegion] = useState<Region>(() => {
        if (USE_MOCK_LOCATION) {
            return {
                latitude: MOCK_COORDINATES.latitude, // Nyní Vysoké Mýto
                longitude: MOCK_COORDINATES.longitude, // Nyní Vysoké Mýto
                latitudeDelta: VYSOKE_MYTO_COORDINATES.latitudeDelta, // Zoom pro Vysoké Mýto
                longitudeDelta: VYSOKE_MYTO_COORDINATES.longitudeDelta, // Zoom pro Vysoké Mýto
            };
        }
        // Pokud nepoužíváme mock, defaultně Vysoké Mýto
        // useEffect níže přepíše skutečnou polohou, pokud je dostupná
        return {
            latitude: VYSOKE_MYTO_COORDINATES.latitude,
            longitude: VYSOKE_MYTO_COORDINATES.longitude,
            latitudeDelta: VYSOKE_MYTO_COORDINATES.latitudeDelta,
            longitudeDelta: VYSOKE_MYTO_COORDINATES.longitudeDelta,
        };
    });
    const [locationError, setLocationError] = useState<string | null>(null);

    // Hlavní useEffect pro získávání polohy - ODKOMENTOVÁNO
    useEffect(() => {
        (async () => {
            if (USE_MOCK_LOCATION) {
                console.log('--- POUŽÍVÁ SE SIMULOVANÁ POLOHA (POČÁTEČNÍ) ---');
                const mockLocObj: Location.LocationObject = {
                    coords: {
                        latitude: MOCK_COORDINATES.latitude,
                        longitude: MOCK_COORDINATES.longitude,
                        accuracy: null,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                    },
                    timestamp: Date.now(),
                };
                setCurrentLocation(mockLocObj);
                // setInitialRegion se již nastavuje při inicializaci useState výše
                // Pokud bychom chtěli aktualizovat i initialRegion zde specificky pro mock:
                // setInitialRegion({
                //     latitude: MOCK_COORDINATES.latitude,
                //     longitude: MOCK_COORDINATES.longitude,
                //     latitudeDelta: 0.0922, // Nebo jiná delta pro mock
                //     longitudeDelta: 0.0421,
                // });
                return; // Ukončíme, pokud používáme mock polohu
            }

            // Pokud nepoužíváme mock polohu, získáme skutečnou polohu
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setLocationError('Oprávnění k přístupu k poloze bylo zamítnuto.');
                Alert.alert('Chyba Polohy', 'Oprávnění k přístupu k poloze bylo zamítnuto.');
                return;
            }

            try {
                const location = await Location.getCurrentPositionAsync({});
                setCurrentLocation(location);
                setInitialRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.005, // Menší delta pro přesnější zobrazení aktuální polohy
                    longitudeDelta: 0.0021,
                });
                setLocationError(null); // Vyčistíme případné předchozí chyby
            } catch (error) {
                console.error("Error fetching location: ", error);
                setLocationError('Nepodařilo se získat aktuální polohu.');
                Alert.alert('Chyba Polohy', 'Nepodařilo se získat aktuální polohu.');
            }
        })();
    }, []); // Prázdné pole závislostí znamená, že se efekt spustí jen jednou po mountnutí

    // Funkce updateSimulatedLocation zatím zůstává dummy, dokud neobnovíme plnou logiku
    const updateSimulatedLocation = (newCoords: { latitude: number, longitude: number }) => {
        if (USE_MOCK_LOCATION) { // Přidána kontrola, aby se simulace aktualizovala jen pokud je zapnutá
            console.log(`--- AKTUALIZACE SIMULOVANÉ POLOHY NA: ${JSON.stringify(newCoords)} ---`);
            const mockLocObj: Location.LocationObject = {
                coords: { ...newCoords, accuracy: null, altitude: null, altitudeAccuracy: null, heading: null, speed: null },
                timestamp: Date.now(),
            };
            setCurrentLocation(mockLocObj);
            // Nastavení regionu pro zoom level ~14
            setInitialRegion({
                latitude: newCoords.latitude,
                longitude: newCoords.longitude,
                latitudeDelta: 0.005, // Menší delta pro větší přiblížení (zoom ~14-15)
                longitudeDelta: 0.0021, // Menší delta pro větší přiblížení
            });
        } else {
            Alert.alert('Simulace vypnuta', 'Pro aktualizaci simulované polohy nastavte USE_MOCK_LOCATION na true v useLocationTracking.ts.');
        }
    };

    return {
        currentLocation,
        initialRegion,
        locationError,
        updateSimulatedLocation // Nyní by měla fungovat i aktualizace simulované polohy
    };
};
