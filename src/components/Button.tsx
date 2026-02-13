import React from 'react';
import { TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { Typography } from './Typography';
import * as Haptics from 'expo-haptics';

interface ButtonProps extends TouchableOpacityProps {
    title?: string;
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    variant = 'primary',
    size = 'md',
    fullWidth = true,
    children,
    style,
    onPress,
    ...props
}) => {
    const darkMode = useStore((state) => state.darkMode);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    const handlePress = (event: any) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(event);
    };

    const buttonStyle: ViewStyle = {
        backgroundColor: variant === 'primary' ? themeColors.primary : 'transparent',
        borderColor: variant === 'outline' ? themeColors.border : 'transparent',
        borderWidth: variant === 'outline' ? 1 : 0,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing[size],
        paddingHorizontal: theme.spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        width: fullWidth ? '100%' : 'auto',
        flexDirection: 'row',
    };

    const textColor = variant === 'primary'
        ? (darkMode ? theme.colors.light.primary : theme.colors.dark.primary)
        : themeColors.text;

    return (
        <TouchableOpacity
            style={[buttonStyle, style]}
            onPress={handlePress}
            activeOpacity={0.8}
            {...props}
        >
            {title && (
                <Typography
                    variant={size === 'lg' ? 'lg' : 'md'}
                    color={textColor}
                    weight="medium"
                >
                    {title}
                </Typography>
            )}
            {children}
        </TouchableOpacity>
    );
};
