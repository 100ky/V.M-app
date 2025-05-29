# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## Vývojový deník / Conversation Summary (May 29, 2025)

### TASK DESCRIPTION:
Cílem bylo primárně odladit varování "Warning: Text strings must be rendered within a <Text> component" v React Native aplikaci. Po vyřešení tohoto problému se úkol přesunul k vylepšením UI/UX, včetně úpravy hlavičky/loga, zajištění viditelnosti a správného stylu ovládacích prvků GPS simulace a zajištění, aby tyto prvky dodržovaly téma aplikace (zejména barva textu na tlačítkách).

### COMPLETED:
1.  **Styl modálního okna:** Opraven problém s bílým textem na bílém pozadí v titulku modálního okna v `app/(tabs)/index.tsx`.
2.  **Vyřešení varování "Text string..."**:
    *   Systematicky zjednodušen soubor `hooks/useLocationTracking.ts` a JSX v `app/(tabs)/index.tsx`.
    *   Identifikován a opraven nesprávný import pro `ThemedView` v `app/(tabs)/index.tsx` (byl `../../components/ThemedText`, změněno na `../../components/ThemedView`), což vyřešilo varování.
3.  **Obnovení plného JSX a logiky:**
    *   Obnoveno původní, nezjednodušené JSX v `app/(tabs)/index.tsx` (včetně `ParallaxScrollView`, `MapViewComponent`, modálního okna a ovládacích prvků simulace).
    *   Opraven import typu v `app/(tabs)/index.tsx` z `LocationData` na `GameLocation`.
    *   Přidána prop `onMarkerPress` do `MapViewComponent.tsx` a implementován její handler v `app/(tabs)/index.tsx` pro zobrazení detailů lokace v modálním okně.
4.  **Úpravy UI - Hlavička/Logo:**
    *   Velké logo v hlavičce v `app/(tabs)/index.tsx` bylo odstraněno.
    *   Prop `headerImage` komponenty `ParallaxScrollView` v `app/(tabs)/index.tsx` byla nastavena na prázdný `<View />`.
    *   Konstanta `HEADER_HEIGHT` v `components/ParallaxScrollView.tsx` byla nastavena na `0`.
5.  **Úpravy UI - Ovládací prvky simulace v `app/(tabs)/index.tsx`:**
    *   Přidáno přepínací tlačítko ("Zobrazit/Skrýt ovládání simulace") pro zobrazení/skrytí ovládacích prvků simulace.
    *   Přidán rámeček kontejneru `simulationContainer` pro lepší vizuální oddělení.
    *   Nahrazeny komponenty `Button` v `renderSimulationControls` za `TouchableOpacity` a `ThemedText`, aby barva textu tlačítek respektovala aktuální téma.
    *   Opravena barva textu na tlačítkách "Skrýt/Zobrazit ovládání simulace" použitím `TouchableOpacity` a `ThemedText` s explicitním nastavením `lightColor` a `darkColor`.
6.  **Funkčnost `AsyncStorage` a aktivace lokací:**
    *   Přidána funkce `calculateDistance` pro výpočet vzdálenosti mezi GPS souřadnicemi.
    *   Implementována logika v `app/(tabs)/index.tsx` pro automatickou aktivaci lokací, pokud se uživatel nachází v `ACTIVATION_RADIUS_METERS` (50m).
    *   Přidány `console.log` výpisy pro sledování načítání a ukládání `activatedLocations` do/z `AsyncStorage`.
    *   Upraven `useEffect` pro ukládání do `AsyncStorage` tak, aby ukládal při každé změně `activatedLocations` (po úvodním načtení).
    *   Opravena chybějící závislost `activatedLocations` v `useEffect` hooku pro aktivaci lokací.
7.  **Přepínání mapy na celou obrazovku:**
    *   Do `app/(tabs)/index.tsx` přidán stav `isMapFullscreen`.
    *   Přidáno tlačítko "Celá mapa" pro aktivaci celoobrazovkového režimu.
    *   Přidáno tlačítko "Zpět do menu" v celoobrazovkovém režimu pro návrat.
    *   Implementováno podmíněné vykreslování pro zobrazení mapy na celou obrazovku nebo standardního layoutu.
