import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { COLORS } from '../data/content';

function HeaderOrnament() {
  return (
    <Svg width={90} height={10} viewBox="0 0 90 10" style={{ marginTop: 8 }}>
      <Line x1="0" y1="5" x2="36" y2="5" stroke={COLORS.orange} strokeWidth="1" />
      <Circle cx="45" cy="5" r="2" fill={COLORS.orange} />
      <Line x1="54" y1="5" x2="90" y2="5" stroke={COLORS.orange} strokeWidth="1" />
    </Svg>
  );
}

export function SectionHeader({ title, subtitle }) {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headerSubtitle}>{subtitle}</Text> : null}
      <HeaderOrnament />
    </View>
  );
}

export function Card({ children, style }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function NavCard({ title, subtitle, onPress, number }) {
  return (
    <TouchableOpacity style={styles.navCard} onPress={onPress} activeOpacity={0.75}>
      {number !== undefined && (
        <View style={styles.navNumber}>
          <Text style={styles.navNumberText}>{number}</Text>
        </View>
      )}
      <View style={styles.navContent}>
        <Text style={styles.navTitle}>{title}</Text>
        {subtitle ? <Text style={styles.navSubtitle}>{subtitle}</Text> : null}
      </View>
      <Text style={styles.navArrow}>›</Text>
    </TouchableOpacity>
  );
}

export function ContentBlock({ heading, body, bold }) {
  return (
    <View style={styles.contentBlock}>
      {heading ? (
        <Text style={[styles.contentHeading, bold && styles.contentHeadingBold]}>{heading}</Text>
      ) : null}
      <Text style={styles.contentBody}>{body}</Text>
    </View>
  );
}

export function BulletList({ items, title }) {
  return (
    <View style={styles.bulletContainer}>
      {title ? <Text style={styles.bulletTitle}>{title}</Text> : null}
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

export function Divider() {
  return <View style={styles.divider} />;
}

export function OrangeLabel({ text }) {
  return (
    <View style={styles.sectionLabel}>
      <View style={styles.sectionLabelRule} />
      <Text style={styles.sectionLabelText}>{text}</Text>
      <View style={styles.sectionLabelRule} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.cream,
    paddingHorizontal: 24,
    paddingTop: 4,
    paddingBottom: 8,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 24,
    color: COLORS.inkDark,
    letterSpacing: 0.2,
    textAlign: 'center',
    lineHeight: 30,
  },
  headerSubtitle: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 14,
    color: COLORS.orangeDark,
    marginTop: 6,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    padding: 16,
    shadowColor: '#7A4A20',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  navCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 10,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  navNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  navNumberText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
  },
  navContent: {
    flex: 1,
  },
  navTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.black,
  },
  navSubtitle: {
    fontSize: 13,
    color: COLORS.darkGray,
    marginTop: 2,
  },
  navArrow: {
    fontSize: 22,
    color: COLORS.mediumGray,
    marginLeft: 8,
  },
  contentBlock: {
    marginBottom: 16,
  },
  contentHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.orange,
    marginBottom: 6,
  },
  contentHeadingBold: {
    fontWeight: '700',
    fontSize: 17,
  },
  contentBody: {
    fontSize: 15,
    color: COLORS.black,
    lineHeight: 23,
  },
  bulletContainer: {
    marginBottom: 12,
  },
  bulletTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.darkGray,
    marginBottom: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingRight: 8,
  },
  bullet: {
    fontSize: 15,
    color: COLORS.orange,
    marginRight: 8,
    marginTop: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.black,
    lineHeight: 21,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: 16,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabelRule: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.orange,
    opacity: 0.4,
  },
  sectionLabelText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 12,
    color: COLORS.orangeDark,
    letterSpacing: 2.5,
    marginHorizontal: 12,
    textTransform: 'uppercase',
  },
});
