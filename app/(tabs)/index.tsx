import * as Location from 'expo-location'; // Importujeme expo-location
import React, { useEffect, useState } from 'react'; // Importujeme useState a useEffect
import { Alert, StyleSheet, Text, View, useColorScheme } from 'react-native'; // Přidáme Alert a Text, useColorScheme
import MapView, { Callout, Marker, Polygon, UrlTile } from 'react-native-maps'; // Importujeme Callout a Polygon
import { Colors } from '../../constants/Colors'; // Importujeme barvy

interface GameLocation {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  task: string;
  answer: string; // Přidáno pole pro odpověď
}

const gameLocations: GameLocation[] = [
  {
    id: 'prazska_brana',
    latitude: 49.95461,
    longitude: 16.15855,
    title: 'Pražská brána',
    task: 'Najděte na hodinkovém ciferníku čas, který ukazuje sluneční hodiny na věži, a spočítejte, o kolik minut se liší od místního času. Odpověď zadejte jako číslo (počet minut).',
    answer: '10', // Ukázková odpověď
  },
  {
    id: 'kostel_sv_vavrince',
    latitude: 49.952330,
    longitude: 16.158826,
    title: 'Kostel sv. Vavřince',
    task: 'V kostelní lodi najděte scény znázorňující založení města Přemyslem Otakarem II. a vyhledejte v nich zakódované písmeno.',
    answer: 'A', // Ukázková odpověď
  },
  {
    id: 'mariansky_sloup',
    latitude: 49.9535524,
    longitude: 16.1606534,
    title: 'Mariánský morový sloup',
    task: 'Poznamenejte si, kolik hvězd má kolem hlavy Panna Maria (číslo).',
    answer: '12', // Skutečný počet je 12, ale pro test může být cokoliv
  },
  {
    id: 'renesancni_zvonice',
    latitude: 49.9520413,
    longitude: 16.1592719,
    title: 'Renesanční zvonice u kostela sv. Vavřince',
    task: 'Vydejte se do okolí zvonice a spočtěte, kolik horních kleneb v okolních pasážích lemuje věž (využijte je jako orientační značky).',
    answer: '8', // Ukázková odpověď - nutno ověřit skutečný počet
  },
  {
    id: 'litomyslska_brana',
    latitude: 49.9515954,
    longitude: 16.1608413,
    title: 'Litomyšlská (státní) brána',
    task: 'Určete výšku brány a použijte ji jako klíč pro matematický úkol (např. spočtěte obvod šestistěnu o této délce hrany).',
    answer: '15', // Ukázková odpověď - např. výška brány v metrech
  },
  {
    id: 'chocenska_vez',
    latitude: 49.9536057,
    longitude: 16.1633893,
    title: 'Choceňská (Karaska) věž',
    task: 'Najděte na Karasce nápis s rokem některého požáru a použijte tento rok pro odhalení hesla v šifře.',
    answer: '1623', // Ukázková odpověď - příklad roku
  },
  {
    id: 'jungmannovy_sady',
    latitude: 49.9507083, // První bod polygonu Jungmannových sadů
    longitude: 16.1606775, // První bod polygonu Jungmannových sadů
    title: 'Jungmannovy sady',
    task: 'V parku najděte co nejvíc letopočtů na pomnících či deskách; sepište je a seřaďte vzestupně, abyste získali kód.',
    answer: '1868', // Ukázková odpověď - např. nejstarší letopočet
  },
  {
    id: 'vodarenska_basta',
    latitude: 49.9558706,
    longitude: 16.1592735,
    title: 'Vodárenská bašta',
    task: 'Spočítejte počet rovných hran starého kamenného zdiva (při pohledu zdola nahoru) – součet využijte v matematické hádance.',
    answer: '6', // Ukázková odpověď - např. počet hran
  },
  {
    id: 'socha_sv_jana_nepomuckeho',
    latitude: 49.9506447,
    longitude: 16.1609992,
    title: 'Socha sv. Jana Nepomuckého',
    task: 'Spočítejte hvězdičky na svatozáři (cca 5) a kolik cest vede ke kříži – tyto číslice použijte jako součást kombinace.',
    answer: '55', // Ukázková odpověď - 5 hvězdiček a 5 cest
  },
  {
    id: 'namesti_centrum',
    latitude: 49.95350,
    longitude: 16.16060,
    title: 'Náměstí Přemysla Otakara II. (centrum)',
    task: 'Zjistěte historický název tohoto náměstí a rok poslední velké rekonstrukce.',
    answer: 'Velké náměstí, 2010', // Ukázková odpověď - historický název a rok
  },
  {
    id: 'socha_otakar',
    latitude: 49.9546340, // Aktualizované souřadnice
    longitude: 16.1583151, // Aktualizované souřadnice
    title: 'Socha Přemysla Otakara II.',
    task: 'Který významný panovník je zde zobrazen a jaký atribut drží v ruce? Odpovězte ve formátu: Jméno, atribut (např. Karel IV., koruna)',
    answer: 'Přemysl Otakar II., model města', // Ukázková odpověď
  },
  {
    id: 'pomnik_vojaci',
    latitude: 49.95084,
    longitude: 16.16130,
    title: 'Pomník padlým vojákům 30. pěšího pluku',
    task: 'Kolik jmen padlých vojáků je vytesáno na hlavní desce pomníku? (číslo)',
    answer: '72', // Ukázková odpověď - nutno ověřit skutečný počet
  },
];

