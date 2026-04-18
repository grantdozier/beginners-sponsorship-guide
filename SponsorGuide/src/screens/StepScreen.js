import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card, Divider, OrangeLabel } from '../components/SectionCard';
import { steps, COLORS } from '../data/content';

export default function StepScreen({ route }) {
  const { stepIndex = 0 } = route.params || {};
  const step = steps[stepIndex];

  const paragraphs = step.content.split('\n\n').filter(p => p.trim());

  return (
    <ScreenWrapper>
      <SectionHeader title={step.title} subtitle={step.subtitle} />

      {step.diagram && (
        <Card>
          <OrangeLabel text="DIAGRAM" />
          <Text style={styles.diagramTitle}>{step.diagram.title}</Text>
          {step.diagram.description && (
            <Text style={styles.diagramDesc}>{step.diagram.description}</Text>
          )}
          {step.diagram.points && step.diagram.points.map((pt, i) => (
            <View key={i} style={styles.diagramPoint}>
              <View style={styles.diagramBadge}>
                <Text style={styles.diagramBadgeText}>{pt.label}</Text>
              </View>
              <Text style={styles.diagramDetail}>{pt.detail}</Text>
            </View>
          ))}
        </Card>
      )}

      <Card>
        <OrangeLabel text="INSTRUCTIONS" />
        {paragraphs.map((para, i) => {
          const isHeader = para === para.toUpperCase() && para.length < 60;
          const isSubHeader = /^[A-Z][A-Z\s&]+:/.test(para) || /^Step \d+:/.test(para);

          if (isSubHeader || para.startsWith('Step')) {
            return (
              <View key={i} style={i > 0 ? styles.sectionBreak : null}>
                <Text style={styles.subHeader}>{para}</Text>
              </View>
            );
          }

          return (
            <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpaced]}>
              {para}
            </Text>
          );
        })}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  diagramTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 6,
  },
  diagramDesc: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  diagramPoint: {
    marginBottom: 12,
    paddingLeft: 14,
    borderLeftWidth: 2,
    borderLeftColor: COLORS.orange,
  },
  diagramBadge: {
    alignSelf: 'flex-start',
    marginBottom: 3,
  },
  diagramBadgeText: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: COLORS.orangeDark,
    fontSize: 13,
    letterSpacing: 1,
  },
  diagramDetail: {
    fontSize: 14,
    color: COLORS.inkDark,
    lineHeight: 21,
  },
  paragraph: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 24,
  },
  paragraphSpaced: {
    marginTop: 14,
  },
  subHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.orange,
    marginTop: 4,
  },
  sectionBreak: {
    marginTop: 14,
  },
});
