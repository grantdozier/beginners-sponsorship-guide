import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Defs, LinearGradient, Stop, Path, Rect, Circle } from 'react-native-svg';
import { COLORS } from '../data/content';

const scriptFont = 'GreatVibes_400Regular';
const serifFont = 'PlayfairDisplay_400Regular_Italic';

function OrangeWaveDivider({ width }) {
  const height = 60;
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <Defs>
        <LinearGradient id="waveGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#F5C08A" />
          <Stop offset="0.3" stopColor="#E8871E" />
          <Stop offset="0.6" stopColor="#D96A10" />
          <Stop offset="1" stopColor="#F0A050" />
        </LinearGradient>
      </Defs>
      <Path
        d={`M0,18
            Q${width * 0.15},0 ${width * 0.3},14
            Q${width * 0.5},30 ${width * 0.7},12
            Q${width * 0.85},0 ${width},16
            L${width},44
            Q${width * 0.85},60 ${width * 0.7},46
            Q${width * 0.5},30 ${width * 0.3},48
            Q${width * 0.15},60 0,42
            Z`}
        fill="url(#waveGrad)"
      />
    </Svg>
  );
}

function CheckIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20">
      <Rect x="1" y="1" width="18" height="18" rx="3" fill="#FFF4E8" stroke="#D97520" strokeWidth="1.5" />
      <Path
        d="M5 10.5 L8.5 14 L15 6.5"
        stroke="#D97520"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export default function CoverHero({ width }) {
  return (
    <View style={styles.container}>
      {/* ZONE 1: Title */}
      <View style={styles.titleZone}>
        <Text style={styles.titleScript}>Beginners</Text>
        <Text style={styles.titleMain}>Sponsorship Guide</Text>
      </View>

      {/* Decorative wave divider — no text on it */}
      <OrangeWaveDivider width={width} />

      {/* ZONE 2: Feature checklist — clean white background */}
      <View style={styles.featureZone}>
        {['Instructions', 'Illustrations', 'Worksheets'].map((label, i) => (
          <View key={label} style={[styles.featurePill, i > 0 && { marginLeft: 8 }]}>
            <CheckIcon />
            <Text style={styles.featureText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* ZONE 3: Tagline */}
      <View style={styles.taglineZone}>
        <Text style={styles.tagline}>
          For someone <Text style={styles.taglineBold}>"New"</Text> who has completed
          all 12 steps and needs guidance taking a sponsee through the 12 steps.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFBF5',
  },

  /* ZONE 1 — Title */
  titleZone: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  titleScript: {
    fontFamily: scriptFont,
    fontSize: 64,
    color: '#1A1A1A',
    letterSpacing: 1,
    lineHeight: 72,
  },
  titleMain: {
    fontFamily: scriptFont,
    fontSize: 52,
    color: '#1A1A1A',
    marginTop: -6,
    letterSpacing: 0.5,
    lineHeight: 64,
  },

  /* ZONE 2 — Feature pills */
  featureZone: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  featurePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F0D4B0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  featureText: {
    fontFamily: serifFont,
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 6,
  },

  /* ZONE 3 — Tagline */
  taglineZone: {
    paddingHorizontal: 36,
    paddingTop: 8,
    paddingBottom: 28,
    alignItems: 'center',
  },
  tagline: {
    fontFamily: serifFont,
    fontSize: 15,
    color: '#3A2418',
    lineHeight: 24,
    textAlign: 'center',
  },
  taglineBold: {
    fontFamily: 'PlayfairDisplay_700Bold',
    color: '#1A1A1A',
  },
});