const jungmannovySadyParkCoordinates = [
  { latitude: 49.9507083, longitude: 16.1606775 },
  { latitude: 49.9507139, longitude: 16.1607368 },
  { latitude: 49.9507763, longitude: 16.1609205 },
  { latitude: 49.9509447, longitude: 16.1609335 },
  { latitude: 49.9510154, longitude: 16.1608641 },
  { latitude: 49.9510843, longitude: 16.1608901 },
  { latitude: 49.9511354, longitude: 16.1606226 },
  { latitude: 49.9511772, longitude: 16.1606374 },
  { latitude: 49.9512127, longitude: 16.1606569 },
  { latitude: 49.9511916, longitude: 16.1607510 },
  { latitude: 49.9511760, longitude: 16.1607480 },
  { latitude: 49.9511560, longitude: 16.1608510 },
  { latitude: 49.9511521, longitude: 16.1609543 },
  { latitude: 49.9511404, longitude: 16.1610429 },
  { latitude: 49.9510494, longitude: 16.1617314 },
  { latitude: 49.9511436, longitude: 16.1617585 },
  { latitude: 49.9512993, longitude: 16.1618276 },
  { latitude: 49.9513090, longitude: 16.1619115 },
  { latitude: 49.9512778, longitude: 16.1621566 },
  { latitude: 49.9512991, longitude: 16.1622155 },
  { latitude: 49.9513024, longitude: 16.1622292 },
  { latitude: 49.9513262, longitude: 16.1623272 },
  { latitude: 49.9514123, longitude: 16.1625001 },
  { latitude: 49.9514039, longitude: 16.1625131 },
  { latitude: 49.9514919, longitude: 16.1626346 },
  { latitude: 49.9515733, longitude: 16.1627257 },
  { latitude: 49.9515781, longitude: 16.1627471 },
  { latitude: 49.9516035, longitude: 16.1627575 },
  { latitude: 49.9516457, longitude: 16.1627852 },
  { latitude: 49.9517310, longitude: 16.1628522 },
  { latitude: 49.9518299, longitude: 16.1629024 },
  { latitude: 49.9519078, longitude: 16.1629289 },
  { latitude: 49.9519869, longitude: 16.1629766 },
  { latitude: 49.9519832, longitude: 16.1629838 },
  { latitude: 49.9520390, longitude: 16.1630077 },
  { latitude: 49.9520985, longitude: 16.1630414 },
  { latitude: 49.9523028, longitude: 16.1631443 },
  { latitude: 49.9523398, longitude: 16.1631574 },
  { latitude: 49.9525489, longitude: 16.1632550 },
  { latitude: 49.9525471, longitude: 16.1632673 },
  { latitude: 49.9525601, longitude: 16.1632702 },
  { latitude: 49.9525620, longitude: 16.1632608 },
  { latitude: 49.9526201, longitude: 16.1632846 },
  { latitude: 49.9526192, longitude: 16.1632955 },
  { latitude: 49.9526313, longitude: 16.1632984 },
  { latitude: 49.9526336, longitude: 16.1632890 },
  { latitude: 49.9526574, longitude: 16.1633013 },
  { latitude: 49.9526569, longitude: 16.1633114 },
  { latitude: 49.9526708, longitude: 16.1633128 },
  { latitude: 49.9526732, longitude: 16.1633070 },
  { latitude: 49.9527685, longitude: 16.1633381 },
  { latitude: 49.9531469, longitude: 16.1635172 },
  { latitude: 49.9533534, longitude: 16.1635753 },
  { latitude: 49.9533524, longitude: 16.1636013 },
  { latitude: 49.9533645, longitude: 16.1636021 },
  { latitude: 49.9533673, longitude: 16.1635919 },
  { latitude: 49.9533883, longitude: 16.1635963 },
  { latitude: 49.9533938, longitude: 16.1635883 },
  { latitude: 49.9534397, longitude: 16.1635982 },
  { latitude: 49.9534357, longitude: 16.1636422 },
  { latitude: 49.9534748, longitude: 16.1636509 },
  { latitude: 49.9534766, longitude: 16.1636062 },
  { latitude: 49.9535134, longitude: 16.1636216 },
  { latitude: 49.9535735, longitude: 16.1636262 },
  { latitude: 49.9536071, longitude: 16.1636250 },
  { latitude: 49.9536199, longitude: 16.1638108 },
  { latitude: 49.9535823, longitude: 16.1638077 },
  { latitude: 49.9534537, longitude: 16.1637970 },
  { latitude: 49.9534536, longitude: 16.1637893 },
  { latitude: 49.9533910, longitude: 16.1637782 },
  { latitude: 49.9529909, longitude: 16.1636466 },
  { latitude: 49.9529746, longitude: 16.1639119 },
  { latitude: 49.9527071, longitude: 16.1637044 },
  { latitude: 49.9525806, longitude: 16.1636495 },
  { latitude: 49.9524298, longitude: 16.1635988 },
  { latitude: 49.9521823, longitude: 16.1635800 },
  { latitude: 49.9520892, longitude: 16.1634947 },
  { latitude: 49.9518166, longitude: 16.1633891 },
  { latitude: 49.9516342, longitude: 16.1633009 },
  { latitude: 49.9514379, longitude: 16.1632286 },
  { latitude: 49.9513625, longitude: 16.1632633 },
  { latitude: 49.9511466, longitude: 16.1632604 },
  { latitude: 49.9511326, longitude: 16.1632358 },
  { latitude: 49.9511159, longitude: 16.1631997 },
  { latitude: 49.9510871, longitude: 16.1631953 },
  { latitude: 49.9507846, longitude: 16.1630565 },
  { latitude: 49.9508107, longitude: 16.1628931 },
  { latitude: 49.9509475, longitude: 16.1629090 },
  { latitude: 49.9510619, longitude: 16.1628873 },
  { latitude: 49.9511326, longitude: 16.1629307 },
  { latitude: 49.9511876, longitude: 16.1627123 },
  { latitude: 49.9509410, longitude: 16.1624140 },
  { latitude: 49.9508410, longitude: 16.1623480 },
  { latitude: 49.9506906, longitude: 16.1621512 },
  { latitude: 49.9506720, longitude: 16.1621396 },
  { latitude: 49.9506600, longitude: 16.1621650 },
  { latitude: 49.9506540, longitude: 16.1621840 },
  { latitude: 49.9506210, longitude: 16.1621580 },
  { latitude: 49.9503649, longitude: 16.1619704 },
  { latitude: 49.9503770, longitude: 16.1619299 },
  { latitude: 49.9503426, longitude: 16.1619010 },
  { latitude: 49.9506348, longitude: 16.1608742 },
  { latitude: 49.9507083, longitude: 16.1606775 }, // Uzavření polygonu
];