8.  **Oprava barev značek na mapě:** Vyřešen problém, kdy se vizuálně neaktualizovala barva (`pinColor`) značek na mapě v `MapViewComponent.tsx` podle stavu `activatedLocations`. Oprava spočívala v úpravě `key` prop komponenty `Marker` tak, aby zahrnovala stav aktivace, což vynutilo překreslení.
9.  **Přidání možnosti resetování postupu:**
    *   Do `app/(tabs)/index.tsx` byla přidána funkce `handleResetProgress` pro vymazání `activatedLocations` z `AsyncStorage` a stavu komponenty.
    *   Do ovládacích prvků simulace bylo přidáno tlačítko "Resetovat postup".
10. **Perzistence postupu:** Ověřeno, že `AsyncStorage` správně ukládá a načítá `activatedLocations` i po restartu aplikace.
11. **Definice a centralizace barevné palety `adventureColors`**:
    *   Nová barevná paleta `adventureColors` byla definována v `app/style-showcase.tsx` pro světlý a tmavý režim s cílem vytvořit "dobrodružný" vzhled.
    *   Paleta `adventureColors` byla následně přesunuta do souboru `/workspaces/V.M-app/constants/Colors.ts` a exportována pro globální použití v aplikaci.
    *   Soubory `app/style-showcase.tsx` a `app/logo.tsx` byly aktualizovány, aby importovaly a používaly tuto sdílenou paletu.
12. **Implementace nových obrazovek UI toku**:
    *   `app/loading.tsx`: Vytvořena základní načítací obrazovka, která se zobrazí na 2 sekundy a poté přesměruje na `/logo`.
    *   `app/logo.tsx`: Vytvořena obrazovka pro zobrazení loga. Automaticky přesměrovává na `/adventure-selection` po 3 sekundách nebo po klepnutí. Byla připravena pro zobrazení obrázku loga z `assets/images/logo.png` a používá `adventureColors`. Uživatel nahrál soubor `logo.png` do `assets/images/`.
    *   `app/adventure-selection.tsx`: Vytvořena základní obrazovka pro výběr dobrodružství. Navigace pro "Prozkoumávání Vysokého Mýta" směřuje na `/(tabs)`.
13. **Nastavení navigace**:
    *   Soubor `app/_layout.tsx` byl upraven tak, aby `loading` byla počáteční obrazovka.
    *   Do navigačního zásobníku byly přidány obrazovky `logo`, `adventure-selection` a `style-showcase`.
    *   Obsah `app/_layout.tsx` byl obalen komponentou `GestureHandlerRootView` pro opravu chyby s `NativeViewGestureHandler`.
14. **Příprava pro stylování (`app/style-showcase.tsx`)**:
    *   Vytvořena obrazovka `app/style-showcase.tsx` pro experimentování s UI styly a komponentami.
    *   Do `app/(tabs)/index.tsx` bylo přidáno tlačítko pro navigaci na `style-showcase`.

### PENDING:
1.  **Důkladné testování aplikace:**
    *   Otestovat veškerou herní logiku, interakce s mapou (všechny značky, callouty) a zobrazení modálních oken pro každou herní lokaci (✔️ Dokončeno).
    *   Otestovat funkčnost GPS simulace (pohyb mockované polohy, aktivace lokací) (✔️ Dokončeno, testování s reálným GPS odloženo).
    *   Pokud je to možné, otestovat s reálným GPS nastavením `USE_MOCK_LOCATION = false` v `hooks/useLocationTracking.ts` (aktuálně odloženo z důvodu nemožnosti testování).
