import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { COLORS } from '../../data/content';

function Flourish() {
  return (
    <Svg width={110} height={12} viewBox="0 0 110 12">
      <Line x1="0" y1="6" x2="42" y2="6" stroke={COLORS.orange} strokeWidth="1" />
      <Circle cx="50" cy="6" r="1.8" fill={COLORS.orange} />
      <Circle cx="55" cy="6" r="2.6" fill={COLORS.orange} />
      <Circle cx="60" cy="6" r="1.8" fill={COLORS.orange} />
      <Line x1="68" y1="6" x2="110" y2="6" stroke={COLORS.orange} strokeWidth="1" />
    </Svg>
  );
}

export default function DiagramBanner({ title, width = 320 }) {
  return (
    <View style={[styles.container, { width }]}>
      <Text style={styles.title}>{title}</Text>
      <Flourish />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 26,
    color: COLORS.inkDark,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
});
