import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { useStore } from '../store/useStore';

interface BoldTextProps extends TextProps {
    variant?: keyof typeof theme.typography.size;
    color?: string;
    align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
    weight?: keyof typeof theme.typography.weight;
    italic?: boolean;
}

export const Typography: React.FC<BoldTextProps> = ({
    variant = 'md',
    color,
    align = 'left',
    weight = 'regular',
    italic = false,
    style,
    children,
    ...props
}) => {
    const darkMode = useStore((state) => state.darkMode);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    const textStyle = {
        fontSize: theme.typography.size[variant],
        color: color || themeColors.text,
        textAlign: align,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.weight[weight],
        fontStyle: italic ? 'italic' : 'normal' as any,
        lineHeight: theme.typography.size[variant] * 1.4,
    };

    return (
        <Text style={[textStyle, style]} {...props}>
            {children}
        </Text>
    );
};
