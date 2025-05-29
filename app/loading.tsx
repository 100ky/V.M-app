import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';

export default function LoadingScreen() {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/logo');
        }, 2000); // Navigate after 2 seconds

        return () => clearTimeout(timer); // Cleanup the timer
    }, [router]);

    return (
        <ThemedView style={styles.container}>
            <ActivityIndicator size="large" />
            <ThemedText style={styles.text}>Načítání...</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: 16,
        fontSize: 18,
    },
});
