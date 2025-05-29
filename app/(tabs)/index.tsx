import { GameLocation, gameLocations } from '@/constants/GameData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router'; // Import router
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Platform, StatusBar, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native'; // Přidán StatusBar
import MapViewComponent from '../../components/MapViewComponent';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { Colors } from '../../constants/Colors';
import { useLocationTracking } from '../../hooks/useLocationTracking';

const ACTIVATION_RADIUS_METERS = 50;

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // poloměr Země v metrech
  const p1 = lat1 * Math.PI / 180;
  const p2 = lat2 * Math.PI / 180;
  const deltaP = p2 - p1;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaP / 2) * Math.sin(deltaP / 2) +
    Math.cos(p1) * Math.cos(p2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // vzdálenost v metrech
}

export default function HomeScreen() {
  const { currentLocation, initialRegion, locationError, updateSimulatedLocation } = useLocationTracking();
  const [activatedLocations, setActivatedLocations] = useState<string[]>([]);
  const [alertShownForOutOfArea, setAlertShownForOutOfArea] = useState(false);
  const [showSimulationControls, setShowSimulationControls] = useState(__DEV__);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<GameLocation | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false); // Nový stav pro fullscreen mapu

  const theme = useColorScheme() ?? 'light';
  const themeColors = Colors[theme]; // Přidáno pro přístup k barvám tématu

  // Efekt pro načtení aktivovaných lokací z AsyncStorage
  useEffect(() => {
    const loadProgress = async () => {
      try {
        const savedProgress = await AsyncStorage.getItem('activatedLocations');
        console.log("Loaded from AsyncStorage:", savedProgress);
        if (savedProgress !== null) {
          const parsedProgress = JSON.parse(savedProgress);
          setActivatedLocations(parsedProgress);
          console.log("Parsed progress:", parsedProgress);
        }
      } catch (e) {
        console.error("Failed to load progress", e);
      }
    };
    loadProgress();
  }, []);

  // Efekt pro uložení aktivovaných lokací do AsyncStorage
  useEffect(() => {
    const saveProgress = async () => {
      try {
        console.log("Saving to AsyncStorage:", activatedLocations);
        await AsyncStorage.setItem('activatedLocations', JSON.stringify(activatedLocations));
      } catch (e) {
        console.error("Failed to save progress", e);
      }
    };
    // Ukládáme vždy, když se activatedLocations změní (po úvodním načtení)
    // Původní podmínka: if (activatedLocations.length > 0)
    saveProgress();
  }, [activatedLocations]);

  // Efekt pro aktivaci lokací na základě polohy
  useEffect(() => {
    if (currentLocation) {
      const newActivatedLocations = [...activatedLocations];
      let updated = false;
      gameLocations.forEach(location => {
        const distance = calculateDistance(
          currentLocation.coords.latitude,
          currentLocation.coords.longitude,
          location.latitude,
          location.longitude
        );
        // console.log(`Distance to ${location.title}: ${distance.toFixed(1)}m`); // Pro ladění vzdáleností
        if (distance < ACTIVATION_RADIUS_METERS && !newActivatedLocations.includes(location.id)) {
          newActivatedLocations.push(location.id);
          console.log(`Location ${location.title} activated!`);
          updated = true;
        }
      });
      if (updated) {
        setActivatedLocations(newActivatedLocations);
      }
    }
  }, [currentLocation, activatedLocations]); // Přidána závislost activatedLocations

  const handleResetProgress = async () => {
    try {
      await AsyncStorage.removeItem('activatedLocations');
      setActivatedLocations([]);
      console.log('--- POSTUP BYL RESETOVÁN ---');
      Alert.alert('Postup resetován', 'Všechny aktivované lokace byly vymazány.');
    } catch (e) {
      console.error("Failed to reset progress", e);
      Alert.alert('Chyba', 'Nepodařilo se resetovat postup.');
    }
  };

  const simulateMove = (lat: number, lon: number) => {
    if (updateSimulatedLocation) {
      updateSimulatedLocation({ latitude: lat, longitude: lon });
    } else {
      console.log(`Simulate move to: ${lat}, ${lon} (updateSimulatedLocation je undefined)`);
    }
  };

  const handleMarkerPress = (location: GameLocation) => { // Opraveno: LocationData -> GameLocation
    setSelectedLocation(location);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedLocation(null);
  };

  const renderSimulationControls = () => {
    return (
      <>
        {gameLocations.map((loc) => (
          <TouchableOpacity
            key={loc.id}
            style={[styles.simulationButton, { backgroundColor: themeColors.tint }]}
            onPress={() => simulateMove(loc.latitude, loc.longitude)}
          >
            <ThemedText
              lightColor={Colors.light.background} // Text bude bílý ve světlém režimu
              darkColor={Colors.dark.background}   // Text bude tmavě šedý v tmavém režimu
              style={{ textAlign: 'center' }}
            >
              {`Přejít na: ${loc.title}`}
            </ThemedText>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={[styles.simulationButton, { backgroundColor: 'red', marginTop: 15, marginBottom: 5 }]} // Výrazná barva pro reset
          onPress={handleResetProgress}
        >
          <ThemedText
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}
            style={{ textAlign: 'center', fontWeight: 'bold' }}
          >
            Resetovat postup
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.simulationButton, { backgroundColor: themeColors.icon, marginTop: 5, marginBottom: 5 }]} // Použití themeColors.icon pro odlišení
          onPress={() => router.push('/style-showcase')}
        >
          <ThemedText
            lightColor={Colors.light.background}
            darkColor={Colors.dark.background}
            style={{ textAlign: 'center' }}
          >
            Zobrazit Style Showcase
          </ThemedText>
        </TouchableOpacity>
      </>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    fullscreenMapContainer: { // Nový styl pro fullscreen mapu
      ...StyleSheet.absoluteFillObject, // Zabere celou obrazovku
      zIndex: 1000, // Aby byla nad ostatními prvky
    },
    mapToggleButton: { // Styl pro tlačítko přepínání mapy
      position: 'absolute',
      top: Platform.OS === 'android' ? StatusBar.currentHeight || 10 : 50, // Pozice pod status barem
      left: 10,
      zIndex: 1001, // Nad mapou
      padding: 10,
      borderRadius: 5,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingTop: 16, // Přidáno odsazení shora, aby obsah nezačínal úplně u okraje
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
      paddingHorizontal: 16,
    },
    mapContainer: {
      height: 300, // Výška mapy
      marginVertical: 10,
      borderWidth: 1,
      borderColor: themeColors.icon, // Použití barvy z tématu
    },
    simulationContainer: {
      padding: 10,
      backgroundColor: themeColors.background, // Opraveno: themeColors.card -> themeColors.background
      borderRadius: 5,
      marginVertical: 10,
      marginHorizontal: 16,
      borderWidth: 1, // Přidán okraj
      borderColor: themeColors.icon, // Barva okraje podle tématu
    },
    simulationButton: { // Přidán nový styl pro tlačítka simulace
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 5,
      marginVertical: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
      margin: 20,
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      width: '80%',
    },
    modalTitle: {
      fontSize: 20, // Větší písmo pro titulek modalu
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      // color: '#000000', // Barva bude řešena dynamicky přes themeColors.text
    },
    modalCloseButtonContainer: {
      marginTop: 20, // Odsazení tlačítka od textu
    },
    modalCloseButton: {
      borderRadius: 10, // Zaoblené rohy tlačítka
      paddingVertical: 10,
      paddingHorizontal: 20,
      elevation: 2, // Stín pro tlačítko
    },
    modalCloseButtonText: {
      fontWeight: 'bold',
      textAlign: 'center',
    },
    debugText: {
      marginVertical: 2,
      padding: 2,
      backgroundColor: 'lightgray',
      color: 'black',
      fontSize: 10,
    }
  });

  // Logika pro zobrazení alertu, pokud je uživatel mimo oblast (zjednodušená)
  useEffect(() => {
    if (currentLocation && initialRegion) {
      const distanceThreshold = 5000;
      const latDiff = Math.abs(currentLocation.coords.latitude - initialRegion.latitude);
      const lonDiff = Math.abs(currentLocation.coords.longitude - initialRegion.longitude);
      if ((latDiff > distanceThreshold / 111000 || lonDiff > distanceThreshold / (111000 * Math.cos(initialRegion.latitude * Math.PI / 180))) && !alertShownForOutOfArea) {
        Alert.alert(
          "Mimo Herní Oblast",
          "Zdá se, že jste příliš daleko od herní oblasti. Některé funkce nemusí být dostupné.",
          [{ text: "OK", onPress: () => setAlertShownForOutOfArea(true) }]
        );
      }
    }
  }, [currentLocation, initialRegion, alertShownForOutOfArea]);

  if (isMapFullscreen) {
    return (
      <View style={styles.fullscreenMapContainer}>
        <MapViewComponent
          initialRegion={initialRegion}
          currentLocation={currentLocation}
          activatedLocations={activatedLocations}
          onMarkerPress={handleMarkerPress}
          themeColors={themeColors}
          styles={{
            map: { flex: 1 },
            calloutContainer: { width: 150 },
            calloutView: { padding: 10, borderRadius: 10 },
            calloutTitle: { fontWeight: 'bold', marginBottom: 5 },
            calloutDescription: { fontSize: 12 },
          }}
        />
        <TouchableOpacity
          style={[styles.mapToggleButton, { backgroundColor: themeColors.tint }]}
          onPress={() => setIsMapFullscreen(false)}
        >
          <ThemedText lightColor={Colors.light.background} darkColor={Colors.dark.background}>
            Zpět do menu
          </ThemedText>
        </TouchableOpacity>
        {selectedLocation && ( // Zobrazení modalu i ve fullscreen mapě
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
          >
            <View style={styles.modalOverlay}>
              <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
                <ThemedText style={[styles.modalTitle, { color: themeColors.text }]}>{selectedLocation.title}</ThemedText>
                <ThemedText style={{ color: themeColors.text, marginBottom: 5 }}>{selectedLocation.task}</ThemedText>
                <ThemedText style={{ color: themeColors.text, fontStyle: 'italic', fontSize: 12, marginBottom: 20 }}>
                  {`Stav: ${activatedLocations.includes(selectedLocation.id) ? 'Aktivováno' : 'Neaktivováno'}`}
                </ThemedText>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButtonContainer}>
                  <View style={[styles.modalCloseButton, { backgroundColor: themeColors.tint }]}>
                    <ThemedText style={[styles.modalCloseButtonText, { color: themeColors.background }]}>Zavřít</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={<View />} // Předán prázdný View jako headerImage
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Vítejte ve V.M.</ThemedText>
        <TouchableOpacity
          style={[styles.simulationButton, { backgroundColor: themeColors.tint, marginLeft: 'auto', paddingHorizontal: 8, paddingVertical: 6 }]} // Upravený styl pro menší tlačítko
          onPress={() => setIsMapFullscreen(true)}
        >
          <ThemedText lightColor={Colors.light.background} darkColor={Colors.dark.background} style={{ fontSize: 12 }}>
            Celá mapa
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Aktuální poloha:</ThemedText>
        <ThemedText style={styles.debugText}>
          {currentLocation ? `${currentLocation.coords.latitude.toFixed(5)}, ${currentLocation.coords.longitude.toFixed(5)} (přesnost: ${currentLocation.coords.accuracy?.toFixed(1)}m)` : 'Není k dispozici'}
        </ThemedText>
        {locationError && <ThemedText style={{ color: 'red' }}>Chyba polohy: {locationError}</ThemedText>}
      </ThemedView>

      <ThemedView style={styles.mapContainer}>
        <MapViewComponent
          initialRegion={initialRegion}
          currentLocation={currentLocation}
          activatedLocations={activatedLocations}
          onMarkerPress={handleMarkerPress} // Obnoveno předání handleMarkerPress
          themeColors={themeColors}
          styles={{
            map: { flex: 1 },
            calloutContainer: { width: 150 }, // Příklad šířky, upravte dle potřeby
            calloutView: { padding: 10, borderRadius: 10 },
            calloutTitle: { fontWeight: 'bold', marginBottom: 5 },
            calloutDescription: { fontSize: 12 },
          }}
        />
        {/* <ThemedText>MapViewComponent je dočasně zakomentován pro testování zvuku.</ThemedText> */}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Debug Info:</ThemedText>
        <ThemedText style={styles.debugText}>Initial Region: {initialRegion ? `${initialRegion.latitude.toFixed(4)}, ${initialRegion.longitude.toFixed(4)}` : 'Není k dispozici'}</ThemedText>
        <ThemedText style={styles.debugText}>Activated Locations: {JSON.stringify(activatedLocations)}</ThemedText>
        <ThemedText style={styles.debugText}>Alert Shown For Out Of Area: {alertShownForOutOfArea.toString()}</ThemedText>
        <ThemedText style={styles.debugText}>Show Simulation Controls: {showSimulationControls.toString()}</ThemedText>
      </ThemedView>

      {Platform.OS !== 'web' && __DEV__ && (
        <>
          {showSimulationControls ? (
            <View style={styles.simulationContainer}>
              <ThemedText style={{ textAlign: 'center', marginBottom: 5, fontWeight: 'bold' }}>Ovládání simulace</ThemedText>
              {renderSimulationControls()}
              <TouchableOpacity
                style={[styles.simulationButton, { backgroundColor: themeColors.tint, marginTop: 10 }]} // Přidán marginTop pro odsazení
                onPress={() => setShowSimulationControls(false)}
              >
                <ThemedText
                  lightColor={Colors.light.background}
                  darkColor={Colors.dark.background}
                  style={{ textAlign: 'center' }}
                >
                  Skrýt ovládání simulace
                </ThemedText>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.stepContainer, { alignItems: 'center' }]}>
              <TouchableOpacity
                style={[styles.simulationButton, { backgroundColor: themeColors.tint }]}
                onPress={() => setShowSimulationControls(true)}
              >
                <ThemedText
                  lightColor={Colors.light.background}
                  darkColor={Colors.dark.background}
                  style={{ textAlign: 'center' }}
                >
                  Zobrazit ovládání simulace
                </ThemedText>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {selectedLocation && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: themeColors.background }]}>
              <ThemedText style={[styles.modalTitle, { color: themeColors.text }]}>{selectedLocation.title}</ThemedText>
              <ThemedText style={{ color: themeColors.text, marginBottom: 5 }}>{selectedLocation.task}</ThemedText>
              {/* V GameData není requiredAccuracy, takže tento řádek je zakomentován
              <ThemedText style={{color: themeColors.text, fontSize: 12, marginBottom: 15}}>Požadovaná přesnost: {selectedLocation.requiredAccuracy}m</ThemedText>
              */}
              {/* Místo description, které není v GameLocation, zobrazíme task v modalu */}

              <ThemedText style={{ color: themeColors.text, fontStyle: 'italic', fontSize: 12, marginBottom: 20 }}>
                {`Stav: ${activatedLocations.includes(selectedLocation.id) ? 'Aktivováno' : 'Neaktivováno'}`}
              </ThemedText>

              <TouchableOpacity onPress={closeModal} style={styles.modalCloseButtonContainer}>
                <View style={[styles.modalCloseButton, { backgroundColor: themeColors.tint }]}>
                  <ThemedText style={[styles.modalCloseButtonText, { color: themeColors.background }]}>Zavřít</ThemedText>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ParallaxScrollView>
  );
}
