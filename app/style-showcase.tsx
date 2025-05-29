import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Button, ScrollView, StyleSheet, View, useColorScheme } from 'react-native';

// Need to import TouchableOpacity for buttons
import { adventureColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Define adventurous color palette (examples)
// const adventureColors = { ... }; // Odstraněno nebo zakomentováno

export default function StyleShowcaseScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    // const currentColors = Colors[colorScheme]; // Zakomentováno nebo odstraněno
    const currentAdventureColors = adventureColors[colorScheme];

    const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
        <View style={styles.section}>
            <ThemedText
                type="subtitle"
                style={[
                    styles.sectionTitle,
                    { borderBottomColor: currentAdventureColors.subtleText } // Dynamically set border color
                ]}
            >
                {title}
            </ThemedText>
            {children}
        </View>
    );

    const ColorSample: React.FC<{ name: string; color: string; textColor?: string }> = ({ name, color, textColor }) => (
        <View style={[styles.colorSample, { backgroundColor: color, borderColor: textColor ? 'transparent' : currentAdventureColors.border /* Použití border pro lepší kontrast, pokud není textColor */ }]}>
            <ThemedText style={[styles.colorName, { color: textColor ?? currentAdventureColors.text }]}>{name}</ThemedText>
        </View>
    );

    return (
        <ThemedView
            style={styles.outerContainer}
            lightColor={adventureColors.light.background} // Use adventure background
            darkColor={adventureColors.dark.background}   // Use adventure background
        >
            <ScrollView contentContainerStyle={styles.container}>
                <ThemedText type="title" style={styles.pageTitle}>Návrhy stylů pro aplikaci</ThemedText>

                <Section title="Paleta barev 'Dobrodružství'">
                    <ThemedText style={styles.introText}>
                        Moderní a dobrodružný vizuální styl. Světlé téma optimalizované pro čitelnost venku, s volitelným tmavým režimem.
                    </ThemedText>
                    <View style={styles.colorPalette}>
                        <ColorSample name="Pozadí (Světlá)" color={adventureColors.light.background} textColor={adventureColors.light.text} />
                        <ColorSample name="Text (Světlá)" color={adventureColors.light.text} textColor={adventureColors.light.background} />
                        <ColorSample name="Jemný Text (Světlá)" color={adventureColors.light.subtleText} textColor={adventureColors.light.background} />
                        <ColorSample name="Primární (Světlá)" color={adventureColors.light.primary} textColor={adventureColors.light.background} />
                        <ColorSample name="Sekundární (Světlá)" color={adventureColors.light.secondary} textColor={adventureColors.light.background} />
                        <ColorSample name="Akcent (Světlá)" color={adventureColors.light.accent} textColor={adventureColors.light.background} />
                    </View>
                    <View style={styles.colorPalette}>
                        <ColorSample name="Pozadí (Tmavá)" color={adventureColors.dark.background} textColor={adventureColors.dark.text} />
                        <ColorSample name="Text (Tmavá)" color={adventureColors.dark.text} textColor={adventureColors.dark.background} />
                        <ColorSample name="Jemný Text (Tmavá)" color={adventureColors.dark.subtleText} textColor={adventureColors.dark.background} />
                        <ColorSample name="Primární (Tmavá)" color={adventureColors.dark.primary} textColor={adventureColors.dark.background} />
                        <ColorSample name="Sekundární (Tmavá)" color={adventureColors.dark.secondary} textColor={adventureColors.dark.background} />
                        <ColorSample name="Akcent (Tmavá)" color={adventureColors.dark.accent} textColor={adventureColors.dark.background} />
                    </View>
                </Section>

                <Section title="Typografie">
                    <ThemedText type="default">Výchozí text (Default) - Pro běžný obsah.</ThemedText>
                    <ThemedText type="title">Nadpis (Title) - Pro názvy obrazovek.</ThemedText>
                    <ThemedText type="defaultSemiBold">Polotučný text (DefaultSemiBold) - Pro zvýraznění.</ThemedText>
                    <ThemedText type="subtitle">Podnadpis (Subtitle) - Pro názvy sekcí.</ThemedText>
                    <ThemedText type="link">Odkaz (Link) - Pro klikatelné texty.</ThemedText>
                    <View style={styles.typographySample}>
                        <ThemedText style={{ fontFamily: 'SpaceMono', color: currentAdventureColors.text }}>
                            Písmo &apos;SpaceMono&apos; pro speciální text.
                        </ThemedText>
                    </View>
                </Section>

                <Section title="UI Prvky 'Dobrodružství'">
                    <ThemedText style={styles.introText}>
                        Návrhy pro tlačítka, karty a další interaktivní prvky s dobrodružným nádechem.
                    </ThemedText>

                    {/* Adventure Button */}
                    <TouchableOpacity
                        style={[styles.adventureButton, { backgroundColor: currentAdventureColors.primary }]}
                        onPress={() => alert('Dobrodružné tlačítko stisknuto!')}
                    >
                        <ThemedText style={[styles.adventureButtonText, { color: adventureColors.light.background /* Assuming light text on primary bg */ }]}>
                            Dobrodružné Tlačítko
                        </ThemedText>
                    </TouchableOpacity>

                    {/* Adventure Card */}
                    <View style={[styles.adventureCard, { backgroundColor: currentAdventureColors.card, borderColor: currentAdventureColors.border }]}>
                        <ThemedText type="subtitle" style={{ color: currentAdventureColors.text }}>Dobrodružná Karta</ThemedText>
                        <View style={[styles.separator, { backgroundColor: currentAdventureColors.border }]} />
                        <ThemedText style={{ color: currentAdventureColors.text }}>
                            Obsah karty s mapovou texturou nebo kompasem jako ikonou.
                        </ThemedText>
                        <ThemedText style={{ color: currentAdventureColors.subtleText, marginTop: 5 }}>
                            Jemnější text pro detaily.
                        </ThemedText>
                    </View>
                    <View style={styles.iconShowcase}>
                        <Ionicons name="compass-outline" size={32} color={currentAdventureColors.accent} style={styles.iconStyle} />
                        <ThemedText style={{ color: currentAdventureColors.text }}>Kompas</ThemedText>
                        <Ionicons name="map-outline" size={32} color={currentAdventureColors.accent} style={styles.iconStyle} />
                        <ThemedText style={{ color: currentAdventureColors.text }}>Mapa</ThemedText>
                        <Ionicons name="footsteps-outline" size={32} color={currentAdventureColors.accent} style={styles.iconStyle} />
                        <ThemedText style={{ color: currentAdventureColors.text }}>Kroky</ThemedText>
                    </View>
                </Section>

                <Section title="Standardní UI Prvky (pro porovnání)">
                    <Button title="Standardní tlačítko" onPress={() => alert('Standardní tlačítko stisknuto!')} color={currentAdventureColors.primary} />
                    <View style={[styles.separator, { backgroundColor: currentAdventureColors.border }]} />
                    <ThemedText style={{ color: currentAdventureColors.text }}>Ukázka standardních prvků pro porovnání s novým stylem.</ThemedText>
                    <ExternalLink href="https://docs.expo.dev/ui-programming/showcase/">
                        <ThemedText type="link">Více o UI prvcích v Expo</ThemedText>
                    </ExternalLink>
                </Section>
            </ScrollView>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
        paddingBottom: 50, // Ensure scroll content is not hidden by nav bar or similar
    },
    pageTitle: {
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        marginBottom: 15,
        borderBottomWidth: 1,
        // borderBottomColor is now applied dynamically in the Section component's style prop
        paddingBottom: 5,
        // color will be inherited from ThemedText or can be set explicitly if needed
    },
    introText: {
        marginBottom: 15,
        fontSize: 16,
        lineHeight: 24,
    },
    colorPalette: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 10,
    },
    colorSample: {
        padding: 10,
        margin: 5,
        borderRadius: 5,
        alignItems: 'center',
        minWidth: 120, // Ensure samples are not too small
        borderWidth: 1, // Přidán okraj pro všechny vzorky barev
    },
    colorName: {
        fontSize: 12,
        marginTop: 5,
    },
    typographySample: {
        marginTop: 10,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc', // Fallback, ideally use themed border
        borderRadius: 5,
    },
    separator: {
        marginVertical: 20,
        height: 1,
        width: '80%',
        alignSelf: 'center',
    },
    adventureButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25, // More rounded for a modern/playful feel
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        marginBottom: 20,
    },
    adventureButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    adventureCard: {
        padding: 15,
        borderRadius: 10,
        borderWidth: 1,
        elevation: 2, // Android shadow
        shadowColor: '#000', // iOS shadow
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        marginBottom: 20,
    },
    iconShowcase: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginTop: 15,
        paddingVertical: 10,
    },
    iconStyle: {
        marginHorizontal: 10,
    }
});
