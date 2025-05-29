import { adventureColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native';

export default function LogoScreen() {
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const currentColors = adventureColors[colorScheme];

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace('/adventure-selection');
        }, 3000); // 3 sekundy

        return () => clearTimeout(timer);
    }, [router]);

    const handlePress = () => {
        router.replace('/adventure-selection');
    };

    return (
        <View style={[styles.container, { backgroundColor: currentColors.background }]}>
            <TouchableOpacity onPress={handlePress} style={styles.touchableArea}>
                <Image
                    source={require('@/assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                    onError={(e) => console.log('Chyba načítání loga:', e.nativeEvent.error)} // Logování chyby, pokud obrázek nelze načíst
                />
                <Text style={[styles.skipText, { color: currentColors.subtleText }]}>
                    Klepnutím přeskočíte
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    touchableArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logo: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    skipText: {
        fontSize: 14,
        marginTop: 10,
    },
});
