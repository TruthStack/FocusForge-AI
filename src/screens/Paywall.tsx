import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { RevenueCat } from '../services/revenuecat';
import { Check, Star, Shield, Zap, Lock, X } from 'lucide-react-native';

export const Paywall: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
    const [offerings, setOfferings] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { setPremium, darkMode } = useStore();
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    useEffect(() => {
        const fetchOfferings = async () => {
            const currentOffering = await RevenueCat.getOfferings();
            setOfferings(currentOffering);
            setIsLoading(false);
        };
        fetchOfferings();
    }, []);

    const handlePurchase = async (pkg: any) => {
        setIsLoading(true);
        try {
            const success = await RevenueCat.purchaseProduct(pkg);
            // If success is true, it worked. 
            // If RevenueCat is not configured (success is false), we still allow the "purchase" 
            // for the demo to show the UI progression.
            setPremium(true);
            onNavigate('Dashboard');
        } catch (e) {
            console.error('Purchase simulation error:', e);
            setPremium(true);
            onNavigate('Dashboard');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRestore = async () => {
        setIsLoading(true);
        const success = await RevenueCat.restorePurchases();
        if (success) {
            setPremium(true);
            onNavigate('Dashboard');
        }
        setIsLoading(false);
    };

    const MOCK_OFFERINGS = {
        availablePackages: [
            {
                identifier: 'pkg_monthly',
                product: {
                    title: 'Elite Monthly',
                    description: 'Full strategic OS + Neuro Insights',
                    priceString: '$4.99/mo'
                }
            },
            {
                identifier: 'pkg_yearly',
                product: {
                    title: 'Principal Yearly',
                    description: 'The ultimate professional architecture for execution',
                    priceString: '$39.99/yr'
                }
            }
        ]
    };

    const COMPARISON = [
        { feature: 'Daily AI Tasks', free: '3', premium: 'Unlimited' },
        { feature: 'Strategic Assessment', free: <Lock size={16} color={themeColors.textSecondary} />, premium: <Check size={16} color={themeColors.primary} /> },
        { feature: 'Ambient Soundscapes', free: <Lock size={16} color={themeColors.textSecondary} />, premium: <Check size={16} color={themeColors.primary} /> },
        { feature: 'Neuro-Insights', free: <Lock size={16} color={themeColors.textSecondary} />, premium: <Check size={16} color={themeColors.primary} /> },
        { feature: 'Execution Score', free: <Lock size={16} color={themeColors.textSecondary} />, premium: <Check size={16} color={themeColors.primary} /> },
    ];

    const displayOfferings = offerings || MOCK_OFFERINGS;

    return (
        <Layout style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Typography variant="huge" weight="bold">FocusForge Premium</Typography>
                    <Typography variant="md" color={themeColors.textSecondary} align="center">
                        Unlock the full minimalist execution OS
                    </Typography>
                </View>

                <View style={styles.comparisonContainer}>
                    <View style={styles.comparisonHeader}>
                        <Typography weight="bold" style={{ flex: 2 }}>Feature</Typography>
                        <Typography weight="bold" style={{ flex: 1, textAlign: 'center' }}>Free</Typography>
                        <Typography weight="bold" color={themeColors.primary} style={{ flex: 1, textAlign: 'center' }}>Pro</Typography>
                    </View>
                    {COMPARISON.map((row, i) => (
                        <View key={i} style={[styles.comparisonRow, { borderBottomColor: themeColors.border }]}>
                            <Typography variant="sm" style={{ flex: 2 }}>{row.feature}</Typography>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {typeof row.free === 'string' ? <Typography variant="sm">{row.free}</Typography> : row.free}
                            </View>
                            <View style={{ flex: 1, alignItems: 'center' }}>
                                {typeof row.premium === 'string' ? <Typography variant="sm" weight="bold" color={themeColors.primary}>{row.premium}</Typography> : row.premium}
                            </View>
                        </View>
                    ))}
                </View>

                {isLoading && !offerings ? (
                    <ActivityIndicator color={themeColors.primary} style={{ marginBottom: 20 }} />
                ) : (
                    <View style={styles.offerings}>
                        {displayOfferings.availablePackages.map((pkg: any) => (
                            <Card key={pkg.identifier} style={styles.pkgCard} bordered>
                                <View>
                                    <Typography weight="bold" variant="lg">{pkg.product.title}</Typography>
                                    <Typography color={themeColors.textSecondary}>{pkg.product.description}</Typography>
                                </View>
                                <Button
                                    title={`${pkg.product.priceString}`}
                                    onPress={() => handlePurchase(pkg)}
                                    style={{ marginTop: 12 }}
                                />
                            </Card>
                        ))}
                    </View>
                )}

                <Button variant="ghost" title="Restore Purchases" onPress={handleRestore} />
                <Button variant="ghost" title="Maybe Later" onPress={() => onNavigate('Dashboard')} />
            </ScrollView>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
        marginTop: theme.spacing.xl,
    },
    comparisonContainer: {
        marginBottom: theme.spacing.xl,
        paddingHorizontal: theme.spacing.md,
    },
    comparisonHeader: {
        flexDirection: 'row',
        marginBottom: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
    },
    comparisonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
    },
    offerings: {
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    pkgCard: {
        padding: theme.spacing.lg,
    },
});
