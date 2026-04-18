import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, OrangeLabel, Divider } from '../components/SectionCard';
import { steps, COLORS } from '../data/content';
import {
  StepOneDiagram,
  StepTwoDiagram,
  StepThreeDiagram,
  SpiritualArchDiagram,
  StepTenDiagram,
} from '../components/diagrams';

// Map step number → diagram component
const DIAGRAMS = {
  1: StepOneDiagram,
  2: StepTwoDiagram,
  3: StepThreeDiagram,
  6: SpiritualArchDiagram, // Steps 6 & 7 use the Spiritual Arch
  10: StepTenDiagram,
};

export default function GenericStepScreen({ route }) {
  const { stepIndex = 0 } = route?.params || {};
  const step = steps[stepIndex] || steps[0];
  const { width } = Dimensions.get('window');
  const diagramWidth = Math.min(width - 40, 360);

  const DiagramComponent = DIAGRAMS[step.number];
  const paragraphs = step.content.split('\n\n').filter(p => p.trim());

  return (
    <ScreenWrapper>
      <SectionHeader title={step.title} subtitle={step.theme} />

      {DiagramComponent && (
        <Card>
          <OrangeLabel text="ILLUSTRATION" />
          <View style={styles.diagramContainer}>
            <DiagramComponent width={diagramWidth} />
          </View>
        </Card>
      )}

      <Card>
        <OrangeLabel text="FULL INSTRUCTIONS" />
        {paragraphs.map((para, i) => {
          const isStepDeclaration = para.startsWith('Step ') && para.includes('"');
          const isAllCaps = para === para.toUpperCase() && para.length > 5 && para.length < 80;

          return (
            <Text
              key={i}
              style={[
                styles.paragraph,
                i > 0 && styles.paragraphSpaced,
                (isAllCaps || isStepDeclaration) && styles.heading,
              ]}
            >
              {para}
            </Text>
          );
        })}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  diagramContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 24,
  },
  paragraphSpaced: {
    marginTop: 14,
  },
  heading: {
    fontWeight: '700',
    color: COLORS.orange,
    fontSize: 15,
  },
});
