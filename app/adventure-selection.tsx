import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { router } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';

// Need to import Platform and StatusBar for paddingTop adjustment
import { Platform, StatusBar } from 'react-native';

// Placeholder data for adventures
const adventures = [
    { id: 'vysoke_myto', title: 'Prozkoumávání Vysokého Mýta', route: '/(tabs)' }, // Changed route to navigate to the tab layout
    // Future adventures can be added here
    // { id: 'escape_room_1', title: 'Úniková hra: Tajemná laboratoř', route: '/adventure/lab' },
];

export default function AdventureSelectionScreen() {
    const colorScheme = useColorScheme() ?? 'light';
    const themeColors = Colors[colorScheme];

    const renderAdventure = ({ item }: { item: typeof adventures[0] }) => (
        <TouchableOpacity
            style={[styles.adventureButton, { backgroundColor: themeColors.tint }]}
            onPress={() => router.push(item.route as any)} // Using 'as any' for route type temporarily
        >
            <ThemedText style={[styles.adventureButtonText, { color: themeColors.background }]}>
                {item.title}
            </ThemedText>
        </TouchableOpacity>
    );

    return (
        <ThemedView style={styles.container}>
            <ThemedText type="title" style={styles.title}>Vyber si dobrodružství</ThemedText>
            <FlatList
                data={adventures}
                renderItem={renderAdventure}
                keyExtractor={item => item.id}
                style={styles.list}
                contentContainerStyle={styles.listContentContainer}
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 30 : 50, // Adjust for status bar
        paddingBottom: 20,
        paddingHorizontal: 20,
        alignItems: 'center', // Center the FlatList horizontally
    },
    title: {
        textAlign: 'center',
        marginBottom: 30,
        // marginTop: 40, // Removed to use paddingTop on container
    },
    list: {
        width: '100%',
        maxWidth: 500, // Max width for larger screens or web
    },
    listContentContainer: {
        // No specific styles needed here for now, but useful for future adjustments
    },
    adventureButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginBottom: 15,
        alignItems: 'center',
    },
    adventureButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