2.  **JavaScript Debugger UI & Web Debugging:** Potvrdit přístup a funkčnost stávajícího debuggeru (omezeno v Expo Go; spuštění na Android emulátoru z Codespaces pomocí "open Android" selhalo kvůli chybějícímu Android SDK). Zvážit kroky pro zprovoznění pokročilejšího webového debuggování (např. s `expo-dev-client`), protože aktuální debuggování přes Expo Go na telefonu neposkytuje plné vývojářské nástroje (✔️ Probrány alternativy jako `expo-dev-client` a samostatné tunelování).
3.  **Výchozí poloha mapy:** Zajistit, aby se mapa při spuštění defaultně centrovala na Vysoké Mýto, pokud není dostupná reálná GPS nebo je aktivní simulace na jiném místě (✔️ Dokončeno).
4.  **Aktualizace `README.md`:** Udržovat `README.md` aktuální s postupem projektu (✔️ Tento bod je průběžně plněn).
5.  **Audio Issue (Odloženo)**: Prozkoumat, proč spuštění aplikace pozastaví přehrávání hudby na pozadí v telefonu.
    *   Možná příčina: Výchozí chování Expo Go.
    *   Možná příčina: Interakce `react-native-maps` s audio systémem.
    *   Test: Zakomentovat `MapViewComponent` a ověřit chování (✔️ Provedeno - problém je v `MapViewComponent`).
    *   **Řešení (odloženo):** Otestovat chování v development buildu (`expo-dev-client`), protože problém se zde nemusí vyskytovat.
    *   **Další kroky prošetřování (pokud problém přetrvává i po testu v dev buildu nebo pokud je test odložen):**
        *   Postupné zjednodušování `MapViewComponent.tsx` (zakomentovávání `<UrlTile>`, `<Polygon>`, markerů atd.) pro identifikaci konkrétní problémové části.
        *   Prohledání issue trackeru `react-native-maps` pro podobné problémy a řešení.
        *   Detailní revize `MapView` props v dokumentaci.
    *   Test (budoucí): Ověřit chování v development buildu.
6.  **Problém se zobrazením loga na `app/logo.tsx`**:
    *   Nahrané logo (`assets/images/logo.png`) se na obrazovce `app/logo.tsx` aktuálně nezobrazuje, přestože soubor existuje.
    *   Probíhá diagnostika problému:
        *   Byl restartován Expo development server s vyčištěním cache (`npx expo start -c`).
        *   Doporučeno ověřit konzoli pro chybové zprávy (včetně možného výstupu z `onError` v `Image` komponentě v `app/logo.tsx`).
        *   Navrženo otestovat zobrazení jiného, standardního obrázku (např. `assets/images/icon.png`) v `app/logo.tsx` pro izolaci problému (zda je chyba v souboru loga, cestě, nebo v `Image` komponentě/stylech).
7.  **Aplikace vizuálního stylu `adventureColors`**:
    *   Aplikovat definovanou paletu `adventureColors` a související styly na obrazovky `loading.tsx` a `adventure-selection.tsx`.
    *   Následně konzistentně aplikovat styl napříč celou aplikací, včetně existujících herních obrazovek.
8.  **UI Refinement a komponenty**:
    *   Pokračovat ve vylepšování a definování UI prvků (tlačítka, karty, typografie) v `app/style-showcase.tsx`.
    *   Implementovat tyto finální styly a komponenty napříč aplikací.

### CODE_STATE (relevantní soubory):
*   `/workspaces/V.M-app/app/(tabs)/index.tsx`: Hlavní obrazovka aplikace, výrazně upravena pro UI a logiku.
*   `/workspaces/V.M-app/hooks/useLocationTracking.ts`: Logika pro sledování polohy (aktuálně používá mockovaná data).
*   `/workspaces/V.M-app/components/MapViewComponent.tsx`: Zobrazuje mapu a markery; přidána prop `onMarkerPress`.
*   `/workspaces/V.M-app/components/ParallaxScrollView.tsx`: Použito pro layout; `HEADER_HEIGHT` upravena na `0`.
*   `/workspaces/V.M-app/constants/GameData.ts`: Poskytuje typ `GameLocation` a data `gameLocations`.
*   `/workspaces/V.M-app/constants/Colors.ts`: Definuje barevná schémata, nyní včetně `adventureColors`.
*   `/workspaces/V.M-app/app/loading.tsx`: Nová načítací obrazovka.
*   `/workspaces/V.M-app/app/logo.tsx`: Nová obrazovka pro logo, probíhá řešení problému se zobrazením.
*   `/workspaces/V.M-app/app/adventure-selection.tsx`: Nová obrazovka pro výběr dobrodružství.
*   `/workspaces/V.M-app/app/style-showcase.tsx`: Obrazovka pro návrh a testování UI stylů.
*   `/workspaces/V.M-app/app/_layout.tsx`: Hlavní layout a konfigurace navigace.
