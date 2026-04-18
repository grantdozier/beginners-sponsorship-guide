import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, Divider, OrangeLabel } from '../components/SectionCard';
import { ProblemDiagram, SolutionDiagram } from '../components/diagrams';
import { COLORS } from '../data/content';

export default function ProblemSolutionScreen() {
  const { width } = Dimensions.get('window');
  const diagramWidth = Math.min(width - 40, 360);

  return (
    <ScreenWrapper>
      <SectionHeader title="Problem & Solution" subtitle="Core AA diagrams" />

      {/* THE PROBLEM */}
      <Card>
        <View style={styles.diagramContainer}>
          <ProblemDiagram width={diagramWidth} />
        </View>
        <Divider />
        <Text style={styles.sideNote}>
          <Text style={styles.bold}>Self-Will RUN RIOT =</Text> Uncontrollable, wild behavior that
          creates <Text style={styles.bold}>CHAOS.</Text> (Pg. 62 line 16)
        </Text>
        <Divider />
        <Text style={styles.heading}>Three Areas Affected</Text>
        {[
          { label: 'BODY', detail: 'Physical Defect = ALLERGY — Phenomenon of Craving — Compulsion' },
          { label: 'MIND', detail: 'Mental Defect = OBSESSION — Delusion' },
          { label: 'WILL', detail: 'Spiritual Defect = UNMANAGEABILITY — Selfishness / Self-centeredness — Spiritual Malady' },
        ].map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemDetail}>{item.detail}</Text>
          </View>
        ))}
      </Card>

      {/* THE SOLUTION */}
      <Card>
        <View style={styles.diagramContainer}>
          <SolutionDiagram width={diagramWidth} />
        </View>
        <Divider />
        <Text style={styles.heading}>Three Legacies</Text>
        {[
          { label: '12 Steps (1939)', detail: 'Recovery — working the steps to achieve sobriety' },
          { label: '12 Traditions (1950)', detail: 'Unity — how groups work together in AA' },
          { label: '12 Concepts (1955)', detail: 'Service — how AA serves the alcoholic who still suffers' },
        ].map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemLabel}>{item.label}</Text>
            <Text style={styles.itemDetail}>{item.detail}</Text>
          </View>
        ))}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  diagramContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  sideNote: {
    fontSize: 13,
    color: COLORS.darkGray,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.black,
    fontStyle: 'normal',
  },
  heading: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.orangeDark,
    marginBottom: 12,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  itemRow: {
    marginBottom: 14,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
  },
  itemLabel: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 14,
    color: COLORS.orangeDark,
    marginBottom: 3,
    letterSpacing: 1,
  },
  itemDetail: {
    fontSize: 14,
    color: COLORS.inkDark,
    lineHeight: 21,
  },
});
