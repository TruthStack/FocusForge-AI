import React, { useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Layout } from '../components/Layout';
import { Typography } from '../components/Typography';
import { Button } from '../components/Button';
import { theme } from '../theme';
import { useStore } from '../store/useStore';

import { TouchableOpacity } from 'react-native';

const STEPS = [
    {
        title: 'FocusForge AI',
        description: 'The first AI-Powered minimalist execution OS built specifically for creator workflows.',
    },
    {
        title: 'Simon @ Better Creating',
        description: 'Designed for minimalist productivity fans, Notion users, and solopreneurs who hate bloat.',
    },
    {
        title: 'Your Identity',
        description: 'What kind of creator are you? We will personalize your AI coach.',
    },
    {
        title: 'Start Executing',
        description: 'Break goals into 25-minute execution blocks. No fluff. Just progress.',
    },
];

const IDENTITIES = ['Solopreneur', 'Writer', 'Designer', 'Developer', 'Youtuber', 'General Creator'];

export const Onboarding: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const { setOnboardingComplete, creatorIdentity, setCreatorIdentity } = useStore();

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            setOnboardingComplete(true);
        }
    };

    return (
        <Layout style={styles.container}>
            <View style={styles.content}>
                <View style={styles.indicatorContainer}>
                    {STEPS.map((_, i) => (
                        <View
                            key={i}
                            style={[
                                styles.indicator,
                                i === currentStep && styles.activeIndicator
                            ]}
                        />
                    ))}
                </View>

                <View style={styles.textContainer}>
                    <Typography variant="huge" weight="bold" style={styles.title}>
                        {STEPS[currentStep].title}
                    </Typography>
                    <Typography variant="lg" color={theme.colors.light.secondary} style={styles.description}>
                        {STEPS[currentStep].description}
                    </Typography>
                </View>

                {currentStep === 2 && (
                    <View style={styles.identityGrid}>
                        {IDENTITIES.map((id) => (
                            <TouchableOpacity
                                key={id}
                                style={[
                                    styles.identityBtn,
                                    creatorIdentity === id && styles.activeIdentityBtn
                                ]}
                                onPress={() => setCreatorIdentity(id)}
                            >
                                <Typography
                                    color={creatorIdentity === id ? '#FFF' : theme.colors.light.text}
                                    weight={creatorIdentity === id ? 'bold' : 'regular'}
                                >
                                    {id}
                                </Typography>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}

                <View style={styles.footer}>
                    <Button
                        title={currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
                        onPress={handleNext}
                    />
                </View>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingBottom: theme.spacing.xl,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    indicatorContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.xxl,
    },
    indicator: {
        height: 4,
        width: 20,
        backgroundColor: '#E0E0E0',
        marginHorizontal: 4,
        borderRadius: 2,
    },
    activeIndicator: {
        backgroundColor: '#000000',
        width: 40,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    title: {
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: theme.spacing.lg,
    },
    footer: {
        width: '100%',
        paddingHorizontal: theme.spacing.md,
        position: 'absolute',
        bottom: 0,
    },
    identityGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        marginTop: -theme.spacing.lg,
        marginBottom: theme.spacing.xxl,
    },
    identityBtn: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.light.border,
    },
    activeIdentityBtn: {
        backgroundColor: theme.colors.light.primary,
        borderColor: theme.colors.light.primary,
    },
});
