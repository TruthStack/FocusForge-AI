import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store/useStore';

interface CardProps extends ViewProps {
    bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({
    bordered = false,
    style,
    children,
    ...props
}) => {
    const darkMode = useStore((state) => state.darkMode);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    const cardStyle = {
        backgroundColor: themeColors.card,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        borderWidth: bordered ? 1 : 0,
        borderColor: themeColors.border,
    };

    return (
        <View style={[cardStyle, style]} {...props}>
            {children}
        </View>
    );
};