const gameAreaCoordinates = [
  { latitude: 49.9543377, longitude: 16.1599395 }, // NW roh Náměstí Přemysla Otakara II.
  { latitude: 49.9538893, longitude: 16.1618667 }, // NE roh Náměstí Přemysla Otakara II.
  { latitude: 49.9527494, longitude: 16.1614292 }, // SE roh Náměstí Přemysla Otakara II.
  { latitude: 49.9531885, longitude: 16.1593410 }, // SW roh Náměstí Přemysla Otakara II.
  { latitude: 49.9543377, longitude: 16.1599395 } // Uzavření polygonu
]; // Opraveno z };

// Konstanty a funkce pro výpočet vzdálenosti
const ACTIVATION_DISTANCE = 20; // Vzdálenost v metrech pro aktivaci úkolu

// Funkce pro výpočet vzdálenosti mezi dvěma GPS souřadnicemi (Haversinova formule)
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Poloměr Země v metrech
  const φ1 = lat1 * Math.PI / 180; // φ, λ v radiánech
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // Vzdálenost v metrech
  return d;
}

// Funkce pro kontrolu, zda je bod uvnitř polygonu (Ray casting algorithm)
function isPointInPolygon(point: { latitude: number, longitude: number }, polygon: { latitude: number, longitude: number }[]): boolean {
  let x = point.longitude, y = point.latitude;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].longitude, yi = polygon[i].latitude;
    let xj = polygon[j].longitude, yj = polygon[j].latitude;

    let intersect = ((yi > y) !== (yj > y))
      && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

