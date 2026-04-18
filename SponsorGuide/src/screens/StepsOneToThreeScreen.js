import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel } from '../components/SectionCard';
import { COLORS } from '../data/content';

export default function StepsOneToThreeScreen({ navigation }) {
  const stepCards = [
    {
      number: 1,
      title: 'Step One',
      subtitle: 'SURRENDER — Defeat & Acceptance',
      theme: '"We admitted we were powerless over alcohol — that our lives had become unmanageable."',
      stepIndex: 0,
    },
    {
      number: 2,
      title: 'Step Two',
      subtitle: 'CHOICE ABOUT POWER',
      theme: '"Came to believe that a Power greater than ourselves could restore us to sanity."',
      stepIndex: 1,
    },
    {
      number: 3,
      title: 'Step Three',
      subtitle: 'DECISION FOR POWER',
      theme: '"Made a decision to turn our will and our lives over to the care of God as we understood Him."',
      stepIndex: 2,
    },
  ];

  return (
    <ScreenWrapper>
      <SectionHeader title="Steps 1 – 3" subtitle="Surrender — Defeat, Choice & Decision" />

      <Card>
        <Text style={styles.intro}>
          Steps 1, 2, and 3 are the foundation of recovery. They deal with surrender — admitting
          powerlessness (Step 1), coming to believe in a Higher Power (Step 2), and making the
          decision to turn our will over (Step 3).
        </Text>
      </Card>

      {stepCards.map((step) => (
        <TouchableOpacity
          key={step.number}
          style={styles.stepCard}
          onPress={() => navigation.navigate('Step', { stepIndex: step.stepIndex })}
          activeOpacity={0.75}
        >
          <View style={styles.stepNumber}>
            <Text style={styles.stepNumberText}>{step.number}</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            <Text style={styles.stepTheme}>{step.theme}</Text>
          </View>
          <Text style={styles.stepArrow}>›</Text>
        </TouchableOpacity>
      ))}

      <Card>
        <OrangeLabel text="REMEMBER" />
        <Text style={styles.reminder}>
          Discuss the corresponding illustrations to steps 1-3 with your sponsee. Have them follow
          along in their Big Book as you read the line numbers from the passages sheet.
        </Text>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  intro: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumber: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: COLORS.orange,
    backgroundColor: '#FDF4E7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    marginTop: 2,
  },
  stepNumberText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 20,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 18,
    color: COLORS.inkDark,
  },
  stepSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.orange,
    marginTop: 3,
  },
  stepTheme: {
    fontSize: 13,
    color: COLORS.darkGray,
    fontStyle: 'italic',
    marginTop: 6,
    lineHeight: 19,
  },
  stepArrow: {
    fontSize: 24,
    color: COLORS.mediumGray,
    marginLeft: 8,
    marginTop: 8,
  },
  reminder: {
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 22,
  },
});
