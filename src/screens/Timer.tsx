import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore, DailyTask } from '../store/useStore';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { Volume2, VolumeX, Music, Lock } from 'lucide-react-native';

export const Timer: React.FC<{ route: { params: { task: DailyTask } }, onNavigate: (screen: string, params?: any) => void }> = ({ route, onNavigate }) => {
    const { task } = route.params;
    const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
    const [isActive, setIsActive] = useState(false);
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | null>(null);

    const progress = useRef(new Animated.Value(0)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const { darkMode, isPremium } = useStore();
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    useEffect(() => {
        return () => {
            if (sound) {
                sound.unloadAsync();
            }
        };
    }, [sound]);

    const toggleSound = async () => {
        if (!isPremium) {
            onNavigate('Paywall');
            return;
        }

        if (isSoundEnabled) {
            if (sound) await sound.stopAsync();
            setIsSoundEnabled(false);
        } else {
            setIsSoundEnabled(true);
            if (!sound) {
                const { sound: newSound } = await Audio.Sound.createAsync(
                    { uri: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3' }, // Placeholder for Lo-fi
                    { shouldPlay: true, isLooping: true, volume: 0.3 }
                );
                setSound(newSound);
            } else {
                await sound.playAsync();
            }
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            handleComplete();
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
            if (sound) sound.pauseAsync();
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (isActive && isSoundEnabled && sound) {
            sound.playAsync();
        }
    }, [isActive, isSoundEnabled, sound]);

    useEffect(() => {
        Animated.timing(progress, {
            toValue: 1 - timeLeft / (25 * 60),
            duration: 1000,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start();
    }, [timeLeft]);

    const handleToggle = () => {
        setIsActive(!isActive);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    };

    const handleComplete = () => {
        setIsActive(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onNavigate('Reflection', { task });
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const barWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
    });

    return (
        <Layout style={styles.container}>
            <View style={styles.header}>
                <Typography variant="huge" weight="bold">Sprint</Typography>
                <Typography variant="md" color={themeColors.textSecondary}>{task.title}</Typography>
            </View>

            <View style={styles.timerContainer}>
                <Typography variant="huge" style={styles.timerText}>
                    {formatTime(timeLeft)}
                </Typography>
                <View style={[styles.progressBarContainer, { backgroundColor: themeColors.card }]}>
                    <Animated.View style={[styles.progressBar, { width: barWidth, backgroundColor: themeColors.primary }]} />
                </View>

                <TouchableOpacity
                    onPress={toggleSound}
                    style={[
                        styles.soundToggle,
                        {
                            backgroundColor: isSoundEnabled ? themeColors.primary + '20' : '#2A2A2A', // Using more visible grey
                            borderColor: isSoundEnabled ? themeColors.primary : '#333',
                            borderWidth: 1
                        }
                    ]}
                >
                    {isSoundEnabled ? <Music color={themeColors.primary} size={18} /> : <VolumeX color={themeColors.textSecondary} size={18} />}
                    <Typography
                        variant="xs"
                        weight="bold"
                        style={{ marginLeft: 8 }}
                        color={isSoundEnabled ? themeColors.primary : themeColors.textSecondary}
                    >
                        AMBIENT FLOW
                    </Typography>
                    {!isPremium && <Lock size={12} color={themeColors.textSecondary} style={{ marginLeft: 6 }} />}
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Button
                    title={isActive ? 'Pause' : 'Start Execution'}
                    onPress={handleToggle}
                    style={styles.mainBtn}
                />
                <Button
                    variant="ghost"
                    title="Quit Sprint"
                    onPress={() => onNavigate('Dashboard')}
                />
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.xxl,
    },
    header: {
        alignItems: 'center',
        marginTop: theme.spacing.xxl,
    },
    timerContainer: {
        alignItems: 'center',
        width: '100%',
    },
    timerText: {
        fontSize: 80,
        lineHeight: 90,
        marginBottom: theme.spacing.xl,
        fontVariant: ['tabular-nums'],
    },
    progressBarContainer: {
        height: 8,
        width: '80%',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
    },
    footer: {
        gap: theme.spacing.md,
    },
    mainBtn: {
        height: 60,
    },
    soundToggle: {
        marginTop: theme.spacing.xl,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
});