export default function HomeScreen() {
  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject | null>(null);
  const [initialRegion, setInitialRegion] = useState({
    latitude: 50.002, // Výchozí Vysoké Mýto
    longitude: 16.155,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [activatedLocations, setActivatedLocations] = useState<string[]>([]);
  const [alertShownForOutOfArea, setAlertShownForOutOfArea] = useState(false); // Nový stav
  const colorScheme = useColorScheme(); // Získáme aktuální barevné schéma
  const themeColors = Colors[colorScheme ?? 'light']; // ?? 'light' pro případ, že by colorScheme byl null

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Oprávnění zamítnuto', 'Pro zobrazení polohy je potřeba povolit přístup k poloze.');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setCurrentLocation(location);
        // Volitelně: Nastavíme mapu na aktuální polohu při prvním načtení
        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005, // Menší delta pro detailnější pohled na aktuální polohu
          longitudeDelta: 0.005,
        });
      } catch (error) {
        Alert.alert('Chyba polohy', 'Nepodařilo se získat aktuální polohu.');
        console.error("Error getting location: ", error);
      }
    })();
  }, []);

  // Nový useEffect pro kontrolu pozice hráče vůči herní oblasti a herním místům
  useEffect(() => {
    if (currentLocation) {
      const playerPosition = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };

      // Kontrola opuštění hlavní herní oblasti
      const isInsideGameArea = isPointInPolygon(playerPosition, gameAreaCoordinates);
      if (!isInsideGameArea) {
        if (!alertShownForOutOfArea) {
          Alert.alert(
            "Mimo herní oblast",
            "Nacházíte se mimo vymezenou herní oblast. Vraťte se prosím zpět, abyste mohl/a pokračovat ve hře."
          );
          setAlertShownForOutOfArea(true);
        }
        return;
      } else {
        // Resetovat příznak, pokud se hráč vrátil do oblasti
        if (alertShownForOutOfArea) {
          setAlertShownForOutOfArea(false);
        }
      }

      // Kontrola přiblížení k herním místům
      for (const location of gameLocations) {
        // Přeskočit již aktivovaná místa
        if (activatedLocations.includes(location.id)) {
          continue;
        }

        const distance = getDistance(
          playerPosition.latitude,
          playerPosition.longitude,
          location.latitude,
          location.longitude
        );

        if (distance < ACTIVATION_DISTANCE) {
          // Místo je v dosahu a ještě nebylo aktivováno
          Alert.prompt(
            location.title, // Titulek alertu
            location.task,  // Text úkolu jako zpráva v alertu
            [
              {
                text: 'Zrušit',
                onPress: () => console.log('Zadávání odpovědi zrušeno.'),
                style: 'cancel',
              },
              {
                text: 'Odeslat',
                onPress: (inputText) => {
                  if (inputText && inputText.trim().toLowerCase() === location.answer.toLowerCase()) {
                    Alert.alert('Správně!', `Úkol "${location.title}" byl úspěšně splněn.`);
                    setActivatedLocations((prevActivated) => [...prevActivated, location.id]);
                  } else {
                    Alert.alert('Nesprávně', 'Vaše odpověď není správná. Zkuste to prosím znovu.');
                  }
                },
              },
            ],
            'plain-text', // Typ vstupu
            undefined, // Placeholder pro defaultValue
            undefined // Placeholder pro keyboardType
            // Zde by se mohl přidat vlastní styl pro Alert.prompt, pokud by to API podporovalo
            // nebo bychom museli implementovat vlastní modální dialog.
          );
          // Aby se předešlo opakovanému zobrazování promptu, pokud uživatel zůstane v dosahu
          // a ještě neodpoví, můžeme dočasně označit místo jako "dotázané".
          // Jelikož Alert.prompt je modální, měl by blokovat další vykonávání této smyčky
          // pro toto místo, dokud není zamítnut.
          // Pokud uživatel zruší, prompt se znovu objeví při další aktualizaci polohy,
          // pokud je stále v dosahu. To je prozatím přijatelné chování.
          // Můžeme zvážit přidání dočasného stavu, pokud by se alerty spamovaly i přes modalitu.
          // Prozatím spoléháme na to, že uživatel buď odpoví, nebo zruší,
          // a `activatedLocations` zabrání opakování pro již splněné úkoly.
        }
      }
    }
  }, [currentLocation, activatedLocations, alertShownForOutOfArea]); // Přidány závislosti

  return (
    <View style={[styles.container, { backgroundColor: themeColors.background }]}>
      <MapView
        style={styles.map}
        region={initialRegion}
        showsUserLocation={true} // Zobrazí výchozí modrou tečku pro polohu uživatele, můžeme ji nechat, nebo skrýt a použít vlastní Marker
      // userInterfaceStyle={colorScheme === 'dark' ? 'dark' : 'light'} // Pro Google Maps, OSM toto nepodporuje přímo
      >
        <UrlTile
          urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
        <Polygon
          coordinates={gameAreaCoordinates}
          strokeColor={themeColors.tint} // Použijeme tint barvu pro ohraničení
          fillColor={`${themeColors.tint}33`} // Tint barva s nízkou alpha pro výplň (33 je cca 20% opacity v hex)
          strokeWidth={2}
        />
        <Polygon
          coordinates={jungmannovySadyParkCoordinates}
          strokeColor="rgba(0, 180, 0, 0.7)" // Zelená pro Jungmannovy sady
          fillColor="rgba(0, 180, 0, 0.2)"   // Lehce zelená výplň
          strokeWidth={2}
        />
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.coords.latitude,
              longitude: currentLocation.coords.longitude,
            }}
            title="Moje poloha"
            pinColor={themeColors.tint} // Použijeme tint barvu pro značku aktuální polohy
          />
        )}
        {gameLocations.map((location) => (
          <Marker
            key={location.id}
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title={location.title}
            pinColor={activatedLocations.includes(location.id) ? "gold" : "green"} // Zelená pro aktivní, zlatá pro splněné
          >
            <Callout tooltip style={styles.calloutContainer}>
              <View style={[styles.calloutView, { backgroundColor: themeColors.background, borderColor: themeColors.icon }]}>
                <Text style={[styles.calloutTitle, { color: themeColors.text }]}>{location.title}</Text>
                <Text style={[styles.calloutDescription, { color: themeColors.text }]}>{location.task}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  calloutContainer: { // Přidán kontejner pro Callout, aby stín fungoval lépe (volitelné)
    borderRadius: 8,
    elevation: 5, // Stín pro Android
    shadowColor: '#000', // Stín pro iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  calloutView: {
    padding: 15, // Zvětšený padding
    borderRadius: 8, // Zaoblenější rohy
    borderWidth: 1, // Mírně silnější ohraničení
    width: 280, // Mírně širší bublina
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 18, // Větší písmo titulku
    marginBottom: 8, // Větší mezera pod titulkem
  },
  calloutDescription: {
    fontSize: 15, // Větší písmo popisu
  },
});
