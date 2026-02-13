import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, ActivityIndicator, Animated, TouchableOpacity } from 'react-native';
import { useRef } from 'react';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore, DailyTask } from '../store/useStore';
import { AIService } from '../services/xai';
import { Zap, Target, ArrowRight, Settings as SettingsIcon } from 'lucide-react-native';

export const Dashboard: React.FC<{ onNavigate: (screen: string, params?: any) => void }> = ({ onNavigate }) => {
    const {
        tasks,
        setTasks,
        streak,
        sessionCount,
        executionScore,
        creatorIdentity,
        isPremium,
        strategicAssessment,
        setStrategicAssessment,
        darkMode,
        loadState
    } = useStore();

    const [goalInput, setGoalInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        loadState();
    }, []);

    const handleGenerateTasks = async () => {
        if (!goalInput.trim()) return;

        setIsLoading(true);
        try {
            const response = await AIService.generateDailyTasks(goalInput, creatorIdentity);
            const newTasks: DailyTask[] = response.tasks.map((t, i) => ({
                id: `task-${Date.now()}-${i}`,
                title: t.title,
                description: t.description,
                completed: false,
                timeSpent: 0,
            }));
            setTasks(newTasks);
            if (response.strategicAssessment) {
                setStrategicAssessment(response.strategicAssessment);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    const streakAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        if (streak > 0) {
            Animated.sequence([
                Animated.timing(streakAnim, { toValue: 1.2, duration: 200, useNativeDriver: true }),
                Animated.spring(streakAnim, { toValue: 1, friction: 4, useNativeDriver: true })
            ]).start();
        }
    }, [streak]);

    const CircularProgress = ({ score }: { score: number }) => {
        const radius = 24;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (score / 100) * circumference;

        return (
            <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Typography variant="xs" weight="bold" style={{ position: 'absolute' }}>{score}%</Typography>
                {/* SVG implementation placeholder - will use Views if SVG fails, but let's try SVG */}
                <View style={{ transform: [{ rotate: '-90deg' }] }}>
                    {/* Simplified SVG simulation with Views for extreme stability, or actual SVG */}
                    <Card style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        borderWidth: 4,
                        borderColor: themeColors.border,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <View style={{
                            position: 'absolute',
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            borderWidth: 4,
                            borderColor: themeColors.primary,
                            borderTopColor: 'transparent',
                            borderRightColor: score > 25 ? themeColors.primary : 'transparent',
                            borderBottomColor: score > 50 ? themeColors.primary : 'transparent',
                            borderLeftColor: score > 75 ? themeColors.primary : 'transparent',
                        }} />
                    </Card>
                </View>
            </View>
        );
    };

    return (
        <Layout>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <Typography variant="huge" weight="bold">
                        {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'},
                    </Typography>
                    <Typography variant="md" weight="medium" color={themeColors.primary}>
                        {creatorIdentity}
                    </Typography>
                </View>
                <Button
                    variant="ghost"
                    fullWidth={false}
                    onPress={() => onNavigate('Settings')}
                >
                    <SettingsIcon color={themeColors.text} size={24} />
                </Button>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                <View style={styles.statsRow}>
                    <Animated.View style={{ flex: 1, transform: [{ scale: streakAnim }] }}>
                        <Card style={styles.statCard}>
                            <Zap color={themeColors.primary} size={20} />
                            <Typography variant="xl" weight="bold">{streak}</Typography>
                            <Typography variant="xs" color={themeColors.textSecondary}>Day Streak</Typography>
                        </Card>
                    </Animated.View>
                    <Card style={styles.statCard}>
                        <CircularProgress score={executionScore} />
                        <Typography variant="xs" color={themeColors.textSecondary}>Execution Score</Typography>
                    </Card>
                    <Card style={styles.statCard}>
                        <Target color={themeColors.primary} size={20} />
                        <Typography variant="xl" weight="bold">{sessionCount}/5</Typography>
                        <Typography variant="xs" color={themeColors.textSecondary}>Daily Limit</Typography>
                    </Card>
                </View>

                {isPremium && (
                    <Button
                        variant="outline"
                        title="View Weekly Analytics"
                        onPress={() => onNavigate('WeeklySummary')}
                        style={{ marginBottom: 20 }}
                    />
                )}

                {tasks.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Typography variant="lg" weight="medium" style={styles.emptyTitle}>
                            What are we executing today?
                        </Typography>
                        <TextInput
                            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                            placeholder="Enter your main goal..."
                            placeholderTextColor={themeColors.textSecondary}
                            value={goalInput}
                            onChangeText={setGoalInput}
                            multiline
                        />
                        {isLoading ? (
                            <ActivityIndicator color={themeColors.primary} style={{ marginTop: 20 }} />
                        ) : (
                            <Button
                                title="Generate Execution Plan"
                                onPress={handleGenerateTasks}
                                style={styles.generateBtn}
                            />
                        )}
                    </View>
                ) : (
                    <View style={styles.taskList}>
                        {strategicAssessment && (
                            <Card style={[styles.assessmentCard, { borderColor: themeColors.primary }]} bordered>
                                <View style={styles.assessmentHeader}>
                                    <Zap color={themeColors.primary} size={16} />
                                    <Typography variant="xs" weight="bold" color={themeColors.primary} style={{ marginLeft: 6 }}>
                                        AI STRATEGIC ASSESSMENT
                                    </Typography>
                                </View>
                                <Typography variant="sm" italic style={{ marginTop: 4 }}>
                                    "{strategicAssessment}"
                                </Typography>
                            </Card>
                        )}

                        <Typography variant="lg" weight="bold" style={styles.sectionTitle}>
                            Daily Execution Blocks
                        </Typography>
                        {tasks.map((task) => (
                            <TouchableOpacity
                                key={task.id}
                                disabled={task.completed}
                                onPress={() => onNavigate('Timer', { task })}
                                activeOpacity={0.7}
                            >
                                <Card style={styles.taskCard} bordered={task.completed}>
                                    <View style={styles.taskContent}>
                                        <View style={{ flex: 1 }}>
                                            <Typography variant="md" weight="bold" style={{ textDecorationLine: task.completed ? 'line-through' : 'none' }}>
                                                {task.title}
                                            </Typography>
                                            <Typography variant="sm" color={themeColors.textSecondary}>
                                                {task.description}
                                            </Typography>
                                        </View>
                                        {!task.completed && (
                                            <ArrowRight color={themeColors.primary} size={24} />
                                        )}
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        ))}
                        <Button
                            variant="outline"
                            title="New Plan"
                            onPress={() => {
                                setTasks([]);
                                setStrategicAssessment('');
                            }}
                            style={{ marginTop: 20 }}
                        />
                    </View>
                )}
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
    scrollContent: {
        paddingBottom: theme.spacing.xxl,
    },
    statsRow: {
        flexDirection: 'row',
        gap: theme.spacing.md,
        marginBottom: theme.spacing.xl,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    emptyState: {
        marginTop: theme.spacing.xl,
    },
    emptyTitle: {
        marginBottom: theme.spacing.md,
    },
    input: {
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        minHeight: 100,
        textAlignVertical: 'top',
        fontSize: 16,
        marginBottom: theme.spacing.md,
    },
    generateBtn: {
        marginTop: theme.spacing.md,
    },
    taskList: {
        gap: theme.spacing.md,
    },
    sectionTitle: {
        marginBottom: theme.spacing.sm,
    },
    taskCard: {
        marginBottom: theme.spacing.sm,
        padding: theme.spacing.lg,
    },
    taskContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    assessmentCard: {
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.md,
        backgroundColor: 'rgba(110, 86, 255, 0.05)', // Subtle primary tint
        borderStyle: 'dashed',
    },
    assessmentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
});
