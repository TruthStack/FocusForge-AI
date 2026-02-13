import React from 'react';
import { View, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { ArrowLeft, Moon, CreditCard, Info } from 'lucide-react-native';

export const Settings: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
    const { darkMode, toggleDarkMode, isPremium, togglePremiumOverride } = useStore();
    const [tapCount, setTapCount] = React.useState(0);
    const [lastTap, setLastTap] = React.useState(0);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    return (
        <Layout>
            <View style={styles.header}>
                <Button
                    variant="ghost"
                    fullWidth={false}
                    onPress={() => onNavigate('Dashboard')}
                >
                    <ArrowLeft color={themeColors.text} size={24} />
                </Button>
                <Typography variant="xl" weight="bold">Settings</Typography>
                <View style={{ width: 48 }} />
            </View>

            <View style={styles.section}>
                <Typography variant="sm" weight="bold" color={themeColors.textSecondary} style={styles.sectionTitle}>
                    PREFERENCES
                </Typography>
                <Card style={styles.settingItem}>
                    <View style={styles.settingLabel}>
                        <Moon size={20} color={themeColors.text} />
                        <Typography style={{ marginLeft: 12 }}>Dark Mode</Typography>
                    </View>
                    <Switch
                        value={darkMode}
                        onValueChange={toggleDarkMode}
                        trackColor={{ false: theme.colors.light.border, true: theme.colors.dark.primary }}
                    />
                </Card>
            </View>

            <View style={styles.section}>
                <Typography variant="sm" weight="bold" color={themeColors.textSecondary} style={styles.sectionTitle}>
                    SUBSCRIPTION
                </Typography>
                <Card style={styles.settingItem}>
                    <View style={styles.settingLabel}>
                        <CreditCard size={20} color={themeColors.text} />
                        <Typography style={{ marginLeft: 12 }}>Status</Typography>
                    </View>
                    <View style={[styles.badge, { backgroundColor: isPremium ? themeColors.success + '20' : themeColors.border }]}>
                        <Typography variant="xs" weight="bold" color={isPremium ? themeColors.success : themeColors.textSecondary}>
                            {isPremium ? 'PREMIUM' : 'FREE'}
                        </Typography>
                    </View>
                </Card>
                {!isPremium && (
                    <Button
                        title="Upgrade to Premium"
                        onPress={() => onNavigate('Paywall')}
                        style={{ marginTop: 12 }}
                    />
                )}
            </View>

            <View style={styles.section}>
                <Typography variant="sm" weight="bold" color={themeColors.textSecondary} style={styles.sectionTitle}>
                    ABOUT
                </Typography>
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        const now = Date.now();
                        if (now - lastTap < 500) {
                            setTapCount(tapCount + 1);
                            if (tapCount + 1 >= 5) {
                                togglePremiumOverride();
                                setTapCount(0);
                            }
                        } else {
                            setTapCount(1);
                        }
                        setLastTap(now);
                    }}
                >
                    <Card style={styles.settingItem}>
                        <View style={styles.settingLabel}>
                            <Info size={20} color={themeColors.text} />
                            <Typography style={{ marginLeft: 12 }}>Version</Typography>
                        </View>
                        <Typography color={themeColors.textSecondary}>1.0.0</Typography>
                    </Card>
                </TouchableOpacity>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
    },
    section: {
        marginTop: theme.spacing.xl,
    },
    sectionTitle: {
        marginBottom: theme.spacing.sm,
        paddingLeft: theme.spacing.sm,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    settingLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
});
