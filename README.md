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

## Vývojový deník / Conversation Summary (May 28, 2025)

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

### PENDING:
1.  **Důkladné testování aplikace:**
    *   Ověřit, že `AsyncStorage` správně ukládá a načítá `activatedLocations` (probíhá).
    *   Otestovat funkčnost GPS simulace (pohyb mockované polohy).
    *   Pokud je to možné, otestovat s reálným GPS nastavením `USE_MOCK_LOCATION = false` v `hooks/useLocationTracking.ts`.
    *   Otestovat veškerou herní logiku, interakce s mapou a zobrazení modálních oken.
2.  **JavaScript Debugger UI:** Potvrdit přístup a funkčnost (starší nevyřízená položka).

### CODE_STATE (relevantní soubory):
*   `/workspaces/V.M-app/app/(tabs)/index.tsx`: Hlavní obrazovka aplikace, výrazně upravena pro UI a logiku.
*   `/workspaces/V.M-app/hooks/useLocationTracking.ts`: Logika pro sledování polohy (aktuálně používá mockovaná data).
*   `/workspaces/V.M-app/components/MapViewComponent.tsx`: Zobrazuje mapu a markery; přidána prop `onMarkerPress`.
*   `/workspaces/V.M-app/components/ParallaxScrollView.tsx`: Použito pro layout; `HEADER_HEIGHT` upravena na `0`.
*   `/workspaces/V.M-app/constants/GameData.ts`: Poskytuje typ `GameLocation` a data `gameLocations`.
*   `/workspaces/V.M-app/constants/Colors.ts`: Definuje barevná schémata pro světlý a tmavý režim.
