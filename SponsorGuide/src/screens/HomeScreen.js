import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Line } from 'react-native-svg';
import ScreenWrapper from '../components/ScreenWrapper';
import CoverHero from '../components/CoverHero';
import NavCard from '../components/NavCard';
import { COLORS } from '../data/content';

/** Decorative horizontal divider between section groups */
function SectionDivider({ label }) {
  return (
    <View style={styles.divider}>
      <View style={styles.dividerLine} />
      <Text style={styles.dividerLabel}>{label}</Text>
      <View style={styles.dividerLine} />
    </View>
  );
}

const groups = [
  {
    label: 'The Foundation',
    items: [
      { number: 'I', title: 'Big Book Passages', subtitle: 'Reference guide for all 12 steps', screen: 'Passages', ornament: 'book' },
      { number: 'II', title: 'Preface', subtitle: 'About this guide', screen: 'Preface', ornament: 'quote' },
      { number: 'III', title: 'Problem & Solution', subtitle: 'Core AA diagrams', screen: 'ProblemSolution', ornament: 'triangleCircle' },
    ],
  },
  {
    label: 'Surrender',
    items: [
      { number: 'IV', title: 'Steps 1 – 3', subtitle: 'Diagrams & instructions', screen: 'StepsOneToThree', ornament: 'steps123' },
    ],
  },
  {
    label: 'Sharing',
    items: [
      { number: 'V', title: 'Step 4 Overview', subtitle: 'Inventory framework & diagrams', screen: 'Step4Overview', ornament: 'inventory' },
      { number: 'VI', title: 'Resentment Inventory', subtitle: 'Columns 1–4 with Mr. Brown example', screen: 'ResentmentInventory', ornament: 'scroll' },
      { number: 'VII', title: 'Fear Inventory', subtitle: 'Instructions, fears list & worksheet', screen: 'FearInventory', ornament: 'shield' },
      { number: 'VIII', title: 'Sex Conduct Inventory', subtitle: 'Instructions & future sex ideal', screen: 'SexInventory', ornament: 'hearts' },
      { number: 'IX', title: 'Steps 5, 6 & 7', subtitle: 'Into action — the spiritual arch', screen: 'Steps567', ornament: 'archway' },
      { number: 'X', title: 'Character Defects', subtitle: 'Complete reference list', screen: 'CharacterDefects', ornament: 'list' },
    ],
  },
  {
    label: 'Amends',
    items: [
      { number: 'XI', title: 'Steps 8 & 9', subtitle: 'Making it right', screen: 'Steps89', ornament: 'handshake' },
    ],
  },
  {
    label: 'Our Way of Life',
    items: [
      { number: 'XII', title: 'Step 10', subtitle: 'Daily inventory — emotional sobriety', screen: 'Step10', ornament: 'cycle' },
      { number: 'XIII', title: 'Step 11', subtitle: 'Morning meditation & evening review', screen: 'Step11', ornament: 'sun' },
      { number: 'XIV', title: 'Step 12', subtitle: 'Working with others', screen: 'Step12', ornament: 'heart' },
    ],
  },
  {
    label: 'Reference',
    items: [
      { number: '✦', title: 'Table of Contents', subtitle: 'Full guide index', screen: 'TableOfContents', ornament: 'index' },
      { number: '☼', title: 'Settings & Pairing', subtitle: 'Your name, sponsor/sponsee connections', screen: 'Settings', ornament: 'handshake' },
    ],
  },
];

export default function HomeScreen({ navigation }) {
  const { width } = Dimensions.get('window');

  return (
    <ScreenWrapper>
      <CoverHero width={width} />

      {groups.map((group, gi) => (
        <View key={gi}>
          <SectionDivider label={group.label} />
          {group.items.map((item, ii) => (
            <NavCard
              key={ii}
              number={item.number}
              title={item.title}
              subtitle={item.subtitle}
              ornament={item.ornament}
              onPress={() => navigation.navigate(item.screen)}
            />
          ))}
        </View>
      ))}

      <View style={styles.footer}>
        <View style={styles.footerOrnament}>
          <Svg width={60} height={10} viewBox="0 0 60 10">
            <Line x1="0" y1="5" x2="24" y2="5" stroke={COLORS.orange} strokeWidth="1" />
            <Line x1="36" y1="5" x2="60" y2="5" stroke={COLORS.orange} strokeWidth="1" />
          </Svg>
          <Text style={styles.footerOrnamentChar}>❦</Text>
        </View>
        <Text style={styles.footerText}>See ya in the trenches</Text>
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 26,
    marginBottom: 10,
    paddingHorizontal: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.orange,
    opacity: 0.35,
  },
  dividerLabel: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 13,
    color: COLORS.orangeDark,
    letterSpacing: 2,
    marginHorizontal: 14,
    textTransform: 'uppercase',
  },
  footer: {
    marginTop: 36,
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerOrnament: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  footerOrnamentChar: {
    position: 'absolute',
    fontSize: 14,
    color: COLORS.orange,
  },
  footerText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.orangeDark,
    letterSpacing: 1.5,
  },
});
