import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore, DailyTask } from '../store/useStore';
import { AIService } from '../services/xai';
import { CheckCircle2 } from 'lucide-react-native';

export const Reflection: React.FC<{ route: { params: { task: DailyTask } }, onNavigate: (screen: string, params?: any) => void }> = ({ route, onNavigate }) => {
    const { task } = route.params;
    const [reflection, setReflection] = useState('');
    const [aiQuestion, setAiQuestion] = useState('How was your session?');
    const [isLoading, setIsLoading] = useState(true);

    const completeTask = useStore((state) => state.completeTask);
    const darkMode = useStore((state) => state.darkMode);
    const themeColors = darkMode ? theme.colors.dark : theme.colors.light;

    useEffect(() => {
        const fetchQuestion = async () => {
            const question = await AIService.generateReflection(task.title);
            setAiQuestion(question);
            setIsLoading(false);
        };
        fetchQuestion();
    }, []);

    const handleFinish = () => {
        completeTask(task.id, 25);
        onNavigate('Dashboard');
    };

    return (
        <Layout style={styles.container}>
            <View style={styles.header}>
                <CheckCircle2 color={themeColors.success} size={64} style={{ marginBottom: 16 }} />
                <Typography variant="huge" weight="bold">Execution Complete</Typography>
                <Typography variant="md" color={themeColors.textSecondary}>You just finished {task.title}</Typography>
            </View>

            <View style={styles.content}>
                {isLoading ? (
                    <ActivityIndicator color={themeColors.primary} />
                ) : (
                    <>
                        <Typography variant="lg" weight="medium" style={styles.question}>
                            {aiQuestion}
                        </Typography>
                        <TextInput
                            style={[styles.input, { color: themeColors.text, borderColor: themeColors.border }]}
                            placeholder="Reflect on your progress..."
                            placeholderTextColor={themeColors.textSecondary}
                            value={reflection}
                            onChangeText={setReflection}
                            multiline
                        />
                    </>
                )}
            </View>

            <View style={styles.footer}>
                <Button title="Save & Finish" onPress={handleFinish} />
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
        marginTop: theme.spacing.lg,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    question: {
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        minHeight: 120,
        textAlignVertical: 'top',
        fontSize: 16,
    },
    footer: {
        marginTop: theme.spacing.xl,
    },
});
