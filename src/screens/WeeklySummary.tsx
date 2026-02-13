import React, { useState, useEffect } from 'react';
import * as Clipboard from 'expo-clipboard';
import { BlurView } from 'expo-blur';
import { Alert, StyleSheet, View, ScrollView } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore } from '../store/useStore';
import { AIService } from '../services/xai';
import { BarChart3, Clock, CheckCircle, ArrowLeft, Share2, Brain, Sparkles } from 'lucide-react-native';

export const WeeklySummary: React.FC<{ onNavigate: (screen: string) => void }> = ({ onNavigate }) => {
    const { streak, darkMode, sessionCount, executionScore, isPremium, creatorIdentity } = useStore();
    const [coachingInsight, setCoachingInsight] = useState<string | null>(null);
    const [isInsightLoading, setIsInsightLoading] = useState(false);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    useEffect(() => {
        const fetchInsight = async () => {
            if (isPremium) {
                setIsInsightLoading(true);
                const insight = await AIService.generateExecutiveCoaching({
                    sessions: sessionCount,
                    score: executionScore,
                    identity: creatorIdentity,
                    streak: streak
                });
                setCoachingInsight(insight);
                setIsInsightLoading(false);
            }
        };
        fetchInsight();
    }, [isPremium]);

    const stats = [
        { label: 'Total Sessions', value: `${sessionCount}`, icon: <BarChart3 size={24} color={themeColors.primary} /> },
        { label: 'Execution Score', value: `${executionScore}`, icon: <CheckCircle size={24} color={themeColors.primary} /> },
        { label: 'Completion Rate', value: sessionCount > 0 ? '100%' : '0%', icon: <Clock size={24} color={themeColors.primary} /> },
    ];

    const generateReport = async () => {
        const report = `FocusForge Report:\nThis week I completed ${sessionCount} deep work sessions with a ${executionScore} execution score.\nCurrent Streak: ${streak} days.\n#FocusForge #BuildInPublic`;
        await Clipboard.setStringAsync(report);
        Alert.alert('Report Copied', 'Share your progress on X or LinkedIn!');
    };

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
                <Typography variant="xl" weight="bold">Weekly Analytics</Typography>
                <Button
                    variant="ghost"
                    fullWidth={false}
                    onPress={generateReport}
                >
                    <Share2 color={themeColors.text} size={24} />
                </Button>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {/* Content Container - Blurred if not premium */}
                <View style={{ flex: 1, position: 'relative' }}>

                    <Card style={styles.mainCard}>
                        <Typography variant="lg" weight="bold" style={{ marginBottom: 16 }}>Execution Overview</Typography>
                        <View style={styles.statsGrid}>
                            {stats.map((stat, i) => (
                                <View key={i} style={styles.statItem}>
                                    {stat.icon}
                                    <Typography variant="xl" weight="bold" style={{ marginTop: 8 }}>{stat.value}</Typography>
                                    <Typography variant="xs" color={themeColors.textSecondary}>{stat.label}</Typography>
                                </View>
                            ))}
                        </View>
                    </Card>

                    {isPremium && (
                        <Card style={[styles.insightCard, { borderColor: themeColors.primary }]} bordered>
                            <View style={styles.insightHeader}>
                                <Brain color={themeColors.primary} size={20} />
                                <Typography weight="bold" style={{ marginLeft: 10 }}>Neuro-Insights</Typography>
                                <View style={[styles.proBadge, { backgroundColor: themeColors.primary }]}>
                                    <Sparkles color="#FFF" size={10} />
                                    <Typography variant="xs" color="#FFF" weight="bold" style={{ marginLeft: 4 }}>ELITE</Typography>
                                </View>
                            </View>
                            {isInsightLoading ? (
                                <View style={{ paddingVertical: 10 }}>
                                    <Typography variant="sm" color={themeColors.textSecondary}>Analyzing execution patterns...</Typography>
                                </View>
                            ) : (
                                <Typography variant="sm" italic style={{ marginTop: 10, lineHeight: 22 }}>
                                    {coachingInsight || "No insights available yet. Complete more sprints to unlock deep analysis."}
                                </Typography>
                            )}
                        </Card>
                    )}

                    <Card style={styles.streakSection}>
                        <Typography weight="bold">Current Momentum</Typography>
                        <Typography variant="huge" weight="bold" color={themeColors.primary}>{streak} Days</Typography>
                        <Typography variant="sm" color={themeColors.textSecondary}>You are in the top 5% of executioners this week.</Typography>
                    </Card>

                    <View style={styles.exportSection}>
                        <Button title="Copy Text Report" onPress={generateReport} />
                        <Typography variant="xs" color={themeColors.textSecondary} align="center" style={{ marginTop: 8 }}>
                            Share your wins. Build in public.
                        </Typography>
                    </View>

                    {!isPremium && (
                        <BlurView intensity={20} style={StyleSheet.absoluteFill} tint={darkMode ? 'dark' : 'light'}>
                            <View style={styles.blurOverlay}>
                                <Typography variant="xl" weight="bold" style={{ textAlign: 'center', marginBottom: 16 }}>
                                    Unlock Analytics
                                </Typography>
                                <Button
                                    title="Upgrade to Premium"
                                    onPress={() => onNavigate('Paywall')}
                                />
                            </View>
                        </BlurView>
                    )}
                </View>
            </ScrollView>
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
    content: {
        paddingBottom: theme.spacing.xxl,
    },
    mainCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    streakSection: {
        padding: theme.spacing.lg,
        alignItems: 'center',
        gap: 8,
        marginBottom: theme.spacing.xl,
    },
    exportSection: {
        marginTop: theme.spacing.md,
    },
    insightCard: {
        padding: theme.spacing.lg,
        marginBottom: theme.spacing.md,
        backgroundColor: 'rgba(110, 86, 255, 0.05)',
        borderStyle: 'dashed',
    },
    insightHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    proBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        marginLeft: 'auto',
    },
    blurOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
});
