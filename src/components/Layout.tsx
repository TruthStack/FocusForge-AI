import React from 'react';
import { View, SafeAreaView, StyleSheet, StatusBar, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store/useStore';

interface LayoutProps {
    children: React.ReactNode;
    style?: ViewStyle;
    safeHeader?: boolean;
    safeFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
    children,
    style,
    safeHeader = true,
    safeFooter = true
}) => {
    const darkMode = useStore((state) => state.darkMode);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    const containerStyle: ViewStyle = {
        flex: 1,
        backgroundColor: themeColors.background,
        paddingHorizontal: theme.spacing.md,
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: themeColors.background }}>
            <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
            <View style={[containerStyle, style]}>
                {children}
            </View>
        </SafeAreaView>
    );
};
