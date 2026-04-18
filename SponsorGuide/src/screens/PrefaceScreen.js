import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenWrapper from '../components/ScreenWrapper';
import { SectionHeader, Card } from '../components/SectionCard';
import { preface, COLORS } from '../data/content';

export default function PrefaceScreen() {
  const paragraphs = preface.split('\n\n').filter(p => p.trim());

  return (
    <ScreenWrapper>
      <SectionHeader title="Preface" subtitle="About this guide" />
      <Card>
        {paragraphs.map((para, i) => (
          <Text key={i} style={[styles.paragraph, i > 0 && styles.paragraphSpaced]}>
            {para}
          </Text>
        ))}
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 15,
    color: '#1A1A1A',
    lineHeight: 24,
  },
  paragraphSpaced: {
    marginTop: 16,
  },
});
